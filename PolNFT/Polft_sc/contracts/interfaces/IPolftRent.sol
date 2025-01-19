// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPolftRent {
    event Lent(
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint32 lentAmount,
        uint256 lendingId,
        address indexed lenderAddress,
        uint32 maxRentDuration,
        uint256 dailyRentPrice,
        uint256 nftPrice,
        bool isERC721,
        address currencyAddress
    );

    event Rent(
        uint256 lendingId,
        address indexed renterAddress,
        uint32 rentDuration,
        uint32 rentedAt
    );

    event Returned(uint256 indexed lendingId, uint32 returnedAt);

    event CollateralClaimed(uint256 indexed lendingId, uint32 claimedAt);

    event LendingStopped(uint256 indexed lendingId, uint32 stoppedAt);

}