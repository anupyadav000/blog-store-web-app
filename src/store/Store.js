import { legacy_createStore as CreateStore } from "redux";
import { myReducer } from "../reducer/Reducer";
import { initialState } from "../state/State";

const store = CreateStore(myReducer, initialState);

export default store;
