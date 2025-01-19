// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OzoneWrapperToken is ERC20Permit {

    uint8 _decimals;
    address immutable public executor;

    modifier onlyExecutor() {
        require(msg.sender == executor);
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        string memory mempool,
        address _executor,
        uint8 __decimals
    ) ERC20Permit(name) ERC20(name, symbol) {
        executor = _executor;
        _decimals = __decimals;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function mint(address account, uint256 amount) public onlyExecutor {
        _mint(account, amount);
    }
}
