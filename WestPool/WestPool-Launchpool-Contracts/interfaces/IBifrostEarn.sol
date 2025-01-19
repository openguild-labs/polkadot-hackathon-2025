// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IBifrostEarningMock {
    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event APYUpdated(uint256 newAPY);

    // Public Variables
    function earnVAsset() external view returns (address);
    function APY() external view returns (uint256);
    function totalStaked() external view returns (uint256);
    function stakes(
        address user
    ) external view returns (uint256 amount, uint256 startTime);

    // Functions
    function setAPY(uint256 _newAPY) external;
    function pause() external;
    function unpause() external;
    function stake(uint256 amount) external;
    function unstake(uint256 amount) external;
    function calculateRewards(address user) external view returns (uint256);
    function getStakeInfo(
        address user
    )
        external
        view
        returns (uint256 amount, uint256 startTime, uint256 pendingReward);
    function emergencyWithdraw(address token) external;
}
