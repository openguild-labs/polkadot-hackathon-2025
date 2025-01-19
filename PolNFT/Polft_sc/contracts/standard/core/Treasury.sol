// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../../shared/WhitelistUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";



contract Treasury is Initializable, OwnableUpgradeable, UUPSUpgradeable, WhitelistUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _whitelistAddress) public initializer {
        __Ownable_init();
        __WhitelistUpgradeable_init(_whitelistAddress);
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    receive() external payable {
    }

    fallback() external payable {}

    function withdraw(address _recipient) public payable validateAdmin {
        (bool success, ) = payable(_recipient).call{value: address(this).balance}("");
        require(success, "Treasury: can not withdraw money!");
    }

    function withdrawERC20(address _contractERC20, address _recipient, uint256 _amount) public payable validateAdmin {
        require(IERC20(_contractERC20).balanceOf(address(this)) >= _amount, "Treasury: you don't have enough token");
        bool success = IERC20(_contractERC20).transfer(_recipient, _amount);
        require(success, "Treasury: can not withdraw erc20 token!");
    }

    function balanceETH() public view returns (uint256) {
        return address(this).balance;
    }

    function balanceERC20(address _contractERC20) public view returns(uint256) {
        return IERC20(_contractERC20).balanceOf(address(this));
    }

}
