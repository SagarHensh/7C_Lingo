import React, { Component } from "react";
// import "";
import "./dashboard.css";
import ReactDOM from "react-dom";
import TextField from "@mui/material/TextField";
import "bootstrap/dist/css/bootstrap.css";


import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import "../../../Styles/style.css";

import DatePicker from "react-datepicker";
import history from "../../../history";
import { AlertMessage, ImageName } from "../../../enums";
import { ErrorCode } from "../../../services/constant";
import { consoleLog, SetDatabaseDateFormat, SetDateFormat, SetTimeFormat, SetUSAdateFormat } from "../../../services/common-function";
import { ApiCall, ApiCallVendor } from "../../../services/middleware";
import { Decoder } from "../../../services/auth";
import ThreeDotsLoader from "../../Loader/ThreeDotsLoader";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { toast, ToastContainer } from "react-toastify";
import { inputEmptyValidate } from "../../../validators";

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

class VendorDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad_interpretation: true,
      isLoad_bill: true,
      isLoad_project: true,
      isLoad_invoice: true,
      fromDate: "",
      toDate: "",
      tabType: 1,
      interpretationArrData: [],
      projectArrData: [],
      billsUnderVerificationArrData: [],
      invoiceArrData: [],
      // .....
      intertoggleState: 0,
      currentValue: 0,
      check: false,
      value: 0,
      widgets: [],
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
    this.listApi_Interpretation(mainData);
    this.listApi_Project(mainData);
    this.listApi_BillUnderV(mainData);
    this.listApi_Invoice(mainData);

  };

  listApi_Interpretation = async (data) => {
    this.setState({
      isLoad_interpretation: true,
    });
    let res = await ApiCallVendor("vendorGetDashboardJobList", data);
    consoleLog("res:::", res);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      consoleLog("decodeData:: interpretation data:", decodeData);
      if (
        decodeData.data.jobList != [] ||
        decodeData.data.jobList != undefined ||
        decodeData.data.jobList != null ||
        decodeData.data.jobList != "" ||
        decodeData.data.jobList != {}
      ) {
        this.setState({
          isLoad_interpretation: false,
          interpretationArrData: decodeData.data.jobList,
        });
      } else {
        this.setState({
          interpretationArrData: [],
        });
      }
    }
  };
  // ......................for project . ........................

  listApi_Project = async (data) => {
    consoleLog("req project data::", data)
    this.setState({
      isLoad_project: true,
    });
    let res = await ApiCallVendor("vendorGetDashboardProjectList", data);
    consoleLog("res:::", res);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      consoleLog("decodeData:::project", decodeData);
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

  // ................for bill under verification ....................
  listApi_BillUnderV = async (data) => {
    this.setState({
      isLoad_bill: true,
    });
    let res = await ApiCallVendor("vendorFetchDashboardBillsUnderVerification", data);
    // consoleLog("res:::", res);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      consoleLog("decodeData::bill:", decodeData);
      if (
        decodeData.data.details != [] ||
        decodeData.data.details != undefined ||
        decodeData.data.details != null ||
        decodeData.data.details != "" ||
        decodeData.data.details != {}
      ) {
        this.setState({
          isLoad_bill: false,
          billsUnderVerificationArrData: decodeData.data.details,
        });
      } else {
        this.setState({
          billsUnderVerificationArrData: [],
        });
      }
    }
  };

  // ................for invoice ....................
  listApi_Invoice = async (data) => {
    this.setState({
      isLoad_invoice: true,
    });
    let res = await ApiCallVendor("vendorFetchDasboardInvoice", data);
    consoleLog("res:::", res);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      consoleLog("decodeData::invoice:", decodeData);
      if (
        decodeData.data.details != [] ||
        decodeData.data.details != undefined ||
        decodeData.data.details != null ||
        decodeData.data.details != "" ||
        decodeData.data.details != {}
      ) {
        this.setState({
          isLoad_invoice: false,
          invoiceArrData: decodeData.data.details,
        });
      } else {
        this.setState({
          invoiceArrData: [],
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
  onTabClick = async (value) => {
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
    } else if (value == 3) {
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

  // ..............for projects......................

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

      // let mainData = Object.assign(reqData, resObj);
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

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Project(resObj);
    } else if (value == 3) {
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
      this.listApi_Project(resObj);
    }
  };

  // ..............for bill underverification .. .......

  onTabClick_bill = async (value) => {
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
      this.listApi_BillUnderV(resObj);
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
      this.listApi_BillUnderV(resObj);
    }
  };

  // ..............for invoice.. .......

  onTabClick_Invoice = async (value) => {
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
      this.listApi_Invoice(resObj);
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
      this.listApi_Invoice(resObj);
    }
  };

  onView = (val) => {
    // if (val == "clientInterpretation") {
    //   return this.props.history.push("/adminViewAllJobs");
    // } else if (val == "clientBillsUnderV") {
    //   return this.props.history.push("/adminInvoicesBillsUnderV");
    // } else if(val == "clientInvoice"){
    //   return this.props.history.push("/adminInvoicesAccountPayable");
    // }
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
        searchfrom:
          this.state.fromDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.fromDate),
        searchto:
          this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: this.state.tabType,
      };
      this.listApi_Interpretation(resObj);
      this.listApi_BillUnderV(resObj);
      this.listApi_Invoice(resObj);
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
    return this.props.history.push("/vendorTranslationList")
  }

  openTrainingListPage = () => {
    return this.props.history.push("/vendorTrainingList")
  }

  onResetFilter = () => {
    this.setState({
      fromDate: "",
      toDate: "",
    });

    this.onLoad();
  };


  render() {
    return (
      <React.Fragment>
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
            <h1 className="text-uppercase">
              Vendor Dashboard <span style={{ marginTop: "2%" }}>Vendor</span>
            </h1>
          </div>

          <div className="_fl dashboard-list tp">
            {/* <h2 className="_fl h2_text">Vendor</h2> */}
            <div className="row" id="vendr-cont">
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr1">
                  <div className="dh-head _fl">
                    <h3>Interpretation</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.REQUIRE_WHITE} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li className="nav-item"
                      onClick={() => {
                        this.onTabClick(1);
                      }}
                    >
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home"
                      >
                        Unassigned
                      </a>{" "}
                    </li>
                    <li className="nav-item"
                      onClick={() => {
                        this.onTabClick(2);
                      }}
                    >
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu1">
                        Assigned job
                      </a>{" "}
                    </li>
                    <li className="nav-item"
                      onClick={() => {
                        this.onTabClick(3);
                      }}
                    >
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu2">
                        quote sent
                      </a>{" "}
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane  active" id="home">
                      <div className="_fl _dsbx dash_tab">
                        <p className="_fl viewall text-right">
                          <a href="javascript:void(0)">View all</a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_interpretation}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div className="_fl _dsbxrow"
                          hidden={this.state.isLoad_interpretation}
                        >
                          {this.state.interpretationArrData.length > 0 ? (
                            <React.Fragment>
                              {this.state.interpretationArrData.map(
                                (obj, i) => (
                                  <React.Fragment key={i}>
                                    <div className="_fl _ddrow">
                                      <div className="_ddhead">
                                        <p
                                          style={{ cursor: "pointer" }}
                                        // onClick={() =>
                                        //   this.showDetails(obj, i)
                                        // }
                                        >
                                          {obj.jobId}
                                        </p>
                                        <p>
                                          {SetDateFormat(obj.scheduleDate)} | {obj.scheduleTime}
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
                                        <a
                                          href="#"
                                          className="fds"
                                          style={{ textDecoration: "none" }}
                                        >
                                          {obj.appointmentTypeName}
                                        </a>{" "}
                                      </div>
                                    </div>
                                  </React.Fragment>
                                )
                              )}
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
                    <div className="tab-pane  fade" id="menu1">
                      <div className="_fl _dsbx dash_tab">
                        <p className="_fl viewall text-right">
                          <a href="javascript:void(0)">View all</a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_interpretation}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div className="_fl _dsbxrow"
                          hidden={this.state.isLoad_interpretation}
                        >
                          {this.state.interpretationArrData.length > 0 ? (
                            <React.Fragment>
                              {this.state.interpretationArrData.map(
                                (obj, i) => (
                                  <React.Fragment key={i}>
                                    <div className="_fl _ddrow">
                                      <div className="_ddhead">
                                        <p
                                          style={{ cursor: "pointer" }}

                                        // onClick={() =>
                                        //   this.showDetails(obj, i)
                                        // }
                                        >
                                          {obj.jobId}
                                        </p>
                                        <p>
                                          {SetDateFormat(obj.scheduleDate)} | {obj.scheduleTime}
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
                                        <a
                                          href="#"
                                          className="fds"
                                          style={{ textDecoration: "none" }}
                                        >
                                          {obj.appointmentTypeName}
                                        </a>{" "}
                                      </div>
                                    </div>
                                  </React.Fragment>
                                )
                              )}
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
                    <div className="tab-pane  fade" id="menu2">
                      <div className="_fl _dsbx dash_tab">
                        <p className="_fl viewall text-right">
                          <a href="javascript:void(0)">View all</a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_interpretation}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div className="_fl _dsbxrow"
                          hidden={this.state.isLoad_interpretation}
                        >
                          {this.state.interpretationArrData.length > 0 ? (
                            <React.Fragment>
                              {this.state.interpretationArrData.map(
                                (obj, i) => (
                                  <React.Fragment key={i}>
                                    <div className="_fl _ddrow">
                                      <div className="_ddhead">
                                        <p
                                          style={{ cursor: "pointer" }}
                                        // onClick={() =>
                                        //   this.showDetails(obj, i)
                                        // }
                                        >
                                          {obj.jobId}
                                        </p>
                                        <p>
                                          {SetDateFormat(obj.scheduleDate)} | {obj.scheduleTime}
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
                                        <a
                                          href="#"
                                          className="fds"
                                          style={{ textDecoration: "none" }}
                                        >
                                          {obj.appointmentTypeName}
                                        </a>{" "}
                                      </div>
                                    </div>
                                  </React.Fragment>
                                )
                              )}
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
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr2">
                  <div className="dh-head _fl">
                    <h3>Projects</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.NOTE_ICON} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li className="nav-item" onClick={() => this.onTabClick_project(1)}>
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home_1"
                      >
                        Unassigned
                      </a>{" "}
                    </li>
                    <li className="nav-item" onClick={() => this.onTabClick_project(2)}>
                      {" "}
                      <a
                        className="nav-link"
                        data-toggle="tab"
                        href="#menu1_1"
                      >
                        quote sent
                      </a>{" "}
                    </li>
                    <li className="nav-item" onClick={() => this.onTabClick_project(3)}>
                      {" "}
                      <a
                        className="nav-link"
                        data-toggle="tab"
                        href="#menu2_1"
                      >
                        Assigned
                      </a>{" "}
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane  active" id="home_1">
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
                        <div className="_fl _dsbxrow" hidden={this.state.isLoad_project}>
                          {this.state.projectArrData.length > 0 ? (
                            <React.Fragment>
                              {this.state.projectArrData.map(
                                (obj, i) => (
                                  <div className="_fl _ddrow" key={i}>
                                    <div className="_ddhead">
                                      <p
                                        // onClick={() => this.showDetails(obj, i)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {obj.jobId}
                                      </p>
                                      <p>
                                        {SetDateFormat(obj.scheduleDate)} |
                                        {obj.scheduleTime}
                                      </p>
                                      <p>
                                        {obj.location == null ||
                                          obj.location == undefined ||
                                          obj.location == "" ||
                                          obj.location == [] ||
                                          obj.location == {} ? (
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
                                    <div
                                      className="dd_rt"
                                    // style={{ width: "38%" }}
                                    >
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
                                )
                              )}
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
                    <div className="tab-pane  fade" id="menu1_1">
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
                        <div className="_fl _dsbxrow" hidden={this.state.isLoad_project}>
                          {this.state.projectArrData.length > 0 ? (
                            <React.Fragment>
                              {this.state.projectArrData.map(
                                (obj, i) => (
                                  <div className="_fl _ddrow" key={i}>
                                    <div className="_ddhead">
                                      <p
                                        // onClick={() => this.showDetails(obj, i)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {obj.jobId}
                                      </p>
                                      <p>
                                        {SetDateFormat(obj.scheduleDate)} |
                                        {obj.scheduleTime}
                                      </p>
                                      <p>
                                        {obj.location == null ||
                                          obj.location == undefined ||
                                          obj.location == "" ||
                                          obj.location == [] ||
                                          obj.location == {} ? (
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
                                    <div
                                      className="dd_rt"
                                    // style={{ width: "38%" }}
                                    >
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
                                )
                              )}
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
                    <div className="tab-pane  fade" id="menu2_1">
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
                        <div className="_fl _dsbxrow" hidden={this.state.isLoad_project}>
                          {this.state.projectArrData.length > 0 ? (
                            <React.Fragment>
                              {this.state.projectArrData.map(
                                (obj, i) => (
                                  <div className="_fl _ddrow" key={i}>
                                    <div className="_ddhead">
                                      <p
                                        // onClick={() => this.showDetails(obj, i)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {obj.jobId}
                                      </p>
                                      <p>
                                        {" "}
                                        {SetDateFormat(obj.scheduleDate)} |
                                        {obj.scheduleTime}
                                      </p>
                                      <p>
                                        {obj.location == null ||
                                          obj.location == undefined ||
                                          obj.location == "" ||
                                          obj.location == [] ||
                                          obj.location == {} ? (
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
                                    <div
                                      className="dd_rt"
                                    // style={{ width: "38%" }}
                                    >
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
                                )
                              )}
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
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr3 tbl_two">
                  <div className="dh-head _fl">
                    <h3>Bills under verification</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.REQUIRE_WHITE} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li className="nav-item"
                      onClick={() => {
                        this.onTabClick_bill(1);
                      }}
                    >
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home_4"
                      >
                        unverified
                      </a>{" "}
                    </li>
                    <li className="nav-item"
                      onClick={() => {
                        this.onTabClick_bill(2);
                      }}>
                      {" "}
                      <a
                        className="nav-link"
                        data-toggle="tab"
                        href="#menu12_4"
                      >
                        verified
                      </a>{" "}
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane  active" id="home_4">
                      <div className="_fl _dsbx dash_tab">
                        <p className="_fl viewall text-right">
                          <a href="javascript:void(0)">View all</a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_bill}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div className="_fl _dsbxrow"
                          hidden={this.state.isLoad_bill}
                        >
                          {this.state.billsUnderVerificationArrData.length >
                            0 ? (
                            <React.Fragment>
                              {this.state.billsUnderVerificationArrData.map(
                                (obj, i) => (
                                  <React.Fragment key={i}>
                                    <div className="_fl _ddrow">
                                      <div className="_ddhead">
                                        <p
                                          style={{ cursor: "pointer" }}
                                        // onClick={() =>
                                        //   this.showDetails(obj, i)
                                        // }
                                        >
                                          {obj.jobId}
                                        </p>
                                        <p>{SetDateFormat(obj.date)}</p>
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
                                        <a
                                          href="#"
                                          className="fds"
                                          style={{ textDecoration: "none" }}
                                        >
                                          {obj.appointmentTypeName}
                                        </a>{" "}
                                      </div>
                                    </div>
                                  </React.Fragment>
                                )
                              )}
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
                          <a href="javascript:void(0)">View all</a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_bill}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div className="_fl _dsbxrow" hidden={this.state.isLoad_bill}>
                          {this.state.billsUnderVerificationArrData.length >
                            0 ? (
                            <React.Fragment>
                              {this.state.billsUnderVerificationArrData.map(
                                (obj, i) => (
                                  <React.Fragment key={i}>
                                    <div className="_fl _ddrow">
                                      <div className="_ddhead">
                                        <p
                                          style={{ cursor: "pointer" }}
                                        // onClick={() =>
                                        //   this.showDetails(obj, i)
                                        // }
                                        >
                                          {obj.jobId}
                                        </p>
                                        <p>{SetDateFormat(obj.date)}</p>
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
                                        <a
                                          href="#"
                                          className="fds"
                                          style={{ textDecoration: "none" }}
                                        >
                                          {obj.appointmentTypeName}
                                        </a>{" "}
                                      </div>
                                    </div>
                                  </React.Fragment>
                                )
                              )}
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
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr2 tbl_two">
                  <div className="dh-head _fl">
                    <h3>Invoices</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.INVOICE_ICON} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li className="nav-item"
                      onClick={() => {
                        this.onTabClick_Invoice(1);
                      }}
                    >
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home_5"
                      >
                        unpaid
                      </a>{" "}
                    </li>
                    <li className="nav-item"
                      onClick={() => {
                        this.onTabClick_Invoice(2);
                      }}
                    >
                      {" "}
                      <a
                        className="nav-link"
                        data-toggle="tab"
                        href="#menu12_5"
                      >
                        overdue
                      </a>{" "}
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane  active" id="home_5">
                      <div className="_fl _dsbx dash_tab">
                        <p className="_fl viewall text-right">
                          <a href="javascript:void(0)">View all</a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_invoice}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div className="_fl _dsbxrow"
                          hidden={this.state.isLoad_invoice}
                        >
                          {this.state.invoiceArrData.length > 0 ? (
                            <React.Fragment>
                              {this.state.invoiceArrData.map((obj, i) => (
                                <div className="_fl _ddrow">
                                  <div
                                    className="_ddhead"
                                    style={{ width: "60%" }}
                                  >
                                    <p style={{ cursor: "pointer" }}
                                    // onClick={() =>
                                    //   this.showDetails(obj, i)
                                    // }
                                    >{obj.invoiceId}</p>
                                    <p>Amount:{obj.amount}$</p>
                                    <p>{obj.clientName}</p>
                                  </div>
                                  <div
                                    className="dd_rt"
                                    style={{ width: "38%" }}
                                  >
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
                    <div className="tab-pane  fade" id="menu12_5">
                      <div className="_fl _dsbx dash_tab">
                        <p className="_fl viewall text-right">
                          <a href="javascript:void(0)">View all</a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_invoice}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div className="_fl _dsbxrow"
                          hidden={this.state.isLoad_invoice}
                        >
                          {this.state.invoiceArrData.length > 0 ? (
                            <React.Fragment>
                              {this.state.invoiceArrData.map((obj, i) => (
                                <div className="_fl _ddrow">
                                  <div
                                    className="_ddhead"
                                    style={{ width: "60%" }}
                                  >
                                    <p style={{ cursor: "pointer" }}
                                    // onClick={() =>
                                    //   this.showDetails(obj, i)
                                    // }
                                    >{obj.invoiceId}</p>
                                    <p>Amount:{obj.amount}$</p>
                                    <p>{obj.clientName}</p>
                                  </div>
                                  <div
                                    className="dd_rt"
                                    style={{ width: "38%" }}
                                  >
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
                                        className="Yellow_dash_btn"
                                      >
                                        Training
                                      </a>
                                    ) : (
                                      <React.Fragment />
                                    )}{" "}
                                  </div>
                                </div>
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
        {/* </div> */}

        {/* </div> */}
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

// export default Dashboard;
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



const mapStateToProps = (state) => {
  const clientData = state.mainData;
  return {
    clientTitle: clientData.header,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(VendorDashboard);

// export default Dashboard;
