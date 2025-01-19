import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  Executor,
  Executor__factory,
  OzoneWrapperToken,
  Schnorr,
} from "../typechain-types";
import {
  getBytes,
  hexlify,
  randomBytes,
  solidityPacked,
  solidityPackedKeccak256,
} from "ethers";
import secp256k1 from "secp256k1";
import { sign } from "./utils/utils";

describe("Executor", function () {
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let executor: Executor;
  let schnorrLibrary: Schnorr;
  let privKey: Uint8Array;
  let pubKey: Uint8Array;

  before(async function () {
    const SchnorrFactory = await ethers.getContractFactory("Schnorr");
    schnorrLibrary = await SchnorrFactory.deploy();
    await schnorrLibrary.waitForDeployment();
  });

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    while (true) {
      privKey = randomBytes(32);
      pubKey = secp256k1.publicKeyCreate(privKey);

      if (
        secp256k1.privateKeyVerify(privKey) &&
        secp256k1.publicKeyCreate(privKey)[0] == 2
      ) {
        break;
      }
    }

    const ExecutorFactory = (await ethers.getContractFactory("Executor", {
      libraries: {
        Schnorr: schnorrLibrary.target.toString(),
      },
    })) as Executor__factory;
    executor = await ExecutorFactory.deploy(pubKey.slice(1, 33));
    await executor.waitForDeployment();
  });

  describe("Constructor", function () {
    it("should set the correct group public key", async function () {
      expect(await executor.groupPubKey()).to.equal(
        ethers.hexlify(pubKey.slice(1, 33))
      );
    });
  });

  describe("setGroupAccount", function () {
    it("should update the group public key when called by owner", async function () {
      const newGroupPubKey = ethers.randomBytes(32);
      const mockSignature = ethers.randomBytes(64);

      await expect(executor.setGroupAccount(newGroupPubKey, mockSignature))
        .to.emit(executor, "GroupAccountUpdated")
        .withArgs(pubKey.slice(1, 33), newGroupPubKey);

      expect(await executor.groupPubKey()).to.equal(
        ethers.hexlify(newGroupPubKey)
      );
    });

    it("should revert when called with invalid signature", async function () {
      const newGroupPubKey = ethers.randomBytes(32);
      const invalidSignature = ethers.randomBytes(63); // Invalid length

      await expect(
        executor.connect(user).setGroupAccount(newGroupPubKey, invalidSignature)
      ).to.be.revertedWith("Executor : input bytes must be of length 64");
    });

    it("should revert when called by non-owner and invalid signature", async function () {
      const newGroupPubKey = ethers.randomBytes(32);
      const invalidSignature = ethers.randomBytes(64); // Invalid length

      await expect(
        executor.connect(user).setGroupAccount(newGroupPubKey, invalidSignature)
      ).to.be.revertedWith("Executor : invalid signature");
    });

    it("should be valid with valid signature", async function () {
      const newGroupPubKey = ethers.randomBytes(32);
      const Signature = sign(newGroupPubKey, privKey);

      await expect(
        executor
          .connect(user)
          .setGroupAccount(
            newGroupPubKey,
            ethers.concat([Signature.e, Signature.s])
          )
      )
        .to.emit(executor, "GroupAccountUpdated")
        .withArgs(pubKey.slice(1, 33), newGroupPubKey);

      expect(await executor.groupPubKey()).to.equal(
        ethers.hexlify(newGroupPubKey)
      );
    });
  });

  describe("createAndRegisterToken", function () {
    it("should create and register a new token", async function () {
      const name = "Test Token";
      const symbol = "TST";
      const decimals = 18;
      const tokenCount = await executor.tokenCount();

      // Mock signature verification (replace with actual Schnorr signature)
      const Signature = sign(
        getBytes(
          solidityPackedKeccak256(
            ["string", "string", "uint8", "uint256"],
            [name, symbol, decimals, tokenCount + 1n]
          )
        ),
        privKey
      );

      const NewTokenAddress = await executor
        .connect(user)
        .createAndRegisterToken.staticCall(
          name,
          symbol,
          decimals,
          ethers.concat([Signature.e, Signature.s])
        );

      const tx = await executor
        .connect(user)
        .createAndRegisterToken(
          name,
          symbol,
          decimals,
          ethers.concat([Signature.e, Signature.s])
        );
      const receipt = await tx.wait();

      expect(NewTokenAddress).to.be.properAddress;
      expect(ethers.provider.getCode(NewTokenAddress)).to.not.equal("0x");

      const TokenFactory = await ethers.getContractFactory("OzoneWrapperToken");
      let token = TokenFactory.attach(NewTokenAddress) as OzoneWrapperToken;

      expect(await token.name()).to.equal(name);
      expect(await token.symbol()).to.equal(symbol);
      expect(await token.decimals()).to.equal(decimals);
      expect(await token.executor()).to.equal(executor.target);
    });
  });

  describe("mint and lock", function () {
    it("should mint tokens with a valid signature", async function () {
      const NewTokenAddress = await executor
        .createAndRegisterToken.staticCall(
          "Test Token",
          "TST",
          18,
          randomBytes(64)
        );

      const tx = await (
        await executor
          .createAndRegisterToken("Test Token", "TST", 18, randomBytes(64))
      ).wait();

      const TokenFactory = await ethers.getContractFactory("OzoneWrapperToken");
      let token = TokenFactory.attach(NewTokenAddress) as OzoneWrapperToken;

      expect(await token.balanceOf(user.address)).to.equal(0);

      const Signature = sign(
        getBytes(
          solidityPackedKeccak256(
            ["address", "uint256", "address"],
            [token.target, ethers.parseEther("1"), user.address]
          )
        ),
        privKey
      );
      
      await (
        await executor.connect(user).mint(
          NewTokenAddress,
          ethers.parseEther("1"),
          user.address,
          ethers.concat([Signature.e, Signature.s])
        )
      ).wait();

      expect(await token.balanceOf(user.address)).to.equal(ethers.parseEther("1"));

      const orderHash = randomBytes(32);

      expect(await executor.orderRegistery(orderHash)).to.equal(
          0n
      )

      await token.connect(user).approve(executor.target, ethers.parseEther("1"));
      await executor.connect(user).lock(NewTokenAddress , orderHash , ethers.parseEther("1"));

      expect(await executor.orderRegistery(orderHash)).to.equal(
          ethers.parseEther("1")
      )
    });
  });
});
