import React, { Component } from "react";
import { styled, Box } from "@mui/system"; //imported for modal
import FormControl from "@mui/material/FormControl";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import history from "../../../../history";
import Stack from "@mui/material/Stack";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";
import "./ClientList.css";

import { AlertMessage, ImageName } from "../../../../enums";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../../SharedComponents/inputText";
import { ApiCall } from "../../../../services/middleware";
import { CryptoDecoder, Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";
import {
  consoleLog,
  getLookUpDataFromAPI,
  SetDatabaseDateFormat,
  SetDateFormat,
  SetScheduleDate,
  SetTimeFormat,
  SetUSAdateFormat,
  textTruncate,
} from "../../../../services/common-function";
import { zipValidate,passwordValidator } from "../../../../validators";
import { Regex } from "../../../../services/config";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import $ from "jquery";
import { passWordRandomGenerate } from "./function";

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

export default class ClientList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      current_page: 1,
      total_page: 10,
      limit: 20,
      offset:0,
      display: "",
      name: "",
      email: "",
      mobile: "",
      switch: false,
      anchorEl: null, //menu button
      anchorEl1: null, //menu button
      openModal: false, // open decline modal false
      // listData: [],
      curIndex: 0,
      formDate: "",
      toDate: "",
    
      filterStatus: "",

      listData: [],
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      selectedIndustryType: {},
      allIndustryTypeArr: [],
      selectedStatus:{},
      resetPasswordData: "",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    document.getElementById("backdrop").style.display = "none";
  
    
    var classInstance = this;
    
    var filterModal = document.getElementById("filter-model");
    var passwordModal = document.getElementById("password-model");
    // When the user clicks anywhere outside of the modal, close it

    window.addEventListener("click", function(event) {
      if (event.target == filterModal) {
        classInstance.closeModal();
      } else if (event.target == passwordModal){
        classInstance.closeResetModal();
      }
    });
    // window.onclick = function (event) {
    //   if (event.target == filterModal) {
    //     classInstance.closeModal();
    //   } else if (event.target == passwordModal){
    //     classInstance.closeResetModal();
    //   }
    // };
    this.load();
  }

  load = async () => {
    let allLookupValue = [],
      allJobType = [];
    let data = {
      clientname: "",
      direc: "",
      orderby: "",
      businessemail: "",
      businessmobile: "",
      searchto: "",
      searchfrom: "",
      industryid: "",
      status:"",
      limit: JSON.stringify(this.state.limit),
      // offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      offset:"0"
    };
    this.listApi(data);

    allLookupValue = await getLookUpDataFromAPI();

    allLookupValue.INDUSTRY_TYPE.map((data) => {
      allJobType.push({
        label: data.name,
        value: data.id,
        imagePath: data.others,
      });
    });

    this.setState({
      allIndustryTypeArr: allJobType,
    });
  };

  listApi = async (data) => {
    consoleLog("reqData::", data);
    const res = await ApiCall("fetchclientlist", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      consoleLog("listdata:payload::", decodeData);
      let listDetails = [];
      if (decodeData.data.clientDetailsList.length > 0) {
        listDetails = decodeData.data.clientDetailsList;

        consoleLog("listdata:::", decodeData.data);
      } else {
        listDetails = [];
      }
      let totalPage = Math.ceil(decodeData.data.totalCount / this.state.limit);
      this.setState({
        listData: listDetails,
        total_page: totalPage,
      });
    }
  };

  //..... for search name......

  onNameChange = (value) => {
    this.setState({
      name: value,
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      clientname: value,
      businessemail: this.state.email,
      businessmobile: this.state.mobile,
      orderby: "",
      direc: "",
      searchto:
      this.state.toDate == "" ||
      this.state.toDate == null ||
      this.state.toDate == undefined
        ? ""
        : SetDatabaseDateFormat(this.state.toDate),
    searchfrom:
      this.state.formDate == "" ||
      this.state.formDate == null ||
      this.state.formDate == undefined
        ? ""
        : SetDatabaseDateFormat(this.state.formDate),
    industryid:
      this.state.selectedIndustryType.value == null ||
      this.state.selectedIndustryType.value == undefined
        ? ""
        : this.state.selectedIndustryType.value,
      type: "",
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
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
      clientname: this.state.name,
      businessemail: value,
      businessmobile: this.state.mobile,
      orderby: "",
      direc: "",
      searchto:
      this.state.toDate == "" ||
      this.state.toDate == null ||
      this.state.toDate == undefined
        ? ""
        : SetDatabaseDateFormat(this.state.toDate),
    searchfrom:
      this.state.formDate == "" ||
      this.state.formDate == null ||
      this.state.formDate == undefined
        ? ""
        : SetDatabaseDateFormat(this.state.formDate),
    industryid:
      this.state.selectedIndustryType.value == null ||
      this.state.selectedIndustryType.value == undefined
        ? ""
        : this.state.selectedIndustryType.value,
      type: "",
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
    };

    this.listApi(data);
  };
  onMobileChange = (value) => {
    let val = zipValidate(value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        mobile: val,
      });
      let data = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify(
          (this.state.current_page - 1) * this.state.limit
        ),

        clientname: this.state.name,
      businessemail: this.state.email,
      businessmobile: val,
      orderby: "",
      direc: "",
      searchto:
      this.state.toDate == "" ||
      this.state.toDate == null ||
      this.state.toDate == undefined
        ? ""
        : SetDatabaseDateFormat(this.state.toDate),
    searchfrom:
      this.state.formDate == "" ||
      this.state.formDate == null ||
      this.state.formDate == undefined
        ? ""
        : SetDatabaseDateFormat(this.state.formDate),
    industryid:
      this.state.selectedIndustryType.value == null ||
      this.state.selectedIndustryType.value == undefined
        ? ""
        : this.state.selectedIndustryType.value,
      type: "",
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
      };

      this.listApi(data);
    }
  };

  onDisplayChange = (e) => {
    this.setState({
      display: e.target.value,
    });
  };

  //..............function for MenuButton close..............
  handleMenuClose = () => {
    this.setState({
      check: false,
      anchorEl: null,
      anchorEl1: null,
    });
  };

  // ....................Searching.............................
  handleCourseChange = (value) => {
    this.setState({
      courseName: value,
    });

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: value,
    };

    this.listApi(data);
  };

  //   ..........add new button.......................
  addNew = () => {
    return history.push("/adminClientAdd");
  };

  //................funct for menuBtn on click................
  menuBtnhandleClick = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl: event.currentTarget,
    });
  };

  menuBtnhandleClick_b = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl1: event.currentTarget,
    });
  };
  editPage = () => {
    this.props.history.push({
      pathname: "/adminClientEdit",
      state: this.state.listData[this.state.curIndex],
    });
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
      clientname: this.state.name,
      businessemail: this.state.email,
      businessmobile: this.state.mobile,
      orderby: "",
      direc: "",
      searchto:
      this.state.toDate == "" ||
      this.state.toDate == null ||
      this.state.toDate == undefined
        ? ""
        : SetDatabaseDateFormat(this.state.toDate),
    searchfrom:
      this.state.formDate == "" ||
      this.state.formDate == null ||
      this.state.formDate == undefined
        ? ""
        : SetDatabaseDateFormat(this.state.formDate),
    industryid:
      this.state.selectedIndustryType.value == null ||
      this.state.selectedIndustryType.value == undefined
        ? ""
        : this.state.selectedIndustryType.value,
      type: "",
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
    };
    this.listApi(data);
  };

  // This is goes to the last page
  exRigth = () => {
    let totalPage = this.state.total_page;
    this.setState({
      current_page: totalPage,
    });

    let data = {
      clientname: this.state.name,
      businessemail: this.state.email,
      businessmobile: this.state.mobile,
      orderby: "",
      direc: "",
      searchto:
      this.state.toDate == "" ||
      this.state.toDate == null ||
      this.state.toDate == undefined
        ? ""
        : SetDatabaseDateFormat(this.state.toDate),
    searchfrom:
      this.state.formDate == "" ||
      this.state.formDate == null ||
      this.state.formDate == undefined
        ? ""
        : SetDatabaseDateFormat(this.state.formDate),
    industryid:
      this.state.selectedIndustryType.value == null ||
      this.state.selectedIndustryType.value == undefined
        ? ""
        : this.state.selectedIndustryType.value,
      type: "",
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     

      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit),
    };
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
        clientname: this.state.name,
        businessemail: this.state.email,
        businessmobile: this.state.mobile,
        orderby: "",
        direc: "",
        searchto:
        this.state.toDate == "" ||
        this.state.toDate == null ||
        this.state.toDate == undefined
          ? ""
          : SetDatabaseDateFormat(this.state.toDate),
      searchfrom:
        this.state.formDate == "" ||
        this.state.formDate == null ||
        this.state.formDate == undefined
          ? ""
          : SetDatabaseDateFormat(this.state.formDate),
      industryid:
        this.state.selectedIndustryType.value == null ||
        this.state.selectedIndustryType.value == undefined
          ? ""
          : this.state.selectedIndustryType.value,
        type: "",
        status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
      };
      this.listApi(data);
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
        clientname: this.state.name,
        businessemail: this.state.email,
        businessmobile: this.state.mobile,
        orderby: "",
        direc: "",
        searchto:
        this.state.toDate == "" ||
        this.state.toDate == null ||
        this.state.toDate == undefined
          ? ""
          : SetDatabaseDateFormat(this.state.toDate),
      searchfrom:
        this.state.formDate == "" ||
        this.state.formDate == null ||
        this.state.formDate == undefined
          ? ""
          : SetDatabaseDateFormat(this.state.formDate),
      industryid:
        this.state.selectedIndustryType.value == null ||
        this.state.selectedIndustryType.value == undefined
          ? ""
          : this.state.selectedIndustryType.value,
        type: "",
        status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
      };
      this.listApi(data);
    }
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
    arrData[index].status = stat;
    this.setState({
      listData: arrData,
    });

    let data = {
      clientid: arrData[index].userId,
      status: stat.toString(),
    };

    let status = await ApiCall("modifyclientstatus", data);

    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(status.data.payload);

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
      direc: "ASC",
    };

    this.listApi(req);
  };

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

      orderby: filter,
      direc: "DESC",
    };

    this.listApi(req);
  };

  //........Page show Limit.........

  onChangeLimit = (value) => {
    this.setState({
      limit: parseInt(value.value),
      selectedDisplayData: value,
      current_page:1
    });

    let data = {
      limit: value.value,
      // offset: JSON.stringify(
      //   (this.state.current_page - 1) * parseInt(value.value)
      // ),
      offset:"0",
     
      clientname: this.state.name,
      direc: "",
      orderby: "",
      businessemail: this.state.email,
      businessmobile: this.state.mobile,
      searchto:
      this.state.toDate == "" ||
      this.state.toDate == null ||
      this.state.toDate == undefined
        ? ""
        : SetDatabaseDateFormat(this.state.toDate),
    searchfrom:
      this.state.formDate == "" ||
      this.state.formDate == null ||
      this.state.formDate == undefined
        ? ""
        : SetDatabaseDateFormat(this.state.formDate),
    industryid:
      this.state.selectedIndustryType.value == null ||
      this.state.selectedIndustryType.value == undefined
        ? ""
        : this.state.selectedIndustryType.value,
        status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
    };

    this.listApi(data);
  };

  // .............filter modal function...................

  onFilterRoleChange = (e) => {
    this.setState({
      filterRole: e.target.value,
    });
  };

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
  industryTypeChange = (val) => {
    this.setState({
      selectedIndustryType: val,
    });
  };
  statusTypeChange = (val) => {
    this.setState({
      selectedStatus:val
    })
  }


  // .............filter modal function...................
  openModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("filter-model").style.display = "block";
    document.getElementById("filter-model").classList.add("show");
  };

  closeModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("filter-model").style.display = "none";
    document.getElementById("filter-model").classList.remove("show");
    this.resetData();
    
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

  filterModal = () => {
    this.openModal();
    this.handleMenuClose();
  };

  onFilterApply = () => {
    let errorCount = 0;
    if(this.state.formDate > this.state.toDate){
      toast.error(AlertMessage.MESSAGE.DATE.TO_LESS_FROM,{
        hideProgressBar:true
      });
      errorCount++;
    }

    if(errorCount === 0){
      let data = {
        limit: JSON.stringify(this.state.limit),
        offset: "0",
        direc: "",
        orderby: "",
        clientname: this.state.name,
        businessemail: this.state.email,
        businessmobile: this.state.mobile,
        searchto:
          this.state.toDate == "" ||
          this.state.toDate == null ||
          this.state.toDate == undefined
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        searchfrom:
          this.state.formDate == "" ||
          this.state.formDate == null ||
          this.state.formDate == undefined
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        industryid:
          this.state.selectedIndustryType.value == null ||
          this.state.selectedIndustryType.value == undefined
            ? ""
            : this.state.selectedIndustryType.value,
            status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
       
      };
  
      this.closeModal();
      this.listApi(data)
    }

    ;

    // this.setState({
    //   formDate: "",
    //   toDate: "",
    // });
  };

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: "",
      selectedStatus:{},
      selectedIndustryType:{},
      current_page:1
    });
    this.closeModal();
    this.load();
  };
  resetData = () => {
    this.setState({
      formDate: "",
      toDate: "",
      selectedStatus:{},
      selectedIndustryType:{},
    })
  }

  goEdit = () => {
    this.props.history.push({
      pathname: "/adminClientEdit",
      state: this.state.listData[this.state.curIndex],
    });
  };

  openJob = () => {
    this.props.history.push({
      pathname: "/adminJobDetailsOfClient",
      state: this.state.listData[this.state.curIndex],
    });
  };

  openProject = () => {
    this.props.history.push({
      pathname: "/adminProjectDetailsOfClient",
      state: this.state.listData[this.state.curIndex],
    });
  };

  goRateCard = () => {
    this.props.history.push({
      pathname: "/adminClientRateCard",
      state: this.state.listData[this.state.curIndex],
    });
  };
  openInvoice = () => {
    this.props.history.push({
      pathname: "adminClientInvoiceList",
      state:this.state.listData[this.state.curIndex]
    })
  }

  
  cancelDelete = () => {
    // window.$("#status-model").modal("hide");
    this.closeResetModal();
  };

  handleReset = () => {
    let mainPass = passWordRandomGenerate();
    consoleLog(mainPass)
    this.setState({
      resetPasswordData:mainPass
    })
    this.handleMenuClose();
    this.openResetModal();
  };

  onResetPassChange = (e) => {
    this.setState({
      resetPasswordData: e.target.value,
    });
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

    if(errorCount === 0) {
      
      let data = {
        staffid: this.state.listData[this.state.curIndex].userId,
        password: this.state.resetPasswordData,
      };
      consoleLog("")
  
      let status = await ApiCall("userpasswordreset", data);
      if (
        status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        this.closeResetModal();
        toast.success(AlertMessage.MESSAGE.PASSWORD.RESET_SUCCESS);
      } else {
        toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR)
      }
    }
   
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    const open1 = Boolean(this.state.anchorEl1);
    return (
      <React.Fragment>
        {/* <div className="wrapper">
        <Header /> */}
        <ToastContainer hideProgressBar theme="colored" />
        {/* <Sidebar /> */}
        <div className="component-wrapper">
          <div className="listing-component-app">
            <div
              className="vn_frm"
              style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
            >
              {" "}
              <Link to="/adminDashboard">Dashboard</Link> / Clients
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
                        Client
                      </span>
                      <InputText
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.name}
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
                      <span
                        style={{
                          width: "30%",
                          paddingLeft: "10px",
                          fontSize: "14px",
                        }}
                      >
                        Phone
                      </span>
                      <InputText
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.mobile}
                        onTextChange={(value) => {
                          this.onMobileChange(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-filter-app-b">
              <div className="filter-btn">
                <a href="javascript:void(0)" onClick={this.filterModal}>
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
              <div className="table-filter-box">
                <div className="export-btn">
                  {/* <a href="#">
                  Export{" "}
                  <img
                    src={ImageName.IMAGE_NAME.EXPORT_BTN}
                    style={{ width: "25px", cursor: 'pointer' }}
                    onClick={this.handleExport} />
                </a> */}
                </div>
                <div className="addnew" onClick={this.addNew}>
                  <a href="javascript:void(0)">
                    Add New{" "}
                    <img
                      className=""
                      src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                      style={{ width: "25px", cursor: "pointer" }}
                    />
                  </a>
                </div>
                <div className="tble-short">
                  <span className="lbl">Display</span>
                  {/* <select
                      className="myDropdown frm4-select"
                      onChange={this.onChangeLimit}
                    ></select> */}
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
            <div className="table-listing-app">
              <div className="table-responsive">
                <table width="100%" border="0" cellPadding="0" cellSpacing="0">
                  <tr>
                    <th style={{ width: "10%" }}>
                      {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("department")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("department")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      Client
                    </th>
                    <th style={{ width: "15%" }}>
                      {/* <div class="sorting_btn">
                        <button class="t1" onClick={() => this.ascOrder("subDepartment")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button class="t1" onClick={() => this.descOrder("subDepartment")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      Industry Type
                    </th>
                    <th style={{ width: "15%" }}>
                      {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("location")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("location")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      Business Email
                    </th>

                    <th style={{ width: "15%" }}>
                      {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("client")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("client")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      Business Phone
                    </th>
                    {/* <th style={{ width: "10%" }}>
                      <div class="sorting_btn">
                        <button class="t1" onClick={() => this.ascOrder("totalusers")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button class="t1" onClick={() => this.descOrder("totalusers")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div>
                      No. of Users
                    </th> */}
                    <th style={{ width: "10%" }}>
                      {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("supervisor")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("supervisor")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      No. of Jobs
                    </th>
                    <th style={{ width: "10%" }}>No. of Contacts</th>
                    <th style={{ width: "10%" }}>Last Modified</th>
                    <th style={{ width: "10%" }}>Status</th>
                    <th style={{ width: "5%" }}>Action</th>
                  </tr>
                  {this.state.listData.length > 0 ? (
                    <React.Fragment>
                      {this.state.listData.map((item, key) => (
                        <tr key={key}>
                          <td colSpan="10">
                            <div className="tble-row">
                              <table
                                width="100%"
                                border="0"
                                cellPadding="0"
                                cellSpacing="0"
                              >
                                <tr>
                                  <td style={{ width: "10%" }}>
                                    {item.clientName}
                                  </td>
                                  <td style={{ width: "15%" }}>
                                    {item.industryType}
                                  </td>
                                  {item.businessemail.length > 20 ? (
                                    <td
                                      style={{ width: "15%" }}
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title={item.businessemail}
                                    >
                                      {textTruncate(item.businessemail, 20)}
                                    </td>
                                  ) : (
                                    <td style={{ width: "15%" }}>
                                      {textTruncate(item.businessemail, 20)}
                                    </td>
                                  )}
                                  {/* <td style={{ width: "15%" }}>
                                {item.businessemail}
                              </td> */}

                                  <td style={{ width: "15%" }}>
                                    {item.businessPhone}
                                  </td>

                                  <td style={{ width: "10%" }}>
                                    {/* {item.noOfJobs} */}0
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    {item.noOfContacts}
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    {SetDateFormat(item.lastUpdated)}{" "}
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
                                        {" "}
                                        {item.status === 1
                                          ? "ACTIVE"
                                          : "INACTIVE"}
                                      </FormHelperText>
                                    </FormControl>
                                  </td>

                                  <td style={{ width: "5%" }}>
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
                                        Edit
                                      </MenuItem>
                                      <MenuItem onClick={this.handleReset}>
                                        Reset Password
                                      </MenuItem>

                                      <MenuItem onClick={() => this.openJob()}>
                                        View Jobs
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => this.openProject()}
                                      >
                                        View Projects
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => this.goRateCard()}
                                      >
                                        View Rate Card
                                      </MenuItem>
                                      <MenuItem onClick={() => this.openInvoice()}>Invoices</MenuItem>
                                      {/* <MenuItem
                                    onClick={() => this.onStatusModal()}
                                  >
                                    De-Activate or Activate
                                  </MenuItem> */}
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
            <div className="table-filter-app-b" style={{ paddingTop: "2%" }}>
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
              <div className="table-filter-box">
                <div className="export-btn">
                  {/* <a href="#">
                  Export{" "}
                  <img
                    src={ImageName.IMAGE_NAME.EXPORT_BTN}
                    style={{ width: "25px", cursor: 'pointer' }}
                    onClick={this.handleExport} />
                </a> */}
                </div>

                <div className="tble-short">
                  <span className="lbl">Display</span>
                  {/* <select
                      className="myDropdown frm4-select"
                      onChange={this.onChangeLimit}
                    ></select> */}
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
        <div id="filter-model" className="modal fade modelwindow" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="filter-head _fl mdf">
                <h3>Filter by</h3>
                <div className="reset-btn-dp">
                  <button className="reset" data-dismiss="modal">
                    <img
                      src={ImageName.IMAGE_NAME.RESET_BTN}
                      onClick={this.onResetFilter}
                    />
                    Reset
                  </button>
                  <button className="apply" data-dismiss="modal">
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
                    <div className="lable-text">Last Modified</div>
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
                      {/* <input
                        type="date"
                        className="datefield bd"
                        placeholder="10/25/2021"
                        value={this.state.formDate}
                        onChange={this.formDateChange}
                      /> */}
                    </div>
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
                              // minDate={new Date(this.state.formDate)}
                              onChange={(date) => this.toDateChange(date)}
                              customInput={<Schedule />}
                            />
                          </a>
                        </div>
                      </div>
                      {/* <input
                        type="date"
                        className="datefield bd"
                        placeholder="10/25/2021"
                        value={this.state.toDate}
                        onChange={this.toDateChange}
                      /> */}
                    </div>
                    <div class="m-select _fl">
                      <div className="row">
                        <div className="col-md-6">
                          <div class="sf-row">
                            <div
                              class="lable-text"
                              // style={{ paddingLeft: "10px", fontSize: "16px" }}
                            >
                              Industry Type
                            </div>
                            <div
                              class="dropdwn"
                              style={{ marginLeft: "120px" }}
                            >
                              <SelectBox
                                optionData={this.state.allIndustryTypeArr}
                                value={this.state.selectedIndustryType}
                                onSelectChange={(value) =>
                                  this.industryTypeChange(value)
                                }
                              ></SelectBox>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                        <div class="sf-row">
                  <div className="form_rbx">
                    {" "}
                    <span className="lable-text">Status</span>
                    <div className="dropdwn" style={{ cursor: "pointer" }}>
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
