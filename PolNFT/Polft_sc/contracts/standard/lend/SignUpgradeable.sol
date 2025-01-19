// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

contract SignUpgradeable is Initializable, ContextUpgradeable {
    using ECDSAUpgradeable for bytes32;

    function __SignUpgradeable_init() internal onlyInitializing {
        __SignUpgradeable_init_unchained();
    }

    function __SignUpgradeable_init_unchained() internal onlyInitializing {}

    // @notice This function gets the current chain ID.
    function getChainID() public view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }

    struct BorrowSignatureParam {
        bytes signature;
        address[] nftCollateralContract;
        uint256[] nftCollateralId;
        address borrower;
        uint256 nonce;
    }

    function isValidBorrowerSignature(
        BorrowSignatureParam memory param
    ) public view returns (bool) {
        if (param.borrower == address(0)) {
            return false;
        } else {
            bytes32 message = keccak256(
                abi.encodePacked(
                    param.nftCollateralContract,
                    param.nftCollateralId,
                    param.borrower,
                    param.nonce,
                    getChainID()
                )
            );

            bytes32 messageWithEthSignPrefix = message.toEthSignedMessageHash();

            return (messageWithEthSignPrefix.recover(param.signature) ==
                param.borrower);
        }
    }

    struct LendSignatureParam {
        bytes signature;
        uint256 principalAmount;
        uint256 maximumPaymentAmount;
        uint256 duration;
        uint256 maxDuration;
        uint256 interestRateOnBasisPoints;
        bool interestIsProRated;
        address[] nftCollateralContract;
        uint256[] nftCollateralId;
        address erc20CollateralContract;
        address lender;
        uint256 nonce;
    }

    function isValidLenderSignature(
        LendSignatureParam memory param
    ) public view returns (bool) {
        if (param.lender == address(0)) {
            return false;
        } else {
            bytes32 message = keccak256(
                abi.encodePacked(
                    param.principalAmount,
                    param.maximumPaymentAmount,
                    param.duration,
                    param.maxDuration,
                    param.interestRateOnBasisPoints,
                    param.interestIsProRated,
                    param.nftCollateralContract,
                    param.nftCollateralId,
                    param.erc20CollateralContract,
                    param.lender,
                    param.nonce,
                    getChainID()
                )
            );

            bytes32 messageWithEthSignPrefix = message.toEthSignedMessageHash();

            return (messageWithEthSignPrefix.recover(param.signature) ==
                param.lender);
        }
    }
}
