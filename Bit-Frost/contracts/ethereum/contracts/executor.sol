// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "./Token/Token.sol";
import "./lib/schnorr.sol";

// creates and stores registers tokens
// - set groupAccount
// - mint tokens
// - burn tokens with payload
contract Executor {
    bytes32 public groupPubKey;
    uint256 public tokenCount;
    address public owner;
    mapping(bytes32 => uint256) public orderRegistery;

    mapping(OzoneWrapperToken => bool) OzoneWrapperTokens;

    event GroupAccountUpdated(bytes32 oldGroupAccount, bytes32 newGroupAccount);

    
    event Locked(address token, bytes32 orderHash, uint256 amount);


    modifier onlyOwner(bytes32 message, bytes memory sig) {
        if (msg.sender != owner) {
            require(
                sig.length == 64,
                "Executor : input bytes must be of length 64"
            );
            bytes32 e;
            bytes32 s;
            assembly {
                // Load the concatenated bytes into memory
                let input := add(sig, 32)

                // Load the first 32 bytes into a bytes32 variable
                e := mload(input)
                s := mload(add(input, 32))
            }
            require(Schnorr.verify(27, groupPubKey, message, e, s), "Executor : invalid signature");
        }
        _;
    }



    constructor(bytes32 _groupPubKey) {
        owner = msg.sender;
        groupPubKey = _groupPubKey;
    }

    function setGroupAccount(
        bytes32 _groupPubKey,
        bytes memory sig
    ) external onlyOwner(bytes32(_groupPubKey), sig) {
        emit GroupAccountUpdated(groupPubKey, _groupPubKey);
        groupPubKey = _groupPubKey;
    }

    function createAndRegisterToken(
        string memory name,
        string memory symbol,
        uint8 decimals,
        bytes memory sig
    )
        public
        onlyOwner(
            keccak256(abi.encodePacked(name, symbol, decimals, tokenCount+1)),
            sig
        )
        returns (address)
    {
        
        OzoneWrapperToken newToken = new OzoneWrapperToken(
            name,
            symbol,
            address(this),
            decimals
        );
        OzoneWrapperTokens[newToken] = true;

        tokenCount += 1;
        return address(newToken);
    }

    function mint(
        OzoneWrapperToken token,
        uint256 amount,
        address to,
        bytes memory sig
    ) public onlyOwner(keccak256(abi.encodePacked(token, amount, to)), sig) {
        token.mint(to, amount);
    }

    function lock(address token, bytes32 orderHash, uint256 amount) public {
        require(OzoneWrapperTokens[OzoneWrapperToken(token)]);
        OzoneWrapperToken(token).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        orderRegistery[orderHash] += amount;
        
        emit Locked(token, orderHash, amount);
    }
}
