import React from 'react';
import { ImageName } from '../../../../enums';
import { CommonData, ErrorCode } from '../../../../services/constant';
import { MultiSelectBox, PaginationDropdown, SelectBox } from '../../../Admin/SharedComponents/inputText';
import Select, { components } from "react-select";
import { consoleLog, SetDatabaseDateFormat, SetDateFormat, SetUSAdateFormat } from '../../../../services/common-function';
import { Menu, MenuItem } from '@mui/material';
import { ApiCall, ApiCallClient } from '../../../../services/middleware';
import { Decoder } from '../../../../services/auth';
import { toast } from 'react-toastify';
import ViewCalender from '../../../ReactBigCalender/ViewCalender';

import $ from "jquery";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { timeValidator } from '../../../../validators';
import { styled } from "@mui/system";
import history from "../../../../history";
import LotteLoader from '../../../Loader/LotteLoader';
import { COMMON } from '../../../../services/constant/connpmData';
import ClientStatusList from './ClientStatusList';


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
  searchTo: "",
  searchFrom: "",
  leiDob: "",
  status: "",
  requester: "",
  leiId: "",
  orderby: "",
  direc: "",
  rfqId: "",
  tabType: "5",
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

export default class HistoryJobs extends React.Component {
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
      isLoad: true,
    }
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
      tabType: "5",
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
    let returnData = Object.assign(reqData, fetchData);
    this.listApi(returnData);

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
    const res = await ApiCallClient("getJobList", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      // consoleLog("Assigned:::", decodeData.data);
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

  // This is goes to the previous page
  exLeft = () => {
    this.setState({
      current_page: 1,
      isLoad : true
    });
    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      tabType: "5",
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
      tabType: "5",
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
        tabType: "5",
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
        tabType: "5",
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
      tabType: "5",
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

  goEditHistory = () => {
    let value = this.props.historyData;
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
      tabType: "5",
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
    let value = this.props.historyData;
    this.setState({
      curIndex: val.curIndex,
    });

    value.history.push({
      pathname: "/clientJobDetails",
      state: this.state.calenderData[val.curIndex].id,
    });
  };

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
      tabType: "5",
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
      tabType: "5",
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
  requesterChange = (val) => {
    this.setState({
      selectedRequester: val,
    });
  };

  goToFollowUpPage = () => {
    return history.push({
      pathname: "/clietFollowUpAppointment",
      state: this.state.listData[this.state.curIndex].id,
    });
  }


  render() {

    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <React.Fragment>

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
                          <th style={{ width: "10%" }}>Job Type</th>
                          <th style={{ width: "10%" }}>Appointment Type</th>
                          <th style={{ width: "15%" }}>Date & Time</th>
                          <th style={{ width: "15%" }}>Location</th>
                          <th style={{ width: "15%" }}>
                            Language{" "}
                          </th>

                          <th style={{ width: "8%" }}>Status</th>
                          <th style={{ width: "5%" }}>Action</th>
                        </tr>
                        {this.state.listData.length > 0 ? (
                          <React.Fragment>
                            {this.state.listData.map((item, key) => (
                              <tr>
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

                                          <td style={{ width: "10%" }}>
                                            {item.jobType}
                                          </td>
                                          <td style={{ width: "10%" }}>

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
                                          <td style={{ width: "8%" }}>
                                            <ClientStatusList value={item} />
                                          </td>
                                          <td style={{ width: "5%" }}>

                                            <React.Fragment>
                                              <img
                                                src={ImageName.IMAGE_NAME.MENU_VERTICAL}
                                                style={{
                                                  cursor: "pointer",
                                                }}
                                                id={"basic-button" + key}
                                                aria-controls={"basic-menu" + key}
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
                                                  "aria-labelledby": "basic-button" + key,
                                                }}
                                              >
                                                <MenuItem
                                                  onClick={this.goEditHistory}
                                                >
                                                  View Details
                                                </MenuItem>
                                                <MenuItem onClick={() => this.goToFollowUpPage()}>Follow up</MenuItem>
                                                {/* <MenuItem
                                          onClick={() =>
                                            this.goEdit()
                                          }
                                        >
                                          Connect
                                        </MenuItem>
                                        <MenuItem>Follow Up</MenuItem>
                                        <MenuItem>Set as Recurring</MenuItem>
                                        <MenuItem>Chat</MenuItem> */}
                                                {/* <MenuItem
                                          onClick={
                                            this.declineModal
                                          }
                                        >
                                          Cancel
                                        </MenuItem> */}
                                              </StyledMenu>
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
                        <li className="active" data-related="tble-data-d">
                          Appointment Type
                        </li>
                        <li data-related="tble-data-e">Language</li>
                        <li data-related="tble-data-f">Requester</li>
                        {/* <li data-related="tble-data-g">No. of Interpreters</li> */}
                        <li data-related="tble-data-h">Date</li>
                        <li data-related="tble-data-i">Status</li>
                        <li data-related="tble-data-j">
                          Limited English Individual [LEI]
                        </li>
                        {/* <li data-related="tble-data-k">Industry Type</li> */}
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

                                  {/* ...................... */}

                                  {/* <div className="col-md-5">
                                  <div
                                    class="lable-text"
                                    style={{ fontSize: "20px" }}
                                  >
                                    SOURCE LANGUAGE
                                  </div>
                                </div>
                                <div className="col-md-1"></div>
                                <div className="col-md-5">
                                  {" "}
                                  <div
                                    class="lable-text"
                                    style={{ fontSize: "20px" }}
                                  >
                                    TARGET LANGUAGE
                                  </div>
                                </div> */}
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
                  {/* <div className="tab-app-information" id="tble-data-g">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">
                              No. of Interpreters{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
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
                                        // minDate={new Date()}
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
      </React.Fragment>
    )
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
