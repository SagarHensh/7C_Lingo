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
  dropDownValidate,
  inputEmptyValidate,
} from "../../../../../validators";
import history from "../../../../../history";
import { SelectBox, InputText } from "../../../SharedComponents/inputText";
import { Regex } from "../../../../../services/config";
import { ToastContainer, toast } from "react-toastify";
import { ApiCall } from "../../../../../services/middleware";
import { Decoder } from "../../../../../services/auth";
import Multiselect from 'multiselect-react-dropdown';
import { ErrorCode } from "../../../../../services/constant";
import ReactLoader from "../../../../Loader";

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
var subDeptArr = [
  { id: 0, department: "None" }
];

export default class EditDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad : true,
      editId: "",
      industry: "",
      department: "",
      subdepartment: [],
      industryName: industryArr,
      subDepartmentName: subDeptArr,
      checkStatus: false,
      selectedSubDept: [],
      mystatus: 0
    };
  }

  componentDidMount() {
    // window.$('.myDropdown').ddslick();
        window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    let selectedSubDept = [];

    let mainData = this.props.location;
    let preData = mainData.state;


    let res = await ApiCall("activeMasterDepartmentData");
    if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let pp = await Decoder.decode(res.data.payload);
      subDeptArr = pp.data;
    }

    let lookupres = await ApiCall("getLookUpData");
    if (lookupres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && lookupres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let payload = await Decoder.decode(lookupres.data.payload);
      industryArr = payload.data.lookupdata.INDUSTRY_TYPE;
    }


    let data = {
      id: preData.id
    }
    let editData = await ApiCall("fetchDetailsByDepartment", data);
    if (editData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && editData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let payload = await Decoder.decode(editData.data.payload);
      let ed = payload.data[0];
      if (ed.subs !== null) {
        let arr = ed.subs.split(",");

        arr.map((data) => {
          subDeptArr.map((sub) => {
            if (sub.id === parseInt(data)) {
              selectedSubDept.push(sub)
            }
          })
        });
      }

      let ddArr = [{
        text: "None",
        value: 0,
        selected: false
      }];
      industryArr.map((data) => {
        if (data.id === ed.industryType) {
          ddArr.push({
            text: data.name,
            value: data.id,
            selected: true
          })
        } else {
          ddArr.push({
            text: data.name,
            value: data.id,
            selected: false
          })
        }
      })
      // let idata = {};
      // industryArr.map((data) => {
      //   idata = {
      //     text: data.name,
      //     value: data.id
      //   }
      //   ddArr.push(idata);
      // })


      var classInstance = this;
      window.$('.myDropdown').ddslick({
        data: ddArr,
        onSelected: function (data) {
          var ddData = window.$('.myDropdown').data('ddslick');
          // console.log("SET>>>", data.selectedData);
          classInstance.setState({
            industry: data.selectedData.value
          });
        }
      });

      this.setState({
        editId: preData.id,
        industryName: industryArr,
        subDepartmentName: subDeptArr,
        selectedSubDept: selectedSubDept,
        department: ed.department,
        industry: ed.industryType,
        checkStatus: ed.status === 1 ? true : false,
        mystatus: ed.status,
        isLoad : false
      });

    }
  }

  onDepartmentChange = (e) => {
    var pattern = new RegExp(Regex.STRING_NUMBER_REGEX);
    if (pattern.test(e.target.value)) {
      this.setState({
        department: e.target.value,
      });
    }
  };

  onIndustryChange = (e) => {
    this.setState({
      industry: e.target.value,
    });
  };

  onSubDepartmentChange = (e) => {
    let arr = [];
    arr.push(parseInt(e.target.value));
    this.setState({
      subdepartment: arr,
    });
  };

  onStatusChange = () => {
    this.setState({
      checkStatus: !this.state.checkStatus,
    });
  };

  onNext = async () => {
    let errorCount = 0;
    let validateIndustryType = dropDownValidate(this.state.industry);
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
        industryType: parseInt(this.state.industry),
        department: this.state.department,
        status: this.state.checkStatus ? 1 : 0,
        subDept: this.state.subdepartment
      }
      let res = await ApiCall("updateMasterDepartment", data);
      if (res.error === 0 && res.respondcode === 200) {
        toast.success(AlertMessage.MESSAGE.DEPARTMENT.ADD_DEPARTMENT, { hideProgressBar: true });
        return history.push("/masterDepartment");
      } else {
        if (res.error === 1 && res.respondcode === 108) {
          toast.error(AlertMessage.MESSAGE.DEPARTMENT.DUPLICATE_DEPARTMENT, { hideProgressBar: true });
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

  }

  onRemove = (selectedList, removedItem) => {
    // console.log("selected after reemove", selectedList);
    let arr = [];
    for (let i = 0; i < selectedList.length; i++) {
      arr.push(parseInt(selectedList[i].id));
    }
    this.setState({
      subdepartment: arr
    });
  }


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
                            <span class="">Industry type</span>
                            <div class="dropdwn">
                              <select
                                className="myDropdown frm4-select"
                                value={this.state.industry}
                                onChange={this.onIndustryChange}
                              >
                                {/* <option value="">none</option>
                                {this.state.industryName.map((item, key) => (
                                  <option value={item.id} key={key}>
                                    {item.name}
                                  </option>
                                ))} */}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-4"></div>
                        <div class="col-md-4">
                          <div class="form_rbx">
                            <span class="">Create Department</span>
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
                      </div>
                      <div className="row">
                        <div className="col-md-4">
                          <div class="form_rbx">
                            <span class="">Sub-Department</span>
                            <div class="dropdwn">
                              <Multiselect
                                options={this.state.subDepartmentName} // Options to display in the dropdown
                                selectedValues={this.state.selectedSubDept} // Preselected value to persist in dropdown
                                onSelect={this.onSelect} // Function will trigger on select event
                                onRemove={this.onRemove} // Function will trigger on remove event
                                displayValue="department" // Property name to display in the dropdown options
                                showCheckbox
                              />
                              {/* <select
                                className="myDropdown frm4-select"
                                onChange={this.onSubDepartmentChange}
                              >
                                <option value="">none</option>
                                {this.state.subDepartmentName.map(
                                  (item, key) => (
                                    <option value={item.id} key={key}>
                                      {item.name}
                                    </option>
                                  )
                                )}
                              </select> */}
                            </div>
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
                                {this.state.checkStatus ?
                                  <AntSwitch
                                    checked={true}
                                    inputProps={{
                                      "aria-label": "ant design",
                                    }}
                                    name="active"
                                    onClick={() => this.onStatusChange()}
                                  /> :
                                  <AntSwitch
                                    checked={false}
                                    inputProps={{
                                      "aria-label": "ant design",
                                    }}
                                    name="active"
                                    onClick={() => this.onStatusChange()}
                                  />}
                              </Stack>
                            </FormControl>
                          </div>
                        </div>
                        <div className="col-md-1">
                          <div className="status_text" style={{marginTop:'30px'}}>
                            {this.state.checkStatus ? "Active" : "Inactive"}
                          </div>
                        </div>
                      </div>
                      <div className="row" style={{ marginTop: "10%" }}>
                        <div className="col-md-4"></div>
                        <div class="_button-style m30 _fl text-center">
                          <a
                            className="white-btn"
                            style={{ textDecoration: "none" }}
                            onClick={this.onCancel}
                          >
                            CANCEL
                          </a>
                          <a
                            className="blue-btn"
                            style={{ textDecoration: "none" }}
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
