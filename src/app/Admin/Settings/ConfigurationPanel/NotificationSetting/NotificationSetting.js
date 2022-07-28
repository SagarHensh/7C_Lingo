import React from "react";
// import "./addPermission.css";
import { ToastContainer, toast } from "react-toastify";
import { InputText, SelectBox } from "../../../SharedComponents/inputText";
import {
  consoleLog,
  getLookUpDataFromAPI,
} from "../../../../../services/common-function";
import history from "../../../../../history";
import { ApiCall } from "../../../../../services/middleware";
import { Decoder } from "../../../../../services/auth";
import { ErrorCode } from "../../../../../services/constant";
import { inputEmptyValidate } from "../../../../../validators";
import { AlertMessage } from "../../../../../enums";
import { Link } from "react-router-dom";

export default class NotificationSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roleName: "",
      userType: "",

      interpreterChecked: 0,
      allUserType: [],
      modulesPermissionData: [],
      selectedUserTypes: {},
      permissionType: [],
      allModulesData: [],
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    // var lookUpData = await getLookUpDataFromAPI();
    // console.log("lookupData>>>>", lookUpData);
    // let arr = [];
    // lookUpData.USER_TYPE.map((data) => {
    //   arr.push({
    //     label: data.name,
    //     value: data.id,
    //   });
    // });

    // let brr = [];
    let moduleDataArr = [];

    let res = await ApiCall("getNotificationConfig");
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(res.data.payload);
      // console.log("Module List>>> ", payload);
      moduleDataArr = payload.data;
    }

    this.setState({
      modulesPermissionData: moduleDataArr,
    });
  };

  roleNameChange = (value) => {
    this.setState({
      roleName: value,
    });
  };

  userTypeChange = (value) => {
    // console.log("value", value)
    this.setState({
      selectedUserTypes: value,
      userType: value.value,
    });
  };

  subTypeChange = (index, value, e) => {
    let stat = 0,
      notificationArr = this.state.modulesPermissionData;
    switch (value) {
      case "interpreter":
        // consoleLog("_---", e.target.checked);
        if (e.target.checked) {
          stat = 1;
        } else {
          stat = 0;
        }

        if (notificationArr[index].interpreter === 0) {
          stat = 1;
        } else {
          stat = 0;
        }

        notificationArr[index].interpreter = stat;
        // consoleLog(">>>>", notificationArr);

        break;
      case "translator":
        // consoleLog("_---", e.target.checked);
        if (e.target.checked) {
          stat = 1;
        } else {
          stat = 0;
        }

        if (notificationArr[index].translator === 0) {
          stat = 1;
        } else {
          stat = 0;
        }

        notificationArr[index].translator = stat;
        // consoleLog(">>>>", notificationArr);

        break;
      case "trainer":
        // consoleLog("_---", e.target.checked);
        if (e.target.checked) {
          stat = 1;
        } else {
          stat = 0;
        }

        if (notificationArr[index].trainer === 0) {
          stat = 1;
        } else {
          stat = 0;
        }

        notificationArr[index].trainer = stat;
        // consoleLog(">>>>", notificationArr);

        break;
      case "clientAdmin":
        // consoleLog("_---", e.target.checked);
        if (e.target.checked) {
          stat = 1;
        } else {
          stat = 0;
        }

        if (notificationArr[index].clientAdmin === 0) {
          stat = 1;
        } else {
          stat = 0;
        }

        notificationArr[index].clientAdmin = stat;
        // consoleLog(">>>>", notificationArr);

        break;
      case "requestor":
        // consoleLog("_---", e.target.checked);
        if (e.target.checked) {
          stat = 1;
        } else {
          stat = 0;
        }

        if (notificationArr[index].requestor === 0) {
          stat = 1;
        } else {
          stat = 0;
        }

        notificationArr[index].requestor = stat;
        // consoleLog(">>>>", notificationArr);

        break;
      case "supervisor":
        // consoleLog("_---", e.target.checked);
        if (e.target.checked) {
          stat = 1;
        } else {
          stat = 0;
        }

        if (notificationArr[index].supervisor === 0) {
          stat = 1;
        } else {
          stat = 0;
        }

        notificationArr[index].supervisor = stat;
        // consoleLog(">>>>", notificationArr);

        break;
      case "admin":
        // consoleLog("_---", e.target.checked);
        if (e.target.checked) {
          stat = 1;
        } else {
          stat = 0;
        }

        if (notificationArr[index].admin === 0) {
          stat = 1;
        } else {
          stat = 0;
        }

        notificationArr[index].admin = stat;
        // consoleLog(">>>>", notificationArr);

        break;
    }

    this.setState({
      modulesPermissionData: notificationArr,
    });
  };

  onAdd = async () => {
    window.scrollTo(0, 0);

    // consoleLog("response:::", this.state.modulesPermissionData);

    let arr = [];
    for (let i = 0; i < this.state.modulesPermissionData.length; i++) {
      arr.push({
        id: this.state.modulesPermissionData[i].id,
        interpreter: this.state.modulesPermissionData[i].interpreter.toString(),
        translator: this.state.modulesPermissionData[i].translator.toString(),
        trainer: this.state.modulesPermissionData[i].trainer.toString(),
        clientAdmin: this.state.modulesPermissionData[i].clientAdmin.toString(),
        requestor: this.state.modulesPermissionData[i].requestor.toString(),
        supervisor: this.state.modulesPermissionData[i].supervisor.toString(),
        admin: this.state.modulesPermissionData[i].admin.toString(),
      });
    }

    // consoleLog("arr:::", arr);

    let res = await ApiCall("updateNotificationConfig", {
      notifiationConfig: arr,
    });

    // consoleLog("response:::", res);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(res.data.message);
      this.load();
    } else {
      toast.success(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
    }
  };

  onBack = () => {
    return history.push("/adminNotificationList");
  };

  render() {
    const selectedStatus = this.state.selectedUserTypes;
    return (
      <React.Fragment>
        <ToastContainer hideProgressBar theme="colored" />
        <div className="component-wrapper">
        <div
              className="vn_frm"
              style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
            >
              {" "}
              <Link to="/adminDashboard">Dashboard</Link> / Notification 
            </div>
          <div className="department-component-app _fl sdw">
            <h3>Notifications</h3>

            <div className="department-form">
              <div className="table-listing-app">
                <div className="table-responsive">
                  <table
                    width="100%"
                    border="0"
                    cellPadding="0"
                    cellSpacing="0"
                  >
                    <tr>
                      <th style={{ width: "15%" }}>Notifications</th>
                      <th style={{ width: "12%" }}>Interpreter</th>
                      <th style={{ width: "12%" }}>Translator</th>
                      <th style={{ width: "12%" }}>Trainer</th>
                      <th style={{ width: "12%" }}>Client Admin</th>
                      <th style={{ width: "12%" }}>Requester</th>
                      <th style={{ width: "12%" }}>Supervisor</th>
                      <th style={{ width: "12%" }}>7C Admin</th>
                    </tr>
                    {this.state.modulesPermissionData.map((data, i) => (
                      <tr key={i}>
                        <td colSpan="8">
                          <div
                            className="tble-row"
                            style={{ padding: "8px 0px" }}
                          >
                            <table
                              width="100%"
                              border="0"
                              cellPadding="0"
                              cellSpacing="0"
                            >
                              <tr>
                                <td style={{ width: "15%" }}>{data.rowName}</td>
                                <td
                                  style={{
                                    width: "12%",
                                    display: "inline-block",
                                  }}
                                >
                                  <label className="checkbox_btn">
                                    <input
                                      type="checkbox"
                                      name="pp"
                                      checked={
                                        data.interpreter === 0 ? false : true
                                      }
                                      onChange={(e) =>
                                        this.subTypeChange(i, "interpreter", e)
                                      }
                                    />
                                    <span
                                      class="checkmark3"
                                      style={{ marginLeft: "-17px" }}
                                    ></span>
                                  </label>
                                </td>
                                <td
                                  style={{
                                    width: "12%",
                                    display: "inline-block",
                                  }}
                                >
                                  <label
                                    className="checkbox_btn"
                                    // style={{ marginLeft: "-17px" }}
                                  >
                                    <input
                                      type="checkbox"
                                      name="pp"
                                      checked={
                                        data.translator === 0 ? false : true
                                      }
                                      onChange={(e) =>
                                        this.subTypeChange(i, "translator", e)
                                      }
                                    />
                                    <span className="checkmark3"></span>
                                  </label>
                                </td>
                                <td
                                  style={{
                                    width: "12%",
                                    display: "inline-block",
                                  }}
                                >
                                  <label className="checkbox_btn">
                                    <input
                                      type="checkbox"
                                      name="pp"
                                      checked={
                                        data.trainer === 0 ? false : true
                                      }
                                      onChange={(e) =>
                                        this.subTypeChange(i, "trainer", e)
                                      }
                                    />
                                    <span
                                      className="checkmark3"
                                      style={{ marginLeft: "17px" }}
                                    ></span>
                                  </label>
                                </td>
                                <td
                                  style={{
                                    width: "12%",
                                    display: "inline-block",
                                  }}
                                >
                                  <label
                                    className="checkbox_btn"
                                    // style={{ marginLeft: "17px !important" }}
                                  >
                                    <input
                                      type="checkbox"
                                      name="pp"
                                      checked={
                                        data.clientAdmin === 0 ? false : true
                                      }
                                      onChange={(e) =>
                                        this.subTypeChange(i, "clientAdmin", e)
                                      }
                                    />
                                    <span
                                      className="checkmark3"
                                      style={{ marginLeft: "35px" }}
                                    ></span>
                                  </label>
                                </td>
                                <td
                                  style={{
                                    width: "12%",
                                    display: "inline-block",
                                  }}
                                >
                                  <label className="checkbox_btn">
                                    <input
                                      type="checkbox"
                                      name="pp"
                                      checked={
                                        data.requestor === 0 ? false : true
                                      }
                                      onChange={(e) =>
                                        this.subTypeChange(i, "requestor", e)
                                      }
                                    />
                                    <span
                                      className="checkmark3"
                                      style={{ marginLeft: "50px" }}
                                    ></span>
                                  </label>
                                </td>
                                <td
                                  style={{
                                    width: "12%",
                                    display: "inline-block",
                                  }}
                                >
                                  <label className="checkbox_btn">
                                    <input
                                      type="checkbox"
                                      name="pp"
                                      checked={
                                        data.supervisor === 0 ? false : true
                                      }
                                      onChange={(e) =>
                                        this.subTypeChange(i, "supervisor", e)
                                      }
                                    />
                                    <span
                                      className="checkmark3"
                                      style={{ marginLeft: "70px" }}
                                    ></span>
                                  </label>
                                </td>
                                <td
                                  style={{
                                    width: "12%",
                                    display: "inline-block",
                                  }}
                                >
                                  <label className="checkbox_btn">
                                    <input
                                      type="checkbox"
                                      name="pp"
                                      checked={data.admin === 0 ? false : true}
                                      onChange={(e) =>
                                        this.subTypeChange(i, "admin", e)
                                      }
                                    />
                                    <span
                                      className="checkmark3"
                                      style={{ marginLeft: "90px" }}
                                    ></span>
                                  </label>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            </div>

            <div className="_button-style m30 _fl text-center">
              <a
                className="white-btn"
                style={{ textDecoration: "none" }}
                onClick={this.onBack}
              >
                back
              </a>
              <a
                className="blue-btn"
                style={{ textDecoration: "none" }}
                onClick={this.onAdd}
              >
                submit
              </a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
