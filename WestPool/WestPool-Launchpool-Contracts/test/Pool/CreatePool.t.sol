// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import "../../src/Pool.sol";

contract InitValidationTest is Test {
    Pool public pool;

    address private projectOwner = address(0x123);
    address private projectToken = address(0x456);
    address private acceptedVAsset = address(0x789);
    address private bifrostEarningContract = address(0xABC);
    uint256 private startTime = block.timestamp + 1 days;
    uint256 private endTime = block.timestamp + 30 days;
    uint256 private totalProjectTokens = 1_000_000 ether;
    uint256 private maxVTokensPerStaker = 10_000 ether;
    uint256 private minVTokensPerStaker = 1_000 ether;
    uint256 private targetStakeAmount = 500_000 ether;

    function setUp() public {
        // Deploy the contract
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
    }

    function testInitValidationSuccess() public view {
        assertEq(pool.getProjectOwner(), projectOwner);
        assertEq(pool.getProjectToken(), projectToken);
        assertEq(pool.getAcceptedVAsset(), acceptedVAsset);
        assertEq(pool.getStartTime(), startTime);
        assertEq(pool.getEndTime(), endTime);
        assertEq(pool.getTotalProjectToken(), totalProjectTokens);
        assertEq(pool.getMaxVTokensPerStaker(), maxVTokensPerStaker);
        assertEq(pool.getMinVTokensPerStaker(), minVTokensPerStaker);
        assertEq(pool.getTargetStakeAmount(), targetStakeAmount);
        assertEq(pool.getTotalProjectToken(), totalProjectTokens);
        assertEq(pool.getTotalStaked(), 0);
    }

    function testInvalidTimeFrameReverts() public {
        uint256 invalidStartTime = block.timestamp + 30 days;
        uint256 invalidEndTime = block.timestamp + 1 days;

        vm.expectRevert(Pool.EndTimeMustBeAfterStartTime.selector);
        new Pool(
            projectOwner,
            projectToken,
            acceptedVAsset,
            bifrostEarningContract,
            invalidStartTime,
            invalidEndTime,
            totalProjectTokens,
            maxVTokensPerStaker,
            minVTokensPerStaker,
            targetStakeAmount
        );
    }

    function testInvalidAddressesReverts() public {
        vm.expectRevert(Pool.InvalidProjectTokenAddress.selector);
        new Pool(
            projectOwner,
            address(0),
            acceptedVAsset,
            bifrostEarningContract,
            startTime,
            endTime,
            totalProjectTokens,
            maxVTokensPerStaker,
            minVTokensPerStaker,
            targetStakeAmount
        );
    }

    function testInvalidTokenAmountsReverts() public {
        uint256 invalidTotalTokens = 0;

        vm.expectRevert(Pool.TotalProjectTokensMustBeGreaterThanZero.selector);
        new Pool(
            projectOwner,
            projectToken,
            acceptedVAsset,
            bifrostEarningContract,
            startTime,
            endTime,
            invalidTotalTokens,
            maxVTokensPerStaker,
            minVTokensPerStaker,
            targetStakeAmount
        );
    }
}
