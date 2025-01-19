const { ADDRESS, PROVIDER } = require("./config");

async function Balance(walletAddress = ADDRESS) {
  const balance = await PROVIDER.getBalance(walletAddress);
  return balance.toString();
}

module.exports = Balance;
