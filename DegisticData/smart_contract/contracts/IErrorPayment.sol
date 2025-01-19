// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IErrorPayment {
    /**
     * @dev is insufficient amount
     */
    error Isinsufficient();

    /**
     * @dev is not exit delivery
     */
    error IsNotExitDelivery();

}