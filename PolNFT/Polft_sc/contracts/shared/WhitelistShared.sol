// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IWhitelist.sol";

contract WhitelistShared {
  address private _whitelistAddress;

  event WhitelistChanged(address indexed newOwner);

  modifier validateAdmin() {
    bytes32 ADMIN_ROLE = IWhitelist(_whitelistAddress).ADMIN_ROLE();
    require (IWhitelist(_whitelistAddress).hasRole(ADMIN_ROLE, msg.sender), "WhitelistWrapper: You don't have admin role");
    _;
  }

  modifier validateGranter() {
    bytes32 GRANT_ROLE = IWhitelist(_whitelistAddress).GRANT_ROLE();
    require (IWhitelist(_whitelistAddress).hasRole(GRANT_ROLE, msg.sender), "WhitelistWrapper: You don't have admin role");
    _;
  }

  modifier validateGranterOnPerson(address _address){
    bytes32 GRANT_ROLE = IWhitelist(_whitelistAddress).GRANT_ROLE();
    require(IWhitelist(_whitelistAddress).hasRole(GRANT_ROLE, _address), "WhitelistWrapper: You don't have grant role");
    _;
  }

  modifier validateAdminOnPerson(address _address){
    bytes32 ADMIN_ROLE = IWhitelist(_whitelistAddress).ADMIN_ROLE();
    require(IWhitelist(_whitelistAddress).hasRole(ADMIN_ROLE, _address), "WhitelistWrapper: You don't have admin role");
    _;
  }

  function _setWhitelistAddress(address whitelistAddress_) internal virtual {
    _whitelistAddress = whitelistAddress_;
    emit WhitelistChanged(_whitelistAddress);
  }
}