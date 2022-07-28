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
import "./DocumentList.css";

import { AlertMessage, ImageName } from "../../../../enums";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../../SharedComponents/inputText";
import { ApiCall } from "../../../../services/middleware";
import { Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { nameRegexValidator } from "../../../../validators";
import {
  consoleLog,
  SetDateFormat,
  SetScheduleDate,
  SetTimeFormat,
  SetUSAdateFormat,
} from "../../../../services/common-function";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import {
  IMAGE_PATH_ONLY,
  IMAGE_STORE_PATH,
} from "../../../../services/config/api_url";

import DatePicker from "react-datepicker";



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

const statusArrData = [
  {
    label: "Sent",
    value: "1",
  },
  {
    label: "Signed",
    value: "0",
  },
];

export default class DocumentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      current_page: 1,
      total_page: 10,
      limit: 20,
      display: "",
      docName: "",
      switch: false,
      anchorEl: null, //menu button
      openModal: false, // open decline modal false
      // listData: [],
      curIndex: 0,
      formDate: "",
      toDate: "",
      filterDocType: "",
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      docTypeArr: [],
      docTypeData: "",
      workingId: 0,
      listData: [],
      docArrData: [],
      formDate: "",
      toDate: "",
      allRoleArr: [],
      selectedRole: { label: "None", value: "" },
      selectedStatus:{}
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
    let dataRes = {},
      roleArrData = [{ label: "None", value: "" }];
    let docTypeArr = [];
    let resArr = await ApiCall("getLookUpData", dataRes);

    if (
      resArr.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resArr.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(resArr.data.payload);

      let lookupdata = payload.data.lookupdata;

      consoleLog("lookup data::", lookupdata);

      let docTypeArrData = lookupdata.DOCUMENT_TYPE;
      let purposeArrData = lookupdata.PURPOSE_TYPE;

      lookupdata.USER_TYPE.map((obj) => {
        roleArrData.push({
          label: obj.name,
          value: obj.id,
        });
      });

      docTypeArrData.map((data) => {
        docTypeArr.push({
          label: data.name,
          value: data.id,
        });
      });

      this.setState({
        docTypeArr: docTypeArr,
        allRoleArr: roleArrData,
      });
    }
    let data = {
      name: this.state.docName,
      direc: "",
      orderby: "",
      documenttypeid: "",
      searchfrom: "",
      searchto: "",
      roleId: "",

      status:"",
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
    };

    this.listApi(data);
  };

  listApi = async (data) => {
    consoleLog("req data:::",data)
    const res = await ApiCall("fetchdocumentlist", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      console.log(":::::payload", payload.data);
      let totalPage = Math.ceil(
        payload.data.documentcount / parseInt(this.state.limit)
      );

      // let docResData = payload.data.documentlist;
      // consoleLog("response::::", payload.data);
      if (payload.data.documentlist && payload.data.documentlist.length > 0) {
        this.setState({
          listData: payload.data.documentlist,
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

  // ....................Searching.............................
  handleDocumentChange = (value) => {
    this.setState({
      docName: value,
    });

    let data = {
      direc: "",
      orderby: "",
      limit: parseInt(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: value,
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      roleId: this.state.selectedRole.value,
      status:this.state.selectedStatus.value,
      documenttypeid:
        this.state.docTypeData.value === null ||
        this.state.docTypeData.value === undefined ||
        this.state.docTypeData.value === ""
          ? ""
          : this.state.docTypeData.value,
    };

    this.listApi(data);
  };

  onDocChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      docTypeData: obj,
    });
  };
  onFilterStatusChange=(dat) => {
    this.setState({
      selectedStatus:dat
    })
  }
  onRoleChange = (dat) => {
    this.setState({
      selectedRole: dat,
    });
    let data = {
      limit: parseInt(this.state.limit),
      offset: "0",
      direc: "",
      orderby: "",
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      roleId: dat.value,
      status:this.state.selectedStatus.value,
      documenttypeid:
        this.state.docTypeData.value === null ||
        this.state.docTypeData.value === undefined ||
        this.state.docTypeData.value === ""
          ? ""
          : this.state.docTypeData.value,
      name: this.state.docName,
    };
    this.listApi(data);
    window.scrollTo(0, 0);
  };

  //   ..........add new button.......................
  addNew = () => {
    return history.push("/adminAddDocument");
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
      pathname: "/adminEditDocument",
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
      limit: parseInt(this.state.limit),
      offset: "0",
      direc: "",
      orderby: "",
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      roleId: this.state.selectedRole.value,
      status:this.state.selectedStatus.value,
      documenttypeid:
        this.state.docTypeData.value === null ||
        this.state.docTypeData.value === undefined ||
        this.state.docTypeData.value === ""
          ? ""
          : this.state.docTypeData.value,
      name: this.state.docName,
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
      limit: parseInt(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit),
      direc: "",
      orderby: "",
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      roleId: this.state.selectedRole.value,
      status:this.state.selectedStatus.value,
      documenttypeid:
        this.state.docTypeData.value === null ||
        this.state.docTypeData.value === undefined ||
        this.state.docTypeData.value === ""
          ? ""
          : this.state.docTypeData.value,
      name: this.state.docName,
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
        limit: parseInt(this.state.limit),
        offset: JSON.stringify((currentPage - 1) * this.state.limit),
        direc: "",
        orderby: "",
        searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
        roleId: this.state.selectedRole.value,
        status:this.state.selectedStatus.value,
        documenttypeid:
          this.state.docTypeData.value === null ||
          this.state.docTypeData.value === undefined ||
          this.state.docTypeData.value === ""
            ? ""
            : this.state.docTypeData.value,
        name: this.state.docName,
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
        limit: parseInt(this.state.limit),
        offset: JSON.stringify((currentPage - 1) * this.state.limit),
        direc: "",
        orderby: "",
        status:this.state.selectedStatus.value,
        searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
        roleId: this.state.selectedRole.value,
        documenttypeid:
          this.state.docTypeData.value === null ||
          this.state.docTypeData.value === undefined ||
          this.state.docTypeData.value === ""
            ? ""
            : this.state.docTypeData.value,
        name: this.state.docName,
      };
      this.listApi(data);
    }
  };

  // ................status func...................
  onStatusChange = (index) => {
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
  };

  //......Ascending order .........

  ascOrder = (data) => {
    let filter = "";
    if (data === "documentType") {
      filter = "documentTypeId";
    } else if (data === "documentName") {
      filter = "name";
    } else if (data === "role") {
      filter = "userTypeId";
    } else if (data === "version") {
      filter = "version";
    } else if (data === "lastUpdated") {
      filter = "lastUpdated";
    }

    let req = {
      name: "",
      documenttypeid: "",
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),

      orderby: filter,
      direc: "ASC",
    };

    this.listApi(req);
  };

  //......Descending order .........

  descOrder = (data) => {
    let filter = "";
    if (data === "documentType") {
      filter = "documentTypeId";
    } else if (data === "role") {
      filter = "userTypeId";
    } else if (data === "intendedUser") {
      filter = "intendedUser";
    } else if (data === "version") {
      filter = "version";
    } else if (data === "lastUpdated") {
      filter = "lastUpdated";
    }

    let req = {
      name: "",
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      orderby: filter,
      direc: "DESC",
      documenttypeid: "",
    };

    this.listApi(req);
  };

  //........Page show Limit.........

  onChangeLimit = (dat) => {
    this.setState({
      limit: parseInt(dat.value),
      selectedDisplayData: dat,
    });

    let data = {
      limit: JSON.stringify(dat.value),
      offset: JSON.stringify(
        (this.state.current_page - 1) * parseInt(dat.value)
      ),
      direc: "",
      orderby: "",
      roleId: this.state.selectedRole.value,
      documenttypeid:
        this.state.docTypeData.value === null ||
        this.state.docTypeData.value === undefined ||
        this.state.docTypeData.value === ""
          ? ""
          : this.state.docTypeData.value,
      name: this.state.docName,
      status:this.state.selectedStatus.value === null || this.state.selectedStatus.value === undefined ? "" : this.state.selectedStatus.value 
    };
    // consoleLog("changelimit:::", data);

    this.listApi(data);
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

  onFilterApply = () => {
    let data = {
      limit: this.state.limit.toString(),
      offset: "0",
      direc: "",
      orderby: "",
      status:this.state.selectedStatus.value,
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      roleId: this.state.selectedRole.value,
      documenttypeid:
        this.state.docTypeData.value === null ||
        this.state.docTypeData.value === undefined ||
        this.state.docTypeData.value === ""
          ? ""
          : this.state.docTypeData.value,
      name: this.state.docName,
    };

    this.closeFilterModal();

    this.listApi(data);

    this.setState({
      current_page: 1,
    });
  };

  onResetFilter = () => {
    let data = {
      name: this.state.docName,
      direc: "",
      orderby: "",
      documenttypeid: "",
      roleId: "",
      searchfrom: "",
      searchto: "",
      status:"",
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
    };

    this.listApi(data);
    this.setState({
      limit: "20",
      formDate: "",
      toDate: "",
      docTypeData: {},
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      selectedStatus:{},
      current_page: 1,
    });
    // consoleLog("limit", this.state.limit);

    // this.load();
    this.closeFilterModal();
  };
  // ..................delete function........................
  deletePage = () => {
    this.setState({
      // listData: listArrData,
      workingId: this.state.listData[this.state.curIndex].id,
      anchorEl: false,
    });
    // window.$("#delete-modal").modal("show");
    this.openDeleteModal();
  };
  onCancel = () => {
    // window.$("#delete-modal").modal("hide");
    this.closeDeleteModal();
  };

  deleteItem = async () => {
    let data = {
      documentid: this.state.workingId,
    };
    // window.$("#delete-modal").modal("hide");
    this.closeDeleteModal();
    let status = await ApiCall("deletedocument", data);
    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.load();
      toast.success(AlertMessage.MESSAGE.DELETE.DELETED);
    }
  };

  onDownload = (index) => {
    window.open(IMAGE_PATH_ONLY + this.state.listData[index].documentPath);

    this.handleMenuClose();
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
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
              <Link to="/adminDashboard">Dashboard</Link> / Document
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
                      <span style={{ width: "30%", fontSize: "13px" }}>
                        Document Name
                      </span>
                      <InputText
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.docName}
                        // style={{ width: "45%" }}
                        onTextChange={(value) => {
                          this.handleDocumentChange(value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-2"></div>
                  <div className="col-md-4">
                    <div class="sf-row">
                      <div
                        class="lable-text"
                        // style={{ paddingLeft: "10px", fontSize: "16px" }}
                      >
                        Role
                      </div>
                      <div class="dropdwn" style={{ marginLeft: "50px" }}>
                        <SelectBox
                          optionData={this.state.allRoleArr}
                          value={this.state.selectedRole}
                          onSelectChange={(value) => this.onRoleChange(value)}
                        ></SelectBox>
                      </div>
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
                  <a href="#">
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
                      Document Name
                    </th>
                    <th style={{ width: "20%" }}>
                      <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("documentType")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("documentType")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div>
                      Document Type
                    </th>
                    <th style={{ width: "10%" }}>
                      <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("role")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("role")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div>
                      Role
                    </th>

                    <th style={{ width: "15%" }}>
                      {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("intendedUser")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("intendedUser")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      Intended User[s]
                    </th>
                    <th style={{ width: "10%" }}>
                      <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("version")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("version")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div>
                      Version
                    </th>
                    <th style={{ width: "15%" }}>
                      <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("lastUpdated")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("lastUpdated")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div>
                      Last Modified On
                    </th>
                    <th style={{ width: "15%" }}>Status</th>
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
                                  <td style={{ width: "10%" }}>{item.name}</td>
                                  <td style={{ width: "20%" }}>
                                    {item.documenttype}
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    {item.roleId === 3
                                      ? "Client"
                                      : item.roleId === 4
                                      ? "Vendor"
                                      : ""}
                                  </td>
                                  {/* <td style={{ width: "8%" }}>{item.clientId}</td> */}
                                  <td style={{ width: "15%" }}>
                                    {item.intenduser}
                                  </td>
                                  {/* <td style={{ width: "10%" }}>{item.user}</td> */}
                                  <td style={{ width: "10%" }}>
                                    {item.version}
                                  </td>
                                  <td style={{ width: "15%" }}>
                                    {SetDateFormat(item.lastUpdated)}{" "}
                                    {SetTimeFormat(item.lastUpdated)}
                                  </td>
                                  <td style={{ width: "15%" }}>
                                    <div className="status_btn_b">
                                      {item.status === 1 ? (
                                        <div className="sent_btn">SENT</div>
                                      ) : (
                                        <div className="signed_btn">SIGNED</div>
                                      )}
                                    </div>
                                  </td>

                                  <td style={{ width: "5%" }}>
                                    <img
                                      // src="/assets_temp/images/edit.png"
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
                                      <MenuItem onClick={() => this.editPage()}>
                                        Details
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => this.onDownload(key)}
                                      >
                                        Download
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => this.deletePage()}
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
                                  height: "43px",
                                  border: "1px solid #ced4da",
                                  boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                }}
                              >
                                <div style={{ width: "80%", padding: "8px" }}>
                                  <span>{this.state.formDate}</span>
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
                          <div class="lable-text" style={{fontSize:"12px"}}>Document Type</div>

                          <div class="dropdwn" style={{marginLeft:"120px"}}>
                            <SelectBox
                              optionData={this.state.docTypeArr}
                              value={this.state.docTypeData}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onDocChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-1"></div>
                      <div className="col-md-5">
                      <div class="sf-row">
                          <div class="lable-text">Status</div>

                          <div class="dropdwn">
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
              <div className="delete-head">Delete Document</div>
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