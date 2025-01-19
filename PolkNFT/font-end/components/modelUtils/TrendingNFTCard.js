"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { sellNFT } from "@/role/sellNFT/sellNFT";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

function TrendingNFTCard(props) {
   const [nft, setNFT] = useState(props.nfts);
   const [isSell, setSell] = useState(props.isSell);
   const [price, setPrice] = useState(0);
   const [balance, setBalance] = useState();
   const [isRecover, setRecover] = useState(false);
   const [addressWallet, setAddressWallet] = useState(
      "J5HxijcGXuzj9K7ynxenKjrUeekDewy7HYW3q3jx5mci",
   );
   const dispatch = useDispatch();
   const router = useRouter();
   const nftMarketList = useSelector((state) => state.marketReducer.listAddressID);
   const currentNFTBorrow = useSelector((state) => state.vaultReducer.currentNFTBorrow);
   const stakeSOL = Number(
      currentNFTBorrow.stakeValue -
         currentNFTBorrow.priceNFT * currentNFTBorrow.timeBorrowNFT,
   );

   return (
      <div
         className={` ${
            nft.img == undefined ? "w-[55%]" : "w-[25%]"
         } shadow-inner shadow-indigo-500 flex flex-col justify-center items-center border-2 border-[#5B3BA8] rounded-md bg-[#28262F] relative`}
      >
         <div className=" w-[30%] text-center absolute left-0 top-0 z-40 text-white font-medium rounded-br-xl bg-[#5C3CA8]">
            <p>{nft.type}</p>
         </div>
         <div
            className={` ${nft.img == undefined ? " px-0 w-[70%] " : "w-full"} ${
               isSell == false ? "h-[60vh] gap-2" : "h-[65vh]"
            } px-5 py-2  flex flex-col text-white rounded-t-xl `}
         >
            <div className=" w-full h-[65%] rounded-t-xl flex justify-center items-center">
               {nft.type == "Video" ? (
                  <video
                     className=" rounded-t-xl h-full w-full object-fill"
                     autoPlay={true}
                     loop
                     controls={false}
                     muted
                  >
                     <source src={nft.img} className=" w-full h-full" type="video/mp4" />
                  </video>
               ) : (
                  <img
                     className=" w-full h-full py-1 rounded-t-xl object-cover"
                     src={nft.img}
                  />
               )}
            </div>
            <p className=" text-xl font-semibold">{nft.name}</p>
            <div className=" w-full flex gap-2">
               <div className=" w-6 h-6">
                  <img
                     className=" h-full w-full object-cover rounded-full"
                     src={"../../images/bannerIMG/avartar.jpg"}
                  />
               </div>
               <p>{`${nft.owner.substring(0, 6)}...${nft.owner.substring(36)}`}</p>
            </div>
            {nft.addressID == currentNFTBorrow.addressID && isRecover == false ? (
               <>
                  {addressWallet == currentNFTBorrow.borrowerNFT ? (
                     <p className=" text-gray-500 font-medium">Time for borrowing:</p>
                  ) : (
                     <p className=" text-gray-500 font-medium">Stake money for revert:</p>
                  )}
               </>
            ) : (
               <p className=" text-gray-500 font-medium">Price for Sell:</p>
            )}
            <div
               className={` ${
                  isSell == false ? "flex items-center" : "flex flex-col items-end"
               } w-full gap-2 `}
            >
               <div className=" flex w-full gap-1 items-center">
                  <div className=" w-5 h-5">
                     <img src="../../images/icons/westend_icon.png" />
                  </div>
                  {isSell == true ? (
                     <input
                        onChange={(e) => setPrice(e.target.value)}
                        className=" text-black w-full rounded-md"
                        type="number"
                     />
                  ) : (
                     <p>{nft.price}</p>
                  )}
               </div>
               {/* Execute Action */}
               {nft.addressID == currentNFTBorrow.addressID && isRecover == false ? (
                  <>
                     {addressWallet == currentNFTBorrow.borrowerNFT ? (
                        <button
                           //    onClick={() => revertNFTBorrow()}
                           className=" w-full p-2  bg-red-500 rounded-xl"
                        >
                           Revert NFT
                        </button>
                     ) : (
                        <button
                           //    onClick={() => revertStakeSol()}
                           className=" w-full p-2  bg-red-500 rounded-xl"
                        >
                           Revert Stake Sol
                        </button>
                     )}
                  </>
               ) : (
                  <>
                     {isSell == true ? (
                        <div className=" flex w-[90%] items-end justify-center gap-2">
                           <button
                              //   onClick={() => listNFT(nft.addressID)}
                              className=" w-full p-2  bg-green-500 rounded-xl"
                           >
                              Sell NFT
                           </button>
                           <button
                              //   onClick={() => lendingNFT(nft.addressID)}
                              className=" w-full p-2 bg-yellow-500 rounded-xl"
                           >
                              Lend NFT
                           </button>
                        </div>
                     ) : (
                        <>
                           {nft.seller == addressWallet &&
                           nftMarketList.includes(nft.addressID) ? (
                              <button
                                 //  onClick={() => cancelSelling()}
                                 className=" w-[80%] p-2  bg-red-400 rounded-xl"
                              >
                                 Cancel Selling
                              </button>
                           ) : (
                              <>
                                 {process.env.NEXT_PUBLIC_ADDRESS_MARKETPLACE !==
                                    undefined && nft.addressID !== undefined ? (
                                    <Link
                                       href={{
                                          pathname: `/nftDetail/${nft.addressID}&${balance}&${process.env.NEXT_PUBLIC_ADDRESS_MARKETPLACE}`,
                                       }}
                                       className={` ${
                                          nft.imgNFT == undefined
                                             ? " w-[90%] "
                                             : "w-[60%]"
                                       } p-1 bg-[#593F9F] text-center rounded-tr-xl rounded-bl-xl`}
                                    >
                                       See Detail &#8594;
                                    </Link>
                                 ) : (
                                    <button
                                       className={` ${
                                          nft.imgNFT == undefined
                                             ? " w-[90%] "
                                             : "w-[60%]"
                                       } p-1 bg-[#593F9F] text-center rounded-tr-xl rounded-bl-xl`}
                                    >
                                       See Detail &#8594;
                                    </button>
                                 )}
                              </>
                           )}
                        </>
                     )}
                  </>
               )}
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

export default TrendingNFTCard;
