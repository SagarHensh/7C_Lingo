import React, { Component } from "react";
import { styled, Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import FormControl from "@mui/material/FormControl";
import { ToastContainer, toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";
import { ApiCall } from "../../../../services/middleware";
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import history from "../../../../history";
import { InputText, SelectBox } from "../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../enums";
import "./AddCourse.css";
import {
  courseDurationValidate,
  courseFeeValidate,
  departmentMobileValidator,
  departmentValidator,
  emailValidator,
  inputEmptyValidate,
  mobileNumberValidator,
  nameRegexValidator,
  numberValidator,
  passwordValidator,
} from "../../../../validators";
import { Regex } from "../../../../services/config";
import { Decoder } from "../../../../services/auth";
import {
  consoleLog,
  decimalValue,
  phoneNumberCheck,
} from "../../../../services/common-function";
import { ErrorCode } from "../../../../services/constant";
import ReactLoader from "../../../Loader";
import { IMAGE_URL } from "../../../../services/config/api_url";
import axios from "axios";
import { Link } from "react-router-dom";

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

const durationArr = [
  {
    label: "Hours",
    value: 1,
  },
  {
    label: "Days",
    value: 2,
  },
  {
    label: "Weeks",
    value: 3,
  },
  {
    label: "Months",
    value: 4,
  },
  {
    label: "Years",
    value: 5,
  },
];

export default class AddCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad: true,
      onDocLoad: false,
      checkStatus: false,
      userTypeId: 0,
      courseName: "",
      description: "",
      category: "",
      totalDuration: "",
      durationUnit: 0,
      format: "",
      courseFee: "",

      trainingArr: [],
      trainingData: "",
      courseFormatArr: [],
      courseFormatData: "",
      durationUnitArr: [],
      durationUnitData: "",

      serviceCategoryId: 0,
      adminPhoto: "",
      hidden: false,
      selectedFile: null,
      // isPublish: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    let data = {};
    let trainingDataArr = [],
      courseFormatDataArr = [];
    let res = await ApiCall("getLookUpData", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      let lookUpData = payload.data.lookupdata;
      let courseFormatArr = lookUpData.COURSE_FORMAT_TYPE;
      let trainingCategoryArr = lookUpData.TRAINING_CATEGORY_TYPE;

      // consoleLog("training:::", courseFormatArr);
      trainingCategoryArr.map((obj) => {
        trainingDataArr.push({
          label: obj.name,
          value: obj.id,
        });
      });

      courseFormatArr.map((obj) => {
        courseFormatDataArr.push({
          label: obj.name,
          value: obj.id,
        });
      });

      this.setState({
        courseFormatArr: courseFormatDataArr,
        trainingArr: trainingDataArr,
        durationUnitArr: durationArr,
        isLoad: false,
      });
    }
  };
  // ...............for tabs..........................

  onCourseChange = (e) => {
    // let nameCheck = nameRegexValidator(value);
    // this.setState({
    //   courseName: nameCheck,
    // });
    // consoleLog(e.target.value);

    var pattern = new RegExp(Regex.STRING_NUMBER_REGEX);
    if (departmentValidator(e.target.value)) {
      if (pattern.test(e.target.value)) {
        this.setState({
          courseName: e.target.value,
        });
      }
    }
  };
  onTrainingChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      trainingData: obj,
    });
  };

  onDescriptionChange = (value) => {
    this.setState({
      description: value,
    });
  };
  onDurationChange = (value) => {
    // let v = courseDurationValidate(value);
    if (decimalValue(value)) {
      
      this.setState({
        totalDuration: value
      });
  }
    // let v = value;
    // this.setState({
    //   totalDuration: v,
    // });
  };
  onDurationUnitChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      durationUnitData: obj,
    });
  };
  onFormatChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      courseFormatData: obj,
    });
  };

  onCourseFeeChange = (value) => {
    let v = courseFeeValidate(value);
    this.setState({
      courseFee: v,
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
      this.setState({
        imagePath: res.data.data.url,
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
    let validateCategory = inputEmptyValidate(this.state.trainingData.value);
    let validateDescription = inputEmptyValidate(this.state.description);
    let validateUploadFile = inputEmptyValidate(this.state.adminPhoto);
    let validateCourseFee = inputEmptyValidate(this.state.courseFee);
    let validateFormat = inputEmptyValidate(this.state.courseFormatData);
    let validateTotalDuration = inputEmptyValidate(this.state.totalDuration);

    let validateTotalDurationUnit = inputEmptyValidate(this.state.durationUnitData);

    if (validateName === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.COURSE_NAME_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    //  else if (validateNameLength === false) {
    //   toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // }
    else if (validateCategory === false) {
      toast.error(
        AlertMessage.MESSAGE.TRAINING_COURSE.DROPDOWN_TRAINING_CATEGORY_EMPTY,
        {
          hideProgressBar: true,
        }
      );
      errorCount++;
    }else if (validateDescription === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.EMPTY_DESCRIPTION, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateTotalDuration === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.TOTAL_DURATION_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateTotalDurationUnit === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.DURATION_UNIT_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateFormat === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.FORMAT_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateCourseFee === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.COURSE_FEE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateUploadFile === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.COURSE_DOCUMENT_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      let objData = {
        name: this.state.courseName,
        serviceCategoryId: this.state.trainingData.value,
        description: this.state.description,
        duration: this.state.totalDuration,
        durationUnit: this.state.durationUnitData.label,
        formatTypeId: this.state.courseFormatData.value,
        fees: this.state.courseFee,
        status: this.state.checkStatus ? "1" : "0",
        publishStatus: "0",
        documentPath: this.state.adminPhoto,
      };
      consoleLog("reqdata:::",objData);

      let res = await ApiCall("insertTrainingCourse", objData);

      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.CREATE.SUCCESS, {
          hideProgressBar: true,
        });

        return history.push("/adminTrainingCourse");
      } else {
        if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.DUPLICATE_DEPT
        ) {
          toast.error(res.message, {
            hideProgressBar: true,
          });
        }
      }
    }
  };

  onPublish = async () => {
    // let validateNameLength = departmentValidator(this.state.courseName);
    let errorCount = 0;
    let validateName = inputEmptyValidate(this.state.courseName);
    let validateCategory = inputEmptyValidate(this.state.trainingData.value);
    let validateDescription = inputEmptyValidate(this.state.description);
    let validateUploadFile = inputEmptyValidate(this.state.adminPhoto);
    let validateCourseFee = inputEmptyValidate(this.state.courseFee);
    let validateFormat = inputEmptyValidate(this.state.courseFormatData);
    let validateTotalDuration = inputEmptyValidate(this.state.totalDuration);
    let validateTotalDurationUnit = inputEmptyValidate(this.state.durationUnitData);

    if (validateName === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.COURSE_NAME_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    //  else if (validateNameLength === false) {
    //   toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // }

    else if (validateCategory === false) {
      toast.error(
        AlertMessage.MESSAGE.TRAINING_COURSE.DROPDOWN_TRAINING_CATEGORY_EMPTY,
        {
          hideProgressBar: true,
        }
      );
      errorCount++;
    } else if (validateDescription === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.EMPTY_DESCRIPTION, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateTotalDuration === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.TOTAL_DURATION_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }else if (validateTotalDurationUnit === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.DURATION_UNIT_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateFormat === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.FORMAT_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateCourseFee === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.COURSE_FEE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateUploadFile === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.COURSE_DOCUMENT_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }


    if (errorCount === 0) {
      let objData = {
        name: this.state.courseName,
        serviceCategoryId: this.state.trainingData.value,
        description: this.state.description,
        duration: this.state.totalDuration,
        durationUnit: this.state.durationUnitData.label,
        formatTypeId: this.state.courseFormatData.value,
        fees: this.state.courseFee,
        status: this.state.checkStatus ? "1" : "0",
        publishStatus: "1",
        documentPath: this.state.adminPhoto,
      };

      consoleLog("req dataaaaa publish",objData)

      let res = await ApiCall("insertTrainingCourse", objData);

      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(
          AlertMessage.MESSAGE.TRAINING_COURSE.COURSE_PUBLISH_SUCCESS,
          {
            hideProgressBar: true,
          }
        );

        return history.push("/adminTrainingCourse");
      } else {
        if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.DUPLICATE_DEPT
        ) {
          toast.error(res.message, {
            hideProgressBar: true,
          });
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
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>
        <div className="component-wrapper" hidden={this.state.isLoad}>
        <div
              className="vn_frm"
              style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
            >
              {" "}
              <Link to="/adminDashboard">Dashboard</Link> / <Link to="/adminTrainingCourse">Training Course</Link> / Add 
            </div>
          <div className="department-component-app _fl sdw">
            <h3>ADD TRAINING COURSE</h3>
            <div className="department-form">
              <div className="row">
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Course Name *</span>
                    <input
                      type="text"
                      placeholder=""
                      className="in-field2"
                      value={this.state.courseName}
                      onChange={(e) => {
                        this.onCourseChange(e);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Training Category *</span>
                    <div className="dropdwn" style={{ cursor: "pointer" }}>
                      <SelectBox
                        optionData={this.state.trainingArr}
                        value={this.state.trainingData}
                        placeholder="Select"
                        onSelectChange={(value) => {
                          this.onTrainingChange(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="department-form">
              <div className="row">
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Description *</span>
                    <InputText
                      type="text"
                      placeholder=""
                      className="in-field2"
                      value={this.state.description}
                      onTextChange={(value) => {
                        this.onDescriptionChange(value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-2">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Total Duration *</span>
                    <InputText
                      type="text"
                      placeholder=""
                      className="in-field2 duration_field"
                      value={this.state.totalDuration}
                      onTextChange={(value) => {
                        this.onDurationChange(value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form_rbx">
                    <span className=""></span>
                    <div
                      className="dropdwn"
                      style={{
                        cursor: "pointer",
                        marginTop: "20px",
                        width: "75%",
                        fontSize: "12px",
                      }}
                    >
                      <SelectBox
                        optionData={this.state.durationUnitArr}
                        value={this.state.durationUnitData}
                        placeholder="Select"
                        onSelectChange={(value) => {
                          this.onDurationUnitChange(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="department-form">
              <div className="row">
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">format *</span>
                    <div className="dropdwn" style={{ cursor: "pointer" }}>
                      <SelectBox
                        optionData={this.state.courseFormatArr}
                        value={this.state.courseFormatData}
                        placeholder="Select"
                        onSelectChange={(value) => {
                          this.onFormatChange(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Course Fees $ *</span>
                    <div className="dropdwn">
                      <InputText
                        type="text"
                        placeholder=""
                        className="in-field2"
                        value={this.state.courseFee}
                        onTextChange={(value) => {
                          this.onCourseFeeChange(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="department-form">
              <div className="row">
                <div className="col-md-4">
                  <div className="form_rbx">
                    <span className="">Course Documents *</span>
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
                <div className="col-md-1">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Status</span>
                    <FormControl component="fieldset" variant="standard">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AntSwitch
                          defaultChecked={this.state.checkStatus}
                          inputProps={{
                            "aria-label": "ant design",
                          }}
                          name="active"
                          onClick={(e) => this.onStatusChange(e)}
                        />
                      </Stack>
                    </FormControl>
                  </div>
                </div>
                <div className="col-md-1 status_btn">
                  <div className="status_text">
                    {this.state.checkStatus ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            </div>

            <div className="_button-style m30 _fl text-center">
              <Link
                className="white-btn"
                style={{ textDecoration: "none" }}
                // onClick={this.onCancel}
                to="/adminTrainingCourse"
              >
                Cancel
              </Link>
              <a
                className="blue-btn add-traning-cours-savasdraf"
                style={{ textDecoration: "none", color: "white" }}
                onClick={this.onNext}
              >
                Save as Draft
              </a>
              <a
                className="blue-btn"
                style={{ textDecoration: "none", color: "white" }}
                onClick={this.onPublish}
              >
                Publish
              </a>
            </div>
          </div>
        </div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}
