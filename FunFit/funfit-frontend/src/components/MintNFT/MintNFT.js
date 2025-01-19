"use client"
import React, { useEffect } from 'react';
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingAnimation } from "@/components/MintNFT/loading-animation"
import { ConfettiEffect } from "@/components/MintNFT/confetti-effect"
import Image from 'next/image'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { abi } from '@/abi/abi'
import Link from 'next/link'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useRouter } from 'next/navigation';

export default function MintNFTPage() {
  // const [isMinting, setIsMinting] = useState(false)
  const [nftName, setNftName] = useState('')
  // const [nftDescription, setNftDescription] = useState('')
  const [mintedNFT, setMintedNFT] = useState(null)
  const [avatarURL, setAvatarURL] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const { address } = useAccount();
  const { data: hash, writeContract, isPending } = useWriteContract()
  const { open } = useWeb3Modal();
  const router = useRouter();

  // Array of avatar image paths
  const avatarImages = [
    { url: '/avatar/bear1.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmcxerZCr21F1zN97NifdYfJjpNay8vpf17wkt9E2a3Ngo", rarity: 'common' },
    { url: '/avatar/bear2.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmNWTAK5M3GRx8R94NXsJA1n15GzkcrbmUA3t3gJyotNAw", rarity: 'rare' },
    { url: '/avatar/buffalo1.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmPfxSoDiwQX3Kb6UyEahKdP3UnyqHB6bcgrDJrY61v67X", rarity: 'uncommon' },
    { url: '/avatar/buffalo2.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmZ7C2jnE5T2WBRejhPExgitfwbQFpyVLo2zcXfamVpnbF", rarity: 'epic' },
    { url: '/avatar/cat1.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmZiV2bBF5fkvSfuS7PQi17MYqgquW4JXHgJp8XkvH59G8", rarity: 'common' },
    { url: '/avatar/cat2.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmRfDWaT8DmrrP2Vu4AQZfG88tdnS9VZ9vcusCUU4H68qc", rarity: 'rare' },
    { url: '/avatar/chicken1.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmYPZtv8KwiXu41oiXb7j6pi4mh8j95v7pb7rwLuNQPD2P", rarity: 'uncommon' },
    { url: '/avatar/chicken2.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmPUZfbL7XUZwooC1BtfLdfmnbbShiBS1dASC4duzc5Y6E", rarity: 'epic' },
    { url: '/avatar/pig1.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmNdouP39erhzRaEwy3qQf6yH6P8qQdezuZkdg2JLQjoyz", rarity: 'common' },
    { url: '/avatar/pig2.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmQybyAYpUHVjzTzAXJoJUm7MW7BdreDUims9Kmih2G4Lm", rarity: 'rare' },
    { url: '/avatar/tiger1.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmbnW2fdYPSiRAGSNu8JBUCJHjmy5rxSALmFEVQMwNSAWU", rarity: 'legendary' },
    { url: '/avatar/tiger2.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmcW93pTwXTRwjnnGF62ybNZuZnkFvpDLy1A9PPkZBcJ8p", rarity: 'legendary' },
  ];


  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleMint = async (e) => {
    e.preventDefault();
    setMintedNFT(null);
    setAvatarURL(null);
    // setIsMinting(true);

    // Select a random avatar
    const randomImage = avatarImages[Math.floor(Math.random() * avatarImages.length)];

    // Update the state with the selected avatar
    setMintedNFT(randomImage);
    console.log(mintedNFT);
    try {
      await writeContract({
        abi: abi,
        address: process.env.NEXT_PUBLIC_WEFIT_NFT,
        functionName: 'mintNFT',
        args: [nftName, address, randomImage.rarity, randomImage.link],
      });
    } catch (error) {
      console.error('Minting failed:', error);
      // setIsMinting(false);
    }
  };

  useEffect(() => {
    if (hash != null) {
      // Select a random image

      console.log(hash);
      setAvatarURL(mintedNFT.url);
      // setIsMinting(false);

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, hash);

  const rarityColors = {
    common: "bg-gray-400 text-black",
    uncommon: "bg-green-400 text-black",
    rare: "bg-blue-400 text-white",
    epic: "bg-purple-500 text-white",
    legendary: "bg-yellow-400 text-black",
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-2">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Mint Your NFT</CardTitle>
          <CardDescription>Enter a name for your new NFT and click mint!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMint}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="nftName">NFT Name</Label>
                <Input
                  id="nftName"
                  placeholder="Enter NFT name"
                  value={nftName}
                  onChange={(e) => setNftName(e.target.value)}
                  required
                />
              </div>
              {/* <div className="flex flex-col space-y-1.5">
                <Label htmlFor="nftName">NFT description</Label>
                <Input
                  id="nftDescription"
                  placeholder="Enter NFT description"
                  value={nftDescription}
                  onChange={(e) => setNftDescription(e.target.value)}
                  required
                />
              </div> */}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          {address != null ? (
            <Button
              type="submit"
              onClick={handleMint}
              disabled={isPending || !nftName.trim()}
              className="w-full"
            >
              {isPending ? (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingAnimation />
                  <span className="ml-2">Minting...</span>
                </motion.div>
              ) : isConfirming ? (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingAnimation />
                  <span className="ml-2">Confirming...</span>
                </motion.div>
              ) : (
                'Mint NFT'
              )}
            </Button>) : (
            <Button
              type="submit"
              onClick={() => open()}
              className="w-full"
            >
              Connect wallet
            </Button>
          )
          }

          <AnimatePresence>
            {avatarURL && isConfirmed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
                <p className="mb-4">Your NFT "{nftName}" has been minted successfully!</p>
                <div className="relative w-48 h-48 mx-auto border-4 border-white rounded-lg overflow-hidden">
                  <Image
                    src={mintedNFT.url}
                    alt={`Minted NFT: ${nftName}`}
                    layout="fill"
                    objectFit="cover"
                  />
                  {/* Rarity Badge */}
                  <div
                    className={`absolute top-2 right-2 px-2 py-1 rounded-lg ${rarityColors[mintedNFT.rarity] || "bg-black text-white"
                      }`}
                  >
                    {mintedNFT.rarity.toUpperCase()}
                  </div>
                </div>
              </motion.div>
            )}
            {hash != null && mintedNFT != null && (
              <div className="mt-4 flex justify-center">
                <Link
                  href={`${process.env.NEXT_PUBLIC_CHAIN_SCANER}/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="mx-auto">
                    View in Explorer
                  </Button>
                </Link>
                <Button variant="outline" className="mx-auto ml-2" onClick={() => router.push('/profile')}>
                  Go to profile
                </Button>
              </div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
      {showConfetti && <ConfettiEffect />}
    </div>
  )
}