import React from "react";
import { AlertMessage, ImageName } from "../../../../enums";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { PaginationDropdown, MultiSelectBox, SelectBox } from "../../../Admin/SharedComponents/inputText";
import Select, { components } from "react-select";
import { consoleLog, SetDatabaseDateFormat, SetDateFormat, SetDOBFormat, SetScheduleDate, SetTimeFormat, SetUSAdateFormat } from "../../../../services/common-function";
import { Menu, MenuItem, modalClasses } from "@mui/material";
import { ApiCall, ApiCallClient } from "../../../../services/middleware";

import { toast } from "react-toastify";
import { Decoder } from "../../../../services/auth";
import ViewCalender from "../../../ReactBigCalender/ViewCalender";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { inputEmptyValidate, timeValidator } from "../../../../validators";

import $ from "jquery";
import LotteLoader from "../../../Loader/LotteLoader";
import { COMMON } from "../../../../services/constant/connpmData";
import ClientStatusList from "./ClientStatusList";


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
  searchto: "",
  scheduleDate: "",
  scheduleTime: "",
  status: "",
  requester: "",
  leiId: "",
  orderby: "",
  direc: "",
  rfqId: "",
  tabType: "3",
  appointmentTypeId: "",
  sourceLang: [],
  targetLang: [],

};
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

export default class AssignedJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curIndex: 0,
      current_page: 1,
      total_page: 10,
      limit: 20,
      anchorEl: null, //menu button
      anchorEl1: null,
      cancellationData: {},
      rescheduledCheck: null,
      isSelected: null,
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      otherReason: "",
      appointmentDate: "",
      hour: "00",
      min: "00",
      ampm: "AM",
      isOtherReason: false,
      rescheduleNote: "",

      listData: [],
      isCalender: false,
      calenderData: [],
      // ......filter............
      appointmentTypeArr: [],
      appointmentTypeData: {},
      targetLangData: [],
      sourceLangData: [],
      requesterArr: [],
      selectedRequester: {},
      sourceLangId: [],
      targetLangId: [],
      languageArr: [],
      leiArr: [],
      leiData: {},
      statusArr: [],
      statusData: {},
      formDate: "",
      toDate: "",
      leiDob: "",
      isLoad: true
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
    var classInstance = this;
    document.getElementById("backdrop").style.display = "none";

    var modal = document.getElementById("decline-model");
    var filterModal = document.getElementById("filter-model");

    window.onclick = function (event) {
      if (event.target == modal) {
        classInstance.closeDeclineModal();
      } else if (event.target == filterModal) {
        classInstance.closeModal();
      }
    };
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
      languageObjId = [],
      languageResArrData = [],
      industryDataArr = [],
      appointmentDataArr = [],
      industryArr = [],
      appointmentArr = [],
      leiDataArr = [],
      leiArr = [],

      requesterResData = [],
      requesterArrData = [],
      statusDataArr = [];

    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      tabType: "3",
      searchTo: "",
      searchFrom: "",
      leiDob: "",
      status: "",
      requester: "",
      leiId: "",
      orderby: "",
      direc: "",
      rfqId: "",
      appointmentTypeId: "",
      sourceLang: [],
      targetLang: [],
    };
    this.listApi(fetchData);

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
      let payload = await Decoder.decode(lookupres.data.payload);

      industryDataArr = payload.data.lookupdata.INDUSTRY_TYPE;

      appointmentDataArr = payload.data.lookupdata.SCHEDULE_TYPE;

      consoleLog("lookup::", payload.data.lookupdata);

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
      let payload = await Decoder.decode(leiRes.data.payload);

      leiDataArr = payload.data.leiList;
      consoleLog("all lei::", leiDataArr);
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

    // ...................requester,,,,,,,,,,,,,,,,,,

    let requesterRes = await ApiCall("fetchAllRequester");
    if (
      requesterRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      requesterRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let requestPayload = await Decoder.decode(requesterRes.data.payload);

      // consoleLog("requestArr::", requestPayload);
      requesterResData = requestPayload.data.requesterList;
      if (requesterResData.length > 0) {
        requesterResData.map((obj) => {
          requesterArrData.push({
            label: obj.name,
            value: obj.userId,
          });
        });
      }
    }

    this.setState({
      clientArr: clientDataArr,
      sourceLangData: languageObjData,
      targetLangData: languageObjData,
      languageArr: languageArrData,
      requesterArr: requesterArrData,
      // sourceLangId:languageObjId,
      // targetLangId:languageObjId,
      industryArr: industryArr,
      appointmentTypeArr: appointmentArr,
      statusArr: COMMON.CLIENT_JOB_STATUS,
      leiArr: leiArr,
      // isLoad: false,
    });
  }

  listApi = async (data) => {
    // consoleLog("req data::", data)
    const res = await ApiCallClient("getJobList", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      // consoleLog("Assigned all data:::", decodeData.data);
      let listDetails = [];
      if (decodeData.data.jobList.length > 0) {
        listDetails = decodeData.data.jobList;
      }
      let totalPage = Math.ceil(
        decodeData.data.jobCount / parseInt(this.state.limit)
      );
      this.setState({
        listData: listDetails,
        total_page: totalPage,
        totalJob: decodeData.data.jobCount,
        isLoad: false
      });
    }
  }


  // ...................modal functionality..........................
  openModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("filter-model").style.display = "block";
    document.getElementById("filter-model").classList.add("show");
  };
  closeModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("filter-model").style.display = "none";
    document.getElementById("filter-model").classList.remove("show");
  };

  openDeclineModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("decline-model").style.display = "block";
    document.getElementById("decline-model").classList.add("show");
  };

  closeDeclineModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("decline-model").style.display = "block";
    document.getElementById("decline-model").classList.add("show");
  }

  //................funct for menuBtn on click................
  menuBtnhandleClick = (index, event) => {
    consoleLog("curIndex::", index)

    this.setState({
      curIndex: index,
      anchorEl: event.currentTarget,
    });
  };
  // menuBtnhandleClick_b = (index, event) => {

  //   this.setState({
  //     curIndex: index,
  //     anchorEl1: event.currentTarget,
  //   });
  // };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
      anchorEl1: null,
    });
  };

  // This is goes to the previous page
  exLeft = () => {
    this.setState({
      current_page: 1,
      isLoad : true
    });
    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      tabType: "3",
      searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
      orderby: "",
      direc: "",
      rfqId: this.state.id,
      sourceLang: this.state.sourceLangId,
      targetLang: this.state.targetLangId,
      requester:
        this.state.selectedRequester.value == null ||
          this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
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
  };

  // This is goes to the last page
  exRigth = () => {
    let totalPage = this.state.total_page;
    this.setState({
      current_page: totalPage,
      isLoad : true
    });
    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit),
      tabType: "3",
      searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
      orderby: "",
      direc: "",
      rfqId: this.state.id,
      sourceLang: this.state.sourceLangId,
      targetLang: this.state.targetLangId,
      requester:
        this.state.selectedRequester.value == null ||
          this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
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
  };

  // This is goes to the first page
  prev = () => {
    let currentPage = this.state.current_page;
    if (currentPage > 1) {
      currentPage--;
      this.setState({
        current_page: currentPage,
        isLoad : true
      });
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((currentPage - 1) * this.state.limit),
        tabType: "3",
        searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),

        orderby: "",
        direc: "",
        rfqId: this.state.id,
        sourceLang: this.state.sourceLangId,
        targetLang: this.state.targetLangId,
        requester:
          this.state.selectedRequester.value == null ||
            this.state.selectedRequester.value == undefined
            ? ""
            : this.state.selectedRequester.value,
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
  };

  // This is goes to the next page
  next = () => {
    let currentPage = this.state.current_page;
    let totalPage = this.state.total_page;
    if (currentPage < totalPage) {
      currentPage++;
      this.setState({
        current_page: currentPage,
        isLoad : true
      });
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((currentPage - 1) * this.state.limit),
        tabType: "3",
        searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
        orderby: "",
        direc: "",
        rfqId: this.state.id,
        sourceLang: this.state.sourceLangId,
        targetLang: this.state.targetLangId,
        requester:
          this.state.selectedRequester.value == null ||
            this.state.selectedRequester.value == undefined
            ? ""
            : this.state.selectedRequester.value,
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
  };

  //........Page show Limit.........

  onChangeLimit = (value) => {
    this.setState({
      limit: parseInt(value.value),
      selectedDisplayData: value,
      current_page: 1,
      isLoad : true
    });

    let limit = value.value;

    let data = {
      limit: limit,
      offset: "0",
      tabType: "3",
      searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
      orderby: "",
      direc: "",
      rfqId: this.state.id,
      sourceLang: this.state.sourceLangId,
      targetLang: this.state.targetLangId,
      requester:
        this.state.selectedRequester.value == null ||
          this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
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
  };

  // ......................for decline modal...........................
  declineModal = () => {
    this.openDeclineModal();
    this.handleMenuClose();
  };

  onDeclineSubmit = async () => {
    let errorCount = 0;

    let validateCancelReason = inputEmptyValidate(this.state.cancellationData.value);
    let validateDate = inputEmptyValidate(this.state.appointmentDate);
    let validateOtherReason = inputEmptyValidate(this.state.otherReason);

    consoleLog("----->", validateCancelReason)
    // if (validateInterpretationFee === false) {
    if (validateCancelReason === false) {
      toast.error(AlertMessage.MESSAGE.JOB.EMPTY_MAIN_REASON, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateOtherReason == false && this.state.cancellationData.value == 6) {
      toast.error(AlertMessage.MESSAGE.JOB.EMPTY_MAIN_REASON, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateDate == false && this.state.cancellationData.value == 1 && this.state.isSelected == "true") {
      toast.error(AlertMessage.MESSAGE.JOB.EMPTY_DATE, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (Number(this.state.hour) > 12 && this.state.cancellationData.value == 1 && this.state.isSelected == "true") {
      toast.error("Hour cannot be set greater than 12 in appointment time");
      errorCount++;
    } else if (Number(this.state.min) > 59 && this.state.cancellationData.value == 1 && this.state.isSelected == "true") {
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
        rescheduleDate: this.state.appointmentDate == "" ? "" : SetDatabaseDateFormat(this.state.appointmentDate),
        rescheduleTime: dt == "00:00" ? "" : dt + ":00",
        scheduleNote: this.state.rescheduleNote
      };

      consoleLog("data::", data)
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

  declineClose = () => {
    this.setState({
      declineMessage: "",
    });
    this.closeDeclineModal();
  };

  goEditAssign = (index) => {

    let value = this.props.valueData

    value.history.push({
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
      tabType: "3",
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
      consoleLog("DecodeData::", decodeData.data)
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
      toast.error("Calender Not Loaded...")
    }
  };
  detailJob = (val) => {
    // consoleLog("Calender Click", value);
    let value = this.props.valueData
    this.setState({
      curIndex: val.curIndex,
    });

    value.history.push({
      pathname: "/clientJobDetails",
      state: this.state.calenderData[val.curIndex].id,
    });
  };
  onOtherReasonChange = (e) => {
    this.setState({
      otherReason: e.target.value,
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
      isSelected: e.target.value
    })
  }
  appointmentdateChange = (date) => {
    this.setState({
      appointmentDate: SetUSAdateFormat(date),
    });
    // consoleLog("Date::", date)
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
  hourInputChange = (e) => {
    if (timeValidator(e.target.value)) {
      this.setState({
        hour: e.target.value,
      });
    }
  };
  minInputChange = (e) => {
    if (timeValidator(e.target.value)) {
      this.setState({
        min: e.target.value,
      });
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
  onRescheduleNote = (e) => {
    this.setState({
      rescheduleNote: e.target.value,
    });
  };

  declineClose = () => {
    consoleLog("close")
    this.setState({
      declineMessage: "",
    });
    this.closeDeclineModal();
  };
  filterModal = () => {
    this.openModal();
    this.handleMenuClose();
  };
  onResetFilter = () => {

    this.resetData();
    this.setState({
      current_page: 1,
      isLoad: true
    });

    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      status: "",
      orderby: "",
      direc: "",
      tabType: "3",
      searchFrom: "",
      searchTo: "",
      leiDob: "",
      scheduleDate: "",
      requester: "",
      // scheduleTime: dt + ":00",
      scheduleTime: "",
      rfqId: "",
      appointmentTypeId: "",
      sourceLang: [],
      targetLang: [],
    };

    // consoleLog("req filter data::", fetchData);
    this.listApi(fetchData);


    this.closeFilterModal();
  };
  onFilterApply = () => {
    this.setState({
      isLoad: true
    })
    let modHour =
      this.state.hour_fiter +
      ":" +
      this.state.min_filter +
      " " +
      this.state.ampm_filter;
    var dt = moment(modHour, ["h:mm A"]).format("HH:mm");

    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      tabType: "3",
      searchTo: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchFrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      leiDob: this.state.leiDob == "" ? "" : SetDatabaseDateFormat(this.state.leiDob),
      requester:
        this.state.selectedRequester.value == null ||
          this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
      scheduleTime: "",

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

    // console.log("Filter data", data)
    this.closeFilterModal();

    this.setState({
      current_page: 1,
    });

  };
  closeFilterModal = () => {
    this.closeModal();
  };
  resetData = () => {
    this.setState({
      formDate: "",
      toDate: "",
      leiDob: "",
      appointmentTypeData: {},
      selectedRequester: {},
      sourceLangData: [],
      targetLangData: [],
      sourceLangId: [],
      targetLangId: [],
      formDate: "",
      statusData: {},
      leiData: {},
      clientData: {},
      id: "",
    });
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

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    const open1 = Boolean(this.state.anchorEl1);
    return (
      <React.Fragment>
        <div hidden={!this.state.isLoad}>
          <LotteLoader />
        </div>
        <div hidden={this.state.isLoad}>

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

          {this.state.isCalender ?
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
            :
            <React.Fragment>

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
                        <th style={{ width: "10%" }}>Requester</th>
                        <th style={{ width: "9%" }}>Job Type</th>
                        <th style={{ width: "9%" }}>Appointment Type</th>
                        <th style={{ width: "15%" }}>Date & Time</th>
                        <th style={{ width: "15%" }}>Location</th>
                        <th style={{ width: "15%" }}>
                          Language{" "}
                        </th>

                        <th style={{ width: "10%" }}>Status</th>
                        <th style={{ width: "5%" }}>Action</th>
                      </tr>
                      {this.state.listData.length > 0 ? (
                        <React.Fragment>
                          {this.state.listData.map((item, key1) => (
                            <tr key={key1}>
                              <td colspan="9">
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
                                        <td style={{ width: "10%" }}>
                                          {item.requestor}
                                        </td>

                                        <td style={{ width: "9%" }}>
                                          {item.jobType}
                                        </td>
                                        <td style={{ width: "9%" }}>

                                          {item.appointmentTypeName === "F2F" ? (
                                            <img
                                              src={
                                                ImageName.IMAGE_NAME.F2F
                                              }
                                              height="35px"
                                              width="35px"
                                              style={{ float: "Center" }}
                                            />
                                          ) : item.appointmentTypeName ===
                                            "OPI" ? (
                                            <img
                                              src={
                                                ImageName.IMAGE_NAME
                                                  .OPI_ICON
                                              }
                                              height="35px"
                                              width="35px"
                                              style={{ float: "Center" }}
                                            />
                                          ) : (
                                            <img
                                              src={
                                                ImageName.IMAGE_NAME
                                                  .VRI_ICON
                                              }
                                              height="35px"
                                              width="35px"
                                              style={{ float: "Center" }}
                                            />
                                          )}
                                        </td>
                                        <td style={{ width: "15%" }}>
                                          {SetDateFormat(item.date)}
                                          {"|"}
                                          {item.time}
                                        </td>
                                        <td style={{ width: "15%" }}>
                                          {item.location === "" ? "N/A" : item.location}
                                        </td>
                                        <td style={{ width: "15%" }}>
                                          {item.sourceLanguage} {">"}
                                          {<br />}
                                          {item.targetLanguage}
                                        </td>
                                        {/* <td style={{ width: "8%" }}></td> */}
                                        <td style={{ width: "10%" }}>

                                          <ClientStatusList value={item} />
                                        </td>
                                        <td style={{ width: "5%" }}>

                                          <React.Fragment>
                                            <img
                                              src={
                                                ImageName.IMAGE_NAME
                                                  .MENU_VERTICAL
                                              }
                                              style={{
                                                cursor: "pointer",
                                              }}
                                              id={"basic-button" + key1}
                                              aria-controls={"basic-menu" + key1}
                                              aria-haspopup="true"
                                              aria-expanded={
                                                open ? "true" : undefined
                                              }
                                              onClick={(e) =>
                                                this.menuBtnhandleClick(
                                                  key1,
                                                  e
                                                )
                                              }
                                            />
                                            <Menu
                                              id={"basic-menu" + key1}
                                              anchorEl={
                                                this.state.anchorEl
                                              }
                                              open={open}
                                              onClose={
                                                this.handleMenuClose
                                              }
                                              MenuListProps={{
                                                "aria-labelledby":
                                                  "basic-button" + key1,
                                              }}
                                            >
                                              <MenuItem
                                                onClick={() => this.goEditAssign(key1)}
                                              >
                                                View Details
                                              </MenuItem>
                                              {/* <MenuItem

                                        >
                                          Connect
                                        </MenuItem>
                                        <MenuItem>Follow Up</MenuItem>
                                        <MenuItem>Set as Recurring</MenuItem>
                                        <MenuItem>Chat</MenuItem> */}
                                              <MenuItem
                                                onClick={
                                                  this.declineModal
                                                }
                                              >
                                                Cancel
                                              </MenuItem>
                                            </Menu>
                                          </React.Fragment>

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
                            <td colSpan="9">
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
            </React.Fragment>
          }

          <React.Fragment>
            <div className="table-filter-app">
              {!this.state.isCalender ?
                <React.Fragment>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="cus-filter-btn">
                        <button className="button" onClick={this.openTable}>
                          <img src={ImageName.IMAGE_NAME.MENU_BTN} />
                        </button>
                        <button className="button" onclick={this.openCalender}>
                          <img src={ImageName.IMAGE_NAME.MENU_BTN_TWO} />
                        </button>

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
                </React.Fragment> :
                <React.Fragment>
                  {/* <div className="row">
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
                    </div> */}
                </React.Fragment>}
            </div>
          </React.Fragment>
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
                      <li data-related="tble-data-f">Requester</li>
                      <li data-related="tble-data-h">Date</li>
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
                <div className="tab-app-information" id="tble-data-h">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div
                            className="form-search-app"
                            style={{ paddingLeft: "30px" }}
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
                                      maxDate={new Date()}
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
                    <div className="row" style={{ marginTop: "20px" }}>
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
                                      checked={
                                        this.state.isSelected === "true"
                                      }
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
                                      checked={
                                        this.state.isSelected == "false"
                                      }

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
                            hidden={this.state.isSelected == "true" ? false : true}
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
                            hidden={this.state.isSelected == "true" ? false : true}
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
