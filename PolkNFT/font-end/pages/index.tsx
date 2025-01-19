import React from "react";
import type { NextPage } from "next";
import HomePage from "../modules/HomePage";

const Home: NextPage = () => {
   return (
      <div className=" w-full min-h-screen z-0 px-[10%] py-[8%] bg-[#14161B] items-start justify-center relative flex overflow-hidden">
         <div className=" z-10 bg-gradient-to-br from-[#663439] to-[#48294E] w-screen h-screen top-0 left-0 fixed">
            <video autoPlay={true} loop controls={false} muted>
               <source src="./video/background.mp4" type="video/mp4" />
            </video>
         </div>
         <HomePage />
      </div>
   );
};

export default Home;
