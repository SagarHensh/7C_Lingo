import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { AlertMessage, ImageName } from "../../../enums";
import history from "../../../history";
import { Decoder } from "../../../services/auth";
import { consoleLog, getClientInfo, getLanguageArray, SetDatabaseDateFormat, SetUSAdateFormat } from "../../../services/common-function";
import { APP_URL } from "../../../services/config";
import { ErrorCode, UsersEnums } from "../../../services/constant";
import { ApiCall } from "../../../services/middleware";
import { inputEmptyValidate } from "../../../validators";
import { MultiSelectBox, SelectBox } from "../../Admin/SharedComponents/inputText";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../Admin/ManageProjects/CreateNewTranslation/createProject.css";
import "../../../css/createnewjob.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "20%",
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
    borderRadius: "10px"
};


export default class TranslationModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allClientArr: [],
            selectedClient: {},
            client: "",
            service: 46,
            deadline: "",
            isDtpFormat: false,
            targetAudience: "",
            description: "",
            translationProjectArr: [
                {
                    selectedServiceType: {},
                    serviceType: "",
                    selectedSourceLanguage: {
                        label: "English",
                        value: 110,
                    },
                    sourceLanguage: 110,
                    selectedTargetLanguage: [],
                    targetLanguage: [],
                    selectedDocumentType: {},
                    documentType: ".docx",
                    documentName: "",
                    note: "",
                    uploadName: [],
                    isUpload: false,

                    userType: 0,
                },
            ],
            allTranslationService: [],
            allLanguageArr: [],
            allDocumentType: [
                {
                    label: ".pdf",
                    value: ".pdf",
                },
                {
                    label: ".docx",
                    value: ".docx",
                },
                {
                    label: ".xlsx",
                    value: ".xlsx",
                },
                {
                    label: ".csv",
                    value: ".csv",
                },
                {
                    label: ".pptx",
                    value: ".pptx",
                },
                {
                    label: ".txt",
                    value: ".txt",
                },
            ],
            docModalData: [],
            docModalIndex: "",

            open: false,
        };
    }

    componentDidMount() {
        // document.getElementById("backdrop").style.display = "none";

        // ......................................................

        // var classInstance = this;
        // var docModal = document.getElementById("doc-modal");
        // window.onclick = function (event) {
        //     if (event.target === docModal) {
        //         classInstance.closeDocModal();
        //     }
        // };


        if (this.props.value.clientId) {
            this.setState({
                client: this.props.value.clientId
            })
        }

        this.onLoad();
    }

    onLoad = async () => {
        let allTranslationService = [],
            allLanguageArr = [];


        allLanguageArr = await getLanguageArray();
        consoleLog("Translation tab Language::", allLanguageArr)

        this.setState({
            allLanguageArr: allLanguageArr,
        });

        axios.post(APP_URL.VENDOR_SERVICE_OFFERED).then((res) => {
            // console.log("RES>>>>", res);
            let respObject = res.data;
            if (
                respObject.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                respObject.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
            ) {
                let payload = Decoder.decode(respObject.data.payload);
                // console.log("service response payload>>>", payload);
                if (payload.data) {
                    if (payload.data.services) {
                        if (payload.data.services.length > 0) {
                            payload.data.services.map((ser) => {
                                if (
                                    ser.id === 46 &&
                                    ser.name === "Translation" &&
                                    ser.subItem.length > 0
                                ) {
                                    ser.subItem.map((item) => {
                                        allTranslationService.push({
                                            label: item.subItemName,
                                            value: item.id,
                                        });
                                    });
                                    // console.log("ARRAY>>>",allTranslationService )

                                    this.setState({
                                        allTranslationService: allTranslationService,
                                    });
                                }
                            });
                        }
                    }
                }
            }
        });
    };

    clientChange = (value) => {
        // console.log("selected Client",value);
        this.setState({
            selectedClient: value,
            client: value.value,
        });
    };

    addTranslationArr = () => {
        let arr = this.state.translationProjectArr;
        arr.push({
            selectedServiceType: {},
            serviceType: "",
            selectedSourceLanguage: {
                label: "English",
                value: 110,
            },
            sourceLanguage: 110,
            selectedTargetLanguage: [],
            targetLanguage: [],
            selectedDocumentType: {},
            documentType: ".docx",
            documentName: "",
            note: "",
            uploadName: [],
            isUpload: false,
        });

        this.setState({
            translationProjectArr: arr,
        });
    };

    deadlineDateChange = (date) => {
        this.setState({
            deadline: SetUSAdateFormat(date),
        });
    };

    dtpFormatChange = (e) => {
        // console.log("e.target.value", e.target.value);
        if (e.target.value === "yes") {
            this.setState({
                isDtpFormat: true,
            });
        } else {
            this.setState({
                isDtpFormat: false,
            });
        }
    };

    targetAudienceChange = (e) => {
        this.setState({
            targetAudience: e.target.value,
        });
    };

    descriptionChange = (e) => {
        this.setState({
            description: e.target.value,
        });
    };

    serviceChange = (value, i) => {
        let arr = this.state.translationProjectArr;
        arr[i].selectedServiceType = value;
        arr[i].serviceType = value.value;

        this.setState({
            translationProjectArr: arr,
        });
    };

    sourceLanguageChange = (value, i) => {
        let arr = this.state.translationProjectArr;
        arr[i].selectedSourceLanguage = value;
        arr[i].sourceLanguage = value.value;

        this.setState({
            translationProjectArr: arr,
        });
    };

    targetLanguageChange = (value, i) => {
        let arr = this.state.translationProjectArr,
            brr = [];

        value.map((data) => {
            brr.push(data.value);
        });
        arr[i].selectedTargetLanguage = value;
        arr[i].targetLanguage = brr;

        this.setState({
            translationProjectArr: arr,
        });
    };

    documentTypeChange = (value, i) => {
        let arr = this.state.translationProjectArr;
        arr[i].selectedDocumentType = value;
        arr[i].documentType = value.value;

        this.setState({
            translationProjectArr: arr,
        });
    };

    documentNameChange = (e, i) => {
        // console.log("Text value>>>", e.target.value, i)
        let arr = this.state.translationProjectArr;
        arr[i].documentName = e.target.value;

        this.setState({
            translationProjectArr: arr,
        });
    };

    noteChange = (e, i) => {
        // console.log("Text value>>>", e.target.value, i)
        let arr = this.state.translationProjectArr;
        arr[i].note = e.target.value;

        this.setState({
            translationProjectArr: arr,
        });
    };

    // ...............document....................
    onUploadDocument = (e, i) => {
        // console.log("position:", i)
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        axios.post(APP_URL.IMAGE_URL, formData).then((res) => {
            // console.log("doc res>>>", res.data.data);
            // this.setState({
            //     //   imagePath: res.data.data.url,
            //     uploadName: res.data.data.path + res.data.data.filename,
            // });

            if (res.data.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR) {
                let arr = this.state.translationProjectArr;
                arr[i].isUpload = true;
                arr[i].uploadName.push(res.data.data.path + res.data.data.filename);
                this.setState({
                    translationProjectArr: arr,
                    docModalData: arr[i].uploadName,
                });
                toast.success(AlertMessage.MESSAGE.DOCUMENT.DOCUMENT_UPLOAD_SUCCESS, {
                    hideProgressBar: true,
                });
            }
        });
    };

    removeObject = (i) => {
        let arr = this.state.translationProjectArr;
        arr.splice(i, 1);
        this.setState({
            translationProjectArr: arr,
        });
    };

    onSubmit = async () => {

        // this.props.closeModal();
        let arr = [];

        let errorCount = 0;
        let validateDeadline = inputEmptyValidate(this.state.deadline),
            // validateClient = inputEmptyValidate(this.state.client),
            validateDtpFormat = inputEmptyValidate(this.state.isDtpFormat),
            validateTargetAudience = inputEmptyValidate(this.state.targetAudience),
            validateDescription = inputEmptyValidate(this.state.description);


        if (validateDeadline === false) {
            toast.error("Please enter Deadline Date !!");
            errorCount++;

        } else if (validateDtpFormat === false) {
            toast.error("Please select DTP Formatting required or not !!");
            errorCount++;

        } else if (validateTargetAudience === false) {
            toast.error("Please enter Target Audience !!");
            errorCount++;

        } else if (validateDescription === false) {
            toast.error("Please enter Description !!");
            errorCount++;

        }

        if (errorCount === 0) {

            this.state.translationProjectArr.map((data, i) => {
                if (data.serviceType === "") {
                    toast.error("Please enter service type at row " + i + 1);
                    return false;
                } else if (data.targetLanguage.length < 1) {
                    toast.error("Please enter target language at row" + i + 1);
                    return false;
                } else {
                    arr.push({
                        serviceTypeId: data.serviceType,
                        sourceLanguageId: data.sourceLanguage,
                        targetLanguageId: data.targetLanguage.join(","),
                        documentType: data.documentType,
                        documentName: data.documentName,
                        documentPath: data.uploadName,
                        notes: data.note,
                    });
                }
            });
            let finalData = {
                clientId: this.state.client,
                serviceTypeId: this.state.service,
                isDtp: this.state.isDtpFormat ? "1" : "0",
                targetAudience: this.state.targetAudience,
                expectedDeadline: SetDatabaseDateFormat(this.state.deadline),
                description: this.state.description,
                otherData: arr,
            };

            console.log("Final translation Data>>>", finalData);

            let res = await ApiCall("createTranslationFromClientRFQ", finalData);
            if (
                res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
            ) {
                toast.success("New request created successfully");
                this.props.closeModal();
            } else {
                toast.error(res.message);
            }
        }
    };

    // .............filter modal function...................
    openDocModal = () => {
        document.getElementById("backdrop").style.display = "block";
        document.getElementById("doc-modal").style.display = "block";
        document.getElementById("doc-modal").classList.add("show");
    };

    closeDocModal = () => {
        document.getElementById("backdrop").style.display = "none";
        document.getElementById("doc-modal").style.display = "none";
        document.getElementById("doc-modal").classList.remove("show");
    };

    showDocument = (i) => {
        let arr = this.state.translationProjectArr;
        this.setState({
            docModalData: arr[i].uploadName,
            docModalIndex: i,
        });
        // this.openDocModal();
        this.setState({
            open: true
        })
    };

    deleteModalDocs = (i) => {
        let arr = this.state.docModalData;
        arr.splice(i, 1);
        this.setState({
            docModalData: arr,
        });
    };

    handleClose = () => {
        this.setState({
            open: false
        })
    }
    render() {
        return (
            <React.Fragment>
                {/* <ToastContainer hideProgressBar theme="colored" /> */}
                <div className="createform-box sdw _fl">
                    <div className="create-head">
                        <div className="row">
                            <div className="col-md-6">
                                <h2>
                                    <a
                                        href="javascript:void(0)"

                                        style={{ textDecoration: "none" }}
                                    >
                                        Translation Creation
                                    </a>
                                </h2>
                            </div>
                            <div className="col-md-6">
                                <div className="web_btn f-right">
                                    <a
                                        href="javascript:void(0)"
                                        style={{ textDecoration: "none" }}
                                    >
                                        RESET
                                    </a>
                                    <a
                                        href="javascript:void(0)"
                                        className="blue"
                                        style={{ textDecoration: "none" }}
                                        onClick={this.onSubmit}
                                    >
                                        SUBMIT
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="create-jeneral-wrap _fl">
                        <div className="create-row-app">
                            <div className="row">
                                <div className="col-md-6 wt-left">
                                    <div className="web-form-app">
                                        <div className="web-form-bx">
                                            <div className="frm-label">Expected Deadline *</div>

                                            <div className="input-group" style={{ width: "100%", borderRadius: "9px", height: "43px", border: "1px solid #ced4da", boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)" }}>
                                                <div style={{ width: "80%", padding: "8px" }}>
                                                    <span>{this.state.deadline}</span>
                                                </div>
                                                <div style={{ width: "20%" }}>
                                                    <a style={{ float: "right" }}><DatePicker minDate={new Date()} onChange={(date) => this.deadlineDateChange(date)} customInput={(<Schedule />)} /></a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="web-form-bx">
                                            <div className="frm-label">
                                                Who is the target audience of this projects? *
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Enter name"
                                                className="in-field2"
                                                onChange={this.targetAudienceChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 wt-right">
                                    <div className="web-form-app">
                                        <div className="web-form-bx">
                                            <div className="frm-label">
                                                Is DTP formatting Required? *
                                            </div>
                                            <div className="check-field">
                                                <label className="checkbox_btn">
                                                    {this.state.isDtpFormat ? (
                                                        <input
                                                            type="radio"
                                                            name="radio"
                                                            value="yes"
                                                            checked={true}
                                                            onChange={this.dtpFormatChange}
                                                        />
                                                    ) : (
                                                        <input
                                                            type="radio"
                                                            name="radio"
                                                            value="yes"
                                                            checked={false}
                                                            onChange={this.dtpFormatChange}
                                                        />
                                                    )}
                                                    <span className="checkmark3"></span> Yes
                                                </label>
                                            </div>
                                            <div className="check-field">
                                                <label className="checkbox_btn">
                                                    {this.state.isDtpFormat ? (
                                                        <input
                                                            type="radio"
                                                            name="radio"
                                                            value="no"
                                                            checked={false}
                                                            onChange={this.dtpFormatChange}
                                                        />
                                                    ) : (
                                                        <input
                                                            type="radio"
                                                            name="radio"
                                                            value="no"
                                                            checked={true}
                                                            onChange={this.dtpFormatChange}
                                                        />
                                                    )}
                                                    <span className="checkmark3"></span> No
                                                </label>
                                            </div>
                                        </div>
                                        <div className="web-form-bx">
                                            <div className="frm-label">Description *</div>
                                            <div className="form-input-fields">
                                                <textarea
                                                    placeholder=""
                                                    className="in-textarea msg min"
                                                    onChange={this.descriptionChange}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <table className="dataTable_project">
                            <tr>
                                <th style={{ width: "14%" }}>Service Type</th>
                                <th style={{ width: "20%", paddingLeft: "2%" }}>
                                    Source Language
                                </th>
                                <th style={{ width: "20%", paddingLeft: "2%" }}>
                                    Target Language
                                </th>
                                {/* <th style={{ width: "14%", paddingLeft: "2%" }}>
                                          Document Type
                                      </th> */}
                                <th style={{ width: "15%", paddingLeft: "2%" }}>
                                    Document Name
                                </th>
                                <th style={{ width: "15%", paddingLeft: "2%" }}>Add Notes</th>
                                <th style={{ width: "8%", paddingLeft: "2%" }}>
                                    Upload Document
                                </th>
                                <th style={{ width: "8%", paddingLeft: "2%" }}></th>
                            </tr>
                            {this.state.translationProjectArr.map((data, i) => (
                                <tr key={i}>
                                    <td style={{ width: "14%" }}>
                                        <SelectBox
                                            optionData={this.state.allTranslationService}
                                            value={data.selectedServiceType}
                                            onSelectChange={(value) => this.serviceChange(value, i)}
                                        ></SelectBox>
                                    </td>
                                    <td style={{ width: "20%", paddingLeft: "2%" }}>
                                        <SelectBox
                                            optionData={this.state.allLanguageArr}
                                            value={data.selectedSourceLanguage}
                                            onSelectChange={(value) =>
                                                this.sourceLanguageChange(value, i)
                                            }
                                        ></SelectBox>
                                    </td>
                                    <td style={{ width: "20%", paddingLeft: "2%" }}>
                                        <MultiSelectBox
                                            optionData={this.state.allLanguageArr}
                                            value={data.selectedTargetLanguage}
                                            onSelectChange={(value) =>
                                                this.targetLanguageChange(value, i)
                                            }
                                        ></MultiSelectBox>
                                    </td>
                                    {/* <td style={{ width: "14%", paddingLeft: "2%" }}>
                                              <SelectBox
                                                  optionData={this.state.allDocumentType}
                                                  value={data.selectedDocumentType}
                                                  onSelectChange={(value) => this.documentTypeChange(value, i)}
                                              >
                                              </SelectBox>
                                          </td> */}
                                    <td style={{ width: "15%", paddingLeft: "2%" }}>
                                        <input
                                            type="text"
                                            className="in-field3"
                                            placeholder="Enter Name"
                                            onChange={(e) => {
                                                this.documentNameChange(e, i);
                                            }}
                                        />
                                    </td>
                                    <td style={{ width: "15%", paddingLeft: "2%" }}>
                                        <input
                                            type="text"
                                            className="in-field3"
                                            placeholder="Enter Notes"
                                            onChange={(e) => {
                                                this.noteChange(e, i);
                                            }}
                                        />
                                    </td>
                                    <td
                                        style={{
                                            width: "8%",
                                            paddingLeft: "2%",
                                            textAlign: "center",
                                        }}
                                    >
                                        {data.uploadName.length > 0 ? (
                                            <React.Fragment>
                                                <img
                                                    style={{
                                                        cursor: "pointer",
                                                        margin: "auto",
                                                        width: "25px",
                                                    }}
                                                    src={ImageName.IMAGE_NAME.UPLOADED_FILE}
                                                    onClick={() => this.showDocument(i)}
                                                />
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <div className="upload-profile">
                                                    <label
                                                        for={"profile_image" + i}
                                                        data-toggle="tooltip"
                                                        data-placement="top"
                                                        title={data.uploadName}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {/* {data.isUpload ? (
                                                          <React.Fragment>
                                                              {" "}
                                                              <img
                                                                  style={{
                                                                      cursor: "pointer",
                                                                      margin: "auto",
                                                                      width: "25px"
                                                                  }}
                                                                  src={ImageName.IMAGE_NAME.UPLOADED_FILE}
                                                              />
                                                          </React.Fragment>
                                                      ) : (
                                                          <React.Fragment>
                                                              <img
                                                                  style={{
                                                                      cursor: "pointer",
                                                                      margin: "auto"
                                                                  }}
                                                                  src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                                                              />
                                                          </React.Fragment>
                                                      )} */}
                                                        <img
                                                            style={{
                                                                cursor: "pointer",
                                                                margin: "auto",
                                                            }}
                                                            src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                                                        />
                                                        {/* <span id="wait">Add File</span> */}
                                                        {/* <form method="post" action="" enctype="multipart/form-data" id="profileform"> */}
                                                        <input
                                                            type="file"
                                                            id={"profile_image" + i}
                                                            style={{ display: "none" }}
                                                            onChange={(e) => {
                                                                this.onUploadDocument(e, i);
                                                            }}
                                                        />
                                                        {/* </form> */}
                                                    </label>
                                                </div>
                                            </React.Fragment>
                                        )}
                                    </td>
                                    <td
                                        style={{
                                            width: "8%",
                                            paddingLeft: "2%",
                                            paddingTop: "1px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {i > 0 ? (
                                            <img
                                                src={ImageName.IMAGE_NAME.CANCEL_BTN}
                                                style={{ cursor: "pointer" }}
                                                alt=""
                                                onClick={() => this.removeObject(i)}
                                            />
                                        ) : (
                                            <React.Fragment></React.Fragment>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </table>

                        <div className="_fl">
                            <div className="row">
                                <div className="col-md-12 text-center">
                                    <button
                                        className="add_more_project_btn"
                                        onClick={this.addTranslationArr}
                                    >
                                        ADD MORE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="m20">
                        <div className="text-center">
                            <button type="submit" className="cn_btn">
                                RESET
                            </button>
                            <button
                                type="submit"
                                className="sv_btn"
                                onClick={() => {
                                    this.onSubmit();
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>

                {/* ..................... Document show Modal............... */}
                {/* <div id="doc-modal" className="modal fade modelwindow" role="dialog">
                    <div className="modal-dialog modal-sm modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="row">
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
                                    ))}
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
                            </div>
                        </div>
                    </div>
                </div> */}

                <Modal
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="modal-modal-title-doc"
                    aria-describedby="modal-modal-description-doc"
                >
                    <Box sx={style}>
                        <div className="row">
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
                            ))}
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
                    </Box>
                </Modal>
                {/* <div
                    className="modal-backdrop fade show"
                    id="backdrop"
                    style={{ display: "none" }}
                ></div> */}
            </React.Fragment>
        )
    }
}

class Schedule extends React.Component {
    render() {
        const { onClick } = this.props;
        return (
            <img style={{ width: "35px", height: "37px", borderRadius: "4px", cursor: "pointer" }} src={ImageName.IMAGE_NAME.CALENDER4} onClick={onClick} />
        );
    }
}