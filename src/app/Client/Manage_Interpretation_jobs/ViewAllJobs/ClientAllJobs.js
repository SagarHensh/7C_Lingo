import { Menu, MenuItem } from "@mui/material";
import React, { Component } from "react";
import { AlertMessage, ImageName } from "../../../../enums";
import { Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { ApiCall, ApiCallClient } from "../../../../services/middleware";
import {
  PaginationDropdown,
  SelectBox,
} from "../../../Admin/SharedComponents/inputText";
import Select, { components } from "react-select";
import $ from "jquery";
// import "./viewAllJobs.css";
import {
  consoleLog,
  SetDateFormat,
  SetTimeFormat,
} from "../../../../services/common-function";
import { toast, ToastContainer } from "react-toastify";
import { inputEmptyValidate } from "../../../../validators";
import ViewCalender from "../../../ReactBigCalender/ViewCalender";
import { Link } from "react-router-dom";
import AssignedJobs from "./AssignedJobs";
import UnassignedJobs from "./UnassignedJobs";
import HistoryJobs from "./HistoryJobs";
import NeedAttention from "./NeedAttention";
import { Api } from "@mui/icons-material";
import AllJobs from "./AllJobs";
import './clientAllJob.css';

const customStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
    borderRadius: "6px",
    height: 50,
    minHeight: 50,
    textAlign: "center",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = "yellow";
    return {
      ...styles,
      color: isFocused ? "grey" : "white",
      color: "#000",
      cursor: isDisabled ? "not-allowed" : "default",
    };
  },
};
const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img
        src={ImageName.IMAGE_NAME.DOWN_ARROW_BLUE}
        style={{ width: "17px" }}
      />
    </components.DropdownIndicator>
  );
};

const cancelationArr = [
  {
    label: "Last minute reschedule ",
    value: 1,
  },
  {
    label: "Duplicate/Error ",
    value: 2,
  },
  {
    label: "Consumer No Show",
    value: 3,
  },
  {
    label: "Interpreter No Show",
    value: 4,
  },
  {
    label: "Other Service being utilized",
    value: 5,
  },
  {
    label: "Other ",
    value: 6,
  },
];

const reqData = {
  limit: "",
  offset: "",
  status: "",
  orderby: "",
  direc: "",
  tabType: "",
  searchFrom: "",
  searchTo: "",
};

export default class ClientAllJobs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad: true,
      isAlljobs: true,
      isHistory: false,
      isNeedAttention: false,
      isUnassigned: false,
      isAsssigned: false,
      current_page: 1,
      total_page: 10,
      limit: 10,

      total_page_assign: 10,

      anchorEl: null, //menu button
      anchorEl1: null,
      cancellationData: {},
      rescheduledCheck: null,
      isSelected: null,
      totalJob: "0",
      search: "",
      clientArr: [],
      clientData: {},
      appointmentTypeArr: [],
      appointmentTypeData: {},
      targetLangData: {},
      sourceLangData: {},
      languageArr: [],
      statusArr: [],
      statusData: {},
      leiArr: [],
      leiData: {},
      industryArr: [],
      industryData: {},
      otherReason: "",
      formDate: "",
      toDate: "",
      selectedDisplayData: {
        label: "10",
        value: "10",
      },
      listData: [],
      assignData: [],
      historyList: [],
      historyTotalPage: "",
      appointmentDate: "",
      hour: "08",
      min: "00",
      ampm: "AM",
      isOtherReason: false,
      rescheduleNote: "",
      isCalender: false,
      calenderData: [],
      curIndex: 0,
      tabValue: 1,
    };
  }

  componentDidMount() {
    let preData = this.props.match.path;

    if (preData === "/clientNeedAttentionJobs") {
      this.onTabClick("needAttention");
    } else if (preData === "/clientUnAssignedJobs") {
      this.onTabClick("unAssigned");
    } else if (preData === "/clientAssignedJobs") {
      this.onTabClick("assigned");
    } else if (preData === "/clientAllJobsMain") {
      this.onTabClick("alljobs");
    } else if (preData === "/clientJobsHistory") {
      this.onTabClick("history");
    }

    // ...........................
    window.scrollTo(0, 0);
    // this.load();

    var classInstance = this;
    // When the user clicks anywhere outside of the modal, close it

    document.getElementById("backdrop").style.display = "none";
    var modal = document.getElementById("decline-model");
    var filterModal = document.getElementById("filter-model");
    window.onclick = function (event) {
      if (event.target == modal) {
        classInstance.closeDeleteModal();
      } else if (event.target == filterModal) {
        classInstance.closeModal();
      }
    };

    window.$(".verificaiton-doc-tab ul li").on("click", function () {
      $(".verificaiton-doc-tab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
    });
    // this.load();
  }
  onTabClick = async (value) => {
    if (value === "alljobs") {
      this.setState({
        isAlljobs: true,
        isHistory: false,
        isNeedAttention: false,
        isUnassigned: false,
        isAsssigned: false,
        tabValue: 4,
      });
      // let resData = {
      //   tabType: "4",
      // };
      // let mainData = Object.assign(reqData, resData);

      // this.listApi(mainData);
    } else if (value === "history") {
      this.setState({
        isAlljobs: false,
        isHistory: true,
        isNeedAttention: false,
        isUnassigned: false,
        isAsssigned: false,
        tabValue: 5,
      });
      // let resData = {
      //   tabType: "5",
      // };
      // let mainData = Object.assign(reqData, resData);
      // this.listApi(mainData);
    } else if (value === "needAttention") {
      this.setState({
        isAlljobs: false,
        isHistory: false,
        isNeedAttention: true,
        isUnassigned: false,
        isAsssigned: false,
        tabValue: 1,
      });
      // let resData = {
      //   tabType: "1",
      // };
      // let mainData = Object.assign(reqData, resData);
      // this.listApi(mainData);
    } else if (value === "unAssigned") {
      this.setState({
        isAlljobs: false,
        isHistory: false,
        isNeedAttention: false,
        isUnassigned: true,
        isAsssigned: false,
        tabValue: 2,
      });
      let resData = {
        tabType: "2",
      };
      let mainData = Object.assign(reqData, resData);
      this.listApi(mainData);
    } else if (value === "assigned") {
      this.setState({
        isAlljobs: false,
        isHistory: false,
        isNeedAttention: false,
        isUnassigned: false,
        isAsssigned: true,
        tabValue: 3,
      });
      // let resData = {
      //   tabType: "3",
      // };
      // let mainData = Object.assign(reqData, resData);
      // this.listApi(mainData);

      // consoleLog("main::", mainData);
    }
  };

  load = async () => {
    let languageArrData = [],
      languageObjData = {},
      languageResArrData = [],
      industryDataArr = [],
      industryArr = [],
      leiDataArr = [],
      leiArr = [],
      statusDataArr = [];

    // ....................For List Data..........................................

    // let fetchData = {
    //   limit: JSON.stringify(this.state.limit),
    //   offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
    //   tabType: "4"
    // };
    // let returnData = Object.assign(reqData, fetchData);
    // this.listApi(returnData);
    // ...........................for assign Api.........................

    //For language dropdown in filter
    let languageResData = await ApiCall("getlanguagelist");
    let languagePayload = Decoder.decode(languageResData.data.payload);
    languageResArrData = languagePayload.data.languagelist;
    for (let n = 0; n < languageResArrData.length; n++) {
      languageArrData.push({
        label: languageResArrData[n].language,
        value: languageResArrData[n].id,
      });
      if (languageResArrData[n].language === "English") {
        languageObjData = {
          label: languageResArrData[n].language,
          value: languageResArrData[n].id,
        };
      }
    }

    let lookupres = await ApiCall("getLookUpData");
    if (
      lookupres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      lookupres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(lookupres.data.payload);

      industryDataArr = payload.data.lookupdata.INDUSTRY_TYPE;

      for (let j = 0; j < industryDataArr.length; j++) {
        industryArr.push({
          label: industryDataArr[j].name,
          value: industryDataArr[j].id,
        });
      }
    }

    let leiRes = await ApiCall("getAllLeiList");
    if (
      leiRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      leiRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(leiRes.data.payload);

      leiDataArr = payload.data.leiList;
      for (let k = 0; k < leiDataArr.length; k++) {
        leiArr.push({
          label: leiDataArr[k].name,
          value: leiDataArr[k].userId,
        });
      }
    }

    // let statusRes = await ApiCall("getInterpretionJobStatuslist");
    // if (
    //   statusRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   statusRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {
    //   let payload = await Decoder.decode(statusRes.data.payload);
    //   statusDataArr = payload.data.statusList;
    // }
    // ............................................................
    let clientDataArr = [];

    let clientinfoRes = await ApiCall("getallclinetinfo");
    if (
      clientinfoRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      clientinfoRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let clientPayload = Decoder.decode(clientinfoRes.data.payload);
      let clientResData = clientPayload.data.clientlist;
      for (let i = 0; i < clientResData.length; i++) {
        clientDataArr.push({
          label: clientResData[i].clientName,
          value: clientResData[i].clientid,
        });
      }
    }

    this.setState({
      clientArr: clientDataArr,
      sourceLangData: languageObjData,
      targetLangData: languageObjData,
      languageArr: languageArrData,
      industryArr: industryArr,
      leiArr: leiArr,
      isLoad: false,
    });
  };

  listApi = async (data) => {
    const res = await ApiCallClient("getJobList", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      consoleLog("InterpretationList:::", decodeData.data);
      let listDetails = [];
      if (decodeData.data.jobList.length > 0) {
        listDetails = decodeData.data.jobList;
        // consoleLog("listtttt::", listDetails);
      }
      let totalPage = Math.ceil(
        decodeData.data.jobCount / parseInt(this.state.limit)
      );
      this.setState({
        listData: listDetails,
        total_page: totalPage,
        totalJob: decodeData.data.jobCount,
      });
    }
  };

  // .............filter modal function...................

  onJobChange = (e) => {
    this.setState({
      totalJob: e.target.value,
    });
  };

  onSearchChange = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  onClientChamge = (data) => {
    let fetchData = {
      clientId: data.value,
    };
    let returnData = Object.assign(reqData, fetchData);
    this.listApi(returnData);

    this.setState({
      clientData: data,
    });
  };
  onOtherReasonChange = (e) => {
    this.setState({
      otherReason: e.target.value,
    });
  };
  //........Page show Limit.........

  onChangeLimit = (value) => {
    this.setState({
      limit: parseInt(value.value),
      selectedDisplayData: value,
    });

    let limit = value.value;

    let data = {
      limit: limit,
      offset: JSON.stringify(
        (this.state.current_page - 1) * parseInt(value.value)
      ),
    };
    let returnData = Object.assign(reqData, data);

    this.listApi(returnData);
  };

  //........... Export File...............

  onExport = async () => {
    let data = {
      // name: this.state.uname,
      // email: this.state.emailId,
      // mobile: this.state.mobileNo,
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: "",
    };
    // let res = await ApiCall("exportadminstaff", data);
    // const decodeData = Decoder.decode(res.data.payload);
    // if (
    //   res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {
    //   window.open(decodeData.data.fileUrl, "_blank");
    // }
  };

  openModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("filter-model").style.display = "block";
    document.getElementById("filter-model").classList.add("show");
  };
  openHistoryModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("history-model").style.display = "block";
    document.getElementById("history-model").classList.add("show");
  };
  openDeclineModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("decline-model").style.display = "block";
    document.getElementById("decline-model").classList.add("show");
  };
  // openDeleteModal = () => {
  //   document.getElementById("backdrop").style.display = "block";
  //   document.getElementById("delete-model").style.display = "block";
  //   document.getElementById("delete-model").classList.add("show");
  // };

  closeModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("filter-model").style.display = "none";
    document.getElementById("filter-model").classList.remove("show");
    // document.getElementById("history-model").style.display = "none";
    // document.getElementById("history-model").classList.remove("show");
  };

  closeDeleteModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("decline-model").style.display = "none";
    document.getElementById("decline-model").classList.remove("show");
    // document.getElementById("history-model").style.display = "none";
    // document.getElementById("history-model").classList.remove("show");
  };

  filterModal = () => {
    this.openModal();
    this.handleMenuClose();
  };
  declineModal = () => {
    this.openDeclineModal();
    this.handleMenuClose();
  };
  historyModal = () => {
    this.openHistoryModal();
    this.handleMenuClose();
  };
  declineClose = () => {
    this.setState({
      declineMessage: "",
    });
    this.closeDeleteModal();
  };

  formDateChange = (e) => {
    this.setState({
      formDate: e.target.value,
    });
  };

  toDateChange = (e) => {
    this.setState({
      toDate: e.target.value,
    });
  };
  //................funct for menuBtn on click................
  menuBtnhandleClick = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl: event.currentTarget,
    });
  };
  menuBtnhandleClick_b = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl1: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
      anchorEl1: null,
    });
  };

  // .............pagination function..........

  clickChange = (e) => {
    this.setState({
      current_page: e.target.value,
    });
  };

  // This is goes to the previous page
  exLeft = () => {
    this.setState({
      current_page: 1,
    });
    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
    };
    let returnData = Object.assign(reqData, fetchData);
    this.listApi(returnData);
  };

  // This is goes to the last page
  exRigth = () => {
    let totalPage = this.state.total_page;
    this.setState({
      current_page: totalPage,
    });
    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit),
    };
    let returnData = Object.assign(reqData, fetchData);
    this.listApi(returnData);
  };

  // This is goes to the first page
  prev = () => {
    let currentPage = this.state.current_page;
    if (currentPage > 1) {
      currentPage--;
      this.setState({
        current_page: currentPage,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((currentPage - 1) * this.state.limit),
      };
      let returnData = Object.assign(reqData, fetchData);
      this.listApi(returnData);
    }
  };

  // This is goes to the next page
  next = () => {
    let currentPage = this.state.current_page;
    let totalPage = this.state.total_page;
    if (currentPage < totalPage) {
      currentPage++;
      this.setState({
        current_page: currentPage,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((currentPage - 1) * this.state.limit),
      };
      let returnData = Object.assign(reqData, fetchData);
      this.listApi(returnData);
    }
  };

  onFilterApply = () => {
    // let fetchData = {
    //   limit: JSON.stringify(this.state.limit),
    //   offset: "0",
    //   searchto: this.state.toDate,
    //   searchfrom: this.state.formDate,
    //   status: "",
    //   clientId: "",
    //   serviceType: "",
    //   orderby: "",
    //   direc: "",
    //   rfqId: "",
    // };
    // let returnData = Object.assign(reqData, fetchData);
    // this.listApi(returnData);
    // let data = {
    //   limit: JSON.stringify(this.state.limit),
    //   offset: "0",
    //   name: this.state.name,
    //   email: this.state.email,
    //   phone: this.state.mobile,
    //   orderby: "",
    //   direc: "",
    //   searchto: this.state.toDate,
    //   searchfrom: this.state.formDate,
    //   type: this.state.type,
    //   status: this.state.status.toString(),
    // };

    // console.log("Filter data", data)
    this.closeModal();

    // this.listApi(data);

    // this.setState({
    //   formDate: "",
    //   toDate: "",
    // });
  };

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: "",
    });
  };

  onCancelDataChange = (data) => {
    if (data.value === 1) {
      this.setState({
        isSelected: true,
        isOtherReason: false,
      });
    } else if (data.value === 6) {
      this.setState({
        isSelected: false,
        isOtherReason: true,
      });
    } else {
      this.setState({
        isSelected: false,
        isOtherReason: false,
      });
    }

    this.setState({
      cancellationData: data,
    });
  };

  rescheduledCheckYes = (e) => {
    // console.log(e.target.checked);
    this.setState({
      isSelected: true,
      rescheduledCheck: e.target.checked,
    });
  };
  rescheduledCheckNo = (e) => {
    // console.log(e.target.checked);
    this.setState({
      isSelected: false,
      rescheduledCheck: e.target.checked,
    });
  };

  onRescheduleNote = (e) => {
    this.setState({
      rescheduleNote: e.target.value,
    });
  };

  onDeclineSubmit = async () => {
    let errorCount = 0;

    let validateCancelReason = inputEmptyValidate(this.state.cancellationData);

    // if (validateInterpretationFee === false) {
    if (validateCancelReason === 0) {
      toast.error(AlertMessage.MESSAGE.JOB.EMPTY_MAIN_REASON, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      let data = {
        requestId: this.state.listData[this.state.curIndex].id,
        selectReason:
          this.state.cancellationData.value === 6
            ? this.state.otherReason
            : this.state.cancellationData.label,
        isScheduled: this.state.isSelected ? 1 : 0,
      };
      let res = await ApiCall("cancelJobDetails", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.JOB.CANCEL, {
          hideProgressBar: true,
        });
        this.declineClose();
        this.load();
      }
    }
  };

  onCreateOffer = () => {
    // console.log("hello");
    this.props.history.push({
      pathname: "/adminVendorOffer",
      state: this.state.listData[this.state.curIndex],
    });

    // window.location.reload(false);
  };

  onAppointmentTypeChange = (data) => {
    this.setState({
      appointmentTypeData: data,
    });
  };
  onTargetLangChange = (data) => {
    this.setState({
      targetLangData: data,
    });
  };
  onsourceLangChange = (data) => {
    this.setState({
      sourceLangData: data,
    });
  };
  onStatusChange = (data) => {
    this.setState({
      statusData: data,
    });
  };
  onLeiChange = (data) => {
    this.setState({
      leiData: data,
    });
  };
  onIndustryChange = (data) => {
    this.setState({
      industryData: data,
    });
  };

  appointmentdateChange = (e) => {
    this.setState({
      appointmentDate: e.target.value,
    });
  };

  hourChange = () => {
    let hr = parseInt(this.state.hour) + 1;
    if (parseInt(this.state.hour) + 1 > 12) {
      this.setState({
        hour: "01",
      });
    } else {
      if (parseInt(this.state.hour) + 1 > 9) {
        this.setState({
          hour: hr,
        });
      } else {
        this.setState({
          hour: "0" + hr,
        });
      }
    }
  };

  minChange = () => {
    let min = parseInt(this.state.min) + 1;
    if (parseInt(this.state.min) + 1 > 59) {
      this.setState({
        min: "00",
      });
    } else {
      if (parseInt(this.state.min) + 1 > 9) {
        this.setState({
          min: min,
        });
      } else {
        this.setState({
          min: "0" + min,
        });
      }
    }
  };

  ampmChange = () => {
    if (this.state.ampm === "AM") {
      this.setState({
        ampm: "PM",
      });
    } else {
      this.setState({
        ampm: "AM",
      });
    }
  };

  goEdit = () => {
    this.props.history.push({
      pathname: "/clientJobDetails",
      state: this.state.listData[this.state.curIndex].id,
    });
  };

  openTable = () => {
    this.setState({
      isCalender: false,
    });
  };

  openCalender = async () => {
    // consoleLog("Open calender :::", "asd")
    let reqData = {
      status: "",
      orderby: "",
      direc: "",
      tabType: "4",
      searchFrom: "",
      searchTo: "",
    };
    //...... For All jobs listing for calender.............
    const res = await ApiCallClient("getJobList", reqData);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      // consoleLog("DecodeData::", decodeData.data)
      let listDetails = [];
      if (decodeData.data.jobList.length > 0) {
        listDetails = decodeData.data.jobList;
      }
      // consoleLog("CalenderDAta : ", listDetails)
      this.setState({
        calenderData: listDetails,
        isCalender: true,
      });
    } else {
      toast.error("Calender Not Loaded...");
    }
  };

  detailJob = (value) => {
    // consoleLog("Calender Click", value);
    this.setState({
      curIndex: value.curIndex,
    });

    this.props.history.push({
      pathname: "/clientJobDetails",
      state: this.state.calenderData[value.curIndex].id,
    });
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    const open1 = Boolean(this.state.anchorEl1);
    return (
      <React.Fragment>
        <ToastContainer hideProgressBar theme="colored" />
        {/* <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div> */}
        <div className="component-wrapper vewaljobs">
          {/* <ReactLoader /> */}
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            {" "}
            <Link to="/clientDashboard">Dashboard</Link> / Interpretation Jobs
          </div>
          <div className="vendor-info p-10 _fl sdw">
            <div className="vn-form _fl">
              <div className="row">
                {/* <div className="col-md-4">
                  <div className="vn_frm">
                    {" "}
                    <span style={{ fontSize: "18px", textAlign: "center" }}>
                      Jobs
                    </span>
                    <div className="bts-drop">
                      <div className="dropdown bootstrap-select">
                        <div className="form-input-fields">
                          <input
                            type="text"
                            className="textbox4"
                            style={{
                              borderRadius: "9px",
                              boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 20%)",
                              width: "100px",
                              textAlign: "center"
                            }}
                            value={this.state.totalJob}
                            onChange={this.onJobChange}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-3">
                  <div className="form-input-fields">
                    <input
                      type="text"
                      className="textbox4"
                      placeholder="search"
                      style={{
                        borderRadius: "9px",
                        boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 20%)",
                      }}
                      value={this.state.search}
                      onChange={this.onSearchChange}
                    />
                  </div>
                </div> */}
                <div className="vn-form _fl">
                  <div className="row"></div>
                  <div className="row" style={{ marginTop: "20px" }}>
                    <div className="col-md-12 rateList" style={{ width: "100%" }}>
                      <div
                        className="_fl verificaiton-doc-tab cl-job">
                        <ul>
                          <li
                            data-related="tble-data-a"
                            onClick={() => {
                              this.onTabClick("needAttention");
                            }}
                            style={{ width: "20%" }}
                            className={
                              this.state.isNeedAttention ? "active" : ""
                            }
                          >
                            Need Attention
                          </li>
                          <li
                            data-related="tble-data-b"
                            onClick={() => {
                              this.onTabClick("unAssigned");
                            }}
                            style={{ width: "20%" }}
                            className={
                              this.state.isUnassigned ? "active" : ""
                            }
                          >
                            Unassigned
                          </li>
                          <li
                            data-related="tble-data-c"
                            onClick={() => {
                              this.onTabClick("assigned");
                            }}
                            style={{ width: "20%" }}
                            className={
                              this.state.isAsssigned ? "active" : ""
                            }
                          >
                            Assigned
                          </li>
                          <li
                            data-related="tble-data-d"
                            onClick={() => {
                              this.onTabClick("alljobs");
                            }}
                            style={{ width: "20%" }}
                            className={this.state.isAlljobs ? "active" : ""}
                          >
                            All Jobs
                          </li>
                          <li
                            data-related="tble-data-e"
                            onClick={() => {
                              this.onTabClick("history");
                            }}
                            style={{ width: "20%" }}
                            className={this.state.isHistory ? "active" : ""}
                          >
                            History
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ..................assigned.......................... */}
          {this.state.isAsssigned ? (
            <React.Fragment>
              <div
                id="tble-data-c"
              >
                <AssignedJobs
                  valueData={this.props}
                // listData={this.state.listData}
                />
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {this.state.isUnassigned ? (
                <div
                  id="tble-data-b"
                >
                  <UnassignedJobs unassignedData={this.props} />
                </div>
              ) : (
                <React.Fragment>
                  {this.state.isHistory ? (
                    <div

                      id="tble-data-e"
                    >
                      <HistoryJobs historyData={this.props} />
                    </div>
                  ) : (
                    <React.Fragment>
                      {this.state.isNeedAttention ? (
                        <div

                          id="tble-data-a"
                        >
                          <NeedAttention attentionData={this.props} />
                        </div>
                      ) : (
                        <React.Fragment>
                          {this.state.isAlljobs ? (
                            <div
                              id="tble-data-d"
                            >
                              <AllJobs allJobData={this.props} />
                            </div>
                          ) : (
                            <React.Fragment></React.Fragment>
                          )}
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          )}

        </div>

        <div id="filter-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="filter-head _fl mdf">
                <h3>Filter by</h3>
                <div className="reset-btn-dp">
                  <button className="reset" data-dismiss="modal">
                    <img
                      src={ImageName.IMAGE_NAME.RESET_BTN}
                      onClick={this.onResetFilter}
                    />
                    Reset
                  </button>
                  <button className="apply" data-dismiss="modal">
                    <img
                      src={ImageName.IMAGE_NAME.BLUE_TICK}
                      onClick={this.onFilterApply}
                    />
                    Apply
                  </button>
                </div>
              </div>
              <div className="modal-body">
                <div className="model-info f-model">
                  <div className="form-search-app">
                    <div className="lable-text">requested on</div>
                    <div className="form-field-app">
                      <span>from</span>
                      <input
                        type="date"
                        className="datefield bd"
                        placeholder="10/25/2021"
                        value={this.state.formDate}
                        onChange={this.formDateChange}
                      />
                    </div>
                    <div className="form-field-app">
                      <span>to</span>
                      <input
                        type="date"
                        className="datefield bd"
                        placeholder="10/25/2021"
                        value={this.state.toDate}
                        onChange={this.toDateChange}
                      />
                    </div>
                  </div>
                  <div className="m-select _fl">
                    <div class="row">
                      {/* <div class="col-md-5">
                        <div class="sf-row">
                          <div class="lable-text" style={{ fontSize: "12px" }}>
                            Department
                          </div>
                          <div
                            class="dropdwn"
                            style={{
                              cursor: "pointer",
                              width: "65%",
                              marginLeft: "100px",
                            }}
                          >
                            <Select
                              styles={customStyles}
                              options={this.state.departmentArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.departmentData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onDepartmentChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-1"></div> */}
                      <div class="col-md-5">
                        <div class="sf-row">
                          <div class="lable-text" style={{ fontSize: "13px" }}>
                            Role
                          </div>
                          <div class="dropdwn" style={{ cursor: "pointer" }}>
                            <Select
                              styles={customStyles}
                              options={this.state.filterRoleArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.filterRoleData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onRoleChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="row" style={{ marginTop: "20px" }}>
                      <div class="col-md-5">
                        <div class="sf-row">
                          <div class="lable-text" style={{ fontSize: "12px" }}>
                            Department
                          </div>
                          <div
                            class="dropdwn"
                            style={{
                              cursor: "pointer",
                              width: "65%",
                              marginLeft: "100px",
                            }}
                          >
                            <Select
                              styles={customStyles}
                              options={this.state.departmentArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.departmentData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onDepartmentChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ...........................delete modal.............................. */}
        </div>
        {/* ..................... */}

        {/* ..................Decline modal................................. */}
        <div
          id="decline-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-md modal-dialog-centered ">
            <div className="modal-content" style={{ width: "100%" }}>
              <div className="cancel-job-head">
                <div className="row">
                  <div className="col-md-12">
                    <h2>
                      Cancel Job{" "}
                      <span style={{ fontSize: "17px", marginLeft: "7px" }}>
                        (Interpretation)
                      </span>
                    </h2>
                    <button className="close-page">
                      <img
                        src={ImageName.IMAGE_NAME.CLOSE_BTN_3}
                        onClick={this.declineClose}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-body">
                <div className="create-jeneral-wrap _fl">
                  <div className="create-row-app">
                    <div className="row" style={{ marginBottom: "15px" }}>
                      <div className="col-md-12">
                        <div className="web-form-app">
                          <div className="web-form-bx selct">
                            <div className="frm-label lblSize">
                              Reason for Cancellation
                            </div>
                            <div className="dropdwn selct">
                              <SelectBox
                                optionData={cancelationArr}
                                value={this.state.cancellationData}
                                onSelectChange={(value) => {
                                  this.onCancelDataChange(value);
                                }}
                              />
                            </div>
                          </div>
                          <div
                            className="web-form-bx selct"
                            hidden={!this.state.isOtherReason}
                          >
                            <div className="frm-label lblSize">
                              Other Reason
                            </div>
                            <div
                              className="form-input-fields"
                              style={{ marginBottom: "20px" }}
                            >
                              <textarea
                                value={this.state.otherReason}
                                placeholder=""
                                className="in-textarea msg min table-style"
                                onChange={this.onOtherReasonChange}
                                style={{ resize: "none" }}
                              ></textarea>
                            </div>
                          </div>

                          <div className="web-form-bx selct">
                            <div className="frm-label lblSize">
                              Is the job rescheduled?
                            </div>
                            <div className="check-field">
                              <label className="checkbox_btn">
                                {this.state.isSelected ? (
                                  <input
                                    type="radio"
                                    name="radio1"
                                    checked={true}
                                    onClick={(e) => this.rescheduledCheckYes(e)}
                                  />
                                ) : (
                                  <input
                                    type="radio"
                                    name="radio1"
                                    checked={false}
                                    onClick={(e) => this.rescheduledCheckYes(e)}
                                  />
                                )}
                                <span className="checkmark3"></span> Yes
                              </label>
                            </div>
                            <div className="check-field">
                              <label className="checkbox_btn">
                                {this.state.isSelected ? (
                                  <input
                                    type="radio"
                                    name="radio1"
                                    checked={false}
                                    onClick={(e) => this.rescheduledCheckNo(e)}
                                  />
                                ) : (
                                  <input
                                    type="radio"
                                    name="radio1"
                                    checked={true}
                                    onClick={(e) => this.rescheduledCheckNo(e)}
                                  />
                                )}
                                <span className="checkmark3"></span> No
                              </label>
                            </div>
                          </div>

                          <div
                            className="web-form-bx"
                            hidden={!this.state.isSelected}
                          >
                            <div className="frm-label">
                              Appointment Date & Time
                            </div>
                            <div className="form-input-fields unstyled">
                              <input
                                type="date"
                                id="from_datepicker"
                                className="textbox4 d-icon"
                                placeholder="10/25/2021"
                                onChange={this.appointmentdateChange}
                                style={{
                                  borderRadius: "9px",
                                  boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                }}
                              />
                            </div>

                            <div className="t-time">
                              <span className="t1">
                                <small>
                                  <input
                                    type="text"
                                    placeholder=""
                                    value={this.state.hour}
                                    className="tsd2"
                                    readonly
                                  />
                                  <br />
                                  <img
                                    src={ImageName.IMAGE_NAME.B_ARROW}
                                    alt=""
                                    style={{ cursor: "pointer" }}
                                    onClick={this.hourChange}
                                  />
                                </small>
                              </span>
                              <span className="t2">
                                <small>
                                  <input
                                    type="text"
                                    placeholder=""
                                    value={this.state.min}
                                    className="tsd2"
                                    readonly
                                  />
                                  <br />
                                  <img
                                    src={ImageName.IMAGE_NAME.B_ARROW}
                                    alt=""
                                    style={{ cursor: "pointer" }}
                                    onClick={this.minChange}
                                  />
                                </small>
                              </span>
                              <span className="t3" style={{ marginLeft: "2%" }}>
                                <small>
                                  <input
                                    type="text"
                                    placeholder=""
                                    value={this.state.ampm}
                                    className="tsd2"
                                    readonly
                                  />
                                  <br />
                                  <img
                                    src={ImageName.IMAGE_NAME.B_ARROW}
                                    alt=""
                                    style={{ cursor: "pointer" }}
                                    onClick={this.ampmChange}
                                  />
                                </small>
                              </span>
                            </div>
                          </div>
                          <div
                            className="web-form-bx selct"
                            hidden={!this.state.isSelected}
                          >
                            <div className="frm-label lblSize">Notes</div>
                            <div
                              className="form-input-fields"
                              style={{ marginBottom: "20px" }}
                            >
                              <textarea
                                value={this.state.otherReason}
                                placeholder=""
                                className="in-textarea msg min table-style"
                                onChange={this.onRescheduleNote}
                                style={{ resize: "none" }}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6"></div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="web-form-bx selct">
                          <div className="_button-style _fl text-center">
                            <a
                              href="javascript:void(0)"
                              className="white-btn"
                              onClick={this.declineClose}
                              style={{ textDecoration: "none" }}
                            >
                              cancel
                            </a>
                            <a
                              href="javascript:void(0)"
                              className="blue-btn"
                              style={{ textDecoration: "none", color: "#fff" }}
                              onClick={this.onDeclineSubmit}
                            >
                              submit
                            </a>
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

        <div
          className="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}
