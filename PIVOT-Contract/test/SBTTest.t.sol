pragma solidity ^0.8.20;
import "forge-std/console.sol";
import "forge-std/Test.sol";
import "../src/TopicSBT.sol";

contract SBTTest is Test {
    TopicSBT private sbt;

    uint256 private ownerPrivateKey;
    uint256 private spenderPrivateKey;

    address private owner;
    address private spender;

    function setUp() public {

        ownerPrivateKey = 0xA11CE;
        spenderPrivateKey = 0xB0B;

        owner = vm.addr(ownerPrivateKey);
        spender = vm.addr(spenderPrivateKey);
        
        sbt = new TopicSBT(owner, "sbt", "SBT");
        
    }

    function test_mint() public {
        uint256 topicId = 1;
        uint256 position = 1;
        uint256 investment = 100;
        vm.prank(owner);
        sbt.mint(spender, topicId, position, investment);

        assertEq(sbt.ownerOf(1), spender);
        assertEq(sbt.balanceOf(spender), 1);
        assertEq(sbt.topicId(1), topicId);
        assertEq(sbt.position(topicId), position);
        assertEq(sbt.investmentAmount(topicId), investment);
    }



}
