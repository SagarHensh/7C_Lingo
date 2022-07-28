import { Menu, MenuItem } from "@mui/material";
import React, { Component } from "react";
import { AlertMessage, ImageName } from "../../../../enums";
import { Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { ApiCall, ApiCallClient } from "../../../../services/middleware";
import { PaginationDropdown, SelectBox } from "../../SharedComponents/inputText";
import Select, { components } from "react-select";
import $ from "jquery";
// import "./viewAllJobs.css";
import {
  consoleLog,
  SetDateFormat,
  SetTimeFormat,
} from "../../../../services/common-function";
import { toast, ToastContainer } from "react-toastify";
import ReactLoader from "../../../Loader";
import { inputEmptyValidate } from "../../../../validators";
import ViewCalender from "../../../ReactBigCalender/ViewCalender";
import { Link } from "react-router-dom";

const customStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
    borderRadius: "6px",
    height: 50,
    minHeight: 50,
    textAlign: "center",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = "yellow";
    return {
      ...styles,
      color: isFocused ? "grey" : "white",
      color: "#000",
      cursor: isDisabled ? "not-allowed" : "default",
    };
  },
};
const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img
        src={ImageName.IMAGE_NAME.DOWN_ARROW_BLUE}
        style={{ width: "17px" }}
      />
    </components.DropdownIndicator>
  );
};

const cancelationArr = [
  {
    label: "Last minute reschedule ",
    value: 1,
  },
  {
    label: "Duplicate/Error ",
    value: 2,
  },
  {
    label: "Consumer No Show",
    value: 3,
  },
  {
    label: "Interpreter No Show",
    value: 4,
  },
  {
    label: "Other Service being utilized",
    value: 5,
  },
  {
    label: "Other ",
    value: 6,
  },
];

const reqData = {
  limit: "",
  offset: "",
  status: "",
  clientId: "",
  serviceType: "",
  orderby: "",
  direc: "",
  searchFrom: "",
  searchTo: "",
  rfqId: "",
  clientid:""
};

export default class JobDetailsOfClient extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad: true,
      isAlljobs: true,
      isHistory: false,
      current_page: 1,
      total_page: 10,
      limit: 20,
      anchorEl: null, //menu button
      anchorEl1: null,
      cancellationData: {},
      rescheduledCheck: null,
      isSelected: null,
      clientArr: [],
      clientData: {},
      appointmentTypeArr: [],
      appointmentTypeData: {},
      targetLangData: {},
      sourceLangData: {},
      languageArr: [],
      statusArr: [],
      statusData: {},
      leiArr: [],
      leiData: {},
      industryArr: [],
      industryData: {},
      otherReason: "",
      formDate: "",
      toDate: "",
      selectedDisplayData: {
        label: "20",
        value: "20"
      },
      listData: [],
      historyList: [],
      historyTotalPage: "",
      appointmentDate: "",
      hour: "08",
      min: "00",
      ampm: "AM",
      isOtherReason: false,
      rescheduleNote: "",
      isCalender: false,
      calenderData : [],
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();

    var classInstance = this;
    // When the user clicks anywhere outside of the modal, close it

    document.getElementById("backdrop").style.display = "none";
    var modal = document.getElementById("decline-model");
    var filterModal = document.getElementById("filter-model");
    window.onclick = function (event) {
      if (event.target == modal) {
        classInstance.closeDeleteModal();
      } else if (event.target == filterModal) {
        classInstance.closeModal();
      }
    };

    window.$(".verificaiton-doc-tab ul li").on("click", function () {
      $(".verificaiton-doc-tab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
    });
    // this.load();
  }

  load = async () => {
    let languageArrData = [],
      languageObjData = {},
      languageResArrData = [],
      industryDataArr = [],
      industryArr = [],
      leiDataArr = [],
      leiArr = [],
      statusDataArr = [];

    // ....................For List Data..........................................

    let mainData = this.props.location,
        preData = mainData.state;

        consoleLog("preData::",preData)

        if(preData){
            let fetchData = {
                limit: JSON.stringify(this.state.limit),
                offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
                clientid:preData.userId
              };
              let returnData = Object.assign(reqData, fetchData);
              this.listApi(returnData);
        }

   

    //For language dropdown in filter
    let languageResData = await ApiCall("getlanguagelist");
    let languagePayload = Decoder.decode(languageResData.data.payload);
    languageResArrData = languagePayload.data.languagelist;
    for (let n = 0; n < languageResArrData.length; n++) {
      languageArrData.push({
        label: languageResArrData[n].language,
        value: languageResArrData[n].id,
      });
      if (languageResArrData[n].language === "English") {
        languageObjData = {
          label: languageResArrData[n].language,
          value: languageResArrData[n].id,
        };
      }
    }

    let lookupres = await ApiCall("getLookUpData");
    if (
      lookupres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      lookupres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(lookupres.data.payload);

      industryDataArr = payload.data.lookupdata.INDUSTRY_TYPE;

      for (let j = 0; j < industryDataArr.length; j++) {
        industryArr.push({
          label: industryDataArr[j].name,
          value: industryDataArr[j].id,
        });
      }
    }

    let leiRes = await ApiCall("getAllLeiList");
    if (
      leiRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      leiRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(leiRes.data.payload);

      leiDataArr = payload.data.leiList;
      for (let k = 0; k < leiDataArr.length; k++) {
        leiArr.push({
          label: leiDataArr[k].name,
          value: leiDataArr[k].userId,
        });
      }
    }

    // let statusRes = await ApiCall("getInterpretionJobStatuslist");
    // if (
    //   statusRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   statusRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {
    //   let payload = await Decoder.decode(statusRes.data.payload);
    //   statusDataArr = payload.data.statusList;
    // }
    // ............................................................
    let clientDataArr = [];

    let clientinfoRes = await ApiCall("getallclinetinfo");
    if (
      clientinfoRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      clientinfoRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let clientPayload = Decoder.decode(clientinfoRes.data.payload);
      let clientResData = clientPayload.data.clientlist;
      for (let i = 0; i < clientResData.length; i++) {
        clientDataArr.push({
          label: clientResData[i].clientName,
          value: clientResData[i].clientid,
        });
      }
    }

    this.setState({
      clientArr: clientDataArr,
      sourceLangData: languageObjData,
      targetLangData: languageObjData,
      languageArr: languageArrData,
      industryArr: industryArr,
      leiArr: leiArr,
      isLoad: false,
    });
  };


  listApi = async (data) => {
    //...... For All jobs listing.............
    const res = await ApiCallClient("getApprovedInterpretationRFQListByClient", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      consoleLog("InterpretationList:::", decodeData.data)
      let listDetails = [];
      if (decodeData.data.projectList.length > 0) {
        listDetails = decodeData.data.projectList;
      }
      let totalPage = Math.ceil(
        decodeData.data.projectCount / parseInt(this.state.limit)
      );
      this.setState({
        listData: listDetails,
        total_page: totalPage,
      });
    }

    //..............for history interpretation listing...............
    // const resHistory = await ApiCall("getCompleteInterpretationRFQList", data);
    // if (
    //   resHistory.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   resHistory.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {
    //   const decodeData1 = Decoder.decode(resHistory.data.payload);
    //   let historyDetails = [];
    //   if (decodeData1.data.projectList.length > 0) {
    //     historyDetails = decodeData1.data.projectList;
    //   }
    //   let totalPage1 = Math.ceil(
    //     decodeData1.data.projectCount / parseInt(this.state.limit)
    //   );
    //   this.setState({
    //     historyList: historyDetails,
    //     historyTotalPage: totalPage1,
    //   });
    // }
  };


  // .............filter modal function...................

  onClientChamge = (data) => {
    let fetchData = {
      clientId: data.value,
    };
    let returnData = Object.assign(reqData, fetchData);
    this.listApi(returnData);

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

  onChangeLimit = (value) => {
    this.setState({
      limit: parseInt(value.value),
      selectedDisplayData: value
    });

    let limit = value.value;

    let data = {
      limit: limit,
      offset: JSON.stringify(
        (this.state.current_page - 1) * parseInt(value.value)
      ),
    };
    let returnData = Object.assign(reqData, data);

    this.listApi(returnData);
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
  openHistoryModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("history-model").style.display = "block";
    document.getElementById("history-model").classList.add("show");
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
    // document.getElementById("history-model").style.display = "none";
    // document.getElementById("history-model").classList.remove("show");
  };

  closeDeleteModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("decline-model").style.display = "none";
    document.getElementById("decline-model").classList.remove("show");
    // document.getElementById("history-model").style.display = "none";
    // document.getElementById("history-model").classList.remove("show");
  };

  filterModal = () => {
    this.openModal();
    this.handleMenuClose();
  };
  declineModal = () => {
    this.openDeclineModal();
    this.handleMenuClose();
  };
  historyModal = () => {
    this.openHistoryModal();
    this.handleMenuClose();
  };
  declineClose = () => {
    this.setState({
      declineMessage: "",
    });
    this.closeDeleteModal();
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

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
      anchorEl1: null,
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
    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
    };
    let returnData = Object.assign(reqData, fetchData);
    this.listApi(returnData);
  };

  // This is goes to the last page
  exRigth = () => {
    let totalPage = this.state.total_page;
    this.setState({
      current_page: totalPage,
    });
    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit),
    };
    let returnData = Object.assign(reqData, fetchData);
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
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((currentPage - 1) * this.state.limit),
      };
      let returnData = Object.assign(reqData, fetchData);
      this.listApi(returnData);
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
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((currentPage - 1) * this.state.limit),
      };
      let returnData = Object.assign(reqData, fetchData);
      this.listApi(returnData);
    }
  };

  onFilterApply = () => {
    // let fetchData = {
    //   limit: JSON.stringify(this.state.limit),
    //   offset: "0",
    //   searchto: this.state.toDate,
    //   searchfrom: this.state.formDate,
    //   status: "",
    //   clientId: "",
    //   serviceType: "",
    //   orderby: "",
    //   direc: "",
    //   rfqId: "",
    // };
    // let returnData = Object.assign(reqData, fetchData);
    // this.listApi(returnData);
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
    if (data.value === 1) {
      this.setState({
        isSelected: true,
        isOtherReason: false
      })
    } else if (data.value === 6) {
      this.setState({
        isSelected: false,
        isOtherReason: true
      })
    } else {
      this.setState({
        isSelected: false,
        isOtherReason: false
      })
    }

    this.setState({
      cancellationData: data,
    });
  };


  rescheduledCheckYes = (e) => {
    // console.log(e.target.checked);
    this.setState({
      isSelected: true,
      rescheduledCheck: e.target.checked,
    });
  };
  rescheduledCheckNo = (e) => {
    // console.log(e.target.checked);
    this.setState({
      isSelected: false,
      rescheduledCheck: e.target.checked,
    });
  };

  onRescheduleNote = (e) => {
    this.setState({
      rescheduleNote: e.target.value
    })
  }

  onDeclineSubmit = async () => {
    let errorCount = 0;

    let validateCancelReason = inputEmptyValidate(this.state.cancellationData);

    // if (validateInterpretationFee === false) {
    if (validateCancelReason === 0) {
      toast.error(AlertMessage.MESSAGE.JOB.EMPTY_MAIN_REASON, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      let data = {
        requestId: this.state.listData[this.state.curIndex].id,
        selectReason:
          this.state.cancellationData.value === 6
            ? this.state.otherReason
            : this.state.cancellationData.label,
        isScheduled: this.state.isSelected ? 1 : 0,
      };
      let res = await ApiCall("cancelJobDetails", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.JOB.CANCEL, {
          hideProgressBar: true,
        });
        this.declineClose();
        this.load();
      }
    }
  };

  onCreateOffer = () => {
    // console.log("hello");
    this.props.history.push({
      pathname: "/adminVendorOffer",
      state: this.state.listData[this.state.curIndex],
    });

    // window.location.reload(false);
  };

  onTabClick = (value) => {
    if (value === "alljobs") {
      this.setState({
        // interpretationModal: true,
        // translationModal: false,
        // trainingModal: false,
        isAlljobs: true,
        isHistory: false,
        // isTraining: false,
      });
    } else if (value === "history") {
      this.setState({
        // interpretationModal: false,
        // translationModal: true,
        // trainingModal: false,
        // isInterpretation: false,
        // isTranslation: true,
        // isTraining: false,
        isAlljobs: false,
        isHistory: true,
      });
    }
  };

  onAppointmentTypeChange = (data) => {
    this.setState({
      appointmentTypeData: data,
    });
  };
  onTargetLangChange = (data) => {
    this.setState({
      targetLangData: data,
    });
  };
  onsourceLangChange = (data) => {
    this.setState({
      sourceLangData: data,
    });
  };
  onStatusChange = (data) => {
    this.setState({
      statusData: data,
    });
  };
  onLeiChange = (data) => {
    this.setState({
      leiData: data,
    });
  };
  onIndustryChange = (data) => {
    this.setState({
      industryData: data,
    });
  };

  appointmentdateChange = (e) => {
    this.setState({
      appointmentDate: e.target.value
    })
  }

  hourChange = () => {
    let hr = parseInt(this.state.hour) + 1;
    if (parseInt(this.state.hour) + 1 > 12) {
      this.setState({
        hour: "01"
      })
    } else {
      if (parseInt(this.state.hour) + 1 > 9) {
        this.setState({
          hour: hr
        })
      } else {
        this.setState({
          hour: "0" + hr
        })
      }
    }
  }

  minChange = () => {
    let min = parseInt(this.state.min) + 1;
    if (parseInt(this.state.min) + 1 > 59) {
      this.setState({
        min: "00"
      })
    } else {
      if (parseInt(this.state.min) + 1 > 9) {
        this.setState({
          min: min
        })
      } else {
        this.setState({
          min: "0" + min
        })
      }
    }
  }

  ampmChange = () => {
    if (this.state.ampm === "AM") {
      this.setState({
        ampm: "PM"
      })
    } else {
      this.setState({
        ampm: "AM"
      })
    }
  }

  goEdit = () => {
    this.props.history.push({
      pathname: "/adminJobDetails",
      state: this.state.listData[this.state.curIndex].id,
    });
  };

  openTable = () => {
    this.setState({
      isCalender: false
    })
  }

  openCalender = async() => {

    let mainData = this.props.location,
    preData = mainData.state;

    consoleLog("preData::",preData)

    if(preData){
        let fetchData = {
          status: "",
          clientId: "",
          serviceType: "",
          orderby: "",
          direc: "",
          searchFrom: "",
          searchTo: "",
          rfqId: "",
          clientid:preData.userId
          };
   

   
    //...... For All jobs listing for calender.............
    const res = await ApiCallClient("getApprovedInterpretationRFQListByClient", fetchData);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      let listDetails = [];
      if (decodeData.data.projectList.length > 0) {
        listDetails = decodeData.data.projectList;
      }
      consoleLog("CalenderDAta : ", listDetails)
      this.setState({
        calenderData: listDetails,
        isCalender: true
      });
    }
       
  }

  }

  detailJob = (value) => {
    // consoleLog("Calender Click", value);
    this.setState({
      curIndex: value.curIndex
    });

    this.props.history.push({
      pathname: "/adminJobDetails",
      state: this.state.calenderData[value.curIndex].id,
    });

  }

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    const open1 = Boolean(this.state.anchorEl1);
    return (
      <React.Fragment>
        <ToastContainer hideProgressBar theme="colored" />
        {/* <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div> */}
        <div className="component-wrapper vewaljobs">
          {/* <ReactLoader /> */}
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            {" "}
           <Link to="/adminDashboard">Dashboard</Link> / <Link to="/adminClientList">Client</Link> / All Jobs
          </div>
          <div className="vendor-info p-10 _fl sdw">
            <div className="vn-form _fl">

            <div className="row"></div>
            <div className="row" style={{ marginTop: "20px" }}>
                  <div className="col-md-6 rateList">
                    <div className="_fl verificaiton-doc-tab">
                      <ul>
                        <li
                          className="active"
                          data-related="tble-data-a"
                          onClick={() => {
                            this.onTabClick("interpretation");
                          }}
                          style={{width:"100%"}}
                        >
                          InterPretation
                        </li>
                        
                      </ul>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          <div className="table-filter-app">
            {!this.state.isCalender ? <React.Fragment>
              <div className="row">
                <div className="col-md-6">
                  <div className="cus-filter-btn">
                    <button className="button">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN} onclick={this.openTable} />
                    </button>
                    {/* <button className="button">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN_ONE} />
                    </button> */}
                    <button className="button">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN_TWO} onClick={this.openCalender} />
                    </button>

                    {/* <div
                    class="filter-btn"
                    style={{ float: "none", paddingLeft: "10px" }}
                  >
                    <a href="#" onClick={this.filterModal}>
                      Filter
                    </a>
                  </div> */}

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
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="table-filter-box">
                    {/* <div className="export-btn" onClick={this.onExport}>
                    <a href="">Export</a>
                  </div>
                  <div className="addnew">
                    <a href="#">Add New</a>
                  </div> */}
                    <div className="tble-short">
                      {" "}
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
              </div>
            </React.Fragment> : <React.Fragment>
              <div className="row">
                <div className="col-md-6">
                  <div className="cus-filter-btn">
                    <button className="button" onClick={this.openTable}>
                      <img src={ImageName.IMAGE_NAME.GREY_HAMBURGER} style={{ width: "20px", marginTop: "15px" }} />
                    </button>
                    <button className="button" onClick={this.openCalender}>
                      <img src={ImageName.IMAGE_NAME.BLUE_CALENDER} style={{ width: "20px", marginTop: "15px" }} />
                    </button>
                  </div>
                </div>
              </div>
            </React.Fragment>
            }
          </div>

          {this.state.isCalender ? <React.Fragment>
            <div className="table-listing-app">
              <ViewCalender id={this.state.calenderData} detailClick={(value) => { this.detailJob(value) }} type="job" />
            </div>
          </React.Fragment> :
            <React.Fragment>

              <div
                className="tab-app-information activeLnk"
                id="tble-data-a"
                hidden={!this.state.isAlljobs}
              >
                <div className="table-listing-app">
                  <div className="table-responsive_cus table-style-a">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tbody>
                        <tr>
                          <th style={{ width: "10%" }}>Job#</th>
                         
                          {/* <th style={{ width: "9%" }}>Requester</th> */}
                          <th style={{ width: "9%" }}>LEI</th>
                          <th style={{ width: "9%" }}>Appointment Type</th>
                          <th style={{ width: "13%" }}>Date & Time</th>
                          <th style={{ width: "14%" }}>Location</th>
                          <th style={{ width: "10%" }}>
                            Language{" "}
                            {/* <img src={ImageName.IMAGE_NAME.GREATER_THAN_ARROW} /> */}
                          </th>
                          {/* <th style={{ width: "8%" }}>Target Language</th> */}
                          <th style={{ width: "11%" }}>Status</th>
                          <th style={{ width: "4%" }}>Action</th>
                        </tr>
                        {this.state.listData.length > 0 ? (<React.Fragment>
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
                                        <td style={{ width: "10%" }}>
                                          {item.requestId}
                                        </td>
                                       
                    
                                        <td style={{ width: "9%" }}>
                                          {item.leiName}
                                        </td>
                                        <td style={{ width: "9%" }}>
                                          <div className="f2f">
                                            {item.appointmenttype}
                                          </div>
                                        </td>
                                        <td style={{ width: "13%" }}>
                                          {SetDateFormat(item.date)}
                                          {"|"}
                                          {item.time}
                                        </td>
                                        <td style={{ width: "14%" }}>
                                          {item.location}
                                        </td>
                                        <td style={{ width: "10%" }}>
                                          {item.sourceLanguage} {">"}
                                          {<br />}
                                          {item.targetLanguage}
                                        </td>
                                        {/* <td style={{ width: "8%" }}></td> */}
                                        <td style={{ width: "11%" }}>
                                          {item.status === 0 ? (
                                            <React.Fragment>
                                              <span className="progress-btn yellow">
                                                Pending
                                              </span>
                                            </React.Fragment>
                                          ) : item.status === 1 ? (
                                            <React.Fragment>
                                              <span
                                                href="#"
                                                className="progress-btn sky"
                                              >
                                                Quote Sent
                                              </span>
                                            </React.Fragment>
                                          ) : item.status === 2 ? (
                                            <React.Fragment>
                                              <span
                                                href="#"
                                                className="progress-btn green"
                                              >
                                                Quote Accepted
                                              </span>
                                            </React.Fragment>
                                          ) : item.status === 3 ? (
                                            <React.Fragment>
                                              <span
                                                href="#"
                                                className="progress-btn sky"
                                              >
                                                offer Sent
                                              </span>
                                            </React.Fragment>
                                          ) : item.status === 4 ? (
                                            <React.Fragment>
                                              <span
                                                href="#"
                                                className="progress-btn blue"
                                              >
                                                Offer Accepted
                                              </span>
                                            </React.Fragment>
                                          ) : item.status === 5 ? (
                                            <React.Fragment>
                                              <span
                                                href="#"
                                                className="progress-btn red"
                                              >
                                                Offer Rejected
                                              </span>
                                            </React.Fragment>
                                          ) : item.status === 6 ? (
                                            <React.Fragment>
                                              <span
                                                href="#"
                                                className="progress-btn blue"
                                              >
                                                Bids Received
                                              </span>
                                            </React.Fragment>
                                          ) : item.status === 7 ? (
                                            <React.Fragment>
                                              <span
                                                href="#"
                                                className="progress-btn red"
                                              >
                                                Quote Rejected
                                              </span>
                                            </React.Fragment>
                                          ) : item.status === 8 ? (
                                            <React.Fragment>
                                              <span
                                                href="#"
                                                className="progress-btn green"
                                              >
                                                Assigned
                                              </span>
                                            </React.Fragment>
                                          ) : item.status === 9 ? (
                                            <React.Fragment>
                                              <span
                                                href="#"
                                                className="progress-btn yellow"
                                              >
                                                In Progress
                                              </span>
                                            </React.Fragment>
                                          ) : item.status === 10 ? (
                                            <React.Fragment>
                                              <span
                                                href="#"
                                                className="progress-btn green"
                                              >
                                                completed
                                              </span>
                                            </React.Fragment>
                                          ) : item.status === 11 ? (
                                            <React.Fragment>
                                              <span
                                                href="#"
                                                className="progress-btn red"
                                              >
                                                cancelled
                                              </span>
                                            </React.Fragment>
                                          ) : (
                                            <React.Fragment></React.Fragment>
                                          )}
                                        </td>
                                        <td style={{ width: "4%" }}>
                                          {item.status === 2 ? (
                                            <React.Fragment>
                                              <img
                                                src={
                                                  ImageName.IMAGE_NAME.MENU_VERTICAL
                                                }
                                                style={{ cursor: "pointer" }}
                                                id="basic-button"
                                                aria-controls="basic-menu"
                                                aria-haspopup="true"
                                                aria-expanded={
                                                  open ? "true" : undefined
                                                }
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
                                                <MenuItem onClick={this.goEdit}>
                                                  View Details
                                                </MenuItem>
                                                {/* <MenuItem
                                                  onClick={() => this.goEdit()}
                                                >
                                                  Create Offer
                                                </MenuItem>
                                                <MenuItem>Chat</MenuItem>
                                                <MenuItem onClick={this.declineModal}>
                                                  Cancel
                                                </MenuItem> */}
                                              </Menu>
                                            </React.Fragment>
                                          ) : (
                                            <React.Fragment>
                                              <img
                                                src={
                                                  ImageName.IMAGE_NAME.MENU_VERTICAL
                                                }
                                                style={{ cursor: "pointer" }}
                                                id="basic-button"
                                                aria-controls="basic-menu"
                                                aria-haspopup="true"
                                                aria-expanded={
                                                  open1 ? "true" : undefined
                                                }
                                                onClick={(e) =>
                                                  this.menuBtnhandleClick_b(key, e)
                                                }
                                              />
                                              <Menu
                                                id="basic-menu"
                                                anchorEl={this.state.anchorEl1}
                                                open={open1}
                                                onClose={this.handleMenuClose}
                                                MenuListProps={{
                                                  "aria-labelledby": "basic-button",
                                                }}
                                              >
                                                <MenuItem onClick={this.goEdit}>
                                                  View Details
                                                </MenuItem>

                                                {/* <MenuItem>Chat</MenuItem>
                                                <MenuItem onClick={this.declineModal}>
                                                  Cancel
                                                </MenuItem> */}
                                              </Menu>
                                            </React.Fragment>
                                          )}
                                          {/* </div> */}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>) : (<React.Fragment>
                          <tr style={{ textAlign: "center" }}>
                            <td colSpan="11">
                              <center style={{ fontSize: "20px" }}>
                                No data found !!!
                              </center>
                            </td>
                          </tr>
                        </React.Fragment>)}

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div
                className="tab-app-information"
                id="tble-data-b"
                hidden={!this.state.isHistory}
              >
                <div className="table-listing-app">
                  <div className="table-responsive_cus table-style-a">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tbody>
                        <tr>
                          <th style={{ width: "10%" }}>Job#</th>
                          <th style={{ width: "9%" }}>Client</th>
                          {/* <th style={{ width: "9%" }}>Requester</th> */}
                          <th style={{ width: "9%" }}>LEI</th>
                          <th style={{ width: "9%" }}>Appointment Type</th>
                          <th style={{ width: "13%" }}>Date & Time</th>
                          <th style={{ width: "14%" }}>Location</th>
                          <th style={{ width: "10%" }}>
                            Language{" "}
                            {/* <img src={ImageName.IMAGE_NAME.GREATER_THAN_ARROW} /> */}
                          </th>
                          {/* <th style={{ width: "8%" }}>Target Language</th> */}
                          <th style={{ width: "11%" }}>Status</th>
                          <th style={{ width: "4%" }}>Action</th>
                        </tr>
                        {this.state.historyList.length > 0 ? (<React.Fragment>
                          {this.state.historyList.map((item, key) => (
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
                                        <td style={{ width: "10%" }}>
                                          {item.requestId}
                                        </td>
                                        <td style={{ width: "9%" }}>
                                          {item.clientName}
                                        </td>
                                        {/* <td style={{ width: "9%" }}>
                                    {item.requester}
                                  </td> */}
                                        <td style={{ width: "9%" }}>
                                          {item.leiName}
                                        </td>
                                        <td style={{ width: "9%" }}>
                                          <div className="f2f">
                                            {item.appointmenttype}
                                          </div>
                                        </td>
                                        <td style={{ width: "13%" }}>
                                          {SetDateFormat(item.date)}
                                          {"|"}
                                          {item.time}
                                        </td>
                                        <td style={{ width: "14%" }}>
                                          {item.location}
                                        </td>
                                        <td style={{ width: "10%" }}>
                                          {item.sourceLanguage} {">"}
                                          {<br />}
                                          {item.targetLanguage}
                                        </td>
                                        {/* <td style={{ width: "8%" }}></td> */}
                                        <td style={{ width: "11%" }}>
                                          {item.status === 0 ? (
                                            <React.Fragment>
                                              <a
                                                href="javascript:void(0)"
                                                className="progress-btn yellow">
                                                Pending
                                              </a>
                                            </React.Fragment>
                                          ) : item.status === 1 ? (
                                            <React.Fragment>
                                              <a
                                                href="javascript:void(0)"
                                                className="progress-btn sky"
                                              >
                                                Quote Sent
                                              </a>
                                            </React.Fragment>
                                          ) : item.status === 2 ? (
                                            <React.Fragment>
                                              <a
                                                href="javascript:void(0)"
                                                className="progress-btn green"
                                              >
                                                Quote Accepted
                                              </a>
                                            </React.Fragment>
                                          ) : item.status === 3 ? (
                                            <React.Fragment>
                                              <a
                                                href="javascript:void(0)"
                                                className="progress-btn sky"
                                              >
                                                offer Sent
                                              </a>
                                            </React.Fragment>
                                          ) : item.status === 4 ? (
                                            <React.Fragment>
                                              <a
                                                href="javascript:void(0)"
                                                className="progress-btn blue"
                                              >
                                                Offer Accepted
                                              </a>
                                            </React.Fragment>
                                          ) : item.status === 5 ? (
                                            <React.Fragment>
                                              <a
                                                href="javascript:void(0)"
                                                className="progress-btn red"
                                              >
                                                Offer Rejected
                                              </a>
                                            </React.Fragment>
                                          ) : item.status === 6 ? (
                                            <React.Fragment>
                                              <a
                                                href="javascript:void(0)"
                                                className="progress-btn blue"
                                              >
                                                Bids Received
                                              </a>
                                            </React.Fragment>
                                          ) : item.status === 7 ? (
                                            <React.Fragment>
                                              <a
                                                href="javascript:void(0)"
                                                className="progress-btn red"
                                              >
                                                Quote Rejected
                                              </a>
                                            </React.Fragment>
                                          ) : item.status === 8 ? (
                                            <React.Fragment>
                                              <a
                                                href="javascript:void(0)"
                                                className="progress-btn green"
                                              >
                                                Assigned
                                              </a>
                                            </React.Fragment>
                                          ) : item.status === 9 ? (
                                            <React.Fragment>
                                              <a
                                                href="javascript:void(0)"
                                                className="progress-btn yellow"
                                              >
                                                In Progress
                                              </a>
                                            </React.Fragment>
                                          ) : item.status === 10 ? (
                                            <React.Fragment>
                                              <a
                                                href="javascript:void(0)"
                                                className="progress-btn green"
                                              >
                                                completed
                                              </a>
                                            </React.Fragment>
                                          ) : item.status === 11 ? (
                                            <React.Fragment>
                                              <a
                                                href="javascript:void(0)"
                                                className="progress-btn green"
                                              >
                                                cancelled
                                              </a>
                                            </React.Fragment>
                                          ) : (
                                            <React.Fragment></React.Fragment>
                                          )}
                                        </td>
                                        <td style={{ width: "4%" }}>
                                          {item.status === 2 ? (
                                            <React.Fragment>
                                              <img
                                                src={
                                                  ImageName.IMAGE_NAME.MENU_VERTICAL
                                                }
                                                style={{ cursor: "pointer" }}
                                                id="basic-button"
                                                aria-controls="basic-menu"
                                                aria-haspopup="true"
                                                aria-expanded={
                                                  open ? "true" : undefined
                                                }
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
                                                <MenuItem onClick={this.goEdit}>
                                                  View Details
                                                </MenuItem>
                                                <MenuItem
                                                  onClick={() => this.onCreateOffer()}
                                                >
                                                  Create Offer
                                                </MenuItem>
                                                <MenuItem>Chat</MenuItem>
                                                <MenuItem onClick={this.declineModal}>
                                                  Cancel
                                                </MenuItem>
                                              </Menu>
                                            </React.Fragment>
                                          ) : (
                                            <React.Fragment>
                                              <img
                                                src={
                                                  ImageName.IMAGE_NAME.MENU_VERTICAL
                                                }
                                                style={{ cursor: "pointer" }}
                                                id="basic-button"
                                                aria-controls="basic-menu"
                                                aria-haspopup="true"
                                                aria-expanded={
                                                  open1 ? "true" : undefined
                                                }
                                                onClick={(e) =>
                                                  this.menuBtnhandleClick_b(key, e)
                                                }
                                              />
                                              <Menu
                                                id="basic-menu"
                                                anchorEl={this.state.anchorEl1}
                                                open={open1}
                                                onClose={this.handleMenuClose}
                                                MenuListProps={{
                                                  "aria-labelledby": "basic-button",
                                                }}
                                              >
                                                <MenuItem onClick={this.goEdit}>
                                                  View Details
                                                </MenuItem>

                                                <MenuItem>Chat</MenuItem>
                                                <MenuItem onClick={this.declineModal}>
                                                  Cancel
                                                </MenuItem>
                                              </Menu>
                                            </React.Fragment>
                                          )}
                                          {/* </div> */}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>) : (<React.Fragment>
                          <tr style={{ textAlign: "center" }}>
                            <td colSpan="11">
                              <center style={{ fontSize: "20px" }}>
                                No data found !!!
                              </center>
                            </td>
                          </tr>
                        </React.Fragment>)}

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </React.Fragment>
          }
          {this.state.isCalender ? <React.Fragment></React.Fragment> : <React.Fragment>
            <div className="table-filter-app">
              <div className="row">
                <div className="col-md-6">
                  <div className="cus-filter-btn">
                    <button className="button">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN} />
                    </button>
                    {/* <button className="button">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN_ONE} />
                    </button> */}
                    <button className="button">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN_TWO} />
                    </button>

                    {/* <div
                    class="filter-btn"
                    style={{ float: "none", paddingLeft: "10px" }}
                  >
                    <a href="#" onClick={this.filterModal}>
                      Filter
                    </a>
                  </div> */}

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
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="table-filter-box">
                    {/* <div className="export-btn" onClick={this.onExport}>
                    <a href="">Export</a>
                  </div>
                  <div className="addnew">
                    <a href="#">Add New</a>
                  </div> */}
                    <div className="tble-short">
                      {" "}
                      <span className="lbl">Display</span>
                      <div className="dropdwn">
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
            </div>
          </React.Fragment>
          }
          {/* Filter Section= */}
        </div>
        <div
          id="filter-model"
          className="modal fade modelwindow filter-pop"
          role="dialog"
        >
          <div className="modal-dialog modal-lg jobhrtypage">
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
              {/* <div className="filter-head _fl">
                <h3>Filter by</h3>
                <div className="reset-btn">
                  <button className="reset">Reset</button>
                  <button className="apply">Apply</button>
                  <button className="close-page">
                    <img src={ImageName.IMAGE_NAME.CLOSE_BTN_2} />
                    &nbsp;
                  </button>
                </div>
              </div> */}
              <div className="modal-body">
                <div className="job_filt_lfe">
                  <div class="_fl verificaiton-doc-tab">
                    <ul>
                      <li className="active" data-related="tble-data-d">
                        Appointment Type
                      </li>
                      <li data-related="tble-data-e">Language</li>
                      {/* <li data-related="tble-data-f">Requests</li>
                      <li data-related="tble-data-g">No. of Interpreters</li> */}
                      <li data-related="tble-data-h">Date & Time</li>
                      <li data-related="tble-data-i">Status</li>
                      <li data-related="tble-data-j">
                        Limited English Individual [LEI]
                      </li>
                      <li data-related="tble-data-k">Industry Type</li>
                    </ul>
                  </div>
                </div>
                <div className="tab-app-information activeLnk" id="tble-data-d">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row" style={{ padding: "30px" }}>
                            <div className="col-md-10">
                              <div className="row">
                                <div
                                  class="lable-text"
                                  style={{ fontSize: "20px" }}
                                >
                                  APPOINTMENT TYPE
                                </div>
                              </div>
                              <div className="row">
                                <div
                                  class="dropdwn"
                                  style={{ cursor: "pointer" }}
                                >
                                  <Select
                                    styles={customStyles}
                                    options={this.state.appointmentTypeArr}
                                    components={{
                                      DropdownIndicator,
                                      IndicatorSeparator: () => null,
                                    }}
                                    value={this.state.appointmentTypeData}
                                    placeholder="Select"
                                    onChange={(value) => {
                                      this.onAppointmentTypeChange(value);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <div className="row">
                            <div className="col-md-6">
                              <div className="web-form-app">
                                <div className="web-form-bx">
                                  <div className="apoi-tble-short">
                                    {" "}
                                    <div className="frm-label">
                                      Appointment Type
                                    </div>
                                    <div className="dropdwn">
                                      <select
                                        className="frm4-select"
                                        id="select25"
                                      >
                                         <option>Face to Face</option>
                                        <option>
                                          Over the Phone Interpretation
                                        </option>
                                        <option>
                                          Video Remot Interpreting
                                        </option>
                                      </select>
                                    </div>
                                  </div>
                                </div>

                                <div className="web-form-bx">
                                  <div className="frm-label">
                                    Is the job reschudeld?
                                  </div>
                                  <div className="check-field">
                                    <label className="checkbox_btn">
                                      <input type="radio" name="radio1" />
                                      <span className="checkmark3"></span> Yes
                                    </label>
                                  </div>
                                  <div className="check-field">
                                    <label className="checkbox_btn">
                                      <input type="radio" name="radio1" />
                                      <span className="checkmark3"></span> No
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div> */}
                          {/* <div className="row">
                            <div className="col-md-6">
                              <div className="web-form-bx">
                                <div className="frm-label">
                                  Appointment date and time
                                </div>
                                <div className="form-input-fields">
                                  <input
                                    type="text"
                                    id="from_datepicker"
                                    className="textbox4 d-icon"
                                    placeholder="10/25/2021"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="t-time prt" id="current-time">
                                <span className="t1">
                                  <small>09</small>
                                </span>
                                <span className="t2">
                                  <small>09</small>
                                </span>
                                <span className="t3">
                                  <small>09</small>
                                </span>
                              </div>
                            </div>
                          </div> */}
                          {/* <div className="row">
                            <div className="col-md-6">
                              <div className="web-form-bx">
                                <div className="frm-label">Source Language</div>
                                <div className="dropdwn">
                                  <select className="frm4-select" id="select25">
                                    <option>Select</option>
                                    <option>Select 1</option>
                                    <option>Select 2</option>
                                    <option>Select 3</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="web-form-bx">
                                <div className="frm-label">target Language</div>
                                <div className="dropdwn">
                                  <select className="frm4-select" id="select25">
                                    <option>Select</option>
                                    <option>Select 1</option>
                                    <option>Select 2</option>
                                    <option>Select 3</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="web-form-bx">
                                <div className="frm-label">Location Within</div>
                                <div className="dropdwn">
                                  <select className="frm4-select" id="select25">
                                    <option>Select</option>
                                    <option>Select 1</option>
                                    <option>Select 2</option>
                                    <option>Select 3</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="web-form-bx">
                                <div className="frm-label">&nbsp;</div>
                                <div className="dropdwn">
                                  <select className="frm4-select" id="select25">
                                    <option>Select</option>
                                    <option>Select 1</option>
                                    <option>Select 2</option>
                                    <option>Select 3</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div> */}
                          {/* <div className="row">
                            <div className="col-md-12">
                              <div className="web-form-bx">
                                <div className="_button-style _fl text-center">
                                  <a href="#" className="white-btn">
                                    cancel
                                  </a>
                                  <a href="#" className="blue-btn">
                                    submit
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-app-information" id="tble-data-e">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row" style={{ padding: "30px" }}>
                            <div className="col-md-12">
                              <div className="row">
                                <div className="col-md-5">
                                  <div
                                    class="lable-text"
                                    style={{ fontSize: "20px" }}
                                  >
                                    SOURCE LANGUAGE
                                  </div>
                                </div>
                                <div className="col-md-1"></div>
                                <div className="col-md-5">
                                  {" "}
                                  <div
                                    class="lable-text"
                                    style={{ fontSize: "20px" }}
                                  >
                                    TARGET LANGUAGE
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-5">
                                  <div
                                    class="dropdwn"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <Select
                                      styles={customStyles}
                                      options={this.state.languageArr}
                                      components={{
                                        DropdownIndicator,
                                        IndicatorSeparator: () => null,
                                      }}
                                      value={this.state.sourceLangData}
                                      placeholder="Select"
                                      onChange={(value) => {
                                        this.onSourceLangChange(value);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-1"></div>
                                <div className="col-md-5">
                                  <div
                                    class="dropdwn"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <Select
                                      styles={customStyles}
                                      options={this.state.languageArr}
                                      components={{
                                        DropdownIndicator,
                                        IndicatorSeparator: () => null,
                                      }}
                                      value={this.state.targetLangData}
                                      placeholder="Select"
                                      onChange={(value) => {
                                        this.onTargetLangChange(value);
                                      }}
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
                {/* <div className="tab-app-information" id="tble-data-f">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">Requests </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* <div className="tab-app-information" id="tble-data-g">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">
                              No. of Interpreters{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="tab-app-information" id="tble-data-h">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="form-search-app">
                            <div
                              className="lable-text"
                              style={{ fontSize: "20px" }}
                            >
                              Appointment Date
                            </div>
                            <div className="row">
                              <div className="col-md-10">
                                <div className="form-field-app date-input">
                                  <span style={{ marginTop: "8px" }}>from</span>
                                  <input
                                    type="date"
                                    className="datefield bd"
                                    placeholder="10/25/2021"
                                    value={this.state.formDate}
                                    onChange={this.formDateChange}
                                    style={{
                                      textAlign: "center",
                                      height: "50px",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row" style={{ marginTop: "30px" }}>
                              <div className="col-md-10">
                                <div className="form-field-app date-input">
                                  <span style={{ marginTop: "8px" }}>to</span>
                                  <input
                                    type="date"
                                    className="datefield bd"
                                    placeholder="10/25/2021"
                                    value={this.state.toDate}
                                    onChange={this.toDateChange}
                                    style={{
                                      textAlign: "center",
                                      height: "50px",
                                    }}
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
                <div className="tab-app-information" id="tble-data-i">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">
                              <div
                                class="lable-text"
                                style={{ fontSize: "20px" }}
                              >
                                Status{" "}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-8">
                              <div
                                class="dropdwn"
                                style={{ cursor: "pointer" }}
                              >
                                <Select
                                  styles={customStyles}
                                  options={this.state.statusArr}
                                  components={{
                                    DropdownIndicator,
                                    IndicatorSeparator: () => null,
                                  }}
                                  value={this.state.statusData}
                                  placeholder="Select"
                                  onChange={(value) => {
                                    this.onStatusChange(value);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-app-information" id="tble-data-j">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">
                              <div
                                class="lable-text"
                                style={{ fontSize: "20px" }}
                              >
                                Limited English Individual [LEI]{" "}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-8">
                              <div
                                class="dropdwn"
                                style={{ cursor: "pointer" }}
                              >
                                <Select
                                  styles={customStyles}
                                  options={this.state.leiArr}
                                  components={{
                                    DropdownIndicator,
                                    IndicatorSeparator: () => null,
                                  }}
                                  value={this.state.leiData}
                                  placeholder="Select"
                                  onChange={(value) => {
                                    this.onLeiChange(value);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-app-information" id="tble-data-k">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">
                              <div
                                class="lable-text"
                                style={{ fontSize: "20px" }}
                              >
                                INDUSTRY TYPE{" "}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-8">
                              <div
                                class="dropdwn"
                                style={{ cursor: "pointer" }}
                              >
                                <Select
                                  styles={customStyles}
                                  options={this.state.industryArr}
                                  components={{
                                    DropdownIndicator,
                                    IndicatorSeparator: () => null,
                                  }}
                                  value={this.state.industryData}
                                  placeholder="Select"
                                  onChange={(value) => {
                                    this.onIndustryChange(value);
                                  }}
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
          </div>
        </div>
        {/* ..................... */}

        {/* ..................Decline modal................................. */}
        <div
          id="decline-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-md modal-dialog-centered ">
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
              <div className="modal-body">
                <div className="create-jeneral-wrap _fl">
                  <div className="create-row-app">
                    <div className="row" style={{ marginBottom: "15px" }}>
                      <div className="col-md-12">
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
                          <div className="web-form-bx selct" hidden={!this.state.isOtherReason}>
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
                                style={{ resize: "none" }}
                              ></textarea>
                            </div>
                          </div>

                          <div className="web-form-bx selct">
                            <div className="frm-label lblSize">
                              Is the job rescheduled?
                            </div>
                            <div className="check-field">
                              <label className="checkbox_btn">
                                {this.state.isSelected ?
                                  <input
                                    type="radio"
                                    name="radio1"
                                    checked={true}
                                    onClick={(e) => this.rescheduledCheckYes(e)}
                                  /> :
                                  <input
                                    type="radio"
                                    name="radio1"
                                    checked={false}
                                    onClick={(e) => this.rescheduledCheckYes(e)}
                                  />}
                                <span className="checkmark3"></span> Yes
                              </label>
                            </div>
                            <div className="check-field">
                              <label className="checkbox_btn">
                                {this.state.isSelected ?
                                  <input
                                    type="radio"
                                    name="radio1"
                                    checked={false}
                                    onClick={(e) => this.rescheduledCheckNo(e)}
                                  /> :
                                  <input
                                    type="radio"
                                    name="radio1"
                                    checked={true}
                                    onClick={(e) => this.rescheduledCheckNo(e)}
                                  />
                                }
                                <span className="checkmark3"></span> No
                              </label>
                            </div>
                          </div>

                          <div className="web-form-bx" hidden={!this.state.isSelected}>
                            <div className="frm-label">Appointment Date & Time</div>
                            <div className="form-input-fields unstyled">
                              <input type="date" id="from_datepicker" className="textbox4 d-icon" placeholder="10/25/2021" onChange={this.appointmentdateChange} style={{ borderRadius: "9px", boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)" }} />
                            </div>

                            <div className="t-time">
                              <span className="t1">
                                <small>
                                  <input type="text" placeholder="" value={this.state.hour} className="tsd2" readonly /><br />
                                  <img src={ImageName.IMAGE_NAME.B_ARROW} alt="" style={{ cursor: "pointer" }} onClick={this.hourChange} />
                                </small>
                              </span>
                              <span className="t2">
                                <small>
                                  <input type="text" placeholder="" value={this.state.min} className="tsd2" readonly /><br />
                                  <img src={ImageName.IMAGE_NAME.B_ARROW} alt="" style={{ cursor: "pointer" }} onClick={this.minChange} />
                                </small>
                              </span>
                              <span className="t3" style={{ marginLeft: "2%" }}>
                                <small>
                                  <input type="text" placeholder="" value={this.state.ampm} className="tsd2" readonly /><br />
                                  <img src={ImageName.IMAGE_NAME.B_ARROW} alt="" style={{ cursor: "pointer" }} onClick={this.ampmChange} />
                                </small>
                              </span>
                            </div>

                          </div>
                          <div className="web-form-bx selct" hidden={!this.state.isSelected}>
                            <div className="frm-label lblSize">
                              Notes
                            </div>
                            <div
                              className="form-input-fields"
                              style={{ marginBottom: "20px" }}
                            >
                              <textarea
                                value={this.state.otherReason}
                                placeholder=""
                                className="in-textarea msg min table-style"
                                onChange={this.onRescheduleNote}
                                style={{ resize: "none" }}
                              ></textarea>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6"></div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="web-form-bx selct">
                          <div className="_button-style _fl text-center">
                            <a
                              href="javascript:void(0)"
                              className="white-btn"
                              onClick={this.declineClose}
                              style={{ textDecoration: "none" }}
                            >
                              cancel
                            </a>
                            <a
                              href="javascript:void(0)"
                              className="blue-btn"
                              style={{ textDecoration: "none", color: "#fff" }}
                              onClick={this.onDeclineSubmit}
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
