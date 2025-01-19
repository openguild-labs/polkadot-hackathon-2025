// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC20} from "src/ERC20.sol";
import {IZUSD} from "src/IZUSD.sol";
import {ISimpleMockOracle} from "src/ISimpleMockOracle.sol";

contract ZekaeVault {
    uint256 public constant MIN_COLLATERAL_RATIO = 1.5e18;
    address public liquidator;

    ERC20 public lstoken; // mock stKAIA for testing
    IZUSD public zusd;

    ISimpleMockOracle public oracle;
    
    error CollateralRatioIsLessThanMinimumCollateralRatio();
    error CollateralRatioIsGreaterOrEqualToMaximumCollateralRatio();

    mapping(address => uint256) public addressToDeposit;
    mapping(address => uint256) public addressToMinted;

    constructor(address _lstoken, address _zusd, address _oracle, address _liquidator) {
        lstoken = ERC20(_lstoken);
        zusd = IZUSD(_zusd);
        oracle = ISimpleMockOracle(_oracle);
        liquidator = _liquidator;
    }

    function deposit(uint256 amount) public {
        lstoken.transferFrom(msg.sender, address(this), amount);
        addressToDeposit[msg.sender] += amount;
    }

    function burn(uint256 amount) public {
        addressToMinted[msg.sender] -= amount;
        zusd.burn(msg.sender, amount);
    }

    function mint(uint256 amount) public {
        if (collateralRatio(msg.sender) < MIN_COLLATERAL_RATIO) {
            revert CollateralRatioIsLessThanMinimumCollateralRatio();
        }
        addressToMinted[msg.sender] += amount;

        zusd.mint(msg.sender, amount);
    }

    function withdraw(uint256 amount) public {
        if (collateralRatio(msg.sender) < MIN_COLLATERAL_RATIO) {
            revert CollateralRatioIsLessThanMinimumCollateralRatio();
        }
        addressToDeposit[msg.sender] -= amount;
        lstoken.transfer(msg.sender, amount);
    }

    function liquidate(address user) public {
        if (collateralRatio(user) >= MIN_COLLATERAL_RATIO) {
            revert CollateralRatioIsGreaterOrEqualToMaximumCollateralRatio();
        }
        
        // Store values in memory
        uint256 userMinted = addressToMinted[user];
        
        // Calculate the amount of lstoken to be transferred to the liquidator
        uint256 amountOfLstokenToBeLiquidated = (userMinted * 1e18) / oracle.latestAnswer();

        // Update state before external calls
        addressToDeposit[user] -= amountOfLstokenToBeLiquidated;
        addressToMinted[user] = 0;
        
        // Perform external calls last
        zusd.burn(user, userMinted);
        lstoken.transfer(liquidator, amountOfLstokenToBeLiquidated);
    }

    function collateralRatio(address user) public view returns (uint256) {
        uint256 minted = addressToMinted[user];
        if (minted == 0) {
            return type(uint256).max;
        }
        uint256 totalValue = addressToDeposit[user] * oracle.latestAnswer();
        return totalValue / minted;
    }
}
