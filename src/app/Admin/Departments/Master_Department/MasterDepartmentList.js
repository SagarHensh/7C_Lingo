import React, { Component } from "react";
import { styled } from "@mui/system"; //imported for modal
import FormControl from "@mui/material/FormControl";

import Menu from "@mui/material/Menu";

import MenuItem from "@mui/material/MenuItem";

import TextField from "@mui/material/TextField";
import history from "../../../../history";
import Stack from "@mui/material/Stack";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import "./Master_Department.css";
import $ from "jquery";
// import { numberValidator } from "../../../../validators";
// import { phoneNumberCheck } from "../../../../services/common-function";
import { AlertMessage, ImageName } from "../../../../enums";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../../SharedComponents/inputText";
import { ApiCall } from "../../../../services/middleware";
import { Decoder } from "../../../../services/auth";
import { ToastContainer, toast } from "react-toastify";
import { CommonData, ErrorCode } from "../../../../services/constant";
import {
  consoleLog,
  SetDatabaseDateFormat,
  SetScheduleDate,
  SetUSAdateFormat,
  SetUSAdateFormatV2,
} from "../../../../services/common-function";
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
    borderRadius: 6,
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
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 10,
    marginTop: 5,
    minWidth: 100,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 2%) 0px 0px 0px 1px, rgba(0, 0, 0, 0%) 0px 10px 15px -3px, rgba(0, 0, 0, 0%) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
  },
}));

const allStatusArr = [
  {
    label: "Inactive",
    value: "0",
  },
  {
    label: "Active",
    value: "1",
  },
];

export default class MasterDepartmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: 1,
      total_page: 10,
      limit: 20,
      offset: 0,
      department: "",
      name: "",
      search: "",
      switch: false,
      anchorEl: null, //menu button
      openModal: false, // open decline modal false
      openfilterModal: false, // open filter modal
      ascFlag: true,
      descFlag: true,
      clientName: [], //FOR MULTISELECT client DROPDOWN
      propData: {}, //
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      disp: "",
      listData: [],
      curIndex: 0,
      formDate: "",
      toDate: "",
      subDeptArr: [],
      subDeptData: {},
      selectedStatus: {},
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getMasterDetail();
    document.getElementById("backdrop").style.display = "none";

    var classInstance = this;

    var filterModal = document.getElementById("filter-model");
    var deleteModal = document.getElementById("delete-model");
    window.onclick = function (event) {
      if (event.target === filterModal) {
        classInstance.closeFilterModal();
      } else if (event.target === deleteModal) {
        classInstance.closeDeleteModal();
      }
    };
  }

  getMasterDetail = async () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
    };
    this.listApi(data);
    let subDeptArr = [],
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
    this.setState({
      subDeptArr: subDeptArr,
    });
  };

  listApi = async (data) => {
    consoleLog("data::", data);
    let res = await ApiCall("getMasterDepartmentList", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(res.data.payload);
      let totalPage = Math.ceil(payload.data.count / this.state.limit);
      consoleLog("+++++", payload.data);

      if (payload.data.details && payload.data.details.length > 0) {
        this.setState({
          listData: payload.data.details,
          total_page: totalPage,
        });
      } else {
        this.setState({
          listData: [],
        });
      }
    }
  };

  callbackFunction = (childData) => {
    this.setState({ propData: childData });
  };

  handleMenuClose = () => {
    this.setState({
      check: false,
      anchorEl: null,
    });
  };
  // .............filter modal function...................
  openFilterModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("filter-model").style.display = "block";
    document.getElementById("filter-model").classList.add("show");
  };

  closeFilterModal = () => {
    document.getElementById("filter-model").style.display = "none";
    document.getElementById("filter-model").classList.remove("show");
    document.getElementById("backdrop").style.display = "none";
  };
  openDeleteModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("delete-model").style.display = "block";
    document.getElementById("delete-model").classList.add("show");
  };

  closeDeleteModal = () => {
    document.getElementById("delete-model").style.display = "none";
    document.getElementById("delete-model").classList.remove("show");
    document.getElementById("backdrop").style.display = "none";
  };

  // .................................................
  handleDepartmentChange = async (value) => {
    this.setState({
      department: value,
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      search: value,
      searchform:
        this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto:
        this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      parentDepartmentId:
        this.state.subDeptData.value == null ||
        this.state.subDeptData.value == undefined
          ? ""
          : this.state.subDeptData.value,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
    };

    consoleLog("request data::", data);

    this.listApi(data);
    // let res = await ApiCall("getMasterDepartmentList", data);
    // if (res.error === 0 && res.respondcode === 200) {
    //   let payload = await Decoder.decode(res.data.payload);
    //   let totalPage = Math.ceil(payload.data.count / this.state.limit);
    //   this.setState({
    //     listData: payload.data.details,
    //     total_page: totalPage,
    //   });
    // }
  };

  handleSearchChange = (e) => {
    this.setState({
      search: e.target.value,
    });
  };
  onSubDepartmentChange = (dat) => {
    // consoleLog("sub:::", arr);
    this.setState({
      subDeptData: dat,
      // subDeptDataArr: arr,
    });
  };
  statusTypeChange = (dat) => {
    this.setState({
      selectedStatus: dat,
    });
  };

  //   ..........add new button.......................
  addNew = () => {
    history.push("/addMasterDepartment");
  };

  //................funct for menuBtn on click................
  menuBtnhandleClick = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl: event.currentTarget,
    });
  };

  editPage = () => {
    this.props.history.push({
      pathname: "/editDepartment",
      state: this.state.listData[this.state.curIndex],
    });
  };

  /* Delete item */

  deletePage = (item) => {
    this.openDeleteModal();
    this.handleMenuClose();
  };

  //........ Confirm Delete .......

  confirmDelete = async () => {
    let data = {
      id: this.state.listData[this.state.curIndex].id,
    };

    let res = await ApiCall("deleteMasterDepartmentData", data);
    if (res.error === 0 && res.respondcode === 200) {
      toast.success(AlertMessage.MESSAGE.DEPARTMENT.DELETE_DEPARTMENT_SUCCESS);
      // window.$("#delete-model").modal("hide");
      this.getMasterDetail();
      this.closeDeleteModal();
    }
  };

  //........ No Delete .......

  cancelDelete = () => {
    // window.$("#delete-model").modal("hide");
    this.closeDeleteModal();
  };

  // .............pagination function..........
  clickChange = (e) => {
    this.setState({
      current_page: e.target.value,
    });
  };

  // This is goes to the previous page
  exLeft = async () => {
    this.setState({
      current_page: 1,
    });

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      search: this.state.department,
      searchform:
        this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchto:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      parentDepartmentId:
        this.state.subDeptData.value == null ||
        this.state.subDeptData.value == undefined
          ? ""
          : this.state.subDeptData.value,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
    };

    this.listApi(data);
    // let res = await ApiCall("getMasterDepartmentList", data);
    // if (res.error === 0 && res.respondcode === 200) {
    //   let payload = await Decoder.decode(res.data.payload);
    //   let totalPage = Math.ceil(payload.data.count / this.state.limit);
    //      consoleLog("_)_)_)_)", payload.data);
    //   this.setState({
    //     listData: payload.data.details,
    //     total_page: totalPage,
    //   });
    // }
  };

  // This is goes to the first page
  prev = async () => {
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
        searchform:
          this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        searchto:
          this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        parentDepartmentId:
          this.state.subDeptData.value == null ||
          this.state.subDeptData.value == undefined
            ? ""
            : this.state.subDeptData.value,
        status:
          this.state.selectedStatus.value == null ||
          this.state.selectedStatus.value == undefined
            ? ""
            : this.state.selectedStatus.value,
      };

      this.listApi(data);
      // let res = await ApiCall("getMasterDepartmentList", data);
      // if (res.error === 0 && res.respondcode === 200) {
      //   let payload = await Decoder.decode(res.data.payload);
      //   let totalPage = Math.ceil(payload.data.count / this.state.limit);
      //      consoleLog("_)_)_)_)", payload.data);
      //   this.setState({
      //     listData: payload.data.details,
      //     total_page: totalPage,
      //   });
      // }
    }
  };

  // This is goes to the next page
  next = async () => {
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
        searchform:
          this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        searchto:
          this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        parentDepartmentId:
          this.state.subDeptData.value == null ||
          this.state.subDeptData.value == undefined
            ? ""
            : this.state.subDeptData.value,
        status:
          this.state.selectedStatus.value == null ||
          this.state.selectedStatus.value == undefined
            ? ""
            : this.state.selectedStatus.value,
      };
      this.listApi(data);
      // let res = await ApiCall("getMasterDepartmentList", data);
      // if (res.error === 0 && res.respondcode === 200) {
      //   let payload = await Decoder.decode(res.data.payload);
      //   let totalPage = Math.ceil(payload.data.count / this.state.limit);
      //   consoleLog("_)_)_)_)",payload .data);
      //   this.setState({
      //     listData: payload.data.details,
      //     total_page: totalPage,
      //   });
      // }
    }
  };

  // This is goes to the last page
  exRigth = async () => {
    let totalPage = this.state.total_page;
    this.setState({
      current_page: totalPage,
    });

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit),
      search: this.state.department,
      searchform:
        this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchto:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      parentDepartmentId:
        this.state.subDeptData.value == null ||
        this.state.subDeptData.value == undefined
          ? ""
          : this.state.subDeptData.value,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
    };
    this.listApi(data);
  };

  // ................status func...................
  onStatusChange = async (index) => {
    let arrData = this.state.listData;
    let stat = 0;
    if (arrData[index].status === 0) {
      stat = 1;
    } else {
      stat = 0;
    }
    let data = {
      id: arrData[index].id,
      industryType: arrData[index].industryType,
      department: arrData[index].department,
      status: JSON.stringify(stat),
    };
    let res = await ApiCall("updateMasterDepartment", data);
    if (res.error === 0 && res.respondcode === 200) {
      toast.success(AlertMessage.MESSAGE.DEPARTMENT.UPDATE_DEPARTMENT, {
        hideProgressBar: true,
      });
      arrData[index].status = stat;
      this.setState({
        listData: arrData,
      });
      this.getMasterDetail();
    } else {
      if (res.error === 1 && res.respondcode === 108) {
        toast.error(AlertMessage.MESSAGE.DEPARTMENT.DUPLICATE_DEPARTMENT, {
          hideProgressBar: true,
        });
      }
    }
  };

  // For export the data
  handleExport = () => {
    // console.log("ok");
  };

  //shorting asc
  shortAsc = async () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      orderby: "department",
      direc: "ASC",
      search: this.state.department,
      searchform:
        this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchto:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      parentDepartmentId:
        this.state.subDeptData.value == null ||
        this.state.subDeptData.value == undefined
          ? ""
          : this.state.subDeptData.value,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
    };

    this.listApi(data);
  };

  // short desc
  shortDesc = async () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      orderby: "department",
      direc: "DESC",
      search: this.state.department,
      searchform:
        this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchto:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      parentDepartmentId:
        this.state.subDeptData.value == null ||
        this.state.subDeptData.value == undefined
          ? ""
          : this.state.subDeptData.value,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
    };

    this.listApi(data);
  };

  onChangeLimit = async (dat) => {
    this.setState({
      limit: parseInt(dat.value),
      selectedDisplayData: dat,
      current_page: 1,
    });
    let limit = parseInt(dat.value),
      // offset = (this.state.current_page - 1) * parseInt(dat.value);
      offset = "0";
    let data = {
      limit: limit.toString(),
      offset: offset,
      search: this.state.department,
      searchform:
        this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchto:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      parentDepartmentId:
        this.state.subDeptData.value == null ||
        this.state.subDeptData.value == undefined
          ? ""
          : this.state.subDeptData.value,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
    };

    this.listApi(data);
  };

  formDateChange = (date) => {
    this.setState({
      formDate: SetUSAdateFormatV2(date),
    });
  };

  toDateChange = (date) => {
    this.setState({
      toDate: SetUSAdateFormatV2(date),
    });
  };

  onFilterApply = async () => {
    let errorCount = 0;
    if (this.state.formDate > this.state.toDate) {
      toast.error(AlertMessage.MESSAGE.DATE.FROM_GRETTER_TO);
      errorCount++;
    }
    if (errorCount === 0) {
      let data = {
        limit: JSON.stringify(this.state.limit),
        offset: "0",
        search: this.state.department,
        searchform:
          this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        searchto:
          this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        parentDepartmentId:
          this.state.subDeptData.value == null ||
          this.state.subDeptData.value == undefined
            ? ""
            : this.state.subDeptData.value,
        orderby: "",
        direc: "",
        status:
          this.state.selectedStatus.value == null ||
          this.state.selectedStatus.value == undefined
            ? ""
            : this.state.selectedStatus.value,
      };

      consoleLog("Filter Apply::", data)

      this.listApi(data);
      this.setState({
        current_page: 1,
      });
      // }
      // this.getMasterDetail();
      this.closeFilterModal();
    }
  };

  onResetFilter = async () => {
    this.closeFilterModal();
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      searchform: "",
      searchto: "",
    };

    // let res = await ApiCall("getMasterDepartmentList", data);
    // if (
    //   res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {
    //   let payload = await Decoder.decode(res.data.payload);
    //   let totalPage = Math.ceil(payload.data.count / this.state.limit);

    this.setState({
      // listData: payload.data.details,
      // total_page: totalPage,
      formDate: "",
      toDate: "",
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      current_page: 1,
      subDeptData: {},
      selectedStatus: {},
    });
    // }
    this.listApi(data);
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
        <ToastContainer hideProgressBar theme="colored" />
        {/* <Header />
        <Sidebar /> */}
        <div className="component-wrapper">
          <div className="listing-component-app">
            <div
              className="vn_frm"
              style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
            >
              {" "}
              <Link to="/adminDashboard">Dashboard</Link> / Master Department
            </div>
            <div
              className="vendor-info _fl sdw"
              style={{
                boxShadow: "0px 0px 3px 0px rgb(0 0 0 / 23%)",
                borderRadius: "20px",
              }}
            >
              <div className="vn-form _fl">
                <div className="row">
                  <div className="col-md-4">
                    <div className="vn_frm">
                      <span style={{ width: "30%" }}>Departments</span>
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
                <a href={"javascript:void(0)"} onClick={this.openFilterModal}>
                  Filter
                </a>
              </div>
              <div className="filter-pagination">
                <button className="prev_btn" onClick={this.exLeft}></button>
                <button className="prv_btn" onClick={this.prev}>
                  {" "}
                  {"<"}
                </button>
                <span
                  className="num mast-prev-num"
                  onChange={(e) => this.clickChange(e)}
                >
                  {this.state.current_page}
                </span>
                <button className="nxt_btn" onClick={this.next}>
                  {">"}
                </button>
                <button className="next_btn" onClick={this.exRigth}></button>
              </div>
              <div class="table-filter-box">
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
                <table
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  id="t-box"
                >
                  <tr>
                    <th
                      style={{
                        width: "30%",
                        textAlign: "left",
                        paddingLeft: "5%",
                      }}
                    >
                       <div className="sorting_btn">
                        <img
                          src={ImageName.IMAGE_NAME.ARROW_UP}
                          style={{ paddingBottom: "10px", cursor: "pointer" }}
                          onClick={this.shortAsc}
                        />

                        <img
                          src={ImageName.IMAGE_NAME.ARROW_DOWN}
                          onClick={this.shortDesc}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                      <span style={{ fontSize: "13px",marginLeft:"5px" }}>Department</span>
                    </th>
                    <th
                      style={{
                        width: "50%",
                        textAlign: "left",
                      }}
                      id="mast-depar-subtext"
                    >
                      {/* <div className="sorting_btn">
                        <img
                          src={ImageName.IMAGE_NAME.ARROW_UP}
                          style={{ paddingBottom: "10px", cursor: "pointer" }}
                          onClick={this.shortAsc}
                        />

                        <img
                          src={ImageName.IMAGE_NAME.ARROW_DOWN}
                          onClick={this.shortDesc}
                          style={{ cursor: "pointer" }}
                        />
                      </div> */}
                      <span
                        style={{
                          fontSize: "13px",

                          paddingLeft: "5%",
                        }}
                        id="d-t"
                      >
                        Parent Department
                      </span>
                    </th>
                    <th style={{ width: "6%" }} id="mast-depart-status">
                      <span style={{ fontSize: "13px" }}>Status</span>
                    </th>
                    <th style={{ width: "10%" }} id="mast-depart-acti">
                      <span style={{ fontSize: "13px" }}>Action</span>
                    </th>
                  </tr>
                  {this.state.listData.length > 0 ? (
                    <React.Fragment>
                      {this.state.listData.map((item, key) => (
                        <tr id="one">
                          <td colspan="10">
                            <div className="tble-row">
                              <table
                                width="100%"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tr style={{ textAlign: "left" }}>
                                  <td
                                    style={{
                                      width: "30%",
                                      textAlign: "left",
                                      paddingLeft: "5%",
                                    }}
                                  >
                                    {item.department}
                                  </td>
                                  <td
                                    style={{
                                      width: "50%",
                                      textAlign: "left",
                                      paddingLeft: "4%",
                                    }}
                                  >
                                    {item.sub}
                                  </td>

                                  <td style={{ width: "6%" }}>
                                    <FormControl
                                      component="fieldset"
                                      variant="standard"
                                    >
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                      >
                                        {item.status === 1 ? (
                                          <AntSwitch
                                            // defaultChecked={
                                            //   item.status === 1 ? true : false
                                            // }
                                            checked={true}
                                            inputProps={{
                                              "aria-label": "ant design",
                                            }}
                                            name="active"
                                            onClick={() =>
                                              this.onStatusChange(key)
                                            }
                                          />
                                        ) : (
                                          <AntSwitch
                                            // defaultChecked={
                                            //   item.status === 1 ? true : false
                                            // }
                                            checked={false}
                                            inputProps={{
                                              "aria-label": "ant design",
                                            }}
                                            name="active"
                                            onClick={() =>
                                              this.onStatusChange(key)
                                            }
                                          />
                                        )}
                                      </Stack>

                                      <FormHelperText
                                        style={{
                                          textAlign: "center",
                                          fontSize: "8px",
                                        }}
                                      >
                                        {item.status == 1
                                          ? "ACTIVE"
                                          : "INACTIVE"}
                                      </FormHelperText>
                                    </FormControl>
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    <img
                                      src={ImageName.IMAGE_NAME.EDIT_SQUARE}
                                      style={{ cursor: "pointer" }}
                                      id={"basic-button" + key}
                                      className="mastlist-edit-btn"
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
                                        data-toggle="modal"
                                        // data-target="#delete-model"
                                        onClick={() => this.deletePage(item)}
                                      >
                                        Delete
                                      </MenuItem>
                                    </StyledMenu>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <tr style={{ textAlign: "center" }}>
                        <td colSpan="7">
                          <center style={{ fontSize: "20px" }}>
                            No data found !!!
                          </center>
                        </td>
                      </tr>
                    </React.Fragment>
                  )}
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
                <span
                  className="num mast-spn-num"
                  onChange={(e) => this.clickChange(e)}
                >
                  {this.state.current_page}
                </span>
                <button className="nxt_btn" onClick={this.next}>
                  {">"}
                </button>
                <button className="next_btn" onClick={this.exRigth}></button>
              </div>
              <div class="table-filter-box">
                <div class="tble-short" id="mast-tbl-sort">
                  <span class="lbl  mast-lbl-spn">Display</span>
                  <div class="dropdwn">
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
            </div>
          </div>
        </div>

        {/* ..................Filter modal................................. */}
        <div id="filter-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="filter-head _fl mdf">
                <h3>Filter by</h3>
                <div class="reset-btn-dp">
                  <button class="reset">
                    <img
                      src={ImageName.IMAGE_NAME.RESET_BTN}
                      onClick={this.onResetFilter}
                    />
                    Reset
                  </button>
                  <button class="apply" data-dismiss="modal">
                    <img
                      src={ImageName.IMAGE_NAME.BLUE_TICK}
                      onClick={this.onFilterApply}
                    />
                    Apply
                  </button>
                </div>
              </div>

              <div className="modal-body">
                <div className="model-info f-model">
                  <div className="form-search-app">
                    <div className="lable-text">requested on</div>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-field-app">
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
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-field-app">
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
                        </div>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: "40px" }}>
                      <div className="col-md-6">
                        <div class="sf-row">
                          <span class="lable-text">Parent Department</span>
                          <div class="dropdwn" style={{ marginLeft: "150px" }}>
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
                      <div class="col-md-4">
                        <div class="sf-row">
                          <div class="lable-text">Status</div>
                          <div class="dropdwn">
                            <SelectBox
                              optionData={allStatusArr}
                              value={this.state.selectedStatus}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.statusTypeChange(value);
                              }}
                            />
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

        {/* ..................Delete modal................................. */}
        <div id="delete-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-md modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="modal-body">
                {/* <div className="model-info f-model"> */}
                <div className="form-search-app">
                  <center>
                    <h6>Are you really want to delete the record? </h6>
                  </center>
                  <div className="row">
                    <div className="col-md-4"></div>
                    <div
                      class="_button-style _fl text-center"
                      style={{ marginTop: "2%" }}
                    >
                      <a
                        href="javascript:void(0)"
                        className="white-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.cancelDelete}
                      >
                        No
                      </a>
                      <a
                        href="javascript:void(0)"
                        className="blue-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.confirmDelete}
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
        {/* </div> */}
        <div
          class="modal-backdrop fade show"
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
