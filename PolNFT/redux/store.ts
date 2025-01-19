import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { nftReducer } from "./nft/nftSlice";

export const store = configureStore({
    reducer: {
        nft: nftReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useThunkDispatch = () => useDispatch<AppDispatch>()
