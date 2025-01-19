"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { UpdatedIMG } from "@/components";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, useReadContract } from "wagmi";
import { abis } from "../config/abis";
import CustomButton from "./CustomButton";
import { ReadFunc } from "@/const/common.const";

function index() {
   const router = useRouter();
   const account = useAccount();
   const [price, setPrice] = useState("");
   const [amount, setAmount] = useState("");
   const [isSubmit, setSubmit] = useState(false);
   const [selected, setSelected] = useState(null);

   const backClick = () => {
      router.back();
   };

   const handleCheck = (index: any) => {
      setSubmit(true);
      setSelected(index)
   }

   const list = useReadContract({
      chainId: 1287,
      address: `0x${process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS}`,
      functionName: ReadFunc.GETALLNFT,
      abi: abis,
   });

   return (
      <div className=" w-full min-h-screen relative flex flex-col bg-white">
         <p
            onClick={() => backClick()}
            className=" absolute left-5 top-5 hover:-translate-x-2 cursor-pointer w-[40px] h-[40px] bg-[#E2EAB0] rounded-xl flex justify-center items-center"
         >
            &#8592;
         </p>
         <div className=" w-full h-[500px] bg-white">
            <UpdatedIMG name={"Background"} />
            <div className=" flex w-full h-[250px] max-sm:pt-10 gap-2 items-end px-[10%] -translate-y-40">
               <UpdatedIMG name={"Avatar"} />
               <div className=" h-[50px] flex justify-center items-center rounded-xl bg-gradient-to-br from-[#E55D87] to-[#5FC3E4]">
                  <span className=" text-black font-bold text-3xl max-sm:text-sm px-[10px] flex items-end">
                     {account.address?.substring(0, 4)}...
                     {account.address?.substring(38)}
                  </span>
               </div>
            </div>
         </div>
         {/* Own Assets */}
         <div className="w-full h-full px-5">
            <div className="w-full flex flex-wrap p-16 gap-10">
               {Array.isArray(list.data) &&
                  list.data.length > 0 &&
                  list.data.map((nft: any, index: number) => (
                     <>
                        {nft.lender == account.address && (
                           <div
                              key={index}
                              className={`w-[300px] h-[450px] shadow-inner shadow-indigo-500 flex flex-col justify-center items-center border-2 border-[#5B3BA8] rounded-md bg-[#28262F] relative ${
                                 nft.highest_bid > 0 ? "hidden" : "visible"
                              }`}
                           >
                              <div className=" w-[30%] text-center absolute left-0 top-0 z-40 text-white font-medium rounded-br-xl bg-[#5C3CA8]">
                                 <p>{nft.type}</p>
                              </div>
                              <div
                                 className={
                                    "w-full h-[65vh] px-5 py-2  flex flex-col text-white rounded-t-xl"
                                 }
                              >
                                 <div className=" w-full h-[65%] rounded-t-xl flex justify-center items-center">
                                    <img
                                       className=" w-full h-full py-1 rounded-t-xl object-cover"
                                       src={nft.newuri}
                                    />
                                 </div>
                                 <div className=" w-full flex gap-2">
                                    <img
                                       className=" h-4 w-4 object-contain rounded-full"
                                       src={"../../images/bannerIMG/avartar.jpg"}
                                    />
                                    <p>
                                       {String(nft.lender).substring(0, 4)}...
                                       {String(nft.lender).substring(38)}
                                    </p>
                                 </div>
                                 {nft.status == 0 ? (
                                    <>
                                       <p className=" text-gray-500 font-medium">
                                          Price:
                                       </p>
                                       <div className=" flex w-full gap-1 items-center">
                                          <div className=" w-5 h-5">
                                             <img src="../../images/icons/westend_icon.png" />
                                          </div>
                                          <input
                                             onChange={(e: any) =>
                                                setPrice(e.target.value)
                                             }
                                             className=" text-black w-full rounded-md"
                                             type="number"
                                             placeholder="?$/nft"
                                          />
                                       </div>
                                       <p className=" text-gray-500 font-medium">
                                          Amount:
                                       </p>
                                       <input
                                          onChange={(e: any) => setAmount(e.target.value)}
                                          className=" text-black w-full rounded-md"
                                          type="number"
                                          placeholder="0"
                                       />
                                    </>
                                 ) : (
                                    <>
                                       <p className=" text-gray-500 font-medium">
                                          Price: {(nft.price / 10 ** 18).toFixed(2)}
                                       </p>
                                       <p className=" text-gray-500 font-medium">
                                          Amount: {nft.lendingAmount}
                                       </p>
                                    </>
                                 )}

                                 {isSubmit && selected == index ? (
                                    <CustomButton
                                       index={index}
                                       data={nft}
                                       price={price}
                                       amount={amount}
                                    />
                                 ) : (
                                    <button onClick={() => handleCheck(index)}>
                                       Submit
                                    </button>
                                 )}
                              </div>
                           </div>
                        )}
                     </>
                  ))}
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

export default index;
