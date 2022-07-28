import React, { Component } from "react";
import { styled, Box } from "@mui/system"; //imported for modal
import FormControl from "@mui/material/FormControl";
import history from "../../../../history";
import Stack from "@mui/material/Stack";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import "./ServiceCategoryList.css";
import { AlertMessage, ImageName } from "../../../../enums";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../../SharedComponents/inputText";
import { ApiCall } from "../../../../services/middleware";
import { Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import {
  consoleLog,
  SetDateFormat,
  SetScheduleDate,
  SetTimeFormat,
  SetUSAdateFormat,
} from "../../../../services/common-function";
import { toast, ToastContainer } from "react-toastify";
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


export default class ServiceCategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      current_page: 1,
      total_page: 10,
      limit: 20,
      display: "",
      serviceCategory: "",
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
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit), //starting index of page
      orderby: "",
      direc: "",
      status:"",
      name:"",
      searchfrom:"",
      searchto:""
    };

    this.listApi(data);
  };

  listApi = async (data) => {
    const res = await ApiCall("fetchServiceList", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);

      let totalPage = Math.ceil(decodeData.data.count / this.state.limit);
      // consoleLog("data:::", decodeData.data);
      if (decodeData.data.details && decodeData.data.details.length > 0) {
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
    });
  };

  // ....................Searching.............................
  handleServiceCategoryChange = (value) => {
    this.setState({
      serviceCategory: value,
    });

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: value,
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      
    };
    this.listApi(data);
  };

  //   ..........add new button.......................
  addNew = () => {
    return history.push("/adminAddServiceCategory");
  };

  //................funct for menuBtn on click................
  menuBtnhandleClick = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl: event.currentTarget,
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

  editPage = (index) => {
    this.props.history.push({
      pathname: "/adminEditServiceCategory",
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
    let stat = 2;
    // window.$("#delete-modal").modal("hide");
    this.closeDeleteModal();
    let data = {
      id: this.state.workingId,
      status: stat.toString(),
    };
    let status = await ApiCall("changeStatusService", data);
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
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      name:this.state.serviceCategory
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
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      name:this.state.serviceCategory
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
        orderby: "",
      direc: "",
        searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
        searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
        name:this.state.serviceCategory
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
        orderby: "",
      direc: "",
        searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
        searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
        name:this.state.serviceCategory
      };
      this.listApi(data);
    }
  };

  // ................status func...................
  onStatusChange = async (index) => {
    let arrData = this.state.listData;
    let stat = 0;
   
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
      if (arrData[index].status === 0) {
        stat = 1;
        arrData[index].status = 1;
      } else {
        stat = 0;
        arrData[index].status = 0;
      }
      this.setState({
        listData: arrData,
      });
    } else {
      toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
      if (arrData[index].status === 0) {
        stat = 0;
        arrData[index].status = 0;
      } else {
        stat = 1;
        arrData[index].status = 1;
      }
      this.setState({
        listData: arrData,
      });
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
      orderby: "",
      direc: "",
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
      orderby: "",
      direc: "",
      orderby: filter,
      direc: "DESC",
    };

    this.listApi(req);
  };

  //........Page show Limit.........

  onChangeLimit = (dat) => {
    this.setState({
      limit: parseInt(dat.value),
      selectedDisplayData:dat,
      current_page:1
    });

    let data = {
      limit: dat.value,
      offset: "0",
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      name:this.state.serviceCategory
    };

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
  statusTypeChange = (dat) => {
    this.setState({
      selectedStatus: dat,
    });
  };

  onFilterApply = () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      orderby: "",
      direc: "",
      searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      status: this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      name:this.state.serviceCategory
    };

    // window.$("#create-filter-model").modal("hide");
    this.closeFilterModal();

    this.listApi(data);

    this.setState({
     
      current_page: 1,
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
      selectedStatus:{},
      current_page: 1,
    });
    this.closeFilterModal();

    this.load();
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <React.Fragment>
        {/* <div className="wrapper">
        <Header /> */}
        <ToastContainer hideProgressBar theme="colored"/>
        {/* <Sidebar /> */}
        <div className="component-wrapper">
          <div className="listing-component-app">
          <div
              className="vn_frm"
              style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
            >
              {" "}
              <Link to="/adminDashboard">Dashboard</Link> / Service Category
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
                        Service Category
                      </span>
                      <InputText
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.serviceCategory}
                        style={{ color: "#9f8f93" }}
                        onTextChange={(value) => {
                          this.handleServiceCategoryChange(value);
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
                    <th style={{ width: "15%" }}>Service Category</th>
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
                    <th style={{ width: "20%" }}>
                      <div className="sorting_btn">
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
                      </div>
                      Created By
                    </th>

                    <th style={{ width: "15%" }}>
                      <div className="sorting_btn">
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
                      </div>
                      Last Modified On
                    </th>

                    <th style={{ width: "10%" }}>Status</th>
                    <th style={{ width: "10%" }}>Action</th>
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
                                  <td style={{ width: "15%" }}>{item.name}</td>
                                  {/* <td style={{ width: "15%" }}>{item.service}</td> */}
                                  <td style={{ width: "20%" }}>
                                    {item.createdBy}
                                  </td>
                                  <td style={{ width: "15%" }} id="date-td">
                                    {SetDateFormat(item.lastUpdated)}{" "}
                                    {SetTimeFormat(item.lastUpdated)}
                                  </td>
                                  <td style={{ width: "10%" }} id="one-text-td">
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

                                  <td
                                    style={{ width: "10%" }}
                                    className="service-category-edit-del"
                                  >
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
                    <div className="lable-text">Last modified on</div>
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

        <div id="delete-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-md modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content" style={{ padding: "10px" }}>
              <div className="delete-head">Delete Category</div>
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
