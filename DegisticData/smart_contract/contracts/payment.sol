// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./IErrorPayment.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract payment is IErrorPayment {
    /**
     * @notice SafeERC20 library
     * @dev Safe wrapper around ERC20 operations
     */
    using SafeERC20 for IERC20;

    /**
     * @notice Payment struct
     * @param delivery_id delivery id
     * @param station_id station id
     * @param sender sender address
     * @param total_amount total amount
     * @param payment_amount payment amount
     * @param is_done is done
     */
    struct Payment {
       bytes32 delivery_id;
        bytes32 station_id;
        address sender;
        uint256 total_amount;
        uint256 payment_amount;
        bool is_done;
    } 

    /**
     * @notice Payment array
     * @dev payments array of Payment
     */
    Payment[] public payments;

    /**
     * @dev delivery index
     * @dev station index
     */
    mapping (bytes32 => uint256) delivery_index;
    mapping (bytes32 => uint256) station_index;

    /**
     * @notice InitPayment event
     * @param delivery_id delivery id
     * @param station_id station id
     * @param sender sender address
     * @param total_amount total amount
     * @param payment_amount payment amount
     * @param is_done is done
     * @dev emit InitPayment event
     */
    event InitPayment(
        bytes32 indexed delivery_id,
        bytes32 indexed station_id,
        address sender,
        uint256 total_amount,
        uint256 payment_amount,
        bool is_done
    );

    /**
     * @notice Pay event
     * @param delivery_id delivery id
     * @param amount amount
     * @dev emit Pay event
     */
    event Pay(
        bytes32 indexed delivery_id,
        uint256 amount
    );

    /**
     * @notice isExistDelivery modifier
     * @param delivery_id delivery id
     * @dev check if delivery exist
     * @dev if not exist, revert IsNotExitDelivery
     * @dev else, continue
     */
    modifier isExistDelivery(bytes32 delivery_id) {
        uint256 index = delivery_index[delivery_id];
        if (index >= payments.length || index < 0) {
            revert IsNotExitDelivery();
        }
        _;
    }

    /**
     * @notice initPayment function
     * @param _delivery_id delivery id
     * @param _station_id station id
     * @param _total_amount total amount
     * @dev init payment
    */
    function initPayment (
        bytes32 _delivery_id,
        bytes32 _station_id,
        uint256 _total_amount
    ) external {

        payments.push(Payment({
            delivery_id: _delivery_id,
            station_id: _station_id,
            sender: msg.sender,
            total_amount: _total_amount,
            payment_amount: 0,
            is_done: false
        }));

        uint256 index = payments.length;
        delivery_index[_delivery_id] = index - 1;
        station_index[_station_id] = index - 1;

        emit InitPayment(_delivery_id, _station_id, msg.sender, _total_amount, 0, false);
    }

    /**
     * @notice pay function
     * @param delivery_id delivery id
     * @param token token address
     * @param amount amount
     * @dev pay
     */
    function pay(bytes32 delivery_id, address token, uint256 amount) external {
        require(amount > 0, "Amount is less than 0");

        Payment storage delivery_instance =  payments[delivery_index[delivery_id]];

        unchecked {
            delivery_instance.payment_amount += amount;
        }

        IERC20(token).approve(address(this), amount);
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);      

        emit Pay(delivery_id, amount);
    }

    /**
     * @notice checkDone function
     * @param delivery_id delivery id
     * @dev check done
     */
    function checkedDone (bytes32 delivery_id) public view isExistDelivery(delivery_id) returns (bool) {
        uint256 index = delivery_index[delivery_id];

        Payment storage payment_instance = payments[index];

        return payment_instance.is_done;
    }  
    
    /**
     * @notice getPayment function
     */
    function getAllPayments() external view returns (Payment[] memory) {
        return payments;
    }

    /**
     * @notice getDetailPayment function
     * @param delivery_id delivery id
     */
    function getDetailPayment (bytes32 delivery_id) external view returns (Payment memory) {
        return payments[delivery_index[delivery_id]];
    }
}