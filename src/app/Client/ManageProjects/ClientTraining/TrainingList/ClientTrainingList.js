import { Menu, MenuItem } from "@mui/material";
import React from "react";
import { AlertMessage, ImageName } from "../../../../../enums";
import { Decoder } from "../../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../../services/constant";
import {
  ApiCall,
  ApiCallClient,

} from "../../../../../services/middleware";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../../../../Admin/SharedComponents/inputText";
import $ from "jquery";
import "./ClientTrainingList.css";
import { consoleLog, SetDatabaseDateFormat, SetUSAdateFormat } from "../../../../../services/common-function";
import { toast, ToastContainer } from "react-toastify";
import { inputEmptyValidate, zipValidate } from "../../../../../validators";
import { Link } from "react-router-dom";

import DatePicker from "react-datepicker";
import moment from "moment";


const allStatusArr = [
  {
    label: "Pending",
    value: "0",
  },
  {
    label: "Quote Received",
    value: "1",
  },
  {
    label: "Quote Accepted",
    value: "2",
  },
  {
    label: "Offer Sent",
    value: "3",
  },
  {
    label: "Offer Accepted",
    value: "4",
  },
  {
    label: "Offer Rejected",
    value: "5",
  },
  {
    label: "Bids Received",
    value: "6",
  },
  {
    label: "Quote Rejected",
    value: "7",
  },
  {
    label: "Assigned",
    value: "8",
  },
  {
    label: "In Progress",
    value: "9",
  },
  {
    label: "Completed",
    value: "10",
  },
  {
    label: "Cancelled",
    value: "11",
  },

];
const allStatusHistoryArr = [
  {
    label: "Completed",
    value: "10",
  },
  {
    label: "Cancelled",
    value: "11",
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
  limit: "",
  offset: "",
  tabType: "",
  status: "",
  search: "",
  serviceTypeId: "",
  searchFrom: "",
  searchTo: "",
  trainingCatId: "",
  trainingFormatId: "",
  courseId: "",
  requester: "",
  clientId: ""
};

export default class ClientTrainingList extends React.Component {
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
      selectedHistoryStatus: {},
      selectedStatus: {},
      reason: "",
      requestId: "",
      projectId: "",
      projectId_history: "",
      selectedServiceType: {},
      serviceTypeArr: [],
      selectedServiceTypeHistory: {},
      // ...for invoice modal......
      requesterArr: [],
      selectedRequester: {},
      trainingCategoryArr: [],
      selectedTrainingCategory: {},
      courseArr: [],
      selectedCourse: {},
      formatTypeArr: [],
      selectedFormat: {},
      vendorArr: [],
      selectedVendor: {},
      allClientArr: [],
      appointmentDate: "",
      hour: "08",
      min: "00",
      ampm: "AM",
      rescheduleNote: "",
      isOtherReason: false
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
    var historyModal = document.getElementById("history-model");
    window.onclick = function (event) {
      if (event.target == filterModal) {
        classInstance.closeModal();
      } else if (event.target == modal) {
        classInstance.closeDeclineModal();
      } else if (event.target == historyModal) {
        classInstance.closeHistoryModal();
      }
    };

    window.$(".verificaiton-doc-tab ul li").on("click", function () {
      $(".verificaiton-doc-tab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
    });
    // this.load();
    window.$(".filterTab ul li").on("click", function () {
      $(".filterTab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk1");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk1");
    });
    window.$(".filterTab-history ul li").on("click", function () {
      $(".filterTab-history ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk2");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk2");
    });
  }

  load = async () => {
    let formatMainArr = [],
      allCategoryType = [],
      requesterArrData = [],
      courseArrData = [],
      statusDataArr = [];

    // ....................For List Data..........................................

    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      tabType: "0",
      status: "",
      search: "",
      serviceTypeId: "",
      searchFrom: "",
      searchTo: "",
      trainingCatId: "",
      trainingFormatId: "",
      courseId: "",
      requester: "",
      clientId: ""
    };
    // let returnData = Object.assign(reqData, fetchData);
    this.listApi(fetchData);
    //....................for history data..................................



    let res = await ApiCall("getCourseWithCategory");
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);

      // allTrainingData = payload.data;
      if (payload.data.length > 0) {
        payload.data.map((data) => {
          allCategoryType.push({
            label: data.name,
            value: data.id,
          });
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

    // ................course,,,,,,,,,,,,,,,,,
    let resCourse = await ApiCall("getAllCourseList");
    if (
      resCourse.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resCourse.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(resCourse.data.payload);

      let courseArr = payload.data.trainingCategories;
      if (courseArr.length > 0) {
        courseArr.map((obj) => {
          courseArrData.push({
            label: obj.name,
            value: obj.id
          })
        })
      }
    }

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
          value: obj.id
        })
      })


    }



    // let statusRes = await ApiCall("getInterpretionJobStatuslist");
    // if (
    //   statusRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   statusRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {
    //   let payload = await Decoder.decode(statusRes.data.payload);
    //   // console.log("status::::::::::", payload);
    //   statusDataArr = payload.data.statusList;
    //   for (let k = 0; k < statusDataArr.length; k++) {

    //   }
    // }
    // ............................................................
    let clientDataArr = [];

    let clientinfoRes = await ApiCall("getallclinetinfo");
    if (
      clientinfoRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      clientinfoRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let clientPayload = await Decoder.decode(clientinfoRes.data.payload);
      let clientResData = clientPayload.data.clientlist;

      for (let i = 0; i < clientResData.length; i++) {
        clientDataArr.push({
          label: clientResData[i].clientName,
          value: clientResData[i].clientid,
        });
      }
    }

    this.setState({
      serviceTypeArr: allCategoryType,
      clientArr: clientDataArr,
      trainingCategoryArr: allCategoryType,
      formatTypeArr: formatMainArr,
      courseArr: courseArrData,
      requesterArr: requesterArrData,

      isLoad: false,
    });
  };

  //...........For translation Project Listing...............
  listApi = async (data) => {
    consoleLog("req data::", data)
    const res = await ApiCallClient("getTrainingListClient", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      let listData = decodeData.data.trainingList;
      consoleLog("listData:training", decodeData.data);
      if (decodeData.data.trainingList.length > 0) {
        let totalPage = Math.ceil(
          decodeData.data.totalCount / this.state.limit
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

  history_listApi = async (data) => {
    consoleLog("req data history", data)
    // ..................for history...................
    const resHistory = await ApiCallClient("getTrainingListClient", data);
    if (
      resHistory.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resHistory.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(resHistory.data.payload);
      consoleLog("#######history", decodeData.data);
      if (decodeData.data.trainingList.length > 0) {
        let totalPage = Math.ceil(
          decodeData.data.totalCount / this.state.history_limit
        );
        this.setState({
          historyList: decodeData.data.trainingList,
          history_total_page: totalPage,
        });
      }
    }
  };

  // .............filter modal function...................


  onReasonChange = (e) => {
    this.setState({
      reason: e.target.value,
    });
  };
  //........Page show Limit.........

  onChangeLimit = (dat) => {
    this.setState({
      limit: parseInt(dat.value),
      selectedDisplayData: dat,
      current_page: 1
    });

    let data = {
      limit: dat.value,
      // offset: JSON.stringify(
      //   (this.state.current_page - 1) * parseInt(dat.value)
      // ),
      offset: "0",
      tabType: "0",
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      search: this.state.projectId === null ? "" : this.state.projectId,
      serviceTypeId: "",
      searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      trainingCatId: this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId: this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      courseId: this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value,
      requester: this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      clientId: ""

    };
    // let returnData = Object.assign(reqData, data);

    this.listApi(data);
  };
  // ............history.........................

  history_onChangeLimit = (dat) => {
    this.setState({
      history_limit: parseInt(dat.value),
      history_selectedDisplayData: dat,
      history_current_page: 1
    });

    let data = {
      limit: dat.value,
      // offset: JSON.stringify(
      //   (this.state.history_current_page - 1) * parseInt(dat.value)
      // ),
      offset: "0",
      tabType: "1",
      status: this.state.selectedHistoryStatus.value == null || this.state.selectedHistoryStatus.value == undefined ? "" : this.state.selectedHistoryStatus.value,
      search: this.state.projectId === null ? "" : this.state.projectId,
      serviceTypeId: "",
      searchFrom: this.state.formDateHistory == "" ? "" : SetDatabaseDateFormat(this.state.formDateHistory),
      searchTo: this.state.toDateHistory == "" ? "" : SetDatabaseDateFormat(this.state.toDateHistory),
      trainingCatId: this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId: this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      courseId: this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value,
      requester: this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      clientId: ""

    };
    // let returnData = Object.assign(reqData, data);

    this.history_listApi(data);
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
  formDateChange_history = (date) => {
    this.setState({
      formDateHistory: SetUSAdateFormat(date),
    });
  };

  toDateChange_history = (date) => {
    this.setState({
      toDateHistory: SetUSAdateFormat(date),
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
      tabType: "0",
      search: this.state.projectId === null ? "" : this.state.projectId,
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      serviceTypeId: "",
      searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      trainingCatId: this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId: this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      courseId: this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value,
      requester: this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      clientId: ""
    };
    let returnData = Object.assign(reqData, fetchData);
    // this.listApi(returnData);
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
      tabType: "0",
      search: this.state.projectId === null ? "" : this.state.projectId,
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      serviceTypeId: "",
      searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      trainingCatId: this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId: this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      courseId: this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value,
      requester: this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      clientId: ""
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
      tabType: "0",
      search: this.state.projectId === null ? "" : this.state.projectId,
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      serviceTypeId: "",
      searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      trainingCatId: this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId: this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      courseId: this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value,
      requester: this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      clientId: ""
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
      tabType: "0",
      search: this.state.projectId === null ? "" : this.state.projectId,
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      serviceTypeId: "",
      searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      trainingCatId: this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId: this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      courseId: this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value,
      requester: this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      clientId: ""
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
      tabType: "1",
      status: this.state.selectedHistoryStatus.value == null || this.state.selectedHistoryStatus.value == undefined ? "" : this.state.selectedHistoryStatus.value,
      search: this.state.projectId === null ? "" : this.state.projectId,
      serviceTypeId: "",
      searchFrom: this.state.formDateHistory == "" ? "" : SetDatabaseDateFormat(this.state.formDateHistory),
      searchTo: this.state.toDateHistory == "" ? "" : SetDatabaseDateFormat(this.state.toDateHistory),
      trainingCatId: this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId: this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      courseId: this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value,
      requester: this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      clientId: ""
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
      tabType: "1",
      status: this.state.selectedHistoryStatus.value == null || this.state.selectedHistoryStatus.value == undefined ? "" : this.state.selectedHistoryStatus.value,
      search: this.state.projectId === null ? "" : this.state.projectId,
      serviceTypeId: "",
      searchFrom: this.state.formDateHistory == "" ? "" : SetDatabaseDateFormat(this.state.formDateHistory),
      searchTo: this.state.toDateHistory == "" ? "" : SetDatabaseDateFormat(this.state.toDateHistory),
      trainingCatId: this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId: this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      courseId: this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value,
      requester: this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      clientId: ""
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
    }
    let fetchData = {
      limit: JSON.stringify(this.state.history_limit),
      offset: JSON.stringify((currentPage - 1) * this.state.history_limit),
      tabType: "1",
      status: this.state.selectedHistoryStatus.value == null || this.state.selectedHistoryStatus.value == undefined ? "" : this.state.selectedHistoryStatus.value,
      search: this.state.projectId === null ? "" : this.state.projectId,
      serviceTypeId: "",
      searchFrom: this.state.formDateHistory == "" ? "" : SetDatabaseDateFormat(this.state.formDateHistory),
      searchTo: this.state.toDateHistory == "" ? "" : SetDatabaseDateFormat(this.state.toDateHistory),
      trainingCatId: this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId: this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      courseId: this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value,
      requester: this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      clientId: ""
    };
    // let returnData = Object.assign(reqData, fetchData);
    this.history_listApi(fetchData);
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
    }
    let fetchData = {
      limit: JSON.stringify(this.state.history_limit),
      offset: JSON.stringify((currentPage - 1) * this.state.history_limit),
      tabType: "1",
      status: this.state.selectedHistoryStatus.value == null || this.state.selectedHistoryStatus.value == undefined ? "" : this.state.selectedHistoryStatus.value,
      search: this.state.projectId === null ? "" : this.state.projectId,
      serviceTypeId: "",
      searchFrom: this.state.formDateHistory == "" ? "" : SetDatabaseDateFormat(this.state.formDateHistory),
      searchTo: this.state.toDateHistory == "" ? "" : SetDatabaseDateFormat(this.state.toDateHistory),
      trainingCatId: this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId: this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      courseId: this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value,
      requester: this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      clientId: ""
    };
    // let returnData = Object.assign(reqData, fetchData);
    this.history_listApi(fetchData);
  };

  onFilterApply = () => {
    let errorCount = 0;

    if (errorCount === 0) {
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: "0",
        tabType: "0",
        search: this.state.projectId === null ? "" : this.state.projectId,
        status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
        serviceTypeId: "",
        searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        trainingCatId: this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
        trainingFormatId: this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
        courseId: this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value,
        requester: this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
        clientId: ""
      };
      // let returnData = Object.assign(reqData, fetchData);
      // consoleLog("dataaa::", fetchData);
      this.listApi(fetchData);
      this.closeModal();

      this.setState({
        current_page: 1
      });
    }
  };

  onResetFilter = () => {
    if (this.state.isAlljobs) {
      this.resetData();
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: "0",
        tabType: "0",
        search: "",
        status: "",
        serviceTypeId: "",
        searchFrom: "",
        searchTo: "",
        trainingCatId: "",
        trainingFormatId: "",
        courseId: "",
        requester: "",
        clientId: ""

      };
      this.listApi(fetchData)

    }


    this.setState({

      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      current_page: 1,
    });
    this.closeModal();
  };

  //   .............history................

  onFilterApply_history = () => {
    let errorCount = 0;

    // if (this.state.toDateHistory < this.state.formDateHistory) {
    //   toast.error(AlertMessage.MESSAGE.DATE.TO_LESS_FROM);
    //   errorCount++;
    // }

    if (errorCount === 0) {
      let fetchData = {
        limit: JSON.stringify(this.state.history_limit),
        offset: "0",
        tabType: "1",
        status: this.state.selectedHistoryStatus.value == null || this.state.selectedHistoryStatus.value == undefined ? "" : this.state.selectedHistoryStatus.value,
        search: this.state.projectId === null ? "" : this.state.projectId,
        serviceTypeId: "",
        searchFrom: this.state.formDateHistory == "" ? "" : SetDatabaseDateFormat(this.state.formDateHistory),
        searchTo: this.state.toDateHistory == "" ? "" : SetDatabaseDateFormat(this.state.toDateHistory),
        trainingCatId: this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
        trainingFormatId: this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
        courseId: this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value,
        requester: this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
        clientId: ""
      };
      // let returnData = Object.assign(reqData, fetchData);
      this.history_listApi(fetchData);
      this.closeHistoryModal();

      this.setState({
        history_current_page: 1,
      });
    }
  };

  onResetFilter_history = () => {
    this.resetData();
    this.setState({
      formDateHistory: "",
      toDateHistory: "",
      selectedHistoryStatus: "",
      selectedServiceTypeHistory: {},
      history_selectedDisplayData: {
        label: "20",
        value: "20",
      },
      history_current_page: 1,
    });
    this.closeHistoryModal();
    let fetchData = {
      limit: JSON.stringify(this.state.history_limit),
      offset: "0",
      tabType: "1",
      search: "",
      status: "",
      serviceTypeId: "",
      searchFrom: "",
      searchTo: "",
      trainingCatId: "",
      trainingFormatId: "",
      courseId: "",
      requester: "",
      clientId: "",
      appointmentDate: "",
      hour: "08",
      min: "00",
      ampm: "AM",
      rescheduleNote: "",
      isOtherReason: false
    };
    // let returnData = Object.assign(reqData, fetchData);
    this.history_listApi(fetchData);
  };

  onCancelDataChange = (data) => {
    if (data.value == "1") {
      this.setState({
        isSelected: "true",
        isOtherReason: false,
      });
    } else if (data.value == "6") {
      this.setState({
        isSelected: "false",
        isOtherReason: true,
      });
    } else {
      this.setState({
        isSelected: "false",
        isOtherReason: false,
      });
    }
    this.setState({
      cancellationData: data,
    });
  };
  rescheduledCheck = (e) => {
    console.log(typeof e.target.value);
    this.setState({
      isSelected: e.target.value,
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
    let validateDate = inputEmptyValidate(this.state.appointmentDate);
    let validateOtherReason = inputEmptyValidate(this.state.otherReason);

    // if (validateInterpretationFee === false) {
    if (validateCancelReason === false) {
      toast.error(AlertMessage.MESSAGE.JOB.EMPTY_MAIN_REASON, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (
      validateOtherReason == false &&
      this.state.cancellationData.value == 6
    ) {
      toast.error(AlertMessage.MESSAGE.JOB.EMPTY_MAIN_REASON, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (
      validateDate == false &&
      this.state.cancellationData.value == 1 &&
      this.state.isSelected == "true"
    ) {
      toast.error(AlertMessage.MESSAGE.JOB.EMPTY_DATE, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (
      Number(this.state.hour) > 12 &&
      this.state.cancellationData.value == 1 &&
      this.state.isSelected == "true"
    ) {
      toast.error("Hour cannot be set greater than 12 in appointment time");
      errorCount++;
    } else if (
      Number(this.state.min) > 59 &&
      this.state.cancellationData.value == 1 &&
      this.state.isSelected == "true"
    ) {
      toast.error("Minute cannot be set greater than 59 in appointment time");
      errorCount++;
    }
    if (errorCount === 0) {
      let modHour =
        (this.state.hour === "" ? Number("00") : this.state.hour) +
        ":" +
        (this.state.min === "" ? Number("00") : this.state.min) +
        " " +
        this.state.ampm;

      // consoleLog("modHour::",modHour)
      var dt = moment(modHour, ["h:mm A"]).format("HH:mm");

      let data = {
        requestId: this.state.listData[this.state.curIndex].requestId,
        selectReason:
          this.state.cancellationData.value == "6"
            ? this.state.otherReason
            : this.state.cancellationData.label,
        isScheduled: this.state.isSelected == "true" ? "1" : "0",
        rescheduleDate:
          this.state.appointmentDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.appointmentDate),

        rescheduleTime: dt == "00:00" ? "" : dt + ":00",
        scheduleNote: this.state.rescheduleNote,
      };
      let res = await ApiCall("cancelJobDetails", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        if (this.state.cancellationData.value == "1") {
          toast.success(AlertMessage.MESSAGE.JOB.PROJECT_RESCHEDULED, {
            hideProgressBar: true,
          });
        } else {
          toast.success(AlertMessage.MESSAGE.JOB.CANCEL, {
            hideProgressBar: true,
          });
        }
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

  onTabClick = (value) => {
    if (value === "0") {
      this.resetData();
      this.setState({

        isAlljobs: true,
        isHistory: false,
        // isTraining: false,
      });
      this.load();
    } else if (value === "1") {
      this.resetData();
      this.setState({
        isAlljobs: false,
        isHistory: true,
        formDateHistory: "",
        toDateHistory: "",
        selectedHistoryStatus: "",
        selectedServiceTypeHistory: {},
        history_selectedDisplayData: {
          label: "20",
          value: "20",
        },

      });
      let fetchHistoryData = {
        limit: JSON.stringify(this.state.history_limit),
        offset: "0",
        tabType: "1",
        status: "",
        search: "",
        serviceTypeId: "",
        searchFrom: "",
        searchTo: "",
        trainingCatId: "",
        trainingFormatId: "",
        courseId: "",
        requester: "",
        clientId: ""
      };
      // let returnHistoryData = Object.assign(reqData, fetchHistoryData);
      this.history_listApi(fetchHistoryData);
    }
  };
  onProjectIdChange = (value) => {

    let val = zipValidate(value);
    this.setState({
      projectId: val,
    });

    if (this.state.isAlljobs) {
      let data = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify(
          (this.state.current_page - 1) * this.state.limit
        ),
        tabType: "0",
        search: val === null ? "" : val,
        status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
        serviceTypeId: "",
        searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        trainingCatId: this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
        trainingFormatId: this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
        courseId: this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value,
        requester: this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
        clientId: ""
      };
      // let returnData = Object.assign(reqData,data);
      this.listApi(data);
    } else {
      let data = {
        limit: JSON.stringify(this.state.history_limit),
        offset: JSON.stringify(
          (this.state.history_current_page - 1) * this.state.history_limit
        ),
        tabType: "1",
        status: this.state.selectedHistoryStatus.value == null || this.state.selectedHistoryStatus.value == undefined ? "" : this.state.selectedHistoryStatus.value,
        search: val === null ? "" : val,
        serviceTypeId: "",
        searchFrom: this.state.formDateHistory == "" ? "" : SetDatabaseDateFormat(this.state.formDateHistory),
        searchTo: this.state.toDateHistory == "" ? "" : SetDatabaseDateFormat(this.state.toDateHistory),
        trainingCatId: this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
        trainingFormatId: this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
        courseId: this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value,
        requester: this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
        clientId: ""
      };
      // let returnData = Object.assign(reqData,data);
      this.history_listApi(data);
    }

  };


  onStatusChange = (data) => {

    this.setState({
      selectedStatus: data,
    });
  };
  onServiceTypeChange = (data) => {
    this.setState({
      selectedServiceType: data,
    });
  };
  onServiceTypeHistoryChange = (data) => {
    this.setState({
      selectedServiceTypeHistory: data,
    });
  };
  onStatusHistoryChange = (data) => {

    this.setState({
      selectedHistoryStatus: data,
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
  appointmentdateChange = (date) => {
    this.setState({
      appointmentDate: SetUSAdateFormat(date),
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

  hourChangeUp = () => {
    let hr = parseInt(this.state.hour) - 1;
    if (hr < 1) {
      this.setState({
        hour: "12",
      });
    } else {
      if (hr > 9) {
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

  minChangeUp = () => {
    let min = parseInt(this.state.min) - 1;
    if (min < 0) {
      this.setState({
        min: "59",
      });
    } else {
      if (min > 9) {
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
      pathname: "/clientTrainingDetails",
      state: this.state.listData[this.state.curIndex],
    });
  };
  goHistoryEdit = () => {
    this.props.history.push({
      pathname: "/clientTrainingDetails",
      state: this.state.historyList[this.state.curIndex],
    });
  };

  // fullDateFormat = (date) => {
  //   try {
  //     let resDate = "";
  //     if (date) {
  //       const currentDate = new Date(date);
  //       let hours = currentDate.getHours(),
  //         minutes = currentDate.getMinutes(),
  //         secound = currentDate.getSeconds();
  //       hours = hours < 10 ? "0" + hours : hours;
  //       minutes = minutes < 10 ? "0" + minutes : minutes;
  //       secound = secound < 10 ? "0" + secound : secound;
  //       resDate =
  //         currentDate.getFullYear() +
  //         "-" +
  //         ("0" + (currentDate.getMonth() + 1)).slice(-2) +
  //         "-" +
  //         ("0" + currentDate.getDate()).slice(-2) +
  //         " " +
  //         hours +
  //         ":" +
  //         minutes +
  //         ":" +
  //         secound;
  //     }
  //     return resDate;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };



  onFilterStatusChange = (val) => {
    this.setState({
      selectedStatus: val
    })
  }
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
  }

  requesterChange = (val) => {
    this.setState({
      selectedRequester: val,
    });
  };

  resetData = () => {
    this.setState({
      formDate: "",
      toDate: "",
      formDateHistory: "",
      toDateHistory: "",
      selectedHistoryStatus: {},
      clientData: {},
      id: "",
      input: "",
      selectedFormat: {},
      selectedTrainingCategory: {},
      selectedCourse: {},
      selectedRequester: {},
      selectedStatus: {},
      projectId: ""
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
        <div className="component-wrapper vewaljobs clientJob">
          {/* <ReactLoader /> */}
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            <Link to="/clientDashboard">Dashboard</Link> / Training
          </div>
          <div className="vendor-info p-10 _fl sdw">
            <div className="vn-form _fl">
              <div className="row">
                <div className="col-md-4">
                  <div className="vn_frm">
                    {" "}
                    <span>Project #</span>
                    <InputText
                      type="text"
                      placeholder="Search"
                      className="inputfield"
                      value={this.state.projectId}
                      onTextChange={(value) => {
                        this.onProjectIdChange(value);
                      }}
                    />
                    {/* <input type="text" value="" name="" placeholder="Search" className="inputfield" /> */}
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
                          this.onTabClick("0");
                        }}
                      >
                        All Projects
                      </li>
                      <li
                        data-related="tble-data-b"
                        onClick={() => {
                          this.onTabClick("1");
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
                  {this.state.isAlljobs ? (
                    <React.Fragment>
                      <div
                        class="filter-btn"
                        style={{ float: "none", paddingLeft: "10px" }}
                      >
                        <a href="#" onClick={this.filterModal}>
                          Filter
                        </a>
                      </div>

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
                  ) : this.state.isHistory ? (
                    <React.Fragment>
                      <div
                        class="filter-btn"
                        style={{ float: "none", paddingLeft: "10px" }}
                      >
                        <a href="#" onClick={this.historyModal}>
                          Filter
                        </a>
                      </div>

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
                  ) : (
                    <React.Fragment></React.Fragment>
                  )}

                  {/* <div className="tble-short">
                    {" "}
                    <span className="lbl">Job Status</span>
                    <div className="dropdwn" style={{ width: "85px" }}>
                      <select
                        className="myDropdown_status frm4-select"
                        onChange={this.onChangeStatus}
                      ></select>
                    </div>
                  </div> */}
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
                                        {item.approvalStatus === 0 ? (
                                          <React.Fragment>
                                            <span className="progress-btn yellow">
                                              Pending
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 1 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn sky"
                                            >
                                              Quote Received
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 2 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn green"
                                            >
                                              Quote Accepted
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 3 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn sky"
                                            >
                                              offer Sent
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 4 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn blue"
                                            >
                                              Offer Accepted
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 5 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn red"
                                            >
                                              Offer Rejected
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 6 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn blue"
                                            >
                                              Bids Received
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 7 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn red"
                                            >
                                              Quote Rejected
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 8 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn green"
                                            >
                                              Assigned
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 9 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn yellow"
                                            >
                                              In Progress
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 10 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn green"
                                            >
                                              completed
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 11 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn green"
                                            >
                                              cancelled
                                            </span>
                                          </React.Fragment>
                                        ) : (
                                          <React.Fragment></React.Fragment>
                                        )}
                                      </td>
                                      <td style={{ width: "10%" }}>
                                        <img
                                          src={
                                            ImageName.IMAGE_NAME.MENU_VERTICAL
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
                                            "aria-labelledby": "basic-button",
                                          }}
                                        >
                                          <MenuItem onClick={this.goEdit}>
                                            View Details
                                          </MenuItem>
                                          <MenuItem onClick={this.declineModal}>
                                            Cancel
                                          </MenuItem>
                                        </Menu>

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
                                        {item.approvalStatus === 0 ? (
                                          <React.Fragment>
                                            <span className="progress-btn yellow">
                                              Pending
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 1 ? (
                                          <React.Fragment>
                                            <span
                                              className="progress-btn sky"
                                            >
                                              Quote Received
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 2 ? (
                                          <React.Fragment>
                                            <span
                                              className="progress-btn green"
                                            >
                                              Quote Accepted
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 3 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn sky"
                                            >
                                              offer Sent
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 4 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn blue"
                                            >
                                              Offer Accepted
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 5 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn red"
                                            >
                                              Offer Rejected
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 6 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn blue"
                                            >
                                              Bids Received
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 7 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn red"
                                            >
                                              Quote Rejected
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 8 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn green"
                                            >
                                              Assigned
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 9 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn yellow"
                                            >
                                              In Progress
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 10 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn green"
                                            >
                                              completed
                                            </span>
                                          </React.Fragment>
                                        ) : item.approvalStatus === 11 ? (
                                          <React.Fragment>
                                            <span
                                              href="#"
                                              className="progress-btn green"
                                            >
                                              cancelled
                                            </span>
                                          </React.Fragment>
                                        ) : (
                                          <React.Fragment></React.Fragment>
                                        )}
                                      </td>
                                      <td style={{ width: "10%" }}>
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
                  ) : this.state.isHistory ? (
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
                  ) : (
                    <React.Fragment></React.Fragment>
                  )}

                  {/* <div className="tble-short">
                    {" "}
                    <span className="lbl">Job Status</span>
                    <div className="dropdwn" style={{ width: "85px" }}>
                      <select
                        className="myDropdown_status frm4-select"
                        onChange={this.onChangeStatus}
                      ></select>
                    </div>
                  </div> */}
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
        {/* <div
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
              <div className="modal-body">
                <div className="job_filt_lfe">
                  <div class="_fl filterTab">
                    <ul style={{ cursor: "pointer" }}>
                      <li className="active" data-related="tble-data-d" style={{ padding: "20px 20px" }}>
                        Training Category
                      </li>
                      <li data-related="tble-data-e" style={{ padding: "20px 20px" }}>Training Course</li>
                      <li data-related="tble-data-f" style={{ padding: "20px 20px" }}>Requester</li>
                      <li data-related="tble-data-g" style={{ padding: "20px 20px" }}>Format</li>
                      <li data-related="tble-data-h" style={{ padding: "20px 20px" }}>Date</li>
                      <li data-related="tble-data-i" style={{ padding: "20px 20px" }}>Status</li>
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
                                <div className="web-form-bx">
                                  <div class="lable-text"
                                    style={{ fontSize: "20px" }}> COURSE</div>
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
                              Date
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
                                STATUS
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-8">
                              <div
                                class="dropdwn"
                                style={{ cursor: "pointer" }}
                              >
                                <SelectBox
                                  optionData={allStatusArr}
                                  value={this.state.selectedStatus}
                                  placeholder="Select"
                                  onSelectChange={(value) => {
                                    this.onFilterStatusChange(value);
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
            </div>
          </div>
        </div> */}
        <div id="filter-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="filter-head _fl mdf">
                <h3>Filter by</h3>
                <div class="reset-btn-dp">
                  <button class="reset">
                    <img
                      src={ImageName.IMAGE_NAME.RESET_BTN}
                      onClick={this.onResetFilter}
                    />
                    Reset
                  </button>
                  <button class="apply" data-dismiss="modal">
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
                  <div className="">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">TRAINING CATEGORY</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>
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
                      <div className="col-md-1"></div>
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">TRAINING COURSE</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>
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
                    <div className="row" style={{ marginTop: "20px" }}>
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">REQUESTER</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>
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
                      <div className="col-md-1" />
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">FORMAT</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>
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

                    <div className="row" style={{ marginTop: "20px" }}>
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">SCHEDULE DATE</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>

                            <div className="input-group jobDatepickerV2">
                              <div className="jobDatepickerInputTxtV2">
                                <span className="jobDatepickerInputTxt_span">
                                  <p className="jobDatepickerInputTxt_pTag">
                                    Date
                                  </p>{" "}
                                  <p className="jobDatepickerInputTxt_pTag">
                                    {this.state.formDate}
                                  </p>
                                </span>
                              </div>
                              <div style={{ width: "20%" }}>
                                <a style={{ float: "right" }}>
                                  <DatePicker
                                    dropdownMode="select"
                                    showMonthDropdown
                                    showYearDropdown
                                    adjustDateOnChange
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
                      <div className="col-md-1" />
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">STATUS</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>
                            <SelectBox
                              optionData={allStatusArr}
                              value={this.state.selectedStatus}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onFilterStatusChange(value);
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
        </div>
        {/* ..........history filter........... */}

        {/* <div
          id="history-model"
          className="modal fade modelwindow filter-pop"
          role="dialog"
        >
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="filter-head _fl mdf">
                <h3>Filter by</h3>
                <div class="reset-btn-dp">
                  <button class="reset" data-dismiss="modal">
                    <img
                      src={ImageName.IMAGE_NAME.RESET_BTN}
                      onClick={this.onResetFilter_history}
                    />
                    Reset
                  </button>
                  <button class="apply" data-dismiss="modal">
                    <img
                      src={ImageName.IMAGE_NAME.BLUE_TICK}
                      onClick={this.onFilterApply_history}
                    />
                    Apply
                  </button>
                </div>
              </div>

              <div className="modal-body">
                <div className="job_filt_lfe">
                  <div class="_fl filterTab-history">
                    <ul style={{ cursor: "pointer" }}>
                      <li className="active" data-related="tble-data-m" style={{ padding: "20px 20px" }}>
                        Training Category
                      </li>
                      <li data-related="tble-data-n" style={{ padding: "20px 20px" }}>Training Course</li>
                      <li data-related="tble-data-o" style={{ padding: "20px 20px" }}>Requester</li>
                      <li data-related="tble-data-p" style={{ padding: "20px 20px" }}>Format</li>
                      <li data-related="tble-data-q" style={{ padding: "20px 20px" }}>Date</li>
                      <li data-related="tble-data-r" style={{ padding: "20px 20px" }}>Status</li>
                    </ul>
                  </div>
                </div>
                <div
                  className="tab-app-information activeLnk2 "
                  id="tble-data-m"
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
                <div className="tab-app-information" id="tble-data-n">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row" style={{ padding: "30px" }}>
                            <div className="col-md-12">
                              <div className="row">
                                <div className="web-form-bx">
                                  <div class="lable-text"
                                    style={{ fontSize: "20px" }}> COURSE</div>
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
                <div className="tab-app-information" id="tble-data-o">
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
                <div className="tab-app-information" id="tble-data-p">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row">
                                <div className="web-form-bx">
                                  <div
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
                <div className="tab-app-information" id="tble-data-q">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="form-search-app">
                            <div
                              className="lable-text"
                              style={{ fontSize: "20px" }}
                            >
                              Date
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
                                  <span>{this.state.formDateHistory}</span>
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
                                        this.formDateChange_history(date)
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
                <div className="tab-app-information" id="tble-data-r">
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
                                STATUS
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-8">
                              <div
                                class="dropdwn"
                                style={{ cursor: "pointer" }}
                              >
                                <SelectBox
                                  optionData={allStatusHistoryArr}
                                  value={this.state.selectedHistoryStatus}
                                  placeholder="Select"
                                  onSelectChange={(value) => {
                                    this.onStatusHistoryChange(value);
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
            </div>
          </div>
        </div> */}

<div id="history-modell" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="filter-head _fl mdf">
                <h3>Filter by</h3>
                <div class="reset-btn-dp">
                  <button class="reset">
                    <img
                      src={ImageName.IMAGE_NAME.RESET_BTN}
                      onClick={this.onResetFilter_history}
                    />
                    Reset
                  </button>
                  <button class="apply" data-dismiss="modal">
                    <img
                      src={ImageName.IMAGE_NAME.BLUE_TICK}
                      onClick={this.onFilterApply_history}
                    />
                    Apply
                  </button>
                </div>
              </div>

              <div className="modal-body">
                <div className="model-info f-model">
                  <div className="">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">TRAINING CATEGORY</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>
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
                      <div className="col-md-1"></div>
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">TRAINING COURSE</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>
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
                    <div className="row" style={{ marginTop: "20px" }}>
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">REQUESTER</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>
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
                      <div className="col-md-1" />
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">FORMAT</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>
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

                    <div className="row" style={{ marginTop: "20px" }}>
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">SCHEDULE DATE</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>

                            <div className="input-group jobDatepickerV2">
                              <div className="jobDatepickerInputTxtV2">
                                <span className="jobDatepickerInputTxt_span">
                                  <p className="jobDatepickerInputTxt_pTag">
                                    Date
                                  </p>{" "}
                                  <p className="jobDatepickerInputTxt_pTag">
                                    {this.state.formDate}
                                  </p>
                                </span>
                              </div>
                              <div style={{ width: "20%" }}>
                                <a style={{ float: "right" }}>
                                  <DatePicker
                                    dropdownMode="select"
                                    showMonthDropdown
                                    showYearDropdown
                                    adjustDateOnChange
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
                      <div className="col-md-1" />
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">STATUS</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>
                            <SelectBox
                              optionData={allStatusArr}
                              value={this.state.selectedStatus}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onFilterStatusChange(value);
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
        </div>

        {/* ..................................... */}

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
          <div className="modal-dialog modal-md modal-dialog-centered ">
            <div className="modal-content" style={{ width: "100%" }}>
              <div className="cancel-job-head">
                <div className="row">
                  <div className="col-md-12">
                    <h2>
                      Cancel Project{" "}
                      <span style={{ fontSize: "17px", marginLeft: "7px" }}>
                        (Training)
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
                          {this.state.cancellationData.value == 1 ? (
                            <React.Fragment>
                              <div className="web-form-bx selct">
                                <div className="frm-label lblSize">
                                  Is the job rescheduled?
                                </div>
                                <div className="check-field">
                                  <label className="checkbox_btn">
                                    <input
                                      type="radio"
                                      value="true"
                                      checked={this.state.isSelected === "true"}
                                      onChange={this.rescheduledCheck}
                                    />
                                    <span className="checkmark3"></span> Yes
                                  </label>
                                </div>
                                <div className="check-field">
                                  <label className="checkbox_btn">
                                    <input
                                      type="radio"
                                      value="false"
                                      checked={this.state.isSelected == "false"}
                                      onChange={this.rescheduledCheck}
                                    />
                                    <span className="checkmark3"></span> No
                                  </label>
                                </div>
                              </div>
                            </React.Fragment>
                          ) : (
                            <React.Fragment />
                          )}

                          <div
                            className="web-form-bx"
                            hidden={
                              this.state.isSelected == "true" ? false : true
                            }
                          >
                            <div className="frm-label">
                              Appointment Date & Time
                            </div>

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
                                <span>{this.state.appointmentDate}</span>
                              </div>
                              <div style={{ width: "20%" }}>
                                <a style={{ float: "right" }}>
                                  <DatePicker
                                    dropdownMode="select"
                                    showMonthDropdown
                                    showYearDropdown
                                    adjustDateOnChange
                                    minDate={new Date()}
                                    onChange={(date) =>
                                      this.appointmentdateChange(date)
                                    }
                                    customInput={<Schedule />}
                                  />
                                </a>
                              </div>
                            </div>

                            {/* <div className="form-input-fields unstyled">
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
                            </div> */}

                            <div className="t-time">
                              <span className="t1">
                                <small>
                                  <img
                                    src={ImageName.IMAGE_NAME.U_IMG}
                                    alt=""
                                    style={{ cursor: "pointer" }}
                                    onClick={this.hourChange}
                                  />
                                  <br />
                                  <input
                                    type="text"
                                    placeholder=""
                                    value={this.state.hour}
                                    className="tsd2"
                                    onChange={this.hourInputChange}
                                  // readonly
                                  />
                                  <br />
                                  <img
                                    src={ImageName.IMAGE_NAME.B_ARROW}
                                    alt=""
                                    style={{ cursor: "pointer" }}
                                    onClick={this.hourChangeUp}
                                  />
                                </small>
                              </span>
                              <span className="t2">
                                <small>
                                  <img
                                    src={ImageName.IMAGE_NAME.U_IMG}
                                    alt=""
                                    style={{ cursor: "pointer" }}
                                    onClick={this.minChange}
                                  />
                                  <br />
                                  <input
                                    type="text"
                                    placeholder=""
                                    value={this.state.min}
                                    className="tsd2"
                                    onChange={this.minInputChange}
                                  // readonly
                                  />
                                  <br />
                                  <img
                                    src={ImageName.IMAGE_NAME.B_ARROW}
                                    alt=""
                                    style={{ cursor: "pointer" }}
                                    onClick={this.minChangeUp}
                                  />
                                </small>
                              </span>
                              <span className="t3" style={{ marginLeft: "2%" }}>
                                <small>
                                  <img
                                    src={ImageName.IMAGE_NAME.U_IMG}
                                    alt=""
                                    style={{ cursor: "pointer" }}
                                    onClick={this.ampmChange}
                                  />
                                  <br />
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
                            hidden={
                              this.state.isSelected == "true" ? false : true
                            }
                          >
                            <div className="frm-label lblSize">Notes</div>
                            <div
                              className="form-input-fields"
                              style={{ marginBottom: "20px" }}
                            >
                              <textarea
                                value={this.state.rescheduleNote}
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
