import React from "react";
import history from "../../history";
import "../../css/login.css";
import "./forgetPass.css";
import "bootstrap/dist/css/bootstrap.css";
import { ApiCall } from "../../services/middleware";
import { emailValidator } from "../../validators";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorCode, UsersEnums } from "../../services/constant";
import { AlertMessage } from "../../enums";
import { InputText } from "../Admin/SharedComponents/inputText";
// Put any other imports below so that CSS from your
// components takes precedence over default styles.

class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      resetCheck: false
    };
  }
  componentDidMount() {
    this.load();
  }

  load = async () => {
  };

  changeUserEmail = (value) => {
    this.setState({
      email: value.toLowerCase().trim()
    });
  };

  sendClick = async (event) => {
    let errorCounter = 0;
    let validateEmail = emailValidator(this.state.email);
    if (validateEmail.status === false) {
      toast.error(validateEmail.message, { hideProgressBar: true });
      errorCounter++;
    }

    if (errorCounter === 0) {
      const data = {
        email: this.state.email,
        usertypeid: UsersEnums.APPLICATION_ROLE.SUPER_ADMIN,
        reqtime: Date.now()
      };

      const res = await ApiCall("forgotpass", data);
      if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
        // toast.success(AlertMessage.MESSAGE.EMAIL.EMAIL_SEND_TO_YOU, { hideProgressBar: true });
        // return history.push("/");
        this.setState({
          resetCheck: true
        })
      } else {
        if (res.error === ErrorCode.ERROR.ERROR.WITH_ERROR && res.respondcode == ErrorCode.ERROR.ERROR_CODE.EMAIL_NOT_EXIST) {
          toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_NOT_EXIST, { hideProgressBar: true });
        }
      }
    } else {
      event.preventDefault();
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
              <React.Fragment>
                <h3>{AlertMessage.MESSAGE.EMAIL.RESET_LINK}</h3>
                <div className="form-row-a">
                  <div
                    className="row"
                    style={{ justifyContent: "center", marginTop: "20px" }}
                  >
                    <button
                      type="submit"
                      className="apl-btn_forg"
                      onClick={this.cancelClick}
                    >
                      Back to login
                    </button>
                  </div>
                </div>
              </React.Fragment> :
              <React.Fragment>
                <h3>Enter Your Email Id</h3>
                <div className="form-row-a">
                  <InputText placeholder="Email id" className="in-field" value={this.state.email} onTextChange={(value) => { this.changeUserEmail(value) }} />
                </div>

                <div className="form-row-a">
                  <div
                  id="btn-row-cont"
                    className="row"
                    style={{ justifyContent: "center", marginTop: "20px" }}
                  >
                    <div className="form-field-app _apl"  id="cancel-btn">
                      <button
                        type="submit"
                        className="apl-btn_forg"
                        onClick={this.cancelClick}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="form-field-app _apl f-field-cont" style={{ marginLeft: '20px' }}>
                      <button
                      id="emlregist-send-btn"
                        type="submit"
                        className="apl-btn_forg"
                        onClick={this.sendClick}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default AdminLogin;
