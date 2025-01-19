import axios from "axios";
import { Point } from "./frost/point.js";

export const PARTICIPANT_BASE_PORT = 3001;
export const THRESHOLD = 2;
export const TOTAL_PARTICIPANTS = 3;
export const NONCE_ROUNDS = 10;

export let publicKey: Point;
export const participantNonceCommitments: Map<number, [Point, Point][]> = new Map();


export async function initializeDKG() {
  try {
    const responses = await Promise.all(
      Array.from({ length: TOTAL_PARTICIPANTS }, (_, i) =>
        axios.post(`http://localhost:${PARTICIPANT_BASE_PORT + i}/init`, {
          index: i + 1,
          threshold: THRESHOLD,
          totalParticipants: TOTAL_PARTICIPANTS,
        })
      )
    );

    const coefficientCommitments = responses.map((r) => r.data.coefficientCommitments.map((c: string) => Point.secDeserialize(c)));
    const shares = responses.map((r) => r.data.shares);

    await Promise.all(
      Array.from({ length: TOTAL_PARTICIPANTS }, (_, i) =>
        axios.post(`http://localhost:${PARTICIPANT_BASE_PORT + i}/aggregate-shares`, {
          shares: shares.filter((s, j) => j !== i), // send all shares except for self
          coefficientCommitments: coefficientCommitments.map((cc) => cc.map((c : Point) => c.secSerialize().toString('hex'))),
        })
      )
    );

    const pkResponse = await axios.get(`http://localhost:${PARTICIPANT_BASE_PORT}/public-key`);
    publicKey = Point.secDeserialize(pkResponse.data.publicKey);

    console.log('DKG initialization complete');
  } catch (error) {
    console.error('DKG initialization failed:', error);
  }
}


export async function generateNonces() {
  try {
    const responses = await Promise.all(
      Array.from({ length: TOTAL_PARTICIPANTS }, (_, i) =>
        axios.post(`http://localhost:${PARTICIPANT_BASE_PORT + i}/generate-nonces`, { rounds: NONCE_ROUNDS })
      )
    );

    responses.forEach((r, i) => {
      participantNonceCommitments.set(i + 1, r.data.nonceCommitments.map((nc: string[]) => [
        Point.secDeserialize(nc[0]),
        Point.secDeserialize(nc[1])
      ]));
    });

    console.log('Nonce generation complete');
  } catch (error) {
    console.error('Nonce generation failed:', error);
  }
}

