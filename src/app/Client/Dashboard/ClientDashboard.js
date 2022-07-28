import React, { Component } from "react";
// import "";
import "./dashboard.css";
import "bootstrap/dist/css/bootstrap.css";
import history from "../../../history";
import { AlertMessage, ImageName } from "../../../enums";

import DatePicker from "react-datepicker";
import {
  consoleLog,
  SetDatabaseDateFormat,
  SetDateFormat,
  SetUSAdateFormat,
} from "../../../services/common-function";
import { ApiCall } from "../../../services/middleware";
import { Decoder } from "../../../services/auth";
import { ErrorCode } from "../../../services/constant";
import ThreeDotsLoader from "../../Loader/ThreeDotsLoader";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { inputEmptyValidate } from "../../../validators";
import { toast, ToastContainer } from "react-toastify";

const reqData = {
  fromDate: "",
  toDate: "",
  tabType: "",
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "20%",
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

class ClientDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad_interpretation: true,
      isLoad_needAttention: true,
      isLoad_project: true,

      check: false,
      value: 0,
      widgets: [],
      toDate: "",
      fromDate: "",
      tabType: 1,
      interpretationArrData: [],
      projectArrData: [],
      needAttentionArrData: [],
      // .....modal......
      openProject: false,
    };
  }

  componentDidMount() {
    if (!localStorage.getItem("AuthToken")) {
      return history.push("/");
    }
    this.onLoad();
  }

  onLoad = () => {
    let resObj = {
      searchfrom: "",
      searchto: "",
      tabType: 1,
    };
    let mainData = Object.assign(reqData, resObj);

    this.listApi_NeedAttention(mainData);
    this.listApi_Interpretation(mainData);
    this.listApi_Project(mainData);
  };

  listApi_Interpretation = async (data) => {
    consoleLog("req need attention:::", data);
    var interpretationList = [];
    this.setState({
      isLoad_interpretation: true,
    });
    let res = await ApiCall("getDashboardJobListByClient", data);
    // consoleLog("res:::", res);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      let jobList = decodeData.data.jobList;
      consoleLog("decodeData:::", jobList);

      if (jobList && jobList.length > 0) {
        for (let i = 0; i < jobList.length; i++) {
          let modObj = {};
          if (
            jobList[i].requestId == null ||
            jobList[i].requestId == undefined ||
            jobList[i].requestId == ""
          ) {
            modObj["requestId"] = "";
          } else {
            modObj["requestId"] = jobList[i].requestId;
          }
          if (
            jobList[i].date == null ||
            jobList[i].date == undefined ||
            jobList[i].date == ""
          ) {
            modObj["date"] = "";
          } else {
            modObj["date"] = jobList[i].date;
          }
          if (
            jobList[i].jobType == null ||
            jobList[i].jobType == undefined ||
            jobList[i].jobType == ""
          ) {
            modObj["jobType"] = "";
          } else {
            modObj["jobType"] = jobList[i].jobType;
          }
          if (
            jobList[i].time == null ||
            jobList[i].time == undefined ||
            jobList[i].time == ""
          ) {
            modObj["time"] = "";
          } else {
            modObj["time"] = jobList[i].time;
          }
          if (
            jobList[i].location == null ||
            jobList[i].location == undefined ||
            jobList[i].location == ""
          ) {
            modObj["location"] = "";
          } else {
            modObj["location"] = jobList[i].location;
          }
          if (
            jobList[i].appointmentTypeName == null ||
            jobList[i].appointmentTypeName == undefined ||
            jobList[i].appointmentTypeName == ""
          ) {
            modObj["appointmentTypeName"] = "";
          } else {
            modObj["appointmentTypeName"] = jobList[i].appointmentTypeName;
          }
          interpretationList.push(modObj);
        }
        consoleLog("mod", interpretationList)
        this.setState({
          isLoad_interpretation: false,
          interpretationArrData: interpretationList,
        });
      } else {
        this.setState({
          isLoad_interpretation: false,
          interpretationArrData: [],
        });
      }
    }
  };
  listApi_NeedAttention = async (data) => {
    consoleLog("req need attention:::", data);
    var needAttentionList = [];
    this.setState({
      isLoad_needAttention: true,
    });
    let res = await ApiCall("getDashboardQuoteByClient", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      let jobList = decodeData.data.jobList;
      consoleLog("decodeData::need attention:", decodeData);

      if (jobList && jobList.length > 0) {
        for (let i = 0; i < jobList.length; i++) {
          let modObj = {};
          if (
            jobList[i].requestId == null ||
            jobList[i].requestId == undefined ||
            jobList[i].requestId == ""
          ) {
            modObj["requestId"] = "";
          } else {
            modObj["requestId"] = jobList[i].requestId;
          }
          if (
            jobList[i].date == null ||
            jobList[i].date == undefined ||
            jobList[i].date == ""
          ) {
            modObj["date"] = "";
          } else {
            modObj["date"] = jobList[i].date;
          }
          if (
            jobList[i].jobType == null ||
            jobList[i].jobType == undefined ||
            jobList[i].jobType == ""
          ) {
            modObj["jobType"] = "";
          } else {
            modObj["jobType"] = jobList[i].jobType;
          }
          if (
            jobList[i].time == null ||
            jobList[i].time == undefined ||
            jobList[i].time == ""
          ) {
            modObj["time"] = "";
          } else {
            modObj["time"] = jobList[i].time;
          }
          if (
            jobList[i].location == null ||
            jobList[i].location == undefined ||
            jobList[i].location == ""
          ) {
            modObj["location"] = "";
          } else {
            modObj["location"] = jobList[i].location;
          }
          if (
            jobList[i].appointmentTypeName == null ||
            jobList[i].appointmentTypeName == undefined ||
            jobList[i].appointmentTypeName == ""
          ) {
            modObj["appointmentTypeName"] = "";
          } else {
            modObj["appointmentTypeName"] = jobList[i].appointmentTypeName;
          }
          if (
            jobList[i].quoteId == null ||
            jobList[i].quoteId == undefined ||
            jobList[i].quoteId == ""
          ) {
            modObj["quoteId"] = "";
          } else {
            modObj["quoteId"] = jobList[i].quoteId;
          }
          needAttentionList.push(modObj);
        }
        consoleLog("need attention mod", needAttentionList)
        this.setState({
          isLoad_needAttention: false,
          needAttentionArrData: needAttentionList,
        });
      } else {
        this.setState({
          isLoad_needAttention: false,
          needAttentionArrData: [],
        });
      }
    }

  };
  // ......................for project . ........................

  listApi_Project = async (data) => {
    consoleLog("res::project:", data);
    this.setState({
      isLoad_project: true,
    });
    let res = await ApiCall("getDashboardProjectList", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      consoleLog("decodeData:::project data", decodeData);
      if (
        decodeData.data.projectList != [] ||
        decodeData.data.projectList != undefined ||
        decodeData.data.projectList != null ||
        decodeData.data.projectList != "" ||
        decodeData.data.projectList != {}
      ) {
        this.setState({
          isLoad_project: false,
          projectArrData: decodeData.data.projectList,
        });
      } else {
        this.setState({
          projectArrData: [],
        });
      }
    }
  };

  onFromDateChange = (date) => {
    this.setState({
      fromDate: SetUSAdateFormat(date),
    });
  };

  onToDateChange = (date) => {
    this.setState({
      toDate: SetUSAdateFormat(date),
    });
  };

  onTabClick_needAttention = async (value) => {
    this.setState({
      tabType: value,
    });
    if (value == 1) {
      let resObj = {
        searchfrom:
          this.state.fromDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.fromDate),
        searchto:
          this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),

        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_NeedAttention(resObj);
    } else if (value == 2) {
      let resObj = {
        searchfrom:
          this.state.fromDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.fromDate),
        searchto:
          this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),

        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_NeedAttention(resObj);
    }
  };

  // .................interpretation .....................

  onTabClick_interpretation = async (value) => {
    this.setState({
      tabType: value,
    });
    if (value == 1) {
      let resObj = {
        searchfrom:
          this.state.fromDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.fromDate),
        searchto:
          this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),

        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Interpretation(resObj);
    } else if (value == 2) {
      let resObj = {
        searchfrom:
          this.state.fromDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.fromDate),
        searchto:
          this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),

        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Interpretation(resObj);
    }
  };
  // .................project .....................

  onTabClick_project = async (value) => {
    this.setState({
      tabType: value,
    });
    if (value == 1) {
      let resObj = {
        searchfrom:
          this.state.fromDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.fromDate),
        searchto:
          this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),

        tabType: value,
      };

      this.listApi_Project(resObj);
    } else if (value == 2) {
      let resObj = {
        searchfrom:
          this.state.fromDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.fromDate),
        searchto:
          this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),

        tabType: value,
      };

      this.listApi_Project(resObj);
    }
  };

  onApply = async () => {
    let errorCount = 0;

    let validateFromDate = inputEmptyValidate(this.state.fromDate),
      validateToDate = inputEmptyValidate(this.state.toDate);

    if (validateFromDate === false && validateToDate === false) {
      toast.error(AlertMessage.MESSAGE.DATE.EMPTY_DATE);
      errorCount++;
    } else if (validateFromDate === false) {
      toast.error(AlertMessage.MESSAGE.DATE.FROM_EMPTY);
      errorCount++;
    } else if (validateToDate === false) {
      toast.error(AlertMessage.MESSAGE.DATE.TO_EMPTY);
      errorCount++;
    } else if (this.state.fromDate > this.state.toDate) {
      toast.error(AlertMessage.MESSAGE.DATE.TO_LESS_FROM);
      errorCount++;
    }

    if (errorCount === 0) {
      let resObj = {
        searchto: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchfrom: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: this.state.tabType,
      };
      this.listApi_NeedAttention(resObj);
      this.listApi_Interpretation(resObj);
      this.listApi_Project(resObj);

    }

  };

  // .............for open project modal functionality,,,,,

  openDashboardProjectModal = () => {
    this.setState({
      openProject: true,
    });
  };

  closeDashboardProjectModal = () => {
    this.setState({
      openProject: false,
    });
  };
  openTranslationListPage = () => {
    return this.props.history.push("/clientTranslationList")
  }

  openTrainingListPage = () => {
    return this.props.history.push("/clientTrainingList")
  }

  onResetFilter = () => {
    this.setState({
      fromDate: "",
      toDate: "",
    });

    this.onLoad();
  };
  openInterpretationPage = (val) => {
    if (val == "unassigned") {
      return this.props.history.push("/clientUnAssignedJobs")
    } else {
      return this.props.history.push("/clientAssignedJobs")
    }
  }

  render() {
    return (
      <React.Fragment>
        {/* // <div className="wrapper"> */}
        {/* <Header />
        <Sidebar /> */}
        <ToastContainer hideProgressBar theme="colored" />
        <div className="component-wrapper">
          <div className="form-search-app dashboardHead">
            <div className="dash_filter">
              <div className="">
                <span></span>
                <div
                  className="input-group"
                // style={{
                //   width: "100%",
                //   borderRadius: "9px",
                //   height: "41px",
                //   border: "1px solid #ced4da",
                //   boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                // }}
                >
                  <div style={{ width: "80%", padding: "8px" }}>
                    <span className="dateLabel">FROM {this.state.fromDate}</span>
                  </div>
                  <div style={{ width: "20%" }}>
                    <a style={{ float: "right" }}>
                      <DatePicker
                        dropdownMode="select"
                        showMonthDropdown
                        showYearDropdown
                        adjustDateOnChange
                        // minDate={new Date()}
                        onChange={(date) => this.onFromDateChange(date)}
                        customInput={<Schedule />}
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div className="">
                <span></span>
                <div
                  className="input-group"
                // style={{
                //   width: "100%",
                //   borderRadius: "9px",
                //   height: "41px",
                //   border: "1px solid #ced4da",
                //   boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                // }}
                >
                  <div style={{ width: "80%", padding: "8px" }}>
                    <span className="dateLabel">TO {this.state.toDate}</span>
                  </div>
                  <div style={{ width: "20%" }}>
                    <a style={{ float: "right" }}>
                      <DatePicker
                        dropdownMode="select"
                        showMonthDropdown
                        showYearDropdown
                        adjustDateOnChange
                        // minDate={new Date(this.state.fromDate)}
                        onChange={(date) => this.onToDateChange(date)}
                        customInput={<Schedule />}
                      />
                    </a>
                  </div>
                </div>
              </div>

              <div
                className="dash_fil_btn"
              >
                <button
                  type="submit"
                  className="apl-btn"
                  onClick={this.onApply}
                >
                  apply
                </button>
              </div>
              <div className="dash_fil_btn">
                <button className="reset-btn" onClick={this.onResetFilter}>
                  Reset
                </button>
              </div>

            </div>
          </div>
          <div className="page-head-section">
            <h1 className="text-uppercase dash_head">
              Dashboard <span>Client</span>
            </h1>
          </div>
          <div className="_fl dashboard-list">
            <div className="row">
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr1 tbl_two">
                  <div className="dh-head _fl">
                    <h3>Need Attention</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.REQUIRE_WHITE} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li
                      className="nav-item"
                      onClick={() => {
                        this.onTabClick_needAttention(1);
                      }}
                    >
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home"
                      >
                        Quote
                      </a>{" "}
                    </li>
                    <li
                      className="nav-item"
                      onClick={() => {
                        this.onTabClick_needAttention(2);
                      }}
                    >
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu1">
                        Email
                      </a>{" "}
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane  active" id="home">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="javascript:void(0)">View all</a>
                        </p>
                        <div className="_fl _dsbxrow" hidden={!this.state.isLoad_needAttention}>
                          <ThreeDotsLoader />
                        </div>
                        <div className="_fl _dsbxrow" hidden={this.state.isLoad_needAttention}>
                          {this.state.needAttentionArrData.length > 0 ? (
                            <React.Fragment>
                              {this.state.needAttentionArrData.map((obj, i) => (
                                <div className="_fl _ddrow">
                                  <div className="_ddhead">
                                    <p>{obj.requestId}</p>
                                    <p>
                                      {SetDateFormat(obj.date)} | {obj.time}

                                    </p>
                                    <p>
                                      {obj.location == "" ||
                                        obj.location == {} ||
                                        obj.location == [] ||
                                        obj.location == undefined ||
                                        obj.location == null ? (
                                        <React.Fragment />
                                      ) : (
                                        <React.Fragment>
                                          <i
                                            className="fa fa-map-marker"
                                            aria-hidden="true"
                                          ></i>{" "}
                                          {obj.location}
                                        </React.Fragment>
                                      )}
                                    </p>
                                  </div>
                                  <div className="dd_rt">
                                    {" "}
                                    <span>{obj.jobType}</span>{" "}
                                    <a href="#" className="fds" style={{ textDecoration: "none" }}>
                                      {obj.appointmentTypeName}
                                    </a>{" "}
                                  </div>
                                </div>
                              ))}

                            </React.Fragment>
                          ) : <React.Fragment>
                            <p
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                              }}
                            >
                              No Data Found
                            </p>
                          </React.Fragment>}
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane  fade" id="menu1">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="javascript:void(0)">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds" style={{ textDecoration: "none" }}>
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr2 tbl_two">
                  <div className="dh-head _fl">
                    <h3>Interpretation Jobs</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.NOTE_ICON} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li
                      className="nav-item"
                      onClick={() => {
                        this.onTabClick_interpretation(1);
                      }}
                    >
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home_1"
                      >
                        Unassigned
                      </a>{" "}
                    </li>
                    <li
                      className="nav-item"
                      onClick={() => {
                        this.onTabClick_interpretation(2);
                      }}
                    >
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu1_1">
                        Assigned
                      </a>{" "}
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane  active" id="home_1">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="javascript:void(0)" onClick={() => this.openInterpretationPage("unassigned")}>View all</a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_interpretation}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
                          hidden={this.state.isLoad_interpretation}
                        >
                          {this.state.interpretationArrData.length > 0 ? (
                            <React.Fragment>
                              {this.state.interpretationArrData.map((obj, i) => (
                                <div className="_fl _ddrow">
                                  <div className="_ddhead">
                                    <p>{obj.requestId}</p>
                                    <p>
                                      {SetDateFormat(obj.date)} | {obj.time}

                                    </p>
                                    <p>
                                      {obj.location == "" ||
                                        obj.location == {} ||
                                        obj.location == [] ||
                                        obj.location == undefined ||
                                        obj.location == null ? (
                                        <React.Fragment />
                                      ) : (
                                        <React.Fragment>
                                          <i
                                            className="fa fa-map-marker"
                                            aria-hidden="true"
                                          ></i>{" "}
                                          {obj.location}
                                        </React.Fragment>
                                      )}
                                    </p>
                                  </div>
                                  <div className="dd_rt">
                                    {" "}
                                    <span>{obj.jobType}</span>{" "}
                                    <a href="#" className="fds" style={{ textDecoration: "none" }}>
                                      {obj.appointmentTypeName}
                                    </a>{" "}
                                  </div>
                                </div>
                              ))}

                            </React.Fragment>
                          ) : <React.Fragment>
                            <p
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                              }}
                            >
                              No Data Found
                            </p>
                          </React.Fragment>}

                        </div>
                      </div>
                    </div>
                    <div className="tab-pane  fade" id="menu1_1">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="javascript:void(0)" onClick={() => this.openInterpretationPage("assigned")}>View all</a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_interpretation}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div className="_fl _dsbxrow" hidden={this.state.isLoad_interpretation}>
                          {this.state.interpretationArrData.length > 0 ? (
                            <React.Fragment>
                              {this.state.interpretationArrData.map((obj, i) => (
                                <div className="_fl _ddrow">
                                  <div className="_ddhead">
                                    <p>{obj.requestId}</p>
                                    <p>
                                      {SetDateFormat(obj.date)} | {obj.time}

                                    </p>
                                    <p>
                                      {obj.location == "" ||
                                        obj.location == {} ||
                                        obj.location == [] ||
                                        obj.location == undefined ||
                                        obj.location == null ? (
                                        <React.Fragment />
                                      ) : (
                                        <React.Fragment>
                                          <i
                                            className="fa fa-map-marker"
                                            aria-hidden="true"
                                          ></i>{" "}
                                          {obj.location}
                                        </React.Fragment>
                                      )}
                                    </p>
                                  </div>
                                  <div className="dd_rt">
                                    {" "}
                                    <span>{obj.jobType}</span>{" "}
                                    <a href="#" className="fds" style={{ textDecoration: "none" }}>
                                      {obj.appointmentTypeName}
                                    </a>{" "}
                                  </div>
                                </div>
                              ))}

                            </React.Fragment>
                          ) : <React.Fragment>
                            <p
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                              }}
                            >
                              No Data Found
                            </p>
                          </React.Fragment>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr3 tbl_two">
                  <div className="dh-head _fl">
                    <h3>Projects</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.REQUIRE_WHITE} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li
                      className="nav-item"
                      onClick={() => {
                        this.onTabClick_project(1);
                      }}
                    >
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home_4"
                      >
                        Unassigned
                      </a>{" "}
                    </li>
                    <li
                      className="nav-item"
                      onClick={() => {
                        this.onTabClick_project(2);
                      }}
                    >
                      {" "}
                      <a
                        className="nav-link"
                        data-toggle="tab"
                        href="#menu12_4"
                      >
                        Assigned
                      </a>{" "}
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane  active" id="home_4">
                      <div className="_fl _dsbx dash_tab">
                        <p className="_fl viewall text-right">
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.openDashboardProjectModal()}
                          >
                            View all
                          </a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_project}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
                          hidden={this.state.isLoad_project}
                        >
                          {this.state.projectArrData.length > 0 ? (
                            <React.Fragment>
                              {this.state.projectArrData.map((obj, i) => (
                                <React.Fragment key={i}>
                                  <div className="_fl _ddrow">
                                    <div className="_ddhead">
                                      <p
                                        // onClick={() => this.showDetails(obj, i)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {obj.jobId}
                                      </p>
                                      <p>
                                        {SetDateFormat(obj.date)} | {obj.time}
                                      </p>
                                      <p>
                                        {obj.location == "" ||
                                          obj.location == {} ||
                                          obj.location == [] ||
                                          obj.location == undefined ||
                                          obj.location == null ? (
                                          <React.Fragment />
                                        ) : (
                                          <React.Fragment>
                                            <i
                                              className="fa fa-map-marker"
                                              aria-hidden="true"
                                            ></i>{" "}
                                            {obj.location}
                                          </React.Fragment>
                                        )}
                                      </p>
                                    </div>
                                    <div className="dd_rt">
                                      {obj.serviceTypeId == 45 ? (
                                        <a
                                          href="javascript:void(0)"
                                          className="blue_dash_btn"
                                        >
                                          Interpretation
                                        </a>
                                      ) : obj.serviceTypeId == 46 ? (
                                        <a
                                          href="javascript:void(0)"
                                          className="sky_dash_btn"
                                        >
                                          Translation
                                        </a>
                                      ) : obj.serviceTypeId == 47 ? (
                                        <a
                                          href="javascript:void(0)"
                                          className="yellow_dash_btn"
                                        >
                                          Training
                                        </a>
                                      ) : (
                                        <React.Fragment />
                                      )}{" "}
                                    </div>
                                  </div>
                                </React.Fragment>
                              ))}
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <p
                                style={{
                                  fontSize: "12px",
                                  textAlign: "center",
                                }}
                              >
                                No Data Found
                              </p>
                            </React.Fragment>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane  fade" id="menu12_4">
                      <div className="_fl _dsbx dash_tab">
                        <p className="_fl viewall text-right">
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.openDashboardProjectModal()}
                          >
                            View all
                          </a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_project}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
                          hidden={this.state.isLoad_project}
                        >
                          {this.state.projectArrData.length > 0 ? (
                            <React.Fragment>
                              {this.state.projectArrData.map((obj, i) => (
                                <React.Fragment key={i}>
                                  <div className="_fl _ddrow">
                                    <div className="_ddhead">
                                      <p
                                        // onClick={() => this.showDetails(obj, i)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {obj.jobId}
                                      </p>
                                      <p>
                                        {SetDateFormat(obj.date)} | {obj.time}
                                      </p>
                                      <p>
                                        {obj.location == "" ||
                                          obj.location == {} ||
                                          obj.location == [] ||
                                          obj.location == undefined ||
                                          obj.location == null ? (
                                          <React.Fragment />
                                        ) : (
                                          <React.Fragment>
                                            <i
                                              className="fa fa-map-marker"
                                              aria-hidden="true"
                                            ></i>{" "}
                                            {obj.location}
                                          </React.Fragment>
                                        )}
                                      </p>
                                    </div>
                                    <div className="dd_rt">
                                      {obj.serviceTypeId == 45 ? (
                                        <a
                                          href="javascript:void(0)"
                                          className="blue_dash_btn"
                                        >
                                          Interpretation
                                        </a>
                                      ) : obj.serviceTypeId == 46 ? (
                                        <a
                                          href="javascript:void(0)"
                                          className="sky_dash_btn"
                                        >
                                          Translation
                                        </a>
                                      ) : obj.serviceTypeId == 47 ? (
                                        <a
                                          href="javascript:void(0)"
                                          className="yellow_dash_btn"
                                        >
                                          Training
                                        </a>
                                      ) : (
                                        <React.Fragment />
                                      )}{" "}
                                    </div>
                                  </div>
                                </React.Fragment>
                              ))}
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <p
                                style={{
                                  fontSize: "12px",
                                  textAlign: "center",
                                }}
                              >
                                No Data Found
                              </p>
                            </React.Fragment>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* // </div> */}
        <Modal
          open={this.state.openProject}
          onClose={this.closeDashboardProjectModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="projectBtn">
              <span
                href="javascript:void(0)"
                className="sky_dash_btn projectModalBtn"
                onClick={() => this.openTranslationListPage()}
              >
                Translation
              </span>
              <span
                href="javascript:void(0)"
                className="yellow_dash_btn projectModalBtn"
                onClick={() => this.openTrainingListPage()}
              >
                Training
              </span>
            </div>
          </Box>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ClientDashboard;
// ...................................
class Schedule extends React.Component {
  render() {
    const { onClick } = this.props;
    return (
      <img
        style={{
          width: "35px",
          height: "37px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        src={ImageName.IMAGE_NAME.CALENDER4}
        onClick={onClick}
      />
    );
  }
}
