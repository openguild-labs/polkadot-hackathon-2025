import { PayloadAction } from "@reduxjs/toolkit";
import { ListedNFTState, NFTState } from "../nftSlice";

export function addListedNFT(state: NFTState, action: PayloadAction<ListedNFTState>) {
    state.listed.push(...action.payload);
}
