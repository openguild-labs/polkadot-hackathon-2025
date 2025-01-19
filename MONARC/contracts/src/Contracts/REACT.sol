// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract REACT is ERC20, Ownable {
    // Rate: 0.1 REACT = 1000000 tokens
    uint256 public constant RATE = 1000000 * 10**18;  // 1000000 tokens
    uint256 public constant MIN_REACT = 100000000000000000;  // 0.1 REACT in wei

    constructor() ERC20("REACT", "REACT") Ownable(msg.sender) {}

    function mint() public payable {
        // require(msg.value >= MIN_REACT, "Please send at least 0.1 REACT");
        
        // Calculate tokens: (sent amount * 1000000) / 0.1 REACT
        uint256 tokensToMint = (msg.value * RATE) / MIN_REACT;
        _mint(msg.sender, tokensToMint);
    }
    // 0.0001 = 1000
    function burn(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Not enough tokens");

        // Calculate REACT to return: (burned tokens * 0.1 REACT) / 1000000
        uint256 reactToReturn = (amount * MIN_REACT) / RATE;
        
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(reactToReturn);
    }

    receive() external payable {}
}