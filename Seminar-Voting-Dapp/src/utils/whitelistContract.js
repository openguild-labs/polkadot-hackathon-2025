import { ethers } from "ethers";
import WhitelistABI from "../contracts/WhitelistUpgradeableV2.json";

const contractAddress = "0x4c062b016CaF872093f7B4B64E6E4845D193a7c9";

const getWhitelistContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask chưa được cài đặt.");
  }

  if (!ethers.isAddress(contractAddress)) {
    throw new Error("Địa chỉ hợp đồng không hợp lệ.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  try {
    const contract = new ethers.Contract(contractAddress, WhitelistABI.abi, signer);
    console.log("Whitelist contract đã được kết nối:", contract);
    return contract;
  } catch (error) {
    console.error("Lỗi khi tạo đối tượng hợp đồng:", error);
    throw new Error("Không thể kết nối với hợp đồng.");
  }
};

export default getWhitelistContract;