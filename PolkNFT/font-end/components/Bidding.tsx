import React, { useEffect, useState } from "react";
import acceptBid from "@/role/bidNFT/acceptBid";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cancelBid from "@/role/bidNFT/cancelBid";
import { Span } from "next/dist/trace";

function Bidding() {
   const [nftBid, setNFTBid] = useState<any[]>([]);
   const axios = require("axios");
   const [addressWallet, setAddressWallet] = useState(
      "J5HxijcGXuzj9K7ynxenKjrUeekDewy7HYW3q3jx5mci",
   );

   // const biddingList = () => {
   //    let config = {
   //       method: "get",
   //       maxBodyLength: Infinity,
   //       url: `https://api.shyft.to/sol/v1/marketplace/active_bids?network=devnet&marketplace_address=${process.env.NEXT_PUBLIC_ADDRESS_MARKETPLACE}&sort_by=bid_date&sort_order=desc`,
   //       headers: {
   //          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
   //       },
   //    };

   //    axios
   //       .request(config)
   //       .then((res: any) => {
   //          console.log(res.data.result);
   //          const nft = new Array();
   //          res.data.result.data.forEach((event: any) => {
   //             const dataNFT = {
   //                addressID: event.nft_address,
   //                name: event.nft.name,
   //                img: event.nft.image_uri,
   //                seller: event.nft.owner,
   //                buyer: event.buyer_address,
   //                price: event.price,
   //                bid_state: event.bid_state,
   //             };
   //             nft.push(dataNFT);
   //          });
   //          console.log("nft", nft);
   //          setNFTBid(nft);
   //       })
   //       .catch((error: any) => {
   //          console.log(error);
   //       });
   // };

   // useEffect(() => {
   //    biddingList();
   //    console.log("bidding list", nftBid);
   // }, []);

   // const acceptBidding = (bid_state: string, seller: string) => {
   //    acceptBid(Network.Devnet, bid_state, seller, process.env.NEXT_PUBLIC_ADDRESS_MARKETPLACE);

   //    setTimeout(() => {
   //       toast.success("🦄 Accept Bid NFT Successfully!", {
   //          position: "top-right",
   //          autoClose: 5000,
   //          hideProgressBar: false,
   //          closeOnClick: true,
   //          pauseOnHover: true,
   //          draggable: true,
   //          progress: undefined,
   //          theme: "dark",
   //          transition: Bounce,
   //       });
   //    }, 15000);
   // };

   // const cancelBidding = (bid_state: string, buyer: string) => {
   //    cancelBid(Network.Devnet, bid_state, buyer, process.env.NEXT_PUBLIC_ADDRESS_MARKETPLACE);

   //    setTimeout(() => {
   //       toast.success("🦄 Cancel Bid NFT Successfully!", {
   //          position: "top-right",
   //          autoClose: 5000,
   //          hideProgressBar: false,
   //          closeOnClick: true,
   //          pauseOnHover: true,
   //          draggable: true,
   //          progress: undefined,
   //          theme: "dark",
   //          transition: Bounce,
   //       });
   //    }, 15000);
   // };
   const tittleLists = ["Image", "Name", "Seller", "Buyer", "Price", "Accept", "Refuse"];
   return (
      <div className=" w-full min-h-[80vh] z-30 flex flex-col gap-5 items-center text-white px-10 py-5 border-x-4 border-[#F7F7F9]">
         <p className=" text-4xl font-semibold">Bidding&Offering NFT</p>
         <table className="w-full table-auto border-white ">
            <thead className="border-b text-xl font-medium dark:border-neutral-500">
               <tr>
                  {tittleLists.map((item, index) => (
                     <th scope="col" key={index} className="px-8 py-4">
                        {item}
                     </th>
                  ))}
               </tr>
            </thead>
            {nftBid.length > 0 &&
               nftBid.map((item: any, index: number) => (
                  <tbody className="w-full rounded-xl">
                     <tr
                        key={index}
                        className="hover:bg-[#3b664b] justify-center text-white"
                     >
                        <td className="whitespace-nowrap px-6 py-4 flex flex-col items-center">
                           <img
                              className=" w-16 h-16 rounded-md object-cover"
                              src={item.img}
                           />
                        </td>
                        <td className="whitespace-nowrap px-16 py-4 text-center">
                           {item.name}
                        </td>
                        <td className="whitespace-nowrap px-16 py-4 text-center">
                           {`${item.seller.substring(0, 6)}...${item.seller.substring(38)}`}
                        </td>
                        <td className="whitespace-nowrap px-16 py-4 text-center">
                           {`${item.buyer.substring(0, 6)}...${item.buyer.substring(38)}`}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                           {item.price}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                           {item.seller == addressWallet ? (
                              <button
                                 // onClick={() => acceptBidding(item.bid_state, item.seller)}
                                 className="px-2 py-1 bg-green-600 rounded-xl"
                              >
                                 Accept Offer
                              </button>
                           ) : (
                              <p className=" text-white text-center">Not Authenticaion</p>
                           )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                           {item.buyer == addressWallet ? (
                              <button
                                 // onClick={() => cancelBidding(item.bid_state, item.buyer)}
                                 className="px-2 py-1 bg-rose-600 rounded-xl"
                              >
                                 Cancel Offer
                              </button>
                           ) : (
                              <p className=" text-white text-center">Not Authenticaion</p>
                           )}
                        </td>
                     </tr>
                  </tbody>
               ))}
         </table>
         {nftBid.length == 0 && (
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

export default Bidding;
