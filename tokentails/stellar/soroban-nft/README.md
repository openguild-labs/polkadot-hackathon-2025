# Soroban Project

## Project Structure

This repository uses the recommended structure for a Soroban project:
```text
.
├── contracts
│   └── cat
│   |   ├── src
│   |   │   ├── lib.rs -> smart contract file
│   |   │   └── test.rs -> tests file
│   |   └── Cargo.toml -> contract configuration file 
│   └── test_snapshots -> tests results file
│   └── blessing
│   |   ├── src
│   |   │   ├── lib.rs -> smart contract file
│   |   │   └── test.rs -> tests file
│   |   └── Cargo.toml -> contract configuration file 
│   └── test_snapshots -> tests results file
├── Cargo.toml -> project configuration file
└── README.md -> this file
```

#### contracts TESTNET:
- ##### TokenTailsCat NFT: `CBHOJOPZ5BCWQ63RLMTCG73I3MM6E2N5UNZ2AE3ZVYY4MMFFAGUI6QVF`
- ##### TokenTailsBlessing NFT: `CBHOJOPZ5BCWQ63RLMTCG73I3MM6E2N5UNZ2AE3ZVYY4MMFFAGUI6QVF`

#### contracts MAINNET:
- ##### TokenTailsCat NFT: `CBHOJOPZ5BCWQ63RLMTCG73I3MM6E2N5UNZ2AE3ZVYY4MMFFAGUI6QVF`
- ##### TokenTailsBlessing NFT: `CDY53U64IBGRTIABOQDS3ZXAIYP3S3VY42TKOX2G65E2UVBF3YLS7NJ6`
- Owner public key: GAVYPYRZFSSNWLOXURWWPB5T6PVPNTBL7BCEQXZP5VMVDSMUP7XF5TAN
- explorer: https://stellar.expert/explorer

### Run tests

`cargo test`

### Build contracts

`stellar contract build`

### Add testnet network

```
stellar network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

### Add Gateway testnet network

```
stellar network add \
  --global testnet2 \
  --rpc-url https://soroban-rpc.testnet.stellar.gateway.fm \
  --network-passphrase "Test SDF Network ; September 2015"
```

### Add mainnet network

```
stellar network add \
  --global mainnet \
  --rpc-url https://soroban-rpc.mainnet.stellar.gateway.fm \
  --network-passphrase "Public Global Stellar Network ; September 2015"
```

### Networks

- official testnet `https://soroban-testnet.stellar.org`
Liquify provider
- public testnet `https://stellar.liquify.com/api=41EEWAH79Y5OCGI7/testnet`
- public mainnet `https://stellar-mainnet.liquify.com/api=41EEWAH79Y5OCGI7/mainnet`
Gateway provider
- public testnet `https://soroban-rpc.testnet.stellar.gateway.fm`
- public mainnet `https://soroban-rpc.mainnet.stellar.gateway.fm`

### Deploy to testnet

```
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/cat.wasm \
  --source zygis \
  --network testnet
```

### Deploy to mainnet

```
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/blessing.wasm \
  --source zygis \
  --network mainnet
```

### Contract initialization

e.g. on how to interact

```
stellar contract invoke \
  --id CBHOJOPZ5BCWQ63RLMTCG73I3MM6E2N5UNZ2AE3ZVYY4MMFFAGUI6QVF \
  --source zygis \
  --network mainnet \
  -- \
  initialize \
  --admin GAVYPYRZFSSNWLOXURWWPB5T6PVPNTBL7BCEQXZP5VMVDSMUP7XF5TAN \
  --minters '["GAVYPYRZFSSNWLOXURWWPB5T6PVPNTBL7BCEQXZP5VMVDSMUP7XF5TAN"]' \
  --base_uri https://api.tokentails.com/cat/nft/
```

### Contract check

e.g. on how to interact

```
stellar contract invoke \
  --id CBHOJOPZ5BCWQ63RLMTCG73I3MM6E2N5UNZ2AE3ZVYY4MMFFAGUI6QVF \
  --source zygis \
  --network mainnet \
  --send yes \
  -- \
  check
```

### Contract mint

e.g. on how to interact

```
stellar contract invoke \
  --id CBHOJOPZ5BCWQ63RLMTCG73I3MM6E2N5UNZ2AE3ZVYY4MMFFAGUI6QVF \
  --source zygis \
  --network mainnet \
  -- \
  mint \
  --invoker GAVYPYRZFSSNWLOXURWWPB5T6PVPNTBL7BCEQXZP5VMVDSMUP7XF5TAN \
  --to GBFDHPVUCADXYGDUHJEXKO3BLV26SA5JBHV5MFQ3TH5HWVYZIP73VR4O \
  --token_id initialization_test
```

### Contract get_token_uri

e.g. on how to interact

```
stellar contract invoke \
  --id CBHOJOPZ5BCWQ63RLMTCG73I3MM6E2N5UNZ2AE3ZVYY4MMFFAGUI6QVF \
  --source zygis \
  --network mainnet \
  -- \
  get_token_uri \
  --token_id cat_3
```

### Contract set_base_uri

e.g. on how to interact

```
stellar contract invoke \
  --id CBHOJOPZ5BCWQ63RLMTCG73I3MM6E2N5UNZ2AE3ZVYY4MMFFAGUI6QVF \
  --source zygis \
  --network mainnet \
  -- \
  set_base_uri \
  --invoker GAVYPYRZFSSNWLOXURWWPB5T6PVPNTBL7BCEQXZP5VMVDSMUP7XF5TAN \
  --new_base_uri "api.tokentails.com/cat/nft/"
```

### Contract owner_of

e.g. on how to interact

```
stellar contract invoke \
  --id CBHOJOPZ5BCWQ63RLMTCG73I3MM6E2N5UNZ2AE3ZVYY4MMFFAGUI6QVF \
  --source zygis \
  --network mainnet \
  -- \
  owner_of \
  --token_id cat_3
```

### Contract transfer_to

e.g. on how to interact

```
stellar contract invoke \
  --id CBHOJOPZ5BCWQ63RLMTCG73I3MM6E2N5UNZ2AE3ZVYY4MMFFAGUI6QVF \
  --source zygis \
  --network mainnet \
  -- \
  transfer_from \
  --invoker GAVYPYRZFSSNWLOXURWWPB5T6PVPNTBL7BCEQXZP5VMVDSMUP7XF5TAN \
  --from GAVYPYRZFSSNWLOXURWWPB5T6PVPNTBL7BCEQXZP5VMVDSMUP7XF5TAN \
  --to GBFDHPVUCADXYGDUHJEXKO3BLV26SA5JBHV5MFQ3TH5HWVYZIP73VR4O \
  --token_id cat_3
```


#### Protocol 21 (Mainnet, June 18, 2024)
Kubernetes Stellar RPC deployment example 

```
    helm install stellar-rpc stellar/soroban-rpc --values pubnet.yaml
```