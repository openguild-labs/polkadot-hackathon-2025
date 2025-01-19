"use client";
import React, { useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, useBalance, useReadContract, useWriteContract } from "wagmi";
import { ReadFunc, WriteFunc } from "@/const/common.const";
import { abis } from "@/pages/config/abis";

function BiddingOnLending() {
   const account = useAccount();
   const { writeContractAsync } = useWriteContract();
   const result = useBalance({
      address: account.address,
   });

   const handleRent = async (index: number, lender: string ) => {
      const execute = await writeContractAsync({
         abi: abis,
         address: `0x${process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS}`,
         functionName: WriteFunc.RENTNFT,
         args: [BigInt(1), lender, 2],
      });
      setTimeout(() => {
         toast.success("🦄 It is successfull Rent!", {
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

   const list = useReadContract({
      chainId: 1287,
      address: `0x${process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS}`,
      functionName: ReadFunc.GETALLNFT,
      abi: abis,
   });

   return (
      <div className="w-full min-h-[80vh] z-30 flex flex-col gap-5 items-center text-white px-10 py-5 border-x-4 border-[#F7F7F9]">
         <p className=" text-4xl font-semibold">Lending Nft</p>

         <div className="w-full h-full">
            <div className="w-full flex flex-wrap gap-5">
               {Array.isArray(list.data) &&
                  list.data.length > 0 &&
                  list.data.map((nft: any, index: number) => (
                     <>
                        {nft.lender !== account.address && nft.status == 1 && (
                           <div
                              key={index}
                              className={
                                 "w-[300px] h-[350px] shadow-inner shadow-indigo-500 flex flex-col justify-center items-center border-2 border-[#5B3BA8] rounded-md bg-[#28262F] relative"
                              }
                           >
                              <div className=" w-[30%] text-center absolute left-0 top-0 z-40 text-white font-medium rounded-br-xl bg-[#5C3CA8]">
                                 <p>{nft.type}</p>
                              </div>
                              <div
                                 className={
                                    "w-full h-[65vh] px-5 py-2  flex flex-col text-white rounded-t-xl"
                                 }
                              >
                                 <img
                                    className=" w-full h-[65%] py-1 rounded-t-xl object-cover"
                                    src={nft.newuri}
                                 />
                                 <div className=" w-full flex gap-2">
                                    <div className=" w-6 h-6">
                                       <img
                                          className=" h-full w-full object-cover rounded-full"
                                          src={"../../images/bannerIMG/avartar.jpg"}
                                       />
                                    </div>
                                    <p>
                                       {String(nft.lender).substring(0, 6)}...
                                       {String(nft.lender).substring(100)}
                                    </p>
                                 </div>
                                 <p className=" text-gray-500 font-medium">
                                    Price: {Number(nft.price) / 10e17}
                                 </p>
                                 <p className=" text-gray-500 font-medium">
                                    Lending amount: {Number(nft.lendAmount)}
                                 </p>
                                 <button
                                    className="p-1 mb-2 bg-green-300 rounded-lg"
                                    onClick={() => handleRent(index, nft.lender)}
                                 >
                                    Rent
                                 </button>
                              </div>
                           </div>
                        )}
                     </>
                  ))}
            </div>
         </div>
         {Array.isArray(list.data) && list.data.length == 0 && (
            <div className="w-full flex justify-center items-center py-5">
               <span className="text-gray-300 text-xl text-center">No data</span>
            </div>
         )}
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

export default BiddingOnLending;
