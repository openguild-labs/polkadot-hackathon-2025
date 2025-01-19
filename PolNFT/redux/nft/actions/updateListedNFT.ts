import { PayloadAction } from "@reduxjs/toolkit";
import type { ListedNFTState, NFTState } from "../nftSlice";

export function updateListedNFT(state: NFTState, action: PayloadAction<{
    id: number;
    data: Partial<ListedNFTState[number]>
}>) {
    state.listed[action.payload.id] = {
        ...state.listed[action.payload.id],
        ...action.payload.data
    }
}
