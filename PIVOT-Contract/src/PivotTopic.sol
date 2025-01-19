// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "forge-std/console.sol";

contract PivotTopic {
    address public owner;
    address public sbtAddress;
    ISBTContract public sbtContract;
    IERC20 public erc20Contract;
    uint256 private _topicId;
    uint16  private _commissionrate = 3;
    uint256 public _totalBalance;
    uint256 public _totalCommission;

    mapping (uint256 topicId => address) private _promoter;
    mapping (address owner => uint256) private _income;
    mapping (address owner => uint256) private _investment;
    mapping (uint256 topicId => uint256) private _fixedInvestment;
    mapping (uint256 topicId => uint256) private _position;
    mapping (uint256 topicId => mapping(uint256 position => address)) private _investAddressMap;

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

    function getIncome(address investor) public view returns(uint256) {
        return _income[investor];
    }

    function getInvestment(address investor) public view returns(uint256) {
        return _investment[investor];
    }

    function getFixedInvestment(uint256 topicId) public view returns(uint256) {
        return _fixedInvestment[topicId];
    }

    function getPromoter(uint256 topicId) public view returns(address) {
        return _promoter[topicId];
    }

    function setERC20Contract(address erc20Address) public {
        require(msg.sender == owner, "Invalid Owner");
        erc20Contract = IERC20(erc20Address);
    }

    function createTopic(uint256 amount) public {

        address promoter = msg.sender;
        console.log(promoter);
        _promoter[_topicId] = msg.sender;

        require(amount > 0,"Insufficient Amount");

        _fixedInvestment[_topicId] = amount;

        uint256 position = 1;

        _investAddressMap[_topicId][position] = promoter;
        erc20Contract.transferFrom(promoter, address(this), amount);
        sbtContract.mint(promoter, _topicId, position, amount);

        position ++;

        _position[_topicId] = position;

        _topicId ++;

        emit CreateTopic(promoter, _topicId, amount);

    }

    function invest(uint256 topicId, uint256 amount) public {

        uint256 fixedInvestment = _fixedInvestment[topicId];
        require(fixedInvestment == amount, "Insufficient Balance");
        address investor = msg.sender;
        erc20Contract.transferFrom(investor, address(this), amount);
        _totalBalance += amount;

        uint256 position = _position[topicId] + 1;

        sbtContract.mint(investor, topicId, position, amount);

        for (uint256 i = 0; i < position; i++) {
            address investAddress = _investAddressMap[topicId][i + 1];
            (bool success, uint256 income) = Math.tryDiv(fixedInvestment, position);
            require(success,"Calculate Fault");
            _income[investAddress] = _income[investAddress] + income;
        }
        _position[topicId] = position;
        emit Invest(investor, topicId, fixedInvestment);
    }

    function withdraw() public {

        address to = msg.sender;
        uint256 income = _income[to];
        require(income >= 0,"Insufficient Balance");
        uint256 investment = _investment[to];

        if(investment < income) {
            (bool success,uint256 diff) = Math.trySub(income, investment);
            require(success,"Calculate Fault");
            uint256 commission = diff / 1000 * _commissionrate;
            _totalCommission = _totalCommission + commission;
            (success,income) = Math.trySub(income, commission);
            require(success,"Calculate Fault");
        }

        erc20Contract.transferFrom(address(this), to, income);
        _income[to] = 0;
        _totalBalance = _totalBalance - income;
        emit Withdraw(msg.sender, income);
    }

    function withdrawCommission(uint256 amount) public {
        require(amount < _totalCommission, "Insufficient Balance");
        require(msg.sender == owner, "Invalid Owner");
        erc20Contract.transferFrom(address(this), owner, amount);
        _totalCommission = _totalCommission - amount;
        emit WithdrawCommission(owner, amount);
    }


}

interface ISBTContract {
    function mint(address to, uint256 topicId, uint256 position, uint256 inv) external;
}
