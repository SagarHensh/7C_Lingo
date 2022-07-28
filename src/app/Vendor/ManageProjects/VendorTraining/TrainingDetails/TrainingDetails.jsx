import React, { Component } from "react";

import { AlertMessage, ImageName } from "../../../../../enums";
import { ApiCall, ApiCallVendor } from "../../../../../services/middleware";
import { CryptoDecoder, Decoder } from "../../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";
import {
  inputEmptyValidate,
  mobileNumberValidator,
  numberValidator,
  zipValidate,
  timeValidator,
} from "../../../../../validators";
import { Regex } from "../../../../../services/config";
// import Select, { components } from "react-select";
// import { SmallSelectBox } from "../../SharedComponents/inputText";
import history from "../../../../../history";
import {
  consoleLog,
  SetDateFormat,
  SetDOBFormat,
} from "../../../../../services/common-function";
import ReactLoader from "../../../../Loader";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";
import "./trainingDetails.css";
import { IMAGE_URL } from "../../../../../services/config/api_url";
import axios from "axios";
import { SelectBox } from "../../../../Admin/SharedComponents/inputText";
import { Link } from "react-router-dom";
import { amPmChange, hourChange, hourReversChange, minutesChange, minutesReversChange } from "./function";

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

// .............................................................

export default class TrainingDetails extends React.Component {
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
      preDataStatus: 0,
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
      payableData: {},
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    document.getElementById("backdrop").style.display = "none";
    let mainData = this.props.location,
      preData = mainData.state;
    consoleLog("preData::", preData);
    if (preData === undefined) {
      return history.push("/vendorTrainingList");
    } else {
      this.load();
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
    let mainData = this.props.location,
      preData = mainData.state;
    this.setState({
      requestId: preData.id,
    });
    let detailData = {
      requestId: preData.id,
    };

    let payloadDetails = {},
      payableDetails = {},
      trainingDetails = {};

    let responseProjectData = await ApiCallVendor("getTrainingDetails", {
      id: preData.id,
    });

    if (
      responseProjectData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      responseProjectData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      trainingDetails = Decoder.decode(responseProjectData.data.payload);

      consoleLog("details::;", trainingDetails.data[0]);
    }

    // ......................completion summary..........................

    let detRes = await ApiCallVendor("getCompleteSummary", { id: preData.id });
    if (
      detRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      detRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      payloadDetails = Decoder.decode(detRes.data.payload);
      consoleLog("!!!!!", payloadDetails.data);

      // ...........................................

      //.....................payables ............................
      let reqData = {
        bidRequestId: preData.id,
        requestId: preData.requestId,
      };
      let payableData = await ApiCallVendor(
        "getTrainingPayableDetails",
        reqData
      );
      if (
        payableData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        payableData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let decodeDataPayable = Decoder.decode(payableData.data.payload);

        payableDetails = decodeDataPayable.data.payableDetails[0];
      }
      consoleLog("details:payableess:;", payableDetails);



      // .....................arrival time ..................
      var modifyData = {};

      if ( payloadDetails.data.arivalTime == undefined &&  payloadDetails.data.arivalTime == null ||  payloadDetails.data.arivalTime.length == 0) {
        modifyData["intervalHour"] = "01";
        modifyData["intervalMunite"] = "00";
        modifyData["intervalAmp"] = "AM";
    } else {
        let splitArivalFullTime = payloadDetails.data.arivalTime.split(" ");
        let splitArivalTime = splitArivalFullTime[0].split(":");
        modifyData["intervalHour"] = splitArivalTime[0];
        modifyData["intervalMunite"] = splitArivalTime[1];
        modifyData["intervalAmp"] = splitArivalFullTime[1];
    }
  //   if ( payloadDetails.data.followUpTimeRange == undefined ||  payloadDetails.data.followUpTimeRange == null ||  payloadDetails.data.followUpTimeRange.length == 0) {
  //     modifyData["selectFollowUpTimeRange"] = "";
  // } else {
  //     modifyData["selectFollowUpTimeRange"] =  payloadDetails.data.followUpTimeRange;
  // }

    payloadDetails.data = Object.assign(payloadDetails.data,modifyData)

    let followUpObj = {};

    followUpTimeArr.map((obj) => {
      if(obj.label == payloadDetails.data.followUpTimeRange){
        followUpObj = {
          label:obj.label,
          value:obj.value
        }
      }
    })


    consoleLog("modify details :::", payloadDetails.data )

      this.setState({
        jobId: preData.jobId,
        trainingFormat: preData.format,
        trainingCategory: preData.trainingCategory,
        trainingCourse: preData.course,
        trainingFee: trainingDetails.data[0].bidFee,
        date: preData.scheduleDate,
        scheduleTime: preData.scheduleTime,
        serviceAddress:
          preData.location === null ||
          preData.location === undefined ||
          preData.location === ""
            ? "N/A"
            : preData.location,
        serviceProvider: preData.participant,
        duration: preData.duration,
        isLoad: false,

        preDataStatus: preData.status,
        arrivalTime:
          payloadDetails.data.arivalTime === null ||
          payloadDetails.data.arivalTime === undefined ||
          payloadDetails.data.arivalTime === ""
            ? ""
            : payloadDetails.data.arivalTime,
        startTime: payloadDetails.data.startTime,
        endTime: payloadDetails.data.endTime,
        followUpDate:payloadDetails.data.followUpDate == null ||payloadDetails.data.followUpDate == undefined ? "" : SetDOBFormat(payloadDetails.data.followUpDate),
        followUpTimeData:followUpObj,
        summaryLocation: payloadDetails.data.location,
        followUpCheck: payloadDetails.data.followUpCheck,
        expenseCheck: payloadDetails.data.expensesApproveByAdmin,
        totalAmount: parseFloat(payloadDetails.data.totalBidFee),
        postJobStat: payloadDetails.data.postJobStat,
        completionData: payloadDetails.data,
        miscellaneousExpences:
          payloadDetails.data.miscellaneousExpences === null ||
          payloadDetails.data.miscellaneousExpences === undefined
            ? []
            : payloadDetails.data.miscellaneousExpences,

        payableData: payableDetails,
      });
    }
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
      totalAmount = parseFloat(this.state.completionData.totalBidFee);

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
      let data = {
        id: preData.id,
        rate: this.state.trainingFee,
        total: this.state.trainingFee,
      };
      let res = await ApiCallVendor("sendJobBid", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.BID.SUCCESS_BID_SUBMIT, {
          hideProgressBar: true,
        });
        return history.push("/vendorTrainingList");
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


  _onHourChange = (data) => {
    if (this.state.completionData.intervalHour) {
        this.state.completionData.intervalHour = hourChange(data);
        this.setState({
            completionData: this.state.completionData
        })
    }
}

// for hour up button
_onHourUpChange = (data) => {
    if (this.state.completionData.intervalHour) {
        this.state.completionData.intervalHour = hourReversChange(data);
        this.setState({
            completionData: this.state.completionData
        })
    }
}

// for change minute
_onMuniteChange = (data) => {
    if (this.state.completionData.intervalMunite) {
        this.state.completionData.intervalMunite = minutesChange(data);
        this.setState({
            completionData: this.state.completionData
        })
    }
}

// for minute up arrow
_onMuniteUpChange = (data) => {
    if (this.state.completionData.intervalMunite) {
        this.state.completionData.intervalMunite = minutesReversChange(data);
        this.setState({
            completionData: this.state.completionData
        })
    }
}

// prifix change
_onAmPmChange = (data) => {
    if (this.state.completionData.intervalAmp) {
        this.state.completionData.intervalAmp = amPmChange(data);
        this.setState({
            completionData: this.state.completionData
        })
    }
}


  hourInputChange = (e) => {
    if (timeValidator(e.target.value)) {
      this.setState({
        hour: e.target.value,
      });
    }
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
      arivalTime:this.state.completionData.intervalHour + ":" + this.state.completionData.intervalMunite + " " + this.state.completionData.intervalAmp,
       
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
          : SetDOBFormat(this.state.completionData.followUpDate),
      selectFollowUpTimeRange:
        this.state.followUpTimeData.label === null ||
        this.state.followUpTimeData.label === undefined ||
        this.state.followUpTimeData.label === ""
          ? ""
          : this.state.followUpTimeData.label,
      expensesApproveByAdmin:
        this.state.completionData.expensesApproveByAdmin === null ||
        this.state.completionData.expensesApproveByAdmin === undefined ||
        this.state.completionData.expensesApproveByAdmin === ""
          ? ""
          : this.state.completionData.expensesApproveByAdmin.toString(),
      miscellaneousExpences: miscellaneousExpences,
    };

    consoleLog("))))", reqData);

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

  onSubmitPayable = async() => {
    let mainData = this.props.location,
    preData = mainData.state;
    let reqData = {
      "bidRequestId": preData.id,
      "requestId": preData.requestId,
      "totalAmount": this.state.payableData.totalBidFee
  }
  consoleLog("req",reqData)
  let sendPayableData = await ApiCallVendor("sendTrainingPayable", reqData);
  if (
    sendPayableData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    sendPayableData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  ) {
    toast.success("Send Successfully !!")
    return history.push("/vendorTrainingList")

  } else {
    toast.error("Error Occured !!")
  }
  }

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
            <Link to="/vendorDashboard">Dashboard</Link> /{" "}
            <Link to="/vendorTrainingList">Training</Link> / Training
          </div>
          <div className="job-details-tab jobdltste _fl sdw">
            <ul className="nav nav-tabs" style={{ height: "59px" }}>
              <li className="nav-item" style={{ width: "25%" }}>
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
              {this.state.preDataStatus === 4 ? (
                <React.Fragment>
                  <li className="nav-item" style={{ width: "25%" }}>
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
                  <li className="nav-item" style={{ width: "25%" }}>
                    {" "}
                    <a className="nav-link" data-toggle="tab" href="#payable">
                      <div className="taber">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.TABBAR} />
                        </figure>
                        Payables
                      </div>
                    </a>{" "}
                  </li>
                </React.Fragment>
              ) : this.state.preDataStatus === 1 ||
                this.state.preDataStatus === 2 ||
                this.state.preDataStatus === 3 ? (
                <React.Fragment>
                  <li className="nav-item" style={{ width: "25%" }}>
                    {" "}
                    <a className="nav-link" data-toggle="tab" href="#bid_view">
                      <div className="taber">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.TABBAR} />
                        </figure>
                        View Bid
                      </div>
                    </a>{" "}
                  </li>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <li className="nav-item" style={{ width: "25%" }}>
                    {" "}
                    <a
                      className="nav-link"
                      data-toggle="tab"
                      href="#bid_submit"
                    >
                      <div className="taber">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.TABBAR} />
                        </figure>
                        Bid Submit
                      </div>
                    </a>{" "}
                  </li>
                </React.Fragment>
              )}

              <li className="nav-item" style={{ width: "25%" }}>
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
              </li>
              <li className="nav-item" style={{ width: "25%" }}>
                {" "}
                <a className="nav-link" data-toggle="tab" href="#nofifications">
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.NOTIFICATION_ICON} />
                    </figure>
                    Notifications
                  </div>
                </a>{" "}
              </li>
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
                          Participant
                        </td>
                        <th width="50%" align="right">
                          {this.state.serviceProvider === ""
                            ? "N/A"
                            : this.state.serviceProvider}
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
                          Status
                        </td>
                        <th width="50%" align="right">
                          {this.state.preDataStatus === 0 ? (
                            <p className="yellow_font_color">Offer Received</p>
                          ) : this.state.preDataStatus === 1 ? (
                            <p className="sky_font_color">Bid Sent</p>
                          ) : this.state.preDataStatus === 2 ? (
                            <p className="green_font_color">Bid Accepted</p>
                          ) : this.state.preDataStatus === 3 ? (
                            <p className="sky_font_color">In Progress</p>
                          ) : this.state.preDataStatus === 4 ? (
                            <p className="blue_font_color">Completed</p>
                          ) : (
                            <p className="red_font_color">Cancelled</p>
                          )}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* .......................view Bid.................................. */}

              <div className="tab-pane" id="bid_view">
                <div className="job-section-tab">
                  <div className="view-quote-details-wrap">
                    <h3>View Bid Details</h3>
                    <p>
                      <span>Project Id</span> {this.state.jobId}
                    </p>
                    <p>
                      <span>Training Format</span> {this.state.trainingFormat}
                    </p>
                    <p>
                      <span>Location</span>{" "}
                      {this.state.serviceAddress === "" ||
                      this.state.serviceAddress === null ||
                      this.state.serviceAddress === undefined
                        ? "N/A"
                        : this.state.serviceAddress}
                    </p>
                    <p>
                      <span>Training Category</span>{" "}
                      {this.state.trainingCategory}
                    </p>
                    <p>
                      <span>Training Course</span> {this.state.trainingCourse}
                    </p>
                    <p>
                      <span>Date & Time</span> {SetDateFormat(this.state.date)}|
                      {this.state.scheduleTime}
                    </p>
                  </div>
                  <div className="add-more-field">
                    <div className="table-listing-app create">
                      <div className="creat_quot">
                        <h3>Submit Bid</h3>
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
                        return history.push("/vendorTrainingList");
                      }}
                    >
                      Back
                    </a>
                    <a
                      href="javascript:void(0)"
                      className="blue-btn"
                      style={{ textDecoration: "none" }}
                      onClick={this.onSubmitBid}
                    >
                      Submit
                    </a>
                  </div>
                </div>
              </div>

              {/* ..............................submit Bid................................. */}

              <div className="tab-pane" id="bid_submit">
                <div className="job-section-tab">
                  <div className="view-quote-details-wrap">
                    <h3>View Bid Details</h3>
                    <p>
                      <span>Project Id</span> {this.state.jobId}
                    </p>
                    <p>
                      <span>Training Format</span> {this.state.trainingFormat}
                    </p>
                    <p>
                      <span>Location</span>{" "}
                      {this.state.serviceAddress === "" ||
                      this.state.serviceAddress === null ||
                      this.state.serviceAddress === undefined
                        ? "N/A"
                        : this.state.serviceAddress}
                    </p>
                    <p>
                      <span>Training Category</span>{" "}
                      {this.state.trainingCategory}
                    </p>
                    <p>
                      <span>Training Course</span> {this.state.trainingCourse}
                    </p>
                    <p>
                      <span>Date & Time</span> {SetDateFormat(this.state.date)}|
                      {this.state.scheduleTime}
                    </p>
                  </div>
                  <div className="add-more-field">
                    <div className="table-listing-app create">
                      <div className="creat_quot">
                        <h3>Submit Bid</h3>
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
                                        // readOnly
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
                        return history.push("/vendorTrainingList");
                      }}
                    >
                      Back
                    </a>
                    <a
                      href="javascript:void(0)"
                      className="blue-btn"
                      style={{ textDecoration: "none" }}
                      onClick={this.onSubmitBid}
                    >
                      Submit
                    </a>
                  </div>
                </div>
              </div>
              {/* .............................completion summary................. */}
              <div className="tab-pane" id="summary">
                <div className="job-section-tab">
                  {/* {Object.keys(this.state.completeSummary).length > 0 ? ( */}
                  <React.Fragment>
                    <h2>SUMMARY</h2>
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
                              <td width="50%" align="left">
                                Interpreter Arrival Time
                              </td>
                              <th width="50%" align="center">
                                <div
                                  className="t-time"
                                  style={{ marginTop: "20px" }}
                                >
                                  <span className="t1">
                                    <small>
                                      {this.state.postJobStat === 1 ? (
                                        <React.Fragment></React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <img
                                            src={ImageName.IMAGE_NAME.U_IMG}
                                            alt=""
                                            style={{ cursor: "pointer" }}
                                            onClick={() => this._onHourChange(this.state.completionData.intervalHour)}
                                          />
                                        </React.Fragment>
                                      )}
                                      <br />
                                      <input
                                        type="text"
                                        placeholder=""
                                        value={this.state.completionData.intervalHour ? this.state.completionData.intervalHour : "01"}
                                        className="tsd2"
                                        // readonly
                                        // onChange={this.hourInputChange}
                                      />
                                      <br />
                                      {this.state.postJobStat === 1 ? (
                                        <React.Fragment></React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <img
                                            src={ImageName.IMAGE_NAME.B_ARROW}
                                            alt=""
                                            style={{ cursor: "pointer" }}
                                            onClick={() => this._onHourUpChange(this.state.completionData.intervalHour)}
                                            disabled={
                                              this.state.postJobStat === 1
                                                ? true
                                                : false
                                            }
                                          />
                                        </React.Fragment>
                                      )}
                                    </small>
                                  </span>
                                  <span className="t2">
                                    <small>
                                      {this.state.postJobStat === 1 ? (
                                        <React.Fragment></React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <img
                                            src={ImageName.IMAGE_NAME.U_IMG}
                                            alt=""
                                            style={{ cursor: "pointer" }}
                                            onClick={() => this._onMuniteChange(this.state.completionData.intervalMunite)}
                                          />
                                        </React.Fragment>
                                      )}
                                      <br />
                                      <input
                                        type="text"
                                        placeholder=""
                                        value={this.state.completionData.intervalMunite ? this.state.completionData.intervalMunite : "00"}
                                        className="tsd2"
                                        // readonly
                                        // onChange={this.minInputChange}
                                      />
                                      <br />
                                      {this.state.postJobStat === 1 ? (
                                        <React.Fragment></React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <img
                                            src={ImageName.IMAGE_NAME.B_ARROW}
                                            alt=""
                                            style={{ cursor: "pointer" }}
                                            onClick={() => this._onMuniteUpChange(this.state.completionData.intervalMunite)}
                                          />
                                        </React.Fragment>
                                      )}
                                    </small>
                                  </span>
                                  <span
                                    className="t3"
                                    style={{ marginLeft: "2%" }}
                                  >
                                    <small>
                                      {this.state.postJobStat === 1 ? (
                                        <React.Fragment></React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <img
                                            src={ImageName.IMAGE_NAME.U_IMG}
                                            alt=""
                                            style={{ cursor: "pointer" }}
                                            onClick={() => this._onAmPmChange(this.state.completionData.intervalAmp)}
                                          />
                                        </React.Fragment>
                                      )}
                                      <br />
                                      <input
                                        type="text"
                                        placeholder=""
                                        value={this.state.completionData.intervalAmp ? this.state.completionData.intervalAmp : "AM"}
                                        className="tsd2"
                                        readonly
                                      />
                                      <br />
                                      {this.state.postJobStat === 1 ? (
                                        <React.Fragment></React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <img
                                            src={ImageName.IMAGE_NAME.B_ARROW}
                                            alt=""
                                            style={{ cursor: "pointer" }}
                                            onClick={this.ampmChange}
                                          />
                                        </React.Fragment>
                                      )}
                                    </small>
                                  </span>
                                </div>
                              </th>
                              {/* <th width="33%" align="center">{this.state.completeSummary.isArrivalAprroved}</th> */}
                            </tr>
                            <tr>
                              <td width="50%" align="left">
                                Interpreter Start Time
                              </td>
                              <th width="50%" align="center">
                                {this.state.startTime}
                              </th>
                              {/* <th width="33%" align="center">{this.state.completeSummary.isStartApproved}</th> */}
                            </tr>
                            <tr>
                              <td width="50%" align="left">
                                Interpreter End Time
                              </td>
                              <th width="50%" align="center">
                                {this.state.endTime}
                              </th>
                            </tr>
                            <tr>
                              <td width="50%" align="left">
                                Location
                              </td>
                              <th width="50%" align="center">
                                {this.state.summaryLocation}
                              </th>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {this.state.followUpCheck === 1 ? (
                      <React.Fragment>
                        <div className="row" style={{ padding: "15px" }}>
                          <div className="col-md-4">
                            Provide follow up details
                          </div>
                          <div className="col-md-2"></div>
                          <div className="col-md-4">
                            <div className="followup_details">
                              <input
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
                              />
                              <div
                                className="dropdwn"
                                style={{ marginTop: "10px", width: "200px" }}
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

                        {/* {this.state.followUpDate === null ||
                                      this.state.followUpDate === undefined ||
                                      this.state.followUpDate === ""
                                        ? "N/A"
                                        : <input
                                        type="date"
                                        className="datefield bd"
                                        placeholder="10/25/2021"
                                        value={this.state.followUpDate}
                                        onChange={this.formDateChange}
                                        style={{
                                          textAlign: "center",
                                          height: "50px",
                                        }}
                                      />} */}
                      </React.Fragment>
                    ) : (
                      <React.Fragment />
                    )}

                    <div className="_fl margin-top-30 br-bx">
                      <div className="row">
                        <div className="col-md-6">
                          <p>Are you available for follow up?</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="check-field">
                            <label className="checkbox_btn">
                              <input
                                disabled={
                                  this.state.postJobStat === 1 ? true : false
                                }
                                type="radio"
                                name="radio_follow"
                                id="follow_yes"
                                //   checked={this.state.followUpCheck}
                                defaultChecked={
                                  this.state.followUpCheck === 1 ? true : false
                                }
                                onClick={(e) => this.onSelectFollowupYes(e)}
                              />
                              <span className="checkmark3"></span> Yes
                            </label>
                          </div>
                          <div className="check-field">
                            <label className="checkbox_btn">
                              <input
                                disabled={
                                  this.state.postJobStat === 1 ? true : false
                                }
                                type="radio"
                                name="radio_follow"
                                id="follow_no"
                                defaultChecked={
                                  this.state.followUpCheck === 0 ? true : false
                                }
                                onClick={(e) => this.onSelectFollowupNo(e)}
                              />
                              <span className="checkmark3"></span> No
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="_fl margin-top-50 br-bx">
                      <div className="row">
                        <div className="col-md-12">
                          <h2>MISCELLANEOUS EXPENSES</h2>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          Are you miscellaneous expenses approved by 7C Lingo?
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="check-field">
                          <label className="checkbox_btn">
                            <input
                              disabled={
                                this.state.postJobStat === 1 ? true : false
                              }
                              type="radio"
                              name="radio_expense"
                              id="expense_yes"
                              defaultChecked={
                                this.state.expenseCheck === 1 ? true : false
                              }
                              onClick={(e) => this.onSelectExpenseYes(e)}
                            />
                            <span className="checkmark3"></span> Yes
                          </label>
                        </div>
                        <div className="check-field">
                          <label className="checkbox_btn">
                            <input
                              disabled={
                                this.state.postJobStat === 1 ? true : false
                              }
                              type="radio"
                              name="radio_expense"
                              id="expense_no"
                              defaultChecked={
                                this.state.expenseCheck === 0 ? true : false
                              }
                              onClick={(e) => this.onSelectExpenseNo(e)}
                            />
                            <span className="checkmark3"></span> No
                          </label>
                        </div>
                      </div>
                    </div>
                    {/* {consoleLog("*********:::>??",this.state.miscellaneousExpences.length)} */}
                    {this.state.postJobStat === 0 ? (
                      <React.Fragment>
                        <div
                          className="main_table"
                          style={{ marginTop: "50px" }}
                        >
                          <div className="table-responsive">
                            <table
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tbody>
                                {this.state.miscellaneousExpences.length > 0 ? (
                                  <React.Fragment>
                                    <tr>
                                      <td width="30%" align="left">
                                        Expense Type
                                      </td>
                                      <td width="30%" align="left">
                                        Incidentals
                                      </td>
                                      <td width="30%" align="left">
                                        Receipt Amount
                                      </td>
                                      <td width="10%" align="center"></td>
                                    </tr>
                                  </React.Fragment>
                                ) : (
                                  <React.Fragment></React.Fragment>
                                )}

                                {this.state.miscellaneousExpences.map(
                                  (item, key) => (
                                    <tr>
                                      <td width="30%" align="left">
                                        <input
                                          className="inputfield flr"
                                          type="text"
                                          placeholder="Particulars"
                                          value={item.expenseType}
                                          onChange={(e) =>
                                            this.onExpenceTypeChange(e, key)
                                          }
                                        />
                                      </td>
                                      <td width="30%" align="left">
                                        {/* <input
                                            className="inputfield flr"
                                            type="text"
                                            placeholder="Particulars"
                                            value={item.title}
                                            onChange={(e) =>
                                              this.onParticularChange(e, key)
                                            }
                                          /> */}

                                        <div class="upload-profile">
                                          <label
                                            htmlFor="file-upload"
                                            for={"profile_image" + key}
                                            className="doc-sheet training_file"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            // title={this.state.adminPhoto}
                                            style={{ cursor: "pointer" }}
                                            // hidden={this.state.onDocLoad}
                                          >
                                            Browse
                                          </label>

                                          <input
                                            className="inputfield flr"
                                            placeholder="Browse"
                                            type="file"
                                            id={"profile_image" + key}
                                            style={{ display: "none" }}
                                            onChange={(e) =>
                                              this.onProfileImage(e, key)
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td width="30%" align="left">
                                        <div className="input-group">
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
                                            value={item.receiptAmount}
                                            style={{ width: "75%" }}
                                            onChange={(e) =>
                                              this.onReceiptAmountChange(e, key)
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td width="10%" align="left">
                                        <div className="col-md-1 delete-btn">
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
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <div
                          className="main_table"
                          style={{ marginTop: "50px" }}
                        >
                          <div className="table-responsive">
                            <table
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tbody>
                                {this.state.miscellaneousExpences.length > 0 ? (
                                  <React.Fragment>
                                    <tr>
                                      <td width="30%" align="left">
                                        Expense Type
                                      </td>
                                      <td width="30%" align="left">
                                        Incidentals
                                      </td>
                                      <td width="30%" align="left">
                                        Receipt Amount
                                      </td>
                                      <td width="10%" align="center"></td>
                                    </tr>
                                  </React.Fragment>
                                ) : (
                                  <React.Fragment></React.Fragment>
                                )}

                                {this.state.miscellaneousExpences.map(
                                  (item, key) => (
                                    <tr>
                                      <td width="30%" align="left">
                                        <input
                                          className="inputfield flr"
                                          type="text"
                                          placeholder="Particulars"
                                          value={item.title}
                                          onChange={(e) =>
                                            this.onExpenceTypeChange(e, key)
                                          }
                                        />
                                      </td>
                                      <td width="30%" align="center">
                                        <input
                                          className="inputfield flr"
                                          type="text"
                                          placeholder="Particulars"
                                          value={item.title}
                                          onChange={(e) =>
                                            this.onParticularChange(e, key)
                                          }
                                        />
                                      </td>
                                      <td width="30%" align="left">
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
                                            value={item.receiptAmount}
                                            style={{ width: "75%" }}
                                            onChange={(e) =>
                                              this.onReceiptAmountChange(e, key)
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td width="10%" align="left">
                                        <div className="col-md-1 delete-btn">
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
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </React.Fragment>
                    )}

                    {/* .............................................. */}
                    {this.state.postJobStat === 0 ? (
                      <React.Fragment>
                        <div className="_fl">
                          <div className="row">
                            <div className="col-md-12 text-center">
                              <button
                                className="add_more_project_btn"
                                style={{ marginTop: "50px" }}
                                onClick={this.addParticularField}
                              >
                                ADD MORE
                              </button>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        
                      </React.Fragment>
                    )}
                    <table style={{ width: "100%" }}>
                      <tr>
                        <td
                          align="left"
                          style={{
                            color: "#5ea076",
                            fontSize: "22px",
                            fontWeight: "500",
                            width: "50%",
                          }}
                        >
                          Total Payable
                        </td>
                        <td
                          style={{
                            color: "#5ea076",
                            textAlign: "center",
                            fontSize: "22px",
                            fontWeight: "500",
                            width: "50%",
                          }}
                        >
                          $ {this.state.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </table>

                    <div className="_button-style m30 _fl text-center">
                      <a
                        href="javascript:void(0)"
                        className="white-btn"
                        style={{ textDecoration: "none" }}
                        onClick={() => {
                          return history.push("/vendorTrainingList");
                        }}
                      >
                        Back
                      </a>
                      {this.state.postJobStat === 0 ? (
                        <React.Fragment>
                          <a
                            href="javascript:void(0)"
                            className="blue-btn"
                            style={{ textDecoration: "none" }}
                            onClick={this.onSubmitSummary}
                          >
                            submit
                          </a>
                        </React.Fragment>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}
                    </div>
                  </React.Fragment>
                  {/* ) : (
                      <React.Fragment>
                        <ReactLoader />
                      </React.Fragment>
                    )} */}
                </div>
              </div>

              {/* .........................payable........................... */}

              <div className="tab-pane" id="payable">
                <div className="job-section-tab">
                  {Object.keys(this.state.payableData).length > 0 ? (
                    <React.Fragment>
                      <table
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >
                        <tbody>
                          <tr>
                            <td width="50%" align="left">
                              Bid Id
                            </td>
                            <th width="50%" align="right">
                              {this.state.payableData.requestId}
                            </th>
                          </tr>

                          <tr>
                            <td width="50%" align="left">
                              Site Contact
                            </td>
                            <th width="50%" align="right">
                              {this.state.payableData.siteContact == ""
                                ? "N/A"
                                : this.state.payableData.siteContact}
                            </th>
                          </tr>

                          <tr>
                            <td width="50%" align="left">
                              Format
                            </td>
                            <th width="50%" align="right">
                              {this.state.payableData.trainingFormat === ""
                                ? "N/A"
                                : this.state.payableData.trainingFormat}
                            </th>
                          </tr>

                          <tr>
                            <td width="50%" align="left">
                              Training Category
                            </td>
                            <th width="50%" align="right">
                              {this.state.payableData.trainingCat}
                            </th>
                          </tr>

                          <tr>
                            <td width="50%" align="left">
                              Location
                            </td>
                            <th width="50%" align="right">
                              {this.state.payableData.location == "" ||
                              this.state.payableData.location == undefined ||
                              this.state.payableData.location == null
                                ? "N/A"
                                : this.state.payableData.location}
                            </th>
                          </tr>
                          <tr>
                            <td width="50%" align="left">
                              Received On
                            </td>
                            <th width="50%" align="right">
                              {SetDateFormat(this.state.payableData.scheduleDate)}
                           
                            </th>
                          </tr>

                          <tr>
                            <td width="50%" align="left">
                              Duration
                            </td>
                            <th width="50%" align="right">
                              {this.state.payableData.duration}
                            </th>
                          </tr>
                          <tr>
                            <td width="50%" align="left">
                              Total Payable
                            </td>
                            <th width="50%" align="right">
                             $ {this.state.payableData.totalBidFee}
                            </th>
                          </tr>
                        </tbody>
                      </table>
                      {this.state.postJobStat == 1 ? <React.Fragment>
                        <div className="_button-style m30 _fl text-center">
                      <a
                            href="javascript:void(0)"
                            className="blue-btn"
                            style={{ textDecoration: "none" }}
                            onClick={this.onSubmitPayable}
                          >
                            Send Payables
                          </a>

                      </div>
                      </React.Fragment> : <React.Fragment/>}
                     
                    
                    </React.Fragment>
                  ) : (
                    <React.Fragment />
                  )}
                </div>
              </div>

              {/* .................................................................................. */}

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
        <div
          class="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}
