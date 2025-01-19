import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cancelLend } from "@/role/LendNFT/cancelLend";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { borrowNFT } from "@/role/LendNFT/borrowNFT";
import { updateBorrowNFT } from "@/role/updateNFT/updateNFT";
import Link from "next/link";

function NFTLending(props) {
   const nftVaultList = useSelector((state) => state.vaultReducer.listAddressID);
   const { publicKey } = useWallet();
   const [open, setOpen] = useState(false);
   const [timeBorrow, setTimeBorrow] = useState();
   const [addressWallet, setAddressWallet] = useState("J5HxijcGXuzj9K7ynxenKjrUeekDewy7HYW3q3jx5mci")
   const [balance, setBalance] = useState();

   const handleOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   const nft = props.nfts;

   const getBalance = async () => {
      const tx = await shyft.wallet.getBalance({ wallet: addressWallet });
      setBalance(tx);
   };
   
   getBalance();

   // const cancelLending = () => {
   //    cancelLend(Network.Devnet, nft.list_state, addressWallet);

   //    setTimeout(() => {
   //       toast.success("🦄 Cancel lend NFT successfully!", {
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

   useEffect(() => {
      if (publicKey !== null) {
         setAddress(addressWallet);
      }
   }, [addressWallet]);

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
            className={` ${
               nft.img == undefined ? " px-0 w-[70%] " : "w-full"
            } h-[60vh] flex flex-col text-white gap-2 p-5 rounded-t-xl `}
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
                     className=" w-full h-full rounded-t-xl object-cover"
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
            <p className=" text-gray-500 font-medium">Price for Lending:</p>
            <div className=" w-full flex justify-between items-center">
               <div className=" flex w-full gap-1">
                  <div className=" w-5 h-5">
                     <img src="../../images/sponsorIMG/solana.png" />
                  </div>
                  <p>{nft.price}</p>
               </div>
               {nft.owner == addressWallet && nftVaultList.includes(nft.addressID) ? (
                  <button
                     // onClick={() => cancelLending()}
                     className=" w-full p-2  bg-red-400 rounded-xl"
                  >
                     Cancel Lending
                  </button>
               ) : (
                  <>
                     <Link
                        href={{ pathname: `/nftDetail/${nft.addressID}&${balance}&${process.env.NEXT_PUBLIC_ADDRESS_VAULT}` }}
                        className={` ${
                           nft.imgNFT == undefined ? " w-[90%] " : "w-[60%]"
                        } p-1 bg-[#593F9F] text-center rounded-tr-xl rounded-bl-xl`}
                     >
                        Borrow NFT
                     </Link>
                     {/* <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="child-modal-title"
                        aria-describedby="child-modal-description"
                     >
                        <Box sx={{ ...style, width: 300 }}>
                           <h2 id="child-modal-title">Time you want to borrow NFT</h2>
                           <input
                              onChange={(e) => setTimeBorrow(e.target.value)}
                              className=" text-black w-full rounded-md my-2 border-[1px] border-teal-900 p-2"
                              placeholder="Enter expiration"
                              type="number"
                           />
                           <Button className=" text-end w-full" onClick={() => borrow(nft.addressID, nft.price, nft.lender, addressWallet)}>
                              Accept to borrow
                           </Button>
                        </Box>
                     </Modal> */}
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

export default NFTLending;

const style = {
   position: "absolute",
   top: "50%",
   left: "50%",
   transform: "translate(-50%, -50%)",
   width: 400,
   bgcolor: "background.paper",
   border: "2px solid #000",
   boxShadow: 24,
   pt: 2,
   px: 4,
   pb: 3,
   gap: 2,
};
