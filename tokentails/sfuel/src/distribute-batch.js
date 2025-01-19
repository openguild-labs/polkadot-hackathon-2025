const { BATCH_SIZE } = require("./config");
const { Distribute } = require("./distribute");

async function DistributeBatch(addresses) {
  const batchedAddresses = [];
  for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
    batchedAddresses.push(addresses.slice(i, i + BATCH_SIZE));
  }

  for (const batch of batchedAddresses) {
    await Promise.all(batch.map((address) => Distribute({ address })));
    // Optionally add a delay between batches to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
  }
  return true;
}

module.exports = DistributeBatch;
