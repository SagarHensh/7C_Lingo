import React, { Component } from "react";
import { styled, Box } from "@mui/system";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import { ToastContainer, toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";
import ModalUnstyled from "@mui/core/ModalUnstyled"; //imported forr modal
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import "../../../Admin/Departments/Client_Department/View_Details/EditClientDetails/editClientDetails.css";
import history from "../../../../history";
import { InputText, MultiSelectBox, SelectBox } from "../../../Admin/SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../enums";
import { departmentValidator, inputEmptyValidate } from "../../../../validators";
import { ApiCall, ApiCallClient } from "../../../../services/middleware";
import { Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import Multiselect from 'multiselect-react-dropdown';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ReactLoader from "../../../Loader";
import { consoleLog } from "../../../../services/common-function";
import { Link } from "react-router-dom";
import { Regex } from "../../../../services/config";

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

export default class EditDepartmentClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editId: "",
      isLoad: true,
      checkStatus: 0,
      parentDeptId: "",
      uclient: "",
      usupervisor: "",
      parentDeptArr: [],
      clientArr: [],
      deptArr: [],
      deptName: "",
      listData: [],
      checked: "",


      supervisorId: [],
      note: "",
      allAdddress: [],
      tempAddress: [],
      lat: "",
      long: "",
      selectAddress: [],
      finalSelectAddress: [],
      supervisorCheck: true,
      allListData: [],




      allActiveDepartment: [],
      selectedDepartment: {},
      selectDept: 0,
      allClientArr: [],
      selectedClient: {},
      selectClientId: "",
      allParentDept: [],
      selectedParentDept: {},
      parentDeptId: 0,
      allSupervisorArr: [],
      selectedSupervisor: [],
      supervisorArr: [],
      masterDepartmentId: '',
      noOfUsers: 0,
      userDetails: [],

      departmentData: ""
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const mainData = this.props.location;
    const preData = mainData.state;
    // console.log("preData=>>",preData);
    if (preData === undefined) {
      return history.push("/departmentClient")
    } else {
      this.setState({
        editId: preData.id
      })
      // this.load();
      this._onLoad(preData.id)
    }
  }

  _onLoad = async (clid) => {
    // this.setState({
    //   isLoad:false
    // })
    let allClientDataArr = [],
      clientResData = [],
      deptDetails = [],
      allSupervisorArr = [],
      allClientParentDepartment = [],
      allDepartmentArr = [],
      selectedClient = {},
      tempselectedDepartment = {},
      selectedParentDept = {},
      arr = [],
      subDeptArr = [],
      activeParent = [],
      activeDeptObj = {},
      activeDepartment = [],
      locationAddress = [];





    // ................................................

    let clientinfoRes = await ApiCall("getallclinetinfo");
    if (
      clientinfoRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      clientinfoRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let clientPayload = Decoder.decode(clientinfoRes.data.payload);
      clientResData = clientPayload.data.clientlist;
      if (clientResData.length > 0) {
        for (let i = 0; i < clientResData.length; i++) {
          allClientDataArr.push({
            label: clientResData[i].clientName,
            value: clientResData[i].clientid,
          });
        }
      }
    }

    consoleLog("clientId=>>", clid);

    let editRes = await ApiCall("fetchDetailsByClientDepartment", { id: clid });
    let tempSubDept = [];
    let tempSupVisorList = [];
    if (editRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      editRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let clientDeptDetails = Decoder.decode(editRes.data.payload);
      deptDetails = clientDeptDetails.data[0];
      this.state.masterDepartmentId = deptDetails.masterDepartmentId;
      consoleLog("Fetch Client department data>>>>", clientDeptDetails);
      var req = {
        clientId: clientDeptDetails.data[0].clientId
      }

      allSupervisorArr = await this.getSupervisor(req);
      // consoleLog("allSuper>>>>", allSupervisorArr);
      allClientParentDepartment = await this.getClientActiveDepartment(req);
      // consoleLog("allClientParentDepartment=>>",allClientParentDepartment);


      let activeDept = await ApiCall("fetchActiveMasterDepartment", {});
      if (activeDept.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && activeDept.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
        activeDepartment = Decoder.decode(activeDept.data.payload);

        // let payload = await Decoder.decode(activeDept.data.payload);
        subDeptArr = activeDepartment.data;
        consoleLog("dept::::", subDeptArr)
        var dept = [];
        for (let j = 0; j < activeDepartment.data.length; j++) {
          dept.push({
            label: activeDepartment.data[j].department,
            value: activeDepartment.data[j].id
          })
          if (deptDetails.masterDepartmentId == activeDepartment.data[j].id) {
            activeDeptObj = {
              label: activeDepartment.data[j].department,
              value: activeDepartment.data[j].id
            }
          }
        }
        var curClassInst = this;
        consoleLog("dept: Arr:::", dept)
        consoleLog("dept: obj:::", activeDeptObj)

        this.setState({
          allActiveDepartment: dept,
          selectedDepartment: activeDeptObj
        })
      }

      // ........................................................




      // clientResData.map(async (data) => {
      //   if (data.clientid === clientDeptDetails.data[0].clientId) {
      //     let reqObj = {
      //       industryType: data.industryType
      //     }
      //     allDepartmentArr = await this.getDepartmentByClientIndusryType(reqObj);
      //     console.log("==>>", allDepartmentArr)


      //     allClientParentDepartment.map((aa) => {
      //       if (aa.value === deptDetails.id) {
      //         tempselectedDepartment = aa;
      //       }
      //     });
      //     this.setState({
      //       selectedDepartment: tempselectedDepartment,
      //       selectDept: tempselectedDepartment.value
      //     })
      //   }
      // })

      allClientDataArr.map((aa) => {
        if (aa.value === deptDetails.clientId) {
          selectedClient = aa
        }
      });
      if (deptDetails.parentId !== 0) {
        allClientParentDepartment.map((aa) => {
          if (aa.value === deptDetails.parentId) {
            selectedParentDept = aa
          }
        });
      }


      // if (deptDetails.subDept.length !== 0) {
      //   let allUserDepartment = [];
      //   for(let i=0;i<deptDetails.subDept.length;i++){
      //     allUserDepartment = await this.getDepartmentUserDetails({"deptId":deptDetails.subDept[i].id});
      //     tempSubDept.push({
      //       label:deptDetails.subDept[i].department,
      //       value:deptDetails.subDept[i].id
      //     })
      //   }
      // }

      // if (deptDetails.superVisorList.length !== 0) {
      //   allSupervisorArr.map((txt1)=>{
      //     for(let i=0;i<deptDetails.superVisorList.length;i++){
      //       if(txt1.value === deptDetails.superVisorList[i].superVisor){
      //         tempSupVisorList.push({
      //           label:deptDetails.superVisorList[i].name,
      //           value:deptDetails.superVisorList[i].superVisor
      //         });
      //       }
      //     }
      //   })

      // }
      if (deptDetails.superVisorList.length > 0) {
        let aaa = [],
          obj = [];
        deptDetails.superVisorList.map((aa) => {
          allSupervisorArr.map((sup) => {
            if (aa === sup.value) {
              aaa.push({
                id: sup.value,
                name: sup.label
              });
              obj.push({
                label: sup.label,
                value: sup.value
              })
            }
          })
        })
        this.setState({
          supervisorId: aaa,
          selectedSupervisor: obj
        })
      }


      if (deptDetails.deptLocation.length > 0) {
        deptDetails.deptLocation.map((loc) => {
          locationAddress.push({
            lat: loc.lat,
            long: loc.lng,
            location: loc.location
          })
        })
      }
    }

    this.setState({
      allClientArr: allClientDataArr,
      allClientData: clientResData,
      allSupervisorArr: allSupervisorArr,
      allParentDept: allClientParentDepartment,
      // allActiveDepartment: allDepartmentArr,
      selectedClient: selectedClient,
      selectClientId: deptDetails.clientId,
      // selectedParentDept: tempSubDept,
      selectedParentDept: selectedParentDept,

      departmentData: deptDetails.deptName,
      parentDeptId: deptDetails.parentId,
      selectAddress: locationAddress,
      checkStatus: deptDetails.status,
      note: deptDetails.notes,
      // selectedSupervisor: tempSupVisorList,
      supervisorId: tempSupVisorList,
      isLoad: false,
    })

    // console.log("selected supervisor=>",this.state.selectedSupervisor)
  }

  getDepartmentUserDetails = async (data) => {
    consoleLog("SubDeptId=>>", data);
    let res = await ApiCallClient("fetchUserDetailByDeptClient", data);
    if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let clientDeptDetails = Decoder.decode(res.data.payload);
      // consoleLog("User Client department data>>>>", clientDeptDetails.data.userDetails);
      this.setState({
        noOfUsers: clientDeptDetails.data.noOfUsers,
        userDetails: clientDeptDetails.data.userDetails
      });
    }
  }




  departmentChange = (e) => {
    var pattern = new RegExp(Regex.STRING_NUMBER_REGEX);
    if (departmentValidator(e.target.value)) {
      if (pattern.test(e.target.value)) {
        this.setState({
          departmentData: e.target.value,
        });
      }
    }
    // console.log("jnjkdncje",this.state.selectedDepartment,"njcjd",this.state.selectDept)
  }

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
      selectClientId: value.value
    })
  }

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

    return allDepartmentArr;
  }

  getClientActiveDepartment = async (data) => {
    let allClientParentDepartment = [];
    let res = await ApiCall("fetchActiveClientDepartment", data);
    if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let payload = Decoder.decode(res.data.payload);
      if (payload.data.length > 0) {
        for (let j = 0; j < payload.data.length; j++) {
          allClientParentDepartment.push({
            label: payload.data[j].department,
            value: payload.data[j].id,
          })
        }
      }
    }

    // this.setState({
    //   allParentDept: allClientParentDepartment,
    // })

    return allClientParentDepartment;
  }

  getSupervisor = async (data) => {
    let allSupervisorArr = [];
    let res = await ApiCall("getSupervisorFromClient", data);
    if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let payload = Decoder.decode(res.data.payload);
      if (payload.data.supervisorList.length > 0) {
        for (let j = 0; j < payload.data.supervisorList.length; j++) {
          allSupervisorArr.push({
            label: payload.data.supervisorList[j].name,
            value: payload.data.supervisorList[j].userId,
          })
        }
      }
    }

    // this.setState({
    //   allSupervisorArr: allSupervisorArr
    // })

    return allSupervisorArr;
  }

  parentDepartmentChange = (value) => {
    this.setState({
      selectedParentDept: value,
      parentDeptId: value.value
    })
  }

  supervisorChange = (value) => {
    let arr = [];
    this.state.allSupervisorArr.map((data) => {
      value.map((val) => {
        if (data.value === value.value) {
          arr.push({
            id: data.value,
            name: data.label
          })
        }
      })
    })
    this.setState({
      selectedSupervisor: value,
      supervisorId: arr
    })
    consoleLog("supp==>>", this.state.selectedSupervisor);
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
    if (this.state.selectedDepartment === undefined || this.state.selectedDepartment === "" || this.state.selectedDepartment === 0) {
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

    // // for parent department check
    // if (this.state.parentDeptId === undefined || this.state.parentDeptId === null || this.state.parentDeptId === "") {
    //   toast.error(
    //     AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_PARENTDEPARTMENT_EMPTY,
    //     {
    //       hideProgressBar: true,
    //     }
    //   );
    //   errorCount++;
    // }

    // for client add from dropdown
    let validateClientDepartment = inputEmptyValidate(this.state.selectClientId);
    if (validateClientDepartment === false) {
      toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_CLIENT_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    // this is from dropdown and can be multi select
    // if (this.state.supervisorId.length === 0 || this.state.supervisorId === undefined || this.state.supervisorId === null) {
    //   toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_SUPERVISOR_EMPTY, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // }


    if (errorCount === 0) {
      let supervisorIdsArr = [],
        subDeptIdArr = [];
      for (let i = 0; i < this.state.selectedSupervisor.length; i++) {
        supervisorIdsArr.push(this.state.selectedSupervisor[i].value);
      }
      for (let i = 0; i < this.state.selectedParentDept.length; i++) {
        subDeptIdArr.push(this.state.selectedParentDept[i].value);
      }
      let data = {

        department: this.state.departmentData,
        parentId: this.state.selectedParentDept.value,
        clientId: this.state.selectClientId,
        loc: this.state.selectAddress,
        supervisorId: supervisorIdsArr,
        status: this.state.checkStatus === 0 ? '0' : '1',
        notes: this.state.note,
        id: this.state.editId

      }
      consoleLog("Data==>>", data);
      let clientUpdateData = await ApiCall("updateClientDepartmentNew", data);
      if (clientUpdateData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && clientUpdateData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
        return history.push("/departmentClient");
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
    return history.push("/departmentClient");
  };

  onAdd = () => {
    return history.push("/addDeptClient");
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
            <Link to="/clientDashboard">Dashboard</Link> / <Link to="/departmentClient">Department</Link> / Edit
          </div>
          <div className="department-component-app _fl sdw">
            <h3>Edit client Department</h3>
            <div className="department-form">
              <div className="row">
                <div className="col-md-5">
                  <div className="form_rbx">
                    <span className="">Department&nbsp;*</span>
                    <div class="dropdwn">
                      <input
                        type="text"
                        value={this.state.departmentData}
                        name=""
                        placeholder=""
                        class="in-field2"

                        onChange={(e) => this.departmentChange(e)}
                      >
                      </input>
                    </div>
                  </div>
                </div>
                <div className="col-md-2" />
                <div className="col-md-5">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Parent Department&nbsp;*</span>
                    <div class="dropdwn">
                      {/* <SelectBox
                        optionData={this.state.allParentDept}
                        value={this.state.selectedParentDept}
                        onSelectChange={(value) => this.parentDepartmentChange(value)}
                      >
                      </SelectBox> */}
                      <SelectBox
                        optionData={this.state.allParentDept}
                        value={this.state.selectedParentDept}
                        onSelectChange={(value) => this.parentDepartmentChange(value)}
                      ></SelectBox>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="department-form">
              <div className="row">
                <div className="col-md-5">
                  <div className="form_rbx">
                    <span className="">Supervisor [s]&nbsp;*</span>
                    <div className="dropdwn">
                      <MultiSelectBox
                        optionData={this.state.allSupervisorArr}
                        value={this.state.selectedSupervisor}
                        onSelectChange={(value) => this.supervisorChange(value)}
                      ></MultiSelectBox>
                    </div>
                  </div>
                </div>
                <div className="col-md-2" />
                <div className="col-md-5">
                  <div className="web-form-bx">
                    <span className="" style={{ fontSize: "13px", color: "var(--greyLight)" }}>Location&nbsp;*</span>
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
                    <span className="">Notes</span>
                    <div className="dropdwn">
                      {/* <Multiselect
                        options={this.state.supervisorArr} // Options to display in the dropdown
                        selectedValues={this.state.supervisorId} // Preselected value to persist in dropdown
                        onSelect={this.onSupervisorChange} // Function will trigger on select event
                        onRemove={this.onSupervisorRemove} // Function will trigger on remove event
                        displayValue="name" // Property name to display in the dropdown options
                        showCheckbox
                        disable={this.state.supervisorCheck}
                      /> */}
                      <textarea
                        onChange={this.onTextChange}
                        placeholder=""
                        style={{ resize: "none" }}
                        className="in-textarea3 min"
                        value={this.state.note}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="col-md-2" />
                <div className="col-md-1">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Status&nbsp;*</span>
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
                <div className="col-md-1 btn_status" id="client-edit-acti-text">
                  <div className="status_text">
                    {this.state.checkStatus === 1 ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="department-form">
              <div className="row">
                <div className="col-md-5">
                  <div className="web-form-bx">
                    <div class="dropdwn">
                      {" "}
                      <span className="" style={{ fontSize: "13px", color: "var(--greyLight)" }}>Notes</span>
                      <textarea
                        onChange={this.onTextChange}
                        placeholder=""
                        style={{ resize: "none" }}
                        className="in-textarea3 min"
                        value={this.state.note}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            <div class="_button-style m30 _fl text-center">
              <a
                href="javascript:void(0)"
                className="white-btn"
                style={{ textDecoration: "none" }}
                onClick={this.onCancel}
              >
                back
              </a>
              <a
                href="javascript:void(0)"
                className="blue-btn"
                style={{ textDecoration: "none", color: "#fff" }}
                onClick={this.onSubmit}
              >
                submit
              </a>
            </div>
          </div>
          <div className="department-tanle-app _fl sdw tbl_two">
            {/* <ul className="nav nav-tabs">
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
            </ul> */}
            {/* <div className="tab-content">
              <div className="tab-pane  active" id="sub-departments">
                <div className="depr_table">
                  <div className="table-responsive">
                    <table
                      style={{ width: "100%", border: "0" }}
                      cellPadding="0"
                      cellSpacing="0"
                    >
                      <tr>
                       
                        <th style={{ width: "60%" }}>Sub department Name</th>
                        <th style={{ width: "20%" }}>No of Users</th>
                        <th style={{ width: "20%" ,textAlign:"center"}}>Status</th>
                      </tr>
                      {this.state.selectedParentDept.map((item, key) => (
                        <tr>
                        
                          <td style={{ width: "60%" }}>{item.label}</td>
                          <td style={{ width: "20%" }}>{this.state.noOfUsers} </td>
                          <td style={{ width: "10%", textAlign:"center"}}>
                            <span class="progress-btn green">
                              ACTIVE
                            </span>
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
                        <th style={{ width: "15%" }}>Email ID</th>
                        <th style={{ width: "15%" }}>Phone Number</th>
                        <th style={{ width: "7%",textAlign:"center" }}>Status</th>
                        <th style={{ width: "13%", textAlign: "center" }}>
                          Action
                        </th>
                      </tr>
                      {this.state.userDetails.map((item, key) => (
                        <tr>
                          <td style={{ width: "5%" }}>
                            <label class="custom_check2 lbl">
                              <input type="checkbox" />
                              <span class="checkmark2"></span>
                            </label>
                          </td>
                          <td style={{ width: "20%" }}>{item.name}</td>
                          <td style={{ width: "15%" }}>{item.department} </td>
                          <td style={{ width: "15%" }}>{item.email}</td>
                          <td style={{ width: "15%" }}>{item.mobile}</td>
                          <td style={{ width: "7%",textAlign:"center" }}>
                            <span class="progress-btn green">
                            {item.status === 1 ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </td>
                          <td
                            style={{ width: "13%", textAlign: "center" }}
                            class="action-link"
                          >
                            <a href="javascript:void(0)">
                              <img src={ImageName.IMAGE_NAME.EYE_BTN} />
                            </a>
                            <a href="javascript:void(0)">
                              <img src={ImageName.IMAGE_NAME.TRASH_BTN} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </table>
                  </div>
                </div>
              </div>
            </div> */}
            {/* <div class="_button-style m30 _fl text-center">
              <a
                href="javascript:void(0)"
                className="white-btn"
                style={{ textDecoration: "none" }}
                onClick={this.onCancel}
              >
                back
              </a>
              <a
                href="javascript:void(0)"
                className="blue-btn"
                style={{ textDecoration: "none" }}
                onClick={this.onSubmit}
              >
                submit
              </a>
            </div> */}
          </div>
        </div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}
