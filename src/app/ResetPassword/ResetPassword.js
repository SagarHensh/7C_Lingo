import React from "react";
import history from "../../history";
import "./resetPassword.css";
import "../../css/login.css";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import { InputText } from "../Admin/SharedComponents/inputText";
import { inputEmptyValidate, passwordValidator } from "../../validators";
import { ToastContainer, toast } from 'react-toastify';
import { AlertMessage } from "../../enums";
import { Decoder } from "../../services/auth";
import { ApiCall } from "../../services/middleware";
import { ErrorCode } from "../../services/constant";
// Put any other imports below so that CSS from your
// components takes precedence over default styles.
class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      cpassword: "",
      resetCheck: false
    };
  }

  changeUserPassword = (value) => {
    this.setState({
      password: value.trim(),
    });
  };
  changeUserConfirmPassword = (value) => {
    this.setState({
      cpassword: value.trim(),
    });
  };

  sendClick = async() => {
    let errorCounter = 0;
    let validatePassword = passwordValidator(this.state.password);
    if (validatePassword.status === false) {
      toast.error(validatePassword.message, { hideProgressBar: true });
      errorCounter++;
    } else {
      if (inputEmptyValidate(this.state.cpassword) === false) {
        toast.error(AlertMessage.MESSAGE.PASSWORD.CNF_PASS_EMPTY, { hideProgressBar: true });
        errorCounter++;
      } else if (this.state.password != this.state.cpassword) {
        toast.error(AlertMessage.MESSAGE.PASSWORD.PASS_CNFPASS_NOT_MATCH, { hideProgressBar: true });
        errorCounter++;
      }
    }

    if (errorCounter === 0) {
      const url = new URL(window.location.href);
      const dataUrl = url.searchParams.get("resetInfo");
      let data = {
        requestid: parseInt(dataUrl),
        newpassword: this.state.password
      } 
      let res = await ApiCall("resetpass", data);
      if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
        localStorage.clear();
        toast.success(AlertMessage.MESSAGE.PASSWORD.PASSWORD_RESET_SUCCESS, { hideProgressBar: true });
        this.setState({
          resetCheck: true
        })
      } else {
        if (res.error === ErrorCode.ERROR.ERROR.WITH_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.LINK_EXPIRE) {
          console.log(res.respondcode)
          toast.error(AlertMessage.MESSAGE.LINK.EXPIRE, { hideProgressBar: true });
        } else if (res.error === ErrorCode.ERROR.ERROR.WITH_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.LINK_ALREADY_USED) {
          toast.error(AlertMessage.MESSAGE.LINK.ALREADY_USE, { hideProgressBar: true });
        }
      }
    }
  };

  cancelClick = () => {
    return history.push("/");
  }

  render() {
    return (
      <div className="bg-form">
        <ToastContainer />
        <div className="login-application">
          <div className="lg-logo _fl text-center">
            <a href="#">
              <img src="images/logo2.jpg" />
            </a>
          </div>
          <div className="login-account-wrap _fl">
            {this.state.resetCheck ?
              <h3>{AlertMessage.MESSAGE.PASSWORD.PASSWORD_RESET_SUCCESS}</h3> :
              <React.Fragment>
                <h3>Reset Password</h3>
                <div className="form-row-a">
                  <InputText type="password" value={this.state.password} placeholder="New Password" className="in-field" onTextChange={(value) => { this.changeUserPassword(value) }} />
                </div>
                <div className="form-row-a">
                  <InputText type="password" value={this.state.cpassword} placeholder="Confirm New Password" className="in-field" onTextChange={(value) => { this.changeUserConfirmPassword(value) }} />
                </div>
              </React.Fragment>
            }
            <div className="form-row-a">
              <div
              
                className="row"
                style={{ marginTop: "20px", justifyContent: 'center' }}
              >
                {this.state.resetCheck ?
                  <button
                    type="submit"
                    className="apl-btn_login"
                    onClick={this.cancelClick}
                  >
                    Back To Login
                  </button>
                  :
                  <React.Fragment>
                    <div id="react-btn-con">
                    <div className="form-field-app _apl" id="rea-can-btn-div-cont">
                      <button
                        type="submit"
                        className="apl-btn_forg"
                        onClick={this.cancelClick}
                      >
                        CANCEL
                      </button>
                    </div>
                    <div className="form-field-app _apl" style={{ marginLeft: '20px' }} id="reast_can_btn">
                      <button
                        type="submit"
                        className="apl-btn_forg"
                        onClick={this.sendClick}
                      >
                        RESET
                      </button>
                    </div>

                    </div>
                  </React.Fragment>
                  
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
