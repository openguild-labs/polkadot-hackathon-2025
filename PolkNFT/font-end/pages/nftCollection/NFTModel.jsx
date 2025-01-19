"use client";
import React, { useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NFTModel(nft, isSell) {
   const [price, setPrice] = useState(0);
   console.log("check", nft.nfts)
   const startAuction = () => {
      setTimeout(() => {
         toast.success("🦄 It is successfull sold nft.nfts!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
         });
      }, 15000);
   };
   return (
      <div
         className={
            "w-[200px] h-[500px] shadow-inner shadow-indigo-500 flex flex-col justify-center border-2 border-[#5B3BA8] rounded-md bg-[#28262F] relative"
         }
      >
         <div className=" w-[30%] text-center absolute left-0 top-0 z-40 text-white font-medium rounded-br-xl bg-[#5C3CA8]">
            <p>{nft.nfts.type}</p>
         </div>
         <div
            className={"w-[80%] h-[65vh] px-5 py-2  flex flex-col text-white rounded-t-xl"}
         >
            <div className=" w-full h-[65%] rounded-t-xl flex justify-center items-center">
               {nft.nfts.type == "Video" ? (
                  <video
                     className=" rounded-t-xl h-full w-full object-fill"
                     autoPlay={true}
                     loop
                     controls={false}
                     muted
                  >
                     <source
                        src={nft.nfts.image}
                        className=" w-full h-full"
                        type="video/mp4"
                     />
                  </video>
               ) : (
                  <img
                     className=" w-full h-full py-1 rounded-t-xl object-cover"
                     src={nft.nfts.image}
                  />
               )}
            </div>
            <div className=" w-full flex gap-2">
               <div className=" w-6 h-6">
                  <img
                     className=" h-full w-full object-cover rounded-full"
                     src={"../../images/bannerIMG/avartar.jpg"}
                  />
               </div>
               <p>
                  {String(nft.nfts.userId).substring(0, 6)}...
                  {String(nft.nfts.userId).substring(100)}
               </p>
            </div>
            <p className=" text-gray-500 font-medium">Highest bidding price:</p>
            <div
               className={` ${
                  isSell == false ? "flex items-center" : "flex flex-col items-end"
               } w-full gap-3 `}
            >
               <div className=" flex w-full gap-1 items-center">
                  <div className=" w-5 h-5">
                     <img src="../../images/icons/cardano.png" />
                  </div>
                  {isSell == true ? (
                     <input
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className=" text-black w-full rounded-md"
                        type="number"
                     />
                  ) : (
                     <p>{nft.nfts.highest_bid}</p>
                  )}
               </div>
               <button
                  onClick={startAuction}
                  className=" w-full p-2 bg-red-500 rounded-xl"
               >
                  Start Auction
               </button>
            </div>
         </div>
         <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
         />
      </div>
   );
}

export default NFTModel;
