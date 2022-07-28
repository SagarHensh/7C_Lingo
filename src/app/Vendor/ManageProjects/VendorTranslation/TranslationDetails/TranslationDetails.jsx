import React, { Component } from "react";
import { styled, Box, color } from "@mui/system"; //imported for modal
import Switch from "@mui/material/Switch";

// import "./clientRfqDetails.css";

import { AlertMessage, ImageName } from "../../../../../enums";
import { ApiCall } from "../../../../../services/middleware";
import { CryptoDecoder, Decoder } from "../../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";
import {
  courseFeeValidate,
  inputEmptyValidate,
  mobileNumberValidator,
  numberValidator,
  zipValidate,
} from "../../../../../validators";
import { Regex } from "../../../../../services/config";

import history from "../../../../../history";
import {
  consoleLog,
  SetDateFormat,
  textTruncate,
} from "../../../../../services/common-function";
import ReactLoader from "../../../../Loader";
import { IMAGE_PATH_ONLY } from "../../../../../services/config/api_url";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";

// .............................................................

export default class TranslationDetailsVendor extends React.Component {
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
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    let mainData = this.props.location,
      preData = mainData.state;
    if (preData === undefined) {
      return history.push("/vendorTranslationList")
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

    let clientDetails = {},
      jobDetails = {},
      quoteInfo = {},
      taskDetails = [],
      arr = [],
      quoteId = "";
    // .............................................

    let detailsRes = await ApiCall("getJobDetails", detailData);

    let detailPayload = Decoder.decode(detailsRes.data.payload);
    // consoleLog("Job Details Translation>>>>", detailPayload);

    clientDetails = detailPayload.data.clientDetails;
    jobDetails = detailPayload.data.jobDetails;
    taskDetails = detailPayload.data.taskList;
    quoteInfo = detailPayload.data.quoteInfo;

    if (Object.keys(quoteInfo).length > 0) {
      // consoleLog("AdditionalInfo>>>", JSON.parse(quoteInfo.additionalFee));
      quoteId = quoteInfo.quoteId;
      let brr = JSON.parse(quoteInfo.additionalFee);
      brr.map((data) => {
        arr.push({
          taskId: parseInt(data.id),
          service: data.service,
          sourceLanguage: data.sourceLanguage,
          targetLanguage: data.targetLanguage,
          wordCountQty: Number(data.wordCountQty),
          wordCountCost: Number(data.wordCountCost),
          wordCountRate: Number(data.wordCountRate),
          dtpQty: Number(data.dtpQty),
          dtpCost: Number(data.dtpCost),
          dtpRate: Number(data.dtpRate),
          rushFeeUnit: Number(data.rushFeeUnit),
          rushFeeCost: Number(data.rushFeeCost),
          rushFeeRate: Number(data.rushFeeRate),
          SubCost: Number(data.SubCost)
        })
      })
      this.setState({
        totalAmount: Number(quoteInfo.total)
      })
    }

    // ...........................................

    this.setState({
      // ..........Client Details..........
      clientFirstName: clientDetails.fName,
      clientLastName: clientDetails.lName,
      clientEmailId: clientDetails.businessEmail,
      clientName: clientDetails.clientName,
      clientIndustryType: clientDetails.industtryType,
      clientPhone: clientDetails.adminPhone,
      //.................Job details..............
      jobId: jobDetails.jobId,
      appointmentType: jobDetails.appointmentType,
      jobType:
        jobDetails.jobType === null ||
          jobDetails.jobType === undefined ||
          jobDetails.jobType === ""
          ? "N/A"
          : jobDetails.jobType,
      language: jobDetails.sourceLanguage,
      date: jobDetails.expectedDeadline,
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
      notesByClient: jobDetails.noteByClient,
      notesBy7C: jobDetails.noteFor7C,
      quoteId: quoteId,
      targetAdience:
        jobDetails.targetAudience === null ||
          jobDetails.targetAudience === undefined ||
          jobDetails.targetAudience === ""
          ? "N/A"
          : jobDetails.targetAudience,
      isDtp: jobDetails.isDtp,
      location:
        jobDetails.location === null ||
          jobDetails.location === undefined ||
          jobDetails.location === ""
          ? "N/A"
          : jobDetails.location,
      dateTime: jobDetails.scheduleDate,
      notesFromClient: jobDetails.noteByClient,
      deliveryType: clientDetails.isOutOfTown === 1 ? "OUT OF TOWN" : "IN TOWN",
      duration: jobDetails.duration,
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
    console.log("amount==>", particularData);
    console.log("particular==>", amt);

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
    console.log("))))))))))))))))))))", amount);

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

    console.log("amount==>", this.state.particularsArr);
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
    console.log("index no:", index);
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

    console.log("_____+++++", arr);

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
        requestId: preData.id,
        total: this.state.totalAmount,
        additionalFee: this.state.particularsArr,
      };
      console.log("req data", data);
      let res = await ApiCall("createQuote", data);
      console.log("%%%%%%%%)))))))))", res);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.JOB.QUOTE_SEND, {
          hideProgressBar: true,
        });
        return history.push("/adminViewAllJobs");
      } else {
        if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST
        ) {
          toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_EXIST, {
            hideProgressBar: true,
          });
        } else if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.PHONE_EXIST
        ) {
          toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EXIST, {
            hideProgressBar: true,
          });
        } else if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_PHONE_EXIST
        ) {
          toast.error(AlertMessage.MESSAGE.EMAIL_MOBILE.DUBLICATE, {
            hideProgressBar: true,
          });
        }
      }
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
    let finalData = {
      requestId: this.state.requestId,
      total: this.state.totalAmount.toString(),
      taskDetails: this.state.taskData
    }
    // consoleLog("Final Quote Send Data", finalData);
    let res = await ApiCall("createQuoteTranslation", finalData);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.JOB.QUOTE_SEND);
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
          <div className="job-details-tab jobdltste _fl sdw">
            <ul className="nav nav-tabs" style={{ height: "59px" }}>
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
                    View Quote
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
              <li className="nav-item">
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
                          Job ID
                        </td>
                        <th width="50%" align="right">
                          {this.state.jobId}
                        </th>
                      </tr>

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
                    <h3>View Quote</h3>
                    <p>
                      <span>Quote ID</span>
                      {this.state.quoteId}
                    </p>
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
                  <div className="translation_table">
                    {this.state.taskData.map((item, i) => (
                      <div className="task_table">
                        <div class="tsk-col _fl m30 p-20">
                          <h3>
                            Task {i + 1} {item.serviceName}
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
                                    // onChange={(e) => { this.handleWordQty(e, i) }}
                                    readOnly
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
                                    // onChange={(e) => { this.handleWordCost(e, i) }}
                                    readOnly
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
                                      // onChange={(e) => { this.handleDtpQty(e, i) }}
                                      readOnly
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
                                      // onChange={(e) => { this.handleDtpUnitCost(e, i) }}
                                      readOnly
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
                                    // onChange={(e) => { this.handleRushUnit(e, i) }}
                                    readOnly
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
                                    // onChange={(e) => { this.handleRushUnitCost(e, i) }}
                                    readOnly
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
                        return history.push("/vendorTranslationList")
                      }}
                    >
                      Back
                    </a>
                    {/* <a
                      href="javascript:void(0)"
                      className="blue-btn"
                      style={{ textDecoration: "none", color: "#fff" }}
                      onClick={this.OnSendQuote}
                    >
                      Send Quote
                    </a> */}
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
        {/* </div> */}
      </React.Fragment>
    );
  }
}
