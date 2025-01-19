import { ethers } from "ethers";
import seminarNFTABI from "../contracts/SeminarNFT.json";

const CONTRACT_ADDRESS = "0x1029d348A08B35259503bE8FE9014fBBDFcc6a0E";

const getSeminarNFTContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask chưa được cài đặt.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, seminarNFTABI.abi, signer);
};

export default getSeminarNFTContract;