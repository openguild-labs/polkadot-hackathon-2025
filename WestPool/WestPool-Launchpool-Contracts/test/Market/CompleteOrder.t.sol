// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {BaseTest} from "./BaseTest.t.sol";
import {Market} from "../../src/Market.sol";
import {MockERC20} from "../../script/MockERC20.s.sol";

contract CompleteOrderTest is BaseTest {
    uint256 public orderId;
    uint256 public constant PROJECT_TOKEN_AMOUNT = 100 ether;
    uint256 public constant COLLATERAL_AMOUNT = 50 ether;

    event OrderCompleted(uint256 indexed orderId);
    event TokensWithdrawn(uint256 indexed orderId, address indexed party);

    function setUp() public override {
        super.setUp();

        // Create and join a buy order
        vm.prank(buyer);
        orderId = market.createOrder(
            Market.OrderCreator.BUYER,
            PROJECT_TOKEN_AMOUNT,
            COLLATERAL_AMOUNT,
            address(vDOT)
        );

        vm.prank(seller);
        market.joinOrder(orderId);
    }

    function testCompleteTradeNormalFlow() public {
        // Seller completes their part first
        vm.prank(seller);
        market.completeTradeAsSeller(orderId);

        // Verify seller received collateral
        assertEq(vDOT.balanceOf(seller), INITIAL_BALANCE + COLLATERAL_AMOUNT);

        // Buyer completes their part
        vm.prank(buyer);
        market.completeTradeAsBuyer(orderId);

        // Verify final state
        Market.Order memory order = market.getOrder(orderId);
        assertEq(uint256(order.status), uint256(Market.OrderStatus.COMPLETED));
        assertTrue(order.buyerWithdrawn);
        assertTrue(order.sellerWithdrawn);

        // Verify token transfers
        assertEq(projectToken.balanceOf(buyer), PROJECT_TOKEN_AMOUNT);
    }

    function testClaimCollateralAfterExpiry() public {
        // Fast forward past 24 hours
        vm.warp(block.timestamp + 25 hours);

        // Buyer claims collateral
        vm.prank(buyer);
        market.claimCollateralAfterExpiry(orderId);

        // Verify buyer received both collaterals
        assertEq(vDOT.balanceOf(buyer), INITIAL_BALANCE + COLLATERAL_AMOUNT);

        Market.Order memory order = market.getOrder(orderId);
        assertEq(uint256(order.status), uint256(Market.OrderStatus.CANCELLED));
        assertTrue(order.buyerWithdrawn);
    }

    function testCompleteTradeAsWrongParty() public {
        vm.prank(buyer);
        vm.expectRevert(Market.NotSeller.selector);
        market.completeTradeAsSeller(orderId);
    }

    function testBuyerCompleteBeforeSeller() public {
        vm.prank(buyer);
        vm.expectRevert(); // Will revert due to no tokens being in contract
        market.completeTradeAsBuyer(orderId);
    }

    function testSellerCompleteAfterExpiry() public {
        // Fast forward past 24 hours
        vm.warp(block.timestamp + 25 hours);

        vm.prank(seller);
        vm.expectRevert(Market.TimeElapsed.selector);
        market.completeTradeAsSeller(orderId);
    }

    function testClaimCollateralBeforeExpiry() public {
        vm.prank(buyer);
        vm.expectRevert(Market.TimeNotElapsed.selector);
        market.claimCollateralAfterExpiry(orderId);
    }
}
