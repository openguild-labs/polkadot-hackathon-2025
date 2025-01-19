import { ethers } from "ethers";
import SBTAbi from "../contracts/SBT.json";

const SBT_CONTRACT_ADDRESS = "0x7977359ADf9f31BBBff9796889f42BbF2f6A4942";

const getSBTContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask chưa được cài đặt.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(SBT_CONTRACT_ADDRESS, SBTAbi.abi, signer);
};

export default getSBTContract;