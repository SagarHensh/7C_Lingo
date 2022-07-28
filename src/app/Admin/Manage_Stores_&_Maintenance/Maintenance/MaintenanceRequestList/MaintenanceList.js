import React from "react";
import "./maintenanceList.css";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../../enums";

import { CommonData, ErrorCode } from "../../../../../services/constant";
import { Decoder } from "../../../../../services/auth";
import {
  consoleLog,
  getLookUpDataFromAPI,
  SetDatabaseDateFormat,
  SetDateFormat,
  SetTimeFormat,
  SetUSAdateFormat,
  textTruncate,
} from "../../../../../services/common-function";
import history from "../../../../../history";
import { ToastContainer, toast } from "react-toastify";
import { ApiCall } from "../../../../../services/middleware";
import { Link } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

export default class MaintenanceList extends React.Component {
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
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      name: "",
      email: "",
      mobile: "",
      typeArr: [],
      typeData: "",
      priorityArr: [],
      priorityData: "",
      status: 0,
      formDate: "",
      toDate: "",
      declineMessage: "",
      store: "",
      requirement: "",
      selectedStatus: {},
      requestedByArr: [],
      selectedRequestedBy: {},
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
    document.getElementById("backdrop").style.display = "none";

    var classInstance = this;

    var modal = document.getElementById("delete-model");
    var filterModal = document.getElementById("filter-model");

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        classInstance.closeDeleteModal();
      } else if (event.target == filterModal) {
        classInstance.closeFilterModal();
      }
    };
  }

  load = async () => {
    let type = [],
      priorityArrData = [],
      maintainArr = [],
      requestArrData=[],
      statusDataArr = [];
    let req = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      requestId: "",
      maintenanceTypeId: "",
      priorityTypeId: "",
      storeName: "",
      requestedBy: "",
      requirement: "",
      status: "",
      searchfrom: "",
      searchto: "",
    };

    let lookUpData = await getLookUpDataFromAPI();
    lookUpData.VENDOR_TYPE.map((data) => {
      type.push({
        label: data.name,
        value: data.id,
      });
    });


    let requestBy = await ApiCall("getAdminStaffForMaintainance");
    
    if (
      requestBy.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      requestBy.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(requestBy.data.payload);
      // consoleLog("res staff::",payload.data[0].adminstafflist)

      payload.data[0].adminstafflist.map((obj) => {
        requestArrData.push({
          label: obj.name,
          value: obj.userId,
        });
      });
    }

    // .......................................

    // let res = await getLookUpDataFromAPI();
    // consoleLog("response:::", res);
    lookUpData.PRIORITY_TYPE.map((obj) => {
      priorityArrData.push({
        label: obj.name,
        value: obj.id,
      });
    });
    let resMaintenance = await ApiCall("getlookuplistbylookuptype", {
      lookuptype: "MAINTAINANCE_TYPE",
    });
    // consoleLog("MAINTENANCEdata::", resMaintenance);

    if (
      resMaintenance.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resMaintenance.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payloadRes = Decoder.decode(resMaintenance.data.payload);

      // consoleLog("payloaddata::", payloadRes);

      payloadRes.data.lookupdata.map((obj) => {
        maintainArr.push({
          label: obj.name,
          value: obj.id,
        });
      });
    }

    this.listApi(req);

    this.setState({
      typeArr: maintainArr,
      priorityArr: priorityArrData,
      requestedByArr:requestArrData
      // statusArr: statusArr,
    });
  };

  listApi = async (data) => {
    consoleLog("req data::",data)
    let res = await ApiCall("fetchMaintainanceReqList", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      consoleLog("DSADA",payload)
      let totalPage = Math.ceil(payload.data.count / this.state.limit);
      this.setState({
        listData: payload.data.details,
        total_page: totalPage,
      });
    }
  };
  //..... for search name......

  onNameChange = (value) => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      requestId: value,
      maintenanceTypeId:
        this.state.typeData.value == null ||
        this.state.typeData.value == undefined
          ? ""
          : this.state.typeData.value,
      priorityTypeId:
        this.state.priorityData.value == null ||
        this.state.priorityData.value == undefined
          ? ""
          : this.state.priorityData.value,
      storeName: this.state.store,
      requestedBy: this.state.selectedRequestedBy.value == null || this.state.selectedRequestedBy.value == undefined ? "" : this.state.selectedRequestedBy.value,
      requirement: this.state.requirement,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
          searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
          searchto: this.state.toDate == "" ? "" :  SetDatabaseDateFormat(this.state.toDate),
       
    };

    this.setState({
      name: value,
    });

    this.listApi(data);
  };
  onStoreChange = (val) => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      requestId: this.state.name,
      maintenanceTypeId:
        this.state.typeData.value == null ||
        this.state.typeData.value == undefined
          ? ""
          : this.state.typeData.value,
      priorityTypeId:
        this.state.priorityData.value == null ||
        this.state.priorityData.value == undefined
          ? ""
          : this.state.priorityData.value,
      storeName: val,
      requestedBy: this.state.selectedRequestedBy.value == null || this.state.selectedRequestedBy.value == undefined ? "" : this.state.selectedRequestedBy.value,
      requirement: this.state.requirement,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
          searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
          searchto: this.state.toDate == "" ? "" :  SetDatabaseDateFormat(this.state.toDate),
       
    };

    this.setState({
      store: val,
    });

    this.listApi(data);
  };
  onRequirementChange = (val) => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      requestId: this.state.name,
      maintenanceTypeId:
        this.state.typeData.value == null ||
        this.state.typeData.value == undefined
          ? ""
          : this.state.typeData.value,
      priorityTypeId:
        this.state.priorityData.value == null ||
        this.state.priorityData.value == undefined
          ? ""
          : this.state.priorityData.value,
      storeName: this.state.store,
      requestedBy: this.state.selectedRequestedBy.value == null || this.state.selectedRequestedBy.value == undefined ? "" : this.state.selectedRequestedBy.value,
      requirement: val,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
          searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
          searchto: this.state.toDate == "" ? "" :  SetDatabaseDateFormat(this.state.toDate),
       
    };

    this.setState({
      requirement: val,
    });

    this.listApi(data);
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
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      requestId: this.state.name,
      maintenanceTypeId:
        this.state.typeData.value == null ||
        this.state.typeData.value == undefined
          ? ""
          : this.state.typeData.value,
      priorityTypeId:
        this.state.priorityData.value == null ||
        this.state.priorityData.value == undefined
          ? ""
          : this.state.priorityData.value,
      storeName: this.state.store,
      requestedBy: this.state.selectedRequestedBy.value == null || this.state.selectedRequestedBy.value == undefined ? "" : this.state.selectedRequestedBy.value,
      requirement: this.state.requirement,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
          searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
          searchto: this.state.toDate == "" ? "" :  SetDatabaseDateFormat(this.state.toDate),
       
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
      requestId: this.state.name,
      maintenanceTypeId:
        this.state.typeData.value == null ||
        this.state.typeData.value == undefined
          ? ""
          : this.state.typeData.value,
      priorityTypeId:
        this.state.priorityData.value == null ||
        this.state.priorityData.value == undefined
          ? ""
          : this.state.priorityData.value,
      storeName: this.state.store,
      requestedBy: this.state.selectedRequestedBy.value == null || this.state.selectedRequestedBy.value == undefined ? "" : this.state.selectedRequestedBy.value,
      requirement: this.state.requirement,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
          searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
          searchto: this.state.toDate == "" ? "" :  SetDatabaseDateFormat(this.state.toDate),
       
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
      requestId: this.state.name,
      maintenanceTypeId:
        this.state.typeData.value == null ||
        this.state.typeData.value == undefined
          ? ""
          : this.state.typeData.value,
      priorityTypeId:
        this.state.priorityData.value == null ||
        this.state.priorityData.value == undefined
          ? ""
          : this.state.priorityData.value,
      storeName: this.state.store,
      requestedBy: this.state.selectedRequestedBy.value == null || this.state.selectedRequestedBy.value == undefined ? "" : this.state.selectedRequestedBy.value,
     requirement: this.state.requirement,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
          searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
          searchto: this.state.toDate == "" ? "" :  SetDatabaseDateFormat(this.state.toDate),
       
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
      requestId: this.state.name,
      maintenanceTypeId:
        this.state.typeData.value == null ||
        this.state.typeData.value == undefined
          ? ""
          : this.state.typeData.value,
      priorityTypeId:
        this.state.priorityData.value == null ||
        this.state.priorityData.value == undefined
          ? ""
          : this.state.priorityData.value,
      storeName: this.state.store,
      requestedBy: this.state.selectedRequestedBy.value == null || this.state.selectedRequestedBy.value == undefined ? "" : this.state.selectedRequestedBy.value,
      requirement: this.state.requirement,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
          searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
          searchto: this.state.toDate == "" ? "" :  SetDatabaseDateFormat(this.state.toDate),
       
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
      searchto: "",
      searchfrom: "",
      type: "",
      status: "",
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
      searchto: "",
      searchfrom: "",
      type: "",
      status: "",
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

  onTypeChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };

    this.setState({
      typeData: obj,
    });
  };
  onPriorityChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };

    this.setState({
      priorityData: obj,
    });
  };
  onRequestedByChange = (dat) => {
    this.setState({
      selectedRequestedBy:dat
    })
  }
  onFilterStatusChange = (dat) => {
    this.setState({
      selectedStatus:dat
    })
  }

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
  openFilterModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("filter-model").style.display = "block";
    document.getElementById("filter-model").classList.add("show");
  };
  closeFilterModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("filter-model").style.display = "none";
    document.getElementById("filter-model").classList.remove("show");
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

  onFilterApply = () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      requestId: this.state.name,
      maintenanceTypeId:
        this.state.typeData.value == null ||
        this.state.typeData.value == undefined
          ? ""
          : this.state.typeData.value,
      priorityTypeId:
        this.state.priorityData.value == null ||
        this.state.priorityData.value == undefined
          ? ""
          : this.state.priorityData.value,
      storeName: this.state.store,
      requestedBy: this.state.selectedRequestedBy.value == null || this.state.selectedRequestedBy.value == undefined ? "" : this.state.selectedRequestedBy.value,
      requirement: this.state.requirement,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchto: this.state.toDate == "" ? "" :  SetDatabaseDateFormat(this.state.toDate),
    };

    // window.$("#create-filter-model").modal("hide");
    this.closeFilterModal();
    // console.log("Filter data", data)

    this.listApi(data);

    this.setState({
      current_page:1
    });
  };

  onResetFilter = () => {
    this.resetData();
    this.setState({
  
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      current_page: 1,
  
    });
    this.closeFilterModal();
    this.load();
  };

  onEdit = (item) => {
    this.props.history.push({
      pathname: "/adminEditMaintenance",
      state: this.state.listData[this.state.curIndex],
    });
  };

  onChangeLimit = (dat) => {
    this.setState({
      limit: parseInt(dat.value),
      selectedDisplayData: dat,
    });

    let data = {
      limit: JSON.stringify(dat.value),
      offset: "0",
      requestId: this.state.name,
      maintenanceTypeId: this.state.typeData.value,
      priorityTypeId: this.state.priorityData.value,
      orderby: "",
      direc: "",
      // searchto: this.state.toDate,
      // searchfrom: this.state.formDate,
      // type: this.state.type,
      // status: this.state.status.toString(),
    };

    // consoleLog("changelimit:::", data);

    this.listApi(data);
  };

  handleDelete = () => {
    this.handleMenuClose();
    this.openDeleteModal();
  };
  deleteItem = async () => {
    let data = {
      id: this.state.listData[this.state.curIndex].id,
      status: 2,
    };
    // console.log(">>>>>>>>>>dataaaa::", JSON.stringify(data));
    let status = await ApiCall("changeStatusMaintainance", data);
    // console.log(">>>>>>>>>status:", status);
    // window.$("#delete-modal").modal("hide");
    this.closeDeleteModal();
    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.load();
      toast.success(AlertMessage.MESSAGE.DELETE.DELETED);
    }
  };

  onCancel = () => {
    // window.$("#delete-modal").modal("hide");
    this.closeDeleteModal();
  };

  resetData = () => {
    this.setState({
      typeData:{},
      priorityData:{},
      selectedRequestedBy:{},
      formDate:"",
      toDate:"",
      selectedStatus:{},

    })
  }

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
        {/* <Header /> */}
        <ToastContainer hideProgressBar={true} theme="colored" />
        {/* <Sidebar /> */}
        <div className="component-wrapper">
          <div className="listing-component-app">
            <div
              className="vn_frm"
              style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
            >
              {" "}
              <Link to="/adminDashboard">Dashboard</Link> / Maintenance
            </div>
            <div className="vendor-info _fl sdw">
              <div className="vn-form _fl">
                <div className="row">
                  <div className="col-md-4">
                    <div className="vn_frm">
                      {" "}
                      <span>Request Id</span>
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
                      <span>Store</span>
                      <InputText
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.store}
                        onTextChange={(value) => {
                          this.onStoreChange(value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vn_frm">
                      {" "}
                      <span>Requirement</span>
                      <InputText
                        type="text"
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.requirement}
                        onTextChange={(value) => {
                          this.onRequirementChange(value);
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
                <div
                  className="addnew"
                  onClick={() => {
                    return history.push("/adminAddMaintenance");
                  }}
                >
                  <a href="javascript:void(0)">
                    Add New Request{" "}
                    <img
                      className=""
                      src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                      style={{ width: "25px", cursor: "pointer" }}
                    />
                  </a>
                </div>
                <div className="tble-short">
                  <span className="lbl">Display</span>
                  <div
                    className="dropdwn"
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

            <div className="table-listing-app md4">
              <div className="table-responsive">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <th style={{ width: "8%" }}>
                      {/* <div className="sorting_btn">
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
                      </div> */}
                      Request Id
                    </th>

                    <th style={{ width: "10%" }}>
                      {/* <div className="sorting_btn">
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
                      </div> */}
                      Requirement
                    </th>
                    <th style={{ width: "15%" }}>
                      {/* <div className="sorting_btn">
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
                      </div> */}
                      Maintenance Type
                    </th>
                    <th style={{ width: "12%" }}>
                      {/* <div className="sorting_btn">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("agency")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button className="t1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("agency")}
                          />
                        </button>
                      </div> */}
                      Store
                    </th>
                    <th style={{ width: "10%" }}>
                      {/* <div className="sorting_btn">
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
                      </div> */}
                      Priority
                    </th>
                    <th style={{ width: "10% " }}>
                      {/* <div className="sorting_btn">
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
                      </div> */}
                      Requested By
                    </th>
                    <th style={{ width: "15%" }}>Requested On</th>
                    <th style={{ width: "10%" }}>Status</th>
                    <th style={{ width: "6%" }}>Action</th>
                  </tr>
                  {this.state.listData.length > 0 ? (
                    <React.Fragment>
                      {this.state.listData.map((data, key) => (
                        <tr style={{ textAlign: "center" }} key={key}>
                          <td colspan="9">
                            <div className="tble-row">
                              <table
                                width="100%"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tr style={{ fontSize: "8px" }}>
                                  <td style={{ width: "8%" }}>{data.id}</td>
                                  <td
                                    style={{ width: "10%" }}
                                    data-toggle="tooltip"
                                    title={data.requirement}
                                  >
                                    {data.requirement.length > 15
                                      ? textTruncate(data.requirement, 15)
                                      : data.requirement}
                                  </td>
                                  <td
                                    style={{ width: "15%" }}
                                    data-toggle="tooltip"
                                    title={data.maintenanceName}
                                  >
                                    {data.maintenanceName.length > 15
                                      ? textTruncate(data.maintenanceName, 15)
                                      : data.maintenanceName}
                                  </td>
                                  <td
                                    style={{ width: "12%" }}
                                    data-toggle="tooltip"
                                    title={data.storeName}
                                  >
                                    {data.storeName.length > 15
                                      ? textTruncate(data.storeName, 15)
                                      : data.storeName}
                                  </td>

                                  <td style={{ width: "10%" }}>
                                    {data.priorityTypeId === 24 ? (
                                      <span className="Priority_low_btn">
                                        Low
                                      </span>
                                    ) : data.priorityTypeId === 23 ? (
                                      <span className="Priority_medium_btn">
                                        Medium
                                      </span>
                                    ) : data.priorityTypeId === 22 ? (
                                      <span className="Priority_high_btn">
                                        High
                                      </span>
                                    ) : (
                                      <React.Fragment />
                                    )}
                                  </td>

                                  <td
                                    style={{ width: "10%" }}
                                    data-toogle="tooltip"
                                    title={data.requestedBy}
                                  >
                                    {data.requestedBy.length > 15
                                      ? textTruncate(data.requestedBy)
                                      : data.requestedBy}
                                  </td>

                                  {/* <td style={{ width: "10%" }}>{data.email}</td> */}
                                  <td style={{ width: "15%" }}>
                                    {SetDateFormat(data.requestedDate)} |{" "}
                                    {SetTimeFormat(data.requestedDate)}
                                  </td>

                                  <td style={{ width: "10%" }}>
                                    {data.status === 0 ? (
                                      <span className="Store_inactive_btn">
                                        Inactive
                                      </span>
                                    ) : data.status === 1 ? (
                                      <span className="maintenance_active_btn">
                                        Active
                                      </span>
                                    ) : (
                                      <React.Fragment />
                                    )}
                                  </td>

                                  <td style={{ width: "6%" }}>
                                    <img
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
                                        onClick={() => {
                                          this.onEdit(key);
                                        }}
                                      >
                                        Edit
                                      </MenuItem>
                                      <MenuItem onClick={this.handleDelete}>
                                        Delete
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
                        <td colSpan="8">
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

            <div className="table-filter-app-b">
              {/* <div className="filter-btn">
                <a href={"javascript:void(0)"} onClick={this.openFilterModal}>
                  Filter
                </a>
              </div> */}
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
                {/* <div
                  className="addnew"
                  onClick={() => {
                    return history.push("/adminAddMaintenance");
                  }}
                >
                  <a href="javascript:void(0)">
                    Add New Request{" "}
                    <img
                      className=""
                      src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                      style={{ width: "25px", cursor: "pointer" }}
                    />
                  </a>
                </div> */}
                <div className="tble-short">
                  <span className="lbl">Display</span>
                  <div
                    className="dropdwn"
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
                    <div className="row">
                              <div className="col-md-4">
                                <div
                                  className="input-group"
                                  style={{
                                    width: "100%",
                                    borderRadius: "9px",
                                    height: "43px",
                                    border: "1px solid #ced4da",
                                    boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                  }}
                                >
                                  <div style={{ width: "80%", padding: "8px" }}>
                                    <span style={{color:"#B0B3B2"}}>FROM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.formDate}</span>
                                  </div>
                                  <div style={{ width: "20%" }}>
                                    <a style={{ float: "right" }}>
                                      <DatePicker
                                        dropdownMode="select"
                                        showMonthDropdown
                                        showYearDropdown
                                        adjustDateOnChange
                                        // minDate={new Date()}
                                        onChange={(date) =>
                                          this.formDateChange(date)
                                        }
                                        customInput={<Schedule />}
                                      />
                                    </a>
                                  </div>
                                </div>
                               

                              </div>
                              <div className="col-md-4">

                                <div
                                  className="input-group"
                                  style={{
                                    width: "100%",
                                    borderRadius: "9px",
                                    height: "43px",
                                    border: "1px solid #ced4da",
                                    boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                  }}
                                >
                                  <div style={{ width: "80%", padding: "8px" }}>
                                    <span style={{color:"#B0B3B2"}}>TO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.toDate}</span>
                                  </div>
                                  <div style={{ width: "20%" }}>
                                    <a style={{ float: "right" }}>
                                      <DatePicker
                                        dropdownMode="select"
                                        showMonthDropdown
                                        showYearDropdown
                                        adjustDateOnChange
                                        // minDate={new Date()}
                                        onChange={(date) =>
                                          this.toDateChange(date)
                                        }
                                        customInput={<Schedule />}
                                      />
                                    </a>
                                  </div>
                                </div>
                               
                              </div>
                            </div>
                  </div>
                  <div className="m-select _fl">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="sf-row">
                          <div
                            className="lable-text"
                            style={{ paddingRight: "10px", fontSize: "13px" }}
                          >
                            Maintenance Type
                          </div>
                          <div
                            className="dropdwn"
                            style={{ marginLeft: "40%" }}
                          >
                            <SelectBox
                              optionData={this.state.typeArr}
                              value={this.state.typeData}
                              // placeholder="Select"
                              onSelectChange={(value) => {
                                this.onTypeChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="sf-row">
                          <div
                            className="lable-text"
                            style={{ paddingLeft: "10px", fontSize: "13px" }}
                          >
                            Priority
                          </div>
                          <div
                            className="dropdwn"
                            style={{ marginLeft: "25%" }}
                          >
                            <SelectBox
                              optionData={this.state.priorityArr}
                              value={this.state.priorityData}
                              // placeholder="Select"
                              onSelectChange={(value) => {
                                this.onPriorityChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="m-select _fl">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="sf-row">
                          <div
                            className="lable-text"
                            style={{ paddingRight: "10px", fontSize: "13px" }}
                          >
                            Requested By
                          </div>
                          <div
                            className="dropdwn"
                            style={{ marginLeft: "40%" }}
                          >
                            <SelectBox
                              optionData={this.state.requestedByArr}
                              value={this.state.selectedRequestedBy}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onRequestedByChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="sf-row">
                          <div
                            className="lable-text"
                            style={{ paddingLeft: "10px", fontSize: "13px" }}
                          >
                            Status
                          </div>
                          <div
                            className="dropdwn"
                            style={{ marginLeft: "25%" }}
                          >
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ..............................delete modal............................. */}
        <div id="delete-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div className="modal-content" style={{ padding: "10px" }}>
              <div className="delete-head">Delete Maintenance Request</div>
              <div className="modal-body">
                <div className="body-txt">
                  Are You Sure to delete the Request?
                </div>

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
                      width: "10%",
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
          className="modal-backdrop fade show"
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
