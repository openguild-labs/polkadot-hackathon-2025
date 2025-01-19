// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {BaseTest} from "./BaseTest.t.sol";
import {Market} from "../../src/Market.sol";
import {MockERC20} from "../../script/MockERC20.s.sol";
import {IERC20Errors} from "@openzeppelin/interfaces/draft-IERC6093.sol";

contract JoinOrderTest is BaseTest {
    uint256 public orderId;
    uint256 public constant PROJECT_TOKEN_AMOUNT = 100 ether;
    uint256 public constant COLLATERAL_AMOUNT = 50 ether;

    event OrderSettled(uint256 indexed orderId, address indexed joiner);

    function setUp() public override {
        super.setUp();

        // Create a buy order that can be joined
        vm.prank(buyer);
        orderId = market.createOrder(
            Market.OrderCreator.BUYER,
            PROJECT_TOKEN_AMOUNT,
            COLLATERAL_AMOUNT,
            address(vDOT)
        );
    }

    function testJoinBuyOrder() public {
        vm.prank(seller);
        vm.expectEmit(true, true, false, true);
        emit OrderSettled(orderId, seller);
        market.joinOrder(orderId);

        Market.Order memory order = market.getOrder(orderId);
        assertEq(order.joiner, seller);
        assertEq(uint256(order.status), uint256(Market.OrderStatus.SETTLED));
        assertEq(order.settleTime, block.timestamp);
    }

    function testJoinSellOrder() public {
        // Create a sell order first
        vm.prank(seller);
        uint256 sellOrderId = market.createOrder(
            Market.OrderCreator.SELLER,
            PROJECT_TOKEN_AMOUNT,
            COLLATERAL_AMOUNT,
            address(vDOT)
        );

        // Buyer joins the sell order
        vm.prank(buyer);
        vm.expectEmit(true, true, false, true);
        emit OrderSettled(sellOrderId, buyer);
        market.joinOrder(sellOrderId);

        Market.Order memory order = market.getOrder(sellOrderId);
        assertEq(order.joiner, buyer);
        assertEq(uint256(order.status), uint256(Market.OrderStatus.SETTLED));
        assertEq(order.settleTime, block.timestamp);
    }

    function testFailJoinNonExistentOrder() public {
        vm.prank(seller);
        market.joinOrder(999);
    }

    function testJoinOwnOrder() public {
        vm.prank(buyer);
        vm.expectRevert(Market.CannotJoinOwnOrder.selector);
        market.joinOrder(orderId);
    }

    function testJoinSettledOrder() public {
        // First join
        vm.prank(seller);
        market.joinOrder(orderId);

        // Try to join again
        vm.prank(address(0xABC));
        vm.expectRevert(Market.OrderNotOpen.selector);
        market.joinOrder(orderId);
    }

    function testJoinWithInsufficientCollateral() public {
        // Set seller's balance to 0
        vm.startPrank(seller);
        vDOT.transfer(address(0xdead), vDOT.balanceOf(seller));

        vm.expectRevert(
            abi.encodeWithSelector(
                IERC20Errors.ERC20InsufficientBalance.selector,
                seller,
                0,
                COLLATERAL_AMOUNT
            )
        );

        market.joinOrder(orderId);
        vm.stopPrank();
    }
}
