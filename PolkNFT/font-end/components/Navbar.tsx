"use client";
import ConnectButton from "@/utils/connectWallet/ConnectWallet";
import React from "react";
import { Link } from "react-scroll";

function Navbar() {

   return (
      <div className=" w-full z-30 rounded-t-3xl text-white border-4 border-b-0 border-[#F7F7F9] px-5 py-2 justify-between items-center flex ">
         <div className=" w-[15%] h-[60%] ">
            <img src="./images/polknft_logo.png"  alt="" />
         </div>
         <div>
            <ul className=" no-underline flex text-xl gap-6 justify-center items-center">
               <Link to="Home" className=" cursor-pointer">Home</Link>
               <Link to="Trending NFT" className=" cursor-pointer">Trending NFT</Link>
               <Link to="Marketplace" className=" cursor-pointer">Marketplace</Link>
               <Link to="ImgGen" className=" cursor-pointer">IMG Generation</Link>
               <Link to="Airdrop" className=" cursor-pointer">Airdrop</Link>
               <Link to="AIConsultancy" className=" cursor-pointer">AI Consultancy</Link>
            </ul>
         </div>
         <ConnectButton/>
      </div>
   );
}

export default Navbar;
