// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {LaunchPoolFactoryTestHelper} from "../../script/MockBifrostEarning.s.sol";
import {Pool} from "../../src/Pool.sol";
import {console} from "forge-std/console.sol";
import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";
import {MockVDot} from "../../src/BifrostEarningMock.sol";
import {ProjectToken} from "../../script/ProjectTokenHelper.s.sol";

contract ClaimingTest is Test {
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

    function testFullUnstake() public {
        uint256 userStakeAmount = 1000000 ether;
        address user = address(0x10123);

        // Transfer vDOT to user
        vDOT.transfer(user, userStakeAmount);

        // Setup staking
        vm.warp(block.timestamp + 1 days);
        vm.startPrank(user);
        vDOT.approve(address(pool), userStakeAmount);
        pool.stake(userStakeAmount);

        // Log after stake
        console.log("Total staked after stake:", pool.getTotalStaked());
        console.log("APR after stake:", pool.calculateCurrentAPR());
        vm.stopPrank();

        // Advance time
        vm.warp(block.timestamp + 15 days);

        // Setup unstake
        vm.startPrank(user);
        pool.unstake(userStakeAmount);
        vm.stopPrank();

        assertEq(pool.getTotalStaked(), 0, "Total staked mismatch");
    }

    function testPartialUnstake() public {
        uint256 userStakeAmount = 1000000 ether;
        address user = address(0x10123);

        // Transfer vDOT to user
        vDOT.transfer(user, userStakeAmount);

        // Setup staking
        vm.warp(block.timestamp + 1 days);
        vm.startPrank(user);
        vDOT.approve(address(pool), userStakeAmount);
        pool.stake(userStakeAmount);

        // Log after stake
        console.log("Total staked after stake:", pool.getTotalStaked());
        console.log("APR after stake:", pool.calculateCurrentAPR());
        vm.stopPrank();

        // Advance time
        vm.warp(block.timestamp + 15 days);

        // Setup unstake
        vm.startPrank(user);
        pool.unstake(userStakeAmount / 2);
        vm.stopPrank();

        assertEq(
            pool.getTotalStaked(),
            userStakeAmount / 2,
            "Total staked mismatch"
        );
    }

    function testDynamicAPR() public {
        uint256 userStakeAmount = 1000000 ether;
        address user = address(0x10123);

        // Transfer vDOT to user
        vDOT.transfer(user, userStakeAmount);

        // Setup staking
        vm.warp(block.timestamp + 1 days);
        vm.startPrank(user);
        vDOT.approve(address(pool), userStakeAmount);
        pool.stake(userStakeAmount);

        // Snapshot APR after stake
        uint currentAPR = pool.calculateCurrentAPR();

        // Log after stake
        console.log("Total staked after stake:", pool.getTotalStaked());
        console.log("APR after stake:", pool.calculateCurrentAPR());
        vm.stopPrank();

        // Advance time
        vm.warp(block.timestamp + 15 days);

        // Setup unstake
        vm.startPrank(user);
        pool.unstake(userStakeAmount / 2);
        vm.stopPrank();

        // Snapshot APR after unstake
        uint newAPR = pool.calculateCurrentAPR();

        assertLt(currentAPR, newAPR, "APR changed after unstake");
    }

    function testUnstakeAfterTimeframe() public {
        uint256 userStakeAmount = 1000000 ether;
        address user = address(0x10123);

        // Transfer vDOT to user
        vDOT.transfer(user, userStakeAmount);

        // Setup staking
        vm.warp(block.timestamp + 1 days);
        vm.startPrank(user);
        vDOT.approve(address(pool), userStakeAmount);
        pool.stake(userStakeAmount);

        // Log after stake
        console.log("Total staked after stake:", pool.getTotalStaked());
        console.log("APR after stake:", pool.calculateCurrentAPR());
        vm.stopPrank();

        // Advance time
        vm.warp(block.timestamp + 35 days);

        // Setup unstake
        vm.startPrank(user);
        pool.unstake(userStakeAmount / 2);
        vm.stopPrank();

        assertEq(
            pool.getTotalStaked(),
            userStakeAmount / 2,
            "Total staked mismatch"
        );
    }

    function testUnstakeFromMultipleUsers() public {
        uint256 userStakeAmount = 1000000 ether;
        address user = address(0x10123);
        address user2 = address(0x10124);

        // Transfer vDOT to user
        vDOT.transfer(user, userStakeAmount);
        vDOT.transfer(user2, userStakeAmount);

        // Setup staking
        vm.warp(block.timestamp + 1 days);
        vm.startPrank(user);
        vDOT.approve(address(pool), userStakeAmount);
        pool.stake(userStakeAmount);
        vm.stopPrank();

        vm.startPrank(user2);
        vDOT.approve(address(pool), userStakeAmount);
        pool.stake(userStakeAmount);
        vm.stopPrank();

        vm.stopPrank();

        // Advance time
        vm.warp(block.timestamp + 15 days);

        // Setup unstake
        vm.startPrank(user);
        pool.unstake(userStakeAmount / 2);
        vm.stopPrank();

        uint256 totalStaked = pool.getTotalStaked();
        assertEq(
            totalStaked,
            userStakeAmount + userStakeAmount / 2,
            "Total staked mismatch"
        );

        vm.startPrank(user2);
        pool.unstake(userStakeAmount);
        vm.stopPrank();

        assertEq(
            pool.getTotalStaked(),
            userStakeAmount / 2,
            "Total staked mismatch"
        );
    }
}
