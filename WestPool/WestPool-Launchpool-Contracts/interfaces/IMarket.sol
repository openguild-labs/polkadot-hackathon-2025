// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IMarket {
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
        uint256 projectTokenAmount;
        uint256 collateralAmount;
        address collateralToken;
        uint256 settleTime;
        OrderStatus status;
        bool buyerWithdrawn;
        bool sellerWithdrawn;
    }

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

    function createOrder(
        OrderCreator creatorType,
        uint256 projectTokenAmount,
        uint256 collateralAmount,
        address collateralToken
    ) external returns (uint256);

    function joinOrder(uint256 orderId) external;

    function completeTradeAsSeller(uint256 orderId) external;

    function completeTradeAsBuyer(uint256 orderId) external;

    function claimCollateralAfterExpiry(uint256 orderId) external;

    function cancelOrder(uint256 orderId) external;

    function getProjectToken() external view returns (address);

    function isAcceptedVToken(address token) external view returns (bool);

    function getVTokenAtIndex(uint256 index) external view returns (address);

    function getAcceptedVTokens() external view returns (address[] memory);

    function getAcceptedVTokensCount() external view returns (uint256);

    function getPlatformFee() external view returns (uint256);

    function getOrder(uint256 orderId) external view returns (Order memory);

    function getOrdersCount() external view returns (uint256);
}
