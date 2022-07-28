import React, { Component } from "react";
import { styled, Box } from "@mui/system"; //imported for modal
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
  MultiSelectBox,
} from "../../SharedComponents/inputText";
import $ from "jquery";
import "./clientRfqList.css";

import { AlertMessage, ImageName } from "../../../../enums";
import { ApiCall } from "../../../../services/middleware";
import { CryptoDecoder, Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";

import DatePicker from "react-datepicker";

import { inputEmptyValidate } from "../../../../validators";
import { APP_URL, Regex } from "../../../../services/config";
import Select, { components } from "react-select";
import {
  consoleLog,
  getClientInfo,
  SetDateFormat,
  SetDOBFormat,
  SetScheduleDate,
  SetTimeFormat,
  SetUSAdateFormat,
} from "../../../../services/common-function";
import moment from "moment";
import { Link } from "react-router-dom";
import { Functions } from "@mui/icons-material";
import axios from "axios";

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
const projectcancelationArr = [
  // {
  //   label: "Last minute reschedule ",
  //   value: "1",
  // },
  {
    label: "Duplicate/Error ",
    value: "2",
  },
  {
    label: "Consumer No Show",
    value: "3",
  },
  // {
  //   label: "Interpreter No Show",
  //   value: "4",
  // },
  // {
  //   label: "Other Service being utilized",
  //   value: "5",
  // },
 
];


const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={ImageName.IMAGE_NAME.LOCATION} style={{ width: "17px" }} />
    </components.DropdownIndicator>
  );
};

const statusArr = [
  {
    label: "Pending",
    value: "0",
  },
  {
    label: "Cancelled",
    value: "2",
  },
];
const jobStatusArr = [
  {
    label: "All",
    value: "1",
  },
  {
    label: "Completed",
    value: "2",
  },
];

const contractTypeArr = [
  {
    label: "Contract",
    value: "1",
  },
  {
    label: "Non-Contract",
    value: "0",
  },
];

const reqData = {
  direc: "",
  orderby: "",
  searchto: "",
  searchfrom: "",
  clientId: "",
  limit: "",
  offset: "",
  status: "",
  serviceType: "",
  rfqId: "",
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

export default class ClientRfqList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInterpretation: true,
      isTranslation: false,
      isTraining: false,
      isLoad: true,

      current_page: 1,
      total_page: 20,
      limit: 20,
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      // ....translation......
      translation_current_page: 1,
      translation_total_page: 20,
      translation_limit: 20,
      translation_selectedDisplayData: {
        label: "20",
        value: "20",
      },

      //.....training.......
      training_current_page: 1,
      training_total_page: 20,
      training_limit: 20,
      training_selectedDisplayData: {
        label: "20",
        value: "20",
      },

      // .......................
      display: "",
      name: "",
      email: "",
      mobile: "",
      departmentId: "",
      serviceArr: [],
      serviceData: [],
      roleId: "",
      clientId: "",
      clientData: {},
      filterStatusArr: [],
      statusData: {},
      switch: false,
      anchorEl: null, //menu button
      anchorEl1: null, //menu button
      anchorEl2: null, //menu button

      anchorEl_cancel: null, //menu button
      anchorEl1_cancel: null, //menu button
      anchorEl2_cancel: null,
      openModal: false, // open decline modal false
      rescheduledCheck: null,
      isSelected: null,

      curIndex: 0,
      formDate: "",
      toDate: "",
      filterTrainingCategory: "",
      filterStatus: "",
      departmentData: {
        label: "",
        value: "",
      },

      filterRoleData: { label: "", value: "" },

      listData: [],
      translationData: [],
      trainingData: [],
      cancellationData: {},
      otherReason: "",
      appointmentDate: "",
      hour: "08",
      min: "00",
      ampm: "AM",
      isOtherReason: false,
      rescheduleNote: "",

      // .......
      id: "",
      allClientArr: [],
      selectedClient: {},
      // .....interpretation ........

      appointmentTypeArr: [],
      appointmentTypeData: {},
      targetLangData: [],
      targetLangId: [],
      languageArr: [],
      requesterArr: [],
      selectedRequester: {},
      locationArr: [],
      locationData: {},
      leiData: {},
      locationDataTxt: "",

      // .....translation......
      allServiceTypeArr: [],
      selectedServiceType: [],
      selectedServiceTypeId: [],
      sourceLangId: [],
      sourceLangData: [],

      // ........training,,,,,,,
      trainingCategoryArr: [],
      selectedTrainingCategory: {},
      courseArr: [],
      selectedCourse: {},
      formatTypeArr: [],
      selectedFormat: {},
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    // window.location.reload();
    document.getElementById("backdrop").style.display = "none";

    var classInstance = this;

    var filterModal = document.getElementById("filter-model");
    var translationModal = document.getElementById("translation-model");
    var trainingModal = document.getElementById("training-model");
    var declineModal = document.getElementById("decline-model");
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      // if (
      //   event.target == filterModal ||
      //   event.target == passwordModal ||
      //   event.target == deleteModal ||
      //   event.target == declineModal
      // ) {
      //   classInstance.closeModal();
      // }

      if (event.target == filterModal) {
        classInstance.closeFilterModal();
      } else if (event.target == declineModal) {
        classInstance.closeDeclineModal();
      } else if (event.target == translationModal) {
        classInstance.closeTranslationModal();
      } else if (event.target == trainingModal) {
        classInstance.closeTrainingModal();
      }
    };

    window.$(".verificaiton-doc-tab ul li").on("click", function () {
      $(".verificaiton-doc-tab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
    });
    window.$(".filterTab ul li").on("click", function () {
      $(".filterTab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk1");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk1");
    });
    window.$(".filterTab_translation ul li").on("click", function () {
      $(".filterTab_translation ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnkTranslation");
      $("div[id=" + $(this).attr("data-related") + "]").addClass(
        "activeLnkTranslation"
      );
    });
    window.$(".filterTab_training ul li").on("click", function () {
      $(".filterTab_training ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnkTraining");
      $("div[id=" + $(this).attr("data-related") + "]").addClass(
        "activeLnkTraining"
      );
    });

    this.load();
  }

  load = async () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom: "",
      clientId: "",
      status: "",
      serviceType: "",
      rfqId: "",
      appointmentTypeId: "",
      requester: "",
      location: "",
      language: [],
      jobId: "",
      leiId: "",
    };
    this.listApi(data);

    // ................client dropdown ,,,,,,,,,,,,,,,,,,,,

    // ..................variables.for interpretation filter................

    let appointmentDataArr = [],
      languageArrData = [],
      languageResArrData = [],
      leiDataArr = [],
      leiArr = [],
      requesterResData = [],
      requesterArrData = [],
      clientDataArr = await getClientInfo(),
      appointmentArr = [],
      formatMainArr = [],
      allCategoryType = [],
      courseArrData = [],
      allTranslationService = [];

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

      appointmentDataArr = payload.data.lookupdata.SCHEDULE_TYPE;

      let formatDataArr = payload.data.lookupdata.COURSE_FORMAT_TYPE;

      // consoleLog("lookup::", payload.data.lookupdata.COURSE_FORMAT_TYPE);
      formatDataArr.map((obj) => {
        formatMainArr.push({
          label: obj.name,
          value: obj.id,
        });
      });

      // consoleLog("lookup::", payload.data.lookupdata);

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

    // .....................lei,,,,,,,,,,,,,,,,,,,,,,,
    let leiRes = await ApiCall("getAllLeiList");
    if (
      leiRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      leiRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(leiRes.data.payload);

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

    // ..................translation filter Functions,,,,,,,,,,,,,,,,,,,,

    // .....service type,,,,,,,,,,,,,,,,,,,,

    axios.post(APP_URL.VENDOR_SERVICE_OFFERED).then((res) => {
      // console.log("RES>>>>", res);
      let respObject = res.data;
      if (
        respObject.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        respObject.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let payload = Decoder.decode(respObject.data.payload);
        // console.log("service response payload>>>", payload);
        if (payload.data) {
          if (payload.data.services) {
            if (payload.data.services.length > 0) {
              payload.data.services.map((ser) => {
                if (
                  ser.id === 46 &&
                  ser.name === "Translation" &&
                  ser.subItem.length > 0
                ) {
                  ser.subItem.map((item) => {
                    allTranslationService.push({
                      label: item.subItemName,
                      value: item.id,
                    });
                  });
                  // console.log("ARRAY>>>",allTranslationService )

                  this.setState({
                    allServiceTypeArr: allTranslationService,
                  });
                }
              });
            }
          }
        }
      }
    });

    // ...........training function,,,,,,,,,,,,,,,,,,,

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
      console.log("resData>>>", payload);
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

    // ....................training filter function,,,,,,,,,,,,,,,,,,,,,

    this.setState({
      appointmentTypeArr: appointmentArr,
      languageArr: languageArrData,
      leiArr: leiArr,
      requesterArr: requesterArrData,
      allClientArr: clientDataArr,
      trainingCategoryArr: allCategoryType,
      formatTypeArr: formatMainArr,
      courseArr: courseArrData,
    });
  };

  listApi = async (data) => {
    consoleLog("reqData::interpretation::", data);
    const res = await ApiCall("getPendingInterpretationRFQList", data);

    //
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      // console.log("inter data>>>", decodeData);
      let totalPage = Math.ceil(
        decodeData.data.projectCount / this.state.limit
      );
      consoleLog("InterpretationtotalPage>>>", decodeData.data);
      if (decodeData.data.projectList.length > 0) {
        this.setState({
          listData: decodeData.data.projectList,
          total_page: totalPage,
        });
      } else {
        this.setState({
          listData: [],
        });
      }
    }
    // ....................translation..........................
  };

  // .........................translation list api,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

  getTranslationList = async (data) => {
    consoleLog("req:::translation",data)
    const translationRes = await ApiCall("getPendingTranslationRFQList", data);
    if (
      translationRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      translationRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const translationData = Decoder.decode(translationRes.data.payload);
      // console.log("translation data>>>", translationData);
      let totalPage = Math.ceil(
        translationData.data.projectCount / this.state.translation_limit
      );
      consoleLog("TranslationTotalPage>>>", translationData.data);
      if (translationData.data.projectList.length > 0) {
        this.setState({
          translationData: translationData.data.projectList,
          translation_total_page: totalPage,
        });
      } else {
        this.setState({
          translationData: [],
        });
      }
    }
  };

  getTrainingList = async (data) => {
    consoleLog("req:::training",data)
    // ....................training..........................
    const trainingRes = await ApiCall("getPendingTrainingRFQList", data);
    if (
      trainingRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      trainingRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const trainingData = Decoder.decode(trainingRes.data.payload);
      // console.log("training data>>>", trainingData);
      //  let traininglistDetails = trainingData.data.projectList;
      let totalPage = Math.ceil(
        trainingData.data.projectCount / this.state.training_limit
      );
      console.log("Total training Page>>>", trainingData.data);
      if (trainingData.data.projectList.length > 0) {
        this.setState({
          trainingData: trainingData.data.projectList,
          training_total_page: totalPage,
        });
      } else {
        this.setState({
          trainingData: [],
        });
      }
    }
  };

  // ............................interpretation............................
  //........Page show Limit.........

  onChangeLimit = async (dat) => {
    this.setState({
      limit: parseInt(dat.value),
      selectedDisplayData: dat,
      current_page: 1,
    });

    let fetchData = {
      limit: dat.value,
      offset: "0",
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom:
        this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      clientId:
        this.state.selectedClient.value == null ||
        this.state.selectedClient.value == undefined
          ? ""
          : this.state.selectedClient.value,
      status:
        this.state.statusData.value == null ||
        this.state.statusData.value == undefined
          ? ""
          : this.state.statusData.value,
      serviceType: "",
      rfqId: this.state.id,
      appointmentTypeId:
        this.state.appointmentTypeData.value == null ||
        this.state.appointmentTypeData.value == undefined
          ? ""
          : this.state.appointmentTypeData.value,
      requester:
        this.state.selectedRequester.value == null ||
        this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
      location:
        this.state.locationDataTxt == null ||
        this.state.locationDataTxt == undefined
          ? ""
          : this.state.locationDataTxt,
      language: this.state.targetLangId,
      jobId: "",
      leiId:
        this.state.leiData.value == null ||
        this.state.leiData.value == undefined
          ? ""
          : this.state.leiData.value,
    };

    this.listApi(fetchData);
  };

  clickChange = (e) => {
    this.setState({
      current_page: e.target.value,
    });
  };

  // This is goes to the previous page
  exLeft = async () => {
    this.setState({
      current_page: 1,
    });
    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom:
        this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      clientId:
        this.state.selectedClient.value == null ||
        this.state.selectedClient.value == undefined
          ? ""
          : this.state.selectedClient.value,
      status:
        this.state.statusData.value == null ||
        this.state.statusData.value == undefined
          ? ""
          : this.state.statusData.value,
      serviceType: "",
      rfqId: this.state.id,
      appointmentTypeId:
        this.state.appointmentTypeData.value == null ||
        this.state.appointmentTypeData.value == undefined
          ? ""
          : this.state.appointmentTypeData.value,
      requester:
        this.state.selectedRequester.value == null ||
        this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
      location:
        this.state.locationDataTxt == null ||
        this.state.locationDataTxt == undefined
          ? ""
          : this.state.locationDataTxt,
      language: this.state.targetLangId,
      jobId: "",
      leiId:
        this.state.leiData.value == null ||
        this.state.leiData.value == undefined
          ? ""
          : this.state.leiData.value,
    };

    this.listApi(fetchData);
  };

  // This is goes to the last page
  exRigth = async () => {
    let totalPage = this.state.total_page;
    // consoleLog("totalPage", totalPage);
    this.setState({
      current_page: parseInt(totalPage),
    });

    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit),
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom:
        this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      clientId:
        this.state.selectedClient.value == null ||
        this.state.selectedClient.value == undefined
          ? ""
          : this.state.selectedClient.value,
      status:
        this.state.statusData.value == null ||
        this.state.statusData.value == undefined
          ? ""
          : this.state.statusData.value,
      serviceType: "",
      rfqId: this.state.id,
      appointmentTypeId:
        this.state.appointmentTypeData.value == null ||
        this.state.appointmentTypeData.value == undefined
          ? ""
          : this.state.appointmentTypeData.value,
      requester:
        this.state.selectedRequester.value == null ||
        this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
      location:
        this.state.locationDataTxt == null ||
        this.state.locationDataTxt == undefined
          ? ""
          : this.state.locationDataTxt,
      language: this.state.targetLangId,
      jobId: "",
      leiId:
        this.state.leiData.value == null ||
        this.state.leiData.value == undefined
          ? ""
          : this.state.leiData.value,
    };
    // console.log("fecthData>>>", fetchData);

    this.listApi(fetchData);
  };

  // This is goes to the first page
  prev = async () => {
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
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom:
        this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      clientId:
        this.state.selectedClient.value == null ||
        this.state.selectedClient.value == undefined
          ? ""
          : this.state.selectedClient.value,
      status:
        this.state.statusData.value == null ||
        this.state.statusData.value == undefined
          ? ""
          : this.state.statusData.value,
      serviceType: "",
      rfqId: this.state.id,
      appointmentTypeId:
        this.state.appointmentTypeData.value == null ||
        this.state.appointmentTypeData.value == undefined
          ? ""
          : this.state.appointmentTypeData.value,
      requester:
        this.state.selectedRequester.value == null ||
        this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
      location:
        this.state.locationDataTxt == null ||
        this.state.locationDataTxt == undefined
          ? ""
          : this.state.locationDataTxt,
      language: this.state.targetLangId,
      jobId: "",
      leiId:
        this.state.leiData.value == null ||
        this.state.leiData.value == undefined
          ? ""
          : this.state.leiData.value,
    };

    this.listApi(fetchData);
  };

  // This is goes to the next page
  next = async () => {
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
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom:
        this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      clientId:
        this.state.selectedClient.value == null ||
        this.state.selectedClient.value == undefined
          ? ""
          : this.state.selectedClient.value,
      status:
        this.state.statusData.value == null ||
        this.state.statusData.value == undefined
          ? ""
          : this.state.statusData.value,
      serviceType: "",
      rfqId: this.state.id,
      appointmentTypeId:
        this.state.appointmentTypeData.value == null ||
        this.state.appointmentTypeData.value == undefined
          ? ""
          : this.state.appointmentTypeData.value,
      requester:
        this.state.selectedRequester.value == null ||
        this.state.selectedRequester.value == undefined
          ? ""
          : this.state.selectedRequester.value,
      location:
        this.state.locationDataTxt == null ||
        this.state.locationDataTxt == undefined
          ? ""
          : this.state.locationDataTxt,
      language: this.state.targetLangId,
      jobId: "",
      leiId:
        this.state.leiData.value == null ||
        this.state.leiData.value == undefined
          ? ""
          : this.state.leiData.value,
    };

    this.listApi(fetchData);
  };

  //.............................translation..............................
  clickChange_translation = (e) => {
    this.setState({
      translation_current_page: e.target.value,
    });
  };

  //........Page show Limit.........

  onChangeLimit_Translation = async (dat) => {
    consoleLog("limit:::", dat.value);
    this.setState({
      translation_limit: parseInt(dat.value),
      translation_selectedDisplayData: dat,
      translation_current_page: 1,
    });

    let fetchData = {
      limit: dat.value,
      offset: "0",
      status:
        this.state.statusData.value == null ||
        this.state.statusData.value == undefined
          ? ""
          : this.state.statusData.value,
      clientId:
        this.state.selectedClient.value == null ||
        this.state.selectedClient.value == undefined
          ? ""
          : this.state.selectedClient.value,
      orderby: "",
      direc: "",
      searchFrom:
        this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchTo:
        this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      rfqId: this.state.id,
      targetLanguage: this.state.targetLangId,
      sourceLanguage: this.state.sourceLangId,
      serviceCatType: this.state.selectedServiceTypeId,
    };
    this.getTranslationList(fetchData);
  };
  // This is goes to the previous page
  exTranslationLeft = async () => {
    this.setState({
      translation_current_page: 1,
    });
    let fetchData = {
      limit: JSON.stringify(this.state.translation_limit),
      offset: "0",
      status:
        this.state.statusData.value == null ||
        this.state.statusData.value == undefined
          ? ""
          : this.state.statusData.value,
      clientId:
        this.state.selectedClient.value == null ||
        this.state.selectedClient.value == undefined
          ? ""
          : this.state.selectedClient.value,
      orderby: "",
      direc: "",
      searchFrom:
        this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchTo:
        this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      rfqId: this.state.id,
      targetLanguage: this.state.targetLangId,
      sourceLanguage: this.state.sourceLangId,
      serviceCatType: this.state.selectedServiceTypeId,
    };

    this.getTranslationList(fetchData);
  };

  // This is goes to the last page
  exTranslationRigth = async () => {
    let totalPage = this.state.translation_total_page;
    // consoleLog("totalPage", totalPage);
    this.setState({
      translation_current_page: parseInt(totalPage),
    });

    let fetchData = {
      limit: JSON.stringify(this.state.translation_limit),
      offset: JSON.stringify((totalPage - 1) * this.state.translation_limit),
      status:
        this.state.statusData.value == null ||
        this.state.statusData.value == undefined
          ? ""
          : this.state.statusData.value,
      clientId:
        this.state.selectedClient.value == null ||
        this.state.selectedClient.value == undefined
          ? ""
          : this.state.selectedClient.value,
      orderby: "",
      direc: "",
      searchFrom:
        this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchTo:
        this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      rfqId: this.state.id,
      targetLanguage: this.state.targetLangId,
      sourceLanguage: this.state.sourceLangId,
      serviceCatType: this.state.selectedServiceTypeId,
    };
    // console.log("returnData>>>", returnData);

    this.getTranslationList(fetchData);
  };

  // This is goes to the first page
  prevTranslation = async () => {
    let currentPage = this.state.translation_current_page;
    if (currentPage > 1) {
      currentPage--;
      this.setState({
        translation_current_page: currentPage,
      });
    }
    let fetchData = {
      limit: JSON.stringify(this.state.translation_limit),
      offset: JSON.stringify((currentPage - 1) * this.state.translation_limit),
      status:
        this.state.statusData.value == null ||
        this.state.statusData.value == undefined
          ? ""
          : this.state.statusData.value,
      clientId:
        this.state.selectedClient.value == null ||
        this.state.selectedClient.value == undefined
          ? ""
          : this.state.selectedClient.value,
      orderby: "",
      direc: "",
      searchFrom:
        this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchTo:
        this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      rfqId: this.state.id,
      targetLanguage: this.state.targetLangId,
      sourceLanguage: this.state.sourceLangId,
      serviceCatType: this.state.selectedServiceTypeId,
    };

    this.getTranslationList(fetchData);
  };

  // This is goes to the next page
  nextTranslation = async () => {
    // consoleLog("currentPage::",this.state.translation_current_page)
    // consoleLog("totalPage::",this.state.translation_total_page)
    let currentPage = this.state.translation_current_page;
    let totalPage = this.state.translation_total_page;
    if (currentPage < totalPage) {
      currentPage++;
      // consoleLog("aftercurrentPage::",currentPage)
      this.setState({
        translation_current_page: currentPage,
      });
    }

    let fetchData = {
      limit: JSON.stringify(this.state.translation_limit),
      offset: JSON.stringify((currentPage - 1) * this.state.translation_limit),
      status:
        this.state.statusData.value == null ||
        this.state.statusData.value == undefined
          ? ""
          : this.state.statusData.value,
      clientId:
        this.state.selectedClient.value == null ||
        this.state.selectedClient.value == undefined
          ? ""
          : this.state.selectedClient.value,
      orderby: "",
      direc: "",
      searchFrom:
        this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchTo:
        this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      rfqId: this.state.id,
      targetLanguage: this.state.targetLangId,
      sourceLanguage: this.state.sourceLangId,
      serviceCatType: this.state.selectedServiceTypeId,
    };
    this.getTranslationList(fetchData);
  };

  //..............................training..................................
  clickChange_training = (e) => {
    this.setState({
      training_current_page: e.target.value,
    });
  };
  //........Page show Limit.........

  onChangeLimit_Training = async (dat) => {
    this.setState({
      training_limit: parseInt(dat.value),
      training_selectedDisplayData: dat,
      training_current_page: 1,
    });

    let fetchData = {
      limit: dat.value,
      offset: "0",
      rfqId:this.state.id,
      clientId:
        this.state.selectedClient.value == null ||
        this.state.selectedClient.value == undefined
          ? ""
          : this.state.selectedClient.value,
      searchfrom:
        this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto: "",
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
    };

    this.getTrainingList(fetchData);
  };
  // This is goes to the previous page
  exTrainingLeft = async () => {
    this.setState({
      training_current_page: 1,
    });
    let fetchData = {
      limit: JSON.stringify(this.state.training_limit),
      offset: "0",
      rfqId:this.state.id,
      clientId:
        this.state.selectedClient.value == null ||
        this.state.selectedClient.value == undefined
          ? ""
          : this.state.selectedClient.value,
      searchfrom:
        this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto: "",
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
    };

    this.getTrainingList(fetchData);
  };

  // This is goes to the last page
  exTrainingRigth = async () => {
    let totalPage = this.state.training_total_page;
    // consoleLog("totalPage", totalPage);
    this.setState({
      // training_total_page: parseInt(totalPage),
      training_current_page: parseInt(totalPage),
    });

    let fetchData = {
      limit: JSON.stringify(this.state.training_limit),
      offset: JSON.stringify((totalPage - 1) * this.state.training_limit),
      rfqId:this.state.id,
      clientId:
        this.state.selectedClient.value == null ||
        this.state.selectedClient.value == undefined
          ? ""
          : this.state.selectedClient.value,
      searchfrom:
        this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto: "",
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
    };

    this.getTrainingList(fetchData);
  };

  // This is goes to the first page
  prevTraining = async () => {
    let currentPage = this.state.training_current_page;
    if (currentPage > 1) {
      currentPage--;
      this.setState({
        training_current_page: currentPage,
      });
    }
    let fetchData = {
      limit: JSON.stringify(this.state.training_limit),
      offset: JSON.stringify((currentPage - 1) * this.state.training_limit),
      rfqId:this.state.id,
      clientId:
        this.state.selectedClient.value == null ||
        this.state.selectedClient.value == undefined
          ? ""
          : this.state.selectedClient.value,
      searchfrom:
        this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto: "",
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
    };

    this.getTrainingList(fetchData);
  };

  // This is goes to the next page
  nextTraining = async () => {
    let currentPage = this.state.training_current_page;
    let totalPage = this.state.training_total_page;
    if (currentPage < totalPage) {
      currentPage++;
      this.setState({
        training_current_page: currentPage,
      });
    }

    let fetchData = {
      limit: JSON.stringify(this.state.training_limit),
      offset: JSON.stringify((currentPage - 1) * this.state.training_limit),
      rfqId:this.state.id,
      clientId:
        this.state.selectedClient.value == null ||
        this.state.selectedClient.value == undefined
          ? ""
          : this.state.selectedClient.value,
      searchfrom:
        this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto: "",
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
    };

    this.getTrainingList(fetchData);
  };

  //..............function for MenuButton close..............
  handleMenuClose = () => {
    this.setState({
      check: false,
      anchorEl: null,
      anchorEl1: null,
      anchorEl2: null,
      anchorEl_cancel: null,
      anchorEl1_cancel: null,
      anchorEl2_cancel: null,
    });
  };

  //................funct for menuBtn on click................
  menuBtnhandleClick = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl: event.currentTarget,
    });
  };
  menuBtnhandleClick_cancel = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl_cancel: event.currentTarget,
    });
  };

  menuBtnhandleClick_b = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl1: event.currentTarget,
    });
  };
  menuBtnhandleClick_b_cancel = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl1_cancel: event.currentTarget,
    });
  };
  menuBtnhandleClick_c = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl2: event.currentTarget,
    });
  };
  menuBtnhandleClick_c_cancel = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl2_cancel: event.currentTarget,
    });
  };
  editPage = () => {
    this.props.history.push({
      pathname: "/adminEditTrainingCourse",
      state: this.state.listData[this.state.curIndex],
    });
  };
  // ..................delete function........................
  deletePage = () => {
    window.$("#delete-modal").modal("show");
    // let listArrData = this.state.listData;
    // listArrData.splice(this.state.curIndex, 1);
    this.setState({
      // listData: listArrData,
      anchorEl: false,
      anchorEl1: false,
    });
  };
  onCancel = () => {
    // window.$("#delete-modal").modal("hide");
    this.closeModal();
  };

  deleteItem = async () => {
    let data = {
      clientcontactid: this.state.listData[this.state.curIndex].clientcontactid,
      status: 2,
    };
    // console.log(">>>>>>>>>>dataaaa::", JSON.stringify(data));
    let status = await ApiCall("modifyapprovedclientcontactstatus", data);
    // console.log(">>>>>>>>>status:", status);

    // window.$("#delete-modal").modal("hide");
    this.closeModal();
    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.load();
      toast.success(AlertMessage.MESSAGE.DELETE.DELETED);
    }
  };
  // .............pagination function..........

  //......Ascending order .........

  ascOrder = (data) => {
    let filter = "";
    if (data === "department") {
      filter = "department";
    } else if (data === "location") {
      filter = "location";
    } else if (data === "client") {
      filter = "name";
    } else if (data === "supervisor") {
      filter = "user";
    }

    let req = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      search: this.state.department,
      orderby: filter,
      direc: "ASC",
    };

    // this.listApi(req);
  };

  //......Descending order .........

  descOrder = (data) => {
    let filter = "";
    if (data === "department") {
      filter = "department";
    } else if (data === "location") {
      filter = "location";
    } else if (data === "client") {
      filter = "name";
    } else if (data === "supervisor") {
      filter = "user";
    }

    let req = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),

      orderby: filter,
      direc: "DESC",
    };

    // this.listApi(req);
  };

  // .............filter modal function...................
  openModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("filter-model").style.display = "block";
    document.getElementById("filter-model").classList.add("show");
  };

  openPasswordModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("password-model").style.display = "block";
    document.getElementById("password-model").classList.add("show");
  };
  openDeleteModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("delete-model").style.display = "block";
    document.getElementById("delete-model").classList.add("show");
  };
  openDeclineModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("decline-model").style.display = "block";
    document.getElementById("decline-model").classList.add("show");
  };
  openTranslationModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("translation-model").style.display = "block";
    document.getElementById("translation-model").classList.add("show");
  };
  openTrainingModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("training-model").style.display = "block";
    document.getElementById("training-model").classList.add("show");
  };

  closeDeclineModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("decline-model").style.display = "none";
    document.getElementById("decline-model").classList.remove("show");
  };

  closeFilterModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("filter-model").style.display = "none";
    document.getElementById("filter-model").classList.remove("show");
  };
  closeTranslationModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("translation-model").style.display = "none";
    document.getElementById("translation-model").classList.remove("show");
  };
  closeTrainingModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("training-model").style.display = "none";
    document.getElementById("training-model").classList.remove("show");
  };

  filterModal = () => {
    if (this.state.isInterpretation) {
      this.openModal();
    } else if (this.state.isTranslation) {
      this.openTranslationModal();
    } else {
      this.openTrainingModal();
    }

    this.handleMenuClose();
  };
  translationModal = () => {
    this.openTranslationModal();
    this.handleMenuClose();
  };
  trainingModal = () => {
    this.openTrainingModal();
    this.handleMenuClose();
  };

  onFilterRoleChange = (e) => {
    this.setState({
      filterRole: e.target.value,
    });
  };

  declineClose = () => {
    this.resetDeclineData();
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
  rescheduledCheck = (e) => {
    console.log(typeof e.target.value);
    this.setState({
      isSelected: e.target.value,
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
  onCancelDataChange = (data) => {
    consoleLog("data",data)
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
  onCancelProjectDataChange= (data) => {
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
  onOtherReasonChange = (e) => {
    this.setState({
      otherReason: e.target.value,
    });
  };

  //........... Export File...............

  // onExport = async () => {
  //   let data = {
  // name: this.state.uname,
  // email: this.state.emailId,
  // mobile: this.state.mobileNo,
  //   orderby: "",
  //   direc: "",
  //   searchto: "",
  //   searchfrom: "",
  // };
  // let res = await ApiCall("exportadminstaff", data);
  // const decodeData = Decoder.decode(res.data.payload);
  // if (
  //   res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
  //   res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  // ) {
  //   window.open(decodeData.data.fileUrl, "_blank");
  // }
  // };

  onFilterApply = () => {
    if (this.state.isInterpretation) {
      this.closeFilterModal();
      this.setState({
        current_page: 1,
        selectedDisplayData: {
          label: "20",
          value: "20",
        },
      });
      let resData = {
        limit: this.state.limit,
        offset: "0",
        direc: "",
        orderby: "",
        searchto: "",
        searchfrom:
          this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        clientId:this.state.selectedClient.value == null || this.state.selectedClient.value == undefined ? "" : this.state.selectedClient.value,
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        serviceType: "",
        rfqId: this.state.id,
        appointmentTypeId:
          this.state.appointmentTypeData.value == null ||
          this.state.appointmentTypeData.value == undefined
            ? ""
            : this.state.appointmentTypeData.value,
        requester:
          this.state.selectedRequester.value == null ||
          this.state.selectedRequester.value == undefined
            ? ""
            : this.state.selectedRequester.value,
        location:
          this.state.locationDataTxt == null ||
          this.state.locationDataTxt == undefined
            ? ""
            : this.state.locationDataTxt,
        language: this.state.targetLangId,
        jobId: "",
        leiId:
          this.state.leiData.value == null ||
          this.state.leiData.value == undefined
            ? ""
            : this.state.leiData.value,
      };

      this.listApi(resData);
    } else if (this.state.isTranslation) {
      this.closeTranslationModal();
  
      this.setState({
        translation_current_page: 1,
        translation_selectedDisplayData: {
          label: "20",
          value: "20",
        },
      });
      let resData = {
        limit: this.state.translation_limit,
        offset: "0",
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
            clientId:this.state.selectedClient.value == null || this.state.selectedClient.value == undefined ? "" : this.state.selectedClient.value,
        orderby: "",
        direc: "",
        searchFrom:
          this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        searchTo:
          this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
        rfqId: this.state.id,
        targetLanguage: this.state.targetLangId,
        sourceLanguage: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
      };
      this.getTranslationList(resData);
    } else if (this.state.isTraining) {
      this.closeTrainingModal();
      
      this.setState({
        training_current_page: 1,
        training_selectedDisplayData: {
          label: "20",
          value: "20",
        },
      });
      let resData = {
        limit: this.state.training_limit,
        offset: "0",
        direc: "",
        orderby: "",
        clientId:this.state.selectedClient.value == null || this.state.selectedClient.value == undefined ? "" : this.state.selectedClient.value,
        rfqId: this.state.id,
        searchfrom:
          this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        searchto: "",
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
      };
      this.getTrainingList(resData);
    }

    this.closeFilterModal();

   
  };

  onResetFilter = () => {
    if (this.state.isInterpretation) {
      this.closeFilterModal();
      this.resetData();
      this.setState({
        current_page: 1,
        selectedDisplayData: {
          label: "20",
          value: "20",
        },
      });

      let data = {
        limit: JSON.stringify(this.state.limit),
        offset: "0",
        direc: "",
        orderby: "",
        searchto: "",
        searchfrom: "",
        clientId: "",
        status: "",
        serviceType: "",
        rfqId: "",
        appointmentTypeId: "",
        requester: "",
        location: "",
        language: [],
        jobId: "",
        leiId: "",
      };
      this.listApi(data);
    } else if (this.state.isTranslation) {
      this.closeTranslationModal();
      this.resetData();
      this.setState({
        translation_current_page: 1,
        translation_selectedDisplayData: {
          label: "20",
          value: "20",
        },
      });

      let data = {
        limit: JSON.stringify(this.state.translation_limit),
        offset: "0",
        status: "",
        clientId: "",
        orderby: "",
        direc: "",
        searchFrom: "",
        searchTo: "",
        rfqId: "",
        targetLanguage: [],
        sourceLanguage: [],
        serviceCatType: [],
        tabType: "",
      };
      this.getTranslationList(data);
    } else if (this.state.isTraining) {
      this.closeTrainingModal();
      this.resetData();
      this.setState({
        training_current_page: 1,
        training_selectedDisplayData: {
          label: "20",
          value: "20",
        },
      });
      let data = {
        direc: "",
        orderby: "",
        searchfrom: "",
        clientId: "",
        limit: JSON.stringify(this.state.training_limit),
        // offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
        offset: "0",
        status: "",
        rfqId: "",
        requester: "",
        trainingCatId: "",
        trainingFormatId: "",
        courseId: "",
      };
      this.getTrainingList(data);
    }
  };
  goEdit = () => {
    this.props.history.push({
      pathname: "/adminClientRfqDetails",
      state: this.state.listData[this.state.curIndex],
    });
  };
  onSendQuote = () => {
    this.props.history.push({
      pathname: "/adminClientRfqSendQuotePage",
      state: this.state.listData[this.state.curIndex],
    });
  };
  onTranslationSendQuote = () => {
    this.props.history.push({
      pathname: "/adminTranslationSendQuote",
      state: this.state.translationData[this.state.curIndex],
    });
  };
  onTrainingSendQuote = () => {
    this.props.history.push({
      pathname: "/adminClientRfqTrainingSendQuotePage",
      state: this.state.trainingData[this.state.curIndex],
    });
  };
  declineModal = () => {
    this.openDeclineModal();
    this.handleMenuClose();
  };

  goTranslationEdit = () => {
    this.props.history.push({
      pathname: "/adminClientRfqTranslationDetails",
      state: this.state.translationData[this.state.curIndex],
    });
  };
  goTrainingEdit = () => {
    this.props.history.push({
      pathname: "/adminClientRfqTrainingDetails",
      state: this.state.trainingData[this.state.curIndex],
    });
  };

  handleReset = () => {
    this.handleMenuClose();
    this.openPasswordModal();
  };
  handleDelete = () => {
    this.handleMenuClose();
    this.openDeleteModal();
  };
  //............Reset Password...........

  // onResetPassword = async () => {
  //   this.closeModal();

  //   let pass = this.randomString(10, "aA#!");

  //   let data = {
  //     staffid: this.state.listData[this.state.curIndex].userId,
  //     password: pass,
  //   };

  //   let status = await ApiCall("userpasswordreset", data);
  //   if (
  //     status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
  //     status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  //   ) {
  //     toast.success(AlertMessage.MESSAGE.PASSWORD.RESET_SUCCESS);
  //   }
  // };

  onTabClick = (value) => {
    if (value === "interpretation") {
      this.resetData();
      this.setState({
        // interpretationModal: true,
        // translationModal: false,
        // trainingModal: false,
        isInterpretation: true,
        isTranslation: false,
        isTraining: false,
        current_page:1,
        selectedDisplayData:{
          label:"20",
          value:"20"
        }
      });
      this.load();
    } else if (value === "translation") {
      this.resetData();
      this.setState({
        // interpretationModal: false,
        // translationModal: true,
        // trainingModal: false,
        isInterpretation: false,
        isTranslation: true,
        isTraining: false,
        translation_selectedDisplayData:{
          label:"20",
          value:"20"
        },
        translation_current_page:1
      });

      let data = {
        status: "",
        clientId: "",
        orderby: "",
        direc: "",
        searchFrom: "",
        searchTo: "",
        rfqId: "",
        targetLanguage: [],
        sourceLanguage: [],
        serviceCatType: [],

        searchto: "",
        searchfrom: "",

        limit: JSON.stringify(this.state.translation_limit),
        // offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
        offset: "0",
      };
      this.getTranslationList(data);
    } else if (value === "training") {
      this.resetData();
      this.setState({
        // interpretationModal: false,
        // translationModal: false,
        // trainingModal: true,
        isInterpretation: false,
        isTranslation: false,
        isTraining: true,
        training_selectedDisplayData:{
          label:"20",
          value:"20"
        },
        training_current_page:1
      });

      let data = {
        direc: "",
        orderby: "",
        searchfrom: "",
        clientId: "",
        limit: JSON.stringify(this.state.training_limit),
        // offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
        offset: "0",
        status: "",
        rfqId: "",
        requester: "",
        trainingCatId: "",
        trainingFormatId: "",
        courseId: "",
      };
      this.getTrainingList(data);
    }
  };

  //........ No Delete .......

  // cancelDelete = () => {
  //   // window.$("#status-model").modal("hide");
  //   this.closeModal();
  // };
  onRescheduleNote = (e) => {
    this.setState({
      rescheduleNote: e.target.value,
    });
  };
  onDeclineSubmit = async () => {
    let mainData = this.props.location;
    let preData = mainData.state;
    let errorCount = 0;

    let validateCancelReason = inputEmptyValidate(
        this.state.cancellationData.value
      ),
      validateJobRescheduled = inputEmptyValidate(this.state.isSelected),
      validateDate = inputEmptyValidate(this.state.appointmentDate),
      validateOtherReason = inputEmptyValidate(this.state.otherReason);

    // consoleLog("drpdown::",validateCancelReason)
    // if (validateInterpretationFee === false) {
    if (validateCancelReason === false) {
      toast.error(AlertMessage.MESSAGE.JOB.EMPTY_MAIN_REASON, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (
      this.state.cancellationData.value === "6" &&
      validateOtherReason === false && this.state.isInterpretation
    ) {
      toast.error(AlertMessage.MESSAGE.JOB.EMPTY_OTHER_REASON, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateJobRescheduled === false && this.state.isInterpretation ) {
      toast.error(AlertMessage.MESSAGE.JOB.EMPTY_JOB_RESCHEDULE_CHECK, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (this.state.isSelected == "true" && validateDate === false && this.state.isInterpretation) {
      toast.error(AlertMessage.MESSAGE.JOB.EMPTY_DATE, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      let data = {};
      let modHour =
        (this.state.hour === "" ? Number("00") : this.state.hour) +
        ":" +
        (this.state.min === "" ? Number("00") : this.state.min) +
        " " +
        this.state.ampm;

      // consoleLog("modHour::",modHour)
      var dt = moment(modHour, ["h:mm A"]).format("HH:mm");
      if (this.state.isInterpretation) {
        data = {
          requestId: this.state.listData[this.state.curIndex].id,
          selectReason:
            this.state.cancellationData.value === 6
              ? this.state.otherReason
              : this.state.cancellationData.label,
          isScheduled: this.state.isSelected ? 1 : 0,
          rescheduleDate:this.state.appointmentDate == "" ? "" : SetDOBFormat(this.state.appointmentDate),
          rescheduleTime: dt == "00:00" ? "" : dt + ":00",

          scheduleNote: this.state.rescheduleNote,
        };
      } else if (this.state.isTranslation) {
        data = {
          requestId: this.state.translationData[this.state.curIndex].id,
          selectReason:
            this.state.cancellationData.value === 6
              ? this.state.otherReason
              : this.state.cancellationData.label,
          // isScheduled: this.state.isSelected ? 1 : 0,
          isScheduled:0,
          rescheduleDate:this.state.appointmentDate == "" ? "" : SetDOBFormat(this.state.appointmentDate),
          rescheduleTime: dt == "00:00" ? "" : dt + ":00",

          scheduleNote: this.state.rescheduleNote,
        };
      } else if (this.state.isTraining) {
        data = {
          requestId: this.state.trainingData[this.state.curIndex].id,
          selectReason:
            this.state.cancellationData.value === 6
              ? this.state.otherReason
              : this.state.cancellationData.label,
          // isScheduled: this.state.isSelected ? 1 : 0,
          isScheduled:0,
          rescheduleDate:this.state.appointmentDate == "" ? "" : SetDOBFormat(this.state.appointmentDate),
          rescheduleTime: dt == "00:00" ? "" : dt + ":00",

          scheduleNote: this.state.rescheduleNote,
        };
      }

      consoleLog("request dataa:::", data);

      // let res = await ApiCall("cancelJobDetails", data);
      // if (
      //   res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      //   res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      // ) {
      //   toast.success(AlertMessage.MESSAGE.JOB.CANCEL, {
      //     hideProgressBar: true,
      //   });
        
      //   this.declineClose();
      //   this.load();
      //   let transdata = {
      //     limit: JSON.stringify(this.state.translation_limit),
      //     offset: "0",
      //     status: "",
      //     clientId: "",
      //     orderby: "",
      //     direc: "",
      //     searchFrom: "",
      //     searchTo: "",
      //     rfqId: "",
      //     targetLanguage: [],
      //     sourceLanguage: [],
      //     serviceCatType: [],
      //     tabType: "",
      //   };
      //   this.getTranslationList(transdata);
      //   let trainingdata = {
      //     direc: "",
      //     orderby: "",
      //     searchfrom: "",
      //     clientId: "",
      //     limit: JSON.stringify(this.state.training_limit),
      //     // offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      //     offset: "0",
      //     status: "",
      //     rfqId: "",
      //     requester: "",
      //     trainingCatId: "",
      //     trainingFormatId: "",
      //     courseId: "",
      //   };
      //   this.getTrainingList(trainingdata);
      //   window.scrollTo(0,0);
      // } else {
      //   if (
      //     res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
      //     res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST
      //   ) {
      //     toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_EXIST, {
      //       hideProgressBar: true,
      //     });
      //   } else if (
      //     res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
      //     res.respondcode === ErrorCode.ERROR.ERROR_CODE.PHONE_EXIST
      //   ) {
      //     toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EXIST, {
      //       hideProgressBar: true,
      //     });
      //   } else if (
      //     res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
      //     res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_PHONE_EXIST
      //   ) {
      //     toast.error(AlertMessage.MESSAGE.EMAIL_MOBILE.DUBLICATE, {
      //       hideProgressBar: true,
      //     });
      //   }
      // }
    }
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

  // .........................................................................
  onIdChange = (val) => {
    if (this.state.isInterpretation) {
      let resData = {
        limit: this.state.limit,
        offset: JSON.stringify(
          (this.state.current_page - 1) * this.state.limit
        ),
        direc: "",
        orderby: "",
        searchto: "",
        searchfrom:
          this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        clientId:
          this.state.selectedClient.value == null ||
          this.state.selectedClient.value == undefined
            ? ""
            : this.state.selectedClient.value,
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        serviceType: "",
        rfqId: val,
        appointmentTypeId:
          this.state.appointmentTypeData.value == null ||
          this.state.appointmentTypeData.value == undefined
            ? ""
            : this.state.appointmentTypeData.value,
        requester:
          this.state.selectedRequester.value == null ||
          this.state.selectedRequester.value == undefined
            ? ""
            : this.state.selectedRequester.value,
        location:
          this.state.locationDataTxt == null ||
          this.state.locationDataTxt == undefined
            ? ""
            : this.state.locationDataTxt,
        language: this.state.targetLangId,
        jobId: "",
        leiId:
          this.state.leiData.value == null ||
          this.state.leiData.value == undefined
            ? ""
            : this.state.leiData.value,
      };

      this.listApi(resData);
    } else if (this.state.isTranslation) {
      let resData = {
        limit: this.state.translation_limit,
        offset: JSON.stringify(
          (this.state.translation_current_page - 1) *
            this.state.translation_limit
        ),
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        clientId:
          this.state.selectedClient.value == null ||
          this.state.selectedClient.value == undefined
            ? ""
            : this.state.selectedClient.value,
        orderby: "",
        direc: "",
        searchFrom:
          this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        searchTo:
          this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
        rfqId: val,
        targetLanguage: this.state.targetLangId,
        sourceLanguage: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
      };
      this.getTranslationList(resData);
    } else if (this.state.isTraining) {
      let resData = {
        limit: this.state.training_limit,
        offset: JSON.stringify(
          (this.state.training_current_page - 1) * this.state.training_limit
        ),
        rfqId: val,
        direc: "",
        orderby: "",
        clientId:
          this.state.selectedClient.value == null ||
          this.state.selectedClient.value == undefined
            ? ""
            : this.state.selectedClient.value,
        searchfrom:
          this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        searchto: "",
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
      };
      this.getTrainingList(resData);
    }

    this.setState({
      id: val,
    });
  };

  clientChange = (value) => {
    if (this.state.isInterpretation) {
      let resData = {
        limit: this.state.limit,
        offset: JSON.stringify(
          (this.state.current_page - 1) * this.state.limit
        ),
        direc: "",
        orderby: "",
        searchto: "",
        searchfrom:
          this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        clientId: value.value,
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        serviceType: "",
        rfqId: this.state.id,
        appointmentTypeId:
          this.state.appointmentTypeData.value == null ||
          this.state.appointmentTypeData.value == undefined
            ? ""
            : this.state.appointmentTypeData.value,
        requester:
          this.state.selectedRequester.value == null ||
          this.state.selectedRequester.value == undefined
            ? ""
            : this.state.selectedRequester.value,
        location:
          this.state.locationDataTxt == null ||
          this.state.locationDataTxt == undefined
            ? ""
            : this.state.locationDataTxt,
        language: this.state.targetLangId,
        jobId: "",
        leiId:
          this.state.leiData.value == null ||
          this.state.leiData.value == undefined
            ? ""
            : this.state.leiData.value,
      };

      this.listApi(resData);
    } else if (this.state.isTranslation) {
      let resData = {
        limit: this.state.translation_limit,
        offset: JSON.stringify(
          (this.state.translation_current_page - 1) *
            this.state.translation_limit
        ),
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
            clientId: value.value,
        orderby: "",
        direc: "",
        searchFrom:
          this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        searchTo:
          this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
        rfqId: this.state.id,
        targetLanguage: this.state.targetLangId,
        sourceLanguage: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
      };
      this.getTranslationList(resData);
    } else if (this.state.isTraining) {
      let resData = {
        limit: this.state.training_limit,
        offset: JSON.stringify(
          (this.state.training_current_page - 1) * this.state.training_limit
        ),
        direc: "",
        orderby: "",
        clientId: value.value,
        rfqId: this.state.id,
        searchfrom:
          this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        searchto: "",
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
      };
      this.getTrainingList(resData);
    }
    this.setState({
      selectedClient: value,
    });
  };

  onLocationInputChange = async (val) => {
    // console.log(")))))))))))))))", val);
    let arrData = [];
    let locationData = [];

    if (val.length > 0) {
      let locationRes = await ApiCall("getlocaiondescription", {
        place: val,
      });
      if (
        locationRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        locationRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let locationArr = Decoder.decode(locationRes.data.payload);
        locationData = locationArr.data.locaionsuggesion;
        // console.log("data:::::", locationData);
        for (let i = 0; i < locationData.length; i++) {
          arrData.push({
            label: locationData[i].description,
            value: locationData[i].placeid,
          });
        }

        this.setState({
          locationArr: arrData,
          locationDataTxt: val,
        });
      }
    }
  };

  onLocationChange = (value) => {
    // console.log("location value", value)
    this.setState({
      locationData: value,
    });
  };

  onAppointmentTypeChange = (data) => {
    // consoleLog("val:::", data.value);
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
  onsourceLangChange = (value) => {
    let arr = [];

    value.map((obj) => {
      arr.push(obj.value);
    });
    this.setState({
      sourceLangData: value,
      sourceLangId: arr,
    });
  };
  requesterChange = (val) => {
    this.setState({
      selectedRequester: val,
    });
  };
  onContractChange = (val) => {
    this.setState({
      selectedContract: val,
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
  resetData = () => {
    this.setState({
      formDate: "",
      toDate: "",
      selectedClient: {},
      id: "",
      input: "",
      appointmentTypeData: {},
      selectedRequester: {},
      locationData: {},
      locationDataTxt: "",
     
      leiData: {},
      targetLangData: [],
      targetLangId: [],
      selectedServiceType:[],
      selectedServiceTypeId:[],
     
      sourceLangData:[],
      sourceLangId:[],

      selectedFormat:{},
      selectedTrainingCategory:{},
      selectedCourse:{},
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
      isOtherReason: false,
    });
  };
  serviceChange = (value) => {
    let arr = [];

    value.map((obj) => {
      arr.push(obj.value);
    });
    this.setState({
      selectedServiceType: value,
      selectedServiceTypeId: arr,
    });
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

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    const open1 = Boolean(this.state.anchorEl1);
    const open2 = Boolean(this.state.anchorEl2);
    // for withoutcancel menu
    const open_cancel = Boolean(this.state.anchorEl_cancel); //used in MenuButton open
    const open1_cancel = Boolean(this.state.anchorEl1_cancel);
    const open2_cancel = Boolean(this.state.anchorEl2_cancel);

    const customStylesDropdown = {
      control: (styles) => ({
        ...styles,
        backgroundColor: "white",
        boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
        borderRadius: "10px",
        height: 45,
        minHeight: 45,
      }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = "yellow";
        return {
          ...styles,
          color: isFocused ? "grey" : "white",
          //   backgroundColor: isDisabled ? "red" : "white",
          color: "#000",
          cursor: isDisabled ? "not-allowed" : "default",
        };
      },
    };
    return (
      <React.Fragment>
        <ToastContainer hideProgressBar theme="colored" />
        <div className="component-wrapper">
          <div className="listing-component-app">
            <div
              className="vn_frm"
              style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
            >
              {" "}
              <Link to="/adminDashboard">Dashboard</Link> / Client RFQ
            </div>
            <div
              className="vendor-info _fl sdw"
              style={{
                boxShadow: "  0px 0px 3px 0px rgb(0 0 0 / 23%)",
                borderRadius: "20px",
                padding: "opx 30px",
              }}
            >
              <div className="vn-form _fl">
                {/* <div className="row"></div> */}
                <div className="row">
                  <div className="col-md-6"></div>
                  <div className="col-md-6 rateList">
                    <div
                      className="_fl verificaiton-doc-tab"
                      style={{ marginTop: "0px" }}
                    >
                      <ul>
                        <li
                          className="active"
                          data-related="tble-data-a"
                          onClick={() => {
                            this.onTabClick("interpretation");
                          }}
                        >
                          InterPretation
                        </li>
                        <li
                          data-related="tble-data-b"
                          onClick={() => {
                            this.onTabClick("translation");
                          }}
                        >
                          Translation
                        </li>
                        <li
                          data-related="tble-data-c"
                          onClick={() => {
                            this.onTabClick("training");
                          }}
                        >
                          training
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="row" style={{ marginTop: "30px" }}>
                  <div className="col-md-4">
                    <div className="vn_frm">
                      <span
                        style={{
                          width: "30%",
                          paddingLeft: "5px",
                          fontSize: "14px",
                        }}
                      >
                        {this.state.isInterpretation ? "Job ID" : "Project ID"}
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
                      <span
                        style={{
                          // width: "10%",
                          // paddingLeft: "5px",
                          fontSize: "14px",
                        }}
                      >
                        Client
                      </span>

                      <div className="dropdwn" style={{ marginLeft: "80px" }}>
                        <SelectBox
                          optionData={this.state.allClientArr}
                          value={this.state.selectedClient}
                          onSelectChange={(value) => this.clientChange(value)}
                          // isDisabled = {true}
                        ></SelectBox>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ................................... */}
            <div className="table-filter-app">
              <div className="row">
                <div className="col-md-6">
                  <div className="cus-filter-btn btns">
                    {" "}
                    {/* <button className="button_one">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN} />
                    </button>
                    <button className="button_two">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN_ONE} />
                    </button>
                    <button className="button_three">
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
                   
                    {this.state.isInterpretation ? (
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
                    ) : this.state.isTranslation ? (
                      <React.Fragment>
                        <div className="filter-pagination">
                          <button
                            className="prev_btn"
                            onClick={this.exTranslationLeft}
                          ></button>
                          <button
                            className="prv_btn"
                            onClick={this.prevTranslation}
                          >
                            {" "}
                            {"<"}
                          </button>
                          <span
                            className="num"
                            onChange={(e) => this.clickChange_translation(e)}
                          >
                            {this.state.translation_current_page}
                          </span>
                          <button
                            className="nxt_btn"
                            onClick={this.nextTranslation}
                          >
                            {">"}
                          </button>
                          <button
                            className="next_btn"
                            onClick={this.exTranslationRigth}
                          ></button>
                        </div>
                      </React.Fragment>
                    ) : this.state.isTraining ? (
                      <React.Fragment>
                        <div className="filter-pagination">
                          <button
                            className="prev_btn"
                            onClick={this.exTrainingLeft}
                          ></button>
                          <button
                            className="prv_btn"
                            onClick={this.prevTraining}
                          >
                            {" "}
                            {"<"}
                          </button>
                          <span
                            className="num"
                            onChange={(e) => this.clickChange_training(e)}
                          >
                            {this.state.training_current_page}
                          </span>
                          <button
                            className="nxt_btn"
                            onClick={this.nextTraining}
                          >
                            {">"}
                          </button>
                          <button
                            className="next_btn"
                            onClick={this.exTrainingRigth}
                          ></button>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                    {/* <div class="tble-short">
                      {" "}
                      <span class="lbl">Job status</span>
                      <div class="dropdwn">
                        <Select
                        //   styles={customStyles}
                          options={jobStatusArr}
                          components={{
                            DropdownIndicator,
                            IndicatorSeparator: () => null,
                          }}
                          value={this.state.jobStatusData}
                          placeholder="Select"
                          onChange={(value) => {
                            this.onJobStatusChange(value);
                          }}
                        />
                      
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="table-filter-box">
                    {/* <div class="export-btn">
                      <a href="#">
                        Export
                        <img
                          src={ImageName.IMAGE_NAME.EXPORT_BTN}
                          style={{ width: "25px", cursor: "pointer" }}
                          onClick={this.onExport}
                        />
                      </a>
                    </div> */}
                    {/* <div class="addnew">
                      <a href="#">
                        Add New
                        <img
                          className=""
                          src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                          style={{ width: "25px", cursor: "pointer" }}
                          onClick={this.addNew}
                        />
                      </a>
                    </div> */}
                    <div className="tble-short">
                      {" "}
                      <span className="lbl">Display</span>
                      {this.state.isInterpretation ? (
                        <React.Fragment>
                          <div
                            className="dropdwn"
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
                        </React.Fragment>
                      ) : this.state.isTranslation ? (
                        <React.Fragment>
                          <div
                            className="dropdwn"
                            style={{
                              width: "70px",
                              fontSize: "12px",
                              textAlign: "center",
                            }}
                          >
                            <PaginationDropdown
                              optionData={CommonData.COMMON.DISPLAY_ARR}
                              value={this.state.translation_selectedDisplayData}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onChangeLimit_Translation(value);
                              }}
                            />
                          </div>
                        </React.Fragment>
                      ) : this.state.isTraining ? (
                        <React.Fragment>
                          <div
                            className="dropdwn"
                            style={{
                              width: "70px",
                              fontSize: "12px",
                              textAlign: "center",
                            }}
                          >
                            <PaginationDropdown
                              optionData={CommonData.COMMON.DISPLAY_ARR}
                              value={this.state.training_selectedDisplayData}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onChangeLimit_Training(value);
                              }}
                            />
                          </div>
                        </React.Fragment>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}
                      {/* <div
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
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div hidden={!this.state.isInterpretation}> */}
            <div
              className="tab-app-information activeLnk"
              id="tble-data-a"
              hidden={!this.state.isInterpretation}
            >
              <div className="table-listing-app">
                <div className="table-responsive_cus table-style-a">
                  <table
                    width="100%"
                    border="0"
                    cellPadding="0"
                    cellSpacing="0"
                  >
                    <tr>
                      <th style={{ width: "9%" }}>
                        {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("department")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("department")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                        Job #
                      </th>

                      <th style={{ width: "9%" }}>
                        {/* <div class="sorting_btn">
                        <button class="t1" onClick={() => this.ascOrder("subDepartment")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button class="t1" onClick={() => this.descOrder("subDepartment")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                        Client
                      </th>
                      <th style={{ width: "9%" }}>
                        {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("location")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("location")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                        LEI
                      </th>

                      <th style={{ width: "9%" }}>
                        {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("supervisor")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("supervisor")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                        Appointment Type
                      </th>

                      <th style={{ width: "13%" }}>
                        {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("supervisor")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("supervisor")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                        Date & Time
                      </th>
                      <th style={{ width: "14%" }}>Location</th>
                      <th style={{ width: "10%" }}> Language </th>
                      {/* <th style={{ width: "6%" }}>Target Language</th> */}

                      <th style={{ width: "11%" }}>Status</th>
                      <th style={{ width: "5%" }}>Action</th>
                    </tr>
                    {this.state.listData.length > 0 ? <React.Fragment>
                      {this.state.listData.map((item, key) => (
                      <tr key={key}>
                        <td colSpan="9">
                          <div className="tble-row_t">
                            <table
                              width="100%"
                              border="0"
                              cellPadding="0"
                              cellSpacing="0"
                            >
                              <tr>
                                <td style={{ width: "9%" }}>
                                  {item.requestId}
                                </td>

                                <td style={{ width: "9%" }}>
                                  {item.clientName}
                                </td>
                                {/* {item.email.length > 20 ? ( */}

                                {/* ) : ( */}
                                <td style={{ width: "9%" }}>
                                  {/* {phoneNumberFormat(item.lei, 2)} */}
                                  {item.leiName}
                                </td>
                                {/* )} */}

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
                                  {item.location === null ||
                                  item.location === undefined ||
                                  item.location === ""
                                    ? "N/A"
                                    : item.location}
                                </td>
                                <td style={{ width: "10%" }}>
                                  {" "}
                                  {item.sourceLanguage} {">"}
                                  {<br />} {item.targetLanguage}
                                </td>
                                {/* <td style={{ width: "6%" }}> </td> */}

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
                                        Approved
                                      </span>
                                    </React.Fragment>
                                  ) : item.status === 2 ? (
                                    <React.Fragment>
                                      <span
                                        href="#"
                                        className="progress-btn red"
                                      >
                                        Cancelled
                                      </span>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment></React.Fragment>
                                  )}
                                </td>

                                <td style={{ width: "5%" }}>
                                  {item.status === 2 ? <React.Fragment>
                                    <img
                                    src={ImageName.IMAGE_NAME.MENU_VERTICAL}
                                    style={{ cursor: "pointer" }}
                                    id={"basic-button" + key}
                                    aria-controls={"basic-menu" + key}
                                    aria-haspopup="true"
                                    aria-expanded={open_cancel ? "true" : undefined}
                                    onClick={(e) =>
                                      this.menuBtnhandleClick_cancel(key, e)
                                    }
                                  />
                                  <StyledMenu
                                    id={"basic-menu" + key}
                                    anchorEl={this.state.anchorEl_cancel}
                                    open={open_cancel}
                                    onClose={this.handleMenuClose}
                                    MenuListProps={{
                                      "aria-labelledby": "basic-button" + key,
                                    }}
                                  >
                                    <MenuItem onClick={() => this.goEdit()}>
                                      View Details
                                    </MenuItem>

      
                                  </StyledMenu>
                                  </React.Fragment>:<React.Fragment>
                                    
                                  <img
                                    src={ImageName.IMAGE_NAME.MENU_VERTICAL}
                                    style={{ cursor: "pointer" }}
                                    id={"basic-button" + key}
                                    aria-controls={"basic-menu" + key}
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                    onClick={(e) =>
                                      this.menuBtnhandleClick(key, e)
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
                                    <MenuItem onClick={() => this.goEdit()}>
                                      View Details
                                    </MenuItem>

                                    {/* <MenuItem onClick={this.onSendQuote}>
                                      Send Quote
                                    </MenuItem> */}
                                   
                                      <MenuItem
                                        onClick={this.declineModal}
              
                                      >
                                        Cancel
                                      </MenuItem>
                                    
                                  </StyledMenu>
                                    </React.Fragment>}
                                 
                                </td>
                              </tr>
                            </table>
                          </div>
                        </td>
                      </tr>
                    ))}
                    </React.Fragment>:<React.Fragment>
                    <tr style={{ textAlign: "center" }}>
                        <td colSpan="9">
                          <center style={{ fontSize: "20px" }}>
                            No data found !!!
                          </center>
                        </td>
                      </tr>
                      </React.Fragment>} 
                    
                  </table>
                </div>
              </div>
            </div>

            {/* <div className="tab-app-information activeLnk" id="tble-data-b">
              History
            </div> */}
            {/* <div hidden={!this.state.isTranslation}> */}
            <div
              className="tab-app-information activeLnk"
              id="tble-data-b"
              hidden={!this.state.isTranslation}
            >
              <div className="table-listing-app">
                <div className="table-responsive_cus table-style-a">
                  <table
                    width="100%"
                    border="0"
                    cellPadding="0"
                    cellSpacing="0"
                  >
                    <tr>
                      <th style={{ width: "10%" }}>
                        {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("department")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("department")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                        Project Id
                      </th>

                      <th style={{ width: "10%" }}>
                        {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("location")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("location")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                        Client
                      </th>

                      <th style={{ width: "10%" }}>Expected Deadline</th>
                      <th style={{ width: "15%" }}>
                        {" "}
                        Language{" "}
                        {/* <img
                              src={ImageName.IMAGE_NAME.GREATER_THAN_ARROW}
                            /> */}
                      </th>
                      {/* <th style={{ width: "6%" }}>Target Language</th> */}

                      <th style={{ width: "5%" }}>Status</th>
                      <th style={{ width: "5%" }}>Action</th>
                    </tr>
                    {this.state.translationData.length > 0 ? <React.Fragment>
                      {this.state.translationData.map((item, key) => (
                      <tr key={key}>
                        <td colSpan="8">
                          <div className="tble-row_t">
                            <table
                              width="100%"
                              border="0"
                              cellPadding="0"
                              cellSpacing="0"
                            >
                              <tr>
                                <td style={{ width: "10%" }}>
                                  {item.requestId}
                                </td>

                                <td style={{ width: "10%" }}>
                                  {item.clientName}
                                </td>

                                <td style={{ width: "10%" }}>
                                  {SetDateFormat(item.expectedDeadline)}
                                </td>
                                <td style={{ width: "15%" }}>
                                  {" "}
                                  {item.sourceLanguage === null ||
                                  item.sourceLanguage === undefined ||
                                  item.sourceLanguage === ""
                                    ? "N/A"
                                    : item.sourceLanguage}
                                  {"  "} {">"}
                                  {<br />}{" "}
                                  {item.targetLanguage === null ||
                                  item.targetLanguage === undefined ||
                                  item.targetLanguage === ""
                                    ? "N/A"
                                    : item.targetLanguage}
                                </td>
                                {/* <td style={{ width: "6%" }}> </td> */}

                                <td style={{ width: "5%" }}>
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
                                        Approved
                                      </span>
                                    </React.Fragment>
                                  ) : item.status === 2 ? (
                                    <React.Fragment>
                                      <span
                                        href="#"
                                        className="progress-btn red"
                                      >
                                        Cancelled
                                      </span>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment></React.Fragment>
                                  )}
                                </td>

                                <td style={{ width: "5%" }}>
                                  {item.status === 2 ? <React.Fragment>
                                    <img
                                    src={ImageName.IMAGE_NAME.MENU_VERTICAL}
                                    style={{ cursor: "pointer" }}
                                    id={"basic-button" + key}
                                    aria-controls={"basic-menu" + key}
                                    aria-haspopup="true"
                                    aria-expanded={open1_cancel ? "true" : undefined}
                                    onClick={(e) =>
                                      this.menuBtnhandleClick_b_cancel(key, e)
                                    }
                                  />
                                  <StyledMenu
                                    id={"basic-menu" + key}
                                    anchorEl={this.state.anchorEl1_cancel}
                                    open={open1_cancel}
                                    onClose={this.handleMenuClose}
                                    MenuListProps={{
                                      "aria-labelledby": "basic-button" + key,
                                    }}
                                  >
                                    <MenuItem
                                      onClick={() => this.goTranslationEdit()}
                                    >
                                      View Details
                                    </MenuItem>

                                      </StyledMenu>

                                  </React.Fragment>:<React.Fragment>
                                  <img
                                    src={ImageName.IMAGE_NAME.MENU_VERTICAL}
                                    style={{ cursor: "pointer" }}
                                    id={"basic-button" + key}
                                    aria-controls={"basic-menu" + key}
                                    aria-haspopup="true"
                                    aria-expanded={open1 ? "true" : undefined}
                                    onClick={(e) =>
                                      this.menuBtnhandleClick_b(key, e)
                                    }
                                  />
                                  <StyledMenu
                                    id={"basic-menu" + key}
                                    anchorEl={this.state.anchorEl1}
                                    open={open1}
                                    onClose={this.handleMenuClose}
                                    MenuListProps={{
                                      "aria-labelledby": "basic-button" + key,
                                    }}
                                  >
                                    <MenuItem
                                      onClick={() => this.goTranslationEdit()}
                                    >
                                      View Details
                                    </MenuItem>
                                      <MenuItem
                                        onClick={this.declineModal}  
                                      >
                                        Cancel
                                      </MenuItem>
                                  </StyledMenu>
                                    </React.Fragment>}
                                  
                                </td>
                              </tr>
                            </table>
                          </div>
                        </td>
                      </tr>
                    ))}
                    </React.Fragment> : <React.Fragment>
                    <tr style={{ textAlign: "center" }}>
                        <td colSpan="6">
                          <center style={{ fontSize: "20px" }}>
                            No data found !!!
                          </center>
                        </td>
                      </tr>
                      </React.Fragment>}
                    
                  </table>
                </div>
              </div>
            </div>
            {/* ................................................... */}
            {/* <div hidden={!this.state.isTraining}> */}
            <div
              className="tab-app-information activeLnk"
              id="tble-data-c"
              hidden={!this.state.isTraining}
            >
              <div className="table-listing-app">
                <div className="table-responsive_cus table-style-a">
                  <table
                    width="100%"
                    border="0"
                    cellPadding="0"
                    cellSpacing="0"
                  >
                    <tr>
                      <th style={{ width: "10%" }}>
                        {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("department")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("department")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                        Project Id
                      </th>

                      <th style={{ width: "10%" }}>
                        {/* <div class="sorting_btn">
                        <button class="t1" onClick={() => this.ascOrder("subDepartment")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button class="t1" onClick={() => this.descOrder("subDepartment")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                        Client
                      </th>
                      <th style={{ width: "10%" }}>
                        {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("location")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("location")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                        Requirement
                      </th>

                      <th style={{ width: "10%" }}>
                        {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("supervisor")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("supervisor")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                        Training Category
                      </th>
                      <th style={{ width: "10%" }}>Format</th>
                      <th style={{ width: "10%" }}> Start Date </th>
                      <th style={{ width: "10%" }}> Total Duration </th>
                      {/* <th style={{ width: "10%" }}> Requested On </th> */}
                      {/* <th style={{ width: "6%" }}>Target Language</th> */}

                      <th style={{ width: "11%" }}>Status</th>
                      <th style={{ width: "5%" }}>Action</th>
                    </tr>
                    {this.state.trainingData.length > 0 ? <React.Fragment>
                      {this.state.trainingData.map((item, key) => (
                      <tr key={key}>
                        <td colSpan="10">
                          <div className="tble-row_t">
                            <table
                              width="100%"
                              border="0"
                              cellPadding="0"
                              cellSpacing="0"
                            >
                              <tr>
                                <td style={{ width: "10%" }}>
                                  {item.requestId}
                                </td>

                                <td style={{ width: "10%" }}>
                                  {item.clientName}
                                </td>
                                {/* {item.email.length > 20 ? ( */}

                                {/* ) : ( */}
                                <td style={{ width: "10%" }}>
                                  {item.requirement}
                                </td>
                                {/* )} */}

                                <td style={{ width: "10%" }}>
                                  {item.category}
                                </td>
                                <td style={{ width: "10%" }}>{item.format}</td>
                                <td style={{ width: "10%" }}>
                                  {SetDateFormat(item.scheduleDate)}
                                </td>
                                <td style={{ width: "10%" }}>
                                  {item.duration}
                                </td>
                                {/* <td style={{ width: "10%" }}>
                                  {item.requestedOn}
                                </td> */}
                                {/* <td style={{ width: "6%" }}> </td> */}

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
                                        Approved
                                      </span>
                                    </React.Fragment>
                                  ) : item.status === 2 ? (
                                    <React.Fragment>
                                      <span className="progress-btn red">
                                        Cancelled
                                      </span>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment></React.Fragment>
                                  )}
                                </td>

                                <td style={{ width: "5%" }}>
                                  {item.status === 2 ? <React.Fragment>
                                    <img
                                    src={ImageName.IMAGE_NAME.MENU_VERTICAL}
                                    style={{ cursor: "pointer" }}
                                    id={"basic-button" + key}
                                    aria-controls={"basic-menu" + key}
                                    aria-haspopup="true"
                                    aria-expanded={open2_cancel ? "true" : undefined}
                                    onClick={(e) =>
                                      this.menuBtnhandleClick_c_cancel(key, e)
                                    }
                                  />
                                  <StyledMenu
                                    id={"basic-menu" + key}
                                    anchorEl={this.state.anchorEl2_cancel}
                                    open={open2_cancel}
                                    onClose={this.handleMenuClose}
                                    MenuListProps={{
                                      "aria-labelledby": "basic-button" + key,
                                    }}
                                  >
                                    <MenuItem
                                      onClick={() => this.goTrainingEdit()}
                                    >
                                      View Details
                                    </MenuItem>
                                  
                                     
                                   
                                  </StyledMenu>
                                  </React.Fragment>:<React.Fragment>
                                  <img
                                    src={ImageName.IMAGE_NAME.MENU_VERTICAL}
                                    style={{ cursor: "pointer" }}
                                    id={"basic-button" + key}
                                    aria-controls={"basic-menu" + key}
                                    aria-haspopup="true"
                                    aria-expanded={open2 ? "true" : undefined}
                                    onClick={(e) =>
                                      this.menuBtnhandleClick_c(key, e)
                                    }
                                  />
                                  <StyledMenu
                                    id={"basic-menu" + key}
                                    anchorEl={this.state.anchorEl2}
                                    open={open2}
                                    onClose={this.handleMenuClose}
                                    MenuListProps={{
                                      "aria-labelledby": "basic-button" + key,
                                    }}
                                  >
                                    <MenuItem
                                      onClick={() => this.goTrainingEdit()}
                                    >
                                      View Details
                                    </MenuItem>
                                  
                                      <MenuItem
                                        onClick={this.declineModal}
                                    
                                      >
                                        Cancel
                                      </MenuItem>
                                   
                                  </StyledMenu>
                                    </React.Fragment>}
                                 
                                </td>
                              </tr>
                            </table>
                          </div>
                        </td>
                      </tr>
                    ))}
                    </React.Fragment> : <React.Fragment>
                    <tr style={{ textAlign: "center" }}>
                        <td colSpan="9">
                          <center style={{ fontSize: "20px" }}>
                            No data found !!!
                          </center>
                        </td>
                      </tr>
                      </React.Fragment>}
                    
                  </table>
                </div>
              </div>
            </div>

            {/* ............................................................... */}
            <div className="table-filter-app">
              <div className="row">
                <div className="col-md-6">
                  <div className="cus-filter-btn btns">
                    {" "}
                    {/* <button className="button_one">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN} />
                    </button>
                    <button className="button_two">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN_ONE} />
                    </button>
                    <button className="button_three">
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
                   
                    {this.state.isInterpretation ? (
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
                    ) : this.state.isTranslation ? (
                      <React.Fragment>
                        <div className="filter-pagination">
                          <button
                            className="prev_btn"
                            onClick={this.exTranslationLeft}
                          ></button>
                          <button
                            className="prv_btn"
                            onClick={this.prevTranslation}
                          >
                            {" "}
                            {"<"}
                          </button>
                          <span
                            className="num"
                            onChange={(e) => this.clickChange_translation(e)}
                          >
                            {this.state.translation_current_page}
                          </span>
                          <button
                            className="nxt_btn"
                            onClick={this.nextTranslation}
                          >
                            {">"}
                          </button>
                          <button
                            className="next_btn"
                            onClick={this.exTranslationRigth}
                          ></button>
                        </div>
                      </React.Fragment>
                    ) : this.state.isTraining ? (
                      <React.Fragment>
                        <div className="filter-pagination">
                          <button
                            className="prev_btn"
                            onClick={this.exTrainingLeft}
                          ></button>
                          <button
                            className="prv_btn"
                            onClick={this.prevTraining}
                          >
                            {" "}
                            {"<"}
                          </button>
                          <span
                            className="num"
                            onChange={(e) => this.clickChange_training(e)}
                          >
                            {this.state.training_current_page}
                          </span>
                          <button
                            className="nxt_btn"
                            onClick={this.nextTraining}
                          >
                            {">"}
                          </button>
                          <button
                            className="next_btn"
                            onClick={this.exTrainingRigth}
                          ></button>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                  
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="table-filter-box">
                    {/* <div class="export-btn">
                      <a href="#">
                        Export
                        <img
                          src={ImageName.IMAGE_NAME.EXPORT_BTN}
                          style={{ width: "25px", cursor: "pointer" }}
                          onClick={this.onExport}
                        />
                      </a>
                    </div> */}
                    {/* <div class="addnew">
                      <a href="#">
                        Add New
                        <img
                          className=""
                          src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                          style={{ width: "25px", cursor: "pointer" }}
                          onClick={this.addNew}
                        />
                      </a>
                    </div> */}
                    <div className="tble-short">
                      {" "}
                      <span className="lbl">Display</span>
                      {this.state.isInterpretation ? (
                        <React.Fragment>
                          <div
                            className="dropdwn"
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
                        </React.Fragment>
                      ) : this.state.isTranslation ? (
                        <React.Fragment>
                          <div
                            className="dropdwn"
                            style={{
                              width: "70px",
                              fontSize: "12px",
                              textAlign: "center",
                            }}
                          >
                            <PaginationDropdown
                              optionData={CommonData.COMMON.DISPLAY_ARR}
                              value={this.state.translation_selectedDisplayData}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onChangeLimit_Translation(value);
                              }}
                            />
                          </div>
                        </React.Fragment>
                      ) : this.state.isTraining ? (
                        <React.Fragment>
                          <div
                            className="dropdwn"
                            style={{
                              width: "70px",
                              fontSize: "12px",
                              textAlign: "center",
                            }}
                          >
                            <PaginationDropdown
                              optionData={CommonData.COMMON.DISPLAY_ARR}
                              value={this.state.training_selectedDisplayData}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onChangeLimit_Training(value);
                              }}
                            />
                          </div>
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
        </div>

        {/* ..................modal................................. */}
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
                        Appointment Type
                      </li>
                      <li
                        data-related="tble-data-e"
                        style={{ padding: "20px 20px" }}
                      >
                        Language
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
                        Location
                      </li>
                      <li
                        data-related="tble-data-h"
                        style={{ padding: "20px 20px" }}
                      >
                        Date
                      </li>
                      {this.state.isReceivable ? (
                        <li
                          data-related="tble-data-i"
                          style={{ padding: "20px 20px" }}
                        >
                          Contract Type
                        </li>
                      ) : (
                        <React.Fragment />
                      )}
                      <li
                        data-related="tble-data-j"
                        style={{ padding: "20px 20px" }}
                      >
                        Limited English Individual [LEI]
                      </li>
                      {/* {this.state.isReceivable ? (
                        <li data-related="tble-data-k">Contract Type</li>
                      ) : (
                        <React.Fragment />
                      )} */}
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
                                  <SelectBox
                                    // styles={customStyles}
                                    optionData={this.state.appointmentTypeArr}
                                    // components={{
                                    //   DropdownIndicator,
                                    //   IndicatorSeparator: () => null,
                                    // }}
                                    value={this.state.appointmentTypeData}
                                    placeholder="Select"
                                    onSelectChange={(value) => {
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
                                    LANGUAGE
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
                                    class="lable-text"
                                    style={{
                                      // paddingLeft: "10px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    LOCATION
                                  </div>
                                  <div
                                    class="dropdwn"
                                    // style={{ marginLeft: "25%" }}
                                  >
                                    <div className="tr-3">
                                      <Select
                                        options={this.state.locationArr}
                                        components={{
                                          DropdownIndicator,
                                          IndicatorSeparator: () => null,
                                        }}
                                        value={this.state.locationData}
                                        placeholder="Select"
                                        onChange={(value) =>
                                          this.onLocationChange(value)
                                        }
                                        onInputChange={(value) => {
                                          this.onLocationInputChange(value);
                                        }}
                                        styles={customStylesDropdown}
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
                              {/* <div className="col-md-10">
                                <div className="form-field-app date-input">
                                  <span style={{ marginTop: "8px" }}>from</span>
                                  <input
                                    type="date"
                                    className="datefield bd"
                                    placeholder="10/25/2021"
                                    value={this.state.formDate}
                                    onChange={this.formDateChange}
                                    style={{
                                      textAlign: "center",
                                      height: "50px",
                                    }}
                                  />
                                </div>
                              </div> */}
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
                              {/* <div className="t-time">
                                <span className="t1">
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.hourChangeUp_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.hour_fiter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.hourChange_filter}
                                    />
                                  </small>
                                </span>
                                <span className="t2">
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.minChangeUp_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.min_filter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.minChange_filter}
                                    />
                                  </small>
                                </span>
                                <span
                                  className="t3"
                                  style={{ marginLeft: "2%" }}
                                >
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.ampmChange_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.ampm_filter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.ampmChange_filter}
                                    />
                                  </small>
                                </span>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-app-information" id="tble-data-z">
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
                                <SelectBox
                                  // styles={customStyles}
                                  optionData={this.state.statusArr}
                                  // components={{
                                  //   DropdownIndicator,
                                  //   IndicatorSeparator: () => null,
                                  // }}
                                  value={this.state.statusData}
                                  placeholder="Select"
                                  onSelectChange={(value) => {
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
                                <SelectBox
                                  // styles={customStyles}
                                  optionData={this.state.leiArr}
                                  // components={{
                                  //   DropdownIndicator,
                                  //   IndicatorSeparator: () => null,
                                  // }}
                                  value={this.state.leiData}
                                  placeholder="Select"
                                  onSelectChange={(value) => {
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
                                CONTRACT TYPE{" "}
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
                                  // styles={customStyles}
                                  optionData={contractTypeArr}
                                  // components={{
                                  //   DropdownIndicator,
                                  //   IndicatorSeparator: () => null,
                                  // }}
                                  value={this.state.selectedContract}
                                  placeholder="Select"
                                  onSelectChange={(value) => {
                                    this.onContractChange(value);
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
        {/* ...............translation modal,,,,,,,,,,,,,, */}
        <div
          id="translation-model"
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
                  <div class="_fl filterTab_translation">
                    <ul style={{ cursor: "pointer" }}>
                      <li
                        className="active"
                        data-related="tble-data-d_translation"
                        style={{ padding: "20px 20px" }}
                      >
                        Service Type
                      </li>
                      <li
                        data-related="tble-data-e_translation"
                        style={{ padding: "20px 20px" }}
                      >
                        Language
                      </li>
                      {/* <li
                        data-related="tble-data-f"
                        style={{ padding: "20px 20px" }}
                      >
                        Requester
                      </li> */}
                      {/* <li
                        data-related="tble-data-g"
                        style={{ padding: "20px 20px" }}
                      >
                        Location
                      </li> */}
                      <li
                        data-related="tble-data-h_translation"
                        style={{ padding: "20px 20px" }}
                      >
                        Deadline
                      </li>
                      {/*                     
                        <li
                          data-related="tble-data-i"
                          style={{ padding: "20px 20px" }}
                        >
                          Contract Type
                        </li> */}

                      <li
                        data-related="tble-data-j_translation"
                        style={{ padding: "20px 20px" }}
                      >
                        Status
                      </li>
                      {/* {this.state.isReceivable ? (
                        <li data-related="tble-data-k">Contract Type</li>
                      ) : (
                        <React.Fragment />
                      )} */}
                    </ul>
                  </div>
                </div>
                <div
                  className="tab-app-information activeLnkTranslation "
                  id="tble-data-d_translation"
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
                                  SERVICE TYPE
                                </div>
                              </div>
                              <div className="row">
                                <div
                                  class="dropdwn"
                                  style={{ cursor: "pointer" }}
                                >
                                  <MultiSelectBox
                                    optionData={this.state.allServiceTypeArr}
                                    value={this.state.selectedServiceType}
                                    onSelectChange={(value) =>
                                      this.serviceChange(value)
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
                <div
                  className="tab-app-information"
                  id="tble-data-e_translation"
                >
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
                                        this.onsourceLangChange(value)
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
                {/* <div className="tab-app-information" id="tble-data-f">
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
                </div> */}
                <div
                  className="tab-app-information"
                  id="tble-data-g_translation"
                >
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row">
                                <div className="web-form-bx">
                                  <div
                                    class="lable-text"
                                    style={{
                                      // paddingLeft: "10px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    LOCATION
                                  </div>
                                  <div
                                    class="dropdwn"
                                    // style={{ marginLeft: "25%" }}
                                  >
                                    <div className="tr-3">
                                      <Select
                                        options={this.state.locationArr}
                                        components={{
                                          DropdownIndicator,
                                          IndicatorSeparator: () => null,
                                        }}
                                        value={this.state.locationData}
                                        placeholder="Select"
                                        onChange={(value) =>
                                          this.onLocationChange(value)
                                        }
                                        onInputChange={(value) => {
                                          this.onLocationInputChange(value);
                                        }}
                                        styles={customStylesDropdown}
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
                <div
                  className="tab-app-information"
                  id="tble-data-h_translation"
                >
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="form-search-app">
                            <div
                              className="lable-text"
                              style={{ fontSize: "20px" }}
                            >
                              Expected Deadline
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div
                                  className="input-group"
                                  style={{
                                    width: "100%",
                                    borderRadius: "9px",
                                    height: "43px",
                                    border: "1px solid #ced4da",
                                    boxShadow:
                                      "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                  }}
                                >
                                  <div style={{ width: "80%", padding: "8px" }}>
                                    <span>
                                      FROM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                      {this.state.formDate}
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
                                {/* <div className="t-time">
                                <span className="t1">
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.hourChangeUp_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.hour_fiter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.hourChange_filter}
                                    />
                                  </small>
                                </span>
                                <span className="t2">
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.minChangeUp_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.min_filter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.minChange_filter}
                                    />
                                  </small>
                                </span>
                                <span
                                  className="t3"
                                  style={{ marginLeft: "2%" }}
                                >
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.ampmChange_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.ampm_filter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.ampmChange_filter}
                                    />
                                  </small>
                                </span>
                              </div> */}
                              </div>
                              <div className="col-md-6">
                                <div
                                  className="input-group"
                                  style={{
                                    width: "100%",
                                    borderRadius: "9px",
                                    height: "43px",
                                    border: "1px solid #ced4da",
                                    boxShadow:
                                      "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                  }}
                                >
                                  <div style={{ width: "80%", padding: "8px" }}>
                                    <span>
                                      TO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                      {this.state.toDate}
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
                                {/* <div className="t-time">
                                <span className="t1">
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.hourChangeUp_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.hour_fiter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.hourChange_filter}
                                    />
                                  </small>
                                </span>
                                <span className="t2">
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.minChangeUp_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.min_filter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.minChange_filter}
                                    />
                                  </small>
                                </span>
                                <span
                                  className="t3"
                                  style={{ marginLeft: "2%" }}
                                >
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.ampmChange_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.ampm_filter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.ampmChange_filter}
                                    />
                                  </small>
                                </span>
                              </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="tab-app-information"
                  id="tble-data-j_translation"
                >
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
                                <SelectBox
                                  optionData={statusArr}
                                  value={this.state.statusData}
                                  placeholder="Select"
                                  onSelectChange={(value) => {
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

                {/* <div className="tab-app-information" id="tble-data-i">
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
                                    CONTRACT TYPE{" "}
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
                                      // styles={customStyles}
                                      optionData={contractTypeArr}
                                      // components={{
                                      //   DropdownIndicator,
                                      //   IndicatorSeparator: () => null,
                                      // }}
                                      value={this.state.selectedContract}
                                      placeholder="Select"
                                      onSelectChange={(value) => {
                                        this.onContractChange(value);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* .................training,,,,,,,,,,,,,,,,,,, */}
        <div
          id="training-model"
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
                  <div class="_fl filterTab_training">
                    <ul style={{ cursor: "pointer" }}>
                      <li
                        className="active"
                        data-related="tble-data-d_training"
                        style={{ padding: "20px 20px" }}
                      >
                        Training Category
                      </li>
                      <li
                        data-related="tble-data-e_training"
                        style={{ padding: "20px 20px" }}
                      >
                        Training Course
                      </li>
                      <li
                        data-related="tble-data-f_training"
                        style={{ padding: "20px 20px" }}
                      >
                        Requester
                      </li>
                      <li
                        data-related="tble-data-g_training"
                        style={{ padding: "20px 20px" }}
                      >
                        Format
                      </li>
                      <li
                        data-related="tble-data-h_training"
                        style={{ padding: "20px 20px" }}
                      >
                        Date
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  className="tab-app-information activeLnkTraining "
                  id="tble-data-d_training"
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
                <div className="tab-app-information" id="tble-data-e_training">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row" style={{ padding: "30px" }}>
                            <div className="col-md-12">
                              <div className="row">
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
                <div className="tab-app-information" id="tble-data-f_training">
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
                <div className="tab-app-information" id="tble-data-g_training">
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
                <div className="tab-app-information" id="tble-data-h_training">
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
                              {/* <div className="col-md-10">
                                <div className="form-field-app date-input">
                                  <span style={{ marginTop: "8px" }}>from</span>
                                  <input
                                    type="date"
                                    className="datefield bd"
                                    placeholder="10/25/2021"
                                    value={this.state.formDate}
                                    onChange={this.formDateChange}
                                    style={{
                                      textAlign: "center",
                                      height: "50px",
                                    }}
                                  />
                                </div>
                              </div> */}
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
                              {/* <div className="t-time">
                                <span className="t1">
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.hourChangeUp_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.hour_fiter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.hourChange_filter}
                                    />
                                  </small>
                                </span>
                                <span className="t2">
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.minChangeUp_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.min_filter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.minChange_filter}
                                    />
                                  </small>
                                </span>
                                <span
                                  className="t3"
                                  style={{ marginLeft: "2%" }}
                                >
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.ampmChange_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.ampm_filter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.ampmChange_filter}
                                    />
                                  </small>
                                </span>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-app-information" id="tble-data-z_training">
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
                                <SelectBox
                                  // styles={customStyles}
                                  optionData={this.state.statusArr}
                                  // components={{
                                  //   DropdownIndicator,
                                  //   IndicatorSeparator: () => null,
                                  // }}
                                  value={this.state.statusData}
                                  placeholder="Select"
                                  onSelectChange={(value) => {
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
                <div className="tab-app-information" id="tble-data-j_training">
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
                                <SelectBox
                                  // styles={customStyles}
                                  optionData={this.state.leiArr}
                                  // components={{
                                  //   DropdownIndicator,
                                  //   IndicatorSeparator: () => null,
                                  // }}
                                  value={this.state.leiData}
                                  placeholder="Select"
                                  onSelectChange={(value) => {
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

                <div className="tab-app-information" id="tble-data-i_training">
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
                                CONTRACT TYPE{" "}
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
                                  // styles={customStyles}
                                  optionData={contractTypeArr}
                                  // components={{
                                  //   DropdownIndicator,
                                  //   IndicatorSeparator: () => null,
                                  // }}
                                  value={this.state.selectedContract}
                                  placeholder="Select"
                                  onSelectChange={(value) => {
                                    this.onContractChange(value);
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

        {/* ..............................delete modal............................. */}
        {/* <div id="delete-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg">
          
            <div className="modal-content" style={{ padding: "10px" }}>
              <div className="delete-head">Delete contact</div>
              <div className="modal-body">
                <div className="body-txt">
                  Are You Sure to delete the contact?
                </div>

                <div className="_button-style m30 _fl text-center">
                  <a
                    className="white-btn"
                    style={{ textDecoration: "none", color: "grey" }}
                    onClick={this.onCancel}
                  >
                    NO
                  </a>
                  <a
                    className="blue-btn"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      width: "10%",
                    }}
                    data-dismiss="modal"
                    onClick={() => this.deleteItem()}
                  >
                    Yes
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* ..................Reset Password modal................................. */}
        {/* <div
          id="password-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-body">
             
                <div className="form-search-app">
                  <center>
                    <h6>
                      Are you really want to reset the password for selected
                      user?{" "}
                    </h6>
                  </center>
                  <div className="row">
                    <div className="col-md-4"></div>
                    <div
                      class="_button-style _fl text-center"
                      style={{ marginTop: "2%" }}
                    >
                      <a
                        className="white-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.cancelDelete}
                      >
                        No
                      </a>
                      <a
                        className="blue-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.onResetPassword}
                      >
                        Yes
                      </a>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

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
                      Cancel {this.state.isInterpretation ? "Job" : "Project"}
                      <span style={{ fontSize: "17px", marginLeft: "7px" }}>
                      {this.state.isInterpretation ? "(Interpretation)" : this.state.isTranslation ? "(Translation)" : "(Training)"}  
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
                              {this.state.isInterpretation ? <React.Fragment>
                                <SelectBox
                                optionData={cancelationArr}
                                value={this.state.cancellationData}
                                onSelectChange={(value) => {
                                  this.onCancelDataChange(value);
                                }}
                              />
                              </React.Fragment>:<React.Fragment>
                              <SelectBox
                                optionData={projectcancelationArr}
                                value={this.state.cancellationData}
                                onSelectChange={(value) => {
                                  this.onCancelProjectDataChange(value);
                                }}
                              />
                                </React.Fragment>}
                            
                            </div>
                          </div>
                          {this.state.isInterpretation ? <React.Fragment>
                            {this.state.cancellationData.value == 6 ? <React.Fragment>
                              <div
                            className="web-form-bx selct"
                            // hidden={!this.state.isOtherReason}
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

                            </React.Fragment>:<React.Fragment/>}
                         
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
                          </React.Fragment>: <React.Fragment>
                            
                            </React.Fragment>}
                          
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
        {/* </div> */}
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
