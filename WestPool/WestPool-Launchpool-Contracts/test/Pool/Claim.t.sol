// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {LaunchPoolFactoryTestHelper} from "../../script/MockBifrostEarning.s.sol";
import {Pool} from "../../src/Pool.sol";
import {console} from "forge-std/console.sol";
import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/token/ERC20/ERC20.sol";
import {MockVDot} from "../../src/BifrostEarningMock.sol";
import {ProjectToken} from "../../script/ProjectTokenHelper.s.sol";

contract ClaimingTest is Test {
    Pool private pool;
    IERC20 private vDOT;
    ERC20 private projectTokenERC20;

    MockVDot private mockVDOT;
    LaunchPoolFactoryTestHelper private testHelper;

    address private projectOwner = address(0x123);
    address private projectToken;
    address private acceptedVAsset;
    address private bifrostEarningContract;
    uint256 private startTime = block.timestamp + 1 days;
    uint256 private endTime = block.timestamp + 30 days;
    uint256 private totalProjectTokens = 1000000000000000 ether;
    uint256 private maxVTokensPerStaker = 1000000 ether;
    uint256 private minVTokensPerStaker = 10000 ether;
    uint256 private targetStakeAmount = 50000000 ether;

    function setUp() public {
        // Deploy helper and set up initial tokens for Bifrost
        testHelper = new LaunchPoolFactoryTestHelper();
        testHelper.setUp(); // This gives tokens to Bifrost

        // Get the necessary contracts and addresses
        bifrostEarningContract = address(testHelper.mockBifrost());
        acceptedVAsset = testHelper.getVDotAddress();
        vDOT = IERC20(acceptedVAsset);
        mockVDOT = MockVDot(acceptedVAsset);

        // Mint additional tokens for the test contract
        mockVDOT.mint(address(this), 10000000000000000000 ether);

        // Mint project tokens to this contract
        projectTokenERC20 = new ProjectToken(totalProjectTokens);
        projectToken = address(projectTokenERC20);

        // Deploy the pool contract
        pool = new Pool(
            projectOwner,
            projectToken,
            acceptedVAsset,
            bifrostEarningContract,
            startTime,
            endTime,
            totalProjectTokens,
            maxVTokensPerStaker,
            minVTokensPerStaker,
            targetStakeAmount
        );

        // Project owner send project tokens to pool
        projectTokenERC20.transfer(address(pool), totalProjectTokens);

        // Log initial balances for verification
        console.log(
            "Bifrost vDOT balance:",
            vDOT.balanceOf(bifrostEarningContract)
        );
        console.log(
            "Test contract vDOT balance:",
            vDOT.balanceOf(address(this))
        );
        console.log(
            "Project Token balance:",
            projectTokenERC20.balanceOf(address(pool))
        );
    }

    function testClaimAfterStake() public {
        uint256 userStakeAmount = 1000000 ether;
        address user = address(0x10123);

        // Transfer vDOT to user
        vDOT.transfer(user, userStakeAmount);

        console.log("Max staking amount:", pool.getMaxVTokensPerStaker());
        console.log("User staking amount:", userStakeAmount);
        console.log("Initial APR:", pool.calculateCurrentAPR() / 100, "%");

        // Setup staking
        vm.warp(block.timestamp + 1 days);
        vm.startPrank(user);
        vDOT.approve(address(pool), userStakeAmount);
        pool.stake(userStakeAmount / 2);
        vm.stopPrank();

        // Verify stake
        assertEq(
            pool.getStakedAmount(user),
            userStakeAmount / 2,
            "Staked amount not correctly recorded"
        );

        uint256 updatedAPR = pool.calculateCurrentAPR();
        console.log("APR After Stake:", updatedAPR / 100, "%");
        assertLt(
            updatedAPR,
            800 * 10 ** 2,
            "APR should be less than 800% after staking"
        );

        // Advance time by 30 days and claim reward
        vm.warp(block.timestamp + 30 days);

        console.log("Reward:", pool.getClaimableRewards(user));

        vm.startPrank(user);
        pool.claimRewards();
        vm.stopPrank();

        // Verify reward
        uint256 reward = projectTokenERC20.balanceOf(user);
        assertGt(reward, 0, "Reward should be greater than 0");
    }

    function testClaimBeforeStake() public {
        address user = address(0x10123);
        vm.startPrank(user);
        vm.expectRevert("No rewards to claim");
        pool.claimRewards();
        vm.stopPrank();
    }

    function testQuickClaim() public {
        uint256 userStakeAmount = 1000000 ether;
        address user = address(0x10123);

        // Transfer vDOT to user
        vDOT.transfer(user, userStakeAmount);

        console.log("Max staking amount:", pool.getMaxVTokensPerStaker());
        console.log("User staking amount:", userStakeAmount);
        console.log("Initial APR:", pool.calculateCurrentAPR() / 100, "%");

        // Setup staking
        vm.warp(block.timestamp + 1 days);
        vm.startPrank(user);
        vDOT.approve(address(pool), userStakeAmount);
        pool.stake(userStakeAmount / 2);
        vm.stopPrank();

        // Verify stake
        assertEq(
            pool.getStakedAmount(user),
            userStakeAmount / 2,
            "Staked amount not correctly recorded"
        );

        uint256 updatedAPR = pool.calculateCurrentAPR();
        console.log("APR After Stake:", updatedAPR / 100, "%");
        assertLt(
            updatedAPR,
            800 * 10 ** 2,
            "APR should be less than 800% after staking"
        );

        // Advance time by 30 seconds and claim reward
        vm.warp(block.timestamp + 1 days + 3 seconds);

        console.log("Reward:", pool.getClaimableRewards(user));

        vm.startPrank(user);
        pool.claimRewards();
        vm.stopPrank();

        // Verify reward
        uint256 reward = projectTokenERC20.balanceOf(user);
        assertGt(reward, 0, "Reward should be greater than 0");
    }

    function testAccumulatedRewards() public {
        uint256 userStakeAmount = 1000000 ether;
        address user = address(0x10123);

        // Transfer vDOT to user
        vDOT.transfer(user, userStakeAmount);

        // Setup initial stake
        vm.warp(startTime); // Start at the beginning of staking period
        vm.startPrank(user);
        vDOT.approve(address(pool), userStakeAmount);
        pool.stake(userStakeAmount / 2);

        // Log initial state
        console.log(
            "Initial accumulated rewards:",
            pool.getStoredAccumulatedRewards(user)
        );
        console.log(
            "Initial claimable rewards:",
            pool.getClaimableRewards(user)
        );

        // Advance time by 1 day
        vm.warp(block.timestamp + 1 days);

        // Log state after 1 day
        console.log(
            "Accumulated rewards after 1 day:",
            pool.getStoredAccumulatedRewards(user)
        );
        console.log(
            "Claimable rewards after 1 day:",
            pool.getClaimableRewards(user)
        );

        // Stake more to trigger reward calculation
        pool.stake(userStakeAmount / 4);

        // Log state after additional stake
        console.log(
            "Accumulated rewards after second stake:",
            pool.getStoredAccumulatedRewards(user)
        );
        console.log(
            "Claimable rewards after second stake:",
            pool.getClaimableRewards(user)
        );

        // Advance time by another day
        vm.warp(block.timestamp + 1 days);

        // Log final state
        console.log(
            "Final accumulated rewards:",
            pool.getStoredAccumulatedRewards(user)
        );
        console.log("Final claimable rewards:", pool.getClaimableRewards(user));

        // Verify rewards are being tracked
        assertGt(
            pool.getClaimableRewards(user),
            0,
            "Claimable rewards should be greater than 0"
        );
        assertGt(
            pool.getStoredAccumulatedRewards(user),
            0,
            "Accumulated rewards should be greater than 0"
        );

        // Claim rewards
        pool.claimRewards();

        // Verify accumulated rewards are reset after claiming
        assertEq(
            pool.getStoredAccumulatedRewards(user),
            0,
            "Accumulated rewards should be 0 after claiming"
        );
        vm.stopPrank();
    }
}
