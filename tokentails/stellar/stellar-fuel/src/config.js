const StellarSdk = require("@stellar/stellar-sdk");
require("dotenv").config();

const DISTRIBUTION_VALUE = "2";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SOROBAN_RPC_URL = process.env.SOROBAN_RPC_URL;
const HORIZON_RPC_URL = process.env.HORIZON_RPC_URL;
const PASSPHRASE = process.env.IS_PROD
  ? StellarSdk.Networks.PUBLIC
  : StellarSdk.Networks.TESTNET;

if (!PRIVATE_KEY) throw new Error("Missing Private Key");
if (!SOROBAN_RPC_URL) throw new Error("Missing SOROBAN RPC URL");
if (!HORIZON_RPC_URL) throw new Error("Missing HORIZON RPC URL");

module.exports = {
  DISTRIBUTION_VALUE,
  PRIVATE_KEY,
  SOROBAN_RPC_URL,
  HORIZON_RPC_URL,
  PASSPHRASE,
  BATCH_SIZE: 100,
};
