import React, { Component } from "react";

import { AlertMessage, ImageName } from "../../../../../enums";
import { ApiCall, ApiCallClient, ApiCallVendor } from "../../../../../services/middleware";
import { CryptoDecoder, Decoder } from "../../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";
import {
  inputEmptyValidate,
} from "../../../../../validators";
import { Regex } from "../../../../../services/config";
import Select, { components } from "react-select";
// import { SmallSelectBox } from "../../SharedComponents/inputText";
import history from "../../../../../history";
import {
  consoleLog,
  SetDateFormat,
  SetScheduleDate,
  SetUSAdateFormat,
} from "../../../../../services/common-function";
import ReactLoader from "../../../../Loader";
// import "./trainingDetails.css";
import { IMAGE_URL, INVOICE_PATH_ONLY } from "../../../../../services/config/api_url";
import axios from "axios";
import { InputText, SelectBox } from "../../../../Admin/SharedComponents/inputText";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import EditTrainingDetails from "../../../../Admin/ManageProjects/ProjectPages/EditTrainingDetails";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const invoiceStatusArr = [
  {
    label: "Raised",
    value: 0,
  },
  {
    label: "Received",
    value: 1,
  },
  {
    label: "Paid",
    value: 2,
  },
  {
    label: "Payment Failed",
    value: 3,
  },
  {
    label: "Rejected",
    value: 4,
  },
  {
    label: "Void",
    value: 5,
  },
];

// .......................for react select icon.............................................

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

// .............................................................
// ..........................style for react select........................

const customStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
    borderRadius: "6px",
    // width: "120%",
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


export default class ClientTrainingDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      requestId: "",
      clientFirstName: "",
      clientLastName: "",
      clientName: "",
      clientEmailId: "",
      clientPhone: "",
      clientIndustryType: "",
      //   .................jobDetails...........
      jobId: "",
      trainingFormat: "",
      trainingCategory: "",
      trainingCourse: "",
      budget: "",
      date: "",
      scheduleTime: "",
      serviceAddress: "",
      siteContant: "",
      consumer: "",
      notesByClient: "",
      notesBy7C: "",
      serviceProvider: "",

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
      trainingFee: 0,
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
      translationUnitCost: "",
      dtpUnitCost: "",
      translationRate: "",
      countryCode: "",

      allChecked: false,
      vendorAssigned: [],
      bidFee: 0,
      totalBidFee: 0,
      targetLanguage: "",
      bidFee: 0,
      totalBidFee: 0,
      bidVendorName: "",
      bidVendorId: "",
      adminPhoto: "",
      // ...................
      preDataStatus: 1,
      postJobStat: 0,

      arrivalTime: "",
      startTime: "",
      startEnd: "",
      summaryLocation: "",
      followUpDate: "",
      followUpTimeData: {},
      followUpCheck: 0,
      expenseCheck: 0,
      summaryTotalAmount: "",
      hour: "08",
      min: "00",
      ampm: "AM",

      completionData: {},
      miscellaneousExpences: [],
      formData: "",
      approvalStatus:"",
      completeSummary: {},
      requesterDetails:{},
      invoiceData:[],
       // ...for preview invoice modal......

       preview_invoiceId: "",
       preview_invoiceDate: "",
       preview_dueDate: "2022-01-25",
       preview_invoiceStatusArr: [],
       preview_invoiceStatusData: {},
       preview_invoicePeriodFromDate: "",
       preview_invoicePeriodToDate: "",
       preview_clientName: "",
       preview_billingAddress: "",
       preview_phoneNumber: "",
       preview_invoiceEmail: "",
       preview_invoiceNote: "",
       preview_payableItems: [],

       showHide: {
        dueDateTemplate: true,
        invoicePeriodTemplate: true,
        billingAddressTemplate: true,
        phoneNumberTemplate: true,
        emailTemplate: true,
        invoiceNotesTemplate: true,
        payableItemsTemplate: true,
        invoiceIdTemplate: true,
        invoiceDateTemplate: true,
      },
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    document.getElementById("backdrop").style.display = "none";
    let mainData = this.props.location,
      preData = mainData.state;
    consoleLog("preData::", preData);
    this.setState({
      reqId:preData.requestId
    })
    // if (preData === undefined) {
    //   return history.push("/vendorTrainingList");
    // } else {
    this.load();
    // }

    var classInstance = this;

    var viewModal = document.getElementById("viewModal");
    var bidModal = document.getElementById("bid-modal");

    var previewInvoiceModal = document.getElementById("previewInvoice-model");
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == viewModal) {
        classInstance.closeViewModal();
      } else if (event.target == bidModal) {
        classInstance.closeBidModal();
      } else if (event.target == previewInvoiceModal) {
        classInstance.closePreviewInvoiceModal();
      }
    };
  }

  load = async () => {
    let mainData = this.props.location,
      preData = mainData.state;

      consoleLog("preData::",preData)
    // this.setState({
    //   requestId: preData.id,
    // });
    // let detailData = {
    //   requestId: preData.id,
    // };

    let payloadDetails = {},
      trainingDetails = {},
      quoteDetails={},
      summaryDetails={},
      requesterDetails={},
      invoiceArr = [],
      particularsArr = [],
      isLoad = true;

    let responseProjectData = await ApiCall("getJobDetails", {
      requestId: preData.requestId,
    });

    if (
      responseProjectData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      responseProjectData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(responseProjectData.data.payload);

      consoleLog("details::;", decodeData);
      trainingDetails = decodeData.data.jobDetails;
      if (Object.keys(decodeData.data.quoteInfo).length > 0) {
        quoteDetails = decodeData.data.quoteInfo;
      }
      
      consoleLog("details:of training:;", trainingDetails);
      this.setState({
        isLoad:false
      })
    }

    // ......................completion summary..........................

    let detRes = await ApiCall("getJobCompleteSummaryV2", { requestId: preData.requestId});
    if (
      detRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      detRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      payloadDetails = Decoder.decode(detRes.data.payload);
      consoleLog("!!!!!complete summary", payloadDetails.data);
      if( payloadDetails.data.jobSummary != undefined || payloadDetails.data.jobSummary != null){
        summaryDetails = payloadDetails.data.jobSummary;
        requesterDetails = payloadDetails.data.requesterName;
      }
    
    }

      // .....................Invoice....................................
      let invoiceRes = await ApiCallClient("fetchClientInvoiceDetails", { requestId: preData.jobId});
      if(invoiceRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && invoiceRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS){
        invoiceArr = Decoder.decode(invoiceRes.data.payload).data.invoiceData;
        consoleLog("!!!!!invoice", Decoder.decode(invoiceRes.data.payload).data.invoiceData);
        if(invoiceArr.length > 0){
          this.setState({
            invoiceData:invoiceArr
          })
        } else {
          this.setState({
            invoiceData:[]
          })
        }
      }


    this.setState({
      jobId: trainingDetails.jobId,
      // jobId: preData.jobId,
      trainingFormat: trainingDetails.trainingFormat,
      trainingCategory: trainingDetails.trainingCategory,
      trainingCourse: trainingDetails.trainingCourse,
      // trainingFee:trainingDetails.data[0].bidFee,
      date: trainingDetails.scheduleDate,
      scheduleTime: trainingDetails.scheduleTime,
      serviceAddress:
        trainingDetails.location === null ||
        trainingDetails.location === undefined ||
        trainingDetails.location === ""
          ? "N/A"
          : trainingDetails.location,
      siteContact: trainingDetails.siteContact,
      consumer: trainingDetails.consumer,
      notesBy7C: trainingDetails.noteFor7C,
      notesByClient: trainingDetails.noteByClient,
      siteContant:
        trainingDetails.siteContact == null ||
        trainingDetails.siteContact == undefined ||
        trainingDetails.siteContact == ""
          ? "N/A"
          : trainingDetails.siteContact,
          quoteId:quoteDetails.quoteId,
          duration:trainingDetails.duration,
          rushFee:quoteDetails.rushFee,
      trainingFee:quoteDetails.fee,
      particularsArr:JSON.parse(quoteDetails.additionalFee),
      totalAmount: quoteDetails.total,
      serviceProvider: trainingDetails.noOfserviceProvider,
      approvalStatus:quoteDetails.approvalStatus,
    
      // isLoad: false,

      // preDataStatus: preData.status,
      arrivalTime:summaryDetails.arivalTime,
      startTime: summaryDetails.startTime,
      endTime: summaryDetails.endTime,
      // summaryLocation: payloadDetails.data.location,
      // followUpCheck: payloadDetails.data.followUpCheck,
      // expenseCheck: payloadDetails.data.expensesApproveByAdmin,
      // totalAmount: parseFloat(payloadDetails.data.rateCardAmount),
      // postJobStat: payloadDetails.data.postJobStat,
      // completionData: summaryDetails.data,
      completeSummary: summaryDetails,
      requesterDetails:requesterDetails
      // miscellaneousExpences:
      //   payloadDetails.data.miscellaneousExpences === null ||
      //   payloadDetails.data.miscellaneousExpences === undefined
      //     ? []
      //     : payloadDetails.data.miscellaneousExpences,
    });
  };

  onExpenceTypeChange = (e, key) => {
    this.state.miscellaneousExpences[key].expenseType = e.target.value;
    this.setState({
      completionData: this.state.completionData,
    });
  };

  onReceiptAmountChange = (e, key) => {
    // consoleLog("OOOO",this.state.miscellaneousExpences.length)
    let newText = "",
      totalAmount = parseFloat(this.state.completionData.rateCardAmount);

    for (let i = 0; i < e.target.value.length; i++) {
      if (Regex.AMOUNT_REGEX.indexOf(e.target.value[i]) > -1) {
        newText = newText + e.target.value[i];
      }
    }

    if (this.state.miscellaneousExpences.length > 1) {
      for (let i = 0; i < this.state.miscellaneousExpences.length - 1; i++) {
        totalAmount =
          totalAmount +
          parseFloat(this.state.miscellaneousExpences[i].receiptAmount);
      }
      if (newText.length > 0) {
        totalAmount = totalAmount + parseFloat(newText);
      }
    } else {
      if (newText.length == 0) {
        totalAmount = totalAmount;
      } else {
        totalAmount = totalAmount + parseFloat(newText);
      }
    }

    this.state.miscellaneousExpences[key].receiptAmount = newText;
    this.setState({
      completionData: this.state.completionData,
      totalAmount: totalAmount,
    });
  };

  addParticularField = () => {
    let expencesData = this.state.miscellaneousExpences;
    let data = {
      expenseType: "",
      incidentals: "",
      rawIncidentals: "",
      receiptAmount: "",
    };
    expencesData.push(data);

    this.state.miscellaneousExpences = expencesData;

    this.setState({
      completionData: this.state.completionData,
    });
  };
  onDeleteParticulars = (index) => {
    this.state.miscellaneousExpences.splice(index, 1);
    this.setState({
      completionData: this.state.completionData,
    });
  };
  onSubmitBid = async () => {
    let mainData = this.props.location;
    let preData = mainData.state;

    let errorCount = 0;

    let validateTrainingFee = inputEmptyValidate(this.state.trainingFee);

    if (validateTrainingFee === false || this.state.trainingFee === 0) {
      toast.error(AlertMessage.MESSAGE.BID.EMPTY_TRAINING_FEE, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      consoleLog("preData",preData)
      let data = {
        "requestId":preData.requestId,
        // "clientId":auth.data.userid
        }
      let res = await ApiCall("acceptClientQuoteV2", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.JOB.QUOTE_ACCEPTED, {
          hideProgressBar: true,
        });
        setTimeout(() =>{return history.push("/clientTrainingList")},1000 )
        // return history.push("/clientTrainingList");
      } else {
        toast.error("Error Occured !!")
      }
    }
  };
  onDecline = async() => {
    let mainData = this.props.location;
    let preData = mainData.state;

    let errorCount = 0;

    let validateTrainingFee = inputEmptyValidate(this.state.trainingFee);

    if (validateTrainingFee === false || this.state.trainingFee === 0) {
      toast.error(AlertMessage.MESSAGE.BID.EMPTY_TRAINING_FEE, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      consoleLog("preData",preData)
      let data = {
        "requestId":preData.requestId,
        // "clientId":auth.data.userid
        }
      let res = await ApiCall("declineClientQuote", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.JOB.QUOTE_REJECTED, {
          hideProgressBar: true,
        });
        setTimeout(() =>{return history.push("/clientTrainingList")},1000 )
        
      } else {
        toast.error("Error Occured !!")
      }
    }
  }

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
    let res = await ApiCall("sentOfferToVendor", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.JOB.OFFER_SENT_SUCCESS);
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

  handleViewModal = () => {
    this.openViewModal();
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
  openPreviewInvoiceModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("previewInvoice-model").style.display = "block";
    document.getElementById("previewInvoice-model").classList.add("show");
  };
  closePreviewInvoiceModal = () => {
    document.getElementById("previewInvoice-model").style.display = "none";
    document.getElementById("previewInvoice-model").classList.remove("show");
    document.getElementById("backdrop").style.display = "none";
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

  // ...............................follow up............................
  onSelectFollowupYes = (e) => {
    let data = this.state.completionData;
    data.followUpCheck = 1;
    this.setState({
      completionData: this.state.completionData,
      followUpCheck: 1,
    });
  };
  onSelectFollowupNo = (e) => {
    let data = this.state.completionData;
    data.followUpCheck = 0;
    this.setState({
      completionData: this.state.completionData,
      followUpCheck: 0,
    });
  };

  // ...............................misc expense............................
  onSelectExpenseYes = (e) => {
    let data = this.state.completionData;
    data.expensesApproveByAdmin = 1;
    this.setState({
      completionData: this.state.completionData,
      expenseCheck: 1,
    });
  };
  onSelectExpenseNo = (e) => {
    let data = this.state.completionData;
    data.expensesApproveByAdmin = 1;
    this.setState({
      completionData: this.state.completionData,
      expenseCheck: 0,
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
  onTrainingFeeChange = (e) => {
    this.setState({
      trainingFee: e.target.value,
    });
  };

  onProfileImage = (e, key) => {
    consoleLog("key", key);

    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      this.setState({
        imagePath: res.data.data.url,
        adminPhoto: res.data.data.filename,
      });

      if (res.data.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR) {
        this.state.miscellaneousExpences[key].incidentals =
          res.data.data.filename;
        this.state.miscellaneousExpences[key].rawIncidentals =
          res.data.data.path + res.data.data.filename;

        this.setState({
          completionData: this.state.completionData,
        });
        toast.success(AlertMessage.MESSAGE.DOCUMENT.DOCUMENT_UPLOAD_SUCCESS, {
          hideProgressBar: true,
        });
      } else {
        this.setState({
          hidden: false,
        });
      }
    });
  };

  formDateChange = (e) => {
    let data = this.state.completionData;
    data.followUpDate = e.target.value;
    this.setState({
      completionData: this.state.completionData,
      followUpDate: e.target.value,
    });
  };

  onFollowupTimeChange = (dat) => {
    // let obj = { label: dat.label, value: dat.value };
    let data = this.state.completionData;
    data.followUpTimeRange = dat.label;
    this.setState({
      completionData: this.state.completionData,
      followUpTimeData: dat,
    });
  };

  onSubmitSummary = async () => {
    let miscellaneousExpences = [];
    if (this.state.miscellaneousExpences.length > 0) {
      for (let i = 0; i < this.state.miscellaneousExpences.length; i++) {
        let miscellaneousObj = {
          expenseType: this.state.miscellaneousExpences[i].expenseType,
          incidentals: this.state.miscellaneousExpences[i].rawIncidentals,
          receiptAmount: this.state.miscellaneousExpences[i].receiptAmount,
        };
        miscellaneousExpences.push(miscellaneousObj);
      }
    }

    let reqData = {
      id: this.state.completionData.id,
      followUpCheck:
        this.state.completionData.followUpCheck === null ||
        this.state.completionData.followUpCheck === undefined ||
        this.state.completionData.followUpCheck === ""
          ? ""
          : this.state.completionData.followUpCheck.toString(),

      followUpDate:
        this.state.completionData.followUpDate === null ||
        this.state.completionData.followUpDate === undefined ||
        this.state.completionData.followUpDate === ""
          ? ""
          : this.state.completionData.followUpDate.toString(),
      selectFollowUpTimeRange:
        this.state.completionData.followUpTimeRange === null ||
        this.state.completionData.followUpTimeRange === undefined ||
        this.state.completionData.followUpTimeRange === ""
          ? ""
          : this.state.completionData.followUpTimeRange,
      expensesApproveByAdmin:
        this.state.completionData.expensesApproveByAdmin === null ||
        this.state.completionData.expensesApproveByAdmin === undefined ||
        this.state.completionData.expensesApproveByAdmin === ""
          ? ""
          : this.state.completionData.expensesApproveByAdmin.toString(),
      miscellaneousExpences: miscellaneousExpences,
    };

    // consoleLog("))))", reqData);

    let createSummary = await ApiCallVendor("createCompleteSummary", reqData);
    if (
      createSummary.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      createSummary.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.state.completionData.postJobStat = 1;
      this.setState({
        completionData: this.state.completionData,
      });
      toast.success(AlertMessage.MESSAGE.BID.ADD_SUMMARY_SUCCESS);
    } else {
      toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
    }
  };

  openPrevInvoiceModal = async (val) => {
    

    // consoleLog("valuee",val);
      let data = localStorage.getItem("AuthToken");
      let authUser = Decoder.decode(data);

      // consoleLog("valuee",authUser);
    let brr = [],
      arr = [],
      clientID = "",
      jobID = "",
      invoiceId = "";

    jobID = val.jobId;
    clientID =authUser.data.userid;
    invoiceId = val.invoiceId

    //   mainInvoiceId = "",
    //   clientName = "";
    // for (let i = 0; i < this.state.invoiceData.length; i++) {
    //   if (this.state.invoiceData[i].isSelected === true) {
    //     brr.push(this.state.invoiceData[i]);
    //     this.setState({
    //       selectedInvoiceData: brr,
    //     });
    //   }
    // }

    // brr.map((obj) => {
    //   clientID = obj.clientId;
    //   jobID = obj.jobId;
    //   clientName = obj.clientName;
    //   invoiceId = obj.id;
    //   mainInvoiceId = obj.invoiceId;
    // });

    // this.setState({
    //   invoiceId: invoiceId,
    //   clientName: clientName,
    //   clientId: clientID,
    //   jobId: jobID,
    //   mainInvoiceId: mainInvoiceId,
    // });

    // if (brr.length > 1) {
    //   toast.error("Please select only one row");
    // } else {
      let resPayable = await ApiCall("fetchPayableItemsById", {
        invoiceId: invoiceId,
      });

      if (
        resPayable.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        resPayable.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let decodeDataPayable = Decoder.decode(resPayable.data.payload);

        this.setState({
          payableItems: decodeDataPayable.data.payableItems,
        });
      }

      let resInvoice = await ApiCall("fetchTemplateListByUserId", {
        userId: clientID,
      });

      if (
        resInvoice.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        resInvoice.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let decodeDataInvoice = Decoder.decode(resInvoice.data.payload);

        // consoleLog("responce invoice", decodeDataInvoice);
        if (
          decodeDataInvoice.data != null ||
          decodeDataInvoice.data != undefined ||
          decodeDataInvoice.data != [] ||
          decodeDataInvoice.data != {} ||
          decodeDataInvoice.data != ""
        ) {
          this.openPreviewInvoiceModal();

          decodeDataInvoice.data.map((obj) => {
            arr.push({
              label: obj.templateName,
              value: obj.id,
            });

            if (obj.isPrimary == 1) {
              let content = [];
              content = JSON.parse(obj.content);

              let showHideObj = {
                dueDateTemplate: false,
                invoicePeriodTemplate: false,
                billingAddressTemplate: false,
                phoneNumberTemplate: false,
                emailTemplate: false,
                invoiceNotesTemplate: false,
                invoiceIdTemplate: false,
                invoiceDateTemplate: false,
              };

              content.map((obj1) => {
                if (obj1.name === "Due Date") {
                  showHideObj.dueDateTemplate = true;
                } else if (obj1.name === "Invoice Period") {
                  showHideObj.invoicePeriodTemplate = true;
                } else if (obj1.name === "Billing Address") {
                  showHideObj.billingAddressTemplate = true;
                } else if (obj1.name === "Phone Number") {
                  showHideObj.phoneNumberTemplate = true;
                } else if (obj1.name === "Email") {
                  showHideObj.emailTemplate = true;
                } else if (obj1.name === "Invoice Notes") {
                  showHideObj.invoiceNotesTemplate = true;
                } else if (obj1.name === "Invoice #") {
                  showHideObj.invoiceIdTemplate = true;
                } else if (obj1.name === "Invoice Date") {
                  showHideObj.invoiceDateTemplate = true;
                }
              });
              this.setState({
                showHide: showHideObj,
              });
            }
          });

          this.setState({
            templateArr: arr,
          });
        } else {
          this.setState({
            showHide: {
              dueDateTemplate: true,
              invoicePeriodTemplate: true,
              billingAddressTemplate: true,
              phoneNumberTemplate: true,
              emailTemplate: true,
              invoiceNotesTemplate: true,
              invoiceIdTemplate: true,
              invoiceDateTemplate: true,
            },
          });
        }
      }

      let statusObj = {};

      let resData = await ApiCall("fetchInvoiceByJobId", {
        jobId: jobID,
        invoiceId: invoiceId,
      });
      if (
        resData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        resData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let decodeData = Decoder.decode(resData.data.payload);
        let previewData = decodeData.data.invoiceData[0];
        let payableData = decodeData.data.payableItems;

        // consoleLog("decodeData.data::",decodeData.data)
        if (
          previewData != null ||
          previewData != undefined ||
          previewData != [] ||
          previewData != {} ||
          previewData != ""
        ) {
          invoiceStatusArr.map((obj) => {
            if (obj.value === previewData.status) {
              statusObj = {
                label: obj.label,
                value: obj.value,
              };
            }
          });

          this.setState({
            preview_invoiceStatusData: statusObj,
            preview_invoiceId: previewData.invoiceId,
            preview_dueDate: SetScheduleDate(previewData.dueDate),
            preview_phoneNumber:
              "+" + previewData.countryCode + " " + previewData.mobile,
            preview_clientName: previewData.clientName,
            preview_invoicePeriodFromDate: SetUSAdateFormat(
              previewData.fromDate
            ),
            preview_invoicePeriodToDate: SetUSAdateFormat(previewData.toDate),
            preview_billingAddress: previewData.billAddress,
            preview_invoiceNote: previewData.invoiceNote,
            preview_invoiceEmail: previewData.email,
            preview_invoiceDate: SetScheduleDate(previewData.invoiceDate),
            preview_payableItems: payableData,
          });
        }
      }
    // }
  };

  onDownloadClick = async(data) => {
    // consoleLog("downloaddata",data)
    let obj = {
      invoiceId:data.invoiceId
    };

    let res = await ApiCall("getInvoicePathById",obj)

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
     let invoicePath =  decodeData.data.invoicePath[0];
      // consoleLog("response:::::::::::::::::",invoicePath.invoicePath)
      if(invoicePath.invoicePath == null || invoicePath.invoicePath == undefined){
        invoicePath.invoicePath = "";
      } else {
         window.open(
        INVOICE_PATH_ONLY + invoicePath.invoicePath
      );
      }
     
    } else {
      toast.error("error occured")
    }

  };

  render() {
    // const open = Boolean(this.state.anchorEl); //used in MenuButton open
    // const open1 = Boolean(this.state.anchorEl1);
    return (
      <React.Fragment>
        {/* <div className="wrapper">
          <Header /> */}
        <ToastContainer hideProgressBar theme="colored" />

        {/* <Sidebar /> */}
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>

        <div className="component-wrapper" hidden={this.state.isLoad}>
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            <Link to="/clientDashboard">Dashboard</Link> /{" "}
            <Link to="/clientTrainingList">Training</Link> / Training
          </div>
          <div className="job-details-tab jobdltste _fl sdw">
            <ul className="nav nav-tabs" style={{ height: "59px" }}>
              <li className="nav-item" style={{ width: "20%" }}>
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
                    Details
                  </div>
                </a>{" "}
              </li>
              {this.state.approvalStatus === 7 ||
                this.state.approvalStatus === 9 ||
                this.state.approvalStatus === 10 ||
                this.state.approvalStatus === 11 ? (
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
                        Edit Details
                      </div>
                    </a>{" "}
                  </li>
                </React.Fragment>)}
              
              <li className="nav-item" style={{ width: "20%" }}>
                    {" "}
                    <a className="nav-link" data-toggle="tab" href="#bid_view">
                      <div className="taber">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.TABBAR} />
                        </figure>
                        Quote
                      </div>
                    </a>{" "}
                  </li>
                  {this.state.approvalStatus == 10 && this.state.completeSummary.postJobStat > 0 ? <React.Fragment>
                    <li className="nav-item" style={{ width: "20%" }}>
                    {" "}
                    <a className="nav-link" data-toggle="tab" href="#summary">
                      <div className="taber">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.TABBAR} />
                        </figure>
                        Completion Summary
                      </div>
                    </a>{" "}
                  </li>
                  <li className="nav-item" style={{ width: "20%" }}>
                {" "}
                <a className="nav-link" data-toggle="tab" href="#invoicetab">
                  <div className="taber">
                    <figure>
                      <img
                        src={ImageName.IMAGE_NAME.CHAT_ICON}
                        style={{ padding: "10px", width: "48px" }}
                      />
                    </figure>
                    Invoice{" "}
                  </div>
                </a>{" "}
              </li>
                  </React.Fragment>:<React.Fragment/>}
                 

              
              {/* <li className="nav-item" style={{ width: "25%" }}>
                  {" "}
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="#nofifications"
                  >
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
                          Project ID
                        </td>
                        <th width="50%" align="right">
                          {this.state.jobId}
                        </th>
                      </tr>

                      <tr>
                        <td width="50%" align="left">
                          Training Format
                        </td>
                        <th width="50%" align="right">
                          {this.state.trainingFormat}
                        </th>
                      </tr>

                      <tr>
                        <td width="50%" align="left">
                          No. of Participants
                        </td>
                        <th width="50%" align="right">
                          {this.state.serviceProvider}
                        </th>
                      </tr>

                      <tr>
                        <td width="50%" align="left">
                          Category
                        </td>
                        <th width="50%" align="right">
                          {this.state.trainingCategory}
                        </th>
                      </tr>

                      <tr>
                        <td width="50%" align="left">
                          Course
                        </td>
                        <th width="50%" align="right">
                          {this.state.trainingCourse}
                        </th>
                      </tr>
                      <tr>
                        <td width="50%" align="left">
                          Date & Time
                        </td>
                        <th width="50%" align="right">
                          {SetDateFormat(this.state.date)}{" "}
                          {this.state.scheduleTime}
                        </th>
                      </tr>

                      <tr>
                        <td width="50%" align="left">
                          Training Location Address
                        </td>
                        <th width="50%" align="right">
                          {this.state.serviceAddress}
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
                  {/* {consoleLog("Html adata", this.state.reqId)} */}
                  <EditTrainingDetails mainData={this.state.reqId} />
                </div>
              </div>

              {/* .......................view Bid.................................. */}

              <div className="tab-pane" id="bid_view">
                <div className="job-section-tab">
                  <div className="view-quote-details-wrap">
                    <h3>View Quote Details</h3>
                    <p>
                      <span>Quote Id</span> {this.state.quoteId}
                    </p>
                    <p>
                      <span>Status</span> {this.state.trainingFormat}
                    </p>
                    <p>
                      <span>Notes for Client</span>{" "}
                      {this.state.notesByClient === "" ||
                      this.state.notesByClient === null ||
                      this.state.notesByClient === undefined
                        ? "N/A"
                        : this.state.notesByClient}
                    </p>
                  </div>
                  <div className="add-more-field">
                    <div className="table-listing-app create">
                      <div className="creat_quot">
                        <h3>Quote</h3>
                        <div className="depr_table">
                          <div className="table-responsive_mb">
                            <table
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tbody>
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
                                    <div
                                      className="input-group"
                                      style={{ justifyContent: "right" }}
                                    >
                                      <div class="input-group-prepend">
                                        <span
                                          class="input-group-text"
                                          id="basic-addon1"
                                        >
                                          $
                                        </span>
                                      </div>
                                      <input
                                        className="inputfield flr"
                                        type="text"
                                        value={this.state.rushFee}
                                        // onChange={this.onRushFeeChange}
                                        readOnly
                                      />
                                    </div>
                                  </td>
                                </tr>


                                <tr>
                                  <td width="50%" align="left">
                                    Training Fee
                                  </td>
                                  <td width="50%" align="right">
                                    <div
                                      className="input-group"
                                      style={{ justifyContent: "right" }}
                                    >
                                      <div class="input-group-prepend">
                                        <span
                                          class="input-group-text"
                                          id="basic-addon1"
                                        >
                                          $
                                        </span>
                                      </div>
                                      <input
                                        className="inputfield flr"
                                        type="text"
                                        value={this.state.trainingFee}
                                        onChange={(e) =>
                                          this.onTrainingFeeChange(e)
                                        }
                                        readOnly
                                      />
                                    </div>
                                  </td>
                                </tr>
                                {this.state.particularsArr.map((item, key) => (
                                  <tr>
                                    <td width="50%" align="left">
                                      <input
                                        className="inputfield flr"
                                        type="text"
                                        placeholder="Particulars"
                                        value={item.title}
                                        // onChange={(e) =>
                                        //     this.onParticularChange(e, key)
                                        // }
                                        readOnly
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
                                              readOnly
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                                <tr>
                                  <td
                                    width="50%"
                                    align="left"
                                    style={{ color: "#5ea076" }}
                                  >
                                    Total Amount
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
                      onClick={() => {
                        return history.push("/clientTrainingList");
                      }}
                    >
                      Back
                    </a>
                    {this.state.approvalStatus == 0 || this.state.approvalStatus == 1 ? <React.Fragment>
                      <a
                      href="javascript:void(0)"
                      className="red-btn"
                      style={{ textDecoration: "none",backgroundColor:"#993921" }}
                      onClick={this.onDecline}
                    >
                      Decline
                    </a>
                    <a
                      href="javascript:void(0)"
                      className="blue-btn"
                      style={{ textDecoration: "none" }}
                      onClick={this.onSubmitBid}
                    >
                      Accept
                    </a>
                    </React.Fragment> : <React.Fragment/>}
                   
                  </div>
                </div>
              </div>

            
              {/* .............................completion summary................. */}
              <div className="tab-pane" id="summary">
                <div className="job-section-tab">
                  {/* {Object.keys(this.state.completeSummary).length > 0 ? ( */}
                  {/* {Object.keys(this.state.completeSummary).length > 0 ? ( */}
                  <React.Fragment>
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
                                Trainer Start Time
                              </td>
                              <th width="33%" align="center">
                                {this.state.completeSummary.startTime}
                              </th>
                              {/* <th width="33%" align="center">
                                {this.state.completeSummary.isArrivalAprroved}
                              </th> */}
                            </tr>
                            <tr>
                              <td width="33%" align="left">
                                Trainer End Time
                              </td>
                              <th width="33%" align="center">
                                {this.state.completeSummary.endTime}
                              </th>
                              {/* <th width="33%" align="center">
                                {this.state.completeSummary.isStartApproved}
                              </th> */}
                            </tr>
                            <tr>
                              <td width="33%" align="left">
                                Requester
                              </td>
                              <th width="33%" align="center">
                                {this.state.requesterDetails.name}
                              </th>
                             
                            </tr>
                            
                            <tr>
                              <td width="33%" align="left">
                                Format
                              </td>
                              <th width="33%" align="center">
                                {this.state.trainingFormat}
                              </th>
                             
                            </tr>
                            <tr>
                              <td width="33%" align="left">
                                Total Duration
                              </td>
                              <th width="33%" align="center">
                                {this.state.duration}
                              </th>
                             
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="_fl margin-top-30 br-bx">
                      <div className="row">
                        <div className="col-md-6">
                          <p> Rate Your Trainer</p>
                        </div>
                        <div className="col-md-6">
                          <div className="rt-rating">
                            {/* <figure><img src={ImageName.IMAGE_NAME.RATTINGSTAR} /></figure> */}
                            <ReactStars
                              count={5}
                              // onChange={ratingChanged}
                              size={44}
                              isHalf={true}
                              activeColor="#009fe0"
                              // value={this.state.completeSummary.clientRatings}
                              edit={false}
                            />
                            <a href="javascript:void(0)" className="poor">
                              Very Poor
                            </a>{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="_fl margin-top-30 br-bx">
                      <div className="row">
                        <div className="col-md-6">
                          <p>Would you use the same Trainer?</p>
                        </div>
                        <div className="col-md-6">
                          <p className="np">
                            {/* {this.state.completeSummary.isPrefVendor} */}Yes
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="_fl margin-top-30 br-bx">
                      <div className="row">
                        <div className="col-md-6">
                          <p>Reason</p>
                        </div>
                        <div className="col-md-6">
                          {/* <p>{this.state.completeSummary.prefferedReason}</p> */}
                        </div>
                      </div>
                    </div>
                    {/* <div className="_fl margin-top-30 br-bx">
                        <div className="row">
                          <div className="col-md-6">
                            <p>Is there any follow up appointments?</p>
                          </div>
                          <div className="col-md-6">
                            <p className="np">
                            
                            </p>
                          
                          </div>
                        </div>
                      </div> */}

                    {/* {this.state.completeSummary.expensesApproveByAdmin ===
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
                      )} */}
                  </React.Fragment>
                  {/* // ) : (
                  //   <React.Fragment>
                  //     <ReactLoader />
                  //   </React.Fragment>
                  // )} */}
                  {/* ) : (
                      <React.Fragment>
                        <ReactLoader />
                      </React.Fragment>
                    )} */}
                </div>
              </div>

              {/* .................................................................................. */}
              <div className="tab-pane" id="invoicetab">
                <div className="job-section-tab">
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
                            <th style={{ width: "8%" }}>
                              <strong>Invoice ID</strong>
                            </th>
                            <th style={{ width: "8%" }}>
                              <strong>Job/Project ID</strong>
                            </th>

                            <th style={{ width: "10%" }}>Total Amount $</th>
                            <th style={{ width: "12%" }}>
                              Invoice Generated On
                            </th>
                            <th style={{ width: "12%" }}>Due Date</th>
                            <th style={{ width: "10%" }}>Status</th>
                            <th style={{ width: "11%" }}>Action</th>
                          </tr>
                        </tbody>
                        <tbody>
                          {this.state.invoiceData.length > 0 ? <React.Fragment>
                            {this.state.invoiceData.map((data,i) => (<React.Fragment key={i}>
                              <tr>
                          <td style={{ width: "8%" }}>{data.invoiceId}</td>
                          <td style={{ width: "8%" }}>{data.jobId}</td>
                          <td style={{ width: "10%" }}>{data.amount}</td>
                          <td style={{ width: "12%" }}>{SetDateFormat(data.invoiceDate)}</td>
                          <td style={{ width: "12%" }}>{SetDateFormat(data.dueDate)}</td>
                          <td style={{ width: "10%" }}>
                          {data.status === 0 ? (
                                    <React.Fragment>
                                      <span className="progress-btn yellow">
                                        Unpaid
                                      </span>
                                    </React.Fragment>
                                  ) : data.status === 1 ? (
                                    <React.Fragment>
                                      <span
                                        href="#"
                                        className="progress-btn yellow"
                                      >
                                        Unpaid
                                      </span>
                                    </React.Fragment>
                                  )
                                     : data.status === 2 ? (
                                      <React.Fragment>
                                        <span
                                          href="#"
                                          className="progress-btn green"
                                        >
                                          Paid
                                        </span>
                                      </React.Fragment>
                                    ) 
                                  : (
                                    <React.Fragment />
                                  )}
                          </td>
                          <td style={{ width: "11%" }}>
                          <div>
                                    <a href="javascript:void(0)">
                                      <img
                                        src={ImageName.IMAGE_NAME.EYE_BTN}
                                        onClick={() => this.openPrevInvoiceModal(data)}
                                        style={{ marginRight: "5px" }}
                                      />
                                    </a>
                                    <a href="javascript:void(0)">
                                      <img
                                        src={ImageName.IMAGE_NAME.DOWNLOAD_SHEET_ICON}
                                        onClick={() =>
                                          this.onDownloadClick(data)
                                        }
                                      />
                                    </a>
                                  </div>
                          </td>
                          </tr>
                            </React.Fragment>))}
                           
                          </React.Fragment> : <React.Fragment>
                          <tr style={{ textAlign: "center" }}>
                            <td colSpan="7">
                              <center style={{ fontSize: "20px" }}>
                                No data found !!!
                              </center>
                            </td>
                            </tr>
                            </React.Fragment>}
                         
                         
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="tab-pane" id="chattab">
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
                </div> */}

              <div className="tab-pane" id="nofifications">
                Notification
              </div>
            </div>
          </div>
        </div>

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
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                    >
                      <tr>
                        <th style={{ width: "16%" }}>Monday</th>
                        <th style={{ width: "16%" }}>Tuesday</th>
                        <th style={{ width: "16%" }}>Wednesday</th>
                        <th style={{ width: "16%" }}>Thursday</th>
                        <th style={{ width: "16%" }}>Friday</th>
                        <th style={{ width: "16%" }}>Saturday</th>
                      </tr>
                      <tr>
                        <td>
                          <div className="f2f_rate">F2F</div> 12:00 AM- 5:00 PM
                        </td>
                        <td>
                          <div className="f2f_rate">OPI</div> 12:00 AM- 5:00 PM
                        </td>
                        <td>
                          <div className="f2f_rate">F2F</div> 12:00 AM- 5:00 PM
                        </td>
                        <td>NA</td>
                        <td>NA</td>
                        <td>NA</td>
                      </tr>
                      <tr>
                        <td>
                          <div className="f2f_rate">VRI</div> 12:00 AM- 5:00 PM
                        </td>
                        <td>
                          <div className="f2f_rate">F2F</div> 12:00 AM- 5:00 PM
                        </td>
                        <td>
                          <div className="f2f_rate">F2F</div> 12:00 AM- 5:00 PM
                        </td>
                        <td>NA</td>
                        <td>NA</td>
                        <td>NA</td>
                      </tr>
                      <tr>
                        <td>
                          <div className="f2f_rate">VRI</div> 12:00 AM- 5:00 PM
                        </td>
                        <td>
                          <div className="f2f_rate">VRI</div> 12:00 AM- 5:00 PM
                        </td>
                        <td>
                          <div className="f2f_rate">OPI</div> 12:00 AM- 5:00 PM
                        </td>
                        <td>NA</td>
                        <td>NA</td>
                        <td>NA</td>
                      </tr>
                    </table>
                  </div>
                </div>
                {/* <div className="b-i-s _fl text-right _button-style m30">
                            <a href="#" className="blue-btn">Add language Pair</a>
                        </div> */}
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
        {/* </div> */}


           {/* ......................preview.invoice modal................ */}

        <div
          id="previewInvoice-model"
          class="modal fade modelwindow"
          role="dialog"
        >
          <div class="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div class="modal-content" style={{ width: "110%" }}>
              <div class="filter-head _fl mdf">
                <div className="row">
                  <div className="col-md-3">
                    <h3 style={{ background: "none", fontSize: "14px" }}>
                      Preview Invoice
                    </h3>
                  </div>
                  <div className="col-md-3"></div>
                  <div className="col-md-6">
                    <div class="reset-btn-dp">
                      <button
                        class="reset"
                        data-dismiss="modal"
                        style={{
                          width: "110px",
                          textDecoration: "none",
                          fontSize: "12px",
                        }}
                        onClick={this.closePreviewInvoiceModal}
                      >
                        Cancel
                      </button>
                      {/* <button
                        class="apply"
                        data-dismiss="modal"
                        style={{ width: "110px" }}
                      >
                        <a
                          href="javascript:void(0)"
                          class="progress-btn sky"
                          style={{ textDecoration: "none", fontSize: "12px" }}
                          onClick={this.onCreateInvoice}
                        >
                          Save
                        </a>
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-body">
                <div class="model-info f-model">
                  <div className="row">
                    {this.state.showHide.invoiceIdTemplate === true ? (
                      <React.Fragment>
                        <div className="col-md-3">
                          <div className="form_rbx">
                            {" "}
                            <span className="invoiceLabel">Invoice ID</span>
                            <input
                              placeholder=""
                              className="inputfield"
                              value={this.state.preview_invoiceId}
                              disabled
                              style={{ width: "120%" }}
                            />
                          </div>
                        </div>
                        <div className="col-md-1"></div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment />
                    )}

                    {this.state.showHide.invoiceDateTemplate === true ? (
                      <React.Fragment>
                        <div className="col-md-3">
                          <div className="form_rbx">
                            {" "}
                            <span className="invoiceLabel">Invoice Date</span>
                            <input
                              placeholder=""
                              className="inputfield"
                              value={this.state.preview_invoiceDate}
                              disabled
                              style={{ width: "120%" }}
                            />
                          </div>
                        </div>
                        <div className="col-md-1"></div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment />
                    )}

                    {this.state.showHide.dueDateTemplate === true ? (
                      <React.Fragment>
                        <div className="col-md-3">
                          <div className="form_rbx">
                            {" "}
                            <span className="invoiceLabel">Due Date</span>
                            <input
                              placeholder=""
                              className="inputfield"
                              value={this.state.preview_dueDate}
                              disabled
                              style={{ width: "120%" }}
                            />
                          </div>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment />
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-3">
                      <div className="form_rbx">
                        {" "}
                        <span className="invoiceLabel">Invoice Status</span>
                        <div className="dropdwn" style={{ width: "120%" }}>
                          <Select
                            styles={customStyles}
                            name="select"
                            placeholder="Select"
                            components={{
                              DropdownIndicator,
                              IndicatorSeparator: () => null,
                            }}
                            value={this.state.preview_invoiceStatusData}
                            options={invoiceStatusArr}
                            onChange={(value) =>
                              this.preview_onInvoiceStatusChange(value)
                            }
                            isDisabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-1"></div>
                    {this.state.showHide.invoicePeriodTemplate ? (
                      <React.Fragment>
                        <div className="col-md-8">
                          <div className="form-search-app">
                            <div
                              className="invoiceLabel"
                              style={{
                                fontWeight: "500",
                                fontSize: "14px",
                                marginBottom: "5px",
                              }}
                            >
                              Invoice Period
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-field-app">
                                  <span></span>
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
                                      <span>
                                        {
                                          this.state
                                            .preview_invoicePeriodFromDate
                                        }
                                      </span>
                                    </div>
                                    <div style={{ width: "20%" }}>
                                      <a style={{ float: "right" }}>
                                        <DatePicker
                                          disabled
                                          onChange={(date) =>
                                            this.preview_invoiceFormDateChange(
                                              date
                                            )
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
                                    value={this.state.invoicePeriodFromDate}
                                    onChange={this.invoiceFormDateChange}
                                    style={{ width: "115%" }}
                                  /> */}
                                </div>
                              </div>
                              {/* <div className="col-md-2"></div> */}
                              <div className="col-md-6">
                                <div className="form-field-app">
                                  <span></span>
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
                                      <span>
                                        {this.state.preview_invoicePeriodToDate}
                                      </span>
                                    </div>
                                    <div style={{ width: "20%" }}>
                                      <a style={{ float: "right" }}>
                                        <DatePicker
                                          disabled
                                          onChange={(date) =>
                                            this.preview_invoiceToDateChange(
                                              date
                                            )
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
                                    value={this.state.invoicePeriodToDate}
                                    onChange={this.invoiceToDateChange}
                                    style={{ width: "115%" }}
                                  /> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment />
                    )}
                  </div>
                  <h6 style={{ marginTop: "15px" }}>Client Info</h6>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form_rbx">
                        {" "}
                        <span className="invoiceLabel">Client</span>
                        <input
                          placeholder=""
                          className="inputfield"
                          value={this.state.preview_clientName}
                          disabled
                          style={{ width: "120%" }}
                        />
                      </div>
                    </div>
                  </div>
                  {this.state.showHide.billingAddressTemplate ? (
                    <React.Fragment>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="form_rbx">
                            {" "}
                            <span className="invoiceLabel">
                              Billing Address
                            </span>
                            <textarea
                              placeholder="......."
                              className="in-textarea min"
                              value={this.state.preview_billingAddress}
                              onChange={(value) => {
                                this.onInvoiceBillingChange(value);
                              }}
                              style={{
                                borderRadius: "10px",
                                resize: "none",
                                width: "120%",
                              }}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment />
                  )}
                  <div className="row">
                    {this.state.showHide.phoneNumberTemplate ? (
                      <React.Fragment>
                        <div className="col-md-3">
                          <div className="form_rbx">
                            {" "}
                            <span className="invoiceLabel">Phone Number</span>
                            <div className="dropdwn" style={{ width: "185%" }}>
                              <InputText
                                placeholder=""
                                className="inputfield"
                                value={this.state.preview_phoneNumber}
                                onTextChange={(value) => {
                                  this.onInvoicePhoneChange(value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-1"></div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment />
                    )}
                    {this.state.showHide.emailTemplate ? (
                      <React.Fragment>
                        <div className="col-md-3">
                          <div className="form_rbx">
                            {" "}
                            <span className="invoiceLabel">Email</span>
                            <div className="dropdwn" style={{ width: "185%" }}>
                              <InputText
                                placeholder=""
                                className="inputfield"
                                value={this.state.preview_invoiceEmail}
                                onTextChange={(value) => {
                                  this.onInvoiceEmailChange(value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment />
                    )}
                  </div>
                  {this.state.showHide.invoiceNotesTemplate ? (
                    <React.Fragment>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="form_rbx">
                            {" "}
                            <span className="invoiceLabel">Invoice Note</span>
                            <textarea
                              placeholder="......."
                              className="in-textarea min"
                              value={this.state.preview_invoiceNote}
                              onChange={(value) => {
                                this.onInvoiceNotesChange(value);
                              }}
                              disabled
                              style={{
                                borderRadius: "10px",
                                resize: "none",
                                width: "120%",
                              }}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment />
                  )}

                  <h6 style={{ marginTop: "15px" }}>Payable Items</h6>
                  <div className="table-listing-app">
                    <div className="table-responsive">
                      <table
                        width="100%"
                        border="0"
                        cellPadding="0"
                        cellSpacing="0"
                      >
                        {/* {this.state.payableItems.length > 0 ? (
                              <React.Fragment> */}
                        <tr>
                          <th style={{ width: "10%" }}>ID</th>
                          <th style={{ width: "10%" }}>Type</th>
                          <th style={{ width: "20%" }}>Description</th>
                          <th style={{ width: "10%" }}>Quantity</th>
                          <th style={{ width: "10%" }}>Unit Cost $</th>
                          <th style={{ width: "10%" }}>Price($)</th>
                          <th style={{ width: "5%" }}></th>
                        </tr>
                        {/* </React.Fragment>
                            ) : (
                              <React.Fragment />
                            )} */}

                        {this.state.preview_payableItems.map((item, key) => (
                          <tr key={key}>
                            <td colSpan="7">
                              <div className="">
                                <table
                                  width="100%"
                                  border="0"
                                  cellPadding="0"
                                  cellSpacing="0"
                                >
                                  <tr>
                                    <td style={{ width: "10%" }}>
                                      {/* {item.isEditable == 1 ? (
                                        <React.Fragment> */}
                                      <div style={{ fontSize: "12px" }}>
                                        <input
                                          type="text"
                                          className="inputfield"
                                          value={item.id}
                                          // onChange={this.payableIdChange(key)}
                                          disabled
                                        />
                                      </div>
                                      {/* </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <div style={{ fontSize: "12px" }}>
                                            {" "}
                                            {item.id}
                                          </div>
                                        </React.Fragment>
                                      )} */}
                                    </td>
                                    <td style={{ width: "10%" }}>
                                      {/* {item.isEditable == 1 ? (
                                        <React.Fragment> */}
                                      <div style={{ fontSize: "12px" }}>
                                        <input
                                          type="text"
                                          className="inputfield"
                                          value={item.serviceType}
                                          // onChange={this.payableTypeChange(key)}
                                        />
                                      </div>
                                      {/* </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <div style={{ fontSize: "12px" }}>
                                            {item.type}
                                          </div>
                                        </React.Fragment>
                                      )} */}
                                    </td>
                                    <td style={{ width: "20%" }}>
                                      {/* {item.isEditable == 1 ? (
                                        <React.Fragment> */}
                                      <div style={{ fontSize: "12px" }}>
                                        <textarea
                                          rows="2"
                                          placeholder=""
                                          className="in-textarea msg min"
                                          value={item.description}
                                          style={{
                                            height: "100px",
                                            color: "var(--grey)",
                                            borderRadius: "10px",
                                            boxShadow: "2px",
                                            resize: "none",
                                          }}
                                          disabled
                                          // onChange={this.payableDescriptionChange(
                                          //   key
                                          // )}
                                        ></textarea>
                                        {/* <input
                                          type="text"
                                          className="inputfield"
                                          value={item.description}
                                          onChange={this.payableDescriptionChange(
                                            key
                                          )}
                                        /> */}
                                      </div>
                                      {/* </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <div style={{ fontSize: "12px" }}>
                                            {item.description}
                                          </div>
                                        </React.Fragment>
                                      )} */}
                                    </td>
                                    <td style={{ width: "10%" }}>
                                      {/* {item.isEditable == 1 ? (
                                        <React.Fragment> */}
                                      <div style={{ fontSize: "12px" }}>
                                        <input
                                          type="text"
                                          className="inputfield"
                                          value={item.unit}
                                          // onChange={this.payableQuantityChange(
                                          //   key
                                          // )}
                                        />
                                      </div>
                                      {/* </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <div style={{ fontSize: "12px" }}>
                                            {item.quantity}
                                          </div>
                                        </React.Fragment>
                                      )} */}
                                    </td>
                                    <td style={{ width: "10%" }}>
                                      {/* {item.isEditable == 1 ? (
                                        <React.Fragment> */}
                                      <div style={{ fontSize: "12px" }}>
                                        <input
                                          type="text"
                                          className="inputfield"
                                          value={item.unitPrice}
                                          // onChange={this.payableUnitPriceChange(
                                          //   key
                                          // )}
                                        />
                                      </div>
                                      {/* </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <div style={{ fontSize: "12px" }}>
                                            {item.unitPrice}
                                          </div>
                                        </React.Fragment>
                                      )} */}
                                    </td>
                                    <td style={{ width: "10%" }}>
                                      {/* {item.isEditable == 1 ? (
                                        <React.Fragment> */}
                                      <div style={{ fontSize: "12px" }}>
                                        <input
                                          type="text"
                                          className="inputfield"
                                          value={item.totalPrice}
                                          // onChange={this.payableTotalPriceChange(
                                          //   key
                                          // )}
                                          disabled
                                        />
                                      </div>
                                      {/* </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <div style={{ fontSize: "12px" }}>
                                            {item.totalPrice}
                                          </div>
                                        </React.Fragment>
                                      )} */}
                                    </td>
                                    <td style={{ width: "5%" }}>
                                      {/* <div className="col-md-1 delete-btn">
                                        <img
                                          src={ImageName.IMAGE_NAME.TRASH_BTN}
                                          onClick={() =>
                                            this.onDeleteParticulars(key)
                                          }
                                          style={{
                                            cursor: "pointer",
                                            maxWidth: "500%",
                                          }}
                                        />
                                      </div> */}
                                    </td>
                                  </tr>
                                </table>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </table>
                    </div>
                  </div>
                  {/* <div className="addPayableItem">
                    <a
                      href="javascript:void(0)"
                      class="progress-btn previewInvoiceBtn"
                      onClick={this.addParticularField}
                    >
                      Add Item
                    </a>
                  </div> */}
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
