import React, { Component } from "react";
import FormControl from "@mui/material/FormControl";
import { ToastContainer, toast } from "react-toastify";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";
import ReactLoader from "../../../../Loader";
import { InputText } from "../../../SharedComponents/inputText";
import "./agencyType.css";


export default class InterpreterType extends Component {
    constructor(props) {
        super(props);
        // let mainData = this.props.location;
        // let preData = mainData.state;
        this.state = {
            isLoad: false,
            showId: 1,
            fname: "Steve",
            lname: "Paul",
            subType: "Interpreter",
            email: "steve@7clingo.com",
            type: "individual",
            phone: "+1 55514300333",
            requestOn: "Sept 20,2020 10:00 a.m.",
            serviceOffered: "Interpretation ",
            status: 0,
            hear: "Friends",
            country: "US",
            friendsName: "Peter Paul"
        };
    }

    render() {
        return (
            <div className="wrapper">
                <Header />
                <ToastContainer />
                <Sidebar />
                <div class="component-wrapper" hidden={!this.state.isLoad}>
                    <ReactLoader />
                </div>
                <div className="component-wrapper agencyType" hidden={this.state.isLoad}>
                    <div className="department-component-app _fl sdw">
                        <h3>ACCOUNT INFORMATION</h3>
                        <div className="department-form">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">First Name</span>
                                        <input type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.fname}
                                        // disabled={true}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Last Name</span>
                                        <input type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.lname} />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Are you a/an</span>
                                        <input type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.subType} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="department-form">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Email id</span>
                                        <input type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.email}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Type</span>
                                        <input type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.type}
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
                                        <span className="">Phone Number</span>
                                        <input type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.phone}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Requested On</span>
                                        <input type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.requestOn}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="department-form">
                            <div className="row">
                                <div className="col-md-4">
                                    <div class="st-row _fl">
                                        <span>Status</span>
                                        {this.state.status === 0 ?
                                            <span className="pending_status_btn">Pending</span> : (this.state.status === 1 ?
                                                <span className="green_status_btn">Active</span> :
                                                <span className="declined_status_btn">Declined</span>)
                                        }
                                    </div>
                                </div>
                                <div className="col-md-4">
                                </div>
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Service(s) Offered</span>
                                        <input type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.serviceOffered}
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
                                        <span className="">How did you hear about us ?</span>
                                        <input type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.hear}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Country of Origin</span>
                                        <input type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.country}
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
                                        <span className="">Friend's Name</span>
                                        <input type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.friendsName}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                </div>
                            </div>
                        </div>
                        {/* <div className="department-form">
              <div className="row">
                <div className="col-md-1">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Status</span>
                    <div className="switch-plan-data">
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
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

                        <div className="_button-style m30 _fl text-center">
                            <a
                                className="white-btn"
                                style={{ textDecoration: "none" }}
                                onClick={this.onCancel}
                            >
                                back
                            </a>
                            <a
                                className="blue-btn"
                                style={{ textDecoration: "none" }}
                                onClick={this.onNext}
                            >
                                submit
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
