// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.19;

import "@openzeppelin/contracts@4.9.3/token/ERC721/ERC721.sol";

contract TokenTailsMysteryBox is ERC721 {
    constructor() ERC721("Token Tails Mystery Box", "TokenTailsMysteryBox") {}

    function safeMint(address to) public {
        uint256 tokenId = uint256(uint160(to));
        _safeMint(to, tokenId);
    }

    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "TokenTailsMysteryBox: You are not the owner");
        _burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public pure override(ERC721) returns (string memory) {
        return "https://tokentails.com/utilities/mystery-boxes/mystery-box.json";
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
