// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import {IZUSD} from "src/IZUSD.sol";
import {LSToken} from "src/LSToken.sol";
import {zUSD} from "src/zUSD.sol";
import {ZekaeVault} from "src/ZekaeVault.sol";
import {SimpleMockOracle} from "src/SimpleMockOracle.sol";
import {Test, console} from "forge-std/Test.sol";

contract ZekaeVaultTest is Test {
    LSToken public lstoken;
    zUSD public zusd;
    ZekaeVault public zekaeVault;
    address public constant USER = address(1);
    address public constant LIQUIDATOR = address(2);
    uint256 public constant lstokenPriceAtCreation = 10e18;
    SimpleMockOracle public oracle;

    function setUp() public {
        lstoken = new LSToken(USER);
        zusd = new zUSD(USER);
        oracle = new SimpleMockOracle(USER, 1.443307e18, 10e18);
        zekaeVault = new ZekaeVault(address(lstoken), address(zusd), address(oracle), LIQUIDATOR);
        vm.startPrank(USER);
        zusd.changeOwner(address(zekaeVault));
        vm.stopPrank();
    }

    function test_lstokenOwner() public view {
        assertEq(address(lstoken.owner()), USER);
    }

    function test_zUSDOwner() public view {
        assertEq(address(zusd.owner()), address(zekaeVault));
    }

    function test_OracleOwner() public view {
        assertEq(address(oracle.owner()), USER);
    }

    function test_ZekaeVaultDepositAndMint() public {
        vm.startPrank(USER);
        lstoken.mint(USER, 1000000e18);
        lstoken.approve(address(zekaeVault), 1000e18);
        zekaeVault.deposit(1000e18);
        zekaeVault.mint(100e18);
        vm.stopPrank();
        assertEq(lstoken.balanceOf(USER), 999000e18);
        assertEq(zusd.balanceOf(USER), 100e18);
    }

    function test_ZekaeVaultDepositMintAndBurn() public {
        vm.startPrank(USER);
        lstoken.mint(USER, 1000000e18);
        lstoken.approve(address(zekaeVault), 1000e18);
        zekaeVault.deposit(1000e18);
        zekaeVault.mint(100e18);
        zekaeVault.burn(100e18);
        vm.stopPrank();
        assertEq(lstoken.balanceOf(USER), 999000e18);
        assertEq(lstoken.balanceOf(address(zekaeVault)), 1000e18);
        assertEq(zusd.balanceOf(USER), 0e18);
    }

    function test_RevertIf_LiquidateWhenUserCollateralRatioIsMoreThanMinCollateralRatio() public {
        vm.startPrank(USER);
        lstoken.mint(USER, 1000000e18);
        lstoken.approve(address(zekaeVault), 1000e18);
        zekaeVault.deposit(1000e18);
        zekaeVault.mint(100e18);
        vm.stopPrank();
        vm.startPrank(LIQUIDATOR);
        vm.expectRevert();
        zekaeVault.liquidate(USER);
        vm.stopPrank();
    }

    function test_LiquidateWhenUserCollateralRatioIsLessThanMinCollateralRatio() public {
        vm.startPrank(USER);
        lstoken.mint(USER, 1000000e18);
        lstoken.approve(address(zekaeVault), 1000e18);
        zekaeVault.deposit(10e18);
        uint256 initialUserDeposit = zekaeVault.addressToDeposit(USER);
        zekaeVault.mint(50e18);
        uint256 initialUserMinted = zekaeVault.addressToMinted(USER);
        oracle.setUnderlyingAssetPrice(5e18);
        vm.stopPrank();
        vm.startPrank(LIQUIDATOR);
        zekaeVault.liquidate(USER);
        uint256 amountOfLstokenToBeLiquidated = (initialUserMinted * 1e18) / oracle.latestAnswer();
        vm.stopPrank();
        assertEq(zusd.balanceOf(USER), 0e18);
        assertEq(lstoken.balanceOf(LIQUIDATOR), amountOfLstokenToBeLiquidated);
        assertEq(zekaeVault.addressToDeposit(USER), initialUserDeposit - amountOfLstokenToBeLiquidated);
    }
}


