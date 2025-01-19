// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "../../shared/WhitelistShared.sol";
import "../../interfaces/IPolftRentFree.sol";
import "../../interfaces/ICurrency.sol";

// import "hardhat/console.sol";

contract PolftRentFree is
    ERC721Holder,
    ERC1155Receiver,
    ERC1155Holder,
    WhitelistShared,
    ReentrancyGuard,
    Context,
    IPolftRentFree
{
    uint32 public MAX_PERCENTAGE;
    uint32 public SECONDS_PER_DAY;
    uint32 public LIMIT_SECONDS_TO_CLAIM;
    uint32 public LIMIT_SECONDS_TO_RETURN;
    uint32 public rentFee; // 10000 is 100%
    uint256 private lendingId;
    uint256 private rentingId;
    address private _treasuryAddress;
    address private _currencyAddress;
    mapping(bytes32 => Lending) private lendings;
    mapping(bytes32 => Renting) private rentings;

    enum ERCType {
        ERC721,
        ERC1155
    }

    struct CallData {
        uint256 left;
        uint256 right;
        ERCType[] ercTypes;
        address[] nfts;
        uint256[] tokenIds;
        uint32[] lendAmounts;
        address[] contractERC20s;
        uint256[] dailyRentPrices;
        uint256[] lendingIds;
        uint256[] rentingIds;
        uint32[] rentAmounts;
        uint32[] rentDurations;
        uint32[] maxRentDurations;
        bool[] willAutoRenew;
    }

    struct Lending {
        ERCType ercType;
        address payable lenderAddress;
        uint256 dailyRentPrice;
        uint32 lendAmount;
        uint256 availableAmount;
        address contractERC20;
        uint32 maxRentDuration;
        bool willAutoRenew;
    }

    struct Renting {
        uint32 rentAmount;
        address payable renterAddress;
        uint32 rentDuration;
        uint32 rentedAt;
    }

    constructor(address _whitelistAddress) {
        _treasuryAddress = _msgSender();
        MAX_PERCENTAGE = 10000;
        SECONDS_PER_DAY = 86400;
        rentFee = 500; // 5%
        LIMIT_SECONDS_TO_CLAIM = 86400;
        LIMIT_SECONDS_TO_RETURN = 3600;
        _setWhitelistAddress(_whitelistAddress);
    }

    function getLending(
        address _nft,
        uint256 _tokenId,
        uint256 _lendingId
    )
        external
        view
        returns (uint8, address, uint32, uint256, uint32, uint256, address)
    {
        bytes32 lendId = keccak256(
            abi.encodePacked(_nft, _tokenId, _lendingId)
        );
        Lending storage lending = lendings[lendId];
        return (
            uint8(lending.ercType),
            address(lending.lenderAddress),
            lending.maxRentDuration,
            lending.dailyRentPrice,
            lending.lendAmount,
            lending.availableAmount,
            lending.contractERC20
        );
    }

    function getRenting(
        address _nft,
        uint256 _tokenId,
        uint256 _rentingId
    ) external view returns (address, uint32, uint32, uint32) {
        bytes32 rentId = keccak256(
            abi.encodePacked(_nft, _tokenId, _rentingId)
        );
        Renting storage renting = rentings[rentId];
        return (
            renting.renterAddress,
            renting.rentAmount,
            renting.rentDuration,
            renting.rentedAt
        );
    }

    function lend(
        ERCType[] memory _ercTypes,
        address[] memory _nfts,
        uint256[] memory _tokenIds,
        uint32[] memory _lendAmounts,
        uint256[] memory _dailyRentPrices,
        uint32[] memory _maxRentDurations,
        address[] memory _contractERC20s,
        bool[] memory _willAutoRenew
    ) external {
        bundleCall(
            handleLend,
            createLendCallData(
                _ercTypes,
                _nfts,
                _tokenIds,
                _lendAmounts,
                _dailyRentPrices,
                _maxRentDurations,
                _contractERC20s,
                _willAutoRenew
            )
        );
    }

    function stopLend(
        ERCType[] memory _ercTypes,
        address[] memory _nfts,
        uint256[] memory _tokenIds,
        uint256[] memory _lendingIds
    ) external {
        bundleCall(
            handleStopLend,
            createActionCallData(
                _ercTypes,
                _nfts,
                _tokenIds,
                _lendingIds,
                new uint256[](0)
            )
        );
    }

    function rent(
        ERCType[] memory _ercTypes,
        address[] memory _nfts,
        uint256[] memory _tokenIds,
        uint256[] memory _lendIds,
        uint32[] memory _rentDurations,
        uint32[] memory _rentAmounts
    ) external payable {
        bundleCall(
            handleRent,
            createRentCallData(
                _ercTypes,
                _nfts,
                _tokenIds,
                _lendIds,
                _rentDurations,
                _rentAmounts
            )
        );
    }

    function stopRent(
        ERCType[] memory _ercTypes,
        address[] memory _nfts,
        uint256[] memory _tokenIds,
        uint256[] memory _lendingIds,
        uint256[] memory _rentingIds
    ) external {
        bundleCall(
            handleStopRent,
            createActionCallData(
                _ercTypes,
                _nfts,
                _tokenIds,
                _lendingIds,
                _rentingIds
            )
        );
    }

    function claimRent(
        ERCType[] memory _ercTypes,
        address[] memory _nfts,
        uint256[] memory _tokenIds,
        uint256[] memory _lendingIds,
        uint256[] memory _rentingIds
    ) external {
        bundleCall(
            handleClaimRent,
            createActionCallData(
                _ercTypes,
                _nfts,
                _tokenIds,
                _lendingIds,
                _rentingIds
            )
        );
    }

    function setCurrencyAddress(address _address) external validateAdmin {
        _currencyAddress = _address;
    }

    function setTreasuryAddress(address _address) external validateAdmin {
        _treasuryAddress = _address;
    }

    function setWhitelistAddress(address _address) external validateAdmin {
        _setWhitelistAddress(_address);
    }
    
    function setRentFee(uint32 _rentFee) external validateAdmin {
        rentFee = _rentFee;
    }

    function setLimitClaimTime(uint32 _time) external validateAdmin {
        LIMIT_SECONDS_TO_CLAIM = _time;
    }

    function setLimitReturnTime(uint32 _time) external validateAdmin {
        LIMIT_SECONDS_TO_RETURN = _time;
    }

    function handleStopRent(CallData memory cd) private {
        for (uint256 i = cd.left; i < cd.right; i++) {
            bytes32 lendId = keccak256(
                abi.encodePacked(
                    cd.nfts[cd.left],
                    cd.tokenIds[i],
                    cd.lendingIds[i]
                )
            );
            bytes32 rentId = keccak256(
                abi.encodePacked(
                    cd.nfts[cd.left],
                    cd.tokenIds[i],
                    cd.rentingIds[i]
                )
            );
            Lending storage lending = lendings[lendId];
            Renting storage renting = rentings[rentId];
            ensureIsNotNull(lending);
            ensureIsNotNull(renting);
            ensureIsReturnable(renting, block.timestamp);
            require(
                cd.ercTypes[i] == lending.ercType,
                "PolftRentFree: invalid nft standard"
            );
            require(
                renting.rentAmount <= lending.lendAmount,
                "PolftRentFree: critical error"
            );
            uint256 secondsSinceRentStart = block.timestamp - renting.rentedAt;
            distributePayments(lending, renting, secondsSinceRentStart);
            manageWillAutoRenew(
                lending,
                renting,
                cd.nfts[cd.left],
                cd.ercTypes[cd.left],
                cd.tokenIds[i],
                cd.lendingIds[i]
            );

            emit StopRent(cd.rentingIds[i], uint32(block.timestamp));
            delete rentings[rentId];
        }
    }

    function handleClaimRent(CallData memory cd) private {
        for (uint256 i = cd.left; i < cd.right; i++) {
            bytes32 lendId = keccak256(
                abi.encodePacked(
                    cd.nfts[cd.left],
                    cd.tokenIds[i],
                    cd.lendingIds[i]
                )
            );
            bytes32 rentId = keccak256(
                abi.encodePacked(
                    cd.nfts[cd.left],
                    cd.tokenIds[i],
                    cd.rentingIds[i]
                )
            );
            Lending storage lending = lendings[lendId];
            Renting storage renting = rentings[rentId];
            ensureIsNotNull(lending);
            ensureIsNotNull(renting);
            ensureIsClaimable(renting, block.timestamp);
            distributeClaimPayment(lending, renting);
            manageWillAutoRenew(
                lending,
                renting,
                cd.nfts[cd.left],
                cd.ercTypes[cd.left],
                cd.tokenIds[i],
                cd.lendingIds[i]
            );
            emit RentClaimed(cd.rentingIds[i], uint32(block.timestamp));
            delete rentings[rentId];
        }
    }

    function handleStopLend(CallData memory cd) private {
        uint32[] memory lentAmounts = new uint32[](cd.right - cd.left);
        for (uint256 i = cd.left; i < cd.right; i++) {
            bytes32 lendId = keccak256(
                abi.encodePacked(
                    cd.nfts[cd.left],
                    cd.tokenIds[i],
                    cd.lendingIds[i]
                )
            );
            Lending storage lending = lendings[lendId];
            ensureIsNotNull(lending);
            ensureIsStoppable(lending, msg.sender);
            require(
                cd.ercTypes[i] == lending.ercType,
                "PolftRentFree: invalid nft standard"
            );
            require(
                lending.lendAmount == lending.availableAmount,
                "PolftRentFree: actively rented"
            );
            lentAmounts[i - cd.left] = lending.lendAmount;
            emit StopLend(
                cd.lendingIds[i],
                uint32(block.timestamp),
                lending.lendAmount
            );
            delete lendings[lendId];
        }
        safeTransfer(
            cd,
            address(this),
            msg.sender,
            sliceArr(cd.tokenIds, cd.left, cd.right, 0),
            sliceArrUint32(lentAmounts, cd.left, cd.right, cd.left)
        );
    }

    function handleLend(CallData memory cd) private {
        for (uint256 i = cd.left; i < cd.right; i++) {
            ensureIsLendable(cd, i);
            bytes32 lendId = keccak256(
                abi.encodePacked(cd.nfts[cd.left], cd.tokenIds[i], lendingId)
            );
            Lending storage lending = lendings[lendId];
            ensureIsNull(lending);

            bool _isERC721 = cd.ercTypes[i] == ERCType.ERC721;
            uint32 _lendAmount = uint32(cd.lendAmounts[i]);

            if (_isERC721) {
                require(
                    _lendAmount == 1,
                    "PolftRentFree: lendAmount should be equal to 1"
                );
                require(is721(cd.nfts[i]) == true, "PolftRentFree: not erc721 type");
            }
            else {
                require(is1155(cd.nfts[i]) == true, "PolftRentFree: not erc1155 type");
            }


            lendings[lendId] = Lending({
                ercType: cd.ercTypes[i],
                lenderAddress: payable(msg.sender),
                maxRentDuration: cd.maxRentDurations[i],
                dailyRentPrice: cd.dailyRentPrices[i],
                lendAmount: _lendAmount,
                availableAmount: _lendAmount,
                contractERC20: cd.contractERC20s[i],
                willAutoRenew: cd.willAutoRenew[i]
            });
            emit IPolftRentFree.Lend(
                _isERC721,
                msg.sender,
                cd.nfts[cd.left],
                cd.tokenIds[i],
                lendingId,
                cd.maxRentDurations[i],
                cd.dailyRentPrices[i],
                _lendAmount,
                cd.contractERC20s[i],
                cd.willAutoRenew[i]
            );
            lendingId++;
        }
        safeTransfer(
            cd,
            msg.sender,
            address(this),
            sliceArr(cd.tokenIds, cd.left, cd.right, 0),
            sliceArrUint32(cd.lendAmounts, cd.left, cd.right, 0)
        );
    }

    function handleRent(CallData memory cd) private {
        for (uint256 i = cd.left; i < cd.right; i++) {
            bytes32 _lendId = keccak256(
                abi.encodePacked(
                    cd.nfts[cd.left],
                    cd.tokenIds[i],
                    cd.lendingIds[i]
                )
            );
            bytes32 _rentId = keccak256(
                abi.encodePacked(
                    cd.nfts[cd.left],
                    cd.tokenIds[i],
                    rentingId
                )
            );

            Lending storage lending = lendings[_lendId];
            Renting storage renting = rentings[_rentId];

            ensureIsNotNull(lending);
            ensureIsNull(renting);
            ensureIsRentable(lending, cd, i, msg.sender);

            require(
                cd.ercTypes[i] == lending.ercType,
                "PolftRentFree: invalid nft standard"
            );
            require(
                cd.rentAmounts[i] <= lending.availableAmount,
                "PolftRentFree: invalid rent amount"
            );

            uint256 rentPrice = (cd.rentAmounts[i] *
                cd.rentDurations[i] *
                lending.dailyRentPrice) / SECONDS_PER_DAY;

            require(rentPrice > 0, "PolftRentFree: rent price is zero");

            bool success = IERC20(lending.contractERC20).transferFrom(
                msg.sender,
                address(this),
                rentPrice
            );
            require(success, "PolftRentFree: Transfer token failed");

            rentings[_rentId] = Renting({
                renterAddress: payable(msg.sender),
                rentAmount: uint32(cd.rentAmounts[i]),
                rentDuration: cd.rentDurations[i],
                rentedAt: uint32(block.timestamp)
            });

            lendings[_lendId].availableAmount -= uint32(cd.rentAmounts[i]);

            emit Rent(
                msg.sender,
                cd.lendingIds[i],
                rentingId,
                uint32(cd.rentAmounts[i]),
                cd.rentDurations[i],
                renting.rentedAt
            );
            rentingId++;
        }
    }

    function createLendCallData(
        ERCType[] memory _ercTypes,
        address[] memory _nfts,
        uint256[] memory _tokenIds,
        uint32[] memory _lendAmounts,
        uint256[] memory _dailyRentPrices,
        uint32[] memory _maxRentDurations,
        address[] memory _contractERC20s,
        bool[] memory _willAutoRenew
    ) private pure returns (CallData memory cd) {
        cd = CallData({
            left: 0,
            right: 1,
            ercTypes: _ercTypes,
            nfts: _nfts,
            tokenIds: _tokenIds,
            lendAmounts: _lendAmounts,
            lendingIds: new uint256[](0),
            rentingIds: new uint256[](0),
            rentDurations: new uint32[](0),
            rentAmounts: new uint32[](0),
            maxRentDurations: _maxRentDurations,
            dailyRentPrices: _dailyRentPrices,
            contractERC20s: _contractERC20s,
            willAutoRenew: _willAutoRenew
        });
    }

    function manageWillAutoRenew(
        Lending storage lending,
        Renting storage renting,
        address nft,
        ERCType ercType,
        uint256 tokenId,
        uint256 lendingId
    ) private {
        if (lending.willAutoRenew == false) {
            // No automatic renewal, stop the lending (or a portion of it) completely!

            // We must be careful here, because the lending might be for an ERC1155 token, which means
            // that the renting.rentAmount might not be the same as the lending.lendAmount. In this case, we
            // must NOT delete the lending, but only decrement the lending.lendAmount by the renting.rentAmount.
            // Notice: this is only possible for an ERC1155 tokens!
            if (lending.lendAmount > renting.rentAmount) {
                // update lending lendAmount to reflect NOT renewing the lending
                // Do not update lending.availableAmount, because the assets will not be lent out again
                lending.lendAmount -= renting.rentAmount;
                // return the assets to the lender
                IERC1155(nft).safeTransferFrom(
                    address(this),
                    lending.lenderAddress,
                    tokenId,
                    uint256(renting.rentAmount),
                    ""
                );
            }
            // If the lending is for an ERC721 token, then the renting.rentAmount is always the same as the
            // lending.lendAmount, and we can delete the lending. If the lending is for an ERC1155 token and
            // the renting.rentAmount is the same as the lending.lendAmount, then we can also delete the
            // lending.
            else if (lending.lendAmount == renting.rentAmount) {
                // return the assets to the lender
                if (ercType == ERCType.ERC721) {
                    IERC721(nft).transferFrom(
                        address(this),
                        lending.lenderAddress,
                        tokenId
                    );
                } else {
                    IERC1155(nft).safeTransferFrom(
                        address(this),
                        lending.lenderAddress,
                        tokenId,
                        uint256(renting.rentAmount),
                        ""
                    );
                }
                delete lendings[
                    keccak256(abi.encodePacked(nft, tokenId, lendingId))
                ];
            }
            // StopLend event but only the amount that was not renewed (or all of it)
            emit StopLend(
                lendingId,
                uint32(block.timestamp),
                renting.rentAmount
            );
        } else {
            // automatic renewal, make the assets available to be lent out again
            lending.availableAmount += renting.rentAmount;
        }
    }

    function takeFee(
        uint256 rentAmount,
        address token
    ) private returns (uint256 fee) {
        fee = rentAmount * rentFee;
        fee /= 10000;
        bool success = IERC20(token).transfer(_treasuryAddress, fee);
        require(success, "PolftRentFree: transfer token failed");
    }

    function distributePayments(
        Lending memory lending,
        Renting memory renting,
        uint256 secondsSinceRentStart
    ) private {
        uint256 rentPrice = renting.rentAmount * lending.dailyRentPrice;
        uint256 totalRenterPmt = (rentPrice * renting.rentDuration) /
            SECONDS_PER_DAY;
        uint256 sendLenderAmt = (secondsSinceRentStart * rentPrice) /
            SECONDS_PER_DAY;
        require(
            totalRenterPmt > 0,
            "PolftRentFree: total renter payment is zero"
        );
        require(sendLenderAmt > 0, "PolftRentFree: lender payment is zero");

        uint256 sendRenterAmt = 0;
        if (totalRenterPmt > sendLenderAmt) {
            sendRenterAmt = totalRenterPmt - sendLenderAmt;
        }

        if (rentFee != 0) {
            uint256 takenFee = takeFee(sendLenderAmt, lending.contractERC20);
            sendLenderAmt -= takenFee;
        }
        bool success = IERC20(lending.contractERC20).transfer(
            lending.lenderAddress,
            sendLenderAmt
        );
        require(success, "PolftRentFree: transfer money failed");

        if (sendRenterAmt > 0) {
            success = IERC20(lending.contractERC20).transfer(
                renting.renterAddress,
                sendRenterAmt
            );
            require(success, "PolftRentFree: transfer money failed");
        }
    }

    function distributeClaimPayment(
        Lending memory lending,
        Renting memory renting
    ) private {
        uint256 rentPrice = renting.rentAmount * lending.dailyRentPrice;
        uint256 finalAmt = rentPrice * renting.rentDuration / SECONDS_PER_DAY;
        uint256 takenFee = 0;
        if (rentFee != 0) {
            takenFee = takeFee(finalAmt, lending.contractERC20);
        }
        bool success = IERC20(lending.contractERC20).transfer(
            lending.lenderAddress,
            finalAmt - takenFee
        );
        require(success, "PolftRentFree: transfer money failed");
    }

    function createRentCallData(
        ERCType[] memory _ercTypes,
        address[] memory _nfts,
        uint256[] memory _tokenIds,
        uint256[] memory _lendIds,
        uint32[] memory _rentDurations,
        uint32[] memory _rentAmounts
    ) private pure returns (CallData memory cd) {
        cd = CallData({
            left: 0,
            right: 1,
            ercTypes: _ercTypes,
            nfts: _nfts,
            tokenIds: _tokenIds,
            lendingIds: _lendIds,
            rentingIds: new uint256[](0),
            lendAmounts: new uint32[](0),
            rentAmounts: _rentAmounts,
            rentDurations: _rentDurations,
            maxRentDurations: new uint32[](0),
            dailyRentPrices: new uint256[](0),
            contractERC20s: new address[](0),
            willAutoRenew: new bool[](0)
        });
    }

    function createActionCallData(
        ERCType[] memory _ercTypes,
        address[] memory _nfts,
        uint256[] memory _tokenIds,
        uint256[] memory _lendingIds,
        uint256[] memory _rentingIds
    ) private pure returns (CallData memory cd) {
        cd = CallData({
            left: 0,
            right: 1,
            ercTypes: _ercTypes,
            nfts: _nfts,
            tokenIds: _tokenIds,
            lendAmounts: new uint32[](0),
            lendingIds: _lendingIds,
            rentingIds: _rentingIds,
            rentDurations: new uint32[](0),
            rentAmounts: new uint32[](0),
            maxRentDurations: new uint32[](0),
            dailyRentPrices: new uint256[](0),
            contractERC20s: new address[](0),
            willAutoRenew: new bool[](0)
        });
    }

    function bundleCall(
        function(CallData memory) _handler,
        CallData memory _cd
    ) private {
        require(_cd.nfts.length > 0, "PolftRent: no nfts");
        while (_cd.right != _cd.nfts.length) {
            if (
                (_cd.nfts[_cd.left] == _cd.nfts[_cd.right]) &&
                (is1155(_cd.nfts[_cd.right]))
            ) {
                _cd.right++;
            } else {
                _handler(_cd);
                _cd.left = _cd.right;
                _cd.right++;
            }
        }
        _handler(_cd);
    }

    function is721(address _nft) private view returns (bool) {
        return
            IERC165(_nft).supportsInterface(
                type(IERC721).interfaceId
            );
    }

    function is1155(address _nft) private view returns (bool) {
        return
            IERC165(_nft).supportsInterface(
                type(IERC1155).interfaceId
            );
    }

    function safeTransfer(
        CallData memory _cd,
        address _from,
        address _to,
        uint256[] memory _tokenIds,
        uint32[] memory _lentAmounts
    ) private {
        if (is721(_cd.nfts[_cd.left])) {
            IERC721(_cd.nfts[_cd.left]).transferFrom(
                _from,
                _to,
                _cd.tokenIds[_cd.left]
            );
        } else if (is1155(_cd.nfts[_cd.left])) {
            IERC1155(_cd.nfts[_cd.left]).safeBatchTransferFrom(
                _from,
                _to,
                _tokenIds,
                convertUint32ArrayToUint256Array(_lentAmounts),
                "0x"
            );
        } else {
            revert("PolftRent: unsupported token type");
        }
    }

    function sliceArrUint32(
        uint32[] memory _arr,
        uint256 _fromIx,
        uint256 _toIx,
        uint256 _arrOffset
    ) private pure returns (uint32[] memory r) {
        r = new uint32[](_toIx - _fromIx);
        for (uint256 i = _fromIx; i < _toIx; i++) {
            r[i - _fromIx] = _arr[i - _arrOffset];
        }
    }

    function convertUint32ArrayToUint256Array(
        uint32[] memory _arr
    ) private pure returns (uint256[] memory r) {
        r = new uint256[](_arr.length);
        for (uint256 i = 0; i < _arr.length; i++) {
            r[i] = uint256(_arr[i]);
        }
    }

    function sliceArr(
        uint256[] memory _arr,
        uint256 _fromIx,
        uint256 _toIx,
        uint256 _arrOffset
    ) private pure returns (uint256[] memory r) {
        r = new uint256[](_toIx - _fromIx);
        for (uint256 i = _fromIx; i < _toIx; i++) {
            r[i - _fromIx] = _arr[i - _arrOffset];
        }
    }

    function ensureIsNotZeroAddr(address _addr) private pure {
        require(_addr != address(0), "PolftRent: zero address");
    }

    function ensureIsZeroAddr(address _addr) private pure {
        require(_addr == address(0), "PolftRent: not a zero address");
    }

    function ensureIsNull(Lending memory _lending) private pure {
        ensureIsZeroAddr(_lending.lenderAddress);
        require(_lending.maxRentDuration == 0, "PolftRent: duration not zero");
        require(_lending.dailyRentPrice == 0, "PolftRent: rent price not zero");
    }

    function ensureIsNotNull(Lending memory _lending) private pure {
        ensureIsNotZeroAddr(_lending.lenderAddress);
        require(_lending.maxRentDuration != 0, "PolftRent: duration zero");
        require(_lending.dailyRentPrice != 0, "PolftRent: rent price is zero");
    }

    function ensureIsNull(Renting memory _renting) private pure {
        ensureIsZeroAddr(_renting.renterAddress);
        require(_renting.rentDuration == 0, "PolftRent: duration not zero");
        require(_renting.rentedAt == 0, "PolftRent: rented at not zero");
    }

    function ensureIsNotNull(Renting memory _renting) private pure {
        ensureIsNotZeroAddr(_renting.renterAddress);
        require(_renting.rentDuration != 0, "PolftRent: duration is zero");
        require(_renting.rentedAt != 0, "PolftRent: rented at is zero");
    }

    function ensureIsLendable(CallData memory _cd, uint256 _i) private {
        require(_cd.lendAmounts[_i] > 0, "PolftRent: lend amount is zero");
        require(
            _cd.lendAmounts[_i] <= type(uint32).max,
            "PolftRent: not uint32"
        );
        require(_cd.maxRentDurations[_i] > 0, "PolftRent: duration is zero");
        require(
            _cd.maxRentDurations[_i] <= type(uint32).max,
            "PolftRent: not uint32"
        );
        require(
            uint32(_cd.dailyRentPrices[_i]) > 0,
            "PolftRent: rent price is zero"
        );
        require(
            ICurrency(_currencyAddress).currencyState(_cd.contractERC20s[_i]),
            "Not valid erc20 address"
        );
    }

    function ensureIsRentable(
        Lending memory lending,
        CallData memory cd,
        uint256 i,
        address msgSender
    ) private pure {
        require(
            msgSender != lending.lenderAddress,
            "PolftRentFree: cant rent own nft"
        );
        require(
            cd.rentDurations[i] <= type(uint32).max,
            "PolftRentFree: not uint8"
        );
        require(cd.rentDurations[i] > 0, "PolftRentFree: duration is zero");
        require(
            cd.rentAmounts[i] <= type(uint32).max,
            "PolftRentFree: not uint16"
        );
        require(cd.rentAmounts[i] > 0, "PolftRentFree: rentAmount is zero");
        require(
            cd.rentDurations[i] <= lending.maxRentDuration,
            "PolftRentFree: rent duration exceeds allowed max"
        );
    }

    function isPastReturnDate(
        Renting memory _renting,
        uint256 _now
    ) private pure returns (bool) {
        require(_now > _renting.rentedAt, "PolftRent: now before rented");
        return _now - _renting.rentedAt > _renting.rentDuration;
    }

    function isPastClaimCollateralDate(
        Renting memory _renting,
        uint256 _now
    ) private view returns (bool) {
        require(_now > _renting.rentedAt, "PolftRent: now before rented");
        return
            _now - _renting.rentedAt >
            _renting.rentDuration + LIMIT_SECONDS_TO_CLAIM;
    }

    function ensureIsStoppable(
        Lending memory lending,
        address msgSender
    ) private pure {
        require(lending.lenderAddress == msgSender, "PolftRentFree: not lender");
    }

    function ensureIsClaimable(
        Renting memory _renting,
        uint256 _blockTimestamp
    ) private view {
        require(
            isPastReturnDate(_renting, _blockTimestamp),
            "PolftRent: return date not passed"
        );
    }

    function ensureIsReturnable(
        Renting memory _renting,
        uint256 _blockTimestamp
    ) private view {
        require(_renting.renterAddress == _msgSender(), "PolftRent: not renter");
        require(
            !isPastReturnDate(_renting, _blockTimestamp),
            "PolftRent: not valid time to return nft"
        );
    }
}