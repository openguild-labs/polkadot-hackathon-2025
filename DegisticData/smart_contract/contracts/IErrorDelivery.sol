// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IErrorDelivery {
    /**
     * @dev is not owner of contract
     */
    error IsNotOwner();

    /**
     * @dev is not validator
     */
    error IsNotValidator();
}