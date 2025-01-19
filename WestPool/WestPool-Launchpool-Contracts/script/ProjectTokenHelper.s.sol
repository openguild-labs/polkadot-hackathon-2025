// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/token/ERC20/ERC20.sol";

contract ProjectToken is ERC20 {
    constructor(uint256 initSupply) ERC20("Project Token", "PT") {
        _mint(_msgSender(), initSupply);
    }
}
