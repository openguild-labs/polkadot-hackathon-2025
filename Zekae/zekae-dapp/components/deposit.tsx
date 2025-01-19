"use client";

import { useState, useEffect } from "react";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useConfig,
  useWriteContract,
  useReadContracts,
  useAccount
} from "wagmi";
import {
  Ban,
  ExternalLink,
  ChevronDown,
  X,
  Hash,
  LoaderCircle,
  CircleCheck,
  HandCoins,
  Vault,
  RefreshCcw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatUnits, parseUnits } from "viem";
import { lstokenAbi, zekaeVaultAbi } from "@/lib/abis";
import { getSigpassWallet } from "@/lib/sigpass";
import { useAtomValue } from "jotai";
import { addressAtom } from "@/components/sigpasskit";
import { localConfig } from "@/app/providers";
import { formatBalance } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import { truncateHash } from "@/lib/utils";
import CopyButton from "@/components/copy-button";
import { getAddressesBasedOnChainId } from "@/lib/utils";

export default function Deposit() {
  // useConfig hook to get config
  const config = useConfig();

  // useAccount hook to get account
  const account = useAccount();

  // Find the chain ID from the connected account
  const chainId = account.chainId;

  // get the address from session storage
  const address = useAtomValue(addressAtom);

  // useMediaQuery hook to check if the screen is desktop
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // useState hook to open/close dialog/drawer
  const [open, setOpen] = useState(false);

  // contract addresses
  const LST_CONTRACT_ADDRESS = getAddressesBasedOnChainId(chainId).lst as `0x${string}`;
  const ZEKAE_VAULT_CONTRACT_ADDRESS = getAddressesBasedOnChainId(chainId).vault as `0x${string}`;


  // form schema for sending transaction
  const formSchema = z.object({
    // amount is a required field
    amount: z
      .string()
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number",
      })
      .refine((val) => /^\d*\.?\d{0,18}$/.test(val), {
        message: "Amount cannot have more than 18 decimal places",
      })
      .superRefine((val, ctx) => {
        if (!currentLstBalance) return;

        const inputAmount = parseUnits(val, 18 as number);

        if (inputAmount > (currentLstBalance as bigint)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Amount exceeds available balance",
          });
        }
      }),
  });
  
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    // resolver is zodResolver
    resolver: zodResolver(formSchema),
    // default values for address and amount
    defaultValues: {
      amount: "",
    },
  });

  // useReadContracts hook to read contract
  const { data, refetch, isFetching } = useReadContracts({
    contracts: [
      {
        address: LST_CONTRACT_ADDRESS,
        abi: lstokenAbi,
        functionName: "balanceOf",
        args: [address ? address : account.address],
      },
      {
        address: ZEKAE_VAULT_CONTRACT_ADDRESS,
        abi: zekaeVaultAbi,
        functionName: "addressToDeposit",
        args: [
          address ? address : account.address,
        ],
      },
      {
        address: LST_CONTRACT_ADDRESS,
        abi: lstokenAbi,
        functionName: "allowance",
        args: [
          address ? address : account.address,
          ZEKAE_VAULT_CONTRACT_ADDRESS,
        ],
      },
    ],
    config: address ? localConfig : config,
  });

  // extract the data from the read contracts hook
  const currentLstBalance = data?.[0]?.result as bigint | undefined;
  const depositAmount = data?.[1]?.result as bigint | undefined;
  const depositAllowance = data?.[2]?.result as bigint | undefined;

  // extract the amount value from the form
  const amount = form.watch("amount");

  // check if the amount is greater than the mint allowance
  const needsApprove = depositAllowance !== undefined && 
    amount ? 
    depositAllowance < parseUnits(amount, 18 as number) : 
    false;

  // useWriteContract hook to write contract
  const {
    data: hash,
    error,
    isPending,
    writeContractAsync,
  } = useWriteContract({
    config: address ? localConfig : config,
  });

  async function onDeposit(values: z.infer<typeof formSchema>) {
    // if the user has a sigpass wallet, and the token is not GLMR, approve the token
    if (address) {
      if (needsApprove) {
        writeContractAsync({
          account: await getSigpassWallet(),
          address: LST_CONTRACT_ADDRESS,
          abi: lstokenAbi,
          functionName: "approve",
          args: [ZEKAE_VAULT_CONTRACT_ADDRESS, parseUnits(values.amount, 18)],
        });
      } else {
        writeContractAsync({
          account: await getSigpassWallet(),
          address: ZEKAE_VAULT_CONTRACT_ADDRESS,
          abi: zekaeVaultAbi,
          functionName: "deposit",
          args: [parseUnits(values.amount, 18)],
        });
      }
    }

    // if the user does not have a sigpass wallet, and the token is not GLMR, mint the token
    if (!address) {
      if (needsApprove) {
        writeContractAsync({
          address: LST_CONTRACT_ADDRESS,
          abi: lstokenAbi,
          functionName: "approve",
          args: [ZEKAE_VAULT_CONTRACT_ADDRESS, parseUnits(values.amount, 18)],
        });
      } else {
        writeContractAsync({
          address: ZEKAE_VAULT_CONTRACT_ADDRESS,
          abi: zekaeVaultAbi,
          functionName: "deposit",
          args: [parseUnits(values.amount, 18)],
        });
      }
    }
  }

  async function onWithdraw(values: z.infer<typeof formSchema>) {
    // if the user has a sigpass wallet, and the token is not GLMR, approve the token
    if (address) {
      writeContractAsync({
        account: await getSigpassWallet(),
        address: ZEKAE_VAULT_CONTRACT_ADDRESS,
        abi: zekaeVaultAbi,
        functionName: "withdraw",
        args: [parseUnits(values.amount, 18)],
      });
    }

    // if the user does not have a sigpass wallet, and the token is not GLMR, mint the token
    if (!address) {
      writeContractAsync({
        address: ZEKAE_VAULT_CONTRACT_ADDRESS,
        abi: zekaeVaultAbi,
        functionName: "withdraw",
        args: [parseUnits(values.amount, 18)],
      });
    }
  }

  // Watch for transaction hash and open dialog/drawer when received
  useEffect(() => {
    if (hash) {
      setOpen(true);
    }
  }, [hash]);

  // useWaitForTransactionReceipt hook to wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
      config: address ? localConfig : config,
    });

  // when isConfirmed, refetch the balance of the address
  useEffect(() => {
    if (isConfirmed) {
      refetch();
    }
  }, [isConfirmed, refetch]);

  // Get the block explorer URL for the current chain using the config object
  function getBlockExplorerUrl(chainId: number | undefined): string | undefined {
    const chain = config.chains?.find(chain => chain.id === chainId);
    return chain?.blockExplorers?.default?.url || config.chains?.[0]?.blockExplorers?.default?.url;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4 border border-gray-200 rounded-lg p-4">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-2">
            <Vault className="w-10 h-10" />
            <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">Vault</h1>
          </div>
          <Button size="icon" onClick={() => refetch()}><RefreshCcw /></Button>
        </div>
        <p className="text-lg text-muted-foreground">
          You can deposit LST to mint zUSD
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold tracking-tight">Wallet</h2>
            {isFetching ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <p>{formatBalance(formatUnits(currentLstBalance || BigInt(0), 18))} LST</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold tracking-tight">Deposited</h2>
            {isFetching ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <p>{formatBalance(formatUnits(depositAmount || BigInt(0), 18))} LST</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 border border-gray-200 rounded-lg p-4">
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>
          <TabsContent value="deposit">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onDeposit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        {isDesktop ? (
                          <Input
                            type="number"
                            placeholder="10"
                            {...field}
                            required
                          />
                        ) : (
                          <Input
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*[.]?[0-9]*"
                            placeholder="10"
                            {...field}
                            required
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        Amount of LST to deposit.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row gap-2 items-center justify-between">
                  <h2>Token allowance</h2>
                  <div className="flex flex-row gap-2 items-center text-xs text-muted-foreground">
                    <HandCoins className="w-4 h-4" />{" "}
                    {isFetching ? (
                      <Skeleton className="h-6 w-32" />
                    ) : (
                      <p>{formatBalance(formatUnits(depositAllowance || BigInt(0), 18))} LST</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    {
                      isPending ? (
                        <Button type="submit" disabled className="w-full">
                          <LoaderCircle className="w-4 h-4 animate-spin" /> Confirm in
                          wallet...
                        </Button>
                      ) : needsApprove ? (
                        <Button type="submit" className="w-full">Approve</Button>
                      ) : (
                        <Button disabled className="w-full">Approve</Button>
                      )
                    }
                    {isPending ? (
                      <Button type="submit" disabled className="w-full">
                        <LoaderCircle className="w-4 h-4 animate-spin" /> Confirm in
                        wallet...
                      </Button>
                    ) : needsApprove ? (
                      <Button disabled className="w-full">
                        Deposit
                      </Button>
                    ) : (
                      <Button type="submit" className="w-full">
                        Deposit
                      </Button>
                    )}
                  </div>
                  {
                    // Desktop would be using dialog
                    isDesktop ? (
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            Transaction status <ChevronDown />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Transaction status</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            Follow the transaction status below.
                          </DialogDescription>
                          <div className="flex flex-col gap-2">
                            {hash ? (
                              <div className="flex flex-row gap-2 items-center">
                                <Hash className="w-4 h-4" />
                                Transaction Hash
                                <a
                                  className="flex flex-row gap-2 items-center underline underline-offset-4"
                                  href={`${getBlockExplorerUrl(chainId)}/tx/${hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {truncateHash(hash)}
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                                <CopyButton copyText={hash} />
                              </div>
                            ) : (
                              <div className="flex flex-row gap-2 items-center">
                                <Hash className="w-4 h-4" />
                                No transaction hash
                              </div>
                            )}
                            {!isPending && !isConfirmed && !isConfirming && (
                              <div className="flex flex-row gap-2 items-center">
                                <Ban className="w-4 h-4" /> No transaction submitted
                              </div>
                            )}
                            {isConfirming && (
                              <div className="flex flex-row gap-2 items-center text-yellow-500">
                                <LoaderCircle className="w-4 h-4 animate-spin" />{" "}
                                Waiting for confirmation...
                              </div>
                            )}
                            {isConfirmed && (
                              <div className="flex flex-row gap-2 items-center text-green-500">
                                <CircleCheck className="w-4 h-4" /> Transaction
                                confirmed!
                              </div>
                            )}
                            {error && (
                              <div className="flex flex-row gap-2 items-center text-red-500">
                                <X className="w-4 h-4" /> Error:{" "}
                                {(error as BaseError).shortMessage || error.message}
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Close</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      // Mobile would be using drawer
                      <Drawer open={open} onOpenChange={setOpen}>
                        <DrawerTrigger asChild>
                          <Button variant="outline" className="w-full">
                            Transaction status <ChevronDown />
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Transaction status</DrawerTitle>
                            <DrawerDescription>
                              Follow the transaction status below.
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="flex flex-col gap-2 p-4">
                            {hash ? (
                              <div className="flex flex-row gap-2 items-center">
                                <Hash className="w-4 h-4" />
                                Transaction Hash
                                <a
                                  className="flex flex-row gap-2 items-center underline underline-offset-4"
                                  href={`${getBlockExplorerUrl(chainId)}/tx/${hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {truncateHash(hash)}
                                  <ExternalLink className="w-4 h-4" />
                                  <CopyButton copyText={hash} />
                                </a>
                              </div>
                            ) : (
                              <div className="flex flex-row gap-2 items-center">
                                <Hash className="w-4 h-4" />
                                No transaction hash
                              </div>
                            )}
                            {!isPending && !isConfirmed && !isConfirming && (
                              <div className="flex flex-row gap-2 items-center">
                                <Ban className="w-4 h-4" /> No transaction submitted
                              </div>
                            )}
                            {isConfirming && (
                              <div className="flex flex-row gap-2 items-center text-yellow-500">
                                <LoaderCircle className="w-4 h-4 animate-spin" />{" "}
                                Waiting for confirmation...
                              </div>
                            )}
                            {isConfirmed && (
                              <div className="flex flex-row gap-2 items-center text-green-500">
                                <CircleCheck className="w-4 h-4" /> Transaction
                                confirmed!
                              </div>
                            )}
                            {error && (
                              <div className="flex flex-row gap-2 items-center text-red-500">
                                <X className="w-4 h-4" /> Error:{" "}
                                {(error as BaseError).shortMessage || error.message}
                              </div>
                            )}
                          </div>
                          <DrawerFooter>
                            <DrawerClose asChild>
                              <Button variant="outline">Close</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    )
                  }
                </div>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="withdraw">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onWithdraw)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        {isDesktop ? (
                          <Input
                            type="number"
                            placeholder="10"
                            {...field}
                            required
                          />
                        ) : (
                          <Input
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*[.]?[0-9]*"
                            placeholder="10"
                            {...field}
                            required
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        Amount of LST to withdraw.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    {
                      isPending ? (
                        <Button type="submit" disabled className="w-full">
                          <LoaderCircle className="w-4 h-4 animate-spin" /> Confirm in
                          wallet...
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={() => form.reset()} className="w-full">Clear</Button>
                      )
                    }
                    {isPending ? (
                      <Button type="submit" disabled className="w-full">
                        <LoaderCircle className="w-4 h-4 animate-spin" /> Confirm in
                        wallet...
                      </Button>
                    ) : (
                      <Button type="submit" className="w-full">
                        Withdraw
                      </Button>
                    )}
                  </div>
                  {
                    // Desktop would be using dialog
                    isDesktop ? (
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            Transaction status <ChevronDown />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Transaction status</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            Follow the transaction status below.
                          </DialogDescription>
                          <div className="flex flex-col gap-2">
                            {hash ? (
                              <div className="flex flex-row gap-2 items-center">
                                <Hash className="w-4 h-4" />
                                Transaction Hash
                                <a
                                  className="flex flex-row gap-2 items-center underline underline-offset-4"
                                  href={`${getBlockExplorerUrl(chainId)}/tx/${hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {truncateHash(hash)}
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                                <CopyButton copyText={hash} />
                              </div>
                            ) : (
                              <div className="flex flex-row gap-2 items-center">
                                <Hash className="w-4 h-4" />
                                No transaction hash
                              </div>
                            )}
                            {!isPending && !isConfirmed && !isConfirming && (
                              <div className="flex flex-row gap-2 items-center">
                                <Ban className="w-4 h-4" /> No transaction submitted
                              </div>
                            )}
                            {isConfirming && (
                              <div className="flex flex-row gap-2 items-center text-yellow-500">
                                <LoaderCircle className="w-4 h-4 animate-spin" />{" "}
                                Waiting for confirmation...
                              </div>
                            )}
                            {isConfirmed && (
                              <div className="flex flex-row gap-2 items-center text-green-500">
                                <CircleCheck className="w-4 h-4" /> Transaction
                                confirmed!
                              </div>
                            )}
                            {error && (
                              <div className="flex flex-row gap-2 items-center text-red-500">
                                <X className="w-4 h-4" /> Error:{" "}
                                {(error as BaseError).shortMessage || error.message}
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Close</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      // Mobile would be using drawer
                      <Drawer open={open} onOpenChange={setOpen}>
                        <DrawerTrigger asChild>
                          <Button variant="outline" className="w-full">
                            Transaction status <ChevronDown />
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Transaction status</DrawerTitle>
                            <DrawerDescription>
                              Follow the transaction status below.
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="flex flex-col gap-2 p-4">
                            {hash ? (
                              <div className="flex flex-row gap-2 items-center">
                                <Hash className="w-4 h-4" />
                                Transaction Hash
                                <a
                                  className="flex flex-row gap-2 items-center underline underline-offset-4"
                                  href={`${getBlockExplorerUrl(chainId)}/tx/${hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {truncateHash(hash)}
                                  <ExternalLink className="w-4 h-4" />
                                  <CopyButton copyText={hash} />
                                </a>
                              </div>
                            ) : (
                              <div className="flex flex-row gap-2 items-center">
                                <Hash className="w-4 h-4" />
                                No transaction hash
                              </div>
                            )}
                            {!isPending && !isConfirmed && !isConfirming && (
                              <div className="flex flex-row gap-2 items-center">
                                <Ban className="w-4 h-4" /> No transaction submitted
                              </div>
                            )}
                            {isConfirming && (
                              <div className="flex flex-row gap-2 items-center text-yellow-500">
                                <LoaderCircle className="w-4 h-4 animate-spin" />{" "}
                                Waiting for confirmation...
                              </div>
                            )}
                            {isConfirmed && (
                              <div className="flex flex-row gap-2 items-center text-green-500">
                                <CircleCheck className="w-4 h-4" /> Transaction
                                confirmed!
                              </div>
                            )}
                            {error && (
                              <div className="flex flex-row gap-2 items-center text-red-500">
                                <X className="w-4 h-4" /> Error:{" "}
                                {(error as BaseError).shortMessage || error.message}
                              </div>
                            )}
                          </div>
                          <DrawerFooter>
                            <DrawerClose asChild>
                              <Button variant="outline">Close</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    )
                  }
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}