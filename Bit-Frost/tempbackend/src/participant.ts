import express from 'express';
import { Participant } from './frost/participant.js';
import { Point } from './frost/point.js';
import { time } from 'console';


const app = express();
app.use(express.json());

const participantId = parseInt(process.argv[2], 10);
if (isNaN(participantId)) {
  console.error('Please provide a valid participant ID');
  process.exit(1);
}

const PORT = 3000 + participantId;
let participant: Participant;

app.post('/init', (req, res) => {

  const { index, threshold, totalParticipants } = req.body;
  participant = new Participant(index, threshold, totalParticipants);
  participant.initKeygen();
  participant.generateShares();

  res.json({
    coefficientCommitments: participant.coefficientCommitments!.map(c => c.secSerialize().toString('hex')),
    shares: participant.shares ? participant.shares.map(share => share.toString()) : null,
  });
  console.log(`Participant ${index} initialized`);

});

app.post('/aggregate-shares', (req, res) => {
  const { shares, coefficientCommitments } = req.body;
  participant.aggregateShares(shares);
  participant.derivePublicKey(coefficientCommitments.map((c: string) => Point.secDeserialize(c).x));
  participant.deriveGroupCommitments(coefficientCommitments.map((cc: string[]) => cc.map((c: string) => Point.secDeserialize(c))));

  res.json({ message: 'Shares aggregated' });
});

app.get('/public-key', (req, res) => {
  res.json({ publicKey: participant.publicKey!.secSerialize().toString('hex') });
});

app.post('/generate-nonces', (req, res) => {
  const { rounds } = req.body;
  const nonceCommitments = [];
  for (let i = 0; i < rounds; i++) {
    participant.generateNoncePair();
    nonceCommitments.push(participant.nonceCommitmentPair!.map(p => p.secSerialize().toString('hex')));
  }
  res.json({ nonceCommitments });
});

app.post('/sign', async (req, res) => {
  const signature = await runInTEE(async () => {
    const { message, nonceCommitmentPairs, participantIndexes } = req.body;
    const signature = participant.sign(
      message.data.toString('hex'),
      nonceCommitmentPairs.map((pair: string[]) => pair.map((p: string) => Point.secDeserialize(p))),
      participantIndexes
    );
    return signature;
  });

  res.json({ signature: signature.toString(16) });

  console.log(`Participant ${participantId} signed message ${Date.now()}`);
});


let publicKey: string;
let privateKey: string;
import crypto from 'crypto';
import { generateTEEEvidence } from './Tee/teeEvidence.js';
import { runInTEE } from './Tee/TeeExecution.js';

function initializeKeys() {
  const { publicKey: pubKey, privateKey: privKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  publicKey = pubKey;
  privateKey = privKey;


  // Register with the coordinator
  registerWithCoordinator();
}


async function registerWithCoordinator() {
  const teeEvidence = await generateTEEEvidence();

  const response = await fetch('http://localhost:8008/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      participantId,
      publicKey,
      teeEvidence
    })
  });

  if (!response.ok) {
    throw new Error('Failed to register with coordinator');
  }

  console.log('Successfully registered with coordinator');
}



app.listen(PORT, () => {
  console.log(`Participant ${participantId} running on http://localhost:${PORT}`);
});