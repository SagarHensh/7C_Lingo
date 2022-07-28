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
import { InputText } from "../../SharedComponents/inputText";
import { ApiCall } from "../../../../services/middleware";
import { Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import {
  SetDateFormat,
  SetTimeFormat,
} from "../../../../services/common-function";
import { toast, ToastContainer } from "react-toastify";

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

export default class ServiceCategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      current_page: 1,
      total_page: 10,
      limit: 10,
      display: "",
      serviceCategory: "",
      anchorEl: null, //menu button
      openModal: false, // open decline modal false
      // listData: [],
      curIndex: 0,
      workingId: 0,
      formDate: "",
      toDate: "",

      listData: [],
    };
  }

  componentDidMount() {
    // window.$(".myDropdown").ddslick();
    window.scrollTo(0, 0);
    this.load();
    var ddData = [
      {
        text: "10",
        value: 10,
      },
      {
        text: "20",
        value: 20,
      },
      {
        text: "30",
        value: 30,
      },
      {
        text: "40",
        value: 40,
      },
      {
        text: "50",
        value: 50,
      },
    ];

    var classInstance = this;
    window.$(".myDropdown").ddslick({
      data: ddData,
      onSelected: function (data) {
        var ddData = window.$(".myDropdown").data("ddslick");

        classInstance.setState({
          limit: data.selectedData.value,
          offset: "0",
        });
        classInstance.load();
      },
    });
  }

  load = async () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit), //starting index of page
      orderby: "",
      direc: "",
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

      this.setState({
        listData: decodeData.data.details,
        total_page: totalPage,
      });
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
    window.$("#delete-modal").modal("show");
  };
  deleteItem = async () => {
    let stat = 2;
    window.$("#delete-modal").modal("hide");
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
    window.$("#delete-modal").modal("hide");
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

  onChangeLimit = (e) => {
    this.setState({
      limit: parseInt(e.target.value),
    });

    let data = {
      limit: e.target.value,
      offset: JSON.stringify(
        (this.state.current_page - 1) * parseInt(e.target.value)
      ),
    };

    this.listApi(data);
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
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      searchto: this.state.toDate,
      searchfrom: this.state.formDate,
      // searchclientid: this.state.filterClient,
      // searchsubid: this.state.filterSubDept,
    };

    // window.$("#create-filter-model").modal("hide");

    this.listApi(data);

    this.setState({
      formDate: "",
      toDate: "",
    });
  };

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: "",
    });
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <React.Fragment>
        {/* <div className="wrapper">
        <Header /> */}
        <ToastContainer hideProgressBar />
        {/* <Sidebar /> */}
        <div className="component-wrapper">
          <div className="listing-component-app">
            <div id="vendor-info-cont"
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
                <a
                  href="#"
                  data-toggle="modal"
                  data-target="#create-filter-model"
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
                <div className="addnew">
                  <a href="#">
                    Add New{" "}
                    <img
                      className=""
                      src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                      style={{ width: "25px", cursor: "pointer" }}
                      onClick={this.addNew}
                    />
                  </a>
                </div>
                <div className="tble-short">
                  <span className="lbl">Display</span>
                  <div className="dropdwn">
                    <select
                      className="myDropdown frm4-select"
                      onChange={this.onChangeLimit}
                    ></select>
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
                              <td style={{ width: "20%" }}>{item.createdBy}</td>
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
                                        onClick={() => this.onStatusChange(key)}
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
                                        onClick={() => this.onStatusChange(key)}
                                      />
                                    )}
                                  </Stack>
                                  <FormHelperText
                                    style={{
                                      textAlign: "center",
                                      fontSize: "8px",
                                    }}
                                  >
                                    {item.status === 1 ? "ACTIVE" : "INACTIVE"}
                                  </FormHelperText>
                                </FormControl>
                              </td>


                              <td style={{ width: "10%" }} className="service-category-edit-del">
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
                  <span className="lbl service-categ-botm-disp-text">Display</span>
                  <div className="dropdwn">
                    <select
                      className="myDropdown frm4-select"
                      onChange={this.onChangeLimit}
                    ></select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ..................modal................................. */}
        <div
          id="create-filter-model"
          className="modal fade modelwindow"
          role="dialog"
        >
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

        <div id="delete-modal" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg">
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
