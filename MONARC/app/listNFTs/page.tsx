'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useWeb3 } from '@/contexts/Web3Context'
import { DYNAMICNFT_CONTRACT_ADDRESS } from '@/config/addresses'
import { formatTokenId } from '@/utils/ipfsHashConverter'

const ListNFTPage = () => {
  const [nfts, setNfts] = useState<Array<{ tokenId: string; imageUrl: string }>>([])
  const [selectedNft, setSelectedNft] = useState<{ tokenId: string; imageUrl: string } | null>(null)
  const [isListed, setIsListed] = useState(false)
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { DynamicNFTContract, account, IpfsHashStorageContract, selectedNetwork } = useWeb3()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const getImageUrl = useCallback(async (tokenId: string) => {
    try {
      const ipfsHash = await IpfsHashStorageContract.methods.getIPFSHash(Number(tokenId)).call()
      return `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ipfsHash}`
    } catch (err) {
      console.error('Error converting tokenId to IPFS hash:', err)
      return ''
    }
  }, [IpfsHashStorageContract])

  const fetchUserNFTs = useCallback(async () => {
    if (!DynamicNFTContract || !account) return

    try {
      setLoading(true)
      const balance = Number(await DynamicNFTContract.methods.balanceOf(account).call())
      const userNftsPromises = Array(balance).fill(0).map(async (_, i) => {
        const tokenId = await DynamicNFTContract.methods.tokenOfOwnerByIndex(account, i).call()
        const imageUrl = await getImageUrl(tokenId.toString())
        return { 
          tokenId: tokenId.toString(), 
          imageUrl
        }
      })
      const userNfts = await Promise.all(userNftsPromises)
      setNfts(userNfts)
    } catch (err) {
      console.error('Error fetching user NFTs:', err)
    } finally {
      setLoading(false)
    }
  }, [DynamicNFTContract, account, getImageUrl])

  useEffect(() => {
    setMounted(true)
    if (DynamicNFTContract && account && selectedNetwork === 'SEPOLIA') {
      fetchUserNFTs()
    }
  }, [DynamicNFTContract, account, selectedNetwork, fetchUserNFTs])

  const handleSelectNFT = useCallback(async (nft: { tokenId: string; imageUrl: string }) => {
    setSelectedNft(nft)
    try {
      const isListed = await DynamicNFTContract.methods.isTokenListed(nft.tokenId).call()
      setIsListed(isListed)
    } catch (err) {
      console.error('Error checking NFT listing status:', err)
    }
  }, [DynamicNFTContract])

  const handleListNFT = useCallback(async () => {
    if (!selectedNft) return
    setLoading(true)
    try {
      await DynamicNFTContract.methods.listToken(selectedNft.tokenId, 1).send({ from: account })
      setSuccess('NFT listed successfully!')
      setIsListed(true)
    } catch (err) {
      console.error('Error listing NFT:', err)
    } finally {
      setLoading(false)
    }
  }, [DynamicNFTContract, selectedNft, account])

  const handleUnlistNFT = useCallback(async () => {
    if (!selectedNft) return
    setLoading(true)
    try {
      await DynamicNFTContract.methods.unlistToken(selectedNft.tokenId).send({ from: account })
      setSuccess('NFT unlisted successfully!')
      setIsListed(false)
    } catch (err) {
      console.error('Error unlisting NFT:', err)
    } finally {
      setLoading(false)
    }
  }, [DynamicNFTContract, selectedNft, account])

  if (!mounted) return null

  if (selectedNetwork !== 'SEPOLIA') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Wrong Network</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">Please switch to the Sepolia network to list or unlist your NFTs.</p>
            <Button className="w-full" onClick={() => window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xaa36a7' }]})}>
              Switch to Sepolia
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-gray-900/95 dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-2xl font-bold dark:text-white">List or Unlist Your NFTs</h1>
        </div>
      </header>

      <main className="flex-1 container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6).fill(0).map((_, index) => (
              <Card key={index} className="dark:bg-gray-800">
                <CardHeader>
                  <Skeleton className="h-4 w-[250px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[200px] w-full" />
                </CardContent>
              </Card>
            ))
          ) : nfts.length > 0 ? (
            nfts.map((nft) => (
              <Card
                key={nft.tokenId}
                className={`dark:bg-gray-800 transition-all hover:scale-105 cursor-pointer ${
                  selectedNft && selectedNft.tokenId === nft.tokenId
                    ? 'ring-2 ring-primary'
                    : ''
                }`}
                onClick={() => handleSelectNFT(nft)}
              >
                <CardHeader>
                  <CardTitle className="dark:text-white">
                    NFT #{formatTokenId(nft.tokenId)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                    <img
                      src={nft.imageUrl}
                      alt={`NFT #${formatTokenId(nft.tokenId)}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground dark:text-gray-400">
              No NFTs found. Mint some NFTs first!
            </p>
          )}
        </div>

        {selectedNft && (
          <Card className="mt-8 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Selected NFT: #{formatTokenId(selectedNft.tokenId)}
                <span className="text-xs text-gray-500 ml-2">
                  ({selectedNft.tokenId})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-24 overflow-hidden rounded-lg">
                  <img
                    src={selectedNft.imageUrl}
                    alt={`Selected NFT #${formatTokenId(selectedNft.tokenId)}`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="dark:text-gray-300">
                  Status: {isListed ? 'Listed' : 'Not Listed'}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              {!isListed ? (
                <Button
                  className="w-full"
                  onClick={handleListNFT}
                  disabled={loading}
                >
                  List on Kopli and Sepolia
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleUnlistNFT}
                  disabled={loading}
                >
                  Unlist from Kopli and Sepolia
                </Button>
              )}
            </CardFooter>
          </Card>
        )}

        {success && (
          <div className="mt-6 p-4 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded-md">
            {success}
          </div>
        )}

        <Card className="mt-8 dark:bg-gray-800">
          <CardContent>
            <p className="text-center text-muted-foreground pt-10 pb-6 font-bold text-xl dark:text-gray-400">
              Note: Listing or unlisting your NFTs will automatically update the listings on both the Kopli and Sepolia networks with REACTIVE NETWORK AUTOMATION.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default ListNFTPage