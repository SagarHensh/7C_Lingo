import React, { Component } from "react";
import { styled, Box } from "@mui/system"; //imported for modal
import Switch from "@mui/material/Switch";
import "./viewTrainingDetails.css";

import { AlertMessage, ImageName } from "../../../../enums";
import { ApiCall } from "../../../../services/middleware";
import { CryptoDecoder, Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";
import {
  inputEmptyValidate,
  mobileNumberValidator,
  numberValidator,
  zipValidate,
} from "../../../../validators";
import { Regex } from "../../../../services/config";
import Select, { components } from "react-select";
import { SmallSelectBox } from "../../SharedComponents/inputText";
import history from "../../../../history";
import {
  consoleLog,
  SetDateFormat,
  SetTimeFormat,
} from "../../../../services/common-function";
import ReactLoader from "../../../Loader";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import { IMAGE_PATH_ONLY } from "../../../../services/config/api_url";
import EditTrainingDetails from "./EditTrainingDetails";

// .............................................................

export default class ViewTrainingDetails extends React.Component {
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

      completeSummary: {},
      mislleniousExpenses: [],
      miscTotal: 0.0,

      reqId: "",
      payable: [],
      receivable: [],
      pathCheck: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    document.getElementById("backdrop").style.display = "none";
    let mainData = this.props.location,
      preData = mainData.state;
    // consoleLog("preData:", preData);
    if (preData === undefined) {
      return history.push("/adminTrainingList");
    } else {
      this.setState({
        reqId: preData,
      });
      this.load();
    }
    // this.load();
    if (this.props.match.path === "/adminTrainingDetailsFromBillVerification") {
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
    let mainData = this.props.location,
      preData = mainData.state;
    this.setState({
      requestId: preData,
    });
    let detailData = {
      requestId: preData,
    };

    let clientDetails = {},
      jobDetails = {},
      quoteInfo = {},
      quoteId = "N/A",
      particularsArr = [],
      totalAmount = 0,
      rushFee = 0,
      trainingFee = 0,
      completeSummary = {},
      mislleniousExpenses = [],
      miscTotal = 0.0,
      payable = [],
      receivable = [];

    //...............Get complete summury............

    // let summuryRes = await ApiCall("getJobCompleteSummary", { requestId: 20 });
    let summuryRes = await ApiCall("getJobCompleteSummary", detailData);
    if (
      summuryRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      summuryRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(summuryRes.data.payload);
      consoleLog("Conmplete Summry for training::", payload.data);
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

    //................ For all Vendor.................

    let res = await ApiCall("getVendorsWorkingStatusTraining", detailData);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      // consoleLog("All Vendor List for training::", payload.data)
      let vendorList = payload.data.vendorList,
        brr = [],
        scount = 0,
        totalPage = Math.ceil(payload.data.length / this.state.limit);

      vendorList.map((aa) => {
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

      this.setState({
        listData: vendorList,
        total_page: totalPage,
        vendorAssigned: brr,
      });
    }
    // ................Job details.................

    let detailsRes = await ApiCall("getJobDetails", detailData);
    if (
      detailsRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      detailsRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let detailPayload = Decoder.decode(detailsRes.data.payload);
      // consoleLog("Project Details Training>>>", detailPayload.data)
      if (detailPayload.data.clientDetails) {
        clientDetails = detailPayload.data.clientDetails;
      }
      if (detailPayload.data.jobDetails) {
        jobDetails = detailPayload.data.jobDetails;
      }
      if (Object.keys(detailPayload.data.quoteInfo).length > 0) {
        quoteInfo = detailPayload.data.quoteInfo;
        quoteId = detailPayload.data.quoteInfo.quoteId;
        totalAmount = detailPayload.data.quoteInfo.total;
        rushFee = detailPayload.data.quoteInfo.rushFee;
        trainingFee = detailPayload.data.quoteInfo.fee;
        particularsArr = JSON.parse(detailPayload.data.quoteInfo.additionalFee);
      }

      if (jobDetails.quoteStatus === 10) {
        //...............Get Payable and Receivable Data............

        let payableRes = await ApiCall(
          "fetchPayableTraining",
          detailData
        );
        if (
          payableRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          payableRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          let payload = Decoder.decode(payableRes.data.payload);
          consoleLog("Payable List:::", payload.data);
          if (payload.data.details.length > 0) {
            payable = payload.data.details;
          }
        }

        let receivableRes = await ApiCall(
          "fetchReceivabaleTraining",
          detailData
        );
        if (
          receivableRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          receivableRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          let payload = Decoder.decode(receivableRes.data.payload);
          consoleLog("Receivable List:::", payload.data);
          if (payload.data.details.length > 0) {
            receivable = payload.data.details;
          }
        }
      }

      // ...........................................

      this.setState({
        //.............Client Details Set............
        clientId: jobDetails.clientId,
        clientFirstName: clientDetails.fName,
        clientLastName: clientDetails.lName,
        clientEmailId: clientDetails.businessEmail,
        clientName: clientDetails.clientName,
        clientIndustryType: clientDetails.industtryType,
        clientPhone: clientDetails.adminPhone,
        //..............Job Details Set..............
        quoteStatus: jobDetails.quoteStatus,
        jobId: jobDetails.jobId,
        trainingFormat: jobDetails.trainingFormat,
        trainingCategory: jobDetails.trainingCategory,
        trainingCourse: jobDetails.trainingCourse,
        budget: jobDetails.budget,
        date: jobDetails.scheduleDate,
        scheduleTime: jobDetails.scheduleTime,
        countryCode: clientDetails.adminCountryCode,
        serviceAddress:
          jobDetails.location === null ||
            jobDetails.location === undefined ||
            jobDetails.location === ""
            ? "N/A"
            : jobDetails.location,
        siteContant:
          jobDetails.siteContact === null ||
            jobDetails.siteContact === undefined ||
            jobDetails.siteContact === ""
            ? "N/A"
            : jobDetails.siteContact,
        consumer: jobDetails.consumer,
        serviceProvider: jobDetails.noOfserviceProvider,
        notesByClient: jobDetails.noteByClient,
        notesBy7C: jobDetails.noteFor7C,
        quoteId: quoteId,
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
        notesFromClient: jobDetails.noteByClient,
        deliveryType:
          clientDetails.isOutOfTown === 1 ? "OUT OF TOWN" : "IN TOWN",
        duration: jobDetails.duration,
        particularsArr: particularsArr,
        totalAmount: totalAmount,
        rushFee: rushFee,
        interpretationFee: trainingFee,
        clientIndustryType: clientDetails.industtryType,
        completeSummary: completeSummary,
        mislleniousExpenses: mislleniousExpenses,
        miscTotal: miscTotal,
        payable: payable,
        receivable: receivable,
        isLoad: false,
      });
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

  onTranslationUnitCostChange = (e) => {
    let val = zipValidate(e.target.value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        translationUnitCost: val,
      });
    }
  };
  onTranslationRateChange = (e) => {
    let val = zipValidate(e.target.value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        translationRate: val,
      });
    }
  };

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

    this.setState({
      particularsArr: amt,
      particularDataArr: particularData,
    });
  };

  onParticularAmountChange = (e, index) => {
    let data = e.target.value,
      particularAmtDataArr = [];
    var valid = !isNaN(data);

    let amount = e.target.value === "" ? 0 : parseInt(e.target.value);

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


    this.setState({
      particularsArr: arr,
      totalAmount: amt,
      totalParticularAmt: particularAmt,
    });
  };
  onCreateQuote = async () => {
    let mainData = this.props.location;
    let preData = mainData.state;
    let errorCount = 0;

    let validateInterpretationFee = inputEmptyValidate(
      this.state.interpretationFee
    );

    // if (validateInterpretationFee === false) {
    // if (this.state.interpretationFee === 0) {
    //   toast.error(AlertMessage.MESSAGE.JOB.EMPTY_FEE, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // }

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
        return history.push("/adminClientRfqList");
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
      return history.push("/adminTrainingList");
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
          return history.push("/adminTrainingList");
        }.bind(this),
        1000
      );
    }
  };

  // acceptClient = async () => {
  //     let data = {
  //         clientId: this.state.clientId,
  //         requestId: this.state.requestId
  //     }
  //     let res = await ApiCall("acceptClientQuote", data);
  //     if (
  //         res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
  //         res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  //     ) {
  //         toast.success(AlertMessage.MESSAGE.JOB.QUOTE_ACCEPTED_BY_CLIENT);
  //         setTimeout(
  //             function () {
  //                 return history.push("/adminTrainingList")
  //             }
  //                 .bind(this),
  //             1000
  //         );
  //     }
  // }

  onDownloadMisc = (pos) => {
    window.open(
      IMAGE_PATH_ONLY + this.state.mislleniousExpenses[pos].incidentals,
      "_blank"
    );
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
        "fetchPayableTraining",
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
        "fetchReceivabaleTraining",
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
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            {" "}
            <Link to="/adminDashboard">Dashboard</Link> /{" "}
            {this.state.pathCheck == true ? (
              <Link to="/adminMainBillUnderVerification">Bills Under Verification</Link>
            ) : (
              <Link to="/adminTrainingList">Training</Link>
            )}
            / Training Details
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
                    Details
                  </div>
                </a>{" "}
              </li>
              {this.state.quoteStatus === 7 ||
                this.state.quoteStatus === 9 ||
                this.state.quoteStatus === 10 ||
                this.state.quoteStatus === 11 ? (
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
                        Edit Training
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
              {this.state.quoteStatus === 2 ||
                this.state.quoteStatus === 3 ||
                this.state.quoteStatus === 6 ||
                this.state.quoteStatus === 8 ? (
                <li className="nav-item">
                  {" "}
                  <a className="nav-link" data-toggle="tab" href="#vendoroff">
                    <div className="taber">
                      <figure>
                        <img src={ImageName.IMAGE_NAME.DOCUMENTICON} />
                      </figure>
                      {this.state.quoteStatus === 8
                        ? "Vendors Offered"
                        : "Available vendors"}
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
                          <img src={ImageName.IMAGE_NAME.TABBAR} />
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
                          <img src={ImageName.IMAGE_NAME.CHAT_ICON} />
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
                            </li>
                            <li className="nav-item">
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

              {/* .............................................................*/}

              <div className="tab-pane" id="sendqute">
                <div className="job-section-tab">
                  <div className="view-quote-details-wrap">
                    <h3>view quote details</h3>
                    <p>
                      <span>Quote Id</span> {this.state.quoteId}
                    </p>
                    <p>
                      <span>Training Format</span> {this.state.trainingFormat}
                    </p>
                    <p>
                      <span>Location</span> {this.state.serviceAddress}
                    </p>
                    <p>
                      <span>Training Category</span>{" "}
                      {this.state.trainingCategory}
                    </p>
                    <p>
                      <span>Training Course</span> {this.state.trainingCourse}
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
                  </div>
                  <div className="add-more-field">
                    <div className="table-listing-app create">
                      <div className="creat_quot">
                        <h3>View quote</h3>
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
                                <tr>
                                  <td width="50%" align="left">
                                    No. of Participants
                                  </td>
                                  <td width="50%" align="right">
                                    {this.state.serviceProvider}
                                  </td>
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
                                        value={this.state.interpretationFee}
                                        // onChange={(e) =>
                                        //     this.onInterpretationFeeChange(e)
                                        // }
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
                                              // onChange={(e) =>
                                              //     this.onParticularAmountChange(e, key)
                                              // }
                                              readOnly
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
                                    </td>
                                  </tr>
                                ))}

                                <tr>
                                  <td
                                    width="50%"
                                    align="left"
                                    style={{
                                      color: "#5ea076",
                                      fontSize: "22px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    Total Payable
                                  </td>
                                  <td
                                    width="50%"
                                    style={{
                                      color: "#5ea076",
                                      textAlign: "center",
                                      fontSize: "22px",
                                      fontWeight: "500",
                                    }}
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
                        return history.push("/adminTrainingList");
                      }}
                    >
                      Back
                    </a>
                    {/* <a
                                            href="javascript:void(0)"
                                            className="blue-btn"
                                            style={{ textDecoration: "none" }}
                                            onClick={this.onCreateQuote}
                                        >
                                            Send Quote
                                        </a> */}
                    {/* {this.state.quoteStatus === 1 ? <>
                                            <button type="button" class="btn btn-success" onClick={this.acceptClient}>Accept</button> <span style={{ color: "gray" }}>(On behalf of client)</span>
                                        </> : <></>
                                        } */}
                  </div>
                </div>
              </div>

              <div className="tab-pane" id="vendoroff">
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
                            {this.state.quoteStatus === 8 ? (
                              <React.Fragment></React.Fragment>
                            ) : (
                              <React.Fragment>
                                <th style={{ width: "5%" }}>
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
                            <th style={{ width: "30%" }}>Name / Agency</th>
                            <th style={{ width: "20%" }}>Email ID</th>
                            <th style={{ width: "20%" }}>Phone Number</th>
                            <th style={{ width: "10%" }}>Ratings</th>
                            {this.state.quoteStatus === 8 ? (
                              <th style={{ width: "15%" }}>Bid</th>
                            ) : (
                              <th style={{ width: "15%" }}>Status</th>
                            )}
                          </tr>
                        </tbody>
                        <tbody>
                          {this.state.listData.map((item, key) => (
                            <tr key={key}>
                              {this.state.quoteStatus === 8 ? (
                                <React.Fragment></React.Fragment>
                              ) : (
                                <React.Fragment>
                                  <td style={{ width: "5%" }}>
                                    <label className="custom_check2">
                                      <input
                                        type="checkbox"
                                        defaultChecked={
                                          item.isQuoteSent === 1 ? true : false
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
                              <td style={{ width: "30%" }}>
                                {item.agencyName === ""
                                  ? item.fName + " " + item.lName
                                  : item.fName +
                                  " " +
                                  item.lName +
                                  " (" +
                                  item.agencyName +
                                  ")"}
                              </td>
                              <td style={{ width: "20%" }}>
                                <a href="" className="viewlink">
                                  {item.email}
                                </a>
                              </td>
                              <td style={{ width: "20%" }}>+1 {item.mobile}</td>
                              <td style={{ width: "10%" }}>
                                <img src={ImageName.IMAGE_NAME.STARYELLOW} />
                                <span className="rat_txt">{item.ratings}</span>
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
                                      <a href="javascript:void(0)">
                                        <img
                                          src={ImageName.IMAGE_NAME.EYE_BTN}
                                          onClick={() => {
                                            this.handleBidModal(item.userId);
                                          }}
                                        />
                                      </a>
                                    ) : (
                                      <React.Fragment></React.Fragment>
                                    )}
                                  </td>
                                </React.Fragment>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {this.state.quoteStatus === 8 ? (
                    <React.Fragment></React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div className="_button-style _fl text-center margin-top-30">
                        <a
                          href="javascript:void(0)"
                          className="grey-btn"
                          style={{ textDecoration: "none" }}
                        >
                          Reset
                        </a>
                        <a
                          href="javascript:void(0)"
                          className="blue-btn"
                          style={{ textDecoration: "none" }}
                          onClick={this.handleVendorAssign}
                        >
                          Send Offer
                        </a>
                      </div>
                    </React.Fragment>
                  )}
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
                          <th style={{ width: "15%" }}>Training ID</th>
                          <th style={{ width: "20%" }}>Course</th>
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
                                    {data.trainingCourse}
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
                                        <span className="progress-btn yellow">
                                          Pending
                                        </span>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        {data.status === 1 ? (
                                          <React.Fragment>
                                            <span className="progress-btn sky" >
                                              Verified
                                            </span>
                                          </React.Fragment>
                                        ) : (
                                          <React.Fragment>
                                            <span className="progress-btn blue">
                                              Invoice Created
                                            </span>
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
                          <th style={{ width: "15%" }}>Training ID</th>
                          <th style={{ width: "20%" }}>Course</th>
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
                                    {data.trainingCourse}
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
                                        <span className="progress-btn yellow">
                                          Pending
                                        </span>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        {data.status === 1 ? (
                                          <React.Fragment>
                                            <span className="progress-btn sky" >
                                              Verified
                                            </span>
                                          </React.Fragment>
                                        ) : (
                                          <React.Fragment>
                                            <span className="progress-btn blue">
                                              Invoice Created
                                            </span>
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
                                  Interpreter Arrival Date
                                </td>
                                <th width="33%" align="center">
                                  {this.state.completeSummary.arrivalTime}
                                </th>
                                <th width="33%" align="center">
                                  {this.state.completeSummary.isArrivalAprroved}
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
                                  {this.state.completeSummary.isStartApproved}
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
                                  {this.state.completeSummary.isEndApproved}
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
                                // onChange={ratingChanged}
                                size={44}
                                isHalf={true}
                                activeColor="#009fe0"
                                value={this.state.completeSummary.clientRatings}
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
                            <p>Would you use the same interpreter?</p>
                          </div>
                          <div className="col-md-6">
                            <p className="np">
                              {this.state.completeSummary.isPrefVendor}
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
                            <p>{this.state.completeSummary.prefferedReason}</p>
                          </div>
                        </div>
                      </div>
                      <div className="_fl margin-top-30 br-bx">
                        <div className="row">
                          <div className="col-md-6">
                            <p>Is there any follow up appointments?</p>
                          </div>
                          <div className="col-md-6">
                            <p className="np">
                              {this.state.completeSummary.followUp}
                            </p>
                            {/* <a href="javascript:void(0)" className="_viewdetails">View Details</a> */}
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
                            <p>
                              {this.state.completeSummary.followUpDate} |{" "}
                              {this.state.completeSummary.followUpTimeRange}
                            </p>
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
                          +{this.state.countryCode} {this.state.clientPhone}
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
                    <span>Project ID</span> {this.state.jobId}
                  </p>
                  <p>
                    <span>Category</span> {this.state.trainingCategory}
                  </p>
                  <p>
                    <span>Course</span> {this.state.trainingCourse}
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
                            <th colspan="2" style={{ width: "60%" }}>
                              Vendor Name :{" "}
                              <span className="th_1">
                                {this.state.bidVendorName}
                              </span>
                            </th>
                            {/* <th style={{ width: "10%" }} className="th_1">{this.state.bidVendorName}</th> */}
                          </tr>
                          <tr>
                            <td>Rate / Hour</td>
                            <td>$ {this.state.bidFee}</td>
                          </tr>

                          <tr className="tt-count">
                            <td className="f1">Total Bid</td>
                            <td style={{ color: "green" }}>
                              {" "}
                              $ {this.state.totalBidFee}
                            </td>
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
        <div
          class="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}
