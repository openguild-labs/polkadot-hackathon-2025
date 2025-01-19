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

describe("Test PolftRent", () => {
  let owner;
  let addr1;
  let feeRecipient;
  let addrs;
  let whitelistContract;
  let rentContract;
  let currencyContract;
  let nftMock;
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

    let rentFactory = await ethers.getContractFactory("PolftRent");
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

    for (let i = 0; i < 10; i++) {
      tx = await nftMock.safeMint(owner.address, `ipfs://${i}`);
      await tx.wait();
    }

    for (let i = 0; i < 5; i++) {
      tx = await nftMock.safeMint(addr1.address, `ipfs://${i}`);
      await tx.wait();
    }

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

  describe("Handle Lend()", () => {
    describe("Success()", () => {
      describe("Test with 1 nft", () => {
        let id;
        before(async () => {
          const encodeData = encode(
            ["address", "uint256", "uint256"],
            [nftMock.address, 0, 0]
          );
          id = keccak256(encodeData);
          lendIds = [...lendIds, id];
          tx = await nftMock.setApprovalForAll(rentContract.address, true);
          await tx.wait();
          tx = await rentContract.lend(
            [nftMock.address],
            [0],
            [1],
            [86400 * 3],
            [50],
            [500],
            [daiMock.address]
          );

          await tx.wait();
        });

        it("Check info of lendRentById", async () => {
          const data = await rentContract.lendingRenting(id);
          const lending = data[0];
          expect(lending[0]).to.be.eq(owner.address);
          expect(parseInt(lending[1])).to.be.eq(50);
          expect(parseInt(lending[2])).to.be.eq(500);
          expect(parseInt(lending[3])).to.be.eq(86400 * 3);
          expect(parseInt(lending[4])).to.be.eq(1);
        });
      });
      describe("Test with 2 nft", () => {
        let id1;
        let id2;
        before(async () => {
          let encodeData = encode(
            ["address", "uint256", "uint256"],
            [nftMock.address, 1, 1]
          );
          id1 = keccak256(encodeData);
          encodeData = encode(
            ["address", "uint256", "uint256"],
            [nftMock.address, 2, 2]
          );
          id2 = keccak256(encodeData);
          lendIds = [...lendIds, id1, id2];

          tx = await nftMock.setApprovalForAll(rentContract.address, true);
          await tx.wait();
          tx = await rentContract.lend(
            [nftMock.address, nftMock.address],
            [1, 2],
            [1, 1],
            [86400 * 3, 86400 * 3],
            [50, 50],
            [500, 500],
            [daiMock.address, daiMock.address]
          );

          await tx.wait();
        });

        it("Check info of lendRentById with first id", async () => {
          const data = await rentContract.lendingRenting(id1);
          const lending = data[0];
          expect(lending[0]).to.be.eq(owner.address);
          expect(parseInt(lending[1])).to.be.eq(50);
          expect(parseInt(lending[2])).to.be.eq(500);
          expect(parseInt(lending[3])).to.be.eq(86400 * 3);
          expect(parseInt(lending[4])).to.be.eq(1);
        });

        it("Check info of lendRentById with second id", async () => {
          const data = await rentContract.lendingRenting(id2);
          const lending = data[0];
          expect(lending[0]).to.be.eq(owner.address);
          expect(parseInt(lending[1])).to.be.eq(50);
          expect(parseInt(lending[2])).to.be.eq(500);
          expect(parseInt(lending[3])).to.be.eq(86400 * 3);
          expect(parseInt(lending[4])).to.be.eq(1);
        });
      });
    });

    // Fail cases of lending will be check more after handling rent
    describe("Fail()", () => {
      it("Fail because rent price is zero", async () => {
        tx = await nftMock.setApprovalForAll(rentContract.address, true);
        await tx.wait();
        await expect(
          rentContract.lend(
            [nftMock.address],
            [4],
            [1],
            [86400],
            [0],
            [500],
            [currencyContract.address]
          )
        ).to.be.revertedWith("PolftRent: rent price is zero");
      });

      it("Fail because rent price is zero", async () => {
        tx = await nftMock.setApprovalForAll(rentContract.address, true);
        await tx.wait();
        await expect(
          rentContract.lend(
            [nftMock.address],
            [4],
            [1],
            [86400],
            [50],
            [0],
            [currencyContract.address]
          )
        ).to.be.revertedWith("Not valid erc20 address");
      });

      it("Fail because not valid erc20 address", async () => {
        tx = await nftMock.setApprovalForAll(rentContract.address, true);
        await tx.wait();
        await expect(
          rentContract.lend(
            [nftMock.address],
            [4],
            [1],
            [86400],
            [50],
            [12],
            [currencyContract.address]
          )
        ).to.be.revertedWith("Not valid erc20 address");
      });
    });
  });

  describe("Handle Rent()", () => {
    describe("Fail()", () => {
      it("Fail because not approved", async () => {
        await expect(
          rentContract
            .connect(addr1)
            .rent([nftMock.address], [0], [0], [DAY_TIMESTAMP])
        ).to.be.reverted;
      });

      it("Fail because can not rent own nft", async () => {
        await expect(
          rentContract.rent([nftMock.address], [0], [0], [DAY_TIMESTAMP])
        ).to.be.revertedWith("PolftRent: cant rent own nft");
      });

      it("Fail because duration is zero", async () => {
        await expect(
          rentContract.connect(addr1).rent([nftMock.address], [0], [0], [0])
        ).to.be.revertedWith("PolftRent: duration is zero");
      });

      it("Fail because rent duration exceeds allowed max", async () => {
        await expect(
          rentContract
            .connect(addr1)
            .rent([nftMock.address], [0], [0], [DAY_TIMESTAMP * 4])
        ).to.be.revertedWith("PolftRent: rent duration exceeds allowed max");
      });
    });

    describe("Success()", () => {
      describe("Rent only one nft", () => {
        before(async () => {
          tx = await daiMock.connect(addr1).approve(rentContract.address, 550);
          await tx.wait();
          tx = await rentContract
            .connect(addr1)
            .rent([nftMock.address], [0], [0], [DAY_TIMESTAMP]);
          await tx.wait();
        });

        it("Check rent information", async () => {
          tx = await rentContract.lendingRenting(lendIds[0]);
          expect(tx[1][0]).to.be.eq(addr1.address);
        });
      });

      describe("Rent only two nft", () => {
        before(async () => {
          tx = await daiMock.connect(addr1).approve(rentContract.address, 1150);
          await tx.wait();
          tx = await rentContract
            .connect(addr1)
            .rent(
              [nftMock.address, nftMock.address],
              [1, 2],
              [1, 2],
              [DAY_TIMESTAMP, DAY_TIMESTAMP * 2]
            );
          await tx.wait();
        });

        it("Check rent information with first nft", async () => {
          tx = await rentContract.lendingRenting(lendIds[1]);
          expect(tx[1][0]).to.be.eq(addr1.address);
        });

        it("Check rent information with second nft", async () => {
          tx = await rentContract.lendingRenting(lendIds[2]);
          expect(tx[1][0]).to.be.eq(addr1.address);
        });
      });
    });

    describe("Fail() - Addition cases", () => {
      it("Can not rent again", async () => {
        tx = await daiMock.connect(addr1).approve(rentContract.address, 550);
        await tx.wait();
        await expect(
          rentContract
            .connect(addr1)
            .rent([nftMock.address], [0], [0], [DAY_TIMESTAMP])
        ).to.be.revertedWith("PolftRent: not a zero address");
      });
    });
  });

  describe("Handle StopRenting()", () => {
    let ownerBeforeBalance;
    let treasuryBeforeBalance;

    describe("Fail()", () => {
      it("Can not stopRenting if you are lender", async () => {
        await expect(
          rentContract.stopRenting([nftMock.address], [1], [1])
        ).to.be.revertedWith("PolftRent: not renter");
      });
    });

    describe("Success()", () => {
      before(async () => {
        tx = await rentContract.lendingRenting(lendIds[0]);
        const timestamp = parseInt(tx[1][2]);
        await time.increaseTo(timestamp + parseInt(tx[1][1]) + 1);

        tx = await nftMock.connect(addr1).approve(rentContract.address, 1);
        await tx.wait();
        ownerBeforeBalance = await daiMock.balanceOf(owner.address);
        treasuryBeforeBalance = await daiMock.balanceOf(feeRecipient.address);
        tx = await rentContract
          .connect(addr1)
          .stopRenting([nftMock.address], [1], [1]);
        await tx.wait();
      });

      it("Check lendRenting information", async () => {
        const encodeData = encode(
          ["address", "uint256", "uint256"],
          [nftMock.address, 1, 1]
        );
        id = keccak256(encodeData);
        tx = await rentContract.lendingRenting(id);
        expect(tx[1][0]).to.be.eq(ethers.constants.AddressZero);
      });

      it("Check nft is owned by lender", async () => {
        tx = await nftMock.ownerOf(1);
        expect(tx).to.be.eq(rentContract.address);
      });

      it("Compare owner after balance", async () => {
        const ownerBalance = await daiMock.balanceOf(owner.address);
        expect(parseInt(ownerBalance) - parseInt(ownerBeforeBalance)).to.be.eq(
          48
        );
      });

      it("Check treasury balance", async () => {
        const treasuryBalance = await daiMock.balanceOf(feeRecipient.address);
        expect(
          parseInt(treasuryBalance) - parseInt(treasuryBeforeBalance)
        ).to.be.eq(2);
      });
    });

    describe.skip("Fail()", () => {
      it("Can not stopRenting if you are lender", async () => {
        tx = await nftMock.connect(addr1).approve(rentContract.address, 2);
        await tx.wait();
        await expect(
          rentContract.connect(addr1).stopRenting([nftMock.address], [2], [2])
        ).to.be.revertedWith("PolftRent: not valid time to return nft");
      });
    });
  });

  // Use when renter doesn't send nft backed
  describe("Handle ClaimCollateral()", () => {
    describe("Success()", () => {
      let ownerBeforeBalance;
      let treasuryBeforeBalance;
      before(async () => {
        tx = await rentContract.lendingRenting(lendIds[0]);
        const timestamp = parseInt(tx[1][2]);
        await time.increaseTo(timestamp + parseInt(tx[1][1]) + 86401);
        ownerBeforeBalance = await daiMock.balanceOf(owner.address);
        treasuryBeforeBalance = await daiMock.balanceOf(feeRecipient.address);
        tx = await rentContract.claimCollateral([nftMock.address], [0], [0]);
        await tx.wait();
      });

      it("Check lendingRenting information", async () => {
        tx = await rentContract.lendingRenting(lendIds[0]);
        expect(tx[1][0]).to.be.eq(ethers.constants.AddressZero);
      });

      it("Compare owner after balance", async () => {
        // 50 + 500 - 2
        const ownerBalance = await daiMock.balanceOf(owner.address);
        expect(parseInt(ownerBalance) - parseInt(ownerBeforeBalance)).to.be.eq(
          548
        );
      });

      it("Check treasury balance", async () => {
        const treasuryBalance = await daiMock.balanceOf(feeRecipient.address);
        expect(
          parseInt(treasuryBalance) - parseInt(treasuryBeforeBalance)
        ).to.be.eq(2);
      });
    });

    describe("Fail()", () => {
      it("Claim when not valid timestamp", async () => {
        await expect(
          rentContract.claimCollateral([nftMock.address], [2], [2])
        ).to.be.revertedWith("PolftRent: claim date not passed");
      });

      it("Claim when not have any rent", async () => {
        await expect(
          rentContract.claimCollateral([nftMock.address], [0], [0])
        ).to.be.revertedWith("PolftRent: zero address");
      });
    });
  });

  describe("Handle StopLending()", () => {
    describe("Fail()", () => {
      it("Fail when caller is not leder", async () => {
        await expect(
          rentContract.connect(addr1).stopLending([nftMock.address], [1], [1])
        ).to.be.revertedWith("PolftRent: not lender");
      });
    });

    describe("Success()", () => {
      before(async () => {
        tx = await rentContract.stopLending([nftMock.address], [1], [1]);
        await tx.wait();
      });

      it("Nft is come to owner", async () => {
        tx = await nftMock.ownerOf(1);
        expect(tx).to.be.eq(owner.address);
      });

      it("Check lendingRenting data", async () => {
        tx = await rentContract.lendingRenting(lendIds[1]);
        expect(tx[0][0]).to.be.eq(ethers.constants.AddressZero);
      });
    });
  });
});
