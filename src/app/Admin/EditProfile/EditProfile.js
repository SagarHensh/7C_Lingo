import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import $ from "jquery";
// import history from "../../../history";
import "bootstrap/dist/css/bootstrap.css";
// import { Link } from "react-router-dom";
// import Header from "../Header/Header";
// import Sidebar from "../Sidebar/Sidebar";
import "../../../js/jquery.ddslick.min.js";

import { InputText, SelectBox } from "../SharedComponents/inputText";
import "./editProfile.css";
import {
  inputEmptyValidate,
  mobileNumberLengthValidator,
  mobileNumberValidator,
  nameRegexValidator,
  nameValidator,
  newPassValidator,
  numberValidator,
  passwordValidator,
} from "../../../validators";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiCall } from "../../../services/middleware";
import { AlertMessage } from "../../../enums";
import { Decoder } from "../../../services/auth";
import {
  consoleLog,
  phoneNumberCheck,
} from "../../../services/common-function";
import { ErrorCode, UsersEnums } from "../../../services/constant";
import {
  IMAGE_PATH_ONLY,
  IMAGE_STORE_PATH,
  IMAGE_URL,
} from "../../../services/config/api_url";
import { connect } from "react-redux";
import * as Action from "../../../store/CombineReducer/actions/Action.js";
import { Link } from "react-router-dom";
// import Select from 'react-dropdown';
// import 'react-dropdown/style.css';

export class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: "",
      username: "",
      adminPhone: "",
      profilePhoto: "",
      adminEmail: "",
      userRole: "",
      adminPhoto: "",
      countryCode: "",

      adminAccDet: false,
      companyDet: false,
      addressDet: false,
      passwordDet: false,

      companyName: "",
      businessWeb: "",
      businessEmail: "",
      businessPhone: "",
      purchOrder: "",
      industryType: "",
      fax: "",

      sameAddressCheck: false,
      countryName: "",
      stateName: "",
      cityName: "",
      zipCode: "",
      billCountryName: "",
      billStateName: "",
      billCityName: "",
      billZipCode: "",

      curPassword: "",
      newPassword: "",
      confPassword: "",

      curentPassCheck: true,
      newPassCheck: true,
      cnfPassCheck: true,
      imagePath: "images/profile-pic.png",
      userType: ""
    };
  }

  componentDidMount() {
    window.$(".my-form-rw h3").click(function () {
      $(this).parent().find(".my-form-bx").slideToggle();
      $(this).toggleClass("open");
    });

    window.$(".myDropdown").ddslick();

    this.getAdminProfile();
  }

  getAdminProfile = async () => {
    let res = await ApiCall("getAdminProfile");
    let payload = Decoder.decode(res.data.payload);
    let admindata = payload.data.adminInfo[0];
    let usphn = "+" + admindata.countrycode + " " + admindata.mobile;
    // for user id get from local storage
    let auth = Decoder.decode(localStorage.getItem("AuthToken"));
    this.setState({
      clientId: auth.data.userid,
      userType: auth.data.usertypeid
    });

    if (
      admindata.photo === null ||
      admindata.photo === undefined ||
      admindata.photo === "" ||
      admindata.photo === "aaa.jpg"
    ) {
      this.setState({
        imagePath: IMAGE_STORE_PATH + "profilepic1635924283919.png",
      });
    } else {
      this.setState({
        imagePath: IMAGE_PATH_ONLY + admindata.photo,
      });
    }
    // consoleLog("Adminphoto : :", admindata);
    this.setState({
      username: admindata.name,
      adminPhone: usphn,
      adminEmail: admindata.email,
      countryCode: admindata.countrycode,
      userRole: this.state.userType == UsersEnums.APPLICATION_ROLE.ADMIN_STAFF ? "Admin Staff" : "Admin",
      adminPhoto: IMAGE_PATH_ONLY + admindata.photo,
      // imagePath: IMAGE_STORE_PATH + admindata.photo
    });
  };

  updateProfile = async () => {
    let mobileNo = this.state.adminPhone.substring(3, 14).replace(/\s/g, "");
    let errorCounter = 0;
    if (inputEmptyValidate(this.state.username) === false) {
      toast.error(AlertMessage.MESSAGE.USER.EMPTY_USER, {
        hideProgressBar: true,
      });
      errorCounter++;
    }
    if (inputEmptyValidate(mobileNo) === false) {
      toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY, {
        hideProgressBar: true,
      });
      errorCounter++;
    } else {
      if (mobileNumberLengthValidator(mobileNo) === false) {
        toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_GREATER, {
          hideProgressBar: true,
        });
        errorCounter++;
      }
    }
    if (inputEmptyValidate(this.state.adminPhoto) === false) {
      toast.error(AlertMessage.MESSAGE.USER.USER_PHOTO_EMPTY, {
        hideProgressBar: true,
      });
      errorCounter++;
    }
    if (errorCounter === 0) {
      let data = {
        name: this.state.username,
        countrycode: this.state.countryCode,
        mobile: mobileNo,
        photo: this.state.adminPhoto,
      };
      let res = await ApiCall("modifyAdminProfile", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.UPDATE.PROFILE_SUCCESS, {
          hideProgressBar: true,
        });
      } else {
        if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.PHONE_EXIST
        ) {
          toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_NOT_MATCH, {
            hideProgressBar: true,
          });
        } else {
          toast.error(AlertMessage.MESSAGE.UPDATE.PROFILE_FAILURE, {
            hideProgressBar: true,
          });
        }
      }
    }
  };

  changeUsername = (e) => {
    let nameCheck = nameRegexValidator(e);
    this.setState({
      username: nameCheck,
    });
  };

  changeUserPhone = (value) => {
    if (numberValidator(value) === true) {
      if (mobileNumberValidator(value) === true) {
        let phoneCheck = phoneNumberCheck(value);
        if (phoneCheck) {
          this.setState({
            adminPhone: phoneCheck,
          });
        }
      }
    }
  };

  // for passwor section
  currentPassword = (value) => {
    this.setState({
      curPassword: value.trim(),
    });
  };

  newPassword = (value) => {
    this.setState({
      newPassword: value.trim(),
    });
  };

  confirmPassword = (value) => {
    this.setState({
      confPassword: value.trim(),
    });
  };

  resetPassword = async () => {
    let errorCounter = 0;
    let currentPasswordStatus = passwordValidator(this.state.curPassword);
    let newPasswordStatus = newPassValidator(this.state.newPassword);
    let confirmPasswordStatus = inputEmptyValidate(this.state.confPassword);

    if (currentPasswordStatus.status === false) {
      toast.error(AlertMessage.MESSAGE.PASSWORD.CURRENT_PASSWORD_EMPTY, {
        hideProgressBar: true,
      });
      errorCounter++;
    }
    if (newPasswordStatus.status === false) {
      toast.error(newPasswordStatus.message, { hideProgressBar: true });
      errorCounter++;
    } else {
      if (confirmPasswordStatus === false) {
        toast.error(AlertMessage.MESSAGE.PASSWORD.CNF_PASS_EMPTY, {
          hideProgressBar: true,
        });
        errorCounter++;
      }
    }

    if (errorCounter === 0) {
      if (this.state.curPassword === this.state.newPassword) {
        toast.error(AlertMessage.MESSAGE.PASSWORD.DUPLICATE_PASS, {
          hideProgressBar: true,
        });
      } else {
        if (this.state.newPassword != this.state.confPassword) {
          toast.error(AlertMessage.MESSAGE.PASSWORD.PASS_CNFPASS_NOT_MATCH, {
            hideProgressBar: true,
          });
        } else {
          let data = {
            oldpass: this.state.curPassword,
            newpass: this.state.newPassword,
            reqtime: Date.now(),
          };

          let res = await ApiCall("resetPassword", data);
          if (res.error === 0 && res.respondcode === 200) {
            toast.success(
              AlertMessage.MESSAGE.PASSWORD.PASSWORD_RESET_SUCCESS,
              { hideProgressBar: true }
            );
            this.setState({
              curPassword: "",
              newPassword: "",
              confPassword: "",
            });
          } else {
            if (
              res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
              res.respondcode === ErrorCode.ERROR.ERROR_CODE.INCORRECT_PASSWORD
            ) {
              toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_NOT_MATCH, {
                hideProgressBar: true,
              });
            } else {
              toast.error(
                AlertMessage.MESSAGE.PASSWORD.PASSWORD_RESET_FAILURE,
                { hideProgressBar: true }
              );
            }
          }
        }
      }
    }
  };

  resetPasswordField = () => {
    this.setState({
      curPassword: "",
      newPassword: "",
      confPassword: "",
    });
  };

  changeEye = (data) => {
    let curentPassCheck = this.state.curentPassCheck,
      newPassCheck = this.state.newPassCheck,
      cnfPassCheck = this.state.cnfPassCheck;
    if (data === "curPass") {
      curentPassCheck = !curentPassCheck;
    } else if (data === "newPass") {
      newPassCheck = !newPassCheck;
    } else if (data === "cnfPass") {
      cnfPassCheck = !cnfPassCheck;
    }
    this.setState({
      curentPassCheck: curentPassCheck,
      newPassCheck: newPassCheck,
      cnfPassCheck: cnfPassCheck,
    });
  };

  onUpdate = async () => {
    let mobileNo = this.state.adminPhone.substring(3, 14).replace(/\s/g, "");
    let data = {
      name: this.state.username,
      countrycode: this.state.countryCode,
      mobile: mobileNo,
      photo: this.state.adminPhoto,
    };
    let res = await ApiCall("modifyAdminProfile", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.UPDATE.PROFILE_SUCCESS, {
        hideProgressBar: true,
      });
    }
  };

  onProfileImage = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      consoleLog(res.data.data);
      this.setState({
        imagePath:
          IMAGE_PATH_ONLY + res.data.data.path + res.data.data.filename,
        adminPhoto: res.data.data.path + res.data.data.filename,
      });
      this.props.getDemo(res.data.data.url);
      this.onUpdate();
    });
  };

  render() {
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
        <ToastContainer hideProgressBar theme="colored" />
        {/* <Header imagePath={this.state.imagePath} />
          <Sidebar /> */}
        <div className="component-wrapper">
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            {" "}
            <Link to="/adminDashboard">Dashboard</Link> / Admin Profile
          </div>
          <div className="breadcrumb-info _fl">
            <ul>
              <li>
                MY ACCOUNT<small></small>{" "}
              </li>
            </ul>
          </div>
          <div className="myaccount-section-wrap _fl">
            <div className="row">
              <div className="col-md-9">
                <div className="my-form-rw _fl">
                  <h3 className="open">Account Details </h3>
                  <div className="my-form-bx" style={{ display: "block" }}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Name *</span>
                          <InputText
                            value={this.state.username}
                            placeholder=""
                            onTextChange={(value) => {
                              this.changeUsername(value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Phone Number *</span>
                          <InputText
                            value={this.state.adminPhone}
                            placeholder=""
                            onTextChange={(value) => {
                              this.changeUserPhone(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Email</span>
                          <input
                            type="text"
                            value={this.state.adminEmail}
                            placeholder=""
                            className="in-field2"
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Role</span>
                          <input
                            type="text"
                            value={this.state.userRole}
                            placeholder=""
                            className="in-field2"
                            disabled={true}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <button
                          type="submit"
                          className="sv_btn"
                          onClick={this.updateProfile}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-form-rw _fl">
                  <h3>Change Password</h3>
                  <div className="my-form-bx">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Current Password *</span>
                          <div className="_psw">
                            <InputText
                              type={
                                this.state.curentPassCheck ? "password" : "text"
                              }
                              placeholder=""
                              className="in-field3_cp eyeMod"
                              value={this.state.curPassword}
                              onTextChange={(value) => {
                                this.currentPassword(value);
                              }}

                            />
                            <button
                              className={
                                this.state.curentPassCheck ? "shclose" : "sh"
                              }
                              onClick={() => this.changeEye("curPass")}
                            >
                              eye
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6" />
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">New Password *</span>
                          <div className="_psw">
                            <InputText
                              type={
                                this.state.newPassCheck ? "password" : "text"
                              }
                              placeholder=""
                              className="in-field3_cp eyeMod"
                              value={this.state.newPassword}
                              onTextChange={(value) => {
                                this.newPassword(value);
                              }}
                            />
                            <button
                              className={
                                this.state.newPassCheck ? "shclose" : "sh"
                              }
                              onClick={() => this.changeEye("newPass")}
                            >
                              eye
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Confirm Password *</span>
                          <div className="_psw">
                            <InputText
                              type={
                                this.state.cnfPassCheck ? "password" : "text"
                              }
                              placeholder=""
                              className="in-field3_cp eyeMod"
                              value={this.state.confPassword}
                              onTextChange={(value) => {
                                this.confirmPassword(value);
                              }}
                            />
                            <button
                              className={
                                this.state.cnfPassCheck ? "shclose" : "sh"
                              }
                              onClick={() => this.changeEye("cnfPass")}
                            >
                              eye
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row m20">
                      <div className="col-md-12 text-center">
                        <button
                          type="submit"
                          className="cn_btn"
                          onClick={this.resetPasswordField}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="sv_btn"
                          onClick={this.resetPassword}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 text-center">
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
                  {/* <h4 className="h4_text">{this.state.clientId}</h4> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log("ProfileState : ", state);

  let data = state;
  return {
    data,
  };
};

const mapDispatchToProps = (dispatch) => {
  // console.log("Dispatch>>>>>>>>> ", dispatch(Action.valueChange()));
  return {
    getDemo: (imagePath) => {
      dispatch(Action.valueChange(imagePath));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
// export default EditProfile;
