pragma solidity ^0.8.20;
import "forge-std/console.sol";
import "forge-std/Test.sol";
import "../src/TopicSBT.sol";
import "../src/PivotTopic.sol";
import "../src/TopicERC20.sol";

contract PivotTopicTest is Test {
    TopicSBT private sbt;
    PivotTopic private pivotTopic;
    TopicERC20 private erc20;

    uint256 private ownerPrivateKey;
    uint256 private investorPrivateKey;

    address private owner;
    address private investor;

    function setUp() public {

        ownerPrivateKey = 0xA11CE;
        investorPrivateKey = 0xB0B;

        owner = vm.addr(ownerPrivateKey);
        investor = vm.addr(investorPrivateKey);
        
        sbt = new TopicSBT(owner, "sbt", "SBT");

        erc20 = new TopicERC20("erc20", "ERC20", 100000000);
    
        pivotTopic = new PivotTopic(address(sbt));
        pivotTopic.setERC20Contract(address(erc20));
        erc20.transfer(owner, 1000);
        erc20.transfer(investor, 1000);
        erc20.transfer(msg.sender, 1000);
        vm.prank(owner);
        sbt.transferOwnership(address(pivotTopic));
    }

    function test_mintSBT() public {

        uint256 topicId = 1;
        uint256 position = 1;
        uint256 investment = 100;

        vm.prank(address(pivotTopic));
        sbt.mint(owner,topicId,position,investment);

        assertEq(sbt.ownerOf(1), owner);
        assertEq(sbt.balanceOf(owner), 1);
        assertEq(sbt.topicId(1), topicId);
        assertEq(sbt.position(topicId), position);
        assertEq(sbt.investmentAmount(topicId), investment);
    }

    function test_ERC20Balance() public {
        assertEq(erc20.balanceOf(msg.sender), 1000);
        assertEq(erc20.balanceOf(owner), 1000);
        assertEq(erc20.balanceOf(investor), 1000);
        assertEq(erc20.balanceOf(address(this)), 100000000 - 3000);
    }


    function test_createTopic() public {

        address msgSender = msg.sender;
        vm.prank(msgSender);
        erc20.approve(address(pivotTopic),500);

        vm.prank(msgSender);
        pivotTopic.createTopic(500);
        assertEq(erc20.balanceOf(address(pivotTopic)), 500);
    }

    function test_invest() public {
        address msgSender = msg.sender;
        vm.prank(msgSender);
        erc20.approve(address(pivotTopic),500);

        vm.prank(msgSender);
        pivotTopic.createTopic(500);

        vm.prank(owner);
        erc20.approve(address(pivotTopic), 500);
        vm.prank(owner);
        pivotTopic.invest(1, 500);
    }
}