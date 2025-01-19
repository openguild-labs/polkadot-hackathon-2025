// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {PreMarketFactory} from "../../src/PreMarketFactory.sol";
import {Market} from "../../src/Market.sol";
import {Ownable} from "@openzeppelin/access/Ownable.sol";

contract PreMarketFactoryTest is Test {
    PreMarketFactory factory;
    address owner;
    address otherUser;
    uint256 constant INITIAL_PLATFORM_FEE = 100; // 1% in basis points

    function setUp() public {
        owner = address(this);
        otherUser = address(0x1234);

        // Deploy factory
        factory = new PreMarketFactory(INITIAL_PLATFORM_FEE);
    }

    function testInitialization() public view {
        uint256 platformFee = factory.platformFee();
        assertEq(platformFee, INITIAL_PLATFORM_FEE * 100);
    }

    function testUpdatePlatformFee() public {
        uint256 newPlatformFee = 200; // 2% in basis points
        factory.updatePlatformFee(newPlatformFee);

        uint256 updatedFee = factory.platformFee();
        assertEq(updatedFee, newPlatformFee);
    }

    function testNonOwnerCannotUpdatePlatformFee() public {
        uint256 newPlatformFee = 200; // 2% in basis points

        vm.prank(otherUser);
        vm.expectRevert(
            abi.encodeWithSelector(
                Ownable.OwnableUnauthorizedAccount.selector,
                otherUser
            )
        );
        factory.updatePlatformFee(newPlatformFee);
    }

    function testCreateMarket() public {
        address tradingToken = address(0x5678);
        address[] memory acceptedCollaterals = new address[](2);
        acceptedCollaterals[0] = address(0x9abc);
        acceptedCollaterals[1] = address(0xdef0);

        uint256 marketId = factory.createMarket(
            tradingToken,
            acceptedCollaterals
        );

        address createdMarket = factory.markets(marketId);
        assertTrue(createdMarket != address(0));
        assertEq(marketId, 1);
    }

    function testCreateMarketRevertsOnNoCollaterals() public {
        address tradingToken = address(0x5678);
        address[] memory acceptedCollaterals = new address[](0);

        vm.expectRevert(PreMarketFactory.NeedAtLeastOneCollateral.selector);
        factory.createMarket(tradingToken, acceptedCollaterals);
    }

    function testMarketIdIncrement() public {
        address tradingToken1 = address(0x5678);
        address tradingToken2 = address(0x1234);
        address[] memory acceptedCollaterals = new address[](1);
        acceptedCollaterals[0] = address(0x9abc);

        uint256 marketId1 = factory.createMarket(
            tradingToken1,
            acceptedCollaterals
        );
        uint256 marketId2 = factory.createMarket(
            tradingToken2,
            acceptedCollaterals
        );

        assertEq(marketId1, 1);
        assertEq(marketId2, 2);
    }
}
