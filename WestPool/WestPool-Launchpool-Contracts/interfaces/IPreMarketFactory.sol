// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPreMarketFactory {
    event MarketCreated(
        address indexed token,
        address market,
        address[] acceptedCollaterals
    );

    error NeedAtLeastOneCollateral();

    function createMarket(
        address tradingToken,
        address[] calldata acceptedCollaterals
    ) external returns (uint256 marketId);

    function updatePlatformFee(uint256 _platformFee) external;

    function getMarket(uint256 marketId) external view returns (address);

    function getCurrentMarketId() external view returns (uint256);

    function getPlatformFee() external view returns (uint256);

    function markets(uint256) external view returns (address);

    function platformFee() external view returns (uint256);

    function DECIMALS() external view returns (uint256);
}
