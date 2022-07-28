import { combineReducers } from "redux";
import DashboardReducer from "../../app/Admin/Dashboard/Reducer/DashboardReducer";
import HeaderReducer from "../../app/Admin/Header/Reducer/HeaderReducer";
import MainReducer from "./reducers/MainReducer";

const RootReducer = combineReducers({
  dashboardData: DashboardReducer,
  headerData: HeaderReducer,
  mainData: MainReducer,
});
export default RootReducer;
