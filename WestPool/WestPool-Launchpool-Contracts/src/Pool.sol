// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/utils/ReentrancyGuard.sol";
import {IBifrostEarningMock} from "../interfaces/IBifrostEarn.sol";

contract Pool is Ownable, ReentrancyGuard {
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
        uint256 targetStakeAmount; // Target amount for APR adjustment
        uint256 remainingRewards;
        uint256 totalReserved;
    }

    struct StakeInfo {
        uint256 amount;
        uint256 timestamp;
        uint256 lastRewardCalculation;
        uint256 accumulatedRewards;
        uint256 reservedRewards;
        uint256 lastAprIndex; // Track which APR snapshot was used for reservation
        bool isActive;
    }

    /////////////////////////////////////////////////////////////////
    //////////////////////// CONTRACT STATES ///////////////////////
    ///////////////////////////////////////////////////////////////
    ProjectDetail internal projectDetail;
    IBifrostEarningMock public immutable BifrostEarningContract;

    uint256 internal totalStaked;
    uint256 private projectOwnerReward;

    uint256 private constant SECONDS_IN_YEAR = 365 days;
    /**
     * @dev Pull from FE, divide by 100 (*10**2) to get the actual percentage
     * @notice multiply by 100 (*10**2) to all value (except blocktime value)
     * @notice 23.45 => 2345
     */
    uint256 public constant DECIMALS = 2; // taking 2 decimal places
    uint256 private constant INITIAL_APR = 800 * 10 ** DECIMALS; // 800%
    uint256 private constant MIN_APR = 50 * 10 ** DECIMALS; // 50%
    uint256 private constant MINIMUM_STAKE_DURATION = 24 hours;
    uint256 private constant MAX_LOYALTY_MULTIPLIER = 150 * 10 ** DECIMALS; // 150% maximum multiplier
    uint256 private constant LOYALTY_PERIOD = 7 days; // Time to reach maximum multiplier

    APRSnapshot[] public aprHistory;

    address[] public activeStakers;
    mapping(address => uint256) public stakerIndexes;

    mapping(address => StakeInfo) public stakes;

    /////////////////////////////////////////////////////////////////
    //////////////////////// CONTRACT EVENTS ///////////////////////
    ///////////////////////////////////////////////////////////////
    event Staked(address indexed investor, uint256 amount);
    event Unstaked(address indexed investor, uint256 amount, uint256 duration);
    event RewardsClaimed(address indexed investor, uint256 amount);
    event APRUpdated(uint256 oldAPR, uint256 newAPR);
    event ReservedRewardsRecalculated(uint256 oldTotal, uint256 newTotal);

    /////////////////////////////////////////////////////////////////
    //////////////////////// CONTRACT ERRORS ///////////////////////
    ///////////////////////////////////////////////////////////////
    error ERC20TransferFailed();
    error NotEnoughERC20Allowance();
    error NoActiveStake();
    error MinimumStakeDurationNotMet();
    error RemainingStakeBelowMinimum();
    error InsufficientRewardsAvailable();
    error InvalidStakingTimeFrame();
    error TotalStakeCannotExceedMaxStaking();
    error TotalStakeCannotLowerMinStaking();

    /////////////////////////////////////////////////////////////////
    ////////////////// VALIDATE POOL INFO ERRORS ///////////////////
    ///////////////////////////////////////////////////////////////
    error StartTimeMustBeInFuture();
    error EndTimeMustBeAfterStartTime();
    error InvalidProjectTokenAddress();
    error InvalidAcceptedVAssetAddress();
    error InvalidBifrostEarningAddress();
    error TotalProjectTokensMustBeGreaterThanZero();
    error MaxAndMinTokensPerStakerMustBeGreaterThanZero();
    error TargetStakeAmountMustBeGreaterThanZero();

    function _initValidation(
        address _projectToken,
        address _acceptedVAsset,
        address _BifrostEarningContract,
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
        validAddresses(_projectToken, _acceptedVAsset, _BifrostEarningContract)
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
    constructor(
        address _projectOwner,
        address _projectToken,
        address _acceptedVAsset,
        address _BifrostEarningContract,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _totalProjectTokens,
        uint256 _maxVTokensPerStaker,
        uint256 _minVTokensPerStaker,
        uint256 _targetStakeAmount
    ) Ownable(_projectOwner) {
        _initValidation(
            _projectToken,
            _acceptedVAsset,
            _BifrostEarningContract,
            _startTime,
            _endTime,
            _totalProjectTokens,
            _maxVTokensPerStaker,
            _minVTokensPerStaker,
            _targetStakeAmount
        );
        projectDetail = ProjectDetail({
            projectOwner: _projectOwner,
            projectToken: _projectToken,
            acceptedVAsset: _acceptedVAsset,
            startTime: _startTime,
            endTime: _endTime,
            totalProjectTokens: _totalProjectTokens,
            maxVTokensPerStaker: _maxVTokensPerStaker,
            minVTokensPerStaker: _minVTokensPerStaker,
            targetStakeAmount: _targetStakeAmount,
            remainingRewards: _totalProjectTokens,
            totalReserved: 0
        });

        aprHistory.push(
            APRSnapshot({
                timestamp: block.timestamp,
                apr: INITIAL_APR,
                totalReservedAtSnapshot: 0
            })
        );

        BifrostEarningContract = IBifrostEarningMock(_BifrostEarningContract);
        projectOwnerReward = 0;
        totalStaked = 0;
    }

    /////////////////////////////////////////////////////////////////
    /////////////////////// STAKING FUNCTION ///////////////////////
    ///////////////////////////////////////////////////////////////
    function stake(
        uint256 amount
    )
        external
        nonReentrant
        validStakingTimeFrame
        totalStakeCannotExceedMaxStaking(amount, _msgSender())
        totalStakeCannotLowerMinStaking(amount, _msgSender())
    {
        address investor = _msgSender();

        // Update totalStaked first to reflect the new state
        totalStaked += amount;

        // Calculate new APR after updating totalStaked
        uint256 newAPR = calculateCurrentAPR();
        uint256 oldAPR = aprHistory.length > 0
            ? aprHistory[aprHistory.length - 1].apr
            : INITIAL_APR;

        // If APR would change, recalculate all reserved rewards first
        if (newAPR != oldAPR) {
            // Do not recalculate the staker who is staking now, it has been handle in the function
            recalculateReservedRewards(_msgSender());
            aprHistory.push(
                APRSnapshot({
                    timestamp: block.timestamp,
                    apr: newAPR,
                    totalReservedAtSnapshot: projectDetail.totalReserved
                })
            );
        }

        // Calculate this stake's projected rewards
        uint256 remainingDuration = projectDetail.endTime - block.timestamp;
        uint256 projectedRewards = calculateProjectedRewards(
            amount,
            remainingDuration,
            newAPR,
            MAX_LOYALTY_MULTIPLIER
        );

        // Check if enough rewards are available
        if (projectedRewards > projectDetail.remainingRewards) {
            revert InsufficientRewardsAvailable();
        }

        // Update stake info
        if (!stakes[investor].isActive) {
            // Add to active stakers list
            stakerIndexes[investor] = activeStakers.length;
            activeStakers.push(investor);
        } else {
            // Update existing stake's accumulated rewards
            updateAccumulatedRewards(investor);
        }

        stakes[investor] = StakeInfo({
            amount: stakes[investor].amount + amount,
            timestamp: block.timestamp,
            lastRewardCalculation: block.timestamp,
            accumulatedRewards: stakes[investor].accumulatedRewards,
            reservedRewards: projectedRewards,
            lastAprIndex: aprHistory.length - 1,
            isActive: true
        });

        // Update pool state
        projectDetail.remainingRewards -= projectedRewards;
        projectDetail.totalReserved += projectedRewards;

        // Transfer tokens
        bool success = IERC20(getAcceptedVAsset()).transferFrom(
            investor,
            address(this),
            amount
        );
        if (!success) {
            revert ERC20TransferFailed();
        }

        IERC20(projectDetail.acceptedVAsset).approve(
            address(BifrostEarningContract),
            amount
        );
        BifrostEarningContract.stake(amount);

        emit Staked(investor, amount);
    }

    ///////////////////////////////////////////////////////////////////
    ////////////////////// UNSTAKING FUNCTION ////////////////////////
    /////////////////////////////////////////////////////////////////
    function unstake(uint256 amount) external nonReentrant {
        address investor = _msgSender();
        StakeInfo storage userStake = stakes[investor];

        if (!userStake.isActive) revert NoActiveStake();
        require(
            userStake.amount >= amount,
            "Cannot unstake more than staked amount"
        );

        uint256 stakeDuration = block.timestamp - userStake.timestamp;
        if (stakeDuration < MINIMUM_STAKE_DURATION) {
            revert MinimumStakeDurationNotMet();
        }

        // Calculate current rewards before unstaking
        updateAccumulatedRewards(investor);

        // Calculate new APR after this unstake
        totalStaked -= amount;
        uint256 newAPR = calculateCurrentAPR();
        uint256 oldAPR = aprHistory[aprHistory.length - 1].apr;

        // If APR would change, recalculate all reserved rewards first
        if (newAPR != oldAPR) {
            // Return this user's reserved rewards before recalculation
            projectDetail.remainingRewards += userStake.reservedRewards;
            projectDetail.totalReserved -= userStake.reservedRewards;

            // Recalculate for all other stakers
            // Do not recalculate the staker who is unstaking now, it has been handle in the function
            recalculateReservedRewards(_msgSender());
            aprHistory.push(
                APRSnapshot({
                    timestamp: block.timestamp,
                    apr: newAPR,
                    totalReservedAtSnapshot: projectDetail.totalReserved
                })
            );
        } else {
            // Even if APR doesn't change, we need to update this user's reservation
            projectDetail.remainingRewards += userStake.reservedRewards;
            projectDetail.totalReserved -= userStake.reservedRewards;
        }

        // Update user's stake
        userStake.amount -= amount;

        // If the user unstake after the staking periods, do not calculate the rewards
        if (block.timestamp < projectDetail.endTime) {
            if (userStake.amount > 0) {
                // If partial unstake, calculate new reservation for remaining amount
                uint256 remainingDuration = projectDetail.endTime -
                    block.timestamp;
                uint256 newReservation = calculateProjectedRewards(
                    userStake.amount,
                    remainingDuration,
                    newAPR,
                    MAX_LOYALTY_MULTIPLIER
                );

                userStake.reservedRewards = newReservation;
                userStake.lastAprIndex = aprHistory.length - 1;

                projectDetail.remainingRewards -= newReservation;
                projectDetail.totalReserved += newReservation;
            } else {
                // If fully unstaking, remove from active stakers
                userStake.isActive = false;
                userStake.reservedRewards = 0;

                // Remove from active stakers array
                uint256 stakerIndex = stakerIndexes[investor];
                address lastStaker = activeStakers[activeStakers.length - 1];
                activeStakers[stakerIndex] = lastStaker;
                stakerIndexes[lastStaker] = stakerIndex;
                activeStakers.pop();
            }
        }

        // Unstake from Bifrost
        projectOwnerReward += BifrostEarningContract.calculateRewards(
            address(this)
        );
        BifrostEarningContract.unstake(amount);

        IERC20(projectDetail.acceptedVAsset).approve(address(this), amount);

        // Transfer tokens back to user
        bool success = IERC20(projectDetail.acceptedVAsset).transfer(
            investor,
            amount
        );

        if (!success) {
            revert ERC20TransferFailed();
        }

        emit Unstaked(investor, amount, stakeDuration);

        if (newAPR != oldAPR) {
            emit APRUpdated(oldAPR, newAPR);
        }
    }

    /////////////////////////////////////////////////////////////////
    ////////////////////// REWARDS FUNCTIONS ///////////////////////
    ///////////////////////////////////////////////////////////////
    function claimRewards() external nonReentrant {
        address investor = _msgSender();
        uint256 reward = getClaimableRewards(investor);
        require(reward > 0, "No rewards to claim");

        require(
            IERC20(projectDetail.projectToken).balanceOf(address(this)) >=
                reward,
            "Insufficient contract balance"
        );

        stakes[investor].accumulatedRewards = 0;
        stakes[investor].lastRewardCalculation = block.timestamp;
        projectDetail.totalProjectTokens -= reward;

        bool success = IERC20(projectDetail.projectToken).transfer(
            investor,
            reward
        );
        if (!success) {
            revert ERC20TransferFailed();
        }

        emit RewardsClaimed(investor, reward);
    }

    function projectOwnerClaiming() external onlyOwner nonReentrant {
        require(
            projectDetail.endTime < block.timestamp,
            "Project is still ongoing"
        );

        require(
            projectOwnerReward > 0,
            "No rewards available for project owner"
        );

        uint256 reward = projectOwnerReward;
        projectOwnerReward = 0;

        bool success = IERC20(projectDetail.projectToken).transfer(
            projectDetail.projectOwner,
            reward
        );
        if (!success) {
            revert ERC20TransferFailed();
        }
    }

    /////////////////////////////////////////////////////////////////
    /////////////// VIEW FUNCTIONS FOR CALCULATION /////////////////
    ///////////////////////////////////////////////////////////////

    /**
     *@dev function to calculate loyalty multiplier
     *@notice FE when calling this function need to divide by 100 to get the actual multiplier
     */
    function calculateLoyaltyMultiplier(
        uint256 stakeDuration
    ) public pure returns (uint256) {
        if (stakeDuration < MINIMUM_STAKE_DURATION) {
            return 0;
        }

        // Calculate multiplier: 100% + bonus up to 50% based on duration
        uint256 bonusMultiplier = ((stakeDuration - MINIMUM_STAKE_DURATION) *
            50 *
            10 ** DECIMALS) / LOYALTY_PERIOD;
        if (bonusMultiplier > 50 * 10 ** DECIMALS) {
            bonusMultiplier = 50 * 10 ** DECIMALS;
        }

        return 100 * 10 ** DECIMALS + bonusMultiplier; // Returns 100-150
    }

    /**
     *@dev Helper function to calculate rewards on claiming, staking and unstaking
     *@notice this function get called everytime the reward get accumulated
     */
    function calculateTimeBasedReward(
        uint256 amount,
        uint256 startTime,
        uint256 endTime,
        uint256 loyaltyMultiplier
    ) public view returns (uint256) {
        uint256 duration = endTime - startTime;
        uint256 averageAPR = calculateTimeWeightedAPR(startTime, endTime);

        uint256 yearlyReward = ((amount * averageAPR) / (100 * 10 ** DECIMALS));
        uint256 timeBasedReward = (yearlyReward * duration) / SECONDS_IN_YEAR;
        return ((timeBasedReward * loyaltyMultiplier) / (100 * 10 ** DECIMALS));
    }

    /**
     *@dev function to calculate current APR
     *@notice this function get called upon calling stake and unstake functions
     *@notice FE when calling this function need to divide by 100 to get the actual APR
     */
    function calculateCurrentAPR() public view returns (uint256) {
        if (totalStaked == 0) return INITIAL_APR;

        uint256 stakeRatio = (totalStaked * 100 * 10 ** DECIMALS) /
            projectDetail.targetStakeAmount;
        if (stakeRatio >= 100 * 10 ** DECIMALS) return MIN_APR;

        uint256 aprRange = INITIAL_APR - MIN_APR;
        uint256 reduction = ((aprRange * stakeRatio) / (100 * 10 ** DECIMALS));
        uint256 newAPR = INITIAL_APR - reduction;

        return newAPR > MIN_APR ? newAPR : MIN_APR;
    }

    /**
     *@dev function to calculate time weighted APR
     *@notice this function get called when calculating rewards
     *@notice the APR will be calculated based on the time range of the staking duration
     *@notice For example, if the staking APR is 100% for the first 10 days 
                            and 50% for the next 10 days, 
                            the time-weighted APR will be (100 x 10 + 50 x 10) / 20 = 75(%)
                            Assumed the user claim the rewards for q staking of 20 days duration, with 2 APR snapshots like above
     */
    function calculateTimeWeightedAPR(
        uint256 startTime,
        uint256 endTime
    ) public view returns (uint256) {
        uint256 totalWeightedAPR = 0;
        uint256 lastTimestamp = startTime;
        uint256 aprIndex = 0;

        // Find the first relevant APR snapshot
        while (
            aprIndex < aprHistory.length &&
            aprHistory[aprIndex].timestamp <= startTime
        ) {
            aprIndex++;
        }
        aprIndex = aprIndex > 0 ? aprIndex - 1 : 0;

        // Calculate weighted APR for each period
        while (lastTimestamp < endTime && aprIndex < aprHistory.length) {
            uint256 periodEnd = aprIndex + 1 < aprHistory.length
                ? min(aprHistory[aprIndex + 1].timestamp, endTime)
                : endTime;

            uint256 periodDuration = periodEnd - lastTimestamp;
            totalWeightedAPR += aprHistory[aprIndex].apr * periodDuration;

            lastTimestamp = periodEnd;
            aprIndex++;
        }

        // If calculating for a period extending beyond our last snapshot,
        // use the current APR for the remaining time
        if (lastTimestamp < endTime) {
            uint256 remainingDuration = endTime - lastTimestamp;
            totalWeightedAPR += calculateCurrentAPR() * remainingDuration;
        }

        return totalWeightedAPR / (endTime - startTime);
    }

    /**
     *@dev function to calculate minimum of two numbers
     */
    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     *@dev function to recalculate reserved rewards for all active stakers
     *@notice this function get called upon updating APR (new APR => new potential rewards)
     *@notice do not handle trigger address, it will be handled in the main function
     */
    function recalculateReservedRewards(address triggerAddress) internal {
        uint256 oldTotalReserved = projectDetail.totalReserved;
        projectDetail.totalReserved = 0;
        // Iterate through all active stakers
        for (uint i = 0; i < activeStakers.length; i++) {
            address staker = activeStakers[i];
            if (staker == triggerAddress) continue;
            StakeInfo storage userStake = stakes[staker];

            if (!userStake.isActive) continue;
            // Return old reservation to pool
            projectDetail.remainingRewards += userStake.reservedRewards;

            // Calculate new projected rewards
            uint256 remainingDuration = projectDetail.endTime - block.timestamp;
            uint256 currentAPR = calculateCurrentAPR();
            uint256 newProjectedRewards = calculateProjectedRewards(
                userStake.amount,
                remainingDuration,
                currentAPR,
                MAX_LOYALTY_MULTIPLIER
            );

            // Update stake's reserved rewards
            userStake.reservedRewards = newProjectedRewards;
            userStake.lastAprIndex = aprHistory.length - 1;

            // Update total reserved
            projectDetail.totalReserved += newProjectedRewards;
        }

        // Emit event for tracking
        emit ReservedRewardsRecalculated(
            oldTotalReserved,
            projectDetail.totalReserved
        );
    }

    /**
     *@dev function to update accumulated rewards for a staker
     *@notice this function only get called if a user already 
                has an active stake (staking more or unstaking)
     */
    function updateAccumulatedRewards(address investor) internal {
        StakeInfo storage userStake = stakes[investor];
        uint256 stakeDuration = block.timestamp - userStake.timestamp;
        uint256 multiplier = calculateLoyaltyMultiplier(stakeDuration);

        if (multiplier > 0) {
            uint256 newRewards = calculateTimeBasedReward(
                userStake.amount,
                userStake.lastRewardCalculation,
                block.timestamp,
                multiplier
            );
            userStake.accumulatedRewards += newRewards;
            userStake.lastRewardCalculation = block.timestamp;
        }
    }

    /**
     *@dev function to calculate projected rewards given a specific APR and duration
     */
    function calculateProjectedRewards(
        uint256 amount,
        uint256 duration,
        uint256 apr,
        uint256 loyaltyMultiplier
    ) public pure returns (uint256) {
        uint256 yearlyReward = ((amount * apr) / (100 * 10 ** DECIMALS));
        uint256 timeBasedReward = (yearlyReward * duration) / SECONDS_IN_YEAR;
        return ((timeBasedReward * loyaltyMultiplier) / (100 * 10 ** DECIMALS));
    }

    function getClaimableRewards(
        address investor
    ) public view returns (uint256) {
        StakeInfo storage userStake = stakes[investor];
        if (!userStake.isActive) return 0;

        uint256 endTime = block.timestamp > projectDetail.endTime
            ? projectDetail.endTime
            : block.timestamp;

        uint256 stakeDuration = endTime - userStake.timestamp;
        uint256 multiplier = calculateLoyaltyMultiplier(stakeDuration);

        if (multiplier == 0) return 0;

        uint256 newRewards = calculateTimeBasedReward(
            userStake.amount,
            userStake.lastRewardCalculation,
            endTime,
            multiplier
        );

        return userStake.accumulatedRewards + newRewards;
    }
    /////////////////////////////////////////////////////////////////
    /////////////////// REGULAR VIEW FUNCTIONS /////////////////////
    ///////////////////////////////////////////////////////////////
    function getProjectOwner() public view returns (address) {
        return projectDetail.projectOwner;
    }

    function getAcceptedVAsset() public view returns (address) {
        return projectDetail.acceptedVAsset;
    }

    function getProjectToken() public view returns (address) {
        return projectDetail.projectToken;
    }

    function getTotalProjectToken() public view returns (uint256) {
        return projectDetail.totalProjectTokens;
    }

    function getStartTime() public view returns (uint256) {
        return projectDetail.startTime;
    }

    function getEndTime() public view returns (uint256) {
        return projectDetail.endTime;
    }

    function getMaxVTokensPerStaker() public view returns (uint256) {
        return projectDetail.maxVTokensPerStaker;
    }

    function getMinVTokensPerStaker() public view returns (uint256) {
        return projectDetail.minVTokensPerStaker;
    }

    function getTargetStakeAmount() public view returns (uint256) {
        return projectDetail.targetStakeAmount;
    }

    function getStakedAmount(address investor) public view returns (uint256) {
        return stakes[investor].amount;
    }

    function getTotalStaked() public view returns (uint256) {
        return totalStaked;
    }

    function getStoredAccumulatedRewards(
        address investor
    ) public view returns (uint256) {
        return stakes[investor].accumulatedRewards;
    }

    function getAPRHistoryLength() external view returns (uint256) {
        return aprHistory.length;
    }

    function getProjectOwnerReward() public view returns (uint256) {
        return projectOwnerReward;
    }

    //////////////////////////////////////////////////////////////////////////
    /////////////////////////////// MODIFIERS ///////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    modifier validTimeFrame(uint256 _startTime, uint256 _endTime) {
        if (_startTime <= block.timestamp) revert StartTimeMustBeInFuture();
        if (_endTime <= _startTime) revert EndTimeMustBeAfterStartTime();
        _;
    }

    modifier validAddresses(
        address _projectToken,
        address _acceptedVAsset,
        address _BifrostEarningContract
    ) {
        if (_BifrostEarningContract == address(0))
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
        if (_totalProjectTokens == 0)
            revert TotalProjectTokensMustBeGreaterThanZero();
        if (_maxVTokensPerStaker == 0 || _minVTokensPerStaker == 0)
            revert MaxAndMinTokensPerStakerMustBeGreaterThanZero();
        _;
    }

    modifier validTargetStakeAmount(uint256 _targetStakeAmount) {
        if (_targetStakeAmount == 0)
            revert TargetStakeAmountMustBeGreaterThanZero();
        _;
    }

    modifier validStakingTimeFrame() {
        if (
            block.timestamp < projectDetail.startTime ||
            block.timestamp >= projectDetail.endTime
        ) {
            revert InvalidStakingTimeFrame();
        }
        _;
    }

    modifier totalStakeCannotExceedMaxStaking(
        uint256 stakeAmount,
        address staker
    ) {
        if (
            stakes[staker].amount + stakeAmount >
            projectDetail.maxVTokensPerStaker
        ) {
            revert TotalStakeCannotExceedMaxStaking();
        }
        _;
    }

    modifier totalStakeCannotLowerMinStaking(
        uint256 stakeAmount,
        address staker
    ) {
        if (
            stakes[staker].amount + stakeAmount <
            projectDetail.minVTokensPerStaker
        ) {
            revert TotalStakeCannotLowerMinStaking();
        }
        _;
    }
}
