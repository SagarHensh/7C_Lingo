import { Menu, MenuItem } from "@mui/material";
import React, { Component } from "react";
import { AlertMessage, ImageName } from "../../../../../enums";
import { Decoder } from "../../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../../services/constant";
import { ApiCall, ApiCallVendor } from "../../../../../services/middleware";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../../../../Admin/SharedComponents/inputText";
import Select, { components } from "react-select";
import $ from "jquery";
import "./vendorTrainingList.css";
import {
  consoleLog,
  SetDatabaseDateFormat,
  SetUSAdateFormat,
} from "../../../../../services/common-function";
import { toast, ToastContainer } from "react-toastify";
// import ReactLoader from "../../../Loader";
import { inputEmptyValidate } from "../../../../../validators";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const allStatusArr = [
  {
    value: "0",
    label: "Offer Received",
  },
  {
    value: "1",
    label: "Bid Sent",
  },
  {
    value: "2",
    label: "Bid Accepted",
  },
  {
    value: "3",
    label: "In Progress",
  },
  {
    value: "5",
    label: "Declined",
  },
];
const allStatusHistoryArr = [
  {
    value:"4",
    label: "Completed",
  },
  {
    value: "5",
    label: "Declined",
  },
];

const cancelationArr = [
  {
    label: "Last minute reschedule ",
    value: "1",
  },
  {
    label: "Duplicate/Error ",
    value: "2",
  },
  {
    label: "Consumer No Show",
    value: "3",
  },
  {
    label: "Interpreter No Show",
    value: "4",
  },
  {
    label: "Other Service being utilized",
    value: "5",
  },
  {
    label: "Other ",
    value: "6",
  },
];

const reqData = {
  type: "",
  limit: "",
  offset: "",
  status: "",
  fromDate: "",
  toDate: "",
  trainingCatId: "",
  trainingFormatId: "",
  courseId: "",
};

export default class VendorTrainingList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad: true,
      isAlljobs: true,
      isHistory: false,
      startFlag: 0,
      pauseFlag: 0,
      resumeFlag: 0,
      endFlag: 0,

      current_page: 1,
      total_page: 10,
      limit: 20,
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      // .....history.......
      history_current_page: 1,
      history_total_page: 10,
      history_limit: 20,
      history_selectedDisplayData: {
        label: "20",
        value: "20",
      },

      anchorEl: null, //menu button
      anchorEl1: null,
      anchorEl2: null,
      anchorEl3: null,
      cancellationData: {},
      rescheduledCheck: null,
      isSelected: null,
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
      formDateHistory: "",
      toDateHistory: "",
      listData: [],
      historyList: [],
      selectedHistoryStatus: "",
      selectedStatus: {},
      reason: "",
      requestId: "",
      // ...for invoice modal......
      requesterArr: [],
      selectedRequester: {},
      trainingCategoryArr: [],
      selectedTrainingCategory: {},
      courseArr: [],
      selectedCourse: {},
      formatTypeArr: [],
      selectedFormat: {},
      id: "",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();

    document.getElementById("backdrop").style.display = "none";
    var classInstance = this;

    // When the user clicks anywhere outside of the modal, close it

    var modal = document.getElementById("decline-model");
    var filterModal = document.getElementById("filter-model");
    window.onclick = function (event) {
      if (event.target == filterModal) {
        classInstance.closeModal();
      } else if (event.target == modal) {
        classInstance.closeDeclineModal();
      }
    };

    window.$(".verificaiton-doc-tab ul li").on("click", function () {
      $(".verificaiton-doc-tab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
    });
    // this.load();
    window.$(".verificaiton-doc-tab-filter ul li").on("click", function () {
      $(".verificaiton-doc-tab-filter ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk1");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk1");
    });
    window.$(".filterTab ul li").on("click", function () {
      $(".filterTab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk1");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk1");
    });
  }

  load = async () => {
    // ....................For List Data..........................................

    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      type: "all",
      status: "",
      fromDate: "",
      toDate: "",
      requester: "",
      trainingCatId: "",
      trainingFormatId: "",
      courseId: "",
      rfqId: "",
    };
    // let returnData = Object.assign(reqData, fetchData);
    this.listApi(fetchData);
    // ..................variables.................

    let formatMainArr = [],
      leiDataArr = [],
      leiArr = [],
      allCategoryType = [],
      courseArrData = [],
      requesterArrData = [];

    // ..................training Category.......
    let res = await ApiCall("getCourseWithCategory");
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      // console.log("resData>>>", payload);

      if (payload.data.length > 0) {
        payload.data.map((data) => {
          allCategoryType.push({
            label: data.name,
            value: data.id,
          });
        });
      }
    }

    // ................course,,,,,,,,,,,,,,,,,
    let resCourse = await ApiCall("getAllCourseList");
    if (
      resCourse.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resCourse.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(resCourse.data.payload);
      // console.log("resData>>>", payload);
      let courseArr = payload.data.trainingCategories;
      if (courseArr.length > 0) {
        courseArr.map((obj) => {
          courseArrData.push({
            label: obj.name,
            value: obj.id,
          });
        });
      }
    }

    // .....................lei,,,,,,,,,,,,,,,,,,,,,,,
    let leiRes = await ApiCall("getAllLeiList");
    if (
      leiRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      leiRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(leiRes.data.payload);

      leiDataArr = payload.data.leiList;
      // consoleLog("all lei::", leiDataArr);
      for (let k = 0; k < leiDataArr.length; k++) {
        leiArr.push({
          label: leiDataArr[k].name,
          value: leiDataArr[k].userId,
        });
      }
    }

    // ...................requester,,,,,,,,,,,,,,,,,,

    let requesterRes = await ApiCall("fetchAllRequester");
    if (
      requesterRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      requesterRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let requestPayload = await Decoder.decode(requesterRes.data.payload);

      // consoleLog("requestArr::",typeof requestPayload.data.requesterList);
      let requesterResData = requestPayload.data.requesterList;
      if (requesterResData.length > 0) {
        requesterResData.map((obj) => {
          requesterArrData.push({
            label: obj.name,
            value: obj.userId,
          });
        });
      }
    }
    // ..................format Array,,,,,,,,,,,,,,,,
    let lookupres = await ApiCall("getLookUpData");
    if (
      lookupres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      lookupres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(lookupres.data.payload);

      let formatDataArr = payload.data.lookupdata.COURSE_FORMAT_TYPE;

      // consoleLog("lookup::", payload.data.lookupdata.COURSE_FORMAT_TYPE);
      formatDataArr.map((obj) => {
        formatMainArr.push({
          label: obj.name,
          value: obj.id,
        });
      });
    }

    // ............................................................
    let clientDataArr = [];

    let clientinfoRes = await ApiCall("getallclinetinfo");
    if (
      clientinfoRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      clientinfoRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let clientPayload = await Decoder.decode(clientinfoRes.data.payload);
      let clientResData = clientPayload.data.clientlist;
      // console.log("payload::::::::::", clientResData);
      for (let i = 0; i < clientResData.length; i++) {
        clientDataArr.push({
          label: clientResData[i].clientName,
          value: clientResData[i].clientid,
        });
      }
    }

    this.setState({
      isLoad: false,
      trainingCategoryArr: allCategoryType,
      formatTypeArr: formatMainArr,
      leiArr: leiArr,
      requesterArr: requesterArrData,
      courseArr: courseArrData,
    });
  };

  //...........For translation Project Listing...............
  listApi = async (data) => {
    consoleLog("req data::::::", data);
    const res = await ApiCallVendor("getTrainingListForWeb", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      let listData = decodeData.data.trainingList;
      consoleLog("listData:", decodeData);
      if (decodeData.data.trainingList.length > 0) {
        let totalPage = Math.ceil(
          decodeData.data.trainingCount / this.state.limit
        );
        this.setState({
          listData: decodeData.data.trainingList,
          total_page: totalPage,
        });
      } else {
        this.setState({
          listData: listData,
        });
      }
    }
  };

  // ..................for history...................

  history_listApi = async (data) => {
    consoleLog("req data history:::", data);
    const resHistory = await ApiCallVendor("getTrainingListForWeb", data);
    if (
      resHistory.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resHistory.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(resHistory.data.payload);
      consoleLog("#######history", decodeData.data);
      if (decodeData.data.trainingList.length > 0) {
        let totalPage = Math.ceil(
          decodeData.data.trainingCount / this.state.history_limit
        );
        this.setState({
          historyList: decodeData.data.trainingList,
          history_total_page: totalPage,
        });
      }
    }
  };

  //........Page show Limit.........

  onChangeLimit = (dat) => {
    this.setState({
      limit: parseInt(dat.value),
      selectedDisplayData: dat,
      current_page: 1,
    });

    let data = {
      limit: dat.value,
      offset: "0",
      type: "all",
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined ||
        this.state.selectedStatus.value == ""
          ? ""
          : this.state.selectedStatus.value,
      fromDate:
        this.state.formDate == ""
          ? ""
          : SetDatabaseDateFormat(this.state.formDate),
      toDate:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      requester:
        this.state.selectedRequester.value == null ||
        this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
      trainingCatId:
        this.state.selectedTrainingCategory.value == null ||
        this.state.selectedTrainingCategory.value == undefined
          ? ""
          : this.state.selectedTrainingCategory.value,
      trainingFormatId:
        this.state.selectedFormat.value == null ||
        this.state.selectedFormat.value == undefined
          ? ""
          : this.state.selectedFormat.value,
      courseId:
        this.state.selectedCourse.value == null ||
        this.state.selectedCourse.value == undefined
          ? ""
          : this.state.selectedCourse.value,
      rfqId: this.state.id,
    };

    this.listApi(data);
  };
  // ............history.........................

  history_onChangeLimit = (dat) => {
    this.setState({
      history_limit: parseInt(dat.value),
      history_selectedDisplayData: dat,
      history_current_page: 1,
    });

    let data = {
      limit: dat.value,
      offset: "0",
      type: "history",
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined ||
        this.state.selectedStatus.value == ""
          ? ""
          : this.state.selectedStatus.value,
      fromDate:
        this.state.formDate == ""
          ? ""
          : SetDatabaseDateFormat(this.state.formDate),
      toDate:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      requester:
        this.state.selectedRequester.value == null ||
        this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
      trainingCatId:
        this.state.selectedTrainingCategory.value == null ||
        this.state.selectedTrainingCategory.value == undefined
          ? ""
          : this.state.selectedTrainingCategory.value,
      trainingFormatId:
        this.state.selectedFormat.value == null ||
        this.state.selectedFormat.value == undefined
          ? ""
          : this.state.selectedFormat.value,
      courseId:
        this.state.selectedCourse.value == null ||
        this.state.selectedCourse.value == undefined
          ? ""
          : this.state.selectedCourse.value,
      rfqId: this.state.id,
    };

    this.history_listApi(data);
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
  openPauseModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("pause-model").style.display = "block";
    document.getElementById("pause-model").classList.add("show");
  };
  closeModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("filter-model").style.display = "none";
    document.getElementById("filter-model").classList.remove("show");
  };
  closeDeclineModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("decline-model").style.display = "none";
    document.getElementById("decline-model").classList.remove("show");
  };
  closeHistoryModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("history-model").style.display = "none";
    document.getElementById("history-model").classList.remove("show");
  };
  closePauseModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("pause-model").style.display = "none";
    document.getElementById("pause-model").classList.remove("show");
  };

  filterModal = () => {
    this.openModal();
    this.handleMenuClose();
  };
  declineModal = () => {
    // window.$("#decline-model").modal("show");
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
    this.closeDeclineModal();
  };

  onCategoryChange = (data) => {
    // consoleLog("val:::", data.value);
    this.setState({
      selectedTrainingCategory: data,
    });
  };
  onCourseChange = (value) => {
    this.setState({
      selectedCourse: value,
    });
  };
  onFormatChange = (value) => {
    this.setState({
      selectedFormat: value,
    });
  };
  formDateChange = (date) => {
    this.setState({
      formDate: SetUSAdateFormat(date),
    });
  };

  toDateChange = (date) => {
    this.setState({
      toDate: SetUSAdateFormat(date),
    });
  };

  requesterChange = (val) => {
    this.setState({
      selectedRequester: val,
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
  menuBtnhandleClick_c = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl2: event.currentTarget,
    });
  };
  menuBtnhandleClick_d = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl3: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
      anchorEl1: null,
      anchorEl2: null,
      anchorEl3: null,
    });
  };

  // .............pagination function..........

  clickChange = (e) => {
    this.setState({
      current_page: e.target.value,
    });
  };

  history_clickChange = (e) => {
    this.setState({
      history_current_page: e.target.value,
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
      type: "all",
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined ||
        this.state.selectedStatus.value == ""
          ? ""
          : this.state.selectedStatus.value,
      fromDate:
        this.state.formDate == ""
          ? ""
          : SetDatabaseDateFormat(this.state.formDate),
      toDate:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      requester:
        this.state.selectedRequester.value == null ||
        this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
      trainingCatId:
        this.state.selectedTrainingCategory.value == null ||
        this.state.selectedTrainingCategory.value == undefined
          ? ""
          : this.state.selectedTrainingCategory.value,
      trainingFormatId:
        this.state.selectedFormat.value == null ||
        this.state.selectedFormat.value == undefined
          ? ""
          : this.state.selectedFormat.value,
      courseId:
        this.state.selectedCourse.value == null ||
        this.state.selectedCourse.value == undefined
          ? ""
          : this.state.selectedCourse.value,
      rfqId: this.state.id,
    };
    // let returnData = Object.assign(reqData, fetchData);
    // this.listApi(returnData);
    this.listApi(fetchData);
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
      type: "all",
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined ||
        this.state.selectedStatus.value == ""
          ? ""
          : this.state.selectedStatus.value,
      fromDate:
        this.state.formDate == ""
          ? ""
          : SetDatabaseDateFormat(this.state.formDate),
      toDate:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      requester:
        this.state.selectedRequester.value == null ||
        this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
      trainingCatId:
        this.state.selectedTrainingCategory.value == null ||
        this.state.selectedTrainingCategory.value == undefined
          ? ""
          : this.state.selectedTrainingCategory.value,
      trainingFormatId:
        this.state.selectedFormat.value == null ||
        this.state.selectedFormat.value == undefined
          ? ""
          : this.state.selectedFormat.value,
      courseId:
        this.state.selectedCourse.value == null ||
        this.state.selectedCourse.value == undefined
          ? ""
          : this.state.selectedCourse.value,
      rfqId: this.state.id,
    };
    // let returnData = Object.assign(reqData, fetchData);
    this.listApi(fetchData);
  };

  // This is goes to the first page
  prev = () => {
    let currentPage = this.state.current_page;
    if (currentPage > 1) {
      currentPage--;
      this.setState({
        current_page: currentPage,
      });
    }
    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((currentPage - 1) * this.state.limit),
      type: "all",
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined ||
        this.state.selectedStatus.value == ""
          ? ""
          : this.state.selectedStatus.value,
      fromDate:
        this.state.formDate == ""
          ? ""
          : SetDatabaseDateFormat(this.state.formDate),
      toDate:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      requester:
        this.state.selectedRequester.value == null ||
        this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
      trainingCatId:
        this.state.selectedTrainingCategory.value == null ||
        this.state.selectedTrainingCategory.value == undefined
          ? ""
          : this.state.selectedTrainingCategory.value,
      trainingFormatId:
        this.state.selectedFormat.value == null ||
        this.state.selectedFormat.value == undefined
          ? ""
          : this.state.selectedFormat.value,
      courseId:
        this.state.selectedCourse.value == null ||
        this.state.selectedCourse.value == undefined
          ? ""
          : this.state.selectedCourse.value,
      rfqId: this.state.id,
    };
    //   let returnData = Object.assign(reqData, fetchData);
    this.listApi(fetchData);
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
    }
    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((currentPage - 1) * this.state.limit),
      type: "all",
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined ||
        this.state.selectedStatus.value == ""
          ? ""
          : this.state.selectedStatus.value,
      fromDate:
        this.state.formDate == ""
          ? ""
          : SetDatabaseDateFormat(this.state.formDate),
      toDate:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      requester:
        this.state.selectedRequester.value == null ||
        this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
      trainingCatId:
        this.state.selectedTrainingCategory.value == null ||
        this.state.selectedTrainingCategory.value == undefined
          ? ""
          : this.state.selectedTrainingCategory.value,
      trainingFormatId:
        this.state.selectedFormat.value == null ||
        this.state.selectedFormat.value == undefined
          ? ""
          : this.state.selectedFormat.value,
      courseId:
        this.state.selectedCourse.value == null ||
        this.state.selectedCourse.value == undefined
          ? ""
          : this.state.selectedCourse.value,
      rfqId: this.state.id,
    };
    //   let returnData = Object.assign(reqData, fetchData);
    this.listApi(fetchData);
  };

  //   ....................history..................................

  history_exLeft = () => {
    this.setState({
      history_current_page: 1,
    });
    let fetchData = {
      limit: JSON.stringify(this.state.history_limit),
      offset: "0",
      type: "history",
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined ||
        this.state.selectedStatus.value == ""
          ? ""
          : this.state.selectedStatus.value,
      fromDate:
        this.state.formDate == ""
          ? ""
          : SetDatabaseDateFormat(this.state.formDate),
      toDate:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      requester:
        this.state.selectedRequester.value == null ||
        this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
      trainingCatId:
        this.state.selectedTrainingCategory.value == null ||
        this.state.selectedTrainingCategory.value == undefined
          ? ""
          : this.state.selectedTrainingCategory.value,
      trainingFormatId:
        this.state.selectedFormat.value == null ||
        this.state.selectedFormat.value == undefined
          ? ""
          : this.state.selectedFormat.value,
      courseId:
        this.state.selectedCourse.value == null ||
        this.state.selectedCourse.value == undefined
          ? ""
          : this.state.selectedCourse.value,
      rfqId: this.state.id,
    };
    // let returnData = Object.assign(reqData, fetchData);
    this.history_listApi(fetchData);
  };

  // This is goes to the last page
  history_exRigth = () => {
    let totalPage = this.state.history_total_page;
    this.setState({
      history_current_page: totalPage,
    });
    let fetchData = {
      limit: JSON.stringify(this.state.history_limit),
      offset: JSON.stringify((totalPage - 1) * this.state.history_limit),
      type: "history",
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined ||
        this.state.selectedStatus.value == ""
          ? ""
          : this.state.selectedStatus.value,
      fromDate:
        this.state.formDate == ""
          ? ""
          : SetDatabaseDateFormat(this.state.formDate),
      toDate:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      requester:
        this.state.selectedRequester.value == null ||
        this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
      trainingCatId:
        this.state.selectedTrainingCategory.value == null ||
        this.state.selectedTrainingCategory.value == undefined
          ? ""
          : this.state.selectedTrainingCategory.value,
      trainingFormatId:
        this.state.selectedFormat.value == null ||
        this.state.selectedFormat.value == undefined
          ? ""
          : this.state.selectedFormat.value,
      courseId:
        this.state.selectedCourse.value == null ||
        this.state.selectedCourse.value == undefined
          ? ""
          : this.state.selectedCourse.value,
      rfqId: this.state.id,
    };
    // let returnData = Object.assign(reqData, fetchData);
    this.history_listApi(fetchData);
  };

  // This is goes to the first page
  history_prev = () => {
    let currentPage = this.state.history_current_page;
    if (currentPage > 1) {
      currentPage--;
      this.setState({
        history_current_page: currentPage,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.history_limit),
        offset: JSON.stringify((currentPage - 1) * this.state.history_limit),
        type: "history",
        status:
          this.state.selectedStatus.value == null ||
          this.state.selectedStatus.value == undefined ||
          this.state.selectedStatus.value == ""
            ? ""
            : this.state.selectedStatus.value,
        fromDate:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        toDate:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        requester:
          this.state.selectedRequester.value == null ||
          this.state.selectedRequester.value == undefined
            ? ""
            : this.state.selectedRequester.value,
        trainingCatId:
          this.state.selectedTrainingCategory.value == null ||
          this.state.selectedTrainingCategory.value == undefined
            ? ""
            : this.state.selectedTrainingCategory.value,
        trainingFormatId:
          this.state.selectedFormat.value == null ||
          this.state.selectedFormat.value == undefined
            ? ""
            : this.state.selectedFormat.value,
        courseId:
          this.state.selectedCourse.value == null ||
          this.state.selectedCourse.value == undefined
            ? ""
            : this.state.selectedCourse.value,
        rfqId: this.state.id,
      };
      // let returnData = Object.assign(reqData, fetchData);
      this.history_listApi(fetchData);
    }
  };

  // This is goes to the next page
  history_next = () => {
    let currentPage = this.state.history_current_page;
    let totalPage = this.state.history_total_page;
    if (currentPage < totalPage) {
      currentPage++;
      this.setState({
        history_current_page: currentPage,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.history_limit),
        offset: JSON.stringify((currentPage - 1) * this.state.history_limit),
        type: "history",
        status:
          this.state.selectedStatus.value == null ||
          this.state.selectedStatus.value == undefined ||
          this.state.selectedStatus.value == ""
            ? ""
            : this.state.selectedStatus.value,
        fromDate:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        toDate:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        requester:
          this.state.selectedRequester.value == null ||
          this.state.selectedRequester.value == undefined
            ? ""
            : this.state.selectedRequester.value,
        trainingCatId:
          this.state.selectedTrainingCategory.value == null ||
          this.state.selectedTrainingCategory.value == undefined
            ? ""
            : this.state.selectedTrainingCategory.value,
        trainingFormatId:
          this.state.selectedFormat.value == null ||
          this.state.selectedFormat.value == undefined
            ? ""
            : this.state.selectedFormat.value,
        courseId:
          this.state.selectedCourse.value == null ||
          this.state.selectedCourse.value == undefined
            ? ""
            : this.state.selectedCourse.value,
        rfqId: this.state.id,
      };
      // let returnData = Object.assign(reqData, fetchData);
      this.history_listApi(fetchData);
    }
  };

  onFilterApply = () => {
    if (this.state.isAlljobs) {
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: "0",
        type: "all",
        status:
          this.state.selectedStatus.value == null ||
          this.state.selectedStatus.value == undefined ||
          this.state.selectedStatus.value == ""
            ? ""
            : this.state.selectedStatus.value,
        fromDate:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        toDate:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        requester:
          this.state.selectedRequester.value == null ||
          this.state.selectedRequester.value == undefined
            ? ""
            : this.state.selectedRequester.value,
        trainingCatId:
          this.state.selectedTrainingCategory.value == null ||
          this.state.selectedTrainingCategory.value == undefined
            ? ""
            : this.state.selectedTrainingCategory.value,
        trainingFormatId:
          this.state.selectedFormat.value == null ||
          this.state.selectedFormat.value == undefined
            ? ""
            : this.state.selectedFormat.value,
        courseId:
          this.state.selectedCourse.value == null ||
          this.state.selectedCourse.value == undefined
            ? ""
            : this.state.selectedCourse.value,
        rfqId: this.state.id,
      };

      this.listApi(fetchData);
      this.closeModal();

      this.setState({
        current_page: 1,
      });
    } else {
      let fetchData = {
        limit: JSON.stringify(this.state.history_limit),
        offset: "0",
        type: "history",
        status:
          this.state.selectedStatus.value == null ||
          this.state.selectedStatus.value == undefined ||
          this.state.selectedStatus.value == ""
            ? ""
            : this.state.selectedStatus.value,
        fromDate:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        toDate:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        requester:
          this.state.selectedRequester.value == null ||
          this.state.selectedRequester.value == undefined
            ? ""
            : this.state.selectedRequester.value,
        trainingCatId:
          this.state.selectedTrainingCategory.value == null ||
          this.state.selectedTrainingCategory.value == undefined
            ? ""
            : this.state.selectedTrainingCategory.value,
        trainingFormatId:
          this.state.selectedFormat.value == null ||
          this.state.selectedFormat.value == undefined
            ? ""
            : this.state.selectedFormat.value,
        courseId:
          this.state.selectedCourse.value == null ||
          this.state.selectedCourse.value == undefined
            ? ""
            : this.state.selectedCourse.value,
        rfqId: this.state.id,
      };

      this.history_listApi(fetchData);
      this.closeModal();

      this.setState({
        history_current_page: 1,
      });
    }
  };

  onResetFilter = () => {
    if (this.state.isAlljobs) {
      this.resetData();
      this.setState({
        selectedDisplayData: {
          label: "20",
          value: "20",
        },
        current_page: 1,
      });

      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: "0",
        type: "all",
        status: "",
        fromDate: "",
        toDate: "",
        requester: "",
        trainingCatId: "",
        trainingFormatId: "",
        courseId: "",
        rfqId: "",
      };

      this.listApi(fetchData);
      this.closeModal();
    } else {
      this.resetData();
      this.setState({
        history_selectedDisplayData: {
          label: "20",
          value: "20",
        },
        history_current_page: 1,
      });

      let fetchData = {
        limit: JSON.stringify(this.state.history_limit),
        offset: "0",
        type: "history",
        status: "",
        fromDate: "",
        toDate: "",
        requester: "",
        trainingCatId: "",
        trainingFormatId: "",
        courseId: "",
        rfqId: "",
      };

      this.history_listApi(fetchData);
      this.closeModal();
    }
  };

  resetData = () => {
    this.setState({
      formDate: "",
      toDate: "",
      id: "",
      input: "",
      selectedFormat: {},
      selectedTrainingCategory: {},
      selectedCourse: {},
      selectedRequester: {},
      selectedStatus: {},
    });
  };

  //   .............history................

  onCancelDataChange = (data) => {
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

  onDeclineSubmit = async () => {
    let mainData = this.props.location;
    let preData = mainData.state;
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
      } else {
        if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST
        ) {
          toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_EXIST, {
            hideProgressBar: true,
          });
        } else if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.PHONE_EXIST
        ) {
          toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EXIST, {
            hideProgressBar: true,
          });
        } else if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_PHONE_EXIST
        ) {
          toast.error(AlertMessage.MESSAGE.EMAIL_MOBILE.DUBLICATE, {
            hideProgressBar: true,
          });
        }
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

  onTabClick = (value) => {
    if (value === "alljobs") {
      this.setState({
        isAlljobs: true,
        isHistory: false,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
        type: "all",
        status: "",
        fromDate: "",
        toDate: "",
        requester: "",
        trainingCatId: "",
        trainingFormatId: "",
        courseId: "",
        rfqId: "",
      };
      // let returnData = Object.assign(reqData, fetchData);
      this.listApi(fetchData);
    } else if (value === "history") {
      this.setState({
        isAlljobs: false,
        isHistory: true,
      });

      let fetchHistoryData = {
        limit: JSON.stringify(this.state.history_limit),
        offset: JSON.stringify(
          (this.state.history_current_page - 1) * this.state.history_limit
        ),
        type: "history",
        status: "",
        fromDate: "",
        toDate: "",
        trainingCatId: "",
        trainingFormatId: "",
        courseId: "",
        rfqId: "",
      };
      this.history_listApi(fetchHistoryData);
    }
  };

  onStatusChange = (data) => {
  consoleLog("vallllll",data)
    this.setState({
      selectedStatus: data,
    });
  };
  onStatusHistoryChange = (data) => {
    let obj = { label: data.label, value: data.value };
    this.setState({
      selectedHistoryStatus: obj,
    });
  };
  onLeiChange = (data) => {
    this.setState({
      leiData: data,
    });
  };

  goEdit = () => {
    this.props.history.push({
      pathname: "/vendorTrainingDetails",
      state: this.state.listData[this.state.curIndex],
    });
  };
  goHistoryEdit = () => {
    this.props.history.push({
      pathname: "/vendorTrainingDetails",
      state: this.state.historyList[this.state.curIndex],
    });
  };

  fullDateFormat = (date) => {
    try {
      let resDate = "";
      if (date) {
        const currentDate = new Date(date);
        let hours = currentDate.getHours(),
          minutes = currentDate.getMinutes(),
          secound = currentDate.getSeconds();
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        secound = secound < 10 ? "0" + secound : secound;
        resDate =
          currentDate.getFullYear() +
          "-" +
          ("0" + (currentDate.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + currentDate.getDate()).slice(-2) +
          " " +
          hours +
          ":" +
          minutes +
          ":" +
          secound;
      }
      return resDate;
    } catch (err) {
      console.log(err);
    }
  };

  onStart = async (item) => {
    let reqData = {
      id: item.requestId,
      type: "start",
      timestamp: this.fullDateFormat(new Date()),
    };
    // this.setState({
    //   startFlag: 1,
    //   endFlag:1
    // });
    let jobStatusChange = await ApiCallVendor(
      "updateInterpretationJobStat",
      reqData
    );

    if (
      jobStatusChange.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      jobStatusChange.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.setState({
        startFlag: 1,
        endFlag: 1,
      });

      toast.success(AlertMessage.MESSAGE.BID.STARTED, {
        hideProgressBar: true,
      });

      this.load();
    } else {
      this.setState({
        startFlag: 0,
      });

      toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
    }
  };

  onEnd = async (item) => {
    let reqData = {
      id: item.requestId,
      type: "end",
      timestamp: this.fullDateFormat(new Date()),
    };
    // this.setState({
    //   startFlag: 1,
    //   endFlag:1
    // });
    let jobStatusChange = await ApiCallVendor(
      "updateInterpretationJobStat",
      reqData
    );

    if (
      jobStatusChange.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      jobStatusChange.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      // this.setState({
      //   startFlag: 1,
      //   endFlag: 1,
      // });
      this.handleMenuClose();

      toast.success(AlertMessage.MESSAGE.BID.END, {
        hideProgressBar: true,
      });

      this.load();
    } else {
      toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
    }
  };

  onPause = (item) => {
    consoleLog("item:", item);
    this.openPauseModal();
    this.setState({
      requestId: item.requestId,
    });
    this.handleMenuClose();
  };
  onPauseClose = () => {
    this.closePauseModal();
  };
  onPauseSubmit = async (item) => {
    this.closePauseModal();
    let data = {
      reason: this.state.reason,
      workStatus: "0",
      requestId: this.state.requestId,
      timestamp: this.fullDateFormat(new Date()),
    };
    let res = await ApiCallVendor("changeOngoingJobStat", data);
    consoleLog("res::", res);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.setState({
        pauseFlag: 1,
      });

      toast.success(AlertMessage.MESSAGE.BID.PAUSE, {
        hideProgressBar: true,
      });
    } else {
      toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
    }
  };

  onResume = async (item) => {
    let data = {
      reason: this.state.reason,
      workStatus: "1",
      requestId: item.requestId,
      timestamp: this.fullDateFormat(new Date()),
    };

    let res = await ApiCallVendor("changeOngoingJobStat", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.handleMenuClose();

      this.setState({
        pauseFlag: 0,
      });

      toast.success(AlertMessage.MESSAGE.BID.RESUME, {
        hideProgressBar: true,
      });
    } else {
      toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
    }
  };

  onIdChange = (val) => {
    if(this.state.isAlljobs){
      let resData = {
        limit: this.state.limit,
        offset: JSON.stringify(
          (this.state.current_page - 1) * this.state.limit
        ),
        type:"all",
        status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined ||
        this.state.selectedStatus.value == ""
          ? ""
          : this.state.selectedStatus.value,
      fromDate:
        this.state.formDate == ""
          ? ""
          : SetDatabaseDateFormat(this.state.formDate),
      toDate:
        this.state.toDate == ""
          ? ""
          : SetDatabaseDateFormat(this.state.toDate),
      requester:
        this.state.selectedRequester.value == null ||
        this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
      trainingCatId:
        this.state.selectedTrainingCategory.value == null ||
        this.state.selectedTrainingCategory.value == undefined
          ? ""
          : this.state.selectedTrainingCategory.value,
      trainingFormatId:
        this.state.selectedFormat.value == null ||
        this.state.selectedFormat.value == undefined
          ? ""
          : this.state.selectedFormat.value,
      courseId:
        this.state.selectedCourse.value == null ||
        this.state.selectedCourse.value == undefined
          ? ""
          : this.state.selectedCourse.value,
      rfqId: val,
      };

      // let mainData = Object.assign(reqData, resData);

      this.listApi(resData);
    } else {
      let resData = {
        limit: this.state.history_limit,
        offset: JSON.stringify(
          (this.state.history_current_page - 1) * this.state.history_limit
        ),
        type:"history",
        status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined ||
        this.state.selectedStatus.value == ""
          ? ""
          : this.state.selectedStatus.value,
      fromDate:
        this.state.formDate == ""
          ? ""
          : SetDatabaseDateFormat(this.state.formDate),
      toDate:
        this.state.toDate == ""
          ? ""
          : SetDatabaseDateFormat(this.state.toDate),
      requester:
        this.state.selectedRequester.value == null ||
        this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
      trainingCatId:
        this.state.selectedTrainingCategory.value == null ||
        this.state.selectedTrainingCategory.value == undefined
          ? ""
          : this.state.selectedTrainingCategory.value,
      trainingFormatId:
        this.state.selectedFormat.value == null ||
        this.state.selectedFormat.value == undefined
          ? ""
          : this.state.selectedFormat.value,
      courseId:
        this.state.selectedCourse.value == null ||
        this.state.selectedCourse.value == undefined
          ? ""
          : this.state.selectedCourse.value,
      rfqId: val,
      };

      this.history_listApi(resData);
    }
    this.setState({
      id: val,
    });
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    const open1 = Boolean(this.state.anchorEl1);
    const open2 = Boolean(this.state.anchorEl2);
    const open3 = Boolean(this.state.anchorEl3);
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
        <ToastContainer hideProgressBar theme="colored" />
        {/* <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div> */}
        {/* <Header />
          <Sidebar /> */}
        <div className="component-wrapper vewaljobs">
          {/* <ReactLoader /> */}
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            <Link to="/vendorDashboard">Dashboard</Link> / Training
          </div>
          <div className="vendor-info p-10 _fl sdw">
            <div className="vn-form _fl">
              <div className="row">
                <div className="col-md-4">
                  <div className="vn_frm">
                    <span
                      style={{
                        width: "30%",

                        paddingLeft: "5px",
                        fontSize: "14px",
                      }}
                    >
                      Project ID
                    </span>
                    <InputText
                      placeholder="Search"
                      className="inputfield"
                      value={this.state.id}
                      onTextChange={(value) => {
                        this.onIdChange(value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <div className="_fl verificaiton-doc-tab ven">
                    <ul>
                      <li
                        className="active"
                        data-related="tble-data-a"
                        onClick={() => {
                          this.onTabClick("alljobs");
                        }}
                      >
                        All Projects
                      </li>
                      <li
                        data-related="tble-data-b"
                        onClick={() => {
                          this.onTabClick("history");
                        }}
                      >
                        History
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="table-filter-app">
            <div className="row">
              <div className="col-md-6">
                <div className="cus-filter-btn">
                  {/* <button className="button">
                                        <img src={ImageName.IMAGE_NAME.MENU_BTN} />
                                    </button>
                                    <button className="button">
                                        <img src={ImageName.IMAGE_NAME.MENU_BTN_ONE} />
                                    </button>
                                    <button className="button">
                                        <img src={ImageName.IMAGE_NAME.MENU_BTN_TWO} />
                                    </button> */}

                  <div
                    class="filter-btn"
                    style={{ float: "none", paddingLeft: "10px" }}
                  >
                    <a href="#" onClick={this.filterModal}>
                      Filter
                    </a>
                  </div>

                  {this.state.isAlljobs ? (
                    <React.Fragment>
                      <div className="filter-pagination">
                        <button
                          className="prev_btn"
                          onClick={this.exLeft}
                        ></button>
                        <button className="prv_btn" onClick={this.prev}>
                          {" "}
                          {"<"}
                        </button>
                        <span
                          className="num"
                          onChange={(e) => this.clickChange(e)}
                        >
                          {this.state.current_page}
                        </span>
                        <button className="nxt_btn" onClick={this.next}>
                          {">"}
                        </button>
                        <button
                          className="next_btn"
                          onClick={this.exRigth}
                        ></button>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div className="filter-pagination">
                        <button
                          className="prev_btn"
                          onClick={this.history_exLeft}
                        ></button>
                        <button className="prv_btn" onClick={this.history_prev}>
                          {" "}
                          {"<"}
                        </button>
                        <span
                          className="num"
                          onChange={(e) => this.history_clickChange(e)}
                        >
                          {this.state.history_current_page}
                        </span>
                        <button className="nxt_btn" onClick={this.history_next}>
                          {">"}
                        </button>
                        <button
                          className="next_btn"
                          onClick={this.history_exRigth}
                        ></button>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="table-filter-box">
                  {/* <div className="export-btn" onClick={this.onExport}>
                    <a href="">Export</a>
                  </div>
                  <div className="addnew">
                    <a href="#">Add New</a>
                  </div> */}
                  <div className="tble-short">
                    {" "}
                    <span className="lbl">Display</span>
                    <div
                      class="dropdwn"
                      style={{
                        width: "70px",
                        fontSize: "12px",
                        textAlign: "center",
                      }}
                    >
                      {this.state.isAlljobs ? (
                        <React.Fragment>
                          <PaginationDropdown
                            optionData={CommonData.COMMON.DISPLAY_ARR}
                            value={this.state.selectedDisplayData}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onChangeLimit(value);
                            }}
                          />
                        </React.Fragment>
                      ) : this.state.isHistory ? (
                        <React.Fragment>
                          <PaginationDropdown
                            optionData={CommonData.COMMON.DISPLAY_ARR}
                            value={this.state.history_selectedDisplayData}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.history_onChangeLimit(value);
                            }}
                          />
                        </React.Fragment>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="tab-app-information activeLnk"
            id="tble-data-a"
            hidden={!this.state.isAlljobs}
          >
            <div className="table-listing-app">
              <div className="table-responsive_cus table-style-a">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tbody>
                    <tr>
                      <th style={{ width: "20%" }}>Project#</th>
                      {/* <th style={{ width: "20%" }}>Client</th> */}
                      <th style={{ width: "20%" }}>Service Type</th>
                      <th style={{ width: "15%" }}>Date</th>
                      <th style={{ width: "15%" }}>Status</th>
                      <th style={{ width: "10%" }}>Action</th>
                    </tr>
                    {this.state.listData.length > 0 ? (
                      <React.Fragment>
                        {this.state.listData.map((item, key) => (
                          <tr>
                            <td colspan="5">
                              <div className="tble-row">
                                <table
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td style={{ width: "20%" }}>
                                        {item.jobId}
                                      </td>
                                      {/* <td style={{ width: "20%" }}>
                                                                            {item.clientName}
                                                                        </td> */}

                                      <td style={{ width: "20%" }}>
                                        {item.trainingCategory}
                                      </td>

                                      <td style={{ width: "15%" }}>
                                        {item.scheduleDate} |{" "}
                                        {item.scheduleTime}
                                      </td>
                                      {/* <td style={{ width: "20%" }}>
                                                                        {item.language}
                                                                    </td> */}
                                      {/* <td style={{ width: "8%" }}></td> */}
                                      <td style={{ width: "15%" }}>
                                        {item.status === 0 ? (
                                          <React.Fragment>
                                            <span className="progress-btn yellow">
                                              Offer Received
                                            </span>
                                          </React.Fragment>
                                        ) : item.status === 1 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn sky"
                                            >
                                              Bid Sent
                                            </span>
                                          </React.Fragment>
                                        ) : item.status === 2 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn green"
                                            >
                                              Bid Accepted
                                            </span>
                                          </React.Fragment>
                                        ) : item.status === 3 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn yellow"
                                            >
                                              In Progress
                                            </span>
                                          </React.Fragment>
                                        ) : item.status === 4 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn blue"
                                            >
                                              Completed
                                            </span>
                                          </React.Fragment>
                                        ) : item.status === 5 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn red"
                                            >
                                              Declined
                                            </span>
                                          </React.Fragment>
                                        ) : (
                                          <React.Fragment></React.Fragment>
                                        )}
                                      </td>
                                      <td style={{ width: "10%" }}>
                                        {item.status === 3 ? (
                                          <React.Fragment>
                                            <img
                                              src={
                                                ImageName.IMAGE_NAME
                                                  .MENU_VERTICAL
                                              }
                                              style={{ cursor: "pointer" }}
                                              id="basic-button"
                                              aria-controls="basic-menu"
                                              aria-haspopup="true"
                                              aria-expanded={
                                                open2 ? "true" : undefined
                                              }
                                              onClick={(e) =>
                                                this.menuBtnhandleClick_c(
                                                  key,
                                                  e
                                                )
                                              }
                                            />
                                            <Menu
                                              id="basic-menu"
                                              anchorEl={this.state.anchorEl2}
                                              open={open2}
                                              onClose={this.handleMenuClose}
                                              MenuListProps={{
                                                "aria-labelledby":
                                                  "basic-button",
                                              }}
                                            >
                                              <MenuItem onClick={this.goEdit}>
                                                View Details
                                              </MenuItem>

                                              <MenuItem>
                                                {this.state.pauseFlag === 1 ? (
                                                  <React.Fragment>
                                                    <div
                                                      onClick={() =>
                                                        this.onResume(item)
                                                      }
                                                    >
                                                      Resume
                                                    </div>
                                                  </React.Fragment>
                                                ) : (
                                                  <React.Fragment>
                                                    <div
                                                      onClick={() =>
                                                        this.onPause(item)
                                                      }
                                                    >
                                                      Pause
                                                    </div>
                                                  </React.Fragment>
                                                )}
                                              </MenuItem>
                                              <MenuItem>
                                                <React.Fragment>
                                                  <div
                                                    onClick={() =>
                                                      this.onEnd(
                                                        item,
                                                        key,
                                                        "end"
                                                      )
                                                    }
                                                  >
                                                    End
                                                  </div>
                                                </React.Fragment>
                                              </MenuItem>
                                              <MenuItem
                                                onClick={this.declineModal}
                                              >
                                                Cancel
                                              </MenuItem>
                                            </Menu>
                                          </React.Fragment>
                                        ) : item.status === 2 ? (
                                          <React.Fragment>
                                            <img
                                              src={
                                                ImageName.IMAGE_NAME
                                                  .MENU_VERTICAL
                                              }
                                              style={{ cursor: "pointer" }}
                                              id="basic-button"
                                              aria-controls="basic-menu"
                                              aria-haspopup="true"
                                              aria-expanded={
                                                open3 ? "true" : undefined
                                              }
                                              onClick={(e) =>
                                                this.menuBtnhandleClick_d(
                                                  key,
                                                  e
                                                )
                                              }
                                            />

                                            <Menu
                                              id="basic-menu"
                                              anchorEl={this.state.anchorEl3}
                                              open={open3}
                                              onClose={this.handleMenuClose}
                                              MenuListProps={{
                                                "aria-labelledby":
                                                  "basic-button",
                                              }}
                                            >
                                              <MenuItem onClick={this.goEdit}>
                                                View Details
                                              </MenuItem>
                                              <MenuItem
                                                onClick={() =>
                                                  this.onStart(
                                                    item,
                                                    key,
                                                    "start"
                                                  )
                                                }
                                              >
                                                Start
                                              </MenuItem>
                                              <MenuItem
                                                onClick={this.declineModal}
                                              >
                                                Cancel
                                              </MenuItem>
                                            </Menu>
                                          </React.Fragment>
                                        ) : (
                                          <React.Fragment>
                                            <img
                                              src={
                                                ImageName.IMAGE_NAME
                                                  .MENU_VERTICAL
                                              }
                                              style={{ cursor: "pointer" }}
                                              id="basic-button"
                                              aria-controls="basic-menu"
                                              aria-haspopup="true"
                                              aria-expanded={
                                                open ? "true" : undefined
                                              }
                                              onClick={(e) =>
                                                this.menuBtnhandleClick(key, e)
                                              }
                                            />
                                            <Menu
                                              id="basic-menu"
                                              anchorEl={this.state.anchorEl}
                                              open={open}
                                              onClose={this.handleMenuClose}
                                              MenuListProps={{
                                                "aria-labelledby":
                                                  "basic-button",
                                              }}
                                            >
                                              <MenuItem onClick={this.goEdit}>
                                                View Details
                                              </MenuItem>
                                              <MenuItem
                                                onClick={this.declineModal}
                                              >
                                                Cancel
                                              </MenuItem>
                                            </Menu>
                                          </React.Fragment>
                                        )}

                                        {/* </div> */}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <tr style={{ textAlign: "center" }}>
                          <td colSpan="5">
                            <center style={{ fontSize: "20px" }}>
                              No data found !!!
                            </center>
                          </td>
                        </tr>
                      </React.Fragment>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div
            className="tab-app-information"
            id="tble-data-b"
            hidden={!this.state.isHistory}
          >
            <div className="table-listing-app">
              <div className="table-responsive_cus table-style-a">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tbody>
                    <tr>
                      <th style={{ width: "20%" }}>Project#</th>
                      {/* <th style={{ width: "20%" }}>Client</th> */}
                      <th style={{ width: "20%" }}>Service Type</th>
                      <th style={{ width: "15%" }}>Date</th>
                      <th style={{ width: "15%" }}>Status</th>
                      <th style={{ width: "10%" }}>Action</th>
                    </tr>

                    {this.state.historyList.length > 0 ? (
                      <React.Fragment>
                        {this.state.historyList.map((item, key) => (
                          <tr>
                            <td colspan="5">
                              <div className="tble-row">
                                <table
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td style={{ width: "20%" }}>
                                        {item.jobId}
                                      </td>
                                      {/* <td style={{ width: "15%" }}>
                                          {item.clientName}
                                        </td> */}

                                      <td style={{ width: "20%" }}>
                                        {item.trainingCategory}
                                      </td>

                                      <td style={{ width: "15%" }}>
                                        {item.scheduleDate} |{" "}
                                        {item.scheduleTime}
                                      </td>
                                      {/* <td style={{ width: "20%" }}>
                                          {item.language}
                                        </td> */}
                                      <td style={{ width: "15%" }}>
                                        {item.status === 0 ? (
                                          <React.Fragment>
                                            <span className="progress-btn yellow">
                                              Offer Received
                                            </span>
                                          </React.Fragment>
                                        ) : item.status === 1 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn sky"
                                            >
                                              Bid Sent
                                            </span>
                                          </React.Fragment>
                                        ) : item.status === 2 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn blue"
                                            >
                                              Bid Accepted
                                            </span>
                                          </React.Fragment>
                                        ) : item.status === 3 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn sky"
                                            >
                                              In Progress
                                            </span>
                                          </React.Fragment>
                                        ) : item.status === 4 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn green"
                                            >
                                              Completed
                                            </span>
                                          </React.Fragment>
                                        ) : item.status === 5 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn red"
                                            >
                                              Declined
                                            </span>
                                          </React.Fragment>
                                        ) : (
                                          <React.Fragment></React.Fragment>
                                        )}
                                      </td>
                                      <td style={{ width: "10%" }}>
                                        {/* <React.Fragment>
                                              <img
                                                src={
                                                  ImageName.IMAGE_NAME
                                                    .MENU_VERTICAL
                                                }
                                                style={{ cursor: "pointer" }}
                                                id="basic-button"
                                                aria-controls="basic-menu"
                                                aria-haspopup="true"
                                                aria-expanded={
                                                  open ? "true" : undefined
                                                }
                                                onClick={(e) =>
                                                  this.menuBtnhandleClick(
                                                    key,
                                                    e
                                                  )
                                                }
                                              />
                                              <Menu
                                                id="basic-menu"
                                                anchorEl={this.state.anchorEl}
                                                open={open}
                                                onClose={this.handleMenuClose}
                                                MenuListProps={{
                                                  "aria-labelledby":
                                                    "basic-button",
                                                }}
                                              >
                                                
                                                  <MenuItem
                                                    onClick={this.goHistoryEdit}
                                                  >
                                                    View Details
                                                  </MenuItem>
                                               
                                                 
                                                <MenuItem>Chat</MenuItem>
                                                <MenuItem
                                                  onClick={this.declineModal}
                                                >
                                                  Cancel
                                                </MenuItem>
                                              </Menu>
                                            </React.Fragment> */}

                                        <React.Fragment>
                                          <img
                                            src={
                                              ImageName.IMAGE_NAME.MENU_VERTICAL
                                            }
                                            style={{ cursor: "pointer" }}
                                            id="basic-button"
                                            aria-controls="basic-menu"
                                            aria-haspopup="true"
                                            aria-expanded={
                                              open1 ? "true" : undefined
                                            }
                                            onClick={(e) =>
                                              this.menuBtnhandleClick_b(key, e)
                                            }
                                          />
                                          <Menu
                                            id="basic-menu"
                                            anchorEl={this.state.anchorEl1}
                                            open={open1}
                                            onClose={this.handleMenuClose}
                                            MenuListProps={{
                                              "aria-labelledby": "basic-button",
                                            }}
                                          >
                                            <MenuItem
                                              onClick={this.goHistoryEdit}
                                            >
                                              View Details
                                            </MenuItem>
                                          </Menu>
                                        </React.Fragment>

                                        {/* </div> */}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <tr style={{ textAlign: "center" }}>
                          <td colSpan="5">
                            <center style={{ fontSize: "20px" }}>
                              No data found !!!
                            </center>
                          </td>
                        </tr>
                      </React.Fragment>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="table-filter-app">
            <div className="row">
              <div className="col-md-6">
                <div className="cus-filter-btn">
                  {/* <button className="button">
                                        <img src={ImageName.IMAGE_NAME.MENU_BTN} />
                                    </button>
                                    <button className="button">
                                        <img src={ImageName.IMAGE_NAME.MENU_BTN_ONE} />
                                    </button>
                                    <button className="button">
                                        <img src={ImageName.IMAGE_NAME.MENU_BTN_TWO} />
                                    </button> */}

                  {this.state.isAlljobs ? (
                    <React.Fragment>
                      <div className="filter-pagination">
                        <button
                          className="prev_btn"
                          onClick={this.exLeft}
                        ></button>
                        <button className="prv_btn" onClick={this.prev}>
                          {" "}
                          {"<"}
                        </button>
                        <span
                          className="num"
                          onChange={(e) => this.clickChange(e)}
                        >
                          {this.state.current_page}
                        </span>
                        <button className="nxt_btn" onClick={this.next}>
                          {">"}
                        </button>
                        <button
                          className="next_btn"
                          onClick={this.exRigth}
                        ></button>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div className="filter-pagination">
                        <button
                          className="prev_btn"
                          onClick={this.history_exLeft}
                        ></button>
                        <button className="prv_btn" onClick={this.history_prev}>
                          {" "}
                          {"<"}
                        </button>
                        <span
                          className="num"
                          onChange={(e) => this.history_clickChange(e)}
                        >
                          {this.state.history_current_page}
                        </span>
                        <button className="nxt_btn" onClick={this.history_next}>
                          {">"}
                        </button>
                        <button
                          className="next_btn"
                          onClick={this.history_exRigth}
                        ></button>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="table-filter-box">
                  {/* <div className="export-btn" onClick={this.onExport}>
                    <a href="">Export</a>
                  </div>
                  <div className="addnew">
                    <a href="#">Add New</a>
                  </div> */}
                  <div className="tble-short">
                    {" "}
                    <span className="lbl">Display</span>
                    <div
                      class="dropdwn"
                      style={{
                        width: "70px",
                        fontSize: "12px",
                        textAlign: "center",
                      }}
                    >
                      {this.state.isAlljobs ? (
                        <React.Fragment>
                          <PaginationDropdown
                            optionData={CommonData.COMMON.DISPLAY_ARR}
                            value={this.state.selectedDisplayData}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onChangeLimit(value);
                            }}
                          />
                        </React.Fragment>
                      ) : this.state.isHistory ? (
                        <React.Fragment>
                          <PaginationDropdown
                            optionData={CommonData.COMMON.DISPLAY_ARR}
                            value={this.state.history_selectedDisplayData}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.history_onChangeLimit(value);
                            }}
                          />
                        </React.Fragment>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Filter Section= */}
        </div>
        <div
          id="filter-model"
          className="modal fade modelwindow filter-pop"
          role="dialog"
        >
          <div className="modal-dialog modal-lg jobhrtypage">
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
              {/* <div className="filter-head _fl">
                <h3>Filter by</h3>
                <div className="reset-btn">
                  <button className="reset">Reset</button>
                  <button className="apply">Apply</button>
                  <button className="close-page">
                    <img src={ImageName.IMAGE_NAME.CLOSE_BTN_2} />
                    &nbsp;
                  </button>
                </div>
              </div> */}
              <div className="modal-body">
                <div className="job_filt_lfe">
                  <div class="_fl filterTab">
                    <ul style={{ cursor: "pointer" }}>
                      <li
                        className="active"
                        data-related="tble-data-d"
                        style={{ padding: "20px 20px" }}
                      >
                        Training Category
                      </li>
                      <li
                        data-related="tble-data-e"
                        style={{ padding: "20px 20px" }}
                      >
                        Training Course
                      </li>
                      <li
                        data-related="tble-data-f"
                        style={{ padding: "20px 20px" }}
                      >
                        Requester
                      </li>
                      <li
                        data-related="tble-data-g"
                        style={{ padding: "20px 20px" }}
                      >
                        Format
                      </li>
                      <li
                        data-related="tble-data-h"
                        style={{ padding: "20px 20px" }}
                      >
                        Date
                      </li>
                      <li
                        data-related="tble-data-i"
                        style={{ padding: "20px 20px" }}
                      >
                        Status
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  className="tab-app-information activeLnk1 "
                  id="tble-data-d"
                >
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row" style={{ padding: "30px" }}>
                            <div className="col-md-10">
                              <div className="row">
                                <div
                                  class="lable-text"
                                  style={{ fontSize: "20px" }}
                                >
                                  Training Category
                                </div>
                              </div>
                              <div className="row">
                                <div
                                  class="dropdwn"
                                  style={{ cursor: "pointer" }}
                                >
                                  <SelectBox
                                    optionData={this.state.trainingCategoryArr}
                                    value={this.state.selectedTrainingCategory}
                                    placeholder="Select"
                                    onSelectChange={(value) => {
                                      this.onCategoryChange(value);
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
                </div>
                <div className="tab-app-information" id="tble-data-e">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row" style={{ padding: "30px" }}>
                            <div className="col-md-12">
                              <div className="row">
                                {/* 
                                <div className="web-form-bx">
                                  <div className="frm-label">SOURCE LANGUAGE</div>
                                  <div className="bts-drop">
                                    <MultiSelectBox
                                      optionData={this.state.languageArr}
                                      value={this.state.sourceLangData}
                                      onSelectChange={(value) =>
                                        this.onSourceLangChange(value)
                                      }
                                    ></MultiSelectBox>
                                  </div>
                                </div> */}

                                <div className="web-form-bx">
                                  <div
                                    class="lable-text"
                                    style={{ fontSize: "20px" }}
                                  >
                                    {" "}
                                    COURSE
                                  </div>
                                  <div className="bts-drop">
                                    <SelectBox
                                      optionData={this.state.courseArr}
                                      value={this.state.selectedCourse}
                                      onSelectChange={(value) =>
                                        this.onCourseChange(value)
                                      }
                                    ></SelectBox>
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
                <div className="tab-app-information" id="tble-data-f">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row">
                                <div className="web-form-bx">
                                  <div
                                    c
                                    className="lable-text"
                                    style={{ fontSize: "20px" }}
                                  >
                                    {" "}
                                    REQUESTER
                                  </div>
                                  <div className="bts-drop">
                                    <SelectBox
                                      optionData={this.state.requesterArr}
                                      value={this.state.selectedRequester}
                                      onSelectChange={(value) =>
                                        this.requesterChange(value)
                                      }
                                    ></SelectBox>
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
                <div className="tab-app-information" id="tble-data-g">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row">
                                <div className="web-form-bx">
                                  <div
                                    c
                                    className="lable-text"
                                    style={{ fontSize: "20px" }}
                                  >
                                    {" "}
                                    FORMAT
                                  </div>
                                  <div className="bts-drop">
                                    <SelectBox
                                      optionData={this.state.formatTypeArr}
                                      value={this.state.selectedFormat}
                                      onSelectChange={(value) =>
                                        this.onFormatChange(value)
                                      }
                                    ></SelectBox>
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

                <div className="tab-app-information" id="tble-data-h">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="form-search-app">
                            <div
                              className="lable-text"
                              style={{ fontSize: "20px" }}
                            >
                              SCHEDULE DATE
                            </div>
                            <div className="row">
                              <div
                                className="input-group"
                                style={{
                                  width: "100%",
                                  borderRadius: "9px",
                                  height: "43px",
                                  border: "1px solid #ced4da",
                                  boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                }}
                              >
                                <div style={{ width: "80%", padding: "8px" }}>
                                  <span>{this.state.formDate}</span>
                                </div>
                                <div style={{ width: "20%" }}>
                                  <a style={{ float: "right" }}>
                                    <DatePicker
                                      dropdownMode="select"
                                      showMonthDropdown
                                      showYearDropdown
                                      adjustDateOnChange
                                      // minDate={new Date()}
                                      onChange={(date) =>
                                        this.formDateChange(date)
                                      }
                                      customInput={<Schedule />}
                                    />
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
                <div className="tab-app-information" id="tble-data-i">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">
                              <div
                                class="lable-text"
                                style={{ fontSize: "20px" }}
                              >
                                Status{" "}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-8">
                              <div
                                class="dropdwn"
                                style={{ cursor: "pointer" }}
                              >
                                {this.state.isAlljobs ? (
                                  <React.Fragment>
                                    <SelectBox
                                      optionData={allStatusArr}
                                      value={this.state.selectedStatus}
                                      placeholder="Select"
                                      onSelectChange={(value) => {
                                        this.onStatusChange(value);
                                      }}
                                    />
                                  </React.Fragment>
                                ) : (
                                  <React.Fragment>
                                    <SelectBox
                                      optionData={allStatusHistoryArr}
                                      value={this.state.selectedHistoryStatus}
                                      placeholder="Select"
                                      onSelectChange={(value) => {
                                        this.onStatusHistoryChange(value);
                                      }}
                                    />
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
            </div>
          </div>
        </div>

        <div id="pause-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-md modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="cancel-job-head">
                <div className="row">
                  <div className="col-md-12">
                    <h2>
                      {/* Cancel Job{" "} */}
                      <span style={{ fontSize: "17px", marginLeft: "7px" }}>
                        {/* (Interpretation) */}
                        Pause Reason
                      </span>
                    </h2>
                    <button className="close-page">
                      <img
                        style={{ cursor: "pointer" }}
                        src={ImageName.IMAGE_NAME.CLOSE_BTN_3}
                        onClick={() => this.closePauseModal()}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-body">
                <div className="body-txt">Reason For Pause</div>

                <div className="_button-style m30 _fl text-center">
                  <div className="form-input-fields">
                    <input
                      type="text"
                      value={this.state.reason}
                      placeholder=""
                      className="textbox4"
                      style={{
                        borderRadius: "9px",
                        boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 20%)",
                      }}
                      onChange={this.onReasonChange}
                    />
                  </div>

                  <a
                    className="white-btn"
                    style={{
                      textDecoration: "none",
                      color: "grey",
                      marginTop: "20px",
                    }}
                    onClick={this.onPauseClose}
                  >
                    Back
                  </a>
                  <a
                    className="blue-btn"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      width: "20%",
                    }}
                    data-dismiss="modal"
                    onClick={() => this.onPauseSubmit()}
                  >
                    Submit
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* .................................................... */}

        {/* ..................Decline modal................................. */}
        <div
          id="decline-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-md modal-dialog-centered decline-modal-width">
            <div className="modal-content" style={{ width: "100%" }}>
              <div className="cancel-job-head">
                <div className="row">
                  <div className="col-md-12">
                    <h2>
                      Cancel Job{" "}
                      <span
                        style={{ fontSize: "17px", marginLeft: "7px" }}
                      ></span>
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
                      <div className="col-md-6">
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
                          <div className="web-form-bx selct">
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
                              ></textarea>
                            </div>
                          </div>

                          <div className="web-form-bx selct">
                            <div className="frm-label lblSize">
                              Is the job rescheduled?
                            </div>
                            <div className="check-field">
                              <label className="checkbox_btn">
                                <input
                                  type="radio"
                                  name="radio1"
                                  onClick={(e) => this.rescheduledCheckYes(e)}
                                />
                                <span className="checkmark3"></span> Yes
                              </label>
                            </div>
                            <div className="check-field">
                              <label className="checkbox_btn">
                                <input
                                  type="radio"
                                  name="radio1"
                                  onClick={(e) => this.rescheduledCheckNo(e)}
                                />
                                <span className="checkmark3"></span> No
                              </label>
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
                              href="#"
                              className="white-btn"
                              onClick={this.declineClose}
                              style={{ textDecoration: "none" }}
                            >
                              cancel
                            </a>
                            <a
                              href="#"
                              className="blue-btn"
                              style={{ textDecoration: "none" }}
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
        {/* </div> */}

        <div
          className="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}

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
