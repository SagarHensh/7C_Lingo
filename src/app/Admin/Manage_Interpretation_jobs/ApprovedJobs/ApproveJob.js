import { Menu, MenuItem } from "@mui/material";
import React, { Component } from "react";
import { ImageName } from "../../../../enums";
import { Decoder } from "../../../../services/auth";
import { ErrorCode } from "../../../../services/constant";
import { ApiCall } from "../../../../services/middleware";
import { SelectBox } from "../../SharedComponents/inputText";
import "./approveJob.css";

const cancelationArr = [
  {
    label: "Last minute reschedule ",
    value: "1",
  },
  {
    label: "Duplicate/Error ",
    value: "2",
  },
  {
    label: "Consumer No Show",
    value: "3",
  },
  {
    label: "Interpreter No Show",
    value: "4",
  },
  {
    label: "Other Service being utilized",
    value: "5",
  },
  {
    label: "Other ",
    value: "6",
  },
];

export default class ApproveJob extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad: true,
      current_page: 1,
      total_page: 10,
      limit: 10,
      anchorEl: null, //menu button
      cancellationData: {},
      rescheduledCheck: null,
      isSelected: null,
      clientArr: [],
      clientData: {},
      otherReason: "",
      listData: [
        {
          jobId: "1234567890",

          client: "j p hospital",
          requester: "David Jones",
          lei: "Mark Brown",
          appointmentType: "VRI",
          dateTime: "13th March,2020 | 10:45",
          sourceLang: "Mexican",
          targetLang: "spanish",
          location: "14,Ferndale Avenue,NJ",

          status: 1,
        },
        {
          jobId: "1234567890",

          client: "j p hospital",
          requester: "David Jones",
          lei: "Mark Brown",
          appointmentType: "F2F",
          dateTime: "13th March,2020 | 10:45",
          sourceLang: "Mexican",
          targetLang: "spanish",
          location: "14,Ferndale Avenue,NJ",

          status: 1,
        },
      ],
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

    var classInstance = this;
    var modal = document.getElementById("decline-model");
    var filterModal = document.getElementById("filter-model");

    // ...............................................
    var statusData = [
      {
        text: "All",
        value: 1,
      },
      {
        text: "Pending",
        value: 2,
      },
    ];

    var classInstance = this;
    window.$(".myDropdown_status").ddslick({
      data: statusData,
      onSelected: function (data) {
        var statusData = window.$(".myDropdown_status").data("ddslick");

        classInstance.setState({
          limit: data.selectedData.value,
          offset: "0",
        });
        // classInstance.load();
      },
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal || event.target == filterModal) {
        classInstance.closeModal();
      }
    };
    this.load();
  }
  //   listApi = async (data) => {
  //     const res = await ApiCall("fetchclientlist", data);
  //     // console.log("resData::::", res);

  //     if (
  //       res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
  //       res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  //     ) {
  //       const decodeData = Decoder.decode(res.data.payload);
  //       // console.log("Payload data>>>", decodeData);
  //       let listDetails = decodeData.data.clientDetailsList;
  //       let totalPage = Math.ceil(decodeData.data.totalCount / this.state.limit);
  //       console.log("Total Page>>>", listDetails);
  //       this.setState({
  //         listData: decodeData.data.clientDetailsList,
  //         total_page: totalPage,
  //       });
  //     }
  //   };

  load = async () => {
    // ............................................................
    let clientDataArr = [];

    let clientinfoRes = await ApiCall("getallclinetinfo");
    if (
      clientinfoRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      clientinfoRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let clientPayload = await Decoder.decode(clientinfoRes.data.payload);
      let clientResData = clientPayload.data.clientlist;
      console.log("payload::::::::::", clientResData);
      for (let i = 0; i < clientResData.length; i++) {
        clientDataArr.push({
          label: clientResData[i].clientName,
          value: clientResData[i].clientid,
        });
      }
    }

    this.setState({
      clientArr: clientDataArr,
    });
  };
  // .............filter modal function...................

  onClientChamge = (data) => {
    this.setState({
      clientData: data,
    });
  };
  onOtherReasonChange = (e) => {
    this.setState({
      otherReason: e.target.value,
    });
  };
  //........Page show Limit.........

  onChangeLimit = (e) => {
    this.setState({
      limit: parseInt(e.target.value),
    });

    // let data = {
    //   limit: e.target.value,
    //   offset: JSON.stringify(
    //     (this.state.current_page - 1) * parseInt(e.target.value)
    //   ),
    // };

    // this.listApi(data);
  };
  onChangeStatus = (e) => {
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

  //........... Export File...............

  onExport = async () => {
    let data = {
      // name: this.state.uname,
      // email: this.state.emailId,
      // mobile: this.state.mobileNo,
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: "",
    };
    // let res = await ApiCall("exportadminstaff", data);
    // const decodeData = Decoder.decode(res.data.payload);
    // if (
    //   res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {
    //   window.open(decodeData.data.fileUrl, "_blank");
    // }
  };

  openModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("filter-model").style.display = "block";
    document.getElementById("filter-model").classList.add("show");
  };
  openDeclineModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("decline-model").style.display = "block";
    document.getElementById("decline-model").classList.add("show");
  };
  // openDeleteModal = () => {
  //   document.getElementById("backdrop").style.display = "block";
  //   document.getElementById("delete-model").style.display = "block";
  //   document.getElementById("delete-model").classList.add("show");
  // };

  closeModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("filter-model").style.display = "none";
    document.getElementById("filter-model").classList.remove("show");
    document.getElementById("decline-model").style.display = "none";
    document.getElementById("decline-model").classList.remove("show");
    // document.getElementById("delete-model").style.display = "none";
    // document.getElementById("delete-model").classList.remove("show");
  };

  filterModal = () => {
    this.openModal();
    this.handleMenuClose();
  };
  declineModal = () => {
    // window.$("#decline-model").modal("show");
    this.openDeclineModal();
    this.handleMenuClose();
  };
  declineClose = () => {
    this.setState({
      declineMessage: "",
    });
    this.closeModal();
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
      searchto: "",
      searchfrom: "",

      status: "",
    };
    // this.listApi(data);
  };

  // This is goes to the last page
  exRigth = () => {
    let totalPage = this.state.total_page;
    this.setState({
      current_page: totalPage,
    });

    let data = {
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: "",
      type: "",
      status: "",

      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit),
    };
    // this.listApi(data);
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
        searchto: "",
        searchfrom: "",
        type: "",
        status: "",
      };
      //   this.listApi(data);
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
        searchto: "",
        searchfrom: "",
        type: "",
        status: "",
      };
      //   this.listApi(data);
    }
  };

  onFilterApply = () => {
    // let data = {
    //   limit: JSON.stringify(this.state.limit),
    //   offset: "0",
    //   name: this.state.name,
    //   email: this.state.email,
    //   phone: this.state.mobile,
    //   orderby: "",
    //   direc: "",
    //   searchto: this.state.toDate,
    //   searchfrom: this.state.formDate,
    //   type: this.state.type,
    //   status: this.state.status.toString(),
    // };

    // console.log("Filter data", data)
    this.closeModal();

    // this.listApi(data);

    // this.setState({
    //   formDate: "",
    //   toDate: "",
    // });
  };

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: "",
    });
  };

  onCancelDataChange = (data) => {
    this.setState({
      cancellationData: data,
    });
  };
  rescheduledCheckYes = (e) => {
    console.log(e.target.checked);
    this.setState({
      isSelected: true,
      rescheduledCheck: e.target.checked,
    });
  };
  rescheduledCheckNo = (e) => {
    console.log(e.target.checked);
    this.setState({
      isSelected: false,
      rescheduledCheck: e.target.checked,
    });
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <React.Fragment>
        <div className="component-wrapper vewaljobs">
          <div className="vendor-info p-10 _fl sdw">
            <div className="vn-form _fl">
              <div className="row">
                <div className="col-md-4">
                  <div className="vn_frm">
                    {" "}
                    <span>Client</span>
                    <div className="bts-drop">
                      <div className="dropdown bootstrap-select">
                        <SelectBox
                          value={this.state.clientData}
                          optionData={this.state.clientArr}
                          onSelectChange={(value) => {
                            this.onClientChamge(value);
                          }}
                        />

                        <div className="dropdown-menu " role="combobox">
                          <div
                            className="inner show"
                            role="listbox"
                            aria-expanded="false"
                            tabindex="-1"
                          >
                            <ul className="dropdown-menu inner show"></ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  {/* <div className="vn_frm">
                    <input
                      type="text"
                      value=""
                      name=""
                      placeholder="Search"
                      className="inputfield"
                    />
                  </div> */}
                </div>
                <div className="col-md-4">
                  {/* <div className="_fl verificaiton-doc-tab ven">
                    <ul>
                      <li className="active" data-related="tble-data-a">
                        All Jobs
                      </li>
                      <li data-related="tble-data-b">History</li>
                    </ul>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="table-filter-app">
            <div className="row">
              <div className="col-md-6">
                <div className="cus-filter-btn">
                  <button className="button">
                    <img src={ImageName.IMAGE_NAME.MENU_BTN} />
                  </button>
                  <button className="button">
                    <img src={ImageName.IMAGE_NAME.MENU_BTN_ONE} />
                  </button>
                  <button className="button">
                    <img src={ImageName.IMAGE_NAME.MENU_BTN_TWO} />
                  </button>

                  <div className="filter-btn" style={{ paddingLeft: "20px" }}>
                    <a
                      href="#"
                      onClick={this.filterModal}
                      // data-toggle="modal"
                      // data-target="#create-filter-model"
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
                    <button
                      className="next_btn"
                      onClick={this.exRigth}
                    ></button>
                  </div>

                  <div className="tble-short">
                    {" "}
                    <span className="lbl">Job Status</span>
                    <div className="dropdwn" style={{ width: "85px" }}>
                      <select
                        className="myDropdown_status frm4-select"
                        onChange={this.onChangeStatus}
                      ></select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="table-filter-box">
                  <div className="export-btn" onClick={this.onExport}>
                    <a href="">Export</a>
                  </div>
                  <div className="addnew">
                    <a href="#">Add New</a>
                  </div>
                  <div className="tble-short">
                    {" "}
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

          <div className="tab-app-information activeLnk" id="tble-data-a">
            <div className="table-listing-app">
              <div className="table-responsive_cus table-style-a">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tbody>
                    <tr>
                      <th style={{ width: "9%" }}>Job#</th>
                      <th style={{ width: "9%" }}>Client</th>
                      {/* <th style={{ width: "9%" }}>Requester</th> */}
                      <th style={{ width: "9%" }}>LEI</th>
                      <th style={{ width: "9%" }}>Appointment Type</th>
                      <th style={{ width: "13%" }}>Date & Time</th>
                      <th style={{ width: "14%" }}>Location</th>
                      <th style={{ width: "10%" }}>
                        <div className="source-languge source_lang">
                          Language
                        </div>
                      </th>
                      {/* <th style={{ width: "8%" }}>Target Language</th> */}
                      <th style={{ width: "11%" }}>Status</th>
                      <th style={{ width: "4%" }}>Action</th>
                    </tr>
                    {this.state.listData.map((item, key) => (
                      <tr>
                        <td colspan="11">
                          <div className="tble-row">
                            <table
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                            >
                              <tbody>
                                <tr>
                                  <td style={{ width: "9%" }}>{item.jobId}</td>
                                  <td style={{ width: "9%" }}>{item.client}</td>
                                  {/* <td style={{ width: "9%" }}>
                                    {item.requester}
                                  </td> */}
                                  <td style={{ width: "9%" }}>{item.lei}</td>
                                  <td style={{ width: "9%" }}>
                                    <div className="f2f">
                                      {item.appointmentType}
                                    </div>
                                  </td>
                                  <td style={{ width: "13%" }}>
                                    {item.dateTime}
                                  </td>
                                  <td style={{ width: "14%" }}>
                                    {item.location}
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    {item.sourceLang}
                                    {">"}
                                    {<br />}
                                    {item.targetLang}
                                  </td>
                                  {/* <td style={{ width: "8%" }}>
                                    {item.targetLang}
                                  </td> */}
                                  <td style={{ width: "11%" }}>
                                    {item.status === 0 ? (
                                      <React.Fragment>
                                        <span className="progress-btn yellow">
                                          Approved
                                        </span>
                                      </React.Fragment>
                                    ) : item.status === 1 ? (
                                      <React.Fragment>
                                        <span
                                          href="#"
                                          className="progress-btn sky"
                                        >
                                          Approved
                                        </span>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment></React.Fragment>
                                    )}
                                  </td>
                                  <td style={{ width: "4%" }}>
                                    {/* <div classNameName="tbl-editing-links">
                                      <button className="tr-toggle">
                                        <img
                                          src={
                                            ImageName.IMAGE_NAME.MENU_VERTICAL
                                          }
                                        />
                                      </button>
                                      <div className="tbl-drop-links">
                                        <ul>
                                          <li>
                                            <a href="#">Rate Cards</a>
                                          </li>
                                          <li>
                                            <a href="#">Verification Docs</a>
                                          </li>
                                          <li>
                                            <a href="#">Invoices</a>
                                          </li>
                                          <li>
                                            <a href="#">Chat</a>
                                          </li>
                                        </ul>
                                      </div>
                                    </div> */}
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
                                      <MenuItem>View Details</MenuItem>
                                      <MenuItem>Chat</MenuItem>
                                      <MenuItem onClick={this.declineModal}>
                                        Cancel
                                      </MenuItem>
                                    </Menu>
                                    {/* </div> */}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ..................modal................................. */}
          <div
            id="filter-model"
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
          </div>
        </div>
        {/* ..................Decline modal................................. */}
        <div
          id="decline-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-md modal-dialog-centered decline-modal-width">
            <div className="modal-content" style={{ width: "100%" }}>
              <div className="cancel-job-head">
                <div className="row">
                  <div className="col-md-12">
                    <h2>
                      Cancel Job{" "}
                      <span style={{ fontSize: "17px", marginLeft: "7px" }}>
                        (Interpretation)
                      </span>
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
              {/* <div className="modal-body">
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
              </div> */}
              <div className="modal-body">
                <div className="create-jeneral-wrap _fl">
                  <div className="create-row-app">
                    <div className="row" style={{ marginBottom: "15px" }}>
                      <div className="col-md-6">
                        <div className="web-form-app">
                          <div className="web-form-bx selct">
                            <div className="frm-label lblSize">
                              Reason for Cancellation
                            </div>
                            <div className="dropdwn selct">
                              <SelectBox
                                optionData={cancelationArr}
                                value={this.state.cancellationData}
                                onSelectChange={(value) => {
                                  this.onCancelDataChange(value);
                                }}
                              />
                            </div>
                          </div>
                          <div className="web-form-bx selct">
                            <div className="frm-label lblSize">
                              Other Reason
                            </div>
                            <div
                              className="form-input-fields"
                              style={{ marginBottom: "20px" }}
                            >
                              <textarea
                                value={this.state.otherReason}
                                placeholder=""
                                className="in-textarea msg min table-style"
                                onChange={this.onOtherReasonChange}
                              ></textarea>
                            </div>
                          </div>

                          <div className="web-form-bx selct">
                            <div className="frm-label lblSize">
                              Is the job rescheduled?
                            </div>
                            <div className="check-field">
                              <label className="checkbox_btn">
                                <input
                                  type="radio"
                                  name="radio1"
                                  onClick={(e) => this.rescheduledCheckYes(e)}
                                />
                                <span className="checkmark3"></span> Yes
                              </label>
                            </div>
                            <div className="check-field">
                              <label className="checkbox_btn">
                                <input
                                  type="radio"
                                  name="radio1"
                                  onClick={(e) => this.rescheduledCheckNo(e)}
                                />
                                <span className="checkmark3"></span> No
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="row" style={{ marginTop: "20px" }}>
                      <div className="col-md-6">
                        <div className="web-form-bx selct">
                          <div className="table-style">
                            <div style={{ borderBottom: "1px solid #c6c8c8" }}>
                              <td
                                style={{
                                  borderRight: "1px solid #c6c8c8",
                                  width: "230px",
                                }}
                              >
                                Cancellation Charges Applicable
                              </td>
                              <td style={{ color: "#d9dada" }}>Yes</td>
                            </div>
                            <div>
                              <td
                                style={{
                                  borderRight: "1px solid #c6c8c8",
                                  width: "230px",
                                }}
                              >
                                Cancellation Amount
                              </td>
                              <td style={{ color: "#d9dada" }}>$ 10.00</td>
                            </div>
                            
                          </div>
                        </div>
                      </div>
                    </div> */}

                    <div className="row">
                      <div className="col-md-6"></div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="web-form-bx selct">
                          <div className="_button-style _fl text-center">
                            <a
                              href="#"
                              className="white-btn"
                              onClick={this.declineClose}
                              style={{ textDecoration: "none" }}
                            >
                              cancel
                            </a>
                            <a
                              href="#"
                              className="blue-btn"
                              style={{ textDecoration: "none" }}
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
          </div>
        </div>

        <div
          className="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}
