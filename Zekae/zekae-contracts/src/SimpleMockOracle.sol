// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

contract SimpleMockOracle {

  // This is the exchange rate of the token to the underlying asset
  // 1 token = 1 underlying asset starting out
  // over time, the exchange rate will change 1 token = 1.1 underlying asset
  // the oracle will return the current exchange rate in the form of
  // UNDERLYING_ASSET / TOKEN
  // so at the start, the oracle will return 1e18
  // over time, the oracle will return 1.1e18
  // this is to simulate the price of the token increasing over time
  uint256 public exchangeRate; // current sample exchange rate in 1e18 precision
  uint256 public underlyingAssetPrice; // price of underlying asset in USD
  address public owner;

  modifier onlyOwner() {
    require(owner == msg.sender);
    _;
  }

  constructor(address _owner, uint256 _exchangeRate, uint256 _underlyingAssetPrice) {
    owner = _owner;
    exchangeRate = _exchangeRate;
    underlyingAssetPrice = _underlyingAssetPrice;
  }

  /// @notice Returns the current price of the token in terms of the underlying asset
  /// @dev Price is calculated by multiplying the exchange rate by the underlying asset price
  /// @return uint The current price in wei (1e18 precision)
  function latestAnswer() external view returns (uint256) {
    return exchangeRate * underlyingAssetPrice / 1e18;
  }

  /// @notice Sets the exchange rate of the token to the underlying asset
  /// @param _exchangeRate The new exchange rate in wei (1e18 precision)
  function setExchangeRate(uint256 _exchangeRate) external onlyOwner {
    exchangeRate = _exchangeRate;
  }

  /// @notice Sets the price of the underlying asset
  /// @param _underlyingAssetPrice The new price of the underlying asset in wei (1e18 precision)
  function setUnderlyingAssetPrice(uint256 _underlyingAssetPrice) external onlyOwner {
    underlyingAssetPrice = _underlyingAssetPrice;
  }

}
