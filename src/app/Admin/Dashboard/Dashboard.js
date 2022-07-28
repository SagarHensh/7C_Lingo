import React, { Component } from "react";
// import "";
import "./dashboard.css";
import "bootstrap/dist/css/bootstrap.css";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import history from "../../../history";
import { AlertMessage, ImageName } from "../../../enums";
import {
  consoleLog,
  SetDatabaseDateFormat,
  SetDateFormat,
  SetDOBFormat,
  SetTimeFormat,
  SetUSAdateFormat,
} from "../../../services/common-function";
import { ApiCall } from "../../../services/middleware";
import { Decoder } from "../../../services/auth";
import { ErrorCode } from "../../../services/constant";
import ThreeDotsLoader from "../../Loader/ThreeDotsLoader";
import DatePicker from "react-datepicker";
import { toast, ToastContainer } from "react-toastify";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
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

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad_interpretation: true,
      isLoad_bill: true,
      isLoad_project: true,
      isLoad_invoice: true,
      // .............
      isLoad_interpretation_vendor: true,
      isLoad_project_vendor: true,
      isLoad_bill_vendor: true,
      isLoad_invoice_vendor: true,
      // ..............
      intertoggleState: 0,
      currentValue: 0,
      check: false,
      value: 0,
      widgets: [],
      fromDate: "",
      toDate: "",
      tabType: 1,
      interpretationArrData: [],
      projectArrData: [],
      billsUnderVerificationArrData: [],
      invoiceArrData: [],
      // ...............
      interpretationArrData_vendor: [],
      projectArrData_vendor: [],
      billsUnderVerificationArrData_vendor: [],
      invoiceArrData_vendor: [],
      // .....modal......
      openProject: false,
      openInvoice: false
    };
  }

  componentDidMount() {
    if (!localStorage.getItem("AuthToken")) {
      return history.push("/");
    }

    document.getElementById("backdrop").style.display = "none";
    this.onLoad();

    var classInstance = this;

    var selectProjectModal = document.getElementById("open-project-model");

    window.onclick = function (event) {
      if (event.target === selectProjectModal) {
        classInstance.closeProjectModal();
      }
    };
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
    // ........................
    this.listApi_Interpretation_vendor(mainData);
    this.listApi_Project_vendor(mainData);
    this.listApi_BillUnderV_vendor(mainData);
    this.listApi_Invoice_vendor(mainData);
  };

  listApi_Interpretation = async (data) => {
    consoleLog("req data interpretation:::", data);
    this.setState({
      isLoad_interpretation: true,
    });
    let res = await ApiCall("getDashboardJobList", data);
    // consoleLog("res:::", res);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      consoleLog("decodeData:::", decodeData);
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
    // consoleLog("res:::", data);
    this.setState({
      isLoad_project: true,
    });
    let res = await ApiCall("getDashboardProjectList", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      // consoleLog("decodeData:::project data", decodeData);
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
    let res = await ApiCall("fetchDashboardBillsUnderVerificationClient", data);
    // consoleLog("res:::", res);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      // consoleLog("decodeData::bill:", decodeData);
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
    let res = await ApiCall("fetchDasboardInvoiceClient", data);
    // consoleLog("res:::", res);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      // consoleLog("decodeData::invoice:", decodeData);
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

  // ......................vendor api .............
  // .............................................

  listApi_Interpretation_vendor = async (data) => {
    //  consoleLog("res::vendor:", data);
    this.setState({
      isLoad_interpretation_vendor: true,
    });
    let res = await ApiCall("getDashboardJobListVendor", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      // consoleLog("decodeData::vendor job:", decodeData);
      if (
        decodeData.data.jobList != [] ||
        decodeData.data.jobList != undefined ||
        decodeData.data.jobList != null ||
        decodeData.data.jobList != "" ||
        decodeData.data.jobList != {}
      ) {
        this.setState({
          isLoad_interpretation_vendor: false,
          interpretationArrData_vendor: decodeData.data.jobList,
        });
      } else {
        this.setState({
          interpretationArrData_vendor: [],
        });
      }
    }
  };

  // ......................for project .....................

  listApi_Project_vendor = async (data) => {
    // consoleLog("res::vendor  pro:", data);
    this.setState({
      isLoad_project_vendor: true,
    });
    let res = await ApiCall("getDashboardProjectListVendor", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      // consoleLog("decodeData::vendor project:", decodeData);
      if (
        decodeData.data.projectList != [] ||
        decodeData.data.projectList != undefined ||
        decodeData.data.projectList != null ||
        decodeData.data.projectList != "" ||
        decodeData.data.projectList != {}
      ) {
        this.setState({
          isLoad_project_vendor: false,
          projectArrData_vendor: decodeData.data.projectList,
        });
      } else {
        this.setState({
          projectArrData_vendor: [],
        });
      }
    }
  };

  // ................for bill under verification ....................
  listApi_BillUnderV_vendor = async (data) => {
    this.setState({
      isLoad_bill_vendor: true,
    });
    let res = await ApiCall("fetchDashboardBillsUnderVerificationVendor", data);
    // consoleLog("res:::", res);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      // consoleLog("decodeData::bill:vendor", decodeData);
      if (
        decodeData.data.details != [] ||
        decodeData.data.details != undefined ||
        decodeData.data.details != null ||
        decodeData.data.details != "" ||
        decodeData.data.details != {}
      ) {
        this.setState({
          isLoad_bill_vendor: false,
          billsUnderVerificationArrData_vendor: decodeData.data.details,
        });
      } else {
        this.setState({
          billsUnderVerificationArrData_vendor: [],
        });
      }
    }
  };

  // ................for invoice ....................
  listApi_Invoice_vendor = async (data) => {
    this.setState({
      isLoad_invoice_vendor: true,
    });
    let res = await ApiCall("fetchDasboardInvoiceVendor", data);
    // consoleLog("res:::", res);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      // consoleLog("decodeData::invoice: vendor", decodeData);
      if (
        decodeData.data.details != [] ||
        decodeData.data.details != undefined ||
        decodeData.data.details != null ||
        decodeData.data.details != "" ||
        decodeData.data.details != {}
      ) {
        this.setState({
          isLoad_invoice_vendor: false,
          invoiceArrData_vendor: decodeData.data.details,
        });
      } else {
        this.setState({
          invoiceArrData_vendor: [],
        });
      }
    }
  };

  // openProjectModal = () => {
  //   document.getElementById("backdrop").style.display = "block";
  //   document.getElementById("open-project-model").style.display = "block";
  //   document.getElementById("open-project-model").classList.add("show");
  // };

  // closeProjectModal = () => {
  //   document.getElementById("backdrop").style.display = "none";
  //   document.getElementById("open-project-model").style.display = "none";
  //   document.getElementById("open-project-model").classList.remove("show");
  // };

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
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Interpretation(resObj);
    } else if (value == 2) {
      let resObj = {
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Interpretation(resObj);
    } else if (value == 3) {
      let resObj = {
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
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
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Project(resObj);
    } else if (value == 2) {
      let resObj = {
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Project(resObj);
    } else if (value == 3) {
      let resObj = {
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
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
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_BillUnderV(resObj);
    } else if (value == 2) {
      let resObj = {
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
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
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Invoice(resObj);
    } else if (value == 2) {
      let resObj = {
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Invoice(resObj);
    }
  };

  // ....................for vendor interpretation ... ........................

  onTabClick_vendor = async (value) => {
    this.setState({
      tabType: value,
    });
    if (value == 1) {
      let resObj = {
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Interpretation_vendor(resObj);
    } else if (value == 2) {
      let resObj = {
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Interpretation_vendor(resObj);
    } else if (value == 3) {
      let resObj = {
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Interpretation_vendor(resObj);
    }
  };
  // ....................for vendor project ... ........................

  onTabClick_project_vendor = async (value) => {
    this.setState({
      tabType: value,
    });
    if (value == 1) {
      let resObj = {
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Project_vendor(resObj);
    } else if (value == 2) {
      let resObj = {
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Project_vendor(resObj);
    } else if (value == 3) {
      let resObj = {
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Project_vendor(resObj);
    }
  };

  // ..............for bill underverification ..vendor .......

  onTabClick_bill_vendor = async (value) => {
    this.setState({
      tabType: value,
    });
    if (value == 1) {
      let resObj = {
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_BillUnderV_vendor(resObj);
    } else if (value == 2) {
      let resObj = {
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_BillUnderV_vendor(resObj);
    }
  };

  // ..............for invoice. vendor. .......

  onTabClick_Invoice_vendor = async (value) => {
    this.setState({
      tabType: value,
    });
    if (value == 1) {
      let resObj = {
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Invoice_vendor(resObj);
    } else if (value == 2) {
      let resObj = {
        searchfrom: this.state.fromDate == "" ? "" : SetDatabaseDateFormat(this.state.fromDate),
        searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: value,
      };

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Invoice_vendor(resObj);
    }
  };

  showDetails = (val, index) => {
    consoleLog("88", val);
    // this.props.history.push({
    //   pathname:"/clientJobDetails",
    //   state: val.requestId,
    // })
    if (val.serviceTypeId === 45) {
      this.props.history.push({
        pathname: "/adminJobDetails",
        state: val.requestId,
      });
    } else if (val.serviceTypeId === 46) {
      this.props.history.push({
        pathname: "/adminTranslationDetails",
        state: val.requestId,
      });
    } else if (val.serviceTypeId === 47) {
      this.props.history.push({
        pathname: "/adminTrainingDetails",
        state: val.requestId,
      });
    }
  };

  onView = (val) => {
    if (val == "clientInterpretation") {
      return this.props.history.push("/adminViewAllJobs");
    } else if (val == "clientBillsUnderV") {
      return this.props.history.push("/adminInvoicesBillsUnderV");
    } else if (val == "clientInvoice") {
      return this.props.history.push("/adminInvoicesAccountPayable");
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
        searchfrom:
          this.state.fromDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.fromDate),
        searchto:
          this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        tabType: this.state.tabType,
      };
      consoleLog("resObj::", resObj);

      // let mainData = Object.assign(reqData, resObj);
      this.listApi_Interpretation(resObj);
      this.listApi_Project(resObj);
      this.listApi_BillUnderV(resObj);
      this.listApi_Invoice(resObj);
      // ...............
      this.listApi_Interpretation_vendor(resObj);
      this.listApi_Project_vendor(resObj);
      this.listApi_BillUnderV_vendor(resObj);
      this.listApi_Invoice_vendor(resObj);
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
    return this.props.history.push("/adminProjectList");
  };

  openTrainingListPage = () => {
    return this.props.history.push("/adminTrainingList");
  };

  onResetFilter = () => {
    this.setState({
      fromDate: "",
      toDate: "",
    });

    this.onLoad();
  };

  // .............for open invoice modal functionality,,,,,

  openDashboardInvoiceModal = () => {
    this.setState({
      openInvoice: true,
    });
  };

  closeDashboardInvoiceModal = () => {
    this.setState({
      openInvoice: false,
    });
  };
  openReceivableListPage = () => {
    return this.props.history.push("/adminMainReceivable");
  };

  openPayableListPage = () => {
    return this.props.history.push("/adminMainPayables");
  };

  render() {
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
        {/* <Header />
        <Sidebar /> */}
        <ToastContainer hideProgressBar theme="colored" />
        <div className="component-wrapper">
          <div className="form-search-app dashboardHead">
            <div className=" dash_filter">
              {/* <div className=" "></div> */}
              <div className=" ">
                <span></span>
                <div
                  className="input-group"
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
              Admin Dashboard <span style={{ marginTop: "2%" }}>Client</span>
            </h1>
          </div>
          <div className="_fl dashboard-list">
            <div className="row">
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr1">
                  <div className="dh-head _fl">
                    <h3>Interpretation</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.REQUIRE_WHITE} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li
                      className="nav-item"
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
                    <li
                      className="nav-item"
                      onClick={() => {
                        this.onTabClick(2);
                      }}
                    >
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu1">
                        Assigned job
                      </a>{" "}
                    </li>
                    <li
                      className="nav-item"
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
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.onView("clientInterpretation")}
                          >
                            View all
                          </a>
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
                              {this.state.interpretationArrData.map(
                                (obj, i) => (
                                  <React.Fragment key={i}>
                                    <div className="_fl _ddrow">
                                      <div className="_ddhead">
                                        <p
                                          onClick={() =>
                                            this.showDetails(obj, i)
                                          }
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
                                        {" "}
                                        <span>{obj.jobType}</span>{" "}
                                        <a
                                          href="javascript:void(0)"
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
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.onView("clientInterpretation")}
                          >
                            View all
                          </a>
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
                              {this.state.interpretationArrData.map(
                                (obj, i) => (
                                  <React.Fragment key={i}>
                                    <div className="_fl _ddrow">
                                      <div className="_ddhead">
                                        <p
                                          onClick={() =>
                                            this.showDetails(obj, i)
                                          }
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
                                        {" "}
                                        <span>{obj.jobType}</span>{" "}
                                        <a
                                          href="javascript:void(0)"
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
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.onView("clientInterpretation")}
                          >
                            View all
                          </a>
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
                              {this.state.interpretationArrData.map(
                                (obj, i) => (
                                  <React.Fragment key={i}>
                                    <div className="_fl _ddrow">
                                      <div className="_ddhead">
                                        <p
                                          onClick={() =>
                                            this.showDetails(obj, i)
                                          }
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
                                        {" "}
                                        <span>{obj.jobType}</span>{" "}
                                        <a
                                          href="javascript:void(0)"
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
              {/* ..............project................ */}
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr2">
                  <div className="dh-head _fl">
                    <h3>Projects</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.NOTE_ICON} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li
                      className="nav-item"
                      onClick={() => this.onTabClick_project(1)}
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
                      onClick={() => this.onTabClick_project(2)}
                    >
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu1_1">
                        quote sent
                      </a>{" "}
                    </li>
                    <li
                      className="nav-item"
                      onClick={() => this.onTabClick_project(3)}
                    >
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu2_1">
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
                                        onClick={() => this.showDetails(obj, i)}
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
                                        onClick={() => this.showDetails(obj, i)}
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
                                        onClick={() => this.showDetails(obj, i)}
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
              {/* .................bills under verification............. */}
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr3 tbl_two">
                  <div className="dh-head _fl">
                    <h3>Bills under verification</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.REQUIRE_WHITE} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li
                      className="nav-item"
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
                    <li
                      className="nav-item"
                      onClick={() => {
                        this.onTabClick_bill(2);
                      }}
                    >
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
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.onView("clientBillsUnderV")}
                          >
                            View all
                          </a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_bill}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
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
                                          onClick={() =>
                                            this.showDetails(obj, i)
                                          }
                                          style={{ cursor: "pointer" }}
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
                                        <span>{obj.jobTypeId}</span>{" "}
                                        <a
                                          href="javascript:void(0)"
                                          className="fds"
                                        >
                                          {obj.appointmentType}
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
                                className="ndf"
                              >
                                No Data Found
                              </p>
                            </React.Fragment>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane  fade" id="menu12_4">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.onView("clientBillsUnderV")}
                          >
                            View all
                          </a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_bill}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
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
                                          onClick={() =>
                                            this.showDetails(obj, i)
                                          }
                                          style={{ cursor: "pointer" }}
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
                                        <span>{obj.jobTypeId}</span>{" "}
                                        <a
                                          href="javascript:void(0)"
                                          className="fds"
                                          style={{ textDecoration: "none" }}
                                        >
                                          {obj.appointmentType}
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

              {/* ................invoiceee ................. */}

              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr2 tbl_two">
                  <div className="dh-head _fl">
                    <h3>Invoices</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.INVOICE_ICON} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li
                      className="nav-item"
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
                    <li
                      className="nav-item"
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
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.openDashboardInvoiceModal()}
                          >
                            View all
                          </a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_invoice}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
                          hidden={this.state.isLoad_invoice}
                        >
                          {this.state.invoiceArrData.length > 0 ? (
                            <React.Fragment>
                              {this.state.invoiceArrData.map((obj, i) => (
                                <div className="_fl _ddrow">
                                  <div
                                    className="_ddhead"
                                  >
                                    <p>{obj.invoiceId}</p>
                                    <p>Amount:{obj.amount}$</p>
                                    <p>{obj.clientName}</p>
                                  </div>
                                  <div
                                    className="dd_rt"
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
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.openDashboardInvoiceModal()}
                          >
                            View all
                          </a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_invoice}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
                          hidden={this.state.isLoad_invoice}
                        >
                          {this.state.invoiceArrData.length > 0 ? (
                            <React.Fragment>
                              {this.state.invoiceArrData.map((obj, i) => (
                                <div className="_fl _ddrow">
                                  <div
                                    className="_ddhead"
                                  >
                                    <p>{obj.invoiceId}</p>
                                    <p>Amount:{obj.amount}$</p>
                                    <p>{obj.clientName}</p>
                                  </div>
                                  <div
                                    className="dd_rt"
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ..................................vendor............................. */}
          {/* ..................................vendor..................................... */}
          <div className="_fl dashboard-list tp">
            <h2 className="_fl h2_text">Vendor</h2>
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
                    <li
                      className="nav-item"
                      onClick={() => {
                        this.onTabClick_vendor(1);
                      }}
                    >
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home"
                      >
                        Offer Sent
                      </a>{" "}
                    </li>
                    <li
                      className="nav-item"
                      onClick={() => {
                        this.onTabClick_vendor(2);
                      }}
                    >
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu1">
                        declined
                      </a>{" "}
                    </li>
                    <li
                      className="nav-item"
                      onClick={() => {
                        this.onTabClick_vendor(3);
                      }}
                    >
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu2">
                        Assigned Jobs
                      </a>{" "}
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane  active" id="home">
                      <div className="_fl _dsbx ">
                        <p className="_fl viewall text-right">
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.onView("clientInterpretation")}
                          >
                            View all
                          </a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_interpretation_vendor}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
                          hidden={this.state.isLoad_interpretation_vendor}
                        >
                          {this.state.interpretationArrData_vendor.length >
                            0 ? (
                            <React.Fragment>
                              {this.state.interpretationArrData_vendor.map(
                                (obj, i) => (
                                  <div className="_fl _ddrow">
                                    <div className="_ddhead">
                                      <p
                                        onClick={() => this.showDetails(obj, i)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {obj.jobId}
                                      </p>
                                      <p>
                                        {SetDateFormat(obj.scheduleDate)}|
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
                                    <div className="dd_rt">
                                      {" "}
                                      <span>{obj.jobType}</span>{" "}
                                      <a href="javascript:void(0)" className="fds">
                                        {obj.appointmentTypeName}
                                      </a>{" "}
                                    </div>
                                    <div className="_fl tp-jsd">
                                      <span>
                                        Job sent to {obj.noOfVendors} Vendors
                                      </span>
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
                    <div className="tab-pane  fade" id="menu1">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.onView("clientInterpretation")}
                          >
                            View all
                          </a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_interpretation_vendor}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
                          hidden={this.state.isLoad_interpretation_vendor}
                        >
                          {this.state.interpretationArrData_vendor.length >
                            0 ? (
                            <React.Fragment>
                              {this.state.interpretationArrData_vendor.map(
                                (obj, i) => (
                                  <div className="_fl _ddrow">
                                    <div className="_ddhead">
                                      <p
                                        onClick={() => this.showDetails(obj, i)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {obj.requestId}
                                      </p>
                                      <p>
                                        {SetDateFormat(obj.scheduleDate)}|
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
                                    <div className="dd_rt">
                                      {" "}
                                      <span>{obj.jobType}</span>{" "}
                                      <a href="javascript:void(0)" className="fds">
                                        {obj.appointmentTypeName}
                                      </a>{" "}
                                    </div>
                                    <div className="_fl tp-jsd">
                                      <span>
                                        Job sent to {obj.noOfVendors} Vendors
                                      </span>
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
                    <div className="tab-pane  fade" id="menu2">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.onView("clientInterpretation")}
                          >
                            View all
                          </a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_interpretation_vendor}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
                          hidden={this.state.isLoad_interpretation_vendor}
                        >
                          {this.state.interpretationArrData_vendor.length >
                            0 ? (
                            <React.Fragment>
                              {this.state.interpretationArrData_vendor.map(
                                (obj, i) => (
                                  <div className="_fl _ddrow">
                                    <div className="_ddhead">
                                      <p
                                        onClick={() => this.showDetails(obj, i)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {obj.requestId}
                                      </p>
                                      <p>
                                        {SetDateFormat(obj.scheduleDate)}|
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
                                    <div className="dd_rt">
                                      {" "}
                                      <span>{obj.jobType}</span>{" "}
                                      <a href="javascript:void(0)" className="fds">
                                        {obj.appointmentTypeName}
                                      </a>{" "}
                                    </div>
                                    <div className="_fl tp-jsd">
                                      <span>
                                        Job sent to {obj.noOfVendors} Vendors
                                      </span>
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

              {/* .................project...................... */}

              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr2">
                  <div className="dh-head _fl">
                    <h3>Projects</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.NOTE_ICON} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li
                      className="nav-item"
                      onClick={() => this.onTabClick_project_vendor(1)}
                    >
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home_1"
                      >
                        Rfq Sent
                      </a>{" "}
                    </li>
                    <li
                      className="nav-item"
                      onClick={() => this.onTabClick_project_vendor(2)}
                    >
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu1_1">
                        Bids Received
                      </a>{" "}
                    </li>
                    <li
                      className="nav-item"
                      onClick={() => this.onTabClick_project_vendor(3)}
                    >
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu2_1">
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
                          hidden={!this.state.isLoad_project_vendor}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
                          hidden={this.state.isLoad_project_vendor}
                        >
                          {this.state.projectArrData_vendor.length > 0 ? (
                            <React.Fragment>
                              {this.state.projectArrData_vendor.map(
                                (obj, i) => (
                                  <div className="_fl _ddrow" key={i}>
                                    <div className="_ddhead">
                                      <p
                                        onClick={() => this.showDetails(obj, i)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {obj.jobId}
                                      </p>
                                      <p>
                                        {" "}
                                        {SetDateFormat(obj.endTime)} |
                                        {SetTimeFormat(obj.endTime)}
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
                          hidden={!this.state.isLoad_project_vendor}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
                          hidden={this.state.isLoad_project_vendor}
                        >
                          {this.state.projectArrData_vendor.length > 0 ? (
                            <React.Fragment>
                              {this.state.projectArrData_vendor.map(
                                (obj, i) => (
                                  <div className="_fl _ddrow" key={i}>
                                    <div className="_ddhead">
                                      <p
                                        onClick={() => this.showDetails(obj, i)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {obj.jobId}
                                      </p>
                                      <p>
                                        {" "}
                                        {SetDateFormat(obj.endTime)} |
                                        {SetTimeFormat(obj.endTime)}
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
                          hidden={!this.state.isLoad_project_vendor}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
                          hidden={this.state.isLoad_project_vendor}
                        >
                          {this.state.projectArrData_vendor.length > 0 ? (
                            <React.Fragment>
                              {this.state.projectArrData_vendor.map(
                                (obj, i) => (
                                  <div className="_fl _ddrow" key={i}>
                                    <div className="_ddhead">
                                      <p
                                        onClick={() => this.showDetails(obj, i)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {obj.jobId}
                                      </p>
                                      <p>
                                        {" "}
                                        {SetDateFormat(obj.endTime)} |
                                        {SetTimeFormat(obj.endTime)}
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

              {/* ....................bills under verification ................ */}

              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr3 tbl_two">
                  <div className="dh-head _fl">
                    <h3>Bills under verification</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.REQUIRE_WHITE} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li
                      className="nav-item"
                      onClick={() => {
                        this.onTabClick_bill_vendor(1);
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
                    <li
                      className="nav-item"
                      onClick={() => {
                        this.onTabClick_bill_vendor(2);
                      }}
                    >
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
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.onView("clientBillsUnderV")}
                          >
                            View all
                          </a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_bill_vendor}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
                          hidden={this.state.isLoad_bill_vendor}
                        >
                          {this.state.billsUnderVerificationArrData_vendor
                            .length > 0 ? (
                            <React.Fragment>
                              {this.state.billsUnderVerificationArrData_vendor.map(
                                (obj, i) => (
                                  <div className="_fl _ddrow">
                                    <div
                                      className="_ddhead"
                                      // style={{ width: "57%" }}
                                    >
                                      <p>{obj.jobId}</p>
                                      <p>
                                        {SetDateFormat(obj.endTime)} |
                                        {SetTimeFormat(obj.endTime)}
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
                                      // style={{ width: "34%" }}
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
                    <div className="tab-pane  fade" id="menu12_4">
                      <div className="_fl _dsbx dash_tab">
                        <p className="_fl viewall text-right">
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.onView("clientBillsUnderV")}
                          >
                            View all
                          </a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_bill_vendor}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
                          hidden={this.state.isLoad_bill_vendor}
                        >
                          {this.state.billsUnderVerificationArrData_vendor
                            .length > 0 ? (
                            <React.Fragment>
                              {this.state.billsUnderVerificationArrData_vendor.map(
                                (obj, i) => {
                                  <div className="_fl _ddrow">
                                    <div className="_ddhead">
                                      <p>{obj.jobId}</p>
                                      <p>
                                        {SetDateFormat(obj.endTime)} |
                                        {SetTimeFormat(obj.endTime)}
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
                                  </div>;
                                }
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

              {/* ...................invoice............. */}
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr2 tbl_two">
                  <div className="dh-head _fl">
                    <h3>Invoices</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.INVOICE_ICON} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li
                      className="nav-item"
                      onClick={() => this.onTabClick_Invoice_vendor(1)}
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
                    <li
                      className="nav-item"
                      onClick={() => this.onTabClick_Invoice_vendor(2)}
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
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.openDashboardInvoiceModal()}
                          >
                            View all
                          </a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_invoice_vendor}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
                          hidden={this.state.isLoad_invoice_vendor}
                        >
                          {this.state.invoiceArrData_vendor.length > 0 ? (
                            <React.Fragment>
                              {this.state.invoiceArrData_vendor.map(
                                (obj, i) => (
                                  <div className="_fl _ddrow">
                                    <div
                                      className="_ddhead"
                                      // style={{ width: "60%" }}
                                    >
                                      <p>{obj.invoiceId}</p>
                                      <p>Amount:{obj.amount}$</p>
                                      <p>{obj.clientName}</p>
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
                    <div className="tab-pane  fade" id="menu12_5">
                      <div className="_fl _dsbx dash_tab">
                        <p className="_fl viewall text-right">
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.openDashboardInvoiceModal()}
                          >
                            View all
                          </a>
                        </p>
                        <div
                          className="_fl _dsbxrow"
                          hidden={!this.state.isLoad_invoice_vendor}
                        >
                          <ThreeDotsLoader />
                        </div>
                        <div
                          className="_fl _dsbxrow"
                          hidden={this.state.isLoad_invoice_vendor}
                        >
                          {this.state.invoiceArrData_vendor.length > 0 ? (
                            <React.Fragment>
                              {this.state.invoiceArrData_vendor.map(
                                (obj, i) => (
                                  <div className="_fl _ddrow">
                                    <div
                                      className="_ddhead"
                                    >
                                      <p>{obj.invoiceId}</p>
                                      <p>Amount:{obj.amount}$</p>
                                      <p>{obj.clientName}</p>
                                    </div>
                                    <div
                                      className="dd_rt"
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
            </div>
          </div>
        </div>
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

        {/* ...........for invoice modal................. */}

        <Modal
          open={this.state.openInvoice}
          onClose={this.closeDashboardInvoiceModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="projectBtn">
              <span
                href="javascript:void(0)"
                className="sky_dash_btn projectModalBtn"
                onClick={() => this.openReceivableListPage()}
              >
                Receivable
              </span>
              <span
                href="javascript:void(0)"
                className="yellow_dash_btn projectModalBtn"
                onClick={() => this.openPayableListPage()}
              >
                Payable
              </span>
            </div>
          </Box>
        </Modal>

        {/* .................................. */}
        <div
          id="open-project-model"
          class="modal fade modelwindow"
          role="dialog"
        >
          <div class="modal-dialog modal-sm modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div class="modal-content">
              <div class="filter-head _fl mdf">
                <h3>Filter by</h3>
                <span style={{}}>
                  <img
                    src={ImageName.IMAGE_NAME.CLOSE_BTN}
                    style={{ width: "25px" }}
                  />
                </span>
              </div>
              <div class="modal-body">
                <div class="model-info f-model">
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

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
