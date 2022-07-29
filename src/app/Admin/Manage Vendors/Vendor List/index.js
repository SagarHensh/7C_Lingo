import React from "react";
import { AlertMessage, ImageName } from "../../../../enums";
import "./vendorList.css";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/system";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import ReactStars from "react-rating-stars-component";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../../SharedComponents/inputText";
import { passwordValidator, zipValidate } from "../../../../validators";
import {
  consoleLog,
  getLookUpDataFromAPI,
  phoneNumberCheck,
  SetDatabaseDateFormat,
  SetDateFormat,
  SetUSAdateFormat,
  textTruncate,
} from "../../../../services/common-function";
import { Link } from "react-router-dom";
import history from "../../../../history";
import { ApiCall, ApiCallVendor } from "../../../../services/middleware";
import { Decoder } from "../../../../services/auth";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { passWordRandomGenerate } from "./function";
import LotteLoader from "../../../Loader/LotteLoader";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "20%",
//   bgcolor: "background.paper",
//   border: "none",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: "10px",
// };
// // .........for vacation modal,,,,,,,,,,

// const vacationStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "60%",
//   bgcolor: "background.paper",
//   border: "none",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: "10px",
// };

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

export default class VendorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: 1,
      total_page: 10,
      limit: 20,
      offset: 0,
      curIndex: 0,
      anchorEl: null, //menu button
      listData: [],
      name: "",
      email: "",
      mobile: "",
      formDate: "",
      toDate: "",
      declineMessage: "",
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      allStatus: [
        {
          label: "Active",
          value: "1",
        },
        {
          label: "Inactive",
          value: "0",
        },
      ],
      selectedStatus: {},
      status: "",
      allVendorType: [],
      selectedVendorType: {
        label: "None",
        value: "",
      },
      type: "",
      availabileData: {},
      openModal: false,
      openVacationModal: false,
      vacationList: [],
      vendorId: "",

      isActive: false,
      resetPasswordData: "",
      isLoad : true,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    document.getElementById("backdrop").style.display = "none";

    var classInstance = this;

    var modal = document.getElementById("create-filter-model");
    var statusModal = document.getElementById("status-model");
    var viewModal = document.getElementById("viewModal");
    var resetModal = document.getElementById("password-model");
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === modal) {
        classInstance.closeFilterModal();
      } else if (event.target === statusModal) {
        classInstance.closeStatusModal();
      } else if (event.target === viewModal) {
        classInstance.closeAvailabilityViewModal();
      } else if (event.target === resetModal) {
        classInstance.closeResetModal();
      }
    };

    this.load();
  }

  load = async () => {
    let type = [
      {
        label: "None",
        value: "",
      },
    ];
    let lookUpData = await getLookUpDataFromAPI();
    lookUpData.VENDOR_TYPE.map((data) => {
      type.push({
        label: data.name,
        value: data.id,
      });
    });

    this.setState({
      allVendorType: type,
    });

    let req = {
      name: "",
      email: "",
      phone: "",
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom: "",
      type: "",
      status: "",
    };

    this.listApi(req);
  };

  listApi = async (data) => {
    // consoleLog("request::", data);
    let res = await ApiCall("fetchapprovedvendorlist", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      let totalPage = Math.ceil(payload.data.count / this.state.limit);
      let arr = [];
      // consoleLog("All List", payload.data);
      if (payload.data.details.length > 0) {
        arr = payload.data.details;
      } else {
        arr = [];
      }
      this.setState({
        listData: arr,
        total_page: totalPage,
        isLoad : false
      });
    }
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
      name: this.state.name,
      email: this.state.email,
      phone: this.state.mobile,
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      direc: "",
      orderby: "",
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      type: this.state.type,
      status: this.state.status.toString(),
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
      name: this.state.name,
      email: this.state.email,
      phone: this.state.mobile,
      direc: "",
      orderby: "",
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      type: this.state.type,
      status: this.state.status.toString(),
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
    }
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((currentPage - 1) * this.state.limit),
      name: this.state.name,
      email: this.state.email,
      phone: this.state.mobile,
      direc: "",
      orderby: "",
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      type: this.state.type,
      status: this.state.status.toString(),
    };
    this.listApi(data);
  };
  next = () => {
    let currentPage = this.state.current_page;
    let totalPage = this.state.total_page;

    if (currentPage < totalPage) {
      currentPage++;
      this.setState({
        current_page: currentPage,
      });
    }
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((currentPage - 1) * this.state.limit),
      name: this.state.name,
      email: this.state.email,
      phone: this.state.mobile,
      direc: "",
      orderby: "",
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      type: this.state.type,
      status: this.state.status.toString(),
    };
    this.listApi(data);
  };

  //........Page show Limit.........

  onChangeLimit = (value) => {
    this.setState({
      limit: parseInt(value.value),
      selectedDisplayData: value,
      current_page: 1,
    });

    let data = {
      limit: value.value,
      offset: "0",
      name: this.state.name,
      email: this.state.email,
      phone: this.state.mobile,
      direc: "",
      orderby: "",
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      type: this.state.type,
      status: this.state.status.toString(),
    };

    this.listApi(data);
  };

  //......Ascending order .........

  ascOrder = (data) => {
    let filter = "";
    if (data === "type") {
      filter = "type";
    } else if (data === "fname") {
      filter = "fName";
    } else if (data === "lname") {
      filter = "lName";
    } else if (data === "agency") {
      filter = "agencyName";
    } else if (data === "email") {
      filter = "email";
    } else if (data === "mobile") {
      filter = "phone";
    }

    let req = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.name,
      email: this.state.email,
      phone: this.state.mobile,
      orderby: filter,
      direc: "ASC",
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      type: this.state.type,
      status: this.state.status.toString(),
    };

    this.listApi(req);
  };

  //......Descending order .........

  descOrder = (data) => {
    let filter = "";
    if (data === "type") {
      filter = "type";
    } else if (data === "fname") {
      filter = "fName";
    } else if (data === "lname") {
      filter = "lName";
    } else if (data === "agency") {
      filter = "agencyName";
    } else if (data === "email") {
      filter = "email";
    } else if (data === "mobile") {
      filter = "phone";
    }

    let req = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.name,
      email: this.state.email,
      phone: this.state.mobile,
      orderby: filter,
      direc: "DESC",
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      type: this.state.type,
      status: this.state.status.toString(),
    };

    this.listApi(req);
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

  //..... for search name......

  onNameChange = (value) => {
    this.setState({
      name: value,
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: value,
      email: this.state.email,
      phone: this.state.mobile,
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      type: this.state.type,
      status: this.state.status.toString(),
    };

    this.listApi(data);
  };
  onEmailChange = (value) => {
    this.setState({
      email: value,
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.name,
      email: value,
      phone: this.state.mobile,
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      type: this.state.type,
      status: this.state.status.toString(),
    };

    this.listApi(data);
  };
  onMobileChange = (value) => {
    let val = zipValidate(value);
    this.setState({
      mobile: val,
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.name,
      email: this.state.email,
      phone: value,
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      type: this.state.type,
      status: this.state.status.toString(),
    };

    this.listApi(data);
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

  vendorTypeChange = (value) => {
    this.setState({
      selectedVendorType: value,
      type: value.value,
    });
  };

  filterStatusChange = (value) => {
    this.setState({
      selectedStatus: value,
      status: value.value,
    });
  };

  onFilterApply = () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      name: this.state.name,
      email: this.state.email,
      phone: this.state.mobile,
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      type: this.state.type,
      status: this.state.status,
    };
    this.closeFilterModal();

    this.listApi(data);

    this.setState({
      current_page: 1
    });
  };

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: "",
      selectedVendorType: {
        label: "None",
        value: "",
      },
      type: "",
      selectedStatus: {},
      status: "",
      current_page: 1,
    });

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      name: "",
      email: "",
      phone: "",
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: "",
      type: "",
      status: "",
    };
    this.closeFilterModal();

    this.listApi(data);
  };
  resetData = () => {
    this.setState({
      type: "",
      selectedStatus: {},
      status: "",
      selectedVendorType: {
        label: "None",
        value: ""
      }
    })
  }


  openFilterModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("create-filter-model").style.display = "block";
    document.getElementById("create-filter-model").classList.add("show");
  };
  closeFilterModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("create-filter-model").style.display = "none";
    document.getElementById("create-filter-model").classList.remove("show");
    this.resetData();
  };

  openStatusModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("status-model").style.display = "block";
    document.getElementById("status-model").classList.add("show");
  };
  closeStatusModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("status-model").style.display = "none";
    document.getElementById("status-model").classList.remove("show");
  };

  openViewModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("viewModal").style.display = "block";
    document.getElementById("viewModal").classList.add("show");
  };
  closeAvailabilityViewModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("viewModal").style.display = "none";
    document.getElementById("viewModal").classList.remove("show");
  };
  openResetModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("password-model").style.display = "block";
    document.getElementById("password-model").classList.add("show");
  };

  closeResetModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("password-model").style.display = "none";
    document.getElementById("password-model").classList.remove("show");
  };

  // ................status func...................
  onStatusChange = async (index) => {
    let arrData = this.state.listData;
    let stat = "0";
    if (arrData[index].vendorstatus === 0) {
      stat = "1";
    } else {
      stat = "0";
    }
    arrData[index].vendorstatus = stat;
    this.setState({
      listData: arrData,
    });
    let data = {
      vendorid: arrData[index].id,
      status: stat,
    };
    let status = await ApiCall("deletevendorAcccount", data);

    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.UPDATE_STATUS.SUCCESS);
      this.load();
    }
  };

  onStatusModal = () => {
    if (
      this.state.listData[this.state.curIndex].vendorstatus === 1 ||
      this.state.listData[this.state.curIndex].vendorstatus === "1"
    ) {
      this.setState({
        isActive: true,
      });
    } else {
      this.setState({
        isActive: false,
      });
    }

    this.openStatusModal();
    this.handleMenuClose();
  };

  // ................status func for modal ...................
  onModalStatusChange = async () => {
    let arrData = this.state.listData;
    let stat = "0";
    if (arrData[this.state.curIndex].vendorstatus === 0) {
      stat = "1";
    } else {
      stat = "0";
    }
    // arrData[this.state.curIndex].vendorstatus = stat;
    // this.setState({
    //     listData: arrData,
    // });
    let data = {
      vendorid: arrData[this.state.curIndex].id,
      status: stat,
    };
    let status = await ApiCall("deletevendorAcccount", data);

    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.UPDATE_STATUS.SUCCESS);
      this.load();
      this.closeStatusModal();
    }
  };

  // handleViewModal = () => {
  //   this.openViewModal();
  // };

  goEdit = () => {
    this.props.history.push({
      pathname: "/adminVendorEdit",
      state: this.state.listData[this.state.curIndex],
    });
  };

  onDocument = () => {
    this.props.history.push({
      pathname: "/adminVendorDocs",
      state: this.state.listData[this.state.curIndex].id,
    });
  };

  onExport = async () => {
    let data = {
      direc: "",
      email: "",
      limit: "10",
      name: "",
      offset: "0",
      orderby: "",
      phone: "",
      searchfrom: "",
      searchto: "",
    };
    let res = await ApiCall("exportvendorlist", data);
    const decodeData = Decoder.decode(res.data.payload);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      window.open(decodeData.data.fileUrl, "_blank");
    }
  };

  vendorRateCards = () => {
    // return history.push("/adminVendorRateCard");
    this.props.history.push({
      pathname: "/adminVendorRateCard",
      state: this.state.listData[this.state.curIndex],
    });
  };

  openAvailabilityModal = async (userId) => {
    let res = await ApiCall("fetchVendorAvailablityList", {
      vendorId: userId,
    });
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);

      this.setState({
        availabileData: payload.data,
      });
      this.openViewModal();
    }
    this.setState({
      openModal: false,
    });

    // ...........for  vacation..........


    let objData = {
      vendorId: userId,
    };
    let resVac = await ApiCallVendor("fetchVendorVaccationListByUserId", objData);

    if (
      resVac.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resVac.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let DecodeData = Decoder.decode(resVac.data.payload);
      // consoleLog("response vac::", DecodeData);
      if (DecodeData.data.vaccationList.length > 0) {
        this.setState({
          vacationList: DecodeData.data.vaccationList,
        });
      } else {
        this.setState({
          vacationList: [],
        });
      }
    }
  };

  handleReset = () => {
    let mainPass = passWordRandomGenerate();
    this.setState({
      resetPasswordData: mainPass
    })
    this.handleMenuClose();
    this.openResetModal();
  };
  cancelDelete = () => {
    // window.$("#status-model").modal("hide");
    this.closeResetModal();
  };
  //............Reset Password...........

  onResetPassword = async () => {


    let errorCount = 0;

    let validatePassword = passwordValidator(this.state.resetPasswordData)

    if (validatePassword.status === false) {
      toast.error(validatePassword.message, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // let pass = this.randomString(10, "aA#!");

    if (errorCount === 0) {

      let data = {
        staffid: this.state.listData[this.state.curIndex].id,
        password: this.state.resetPasswordData,
      };

      let status = await ApiCall("userpasswordreset", data);
      if (
        status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        this.closeResetModal();
        toast.success(AlertMessage.MESSAGE.PASSWORD.RESET_SUCCESS);
      }
    }

  };

  onResetPassChange = (e) => {
    this.setState({
      resetPasswordData: e.target.value,
    });
  };





  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
        {/* <Header /> */}
        <ToastContainer hideProgressBar={true} theme="colored" />
        {/* <Sidebar /> */}
        <div className="component-wrapper" hidden={!this.state.isLoad}>
          <LotteLoader />
        </div>
        <div className="component-wrapper" hidden={this.state.isLoad}>
          <div className="listing-component-app">
            <div
              className="vn_frm"
              style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
            >
              {" "}
              <Link to="/adminDashboard">Dashboard</Link> / Vendors
            </div>
            <div className="vendor-info _fl sdw">
              <div className="vn-form _fl">
                <div className="row">
                  <div className="col-md-4">
                    <div className="vn_frm">
                      {" "}
                      <span>Name</span>
                      <InputText
                        type="text"
                        value={this.state.name}
                        placeholder="Search"
                        className="inputfield"
                        onTextChange={(value) => {
                          this.onNameChange(value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vn_frm">
                      {" "}
                      <span>Email</span>
                      <InputText
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.email}
                        onTextChange={(value) => {
                          this.onEmailChange(value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vn_frm">
                      {" "}
                      <span>Phone No.</span>
                      <InputText
                        type="text"
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.mobile}
                        onTextChange={(value) => {
                          this.onMobileChange(value);
                        }}
                      />
                      {/* <input type="text" value="" name="" placeholder="Search" className="inputfield" /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="table-filter-app-b">
                                <div className="table-filter-box">
                                    <div className="filter-btn"><a href="#">Filter</a></div>
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
                                    <div className="export-btn"><a href="#">Export</a></div>
                                    <div className="addnew"><a href="#">Add New</a></div>
                                    <div className="tble-short">
                                        <span className="lbl">Display</span>
                                        <div className="dropdwn">
                                            <select className="myDropdown frm4-select">
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

            <div class="table-filter-app-b">
              <div class="filter-btn">
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    this.openFilterModal();
                  }}
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
                <span className="num" onChange={(e) => this.clickChange(e)}>
                  {this.state.current_page}
                </span>
                <button className="nxt_btn" onClick={this.next}>
                  {">"}
                </button>
                <button className="next_btn" onClick={this.exRigth}></button>
              </div>
              <div class="table-filter-box">
                <div class="export-btn" onClick={this.onExport}>
                  <a href="#">
                    Export{" "}
                    <img
                      src={ImageName.IMAGE_NAME.EXPORT_BTN}
                      style={{ width: "25px", cursor: "pointer" }}
                    />
                  </a>
                </div>
                <div class="addnew">
                  <Link to="/adminVendorAdd">
                    Add New{" "}
                    <img
                      className=""
                      src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                      style={{ width: "25px", cursor: "pointer" }}
                      onClick={this.addNew}
                    />
                  </Link>
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
                      placeholder=""
                      onSelectChange={(value) => {
                        this.onChangeLimit(value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="table-listing-app md4">
              <div className="table-responsive">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    {/* <th style={{ width: "9%" }}>
                                                <div className="sorting_btn">
                                                    <button className="t1"
                                                        onClick={() => this.ascOrder("id")}
                                                    >
                                                        <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                                                    </button>
                                                    <button className="t1">
                                                        <img src={ImageName.IMAGE_NAME.ARROW_DOWN}
                                                            onClick={() => this.descOrder("id")}
                                                        />
                                                    </button>
                                                </div>
                                                Vendor ID
                                            </th> */}
                    <th style={{ width: "9%" }}>
                      <div className="sorting_btn">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("type")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button className="t1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("type")}
                          />
                        </button>
                      </div>
                      Type
                    </th>
                    <th style={{ width: "9%" }}>
                      <div className="sorting_btn">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("fname")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button className="t1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("fname")}
                          />
                        </button>
                      </div>
                      First Name
                    </th>
                    <th style={{ width: "9%" }}>
                      <div className="sorting_btn">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("lname")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button className="t1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("lname")}
                          />
                        </button>
                      </div>
                      Last Name
                    </th>
                    <th style={{ width: "15%" }}>
                      <div className="sorting_btn">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("email")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button className="t1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("email")}
                          />
                        </button>
                      </div>
                      Email
                    </th>
                    <th style={{ width: "10% " }}>
                      <div className="sorting_btn">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("mobile")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button className="t1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("mobile")}
                          />
                        </button>
                      </div>
                      Phone No
                    </th>
                    <th style={{ width: "15%" }}>Service(s) offered</th>
                    <th style={{ width: "9%" }}>Rating</th>
                    <th style={{ width: "9%" }}>Availability</th>
                    <th style={{ width: "6%" }}>Status</th>
                    <th style={{ width: "4%" }}>Action</th>
                  </tr>
                  {this.state.listData.length > 0 ? (
                    <React.Fragment>
                      {this.state.listData.map((data, key) => (
                        <tr>
                          <td colspan="11">
                            <div className="tble-row">
                              <table
                                width="100%"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tr>
                                  <td style={{ width: "9%" }}>{data.type}</td>
                                  <td style={{ width: "9%" }}>{data.fName}</td>
                                  <td style={{ width: "9%" }}>{data.lName}</td>
                                  {data.email.length > 20 ? (
                                    <td
                                      style={{ width: "15%" }}
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title={data.email}
                                    >
                                      {textTruncate(data.email, 20)}
                                    </td>
                                  ) : (
                                    <td style={{ width: "15%" }}>
                                      {textTruncate(data.email, 20)}
                                    </td>
                                  )}
                                  {/* <td style={{ width: "15%" }}>
                                  {textTruncate(data.email, 20)}
                                </td> */}
                                  <td style={{ width: "10%" }}>{data.phone}</td>
                                  <td style={{ width: "15%" }}>
                                    {data.serviceOffered}
                                  </td>
                                  <td style={{ width: "9%" }}>
                                    <ReactStars
                                      count={5}
                                      // onChange={ratingChanged}
                                      size={18}
                                      color2="#009fe0"
                                      value={data.ratings}
                                      edit={false}
                                    />
                                  </td>
                                  <td style={{ width: "9%" }}>
                                    <a
                                      href="javascript:void(0)"
                                      className="view"
                                      style={{
                                        cursor: "pointer",
                                        textDecoration: "none",
                                      }}
                                      onClick={() =>
                                        this.openAvailabilityModal(data.id)
                                      }
                                    >
                                      View
                                    </a>
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
                                        {data.vendorstatus === 1 ||
                                          data.vendorstatus === "1" ? (
                                          <AntSwitch
                                            // defaultChecked={data.vendorstatus === 1 ? true : false}
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
                                            // defaultChecked={data.vendorstatus === 1 ? true : false}
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
                                      {/* <FormHelperText style={{ textAlign: "center", fontSize: "8px" }}>
                                                                        {data.status === 1 ? "ACTIVE" : "INACTIVE"}
                                                                    </FormHelperText> */}
                                    </FormControl>
                                  </td>
                                  <td style={{ width: "4%" }}>
                                    <img
                                      src={ImageName.IMAGE_NAME.MENU_VERTICAL}
                                      style={{ cursor: "pointer" }}
                                      id={"basic-button" + key}
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
                                      <MenuItem onClick={() => this.goEdit()}>
                                        Profile
                                      </MenuItem>
                                      <MenuItem onClick={this.handleReset}>
                                        Reset Password
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => this.onDocument()}
                                      >
                                        Verification Docs
                                      </MenuItem>
                                      <MenuItem>View Jobs</MenuItem>
                                      <MenuItem>View Projects</MenuItem>
                                      <MenuItem
                                        onClick={() => this.vendorRateCards()}
                                      >
                                        Rate Cards
                                      </MenuItem>
                                      <MenuItem>Invoices</MenuItem>
                                      <MenuItem
                                        onClick={() => this.onStatusModal()}
                                      >
                                        De-Activate or Activate
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
                        <td colSpan="11">
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
              <div className="tble-short">
                <span class="lbl">
                  Page {this.state.current_page} of {this.state.total_page}
                </span>
              </div>
              <div class="table-filter-box">
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
                      placeholder=""
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
                      {/* <span>from</span>
                      <input
                        type="date"
                        class="datefield bd"
                        placeholder="10/25/2021"
                        value={this.state.formDate}
                        onChange={this.formDateChange}
                      /> */}
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
                    <div class="form-field-app">
                      {/* <span>to</span>
                      <input
                        type="date"
                        class="datefield bd"
                        placeholder="10/25/2021"
                        value={this.state.toDate}
                        onChange={this.toDateChange}
                      /> */}
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
                              // minDate={new Date(this.state.formDate)}
                              onChange={(date) => this.toDateChange(date)}
                              customInput={<Schedule />}
                            />
                          </a>
                        </div>
                      </div>
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
                            Type
                          </div>
                          <div class="dropdwn">
                            <SelectBox
                              optionData={this.state.allVendorType}
                              value={this.state.selectedVendorType}
                              onSelectChange={(value) =>
                                this.vendorTypeChange(value)
                              }
                            ></SelectBox>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="sf-row">
                          <div
                            class="lable-text"
                            style={{ paddingLeft: "10px", fontSize: "16px" }}
                          >
                            Status
                          </div>
                          <div class="dropdwn" style={{ marginLeft: "25%" }}>
                            <SelectBox
                              optionData={this.state.allStatus}
                              value={this.state.selectedStatus}
                              onSelectChange={(value) =>
                                this.filterStatusChange(value)
                              }
                            ></SelectBox>
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
        {/* ..................DeActivate modal................................. */}
        <div id="status-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-md modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="modal-body">
                {/* <div className="model-info f-model"> */}
                <div className="form-search-app">
                  <center>
                    <h6>
                      Are you sure you want to{" "}
                      {this.state.isActive ? "Deactivate" : "Activate"} this vendor?{" "}
                    </h6>
                  </center>
                  <div className="row">
                    <div className="col-md-4"></div>
                    <div
                      class="_button-style _fl text-center"
                      style={{ marginTop: "5%" }}
                    >
                      <a
                        href="javascript:void(0)"
                        className="white-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.closeStatusModal}
                      >
                        No
                      </a>
                      <a
                        href="javascript:void(0)"
                        className="blue-btn"
                        style={{ textDecoration: "none", color: "#fff" }}
                        onClick={this.onModalStatusChange}
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
        {/* //.................... For availability Modal................... */}
        <div id="viewModal" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <ul className="nav nav-tabs nav-pills nav-fill">
                <li
                  className="nav-item"
                // onClick={() => this.onTabClick_Invoice_vendor(1)}
                >
                  {" "}
                  <a
                    className="nav-link active"
                    data-toggle="tab"
                    href="#home_5"
                  >
                    Availability
                  </a>{" "}
                </li>
                <li
                  className="nav-item"
                // onClick={() => this.onTabClick_Invoice_vendor(2)}
                >
                  {" "}
                  <a className="nav-link" data-toggle="tab" href="#menu12_5">
                    Vacation
                  </a>{" "}
                </li>
              </ul>
              <div className="tab-content">
                <div className="tab-pane  active" id="home_5">
                  <div className="filter-head _fl document-hd">
                    <h3 className="text-center center-text">
                      Interpreter Availability
                    </h3>
                    {/* <button
                      type="button"
                      className="close"
                      onClick={() => this.closeAvailabilityViewModal()}
                    >
                      X
                    </button> */}
                  </div>
                  <div className="modal-body">
                    <div className="table-listing-app card">
                      <div className="table-responsive">
                        {Object.keys(this.state.availabileData).length > 0 ? (
                          <BidModal value={this.state.availabileData} />
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}
                      </div>
                    </div>

                    <div className="_button-style _fl text-center">
                      {/* <a className="grey-btn" onClick={() => this.closeModal()}>cancel</a> */}
                      {/* <a className="blue-btn">save</a> */}
                      {/* <a href="#" className="buledark-btn">save & reverse</a> */}
                    </div>
                  </div>
                </div>

                {/* .................vacation.......... */}
                <div className="tab-pane  fade" id="menu12_5">
                  <div className="filter-head _fl document-hd">
                    <h3 className="text-center center-text">
                      Vacation Summary
                    </h3>
                    {/* <button
                      type="button"
                      className="close"
                      onClick={() => this.closeAvailabilityViewModal()}
                    >
                      X
                    </button> */}
                  </div>
                  <div className="modal-body">
                    <div className="table-listing-app card">
                      <div className="table-responsive">
                        {this.state.vacationList.length > 0 ? (
                          <React.Fragment>
                            {this.state.vacationList.map((item, key) => (
                              <div class="">
                                <div class="card notify_card">
                                  <div
                                    className=""
                                    type="button"
                                    style={{
                                      borderRadius: "20px",
                                      padding: "20px 0px",
                                      backgroundColor: "white",
                                    }}
                                  >
                                    <div>
                                      <div className="row notify">
                                        <div className="col-md-2">
                                          {
                                            <img
                                              className=""
                                              src={
                                                ImageName.IMAGE_NAME
                                                  .CALANDER_WITH_AEROPLANE
                                              }
                                              style={{
                                                width: "40px",
                                                marginLeft: "30px",
                                              }}
                                            ></img>
                                          }
                                        </div>
                                        <div className="col-md-4">
                                          <div className="job_details">
                                            <span>FROM</span> {SetDateFormat(item.formDate)}
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="job_details">
                                            <span>TO</span> {SetDateFormat(item.toDate)}

                                          </div>
                                        </div>
                                        {/* <div className="col-md-2">
                                    <img
                                      src={ImageName.IMAGE_NAME.EDIT_SQUARE}
                                      style={{ cursor: "pointer" }}
                                      id="basic-button"
                                      className="serv-cat-edit-btn"
                                      onClick={() => this.editPage(key)}
                                    />
                                    <img
                                      src={ImageName.IMAGE_NAME.TRASH_BTN}
                                      style={{
                                        cursor: "pointer",
                                        marginLeft: "10px",
                                      }}
                                      id="basic-button"
                                      className="serv-cat-del-btn"
                                        onClick={() => this.deletePage(item,key)}
                                    />
                                  </div> */}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                <td colSpan="7">
                                  <center style={{ fontSize: "20px" }}>
                                    No data found !!!
                                  </center>
                                </td>
                              </tr>
                            </table>
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ..................Reset Password modal................................. */}
        <div
          id="password-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
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
                  <div className="row" style={{ marginTop: "20px" }}>
                    <center>
                      <div className="col-md-6">
                        <input

                          className="inputfield"
                          value={this.state.resetPasswordData}
                          onChange={(e) =>
                            this.onResetPassChange(e)
                          }
                        />
                      </div>
                    </center>
                  </div>
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
                        onClick={this.onResetPassword}
                      >
                        Yes
                      </a>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Modal
          open={this.state.openModal}
          onClose={this.closeViewModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="projectBtn">
              <span
                href="javascript:void(0)"
                className="sky_dash_btn projectModalBtn"
                onClick={() => this.openAvailabilityModal()}
              >
                AVAILABILITY
              </span>
              <span
                href="javascript:void(0)"
                className="yellow_dash_btn projectModalBtn"
                onClick={() => this.openVacation()}
              >
                VACATION
              </span>
            </div>
          </Box>
        </Modal> */}


        <div
          className="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}

class BidModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
          {this.props.value.Sunday.length > 0 || this.props.value.Monday.length > 0 ||
            this.props.value.Tuesday.length > 0 || this.props.value.Wednesday.length > 0 ||
            this.props.value.Thursday.length > 0 || this.props.value.Friday.length > 0 ||
            this.props.value.Saturday.length > 0 ? <>
            <tr>
              <th style={{ width: "14%" }}>Sunday</th>
              <th style={{ width: "14%" }}>Monday</th>
              <th style={{ width: "14%" }}>Tuesday</th>
              <th style={{ width: "14%" }}>Wednesday</th>
              <th style={{ width: "14%" }}>Thursday</th>
              <th style={{ width: "14%" }}>Friday</th>
              <th style={{ width: "14%" }}>Saturday</th>
            </tr>
            <tr>
              <td
                style={{
                  justifyContent: "center",
                }}
              >
                {this.props.value.Sunday.map((obj) => (
                  <React.Fragment>
                    <div>
                      {obj.serviceName.split(",").map((item) => (
                        <div className="f2f_rate">{item}</div>
                      ))}
                      <div
                        style={{
                          marginLeft: "5px",
                          marginTop: "8px",
                        }}
                      >
                        {obj.startTime} - {obj.endTime}
                      </div>
                    </div>
                    <br />
                  </React.Fragment>
                ))}
              </td>
              {/* .............monday................. */}
              <td
                style={{
                  justifyContent: "center",
                }}
              >
                {this.props.value.Monday.map((obj) => (
                  <React.Fragment>
                    <div>
                      {obj.serviceName.split(",").map((item) => (
                        <div className="f2f_rate">{item}</div>
                      ))}
                      <div
                        style={{
                          marginLeft: "5px",
                          marginTop: "8px",
                        }}
                      >
                        {obj.startTime} - {obj.endTime}
                      </div>
                    </div>
                    <br />
                  </React.Fragment>
                ))}
              </td>
              {/* ..............Tuesday................ */}
              <td
                style={{
                  justifyContent: "center",
                }}
              >
                {this.props.value.Tuesday.map((obj) => (
                  <React.Fragment>
                    <div>
                      {obj.serviceName.split(",").map((item) => (
                        <div className="f2f_rate">{item}</div>
                      ))}
                      <div
                        style={{
                          marginLeft: "5px",
                          marginTop: "8px",
                        }}
                      >
                        {obj.startTime} - {obj.endTime}
                      </div>
                    </div>
                    <br />
                  </React.Fragment>
                ))}
              </td>
              {/* ..........wednesday............... */}
              <td
                style={{
                  justifyContent: "center",
                }}
              >
                {this.props.value.Wednesday.map((obj) => (
                  <React.Fragment>
                    <div>
                      {obj.serviceName.split(",").map((item) => (
                        <div className="f2f_rate">{item}</div>
                      ))}
                      <div
                        style={{
                          marginLeft: "5px",
                          marginTop: "8px",
                        }}
                      >
                        {obj.startTime} - {obj.endTime}
                      </div>
                    </div>
                    <br />
                  </React.Fragment>
                ))}
              </td>
              {/* ................thursday............... */}
              <td
                style={{
                  justifyContent: "center",
                }}
              >
                {this.props.value.Thursday.map((obj) => (
                  <React.Fragment>
                    <div>
                      {obj.serviceName.split(",").map((item) => (
                        <div className="f2f_rate">{item}</div>
                      ))}
                      <div
                        style={{
                          marginLeft: "5px",
                          marginTop: "8px",
                        }}
                      >
                        {obj.startTime} - {obj.endTime}
                      </div>
                    </div>
                    <br />
                  </React.Fragment>
                ))}
              </td>
              {/* ............friday.................... */}
              <td
                style={{
                  justifyContent: "center",
                }}
              >
                {this.props.value.Friday.map((obj) => (
                  <React.Fragment>
                    <div>
                      {obj.serviceName.split(",").map((item) => (
                        <div className="f2f_rate">{item}</div>
                      ))}
                      <div
                        style={{
                          marginLeft: "5px",
                          marginTop: "8px",
                        }}
                      >
                        {obj.startTime} - {obj.endTime}
                      </div>
                    </div>
                    <br />
                  </React.Fragment>
                ))}
              </td>
              {/* ................saturday.......... */}
              <td
                style={{
                  justifyContent: "center",
                }}
              >
                {this.props.value.Saturday.map((obj) => (
                  <React.Fragment>
                    <div>
                      {obj.serviceName.split(",").map((item) => (
                        <div className="f2f_rate">{item}</div>
                      ))}
                      <div
                        style={{
                          marginLeft: "5px",
                          marginTop: "8px",
                        }}
                      >
                        {obj.startTime} - {obj.endTime}
                      </div>
                    </div>
                    <br />
                  </React.Fragment>
                ))}
              </td>
            </tr>
          </> : <tr>
            <td colSpan="7">
              <center style={{ fontSize: "20px" }}>
                No data found !!!
              </center>
            </td>
          </tr>
          }
        </table>
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
