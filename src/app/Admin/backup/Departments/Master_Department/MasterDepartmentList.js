import React, { Component } from "react";
import { styled } from "@mui/system"; //imported for modal
import FormControl from "@mui/material/FormControl";

import Menu from "@mui/material/Menu";

import MenuItem from "@mui/material/MenuItem";

import TextField from "@mui/material/TextField";
import history from "../../../../history";
import Stack from "@mui/material/Stack";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import "./Master_Department.css";
import $ from "jquery";
// import { numberValidator } from "../../../../validators";
// import { phoneNumberCheck } from "../../../../services/common-function";
import { AlertMessage, ImageName } from "../../../../enums";
import { InputText } from "../../SharedComponents/inputText";
import { ApiCall } from "../../../../services/middleware";
import { Decoder } from '../../../../services/auth';
import { ToastContainer, toast } from "react-toastify";
import { ErrorCode } from "../../../../services/constant";

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
    borderRadius: 6
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255,255,255,.35)" : "#993921",
    boxSizing: "border-box",
  },
}));

export default class MasterDepartmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: 1,
      total_page: 10,
      limit: 10,
      department: "",
      name: "",
      search: "",
      switch: false,
      anchorEl: null, //menu button
      openModal: false, // open decline modal false
      openfilterModal: false, // open filter modal
      clientName: [], //FOR MULTISELECT client DROPDOWN
      propData: {}, //
      listData: [],
      curIndex: 0,
      formDate: "",
      toDate: ""
    };
  }

  componentDidMount() {

    this.getMasterDetail();
    var ddData = [{
      text: "10",
      value: 10
    }, {
      text: "20",
      value: 20
    }, {
      text: "30",
      value: 30
    }, {
      text: "40",
      value: 40
    }, {
      text: "50",
      value: 50
    }]

    var classInstance = this;
    window.$('.myDropdown').ddslick({
      data: ddData,
      onSelected: function (data) {
        var ddData = window.$('.myDropdown').data('ddslick');
        // console.log("SET>>>", data.selectedData);
        classInstance.setState({
          limit: data.selectedData.value,
          offset: "0"
        });
        classInstance.getMasterDetail();
      }
    });
  }

  getMasterDetail = async () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit)
    }
    let res = await ApiCall("getMasterDepartmentList", data);
    if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let payload = await Decoder.decode(res.data.payload);
      let totalPage = Math.ceil(payload.data.count / this.state.limit);
      this.setState({
        listData: payload.data.details,
        total_page: totalPage
      })
    }
  }

  callbackFunction = (childData) => {
    this.setState({ propData: childData });
  };

  handleMenuClose = () => {
    this.setState({
      check: false,
      anchorEl: null,
    });
  };

  // .................................................
  handleDepartmentChange = async (value) => {
    this.setState({
      department: value
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      search: value
    }
    let res = await ApiCall("getMasterDepartmentList", data);
    if (res.error === 0 && res.respondcode === 200) {
      let payload = await Decoder.decode(res.data.payload);
      let totalPage = Math.ceil(payload.data.count / this.state.limit);
      this.setState({
        listData: payload.data.details,
        total_page: totalPage
      })
    }

  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  handleSearchChange = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  //   ..........add new button.......................
  addNew = () => {
    history.push("/addMasterDepartment");
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
      pathname: "/editDepartment",
      state: this.state.listData[this.state.curIndex],
    });
  };

  /* Delete item */

  deletePage = (item) => {

    window.$("#delete-model").modal("show");
    this.handleMenuClose();

  };

  //........ Confirm Delete .......

  confirmDelete = async() =>{
    let data = {
      id: this.state.listData[this.state.curIndex].id
    }
    
    let res = await ApiCall("deleteMasterDepartmentData", data);
    if (res.error === 0 && res.respondcode === 200) {
      toast.success(AlertMessage.MESSAGE.DEPARTMENT.DELETE_DEPARTMENT_SUCCESS);
      window.$("#delete-model").modal("hide");
      this.getMasterDetail();
    }

  }

  //........ No Delete .......

  cancelDelete = () =>{
    window.$("#delete-model").modal("hide");
  }

  // .............pagination function..........
  clickChange = (e) => {
    this.setState({
      current_page: e.target.value,
    });
  };

  // This is goes to the previous page
  exLeft = async () => {
    this.setState({
      current_page: 1
    });

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0"
    }
    let res = await ApiCall("getMasterDepartmentList", data);
    if (res.error === 0 && res.respondcode === 200) {
      let payload = await Decoder.decode(res.data.payload);
      let totalPage = Math.ceil(payload.data.count / this.state.limit);
      this.setState({
        listData: payload.data.details,
        total_page: totalPage
      })
    }
  };

  // This is goes to the first page
  prev = async () => {
    let currentPage = this.state.current_page;
    if (currentPage > 1) {
      currentPage--;
      this.setState({
        current_page: currentPage,
      });

      let data = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((currentPage - 1) * this.state.limit)
      }
      let res = await ApiCall("getMasterDepartmentList", data);
      if (res.error === 0 && res.respondcode === 200) {
        let payload = await Decoder.decode(res.data.payload);
        let totalPage = Math.ceil(payload.data.count / this.state.limit);
        this.setState({
          listData: payload.data.details,
          total_page: totalPage
        })
      }
    }
  };

  // This is goes to the next page
  next = async () => {
    let currentPage = this.state.current_page;
    let totalPage = this.state.total_page;
    if (currentPage < totalPage) {
      currentPage++;
      this.setState({
        current_page: currentPage,
      });

      let data = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((currentPage - 1) * this.state.limit)
      }
      let res = await ApiCall("getMasterDepartmentList", data);
      if (res.error === 0 && res.respondcode === 200) {
        let payload = await Decoder.decode(res.data.payload);
        let totalPage = Math.ceil(payload.data.count / this.state.limit);
        this.setState({
          listData: payload.data.details,
          total_page: totalPage
        })
      }
    }
  };

  // This is goes to the last page
  exRigth = async () => {
    let totalPage = this.state.total_page;
    this.setState({
      current_page: totalPage,
    });

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit)
    }
    let res = await ApiCall("getMasterDepartmentList", data);
    if (res.error === 0 && res.respondcode === 200) {
      let payload = await Decoder.decode(res.data.payload);
      let totalPage = Math.ceil(payload.data.count / this.state.limit);
      this.setState({
        listData: payload.data.details,
        total_page: totalPage
      })
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
      industryType: arrData[index].industryType,
      department: arrData[index].department,
      status: JSON.stringify(stat)
    }
    let res = await ApiCall("updateMasterDepartment", data);
    if (res.error === 0 && res.respondcode === 200) {

      toast.success(AlertMessage.MESSAGE.DEPARTMENT.UPDATE_DEPARTMENT, { hideProgressBar: true });
      arrData[index].status = stat;
      this.setState({
        listData: arrData,
      });
    } else {
      if (res.error === 1 && res.respondcode === 108) {
        toast.error(AlertMessage.MESSAGE.DEPARTMENT.DUPLICATE_DEPARTMENT, { hideProgressBar: true });
      }
    }
  };

  // For export the data 
  handleExport = () => {
    console.log("ok");
  }

  //shorting asc
  shortAsc = async () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      orderby: "department",
      direc: "ASC"
    }
    let res = await ApiCall("getMasterDepartmentList", data);
    if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let payload = await Decoder.decode(res.data.payload);
      let totalPage = Math.ceil(payload.data.count / this.state.limit);
      this.setState({
        listData: payload.data.details,
        total_page: totalPage
      })
    }
  }

  // short desc
  shortDesc = async () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      orderby: "department",
      direc: "DESC"
    }
    let res = await ApiCall("getMasterDepartmentList", data);
    if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let payload = await Decoder.decode(res.data.payload);
      let totalPage = Math.ceil(payload.data.count / this.state.limit);
      this.setState({
        listData: payload.data.details,
        total_page: totalPage
      })
    }
  }

  onChangeLimit = async (e) => {
    let data = {
      limit: e.target.value,
      offset: JSON.stringify((this.state.current_page - 1) * parseInt(e.target.value))
    }
    let res = await ApiCall("getMasterDepartmentList", data);
    if (res.error === 0 && res.respondcode === 200) {
      let payload = await Decoder.decode(res.data.payload);
      let totalPage = Math.ceil(payload.data.count / parseInt(e.target.value));

      this.setState({
        listData: payload.data.details,
        total_page: totalPage,
        limit: parseInt(e.target.value)
      })
    }
  }

  formDateChange = (e) => {
    this.setState({
      formDate: e.target.value
    })
  }

  toDateChange = (e) => {
    this.setState({
      toDate: e.target.value
    })
  }

  onFilterApply = async () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      searchform: this.state.formDate,
      searchto: this.state.toDate
    };
    let res = await ApiCall("getMasterDepartmentList", data);
    if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let payload = await Decoder.decode(res.data.payload);

      let totalPage = Math.ceil(payload.data.count / this.state.limit);
      this.setState({
        listData: payload.data.details,
        total_page: totalPage,
        formDate: "",
        toDate: ""
      })
    }

  }

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: ""
    })
  }



  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <React.Fragment>
      {/* <div className="wrapper"> */}
        <ToastContainer hideProgressBar />
        {/* <Header />
        <Sidebar /> */}
        <div className="component-wrapper">
          <div className="listing-component-app">
            <div
              className="vendor-info _fl sdw"
              style={{
                boxShadow: "0px 0px 3px 0px rgb(0 0 0 / 23%)",
                borderRadius: "20px",
              }}
            >
              <div className="vn-form _fl">
                <div className="row">
                  <div className="col-md-4">
                    <div className="vn_frm">
                      <span style={{ width: "30%" }}>Departments</span>
                      <InputText placeholder="Search" className="inputfield" value={this.state.department} onTextChange={(value) => { this.handleDepartmentChange(value) }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="table-filter-app-b">
              <div class="filter-btn"><a href="#"
                data-toggle="modal"
                data-target="#create-filter-model">Filter</a></div>
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
                <div class="addnew"><a href="#">
                  Add New{" "}
                  <img
                    className=""
                    src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                    style={{ width: "25px", cursor: "pointer" }}
                    onClick={this.addNew}
                  />
                </a></div>
                <div class="tble-short">
                  <span class="lbl">Display</span>
                  <div class="dropdwn">
                    <select class="myDropdown frm4-select" onChange={this.onChangeLimit}>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-listing-app">
              <div className="table-responsive">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <th style={{ width: "30%" }}>
                      <span style={{fontSize:'13px'}}>Department</span>
                    </th>
                    <th style={{ width: "50%" }}>
                      <div className="sorting_btn">
                        <img src={ImageName.IMAGE_NAME.ARROW_UP} style={{ paddingBottom: '10px', cursor: 'pointer' }} onClick={this.shortAsc} />
                        <img src={ImageName.IMAGE_NAME.ARROW_DOWN} onClick={this.shortDesc} style={{ cursor: 'pointer' }} />
                      </div>
                      <span style={{fontSize:'13px'}}>Sub department[s]</span>
                    </th>
                    <th style={{ width: "6%" }}><span style={{fontSize:'13px'}}>Status</span></th>
                    <th style={{ width: "10%" }}><span style={{fontSize:'13px'}}>Action</span></th>
                  </tr>
                  {this.state.listData.map((item, key) => (
                    <tr>
                      <td colspan="10">
                        <div className="tble-row">
                          <table
                            width="100%"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                          >
                            <tr>
                              <td style={{ width: "30%" }}>
                                {item.department}
                              </td>
                              <td style={{ width: "50%" }}>
                                {item.sub}
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
                                    <AntSwitch
                                      defaultChecked={item.status == 1 ? true : false}
                                      inputProps={{
                                        "aria-label": "ant design",
                                      }}
                                      name="active"
                                      onClick={() => this.onStatusChange(key)}
                                    />
                                  </Stack>
                                  <FormHelperText style={{ textAlign: "center", fontSize: "8px" }}>
                                    {item.status == 1 ? "ACTIVE" : "INACTIVE"}
                                  </FormHelperText>
                                </FormControl>
                              </td>
                              <td style={{ width: "10%" }}>
                                <img
                                  src={ImageName.IMAGE_NAME.EDIT_SQUARE}
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
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    data-toggle="modal"
                                    // data-target="#delete-model"
                                    onClick={() => this.deletePage(item)}
                                  >
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
            <div class="table-filter-app-b" style={{paddingTop:"2%"}}>
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
                <div class="tble-short">
                  <span class="lbl">Display</span>
                  <div class="dropdwn">
                    <select class="myDropdown frm4-select" onChange={this.onChangeLimit}>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ..................Filter modal................................. */}
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
                <div class="reset-btn-dp">
                  <button class="reset">
                    <img src={ImageName.IMAGE_NAME.RESET_BTN} onClick={this.onResetFilter} />
                    Reset
                  </button>
                  <button class="apply" data-dismiss="modal">
                    <img src={ImageName.IMAGE_NAME.BLUE_TICK} onClick={this.onFilterApply} />
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ..................Delete modal................................. */}
        <div
          id="delete-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="modal-body">
                {/* <div className="model-info f-model"> */}
                  <div className="form-search-app">
                    <center><h6>Are you really want to delete the record? </h6></center>
                      <div className="row">
                        <div className="col-md-4"></div>
                        <div class="_button-style _fl text-center" style={{marginTop:"2%"}}>
                          <a
                            className="white-btn"
                            style={{ textDecoration: "none" }}
                            onClick={this.cancelDelete}
                          >
                            No
                          </a>
                          <a
                            className="blue-btn"
                            style={{ textDecoration: "none" }}
                            onClick={this.confirmDelete}
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
      {/* </div> */}
      </React.Fragment>
    );
  }
}
