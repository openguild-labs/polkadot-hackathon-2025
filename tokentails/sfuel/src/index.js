const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { DISTRIBUTION_THRESHOLD } = require("./config");
const { isAddress } = require("ethers");
const { Distribute, initializeNonce } = require("./distribute");
const DistributeBatch = require("./distribute-batch");
const Balance = require("./balance");
const { json, urlencoded } = require("express");
const bodyParser = require("body-parser");
const { formatEther } = require("ethers");

/**
 * Initialize Express Application
 */
const app = express();

/** Express Middleware */
app.use(json());
app.use(urlencoded());
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use((req, res, next) => {
  if (req.headers["mlaccesstoken"] !== process.env.ML_ACCESS_TOKEN) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
});

app.get("/", (_, res) => {
  return res.status(200).send("API Distributor Healthy");
});

async function isClaimable(walletAddress) {
  const balance = await Balance(walletAddress);
  return Number(balance) < DISTRIBUTION_THRESHOLD;
}

function convertToTokenUnits(balance, decimals = 18) {
  return formatEther(balance);
}

app.post("/claim", async (req, res) => {
  const body = req.body;
  const addresses = body.addresses;

  if (addresses.map((address) => !isAddress(address)).includes(true))
    return res.status(400).send("Invalid Ethereum Address");
  let fundableAddresses = await Promise.all(
    addresses.map(async (address) => {
      const claimable = await isClaimable(address);
      return claimable ? address : null;
    })
  );

  // Filter out the null values, leaving only the addresses that are not claimable
  fundableAddresses = fundableAddresses.filter((address) => address !== null);

  const distribute = await DistributeBatch(fundableAddresses);

  return res.status(200).send({
    distribute,
  });
});

app.get("/claim/:address", async (req, res) => {
  const { address } = req.params;

  if (!isAddress(address))
    return res.status(400).send("Invalid Ethereum Address");

  if (!(await isClaimable(address))) {
    return res.status(200).send({
      distribute: false,
    });
  }
  await Distribute({ address });

  return res.status(200).send({
    distribute: true,
  });
});

app.get("/balance", async (_, res) => {
  return res.status(200).send({
    balance: await Balance(),
  });
});

app.get("/balance/:walletAddress", async (req, res) => {
  const { walletAddress } = req.params;
  const balance = await Balance(walletAddress);
  const tokens = convertToTokenUnits(balance);
  return res.status(200).send({
    balance,
    tokens,
  });
});

initializeNonce();

app.listen(process.env.PORT || 8888, () => {
  console.log("SKALE API Distributor Listening on ", process.env.PORT || 8888);
});
