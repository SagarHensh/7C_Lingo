import React, { Component } from "react";
import history from "../../../../history";
import "./notificationList.css";
import { AlertMessage, ImageName } from "../../../../enums";
import { ApiCall, ApiCallVendor } from "../../../../services/middleware";
import { Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import {
  consoleLog,
  SetDateFormat,
  SetTimeFormat,
} from "../../../../services/common-function";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../../Sidebar/Sidebar";
import Header from "../../Header/Header";
import { COMMON } from "../../../../services/constant/connpmData";
import { Link } from "react-router-dom";

const reqData = {
  limit: "",
  offset: "",
  orderby: "",
  direc: "",
  searchto: "",
  searchfrom: "",
  status: "",
  userTypeId: "",
  searchVal: "",
};

export default class VendorNotificationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      current_page: 1,
      total_page: 10,
      limit: 10,
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
        label: "10",
        value: "10",
      },

      listData: [],
      notificationData: {}
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();

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
    // consoleLog("datataa:::", JSON.stringify(curData));

    this.listApi();
  };

  listApi = async (data) => {
    const res = await ApiCallVendor("getUserNotifications", {});

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
        consoleLog("res::::::", decodeData.data);

      this.setState({
        listData: decodeData.data.notificationList,
        notificationData:decodeData.data    
      });
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
      pathname: "/vendorEditNotification",
      state: this.state.listData[index],
    });
  };

//   deletePage = (index) => {
//     this.setState({
//       curIndex: index,
//       workingId: this.state.listData[index].id,
//     });
   
//     this.openDeleteModal();
//   };
  deleteItem = async (item,key) => {
    // consoleLog("id:::", this.state.workingId);
    // window.$("#delete-modal").modal("hide");
    // this.closeDeleteModal();
    let data = {
        "ids": [item.id], "type": "DEL" 
    };
    let status = await ApiCallVendor("UserNotificationsStatusChange", data);
    // consoleLog("status::", status);
    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
        this.state.listData.splice(key, 1);
        this.setState({
            listData: this.state.listData
        })
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
    });

    let resData = {
      limit: parseInt(obj.value),
      offset: JSON.stringify(
        (this.state.current_page - 1) * parseInt(obj.value)
      ),
    };
    let curData = Object.assign(reqData, resData);

    this.listApi(curData);
  };

  formDateChange = (e) => {
    this.setState({
      formDate: e.target.value,
    });
  };

  toDateChange = (e) => {
    this.setState({
      toDate: e.target.value,
    });
  };

  onFilterApply = () => {
    let resData = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      searchto: this.state.toDate,
      searchfrom: this.state.formDate,
    };
    let curData = Object.assign(reqData, resData);

    this.closeFilterModal();

    this.listApi(curData);

    this.setState({
      formDate: "",
      toDate: "",
    });
  };

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: "",
      selectedDisplayData: {
        label: "10",
        value: "10",
      },
      current_page: 1,
      limit: 10,
    });
    this.closeFilterModal();
    let d = {
      limit: "10",
      offset: "0", //starting index of page
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: "",
      status: "",
      userTypeId: "",
      searchVal: "",
    };

    this.listApi(d);
  };
  _onCheckNotification = async (item, key) => {
   
    if (item.isRead == 0) {
        this.state.notificationData.unReadMsg = this.state.notificationData.unReadMsg - 1;
        let data = {
            "ids": [item.id], "type": "READ" 
        };
        await ApiCallVendor("UserNotificationsStatusChange", data);
    }
    // this.state.listData[key].isCheck = !this.state.listData[key].isCheck;
    this.state.listData[key].isRead = 1;
    this.setState({
        listData: this.state.listData,
        notificationData:this.state.notificationData
    })
}
mark_read = async()=>{
  let reqData = [];
  this.state.notificationData.unReadMsg = 0;
  this.state.notificationData.notificationList.map((obj) => {
    // consoleLog("obj:",obj)
    if(obj.isRead == 0) {
      reqData.push(obj.id);
      obj.isRead = 1;
     }
  })
  let data = {
    "ids": reqData, "type": "READ" 
  }
  consoleLog("data::",data);
  let updateData =  await ApiCallVendor("UserNotificationsStatusChange", data);
       consoleLog("###",updateData)
      
        this.setState({
            notificationData: this.state.notificationData
        })
    
 
}

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <React.Fragment>
        {/* <div className="wrapper">
          <Header /> */}
          <ToastContainer hideProgressBar theme="colored" />
          {/* <Sidebar /> */}
          <div className="component-wrapper">
          <div
                className="vn_frm"
                style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
              >
                {" "}
                <Link to="/vendorDashboard">Dashboard</Link> / Notifications
              </div>
            <div className="listing-component-app">
              <div
                className="vn_frm"
                style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
              >
                  <div className="row">
                      <div className="col-md-4">
                      Notifications
                      </div>
                      <div className="col-md-3">
                      
                      </div>
                      {this.state.notificationData.unReadMsg === 0 ? (<React.Fragment>
                        <div className="col-md-2 mark_as_read_disable" >
                      
                        Mark all as Read
                                       
                      </div>

                      </React.Fragment>) : (<React.Fragment>
                        <div className="col-md-2 mark_as_read" onClick={this.mark_read} >
                      
                      Mark all as Read
                                     
                    </div>
                      </React.Fragment>)}
                      
                  </div>
               
              </div>

             

              {this.state.listData.map((item, key) => (
                <React.Fragment>
                  <div class="accordion" id={"accordionExample" + key} >
                    <div class="card notify_card">
                      <div
                        class="card-header"
                        id={"headingOne"+key}
                        type="button"
                        style={{
                          borderRadius: "20px ",
                          padding: "20px 0px",
                          backgroundColor: "white",
                        }}
                        data-toggle="collapse"
                        data-target={"#collapseOne"+key}
                        aria-expanded="false"
                        aria-controls={"collapseOne"+key}
                        onClick={() => this._onCheckNotification(item,key)}
                      >
                        <div>
                          <div className="row notify">
                            <div className="col-md-2">
                              {item.notificationType ===
                              COMMON.NOTIFICATION.BIRTHDAY ? (
                                <React.Fragment>
                                  <img
                                    src={ImageName.IMAGE_NAME.BIRTHDAY}
                                    style={{ width: "40px" }}
                                  ></img>
                                </React.Fragment>
                              ) :item.notificationType ===
                              COMMON.NOTIFICATION.JOB ?
                               (
                                <React.Fragment>
                                     <img
                                    src={ImageName.IMAGE_NAME.BUSINESS_WITH_SEARCH}
                                    style={{ width: "40px" }}
                                  ></img>
                                </React.Fragment>
                              ):item.notificationType ===
                              COMMON.NOTIFICATION.REMINDER ? (<React.Fragment>
                                   <img
                                    src={ImageName.IMAGE_NAME.CALENDER_WITH_BOX}
                                    style={{ width: "40px" }}
                                  ></img>
                              </React.Fragment>): (<React.Fragment>
                                <img
                                    src={ImageName.IMAGE_NAME.CLINGO_LOGO_GRAY_COLOR}
                                    style={{ width: "40px" }}
                                  ></img>
                              </React.Fragment>)}
                            </div>
                            <div className="col-md-4">
                              <div className="job_details">
                                Job:Job {item.title}
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="notify_time">
                                {SetDateFormat(item.createDate)} |
                                {SetTimeFormat(item.createDate)}
                              </div>
                            </div>
                            <div className="col-md-1">
                                {item.isRead === 0 ?  <span className="notify_dot">
                      
                      </span> : <React.Fragment>
                        <img src={ImageName.IMAGE_NAME.TRASH_BTN}/>
                      </React.Fragment> }
                           
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        id={"collapseOne"+key}
                        class="collapse"
                        aria-labelledby={"headingOne"+key}
                        data-parent={"#accordionExample"+key}
                      >
                        <div class="card-body notify_body">
                            <div style={{float:"right"}}>
                            {/* <img
                                src={ImageName.IMAGE_NAME.TRASH_BTN}
                                style={{ width: "25px" }}
                                onClick={() => this.deleteItem(item,key)}
                              ></img> */}
                            </div>
                            <div>
                            {item.body}
                            </div>
                            </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          {/* ..................modal................................. */}
          <div
            id="filter-model"
            className="modal fade modelwindow"
            role="dialog"
          >
            <div className="modal-dialog modal-md modal-dialog-centered">
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
                        <span>from</span>
                        <input
                          type="date"
                          className="datefield bd"
                          placeholder="10/25/2021"
                          value={this.state.formDate}
                          onChange={this.formDateChange}
                        />
                      </div>
                      <div className="form-field-app">
                        <span>to</span>
                        <input
                          type="date"
                          className="datefield bd"
                          placeholder="10/25/2021"
                          value={this.state.toDate}
                          onChange={this.toDateChange}
                        />
                      </div>
                    </div>
                    <div className="m-select _fl">
                      {/* <div class="row">
                      <div class="col-md-6">
                        <div class="sf-row">
                          <div class="lable-text">Client</div>
                          <div class="dropdwn">
                            <select
                              class="frm4-select"
                              id="myDropdown_13"
                            ></select>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="sf-row">
                          <div class="lable-text">Sub-Department[s]</div>
                          <div class="dropdwn" style={{ marginLeft: "145px" }}>
                            <select
                              class="frm4-select"
                              id="myDropdown_14"
                            ></select>
                          </div>
                        </div>
                      </div>
                    </div> */}
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
          {/* ..............................delete modal............................. */}

          <div
            id="delete-model"
            className="modal fade modelwindow"
            role="dialog"
          >
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
