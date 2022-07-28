import React, { Component } from "react";
import { styled, Box } from "@mui/system"; //imported for modal
import Switch from "@mui/material/Switch";

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
} from "../../../../services/common-function";
import ReactLoader from "../../../Loader";
import EditTrainingDetails from "../../ManageProjects/ProjectPages/EditTrainingDetails";

// .............................................................

export default class TrainingDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
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

      reqId: "",
      quoteStatus:0,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    let mainData = this.props.location,
      preData = mainData.state;
    consoleLog("preData::", preData);
    if (preData === undefined) {
      return history.push("/adminClientRfqList");
    } else {
      this.setState({
        reqId: preData.id,
        quoteStatus:preData.status
      });
      this.load();
    }
  }

  load = async () => {
    let mainData = this.props.location,
      preData = mainData.state;
    let detailData = {
      requestId: preData.id,
    };

    let clientDetails = {},
      jobDetails = {};
    // ................Job details.................

    let detailsRes = await ApiCall("getJobDetails", detailData);
    if (
      detailsRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      detailsRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let detailPayload = Decoder.decode(detailsRes.data.payload);
      // console.log("details::::", detailPayload);
      if (detailPayload.data.clientDetails) {
        clientDetails = detailPayload.data.clientDetails;
      }
      if (detailPayload.data.jobDetails) {
        jobDetails = detailPayload.data.jobDetails;
      }

      // ...........................................

      this.setState({
        //.............Client Details Set............
        clientFirstName: clientDetails.fName,
        clientLastName: clientDetails.lName,
        clientEmailId: clientDetails.businessEmail,
        clientName: clientDetails.clientName,
        clientIndustryType: clientDetails.industtryType,
        clientPhone: clientDetails.adminPhone,
        //..............Job Details Set..............
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
        quoteId: "123456",
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
        clientIndustryType: clientDetails.industtryType,
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
    // console.log("amount==>", particularData);
    // console.log("particular==>", amt);

    this.setState({
      particularsArr: amt,
      particularDataArr: particularData,
    });
  };

  onParticularAmountChange = (e, index) => {
    // console.log("amount=====>", this.state.particularsArr);
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

    // consoleLog("inter",validateInterpretationFee)

    if (this.state.interpretationFee === 0) {
   
      toast.error(AlertMessage.MESSAGE.JOB.EMPTY_TRAINING_FEE, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      let data = {
        requestId: preData.id,
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
        setTimeout(
          function () {
            return history.push("/adminTrainingList");
          }.bind(this),
          1000
        );
      }
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
              {this.state.quoteStatus === 2 ||
              this.state.quoteStatus === 7 ||
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
                  {/* {consoleLog("req:::", this.state.reqId)} */}
                  <EditTrainingDetails mainData={this.state.reqId} />
                </div>
              </div>

              <div className="tab-pane" id="sendqute">
                <div className="job-section-tab">
                  <div className="view-quote-details-wrap">
                    <h3>view quote details</h3>
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
                                        onChange={this.onRushFeeChange}
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
                                        onChange={(e) =>
                                          this.onInterpretationFeeChange(e)
                                        }
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
                        return history.push("/adminClientRfqList");
                      }}
                    >
                      Back
                    </a>
                    <a
                      href="javascript:void(0)"
                      className="blue-btn"
                      style={{ textDecoration: "none" }}
                      onClick={this.onCreateQuote}
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
