// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract HakifiProxy is
Initializable,
UUPSUpgradeable,
AccessControlEnumerableUpgradeable,
OwnableUpgradeable,
ERC20PausableUpgradeable,
ReentrancyGuardUpgradeable
{
    /**
     * USDT - 0
     * VNST - 1
     */
    enum TOKEN {
        USDT,
        VNST
    }

    /**
     * margin_pool - 0
     * claim_pool - 1
     * hakifi_fund - 2
     * third_party_fund - 3
     */
    enum VAULT {
        margin_pool,
        claim_pool,
        hakifi_fund,
        third_party_fund
    }

    mapping(VAULT => mapping(TOKEN => uint256)) vault;

    IERC20 usdt;
    IERC20 vnst;

    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");

    function initialize(address _usdt, address _vnst) public payable initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MODERATOR_ROLE, _msgSender());
        __Ownable_init();

        usdt = IERC20(_usdt);
        vnst = IERC20(_vnst);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function pause() external payable onlyOwner {
        _pause();
    }

    function unpause() external payable onlyOwner {
        _unpause();
    }

    function addMod(address mod) external payable onlyOwner {
        grantRole(MODERATOR_ROLE, mod);
    }

    function removeMod(address mod) external payable onlyOwner {
        revokeRole(MODERATOR_ROLE, mod);
    }

    function getVault(VAULT _vault, TOKEN _token) external view returns (uint256) {
        return vault[_vault][_token];
    }
}
