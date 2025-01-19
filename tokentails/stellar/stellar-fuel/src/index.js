const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const Distribute = require("./distribute");
const DistributeBatch = require("./distribute-batch");
const Balance = require("./balance");
const { json, urlencoded } = require("express");
const bodyParser = require("body-parser");

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

app.post("/claim", async (req, res) => {
  const body = req.body;
  const addresses = body.addresses;
  const distribute = await DistributeBatch(addresses);

  return res.status(200).send({
    distribute,
  });
});

app.get("/claim/:walletAddress", async (req, res) => {
  const { walletAddress } = req.params;

  const distribute = await Distribute({ walletAddress });

  return res.status(200).send({
    distribute,
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
  return res.status(200).send({
    balance,
  });
});

app.listen(process.env.PORT || 8888, () => {
  console.log("SKALE API Distributor Listening on ", process.env.PORT || 8888);
});
