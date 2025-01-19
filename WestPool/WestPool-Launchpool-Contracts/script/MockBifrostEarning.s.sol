// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MockVDot, BifrostEarningMock} from "../src/BifrostEarningMock.sol";
import {Test} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";

contract LaunchPoolFactoryTestHelper is Test {
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

    function getERC20vDOT() public view returns (IERC20) {
        return vDot;
    }

    function getVDotAddress() public view returns (address) {
        return address(vDot);
    }
}
