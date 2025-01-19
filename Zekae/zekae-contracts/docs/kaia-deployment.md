# Kaia Deployment

## Logs

```bash
[⠊] Compiling...
No files changed, compilation skipped
Traces:
  [2175921] Deploy::run()
    ├─ [0] VM::startBroadcast()
    │   └─ ← [Return]
    ├─ [673269] → new LSToken@0x3460A7314E82c7F9Ac946849c24a23c6ED0F93a4
    │   └─ ← [Return] 3022 bytes of code
    ├─ [690481] → new zUSD@0xc34145Ba8c001419413fF94Db90f1F0b8eD736ac
    │   └─ ← [Return] 3108 bytes of code
    ├─ [160547] → new SimpleMockOracle@0xA469D4f69f9B9514D3ccf5A2878Ce26c587E3051
    │   └─ ← [Return] 469 bytes of code
    ├─ [516160] → new ZekaeVault@0x9E05CBE8322e4775100FeB9352D32C58D489b03D
    │   └─ ← [Return] 2133 bytes of code
    ├─ [731] zUSD::changeOwner(ZekaeVault: [0x9E05CBE8322e4775100FeB9352D32C58D489b03D])
    │   └─ ← [Stop]
    ├─ [0] VM::stopBroadcast()
    │   └─ ← [Return]
    └─ ← [Return] LSToken: [0x3460A7314E82c7F9Ac946849c24a23c6ED0F93a4], zUSD: [0xc34145Ba8c001419413fF94Db90f1F0b8eD736ac], ZekaeVault: [0x9E05CBE8322e4775100FeB9352D32C58D489b03D], SimpleMockOracle: [0xA469D4f69f9B9514D3ccf5A2878Ce26c587E3051]


Script ran successfully.

== Return ==
0: contract LSToken 0x3460A7314E82c7F9Ac946849c24a23c6ED0F93a4
1: contract zUSD 0xc34145Ba8c001419413fF94Db90f1F0b8eD736ac
2: contract ZekaeVault 0x9E05CBE8322e4775100FeB9352D32C58D489b03D
3: contract SimpleMockOracle 0xA469D4f69f9B9514D3ccf5A2878Ce26c587E3051

## Setting up 1 EVM.
==========================
Simulated On-chain Traces:

  [673269] → new LSToken@0x3460A7314E82c7F9Ac946849c24a23c6ED0F93a4
    └─ ← [Return] 3022 bytes of code

  [690481] → new zUSD@0xc34145Ba8c001419413fF94Db90f1F0b8eD736ac
    └─ ← [Return] 3108 bytes of code

  [160547] → new SimpleMockOracle@0xA469D4f69f9B9514D3ccf5A2878Ce26c587E3051
    └─ ← [Return] 469 bytes of code

  [516160] → new ZekaeVault@0x9E05CBE8322e4775100FeB9352D32C58D489b03D
    └─ ← [Return] 2133 bytes of code

  [5531] zUSD::changeOwner(ZekaeVault: [0x9E05CBE8322e4775100FeB9352D32C58D489b03D])
    └─ ← [Stop]


==========================

Chain 1001

Estimated gas price: 52.5 gwei

Estimated total gas used for script: 4914404

Estimated amount required: 0.25800621 ETH

==========================
Enter keystore password:

##### 1001
✅  [Success] Hash: 0xd3be983699af348aa74a73c04765e8ef24adbf76ab9f8243761ea3a998141ee5
Contract Address: 0x3460A7314E82c7F9Ac946849c24a23c6ED0F93a4
Block: 174551063
Paid: 0.028035425001121417 ETH (1121417 gas * 25.000000001 gwei)


##### 1001
✅  [Success] Hash: 0x610ce734e73453e3be826a23958a44423c82ec0c377049c8a967158af23fcca3
Contract Address: 0xA469D4f69f9B9514D3ccf5A2878Ce26c587E3051
Block: 174551064
Paid: 0.007149825000285993 ETH (285993 gas * 25.000000001 gwei)


##### 1001
✅  [Success] Hash: 0x46d080895658c3bbec01cebc98befbb8de1bad3a9a32d4639a1a7bba905bc636
Contract Address: 0x9E05CBE8322e4775100FeB9352D32C58D489b03D
Block: 174551064
Paid: 0.020507950000820318 ETH (820318 gas * 25.000000001 gwei)


##### 1001
✅  [Success] Hash: 0x9722d20a6e35f56ded51725966c50016187691f4ef76e2ca63d6f435ff567194
Contract Address: 0xc34145Ba8c001419413fF94Db90f1F0b8eD736ac
Block: 174551064
Paid: 0.028638325001145533 ETH (1145533 gas * 25.000000001 gwei)


##### 1001
✅  [Success] Hash: 0xdc2102458dc18fbe161061fa1c8fd72c15177a5669618a3aef7611d95614c623
Block: 174551064
Paid: 0.000753275000030131 ETH (30131 gas * 25.000000001 gwei)

✅ Sequence #1 on 1001 | Total Paid: 0.085084800003403392 ETH (3403392 gas * avg 25.000000001 gwei)
```