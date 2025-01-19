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

export class Participant {
  private static readonly CONTEXT = Buffer.from("FROST-BIP340");

  index: number;
  threshold: number;
  participants: number;
  coefficients: bigint[] | null = null;
  coefficientCommitments: Point[] | null = null;
  proofOfKnowledge: [Point, bigint] | null = null;
  shares: bigint[] | null = null;
  aggregateShare: bigint | null = null;
  noncePair: [bigint, bigint] | null = null;
  nonceCommitmentPair: [Point, Point] | null = null;
  publicKey: Point | null = null;
  repairShares: (bigint | null)[] | null = null;
  aggregateRepairShare: bigint | null = null;
  repairShareCommitments: (Point | null)[] | null = null;
  groupCommitments: Point[] | null = null;
  repairParticipants: number[] | null = null;

  constructor(index: number, threshold: number, participants: number) {
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
  }

  initKeygen(): void {
    this.generatePolynomial();
    this.computeProofOfKnowledge();
    this.computeCoefficientCommitments();
  }

  initRefresh(): void {
    this.generateRefreshPolynomial();
    this.computeCoefficientCommitments();
  }

  initThresholdIncrease(newThreshold: number): void {
    if (!Number.isInteger(newThreshold)) {
      throw new Error("New threshold must be an integer.");
    }
    if (newThreshold <= this.threshold) {
      throw new Error(
        "New threshold must be greater than the current threshold.",
      );
    }

    this.generateThresholdIncreasePolynomial(newThreshold);
    this.computeProofOfKnowledge();
    this.computeCoefficientCommitments();

    this.threshold = newThreshold;
  }

  private generatePolynomial(): void {
    this.coefficients = Array.from({ length: this.threshold }, (_, i) => {
      let randomValue = BigInt(`0x${crypto.randomBytes(32).toString("hex")}`);
      return randomValue % Q;
    });
  }

  private generateRefreshPolynomial(): void {
    this.coefficients = [
      0n,
      ...Array.from({ length: this.threshold - 1 }, () =>
        BigInt(Math.floor(Math.random() * Number(Q))),
      ),
    ];
  }

  private generateThresholdIncreasePolynomial(newThreshold: number): void {
    this.coefficients = Array.from({ length: newThreshold - 1 }, () =>
      BigInt(Math.floor(Math.random() * Number(Q))),
    );
  }

  private computeProofOfKnowledge(): void {
    if (!this.coefficients || this.coefficients.length === 0) {
      throw new Error("Polynomial coefficients must be initialized.");
    }

    // k ⭠ ℤ_q
    const nonce = BigInt(`0x${crypto.randomBytes(32).toString("hex")}`) % Q;

    // RI = g^k
    const nonceCommitment = G.multiply(nonce);

    // i
    const indexByte = Buffer.alloc(1);
    indexByte.writeUInt8(this.index);

    // 𝚽
    const contextBytes = Participant.CONTEXT;
    // g^aI_0
    const secret = this.coefficients[0]!;
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

  private computeCoefficientCommitments(): void {
    if (!this.coefficients) {
      throw new Error("Polynomial coefficients must be initialized.");
    }

    this.coefficientCommitments = this.coefficients.map((coefficient) =>
      G.multiply(coefficient),
    );
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
    const contextBytes = Participant.CONTEXT;
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

  generateShares(): void {
    if (!this.coefficients) {
      throw new Error(
        "Polynomial coefficients must be initialized before generating shares.",
      );
    }

    this.shares = Array.from({ length: this.participants }, (_, i) =>
      this.evaluatePolynomial(BigInt(i + 1)),
    );
  }

  generateRepairShares(repairParticipants: number[], index: number): void {
    if (this.aggregateShare === null) {
      throw new Error("Aggregate share has not been initialized.");
    }

    const lagrangeCoefficient = this._lagrangeCoefficient(
      repairParticipants,
      0n,
      BigInt(index),
    );
    const randomShares = Array.from({ length: this.threshold - 1 }, () =>
      BigInt(Math.floor(Math.random() * Number(Q))),
    );
    const finalShare =
      (lagrangeCoefficient * this.aggregateShare -
        randomShares.reduce((a, b) => a + b, 0n)) %
      Q;

    this.repairShares = [...randomShares, finalShare];
    this.repairShareCommitments = this.repairShares.map((share) =>
      share !== null ? G.multiply(share) : null,
    );
    this.repairParticipants = [...repairParticipants, this.index].sort(
      (a, b) => a - b,
    );
  }

  getRepairShare(participantIndex: number): bigint | null {
    if (!this.repairParticipants || !this.repairShares) {
      throw new Error("Repair shares have not been initialized.");
    }
    if (!this.repairParticipants.includes(participantIndex)) {
      throw new Error("Participant index does not match the initial set.");
    }

    const mappedIndex = this.repairParticipants.indexOf(participantIndex);
    return this.repairShares[mappedIndex]!;
  }

  getRepairShareCommitment(
    participantIndex: number,
    repairShareCommitments: Point[],
    repairParticipants?: number[],
  ): Point | null {
    if (!repairParticipants) {
      if (!this.repairParticipants) {
        throw new Error("Repair participants must be initialized or provided.");
      }
      repairParticipants = this.repairParticipants;
    }
    if (!repairParticipants.includes(participantIndex)) {
      throw new Error("Participant index does not match the initial set.");
    }

    const mappedIndex = repairParticipants.indexOf(participantIndex);
    return repairShareCommitments[mappedIndex]!;
  }

  verifyAggregateRepairShare(
    aggregateRepairShare: bigint,
    repairShareCommitments: Point[][],
    aggregatorIndex: number,
    repairParticipants: number[],
    groupCommitments: Point[],
  ): boolean {
    if (repairShareCommitments.length !== this.threshold) {
      throw new Error(
        "The number of repair share commitments must match the threshold.",
      );
    }
    for (let i = 0; i < repairParticipants.length; i++) {
      const dealerIndex = repairParticipants[i]!;
      const commitments = repairShareCommitments[i]!;
      const lagrangeCoefficient = this._lagrangeCoefficient(
        repairParticipants,
        BigInt(this.index),
        BigInt(dealerIndex),
      );
      const dealerPublicShare = this.derivePublicVerificationShare(
        groupCommitments,
        dealerIndex,
        this.threshold,
      );
      if (
        !dealerPublicShare
          .multiply(lagrangeCoefficient)
          .equals(
            commitments.reduce(
              (sum, commitment) => sum.add(commitment),
              new Point(),
            ),
          )
      ) {
        return false;
      }
    }

    const aggregateRepairShareCommitment = repairShareCommitments.reduce(
      (sum, commitments) =>
        sum.add(
          this.getRepairShareCommitment(
            aggregatorIndex,
            commitments,
            repairParticipants,
          ) || new Point(),
        ),
      new Point(),
    );

    return G.multiply(aggregateRepairShare).equals(
      aggregateRepairShareCommitment,
    );
  }

  verifyRepairShare(
    repairShare: bigint,
    repairShareCommitments: Point[],
    repairIndex: number,
    dealerIndex: number,
  ): boolean {
    if (!this.groupCommitments) {
      throw new Error("Group commitments must be initialized.");
    }
    if (!this.repairParticipants) {
      throw new Error("Repair participants must be initialized.");
    }
    if (
      !G.multiply(repairShare).equals(
        this.getRepairShareCommitment(this.index, repairShareCommitments) ||
        new Point(),
      )
    ) {
      return false;
    }
    if (repairShareCommitments.length !== this.threshold) {
      throw new Error(
        "The number of repair share commitments must match the threshold.",
      );
    }

    const lagrangeCoefficient = this._lagrangeCoefficient(
      this.repairParticipants,
      BigInt(repairIndex),
      BigInt(dealerIndex),
    );
    const dealerPublicShare = this.derivePublicVerificationShare(
      this.groupCommitments,
      dealerIndex,
      this.threshold,
    );
    return dealerPublicShare
      .multiply(lagrangeCoefficient)
      .equals(
        repairShareCommitments.reduce(
          (sum, commitment) => sum.add(commitment),
          new Point(),
        ),
      );
  }

  private evaluatePolynomial(x: bigint): bigint {
    if (typeof x !== "bigint") {
      throw new Error("The value of x must be a bigint.");
    }

    if (!this.coefficients || this.coefficients.length === 0) {
      throw new Error("Polynomial coefficients must be initialized.");
    }

    let y = 0n;
    for (let i = this.coefficients.length - 1; i >= 0; i--) {
      y = (y * x + this.coefficients[i]!) % Q;
    }

    return y;
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

  verifyShare(
    share: bigint,
    coefficientCommitments: Point[],
    threshold: number,
  ): boolean {
    if (coefficientCommitments.length !== threshold) {
      throw new Error(
        "The number of coefficient commitments must match the threshold.",
      );
    }

    const expectedShare = this.derivePublicVerificationShare(
      coefficientCommitments,
      this.index,
      threshold,
    );
    return G.multiply(share).equals(expectedShare);
  }

  aggregateShares(otherShares: bigint[]): void {
    if (!this.shares) {
      throw new Error("Participant's shares have not been initialized.");
    }
    if (this.index - 1 < 0 || this.index - 1 >= this.shares.length) {
      throw new Error("Participant index is out of range.");
    }
    if (otherShares.length !== this.participants - 1) {
      throw new Error(
        `Expected exactly ${this.participants - 1} other shares, received ${otherShares.length}.`,
      );
    }

    
    
    let aggregateShare = this.shares[this.index - 1]!;
    for (const otherShare of otherShares) {
      // Split the string if it's comma-separated
      const shares = otherShare.toString().split(',');
      for (const share of shares) {
        const bigIntShare = BigInt(share.trim());
        console.log(`Processing share:`, bigIntShare);
        aggregateShare = (aggregateShare + bigIntShare) % BigInt(Q);
      }
      console.log(`Aggregate after processing shares:`, aggregateShare);
    }
    
    

    if (this.aggregateShare !== null) {
      this.aggregateShare = (this.aggregateShare + aggregateShare) % Q;
    } else {
      this.aggregateShare = aggregateShare;
    }
  }

  aggregateRepairShares(otherShares: bigint[]): void {
    if (!this.repairShares) {
      throw new Error("Participant's repair shares have not been initialized.");
    }
    if (otherShares.length !== this.threshold - 1) {
      throw new Error(
        `Expected exactly ${this.threshold - 1} other shares, received ${otherShares.length}.`,
      );
    }

    let aggregateRepairShare = this.getRepairShare(this.index);
    if (aggregateRepairShare === null) {
      throw new Error("Repair share for this participant is null.");
    }

    for (const otherShare of otherShares) {
      aggregateRepairShare = (aggregateRepairShare + otherShare) % Q;
    }

    this.aggregateRepairShare = aggregateRepairShare;
  }

  repairShare(aggregateRepairShares: bigint[]): void {
    if (this.aggregateShare !== null) {
      throw new Error("Participant's share has not been lost");
    }
    if (aggregateRepairShares.length !== this.threshold) {
      throw new Error(
        `Expected exactly ${this.threshold} aggregate repair shares, received ${aggregateRepairShares.length}.`,
      );
    }

    this.aggregateShare = aggregateRepairShares.reduce(
      (a, b) => (a + b) % Q,
      0n,
    );
  }

  decrementThreshold(revealedShare: bigint, revealedShareIndex: number): void {
    if (this.aggregateShare === null) {
      throw new Error("Participant's share has not been initialized.");
    }
    if (this.groupCommitments === null) {
      throw new Error("Group commitments have not been initialized.");
    }

    const numerator = this.aggregateShare - revealedShare;
    const denominator = BigInt(this.index - revealedShareIndex);
    const quotient = (numerator * Participant.modInverse(denominator, Q)) % Q;
    this.aggregateShare =
      (revealedShare - BigInt(revealedShareIndex) * quotient) % Q;

    this.threshold -= 1;
    const publicVerificationShares: Point[] = [];
    const indexes: number[] = [];
    const FJ = G.multiply(revealedShare);
    for (let index = 1; index <= this.threshold; index++) {
      const FI = this.derivePublicVerificationShare(
        this.groupCommitments,
        index,
        this.threshold + 1,
      );
      const inverseIJ = Participant.modInverse(
        BigInt(index - revealedShareIndex),
        Q,
      );
      const FpI = FJ.subtract(
        FI.subtract(FJ).multiply(BigInt(revealedShareIndex) * inverseIJ),
      );
      publicVerificationShares.push(FpI);
      indexes.push(index);
    }
    const groupCommitments = this.deriveCoefficientCommitments(
      publicVerificationShares,
      indexes,
    );
    this.groupCommitments = groupCommitments;
  }

  increaseThreshold(otherShares: bigint[]): void {
    if (!this.shares) {
      throw new Error("Participant's shares have not been initialized.");
    }
    if (!this.aggregateShare) {
      throw new Error(
        "Participant's aggregate share has not been initialized.",
      );
    }

    const aggregateShare =
      (this.shares[this.index - 1]! + otherShares.reduce((a, b) => a + b, 0n)) %
      Q;
    this.aggregateShare =
      (this.aggregateShare + aggregateShare * BigInt(this.index)) % Q;
  }

  publicVerificationShare(): Point {
    if (this.aggregateShare === null) {
      throw new Error("Aggregate share has not been initialized.");
    }

    return G.multiply(this.aggregateShare);
  }

  derivePublicVerificationShare(
    coefficientCommitments: Point[],
    index: number,
    threshold: number,
  ): Point {
    if (coefficientCommitments.length !== threshold) {
      throw new Error(
        "The number of coefficient commitments must match the threshold.",
      );
    }

    let expectedYCommitment = new Point(); // Point at infinity
    for (let k = 0; k < coefficientCommitments.length; k++) {
      expectedYCommitment = expectedYCommitment.add(
        coefficientCommitments[k]!.multiply(BigInt(index) ** BigInt(k) % Q),
      );
    }

    return expectedYCommitment;
  }

  derivePublicKey(otherSecretCommitments: Point[]): Point {
    if (
      !this.coefficientCommitments ||
      this.coefficientCommitments.length === 0
    ) {
      throw new Error(
        "Coefficient commitments have not been initialized or are empty.",
      );
    }

    let publicKey = this.coefficientCommitments[0]!;
    for (const otherSecretCommitment of otherSecretCommitments) {
      publicKey = publicKey.add(Point.secDeserialize((otherSecretCommitment as unknown as bigint).toString(16) + "00" ));
    }
    this.publicKey = publicKey;
    return publicKey;
  }

  deriveGroupCommitments(otherCoefficientCommitments: Point[][]): void {
    if (
      !this.coefficientCommitments ||
      this.coefficientCommitments.length === 0
    ) {
      throw new Error(
        "Coefficient commitments have not been initialized or are empty.",
      );
    }

    const groupCommitments = otherCoefficientCommitments[0]!.map((_, i) =>
      otherCoefficientCommitments
        .reduce((sum, commitments) => sum.add(commitments[i]!), new Point())
        .add(this.coefficientCommitments![i]!),
    );

    if (this.groupCommitments !== null) {
      this.groupCommitments = this.groupCommitments.map((commitment, i) =>
        commitment.add(groupCommitments[i]!),
      );
    } else {
      this.groupCommitments = groupCommitments;
    }
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
      this.publicKey = G.multiply(this.noncePair[0]);
    }
    if (this.aggregateShare === null) {
      throw new Error("Aggregate share has not been initialized.");
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
    // console.log("groupCommitment", groupCommitment , firstNonce , Q , groupCommitment.y! % 2n);
    
    if (groupCommitment.y! % 2n !== 0n) {
      firstNonce = Q - firstNonce;
      secondNonce = Q - secondNonce;
    }
    // console.log("groupCommitment, groupCommitment , firstNonce , Q , groupCommitment.y! % 2n");
    
    const bindingValue = Aggregator.bindingValue(
      this.index,
      message,
      nonceCommitmentPairs,
      participantIndexes,
    );
    const lagrangeCoefficient = this._lagrangeCoefficient(participantIndexes);
    let aggregateShare = this.aggregateShare;
    
    if (publicKey.y === null) {
      throw new Error("Public key is the point at infinity.");
    }
    if (publicKey.y % 2n !== BigInt(parity)) {
      aggregateShare = Q - aggregateShare;
    }
    
    return (
      (firstNonce +
        (secondNonce) * bindingValue +
        lagrangeCoefficient * aggregateShare * challengeHash) %
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

  private static modInverse(a: bigint, m: bigint): bigint {
    let [oldR, r] = [a, m];
    let [oldS, s] = [1n, 0n];
    let [oldT, t] = [0n, 1n];

    while (r !== 0n) {
      const quotient = oldR / r;
      [oldR, r] = [r, oldR - quotient * r];
      [oldS, s] = [s, oldS - quotient * s];
      [oldT, t] = [t, oldT - quotient * t];
    }

    if (oldR > 1n) {
      throw new Error("Modular inverse does not exist");
    }

    if (oldS < 0n) {
      oldS += m;
    }

    return oldS;
  }
}