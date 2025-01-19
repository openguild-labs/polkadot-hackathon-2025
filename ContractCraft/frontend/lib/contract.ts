import {
  createThirdwebClient,
  getContract,
} from "thirdweb";
import { defineChain } from "thirdweb/chains";

// create the client with your clientId
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ?? "",
});

// connect to your contract
export const contract = getContract({
  client,
  chain: defineChain(80002), // Mumbai testnet
  address: "0xF77564e712bA1855969A3928524612aAD39F0366",
}); 