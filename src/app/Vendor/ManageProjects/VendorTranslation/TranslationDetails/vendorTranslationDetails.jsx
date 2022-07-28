import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { AlertMessage, ImageName } from "../../../../../enums";
import history from "../../../../../history";
import { Decoder } from "../../../../../services/auth";
import { consoleLog, SetDatabaseDateFormat, SetDateFormat, SetTimeFormat, SetUSAdateFormat, SetUSAdateFormatV2, textTruncate } from "../../../../../services/common-function";
import { IMAGE_PATH_ONLY } from "../../../../../services/config/api_url";
import { ErrorCode } from "../../../../../services/constant";
import { ApiCall, ApiCallVendor } from "../../../../../services/middleware";
import "./vendorTranslation.css";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { CgSoftwareUpload } from "react-icons/cg";
import { APP_URL } from "../../../../../services/config";
import axios from "axios";
import { validateDecimal } from "../../../../../validators";
import { TimerSharp } from "@material-ui/icons";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "700px",
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
    borderRadius: "10px"
};
const styleCancelModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "500px",
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    // p: 4,
    borderRadius: "15px"
};

export default class VendorTranslationDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            preData: {},
            projectId: "",
            serviceName: "",
            sourceLanguage: "",
            targetLanguage: "",
            status: "",
            dueDate: "",
            notes: "",
            projectDetails: {},
            open: false,
            cancelModal: false,

            bidWordCount: 0,
            bidDtpHour: 0,
            bidDtpUnit: 0,
            bidUnitPerWord: 0,
            totalBidAmount: 0,
            bidProposeDeadline: "",
            cancelReason: "",
            allSourceDocuments: "",
            allVendorDocuments: "",
            vendorDocumentModal: false,
            docModalData: [],
            vendorDocumentsNotes: "",
            vendorDocId: ""
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let mainData = this.props.location,
            preData = mainData.state;
        if (preData === undefined) {
            return history.push("/vendorTranslationList")
        } else {
            this.load(preData);
        }
    }

    load = async (preData) => {
        // let mainData = this.props.location,
        //     preData = mainData.state;

        // consoleLog("Predata::", preData);
        this.setState({
            preData: preData
        })
        this.getDocumentData(preData.taskId);

        let reqObj = {
            bidId: preData.bidId
        }

        const res = await ApiCallVendor("getTranslationProjetDeails", reqObj);
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            const decodeData = Decoder.decode(res.data.payload);
            consoleLog("Details :", decodeData.data);
            if (decodeData.data.translationList.length > 0) {
                let projectDetails = decodeData.data.translationList[0];

                let status = "Offered Received";
                if (projectDetails.status == 0) {
                    status = "Offered Received";
                } else if (projectDetails.status == 1) {
                    status = "Bid Sent";
                } else if (projectDetails.status == 2) {
                    status = "Assigned";
                } else if (projectDetails.status == 3) {
                    status = "In Progress";
                } else if (projectDetails.status == 4) {
                    status = "Completed";
                } else if (projectDetails.status == 6) {
                    status = "Under Review";
                } else if (projectDetails.status == 5) {
                    status = "Offer Rejected";
                }

                this.setState({
                    projectId: projectDetails.ProjectId,
                    serviceName: projectDetails.name,
                    sourceLanguage: projectDetails.sourceLanguage,
                    targetLanguage: projectDetails.targetLanguage,
                    status: status,
                    dueDate: projectDetails.expectedDeadline,
                    bidWordCount: parseInt(projectDetails.wordCount),
                    // bidProposeDeadline: SetUSAdateFormat(projectDetails.expectedDeadline),
                    bidProposeDeadline: "",
                    notes: projectDetails.notes,
                    projectDetails: projectDetails
                })

            }
            // let listData = [];
            // if (decodeData.data.translationList.length > 0) {
            //     listData = decodeData.data.translationList;
            //     let totalPage = Math.ceil(
            //         decodeData.data.translationList / this.state.limit
            //     );
            //     this.setState({
            //         listData: listData,
            //         total_page: totalPage,
            //     });
            // } else {
            //     this.setState({
            //         listData: listData
            //     })
            // }
        }

    }

    getDocumentData = async (id) => {
        let reqObj = {
            taskId: id
        }

        const res = await ApiCallVendor("getVendorTranslationDocs", reqObj);
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            const payload = Decoder.decode(res.data.payload);
            consoleLog("Details of vendor documents:", payload.data);
            let allSourceDocuments = [],
                allVendorDocuments = [];
            if (payload.data.source.length > 0) {
                allSourceDocuments = payload.data.source;
            }
            if (payload.data.vendor.length > 0) {
                allVendorDocuments = payload.data.vendor;
            }

            this.setState({
                allSourceDocuments: allSourceDocuments,
                allVendorDocuments: allVendorDocuments
            });

        } else {
            toast.error(res.message)
        }
    }


    onDownload = (path) => {
        // window.open(
        //   IMAGE_PATH_ONLY + this.state.taskList[pos].docZipPath,
        //   "_blank"
        // );
        var file_path = IMAGE_PATH_ONLY + path;
        var a = document.createElement('a');
        a.href = file_path;
        a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    onBack = () => {
        return history.push("/vendorTranslationList")
    }

    handleOpen = () => {
        this.setState({
            open: true
        })
    }

    handleClose = () => {
        this.setState({
            open: false
        })
    }

    handleDtpHr = (e) => {
        let lan = this.state.projectDetails.targetLanguage.split(",");


        let val = 0;
        if (
            e.target.value !== "" &&
            !isNaN(e.target.value) &&
            e.target.value !== 0
        ) {
            val = parseFloat(e.target.value);
        } else {
            val = 0;
        }
        this.setState({
            bidDtpHour: val,
            totalBidAmount: (val * this.state.bidDtpUnit * lan.length) + (this.state.bidWordCount * this.state.bidUnitPerWord * lan.length)
        })
    }

    handleDtpUnitCost = (e) => {
        let lan = this.state.projectDetails.targetLanguage.split(",");

        let val = 0,
            aa = "";
        if (e.target.value != "") {
            if (validateDecimal(e.target.value)) {
                aa = e.target.value;
                if (aa.indexOf(".") == -1) {
                    val = parseFloat(e.target.value);
                } else {
                    let bb = e.target.value.split(".");
                    if (bb[1] == "") {

                        val = parseFloat(e.target.value) + ".";
                        // alert(val)
                    } else if (parseFloat(bb[1]) == 0) {
                        val = parseFloat(e.target.value) + ".0";
                    }
                    else {
                        val = parseFloat(e.target.value);
                    }
                    // val = e.target.value;
                }
                this.setState({
                    bidDtpUnit: val,
                    totalBidAmount: (parseFloat(e.target.value) * this.state.bidDtpHour * lan.length) + (parseFloat(this.state.bidUnitPerWord) * lan.length * this.state.bidWordCount)
                })
            }
        } else {
            this.setState({
                bidDtpUnit: 0,
                totalBidAmount: (0 * this.state.bidDtpHour * lan.length) + (parseFloat(this.state.bidUnitPerWord) * lan.length * this.state.bidWordCount)
            })
        }
        // if (
        //     e.target.value !== "" &&
        //     !isNaN(e.target.value) &&
        //     e.target.value !== 0
        // ) {
        //     val = parseFloat(e.target.value);
        // } else {
        //     val = 0;
        // }
        // this.setState({
        //     bidDtpUnit: val,
        //     totalBidAmount: val * this.state.bidDtpHour * this.state.bidUnitPerWord * lan.length
        // })
    }

    handleUnitPerWord = (e) => {
        let lan = this.state.projectDetails.targetLanguage.split(",");

        let val = 0,
            aa = "";
        if (e.target.value != "") {
            if (validateDecimal(e.target.value)) {
                aa = e.target.value;
                if (aa.indexOf(".") == -1) {
                    val = parseFloat(e.target.value);
                } else {
                    let bb = e.target.value.split(".");
                    if (bb[1] == "") {

                        val = parseFloat(e.target.value) + ".";
                        // alert(val)
                    } else if (parseFloat(bb[1]) == 0) {
                        val = parseFloat(e.target.value) + ".0";
                    }
                    else {
                        val = parseFloat(e.target.value);
                    }
                    // val = e.target.value;
                }
                // val = parseFloat(e.target.value);
                this.setState({
                    bidUnitPerWord: val,
                    totalBidAmount: (parseFloat(e.target.value) * this.state.bidWordCount * lan.length) + (this.state.bidDtpUnit * parseFloat(this.state.bidDtpHour) * lan.length)
                })
            }
        } else {
            this.setState({
                bidUnitPerWord: 0,
                totalBidAmount: (0 * this.state.bidWordCount * lan.length) + (this.state.bidDtpUnit * parseFloat(this.state.bidDtpHour) * lan.length)
            })
        }
        // if (
        //     e.target.value !== "" &&
        //     !isNaN(e.target.value) &&
        //     e.target.value !== 0
        // ) {
        //     val = parseFloat(e.target.value);
        // } else {
        //     val = 0;
        // }
        // this.setState({
        //     bidUnitPerWord: val,
        //     totalBidAmount: val * this.state.bidDtpUnit * this.state.bidDtpHour * lan.length
        // })
    }

    proposeDateChange = (date) => {
        this.setState({
            bidProposeDeadline: SetUSAdateFormatV2(date)
        })
    }

    bidSent = async () => {
        if (this.state.bidUnitPerWord === "" || this.state.bidUnitPerWord == 0) {
            toast.error("Please enter unit/word amount");
            return false;
        }
        // else if (this.state.projectDetails.isDtp === 1) {
        //     if (this.state.bidDtpHour === "" || this.state.bidDtpHour == 0) {
        //         toast.error("Please enter DTP hour");
        //         return false;
        //     } else if (this.state.bidDtpUnit === "" || this.state.bidDtpUnit == 0) {
        //         toast.error("Please enter DTP unit/hour");
        //         return false;
        //     }
        // } 
        else {
            let reqObj = {
                bidId: this.state.projectDetails.bidId,
                requestId: this.state.projectDetails.requestId,
                taskNo: this.state.projectDetails.taskNo,
                note: this.state.projectDetails.notes,
                totalBidFee: this.state.totalBidAmount.toString(),
                proposedDeadline: this.state.bidProposeDeadline === "" ? "" : SetDatabaseDateFormat(this.state.bidProposeDeadline),
                unitPerWord: this.state.bidUnitPerWord.toString(),
                dtpHour: this.state.bidDtpHour.toString(),
                dtpHourRate: this.state.bidDtpUnit.toString(),
                wordCount : this.state.bidWordCount
            }

            consoleLog("SEND BID REQOBJ::", reqObj);
            const res = await ApiCallVendor("translationTaskSendBid", reqObj);
            if (
                res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
            ) {
                toast.success("Bid Sent Successfully");
                this.handleClose();
                this.load(this.state.preData);
            } else {
                toast.error(res.message);
            }
        }
    }

    handleCloseCancelModal = () => {
        this.setState({
            cancelModal: false
        })
    }

    handleOpenCancelModal = () => {
        this.setState({
            cancelModal: true
        })
    }

    onOtherReasonChange = (e) => {
        this.setState({
            cancelReason: e.target.value
        })
    }

    onDeclineProject = async () => {
        let reqObj = {
            bidId: this.state.projectDetails.bidId,
            selectReason: this.state.cancelReason
        }

        // consoleLog("Cancel Project REQOBJ::", reqObj);
        const res = await ApiCallVendor("cancelProjectDetailsForApp", reqObj);
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            toast.success("Translation Rejected Successfully");
            this.handleCloseCancelModal();
            this.onBack();
        }


    }

    openVendorDocumentModal = (id) => {
        this.setState({
            vendorDocId: id,
            vendorDocumentModal: true
        })
    }

    closeVendorDocumentModal = () => {
        this.setState({
            vendorDocumentModal: false
        })
    }

    vendorDocumentNotesChange = (e) => {
        this.setState({
            vendorDocumentsNotes: e.target.value
        })
    }

    deleteModalDocs = (i) => {
        let arr = this.state.docModalData;
        arr.splice(i, 1);
        this.setState({
            docModalData: arr,
        });
    };

    onUploadDocument = (e) => {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        axios.post(APP_URL.IMAGE_URL, formData).then((res) => {

            if (res.data.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR) {
                let arr = this.state.docModalData;
                arr.push(res.data.data.path + res.data.data.filename);
                this.setState({
                    docModalData: arr,
                });
                toast.success(AlertMessage.MESSAGE.DOCUMENT.DOCUMENT_UPLOAD_SUCCESS, {
                    hideProgressBar: true,
                });
            }
        });
    };

    submitVendorDocument = async () => {
        let authData = localStorage.getItem("AuthToken");
        let authUser = Decoder.decode(authData);
        if (this.state.docModalData.length == 0) {
            toast.error("Please upload atleast one document");
            return false;
        } else if (this.state.vendorDocumentsNotes === "") {
            toast.error("Please enter documents notes");
            return false;
        } else {
            let obj = {
                id: this.state.vendorDocId,
                documents: this.state.docModalData,
                notes: this.state.vendorDocumentsNotes
            }
            // consoleLog("sumit data:", obj);
            let res = await ApiCall("translationDocUpload", obj);
            if (
                res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
            ) {
                toast.success(res.message);
                this.setState({
                    docModalData: [],
                    vendorDocumentsNotes: ""
                })
                this.closeVendorDocumentModal();
                this.load(this.state.preData)
                // return history.push("/adminProjectList");
            } else {
                toast.error(res.message);
            }
        }
    }

    onStart = async () => {
        let obj = {
            bidId: this.state.projectDetails.bidId,
            taskId: this.state.projectDetails.taskId
        }
        let res = await ApiCall("translationStart", obj);
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            toast.success("Project started");
            this.load(this.state.preData)
            // return history.push("/adminProjectList");
        } else {
            toast.error(res.message);
        }
    }


    render() {
        return (
            <React.Fragment>
                <ToastContainer hideProgressBar theme="colored" />
                <div className="component-wrapper">
                    <div
                        className="vn_frm"
                        style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
                    >
                        {" "}
                        <Link to="/vendorDashboard">Dashboard</Link> /{" "}
                        <Link to="/vendorTranslationList">Translation</Link>
                        / {" "}Details
                    </div>
                    <div className="job-details-tab jobdltste _fl sdw">
                        <ul className="nav nav-tabs" style={{ height: "59px", justifyContent: "left" }}>
                            <li className="nav-item">
                                {" "}
                                <a
                                    className="nav-link active"
                                    data-toggle="tab"
                                    href="#jobdetails"
                                >
                                    <div className="taber">
                                        <figure>
                                            <img src={ImageName.IMAGE_NAME.JOB_DETAILS} />
                                        </figure>{" "}
                                        Project Details
                                    </div>
                                </a>{" "}
                            </li>
                            <li className="nav-item">
                                {" "}
                                <a className="nav-link" data-toggle="tab" href="#sendqute">
                                    <div className="taber">
                                        <figure>
                                            <img src={ImageName.IMAGE_NAME.TABBAR} />
                                        </figure>
                                        Tasks
                                    </div>
                                </a>{" "}
                            </li>
                            <li className="nav-item">
                                {" "}
                                <a className="nav-link" data-toggle="tab" href="#Document">
                                    <div className="taber">
                                        <figure>
                                            <img src={ImageName.IMAGE_NAME.DOCUMENTICON} />
                                        </figure>
                                        Documents
                                    </div>
                                </a>{" "}
                            </li>
                        </ul>
                        <div className="tab-content">

                            <div className="tab-pane  active" id="jobdetails">
                                <div className="job-section-tab">
                                    <table
                                        width="100%"
                                        cellspacing="0"
                                        cellpadding="0"
                                        border="0"
                                    >
                                        <tbody>
                                            <tr>
                                                <td width="50%" align="left">
                                                    Project ID
                                                </td>
                                                <th width="50%" align="right">
                                                    {this.state.projectId}
                                                </th>
                                            </tr>

                                            <tr>
                                                <td width="50%" align="left">
                                                    Service
                                                </td>
                                                <th width="50%" align="right">
                                                    {this.state.serviceName}
                                                </th>
                                            </tr>

                                            <tr>
                                                <td width="50%" align="left">
                                                    Source Language
                                                </td>
                                                <th width="50%" align="right">
                                                    {this.state.sourceLanguage}
                                                </th>
                                            </tr>

                                            <tr>
                                                <td width="50%" align="left">
                                                    Target Language
                                                </td>
                                                <th width="50%" align="right">
                                                    {this.state.targetLanguage}
                                                </th>
                                            </tr>

                                            <tr>
                                                <td width="50%" align="left">
                                                    Status
                                                </td>
                                                <th width="50%" align="right">
                                                    {this.state.status}
                                                </th>
                                            </tr>

                                            <tr>
                                                <td width="50%" align="left">
                                                    Due Date
                                                </td>
                                                <th width="50%" align="right">
                                                    {this.state.dueDate}
                                                </th>
                                            </tr>
                                            <tr>
                                                <td width="50%" align="left">
                                                    Notes
                                                </td>
                                                <th width="50%" align="right">
                                                    &nbsp;{this.state.notes}
                                                </th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="tab-pane" id="sendqute">
                                <div className="job-section-tab">
                                    {Object.keys(this.state.projectDetails).length > 0 ?
                                        <table
                                            width="100%"
                                            cellspacing="0"
                                            cellpadding="0"
                                            border="0"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td width="50%" align="left">
                                                        Service type
                                                    </td>
                                                    <th width="50%" align="right">
                                                        {this.state.projectDetails.name}
                                                    </th>
                                                </tr>

                                                <tr>
                                                    <td width="50%" align="left">
                                                        Source Language
                                                    </td>
                                                    <th width="50%" align="right">
                                                        {this.state.projectDetails.sourceLanguage}
                                                    </th>
                                                </tr>

                                                <tr>
                                                    <td width="50%" align="left">
                                                        Target Language
                                                    </td>
                                                    <th width="50%" align="right">
                                                        {this.state.projectDetails.targetLanguage}
                                                    </th>
                                                </tr>

                                                <tr>
                                                    <td width="50%" align="left">
                                                        Document Name
                                                    </td>
                                                    <th width="50%" align="right">
                                                        {this.state.projectDetails.docName}
                                                    </th>
                                                </tr>

                                                <tr>
                                                    <td width="50%" align="left">
                                                        Due Date
                                                    </td>
                                                    <th width="50%" align="right">
                                                        {this.state.dueDate}
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <td width="50%" align="left">
                                                        Source File[s]
                                                    </td>
                                                    <th width="50%" align="right">
                                                        <a href="javascript:void(0)">
                                                            <img
                                                                src={ImageName.IMAGE_NAME.DOWNLOADSHEET}
                                                                onClick={() => this.onDownload(this.state.projectDetails.docZipPath)}
                                                            />
                                                        </a>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <td width="50%" align="left">
                                                        Notes
                                                    </td>
                                                    <th width="50%" align="right">
                                                        &nbsp;{this.state.notes}
                                                    </th>
                                                </tr>
                                            </tbody>
                                        </table> : <></>
                                    }

                                    <div className="_button-style m30 _fl text-center">
                                        <a
                                            href="javascript:void(0)"
                                            className="white-btn"
                                            style={{ textDecoration: "none" }}
                                            onClick={() => this.onBack()}
                                        >
                                            Back
                                        </a>
                                        {this.state.projectDetails.status == 0 ? <>
                                            <a
                                                href="javascript:void(0)"
                                                className="white-btn"
                                                style={{ textDecoration: "none", color: "red" }}
                                                onClick={() => this.handleOpenCancelModal()}
                                            >
                                                Reject
                                            </a>
                                            <a
                                                href="javascript:void(0)"
                                                className="blue-btn"
                                                style={{ textDecoration: "none", color: "#fff" }}
                                                onClick={this.handleOpen}
                                            >
                                                Sent Bid
                                            </a>
                                        </> : <>
                                            {this.state.projectDetails.status == 2 ? <>
                                                <a
                                                    href="javascript:void(0)"
                                                    className="white-btn"
                                                    style={{ textDecoration: "none", color: "red" }}
                                                    onClick={() => this.handleOpenCancelModal()}
                                                >
                                                    Reject
                                                </a>
                                                <a
                                                    href="javascript:void(0)"
                                                    className="blue-btn"
                                                    style={{ textDecoration: "none", color: "#fff" }}
                                                    onClick={() => this.onStart()}
                                                >
                                                    Start
                                                </a>
                                            </> : <></>}
                                        </>}
                                    </div>
                                </div>
                            </div>



                            {/* ..............For Documents Tab.............. */}

                            <div className="tab-pane" id="Document">
                                <div className="document-list-wrap _fl sdw margin-top-30">
                                    <div className="_fl doc-wrap">
                                        <h3>Source Documents</h3>


                                        <div className="table-listing-app tblt">
                                            <div className="table-responsive">
                                                <table
                                                    width="100%"
                                                    border="0"
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                >
                                                    <tr>
                                                        <th style={{ width: "20%" }}>Filename</th>
                                                        <th style={{ width: "20%" }}>Service Type</th>
                                                        <th style={{ width: "20%" }}>Last Modified on</th>
                                                        <th style={{ width: "20%" }}>Notes to Vendor</th>
                                                        <th style={{ width: "20%" }}>Action</th>
                                                        {/* <th style={{ width: "10%" }}>Action</th> */}
                                                    </tr>
                                                    {this.state.allSourceDocuments.length > 0 ? (
                                                        <React.Fragment>
                                                            {this.state.allSourceDocuments.map((data, i) => (
                                                                <React.Fragment key={i}>
                                                                    <tr>
                                                                        <td>
                                                                            <p>{data.docName}</p>
                                                                        </td>
                                                                        <td><p>{data.serviceName}</p></td>
                                                                        <td>
                                                                            <p>
                                                                                {SetDateFormat(data.lastUpdated) +
                                                                                    " | " +
                                                                                    SetTimeFormat(data.lastUpdated)}
                                                                            </p>
                                                                        </td>
                                                                        <td>
                                                                            <p className="tr_notes_p">
                                                                                <span
                                                                                    className="tr_nl"
                                                                                    data-toggle="tooltip"
                                                                                    title={data.notes}>
                                                                                    {textTruncate(data.notes, 30)}
                                                                                </span>
                                                                            </p>
                                                                        </td>
                                                                        <td>
                                                                            <p>
                                                                                <a href="javascript:void(0)">
                                                                                    <img
                                                                                        src={ImageName.IMAGE_NAME.DOWNLOADSHEET}
                                                                                        onClick={() => this.onDownload(data.docPath)}
                                                                                    />
                                                                                </a>
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                </React.Fragment>
                                                            ))}
                                                        </React.Fragment>
                                                    ) : (
                                                        <React.Fragment>
                                                            <tr style={{ textAlign: "center" }}>
                                                                <td colSpan="7">
                                                                    <center style={{ fontSize: "20px" }}>
                                                                        No data found !!!
                                                                    </center>
                                                                </td>
                                                            </tr>
                                                        </React.Fragment>
                                                    )}
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="document-list-wrap _fl sdw margin-top-30">
                                    <div className="_fl doc-wrap">
                                        <h3>Vendor Documents</h3>


                                        <div className="table-listing-app tblt">
                                            <div className="table-responsive">
                                                <table
                                                    width="100%"
                                                    border="0"
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                >
                                                    <tr>
                                                        <th style={{ width: "20%" }}>Filename</th>
                                                        <th style={{ width: "15%" }}>Service Type</th>
                                                        <th style={{ width: "20%" }}>Last Modified on</th>
                                                        <th style={{ width: "20%" }}>Notes to Vendor</th>
                                                        <th style={{ width: "15%" }}>Download</th>
                                                        <th style={{ width: "15%" }}>Upload</th>
                                                        {/* <th style={{ width: "10%" }}>Action</th> */}
                                                    </tr>
                                                    {this.state.allVendorDocuments.length > 0 ? (
                                                        <React.Fragment>
                                                            {this.state.allVendorDocuments.map((data, i) => (
                                                                <React.Fragment key={i}>
                                                                    <tr>
                                                                        <td>
                                                                            <p>{data.docName}</p>
                                                                        </td>
                                                                        <td><p>{data.serviceName}</p></td>
                                                                        <td>
                                                                            <p>
                                                                                {SetDateFormat(data.lastUpdated) +
                                                                                    " | " +
                                                                                    SetTimeFormat(data.lastUpdated)}
                                                                            </p>
                                                                        </td>
                                                                        <td>
                                                                            <p className="tr_notes_p">
                                                                                <span
                                                                                    className="tr_nl"
                                                                                    data-toggle="tooltip"
                                                                                    title={data.notes}>
                                                                                    {textTruncate(data.notes, 30)}
                                                                                </span>
                                                                            </p>
                                                                        </td>
                                                                        <td>
                                                                            {data.isUpload == 1 ? <>
                                                                                <p>N/A</p></> :
                                                                                <p>
                                                                                    <a href="javascript:void(0)">
                                                                                        <img
                                                                                            src={ImageName.IMAGE_NAME.DOWNLOADSHEET}
                                                                                            onClick={() => this.onDownload(data.docPath)}
                                                                                        />
                                                                                    </a>
                                                                                </p>
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {data.isUpload == 1 && this.state.projectDetails.status == 3 ?
                                                                                <p>
                                                                                    <a href="javascript:void(0)" onClick={() => this.openVendorDocumentModal(data.id)}>
                                                                                        <CgSoftwareUpload size={30} style={{ cursor: "pointer" }} />
                                                                                    </a>
                                                                                </p> : <><p>N/A</p></>
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                </React.Fragment>
                                                            ))}
                                                        </React.Fragment>
                                                    ) : (
                                                        <React.Fragment>
                                                            <tr style={{ textAlign: "center" }}>
                                                                <td colSpan="7">
                                                                    <center style={{ fontSize: "20px" }}>
                                                                        No data found !!!
                                                                    </center>
                                                                </td>
                                                            </tr>
                                                        </React.Fragment>
                                                    )}
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <p>
                            <div className="row">
                                <div className="col-md-2">
                                    <span>Project ID</span>
                                </div>
                                <div className="col-md-2">
                                    {this.state.projectId}
                                </div>
                            </div>


                        </p>
                        {Object.keys(this.state.projectDetails).length > 0 ? <>
                            <p>
                                <div className="row">
                                    <div className="col-md-2">
                                        <span>Word Count</span>
                                    </div>
                                    <div className="col-md-2">
                                        {this.state.projectDetails.wordCount}
                                    </div>
                                </div>
                            </p>
                            {this.state.projectDetails.isDtp === 1 ? <>
                                {/* <p>
                                        <span>DTP Hours</span>
                                    </p> */}
                                <p>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <span>DTP Hours</span>
                                        </div>
                                        <div className="col-md-2">
                                            <input
                                                type="text"
                                                value={this.state.bidDtpHour}
                                                name="subTask_notes"
                                                placeholder="Enter"
                                                className="in-field2"
                                                onChange={(e) => { this.handleDtpHr(e) }}
                                            />
                                        </div>
                                    </div>
                                </p>
                                <p>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <span>DTP Unit</span>
                                        </div>
                                        <div className="col-md-2">
                                            <input
                                                type="text"
                                                value={this.state.bidDtpUnit}
                                                name="subTask_notes"
                                                placeholder="Enter"
                                                className="in-field2"
                                                onChange={(e) => { this.handleDtpUnitCost(e) }}
                                            />
                                        </div>
                                    </div>
                                </p>
                            </> : <></>
                            }
                            <p>
                                <div className="row">
                                    <div className="col-md-2">
                                        <span>Propose New Deadline</span>
                                    </div>
                                    <div className="col-md-8">
                                        <div
                                            className="input-group"
                                            style={{
                                                width: "35%",
                                                borderRadius: "9px",
                                                height: "43px",
                                                border: "1px solid #ced4da",
                                                boxShadow:
                                                    "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                            }}
                                        >
                                            <div
                                                style={{ width: "80%", padding: "8px", }}>
                                                <span>{this.state.bidProposeDeadline}</span>
                                            </div>
                                            <div style={{ width: "20%" }}>
                                                <a style={{ float: "right" }}>
                                                    <DatePicker
                                                        dropdownMode="select"
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        adjustDateOnChange
                                                        minDate={new Date()}
                                                        onChange={(date) => this.proposeDateChange(date)}
                                                        customInput={<Schedule />}
                                                    // disabled
                                                    />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </p> </> : <></>
                        }

                        <div className="translation_table">
                            <div className="task_table">
                                <div class="tsk-col _fl m30">
                                    {Object.keys(this.state.projectDetails).length > 0 ? <>
                                        <h3>
                                            Task {this.state.projectDetails.taskNo} : {this.state.projectDetails.name}
                                        </h3>
                                        <ul>
                                            <li
                                                data-toggle="tooltip"
                                                title={this.state.projectDetails.sourceLanguage}
                                            >
                                                <a
                                                    href="javascript:void(0)"
                                                    style={{ textDecoration: "none" }}
                                                >
                                                    {textTruncate(this.state.projectDetails.sourceLanguage, 10)}
                                                </a>
                                            </li>
                                            <li
                                                data-toggle="tooltip"
                                                title={this.state.projectDetails.targetLanguage}
                                            >
                                                <a
                                                    href="javascript:void(0)"
                                                    style={{ textDecoration: "none" }}
                                                >
                                                    {textTruncate(this.state.projectDetails.targetLanguage, 10)}
                                                </a>
                                            </li>
                                        </ul>
                                    </> : <></>}

                                </div>
                            </div>
                            <table style={{ border: "none", width: "100%" }}>
                                <tr>
                                    <td style={{ width: "25%" }}>
                                        <span
                                            style={{
                                                // color: "#6aa881",
                                                fontSize: "22px",
                                                // fontWeight: "800",
                                            }}
                                        >
                                            Unit / Word :
                                        </span>
                                    </td>
                                    <td style={{ width: "25%" }}>
                                        <input
                                            type="text"
                                            value={this.state.bidUnitPerWord}
                                            name="bidUnitPerWord"
                                            placeholder="Enter"
                                            className="in-field2"
                                            onChange={(e) => { this.handleUnitPerWord(e) }}
                                        />
                                    </td>
                                    <td style={{ width: "25%" }}></td>
                                    <td style={{ width: "25%" }}></td>
                                </tr>
                            </table>

                            <div className="row" style={{ paddingTop: "5%" }}>
                                <div className="col-md-3">
                                    <span
                                        style={{
                                            color: "#6aa881",
                                            fontSize: "22px",
                                            fontWeight: "800",
                                        }}>Total Bid </span>
                                </div>
                                <div className="col-md-8">
                                    <span
                                        style={{
                                            color: "#6aa881",
                                            fontSize: "22px",
                                            fontWeight: "800",
                                        }}
                                    >
                                        $ {this.state.totalBidAmount}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="_button-style m30 _fl text-center">
                            <a
                                href="javascript:void(0)"
                                className="white-btn"
                                style={{ textDecoration: "none" }}
                                onClick={() => this.handleClose()}
                            >
                                Cancel
                            </a>
                            <a
                                href="#"
                                className="blue-btn"
                                style={{ textDecoration: "none", color: "#fff" }}
                                onClick={this.bidSent}
                            >
                                Sent
                            </a>
                        </div>
                    </Box>
                </Modal>
                <Modal
                    open={this.state.cancelModal}
                    onClose={this.handleCloseCancelModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={styleCancelModal}>
                        <div className="cancel-job-head">
                            <div className="row">
                                <div className="col-md-12">
                                    <h2>
                                        Cancel Project{" "}
                                        <span style={{ fontSize: "17px", marginLeft: "7px" }}>
                                            (Translation)
                                        </span>
                                    </h2>
                                    <button className="close-page">
                                        <img
                                            src={ImageName.IMAGE_NAME.CLOSE_BTN_3}
                                            onClick={() => this.handleCloseCancelModal()}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="row" style={{ padding: "15px 30px" }}>
                            <div className="web-form-app">
                                <div className="col-md-12">
                                    <div className="web-form-bx">
                                        <div className="frm-label lblSize">
                                            Reason*
                                        </div>
                                        <div className="form-input-fields">
                                            <textarea
                                                value={this.state.cancelReason}
                                                placeholder=""
                                                className="in-textarea msg min table-style"
                                                onChange={this.onOtherReasonChange}
                                                style={{ resize: "none" }}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="web-form-bx selct">
                                        <div className="_button-style _fl text-center">
                                            <a
                                                href="javascript:void(0)"
                                                className="white-btn"
                                                onClick={() => this.handleCloseCancelModal()}
                                                style={{ textDecoration: "none" }}
                                            >
                                                cancel
                                            </a>
                                            <a
                                                href="javascript:void(0)"
                                                className="blue-btn"
                                                style={{ textDecoration: "none", color: "#fff" }}
                                                onClick={() => this.onDeclineProject()}
                                            >
                                                submit
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Modal>
                <Modal
                    open={this.state.vendorDocumentModal}
                    onClose={this.closeVendorDocumentModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={styleCancelModal}>
                        <div className="doc_action_modal">
                            <div className="row">
                                <div className="web-form-bx">
                                    Documents :
                                </div>
                                {this.state.docModalData.length > 0 ? <React.Fragment>
                                    {this.state.docModalData.map((data, i) => (
                                        <div className="col-md-2" style={{ paddingTop: "10px" }}>
                                            <div
                                                className="docModalCrossBtn"
                                                onClick={() => this.deleteModalDocs(i)}
                                            >
                                                <img src={ImageName.IMAGE_NAME.CROSS_BTN} />
                                            </div>
                                            <img
                                                style={{
                                                    cursor: "pointer",
                                                    margin: "auto",
                                                    width: "25px",
                                                }}
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title={data}
                                                src={ImageName.IMAGE_NAME.UPLOADED_FILE}
                                            />
                                        </div>
                                    ))}</React.Fragment> :
                                    <React.Fragment></React.Fragment>
                                }
                                <div className="col-md-2" style={{ paddingTop: "10px" }}>
                                    <div className="upload-profile">
                                        <label
                                            for={"doc_image"}
                                        // data-toggle="tooltip"
                                        // data-placement="top"
                                        // title={data.uploadName}
                                        // style={{ cursor: "pointer" }}
                                        >
                                            <img
                                                style={{
                                                    cursor: "pointer",
                                                    margin: "auto",
                                                }}
                                                src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                                            />
                                            <input
                                                type="file"
                                                id={"doc_image"}
                                                style={{ display: "none" }}
                                                onChange={(e) => {
                                                    this.onUploadDocument(e, this.state.docModalIndex);
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="row ven-doc-notes">
                                <div className="web-form-bx">
                                    Notes :
                                    <div className="form-input-fields">
                                        <textarea
                                            value={this.state.vendorDocumentsNotes}
                                            placeholder=""
                                            className="in-textarea msg min table-style"
                                            onChange={this.vendorDocumentNotesChange}
                                            style={{ resize: "none" }}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="web-form-bx selct">
                                        <div className="_button-style _fl text-center">
                                            <a
                                                href="javascript:void(0)"
                                                className="white-btn"
                                                onClick={() => this.closeVendorDocumentModal()}
                                                style={{ textDecoration: "none" }}
                                            >
                                                close
                                            </a>
                                            <a
                                                href="javascript:void(0)"
                                                className="blue-btn"
                                                style={{ textDecoration: "none", color: "#fff" }}
                                                onClick={() => this.submitVendorDocument()}
                                            >
                                                submit
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Modal>
            </React.Fragment>
        )
    }
}

class Schedule extends React.Component {
    render() {
        const { onClick } = this.props;
        return (
            <img
                style={{
                    width: "35px",
                    height: "37px",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
                src={ImageName.IMAGE_NAME.CALENDER4}
                onClick={onClick}
            />
        );
    }
}