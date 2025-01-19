// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./payment.sol";
import "./IErrorDelivery.sol";

contract delivery is payment, IErrorDelivery {
    /**
     * @notice Owner address
     */
    address public owner;

    /**
     * @notice Constructor
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Station struct
     * @param station_id station id
     * @param name name
     * @param total_order total order
     * @param validitors validitors
     * @dev station struct
     */
    struct Station {
        bytes32 station_id;
        bytes32 name;
        uint256 total_order;
        address[] validitors;
    }

    /**
     * @dev Order struct
     * @param order_id order id
     * @param station_ids station ids
     * @param name name
     * @param sender sender
     * @param receiver receiver
     * @param isDone is done
     */
    struct Order {
        bytes32 order_id;
        bytes32[] station_ids;
        bytes32 name;
        address sender;
        address receiver;
        bool isDone;
    }

    /**
     * @dev isValidatedOrder mapping
     * @notice mapping of order_id and station_id is validated
     */
    mapping (bytes32 => mapping (bytes32 => bool)) isValidatedOrder;

    /**
     * @notice Create station
     */
    modifier onlyOwner() {
        if (owner != msg.sender) {
            revert IsNotOwner();
        }
        _;
    }

    Station[] public stations;
    Order[] public orders;

    /**
     * @notice Create station event
     * @param station_id station id 
     * @param name name
     * @param total_order total order 
     * @param validitors validitors
     */
    event CreateStaion( 
        bytes32 indexed station_id,
        bytes32 name,
        uint256 total_order,
        address[] validitors
    );

    /**
     * @notice Create order event
     * @param order_id order id
     * @param station_ids station ids
     * @param name name
     * @param sender sender
     * @param receiver receiver
     * @param isDone is done
     */
    event CreateOrder(
        bytes32 indexed order_id,
        bytes32[] station_ids,
        bytes32 name,
        address indexed sender,
        address indexed receiver,
        bool isDone
    );

    /**
     * @notice Validate event
     * @param order_id order id
     * @param station_id station id
     */
    event Validate(bytes32 indexed order_id, bytes32 indexed station_id);

    /**
     * @notice Create station
     * @param _name name
     * @param _total_order order 
     * @param _validitors validitors
     */
    function createStation (
        bytes32 _name,
        uint256 _total_order,
        address[] calldata _validitors
    ) external onlyOwner {
        bytes32 id = keccak256(abi.encodePacked(_name, _validitors));
        stations.push(
            Station({
                station_id: id,
                name: _name,
                total_order: _total_order,
                validitors: _validitors
            })
        );

        emit CreateStaion(id, _name, _total_order, _validitors);
    }

    /**
     * @notice Create order
     * @param _station_ids _station_ids
     * @param _name _name
     * @param _sender _sender
     * @param _receiver _receiver
     */
    function createOrder (
        bytes32[] calldata _station_ids,
        bytes32 _name,
        address _sender,
        address _receiver
    ) external {
        bytes32 id = keccak256(abi.encodePacked(_name, _sender, _receiver));
        orders.push(
            Order({
                order_id: id,
                station_ids: _station_ids,
                name: _name,
                sender: _sender,
                receiver: _receiver,
                isDone: false
            })
        );

        for (uint256 i = 0; i < _station_ids.length;) 
        {
            bytes32 station_id = _station_ids[i];
            isValidatedOrder[id][station_id] = false;
        }

        emit CreateOrder(id, _station_ids, _name, _sender, _receiver, false);
    }

    /**
     * @notice Validate order
     * @param _order_id _order_id
     * @param _station_id _station_id
     */
    function validate (bytes32 _order_id, bytes32 _station_id) external {
        bool isValidated = isValidatedOrder[_order_id][_station_id];
        require(!isValidated, "Order is validated");

        Station memory _station = getDetailStation(_station_id);
        bool _isValidator = isValidator(_station.validitors);

        if (!_isValidator) {
            revert IsNotValidator();
        }

        isValidatedOrder[_order_id][_station_id] = true;
        emit  Validate(_order_id, _station_id);
    }

    /**
     * @notice isValidator function
     * @param validators Validators
     */
    function isValidator(address[] memory validators) public view returns (bool) {
        for (uint256 i = 0; i < validators.length;) 
        {
            if (msg.sender == validators[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice getDetailOrder function
     * @param _order_id Order id
     */
    function getDetailOrder(bytes32 _order_id) public view returns (Order memory order) {
        for (uint256 i = 0; i < orders.length;) 
        {
            Order storage _order = orders[i];
            if (_order_id == _order.order_id) {
                return _order;
            }
        }
    }
    
    /**
     * @notice getDetailStation function
     * @param _station_id Station id
     */
    function getDetailStation(bytes32 _station_id) public view returns (Station memory station) {
        for (uint256 i = 0; i < stations.length;) 
        {
            Station storage _station = stations[i];
            if (_station_id == _station.station_id) {
                return _station;
            }
        }
    }

    /**
     * @notice getAllStation function
     */
    function getAllStation() external view returns (Station[] memory) {
        return stations;
    }

    /**
     * @notice getAllOrder function
     */
    function getAllOrder() external view returns (Order[] memory) {
        return orders;
    }

}