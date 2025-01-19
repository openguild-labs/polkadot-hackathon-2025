// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.6;

import "./TokenTailsCat.sol";
import "./TokenTailsMysteryBox.sol";

contract TokenTailsInteraction {
    TokenTailsCat public tokenTailsCat;
    TokenTailsBox public tokenTailsBox;

    mapping(uint256 => uint256) public catLastInteraction;

    constructor(address _tokenTailsCat, address _tokenTailsBox) {
        tokenTailsCat = TokenTailsCat(_tokenTailsCat);
        tokenTailsBox = TokenTailsBox(_tokenTailsBox);
    }

    function interactWithCat(uint256 catId) public {
        require(tokenTailsCat.ownerOf(catId) == msg.sender, 'You do not own this cat');
        uint256 currentTime = block.timestamp;
        require(currentTime > catLastInteraction[catId] + 1 days, 'Rewards can be given only once per day');

        // Update the last interaction time
        catLastInteraction[catId] = currentTime;

        // Chance to earn a mystery box
        if (random() % 100 < 10) {
            // 10% chance to earn a mystery box
            tokenTailsBox.safeMint(msg.sender);
        }
    }

    function random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
    }
}
