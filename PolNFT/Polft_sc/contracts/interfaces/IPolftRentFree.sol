// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPolftRentFree {
    event Lend(
        bool is721,
        address indexed lenderAddress,
        address indexed nft,
        uint256 indexed tokenId,
        uint256 lendingId,
        uint32 maxRentDuration,
        uint256 dailyRentPrice,
        uint32 lendAmount,
        address contractERC20,
        bool willAutoRenew
    );

    event Rent(
        address indexed renterAddress,
        uint256 indexed lendingId,
        uint256 indexed rentingId,
        uint32 rentAmount,
        uint32 rentDuration,
        uint32 rentedAt
    );

    event StopLend(uint256 indexed lendingId, uint32 stopLendAt, uint32 lendAmount);

    event StopRent(uint256 indexed rentingID, uint32 stoppedAt);

    event RentClaimed(uint256 indexed rentingID, uint32 collectedAt);
}
