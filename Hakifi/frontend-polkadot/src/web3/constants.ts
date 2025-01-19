import { Idl } from '@coral-xyz/anchor';
import { Address } from 'viem';

export const VNST_ADDRESS: string = process.env
  .NEXT_PUBLIC_VNST_ADDRESS as string;

export const USDT_MOON_ADDRESS: Address = process.env
  .NEXT_PUBLIC_MOON_USDT_ADDRESS as Address;

export const USDT_SUI_ADDRESS: string = process.env
  .NEXT_PUBLIC_USDT_SUI_ADDRESS as string;

export const INSURANCE_ADDRESS: Address = process.env
  .NEXT_PUBLIC_INSURANCE_MOON_ADDRESS as Address;

export const INSURANCE_SUI_ADDRESS: string = process.env
  .NEXT_PUBLIC_INSURANCE_SUI_ADDRESS as string;
  
export const INSURANCE_STRUCTURED_ADDRESS: string = process.env
  .NEXT_PUBLIC_INSURANCE_STRUCTURED_ADDRESS as string;

export const SCILABS_ADDRESS: string = process.env.NEXT_PUBLIC_SCI_FUND_ADDRESS as string;
export const isMainnet = process.env.NEXT_PUBLIC_IS_MAINNET === 'true';

export const RATE_DECIMAL = 6;

export const VNST_DECIMAL = 18;

export const DISABLED_AUTO_CONNECT_KEY = 'disabled_auto_connect';

export const IDL_INSURANCE: Idl = {
  "version": "0.1.0",
  "name": "insurance",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        { "name": "owner", "isMut": true, "isSigner": true },
        { "name": "vaultAccount", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "bump", "type": "u8" }]
    },
    {
      "name": "initializetokenpda",
      "accounts": [
        { "name": "vaultTokenAccount", "isMut": true, "isSigner": false },
        { "name": "vaultPda", "isMut": false, "isSigner": false },
        { "name": "mint", "isMut": false, "isSigner": false },
        { "name": "owner", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "rent", "isMut": false, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "addMod",
      "accounts": [
        { "name": "owner", "isMut": true, "isSigner": true },
        { "name": "vaultAccount", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "modAddress", "type": "publicKey" }]
    },
    {
      "name": "deleteMod",
      "accounts": [
        { "name": "owner", "isMut": true, "isSigner": true },
        { "name": "vaultAccount", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "modAddress", "type": "publicKey" }]
    },
    {
      "name": "createInsurance",
      "accounts": [
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "insuranceAccount", "isMut": true, "isSigner": false },
        { "name": "creatorTokenAccount", "isMut": true, "isSigner": false },
        { "name": "vaultTokenAccount", "isMut": true, "isSigner": false },
        { "name": "vaultAccount", "isMut": true, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false },
        { "name": "rent", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "id", "type": "string" },
        { "name": "margin", "type": "u64" }
      ]
    },
    {
      "name": "updateAvailableInsurance",
      "accounts": [
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "insuranceAccount", "isMut": true, "isSigner": false },
        { "name": "vaultAccount", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "id", "type": "string" },
        { "name": "claimAmount", "type": "u64" },
        { "name": "expiredTime", "type": "u64" }
      ]
    },
    {
      "name": "updateInvalidInsurance",
      "accounts": [
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "insuranceAccount", "isMut": true, "isSigner": false },
        { "name": "creatorTokenAccount", "isMut": true, "isSigner": false },
        { "name": "vaultTokenAccount", "isMut": true, "isSigner": false },
        { "name": "vaultAccount", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "rent", "isMut": false, "isSigner": false },
        { "name": "associatedTokenProgram", "isMut": false, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "id", "type": "string" }]
    },
    {
      "name": "refundInsurance",
      "accounts": [
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "insuranceAccount", "isMut": true, "isSigner": false },
        { "name": "creatorTokenAccount", "isMut": true, "isSigner": false },
        { "name": "vaultTokenAccount", "isMut": true, "isSigner": false },
        { "name": "vaultAccount", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "rent", "isMut": false, "isSigner": false },
        { "name": "associatedTokenProgram", "isMut": false, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "id", "type": "string" }]
    },
    {
      "name": "cancelInsurance",
      "accounts": [
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "insuranceAccount", "isMut": true, "isSigner": false },
        { "name": "creatorTokenAccount", "isMut": true, "isSigner": false },
        { "name": "vaultTokenAccount", "isMut": true, "isSigner": false },
        { "name": "vaultAccount", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "rent", "isMut": false, "isSigner": false },
        { "name": "associatedTokenProgram", "isMut": false, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "id", "type": "string" }]
    },
    {
      "name": "claimInsurance",
      "accounts": [
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "insuranceAccount", "isMut": true, "isSigner": false },
        { "name": "creatorTokenAccount", "isMut": true, "isSigner": false },
        { "name": "vaultTokenAccount", "isMut": true, "isSigner": false },
        { "name": "vaultAccount", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "rent", "isMut": false, "isSigner": false },
        { "name": "associatedTokenProgram", "isMut": false, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "id", "type": "string" }]
    },
    {
      "name": "expireInsurance",
      "accounts": [
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "insuranceAccount", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "id", "type": "string" }]
    },
    {
      "name": "liquidateInsurance",
      "accounts": [
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "insuranceAccount", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "id", "type": "string" }]
    },
    {
      "name": "deleteInsurance",
      "accounts": [
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "insuranceAccount", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "id", "type": "string" }]
    }
  ],
  "accounts": [
    {
      "name": "InsuranceInfor",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "id", "type": "string" },
          { "name": "buyer", "type": "publicKey" },
          { "name": "margin", "type": "u64" },
          { "name": "claimAmount", "type": "u64" },
          { "name": "expiredTime", "type": "u64" },
          { "name": "openTime", "type": "u64" },
          { "name": "state", "type": { "defined": "State" } },
          { "name": "valid", "type": "bool" }
        ]
      }
    },
    {
      "name": "Vault",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "moderators", "type": { "vec": "publicKey" } },
          { "name": "bump", "type": "u8" },
          { "name": "marginPool", "type": "u64" },
          { "name": "claimPool", "type": "u64" },
          { "name": "hakifiFund", "type": "u64" },
          { "name": "thirdPartyFund", "type": "u64" }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "State",
      "type": {
        "kind": "enum",
        "variants": [
          { "name": "PENDING" },
          { "name": "AVAILABLE" },
          { "name": "CLAIMED" },
          { "name": "REFUNDED" },
          { "name": "LIQUIDATED" },
          { "name": "EXPIRED" },
          { "name": "CANCELED" },
          { "name": "INVALID" }
        ]
      }
    },
    {
      "name": "Type",
      "type": {
        "kind": "enum",
        "variants": [
          { "name": "CREATE" },
          { "name": "UPDATEAVAILABLE" },
          { "name": "UPDATEINVALID" },
          { "name": "REFUND" },
          { "name": "CANCEL" },
          { "name": "CLAIM" },
          { "name": "EXPIRED" },
          { "name": "LIQUIDATED" }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "EInsurance",
      "fields": [
        { "name": "idInsurance", "type": "string", "index": false },
        { "name": "buyer", "type": "publicKey", "index": false },
        { "name": "margin", "type": "u64", "index": false },
        { "name": "claimAmount", "type": "u64", "index": false },
        { "name": "expiredTime", "type": "u64", "index": false },
        { "name": "openTime", "type": "u64", "index": false },
        { "name": "state", "type": { "defined": "State" }, "index": false },
        { "name": "eventType", "type": { "defined": "Type" }, "index": false }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidIdHasBeenCreated",
      "msg": "Id has been created"
    },
    {
      "code": 6001,
      "name": "InvalidInsufficientBallance",
      "msg": "Insufficient balance"
    },
    { "code": 6002, "name": "ModAlreadyExists", "msg": "Mod already exits" },
    { "code": 6003, "name": "ModNotExists", "msg": "Mod not exits" },
    { "code": 6004, "name": "NotPerMission", "msg": "Not permission" }
  ]
};

