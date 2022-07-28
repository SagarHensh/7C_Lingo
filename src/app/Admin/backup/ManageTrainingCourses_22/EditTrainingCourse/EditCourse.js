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
import { InputText } from "../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../enums";
import "./EditCourse.css";
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
import { phoneNumberCheck } from "../../../../services/common-function";
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
const durationUnitArr = [
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
export default class EditCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad: true,
      checkStatus: false,
      isPublish: false,
      userTypeId: 0,
      courseId: 0,
      courseName: "",
      description: "",
      category: "",
      totalDuration: "",
      durationUnit: 0,
      format: "",
      courseFee: "",
      resFormatArr: [],
      resTrainingCategoryArr: [],
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
    let mainData = this.props.location;
    let preData = mainData.state;
    // console.log("preData:::::", preData);
    let objData = {
      id: preData.id,
    };

    let resData = await ApiCall("fetchTrainingCourseDetails", objData);
    let courseData = Decoder.decode(resData.data.payload);
    // console.log(">::>:::::", courseData.data[0]);

    this.setState({
      courseName: courseData.data[0].name,
      description: courseData.data[0].description,
      category: courseData.data[0].serviceCategoryId,
      totalDuration: courseData.data[0].duration,
      durationUnit: durationUnitArr,
      courseFee: courseData.data[0].fees,
      format: courseData.data[0].formatTypeId,
      adminPhoto: courseData.data[0].documentPath,
      checkStatus: courseData.data[0].status === 1 ? true : false,
      isPublish: courseData.data[0].pulishStatus === 1 ? true : false,
      courseId: courseData.data[0].id,
    });
    if (
      this.state.adminPhoto !== "" &&
      this.state.adminPhoto !== undefined &&
      this.state.adminPhoto != null
    ) {
      this.setState({
        hidden: true,
      });
    } else {
      this.setState({
        hidden: false,
      });
    }

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
        selected: false,
      },
    ];

    this.state.resTrainingCategoryArr.map((data) => {
      // console.log("<<<<<<<<<<<<<", data);
      if (data.id === courseData.data[0].serviceCategoryId) {
        trainingArr.push({
          text: data.name,
          value: data.id,
          selected: true,
        });
      } else {
        trainingArr.push({
          text: data.name,
          value: data.id,
          selected: false,
        });
      }
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
        text: "select",
        value: 0,
        selected: false,
      },
    ];
    this.state.durationUnit.map((data) => {
      if (data.text === courseData.data[0].durationUnit) {
        durationArr.push({
          text: data.text,
          value: data.value,
          selected: true,
        });
      } else {
        durationArr.push({
          text: data.text,
          value: data.value,
          selected: false,
        });
      }
    });

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
        selected: false,
      },
    ];
    this.state.resFormatArr.map((data) => {
      // console.log(":::::::::OOOOOOOO", data);
      if (data.id === courseData.data[0].formatTypeId) {
        formatArr.push({
          text: data.name,
          value: data.id,
          selected: true,
        });
      } else {
        formatArr.push({
          text: data.name,
          value: data.id,
          selected: false,
        });
      }
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
  onDescriptionChange = (value) => {
    this.setState({
      description: value,
    });
  };
  onDurationChange = (value) => {
    let v = courseDurationValidate(value);
    this.setState({
      totalDuration: v,
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

    if (this.state.category === 0) {
      toast.error(
        AlertMessage.MESSAGE.TRAINING_COURSE.DROPDOWN_TRAINING_CATEGORY_EMPTY,
        {
          hideProgressBar: true,
        }
      );
      errorCount++;
    }

    let validateTotalDuration = inputEmptyValidate(this.state.totalDuration);
    if (validateTotalDuration === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.TOTAL_DURATION_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    if (this.state.format === 0) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.FORMAT_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    let validateCourseFee = inputEmptyValidate(this.state.courseFee);
    if (validateCourseFee === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.COURSE_FEE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    let validateUploadFile = inputEmptyValidate(this.state.adminPhoto);
    if (validateUploadFile === false) {
      toast.error(AlertMessage.MESSAGE.TRAINING_COURSE.COURSE_DOCUMENT_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      let objData = {
        id: this.state.courseId,
        name: this.state.courseName,
        serviceCategoryId: this.state.category,
        description: this.state.description,
        duration: this.state.totalDuration,
        durationUnit: this.state.durationUnit,
        formatTypeId: this.state.format,
        fees: this.state.courseFee,
        status: this.state.checkStatus ? "1" : "0",
        publishStatus: this.state.isPublish ? "1" : "0",
        documentPath: this.state.adminPhoto,
      };

      let res = await ApiCall("updateTrainingCourse", objData);
      // console.log("response data::::::", res);

      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(
          AlertMessage.MESSAGE.TRAINING_COURSE.COURSE_UPDATE_SUCCESS,
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
        <ToastContainer />
        {/* <Sidebar /> */}
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>
        <div className="component-wrapper" hidden={this.state.isLoad}>
          <div className="department-component-app _fl sdw">
            <h3>EDIT TRAINING COURSE</h3>
            <div className="department-form">
              <div className="row">
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Course Name</span>
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
                    <span className="">Training Category</span>
                    <div className="dropdwn" style={{ cursor: "pointer" }}>
                      <select class="categoryDropdown frm4-select"></select>
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
                    <span className="">Description</span>
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
                    <span className="">Total Duration</span>
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
                      }}
                    >
                      <select
                        class="hourDropdown frm4-select"
                        style={{ width: "20px" }}
                      ></select>
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
                    <span className="">format</span>
                    <div className="dropdwn" style={{ cursor: "pointer" }}>
                      <select class="formatDropdown frm4-select"></select>
                    </div>
                  </div>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Course Fees $</span>
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
                    <span className="">Course Documents</span>
                    <div class="upload-profile">
                      <label
                        htmlFor="file-upload"
                        for="profile_image"
                        class="doc-sheet"
                        data-toggle="tooltip"
                        data-placement="top"
                        title={this.state.adminPhoto}
                        style={{ cursor: "pointer" }}
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
                        {this.state.checkStatus ? (
                          <AntSwitch
                            checked={true}
                            inputProps={{
                              "aria-label": "ant design",
                            }}
                            name="active"
                            onClick={() => this.onStatusChange()}
                          />
                        ) : (
                          <AntSwitch
                            checked={false}
                            inputProps={{
                              "aria-label": "ant design",
                            }}
                            name="active"
                            onClick={() => this.onStatusChange()}
                          />
                        )}
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
                style={{ textDecoration: "none", color: "grey" }}
                // onClick={this.onCancel}
                to="/adminTrainingCourse"
              >
                Cancel
              </Link>
              <a
                className="blue-btn"
                style={{ textDecoration: "none", color: "white" }}
                onClick={this.onNext}
              >
                Update
              </a>
              {/* <a
                className="blue-btn"
                style={{ textDecoration: "none", color: "white" }}
                onClick={this.onPublish}
              >
                Publish
              </a> */}
            </div>
          </div>
        </div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}
