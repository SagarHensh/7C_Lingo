import React from "react";
import Switch from "@mui/material/Switch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ErrorCode, UsersEnums } from "../../../../services/constant";
import { AlertMessage, ImageName } from "../../../../enums";
import { ApiCall, ApiCallClient } from "../../../../services/middleware";
import { Decoder } from "../../../../services/auth";
import { toast, ToastContainer } from "react-toastify";
import { inputEmptyValidate } from "../../../../validators";
import Select, { components } from "react-select";
import {

  SelectBox,
} from "../../../Admin/SharedComponents/inputText";
import history from "../../../../history";
import ReactLoader from "../../../Loader";
import {
  consoleLog,
  SetDateFormat,
  SetTimeFormat,
  SetUSAdateFormat,
} from "../../../../services/common-function";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import { IMAGE_PATH_ONLY, LOCAL_HOST } from "../../../../services/config/api_url";
import EditJob from "../../../Admin/Manage_Interpretation_jobs/JobDetails/EditJobDetails";
import Button from '@mui/material/Button';

// .............................................................

const customStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
    borderRadius: "6px",
    // width: "60%",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = "yellow";
    return {
      ...styles,
      color: isFocused ? "grey" : "white",
      //   backgroundColor: isDisabled ? "red" : "white",
      color: "#000",
      // width: "60%",
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

const followUpTimeArr = [
  {
    label: "8:00 AM - 9:00 AM",
    value: 0,
  },
  {
    label: "9:00 AM - 10:00 AM",
    value: 1,
  },
  {
    label: "10:00 AM - 11:00 AM",
    value: 2,
  },
  {
    label: "11:00 AM - 12:00 AM",
    value: 3,
  },
  {
    label: "12:00 AM - 01:00 PM",
    value: 4,
  },
  {
    label: "01:00 PM - 02:00 PM",
    value: 5,
  },
  {
    label: "02:00 PM - 03:00 PM",
    value: 6,
  },
  {
    label: "03:00 PM - 04:00 PM",
    value: 7,
  },
];

export default class ClientJobDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad: true,
      requestId: "",
      clientId: "",
      clientFirstName: "",
      clientLastName: "",
      clientName: "",
      clientEmailId: "",
      clientPhone: "",
      clientIndustryType: "",
      countryCode: "",
      //   .................jobDetails...........
      jobId: "",
      appointmentType: "",
      jobType: "",
      language: "",
      date: "",
      serviceAddress: "",
      siteContant: "",
      consumer: "",
      notesByClient: "",
      notesBy7C: "",

      // ................sendQuote............
      quoteId: "",
      quoteStatus: 0,
      targetAdience: "",
      location: "",
      dateTime: "",
      notesFromClient: "",
      deliveryType: "",
      duration: "",
      rushFee: 0,
      interpretationFee: 0,
      particularsArr: [],
      particular: "",
      particularAmount: [],
      totalParticularAmt: 0,
      particularAmt: 0,
      particularDataArr: [],
      particularAmountDataArr: [],
      totalAmount: 0,

      appointmentTypeArr: [],
      appointmentTypeData: [],
      languageArr: [],

      sourceLangData: {},
      targetLangData: {},
      listData: [],
      isView: false,

      allChecked: false,
      vendorAssigned: [],
      targetLanguage: "",
      bidFee: 0,
      totalBidFee: 0,
      bidVendorName: "",
      bidVendorId: "",
      isVendorAssigned: false,

      completeSummary: {},
      mislleniousExpenses: [],
      miscTotal: 0.0,
      availabileData: {},
      payable: [],

      allRating: [
        {
          label: "None",
          value: "",
        },
        {
          label: "0",
          value: "0",
        },
        {
          label: "1",
          value: "1",
        },
        {
          label: "2",
          value: "2",
        },
        {
          label: "3",
          value: "3",
        },
        {
          label: "4",
          value: "4",
        },
        {
          label: "5",
          value: "5",
        },
      ],
      selectedFilterRating: {},
      filterRating: "",
      allWeekDay: [
        {
          label: "None",
          value: "",
        },
        {
          label: "Sunday",
          value: "0",
        },
        {
          label: "Monday",
          value: "1",
        },
        {
          label: "Tuesday",
          value: "2",
        },
        {
          label: "Wednesday",
          value: "3",
        },
        {
          label: "Thursday",
          value: "4",
        },
        {
          label: "Friday",
          value: "5",
        },
        {
          label: "Saturday",
          value: "6",
        },
      ],
      selectedFilterWeek: {},
      filterWeek: "",
      filterDistance: "",
      otherService: "",
      otherServiceData: "",

      interpreterCheckIn: "",
      arrivalTimeCheckIn: "",
      startTimeCheckIn: "",
      endTimeCheckIn: "",
      followUpCheckIn: "",

      rating: "",
      reason: "",
      completionData: {},
      followUpDate: "",
      followUpTimeData: {},

      reqId: "",
      actionModal: false,
      modalActionArr: [],
      selectedModalActionArr: {},
      modalNotes: "",
      modalActionData: {},
      modalDataPos: {},

      //   ...................................................

      // countryCode: 1,
      // imagePath: ImageName.IMAGE_NAME.PROFILE_PIC,
      // numbersOption: [],
      // allClientArr: [],
      // selectedClient: {},
      // client: 0,
      // allServiceArr: [],
      // selectedService: {
      //   label: "Interpretation",
      //   value: 45,
      // },
      // service: 45,
      // allAppointmentType: [],
      // selectedAppointmentType: {},
      // appointmentType: "",
      // allLanguage: [],
      // selectedSourceLanguage: {
      //   label: "English",
      //   value: 110,
      // },
      // selectedTargetLanguage: {},
      // sourceLanguage: 110,
      // targetLanguage: [],
      // selectedRequiredInterpreter: {
      //   label: 1,
      //   value: 1,
      // },
      // interpreterRequiredNumber: 1,
      // interpreterCheckIn: false,
      // allJobType: [],
      // jobType: "",
      // jobNotes: "",
      // appointmentNotes: "",
      // appointmentDate: "",
      // hour: "08",
      // min: "00",
      // ampm: "AM",
      // locationData: {},
      // locationArr: [],
      // onsiteContact: "",
      // onSiteContactPhone: "+" + 1 + " ",
      // countrySpecificDialect: false,
      // havePrefferedInterpreter: false,
      // allLeiList: [],
      // leiOptionList: [],
      // selectedLei: {},
      // leiId: "",
      // leiDob: "",
      // leiEmail: "",
      // leiPhone: "",
      // leiCountryCode: "",
      // leiGender: "",
      // leiReference: "",
      // leiCountry: 231,
      // leiLanguage: "",
      // leiNote: "",
      // allCountryOption: [],
      // selectedCountry: {
      //   label: "United States",
      //   valye: 231,
      // },
      // allGenderOption: [],
      // selectedLeiGender: {},
      // selectedLeiLanguage: {},
      // jobDurationValue: 1,
      // allJobDuration: jobDuration,
      // selectedJobDuration: {
      //   label: "Hour",
      //   value: "Hour",
      // },
      // jobDurationLimit: "Hour",
      // clientName: "",
      // clientPhone: "",
      // otherServices: true,
      // otherServicesData: "",

      // userType:0
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    document.getElementById("backdrop").style.display = "none";

    let authData = localStorage.getItem("AuthToken");
    let authUser = Decoder.decode(authData);

    // ........................for client details.......................

    if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT) {
      this.setState({
        userType: UsersEnums.APPLICATION_ROLE.CLIENT,
      });
    } else if (
      authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN
    ) {
      this.setState({
        userType: UsersEnums.APPLICATION_ROLE.SUPER_ADMIN,
      });
    }

    // .....  ..............LEI Data..........................
    if (authData) {
      let data = {
        clientId: authUser.data.userid,
      };
      this.getLEIdata(data);
    }

    let mainData = this.props.location,
      preData = mainData.state;
    // consoleLog("Predata>>>", preData);
    if (preData === undefined) {
      return history.push("/clientAllJobs");
    } else {
      this.setState({
        reqId: preData
      })
      this.load();
    }
    // this.load();

    var classInstance = this;

    var viewModal = document.getElementById("viewModal");
    var bidModal = document.getElementById("bid-modal");
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == viewModal) {
        classInstance.closeViewModal();
      } else if (event.target == bidModal) {
        classInstance.closeBidModal();
      }
    };
  }

  load = async () => {
    let authData = localStorage.getItem("AuthToken");
    let authUser = Decoder.decode(authData);
    let languageArrData = [],
      languageObjData = {},
      languageResArrData = [],
      clientDetails = {},
      jobDetails = {},
      taskLanguage = "",
      quoteData = {},
      quoteInfo = {},
      targetLanguage = "",
      completeSummary = {},
      mislleniousExpenses = [],
      miscTotal = 0.0,
      payable = [],
      otherService = "",
      otherServiceData = "";

    let mainData = this.props.location,
      preData = mainData.state;
    this.setState({
      requestId: preData,
    });
    let detailData = {
      requestId: preData,
    };

    // .............................FOR CLIENT INFO..........................

    if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT) {
      let data = {
        clientid: authUser.data.userid,
      },
        userInfo = [];

      let res = await ApiCall("fetchclientinfo", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let payload = Decoder.decode(res.data.payload);
        // console.log("Client Data>>>>>>>", payload);
        if (payload.data.length > 0) {
          if (payload.data[0].userInfo && payload.data[0].userInfo.length > 0) {
            userInfo = payload.data[0].userInfo[0];
            this.setState({
              clientName: userInfo.clientName,
              clientPhone: userInfo.adminPhone,
            });
          }
        }
      }
    }

    //...............Get complete summury............

    // let summuryRes = await ApiCall("getJobCompleteSummary", { requestId: 20 });
    let summuryRes = await ApiCall("getJobCompleteSummary", detailData);
    if (
      summuryRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      summuryRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(summuryRes.data.payload);
      // consoleLog("Conmplete Summry Job", payload.data);
      if (payload.data.jobSummary) {
        completeSummary = payload.data.jobSummary;
      }
      if (payload.data.miscJobExpense.length > 0) {
        mislleniousExpenses = payload.data.miscJobExpense;
        payload.data.miscJobExpense.map((data) => {
          miscTotal = parseFloat(miscTotal) + parseFloat(data.amount);
        });
      }
    }

    // .............................................

    let detailsRes = await ApiCall("getJobDetails", detailData);

    let detailPayload = Decoder.decode(detailsRes.data.payload);

    consoleLog("Client Job details:", detailPayload);
    if (detailPayload.data.clientDetails) {
      clientDetails = detailPayload.data.clientDetails;
    }
    if (detailPayload.data.jobDetails) {
      jobDetails = detailPayload.data.jobDetails;
    }
    if (Object.keys(detailPayload.data.quoteInfo).length > 0) {
      quoteInfo = detailPayload.data.quoteInfo;
      if (
        quoteInfo.additionalFee != null ||
        quoteInfo.additionalFee != undefined ||
        quoteInfo.additionalFee != ""
      ) {
        quoteData = JSON.parse(quoteInfo.additionalFee);
      }

      if (quoteInfo.total === 0) {
        this.setState({
          isView: false,
        });
      } else {
        this.setState({
          isView: true,
        });
      }
    }
    if (detailPayload.data.taskList.length > 0) {
      taskLanguage =
        detailPayload.data.taskList[0].sourceLanguage +
        " --> " +
        detailPayload.data.taskList[0].targetLanguage;
      targetLanguage = detailPayload.data.taskList[0].targetLanguageId;
    } else {
      taskLanguage = detailPayload.data.jobDetails.sourceLanguage;
    }

    //................ For all Vendor.................
    let vData = {
      requestId: preData,
      targetLanguageId: targetLanguage,
      distance: "",
      rating: "",
      weekIndex: "",
      hourlyRate: "",
    };

    this.getAvailableVendors(vData);

    if (jobDetails.quoteStatus === 10) {
      //...............Get Payable and Receivable Data............

      let payableRes = await ApiCall(
        "fetchAccountPayableInterpretation",
        detailData
      );
      if (
        payableRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        payableRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let payload = Decoder.decode(payableRes.data.payload);
        // consoleLog("Payable and Receivable", payload.data);
        if (payload.data.details.length > 0) {
          payable = payload.data.details;
        }
      }
    }

    if (jobDetails.appointmentType !== "F2F") {
      otherService = jobDetails.otherServices;
      otherServiceData = jobDetails.otherServicesData;
    }

    // ...........................................

    this.setState({
      // sourceLangData: languageObjData,
      // targetLangData: languageObjData,
      // languageArr: languageArrData,
      // .......... For Client Details..........
      clientId: jobDetails.clientId,
      clientFirstName: clientDetails.fName,
      clientLastName: clientDetails.lName,
      clientEmailId: clientDetails.businessEmail,
      clientName: clientDetails.clientName,
      clientIndustryType: clientDetails.industtryType,
      clientPhone: clientDetails.adminPhone,
      //............For Job Details  tab..........
      quoteStatus: jobDetails.quoteStatus,
      jobId: jobDetails.jobId,
      appointmentType: jobDetails.appointmentType,
      jobType: jobDetails.jobType,
      language: taskLanguage,
      date: jobDetails.scheduleDate,
      countryCode: clientDetails.adminCountryCode,
      serviceAddress:
        jobDetails.location === null ||
          jobDetails.location === undefined ||
          jobDetails.location === ""
          ? "N/A"
          : jobDetails.location,
      siteContant:
        jobDetails.siteContact === undefined ||
          jobDetails.siteContact === null ||
          jobDetails.siteContact === ""
          ? "N/A"
          : jobDetails.siteContact,
      consumer: jobDetails.consumer,
      notesByClient: jobDetails.noteByClient,
      notesBy7C: jobDetails.noteFor7C,
      quoteId:
        quoteInfo.quoteId === null ||
          quoteInfo.quoteId === undefined ||
          quoteInfo.quoteId === ""
          ? "N/A"
          : quoteInfo.quoteId,
      targetAdience:
        jobDetails.targetAudience === null ||
          jobDetails.targetAudience === undefined ||
          jobDetails.targetAudience === ""
          ? "N/A"
          : jobDetails.targetAudience,
      location:
        jobDetails.location === null ||
          jobDetails.location === undefined ||
          jobDetails.location === ""
          ? "N/A"
          : jobDetails.location,
      dateTime: jobDetails.scheduleDate,
      scheduleTime: jobDetails.scheduleTime,
      serviceProvider: jobDetails.noOfserviceProvider,
      notesFromClient: jobDetails.noteByClient,
      deliveryType: clientDetails.isOutOfTown === 1 ? "OUT OF TOWN" : "IN TOWN",
      duration: jobDetails.duration,
      clientIndustryType: clientDetails.industtryType,
      interpretationFee: quoteInfo.fee,
      rushFee: quoteInfo.rushFee,
      totalAmount: quoteInfo.total,
      particularsArr: quoteData,
      targetLanguage: targetLanguage,
      completeSummary: completeSummary,
      mislleniousExpenses: mislleniousExpenses,
      miscTotal: miscTotal,
      payable: payable,
      otherService: otherService,
      otherServiceData: otherServiceData,
      isLoad: false,

      reason: completeSummary.prefferedReason,
    });
  };

  getLEIdata = async (data) => {
    let arr = [];
    let res = await ApiCall("fetchLeiByClient", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(res.data.payload);
      // console.log("PAyload>>>", payload.data);
      if (payload.data.leiList.length > 0) {
        payload.data.leiList.map((ldata) => {
          arr.push({
            label: ldata.name,
            value: ldata.userId,
          });
        });
      }
      this.setState({
        allLeiList: payload.data.leiList,
        leiOptionList: arr,
      });
    }
  };

  interpreterCheckIn = (e) => {
    this.setState({
      interpreterCheckIn: e.target.value,
    });
  };

  arrivalTimeCheck = (e) => {
    console.log("e.target.value", e.target.checked);
    // if (e.target.value === "yes") {
    this.setState({
      arrivalTimeCheckIn: e.target.value,
    });
  };

  startTimeCheckIn = (e) => {
    this.setState({
      startTimeCheckIn: e.target.value,
    });
  };

  endTimeCheckIn = (e) => {
    this.setState({
      endTimeCheckIn: e.target.value,
    });
  };

  followUpYes = (e) => {
    this.setState({
      followUpCheckIn: true,
    });
  };
  followUpNo = (e) => {
    this.setState({
      followUpCheckIn: false,
    });
  };

  getAvailableVendors = async (data) => {
    let res = await ApiCall("getVendorsWorkingStatus", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      // consoleLog("All Vendor List>>>>>", payload.data)
      let vendorList = [],
        brr = [];

      if (payload.data.vendorList.length > 0) {
        vendorList = payload.data.vendorList;
        let scount = 0;
        payload.data.vendorList.map((aa) => {
          if (aa.isQuoteSent === 1) {
            brr.push(aa.userId);
          }
          if (aa.status === 2) {
            scount++;
          }
        });
        if (scount > 0) {
          this.setState({
            isVendorAssigned: true,
          });
        }
      }
      this.setState({
        listData: vendorList,
        vendorAssigned: brr,
      });
    }
  };

  blankValueCheck = (data) => {
    if (
      data === null ||
      data === undefined ||
      data === "" ||
      data.length === 0
    ) {
      data = "N/A";
      return data;
    } else {
      return data;
    }
  };

  // listApi = async (data) => {
  //   const res = await ApiCall("fetchapprovedclientcontactlist", data);
  //   console.log("resData::::", res);
  //   if (
  //     res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
  //     res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  //   ) {
  //     const decodeData = Decoder.decode(res.data.payload);
  //     console.log("Payload data>>>", decodeData);
  //     let listDetails = decodeData.data.clientContactDetailsList;
  //     let totalPage = Math.ceil(decodeData.data.totalCount / this.state.limit);
  //     console.log("Total Page>>>", listDetails);
  //     this.setState({
  //       listData: decodeData.data.clientContactDetailsList,
  //       total_page: totalPage,
  //     });
  //   }
  // };

  onAppointmentChange = (data) => {
    this.setState({
      appointmentTypeData: data,
    });
  };

  onSourceLangChange = (data) => {
    this.setState({
      sourceLangData: data,
    });
  };

  onTargetLangChange = (data) => {
    this.setState({
      targetLangData: data,
    });
  };
  onParticularChange = (e, index) => {
    let amt = this.state.particularsArr,
      particularData = [],
      particularDataArr = [];
    for (let i = 0; i < this.state.particularsArr.length; i++) {
      if (i === index) {
        amt[i].title = e.target.value;
        particularDataArr.push(amt[i].title);
      }
      particularData.push(amt[i].title);
    }
    // console.log("amount==>", particularData);
    // console.log("particular==>", amt);

    this.setState({
      particularsArr: amt,
      particularDataArr: particularData,
    });
  };

  onParticularAmountChange = (e, index) => {
    console.log("amount=====>", this.state.particularsArr);
    let data = e.target.value,
      particularAmtDataArr = [];
    var valid = !isNaN(data);

    let amount = e.target.value === "" ? 0 : parseInt(e.target.value);
    // console.log("))))))))))))))))))))", amount);

    let amt = this.state.particularsArr,
      rushfee = this.state.rushFee,
      interpretationFee = this.state.interpretationFee,
      totalAmt = 0,
      sum = 0;
    if (valid) {
      for (let i = 0; i < amt.length; i++) {
        if (i === index) {
          amt[i].amt = amount.toString();
          particularAmtDataArr.push(amt[i].amt);
        }

        sum = sum + parseFloat(amt[i].amt);
      }
      totalAmt = sum + parseFloat(rushfee) + parseFloat(interpretationFee);
    }

    // console.log("amount==>", this.state.particularsArr);
    this.setState({
      particularsArr: amt,
      totalParticularAmt: sum,
      totalAmount: totalAmt,
      // particularAmountDataArr: particularAmtDataArr,
    });
  };
  onRushFeeChange = (e) => {
    let totalAmt = 0;

    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      totalAmt =
        totalAmt +
        parseFloat(e.target.value) +
        parseFloat(this.state.interpretationFee) +
        parseFloat(this.state.totalParticularAmt);
      this.setState({
        rushFee: parseFloat(e.target.value),
        totalAmount: totalAmt,
      });
    } else {
      totalAmt =
        totalAmt +
        parseFloat(this.state.interpretationFee) +
        parseFloat(this.state.totalParticularAmt);
      this.setState({
        rushFee: 0,
        totalAmount: totalAmt,
      });
    }
  };
  onInterpretationFeeChange = (e) => {
    let totalAmt = 0;

    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      totalAmt =
        totalAmt +
        parseFloat(e.target.value) +
        parseFloat(this.state.rushFee) +
        parseFloat(this.state.totalParticularAmt);
      this.setState({
        interpretationFee: parseFloat(e.target.value),
        totalAmount: totalAmt,
      });
    } else {
      totalAmt =
        totalAmt +
        parseFloat(this.state.rushFee) +
        parseFloat(this.state.totalParticularAmt);
      this.setState({
        interpretationFee: 0,
        totalAmount: totalAmt,
      });
    }
  };
  addParticularField = () => {
    let arr = this.state.particularsArr;
    // particularItem = "",
    // particularAmnt = 0;
    // for (let i = 0; i < this.state.particularsArr.length; i++) {
    arr.push({
      title: this.state.particular,
      // particularAmt: parseInt(this.state.particularAmt),
      amt: this.state.particularAmt,
    });

    this.setState({
      particularsArr: arr,
    });
  };
  onDeleteParticulars = (index) => {
    // console.log("index no:", index);
    let particularArray = this.state.particularsArr;

    let arr = [],
      amt = 0,
      particularAmt = 0;
    for (let i = 0; i < particularArray.length; i++) {
      if (i != index) {
        particularAmt = particularAmt + parseFloat(particularArray[i].amt);
        arr.push(particularArray[i]);
      }
    }
    amt =
      amt +
      particularAmt +
      parseFloat(this.state.rushFee) +
      parseFloat(this.state.interpretationFee);

    // console.log("_____+++++", arr);

    this.setState({
      particularsArr: arr,
      totalAmount: amt,
      totalParticularAmt: particularAmt,
    });
  };
  onBack = () => {
    return history.push("/clientAllJobs");
  };

  onCancelSummary = () => {
    return history.push("/clientAllJobs");
  };
  formDateChange = (date) => {
    // let data = this.state.completionData;
    // data.followUpDate = e.target.value;
    this.setState({
      // completionData: this.state.completionData,
      followUpDate: SetUSAdateFormat(date),
    });
  };

  onFollowupTimeChange = (dat) => {
    // let obj = { label: dat.label, value: dat.value };
    // let data = this.state.completionData;
    // data.followUpTimeRange = dat.label;
    this.setState({
      completionData: this.state.completionData,
      followUpTimeData: dat,
    });
  };

  onSubmitSummary = () => {
    // consoleLog("maindata::",mainData)
    let errorCount = 0;
    let validateArrivalTime = inputEmptyValidate(this.state.arrivalTimeCheckIn),
      validateStartTime = inputEmptyValidate(this.state.startTimeCheckIn),
      validateEndTime = inputEmptyValidate(this.state.endTimeCheckIn),
      validateRating = inputEmptyValidate(this.state.rating),
      validateInterpreter = inputEmptyValidate(this.state.interpreterCheckIn),
      validateReason = inputEmptyValidate(this.state.reason),
      validateFollowUp = inputEmptyValidate(this.state.followUpCheckIn);

    if (validateArrivalTime === false) {
      toast.error("Please select Arrival Time !!");
      errorCount++;
    } else if (validateStartTime === false) {
      toast.error("Please select Start Time !!");
      errorCount++;
    } else if (validateEndTime === false) {
      toast.error("Please select End Time !!");
      errorCount++;
    } else if (validateRating === false) {
      toast.error("Please Rate your Interpreter !!");
      errorCount++;
    } else if (validateInterpreter === false) {
      toast.error("Please select would you use same Interpreter or not !!");
      errorCount++;
    } else if (validateReason === false && this.state.interpreterCheckIn) {
      toast.error("Please enter Reason !!");
      errorCount++;
    } else if (validateFollowUp === false) {
      toast.error("Please select Follow up Appointment !!");
      errorCount++;
    }

    if (errorCount === 0) {
      let data = {
        requestId: this.state.requestId,
        arrivalTime: this.state.arrivalTimeCheckIn === "true" ? "1" : "0",
        startTime: this.state.startTimeCheckIn === "true" ? "1" : "0",
        endTime: this.state.endTimeCheckIn === "true" ? "1" : "0",
        rating: this.state.rating,
        sameInterpreter: this.state.interpreterCheckIn === true ? "1" : "0",
        reason: this.state.reason,
        followup: this.state.followUpCheckIn === true ? "1" : "0",
        followupDate: this.state.followUpDate,
        followupTime: this.state.followUpTimeData.value,
      };

      consoleLog("data::::", data);
    }
  };

  onCreateQuote = async () => {
    let authData = localStorage.getItem("AuthToken");
    let authUser = Decoder.decode(authData);
    consoleLog("auth", authData);
    let mainData = this.props.location;
    let preData = mainData.state;
    let errorCount = 0;

    let validateInterpretationFee = inputEmptyValidate(
      this.state.interpretationFee
    );

    // if (validateInterpretationFee === false) {
    if (this.state.interpretationFee === 0) {
      toast.error(AlertMessage.MESSAGE.JOB.EMPTY_FEE, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      let data = {
        clientId: authUser.data.userid,
        requestId: this.state.requestId,
      };
      let res = await ApiCall("acceptClientQuote", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.JOB.QUOTE_ACCEPTED_BY_CLIENT);
        setTimeout(
          function () {
            return history.push("/clientAllJobs");
          }.bind(this),
          1000
        );
      } else {
        toast.error(res.message);
      }
    }
  };

  allVendorCheck = (e) => {
    let arr = this.state.listData;
    let brr = [];
    if (e.target.checked) {
      arr.map((data) => {
        data.isQuoteSent = 1;
        brr.push(data.userId);
      });
      this.setState({
        allChecked: true,
        listData: arr,
        vendorAssigned: brr,
      });
    } else {
      arr.map((data) => {
        data.isQuoteSent = 0;
      });
      brr = [];
      this.setState({
        allChecked: false,
        listData: arr,
        vendorAssigned: brr,
      });
    }
  };

  listChecked = (e, i) => {
    let arr = this.state.listData,
      brr = this.state.vendorAssigned;
    if (e.target.checked) {
      arr[i].isQuoteSent = 1;
      brr.push(arr[i].userId);
      this.setState({
        vendorAssigned: brr,
      });
    } else {
      arr[i].isQuoteSent = 0;
      brr.map((data, k) => {
        if (data === arr[i].userId) {
          brr.splice(k, 1);
        }
      });
      this.setState({
        vendorAssigned: brr,
      });
    }
  };

  handleVendorAssign = async () => {
    let data = {
      requestId: this.state.requestId,
      vendorId: this.state.vendorAssigned,
    };
    // consoleLog("Sent Offer Data>>>", data)
    let res = await ApiCall("sentOfferToVendor", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.JOB.OFFER_SENT_SUCCESS);
      setTimeout(
        function () {
          return history.push("/adminViewAllJobs");
        }.bind(this),
        1000
      );
    }
  };

  handleViewModal = async (userId) => {
    let res = await ApiCall("fetchVendorAvailablityList", {
      vendorId: userId,
    });
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);

      this.setState({
        availabileData: payload.data,
      });
      this.openViewModal();
    }
  };
  openViewModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("viewModal").style.display = "block";
    document.getElementById("viewModal").classList.add("show");
  };
  closeViewModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("viewModal").style.display = "none";
    document.getElementById("viewModal").classList.remove("show");
  };

  handleBidModal = async (vid) => {
    let arr = this.state.listData;
    arr.map((data) => {
      if (data.userId === vid) {
        this.setState({
          bidVendorName: data.fName + " " + data.lName,
          bidFee: data.bidFee,
          totalBidFee: data.totalBidFee,
          bidVendorId: vid,
        });
      }
    });
    this.openBidModal();
  };
  openBidModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("bid-modal").style.display = "block";
    document.getElementById("bid-modal").classList.add("show");
  };
  closeBidModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("bid-modal").style.display = "none";
    document.getElementById("bid-modal").classList.remove("show");
  };

  vendoeAssigned = async (vid) => {
    let apiObj = {
      requestId: this.state.requestId,
      vendorId: vid,
    };
    let res = await ApiCall("assignTraningInterpretion", apiObj);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.JOB.VENDOR_ASSIGNED_SUCCESS);
      this.closeBidModal();
      setTimeout(
        function () {
          return history.push("/adminViewAllJobs");
        }.bind(this),
        1000
      );
    }
  };

  acceptClient = async () => {
    let data = {
      clientId: this.state.clientId,
      requestId: this.state.requestId,
    };
    // consoleLog("Request data::", data)
    let res = await ApiCall("acceptClientQuote", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      window.scrollTo(0, 0);
      toast.success(AlertMessage.MESSAGE.JOB.QUOTE_ACCEPTED);
      // setTimeout(
      //   function () {
      return history.push("/clientAllJobs");
      //   }
      //     .bind(this),
      //   1000
      // );
    } else {
      toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
    }
  };

  onDecline = async () => {
    let data = {
      clientId: this.state.clientId,
      requestId: this.state.requestId,
    };
    let res = await ApiCallClient("rejectClientQuote", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      window.scrollTo(0, 0);
      toast.success(AlertMessage.MESSAGE.JOB.QUOTE_REJECTED);
      // setTimeout(
      //   function () {
      //     return history.push("/clientAllJobs")
      //   }
      //     .bind(this),
      //   1000
      // );
    }
  };

  filterModal = () => {
    this.openFilterModal();
  };
  // .............filter modal function...................
  openFilterModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("filter-model").style.display = "block";
    document.getElementById("filter-model").classList.add("show");
  };

  closeFilterModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("filter-model").style.display = "none";
    document.getElementById("filter-model").classList.remove("show");
  };

  filterRatingChange = (value) => {
    this.setState({
      filterRating: value.value,
    });
    // let rating = value.value;
    let vData = {
      requestId: this.state.requestId,
      targetLanguageId: this.state.targetLanguage,
      distance: this.state.filterDistance,
      rating: value.value,
      weekIndex: this.state.filterWeek,
      hourlyRate: "",
    };

    this.getAvailableVendors(vData);
  };

  filterWeekChange = (value) => {
    this.setState({
      filterWeek: value.value,
    });
    let vData = {
      requestId: this.state.requestId,
      targetLanguageId: this.state.targetLanguage,
      distance: this.state.filterDistance,
      rating: this.state.filterRating,
      weekIndex: value.value,
      hourlyRate: "",
    };

    this.getAvailableVendors(vData);
  };

  filterDistanceChange = (e) => {
    this.setState({
      filterDistance: e.target.value,
    });
    let vData = {
      requestId: this.state.requestId,
      targetLanguageId: this.state.targetLanguage,
      distance: e.target.value,
      rating: this.state.filterRating,
      weekIndex: this.state.filterWeek,
      hourlyRate: "",
    };

    this.getAvailableVendors(vData);
  };

  onDownloadMisc = (pos) => {
    window.open(
      IMAGE_PATH_ONLY + this.state.mislleniousExpenses[pos].incidentals,
      "_blank"
    );
  };

  ratingChanged = (newRating) => {
    console.log(newRating);
    this.setState({
      rating: newRating,
    });
  };

  onJobNotesChange = (e) => {
    this.setState({
      reason: e.target.value,
    });
  };

  joinVideo = (appointmentType, jobId) => {
    // consoleLog("AppointmentType: ", appointmentType);
    // consoleLog("Job Type::", jobId);
    window.open(LOCAL_HOST + `/servicePage/${appointmentType}/${jobId}`);
  }

  render() {
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
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>

        <div className="component-wrapper" hidden={this.state.isLoad}>
          {/* <ReactLoader /> */}
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            {" "}
            <Link to="/clientDashboard">Dashboard</Link> /{" "}
            <Link to="/clientAllJobs">Interpretation Jobs</Link> / Job Details
          </div>
          <div className="job-details-tab jobdltste _fl sdw">
            <ul
              className="nav nav-tabs"
              style={{ justifyContent: "flex-start" }}
            >
              <li className="nav-item">
                {" "}
                <a
                  className="nav-link active"
                  data-toggle="tab"
                  href="#jobdetails"
                //   href="#comp_sum"
                >
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.JOB_DETAILS} />
                    </figure>{" "}
                    Job Details
                  </div>
                </a>{" "}
              </li>
              {this.state.quoteStatus == 7 ||
                this.state.quoteStatus == 9 ||
                this.state.quoteStatus == 6 ||
                this.state.quoteStatus == 8 ||
                this.state.quoteStatus == 10 ||
                this.state.quoteStatus == 11 ? <React.Fragment>

              </React.Fragment> : <React.Fragment>
                <li className="nav-item">
                  {" "}
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="#editjobdetails"
                  //   href="#comp_sum"
                  >
                    <div className="taber">
                      <figure>
                        <img src={ImageName.IMAGE_NAME.JOB_DETAILS} />
                      </figure>{" "}
                      Edit Job Details
                    </div>
                  </a>{" "}
                </li>
              </React.Fragment>}

              {this.state.quoteStatus === null ||
                this.state.quoteStatus === "" ||
                this.state.quoteStatus === undefined ||
                this.state.quoteStatus === 7 ? (
                <React.Fragment />
              ) : this.state.quoteStatus === 10 ? (
                <React.Fragment>
                  <li className="nav-item">
                    {" "}
                    <a className="nav-link" data-toggle="tab" href="#comp_sum">
                      <div className="taber">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.TABBAR} />
                        </figure>
                        Completion Summary
                      </div>
                    </a>{" "}
                  </li>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <li className="nav-item">
                    {" "}
                    <a className="nav-link" data-toggle="tab" href="#sendqute">
                      <div className="taber">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.TABBAR} />
                        </figure>
                        View Quote
                      </div>
                    </a>{" "}
                  </li>
                </React.Fragment>
              )}

              {/* {this.state.quoteStatus === 2 ||
              this.state.quoteStatus === 3 ||
              this.state.quoteStatus === 6 ||
              this.state.quoteStatus === 8 ? (
                <li className="nav-item">
                  {" "}
                  <a className="nav-link" data-toggle="tab" href="#vendoroff">
                    <div className="taber">
                      <figure>
                        <img src={ImageName.IMAGE_NAME.TAB_USER_ICON} />
                      </figure>
                      Available Vendors
                    </div>
                  </a>{" "}
                </li>
              ) : (
                <React.Fragment></React.Fragment>
              )} */}
              {/* {this.state.quoteStatus === 10 &&
              this.state.completeSummary.postJobStat > 1 ? (
                <>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      data-toggle="tab"
                      href="#payablerecavable"
                    >
                      <div className="taber">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.CHAT_ICON} />
                        </figure>
                        Payables & Receivables
                      </div>
                    </a>
                  </li>
                </>
              ) : (
                <></>
              )} */}
              {/* {this.state.quoteStatus === 10 &&
              this.state.completeSummary.postJobStat > 0 ? (
                <>
                  <li className="nav-item">
                    <a className="nav-link" data-toggle="tab" href="#comp_sum">
                      <div className="taber">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.TABBAR} />
                        </figure>
                        Completion Summary
                      </div>
                    </a>
                  </li>
                </>
              ) : (
                <></>
              )} */}
              {/* <li className="nav-item">
                {" "}
                <a className="nav-link" data-toggle="tab" href="#clientdetails">
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.TAB_USER_ICON} />
                    </figure>
                    Client Details
                  </div>
                </a>{" "}
              </li> */}
              {/* <li className="nav-item">
                {" "}
                <a className="nav-link" data-toggle="tab" href="#chattab">
                  <div className="taber">
                    <figure>
                      <img
                        src={ImageName.IMAGE_NAME.CHAT_ICON}
                        style={{ padding: "10px", width: "48px" }}
                      />
                    </figure>
                    Chat{" "}
                  </div>
                </a>{" "}
              </li> */}
              {/* <li className="nav-item">
                {" "}
                <a className="nav-link" data-toggle="tab" href="#nofifications">
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.NOTIFICATION_ICON} />
                    </figure>
                    Notifications
                  </div>
                </a>{" "}
              </li> */}
            </ul>

            <div className="tab-content">
              <div className="tab-pane  active" id="jobdetails">
                <div className="job-section-tab">
                  <table
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                  >
                    <tbody>
                      <tr>
                        <td width="50%" align="left">
                          Job ID
                        </td>
                        <th width="50%" align="right">
                          {this.state.jobId}
                        </th>
                      </tr>

                      <tr>
                        <td width="50%" align="left">
                          Appointment Type
                        </td>
                        <th width="50%" align="right">
                          <div className="f2f-b">
                            {this.state.appointmentType}
                          </div>
                        </th>
                      </tr>

                      <tr>
                        <td width="50%" align="left">
                          Job Type
                        </td>
                        <th width="50%" align="right">
                          {this.state.jobType}
                        </th>
                      </tr>

                      <tr>
                        <td width="50%" align="left">
                          Language
                        </td>
                        <th width="50%" align="right">
                          {this.state.language}
                        </th>
                      </tr>
                      <tr>
                        <td width="50%" align="left">
                          Date
                        </td>
                        <th width="50%" align="right">
                          {SetDateFormat(this.state.date)}{" "}
                          {this.state.scheduleTime}
                        </th>
                      </tr>

                      <tr>
                        <td width="50%" align="left">
                          Service Location Address
                        </td>
                        <th width="50%" align="right">
                          {this.state.serviceAddress}
                        </th>
                      </tr>

                      <tr>
                        <td width="50%" align="left">
                          No. of service provider
                        </td>
                        <th width="50%" align="right">
                          {this.state.serviceProvider}
                        </th>
                      </tr>

                      <tr>
                        <td width="50%" align="left">
                          Site Contant
                        </td>
                        <th width="50%" align="right">
                          {this.state.siteContant}
                        </th>
                      </tr>

                      <tr>
                        <td width="50%" align="left">
                          Consumer
                        </td>
                        <th width="50%" align="right">
                          {this.state.consumer}
                        </th>
                      </tr>
                      <tr>
                        <td width="50%" align="left">
                          Notes by Client
                        </td>
                        <th width="50%" align="right">
                          &nbsp;{this.state.notesByClient}
                        </th>
                      </tr>
                      {this.state.appointmentType !== "F2F" ? (
                        <React.Fragment>
                          <tr>
                            <td width="50%" align="left">
                              <p class="notes">
                                <span>7C Lingo</span> voice/video services
                              </p>
                            </td>
                            <th width="50%" align="right">
                              &nbsp;
                              {this.state.otherService === 1 ?
                                <Button variant="contained" onClick={() => this.joinVideo(this.state.appointmentType, this.state.jobId)}>Join</Button>
                                : "NO"}
                            </th>
                          </tr>
                          {this.state.otherService === 0 ? (
                            <React.Fragment>
                              <tr>
                                <td width="50%" align="left">
                                  3rd party services
                                </td>
                                <th width="50%" align="right">
                                  &nbsp;{this.state.otherServiceData}
                                </th>
                              </tr>
                            </React.Fragment>
                          ) : (
                            <React.Fragment></React.Fragment>
                          )}
                        </React.Fragment>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}
                      <tr>
                        <td width="50%" align="left">
                          <p class="notes">
                            Notes From <span>7C Lingo</span>
                          </p>
                        </td>
                        <th width="50%" align="right">
                          &nbsp;{this.state.notesBy7C}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* .......................................................................... */}
              </div>

              {/* ................for edit job details page................. */}
              <div className="tab-pane" id="editjobdetails">
                <div className="job-section-tab">
                  <EditJob mainData={this.state.reqId} />
                </div>
              </div>

              <div className="tab-pane" id="sendqute">
                <div className="job-section-tab">
                  <div className="view-quote-details-wrap">
                    <h3>view quote details</h3>
                    <p>
                      <span>Quote ID</span>
                      {this.state.quoteId}
                    </p>
                    {/* <p>
                      <span>Target Audience</span> {this.state.targetAdience}
                    </p> */}
                    <p>
                      <span>Location</span> {this.state.location}
                    </p>
                    <p>
                      <span>Appontment Type</span> {this.state.appointmentType}
                    </p>
                    <p>
                      <span>Date & Time</span>{" "}
                      {SetDateFormat(this.state.dateTime)}{" "}
                      {this.state.scheduleTime}
                    </p>
                    <p>
                      <span>Notes from Client</span>
                      {this.state.notesFromClient}
                    </p>
                    <p>
                      <span>Industry Type</span> {this.state.clientIndustryType}
                    </p>
                    <p>
                      <span>Language</span> {this.state.language}
                    </p>
                  </div>

                  <div className="add-more-field">
                    <div className="table-listing-app create">
                      <div className="creat_quot">
                        <h3>
                          {!this.state.isView ? "Create Quote" : "View Quote"}
                        </h3>
                        <div className="depr_table">
                          <div className="table-responsive_mb">
                            {/* <div class="addmore_service text-right">
                              <a href="javascript:void(0)">
                                <div
                                  onClick={this.addParticularField}
                                  style={{ marginTop: "8px" }}
                                >
                                  Add Additional Field
                                </div>
                              </a>
                            </div> */}
                            <table
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tbody>
                                {this.state.appointmentType === "F2F" ? (
                                  <tr>
                                    <th width="50%" align="left">
                                      Delivery Type
                                    </th>
                                    <th width="50%" align="right">
                                      {this.state.deliveryType}
                                    </th>
                                  </tr>
                                ) : (
                                  <React.Fragment />
                                )}

                                <tr>
                                  <td width="50%" align="left">
                                    No. of service provider
                                  </td>
                                  <th width="50%" align="right">
                                    {this.state.serviceProvider}
                                  </th>
                                </tr>

                                <tr>
                                  <td width="50%" align="left">
                                    Duration
                                  </td>
                                  <td width="50%" align="right">
                                    {this.state.duration}
                                  </td>
                                </tr>

                                <tr>
                                  <td width="50%" align="left">
                                    Rush Fee
                                  </td>
                                  <td width="50%" align="right">
                                    <div className="row">
                                      <div className="col-md-6"></div>
                                      <div className="col-md-6">
                                        <div
                                          className="input-group"
                                          style={{ justifyContent: "end" }}
                                        >
                                          <div class="input-group-prepend">
                                            <span
                                              class="input-group-text dollar"
                                              id="basic-addon1"
                                            >
                                              $
                                            </span>
                                          </div>

                                          <input
                                            disabled
                                            className="inputfield flr"
                                            type="text"
                                            value={this.state.rushFee}
                                            style={{ width: "75%" }}
                                            onChange={(e) =>
                                              this.onRushFeeChange(e)
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>

                                <tr>
                                  <td width="50%" align="left">
                                    Interpretation Fee
                                  </td>
                                  <td width="50%" align="right">
                                    <div className="row">
                                      <div className="col-md-6"></div>
                                      <div className="col-md-6">
                                        <div
                                          className="input-group"
                                          style={{ justifyContent: "end" }}
                                        >
                                          <div class="input-group-prepend">
                                            <span
                                              class="input-group-text dollar"
                                              id="basic-addon1"
                                            >
                                              $
                                            </span>
                                          </div>

                                          <input
                                            disabled
                                            className="inputfield flr"
                                            type="text"
                                            value={this.state.interpretationFee}
                                            style={{ width: "75%" }}
                                            onChange={(e) =>
                                              this.onInterpretationFeeChange(e)
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    {/* <input
                                      className="inputfield flr"
                                      type="text"
                                      value={this.state.interpretationFee}
                                      onChange={(e) =>
                                        this.onInterpretationFeeChange(e)
                                      }
                                    /> */}
                                  </td>
                                </tr>
                                {this.state.particularsArr.length > 0 ? (
                                  <React.Fragment>
                                    {this.state.particularsArr.map(
                                      (item, key) => (
                                        <tr>
                                          <td width="50%" align="left">
                                            <input
                                              disabled
                                              className="inputfield flr"
                                              type="text"
                                              placeholder="Particulars"
                                              value={item.title}
                                              onChange={(e) =>
                                                this.onParticularChange(e, key)
                                              }
                                            />
                                          </td>
                                          <td width="50%" align="right">
                                            <div className="row">
                                              <div className="col-md-6"></div>
                                              <div className="col-md-6">
                                                <div
                                                  className="input-group"
                                                  style={{
                                                    justifyContent: "end",
                                                  }}
                                                >
                                                  <div class="input-group-prepend">
                                                    <span
                                                      class="input-group-text dollar"
                                                      id="basic-addon1"
                                                    >
                                                      $
                                                    </span>
                                                  </div>

                                                  <input
                                                    disabled
                                                    className="inputfield flr"
                                                    type="text"
                                                    placeholder="Enter Amount"
                                                    value={item.amt}
                                                    style={{ width: "75%" }}
                                                    onChange={(e) =>
                                                      this.onParticularAmountChange(
                                                        e,
                                                        key
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </div>
                                              {/* <div className="col-md-1 delete-btn">
                                          <img
                                            src={ImageName.IMAGE_NAME.TRASH_BTN}
                                            onClick={() =>
                                              this.onDeleteParticulars(key)
                                            }
                                            style={{ cursor: "pointer" }}
                                          />
                                        </div> */}
                                            </div>
                                            {/* <input
                                        className="inputfield flr"
                                        type="text"
                                        placeholder="Enter Amount"
                                        value={item.amt}
                                        onChange={(e) =>
                                          this.onParticularAmountChange(e, key)
                                        }
                                      />
                                      &nbsp;{" "}
                                      <span>
                                        <img
                                          src={ImageName.IMAGE_NAME.TRASH_BTN}
                                          onClick={() =>
                                            this.onDeleteParticulars(key)
                                          }
                                          style={{ cursor: "pointer" }}
                                        />
                                      </span> */}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </React.Fragment>
                                ) : (
                                  <React.Fragment />
                                )}

                                <tr>
                                  <td
                                    width="50%"
                                    align="left"
                                    style={{ color: "#5ea076" }}
                                  >
                                    Total Payable
                                  </td>
                                  <td
                                    width="50%"
                                    align="right"
                                    style={{ color: "#5ea076" }}
                                  >
                                    $ {parseFloat(this.state.totalAmount)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="_button-style m30 _fl text-center">
                    <a
                      href="javascript:void(0)"
                      className="white-btn"
                      style={{ textDecoration: "none" }}
                      onClick={this.onBack}
                    >
                      Back
                    </a>
                    {this.state.quoteStatus === 1 ?
                      <>
                        <a
                          href="javascript:void(0)"
                          className="white-btn"
                          style={{ textDecoration: "none", color: "red" }}
                          onClick={this.onDecline}
                        >
                          Decline
                        </a>
                      </> : <></>
                    }
                    {this.state.quoteStatus === 1 ? (
                      <>
                        <a
                          href="javascript:void(0)"
                          className="blue-btn"
                          style={{ textDecoration: "none" }}
                          onClick={this.acceptClient}
                        >
                          Accept
                        </a>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>

              <div className="tab-pane" id="clientdetails">
                <div className="job-section-tab">
                  <h3>Client Information</h3>
                  <div className="c-l-s _fl">
                    <div className="row">
                      <div className="col-md-4">
                        <h4>First Name</h4>
                        <p>{this.state.clientFirstName}</p>
                      </div>
                      <div className="col-md-4">
                        <h4>Last Name</h4>
                        <p>{this.state.clientLastName}</p>
                      </div>
                      <div className="col-md-4">
                        <h4>Client</h4>
                        <p>
                          <span className="blue">{this.state.clientName}</span>
                        </p>
                      </div>
                      <div className="col-md-4">
                        <h4>Email ID</h4>
                        <p>{this.state.clientEmailId}</p>
                      </div>
                      <div className="col-md-4">
                        <h4>Phone Number</h4>
                        <p>
                          {"+"}
                          {this.state.countryCode} {this.state.clientPhone}
                        </p>
                      </div>
                      <div className="col-md-4">
                        <h4>Industry Type</h4>
                        <p>{this.state.clientIndustryType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tab-pane" id="payablerecavable">
                <div className="acc_payable">
                  <h3>Account Payables </h3>
                  <div className="table-listing-app tblt">
                    <div className="table-responsive">
                      <table
                        width="100%"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <th style={{ width: "15%" }}>Job ID</th>
                          <th style={{ width: "20%" }}>Language</th>
                          <th style={{ width: "15%" }}>Vendor[S]</th>
                          <th style={{ width: "15%" }}>Completed On</th>
                          <th style={{ width: "10%" }}>Total Amount $</th>
                          <th style={{ width: "15%" }}>Status</th>
                          <th style={{ width: "10%" }}>Action</th>
                        </tr>
                        {this.state.payable.length > 0 ? (
                          <React.Fragment>
                            {this.state.payable.map((data) => (
                              <React.Fragment>
                                <tr>
                                  <td>{this.state.jobId}</td>
                                  <td>
                                    {data.sourceLanguage} {">"}{" "}
                                    {data.targetlanguage}
                                  </td>
                                  <td>{data.name}</td>
                                  <td>
                                    {SetDateFormat(data.endTime)} |{" "}
                                    {SetTimeFormat(data.endTime)}
                                  </td>
                                  <td>${data.totalAmount}</td>
                                  <td>
                                    {data.status === 0 ? (
                                      <React.Fragment>
                                        Verification Pending
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        {data.status === 1 ? (
                                          <React.Fragment>
                                            Verified
                                          </React.Fragment>
                                        ) : (
                                          <React.Fragment>
                                            Invoice Generated
                                          </React.Fragment>
                                        )}
                                      </React.Fragment>
                                    )}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <a href="javascript:void(0)">
                                      <img
                                        src={ImageName.IMAGE_NAME.BLUE_TICK_JPG}
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                        }}
                                      />
                                    </a>
                                    <a href="javascript:void(0)">
                                      <img
                                        src={ImageName.IMAGE_NAME.CROSS_BTN}
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                        }}
                                      />
                                    </a>
                                  </td>
                                </tr>
                              </React.Fragment>
                            ))}
                          </React.Fragment>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
                <div className="acc_payable">
                  <h3>Account Receivables</h3>
                  <div className="table-listing-app tblt">
                    <div className="table-responsive">
                      <table
                        width="100%"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <th style={{ width: "15%" }}>Task ID</th>
                          <th style={{ width: "20%" }}>Task[S]</th>
                          <th style={{ width: "15%" }}>Vendor[S]</th>
                          <th style={{ width: "15%" }}>Completed On</th>
                          <th style={{ width: "10%" }}>Total Amount $</th>
                          <th style={{ width: "15%" }}>Status</th>
                          <th style={{ width: "10%" }}>Action</th>
                        </tr>

                        <tr>
                          <td>0001/123</td>
                          <td>Translation</td>
                          <td>Steve Paul</td>
                          <td>Mar 25,21 | 10:00 AM</td>
                          <td>$50.00</td>
                          <td>Varification Pending</td>
                          <td style={{ textAlign: "center" }}>
                            <a href="javascript:void(0)">
                              <img
                                src={ImageName.IMAGE_NAME.BLUE_TICK_JPG}
                                style={{ width: "20px", height: "20px" }}
                              />
                            </a>
                            <a href="javascript:void(0)">
                              <img
                                src={ImageName.IMAGE_NAME.CROSS_BTN}
                                style={{ width: "20px", height: "20px" }}
                              />
                            </a>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tab-pane" id="comp_sum">
                <div className="job-section-tab">
                  {/* {Object.keys(this.state.completeSummary).length > 0 ? <React.Fragment> */}
                  {/* <h2>CLIENT</h2> */}
                  <div className="tbl-iformation">
                    <div className="table-responsive">
                      <table
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >
                        <tbody>
                          <tr>
                            <td width="33%" align="left">
                              Interpreter Arrival Time
                            </td>
                            <th width="33%" align="center">
                              {this.state.completeSummary.arrivalTime}
                            </th>
                            <th width="33%" align="center">
                              <div
                                className="row"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                }}
                              >
                                <div className="col-md-2">
                                  <div className="check-field">
                                    <label className="checkbox_btn">
                                      <input
                                        type="radio"
                                        name="radio"
                                        value="true"
                                        checked={
                                          this.state.arrivalTimeCheckIn === "true"
                                        }
                                        onChange={
                                          this.arrivalTimeCheck
                                        }
                                      />
                                      <span className="checkmark3"></span> Yes
                                    </label>
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="check-field">
                                    <label className="checkbox_btn">
                                      <input
                                        type="radio"
                                        name="radio"
                                        value="false"
                                        checked={
                                          this.state.arrivalTimeCheckIn ===
                                          "false"

                                        }
                                        onChange={
                                          this.arrivalTimeCheck
                                        }
                                      />
                                      <span className="checkmark3"></span> No
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <td width="33%" align="left">
                              Interpreter Start Time
                            </td>
                            <th width="33%" align="center">
                              {this.state.completeSummary.startTime}
                            </th>
                            <th width="33%" align="center">
                              <div
                                className="row"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                }}
                              >
                                <div className="col-md-2">
                                  <div className="check-field">
                                    <label className="checkbox_btn">
                                      <input
                                        type="radio"
                                        name="radioStartTime"
                                        value="true"
                                        checked={
                                          this.state.startTimeCheckIn === "true"

                                        }
                                        onChange={
                                          this.startTimeCheckIn
                                        }
                                      />
                                      <span className="checkmark3"></span> Yes
                                    </label>
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="check-field">
                                    <label className="checkbox_btn">
                                      <input
                                        type="radio"
                                        name="radioStartTime"
                                        value="false"
                                        checked={
                                          this.state.startTimeCheckIn === "false"

                                        }
                                        onChange={
                                          this.startTimeCheckIn
                                        }
                                      />
                                      <span className="checkmark3"></span> No
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <td width="33%" align="left">
                              Interpreter End Time
                            </td>
                            <th width="33%" align="center">
                              {this.state.completeSummary.endTime}
                            </th>
                            <th width="33%" align="center">
                              <div
                                className="row"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                }}
                              >
                                <div className="col-md-2">
                                  <div className="check-field">
                                    <label className="checkbox_btn">
                                      <input
                                        type="radio"
                                        name="radioEndTime"
                                        value="true"
                                        checked={
                                          this.state.endTimeCheckIn === "true"

                                        }
                                        onChange={
                                          this.endTimeCheckIn
                                        }
                                      />
                                      <span className="checkmark3"></span> Yes
                                    </label>
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="check-field">
                                    <label className="checkbox_btn">
                                      <input
                                        type="radio"
                                        name="radioEndTime"
                                        value="false"
                                        checked={
                                          this.state.endTimeCheckIn === "false"

                                        }
                                        onChange={
                                          this.endTimeCheckIn
                                        }
                                      />
                                      <span className="checkmark3"></span> No
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="_fl margin-top-30 br-bx">
                    <div className="row">
                      <div className="col-md-6">
                        <p> Rate Your Interpreter</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="rt-rating">
                          {/* <figure><img src={ImageName.IMAGE_NAME.RATTINGSTAR} /></figure> */}
                          <ReactStars
                            count={5}
                            onChange={this.ratingChanged}
                            size={44}
                            isHalf={false}
                            activeColor="#009fe0"
                            value={this.state.rating}
                            edit={true}
                          />
                          {/* {this.state.completeSummary.clientRatings === 0 || this.state.completeSummary.clientRatings === 1 ? <React.Fragment>
                              <a href="javascript:void(0)" className="poor">Very Poor</a></React.Fragment> : <React.Fragment>
                              {this.state.completeSummary.clientRatings === 2 ? <React.Fragment>
                                <a href="javascript:void(0)" className="poor">Poor</a>
                              </React.Fragment> : <React.Fragment>
                                {this.state.completeSummary.clientRatings === 3 ? <React.Fragment>
                                  <a href="javascript:void(0)" className="poor">Average</a>
                                </React.Fragment> : <React.Fragment>
                                  {this.state.completeSummary.clientRatings === 4 ? <React.Fragment>
                                    <a href="javascript:void(0)" className="poor">Good</a>
                                  </React.Fragment> : <React.Fragment>
                                    {this.state.completeSummary.clientRatings === 5 ? <React.Fragment>
                                      <a href="javascript:void(0)" className="poor">Very Good</a>
                                    </React.Fragment> : <React.Fragment>
                                      <a href="javascript:void(0)" className="poor">Outstanding</a>
                                    </React.Fragment>
                                    }
                                  </React.Fragment>
                                  }
                                </React.Fragment>
                                }
                              </React.Fragment>
                              }
                            </React.Fragment>
                            } */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="_fl margin-top-30 br-bx">
                    <div className="row">
                      <div className="col-md-6">
                        <p>Would you use the same interpreter? *</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-2">
                        <div className="check-field">
                          <label className="checkbox_btn">
                            <input
                              type="radio"
                              name="radiostart"
                              value="true"
                              checked={
                                this.state.interpreterCheckIn === "true"
                              }
                              onChange={this.interpreterCheckIn}
                            />
                            <span className="checkmark3"></span> Yes
                          </label>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="check-field">
                          <label className="checkbox_btn">
                            <input
                              type="radio"
                              name="radiostart"
                              value="false"
                              checked={
                                this.state.interpreterCheckIn === "false"
                              }
                              onchange={this.interpreterCheckIn}
                            />
                            <span className="checkmark3"></span> No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="_fl margin-top-30 br-bx">
                    {this.state.interpreterCheckIn ? (
                      <React.Fragment>
                        <div className="row">
                          <div className="col-md-6">
                            <p>Reason</p>
                          </div>
                        </div>

                        <div className="row">
                          <div className="web-form-bx md4">
                            <textarea
                              rows="2"
                              placeholder=""
                              className="in-textarea msg min"
                              value={this.state.reason}
                              style={{
                                height: "100px",
                                color: "var(--grey)",
                                borderRadius: "10px",
                                boxShadow: "2px",
                                resize: "none",
                                width: "300px",
                              }}
                              onChange={this.onJobNotesChange}
                            ></textarea>
                          </div>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment />
                    )}
                  </div>
                  <div className="_fl margin-top-30 br-bx">
                    <div className="row">
                      <div className="col-md-6">
                        <p>Is there any follow up appointments?</p>
                      </div>
                      <div className="row">
                        <div className="col-md-2">
                          <div className="check-field">
                            <label className="checkbox_btn">
                              <input
                                type="radio"
                                name="radioFollowUp"
                                value="true"
                                checked={
                                  this.state.followUpCheckIn === "true"

                                }
                                onChange={this.followUp}
                              />
                              <span className="checkmark3"></span> Yes
                            </label>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="check-field">
                            <label className="checkbox_btn">
                              <input
                                type="radio"
                                name="radioFollowUp"
                                value="false"
                                checked={
                                  this.state.followUpCheckIn === "false"

                                }
                                onClick={this.followUp}
                              />
                              <span className="checkmark3"></span> No
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    {[
                      this.state.followUpCheckIn == "true" ? (
                        <React.Fragment>
                          <div className="_fl margin-top-30 br-bx">
                            <div className="row" style={{ padding: "15px" }}>
                              <div className="col-md-4">
                                Provide follow up details
                              </div>
                            </div>
                            <div className="_fl margin-top-30 br-bx">
                              <div className="row">
                                <div className="col-md-3">
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
                                    <div
                                      style={{ width: "80%", padding: "8px" }}
                                    >
                                      <span>{this.state.followUpDate}</span>
                                    </div>
                                    <div style={{ width: "20%" }}>
                                      <a style={{ float: "right" }}>
                                        <DatePicker
                                          minDate={new Date()}
                                          onChange={(date) =>
                                            this.formDateChange(date)
                                          }
                                          customInput={<Schedule />}
                                        />
                                      </a>
                                    </div>
                                  </div>

                                  {/* <input
                                  type="date"
                                  className="datefield bd"
                                  placeholder="10/25/2021"
                                  value={this.state.followUpDate}
                                  onChange={this.formDateChange}
                                  style={{
                                    textAlign: "center",
                                    height: "40px",
                                    width: "200px",
                                  }}
                                /> */}
                                </div>
                                <div className="col-md-3">
                                  <div
                                    className="dropdwn"
                                    style={{ width: "200px" }}
                                  >
                                    <SelectBox
                                      optionData={followUpTimeArr}
                                      value={this.state.followUpTimeData}
                                      placeholder="Select"
                                      onSelectChange={(value) => {
                                        this.onFollowupTimeChange(value);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ) : (
                        <React.Fragment />
                      ),
                    ]}
                  </div>

                  <div className="_button-style m30 _fl text-center">
                    <a
                      href="javascript:void(0)"
                      className="white-btn"
                      style={{ textDecoration: "none" }}
                      onClick={this.onCancelSummary}
                    >
                      cancel
                    </a>
                    <a
                      href="#"
                      className="blue-btn"
                      style={{ textDecoration: "none" }}
                      onClick={this.onSubmitSummary}
                    >
                      Submit
                    </a>
                    {/* {this.state.quoteStatus === 1 ? <>
                      <button type="button" class="btn btn-success" onClick={this.acceptClient}>Accept</button> <span style={{ color: "gray" }}>(On behalf of client)</span>
                    </> : <></>
                    } */}
                  </div>
                </div>
              </div>

              <div className="tab-pane" id="nofifications">
                Notification
              </div>
            </div>
          </div>
        </div>
        {/* //.................... For availability Modal................... */}

        <div id="viewModal" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="filter-head _fl document-hd">
                <h3 className="text-center center-text">
                  Interpreter Availability
                </h3>
                <button
                  type="button"
                  className="close"
                  onClick={() => this.closeViewModal()}
                >
                  X
                </button>
              </div>

              <div className="modal-body">
                <div className="table-listing-app card">
                  <div className="table-responsive">
                    {Object.keys(this.state.availabileData).length > 0 ? (
                      <BidModal value={this.state.availabileData} />
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                  </div>
                </div>

                <div className="_button-style _fl text-center">
                  {/* <a className="grey-btn" onClick={() => this.closeModal()}>cancel</a> */}
                  {/* <a className="blue-btn">save</a> */}
                  {/* <a href="#" className="buledark-btn">save & reverse</a> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* //...................... For Bid Modal....................... */}
        <div
          id="bid-modal"
          className="modal fade modelwindow largewindow"
          role="dialog"
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body p30">
                <div className="mtch-top-text">
                  <p>
                    <span>Job ID</span> {this.state.jobId}
                  </p>
                  <p>
                    <span>Task</span> {this.state.language}
                  </p>
                  <p>
                    <span>Client Name</span> {this.state.clientFirstName}{" "}
                    {this.state.clientLastName}
                  </p>
                </div>

                <div className="mv-text _fl">
                  <h2>Vendor Bid Details</h2>
                </div>

                <div className="matching-vendor-table _fl sdw">
                  <div className="depr_table p10">
                    <div className="table-responsive">
                      <table
                        width="100%"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tbody>
                          <tr>
                            <th style={{ width: "60%" }}>Vendor Name</th>
                            <th style={{ width: "10%" }} className="th_1">
                              {this.state.bidVendorName}
                            </th>
                          </tr>
                          <tr>
                            <td>Rate / Hour</td>
                            <td>$ {this.state.bidFee}</td>
                          </tr>

                          <tr className="tt-count">
                            <td className="f1">Total Bid</td>
                            <td> $ {this.state.totalBidFee}</td>
                          </tr>
                          {/* <tr>
                            <td>&nbsp;</td>
                            <td  ><a className="bidAssignBtn">Assign</a></td>
                          </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12" style={{ textAlign: "center" }}>
                      <a
                        href="javascript:void(0)"
                        className="bidAssignBtn"
                        onClick={() => {
                          this.vendoeAssigned(this.state.bidVendorId);
                        }}
                      >
                        Assign
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ..................modal................................. */}
        <div id="filter-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-md modal-dialog-centered">
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
                  <div className="m-select _fl">
                    <div class="row">
                      <div class="col-md-5">
                        <div class="sf-row">
                          <div class="lable-text" style={{ fontSize: "13px" }}>
                            Distance
                          </div>
                          <input type="text" />
                        </div>
                      </div>
                      <div className="col-md-1"></div>
                      <div class="col-md-5">
                        <div class="sf-row">
                          <div class="lable-text" style={{ fontSize: "13px" }}>
                            Rating
                          </div>
                          <div class="dropdwn" style={{ cursor: "pointer" }}>
                            <SelectBox />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: "20px" }}>
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
                    </div>
                  </div>
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

class BidModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <th style={{ width: "14%" }}>Sunday</th>
            <th style={{ width: "14%" }}>Monday</th>
            <th style={{ width: "14%" }}>Tuesday</th>
            <th style={{ width: "14%" }}>Wednesday</th>
            <th style={{ width: "14%" }}>Thursday</th>
            <th style={{ width: "14%" }}>Friday</th>
            <th style={{ width: "14%" }}>Saturday</th>
          </tr>
          <tr>
            <td
              style={{
                justifyContent: "center",
              }}
            >
              {this.props.value.Sunday.map((obj) => (
                <React.Fragment>
                  <div>
                    {obj.serviceName.split(",").map((item) => (
                      <div className="f2f_rate">{item}</div>
                    ))}
                    <div
                      style={{
                        marginLeft: "5px",
                        marginTop: "8px",
                      }}
                    >
                      {obj.startTime} - {obj.endTime}
                    </div>
                  </div>
                  <br />
                </React.Fragment>
              ))}
            </td>
            {/* .............monday................. */}
            <td
              style={{
                justifyContent: "center",
              }}
            >
              {this.props.value.Monday.map((obj) => (
                <React.Fragment>
                  <div>
                    {obj.serviceName.split(",").map((item) => (
                      <div className="f2f_rate">{item}</div>
                    ))}
                    <div
                      style={{
                        marginLeft: "5px",
                        marginTop: "8px",
                      }}
                    >
                      {obj.startTime} - {obj.endTime}
                    </div>
                  </div>
                  <br />
                </React.Fragment>
              ))}
            </td>
            {/* ..............Tuesday................ */}
            <td
              style={{
                justifyContent: "center",
              }}
            >
              {this.props.value.Tuesday.map((obj) => (
                <React.Fragment>
                  <div>
                    {obj.serviceName.split(",").map((item) => (
                      <div className="f2f_rate">{item}</div>
                    ))}
                    <div
                      style={{
                        marginLeft: "5px",
                        marginTop: "8px",
                      }}
                    >
                      {obj.startTime} - {obj.endTime}
                    </div>
                  </div>
                  <br />
                </React.Fragment>
              ))}
            </td>
            {/* ..........wednesday............... */}
            <td
              style={{
                justifyContent: "center",
              }}
            >
              {this.props.value.Wednesday.map((obj) => (
                <React.Fragment>
                  <div>
                    {obj.serviceName.split(",").map((item) => (
                      <div className="f2f_rate">{item}</div>
                    ))}
                    <div
                      style={{
                        marginLeft: "5px",
                        marginTop: "8px",
                      }}
                    >
                      {obj.startTime} - {obj.endTime}
                    </div>
                  </div>
                  <br />
                </React.Fragment>
              ))}
            </td>
            {/* ................thursday............... */}
            <td
              style={{
                justifyContent: "center",
              }}
            >
              {this.props.value.Thursday.map((obj) => (
                <React.Fragment>
                  <div>
                    {obj.serviceName.split(",").map((item) => (
                      <div className="f2f_rate">{item}</div>
                    ))}
                    <div
                      style={{
                        marginLeft: "5px",
                        marginTop: "8px",
                      }}
                    >
                      {obj.startTime} - {obj.endTime}
                    </div>
                  </div>
                  <br />
                </React.Fragment>
              ))}
            </td>
            {/* ............friday.................... */}
            <td
              style={{
                justifyContent: "center",
              }}
            >
              {this.props.value.Friday.map((obj) => (
                <React.Fragment>
                  <div>
                    {obj.serviceName.split(",").map((item) => (
                      <div className="f2f_rate">{item}</div>
                    ))}
                    <div
                      style={{
                        marginLeft: "5px",
                        marginTop: "8px",
                      }}
                    >
                      {obj.startTime} - {obj.endTime}
                    </div>
                  </div>
                  <br />
                </React.Fragment>
              ))}
            </td>
            {/* ................saturday.......... */}
            <td
              style={{
                justifyContent: "center",
              }}
            >
              {this.props.value.Saturday.map((obj) => (
                <React.Fragment>
                  <div>
                    {obj.serviceName.split(",").map((item) => (
                      <div className="f2f_rate">{item}</div>
                    ))}
                    <div
                      style={{
                        marginLeft: "5px",
                        marginTop: "8px",
                      }}
                    >
                      {obj.startTime} - {obj.endTime}
                    </div>
                  </div>
                  <br />
                </React.Fragment>
              ))}
            </td>
          </tr>
        </table>
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
