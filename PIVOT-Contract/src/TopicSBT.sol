// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TopicSBT is ERC721, Ownable {

    uint256 private _nextTokenId;
    bool private _disabled = true;

    mapping(uint256 tokenId => uint256) public topicId;
    mapping(uint256 tokenId => uint256) public position;
    mapping(uint256 tokenId => uint256) public investmentAmount;


    event Mint(address indexed to, uint256 tokenId, uint256 topicId, uint256 position, uint256 investmentAmount);


    constructor(address initialOwner, string memory name, string memory symbol) ERC721(name, symbol) Ownable(initialOwner) {
        _nextTokenId = 1;
    }

    function mint(address to, uint256 id, uint256 pos, uint256 inv) public onlyOwner{

        _safeMint(to, _nextTokenId);

        topicId[_nextTokenId] = id;

        position[_nextTokenId] = pos;

        investmentAmount[_nextTokenId] = inv;

        emit Mint(to, _nextTokenId, id, pos, inv);

        _nextTokenId++;

    }

    function approve(address to, uint256 tokenId)  public override {
        require(!_disabled,"Method disabled");
    }

    function setApprovalForAll(address operator, bool approved) public override {
        require(!_disabled,"Method disabled");
    }

    function transferFrom(address from, address to, uint256 tokenId) public override {
        require(!_disabled,"Method disabled");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override {
        require(!_disabled,"Method disabled");
    }


}
