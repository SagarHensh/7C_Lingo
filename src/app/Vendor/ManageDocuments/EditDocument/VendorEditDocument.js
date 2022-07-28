import React, { Component } from "react";
import { styled, Box } from "@mui/system";
// import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
// import FormControl from "@mui/material/FormControl";
import { ToastContainer, toast } from "react-toastify";
// import MenuItem from "@mui/material/MenuItem";
import { ApiCall, ApiCallVendor } from "../../../../services/middleware";
// import Select from "@mui/material/Select";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import history from "../../../../history";
// import { InputText } from "../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../enums";
// import "./AddCourse.css";
import {

  inputEmptyValidate,
  nameRegexValidator,

} from "../../../../validators";
// import { Regex } from "../../../../services/config";
import { Decoder } from "../../../../services/auth";
import {
  consoleLog,
  phoneNumberCheck,
  SetDatabaseDateFormat,
  SetScheduleDate,
  SetUSAdateFormat,
} from "../../../../services/common-function";
import { ErrorCode } from "../../../../services/constant";
import ReactLoader from "../../../Loader";
import { IMAGE_URL } from "../../../../services/config/api_url";
import axios from "axios";
import { Link } from "react-router-dom";
import { InputText } from "../../../Admin/SharedComponents/inputText";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// .................mui switch...................................
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 68,
  height: 28,
  padding: 0,
  borderRadius: "15%/50%",
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 25,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(5px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(42px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#335b7b",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 16,
    height: 16,
    borderRadius: 8,
    color: "white",
    marginTop: 4,
    marginLeft: 2,
    // transition: theme.transitions.create(["width"], {
    //   duration: 200,
    // }
    // ),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255,255,255,.35)" : "#993921",
    boxSizing: "border-box",
  },
}));

export default class VendorEditDocument extends Component {
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
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    let data = {};
    let mainData = this.props.location,
      preData = mainData.state;

    consoleLog("pre::::", preData);
    // let auth = Decoder.decode(localStorage.getItem("AuthToken"));
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

    let responseContractData = await ApiCallVendor(
      "getVendorCertificateDetails",
      { id: preData.id }
    );

    if (
      responseContractData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      responseContractData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(responseContractData.data.payload);
      console.log("####", payload);
      this.setState({
        isLoad: false,
        courseName: payload.data[0].documentName,
        organizationName: payload.data[0].issuingOrganization,
        startDate: SetUSAdateFormat(payload.data[0].issuingDate),
        endDate: SetUSAdateFormat(payload.data[0].expirationDate),
        imagePath: JSON.parse(payload.data[0].documentPath),
        adminPhoto: JSON.parse(payload.data[0].documentPath),
        note: payload.data[0].notes,
        hidden: payload.data[0].documentPath === "" ? false : true,
      });
    }
  };
  // ...............for tabs..........................

  onCourseChange = (value) => {
    // let nameCheck = nameRegexValidator(value);
    this.setState({
      courseName: value,
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

  onUpdate = async () => {
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
      let mainData = this.props.location,
        preData = mainData.state;

      let objData = {
        id: preData.id,
        issuingOrganization: this.state.organizationName,
        issuingDate: SetDatabaseDateFormat(this.state.startDate),
        expirationDate: SetDatabaseDateFormat(this.state.endDate),
        documentPath: this.state.imagePath,
        notes: this.state.note,
        documentName: this.state.courseName,
      };

      let res = await ApiCallVendor("updateVendorCertificate", objData);

      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.CERTIFICATE.UPDATE_SUCCESS);

        return history.push("/vendorDocList");
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

  // onCancel = () => {
  //   history.push("/adminStaff");
  // };

  render() {
    return (
      <React.Fragment>
        {/* <div className="wrapper">
          <Header /> */}
        <ToastContainer hideProgressBar theme="colored" />
        {/* <Sidebar /> */}
        <div className="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>
        <div className="component-wrapper" hidden={this.state.isLoad}>
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            {" "}
            <Link to="/vendorDashboard">Dashboard</Link> /{" "}
            <Link to="/vendorDocList">Document</Link> / Edit Certificate
          </div>
          <div className="department-component-app _fl sdw">
            <h3>EDIT CERTIFICATE</h3>
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
                    {/* <div className="form-input-fields unstyled">
                        <input
                          type="date"
                          id="from_datepicker"
                          className="textbox4 d-icon"
                          value={this.state.startDate}
                          placeholder="Select"
                          onChange={this.startDateChange}
                          style={{
                            textAlign: "center",
                            borderRadius: "9px",
                            boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                          }}
                        />
                      </div> */}
                    <div className="form-input-fields">
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
                          style={{
                            width: "80%",
                            padding: "8px",
                          }}
                        >
                          <span>
                            {this.state.startDate}
                          </span>
                        </div>
                        <div style={{ width: "20%" }}>
                          <a style={{ float: "right" }}>
                            <DatePicker
                              dropdownMode="select"
                              showMonthDropdown
                              showYearDropdown
                              adjustDateOnChange
                              // minDate={new Date()}
                              onChange={(date) => this.startDateChange(date)}
                              customInput={<Schedule />}
                            // disabled
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="form_rbx ">
                        <span className="">Start Date</span>
                       
                        <input
                          type="date"
                          className="texbox4 d-icon"
                          placeholder="10/25/2000"
                          value={this.state.startDate}
                          onChange={this.startDateChange}
                        />
                      </div> */}
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <div className="web-form-bx">
                    <div className="frm-label">Expire Date *</div>
                    {/* <div className="form-input-fields unstyled">
                      <input
                        type="date"
                        id="from_datepicker"
                        className="textbox4 d-icon"
                        value={this.state.endDate}
                        placeholder="Select"
                        onChange={this.endDateChange}
                        style={{
                          textAlign: "center",
                          borderRadius: "9px",
                          boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                        }}
                      />
                    </div> */}
                    <div className="form-input-fields">
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
                          style={{
                            width: "80%",
                            padding: "8px",
                          }}
                        >
                          <span>
                            {this.state.endDate}
                          </span>
                        </div>
                        <div style={{ width: "20%" }}>
                          <a style={{ float: "right" }}>
                            <DatePicker
                              dropdownMode="select"
                              showMonthDropdown
                              showYearDropdown
                              adjustDateOnChange
                              minDate={new Date()}
                              onChange={(date) => this.endDateChange(date)}
                              customInput={<Schedule />}
                            // disabled
                            />
                          </a>
                        </div>
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
                    <div className="upload-profile">
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
                            <span id="wait">Upload File *</span>
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
              <Link
                className="white-btn"
                style={{ textDecoration: "none", color: "grey" }}
                // onClick={this.onCancel}
                to="/vendorDocList"
              >
                Cancel
              </Link>
              {/* <a
                  className="blue-btn add-traning-cours-savasdraf"
                  style={{ textDecoration: "none", color: "white" }}
                  onClick={this.onNext}
                >
                  Save & Add Another
                </a> */}
              <a
                className="blue-btn"
                style={{ textDecoration: "none", color: "white" }}
                onClick={this.onUpdate}
              >
                Update
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
