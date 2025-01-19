export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  security: SecurityConfig;
  jwtSecretKey: string;
  contract: ContractConfig;
  redisUrl: string;
  binanceApiBaseUrl: string;
}

export interface ContractConfig {
  modPrivateKey: string;
  commissionWallet: string;
  mnemonic: string;
  rpc_url: string;
  hakifiAddress: string;
  usdtAddress: string;
  abi: any;
  usdtAbi: any;
}

export interface NestConfig {
  port: number;
  path: string;
}

export interface CorsConfig {
  enabled: boolean;
  origins: string[];
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}
