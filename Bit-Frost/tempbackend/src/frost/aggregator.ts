import { Point, G } from "./point.js";
import { Q } from "./constants.js";
import * as crypto from "crypto";
// let crypto: typeof cryptoT;

// if (
//   typeof process !== "undefined" &&
//   process.versions &&
//   process.versions.node
// ) {
//   // Node.js environment detected
//   crypto = require("crypto");
// } else {
//   // Browser environment, or crypto is already available globally
//   crypto = cryptoT;
// }

function sha256(data?: string) {
  if (data !== undefined) {
    return crypto.createHash("sha256").update(data);
  }
  return crypto.createHash("sha256");
}

export class Aggregator {
  publicKey: Point;
  message: Buffer;
  nonceCommitmentPairs: [Point, Point][];
  participantIndexes: number[];
  tweakedKey: Point | null;
  tweak: bigint | null;

  constructor(
    publicKey: Point,
    message: Buffer,
    nonceCommitmentPairs: [Point, Point][],
    participantIndexes: number[],
    bip32Tweak?: bigint,
    taprootTweak?: bigint,
  ) {
    this.publicKey = publicKey;
    this.message = message;
    this.nonceCommitmentPairs = nonceCommitmentPairs;
    this.participantIndexes = participantIndexes;

    this.tweakedKey = null;
    this.tweak = null;

    if ((bip32Tweak === undefined) !== (taprootTweak === undefined)) {
      throw new Error(
        "Both bip32Tweak and taprootTweak must be provided together, or neither.",
      );
    }

    if (bip32Tweak !== undefined && taprootTweak !== undefined) {
      const [tweakedKey, tweak] = Aggregator.ComputeTweaks(
        bip32Tweak,
        taprootTweak,
        publicKey,
      );
      this.tweakedKey = tweakedKey;
      this.tweak = tweak;
    }
  }

  static tweakKey(
    bip32Tweak: bigint,
    taprootTweak: bigint,
    publicKey: Point,
  ): [Point, number] {
    const [tweakedKey, _, p] = Aggregator.ComputeTweaks(
      bip32Tweak,
      taprootTweak,
      publicKey,
    );
    return [tweakedKey, Number(p)];
  }

  static groupCommitment(
    message: Buffer,
    nonceCommitmentPairs: [Point, Point][],
    participantIndexes: number[],
  ): Point {
    let groupCommitment = new Point(null, null); // Point at infinity

    for (const index of participantIndexes) {
      if (index < 1 || index > nonceCommitmentPairs.length) {
        throw new Error(`Participant index ${index} is out of range.`);
      }

      const bindingValue = Aggregator.bindingValue(
        index,
        message,
        nonceCommitmentPairs,
        participantIndexes,
      );

      const [firstCommitment, secondCommitment] =
        nonceCommitmentPairs[index - 1]!;

      const partialCommitment = firstCommitment.add(
        secondCommitment.multiply(bindingValue),
      );
      groupCommitment = groupCommitment.add(partialCommitment);
    }

    if (groupCommitment.isInfinity()) {
      throw new Error("Resulting group commitment is the point at infinity");
    }

    return groupCommitment;
  }

  static bindingValue(
    index: number,
    message: Buffer,
    nonceCommitmentPairs: [Point, Point][],
    participantIndexes: number[],
  ): bigint {
    if (index < 1) {
      throw new Error("Participant index must start from 1.");
    }

    const bindingValue = sha256();
    const indexByte = Buffer.alloc(1);
    indexByte.writeUInt8(index);

    const nonceCommitmentPairsBytes: Buffer[] = [];
    for (const idx of participantIndexes) {
      if (idx < 1 || idx > nonceCommitmentPairs.length) {
        throw new Error(`Index ${idx} is out of range for nonce commitments.`);
      }
      const participantPair = nonceCommitmentPairs[idx - 1]!;
      const participantPairBytes = Buffer.concat(
        participantPair.map((commitment) => commitment.secSerialize()),
      );
      nonceCommitmentPairsBytes.push(participantPairBytes);
    }

    bindingValue.update(indexByte);
    bindingValue.update(message);
    bindingValue.update(Buffer.concat(nonceCommitmentPairsBytes));
    const bindingValueBytes = bindingValue.digest();

    return BigInt(`0x${bindingValueBytes.toString("hex")}`) % Q;
  }

  static challengeHash(
    nonceCommitment: Point,
    publicKey: Point,
    message: Buffer,
  ): bigint {
    const tagHash = crypto
      .createHash("sha256")
      .update("BIP0340/challenge")
      .digest();
    const challengeHash = crypto
      .createHash("sha256")
      .update(tagHash)
      .update(tagHash)
      .update(nonceCommitment.xonlySerialize())
      .update(publicKey.xonlySerialize())
      .update(message)
      .digest();

    return BigInt(`0x${challengeHash.toString("hex")}`) % Q;
  }

  signingInputs(): [Buffer, [Point, Point][]] {
    return [this.message, this.nonceCommitmentPairs];
  }

  signature(signatureShares: bigint[]): Buffer {
    const groupCommitment = Aggregator.groupCommitment(
      this.message,
      this.nonceCommitmentPairs,
      this.participantIndexes,
    );

    let z = signatureShares.reduce((sum, share) => (sum + share) % Q, 0n);
    if (z < 0n) {
      z = (z + Q) % Q;
    }

    if (this.tweak !== null && this.tweakedKey !== null) {
      const challengeHash = Aggregator.challengeHash(
        groupCommitment,
        this.tweakedKey,
        this.message,
      );
      z = (z + challengeHash * this.tweak) % Q;
    }

    const nonceCommitmentBuffer = groupCommitment.xonlySerialize();
    const zBuffer = Buffer.alloc(32);
    const zHex = z.toString(16).padStart(64, "0");
    zBuffer.write(zHex, 0, "hex");

    return Buffer.concat([nonceCommitmentBuffer, zBuffer]);
  }

  private static ComputeTweaks(
    bip32Tweak: bigint,
    taprootTweak: bigint,
    publicKey: Point,
  ): [Point, bigint, number] {
    const bip32Key = publicKey.add(G.multiply(bip32Tweak));
    if (bip32Key.y === null) {
      throw new Error("Invalid public key.");
    }
    const isBip32KeyOdd = bip32Key.y % 2n !== 0n;
    const adjustedBip32Key = isBip32KeyOdd ? bip32Key.negate() : bip32Key;
    const bip32Parity = isBip32KeyOdd ? 1 : 0;
    const adjustedBip32Tweak = isBip32KeyOdd ? -bip32Tweak : bip32Tweak;

    const aggregateKey = adjustedBip32Key.add(G.multiply(taprootTweak));
    if (aggregateKey.y === null) {
      throw new Error("Invalid public key.");
    }
    const aggregateTweak = (adjustedBip32Tweak + taprootTweak) % Q;
    const adjustedAggregateTweak =
      aggregateKey.y % 2n !== 0n ? (-aggregateTweak + Q) % Q : aggregateTweak;

    return [aggregateKey, adjustedAggregateTweak, bip32Parity];
  }
}