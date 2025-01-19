
 

    // SPDX-License-Identifier: GPL-2.0-or-later
    pragma solidity >=0.8.0;
    
    import '../../IReactive.sol';
    import '../../AbstractReactive.sol';
    import '../../ISubscriptionService.sol';
    
    contract STKReactive is IReactive, AbstractReactive {
        
    
        uint256 private constant ORIGIN_CHAIN_ID = 11155111;
        uint256 private constant DESTINATION_CHAIN_ID = 5318008;
        address private immutable ORIGIN_CONTRACT = 0x88048DD557Da01563E72B7003505ABF4b6f53844;
        address private immutable DESTINATION_CONTRACT = 0xe4F0d45c970523a835D06615aCCC50B7778859e0;
    
        uint64 private constant CALLBACK_GAS_LIMIT = 1000000;
        
        //You Can Rename Your Events Topic For Better Clarity(Here and in Subscription or react function as well)
        uint256 private constant NFT_LOCKED_TOPIC_0 = 0x2b7170d02ad1822b7c2251889c5c9a2f8be79968856eba4c1d5097f628739611;
        uint256 private constant TOKEN_LISTED_TOPIC_0 = 0x5dc96537cbae524775a674b6a810d9a1ba04a9e279f172d156b352151394677a;
        uint256 private constant TOKEN_UNLISTED_TOPIC_0 = 0xe0bba5d0bdeddbcc4ef688b9d8170c81883fb4c4a7065d8970c58b47996dd2d7;
    
        constructor() {       
        bytes memory payload_0 = abi.encodeWithSignature(
            "subscribe(uint256,address,uint256,uint256,uint256,uint256)",
            ORIGIN_CHAIN_ID,
            ORIGIN_CONTRACT,
            NFT_LOCKED_TOPIC_0,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );
        (bool subscription_result_0,) = address(service).call(payload_0);
        vm = !subscription_result_0;
        
        bytes memory payload_1 = abi.encodeWithSignature(
            "subscribe(uint256,address,uint256,uint256,uint256,uint256)",
            ORIGIN_CHAIN_ID,
            ORIGIN_CONTRACT,
            TOKEN_LISTED_TOPIC_0,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );
        (bool subscription_result_1,) = address(service).call(payload_1);
        vm = !subscription_result_1;
        
        bytes memory payload_2 = abi.encodeWithSignature(
            "subscribe(uint256,address,uint256,uint256,uint256,uint256)",
            ORIGIN_CHAIN_ID,
            ORIGIN_CONTRACT,
            TOKEN_UNLISTED_TOPIC_0,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );
        (bool subscription_result_2,) = address(service).call(payload_2);
        vm = !subscription_result_2;
        }

        receive() external payable {}
    
        
    
        function react(
            uint256 /*chain_id*/,
            address /*_contract*/,
            uint256 topic_0,
            uint256 topic_1,
            uint256 topic_2,
            uint256 topic_3,
            bytes calldata /*data*/,
            uint256 /*block_number*/,
            uint256 /*op_code*/
        ) external vmOnly {
            
        if (topic_0 == NFT_LOCKED_TOPIC_0) {
            
            bytes memory payload = abi.encodeWithSignature(
                "mint(address,uint256)",
                    address(0),
                    topic_1
            );
            emit Callback(DESTINATION_CHAIN_ID, DESTINATION_CONTRACT, CALLBACK_GAS_LIMIT, payload);
        }
        if (topic_0 == TOKEN_LISTED_TOPIC_0) {
            
            bytes memory payload = abi.encodeWithSignature(
                "listNFT(address,address,uint256,uint256)",
                    address(0),
                    topic_1,
                    topic_2,
                    topic_3*100
            );
            emit Callback(DESTINATION_CHAIN_ID, DESTINATION_CONTRACT, CALLBACK_GAS_LIMIT, payload);
        }
        if (topic_0 == TOKEN_UNLISTED_TOPIC_0) {
            
            bytes memory payload = abi.encodeWithSignature(
                "unlistNFT(address,uint256)",
                    address(0),
                    topic_1
            );
            emit Callback(DESTINATION_CHAIN_ID, DESTINATION_CONTRACT, CALLBACK_GAS_LIMIT, payload);
        }
        }
    }
    