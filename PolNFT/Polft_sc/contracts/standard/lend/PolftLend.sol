// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "../../shared/WhitelistUpgradeable.sol";
import "./SignUpgradeable.sol";
import "../../interfaces/ICurrency.sol";
import "../../interfaces/ICryptoKittiesCore.sol";

// THIS CONTRACT STILL HAVE SOMETHING TO OPTIMIZE GAS BY ASSEMBLY
// HOWEVER I WILL OPTIMIZE IT AFTER FINISHING TEST CASE
contract PolftLend is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    WhitelistUpgradeable,
    SignUpgradeable,
    ReentrancyGuardUpgradeable,
    ERC721HolderUpgradeable
{
    uint256 internal MAX_PERCENTAGE;
    struct Loan {
        address[] nftCollateralContract;
        uint256[] nftCollateralId;
        address erc20CollateralContract;
        address borrower;
        address lender;
        uint256 startTime;
        uint256 duration;
        uint256 maxDuration; // date to be capaable of forcing close loan
        uint256 principalPaymentAmount;
        uint256 maximumPaymentAmount; // maximum amount that borrower can lend
        uint256 interestRateOnBasisPoints;
        bool interestIsProRated;
    }

    struct StartLoanParams {
        address[] nftCollateralContract;
        uint256[] nftCollateralId;
        address erc20CollateralContract; // will be address(0) if they use Wrapped Token
        address borrower;
        address lender;
        uint256 duration;
        uint256 maxDuration; // date to be capaable of forcing close loan
        uint256 principalPaymentAmount;
        uint256 maximumPaymentAmount;
        uint256 interestRateOnBasisPoints;
        bool interestIsProRated;
        bytes borrowerSignature;
        bytes lenderSignature;
        uint256[2] nonces; // 0: is nonce of borrower, 1 is nonce of lender
    }

    mapping(uint256 => Loan) public loanInformations;
    mapping(uint256 => bool) public loanRepaidOrLiquidated;
    uint256 public feeBps; // 10000 is 100%
    uint256 public totalLoan;
    address public currencyAddress; // address of Currency contract
    address public feeRecipient; // maybe treasury address or owner

    // a random nonce offchain is locked when a borrower or lender start a loan
    mapping(address => mapping(uint256 => bool)) public nonces;

    // type hash for signing message
    // bytes32[3] private _typeHashes;
    // 0 - Start Lend Typehash
    // 1 - Finish Lend Typehash
    // 2 - Force Close Lend Typehash

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    event LoanStarted(uint256 loanId);
    event LoanRepaid(uint256 loanId);
    event LoanLiquidated(uint256 loanId);

    fallback() external payable {
        revert("PolftLend: Can not send ether directly without method!");
    }

    receive() external payable {
        revert("PolftLend: Can not send ether directly without method!");
    }

    function startLoan(
        StartLoanParams calldata param
    ) external nonReentrant {
        // Check conditions
        require(
            msg.sender == param.borrower,
            "PolftLend: caller is not borrower!"
        );
        require(
            param.maxDuration >= param.duration,
            "PolftLend: Max duration has to be greater than duration!"
        );
        require(
            param.maximumPaymentAmount >= param.principalPaymentAmount,
            "PolftLend: Max payment amount has to be greater than principal payment amount!"
        );
        require(param.duration != 0, "PolftLend: Duration can not be zero!");
        require(
            param.nftCollateralContract.length == param.nftCollateralId.length,
            "PolftLend: nftCollateralContract length is equal to nftCollateralId!"
        );
        require(
            ICurrency(currencyAddress).currencyState(
                param.erc20CollateralContract
            ),
            "PolftLend: not valid currency"
        );
        require(
            !nonces[param.borrower][param.nonces[0]],
            "PolftLend: Invalid nonce in borrower!"
        );
        require(
            !nonces[param.lender][param.nonces[1]],
            "PolftLend: Invalid nonce in lender!"
        );
        require(
            isValidBorrowerSignature(
                BorrowSignatureParam({
                    signature: param.borrowerSignature,
                    nftCollateralContract: param.nftCollateralContract,
                    nftCollateralId: param.nftCollateralId,
                    borrower: msg.sender,
                    nonce: param.nonces[0]
                })
            ),
            "PolftLend: Borrower signature is invalid"
        );
        require(
            isValidLenderSignature(
                LendSignatureParam({
                    signature: param.lenderSignature,
                    principalAmount: param.principalPaymentAmount,
                    maximumPaymentAmount: param.maximumPaymentAmount,
                    duration: param.duration,
                    maxDuration: param.maxDuration,
                    interestRateOnBasisPoints: param.interestRateOnBasisPoints,
                    interestIsProRated: param.interestIsProRated,
                    nftCollateralContract: param.nftCollateralContract,
                    nftCollateralId: param.nftCollateralId,
                    erc20CollateralContract: param.erc20CollateralContract,
                    lender: param.lender,
                    nonce: param.nonces[1]
                })
            ),
            "PolftLend: Lender signature is invalid"
        );

        uint256 loanId = totalLoan;
        _startLoan(param, loanId);
        totalLoan = totalLoan + 1;

        emit LoanStarted(loanId);
    }

    // Repaid loan and calculate price then return money to lender and nft to borrower
    function repaidLoan(uint256 _loanId) external nonReentrant {
        require(
            !loanRepaidOrLiquidated[_loanId],
            "PolftLend: Loan has been liquidated or repaid!"
        );
        Loan memory _loan = loanInformations[_loanId];
        require(
            msg.sender == _loan.borrower,
            "PolftLend: You are not borrower!"
        );

        _repaidLoan(_loan, _loanId);

        emit LoanRepaid(_loanId);
    }

    function liquidateLoan(uint256 _loanId) external nonReentrant {
        // Force close when lender can't get money back
        require(
            !loanRepaidOrLiquidated[_loanId],
            "PolftLend: Loan has been liquidated or repaid!"
        );
        Loan memory _loan = loanInformations[_loanId];
        require(msg.sender == _loan.lender, "PolftLend: You are not borrower!");
        require(
            block.timestamp >= _loan.maxDuration + _loan.startTime,
            "PolftLend: It is not time for you to liquidate the loan!"
        );
        _liquidateLoan(_loan, _loanId);
        emit LoanLiquidated(_loanId);
    }

    function initialize(address _whitelistAddress) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        __WhitelistUpgradeable_init(_whitelistAddress);
        __SignUpgradeable_init();
        __ReentrancyGuard_init();
        __ERC721Holder_init();
        feeBps = 50; // 0.5% 50/10000
        MAX_PERCENTAGE = 10000;
        feeRecipient = _msgSender();
    }

    function setFeeBps(uint256 _feeBps) public validateAdmin {
        feeBps = _feeBps;
    }

            function setCurrencyAddress(address _currencyAddress) public validateAdmin {
        currencyAddress = _currencyAddress;
    }

    function setFeeRecipient(address _feeRecipient) public validateAdmin {
        feeRecipient = _feeRecipient;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function _validateSignatureStartLoan(
        StartLoanParams calldata param
    ) internal view {
        require(
            isValidBorrowerSignature(
                BorrowSignatureParam({
                    signature: param.borrowerSignature,
                    nftCollateralContract: param.nftCollateralContract,
                    nftCollateralId: param.nftCollateralId,
                    borrower: msg.sender,
                    nonce: param.nonces[0]
                })
            ),
            "Borrower signature is invalid"
        );
        require(
            isValidLenderSignature(
                LendSignatureParam({
                    signature: param.lenderSignature,
                    principalAmount: param.principalPaymentAmount,
                    maximumPaymentAmount: param.maximumPaymentAmount,
                    duration: param.duration,
                    maxDuration: param.maxDuration,
                    interestRateOnBasisPoints: param.interestRateOnBasisPoints,
                    interestIsProRated: param.interestIsProRated,
                    nftCollateralContract: param.nftCollateralContract,
                    nftCollateralId: param.nftCollateralId,
                    erc20CollateralContract: param.erc20CollateralContract,
                    lender: param.lender,
                    nonce: param.nonces[1]
                })
            ),
            "Lender signature is invalid"
        );
    }

    function _transferNft(
        address _nftContract,
        uint256 _nftId,
        address _recipient
    ) internal returns (bool) {
        // Try to call transferFrom()
        bool transferFromSucceeded = _attemptTransferFrom(
            _nftContract,
            _nftId,
            _recipient
        );
        if (transferFromSucceeded) {
            return true;
        } else {
            // Try to call transfer()
            bool transferSucceeded = _attemptTransfer(
                _nftContract,
                _nftId,
                _recipient
            );
            return transferSucceeded;
        }
    }

    function _attemptTransferFrom(
        address _nftContract,
        uint256 _nftId,
        address _recipient
    ) internal returns (bool) {
        // @notice Some NFT contracts will not allow you to approve an NFT that
        //         you own, so we cannot simply call approve() here, we have to
        //         try to call it in a manner that allows the call to fail.
        _nftContract.call(
            abi.encodeWithSelector(
                IERC721Upgradeable(_nftContract).approve.selector,
                address(this),
                _nftId
            )
        );

        // @notice Some NFT contracts will not allow you to call transferFrom()
        //         for an NFT that you own but that is not approved, so we
        //         cannot simply call transferFrom() here, we have to try to
        //         call it in a manner that allows the call to fail.
        (bool success, ) = _nftContract.call(
            abi.encodeWithSelector(
                IERC721Upgradeable(_nftContract).transferFrom.selector,
                address(this),
                _recipient,
                _nftId
            )
        );
        return success;
    }

    function _attemptTransfer(
        address _nftContract,
        uint256 _nftId,
        address _recipient
    ) internal returns (bool) {
        // @notice Some NFT contracts do not implement transfer(), since it is
        //         not a part of the official ERC721 standard, but many
        //         prominent NFT projects do implement it (such as
        //         Cryptokitties), so we cannot simply call transfer() here, we
        //         have to try to call it in a manner that allows the call to
        //         fail.
        (bool success, ) = _nftContract.call(
            abi.encodeWithSelector(
                ICryptoKittiesCore(_nftContract).transfer.selector,
                _recipient,
                _nftId
            )
        );
        return success;
    }

    function _startLoan(
        StartLoanParams calldata param,
        uint256 _loanId
    ) private {
        Loan memory loan = Loan({
            nftCollateralContract: param.nftCollateralContract,
            nftCollateralId: param.nftCollateralId,
            erc20CollateralContract: param.erc20CollateralContract,
            borrower: param.borrower,
            lender: param.lender,
            startTime: block.timestamp,
            duration: param.duration,
            maxDuration: param.maxDuration,
            principalPaymentAmount: param.principalPaymentAmount,
            maximumPaymentAmount: param.maximumPaymentAmount,
            interestRateOnBasisPoints: param.interestRateOnBasisPoints,
            interestIsProRated: param.interestIsProRated
        });

        loanInformations[_loanId] = loan;
        nonces[param.borrower][param.nonces[0]] = true;
        nonces[param.lender][param.nonces[1]] = true;

        for (uint256 i = 0; i < loan.nftCollateralContract.length; i++) {
            IERC721Upgradeable(loan.nftCollateralContract[i]).transferFrom(
                msg.sender,
                address(this),
                loan.nftCollateralId[i]
            );
        }

        IERC20Upgradeable(loan.erc20CollateralContract).transferFrom(
            msg.sender,
            feeRecipient,
            loan.principalPaymentAmount
        );
    }

    function _calculateLoan(
        uint256 principlePaymentAmount,
        uint256 maximumPaymentAmount,
        uint256 startTime,
        uint256 duration,
        uint256 interestRateOnBasisPoints,
        bool interestIsProRated
    ) private view returns (uint256, uint256) {
        uint256 adminFee;
        uint256 payoffAmount;
        if (interestIsProRated) {
            uint256 interestAfterEntireDuration = (principlePaymentAmount *
                interestRateOnBasisPoints) / MAX_PERCENTAGE;
            payoffAmount =
                principlePaymentAmount +
                (interestAfterEntireDuration *
                    _calculateIntervalsFromNow(startTime)) /
                duration;
            if (payoffAmount > maximumPaymentAmount) {
                adminFee = maximumPaymentAmount - payoffAmount;
            } else {
                adminFee = (payoffAmount * feeBps) / MAX_PERCENTAGE;
            }
        } else {
            adminFee = (maximumPaymentAmount * feeBps) / MAX_PERCENTAGE;
        }
        payoffAmount = maximumPaymentAmount - adminFee;

        return (payoffAmount, adminFee);
    }

    function _repaidLoan(Loan memory _loan, uint256 _loanId) private {
        // Calculate price
        (uint256 payoffAmount, uint256 adminFee) = _calculateLoan(
            _loan.principalPaymentAmount,
            _loan.maximumPaymentAmount,
            _loan.startTime,
            _loan.duration,
            _loan.interestRateOnBasisPoints,
            _loan.interestIsProRated
        );

        loanRepaidOrLiquidated[_loanId] = true;
        bool success = IERC20Upgradeable(_loan.erc20CollateralContract)
            .transferFrom(_loan.borrower, _loan.lender, payoffAmount);
        require(success, "PolftLend: Transfer token failed!");

        success = IERC20Upgradeable(_loan.erc20CollateralContract).transferFrom(
                _loan.borrower,
                feeRecipient,
                adminFee
            );
        require(success, "PolftLend: Transfer token failed!");

        for (uint256 i = 0; i < _loan.nftCollateralContract.length; i++) {
            success = _transferNft(
                _loan.nftCollateralContract[i],
                _loan.nftCollateralId[i],
                _loan.borrower
            );
            require(success, "PolftLend: Transfer NFT to borrower failed!");
        }
    }

    function _liquidateLoan(Loan memory _loan, uint256 _loanId) private {
        loanRepaidOrLiquidated[_loanId] = true;
        bool success;
        for (uint256 i = 0; i < _loan.nftCollateralContract.length; i++) {
            success = _transferNft(
                _loan.nftCollateralContract[i],
                _loan.nftCollateralId[i],
                _loan.lender
            );
            require(success, "PolftLend: Transfer NFT to lender failed!");
        }
    }

    function _calculateIntervalsFromNow(
        uint256 _startTime
    ) private view returns (uint256) {
        return block.timestamp - _startTime;
    }
}
