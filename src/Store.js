import { createStore } from "redux";
import RootReducer from "./store/CombineReducer/index";

const store = createStore(
  RootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
