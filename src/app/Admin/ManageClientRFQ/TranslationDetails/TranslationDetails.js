import React, { Component } from "react";
import { styled, Box, color } from "@mui/system"; //imported for modal
import Switch from "@mui/material/Switch";

// import "./clientRfqDetails.css";

import { AlertMessage, ImageName } from "../../../../enums";
import { ApiCall } from "../../../../services/middleware";
import { CryptoDecoder, Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";
import {
  courseFeeValidate,
  inputEmptyValidate,
  mobileNumberValidator,
  numberValidator,
  zipValidate,
} from "../../../../validators";
import { Regex } from "../../../../services/config";

import history from "../../../../history";
import {
  consoleLog,
  SetDateFormat,
  textTruncate,
} from "../../../../services/common-function";
import ReactLoader from "../../../Loader";
import "./translationDetail.css";
import { IMAGE_PATH_ONLY } from "../../../../services/config/api_url";
import { Link } from "react-router-dom";

// .............................................................

export default class ClientRfqDetails extends React.Component {
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
      appointmentType: "",
      jobType: "",
      language: "",
      date: "",
      serviceAddress: "",
      siteContant: "",
      consumer: "",
      notesByClient: "",
      notesBy7C: "",
      taskList: [],
      taskData: [],
      // ................sendQuote............
      quoteId: "",
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
      rushFee: "",
      taskDetails: [],
      translationUnitCost: "",
      dtpUnitCost: "",
      translationRate: "",
      countryCode: "",
      additionalTranslationCharges: [],
      allChecked: false,
      vendorAssigned: [],
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    let mainData = this.props.location,
      preData = mainData.state;
    if (preData === undefined) {
      return history.push("/adminClientRfqList")
    } else {
      this.load();
    }
  }

  load = async () => {
    let mainData = this.props.location,
      preData = mainData.state;
    this.setState({
      requestId: preData.id
    })
    let detailData = {
      requestId: preData.id,
    };

    let languageArrData = [],
      languageObjData = {},
      languageResArrData = [],
      clientDetails = {},
      jobDetails = {},
      quoteInfo = {},
      taskDetails = [];

    // let languageResData = await ApiCall("getlanguagelist");
    // let languagePayload = Decoder.decode(languageResData.data.payload);
    // languageResArrData = languagePayload.data.languagelist;

    // for (let n = 0; n < languageResArrData.length; n++) {
    //   languageArrData.push({
    //     label: languageResArrData[n].language,
    //     value: languageResArrData[n].id,
    //   });
    //   if (languageResArrData[n].language === "English") {
    //     languageObjData = {
    //       label: languageResArrData[n].language,
    //       value: languageResArrData[n].id,
    //     };
    //   }
    // }

    //................ For all Vendor.................

    let res = await ApiCall("getVendorsWorkingStatusTranslation", detailData);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      // consoleLog("All Vendor List For translation>>>>>", payload.data)
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

    // ...................Translation Details..........................

    let detailsRes = await ApiCall("getTranslationDetails", detailData);
    consoleLog("API res::", detailsRes)

    let detailPayload = Decoder.decode(detailsRes.data.payload);
    consoleLog("Job Details Translation>>>>", detailPayload);

    clientDetails = detailPayload.data.clientDetails;
    jobDetails = detailPayload.data.jobDetails;
    taskDetails = detailPayload.data.taskList;
    quoteInfo = detailPayload.data.quoteInfo;

    let arr = [];
    if (taskDetails.length > 0) {
      taskDetails.map((data) => {
        arr.push({
          taskId: data.id,
          service: data.serviceName,
          sourceLanguage: data.sourceLanguage,
          targetLanguage: data.targetLanguage,
          wordCountQty: 0,
          wordCountCost: 0,
          wordCountRate: 0,
          dtpQty: 0,
          dtpCost: 0,
          dtpRate: 0,
          rushFeeUnit: 0,
          rushFeeCost: 0,
          rushFeeRate: 0,
          SubCost: 0
        })
      })
    }

    // ...........................................

    this.setState({
      // sourceLangData: languageObjData,
      // targetLangData: languageObjData,
      // languageArr: languageArrData,
      // ..........Client Details..........
      clientFirstName: clientDetails.fName,
      clientLastName: clientDetails.lName,
      clientEmailId: clientDetails.businessEmail,
      clientName: clientDetails.clientName,
      clientIndustryType: clientDetails.industtryType,
      clientPhone: clientDetails.adminPhone,
      //.................Job details..............
      jobId: jobDetails.jobId,
      // appointmentType: jobDetails.appointmentType,
      // jobType:
      //   jobDetails.jobType === null ||
      //     jobDetails.jobType === undefined ||
      //     jobDetails.jobType === ""
      //     ? "N/A"
      //     : jobDetails.jobType,
      language: jobDetails.sourceLanguage,
      date: jobDetails.expectedDeadline,
      countryCode: clientDetails.adminCountryCode,
      // serviceAddress:
      //   jobDetails.location === null ||
      //     jobDetails.location === undefined ||
      //     jobDetails.location === ""
      //     ? "N/A"
      //     : jobDetails.location,
      // siteContant:
      //   jobDetails.siteContact === null ||
      //     jobDetails.siteContact === undefined ||
      //     jobDetails.siteContact === ""
      //     ? "N/A"
      //     : jobDetails.siteContact,
      consumer: jobDetails.consumer,
      notesByClient: jobDetails.noteByClient,
      notesBy7C: jobDetails.noteFor7C,
      quoteId: quoteInfo.quoteId,
      targetAdience:
        jobDetails.targetAudience === null ||
          jobDetails.targetAudience === undefined ||
          jobDetails.targetAudience === ""
          ? "N/A"
          : jobDetails.targetAudience,
      isDtp: jobDetails.isDtp,
      // location:
      //   jobDetails.location === null ||
      //     jobDetails.location === undefined ||
      //     jobDetails.location === ""
      //     ? "N/A"
      //     : jobDetails.location,
      dateTime: jobDetails.scheduleDate,
      notesFromClient: jobDetails.noteByClient,
      deliveryType: clientDetails.isOutOfTown === 1 ? "OUT OF TOWN" : "IN TOWN",
      // duration: jobDetails.duration,
      clientIndustryType: clientDetails.industtryType,
      translationRate: quoteInfo.fee,
      taskList: taskDetails,
      taskData: arr,
      rushFee: quoteInfo.rushFee,
      // totalAmount: quoteInfo.total,
      isLoad: false,
    });
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
    let amt = this.state.additionalTranslationCharges;
    for (let i = 0; i < this.state.additionalTranslationCharges.length; i++) {
      if (i === index) {
        amt[i].title = e.target.value;
      }
    }

    this.setState({
      additionalTranslationCharges: amt,
    });
  };

  onParticularAmountChange = (e, index) => {
    let data = e.target.value;
    var valid = !isNaN(data);

    let amount = e.target.value === "" ? 0 : parseInt(e.target.value);
    // consoleLog("Particulars array amount", amount)

    let amt = this.state.additionalTranslationCharges,
      totalAmt = 0,
      allTranslationSum = 0,
      sum = 0;
    if (valid) {
      this.state.taskData.map((aa) => {
        allTranslationSum = allTranslationSum + (aa.SubCost)
      })
      for (let i = 0; i < amt.length; i++) {
        if (i === index) {
          amt[i].amt = amount.toString();
        }

        sum = sum + parseFloat(amt[i].amt);
      }
      totalAmt = parseFloat(sum) + parseFloat(allTranslationSum);
    }

    this.setState({
      additionalTranslationCharges: amt,
      totalParticularAmt: sum,
      totalAmount: totalAmt,
    });
  };



  addParticularField = () => {
    let arr = this.state.additionalTranslationCharges;
    // particularItem = "",
    // particularAmnt = 0;
    // for (let i = 0; i < this.state.particularsArr.length; i++) {
    arr.push({
      title: this.state.particular,
      // particularAmt: parseInt(this.state.particularAmt),
      amt: this.state.particularAmt,
    });

    this.setState({
      additionalTranslationCharges: arr,
    });
  };


  onDeleteParticulars = (index) => {
    let particularArray = this.state.additionalTranslationCharges;

    let arr = [],
      amt = 0,
      allTranslationSum = 0,
      particularAmt = 0;
    for (let i = 0; i < particularArray.length; i++) {
      if (i != index) {
        particularAmt = particularAmt + parseFloat(particularArray[i].amt);
        arr.push(particularArray[i]);
      }
    }
    this.state.taskData.map((aa) => {
      allTranslationSum = allTranslationSum + (aa.SubCost)
    })
    amt =
      amt +
      particularAmt +
      parseFloat(allTranslationSum)

    this.setState({
      additionalTranslationCharges: arr,
      totalAmount: amt,
    });
  };


  onCreateQuote = async () => {
    let mainData = this.props.location;
    let preData = mainData.state;
    let errorCount = 0;

    this.state.additionalTranslationCharges.map((aa) => {
      if (aa.title === "") {
        toast.error("Please input particulars on additional charges !!!");
        errorCount++;
      }
    })



    if (errorCount === 0) {
      let data = {
        requestId: preData.id,
        fee: this.state.interpretationFee,
        total: this.state.totalAmount,
        rushFee: this.state.rushFee,
        additionalFee: this.state.particularsArr,
        additionalTranslationCharges: this.state.additionalTranslationCharges
      };
      consoleLog("CreateQuote DAta ::", data)
      // let res = await ApiCall("createQuote", data);
      // if (
      //   res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      //   res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      // ) {
      //   toast.success(AlertMessage.MESSAGE.JOB.QUOTE_SEND, {
      //     hideProgressBar: true,
      //   });
      //   return history.push("/adminViewAllJobs");
      // } else{
      //   toast.error("Error Occured!!!");
      // }
    }
  };

  onDownload = (pos) => {
    window.open(IMAGE_PATH_ONLY + this.state.taskList[pos].documentPath, "_blank");
  }

  handleWordQty = (e, i) => {
    let arr = this.state.taskData;
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      val = parseFloat(e.target.value);
    } else {
      val = 0;
    }
    arr[i].wordCountQty = val;
    arr[i].wordCountRate = val * arr[i].wordCountCost;
    arr[i].SubCost = arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate;
    this.setState({
      taskData: arr
    })
    this.getTotalAmount();
  }

  handleWordCost = (e, i) => {
    let arr = this.state.taskData;
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      val = parseFloat(e.target.value);
    } else {
      val = 0;
    }
    arr[i].wordCountCost = val;
    arr[i].wordCountRate = val * arr[i].wordCountQty;
    arr[i].SubCost = arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate;
    this.setState({
      taskData: arr
    })
    this.getTotalAmount();
  }

  handleDtpQty = (e, i) => {
    let arr = this.state.taskData;
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      val = parseFloat(e.target.value);
    } else {
      val = 0;
    }
    arr[i].dtpQty = val;
    arr[i].dtpRate = val * arr[i].dtpCost;
    arr[i].SubCost = arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate;
    this.setState({
      taskData: arr
    })
    this.getTotalAmount();
  }

  handleDtpUnitCost = (e, i) => {
    let arr = this.state.taskData;
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      val = parseFloat(e.target.value);
    } else {
      val = 0;
    }
    arr[i].dtpCost = val;
    arr[i].dtpRate = val * arr[i].dtpQty;
    arr[i].SubCost = arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate;
    this.setState({
      taskData: arr
    })
    this.getTotalAmount();
  }

  handleRushUnit = (e, i) => {
    let arr = this.state.taskData;
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      val = parseFloat(e.target.value);
    } else {
      val = 0;
    }
    arr[i].rushFeeUnit = val;
    arr[i].rushFeeRate = val * arr[i].rushFeeCost;
    arr[i].SubCost = arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate;
    this.setState({
      taskData: arr
    })
    this.getTotalAmount();
  }

  handleRushUnitCost = (e, i) => {
    let arr = this.state.taskData;
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      val = parseFloat(e.target.value);
    } else {
      val = 0;
    }
    arr[i].rushFeeCost = val;
    arr[i].rushFeeRate = val * arr[i].rushFeeUnit;
    arr[i].SubCost = arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate;
    this.setState({
      taskData: arr
    });
    this.getTotalAmount();
  }

  getTotalAmount = () => {
    let arr = this.state.taskData,
      totalAmt = 0;

    arr.map((data, i) => {
      totalAmt = totalAmt + (data.SubCost);
    });

    this.setState({
      totalAmount: totalAmt
    });
  }

  OnSendQuote = async () => {
    let errorCount = 0;

    this.state.additionalTranslationCharges.map((aa) => {
      if (aa.title === "") {
        toast.error("Please input particulars on additional charges !!!");
        errorCount++;
      }
    })

    if (errorCount === 0) {
      let finalData = {
        requestId: this.state.requestId,
        total: this.state.totalAmount.toString(),
        taskDetails: this.state.taskData,
        additionalFee: this.state.additionalTranslationCharges
      }
      // consoleLog("Final Quote Send Data", finalData);
      let res = await ApiCall("createQuoteTranslation", finalData);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.JOB.QUOTE_SEND);
        return history.push("/adminProjectList");
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
      // consoleLog("Brr >>> ", brr)
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
      return history.push("/adminProjectList");
    }
  };

  // vendorAssigned = async (id) => {
  //   let apiObj = {
  //     requestId: this.state.requestId,
  //     vendorId: this.state.bidVendorDetails[id].userId,
  //     taskId: this.state.bidVendorDetails[id].id,
  //     taskNumber: this.state.bidVendorDetails[id].taskNo,
  //   };
  //   // consoleLog("Assigned Vendor data", apiObj);
  //   let res = await ApiCall("assignVendorForTranslation", apiObj);
  //   if (
  //     res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
  //     res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  //   ) {
  //     toast.success(AlertMessage.MESSAGE.JOB.VENDOR_ASSIGNED_SUCCESS);
  //     this.closeBidModal();
  //     setTimeout(
  //       function () {
  //         return history.push("/adminProjectList");
  //       }.bind(this),
  //       1000
  //     );
  //   }
  // };

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
                        <Link to="/adminDashboard">Dashboard</Link> / <Link to="/adminClientRfqList">Client RFQ</Link> / Details
                        
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
              <li className="nav-item">
                {" "}
                <a className="nav-link" data-toggle="tab" href="#sendqute">
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.TABBAR} />
                    </figure>
                    Send Quote
                  </div>
                </a>{" "}
              </li>
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
              {/* {this.state.quoteStatus === 2 ||
              this.state.quoteStatus === 3 ||
              this.state.quoteStatus === 6 ||
              this.state.quoteStatus === 8 ? ( */}
                <li className="nav-item">
                  {" "}
                  <a className="nav-link" data-toggle="tab" href="#vendoroff">
                    <div className="taber">
                      <figure>
                        <img src={ImageName.IMAGE_NAME.DOCUMENTICON} />
                      </figure>
                      {/* {this.state.quoteStatus === 8
                        ? "Vendors Offered"
                        : "Available vendors"} */}
                        Available vendors
                    </div>
                  </a>{" "}
                </li>
              {/* ) : (
                <React.Fragment></React.Fragment>
              )} */}
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

                      {/* <tr>
                        <td width="50%" align="left">
                          Appointment Type
                        </td>
                        <th width="50%" align="right">
                          <div className="f2f-b">
                            {this.state.appointmentType}
                          </div>
                        </th>
                      </tr> */}

                      {/* <tr>
                        <td width="50%" align="left">
                          Job Type
                        </td>
                        <th width="50%" align="right">
                          {this.state.jobType}
                        </th>
                      </tr> */}

                      {/* <tr>
                        <td width="50%" align="left">
                          Language
                        </td>
                        <th width="50%" align="right">
                          {this.state.language}
                        </th>
                      </tr> */}

                      <tr>
                        <td width="50%" align="left">
                          Target Audience
                        </td>
                        <th width="50%" align="right">
                          {this.state.targetAdience}
                        </th>
                      </tr>

                      <tr>
                        <td width="50%" align="left">
                          DTP format required
                        </td>
                        <th width="50%" align="right">
                          {this.state.isDtp === 1 ? "YES" : "NO"}
                        </th>
                      </tr>

                      <tr>
                        <td width="50%" align="left">
                          Expected Deadline
                        </td>
                        <th width="50%" align="right">
                          {SetDateFormat(this.state.date)}
                        </th>
                      </tr>

                      {/* <tr>
                        <td width="50%" align="left">
                          Service Location Address
                        </td>
                        <th width="50%" align="right">
                          {this.state.serviceAddress}
                        </th>
                      </tr> */}

                      {/* <tr>
                        <td width="50%" align="left">
                          Site Contant
                        </td>
                        <th width="50%" align="right">
                          {this.state.siteContant}
                        </th>
                      </tr> */}

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
                      {/* <tr>
                        <td width="50%" align="left">
                          <p class="notes">
                            Notes From <span>7C Lingo</span>
                          </p>
                        </td>
                        <th width="50%" align="right">
                          &nbsp;{this.state.notesBy7C}
                        </th>
                      </tr> */}
                    </tbody>
                  </table>
                  {this.state.taskList.length > 0 ?
                    this.state.taskList.map((data, i) =>
                      <div className="c-l-s _fl text-center" key={i}>
                        <div className="row">
                          <div className="col-md-3">
                            <h4>Service type</h4>
                            <p>{data.serviceName}</p>
                          </div>
                          <div className="col-md-2">
                            <h4>Source Language</h4>
                            <p>{data.sourceLanguage}</p>
                          </div>
                          <div className="col-md-2">
                            <h4>Target Language</h4>
                            <p>{data.targetLanguage}</p>
                          </div>
                          <div className="col-md-3">
                            <h4>Document Name</h4>
                            <p>{data.documentName}</p>
                          </div>
                          <div className="col-md-2">
                            <h4>Source File</h4>
                            <p><a href="javascript:void(0)"><img src={ImageName.IMAGE_NAME.DOWNLOADSHEET} onClick={() => this.onDownload(i)} /></a></p>
                          </div>
                        </div>
                      </div>
                    ) :
                    <React.Fragment></React.Fragment>
                  }
                </div>
              </div>

              <div className="tab-pane" id="sendqute">
                <div className="job-section-tab">
                  <div className="view-quote-details-wrap">
                    <h3>Create Quote</h3>
                    {/* <p>
                      <span>Quote ID</span>
                      {this.state.quoteId}
                    </p> */}
                    <p>
                      <span>Target Audience</span> {this.state.targetAdience}
                    </p>
                    <p>
                      <span>Expected Deadline</span>{" "}
                      {SetDateFormat(this.state.dateTime)}
                    </p>
                    <p>
                      <span>Notes from Client</span>
                      {this.state.notesFromClient}
                    </p>
                    <p>
                      <span>Industry Type</span> {this.state.clientIndustryType}
                    </p>
                  </div>

                  {/* <div className="table-listing-app create">
                    <div className="creat_quot">
                      <h3>create quote</h3>
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
                                <th style={{ width: "10%" }}>
                                  <label className="custom_check2">
                                    <input type="checkbox" />
                                    <span className="checkmark2"></span>
                                  </label>
                                </th>
                                <th style={{ width: "30%" }}>
                                  Appointment Type
                                </th>
                                <th style={{ width: "30%" }}>
                                  Source Language
                                </th>
                                <th style={{ width: "30%" }}>
                                  Target Language
                                </th>
                              </tr>

                              <tr>
                                <td>
                                  <label className="custom_check2">
                                    <input type="checkbox" />
                                    <span className="checkmark2"></span>
                                  </label>
                                </td>
                                <td className="drpdownTd">
                                  <div class="drpdown_clientRFQDetails">
                                    <Select
                                      options={appointmentTypeArr}
                                      value={this.state.appointmentTypeData}
                                      styles={customStyles}
                                      components={{
                                        DropdownIndicator,
                                        IndicatorSeparator: () => null,
                                      }}
                                      placeholder="Select"
                                      onChange={(value) => {
                                        this.onAppointmentChange(value);
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className="drpdownTd">
                                  <div class="drpdown_clientRFQDetails">
                                    <Select
                                      options={this.state.languageArr}
                                      value={this.state.sourceLangData}
                                      styles={customStyles}
                                      components={{
                                        DropdownIndicator,
                                        IndicatorSeparator: () => null,
                                      }}
                                      placeholder="Select"
                                      onChange={(value) => {
                                        this.onSourceLangChange(value);
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className="drpdownTd">
                                  <div class="drpdown_clientRFQDetails">
                                    <Select
                                      options={this.state.languageArr}
                                      value={this.state.targetLangData}
                                      styles={customStyles}
                                      components={{
                                        DropdownIndicator,
                                        IndicatorSeparator: () => null,
                                      }}
                                      placeholder="Select"
                                      onChange={(value) => {
                                        this.onTargetLangChange(value);
                                      }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="_button-style m30 _fl text-center">
                      <a
                        href="#"
                        className="white-btn"
                        style={{ textDecoration: "none" }}
                      >
                        Reset
                      </a>
                      <a
                        href="#"
                        className="blue-btn"
                        style={{ textDecoration: "none" }}
                      >
                        Next
                      </a>
                    </div>
                  </div> */}
                  {/* <div className="add-more-field">
                    <div className="table-listing-app create">
                      <div className="creat_quot">
                        <h3>create quote</h3>
                        <div className="depr_table">
                          <div className="table-responsive_mb">
                            <div class="addmore_service text-right">
                              <a href="javascript:void(0)">
                                <div
                                  onClick={this.addParticularField}
                                  style={{ marginTop: "8px" }}
                                >
                                  Add Additional Field
                                </div>
                              </a>
                            </div>
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
                                    <input
                                      className="inputfield flr"
                                      type="text"
                                      value={this.state.rushFee}
                                      onChange={this.onRushFeeChange}
                                    />
                                  </td>
                                </tr>

                                <tr>
                                  <td width="50%" align="left">
                                    Interpretation Fee
                                  </td>
                                  <td width="50%" align="right">
                                    <input
                                      className="inputfield flr"
                                      type="text"
                                      value={this.state.interpretationFee}
                                      onChange={(e) =>
                                        this.onInterpretationFeeChange(e)
                                      }
                                    />
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
                                        onChange={(e) =>
                                          this.onParticularChange(e, key)
                                        }
                                      />
                                    </td>
                                    <td width="50%" align="right">
                                      <input
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
                                      </span>
                                    </td>
                                  </tr>
                                ))}

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
                                    {parseFloat(this.state.totalAmount)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="translation_table">
                    {this.state.taskData.map((item, i) => (
                      <div className="task_table">
                        <div class="tsk-col _fl m30 p-20">
                          <h3>
                            Task {i + 1} : {item.service}
                          </h3>
                          <ul>
                            <li
                              data-toggle="tooltip"
                              title={item.sourceLanguage}
                            >
                              <a href="#" style={{ textDecoration: "none" }}>
                                {textTruncate(item.sourceLanguage, 10)}
                              </a>
                            </li>
                            <li
                              data-toggle="tooltip"
                              title={item.targetLanguage}
                            >
                              <a href="#" style={{ textDecoration: "none" }}>
                                {textTruncate(item.targetLanguage, 10)}
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div class="tsk-tabl">
                          <table
                            width="100%"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                          >
                            <tr>
                              <th style={{ width: "25%", textAlign: "center" }}>
                                ITEM(S)
                              </th>
                              <th style={{ width: "25%", textAlign: "center" }}>
                                QUANTITY
                              </th>
                              <th style={{ width: "25%", textAlign: "center" }}>
                                UNIT COST
                              </th>
                              <th style={{ width: "25%", textAlign: "center" }}>
                                RATE
                              </th>
                            </tr>

                            <tr>
                              <td style={{ textAlign: "left" }}>Approx Word Count</td>
                              <td style={{ textAlign: "center" }}>
                                <div
                                  className="input-group"
                                  style={{ justifyContent: "center" }}
                                >
                                  <input
                                    type="text"
                                    value={item.wordCountQty}
                                    name=""
                                    placeholder=""
                                    class="in-field4 unit-cost"
                                    onChange={(e) => { this.handleWordQty(e, i) }}
                                  />
                                </div>
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <div
                                  className="input-group"
                                  style={{ justifyContent: "center" }}
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
                                    type="text"
                                    value={item.wordCountCost}
                                    name=""
                                    placeholder=""
                                    class="in-field4 unit-cost"
                                    onChange={(e) => { this.handleWordCost(e, i) }}
                                  />
                                </div>
                              </td>
                              <td style={{ textAlign: "center" }}>$ {item.wordCountRate}</td>
                            </tr>

                            {this.state.isDtp === 1 ?
                              <tr>
                                <td style={{ textAlign: "left" }}>Approx DTP Hours</td>
                                <td style={{ textAlign: "center" }}>
                                  <div
                                    className="input-group"
                                    style={{ justifyContent: "center" }}
                                  >

                                    <input
                                      type="text"
                                      value={item.dtpQty}
                                      name=""
                                      placeholder=""
                                      class="in-field4 unit-cost"
                                      onChange={(e) => { this.handleDtpQty(e, i) }}
                                    />
                                  </div>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <div
                                    className="input-group"
                                    style={{ justifyContent: "center" }}
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
                                      type="text"
                                      value={item.dtpCost}
                                      name=""
                                      placeholder=""
                                      class="in-field4 unit-cost"
                                      onChange={(e) => { this.handleDtpUnitCost(e, i) }}
                                    />
                                  </div>
                                </td>
                                <td style={{ textAlign: "center" }}>$ {item.dtpRate}</td>
                              </tr>
                              : <React.Fragment></React.Fragment>}
                            <tr>
                              <td style={{ textAlign: "left" }}>
                                Rush Fee (If Applicable)
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <div
                                  className="input-group"
                                  style={{ justifyContent: "center" }}
                                >

                                  <input
                                    type="text"
                                    value={item.rushFeeUnit}
                                    name=""
                                    placeholder=""
                                    class="in-field4 unit-cost"
                                    onChange={(e) => { this.handleRushUnit(e, i) }}
                                  />
                                </div>
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <div
                                  className="input-group"
                                  style={{ justifyContent: "center" }}
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
                                    type="text"
                                    value={item.rushFeeCost}
                                    name=""
                                    placeholder=""
                                    class="in-field4 unit-cost"
                                    onChange={(e) => { this.handleRushUnitCost(e, i) }}
                                  />
                                </div>
                              </td>
                              <td style={{ textAlign: "center" }}>$ {item.rushFeeRate}</td>
                            </tr>

                            <tr>
                              <td style={{ textAlign: "left" }}>SUB COST</td>
                              <td style={{ textAlign: "center" }}>&nbsp;</td>
                              <td
                                style={{ textAlign: "center" }}
                              >
                              </td>
                              <td className="text-ttt" style={{ textAlign: "center" }}>$ {item.SubCost}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    ))}
                    <div class="addmore_service text-right">
                      <a href="javascript:void(0)">
                        <div
                          onClick={this.addParticularField}
                          style={{ marginTop: "8px" }}
                        >
                          Add Additional Field
                        </div>
                      </a>
                    </div>
                    <table style={{ border: "none", width: "100%" }}>
                      {this.state.additionalTranslationCharges.map((item, key) => (
                        <tr>
                          <td width="50%" align="left">
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
                                      this.onParticularAmountChange(e, key)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-md-1 delete-btn">
                                <img
                                  src={ImageName.IMAGE_NAME.TRASH_BTN}
                                  onClick={() =>
                                    this.onDeleteParticulars(key)
                                  }
                                  style={{ cursor: "pointer" }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </table>
                    <table style={{ border: "none", width: "100%" }}>
                      <tr>
                        <td style={{ width: "25%" }}>
                          <span style={{ color: "#6aa881", fontSize: "22px", fontWeight: "800" }}>Total Amount : </span>
                        </td>
                        <td style={{ width: "25%" }}></td>
                        <td style={{ width: "25%" }}></td>
                        <td style={{ width: "25%" }}>
                          <span style={{ color: "#6aa881", fontSize: "22px", fontWeight: "800" }}>$ {this.state.totalAmount}</span>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div className="_button-style m30 _fl text-center">
                    <a
                      href="javascript:void(0)"
                      className="white-btn"
                      style={{ textDecoration: "none" }}
                      onClick={() => {
                        return history.push("/adminClientRfqList")
                      }}
                    >
                      Back
                    </a>
                    <a
                      href="javascript:void(0)"
                      className="blue-btn"
                      style={{ textDecoration: "none", color: "#fff" }}
                      onClick={this.OnSendQuote}
                    >
                      Send Quote
                    </a>
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
                              <React.Fragment>
                                <th style={{ width: "15%" }}>Status</th>
                              </React.Fragment>
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
                              {/* <td style={{ width: "10%" }}>
                                <a
                                  href="javascript:void(0)"
                                  className="view"
                                  style={{
                                    cursor: "pointer",
                                    color: "green",
                                  }}
                                  onClick={()=>this.handleViewModal(item.userId)}
                                >
                                  View
                                </a>
                              </td> */}

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
                                    {/* {item.status === 0 ?
                                    <a href="javascript:void(0)">
                                      <img src={ImageName.IMAGE_NAME.EYE_BTN} onClick={() => { this.handleBidModal(item.userId) }} />
                                    </a> :
                                    <React.Fragment></React.Fragment>
                                  } */}
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
      </React.Fragment>
    );
  }
}
