import React, { Component } from "react";
import { styled, Box } from "@mui/system"; //imported for modal
import ModalUnstyled from "@mui/core/ModalUnstyled"; //imported forr modal
import FormControl from "@mui/material/FormControl";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import history from "../../../../history";
import Stack from "@mui/material/Stack";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import "./CourseList.css";

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
  SetDateFormat,
  SetScheduleDate,
  SetTimeFormat,
  SetUSAdateFormat,
} from "../../../../services/common-function";
import { timers } from "jquery";
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

export default class CourseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      current_page: 1,
      total_page: 10,
      limit: 20,
      display: "",
      courseName: "",
      switch: false,
      anchorEl: null, //menu button
      anchorEl1: null, //menu button
      openModal: false, // open decline modal false
      // listData: [],
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      curIndex: 0,
      formDate: "",
      toDate: "",
      filterTrainingCategory: "",
      filterStatus: "",
      publishStat: "",
      listData: [],
      selectedStatus:{},
      trainingArr:[],
      trainingData:{},
      courseFormatArr: [],
      courseFormatData: {},
    };
  }

  componentDidMount() {
    // window.$(".myDropdown").ddslick();
    window.scrollTo(0, 0);

    this.load();

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

  load = async () => {
    let data = {
   
      limit: JSON.stringify(this.state.limit),
      // offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      offset:"0",
      searchto:"",
      searchform:"",
      direc: "",
      orderby: "",
      name: "",
      format:"",
      serviceCategoryId:"",
      status:""
    };
    this.listApi(data);


    
    let trainingDataArr = [],
      courseFormatDataArr = [];
    let res = await ApiCall("getLookUpData", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      let lookUpData = payload.data.lookupdata;
      let courseFormatArr = lookUpData.COURSE_FORMAT_TYPE;
      let trainingCategoryArr = lookUpData.TRAINING_CATEGORY_TYPE;

      // consoleLog("training:::", courseFormatArr);
      trainingCategoryArr.map((obj) => {
        trainingDataArr.push({
          label: obj.name,
          value: obj.id,
        });
      });

      courseFormatArr.map((obj) => {
        courseFormatDataArr.push({
          label: obj.name,
          value: obj.id,
        });
      });

      this.setState({
        courseFormatArr: courseFormatDataArr,
        trainingArr: trainingDataArr,
     
      });
    }
  };

  listApi = async (data) => {

    consoleLog("req data:::",data)
    const res = await ApiCall("fetchTrainingCourseList", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      console.log("Payload data>>>", decodeData);
      let listDetails = decodeData.data.details;
      let totalPage = Math.ceil(decodeData.data.count / this.state.limit);
      // console.log("Total Page>>>", decodeData.data);
      if (listDetails && listDetails.length > 0) {
        this.setState({
          listData: decodeData.data.details,
          total_page: totalPage,
        });
      } else {
        this.setState({
          listData: [],
        });
      }
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
      direc: "",
      orderby: "",
      name: value,
      searchto:this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom:this.state.formDate == "" ? "": SetScheduleDate(this.state.formDate),
      format:this.state.courseFormatData.value == null ||this.state.courseFormatData.value == undefined ? "" : this.state.courseFormatData.value ,
      serviceCategoryId:this.state.trainingData.value == null || this.state.trainingData.value == undefined ? "" : this.state.trainingData.value,
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
    };

    this.listApi(data);
  };

  //   ..........add new button.......................
  addNew = () => {
    return history.push("/adminAddTrainingCourse");
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
      pathname: "/adminEditTrainingCourse",
      state: this.state.listData[this.state.curIndex],
    });
  };
  // ..................delete function........................
  deletePage = () => {
    window.$("#delete-modal").modal("show");
    this.openDeleteModal();
    // let listArrData = this.state.listData;
    // listArrData.splice(this.state.curIndex, 1);
    this.setState({
      // listData: listArrData,
      anchorEl: false,
      anchorEl1: false,
    });
  };
  onCancel = () => {
    // window.$("#delete-modal").modal("hide");
    this.closeDeleteModal();
  };

  deleteItem = async () => {
    let data = {
      id: this.state.listData[this.state.curIndex].id,
      status: 2,
    };
    // console.log(">>>>>>>>>>dataaaa::", JSON.stringify(data));
    let status = await ApiCall("changeStatusTrainingCourse", data);
    // console.log(">>>>>>>>>status:", status);

    // window.$("#delete-modal").modal("hide");
    this.closeDeleteModal();
    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.listApi();
      toast.success(AlertMessage.MESSAGE.DELETE.DELETED);
    }
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
      direc:"",
      orderby:"",
      name: this.state.courseName,
      searchto:this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom:this.state.formDate == "" ? "": SetScheduleDate(this.state.formDate),
      format:this.state.courseFormatData.value == null ||this.state.courseFormatData.value == undefined ? "" : this.state.courseFormatData.value ,
      serviceCategoryId:this.state.trainingData.value == null || this.state.trainingData.value == undefined ? "" : this.state.trainingData.value,
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
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit),
      direc:"",
      orderby:"",
      name: this.state.courseName,
      searchto:this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom:this.state.formDate == "" ? "": SetScheduleDate(this.state.formDate),
      format:this.state.courseFormatData.value == null ||this.state.courseFormatData.value == undefined ? "" : this.state.courseFormatData.value ,
      serviceCategoryId:this.state.trainingData.value == null || this.state.trainingData.value == undefined ? "" : this.state.trainingData.value,
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
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
        direc:"",
      orderby:"",
      name: this.state.courseName,
      searchto:this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom:this.state.formDate == "" ? "": SetScheduleDate(this.state.formDate),
      format:this.state.courseFormatData.value == null ||this.state.courseFormatData.value == undefined ? "" : this.state.courseFormatData.value ,
      serviceCategoryId:this.state.trainingData.value == null || this.state.trainingData.value == undefined ? "" : this.state.trainingData.value,
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
        direc:"",
        orderby:"",
        name: this.state.courseName,
        searchto:this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
        searchfrom:this.state.formDate == "" ? "": SetScheduleDate(this.state.formDate),
        format:this.state.courseFormatData.value == null ||this.state.courseFormatData.value == undefined ? "" : this.state.courseFormatData.value ,
        serviceCategoryId:this.state.trainingData.value == null || this.state.trainingData.value == undefined ? "" : this.state.trainingData.value,
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

    let data = {
      id: arrData[index].id,
      status: stat.toString(),
    };

    let status = await ApiCall("changeStatusTrainingCourse", data);

    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      if (arrData[index].status === 0) {
        stat = 1;
        arrData[index].status = 1;
      } else {
        stat = 0;
        arrData[index].status = 0;
      }
      // arrData[index].status = stat;
      this.setState({
        listData: arrData,
      });
      toast.success(AlertMessage.MESSAGE.UPDATE_STATUS.SUCCESS);
    }else {
      if (arrData[index].status === 0) {
    
    arrData[index].status = 0;
  } else {
   
     arrData[index].status = 1;
  }
  this.setState({
    listData:this.state.listData
  })
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

  onChangeLimit = (dat) => {
    let data = {
      limit: dat.value,
      offset: "0",
      direc:"",
      orderby:"",
      name: this.state.courseName,
      searchto:this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom:this.state.formDate == "" ? "": SetScheduleDate(this.state.formDate),
      format:this.state.courseFormatData.value == null ||this.state.courseFormatData.value == undefined ? "" : this.state.courseFormatData.value ,
      serviceCategoryId:this.state.trainingData.value == null || this.state.trainingData.value == undefined ? "" : this.state.trainingData.value,
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
    };

    this.listApi(data);
    this.setState({
      limit: dat.value,
      selectedDisplayData: dat,
    });
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
  onTrainingChange = (dat) => {
  
    this.setState({
      trainingData: dat,
    });
  };
  onFormatChange = (dat) => {
  
    this.setState({
      courseFormatData: dat,
    });
  };
  statusTypeChange = (val) => {
    this.setState({
      selectedStatus:val
    })
  }

  onFilterApply = () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      direc:"",
      orderby:"",
      name: this.state.courseName,
      searchto:this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom:this.state.formDate == "" ? "": SetScheduleDate(this.state.formDate),
      format:this.state.courseFormatData.value == null ||this.state.courseFormatData.value == undefined ? "" : this.state.courseFormatData.value ,
      serviceCategoryId:this.state.trainingData.value == null || this.state.trainingData.value == undefined ? "" : this.state.trainingData.value,
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
     
    };

    // window.$("#create-filter-model").modal("hide");
    // console.log("Filter data", data);
    this.closeFilterModal();

    this.listApi(data);

    this.setState({
     current_page:1
    });
  };

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: "",
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      current_page: 1,
      courseFormatData:{},
      trainingData:{},
      selectedStatus:{}
    });
    this.closeFilterModal();
    this.load();
  };
  onPublish = async () => {
    let objid = {
      id: this.state.listData[this.state.curIndex].id,
    };

    let res = await ApiCall("publishTrainingCourse", objid);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(
        AlertMessage.MESSAGE.TRAINING_COURSE.COURSE_PUBLISH_SUCCESS,
        {
          hideProgressBar: true,
        }
      );
      this.setState({
        anchorEl1: false,
        anchorEl: false,
      });


      this.load();
      // window.location.reload(false);
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
              <Link to="/adminDashboard">Dashboard</Link> / Training Course
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
                      <span style={{ width: "20%", fontSize: "14px" }}>
                        Course
                      </span>
                      <InputText
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.courseName}
                        onTextChange={(value) => {
                          this.handleCourseChange(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-filter-app-b">
              <div className="filter-btn">
                <a href={"javascript:void(0)"} onClick={this.openFilterModal}>
                  Filter
                </a>
              </div>
              <div className="filter-pagination">
                <button
                  className="prev_btn"
                  onClick={this.exLeft}
                  disabled={this.state.listData.length > 0 ? false : true}
                ></button>
                <button
                  className="prv_btn"
                  onClick={this.prev}
                  disabled={this.state.listData.length > 0 ? false : true}
                >
                  {"<"}
                </button>
                <span
                  className="num"
                  onChange={(e) => this.clickChange(e)}
                  id="spn-num"
                >
                  {this.state.current_page}
                </span>
                <button
                  className="nxt_btn"
                  onClick={this.next}
                  disabled={this.state.listData.length > 0 ? false : true}
                >
                  {">"}
                </button>
                <button
                  className="next_btn"
                  onClick={this.exRigth}
                  disabled={this.state.listData.length > 0 ? false : true}
                ></button>
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
                <div className="addnew"  onClick={this.addNew}>
                  <a href="javascript:void(0)">
                    Add New{" "}
                    <img
                      className=""
                      src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                      style={{ width: "25px", cursor: "pointer" }}
                     
                    />
                  </a>
                </div>
                <div className="tble-short" id="table-short-top">
                  <span className="lbl">Display</span>
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
                <table width="100%" border="0" cellPadding="0" cellSpacing="0">
                  <tr id="table-respons-tr">
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
                      Course
                    </th>
                    <th style={{ width: "20%" }}>
                      {/* <div class="sorting_btn">
                        <button class="t1" onClick={() => this.ascOrder("subDepartment")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button class="t1" onClick={() => this.descOrder("subDepartment")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      Training Category
                    </th>
                    <th style={{ width: "20%" }} id="for-text">
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
                      Format
                    </th>

                    <th style={{ width: "15%" }} id="tot-dur">
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
                      Total Duration
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
                      Course Fees $
                    </th>
                    <th style={{ width: "10%" }}>Create Date</th>
                    <th style={{ width: "10%" }}>Status</th>
                    <th style={{ width: "5%" }}>Action</th>
                  </tr>
                  {this.state.listData.length > 0 ? (
                    <React.Fragment>
                      {this.state.listData.map((item, key) => (
                        <tr key={key}>
                          <td colSpan="10">
                            <div className="tble-row" id="edit-main-cont">
                              <table
                                width="100%"
                                border="0"
                                cellPadding="0"
                                cellSpacing="0"
                              >
                                <tr>
                                  <td style={{ width: "10%" }}>{item.name}</td>
                                  <td style={{ width: "20%" }}>
                                    {item.serviceCategory}
                                  </td>
                                  <td style={{ width: "20%" }} id="wap">
                                    {item.formatType}
                                  </td>
                                  {/* <td style={{ width: "8%" }}>{item.clientId}</td> */}
                                  <td style={{ width: "15%" }}>
                                    {item.duration} {item.durationUnit}
                                  </td>
                                  {/* <td style={{ width: "10%" }}>{item.user}</td> */}
                                  <td style={{ width: "10%" }} id="fee-text">
                                    {item.fees}
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    {SetDateFormat(item.createDate)}
                                    <br />
                                    {SetTimeFormat(item.createDate)}
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    {item.pulishStatus === 0 ? (
                                      <React.Fragment>
                                        <FormControl
                                          component="fieldset"
                                          variant="standard"
                                          disabled
                                        >
                                          <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                          >
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
                                          </Stack>

                                          <FormHelperText
                                            style={{
                                              textAlign: "center",
                                              fontSize: "8px",
                                            }}
                                          >
                                            {" "}
                                            INACTIVE
                                            {/* {item.status === 1
                                          ? "ACTIVE"
                                          : "INACTIVE"} */}
                                          </FormHelperText>
                                        </FormControl>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
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
                                      </React.Fragment>
                                    )}
                                  </td>

                                  <td
                                    style={{ width: "5%" }}
                                    id="traning-cour-list-edit-btn"
                                  >
                                    {item.pulishStatus === 0 ? (
                                      <React.Fragment>
                                        <img
                                          // src="/assets_temp/images/edit.png"
                                          src={ImageName.IMAGE_NAME.EDIT_SQUARE}
                                          style={{ cursor: "pointer" }}
                                          id={"basic-button"+key}
                                          aria-controls={"basic-menu"+key}
                                          aria-haspopup="true"
                                          aria-expanded={
                                            open ? "true" : undefined
                                          }
                                          onClick={(e) =>
                                            this.menuBtnhandleClick(key, e)
                                          }
                                        />
                                        <StyledMenu
                                          id={"basic-menu"+key}
                                          anchorEl={this.state.anchorEl}
                                          open={open}
                                          onClose={this.handleMenuClose}
                                          MenuListProps={{
                                            "aria-labelledby": "basic-button"+key,
                                          }}
                                        >
                                          <MenuItem
                                            onClick={() => this.editPage(key)}
                                          >
                                            Edit
                                          </MenuItem>
                                          <MenuItem
                                            onClick={() => this.onPublish()}
                                          >
                                            Publish
                                          </MenuItem>
                                          <MenuItem
                                            onClick={() => this.deletePage(key)}
                                          >
                                            Delete
                                          </MenuItem>
                                        </StyledMenu>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        <img
                                          src={ImageName.IMAGE_NAME.EDIT_SQUARE}
                                          style={{ cursor: "pointer" }}
                                          id={"basic-button"+key}
                                          aria-controls={"basic-menu"+key}
                                          aria-haspopup="true"
                                          aria-expanded={
                                            open1 ? "true" : undefined
                                          }
                                          onClick={(e) =>
                                            this.menuBtnhandleClick_b(key, e)
                                          }
                                        />
                                        <StyledMenu
                                          id={"basic-menu"+key}
                                          anchorEl={this.state.anchorEl1}
                                          open={open1}
                                          onClose={this.handleMenuClose}
                                          MenuListProps={{
                                            "aria-labelledby": "basic-button"+key,
                                          }}
                                        >
                                          <MenuItem
                                            onClick={() => this.editPage(key)}
                                          >
                                            Edit
                                          </MenuItem>
                                          <MenuItem
                                            onClick={() => this.deletePage(key)}
                                          >
                                            Delete
                                          </MenuItem>
                                        </StyledMenu>
                                      </React.Fragment>
                                    )}
                                    {/* </Menu> */}
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
                <span
                  className="num"
                  onChange={(e) => this.clickChange(e)}
                  id="cours-list-spn-buttom-num"
                >
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

                <div className="tble-short" id="cours-list-tbl-short-cont">
                  <span className="lbl" id="cours-list-lbl-text">
                    Display
                  </span>
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
        <div id="filter-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg">
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
                    <div className="lable-text">requested on</div>
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
                              minDate={new Date(this.state.formDate)}
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
                  </div>
                  <div className="m-select _fl">
                    <div class="row">
                    <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Training Category</span>
                    <div className="dropdwn" style={{ cursor: "pointer" }}>
                      <SelectBox
                        optionData={this.state.trainingArr}
                        value={this.state.trainingData}
                        placeholder="Select"
                        onSelectChange={(value) => {
                          this.onTrainingChange(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-2"></div>
                <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Status</span>
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
                    <div className="m-select _fl">
                        <div className="row">
                        <div className="col-md-4">
                  <div className="form_rbx">
                    {" "}
                    <span className="">format *</span>
                    <div className="dropdwn" style={{ cursor: "pointer" }}>
                      <SelectBox
                        optionData={this.state.courseFormatArr}
                        value={this.state.courseFormatData}
                        placeholder="Select"
                        onSelectChange={(value) => {
                          this.onFormatChange(value);
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
          {/* ...........................delete modal.............................. */}
        </div>
        {/* ..............................delete modal............................. */}

        <div id="delete-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-md modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content" style={{ padding: "10px" }}>
              <div className="delete-head">Delete Course</div>
              <div className="modal-body">
                <div className="body-txt">Are You Sure?</div>

                <div className="_button-style m30 _fl text-center">
                  <a
                    className="white-btn"
                    style={{ textDecoration: "none", color: "grey" }}
                    onClick={this.onCancel}
                  >
                    NO
                  </a>
                  <a
                    className="blue-btn"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      width: "15%",
                    }}
                    data-dismiss="modal"
                    onClick={() => this.deleteItem()}
                  >
                    Yes
                  </a>
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