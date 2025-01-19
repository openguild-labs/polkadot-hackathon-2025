// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "Dynamic NFT Pricing/REACT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "AbstractCallback.sol";

contract NFTMarketplace is ERC721Enumerable, ReentrancyGuard, Ownable(msg.sender), AbstractCallback {
    // REACT token contract interface
    REACT public reactToken;
    
    address private buyer;
    
    // Struct to store listing information
    struct Listing {
        uint256 price;
        address seller;
        bool isActive;
    }
    
    // Array to keep track of all listed token IDs
    uint256[] private listedTokens;
    
    // Mapping from token ID to listing information
    mapping(uint256 => Listing) public listings;
    
    // Mapping to track locked REACT tokens per user
    mapping(address => uint256) public lockedTokens;
    
    // Mapping to track user's listed tokens
    mapping(address => uint256[]) private userListedTokens;
    
    // Events
    event TokenMinted(address indexed to, uint256 indexed tokenId);
    event TokenListed(uint256 indexed tokenId, uint256 price, address indexed seller);
    event TokenUnlisted(uint256 indexed tokenId);
    event TokenSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event TokensLocked(address indexed user, uint256 indexed amount, uint256 indexed tokenId);
    event TokensUnlocked(address indexed user, uint256 amount);
    
    constructor(
        address _callback_sender,
        address payable _reactTokenAddress,
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) AbstractCallback(_callback_sender) payable {
        reactToken = REACT(_reactTokenAddress);
    }
    
    receive() external payable {}
    
    // Function to mint new NFTs
    function mint(address /*sender*/, uint256 tokenId) external {
        _safeMint(buyer, tokenId);
        buyer = address(0);
        emit TokenMinted(msg.sender, tokenId);
    }
    
    // Function to lock REACT tokens
    function lockTokens(uint256 tokenId) external {
        uint256 requiredAmount = getListing(tokenId).price;
        require(reactToken.balanceOf(msg.sender) > requiredAmount, "You Don't Have enough REACT");
        require(reactToken.transferFrom(msg.sender, address(this), requiredAmount), "Transfer failed");
        
        lockedTokens[msg.sender] += requiredAmount;
        buyer = msg.sender;
        emit TokensLocked(msg.sender, requiredAmount, tokenId);
    }
    
    // Function to list NFT for sale
    function listNFT(address /*sender*/,address owner, uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be greater than 0");
        require(!listings[tokenId].isActive, "Already listed");
        
        listings[tokenId] = Listing({
            price: price,
            isActive: true,
            seller:owner
        });
        
        listedTokens.push(tokenId);
        userListedTokens[msg.sender].push(tokenId);
        
        emit TokenListed(tokenId, price, msg.sender);
    }
    
    // Function to unlist NFT
    function unlistNFT(address /*sender*/, uint256 tokenId) external {
        require(listings[tokenId].isActive, "Not listed");
        
        _removeFromListedTokens(tokenId);
        address tokenOwner=ownerOf(tokenId);
        _removeFromUserListedTokens(tokenOwner, tokenId);
        delete listings[tokenId];
        
        emit TokenUnlisted(tokenId);
    }
    
    // Helper function to remove token from listedTokens array
    function _removeFromListedTokens(uint256 tokenId) private {
        for (uint256 i = 0; i < listedTokens.length; i++) {
            if (listedTokens[i] == tokenId) {
                listedTokens[i] = listedTokens[listedTokens.length - 1];
                listedTokens.pop();
                break;
            }
        }
    }
    
    // Helper function to remove token from userListedTokens array
    function _removeFromUserListedTokens(address user, uint256 tokenId) private {
        uint256[] storage userTokens = userListedTokens[user];
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (userTokens[i] == tokenId) {
                userTokens[i] = userTokens[userTokens.length - 1];
                userTokens.pop();
                break;
            }
        }
    }
    
    // Function to get all listed NFTs
    function getAllListedNFTs() external view returns (uint256[] memory) {
        return listedTokens;
    }
    
    // Function to get all listings with details
    function getAllListingsDetails() external view returns (Listing[] memory) {
        Listing[] memory allListings = new Listing[](listedTokens.length);
        for (uint256 i = 0; i < listedTokens.length; i++) {
            allListings[i] = listings[listedTokens[i]];
        }
        return allListings;
    }
    
    // Function to get user's listed NFTs
    function getUserListedNFTs(address user) external view returns (uint256[] memory) {
        return userListedTokens[user];
    }
    
    // Function to get listing information
    function getListing(uint256 tokenId) public view returns (Listing memory) {
        return listings[tokenId];
    }
    
    // Function to get multiple listings at once
    function getMultipleListings(uint256[] calldata tokenIds) external view returns (Listing[] memory) {
        Listing[] memory requestedListings = new Listing[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            requestedListings[i] = listings[tokenIds[i]];
        }
        return requestedListings;
    }
    
    // Function to get locked tokens balance
    function getLockedTokens(address user) public view returns (uint256) {
        return lockedTokens[user];
    }
    
    // Function to get total number of listed NFTs
    function totalListedNFTs() external view returns (uint256) {
        return listedTokens.length;
    }
    
    // Function to get NFTs listed by price range
    function getNFTsByPriceRange(uint256 minPrice, uint256 maxPrice) 
        external 
        view 
        returns (uint256[] memory) {
        uint256 count = 0;
        
        // First count matching NFTs
        for (uint256 i = 0; i < listedTokens.length; i++) {
            uint256 price = listings[listedTokens[i]].price;
            if (price >= minPrice && price <= maxPrice) {
                count++;
            }
        }
        
        // Create array of matching token IDs
        uint256[] memory matchingTokens = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < listedTokens.length; i++) {
            uint256 price = listings[listedTokens[i]].price;
            if (price >= minPrice && price <= maxPrice) {
                matchingTokens[index] = listedTokens[i];
                index++;
            }
        }
        
        return matchingTokens;
    }
    
    // Function to withdraw ether
    function withdraw() external onlyOwner {
        address payable wallet = payable(owner());
        wallet.transfer(address(this).balance);
    }
}