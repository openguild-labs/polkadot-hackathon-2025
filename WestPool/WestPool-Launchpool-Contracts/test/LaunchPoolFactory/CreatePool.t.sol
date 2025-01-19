// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {PoolFactory} from "../../src/LaunchPoolFactory.sol";
import {Pool} from "../../src/Pool.sol";
import {console} from "forge-std/console.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {LaunchPoolFactoryTestHelper} from "../../script/MockBifrostEarning.s.sol";

contract CreatePoolTest is Test {
    PoolFactory private factory;

    // Mock parameters for the createPool function
    address private projectToken = address(0x1);
    address private acceptedVAsset = address(0x2);
    address private BifrostEarningAddress;
    uint256 private startTime;
    uint256 private endTime;
    uint256 private totalProjectTokens = 1000 ether;
    uint256 private maxVTokensPerStaker = 50 ether;
    uint256 private minVTokensPerStaker = 1 ether;
    uint256 private targetStakeAmount = 500 ether;

    LaunchPoolFactoryTestHelper private testHelper;

    function setUp() public {
        // Deploy the LaunchPoolFactoryTestHelper contract
        testHelper = new LaunchPoolFactoryTestHelper();
        testHelper.setUp(); // Deploys Mock vDOT and mockBifrost

        // Get the mockBifrost address
        BifrostEarningAddress = address(testHelper.mockBifrost());

        // Deploy the factory contract
        factory = new PoolFactory(BifrostEarningAddress);

        // Set start and end times
        startTime = block.timestamp + 1 days;
        endTime = block.timestamp + 2 days;
    }

    function testCreatePool() public {
        // Act: Call the createPool function
        uint256 poolId = factory.createPool(
            projectToken,
            acceptedVAsset,
            startTime,
            endTime,
            totalProjectTokens,
            maxVTokensPerStaker,
            minVTokensPerStaker,
            targetStakeAmount
        );

        // Assert: Verify poolId and pool address
        address poolAddress = factory.getPoolAddress(poolId);
        assertTrue(
            poolAddress != address(0),
            "Pool address should not be zero"
        );

        // Assert: Verify the pool count is incremented
        uint256 poolCount = factory.getPoolCount();
        assertEq(poolCount, 1, "Pool count should be 1");

        // Assert: Verify pool validity
        bool isValid = factory.isPoolValid(poolAddress);
        (poolAddress);
        assertTrue(isValid, "Pool should be valid");

        // Assert: Verify pool count is incremented
        poolCount = factory.getPoolCount();
        assertEq(poolCount, 1, "Pool count should be 1");
    }

    function testCreatePoolWithInvalidBifrostAddress() public {
        // Act: Set invalid Bifrost address
        BifrostEarningAddress = address(0);

        // Assert: revert with invalid Bifrost address
        vm.expectRevert(PoolFactory.InvalidBifrostEarningAddress.selector);
        factory = new PoolFactory(BifrostEarningAddress);
    }

    function testInvalidStartTime() public {
        // Act: Set invalid start time
        startTime = block.timestamp - 1; // 1s in the past

        // Assert: revert with invalid times
        vm.expectRevert(PoolFactory.StartTimeMustBeInFuture.selector);
        factory.createPool(
            projectToken,
            acceptedVAsset,
            startTime,
            endTime,
            totalProjectTokens,
            maxVTokensPerStaker,
            minVTokensPerStaker,
            targetStakeAmount
        );
    }

    function testInvalidEndTime() public {
        // Act: Set invalid end time
        endTime = startTime - 1; // 1s before start time

        // Assert: revert with invalid times
        vm.expectRevert(PoolFactory.EndTimeMustBeAfterStartTime.selector);
        factory.createPool(
            projectToken,
            acceptedVAsset,
            startTime,
            endTime,
            totalProjectTokens,
            maxVTokensPerStaker,
            minVTokensPerStaker,
            targetStakeAmount
        );
    }

    function testInvalidProjectTokenAddress() public {
        // Act: Set invalid project token address
        projectToken = address(0);

        // Assert: revert with invalid project token address
        vm.expectRevert(PoolFactory.InvalidProjectTokenAddress.selector);
        factory.createPool(
            projectToken,
            acceptedVAsset,
            startTime,
            endTime,
            totalProjectTokens,
            maxVTokensPerStaker,
            minVTokensPerStaker,
            targetStakeAmount
        );
    }

    function testInvalidVAssetAddress() public {
        // Act: Set invalid accepted vAsset address
        acceptedVAsset = address(0);

        // Assert: revert with invalid accepted vAsset address
        vm.expectRevert(PoolFactory.InvalidAcceptedVAssetAddress.selector);
        factory.createPool(
            projectToken,
            acceptedVAsset,
            startTime,
            endTime,
            totalProjectTokens,
            maxVTokensPerStaker,
            minVTokensPerStaker,
            targetStakeAmount
        );
    }

    function testInvalidPoolId() public {
        // Act: Get pool address with invalid pool id
        uint256 poolId = factory.createPool(
            projectToken,
            acceptedVAsset,
            startTime,
            endTime,
            totalProjectTokens,
            maxVTokensPerStaker,
            minVTokensPerStaker,
            targetStakeAmount
        );

        // Assert: revert with invalid pool id
        vm.expectRevert(PoolFactory.InvalidPoolId.selector);
        factory.getPoolAddress(poolId + 1);
    }

    function testInvalidPoolAddress() public view {
        // Act: Get pool validity with invalid pool address
        address poolAddress = address(0x123);

        // Assert: revert with invalid pool address
        bool check = factory.isPoolValid(poolAddress);
        assertFalse(check, "Pool should not be valid");
    }

    function testInvalidTokenAmounts() public {
        // Act: Set invalid token amounts
        totalProjectTokens = 0;
        maxVTokensPerStaker = 0;
        minVTokensPerStaker = 0;

        // Assert: revert with invalid token amounts
        vm.expectRevert(PoolFactory.InvalidTokenAmount.selector);
        factory.createPool(
            projectToken,
            acceptedVAsset,
            startTime,
            endTime,
            totalProjectTokens,
            maxVTokensPerStaker,
            minVTokensPerStaker,
            targetStakeAmount
        );

        // Act: Set maxVTokensPerStaker less than minVTokensPerStaker
        totalProjectTokens = 1000;
        maxVTokensPerStaker = 1;
        minVTokensPerStaker = 2;
        vm.expectRevert(PoolFactory.InvalidTokenAmount.selector);
        factory.createPool(
            projectToken,
            acceptedVAsset,
            startTime,
            endTime,
            totalProjectTokens,
            maxVTokensPerStaker,
            minVTokensPerStaker,
            targetStakeAmount
        );
    }

    function testChangeBifrostEarningAddress() public {
        // Act: Change the BifrostEarningAddress
        address newBifrostEarningAddress = address(0x123);
        factory.setBifrostEarningContract(newBifrostEarningAddress);

        // Assert: Verify the new BifrostEarningAddress
        address bifrostAddress = factory.getBifrostEarningContract();
        assertEq(bifrostAddress, newBifrostEarningAddress);

        // Act: Change the BifrostEarningAddress to zero address
        vm.expectRevert(PoolFactory.InvalidBifrostEarningAddress.selector);
        factory.setBifrostEarningContract(address(0));
    }
}
