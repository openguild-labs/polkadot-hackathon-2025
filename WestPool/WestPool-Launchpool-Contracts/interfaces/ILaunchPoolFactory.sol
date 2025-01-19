// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPoolFactory {
    // Events
    event PoolCreated(
        uint256 indexed poolId,
        address indexed projectToken,
        address indexed acceptedVAsset,
        address poolAddress,
        address projectOwner,
        uint256 startTime,
        uint256 endTime
    );

    // Errors
    error InvalidPoolId();
    error StartTimeMustBeInFuture();
    error EndTimeMustBeAfterStartTime();
    error InvalidProjectTokenAddress();
    error InvalidAcceptedVAssetAddress();
    error TotalProjectTokensMustBeGreaterThanZero();
    error MaxAndMinTokensPerStakerMustBeGreaterThanZero();
    error TargetStakeAmountMustBeGreaterThanZero();

    // Main Functions
    function createPool(
        address _projectToken,
        address _acceptedVAsset,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _totalProjectTokens,
        uint256 _maxVTokensPerStaker,
        uint256 _minVTokensPerStaker,
        uint256 _targetStakeAmount
    ) external returns (uint256 poolId);

    // View Functions
    function pools(uint256 poolId) external view returns (address);
    function poolIsValid(address pool) external view returns (bool);
    function getPoolAddress(uint256 poolId) external view returns (address);
    function getPoolCount() external view returns (uint256);
}
