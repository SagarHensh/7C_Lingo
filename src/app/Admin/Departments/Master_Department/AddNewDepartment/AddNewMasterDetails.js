import React, { Component } from "react";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/system";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";
import "./AddNewMasterDetails.css";
import { AlertMessage } from "../../../../../enums";
import {
  departmentValidator,
  dropDownValidate,
  inputEmptyValidate,
} from "../../../../../validators";
import history from "../../../../../history";
import {
  SelectBox,
  InputText,
  MultiSelectBox,
} from "../../../SharedComponents/inputText";
import { Regex } from "../../../../../services/config";
import { ToastContainer, toast } from "react-toastify";
import { ApiCall } from "../../../../../services/middleware";
import Multiselect from "multiselect-react-dropdown";
import { Decoder } from "../../../../../services/auth";

import { ErrorCode } from "../../../../../services/constant";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ReactLoader from "../../../../Loader";
import { consoleLog } from "../../../../../services/common-function";
import { data } from "jquery";
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
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255,255,255,.35)" : "#993921",
    boxSizing: "border-box",
  },
}));

// var industryArr = [
//   { id: 13, name: "Medical" },
//   { id: 14, name: "Legal" },
// ];
// var subDeptArr = [{ id: 0, department: "None" }];

export default class AddNewMasterDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      industry: "",
      department: "",
      subdepartment: [],
      industryArr: [],
      industryData: "",
      subDeptArr: [],
      subDeptData: {},
      subDeptDataArr: [],
      checkStatus: false,
    };
  }

  componentDidMount() {
    // window.$('.myDropdown').ddslick();
    this.load();

    // window.$('.myDropdown').ddslick({
    //   data: [{
    //     text: "None",
    //     value: ""
    //   }]
    // });
  }

  load = async () => {
    let subDeptArr = [],
      industryArr = [],
      industryArrData = [];

    let res = await ApiCall("activeMasterDepartmentData");
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(res.data.payload);
      // subDeptArr = payload.data;
      // consoleLog("subDept::", subDeptArr);

      for (let i = 0; i < payload.data.length; i++) {
        subDeptArr.push({
          label: payload.data[i].department,
          value: payload.data[i].id,
        });
      }
    }

    let lookupres = await ApiCall("getLookUpData");
    if (
      lookupres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      lookupres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(lookupres.data.payload);
      industryArr = payload.data.lookupdata.INDUSTRY_TYPE;
      // consoleLog("industry::", industryArr);

      for (let j = 0; j < industryArr.length; j++) {
        industryArrData.push({
          label: industryArr[j].name,
          value: industryArr[j].id,
        });
      }

      // let arr = [
      //   {
      //     text: "None",
      //     value: 0,
      //   },
      // ];
      // let idata = {};
      // industryArr.map((data) => {
      //   idata = {
      //     text: data.name,
      //     value: data.id,
      //   };
      //   arr.push(idata);
      // });

      // var classInstance = this;
      // window.$(".myDropdown").ddslick({
      //   data: arr,
      //   onSelected: function (data) {
      //     var ddData = window.$(".myDropdown").data("ddslick");
      //     // console.log("SET>>>", data.selectedData);
      //     classInstance.setState({
      //       industry: data.selectedData.value,
      //     });
      //   },
      // });
    }

    this.setState({
      industryArr: industryArrData,
      subDeptArr: subDeptArr,
      isLoad: false,
    });
  };

  onDepartmentChange = (e) => {
    var pattern = new RegExp(Regex.STRING_NUMBER_REGEX);
    if (departmentValidator(e.target.value)) {
      if (pattern.test(e.target.value)) {
        this.setState({
          department: e.target.value,
        });
      }
    }
  };

  onIndustryChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      industryData: obj,
    });
  };

  onSubDepartmentChange = (dat) => {
  

    // consoleLog("sub:::", arr);
    this.setState({
      subDeptData: dat,
      // subDeptDataArr: arr,
    });
  };

  onStatusChange = () => {
    this.setState({
      checkStatus: !this.state.checkStatus,
    });
  };

  onNext = async () => {
    let errorCount = 0;
    let validateIndustryType = dropDownValidate(this.state.industryData.value);
    let validateDepartment = inputEmptyValidate(this.state.department);

    if (validateIndustryType === false) {
      toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_INDUSTRY_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateDepartment === false) {
      toast.error(AlertMessage.MESSAGE.DEPARTMENT.DEPARTMENT_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      let data = {
        industryType: this.state.industryData.value,
        department: this.state.department,
        status: this.state.checkStatus ? "1" : "0",
        parentDept: this.state.subDeptData.value,
      };
      // consoleLog("SSSSS",data)
      let res = await ApiCall("insertMasterDepartmentNew", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.DEPARTMENT.ADD_DEPARTMENT, {
          hideProgressBar: true,
        });
        setTimeout(() => {
          return history.push("/masterDepartment");
        },1500)
       
      } else {
        if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.DUPLICATE_DEPT
        ) {
          toast.error(AlertMessage.MESSAGE.DEPARTMENT.DUPLICATE_DEPARTMENT, {
            hideProgressBar: true,
          });
        }
      }
    }
  };

  onCancel = () => {
    return history.push("/masterDepartment");
  };

  onSelect = (selectedList, selectedItem) => {
    // console.log("Selected vsalue", selectedItem.id);
    let arr = this.state.subdepartment;
    arr.push(parseInt(selectedItem.id));
    this.setState({
      subdepartment: arr,
    });
  };

  onRemove = (selectedList, removedItem) => {
    // console.log("selected after reemove", selectedList);
    let arr = [];
    for (let i = 0; i < selectedList.length; i++) {
      arr.push(parseInt(selectedList[i].id));
    }
    this.setState({
      subdepartment: arr,
    });
  };

  render() {
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
        <ToastContainer hideProgressBar={true} theme="colored" />
        {/* <Header />
        <Sidebar /> */}
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>
        <div class="component-wrapper" hidden={this.state.isLoad}>
        <div
              className="vn_frm"
              style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
            >
              {" "}
              <Link to="/adminDashboard">Dashboard</Link> / <Link to="/masterDepartment">Master Department</Link> / Add Department
            </div>
          <div class="breadcrumb-info _fl mainHeaderTitle">
            <ul>
              <li>
                <div
                  className="text-style"
                  style={{ fontSize: "17px", textDecoration: "none" }}
                ></div>
              </li>
            </ul>
          </div>
          <div class="department-component-app _fl sdw">
            <div class="row" id="f-box">
              <div class="col-md-12" id="f-cont">
                <div>
                  <h3 id="add-text">ADD NEW DEPARTMENT</h3>
                  <div className="form-main-body">
                    <div class="my-form" style={{ display: "block" }}>
                      <div class="row">
                        <div class="col-md-4">
                          <div class="form_rbx">
                            <span class="">Industry type *</span>
                            <div class="dropdwn">
                              {/* <select
                                className="myDropdown frm4-select"
                                onChange={this.onIndustryChange}
                              > */}
                              <SelectBox
                                optionData={this.state.industryArr}
                                value={this.state.industryData}
                                placeholder="Select"
                                onSelectChange={(value) => {
                                  this.onIndustryChange(value);
                                }}
                              />
                              {/* </select> */}
                            </div>
                          </div>
                        </div>
                        <div class="col-md-4"></div>
                        <div className="col-md-4">
                          <div class="form_rbx">
                            <span class="">Parent Department</span>
                            <div class="dropdwn">
                              <SelectBox
                                optionData={this.state.subDeptArr}
                                placeholder="Select"
                                value={this.state.subDeptData}
                                onSelectChange={(value) =>
                                  this.onSubDepartmentChange(value)
                                }
                              />
                            </div>
                          </div>
                        </div>
                   
                      </div>
                      <div className="row">
                      <div class="col-md-4">
                          <div class="form_rbx">
                            <span class="">Department *</span>
                            {/* <InputText placeholder="" className="in-field2" value={this.state.department} onTextChange={(value) => { this.onDepartmentChange(value) }} /> */}
                            <input
                              type="text"
                              value={this.state.department}
                              name=""
                              placeholder=""
                              class="in-field2"
                              onChange={(e) => this.onDepartmentChange(e)}
                            />
                          </div>
                        </div>
                        <div className="col-md-4"></div>
                        <div className="col-md-1">
                          <div class="form_rbx form_status">
                            <span class="">status</span>
                            <FormControl
                              component="fieldset"
                              variant="standard"
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <AntSwitch
                                  // defaultChecked
                                  inputProps={{
                                    "aria-label": "ant design",
                                  }}
                                  name="active"
                                  onClick={() => this.onStatusChange()}
                                />
                              </Stack>
                            </FormControl>
                          </div>
                        </div>
                        <div className="col-md-1">
                          <div
                            className="status_text mast-addnew-act-text"
                            style={{ marginTop: "30px" }}
                          >
                            {this.state.checkStatus ? "Active" : "Inactive"}
                          </div>
                        </div>
                      </div>
                      <div className="row" style={{ marginTop: "10%" }}>
                        <div className="col-md-4"></div>
                        <div class="_button-style m30 _fl text-center">
                          <a
                            href="javascript:void(0)"
                            className="white-btn"
                            style={{ textDecoration: "none" }}
                            onClick={this.onCancel}
                          >
                            CANCEL
                          </a>
                          <a
                            href="javascript:void(0)"
                            className="blue-btn"
                            style={{ textDecoration: "none", color: "#fff" }}
                            onClick={this.onNext}
                          >
                            SAVE
                          </a>
                        </div>
                        <div className="col-md-4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}
