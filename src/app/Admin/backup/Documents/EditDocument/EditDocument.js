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
import { InputText } from "../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../enums";
// import "./addAdminstaff.css";
import {
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
import { phoneNumberCheck } from "../../../../services/common-function";
import { ErrorCode } from "../../../../services/constant";
import ReactLoader from "../../../Loader";
import { IMAGE_URL } from "../../../../services/config/api_url";
import Multiselect from "multiselect-react-dropdown";

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

const roleArrData = [
  {
    text: "Client",
    value: 3,
  },
  {
    text: "Vendor",
    value: 4,
  },
];
const statusArrData = [
  {
    text: "Sent",
    value: 1,
  },
  {
    text: "Signed",
    value: 0,
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
      roleArr: [],
      purposeArr: [],
      intendedUserArr: [],
      intendUserId: [],
      // intendUserId: preData.intendUser,
      intendId: [],
      intendedPreArrData: [],
      statusArr: [],
      statusId: 0,
      adminPhoto: "",
      checked: "",
      hidden: false,
      imagePath: "images/profile-pic.png",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    let d = {
      requsertype: 2,
    };
    let intendUseri = await ApiCall("fetchintentuserlist", d);

    let userPayloadi = Decoder.decode(intendUseri.data.payload);

    let mainData = this.props.location;
    let preData = mainData.state;

    let objData = {
      documentid: preData.id,
    };

    let resData = await ApiCall("fetchdocumentdetails", objData);
    let docData = Decoder.decode(resData.data.payload);
    let docDetails = docData.data.documentdetails;
    let intenduserData = docData.data.intenduser;

    this.setState({
      docName: docDetails[0].name,
      docType: docDetails[0].documentTypeId,
      role: preData.roleId,
      roleArr: roleArrData,
      purpose: docDetails[0].purposeTypeId,
      message: docDetails[0].message,
      intendedPreArrData: intenduserData,
      intendUserId: intenduserData,
      intendedUserArr: userPayloadi.data.intendlist,
      statusArr: statusArrData,
      statusId: docDetails[0].status,
      adminPhoto: docDetails[0].documentPath,
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

      let docTypeArr = [
        {
          text: "Select Document Type",
          value: "",
          selected: false,
        },
      ];

      docTypeArrData.map((data) => {
        if (data.id === docDetails[0].documentTypeId) {
          docTypeArr.push({
            text: data.name,
            value: data.id,
            selected: true,
          });
        } else {
          docTypeArr.push({
            text: data.name,
            value: data.id,
            selected: false,
          });
        }
      });

      var classInstance = this;
      window.$(".myDropdown_docType").ddslick({
        data: docTypeArr,
        onSelected: function (data) {
          var ddData = window.$(".myDropdown_docType").data("ddslick");
          classInstance.setState({
            docType: data.selectedData.value,
          });
        },
      });
      //   ..................purpose..........................
      let purposeArr = [
        {
          text: "Select Purpose",
          value: "",
          selected: false,
        },
      ];
      purposeArrData.map((data) => {
        if (data.id === docDetails[0].purposeTypeId) {
          purposeArr.push({
            text: data.name,
            value: data.id,
            selected: true,
          });
        } else {
          purposeArr.push({
            text: data.name,
            value: data.id,
            selected: false,
          });
        }
      });
      var classInstance = this;
      window.$(".myDropdown_purpose").ddslick({
        data: purposeArr,
        onSelected: function (data) {
          var ddData = window.$(".myDropdown_purpose").data("ddslick");
          classInstance.setState({
            purpose: data.selectedData.value,
          });
        },
      });

      //   ................role............................
      let roleArrD = [
        {
          text: "Select Role",
          value: "",
          selected: false,
        },
      ];

      this.state.roleArr.map((data) => {
        if (data.value === preData.roleId) {
          roleArrD.push({
            text: data.text,
            value: data.value,
            selected: true,
          });
        } else {
          roleArrD.push({
            text: data.text,
            value: data.value,
            selected: false,
          });
        }
      });

      var classInstance = this;
      window.$(".myDropdown_role").ddslick({
        data: roleArrD,
        onSelected: async function (data) {
          let userData = {
            requsertype: parseInt(data.selectedData.value),
          };
          let intendUser = await ApiCall("fetchintentuserlist", userData);
          if (intendUser) {
            let userPayload = Decoder.decode(intendUser.data.payload);

            if (userPayload) {
              if (data.selectedData.value === classInstance.state.role) {
                classInstance.setState({
                  role: data.selectedData.value,
                  intendedUserArr: userPayload.data.intendlist,
                });
              } else {
                classInstance.setState({
                  role: data.selectedData.value,
                  intendedUserArr: userPayload.data.intendlist,
                  intendedPreArrData: [],
                  intendUserId: [],
                });
              }
            }
          }
        },
      });
      //   ............status........................
      let statusArrD = [
        {
          text: "none",
          value: "",
          selected: false,
        },
      ];
      this.state.statusArr.map((data) => {
        if (data.value === preData.status) {
          statusArrD.push({
            text: data.text,
            value: data.value,
            selected: true,
          });
        } else {
          statusArrD.push({
            text: data.text,
            value: data.value,
            selected: false,
          });
        }
      });

      var classInstance = this;
      window.$(".myDropdown_stat").ddslick({
        data: statusArrD,
        onSelected: function (data) {
          var ddData = window.$(".myDropdown_stat").data("ddslick");
          classInstance.setState({
            status: data.selectedData.value,
          });
        },
      });
      // .....................................................

      this.setState({
        purposeArr: purposeArrData,
        roleArr: roleArrD,
        docTypeArr: docTypeArrData,
        docTypeArr: docTypeArrData,
        // intendedUserArr: intendArrData,

        // intendedUserArr: intendedArrData,
        isLoad: false,
      });
    } else {
    }
  };

  onSelect = (selectedList, selectedItem) => {
    // let intendArray = this.state.intendedUserArr;

    let arr = this.state.intendUserId;
    for (let i = 0; i < this.state.intendedUserArr.length; i++) {
      if (this.state.intendedUserArr[i].userId === selectedItem.userId) {
        arr.push({
          userId: selectedItem.userId,
          name: this.state.intendedUserArr[i].name,
        });

        this.setState({
          intendUserId: arr,
        });
      }
    }
  };

  onRemove = (selectedList, removedItem) => {
    let arr = [];
    for (let i = 0; i < selectedList.length; i++) {
      arr.push({ userId: selectedList[i].userId, name: selectedList[i].name });
    }
    this.setState({
      intendUserId: arr,
    });
  };
  // ...............for tabs..........................

  onNameChange = (value) => {
    // var pattern = new RegExp(Regex.NAME_REGEX);
    let nameCheck = nameRegexValidator(value);
    // if (pattern.test(value)) {

    this.setState({
      docName: nameCheck,
    });
  };
  // ...............document....................
  onProfileImage = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      this.setState({
        imagePath: res.data.data.url,
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
  onStatusChange = (e) => {
    this.setState({
      checkStatus: !this.state.checkStatus,
    });
  };

  onNext = async () => {
    // let mobileNo = this.state.phone.substring(3, 14);
    let errorCount = 0;
    let validateName = inputEmptyValidate(this.state.docName);
    let validateNameLength = departmentValidator(this.state.docName);
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

    let validatedocType = inputEmptyValidate(this.state.docType);

    if (validatedocType === false) {
      toast.error(AlertMessage.MESSAGE.DOCUMENT.DROPDOWN_DOCTYPE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    let validateRole = inputEmptyValidate(this.state.role);
    if (validateRole === false) {
      toast.error(AlertMessage.MESSAGE.DOCUMENT.DROPDOWN_SELECT_ROLE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // let validateUser = inputEmptyValidate(this.state.intendedUserArr);
    let validateUser = inputEmptyValidate(this.state.intendUserId);
    if (validateUser === false) {
      toast.error(AlertMessage.MESSAGE.DOCUMENT.DROPDOWN_INTENDED_USER_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // let validatePreUser = inputEmptyValidate(this.state.intendedPreArrData);
    // if (validatePreUser === false) {
    //   toast.error(AlertMessage.MESSAGE.DOCUMENT.DROPDOWN_INTENDED_USER_EMPTY, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // }
    let validatePurpose = inputEmptyValidate(this.state.purpose);
    if (validatePurpose === false) {
      toast.error(AlertMessage.MESSAGE.DOCUMENT.DROPDOWN_PURPOSE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    let validateStatus = inputEmptyValidate(this.state.status);
    if (validateStatus === false) {
      toast.error(AlertMessage.MESSAGE.DOCUMENT.DROPDOWN_STATUS_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      let intendIdsArr = [];

      for (let i = 0; i < this.state.intendUserId.length; i++) {
        intendIdsArr.push(this.state.intendUserId[i].userId);
      }

      let data = {
        documentid: 1,
        name: this.state.docName,
        documenttypeid: this.state.docType,
        version: 1,
        usertyperoleid: this.state.role,
        purposetypeid: this.state.purpose,
        message: this.state.message,
        documentpath: this.state.adminPhoto,
        status: this.state.status === 1 ? "sent" : "signed",
        intenduser: intendIdsArr,
      };

      let res = await ApiCall("updatedocumentdetails", data);

      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(res.data.message, {
          hideProgressBar: true,
        });
        window.setTimeout(() => {
          return history.push("/adminDocuments");
        }, 3000);
      } else {
        if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST
        ) {
          toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_EXIST, {
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
      <div className="wrapper">
        <Header />
        <ToastContainer />
        <Sidebar />
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>
        <div className="component-wrapper" hidden={this.state.isLoad}>
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
                          <select className="myDropdown_docType frm4-select"></select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row" style={{ marginTop: "15px" }}>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="lbl">Role</span>
                        <div className="dropdwn">
                          <select class="myDropdown_role frm4-select"></select>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="lbl">Intended User</span>
                        <div className="dropdwn">
                          <Multiselect
                            options={this.state.intendedUserArr} // Options to display in the dropdown
                            selectedValues={this.state.intendedPreArrData} // Preselected value to persist in dropdown
                            onSelect={this.onSelect} // Function will trigger on select event
                            onRemove={this.onRemove} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                            showCheckbox
                          />
                        </div>
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
                        <span className="lbl">Purpose</span>
                        <div className="dropdwn">
                          <select class="myDropdown_purpose frm4-select"></select>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="lbl">Message</span>
                        <textarea
                          rows="2"
                          placeholder=""
                          className="in-textarea msg min"
                          value={this.state.message}
                          style={{
                            height: "52px",
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
                        <span className="lbl">Status</span>
                        <div className="dropdwn">
                          <select class="myDropdown_stat frm4-select"></select>
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
      </div>
    );
  }
}
