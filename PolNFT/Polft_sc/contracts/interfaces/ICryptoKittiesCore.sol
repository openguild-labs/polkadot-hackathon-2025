// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ICryptoKittiesCore {
    function transfer(address _to, uint256 _tokenId) external;
}