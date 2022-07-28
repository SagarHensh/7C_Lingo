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
import { InputText } from "../../SharedComponents/inputText";
import { ApiCall } from "../../../../services/middleware";
import { Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { nameRegexValidator } from "../../../../validators";
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

export default class DocumentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      current_page: 1,
      total_page: 10,
      limit: 10,
      display: "",
      docName: "",
      switch: false,
      anchorEl: null, //menu button
      openModal: false, // open decline modal false
      // listData: [],
      curIndex: 0,
      formDate: "",
      toDate: "",
      filterDocType: 0,
      workingId: 0,
      listData: [],
      docArrData: [],
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
      name: this.state.docName,
      direc: "",
      orderby: "",
      documenttypeid: this.state.filterDocType,
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
    };

    this.listApi(data);

    const res = await ApiCall("fetchdocumentlist", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      let docResData = payload.data.documentlist;

      this.setState({
        docArrData: docResData,
      });
    }
    // if (
    //   activeDept.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   activeDept.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {
    //   activeDepartment = Decoder.decode(activeDept.data.payload);
    //   var dept = [
    //     {
    //       text: "None",
    //       value: "",
    //     },
    //   ];
    //   for (let j = 0; j < activeDepartment.data.length; j++) {
    //     dept.push({
    //       text: activeDepartment.data[j].department,
    //       value: activeDepartment.data[j].id,
    //     });
    //   }
    //   var curClassInst = this;
    //   window.$("#myDropdown_14").ddslick({

    let docTypeArr = [{ text: "None", value: "" }];
    this.state.docArrData.map((data) => {
      docTypeArr.push({
        text: data.documenttype,
        value: data.documentTypeId,
      });
    });
    let docTypeId = "";
    var classInstance = this;
    window.$("#myDropdown_docType").ddslick({
      data: docTypeArr,
      onSelected: function (data) {
        var ddData = window.$(".myDropdown_category").data("ddslick");
        classInstance.setState({
          filterDocType: data.selectedData.value,
        });
      },
    });
  };

  listApi = async (data) => {
    const res = await ApiCall("fetchdocumentlist", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);

      let totalPage = Math.ceil(payload.data.documentcount / this.state.limit);

      let docResData = payload.data.documentlist;
      this.setState({
        listData: payload.data.documentlist,
        total_page: totalPage,
        docArrData: docResData,
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
  handleDocumentChange = (value) => {
    this.setState({
      docName: value,
    });

    let data = {
      direc: "",
      orderby: "",
      documenttypeid: this.state.filterDocType,
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: value,
    };

    this.listApi(data);
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
      filter = "documentType";
    } else if (data === "role") {
      filter = "role";
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
      searchclientid: this.state.filterClient,
      searchsubid: this.state.filterSubDept,
    };

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
  // ..................delete function........................
  deletePage = () => {
    this.setState({
      // listData: listArrData,
      workingId: this.state.listData[this.state.curIndex].id,
      anchorEl: false,
    });
    window.$("#delete-modal").modal("show");
  };
  onCancel = () => {
    window.$("#delete-modal").modal("hide");
  };

  deleteItem = async () => {
    let data = {
      documentid: this.state.workingId,
    };
    window.$("#delete-modal").modal("hide");
    let status = await ApiCall("deletedocument", data);
    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.load();
      toast.success(AlertMessage.MESSAGE.DELETE.DELETED);
    }
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <div className="wrapper">
        <Header />
        <ToastContainer hideProgressBar />
        <Sidebar />
        <div className="component-wrapper">
          <div className="listing-component-app">
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
                        Name
                      </span>
                      <InputText
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.docName}
                        onTextChange={(value) => {
                          this.handleDocumentChange(value);
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
                      <div class="sorting_btn">
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
                      </div>
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
                              <td style={{ width: "10%" }}>{item.version}</td>
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
                                  <MenuItem onClick={() => this.editPage()}>
                                    Details
                                  </MenuItem>
                                  <MenuItem>Download</MenuItem>
                                  <MenuItem onClick={() => this.deletePage()}>
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
                </table>
              </div>
            </div>
            <div className="table-filter-app-b" style={{paddingTop:"2%"}}>
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
                    <div class="row">
                      <div class="col-md-3" style={{ textAlign: "center" }}>
                        <div class="lable-text">Document Type</div>
                      </div>
                      <div className="col-md-5">
                        <div class="dropdwn">
                          <select
                            class="myDropdown_docType frm4-select"
                            id="myDropdown_docType"
                          ></select>
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
      </div>
    );
  }
}
