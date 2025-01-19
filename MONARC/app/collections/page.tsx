'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronDown, Grid, List, Moon, Search, Sun, Info } from 'lucide-react'
import { useWeb3 } from '@/contexts/Web3Context'
import { DYNAMICNFT_CONTRACT_ADDRESS } from '@/config/addresses'
import { formatTokenId } from '@/utils/ipfsHashConverter'

const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

interface NFT {
  id: string
  title: string
  price: string
  priceSymbol: string
  royalty: string
  creator: string
  owner: string
  image: string
  network: string
}

interface Collection {
  id: string
  name: string
  items: number
  volume: number
  floorPrice: number
}

export default function Marketplace() {
  const router = useRouter()
  const { DynamicNFTContract, RoyaltyContract, MonitorContract, ReactContract, WNFTContract, account, web3, selectedNetwork, IpfsHashStorageContract } = useWeb3()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2])
  const [nfts, setNfts] = useState<NFT[]>([])
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [userBalance, setUserBalance] = useState<string>('0')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState<boolean>(false)

 

  const fetchNFTs = useCallback(async () => {
    setLoading(true)
    try {
      const fetchedNFTs: NFT[] = []
      if (selectedNetwork === 'SEPOLIA') {
        const totalSupply = await DynamicNFTContract.methods.totalSupply().call()
        for (let i = 0; i < totalSupply; i++) {
          const tokenId = await DynamicNFTContract.methods.tokenByIndex(i).call()
          const isListed = await DynamicNFTContract.methods.isTokenListed(tokenId).call()
          if (isListed) {
            const owner = await DynamicNFTContract.methods.ownerOf(tokenId).call()
            const royaltyInfo = await RoyaltyContract.methods.getRoyaltyInfo(DynamicNFTContract.options.address, tokenId).call()
            const listingPrice = await DynamicNFTContract.methods.tokenListingPrice(tokenId).call()
            const ipfshash = await IpfsHashStorageContract.methods.getIPFSHash(tokenId).call()
            if (owner !== DYNAMICNFT_CONTRACT_ADDRESS) {
              fetchedNFTs.push({
                id: tokenId,
                title: `NFT #${formatTokenId(tokenId)}`,
                price: web3?.utils.fromWei(listingPrice, 'ether') || '0',
                priceSymbol: 'ETH',
                royalty: royaltyInfo.beneficiary !== '0x0000000000000000000000000000000000000000' ? `${Number(royaltyInfo.baseRate) / 100}%` : 'N/A',
                creator: royaltyInfo.beneficiary,
                owner: owner,
                image: `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ipfshash}`,
                network: 'SEPOLIA'
              })
            }
          }
        }
      }
      setNfts(fetchedNFTs)
      setFilteredNfts(fetchedNFTs)
      
      const groupedCollections: { [key: string]: Collection } = fetchedNFTs.reduce((acc, nft) => {
        if (nft.creator === '0x0000000000000000000000000000000000000000') {
          nft.creator = nft.owner
        }
        const priceAsNumber = parseFloat(nft.price)
        if (!acc[nft.creator]) {
          acc[nft.creator] = {
            id: nft.creator,
            name: `Collection by ${formatAddress(nft.creator)}`,
            items: 0,
            volume: 0,
            floorPrice: Infinity
          }
        }
        acc[nft.creator].items++
        acc[nft.creator].volume += priceAsNumber
        acc[nft.creator].floorPrice = Math.min(acc[nft.creator].floorPrice, priceAsNumber)
        return acc
      }, {} as { [key: string]: Collection })

      setCollections(Object.values(groupedCollections))
    } catch (err) {
      console.error("Error fetching NFTs:", err)
    } finally {
      setLoading(false)
    }
  }, [DynamicNFTContract, RoyaltyContract, IpfsHashStorageContract, web3, selectedNetwork])

  const handleBuyNow = (nft: NFT) => {
    router.push(`/buyNFT/${nft.id}`)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleCollectionFilter = (collectionId: string) => {
    setSelectedCollection(collectionId === selectedCollection ? null : collectionId)
  }

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }
  useEffect(() => {
    setMounted(true)
    fetchNFTs()
  }, [fetchNFTs])

  const filteredAndSearchedNfts = useMemo(() => {
    return filteredNfts.filter(nft => 
      nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (nft.creator && nft.creator.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [filteredNfts, searchTerm])

  useEffect(() => {
    const filtered = nfts.filter(nft => {
      const priceInEther = parseFloat(nft.price)
      return priceInEther >= priceRange[0] && priceInEther <= priceRange[1] &&
             (!selectedCollection || nft.creator === selectedCollection)
    })
    setFilteredNfts(filtered)
  }, [nfts, priceRange, selectedCollection])

  if (!mounted) return null

  if (selectedNetwork !== 'SEPOLIA') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Wrong Network</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">Please switch to the Sepolia network to view the Marketplace.</p>
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
          <div className="flex items-center flex-1">
            <Input
              type="search"
              placeholder="Search NFTs..."
              className="w-full max-w-sm mr-4"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium dark:text-gray-200">
              Balance: {parseFloat(userBalance).toFixed(4)} ETH
            </p>
            <Button variant="ghost" size="icon" onClick={() => setViewMode('grid')}>
              <Grid className={`h-4 w-4 ${viewMode === 'grid' ? 'text-primary' : 'text-muted-foreground'}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setViewMode('list')}>
              <List className={`h-4 w-4 ${viewMode === 'list' ? 'text-primary' : 'text-muted-foreground'}`} />
            </Button>
            
          </div>
        </div>
      </header>

      <div className="flex-1 container px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 space-y-6">
            <div>
              <h3 className="font-semibold mb-2 dark:text-gray-200">Price Range</h3>
              <Slider
                min={0.01}
                max={2}
                step={0.01}
                value={priceRange}
                onValueChange={handlePriceRangeChange}
              />
              <div className="flex justify-between mt-2 dark:text-gray-300">
                <span>{priceRange[0]} ETH</span>
                <span>{priceRange[1]} ETH</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 dark:text-gray-200">Collections</h3>
              {collections.map((collection) => (
                <div key={collection.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`collection-${collection.id}`}
                    checked={selectedCollection === collection.id}
                    onCheckedChange={() => handleCollectionFilter(collection.id)}
                  />
                  <Label htmlFor={`collection-${collection.id}`} className="dark:text-gray-300">{collection.name}</Label>
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={() => {
              setPriceRange([0.01, 2])
              setSelectedCollection(null)
              setSearchTerm('')
            }}>
              Clear All Filters
            </Button>
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg dark:text-white">Loading NFTs...</p>
              </div>
            ) : (
              <>
                <div className="mb-8 overflow-x-auto">
                  <div className="inline-flex min-w-full">
                    {collections.map((collection) => (
                      <Card key={collection.id} className="w-72 mr-4 shrink-0 dark:bg-gray-800">
                        <CardHeader>
                          <CardTitle className="dark:text-gray-100">{collection.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-2 text-sm dark:text-gray-300">
                            <div>Volume:</div>
                            <div className="font-semibold">{collection.volume.toFixed(2)} ETH</div>
                            <div>Floor Price:</div>
                            <div className="font-semibold">{collection.floorPrice.toFixed(2)} ETH</div>
                            <div>Items:</div>
                            <div className="font-semibold">{collection.items}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {filteredAndSearchedNfts.map((nft) => (
                    <Card key={nft.id} className={`${viewMode === 'list' ? 'flex' : ''} dark:bg-gray-800`}>
                      <div className={viewMode === 'list' ? 'w-1/3' : ''}>
                        <img
                          src={nft.image}
                          alt={nft.title}
                          className="w-full h-auto object-cover aspect-square rounded-t-lg"
                        />
                      </div>
                      <div className={viewMode === 'list' ? 'w-2/3' : ''}>
                        <CardHeader>
                          <CardTitle className="dark:text-gray-100">{nft.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2 dark:text-gray-400">
                            Creator: {nft.creator === '0x0000000000000000000000000000000000000000' ? 'N/A' : formatAddress(nft.creator)}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2 dark:text-gray-400">Owner: {formatAddress(nft.owner)}</p>
                          <p className="font-semibold dark:text-gray-200">Price: {nft.price} {nft.priceSymbol}</p>
                          <div className="flex items-center">
                            <p className="text-sm dark:text-gray-300 mr-1">Royalty: {nft.royalty}</p>
                            {nft.royalty === 'N/A' && (
                              <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>This NFT has no royalty configuration</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <p className="text-sm dark:text-gray-300">Network: {nft.network}</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" onClick={() => handleBuyNow(nft)}>Buy Now</Button>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  </div>
)
}