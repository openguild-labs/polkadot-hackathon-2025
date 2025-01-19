const { DISTRIBUTION_VALUE, WALLET } = require("./config");

async function initializeNonce() {
  await WALLET.getNonce("pending");
}

async function Distribute({ address }) {
  const tx = await WALLET.sendTransaction({
    to: address,
    value: DISTRIBUTION_VALUE,
  });
  await tx.wait();
}

module.exports = { Distribute, initializeNonce };
