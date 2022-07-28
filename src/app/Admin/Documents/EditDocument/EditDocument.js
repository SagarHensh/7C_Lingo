import React, { Component } from "react";
import { styled, Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import { ToastContainer, toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";
import { ApiCall } from "../../../../services/middleware";
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import history from "../../../../history";
import {
  InputText,
  MultiSelectBox,
  SelectBox,
} from "../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../enums";
// import "./addAdminstaff.css";
import {
  alphaNumericValidator,
  departmentMobileValidator,
  departmentValidator,
  emailValidator,
  inputEmptyValidate,
  mobileNumberValidator,
  nameRegexValidator,
  numberValidator,
  passwordValidator,
} from "../../../../validators";
import { Regex } from "../../../../services/config";
import { Decoder } from "../../../../services/auth";
import {
  consoleLog,
  phoneNumberCheck,
} from "../../../../services/common-function";
import { ErrorCode } from "../../../../services/constant";
import ReactLoader from "../../../Loader";
import { IMAGE_URL } from "../../../../services/config/api_url";
import Multiselect from "multiselect-react-dropdown";
import { Link } from "react-router-dom";

// .................mui switch...................................
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 68,
  height: 28,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 25,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(42px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#335b7b",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 20,
    height: 22,
    borderRadius: 11,
    // transition: theme.transitions.create(["width"], {
    //   duration: 200,
    // }
    // ),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255,255,255,.35)" : "#993921",
    boxSizing: "border-box",
  },
}));

const statusArrData = [
  {
    label: "Sent",
    value: 1,
  },
  {
    label: "Signed",
    value: 0,
  },
];

const roleArr = [
  {
    label: "Client",
    value: 3,
  },
  {
    label: "Vendor",
    value: 4,
  },
];

export default class EditDocument extends Component {
  constructor(props) {
    super(props);
    let mainData = this.props.location;
    let preData = mainData.state;
    this.state = {
      isLoad: true,
      checkStatus: false,
      userTypeId: 0,
      docName: "",
      docType: "",
      role: "",
      intendedUser: "",
      roleTypeId: 0,
      purpose: "",
      message: "",
      status: "",
      docTypeArr: [],
      docTypeData: "",
      roleArr: [],
      roleData: "",

      purposeArr: [],
      purposeData: {},
      intendedUserArr: [],
      intendUserData: [],
      intendUserArrData: [],
      intendUserId: [],
      // intendUserId: preData.intendUser,
      intendId: [],
      intendedPreArrData: [],
      statusArr: [],
      statusData: "",
      statusId: 0,
      adminPhoto: "",
      checked: "",
      hidden: false,
      imagePath: "",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    let docTypeArr = [];
    let purposeArr = [],
      intenduserData = [],
      intendDataArr = [],
      intendMainArr = [],
      intendUserDataArr = [],
      docDetails = [],
      roleObjData = {},
      docTypeObjData = {},
      statusObjData = {},
      intendId = [],
      purposeObjData = {};
    // let d = {
    //   requsertype: 2,
    // };
    // let intendUseri = await ApiCall("fetchintentuserlist", d);

    // let userPayloadi = Decoder.decode(intendUseri.data.payload);

    let mainData = this.props.location;
    let preData = mainData.state;

    let objData = {
      documentid: preData.id,
    };

    let resData = await ApiCall("fetchdocumentdetails", objData);
    let docData = Decoder.decode(resData.data.payload);
    docDetails = docData.data.documentdetails;
    intenduserData = docData.data.intenduser;
    consoleLog("doc::::", docData.data);

    let ardoc = docDetails[0].documentPath.split("/");
    // consoleLog("arrayDoc::", ardoc)

    this.setState({
      docName: docDetails[0].name,
      role: preData.roleId,
      message: docDetails[0].message,
      statusArr: statusArrData,
      imagePath: docDetails[0].documentPath,
      adminPhoto: ardoc.length > 0 ? ardoc[2] : "",
    });

    if (
      this.state.adminPhoto !== "" &&
      this.state.adminPhoto !== undefined &&
      this.state.adminPhoto != null
    ) {
      this.setState({
        hidden: true,
      });
    } else {
      this.setState({
        hidden: false,
      });
    }

    let data = {};

    let res = await ApiCall("getLookUpData", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);

      let lookupdata = payload.data.lookupdata;

      let docTypeArrData = lookupdata.DOCUMENT_TYPE;
      let purposeArrData = lookupdata.PURPOSE_TYPE;

      docTypeArrData.map((data) => {
        docTypeArr.push({
          label: data.name,
          value: data.id,
        });
        if (docDetails[0].documentTypeId === data.id) {
          docTypeObjData = {
            label: data.name,
            value: data.id,
          };
        }
      });

      //   ..................purpose..........................

      purposeArrData.map((data) => {
        purposeArr.push({
          label: data.name,
          value: data.id,
        });
        if (data.id === docDetails[0].purposeTypeId) {
          purposeObjData = {
            label: data.name,
            value: data.id,
          };
        }
      });

      // .................intend userData.......................
      intenduserData.map((obj) => {
        intendUserDataArr.push({
          label: obj.name,
          value: obj.userId,
        });
      });

      //   ................role............................
      roleArr.map((obj) => {
        if (preData.roleId === obj.value) {
          roleObjData = {
            label: obj.label,
            value: obj.value,
          };
        }
      });

      let userData = {
        requsertype: parseInt(preData.roleId),
      };
      consoleLog("preData:", preData.roleId);
      if (
        preData.roleId !== null ||
        preData.roleId !== undefined ||
        preData.roleId !== ""
      ) {
        let intendUser = await ApiCall("fetchintentuserlist", userData);

        let userPayload = Decoder.decode(intendUser.data.payload);

        consoleLog("intendUser::", userPayload.data.intendlist);
        userPayload.data.intendlist.map((obj) => {
          // consoleLog(")))", obj);
          intendDataArr.push({
            label: obj.name,
            value: obj.userId,
          });
          intenduserData.map((obj1) => {
            if (obj.userId === obj1.userId) {
              intendMainArr.push({
                label: obj.name,
                value: obj.userId,
              });
              intendId.push(obj.userId);
            }
          });
        });
        // consoleLog("intend:::", intendId);
      }
      //   ............status........................

      statusArrData.map((data) => {
        if (data.value === docDetails[0].status) {
          statusObjData = {
            label: data.label,
            value: data.value,
          };
        }
      });

      // ...............................................

      // .....................................................

      this.setState({
        purposeArr: purposeArr,
        purposeData: purposeObjData,
        roleArr: roleArr,
        docTypeArr: docTypeArr,
        docTypeData: docTypeObjData,
        roleData: roleObjData,
        intendedUserArr: intendDataArr,
        intendUserData: intendMainArr,
        intendUserArrData: intendId,
        statusData: statusObjData,

        isLoad: false,
      });
    }
  };

  // ...............for tabs..........................

  onNameChange = (value) => {
    let nameCheck = alphaNumericValidator(value);

    this.setState({
      docName: nameCheck,
    });
  };
  onDocChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      docTypeData: obj,
    });
  };
  onRoleChange = async (dat) => {
    let intendDataArr = [];
    let obj = { label: dat.label, value: dat.value };

    let userData = {
      requsertype: parseInt(dat.value),
    };

    if (dat.value !== null || dat.value !== undefined || dat.value !== "") {
      let intendUser = await ApiCall("fetchintentuserlist", userData);

      let userPayload = Decoder.decode(intendUser.data.payload);

      // consoleLog("intendUser::", userPayload.data.intendlist);
      userPayload.data.intendlist.map((obj) => {
        intendDataArr.push({
          label: obj.name,
          value: obj.userId,
        });
      });

      this.setState({
        roleData: obj,
        intendedUserArr: intendDataArr,
      });
    }
  };
  onIntendUserChange = (data) => {
    let arr = [];
    data.map((obj) => {
      arr.push(obj.value);
    });
    this.setState({
      intendUserArrData: arr,
      intendUserData: data,
    });
  };
  onPurposeChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      purposeData: obj,
    });
  };

  onStatusChange = (dat) => {
    // consoleLog("status::",dat)
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      statusData: obj,
    });
  };

  // ...............document....................
  onProfileImage = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      this.setState({
        imagePath: res.data.data.path + res.data.data.filename,
        adminPhoto: res.data.data.filename,
      });

      if (res.data.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR) {
        this.setState({
          hidden: true,
        });
        toast.success(AlertMessage.MESSAGE.DOCUMENT.DOCUMENT_UPLOAD_SUCCESS, {
          hideProgressBar: true,
        });
      } else {
        this.setState({
          hidden: false,
        });
      }
    });
  };

  // ............................................
  onMessageChange = (e) => {
    this.setState({
      message: e.target.value,
    });
  };


  onNext = async () => {
    let mainData = this.props.location,
      preData = mainData.state;
    // let mobileNo = this.state.phone.substring(3, 14);
    let errorCount = 0;
    let validateName = inputEmptyValidate(this.state.docName);
    let validateNameLength = departmentValidator(this.state.docName);
    let validateRole = inputEmptyValidate(this.state.roleData.value);
    let validatedocType = inputEmptyValidate(this.state.docTypeData.value);
    let validatePurpose = inputEmptyValidate(this.state.purposeData.value);

    let validateStatus = inputEmptyValidate(this.state.statusData.value);
    if (validateName === false) {
      toast.error(AlertMessage.MESSAGE.DOCUMENT.DOCUMENT_NAME_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateNameLength === false) {
      toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    }


    else if (validatedocType === false) {
      toast.error(AlertMessage.MESSAGE.DOCUMENT.DROPDOWN_DOCTYPE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    else if (validateRole === false) {
      toast.error(AlertMessage.MESSAGE.DOCUMENT.DROPDOWN_SELECT_ROLE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // let validateUser = inputEmptyValidate(this.state.intendUserData);
    // let validateUser = inputEmptyValidate(this.state.intendUserId);
    // if (validateUser === false) {
    //   toast.error(AlertMessage.MESSAGE.DOCUMENT.DROPDOWN_INTENDED_USER_EMPTY, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // }

    else if (validatePurpose === false) {
      toast.error(AlertMessage.MESSAGE.DOCUMENT.DROPDOWN_PURPOSE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    else if (validateStatus === false) {
      toast.error(AlertMessage.MESSAGE.DOCUMENT.DROPDOWN_STATUS_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      // let intendIdsArr = [];

      // for (let i = 0; i < this.state.intendUserId.length; i++) {
      //   intendIdsArr.push(this.state.intendUserId[i].userId);
      // }

      let data = {
        documentid: preData.id,
        name: this.state.docName,
        documenttypeid: this.state.docTypeData.value,
        version: 1.0,
        usertyperoleid: this.state.roleData.value,
        purposetypeid: this.state.purposeData.value,
        message: this.state.message,
        documentpath: this.state.imagePath,
        status: this.state.statusData.value === 1 ? "sent" : "signed",
        intenduser: this.state.intendUserArrData,
      };

      // consoleLog("data:::", data);

      let res = await ApiCall("updatedocumentdetails", data);

      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(res.data.message, {
          hideProgressBar: true,
        });

        return history.push("/adminDocuments");
      } else {
        if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.DUPLICATE_DOCUMENT
        ) {
          toast.error(AlertMessage.MESSAGE.DOCUMENT.DOCUMENT_NAME_EXIST, {
            hideProgressBar: true,
          });
        }
      }
    }
  };
  //................func for modal move......
  handleMoveModalOpen = () => {
    this.setState({
      opendepartmentModal: true,
    });
  };
  handleMoveModalClose = () => {
    this.setState({
      opendepartmentModal: false,
    });
  };

  // .....................func for cancel btn......................

  onCancel = () => {
    history.push("/adminDocuments");
  };

  render() {
    return (
      <React.Fragment>
        {/* <div className="wrapper">
        <Header /> */}
        <ToastContainer hideProgressBar theme="colored"/>
        {/* <Sidebar /> */}
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>
        <div className="component-wrapper" hidden={this.state.isLoad}>
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            {" "}
            <Link to="/adminDashboard">Dashboard</Link> / <Link to="/adminDocuments">Document</Link> / Edit Document
          </div>
          <h3 className="dcs">EDIT DOCUMENT</h3>
          <div className="department-component-app _fl sdw">
            <h3 className="heading">DOCUMENT DETAILS</h3>
            <div className="department-form">
              <div className="row" style={{ marginTop: "45px" }}>
                <div className="col-md-9">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Document Name</span>
                        {/* <InputText
                      type="text"
                      placeholder="Steve"
                      className="in-field2"
                      value={this.state.uname}
                      onChange={(e) => this.onNameChange(e)}
                    /> */}
                        <InputText
                          placeholder=""
                          className="in-field2"
                          value={this.state.docName}
                          onTextChange={(value) => {
                            this.onNameChange(value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Document Type</span>
                        <div className="dropdwn">
                          <SelectBox
                            optionData={this.state.docTypeArr}
                            value={this.state.docTypeData}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onDocChange(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row" style={{ marginTop: "15px" }}>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Role</span>
                        <div className="dropdwn">
                          <SelectBox
                            optionData={this.state.roleArr}
                            value={this.state.roleData}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onRoleChange(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Intended User</span>
                        <MultiSelectBox
                          optionData={this.state.intendedUserArr}
                          placeholder="Select"
                          value={this.state.intendUserData}
                          onSelectChange={(value) =>
                            this.onIntendUserChange(value)
                          }
                        />
                        {/* <div className="dropdwn">
                          <Multiselect
                            options={this.state.intendedUserArr} // Options to display in the dropdown
                            selectedValues={this.state.intendedPreArrData} // Preselected value to persist in dropdown
                            onSelect={this.onSelect} // Function will trigger on select event
                            onRemove={this.onRemove} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                            showCheckbox
                          />
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div
                    className="profile-pic-data"
                    style={{ width: "225px", paddingTop: "25px" }}
                  >
                    <div className="doc_upload ad">
                      <label
                        htmlFor="file-upload"
                        data-toggle="tooltip"
                        data-placement="top"
                        title={this.state.adminPhoto}
                      >
                        {this.state.hidden ? (
                          <React.Fragment>
                            <img
                              style={{ cursor: "pointer", height: "90px" }}
                              src={ImageName.IMAGE_NAME.UPLOADED_FILE}
                            />
                            <div style={{ marginTop: "20px" }}></div>
                          </React.Fragment>
                        ) : (
                          <img
                            style={{ cursor: "pointer" }}
                            src={ImageName.IMAGE_NAME.PLUS_FILE}
                          />
                        )}
                      </label>

                      <input
                        id="file-upload"
                        type="file"
                        onChange={this.onProfileImage}
                      />
                    </div>
                    <div style={{ fontSize: "11px", width: "20px" }}>
                      {this.state.adminPhoto}
                    </div>

                    {/* <h4 className="h4_text">{this.state.clientId}</h4> */}
                  </div>
                </div>
              </div>
              {/* ..................................................................... */}

              <div className="row" style={{ marginTop: "15px" }}>
                <div className="col-md-9">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Purpose</span>
                        <div className="dropdwn">
                          <SelectBox
                            optionData={this.state.purposeArr}
                            value={this.state.purposeData}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onPurposeChange(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Message</span>
                        <textarea
                          rows="2"
                          placeholder=""
                          className="in-textarea msg min"
                          value={this.state.message}
                          style={{
                            height: "100px",
                            color: "var(--grey)",
                            borderRadius: "10px",
                            boxShadow: "2px",
                            resize: "none",
                          }}
                          onChange={this.onMessageChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Status</span>
                        <div className="dropdwn">
                          <SelectBox
                            optionData={this.state.statusArr}
                            value={this.state.statusData}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onStatusChange(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3"></div>
              </div>

              {/* .............................................................. */}
            </div>

            <div className="_button-style m30 _fl text-center">
              <a
                className="white-btn"
                style={{ textDecoration: "none" }}
                onClick={this.onCancel}
              >
                CANCEL
              </a>
              <a
                className="blue-btn"
                style={{ textDecoration: "none", color: "white" }}
                onClick={this.onNext}
              >
                UPDATE
              </a>
            </div>
          </div>
        </div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}
