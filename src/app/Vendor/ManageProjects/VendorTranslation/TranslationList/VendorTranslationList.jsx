import { Menu, MenuItem } from "@mui/material";

import React, { Component, useState, useRef } from "react";
import { AlertMessage, ImageName } from "../../../../../enums";
import { Decoder } from "../../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../../services/constant";
import { ApiCall } from "../../../../../services/middleware";

import Select, { components } from "react-select";
import $ from "jquery";
// import "./viewAllJobs.css";
import {
  consoleLog,
  SetDateFormat,
  SetTimeFormat,
} from "../../../../../services/common-function";
import { toast, ToastContainer } from "react-toastify";
// import ReactLoader from "../../../Loader";
import { inputEmptyValidate } from "../../../../../validators";
import {
  PaginationDropdown,
  SelectBox,
} from "../../../../Admin/SharedComponents/inputText";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";
// import ViewCalender from "../../../ReactBigCalender/ViewCalender";

import "./index.css";
// import ViewCalender from "../../../ReactBigCalender/ViewCalender";

// const localizer = momentLocalizer(moment);

// const TooltipContent = ({  onClose,event }) => {
//   console.log("event:::",event)
//    return (
//      <React.Fragment>
//        <Popover id="popover-basic">
//          {/* <Popover.Header as="h3" style={{backgroundColor:"grey"}}>{event.title}</Popover.Header> */}
//          <Popover.Body style={{ fontSize: "10px", width: "150px" }}>
//            <strong>Project #: </strong>
//            {event.event.projectId}
//            {<br />}
//            <strong>Job #: </strong>
//            {event.event.jobId}
//            {<br />}
//            <strong>Status : </strong>
//            {event.event.status === 0 ? "Pending" : "Assigned"}
//            {<br />}
//            <strong>Consumer: </strong>
//            {event.event.consumer}
//            {<br />}
//            <strong>Date/Time: </strong>
//            {event.event.dateTime}
//            {<br />}
//            <strong>Location : </strong>
//            {event.event.location}
//            {<br />}
//            <strong>Interpreter ID[s] : </strong>
//            {event.event.interpreterId}
//            {<br />}
//          </Popover.Body>
//        </Popover>
//      </React.Fragment>
//    );
//  };

//  function Event(event) {
//   const [showTooltip, setShowTooltip] = useState(false);

//   const closeTooltip = () => {
//     setShowTooltip(false);
//   };

//   const openTooltip = () => {
//     setShowTooltip(true);
//   };
//   const ref = useRef(null);

//   const getTarget = () => {
//     return ReactDOM.findDOMNode(ref.current);
//   };

//   return (
//     <div ref={ref}>
//       <div onMouseOver={openTooltip} onMouseOut={closeTooltip}>
//         {/* {console.log(event)} */}
//         {event.title}
//         <Overlay
//           rootClose
//           target={getTarget}
//           show={showTooltip}
//           placement="right"
//           onHide={closeTooltip}
//         >
//           <Tooltip >
//           <React.Fragment>
//        <Popover id="popover-basic">
//          {/* <Popover.Header as="h3" style={{backgroundColor:"grey"}}>{event.title}</Popover.Header> */}
//          <Popover.Body style={{ fontSize: "10px", width: "150px" }}>
//            <strong>Project #: </strong>
//            {event.event.projectId}
//            {<br />}
//            <strong>Job #: </strong>
//            {event.event.jobId}
//            {<br />}
//            <strong>Status : </strong>
//            {event.event.status === 0 ? "Pending" : "Assigned"}
//            {<br />}
//            <strong>Consumer: </strong>
//            {event.event.consumer}
//            {<br />}
//            <strong>Date/Time: </strong>
//            {event.event.dateTime}
//            {<br />}
//            <strong>Location : </strong>
//            {event.event.location}
//            {<br />}
//            <strong>Interpreter ID[s] : </strong>
//            {event.event.interpreterId}
//            {<br />}
//          </Popover.Body>
//        </Popover>
//      </React.Fragment>
//             {/* <TooltipContent event={event} onClose={closeTooltip}  /> */}
//           </Tooltip>
//         </Overlay>
//       </div>
//     </div>
//   );
// }

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

const reqData = {
  limit: "",
  offset: "",
  status: "",
  clientId: "",
  serviceType: "46",
  orderby: "",
  direc: "",
  searchFrom: "",
  searchTo: "",
  rfqId: "",
};

export default class VendorTranslationList extends React.Component {
  constructor(props) {
    super(props);

    // const now = new Date();
    // const events = [
    //   {
    //     id: 1,
    //     title: "Hello",

    //     // allDay: true,
    //     start: now,
    //     end: "2022-01-18T14:30Z",
    //     projectId: "121231312",
    //     jobId: "123",
    //     consumer: "Dhabal Gada",
    //     dateTime: "05/10/25 | 05:00 PM",
    //     location: "123,Ferndale Avenue,New York,43321",
    //     interpreterId: "12",
    //     status: 0,
    //   },
    //   {
    //     id: 2,
    //     title: "Hii",

    //     // allDay: true,
    //     start: new Date("2022-01-22T13:30Z"),
    //     end: new Date("2022-01-22T15:30Z"),
    //     projectId: "121231312",
    //     jobId: "123",
    //     consumer: "Lilly Gomez",
    //     dateTime: "05/10/25 | 05:00 PM",
    //     location: "123,Ferndale Avenue,New York,43321",
    //     interpreterId: "12",
    //     status: 1,
    //   },
    //     {
    //       id: 3,
    //       title: "Welcome",

    //       // allDay: true,
    //       start: new Date("2021-12-23T12:30Z"),
    //       end: new Date("2021-12-23T15:30Z"),
    //       projectId: "121231312",
    //       jobId: "123",
    //       consumer: "Dhabal Gada",
    //       status: "Assigned",
    //       dateTime: "05/10/25 | 05:00 PM",
    //       location: "123,Ferndale Avenue,New York,43321",
    //       interpreterId: "12",
    //       status:2
    //     },
    //     {
    //       id: 4,
    //       title: "7C Lingo",
    //       // allDay: true,
    //       start: new Date("2022-01-24T05:30Z"),
    //       end: new Date("2022-01-24T06:30Z"),
    //       projectId: "121231312",
    //       jobId: "123",
    //       consumer: "Lilly Gomez",
    //       dateTime: "05/10/25 | 05:00 PM",
    //       location: "123,Ferndale Avenue,New York,43321",
    //       interpreterId: "12",
    //       status: 3,
    //     },
    //       {
    //         id: 5,
    //         title: "Test",
    //         // allDay: true,
    //         start: new Date("2021-12-29T09:30Z"),
    //         end: new Date("2021-12-29T10:30Z"),
    //         projectId: "121231312",
    //         jobId: "123",
    //         consumer: "Dhabal Gada",
    //         status: "Assigned",
    //         dateTime: "05/10/25 | 05:00 PM",
    //         location: "123,Ferndale Avenue,New York,43321",
    //         interpreterId: "12",
    //         status:4
    //       },
    // ];

    this.state = {
      isLoad: true,
      openCalender: false,
      openTable: true,
      isAlljobs: true,
      isHistory: false,
      current_page: 1,
      total_page: 10,
      limit: 10,
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
      listData: [],
      historyList: [],
      selectedDisplayData: {
        label: "10",
        value: "10",
      },
      // events,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();

    document.getElementById("backdrop").style.display = "none";
    var classInstance = this;

    // When the user clicks anywhere outside of the modal, close it

    var modal = document.getElementById("decline-model");
    var filterModal = document.getElementById("filter-model");
    var historyModal = document.getElementById("history-model");
    window.onclick = function (event) {
      if (event.target == filterModal) {
        classInstance.closeModal();
      } else if (event.target == modal) {
        classInstance.closeDeclineModal();
      } else if (event.target == historyModal) {
        classInstance.closeHistoryModal();
      }
    };

    window.$(".verificaiton-doc-tab ul li").on("click", function () {
      $(".verificaiton-doc-tab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
    });
    //
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

    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
    };
    let returnData = Object.assign(reqData, fetchData);
    this.listApi(returnData);

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
      // console.log("payload::::::::::", payload);

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

    let statusRes = await ApiCall("getInterpretionJobStatuslist");
    if (
      statusRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      statusRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(statusRes.data.payload);
      // console.log("status::::::::::", payload);
      statusDataArr = payload.data.statusList;
      for (let k = 0; k < statusDataArr.length; k++) {
        // console.log(">>>><<<", statusDataArr[k]);
        // statusArr.push({
        //   label: statusDataArr[k],
        // });
      }
    }
    // ............................................................
    let clientDataArr = [];

    let clientinfoRes = await ApiCall("getallclinetinfo");
    if (
      clientinfoRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      clientinfoRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let clientPayload = await Decoder.decode(clientinfoRes.data.payload);
      let clientResData = clientPayload.data.clientlist;
      // console.log("payload::::::::::", clientResData);
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

  //...........For translation Project Listing...............
  listApi = async (data) => {
    const res = await ApiCall("getAllProjects", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      let arr = [];
      consoleLog("data::::", decodeData.data.projectList);
      if (decodeData.data.projectList.length > 0) {
        decodeData.data.projectList.map((item) => {
          if (item.serviceTypeId === 46) {
            arr.push(item);
          }
        });
      }
      let totalPage = Math.ceil(
        decodeData.data.projectCount / this.state.limit
      );
      this.setState({
        listData: arr,
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
    //   console.log("Payload history data>>>", decodeData1);
    //   let historyDetails = decodeData1.data.projectList;
    //   let totalPage1 = Math.ceil(
    //     decodeData1.data.projectCount / this.state.limit
    //   );
    //   console.log("Total history list Page>>>", historyDetails);
    //   this.setState({
    //     historyList: decodeData1.data.projectList,
    //     total_page: totalPage1,
    //   });
    // }
  };

  // .............filter modal function...................

  onClientChamge = (data) => {
    // console.log("client:::", data.value);
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
      status: "",
      clientId: "",
      serviceType: "46",
      orderby: "",
      direc: "",
      searchFrom: "",
      searchTo: "",
      rfqId: "",
    };

    this.listApi(data);
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

  closeDeclineModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("decline-model").style.display = "none";
    document.getElementById("decline-model").classList.remove("show");
  };
  closeHistroyModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("history-model").style.display = "none";
    document.getElementById("history-model").classList.remove("show");
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
  historyModal = () => {
    this.openHistoryModal();
    this.handleMenuClose();
  };
  declineClose = () => {
    this.setState({
      declineMessage: "",
    });
    this.closeDeclineModal();
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
      selectedDisplayData: {
        label: "10",
        value: "10",
      },
      current_page: 1,
    });
    this.closeModal();
    this.load();
  };

  onCancelDataChange = (data) => {
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

  onDeclineSubmit = async () => {
    let mainData = this.props.location;
    let preData = mainData.state;
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
      } else {
        if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST
        ) {
          toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_EXIST, {
            hideProgressBar: true,
          });
        } else if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.PHONE_EXIST
        ) {
          toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EXIST, {
            hideProgressBar: true,
          });
        } else if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_PHONE_EXIST
        ) {
          toast.error(AlertMessage.MESSAGE.EMAIL_MOBILE.DUBLICATE, {
            hideProgressBar: true,
          });
        }
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

  openTable = () => {
    this.setState({
      openCalender: false,
      openTable: true,
    });
  };
  openCalender = () => {
    this.setState({
      openCalender: true,
      openTable: false,
    });
  };

  goEdit = () => {
    this.props.history.push({
      pathname: "/vendorTranslationDetails",
      state: this.state.listData[this.state.curIndex],
    });
  };

  //...............for custom styling event...................

  // eventStyleGetter = (event, start, end, isSelected) => {
  //   // console.log(event);
  //   // var backgroundColor = '#' + event.hexColor;
  //   var backgroundColor =
  //     event.status === 0
  //       ? "#7a009a"
  //       : event.status === 1
  //       ? "#00c9cf"
  //       : event.status === 2
  //       ? "#4700d9"
  //       :event.status === 3
  //       ? "orange"
  //       :event.status === 4
  //       ? "#00bf3e"
  //       : "";
  //   var style = {
  //     backgroundColor: backgroundColor,
  //     borderRadius: "25px",
  //     padding:"2px 10px",
  //     opacity: 0.8,
  //     color: "white",
  //     border: "0px",
  //     display: "block",
  //   };
  //   return {
  //     style: style,
  //   };
  // };
  handleSelect = (e) => {
    console.log("Event data", e);
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    const open1 = Boolean(this.state.anchorEl1);
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
          <ToastContainer hideProgressBar theme="colored" />
          {/* <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div> */}
          {/* <Header />
          <Sidebar /> */}
          <div className="component-wrapper vewaljobs">
            {/* <ReactLoader /> */}
            <div
              className="vn_frm"
              style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
            >
              Translation
            </div>
            <div className="vendor-info p-10 _fl sdw">
              <div className="vn-form _fl">
                <div className="row">
                  {/* <div className="col-md-4">
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
                  </div> */}
                  {/* <div className="col-md-4"> */}
                  {/* <div className="vn_frm">
                    <input
                      type="text"
                      value=""
                      name=""
                      placeholder="Search"
                      className="inputfield"
                    />
                  </div> */}
                  {/* </div> */}
                  <div className="col-md-4">
                    <div className="_fl verificaiton-doc-tab ven">
                      <ul>
                        <li
                          className="active"
                          data-related="tble-data-a"
                          onClick={() => {
                            this.onTabClick("alljobs");
                          }}
                        >
                          All Projects
                        </li>
                        <li
                          data-related="tble-data-b"
                          onClick={() => {
                            this.onTabClick("history");
                          }}
                        >
                          History
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-filter-app">
              <div className="row">
                <div className="col-md-6">
                  <div className="cus-filter-btn">
                    {this.state.openTable ? (<React.Fragment>
                      <button className="button" onClick={this.openTable}>
                      <img src={ImageName.IMAGE_NAME.MENU_BTN} />
                    </button>
                    </React.Fragment>) : (<React.Fragment>
                      <button className="button" onClick={this.openTable}>
                      <img src={ImageName.IMAGE_NAME.GREY_HAMBURGER} style={{width:"20px" ,marginTop:"15px"}}/>
                    </button>
                    </React.Fragment>)}
                  
                    {/* <button className="button">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN_ONE} />
                    </button> */}
                    {this.state.openCalender ? (<React.Fragment>
                      <button className="button" onClick={this.openCalender}>
                      <img src={ImageName.IMAGE_NAME.BLUE_CALENDER} style={{width:"20px",marginTop:"15px"}}/>
                    </button>
                    </React.Fragment> ): (<React.Fragment>
                      <button className="button" onClick={this.openCalender}>
                      <img src={ImageName.IMAGE_NAME.MENU_BTN_TWO} />
                    </button>
                    </React.Fragment>)}
                   

                    {this.state.openTable ? (
                      <React.Fragment>
                        <div
                          class="filter-btn"
                          style={{ float: "none", paddingLeft: "10px" }}
                        >
                          <a href="#" onClick={this.filterModal}>
                            Filter
                          </a>
                        </div>

                        <div className="filter-pagination">
                          <button
                            className="prev_btn"
                            onClick={this.exLeft}
                          ></button>
                          <button className="prv_btn" onClick={this.prev}>
                            {" "}
                            {"<"}
                          </button>
                          <span
                            className="num"
                            onChange={(e) => this.clickChange(e)}
                          >
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
                      </React.Fragment>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}

                    {/* <div className="tble-short">
                    {" "}
                    <span className="lbl">Job Status</span>
                    <div className="dropdwn" style={{ width: "85px" }}>
                      <select
                        className="myDropdown_status frm4-select"
                        onChange={this.onChangeStatus}
                      ></select>
                    </div>
                  </div> */}
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
                  {this.state.openTable ? (<React.Fragment>
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
                  </React.Fragment>) : (<React.Fragment></React.Fragment>)}
                    
                  </div>
                </div>
              </div>
            </div>
            <div hidden={!this.state.openTable}>
              <div
                className="tab-app-information activeLnk"
                id="tble-data-a"
                hidden={!this.state.isAlljobs}
              >
                <div className="table-listing-app">
                  <div className="table-responsive_cus table-style-a">
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                    >
                      <tbody>
                        <tr>
                          <th style={{ width: "15%" }}>Project#</th>
                          {/* <th style={{ width: "15%" }}>Client</th> */}
                          <th style={{ width: "15%" }}>Service Type</th>
                          <th style={{ width: "15%" }}>Date</th>
                          <th style={{ width: "20%" }}>Language </th>
                          <th style={{ width: "12%" }}>Status</th>
                          <th style={{ width: "8%" }}>Action</th>
                        </tr>
                        {this.state.listData.length > 0 ? (
                          <React.Fragment>
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
                                          <td style={{ width: "15%" }}>
                                            {item.requestId}
                                          </td>
                                          {/* <td style={{ width: "15%" }}>
                                            {item.clientName}
                                          </td> */}
                                          {item.serviceTypeId === 46 ? (
                                            <td style={{ width: "15%" }}>
                                              {item.servicename} (
                                              {item.naminService})
                                            </td>
                                          ) : (
                                            <td style={{ width: "15%" }}>
                                              {item.trainingCategory} (
                                              {item.naminService})
                                            </td>
                                          )}
                                          <td style={{ width: "15%" }}>
                                            {SetDateFormat(item.date)}
                                          </td>
                                          <td style={{ width: "20%" }}>
                                            {item.language}
                                          </td>
                                          {/* <td style={{ width: "8%" }}></td> */}
                                          <td style={{ width: "12%" }}>
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
                                                  className="progress-btn green"
                                                >
                                                  cancelled
                                                </span>
                                              </React.Fragment>
                                            ) : (
                                              <React.Fragment></React.Fragment>
                                            )}
                                          </td>
                                          <td style={{ width: "8%" }}>
                                            {item.status === 2 ? (
                                              <React.Fragment>
                                                <img
                                                  src={
                                                    ImageName.IMAGE_NAME
                                                      .MENU_VERTICAL
                                                  }
                                                  style={{ cursor: "pointer" }}
                                                  id="basic-button"
                                                  aria-controls="basic-menu"
                                                  aria-haspopup="true"
                                                  aria-expanded={
                                                    open ? "true" : undefined
                                                  }
                                                  onClick={(e) =>
                                                    this.menuBtnhandleClick(
                                                      key,
                                                      e
                                                    )
                                                  }
                                                />
                                                <Menu
                                                  id="basic-menu"
                                                  anchorEl={this.state.anchorEl}
                                                  open={open}
                                                  onClose={this.handleMenuClose}
                                                  MenuListProps={{
                                                    "aria-labelledby":
                                                      "basic-button",
                                                  }}
                                                >
                                                  <MenuItem
                                                    onClick={this.goEdit}
                                                  >
                                                    View Details
                                                  </MenuItem>
                                                  <MenuItem
                                                    onClick={() =>
                                                      this.onCreateOffer()
                                                    }
                                                  >
                                                    Create Offer
                                                  </MenuItem>
                                                  <MenuItem>Chat</MenuItem>
                                                  <MenuItem
                                                    onClick={this.declineModal}
                                                  >
                                                    Cancel
                                                  </MenuItem>
                                                </Menu>
                                              </React.Fragment>
                                            ) : (
                                              <React.Fragment>
                                                <img
                                                  src={
                                                    ImageName.IMAGE_NAME
                                                      .MENU_VERTICAL
                                                  }
                                                  style={{ cursor: "pointer" }}
                                                  id="basic-button"
                                                  aria-controls="basic-menu"
                                                  aria-haspopup="true"
                                                  aria-expanded={
                                                    open1 ? "true" : undefined
                                                  }
                                                  onClick={(e) =>
                                                    this.menuBtnhandleClick_b(
                                                      key,
                                                      e
                                                    )
                                                  }
                                                />
                                                <Menu
                                                  id="basic-menu"
                                                  anchorEl={
                                                    this.state.anchorEl1
                                                  }
                                                  open={open1}
                                                  onClose={this.handleMenuClose}
                                                  MenuListProps={{
                                                    "aria-labelledby":
                                                      "basic-button",
                                                  }}
                                                >
                                                  <MenuItem
                                                    onClick={this.goEdit}
                                                  >
                                                    View Details
                                                  </MenuItem>

                                                  <MenuItem>Chat</MenuItem>
                                                  <MenuItem
                                                    onClick={this.declineModal}
                                                  >
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
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* ...............................calender................................. */}
            <div
              hidden={!this.state.openCalender}
              className="table-listing-app"
            >
              {/* <div style={{ height: "500pt" }}>
            <Calendar
            selectable
            views = {['month','week','day']}
              //tooltipAccessor={null}
              components={{ event: Event }}
              events={this.state.events}
              startAccessor="start"
              endAccessor="end"
              defaultDate={moment().toDate()}
              localizer={localizer}
              eventPropGetter={this.eventStyleGetter}
              // onSelectEvent={this.handleSelect}
            />
          </div> */}
              {/* <ViewCalender /> */}
            </div>

            <div
              className="tab-app-information"
              id="tble-data-b"
              hidden={!this.state.isHistory}
            >
              <div className="table-listing-app">
                <div className="table-responsive_cus table-style-a">
                  <table
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                  >
                    <tbody>
                      <tr>
                        <th style={{ width: "15%" }}>Project#</th>
                        <th style={{ width: "15%" }}>Client</th>
                        <th style={{ width: "15%" }}>Service Type</th>
                        <th style={{ width: "15%" }}>Date</th>
                        <th style={{ width: "20%" }}>Language </th>
                        <th style={{ width: "12%" }}>Status</th>
                        <th style={{ width: "8%" }}>Action</th>
                      </tr>
                      {this.state.historyList.length > 0 ? (
                        <React.Fragment>
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
                                        <td style={{ width: "15%" }}>
                                          {item.requestId}
                                        </td>
                                        <td style={{ width: "15%" }}>
                                          {item.clientName}
                                        </td>
                                        {item.serviceTypeId === 46 ? (
                                          <td style={{ width: "15%" }}>
                                            {item.servicename} (
                                            {item.naminService})
                                          </td>
                                        ) : (
                                          <td style={{ width: "15%" }}>
                                            {item.trainingCategory} (
                                            {item.naminService})
                                          </td>
                                        )}
                                        <td style={{ width: "15%" }}>
                                          {SetDateFormat(item.date)}
                                        </td>
                                        <td style={{ width: "20%" }}>
                                          {item.language}
                                        </td>
                                        <td style={{ width: "12%" }}>
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
                                                className="progress-btn green"
                                              >
                                                cancelled
                                              </span>
                                            </React.Fragment>
                                          ) : (
                                            <React.Fragment></React.Fragment>
                                          )}
                                        </td>
                                        <td style={{ width: "8%" }}>
                                          {item.status === 2 ? (
                                            <React.Fragment>
                                              <img
                                                src={
                                                  ImageName.IMAGE_NAME
                                                    .MENU_VERTICAL
                                                }
                                                style={{ cursor: "pointer" }}
                                                id="basic-button"
                                                aria-controls="basic-menu"
                                                aria-haspopup="true"
                                                aria-expanded={
                                                  open ? "true" : undefined
                                                }
                                                onClick={(e) =>
                                                  this.menuBtnhandleClick(
                                                    key,
                                                    e
                                                  )
                                                }
                                              />
                                              <Menu
                                                id="basic-menu"
                                                anchorEl={this.state.anchorEl}
                                                open={open}
                                                onClose={this.handleMenuClose}
                                                MenuListProps={{
                                                  "aria-labelledby":
                                                    "basic-button",
                                                }}
                                              >
                                                {item.serviceTypeId === 46 ? (
                                                  <MenuItem
                                                    onClick={this.goEdit}
                                                  >
                                                    View Details
                                                  </MenuItem>
                                                ) : (
                                                  <MenuItem>
                                                    View Details
                                                  </MenuItem>
                                                )}
                                                <MenuItem
                                                  onClick={() =>
                                                    this.onCreateOffer()
                                                  }
                                                >
                                                  Create Offer
                                                </MenuItem>
                                                <MenuItem>Chat</MenuItem>
                                                <MenuItem
                                                  onClick={this.declineModal}
                                                >
                                                  Cancel
                                                </MenuItem>
                                              </Menu>
                                            </React.Fragment>
                                          ) : (
                                            <React.Fragment>
                                              <img
                                                src={
                                                  ImageName.IMAGE_NAME
                                                    .MENU_VERTICAL
                                                }
                                                style={{ cursor: "pointer" }}
                                                id="basic-button"
                                                aria-controls="basic-menu"
                                                aria-haspopup="true"
                                                aria-expanded={
                                                  open1 ? "true" : undefined
                                                }
                                                onClick={(e) =>
                                                  this.menuBtnhandleClick_b(
                                                    key,
                                                    e
                                                  )
                                                }
                                              />
                                              <Menu
                                                id="basic-menu"
                                                anchorEl={this.state.anchorEl1}
                                                open={open1}
                                                onClose={this.handleMenuClose}
                                                MenuListProps={{
                                                  "aria-labelledby":
                                                    "basic-button",
                                                }}
                                              >
                                                <MenuItem onClick={this.goEdit}>
                                                  View Details
                                                </MenuItem>

                                                <MenuItem>Chat</MenuItem>
                                                <MenuItem
                                                  onClick={this.declineModal}
                                                >
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
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {this.state.openTable ? (<React.Fragment>
              <div className="table-filter-app">
              <div className="row">
                <div className="col-md-6">
                  <div className="cus-filter-btn">
                    {/* <button className="button">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN} />
                    </button> */}
                    {/* <button className="button">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN_ONE} />
                    </button> */}
                    {/* <button className="button">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN_TWO} />
                    </button> */}

                    {/* <div
                      class="filter-btn"
                      style={{ float: "none", paddingLeft: "10px" }}
                    >
                      <a href="#" onClick={this.filterModal}>
                        Filter
                      </a>
                    </div> */}

                    <div className="filter-pagination">
                      <button
                        className="prev_btn"
                        onClick={this.exLeft}
                      ></button>
                      <button className="prv_btn" onClick={this.prev}>
                        {" "}
                        {"<"}
                      </button>
                      <span
                        className="num"
                        onChange={(e) => this.clickChange(e)}
                      >
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

                    {/* <div className="tble-short">
                    {" "}
                    <span className="lbl">Job Status</span>
                    <div className="dropdwn" style={{ width: "85px" }}>
                      <select
                        className="myDropdown_status frm4-select"
                        onChange={this.onChangeStatus}
                      ></select>
                    </div>
                  </div> */}
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
            </div>
            </React.Fragment>) : (<React.Fragment></React.Fragment>)}
            
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
                  <div
                    className="tab-app-information activeLnk"
                    id="tble-data-d"
                  >
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
                                    <span style={{ marginTop: "8px" }}>
                                      from
                                    </span>
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
                              <div
                                className="row"
                                style={{ marginTop: "30px" }}
                              >
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
        {/* </div> */}
        <div
          className="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}
