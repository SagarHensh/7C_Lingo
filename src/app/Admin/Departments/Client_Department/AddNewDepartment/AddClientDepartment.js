import React, { Component } from "react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/system";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";
import "./addClientDepartment.css";
import { ToastContainer, toast } from "react-toastify";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AlertMessage, ImageName } from "../../../../../enums";
import history from "../../../../../history";
import Multiselect from "multiselect-react-dropdown";
import {
  departmentValidator,
  inputEmptyValidate,
} from "../../../../../validators";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { ApiCall } from "../../../../../services/middleware";
import { CommonData, ErrorCode } from "../../../../../services/constant";
import { Decoder, Encoder } from "../../../../../services/auth";
import ReactLoader from "../../../../Loader";
import { MultiSelectBox, SelectBox } from "../../../SharedComponents/inputText";
import { consoleLog, getClientInfo } from "../../../../../services/common-function";
import { Link } from "react-router-dom";
import { Regex } from "../../../../../services/config";

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

const noneData = {
  text: "none",
  value: 0
}

// const parentArrdata = [{ id: 1, name: "abc" }];
export default class AddClientDepartment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      deptId: 0,
      ClientId: "",
      industry: "",
      department: "",
      parentDept: "",
      client: "",
      supervisor: "",
      location: "",
      note: "",
      lat: "",
      long: "",
      deptName: [],
      parentDeptArr: [],
      clientArr: [],
      locationArr: [],
      supervisorArr: [],
      arrDepartment: [],
      selectedValue: [],
      allAdddress: [],
      selectAddress: [],

      allActiveDepartment: [],
      selectedDepartment: {},
      selectDept: 0,
      allClientArr: [],
      selectedClient: {},
      selectClientId: 0,
      allParentDept: [],
      selectedParentDept: {},
      parentDeptId: 0,
      allSupervisorArr: [],
      selectedSupervisor: [],
      supervisorArr: [],


      arrDepartment: [],
      supervisorId: [],
      allAdddress: [],
      selectAddress: [],
      checkStatus: 0,
      allClientData: [],

      departmentData: "",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
  }


  load = async () => {
    let data = {},
      clientDataArr = [],
      clientResData = [];


    let clientinfoRes = await ApiCall("getallclinetinfo");
    if (
      clientinfoRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      clientinfoRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let clientPayload = Decoder.decode(clientinfoRes.data.payload);
      clientResData = clientPayload.data.clientlist;
      if (clientResData.length > 0) {
        for (let i = 0; i < clientResData.length; i++) {
          clientDataArr.push({
            label: clientResData[i].clientName,
            value: clientResData[i].clientid,
          });
        }
      }
    }


    this.setState({
      allClientArr: clientDataArr,
      allClientData: clientResData,
      isLoad: false
    })
  };

  clientChange = async (value) => {
    let req = {
      clientId: value.value
    };

    this.getSupervisor(req);
    this.getClientActiveDepartment(req);

    this.state.allClientData.map((data) => {
      if (data.clientid === value.value) {
        let reqObj = {
          industryType: data.industryType
        }
        this.getDepartmentByClientIndusryType(reqObj)
      }
    })

    this.setState({
      selectedClient: value,
      selectClientId: value.value,
    })
  }

  // departmentChange = (value) => {
  //   this.setState({
  //     selectedDepartment: value,
  //     selectDept: value.value
  //   })
  // }
  departmentChange = (e) => {
    var pattern = new RegExp(Regex.STRING_NUMBER_REGEX);
    if (departmentValidator(e.target.value)) {
      if (pattern.test(e.target.value)) {
        this.setState({
          departmentData: e.target.value,
        });
      }
    }
  };

  getDepartmentByClientIndusryType = async (data) => {
    let allDepartmentArr = [];
    let res = await ApiCall("fetchActiveMasterDepartmentByIndustry", data);
    if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let payload = Decoder.decode(res.data.payload);
      // consoleLog("Active Parent Department>>>", payload.data)
      if (payload.data.length > 0) {
        for (let j = 0; j < payload.data.length; j++) {
          allDepartmentArr.push({
            label: payload.data[j].department,
            value: payload.data[j].id,
          })
        }
      }
    }

    this.setState({
      allActiveDepartment: allDepartmentArr,
    })
  }

  getClientActiveDepartment = async (data) => {
    let allClientParentDepartment = [];
    let res = await ApiCall("fetchActiveClientDepartmentNew", data);
    if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let payload = Decoder.decode(res.data.payload);
      consoleLog("payload::",payload.data)
      if (payload.data.length > 0) {
        for (let j = 0; j < payload.data.length; j++) {
          allClientParentDepartment.push({
            label: payload.data[j].deptName,
            value: payload.data[j].id,
          })
        }
      }
    }

    this.setState({
      allParentDept: allClientParentDepartment,
    })
  }

  getSupervisor = async (data) => {
    let allSupervisorArr = [];
    consoleLog("super::",data)
    let res = await ApiCall("getSupervisorFromClient", data);
    if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let payload = Decoder.decode(res.data.payload);
      consoleLog("FetchParentDept>>>>", payload.data);
      if (payload.data.supervisorList.length > 0) {
        for (let j = 0; j < payload.data.supervisorList.length; j++) {
          allSupervisorArr.push({
            label: payload.data.supervisorList[j].name,
            value: payload.data.supervisorList[j].userId,
          })
        }
      }
    }

    this.setState({
      allSupervisorArr: allSupervisorArr
    })
  }

  parentDepartmentChange = (value) => {
    this.setState({
      selectedParentDept: value,
      parentDeptId: value.value
    })
  }

  supervisorChange = (value) => {
    let arr = [];
    // this.state.allSupervisorArr.map((data) => {
    //   consoleLog("val::",data)
    //   value.map((val) => {
    //     if (data.value === value.value) {
    //       arr.push({
    //         id: val.value,
    //         name: val.label
    //       })
    //     }
    //   })
    // })
    consoleLog("supervisor id::",arr)
    consoleLog("supervisor id: man data:",value)
    this.setState({
      selectedSupervisor: value,
      // supervisorId: arr
    })
  }

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

  // for status change
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

  // if user havt givee any note then i
  onNoteChange = (e) => {
    this.setState({
      note: e.target.value,
    });
  };

  onNext = async () => {
    let errorCount = 0;

    // for client add from dropdown
    if (this.state.selectClientId === undefined || this.state.selectClientId === null || this.state.selectClientId === 0) {
      toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_CLIENT_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // check for department
    if (this.state.departmentData === undefined || this.state.departmentData === null || this.state.departmentData === "") {
      toast.error(AlertMessage.MESSAGE.DEPARTMENT.DEPARTMENT_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // location field check
    if (this.state.selectAddress === undefined || this.state.selectAddress === null || this.state.selectAddress.length === 0) {
      toast.error(AlertMessage.MESSAGE.LOCATION.LOCATION_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    // this is from dropdown and can be multi select
    // if (this.state.supervisorId === undefined || this.state.supervisorId === null || this.state.supervisorId.length === 0) {
    //   toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_SUPERVISOR_EMPTY, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // }

    if (errorCount === 0) {
      let supervisorIdsArr = [];
      if (this.state.selectedSupervisor.length > 0) {
        for (let i = 0; i < this.state.selectedSupervisor.length; i++) {
          supervisorIdsArr.push(this.state.selectedSupervisor[i].value)
        }
      }

    consoleLog("supervisor id:on save:",supervisorIdsArr)
      let data = {
        masterDepartmentId: this.state.departmentData,
        parentId: this.state.parentDeptId.toString(),
        status: this.state.checkStatus ? "1" : "0",
        clientId: this.state.selectClientId,
        notes: this.state.note,
        supervisor: supervisorIdsArr,
        loc: this.state.selectAddress,
      };
      consoleLog("req data::",data);

      let res = await ApiCall("insertClientMasterDepartmentNew", data);
      if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
        toast.success(AlertMessage.MESSAGE.CLIENT.CLIENT_CREATE_SUCCESS, { hideProgressBar: true });
        return history.push("/clientDepartment");
      } else {
        if (res.error === ErrorCode.ERROR.ERROR.WITH_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.CLIENT_MAP_WITH_DEPT) {
          toast.error(AlertMessage.MESSAGE.DEPARTMENT.CLIENT_ALREADY_MAP, { hideProgressBar: true }
          );
        } else {
          toast.error(AlertMessage.MESSAGE.UPDATE.PROFILE_FAILURE, { hideProgressBar: true });
        }
      }
    }
  };

  // .....................func for cancel btn......................
  onCancel = () => {
    history.push("/clientdepartment");
  };

  render() {
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
        {/* <Header /> */}
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
              <Link to="/adminDashboard">Dashboard</Link> / <Link to="/clientDepartment">Client Department</Link> / Add Department
            </div>
          <div className="department-component-app _fl sdw">
            <h3>Add client Department</h3>
            <div className="department-form">
              <div className="row">
                <div className="col-md-5">
                  <div className="form_rbx">
                    <span className="">Client *</span>
                    <div class="dropdwn">
                      <SelectBox
                        optionData={this.state.allClientArr}
                        value={this.state.selectedClient}
                        onSelectChange={(value) => this.clientChange(value)}
                      >
                      </SelectBox>
                    </div>
                  </div>
                </div>
                <div className="col-md-2" />
                <div className="col-md-5">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Parent Department</span>
                    <div class="dropdwn">
                      <SelectBox
                        optionData={this.state.allParentDept}
                        value={this.state.selectedParentDept}
                        onSelectChange={(value) => this.parentDepartmentChange(value)}
                      >
                      </SelectBox>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="department-form">
              <div className="row">
                <div className="col-md-5">
                  <div className="form_rbx">
                    <span className="">Department *</span>
                    <input
                              type="text"
                              value={this.state.departmentData}
                              name=""
                              placeholder=""
                              class="in-field2"
                              onChange={(e) => this.departmentChange(e)}
                            />
                    {/* <div className="dropdwn">
                      <SelectBox
                        optionData={this.state.allActiveDepartment}
                        value={this.state.selectedDepartment}
                        onSelectChange={(value) => this.departmentChange(value)}
                      >
                      </SelectBox>
                    </div> */}
                  </div>
                </div>
                <div className="col-md-2" />
                <div className="col-md-5">
                  <div className="form-bx">
                    <span className="" style={{ fontSize: "13px", color: "var(--greyLight)" }}>Location *</span>
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
                      {/* <Multiselect
                        options={this.state.supervisorArr} // Options to display in the dropdown
                        selectedValues={this.state.supervisorId} // Preselected value to persist in dropdown
                        onSelect={this.onSelect} // Function will trigger on select event
                        onRemove={this.onRemove} // Function will trigger on remove event
                        displayValue="name" // Property name to display in the dropdown options
                        showCheckbox
                      /> */}
                      <MultiSelectBox
                        optionData={this.state.allSupervisorArr}
                        value={this.state.selectedSupervisor}
                        onSelectChange={(value) => this.supervisorChange(value)}
                      ></MultiSelectBox>
                    </div>
                  </div>
                </div>
                <div className="col-md-2" />
                <div className="col-md-1">
                  <div className="form_rbx">
                    {" "}
                    <span className="">status</span>
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
                          defaultChecked={this.state.checkStatus === 0 ? false : true}
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
                <div className="col-md-1 btn_status" id="client-add-acti-text">
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
                        placeholder=""
                        className="in-textarea msg min"
                        style={{ resize: "none" }}
                        value={this.state.note}
                        onChange={this.onNoteChange}
                      ></textarea>
                    </div>
                  </div>
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
        {/* </div> */}
      </React.Fragment>
    );
  }
}
