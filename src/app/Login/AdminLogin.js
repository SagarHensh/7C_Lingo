import React from "react";
import history from "../../history";
import "../../css/login.css";
import "bootstrap/dist/css/bootstrap.css";
import { Encoder, Decoder, CryptoDecoder } from "../../services/auth";
import { InputText } from "../Admin/SharedComponents/inputText";
import "../../js/jquery.ddslick.min.js";
import { ApiCall } from "../../services/middleware";
import { UsersEnums } from "../../services/constant";
import { emailValidator, passwordValidator } from "../../validators";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AlertMessage, ImageName } from "../../enums";

// Put any other imports below so that CSS from your
// components takes precedence over default styles.

class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      checkboxChecked: false,
      cnfPassCheck: true,
    };
  }

  componentDidMount() {
    this.load();
  }

  load = async () => {
    if (localStorage.getItem("AuthToken")) {
      // return history.push("/adminDashboard");
      let authtoken = localStorage.getItem("AuthToken");
      let authUser = Decoder.decode(authtoken);
      if (
        authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN
      ) {
        return history.push("/adminDashboard");
      } else if (
        authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT
      ) {
        return history.push("/clientDashboard");
      } else if (
        authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.ADMIN_STAFF
      ) {
        return history.push("/adminDashboard");
      } else if (
        authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.VENDOR
      ) {
        return history.push("/vendorDashboard");
      }
    }
    if (localStorage.getItem("remender_info")) {
      let remenderData = Decoder.internalJwtDecode(
        localStorage.getItem("remender_info")
      );
      this.setState({
        email: remenderData.email,
        password: remenderData.password,
        checkboxChecked: remenderData.password,
      });
      localStorage.removeItem("remender_info");
    }
  };

  changeUserEmail = (value) => {
    this.setState({
      email: value.toLowerCase().trim(),
    });
  };

  changeUserPassword = (e) => {
    this.setState({
      password: e.target.value.trim(),
    });
  };

  changeEye = (data) => {
    let cnfPassCheck = this.state.cnfPassCheck;
    if (data === "cnfPass") {
      cnfPassCheck = !cnfPassCheck;
    }
    this.setState({
      cnfPassCheck: cnfPassCheck,
    });
  };

  loginClick = async (event) => {
    let errorCounter = 0;
    let validateEmail = emailValidator(this.state.email);
    if (validateEmail.status === false) {
      toast.error(validateEmail.message, { hideProgressBar: true });
      errorCounter++;
    }
    let validatePassword = passwordValidator(this.state.password);
    if (validatePassword.status === false) {
      toast.error(validatePassword.message, { hideProgressBar: true });
      errorCounter++;
    }

    if (errorCounter === 0) {
      const data = {
        deviceid: "12345",
        platform: "WEB",
        email: this.state.email,
        password: this.state.password,
        usertypeid: UsersEnums.APPLICATION_ROLE.SUPER_ADMIN,
        reqtime: Date.now(),
      };
      let res = await ApiCall("signin", data);
      if (res.error === 0 && res.respondcode === 200) {
        if (this.state.checkboxChecked === true) {
          let encodeData = Encoder.internalJwtEncode(this.state);
          localStorage.setItem("remender_info", encodeData);
        }
        localStorage.setItem("AuthToken", res.data.auth);
        let authUser = Decoder.decode(res.data.auth);
        if (
          authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN
        ) {
          return history.push("/adminDashboard");
        } else if (
          authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT
        ) {
          return history.push("/clientDashboard");
        } else if (
          authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.ADMIN_STAFF
        ) {
          return history.push("/adminDashboard");
        } else if (
          authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.VENDOR
        ) {
          return history.push("/vendorDashboard");
        }
      } else {
        if (res.error === 1 && res.respondcode == 101) {
          toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_NOT_EXIST, {
            hideProgressBar: true,
          });
        } else if (res.error === 1 && res.respondcode == 102) {
          toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_WRONG, {
            hideProgressBar: true,
          });
        }
      }
    } else {
      event.preventDefault();
    }
  };

  // ...........forgorpass....................
  onForgotPass = () => {
    history.push("/forgetpassword");
  };

  render() {
    return (
      <div className="bg-form">
        <ToastContainer hideProgressBar theme="colored"/>
        <div className="login-application">
          <div className="lg-logo _fl text-center">
            <a href="javascript:void(0)">
              <img src={ImageName.IMAGE_NAME.LOGO_WITH_TEXT_WHITE} />
            </a>
          </div>
          <div className="login-account-wrap _fl">
            <h3>Login to your Account</h3>
            <div className="form-row-a">
              <InputText
                placeholder="Email id"
                className="in-field"
                value={this.state.email}
                onTextChange={(value) => {
                  this.changeUserEmail(value);
                }}
              />
            </div>
            <div className="form-row-a">
              <div className="_psw">
                <input
                  type={this.state.cnfPassCheck ? "password" : "text"}
                  placeholder="Password"
                  className="in-field"
                  value={this.state.password}
                  onChange={(value) => {
                    this.changeUserPassword(value);
                  }}
                  style={{paddingRight:"45px"}}
                />
                <button
                  className={this.state.cnfPassCheck ? "shclose" : "sh"}
                  onClick={() => this.changeEye("cnfPass")}
                >
                  eye
                </button>
              </div>
            </div>
            <div className="form-row-a">
              <div className="row">
                <div className="col-6 col-md-6">
                  <label className="custom_check">
                    Remember Me
                    <input
                      type="checkbox"
                      checked={this.state.checkboxChecked}
                      onChange={(e) =>
                        this.setState({ checkboxChecked: e.target.checked })
                      }
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="col-6 col-md-6">
                  <span
                    className="text-right forgot-pass-link"
                    onClick={this.onForgotPass}
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    Forgot Password?
                  </span>
                </div>
              </div>
            </div>
            <div className="form-sbt">
              <button type="submit" className="login-sbt">
                <img
                  src={ImageName.IMAGE_NAME.LOGIN_BTN}
                  onClick={(event) => {
                    this.loginClick(event);
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminLogin;
