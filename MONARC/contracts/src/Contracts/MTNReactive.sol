
    // SPDX-License-Identifier: GPL-2.0-or-later
    pragma solidity >=0.8.0;
    
    import '../../IReactive.sol';
    import '../../AbstractReactive.sol';
    import '../../ISubscriptionService.sol';
    
    contract MTNReactive is IReactive, AbstractReactive {
        
    
        uint256 private constant ORIGIN_CHAIN_ID = 11155111;
        uint256 private constant DESTINATION_CHAIN_ID = 11155111;
        address private immutable ORIGIN_CONTRACT = 0x6E920a818D8eCF03298d754A634c237Fa9BEbC60;
        address private immutable DESTINATION_CONTRACT = 0x88048DD557Da01563E72B7003505ABF4b6f53844;
    
        uint64 private constant CALLBACK_GAS_LIMIT = 1000000;
        
        //You Can Rename Your Events Topic For Better Clarity(Here and in Subscription or react function as well)
        uint256 private constant SALE_RECORDED_0_TOPIC_0 = 0xe84b578d777f088b1595c474955c41916ffd6b34833e9daf04f2ab312eea015d;
    
        constructor() {       
        bytes memory payload_0 = abi.encodeWithSignature(
            "subscribe(uint256,address,uint256,uint256,uint256,uint256)",
            ORIGIN_CHAIN_ID,
            ORIGIN_CONTRACT,
            SALE_RECORDED_0_TOPIC_0,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );
        (bool subscription_result_0,) = address(service).call(payload_0);
        vm = !subscription_result_0;
        }
    
        receive() external payable {}
    
        
    
        function react(
            uint256 /*chain_id*/,
            address /*_contract*/,
            uint256 topic_0,
            uint256 /*topic_1*/,
            uint256 topic_2,
            uint256 topic_3,
            bytes calldata /*data*/,
            uint256 /*block_number*/,
            uint256 /*op_code*/
        ) external vmOnly {
            
        if (topic_0 == SALE_RECORDED_0_TOPIC_0) {
            
            bytes memory payload = abi.encodeWithSignature(
                "royaltyInfo2(address,uint256,uint256)",
                    address(0),
                    topic_2,
                    topic_3
            );
            emit Callback(DESTINATION_CHAIN_ID, DESTINATION_CONTRACT, CALLBACK_GAS_LIMIT, payload);
        }
        }
    }
    