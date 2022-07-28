import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import { AlertMessage, ImageName } from "../../../../enums";
import history from "../../../../history";
import { Decoder } from "../../../../services/auth";
import {
  consoleLog,
  getLookUpDataFromAPI,
} from "../../../../services/common-function";
import { ErrorCode } from "../../../../services/constant";
import { ApiCall } from "../../../../services/middleware";
import { styled, Box } from "@mui/system"; //imported for modal
import Switch from "@mui/material/Switch";

import "./configuration.css";
import { InputText, SelectBox } from "../../SharedComponents/inputText";
import { Link } from "react-router-dom";
import { Draggable } from "react-drag-reorder";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 40,
  height: 20,
  padding: 0,
  borderRadius: "30px/50px",
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 30,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 3,
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
    width: 14,
    height: 14,
    borderRadius: 7,
    // transition: theme.transitions.create(["width"], {
    //   duration: 200,
    // }
    // ),
  },
  "& .MuiSwitch-track": {
    borderRadius: 10 / 50,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255,255,255,.35)" : "#993921",
    boxSizing: "border-box",
  },
}));

const hourArr = [
  {
    label: "Hour",
    value: 0,
  },
  {
    label: "Minutes",
    value: 1,
  },
];
const radiusArr = [];
const timeArr = [];
const shortlistArr = ["Total Cost", "Distance", "Relationship", "gender"];

export default class ConfigurationPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      broadcastStatus: 0,
      confirmStatus: 0,
      interpreterNo: "",
      notifyArr: [],
      notifyData: "",
      timeData: {},
      areaArr: [],
      areaData: "",
      shortlistArr: [],
      shortlistData: "",
      newCriteriaList: [],
    };
  }

  componentDidMount() {
    let mainData = this.props.location;
    let preData = mainData.state;
    // console.log("______", preData);
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    // consoleLog(">>>>>>>>>>>>", detailData);
    this.listApi();
  };

  listApi = async (data) => {
    let notifyObj = {},
      radiusObj = {},
      shortlistArrData = [],
      shortlistObj = {},
      timeObj = {};
    let val = {
      lookuptype: "SHORTLIST_CRITERIA_TYPE",
    };
    let lookres = await ApiCall("getlookuplistbylookuptype", val);
    const res = await ApiCall("getConfigurationDetails");
    let lookUpRes = await getLookUpDataFromAPI();

    // console.log("resData::::", Decoder.decode(lookres.data.payload));
    if (
      lookres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      lookres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let lookupdecodeData = Decoder.decode(lookres.data.payload);
      // console.log("Payload data>>>", lookupdecodeData.data.lookupdata);

      for (let h = 0; h < lookupdecodeData.data.lookupdata.length; h++) {
        // shortlistArr.push({
        //   label: lookupdecodeData.data.lookupdata[h].name,
        //   value: lookupdecodeData.data.lookupdata[h].id,
        // })

        shortlistArrData.push({
          label: lookupdecodeData.data.lookupdata[h].name,
          value: lookupdecodeData.data.lookupdata[h].id,
        });
      }

      consoleLog("%%%%5", shortlistArrData);

      this.setState({
        shortlistArr: shortlistArrData,
      });
    }

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      // console.log("Configuration DAta>>>", decodeData);

      for (let m = 0; m < 60; m++) {
        radiusArr.push({
          label: (m + 1).toString(),
          value: m + 1,
        });
        timeArr.push({
          label: (m + 1).toString(),
          value: m + 1,
        });
      }

      for (let i = 0; i < timeArr.length; i++) {
        if (decodeData.data[1].notifyTimeBeforeJob === timeArr[i].label) {
          notifyObj = {
            label: timeArr[i].label,
            value: timeArr[i].value,
          };
        }
      }
      for (let j = 0; j < hourArr.length; j++) {
        if (decodeData.data[1].notifyTimeUnit === hourArr[j].label) {
          timeObj = {
            label: hourArr[j].label,
            value: hourArr[j].value,
          };
        }
      }

      for (let k = 0; k < radiusArr.length; k++) {
        if (decodeData.data[1].radius === radiusArr[k].value) {
          radiusObj = {
            label: radiusArr[k].label,
            value: radiusArr[k].value,
          };
        }
      }

      for (let l = 0; l < shortlistArrData.length; l++) {
        if (decodeData.data[1].criteria === shortlistArrData[l].value) {
          shortlistObj = {
            label: shortlistArrData[l].label,
            value: shortlistArrData[l].value,
          };
        }
      }

      this.setState({
        interpreterNo: decodeData.data[1].noOfInterpreter,
        broadcastStatus: decodeData.data[1].autoBroadcast,
        confirmStatus: decodeData.data[1].autoConfirm,
        notifyData: notifyObj,
        timeData: timeObj,
        areaData: radiusObj,
        shortlistData: shortlistObj,
      });
    }
  };

  onInterpreterNoChange = (data) => {
    this.setState({
      interpreterNo: data,
    });
  };
  onNotifyInerpreterChange = (data) => {
    let obj = { value: data.value, label: data.label };
    this.setState({ notifyData: obj }); //  convert to obj
  };
  onInterpreterAreaChange = (data) => {
    let obj = { value: data.value, label: data.label };
    this.setState({ areaData: obj }); //  convert to obj
  };
  onTimeFormatChange = (data) => {
    this.setState({ timeData: data }); //  convert to obj
  };
  onShortlistChange = (data) => {
    let obj = { value: data.value, label: data.label };
    this.setState({ shortlistData: obj }); //  convert to obj
  };
  onBroadcastStatusChange = async (index) => {
    let stat = 0;
    if (this.state.broadcastStatus === 0) {
      stat = 1;
      toast.success("Auto Broadcasting Enabled");
    } else {
      stat = 0;
      toast.error("Auto Broadcasting Disabled");
    }

    this.setState({
      broadcastStatus: stat,
    });

    // let data = {
    //   staffid: arrData[index].userId,
    //   status: stat.toString(),
    //   staffusertypetd: arrData[index].userTypeId,
    // };

    // let status = await ApiCall("adminstaffstatuschange", data);
    // if (
    //   status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {

    //   toast.success(AlertMessage.MESSAGE.UPDATE_STATUS.SUCCESS);
    // }
  };
  onConfirmStatusChange = async (index) => {
    let stat = 0;
    if (this.state.confirmStatus === 0) {
      stat = 1;
      toast.success("Auto Confirmation Enabled");
    } else {
      stat = 0;
      toast.error("Auto Confirmation Disabled");
    }

    this.setState({
      confirmStatus: stat,
    });

    // let arrData = this.state.listData;
    // let stat = 0;
    // if (arrData[index].status === 0) {
    //   stat = 1;
    // } else {
    //   stat = 0;
    // }
    // arrData[index].status = stat;
    // this.setState({
    //   listData: arrData,
    // });

    // let data = {
    //   staffid: arrData[index].userId,
    //   status: stat.toString(),
    //   staffusertypetd: arrData[index].userTypeId,
    // };

    // let status = await ApiCall("adminstaffstatuschange", data);
    // if (
    //   status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {

    //   toast.success(AlertMessage.MESSAGE.UPDATE_STATUS.SUCCESS);
    // }
  };

  getChangedPos = (currentPos, newPos) => {
    console.log(currentPos, newPos);
    let arr = [];
    //  shortlistArr.map((obj) => {

    //  })
    // shortlistArr[currentPos]
    const newItems = shortlistArr;
    // newItems.splice(newIndex, 0, newItems.splice(oldIndex, 1)[0]).forEach((item,index)=>{
    //   item.order = index;
    // });
    newItems
      .splice(newPos, 0, newItems.splice(currentPos, 1)[0])
      .forEach((item, index) => {
        consoleLog("item", item);
        item.order = index;
      });

    consoleLog("newarr", newItems);
    this.setState({
      newCriteriaList: shortlistArr,
    });
  };

  onCancel = () => {
    return history.push("/adminDashboard");
  };

  onUpdate = async () => {
    let data = {
      autoBroadcast: this.state.broadcastStatus.toString(),
      autoConfirm: this.state.confirmStatus.toString(),
      noOfInterpreter: this.state.interpreterNo,
      notifyTimeBeforeJob: this.state.notifyData.label,
      notifyTimeUnit:
        this.state.timeData.label == null ||
        this.state.timeData.label == undefined
          ? ""
          : this.state.timeData.label,
      radius: this.state.areaData.label,
      criteria: this.state.newCriteriaList.toString(),
      userType: 4,
      id: 2,
    };

    consoleLog("::::::::::::", data);
    let res = await ApiCall("updateConfigurationDetails", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      window.scrollTo(0, 0);
      toast.success(AlertMessage.MESSAGE.CONFIGURATION.UPDATE_VENDOR_SUCCESS);
    } else {
      toast.success(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
    }
  };

  dragEnter = (currentPos, newPos) => {
    console.log("current", currentPos);
    console.log("new", newPos);
    //  dragOverItem.current = position;
    //console.log(e.target.innerHTML);
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer hideProgressBar theme="colored" autoClose={1000} />
        <div className="component-wrapper activ_project_rqst_clnt cofigpanl">
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            {" "}
            <Link to="/adminDashboard">Dashboard</Link> / Configuration Panel
          </div>{" "}
          <h2>Configration Panel</h2>
          <div className="job-details-tab _fl sdw cofigpanl_wid">
            <div className="cofigpanl_top">
              <div className="row">
                <div class="col-md-8">
                  <ul className="nav nav-tabs" style={{ marginTop: "2px" }}>
                    {/* <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link configuration_tab"
                        data-toggle="tab"
                        href="#clientsetting"
                      >
                        <div className="taber" style={{ paddingTop: "9px" }}>
                          <figure>
                            <img src={ImageName.IMAGE_NAME.TABUSERICON} />
                          </figure>
                          Client Settings
                        </div>
                      </a>{" "}
                    </li> */}
                    <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link configuration_tab active"
                        data-toggle="tab"
                        href="#vendorsetting"
                      >
                        <div className="taber" style={{ paddingTop: "9px" }}>
                          <figure>
                            <img src={ImageName.IMAGE_NAME.JOB_DETAILS} />
                          </figure>{" "}
                          Vendor Settings
                        </div>
                      </a>{" "}
                    </li>
                  </ul>
                </div>
                <div class="col-md-4">
                  <div class="web_btn f-right">
                    <a href="javascript:void(0)" onClick={this.onCancel}>
                      Cancel
                    </a>
                    <a
                      href="javascript:void(0)"
                      class="blue"
                      onClick={this.onUpdate}
                    >
                      Update
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="tab-content">
              <div className="tab-pane" id="clientsetting">
                <div className="job-section-tab">
                  <div className="job-section-tab">
                    <div className="my-form-hd _fl">
                      <h3 className="open">Job Automation </h3>

                      <div className="swize" style={{ display: "flex" }}>
                        <label>Auto Broadcasting</label>
                        {this.state.broadcastStatus === 1 ? (
                          <AntSwitch
                            checked={true}
                            inputProps={{
                              "aria-label": "ant design",
                            }}
                            name="active"
                            onClick={() => this.onBroadcastStatusChange()}
                          />
                        ) : (
                          <AntSwitch
                            checked={false}
                            inputProps={{
                              "aria-label": "ant design",
                            }}
                            name="active"
                            onClick={() => this.onBroadcastStatusChange()}
                          />
                        )}
                      </div>
                      <div className="swize" style={{ display: "flex" }}>
                        <label>Auto Confirmation</label>
                        {this.state.confirmStatus === 1 ? (
                          <AntSwitch
                            checked={true}
                            inputProps={{
                              "aria-label": "ant design",
                            }}
                            name="active"
                            onClick={() => this.onConfirmStatusChange()}
                          />
                        ) : (
                          <AntSwitch
                            checked={false}
                            inputProps={{
                              "aria-label": "ant design",
                            }}
                            name="active"
                            onClick={() => this.onConfirmStatusChange()}
                          />
                        )}
                      </div>

                      <div
                        className="my-form-bx-bo"
                        style={{ display: "block" }}
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form_rbx">
                              {" "}
                              <span className="">
                                Application should send notification to how many
                                Interpreters?
                              </span>
                              <InputText
                                placeholder=""
                                className="in-field2"
                                value={this.state.interpreterNo}
                                onTextChange={(value) => {
                                  this.onInterpreterNoChange(value);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form_rbx">
                              {" "}
                              <span className="lbl">
                                Notify Interpreters before start of Job
                              </span>
                              <SelectBox
                                optionData={timeArr}
                                value={this.state.notifyData}
                                placeholder="Select"
                                onSelectChange={(value) => {
                                  this.onNotifyInerpreterChange(value);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form_rbx">
                              {" "}
                              <span
                                className="lbl"
                                style={{ marginBottom: "24px" }}
                              >
                                Hr/Min
                              </span>
                              <SelectBox
                                optionData={hourArr}
                                value={this.state.timeData}
                                placeholder="hr/min"
                                onSelectChange={(value) => {
                                  this.onTimeFormatChange(value);
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="form_rbx">
                              {" "}
                              <span>
                                Local Interpreters should be available within
                              </span>
                              <SelectBox
                                optionData={radiusArr}
                                value={this.state.areaData}
                                placeholder="Enter Radius (mi)"
                                onSelectChange={(value) => {
                                  this.onInterpreterAreaChange(value);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form_rbx">
                              {" "}
                              <span>Criteria to shortlist Translators</span>
                              <SelectBox
                                optionData={this.state.shortlistArr}
                                value={this.state.shortlistData}
                                placeholder="Select"
                                onSelectChange={(value) => {
                                  this.onShortlistChange(value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane active" id="vendorsetting">
                <div className="job-section-tab">
                  <div className="job-section-tab">
                    <div className="my-form-hd _fl">
                      <h3 className="open">Job Automation </h3>

                      <div className="swize" style={{ display: "flex" }}>
                        <label>Auto Broadcasting</label>
                        {this.state.broadcastStatus === 1 ? (
                          <AntSwitch
                            checked={true}
                            inputProps={{
                              "aria-label": "ant design",
                            }}
                            name="active"
                            onClick={() => this.onBroadcastStatusChange()}
                          />
                        ) : (
                          <AntSwitch
                            checked={false}
                            inputProps={{
                              "aria-label": "ant design",
                            }}
                            name="active"
                            onClick={() => this.onBroadcastStatusChange()}
                          />
                        )}
                      </div>
                      <div className="swize" style={{ display: "flex" }}>
                        <label>Auto Confirmation</label>
                        {this.state.confirmStatus === 1 ? (
                          <AntSwitch
                            checked={true}
                            inputProps={{
                              "aria-label": "ant design",
                            }}
                            name="active"
                            onClick={() => this.onConfirmStatusChange()}
                          />
                        ) : (
                          <AntSwitch
                            checked={false}
                            inputProps={{
                              "aria-label": "ant design",
                            }}
                            name="active"
                            onClick={() => this.onConfirmStatusChange()}
                          />
                        )}
                      </div>

                      <div
                        className="my-form-bx-bo"
                        style={{ display: "block" }}
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form_rbx">
                              {" "}
                              <span className="lbl">
                                Application should send notification to how many
                                Interpreters?
                              </span>
                              <InputText
                                placeholder=""
                                className="in-field2"
                                value={this.state.interpreterNo}
                                onTextChange={(value) => {
                                  this.onInterpreterNoChange(value);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form_rbx">
                              {" "}
                              <span className="lbl">
                                Notify Interpreters before start of Job
                              </span>
                              <SelectBox
                                optionData={timeArr}
                                value={this.state.notifyData}
                                placeholder="Select"
                                onSelectChange={(value) => {
                                  this.onNotifyInerpreterChange(value);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form_rbx">
                              {" "}
                              <span
                                className="lbl"
                                style={{ marginBottom: "24px" }}
                              >
                                Hr/Min
                              </span>
                              <SelectBox
                                optionData={hourArr}
                                value={this.state.timeData}
                                placeholder="hr/min"
                                onSelectChange={(value) => {
                                  this.onTimeFormatChange(value);
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="form_rbx">
                              {" "}
                              <span>
                                Local Interpreters should be available within
                              </span>
                              <SelectBox
                                optionData={radiusArr}
                                value={this.state.areaData}
                                placeholder="Enter Radius (mi)"
                                onSelectChange={(value) => {
                                  this.onInterpreterAreaChange(value);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            {/* <div className="form_rbx"> */}
                            <span
                              style={{
                                color: "grey",
                                fontSize: "13px",
                                fontWeight: "400",
                              }}
                            >
                              Criteria to shortlist Translators
                            </span>
                            <div className="flex-container">
                              <div className="row">
                                <Draggable onPosChange={this.getChangedPos}>
                                  {shortlistArr.map((obj, idx) => {
                                    return (
                                      <div
                                        key={idx}
                                        style={{
                                          width: "300px",

                                          padding: "10px",
                                          border: "1px solid hsl(0, 0%, 80%)",
                                          marginBottom: "5px",
                                          borderRadius: "10px",
                                          boxShadow:
                                            "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                        }}
                                        // onDragEnter={(e) => this.dragEnter(e, idx)}
                                        // onPosChange={this.dragEnter}
                                        className="flex-item"
                                        // draggable
                                      >
                                        {obj}
                                      </div>
                                    );
                                  })}
                                </Draggable>
                              </div>
                            </div>
                            {/* <span>Criteria to shortlist Translators</span>
                              <SelectBox
                                optionData={this.state.shortlistArr}
                                value={this.state.shortlistData}
                                placeholder="Select"
                                onSelectChange={(value) => {
                                  this.onShortlistChange(value);
                                }}
                              /> */}
                            {/* </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
