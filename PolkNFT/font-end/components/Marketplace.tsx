"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NFTModel from "../pages/nftCollection/NFTModel";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getNFTMarket } from "@/script/action/marketplace/marketAction";
import { CircularProgress } from "@mui/material";
import { getAddressID } from "@/script/action/marketplace/marketAction";

function Marketplace() {
   const [isChoose, setChoose] = useState("All");
   const [nfts, setNFTs] = useState<any[]>([]);
   const [loading, isLoading] = useState(false);
   const [listAddressID, setAddressID] = useState<any[]>([]);
   const dispatch = useDispatch();
   const marketNFT = useSelector((state: any) => state.marketReducer.NFTs);

   // const changeNFT = (type: string) => {
   //    isLoading(true)
   //    if (type == "All" ) {
   //       setNFTs(marketNFT)
   //    } else {
   //       setNFTs(marketNFT.filter((item:any) => item.type == type))
   //    }
   //    setChoose(type)
   //    isLoading(false)
   // };

   // const fetchNFTs = () => {
   //    let nftUrl = `https://api.shyft.to/sol/v1/marketplace/active_listings?network=${Network.Devnet}&marketplace_address=${process.env.NEXT_PUBLIC_ADDRESS_MARKETPLACE}`;
   //    axios({
   //       url: nftUrl,
   //       method: "GET",
   //       headers: {
   //          "Content-Type": "application/json",
   //          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
   //       },
   //    })
   //       .then((res: any) => {
   //          console.log(res.data.result);
   //          const nft = new Array();
   //          res.data.result.forEach(async (event: any) => {
   //             const tx = await axios.get(event.nft.metadata_uri).then((e) => {
   //                const dataNFT = {
   //                   addressID: event.nft_address,
   //                   name: e.data.name,
   //                   type: e.data.attributes[0].type,
   //                   description: e.data.description,
   //                   img: e.data.image,
   //                   owner: event.nft.owner,
   //                   supply: e.data.attributes[0].supply,
   //                   seller: event.seller_address,
   //                   price: event.price,
   //                   list_state: event.list_state,
   //                };
   //                nft.push(dataNFT);
   //                listAddressID.push(event.nft_address)
   //             });
   //          });
   //          dispatch(getNFTMarket(nft));
   //          dispatch(getAddressID(listAddressID))
   //          setNFTs(nft);
   //       })

   //       .catch((err: any) => {
   //          console.warn(err);
   //       });
   // };

   // useEffect(() => {
   //    fetchNFTs();
   // }, []);
   const titleList = ["All", "Art", "Abstract", "Gorilla", "Monkey", "Comic", "Video"];
   return (
      <div
         id="Marketplace"
         className=" w-full px-10 py-5 border-x-4 border-[#F7F7F9] z-30 flex flex-col gap-10 justify-center items-center text-white"
      >
         <div className=" w-full flex justify-between">
            <div className="flex w-[35%] justify-center items-center">
               <p className=" text-3xl font-bold">POPULAR COLLECTION NFT DIGITAL ART</p>
               <div className=" w-[150px] h-[100px] justify-start flex items-start animate-pulse">
                  <img
                     src="/images/Uranus_Crypto_Card_-_Rarible___OpenSea-removebg-preview.png"
                     alt=""
                     className=" object-cover"
                  />
               </div>
            </div>
            <div className=" w-[30%]">
               <p className=" py-5 text-gray-300">
                  We have some of the most popular digital assets that can be recommended
                  for you, which you also get for your new collection.
               </p>
               <button className=" text-violet-500">See detail &#8594;</button>
            </div>
         </div>
         <div className=" justify-start flex w-[100%]">
            <div className=" flex gap-5">
               {titleList.map((item, index) => (
                  <FilterType
                     key={index}
                     // onClick={() => changeNFT("All")}
                     className={` ${isChoose == item ? " bg-[#825CE8] text-white " : "border-[#825CE8] text-[#825CE8] "}`}
                  >
                     {item}
                  </FilterType>
               ))}
            </div>
         </div>
         <div className=" w-full flex flex-wrap gap-[50px] justify-center items-center">
            {loading == true ? (
               <CircularProgress color="success" />
            ) : (
               <>
                  {nfts.map((e: any, index: number) => (
                     <NFTModel key={index} nfts={e} isSell={false} />
                  ))}
               </>
            )}
         </div>
      </div>
   );
}

export default Marketplace;

const FilterType = styled.div`
   padding: 0.5rem;
   border-width: 2px;
   border-color: #aaa1b6;
   border-radius: 0.75rem;
   cursor: pointer;
`;
