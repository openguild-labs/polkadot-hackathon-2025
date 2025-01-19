import express from 'express';
import cors from 'cors';
import codeGenerationRouter from './routes/codeGeneration';
import polkadotRouter from './routes/polkadot';
import { config } from 'dotenv';
config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Replace with your frontend URL
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/generate', codeGenerationRouter);
app.use('/api/polkadot', polkadotRouter);

app.listen(8000, () => {
  console.log('Server running on port 8000');
});