// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/utils/ReentrancyGuard.sol";

contract Market is ReentrancyGuard {
    enum OrderCreator {
        BUYER,
        SELLER
    }
    enum OrderStatus {
        OPEN,
        SETTLED,
        COMPLETED,
        CANCELLED
    }

    struct Order {
        OrderCreator creatorType;
        address creator;
        address joiner;
        uint256 projectTokenAmount; // Amount of project tokens the seller wants to sell
        uint256 collateralAmount; // Amount of collateral (buyer’s and seller’s)
        address collateralToken;
        uint256 settleTime; // When the order entered SETTLED state
        OrderStatus status;
        bool buyerWithdrawn;
        bool sellerWithdrawn;
    }

    IERC20 public immutable projectToken;
    uint256 public immutable platformFee;
    address[] public acceptedVTokens;
    uint256 public orderCount;
    uint256 public constant DECIMALS = 2;
    mapping(uint256 => Order) public orders;

    event OrderCreated(
        uint256 indexed orderId,
        OrderCreator creatorType,
        address indexed creator,
        uint256 projectTokenAmount,
        uint256 collateralAmount,
        address collateralToken
    );
    event OrderSettled(uint256 indexed orderId, address indexed joiner);
    event OrderCompleted(uint256 indexed orderId);
    event OrderCancelled(uint256 indexed orderId);
    event TokensWithdrawn(uint256 indexed orderId, address indexed party);

    /////////////////////////////////////////////////////////////////
    //////////////////////// CONTRACT ERRORS ///////////////////////
    ///////////////////////////////////////////////////////////////
    error IndexOutOfRange();
    error NotBuyer();
    error NotSeller();
    error NotAcceptedVToken();
    error InvalidTokenAmount();
    error OrderNotOpen();
    error OrderNotSettled();
    error CannotJoinOwnOrder();
    error SellerAlreadyWithdrawn();
    error BuyerAlreadyWithdrawn();
    error TimeElapsed();
    error TimeNotElapsed();

    constructor(
        address _projectToken,
        uint256 _platformFee,
        address[] memory _acceptedVTokens
    ) {
        projectToken = IERC20(_projectToken);
        platformFee = _platformFee;
        acceptedVTokens = _acceptedVTokens;
    }

    function createOrder(
        OrderCreator creatorType,
        uint256 projectTokenAmount,
        uint256 collateralAmount,
        address collateralToken
    )
        external
        nonReentrant
        onlyAcceptedVTokens(collateralToken)
        validTokenAmount(projectTokenAmount, collateralAmount)
        returns (uint256)
    {
        // Transfer creator's collateral to the contract
        IERC20(collateralToken).transferFrom(
            msg.sender,
            address(this),
            collateralAmount
        );

        uint256 orderId = orderCount++;
        orders[orderId] = Order({
            creatorType: creatorType,
            creator: msg.sender,
            joiner: address(0),
            projectTokenAmount: projectTokenAmount,
            collateralAmount: collateralAmount,
            collateralToken: collateralToken,
            settleTime: 0,
            status: OrderStatus.OPEN,
            buyerWithdrawn: false,
            sellerWithdrawn: false
        });

        emit OrderCreated(
            orderId,
            creatorType,
            msg.sender,
            projectTokenAmount,
            collateralAmount,
            collateralToken
        );

        return orderId;
    }

    function joinOrder(
        uint256 orderId
    )
        external
        nonReentrant
        onlyOpenOrder(orderId)
        onlyNotOrderOwner(orderId, msg.sender)
    {
        Order storage order = orders[orderId];

        // Transfer joiner's collateral
        IERC20(order.collateralToken).transferFrom(
            msg.sender,
            address(this),
            order.collateralAmount
        );

        order.joiner = msg.sender;
        order.settleTime = block.timestamp;
        order.status = OrderStatus.SETTLED;

        emit OrderSettled(orderId, msg.sender);
    }

    function completeTradeAsSeller(
        uint256 orderId
    )
        external
        onlySeller(orderId)
        nonReentrant
        onlySettleOrder(orderId)
        sellerNotWithdrawn(orderId)
        stillInSettleTime(orderId)
    {
        Order storage order = orders[orderId];

        address seller = order.creatorType == OrderCreator.SELLER
            ? order.creator
            : order.joiner;

        // Seller deposits project tokens
        require(
            projectToken.allowance(seller, address(this)) >=
                order.projectTokenAmount,
            "Trading token not approved"
        );
        require(
            projectToken.transferFrom(
                seller,
                address(this),
                order.projectTokenAmount
            ),
            "Project token transfer failed"
        );

        // Release both collaterals to the seller immediately after project token deposit
        IERC20(order.collateralToken).transfer(
            order.creatorType == OrderCreator.SELLER
                ? order.creator
                : order.joiner,
            order.collateralAmount * 2 // Buyer and seller collateral combined
        );

        // Now the seller’s project tokens are held by the contract
        order.sellerWithdrawn = true;

        emit TokensWithdrawn(orderId, msg.sender);
    }

    function completeTradeAsBuyer(
        uint256 orderId
    )
        external
        onlyBuyer(orderId)
        nonReentrant
        onlySettleOrder(orderId)
        buyerNotWithdrawn(orderId)
    {
        Order storage order = orders[orderId];

        address buyer = order.creatorType == OrderCreator.BUYER
            ? order.creator
            : order.joiner;

        // Release project tokens to the buyer
        require(
            projectToken.transfer(buyer, order.projectTokenAmount),
            "Project token transfer failed"
        );

        order.buyerWithdrawn = true;

        if (order.sellerWithdrawn) {
            order.status = OrderStatus.COMPLETED;
            emit OrderCompleted(orderId);
        }

        emit TokensWithdrawn(orderId, msg.sender);
    }

    function claimCollateralAfterExpiry(
        uint256 orderId
    )
        external
        nonReentrant
        onlySettleOrder(orderId)
        timeAlreadyElapsed(orderId)
        onlyBuyer(orderId)
    {
        Order storage order = orders[orderId];

        address buyer = order.creatorType == OrderCreator.BUYER
            ? order.creator
            : order.joiner;

        // If seller didn't deliver, buyer gets their collateral and the seller's collateral
        IERC20(order.collateralToken).transfer(
            buyer,
            order.collateralAmount * 2
        ); // Buyer + Seller collateral

        order.buyerWithdrawn = true;

        // Once buyer claims, the order is considered cancelled
        order.status = OrderStatus.CANCELLED;
        emit OrderCancelled(orderId);

        emit TokensWithdrawn(orderId, msg.sender);
    }

    function cancelOrder(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(
            order.status == OrderStatus.OPEN,
            "Only open orders can be cancelled"
        );
        require(msg.sender == order.creator, "Not order creator");

        // Return creator's collateral
        IERC20(order.collateralToken).transfer(
            order.creator,
            order.collateralAmount
        );

        order.status = OrderStatus.CANCELLED;
        emit OrderCancelled(orderId);
    }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////// REGULAR VIEW FUNCTIONS /////////////////////////
    ////////////////////////////////////////////////////////////////////////
    function getProjectToken() external view returns (address) {
        return address(projectToken);
    }

    function isAcceptedVToken(address token) public view returns (bool) {
        for (uint i = 0; i < acceptedVTokens.length; i++) {
            if (acceptedVTokens[i] == token) {
                return true;
            }
        }
        return false;
    }

    function getVTokenAtIndex(uint256 index) external view returns (address) {
        if (index >= acceptedVTokens.length) {
            revert IndexOutOfRange();
        }
        return acceptedVTokens[index];
    }

    function getAcceptedVTokens() external view returns (address[] memory) {
        return acceptedVTokens;
    }

    function getAcceptedVTokensCount() external view returns (uint256) {
        return acceptedVTokens.length;
    }

    function getPlatformFee() external view returns (uint256) {
        return platformFee;
    }

    function getOrder(
        uint256 orderId
    ) external view returns (Order memory order) {
        return orders[orderId];
    }

    function getOrdersCount() external view returns (uint256) {
        return orderCount;
    }

    //////////////////////////////////////////////////////////////////////////
    /////////////////////////////// MODIFIERS ///////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    modifier onlyBuyer(uint256 orderId) {
        Order storage order = orders[orderId];
        address buyer = order.creatorType == OrderCreator.BUYER
            ? order.creator
            : order.joiner;
        if (msg.sender != buyer) {
            revert NotBuyer();
        }
        _;
    }

    modifier onlySeller(uint256 orderId) {
        Order storage order = orders[orderId];
        address seller = order.creatorType == OrderCreator.SELLER
            ? order.creator
            : order.joiner;
        if (msg.sender != seller) {
            revert NotSeller();
        }
        _;
    }

    modifier onlyAcceptedVTokens(address collateralToken) {
        if (!isAcceptedVToken(collateralToken)) {
            revert NotAcceptedVToken();
        }
        _;
    }

    modifier validTokenAmount(
        uint256 projectTokenAmount,
        uint256 collateralAmount
    ) {
        if (projectTokenAmount == 0 || collateralAmount == 0) {
            revert InvalidTokenAmount();
        }
        _;
    }

    modifier onlyOpenOrder(uint256 orderId) {
        Order storage order = orders[orderId];
        if (order.status != OrderStatus.OPEN) {
            revert OrderNotOpen();
        }
        _;
    }

    modifier onlyNotOrderOwner(uint256 orderId, address sender) {
        Order storage order = orders[orderId];
        if (sender == order.creator) {
            revert CannotJoinOwnOrder();
        }
        _;
    }
    modifier onlySettleOrder(uint256 orderId) {
        Order storage order = orders[orderId];
        if (order.status != OrderStatus.SETTLED) {
            revert OrderNotSettled();
        }
        _;
    }

    modifier sellerNotWithdrawn(uint256 orderId) {
        Order storage order = orders[orderId];
        if (order.sellerWithdrawn) {
            revert SellerAlreadyWithdrawn();
        }
        _;
    }

    modifier buyerNotWithdrawn(uint256 orderId) {
        Order storage order = orders[orderId];
        if (order.buyerWithdrawn) {
            revert BuyerAlreadyWithdrawn();
        }
        _;
    }

    modifier stillInSettleTime(uint256 orderId) {
        Order storage order = orders[orderId];
        if (block.timestamp > order.settleTime + 24 hours) {
            revert TimeElapsed();
        }
        _;
    }

    modifier timeAlreadyElapsed(uint256 orderId) {
        Order storage order = orders[orderId];
        if (block.timestamp <= order.settleTime + 24 hours) {
            revert TimeNotElapsed();
        }
        _;
    }
}
