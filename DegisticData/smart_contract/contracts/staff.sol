// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract staff {
    /**
     * @notice Staff struct
     * @param station_id station id
     * @param staff_address staff address
     * @param order_ids order ids
     * @param is_active is active
     */
    struct Staff {
        bytes32 station_id;
        address staff_address;
        bytes32[] order_ids;
        bool is_active;
    }

    /**
     * @notice Staff station mapping
     * @notice mapping of station_id and staff
     */
    mapping (bytes32 => Staff[]) public staff_station;


    event AddStaff(bytes32 station_id, address staff_address, bytes32[] order_ids, bool is_active);    
    event ModifyStaff(bytes32 station_id, address staff_address);    
    event RemoveStaff(bytes32 station_id, address staff_address, bool is_active);

    /**
     * @notice Add staff
     * @param _station_id is station id
     * @param _staff_address is staff address
     */
    function addStaff (bytes32 _station_id, address _staff_address) external {
        bytes32[] memory order_id_array;

        staff_station[_station_id].push(
            Staff({
                station_id: _station_id,
                staff_address: _staff_address,
                order_ids: order_id_array,
                is_active: true
            })
        );

        emit AddStaff(_station_id, _staff_address, order_id_array, true);
    }

    /**
     * @notice Modify staff
     * @param _station_id is station id
     * @param _new_station_id is new station id
     * @param _staff_address is staff address
     */
    function modifyStaff (bytes32 _station_id, bytes32 _new_station_id, address _staff_address) external {
        bool existStaff = isExistStaff(_station_id, _staff_address);

        require(existStaff, "Staff is not exist");

        uint256 length = staff_station[_station_id].length;

        for (uint256 i = 0; i < length;) 
        {
            Staff storage staff = staff_station[_station_id][i];
            if (staff.staff_address == _staff_address) {
                staff.station_id = _new_station_id;
            }
            
            unchecked {
                ++i;
            }
        }

        emit ModifyStaff(_new_station_id, _staff_address);
    }

    /**
     * @notice Remove staff
     * @param _station_id is station id
     * @param _staff_address is staff address
     */
    function removeStaff (bytes32 _station_id, address _staff_address) external {
        bool existStaff = isExistStaff(_station_id, _staff_address);

        require(existStaff, "Staff is not exist");

        uint256 length = staff_station[_station_id].length;

        for (uint256 i = 0; i < length;) 
        {
            Staff storage staff = staff_station[_station_id][i];
            if (staff.staff_address == _staff_address) {
                staff.is_active = false;
            }
            
            unchecked {
                ++i;
            }
        }

        emit RemoveStaff(_station_id, _staff_address, false);
    }

    /**
     * @notice isExistStaff function
     * @param _station_id is station id
     * @param _staff_address is staff address
     */
    function isExistStaff(bytes32 _station_id, address _staff_address) public view returns (bool) {
        uint256 length = staff_station[_station_id].length;

        for (uint256 i = 0; i < length;) 
        {
            Staff storage staff = staff_station[_station_id][i];
            if (staff.staff_address == _staff_address) {
                return true;
            }
            
            unchecked {
                ++i;
            }
        }

        return false;
    }

    /**
     * @notice getAllStaffsOnStation function
     * @param _station_id is station id
     */
    function getAllStaffsOnStation (bytes32 _station_id) external view returns (Staff[] memory) {
        Staff[] storage staff = staff_station[_station_id];

        return staff;
    }
}