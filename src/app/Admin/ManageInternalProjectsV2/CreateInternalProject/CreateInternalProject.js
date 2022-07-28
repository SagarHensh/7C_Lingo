import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ApiCall } from "../../../../services/middleware";
import history from "../../../../history";
import { InputText, SelectBox } from "../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../enums";
import "./CreateInternalProject.css";
import {
  departmentValidator,
  emailValidator,
  inputEmptyValidate,
} from "../../../../validators";
import { Decoder } from "../../../../services/auth";
import {
  consoleLog,
  SetDatabaseDateFormat,
  SetUSAdateFormat,
  SetUSAdateFormatV2,
} from "../../../../services/common-function";
import { ErrorCode } from "../../../../services/constant";
import ReactLoader from "../../../Loader";
import { Link } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { listClasses } from "@mui/material";
const ownerArr = [
  {
    label: "Sam",
    value: "1",
  },
  {
    label: "Bob",
    value: "2",
  },
];

const taskStatusArr = [
  {
    label: "Open",
    value: "1",
  },
  {
    label: "close",
    value: "2",
  },
];

const milestoneArr = [
  // {
  //   milestoneName: "Internal Training",
  //   taskData: [
  //     {
  //       taskId: 1,
  //       taskName: "task 1",
  //       ownerId: "1",
  //       startDate: "01-01-1990",
  //       endDate: "30-11-1990",
  //       status: "1",
  //     },
  //     {
  //       taskId: 1,
  //       taskName: "task 1",
  //       ownerId: "1",
  //       startDate: "01-01-1990",
  //       endDate: "30-11-1990",
  //       status: "1",
  //     },
  //   ],
  // },
  // {
  //   milestoneName: "Internal Training 2",
  //   taskData: [
  //     {
  //       taskId: 1,
  //       taskName: "2nd task 1",
  //       ownerId: "1",
  //       startDate: "01-01-2000",
  //       endDate: "30-11-20001",
  //       status: "1",
  //     },
  //   ],
  // },
];

export default class CreateInternalProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      isAddMilestone: false,
      projectTitle: "",
      expectedEndDate: "",
      projectDescription: "",
      note: "",
      //   ......for mileStone modal,,,,,,,,,,,,,
      mileStoneName: "",
      milestoneStartDate: "",
      milestoneEndDate: "",

      //   .............task list.....
      milestoneArr: [],
      // ............for task modal,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
      milestoneTitle:"",
      taskName: "",
      taskDescription: "",
      taskOwnerArr: ownerArr,
      selectedTaskOwner: {},
      taskStartDate: "",
      taskEndDate: "",
      taskStatusArr: taskStatusArr,
      selectedTaskStatus: {},
      taskNotes: "",
      curIndex: 0,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();

    var classInstance = this;

    // When the user clicks anywhere outside of the modal, close it

    document.getElementById("backdrop").style.display = "none";
    var mileStoneModal = document.getElementById("milestone-model");
    var taskModal = document.getElementById("task-model");

    window.addEventListener("click", function (event) {
      if (event.target == mileStoneModal) {
        classInstance.closeMilestoneModal();
      } else if (event.target == taskModal) {
        classInstance.closeTaskModal();
      }
    });
  }

  load = async () => {
    this.setState({
      milestoneArr: milestoneArr,
    });

    consoleLog("bill::", JSON.stringify(milestoneArr));
    let industryDataArr = [];
    let lookupres = await ApiCall("getLookUpData");
    if (
      lookupres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      lookupres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(lookupres.data.payload);
      let industryArr = payload.data.lookupdata.INDUSTRY_TYPE;

      for (let i = 0; i < industryArr.length; i++) {
        industryDataArr.push({
          label: industryArr[i].name,
          value: industryArr[i].id,
        });
      }
    }
    //api for location list......................

    // let locationArr = [];
    // let locationData = await ApiCall("getlocaiondescription", {
    //   place: e.target.value,
    // });
    // if (
    //   locationData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   locationData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {
    //   let locationArr = Decoder.decode(locationData.data.payload);
    //   locationArr = locationArr.data.locaionsuggesion;
    // this.setState({
    //   allAdddress: locationArr.data.locaionsuggesion,
    // });
    // }
    // .........api for country list...............

    let arrCountry = [];
    let countryArr = [];
    let data = {};
    let res = await ApiCall("getcountrylist", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      countryArr = payload.data.countryInfo;
      for (let i = 0; i < countryArr.length; i++) {
        arrCountry.push({
          label: countryArr[i].name,
          value: countryArr[i].id,
        });
      }
    }

    this.setState({
      // locationArr: locationArr,
      countryInfoArr: arrCountry,
      billingCountryInfoArr: arrCountry,
      industryArr: industryDataArr,
      businessPhone: "+" + this.state.countryCode + " ",
      phone: "+" + this.state.countryCode + " ",
      isLoad: false,
    });
  };

  onNext = async () => {
    window.scrollTo(0, 0);
    let mobileNo = this.state.businessPhone.substring(3, 15);
    let errorCount = 0;
    let validateIndustry = inputEmptyValidate(this.state.industryTypeId);
    let validateEmail = emailValidator(this.state.businessEmail);
    let validatePhone = inputEmptyValidate(mobileNo);

    let validateName = inputEmptyValidate(this.state.uname);
    let validateNameLength = departmentValidator(this.state.uname);
    if (validateName === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_CLIENT_NAME, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateNameLength === false) {
      toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateIndustry === false) {
      toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_INDUSTRY_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateEmail.status === false) {
      toast.error(AlertMessage.MESSAGE.EMAIL.BUSSINESS_EMAIL_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (this.state.businessEmail.length > 100) {
      toast.error(AlertMessage.MESSAGE.EMAIL.MAX_EMAIL_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validatePhone === false) {
      toast.error(AlertMessage.MESSAGE.MOBILE.BUSINESS_MOBILE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // .....................................................

    //

    if (errorCount === 0) {
      this.setState({
        showPage: true,
        page: false,
      });
      let objData = {
        name: this.state.uname,
        industryTypeId: this.state.industryTypeId,
        email: this.state.businessEmail,
        cuncode: this.state.countryCode,
        phone: mobileNo,
        website: this.state.website,
        fax: this.state.fax,
        purchaseOrder: this.state.purchaseOrder,
        status: this.state.checkStatus ? "1" : "0",
        photo: this.state.adminPhoto,
      };
      // console.log("=================>", objData);
      // return history.push("/adminAddClientPageTwo");

      //   let res = await ApiCall("createuser", objData);
      //   let payload = Decoder.decode(res.data.payload);
      //   if (
      //     res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      //     res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      //   ) {
      //     toast.success(AlertMessage.MESSAGE.CREATE.SUCCESS, {
      //       hideProgressBar: true,
      //     });
      //     return history.push("/adminStaff");
      //   } else {
      //     if (
      //       res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
      //       res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST
      //     ) {
      //       toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_EXIST, {
      //         hideProgressBar: true,
      //       });
      //     } else if (
      //       res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
      //       res.respondcode === ErrorCode.ERROR.ERROR_CODE.PHONE_EXIST
      //     ) {
      //       toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EXIST, {
      //         hideProgressBar: true,
      //       });
      //     } else if (
      //       res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
      //       res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_PHONE_EXIST
      //     ) {
      //       toast.error(AlertMessage.MESSAGE.EMAIL_MOBILE.DUBLICATE, {
      //         hideProgressBar: true,
      //       });
      //     }
      //   }
    }
  };

  openMilestoneModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("milestone-model").style.display = "block";
    document.getElementById("milestone-model").classList.add("show");
  };

  closeMilestoneModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("milestone-model").style.display = "none";
    document.getElementById("milestone-model").classList.remove("show");
    this.resetMilestoneData();
  };
  openTaskModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("task-model").style.display = "block";
    document.getElementById("task-model").classList.add("show");
  };

  closeTaskModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("task-model").style.display = "none";
    document.getElementById("task-model").classList.remove("show");
    this.resetTaskData();
  };

  // .....................func for cancel btn......................

  onCancel = () => {
    window.scrollTo(0, 0);
    return history.push("/adminInternalProjectList");
  };

  //   ..................
  onProjectTitleChange = (value) => {
    this.setState({
      projectTitle: value,
    });
  };

  expectedDateChange = (date) => {
    this.setState({
      expectedEndDate: SetUSAdateFormat(date),
    });
  };
  onDescriptionChange = (e) => {
    this.setState({
      projectDescription: e.target.value,
    });
  };
  onNotesChange = (e) => {
    this.setState({
      note: e.target.value,
    });
  };

  onOpenMilestone = () => {
    this.setState({
      isAddMilestone: true,
    });
    this.openMilestoneModal();
  };

  //   ...............milestone modal,,,,,,,,,,,,,,,
  resetMilestoneData = () => {
    this.setState({
      mileStoneName: "",
      milestoneStartDate: "",
      milestoneEndDate: "",
    });
  };

  onMilestoneNameChange = (val) => {
    this.setState({
      mileStoneName: val,
    });
  };
  milestoneStartDateChange = (date) => {
    this.setState({
      milestoneStartDate: SetUSAdateFormat(date),
    });
  };
  milestoneEndDateChange = (date) => {
    this.setState({
      milestoneEndDate: SetUSAdateFormat(date),
    });
  };
  onAddMilestone = () => {
    let errorCount = 0;

    if (inputEmptyValidate(this.state.mileStoneName) == false) {
      toast.error(
        AlertMessage.MESSAGE.INTERNAL_PROJECT.MILESTONE.EMPTY_MILESTONE_NAME
      );
      errorCount++;
    } else if (inputEmptyValidate(this.state.milestoneStartDate) == false) {
      toast.error(
        AlertMessage.MESSAGE.INTERNAL_PROJECT.MILESTONE.EMPTY_START_DATE
      );
      errorCount++;
    } else if (inputEmptyValidate(this.state.milestoneEndDate) == false) {
      toast.error(
        AlertMessage.MESSAGE.INTERNAL_PROJECT.MILESTONE.EMPTY_END_DATE
      );
      errorCount++;
    } else if (this.state.milestoneEndDate < this.state.milestoneStartDate) {
      toast.error(
        AlertMessage.MESSAGE.INTERNAL_PROJECT.MILESTONE.END_LESS_FROM
      );
      errorCount++;
    }

    if (errorCount === 0) {
      let objData = {
        milestoneName: this.state.mileStoneName,
        startDate:
          this.state.milestoneStartDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.milestoneStartDate),
        startDate:
          this.state.milestoneEndDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.milestoneEndDate),
      };
      consoleLog("data::", objData);

      this.closeMilestoneModal();
      this.resetMilestoneData();
      // ........................................
      let milestoneArr = this.state.milestoneArr;

      let data = {
        milestoneName: this.state.mileStoneName,
        taskData: [
          {
            taskId: 1,
            taskName: "",
            ownerId: "",
            startDate: SetDatabaseDateFormat(new Date()),
            endDate: SetDatabaseDateFormat(new Date()),
            status: "",
            selectedOwner: {},
            selectedStatus: {},
          },
        ],
      };
      milestoneArr.push(data);
      this.setState({
        milestoneArr: this.state.milestoneArr,
      });
    }
  };
  onAddMoreMilestone = () => {
    let errorCount = 0;

    if (inputEmptyValidate(this.state.mileStoneName) == false) {
      toast.error(
        AlertMessage.MESSAGE.INTERNAL_PROJECT.MILESTONE.EMPTY_MILESTONE_NAME
      );
      errorCount++;
    } else if (inputEmptyValidate(this.state.milestoneStartDate) == false) {
      toast.error(
        AlertMessage.MESSAGE.INTERNAL_PROJECT.MILESTONE.EMPTY_START_DATE
      );
      errorCount++;
    } else if (inputEmptyValidate(this.state.milestoneEndDate) == false) {
      toast.error(
        AlertMessage.MESSAGE.INTERNAL_PROJECT.MILESTONE.EMPTY_END_DATE
      );
      errorCount++;
    } else if (this.state.milestoneEndDate < this.state.milestoneStartDate) {
      toast.error(
        AlertMessage.MESSAGE.INTERNAL_PROJECT.MILESTONE.END_LESS_FROM
      );
      errorCount++;
    }

    if (errorCount === 0) {
      let objData = {
        milestoneName: this.state.mileStoneName,
        startDate:
          this.state.milestoneStartDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.milestoneStartDate),
        startDate:
          this.state.milestoneEndDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.milestoneEndDate),
      };
      consoleLog("data::", objData);

    
      this.resetMilestoneData();
      // ........................................
      let milestoneArr = this.state.milestoneArr;

      let data = {
        milestoneName: this.state.mileStoneName,
        taskData: [
          {
            taskId: 1,
            taskName: "",
            ownerId: "",
            startDate: SetDatabaseDateFormat(new Date()),
            endDate: SetDatabaseDateFormat(new Date()),
            status: "",
            selectedOwner: {},
            selectedStatus: {},
          },
        ],
      };
      milestoneArr.push(data);
      // this.setState({
      //   milestoneArr: this.state.milestoneArr,
      // });
    }
  }

  //   ...............for task list ...............

  ontaskNameChange = (val, key, key1) => {
    let milestoneMainArr = this.state.milestoneArr;

    milestoneMainArr[key].taskData[key1].taskName = val;
    this.setState({
      milestoneArr: milestoneMainArr,
    });
  };
  onOwnerChange = (val, key, key1) => {
    let milestoneMainArr = this.state.milestoneArr;

    milestoneMainArr[key].taskData[key1].ownerId = val.value;
    milestoneMainArr[key].taskData[key1].selectedOwner = val;
    this.setState({
      milestoneArr: milestoneMainArr,
    });
  };
  onTaskStartDateChange = (date, key, key1) => {
    let milestoneMainArr = this.state.milestoneArr;

    milestoneMainArr[key].taskData[key1].startDate = SetUSAdateFormat(date);
    this.setState({
      milestoneArr: milestoneMainArr,
    });
  };
  onTaskEndDateChange = (date, key, key1) => {
    let milestoneMainArr = this.state.milestoneArr;

    milestoneMainArr[key].taskData[key1].endDate = SetUSAdateFormat(date);
    this.setState({
      milestoneArr: milestoneMainArr,
    });
  };
  onTaskStatusChange = (val, key, key1) => {
    let milestoneMainArr = this.state.milestoneArr;

    milestoneMainArr[key].taskData[key1].status = val.value;
    milestoneMainArr[key].taskData[key1].selectedStatus = val;
    this.setState({
      milestoneArr: milestoneMainArr,
    });
  };

  onDeleteTask = (key,key1) => {
    let milestoneMainArr = this.state.milestoneArr;
    milestoneMainArr[key].taskData.splice(key1,1);
    this.setState({
      milestoneArr: milestoneMainArr,
    })

    // consoleLog("main arr::",milestoneMainArr)
  };

  // ..................for add task modal,,,,,,,,,,,,,,,,,,,,
  onTaskNameChange_modal = (val) => {
    this.setState({
      taskName: val,
    });
  };
  onTaskDescriptionChange_modal = (e) => {
    this.setState({
      taskDescription: e.target.value,
    });
  };
  onTaskStartDateChange_modal = (date) => {
    this.setState({
      taskStartDate: SetUSAdateFormat(date),
    });
  };
  onTaskEndDateChange_modal = (date) => {
    this.setState({
      taskEndDate: SetUSAdateFormat(date),
    });
  };
  onTaskOwnerChange_modal = (val) => {
    this.setState({
      selectedTaskOwner: val,
    });
  };

  onTaskStatusChange_modal = (val) => {
    this.setState({
      selectedTaskStatus: val,
    });
  };
  onTaskNotesChange_modal = (e) => {
    this.setState({
      taskNotes: e.target.value,
    });
  };

  resetTaskData = () => {
    this.setState({
      taskName: "",
      taskDescription: "",
      taskStartDate: "",
      taskEndDate: "",
      selectedTaskOwner: {},
      selectedTaskStatus: {},
      taskNotes: "",
      milestoneTitle:""
    });
  };

  openTask = (item,index) => {
    this.openTaskModal();
    consoleLog("item::", item);
    this.setState({
      curIndex: index,
      milestoneTitle:item.milestoneName
    });
  };

  onAddTask = () => {
    let errorCount = 0;

    if (inputEmptyValidate(this.state.taskName) == false) {
      toast.error(AlertMessage.MESSAGE.INTERNAL_PROJECT.TASK.EMPTY_TASK_NAME);
      errorCount++;
    } else if (inputEmptyValidate(this.state.taskDescription) == false) {
      toast.error(
        AlertMessage.MESSAGE.INTERNAL_PROJECT.TASK.EMPTY_TASK_DESCRIPTION
      );
      errorCount++;
    } else if (
      inputEmptyValidate(this.state.selectedTaskOwner.value) == false
    ) {
      toast.error(AlertMessage.MESSAGE.INTERNAL_PROJECT.TASK.EMPTY_OWNER);
      errorCount++;
    } else if (inputEmptyValidate(this.state.taskStartDate) == false) {
      toast.error(AlertMessage.MESSAGE.INTERNAL_PROJECT.TASK.EMPTY_START_DATE);
      errorCount++;
    } else if (inputEmptyValidate(this.state.taskEndDate) == false) {
      toast.error(AlertMessage.MESSAGE.INTERNAL_PROJECT.TASK.EMPTY_END_DATE);
      errorCount++;
    } else if (inputEmptyValidate(this.state.taskEndDate) == false) {
      toast.error(AlertMessage.MESSAGE.INTERNAL_PROJECT.TASK.EMPTY_END_DATE);
      errorCount++;
    } else if (this.state.taskStartDate > this.state.taskEndDate) {
      toast.error(AlertMessage.MESSAGE.INTERNAL_PROJECT.TASK.END_LESS_FROM);
      errorCount++;
    } else if (
      inputEmptyValidate(this.state.selectedTaskStatus.value) == false
    ) {
      toast.error(AlertMessage.MESSAGE.INTERNAL_PROJECT.TASK.EMPTY_STATUS);
      errorCount++;
    }

    if (errorCount === 0) {
      let objData = {
        taskName: this.state.taskName,
        taskDescription: this.state.taskDescription,
        startDate:
          this.state.taskStartDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.taskStartDate),
        endDate:
          this.state.taskEndDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.taskEndDate),
        ownerName:
          this.state.selectedTaskOwner.value == null ||
          this.state.selectedTaskOwner.value == undefined
            ? ""
            : this.state.selectedTaskOwner.value,
        taskStatus:
          this.state.selectedTaskStatus == null ||
          this.state.selectedTaskStatus == undefined
            ? ""
            : this.state.selectedTaskStatus.value,
        notes: this.state.taskNotes,
      };

      consoleLog("response:::", objData);
      consoleLog("index:::", this.state.curIndex);
      this.closeTaskModal();
      this.resetTaskData();

      let milestoneArr = this.state.milestoneArr;

      // ......for owner dropdown in task list...................
      let ownerObj = {},
        statusObj = {};

      ownerArr.map((obj) => {
        if (obj.value == this.state.selectedTaskOwner.value) {
          ownerObj = {
            label: obj.label,
            value: obj.value,
          };
        }
      });

      // ...........for status dropdown in task list,,,,,,,,,,,,,,,

      taskStatusArr.map((obj) => {
        if (obj.value == this.state.selectedTaskStatus.value) {
          statusObj = {
            label: obj.label,
            value: obj.value,
          };
        }
      });

      let objResData = {
        taskId: "",
        taskName: this.state.taskName,
        ownerId: this.state.selectedTaskOwner.value,
        startDate:
          this.state.taskStartDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.taskStartDate),
        endDate:
          this.state.taskEndDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.taskEndDate),
        status:
          this.state.selectedTaskStatus.value == null ||
          this.state.selectedTaskStatus.value == undefined
            ? ""
            : this.state.selectedTaskStatus.value,
        selectedOwner: ownerObj,
        selectedStatus: statusObj,
      };
      milestoneArr[this.state.curIndex].taskData.push(objResData);
      this.setState({
        milestoneArr: this.state.milestoneArr,
      });

      consoleLog("modified arr::", this.state.milestoneArr);
    }
  };

  onBack = () => {
    this.props.history.push("/adminInternalProjectList");
  };
  onSaveMilestone = () => {
    let objData = {
      milestoneArr: this.state.milestoneArr,
    };

    consoleLog("main data:::", objData);
  };

  render() {
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
            <Link to="/adminDashboard">Dashboard</Link> /{" "}
            <Link to="/adminInternalProjectList">Internal Projects</Link> /
            Create Project
          </div>
          <h3 className="dcs">Create Project</h3>
          <div className="row">
            <div className="col-md-12">
              <div className="department-component-app _fl sdw">
                <h3>Project Details</h3>
                <div className="department-form">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Project ID</span>
                        <p style={{ fontSize: "16px" }}>12345</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="department-form">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Project Title *</span>
                        <div className="dropdwn">
                          <InputText
                            type="text"
                            placeholder=""
                            className="in-field2"
                            value={this.state.projectTitle}
                            onTextChange={(value) => {
                              this.onProjectTitleChange(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Expected End Date *</span>
                        <div
                          className="input-group"
                          style={{
                            width: "100%",
                            borderRadius: "9px",
                            height: "43px",
                            border: "1px solid #ced4da",
                            boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                          }}
                        >
                          <div style={{ width: "80%", padding: "8px" }}>
                            {this.state.expectedEndDate}
                          </div>
                          <div style={{ width: "20%" }}>
                            <a style={{ float: "right" }}>
                              <DatePicker
                                dropdownMode="select"
                                showMonthDropdown
                                showYearDropdown
                                adjustDateOnChange
                                //   maxDate={new Date()}
                                onChange={(date) =>
                                  this.expectedDateChange(date)
                                }
                                customInput={<Schedule />}
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="department-form">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Project Description</span>
                        <textarea
                          rows="2"
                          className="in-textarea msg min"
                          value={this.state.projectDescription}
                          style={{
                            height: "100px",
                            color: "var(--grey)",
                            borderRadius: "10px",
                            boxShadow: "2px",
                            resize: "none",
                          }}
                          onChange={this.onDescriptionChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="department-form">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form_rbx">
                        <span className="">Notes</span>
                        <textarea
                          rows="2"
                          className="in-textarea msg min"
                          value={this.state.note}
                          style={{
                            height: "100px",
                            color: "var(--grey)",
                            borderRadius: "10px",
                            boxShadow: "2px",
                            resize: "none",
                          }}
                          onChange={this.onNotesChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

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

                {/* .................................. */}
                <h3>Milestones & Task[s] Management</h3>
                <div className="row">
                  <div className="col-md-10"></div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-primary"
                      onClick={this.onOpenMilestone}
                    >
                      Add Milestone
                    </button>
                  </div>
                </div>
                {this.state.milestoneArr.map((obj, key) => (
                  <React.Fragment key={key}>
                    <div className="row">
                      <div className="col-md-6">
                        Milestone : {obj.milestoneName}
                      </div>
                    </div>
                    <div className="table-responsive_mb">
                      <div className="table-listing-app tblt">
                        <div className="table-listing-app proj_tbl">
                          <div className="add_tsts">
                            <table
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <th style={{ width: "5%" }}>Task ID</th>
                                  <th style={{ width: "18%" }}>Task</th>
                                  <th style={{ width: "18%" }}>Owner</th>
                                  <th style={{ width: "18%" }}>Start Date</th>
                                  <th style={{ width: "18%" }}>End Date</th>
                                  <th style={{ width: "13%" }}>Status</th>
                                  <th style={{ width: "5%" }}></th>
                                </tr>
                              </tbody>
                              <tbody>
                                {obj.taskData.map((obj1, key1) => (
                                  <React.Fragment key={key1}>
                                    <tr>
                                      <td style={{ width: "5%" }}>
                                        {/* {obj1.taskId} */}{key1+1}
                                      </td>
                                      <td style={{ width: "18%" }}>
                                        <InputText
                                          placeholder=""
                                          className="in-field2"
                                          value={obj1.taskName}
                                          onTextChange={(value) => {
                                            this.ontaskNameChange(
                                              value,
                                              key,
                                              key1
                                            );
                                          }}
                                        />
                                      </td>
                                      <td style={{ width: "18%" }}>
                                        <SelectBox
                                          optionData={ownerArr}
                                          value={obj1.selectedOwner}
                                          onSelectChange={(value) =>
                                            this.onOwnerChange(value, key, key1)
                                          }
                                        ></SelectBox>
                                      </td>
                                      <td style={{ width: "18%" }}>
                                        <div
                                          className="input-group"
                                          style={{
                                            width: "100%",
                                            borderRadius: "9px",
                                            height: "43px",
                                            border: "1px solid #ced4da",
                                            boxShadow:
                                              "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                          }}
                                        >
                                          <div className="dateFieldTxt">
                                            {SetUSAdateFormat(obj1.startDate)}
                                          </div>
                                          <div style={{ width: "20%" }}>
                                            <a style={{ float: "right" }}>
                                              <DatePicker
                                                dropdownMode="select"
                                                showMonthDropdown
                                                showYearDropdown
                                                adjustDateOnChange
                                                //   maxDate={new Date()}
                                                onChange={(date) =>
                                                  this.onTaskStartDateChange(
                                                    date,
                                                    key,
                                                    key1
                                                  )
                                                }
                                                customInput={<Schedule />}
                                              />
                                            </a>
                                          </div>
                                        </div>
                                      </td>
                                      <td style={{ width: "18%" }}>
                                        <div
                                          className="input-group"
                                          style={{
                                            width: "100%",
                                            borderRadius: "9px",
                                            height: "43px",
                                            border: "1px solid #ced4da",
                                            boxShadow:
                                              "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                          }}
                                        >
                                          <div className="dateFieldTxt">
                                            {SetUSAdateFormat(obj1.endDate)}
                                          </div>
                                          <div style={{ width: "20%" }}>
                                            <a style={{ float: "right" }}>
                                              <DatePicker
                                                dropdownMode="select"
                                                showMonthDropdown
                                                showYearDropdown
                                                adjustDateOnChange
                                                //   maxDate={new Date()}
                                                onChange={(date) =>
                                                  this.onTaskEndDateChange(
                                                    date,
                                                    key,
                                                    key1
                                                  )
                                                }
                                                customInput={<Schedule />}
                                              />
                                            </a>
                                          </div>
                                        </div>
                                      </td>
                                      <td style={{ width: "13%" }}>
                                        <SelectBox
                                          optionData={this.state.taskStatusArr}
                                          value={obj1.selectedStatus}
                                          onSelectChange={(value) =>
                                            this.onTaskStatusChange(
                                              value,
                                              key,
                                              key1
                                            )
                                          }
                                        ></SelectBox>
                                      </td>
                                      <td style={{ width: "5%" }}>
                                        {this.state.milestoneArr.map((obj,index) =>
                                          (
                                            <React.Fragment key={index}>
                                              {obj.taskData.length > 1 && key == index  ? (
                                                <React.Fragment>
                                                  
                                                 
                                                    <img
                                                      src={
                                                        ImageName.IMAGE_NAME
                                                          .CANCEL_BTN
                                                      }
                                                      className="delete-btn"
                                                      onClick={() =>
                                                        this.onDeleteTask(key,key1)
                                                      }
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                    />
                                                    
                                               
                                                </React.Fragment>
                                              ) : (
                                                <React.Fragment />
                                              )}
                                            </React.Fragment>
                                          )
                                        )}
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    {this.state.milestoneArr.length > 0 ? (
                      <React.Fragment>
                        <div className="row">
                          <div className="col-md-10"></div>
                          <div className="col-md-2">
                            <div className="addTaskBtn">
                              <button
                                className="btn btn-primary"
                                onClick={() => this.openTask(obj,key)}
                              >
                                Add Task
                              </button>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                  </React.Fragment>
                ))}

                {this.state.milestoneArr.length > 0 ? (
                  <React.Fragment>
                    <div className="_button-style m30 _fl text-center">
                      <a
                        href="javascript:void(0)"
                        className="white-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.onBack}
                      >
                        Back
                      </a>
                      <a
                        href="javascript:void(0)"
                        className="blue-btn"
                        style={{ textDecoration: "none", color: "#fff" }}
                        onClick={this.onSaveMilestone}
                      >
                        Save
                      </a>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment></React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* .......................mileStone modal,,,,,,,,,,,,,,,,,,,,,,,,, */}
        <div
          id="milestone-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="filter-head _fl mdfs taskHead">
                <h3 className="milestoneTxt">New Milestone</h3>
                <div className="modal-body">
                  <div className="create-jeneral-wrap _fl">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Milestone</span>
                          <InputText
                            type="text"
                            placeholder=""
                            className="in-field2"
                            value={this.state.mileStoneName}
                            onTextChange={(value) => {
                              this.onMilestoneNameChange(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-5">
                        <div className="form_rbx">
                          <span>Start Date</span>
                          <div
                            className="input-group"
                            style={{
                              width: "100%",
                              borderRadius: "9px",
                              height: "43px",
                              border: "1px solid #ced4da",
                              boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                            }}
                          >
                            <div style={{ width: "80%", padding: "8px" }}>
                              {this.state.milestoneStartDate}
                            </div>
                            <div style={{ width: "20%" }}>
                              <a style={{ float: "right" }}>
                                <DatePicker
                                  dropdownMode="select"
                                  showMonthDropdown
                                  showYearDropdown
                                  adjustDateOnChange
                                  //   maxDate={new Date()}
                                  onChange={(date) =>
                                    this.milestoneStartDateChange(date)
                                  }
                                  customInput={<Schedule />}
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-2"></div>
                      <div className="col-md-5">
                        <div className="form_rbx">
                          <span>End Start</span>
                          <div
                            className="input-group"
                            style={{
                              width: "100%",
                              borderRadius: "9px",
                              height: "43px",
                              border: "1px solid #ced4da",
                              boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                            }}
                          >
                            <div style={{ width: "80%", padding: "8px" }}>
                              {this.state.milestoneEndDate}
                            </div>
                            <div style={{ width: "20%" }}>
                              <a style={{ float: "right" }}>
                                <DatePicker
                                  dropdownMode="select"
                                  showMonthDropdown
                                  showYearDropdown
                                  adjustDateOnChange
                                  //   maxDate={new Date()}
                                  onChange={(date) =>
                                    this.milestoneEndDateChange(date)
                                  }
                                  customInput={<Schedule />}
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="web-form-bx selct">
                          <div className="_button-style _fl text-center">
                            <a
                              href="javascript:void(0)"
                              className="blue-btn"
                              style={{ textDecoration: "none", color: "#fff" }}
                              onClick={this.onAddMilestone}
                            >
                              Add
                            </a>
                            <a
                              href="javascript:void(0)"
                              className="blue-btn"
                              style={{ textDecoration: "none", color: "#fff" }}
                              onClick={this.onAddMoreMilestone}
                            >
                              Add More
                            </a>
                            <a
                              href="javascript:void(0)"
                              className="white-btn"
                              onClick={this.closeMilestoneModal}
                              style={{ textDecoration: "none" }}
                            >
                              Cancel
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ..............................add task,,,,,,,,,,,,,,,,,,,,,,,,,,, */}

        <div id="task-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="filter-head _fl mdfs taskHead">
                <h3 className="milestoneTxt">New Task</h3>
                <div className="modal-body">
                  <div className="create-jeneral-wrap _fl">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Milestone</span>
                         
                          <p>{this.state.milestoneTitle}</p>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-5">
                        <div className="form_rbx">
                          <span>Task *</span>
                          <InputText
                            type="text"
                            placeholder=""
                            className="in-field2"
                            value={this.state.taskName}
                            onTextChange={(value) => {
                              this.onTaskNameChange_modal(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-5">
                        <div className="form_rbx">
                          <span>Task Description *</span>
                          <textarea
                            rows="2"
                            placeholder=""
                            className="in-textarea msg min"
                            value={this.state.taskDescription}
                            style={{
                              height: "100px",
                              color: "var(--grey)",
                              borderRadius: "10px",
                              boxShadow: "2px",
                              resize: "none",
                            }}
                            onChange={(e) =>
                              this.onTaskDescriptionChange_modal(e)
                            }
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-md-2"></div>
                      <div className="col-md-5">
                        <div className="form_rbx">
                          <span>Owner *</span>
                          <SelectBox
                            optionData={this.state.taskOwnerArr}
                            value={this.state.selectedTaskOwner}
                            onSelectChange={(value) =>
                              this.onTaskOwnerChange_modal(value)
                            }
                          ></SelectBox>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-5">
                        <div className="form_rbx">
                          <span>Start Date *</span>
                          <div
                            className="input-group"
                            style={{
                              width: "100%",
                              borderRadius: "9px",
                              height: "43px",
                              border: "1px solid #ced4da",
                              boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                            }}
                          >
                            <div style={{ width: "80%", padding: "8px" }}>
                              {this.state.taskStartDate}
                            </div>
                            <div style={{ width: "20%" }}>
                              <a style={{ float: "right" }}>
                                <DatePicker
                                  dropdownMode="select"
                                  showMonthDropdown
                                  showYearDropdown
                                  adjustDateOnChange
                                  //   maxDate={new Date()}
                                  onChange={(date) =>
                                    this.onTaskStartDateChange_modal(date)
                                  }
                                  customInput={<Schedule />}
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-2"></div>
                      <div className="col-md-5">
                        <div className="form_rbx">
                          <span>End Date *</span>
                          <div
                            className="input-group"
                            style={{
                              width: "100%",
                              borderRadius: "9px",
                              height: "43px",
                              border: "1px solid #ced4da",
                              boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                            }}
                          >
                            <div style={{ width: "80%", padding: "8px" }}>
                              {this.state.taskEndDate}
                            </div>
                            <div style={{ width: "20%" }}>
                              <a style={{ float: "right" }}>
                                <DatePicker
                                  dropdownMode="select"
                                  showMonthDropdown
                                  showYearDropdown
                                  adjustDateOnChange
                                  //   maxDate={new Date()}
                                  onChange={(date) =>
                                    this.onTaskEndDateChange_modal(date)
                                  }
                                  customInput={<Schedule />}
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-5">
                        <div className="form_rbx">
                          <span>Status *</span>
                          <SelectBox
                            optionData={this.state.taskStatusArr}
                            value={this.state.selectedTaskStatus}
                            onSelectChange={(value) =>
                              this.onTaskStatusChange_modal(value)
                            }
                          ></SelectBox>
                        </div>
                      </div>
                      <div className="col-md-2"></div>
                      <div className="col-md-5">
                        <div className="form_rbx">
                          <span>Notes</span>
                          <textarea
                            rows="2"
                            placeholder=""
                            className="in-textarea msg min"
                            value={this.state.taskNotes}
                            style={{
                              height: "100px",
                              color: "var(--grey)",
                              borderRadius: "10px",
                              boxShadow: "2px",
                              resize: "none",
                            }}
                            onChange={(e) => this.onTaskNotesChange_modal(e)}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="web-form-bx selct">
                          <div className="_button-style _fl text-center">
                            <a
                              href="javascript:void(0)"
                              className="blue-btn"
                              style={{ textDecoration: "none", color: "#fff" }}
                              onClick={this.onAddTask}
                            >
                              Add
                            </a>
                            <a
                              href="javascript:void(0)"
                              className="white-btn"
                              onClick={this.closeTaskModal}
                              style={{ textDecoration: "none" }}
                            >
                              Cancel
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
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
