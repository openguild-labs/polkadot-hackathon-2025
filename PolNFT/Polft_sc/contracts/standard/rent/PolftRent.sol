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
import "../../interfaces/IPolftRent.sol";
import "../../interfaces/ICurrency.sol";

// import "hardhat/console.sol";

contract PolftRent is
    ERC721Holder,
    ERC1155Receiver,
    ERC1155Holder,
    WhitelistShared,
    ReentrancyGuard,
    Context,
    IPolftRent
{
    uint32 public MAX_PERCENTAGE;
    uint32 public SECONDS_PER_DAY;
    uint32 public LIMIT_SECONDS_TO_CLAIM;
    uint32 public LIMIT_SECONDS_TO_RETURN;
    uint32 public rentFee; // 10000 is 100%
    uint256 private lendingId;

    struct Lending {
        address payable lenderAddress;
        uint256 dailyRentPrice;
        uint256 nftPrice;
        uint32 maxRentDuration;
        uint32 lentAmount;
        address contractERC20;
    }

    struct Renting {
        address payable renterAddress;
        uint32 rentDuration;
        uint32 rentedAt;
    }

    struct LendingRenting {
        Lending lending;
        Renting renting;
    }

    mapping(bytes32 => LendingRenting) public lendingRenting;
    address private _currencyAddress;
    address private _treasuryAddress;

    struct CallData {
        uint256 left;
        uint256 right;
        address[] nfts;
        uint256[] tokenIds;
        uint256[] dailyRentPrices;
        uint256[] nftPrices;
        uint256[] lendingIds;
        uint32[] lendAmounts;
        uint32[] maxRentDurations;
        uint32[] rentDurations;
        address[] contractERC20s;
    }

    constructor(address _whitelistAddress) {
        _treasuryAddress = _msgSender();
        MAX_PERCENTAGE = 10000;
        SECONDS_PER_DAY = 86400;
        rentFee = 500; // 5%
        LIMIT_SECONDS_TO_CLAIM = 60;
        LIMIT_SECONDS_TO_RETURN = 60;
        _setWhitelistAddress(_whitelistAddress);
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

    function lend(
        address[] memory _nfts,
        uint256[] memory _tokenIds,
        uint32[] memory _lendAmounts,
        uint32[] memory _maxRentDurations,
        uint256[] memory _dailyRentPrices,
        uint256[] memory _nftPrices,
        address[] memory _contractERC20s
    ) external nonReentrant {
        bundleCall(
            handleLend,
            createLendCallData(
                _nfts,
                _tokenIds,
                _lendAmounts,
                _maxRentDurations,
                _dailyRentPrices,
                _nftPrices,
                _contractERC20s
            )
        );
    }

    function rent(
        address[] memory _nfts,
        uint256[] memory _tokenIds,
        uint256[] memory _lendingIds,
        uint32[] memory _rentDurations
    ) external nonReentrant {
        bundleCall(
            handleRent,
            createRentCallData(_nfts, _tokenIds, _lendingIds, _rentDurations)
        );
    }

    function claimCollateral(
        address[] memory _nfts,
        uint256[] memory _tokenIds,
        uint256[] memory _lendingIds
    ) external nonReentrant {
        bundleCall(
            handleClaimCollateral,
            createActionCallData(_nfts, _tokenIds, _lendingIds)
        );
    }

    function stopLending(
        address[] memory _nfts,
        uint256[] memory _tokenIds,
        uint256[] memory _lendingIds
    ) external nonReentrant {
        bundleCall(
            handleStopLending,
            createActionCallData(_nfts, _tokenIds, _lendingIds)
        );
    }

    function stopRenting(
        address[] memory _nfts,
        uint256[] memory _tokenIds,
        uint256[] memory _lendingIds
    ) external nonReentrant {
        bundleCall(
            handleReturn,
            createActionCallData(_nfts, _tokenIds, _lendingIds)
        );
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

    function handleLend(CallData memory _cd) private {
        for (uint256 i = _cd.left; i < _cd.right; i++) {
            ensureIsLendable(_cd, i);

            LendingRenting storage item = lendingRenting[
                keccak256(
                    abi.encodePacked(
                        _cd.nfts[_cd.left],
                        _cd.tokenIds[i],
                        lendingId
                    )
                )
            ];

            ensureIsNull(item.lending);
            ensureIsNull(item.renting);

            bool nftIs721 = is721(_cd.nfts[i]);

            if (nftIs721) {
                require(
                    _cd.lendAmounts[i] == 1,
                    "PolftRent: lent amount has to be one!"
                );
            }

            item.lending = Lending({
                lenderAddress: payable(_msgSender()),
                lentAmount: nftIs721 ? 1 : uint32(_cd.lendAmounts[i]),
                maxRentDuration: _cd.maxRentDurations[i],
                dailyRentPrice: _cd.dailyRentPrices[i],
                nftPrice: _cd.nftPrices[i],
                contractERC20: _cd.contractERC20s[i]
            });

            emit Lent(
                _cd.nfts[_cd.left],
                _cd.tokenIds[i],
                nftIs721 ? 1 : uint32(_cd.lendAmounts[i]),
                lendingId,
                _msgSender(),
                _cd.maxRentDurations[i],
                _cd.dailyRentPrices[i],
                _cd.nftPrices[i],
                nftIs721,
                _cd.contractERC20s[i]
            );

            lendingId++;
        }

        safeTransfer(
            _cd,
            _msgSender(),
            address(this),
            sliceArr(_cd.tokenIds, _cd.left, _cd.right, 0),
            sliceArrUint32(_cd.lendAmounts, _cd.left, _cd.right, 0)
        );
    }

    function handleRent(CallData memory _cd) private {
        bool success;
        uint32[] memory lendAmounts = new uint32[](_cd.right - _cd.left);

        for (uint256 i = _cd.left; i < _cd.right; i++) {
            LendingRenting storage item = lendingRenting[
                keccak256(
                    abi.encodePacked(
                        _cd.nfts[_cd.left],
                        _cd.tokenIds[i],
                        _cd.lendingIds[i]
                    )
                )
            ];

            ensureIsNotNull(item.lending);
            ensureIsNull(item.renting);
            ensureIsRentable(item.lending, _cd, i);

            {
                uint256 rentPrice = (_cd.rentDurations[i] *
                    item.lending.dailyRentPrice *
                    item.lending.lentAmount) / SECONDS_PER_DAY;
                uint256 nftPrice = item.lending.lentAmount *
                    item.lending.nftPrice;

                require(rentPrice > 0, "PolftRent: rent price is zero");
                require(nftPrice > 0, "PolftRent: nft price is zero");

                success = IERC20(item.lending.contractERC20).transferFrom(
                    _msgSender(),
                    address(this),
                    rentPrice + nftPrice
                );
                require(success, "PolftRent: transfer erc20 failed!");
            }

            lendAmounts[i - _cd.left] = item.lending.lentAmount;

            item.renting.renterAddress = payable(_msgSender());
            item.renting.rentDuration = _cd.rentDurations[i];
            item.renting.rentedAt = uint32(block.timestamp);

            emit Rent(
                _cd.lendingIds[i],
                _msgSender(),
                _cd.rentDurations[i],
                item.renting.rentedAt
            );
        }

        safeTransfer(
            _cd,
            address(this),
            _msgSender(),
            sliceArr(_cd.tokenIds, _cd.left, _cd.right, 0),
            sliceArrUint32(lendAmounts, _cd.left, _cd.right, _cd.left)
        );
    }

    function handleClaimCollateral(CallData memory _cd) private {
        for (uint256 i = _cd.left; i < _cd.right; i++) {
            LendingRenting storage item = lendingRenting[
                keccak256(
                    abi.encodePacked(
                        _cd.nfts[_cd.left],
                        _cd.tokenIds[i],
                        _cd.lendingIds[i]
                    )
                )
            ];

            ensureIsNotNull(item.lending);
            ensureIsNotNull(item.renting);
            ensureIsClaimable(item.renting, block.timestamp);

            distributeClaimPayment(item);

            emit CollateralClaimed(_cd.lendingIds[i], uint32(block.timestamp));

            delete item.lending;
            delete item.renting;
        }
    }

    function handleStopLending(CallData memory _cd) private {
        uint32[] memory lendAmounts = new uint32[](_cd.right - _cd.left);

        for (uint256 i = _cd.left; i < _cd.right; i++) {
            LendingRenting storage item = lendingRenting[
                keccak256(
                    abi.encodePacked(
                        _cd.nfts[_cd.left],
                        _cd.tokenIds[i],
                        _cd.lendingIds[i]
                    )
                )
            ];

            ensureIsNotNull(item.lending);
            ensureIsNull(item.renting);
            ensureIsStoppable(item.lending);

            lendAmounts[i - _cd.left] = item.lending.lentAmount;

            emit LendingStopped(_cd.lendingIds[i], uint32(block.timestamp));

            delete item.lending;
        }

        safeTransfer(
            _cd,
            address(this),
            msg.sender,
            sliceArr(_cd.tokenIds, _cd.left, _cd.right, 0),
            sliceArrUint32(lendAmounts, _cd.left, _cd.right, _cd.left)
        );
    }

    function createLendCallData(
        address[] memory _nfts,
        uint256[] memory _tokenIds,
        uint32[] memory _lendAmounts,
        uint32[] memory _maxRentDurations,
        uint256[] memory _dailyRentPrices,
        uint256[] memory _nftPrices,
        address[] memory _contractERC20s
    ) private pure returns (CallData memory cd) {
        cd = CallData({
            left: 0,
            right: 1,
            nfts: _nfts,
            tokenIds: _tokenIds,
            lendAmounts: _lendAmounts,
            lendingIds: new uint256[](0),
            rentDurations: new uint32[](0),
            maxRentDurations: _maxRentDurations,
            dailyRentPrices: _dailyRentPrices,
            nftPrices: _nftPrices,
            contractERC20s: _contractERC20s
        });
    }

    function createRentCallData(
        address[] memory _nfts,
        uint256[] memory _tokenIds,
        uint256[] memory _lendingIds,
        uint32[] memory _rentDurations
    ) private pure returns (CallData memory cd) {
        cd = CallData({
            left: 0,
            right: 1,
            nfts: _nfts,
            tokenIds: _tokenIds,
            lendAmounts: new uint32[](0),
            lendingIds: _lendingIds,
            rentDurations: _rentDurations,
            maxRentDurations: new uint32[](0),
            dailyRentPrices: new uint256[](0),
            nftPrices: new uint256[](0),
            contractERC20s: new address[](0)
        });
    }

    function createActionCallData(
        address[] memory _nfts,
        uint256[] memory _tokenIds,
        uint256[] memory _lendingIds
    ) private pure returns (CallData memory cd) {
        cd = CallData({
            left: 0,
            right: 1,
            nfts: _nfts,
            tokenIds: _tokenIds,
            lendAmounts: new uint32[](0),
            lendingIds: _lendingIds,
            rentDurations: new uint32[](0),
            maxRentDurations: new uint32[](0),
            dailyRentPrices: new uint256[](0),
            nftPrices: new uint256[](0),
            contractERC20s: new address[](0)
        });
    }

    function handleReturn(CallData memory _cd) private {
        uint32[] memory lendAmounts = new uint32[](_cd.right - _cd.left);

        for (uint256 i = _cd.left; i < _cd.right; i++) {
            LendingRenting storage item = lendingRenting[
                keccak256(
                    abi.encodePacked(
                        _cd.nfts[_cd.left],
                        _cd.tokenIds[i],
                        _cd.lendingIds[i]
                    )
                )
            ];

            ensureIsNotNull(item.lending);
            ensureIsReturnable(item.renting, block.timestamp);

            uint256 secondsSinceRentStart = block.timestamp -
                item.renting.rentedAt;
            distributePayments(item, secondsSinceRentStart);

            lendAmounts[i - _cd.left] = item.lending.lentAmount;

            emit Returned(_cd.lendingIds[i], uint32(block.timestamp));

            delete item.renting;
        }

        safeTransfer(
            _cd,
            msg.sender,
            address(this),
            sliceArr(_cd.tokenIds, _cd.left, _cd.right, 0),
            sliceArrUint32(lendAmounts, _cd.left, _cd.right, _cd.left)
        );
    }

    function distributeClaimPayment(
        LendingRenting memory _lendingRenting
    ) private {
        uint256 nftPrice = _lendingRenting.lending.lentAmount *
            _lendingRenting.lending.nftPrice;
        uint256 rentPrice = _lendingRenting.lending.lentAmount *
            _lendingRenting.lending.dailyRentPrice;
        uint256 maxRentPayment = (rentPrice *
            _lendingRenting.renting.rentDuration) / SECONDS_PER_DAY;
        uint256 takenFee = takeFee(
            maxRentPayment,
            _lendingRenting.lending.contractERC20
        );
        uint256 finalAmt = maxRentPayment + nftPrice;

        require(maxRentPayment > 0, "PolftRent: collateral plus rent is zero");

        bool success = IERC20(_lendingRenting.lending.contractERC20).transfer(
            _lendingRenting.lending.lenderAddress,
            finalAmt - takenFee
        );
        require(success, "PolftRent: Transfer ERC20 not success!");
    }

    function distributePayments(
        LendingRenting storage _lendingRenting,
        uint256 _secondsSinceRentStart
    ) private {
        uint256 nftPrice = _lendingRenting.lending.lentAmount *
            _lendingRenting.lending.nftPrice;
        uint256 rentPrice = _lendingRenting.lending.dailyRentPrice *
            _lendingRenting.lending.lentAmount;

        uint256 totalRentPricePerDuration = (rentPrice *
            _lendingRenting.renting.rentDuration) / SECONDS_PER_DAY;
        uint256 sendLenderAmt = (_secondsSinceRentStart * rentPrice) /
            SECONDS_PER_DAY;
        require(
            totalRentPricePerDuration > 0,
            "PolftRent: total payment collateral is zero"
        );
        require(sendLenderAmt > 0, "PolftRent: lender payment is zero");

        uint256 sendRenterAmt = 0;
        if (totalRentPricePerDuration > sendLenderAmt) {
            sendRenterAmt = totalRentPricePerDuration - sendLenderAmt;
        }

        uint256 takenFee = takeFee(
            sendLenderAmt,
            _lendingRenting.lending.contractERC20
        );

        sendLenderAmt -= takenFee;
        sendRenterAmt += nftPrice;

        bool success = IERC20(_lendingRenting.lending.contractERC20).transfer(
            _lendingRenting.lending.lenderAddress,
            sendLenderAmt
        );
        require(success, "PolftRent: transfer erc20 failed!");

        success = IERC20(_lendingRenting.lending.contractERC20).transfer(
            _lendingRenting.renting.renterAddress,
            sendRenterAmt
        );
        require(success, "PolftRent: transfer erc20 failed!");
    }

    function takeFee(
        uint256 _rent,
        address _contractERC20
    ) private returns (uint256 fee) {
        fee = (_rent * rentFee) / MAX_PERCENTAGE;
        bool success = IERC20(_contractERC20).transfer(_treasuryAddress, fee);
        require(success, "PolftRent: transfer erc20 failed!");
    }

    function is721(address _nft) private view returns (bool) {
        return IERC165(_nft).supportsInterface(type(IERC721).interfaceId);
    }

    function is1155(address _nft) private view returns (bool) {
        return IERC165(_nft).supportsInterface(type(IERC1155).interfaceId);
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

    function getPaymentPrice(
        LendingRenting calldata _lendingRenting
    ) private view returns (uint256, uint256) {
        uint256 nftPrice = _lendingRenting.lending.lentAmount *
            _lendingRenting.lending.nftPrice;
        uint256 rentPrice = (_lendingRenting.lending.dailyRentPrice *
            _lendingRenting.lending.lentAmount *
            _lendingRenting.lending.maxRentDuration) / SECONDS_PER_DAY;
        return (nftPrice, rentPrice);
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
                ""
            );
        } else {
            revert("PolftRent: unsupported token type");
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
        require(_lending.nftPrice == 0, "PolftRent: nft price not zero");
    }

    function ensureIsNotNull(Lending memory _lending) private pure {
        ensureIsNotZeroAddr(_lending.lenderAddress);
        require(_lending.maxRentDuration != 0, "PolftRent: duration zero");
        require(_lending.dailyRentPrice != 0, "PolftRent: rent price is zero");
        require(_lending.nftPrice != 0, "PolftRent: nft price is zero");
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
        require(uint32(_cd.nftPrices[_i]) > 0, "PolftRent: nft price is zero");
    }

    function ensureIsRentable(
        Lending memory _lending,
        CallData memory _cd,
        uint256 _i
    ) private view {
        require(
            _msgSender() != _lending.lenderAddress,
            "PolftRent: cant rent own nft"
        );
        require(
            _cd.rentDurations[_i] <= type(uint32).max,
            "PolftRent: not uint32"
        );
        require(_cd.rentDurations[_i] > 0, "PolftRent: duration is zero");
        require(
            _cd.rentDurations[_i] <= _lending.maxRentDuration,
            "PolftRent: rent duration exceeds allowed max"
        );
    }

    function isPastReturnDate(
        Renting memory _renting,
        uint256 _now
    ) private view returns (bool) {
        require(_now > _renting.rentedAt, "PolftRent: now before rented");
        return
            _now - _renting.rentedAt >
            _renting.rentDuration + LIMIT_SECONDS_TO_RETURN;
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

    function ensureIsStoppable(Lending memory _lending) private view {
        require(_lending.lenderAddress == _msgSender(), "PolftRent: not lender");
    }

    function ensureIsClaimable(
        Renting memory _renting,
        uint256 _blockTimestamp
    ) private view {
        require(
            isPastClaimCollateralDate(_renting, _blockTimestamp),
            "PolftRent: claim date not passed"
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
