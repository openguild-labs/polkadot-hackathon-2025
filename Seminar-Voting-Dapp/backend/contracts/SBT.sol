// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "./Whitelist.sol";

contract CertificationSBT is Ownable, ERC1155Supply {
    WhitelistUpgradeableV2 whiteList;

    modifier onlyAdmin() {
        require(whiteList.isAdmin(msg.sender));
        _;
    }

    using Strings for uint256;

    /* ============ Events ============ */
    event CreatedSoul(
        address indexed creator,
        uint256 tokenId,
        string soulName
    );
    event SoulMinted(address indexed to, uint256 indexed soulId);
    /* ============ Structs ============ */
    struct SoulContainer {
        string soulName;
        string description;
        uint256 registeredTimestamp;
        uint256 startDateTimestamp;
        uint256 endDateTimestamp;
        string metadataURI;
    }

    /* ============ State Variables ============ */
    string public name;
    string public symbol;
    string private _baseURI;
    mapping(uint256 => SoulContainer) public soulIdToSoulContainer;
    uint256 public latestUnusedTokenId;

    /* ============ Constructor ============ */
    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        address whitelistAddress
    ) ERC1155("") Ownable(msg.sender) {
        name = name_;
        symbol = symbol_;
        _baseURI = baseURI_; // liên kết cho metadata.
        whiteList = WhitelistUpgradeableV2(whitelistAddress);
    }

    /* ============ Functions ============ */

    function createSoul(
        string memory soulName_,
        string memory description_,
        uint256 startDateTimestamp_,
        uint256 endDateTimestamp_,
        string memory metadataURI_
    ) public onlyAdmin {
        SoulContainer memory soulMetadata = SoulContainer({
            soulName: soulName_,
            description: description_,
            registeredTimestamp: block.timestamp,
            startDateTimestamp: startDateTimestamp_,
            endDateTimestamp: endDateTimestamp_,
            metadataURI: metadataURI_
        });

        soulIdToSoulContainer[latestUnusedTokenId] = soulMetadata;
        emit CreatedSoul(_msgSender(), latestUnusedTokenId, soulName_);

        latestUnusedTokenId++;
    }

    function mint(address to, uint256 soulId) external onlyAdmin {
        require(soulId < latestUnusedTokenId, "SoulId is not created yet");

        uint256 startDateTimestamp = soulIdToSoulContainer[soulId]
            .startDateTimestamp;
        require(block.timestamp >= startDateTimestamp, "Mint has not started");

        uint256 endDateTimestamp = soulIdToSoulContainer[soulId]
            .endDateTimestamp;
        require(
            endDateTimestamp == 0 || block.timestamp < endDateTimestamp,
            "Mint has ended"
        );

        _mint(to, soulId, 1, "");
        emit SoulMinted(to, soulId);
    }
    // lay url cua metadata
    function uri(uint256 soulId) public view override returns (string memory) {
        require(soulId <= latestUnusedTokenId, "SoulID not created");
        string memory customURI = soulIdToSoulContainer[soulId].metadataURI;
        return
            bytes(customURI).length > 0
                ? customURI
                : string(abi.encodePacked(_baseURI, soulId.toString()));
    }

    function setBaseURI(string memory baseURI_) external onlyAdmin {
        _baseURI = baseURI_;
    }

    /**
     * @dev Overrides ERC1155's transfer functions to prevent transfers.
     */
    function safeTransferFrom(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public pure override {
        revert("Soulbound Token: transfer not allowed");
    }

    function safeBatchTransferFrom(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public pure override {
        revert("Soulbound Token: batch transfer not allowed");
    }
}
/*
Muốn tạo token để mint cho seminar thì tạo token trước:
createSoul(
    "Seminar Certificate", // Tên SBT
    "A certificate awarded for attending the seminar.", // Mô tả
    block.timestamp, // Bắt đầu ngay lập tức
    0 // Không có thời gian hết hạn
);
rồi sau đó mint cho người chỉ định
mint(UserAddress, 0); // Mint token ID 0 cho địa chỉ người dùng

*/