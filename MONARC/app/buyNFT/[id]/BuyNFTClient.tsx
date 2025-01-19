'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useWeb3 } from '@/contexts/Web3Context'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { DollarSign, AlertCircle, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"

interface NFTDetails {
  id: string;
  title: string;
  price: string;
  priceSymbol: 'ETH' | 'REACT';
  owner: string;
  isListed: boolean;
  image: string;
}

interface WNFTListing {
  price: string;
  seller: string;
  isActive: boolean;
}

interface BuyNFTClientProps {
  id: number;
}

export default function BuyNFTClient({ id }: BuyNFTClientProps) {
  const router = useRouter()
  const { DynamicNFTContract, WNFTContract, ReactContract, account, web3, selectedNetwork, IpfsHashStorageContract } = useWeb3()
  const [nft, setNft] = useState<NFTDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [transactionPending, setTransactionPending] = useState<boolean>(false)
  const [userBalance, setUserBalance] = useState<string>('0')
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [reactToBuy, setReactToBuy] = useState<string>('0')

  const fetchNFTDetails = useCallback(async () => {
    if (!web3 || !id || !DynamicNFTContract || !WNFTContract || !IpfsHashStorageContract) return

    setLoading(true)
    setError(null)
    try {
      let nftDetails: NFTDetails | null = null

      if (selectedNetwork === 'SEPOLIA') {
        const owner = await DynamicNFTContract.methods.ownerOf(id).call()
        const isListed = await DynamicNFTContract.methods.isTokenListed(id).call()
        const listingPrice = await DynamicNFTContract.methods.tokenListingPrice(id).call()
        const ipfsHash = await IpfsHashStorageContract.methods.getIPFSHash(id).call()
        nftDetails = {
          id:String(id),
          title: `NFT #${id}`,
          price: web3.utils.fromWei(listingPrice, 'ether'),
          priceSymbol: 'ETH',
          owner,
          isListed,
          image: `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ipfsHash}`
        }
      } else if (selectedNetwork === 'KOPLI') {
        const listing: WNFTListing = await WNFTContract.methods.getListing(id).call()
        const ipfsHash = "QmZdDAvqRJxENdcbLERhxBepfTqWM7y1DdDKxKiWTjctRt"
        nftDetails = {
          id:String(id),
          title: `NFT #${id}`,
          price: web3.utils.fromWei(listing.price, 'ether'),
          priceSymbol: 'REACT',
          owner: listing.seller,
          isListed: listing.isActive,
          image: `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ipfsHash}`
        }
      } else {
        throw new Error("Unsupported network")
      }

      setNft(nftDetails)
    } catch (err) {
      console.error("Error fetching NFT details:", err)
      setError("Failed to fetch NFT details. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [DynamicNFTContract, WNFTContract, IpfsHashStorageContract, id, selectedNetwork, web3])

  const fetchUserBalance = useCallback(async () => {
    if (!web3 || !account || !ReactContract) return

    try {
      if (selectedNetwork === 'SEPOLIA') {
        const balance = await web3.eth.getBalance(account)
        setUserBalance(web3.utils.fromWei(balance, 'ether'))
      } else if (selectedNetwork === 'KOPLI') {
        const balance = await ReactContract.methods.balanceOf(account).call()
        setUserBalance(web3.utils.fromWei(balance, 'ether'))
      }
    } catch (err) {
      console.error("Error fetching user balance:", err)
    }
  }, [ReactContract, account, selectedNetwork, web3])

  const checkApproval = useCallback(async () => {
    if (!ReactContract || !WNFTContract || !account || !web3 || !nft || selectedNetwork !== 'KOPLI') return

    try {
      const allowance = await ReactContract.methods.allowance(account, WNFTContract.options.address).call()
      const priceInWei = web3.utils.toWei(nft.price, 'ether')
      setIsApproved(BigInt(allowance) >= BigInt(priceInWei))
    } catch (err) {
      console.error("Error checking approval:", err)
    }
  }, [ReactContract, WNFTContract, account, nft, selectedNetwork, web3])

  useEffect(() => {
    if (account && id) {
      fetchNFTDetails()
      fetchUserBalance()
    }
  }, [account, id, fetchNFTDetails, fetchUserBalance])

  useEffect(() => {
    if (selectedNetwork === 'KOPLI' && nft) {
      checkApproval()
    }
  }, [selectedNetwork, nft, checkApproval])

  const handleApprove = async () => {
    if (!ReactContract || !WNFTContract || !account || !web3 || !nft) return

    setTransactionPending(true)
    setError(null)
    try {
      await ReactContract.methods.approve(
        WNFTContract.options.address,
        web3.utils.toWei(nft.price, 'ether')
      ).send({ from: account })
      setIsApproved(true)
    } catch (err) {
      console.error("Error during approval:", err)
      setError("Approval failed. Please try again.")
    } finally {
      setTransactionPending(false)
    }
  }

  const handlePurchase = async () => {
    if (!web3 || !account || !nft || !DynamicNFTContract || !WNFTContract) return

    setTransactionPending(true)
    setError(null)
    try {
      if (selectedNetwork === 'SEPOLIA') {
        await DynamicNFTContract.methods.purchase(nft.id).send({
          from: account,
          value: web3.utils.toWei(nft.price, 'ether')
        })
      } else if (selectedNetwork === 'KOPLI') {
        await WNFTContract.methods.lockTokens(nft.id).send({ from: account })
      } else {
        throw new Error("Unsupported network")
      }
      router.push('/collections')
    } catch (err) {
      console.error("Error during purchase:", err)
      setError("Transaction failed. Please try again.")
    } finally {
      setTransactionPending(false)
    }
  }

  const handleBuyReact = async () => {
    if (!web3 || !account || !ReactContract) return

    setTransactionPending(true)
    setError(null)
    try {
      const amountInWei = web3.utils.toWei(reactToBuy, 'ether')
      await ReactContract.methods.mint().send({
        from: account,
        value: amountInWei
      })
      await fetchUserBalance()
      setReactToBuy('0')
    } catch (err) {
      console.error("Error buying REACT:", err)
      setError("Failed to buy REACT. Please try again.")
    } finally {
      setTransactionPending(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!nft) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{nft.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img src={nft.image} alt={nft.title} className="w-full h-auto rounded-lg shadow-lg" />
            </div>
            <div className="space-y-4">
              <div>
                <Label>Price</Label>
                <div className="text-2xl font-bold flex items-center">
                  <DollarSign className="h-6 w-6 mr-1" />
                  {nft.price} {nft.priceSymbol}
                </div>
              </div>
              <div>
                <Label>Owner</Label>
                <div>{nft.owner}</div>
              </div>
              <div>
                <Label>Your Balance</Label>
                <div>{parseFloat(userBalance).toFixed(4)} {nft.priceSymbol}</div>
              </div>
              {parseFloat(userBalance) < parseFloat(nft.price) && selectedNetwork === 'KOPLI' && (
                <div className="space-y-2">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Insufficient Balance</AlertTitle>
                    <AlertDescription>
                      You don't have enough REACT to purchase this NFT. You can buy more REACT below.
                    </AlertDescription>
                  </Alert>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={reactToBuy}
                      onChange={(e) => setReactToBuy(e.target.value)}
                      placeholder="Amount of REACT to buy"
                    />
                    <Button onClick={handleBuyReact} disabled={transactionPending || parseFloat(reactToBuy) <= 0}>
                      Buy REACT
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Rate: 0.1 ETH = 1,000,000 REACT
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {selectedNetwork === 'KOPLI' && !isApproved && (
            <div className="w-full">
              <Button 
                onClick={handleApprove} 
                disabled={transactionPending}
                className="w-full mb-2"
              >
                {transactionPending ? 'Processing...' : `Approve ${nft.price} ${nft.priceSymbol}`}
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground inline-block ml-2" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Approving allows the contract to use your REACT tokens for this purchase only. This step is required before buying on the Kopli network.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          <Button 
            onClick={handlePurchase} 
            disabled={!nft.isListed || parseFloat(userBalance) < parseFloat(nft.price) || transactionPending || (selectedNetwork === 'KOPLI' && !isApproved)}
            className="w-full"
          >
            {transactionPending ? 'Processing...' : `Buy for ${nft.price} ${nft.priceSymbol}`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}