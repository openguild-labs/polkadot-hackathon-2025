// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts@4.9.3/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.9.3/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts@4.9.3/utils/Strings.sol";

struct PlayData {
    uint32 playCount;
    uint32 lastPlayDate;
}

contract TokenTailsCat is ERC721, AccessControlEnumerable {
    string private _baseTokenURI;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    mapping(uint128 => PlayData) public playData;

    constructor() ERC721("Token Tails Cat", "TTCAT") {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _baseTokenURI = "https://api.tokentails.com/cat/nft/";
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory newBaseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseTokenURI = newBaseURI;
    }

    function mintUniqueTokenTo(address to, uint128 tokenId) external onlyRole(MINTER_ROLE) {
        _mint(to, tokenId);
    }

    function tokenURI(uint128 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        return string(abi.encodePacked(_baseURI(), Strings.toString(tokenId)));
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControlEnumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function incrementPlayCount(uint128 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Caller is not the owner of the NFT");
        
        uint32 today = uint32(block.timestamp / 86400); // Calculate current day as an integer
        require(playData[tokenId].lastPlayDate != today, "Play count already incremented today");

        playData[tokenId].playCount += 1;
        playData[tokenId].lastPlayDate = today;
    }

    function getPlayData(uint128 tokenId) public view returns (uint32 playCount, uint32 lastPlayDate) {
        return (playData[tokenId].playCount, playData[tokenId].lastPlayDate);
    }

    function resetCount(uint128 tokenId) public onlyRole(MINTER_ROLE) {
        delete playData[tokenId];
    }
}
