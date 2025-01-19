import React from "react";

const initialState = {
    address : "",
    avartar: "",
    background: "",
    NFTs: []
}

const signerReducer = (state=initialState, action:any) => {
    switch (action.type) {
        case "UPDATEADDRESS":
            return {
                ...state,
                address: action.address_Signer
            }
        case "UPDATENFTS":
            return {
                ...state,
                NFTs: action.nfts_Signer
            }
        default: 
          return state
    }
} 

export default signerReducer