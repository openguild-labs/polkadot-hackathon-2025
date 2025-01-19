"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Wallet, TxType } from "@kaiachain/ethers-ext";
import { mnemonicToAccount } from 'viem/accounts'
import { Keyring } from '@polkadot/api';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

// Import
import { ApiPromise, WsProvider } from '@polkadot/api';

import { getOrThrow } from "@/lib/passkey-auth";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  Send,
  RotateCcw,
  Fuel,
  Loader2,
  ScanLine,
  ThumbsUp,
  Check,
  CircleX,
  Ban,
  ClipboardPaste,
  WandSparkles,
  SearchCode,
  Code,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import {
  formatBalance,
  truncateHash,
  truncateAddress,
  selectViemObjectFromChainId,
  selectJsonRpcProvider,
  selectAssetInfoFromAssetId,
  selectBlockExplorerFromChainId
} from "@/lib/utils";
import { normalize } from "viem/ens";
import { mainnet } from "viem/chains";
import { useMediaQuery } from "@/hooks/use-media-query";
import { mockStablecoinAbi } from "@/lib/abis";
import { useAtom, useAtomValue } from 'jotai';
import { evmAddressAtom, polkadotAddressAtom } from "@/components/wallet-management";
import { ALL_SUPPORTED_ASSETS } from "@/lib/assets";
// import { atomWithStorage } from 'jotai/utils'



export default function MessageForm() {

  const evmAddress = useAtomValue(evmAddressAtom)
  const polkadotAddress = useAtomValue(polkadotAddressAtom)
  // const evmAddress = "0x44079d2d27BC71d4D0c2a7C473d43085B390D36f";
  // const polkadotAddress = "5H1ctU6bPpkBioPxbiPqkCFFg8EN35QwZAQGevpzR5BSRa1S";
  const [address, setAddress] = useState<string>(evmAddress!);
  const [token, setToken] = useState<string>("eip155:1001/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE");
  const network = token.split("/")[0];
  const tokenAddress = token.split("/")[1].split(":")[1];

  // Redirect to the home page if the network or address is not provided.
  if (!evmAddress || !polkadotAddress) {
    redirect("/");
  }

  // Check if the user is on a desktop or mobile device.
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // State for current balance
  const [currentBalance, setCurrentBalance] = useState("");
  const [currentNativeBalance, setCurrentNativeBalance] = useState("");

  // Main state for the send form
  // const [sendingAmount, setSendingAmount] = useState("");
  const [receivingAddress, setReceivingAddress] = useState("");
  const [transactionMemo, setTransactionMemo] = useState("");

  // optional state for ENS lookup
  const [ensName, setEnsName] = useState("");

  // State for transaction cost
  const [transactionCost, setTransactionCost] = useState("");

  // State for delegate fee on Kaia
  const [delegateFeeActive, setDelegateFeeActive] = useState(false);

  // Handle UX states
  const [readyToTransfer, setReadyToTransfer] = useState(false);
  const [inputReadOnly, setInputReadOnly] = useState(false);
  const [continueButtonLoading, setContinueButtonLoading] = useState(false);
  const [sendButtonLoading, setSendButtonLoading] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState<Boolean | undefined>(
    undefined
  );
  const [isValidAmount, setIsValidAmount] = useState<Boolean | undefined>(
    undefined
  );
  const [isValidTotal, setIsValidTotal] = useState<Boolean | undefined>(
    undefined
  );
  const [isPasted, setIsPasted] = useState(false);
  const [isEnsResolved, setIsEnsResolved] = useState(false);
  const [ensLookUpLoading, setEnsLookUpLoading] = useState(false);

  // QR Scan for input
  const [qrScanSuccess, setQrScanSuccess] = useState(false);

  // QR Scan open/close state
  const [isQrScanOpen, setIsQrScanOpen] = useState(false);

  // publicClient for ENS lookup
  const mainnetPublicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  // Function to resolve ENS
  const resolveEns = async () => {
    if (receivingAddress.includes(".")) {
      setEnsLookUpLoading(true);
      const ensAddress = await mainnetPublicClient.getEnsAddress({
        name: normalize(receivingAddress),
      });
      if (ensAddress) {
        setReceivingAddress(ensAddress);
        setIsEnsResolved(true);
        setEnsName(receivingAddress);
        setEnsLookUpLoading(false);
        setTimeout(() => {
          setIsEnsResolved(false);
        }, 1000);
      } else {
        toast({
          className:
            "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
          variant: "destructive",
          title: "Uh oh! ENS lookup failed.",
          description: "Please try again.",
        });
        setEnsName("");
        setIsEnsResolved(false);
        setEnsLookUpLoading(false);
      }
    }
  };

  // Function to paste from clipboard
  const paste = async () => {
    setReceivingAddress(await navigator.clipboard.readText());
    setIsPasted(true);

    setTimeout(() => {
      setIsPasted(false);
    }, 1000);
  };

  // Toast notifications.
  const { toast } = useToast();

  // function
  function parseDot(value: string): string {
    // given a string like this 1,000,000,000,000
    // return 1000000000000
    // remove 10 zeros
    // then add in thousands separator
    return value.replace(/,/g, "").slice(0, -10);
  }

  // Fetch the current balance upon page load
  useEffect(() => {
    if (
      address &&
      network.split(":")[0] === "eip155" &&
      tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      const publicClient = createPublicClient({
        chain: selectViemObjectFromChainId(network as string),
        transport: http(),
      });
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: address as Address,
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
      address &&
      network.split(":")[0] === "eip155" &&
      tokenAddress !== "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      const publicClient = createPublicClient({
        chain: selectViemObjectFromChainId(network as string),
        transport: http(),
      });
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: address as Address,
        });
        const tokenBalance = await publicClient.readContract({
          address: tokenAddress as Address,
          abi: mockStablecoinAbi,
          functionName: "balanceOf",
          args: [address as Address],
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
      address &&
      network.split(":")[0] === "polkadot" &&
      tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      // Construct the polkadot
      const wsProvider = new WsProvider('wss://paseo.rpc.amforc.com:443');

      const fetchBalance = async () => {
        const polkadotApi = await ApiPromise.create({ provider: wsProvider });
        const accountInfo = await polkadotApi.query.system.account(polkadotAddress);
        if (accountInfo) {
          const humanAccountInfo = accountInfo.toHuman();
          setCurrentBalance(parseDot((humanAccountInfo as { data: { free: string } }).data.free));
          setCurrentNativeBalance(parseDot((humanAccountInfo as { data: { free: string } }).data.free));
        }
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }
  }, [address, polkadotAddress, network, token, tokenAddress]);

  // public client for balance refresh
  const publicClient = createPublicClient({
    chain: selectViemObjectFromChainId(network!),
    transport: http(),
  });

  // Function to fetch balance
  async function fetchBalances() {
    if (
      address &&
      network.split(":")[0] === "eip155" &&
      tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: address as Address,
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
      address &&
      network.split(":")[0] === "eip155" &&
      tokenAddress !== "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: address as Address,
        });
        const tokenBalance = await publicClient.readContract({
          address: tokenAddress as Address,
          abi: mockStablecoinAbi,
          functionName: "balanceOf",
          args: [address as Address],
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
      address &&
      network.split(":")[0] === "polkadot" &&
      tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      // Construct the polkadot
      const wsProvider = new WsProvider('wss://paseo.rpc.amforc.com:443');

      const fetchBalance = async () => {
        const polkadotApi = await ApiPromise.create({ provider: wsProvider });
        const accountInfo = await polkadotApi.query.system.account(polkadotAddress);
        if (accountInfo) {
          const humanAccountInfo = accountInfo.toHuman();
          setCurrentBalance(parseDot((humanAccountInfo as { data: { free: string } }).data.free));
          setCurrentNativeBalance(parseDot((humanAccountInfo as { data: { free: string } }).data.free));
        }
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }
  }

  function handleInputTokenChange(value: string) {
    setToken(value);
    setCurrentBalance("");
    setCurrentNativeBalance("");
  }

  // Function to handle QR scan
  function handleQrScan(data: string) {
    if (data.includes(":")) {
      const splitData = data.split(":");
      setReceivingAddress(splitData[1]);
      setQrScanSuccess(true);
      // delay the success message for 2 seconds
      setTimeout(() => {
        setQrScanSuccess(false);
      }, 500);
    } else {
      setReceivingAddress(data);
      setQrScanSuccess(true);
      // delay the success message for 2 seconds
      setTimeout(() => {
        setQrScanSuccess(false);
        setIsQrScanOpen(false);
      }, 500);
    }
  }

  // Function to autogenerate UID
  function autogenerateUid() {
    const uid = createId();
    setTransactionMemo(uid);
  }

  // Function to handle delegate fee
  function handleDelegateFeeChange() {
    setDelegateFeeActive(!delegateFeeActive);
  }

  // Function to prepare transaction before sending
  async function prepareTransaction() {
    if (receivingAddress === "") {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You did not enter a receiving address.",
        description: "Please enter a receiving address to continue.",
      });
      return;
    }
    if (receivingAddress) {
      if (network.split(":")[0] === "eip155") {
        const isValidAddress = isAddress(receivingAddress, { strict: false });
        if (isValidAddress) {
          setIsValidAddress(true);
        } else {
          setIsValidAddress(false);
        }
      }

      if (network.split(":")[0] === "polkadot") {
        const isValidAddress = true
        if (isValidAddress) {
          setIsValidAddress(true);
        } else {
          setIsValidAddress(false);
        }
      }
    }

    // Check if the network is EVM
    // Handle EVM prepare transaction
    if (
      network.split(":")[0] === "eip155"
    ) {
      const isValidAmount = true;
      if (isValidAmount) {
        setIsValidAmount(true);
        setInputReadOnly(true);
        setContinueButtonLoading(true);
        const publicClient = createPublicClient({
          chain: selectViemObjectFromChainId(network!),
          transport: http(),
        });

        let gas: bigint = BigInt(0);
        if (
          tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        ) {
          gas = await publicClient.estimateGas({
            account: address as Address,
            to: receivingAddress as Address,
            value: BigInt(0),
            data: toHex(transactionMemo),
          });
        }
        const gasPrice = await publicClient.getGasPrice();
        const gasCost = gas * gasPrice;
        setTransactionCost(formatEther(gasCost));
        let isValidTotal;
        if (tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
          isValidTotal =
            parseEther(currentBalance) >= gasCost;
        }
        if (isValidTotal) {
          setIsValidTotal(true);
          setReadyToTransfer(true);
        } else {
          setIsValidTotal(false);
          setReadyToTransfer(false);
          return;
        }
        setContinueButtonLoading(false);
      } else {
        setIsValidAmount(false);
        return;
      }
    }

    // Check if the network is Polkadot
    // Handle Polkadot prepare transaction
    if (
      network.split(":")[0] === "polkadot"
    ) {
      const isValidAmount = true;
      if (isValidAmount) {
        setIsValidAmount(true);
        setInputReadOnly(true);
        setContinueButtonLoading(true);
        setTransactionCost("0");
        const isValidTotal = true;
        if (isValidTotal) {
          setIsValidTotal(true);
          setReadyToTransfer(true);
        } else {
          setIsValidTotal(false);
          setReadyToTransfer(false);
          return;
        }
        setContinueButtonLoading(false);
      } else {
        setIsValidAmount(false);
        return;
      }
    }
  }

  // Function to submit transaction
  async function submitTransaction() {
    // Set the send button to loading state
    setSendButtonLoading(true);

    /**
     * Retrieve the handle to the private key from some unauthenticated storage
     */
    const cache = await caches.open("gmgn-storage");
    const request = new Request("gmgn-wallet");
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
          hash = await walletClient.sendTransaction({
            account,
            to: receivingAddress as Address,
            value: BigInt(0),
            data: toHex(transactionMemo),
          });
          transaction = await publicClient.waitForTransactionReceipt({
            hash: hash,
          });
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
        const keyring = new Keyring();
        const polkadotKeyPair = keyring.addFromUri(mnemonicPhrase);
        const wsProvider = new WsProvider('wss://paseo.rpc.amforc.com:443');
        const polkadotApi = await ApiPromise.create({ provider: wsProvider });
        const transfer = polkadotApi.tx.balances.transferAllowDeath(receivingAddress, "0");
        // Sign and send the transaction using our account
        const hash = await transfer.signAndSend(polkadotKeyPair);
        if (hash) {
          toast({
            className:
              "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
            title: "Transaction sent!",
            description: "Hash: " + truncateHash(hash.toString() ?? undefined, 6),
            action: (
              <ToastAction altText="view">
                <a
                  target="_blank"
                  href={`${selectBlockExplorerFromChainId(network!)}/extrinsic/${hash}`}
                >
                  View
                </a>
              </ToastAction>
            ),
          });
          fetchBalances();
        }
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
    setReadyToTransfer(false);
    setInputReadOnly(false);
    setTransactionCost("");
    setIsValidTotal(undefined);
    setIsValidAddress(undefined);
    setIsValidAmount(undefined);
  }

  // Function to prepare transaction before sending
  async function prepareDelegatedTransaction() {
    if (receivingAddress === "") {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You did not enter a receiving address.",
        description: "Please enter a receiving address to continue.",
      });
      return;
    }
    if (receivingAddress) {
      const isValidAddress = isAddress(receivingAddress, { strict: false });
      if (isValidAddress) {
        setIsValidAddress(true);
      } else {
        setIsValidAddress(false);
      }
    }
    const isValidAmount = true;
    if (isValidAmount) {
      setIsValidAmount(true);
      setInputReadOnly(true);
      setContinueButtonLoading(true);
      setTransactionCost("0");
      const isValidTotal = true;
      if (isValidTotal) {
        setIsValidTotal(true);
        setReadyToTransfer(true);
      } else {
        setIsValidTotal(false);
        setReadyToTransfer(false);
        return;
      }
      setContinueButtonLoading(false);
    } else {
      setIsValidAmount(false);
      return;
    }
  }

  // Function to submit delegated transaction
  async function submitDelegatedTransaction() {
    // Set the send button to loading state
    setSendButtonLoading(true);

    /**
     * Retrieve the handle to the private key from some unauthenticated storage
     */
    const cache = await caches.open("gmgn-storage");
    const request = new Request("gmgn-wallet");
    const response = await cache.match(request);
    const handle = response
      ? new Uint8Array(await response.arrayBuffer())
      : new Uint8Array();
    /**
     * Retrieve the private key from authenticated storage
     */
    const bytes = await getOrThrow(handle);
    const privateKey = fromBytes(bytes, "hex");
    const provider = selectJsonRpcProvider(network!);
    const kaiaSdkWalletClient = new Wallet(privateKey, provider);
    let tx = {
      type: TxType.FeeDelegatedValueTransferMemo,
      to: receivingAddress,
      from: address as Address,
      value: BigInt(0),
      input: toHex(transactionMemo),
    };
    const preparedTx = await kaiaSdkWalletClient.populateTransaction(tx);
    const hash = await kaiaSdkWalletClient.signTransaction(preparedTx);
    const currentNetwork = network;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/delegate-fee`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signature: hash,
            network: currentNetwork,
          }),
        }
      );
      const result = await response.json();
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        title: "Transaction sent!",
        description: "Hash: " + truncateHash(result.receipt.transactionHash, 6),
        action: (
          <ToastAction altText="view">
            <a
              target="_blank"
              href={`${selectBlockExplorerFromChainId(network!)}/tx/${
                result.receipt.transactionHash
              }`}
            >
              View
            </a>
          </ToastAction>
        ),
      });
    } catch (error) {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Transaction failed!",
        description: "Uh oh! Something went wrong.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
    setSendButtonLoading(false);
    setReadyToTransfer(false);
    setInputReadOnly(false);
  }

  // Function to clear all fields
  function clearAllFields() {
    setReceivingAddress("");
    setTransactionMemo("");
    setTransactionCost("");
    setContinueButtonLoading(false);
    setReadyToTransfer(false);
    setInputReadOnly(false);
    setIsValidAddress(undefined);
    setIsValidAmount(undefined);
    setIsValidTotal(undefined);
    setEnsName("");
    setIsEnsResolved(false);
    setEnsLookUpLoading(false);
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        <Label htmlFor="sendingToken">Sending network</Label>
        <Select
          value={token!}
          onValueChange={handleInputTokenChange}
          defaultValue="eip155:1001/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        >
          <SelectTrigger className="w-full border-2 border-primary h-[56px]">
            <SelectValue placeholder="Select a token" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select a network</SelectLabel>
              {
                ALL_SUPPORTED_ASSETS.map((asset) => (
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
      <div className="flex flex-col mt-4 mb-2">
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
      <div className="flex flex-col gap-8 mt-4 mb-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="receivingAddress">Receiving address</Label>
          <div className="flex flex-row gap-2 items-center justify-center">
            <Input
              id="receivingAddress"
              className="rounded-none w-full border-primary border-2 p-2.5 text-lg"
              placeholder="0x..."
              value={receivingAddress}
              onChange={(e) => setReceivingAddress(e.target.value)}
              readOnly={inputReadOnly}
              required
            />
            <Button
              variant="secondary"
              size="icon"
              disabled={isEnsResolved}
              onClick={resolveEns}
            >
              {isEnsResolved ? (
                <Check className="h-4 w-4" />
              ) : ensLookUpLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SearchCode className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              disabled={isPasted}
              onClick={paste}
            >
              {isPasted ? (
                <Check className="h-4 w-4" />
              ) : (
                <ClipboardPaste className="h-4 w-4" />
              )}
            </Button>
            <Dialog open={isQrScanOpen} onOpenChange={setIsQrScanOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="icon">
                  <ScanLine className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>QR Scanner</DialogTitle>
                  <DialogDescription>
                    Scan QR code to autofill
                  </DialogDescription>
                </DialogHeader>
                <Scanner
                  onScan={(result) => handleQrScan(result[0].rawValue)}
                />
                <DialogFooter>
                  <div className="flex flex-col items-center justify-center">
                    {qrScanSuccess ? (
                      <p className="flex flex-row gap-2 text-blue-600">
                        <ThumbsUp className="h-6 w-6" />
                        Scan completed. Exit to continue.
                      </p>
                    ) : (
                      <p className="flex flex-row gap-2 text-yellow-600">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Scanning...
                      </p>
                    )}
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {ensName ? (
            <Badge className="w-fit" variant="secondary">
              <Code className="mr-2 w-4 h-4" />
              {ensName}
            </Badge>
          ) : (
            <Badge className="w-fit" variant="secondary">
              <Code className="mr-2 w-4 h-4" />
              ------
            </Badge>
          )}
          <p className="text-sm text-muted-foreground">
            Fill in the address of the recipient
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="transactionMemo">Message</Label>
          <Textarea
            id="transactionMemo"
            className="rounded-none w-full border-primary border-2 p-2.5 text-lg"
            placeholder="gm and gn"
            value={transactionMemo}
            onChange={(e) => setTransactionMemo(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Optional memo for the transaction or autogenerate an UID
          </p>
          <Button
            onClick={autogenerateUid}
            variant="secondary"
            className="w-fit"
          >
            <WandSparkles className="mr-2 h-4 w-4" />
            Autogenerate UID
          </Button>
        </div>
        {(network === "eip155:1001" || network === "eip155:8217") && (token === "eip155:1001/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") ? (
          <div className="flex items-center space-x-2">
            <Switch
              id="delegate-fee"
              checked={delegateFeeActive}
              onCheckedChange={handleDelegateFeeChange}
            />
            <Label htmlFor="delegate-fee">Delegate gas fee</Label>
          </div>
        ) : null}
        <div className="flex flex-col gap-2 border-2 border-primary p-2">
          <h2 className="border-b pb-1 text-md font-semibold">Details</h2>
          <div className="flex flex-row gap-2">
            <h3 className="text-sm text-muted-foreground">Receiving address</h3>
            <p className="flex flex-row gap-2 items-center text-sm">
              {receivingAddress
                ? truncateAddress(receivingAddress as Address, 4)
                : "-----"}
              {isValidAddress === undefined ? null : isValidAddress === true ? (
                <Popover>
                  <PopoverTrigger>
                    <Check className="w-4 h-4 text-green-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-green-500">
                    Valid address
                  </PopoverContent>
                </Popover>
              ) : (
                <Popover>
                  <PopoverTrigger>
                    <CircleX className="w-4 h-4 text-red-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-red-500">
                    Invalid address
                  </PopoverContent>
                </Popover>
              )}
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <h3 className="text-sm text-muted-foreground">Estimated fees</h3>
            <p className="flex flex-row gap-2 items-center text-sm">
              <Fuel className="w-4 h-4" />
              {`${
                transactionCost ? transactionCost : "-----"
              } ${selectAssetInfoFromAssetId(token).split(":")[2]}`}
              {isValidTotal === undefined ? null : isValidTotal === true ? (
                <Popover>
                  <PopoverTrigger>
                    <Check className="w-4 h-4 text-green-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-green-500">
                    Valid total
                  </PopoverContent>
                </Popover>
              ) : (
                <Popover>
                  <PopoverTrigger>
                    <CircleX className="w-4 h-4 text-red-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-red-500">
                    Invalid total
                  </PopoverContent>
                </Popover>
              )}
            </p>
          </div>
          {continueButtonLoading ? (
            <Button disabled className="w-fit self-end">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : delegateFeeActive ? (
            <Button
              disabled={readyToTransfer}
              className="w-fit self-end"
              onClick={prepareDelegatedTransaction}
            >
              Continue
            </Button>
          ) : (
            <Button
              disabled={readyToTransfer}
              className="w-fit self-end"
              onClick={prepareTransaction}
            >
              Continue
            </Button>
          )}
        </div>
      </div>
      {sendButtonLoading ? (
        <div className="flex flex-row gap-2 justify-between">
          <Button disabled variant="outline">
            <Ban className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button className="w-[150px]" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        </div>
      ) : (
        <div className="flex flex-row gap-2 justify-between">
          <Button variant="outline" onClick={clearAllFields}>
            <Ban className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            disabled={!readyToTransfer}
            onClick={
              delegateFeeActive ? submitDelegatedTransaction : submitTransaction
            }
            className="w-[150px]"
          >
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>
      )}
    </div>
  );
}
