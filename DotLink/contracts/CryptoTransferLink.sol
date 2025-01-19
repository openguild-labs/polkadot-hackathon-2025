// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CryptoLinkTransfer {
    struct Link {
        address sender;
        uint256 amount;
        uint256 expirationTime;
        bool claimed;
    }

    mapping(bytes32 => Link) public links;
    mapping(address => uint256) public nonces; // Track a nonce for each sender
    mapping(address => bytes32[]) public senderLinks; // Track all links created by a sender

    // Create a link and return the linkId
    function createLink(uint256 expirationTime) external payable returns (bytes32) {
        require(msg.value > 0, "Must send some ETH");

        // Generate a unique link ID
        uint256 currentNonce = nonces[msg.sender];
        bytes32 linkId = keccak256(abi.encodePacked(msg.sender, currentNonce, block.timestamp));

        // Store the link details
        links[linkId] = Link({
            sender: msg.sender,
            amount: msg.value,
            expirationTime: expirationTime,
            claimed: false
        });

        // Save the linkId to the sender's mapping
        senderLinks[msg.sender].push(linkId);

        // Increment the sender's nonce
        nonces[msg.sender]++;

        // Return the generated linkId
        return linkId;
    }

    // Claim a link
    function claimLink(bytes32 linkId) external {
        Link storage link = links[linkId];
        require(link.amount > 0, "Invalid link");
        require(!link.claimed, "Link already claimed");
        require(block.timestamp <= link.expirationTime, "Link expired");

        link.claimed = true;
        payable(msg.sender).transfer(link.amount);
    }

    // Reclaim unclaimed funds
    function reclaimLink(bytes32 linkId) external {
        Link storage link = links[linkId];
        require(link.amount > 0, "Invalid link");
        require(!link.claimed, "Link already claimed");
        require(msg.sender == link.sender, "Only sender can reclaim");

        uint256 amount = link.amount;
        link.amount = 0; // Prevent reentrancy
        payable(msg.sender).transfer(amount);
    }

    // Get all link IDs created by a sender
    function getSenderLinks(address sender) external view returns (bytes32[] memory) {
        return senderLinks[sender];
    }
}
