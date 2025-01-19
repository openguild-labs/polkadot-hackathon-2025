// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {BaseTest} from "./BaseTest.t.sol";
import {Market} from "../../src/Market.sol";
import {MockERC20} from "../../script/MockERC20.s.sol";

contract CreateOrderTest is BaseTest {
    event OrderCreated(
        uint256 indexed orderId,
        Market.OrderCreator creatorType,
        address indexed creator,
        uint256 projectTokenAmount,
        uint256 collateralAmount,
        address collateralToken
    );

    function testCreateBuyOrder() public {
        // Setup test data
        uint256 projectTokenAmount = 100 ether;
        uint256 collateralAmount = 50 ether;
        address collateralToken = address(vDOT);

        // Test: create a buy order
        vm.prank(buyer);
        uint256 orderId = market.createOrder(
            Market.OrderCreator.BUYER,
            projectTokenAmount,
            collateralAmount,
            collateralToken
        );

        // Fetch the created order
        Market.Order memory order = market.getOrder(orderId);

        // Validate the created order
        assertEq(order.creator, buyer);
        assertEq(
            uint256(order.creatorType),
            uint256(Market.OrderCreator.BUYER)
        );
        assertEq(order.projectTokenAmount, projectTokenAmount);
        assertEq(order.collateralAmount, collateralAmount);
        assertEq(order.collateralToken, collateralToken);
        assertEq(uint256(order.status), uint256(Market.OrderStatus.OPEN));
        assertEq(order.settleTime, 0);
    }

    function testCreateSellOrder() public {
        // Setup test data
        uint256 projectTokenAmount = 100 ether;
        uint256 collateralAmount = 50 ether;
        address collateralToken = address(vASTR);

        // Test: create a sell order
        vm.prank(seller);
        uint256 orderId = market.createOrder(
            Market.OrderCreator.SELLER,
            projectTokenAmount,
            collateralAmount,
            collateralToken
        );

        // Fetch the created order
        Market.Order memory order = market.getOrder(orderId);

        // Validate the created order
        assertEq(order.creator, seller);
        assertEq(
            uint256(order.creatorType),
            uint256(Market.OrderCreator.SELLER)
        );
        assertEq(order.projectTokenAmount, projectTokenAmount);
        assertEq(order.collateralAmount, collateralAmount);
        assertEq(order.collateralToken, collateralToken);
        assertEq(uint256(order.status), uint256(Market.OrderStatus.OPEN));
        assertEq(order.settleTime, 0);
    }

    function testCreateOrderWithInvalidCollateralToken() public {
        // Setup test data
        uint256 projectTokenAmount = 100 ether;
        uint256 collateralAmount = 50 ether;
        address invalidCollateralToken = address(0x123);

        // Test: create an order with an invalid collateral token
        vm.prank(buyer);
        vm.expectRevert(Market.NotAcceptedVToken.selector);
        market.createOrder(
            Market.OrderCreator.BUYER,
            projectTokenAmount,
            collateralAmount,
            invalidCollateralToken
        );
    }

    function testFailCreateOrderWithInsufficientBalance() public {
        // Setup test data
        uint256 projectTokenAmount = 100 ether;
        uint256 collateralAmount = 50 ether;
        address collateralToken = address(vDOT);

        // Set buyer's balance to 0 (no collateral)
        vm.prank(buyer);
        vDOT.mint(buyer, 0);

        // Test: create an order with insufficient collateral balance
        vm.prank(buyer);
        vm.expectRevert("ERC20: transfer amount exceeds balance");
        market.createOrder(
            Market.OrderCreator.BUYER,
            projectTokenAmount,
            collateralAmount,
            collateralToken
        );
    }
}
