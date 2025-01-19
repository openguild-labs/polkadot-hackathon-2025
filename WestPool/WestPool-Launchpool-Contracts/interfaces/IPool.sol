// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPool {
    struct APRSnapshot {
        uint256 timestamp;
        uint256 apr;
        uint256 totalReservedAtSnapshot;
    }

    struct ProjectDetail {
        address projectOwner;
        address projectToken;
        address acceptedVAsset;
        uint256 startTime;
        uint256 endTime;
        uint256 totalProjectTokens;
        uint256 maxVTokensPerStaker;
        uint256 minVTokensPerStaker;
        uint256 targetStakeAmount;
        uint256 remainingRewards;
        uint256 totalReserved;
    }

    struct StakeInfo {
        uint256 amount;
        uint256 timestamp;
        uint256 lastRewardCalculation;
        uint256 accumulatedRewards;
        uint256 reservedRewards;
        uint256 lastAprIndex;
        bool isActive;
    }

    // Events
    event Staked(address indexed investor, uint256 amount);
    event Unstaked(address indexed investor, uint256 amount, uint256 duration);
    event RewardsClaimed(address indexed investor, uint256 amount);
    event APRUpdated(uint256 oldAPR, uint256 newAPR);
    event ReservedRewardsRecalculated(uint256 oldTotal, uint256 newTotal);

    // Main Functions
    function stake(uint256 amount) external;
    function unstake(uint256 amount) external;
    function claimRewards() external;

    // Calculation View Functions
    function calculateLoyaltyMultiplier(
        uint256 stakeDuration
    ) external pure returns (uint256);
    function calculateTimeBasedReward(
        uint256 amount,
        uint256 startTime,
        uint256 endTime,
        uint256 loyaltyMultiplier
    ) external view returns (uint256);
    function calculateCurrentAPR() external view returns (uint256);
    function calculateTimeWeightedAPR(
        uint256 startTime,
        uint256 endTime
    ) external view returns (uint256);
    function calculateProjectedRewards(
        uint256 amount,
        uint256 duration,
        uint256 apr,
        uint256 loyaltyMultiplier
    ) external pure returns (uint256);
    function getClaimableRewards(
        address investor
    ) external view returns (uint256);

    // Regular View Functions
    function getAcceptedVAsset() external view returns (address);
    function getProjectToken() external view returns (address);
    function getTotalProjectToken() external view returns (uint256);
    function getStartTime() external view returns (uint256);
    function getEndTime() external view returns (uint256);
    function getMaxVTokensPerStaker() external view returns (uint256);
    function getMinVTokensPerStaker() external view returns (uint256);
    function getStakedAmount(address investor) external view returns (uint256);
    function getTotalStaked() external view returns (uint256);
    function getAPRHistoryLength() external view returns (uint256);
    function aprHistory(
        uint256 index
    ) external view returns (APRSnapshot memory);
    function activeStakers(uint256 index) external view returns (address);
    function stakerIndexes(address staker) external view returns (uint256);
    function stakes(address staker) external view returns (StakeInfo memory);
}
