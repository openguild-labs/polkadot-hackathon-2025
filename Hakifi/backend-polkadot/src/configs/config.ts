import { InsuranceABI } from './abi/insurance.abi';
import { USDT_ABI } from './abi/usdt.abi';
import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: parseInt(process.env.PORT, 10) || 3000,
    path: 'api',
  },
  cors: {
    enabled: true,
    origins: ['http://localhost:3000', 'http://localhost:3001'],
  },
  swagger: {
    enabled: true,
    title: 'Hakifi BE Service',
    description: 'Hakifi BE Service API description',
    version: '1.0',
    path: 'api/docs',
  },
  jwtSecretKey: process.env.JWT_SECRET_KEY || 'hakifi',
  security: {
    expiresIn: '7d',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
  contract: {
    modPrivateKey: process.env.MOD_PRIVATE_KEY,
    commissionWallet: process.env.COMMISSION_WALLET,
    mnemonic: process.env.MNEMONIC,
    rpc_url: process.env.RPC_HTTP_URL,
    abi: InsuranceABI,
    usdtAbi: USDT_ABI,
    hakifiAddress: process.env.INSURANCE_CONTRACT_ADDRESS,
    usdtAddress: process.env.USDT_CONTRACT_ADDRESS,
  },
  redisUrl: process.env.REDIS_URL,
  binanceApiBaseUrl: process.env.BINANCE_API_BASE_URL,
};

export default (): Config => config;
