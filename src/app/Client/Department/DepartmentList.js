 import React, { Component } from "react";
import { AlertMessage, ImageName } from "../../../enums";
import { InputText } from "../../Admin/SharedComponents/inputText";
import { ApiCall, ApiCallClient } from "../../../services/middleware";
import { Decoder } from "../../../services/auth";
import { CommonData, ErrorCode } from "../../../services/constant";
import { ToastContainer, toast } from "react-toastify";
import { MultiSelectBox, SelectBox, PaginationDropdown } from "../../Admin/SharedComponents/inputText";
import "../../Admin/Departments/Client_Department/ClientDepartment.css";
import { styled, Box } from "@mui/system"; //imported for modal
import FormControl from "@mui/material/FormControl";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import history from "../../../history";
import Stack from "@mui/material/Stack";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";
import { consoleLog, getClientInfo, SetDatabaseDateFormat, SetDateFormat, SetScheduleDate, SetTimeFormat, SetUSAdateFormat, } from "../../../services/common-function";
import { Link } from "react-router-dom";

import DatePicker from "react-datepicker";



// ................mui switch DesignServices...............
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 40,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 28,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(22px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#335b7b",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255,255,255,.35)" : "#993921",
    boxSizing: "border-box",
  },
}));

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 10,
    marginTop: 5,
    minWidth: 100,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 2%) 0px 0px 0px 1px, rgba(0, 0, 0, 0%) 0px 10px 15px -3px, rgba(0, 0, 0, 0%) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
  },
}));

const statusArrData = [
  {
    label: "Active",
    value: "1",
  },
  {
    label: "Inactive",
    value: "0",
  },
];

export default class DepartmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      current_page: 1,
      total_page: 10,
      limit: 20,
      display: "",
      department: "",
      switch: false,
      anchorEl: null, //menu button
      openModal: false, // open decline modal false
      listData: [],
      curIndex: 0,
      formDate: "",
      toDate: "",
      allFilterClient: [],
      selectedFilterClient: {},
      filterClient: "",
      allFilterSubDept: [],
      selectedFilterSubDept: {
        // label: "None",
        // value: ""
      },
      filterSubDept: "",
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      allParentDept: [],
      selectedStatus: {},
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    document.getElementById("backdrop").style.display = "none";
    this.load();

    var classInstance = this;
    var filterModal = document.getElementById("create-filter-model");
    var deleteModal = document.getElementById("delete-model");
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === filterModal) {
        classInstance.closeFilterModal();
      } else if (event.target === deleteModal) {
        classInstance.closeDeleteModal();
      }
    };
  }

  load = async () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0"
    }

    let auth = localStorage.getItem("AuthToken");
    let authUser = Decoder.decode(auth);

    this.listApi(data);

    // for dept
    let activeDepartment = [],
      allFilterSubDept = [],
      allFilterClient = [];
    let activeDept = await ApiCall("fetchActiveClientDepartmentAll");
    if (activeDept.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && activeDept.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      activeDepartment = Decoder.decode(activeDept.data.payload);
      if (activeDepartment.data.length > 0) {
        for (let j = 0; j < activeDepartment.data.length; j++) {
          allFilterSubDept.push({
            label: activeDepartment.data[j].deptName,
            value: activeDepartment.data[j].id
          })
        }
      }
    }

    // for client
    allFilterClient = await getClientInfo();

    this.setState({
      allFilterClient: allFilterClient,
      allFilterSubDept: allFilterSubDept
    })



    // let allClientParentDepartment = [];
    // let res = await ApiCall("fetchActiveClientDepartmentAll", req);
    // if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
    //   let payload = Decoder.decode(res.data.payload);
    //   if (payload.data.length > 0) {
    //     for (let j = 0; j < payload.data.length; j++) {
    //       allClientParentDepartment.push({
    //         label: payload.data[j].department,
    //         value: payload.data[j].id,
    //       })
    //     }
    //   }
    // }

    // this.setState({
    //   allParentDept: allClientParentDepartment,
    // })

  }

  listApi = async (data) => {
    consoleLog("req data=>", data);
    const res = await ApiCallClient("fetchClientDepartmentNewClient", data);
    if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {

      const decodeData = Decoder.decode(res.data.payload);
      consoleLog("response::",decodeData.data)
      if (decodeData.data.details && decodeData.data.details.length > 0) {
        let totalPage = Math.ceil(decodeData.data.count / this.state.limit);
        this.setState({
          listData: decodeData.data.details,
          total_page: totalPage
        })
      } else {
        this.setState({
          listData: []
        })
      }
    
    }

  }

  //............ For pagination Display Change............

  onChangeLimit = (dat) => {
    let limit = parseInt(dat.value),
      offset = (this.state.current_page - 1) * Number(dat.value);
    this.setState({
      limit: limit,
      offset: offset,
      selectedDisplayData: dat,
      current_page:1
    });
    let data = {
      limit: limit.toString(),
      offset: "0",
      search: this.state.department,
      searchsubid:
      this.state.selectedFilterSubDept.label === null ||
      this.state.selectedFilterSubDept.label === undefined || this.state.selectedFilterSubDept.label === "None"
        ? ""
        : this.state.selectedFilterSubDept.label,
      searchfrom:this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchto:this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      status:
      this.state.selectedStatus.value == undefined ||
      this.state.selectedStatus.value == null
        ? ""
        : this.state.selectedStatus.value,
    };
    this.listApi(data);
  };

  //..............function for MenuButton close..............
  handleMenuClose = () => {
    this.setState({
      check: false,
      anchorEl: null,
    });
  };


  // ....................Searching.............................
  handleDepartmentChange = (value) => {
    this.setState({
      department: value,
    });

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      search: value,
      searchsubid:
      this.state.selectedFilterSubDept.label === null ||
      this.state.selectedFilterSubDept.label === undefined || this.state.selectedFilterSubDept.label === "None"
        ? ""
        : this.state.selectedFilterSubDept.label,
      searchfrom:this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchto:this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      status:
      this.state.selectedStatus.value == undefined ||
      this.state.selectedStatus.value == null
        ? ""
        : this.state.selectedStatus.value,
    }

    this.listApi(data);

  };
  

  //   ..........add new button.......................
  addNew = () => {
    return history.push("/addDeptClient");
  };

  //................funct for menuBtn on click................
  menuBtnhandleClick = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl: event.currentTarget,
    });
  };

  editPage = () => {
    // console.log("this.state.listData[this.state.curIndex]=>",this.state.listData[this.state.curIndex])
    this.props.history.push({
      pathname: "/editDepartmentClient",
      state: this.state.listData[this.state.curIndex]
    });
  };

  /* Delete item */

  deletePage = () => {
    this.handleMenuClose();
    this.openDeleteModal();
  };

  // .............pagination function..........
  clickChange = (e) => {
    this.setState({
      current_page: e.target.value,
    });
  };

  // This is goes to the previous page
  exLeft = () => {
    this.setState({
      current_page: 1,
    });

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      search: this.state.department,
      searchsubid:
      this.state.selectedFilterSubDept.label === null ||
      this.state.selectedFilterSubDept.label === undefined || this.state.selectedFilterSubDept.label === "None"
        ? ""
        : this.state.selectedFilterSubDept.label,
      searchfrom:this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchto:this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      status:
      this.state.selectedStatus.value == undefined ||
      this.state.selectedStatus.value == null
        ? ""
        : this.state.selectedStatus.value,
    }
    this.listApi(data);
  };

  // This is goes to the last page
  exRigth = () => {
    let totalPage = this.state.total_page;
    this.setState({
      current_page: totalPage,
    });

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit),
      search: this.state.department,
      searchsubid:
      this.state.selectedFilterSubDept.label === null ||
      this.state.selectedFilterSubDept.label === undefined || this.state.selectedFilterSubDept.label === "None"
        ? ""
        : this.state.selectedFilterSubDept.label,
      searchfrom:this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchto:this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      status:
      this.state.selectedStatus.value == undefined ||
      this.state.selectedStatus.value == null
        ? ""
        : this.state.selectedStatus.value,
    }
    this.listApi(data);
  };

  // This is goes to the first page
  prev = () => {
    let currentPage = this.state.current_page;
    if (currentPage > 1) {
      currentPage--;
      this.setState({
        current_page: currentPage,
      });

      let data = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((currentPage - 1) * this.state.limit),
        search: this.state.department,
        searchsubid:
        this.state.selectedFilterSubDept.label === null ||
        this.state.selectedFilterSubDept.label === undefined || this.state.selectedFilterSubDept.label === "None"
          ? ""
          : this.state.selectedFilterSubDept.label,
        searchfrom:this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        searchto:this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        status:
      this.state.selectedStatus.value == undefined ||
      this.state.selectedStatus.value == null
        ? ""
        : this.state.selectedStatus.value,
      }
      this.listApi(data)
    }
  };

  // This is goes to the next page
  next = () => {
    let currentPage = this.state.current_page;
    let totalPage = this.state.total_page;
    if (currentPage < totalPage) {
      currentPage++;
      this.setState({
        current_page: currentPage,
      });

      let data = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((currentPage - 1) * this.state.limit),
        search: this.state.department,
        searchsubid:
        this.state.selectedFilterSubDept.label === null ||
        this.state.selectedFilterSubDept.label === undefined || this.state.selectedFilterSubDept.label === "None"
          ? ""
          : this.state.selectedFilterSubDept.label,
        searchfrom:this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        searchto:this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        status:
      this.state.selectedStatus.value == undefined ||
      this.state.selectedStatus.value == null
        ? ""
        : this.state.selectedStatus.value,
      }
      this.listApi(data);
    }
  };

  // ................status func...................
  onStatusChange = async (index) => {
    let arrData = this.state.listData;
    let stat = "0";
    if (arrData[index].status === 0) {
      stat = "1";
    } else {
      stat = "0";
    }

    let data = {
      id: this.state.listData[index].id,
      status: stat
    }

    let res = await ApiCall("clientdepartmentstatusupdate", data);
    if (res.error === 0 && res.respondcode === 200) {
      this.load();
      toast.success(AlertMessage.MESSAGE.UPDATE_STATUS.SUCCESS);
    }

  };

  //......Ascending order .........

  ascOrder = (data) => {
    let filter = "";
    if (data === "department") {
      filter = "department";
    } else if (data === "location") {
      filter = "location";
    } else if (data === "client") {
      filter = "name";
    } else if (data === "supervisor") {
      filter = "user";
    }

    let req = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      search: this.state.department,
      orderby: filter,
      direc: "ASC"
    }

    this.listApi(req);
  }

  //......Descending order .........

  descOrder = (data) => {
    let filter = "";
    if (data === "department") {
      filter = "department";
    } else if (data === "location") {
      filter = "location";
    } else if (data === "client") {
      filter = "name";
    } else if (data === "supervisor") {
      filter = "user";
    }

    let req = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      search: this.state.department,
      orderby: filter,
      direc: "DESC"
    }

    this.listApi(req);
  }

  //........Page show Limit.........

  openFilterModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("create-filter-model").style.display = "block";
    document.getElementById("create-filter-model").classList.add("show");
  };

  closeFilterModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("create-filter-model").style.display = "none";
    document.getElementById("create-filter-model").classList.remove("show");
  };

  formDateChange = (date) => {
    this.setState({
      formDate: SetUSAdateFormat(date)
    })
  }

  toDateChange = (date) => {
    this.setState({
      toDate: SetUSAdateFormat(date)
    })
  }

  filterClientChange = (value) => {
    this.setState({
      selectedFilterClient: value,
      filterClient: value.value
    })
  }

  filterSubDeptChange = (value) => {
    this.setState({
      selectedFilterSubDept: value,
      filterSubDept: value.value
    })
  }
  onFilterStatusChange = (dat) => {
    this.setState({
      selectedStatus: dat,
    });
  };


  onFilterApply = () => {

    this.closeFilterModal();

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      search: this.state.department,
      searchsubid:
      this.state.selectedFilterSubDept.label === null ||
      this.state.selectedFilterSubDept.label === undefined || this.state.selectedFilterSubDept.label === "None"
        ? ""
        : this.state.selectedFilterSubDept.label,
      searchfrom:this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchto:this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      status:
      this.state.selectedStatus.value == undefined ||
      this.state.selectedStatus.value == null
        ? ""
        : this.state.selectedStatus.value,
    };

   

    this.listApi(data);

    this.setState({
     current_page:1
    });

  }

  onResetFilter = () => {

    this.closeFilterModal();

    this.setState({
      formDate: "",
      toDate: "",
      department:"",
      filterClient: "",
      filterSubDept: "",
      selectedFilterClient: {},
      selectedFilterSubDept: {},
      
      selectedStatus:{}
    });

    let obj = {
      limit: this.state.limit.toString(),
      offset: "0"
    }

    this.listApi(obj);
  }


  //.............. Delete Functionalities..............

  openDeleteModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("delete-model").style.display = "block";
    document.getElementById("delete-model").classList.add("show");
  };

  closeDeleteModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("delete-model").style.display = "none";
    document.getElementById("delete-model").classList.remove("show");
  };

  //........ Confirm Delete .......

  confirmDelete = async () => {

    let data = {
      id: this.state.listData[this.state.curIndex].id,
      status: "2"
    }

    let res = await ApiCall("clientdepartmentstatusupdate", data);
    if (res.error === 0 && res.respondcode === 200) {
      toast.success(AlertMessage.MESSAGE.DEPARTMENT.DELETE_DEPARTMENT_SUCCESS);
      this.load();
      this.closeDeleteModal();
    }

  }


  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
        <ToastContainer hideProgressBar theme="colored" />
        {/* <Header />
        <Sidebar /> */}
        <div className="component-wrapper">
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            {" "}
            <Link to="/clientDashboard">Dashboard</Link> / Department
          </div>
          <div className="listing-component-app">
            <div
              className="vendor-info _fl sdw"
              style={{
                boxShadow: "  0px 0px 3px 0px rgb(0 0 0 / 23%)",
                borderRadius: "20px",
              }}
            >
              <div className="vn-form _fl"></div>
              <div className="vn-form _fl">
                <div className="row">
                  <div className="col-md-4">
                    <div className="vn_frm">
                      <span style={{ width: "30%" }}>Department</span>
                      <InputText
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.department}
                        onTextChange={(value) => {
                          this.handleDepartmentChange(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="table-filter-app-b">
              <div class="filter-btn">
                <a
                  href="javascript:void(0)"
                  onClick={this.openFilterModal}
                >
                  Filter
                </a>
              </div>
              <div className="filter-pagination">
                <button className="prev_btn" onClick={this.exLeft}></button>
                <button className="prv_btn" onClick={this.prev}>
                  {" "}
                  {"<"}
                </button>
                <span className="num" onChange={(e) => this.clickChange(e)} id="client-num-pre">
                  {this.state.current_page}
                </span>
                <button className="nxt_btn" onClick={this.next}>
                  {">"}
                </button>
                <button className="next_btn" onClick={this.exRigth}></button>
              </div>
              <div class="table-filter-box">
                <div class="export-btn">
                  {/* <a href="#">
                  Export{" "}
                  <img
                    src={ImageName.IMAGE_NAME.EXPORT_BTN}
                    style={{ width: "25px", cursor: 'pointer' }}
                    onClick={this.handleExport} />
                </a> */}
                </div>
                <div class="addnew" onClick={this.addNew}>
                  <a href="javascript:void(0)">
                    Add New{" "}
                    <img
                      className=""
                      src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                      style={{ width: "25px", cursor: "pointer" }}

                    />
                  </a>
                </div>
                <div class="tble-short">
                  <span class="lbl">Display</span>
                  <div
                    class="dropdwn"
                    style={{
                      width: "70px",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    <PaginationDropdown
                      optionData={CommonData.COMMON.DISPLAY_ARR}
                      value={this.state.selectedDisplayData}
                      placeholder="Select"
                      onSelectChange={(value) => {
                        this.onChangeLimit(value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="table-listing-app">
              <div className="table-responsive">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr id="clintdepart-text">
                    <th style={{ width: "10%" }} id="client-deprt-f-t">
                      Department
                    </th>
                    <th style={{ width: "15%" }}>
                      Parent department
                    </th>
                    <th style={{ width: "12%" }}>
                      Location
                    </th>
                    <th style={{ width: "12%" }}>
                      No. of Users
                    </th>
                    {/* <th style={{ width: "10%" }}>
                      Client
                    </th> */}
                    <th style={{ width: "20%" }}>
                      Last Modified On
                    </th>
                    <th style={{ width: "10%" }} id="clint-depart-statustext">Status</th>
                    <th style={{ width: "5%" }} id="clint-depart-actontext">Action</th>
                  </tr>
                  {this.state.listData.length > 0 ? <React.Fragment>
                    {this.state.listData.map((item, key) => (
                      <tr>
                        <td colSpan="9">
                          <div className="tble-row">
                            <table
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                            >
                              <tr>
                                <td style={{ width: "10%" }}>
                                  {item.department}
                                </td>
                                <td style={{ width: "15%" }}>
                                  {item.parentDept}
                                </td>
                                <td style={{ width: "12%" }}>{item.location}</td>
                                {/* <td style={{ width: "8%" }}>{item.clientId}</td> */}
                                <td style={{ width: "12%" }}>
                                  {item.user}
                                </td>
                                {/* <td style={{ width: "20%" }}>{item.name}</td> */}
                                {/* <td style={{ width: "10%" }}>{item.user}</td> */}
                                <td style={{ width: "20%" }}>
                                  {SetDateFormat(item.lastUpdated)} | {SetTimeFormat(item.lastUpdated)}
                                </td>
                                <td style={{ width: "10%" }}>
                                  <FormControl
                                    component="fieldset"
                                    variant="standard"
                                  >
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                    >
                                      {item.status === 1 ?
                                        <AntSwitch
                                          // defaultChecked={
                                          //   item.status === 1 ? true : false
                                          // }
                                          checked={true}
                                          inputProps={{
                                            "aria-label": "ant design",
                                          }}
                                          name="active"
                                          onClick={() => this.onStatusChange(key)}
                                        /> :
                                        <AntSwitch
                                          // defaultChecked={
                                          //   item.status === 1 ? true : false
                                          // }
                                          checked={false}
                                          inputProps={{
                                            "aria-label": "ant design",
                                          }}
                                          name="active"
                                          onClick={() => this.onStatusChange(key)}
                                        />}
                                    </Stack>
                                    <FormHelperText style={{ textAlign: "center", fontSize: "8px" }}>
                                      {item.status === 1 ? "ACTIVE" : "INACTIVE"}
                                    </FormHelperText>
                                  </FormControl>
                                </td>

                                <td style={{ width: "5%" }}>
                                  <img
                                    // src="/assets_temp/images/edit.png"
                                    src={ImageName.IMAGE_NAME.EDIT_SQUARE}
                                    style={{ cursor: "pointer" }}
                                    id={"basic-button" + key}
                                    className="basic-edit-btn"
                                    aria-controls={"basic-menu" + key}
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                    onClick={(e) =>
                                      this.menuBtnhandleClick(key, e)
                                    }
                                  />
                                  <StyledMenu
                                    id={"basic-menu" + key}
                                    anchorEl={this.state.anchorEl}
                                    open={open}
                                    onClose={this.handleMenuClose}
                                    MenuListProps={{
                                      "aria-labelledby": "basic-button" + key,
                                    }}
                                  >
                                    <MenuItem onClick={() => this.editPage()}>
                                      Edit
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => this.deletePage()}
                                    >
                                      Delete
                                    </MenuItem>
                                  </StyledMenu>

                                  {/* <div className="tbl-editing-links ">
                                  <button className="tr-toggle">
                                    <img
                                      src="/assets_temp/images/edit.png"
                                      style={{
                                        width: "35px",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </button>

                                  <div className="tbl-drop-links">
                                    <ul>
                                      <li>
                                        <a
                                          style={{ textDecoration: "none" }}
                                          onClick={() => this.editPage(item)}
                                        >
                                          Edit
                                        </a>
                                      </li>

                                      <li>
                                        <a
                                          style={{ textDecoration: "none" }}
                                          onClick={() => this.editPage(item)}
                                        >
                                          Delete
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div> */}
                                </td>
                              </tr>
                            </table>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* <tr>
                    <td colSpan="10">
                      <div className="tble-row">
                        <table
                          width="100%"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                        >
                          <tr>
                            <td style={{ width: "20%" }}>4</td>
                            <td style={{ width: "20%" }}>Agency</td>
                            <td style={{ width: "20%" }}>Will</td>

                            <td style={{ width: "20%" }}>
                              <a href="#" className="declined_btn">
                                Declined
                              </a>
                            </td>
                            <td style={{ width: "20%" }}>
                              <a href="#">
                                <img src="images/eye-icon.jpg" />
                              </a>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr> */
                    }
                  </React.Fragment> :
                    <React.Fragment>
                      <tr style={{ textAlign: "center" }}>
                        <td colSpan="7"><center style={{ fontSize: "20px" }}>No data found !!!</center></td>

                      </tr>
                    </React.Fragment>
                  }
                </table>
              </div>
            </div>
            <div class="table-filter-app-b" style={{ paddingTop: "2%" }}>
              <div className="filter-pagination">
                <button className="prev_btn" onClick={this.exLeft}></button>
                <button className="prv_btn" onClick={this.prev}>
                  {" "}
                  {"<"}
                </button>
                <span className="num" onChange={(e) => this.clickChange(e)}>
                  {this.state.current_page}
                </span>
                <button className="nxt_btn" onClick={this.next}>
                  {">"}
                </button>
                <button className="next_btn" onClick={this.exRigth}></button>
              </div>
              <div class="table-filter-box">
                {/* <div class="tble-short client-tbl-sot-box">
                  <span class="lbl" id="client-tbl-sort-disp-text">Display</span>
                  <div class="dropdwn">
                    <select class="myDropdown frm4-select" onChange={this.onChangeLimit}>
                    </select>
                  </div>
                </div> */}
                <div class="tble-short">
                  <span class="lbl">Display</span>
                  <div
                    class="dropdwn"
                    style={{
                      width: "70px",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    <PaginationDropdown
                      optionData={CommonData.COMMON.DISPLAY_ARR}
                      value={this.state.selectedDisplayData}
                      onSelectChange={(value) => {
                        this.onChangeLimit(value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ..................modal................................. */}
        <div
          id="create-filter-model"
          class="modal fade modelwindow"
          role="dialog"
        >
          <div class="modal-dialog modal-lg modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div class="modal-content">
              <div class="filter-head _fl mdf">
                <h3>Filter by</h3>
                <div class="reset-btn-dp">
                  <button class="reset">
                    <img src={ImageName.IMAGE_NAME.RESET_BTN} onClick={this.onResetFilter} />
                    Reset
                  </button>
                  <button class="apply">
                    <img src={ImageName.IMAGE_NAME.BLUE_TICK} onClick={this.onFilterApply} />
                    Apply
                  </button>
                </div>
              </div>
              <div class="modal-body">
                <div class="model-info f-model">
                  <div class="form-search-app">
                    <div class="lable-text">Last Modified on</div>
                    <div class="form-field-app">
                      <span></span>
                      <div
                        className="input-group"
                        style={{
                          width: "100%",
                          borderRadius: "9px",
                          height: "41px",
                          border: "1px solid #ced4da",
                          boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                        }}
                      >
                        <div style={{ width: "80%", padding: "8px" }}>
                          <span>FROM {this.state.formDate}</span>
                        </div>
                        <div style={{ width: "20%" }}>
                          <a style={{ float: "right" }}>
                            <DatePicker
                              dropdownMode="select"
                              showMonthDropdown
                              showYearDropdown
                              adjustDateOnChange
                              // minDate={new Date()}
                              onChange={(date) => this.formDateChange(date)}
                              customInput={<Schedule />}
                            />
                          </a>
                        </div>
                      </div>
                      {/* <input
                        type="date"
                        class="datefield bd"
                        placeholder="10/25/2021"
                        value={this.state.formDate}
                        onChange={this.formDateChange}
                      /> */}
                    </div>
                    <div class="form-field-app">
                      <span></span>
                      <div
                        className="input-group"
                        style={{
                          width: "100%",
                          borderRadius: "9px",
                          height: "41px",
                          border: "1px solid #ced4da",
                          boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                        }}
                      >
                        <div style={{ width: "80%", padding: "8px" }}>
                          <span>To {this.state.toDate}</span>
                        </div>
                        <div style={{ width: "20%" }}>
                          <a style={{ float: "right" }}>
                            <DatePicker
                              dropdownMode="select"
                              showMonthDropdown
                              showYearDropdown
                              adjustDateOnChange
                              minDate={new Date(this.state.formDate)}
                              onChange={(date) => this.toDateChange(date)}
                              customInput={<Schedule />}
                            />
                          </a>
                        </div>
                      </div>
                      {/* <input
                        type="date"
                        class="datefield bd"
                        placeholder="10/25/2021"
                        value={this.state.toDate}
                        onChange={this.toDateChange}
                      /> */}
                    </div>
                  </div>
                  <div class="m-select _fl">
                    <div class="row">
                      {/* <div class="col-md-6">
                        <div class="sf-row">
                          <div class="lable-text">Client</div>
                          <div class="dropdwn">
                            <SelectBox
                              optionData={this.state.allFilterClient}
                              value={this.state.selectedFilterClient}
                              onSelectChange={(value) => this.filterClientChange(value)}
                            >
                            </SelectBox>
                          </div>
                        </div>
                      </div> */}
                    <div class="col-md-6">
                        <div class="sf-row">
                          <div class="lable-text">Parent Department</div>
                          <div class="dropdwn" style={{ marginLeft: "145px" }}>
                            <SelectBox
                              optionData={this.state.allFilterSubDept}
                              value={this.state.selectedFilterSubDept}
                              onSelectChange={(value) =>
                                this.filterSubDeptChange(value)
                              }
                            ></SelectBox>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div class="sf-row">
                          <div class="lable-text">Status</div>

                          <div class="dropdwn" style={{ marginLeft: "87px" }}>
                            <SelectBox
                              optionData={statusArrData}
                              value={this.state.selectedStatus}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onFilterStatusChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="row">
                      <div className="col-md-6">
                        <div class="sf-row">
                          <div class="lable-text">Sub-Department[s]</div>
                          <div class="dropdwn">
                            <select class="frm4-select" id="myDropdown_15">
                              <option>Select</option>
                              <option>Translation</option>
                              <option>Interpretation</option>
                              <option>Subtitling</option>
                              <option>Voice Over</option>
                              <option>Transcription</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ..................Delete modal................................. */}
        <div
          id="delete-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="modal-body">
                {/* <div className="model-info f-model"> */}
                <div className="form-search-app">
                  <center><h6>Are you really want to delete the record? </h6></center>
                  <div className="row">
                    <div className="col-md-4"></div>
                    <div class="_button-style _fl text-center" style={{ marginTop: "2%" }}>
                      <a
                        href="javascript:void(0)"
                        className="white-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.closeDeleteModal}
                      >
                        No
                      </a>
                      <a
                        href="javascript:void(0)"
                        className="blue-btn"
                        style={{ textDecoration: "none", color: "#fff" }}
                        onClick={() => this.confirmDelete()}
                      >
                        Yes
                      </a>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>

        <div
          class="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
        {/* </div> */}
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
