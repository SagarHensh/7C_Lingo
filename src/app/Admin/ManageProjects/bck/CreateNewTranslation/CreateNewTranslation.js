import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "../../../../css/createnewjob.css";
import { AlertMessage, ImageName } from "../../../../enums";
import history from "../../../../history";
import { Decoder } from "../../../../services/auth";
import { getClientInfo, getLanguageArray, SetDOBFormat } from "../../../../services/common-function";
import { APP_URL } from "../../../../services/config";
import { ErrorCode, UsersEnums } from "../../../../services/constant";
import { ApiCall } from "../../../../services/middleware";
import { MultiSelectBox, SelectBox } from "../../SharedComponents/inputText";
import "./createProject.css";

export default class CreateNewTranslation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allClientArr: [],
            selectedClient: {},
            client: '',
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
                        value: 110
                    },
                    sourceLanguage: 110,
                    selectedTargetLanguage: [],
                    targetLanguage: [],
                    selectedDocumentType: {},
                    documentType: ".docx",
                    documentName: "",
                    note: "",
                    uploadName: "",
                    isUpload: false,

                    userType:0
                }
            ],
            allTranslationService: [],
            allLanguageArr: [],
            allDocumentType: [{
                label: ".pdf",
                value: ".pdf"
            }, {
                label: ".docx",
                value: ".docx"
            }, {
                label: ".xlsx",
                value: ".xlsx"
            }, {
                label: ".csv",
                value: ".csv"
            }, {
                label: ".pptx",
                value: ".pptx"
            }, {
                label: ".txt",
                value: ".txt"
            }]
        }

        this.onLoad();
    }

    componentDidMount(){
        let authData = localStorage.getItem("AuthToken");
        let authUser = Decoder.decode(authData);
        // consoleLog("auth::::", authUser);
    
        if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT) {
          this.setState({
            userType: UsersEnums.APPLICATION_ROLE.CLIENT,
          });
        } else if (
          authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN
        ) {
          this.setState({
            userType: UsersEnums.APPLICATION_ROLE.SUPER_ADMIN,
          });
        }
    }

    onLoad = async () => {
        let allClientArr = [],
            allTranslationService = [],
            allLanguageArr = [];

        allClientArr = await getClientInfo();

        allLanguageArr = await getLanguageArray();

        this.setState({
            allClientArr: allClientArr,
            allLanguageArr: allLanguageArr
        })

        axios.post(APP_URL.VENDOR_SERVICE_OFFERED).then(res => {
            // console.log("RES>>>>", res);
            let respObject = res.data;
            if (respObject.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                respObject.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let payload = Decoder.decode(respObject.data.payload);
                // console.log("service response payload>>>", payload);
                if (payload.data) {
                    if (payload.data.services) {
                        if (payload.data.services.length > 0) {
                            payload.data.services.map((ser) => {
                                if (ser.id === 46 && ser.name === "Translation" && ser.subItem.length > 0) {
                                    ser.subItem.map((item) => {
                                        allTranslationService.push({
                                            label: item.subItemName,
                                            value: item.id
                                        })
                                    })
                                    // console.log("ARRAY>>>",allTranslationService )

                                    this.setState({
                                        allTranslationService: allTranslationService
                                    })
                                }
                            })
                        }
                    }
                }
            }
        });
    }

    clientChange = (value) => {
        // console.log("selected Client",value);
        this.setState({
            selectedClient: value,
            client: value.value
        });
    }

    addTranslationArr = () => {
        let arr = this.state.translationProjectArr;
        arr.push({
            selectedServiceType: {},
            serviceType: "",
            selectedSourceLanguage: {
                label: "English",
                value: 110
            },
            sourceLanguage: 110,
            selectedTargetLanguage: [],
            targetLanguage: [],
            selectedDocumentType: {},
            documentType: ".docx",
            documentName: "",
            note: "",
            uploadName: "",
            isUpload: false
        })

        this.setState({
            translationProjectArr: arr
        })
    }

    deadlineDateChange = (e) => {
        this.setState({
            deadline: e.target.value
        })
    }

    dtpFormatChange = (e) => {
        // console.log("e.target.value", e.target.value);
        if (e.target.value === "yes") {
            this.setState({
                isDtpFormat: true
            })
        } else {
            this.setState({
                isDtpFormat: false
            })
        }
    }

    targetAudienceChange = (e) => {
        this.setState({
            targetAudience: e.target.value
        })
    }

    descriptionChange = (e) => {
        this.setState({
            description: e.target.value
        })
    }

    serviceChange = (value, i) => {
        let arr = this.state.translationProjectArr;
        arr[i].selectedServiceType = value;
        arr[i].serviceType = value.value;

        this.setState({
            translationProjectArr: arr
        })
    }

    sourceLanguageChange = (value, i) => {
        let arr = this.state.translationProjectArr;
        arr[i].selectedSourceLanguage = value;
        arr[i].sourceLanguage = value.value;

        this.setState({
            translationProjectArr: arr
        })
    }

    targetLanguageChange = (value, i) => {
        let arr = this.state.translationProjectArr,
            brr = [];

        value.map((data) => {
            brr.push(data.value)
        });
        arr[i].selectedTargetLanguage = value;
        arr[i].targetLanguage = brr

        this.setState({
            translationProjectArr: arr,
        })
    }

    documentTypeChange = (value, i) => {
        let arr = this.state.translationProjectArr;
        arr[i].selectedDocumentType = value;
        arr[i].documentType = value.value;

        this.setState({
            translationProjectArr: arr
        })
    }

    documentNameChange = (e, i) => {
        // console.log("Text value>>>", e.target.value, i)
        let arr = this.state.translationProjectArr;
        arr[i].documentName = e.target.value;

        this.setState({
            translationProjectArr: arr
        })
    }

    noteChange = (e, i) => {
        // console.log("Text value>>>", e.target.value, i)
        let arr = this.state.translationProjectArr;
        arr[i].note = e.target.value;

        this.setState({
            translationProjectArr: arr
        })
    }

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
                arr[i].uploadName = res.data.data.path + res.data.data.filename;
                this.setState({
                    translationProjectArr: arr,
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
            translationProjectArr: arr
        })
    }

    onSubmit = async () => {
        let authData = localStorage.getItem("AuthToken");
        let authUser = Decoder.decode(authData); 
        let arr = [];
        this.state.translationProjectArr.map((data) => {
            arr.push({
                serviceTypeId: data.serviceType,
                sourceLanguageId: data.sourceLanguage,
                targetLanguageId: data.targetLanguage.join(","),
                documentType: data.documentType,
                documentName: data.documentName,
                documentPath: data.uploadName,
                notes: data.note
            })
        })
        let finalData = {
            clientId: authUser.data.userid,
            serviceTypeId: this.state.service,
            isDtp: this.state.isDtpFormat ? "1" : "0",
            targetAudience: this.state.targetAudience,
            expectedDeadline: SetDOBFormat(this.state.deadline),
            description: this.state.description,
            otherData: arr
        }

        // console.log("Final translation Data>>>", finalData);

        let res = await ApiCall("createTranslation", finalData);
        if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            toast.success("New request created successfully");
            return history.push("/adminClientRfqList");
        } else {
            toast.error("Error occured!!!")
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
              <Link to="/adminDashboard">Dashboard</Link> / Create New Translation
            </div>
                    <div className="createform-box sdw _fl">
                        <div className="create-head">
                            <div className="row">
                                <div className="col-md-6">
                                    <h2><Link to="/adminDashboard" style={{ textDecoration: "none" }}>Translation Creation</Link></h2>
                                </div>
                                <div className="col-md-6">
                                    <div className="web_btn f-right">
                                        <a href="javascript:void(0)" style={{ textDecoration: "none" }}>RESET</a>
                                        <a href="javascript:void(0)" className="blue" style={{ textDecoration: "none" }} onClick={this.onSubmit}>SUBMIT</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="create-jeneral-wrap _fl">

                            <div className="create-row-app">
                                <div className="row">
                                    <div className="col-md-6 wt-left">
                                        <div className="web-form-app">
                                            {this.state.userType ===  UsersEnums.APPLICATION_ROLE.CLIENT ? (<React.Fragment/>
                                                
                                            ) : (<React.Fragment>
                                                <div className="web-form-bx">
                                                <div className="frm-label">Client</div>
                                                <div className="bts-drop">
                                                    <SelectBox
                                                        optionData={this.state.allClientArr}
                                                        value={this.state.selectedClient}
                                                        onSelectChange={(value) => this.clientChange(value)}
                                                    // isDisabled = {true}
                                                    >

                                                    </SelectBox>
                                                </div>
                                            </div>
                                            </React.Fragment>)}
                                           

                                            <div className="web-form-bx">
                                                <div className="frm-label">Expected Deadline</div>
                                                <div className="form-input-fields unstyled">
                                                    <input type="date" id="from_datepicker" className="textbox4 d-icon" placeholder="Select" onChange={this.deadlineDateChange} style={{ borderRadius: "9px", boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)" }} />
                                                </div>

                                            </div>
                                            <div className="web-form-bx">
                                                <div className="frm-label">Who is the target audience of this projects?</div>
                                                <input type="text" placeholder="Enter name" className="in-field2" onChange={this.targetAudienceChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 wt-right">
                                        <div className="web-form-app">
                                            <div className="web-form-bx">
                                                <div className="frm-label">Is DTP formatting Required?</div>
                                                <div className="check-field">
                                                    <label className="checkbox_btn">
                                                        {this.state.isDtpFormat ?
                                                            <input type="radio" name="radio" value="yes" checked={true} onChange={this.dtpFormatChange} /> :
                                                            <input type="radio" name="radio" value="yes" checked={false} onChange={this.dtpFormatChange} />
                                                        }
                                                        <span className="checkmark3"></span> Yes</label>
                                                </div>
                                                <div className="check-field">
                                                    <label className="checkbox_btn">
                                                        {this.state.isDtpFormat ?
                                                            <input type="radio" name="radio" value="no" checked={false} onChange={this.dtpFormatChange} /> :
                                                            <input type="radio" name="radio" value="no" checked={true} onChange={this.dtpFormatChange} />
                                                        }
                                                        <span className="checkmark3"></span> No</label>
                                                </div>
                                            </div>
                                            <div className="web-form-bx">
                                                <div className="frm-label">Description</div>
                                                <div className="form-input-fields">
                                                    <textarea placeholder="......." className="in-textarea msg min" onChange={this.descriptionChange}></textarea>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table className="dataTable_project">
                                <tr>
                                    <th style={{ width: "14%" }}>
                                        Service Type
                                    </th>
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
                                    <th style={{ width: "15%", paddingLeft: "2%" }}>
                                        Add Notes
                                    </th>
                                    <th style={{ width: "8%", paddingLeft: "2%" }}>
                                        Upload Document
                                    </th>
                                    <th style={{ width: "8%", paddingLeft: "2%" }}>

                                    </th>
                                </tr>
                                {this.state.translationProjectArr.map((data, i) =>
                                    <tr key={i}>
                                        <td style={{ width: "14%" }}>
                                            <SelectBox
                                                optionData={this.state.allTranslationService}
                                                value={data.selectedServiceType}
                                                onSelectChange={(value) => this.serviceChange(value, i)}
                                            >
                                            </SelectBox>
                                        </td>
                                        <td style={{ width: "20%", paddingLeft: "2%" }}>
                                            <SelectBox
                                                optionData={this.state.allLanguageArr}
                                                value={data.selectedSourceLanguage}
                                                onSelectChange={(value) => this.sourceLanguageChange(value, i)}
                                            >
                                            </SelectBox>
                                        </td>
                                        <td style={{ width: "20%", paddingLeft: "2%" }}>
                                            <MultiSelectBox
                                                optionData={this.state.allLanguageArr}
                                                value={data.selectedTargetLanguage}
                                                onSelectChange={(value) => this.targetLanguageChange(value, i)}
                                            >
                                            </MultiSelectBox>
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
                                            <input type="text" className="in-field3" placeholder="Enter Name" onChange={(e) => { this.documentNameChange(e, i) }} />
                                        </td>
                                        <td style={{ width: "15%", paddingLeft: "2%" }}>
                                            <input type="text" className="in-field3" placeholder="Enter Notes" onChange={(e) => { this.noteChange(e, i) }} />
                                        </td>
                                        <td style={{ width: "8%", paddingLeft: "2%", textAlign: "center" }}>
                                            {/* <img
                                                style={{
                                                    cursor: "pointer",
                                                    marginBottom: "10px",
                                                }}
                                                src={ImageName.IMAGE_NAME.UPLOADED_FILE}
                                            /> */}
                                            <div className="upload-profile">
                                                <label
                                                    for={"profile_image" + i}
                                                    // className="doc-sheet_project"
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title={data.uploadName}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {data.isUpload ? (
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
                                                    )}
                                                    {/* <span id="wait">Add File</span> */}
                                                    {/* <form method="post" action="" enctype="multipart/form-data" id="profileform"> */}
                                                    <input type="file" id={"profile_image" + i} style={{ display: "none" }} onChange={(e) => { this.onUploadDocument(e, i) }} />
                                                    {/* </form> */}
                                                </label>
                                            </div>
                                        </td>
                                        <td style={{ width: "8%", paddingLeft: "2%", paddingTop:"1px", textAlign: "center" }}>
                                            {i > 0 ?
                                                <img src={ImageName.IMAGE_NAME.CANCEL_BTN} style={{ cursor: "pointer" }} alt="" onClick={() => this.removeObject(i)} />
                                                : <React.Fragment></React.Fragment>
                                            }
                                        </td>
                                    </tr>
                                )}
                            </table>

                            <div className="_fl">
                                <div className="row">
                                    <div className="col-md-12 text-center">
                                        <button className="add_more_project_btn" onClick={this.addTranslationArr}>ADD MORE</button>
                                    </div>
                                </div>
                            </div>

                        </div>


                        <div className="row m20">
                            <div className="col-md-12 text-center">
                                <button type="submit" className="cn_btn">RESET</button>
                                <button type="submit" className="sv_btn" onClick={() => { this.onSubmit() }}>Submit</button>
                            </div>

                        </div>


                    </div>
                </div>
            </React.Fragment>
        )
    }
}