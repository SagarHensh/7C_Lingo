import React, { Component } from "react";
import { styled, Box } from "@mui/system";
import Switch from "@mui/material/Switch";
import { ToastContainer, toast } from "react-toastify";
import { ApiCall, ApiCallVendor } from "../../../../../services/middleware";
import history from "../../../../../history";
// import { InputText } from "../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../../enums";
// import "./AddCourse.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  inputEmptyValidate,
  nameRegexValidator,
} from "../../../../../validators";
import { Decoder } from "../../../../../services/auth";
import { consoleLog, SetDatabaseDateFormat, SetUSAdateFormat } from "../../../../../services/common-function";
import { ErrorCode } from "../../../../../services/constant";
import ReactLoader from "../../../../Loader";
import { IMAGE_URL } from "../../../../../services/config/api_url";
import axios from "axios";
import { Link } from "react-router-dom";
import { InputText } from "../../../../Admin/SharedComponents/inputText";


export default class AdminAddVendorCertificate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad: true,
      onDocLoad: false,
      checkStatus: false,
      userTypeId: 0,
      courseName: "",
      organizationName: "",
      description: "",
      category: "",
      totalDuration: "",
      durationUnit: 0,
      format: "",
      note: "",
      courseFee: "",
      resFormatArr: [],
      resTrainingCategoryArr: [],
      serviceCategoryId: 0,
      adminPhoto: "",
      imagePath: "",
      hidden: false,
      selectedFile: null,
      startDate: "",
      endDate: "",
      // isPublish: false,
      showId: "",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
    let mainData = this.props.location,
      preData = mainData.state;
    consoleLog("preData", preData);
    this.setState({
      showId: preData,
    });
  }

  load = async () => {
    let data = {};
    let res = await ApiCall("getLookUpData", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      let lookUpData = payload.data.lookupdata;
      let courseFormatArr = lookUpData.COURSE_FORMAT_TYPE;
      let trainingCategoryArr = lookUpData.TRAINING_CATEGORY_TYPE;

      this.setState({
        resFormatArr: courseFormatArr,
        resTrainingCategoryArr: trainingCategoryArr,
      });
    }

    let trainingArr = [
      {
        text: "Select Training Category",
        value: "",
      },
    ];

    this.state.resTrainingCategoryArr.map((data) => {
      trainingArr.push({
        text: data.name,
        value: data.id,
      });
    });

    var classInstance = this;
    window.$(".categoryDropdown").ddslick({
      data: trainingArr,
      onSelected: function (data) {
        var ddData = window.$(".categoryDropdown").data("ddslick");
        classInstance.setState({
          category: data.selectedData.value,
        });
      },
    });
    // ............hour..........................
    let durationArr = [
      {
        text: "Hours",
        value: 1,
      },
      {
        text: "Days",
        value: 2,
      },
      {
        text: "Weeks",
        value: 3,
      },
      {
        text: "Months",
        value: 4,
      },
      {
        text: "Years",
        value: 5,
      },
    ];

    window.$(".hourDropdown").ddslick({
      data: durationArr,
      onSelected: function (data) {
        var ddData = window.$(".hourDropdown").data("ddslick");
        classInstance.setState({
          durationUnit: data.selectedData.text,
        });
      },
    });
    //.................format dropdown........................

    let formatArr = [
      {
        text: "Select Format",
        value: 0,
      },
    ];
    this.state.resFormatArr.map((data) => {
      formatArr.push({
        text: data.name,
        value: data.id,
      });
    });

    window.$(".formatDropdown").ddslick({
      data: formatArr,
      onSelected: function (data) {
        var ddData = window.$(".formatDropdown").data("ddslick");
        classInstance.setState({
          format: data.selectedData.value,
        });
      },
    });

    this.setState({
      isLoad: false,
    });
  };
  // ...............for tabs..........................

  onCourseChange = (value) => {
    let nameCheck = nameRegexValidator(value);
    this.setState({
      courseName: nameCheck,
    });
  };
  onOrganizationChange = (value) => {
    let nameCheck = nameRegexValidator(value);
    this.setState({
      organizationName: nameCheck,
    });
  };

  startDateChange = (date) => {
    this.setState({
      startDate: SetUSAdateFormat(date),
    });
  };
  endDateChange = (date) => {
    this.setState({
      endDate: SetUSAdateFormat(date),
    });
  };
  onNoteChange = (e) => {
    this.setState({
      note: e.target.value,
    });
  };

  // ...............document....................
  onProfileImage = (e) => {
    this.setState({
      onDocLoad: true,
    });
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      consoleLog("image::", res.data.data);
      this.setState({
        imagePath: res.data.data.path + res.data.data.filename,
        adminPhoto: res.data.data.filename,
      });

      if (res.data.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR) {
        this.setState({
          hidden: true,
          onDocLoad: true,
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
  onStatusChange = (e) => {
    this.setState({
      checkStatus: !this.state.checkStatus,
    });
  };

  // .............................................
  onNext = async () => {
    // let validateNameLength = departmentValidator(this.state.courseName);
    let errorCount = 0;
    let validateName = inputEmptyValidate(this.state.courseName);
    let validateIssueOrganization = inputEmptyValidate(
      this.state.organizationName
    );
    let validateStartDate = inputEmptyValidate(this.state.startDate);
    let validateEndDate = inputEmptyValidate(this.state.endDate);
    let validateDoc = inputEmptyValidate(this.state.imagePath);

    if (validateName === false) {
      toast.error(AlertMessage.MESSAGE.CERTIFICATE.EMPTY_NAME);
      errorCount++;
    } else if (validateIssueOrganization === false) {
      toast.error(AlertMessage.MESSAGE.CERTIFICATE.EMPTY_ORGANIZATION);
      errorCount++;
    } else if (validateStartDate === false) {
      toast.error(AlertMessage.MESSAGE.CERTIFICATE.EMPTY_ISSUE_DATE);
      errorCount++;
    } else if (validateEndDate === false) {
      toast.error(AlertMessage.MESSAGE.CERTIFICATE.EMPTY_EXPIRY_DATE);
      errorCount++;
    } else if (validateDoc === false) {
      toast.error(AlertMessage.MESSAGE.CERTIFICATE.EMPTY_DOC);
      errorCount++;
    }

    if (errorCount === 0) {
      // let auth = Decoder.decode(localStorage.getItem("AuthToken"));
      let objData = {
        userId: this.state.showId,
        issuingOrganization: this.state.organizationName,
        issuingDate: this.state.startDate,
        expirationDate: this.state.endDate,
        documentPath: this.state.imagePath,
        notes: this.state.note,
        documentName: this.state.courseName,
      };

      consoleLog("req data:::", objData);

      let res = await ApiCall("addVendorEducationTrainingDoc", objData);

      consoleLog("ressss", res);

      // if (
      //   res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      //   res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      // ) {
      //   toast.success(AlertMessage.MESSAGE.CERTIFICATE.ADD_SUCCESS);

      //   // return history.push("/vendorDocList");
      //   window.scrollTo(0, 0);
      //   this.setState({
      //     // userId: auth.data.userid,
      //     organizationName: "",
      //     startDate: "",
      //     endDate: "",
      //     imagePath: "",
      //     hidden: false,
      //     note: "",
      //     courseName: "",
      //   });
      // } else {
      //   if (
      //     res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
      //     res.respondcode === ErrorCode.ERROR.ERROR_CODE.INTERNAL_SERVER_ERROR
      //   ) {
      //     toast.error(res.message);
      //   }
      // }
    }
  };

  onSave = async () => {
    // let validateNameLength = departmentValidator(this.state.courseName);
    let errorCount = 0;
    let validateName = inputEmptyValidate(this.state.courseName);
    let validateIssueOrganization = inputEmptyValidate(
      this.state.organizationName
    );
    let validateStartDate = inputEmptyValidate(this.state.startDate);
    let validateEndDate = inputEmptyValidate(this.state.endDate);
    let validateDoc = inputEmptyValidate(this.state.imagePath);

    if (validateName === false) {
      toast.error(AlertMessage.MESSAGE.CERTIFICATE.EMPTY_NAME);
      errorCount++;
    } else if (validateIssueOrganization === false) {
      toast.error(AlertMessage.MESSAGE.CERTIFICATE.EMPTY_ORGANIZATION);
      errorCount++;
    } else if (validateStartDate === false) {
      toast.error(AlertMessage.MESSAGE.CERTIFICATE.EMPTY_ISSUE_DATE);
      errorCount++;
    } else if (validateEndDate === false) {
      toast.error(AlertMessage.MESSAGE.CERTIFICATE.EMPTY_EXPIRY_DATE);
      errorCount++;
    } else if (validateDoc === false) {
      toast.error(AlertMessage.MESSAGE.CERTIFICATE.EMPTY_DOC);
      errorCount++;
    }

    if (errorCount === 0) {
      let auth = Decoder.decode(localStorage.getItem("AuthToken"));
      let objData = {
        userId: this.state.showId,
        issuingOrganization: this.state.organizationName,
        issuingDate: this.state.startDate == "" ? "" : SetDatabaseDateFormat(this.state.startDate),
        expirationDate: this.state.endDate == "" ? "" : SetDatabaseDateFormat(this.state.endDate),
        documentPath: this.state.imagePath,
        notes: this.state.note,
        documentName: this.state.courseName,
      };
      consoleLog("req data:::", objData);

      let res = await ApiCall("addVendorEducationTrainingDoc", objData);

      consoleLog("ressss", res);

      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.CERTIFICATE.ADD_SUCCESS);

        return history.push({
          pathname:"/adminVendorDocs",
          state:this.state.showId
        });
      } else {
        if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.INTERNAL_SERVER_ERROR
        ) {
          toast.error(res.message);
        }
      }
    }
  };

  // .....................func for cancel btn......................

  onCancel = () => {
    this.props.history.push({
      pathname: "/adminVendorDocs",
      state: this.state.showId,
    });
  };

  render() {
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
            {" "}
            <Link to="/adminDashboard">Dashboard</Link> /{" "}
            <Link to="/adminVendorList">Vendor</Link> / Add Certificate
          </div>
          <div className="department-component-app _fl sdw">
            <h3>ADD NEW CERTIFICATE</h3>
            <div className="department-form">
              <div className="row">
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Name *</span>
                    <InputText
                      placeholder=""
                      className="in-field2"
                      value={this.state.courseName}
                      onTextChange={(value) => {
                        this.onCourseChange(value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Issuing Organization *</span>
                    <InputText
                      placeholder=""
                      className="in-field2"
                      value={this.state.organizationName}
                      onTextChange={(value) => {
                        this.onOrganizationChange(value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="department-form">
              <div className="row">
                <div className="col-md-4">
                  <div className="web-form-bx">
                    <div className="frm-label">Issuing Date *</div>
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
                                  <span>{this.state.startDate}</span>
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
                                        this.startDateChange(date)
                                      }
                                      customInput={<Schedule />}
                                    />
                                  </a>
                                </div>
                              </div>
                   
                  </div>
                 
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <div className="web-form-bx">
                    <div className="frm-label">Expire Date *</div>
                  
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
                                  <span>{this.state.endDate}</span>
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
                                        this.endDateChange(date)
                                      }
                                      customInput={<Schedule />}
                                    />
                                  </a>
                                </div>
                              </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="department-form">
              <div className="row">
                <div className="col-md-4">
                  <div className="form_rbx">
                    <span className="">Upload Document *</span>
                    {/* <div class="upload-profile" hidden={!this.state.onDocLoad}>
                      <ReactLoader />
                    </div> */}
                    <div class="upload-profile">
                      <label
                        htmlFor="file-upload"
                        for="profile_image"
                        className="doc-sheet"
                        data-toggle="tooltip"
                        data-placement="top"
                        title={this.state.adminPhoto}
                        style={{ cursor: "pointer" }}
                        // hidden={this.state.onDocLoad}
                      >
                        {this.state.hidden ? (
                          <React.Fragment>
                            {" "}
                            <img
                              style={{
                                cursor: "pointer",
                                marginBottom: "10px",
                              }}
                              src={ImageName.IMAGE_NAME.UPLOADED_FILE}
                            />
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <img
                              style={{ cursor: "pointer" }}
                              src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                            />
                            <span id="wait">Upload File</span>
                          </React.Fragment>
                        )}

                        <input
                          type="file"
                          id="profile_image"
                          style={{ display: "none" }}
                          onChange={this.onProfileImage}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Notes</span>
                    <textarea
                      placeholder=""
                      className="in-textarea msg min"
                      value={this.state.note}
                      onChange={this.onNoteChange}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="_button-style m30 _fl text-center">
              <a
                href="javascript:void(0)"
                className="white-btn"
                style={{ textDecoration: "none", color: "grey" }}
                onClick={this.onCancel}
                // to="/adminVendorList"
              >
                Cancel
              </a>
              <a
                className="blue-btn add-traning-cours-savasdraf"
                style={{ textDecoration: "none", color: "white" }}
                onClick={this.onNext}
              >
                Save & Add Another
              </a>
              <a
                className="blue-btn"
                style={{ textDecoration: "none", color: "white" }}
                onClick={this.onSave}
              >
                Save
              </a>
            </div>
          </div>
        </div>
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
