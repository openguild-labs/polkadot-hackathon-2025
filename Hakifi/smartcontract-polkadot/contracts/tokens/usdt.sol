// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDT is ERC20 {
    constructor() ERC20("usdt", "USDT") {
        _mint(msg.sender, 1000000000 * 10 ** 18);
    }
}
