"use client";
import React from "react";
import styled from "styled-components";

function Footer() {
   return (
      <div className=" w-full justify-between items-center flex px-16 pt-5 pb-10  bg-[#353535] border-4 border-t-0 border-[#F7F7F9] z-30 rounded-b-3xl ">
         <div className=" w-[20%] flex flex-col items-start gap-5">
            <div className=" w-full">
               <img src="./images/logo.png" alt="" />
            </div>
            <div className=" w-full text-[#919191] px-5">
               <p>Discover, Collect and Sell Extraordinary NFTs.</p>
            </div>
            <div className=" w-full text-[#919191] px-5 ">
               <p>Join our community</p>
               <div className=" w-full flex gap-2">
                  <div className=" w-[10%]">
                     <img src="./images/footerIMG/discord.png" alt="" />
                  </div>
                  <div className=" w-[10%]">
                     <img src="./images/footerIMG/youtube.png" alt="" />
                  </div>
                  <div className=" w-[10%]">
                     <img src="./images/footerIMG/twitter.png" alt="" />
                  </div>
                  <div className=" w-[10%]">
                     <img src="./images/footerIMG/instagram.png" alt="" />
                  </div>
               </div>
            </div>
         </div>
         <div className=" w-[10%] flex flex-col items-start gap-5">
            <div className=" w-full h-[30%] text-white text-3xl py-5 font-serif">
               <p>Explore</p>
            </div>
            <div className=" flex flex-col gap-4 text-[#919191]">
               <p>Marketplace</p>
               <p>Rankings</p>
               <p>Connect a wallet</p>
            </div>
         </div>
         <div className=" w-[10%] flex flex-col items-start gap-5">
            <div className=" w-full h-[30%] text-white text-3xl py-5 font-serif">
               <p>Marketplace</p>
            </div>
            <div className=" flex flex-col gap-4 text-[#919191]">
               <p>Art</p>
               <p>Music</p>
               <p>Visual</p>
            </div>
         </div>
         <div className=" w-[30%] flex flex-col items-start gap-5">
            <div className=" w-full h-[30%] text-white text-3xl py-5 font-serif">
               <p>Join Our Weekly Digest</p>
            </div>
            <div className=" flex flex-col gap-4 text-[#919191]">
                <div className=" w-[60%]">
                    <p>Get exclusive promotions & updates straight to your inbox.</p>
                </div>
               <div className=" w-full flex rounded-xl text-[#919191] bg-white relative">
                    <div className=" w-full z-30">
                        <input className=" w-full p-2 rounded-xl bg-white border-white placeholder:text-[#919191]" type="text" placeholder="Enter your email here" required/>
                    </div>
                    <div className=" w-[30%] z-40 absolute right-0 flex justify-center cursor-pointer gap-2 text-white bg-[#A358FE] rounded-xl p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                        <p>Subcribe</p>
                    </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Footer;

