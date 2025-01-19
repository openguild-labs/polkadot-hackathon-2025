// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script } from "forge-std/Script.sol";
import { LSToken } from "src/LSToken.sol";
import { zUSD } from "src/zUSD.sol";
import { ZekaeVault } from "src/ZekaeVault.sol";
import { SimpleMockOracle } from "src/SimpleMockOracle.sol";

contract Deploy is Script {
    function run() external returns (LSToken, zUSD, ZekaeVault, SimpleMockOracle) {

        address owner = 0x6FaFF29226219756aa40CE648dbc65FB41DE5F72;

        /// @dev start the broadcast
        vm.startBroadcast();

        /// @dev create a new LSToken contract with the active network configuration
        LSToken lstoken = new LSToken(owner);

        /// @dev create a new zUSD contract with the active network configuration
        zUSD zusd = new zUSD(owner);

        /// @dev create a new SimpleMockOracle contract with the active network configuration
        SimpleMockOracle simpleMockOracle = new SimpleMockOracle(owner, 1.5e18, 10e18);

        /// @dev create a new ZekaeVault contract with the active network configuration
        ZekaeVault zekaeVault = new ZekaeVault(address(lstoken), address(zusd), address(simpleMockOracle), owner);

        /// @dev transfer ownership of the zUSD contract to the ZekaeVault contract
        zusd.changeOwner(address(zekaeVault));

        /// @dev stop the broadcast
        vm.stopBroadcast();

        /// @dev return the LSToken, zUSD, ZekaeVault, and MockOracle contracts
        return (lstoken, zusd, zekaeVault, simpleMockOracle);
    }
}
