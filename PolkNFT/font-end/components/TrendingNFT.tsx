"use client";
import React from "react";
import TrendingNFTCard from "@/components/modelUtils/TrendingNFTCard";

function TrendingNFT() {
   const trendingNFTList = [
      {
         id: 0,
         addressID: "CHRISTIAN",
         img: "./images/bannerIMG/CHRISTIAN.png",
         name: "CHRISTIAN",
         imgOwner:
            "https://i.pinimg.com/236x/ab/90/d9/ab90d9385c969cf62c6e009810dfb849.jpg",
         owner: "ET8WDGfsffB4YRHY6ZYzsFhNZzmGuDzuvTBYWffRUXyG",
         type: "Art",
         price: "29.2",
         isVideo: false,
      },
      {
         id: 1,
         addressID: "EvijanWatson",
         img: "./images/bannerIMG/EvijanWatson.png",
         name: "EvijanWatson",
         imgOwner:
            "https://i.pinimg.com/236x/10/b1/d0/10b1d0c15f2defa69f717b1aa52b9cf4.jpg",
         owner: "5fUafksmQyDUAJb9Kv8EN11f1H4uMuyj9C4Vxxw6pJBk",
         type: "Comic",
         price: "38.2",
         isVideo: false,
      },
      {
         id: 2,
         addressID: "Abstract Wave",
         img: "./video/galaxy.mp4",
         name: "Abstract Wave",
         imgOwner:
            "https://i.pinimg.com/236x/54/26/7a/54267af70300dc246475a073d037c93a.jpg",
         owner: "DNi8bkrc4cDxWXWpLfTrNWyJhRV3jG6tSEW94U7tWQFp",
         type: "Video",
         price: "12.7",
         isVideo: true,
      },
   ];

   return (
      <div
         id="Trending NFT"
         className=" w-full z-30 flex flex-col gap-5 justify-center py-5 items-center border-x-4 border-[#F7F7F9]"
      >
         <div className=" flex flex-col justify-center items-center gap-2">
            <p className=" text-4xl font-semibold text-white">Trending NFT</p>
            <p className=" text-gray-300">Checkout Our Weekly Updated Trending NFT</p>
         </div>
         <div className=" w-full flex justify-between items-center p-10 gap-10">
            {trendingNFTList.map((e, index) => (
               <TrendingNFTCard key={index} nfts={e} isSell={false} />
            ))}
         </div>
      </div>
   );
}

export default TrendingNFT;
