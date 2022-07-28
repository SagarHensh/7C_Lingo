import React, { Component } from "react";
import { styled, Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import { ToastContainer, toast } from "react-toastify";
import { ApiCall } from "../../../../../services/middleware";
import history from "../../../../../history";
import {
  InputText,
  MultiSelectBox,
  SelectBox,
} from "../../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../../enums";
// import "./addClientContact.css";

import {
  alphaNumericValidator,
  costValidator,
  courseFeeValidate,
  departmentValidator,
  inputEmptyValidate,
 
} from "../../../../../validators";
import { Regex } from "../../../../../services/config";
import { Decoder } from "../../../../../services/auth";
import {
  consoleLog,
  decimalValue,
  getLookUpDataFromAPI,
  phoneNumberCheck,
} from "../../../../../services/common-function";
import { ErrorCode } from "../../../../../services/constant";
import ReactLoader from "../../../../Loader";
import { IMAGE_URL } from "../../../../../services/config/api_url";
import axios from "axios";
import Select, { components } from "react-select";
import { Link } from "react-router-dom";

// .......................for react select icon.............................................


const statusArr = [
  {
    label: "Inactive",
    value: "0",
  },
  {
    label: "Active",
    value: "1",
  },
];

export default class AddMaintenance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // isLoad: true,

      hiddenPic: false,
      requestedByArr: [],
      requestedByData: "",
      requirement: "",
      maintenanaceArr: [],
      maintenanceData: "",
      storeArr: [],
      storeData: "",
      priorityArr: [],
      priorityData: "",
      statusData: "",
      description: "",

      taskName: "",
      workDescription: "",
      servicePerson: "",
      cost: "",

      imagePath: "images/profile-pic.png",
      adminPhoto: "",
      locationData: {},
      locationArr: [],

      workList: [
        {
          taskName:"",
          workDescription:"",
          servicePerson:"",
          material:"",
          cost:""
        },
      ],
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    let priorityArrData = [],
      maintainArr = [],
      requestArrData=[],
      storeArrData = [];

     
        // .....................................

    let resStore = await ApiCall("fetchStoreList", {
      name: "",
      location: "",
      storeTypeId: "",
    });

    if (
      resStore.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resStore.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(resStore.data.payload);

      payload.data.details.map((obj) => {
        storeArrData.push({
          label: obj.name,
          value: obj.id,
        });
      });
    }

    let resMaintenance = await ApiCall("getlookuplistbylookuptype", {
      lookuptype: "MAINTAINANCE_TYPE",
    });
    // consoleLog("MAINTENANCEdata::", resMaintenance);

    if (
      resMaintenance.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resMaintenance.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payloadRes = await Decoder.decode(resMaintenance.data.payload);

      // consoleLog("payloaddata::", payloadRes);

      payloadRes.data.lookupdata.map((obj) => {
        maintainArr.push({
          label: obj.name,
          value: obj.id,
        });
      });
    }

    let res = await getLookUpDataFromAPI();
    // consoleLog("response:::", res);
    res.PRIORITY_TYPE.map((obj) => {
      priorityArrData.push({
        label: obj.name,
        value: obj.id,
      });
    });


    let requestBy = await ApiCall("getAdminStaffForMaintainance");
    
    if (
      requestBy.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      requestBy.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(requestBy.data.payload);
      // consoleLog("request::",payload.data[0].adminstafflist)

      payload.data[0].adminstafflist.map((obj) => {
        requestArrData.push({
          label: obj.name,
          value: obj.userId,
        });
      });
    }

    this.setState({
      priorityArr: priorityArrData,
      storeArr: storeArrData,
      maintenanaceArr: maintainArr,
      requestedByArr:requestArrData,

      phone: "+" + this.state.countryCode + " ",
      isLoad: false,
    });
  };

  // ...............for account info..........................
  onRequestByChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      requestedByData: obj,
    });
  };
  onRequirementChange = (value) => {
    let nameCheck = alphaNumericValidator(value);
    this.setState({
      requirement: nameCheck,
    });
  };

  onMaintenanceChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      maintenanceData: obj,
    });
  };

  onStoreChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      storeData: obj,
    });
  };

  onPriorityChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      priorityData: obj,
    });
  };

  onStatusChange = (dat) => {
    // consoleLog(">>>>>>>>>>>>>>>>..", data);
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      statusData: obj,
    });
  };
  onMainDescriptionChange = (e) => {
    this.setState({
      description:e.target.value
    })
  };

  //   ................................

  onTaskChange = (e, i) => {
    let arr = this.state.workList;
    arr[i].taskName = e.target.value;
    this.setState({
      workList: arr,
    });
  };

  onDescriptionChange = (e, i) => {
    let arr = this.state.workList;
    arr[i].workDescription = e.target.value;
    this.setState({
      workList: arr,
    });
  };

  onPersonChange = (e, i) => {
    let arr = this.state.workList;
    arr[i].servicePerson = e.target.value;
    this.setState({
      workList: arr,
    });
  };

  onMaterialChange = (e, i) => {
    let arr = this.state.workList;
    arr[i].material = e.target.value;
    this.setState({
      workList: arr,
    });
  };

  onCostChange = (e,i) => {
    let arr = this.state.workList;
    if(decimalValue(e.target.value)){
      arr[i].cost = e.target.value;
      this.setState({
        workList: arr,
      }); 
    }


  };
  // ...............document....................
  onProfileImage = (e) => {
    this.setState({
      onDocLoad: true,
    });
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      this.setState({
        imagePath: res.data.data.url,
        adminPhoto: res.data.data.path + res.data.data.filename,
      });

      if (res.data.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR) {
        this.setState({
          hiddenPic: true,
          onDocLoad: true,
        });
        toast.success(AlertMessage.MESSAGE.DOCUMENT.DOCUMENT_UPLOAD_SUCCESS, {
          hideProgressBar: true,
        });
      } else {
        this.setState({
          hiddenPic: false,
        });
      }
    });
  };

  onNext = async () => {
    window.scrollTo(0, 0);
    let mobileNo = this.state.phone.substring(3, 14);

    let errorCount = 0;
    let validateRequestedBy = inputEmptyValidate(this.state.requestedByData);

    let validateRequirement = inputEmptyValidate(this.state.requirement);
    let validateRequirementLength = departmentValidator(this.state.requirement);
    let validateMaintenanceType = inputEmptyValidate(
      this.state.maintenanceData.value
    );
    let validateStore = inputEmptyValidate(this.state.storeData.value);
    let validateDescription = inputEmptyValidate(this.state.description);
    let validatePriority = inputEmptyValidate(this.state.priorityData.value);
    let validateStatus = inputEmptyValidate(this.state.statusData.value);

    if (validateRequestedBy === false) {
      toast.error(AlertMessage.MESSAGE.MAINTENANCE.EMPTY_REQUESTEDBY, {
        hideProgressBar: true,
      });
      errorCount++;
    }  else if (validateRequirement === false) {
      toast.error(AlertMessage.MESSAGE.MAINTENANCE.EMPTY_REQUIREMENT, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    
    else if (validateRequirementLength === false) {
      toast.error(AlertMessage.MESSAGE.MAINTENANCE.REQUIREMENT_LENTH_VALIDATION, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateMaintenanceType === false) {
      toast.error(AlertMessage.MESSAGE.MAINTENANCE.EMPTY_MAINTENANCE_TYPE, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateStore === false) {
      toast.error(AlertMessage.MESSAGE.MAINTENANCE.EMPTY_STORE, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validatePriority === false) {
      toast.error(AlertMessage.MESSAGE.MAINTENANCE.EMPTY_PRIORITY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateStatus === false) {
      toast.error(AlertMessage.MESSAGE.MAINTENANCE.EMPTY_STATUS, {
        hideProgressBar: true,
      });
      errorCount++;
    } 

    // this.state.workList.map((obj) => {
    //   let validateTask = inputEmptyValidate(obj.taskName),
    //       validateWorkDescription = inputEmptyValidate(obj.workDescription),
    //       validatePerson = inputEmptyValidate(obj.servicePerson),
    //       validateMaterial = inputEmptyValidate(obj.material),
    //       validateCost = inputEmptyValidate(obj.cost);
      
    //   if(validateTask === false){
    //     toast.error(AlertMessage.MESSAGE.MAINTENANCE.EMPTY_TASK)
    //   } else if(validateWorkDescription === false){
    //     toast.error(AlertMessage.MESSAGE.MAINTENANCE.EMPTY_WORK_DESCRIPTION)
    //   } else if(validatePerson === false){
    //     toast.error(AlertMessage.MESSAGE.MAINTENANCE.EMPTY_PERSON)
    //   }else if(validateMaterial === false){
    //     toast.error(AlertMessage.MESSAGE.MAINTENANCE.EMPTY_MATERIAL)
    //   }else if(validateCost === false){
    //     toast.error(AlertMessage.MESSAGE.MAINTENANCE.EMPTY_COST)
    //   }
    // })

    if (errorCount === 0) {
      let data = {     
          requestedById:this.state.requestedByData.value,
           requirement:this.state.requirement,
           maintenanceTypeId:this.state.maintenanceData.value,
           storeId:this.state.storeData.value,
           priorityId:this.state.priorityData.value,
           statusId:this.state.statusData.value,
           attachment:this.state.adminPhoto,
           description:this.state.description,
           workDetails:this.state.workList
                
      };
      // consoleLog("OOOOOOO",data )

      let res = await ApiCall("insertMaintainanceReq",data)

      // consoleLog("response::",res)
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.MAINTENANCE.ADD_MAINTENANCE_SUCCESS);

        return history.push("/adminMaintenanceList")
      }  else if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.INTERNAL_SERVER_ERROR
        ) {
          toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
        }
    }
  };

  // .....................func for cancel btn......................

  onCancel = () => {
    window.scrollTo(0, 0);
    return history.push("/adminMaintenanceList");
  };
  addWorkListArr = () => {
    let arr = this.state.workList;
    arr.push({
      sno: "",
      taskName:"",
      workDescription:"",
      servicePerson:"",
      material:"",
      cost:""
    });
    this.setState({
      workList: arr,
    });
  };
  deleteWorkList = (index) => {
    this.state.workList.splice(index, 1);

    this.setState({
      workList: this.state.workList,
    });
  };

  render() {
    const customStyles = {
      control: (styles) => ({
        ...styles,
        backgroundColor: "white",
        boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
        borderRadius: "10px",
        border: "1px solid grey",
        height: 30,
        minHeight: 30,
        // width:"115px"
      }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = "yellow";
        return {
          ...styles,
          color: isFocused ? "grey" : "white",
          //   backgroundColor: isDisabled ? "red" : "white",
          color: "#000",
          cursor: isDisabled ? "not-allowed" : "default",
        };
      },
    };

    return (
      <React.Fragment>
        {/* <div className="wrapper">
        <Header /> */}
        <ToastContainer hideProgressBar theme="colored" />
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
              <Link to="/adminDashboard">Dashboard</Link> / <Link to="adminMaintenanceList">Maintenance</Link> / Add 
            </div>
          <h3 className="dcs">ADD NEW REQUEST</h3>
          <div className="row">
            <div className="col-md-12">
              <div className="department-component-app _fl sdw">
                <h3>Request details</h3>

                <div className="department-form">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Requested By *</span>
                        <SelectBox
                          optionData={this.state.requestedByArr}
                          value={this.state.requestedByData}
                          placeholder="Select"
                          onSelectChange={(value) => {
                            this.onRequestByChange(value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Requirement *</span>
                        <InputText
                          placeholder=""
                          className="in-field2"
                          value={this.state.requirement}
                          onTextChange={(value) => {
                            this.onRequirementChange(value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="department-form">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Maintenance Type *</span>
                          <SelectBox
                            optionData={this.state.maintenanaceArr}
                            value={this.state.maintenanceData}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onMaintenanceChange(value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-2"></div>
                      <div className="col-md-5">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Store *</span>
                          <SelectBox
                            optionData={this.state.storeArr}
                            value={this.state.storeData}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onStoreChange(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="department-form">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="form_rbx">
                          <span className="">Priority *</span>
                          <SelectBox
                            optionData={this.state.priorityArr}
                            value={this.state.priorityData}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onPriorityChange(value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-2"></div>
                      <div className="col-md-5">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Status *</span>
                          <div className="dropdwn">
                            <SelectBox
                              optionData={statusArr}
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
                  <div className="department-form">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="form_rbx">
                          <span className="">Attachment</span>
                          {/* <div class="upload-profile" hidden={!this.state.onDocLoad}>
                      <ReactLoader />
                    </div> */}
                          <div class="upload-profile">
                            <label
                              htmlFor="file-upload"
                              for="profile_image"
                              className="doc-sheet"
                              data-toggle="tooltip"
                              data-placement="top"
                              title={this.state.adminPhoto.substring(8)}
                              style={{ cursor: "pointer" }}
                              // hidden={this.state.onDocLoad}
                            >
                              {this.state.hiddenPic ? (
                                <React.Fragment>
                                  {" "}
                                  <img
                                    style={{
                                      cursor: "pointer",
                                      marginBottom: "10px",
                                    }}
                                    src={ImageName.IMAGE_NAME.UPLOADED_FILE}
                                  />
                                </React.Fragment>
                              ) : (
                                <React.Fragment>
                                  <img
                                    style={{ cursor: "pointer" }}
                                    src={
                                      ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG
                                    }
                                  />
                                  <span id="wait">Upload File</span>
                                </React.Fragment>
                              )}

                              <input
                                type="file"
                                id="profile_image"
                                style={{ display: "none" }}
                                onChange={this.onProfileImage}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-2"></div>
                      <div className="col-md-5">
                      <div className="form_rbx">
                          {" "}
                          <span className="">Description</span>
                          <textarea
                            placeholder=""
                            className="in-textarea min"
                            value={this.state.description}
                            onChange={(value) => {
                              this.onMainDescriptionChange(value);
                            }}
                            style={{
                              borderRadius: "10px",
                              maxHeight: "50px",
                              resize: "none",
                            }}
                          />
                          {/* </textarea> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <h3 style={{ marginTop: "60px" }}>Work Details</h3> */}
                {/* <div className="table-listing-app md4">
                  <div
                    className="table-responsive"
                    style={{ padding: "0px 5px 50px 5px", overflow: "hidden" }}
                  >
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                    >
                      <tr>
                        <th style={{ width: "10%" }}>S No.</th>
                        <th style={{ width: "14%" }}>Task</th>
                        <th style={{ width: "20%" }}>Work Description</th>
                        <th style={{ width: "14%" }}>Service Person</th>
                        <th style={{ width: "20%" }}>Material</th>
                        <th style={{ width: "15%" }}>Cost($)</th>
                        <th style={{ width: "8%" }}></th>
                      </tr>
                      {this.state.workList.map((data, i) => (
                        <React.Fragment>
                          <tr key={i}>
                            <td style={{ width: "10%" }}>{i + 1}</td>
                            <td style={{ width: "14%", paddingLeft: "2%" }}>
                              <input
                                type="text"
                                className="in-field3"
                                placeholder=""
                                value={data.taskName}
                                onChange={(e) => {
                                  this.onTaskChange(e, i);
                                }}
                              />
                            </td>
                            <td style={{ width: "20%", paddingLeft: "2%" }}>
                              <input
                                type="text"
                                className="in-field3"
                                placeholder=""
                                value={data.workDescription}
                                onChange={(e) => {
                                  this.onDescriptionChange(e, i);
                                }}
                              />
                            </td>
                            <td style={{ width: "14%", paddingLeft: "2%" }}>
                              <input
                                type="text"
                                className="in-field3"
                                value={data.servicePerson}
                                placeholder=""
                                onChange={(e) => {
                                  this.onPersonChange(e, i);
                                }}
                              />
                            </td>
                            <td style={{ width: "20%", paddingLeft: "2%" }}>
                            <input
                                type="text"
                                className="in-field3"
                                placeholder=""
                                value={data.material}
                                onChange={(e) => {
                                  this.onMaterialChange(e, i);
                                }}
                              />
                            </td>
                            <td style={{ width: "15%", paddingLeft: "2%" }}>
                              <input
                                type="text"
                                className="in-field3"
                                value={data.cost}
                                placeholder=""
                                onChange={(e) => {
                                  this.onCostChange(e, i);
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
                              {i === 0 ? (
                                <React.Fragment />
                              ) : (
                                <React.Fragment>
                                  {this.state.workList.length > 1 ? (
                                    <React.Fragment>
                                      <img
                                        style={{
                                          cursor: "pointer",
                                          margin: "auto",
                                          width: "40px",
                                        }}
                                        src={ImageName.IMAGE_NAME.CROSS_BTN}
                                        onClick={() => this.deleteWorkList(i)}
                                      />
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment />
                                  )}
                                </React.Fragment>
                              )}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </table>
                    <div className="_fl">
                      <div className="row">
                        <div className="col-md-12 text-center">
                          <button
                            className="add_more_project_btn"
                            style={{ marginTop: "50px" }}
                            onClick={this.addWorkListArr}
                          >
                            ADD MORE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* ..................................................................... */}

                <div className="_button-style m30 _fl text-center">
                  <a
                    href="javascript:void(0)"
                    className="white-btn"
                    style={{ textDecoration: "none" }}
                    onClick={this.onCancel}
                  >
                    Back
                  </a>
                  <a
                    href="javascript:void(0)"
                    className="blue-btn"
                    style={{ textDecoration: "none", color: "#fff" }}
                    onClick={this.onNext}
                  >
                    Save
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
