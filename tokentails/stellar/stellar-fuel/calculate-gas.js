require("dotenv").config();

function computeInstructionFee(instructions) {
  const FEE_RATE = 6250;
  const DIVISOR = 10000;
  const instructionsNum = Number(instructions);
  const fee = (instructionsNum * FEE_RATE) / DIVISOR;
  return Math.ceil(fee);
}

function computeReadEntriesFee(numberOfReadsandWriteEntries) {
  const FEE_RATE = 6250;
  const numberOfReadsandWriteEntriesNum = Number(numberOfReadsandWriteEntries);
  const fee = numberOfReadsandWriteEntriesNum * FEE_RATE;
  return fee;
}

function computeWriteEntriesFee(numberOfWriteEntries) {
  const FEE_RATE = 10000;
  const numberOfWriteEntriesNum = Number(numberOfWriteEntries);
  const fee = numberOfWriteEntriesNum * FEE_RATE;
  return fee;
}

// console.log(computeReadEntriesFee(5)); // Output: 31250
// console.log(computeWriteEntriesFee(5)); // Output: 50000

function computeReadBytesFee(bytesRead) {
  const FEE_RATE = 1786;
  const DIVISOR = 1024;
  const bytesReadNum = Number(bytesRead);
  const fee = (bytesReadNum * FEE_RATE) / DIVISOR;
  return Math.ceil(fee);
}

function computeWriteBytesFee(instructions) {
  // Approx 11800 STROOPs, refer this for more information
  // https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering#dynamic-pricing-for-storage
  const FEE_RATE = 11800;
  const DIVISOR = 1024;
  const instructionsNum = Number(instructions);
  const fee = (instructionsNum * FEE_RATE) / DIVISOR;
  return Math.ceil(fee);
}

// console.log(computeReadBytesFee(51200));  // Output: 8721
// console.log(computeWriteBytesFee(10240));  // Output: 57618

function computeHistoricalFee(sizeOfTheTxEnvelopeInBytes) {
  const FEE_RATE = 16235;
  const DIVISOR = 1024;
  const baseSizeOfTheTxnResultInBytes = 300;
  const effectiveTxnSize =
    Number(sizeOfTheTxEnvelopeInBytes) + Number(baseSizeOfTheTxnResultInBytes);
  const fee = (effectiveTxnSize * FEE_RATE) / DIVISOR;
  return Math.ceil(fee);
}

function computeBandwidthFee(sizeOfTheTxEnvelopeInBytes) {
  const FEE_RATE = 1624;
  const DIVISOR = 1024;
  const effectiveTxnSize = Number(sizeOfTheTxEnvelopeInBytes);
  const fee = (effectiveTxnSize * FEE_RATE) / DIVISOR;
  return Math.ceil(fee);
}

// console.log(computeHistoricalFee(10240));  // Output: 167107
// console.log(computeBandwidthFee(10240));  // Output: 16240

function computeEventsOrReturnValueFee(sizeOfTheEventsOrReturnValueInBytes) {
  const FEE_RATE = 10000;
  const DIVISOR = 1024;
  const sizeOfTheEventsOrReturnValueInBytesNum = Number(
    sizeOfTheEventsOrReturnValueInBytes
  );
  const fee = (sizeOfTheEventsOrReturnValueInBytesNum * FEE_RATE) / DIVISOR;
  return Math.ceil(fee);
}

// console.log(computeEventsOrReturnValueFee(10240)); // Output: 100000

class LedgerEntryRentChange {
  constructor(
    isPersistent,
    oldSizeBytes,
    newSizeBytes,
    oldLiveUntilLedger,
    newLiveUntilLedger
  ) {
    // Whether this is persistent or temporary entry.
    this.isPersistent = isPersistent;

    // Size of the entry in bytes before it has been modified, including the key.
    // 0 for newly-created entries.
    this.oldSizeBytes = oldSizeBytes;

    // Size of the entry in bytes after it has been modified, including the key.
    this.newSizeBytes = newSizeBytes;

    // Live until ledger of the entry before it has been modified.
    // Should be less than the current ledger for newly-created entries.
    this.oldLiveUntilLedger = oldLiveUntilLedger;

    // Live until ledger of the entry after it has been modified.
    this.newLiveUntilLedger = newLiveUntilLedger;
  }

  entryIsNew() {
    return this.oldSizeBytes === 0 && this.oldLiveUntilLedger === 0;
  }

  extensionLedgers(currentLedger) {
    const ledgerBeforeExtension = this.entryIsNew()
      ? Math.max(currentLedger - 1, 0)
      : this.oldLiveUntilLedger;
    return exclusiveLedgerDiff(ledgerBeforeExtension, this.newLiveUntilLedger);
  }

  prepaidLedgers(currentLedger) {
    if (this.entryIsNew()) {
      return null;
    } else {
      return inclusiveLedgerDiff(currentLedger, this.oldLiveUntilLedger);
    }
  }

  sizeIncrease() {
    const increase = this.newSizeBytes - this.oldSizeBytes;
    return increase > 0 ? increase : null;
  }
}

class RentFeeConfiguration {
  constructor(
    feePerWrite1kb = 0,
    feePerWriteEntry = 0,
    persistentRentRateDenominator = 0,
    temporaryRentRateDenominator = 0
  ) {
    // Fee per 1KB written to ledger.
    this.feePerWrite1kb = feePerWrite1kb;

    // Fee per 1 entry written to ledger.
    this.feePerWriteEntry = feePerWriteEntry;

    // Denominator for the total rent fee for persistent storage.
    this.persistentRentRateDenominator = persistentRentRateDenominator;

    // Denominator for the total rent fee for temporary storage
    this.temporaryRentRateDenominator = temporaryRentRateDenominator;
  }
}

const TTL_ENTRY_SIZE = 48;
const DATA_SIZE_1KB_INCREMENT = 1024;

/**
 * Calculate the rent fee for a given size and number of ledgers
 * @param {boolean} isPersistent - Whether the ledger entry is persistent
 * @param {number} entrySize - Size of the entry in bytes
 * @param {number} rentLedgers - Number of ledgers to rent for
 * @returns {bigint} Calculated rent fee
 */
function rentFeeForSizeAndLedgers(isPersistent, entrySize, rentLedgers) {
  // Use BigInt for all calculations to avoid overflow
  const num = BigInt(entrySize) * BigInt(11800) * BigInt(rentLedgers);

  const storageCoef = isPersistent ? BigInt(2103) : BigInt(4206);

  const DIVISOR = BigInt(1024) * storageCoef;

  const fee = ceilN(num, DIVISOR);

  return fee;
}

/**
 * Calculate the size of a half-open range (lo, hi], or null if lo > hi
 * @param {number} lo - Lower bound (exclusive)
 * @param {number} hi - Upper bound (inclusive)
 * @returns {number|null} Size of the range, or null if invalid
 */
function exclusiveLedgerDiff(lo, hi) {
  const diff = hi - lo;
  return diff > 0 ? diff : null;
}

/**
 * Calculate the size of a closed range [lo, hi], or null if lo > hi
 * @param {number} lo - Lower bound (inclusive)
 * @param {number} hi - Upper bound (inclusive)
 * @returns {number|null} Size of the range, or null if invalid
 */
function inclusiveLedgerDiff(lo, hi) {
  const diff = exclusiveLedgerDiff(lo, hi);
  return diff !== null ? diff + 1 : null;
}

const ceilN = (n, d) => n / d + (n % d ? 1n : 0n);

/**
 * Calculate the rent fee for a single entry change
 * @param {LedgerEntryRentChange} entryChange - The entry change
 * @param {number} currentLedger - Current ledger sequence
 * @returns {bigint} Calculated rent fee
 */
function rentFeePerEntryChange(entryChange, currentLedger) {
  let fee = 0n;

  // If there was a difference-in-expiration, pay for the new ledger range
  // at the new size.
  const rentLedgers = entryChange.extensionLedgers(currentLedger);
  if (rentLedgers !== null) {
    fee += rentFeeForSizeAndLedgers(
      entryChange.isPersistent,
      entryChange.newSizeBytes,
      rentLedgers
    );
  }

  // If there were some ledgers already paid for at an old size, and the size
  // of the entry increased, those pre-paid ledgers need to pay top-up fees to
  // account for the change in size.
  const prepaidLedgers = entryChange.prepaidLedgers(currentLedger);
  const sizeIncrease = entryChange.sizeIncrease();

  if (prepaidLedgers !== null && sizeIncrease !== null) {
    fee += rentFeeForSizeAndLedgers(
      entryChange.isPersistent,
      sizeIncrease,
      prepaidLedgers
    );
  }

  return fee;
}

function computeRentFee(changedEntries, currentLedgerSeq) {
  let fee = 0n;
  let extendedEntries = 0n;
  let extendedEntryKeySizeBytes = 0;

  for (const e of changedEntries) {
    fee += rentFeePerEntryChange(e, currentLedgerSeq);
    if (e.oldLiveUntilLedger < e.newLiveUntilLedger) {
      extendedEntries += 1n;
      extendedEntryKeySizeBytes += TTL_ENTRY_SIZE;
    }
  }

  fee += BigInt(10000) * extendedEntries;
  //(Math.ceil((extendedEntryKeySizeBytes * 11800 ) / 1024))
  fee =
    fee +
    ceilN(BigInt(extendedEntryKeySizeBytes) * BigInt(11800), BigInt(1024));
  return fee;
}

const feeConfig = new RentFeeConfiguration(
  11800, // feePerWrite1kb (Approx 11,800 STROOPs per 1KB written)
  10000, // feePerWriteEntry (10,000 STROOPs per entry written)
  2103, // persistentRentRateDenominator
  4206 // temporaryRentRateDenominator
);

// Create an array of LedgerEntryRentChange instances
const changedEntries = [
  // A new persistent entry
  new LedgerEntryRentChange(
    true, // isPersistent
    0, // oldSizeBytes (0 for new entries)
    100, // newSizeBytes
    0, // oldLiveUntilLedger (0 for new entries)
    1000 // newLiveUntilLedger
  ),
  // An existing persistent entry with increased size and extended TTL
  new LedgerEntryRentChange(
    true, // isPersistent
    50, // oldSizeBytes
    150, // newSizeBytes
    500, // oldLiveUntilLedger
    1500 // newLiveUntilLedger
  ),
  // A temporary entry with extended TTL but no size change
  new LedgerEntryRentChange(
    false, // isPersistent (temporary)
    200, // oldSizeBytes
    200, // newSizeBytes (no change)
    800, // oldLiveUntilLedger
    1200 // newLiveUntilLedger
  ),
];

// Set the current ledger sequence
const currentLedgerSeq = 400;
// Calculate the rent fee
const totalRentFee = computeRentFee(changedEntries, currentLedgerSeq);
console.log(`Total Rent Fee: ${totalRentFee} STROOPs`);

const StellarSdk = require("@stellar/stellar-sdk");
const server = new StellarSdk.SorobanRpc.Server(process.env.SOROBAN_RPC_URL);

async function getFeeStats() {
  try {
    const feeStats = await server.getFeeStats();
    console.log("Fee Stats:", JSON.stringify(feeStats, null, 2));
    return feeStats.sorobanInclusionFee;
  } catch (error) {
    console.error("Error fetching fee stats:", error);
  }
}

// Usage
getFeeStats().then((inclusionFees) => {
  if (inclusionFees) {
    console.log("Current Soroban Inclusion Fees:", inclusionFees);
    console.log("Recommended fee (90th percentile):", inclusionFees.p90);
  }
});

computeEventsOrReturnValueFee(100)