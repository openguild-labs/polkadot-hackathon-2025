// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "../../interfaces/ICurrency.sol";
import "../../shared/WhitelistUpgradeable.sol";

contract CollectionOffer is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    ReentrancyGuardUpgradeable,
    WhitelistUpgradeable
{
    enum ContractType {
        ERC721,
        ERC1155
    }
    enum QOfferStatus {
        CREATED,
        ACCEPTED,
        CANCELED
    }
    struct Offer {
        address owner;
        address contractERC20;
        address contractaddress;
        ContractType contractType;
        uint256 amount;
        uint256 price;
        uint256 offerId;
        uint32 endTime;
        QOfferStatus status;
    }
    uint256 public constant FEE_PER_PRICE = 10;
    address private _currencyAddress;
    address private _treasuryAddress;

    // Price 2 indexpricez
    mapping(address => Offer[]) public collectionToOffer;
    mapping(address => uint256) public collectionToOfferId;
    mapping(address => mapping(uint256 => uint256)) public priceToAmount;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    event CreateQOffer(
        uint256 offerId,
        address owner,
        uint256 price,
        uint256 amount,
        address contractaddress,
        ContractType contractType,
        address contractERC20,
        uint32 endTime
    );
    event AcceptQOffer(
        uint256 offerId,
        address sender,
        address owner,
        uint256 price,
        uint256[] tokenId,
        uint256[] valueId,
        uint256 amounnt,
        address contractaddress,
        ContractType contractType,
        address contractERC20,
        uint32 endTime
    );
    event CancelQOffer(
        uint256 offerId,
        address owner,
        uint256 price,
        uint256 amount,
        address contractaddress,
        ContractType contractType,
        address contractERC20,
        uint32 endTime
    );
    event CurrentPrice(uint256 price, uint256 amountOffer);

    fallback() external payable {}

    function createQOffer(
        address _contractaddress,
        address _contractERC20,
        uint256 _price,
        uint256 _amount,
        uint32 _endTime
    ) external payable nonReentrant {
        ContractType contractType;
        if(_is721(_contractaddress)){
            contractType = ContractType.ERC721;
        } else if (_is1155(_contractaddress)){
            contractType = ContractType.ERC1155;
        } else {
            revert("Offer: not support contract");
        }
        require(_endTime > block.timestamp, "Offer : Error End Time");
        require(_amount != 0, "Offer : Error amount input");

        uint256 priceWithFee = (_price * _amount * (100 + FEE_PER_PRICE)) / 100;
        require(
            ICurrency(_currencyAddress).currencyState(_contractERC20) == true,
            "Offer: can not use this token address"
        );
        if (_contractERC20 == address(0)) {
            require(msg.value >= priceWithFee, "Offer: not enough tokens");
        }
        _transferERC20(
            _contractERC20,
            _msgSender(),
            address(this),
            priceWithFee
        );

        Offer memory newOffer = Offer(
            _msgSender(),
            _contractERC20,
            _contractaddress,
            contractType,
            _amount,
            _price,
            collectionToOfferId[_contractaddress],
            _endTime,
            QOfferStatus.CREATED
        );
        priceToAmount[_contractaddress][_price] += _amount;  
        collectionToOffer[_contractaddress].push(newOffer);

        emit CreateQOffer(
            collectionToOfferId[_contractaddress],
            _msgSender(),
            _price,
            _amount,
            _contractaddress,
             contractType,
            _contractERC20,
            _endTime
        );
        collectionToOfferId[_contractaddress] += 1;
    }

    function cancelQOffer(
        uint256 _offerId,
        address _contractaddress
    ) external nonReentrant {
        Offer storage offer = collectionToOffer[_contractaddress][_offerId];
        require(
            _offerId <= collectionToOfferId[_contractaddress],
            "invaild offer"
        );
        require(
            offer.status == QOfferStatus.CREATED,
            "Offer : this offer is not in create state"
        );
        require(
            offer.owner == _msgSender(),
            "Offer : You are not the owner of this offer"
        );
        uint256 priceWithFee = (offer.price *
            offer.amount *
            (100 + FEE_PER_PRICE)) / 100;
        if (offer.contractERC20 != address(0)) {
            IERC20Upgradeable(offer.contractERC20).approve(
                address(this),
                priceWithFee
            );
        }

        _transferERC20(
            offer.contractERC20,
            address(this),
            offer.owner,
            priceWithFee
        );
        offer.status = QOfferStatus.CANCELED;
        emit CancelQOffer(
            offer.offerId,
            _msgSender(),
            offer.price,
            offer.amount,
            offer.contractaddress,
            offer.contractType,
            offer.contractERC20,
            offer.endTime
        );
    }

    // input : offerId must be the Offer has currentPrice(maxPrice)
    function acceptQOffer(
        address _contractaddress,
        uint256[] memory _tokenId,
        uint256[] memory _valueId,
        uint256 _amount,
        uint256 _offerId,
        uint256 _currentPrice
    ) external nonReentrant {
        if (_is721(_contractaddress)) {
            require(
                _msgSender() ==
                    IERC721Upgradeable(_contractaddress).ownerOf(_tokenId[0]),
                "You are not the owner of this token !"
            );
            
        }
        if (_is1155(_contractaddress)) {
            require(
                IERC1155Upgradeable(_contractaddress).balanceOf(
                    _msgSender(),
                    _tokenId[0]
                ) > 0,
                "You are not the owner of this token !"
            );
        }

        Offer storage offer = collectionToOffer[_contractaddress][_offerId];

        require(offer.amount >= _amount, "Not enough offer's amount");
        require(
            offer.status == QOfferStatus.CREATED,
            "Offer: this offer is not in create state"
        );
        require(
            offer.price == _currentPrice,
            "Offer's price must be equal to current price"
        );
        require(offer.endTime > block.timestamp, "Offer expired");
        offer.status = QOfferStatus.ACCEPTED;
        uint256 priceWithFee = (offer.price * _amount * (100 + FEE_PER_PRICE)) /
            100;
        if (offer.contractERC20 != address(0)) {
            IERC20Upgradeable(offer.contractERC20).approve(
                address(this),
                priceWithFee
            );
        }
        _transferERC20(
            offer.contractERC20,
            address(this),
            _msgSender(),
            _currentPrice * _amount
        );
        _transferERC20(
            offer.contractERC20,
            address(this),
            _treasuryAddress,
            priceWithFee - offer.price * _amount
        );
        uint256 length = _tokenId.length;
        if (offer.contractType == ContractType.ERC721) {
            for (uint i = 0; i < length; ++i)
                IERC721Upgradeable(_contractaddress).safeTransferFrom(
                    _msgSender(),
                    offer.owner,
                    _tokenId[i],
                    "0x"
                );
        }
        if (offer.contractType == ContractType.ERC1155) {
            IERC1155Upgradeable(_contractaddress).safeBatchTransferFrom(
                _msgSender(),
                offer.owner,
                _tokenId,
                _valueId,
                "0x"
            );
        }

        collectionToOffer[_contractaddress][_offerId].amount =
            collectionToOffer[_contractaddress][_offerId].amount -
            priceToAmount[_contractaddress][_currentPrice];
        priceToAmount[_contractaddress][_currentPrice] -= _amount;
        emit AcceptQOffer(
            _offerId,
            _msgSender(),
            offer.owner,
            offer.price,
            _tokenId,
            _valueId,
            _amount,
            offer.contractaddress,
            offer.contractType,
            offer.contractERC20,
            offer.endTime
        );
    }

    function _transferERC20(
        address _contractERC20,
        address _from,
        address _to,
        uint256 _amount
    ) private {
        bool success;
        if (_contractERC20 == address(0)) {
            if (_to == address(this)) {
                success = true;
            } else {
                (success, ) = payable(_to).call{ value: _amount }("");
            }
        } else {
            success = IERC20Upgradeable(_contractERC20).transferFrom(
                _from,
                _to,
                _amount
            );
        }
        require(success, "Offer: Transfer ERC20 failed!");
    }

    function setCurrencyAddress(address _address) external validateAdmin {
        _currencyAddress = _address;
    }

    function setTreasuryAddress(address _address) external validateAdmin {
        _treasuryAddress = _address;
    }

    function _is1155(address _contract1155) private view returns (bool) {
        return
            IERC165Upgradeable(_contract1155).supportsInterface(
                type(IERC1155Upgradeable).interfaceId
            );
    }

    function _is721(address _contractNFT) private view returns (bool) {
        return
            IERC165Upgradeable(_contractNFT).supportsInterface(
                type(IERC721Upgradeable).interfaceId
            );
    }

    function initialize(address _whitelistAddress) public initializer {
        __Ownable_init();
        __WhitelistUpgradeable_init(_whitelistAddress);
        _treasuryAddress = _msgSender();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override validateAdmin {}
}
