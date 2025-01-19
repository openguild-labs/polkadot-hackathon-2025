import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function NFTCard({ 
  nft, 
  onSell, 
  onBuy, 
  isOwner, 
  showSellButton 
}) {
  return (
    <Card className="overflow-hidden bg-gray-800 border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <CardContent className="p-0 relative">
        <Image 
          src={nft.image} 
          alt={nft.name} 
          width={300} 
          height={300} 
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110" 
        />
        {/* Level Badge */}
        <div className="absolute top-2 left-2 bg-blue-600/80 text-white px-2 py-1 rounded-full text-xs font-semibold">
          Level {nft.level}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4 bg-gray-850 space-y-3">
        <h3 className="text-lg font-semibold text-white mb-1">{nft.name}</h3>
        
        {/* NFT Details */}
        <div className="w-full space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Days:</span>
            <span className="text-gray-200">{nft.days}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Points:</span>
            <span className="text-gray-200">{nft.points}</span>
          </div>
        </div>

        {/* Price Information */}
        {nft.price ? (
          <p className="text-sm text-green-400 font-medium">{nft.price} ETH</p>
        ) : (
          <p className="text-sm text-gray-500">Not for sale</p>
        )}

        {/* Action Buttons */}
        <div className="flex w-full space-x-2 mt-2">
          {isOwner && showSellButton && (
            <Button 
              onClick={onSell} 
              variant="outline" 
              className="w-full text-white border-gray-700 hover:bg-gray-700"
            >
              Sell
            </Button>
          )}
          {!isOwner && nft.price !== null && (
            <Button 
              onClick={onBuy} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Buy
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}