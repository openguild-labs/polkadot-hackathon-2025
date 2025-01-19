"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Address as EvmAddress,
} from "viem";
// evm
import { mnemonicToAccount } from 'viem/accounts'
// polkadot
import { Keyring } from '@polkadot/keyring';
// sui
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
// solana
import { derivePath } from 'ed25519-hd-key';
import { createKeyPairFromPrivateKeyBytes, getAddressFromPublicKey } from '@solana/web3.js';
import { install } from '@solana/webcrypto-ed25519-polyfill';
install();
// bip39
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

// import slip10 from 'micro-key-producer/slip10.js';
// import bs58 from 'bs58'
// import { getPublicKey, etc } from '@noble/ed25519';
// import { sha512 } from "@noble/hashes/sha512";
import { cn } from "@/lib/utils"
import Image from "next/image";
import WalletCopyButton from "./wallet-copy-button";
import {
  Send,
  Download,
  LoaderPinwheel,
  KeyRound,
  Puzzle,
  Settings,
  Pencil,
  HandCoins,
  ChartPie,
  Rocket,
  Loader2,
  DollarSign,
  Binary
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils'
import { getOrThrow, createOrThrow, checkBrowserWebAuthnSupport } from "@/lib/sigpass";
import { Skeleton } from "@/components/ui/skeleton";
import {
  truncateAddress,
} from "@/lib/utils";
import { AVAILABLE_NETWORKS } from "@/lib/chains";


// create the atom states
export const evmAddressAtom = atom<EvmAddress | null>(null);
export const polkadotAddressAtom = atom<string | null>(null);
export const suiAddressAtom = atom<string | null>(null);
export const solanaAddressAtom = atom<string | null>(null);
export const availableNetworksAtom = atomWithStorage<string[] | null>("AVAILABLE_NETWORKS", AVAILABLE_NETWORKS); 

export default function WalletManagement() {

  // Get the toast function from the useToast hook.
  const { toast } = useToast();

  // Create the atom state for address and network
  const [evmAddress, setEvmAddress] = useAtom(evmAddressAtom);
  const [solanaAddress, setSolanaAddress] = useAtom(solanaAddressAtom);
  const [polkadotAddress, setPolkadotAddress] = useAtom(polkadotAddressAtom);
  const [suiAddress, setSuiAddress] = useAtom(suiAddressAtom);
  const [availableNetworks, setAvailableNetworks] = useAtom(availableNetworksAtom);
  
  // State for create dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Create the state variables for the wallet management
  const [createWalletButtonActive, setCreateWalletButtonActive] = useState(true);

  // Create Wallet button loading state
  const [createWalletButtonLoading, setCreateWalletButtonLoading] = useState(false);

  // Load Wallet button loading state
  const [loadWalletButtonLoading, setLoadWalletButtonLoading] = useState(false);

  // Wallet storage loading state
  const [loadingWalletStorage, setLoadingWalletStorage] = useState(true);

  // profile states
  const [walletName, setWalletName] = useState("");
  const [walletIcon, setWalletIcon] = useState("/default-profile.svg");

  // carousel
  const [api, setApi] = useState<any>()
  const [current, setCurrent] = useState(0)

  // carousel state
  useEffect(() => {
    if (!api) {
      return
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
    const GMGN_WALLET = localStorage.getItem("gmgn-wallet");
    if (GMGN_WALLET) {
      const wallet = JSON.parse(GMGN_WALLET);
      setWalletName(wallet.username);
      setWalletIcon(wallet.icon);
      if (wallet.status === "created") {
        setCreateWalletButtonActive(false);
        setLoadingWalletStorage(false);
      }
    } else {
      setLoadingWalletStorage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  async function getWallet() {
    setLoadWalletButtonLoading(true);
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
    if (!bytes) {
      setLoadWalletButtonLoading(false);
      toast({
        variant: "destructive",
        title: "Cancelled loading wallet!",
        description: "Please try again if this was not intended.",
      });
      return;
    }
    const mnemonicPhrase = bip39.entropyToMnemonic(bytes, wordlist);
    // const privateKey = fromBytes(bytes, "hex");
    if (mnemonicPhrase) {
      setCreateWalletButtonActive(false);
      // const account = privateKeyToAccount(privateKey as Address);
      // derive the evm account from mnemonic
      const evmAccount = mnemonicToAccount(mnemonicPhrase,
        {
          accountIndex: 0,
          addressIndex: 0,
        }
      );
      setEvmAddress(evmAccount.address);

      //derive the polkadot account from mnemonic
      const keyring = new Keyring();
      const polkadotKeyPair = keyring.addFromUri(mnemonicPhrase);
      keyring.setSS58Format(0);
      setPolkadotAddress(polkadotKeyPair.address);

      // derive the solana account from mnemonic
      const solanaSeed = await bip39.mnemonicToSeed(mnemonicPhrase); // turn mnemonic into seed
      const solanaSeedBuffer = Buffer.from(solanaSeed).toString('hex'); // turn seed into buffer
      const path44Change = `m/44'/501'/0'/0'`; // solana derivation path
      const derivedSeed = derivePath(path44Change, solanaSeedBuffer).key; // derive the seed from path
      const solanaKeyPair = await createKeyPairFromPrivateKeyBytes(derivedSeed); // create keypair from seed
      const solanaAddress = await getAddressFromPublicKey(solanaKeyPair.publicKey); // get the address from the public key
      setSolanaAddress(solanaAddress);

      // derive the sui account from mnemonic
      const suiKeyPair = Ed25519Keypair.deriveKeypair(mnemonicPhrase);
      setSuiAddress(suiKeyPair.getPublicKey().toSuiAddress());
      toast({
        className: "bg-green-600 text-white",
        title: "Wallet loaded!",
        description: "You are ready to use your wallet.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Wallet load failed!",
        description: "Uh oh! Something went wrong. please try again.",
      });
    }
    setLoadWalletButtonLoading(false);
  }

  async function createWallet() {
    setCreateWalletButtonLoading(true);
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    /**
     * Store the private key into authenticated storage
     */
    const handle = await createOrThrow("gmgn-wallet", bytes);
    /**
     * Store the handle to the private key into some unauthenticated storage
     */
    if (!handle) {
      setLoadWalletButtonLoading(false);
      toast({
        variant: "destructive",
        title: "Wallet creation failed!",
        description: "Uh oh! Something went wrong. please try again.",
      });
      return;
    }
    const cache = await caches.open("gmgn-storage");
    const request = new Request("gmgn-wallet");
    const response = new Response(handle);
    await cache.put(request, response);
    const GMGN_WALLET_STORAGE = {
      status: "created",
      icon: "/default-profile.svg",
      username: walletName,
    };
    localStorage.setItem("gmgn-wallet", JSON.stringify(GMGN_WALLET_STORAGE));
    setCreateWalletButtonActive(false);
    if (handle) {
      toast({
        className: "bg-blue-600 text-white",
        title: "Wallet created!",
        description: "Please click Load wallet from Passkey to begin.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Wallet creation failed!",
        description: "Uh oh! Something went wrong. please try again.",
      });
    }
    setCreateWalletButtonLoading(false);
    setIsCreateDialogOpen(false);
  }


  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row justify-between items-center">
        <Link href="/">
          <Image
            src="/gmgn-logo.svg"
            alt="gmgn logo"
            width={40}
            height={40}
            className="rounded-md"
          />
        </Link>
        <div className="flex flex-row items-center gap-4">
          {evmAddress && polkadotAddress ? (
            <Button asChild size="icon" variant="outline" className="bg-[#3396ff]">
              <Link href="/connect">
                <Image
                  src="/walletconnect.svg"
                  alt="walletconnect logo"
                  width={24}
                  height={24}
                />
              </Link>
            </Button>
          ) : (
            <Button size="icon" disabled variant="outline" className="bg-[#3396ff]">
              <Image
                src="/walletconnect.svg"
                alt="walletconnect logo"
                width={24}
                height={24}
              />
            </Button>
          )}
          <Button asChild size="icon" variant="outline">
            <Link href="/settings">
              <Settings className="w-6 h-6" />
            </Link>
          </Button>
        </div>
      </div>
      {createWalletButtonActive === false &&
      loadingWalletStorage === false &&
      evmAddress ? (
        <div className="flex flex-col gap-2 h-[135px] bg-gradient-to-l from-yellow-200 via-lime-400 to-green-400 text-[#163300] border-primary border-2 rounded-md p-4">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <Link href="/profile">
                <div className="flex flex-row gap-2 items-start">
                  <Image
                    src={walletIcon ? walletIcon : "/default-profile.svg"}
                    alt="avatar"
                    width={50}
                    height={50}
                    className="rounded-full border-primary border-2"
                  />
                  <div className="flex flex-row gap-2 items-center">
                    <p className="text-lg font-semibold">{walletName ? walletName : "---"}</p>
                    <Pencil className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center justify-end">
            <Drawer>
              <DrawerTrigger asChild>
                {
                  !createWalletButtonActive && evmAddress ? (
                    <Button size="icon">
                      <Binary className="h-6 w-6" />
                    </Button>
                  ) : (
                    <Button size="icon" disabled>
                      <Binary className="h-6 w-6" />
                    </Button>
                  )
                }
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Addresses</DrawerTitle>
                  <DrawerDescription>Select the address you need</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-2 px-4 h-[350px]">
                  <div className="flex flex-row gap-0 items-center border-2 border-primary">
                    <div className="flex flex-row gap-2 items-center w-[120px] bg-primary text-secondary p-2">
                      <Image
                        src="/logos/evm.svg"
                        alt="evm logo"
                        width={24}
                        height={24}
                      />
                      <p>
                        EVM
                      </p>
                    </div>
                    <WalletCopyButton
                      copyText={evmAddress}
                      buttonTitle={truncateAddress(evmAddress as EvmAddress, 10)}
                    />
                  </div>
                  <div className="flex flex-row gap-0 items-center border-2 border-primary">
                    <div className="flex flex-row gap-2 items-center w-[120px] bg-primary text-secondary p-2">
                      <Image
                        src="/logos/sol.svg"
                        alt="solana logo"
                        width={24}
                        height={24}
                      />
                      <p>
                        Solana
                      </p>
                    </div>
                    <WalletCopyButton
                      copyText={solanaAddress}
                      buttonTitle={truncateAddress(solanaAddress, 10)}
                    />
                  </div>
                  <div className="flex flex-row gap-0 items-center border-2 border-primary">
                    <div className="flex flex-row gap-2 items-center w-[120px] bg-primary text-secondary p-2">
                      <Image
                        src="/logos/polkadot.svg"
                        alt="polkadot logo"
                        width={24}
                        height={24}
                      />
                      <p>
                        Polkadot
                      </p>
                    </div>
                    <WalletCopyButton
                      copyText={polkadotAddress}
                      buttonTitle={truncateAddress(polkadotAddress, 10)}
                    />
                  </div>
                  <div className="flex flex-row gap-0 items-center border-2 border-primary">
                    <div className="flex flex-row gap-2 items-center w-[120px] bg-primary text-secondary p-2">
                      <Image
                        src="/logos/sui.svg"
                        alt="sui logo"
                        width={24}
                        height={24}
                      />
                      <p>
                        Sui
                      </p>
                    </div>
                    <WalletCopyButton
                      copyText={suiAddress}
                      buttonTitle={truncateAddress(suiAddress, 10)}
                    />
                  </div>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline" className="mb-16">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Button asChild>
              <Link
                href="/portfolio"
              >
                <ChartPie className="h-4 w-4 mr-2" />
                Portfolio
              </Link>
            </Button>
          </div>
        </div>
      ) : createWalletButtonActive === true &&
        loadingWalletStorage === false ? (
        <div className="flex flex-col gap-2 bg-[#9FE870] border-primary border-2 h-[135px] items-center justify-center rounded-md p-4">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <KeyRound className="mr-2 h-4 w-4" />
                Create wallet with Passkey
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="flex flex-col items-center">
                <DialogTitle>Create</DialogTitle>
                <DialogDescription>
                  Enter any username to create a wallet
                </DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
                  placeholder="johnsmith"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                />
              </div>
              <DialogFooter>
                {
                  createWalletButtonLoading ? (
                    <Button className="w-[150px]" disabled>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Please wait
                    </Button>
                  ) : (
                    <Button className="w-[150px]" onClick={createWallet}>
                      Create
                    </Button>
                  )
                }
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : createWalletButtonActive === false &&
        loadingWalletStorage === false &&
        !evmAddress ? (
        <div className="flex flex-col gap-2 bg-[#9FE870] border-primary border-2 h-[135px] items-center justify-center rounded-md p-4">
          {
            loadWalletButtonLoading ? (
              <Button className="w-[230px]" disabled>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="w-[230px]" onClick={getWallet}>
                <LoaderPinwheel className="mr-2 h-4 w-4" />
                Load wallet from Passkey
              </Button>
            )
          }
        </div>
      ) : (
        <Skeleton className="h-[135px] rounded-md" />
      )}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-2">
          {!createWalletButtonActive && evmAddress ? (
            <Button className="h-[80px]" asChild>
              <Link
                href="/send"
              >
                <div className="flex flex-col gap-2 items-center">
                  <Send className="h-6 w-6" />
                  <p>Send</p>
                </div>
              </Link>
            </Button>
          ) : (
            <Button className="h-[80px]" disabled>
              <div className="flex flex-col gap-2 items-center">
                <Send className="h-6 w-6" />
                <p>Send</p>
              </div>
            </Button>
          )}
          {!createWalletButtonActive && evmAddress ? (
            <Button className="h-[80px]" asChild>
              <Link
                href="/receive"
              >
                <div className="flex flex-col gap-2 items-center">
                  <Download className="h-6 w-6" />
                  <p>Receive</p>
                </div>
              </Link>
            </Button>
          ) : (
            <Button className="h-[80px]" disabled>
              <div className="flex flex-col gap-2 items-center">
                <Download className="h-6 w-6" />
                <p>Receive</p>
              </div>
            </Button>
          )}
          {!createWalletButtonActive && evmAddress ? (
            <Button className="h-[80px]" asChild>
              <Link href="/transactions">
                <div className="flex flex-col gap-2 items-center">
                  <DollarSign className="h-6 w-6" />
                  <p>Buy</p>
                </div>
              </Link>
            </Button>
          ) : (
            <Button className="h-[80px]" disabled>
              <div className="flex flex-col gap-2 items-center">
                <DollarSign className="h-6 w-6" />
                <p>Buy</p>
              </div>
            </Button>
          )}
          {!createWalletButtonActive && evmAddress ? (
            <Button className="h-[80px]" asChild>
              <Link href="/pay">
                <div className="flex flex-col gap-2 items-center">
                  <HandCoins className="h-6 w-6" />
                  <p>Pay</p>
                </div>
              </Link>
            </Button>
          ) : (
            <Button className="h-[80px]" disabled>
              <div className="flex flex-col gap-2 items-center">
                <HandCoins className="h-6 w-6" />
                <p>Pay</p>
              </div>
            </Button>
          )}
        </div>
        {!createWalletButtonActive && evmAddress ? (
          <Carousel setApi={setApi}>
            <CarouselContent>
              <CarouselItem>
                <Link href="/onboard">
                  <div className="w-full h-[60px] mt-4 rounded-md py-2 px-4 bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))] text-secondary">
                    <div className="flex flex-row gap-2 text-lg h-full w-full items-center">
                      <div className="rounded-md h-[40px] w-[40px]">
                        <Rocket className="w-full h-full" />
                      </div>
                      <div className="flex flex-col text-sm">
                        Get onboarded and familiarize yourself onchain with zero risk
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
              <CarouselItem>
                <a href="https://docs.gmgn.app/getting-started">
                  <div className="w-full h-[60px] mt-4 rounded-md py-2 px-4 bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))] text-secondary">
                    <div className="flex flex-row gap-2 text-lg h-full w-full items-center">
                      <div className="rounded-md h-[40px] w-[40px]">
                        <Puzzle className="w-full h-full" />
                      </div>
                      <div className="flex flex-col text-sm">
                        Learn about GM GN Wallet and unlock rewards and opportunities
                      </div>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1].map((index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 bg-gray-300",
                    current === index 
                      ? "w-8 bg-primary" 
                      : "w-2 hover:bg-primary/50"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </Carousel>
        ) : (
          <Carousel setApi={setApi}>
            <CarouselContent>
              <CarouselItem>
                <div className="w-full h-[60px] mt-4 rounded-md py-2 px-4 bg-primary opacity-50 text-secondary">
                  <div className="flex flex-row gap-2 text-lg h-full w-full items-center">
                    <div className="rounded-md h-[40px] w-[40px]">
                      <Rocket className="w-full h-full" />
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      Get onboarded and familiarize yourself onchain with zero risk
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="w-full h-[60px] mt-4 rounded-md py-2 px-4 bg-primary opacity-50 text-secondary">
                  <div className="flex flex-row gap-2 text-lg h-full w-full items-center">
                    <div className="rounded-md h-[40px] w-[40px]">
                      <Puzzle className="w-full h-full" />
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      Learn about GM GN Wallet and unlock rewards and opportunities
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1].map((index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 bg-gray-300",
                    current === index 
                      ? "w-8 bg-primary" 
                      : "w-2 hover:bg-primary/50"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </Carousel>
        )}
      </div>
    </div>
  );
}
