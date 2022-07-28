import { Menu, MenuItem } from "@mui/material";
import React, { Component } from "react";
import { AlertMessage, ImageName } from "../../../../enums";
import { Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { ApiCall } from "../../../../services/middleware";
import {
  InputText,
  MultiSelectBox,
  PaginationDropdown,
  SelectBox,
} from "../../SharedComponents/inputText";
import Select, { components } from "react-select";
import $ from "jquery";
import "./viewAllJobs.css";
import {
  consoleLog,
  SetDatabaseDateFormat,
  SetDateFormat,
  SetDOBFormat,
  SetUSAdateFormat,
} from "../../../../services/common-function";
import { toast, ToastContainer } from "react-toastify";
import { inputEmptyValidate } from "../../../../validators";
import ViewCalender from "../../../ReactBigCalender/ViewCalender";
import { Link } from "react-router-dom";

import DatePicker from "react-datepicker";
import moment from "moment";
import { styled } from "@mui/system"; //imported for modal
import LotteLoader from "../../../Loader/LotteLoader";

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

const statusArrData = [
  {
    label: "Pending",
    value: "0",
  },
  {
    label: "Quote Sent",
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
    label: "Offer rejected",
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
    label: "InProgress",
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

const reqData = {
  limit: "",
  offset: "",
  searchto: "",
  searchfrom: "",
  scheduleDate: "",
  scheduleTime: "",
  status: "",
  clientId: "",
  leiId: "",
  orderby: "",
  direc: "",
  rfqId: "",
  tabType: "",
  appointmentTypeId: "",
  sourceLang: [],
  targetLang: [],
};

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 10,
    marginTop: 5,
    minWidth: 100,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 2%) 0px 0px 0px 1px, rgba(0, 0, 0, 0%) 0px 10px 15px -3px, rgba(0, 0, 0, 0%) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
  },
}));

export default class ViewAllJobs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad: true,
      isAlljobs: true,
      isHistory: false,
      current_page: 1,
      total_page: 10,
      limit: 20,
      offset: 0,
      // ..............
      current_page_history: 1,
      total_page_history: 10,
      limit_history: 20,
      offset_history: 0,
      anchorEl: null, //menu button
      anchorEl1: null,
      cancellationData: {},
      rescheduledCheck: null,
      isSelected: "",
      clientArr: [],
      clientData: {
        label: "All",
        value: ""
      },
      appointmentTypeArr: [],
      appointmentTypeData: {},
      targetLangData: [],
      sourceLangData: [],
      sourceLangId: [],
      targetLangId: [],
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
        label: "20",
        value: "20",
      },
      selectedDisplayData_history: {
        label: "20",
        value: "20",
      },
      listData: [],
      historyList: [],

      appointmentDate: "",
      hour: "08",
      min: "00",
      ampm: "AM",
      hour_fiter: "08",
      min_filter: "00",
      ampm_filter: "AM",
      isOtherReason: false,
      rescheduleNote: "",
      isCalender: false,
      calenderData: [],

      id: "",
      leiDob: "",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();

    var classInstance = this;
    // When the user clicks anywhere outside of the modal, close it

    document.getElementById("backdrop").style.display = "none";
    var modal = document.getElementById("decline-model");
    var filterModal = document.getElementById("filter-model");
    window.addEventListener("click", function (event) {
      if (event.target == modal) {
        classInstance.closeDeleteModal();
      } else if (event.target == filterModal) {
        classInstance.closeModal();
      }
    });

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
  }

  load = async () => {
    let languageArrData = [],
      languageObjData = [],
      languageResArrData = [],
      industryDataArr = [],
      appointmentDataArr = [],
      industryArr = [],
      appointmentArr = [],
      leiDataArr = [],
      leiArr = [];

    // ....................For List Data..........................................

    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      tabType: "0",
      searchTo: "",
      searchFrom: "",
      leiDob: "",
      status: "",
      clientId: "",
      leiId: "",
      orderby: "",
      direc: "",
      rfqId: "",
      appointmentTypeId: "",
      sourceLang: [],
      targetLang: [],
    };

    let returnData = Object.assign(reqData, fetchData);
    // let returnData_history = Object.assign(reqData, fetchData_history);
    this.listApi(returnData);
    // this.listApi_history(returnData_history);

    //For language dropdown in filter
    let languageResData = await ApiCall("getlanguagelist");
    let languagePayload = Decoder.decode(languageResData.data.payload);
    languageResArrData = languagePayload.data.languagelist;
    for (let n = 0; n < languageResArrData.length; n++) {
      languageArrData.push({
        label: languageResArrData[n].language,
        value: languageResArrData[n].id,
      });
      // if (languageResArrData[n].language === "English") {
      //   languageObjData.push({
      //     label: languageResArrData[n].language,
      //     value: languageResArrData[n].id,
      //   });
      //   languageObjId.push(languageResArrData[n].id)
      // }
    }

    let lookupres = await ApiCall("getLookUpData");
    if (
      lookupres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      lookupres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(lookupres.data.payload);

      industryDataArr = payload.data.lookupdata.INDUSTRY_TYPE;

      appointmentDataArr = payload.data.lookupdata.SCHEDULE_TYPE;

      // consoleLog("lookup::", payload.data.lookupdata);

      for (let j = 0; j < industryDataArr.length; j++) {
        industryArr.push({
          label: industryDataArr[j].name,
          value: industryDataArr[j].id,
        });
      }
      // for (let k = 0; k < appointmentDataArr.length; k++) {
      //   appointmentArr.push({
      //     label: appointmentDataArr[k].name,
      //     value: appointmentDataArr[k].id,
      //   });
      // }
      for (let k = 0; k < appointmentDataArr.length; k++) {
        appointmentArr.push({
          label: (
            <div>
              <img
                src={
                  appointmentDataArr[k].id === 63
                    ? ImageName.IMAGE_NAME.F2F
                    : appointmentDataArr[k].id === 64
                      ? ImageName.IMAGE_NAME.VRI_ICON
                      : ImageName.IMAGE_NAME.OPI_ICON
                }
                height="30px"
                width="25px"
                style={{ float: "Right" }}
              />
              <span style={{ paddingLeft: "5%" }}>
                {appointmentDataArr[k].id === 63
                  ? "Face to Face"
                  : appointmentDataArr[k].id === 64
                    ? "Video Remote Interpreting"
                    : "Over the Phone Interpretation"}
              </span>
            </div>
          ),
          value: appointmentDataArr[k].id,
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
      // consoleLog("all lei::", leiDataArr);
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
    let clientDataArr = [{
      label: "All",
      value: ""
    }];

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
      // sourceLangId:languageObjId,
      // targetLangId:languageObjId,
      industryArr: industryArr,
      appointmentTypeArr: appointmentArr,
      statusArr: statusArrData,
      leiArr: leiArr,
      isLoad: false,
    });
  };

  //...... For All jobs listing.............
  listApi = async (data) => {
    // consoleLog("request...data:::::", data);
    const res = await ApiCall("getApprovedInterpretationRFQList", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      // consoleLog("InterpretationList:::", decodeData.data);
      let listDetails = [];
      if (decodeData.data.projectList.length > 0) {
        listDetails = decodeData.data.projectList;
      }
      let totalPage = Math.ceil(
        decodeData.data.projectCount / parseInt(this.state.limit)
      );
      this.setState({
        listData: listDetails,
        total_page: totalPage,
        isLoad : false
      });
    }

    //..............for history interpretation listing...............
  };
  listApi_history = async (data) => {
    // consoleLog("request...data:::history::", data);
    const resHistory = await ApiCall("getApprovedInterpretationRFQList", data);
    if (
      resHistory.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resHistory.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData1 = Decoder.decode(resHistory.data.payload);
      // consoleLog("Payload history data>>>", decodeData1);
      let historyDetails = [];
      if (decodeData1.data.projectList.length > 0) {
        historyDetails = decodeData1.data.projectList;
      }
      let totalPage1 = Math.ceil(
        decodeData1.data.projectCount / parseInt(this.state.limit_history)
      );
      // console.log("Total history list Page>>>", historyDetails);
      this.setState({
        historyList: historyDetails,
        total_page_history: totalPage1,
        isLoad : false
      });
    }
  };

  // .............filter modal function...................

  onClientChamge = (data) => {
    this.setState({
      isLoad:true
    })
    if (this.state.isAlljobs) {
      let fetchData = {
        clientId: data.value,
        offset: this.state.offset.toString(),
        tabType: "0",
        searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
        orderby: "",
        direc: "",
        rfqId: this.state.id,
        leiId:
          this.state.leiData.value == null ||
            this.state.leiData.value == undefined
            ? ""
            : this.state.leiData.value,
        status:
          this.state.statusData.value == null ||
            this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        appointmentTypeId:
          this.state.appointmentTypeData.value == null ||
            this.state.appointmentTypeData.value == undefined
            ? ""
            : this.state.appointmentTypeData.value,
        sourceLang: this.state.sourceLangId,
        targetLang: this.state.targetLangId,
      };
      this.listApi(fetchData);
    } else {
      let fetchData = {
        clientId: data.value,
        offset: this.state.offset.toString(),
        tabType: "1",
        searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
        orderby: "",
        direc: "",
        rfqId: this.state.id,
        sourceLang: this.state.sourceLangId,
        targetLang: this.state.targetLangId,
        leiId:
          this.state.leiData.value == null ||
            this.state.leiData.value == undefined
            ? ""
            : this.state.leiData.value,
        status:
          this.state.statusData.value == null ||
            this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        appointmentTypeId:
          this.state.appointmentTypeData.value == null ||
            this.state.appointmentTypeData.value == undefined
            ? ""
            : this.state.appointmentTypeData.value,
      };
      this.listApi_history(fetchData);
    }

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
    if (this.state.isAlljobs) {
      this.setState({
        limit: parseInt(value.value),
        selectedDisplayData: value,
        current_page: 1,
      });

      let limit = value.value;

      let data = {
        limit: limit,
        offset: "0",
        tabType: "0",
        searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
        clientId:
          this.state.clientData.value === null ||
            this.state.clientData.value === undefined
            ? ""
            : this.state.clientData.value,
        orderby: "",
        direc: "",
        rfqId: this.state.id,
        sourceLang: this.state.sourceLangId,
        targetLang: this.state.targetLangId,
        leiId:
          this.state.leiData.value == null ||
            this.state.leiData.value == undefined
            ? ""
            : this.state.leiData.value,
        status:
          this.state.statusData.value == null ||
            this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        appointmentTypeId:
          this.state.appointmentTypeData.value == null ||
            this.state.appointmentTypeData.value == undefined
            ? ""
            : this.state.appointmentTypeData.value,
      };

      this.listApi(data);
    } else if (this.state.isHistory) {
      this.setState({
        limit_history: parseInt(value.value),
        selectedDisplayData_history: value,
        current_page_history: 1,
      });

      let limit = value.value;

      let data = {
        limit: limit,
        offset: "0",
        tabType: "1",
        searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
        clientId:
          this.state.clientData.value === null ||
            this.state.clientData.value === undefined
            ? ""
            : this.state.clientData.value,
        orderby: "",
        direc: "",
        rfqId: this.state.id,
        sourceLang: this.state.sourceLangId,
        targetLang: this.state.targetLangId,
        leiId:
          this.state.leiData.value == null ||
            this.state.leiData.value == undefined
            ? ""
            : this.state.leiData.value,
        status:
          this.state.statusData.value == null ||
            this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        appointmentTypeId:
          this.state.appointmentTypeData.value == null ||
            this.state.appointmentTypeData.value == undefined
            ? ""
            : this.state.appointmentTypeData.value,
      };

      this.listApi_history(data);
    }
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

  closeFilterModal = () => {
    this.closeModal();
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
    this.resetDeclineData();
    this.closeDeleteModal();
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
  leiDobChange = (date) => {
    this.setState({
      leiDob: SetUSAdateFormat(date),
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
    if (this.state.isAlljobs) {
      this.setState({
        current_page: 1,
        offset: "0",
      });
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: "0",
        tabType: "0",
        searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
        status: this.state.statusData.value,
        clientId:
          this.state.clientData.value === null ||
            this.state.clientData.value === undefined
            ? ""
            : this.state.clientData.value,

        orderby: "",
        direc: "",
        rfqId: this.state.id,

        sourceLang: this.state.sourceLangId,
        targetLang: this.state.targetLangId,
        leiId:
          this.state.leiData.value == null ||
            this.state.leiData.value == undefined
            ? ""
            : this.state.leiData.value,
        status:
          this.state.statusData.value == null ||
            this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        appointmentTypeId:
          this.state.appointmentTypeData.value == null ||
            this.state.appointmentTypeData.value == undefined
            ? ""
            : this.state.appointmentTypeData.value,
      };
      this.listApi(fetchData);
    } else if (this.state.isHistory) {
      this.setState({
        current_page_history: 1,
        offset: "0",
      });
      let fetchData = {
        limit: JSON.stringify(this.state.limit_history),
        offset: "0",
        tabType: "1",
        searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
        status: this.state.statusData.value,
        clientId:
          this.state.clientData.value === null ||
            this.state.clientData.value === undefined
            ? ""
            : this.state.clientData.value,

        orderby: "",
        direc: "",
        rfqId: this.state.id,

        sourceLang: this.state.sourceLangId,
        targetLang: this.state.targetLangId,
        leiId:
          this.state.leiData.value == null ||
            this.state.leiData.value == undefined
            ? ""
            : this.state.leiData.value,
        status:
          this.state.statusData.value == null ||
            this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        appointmentTypeId:
          this.state.appointmentTypeData.value == null ||
            this.state.appointmentTypeData.value == undefined
            ? ""
            : this.state.appointmentTypeData.value,
      };
      this.listApi_history(fetchData);
    }
  };

  // This is goes to the last page
  exRigth = () => {
    if (this.state.isAlljobs) {
      let totalPage = this.state.total_page;
      this.setState({
        current_page: totalPage,
        offset: JSON.stringify((totalPage - 1) * this.state.limit),
      });
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((totalPage - 1) * this.state.limit),
        tabType: "0",
        searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
        clientId:
          this.state.clientData.value === null ||
            this.state.clientData.value === undefined
            ? ""
            : this.state.clientData.value,

        orderby: "",
        direc: "",
        rfqId: this.state.id,
        sourceLang: this.state.sourceLangId,
        targetLang: this.state.targetLangId,
        leiId:
          this.state.leiData.value == null ||
            this.state.leiData.value == undefined
            ? ""
            : this.state.leiData.value,
        status:
          this.state.statusData.value == null ||
            this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        appointmentTypeId:
          this.state.appointmentTypeData.value == null ||
            this.state.appointmentTypeData.value == undefined
            ? ""
            : this.state.appointmentTypeData.value,
      };
      this.listApi(fetchData);
    } else if (this.state.isHistory) {
      let totalPage = this.state.total_page_history;
      this.setState({
        current_page_history: totalPage,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.limit_history),
        offset: JSON.stringify((totalPage - 1) * this.state.limit_history),
        tabType: "1",
        searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
        clientId:
          this.state.clientData.value === null ||
            this.state.clientData.value === undefined
            ? ""
            : this.state.clientData.value,
        orderby: "",
        direc: "",
        rfqId: this.state.id,
        sourceLang: this.state.sourceLangId,
        targetLang: this.state.targetLangId,
        leiId:
          this.state.leiData.value == null ||
            this.state.leiData.value == undefined
            ? ""
            : this.state.leiData.value,
        status:
          this.state.statusData.value == null ||
            this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        appointmentTypeId:
          this.state.appointmentTypeData.value == null ||
            this.state.appointmentTypeData.value == undefined
            ? ""
            : this.state.appointmentTypeData.value,
      };
      this.listApi_history(fetchData);
    }
  };

  // This is goes to the first page
  prev = () => {
    if (this.state.isAlljobs) {
      let currentPage = this.state.current_page;
      if (currentPage > 1) {
        currentPage--;
        this.setState({
          current_page: currentPage,
          offset: JSON.stringify((currentPage - 1) * this.state.limit),
        });
        let fetchData = {
          limit: JSON.stringify(this.state.limit),
          offset: JSON.stringify((currentPage - 1) * this.state.limit),
          tabType: "0",
          searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
          searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
          leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
          clientId:
            this.state.clientData.value === null ||
              this.state.clientData.value === undefined
              ? ""
              : this.state.clientData.value,

          orderby: "",
          direc: "",
          rfqId: this.state.id,
          sourceLang: this.state.sourceLangId,
          targetLang: this.state.targetLangId,
          leiId:
            this.state.leiData.value == null ||
              this.state.leiData.value == undefined
              ? ""
              : this.state.leiData.value,
          status:
            this.state.statusData.value == null ||
              this.state.statusData.value == undefined
              ? ""
              : this.state.statusData.value,
          appointmentTypeId:
            this.state.appointmentTypeData.value == null ||
              this.state.appointmentTypeData.value == undefined
              ? ""
              : this.state.appointmentTypeData.value,
        };
        this.listApi(fetchData);
      }
    } else if (this.state.isHistory) {
      let currentPage = this.state.current_page_history;
      if (currentPage > 1) {
        currentPage--;
        this.setState({
          current_page_history: currentPage,
        });
        let fetchData = {
          limit: JSON.stringify(this.state.limit_history),
          offset: JSON.stringify((currentPage - 1) * this.state.limit_history),
          tabType: "1",
          searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
          searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
          leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
          clientId:
            this.state.clientData.value === null ||
              this.state.clientData.value === undefined
              ? ""
              : this.state.clientData.value,
          orderby: "",
          direc: "",
          rfqId: this.state.id,
          sourceLang: this.state.sourceLangId,
          targetLang: this.state.targetLangId,
          leiId:
            this.state.leiData.value == null ||
              this.state.leiData.value == undefined
              ? ""
              : this.state.leiData.value,
          status:
            this.state.statusData.value == null ||
              this.state.statusData.value == undefined
              ? ""
              : this.state.statusData.value,
          appointmentTypeId:
            this.state.appointmentTypeData.value == null ||
              this.state.appointmentTypeData.value == undefined
              ? ""
              : this.state.appointmentTypeData.value,
        };
        this.listApi_history(fetchData);
      }
    }
  };

  // This is goes to the next page
  next = () => {
    if (this.state.isAlljobs) {
      let currentPage = this.state.current_page;
      let totalPage = this.state.total_page;
      if (currentPage < totalPage) {
        currentPage++;
        this.setState({
          current_page: currentPage,
          offset: JSON.stringify((currentPage - 1) * this.state.limit),
        });
        let fetchData = {
          limit: JSON.stringify(this.state.limit),
          offset: JSON.stringify((currentPage - 1) * this.state.limit),
          tabType: "0",
          searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
          searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
          leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
          clientId:
            this.state.clientData.value === null ||
              this.state.clientData.value === undefined
              ? ""
              : this.state.clientData.value,
          orderby: "",
          direc: "",
          rfqId: this.state.id,
          sourceLang: this.state.sourceLangId,
          targetLang: this.state.targetLangId,
          leiId:
            this.state.leiData.value == null ||
              this.state.leiData.value == undefined
              ? ""
              : this.state.leiData.value,
          status:
            this.state.statusData.value == null ||
              this.state.statusData.value == undefined
              ? ""
              : this.state.statusData.value,
          appointmentTypeId:
            this.state.appointmentTypeData.value == null ||
              this.state.appointmentTypeData.value == undefined
              ? ""
              : this.state.appointmentTypeData.value,
        };
        this.listApi(fetchData);
      }
    } else if (this.state.isHistory) {
      let currentPage = this.state.current_page_history;
      let totalPage = this.state.total_page_history;
      if (currentPage < totalPage) {
        currentPage++;
        this.setState({
          current_page_history: currentPage,
        });
        let fetchData = {
          limit: JSON.stringify(this.state.limit_history),
          offset: JSON.stringify((currentPage - 1) * this.state.limit_history),
          tabType: "1",
          searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
          searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
          leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
          clientId:
            this.state.clientData.value === null ||
              this.state.clientData.value === undefined
              ? ""
              : this.state.clientData.value,
          orderby: "",
          direc: "",
          rfqId: this.state.id,
          sourceLang: this.state.sourceLangId,
          targetLang: this.state.targetLangId,
          leiId:
            this.state.leiData.value == null ||
              this.state.leiData.value == undefined
              ? ""
              : this.state.leiData.value,
          status:
            this.state.statusData.value == null ||
              this.state.statusData.value == undefined
              ? ""
              : this.state.statusData.value,
          appointmentTypeId:
            this.state.appointmentTypeData.value == null ||
              this.state.appointmentTypeData.value == undefined
              ? ""
              : this.state.appointmentTypeData.value,
        };

        this.listApi_history(fetchData);
      }
    }
  };

  onFilterApply = () => {
    let modHour =
      this.state.hour_fiter +
      ":" +
      this.state.min_filter +
      " " +
      this.state.ampm_filter;
    var dt = moment(modHour, ["h:mm A"]).format("HH:mm");
    if (this.state.isAlljobs) {
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: "0",
        tabType: "0",
        searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
        clientId:
          this.state.clientData.value === null ||
            this.state.clientData.value === undefined
            ? ""
            : this.state.clientData.value,
        orderby: "",
        direc: "",
        rfqId: this.state.id,
        sourceLang: this.state.sourceLangId,
        targetLang: this.state.targetLangId,
        leiId:
          this.state.leiData.value == null ||
            this.state.leiData.value == undefined
            ? ""
            : this.state.leiData.value,
        status:
          this.state.statusData.value == null ||
            this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        appointmentTypeId:
          this.state.appointmentTypeData.value == null ||
            this.state.appointmentTypeData.value == undefined
            ? ""
            : this.state.appointmentTypeData.value,
      };

      consoleLog("filter data::", fetchData)

      this.listApi(fetchData);

      // console.log("Filter data", data)
      this.closeFilterModal();

      this.setState({
        current_page: 1,
      });
    } else {
      let fetchData = {
        limit: JSON.stringify(this.state.limit_history),
        offset: "0",
        tabType: "1",
        searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
        clientId:
          this.state.clientData.value === null ||
            this.state.clientData.value === undefined
            ? ""
            : this.state.clientData.value,
        orderby: "",
        direc: "",
        rfqId: this.state.id,
        sourceLang: this.state.sourceLangId,
        targetLang: this.state.targetLangId,
        leiId:
          this.state.leiData.value == null ||
            this.state.leiData.value == undefined
            ? ""
            : this.state.leiData.value,
        status:
          this.state.statusData.value == null ||
            this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        appointmentTypeId:
          this.state.appointmentTypeData.value == null ||
            this.state.appointmentTypeData.value == undefined
            ? ""
            : this.state.appointmentTypeData.value,
      };

      // consoleLog("req filter data::", fetchData);
      this.listApi_history(fetchData);

      // console.log("Filter data", data)
      this.closeFilterModal();

      this.setState({
        current_page_history: 1,
      });
    }
  };

  onResetFilter = () => {
    if (this.state.isAlljobs) {
      this.resetData();
      this.setState({
        current_page: 1,
      });

      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: "0",
        tabType: "0",
        searchTo: "",
        searchFrom: "",
        leiDob: "",
        status: "",
        clientId: "",
        orderby: "",
        direc: "",
        rfqId: "",
        appointmentTypeId: "",
        sourceLang: [],
        targetLang: [],
      };

      // consoleLog("req filter data::", fetchData);
      this.listApi(fetchData);
    } else {
      this.resetData();
      this.setState({
        current_page: 1,
      });

      let fetchData = {
        limit: JSON.stringify(this.state.limit_history),
        offset: "0",
        tabType: "1",
        searchTo: "",
        searchFrom: "",
        leiDob: "",
        status: "",
        clientId: "",
        orderby: "",
        direc: "",
        rfqId: "",
        appointmentTypeId: "",
        sourceLang: [],
        targetLang: [],
      };

      this.listApi_history(fetchData);
    }

    this.closeFilterModal();
  };

  resetData = () => {
    this.setState({
      formDate: "",
      toDate: "",
      leiDob: "",
      appointmentTypeData: {},
      sourceLangData: [],
      targetLangData: [],
      sourceLangId: [],
      targetLangId: [],
      formDate: "",
      statusData: {},
      leiData: {},
      clientData: {
        label: "All",
        value: ""
      },
      id: "",
    });
  };

  onCancelDataChange = (data) => {
    if (data.value === 1) {
      this.setState({
        isSelected: "true",
        isOtherReason: false,
      });
    } else if (data.value === 6) {
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

  // rescheduledCheckYes = (e) => {
  //   // console.log(e.target.checked);
  //   this.setState({
  //     isSelected: true,
  //     rescheduledCheck: e.target.checked,
  //   });
  // };
  // rescheduledCheckNo = (e) => {
  //   // console.log(e.target.checked);
  //   this.setState({
  //     isSelected: false,
  //     rescheduledCheck: e.target.checked,
  //   });
  // };

  onRescheduleNote = (e) => {
    this.setState({
      rescheduleNote: e.target.value,
    });
  };

  onDeclineSubmit = async () => {
    let errorCount = 0;

    let validateCancelReason = inputEmptyValidate(
      this.state.cancellationData
    );
    let validateDate = inputEmptyValidate(this.state.appointmentDate);
    let validateOtherReason = inputEmptyValidate(this.state.otherReason);

    consoleLog("----->", validateCancelReason);
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
        requestId: this.state.listData[this.state.curIndex].id,
        selectReason:
          this.state.cancellationData.value === 6
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

      consoleLog("data::", data);
      let res = await ApiCall("cancelJobDetails", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        if (this.state.cancellationData.value == "1") {
          toast.success(AlertMessage.MESSAGE.JOB.RESCHEDULED, {
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
    if (value === "alljobs") {
      this.resetData();
      this.setState({
        // interpretationModal: true,
        // translationModal: false,
        // trainingModal: false,
        isAlljobs: true,
        isHistory: false,
        isLoad: true,
      });

      let res = {
        limit: this.state.limit,
        offset: "0",
        searchTo: "",
        searchFrom: "",
        leiDob: "",
        status: "",
        clientId: "",
        leiId: "",
        orderby: "",
        direc: "",
        rfqId: "",
        tabType: "0",
        appointmentTypeId: "",
        sourceLang: [],
        targetLang: [],
      };
      this.listApi(res);
    } else if (value === "history") {
      this.resetData();
      this.setState({
        isAlljobs: false,
        isHistory: true,
        isLoad: true,
      });
      let res = {
        limit: this.state.limit_history,
        offset: "0",
        searchTo: "",
        searchFrom: "",
        leiDob: "",
        status: "",
        clientId: "",
        leiId: "",
        orderby: "",
        direc: "",
        rfqId: "",
        tabType: "1",
        appointmentTypeId: "",
        sourceLang: [],
        targetLang: [],
      };
      this.listApi_history(res);
    }
  };

  onAppointmentTypeChange = (data) => {
    consoleLog("val:::", data.value);
    this.setState({
      appointmentTypeData: data,
    });
  };
  onTargetLangChange = (value) => {
    let arr = [];

    value.map((obj) => {
      arr.push(obj.value);
    });
    //  consoleLog("val:::",arr)
    this.setState({
      targetLangData: value,
      targetLangId: arr,
    });
  };
  onSourceLangChange = (value) => {
    let arr = [];
    value.map((obj) => {
      arr.push(obj.value);
    });
    //  consoleLog("val:::",arr)
    this.setState({
      sourceLangData: value,
      sourceLangId: arr,
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
  // ..........for filter modal.goEdit...............

  hourChange_filter = () => {
    let hr = parseInt(this.state.hour_fiter) + 1;
    if (parseInt(this.state.hour_fiter) + 1 > 12) {
      this.setState({
        hour_fiter: "01",
      });
    } else {
      if (parseInt(this.state.hour_fiter) + 1 > 9) {
        this.setState({
          hour_fiter: hr,
        });
      } else {
        this.setState({
          hour_fiter: "0" + hr,
        });
      }
    }
  };

  hourChangeUp_filter = () => {
    let hr = parseInt(this.state.hour_fiter) - 1;
    if (hr < 1) {
      this.setState({
        hour_fiter: "12",
      });
    } else {
      if (hr > 9) {
        this.setState({
          hour_fiter: hr,
        });
      } else {
        this.setState({
          hour_fiter: "0" + hr,
        });
      }
    }
  };

  minChange_filter = () => {
    let min = parseInt(this.state.min_filter) + 1;
    if (parseInt(this.state.min_filter) + 1 > 59) {
      this.setState({
        min_filter: "00",
      });
    } else {
      if (parseInt(this.state.min_filter) + 1 > 9) {
        this.setState({
          min_filter: min,
        });
      } else {
        this.setState({
          min_filter: "0" + min,
        });
      }
    }
  };

  minChangeUp_filter = () => {
    let min = parseInt(this.state.min_filter) - 1;
    if (min < 0) {
      this.setState({
        min_filter: "59",
      });
    } else {
      if (min > 9) {
        this.setState({
          min_filter: min,
        });
      } else {
        this.setState({
          min_filter: "0" + min,
        });
      }
    }
  };

  ampmChange_filter = () => {
    if (this.state.ampm_filter === "AM") {
      this.setState({
        ampm_filter: "PM",
      });
    } else {
      this.setState({
        ampm_filter: "AM",
      });
    }
  };

  goEdit = (value) => {
    if (value === "all") {
      this.props.history.push({
        pathname: "/adminJobDetails",
        state: this.state.listData[this.state.curIndex].id,
      });
    } else if (value === "history") {
      this.props.history.push({
        pathname: "/adminJobDetails",
        state: this.state.historyList[this.state.curIndex].id,
      });
    }
  };

  openTable = () => {
    this.setState({
      isCalender: false,
    });
  };

  openCalender = async () => {
    let reqData = {
      status: "",
      clientId: "",
      serviceType: "",
      orderby: "",
      direc: "",
      searchFrom: "",
      searchTo: "",
      rfqId: "",
    };
    //...... For All jobs listing for calender.............
    const res = await ApiCall("getApprovedInterpretationRFQList", reqData);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      let listDetails = [];
      if (decodeData.data.projectList.length > 0) {
        listDetails = decodeData.data.projectList;
      }
      // consoleLog("CalenderDAta : ", listDetails)
      this.setState({
        calenderData: listDetails,
        isCalender: true,
      });
    }
  };

  detailJob = (value) => {
    // consoleLog("Calender Click", value);
    this.setState({
      curIndex: value.curIndex,
    });

    this.props.history.push({
      pathname: "/adminJobDetails",
      state: this.state.calenderData[value.curIndex].id,
    });
  };

  resetDeclineData = () => {
    this.setState({
      rescheduleNote: "",
      appointmentDate: "",
      cancellationData: {},
      otherReason: "",
      hour: "08",
      min: "00",
      ampm: "AM",
    });
  };

  onIdChange = (val) => {
    if (this.state.isAlljobs) {
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify(
          (this.state.current_page - 1) * this.state.limit
        ),
        tabType: "0",
        searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
        clientId:
          this.state.clientData.value === null ||
            this.state.clientData.value === undefined
            ? ""
            : this.state.clientData.value,
        orderby: "",
        direc: "",
        rfqId: val,
        sourceLang: this.state.sourceLangId,
        targetLang: this.state.targetLangId,
        leiId:
          this.state.leiData.value == null ||
            this.state.leiData.value == undefined
            ? ""
            : this.state.leiData.value,
        status:
          this.state.statusData.value == null ||
            this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        appointmentTypeId:
          this.state.appointmentTypeData.value == null ||
            this.state.appointmentTypeData.value == undefined
            ? ""
            : this.state.appointmentTypeData.value,
      };

      this.listApi(fetchData);
    } else {
      let fetchData = {
        limit: JSON.stringify(this.state.limit_history),
        offset: JSON.stringify(
          (this.state.current_page_history - 1) * this.state.limit_history
        ),
        searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
        scheduleTime: "",
        clientId:
          this.state.clientData.value === null ||
            this.state.clientData.value === undefined
            ? ""
            : this.state.clientData.value,
        orderby: "",
        direc: "",
        rfqId: val,
        sourceLang: this.state.sourceLangId,
        targetLang: this.state.targetLangId,
        tabType: "1",
        leiId:
          this.state.leiData.value == null ||
            this.state.leiData.value == undefined
            ? ""
            : this.state.leiData.value,
        status:
          this.state.statusData.value == null ||
            this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        appointmentTypeId:
          this.state.appointmentTypeData.value == null ||
            this.state.appointmentTypeData.value == undefined
            ? ""
            : this.state.appointmentTypeData.value,
      };

      this.listApi_history(fetchData);
    }

    this.setState({
      id: val,
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
            <Link to="/adminDashboard">Dashboard</Link> / Interpretation Jobs
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
                      Job ID
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
                <div className="col-md-4">
                  <div className="vn_frm">
                    {" "}
                    <span>Client</span>
                    <div className="bts-drop">
                      <div className="dropdown bootstrap-select">
                        <SelectBox
                          value={this.state.clientData}
                          optionData={this.state.clientArr}
                          onSelectChange={(value) => {
                            this.onClientChamge(value);
                          }}
                        />

                        <div className="dropdown-menu " role="combobox">
                          <div
                            className="inner show"
                            role="listbox"
                            aria-expanded="false"
                            tabindex="-1"
                          >
                            <ul className="dropdown-menu inner show"></ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                        All Jobs
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
            {!this.state.isCalender ? (
              <React.Fragment>
                <div className="row">
                  <div className="col-md-6">
                    <div className="cus-filter-btn">
                      <button className="button">
                        <img
                          src={ImageName.IMAGE_NAME.MENU_BTN}
                          onclick={this.openTable}
                        />
                      </button>
                      {/* <button className="button">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN_ONE} />
                    </button> */}
                      <button className="button">
                        <img
                          src={ImageName.IMAGE_NAME.MENU_BTN_TWO}
                          onClick={this.openCalender}
                        />
                      </button>

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
                          {this.state.isAlljobs
                            ? this.state.current_page
                            : this.state.current_page_history}
                        </span>
                        <button className="nxt_btn" onClick={this.next}>
                          {">"}
                        </button>
                        <button
                          className="next_btn"
                          onClick={this.exRigth}
                        ></button>
                      </div>
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
                          <PaginationDropdown
                            optionData={CommonData.COMMON.DISPLAY_ARR}
                            value={
                              this.state.isAlljobs
                                ? this.state.selectedDisplayData
                                : this.state.selectedDisplayData_history
                            }
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onChangeLimit(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="row">
                  <div className="col-md-6">
                    <div className="cus-filter-btn">
                      <button className="button" onClick={this.openTable}>
                        <img
                          src={ImageName.IMAGE_NAME.GREY_HAMBURGER}
                          style={{ width: "20px", marginTop: "15px" }}
                        />
                      </button>
                      <button className="button" onClick={this.openCalender}>
                        <img
                          src={ImageName.IMAGE_NAME.BLUE_CALENDER}
                          style={{ width: "20px", marginTop: "15px" }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>

          {this.state.isCalender ? (
            <React.Fragment>
              <div className="table-listing-app">
                <ViewCalender
                  id={this.state.calenderData}
                  detailClick={(value) => {
                    this.detailJob(value);
                  }}
                  type="job"
                />
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div hidden={!this.state.isLoad}>
                <LotteLoader />
              </div>
              <div hidden={this.state.isLoad}>
                <div
                  className="tab-app-information activeLnk"
                  id="tble-data-a"
                  hidden={!this.state.isAlljobs}
                >
                  <div className="table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <table
                        width="100%"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tbody>
                          <tr>
                            <th style={{ width: "10%" }}>Job#</th>
                            <th style={{ width: "9%" }}>Client</th>
                            {/* <th style={{ width: "9%" }}>Requester</th> */}
                            <th style={{ width: "9%" }}>LEI</th>
                            <th style={{ width: "9%" }}>Appointment Type</th>
                            <th style={{ width: "13%" }}>Date & Time</th>
                            <th style={{ width: "14%" }}>Location</th>
                            <th style={{ width: "10%" }}>
                              Language{" "}
                              {/* <img src={ImageName.IMAGE_NAME.GREATER_THAN_ARROW} /> */}
                            </th>
                            {/* <th style={{ width: "8%" }}>Target Language</th> */}
                            <th style={{ width: "11%" }}>Status</th>
                            <th style={{ width: "4%" }}>Action</th>
                          </tr>
                          {this.state.listData.length > 0 ? (
                            <React.Fragment>
                              {this.state.listData.map((item, key) => (
                                <tr>
                                  <td colspan="11">
                                    <div className="tble-row">
                                      <table
                                        width="100%"
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                      >
                                        <tbody>
                                          <tr>
                                            <td style={{ width: "10%" }}>
                                              {item.requestId}
                                            </td>
                                            <td style={{ width: "9%" }}>
                                              {item.clientName}
                                            </td>
                                            {/* <td style={{ width: "9%" }}>
                                    {item.requester}
                                  </td> */}
                                            <td style={{ width: "9%" }}>
                                              {item.leiName}
                                            </td>
                                            <td style={{ width: "9%" }}>
                                              <div className="f2f">
                                                {item.appointmenttype}
                                              </div>
                                            </td>
                                            <td style={{ width: "13%" }}>
                                              {SetDateFormat(item.date)}
                                              {"|"}
                                              {item.time}
                                            </td>
                                            <td style={{ width: "14%" }}>
                                              {item.location === "" ? "N/A" : item.location}
                                            </td>
                                            <td style={{ width: "10%" }}>
                                              {item.sourceLanguage} {">"}
                                              {<br />}
                                              {item.targetLanguage}
                                            </td>
                                            {/* <td style={{ width: "8%" }}></td> */}
                                            <td style={{ width: "11%" }}>
                                              {item.status === 0 ? (
                                                <React.Fragment>
                                                  <span className="progress-btn yellow">
                                                    Pending
                                                  </span>
                                                </React.Fragment>
                                              ) : item.status === 1 ? (
                                                <React.Fragment>
                                                  <span
                                                    href="#"
                                                    className="progress-btn sky"
                                                  >
                                                    Quote Sent
                                                  </span>
                                                </React.Fragment>
                                              ) : item.status === 2 ? (
                                                <React.Fragment>
                                                  <span
                                                    href="#"
                                                    className="progress-btn green"
                                                  >
                                                    Quote Accepted
                                                  </span>
                                                </React.Fragment>
                                              ) : item.status === 3 ? (
                                                <React.Fragment>
                                                  <span
                                                    href="#"
                                                    className="progress-btn sky"
                                                  >
                                                    offer Sent
                                                  </span>
                                                </React.Fragment>
                                              ) : item.status === 4 ? (
                                                <React.Fragment>
                                                  <span
                                                    href="#"
                                                    className="progress-btn blue"
                                                  >
                                                    Offer Accepted
                                                  </span>
                                                </React.Fragment>
                                              ) : item.status === 5 ? (
                                                <React.Fragment>
                                                  <span
                                                    href="#"
                                                    className="progress-btn red"
                                                  >
                                                    Offer Rejected
                                                  </span>
                                                </React.Fragment>
                                              ) : item.status === 6 ? (
                                                <React.Fragment>
                                                  <span
                                                    href="#"
                                                    className="progress-btn blue"
                                                  >
                                                    Bids Received
                                                  </span>
                                                </React.Fragment>
                                              ) : item.status === 7 ? (
                                                <React.Fragment>
                                                  <span
                                                    href="#"
                                                    className="progress-btn red"
                                                  >
                                                    Quote Rejected
                                                  </span>
                                                </React.Fragment>
                                              ) : item.status === 8 ? (
                                                <React.Fragment>
                                                  <span
                                                    href="#"
                                                    className="progress-btn green"
                                                  >
                                                    Assigned
                                                  </span>
                                                </React.Fragment>
                                              ) : item.status === 9 ? (
                                                <React.Fragment>
                                                  <span
                                                    href="#"
                                                    className="progress-btn yellow"
                                                  >
                                                    In Progress
                                                  </span>
                                                </React.Fragment>
                                              ) : item.status === 10 ? (
                                                <React.Fragment>
                                                  <span
                                                    href="#"
                                                    className="progress-btn green"
                                                  >
                                                    completed
                                                  </span>
                                                </React.Fragment>
                                              ) : item.status === 11 ? (
                                                <React.Fragment>
                                                  <span
                                                    href="#"
                                                    className="progress-btn red"
                                                  >
                                                    cancelled
                                                  </span>
                                                </React.Fragment>
                                              ) : (
                                                <React.Fragment></React.Fragment>
                                              )}
                                            </td>
                                            <td style={{ width: "4%" }}>
                                              {item.status === 2 ? (
                                                <React.Fragment>
                                                  <img
                                                    src={
                                                      ImageName.IMAGE_NAME
                                                        .MENU_VERTICAL
                                                    }
                                                    style={{ cursor: "pointer" }}
                                                    id={"basic-button" + key}
                                                    aria-controls={
                                                      "basic-menu" + key
                                                    }
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
                                                  <StyledMenu
                                                    id={"basic-menu" + key}
                                                    anchorEl={this.state.anchorEl}
                                                    open={open}
                                                    onClose={this.handleMenuClose}
                                                    MenuListProps={{
                                                      "aria-labelledby":
                                                        "basic-button" + key,
                                                    }}
                                                  >
                                                    <MenuItem
                                                      onClick={() => this.goEdit("all")}
                                                    >
                                                      View Details
                                                    </MenuItem>
                                                    {/* <MenuItem
                                                    onClick={() =>
                                                      this.goEdit()
                                                    }
                                                  >
                                                    Create Offer
                                                  </MenuItem> */}
                                                    {/* <MenuItem>Chat</MenuItem> */}
                                                    <MenuItem
                                                      onClick={this.declineModal}
                                                    >
                                                      Cancel
                                                    </MenuItem>
                                                  </StyledMenu>
                                                </React.Fragment>
                                              ) : (
                                                <React.Fragment>
                                                  <img
                                                    src={
                                                      ImageName.IMAGE_NAME
                                                        .MENU_VERTICAL
                                                    }
                                                    style={{ cursor: "pointer" }}
                                                    id={"basic-button" + key}
                                                    aria-controls={
                                                      "basic-menu" + key
                                                    }
                                                    aria-haspopup="true"
                                                    aria-expanded={
                                                      open1 ? "true" : undefined
                                                    }
                                                    onClick={(e) =>
                                                      this.menuBtnhandleClick_b(
                                                        key,
                                                        e
                                                      )
                                                    }
                                                  />
                                                  <StyledMenu
                                                    id={"basic-menu" + key}
                                                    anchorEl={
                                                      this.state.anchorEl1
                                                    }
                                                    open={open1}
                                                    onClose={this.handleMenuClose}
                                                    MenuListProps={{
                                                      "aria-labelledby":
                                                        "basic-button" + key,
                                                    }}
                                                  >
                                                    <MenuItem
                                                      onClick={() => this.goEdit("all")}
                                                    >
                                                      View Details
                                                    </MenuItem>

                                                    {/* <MenuItem>Chat</MenuItem> */}
                                                    <MenuItem
                                                      onClick={this.declineModal}
                                                    >
                                                      Cancel
                                                    </MenuItem>
                                                  </StyledMenu>
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
                                <td colSpan="11">
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
              </div>
              <div hidden={this.state.isLoad}>
                <div
                  className="tab-app-information"
                  id="tble-data-b"
                  hidden={!this.state.isHistory}
                >
                  <div className="table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <table
                        width="100%"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tbody>
                          <tr>
                            <th style={{ width: "10%" }}>Job#</th>
                            <th style={{ width: "9%" }}>Client</th>
                            {/* <th style={{ width: "9%" }}>Requester</th> */}
                            <th style={{ width: "9%" }}>LEI</th>
                            <th style={{ width: "9%" }}>Appointment Type</th>
                            <th style={{ width: "13%" }}>Date & Time</th>
                            <th style={{ width: "14%" }}>Location</th>
                            <th style={{ width: "10%" }}>
                              Language{" "}
                              {/* <img src={ImageName.IMAGE_NAME.GREATER_THAN_ARROW} /> */}
                            </th>
                            {/* <th style={{ width: "8%" }}>Target Language</th> */}
                            <th style={{ width: "11%" }}>Status</th>
                            <th style={{ width: "4%" }}>Action</th>
                          </tr>
                          {this.state.historyList.length > 0 ? (
                            <React.Fragment>
                              {this.state.historyList.map((item, key) => (
                                <tr>
                                  <td colspan="11">
                                    <div className="tble-row">
                                      <table
                                        width="100%"
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                      >
                                        <tbody>
                                          <tr>
                                            <td style={{ width: "10%" }}>
                                              {item.requestId}
                                            </td>
                                            <td style={{ width: "9%" }}>
                                              {item.clientName}
                                            </td>
                                            {/* <td style={{ width: "9%" }}>
                                    {item.requester}
                                  </td> */}
                                            <td style={{ width: "9%" }}>
                                              {item.leiName}
                                            </td>
                                            <td style={{ width: "9%" }}>
                                              <div className="f2f">
                                                {item.appointmenttype}
                                              </div>
                                            </td>
                                            <td style={{ width: "13%" }}>
                                              {SetDateFormat(item.date)}
                                              {"|"}
                                              {item.time}
                                            </td>
                                            <td style={{ width: "14%" }}>
                                              {item.location === "" ? "N/A" : item.location}
                                            </td>
                                            <td style={{ width: "10%" }}>
                                              {item.sourceLanguage} {">"}
                                              {<br />}
                                              {item.targetLanguage}
                                            </td>
                                            {/* <td style={{ width: "8%" }}></td> */}
                                            <td style={{ width: "11%" }}>
                                              {item.status === 0 ? (
                                                <React.Fragment>
                                                  <a
                                                    href="javascript:void(0)"
                                                    className="progress-btn yellow"
                                                  >
                                                    Pending
                                                  </a>
                                                </React.Fragment>
                                              ) : item.status === 1 ? (
                                                <React.Fragment>
                                                  <a
                                                    href="javascript:void(0)"
                                                    className="progress-btn sky"
                                                  >
                                                    Quote Sent
                                                  </a>
                                                </React.Fragment>
                                              ) : item.status === 2 ? (
                                                <React.Fragment>
                                                  <a
                                                    href="javascript:void(0)"
                                                    className="progress-btn green"
                                                  >
                                                    Quote Accepted
                                                  </a>
                                                </React.Fragment>
                                              ) : item.status === 3 ? (
                                                <React.Fragment>
                                                  <a
                                                    href="javascript:void(0)"
                                                    className="progress-btn sky"
                                                  >
                                                    offer Sent
                                                  </a>
                                                </React.Fragment>
                                              ) : item.status === 4 ? (
                                                <React.Fragment>
                                                  <a
                                                    href="javascript:void(0)"
                                                    className="progress-btn blue"
                                                  >
                                                    Offer Accepted
                                                  </a>
                                                </React.Fragment>
                                              ) : item.status === 5 ? (
                                                <React.Fragment>
                                                  <a
                                                    href="javascript:void(0)"
                                                    className="progress-btn red"
                                                  >
                                                    Offer Rejected
                                                  </a>
                                                </React.Fragment>
                                              ) : item.status === 6 ? (
                                                <React.Fragment>
                                                  <a
                                                    href="javascript:void(0)"
                                                    className="progress-btn blue"
                                                  >
                                                    Bids Received
                                                  </a>
                                                </React.Fragment>
                                              ) : item.status === 7 ? (
                                                <React.Fragment>
                                                  <a
                                                    href="javascript:void(0)"
                                                    className="progress-btn red"
                                                  >
                                                    Quote Rejected
                                                  </a>
                                                </React.Fragment>
                                              ) : item.status === 8 ? (
                                                <React.Fragment>
                                                  <a
                                                    href="javascript:void(0)"
                                                    className="progress-btn green"
                                                  >
                                                    Assigned
                                                  </a>
                                                </React.Fragment>
                                              ) : item.status === 9 ? (
                                                <React.Fragment>
                                                  <a
                                                    href="javascript:void(0)"
                                                    className="progress-btn yellow"
                                                  >
                                                    In Progress
                                                  </a>
                                                </React.Fragment>
                                              ) : item.status === 10 ? (
                                                <React.Fragment>
                                                  <a
                                                    href="javascript:void(0)"
                                                    className="progress-btn green"
                                                  >
                                                    completed
                                                  </a>
                                                </React.Fragment>
                                              ) : item.status === 11 ? (
                                                <React.Fragment>
                                                  <a
                                                    href="javascript:void(0)"
                                                    className="progress-btn red"
                                                  >
                                                    cancelled
                                                  </a>
                                                </React.Fragment>
                                              ) : (
                                                <React.Fragment></React.Fragment>
                                              )}
                                            </td>
                                            <td style={{ width: "4%" }}>
                                              {item.status === 2 ? (
                                                <React.Fragment>
                                                  <img
                                                    src={
                                                      ImageName.IMAGE_NAME
                                                        .MENU_VERTICAL
                                                    }
                                                    style={{ cursor: "pointer" }}
                                                    id={"basic-button-his" + key}
                                                    aria-controls={
                                                      "basic-menu-his" + key
                                                    }
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
                                                  <StyledMenu
                                                    id={"basic-menu-his" + key}
                                                    anchorEl={this.state.anchorEl}
                                                    open={open}
                                                    onClose={this.handleMenuClose}
                                                    MenuListProps={{
                                                      "aria-labelledby":
                                                        "basic-button-his" + key,
                                                    }}
                                                  >
                                                    <MenuItem
                                                      onClick={() => this.goEdit("history")}
                                                    >
                                                      View Details
                                                    </MenuItem>
                                                    {/* <MenuItem
                                                    onClick={() =>
                                                      this.onCreateOffer()
                                                    }
                                                  >
                                                    Create Offer
                                                  </MenuItem> */}
                                                    {/* <MenuItem>Chat</MenuItem> */}
                                                    <MenuItem
                                                      onClick={this.declineModal}
                                                    >
                                                      Cancel
                                                    </MenuItem>
                                                  </StyledMenu>
                                                </React.Fragment>
                                              ) : (
                                                <React.Fragment>
                                                  <img
                                                    src={
                                                      ImageName.IMAGE_NAME
                                                        .MENU_VERTICAL
                                                    }
                                                    style={{ cursor: "pointer" }}
                                                    id={"basic-button-his" + key}
                                                    aria-controls={
                                                      "basic-menu-his" + key
                                                    }
                                                    aria-haspopup="true"
                                                    aria-expanded={
                                                      open1 ? "true" : undefined
                                                    }
                                                    onClick={(e) =>
                                                      this.menuBtnhandleClick_b(
                                                        key,
                                                        e
                                                      )
                                                    }
                                                  />
                                                  <StyledMenu
                                                    id={"basic-menu-his" + key}
                                                    anchorEl={
                                                      this.state.anchorEl1
                                                    }
                                                    open={open1}
                                                    onClose={this.handleMenuClose}
                                                    MenuListProps={{
                                                      "aria-labelledby":
                                                        "basic-button-his" + key,
                                                    }}
                                                  >
                                                    <MenuItem
                                                      onClick={() => this.goEdit("history")}
                                                    >
                                                      View Details
                                                    </MenuItem>

                                                    {/* <MenuItem>Chat</MenuItem> */}
                                                    <MenuItem
                                                      onClick={this.declineModal}
                                                    >
                                                      Cancel
                                                    </MenuItem>
                                                  </StyledMenu>
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
                                <td colSpan="11">
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
              </div>
            </React.Fragment>
          )}
          {this.state.isCalender ? (
            <React.Fragment></React.Fragment>
          ) : (
            <React.Fragment>
              <div className="table-filter-app" hidden={this.state.isLoad}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="cus-filter-btn">
                      <button className="button">
                        <img src={ImageName.IMAGE_NAME.MENU_BTN} />
                      </button>
                      {/* <button className="button">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN_ONE} />
                    </button> */}
                      <button className="button">
                        <img src={ImageName.IMAGE_NAME.MENU_BTN_TWO} />
                      </button>

                      {/* <div
                    class="filter-btn"
                    style={{ float: "none", paddingLeft: "10px" }}
                  >
                    <a href="#" onClick={this.filterModal}>
                      Filter
                    </a>
                  </div> */}

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
                        <div className="dropdwn">
                          <div
                            class="dropdwn"
                            style={{
                              width: "70px",
                              fontSize: "12px",
                              textAlign: "center",
                            }}
                          >
                            <PaginationDropdown
                              optionData={CommonData.COMMON.DISPLAY_ARR}
                              value={this.state.selectedDisplayData}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onChangeLimit(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
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
                      <li className="active" data-related="tble-data-d">
                        Appointment Type
                      </li>
                      <li data-related="tble-data-e">Language</li>
                      <li data-related="tble-data-h">Date & Time</li>
                      <li data-related="tble-data-i">Status</li>
                      <li data-related="tble-data-j">
                        Limited English Individual [LEI]
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
                                  APPOINTMENT TYPE
                                </div>
                              </div>
                              <div className="row">
                                <div
                                  class="dropdwn"
                                  style={{ cursor: "pointer" }}
                                >
                                  <Select
                                    styles={customStyles}
                                    options={this.state.appointmentTypeArr}
                                    components={{
                                      DropdownIndicator,
                                      IndicatorSeparator: () => null,
                                    }}
                                    value={this.state.appointmentTypeData}
                                    placeholder="Select"
                                    onChange={(value) => {
                                      this.onAppointmentTypeChange(value);
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
                                  <div className="frm-label">
                                    SOURCE LANGUAGE
                                  </div>
                                  <div className="bts-drop">
                                    <MultiSelectBox
                                      optionData={this.state.languageArr}
                                      value={this.state.sourceLangData}
                                      onSelectChange={(value) =>
                                        this.onSourceLangChange(value)
                                      }
                                    ></MultiSelectBox>
                                  </div>
                                </div>

                                <div className="web-form-bx">
                                  <div className="frm-label">
                                    TARGET LANGUAGE
                                  </div>
                                  <div className="bts-drop">
                                    <MultiSelectBox
                                      optionData={this.state.languageArr}
                                      value={this.state.targetLangData}
                                      onSelectChange={(value) =>
                                        this.onTargetLangChange(value)
                                      }
                                    ></MultiSelectBox>
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
                          <div
                            className="form-search-app"
                            style={{ padding: "30px" }}
                          >
                            <div
                              className="lable-text"
                              style={{ fontSize: "20px" }}
                            >
                              Appointment Date
                            </div>
                            <div className="row">
                              <div className="input-group jobDatepicker">
                                <div className="jobDatepickerInputTxt">
                                  <span className="jobDatepickerInputTxt_span">
                                    <p className="jobDatepickerInputTxt_pTag">
                                      From
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
                            <div className="row" style={{ marginTop: "40px" }}>
                              <div className="input-group jobDatepicker">
                                <div className="jobDatepickerInputTxt">
                                  <span className="jobDatepickerInputTxt_span">
                                    <p className="jobDatepickerInputTxt_pTag">
                                      To
                                    </p>{" "}
                                    <p className="jobDatepickerInputTxt_pTag">
                                      {this.state.toDate}
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
                                        this.toDateChange(date)
                                      }
                                      customInput={<Schedule />}
                                    />
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="lable-text jobLeiDOB">
                              LEI'S DATE OF BIRTH
                            </div>
                            <div className="row">
                              <div className="input-group jobDatepicker">
                                <div className="jobDatepickerInputTxt">
                                  <span className="jobDatepickerInputTxt_span">
                                    {this.state.leiDob}
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
                                        this.leiDobChange(date)
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
                                <Select
                                  styles={customStyles}
                                  options={this.state.statusArr}
                                  components={{
                                    DropdownIndicator,
                                    IndicatorSeparator: () => null,
                                  }}
                                  value={this.state.statusData}
                                  placeholder="Select"
                                  onChange={(value) => {
                                    this.onStatusChange(value);
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
                <div className="tab-app-information" id="tble-data-j">
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
                                Limited English Individual [LEI]{" "}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-8">
                              <div
                                class="dropdwn"
                                style={{ cursor: "pointer" }}
                              >
                                <Select
                                  styles={customStyles}
                                  options={this.state.leiArr}
                                  components={{
                                    DropdownIndicator,
                                    IndicatorSeparator: () => null,
                                  }}
                                  value={this.state.leiData}
                                  placeholder="Select"
                                  onChange={(value) => {
                                    this.onLeiChange(value);
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
        {/* ..................... */}
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
                          <span className="labelTxt">APPOINTMENT TYPE</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>
                            <Select
                              styles={customStyles}
                              options={this.state.appointmentTypeArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.appointmentTypeData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onAppointmentTypeChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-1"></div>
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">STATUS</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>
                            <Select
                              styles={customStyles}
                              options={this.state.statusArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.statusData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onStatusChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: "20px" }}>
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">SOURCE LANGUAGE</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>
                            <MultiSelectBox
                              optionData={this.state.languageArr}
                              value={this.state.sourceLangData}
                              onSelectChange={(value) =>
                                this.onSourceLangChange(value)
                              }
                            ></MultiSelectBox>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-1" />
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">TARGET LANGUAGE</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>
                            <MultiSelectBox
                              optionData={this.state.languageArr}
                              value={this.state.targetLangData}
                              onSelectChange={(value) =>
                                this.onTargetLangChange(value)
                              }
                            ></MultiSelectBox>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row" style={{ marginTop: "20px" }}>
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">APPOINTMENT DATE</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>

                            <div className="input-group jobDatepickerV2">
                              <div className="jobDatepickerInputTxtV2">
                                <span className="jobDatepickerInputTxt_span">
                                  <p className="jobDatepickerInputTxt_pTag">
                                    From
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
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "33px" }}>
                            <div className="input-group jobDatepickerV2">
                              <div className="jobDatepickerInputTxtV2">
                                <span className="jobDatepickerInputTxt_span">
                                  <p className="jobDatepickerInputTxt_pTag">
                                    To
                                  </p>{" "}
                                  <p className="jobDatepickerInputTxt_pTag">
                                    {this.state.toDate}
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
                                      this.toDateChange(date)
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
                    <div className="row" style={{ marginTop: "20px" }}>
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">Limited English Individual [LEI]</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>
                            <Select
                              styles={customStyles}
                              options={this.state.leiArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.leiData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onLeiChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-1" />
                      <div className="col-md-5">
                        <div className="">
                          {" "}
                          <span className="labelTxt">LEI'S DATE OF BIRTH</span>
                          <div className="dropdwn" style={{ cursor: "pointer", marginTop: "10px" }}>
                            <div className="input-group jobDatepickerV2">
                              <div className="jobDatepickerInputTxtV2">
                                <span className="jobDatepickerInputTxt_span">
                                  {this.state.leiDob}
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
                                      this.leiDobChange(date)
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
            </div>
          </div>
        </div>

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
