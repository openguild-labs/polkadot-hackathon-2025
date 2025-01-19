import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress";
import NFTSlider from "./nft-slider"
import { Dumbbell, Flame, Coins, PersonStanding, PackageOpen } from 'lucide-react'
import { useAccount, useBalance, useReadContract } from 'wagmi'
import { abi } from '@/abi/abi'
import { Skeleton } from "@/components/ui/skeleton";
import ETHIcon from "@/asset/icon/ETHIcon";

// Default fallback profile in case no NFT details are available
const defaultProfile = {
  avatar: "/avatar/buffalo1.png",
  title: "Cardano Fitness Enthusiast",
  subtitle: "Pushing limits, one block at a time.",
  description: "Blockchain developer by day, fitness junkie by night. Leveraging Cardano for a healthier future."
}

export default function ProfilePage() {
  const [userStats, setUserStats] = useState({
    level: 10,
    points: 1567,
    lastUpdateDay: 68,
    level: 1,
    currentNFT: null
  })

  const [myBalance, SetMyBalance] = useState(0);
  const [currentProfile, setCurrentProfile] = useState(defaultProfile);
  const [isNFTSelected, setIsNFTSelected] = useState(false);
  const { address } = useAccount()

  const { data: balance } = useBalance({
    address: address
  })

  useEffect(() => {
    SetMyBalance(balance?.formatted)
  }, [balance])

  const { data: nftDetails, isLoading, error } = useReadContract({
    abi: abi,
    address: process.env.NEXT_PUBLIC_WEFIT_NFT,
    functionName: 'getNFTDetailsByAddress',
    args: [address],
    query: {
      enabled: !!address
    }
  })

  const handleNFTUse = (nft) => {
    if (nft) {
      setUserStats({
        name: nft.name.toString() || '',
        level: nft.level.toString() || 0,
        points: nft.points.toString() || 0,
        rarity: nft.rarity|| '',
        lastUpdateDay: nft.lastUpdateDay.toString() || 0,
        tokenUri: nft.tokenUri.toString()|| '',
        tokenId: nft.tokenId
      })
      setIsNFTSelected(true)
      localStorage.setItem("userNFT",nft.tokenId.toString());
      localStorage.setItem("dayNFT",nft.lastUpdateDay.toString());
    } else {
      setUserStats({
        name: 'unknown',
        level: 0,
        points: 0,
        rarity: '',
        lastUpdateDay: 0,
        tokenUri: null,
        currentNFT: null
      })
      setIsNFTSelected(false)
    }
  }

  // If nftDetails are loaded and contain a usable NFT, use the first one
  useEffect(() => {
    if (nftDetails && nftDetails.length > 0) {
      const usingNFT = nftDetails.find(nft => nft.isUsing);
      if (usingNFT) {
        handleNFTUse(usingNFT);
      }

      const nft = localStorage.getItem("userNFT");
      console.log(nft);
      
      if(nft != null && nft != '') {
        console.log(nftDetails)
        handleNFTUse(nftDetails.find(x => x.tokenId.toString() == nft.toString()));
        setIsNFTSelected(true);
      }
    }
  }, [nftDetails])

  if (!address) {
    return (
      <div className="container mx-auto p-4 space-y-6 bg-gray-900 text-white">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Skeleton className="w-24 h-24 rounded-full bg-gray-400" />
            <div className="flex-grow">
              <Skeleton className="h-6 w-3/4 mb-2 bg-gray-400" />
              <Skeleton className="h-4 w-1/2 bg-gray-400" />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fitness Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PersonStanding className="text-blue-500" />
                <Skeleton className="h-4 w-20 bg-gray-400" />
              </div>
              <Skeleton className="h-4 w-10 bg-gray-400" />
            </div>
            <Skeleton className="h-2 w-full bg-gray-400" />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="text-red-500" />
                <Skeleton className="h-4 w-24 bg-gray-400" />
              </div>
              <Skeleton className="h-4 w-16 bg-gray-400" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Dumbbell className="text-green-500" />
                <Skeleton className="h-4 w-28 bg-gray-400" />
              </div>
              <Skeleton className="h-4 w-12 bg-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ETHIcon />
                <Skeleton className="h-4 w-16 bg-gray-400" />
              </div>
              <Skeleton className="h-4 w-20 bg-gray-400" />
            </div>
            <div className="w-full">
              <Skeleton className="h-4 w-1/2 mb-2 bg-gray-400" />
              <Skeleton className="h-32 w-full bg-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If address exists but no NFT selected
  if (!isNFTSelected) {
    return (
      <div className="container mx-auto p-4 space-y-6 bg-gray-900 text-white">
        <Card>
          <CardHeader>
            <CardTitle>Select Your NFT</CardTitle>
            <CardDescription>Choose an NFT to personalize your fitness profile</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <PackageOpen className="w-24 h-24 text-gray-500" />
            <p className="text-center text-muted-foreground">
              You haven't selected an NFT yet. Browse your collection and choose one to get started!
            </p>
            <NFTSlider
              onNFTUse={handleNFTUse}
              nftDetails={nftDetails}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6 bg-gray-900 text-white">
     <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={userStats.tokenUri}
              alt="User avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{userStats.name}</CardTitle>
            <p className="text-muted-foreground">{userStats.rarity}</p>
          </div>
        </CardHeader>
        {/* <CardContent>
          <p>Fitness to earn</p>
        </CardContent> */}
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Fitness Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PersonStanding className="text-blue-500" />
              <span>Level</span>
            </div>
            <span className="font-bold">{userStats.level}</span>
          </div>
          <Progress value={82} />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="text-red-500" />
              <span>Calories Burned</span>
            </div>
            <span className="font-bold">{userStats.points.toString()} kcal</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Dumbbell className="text-green-500" />
              <span>Workouts Completed</span>
            </div>
            <span className="font-bold">{userStats.lastUpdateDay.toString()} days</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>My Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ETHIcon />
              <span>ETH</span>
            </div>
            <span className="font-bold">{myBalance}</span>
          </div>
          <div className="w-full">
            <h3 className="font-semibold mb-2">NFT Collection</h3>
            <NFTSlider
              onNFTUse={handleNFTUse}
              nftDetails={nftDetails}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}