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
import "./ClientList.css";

import { AlertMessage, ImageName } from "../../../../enums";
import { InputText } from "../../SharedComponents/inputText";
import { ApiCall } from "../../../../services/middleware";
import { CryptoDecoder, Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";
import {
  SetDateFormat,
  SetTimeFormat,
} from "../../../../services/common-function";
import {
  mobileNumberValidator,
  numberValidator,
  zipValidate,
} from "../../../../validators";
import { Regex } from "../../../../services/config";

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

export default class ClientList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      current_page: 1,
      total_page: 10,
      limit: 10,
      display: "",
      name: "",
      email: "",
      mobile: "",
      switch: false,
      anchorEl: null, //menu button
      anchorEl1: null, //menu button
      openModal: false, // open decline modal false
      // listData: [],
      curIndex: 0,
      formDate: "",
      toDate: "",
      filterTrainingCategory: "",
      filterStatus: "",

      listData: [],
    };
  }

  componentDidMount() {
    // window.$(".myDropdown").ddslick();
    window.scrollTo(0, 0);

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
    // ...............filter status dropdown.......................
    let statusArr = [
      {
        text: "None",
        value: "",
      },
      {
        text: "Active",
        value: 1,
      },
      {
        text: "Inactive",
        value: 0,
      },
    ];
    var classInstance = this;
    window.$(".myDropdown_stat").ddslick({
      data: statusArr,
      onSelected: function (data) {
        var ddData = window.$(".myDropdown_stat").data("ddslick");
        classInstance.setState({
          filterStatus: data.selectedData.value,
        });
      },
    });

    //..............filter training category..............
    let categoryArr = [
      {
        text: "None",
        value: "",
      },
      {
        text: "Chytopathology",
        value: 0,
      },
      {
        text: "General Pathology",
        value: 1,
      },
    ];
    var classInstance = this;
    window.$(".myDropdown_category").ddslick({
      data: categoryArr,
      onSelected: function (data) {
        var ddData = window.$(".myDropdown_category").data("ddslick");
        classInstance.setState({
          filterTrainingCategory: data.selectedData.value,
        });
      },
    });
    this.load();
  }

  load = async () => {
    let data = {
      clientname: "",
      direc: "",
      orderby: "",
      businessemail: "",
      businessmobile: "",
      searchto: "",
      searchfrom: "",
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
    };
    this.listApi(data);
  };

  listApi = async (data) => {
    const res = await ApiCall("fetchclientlist", data);
    // console.log("resData::::", res);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      // console.log("Payload data>>>", decodeData);
      let listDetails = decodeData.data.clientDetailsList;
      let totalPage = Math.ceil(decodeData.data.totalCount / this.state.limit);
      // console.log("Total Page>>>", listDetails);
      this.setState({
        listData: decodeData.data.clientDetailsList,
        total_page: totalPage,
      });
    }
  };

  //..... for search name......

  onNameChange = (value) => {
    this.setState({
      name: value,
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),

      clientname: value,
      businessemail: this.state.email,
      businessmobile: this.state.mobile,
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: "",
      type: "",
      status: "",
    };

    this.listApi(data);
  };
  onEmailChange = (value) => {
    this.setState({
      email: value,
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      clientname: this.state.name,
      businessemail: value,
      businessmobile: this.state.mobile,
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: "",
      type: "",
      status: "",
    };

    this.listApi(data);
  };
  onMobileChange = (value) => {
    let val = zipValidate(value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        mobile: val,
      });
      let data = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify(
          (this.state.current_page - 1) * this.state.limit
        ),
        clientname: this.state.name,
        businessemail: this.state.email,
        businessmobile: value,
        orderby: "",
        direc: "",
        searchto: "",
        searchfrom: "",
        type: "",
        status: "",
      };

      this.listApi(data);
    }

    // if (numberValidator(value) === true) {
    //   if (mobileNumberValidator(value) === true) {
    //     this.setState({
    //       mobile: value,
    //     });
    //     let data = {
    //       limit: JSON.stringify(this.state.limit),
    //       offset: JSON.stringify(
    //         (this.state.current_page - 1) * this.state.limit
    //       ),
    //       clientname: this.state.name,
    //       businessemail: this.state.email,
    //       businessmobile: value,
    //       orderby: "",
    //       direc: "",
    //       searchto: "",
    //       searchfrom: "",
    //       type: "",
    //       status: "",
    //     };

    //     this.listApi(data);
    //   }
    // }
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
      anchorEl1: null,
    });
  };

  // ....................Searching.............................
  handleCourseChange = (value) => {
    this.setState({
      courseName: value,
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
    return history.push("/adminClientAdd");
  };

  //................funct for menuBtn on click................
  menuBtnhandleClick = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl: event.currentTarget,
    });
  };

  menuBtnhandleClick_b = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl1: event.currentTarget,
    });
  };
  editPage = () => {
    this.props.history.push({
      pathname: "/adminClientEdit",
      state: this.state.listData[this.state.curIndex],
    });
  };
  // ..................delete function........................
  deletePage = () => {
    window.$("#delete-modal").modal("show");
    // let listArrData = this.state.listData;
    // listArrData.splice(this.state.curIndex, 1);
    this.setState({
      // listData: listArrData,
      anchorEl: false,
      anchorEl1: false,
    });
  };
  onCancel = () => {
    window.$("#delete-modal").modal("hide");
  };

  deleteItem = async () => {
    let data = {
      id: this.state.listData[this.state.curIndex].id,
      status: 2,
    };
    // console.log(">>>>>>>>>>dataaaa::", JSON.stringify(data));
    let status = await ApiCall("changeStatusTrainingCourse", data);
    // console.log(">>>>>>>>>status:", status);

    window.$("#delete-modal").modal("hide");
    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.listApi();
      toast.success(AlertMessage.MESSAGE.DELETE.DELETED);
    }
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
      clientid: arrData[index].userId,
      status: stat.toString(),
    };

    let status = await ApiCall("modifyclientstatus", data);

    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(status.data.payload);

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
      direc: "ASC",
    };

    this.listApi(req);
  };

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
  // .............filter modal function...................

  onFilterRoleChange = (e) => {
    this.setState({
      filterRole: e.target.value,
    });
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
      clientname: "",
      direc: "",
      orderby: "",
      businessemail: "",
      businessmobile: "",

      searchfrom: this.state.formDate,
      searchto: this.state.toDate,
    };

    // window.$("#create-filter-model").modal("hide");
    // console.log("Filter data", data);

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
  goEdit = () => {
    this.props.history.push({
      pathname: "/adminClientEdit",
      state: this.state.listData[this.state.curIndex],
    });
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    const open1 = Boolean(this.state.anchorEl1);
    return (
      <React.Fragment>
      {/* <div className="wrapper">
        <Header /> */}
        <ToastContainer hideProgressBar />
        {/* <Sidebar /> */}
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
                      <span
                        style={{
                          width: "30%",
                          paddingLeft: "5px",
                          fontSize: "14px",
                        }}
                      >
                        Client
                      </span>
                      <InputText
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.name}
                        onTextChange={(value) => {
                          this.onNameChange(value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vn_frm">
                      <span
                        style={{
                          width: "30%",
                          paddingLeft: "20px",
                          fontSize: "14px",
                        }}
                      >
                        Email Id
                      </span>
                      <InputText
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.email}
                        onTextChange={(value) => {
                          this.onEmailChange(value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vn_frm">
                      <span
                        style={{
                          width: "30%",
                          paddingLeft: "10px",
                          fontSize: "14px",
                        }}
                      >
                        Mobile No
                      </span>
                      <InputText
                        // type="number"
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.mobile}
                        onTextChange={(value) => {
                          this.onMobileChange(value);
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
                      Client
                    </th>
                    <th style={{ width: "15%" }}>
                      {/* <div class="sorting_btn">
                        <button class="t1" onClick={() => this.ascOrder("subDepartment")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button class="t1" onClick={() => this.descOrder("subDepartment")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      Industry Type
                    </th>
                    <th style={{ width: "15%" }}>
                      {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("location")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("location")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      Business Email
                    </th>

                    <th style={{ width: "15%" }}>
                      {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("client")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("client")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      Business Phone
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
                      {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("supervisor")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("supervisor")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      No. of Jobs
                    </th>
                    <th style={{ width: "10%" }}>No. of Contacts</th>
                    <th style={{ width: "10%" }}>Last Modified</th>
                    <th style={{ width: "10%" }}>Status</th>
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
                              <td style={{ width: "10%" }}>
                                {item.clientName}
                              </td>
                              <td style={{ width: "15%" }}>
                                {item.industryType}
                              </td>
                              <td style={{ width: "15%" }}>
                                {item.businessemail}
                              </td>
                              {/* <td style={{ width: "8%" }}>{item.clientId}</td> */}
                              <td style={{ width: "15%" }}>
                                {item.businessPhone}
                                {/* {item.duration} {item.durationUnit} */}
                              </td>
                              {/* <td style={{ width: "10%" }}>{item.user}</td> */}
                              <td style={{ width: "10%" }}>
                                {/* {item.noOfJobs} */}
                                0
                                </td>
                              <td style={{ width: "10%" }}>
                                {item.noOfContacts}
                              </td>
                              <td style={{ width: "10%" }}>
                                {SetDateFormat(item.lastUpdated)}{" "}
                                {SetTimeFormat(item.lastUpdated)}
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
                                    {" "}
                                    {item.status === 1 ? "ACTIVE" : "INACTIVE"}
                                  </FormHelperText>
                                </FormControl>
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
                                  <MenuItem onClick={() => this.goEdit()}>
                                    Edit
                                  </MenuItem>

                                  <MenuItem>View Jobs</MenuItem>
                                  <MenuItem>View Projects</MenuItem>
                                  <MenuItem
                                    onClick={() => this.vendorRateCards()}
                                  >
                                    View Client Rate Card
                                  </MenuItem>
                                  <MenuItem>Invoices</MenuItem>
                                  {/* <MenuItem
                                    onClick={() => this.onStatusModal()}
                                  >
                                    De-Activate or Activate
                                  </MenuItem> */}
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
                  {/* <div className="m-select _fl">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="sf-row">
                          <div class="lable-text" style={{ fontSize: "13px" }}>
                            Category
                          </div>
                          <div
                            class="dropdwn"
                            style={{ width: "70%", cursor: "pointer" }}
                          >
                            <select
                              class="myDropdown_category frm4-select"
                              id="myDropdown_category"
                            ></select>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="sf-row">
                          <div class="lable-text">Status</div>
                          <div class="dropdwn" style={{ cursor: "pointer" }}>
                            <select
                              class="myDropdown_stat frm4-select"
                              id="myDropdown_stat"
                            ></select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          {/* ...........................delete modal.............................. */}
        </div>
        {/* ..............................delete modal............................. */}
        <div id="delete-modal" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div className="modal-content" style={{ padding: "10px" }}>
              <div className="delete-head">Delete Course</div>
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
