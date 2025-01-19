const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

const DAY_TIMESTAMP = 86400;
const keccak256 = ethers.utils.keccak256;
const encode = ethers.utils.solidityPack;

async function currentTime() {
  const blockNum = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNum);
  const timestamp = block.timestamp;
  return timestamp;
}

describe("Test PolftRentFree", () => {
  let owner;
  let addr1;
  let feeRecipient;
  let addrs;
  let whitelistContract;
  let rentContract;
  let currencyContract;
  let nftMock;
  let nft2Mock;
  let daiMock;
  let tx;
  let lendIds = [];

  before(async () => {
    [owner, addr1, feeRecipient, ...addrs] = await ethers.getSigners();

    // DEPLOYMENTS
    let whitelistFactory = await ethers.getContractFactory("Whitelist");
    whitelistContract = await upgrades.deployProxy(whitelistFactory, [], [], {
      kind: "uups",
    });

    let rentFactory = await ethers.getContractFactory("PolftRentFree");
    rentContract = await rentFactory.deploy(whitelistContract.address);

    let currencyFactory = await ethers.getContractFactory("Currency");
    currencyContract = await upgrades.deployProxy(
      currencyFactory,
      [whitelistContract.address],
      {
        kind: "uups",
      }
    );

    let daiFactory = await ethers.getContractFactory("Dai");
    daiMock = await daiFactory.deploy();

    let nftFactory = await ethers.getContractFactory("ERC721Mock");
    nftMock = await nftFactory.deploy();

    let nft2Factory = await ethers.getContractFactory("ERC1155Mock");
    nft2Mock = await nft2Factory.deploy();

    for (let i = 0; i < 10; i++) {
      tx = await nftMock.safeMint(owner.address, `ipfs://${i}`);
      await tx.wait();
    }

    for (let i = 0; i < 5; i++) {
      tx = await nftMock.safeMint(addr1.address, `ipfs://${i}`);
      await tx.wait();
    }

    tx = await nft2Mock.mint(owner.address, 1, 5, "0x");
    await tx.wait();

    tx = await nft2Mock.mint(owner.address, 2, 5, "0x");
    await tx.wait();

    // MINT ERC20 for testing
    tx = await daiMock.connect(addr1).mint(1000000);
    await tx.wait();

    tx = await daiMock.mint(1000000);
    await tx.wait();

    // SETTING CURRENCY CONTRACT
    tx = await currencyContract.addCurrency(daiMock.address, "Using Dai ERC20");
    await tx.wait();

    tx = await rentContract.setCurrencyAddress(currencyContract.address);
    await tx.wait();

    tx = await rentContract.setTreasuryAddress(feeRecipient.address);
    await tx.wait();
  });

  describe("Test Lend", () => {
    describe("Test Lending when using nft erc721", () => {
      before(async () => {
        let encodeData = encode(
          ["address", "uint256", "uint256"],
          [nftMock.address, 1, 0] // LendingId = 0
        );
        id = keccak256(encodeData);
        lendIds = [...lendIds, id];

        encodeData = encode(
          ["address", "uint256", "uint256"],
          [nftMock.address, 2, 1] // LendingId = 1
        );
        id = keccak256(encodeData);
        lendIds = [...lendIds, id];

        tx = await nftMock.setApprovalForAll(rentContract.address, true);
        await tx.wait();

        tx = await rentContract.lend(
          [0, 0],
          [nftMock.address, nftMock.address],
          [1, 2],
          [1, 1],
          [1000, 2000],
          [DAY_TIMESTAMP, DAY_TIMESTAMP * 3],
          [daiMock.address, daiMock.address],
          [false, false]
        );

        await tx.wait();
      });

      it("Check value of lendId with nftId = 1 and lendId = 0", async () => {
        const lendData = await rentContract.getLending(nftMock.address, 1, 0);

        expect(lendData[0]).to.be.eq(0);
        expect(lendData[1]).to.be.eq(owner.address);
        expect(parseInt(lendData[2])).to.be.eq(86400);
        expect(parseInt(lendData[3])).to.be.eq(1000);
        expect(parseInt(lendData[4])).to.be.eq(1);
        expect(parseInt(lendData[5])).to.be.eq(1);
        expect(lendData[6]).to.be.eq(daiMock.address);
      });

      it("Check value of lendId with nftId = 2 and lendId = 1", async () => {
        const lendData = await rentContract.getLending(nftMock.address, 2, 1);

        expect(lendData[0]).to.be.eq(0);
        expect(lendData[1]).to.be.eq(owner.address);
        expect(parseInt(lendData[2])).to.be.eq(86400 * 3);
        expect(parseInt(lendData[3])).to.be.eq(2000);
        expect(parseInt(lendData[4])).to.be.eq(1);
        expect(parseInt(lendData[5])).to.be.eq(1);
        expect(lendData[6]).to.be.eq(daiMock.address);
      });
    });

    describe("Test Lending when using nft erc1155", () => {
      before(async () => {
        tx = await nft2Mock.setApprovalForAll(rentContract.address, true);
        await tx.wait();

        tx = await rentContract.lend(
          [1, 1],
          [nft2Mock.address, nft2Mock.address],
          [1, 2],
          [5, 5],
          [1000, 2000],
          [DAY_TIMESTAMP * 5, DAY_TIMESTAMP * 3],
          [daiMock.address, daiMock.address],
          [true, true]
        );

        await tx.wait();
      });

      it("Check value of lendId with nftId = 1 and lendId = 2", async () => {
        const lendData = await rentContract.getLending(nft2Mock.address, 1, 2);

        expect(lendData[0]).to.be.eq(1);
        expect(lendData[1]).to.be.eq(owner.address);
        expect(parseInt(lendData[2])).to.be.eq(86400 * 5);
        expect(parseInt(lendData[3])).to.be.eq(1000);
        expect(parseInt(lendData[4])).to.be.eq(5);
        expect(parseInt(lendData[5])).to.be.eq(5);
        expect(lendData[6]).to.be.eq(daiMock.address);
      });

      it("Check value of lendId with nftId = 2 and lendId = 3", async () => {
        const lendData = await rentContract.getLending(nft2Mock.address, 2, 3);

        expect(lendData[0]).to.be.eq(1);
        expect(lendData[1]).to.be.eq(owner.address);
        expect(parseInt(lendData[2])).to.be.eq(86400 * 3);
        expect(parseInt(lendData[3])).to.be.eq(2000);
        expect(parseInt(lendData[4])).to.be.eq(5);
        expect(parseInt(lendData[5])).to.be.eq(5);
        expect(lendData[6]).to.be.eq(daiMock.address);
      });
    });
  });

  describe("Stop lend", () => {
    describe("Stop Lend with erc721", () => {
      before(async () => {
        tx = await rentContract.stopLend([0], [nftMock.address], [2], [1]);

        await tx.wait();
      });

      it("Check whether nft is transferred", async () => {
        tx = await nftMock.ownerOf(2);
        expect(tx).to.be.eq(owner.address);
      });
    });

    describe("Stop Lend with erc1155", () => {
      before(async () => {
        tx = await rentContract.stopLend([1], [nft2Mock.address], [2], [3]);

        await tx.wait();
      });

      it("Check whether nft is transferred", async () => {
        tx = await nft2Mock.balanceOf(owner.address, 2);
        expect(parseInt(tx)).to.be.eq(5);
      });
    });
  });

  let rentTime;
  describe("Renting", () => {
    before(async () => {
      tx = await daiMock.connect(addr1).approve(rentContract.address, 10000);
      await tx.wait();

      tx = await rentContract
        .connect(addr1)
        .rent(
          [0, 1],
          [nftMock.address, nft2Mock.address],
          [1, 1],
          [0, 2],
          [DAY_TIMESTAMP, DAY_TIMESTAMP * 3],
          [1, 3]
        );

      await tx.wait();

      rentTime = await currentTime();
    });

    it("Check rent data of erc721 address with index = 1", async () => {
      const rentData = await rentContract.getRenting(nftMock.address, 1, 0);

      expect(rentData[0]).to.be.eq(addr1.address);
      expect(rentData[1]).to.be.eq(1);
      expect(rentData[2]).to.be.eq(DAY_TIMESTAMP);
    });

    it("Check rent data of erc1155 address with index = 1", async () => {
      const rentData = await rentContract.getRenting(nft2Mock.address, 1, 1);

      expect(rentData[0]).to.be.eq(addr1.address);
      expect(rentData[1]).to.be.eq(3);
      expect(rentData[2]).to.be.eq(DAY_TIMESTAMP * 3);
    });

    it("Check available amount of lendId with erc721 and index = 1", async () => {
      const lendData = await rentContract.getLending(nftMock.address, 1, 0);

      expect(parseInt(lendData[4])).to.be.eq(1);
      expect(parseInt(lendData[5])).to.be.eq(0);
    });

    it("Check available amount of lendId with erc721 and index = 1", async () => {
      const lendData = await rentContract.getLending(nft2Mock.address, 1, 2);

      expect(parseInt(lendData[4])).to.be.eq(5);
      expect(parseInt(lendData[5])).to.be.eq(2);
    });
  });

  describe("Stop Renting", () => {
    let renterBalanceBefore;
    before(async () => {
      renterBalanceBefore = await daiMock.balanceOf(owner.address);
      await time.increaseTo(rentTime + DAY_TIMESTAMP * 2);
      tx = await rentContract
        .connect(addr1)
        .stopRent([1], [nft2Mock.address], [1], [2], [1]);
      await tx.wait();
    });

    it("Check available amount of lendId with erc1155 and index = 1", async () => {
      const lendData = await rentContract.getLending(nft2Mock.address, 1, 2);

      expect(parseInt(lendData[4])).to.be.eq(5);
      expect(parseInt(lendData[5])).to.be.eq(5);
    });

    it("Check balance of lender", async () => {
      let renterBalanceAfter = await daiMock.balanceOf(owner.address);

      // 6000 - 5% = 6000 - 300 = 5700
      expect(
        parseInt(renterBalanceAfter) - parseInt(renterBalanceBefore)
      ).to.be.eq(5700);
    });
  });

  describe("Claim Renting", () => {
    let renterBalanceBefore;
    before(async () => {
      renterBalanceBefore = await daiMock.balanceOf(owner.address);

      tx = await rentContract.claimRent([0], [nftMock.address], [1], [0], [0]);
    });

    it("Check balance of lender", async () => {
      let renterBalanceAfter = await daiMock.balanceOf(owner.address);

      // 6000 - 5% = 6000 - 300 = 5700
      expect(
        parseInt(renterBalanceAfter) - parseInt(renterBalanceBefore)
      ).to.be.eq(950);
    });
  });
});
