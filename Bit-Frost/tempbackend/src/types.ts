import { Point } from "./frost/point.js";

export interface Share {
  index: number;
  value: bigint;
}

export interface CoefficientCommitment {
  index: number;
  commitment: Point;
}

export interface NonceCommitmentPair {
  commitment: Point;
  nonce: bigint;
}

export interface SignatureShare {
  index: number;
  share: bigint;
}

export interface ParticipantInfo {
  id: number;
  port: number;
}