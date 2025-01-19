const StellarSdk = require("@stellar/stellar-sdk");

const { PRIVATE_KEY, HORIZON_RPC_URL } = require("./config");

const wallet = StellarSdk.Keypair.fromSecret(PRIVATE_KEY);
const provider = new StellarSdk.Horizon.Server(HORIZON_RPC_URL);

async function Balance(walletAddress = wallet.publicKey()) {
  let account;
  try {
    account = await provider.loadAccount(walletAddress);
  } catch {
    return 0;
  }
  const xlm = account.balances.find(
    (balance) => balance.asset_type === "native"
  );
  if (!xlm) return "0";
  const balance = xlm.balance;
  return balance;
}

module.exports = Balance;
