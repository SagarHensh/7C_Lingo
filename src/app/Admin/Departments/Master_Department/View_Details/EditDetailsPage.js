import React, { Component } from "react";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/system";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";
import "./editPage.css";
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
import { Decoder } from "../../../../../services/auth";
import Multiselect from "multiselect-react-dropdown";
import { ErrorCode } from "../../../../../services/constant";
import ReactLoader from "../../../../Loader";
import { consoleLog } from "../../../../../services/common-function";
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

var industryArr = [
  { id: 13, name: "Medical" },
  { id: 14, name: "Legal" },
];
var subDeptArr = [{ id: 0, department: "None" }];

export default class EditDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      editId: "",
      industry: "",
      department: "",
      subdepartment: [],
      industryName: industryArr,
      subDepartmentName: subDeptArr,
      industryArr: [],
      industryData: "",
      subDeptArr: [],
      subDeptData: [],
      subDeptDataArr: [],
      checkStatus: false,
      selectedSubDept: {},
      mystatus: 0,
    };
  }

  componentDidMount() {
    // window.$('.myDropdown').ddslick();
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    let selectedSubDept = [];
    let subDeptArr = [],
      subDeptDArr = [],
      ll = [],
      industryArr = [],
      subDeptObjArr = [],
      mainSubDeptObjData = [],
      industryObj = {},
      objData = {},
      objArr = [],
      industryArrData = [];

    let mainData = this.props.location;
    let preData = mainData.state;

    let res = await ApiCall("activeMasterDepartmentData");
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let pp = Decoder.decode(res.data.payload);
      subDeptObjArr = pp.data;
      for (let i = 0; i < pp.data.length; i++) {
        subDeptArr.push({
          label: pp.data[i].department,
          value: pp.data[i].id,
        });
        
      }
    }

    let lookupres = await ApiCall("getLookUpData");
    if (
      lookupres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      lookupres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(lookupres.data.payload);
      industryArr = payload.data.lookupdata.INDUSTRY_TYPE;

      for (let j = 0; j < industryArr.length; j++) {
        industryArrData.push({
          label: industryArr[j].name,
          value: industryArr[j].id,
        });
      }
    }

    let data = {
      id: preData.id,
    };
    let editData = await ApiCall("fetchDetailsByDepartment", data);
    // consoleLog("()()()()", editData);
    if (
      editData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      editData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(editData.data.payload);
      let ed = payload.data[0];
      consoleLog("()()()()", ed);
      // if (ed.subs !== null) {
      //   ll = ed.subs.split(",");
      //   consoleLog("subdeptdataby fetch details", ll);
      // }

      for (let k = 0; k < industryArr.length; k++) {
        if (ed.industryType === industryArr[k].id) {
          industryObj = {
            label: industryArr[k].name,
            value: industryArr[k].id,
          };
        }
      }

      

      for (let m = 0; m < subDeptArr.length; m++) {
      
          if (subDeptArr[m].value == ed.subs) {
            objData = {
              label: subDeptArr[m].label,
              value: subDeptArr[m].value,
            };
          }
       
      }

      // if (ed.subs !== null) {
      //   let arr = ed.subs.split(",");

      //   arr.map((data) => {
      //     subDeptArr.map((sub) => {
      //       if (sub.id === parseInt(data)) {
      //         selectedSubDept.push(sub);
      //       }
      //     });
      //   });
      // }

      // let ddArr = [
      //   {
      //     text: "None",
      //     value: 0,
      //     selected: false,
      //   },
      // ];
      // industryArr.map((data) => {
      //   if (data.id === ed.industryType) {
      //     ddArr.push({
      //       text: data.name,
      //       value: data.id,
      //       selected: true,
      //     });
      //   } else {
      //     ddArr.push({
      //       text: data.name,
      //       value: data.id,
      //       selected: false,
      //     });
      //   }
      // });

      // var classInstance = this;
      // window.$(".myDropdown").ddslick({
      //   data: ddArr,
      //   onSelected: function (data) {
      //     var ddData = window.$(".myDropdown").data("ddslick");
      //     // console.log("SET>>>", data.selectedData);
      //     classInstance.setState({
      //       industry: data.selectedData.value,
      //     });
      //   },
      // });

      this.setState({
        editId: preData.id,

        industryArr: industryArrData,
        subDeptArr: subDeptArr,
        industryData: industryObj,
        subDeptdata: mainSubDeptObjData,
        subDeptDataArr : ll,

        industryName: industryArr,
        subDepartmentName: subDeptArr,
        selectedSubDept: objData,
        department: ed.department,
        industry: ed.industryType,
        checkStatus: ed.status === 1 ? true : false,
        mystatus: ed.status,
        // selectedSubDept: objArr,
        isLoad: false,
      });
    }
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
      selectedSubDept: dat,
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
    if (validateIndustryType === false) {
      toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_INDUSTRY_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    let validateDepartment = inputEmptyValidate(this.state.department);
    if (validateDepartment === false) {
      toast.error(AlertMessage.MESSAGE.DEPARTMENT.DEPARTMENT_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // let validateSubdepartment = dropDownValidate(this.state.subdepartment);
    // if (validateSubdepartment === false) {
    //   toast.error(
    //     AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_SUBDEPARTMENT_EMPTY,
    //     {
    //       hideProgressBar: true,
    //     }
    //   );
    //   errorCount++;
    // }

    if (errorCount === 0) {
      let data = {
        id: parseInt(this.state.editId),
        industryType: parseInt(this.state.industryData.value),
        department: this.state.department,
        status: this.state.checkStatus ? "1" : "0",
        parentDept: this.state.selectedSubDept.value,
      };
      consoleLog("req data:",data);
      let res = await ApiCall("updateMasterDepartmentNew", data);
      if (res.error === 0 && res.respondcode === 200) {
        toast.success(AlertMessage.MESSAGE.DEPARTMENT.ADD_DEPARTMENT, {
          hideProgressBar: true,
        });
        return history.push("/masterDepartment");
      } else {
        if (res.error === 1 && res.respondcode === 108) {
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
    let mainData = this.props.location;
    let preData = mainData.state;
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
        <ToastContainer hideProgressBar />
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
              <Link to="/adminDashboard">Dashboard</Link> / <Link to="/masterDepartment">Master Department</Link> / Edit Department
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
          <div className="department-component-app _fl sdw">
            <div className="row">
              <div class="col-md-12">
                <div>
                  <h3>EDIT DEPARTMENT</h3>
                  <div className="form-main-body">
                    <div class="my-form" style={{ display: "block" }}>
                      <div class="row">
                        <div class="col-md-4">
                          <div class="form_rbx">
                            <span class="">Industry type *</span>
                            <div class="dropdwn">
                              <SelectBox
                                optionData={this.state.industryArr}
                                value={this.state.industryData}
                                placeholder="Select"
                                onSelectChange={(value) => {
                                  this.onIndustryChange(value);
                                }}
                              />
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
                                value={this.state.selectedSubDept}
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
                                {this.state.checkStatus ? (
                                  <AntSwitch
                                    checked={true}
                                    inputProps={{
                                      "aria-label": "ant design",
                                    }}
                                    name="active"
                                    onClick={() => this.onStatusChange()}
                                  />
                                ) : (
                                  <AntSwitch
                                    checked={false}
                                    inputProps={{
                                      "aria-label": "ant design",
                                    }}
                                    name="active"
                                    onClick={() => this.onStatusChange()}
                                  />
                                )}
                              </Stack>
                            </FormControl>
                          </div>
                        </div>
                        <div className="col-md-1">
                          <div
                            className="status_text mast-edit-acti-text"
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
                            UPDATE
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
