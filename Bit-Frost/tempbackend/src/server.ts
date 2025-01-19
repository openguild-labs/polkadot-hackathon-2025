import express from "express";
import { createConnection, Connection } from "typeorm";
import { Order } from "./entity/Order.js";
import crypto from "crypto";
import {
  validateEthereumAddress,
} from "./utils/ethereumUtils.js";
import {
  validateBitcoinAddress,
  generateTaprootAddress,
} from "./utils/bitcoinUtils.js";
import { vaultAddress } from "./contants.js";
import cors from 'cors';
import fs from 'fs';
import path from 'path';


// server setup with cors
const app = express();
app.use(express.json());
app.use(cors());

let connection: Connection;

// Database connection
createConnection({
  type: "sqlite",
  database: "orders.sqlite",
  entities: [Order],
  synchronize: true,
})
  .then((conn) => {
    connection = conn;
    console.log("Connected to database");
  })
  .catch((error) => console.log(error));

let isInMaintenance = false;

// health
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// get is backend active
app.get("/active", (req, res) => {
  res.status(200).json({ active: !isInMaintenance });
});

// switch  maintenance mode
app.get("/switch-maintenance", (req, res) => {
  isInMaintenance = !isInMaintenance;
  res.status(200).json({ status: "ok" });
});

// Create Order route
app.post("/order", async (req, res) => {
  let {
    fromAddress,
    toAddress,
    fromChain,
    toChain,
    fromAsset,
    toAsset,
    amount,
  } = req.body;

  console.log("Request Received: ✅ \n", req.body);

  if (!Number.isInteger(amount)) {
    return res.status(400).json({ error: "Amount must be an integer" });
  }

  // let btcaddr = fromAddress;
  // let ethaddr = toAddress;

  if (toChain.startsWith("evm")) {
    if (!validateEthereumAddress(toAddress)) {
      return res.status(400).json({ error: "Invalid Ethereum address" });
    }
  } else {
    if (!validateBitcoinAddress(toAddress)) {
      return res.status(400).json({ error: "Invalid Bitcoin address" });
    }
  }

  // // Validate addresses
  // if (!validateEthereumAddress(ethaddr) || !validateBitcoinAddress(btcaddr)) {
  //   return res.status(400).json({ error: "Invalid address" });
  // }

  req.body.time = Date.now();
  // Compute order hash
  const orderHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(req.body))
    .digest("hex");

  // Generate Taproot address
  const { address: taprootAddress, privateKey } = generateTaprootAddress();

  // Create and save order
  const orderRepository = connection.getRepository(Order);
  const order = new Order();
  order.fromAddress = fromAddress;
  order.toAddress = toAddress;
  order.fromChain = fromChain;
  order.toChain = toChain;
  order.fromAsset = fromAsset;
  order.toAsset = toAsset;
  order.amount = amount;
  order.orderHash = orderHash;
  order.status = "created";

  if (fromChain.startsWith("evm")) {
    const chain = fromChain.slice(4);
    order.vaultAddress = vaultAddress(chain);
  } else {
    order.vaultAddress = taprootAddress;
    order.vaultPrivKey = privateKey;
  }

  await orderRepository.save(order);

  res.json({ orderId: order.id, vaultAddress: order.vaultAddress, orderHash });
});

// Get Order route
app.get("/order/:orderId", async (req, res) => {
  try {
    const orderRepository = connection.getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id: parseInt(req.params.orderId) },
    });



    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const { vaultPrivKey, ...newOrder } = order;

    res.json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Point } from "./frost/point.js";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// /logs return what ever is inside ./server-logs.txt
app.get("/s-logs", async (req, res) => {
    fs.readFile(path.join(__dirname, '../server-logs.txt') , (err, data) => {
        if (err) {
            console.error('Error reading server logs:', err);
            res.status(500).send('Error reading server logs');
        } else {
          res.set('Content-Type', 'text/plain');
          res.send(data);
      }
    });
});

app.get("/w-logs", async (req, res) => {
    fs.readFile(path.join(__dirname, '../watcher-logs.txt'), (err, data) => {
        if (err) {
            console.error('Error reading watcher logs:', err);
            res.status(500).send('Error reading watcher logs');
        } else {
          res.set('Content-Type', 'text/plain');
          res.send(data);
      }
    })
});


import * as seal from 'node-seal';


const PORT = 8008;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


