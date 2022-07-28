import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { ImageName } from "../../../../enums";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../../SharedComponents/inputText";
import history from "../../../../history";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  consoleLog,
  getLookUpDataFromAPI,
} from "../../../../services/common-function";
import { ApiCall } from "../../../../services/middleware";
import { Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { MESSAGE } from "../../../../enums/alert-message";
import { Link } from "react-router-dom";

export default class RoleList extends React.Component {
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
      roleName: "",
      formDate: "",
      toDate: "",
      declineMessage: "",
      allUserType: [],
      selectedUserTypes: {},
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      userType: "",
      isActive: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    // var ddData = [
    //   {
    //     text: "10",
    //     value: 10,
    //   },
    //   {
    //     text: "20",
    //     value: 20,
    //   },
    //   {
    //     text: "30",
    //     value: 30,
    //   },
    //   {
    //     text: "40",
    //     value: 40,
    //   },
    //   {
    //     text: "50",
    //     value: 50,
    //   },
    // ];

    var classInstance = this;
    // window.$(".myDropdown").ddslick({
    //   data: ddData,
    //   onSelected: function (data) {
    //     classInstance.setState({
    //       limit: data.selectedData.value,
    //       offset: "0",
    //     });
    //     // classInstance.load();
    //   },
    // });
    var filterModal = document.getElementById("create-filter-model");

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === filterModal) {
        classInstance.closeModal();
      }
    };
    this.load();
  }

  load = async () => {
    var lookUpData = await getLookUpDataFromAPI();
    // console.log("lookupData>>>>", lookUpData);
    let arr = [];
    lookUpData.USER_TYPE.map((data) => {
      arr.push({
        label: data.name,
        value: data.id,
      });
    });

    this.setState({
      allUserType: arr,
    });

    let data = {
      limit: this.state.limit.toString(),
      offset: this.state.offset.toString(),
    };

    this.listApi(data);
  };

  listApi = async (data) => {
    var res = await ApiCall("getRoleList", data);
    var listArr = [];
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(res.data.payload);
      // console.log("Listdata>>>", payload);
      let respObject = payload.data;
      listArr = respObject.details;
    }
    if (listArr && listArr.length > 0) {
      this.setState({
        listData: listArr,
      });
    } else {
      this.setState({
        listData: [],
      });
    }
  };

  onNameChange = (value) => {
    this.setState({
      roleName: value,
    });
    let data = {
      roleName: value,
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom: "",
      roleTypeId: "",
    };
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
      roleName: this.state.roleName,
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom: "",
      roleTypeId: "",
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
      roleName: this.state.roleName,
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom: "",
      roleTypeId: "",
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

      let data = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((currentPage - 1) * this.state.limit),
        roleName: this.state.roleName,
        direc: "",
        orderby: "",
        searchto: "",
        searchfrom: "",
        roleTypeId: "",
      };
      this.listApi(data);
    }
  };
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
        roleName: this.state.roleName,
        direc: "",
        orderby: "",
        searchto: "",
        searchfrom: "",
        roleTypeId: "",
      };
      this.listApi(data);
    }
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

  openFilterModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("create-filter-model").style.display = "block";
    document.getElementById("create-filter-model").classList.add("show");
  };

  closeModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("create-filter-model").style.display = "none";
    document.getElementById("create-filter-model").classList.remove("show");
  };

  //............ Delete Modal Functionalities..........

  openDeleteModal = () => {
    this.handleMenuClose();
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("delete-modal").style.display = "block";
    document.getElementById("delete-modal").classList.add("show");
  };

  closeDeleteModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("delete-modal").style.display = "none";
    document.getElementById("delete-modal").classList.remove("show");
  };

  // .............filter modal function...................

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

  filterStatusChange = (value) => {
    this.setState({
      selectedUserTypes: value,
      userType: value.value,
    });
  };

  onFilterApply = () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      roleName: this.state.roleName,
      direc: "",
      orderby: "",
      roleTypeId: this.state.userType,
      searchto: this.state.toDate,
      searchfrom: this.state.formDate,
    };
    // console.log("Filter data", data)
    this.closeModal();

    this.listApi(data);

    this.setState({
      formDate: "",
      toDate: "",
      selectedUserTypes: {
        label: "",
        value: "",
      },
      userType: "",
    });
  };

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: "",
      selectedUserTypes: {
        label: "",
        value: "",
      },
      userType: "",
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
    });
    this.closeModal();

    let data = {
      limit: this.state.limit.toString(),
      offset: this.state.offset.toString(),
    };

    this.listApi(data);
  };

  //   ..........add new button.......................
  addNew = () => {
    return history.push("/adminPermissionAdd");
  };

  editPage = (item) => {
    this.props.history.push({
      pathname: "/adminPermissionEdit",
      state: this.state.listData[this.state.curIndex],
    });
  };

  deleteRole = async () => {
    this.closeDeleteModal();
    let data = {
      id: this.state.listData[this.state.curIndex].id,
    };

    // consoleLog("Data", data);

    let res = await ApiCall("deleteRole", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(MESSAGE.ROLE.DELETE_ROLE_SUCCESS);
      this.load();
    }
  };
  //........Page show Limit.........

  onChangeLimit = (dat) => {
    this.setState({
      limit: parseInt(dat.value),
      selectedDisplayData: dat,
    });

    let data = {
      limit: dat.value,
      offset: JSON.stringify(
        (this.state.current_page - 1) * parseInt(dat.value)
      ),
    };

    this.listApi(data);
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    const selectedStatus = this.state.selectedUserTypes;
    return (
      <React.Fragment>
        <ToastContainer hideProgressBar={true} theme="colored" />
        <div className="component-wrapper">
          <div className="listing-component-app">
          <div
              className="vn_frm"
              style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
            >
              {" "}
              <Link to="/adminDashboard">Dashboard</Link> / Roles & Permission
            </div>
            <div className="vendor-info _fl sdw">
              <div className="vn-form _fl">
                <div className="row">
                  <div className="col-md-4">
                    <div className="vn_frm">
                      {" "}
                      <span>Role Name</span>
                      <InputText
                        type="text"
                        value={this.state.roleName}
                        placeholder="Search"
                        className="inputfield"
                        onTextChange={(value) => {
                          this.onNameChange(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="table-filter-app-b">
              <div class="filter-btn">
                <a
                  href="#"
                  // data-toggle="modal"
                  // data-target="#create-filter-model"
                  onClick={() => {
                    this.openFilterModal();
                  }}
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
              <div class="table-filter-box">
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
                <div class="tble-short">
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

            <div className="table-listing-app md4">
              <div className="table-responsive">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <th style={{ width: "10%" }}>Role Name</th>
                    <th style={{ width: "10%" }}>User Type</th>
                    <th style={{ width: "5%" }}>Action</th>
                  </tr>
                  {this.state.listData.length > 0 ? (
                    <React.Fragment>
                      {this.state.listData.map((data, key) => (
                        <tr style={{ textAlign: "center" }}>
                          <td colspan="11">
                            <div className="tble-row">
                              <table
                                width="100%"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tr>
                                  <td style={{ width: "10%" }}>
                                    {data.roleName}
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    {data.userType}
                                  </td>
                                  <td style={{ width: "5%" }}>
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
                                        onClick={() => this.editPage(data)}
                                      >
                                        Edit
                                      </MenuItem>
                                      <MenuItem onClick={this.openDeleteModal}>
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
                        <td colSpan="7">
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
          </div>
        </div>

        {/* ..................modal................................. */}
        <div
          id="create-filter-model"
          class="modal fade modelwindow"
          role="dialog"
        >
          <div class="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div class="modal-content">
              <div class="filter-head _fl mdf">
                <h3>Filter by</h3>
                <div class="reset-btn-dp">
                  <button class="reset">
                    <img
                      src={ImageName.IMAGE_NAME.RESET_BTN}
                      onClick={this.onResetFilter}
                    />
                    Reset
                  </button>
                  <button class="apply" data-dismiss="modal">
                    <img
                      src={ImageName.IMAGE_NAME.BLUE_TICK}
                      onClick={this.onFilterApply}
                    />
                    Apply
                  </button>
                </div>
              </div>

              <div class="modal-body">
                <div class="model-info f-model">
                  <div class="form-search-app">
                    <div class="lable-text">requested on</div>
                    <div class="form-field-app">
                      <span>from</span>
                      <input
                        type="date"
                        class="datefield bd"
                        placeholder="10/25/2021"
                        value={this.state.formDate}
                        onChange={this.formDateChange}
                      />
                    </div>
                    <div class="form-field-app">
                      <span>to</span>
                      <input
                        type="date"
                        class="datefield bd"
                        placeholder="10/25/2021"
                        value={this.state.toDate}
                        onChange={this.toDateChange}
                      />
                    </div>
                  </div>
                  <div class="m-select _fl">
                    <div class="row">
                      <div class="col-md-8">
                        <div class="sf-row">
                          <div
                            class="lable-text"
                            style={{
                              paddingLeft: "10px",
                              fontSize: "16px",
                            }}
                          >
                            User Type
                          </div>
                          <div
                            class="dropdwn"
                            style={{ marginLeft: "25%", width: "59%" }}
                          >
                            <SelectBox
                              value={selectedStatus}
                              optionData={this.state.allUserType}
                              placeholder=""
                              onSelectChange={this.filterStatusChange}
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

        {/* ..................Delete modal................................. */}
        <div id="delete-modal" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-md modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="modal-body">
                {/* <div className="model-info f-model"> */}
                <div className="form-search-app">
                  <center>
                    <h6>Are you really want to delete the role? </h6>
                  </center>
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
                        onClick={this.closeDeleteModal}
                      >
                        No
                      </a>
                      <a
                        href="javascript:void(0)"
                        className="blue-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.deleteRole}
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

        <div
          class="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}
