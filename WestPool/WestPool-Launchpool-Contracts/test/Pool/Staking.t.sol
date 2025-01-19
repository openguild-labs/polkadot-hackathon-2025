// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {LaunchPoolFactoryTestHelper} from "../../script/MockBifrostEarning.s.sol";
import {Pool} from "../../src/Pool.sol";
import {console} from "forge-std/console.sol";
import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";
import {MockVDot} from "../../src/BifrostEarningMock.sol";

contract StakingTest is Test {
    Pool private pool;
    IERC20 private vDOT;
    MockVDot private mockVDOT;
    LaunchPoolFactoryTestHelper private testHelper;

    address private projectOwner = address(0x123);
    address private projectToken = address(0x456);
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

        // Log initial balances for verification
        console.log(
            "Bifrost vDOT balance:",
            vDOT.balanceOf(bifrostEarningContract)
        );
        console.log(
            "Test contract vDOT balance:",
            vDOT.balanceOf(address(this))
        );
    }

    function testDynamicAPR() public {
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
        pool.stake(userStakeAmount);
        vm.stopPrank();

        // Verify stake
        assertEq(
            pool.getStakedAmount(user),
            userStakeAmount,
            "Staked amount not correctly recorded"
        );

        uint256 updatedAPR = pool.calculateCurrentAPR();
        console.log("APR After Stake:", updatedAPR / 100, "%");
        assertLt(
            updatedAPR,
            800 * 10 ** 2,
            "APR should be less than 800% after staking"
        );
    }

    function testMultipleStake() public {
        uint256 userStakeAmount = 1000000 ether;
        address user1 = address(0x10123);
        address user2 = address(0x10124);

        // Transfer vDOT to user
        vDOT.transfer(user1, userStakeAmount);
        vDOT.transfer(user2, userStakeAmount);

        // Setup staking
        vm.warp(block.timestamp + 1 days);
        vm.startPrank(user1);
        vDOT.approve(address(pool), userStakeAmount);
        pool.stake(userStakeAmount);
        vm.stopPrank();

        vm.startPrank(user2);
        vDOT.approve(address(pool), userStakeAmount);
        pool.stake(userStakeAmount);
        vm.stopPrank();

        uint256 updatedAPR = pool.calculateCurrentAPR();
        console.log("APR After Stake:", updatedAPR / 100, "%");
        assertLt(
            updatedAPR,
            800 * 10 ** 2,
            "APR should be less than 800% after staking"
        );

        uint256 totalStakedInPool = pool.getTotalStaked();
        console.log("Total Staked in Pool:", totalStakedInPool);
        assertEq(
            totalStakedInPool,
            userStakeAmount * 2,
            "Total staked amount mismatch"
        );
    }

    function testRestaking() public {
        uint256 userStakeAmount = 1000000 ether;
        address user = address(0x10123);

        // Transfer vDOT to user
        vDOT.transfer(user, userStakeAmount);

        // Setup staking
        vm.startPrank(user);
        vm.warp(block.timestamp + 1 days);
        vDOT.approve(address(pool), userStakeAmount);
        pool.stake(userStakeAmount / 2);

        vm.warp(block.timestamp + 4 days);
        pool.stake(userStakeAmount / 2);
        vm.stopPrank();

        uint256 updatedAPR = pool.calculateCurrentAPR();
        console.log("APR After Stake:", updatedAPR / 100, "%");
        assertLt(
            updatedAPR,
            800 * 10 ** 2,
            "APR should be less than 800% after staking"
        );

        uint256 userPendingReward = pool.getStoredAccumulatedRewards(user);
        console.log("User current accumulated reward:", userPendingReward);
        assertGt(userPendingReward, 0, "User reward not accumulating");

        assertEq(
            pool.getStakedAmount(user),
            userStakeAmount,
            "Staked amount not correctly recorded"
        );
    }

    function testRestakingWithMultipleUsers() public {
        uint256 userStakeAmount = 1000000 ether;
        address user1 = address(0x10123);
        address user2 = address(0x10124);

        // Transfer vDOT to user
        vDOT.transfer(user1, userStakeAmount);
        vDOT.transfer(user2, userStakeAmount);

        // Setup staking
        vm.startPrank(user1);
        vm.warp(block.timestamp + 1 days);
        vDOT.approve(address(pool), userStakeAmount);
        pool.stake(userStakeAmount);
        vm.stopPrank();

        vm.startPrank(user2);
        vm.warp(block.timestamp + 1 days);
        vDOT.approve(address(pool), userStakeAmount);
        pool.stake(userStakeAmount / 2);

        vm.warp(block.timestamp + 4 days);
        pool.stake(userStakeAmount / 2);
        vm.stopPrank();

        uint256 updatedAPR = pool.calculateCurrentAPR();
        console.log("APR After Stake:", updatedAPR / 100, "%");
        assertLt(
            updatedAPR,
            800 * 10 ** 2,
            "APR should be less than 800% after staking"
        );

        uint256 user1PendingReward = pool.getStoredAccumulatedRewards(user1);
        uint256 user2PendingReward = pool.getStoredAccumulatedRewards(user2);
        console.log("User 1 current accumulated reward:", user1PendingReward);
        console.log("User 2 current accumulated reward:", user2PendingReward);
        assertEq(user1PendingReward, 0, "User 1 reward accumulating");
        assertGt(user2PendingReward, 0, "User 2 reward not accumulating");
    }

    function testRepeatStaking() public {
        uint256 userStakeAmount = 1000000 ether;
        address user = address(0x10123);

        // Transfer vDOT to user
        vDOT.transfer(user, userStakeAmount);

        console.log(
            "Staking Timeframe:",
            pool.getStartTime(),
            pool.getEndTime()
        );

        // Setup staking
        vm.startPrank(user);
        vDOT.approve(address(pool), userStakeAmount);
        vm.warp(block.timestamp + 1 days);
        pool.stake(userStakeAmount / 10);
        console.log("Staked amount:", pool.getStakedAmount(user));

        vm.warp(block.timestamp + 1 days);
        pool.stake(userStakeAmount / 10);
        console.log("Staked amount:", pool.getStakedAmount(user));

        vm.warp(block.timestamp + 1 days);
        pool.stake(userStakeAmount / 10);
        console.log("Staked amount:", pool.getStakedAmount(user));

        vm.warp(block.timestamp + 1 days);
        pool.stake(userStakeAmount / 10);
        console.log("Staked amount:", pool.getStakedAmount(user));

        vm.warp(block.timestamp + 1 days);
        pool.stake(userStakeAmount / 10);
        console.log("Staked amount:", pool.getStakedAmount(user));

        vm.warp(block.timestamp + 1 days);
        pool.stake(userStakeAmount / 10);
        console.log("Staked amount:", pool.getStakedAmount(user));

        vm.warp(block.timestamp + 1 days);
        pool.stake(userStakeAmount / 10);
        console.log("Staked amount:", pool.getStakedAmount(user));

        vm.warp(block.timestamp + 1 days);
        pool.stake(userStakeAmount / 10);
        console.log("Staked amount:", pool.getStakedAmount(user));

        vm.warp(block.timestamp + 1 days);
        pool.stake(userStakeAmount / 10);
        console.log("Staked amount:", pool.getStakedAmount(user));

        vm.warp(block.timestamp + 1 days);
        pool.stake(userStakeAmount / 10);
        console.log("Staked amount:", pool.getStakedAmount(user));
        vm.stopPrank();

        uint256 userPendingReward = pool.getStoredAccumulatedRewards(user);
        console.log("User current accumulated reward:", userPendingReward);
        assertGt(userPendingReward, 0, "User reward not accumulating");

        assertEq(
            pool.getStakedAmount(user),
            userStakeAmount,
            "Staked amount not correctly recorded"
        );
    }
}
