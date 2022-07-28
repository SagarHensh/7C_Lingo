import { timers } from "jquery";
import React, { Component } from "react";
import { toast } from "react-toastify";
import { AlertMessage, ImageName } from "../../../../enums";
import history from "../../../../history";
import { Decoder } from "../../../../services/auth";
import { SetDateFormat } from "../../../../services/common-function";
import { ErrorCode } from "../../../../services/constant";
import { ApiCall } from "../../../../services/middleware";
import { inputEmptyValidate } from "../../../../validators";
import "./vendorassigned.css";

export default class VendorOffer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: 1,
      ischecked: false,
      ischeck: true,
      checkedState: false,
      total_page: 10,
      limit: 10,
      offset: 0,
      isLoad: true,
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
      checkedItems: new Map(),

      appointmentTypeArr: [],
      appointmentTypeData: [],
      languageArr: [],

      sourceLangData: {},
      targetLangData: {},
      listData: [],
      isView : false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();

    var classInstance = this;

    var viewModal = document.getElementById("viewModal");
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == viewModal) {
        classInstance.closeViewModal();
      }
    };
  }

  load = async () => {
    let mainData = this.props.location,
      preData = mainData.state;
    // console.log("preData", preData.id);
    let req = {
      // requestId: preData.id,
      requestId: 26,
    };

    this.listApi(req);

    let languageArrData = [],
      languageObjData = {},
      languageResArrData = [],
      clientDetails = {},
      jobDetails = {},
      quoteData = {},
      quoteInfo = {};

    let detailData = {
      // requestId: preData.id,
      requestId: 26,
    };

    let languageResData = await ApiCall("getlanguagelist");
    let languagePayload = Decoder.decode(languageResData.data.payload);
    languageResArrData = languagePayload.data.languagelist;

    for (let n = 0; n < languageResArrData.length; n++) {
      languageArrData.push({
        label: languageResArrData[n].language,
        value: languageResArrData[n].id,
      });
      if (languageResArrData[n].language === "English") {
        languageObjData = {
          label: languageResArrData[n].language,
          value: languageResArrData[n].id,
        };
      }
    }
    // .............................................

    let detailsRes = await ApiCall("getJobDetails", detailData);

    let detailPayload = Decoder.decode(detailsRes.data.payload);
    // console.log("details::::", detailPayload);
    clientDetails = detailPayload.data.clientDetails;
    jobDetails = detailPayload.data.jobDetails;
    quoteInfo = detailPayload.data.quoteInfo;

    if (
      quoteInfo.additionalFee != null ||
      quoteInfo.additionalFee != undefined ||
      quoteInfo.additionalFee != ""
    ) {
      quoteData = JSON.parse(quoteInfo.additionalFee);
      // console.log("quote:::", quoteData);
    }

    if(quoteInfo.total===0){
      this.setState({
        isView: false
      })
    } else {
      this.setState({
        isView : true
      })
    }
    // ...........................................

    this.setState({
      sourceLangData: languageObjData,
      targetLangData: languageObjData,
      languageArr: languageArrData,
      // ..........
      clientFirstName: clientDetails.fName,
      clientLastName: clientDetails.lName,
      clientEmailId: clientDetails.businessEmail,
      clientName: clientDetails.clientName,
      clientIndustryType: clientDetails.industtryType,
      clientPhone: clientDetails.adminPhone,
      jobId: jobDetails.jobId,
      appointmentType: jobDetails.appointmentType,
      jobType: jobDetails.jobType,
      language: jobDetails.sourceLanguage,
      date: jobDetails.scheduleDate,
      countryCode: clientDetails.adminCountryCode,
      serviceAddress:
        jobDetails.location === null ||
        jobDetails.location === undefined ||
        jobDetails.location === ""
          ? "N/A"
          : jobDetails.location,
      siteContant: jobDetails.siteContact,
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
      notesFromClient: jobDetails.noteByClient,
      deliveryType: clientDetails.isOutOfTown === 1 ? "OUT OF TOWN" : "IN TOWN",
      duration:
        jobDetails.duration === null ||
        jobDetails.duration === undefined ||
        jobDetails.duration === ""
          ? "N/A"
          : jobDetails.duration,
      clientIndustryType: clientDetails.industtryType,
      interpretationFee: quoteInfo.fee,
      rushfee: quoteInfo.rushFee,
      totalAmount: quoteInfo.total,
      particularsArr: quoteData,
      isLoad: false,
    });
  };

  listApi = async (data) => {
    let res = await ApiCall("getAllVendorList", data);
    let isChecked = null;
    // console.log(res);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(res.data.payload);
      // console.log("Vendor Approve List:", payload.data);
      let vendorList = payload.data.vendorList;
      let totalPage = Math.ceil(payload.data.length / this.state.limit);

      this.setState({
        listData: vendorList,
        total_page: totalPage,
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

  checked = () => {
    this.setState({
      ischecked: !this.state.ischecked,
    });
  };
  listChecked = (e, index) => {
    let isCheck = 0;

    if (this.state.listData[index].isQuoteSent === 0) {
      isCheck = 1;
    } else {
      isCheck = 0;
    }
    this.state.listData[index].isQuoteSent = isCheck;
    this.setState({
      listData: this.state.listData,
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
    // console.log("amount=====>", this.state.particularsArr);
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
        fee: this.state.interpretationFee,
        total: this.state.totalAmount,
        rushFee: this.state.rushFee,
        // additionalFee: [{ title: "add", amt: "35.7" }],
        additionalFee: this.state.particularsArr,
      };
      // console.log("req data", data);
      let res = await ApiCall("createQuote", data);
      // console.log("%%%%%%%%)))))))))", res);
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

  render() {
    return (
      <React.Fragment>
        <div className="component-wrapper">
          <div className="job-details-tab _fl sdw vend_assign_pge">
            <ul className="nav nav-tabs stb">
              <li className="nav-item">
                {" "}
                <a className="nav-link" data-toggle="tab" href="#clientdetails">
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.TABUSERICON} />
                    </figure>
                    Client Details
                  </div>
                </a>{" "}
              </li>
              <li className="nav-item">
                {" "}
                <a className="nav-link" data-toggle="tab" href="#jobdetails">
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.PROJECTDETAILSICON} />
                    </figure>{" "}
                    Job Details
                  </div>
                </a>{" "}
              </li>
              <li className="nav-item">
                {" "}
                <a className="nav-link" data-toggle="tab" href="#viewquote">
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
                <a
                  className="nav-link active"
                  data-toggle="tab"
                  href="#vendoroff"
                >
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.DOCUMENTICON} />
                    </figure>
                    Available Vendors
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
                <a className="nav-link" data-toggle="tab" href="#emailsms">
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.CHARSMSICON} />
                    </figure>
                    Email & SMS
                  </div>
                </a>{" "}
              </li>
              <li className="nav-item">
                {" "}
                <a className="nav-link" data-toggle="tab" href="#notification">
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
              <div className="tab-pane" id="jobdetails">
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
                          {SetDateFormat(this.state.date)}
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

              <div className="tab-pane" id="viewquote">
                <div className="job-section-tab">
                  <div className="view-quote-details-wrap">
                    <h3>view quote details</h3>
                    <p>
                      <span>Quote ID</span>
                      {this.state.quoteId}
                    </p>
                    <p>
                      <span>Target Audience</span> {this.state.targetAdience}
                    </p>
                    <p>
                      <span>Location</span> {this.state.location}
                    </p>
                    <p>
                      <span>Appontment Type</span> {this.state.appointmentType}
                    </p>
                    <p>
                      <span>Date & Time</span>{" "}
                      {SetDateFormat(this.state.dateTime)}
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
                        <h3>View Quote</h3>
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
                                  <td width="50%%" align="right">
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
                                  <td width="50%%" align="right">
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
                                  </td>
                                </tr>
                                {this.state.particularsArr.map((item, key) => (
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
                                      </div>
                                      &nbsp;{" "}
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
                                    {"$"} {parseFloat(this.state.totalAmount)}
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
                      href={void(0)}
                      className="white-btn"
                      style={{ textDecoration: "none" }}
                      onClick={this.onBack}
                    >
                      Back
                    </a>
                    {/* <a
                      href="#"
                      className="blue-btn"
                      style={{ textDecoration: "none" }}
                      onClick={this.onCreateQuote}
                    >
                      Send Quote
                    </a> */}
                  </div>
                </div>
              </div>
              <div className="tab-pane active" id="vendoroff">
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
                              <label className="custom_check2">
                                <input type="checkbox" onClick={this.checked} />
                                <span className="checkmark2"></span>
                              </label>
                            </th>
                            {/* <th style={{ width: "8%" }}>Vendor ID</th> */}
                            <th style={{ width: "9%" }}>Type</th>
                            <th style={{ width: "9%" }}>First Name</th>
                            <th style={{ width: "10%" }}>Last Name</th>
                            <th style={{ width: "11%" }}>Agency</th>
                            <th style={{ width: "11%" }}>Email ID</th>
                            <th style={{ width: "11%" }}>Phone Number</th>
                            <th style={{ width: "15%" }}>Rate Card</th>
                            <th style={{ width: "9%" }}>Ratings</th>
                            <th style={{ width: "10%" }}>Availability</th>
                          </tr>
                        </tbody>
                        <tbody>
                          {this.state.listData.map((item, key) => (
                            <tr key={key}>
                              <td style={{ width: "8%" }}>
                                <label className="custom_check2">
                                  <input
                                    type="checkbox"
                                    checked={
                                      item.isQuoteSent === 1 ? true : false
                                    }
                                    // value={false}
                                    // checked={!this.state.ischeck}
                                    onChange={(e) => this.listChecked(e, key)}
                                  />

                                  <span className="checkmark2"></span>
                                </label>
                              </td>
                              {/* <td style={{ width: "8%" }}>{item.id}</td> */}
                              <td style={{ width: "9%" }}>{item.type}</td>
                              <td style={{ width: "9%" }}>{item.fName}</td>
                              <td style={{ width: "10%" }}>{item.lName}</td>
                              <td style={{ width: "11%" }}>
                                {this.blankValueCheck(item.agencyName)}
                              </td>
                              <td style={{ width: "11%" }}>
                                <a href="" className="viewlink">
                                  {item.email}
                                </a>
                              </td>
                              <td style={{ width: "11%" }}>{item.mobile}</td>
                              <td style={{ width: "9%" }}>
                                <a href="">
                                  <img src={ImageName.IMAGE_NAME.EYE_BTN} />
                                </a>
                              </td>
                              <td style={{ width: "10%" }}>
                                <img src={ImageName.IMAGE_NAME.STARYELLOW} />
                                <span className="rat_txt">{item.ratings}</span>
                              </td>
                              <td style={{ width: "10%" }}>
                                <a
                                  className="view"
                                  style={{
                                    cursor: "pointer",
                                    color: "green",
                                  }}
                                  onClick={this.handleViewModal}
                                >
                                  View
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="_button-style _fl text-center margin-top-30">
                    <a href="#" data-dismiss="modal" className="grey-btn">
                      Reset
                    </a>
                    <a href="#" className="blue-btn">
                      Send Offer
                    </a>
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
              <div className="tab-pane" id="emailsms">
                <div className="job-section-tab">
                  <h2>Email & SMS</h2>
                </div>
              </div>
              <div className="tab-pane" id="notification">
                <div className="job-section-tab">
                  <h2>Notification</h2>
                </div>
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
        <div
          class="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}
