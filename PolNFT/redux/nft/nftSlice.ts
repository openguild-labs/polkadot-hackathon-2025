import { NFTStatus, NFTInfo } from "@/interfaces/nft";
import { createSlice } from "@reduxjs/toolkit";
import { addListedNFT } from "./actions/addListedNFT";
import {updateListedNFT} from "@/redux/nft/actions/updateListedNFT";

export type ListedNFTState = (Pick<NFTInfo, "name" | "img" | "tokenId" | "feePerDay"> & {
    totalFees: number;
    status: NFTStatus;
    collection: string;
    listingDate: string
})[];

export type NFTState = {
    listed: ListedNFTState
}

const initialState: NFTState = {
    listed: []
}

export const {reducer: nftReducer, actions: nftActions} = createSlice({
    name: 'semester',
    initialState,
    reducers: {
        addListedNFT,
        updateListedNFT,
    },
})
