// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts@4.9.3/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.9.3/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts@4.9.3/utils/Strings.sol";

contract TokenTailsBlessing is ERC721, AccessControlEnumerable {
    string private _baseTokenURI;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC721("Token Tails Blessing", "TTBLESSING") {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _baseTokenURI = "https://api.tokentails.com/blessing/nft/";
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(
        string memory newBaseURI
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseTokenURI = newBaseURI;
    }

    function mintUniqueTokenTo(
        address to,
        uint128 tokenId
    ) external onlyRole(MINTER_ROLE) {
        _mint(to, tokenId);
    }

    function tokenURI(
        uint128 tokenId
    ) public view returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        return string(abi.encodePacked(_baseURI(), Strings.toString(tokenId)));
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControlEnumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
