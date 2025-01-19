// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IPFSHashStorage {
    // Mapping from tokenId to IPFS hash
    mapping(uint256 => string) private _tokenIdToIPFSHash;
    
    // Counter for generating unique tokenIds
    uint256 private _tokenIdCounter;

    // Event emitted when a new IPFS hash is stored
    event IPFSHashStored(uint256 indexed tokenId, string ipfsHash);

    // Function to store a new IPFS hash
    function storeIPFSHash(string memory ipfsHash) public returns (uint256) {
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");

        // Increment the token ID counter
        _tokenIdCounter++;

        // Store the IPFS hash
        _tokenIdToIPFSHash[_tokenIdCounter] = ipfsHash;

        // Emit the event
        emit IPFSHashStored(_tokenIdCounter, ipfsHash);

        // Return the new token ID
        return _tokenIdCounter;
    }

    // Function to fetch IPFS hash by tokenId
    function getIPFSHash(uint256 tokenId) public view returns (string memory) {
        require(_tokenIdCounter >= tokenId && tokenId > 0, "Invalid token ID");
        return _tokenIdToIPFSHash[tokenId];
    }

    // Function to get the total number of stored IPFS hashes
    function getTotalIPFSHashes() public view returns (uint256) {
        return _tokenIdCounter;
    }
}