const StellarSdk = require("@stellar/stellar-sdk");

const {
  PRIVATE_KEY,
  HORIZON_RPC_URL,
  DISTRIBUTION_VALUE,
  PASSPHRASE,
} = require("./config");

const Balance = require("./balance");

const wallet = StellarSdk.Keypair.fromSecret(PRIVATE_KEY);
const provider = new StellarSdk.Horizon.Server(HORIZON_RPC_URL);

async function Distribute({ walletAddress }) {
  const account = await provider.loadAccount(wallet.publicKey());

  const balance = await Balance(walletAddress);
  const hasEnoughAlready =
    parseFloat(balance) > parseFloat(DISTRIBUTION_VALUE) - 0.5;
  if (hasEnoughAlready) {
    return false;
  }

  const operation = balance !== "0"
    ? StellarSdk.Operation.payment({
        destination: walletAddress,
        asset: StellarSdk.Asset.native(),
        amount: DISTRIBUTION_VALUE,
      })
    : StellarSdk.Operation.createAccount({
        destination: walletAddress,
        startingBalance: DISTRIBUTION_VALUE,
      });
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();
  transaction.sign(wallet);

  try {
    let res = await provider.submitTransaction(transaction);
    console.log(`Transaction Successful! Hash: ${res.hash}`);
    return true;
  } catch (error) {
    console.log(
      `${error}. More details:\n${JSON.stringify(
        error.response.data.extras,
        null,
        2
      )}`
    );
    return false;
  }
}

module.exports = Distribute;
