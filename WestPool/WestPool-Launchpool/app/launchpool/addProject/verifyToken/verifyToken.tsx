"use client";
import { useVerifiedToken, VerifiedTokenState } from "@/app/zustand/store";
import axios from "axios";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useState } from "react";

const VerifyTokenPage = () => {
  const setVerifiedToken = useVerifiedToken(
    (state) => (state as VerifiedTokenState).setVerifiedToken
  );
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [signedMessage, setSignedMessage] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async () => {
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // if (!signedMessage) {
    //   const signer = provider.getSigner();
    //   const signature = await signer.signMessage(
    //     `Guarantee this is your token address: ${tokenAddress}`
    //   );
    //   setSignedMessage(true);
    //   console.log(signature);
    // }

    if(tokenAddress === "") {
      alert("Please enter your token address");
      return;
    }

    try {
      console.log("Token verified");
      setVerifiedToken(tokenAddress);
      router.push("/launchpool/addProject/projectBasis");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center mb-52">
      <div
        className="w-[90%] max-w-4xl p-8 bg-white rounded-3xl 
      shadow-[0px_10px_20px_rgba(109,147,205,0.5),0px_-10px_20px_rgba(109,147,205,0.5),10px_0px_20px_rgba(109,147,205,0.5),-10px_0px_20px_rgba(109,147,205,0.5)]"
      >
        <div className="text-center text-lg font-semibold mb-4 text-[#2f2f2f]">
          Token Address
        </div>
        <div className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter your token address"
            className="w-full px-4 py-5 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none bg-[#f3f3f3] text-black"
            onChange={(e) => setTokenAddress(e.target.value)}
          />
          <button
            className="mt-6 w-2/3 px-4 py-4 bg-[#6d93cd] text-white font-semibold rounded-3xl hover:bg-[#2a5697]"
            onClick={handleSubmit}
            disabled={signedMessage}
          >
            Verify Ownership
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyTokenPage;
