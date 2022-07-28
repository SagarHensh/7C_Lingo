import React, { Component } from "react";
import { styled, Box } from "@mui/system"; //imported for modal
import ModalUnstyled from "@mui/core/ModalUnstyled"; //imported forr modal
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Menu from "@mui/material/Menu";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import history from "../../../history";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { AlertMessage, ImageName } from "../../../enums";
import { InputText } from "../SharedComponents/inputText";
import { ApiCall } from "../../../services/middleware";
import { Decoder } from "../../../services/auth";
import { SetDateFormat, SetTimeFormat } from "../../../services/common-function";
import { ErrorCode } from "../../../services/constant";
import { ToastContainer, toast } from "react-toastify";
import './AdminStaff.css';

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
    // transition: theme.transitions.create(["width"], {
    //   duration: 200,
    // }
    // ),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255,255,255,.35)" : "#993921",
    boxSizing: "border-box",
  },
}));

// ..............for filter modal...............................
const filterRoleArr = [
  { id: "INTER", name: "interpretation" },
  { id: "SUB", name: "Subtitling" },
  { id: "VOI", name: "voice over" },
];

export default class AdminStaff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: 1,
      total_page: 10,
      limit: 10,
      records_per_page: 2,
      searchValue: "",
      uname: "",
      emailId: "",
      mobileNo: "",
      display: "",
      filterRoleName: filterRoleArr,
      allRoles: [],
      age: 5, // dropdwn menu age
      anchorEl: null, //menu button
      openModal: false, // open decline modal false
      openfilterModal: false, // open filter modal
      clientName: [], //FOR MULTISELECT client DROPDOWN
      statusName: [], //
      listData: [],
      curIndex: 0,
      formDate: "",
      toDate: "",
      filterRole: "",
      isActive: false,
    };
  }
  // ............................................

  componentDidMount() {
    window.scrollTo(0, 0);
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

    this.load();

  }

  load = () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.uname,
      email: this.state.emailId,
      mobile: this.state.mobileNo,
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: ""
    }

    this.listApi(data);
    this.roleApi();

  }

  roleApi = async () => {
    const res = await ApiCall("getroles");
    const decodeData = Decoder.decode(res.data.payload);

    let arr = [{
      text: "None",
      value: 0
    }]

    decodeData.data.map((data) => {
      arr.push({
        text: data.rolename,
        value: data.id
      })
    });

    var classInstance = this;
    window.$('.myDropdown_2').ddslick({
      data: arr,
      onSelected: function (data) {
        var ddData = window.$('.myDropdown_2').data('ddslick');
        classInstance.setState({
          filterRole: data.selectedData.value
        });
      }
    });
    this.setState({
      allRoles: decodeData.data
    })

  }

  listApi = async (data) => {
    const res = await ApiCall("getadminstafflist", data);
    if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      const decodeData = Decoder.decode(res.data.payload);
      // console.log("DecodeerData>>>", decodeData)
      let totalPage = Math.ceil(decodeData.data.staffcount / parseInt(this.state.limit));
      this.setState({
        listData: decodeData.data.adminstafflist,
        total_page: totalPage,
      })
    }
  }

  onRequestChange = (e) => {
    this.setState({
      requests: e.target.value,
    });
  };

  onNameChange = (value) => {
    this.setState({
      uname: value,
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: value,
      email: this.state.emailId,
      mobile: this.state.mobileNo,
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: ""
    }

    this.listApi(data);
  };
  onEmailChange = (value) => {
    this.setState({
      emailId: value,
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.uname,
      email: value,
      mobile: this.state.mobileNo,
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: ""
    }

    this.listApi(data);
  };
  onMobileChange = (value) => {
    this.setState({
      mobileNo: value,
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.uname,
      email: this.state.emailId,
      mobile: value,
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: ""
    }

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
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      name: this.state.uname,
      email: this.state.emailId,
      mobile: this.state.mobileNo,
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: ""
    }
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
      name: this.state.uname,
      email: this.state.emailId,
      mobile: this.state.mobileNo,
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: ""
    }
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
        name: this.state.uname,
        email: this.state.emailId,
        mobile: this.state.mobileNo,
        orderby: "",
        direc: "",
        searchto: "",
        searchfrom: ""
      }
      this.listApi(data)
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
        name: this.state.uname,
        email: this.state.emailId,
        mobile: this.state.mobileNo,
        orderby: "",
        direc: "",
        searchto: "",
        searchfrom: ""
      }
      this.listApi(data);
    }
  };
  editPage = (item) => {
    this.props.history.push({
      pathname: "/adminEditStaff",
      state: this.state.listData[this.state.curIndex],
    });
  };

  deletePage = (item) => { };

  // ................status func...................
  onStatusChange = async (index) => {

    let arrData = this.state.listData;
    let stat = 0;
    if (arrData[index].status === 0) {
      stat = 1;
    } else {
      stat = 0;
    }
    arrData[index].status = stat
    this.setState({
      listData: arrData
    })

    let data = {
      staffid: arrData[index].userId,
      status: stat.toString(),
      staffusertypetd: arrData[index].userTypeId,
    };

    let status = await ApiCall("adminstaffstatuschange", data);
    if (status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      // this.load();
      toast.success(AlertMessage.MESSAGE.UPDATE_STATUS.SUCCESS);
    }
  };
  //..............function for MenuButton close..............

  handleReset = () => {
    this.handleMenuClose();
    window.$("#password-model").modal("show");

  };
  //   ..........add new button.......................
  addNew = () => {
    history.push("/adminAddStaff");
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
  //...................function for decline modal close......
  handleModalClose = () => {
    this.setState({
      openModal: false,
    });
  };
  //   ......................func for decline modal open...............
  handleModalOpen = () => {
    this.setState({
      openModal: true,
    });
  };
  //...................function for filter modal close......
  handleFilterModalClose = () => {
    this.setState({
      openfilterModal: false,
    });
  };
  //   ......................func for filter modal open...............
  handleFilterModalOpen = () => {
    this.setState({
      openfilterModal: true,
    });
  };

  // .............filter modal function...................

  onFilterRoleChange = (e) => {
    this.setState({
      filterRole: e.target.value,
    });
  };

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
      // searchform: this.state.formDate,
      // searchto: this.state.toDate,
      role: this.state.filterRole,
      name: "",
      email: "",
      mobile: "",
      orderby: "",
      direc: "",
      searchto: this.state.toDate,
      searchfrom: this.state.formDate
    };

    // window.$("#create-filter-model").modal("hide");
    // console.log("Filter data", data)

    this.listApi(data);

    this.setState({
      formDate: "",
      toDate: "",
      filterRole: ""
    });

  }

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: "",
      filterRole: ""
    })
  }

  //......Ascending order .........

  ascOrder = (data) => {
    let filter = "";
    if (data === "userName") {
      filter = "name";
    } else if (data === "email") {
      filter = "email";
    } else if (data === "mobile") {
      filter = "mobile";
    } else if (data === "role") {
      filter = "role";
    } else if (data === "date") {
      filter = "lastUpdated";
    }

    let req = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.uname,
      email: this.state.emailId,
      mobile: this.state.mobileNo,
      orderby: filter,
      direc: "ASC",
      searchto: "",
      searchfrom: ""
    }

    this.listApi(req);
  }

  //......Descending order .........

  descOrder = (data) => {
    let filter = "";
    if (data === "userName") {
      filter = "name";
    } else if (data === "email") {
      filter = "email";
    } else if (data === "mobile") {
      filter = "mobile";
    } else if (data === "role") {
      filter = "role";
    } else if (data === "date") {
      filter = "lastUpdated";
    }

    let req = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.uname,
      email: this.state.emailId,
      mobile: this.state.mobileNo,
      orderby: filter,
      direc: "DESC",
      searchto: "",
      searchfrom: ""
    }

    this.listApi(req);

  }

  onChangeLimit = (e) => {
    this.setState({
      limit: parseInt(e.target.value)
    });

    let data = {
      limit: e.target.value,
      offset: JSON.stringify((this.state.current_page - 1) * parseInt(e.target.value)),
      name: this.state.uname,
      email: this.state.emailId,
      mobile: this.state.mobileNo,
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: ""
    }

    this.listApi(data);
  }

  onStatusModal = (index) => {
    if (this.state.listData[this.state.curIndex].status === 1) {
      this.setState({
        isActive: true
      })
    } else {
      this.setState({
        isActive: false
      })
    }

    window.$("#status-model").modal("show");
    this.handleMenuClose();
  }

  //........ No Delete .......

  cancelDelete = () => {
    window.$("#status-model").modal("hide");
    window.$("#password-model").modal("hide");
  }

  //........ Activate or Deactivate modal .......

  statusUpdate = async () => {
    window.$("#status-model").modal("hide");

    let arrData = this.state.listData;
    let stat = 0;
    if (arrData[this.state.curIndex].status === 0) {
      stat = 1;
    } else {
      stat = 0;
    }

    let data = {
      staffid: arrData[this.state.curIndex].userId,
      status: stat.toString(),
      staffusertypetd: arrData[this.state.curIndex].userTypeId,
    };

    let status = await ApiCall("adminstaffstatuschange", data);
    if (status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      this.load();
      toast.success(AlertMessage.MESSAGE.UPDATE_STATUS.SUCCESS);
    }

  }

  //............Reset Password...........

  onResetPassword = async () => {
    window.$("#password-model").modal("hide");

    let pass = this.randomString(10, 'aA#!');

    let data = {
      staffid: this.state.listData[this.state.curIndex].userId,
      password: pass,
    };

    let status = await ApiCall("userpasswordreset", data);
    if (status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      toast.success(AlertMessage.MESSAGE.PASSWORD.RESET_SUCCESS);
    }

  }

  //........... Export File...............

  onExport = async () => {
    let data = {
      name: this.state.uname,
      email: this.state.emailId,
      mobile: this.state.mobileNo,
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: ""
    }
    let res = await ApiCall("exportadminstaff", data);
    const decodeData = Decoder.decode(res.data.payload);
    if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      window.open(decodeData.data.fileUrl, "_blank");
    }

  }

  randomString = (length, chars) => {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '@#$%&_';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
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
                      <span style={{ width: "30%", paddingLeft: '5px', fontSize: '14px' }}>Name</span>
                      <InputText
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.uname}
                        onTextChange={(value) => {
                          this.onNameChange(value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vn_frm">
                      <span style={{ width: "30%", paddingLeft: '20px', fontSize: '14px' }}>Email Id</span>
                      <InputText
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.emailId}
                        onTextChange={(value) => {
                          this.onEmailChange(value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vn_frm">
                      <span style={{ width: "30%", paddingLeft: '10px', fontSize: '14px' }}>Mobile No</span>
                      <InputText
                        type="number"
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.mobileNo}
                        onTextChange={(value) => {
                          this.onMobileChange(value);
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
                <div class="export-btn" onClick={this.onExport}><a href="#">
                  Export{" "}
                  <img
                    src={ImageName.IMAGE_NAME.EXPORT_BTN}
                    style={{ width: "25px", cursor: 'pointer' }}
                  />
                </a></div>
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
                      {/* <option value="10">10</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option> */}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-listing-app">
              <div className="table-responsive">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <th style={{ width: "15%" }}>
                      <div class="sorting_btn">
                        <button class="t1" onClick={() => this.ascOrder("userName")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button class="t1">
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} onClick={() => this.descOrder("userName")} />
                        </button>
                      </div>
                      <span style={{ fontSize: '13px' }}>Name</span>
                    </th>
                    <th style={{ width: "20%" }}>
                      <div class="sorting_btn">
                        <button class="t1">
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} onClick={() => this.ascOrder("email")} />
                        </button>
                        <button class="t1">
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} onClick={() => this.descOrder("email")} />
                        </button>
                      </div>
                      <span style={{ fontSize: '13px' }}>Email Id</span>
                    </th>
                    <th style={{ width: "15%" }}>
                      <div class="sorting_btn">
                        <button class="t1">
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} onClick={() => this.ascOrder("mobile")} />
                        </button>
                        <button class="t1">
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} onClick={() => this.descOrder("mobile")} />
                        </button>
                      </div>
                      <span style={{ fontSize: '13px' }}>Mobile No</span>
                    </th>
                    <th style={{ width: "10%" }}>
                      <div class="sorting_btn">
                        <button class="t1">
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} onClick={() => this.ascOrder("role")} />
                        </button>
                        <button class="t1">
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} onClick={() => this.descOrder("role")} />
                        </button>
                      </div>
                      <span style={{ fontSize: '13px' }}>Role</span>
                    </th>
                    <th style={{ width: "15%" }}>
                      <div class="sorting_btn">
                        <button class="t1">
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} onClick={() => this.ascOrder("date")} />
                        </button>
                        <button class="t1">
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} onClick={() => this.descOrder("date")} />
                        </button>
                      </div>
                      <span style={{ fontSize: '13px' }}>Last Modified on</span>
                    </th>

                    <th style={{ width: "10%" }}><span style={{ fontSize: '13px' }}>Status</span></th>
                    <th style={{ width: "10%" }}><span style={{ fontSize: '13px' }}>Action</span></th>
                  </tr>
                  {this.state.listData.map((item, key) =>
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
                              <td style={{ width: "15%" }}>{item.name}</td>
                              <td style={{ width: "20%" }}>{item.email}</td>
                              <td style={{ width: "15%" }}>+{item.countrycode} {item.mobile}</td>
                              <td style={{ width: "10%" }}>{item.rolename}</td>
                              <td style={{ width: "15%" }}>
                                {SetDateFormat(item.lastUpdated)}<br />{SetTimeFormat(item.lastUpdated)}
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

                              <td style={{ width: "10%" }}>
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
                                  <MenuItem onClick={() => this.editPage(item)}>
                                    Edit
                                  </MenuItem>
                                  <MenuItem onClick={this.handleReset}>
                                    Reset Password
                                  </MenuItem>
                                  <MenuItem>View Jobs</MenuItem>
                                  <MenuItem>View Projects</MenuItem>
                                  <MenuItem onClick={() => this.onStatusModal(key)}>De-Activate or Activate</MenuItem>
                                </Menu>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
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
                          <div class="lable-text" style={{ paddingLeft: '10px', fontSize: '16px' }}>Role</div>
                          <div class="dropdwn">
                            <select class="myDropdown_2 frm4-select"></select>
                            {/* <FormControl sx={{ m: 1, minWidth: 120 }}>
                              <Select
                                value={this.state.filterClient}
                                onChange={this.onFilterRoleChange}
                                displayEmpty
                                IconComponent={KeyboardArrowDownIcon} //for the icon
                                inputProps={{ "aria-label": "Without label" }}
                                //   MenuProps={{}}
                                style={{ height: "35px", width: "300px" }}
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {this.state.allRoles.map((item, key) => (
                                  <MenuItem value={item.id}>{item.rolename}</MenuItem>
                                ))}
                              </Select>
                            </FormControl> */}
                            {/* <select class="frm4-select" id="myDropdown_13">
                              <option>Select</option>
                              <option>Declined</option>
                              <option>Pending</option>
                              <option>All</option>
                            </select> */}
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
        <div
          id="status-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="modal-body">
                {/* <div className="model-info f-model"> */}
                <div className="form-search-app">
                  <center><h6>Are you really want to {this.state.isActive ? "Deactivate" : "Activate"} the record? </h6></center>
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
                        onClick={this.statusUpdate}
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

        {/* ..................Reset Password modal................................. */}
        <div
          id="password-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="modal-body">
                {/* <div className="model-info f-model"> */}
                <div className="form-search-app">
                  <center><h6>Are you really want to reset the password for selected user? </h6></center>
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
                        onClick={this.onResetPassword}
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
