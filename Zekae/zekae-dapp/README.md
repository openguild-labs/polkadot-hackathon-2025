# **Project Name**  
ZeKae Protocol

## **Documentation**

The protocol works as follows:

1. User deposits LST into the vault.
2. User mints zUSD using the LST as collateral.
3. User can withdraw LST from the vault.
4. Based on the price of the underlying asset, the exchange rate between the underlying asset and the LST (calculated by the LST provider), the oracle allows the vault to fetch the price of the LST to calculate the maximum amount of zUSD that can be minted based on the user LST deposit.
5. User can mint and burn zUSD within the maximum amount.
6. The vault will allow liquidators to liquidate the user's LST deposit if the collateral ratio is below the threshold, this happens when the price of the underlying asset drops significantly (say during bear market).
7. The liquidator will pay back the vault the amount of zUSD that was minted by the user and receive the user's LST deposit.
