import React, { Component } from "react";
import { styled, Box } from "@mui/system"; //imported for modal
// import ModalUnstyled from "@mui/core/ModalUnstyled"; //imported forr modal
// import FormControl from "@mui/material/FormControl";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import history from "../../../../history";
// import Stack from "@mui/material/Stack";
// import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";

import "./jobdetails.css";

import { AlertMessage, ImageName } from "../../../../enums";
// import { InputText } from "../../../SharedComponents/inputText";
import { ApiCall } from "../../../../services/middleware";
import { CryptoDecoder, Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";
// import {
//   SetDateFormat,
//   SetTimeFormat,
//   textTruncate,
// } from "../../../../../services/common-function";
import {
  inputEmptyValidate,
  mobileNumberValidator,
  numberValidator,
  zipValidate,
} from "../../../../validators";
import { Regex } from "../../../../services/config";
import Select, { components } from "react-select";
import { SmallSelectBox, SelectBox } from "../../SharedComponents/inputText";
import history from "../../../../history";
import ReactLoader from "../../../Loader";
import {
  consoleLog,
  SetDateFormat,
  SetTimeFormat,
} from "../../../../services/common-function";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import { IMAGE_PATH_ONLY, LOCAL_HOST } from "../../../../services/config/api_url";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import EditJob from "./EditJobDetails";
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

const appointmentTypeArr = [
  {
    label: "F2F",
    value: "1",
  },
  {
    label: "VRI",
    value: "2",
  },
];
// const DropdownIndicator = (props) => {
//   return (
//     <components.DropdownIndicator {...props}>
//       <img src={ImageName.IMAGE_NAME.LOCATION} style={{ width: "17px" }} />
//     </components.DropdownIndicator>
//   );
// };

const jobDuration = [
  {
    label: "Minute",
    value: "Minute",
  },
  {
    label: "Hour",
    value: "Hour",
  },
  {
    label: "Day",
    value: "Day",
  },
];

export default class JobDetails extends React.Component {
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
      receivable: [],

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

      arrivalTimeCheck: false,
      startTimeCheck: false,
      endTimeCheck: false,

      reqId: "",
      pathCheck: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    document.getElementById("backdrop").style.display = "none";
    let mainData = this.props.location,
      preData = mainData.state;
    // consoleLog("predata:::",preData);
    if (preData === undefined) {
      return history.push("/adminViewAllJobs");
    } else {
      this.setState({
        reqId: preData,
      });

      this.load();
    }
    // this.load();

    if (this.props.match.path === "/adminJobDetailsFromBillVerification") {
      this.setState({
        pathCheck: true,
      });
    } else {
      this.setState({
        pathCheck: false,
      });
    }

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
      receivable = [],
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
    // consoleLog("Details Data>>>", detailData)

    //...............Get complete summury............

    // let summuryRes = await ApiCall("getJobCompleteSummary", { requestId: 20 });
    let summuryRes = await ApiCall("getJobCompleteSummary", detailData);
    if (
      summuryRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      summuryRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(summuryRes.data.payload);
      consoleLog("Conmplete Summry Job", payload.data);
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
    consoleLog("InterpreatationJobdetails>>>", detailPayload)
    if (detailPayload.data.clientDetails) {
      clientDetails = detailPayload.data.clientDetails;
    }

    // consoleLog("job details:::",detailPayload.data.jobDetails)

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

      // if (quoteInfo.total === 0) {
      //   this.setState({
      //     isView: false
      //   })
      // } else {
      //   this.setState({
      //     isView: true
      //   })
      // }

      if (jobDetails.quoteStatus === 0) {
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
        // consoleLog("Payable List:::", payload.data);
        if (payload.data.details.length > 0) {
          payable = payload.data.details;
        }
      }

      let receivableRes = await ApiCall(
        "fetchAccountReceivabaleInterpretation",
        detailData
      );
      if (
        receivableRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        receivableRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let payload = Decoder.decode(receivableRes.data.payload);
        // consoleLog("Receivable List:::", payload.data);
        if (payload.data.details.length > 0) {
          receivable = payload.data.details;
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
      receivable: receivable,
      otherService: otherService,
      otherServiceData: otherServiceData,
      isLoad: false,
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
    // consoleLog("amount=====>", this.state.particularsArr);
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
    return history.push("/adminViewAllJobs");
  };

  onCreateQuote = async () => {
    let mainData = this.props.location;
    let preData = mainData.state;
    let errorCount = 0;

    // let validateInterpretationFee = inputEmptyValidate(
    //   this.state.interpretationFee
    // );

    if (this.state.interpretationFee === 0) {
      toast.error(AlertMessage.MESSAGE.JOB.EMPTY_FEE, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      let data = {
        requestId: preData,
        fee: this.state.interpretationFee,
        total: this.state.totalAmount,
        rushFee: this.state.rushFee,
        additionalFee: this.state.particularsArr,
      };
      let res = await ApiCall("createQuote", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.JOB.QUOTE_SEND, {
          hideProgressBar: true,
        });
        return history.push("/adminViewAllJobs");
      }
    }
  };

  onUpdateQuote = async () => {
    let mainData = this.props.location;
    let preData = mainData.state;
    let errorCount = 0;

    // let validateInterpretationFee = inputEmptyValidate(
    //   this.state.interpretationFee
    // );

    if (this.state.interpretationFee === 0) {
      toast.error(AlertMessage.MESSAGE.JOB.EMPTY_FEE, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      let data = {
        requestId: preData,
        fee: this.state.interpretationFee,
        total: this.state.totalAmount,
        rushFee: this.state.rushFee,
        additionalFee: this.state.particularsArr,
        quoteId: this.state.quoteId,
      };
      let res = await ApiCall("updateQuote", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.JOB.QUOTE_UPDATE, {
          hideProgressBar: true,
        });
        return history.push("/adminViewAllJobs");
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

  // acceptClient = async () => {
  //   let data = {
  //     clientId: this.state.clientId,
  //     requestId: this.state.requestId
  //   }
  //   let res = await ApiCall("acceptClientQuote", data);
  //   if (
  //     res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
  //     res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  //   ) {
  //     toast.success(AlertMessage.MESSAGE.JOB.QUOTE_ACCEPTED_BY_CLIENT);
  //     setTimeout(
  //       function () {
  //         return history.push("/adminViewAllJobs")
  //       }
  //         .bind(this),
  //       1000
  //     );
  //   }
  // }

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

  changeCompSumpRadioArrivalInterpreter = (e) => {
    // consoleLog("value radio::", e.target.value)
  };

  approvePayable = async (id) => {
    let obj = {
      id: id,
      status: "1",
    };
    let res = await ApiCall("changeStatusAccountPayable", obj);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success("Verified successfullly");
      let apidata = {
        requestId: this.state.requestId,
      };

      let payable = [],
        receivable = [];

      let payableRes = await ApiCall(
        "fetchAccountPayableInterpretation",
        apidata
      );
      if (
        payableRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        payableRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let payload = Decoder.decode(payableRes.data.payload);
        // consoleLog("Payable List:::", payload.data);
        if (payload.data.details.length > 0) {
          payable = payload.data.details;
        }
      }

      let receivableRes = await ApiCall(
        "fetchAccountReceivabaleInterpretation",
        apidata
      );
      if (
        receivableRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        receivableRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let payload = Decoder.decode(receivableRes.data.payload);
        // consoleLog("Receivable List:::", payload.data);
        if (payload.data.details.length > 0) {
          receivable = payload.data.details;
        }
      }

      this.setState({
        payable: payable,
        receivable: receivable,
      });
    }
  };

  onArrivalTimeCheck = (id) => {
    if (id === "1") {
      this.setState({
        arrivalTimeCheck: true,
      });
    } else {
      this.setState({
        arrivalTimeCheck: false,
      });
    }
  };

  onStartTimeCheck = (id) => {
    if (id === "1") {
      this.setState({
        startTimeCheck: true,
      });
    } else {
      this.setState({
        startTimeCheck: false,
      });
    }
  };

  onEndTimeCheck = (id) => {
    if (id === "1") {
      this.setState({
        endTimeCheck: true,
      });
    } else {
      this.setState({
        endTimeCheck: false,
      });
    }
  };

  ratingChangedInterpreter = (value) => {
    let obj = this.state.completeSummary;
    obj.clientRatings = value;
    this.setState({
      completeSummary: obj,
    });
  };

  _onSameInterpreterCheck = (id) => {
    let obj = this.state.completeSummary;
    if (id === "1") {
      obj.isPrefVendor = true;
    } else {
      obj.isPrefVendor = false;
    }
    this.setState({
      completeSummary: obj,
    });
  };

  sameInterpreterReasonChange = (e) => {
    let obj = this.state.completeSummary;
    obj.prefferedReason = e.target.value;
    this.setState({
      completeSummary: obj,
    });
  };

  _onClientFollowUpCheck = (id) => {
    let obj = this.state.completeSummary;
    if (id === "1") {
      obj.followUp = "YES";
    } else {
      obj.followUp = "NO";
    }
    this.setState({
      completeSummary: obj,
    });
  };

  joinVideo = (appointmentType, jobId) => {
    // consoleLog("AppointmentType: ", appointmentType);
    // consoleLog("Job Type::", jobId);
    window.open(LOCAL_HOST + `/servicePage/${appointmentType}/${jobId}`);
  }

  render() {
    // const open = Boolean(this.state.anchorEl); //used in MenuButton open
    // const open1 = Boolean(this.state.anchorEl1);
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
            <Link to="/adminDashboard">Dashboard</Link> /{" "}
            {this.state.pathCheck == true ? (
              <Link to="/adminMainBillUnderVerification">Bills Under Verification</Link>
            ) : (
              <Link to="/adminViewAllJobs">Interpretation Jobs</Link>
            )}{" "}
            / Job Details
          </div>
          <div className="job-details-tab jobdltste _fl sdw">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                {" "}
                <a
                  className="nav-link active"
                  data-toggle="tab"
                  href="#jobdetails"
                >
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.JOB_DETAILS} />
                    </figure>{" "}
                    Job Details
                  </div>
                </a>{" "}
              </li>
              {this.state.quoteStatus >= 9 ? (
                <React.Fragment></React.Fragment>
              ) : (
                <React.Fragment>
                  <li className="nav-item">
                    {" "}
                    <a
                      className="nav-link"
                      data-toggle="tab"
                      href="#editjobdetails"
                    >
                      <div className="taber">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.JOB_DETAILS} />
                        </figure>{" "}
                        Edit Job Details
                      </div>
                    </a>{" "}
                  </li>
                </React.Fragment>
              )}
              <li className="nav-item">
                {" "}
                <a className="nav-link" data-toggle="tab" href="#clientdetails">
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.TAB_USER_ICON} />
                    </figure>
                    Client Details
                  </div>
                </a>{" "}
              </li>
              {this.state.quoteStatus < 8 ?
                <li className="nav-item">
                  {" "}
                  <a className="nav-link" data-toggle="tab" href="#sendqute">
                    <div className="taber">
                      <figure>
                        <img src={ImageName.IMAGE_NAME.TABBAR} />
                      </figure>
                      {!this.state.isView ? "Send Quote" : "View Quote"}
                    </div>
                  </a>{" "}
                </li> : <></>}
              {this.state.quoteStatus === 2 ||
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
              )}
              {this.state.quoteStatus === 10 &&
                this.state.completeSummary.postJobStat > 0 ? (
                <>
                  <li className="nav-item">
                    <a className="nav-link" data-toggle="tab" href="#comp_sum">
                      <div className="taber">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.COMP_SUM} />
                        </figure>
                        Completion Summary
                      </div>
                    </a>
                  </li>
                </>
              ) : (
                <></>
              )}
              {this.state.quoteStatus === 10 &&
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
                          <img src={ImageName.IMAGE_NAME.MENU.INVOICE_DOLLER} />
                        </figure>
                        Payables & Receivables
                      </div>
                    </a>
                  </li>
                </>
              ) : (
                <></>
              )}
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
                                <React.Fragment>
                                  {this.state.quoteStatus === 8 || this.state.quoteStatus === 9 ?
                                    <Button variant="contained" onClick={() => this.joinVideo(this.state.appointmentType, this.state.jobId)}>Join</Button>
                                    : "Not yet assigned to a interpreter"
                                  }
                                </React.Fragment> : "NO"}
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
              </div>
              {/* ................for edit job details page................. */}
              <div className="tab-pane" id="editjobdetails">
                <div className="job-section-tab">
                  <EditJob mainData={this.state.reqId} />
                </div>
              </div>
              {/* ........................send quote...................... */}
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
                            {this.state.quoteStatus < 2 ?
                              <div class="addmore_service text-right">
                                <a href="javascript:void(0)">
                                  <div
                                    onClick={this.addParticularField}
                                    style={{ marginTop: "8px" }}
                                  >
                                    Add Additional Field
                                  </div>
                                </a>
                              </div> : <></>
                            }
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
                                            disabled={
                                              this.state.quoteStatus === 0
                                                ? false
                                                : true
                                            }
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
                                            disabled={
                                              this.state.quoteStatus === 0
                                                ? false
                                                : true
                                            }
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
                                {this.state.particularsArr.length > 0 ? <React.Fragment>
                                  {this.state.particularsArr.map((item, key) => (
                                    <tr>
                                      <td width="50%" align="left">
                                        <input
                                          // disabled
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
                                          <div className="col-md-5"></div>
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
                                          {this.state.quoteStatus < 2 ?
                                            <div className="col-md-1 delete-btn">
                                              <img
                                                src={ImageName.IMAGE_NAME.TRASH_BTN}
                                                onClick={() =>
                                                  this.onDeleteParticulars(key)
                                                }
                                                style={{ cursor: "pointer" }}
                                              />
                                            </div> : <></>
                                          }
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </React.Fragment> : <React.Fragment />}


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
                    {this.state.quoteStatus == 0 || this.state.quoteStatus == 1 ? (
                      <a
                        href="javascript:void(0)"
                        className="blue-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.onUpdateQuote}
                      >
                        Send Quote
                      </a>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                    {/* {this.state.quoteStatus === 1 ? <>
                      <button type="button" class="btn btn-success" onClick={this.acceptClient}>Accept</button> <span style={{ color: "gray" }}>(On behalf of client)</span>
                    </> : <></>
                    } */}
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
                                    {data.status === 0 ? (
                                      <React.Fragment>
                                        <a href="javascript:void(0)">
                                          <img
                                            src={
                                              ImageName.IMAGE_NAME.BLUE_TICK_JPG
                                            }
                                            style={{
                                              width: "20px",
                                              height: "20px",
                                            }}
                                            onClick={() =>
                                              this.approvePayable(data.id)
                                            }
                                          />
                                        </a>
                                        {/* <a href="javascript:void(0)"><img src={ImageName.IMAGE_NAME.CROSS_BTN} style={{ width: "20px", height: "20px" }} /></a> */}
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment></React.Fragment>
                                    )}
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
                          <th style={{ width: "15%" }}>Job ID</th>
                          <th style={{ width: "20%" }}>Language]</th>
                          <th style={{ width: "15%" }}>Client[S]</th>
                          <th style={{ width: "15%" }}>Completed On</th>
                          <th style={{ width: "10%" }}>Total Amount $</th>
                          <th style={{ width: "15%" }}>Status</th>
                          <th style={{ width: "10%" }}>Action</th>
                        </tr>
                        {this.state.receivable.length > 0 ? (
                          <React.Fragment>
                            {this.state.receivable.map((data) => (
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
                                    {data.status === 0 ? (
                                      <React.Fragment>
                                        <a href="javascript:void(0)">
                                          <img
                                            src={
                                              ImageName.IMAGE_NAME.BLUE_TICK_JPG
                                            }
                                            style={{
                                              width: "20px",
                                              height: "20px",
                                            }}
                                            onClick={() =>
                                              this.approvePayable(data.id)
                                            }
                                          />
                                        </a>
                                        {/* <a href="javascript:void(0)"><img src={ImageName.IMAGE_NAME.CROSS_BTN} style={{ width: "20px", height: "20px" }} /></a> */}
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment></React.Fragment>
                                    )}
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
              </div>

              <div className="tab-pane" id="comp_sum">
                <div className="job-section-tab">
                  {Object.keys(this.state.completeSummary).length > 0 ? (
                    <React.Fragment>
                      <h2>CLIENT</h2>
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
                                {/* <th width="33%" align="center">{this.state.completeSummary.isArrivalAprroved}</th> */}
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
                                            name="radioArrival"
                                            checked={
                                              this.state.arrivalTimeCheck ===
                                                true
                                                ? true
                                                : false
                                            }
                                            onClick={(e) =>
                                              this.onArrivalTimeCheck("1")
                                            }
                                          />
                                          <span className="checkmark3"></span>{" "}
                                          Yes
                                        </label>
                                      </div>
                                    </div>
                                    <div className="col-md-2">
                                      <div className="check-field">
                                        <label className="checkbox_btn">
                                          <input
                                            type="radio"
                                            name="radioArrival"
                                            checked={
                                              this.state.arrivalTimeCheck ===
                                                false
                                                ? true
                                                : false
                                            }
                                            onClick={(e) =>
                                              this.onArrivalTimeCheck("0")
                                            }
                                          />
                                          <span className="checkmark3"></span>{" "}
                                          No
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
                                {/* <th width="33%" align="center">{this.state.completeSummary.isStartApproved}</th> */}
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
                                            name="radioStart"
                                            checked={
                                              this.state.startTimeCheck === true
                                                ? true
                                                : false
                                            }
                                            onClick={(e) =>
                                              this.onStartTimeCheck("1")
                                            }
                                          />
                                          <span className="checkmark3"></span>{" "}
                                          Yes
                                        </label>
                                      </div>
                                    </div>
                                    <div className="col-md-2">
                                      <div className="check-field">
                                        <label className="checkbox_btn">
                                          <input
                                            type="radio"
                                            name="radioStart"
                                            checked={
                                              this.state.startTimeCheck ===
                                                false
                                                ? true
                                                : false
                                            }
                                            onClick={(e) =>
                                              this.onStartTimeCheck("0")
                                            }
                                          />
                                          <span className="checkmark3"></span>{" "}
                                          No
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
                                {/* <th width="33%" align="center">{this.state.completeSummary.isEndApproved}</th> */}
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
                                            name="radioEnd"
                                            checked={
                                              this.state.endTimeCheck === true
                                                ? true
                                                : false
                                            }
                                            onClick={(e) =>
                                              this.onEndTimeCheck("1")
                                            }
                                          />
                                          <span className="checkmark3"></span>{" "}
                                          Yes
                                        </label>
                                      </div>
                                    </div>
                                    <div className="col-md-2">
                                      <div className="check-field">
                                        <label className="checkbox_btn">
                                          <input
                                            type="radio"
                                            name="radioEnd"
                                            checked={
                                              this.state.endTimeCheck === false
                                                ? true
                                                : false
                                            }
                                            onClick={(e) =>
                                              this.onEndTimeCheck("0")
                                            }
                                          />
                                          <span className="checkmark3"></span>{" "}
                                          No
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
                          <div className="col-md-6">
                            <div className="rt-rating">
                              {/* <figure><img src={ImageName.IMAGE_NAME.RATTINGSTAR} /></figure> */}
                              <ReactStars
                                count={5}
                                onChange={(value) =>
                                  this.ratingChangedInterpreter(value)
                                }
                                size={44}
                                // isHalf={true}
                                activeColor="#009fe0"
                                value={this.state.completeSummary.clientRatings}
                              // edit={false}
                              />
                              {this.state.completeSummary.clientRatings === 0 ||
                                this.state.completeSummary.clientRatings === 1 ? (
                                <React.Fragment>
                                  <a href="javascript:void(0)" className="poor">
                                    Very Poor
                                  </a>
                                </React.Fragment>
                              ) : (
                                <React.Fragment>
                                  {this.state.completeSummary.clientRatings ===
                                    2 ? (
                                    <React.Fragment>
                                      <a
                                        href="javascript:void(0)"
                                        className="poor"
                                      >
                                        Poor
                                      </a>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment>
                                      {this.state.completeSummary
                                        .clientRatings === 3 ? (
                                        <React.Fragment>
                                          <a
                                            href="javascript:void(0)"
                                            className="poor"
                                          >
                                            Average
                                          </a>
                                        </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          {this.state.completeSummary
                                            .clientRatings === 4 ? (
                                            <React.Fragment>
                                              <a
                                                href="javascript:void(0)"
                                                className="poor"
                                              >
                                                Good
                                              </a>
                                            </React.Fragment>
                                          ) : (
                                            <React.Fragment>
                                              {this.state.completeSummary
                                                .clientRatings === 5 ? (
                                                <React.Fragment>
                                                  <a
                                                    href="javascript:void(0)"
                                                    className="poor"
                                                  >
                                                    Very Good
                                                  </a>
                                                </React.Fragment>
                                              ) : (
                                                <React.Fragment>
                                                  <a
                                                    href="javascript:void(0)"
                                                    className="poor"
                                                  >
                                                    Outstanding
                                                  </a>
                                                </React.Fragment>
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
                          </div>
                        </div>
                      </div>
                      <div className="_fl margin-top-30 br-bx">
                        <div className="row">
                          <div className="col-md-6">
                            <p>Would you use the same interpreter?</p>
                          </div>
                          <div className="col-md-6">
                            {/* <p className="np">{this.state.completeSummary.isPrefVendor}</p> */}
                            <div className="check-field">
                              <label className="checkbox_btn">
                                <input
                                  type="radio"
                                  name="sameInterpreter"
                                  checked={
                                    this.state.completeSummary.isPrefVendor ===
                                      true
                                      ? true
                                      : false
                                  }
                                  onClick={(e) =>
                                    this._onSameInterpreterCheck("1")
                                  }
                                />
                                <span className="checkmark3"></span> Yes
                              </label>
                            </div>
                            <div className="check-field">
                              <label className="checkbox_btn">
                                <input
                                  type="radio"
                                  name="sameInterpreter"
                                  checked={
                                    this.state.completeSummary.isPrefVendor ===
                                      false
                                      ? true
                                      : false
                                  }
                                  onClick={(e) =>
                                    this._onSameInterpreterCheck("0")
                                  }
                                />
                                <span className="checkmark3"></span> No
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      {this.state.completeSummary.isPrefVendor === "N/A" ||
                        this.state.completeSummary.isPrefVendor === false ? (
                        <React.Fragment></React.Fragment>
                      ) : (
                        <React.Fragment>
                          {this.state.completeSummary.isPrefVendor === true ||
                            this.state.completeSummary.isPrefVendor === false ? (
                            <div className="_fl margin-top-30 br-bx">
                              <div className="row">
                                <div className="col-md-6">
                                  <p>Reason</p>
                                </div>
                                <div className="col-md-6">
                                  <textarea
                                    rows="2"
                                    placeholder=""
                                    className="in-textarea msg min"
                                    value={
                                      this.state.completeSummary.prefferedReason
                                    }
                                    style={{
                                      height: "100px",
                                      color: "var(--grey)",
                                      borderRadius: "10px",
                                      boxShadow: "2px",
                                      resize: "none",
                                    }}
                                    onChange={this.sameInterpreterReasonChange}
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <React.Fragment>
                              <div className="_fl margin-top-30 br-bx">
                                <div className="row">
                                  <div className="col-md-6">
                                    <p>Reason</p>
                                  </div>
                                  <div className="col-md-6">
                                    <p>
                                      {
                                        this.state.completeSummary
                                          .prefferedReason
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      )}
                      <div className="_fl margin-top-30 br-bx">
                        <div className="row">
                          <div className="col-md-6">
                            <p>Is there any follow up appointments?</p>
                          </div>
                          <div className="col-md-6">
                            {/* <p className="np">{this.state.completeSummary.followUp}</p> */}
                            {/* <a href="javascript:void(0)" className="_viewdetails">View Details</a>  */}
                            <div className="check-field">
                              <label className="checkbox_btn">
                                <input
                                  type="radio"
                                  name="clientFollowUp"
                                  checked={
                                    this.state.completeSummary.followUp ===
                                      "YES"
                                      ? true
                                      : false
                                  }
                                  onClick={(e) =>
                                    this._onClientFollowUpCheck("1")
                                  }
                                />
                                <span className="checkmark3"></span> Yes
                              </label>
                            </div>
                            <div className="check-field">
                              <label className="checkbox_btn">
                                <input
                                  type="radio"
                                  name="clientFollowUp"
                                  checked={
                                    this.state.completeSummary.followUp === "NO"
                                      ? true
                                      : false
                                  }
                                  onClick={(e) =>
                                    this._onClientFollowUpCheck("0")
                                  }
                                />
                                <span className="checkmark3"></span> No
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="_fl margin-top-30 br-bx">
                        <div className="row">
                          <div className="col-md-12">
                            <h2>VENDOR</h2>
                          </div>
                        </div>
                      </div>
                      <div className="_fl margin-top-30 br-bx">
                        <div className="tbl-iformation ">
                          <div className="table-responsive">
                            <table
                              className="mn"
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td width="50%" align="left">
                                    Interpreter Arrival Date
                                  </td>
                                  <th width="50%" align="center">
                                    {this.state.completeSummary.arrivalTime}
                                  </th>
                                  {/* <th width="33%" align="center">{this.state.completeSummary.isArrivalAprroved}</th> */}
                                </tr>
                                <tr>
                                  <td width="50%" align="left">
                                    Interpreter Start Time
                                  </td>
                                  <th width="50%" align="center">
                                    {this.state.completeSummary.startTime}
                                  </th>
                                  {/* <th width="33%" align="center">{this.state.completeSummary.isStartApproved}</th> */}
                                </tr>
                                <tr>
                                  <td width="50%" align="left">
                                    Interpreter End Time
                                  </td>
                                  <th width="50%" align="center">
                                    {this.state.completeSummary.endTime}
                                  </th>
                                  {/* <th width="33%" align="center">{this.state.completeSummary.isEndApproved}</th> */}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div className="_fl margin-top-30 br-bx">
                        <div className="row">
                          <div className="col-md-6">
                            <p>Provide Follow up details? (if any)</p>
                          </div>
                          <div className="col-md-6">
                            {this.state.completeSummary.followUpDate ===
                              "N/A" ? (
                              <React.Fragment>
                                <p>N/A</p>
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <p>
                                  {this.state.completeSummary.followUpDate} |{" "}
                                  {this.state.completeSummary.followUpTimeRange}
                                </p>
                              </React.Fragment>
                            )}
                            {/* <p>{this.state.completeSummary.followUpDate} | {this.state.completeSummary.followUpTimeRange}</p> */}
                          </div>
                        </div>
                      </div>
                      <div className="_fl margin-top-30 br-bx">
                        <div className="row">
                          <div className="col-md-6">
                            <p>Are you available for follow up?</p>
                          </div>
                          <div className="col-md-6">
                            <p className="np">yes</p>
                          </div>
                        </div>
                      </div>
                      <div className="_fl margin-top-30 br-bx">
                        <div className="row">
                          <div className="col-md-12">
                            <h2>MISCELLANEOUS EXPENSES</h2>
                          </div>
                        </div>
                      </div>
                      <div className="_fl margin-top-30 br-bx">
                        <div className="row">
                          <div className="col-md-6">
                            <p>
                              Are the miscellaneous expences approved by{" "}
                              <span style={{ color: "#00a0df" }}>7C Lingo</span>
                              ?
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p className="np">
                              {
                                this.state.completeSummary
                                  .expensesApproveByAdmin
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      {this.state.completeSummary.expensesApproveByAdmin ===
                        "Yes" ? (
                        <div className="_fl margin-top-30 br-bx">
                          <div className="tbl-iformation ">
                            <div className="table-responsive">
                              <table
                                className="mn"
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                border="0"
                              >
                                <tbody>
                                  <tr>
                                    <th
                                      width="33%"
                                      align="center"
                                      style={{ color: "#b4b4b4" }}
                                    >
                                      Expense Type
                                    </th>
                                    <th
                                      width="33%"
                                      align="center"
                                      style={{ color: "#b4b4b4" }}
                                    >
                                      Incidentals
                                    </th>
                                    <th
                                      width="33%"
                                      align="center"
                                      style={{ color: "#b4b4b4" }}
                                    >
                                      Receipt Amount
                                    </th>
                                  </tr>
                                  {this.state.mislleniousExpenses.length > 0 ? (
                                    <React.Fragment>
                                      {this.state.mislleniousExpenses.map(
                                        (data, i) => (
                                          <React.Fragment key={i}>
                                            <tr>
                                              <th width="33%" align="center">
                                                {data.expenseType}
                                              </th>
                                              <th width="33%" align="center">
                                                <p>
                                                  <a href="javascript:void(0)">
                                                    <img
                                                      src={
                                                        ImageName.IMAGE_NAME
                                                          .DOWNLOADSHEET
                                                      }
                                                      onClick={() =>
                                                        this.onDownloadMisc(i)
                                                      }
                                                    />
                                                  </a>
                                                </p>
                                              </th>
                                              <th width="33%" align="center">
                                                $ {data.amount}
                                              </th>
                                            </tr>
                                          </React.Fragment>
                                        )
                                      )}
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment></React.Fragment>
                                  )}
                                  <tr>
                                    <th colspan="2">Total Amount : </th>
                                    <th width="33%" style={{ color: "green" }}>
                                      ${" "}
                                      {parseFloat(this.state.miscTotal).toFixed(
                                        2
                                      )}{" "}
                                    </th>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <ReactLoader />
                    </React.Fragment>
                  )}
                </div>
              </div>

              <div className="tab-pane" id="vendoroff">
                <div className="job-section-tab">
                  <div
                    className="vendor-info p-10 _fl sdw"
                    style={{ paddingBottom: "10px" }}
                  >
                    <div className="vn-form _fl">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="vn_frm">
                            <span>Rating</span>
                            <div className="bts-drop">
                              <SelectBox
                                optionData={this.state.allRating}
                                value={this.state.selectedFilterRating}
                                onSelectChange={(value) =>
                                  this.filterRatingChange(value)
                                }
                              ></SelectBox>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="vn_frm">
                            <span>Available</span>
                            <div className="bts-drop">
                              <SelectBox
                                optionData={this.state.allWeekDay}
                                value={this.state.selectedFilterWeek}
                                onSelectChange={(value) =>
                                  this.filterWeekChange(value)
                                }
                              ></SelectBox>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          {this.state.appointmentType === "F2F" ? (
                            <div className="vn_frm">
                              <span>Distance</span>
                              <input
                                type="text"
                                className="textbox4"
                                style={{
                                  borderRadius: "9px",
                                  width: "45%",
                                  boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 20%)",
                                }}
                                onChange={this.filterDistanceChange}
                              />{" "}
                              Miles
                            </div>
                          ) : (
                            <React.Fragment></React.Fragment>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="table-filter-app-b">
                    <div className="filter-btn">
                      <a href="javascript:void(0)" onClick={this.filterModal}>
                        Filter
                      </a>
                    </div>
                  </div> */}
                  <div className="table-listing-app">
                    <div className="table-responsive">
                      <table
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >
                        <tbody>
                          <tr>
                            {this.state.isVendorAssigned ? (
                              <React.Fragment></React.Fragment>
                            ) : (
                              <React.Fragment>
                                <th style={{ width: "8%" }}>
                                  <label className="custom_check2">
                                    <input
                                      type="checkbox"
                                      checked={this.state.allChecked}
                                      onClick={this.allVendorCheck}
                                    />
                                    <span className="checkmark2"></span>
                                  </label>
                                </th>
                              </React.Fragment>
                            )}
                            {/* <th style={{ width: "8%" }}>Vendor ID</th> */}
                            {/* <th style={{ width: "9%" }}>Type</th> */}
                            {/* <th style={{ width: "9%" }}>First Name</th> */}
                            <th style={{ width: "20%" }}>Name / Agency</th>
                            {/* <th style={{ width: "11%" }}>Agency</th> */}
                            <th style={{ width: "15%" }}>Email ID</th>
                            <th style={{ width: "15%" }}>Phone Number</th>
                            <th style={{ width: "10%" }}>Ratings</th>
                            <th style={{ width: "10%" }}>Availability</th>
                            <th style={{ width: "15%" }}>Status</th>
                          </tr>
                        </tbody>
                        <tbody>
                          {this.state.listData.length > 0 ? (
                            this.state.listData.map((item, key) => (
                              <tr key={key}>
                                {this.state.isVendorAssigned ? (
                                  <React.Fragment></React.Fragment>
                                ) : (
                                  <React.Fragment>
                                    <td style={{ width: "8%" }}>
                                      <label className="custom_check2">
                                        <input
                                          type="checkbox"
                                          defaultChecked={
                                            item.isQuoteSent === 1
                                              ? true
                                              : false
                                          }
                                          onChange={(e) =>
                                            this.listChecked(e, key)
                                          }
                                        />

                                        <span className="checkmark2"></span>
                                      </label>
                                    </td>
                                  </React.Fragment>
                                )}
                                {/* <td style={{ width: "8%" }}>{item.id}</td> */}
                                {/* <td style={{ width: "9%" }}>{item.type}</td>
                                  <td style={{ width: "9%" }}>{item.fName}</td> */}
                                <td style={{ width: "20%" }}>
                                  {item.agencyName === ""
                                    ? item.fName + " " + item.lName
                                    : item.fName +
                                    " " +
                                    item.lName +
                                    " (" +
                                    item.agencyName +
                                    ")"}
                                </td>
                                {/* <td style={{ width: "11%" }}>
                                      {this.blankValueCheck(item.agencyName)}
                                  </td> */}
                                <td style={{ width: "15%" }}>
                                  <a href="" className="viewlink">
                                    {item.email}
                                  </a>
                                </td>
                                <td style={{ width: "15%" }}>{item.mobile}</td>
                                <td style={{ width: "10%" }}>
                                  <img src={ImageName.IMAGE_NAME.STARYELLOW} />
                                  <span className="rat_txt">
                                    {item.ratings}
                                  </span>
                                </td>
                                <td style={{ width: "10%" }}>
                                  <a
                                    href="javascript:void(0)"
                                    className="view"
                                    style={{
                                      cursor: "pointer",
                                      color: "green",
                                    }}
                                    onClick={() =>
                                      this.handleViewModal(item.userId)
                                    }
                                  >
                                    View
                                  </a>
                                </td>

                                {this.state.quoteStatus === 8 ? (
                                  <React.Fragment>
                                    <td style={{ width: "15%" }}>
                                      {item.status === 2 ? (
                                        <>
                                          <span
                                            style={{
                                              color: "green",
                                              fontSize: "12px",
                                            }}
                                          >
                                            Assigned
                                          </span>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </td>
                                  </React.Fragment>
                                ) : (
                                  <React.Fragment>
                                    <td style={{ width: "15%" }}>
                                      {item.status === 1 ? (
                                        <React.Fragment>
                                          <a
                                            href="javascript:void(0)"
                                            className="bidAssignBtn"
                                            onClick={() => {
                                              this.vendoeAssigned(item.userId);
                                            }}
                                          >
                                            Assign
                                          </a>
                                        </React.Fragment>
                                      ) : (
                                        <React.Fragment></React.Fragment>
                                      )}
                                    </td>
                                  </React.Fragment>
                                )}
                              </tr>
                            ))
                          ) : (
                            <React.Fragment></React.Fragment>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {this.state.quoteStatus === 8 ? (
                    <React.Fragment></React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div className="_button-style _fl text-center margin-top-30">
                        <a href="javascript:void(0)" className="grey-btn">
                          Reset
                        </a>
                        <a
                          href="javascript:void(0)"
                          className="blue-btn"
                          onClick={this.handleVendorAssign}
                        >
                          Send Offer
                        </a>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>

              <div className="tab-pane" id="chattab">
                <div className="job-section-tab">
                  <div className="chat-app-information-component">
                    <div className="prticipants-area _fl">
                      <div className="row">
                        <div className="col-md-6">
                          <h3>3 Participants</h3>
                        </div>

                        <div className="col-md-6">
                          <a href="#" className="add-part-btn">
                            Add Participants
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="chat-app-component">
                      <div className="participants-chat-row">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.LOGO1} />
                        </figure>
                        <div className="chatinfo-bx">
                          <p className="cht-user">
                            <b>Admin ID</b> <span>10:20 AM</span>
                          </p>
                          <p className="chat-text">
                            Kindly check milestones, added bellowKindly check
                            milestones, added bellowKindly check milestones,
                            awKindly check milestones, added bellow
                          </p>
                        </div>
                      </div>
                      <div className="participants-chat-row">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.LOGO1} />
                        </figure>
                        <div className="chatinfo-bx">
                          <p className="cht-user">
                            <b>Admin ID</b> <span>10:20 AM</span>
                          </p>
                          <p className="chat-text">
                            Kindly check milestones, added bellowKindly check
                            milestones, added bellowKindly check milestones,
                            awKindly check milestones, added bellow
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="chat-app-component">
                      <div className="participants-chat-row reply">
                        <div className="chatinfo-bx">
                          <p className="cht-user">
                            <b>Admin ID</b> <span>10:20 AM</span>
                          </p>
                          <p className="chat-text">
                            Kindly check milestones, added bellowKindly check
                            milestones, added bellowKindly check milestones,
                            awKindly check milestones, added bellow
                          </p>
                        </div>
                      </div>
                      <div className="participants-chat-row">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.LOGO1} />
                        </figure>
                        <div className="chatinfo-bx">
                          <p className="cht-user">
                            <b>Admin ID</b> <span>10:20 AM</span>
                          </p>
                          <p className="chat-text">
                            Kindly check milestones, added bellowKindly check
                            milestones, added bellowKindly check milestones,
                            awKindly check milestones, added bellow
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chat-app-type-area">
                    <input
                      type="text"
                      value=""
                      name=""
                      className="chat-field-bx"
                    />
                    <button type="submit" className="send-btn-app">
                      send
                    </button>
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
    consoleLog("props::", this.props.value)
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
