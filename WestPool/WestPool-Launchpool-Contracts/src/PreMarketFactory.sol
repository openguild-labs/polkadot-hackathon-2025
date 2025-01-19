// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/access/Ownable.sol";
import {Market} from "./Market.sol";

contract PreMarketFactory is Ownable {
    /////////////////////////////////////////////////////////////////
    //////////////////////// CONTRACT STATES ///////////////////////
    ///////////////////////////////////////////////////////////////
    mapping(uint256 => address) public markets;
    uint256 private _nextMarketId;
    uint256 public platformFee; // In basis points (1% = 100)
    uint256 public constant DECIMALS = 2;

    /////////////////////////////////////////////////////////////////
    //////////////////////// CONTRACT EVENTS ///////////////////////
    ///////////////////////////////////////////////////////////////
    event MarketCreated(
        address indexed token,
        address market,
        address[] acceptedCollaterals
    );

    /////////////////////////////////////////////////////////////////
    //////////////////////// CONTRACT ERRORS ///////////////////////
    ///////////////////////////////////////////////////////////////
    error NeedAtLeastOneCollateral();

    constructor(uint256 _platformFee) Ownable(_msgSender()) {
        _nextMarketId = 1;
        platformFee = _platformFee * (10 ** DECIMALS);
    }

    function createMarket(
        address tradingToken,
        address[] calldata acceptedCollaterals
    )
        external
        needAtLeastOneCollateral(acceptedCollaterals)
        returns (uint256 marketId)
    {
        marketId = _nextMarketId++;

        Market newMarket = new Market(
            tradingToken,
            platformFee,
            acceptedCollaterals
        );
        markets[marketId] = address(newMarket);

        emit MarketCreated(
            tradingToken,
            address(newMarket),
            acceptedCollaterals
        );
        return marketId;
    }

    function updatePlatformFee(uint256 _platformFee) external onlyOwner {
        platformFee = _platformFee;
    }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////// REGULAR VIEW FUNCTIONS /////////////////////////
    ////////////////////////////////////////////////////////////////////////

    function getMarket(uint256 marketId) external view returns (address) {
        return markets[marketId];
    }

    function getCurrentMarketId() external view returns (uint256) {
        return _nextMarketId;
    }

    function getPlatformFee() external view returns (uint256) {
        return platformFee;
    }

    //////////////////////////////////////////////////////////////////////////
    /////////////////////////////// MODIFIERS ///////////////////////////////
    ////////////////////////////////////////////////////////////////////////

    modifier needAtLeastOneCollateral(address[] calldata acceptedCollaterals) {
        if (acceptedCollaterals.length == 0) {
            revert NeedAtLeastOneCollateral();
        }
        _;
    }
}
