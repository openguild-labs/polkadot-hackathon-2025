// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Market} from "../../src/Market.sol";
import {MockERC20} from "../../script/MockERC20.s.sol";

contract BaseTest is Test {
    Market public market;
    MockERC20 public projectToken;
    MockERC20 public vDOT;
    MockERC20 public vASTR;

    address public admin = address(0x123);
    address public buyer = address(0x456);
    address public seller = address(0x789);

    uint256 public constant PLATFORM_FEE = 100; // 1%
    uint256 public constant INITIAL_BALANCE = 1000 ether;

    function setUp() public virtual {
        // Deploy tokens
        projectToken = new MockERC20("Project Token", "PT");
        vDOT = new MockERC20("vDOT", "vDOT");
        vASTR = new MockERC20("vASTR", "vASTR");

        // Setup accepted vTokens
        address[] memory acceptedvTokens = new address[](2);
        acceptedvTokens[0] = address(vDOT);
        acceptedvTokens[1] = address(vASTR);

        // Deploy market
        vm.prank(admin);
        market = new Market(
            address(projectToken),
            PLATFORM_FEE,
            acceptedvTokens
        );

        // Setup initial balances
        projectToken.mint(seller, INITIAL_BALANCE);
        vDOT.mint(seller, INITIAL_BALANCE);
        vASTR.mint(seller, INITIAL_BALANCE);

        vDOT.mint(buyer, INITIAL_BALANCE);
        vASTR.mint(buyer, INITIAL_BALANCE);

        // Approve market contract
        vm.startPrank(seller);
        projectToken.approve(address(market), type(uint256).max);
        vDOT.approve(address(market), type(uint256).max);
        vASTR.approve(address(market), type(uint256).max);
        vm.stopPrank();

        vm.startPrank(buyer);
        vDOT.approve(address(market), type(uint256).max);
        vASTR.approve(address(market), type(uint256).max);
        vm.stopPrank();
    }

    function testVTokenAccess() public view {
        // Test getting by index
        assertEq(market.getVTokenAtIndex(0), address(vDOT));
        assertEq(market.getVTokenAtIndex(1), address(vASTR));

        // Test getting count
        assertEq(market.getAcceptedVTokensCount(), 2);

        // Test getting all tokens
        address[] memory tokens = market.getAcceptedVTokens();
        assertEq(tokens.length, 2);
        assertEq(tokens[0], address(vDOT));
        assertEq(tokens[1], address(vASTR));

        // Test token validation
        assertTrue(market.isAcceptedVToken(address(vDOT)));
        assertTrue(market.isAcceptedVToken(address(vASTR)));
        assertFalse(market.isAcceptedVToken(address(0x123)));
    }

    function testFailGetInvalidIndex() public view {
        market.getVTokenAtIndex(99);
    }
}
