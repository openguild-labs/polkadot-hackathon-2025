import { ListedNFTState } from "./nft/nftSlice";
import { RootState } from "./store";

export const listedNFTSelector = (state: RootState): ListedNFTState => state.nft.listed;
