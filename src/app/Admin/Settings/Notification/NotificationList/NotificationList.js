import React, { Component } from "react";
import history from "../../../../../history";

import "./notificationList.css";
import { AlertMessage, ImageName } from "../../../../../enums";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../../../SharedComponents/inputText";
import { ApiCall } from "../../../../../services/middleware";
import { Decoder } from "../../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../../services/constant";
import {
  consoleLog,
  SetDateFormat,
  SetScheduleDate,
  SetTimeFormat,
  SetUSAdateFormat,
} from "../../../../../services/common-function";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";

const notificationTypeArr = [
  {
    label: "Email",
    value: "0",
  },
  {
    label: "Push",
    value: "1",
  },
];
const statusArr = [
  {
    label: "Schedule",
    value: "0",
  },
  {
    label: "Publish",
    value: "1",
  },
];

const reqData = {
  limit: "",
  offset: "",
  orderby: "",
  direc: "",
  searchto: "",
  searchfrom: "",
  status: "",
  userTypeId:"",
  notificationType: "",
  searchVal: "",
};

export default class NotificationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      current_page: 1,
      total_page: 10,
      limit: 20,
      display: "",
      notification: "",
      anchorEl: null, //menu button
      openModal: false, // open decline modal false
      // listData: [],
      curIndex: 0,
      workingId: 0,
      formDate: "",
      toDate: "",
      selectedDisplayData: {
        label: "20",
        value: "20",
      },

      listData: [],
      selectedNotificationType: {},
      selectedStatus: {},
    };
  }

  componentDidMount() {
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
    let resData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit), //starting index of page
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: "",
      status: "",
      userTypeId:"",
      notificationType: "",
      searchVal: "",
    };
    let curData = Object.assign(reqData, resData);

    // consoleLog("datataa:::", JSON.stringify(curData));

    this.listApi(curData);
  };

  listApi = async (data) => {
    const res = await ApiCall("getNotificationList", data);
    // consoleLog("res::::::", res);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      consoleLog("res::::::", decodeData.data);
      let totalPage = Math.ceil(
        decodeData.data.notificationCount / this.state.limit
      );
      let notificationData = decodeData.data.notificationList;
      if (notificationData.length > 0) {
        this.setState({
          listData: decodeData.data.notificationList,
          total_page: totalPage,
        });
      } else {
        this.setState({
          listData: [],
        });
      }
    } else {
      if (
        res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.INTERNAL_SERVER_ERROR
      ) {
        toast.error(res.message, {
          hideProgressBar: true,
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
    });
  };

  // ....................Searching.............................
  handleNotificationChange = (value) => {
    this.setState({
      notification: value,
    });

    let resData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit), //starting index of page
      searchVal: value,
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      userTypeId:"",
      notificationType:this.state.selectedNotificationType.value == null || this.state.selectedNotificationType.value == undefined ? "" : this.state.selectedNotificationType.value,
    };
    let curData = Object.assign(reqData, resData);

    this.listApi(curData);
  };

  //   ..........add new button.......................
  addNew = () => {
    return history.push("/adminAddNotification");
  };

  //................funct for menuBtn on click................
  menuBtnhandleClick = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl: event.currentTarget,
    });
  };

  editPage = (index) => {
    this.props.history.push({
      pathname: "/adminEditNotification",
      state: this.state.listData[index],
    });
  };

  deletePage = (index) => {
    this.setState({
      curIndex: index,
      workingId: this.state.listData[index].id,
    });
    // window.$("#delete-modal").modal("show");
    this.openDeleteModal();
  };
  deleteItem = async () => {
    // consoleLog("id:::", this.state.workingId);
    // window.$("#delete-modal").modal("hide");
    this.closeDeleteModal();
    let data = {
      notificationId: this.state.workingId,
    };
    let status = await ApiCall("deleteNotification", data);
    // consoleLog("status::", status);
    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.load();
      toast.success(status.data.message);
      window.scrollTo(0, 0);
    }
  };

  onCancel = () => {
    // window.$("#delete-modal").modal("hide");
    this.closeDeleteModal();
  };
  filterModal = () => {
    this.openModal();
  };

  openDeleteModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("delete-model").style.display = "block";
    document.getElementById("delete-model").classList.add("show");
  };
  // .............filter modal function...................
  openModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("filter-model").style.display = "block";
    document.getElementById("filter-model").classList.add("show");
  };

  closeFilterModal = () => {
    document.getElementById("filter-model").style.display = "none";
    document.getElementById("filter-model").classList.remove("show");
    document.getElementById("backdrop").style.display = "none";
  };

  closeDeleteModal = () => {
    document.getElementById("backdrop").style.display = "none";

    document.getElementById("delete-model").style.display = "none";
    document.getElementById("delete-model").classList.remove("show");
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

    let resData = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      userTypeId:"",
      notificationType:this.state.selectedNotificationType.value == null || this.state.selectedNotificationType.value == undefined ? "" : this.state.selectedNotificationType.value,
    searchVal:this.state.notification
    };
    let curData = Object.assign(reqData, resData);

    this.listApi(curData);
  };

  // This is goes to the last page
  exRigth = () => {
    let totalPage = this.state.total_page;
    this.setState({
      current_page: totalPage,
    });
    let resData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit),
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      userTypeId:"",
      notificationType:this.state.selectedNotificationType.value == null || this.state.selectedNotificationType.value == undefined ? "" : this.state.selectedNotificationType.value,
    searchVal:this.state.notification
    };
    let curData = Object.assign(reqData, resData);

    this.listApi(curData);
  };

  // This is goes to the first page
  prev = () => {
    let currentPage = this.state.current_page;
    if (currentPage > 1) {
      currentPage--;
      this.setState({
        current_page: currentPage,
      });
    }

    let resData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((currentPage - 1) * this.state.limit),
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      userTypeId:"",
      notificationType:this.state.selectedNotificationType.value == null || this.state.selectedNotificationType.value == undefined ? "" : this.state.selectedNotificationType.value,
    searchVal:this.state.notification
    };
    let curData = Object.assign(reqData, resData);

    this.listApi(curData);
  };

  // This is goes to the next page
  next = () => {
    // consoleLog("iiiiiiiiiiiiii");
    let currentPage = this.state.current_page;
    let totalPage = this.state.total_page;
    if (currentPage < totalPage) {
      currentPage++;
      this.setState({
        current_page: currentPage,
      });
    }

    let resData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((currentPage - 1) * this.state.limit),
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      userTypeId:"",
      notificationType:this.state.selectedNotificationType.value == null || this.state.selectedNotificationType.value == undefined ? "" : this.state.selectedNotificationType.value,
      searchVal:this.state.notification
    };
    let curData = Object.assign(reqData, resData);

    this.listApi(curData);
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
      id: arrData[index].id,
      status: stat.toString(),
    };
    let status = await ApiCall("changeStatusService", data);

    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.UPDATE_STATUS.SUCCESS);
    }
  };

  //......Ascending order .........

  ascOrder = (data) => {
    let filter = "";
    if (data === "serviceCategory") {
      filter = "name";
    } else if (data === "createdBy") {
      filter = "createdBy";
    } else if (data === "lastUpdated") {
      filter = "lastUpdated";
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
    if (data === "serviceCategory") {
      filter = "name";
    } else if (data === "createdBy") {
      filter = "createdBy";
    } else if (data === "lastUpdated") {
      filter = "lastUpdated";
    }

    let req = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      search: this.state.department,
      orderby: filter,
      direc: "DESC",
    };

    this.listApi(req);
  };

  //........Page show Limit.........

  onChangeLimit = (obj) => {
    this.setState({
      limit: parseInt(obj.value),
      selectedDisplayData: obj,
      current_page:1
    });

    let resData = {
      limit: parseInt(obj.value),
      offset: "0",
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      userTypeId:"",
      notificationType:this.state.selectedNotificationType.value == null || this.state.selectedNotificationType.value == undefined ? "" : this.state.selectedNotificationType.value,
    searchVal:this.state.notification
    };
    let curData = Object.assign(reqData, resData);

    this.listApi(curData);
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
  onNotificationTypeChange = (val) => {
    this.setState({
      selectedNotificationType: val,
    });
  };
  onFilterStatusChange = (val) => {
    this.setState({
      selectedStatus: val,
    });
  };

  onFilterApply = () => {
    let resData = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      notificationType:this.state.selectedNotificationType.value == null || this.state.selectedNotificationType.value == undefined ? "" : this.state.selectedNotificationType.value,
     searchVal:this.state.notification
    };
    let curData = Object.assign(reqData, resData);

    this.closeFilterModal();

    this.listApi(curData);

    this.setState({
     current_page:1
    });
  };

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: "",
      selectedStatus:{},
      selectedNotificationType:{},
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      current_page: 1,
      limit: 20,
    });
    this.closeFilterModal();
    let d = {
      limit: "20",
      offset: "0", //starting index of page
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: "",
      status: "",
      userTypeId: "",
      searchVal: "",
      notificationType:""
    };

    this.listApi(d);
  };


  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <React.Fragment>
        {/* <div className="wrapper">
        <Header /> */}
        <ToastContainer hideProgressBar  theme="colored"/>
        {/* <Sidebar /> */}
        <div className="component-wrapper">
          <div className="listing-component-app">
            <div
              className="vn_frm"
              style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
            >
              {" "}
              <Link to="/adminDashboard">Dashboard</Link> / Notification
            </div>
            <div
              id="vendor-info-cont"
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
                    <div className="vn_frm" style={{ width: "150%" }}>
                      <span style={{ width: "28%", fontSize: "14px" }}>
                        Notifications
                      </span>
                      <InputText
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.notification}
                        style={{ color: "#9f8f93" }}
                        onTextChange={(value) => {
                          this.handleNotificationChange(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="table-filter-app">
              <div class="row">
                <div class="col-md-6">
                  <div class="cus-filter-btn btns">
                    {" "}
                    {/* <button class="button_one">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN} />
                    </button>
                    <button class="button_two">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN_ONE} />
                    </button>
                    <button class="button_three">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN_TWO} />
                    </button> */}
                    <div
                      class="filter-btn"
                      style={{ float: "none", paddingLeft: "10px" }}
                    >
                      <a href={"javascript:void(0)"} onClick={this.filterModal}>
                        Filter
                      </a>
                    </div>
                    <div className="filter-pagination">
                      <button
                        className="prev_btn"
                        onClick={this.exLeft}
                      ></button>
                      <button className="prv_btn" onClick={this.prev}>
                        {" "}
                        {"<"}
                      </button>
                      <span
                        className="num"
                        onChange={(e) => this.clickChange(e)}
                      >
                        {this.state.current_page}
                      </span>
                      <button className="nxt_btn" onClick={this.next}>
                        {">"}
                      </button>
                      <button
                        className="next_btn"
                        onClick={this.exRigth}
                      ></button>
                    </div>
                    {/* <div class="tble-short">
                      {" "}
                      <span class="lbl">Job status</span>
                      <div class="dropdwn">
                        <Select
                        //   styles={customStyles}
                          options={jobStatusArr}
                          components={{
                            DropdownIndicator,
                            IndicatorSeparator: () => null,
                          }}
                          value={this.state.jobStatusData}
                          placeholder="Select"
                          onChange={(value) => {
                            this.onJobStatusChange(value);
                          }}
                        />
                      
                      </div>
                    </div> */}
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="table-filter-box">
                    {/* <div class="export-btn">
                      <a href="#">
                        Export
                        <img
                          src={ImageName.IMAGE_NAME.EXPORT_BTN}
                          style={{ width: "25px", cursor: "pointer" }}
                          onClick={this.onExport}
                        />
                      </a>
                    </div> */}
                    <div class="addnew" onClick={this.addNew}>
                      <a href={"javascript:void(0)"}>
                        {/* <a href={void 0}> */}
                        Add New Notification{" "}
                        <img
                          className=""
                          src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                          style={{ width: "25px", cursor: "pointer" }}
                        />
                      </a>
                    </div>
                    <div class="tble-short">
                      {" "}
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
              </div>
            </div>
            <div className="table-listing-app">
              <div className="table-responsive">
                <table width="100%" border="0" cellPadding="0" cellSpacing="0">
                  <tr>
                    <th style={{ width: "20%" }}>Notification Title</th>
                    {/* <th style={{ width: "15%" }}>
                      <div className="sorting_btn">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("service")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          className="t1"
                          onClick={() => this.descOrder("service")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div>
                      Service
                    </th> */}
                    <th style={{ width: "15%" }}>
                      {/* <div className="sorting_btn">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("createdBy")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          className="t1"
                          onClick={() => this.descOrder("createdBy")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      Notification Type
                    </th>

                    {/* <th style={{ width: "20%" }}> */}
                    {/* <div className="sorting_btn">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("lastUpdated")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          className="t1"
                          onClick={() => this.descOrder("lastUpdated")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                    {/* Trigger
                    </th> */}
                    <th style={{ width: "20%" }}>
                      {/* <div className="sorting_btn">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("lastUpdated")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          className="t1"
                          onClick={() => this.descOrder("lastUpdated")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      Date/Time
                    </th>

                    <th style={{ width: "10%" }}>Status</th>
                    <th style={{ width: "10%" }}>Action</th>
                  </tr>
                  {this.state.listData.length > 0 ? (
                    <React.Fragment>
                      {this.state.listData.map((item, key) => (
                        <tr key={key}>
                          <td colSpan="6">
                            <div className="tble-row">
                              <table
                                width="100%"
                                border="0"
                                cellPadding="0"
                                cellSpacing="0"
                              >
                                <tr>
                                  <td style={{ width: "20%" }}>{item.title}</td>
                                  {/* <td style={{ width: "15%" }}>{item.service}</td> */}
                                  <td style={{ width: "15%" }}>
                                    {item.notificationType === 0
                                      ? "Email"
                                      : "Push"}
                                  </td>
                                  {/* <td style={{ width: "20%" }}>{item.trigger}</td> */}
                                  <td style={{ width: "20%" }}>
                                    {" "}
                                    {SetDateFormat(item.endDate)}
                                    {"|"}
                                    {SetTimeFormat(item.endDate)}
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    {item.isSent === 0 ? (
                                      <React.Fragment>
                                        <span class="progress-btn green">
                                          Scheduled
                                        </span>
                                      </React.Fragment>
                                    ) : item.isSent === 1 ? (
                                      <React.Fragment>
                                        <span href="#" class="progress-btn sky">
                                          Published
                                        </span>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment></React.Fragment>
                                    )}
                                  </td>

                                  <td
                                    style={{ width: "10%" }}
                                    className="service-category-edit-del"
                                  >
                                    {item.isSent === 0 ? (
                                      <React.Fragment>
                                        <img
                                          src={ImageName.IMAGE_NAME.EDIT_SQUARE}
                                          style={{ cursor: "pointer" }}
                                          id="basic-button"
                                          className="serv-cat-edit-btn"
                                          onClick={() => this.editPage(key)}
                                        />
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment></React.Fragment>
                                    )}

                                    <img
                                      src={ImageName.IMAGE_NAME.TRASH_BTN}
                                      style={{
                                        cursor: "pointer",
                                        marginLeft: "10px",
                                      }}
                                      id="basic-button"
                                      className="serv-cat-del-btn"
                                      onClick={() => this.deletePage(key)}
                                    />
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
                        <td colSpan="6">
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

                <div className="tble-short" id="service-categ-botm-tabsort">
                  <span className="lbl service-categ-botm-disp-text">
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
                      <div class="col-md-6">
                        <div class="sf-row">
                          <div class="lable-text" style={{ fontSize: "12px" }}>
                            Notification Type
                          </div>
                          <div class="dropdwn" style={{ marginLeft: "120px" }}>
                            <SelectBox
                              optionData={notificationTypeArr}
                              value={this.state.selectedNotificationType}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onNotificationTypeChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-1"></div>
                      <div class="col-md-5">
                        <div class="sf-row">
                          <div class="lable-text" style={{ fontSize: "13px" }}>
                            Status
                          </div>
                          <div class="dropdwn" style={{ cursor: "pointer" }}>
                            <SelectBox
                              optionData={statusArr}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ..............................delete modal............................. */}

        <div id="delete-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-md modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content" style={{ padding: "10px" }}>
              <div className="delete-head">Delete Notification</div>
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
