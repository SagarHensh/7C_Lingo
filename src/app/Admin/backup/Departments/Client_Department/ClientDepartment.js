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
import "./ClientDepartment.css";

import { AlertMessage, ImageName } from "../../../../enums";
import { InputText } from "../../SharedComponents/inputText";
import { ApiCall } from "../../../../services/middleware";
import { Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { ToastContainer, toast } from "react-toastify";


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

export default class ClientDepartment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      current_page: 1,
      total_page: 10,
      limit: 10,
      display: "",
      department: "",
      switch: false,
      anchorEl: null, //menu button
      openModal: false, // open decline modal false
      listData: [],
      curIndex: 0,
      formDate: "",
      toDate: "",
      filterClient: "",
      filterSubDept: ""
    };
  }

  componentDidMount() {
    // window.$(".myDropdown").ddslick();
    window.scrollTo(0, 0);
    this.load();
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
        classInstance.load();
      }
    });
  }

  load = async () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit)
    }
    this.listApi(data);

    // for dept
    let activeDepartment = [];
    let activeDept = await ApiCall("fetchActiveMasterDepartment");
    if (activeDept.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && activeDept.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      activeDepartment = Decoder.decode(activeDept.data.payload);
      var dept = [{
        text: "None",
        value: ""
      }];
      for (let j = 0; j < activeDepartment.data.length; j++) {
        dept.push({
          text: activeDepartment.data[j].department,
          value: activeDepartment.data[j].id
        })
      }
      var curClassInst = this;
      window.$("#myDropdown_14").ddslick({
        data: dept,
        onSelected: function (data) {
          curClassInst.setState({ filterSubDept: data.selectedData.value });
        }
      });
    }

    // for client
    var client = [{
      text: "None",
      value: ""
    }];
    let selectClientId = "";
    for (let j = 0; j < CommonData.COMMON.CLIENT.length; j++) {
      client.push({
        text: CommonData.COMMON.CLIENT[j].name,
        value: CommonData.COMMON.CLIENT[j].id,
      })
    }

    var classInstance = this;
    window.$("#myDropdown_13").ddslick({
      data: client,
      onSelected: function (data) {
        selectClientId = data.selectedData.value;
        classInstance.setState({ filterClient: data.selectedData.value });
      }
    });
  }

  listApi = async (data) => {
    const res = await ApiCall("fetchClientDepartment", data);
    if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {

      const decodeData = Decoder.decode(res.data.payload);
      // console.log("Payload data>>>", decodeData);
      let totalPage = Math.ceil(decodeData.data.count / this.state.limit);
      // console.log("Total Page>>>", totalPage);
      this.setState({
        listData: decodeData.data.details,
        total_page: totalPage
      })
    }

  }

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
  handleDepartmentChange = (value) => {
    this.setState({
      department: value,
    });

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      search: value
    }

    this.listApi(data);

  };

  //   ..........add new button.......................
  addNew = () => {
    return history.push("/addClientDepartment");
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
      pathname: "/editClientdetails",
      state: this.state.listData[this.state.curIndex]
    });
  };

  /* Delete item */

  deletePage = () => {

    window.$("#delete-model").modal("show");
    this.handleMenuClose();

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
      offset: "0"
    }
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
      offset: JSON.stringify((totalPage - 1) * this.state.limit)
    }
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
        offset: JSON.stringify((currentPage - 1) * this.state.limit)
      }
      this.listApi(data)
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
        offset: JSON.stringify((currentPage - 1) * this.state.limit)
      }
      this.listApi(data);
    }
  };

  // ................status func...................
  onStatusChange = async (index) => {
    let arrData = this.state.listData;
    let stat = "0";
    if (arrData[index].status === 0) {
      stat = "1";
    } else {
      stat = "0";
    }

    let data = {
      id: this.state.listData[index].id,
      status : stat
    }
    
    let res = await ApiCall("clientdepartmentstatusupdate", data);
    if (res.error === 0 && res.respondcode === 200) {
      this.load();
      toast.success(AlertMessage.MESSAGE.UPDATE_STATUS.SUCCESS);
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
      direc: "ASC"
    }

    this.listApi(req);
  }

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
      search: this.state.department,
      orderby: filter,
      direc: "DESC"
    }

    this.listApi(req);
  }

  //........Page show Limit.........

  onChangeLimit = (e) => {
    this.setState({
      limit: parseInt(e.target.value)
    })

    let data = {
      limit: e.target.value,
      offset: JSON.stringify((this.state.current_page - 1) * parseInt(e.target.value))
    }

    this.listApi(data);
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

  onFilterApply = () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      searchto: this.state.toDate,
      searchfrom: this.state.formDate,
      searchclientid: this.state.filterClient,
      searchsubid: this.state.filterSubDept
    };

    // window.$("#create-filter-model").modal("hide");
    // console.log("Filter data", data)

    this.listApi(data);

    this.setState({
      formDate: "",
      toDate: ""
    });

  }

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: ""
    })
  }



  //........ No Delete .......

  cancelDelete = () =>{
    window.$("#delete-model").modal("hide");
  }

  //........ Confirm Delete .......

  confirmDelete = async() =>{
    let data = {
      id: this.state.listData[this.state.curIndex].id,
      status : "2"
    }
    
    let res = await ApiCall("clientdepartmentstatusupdate", data);
    if (res.error === 0 && res.respondcode === 200) {
      toast.success(AlertMessage.MESSAGE.DEPARTMENT.DELETE_DEPARTMENT_SUCCESS);
      window.$("#delete-model").modal("hide");
      this.load();
    }

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
                boxShadow: "  0px 0px 3px 0px rgb(0 0 0 / 23%)",
                borderRadius: "20px",
              }}
            >
              <div className="vn-form _fl"></div>
              <div className="vn-form _fl">
                <div className="row">
                  <div className="col-md-4">
                    <div className="vn_frm">
                      <span style={{ width: "30%" }}>Departments</span>
                      <InputText
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.department}
                        onTextChange={(value) => {
                          this.handleDepartmentChange(value);
                        }}
                      />
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
                <div class="export-btn">
                  {/* <a href="#">
                  Export{" "}
                  <img
                    src={ImageName.IMAGE_NAME.EXPORT_BTN}
                    style={{ width: "25px", cursor: 'pointer' }}
                    onClick={this.handleExport} />
                </a> */}
                </div>
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
                    <th style={{ width: "10%" }}>
                      <div class="sorting_btn">
                        <button class="t1" onClick={() => this.ascOrder("department")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button class="t1" onClick={() => this.descOrder("department")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div>
                      Department
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
                      Sub department[s]
                    </th>
                    <th style={{ width: "20%" }}>
                      <div class="sorting_btn">
                        <button class="t1" onClick={() => this.ascOrder("location")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button class="t1" onClick={() => this.descOrder("location")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div>
                      Location
                    </th>
                    {/* <th style={{ width: "8%" }}>
                      <div class="sorting_btn">
                        <button class="t1" onClick={() => this.ascOrder("clientId")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button class="t1" onClick={() => this.descOrder("clientId")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div>
                      Client ID
                    </th> */}
                    <th style={{ width: "15%" }}>
                      <div class="sorting_btn">
                        <button class="t1" onClick={() => this.ascOrder("client")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button class="t1" onClick={() => this.descOrder("client")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div>
                      Client
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
                      <div class="sorting_btn">
                        <button class="t1" onClick={() => this.ascOrder("supervisor")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button class="t1" onClick={() => this.descOrder("supervisor")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div>
                      Supervisor
                    </th>
                    <th style={{ width: "10%" }}>Status</th>
                    <th style={{ width: "5%" }}>Action</th>
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
                              <td style={{ width: "10%" }}>
                                {item.department}
                              </td>
                              <td style={{ width: "20%" }}>
                                {item.subdepartment}
                              </td>
                              <td style={{ width: "20%" }}>{item.location}</td>
                              {/* <td style={{ width: "8%" }}>{item.clientId}</td> */}
                              <td style={{ width: "15%" }}>{item.name}</td>
                              {/* <td style={{ width: "10%" }}>{item.user}</td> */}
                              <td style={{ width: "10%" }}>
                                {item.user}
                              </td>
                              <td style={{ width: "10%" }}>
                                <FormControl
                                  component="fieldset"
                                  variant="standard"
                                >
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                  >
                                  {item.status === 1 ?
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
                                    /> :
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
                                    />}
                                  </Stack>
                                  <FormHelperText style={{ textAlign: "center", fontSize: "8px" }}>
                                    {item.status === 1 ? "ACTIVE" : "INACTIVE"}
                                  </FormHelperText>
                                </FormControl>
                              </td>

                              <td style={{ width: "5%" }}>
                                <img
                                  // src="/assets_temp/images/edit.png"
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
                                    onClick={() => this.deletePage()}
                                  >
                                    Delete
                                  </MenuItem>
                                </Menu>

                                {/* <div className="tbl-editing-links ">
                                  <button className="tr-toggle">
                                    <img
                                      src="/assets_temp/images/edit.png"
                                      style={{
                                        width: "35px",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </button>

                                  <div className="tbl-drop-links">
                                    <ul>
                                      <li>
                                        <a
                                          style={{ textDecoration: "none" }}
                                          onClick={() => this.editPage(item)}
                                        >
                                          Edit
                                        </a>
                                      </li>

                                      <li>
                                        <a
                                          style={{ textDecoration: "none" }}
                                          onClick={() => this.editPage(item)}
                                        >
                                          Delete
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div> */}
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* <tr>
                    <td colspan="10">
                      <div className="tble-row">
                        <table
                          width="100%"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                        >
                          <tr>
                            <td style={{ width: "20%" }}>4</td>
                            <td style={{ width: "20%" }}>Agency</td>
                            <td style={{ width: "20%" }}>Will</td>

                            <td style={{ width: "20%" }}>
                              <a href="#" className="declined_btn">
                                Declined
                              </a>
                            </td>
                            <td style={{ width: "20%" }}>
                              <a href="#">
                                <img src="images/eye-icon.jpg" />
                              </a>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr> */}
                  `
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
                  <button class="reset" data-dismiss="modal">
                    <img src={ImageName.IMAGE_NAME.RESET_BTN} onClick={this.onResetFilter} />
                    Reset
                  </button>
                  <button class="apply" data-dismiss="modal">
                    <img src={ImageName.IMAGE_NAME.BLUE_TICK} onClick={this.onFilterApply} />
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
                      <div class="col-md-6">
                        <div class="sf-row">
                          <div class="lable-text">Client</div>
                          <div class="dropdwn">
                            <select class="frm4-select" id="myDropdown_13">
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="sf-row">
                          <div class="lable-text">Sub-Department[s]</div>
                          <div class="dropdwn" style={{ marginLeft: "145px" }}>
                            <select class="frm4-select" id="myDropdown_14">
                            </select>
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
                    <div class="_button-style _fl text-center" style={{ marginTop: "2%" }}>
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
