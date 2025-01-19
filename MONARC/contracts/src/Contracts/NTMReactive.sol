// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.8.0;

import '../../IReactive.sol';
import '../../AbstractReactive.sol';
import '../../ISubscriptionService.sol';

contract NTMReactive is IReactive, AbstractReactive {
    // Chain configuration
    uint256 private constant ORIGIN_CHAIN_ID = 11155111;
    uint256 private constant DESTINATION_CHAIN_ID = 11155111;
    address private immutable ORIGIN_CONTRACT = 0x88048DD557Da01563E72B7003505ABF4b6f53844;
    address private immutable DESTINATION_CONTRACT = 0x6E920a818D8eCF03298d754A634c237Fa9BEbC60;

    // Gas configuration
    uint64 private constant CALLBACK_GAS_LIMIT = 1000000;
    
    // Event topics
    uint256 private constant TRANFERFROM_SUCCESFULL_0_TOPIC_0 = 0xfd2fdad9544930ef86eaab1cb0a9a131218468940f06c00aeba1844e33e08fa2;

    // State variables
    uint256 private tokens;

    constructor() {
        // Subscribe to the specified event
        bytes memory payload = abi.encodeWithSignature(
            "subscribe(uint256,address,uint256,uint256,uint256,uint256)",
            ORIGIN_CHAIN_ID,
            ORIGIN_CONTRACT,
            TRANFERFROM_SUCCESFULL_0_TOPIC_0,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );
        
        (bool subscriptionResult,) = address(service).call(payload);
        vm = !subscriptionResult;
    }

    receive() external payable {}

    function react(
        uint256 /*chainId*/,
        address /*_contract*/,
        uint256 topic_0,
        uint256 topic_1,
        uint256 topic_2,
        uint256 topic_3,
        bytes calldata /*data*/,
        uint256 /*blockNumber*/,
        uint256 /*opCode*/
    ) external vmOnly {
        if (topic_0 == TRANFERFROM_SUCCESFULL_0_TOPIC_0) {
            

            // Prepare callback payload
            bytes memory payload = abi.encodeWithSignature(
                "recordSale(address,address,uint256,uint256)",
                address(0),
                address(uint160(topic_1)),
                topic_2,
                topic_3
            );

            // Emit callback event
            emit Callback(
                DESTINATION_CHAIN_ID,
                DESTINATION_CONTRACT,
                CALLBACK_GAS_LIMIT,
                payload
            );
        }
    }
}