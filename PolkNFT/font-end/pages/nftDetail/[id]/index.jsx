"use client";
import React, { useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { buy } from "@/role/buyNFT/buyNFT";
import { useWallet } from "@solana/wallet-adapter-react";
import { useDispatch, useSelector } from "react-redux";
import { Network } from "@shyft-to/js";
import bidNFT from "@/role/bidNFT/bidNFT";
import { borrowNFT } from "@/role/LendNFT/borrowNFT";
import { updateBorrowNFT } from "@/role/updateNFT/updateNFT";
import { getCurrentNFTBorrow } from "@/script/action/vault/vaultAction";
import { repayment } from "@/role/LendNFT/repayment";

function index() {
   const router = useRouter();
   const [price, setPrice] = useState("");
   const [timeBorrow, setTimeBorrow] = useState();
   const { publicKey } = useWallet();
   const [params, setParams] = useState("");
   const [addressWallet, setAddressWallet] = useState(
      "J5HxijcGXuzj9K7ynxenKjrUeekDewy7HYW3q3jx5mci",
   );
   const [addressNFT, setAddressNFT] = useState(
      "Ki89sv89Xuzj9K7ynxenKjrUeekDewy7HYW37d8ad7a8",
   );
   const dispatch = useDispatch();
   const nftMarket = useSelector((state) => state.marketReducer.NFTs);
   const vaultNFT = useSelector((state) => state.vaultReducer.NFTs);

   if (router.query.id !== undefined) {
      setParams(router.query.id.split("&"));
   }
   const [nfts, setNFT] = useState(
      params[2] == process.env.NEXT_PUBLIC_ADDRESS_MARKETPLACE
         ? nftMarket.filter((item) => item.addressID === params[0])
         : vaultNFT.filter((item) => item.addressID === params[0]),
   );

   const backClick = () => {
      router.back();
   };

   const buyNFT = (nftAdress, price, seller) => {
      buy(
         Network.Devnet,
         nftAdress,
         price,
         seller,
         "J5HxijcGXuzj9K7ynxenKjrUeekDewy7HYW3q3jx5mci",
      );
      setTimeout(() => {
         toast.success("🦄 Buying NFT Successfully!", {
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

   const stakeValue =
      price * Number(timeBorrow) +
      price * Number(timeBorrow) * Number(process.env.NEXT_PUBLIC_STAKE_VALUE);

   const borrow = (nftAddress) => {
      bidNFT(
         Network.Devnet,
         nftAddress,
         Number(price),
         "J5HxijcGXuzj9K7ynxenKjrUeekDewy7HYW3q3jx5mci",
         process.env.NEXT_PUBLIC_ADDRESS_VAULT,
      );

      setTimeout(() => {
         toast.success("🦄 Offer lending NFT Successfully!", {
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

   const bid = (nftAddress) => {
      // NEXT_PUBLIC_ADDRESS_VAULT
      bidNFT(
         Network.Devnet,
         nftAddress,
         Number(price),
         "J5HxijcGXuzj9K7ynxenKjrUeekDewy7HYW3q3jx5mci",
         process.env.NEXT_PUBLIC_ADDRESS_MARKETPLACE,
      );
      setTimeout(() => {
         toast.success("🦄 Bidding NFT Successfully!", {
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
      <div className=" px-5 w-full h-[100vh] flex-col bg-white justify-center flex">
         <p
            onClick={() => backClick()}
            className=" hover:-translate-x-2  w-[40px] h-[40px] bg-[#E2EAB0] rounded-xl flex justify-center items-center"
         >
            &#8592;
         </p>
         <div className=" w-[95%] h-[90%] flex gap-10 justify-center items-center">
            <div className=" w-[35%] h-[80%] flex shadow-xl shadow-violet-500 rounded-xl">
               <img
                  src="https://i.pinimg.com/236x/12/5e/83/125e833289c00aaa9510170950c7b9b8.jpg"
                  className=" w-full h-full object-cover rounded-xl"
                  alt=""
               />
            </div>
            <div className=" w-[60%] gap-5 flex flex-col">
               <div className=" flex flex-col gap-1">
                  <span className=" text-5xl text-black font-semibold">{nfts.name}</span>
                  <span className=" text-gray-400">
                     Owned by{" "}
                     <a className=" no-underline text-blue-500" href="">
                        {addressWallet}
                     </a>
                  </span>
               </div>
               <div className=" w-full h-[300px] bg-[#FDFDFD] rounded-xl border-[1px] border-gray-400">
                  <div className=" border-b-[1px] gap-10 border-gray-400 h-[50%] flex items-center mx-5">
                     <div>
                        <span className=" text-black">
                           BALANCE: {Number(price).toFixed(2)} SOL
                        </span>
                        <div className=" text-black gap-2">
                           <span>Current price:</span>
                           <span className=" text-black px-2">2.2 SOL</span>
                        </div>
                     </div>
                     <div className=" flex-col flex ">
                        <p>NFT Type: Art</p>
                        <p>Supply: 2000</p>
                     </div>
                  </div>
                  <div className=" flex py-2 h-[70%] gap-5 mx-5">
                     <div
                        className={`flex gap-3 ${params == process.env.NEXT_PUBLIC_ADDRESS_VAULT ? "flex-col" : ""}`}
                     >
                        <input
                           required
                           onChange={(e) => setPrice(e.target.value)}
                           type="text"
                           placeholder="Enter price you want to buy"
                           className=" text-black bg-transparent border-[1px] px-2 h-[50px] w-[350px] valid:border-[#1a73e8] rounded-md"
                        />
                        {params[2] == process.env.NEXT_PUBLIC_ADDRESS_VAULT ? (
                           <input
                              required
                              onChange={(e) => setTimeBorrow(e.target.value)}
                              type="text"
                              placeholder="Enter time you want to borrow"
                              className=" text-black bg-transparent border-[1px] px-2 h-[50px] w-[350px] valid:border-[#1a73e8] rounded-md"
                           />
                        ) : (
                           ""
                        )}
                     </div>
                     <div className=" w-[20%] h-full flex flex-col gap-2">
                        <button
                           onClick={() => bid(addressNFT)}
                           className="text-white justify-center gap-2 bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2"
                        >
                           Bidding{" "}
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-6 h-6"
                           >
                              <path
                                 stroke-linecap="round"
                                 stroke-linejoin="round"
                                 fill="white"
                                 d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                              />
                           </svg>
                        </button>
                        {params[2] == process.env.NEXT_PUBLIC_ADDRESS_MARKETPLACE ? (
                           <button
                              className="text-white justify-center gap-2 bg-[#2557D6] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50 me-2 mb-2"
                              onClick={() => buyNFT(addressNFT, price, addressWallet)}
                           >
                              Buy Now{" "}
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 height="24"
                                 viewBox="0 0 24 24"
                                 width="24"
                              >
                                 <path d="M0 0h24v24H0V0z" fill="none" />
                                 <path
                                    fill="white"
                                    d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
                                 />
                              </svg>
                           </button>
                        ) : (
                           <button
                              className="text-white justify-center gap-2 bg-[#2557D6] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50 me-2 mb-2"
                              onClick={() => borrow(addressNFT, price, addressWallet)}
                           >
                              Offer lending{" "}
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 height="24"
                                 viewBox="0 0 24 24"
                                 width="24"
                              >
                                 <path d="M0 0h24v24H0V0z" fill="none" />
                                 <path
                                    fill="white"
                                    d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
                                 />
                              </svg>
                           </button>
                        )}
                     </div>
                  </div>
               </div>
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
