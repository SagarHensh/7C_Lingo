import React, { Component } from "react";
import { styled, Box } from "@mui/system";
import Switch from "@mui/material/Switch";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import { ToastContainer, toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";
import ModalUnstyled from "@mui/core/ModalUnstyled"; //imported forr modal
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./editClientDetails.css";
import history from "../../../../../history";
import { InputText } from "../../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../../enums";
import { departmentValidator, inputEmptyValidate } from "../../../../../validators";
import { ApiCall } from "../../../../../services/middleware";
import { Decoder } from "../../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../../services/constant";
import Multiselect from 'multiselect-react-dropdown';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
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
    borderRadius: 11
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255,255,255,.35)" : "#993921",
    boxSizing: "border-box",
  },
}));

const listData = [{
  contactName: "David sigh patel",
  Departments: "Doctor",
  ClinetID: 323,
  EmailID: "David@gmail.com",
  phone: "623629979",
  status: "active"
}, {
  contactName: "David sigh patel",
  Departments: "Doctor2",
  ClinetID: 323,
  EmailID: "David@gmail.com",
  phone: "623629979",
  status: "active"
}, {
  contactName: "David sigh patel",
  Departments: "Doctor3",
  ClinetID: 323,
  EmailID: "David@gmail.com",
  phone: "623629979",
  status: "active"
}, {
  contactName: "David sigh patel",
  Departments: "Doctor4",
  ClinetID: 323,
  EmailID: "David@gmail.com",
  phone: "623629979",
  status: "active"
}]

const noneData = {
  text: "none",
  value: 0,
  selected: false
}
const noneStData = {
  text: "none",
  value: "",
  selected: false
}

export default class EditClientDetails extends Component {
  constructor(props) {
    super(props);
    const mainData = this.props.location;
    const preData = mainData.state;
    this.state = {
      editId: preData.id,
      isLoad: true,
      checkStatus: 0,
      parentDeptId: "",
      uclient: "",
      usupervisor: "",
      parentDeptArr: [],
      clientArr: [],
      supervisorArr: [],
      deptArr: [],
      deptName: "",
      listData: [],
      checked: "",

      selectDept: '',
      selectClientId: '',
      supervisorId: [],
      note: "",
      allAdddress: [],
      tempAddress: [],
      lat: "",
      long: "",
      selectAddress: [],
      finalSelectAddress: [],
      supervisorCheck: true,
      allListData: []
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    let data = {},
      allActiveUsers = [],
      activeParent = [],
      activeDepartment = [],
      fetchActiveUserDetails = [],
      listArrData = [];
    let fetchActiveUser = await ApiCall("fetchAllActiveUsers", data);
    if (fetchActiveUser.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && fetchActiveUser.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      allActiveUsers = Decoder.decode(fetchActiveUser.data.payload);
      let activeDept = await ApiCall("fetchActiveMasterDepartment", data);
      if (activeDept.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && activeDept.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
        activeDepartment = Decoder.decode(activeDept.data.payload);
        let fetchActiveUserDet = await ApiCall("fetchDetailsByClientDepartment", { id: this.state.editId });
        if (fetchActiveUserDet.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && fetchActiveUserDet.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {

          fetchActiveUserDetails = Decoder.decode(fetchActiveUserDet.data.payload);
          let arr = fetchActiveUserDetails.data[0].user.split(",");
          let selectedSubDept = [];
          let selectAdd = [];
          arr.map((data) => {
            allActiveUsers.data.map((sub) => {
              if (sub.id === data) {
                selectedSubDept.push(sub)
              }
            })
          });
          let activeParentData = await ApiCall("fetchActiveParent", { "clientId": fetchActiveUserDetails.data[0].clientid });
          if (activeParentData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && activeParentData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            activeParent = Decoder.decode(activeParentData.data.payload);
            let allClientListData = await ApiCall("fetchClientDepartmentDetailsByParentid", { "parentid": this.state.editId });
            if (allClientListData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && allClientListData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
              listArrData = Decoder.decode(allClientListData.data.payload);
              for (let i = 0; i < fetchActiveUserDetails.data[0].loc.length; i++) {
                selectAdd.push({
                  "lat": fetchActiveUserDetails.data[0].loc[i].lat,
                  "long": fetchActiveUserDetails.data[0].loc[i].lng,
                  "location": fetchActiveUserDetails.data[0].loc[i].location
                })
              }

              // for dept
              var dept = [];
              for (let j = 0; j < activeDepartment.data.length; j++) {
                let isSelectDept = false;
                if (fetchActiveUserDetails.data[0].masterDepartmentId === activeDepartment.data[j].id) {
                  isSelectDept = true;
                }
                dept.push({
                  text: activeDepartment.data[j].department,
                  value: activeDepartment.data[j].id,
                  selected: isSelectDept
                })
              }
              var curClassInst = this;
              window.$(".deptDropdown").ddslick({
                data: dept,
                onSelected: async function (data) {
                  curClassInst.setState({ selectDept: data.selectedData.value });
                }
              });

              // for parent dept
              var parentDept = [];
              for (let j = 0; j < activeParent.data.length; j++) {
                let isSelectParentDept = false;
                if (fetchActiveUserDetails.data[0].parentId === activeParent.data[j].id) {
                  isSelectParentDept = true;
                }
                parentDept.push({
                  text: activeParent.data[j].name,
                  value: activeParent.data[j].id,
                  selected: isSelectParentDept
                })
              }
              window.$(".parentDeptDropdown").ddslick({
                data: parentDept,
                onSelected: function (data) {
                  curClassInst.setState({ parentDeptId: data.selectedData.value });
                }
              });

              // for client
              var client = [];
              var supervisorArray = [];
              for (let j = 0; j < CommonData.COMMON.CLIENT.length; j++) {
                let isSelectClient = false;
                if (fetchActiveUserDetails.data[0].clientid === CommonData.COMMON.CLIENT[j].id) {
                  for (let k = 0; k < CommonData.COMMON.SUPERVISOR.length; k++) {
                    if (CommonData.COMMON.CLIENT[j].id === CommonData.COMMON.SUPERVISOR[k].clientId) {
                      supervisorArray.push(CommonData.COMMON.SUPERVISOR[k]);
                      this.setState({
                        supervisorArr: supervisorArray
                      })
                    }
                  }
                  isSelectClient = true;
                }
                client.push({
                  text: CommonData.COMMON.CLIENT[j].name,
                  value: CommonData.COMMON.CLIENT[j].id,
                  selected: isSelectClient
                })
              }
              window.$(".clientDropdown").ddslick({
                data: client,
                onSelected: function (data) {
                  supervisorArray = [];
                  for (let k = 0; k < CommonData.COMMON.SUPERVISOR.length; k++) {
                    if (data.selectedData.value === CommonData.COMMON.SUPERVISOR[k].clientId) {
                      supervisorArray.push(CommonData.COMMON.SUPERVISOR[k]);
                    }
                  }
                  curClassInst.setState({ selectClientId: data.selectedData.value, supervisorCheck: false, supervisorArr: supervisorArray, supervisorId: [] });
                }
              });
              this.setState({
                selectAddress: selectAdd,
                selectDept: fetchActiveUserDetails.data[0].masterDepartmentId,
                parentDeptId: fetchActiveUserDetails.data[0].parentId,
                selectClientId: fetchActiveUserDetails.data[0].clientid,
                supervisorId: selectedSubDept,
                checkStatus: fetchActiveUserDetails.data[0].status,
                note: fetchActiveUserDetails.data[0].notes,
                deptArr: activeDepartment.data,
                parentDeptArr: activeParent.data,
                clientArr: CommonData.COMMON.CLIENT,
                listData: listData,
                allListData: listArrData.data,
                // allListData: cData,
                isLoad: false
              })
            }
          }
        }
      }
    }
  }

  onDeptChange = (e) => {
    this.setState({
      selectDept: e.target.value
    })
  }

  onParentDeptChange = (e) => {
    this.setState({
      parentDeptId: e.target.value,
    });
  };

  onClientChange = (e) => {
    this.setState({
      selectClientId: e.target.value,
    });
  };

  onSupervisorChange = (selectedList, selectedItem) => {
    let arr = this.state.supervisorId;
    for (let i = 0; i < this.state.supervisorArr.length; i++) {
      if (this.state.supervisorArr[i].id === selectedItem.id) {
        arr.push({
          id: selectedItem.id,
          name: this.state.supervisorArr[i].name
        });
        this.setState({
          supervisorId: arr
        });
      }
    }
  };

  onSupervisorRemove = (selectedList, selectedItem) => {
    let arr = [];
    for (let i = 0; i < selectedList.length; i++) {
      arr.push({ id: selectedList[i].id, name: selectedList[i].name });
    }
    this.setState({
      supervisorId: arr
    });
  }

  onStatusChange = () => {
    let stat = 0;
    if (this.state.checkStatus === 0) {
      stat = 1;
    } else {
      stat = 0;
    }
    this.setState({
      checkStatus: stat
    });
  };

  locationData = async (e) => {
    if (e.target.value.length >= 3) {
      let locationData = await ApiCall("getlocaiondescription", { "place": e.target.value });
      if (locationData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && locationData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
        let locationArr = Decoder.decode(locationData.data.payload);
        this.setState({
          allAdddress: locationArr.data.locaionsuggesion
        })
      }
    }
  }

  onLocationSelect = async (event, value, reason, details) => {
    let locateAdd = this.state.selectAddress;
    for (let i = 0; i < this.state.allAdddress.length; i++) {
      if (this.state.allAdddress[i].description === value) {
        let locationData = await ApiCall("getcoordinatefromplaceid", { "placeid": this.state.allAdddress[i].placeid });
        if (locationData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && locationData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
          let locationArr = Decoder.decode(locationData.data.payload);
          let findCount = 0;
          for (let j = 0; j < locateAdd.length; j++) {
            if (this.state.allAdddress[i].description === locateAdd[j]) {
              findCount++;
            }
          }
          if (findCount === 0) {
            locateAdd.push({
              lat: locationArr.data.coordinatedetails[0].lat,
              long: locationArr.data.coordinatedetails[0].lng,
              location: this.state.allAdddress[i].description
            })
            this.setState({
              selectAddress: locateAdd,
            })
          }
        }
      }
    }
  }

  removeAddress = (index) => {
    let selectAddress = this.state.selectAddress;
    selectAddress.splice(index, 1);
    this.setState({
      selectAddress: selectAddress
    })
  }

  onSubmit = async () => {
    let errorCount = 0;

    // check for department
    if (this.state.selectDept === undefined || this.state.selectDept === "" || this.state.selectDept === 0) {
      toast.error(AlertMessage.MESSAGE.DEPARTMENT.DEPARTMENT_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else {
      let lengthDeptCheck = departmentValidator(this.state.selectDept);
      if (lengthDeptCheck === false) {
        toast.error(AlertMessage.MESSAGE.DEPARTMENT.DEPARTMENT_MAX_LENGTH, {
          hideProgressBar: true,
        });
        errorCount++;
      }
    }

    // location field check
    if (this.state.selectAddress.length === 0 || this.state.selectAddress === undefined || this.state.selectAddress === null) {
      toast.error(AlertMessage.MESSAGE.LOCATION.LOCATION_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    // for parent department check
    if (this.state.parentDeptId === undefined || this.state.parentDeptId === null || this.state.parentDeptId === "") {
      toast.error(
        AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_PARENTDEPARTMENT_EMPTY,
        {
          hideProgressBar: true,
        }
      );
      errorCount++;
    }

    // for client add from dropdown
    let validateClientDepartment = inputEmptyValidate(this.state.selectClientId);
    if (validateClientDepartment === false) {
      toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_CLIENT_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    // this is from dropdown and can be multi select
    if (this.state.supervisorId.length === 0 || this.state.supervisorId === undefined || this.state.supervisorId === null) {
      toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_SUPERVISOR_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }


    if (errorCount === 0) {
      let supervisorIdsArr = [];
      for (let i = 0; i < this.state.supervisorId.length; i++) {
        supervisorIdsArr.push(this.state.supervisorId[i].id)
      }
      let data = {
        masterDepartmentId: this.state.selectDept,
        parentId: this.state.parentDeptId.toString(),
        clientId: this.state.selectClientId,
        loc: this.state.selectAddress,
        supervisorId: supervisorIdsArr,
        status: this.state.checkStatus === 0 ? '0' : '1',
        notes: this.state.note,
        id: this.state.editId
      }
      let clientUpdateData = await ApiCall("updateClientDepartment", data);
      if (clientUpdateData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && clientUpdateData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
        return history.push("/clientdepartment");
      } else {
        if (clientUpdateData.error === ErrorCode.ERROR.ERROR.WITH_ERROR && clientUpdateData.respondcode === ErrorCode.ERROR.ERROR_CODE.CLIENT_MAP_WITH_DEPT) {
          toast.error(AlertMessage.MESSAGE.DEPARTMENT.CLIENT_ALREADY_MAP, {
            hideProgressBar: true,
          });
        } else {
          toast.error(AlertMessage.MESSAGE.UPDATE.PROFILE_FAILURE, {
            hideProgressBar: true,
          });
        }
      }
    }
  };

  // .....................func for cancel btn......................

  onCancel = () => {
    return history.push("/clientdepartment");
  };

  onAdd = () => {
    return history.push("/addClientDepartment");
  }

  onTextChange = (e) => {
    this.setState({
      note: e.target.value
    })
  }


  render() {
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
        {/* <Header /> */}
        <ToastContainer />
        {/* <Sidebar /> */}
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>
        <div className="component-wrapper" hidden={this.state.isLoad}>
          <div className="department-component-app _fl sdw">
            <h3>Edit client Department</h3>
            <div className="department-form">
              <div className="row">
                <div className="col-md-5">
                  <div className="form_rbx">
                    <span className="">Department</span>
                    <div className="dropdwn">
                      <select className="deptDropdown">
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-2" />
                <div className="col-md-5">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Parent Department</span>
                    <div class="dropdwn">
                      <select className="parentDeptDropdown">
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="department-form">
              <div className="row">
                <div className="col-md-5">
                  <div className="form_rbx">
                    <span className="">Client</span>
                    <div class="dropdwn">
                      <select className="clientDropdown">
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-2" />
                <div className="col-md-5">
                  <div className="web-form-bx">
                    <span className="" style={{ fontSize: "13px", color: "var(--greyLight)" }}>Location</span>
                    <div class="dropdwn">
                      <Stack spacing={2} style={{ marginTop: '15px' }}>
                        <Autocomplete
                          id="free-solo-demo"
                          freeSolo
                          size="small"
                          onChange={(event, value, reason, details) => this.onLocationSelect(event, value, reason, details)}
                          options={this.state.allAdddress.map((option) => option.description)}
                          renderInput={(params) => <TextField onChange={this.locationData} {...params} />}
                        />
                      </Stack>
                      {this.state.selectAddress.map((item, key) => (
                        <React.Fragment key={key}>
                          <span className="span_loc">
                            {item.location}
                            <img
                              onClick={() => this.removeAddress(key)}
                              src={ImageName.IMAGE_NAME.CLOSE_BTN}
                              className="close-img"
                            />
                          </span>
                        </React.Fragment>
                      ))}
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
                    <span className="">Supervisor [s]</span>
                    <div className="dropdwn">
                      <Multiselect
                        options={this.state.supervisorArr} // Options to display in the dropdown
                        selectedValues={this.state.supervisorId} // Preselected value to persist in dropdown
                        onSelect={this.onSupervisorChange} // Function will trigger on select event
                        onRemove={this.onSupervisorRemove} // Function will trigger on remove event
                        displayValue="name" // Property name to display in the dropdown options
                        showCheckbox
                        disable={this.state.supervisorCheck}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-2" />
                <div className="col-md-1">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Status</span>
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
                          checked={this.state.checkStatus === 0 ? false : true}
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
                <div className="col-md-1 btn_status">
                  <div className="status_text">
                    {this.state.checkStatus === 1 ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            </div>
            <div className="department-form">
              <div className="row">
                <div className="col-md-5">
                  <div className="web-form-bx">
                    <div class="dropdwn">
                      {" "}
                      <span className="" style={{ fontSize: "13px", color: "var(--greyLight)" }}>Notes</span>
                      <textarea
                        onChange={this.onTextChange}
                        placeholder="......."
                        className="in-textarea3 min"
                        value={this.state.note}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="department-tanle-app _fl sdw tbl_two">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                {" "}
                <a
                  className="nav-link active"
                  data-toggle="tab"
                  href="#sub-departments"
                >
                  sub-departments
                </a>{" "}
              </li>
              <li className="nav-item">
                {" "}
                <a className="nav-link" data-toggle="tab" href="#users">
                  users
                </a>{" "}
              </li>
            </ul>
            <div className="tab-content">
              <div className="tab-pane  active" id="sub-departments">
                <div className="depr_table">
                  <div className="table-responsive">
                    <table
                      style={{ width: "100%", border: "0" }}
                      cellPadding="0"
                      cellSpacing="0"
                    >
                      <tr>
                        {/* <th style={{ width: "5%" }}>
                          <label className="custom_check2">
                            <input type="checkbox" />
                            <span className="checkmark2"></span>
                          </label>
                        </th> */}
                        <th style={{ width: "60%" }}>Sub department Name</th>
                        <th style={{ width: "20%" }}>No of Users</th>
                        {/* <th style={{ width: "40%" }}>Supervisor</th> */}
                        <th style={{ width: "20%" }}>Status</th>
                      </tr>
                      {this.state.allListData.map((item, key) => (
                        <tr>
                          {/* <td style={{ width: "5%" }}>
                            <label class="custom_check2 lbl">
                              <input type="checkbox" />
                              <span class="checkmark2"></span>
                            </label>
                          </td> */}
                          <td style={{ width: "60%" }}>{item.department}</td>
                          <td style={{ width: "20%" }}>{item.usercount} </td>
                          {/* <td style={{ width: "10%" }}>{item.name}</td> */}
                          <td style={{ width: "20%" }}>
                            <a href="#" class="activelink">
                              {item.status === 1 ? "ACTIVE" : "INACTIVE"}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </table>
                  </div>
                </div>
              </div>

              <div class="tab-pane  fade" id="users">
                <div class="mw-wrap">
                  <div class="dd-item">
                    <a href="javascript:void(0);" class="move_drop">
                      Move
                    </a>
                    <div class="filter-drop-links" id="dd_menu_move">
                      <div class="filter-head _fl">
                        <h3 class="moveto">Move to</h3>
                        <div class="reset-btn">
                          <button class="cancel">CANCEL</button>
                          <button class="apply">MOVE</button>
                        </div>
                      </div>
                      <div class="filter-mofification">
                        <div class="_fl">
                          <div class="row">
                            <div class="col-md-12">
                              <div class="lable-text">Select Department</div>
                              <div class="dropdwn">
                                <select class="frm4-select" id="location">
                                  <option>Select</option>
                                  <option>Translation</option>
                                  <option>Interpretation</option>
                                  <option>Subtitling</option>
                                  <option>Voice Over</option>
                                  <option>Transcription</option>
                                  <option>Localizaton</option>
                                  <option>Braillie</option>
                                  <option>Training</option>
                                  <option>
                                    I want to make a general enquiry
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="_fl">
                          <div class="row">
                            <div class="col-md-12">
                              <div class="lable-text">Contact Name</div>
                              <div class="dropdwn">
                                <select class="frm4-select" id="contactName">
                                  <option>Select</option>
                                  <option>Translation</option>
                                  <option>Interpretation</option>
                                  <option>Subtitling</option>
                                  <option>Voice Over</option>
                                  <option>Transcription</option>
                                  <option>Localizaton</option>
                                  <option>Braillie</option>
                                  <option>Training</option>
                                  <option>
                                    I want to make a general enquiry
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="dd-item" onClick={this.onAdd}>
                    <a href="" class="add_drop">
                      Add
                    </a>
                  </div>
                </div>
                <div class="depr_table">
                  <div class="table-responsive">
                    <table
                      style={{ width: "100%", border: "0" }}
                      cellPadding="0"
                      cellSpacing="0"
                    >
                      <tr>
                        <th style={{ width: "5%" }}>
                          <label class="custom_check2">
                            <input type="checkbox" />
                            <span class="checkmark2"></span>
                          </label>
                        </th>
                        <th style={{ width: "20%" }}>Contact Name</th>
                        <th style={{ width: "15%" }}>Departments</th>
                        <th style={{ width: "10%" }}>Clinet ID</th>
                        <th style={{ width: "15%" }}>Email ID</th>
                        <th style={{ width: "15%" }}>Phone Number</th>
                        <th style={{ width: "7%" }}>Status</th>
                        <th style={{ width: "13%", textAlign: "center" }}>
                          Action
                        </th>
                      </tr>
                      {this.state.listData.map((item, key) => (
                        <tr>
                          <td style={{ width: "5%" }}>
                            <label class="custom_check2 lbl">
                              <input type="checkbox" />
                              <span class="checkmark2"></span>
                            </label>
                          </td>
                          <td style={{ width: "20%" }}>{item.contactName}</td>
                          <td style={{ width: "15%" }}>{item.Departments} </td>
                          <td style={{ width: "10%" }}>{item.ClinetID}</td>
                          <td style={{ width: "15%" }}>{item.EmailID}</td>
                          <td style={{ width: "15%" }}>{item.phone}</td>
                          <td style={{ width: "7%" }}>
                            <a href="#" class="activelink">
                              {item.status}
                            </a>
                          </td>
                          <td
                            style={{ width: "13%", textAlign: "center" }}
                            class="action-link"
                          >
                            <a href="#">
                              <img src={ImageName.IMAGE_NAME.EYE_BTN} />
                            </a>
                            <a href="#">
                              <img src={ImageName.IMAGE_NAME.TRASH_BTN} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="_button-style m30 _fl text-center">
              <a
                className="white-btn"
                style={{ textDecoration: "none" }}
                onClick={this.onCancel}
              >
                back
              </a>
              <a
                className="blue-btn"
                style={{ textDecoration: "none" }}
                onClick={this.onSubmit}
              >
                submit
              </a>
            </div>
          </div>
        </div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}
