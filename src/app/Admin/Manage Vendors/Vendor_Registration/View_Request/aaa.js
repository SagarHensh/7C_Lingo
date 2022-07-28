import React from "react";
import { Decoder } from "../../../../../services/auth";
import { ErrorCode } from "../../../../../services/constant";
import { ApiCall } from "../../../../../services/middleware";
import ReactLoader from "../../../../Loader";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";
import history from "../../../../../history";
import "./agencyType.css";
import { SetRequestViewTimeFormat } from "../../../../../services/common-function";

export default class ViewRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      showId: 1,
      showVendorId : "",
      fname: "",
      lname: "",
      agencyName: "",
      email: "",
      type: "",
      phone: "",
      requestOn: "",
      serviceOffered: "",
      status: 0,
      sourceFrom: "",
      country: "",
      sourceName: "",
      vendorTypeId: "",
      roleName: "",
      sourceId: "",
    };
  }

  componentDidMount() {
    let mainData = this.props.location;
    let preData = mainData.state;
    this.setState({
      showId: preData.id,
      showVendorId : preData.vendorid
    });
    this.load(preData.id);
    // console.log("Predata : ", preData);
  }

  load = async (id) => {
    let data = {
      vendorid: id,
    };

    let res = await ApiCall("fetchvendorreqdetails", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(res.data.payload);
      // console.log("Fetch Data>>", payload.data[0]);
      let respObj = payload.data[0];
      this.setState({
        fname: respObj.fName,
        lname: respObj.lName,
        roleName: respObj.userRole,
        email: respObj.email,
        type: respObj.vendorType,
        vendorTypeId: respObj.vendorTypeId,
        agencyName: respObj.agencyName,
        phone: respObj.mobile,
        requestOn: SetRequestViewTimeFormat(respObj.createDate),
        serviceOffered: respObj.services,
        status: respObj.approvalStatus,
        sourceId: respObj.sourceTypeId,
        sourceFrom: respObj.sourcename,
        sourceName: respObj.additionalSource,
        country: respObj.countryiso,
        isLoad: false,
      });
    }
  };

  onNext = () => {
    this.props.history.push({
      pathname: "/adminVendorDocs",
      state: this.state.showVendorId,
    });
    // return history.push("/adminVendorDocs");
  };
  onCancel = () => {
    return history.push("/adminVendorRegistration");
  };

  render() {
    return (
      <React.Fragment>
        {/* <div className="wrapper">
          <Header />
          <Sidebar /> */}
          <div class="component-wrapper" hidden={!this.state.isLoad}>
            <ReactLoader />
          </div>
          <div
            className="component-wrapper agencyType"
            hidden={this.state.isLoad}
          >
            <div className="department-component-app _fl sdw">
              <h3>ACCOUNT INFORMATION</h3>
              <div className="department-form">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form_rbx">
                      {" "}
                      <span className="">First Name</span>
                      <input
                        type="text"
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
                      <input
                        type="text"
                        placeholder=""
                        className="in-field2"
                        value={this.state.lname}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form_rbx">
                      {" "}
                      {this.state.vendorTypeId === 10 ? (
                        <React.Fragment>
                          <span className="">Agency Name</span>
                          <input
                            type="text"
                            placeholder=""
                            className="in-field2"
                            value={this.state.agencyName}
                          />{" "}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <span className="">Are you a/an</span>
                          <input
                            type="text"
                            placeholder=""
                            className="in-field2"
                            value={this.state.roleName}
                          />
                        </React.Fragment>
                      )}
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
                      <input
                        type="text"
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
                      <input
                        type="text"
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
                      <input
                        type="text"
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
                      <input
                        type="text"
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
                      {this.state.status === 0 ? (
                        <span className="pending_status_btn">Pending</span>
                      ) : this.state.status === 1 ? (
                        <span className="green_status_btn">Active</span>
                      ) : (
                        <span className="declined_status_btn">Declined</span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4"></div>
                  <div className="col-md-4">
                    <div className="form_rbx">
                      {" "}
                      <span className="">Service(s) Offered</span>
                      <input
                        type="text"
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
                      <input
                        type="text"
                        placeholder=""
                        className="in-field2"
                        value={this.state.sourceFrom}
                      />
                    </div>
                  </div>
                  <div className="col-md-4"></div>
                  <div className="col-md-4">
                    <div className="form_rbx">
                      {" "}
                      <span className="">Country of Origin</span>
                      <input
                        type="text"
                        placeholder=""
                        className="in-field2"
                        value={this.state.country}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {this.state.sourceId === 16 ? (
                <div className="department-form">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Friend's Name</span>
                        <input
                          type="text"
                          placeholder=""
                          className="in-field2"
                          value={this.state.sourceName}
                        />
                      </div>
                    </div>
                    <div className="col-md-4"></div>
                    <div className="col-md-4"></div>
                  </div>
                </div>
              ) : (
                <React.Fragment></React.Fragment>
              )}

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
                  style={{ textDecoration: "none", color: "#fff" }}
                  onClick={this.onNext}
                >
                  Next
                </a>
              </div>
            </div>
          </div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}
