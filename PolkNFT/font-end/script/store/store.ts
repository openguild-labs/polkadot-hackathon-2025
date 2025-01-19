import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducer/reducers";

const myStore = createStore(
    rootReducer,
//    applyMiddleware(...middleware)
)

export default myStore