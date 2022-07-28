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
import "./addAdminstaff.css";
import {
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
  phoneNumberCheck,
} from "../../../../services/common-function";
import { ErrorCode } from "../../../../services/constant";
import ReactLoader from "../../../Loader";
import { Link } from "react-router-dom";

// .................mui switch...................................
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 68,
  height: 28,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 25,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
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
    width: 20,
    height: 22,
    borderRadius: 11,
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

export default class AddAdminstaff extends Component {
  constructor(props) {
    super(props);
    let mainData = this.props.location;
    let preData = mainData.state;
    this.state = {
      isLoad: true,
      checkStatus: false,
      userTypeId: 0,
      uname: "",
      emailId: "",
      phone: "",
      role: "",
      roleTypeId: 0,
      lastModified: "",
      password: "",
      cpassword: "",
      roleArr: [],
      roleData: "",
      countryCode: 1,
      checked: "",
    };
  }

  componentDidMount() {
    // let mainData = this.props.location;
    // let preData = mainData.state;

    // window.$(".myDropdown").ddslick();
    // window.$(".frm4-select").ddslick();
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    let data = {};
    let roleDataArr = [];
    let res = await ApiCall("getroles", data);
    // consoleLog("res::", res);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);

      payload.data.map((obj) => {
        roleDataArr.push({
          label: obj.rolename,
          value: obj.id,
        });
      });

      this.setState({
        roleArr: roleDataArr,
        phone: "+" + this.state.countryCode + " ",
        isLoad: false,
      });
    }
  };
  // ...............for tabs..........................

  onNameChange = (value) => {
    // var pattern = new RegExp(Regex.NAME_REGEX);
    let nameCheck = nameRegexValidator(value);
    // if (pattern.test(value)) {

    this.setState({
      uname: nameCheck,
    });
  };
  onNameChange = (value) => {
    var pattern = new RegExp(Regex.STRING_NUMBER_REGEX);
    if (departmentValidator(value)) {
      if (pattern.test(value)) {
        this.setState({
          uname: value,
        });
      }
    }
  };
  onEmailChange = (value) => {
    this.setState({
      emailId: value,
    });
  };
  onPhoneChange = (value) => {
    if (numberValidator(value) === true) {
      if (mobileNumberValidator(value) === true) {
        let phoneCheck = phoneNumberCheck(value);
        if (phoneCheck) {
          this.setState({
            phone: phoneCheck,
          });
        }
      }
    }
  };
  onRoleChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      roleData: obj,
    });
  };
  onLastmodifiedChange = (value) => {
    this.setState({
      lastModified: value,
    });
  };
  onPasswordChange = (value) => {
    this.setState({
      password: value,
    });
  };
  onCpasswordChange = (value) => {
    this.setState({
      cpassword: value,
    });
  };
  onStatusChange = (e) => {
    this.setState({
      checkStatus: !this.state.checkStatus,
    });
  };

  onNext = async () => {
    // consoleLog("7777")
    let mobileNo = this.state.phone.substring(3, 15);
    let validatePhone = inputEmptyValidate(mobileNo);
    let errorCount = 0;
    let validateName = inputEmptyValidate(this.state.uname);
    let validateRole = inputEmptyValidate(this.state.roleData.value);
    let validateNameLength = departmentValidator(this.state.uname);
    if (validateName === false) {
      toast.error(AlertMessage.MESSAGE.USER.EMPTY_USER, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateNameLength === false) {
      toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    let validateEmail = emailValidator(this.state.emailId);

    if (validateEmail.status === false) {
      toast.error(validateEmail.message, {
        hideProgressBar: true,
      });
      errorCount++;
    } else {
      if (this.state.emailId.length > 50) {
        toast.error(AlertMessage.MESSAGE.EMAIL.MAX_EMAIL_LENGTH, {
          hideProgressBar: true,
        });
        errorCount++;
      }
    }

    if (validatePhone === false) {
      toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    if (validateRole === false) {
      toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_ROLE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    let validatePassword = passwordValidator(this.state.password);

    if (validatePassword.status === false) {
      toast.error(validatePassword.message, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    let validateCpassword = inputEmptyValidate(this.state.cpassword);
    if (validateCpassword === false) {
      toast.error(AlertMessage.MESSAGE.PASSWORD.CONFIRM_PASSWORD_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    if (this.state.password !== this.state.cpassword) {
      toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_NOT_MATCH, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      let objData = {
        username: this.state.uname,
        email: this.state.emailId,
        cuncode: this.state.countryCode,
        phone: mobileNo,
        roleid: parseInt(this.state.roleData.value),
        password: this.state.password,
        status: this.state.checkStatus ? "1" : "0",
      };

      // consoleLog("$$$$$",objData)

      let res = await ApiCall("createuser", objData);
      let payload = Decoder.decode(res.data.payload);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.CREATE.SUCCESS, {
          hideProgressBar: true,
        });
        return history.push("/adminStaff");
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
  //................func for modal move......
  handleMoveModalOpen = () => {
    this.setState({
      opendepartmentModal: true,
    });
  };
  handleMoveModalClose = () => {
    this.setState({
      opendepartmentModal: false,
    });
  };

  // .....................func for cancel btn......................

  onCancel = () => {
    history.push("/adminStaff");
  };

  render() {
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
        {/* <Header /> */}
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
              <Link to="/adminDashboard">Dashboard</Link> / <Link to="/adminStaff">Admin Staff</Link> / Add 
            </div>
          <div className="department-component-app _fl sdw">
            <h3>ADD USER DETAILS</h3>
            <div className="department-form">
              <div className="row">
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Name *</span>
                    {/* <InputText
                      type="text"
                      placeholder="Steve"
                      className="in-field2"
                      value={this.state.uname}
                      onChange={(e) => this.onNameChange(e)}
                    /> */}
                    <InputText
                      placeholder=""
                      className="in-field2"
                      value={this.state.uname}
                      onTextChange={(value) => {
                        this.onNameChange(value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Email *</span>
                    <div className="dropdwn">
                      <InputText
                        type="text"
                        placeholder=""
                        className="in-field2"
                        value={this.state.emailId}
                        onTextChange={(value) => {
                          this.onEmailChange(value);
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
                    <span className="">Phone No *</span>
                    <div className="dropdwn">
                      <InputText
                        type="text"
                        placeholder=""
                        className="in-field2"
                        value={this.state.phone}
                        onTextChange={(value) => {
                          this.onPhoneChange(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Role *</span>
                    <div className="dropdwn">
                      <SelectBox
                        optionData={this.state.roleArr}
                        value={this.state.roleData}
                        placeholder="Select"
                        onSelectChange={(value) => {
                          this.onRoleChange(value);
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
                    <span className="">Password *</span>
                    <div className="dropdwn">
                      <InputText
                        type="password"
                        placeholder=""
                        className="in-field2"
                        value={this.state.password}
                        onTextChange={(value) => {
                          this.onPasswordChange(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Confirm Password *</span>
                    <div className="dropdwn">
                      <InputText
                        type="password"
                        placeholder=""
                        className="in-field2"
                        value={this.state.cpassword}
                        onTextChange={(value) => {
                          this.onCpasswordChange(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="department-form">
              <div className="row">
                <div className="col-md-1">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Status</span>
                    {/* <div className="switch-plan-data">
                      <div className="switch-toggle">
                        <label className="switch status-switch">
                          <input
                            id="status-data"
                            type="checkbox"
                            name="xxxsx"
                            onChange={this.onStatusChange}
                          />
                          <span className="slider round"></span>{" "}
                        </label>
                        <span className="act">
                          {this.state.checkStatus ? "InActive" : "Active"}
                        </span>{" "}
                      </div>
                    </div> */}
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
                <div className="col-md-1 status-btn">
                  <div className="status_text" id="manag-adm-stf-add-acticont">
                    {this.state.checkStatus ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            </div>

            <div className="_button-style m30 _fl text-center">
              <a
                href="javascript:void(0)"
                className="white-btn"
                style={{ textDecoration: "none" }}
                onClick={this.onCancel}
              >
                back
              </a>
              <a
                href="javascript:void(0)"
                className="blue-btn"
                style={{ textDecoration: "none", color: "#fff" }}
                onClick={this.onNext}
              >
                submit
              </a>
            </div>
          </div>
        </div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}
