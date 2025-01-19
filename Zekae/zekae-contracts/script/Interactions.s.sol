// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { Script, console } from "forge-std/Script.sol";
import { LSToken } from "src/LSToken.sol";

contract DrawLuckyDraw is Script {
    LSToken lstoken = LSToken(0x3460A7314E82c7F9Ac946849c24a23c6ED0F93a4);

    /// -----------------------------------------------------------------------
    /// Interactions
    /// -----------------------------------------------------------------------
    function run() external {
        vm.startBroadcast();
        lstoken.mint(0xe3d25540BA6CED36a0ED5ce899b99B5963f43d3F, 500000000000000000000000);
        lstoken.mint(0x1B7a0b3E366CC0549A96ED4123E8058d59282f3f, 500000000000000000000000);
        vm.stopBroadcast();
    }
}