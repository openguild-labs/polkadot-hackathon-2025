"use client";

import { useState } from "react";
import {
  useWriteContract,
  useReadContracts,
} from "wagmi";
import { Address, parseUnits } from "viem";
import { lstokenAbi, zekaeVaultAbi, zusdAbi, oracleAbi } from "@/lib/abis";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


export default function AdminManage() {

  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState<Address | undefined>(undefined);
  const [underlyingAssetPrice, setUnderlyingAssetPrice] = useState<string | undefined>(undefined);
  
  // useWriteContract hook to write contract
  const {
    writeContractAsync,
  } = useWriteContract();

  // contract addresses
  const LST_CONTRACT_ADDRESS = "0xC4F238cEdC1f77A0Fe36F60eceDef14336e4eFbe";
  const ZEKAE_VAULT_CONTRACT_ADDRESS = "0x1dB58359534600b08Fe7061608920f1C47E7b0b0";
  const ZUSD_CONTRACT_ADDRESS = "0x66f039Bc124A3f45D3b30BFdD903B72a4857878f";
  const ORACLE_CONTRACT_ADDRESS = "0x1Ed8c557791e0c98D72387423ab5c215d358E5a4";


  // useReadContracts hook to read contract
  const { data: oracleData, refetch } = useReadContracts({
    contracts: [
      {
        address: ORACLE_CONTRACT_ADDRESS,
        abi: oracleAbi,
        functionName: "latestAnswer",
      },
      {
        address: ORACLE_CONTRACT_ADDRESS,
        abi: oracleAbi,
        functionName: "exchangeRate",
      },
      {
        address: ORACLE_CONTRACT_ADDRESS,
        abi: oracleAbi,
        functionName: "underlyingAssetPrice",
      }
    ],
  });

  // extract the data from the read contracts hook
  const oracleAnswer = oracleData?.[0]?.result as bigint | undefined;
  const exchangeRate = oracleData?.[1]?.result as bigint | undefined;
  const fetchedUnderlyingAssetPrice = oracleData?.[2]?.result as bigint | undefined;

  function mintLst() {
    writeContractAsync({
      address: LST_CONTRACT_ADDRESS,
      abi: lstokenAbi,
      functionName: "mint",
      args: [address, parseUnits(amount.toString(), 18)],
    });
  }

  function approveUnlimitedZusd() {
    writeContractAsync({
      address: ZUSD_CONTRACT_ADDRESS,
      abi: zusdAbi,
      functionName: "approve",
      args: [ZEKAE_VAULT_CONTRACT_ADDRESS, BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")],
    });
  }

  function liquidate() {
    writeContractAsync({
      address: ZEKAE_VAULT_CONTRACT_ADDRESS,
      abi: zekaeVaultAbi,
      functionName: "liquidate",
      args: [address],
    });
  }

  function changeUnderlyingAssetPrice() {
    writeContractAsync({
      address: ORACLE_CONTRACT_ADDRESS,
      abi: oracleAbi,
      functionName: "setUnderlyingAssetPrice",
      args: [parseUnits(underlyingAssetPrice || "10", 18)],
    });
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-4 border border-gray-200 rounded-lg p-4">
        <h1 className="text-2xl font-bold">Oracle</h1>
        <Button onClick={() => refetch()}>Refetch</Button>
        <div className="flex flex-col gap-2">
          <Label>Latest Answer</Label>
          <Input disabled value={oracleAnswer?.toString()} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Exchange Rate</Label>
          <Input disabled value={exchangeRate?.toString()} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Underlying Asset Price</Label>
          <Input disabled value={fetchedUnderlyingAssetPrice?.toString()} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Set underlying price</Label>
          <Input value={underlyingAssetPrice} onChange={(e) => setUnderlyingAssetPrice(e.target.value)} />
          <Button onClick={changeUnderlyingAssetPrice}>Set</Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 border border-gray-200 rounded-lg p-4">
        <h1 className="text-2xl font-bold">Mint LST</h1>
        <Label>Address</Label>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value as Address)}
        />
        <Label>Amount</Label>
        <Input
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <Button onClick={mintLst}>Mint</Button>
      </div>
      <div className="flex flex-col gap-4 border border-gray-200 rounded-lg p-4">
        <h1 className="text-2xl font-bold">Liquidate</h1>
        <Button onClick={approveUnlimitedZusd}>Approve Unlimited ZUSD</Button>
        <Label>Amount</Label>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value as Address)}
        />
        <Button onClick={liquidate}>Liquidate</Button>
      </div>
    </div>
  );
}
