// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {BaseTest} from "./BaseTest.t.sol";
import {Market} from "../../src/Market.sol";
import {MockERC20} from "../../script/MockERC20.s.sol";

contract CancelOrderTest is BaseTest {
    uint256 public orderId;
    uint256 public constant PROJECT_TOKEN_AMOUNT = 100 ether;
    uint256 public constant COLLATERAL_AMOUNT = 50 ether;

    event OrderCancelled(uint256 indexed orderId);

    function setUp() public override {
        super.setUp();

        // Create a buy order that can be cancelled
        vm.prank(buyer);
        orderId = market.createOrder(
            Market.OrderCreator.BUYER,
            PROJECT_TOKEN_AMOUNT,
            COLLATERAL_AMOUNT,
            address(vDOT)
        );
    }

    function testCancelOrder() public {
        uint256 initialBalance = vDOT.balanceOf(buyer);

        vm.prank(buyer);
        market.cancelOrder(orderId);

        Market.Order memory order = market.getOrder(orderId);
        assertEq(uint256(order.status), uint256(Market.OrderStatus.CANCELLED));

        // Verify collateral returned
        assertEq(vDOT.balanceOf(buyer), initialBalance + COLLATERAL_AMOUNT);
    }

    function testCancelOrderByNonCreator() public {
        vm.prank(seller);
        vm.expectRevert("Not order creator");
        market.cancelOrder(orderId);
    }

    function testCancelSettledOrder() public {
        // Join the order first
        vm.prank(seller);
        market.joinOrder(orderId);

        // Try to cancel after it's settled
        vm.prank(buyer);
        vm.expectRevert("Only open orders can be cancelled");
        market.cancelOrder(orderId);
    }

    function testFailCancelNonExistentOrder() public {
        vm.prank(buyer);
        market.cancelOrder(999);
    }

    function testCancelMultipleOrders() public {
        // Create another order
        vm.prank(buyer);
        uint256 orderId2 = market.createOrder(
            Market.OrderCreator.BUYER,
            PROJECT_TOKEN_AMOUNT,
            COLLATERAL_AMOUNT,
            address(vDOT)
        );

        // Cancel both orders
        vm.startPrank(buyer);
        market.cancelOrder(orderId);
        market.cancelOrder(orderId2);
        vm.stopPrank();

        // Verify both orders cancelled
        Market.Order memory order1 = market.getOrder(orderId);
        Market.Order memory order2 = market.getOrder(orderId2);

        assertEq(uint256(order1.status), uint256(Market.OrderStatus.CANCELLED));
        assertEq(uint256(order2.status), uint256(Market.OrderStatus.CANCELLED));
    }
}
