// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IWhitelist.sol";

contract WhitelistLibrary {
  modifier validateAdmin(address _whitelistAddress, address _sender) {
    bytes32 ADMIN_ROLE = IWhitelist(_whitelistAddress).ADMIN_ROLE();
    require (IWhitelist(_whitelistAddress).hasRole(ADMIN_ROLE, _sender), "WhitelistWrapper: You don't have admin role");
    _;
  }

  modifier validateGranter(address _whitelistAddress, address _sender) {
    bytes32 GRANT_ROLE = IWhitelist(_whitelistAddress).GRANT_ROLE();
    require (IWhitelist(_whitelistAddress).hasRole(GRANT_ROLE, _sender), "WhitelistWrapper: You don't have admin role");
    _;
  }

  modifier validateGranterOnPerson(address _whitelistAddress, address _sender){
    bytes32 GRANT_ROLE = IWhitelist(_whitelistAddress).GRANT_ROLE();
    require(IWhitelist(_whitelistAddress).hasRole(GRANT_ROLE, _sender), "WhitelistWrapper: You don't have grant role");
    _;
  }
}