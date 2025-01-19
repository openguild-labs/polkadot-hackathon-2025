// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.6;

import "./Tails.sol";
import "@openzeppelin/contracts@4.9.3/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.9.3/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts@4.9.3/utils/Strings.sol";

contract TokenTailsRewardsBox is ERC721, AccessControlEnumerable {
    TokenTails public tokenTails;
    uint256 private _nextTokenId;
    string private _baseTokenURI;
    bool private _paused;

    // Define a single role for both minting and burning
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address _tokenTails) ERC721("Token Tails Rewards Box", "TokenTailsRewardsBox") {
        tokenTails = TokenTails(_tokenTails);
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _baseTokenURI = "https://api.tokentails.com/box/nft/";
        _paused = true;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory newBaseURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseTokenURI = newBaseURI;
    }

    function safeMint(address to) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function open(uint256 tokenId) public onlyRole(MINTER_ROLE) returns (uint256) {
        require(!_paused, "Box opening is paused");
        require(ownerOf(tokenId) == msg.sender, "Box can be opened only by the owner");
        uint256 tokens = rewardTokens();
        tokenTails.mint(msg.sender, tokens);
        _burn(tokenId);

        return tokens;
    }
    
    function pause() public onlyRole(MINTER_ROLE) {
        _paused = true;
    }

    function unpause() public onlyRole(MINTER_ROLE) {
        _paused = false;
    }

    function random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
    }

    function rewardTokens() private view returns (uint256) {
        uint256 randomNumber = random() % 1000;

        if (randomNumber < 1) {
            return 1000; // 0.1% chance
        } else if (randomNumber < 11) {
            return 100; // 1% chance
        } else if (randomNumber < 111) {
            return 10; // 10% chance
        }
        
        // Default
        return 1;
    }

    function burn(uint256 tokenId) public onlyRole(MINTER_ROLE) {
        _burn(tokenId);
    }

    // Override tokenURI to dynamically generate the full token URI
    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        string memory base = _baseURI();
        return string(abi.encodePacked(base, Strings.toString(tokenId)));
    }

    // Override _burn function to clear the token URI storage
    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControlEnumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
    * Custom accessor to create a unique token
    */
    function mintUniqueTokenTo(
        address _to,
        uint256 _tokenId
    ) public
    {
        super._mint(_to, _tokenId);
    }
}
