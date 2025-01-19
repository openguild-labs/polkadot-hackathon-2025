// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;
import "./hakifi.proxy.sol";
import "hardhat/console.sol";

contract Hakifi is HakifiProxy {
    function version() external pure returns (string memory) {
        return "v1!";
    }

    enum TYPE {
        CREATE,
        UPDATE_AVAILABLE,
        UPDATE_INVALID,
        REFUND,
        CANCEL,
        CLAIM,
        EXPIRED,
        LIQUIDATED
    }

    /*
     @event
    **/
    event EInsurance(
        string idInsurance,
        address buyer,
        TOKEN unit,
        uint256 margin,
        uint256 claim_amount,
        uint256 expired_time,
        uint256 open_time,
        STATE state,
        TYPE event_type
    );

    /**
     * PENDING - 0
     * AVAILABLE - 1
     * CLAIMED - 2
     * REFUNDED - 3
     * LIQUIDATED - 4
     * EXPIRED - 5
     * CANCELED - 6
     * INVALID - 7
     */
    enum STATE {
        PENDING,
        AVAILABLE,
        CLAIMED,
        REFUNDED,
        LIQUIDATED,
        EXPIRED,
        CANCELED,
        INVALID
    }

    struct Insurance {
        address buyer;
        TOKEN unit;
        uint256 margin;
        uint256 claim_amount;
        uint256 expired_time;
        uint256 open_time;
        STATE state;
        bool valid;
    }

    mapping(string => Insurance) insurance;

    function readInsurance(string memory _index) external view returns (Insurance memory) {
        return insurance[_index];
    }

    function createInsurance(
        string memory _idInsurance,
        TOKEN _unit,
        uint256 _margin
    ) external nonReentrant whenNotPaused {
        require(!insurance[_idInsurance].valid, "Id not unique");
        require(
            usdt.balanceOf(address(msg.sender)) >= _margin || vnst.balanceOf(address(msg.sender)) >= _margin,
            "TOKEN is not enough"
        );

        vault[VAULT.margin_pool][_unit] += _margin;

        insurance[_idInsurance] = Insurance(msg.sender, _unit, _margin, 0, 0, block.timestamp, STATE.PENDING, true);

        if (_unit == TOKEN.USDT) {
            usdt.transferFrom(msg.sender, address(this), _margin);
        } else if (_unit == TOKEN.VNST) {
            vnst.transferFrom(msg.sender, address(this), _margin);
        }

        emit EInsurance(_idInsurance, msg.sender, _unit, _margin, 0, 0, block.timestamp, STATE.PENDING, TYPE.CREATE);
    }

    function updateAvailableInsurance(
        string memory _idInsurance,
        uint256 _claim_amount,
        uint256 _expired_time
    ) external payable onlyRole(MODERATOR_ROLE) {
        require(insurance[_idInsurance].valid, "Id don't exists");
        require(
            usdt.balanceOf(address(msg.sender)) >= _claim_amount ||
            vnst.balanceOf(address(msg.sender)) >= _claim_amount,
            "TOKEN is not enough"
        );

        insurance[_idInsurance].state = STATE.AVAILABLE;
        insurance[_idInsurance].claim_amount = _claim_amount;
        insurance[_idInsurance].expired_time = _expired_time;
        vault[VAULT.claim_pool][insurance[_idInsurance].unit] += _claim_amount;

        emit EInsurance(
            _idInsurance,
            insurance[_idInsurance].buyer,
            insurance[_idInsurance].unit,
            insurance[_idInsurance].margin,
            _claim_amount,
            _expired_time,
            insurance[_idInsurance].open_time,
            STATE.AVAILABLE,
            TYPE.UPDATE_AVAILABLE
        );
    }

    function updateInvalidInsurance(string memory _idInsurance) external payable nonReentrant onlyRole(MODERATOR_ROLE) {
        require(insurance[_idInsurance].valid, "Id don't exists");

        insurance[_idInsurance].state = STATE.INVALID;
        vault[VAULT.margin_pool][insurance[_idInsurance].unit] -= insurance[_idInsurance].margin;

        uint256 margin = insurance[_idInsurance].margin;
        insurance[_idInsurance].margin = 0;

        if (insurance[_idInsurance].unit == TOKEN.USDT) {
            usdt.approve(address(this), margin);
            usdt.transferFrom(address(this), insurance[_idInsurance].buyer, margin);
        } else if (insurance[_idInsurance].unit == TOKEN.VNST) {
            vnst.approve(address(this), margin);
            vnst.transferFrom(address(this), insurance[_idInsurance].buyer, margin);
        }

        emit EInsurance(
            _idInsurance,
            insurance[_idInsurance].buyer,
            insurance[_idInsurance].unit,
            0,
            insurance[_idInsurance].claim_amount,
            insurance[_idInsurance].expired_time,
            insurance[_idInsurance].open_time,
            STATE.INVALID,
            TYPE.UPDATE_INVALID
        );
    }

    function refund(string memory _idInsurance) external payable nonReentrant onlyRole(MODERATOR_ROLE) {
        require(insurance[_idInsurance].valid, "Id don't exists");

        insurance[_idInsurance].state = STATE.REFUNDED;
        vault[VAULT.margin_pool][insurance[_idInsurance].unit] -= insurance[_idInsurance].margin;

        uint256 margin = insurance[_idInsurance].margin;
        insurance[_idInsurance].margin = 0;

        if (insurance[_idInsurance].unit == TOKEN.USDT) {
            usdt.approve(address(this), margin);
            usdt.transferFrom(address(this), insurance[_idInsurance].buyer, margin);
        } else if (insurance[_idInsurance].unit == TOKEN.VNST) {
            vnst.approve(address(this), margin);
            vnst.transferFrom(address(this), insurance[_idInsurance].buyer, margin);
        }

        emit EInsurance(
            _idInsurance,
            insurance[_idInsurance].buyer,
            insurance[_idInsurance].unit,
            0,
            insurance[_idInsurance].claim_amount,
            insurance[_idInsurance].expired_time,
            insurance[_idInsurance].open_time,
            STATE.REFUNDED,
            TYPE.REFUND
        );
    }

    function cancel(string memory _idInsurance) external payable nonReentrant onlyRole(MODERATOR_ROLE) {
        require(insurance[_idInsurance].valid, "Id don't exists");

        insurance[_idInsurance].state = STATE.CANCELED;
        vault[VAULT.margin_pool][insurance[_idInsurance].unit] -= insurance[_idInsurance].margin;

        uint256 margin = insurance[_idInsurance].margin;
        insurance[_idInsurance].margin = 0;

        if (insurance[_idInsurance].unit == TOKEN.USDT) {
            usdt.approve(address(this), margin);
            usdt.transferFrom(address(this), insurance[_idInsurance].buyer, margin);
        } else if (insurance[_idInsurance].unit == TOKEN.VNST) {
            vnst.approve(address(this), margin);
            vnst.transferFrom(address(this), insurance[_idInsurance].buyer, margin);
        }

        emit EInsurance(
            _idInsurance,
            insurance[_idInsurance].buyer,
            insurance[_idInsurance].unit,
            0,
            insurance[_idInsurance].claim_amount,
            insurance[_idInsurance].expired_time,
            insurance[_idInsurance].open_time,
            STATE.CANCELED,
            TYPE.CANCEL
        );
    }

    function claim(string memory _idInsurance) external payable nonReentrant onlyRole(MODERATOR_ROLE) {
        require(insurance[_idInsurance].valid, "Id don't exists");

        insurance[_idInsurance].state = STATE.CLAIMED;
        vault[VAULT.claim_pool][insurance[_idInsurance].unit] -= insurance[_idInsurance].claim_amount;

        uint256 claim_amount = insurance[_idInsurance].claim_amount;
        insurance[_idInsurance].claim_amount = 0;

        if (insurance[_idInsurance].unit == TOKEN.USDT) {
            usdt.approve(address(this), claim_amount);
            usdt.transferFrom(address(this), insurance[_idInsurance].buyer, claim_amount);
        } else if (insurance[_idInsurance].unit == TOKEN.VNST) {
            vnst.approve(address(this), claim_amount);
            vnst.transferFrom(address(this), insurance[_idInsurance].buyer, claim_amount);
        }

        emit EInsurance(
            _idInsurance,
            insurance[_idInsurance].buyer,
            insurance[_idInsurance].unit,
            0,
            0,
            insurance[_idInsurance].expired_time,
            insurance[_idInsurance].open_time,
            STATE.CLAIMED,
            TYPE.CLAIM
        );
    }

    function expire(string memory _idInsurance) external payable nonReentrant onlyRole(MODERATOR_ROLE) {
        require(insurance[_idInsurance].valid, "Id don't exists");

        insurance[_idInsurance].state = STATE.EXPIRED;

        emit EInsurance(
            _idInsurance,
            insurance[_idInsurance].buyer,
            insurance[_idInsurance].unit,
            insurance[_idInsurance].margin,
            insurance[_idInsurance].claim_amount,
            insurance[_idInsurance].expired_time,
            insurance[_idInsurance].open_time,
            STATE.EXPIRED,
            TYPE.EXPIRED
        );
    }

    function liquidate(string memory _idInsurance) external payable nonReentrant onlyRole(MODERATOR_ROLE) {
        require(insurance[_idInsurance].valid, "Id don't exists");

        insurance[_idInsurance].state = STATE.LIQUIDATED;

        emit EInsurance(
            _idInsurance,
            insurance[_idInsurance].buyer,
            insurance[_idInsurance].unit,
            insurance[_idInsurance].margin,
            insurance[_idInsurance].claim_amount,
            insurance[_idInsurance].expired_time,
            insurance[_idInsurance].open_time,
            STATE.LIQUIDATED,
            TYPE.LIQUIDATED
        );
    }
}
