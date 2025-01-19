import React from "react";

const initialState = {
    address : '',
    listAddressID : [],
    NFTs: [],
    currentNFTBorrow: {}
}

const vaultReducer = (state=initialState, action:any) => {
    switch (action.type) {
        case "GETNFTVAULT":
            return {
                ...state,
                NFTs: action.nfts
            }
        case "GETADDRESSNFTVAULT":
            return {
                ...state,
                listAddressID: action.nfts
            }
        case "GETCURRENTNFTBORROW":
            return {
                ...state,
                currentNFTBorrow: action.currentNFT
            }
        default: 
          return state
    }
} 

export default vaultReducer