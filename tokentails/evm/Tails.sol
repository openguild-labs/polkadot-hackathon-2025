// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.6;

import "@openzeppelin/contracts@4.9.3/token/ERC20/ERC20.sol";

contract TokenTails is ERC20 {
    constructor() ERC20("Token Tails", "TAILS") {
        _mint(_msgSender(), 69000000 * 10 ** decimals());
    }
}
