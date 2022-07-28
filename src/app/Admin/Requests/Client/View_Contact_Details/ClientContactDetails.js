import React, { Component } from "react";
import { styled, Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";

//.................css for textField.................

export default class ClientContactDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstname: "",
      lastname: "",
      client: "",
      emailId: "",
      industryType: "",
      phoneNo: "",
      requestDate: "",
      validateMsgfirstname: "",
      validateMsglastname: "",
      validateMsgclient: "",
      validateMsgemailId: "",
      validateMsgindustryType: "",
      validateMsgphoneNo: "",
      validateMsgrequestDate: "",
      validatefirstname: false,
      validatelastname: false,
      validateclient: false,
      validateemailId: false,
      validateindustryType: false,
      validatephoneNo: false,
      validaterequestDate: false,
    };
  }

  onFirstnameChange = (e) => {
    this.setState({
      firstname: e.target.value,
      validateMsgfirstname: "",
      validatefirstname: true,
    });
  };
  onLastnameChange = (e) => {
    this.setState({
      lastname: e.target.value,
      validateMsglastname: "",
      validatefirstname: true,
    });
  };
  onClientChange = (e) => {
    this.setState({
      client: e.target.value,
      validateMsgclientname: "",
      validatefirstname: true,
    });
  };
  onEmailChange = (e) => {
    this.setState({
      emailId: e.target.value,
      validateMsgemailId: "",
      validateemailId: true,
    });
  };
  onIndustryChange = (e) => {
    this.setState({
      industryType: e.target.value,
      validateMsgindustryType: "",
      validateindustryType: true,
    });
  };
  onPhoneChange = (e) => {
    this.setState({
      phoneNo: e.target.value,
      validateMsgphoneNo: "",
      validatephoneNo: true,
    });
  };
  onRequestDateChange = (e) => {
    this.setState({
      requestDate: e.target.value,
      validateMsgrequestDate: "",
      validaterequestDate: true,
    });
  };
  onNext = () => {
    if (this.state.firstname.length === 0) {
      this.setState({
        validatefirstname: true,
        validateMsgfirstname: "please enter your First Name",
      });
    } else if (this.state.lastname.length === 0) {
      this.setState({
        validatelastname: true,
        validateMsglastname: "please enter your Last Name",
      });
    } else if (this.state.client.length === 0) {
      this.setState({
        validateclient: true,
        validateMsgclient: "please enter Client",
      });
    } else if (this.state.emailId.length === 0) {
      this.setState({
        validateemailId: true,
        validateMsgemailId: "please enter your Email Id",
      });
    } else if (this.state.industryType.length === 0) {
      this.setState({
        validateindustryType: true,
        validateMsgindustryType: "please enter Industry type",
      });
    } else if (this.state.phoneNo.length === 0) {
      this.setState({
        validatephoneNo: true,
        validateMsgphoneNo: "please enter your Phone no.",
      });
    } else if (this.state.requestDate.length === 0) {
      this.setState({
        validaterequestDate: true,
        validateMsgrequestDate: "please enter Date",
      });
    }
  };

  render() {
    return (
      <>
        <Header />
        <Sidebar />
        <div className="content-wrapper">
          <section className="content-header">
            <div
              className="container"
              style={{ border: "0.5px solid grey", borderRadius: "10px" }}
            >
              <div className="row " style={{ marginTop: "10px" }}>
                <div className="col-sm-12">Account Information</div>
              </div>
              <div className="row" style={{ marginTop: "10px" }}>
                <div className="col-sm-4">
                  <div className="clientInputField">
                    <TextField
                      label="First Name"
                      id="standard-size-normal"
                      value={this.state.firstname}
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => this.onFirstnameChange(e)}
                    />
                    {this.state.validatefirstname == false ? (
                      <span className="errMsg"></span>
                    ) : (
                      <span className="errMsg">
                        {" "}
                        {this.state.validateMsgfirstname}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="clientInputField">
                    <TextField
                      label="Last Name"
                      id="standard"
                      value={this.state.lastname}
                      size="Normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => this.onLastnameChange(e)}
                      variant="standard"
                    />{" "}
                    {this.state.validatelastname == false ? (
                      <span className="errMsg"></span>
                    ) : (
                      <span className="errMsg">
                        {" "}
                        {this.state.validateMsglastname}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="clientInputField">
                    <span>
                      <TextField
                        label="Client"
                        id="standard"
                        value={this.state.client}
                        size="Normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => this.onClientChange(e)}
                        variant="standard"
                      />
                    </span>{" "}
                    {this.state.validateclient == false ? (
                      <span className="errMsg"></span>
                    ) : (
                      <span className="errMsg">
                        {" "}
                        {this.state.validateMsgclient}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="row" style={{ marginTop: "10px" }}>
                <div className="col-sm-4">
                  <div className="clientInputField">
                    <TextField
                      label="Email Id"
                      id="standard-size-small"
                      value={this.state.emailId}
                      size="Normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => this.onEmailChange(e)}
                      variant="standard"
                    />
                    {this.state.validateemailId == false ? (
                      <span className="errMsg"></span>
                    ) : (
                      <span className="errMsg">
                        {" "}
                        {this.state.validateMsgemailId}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                  <div className="clientInputField">
                    <TextField
                      label="Industry type"
                      id="standard-size-small"
                      value={this.state.industryType}
                      size="Normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => this.onIndustryChange(e)}
                      variant="standard"
                    />
                    {this.state.validateindustryType == false ? (
                      <span className="errMsg"></span>
                    ) : (
                      <span className="errMsg">
                        {" "}
                        {this.state.validateMsgindustryType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="row" style={{ marginTop: "10px" }}>
                <div className="col-sm-4">
                  <div className="clientInputField">
                    <TextField
                      label="Phone No"
                      id="standard-size-small"
                      value={this.state.phoneNo}
                      size="Normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => this.onPhoneChange(e)}
                      variant="standard"
                    />{" "}
                    {this.state.phoneNo == false ? (
                      <span className="errMsg"></span>
                    ) : (
                      <span className="errMsg">
                        {" "}
                        {this.state.validateMsgphoneNo}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                  <div className="clientInputField">
                    <TextField
                      label="Requested On"
                      id="standard-size-small"
                      value={this.state.requestDate}
                      size="Normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => this.onRequestDateChange(e)}
                      variant="standard"
                    />{" "}
                    {this.state.requestDate == false ? (
                      <span className="errMsg"></span>
                    ) : (
                      <span className="errMsg">
                        {" "}
                        {this.state.validateMsgrequestDate}
                      </span>
                    )}
                  </div>{" "}
                </div>
              </div>
              <div className="row" style={{ marginTop: "10px" }}>
                <div className="col-sm-1">status</div>
                <div className="col-sm-1 status">pending</div>
              </div>
              <div className="row" style={{ margin: "50px" }}>
                <div className="col-sm-4"></div>
                <div className="col-sm-4 contctDetailsBtn">
                  <button className="declineBtn">Decline</button>
                  <button className="acceptBtn" onClick={this.onNext}>
                    Accept
                  </button>
                </div>
                <div className="col-sm-4"></div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }
}
