import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { AlertMessage, ImageName } from "../../../../../enums";
import { Decoder } from "../../../../../services/auth";
import {
  consoleLog,
  SetDateFormat,
  SetTimeFormat,
} from "../../../../../services/common-function";
import { ErrorCode } from "../../../../../services/constant";
import { ApiCallVendor } from "../../../../../services/middleware";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";
import "./reminderList.css";
import Switch from "@mui/material/Switch";
import { styled, Box } from "@mui/system"; //imported for modal
import history from "../../../../../history";
import { Link } from "react-router-dom";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 40,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 28,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(22px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#335b7b",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    // transition: theme.transitions.create(["width"], {
    //   duration: 200,
    // }
    // ),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255,255,255,.35)" : "#993921",
    boxSizing: "border-box",
  },
}));

export default class ReminderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
  }
  load = () => {
    this.listApi();
  };

  listApi = async () => {
    let res = await ApiCallVendor("userAlertList", {});
    let alertList = [];
    // consoleLog("response::",res)
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      alertList = decodeData.data.userAlertList;
      // consoleLog("response::", decodeData);

      for (let i = 0; i < alertList.lenght; i++) {
        alertList[i]["reminderCount"] = i + 1;
      }
      this.setState({
        listData: alertList,
      });
    }
  };
   //   ..........add new button.......................
   addNew = () => {
    history.push("/vendorAddReminder");
  };
  editPage = (index) => {
    this.props.history.push({
      pathname: "/vendorEditReminder",
      state: this.state.listData[index],
    });
  };
  deletePage = async(item,key) => {
  
      let status = await ApiCallVendor("deleteUserAlert", { id: item.id });
      // consoleLog("status::", status);
      if (
        status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        this.load();
        toast.success(AlertMessage.MESSAGE.DELETE.DELETED);
        window.scrollTo(0, 0);
      }

  }
  render() {
    return (
      <React.Fragment>
      {/* // <div className="wrapper">
      //   <Header /> */}
        <ToastContainer hideProgressBar theme="colored" />
        {/* <Sidebar /> */}
        <div className="component-wrapper">
        {/* <div
                className="vn_frm"
                style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
              >
                {" "}
                <Link to="/vendorDashboard">Dashboard</Link> / Reminder
              </div> */}
            <div className="reminder_head">
            <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%",width:"20%" }}
          >
            Reminder
          </div>
          <div className="toogle_switch">
          {/* <AntSwitch
            checked={true}
            inputProps={{
              "aria-label": "ant design",
            }}
            name="active"
            // onClick={() => this.onBroadcastStatusChange()}
          /> */}
          </div>
          <div class="addnew new_button" onClick={this.addNew}>
                  <a href="javascript:void(0)">
                    Add New Reminder{" "}
                    <img
                      className=""
                      src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                      style={{ width: "25px", cursor: "pointer" }}
                    />
                  </a>
                </div>
            </div>
          

         
          {this.state.listData.length > 0 ? (<React.Fragment>
            {this.state.listData.map((item, key) => (
            <React.Fragment>
              <div class="">
                <div class="card notify_card">
                  <div
                    className=""
                    type="button"
                    style={{
                      borderRadius: "20px",
                      padding: "20px 0px",
                      backgroundColor: "white",
                    }}
                  >
                    <div>
                      <div className="row notify">
                        <div className="col-md-2">
                          {
                            <img
                              className="bell_img"
                              src={ImageName.IMAGE_NAME.BELL_WITH_TUNE}
                              style={{ width: "40px", marginLeft: "30px" }}
                            ></img>
                          }
                        </div>
                        <div className="col-md-4">
                          <div className="job_details">
                            APPOINTMENT REMINDER {key + 1}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="notify_time">
                            {SetDateFormat(item.date)} |{item.time}{" "}
                            {item.prefix}
                          </div>
                        </div>
                        <div className="col-md-2">
                          <img
                            src={ImageName.IMAGE_NAME.EDIT_SQUARE}
                            style={{ cursor: "pointer" }}
                            id="basic-button"
                            className="serv-cat-edit-btn"
                            onClick={() => this.editPage(key)}
                          />
                          <img
                            src={ImageName.IMAGE_NAME.TRASH_BTN}
                            style={{
                              cursor: "pointer",
                              marginLeft: "10px",
                            }}
                            id="basic-button"
                            className="serv-cat-del-btn"
                              onClick={() => this.deletePage(item,key)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
          </React.Fragment>):(<React.Fragment>
            <div style={{ width: "70%",display:"flex" ,justifyContent:"center",alignItems:"center",color:"#015D83"}}>
                              <td colSpan="7">
                                <center style={{ fontSize: "20px" }}>
                                  No data found !!!
                                </center>
                              </td>
                            </div>
          </React.Fragment>)}
          
        </div>
      {/* </div> */}
      </React.Fragment>
    );
  }
}
