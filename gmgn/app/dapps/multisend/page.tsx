"use client";

import { useMemo, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import BackButton from "@/components/back-button";
import NavBar from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { getOrThrow } from "@/lib/passkey-auth";
import {
  createPublicClient,
  http,
  Address,
  formatEther,
  fromBytes,
  createWalletClient,
  parseEther,
  toHex,
  isAddress,
  formatUnits,
  parseUnits,
} from "viem";
import { mnemonicToAccount } from 'viem/accounts';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

import { DedotClient, WsProvider } from 'dedot';
import type { PolkadotApi } from '@dedot/chaintypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatBalance,
  truncateHash,
  truncateAddress,
  selectViemObjectFromChainId,
  selectAssetInfoFromAssetId,
  selectBlockExplorerFromChainId
} from "@/lib/utils";
import { Info, Plus, Trash2, Loader2, CornerDownRight, ArrowRight, RotateCcw, Check, ClipboardPaste } from "lucide-react";
import { mockStablecoinAbi } from "@/lib/abis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAtom, useAtomValue } from 'jotai';
import { evmAddressAtom, polkadotAddressAtom } from "@/components/wallet-management";
import { ALL_SUPPORTED_ASSETS } from "@/lib/assets";
import { MULTISEND_CONTRACTS } from "@/lib/contracts";
import { gasliteAbi, erc20Abi } from "@/lib/abis";
import { useMediaQuery } from "@/hooks/use-media-query";


type AirdropItem = {
  address: string;
  amount: string;
};

enum LoadingState {
  Loading,
  Idle
}

export default function MultisendAppPage() {
  // Get the search params from the URL.
  // const searchParams = useSearchParams();
  // Get the address and network from the search params.
  // const address = searchParams.get("address");
  // const network = searchParams.get("network");

  const evmAddress = useAtomValue(evmAddressAtom)
  const polkadotAddress = useAtomValue(polkadotAddressAtom)
  // const evmAddress = "0x44079d2d27BC71d4D0c2a7C473d43085B390D36f";
  // const polkadotAddress = "5H1ctU6bPpkBioPxbiPqkCFFg8EN35QwZAQGevpzR5BSRa1S";
  const [address, setAddress] = useState<string>(evmAddress!);
  const [token, setToken] = useState<string>("eip155:1001/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE");
  const network = token.split("/")[0];
  const tokenAddress = token.split("/")[1].split(":")[1];
  
  // check each element in the ALL_SUPPORTED_ASSETS array with MULTISEND_CONTRACTS array
  // return the element that has the same eip155:chainId 
  // for example, if the asset is "eip155:1001/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
  // and the MULTISEND_CONTRACTS array has "eip155:1001/contract:0x61684fc62b6a0f1273f69d9fca0e264001a61db6"
  // then the function will return all elements that match the "eip155:1001"
  const MULTISEND_SUPPORTED_ASSETS = useMemo(() => {
    return ALL_SUPPORTED_ASSETS.filter((asset) => {
      return MULTISEND_CONTRACTS.some((contract) => {
        return contract.split("/")[0] === asset.split("/")[0];
      });
    });
  }, []);


  // Check if the user is on a desktop or mobile device.
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // State for current balance
  const [currentBalance, setCurrentBalance] = useState("");
  const [currentNativeBalance, setCurrentNativeBalance] = useState("");
  const [currentTokenDecimals, setCurrentTokenDecimals] = useState<number>(18);
  // state for current MULTISEND_CONTRACT
  const [multisendContractAddress, setMultisendContractAddress] = useState<string>("eip155:1001/contract:0x61684fc62b6a0f1273f69d9fca0e264001a61db6");

  // State for the airdrop list.
  const [airdropList, setAirdropList] = useState<AirdropItem[]>([]);

  // state for sending status
  const [sendButtonLoading, setSendButtonLoading] = useState(false);

  // Toast notifications.
  const { toast } = useToast();

  // Fetch the current balance upon page load
  useEffect(() => {
    if (
      evmAddress &&
      network.split(":")[0] === "eip155" &&
      tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      const publicClient = createPublicClient({
        chain: selectViemObjectFromChainId(network as string),
        transport: http(),
      });
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: evmAddress as Address,
        });
        setCurrentBalance(formatEther(balance).toString());
        setCurrentNativeBalance(formatEther(balance).toString());
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }
    if (
      evmAddress &&
      network.split(":")[0] === "eip155" &&
      tokenAddress !== "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      const publicClient = createPublicClient({
        chain: selectViemObjectFromChainId(network as string),
        transport: http(),
      });
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: evmAddress as Address,
        });
        const tokenBalance = await publicClient.readContract({
          address: tokenAddress as Address,
          abi: mockStablecoinAbi,
          functionName: "balanceOf",
          args: [evmAddress as Address],
        });
        const tokenDecimals = await publicClient.readContract({
          address: tokenAddress as Address,
          abi: mockStablecoinAbi,
          functionName: "decimals",
        });
        setCurrentBalance(formatUnits(tokenBalance as bigint, 6).toString());
        setCurrentNativeBalance(formatEther(balance as bigint).toString());
        setCurrentTokenDecimals(tokenDecimals as number);
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }

    if (
      polkadotAddress &&
      network.split(":")[0] === "polkadot" &&
      tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      // Construct the polkadot
      const wsProvider = new WsProvider('wss://paseo.rpc.amforc.com:443');

      const fetchBalance = async () => {
        // initialize the dedot polkadot client
        const polkadotClient = await DedotClient.new<PolkadotApi>(wsProvider);
        const balance = await polkadotClient.query.system.account(polkadotAddress);
        const freeBalance: bigint = balance.data.free;
        setCurrentBalance(formatUnits(freeBalance, 10));
        setCurrentNativeBalance(formatUnits(freeBalance, 10));
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }
  }, [evmAddress, polkadotAddress, network, token, tokenAddress]);

  // public client for balance refresh
  const publicClient = createPublicClient({
    chain: selectViemObjectFromChainId(network!),
    transport: http(),
  });

  // Function to fetch balance
  async function fetchBalances() {
    if (
      evmAddress &&
      network.split(":")[0] === "eip155" &&
      tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: evmAddress as Address,
        });
        setCurrentBalance(formatEther(balance).toString());
        setCurrentNativeBalance(formatEther(balance).toString());
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }
    if (
      evmAddress &&
      network.split(":")[0] === "eip155" &&
      tokenAddress !== "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: evmAddress as Address,
        });
        const tokenBalance = await publicClient.readContract({
          address: tokenAddress as Address,
          abi: mockStablecoinAbi,
          functionName: "balanceOf",
          args: [evmAddress as Address],
        });
        setCurrentBalance(formatUnits(tokenBalance as bigint, 6).toString());
        setCurrentNativeBalance(formatEther(balance as bigint).toString());
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }

    if (
      polkadotAddress &&
      network.split(":")[0] === "polkadot" &&
      tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      // Construct the polkadot
      const wsProvider = new WsProvider('wss://paseo.rpc.amforc.com:443');

      const fetchBalance = async () => {
        // initialize the dedot polkadot client
        const polkadotClient = await DedotClient.new<PolkadotApi>(wsProvider);
        const balance = await polkadotClient.query.system.account(polkadotAddress);
        const freeBalance: bigint = balance.data.free;
        setCurrentBalance(formatUnits(freeBalance, 10));
        setCurrentNativeBalance(formatUnits(freeBalance, 10));
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }
  }


  // Total airdrop amount.
  const totalAirdropAmount = useMemo(() => {
    if (tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
      return airdropList.reduce((acc, item) => {
        return acc + BigInt(parseEther(item.amount));
      }, BigInt(0));
    } else {
      return airdropList.reduce((acc, item) => {
        return acc + BigInt(parseUnits(item.amount, currentTokenDecimals));
      }, BigInt(0));
    }
  }, [airdropList, tokenAddress, currentTokenDecimals]);

  // state for file input
  const [file, setFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    const fileReader = new FileReader();
    fileReader.onload = function (e: ProgressEvent<FileReader>) {
      if (e.target) {
        const text = e.target.result;
        csvFileToArray(text);
      }
    };
    if (file) {
      fileReader.readAsText(file);
    }
  }, [file]);

  function handleInputTokenChange(value: string) {
    setToken(value);
    setMultisendContractAddress(MULTISEND_CONTRACTS.find((contract) => contract.split("/")[0] === value.split("/")[0])!);
    setCurrentBalance("");
    setCurrentNativeBalance("");
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  }

  // function to convert the csv file to airdropList
  function csvFileToArray(text: string | ArrayBuffer | null) {
    if (typeof text === "string") {
      const rows = text.split("\n").filter((item) => item !== "");
      const airdropList = rows.map((row) => {
        const [address, amount] = row.split(",");
        return { address, amount };
      });
      setAirdropList(airdropList);
    }
  }

  // Add a new airdrop items
  function handleAddAirdropList() {
    setAirdropList(airdropList.concat({ address: "", amount: "" }));
  }

  // Reset the airdrop list.
  function handleResetAirdropList() {
    setAirdropList([]);
  }

  // Change the address of the airdrop item.
  function handleAddressChange(index: number) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAirdropList = [...airdropList];
      newAirdropList[index].address = e.target.value;
      setAirdropList(newAirdropList);
    };
  }

  // Change the amount of the airdrop item.
  function handleAmountChange(index: number) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAirdropList = [...airdropList];
      newAirdropList[index].amount = e.target.value;
      setAirdropList(newAirdropList);
    };
  }

  // function to send the multisend transaction
  async function submitMultisendTransaction() {
    // Set the send button to loading state
    setSendButtonLoading(true);

    /**
     * Retrieve the handle to the private key from some unauthenticated storage
     */
    const cache = await caches.open("gmgn-storage");
    const request = new Request("/gmgn-wallet");
    const response = await cache.match(request);
    const handle = response
      ? new Uint8Array(await response.arrayBuffer())
      : new Uint8Array();
    /**
     * Retrieve the private key from authenticated storage
     */
    const bytes = await getOrThrow(handle);
    const mnemonicPhrase = bip39.entropyToMnemonic(bytes, wordlist);
    if (mnemonicPhrase) {

      // Handle EVM submit transaction
      // Check if the network is EVM
      if (
        network.split(":")[0] === "eip155"
      ) {
        const account = mnemonicToAccount(mnemonicPhrase,
          {
            accountIndex: 0,
            addressIndex: 0,
          }
        );
        const walletClient = createWalletClient({
          account: account,
          chain: selectViemObjectFromChainId(network!),
          transport: http(),
        });
        const publicClient = createPublicClient({
          chain: selectViemObjectFromChainId(network!),
          transport: http(),
        });
        let transaction = null;
        let hash = null;
        if (tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
          // sanitize airdropList from any empty objects
          const airdropListFiltered = airdropList.filter(
            (item) => item.amount !== "" && item.address !== ""
          );

          // create addresses list
          const addresses: Address[] = airdropListFiltered.map(
            (item) => item.address.replace(/\s/g, "") as Address
          );

          // create airdropAmounts list
          const airdropAmounts: bigint[] = airdropListFiltered.map((item) =>
            parseEther(item.amount)
          );
          const { request } = await publicClient.simulateContract({
            account: account,
            address: multisendContractAddress.split("/")[1].split(":")[1] as Address,
            abi: gasliteAbi,
            functionName: "airdropETH",
            args: [addresses, airdropAmounts],
            value: totalAirdropAmount,
          });
          hash = await walletClient.writeContract(request);
          transaction = await publicClient.waitForTransactionReceipt({
            hash: hash,
          });
        } else {
          // sanitize airdropList from any empty objects
          const airdropListFiltered = airdropList.filter(
            (item) => item.amount !== "" && item.address !== ""
          );

          // create addresses list
          const addresses: Address[] = airdropListFiltered.map(
            (item) => item.address.replace(/\s/g, "") as Address
          );

          // create airdropAmounts list
          const airdropAmounts: bigint[] = airdropListFiltered.map((item) =>
            parseUnits(item.amount, currentTokenDecimals as number)
          );
          const { request: approvalRequest } = await publicClient.simulateContract({
            account: account,
            address: tokenAddress as Address,
            abi: erc20Abi,
            functionName: "approve",
            args: [
              multisendContractAddress.split("/")[1].split(":")[1] as Address,
              totalAirdropAmount,
            ],
          });
          let approvalHash = await walletClient.writeContract(approvalRequest);
          let approvalTransaction = await publicClient.waitForTransactionReceipt({
            hash: approvalHash,
          });
          if (approvalTransaction) {
            const { request } = await publicClient.simulateContract({
              account: account,
              address: multisendContractAddress.split("/")[1].split(":")[1] as Address,
              abi: gasliteAbi,
              functionName: "airdropERC20",
              args: [
                tokenAddress as Address,
                addresses,
                airdropAmounts,
                totalAirdropAmount,
              ],
            });
            hash = await walletClient.writeContract(request);
            transaction = await publicClient.waitForTransactionReceipt({
              hash: hash,
            });
          }
        }
        if (transaction) {
          toast({
            className:
              "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
            title: "Transaction sent!",
            description: "Hash: " + truncateHash(hash ?? undefined, 6),
            action: (
              <ToastAction altText="view">
                <a
                  target="_blank"
                  href={`${selectBlockExplorerFromChainId(network!)}/tx/${hash}`}
                >
                  View
                </a>
              </ToastAction>
            ),
          });
          fetchBalances();
        }
      }
      
      if (
        network.split(":")[0] === "polkadot"
      ) {
        await cryptoWaitReady();
        const keyring = new Keyring();
        const polkadotKeyPair = keyring.addFromUri(mnemonicPhrase);
        const wsProvider = new WsProvider('wss://paseo.rpc.amforc.com:443');
        const polkadotClient = await DedotClient.new<PolkadotApi>(wsProvider);
        // const unsub = await polkadotClient.tx.balances
        // .transferKeepAlive(receivingAddress, parseUnits(sendingAmount, 10))
        // .signAndSend(polkadotKeyPair, async ({ status }) => {
        //   if (status.type === 'BestChainBlockIncluded') { // or status.type === 'Finalized'
        //     // console.log(`Transaction completed at block hash ${status.value.blockHash}`);
        //     toast({
        //       className:
        //         "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        //       title: "Transaction sent!",
        //       description: "Hash: " + truncateHash(status.value.blockHash.toString() ?? undefined, 6),
        //       action: (
        //         <ToastAction altText="view">
        //           <a
        //             target="_blank"
        //             href={`${selectBlockExplorerFromChainId(network!)}/extrinsic/${status.value.blockHash}`}
        //           >
        //             View
        //           </a>
        //         </ToastAction>
        //       ),
        //     });
        //     await unsub();
        //     fetchBalances();
        //   }
        // });
      }
    } else {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Wallet load failed!",
        description: "Uh oh! Something went wrong. please try again.",
      });
    }
    setSendButtonLoading(false);
  }

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Multisend
      </h1>
      <BackButton route="/dapps" />
      <NavBar />
        <div className="flex flex-col mt-4 gap-2">
          <Label htmlFor="sendingToken">Sending token</Label>
          <Select
            value={token!}
            onValueChange={handleInputTokenChange}
          >
            <SelectTrigger className="w-full border-2 border-primary h-[56px]">
              <SelectValue placeholder="Select a token" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select a token</SelectLabel>
                {
                  MULTISEND_SUPPORTED_ASSETS.map((asset) => (
                    <SelectItem key={asset} value={asset}>
                      <div className="flex flex-row gap-2 items-center">
                        <Image
                          src={selectAssetInfoFromAssetId(asset!).split(":")[3] || "/default-logo.png"}
                          alt={asset}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <div className="text-lg">{selectAssetInfoFromAssetId(asset!).split(":")[2]}</div>
                        <Badge variant="secondary">{selectAssetInfoFromAssetId(asset!).split(":")[0]}</Badge>
                      </div>
                    </SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col mb-2">
          <h2 className="text-lg">Balance</h2>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-1 items-end text-2xl font-semibold">
              {currentBalance ? formatBalance(currentBalance, 4) : <Skeleton className="w-8 h-6" />}
              <p className="text-lg">
                {selectAssetInfoFromAssetId(token).split(":")[2]}
              </p>
            </div>
            <Button onClick={fetchBalances} size="icon">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-row gap-1 items-end text-sm text-muted-foreground">
            {currentNativeBalance
              ? formatBalance(currentNativeBalance, 4)
              : <Skeleton className="w-4 h-4" />}
            <p className="text-sm text-muted-foreground">
              {selectAssetInfoFromAssetId(token).split(":")[2]}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="border-b pb-2 text-lg font-semibold">Step 1</h2>
          <div className="flex flex-row gap-2 items-center">
            <CornerDownRight className="h-4 w-4" />
            <p>Create an airdrop list</p>
          </div>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="file-input">File</TabsTrigger>
            </TabsList>
            <TabsContent value="manual" className="flex flex-col gap-4">
              <div className="inline">
                <Info className="inline h-4 w-4 mr-2" />
                Enter addresses and corresponding amounts manually. Best for
                sending to small amount of addreses
              </div>
              {
                // if airdropList is empty, show the message
                airdropList.length === 0 ? (
                  <p className="text-md text-muted-foreground">
                    No addresses added. Click the + button below to add.
                  </p>
                ) : (
                  // if airdropList is not empty, show the list
                  <div className="flex flex-col gap-4">
                    {airdropList.map((item, index) => (
                      <div key={index} className="flex flex-col gap-2 border shadow-sm p-4">
                        <h2 className="text-sm bg-muted border-2 rounded-sm w-fit p-2">{index + 1}</h2>
                        <h2>Address</h2>
                        <div>
                          <Input
                            placeholder="Enter an address"
                            value={item.address}
                            onChange={handleAddressChange(index)}
                            className="text-lg"
                          />
                        </div>
                        <h2>Amount</h2>
                        {isDesktop ? (
                          <Input
                            placeholder="Enter an amount"
                            type="number"
                            value={item.amount}
                            onChange={handleAmountChange(index)}
                            className="text-lg"
                          />
                          ) : (
                            <Input
                              placeholder="Enter an amount"
                              type="text"
                              inputMode="decimal"
                              pattern="[0-9]*"
                              value={item.amount}
                              onChange={handleAmountChange(index)}
                              className="text-lg"
                            />
                          )}
                      </div>
                    ))}
                  </div>
                )
              }
              <div className="flex flex-row gap-2">
                <Button
                  onClick={handleAddAirdropList}
                  variant="outline"
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleResetAirdropList}
                  variant="outline"
                  size="icon"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            <TabsContent className="flex flex-col gap-4" value="file-input">
              <p>
                <span className="inline-block mr-2">
                  <Info className="h-4 w-4" />
                </span>
                Upload a .csv file containing addresses and amounts.
              </p>
              <Input
                type="file"
                accept=".csv"
                onChange={handleImportFile}
                className="w-full"
              />
              {
                // if airdropList is empty, show the message
                airdropList.length === 0 ? (
                  <p className="text-md text-muted-foreground">
                    No addresses uploaded.
                  </p>
                ) : (
                  // if airdropList is not empty, show the list
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <h2>Addresses</h2>
                      <h2>Amounts</h2>
                    </div>
                    {airdropList.map((item, index) => (
                      <div key={index} className="flex flex-row gap-4">
                        <Input
                          placeholder="Enter an address"
                          value={item.address}
                          readOnly
                        />
                        <Input
                          placeholder="Enter an amount"
                          value={item.amount}
                          readOnly
                        />
                      </div>
                    ))}
                  </div>
                )
              }
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="border-b pb-2 text-lg font-semibold">
            Step 2
          </h2>
          <div className="flex flex-row gap-2 items-center">
            <CornerDownRight className="h-4 w-4" />
            <p>Confirm the total multisend amount</p>
          </div>
          <p className="font-semibold text-2xl">
            {tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" ? formatEther(totalAirdropAmount).toString() : formatUnits(totalAirdropAmount, currentTokenDecimals).toString()}{" "}
            <span className="inline-block align-baseline text-sm ml-2">
              {selectAssetInfoFromAssetId(token).split(":")[2]}
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="border-b pb-2 text-lg font-semibold">
            Step 3
          </h2>
          <div className="flex flex-row gap-2 items-center">
            <CornerDownRight className="h-4 w-4" />
            <p>Review and proceed</p>
          </div>
          {sendButtonLoading ? (
            <Button className="w-full md:w-[400px]" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button className="w-full md:w-[400px]" onClick={submitMultisendTransaction}>
              Proceed
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
    </div>
  );
}