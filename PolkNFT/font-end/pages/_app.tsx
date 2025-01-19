import { NextPage } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import "../public/css/loading.css";
import "../public/css/globals.css";
import "../public/css/local.css";
import { Provider } from "react-redux";
import myStore from "@/script/store/store";
import { useState } from "react";
import { BlockchainProvider } from "@/utils/provider/provider";
import { Web3Modal } from "./layout/web3Modal";

const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps) => {
   return (
      <>
         <Head>
            <title>PolkNFT</title>
            <meta name="description" content="Solana NFT Marketplace" />
            <meta name="author" content="Tommy" />
            <meta
               name="keywords"
               content="blockchain consultant, solana, nft marketplace"
            />
            <meta property="og:title" content="Charity Blue" />
            <meta property="og:url" content="" />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="" />
            <meta property="og:site-name" content="Solana NFT Marketplace" />
            <meta property="og:description" content="Solana NFT Marketplace" />
            <meta property="og:image:alt" content="Solana NFT Marketplace" />
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="icon" href="../images/_logo.ico" />
         </Head>
         <Web3Modal>
            <Provider store={myStore}>
               <BlockchainProvider>
                  <Component {...pageProps} />
               </BlockchainProvider>
            </Provider>
         </Web3Modal>
      </>
   );
};

export default MyApp;
