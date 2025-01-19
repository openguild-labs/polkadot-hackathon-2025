import React from "react";

const initialState = {
    address : "",
    listAddressID : [],
    NFTs: []

}

const marketReducer = (state=initialState, action:any) => {
    switch (action.type) {
        case "GETNFTMARKET":
            return {
                ...state,
                NFTs: action.nfts
            }
        case "GETADDRESSID":
            return {
                ...state,
                listAddressID: action.nfts
            }
        default: 
          return state
    }
} 

export default marketReducer