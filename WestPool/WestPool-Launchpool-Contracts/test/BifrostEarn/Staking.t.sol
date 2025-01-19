// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MockVDot, BifrostEarningMock} from "../../src/BifrostEarningMock.sol";
import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {ReentrancyGuard} from "@openzeppelin/utils/ReentrancyGuard.sol";

contract BifrostStakingTest is Test {
    MockVDot public vDot;
    BifrostEarningMock public mockBifrost;

    function setUp() public {
        // Deploy Mock vDOT
        vDot = new MockVDot();
        assertTrue(address(vDot) != address(0), "vDOT address is zero");

        // Deploy BifrostEarningMock with vDOT address and initial APY of 16 (1.6%)
        uint256 initialAPY = 16;
        mockBifrost = new BifrostEarningMock(address(vDot), initialAPY);
        assertTrue(
            address(mockBifrost) != address(0),
            "mockBifrost address is zero"
        );

        // Transfer some vDOT tokens to the Bifrost contract for rewards
        uint256 initialBalance = 100000 ether;
        vDot.transfer(address(mockBifrost), initialBalance);
    }

    function testStakingFlow() public {
        // Ensure initial setup
        uint256 userStakeAmount = 10 ether;
        address user = address(0x123);

        // Transfer vDOT tokens to the user for staking
        vDot.transfer(user, userStakeAmount);
        vm.prank(user); // Simulate user actions
        vDot.approve(address(mockBifrost), userStakeAmount);

        // Stake vDOT
        vm.prank(user);
        mockBifrost.stake(userStakeAmount);

        // Check the user's stake
        (
            uint256 stakedAmount,
            uint256 startTime,
            uint256 pendingReward
        ) = mockBifrost.getStakeInfo(user);
        assertEq(stakedAmount, userStakeAmount, "Stake amount mismatch");
        assertGt(startTime, 0, "Start time not set");
        assertEq(
            pendingReward,
            0,
            "Unexpected reward immediately after staking"
        );

        console.log("Staking APR:", mockBifrost.APY(), "%");

        // Advance time by 30 days and check reward
        vm.warp(block.timestamp + 30 days);
        pendingReward = mockBifrost.calculateRewards(user);
        assertGt(pendingReward, 0, "Reward not accumulating over time");
        console.log("Pending reward after 30 days:", pendingReward, "vDOT");

        // Unstake and verify balance
        uint256 userBalanceBeforeUnstake = vDot.balanceOf(user);
        vm.prank(user);
        mockBifrost.unstake(userStakeAmount);

        uint256 userFinalBalance = vDot.balanceOf(user);
        assertGt(
            userFinalBalance,
            userBalanceBeforeUnstake,
            "Final balance did not increase"
        );
        console.log("User original balance:", userStakeAmount, "vDOT");
        console.log(
            "User balance before unstake:",
            userBalanceBeforeUnstake,
            "vDOT"
        );
        console.log("User final balance:", userFinalBalance, "vDOT");
    }

    function testMultipleStaking() public {
        // Ensure initial setup
        uint256 userStakeAmount = 10 ether;
        address user1 = address(0x123);
        address user2 = address(0x456);

        // Transfer vDOT tokens to the user for staking
        vDot.transfer(user1, userStakeAmount);
        vm.prank(user1); // Simulate user actions
        vDot.approve(address(mockBifrost), userStakeAmount);

        vDot.transfer(user2, userStakeAmount / 2);
        vm.prank(user2);
        vDot.approve(address(mockBifrost), userStakeAmount / 2);

        // Stake vDOT
        vm.prank(user1);
        mockBifrost.stake(userStakeAmount);

        vm.prank(user2);
        mockBifrost.stake(userStakeAmount / 2);

        // Advance time by 30 days and check reward
        vm.warp(block.timestamp + 30 days);

        // Unstake and verify balance
        vm.prank(user1);
        mockBifrost.unstake(userStakeAmount);

        vm.prank(user2);
        mockBifrost.unstake(userStakeAmount / 2);

        uint256 user1FinalBalance = vDot.balanceOf(user1);
        uint256 user2FinalBalance = vDot.balanceOf(user2);

        assertGt(user1FinalBalance, 0, "Final balance did not increase");
        assertGt(user2FinalBalance, 0, "Final balance did not increase");
        assertGt(user1FinalBalance, userStakeAmount, "User 1 losing balance");
        assertGt(
            user2FinalBalance,
            userStakeAmount / 2,
            "User 2 losing balance"
        );
        assertGt(
            user1FinalBalance,
            user2FinalBalance,
            "User 1 has less balance"
        );
    }

    function testContinousStaking() public {
        // Ensure initial setup
        uint256 userStakeAmount = 10 ether;
        address user = address(0x123);

        // Transfer vDOT tokens to the user for staking
        vDot.transfer(user, userStakeAmount);
        vm.prank(user); // Simulate user actions
        vDot.approve(address(mockBifrost), userStakeAmount);

        // Stake vDOT
        vm.startPrank(user);
        mockBifrost.stake(1 ether);
        mockBifrost.stake(1 ether);
        mockBifrost.stake(1 ether);
        mockBifrost.stake(1 ether);
        mockBifrost.stake(1 ether);
        mockBifrost.stake(1 ether);

        (
            uint256 stakedAmount,
            uint256 startTime,
            uint256 pendingReward
        ) = mockBifrost.getStakeInfo(user);

        assertEq(stakedAmount, 6 ether, "Stake amount mismatch");
        assertEq(startTime, 1, "Stake start time mismatch");
        assertEq(pendingReward, 0, "Pending reward mismatch");
    }
}
