const StellarSdk = require("@stellar/stellar-sdk");

const wallet = StellarSdk.Keypair.random();

console.log({
  address: wallet.publicKey(),
  secret: wallet.secret(),
});
