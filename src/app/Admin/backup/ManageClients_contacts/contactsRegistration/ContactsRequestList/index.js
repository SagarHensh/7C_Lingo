import React from "react";
import "./contactRequest.css";
// import "../../Vendor List/vendorList.css";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";
import { InputText, SelectBox } from "../../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../../enums";
import {
  inputEmptyValidate,
  mobileNumberValidator,
  numberValidator,
} from "../../../../../validators";
import { ApiCall } from "../../../../../services/middleware";
import { ErrorCode } from "../../../../../services/constant";
import { Decoder } from "../../../../../services/auth";
import {
  getLookUpDataFromAPI,
  SetDateFormat,
  SetTimeFormat,
  textTruncate,
} from "../../../../../services/common-function";
import history from "../../../../../history";
import { ToastContainer, toast } from "react-toastify";
import { ThirtyFpsSelect } from "@mui/icons-material";

var dummy = [{
  id: 1,
  firstNAme: "Jaque",
  lastName: "Sines",
  client: "John Sena",
  email: "jaquesines7c@gmail.com",
  mobile: "987654231231",
  requestedOn: "2021-11-21T18:27:29.000Z",
  status: 0
}, {
  id: 2,
  firstNAme: "Somili",
  lastName: "Chique",
  client: "John Sena",
  email: "somili7c@gmail.com",
  mobile: "987654233231",
  requestedOn: "2021-10-29T09:59:30.000Z",
  status: 1
}, {
  id: 3,
  firstNAme: "Saif",
  lastName: "Jaz",
  client: "John Sena",
  email: "saif7c@gmail.com",
  mobile: "935654231231",
  requestedOn: "2021-10-28T09:42:28.000Z",
  status: 2
}];

export default class ContactsRequestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: 1,
      total_page: 10,
      limit: 10,
      offset: 0,
      curIndex: 0,
      anchorEl: null, //menu button
      listData: [],
      name: "",
      email: "",
      mobile: "",
      client: "",
      status: 0,
      formDate: "",
      toDate: "",
      declineMessage: "",
      allStatus: [],
      allClients: [],
      selectedStatus: {
        label: "All",
        value: "",
      },
      selectedClient: {
        label: "",
        value: ""
      }
    };
  }

  componentDidMount() {
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

    var status = [
      {
        label: "All",
        value: "",
      },
      {
        label: "Pending",
        value: "0",
      },
      {
        label: "Declined",
        value: "2",
      },
    ];

    this.setState({
      allStatus: status
    })

    var classInstance = this;
    window.$(".myDropdown").ddslick({
      data: ddData,
      onSelected: function (data) {
        classInstance.setState({
          limit: data.selectedData.value,
          offset: "0",
        });
        classInstance.load();
      },
    });

    var modal = document.getElementById("decline-model");
    var filterModal = document.getElementById("create-filter-model");

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal || event.target === filterModal) {
        classInstance.closeModal();
      }
    };

    this.clientDetails();
  }

  clientDetails = async () => {
    let res = await ApiCall("getallclinetinfo");
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(res.data.payload);
      let arr = payload.data.clientlist;
      let brr = [];
      arr.map((data) => {
        brr.push({
          label: data.clientName,
          value: data.clientid
        })
      });

      this.setState({
        allClients: brr
      })
    }
  }

  load = async () => {
    let req = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      clientcontactname: "",
      email: "",
      mobile: "",
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom: "",
      clientid: "",
      status: "",
    };

    this.listApi(req);
  };

  listApi = async (data) => {
    let res = await ApiCall("fetchclientcontactreqlist", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(res.data.payload);
      let totalPage = Math.ceil(payload.data.totalCount / this.state.limit);
      this.setState({
        listData: payload.data.clientContactDetailsList,
        total_page: totalPage,
      });
    }
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
      clientcontactname: this.state.name,
      email: this.state.email,
      mobile: this.state.mobile,
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom: "",
      clientid: "",
      status: "",
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
      clientcontactname: this.state.name,
      email: this.state.email,
      mobile: this.state.mobile,
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom: "",
      clientid: "",
      status: "",
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
        clientcontactname: this.state.name,
        email: this.state.email,
        mobile: this.state.mobile,
        direc: "",
        orderby: "",
        searchto: "",
        searchfrom: "",
        clientid: "",
        status: "",
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
        clientcontactname: this.state.name,
        email: this.state.email,
        mobile: this.state.mobile,
        direc: "",
        orderby: "",
        searchto: "",
        searchfrom: "",
        clientid: "",
        status: "",
      };
      this.listApi(data);
    }
  };

  //......Ascending order .........

  ascOrder = (data) => {
    let filter = "";
    if (data === "name") {
      filter = "name";
    } else if (data === "email") {
      filter = "email";
    } else if (data === "mobile") {
      filter = "mobile";
    } else if (data === "createDate") {
      filter = "createDate";
    }

    let req = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      clientcontactname: this.state.name,
      email: this.state.email,
      mobile: this.state.mobile,
      orderby: filter,
      direc: "ASC",
      searchto: "",
      searchfrom: "",
      clientid: "",
      status: "",
    };

    this.listApi(req);
  };

  //......Descending order .........

  descOrder = (data) => {
    let filter = "";
    if (data === "name") {
      filter = "name";
    } else if (data === "email") {
      filter = "email";
    } else if (data === "mobile") {
      filter = "mobile";
    } else if (data === "createDate") {
      filter = "createDate";
    }

    let req = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      clientcontactname: this.state.name,
      email: this.state.email,
      mobile: this.state.mobile,
      orderby: filter,
      direc: "DESC",
      searchto: "",
      searchfrom: "",
      clientid: "",
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

  //..... for search name......

  onNameChange = (value) => {
    this.setState({
      name: value,
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      clientcontactname: value,
      email: this.state.email,
      mobile: this.state.mobile,
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom: "",
      clientid: "",
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
      clientcontactname: this.state.name,
      email: value,
      mobile: this.state.mobile,
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom: "",
      clientid: "",
      status: "",
    };

    this.listApi(data);
  };
  onMobileChange = (value) => {
    if (numberValidator(value) === true) {
      if (mobileNumberValidator(value) === true) {
        this.setState({
          mobile: value,
        });
        let data = {
          limit: JSON.stringify(this.state.limit),
          offset: JSON.stringify(
            (this.state.current_page - 1) * this.state.limit
          ),
          clientcontactname: this.state.name,
          email: this.state.email,
          mobile: value,
          direc: "",
          orderby: "",
          searchto: "",
          searchfrom: "",
          clientid: "",
          status: "",
        };

        this.listApi(data);
      }
    }
  };

  openModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("decline-model").style.display = "block";
    document.getElementById("decline-model").classList.add("show");
  };

  openFilterModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("create-filter-model").style.display = "block";
    document.getElementById("create-filter-model").classList.add("show");
  };

  closeModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("decline-model").style.display = "none";
    document.getElementById("decline-model").classList.remove("show");
    document.getElementById("create-filter-model").style.display = "none";
    document.getElementById("create-filter-model").classList.remove("show");
  };

  declineModal = () => {
    // window.$("#decline-model").modal("show");
    this.openModal();
    this.handleMenuClose();
  };

  declineClose = () => {
    this.setState({
      declineMessage: "",
    });
    // window.$("#decline-model").modal("hide");
    this.closeModal();
  };

  declineMessageChange = (e) => {
    this.setState({
      declineMessage: e.target.value,
    });
  };

  declineRequest = () => {

    let errorCount = 0;
    let validateReason = inputEmptyValidate(this.state.declineMessage);
    if (validateReason === false) {
      toast.error(AlertMessage.MESSAGE.DECLINE_MODAL.EMPTY_MESSAGE, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      let data = {
        status: "2",
        clientcontactid: this.state.listData[this.state.curIndex].clientcontactid,
        reason: this.state.declineMessage,
      };
      // console.log("data Decline", data)
      this.modifyStatus(data);
      this.declineClose();
    }
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
      selectedStatus: value,
      status: value.value
    });
  }

  filterClientChange = (value) => {
    this.setState({
      selectedClient: value,
      client: value.value
    });
  }

  onFilterApply = () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      clientcontactname: this.state.name,
      email: this.state.email,
      mobile: this.state.mobile,
      orderby: "",
      direc: "",
      searchto: this.state.toDate,
      searchfrom: this.state.formDate,
      clientid: this.state.client,
      status: this.state.status.toString(),
    };

    // window.$("#create-filter-model").modal("hide");
    // console.log("Filter data", data)
    this.closeModal();

    this.listApi(data);

    this.setState({
      formDate: "",
      toDate: "",
      selectedStatus: {
        label: "",
        value: "",
      },
      selectedClient: {
        label: "",
        value: ""
      }
    });
  };

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: "",
      selectedStatus: {
        label: "",
        value: "",
      },
      selectedClient: {
        label: "",
        value: ""
      }
    });
    // this.closeModal();
  };

  viewPage = (item) => {
    this.props.history.push({
      pathname: "/adminContactRequestView",
      state: this.state.listData[this.state.curIndex],
    });
  };

  viewEye = (id) => {
    this.setState({
      curIndex: id,
    });
    this.props.history.push({
      pathname: "/adminContactRequestView",
      state: this.state.listData[id],
    });
  };

  acceptRequest = () => {
    let data = {
      status: "1",
      clientcontactid: this.state.listData[this.state.curIndex].clientcontactid,
      reason: "",
    };
    this.modifyStatus(data);
    this.handleMenuClose();
  };

  modifyStatus = async (data) => {
    let res = await ApiCall("modifyclientcontactstatus", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      if (data.status === "1") {
        toast.success(AlertMessage.MESSAGE.CLIENT_REQUEST.REQUEST_ACCEPTED, {
          hideProgressBar: true,
        });
      } else if (data.status === "2") {
        toast.success(AlertMessage.MESSAGE.CLIENT_REQUEST.REQUEST_DECLINED, {
          hideProgressBar: true,
        });
      }
      this.load();
    }
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    const selectedStatus = this.state.selectedStatus;
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
        {/* <Header /> */}
        <ToastContainer hideProgressBar={true} />
        {/* <Sidebar /> */}
        <div className="component-wrapper">
          <div className="listing-component-app">
            <div className="vendor-info _fl sdw">
              <div className="vn-form _fl">
                <div className="row">
                  <div className="col-md-4">
                    <div className="vn_frm">
                      {" "}
                      <span>Client Contact</span>
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
                      <span>Email Id</span>
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
                      {" "}
                      <span>Mobile No.</span>
                      <InputText
                        type="text"
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.mobile}
                        onTextChange={(value) => {
                          this.onMobileChange(value);
                        }}
                      />
                      {/* <input type="text" value="" name="" placeholder="Search" className="inputfield" /> */}
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
                  onClick={() => { this.openFilterModal() }}
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
                <div class="tble-short">
                  <span class="lbl">Display</span>
                  <div class="dropdwn">
                    <select class="myDropdown frm4-select"></select>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-listing-app md4">
              <div className="table-responsive">
                <table
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                >
                  <tr>
                    <th style={{ width: "20%" }}>
                      <div className="sorting_btn_cr">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("name")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button className="t1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("name")}
                          />
                        </button>
                      </div>
                      Client Contact
                    </th>
                    {/* <th style={{ width: "10%" }}>
                      <div className="sorting_btn_cr">
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
                      </div>
                      Last Name
                    </th> */}
                    <th style={{ width: "15%" }}>
                      {/* <div className="sorting_btn_cr">
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
                      Client
                    </th>
                    <th style={{ width: "15%" }}>
                      <div className="sorting_btn_cr">
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
                      </div>
                      Email
                    </th>
                    <th style={{ width: "15%" }}>
                      <div className="sorting_btn_cr">
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
                      </div>
                      Mobile Number
                    </th>
                    <th style={{ width: "20% " }}>
                      <div className="sorting_btn_cr">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("createDate")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button className="t1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("createDate")}
                          />
                        </button>
                      </div>
                      Requested on
                    </th>
                    <th style={{ width: "10%" }}>Status</th>
                    <th style={{ width: "5%" }}>Action</th>
                  </tr>
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
                              <td style={{ width: "20%" }}>{data.name}</td>
                              {/* <td style={{ width: "10%" }}>{data.lastName}</td> */}
                              <td style={{ width: "15%" }}>{data.clientName}</td>
                              {data.email.length > 20 ? (
                                <td
                                  style={{ width: "15%" }}
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title={data.email}
                                >
                                  {textTruncate(data.email, 20)}
                                </td>
                              ) : (
                                <td style={{ width: "15%" }}>
                                  {textTruncate(data.email, 20)}
                                </td>
                              )}
                              {/* <td style={{ width: "10%" }}>{data.email}</td> */}
                              <td style={{ width: "15%" }}>{"+"} {data.countrycode} {data.mobile}</td>
                              <td style={{ width: "20%" }}>
                                {SetDateFormat(data.createDate)} | {SetTimeFormat(data.createDate)}
                              </td>

                              <td style={{ width: "10%" }}>
                                {data.approvalStatus === 0 ? (
                                  <span className="Pending_btn">Pending</span>
                                ) : data.approvalStatus === 1 ? (
                                  <span className="approve_btn">
                                    Approved
                                  </span>
                                ) : (
                                  <span className="declined_btn">
                                    Declined
                                  </span>
                                )}
                              </td>
                              {data.approvalStatus === 1 ||
                                data.approvalStatus === 2 ? (
                                <td style={{ width: "5%" }}>
                                  <span
                                    onClick={() => {
                                      this.viewEye(key);
                                    }}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <img
                                      src={ImageName.IMAGE_NAME.EYE_BTN}
                                      style={{
                                        width: "40%",
                                        paddingBottom: "5px",
                                      }}
                                    />
                                  </span>{" "}
                                </td>
                              ) : (
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
                                      onClick={() => this.viewPage(data)}
                                    >
                                      View
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        this.acceptRequest();
                                      }}
                                    >
                                      Accept
                                    </MenuItem>
                                    <MenuItem onClick={this.declineModal}>
                                      Decline
                                    </MenuItem>
                                  </Menu>
                                </td>
                              )}
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>

            <div class="table-filter-app-b" style={{ paddingTop: "2%" }}>
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
                    <select class="myDropdown frm4-select"></select>
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
                      <div class="col-md-6">
                        <div class="sf-row">
                          <div
                            class="lable-text"
                            style={{ paddingLeft: "10px", fontSize: "16px" }}
                          >
                            Status
                          </div>
                          <div class="dropdwn" style={{ marginLeft: "25%" }}>
                            {/* {console.log("Selectecgfcdg Status>>>", selectedStatus)} */}
                            <SelectBox
                              value={selectedStatus}
                              optionData={this.state.allStatus}
                              placeholder=""
                              onSelectChange={this.filterStatusChange}
                            />
                            {/* <select class="myDropdown_3 frm4-select"></select> */}
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="sf-row">
                          <div
                            class="lable-text"
                            style={{ paddingLeft: "10px", fontSize: "16px" }}
                          >
                            Client
                          </div>
                          <div class="dropdwn" style={{ marginLeft: "25%" }}>
                            <SelectBox
                              value={this.state.selectedClient}
                              optionData={this.state.allClients}
                              placeholder=""
                              onSelectChange={this.filterClientChange}
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

        {/* ..................Decline modal................................. */}
        <div
          id="decline-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content" style={{ width: "100%" }}>
              <div className="cancel-job-head">
                <div className="row">
                  <div className="col-md-12">
                    <h2>
                      REASON TO <span>DECLINE</span>
                    </h2>
                    <button className="close-page">
                      <img
                        src={ImageName.IMAGE_NAME.CLOSE_BTN_3}
                        onClick={this.declineClose}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-body">
                <div className="model-info f-model">
                  <div className="form-search-app">
                    <textarea
                      placeholder="Reason"
                      className="in-textarea msg min"
                      style={{ resize: "none" }}
                      value={this.state.declineMessage}
                      onChange={this.declineMessageChange}
                    ></textarea>
                    <div className="web-form-bx margin-top-20">
                      <div className="_button-style _fl text-center">
                        <a className="white-btn" onClick={this.declineClose}>
                          cancel
                        </a>
                        <a
                          className="blue-btn"
                          style={{ color: "#fff" }}
                          onClick={this.declineRequest}
                        >
                          submit
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}
