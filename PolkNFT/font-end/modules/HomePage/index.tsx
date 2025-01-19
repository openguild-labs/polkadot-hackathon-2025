"use client";
import { Banner, Navbar, TrendingNFT, AIGen, Airdrop, AISupport, Footer, BiddingOnLending, EventList } from '@/components';
import React from 'react'

function HomePage() {
  return (
    <div className=' w-full z-20 justify-center items-center flex flex-col '>
        <Navbar/>
        <Banner/>
        <TrendingNFT/>
        <BiddingOnLending/>
        <EventList/>
        <AIGen/>
        <Airdrop/>
        <AISupport/>
        <Footer/>
    </div>
  )
}

export default HomePage;