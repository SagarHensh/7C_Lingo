import React, { Component } from "react";
import history from "../../../../history";
// import "./ServiceCategoryList.css";
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


const reqData = {
    limit: "",
    offset: "", //starting index of page
      searchfrom:"",
      searchto:"",
      search:"",
      status:""
}

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


export default class IndustryTypeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      current_page: 1,
      total_page: 10,
      limit: 20,
      display: "",
      industryType: "",
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
      industryCount:"",
      listData: [],

      selectedStatus:{}
    };
  }

  componentDidMount() {
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
    let resData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit), //starting index of page
    };

    let returnData = Object.assign(reqData,resData)

    // consoleLog("return::",returnData)
    this.listApi(returnData);
  };

  listApi = async (data) => {
    consoleLog("req data::",data);
    const res = await ApiCall("fetchIndustryTypeList", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);

      let totalPage = Math.ceil(decodeData.data.count / this.state.limit);
      consoleLog("data:::", decodeData.data);
      if (decodeData.data.industryData && decodeData.data.industryData.length > 0) {
        this.setState({
          listData: decodeData.data.industryData,
          total_page: totalPage,
          industryCount:decodeData.data.count
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

  //.....................function for MenuButton close..............
  handleMenuClose = () => {
    this.setState({
      check: false,
      anchorEl: null,
    });
  };

  // ........................Searching.............................
  handleIndustryTypeChange = (value) => {
    this.setState({
      industryType: value,
    });

    let resData = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
        search:value ,
        searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
        searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value
      };
  
      let returnData = Object.assign(reqData,resData);

    this.listApi(returnData);
  };

  //   ..........add new button.......................
  addNew = () => {
    return history.push("/adminAddIndustryType");
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
      pathname: "/adminEditIndustryType",
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
    let status = await ApiCall("changeStatusIndustryType", data);
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

    let resData = {
        limit: JSON.stringify(this.state.limit),
      offset: "0",
        search:this.state.industryType,
        searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
        searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value
    
      };
  
      let returnData = Object.assign(reqData,resData)
    this.listApi(returnData);
  };

  // This is goes to the last page
  exRigth = () => {
    let totalPage = this.state.total_page;
    this.setState({
      current_page: totalPage,
    });

    let resData = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((totalPage - 1) * this.state.limit),
        search:this.state.industryType,
        searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
        searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value
    
      };
  
      let returnData = Object.assign(reqData,resData)
    this.listApi(returnData);
  };

  // This is goes to the first page
  prev = () => {
    let currentPage = this.state.current_page;
    if (currentPage > 1) {
      currentPage--;
      this.setState({
        current_page: currentPage,
      });

    }
    let resData = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((currentPage - 1) * this.state.limit),
        search:this.state.industryType,
        searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
        searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value
    
      };
  
      let returnData = Object.assign(reqData,resData)
    this.listApi(returnData);
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
    }

    let resData = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((currentPage - 1) * this.state.limit),
        search:this.state.industryType,
        searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
        searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value
    
      };
  
      let returnData = Object.assign(reqData,resData)
    this.listApi(returnData);
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

//   ascOrder = (data) => {
//     let filter = "";
//     if (data === "serviceCategory") {
//       filter = "name";
//     } else if (data === "createdBy") {
//       filter = "createdBy";
//     } else if (data === "lastUpdated") {
//       filter = "lastUpdated";
//     }

//     let req = {
//       limit: JSON.stringify(this.state.limit),
//       offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
//       search: this.state.department,
//       orderby: filter,
//       direc: "ASC",
//     };

//     this.listApi(req);
//   };

  //......Descending order .........

//   descOrder = (data) => {
//     let filter = "";
//     if (data === "serviceCategory") {
//       filter = "name";
//     } else if (data === "createdBy") {
//       filter = "createdBy";
//     } else if (data === "lastUpdated") {
//       filter = "lastUpdated";
//     }

//     let req = {
//       limit: JSON.stringify(this.state.limit),
//       offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
//       search: this.state.department,
//       orderby: filter,
//       direc: "DESC",
//     };

//     this.listApi(req);
//   };

  //........Page show Limit.........

  onChangeLimit = (dat) => {
    this.setState({
      limit: parseInt(dat.value),
      current_page:1
    });

    let resData = {
        limit: dat.value,
        offset: "0",
        search:this.state.industryType,
        searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
        searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value
    
      };
  
      let returnData = Object.assign(reqData,resData)
    this.listApi(returnData);

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
   

    let resData = {
        limit: JSON.stringify(this.state.limit),
      offset: "0",
        search:this.state.industryType,
        searchto: this.state.toDate == "" ? "" : SetScheduleDate(this.state.toDate),
        searchfrom: this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value
    
      };
  
 
    this.listApi(resData);
    

    this.closeFilterModal();
    this.setState({
      current_page:1
    })
    

   
  };

  onResetFilter = () => {
      this.reset();
      let resData = {
        limit: JSON.stringify(this.state.limit),
      offset: "0",
        search:"",
        searchfrom:"",
        searchto:"",
        status:""
      };
  

    this.listApi(resData);
   
    this.closeFilterModal();
    this.setState({
      current_page:1
    })

    
  };

  reset = () => {
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
  }

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <React.Fragment>
        {/* <div className="wrapper">
        <Header /> */}
        <ToastContainer hideProgressBar theme="colored" />
        {/* <Sidebar /> */}
        <div className="component-wrapper">
          <div className="listing-component-app">
            <div
              className="vn_frm"
              style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
            >
              {" "}
              <Link to="/adminDashboard">Dashboard</Link> / Industry Type
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
                  <div className="col-md-7">
                    {/* <div className="vn_frm">
                      <span style={{ width: "28%", fontSize: "14px" }}>
                        Industry Type
                      </span>
                      <input
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.industryCount}
                        style={{ color: "#9f8f93" ,width:"100px",textAlign:"center"}}
                        onTextChange={(value) => {
                          this.handleServiceCategoryChange(value);
                        }}
                        disabled
                      />
                    </div> */}
                  </div>
                  {/* <div className="col-md-4"></div> */}
                  <div className="col-md-5">
                    <div className="vn_frm">
                      <span style={{ width: "28%", fontSize: "12px" }}>
                        Industry Type
                      </span>
                      <InputText
                        placeholder="Search"
                        className="inputfield"
                        value={this.state.industryType}
                        style={{ color: "#9f8f93" }}
                        onTextChange={(value) => {
                          this.handleIndustryTypeChange(value);
                        }}
                        // isDisabled
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
                <div className="addnew" onClick={this.addNew}>
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
                    <th style={{ width: "20%" }}>Industry Type</th>

                   

                    <th style={{ width: "20%" }}>Last Modified On</th>

                    <th style={{ width: "8%" }}>Status</th>
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
                                  <td style={{ width: "20%" }}>{item.name}</td>
                                  {/* <td style={{ width: "20%" }}>
                                    {item.createdBy}
                                  </td> */}
                                  <td style={{ width: "20%" }} id="date-td">
                                    {SetDateFormat(item.lastUpdated)}{" "}
                                    {SetTimeFormat(item.lastUpdated)}
                                  </td>
                                  <td style={{ width: "8%" }} id="one-text-td">
                                  {item.status === 0 ? (
                                    <React.Fragment>
                                      <span className="progress-btn grey">
                                        Inactive
                                      </span>
                                    </React.Fragment>
                                  ) : item.status === 1 ? (
                                    <React.Fragment>
                                      <span
                                        href="#"
                                        className="progress-btn sky"
                                      >
                                        Active
                                      </span>
                                    </React.Fragment>
                                  ) : (<React.Fragment/>)}
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
                    <div className="lable-text">requested on</div>
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
                    </div>
                  </div>
                  <div className="m-select _fl">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="sf-row">
                          <div class="lable-text">Status</div>
                          <div class="dropdwn">
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
              <div className="delete-head">Delete Industry Type</div>
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