// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {IError} from "./IError.sol";

contract rentalNft is ERC1155, AccessControl, ERC1155Supply, IError {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 constant DECIMAL = 10 ** 18;

    constructor(string memory uri) ERC1155(uri) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function setURI(string memory newuri) internal onlyRole(MINTER_ROLE) {
        _setURI(newuri);
    }

    enum PoolStatus{INITIAL, PENDING, LENDING, FINISH}

    struct Pool {
        uint256 id;
        uint256 amount;
        uint256 lendAmount; 
        uint256 price;
        uint256 deadline;
        address lender;
        address borrower; 
        string newuri;
        PoolStatus status;
    }

    struct Event {
        string name;
        address host;
        address[] join_member;
        uint256 nft_id;
        uint256 start_time;
        uint256 end_time;
        bool isDone;
    }

    Event[] public eventList;
    Pool[] public poolMarketplace;
    mapping (address => uint256) ownNft;

    event CreateEvent(string _name, uint256 _nft_id, uint256 _start_time, uint256 _end_time);
    event RegisterWs(uint256 index);
    event List(uint256 _id,  uint256 _amount, uint256 _price, uint256 _deadline);
    event Mint(uint256 id, uint256 amount, string newuri);
    event Rent(uint256 _index, address _lender, uint256 _balance);
    event ReturnNft(uint256 _index);

    function createEvent (string memory _name, uint256 _nft_id, uint256 _start_time, uint256 _end_time) external {
        uint256 ownNftNumber = ownNft[msg.sender];
        require(ownNftNumber > 0, "You don't own nft");
        address[] memory memberList;

        eventList.push(Event({
            name: _name,
            host: msg.sender,
            join_member: memberList,
            nft_id: _nft_id,
            start_time: _start_time,
            end_time: _end_time,
            isDone: false
        }));

        emit CreateEvent(_name, _nft_id, _start_time, _end_time);
    }

    function registerWs (uint256 index) external {
        Event storage _event = eventList[index];
        bool isEligible = isEligibleMember(_event.nft_id);
        require(isEligible, "You are not eligible");
        require(_event.host != msg.sender, "You are host of ws");

        _event.join_member.push(msg.sender);

        emit RegisterWs(index);
    }

    function isEligibleMember (uint256 index) public view returns (bool) {
        Pool storage pool = poolMarketplace[index];

        if (pool.borrower == msg.sender || pool.lender == msg.sender && pool.borrower == address(0)) {
            return true;
        }

        return false;
    }

    function list(uint256 _index, uint256 _id,  uint256 _amount, uint8 _price, uint8 _deadline) external payable {
        uint256 own_token_amount = balanceOf(msg.sender, _id);
        require(_price > 0, "Price is zero!");
        require(_deadline > 0, "Deadline is zero");
        if (_amount > own_token_amount) {
            revert IsNotEnoughNft();
        }

        Pool storage pool = poolMarketplace[_index];
        pool.lendAmount = _amount;
        pool.price = _price * DECIMAL;
        pool.deadline = block.timestamp + _deadline;
        pool.status = PoolStatus.PENDING;

        emit List(_id, _amount, _price, _deadline);
    }

    function rentNft(uint256 _index, address _lender, uint8 _balance) external payable {
        Pool storage pool = poolMarketplace[_index];
        require(_balance * DECIMAL >= pool.lendAmount * pool.price, "Your balance are not enough");

        uint256 fee_rent = pool.lendAmount * pool.price;
        payable (_lender).transfer(fee_rent);

        _safeTransferFrom(_lender, msg.sender, pool.id, pool.lendAmount, "");
        pool.borrower = msg.sender;
        pool.status = PoolStatus.LENDING;
        ownNft[msg.sender]++;
        
        emit Rent(_index, _lender, _balance);
    }


    function isReturnNft (uint256 index) public view returns (bool) {
        Pool storage pool = poolMarketplace[index];
        require(pool.lender == msg.sender, "You are not lender of nft");

        if (pool.deadline < block.timestamp) {
            return true;
        }
        return false;
    }

    function returnNft (uint256 index) external {
        bool isRentingEnd = isReturnNft(index);
        Pool storage pool = poolMarketplace[index];
        require(pool.lender == msg.sender, "You are not lender of nft");

        if (isRentingEnd) {
            _safeTransferFrom(pool.borrower, msg.sender, pool.id, pool.lendAmount, "");
            pool.status = PoolStatus.FINISH;
            pool.borrower = address(0);
            ownNft[msg.sender]--;
            _grantRole(MINTER_ROLE, msg.sender);
        }

        emit ReturnNft(index);
    }

   function getAllWs() external view returns (Event[] memory) {
        return eventList;
    }
   
    function getAllNft() external view returns (Pool[] memory) {
        return poolMarketplace;
    }

    function mint(uint256 id, uint256 amount, string memory newuri)
        public
        payable 
        onlyRole(MINTER_ROLE)
    {
        setURI(newuri);
        _mint(msg.sender, id, amount, "");

        poolMarketplace.push(Pool({
            id: id,
            amount: amount,
            lendAmount: 0,
            price: 0,
            deadline: block.timestamp,
            lender: msg.sender,
            borrower: address(0),
            newuri: newuri,
            status: PoolStatus.INITIAL
        }));
        ownNft[msg.sender]++;

        emit Mint(id, amount, newuri);
    }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}