import { ethers } from "ethers";
import VotingABI from "../contracts/Voting.json";

const contractAddress = "0xEd3986F78dE2B865D2e2211363B3F4B159a2653C ";

const getVotingContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask chưa được cài đặt.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, VotingABI.abi, signer);
};

export default getVotingContract;