import React, { Component } from "react";
import { styled, Box } from "@mui/system"; //imported for modal
import ModalUnstyled from "@mui/core/ModalUnstyled"; //imported forr modal
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Menu from "@mui/material/Menu";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import history from "../../../history";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { AlertMessage, ImageName } from "../../../enums";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../SharedComponents/inputText";
import { ApiCall } from "../../../services/middleware";
import { Decoder } from "../../../services/auth";
import {
  consoleLog,
  SetDateFormat,
  SetScheduleDate,
  SetTimeFormat,
  SetUSAdateFormat,
} from "../../../services/common-function";
import { CommonData, ErrorCode } from "../../../services/constant";
import { ToastContainer, toast } from "react-toastify";
import "./AdminStaff.css";
import { courseFeeValidate } from "../../../validators";
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
      // width: 28,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      // transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    transitionDuration: "10ms",
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


export default class AdminStaff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: 1,
      total_page: 10,
      limit: 20,
      records_per_page: 2,
      searchValue: "",
      uname: "",
      emailId: "",
      mobileNo: "",
      display: "",
      // filterRoleName: filterRoleArr,
      roleArr: [],
      roleData: "",
      age: 5, // dropdwn menu age
      anchorEl: null, //menu button
      openModal: false, // open decline modal false
      openfilterModal: false, // open filter modal
      clientName: [], //FOR MULTISELECT client DROPDOWN
      statusName: [], //
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      listData: [],
      curIndex: 0,
      formDate: "",
      toDate: "",
      filterRole: "",
      isActive: false,
      selectedStatus:{}
    };
  }
  // ............................................

  componentDidMount() {
    window.scrollTo(0, 0);
    var classInstance = this;

    document.getElementById("backdrop").style.display = "none";

  

    var filterModal = document.getElementById("filter-model");
    var statusModal = document.getElementById("status-model");
    var resetModal = document.getElementById("reset-model");
    window.onclick = function (event) {
      if (event.target === filterModal) {
        classInstance.closeFilterModal();
      } else if (event.target === statusModal) {
        classInstance.closeStatusModal();
      } else if (event.target === resetModal) {
        classInstance.closeResetModal();
      }
    };

    this.load();
  }

  load = () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      name: "",
      email: "",
      mobile: "",
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: "",
      status:"",
      role: "",
        };

    this.listApi(data);
    this.roleApi();
  };

  roleApi = async () => {
    let roleDataArr = [];
    const res = await ApiCall("getroles");
    const decodeData = Decoder.decode(res.data.payload);

    // console.log("role>>>", decodeData.data);

    decodeData.data.map((obj) => {
      roleDataArr.push({
        label: obj.rolename,
        value: obj.id,
      });
    });

    this.setState({
      roleArr: roleDataArr,
    });
  };

  listApi = async (data) => {
    consoleLog("req data::",data)
    const res = await ApiCall("getadminstafflist", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      console.log("DecodeerData>>>", decodeData.data);
      let totalPage = Math.ceil(
        decodeData.data.staffcount / parseInt(this.state.limit)
      );
      if (
        decodeData.data.adminstafflist &&
        decodeData.data.adminstafflist.length > 0
      ) {
        this.setState({
          listData: decodeData.data.adminstafflist,
          total_page: totalPage,
        });
      } else {
        this.setState({
          listData: [],
        });
      }
    }
  };

  onRequestChange = (e) => {
    this.setState({
      requests: e.target.value,
    });
  };

  onNameChange = (value) => {
    this.setState({
      uname: value,
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: value,
      email: this.state.emailId,
      mobile: this.state.mobileNo,
      orderby: "",
      direc: "",
      role: this.state.roleData.value == undefined || this.state.roleData.value == null ? "" : this.state.roleData.value,
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
    };

    this.listApi(data);
  };
  onEmailChange = (value) => {
    this.setState({
      emailId: value,
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.uname,
      email: value,
      mobile: this.state.mobileNo,
      orderby: "",
      direc: "",
      role: this.state.roleData.value == undefined || this.state.roleData.value == null ? "" : this.state.roleData.value,
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
    };

    this.listApi(data);
  };
  onMobileChange = (value) => {
    let v = courseFeeValidate(value);
    this.setState({
      mobileNo: v,
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.uname,
      email: this.state.emailId,
      mobile: v,
      orderby: "",
      direc: "",
      role: this.state.roleData.value == undefined || this.state.roleData.value == null ? "" : this.state.roleData.value,
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
    };

    this.listApi(data);
  };

  onRoleChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      roleData: obj,
    });
  };

  // .............pagination function..........
  clickChange = (e) => {
    this.setState({
      current_page: e.target.value,
    });
  };
  exLeft = () => {
    this.setState({
      current_page: 1,
    });

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      name: this.state.uname,
      email: this.state.emailId,
      mobile: this.state.mobileNo,
      orderby: "",
      direc: "",
      role: this.state.roleData.value == undefined || this.state.roleData.value == null ? "" : this.state.roleData.value,
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
    };
    this.listApi(data);
  };
  exRigth = () => {
    let totalPage = this.state.total_page;
    this.setState({
      current_page: totalPage,
    });

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit),
      name: this.state.uname,
      email: this.state.emailId,
      mobile: this.state.mobileNo,
      orderby: "",
      direc: "",
      role: this.state.roleData.value == undefined || this.state.roleData.value == null ? "" : this.state.roleData.value,
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
    };
    this.listApi(data);
  };
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
        name: this.state.uname,
        email: this.state.emailId,
        mobile: this.state.mobileNo,
        orderby: "",
        direc: "",
        role: this.state.roleData.value == undefined || this.state.roleData.value == null ? "" : this.state.roleData.value,
        searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
      };
      this.listApi(data);
    }
  };
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
        name: this.state.uname,
        email: this.state.emailId,
        mobile: this.state.mobileNo,
        orderby: "",
        direc: "",
        role: this.state.roleData.value == undefined || this.state.roleData.value == null ? "" : this.state.roleData.value,
        searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
        searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
       
      };
      this.listApi(data);
    }
  };
  editPage = (item) => {
    this.props.history.push({
      pathname: "/adminEditStaff",
      state: this.state.listData[this.state.curIndex],
    });
  };

  deletePage = (item) => {};

  // ................status func...................
  onStatusChange = async (index) => {
    let arrData = this.state.listData;
    let stat = 0;

    let data = {
      staffid: arrData[index].userId,
      status: stat.toString(),
      staffusertypetd: arrData[index].userTypeId,
    };

    let status = await ApiCall("adminstaffstatuschange", data);
    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      if (arrData[index].status === 0) {
        // stat = 1;
        arrData[index].status = 1;
      } else {
        // stat = 0;
        arrData[index].status = 0;
      }
      this.setState({
        listData: arrData,
      });
      toast.success(AlertMessage.MESSAGE.UPDATE_STATUS.SUCCESS);
    } else {
      toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);

      if (arrData[index].status === 0) {
        arrData[index].status = 0;
      } else {
        arrData[index].status = 1;
      }
      this.setState({
        listData: this.state.listData,
      });
    }
  };
  //..............function for MenuButton close..............

  handleReset = () => {
    this.handleMenuClose();
    // window.$("#password-model").modal("show");
    this.openResetModal();
  };
  //   ..........add new button.......................
  addNew = () => {
    history.push("/adminAddStaff");
  };
  //................funct for menuBtn on click................
  menuBtnhandleClick = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };
  //...................function for decline modal close......
  handleModalClose = () => {
    this.setState({
      openModal: false,
    });
  };

  //   ......................func for filter modal open...............
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
  openStatusModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("status-model").style.display = "block";
    document.getElementById("status-model").classList.add("show");
  };

  closeStatusModal = () => {
    document.getElementById("status-model").style.display = "none";
    document.getElementById("status-model").classList.remove("show");
    document.getElementById("backdrop").style.display = "none";
  };
  openResetModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("reset-model").style.display = "block";
    document.getElementById("reset-model").classList.add("show");
  };

  closeResetModal = () => {
    document.getElementById("reset-model").style.display = "none";
    document.getElementById("reset-model").classList.remove("show");
    document.getElementById("backdrop").style.display = "none";
  };

  // .............filter modal function...................

  formDateChange = (date) => {
    this.setState({
      formDate: SetUSAdateFormat(date),
    });
  };

  toDateChange = (date) => {
    this.setState({
      toDate: SetUSAdateFormat(date),
    });
  };
  statusTypeChange = (dat) => {
    this.setState({
      selectedStatus: dat,
    });
  };

  onFilterApply = () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      // searchform: this.state.formDate,
      // searchto: this.state.toDate,
      role: this.state.roleData.value == undefined || this.state.roleData.value == null ? "" : this.state.roleData.value,
      name: this.state.uname,
      email: this.state.emailId,
      mobile: this.state.mobileNo,
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
    };

    // window.$("#create-filter-model").modal("hide");
    // console.log("Filter data", data)

    this.listApi(data);

    this.setState({
     current_page:1
    });
    this.closeFilterModal();
  };

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: "",
      roleData: "",
      selectedStatus:{},
      current_page: 1,
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
    });

    this.load();

    this.closeFilterModal();
  };

  //......Ascending order .........

  ascOrder = (data) => {
    let filter = "";
    if (data === "userName") {
      filter = "name";
    } else if (data === "email") {
      filter = "email";
    } else if (data === "mobile") {
      filter = "mobile";
    } else if (data === "role") {
      filter = "role";
    } else if (data === "date") {
      filter = "lastUpdated";
    }

    let req = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.uname,
      email: this.state.emailId,
      mobile: this.state.mobileNo,
      orderby: filter,
      direc: "ASC",
      searchto: "",
      searchfrom: "",
    };

    this.listApi(req);
  };

  //......Descending order .........

  descOrder = (data) => {
    let filter = "";
    if (data === "userName") {
      filter = "name";
    } else if (data === "email") {
      filter = "email";
    } else if (data === "mobile") {
      filter = "mobile";
    } else if (data === "role") {
      filter = "role";
    } else if (data === "date") {
      filter = "lastUpdated";
    }

    let req = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.uname,
      email: this.state.emailId,
      mobile: this.state.mobileNo,
      orderby: filter,
      direc: "DESC",
      searchto: "",
      searchfrom: "",
    };

    this.listApi(req);
  };

  onChangeLimit = (dat) => {
    this.setState({
      limit: parseInt(dat.value),
      selectedDisplayData: dat,
      current_page:1
    });

    let data = {
      limit: dat.value,
      offset: "0",
      name: this.state.uname,
      email: this.state.emailId,
      mobile: this.state.mobileNo,
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      role: this.state.roleData.value == undefined || this.state.roleData.value == null ? "" : this.state.roleData.value,
     
    };

    this.listApi(data);
  };

  onStatusModal = (index) => {
    if (this.state.listData[this.state.curIndex].status === 1) {
      this.setState({
        isActive: true,
      });
    } else {
      this.setState({
        isActive: false,
      });
    }

    // window.$("#status-model").modal("show");
    this.openStatusModal();
    this.handleMenuClose();
  };

  //........ No Delete .......

  cancelDelete = () => {
    // window.$("#status-model").modal("hide");
    // window.$("#password-model").modal("hide");
    this.closeResetModal();
  };
  cancelStatus = () => {
    this.closeStatusModal();
  };
  //........ Activate or Deactivate modal .......

  statusUpdate = async () => {
    // window.$("#status-model").modal("hide");
    this.closeStatusModal();

    let arrData = this.state.listData;
    let stat = 0;
    if (arrData[this.state.curIndex].status === 0) {
      stat = 1;
    } else {
      stat = 0;
    }

    let data = {
      staffid: arrData[this.state.curIndex].userId,
      status: stat.toString(),
      staffusertypetd: arrData[this.state.curIndex].userTypeId,
    };

    let status = await ApiCall("adminstaffstatuschange", data);
    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.load();
      toast.success(AlertMessage.MESSAGE.UPDATE_STATUS.SUCCESS);
    }
  };

  //............Reset Password...........

  onResetPassword = async () => {
    // window.$("#password-model").modal("hide");

    this.closeResetModal();

    let pass = this.randomString(10, "aA#!");

    let data = {
      staffid: this.state.listData[this.state.curIndex].userId,
      password: pass,
    };

    consoleLog("req",data)

    // let status = await ApiCall("userpasswordreset", data);
    // if (
    //   status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {
    //   toast.success(AlertMessage.MESSAGE.PASSWORD.RESET_SUCCESS);
    // }
  };

  //........... Export File...............

  onExport = async () => {
    let data = {
      name: this.state.uname,
      email: this.state.emailId,
      mobile: this.state.mobileNo,
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: "",
    };
    let res = await ApiCall("exportadminstaff", data);
    const decodeData = Decoder.decode(res.data.payload);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      window.open(decodeData.data.fileUrl, "_blank");
    }
  };

  randomString = (length, chars) => {
    var mask = "";
    if (chars.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
    if (chars.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (chars.indexOf("#") > -1) mask += "0123456789";
    if (chars.indexOf("!") > -1) mask += "@#$%&_";
    var result = "";
    for (var i = length; i > 0; --i)
      result += mask[Math.floor(Math.random() * mask.length)];
    return result;
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
              <Link to="/adminDashboard">Dashboard</Link> / Admin Staff
            </div>
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
                      <span
                        style={{
                          width: "30%",
                          paddingLeft: "5px",
                          fontSize: "14px",
                        }}
                      >
                        Name
                      </span>
                      <InputText
                        placeholder="Search"
                        className="inputfield mb-4"
                        value={this.state.uname}
                        onTextChange={(value) => {
                          this.onNameChange(value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vn_frm">
                      <span
                        style={{
                          width: "30%",
                          paddingLeft: "20px",
                          fontSize: "14px",
                        }}
                      >
                        Email
                      </span>
                      <InputText
                        placeholder="Search"
                        className="inputfield mb-4"
                        value={this.state.emailId}
                        onTextChange={(value) => {
                          this.onEmailChange(value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vn_frm">
                      <span
                        style={{
                          width: "30%",
                          paddingLeft: "10px",
                          fontSize: "14px",
                        }}
                      >
                        Mobile No
                      </span>
                      <InputText
                        type="text"
                        placeholder="Search"
                        className="inputfield mb-4"
                        value={this.state.mobileNo}
                        onTextChange={(value) => {
                          this.onMobileChange(value);
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
                <button
                  className="prev_btn"
                  onClick={this.exLeft}
                  // disabled={this.state.listData.length > 0 ? false : true}
                ></button>
                <button
                  className="prv_btn"
                  onClick={this.prev}
                  // disabled={this.state.listData.length > 0 ? false : true}
                >
                  {" "}
                  {"<"}
                </button>
                <span className="num" onChange={(e) => this.clickChange(e)}>
                  {this.state.current_page}
                </span>
                <button
                  className="nxt_btn"
                  onClick={this.next}
                  // disabled={this.state.listData.length > 0 ? false : true}
                >
                  {">"}
                </button>
                <button
                  className="next_btn"
                  onClick={this.exRigth}
                  // disabled={this.state.listData.length > 0 ? false : true}
                ></button>
              </div>
              <div class="table-filter-box">
                <div class="export-btn" onClick={this.onExport}>
                  <a href="javascript:void(0)">
                    Export{" "}
                    <img
                      src={ImageName.IMAGE_NAME.EXPORT_BTN}
                      style={{ width: "25px", cursor: "pointer" }}
                    />
                  </a>
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
                  <tr id="manage-admin-staf-cont">
                    <th style={{ width: "15%" }}>
                      <div class="sorting_btn" id="admin-staf-sort-btn">
                        <button
                          class="t1 sort-btn1"
                          onClick={() => this.ascOrder("userName")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button class="t1 sort-btn1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("userName")}
                          />
                        </button>
                      </div>
                      <span style={{ fontSize: "13px" }}>Name</span>
                    </th>
                    <th style={{ width: "20%" }}>
                      <div class="sorting_btn">
                        <button class="t1 sort-btn1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_UP}
                            onClick={() => this.ascOrder("email")}
                          />
                        </button>
                        <button class="t1 sort-btn1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("email")}
                          />
                        </button>
                      </div>
                      <span style={{ fontSize: "13px" }}>Email</span>
                    </th>
                    <th style={{ width: "15%" }}>
                      <div class="sorting_btn">
                        <button class="t1 sort-btn1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_UP}
                            onClick={() => this.ascOrder("mobile")}
                          />
                        </button>
                        <button class="t1 sort-btn1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("mobile")}
                          />
                        </button>
                      </div>
                      <span style={{ fontSize: "13px" }}>Mobile No</span>
                    </th>
                    <th style={{ width: "10%" }}>
                      <div class="sorting_btn">
                        <button class="t1 sort-btn1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_UP}
                            onClick={() => this.ascOrder("role")}
                          />
                        </button>
                        <button class="t1 sort-btn1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("role")}
                          />
                        </button>
                      </div>
                      <span style={{ fontSize: "13px" }}>Role</span>
                    </th>
                    <th style={{ width: "15%" }}>
                      <div class="sorting_btn">
                        <button class="t1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_UP}
                            onClick={() => this.ascOrder("date")}
                          />
                        </button>
                        <button class="t1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("date")}
                          />
                        </button>
                      </div>
                      <span style={{ fontSize: "13px" }}>Last Modified on</span>
                    </th>

                    <th style={{ width: "10%" }} id="status-text">
                      <span style={{ fontSize: "13px" }}>Status</span>
                    </th>
                    <th style={{ width: "10%" }} id="action-text">
                      <span style={{ fontSize: "13px" }}>Action</span>
                    </th>
                  </tr>
                  {this.state.listData.length > 0 ? (
                    <React.Fragment>
                      {this.state.listData.map((item, key) => (
                        <tr>
                          <td colspan="10">
                            <div
                              className="tble-row"
                              id="adminstaf-tabl-datil-cont"
                            >
                              <table
                                width="100%"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                id="adminstaf-tabl-cont"
                              >
                                <tr>
                                  <td style={{ width: "15%" }}>{item.name}</td>
                                  <td style={{ width: "20%" }}>{item.email}</td>
                                  <td style={{ width: "15%" }}>
                                    +{item.countrycode} {item.mobile}
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    {item.rolename}
                                  </td>
                                  <td style={{ width: "15%" }}>
                                    {SetDateFormat(item.lastUpdated)}
                                    <br />
                                    {SetTimeFormat(item.lastUpdated)}
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
                                        {item.status === 1
                                          ? "ACTIVE"
                                          : "INACTIVE"}
                                      </FormHelperText>
                                    </FormControl>
                                  </td>

                                  <td style={{ width: "10%" }}>
                                    <img
                                      // src="/assets_temp/images/edit.png"
                                      src={ImageName.IMAGE_NAME.MENU_VERTICAL}
                                      style={{ cursor: "pointer" }}
                                      id="basic-button"
                                      aria-controls="basic-menu"
                                      aria-haspopup="true"
                                      aria-expanded={open ? "true" : undefined}
                                      onClick={(e) =>
                                        this.menuBtnhandleClick(key, e)
                                      }
                                    />
                                    <Menu
                                      id="basic-menu"
                                      anchorEl={this.state.anchorEl}
                                      open={open}
                                      onClose={this.handleMenuClose}
                                      MenuListProps={{
                                        "aria-labelledby": "basic-button",
                                      }}
                                    >
                                      <MenuItem
                                        onClick={() => this.editPage(item)}
                                      >
                                        Edit
                                      </MenuItem>
                                      <MenuItem onClick={this.handleReset}>
                                        Reset Password
                                      </MenuItem>
                                      {/* <MenuItem>View Jobs</MenuItem>
                                      <MenuItem>View Projects</MenuItem> */}
                                      <MenuItem
                                        onClick={() => this.onStatusModal(key)}
                                      >
                                        De-Activate or Activate
                                      </MenuItem>
                                    </Menu>
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
                        <td colSpan="10">
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
                <span className="num" onChange={(e) => this.clickChange(e)}>
                  {this.state.current_page}
                </span>
                <button className="nxt_btn" onClick={this.next}>
                  {">"}
                </button>
                <button className="next_btn" onClick={this.exRigth}></button>
              </div>
              <div class="table-filter-box">
                <div class="tble-short" id="manage-admin-stf-disptext">
                  <span class="lbl manage-admin-stf-dispspn">Display</span>
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

        {/* ..................modal................................. */}
        <div id="filter-model" class="modal fade modelwindow" role="dialog">
          <div class="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div class="modal-content">
              <div class="filter-head _fl mdf">
                <h3>Filter by</h3>
                <div class="reset-btn-dp">
                  <button class="reset" data-dismiss="modal">
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

              <div class="modal-body">
                <div class="model-info f-model">
                  <div class="form-search-app">
                    <div class="lable-text">requested on</div>
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
                      <div class="col-md-6">
                        <div class="sf-row">
                          <div
                            class="lable-text"
                            style={{ paddingLeft: "10px", fontSize: "16px" }}
                          >
                            Role
                          </div>
                          <div class="dropdwn">
                            <SelectBox
                              optionData={this.state.roleArr}
                              value={this.state.roleData}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onRoleChange(value);
                              }}
                            />
                           
                          </div>
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div class="sf-row">
                          <div class="lable-text" style={{ fontSize: "13px" }}>
                            Status
                          </div>
                          <div
                            class="dropdwn"
                            style={{
                              cursor: "pointer",
                            }}
                          >
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

        {/* ..................status modal................................. */}
        <div id="status-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="modal-body">
                {/* <div className="model-info f-model"> */}
                <div className="form-search-app">
                  <center>
                    <h6>
                      Are you really want to{" "}
                      {this.state.isActive ? "Deactivate" : "Activate"} the
                      record?{" "}
                    </h6>
                  </center>
                  <div className="row">
                    <div className="col-md-4"></div>
                    <div
                      class="_button-style _fl text-center"
                      style={{ marginTop: "2%" }}
                    >
                      <a
                        className="white-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.cancelStatus}
                      >
                        No
                      </a>
                      <a
                        className="blue-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.statusUpdate}
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

        {/* ..................Reset Password modal................................. */}
        <div id="reset-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="modal-body">
                {/* <div className="model-info f-model"> */}
                <div className="form-search-app">
                  <center>
                    <h6>
                      Are you really want to reset the password for selected
                      user?{" "}
                    </h6>
                  </center>
                  <div className="row">
                    <div className="col-md-4"></div>
                    <div
                      class="_button-style _fl text-center"
                      style={{ marginTop: "2%" }}
                    >
                      <a
                        className="white-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.cancelDelete}
                      >
                        No
                      </a>
                      <a
                        className="blue-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.onResetPassword}
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