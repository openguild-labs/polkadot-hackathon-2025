// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/token/ERC20/ERC20.sol";
import "@openzeppelin/token/ERC20/IERC20.sol";
import "@openzeppelin/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/access/Ownable.sol";
import "@openzeppelin/utils/ReentrancyGuard.sol";
import "@openzeppelin/utils/Pausable.sol";
import {console} from "forge-std/console.sol";

contract BifrostEarningMock is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    IERC20 public earnVAsset;
    uint256 public APY; // APY in basis points (1% = 100)
    uint8 public assetDecimals;

    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 accumulatedRewards;
    }

    mapping(address => StakeInfo) public stakes;
    uint256 public totalStaked;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event APYUpdated(uint256 newAPY);

    constructor(address _earnVAsset, uint256 _initialAPY) Ownable(msg.sender) {
        earnVAsset = IERC20(_earnVAsset);
        APY = _initialAPY * 100;

        // Fetch and store the decimals of the token
        assetDecimals = ERC20(_earnVAsset).decimals();
    }

    function setAPY(uint256 _newAPY) external onlyOwner {
        require(_newAPY <= 10000, "APY too high"); // Max 100%
        APY = _newAPY * 100;
        emit APYUpdated(_newAPY);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function stake(uint256 amount) public nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");

        if (stakes[msg.sender].amount > 0) {
            // Calculate and store rewards earned so far
            uint256 earnedRewards = calculateRewards(msg.sender);
            uint256 newTotal = stakes[msg.sender].amount + amount;

            stakes[msg.sender] = StakeInfo({
                amount: newTotal,
                startTime: block.timestamp,
                accumulatedRewards: earnedRewards
            });
        } else {
            stakes[msg.sender] = StakeInfo({
                amount: amount,
                startTime: block.timestamp,
                accumulatedRewards: 0
            });
        }

        earnVAsset.safeTransferFrom(msg.sender, address(this), amount);
        totalStaked += amount;
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) public nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "Insufficient staked amount");

        // Calculate rewards
        uint256 rewardShare = (amount * userStake.accumulatedRewards) /
            userStake.amount;
        uint256 currentReward = calculateRewards(msg.sender);
        uint256 totalReward = rewardShare + currentReward;

        // Update state
        userStake.amount -= amount;

        if (userStake.amount == 0) {
            delete stakes[msg.sender];
        } else {
            userStake.accumulatedRewards =
                currentReward +
                userStake.accumulatedRewards -
                rewardShare;
            userStake.startTime = block.timestamp; // Reset the start time for the remaining stake
        }

        totalStaked -= amount;

        earnVAsset.safeTransfer(msg.sender, amount + totalReward);

        emit Unstaked(msg.sender, amount, totalReward);
    }

    function calculateRewards(address user) public view returns (uint256) {
        StakeInfo storage userStake = stakes[user];
        if (userStake.amount == 0) return 0;

        uint256 timeStaked = block.timestamp - userStake.startTime;

        // Calculate yearly reward based on APY in basis points
        uint256 yearlyReward = (userStake.amount * APY) / 10000;

        // Proportional reward for time staked
        uint256 reward = (yearlyReward * timeStaked) / (365 days);

        return reward;
    }

    function getStakeInfo(
        address user
    )
        external
        view
        returns (uint256 amount, uint256 startTime, uint256 pendingReward)
    {
        StakeInfo storage userStake = stakes[user];
        return (
            userStake.amount,
            userStake.startTime,
            calculateRewards(user) + userStake.accumulatedRewards
        );
    }

    function emergencyWithdraw(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        IERC20(token).safeTransfer(owner(), balance);
    }
}

contract MockVDot is ERC20 {
    constructor() ERC20("vDOT", "vDOT") {
        _mint(msg.sender, 1_000_000_000 ether); // Mint 1 billion tokens to the deployer
    }

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}
