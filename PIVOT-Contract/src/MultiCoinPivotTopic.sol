// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PivotTopic {
    address public owner;
    address public sbtAddress;
    ISBTContract public sbtContract;
    uint256 private _topicId;
    uint16  private _commissionrate = 3;
    
    mapping (uint256 topicId => uint256) public _totalCommission;
    mapping (uint256 topicId => uint256) public _totalBalance;
    mapping (uint256 topicId => address) private _promoter;
    mapping (address investor => mapping(uint256 topicId => uint256)) private _income;
    mapping (address investor => mapping(uint256 topicId => uint256)) private _investment;
    mapping (uint256 topicId => uint256) private _fixedInvestment;
    mapping (uint256 topicId => uint256) private _position;
    mapping (uint256 topicId => mapping(uint256 position => address)) private _investAddressMap;

    mapping (uint256 topicId => address) public topicCoin;

    event CreateTopic(address indexed promoter, uint256 topicId, uint256 investment);
    event Invest(address indexed investor, uint256 indexed topicId, uint256 amount);
    event Withdraw(address indexed to, uint256 amount);
    event WithdrawCommission(address indexed owner, uint256 amount);

    constructor(address a) {
        owner = msg.sender;
        sbtAddress = a;
        sbtContract = ISBTContract(a);
        _topicId = 1;
    }

    function getIncome(address investor, uint256 topicId) public view returns(uint256) {
        return _income[investor][topicId];
    }

    function getInvestment(address investor, uint256 topicId) public view returns(uint256) {
        return _investment[investor][topicId];
    }

    function getFixedInvestment(uint256 topicId) public view returns(uint256) {
        return _fixedInvestment[topicId];
    }

    function getPromoter(uint256 topicId) public view returns(address) {
        return _promoter[topicId];
    }


    function createTopic(uint256 amount, address erc20Address) public {

        address promoter = msg.sender;

        _promoter[_topicId] = msg.sender;

        require(amount > 0,"Insufficient Amount");

        _fixedInvestment[_topicId] = amount;

        uint256 position = 1;

        _investAddressMap[_topicId][position] = promoter;

        position ++;

        _position[_topicId] = position;

        IERC20 erc20Contract = IERC20(erc20Address);
        erc20Contract.transfer(address(this), amount);
        topicCoin[_topicId] = erc20Address;

        _topicId ++;

        emit CreateTopic(promoter, _topicId, amount);

    }

    function invest(uint256 topicId, uint256 amount) public {

        uint256 fixedInvestment = _fixedInvestment[topicId];
        require(fixedInvestment == amount, "Insufficient Balance");

        address erc20Address = topicCoin[topicId];
        IERC20 erc20Contract = IERC20(erc20Address);
        erc20Contract.transfer(address(this), amount);
        _totalBalance[topicId] = _totalBalance[topicId] + amount;

        uint256 position = _position[topicId] + 1;

        sbtContract.mint(msg.sender, topicId, position);

        for (uint256 i = 0; i < position; i++) {
            address investAddress = _investAddressMap[topicId][i + 1];
            (bool success, uint256 income) = Math.tryDiv(fixedInvestment, position);
            require(success,"Calculate Fault");
            _income[investAddress][topicId] = _income[investAddress][topicId] + income;
        }
        _position[topicId] = position;
        emit Invest(msg.sender, topicId, fixedInvestment);
    }

    function withdraw(uint256 topicId) public {

        address to = msg.sender;
        uint256 income = _income[to][topicId];
        require(income >= 0,"Insufficient Balance");
        uint256 investment = _investment[to][topicId];

        if(investment < income) {
            (bool success,uint256 diff) = Math.trySub(income, investment);
            require(success,"Calculate Fault");
            uint256 commission = diff / 1000 * _commissionrate;
            _totalCommission[topicId] = _totalCommission[topicId] + commission;
            (success,income) = Math.trySub(income, commission);
            require(success,"Calculate Fault");
        }

        address erc20Address = topicCoin[topicId];
        IERC20 erc20Contract = IERC20(erc20Address);
        erc20Contract.transferFrom(address(this), to, income);
        _income[to][topicId] = 0;
        _totalBalance[topicId] = _totalBalance[topicId] - income;
        emit Withdraw(msg.sender, income);
    }

    function withdrawCommission(uint256 amount, uint256 topicId) public {
        require(amount < _totalCommission[topicId], "Insufficient Balance");
        require(msg.sender == owner, "Invalid Owner");
        address erc20Address = topicCoin[topicId];
        IERC20 erc20Contract = IERC20(erc20Address);
        erc20Contract.transferFrom(address(this), owner, amount);
        _totalCommission[topicId] = _totalCommission[topicId] - amount;
        emit WithdrawCommission(owner, amount);
    }


}

interface ISBTContract {
    function mint(address to, uint256 topicId, uint256 position) external;
}
