import React from "react";
import "./App.css";
import HomePage from "./pages/home";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Swap from "routes/swap";
import {
  coinbaseWallet,
  metamaskWallet,
  phantomWallet,
  ThirdwebProvider,
  trustWallet,
  walletConnect,
} from "@thirdweb-dev/react";
import AIChat from "routes/ai";

const NotFound = () => {
  return (
    <div>
      <h1
        className="bg-black w-screen h-screen text-white font-extrabold flex justify-center items-center gotham_font
    text-lg"
      >
        404 : Not Found &nbsp;{" "}
        <Link
          to="/"
          className="text-hightGreenColor font-thin italic underline"
        >
          Go Home
        </Link>
      </h1>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/swap/:amountfromurl?/:fromchain?/:tochain?"
          element={
            <ThirdwebProvider
              supportedWallets={[
                metamaskWallet(),
                coinbaseWallet(),
                walletConnect(),
                trustWallet(),
                phantomWallet(),
              ]}
            >
              {" "}
              <Swap />{" "}
            </ThirdwebProvider>
          }
        />
        <Route path="*" element={<NotFound />} />
        <Route path="/aichat" element={<AIChat />} />
      </Routes>
    </Router>
  );
}

export default App;
