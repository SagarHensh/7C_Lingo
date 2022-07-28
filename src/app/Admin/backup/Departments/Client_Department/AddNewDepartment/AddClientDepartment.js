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




      arrDepartment: [],
      selectDept: 0,
      selectClientId: "",
      supervisorArr: [],
      supervisorId: [],
      allAdddress: [],
      selectAddress: [],
      checkStatus: 0,
      parentDeptId: 0,
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

    // for dept
    let activeDept = await ApiCall("fetchActiveMasterDepartment", data);
    if (activeDept.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && activeDept.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      activeDepartment = Decoder.decode(activeDept.data.payload);
      var dept = [];
      for (let j = 0; j < activeDepartment.data.length; j++) {
        dept.push({
          text: activeDepartment.data[j].department,
          value: activeDepartment.data[j].id
        })
      }
      var curClassInst = this;
      window.$(".deptDropdown").ddslick({
        data: dept,
        onSelected: function (data) {
          curClassInst.setState({ selectDept: data.selectedData.value });
        }
      });


      // for client
      var client = [];
      var supervisorArray = [];
      let selectClientId = "";
      for (let j = 0; j < CommonData.COMMON.CLIENT.length; j++) {
        for (let k = 0; k < CommonData.COMMON.SUPERVISOR.length; k++) {
          if (CommonData.COMMON.CLIENT[j].id === CommonData.COMMON.SUPERVISOR[k].clientId) {
            supervisorArray.push(CommonData.COMMON.SUPERVISOR[k]);
            this.setState({
              supervisorArr: supervisorArray
            })
          }
        }
        client.push({
          text: CommonData.COMMON.CLIENT[j].name,
          value: CommonData.COMMON.CLIENT[j].id,
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
          selectClientId = data.selectedData.value;
          curClassInst.setState({ selectClientId: data.selectedData.value, supervisorArr: supervisorArray, supervisorId: [] });
        }
      });

      // parent dept
      let clientId = 0;
      if (selectClientId === undefined || selectClientId === null || selectClientId === "") {
        clientId = 0;
      } else {
        clientId = selectClientId;
      }
      let activeParentData = await ApiCall("fetchActiveParent", { "clientId": clientId });
      if (activeParentData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && activeParentData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
        activeParent = Decoder.decode(activeParentData.data.payload);
        var parentDept = [];
        parentDept.push(noneData)
        for (let j = 0; j < activeParent.data.length; j++) {
          parentDept.push({
            text: activeParent.data[j].name,
            value: activeParent.data[j].id,
          })
        }
        window.$(".parentDeptDropdown").ddslick({
          data: parentDept,
          onSelected: function (data) {
            curClassInst.setState({ parentDeptId: data.selectedData.value });
          }
        });
      }
      this.setState({
        arrDepartment: activeDepartment.data,
        isLoad: false
      })
    }
  };

  onSelect = (selectedList, selectedItem) => {
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

  onRemove = (selectedList, removedItem) => {
    let arr = [];
    for (let i = 0; i < selectedList.length; i++) {
      arr.push({ id: selectedList[i].id, name: selectedList[i].name });
    }
    this.setState({
      supervisorId: arr
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
    // check for department
    if (this.state.selectDept === undefined || this.state.selectDept === null || this.state.selectDept === 0) {
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

    // for client add from dropdown
    if (this.state.selectClientId === undefined || this.state.selectClientId === null || this.state.selectClientId === 0) {
      toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_CLIENT_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    // this is from dropdown and can be multi select
    if (this.state.supervisorId === undefined || this.state.supervisorId === null || this.state.supervisorId.length === 0) {
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
        status: this.state.checkStatus ? "1" : "0",
        clientId: this.state.selectClientId,
        notes: this.state.note,
        supervisor: supervisorIdsArr,
        loc: this.state.selectAddress,
      };

      let res = await ApiCall("insertClientMasterDepartment", data);
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
        <ToastContainer />
        {/* <Sidebar /> */}
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>
        <div className="component-wrapper" hidden={this.state.isLoad}>
          <div className="department-component-app _fl sdw">
            <h3>Add client Department</h3>
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
                        onSelect={this.onSelect} // Function will trigger on select event
                        onRemove={this.onRemove} // Function will trigger on remove event
                        displayValue="name" // Property name to display in the dropdown options
                        showCheckbox
                      />
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
                        placeholder=""
                        className="in-textarea msg min"
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
