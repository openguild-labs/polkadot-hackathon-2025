// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./Whitelist.sol";

contract SeminarNFT is
    Initializable,
    OwnableUpgradeable,
    ERC721URIStorageUpgradeable,
    AccessControlUpgradeable
{
    uint256 public nextTokenId;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    WhitelistUpgradeableV2 public whitelist;

    struct SeminarData {
        uint256 seminarId;
        string name;
        string description;
        string image;
        string nameSpeaker;
        string metadataURI;
        address[] speakers;
    }

    mapping(uint256 => SeminarData) public seminars;
    mapping(uint256 => address[]) public seminarSpeakers; // seminar do speaker nói

    event SeminarMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        string metadataURI,
        address[] speakers
    );

    event MetadataUpdated(uint256 indexed tokenId, string metadataURI);

    event RoleAdded(address indexed account, bytes32 role);
    event RoleRemoved(address indexed account, bytes32 role);

    function initialize(
        address admin,
        address whitelistAddress
    ) public initializer {
        __ERC721_init("SeminarNFT", "SNFT");
        __AccessControl_init();
        //_grantRole(ADMIN_ROLE, admin);
        whitelist = WhitelistUpgradeableV2(whitelistAddress);
    }

    function hasRole(
        bytes32 role,
        address account
    ) public view override returns (bool) {
        if (super.hasRole(role, account)) {
            return true;
        }
        return whitelist.hasRole(role, account);
    }

    // vì hợp đồng này kế thừa từ 2 hợp đồng ERC721URIStorageUpgradeable và AccessControlUpgradeable mà cả 2 lớp này đều có hàm này nên cần phải ghi đè hàm supportsInterface
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721URIStorageUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function mintSeminar(
        string memory _name,
        string memory _description,
        string memory _image,
        string memory _nameSpeaker,
        string memory _metadataURI,
        address[] memory _speakers
    ) public onlyRole(ADMIN_ROLE) {
        require(_speakers.length > 0, "Length of speaker must be > 0");

        //de tokenId xuat phat tu 1
        nextTokenId++;
        uint256 tokenId = nextTokenId;

        require(
            seminars[tokenId].seminarId == 0,
            "Seminar with this ID already exists"
        );

        seminars[tokenId] = SeminarData({
            seminarId: tokenId,
            name: _name,
            description: _description,
            image: _image,
            nameSpeaker: _nameSpeaker,
            metadataURI: _metadataURI,
            speakers: _speakers
        });
        seminarSpeakers[tokenId] = _speakers;

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _metadataURI);

        emit SeminarMinted(tokenId, msg.sender, _name, _metadataURI, _speakers);
    }

    function getSeminar(
        uint256 tokenId
    )
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            address[] memory
        )
    {
        require(seminars[tokenId].seminarId != 0, "Seminar does not exist");
        SeminarData memory seminar = seminars[tokenId];
        return (
            seminar.name,
            seminar.description,
            seminar.image,
            seminar.nameSpeaker,
            seminar.metadataURI,
            seminar.speakers
        );
    }
    //nếu thay đổi trên IPFS thì cần phải cập nhật lại metadataURI
    function updateMetadata(
        uint256 tokenId,
        string memory metadataURI
    ) public onlyRole(ADMIN_ROLE) {
        require(seminars[tokenId].seminarId != 0, "Seminar does not exist");
        _setTokenURI(tokenId, metadataURI); //setToken khong su dung duoc
        seminars[tokenId].metadataURI = metadataURI;
        emit MetadataUpdated(tokenId, metadataURI);
    }
    function getSeminarSpeakers(
        uint256 tokenId
    ) public view returns (address[] memory) {
        return seminarSpeakers[tokenId];
    }
}