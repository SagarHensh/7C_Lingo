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
// import "./AddServiceCategory.css";
import {
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
import { consoleLog, phoneNumberCheck } from "../../../../services/common-function";
import { ErrorCode } from "../../../../services/constant";
import ReactLoader from "../../../Loader";
import { Modal } from "bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { IMAGE_PATH_ONLY, IMAGE_URL } from "../../../../services/config/api_url";

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

const statusArr = [
  {
    label: "Active",
    value: "1",
  },
  {
    label: "Inactive",
    value: "0",
  },
];

export default class EditIndustryType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad: true,
      requestId: "",
      statusData: {},
      imagePath: "",
      industryTypeName: "",
      description: "",
      adminPhoto: ""
    };
  }

  componentDidMount() {
    let mainData = this.props.location;
    let preData = mainData.state;
    if (preData.id === undefined) {
      return history.push("/adminIndustryTypeList");
    } else {
      this.setState({
        requestId: preData.id
      })

      window.scrollTo(0, 0);
      this.load(preData.id);
    }
  }

  load = async (id) => {
    let statusObj = {};
    let data = { id: id };
    let res = await ApiCall("fetchIndustryTypeById", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      consoleLog("industry data::",payload.data)
      if (payload.data.industryData.length > 0) {
        if (payload.data.industryData[0].status !== undefined) {
          statusArr.map((obj) => {
            if (obj.value == payload.data.industryData[0].status) {
              statusObj = {
                label: obj.label,
                value: obj.value
              }
            }
          })
        }

        this.setState({
          adminPhoto: payload.data.industryData[0].logo,
          imagePath: IMAGE_PATH_ONLY + payload.data.industryData[0].logo,
          industryTypeName: payload.data.industryData[0].name,
          statusData: statusObj,
          isLoad: false,
        });
      }
    }
  };
  // ...............for tabs..........................

  onIndustryNameChange = (e) => {
    var pattern = new RegExp(Regex.STRING_NUMBER_REGEX);
    if (departmentValidator(e.target.value)) {
      if (pattern.test(e.target.value)) {
        this.setState({
          industryTypeName: e.target.value,
        });
      }
    }
  };

  onStatusChange = (val) => {
    this.setState({
      statusData: val,
    });
  };

  onProfileImage = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      // console.log(res.data.data);
      this.setState({
        imagePath: res.data.data.url,
        adminPhoto: res.data.data.path + res.data.data.filename,
      });
      //   this.onUpdate();
    });
  };

  onNext = async () => {
    // let mobileNo = this.state.phone.substring(3, 14);
    let validateNameLength = departmentValidator(this.state.industryTypeName);
    let errorCount = 0;
    let validateName = inputEmptyValidate(this.state.industryTypeName);
    let validateStatus = inputEmptyValidate(this.state.statusData.value);

    let validatePhoto = inputEmptyValidate(this.state.imagePath);


    if (validateName === false) {
      toast.error(AlertMessage.MESSAGE.INDUSTRY_TYPE.EMPTY_INDUSTRY_NAME, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateNameLength === false) {
      toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateStatus === false) {
      toast.error(AlertMessage.MESSAGE.DOCUMENT.DROPDOWN_STATUS_EMPTY)
      errorCount++;
    } else if (validatePhoto === false) {
      toast.error(AlertMessage.MESSAGE.INDUSTRY_TYPE.EMPTY_LOGO)
      errorCount++;
    }

    if (errorCount === 0) {
      let mainData = this.props.location,
        preData = mainData.state

      let objData = {
        id: preData.id,
        name: this.state.industryTypeName,
        logo: this.state.adminPhoto,
        status: this.state.statusData.value
      };

      consoleLog("data::",objData)

      let res = await ApiCall("updateIndustryType", objData);

      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(
          AlertMessage.MESSAGE.INDUSTRY_TYPE.UPDATE_SUCCESSFULLY,
          {
            hideProgressBar: true,
          }
        );
        window.setTimeout(() => {
          return history.push("/adminIndustryTypeList");
        }, 2000);
      } else {
        if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.DUPLICATE_DEPT
        ) {
          toast.error(
            AlertMessage.MESSAGE.INDUSTRY_TYPE.INDUSTRY_TYPE_EXIST,
            {
              hideProgressBar: true,
            }
          );
        }
      }
    }
  };

  // .....................func for cancel btn......................

  onCancel = () => {
    history.push("/adminIndustryTypeList");
  };

  render() {
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
            <Link to="/adminIndustryTypeList">Industry Type</Link> / Edit
          </div>
          <h3 className="dcs">Edit Industry Type</h3>
          <div className="department-component-app _fl sdw">
            <h3 className="heading">Industry Type DETAILS</h3>
            <div className="row">
              <div className="col-md-8">
                <div className="department-form">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="form_rbx">
                        <span className="">Industry Type *</span>

                        <input
                          type="text"
                          className="in-field2"
                          placeholder=""
                          value={this.state.industryTypeName}
                          onChange={(e) => {
                            this.onIndustryNameChange(e);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="department-form">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Status *</span>
                        <SelectBox
                          optionData={statusArr}
                          value={this.state.statusData}
                          placeholder="Select"
                          onSelectChange={(value) => {
                            this.onStatusChange(value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="profile-pic-data">
                  <div className="c-logo">
                    <img className="border_50_img" src={this.state.imagePath} />
                    <button className="pht">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={this.onProfileImage}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="_button-style m30 _fl text-center">
              <a
                className="white-btn"
                style={{ textDecoration: "none", color: "grey" }}
                onClick={this.onCancel}
              >
                CANCEL
              </a>
              <a
                className="blue-btn"
                style={{ textDecoration: "none", color: "white", width: "10%" }}
                onClick={this.onNext}
              >
                SAVE
              </a>
            </div>
          </div>
        </div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}
