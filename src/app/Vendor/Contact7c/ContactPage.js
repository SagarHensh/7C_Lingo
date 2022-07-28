import React, { Component } from "react";

import { AlertMessage, ImageName } from "../../../enums";
import { toast, ToastContainer } from "react-toastify";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { Link } from "react-router-dom";
import { consoleLog } from "../../../services/common-function";
import { inputEmptyValidate } from "../../../validators";
import { ApiCallVendor } from "../../../services/middleware";
import { ErrorCode } from "../../../services/constant";
import history from "../../../history";

export class ContactPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
     subject:"",
     feedback:""
    };
  }

  componentDidMount() {
      window.scrollTo(0,0);
  }

  subjectChange = (e) => {
      consoleLog("sub",e.target.value)
    this.setState({
        subject:e.target.value
    })
  }

  feedbackChange = (e) => {
    consoleLog("feed",e.target.value)
      this.setState({
        feedback:e.target.value
      })
  
  }

onSubmit = async() => {

    let errorCount = 0;

    let validateSubject = inputEmptyValidate(this.state.subject);
    let validateFeedback = inputEmptyValidate(this.state.feedback)

    if(validateSubject === false){
        toast.error(AlertMessage.MESSAGE.FEEDBACK.EMPTY_SUBJECT);
        errorCount++;
    } else if(validateFeedback === false){
        toast.error(AlertMessage.MESSAGE.FEEDBACK.EMPTY_FEEDBACK);
        errorCount++;
    }

    if(errorCount === 0){
        let data = {
            "subject":this.state.subject,
            "feedback":this.state.feedback
            }

        let res = await ApiCallVendor("submitContactUs",data)

        consoleLog("resss:::",res)
        if(res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS){
                toast.success(AlertMessage.MESSAGE.FEEDBACK.SUBMIT_SUCCESS)

                return history.push("/vendorDashboard")

            } else if(res.error === ErrorCode.ERROR.ERROR.WITH_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.DUPLICATE_FEEDBACK){
                toast.error(AlertMessage.MESSAGE.FEEDBACK.DUPLICATE_FEEDBACK)
            }
            
            else {
                toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR)
            }

    }
}
  

  render() {
    return (
      <React.Fragment>
        {/* <div className="wrapper">
          <Header />
          <Sidebar /> */}
          <div className="component-wrapper">
            <ToastContainer hideProgressBar theme="colored" />
            <div className="listing-component-app">
              <div
                className="vn_frm"
                style={{
                  color: "grey",
                  paddingBottom: "2%",
                  paddingTop: "5%",
                }}
              >
                {" "}
                <Link to="/vendorDashboard">Dashboard</Link> / Contact 7C
              </div>

              <div className="create-new-job-wrap" style={{marginTop:"20px"}}>
                {/* <div className="main-container"> */}
                  {/* <div className="createform-box sdw _fl"> */}
                   
                        {/* <div className="col-md-6">
                      <div className="web_btn f-right">
                        <a href="" style={{ textDecoration: "none" }}>
                          RESET
                        </a>
                        <a
                          href="#"
                          style={{ textDecoration: "none" }}
                          className="blue"
                          onClick={() => {
                            this.onSubmit();
                          }}
                        >
                          SUBMIT
                        </a>
                      </div>
                    </div> */}
                    
                    <div className="create-jeneral-wrap _fl">
                      <div className="create-jeneral-info sdw _fl">
                        <div className="create-sb-head">
                          <div className="row">
                            <div className="col-md-6">
                              <h3>Feedback</h3>
                            </div>
                          </div>
                        </div>
                        <div className="create-row-app">
                            <div className="row">
                                <div className="col-md-5 wt-left">
                                <div className="frm-label">
                                Subject *
                               
                              </div>
                                <input
                                    type="text"
                                    className="textbox4"
                                    style={{
                                      borderRadius: "9px",
                                      boxShadow:
                                        "0px 0px 4px 0px rgb(0 0 0 / 20%)",
                                    }}
                                    value={this.state.subject}
                                    onChange={this.subjectChange}
                                  />
                                </div>
                            </div>
                          <div className="row">
                            <div className="col-md-5 wt-left">
                              <div className="web-form-app">
                              <div className="web-form-bx md4">
                              <div className="frm-label">
                                Feedback *
                               
                              </div>
                              <textarea
                                rows="2"
                                placeholder=""
                                className="in-textarea msg min"
                                // value={this.state.message}
                                style={{
                                  height: "100px",
                                  color: "var(--grey)",
                                  borderRadius: "10px",
                                  boxShadow: "2px",
                                  resize: "none",
                                  width:"111%"
                                }}
                                onChange={this.feedbackChange}
                              ></textarea>
                            </div>
                              </div>
                            </div>
                          </div>


                          <div className="row m20">
                    <div className="col-md-12 text-center">
                     
                      <button
                        type="submit"
                        className="sv_btn"
                        onClick={
                          this.onSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                        </div>
                      </div>
                    </div>
                  {/* </div> */}
                {/* </div> */}
              </div>
            </div>
          </div>
        {/* </div> */}
        <div
          class="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}

export default ContactPage;
