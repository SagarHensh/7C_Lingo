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
import { ErrorCode } from "../../../../services/constant";
import "./editAdminStaff.css";
import BlueTick from "../../../../images/blue-tick.png";
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
import { Decoder } from "../../../../services/auth";
import { phoneNumberCheck } from "../../../../services/common-function";
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
const roleArr = [
  { id: "INTER", name: "interpretation" },
  { id: "SUB", name: "Subtitling" },
  { id: "VOI", name: "voice over" },
];

export default class EditAdminStaff extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad: true,
      staffId: "",
      roleTypeId: 0,
      checkStatus: false,
      userTypeId: 0,
      uname: "",
      emailId: "",
      phone: "",
      role: "",
      roleArr: [],
      roleData: "",
      lastModified: "",
      password: "",
      cpassword: "",

      checked: "",
      roleName: [],
      countryCode: 1,
      mystatus: 0,
    };
  }

  componentDidMount() {
    // window.$(".myDropdown").ddslick();
    // window.$(".frm4-select").ddslick();
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    let roleData = {};
    let roleDataArr = [],
      roleDataObj = {},
      staffDetails = [];

    let mainData = this.props.location;
    let preData = mainData.state;

    let data = {
      staffid: preData.userId,
      staffusertypeid: preData.userTypeId,
    };
    let editStaffData = await ApiCall("getstaffdetails", data);
    let payload = Decoder.decode(editStaffData.data.payload);

    staffDetails = payload.data.staffdetails;

    // .........get Roles ....................

    let res = await ApiCall("getroles", roleData);

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
        if (staffDetails[0].roleId === obj.id) {
          roleDataObj = {
            label: obj.rolename,
            value: obj.id,
          };
        }
      });
    }
    // ..........................................

    // console.log("preData", preData);
    // console.log(">>>>>>>>>auth", staffDetails[0]);
    // console.log(res);
    // if (res.error === 0 && res.respondcode === 200) {
    //   let payload = await Decoder.decode(res.data.payload);
    //   subDeptArr = payload.data;
    // }

    this.setState({
      roleArr: roleDataArr,
      uname: staffDetails[0].name,
      emailId: staffDetails[0].email,
      roleData: roleDataObj,
      phone: "+" + this.state.countryCode + " " + staffDetails[0].mobile,
      mystatus: staffDetails[0].status,
      checkStatus: staffDetails[0].status === 1 ? true : false,
      isLoad: false,
    });
  };
  // ...............for tabs..........................

  onNameChange = (value) => {
    let nameCheck = nameRegexValidator(value);
    // if (pattern.test(value)) {

    this.setState({
      uname: nameCheck,
    });
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
  onStatusChange = async () => {
    let mainData = this.props.location;
    let preData = mainData.state;
    let data = {
      staffid: preData.userId,
      status: this.state.mystatus,
      staffusertypetd: preData.userTypeId,
    };

    //  if (arrData[index].status === 0) {
    //    stat = 1;
    //  } else {
    //    stat = 0;
    //  }
    // console.log(">?>?>?>?", data);
    // let res = await ApiCall("adminstaffstatuschange", data);

    this.setState({
      checkStatus: !this.state.checkStatus,
    });
  };

  onNext = async () => {
    let mobileNo = this.state.phone.substring(3, 15);
    let errorCount = 0;
    let validateName = inputEmptyValidate(this.state.uname);
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
    let validatePhone = inputEmptyValidate(mobileNo);

    if (validatePhone === false) {
      toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    if (this.state.role === 0) {
      toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_ROLE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    // let validatePassword = passwordValidator(this.state.password);

    // if (validatePassword.status === false) {
    //   toast.error(validatePassword.message, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // } else {
    //   let validateCpassword = inputEmptyValidate(this.state.cpassword);
    //   if (validateCpassword === false) {
    //     toast.error(AlertMessage.MESSAGE.PASSWORD.CONFIRM_PASSWORD_EMPTY, {
    //       hideProgressBar: true,
    //     });
    //     errorCount++;
    //   }
    //   if (this.state.password != this.state.cpassword) {
    //     toast.error(AlertMessage.MESSAGE.PASSWORD.PASS_CNFPASS_NOT_MATCH, {
    //       hideProgressBar: true,
    //     });
    //     errorCount++;
    //   }
    // }

    if (errorCount === 0) {
      let mainData = this.props.location;
      let preData = mainData.state;
      let objData = {
        staffid: preData.userId,
        staffusertypeid: preData.userTypeId,
        name: this.state.uname,
        email: this.state.emailId,
        countrycode: this.state.countryCode,
        mobile: mobileNo,
        photo: "aaa.jpg",
        roleid: parseInt(this.state.roleData.value),
        password: this.state.password,
        status: this.state.checkStatus ? "1" : "0",
      };

      let res = await ApiCall("modifystaffdetails", objData);

      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.CREATE.SUCCESS, {
          hideProgressBar: true,
        });
        return history.push("/adminStaff");
      } else {
        if (res.error === 1 && res.respondcode === 108) {
          toast.error(AlertMessage.MESSAGE.DEPARTMENT.DUPLICATE_DEPARTMENT, {
            hideProgressBar: true,
          });
        }
      }

      // toast.success(AlertMessage.MESSAGE.USER.ADD_USER_SUCCESS, {
      //   hideProgressBar: true,
      // });
      // return history.push("/clientdepartment");
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
              <Link to="/adminDashboard">Dashboard</Link> / <Link to="/adminStaff">Admin Staff</Link> / Edit 
            </div>
          <div className="department-component-app _fl sdw">
            <h3>EDIT USER DETAILS</h3>
            <div className="department-form">
              <div className="row">
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Name *</span>
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
                      <input
                        type="text"
                        value={this.state.emailId}
                        placeholder=""
                        className="in-field2"
                        disabled={true}
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
                    <span className="">Password</span>
                    <div className="dropdwn">
                      <InputText
                        type="password"
                        placeholder=""
                        name="adminStaffPassword"
                        className="in-field2"
                        value={this.state.password}
                        onTextChange={(value) => {
                          this.onPasswordChange(value);
                        }}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Confirm Password</span>
                    <div className="dropdwn">
                      <InputText
                        type="password"
                        placeholder=""
                        name="adminStaffPasswordConf"
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
                <div className="col-md-1 status-btn">
                  <div
                    className="status_text"
                    id="manag-admin-stf-edit-acti-cont"
                  >
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
