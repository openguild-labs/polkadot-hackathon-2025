import { Q, P } from "./constants.js";
import { Point, G } from "./point.js";
import { Aggregator } from "./aggregator.js";
import { Matrix } from "./matrix.js";
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

function pow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  if (modulus === 1n) return 0n;

  let result = 1n;
  base = base % modulus;

  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent >> 1n;
    base = (base * base) % modulus;
  }

  return result;
}

export class SingleSigner {
  private static readonly CONTEXT = Buffer.from("FROST-BIP340");

  index: number;
  threshold: number;
  participants: number;
  secret: bigint;
  coefficientCommitment: Point;
  proofOfKnowledge: [Point, bigint] | null = null;
  noncePair: [bigint, bigint] | null = null;
  nonceCommitmentPair: [Point, Point] | null = null;
  publicKey: Point;

  constructor(
    index: number,
    threshold: number,
    participants: number,
    secret: bigint,
    publicKey: Point,
  ) {
    if (
      !Number.isInteger(index) ||
      !Number.isInteger(threshold) ||
      !Number.isInteger(participants)
    ) {
      throw new Error(
        "All arguments (index, threshold, participants) must be integers.",
      );
    }

    this.index = index;
    this.threshold = threshold;
    this.participants = participants;
    this.secret = secret;
    this.coefficientCommitment = G.multiply(secret);
    this.publicKey = publicKey;
  }

  initKey(): void {
    this.ComputeProofOfKnowledge();
  }

  private ComputeProofOfKnowledge(): void {
    if (!this.secret) {
      throw new Error("Polynomial coefficient must be initialized.");
    }

    // k ⭠ ℤ_q
    let nonce = BigInt(`0x${crypto.randomBytes(32).toString("hex")}`) % Q;

    // RI = g^k
    const nonceCommitment = G.multiply(nonce);

    // i
    const indexByte = Buffer.alloc(1);
    indexByte.writeUInt8(this.index);

    // 𝚽
    const contextBytes = SingleSigner.CONTEXT;

    // g^aI_0
    const secret = this.secret;
    const secretCommitment = G.multiply(secret);
    const secretCommitmentBytes = secretCommitment.secSerialize();

    // RI
    const nonceCommitmentBytes = nonceCommitment.secSerialize();

    // cI = H(i, 𝚽, g^aI_0, RI)
    const challengeHash = crypto.createHash("sha256");
    challengeHash.update(indexByte);
    challengeHash.update(contextBytes);
    challengeHash.update(secretCommitmentBytes);
    challengeHash.update(nonceCommitmentBytes);
    const challengeHashBytes = challengeHash.digest();
    const challengeHashInt = BigInt(`0x${challengeHashBytes.toString("hex")}`);

    // μI = k + aI_0 * cI
    const s = (nonce + secret * challengeHashInt) % Q;

    // σI = (RI, μI)
    this.proofOfKnowledge = [nonceCommitment, s];
  }

  verifyProofOfKnowledge(
    proof: [Point, bigint],
    secretCommitment: Point,
    index: number,
  ): boolean {
    if (proof.length !== 2) {
      throw new Error(
        "Proof must be a tuple containing exactly two elements (nonce commitment and s).",
      );
    }

    const [nonceCommitment, s] = proof;
    if (!(nonceCommitment instanceof Point) || typeof s !== "bigint") {
      throw new Error("Proof must contain a Point and a bigint.");
    }

    const indexByte = Buffer.alloc(1);
    indexByte.writeUInt8(index);
    const contextBytes = SingleSigner.CONTEXT;
    const secretCommitmentBytes = secretCommitment.secSerialize();
    const nonceCommitmentBytes = nonceCommitment.secSerialize();

    const challengeInput = Buffer.concat([
      indexByte,
      contextBytes,
      secretCommitmentBytes,
      nonceCommitmentBytes,
    ]);

    const challengeHash = crypto
      .createHash("sha256")
      .update(challengeInput)
      .digest();
    const challengeHashInt = BigInt(`0x${challengeHash.toString("hex")}`);

    const expectedNonceCommitment = G.multiply(s).add(
      secretCommitment.multiply(Q - challengeHashInt),
    );
    return nonceCommitment.equals(expectedNonceCommitment);
  }

  _lagrangeCoefficient(
    participantIndexes: number[],
    x: bigint = 0n,
    participantIndex?: bigint,
  ): bigint {
    if (new Set(participantIndexes).size !== participantIndexes.length) {
      throw new Error("Participant indexes must be unique.");
    }

    if (participantIndex === undefined) {
      participantIndex = BigInt(this.index);
    }

    let numerator = 1n;
    let denominator = 1n;
    for (const index of participantIndexes) {
      if (BigInt(index) === participantIndex) {
        continue;
      }
      numerator = numerator * (x - BigInt(index));
      denominator = denominator * (participantIndex - BigInt(index));
    }
    return (numerator * pow(denominator, Q - 2n, Q)) % Q;
  }

  generateNoncePair(): void {
    const noncePair: [bigint, bigint] = [
      BigInt(Math.floor(Math.random() * Number(Q))),
      BigInt(Math.floor(Math.random() * Number(Q))),
    ];
    const nonceCommitmentPair: [Point, Point] = [
      G.multiply(noncePair[0]),
      G.multiply(noncePair[1]),
    ];

    this.noncePair = noncePair;
    this.nonceCommitmentPair = nonceCommitmentPair;
  }

  sign(
    message: Buffer,
    nonceCommitmentPairs: [Point, Point][],
    participantIndexes: number[],
    bip32Tweak?: bigint,
    taprootTweak?: bigint,
  ): bigint {
    if (!this.noncePair) {
      throw new Error("Nonce pair has not been initialized.");
    }
    if (!this.publicKey) {
      throw new Error("Public key has not been initialized.");
    }
    if (!this.publicKey.x || !this.publicKey.y) {
      throw new Error("Public key is the point at infinity.");
    }

    const groupCommitment = Aggregator.groupCommitment(
      message,
      nonceCommitmentPairs,
      participantIndexes,
    );

    if (groupCommitment.isInfinity()) {
      throw new Error("Group commitment is the point at infinity.");
    }

    let publicKey = this.publicKey;
    let parity = 0;
    if (bip32Tweak !== undefined && taprootTweak !== undefined) {
      [publicKey, parity] = Aggregator.tweakKey(
        bip32Tweak,
        taprootTweak,
        this.publicKey,
      );
    }

    const challengeHash = Aggregator.challengeHash(
      groupCommitment,
      publicKey,
      message,
    );

    let [firstNonce, secondNonce] = this.noncePair;

    if (groupCommitment.y! % 2n !== 0n) {
      firstNonce = Q - firstNonce;
      secondNonce = Q - secondNonce;
    }

    const bindingValue = Aggregator.bindingValue(
      this.index,
      message,
      nonceCommitmentPairs,
      participantIndexes,
    );
    const lagrangeCoefficient = this._lagrangeCoefficient(participantIndexes);
    let secret = this.secret;

    if (publicKey.y === null) {
      throw new Error("Public key is the point at infinity.");
    }
    if (publicKey.y % 2n !== BigInt(parity)) {
      secret = Q - secret;
    }

    return (
      (firstNonce +
        secondNonce * bindingValue +
        lagrangeCoefficient * secret * challengeHash) %
      Q
    );
  }

  deriveCoefficientCommitments(
    publicVerificationShares: Point[],
    participantIndexes: number[],
  ): Point[] {
    if (publicVerificationShares.length !== participantIndexes.length) {
      throw new Error(
        "The number of public verification shares must match the number of participant indexes.",
      );
    }

    const A = Matrix.createVandermonde(
      participantIndexes.map((i) => BigInt(i)),
    );
    const AInv = A.inverseMatrix();
    const Y = publicVerificationShares.map((share) => [share]);
    const coefficients = AInv.multPointMatrix(Y);

    return coefficients.map((coeff) => coeff[0]!);
  }
}