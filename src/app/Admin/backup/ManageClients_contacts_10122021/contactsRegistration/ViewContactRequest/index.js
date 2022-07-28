import React from "react";
import { Decoder } from "../../../../../services/auth";
import { ErrorCode } from "../../../../../services/constant";
import { ApiCall } from "../../../../../services/middleware";
import ReactLoader from "../../../../Loader";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";
import history from "../../../../../history";
import "./viewContactRequest.css";
import { SetRequestViewTimeFormat } from "../../../../../services/common-function";
import { AlertMessage, ImageName } from "../../../../../enums";
import { ToastContainer, toast } from "react-toastify";
import { inputEmptyValidate } from "../../../../../validators";

export default class ViewContactRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoad: true,
            showId: "",
            fname: "",
            lname: "",
            client: "",
            email: "",
            industryType: "",
            phone: "",
            requestOn: "",
            status: 0,
            declineMessage: ""
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let mainData = this.props.location;
        let preData = mainData.state;
        this.setState({
            showId: preData.clientcontactid,
        });
        this.load(preData.clientcontactid);
        // console.log("Predata : ", preData);
        var classInstance = this;
        var modal = document.getElementById("decline-model");

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                classInstance.closeModal();
            }
        };
    }

    load = async (id) => {
        let data = {
            clientcontactid: id,
        };
        // console.log("Fetch data>>>", data)

        let res = await ApiCall("getclientcontactrequestdetails", data);
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            let payload = await Decoder.decode(res.data.payload);
            // console.log("Fetch Data>>", payload.data);
            let respObj = payload.data.clientcontactinfo[0];
            this.setState({
                fname: respObj.fName,
                lname: respObj.lName,
                client: respObj.clientname,
                email: respObj.email,
                phone: "+1 " + respObj.mobile,
                requestOn: SetRequestViewTimeFormat(respObj.createDate),
                industryType: respObj.industrytype,
                status: respObj.status,
                isLoad: false,
            });
        }
    };

    onNext = () => {
        return history.push("/adminVendorDocs");
    };
    onBack = () => {
        return history.push("/adminContactsRequest");
    };

    openModal = () => {
        document.getElementById("backdrop").style.display = "block";
        document.getElementById("decline-model").style.display = "block";
        document.getElementById("decline-model").classList.add("show");
    };

    closeModal = () => {
        document.getElementById("backdrop").style.display = "none";
        document.getElementById("decline-model").style.display = "none";
        document.getElementById("decline-model").classList.remove("show");
    };

    declineModal = () => {
        // window.$("#decline-model").modal("show");
        window.scrollTo(0, 0);
        this.openModal();
    };

    declineClose = () => {
        this.setState({
            declineMessage: "",
        });
        // window.$("#decline-model").modal("hide");
        this.closeModal();
    };

    declineMessageChange = (e) => {
        this.setState({
            declineMessage: e.target.value,
        });
    };

    declineRequest = () => {
        let errorCount = 0;
        let validateReason = inputEmptyValidate(this.state.declineMessage);
        if (validateReason === false) {
            toast.error(AlertMessage.MESSAGE.DECLINE_MODAL.EMPTY_MESSAGE, {
                hideProgressBar: true,
            });
            errorCount++;
        }

        if (errorCount === 0) {
            let data = {
                status: "2",
                clientcontactid: this.state.showId,
                reason: this.state.declineMessage,
            };
            // console.log("data Decline", data)
            this.modifyStatus(data);
            this.declineClose();
        }
    };

    modifyStatus = async (data) => {
        let res = await ApiCall("modifyclientcontactstatus", data);
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            if (data.status === "1") {
                toast.success(AlertMessage.MESSAGE.CLIENT_REQUEST.REQUEST_ACCEPTED, {
                    hideProgressBar: true,
                });
            } else if (data.status === "2") {
                toast.success(AlertMessage.MESSAGE.CLIENT_REQUEST.REQUEST_DECLINED, {
                    hideProgressBar: true,
                });
            }
            this.load(this.state.showId);
        }
    };

    acceptRequest = () => {
        let data = {
            status: "1",
            clientcontactid: this.state.showId,
            reason: "",
        };
        // console.log("RequestData>>>", data)
        this.modifyStatus(data);
    };


    render() {
        return (
            <React.Fragment>
                <ToastContainer hideProgressBar={true} />
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
                                        <span className="">Client</span>
                                        <input
                                            type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.client}
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
                                        <span className="">Industry Type</span>
                                        <input
                                            type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.industryType}
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
                                <div className="col-md-4"></div>
                            </div>
                        </div>

                        <div className="_button-style m30 _fl text-center">
                            <a
                                className="white-btn"
                                style={{ textDecoration: "none" }}
                                onClick={this.onBack}
                            >
                                Back
                            </a>
                            {this.state.status === 2 ? <React.Fragment></React.Fragment> :
                                <a
                                    className="white-btn"
                                    style={{ textDecoration: "none", color: "red" }}
                                    onClick={this.declineModal}
                                >
                                    Decline
                                </a>}
                            {this.state.status === 1 ? <React.Fragment></React.Fragment> :
                                <a
                                    className="blue-btn"
                                    style={{ textDecoration: "none", color: "#fff" }}
                                    onClick={this.acceptRequest}
                                >
                                    Accept
                                </a>}
                        </div>
                    </div>
                </div>

                {/* ..................Decline modal................................. */}
                <div
                    id="decline-model"
                    className="modal fade modelwindow"
                    role="dialog"
                >
                    <div className="modal-dialog modal-md modal-dialog-centered">
                        {/* <!-- Modal content--> */}
                        <div className="modal-content" style={{ width: "100%" }}>
                            <div className="cancel-job-head">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h2>
                                            REASON TO <span>DECLINE</span>
                                        </h2>
                                        <button className="close-page">
                                            <img
                                                src={ImageName.IMAGE_NAME.CLOSE_BTN_3}
                                                onClick={this.declineClose}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-body">
                                <div className="model-info f-model">
                                    <div className="form-search-app">
                                        <textarea
                                            placeholder="Reason"
                                            className="in-textarea msg min"
                                            style={{ resize: "none" }}
                                            value={this.state.declineMessage}
                                            onChange={this.declineMessageChange}
                                        ></textarea>
                                        <div className="web-form-bx margin-top-20">
                                            <div className="_button-style _fl text-center">
                                                <a className="white-btn"
                                                    onClick={this.declineClose}
                                                >
                                                    cancel
                                                </a>
                                                <a
                                                    className="blue-btn"
                                                    style={{ color: "#fff" }}
                                                    onClick={this.declineRequest}
                                                >
                                                    submit
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="modal-backdrop fade show"
                    id="backdrop"
                    style={{ display: "none" }}
                ></div>
                {/* </div> */}
            </React.Fragment>
        );
    }
}
