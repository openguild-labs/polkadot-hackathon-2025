import { combineReducers } from "@reduxjs/toolkit";
import signerReducer from "./signerReducer";
import marketReducer from "./marketReducer";
import vaultReducer from "./vaultReducer";

const rootReducer = combineReducers({
    signerReducer,
    marketReducer,
    vaultReducer
});

export default rootReducer;