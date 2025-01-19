// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/access/Ownable.sol";
import {Pool} from "./Pool.sol";

contract PoolFactory is Ownable {
    /////////////////////////////////////////////////////////////////
    //////////////////////// CONTRACT STATES ///////////////////////
    ///////////////////////////////////////////////////////////////
    // Counter for pool IDs
    uint256 private _nextPoolId;
    address private BifrostEarningContract;

    // Mapping from pool ID => pool address
    mapping(uint256 => address) public pools;

    // Mapping from project pool address => is valid/not valid
    mapping(address => bool) poolIsValid;

    /////////////////////////////////////////////////////////////////
    //////////////////////// CONTRACT ERRORS ///////////////////////
    ///////////////////////////////////////////////////////////////
    error InvalidPoolId();
    error StartTimeMustBeInFuture();
    error EndTimeMustBeAfterStartTime();
    error InvalidProjectTokenAddress();
    error InvalidAcceptedVAssetAddress();
    error InvalidBifrostEarningAddress();
    error InvalidTokenAmount();
    error TargetStakeAmountMustBeGreaterThanZero();

    /////////////////////////////////////////////////////////////////
    //////////////////////// CONTRACT EVENTS ///////////////////////
    ///////////////////////////////////////////////////////////////
    event PoolCreated(
        uint256 indexed poolId,
        address indexed projectOwner,
        address indexed projectToken,
        address acceptedVAsset,
        address poolAddress,
        uint256 startTime,
        uint256 endTime
    );

    constructor(address _BifrostEarningContract) Ownable(_msgSender()) {
        if (_BifrostEarningContract == address(0)) {
            revert InvalidBifrostEarningAddress();
        }
        _nextPoolId = 1; // Start pool IDs from 1
        BifrostEarningContract = _BifrostEarningContract;
    }

    function createPool(
        address _projectToken,
        address _acceptedVAsset,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _totalProjectTokens,
        uint256 _maxVTokensPerStaker,
        uint256 _minVTokensPerStaker,
        uint256 _targetStakeAmount
    ) public returns (uint256 poolId) {
        _initValidation(
            _projectToken,
            _acceptedVAsset,
            _startTime,
            _endTime,
            _totalProjectTokens,
            _maxVTokensPerStaker,
            _minVTokensPerStaker,
            _targetStakeAmount
        );

        address poolAddress = address(
            new Pool(
                msg.sender,
                _projectToken,
                _acceptedVAsset,
                BifrostEarningContract,
                _startTime,
                _endTime,
                _totalProjectTokens,
                _maxVTokensPerStaker,
                _minVTokensPerStaker,
                _targetStakeAmount
            )
        );

        poolId = _nextPoolId++;

        pools[poolId] = poolAddress;
        poolIsValid[poolAddress] = true;

        emit PoolCreated(
            poolId,
            msg.sender,
            _projectToken,
            _acceptedVAsset,
            poolAddress,
            _startTime,
            _endTime
        );

        return poolId;
    }

    function _initValidation(
        address _projectToken,
        address _acceptedVAsset,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _totalProjectTokens,
        uint256 _maxVTokensPerStaker,
        uint256 _minVTokensPerStaker,
        uint256 _targetStakeAmount
    )
        internal
        view
        validTimeFrame(_startTime, _endTime)
        validAddresses(_projectToken, _acceptedVAsset)
        validTokenAmounts(
            _totalProjectTokens,
            _maxVTokensPerStaker,
            _minVTokensPerStaker
        )
        validTargetStakeAmount(_targetStakeAmount)
        returns (bool)
    {
        return true;
    }

    function setBifrostEarningContract(
        address _BifrostEarningContract
    ) public onlyOwner {
        if (_BifrostEarningContract == address(0))
            revert InvalidBifrostEarningAddress();
        BifrostEarningContract = _BifrostEarningContract;
    }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////// REGULAR VIEW FUNCTIONS /////////////////////////
    ////////////////////////////////////////////////////////////////////////
    function getBifrostEarningContract() public view returns (address) {
        return BifrostEarningContract;
    }

    function getPoolAddress(
        uint256 poolId
    ) public view isValidPoolId(poolId) returns (address) {
        return pools[poolId];
    }

    function isPoolValid(address poolAddress) public view returns (bool) {
        return poolIsValid[poolAddress];
    }

    function getPoolCount() public view returns (uint256) {
        return _nextPoolId - 1;
    }

    //////////////////////////////////////////////////////////////////////////
    /////////////////////////////// MODIFIERS ///////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    modifier isValidPoolId(uint256 poolId) {
        if (poolId >= _nextPoolId) {
            revert InvalidPoolId();
        }
        _;
    }
    modifier validTimeFrame(uint256 _startTime, uint256 _endTime) {
        if (_startTime <= block.timestamp) revert StartTimeMustBeInFuture();
        if (_endTime <= _startTime) revert EndTimeMustBeAfterStartTime();
        _;
    }

    modifier validAddresses(address _projectToken, address _acceptedVAsset) {
        if (BifrostEarningContract == address(0))
            revert InvalidBifrostEarningAddress();
        if (_projectToken == address(0)) revert InvalidProjectTokenAddress();
        if (_acceptedVAsset == address(0))
            revert InvalidAcceptedVAssetAddress();
        _;
    }

    modifier validTokenAmounts(
        uint256 _totalProjectTokens,
        uint256 _maxVTokensPerStaker,
        uint256 _minVTokensPerStaker
    ) {
        if (
            (_totalProjectTokens == 0 ||
                _maxVTokensPerStaker == 0 ||
                _minVTokensPerStaker == 0) ||
            (_maxVTokensPerStaker < _minVTokensPerStaker)
        ) revert InvalidTokenAmount();
        _;
    }

    modifier validTargetStakeAmount(uint256 _targetStakeAmount) {
        if (_targetStakeAmount == 0)
            revert TargetStakeAmountMustBeGreaterThanZero();
        _;
    }
}
