import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import { AlertMessage, ImageName } from "../../../../../enums";
import { Decoder } from "../../../../../services/auth";
import {
  consoleLog,
  getClientInfo,
  SetDateFormat,
  SetScheduleDate,
  SetTimeFormat,
  SetUSAdateFormat,
  textTruncate,
} from "../../../../../services/common-function";
import { CommonData, ErrorCode } from "../../../../../services/constant";
import { ApiCall } from "../../../../../services/middleware";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../../../SharedComponents/inputText";
// import "./InterpretationInvoicePage.css";
import $ from "jquery";
import axios from "axios";
import { IMAGE_URL } from "../../../../../services/config/api_url";

import DatePicker from "react-datepicker";

// ................mui switch DesignServices...............

const contractTypeArr = [
  {
    label: "Contract",
    value: "1",
  },
  {
    label: "Non-Contract",
    value: "0",
  },
];


const reqData = {
  limit: "",
  offset: "",
  jobId: "",
  search: "",
  searchto: "",
  searchfrom: "",
  trainingCatId:"",
  trainingFormatId:"",
  courseId:"",
  clientContractPath:"",
  vendorId:"",
  clientId:"",
  serviceTypeId:"47",
};



export default class TrainingInvoicePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      isPayable: false,
      isReceivable: true,
      current_page: 1,
      total_page: 10,
      limit: 20,
      offset: 0,
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      // ...payable..........
      current_page_payable: 1,
      total_page_payable: 10,
      limit_payable: 20,
      offset_payable: 0,
      selectedDisplayData_payable: {
        label: "20",
        value: "20",
      },
      formDate_payable: "",
      toDate_payable: "",
      listData: [],
      payableData: [],
      curIndex: 0,
      formDate: "",
      toDate: "",
      selectedVendorData: "",
      vendorArr: [],
      totalCount: "",
      input: "",
      show: true,
      anchorEl: null,

      // ...for invoice modal......
      requesterArr: [],
      selectedRequester: {},
      trainingCategoryArr:[],
      selectedTrainingCategory:{},
      courseArr:[],
      selectedCourse:{},
      formatTypeArr:[],
      selectedFormat:{},
      vendorArr: [],
      selectedVendor: {},
      allClientArr: [],
      selectedClient: {},
      selectedContract: {},

    };
  }

  componentDidMount() {
    // consoleLog("Training")
    window.scrollTo(0, 0);
    this.load();
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("rec").classList.add("active");
    var classInstance = this;

    var filterModal = document.getElementById("filter-model");
    var invoiceModal = document.getElementById("invoice-model");
    var adminInfoModal = document.getElementById("adminInfo-model");
    var createTemplateModal = document.getElementById("createTemplate-model");
    var chooseTemplateModal = document.getElementById("chooseTemplate-model");

    window.onclick = function (event) {
      if (event.target === filterModal) {
        classInstance.closeFilterModal();
      } else if (event.target === invoiceModal) {
        classInstance.closeInvoiceModal();
      } else if (event.target === adminInfoModal) {
        classInstance.closeAdminInfoModal();
      } else if (event.target === createTemplateModal) {
        classInstance.closeCreateTemplateModal();
      } else if (event.target === chooseTemplateModal) {
        classInstance.closeChooseTemplateModal();
      }
    };

    window.$(".verificaiton-doc-tab ul li").on("click", function () {
      $(".verificaiton-doc-tab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
    });
    window.$(".filterTab ul li").on("click", function () {
      $(".filterTab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk1");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk1");
    });
  }

  load = async () => {
    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      serviceTypeId: "47",
      jobId: "",
      search: "",
      searchto: "",
      searchfrom: "",
      trainingCatId:"",
      trainingFormatId:"",
      courseId:"",
      clientContractPath:"",
      vendorId:"",
      clientId:"",
     
    };

  

    this.getListDetails(resData);
    // ..................variables.................

    let languageArrData = [],
      languageResArrData = [],
      formatMainArr=[],
      leiDataArr = [],
      leiArr = [],
      allCategoryType = [],
      requesterArrData = [],
      courseArrData=[],
      allClientArr = await getClientInfo();
     

      // ..................training Category.......
      let res = await ApiCall("getCourseWithCategory");
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let payload = Decoder.decode(res.data.payload);
        // console.log("resData>>>", payload);
       
        if (payload.data.length > 0) {
          payload.data.map((data) => {
            allCategoryType.push({
              label: data.name,
              value: data.id,
            });
          });
        }
      }

      // ................course,,,,,,,,,,,,,,,,,
      let resCourse = await ApiCall("getAllCourseList");
      if (
        resCourse.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        resCourse.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let payload = Decoder.decode(resCourse.data.payload);
        console.log("resData>>>", payload);
       let courseArr = payload.data.trainingCategories;
        if(courseArr.length > 0){
          courseArr.map((obj) => {
            courseArrData.push({
              label:obj.name,
              value:obj.id
            })
          })
        }
      }
       

  

    // ...............vendor list.........................

    let vendorArrMainData = [];

    let vendorRes = await ApiCall("fetchAllVendorList", {});

    if (
      vendorRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      vendorRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(vendorRes.data.payload);

      // consoleLog("*****", payload.data);
      let vendorArrData = payload.data.vendorList;
      vendorArrData.map((obj) => {
        vendorArrMainData.push({
          label: obj.name,
          value: obj.id,
        });
      });
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
      // if (languageResArrData[n].language === "English") {
      //   languageObjData.push({
      //     label: languageResArrData[n].language,
      //     value: languageResArrData[n].id,
      //   });
      //   languageObjId.push(languageResArrData[n].id)
      // }
    }

    let lookupres = await ApiCall("getLookUpData");
    if (
      lookupres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      lookupres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload =  Decoder.decode(lookupres.data.payload);

     let formatDataArr = payload.data.lookupdata.COURSE_FORMAT_TYPE;

      // consoleLog("lookup::", payload.data.lookupdata.COURSE_FORMAT_TYPE);
      formatDataArr.map((obj) => {
        formatMainArr.push({
          label:obj.name,
          value:obj.id
        })
      })

     
    }

    // .....................lei,,,,,,,,,,,,,,,,,,,,,,,
    let leiRes = await ApiCall("getAllLeiList");
    if (
      leiRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      leiRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(leiRes.data.payload);

      leiDataArr = payload.data.leiList;
      // consoleLog("all lei::", leiDataArr);
      for (let k = 0; k < leiDataArr.length; k++) {
        leiArr.push({
          label: leiDataArr[k].name,
          value: leiDataArr[k].userId,
        });
      }
    }

    // ...................requester,,,,,,,,,,,,,,,,,,

    let requesterRes = await ApiCall("fetchAllRequester");
    if (
      requesterRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      requesterRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let requestPayload = await Decoder.decode(requesterRes.data.payload);

      // consoleLog("requestArr::",typeof requestPayload.data.requesterList);
     let requesterResData = requestPayload.data.requesterList;
      if (requesterResData.length > 0) {
        requesterResData.map((obj) => {
          requesterArrData.push({
            label: obj.name,
            value: obj.userId,
          });
        });
      }
    }

    this.setState({
      trainingCategoryArr: allCategoryType,
      formatTypeArr:formatMainArr,
      leiArr: leiArr,
      requesterArr: requesterArrData,
      allClientArr: allClientArr,
      vendorArr: vendorArrMainData,
      courseArr:courseArrData

      // targetLangData: languageObjData,
    });
  };

  getListDetails = async (data) => {
    // consoleLog("req Data::::", data);
    // .............................................
    let modifyData = { isSelected: false };

    // let res = await ApiCall("fetchAccountPayable", data);
    let res = await ApiCall("fetchBillsUnderVerificationReceivable", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload),
        allBillInvoice = [];
      allBillInvoice = payload.data.details;

      allBillInvoice.map((obj) => {
        Object.assign(obj, modifyData);
      });
      // consoleLog("Bill Payload:", payload.data);
      let totalPage = Math.ceil(payload.data.count / this.state.limit);
      if (
        allBillInvoice == null ||
        allBillInvoice == [] ||
        allBillInvoice == undefined
      ) {
        this.setState({
          listData: [],
        });
      } else {
        this.setState({
          listData: allBillInvoice,
          totalCount: payload.data.count,
          total_page: totalPage,
        });
      }
    }
  };
  getPayableDetails = async (data) => {
    // .............................................
    let modifyData = { isSelected: false };
    let res = await ApiCall("fetchBillsUnderVerificationPayable", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload),
        allBillInvoice = [];
      allBillInvoice = payload.data.details;

      allBillInvoice.map((obj) => {
        Object.assign(obj, modifyData);
      });
      // consoleLog("Bill Payload payload payable:", allBillInvoice);
      let totalPage = Math.ceil(payload.data.count / this.state.limit_payable);
      if (
        allBillInvoice == null ||
        allBillInvoice == [] ||
        allBillInvoice == undefined
      ) {
        this.setState({
          payableData: [],
        });
      } else {
        this.setState({
          payableData: allBillInvoice,
          total_page_payable: totalPage,
        });
      }
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

    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      jobId: this.state.id,
      search: this.state.input,
      clientId:this.state.selectedClient.value == null || this.state.selectedClient.value == undefined ? "" : this.state.selectedClient.value,
      searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto:"",
      requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
      courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
    };
    let mainData = Object.assign(reqData, resData);

    this.getListDetails(mainData);
  };
  exRigth = () => {
    let currentPage = this.state.current_page;
    let totalPage = this.state.total_page;
    this.setState({
      current_page: totalPage,
    });
    let resData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((currentPage - 1) * this.state.limit),
      jobId: this.state.id,
      search: this.state.input,
      clientId:this.state.selectedClient.value == null || this.state.selectedClient.value == undefined ? "" : this.state.selectedClient.value,
      searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto:"",
      requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
      courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
  };
    let mainData = Object.assign(reqData, resData);

    this.getListDetails(mainData);
  };
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
      jobId: this.state.id,
      search: this.state.input,
      clientId:this.state.selectedClient.value == null || this.state.selectedClient.value == undefined ? "" : this.state.selectedClient.value,
      searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto:"",
      requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
      courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
 
   
    };
    let mainData = Object.assign(reqData, resData);

    this.getListDetails(mainData);
  };
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
      jobId: this.state.id,
      search: this.state.input,
      clientId:this.state.selectedClient.value == null || this.state.selectedClient.value == undefined ? "" : this.state.selectedClient.value,
      searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto:"",
      requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
      courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
   
    };
    let mainData = Object.assign(reqData, resData);

    this.getListDetails(mainData);
  };

  // .............pagination function for payable..........
  clickChange_payable = (e) => {
    this.setState({
      current_page_payable: e.target.value,
    });
  };
  exLeft_payable = () => {
    this.setState({
      current_page_payable: 1,
    });

    let resData = {
      limit: this.state.limit_payable,
      offset: this.state.offset_payable.toString(),
      jobId: this.state.id,
      search: this.state.input,
      vendorId:this.state.selectedVendor.value == null || this.state.selectedVendor.value == undefined ? "" : this.state.selectedVendor.value,
      searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto:"",
      requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
      courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
   
    };
    let mainData = Object.assign(reqData, resData);

    this.getPayableDetails(mainData);
  };
  exRigth_payable = () => {
    let currentPage = this.state.current_page_payable;
    let totalPage = this.state.total_page_payable;
    this.setState({
      current_page_payable: totalPage,
    });
    let resData = {
      limit: JSON.stringify(this.state.limit_payable),
      offset: JSON.stringify((currentPage - 1) * this.state.limit_payable),
      jobId: this.state.id,
      search: this.state.input,
      vendorId:this.state.selectedVendor.value == null || this.state.selectedVendor.value == undefined ? "" : this.state.selectedVendor.value,
      searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto:"",
      requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
      courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
 
   
    };
    let mainData = Object.assign(reqData, resData);

    this.getPayableDetails(mainData);
  };
  prev_payable = () => {
    let currentPage = this.state.current_page_payable;
    if (currentPage > 1) {
      currentPage--;
      this.setState({
        current_page_payable: currentPage,
      });
    }
    let resData = {
      limit: JSON.stringify(this.state.limit_payable),
      offset: JSON.stringify((currentPage - 1) * this.state.limit_payable),
      jobId: this.state.id,
      search: this.state.input,
      vendorId:this.state.selectedVendor.value == null || this.state.selectedVendor.value == undefined ? "" : this.state.selectedVendor.value,
      searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto:"",
      requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
      courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
   
    };
    let mainData = Object.assign(reqData, resData);

    this.getPayableDetails(mainData);
  };
  next_payable = () => {
    let currentPage = this.state.current_page_payable;
    let totalPage = this.state.total_page_payable;

    if (currentPage < totalPage) {
      currentPage++;
      this.setState({
        current_page_payable: currentPage,
      });
    }
    let resData = {
      limit: JSON.stringify(this.state.limit_payable),
      offset: JSON.stringify((currentPage - 1) * this.state.limit_payable),
      jobId: this.state.id,
      search: this.state.input,
      vendorId:this.state.selectedVendor.value == null || this.state.selectedVendor.value == undefined ? "" : this.state.selectedVendor.value,
      searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto:"",
      requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
      courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
 
    };
    let mainData = Object.assign(reqData, resData);

    this.getPayableDetails(mainData);
  };

  //   ......................func for filter modal open...............
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

  openInvoiceModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("invoice-model").style.display = "block";
    document.getElementById("invoice-model").classList.add("show");
  };

  closeInvoiceModal = () => {
    document.getElementById("invoice-model").style.display = "none";
    document.getElementById("invoice-model").classList.remove("show");
    document.getElementById("backdrop").style.display = "none";
  };
  openAdminInfoModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("adminInfo-model").style.display = "block";
    document.getElementById("adminInfo-model").classList.add("show");
  };
  closeAdminInfoModal = () => {
    document.getElementById("adminInfo-model").style.display = "none";
    document.getElementById("adminInfo-model").classList.remove("show");
    document.getElementById("backdrop").style.display = "none";
  };
  openCreateTemplateModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("createTemplate-model").style.display = "block";
    document.getElementById("createTemplate-model").classList.add("show");
  };
  closeCreateTemplateModal = () => {
    document.getElementById("createTemplate-model").style.display = "none";
    document.getElementById("createTemplate-model").classList.remove("show");
    document.getElementById("backdrop").style.display = "none";
  };
  openChooseTemplateModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("chooseTemplate-model").style.display = "block";
    document.getElementById("chooseTemplate-model").classList.add("show");
  };
  closeChooseTemplateModal = () => {
    document.getElementById("chooseTemplate-model").style.display = "none";
    document.getElementById("chooseTemplate-model").classList.remove("show");
    document.getElementById("backdrop").style.display = "none";
  };
  // .............filter modal function...................

  openInfoModal = () => {
    this.openAdminInfoModal();
    this.handleMenuClose();
  };

  openTemplateModal = () => {
    this.openCreateTemplateModal();
    this.handleMenuClose();
  };

  openSelectTemplateModal = () => {
    this.openChooseTemplateModal();
    this.chooseTemplateApi();
    this.handleMenuClose();
  };

  formDateChange = (date) => {
    this.setState({
      formDate:SetUSAdateFormat(date),
    });
  };

  toDateChange = (date) => {
    this.setState({
      toDate: SetUSAdateFormat(date),
    });
  };

  requesterChange = (val) => {
    this.setState({
      selectedRequester: val,
    });
  };
  onContractChange = (val) => {
    this.setState({
      selectedContract: val,
    });
  };

  onLeiChange = (data) => {
    this.setState({
      leiData: data,
    });
  };
  clientChange = (value) => {
    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      jobId: this.state.id,
      search: this.state.input,
      clientId:value.value,
      searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto:"",
      requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
      courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
 
    };

    let mainData = Object.assign(reqData, resData);

    this.getListDetails(mainData);
    // console.log("selected Client",value);
    this.setState({
      selectedClient: value,
    });
  };
  vendorChange = (value) => {
    // console.log("selected Client",value);
    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      jobId: this.state.id,
      search: this.state.input,
      vendorId:value.value,
      searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto:"",
      requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
      courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
 
    };

    let mainData = Object.assign(reqData, resData);

    this.getPayableDetails(mainData);
    this.setState({
      selectedVendor: value,
    });
  };
  onChangeLimit = async (dat) => {
    this.setState({
      limit: parseInt(dat.value),
      selectedDisplayData: dat,
      current_page:1
    })
    let resData = {
      limit: this.state.limit,
      offset: "0",
      jobId: this.state.id,
      search: this.state.input,
      clientID:this.state.selectedClient.value,
      searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto:"",
      requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
      courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
 
    };

    let mainData = Object.assign(reqData, resData);

    this.getListDetails(mainData);
  }
  onChangeLimit_payable = async (dat) => {
    this.setState({
      limit_payable: parseInt(dat.value),
      selectedDisplayData_payable: dat,
      current_page_payable:1
    })
    let resData = {
      limit: this.state.limit_payable,
      offset: "0",
      jobId: this.state.id,
      search: this.state.input,
      vendorId:this.state.selectedVendor.value == undefined || this.state.selectedVendor.value == null ? "" : this.state.selectedVendor.value,
      searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      searchto:"",
      requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
      courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
 
    };

    let mainData = Object.assign(reqData, resData);

    this.getPayableDetails(mainData);
  }
  onFilterApply = () => {
    if (this.state.isReceivable == true) {
      let resData = {
        limit: this.state.limit,
        offset: this.state.offset.toString(),
        search: this.state.input,
        jobId: this.state.id,
        vendorId:"",
        clientId:this.state.selectedClient.value == null || this.state.selectedClient.value == undefined ? "" : this.state.selectedClient.value,
        searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        searchto:"",
        requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
        trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
        trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
        clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
        courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
                
      };

      // consoleLog("req data: filter:",resData)

      let mainData = Object.assign(reqData, resData);
      // consoleLog("req data: filter:",mainData)

      this.getListDetails(mainData);

      this.closeFilterModal();
    } else {
      let resData = {
        limit: this.state.limit_payable,
        offset: this.state.offset_payable.toString(),
        search: this.state.input,
        jobId: this.state.id,
        clientId:"",
        vendorId:this.state.selectedVendor.value == null || this.state.selectedVendor.value == undefined ? "" : this.state.selectedVendor.value,
        searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
        searchto:"",
        requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
        trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
        trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
        clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
        courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
  
      };
    

      let mainData = Object.assign(reqData, resData);
      // consoleLog("req data: filter:",mainData)

      this.getPayableDetails(mainData);
      this.closeFilterModal();
    }
  };

  onResetFilter = () => {
    
    if (this.state.isReceivable == true) {
      this.resetData();
    this.setState({
      current_page: 1,
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
    });
    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      serviceTypeId: "47",
      jobId: "",
      search: "",
      searchto: "",
      searchfrom: "",
      trainingCatId:"",
      trainingFormatId:"",
      courseId:"",
      clientContractPath:"",
      vendorId:"",
      clientId:"",
     
    };
    

    this.getListDetails(resData);
  } else {
    this.resetData();
    this.setState({

      current_page_payable: 1,
      selectedDisplayData_payable: {
        label: "20",
        value: "20",
      },
    });
    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      serviceTypeId: "47",
      jobId: "",
      search: "",
      searchto: "",
      searchfrom: "",
      trainingCatId:"",
      trainingFormatId:"",
      courseId:"",
      clientContractPath:"",
      vendorId:"",
      clientId:"",
     
    };
    

    this.getPayableDetails(resData);
  }

    this.closeFilterModal();
  };
  

  onIdChange = (val) => {
    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      search: this.state.input,
      jobId: val,
      vendor:"",
      clientId:this.state.selectedClient.value == null || this.state.selectedClient.value == undefined ? "" : this.state.selectedClient.value,
      searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
       requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
      courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
 
    };

    let MainData = Object.assign(reqData, resData);

    this.getListDetails(MainData);
    this.setState({
      id: val,
    });
  };

  inputChange = (e) => {
    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      jobId: this.state.id,
      search: e.target.value,
      vendorId:"",
      clientId:this.state.selectedClient.value == null || this.state.selectedClient.value == undefined ? "" : this.state.selectedClient.value,
      searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
      courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
 
    };

    let mainData = Object.assign(reqData, resData);

    this.getListDetails(mainData);

    this.setState({
      input: e.target.value,
    });
  };

  onIdChange_payable = (val) => {
    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      search: this.state.input,
      jobId: val,
      clientId:"",
      vendorId:this.state.selectedVendor.value == null || this.state.selectedVendor.value == undefined ? "" : this.state.selectedVendor.value,
      searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
      courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
 
    };

    let MainData = Object.assign(reqData, resData);

    this.getPayableDetails(MainData);
    this.setState({
      id: val,
    });
  };

  inputChange_payable = (e) => {
    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      jobId: this.state.id,
      search: e.target.value,
      clientId:"",
      vendorId:this.state.selectedVendor.value == null || this.state.selectedVendor.value == undefined ? "" : this.state.selectedVendor.value,
      searchfrom:this.state.formDate == "" ? "" : SetScheduleDate(this.state.formDate),
      requester:this.state.selectedRequester.value == null || this.state.selectedRequester.value == undefined ? "" : this.state.selectedRequester.value,
      trainingCatId:this.state.selectedTrainingCategory.value == null || this.state.selectedTrainingCategory.value == undefined ? "" : this.state.selectedTrainingCategory.value,
      trainingFormatId:this.state.selectedFormat.value == null || this.state.selectedFormat.value == undefined ? "" : this.state.selectedFormat.value,
      clientContractPath:this.state.selectedContract.value == null || this.state.selectedContract.value == undefined ? "" : this.state.selectedContract.value ,
      courseId:this.state.selectedCourse.value == null || this.state.selectedCourse.value == undefined ? "" : this.state.selectedCourse.value
 
    };

    let mainData = Object.assign(reqData, resData);

    this.getPayableDetails(mainData);

    this.setState({
      input: e.target.value,
    });
  };

  onTick = async (item, id) => {
    // consoleLog("%%%%%%", id);
    if (item == 0) {
      item = 1;
    } else {
      item = 0;
    }

    let res = await ApiCall("changeStatusAccountPayable", {
      id: id,
      status: item.toString(),
    });
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.PAYABALES.SUCCESS);

      this.load();
      let resDataPayable = {
        limit: this.state.limit_payable,
        offset: this.state.offset_payable.toString(),
      };

      let MainDataPayable = Object.assign(reqData, resDataPayable);

      this.getPayableDetails(MainDataPayable);
    } else {
      toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
    }
  };

  onReject = async (item, id, index) => {
    let arr = this.state.listData;

    // arr

    let res = await ApiCall("changeStatusAccountPayable", {
      id: id,
      status: "5",
    });
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.PAYABALES.REJECT);

      this.load();
    } else {
      toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
    }
  };

  showDetails = (val, index) => {
    // consoleLog("88", val);
    let trainingValue = this.props.trainingData;
    if (val.serviceTypeId === 45) {
      trainingValue.history.push({
        pathname: "/adminJobDetailsFromBillVerification",
        state: val.requestId,
      });
    } else if (val.serviceTypeId === 46) {
      trainingValue.history.push({
        pathname: "/adminTranslationDetailsFromBillVerification",
        state: val.requestId,
      });
    } else if (val.serviceTypeId === 47) {
      trainingValue.history.push({
        pathname: "/adminTrainingDetailsFromBillVerification",
        state: val.requestId,
      });
    }
  };
  goEdit = () => {
    this.props.history.push({
      pathname: "/adminTranslationDetails",
      state: this.state.listData[this.state.curIndex].requestId,
    });
  };

  // ..................for invoice modal.........................

  onInvoiceStatusChange = (value) => {
    let obj = { label: value.label, value: value.value };
    this.setState({
      invoiceStatusData: obj,
    });
  };

  onInvoiceBillingChange = (e) => {
    this.setState({
      billingAddress: e.target.value,
    });
  };
  onInvoicePhoneChange = (value) => {
    this.setState({
      phoneNumber: value,
    });
  };
  onInvoiceEmailChange = (value) => {
    this.setState({
      invoiceEmail: value,
    });
  };

  menuBtnhandleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  onProfileImage = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      // console.log(res.data.data);
      this.setState({
        imagePath: res.data.data.url,
        adminPhoto: res.data.data.path + res.data.data.filename,
      });
      this.onUpdate();
    });
  };

  //..............function for MenuButton close..............
  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  // onLocationInputChange = async (val) => {
  //   let arrData = [];
  //   let locationData = [];

  //   if (val.length > 0) {
  //     let locationRes = await ApiCall("getlocaiondescription", {
  //       place: val,
  //     });
  //     if (
  //       locationRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
  //       locationRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  //     ) {
  //       let locationArr = Decoder.decode(locationRes.data.payload);
  //       locationData = locationArr.data.locaionsuggesion;
     
  //       for (let i = 0; i < locationData.length; i++) {
  //         arrData.push({
  //           label: locationData[i].description,
  //           value: locationData[i].placeid,
  //         });
  //       }

  //       this.setState({
  //         locationArr: arrData,
  //         locationData: val,
  //       });
  //     }
  //   }
  // };

  // onLocationChange = (value) => {
  //   // console.log("location value", value)
  //   this.setState({
  //     locationData: value,
  //   });
  // };

  onCategoryChange = (data) => {
    // consoleLog("val:::", data.value);
    this.setState({
      selectedTrainingCategory: data,
    });
  };
  onCourseChange = (value) => {
  
    this.setState({
      selectedCourse: value,
      
    });
  };
  onFormatChange = (value) => {
    this.setState({
      selectedFormat: value,
      
    });
  }

  onTabClick = (value) => {
    if (value === "receivables") {
      this.resetData();
      let resData = {
        limit: this.state.limit,
        offset: this.state.offset.toString(),
        serviceTypeId: "47",
        jobId: "",
        search: "",
        searchto: "",
        searchfrom: "",
        trainingCatId:"",
        trainingFormatId:"",
        courseId:"",
        clientContractPath:"",
        vendorId:"",
        clientId:"",
      };

     

      this.getListDetails(resData);
      this.setState({
        isPayable: false,
        isReceivable: true,
      });
      this.getListDetails();
    } else if (value === "payables") {
      this.resetData();
      let resDataPayable = {
        limit: this.state.limit_payable,
        offset: this.state.offset_payable.toString(),
        serviceTypeId: "47",
        jobId: "",
        search: "",
        searchto: "",
        searchfrom: "",
        trainingCatId:"",
        trainingFormatId:"",
        courseId:"",
        clientContractPath:"",
        vendorId:"",
        clientId:"",
      };

     

      this.getPayableDetails(resDataPayable);
      this.setState({
        isPayable: true,
        isReceivable: false,
      });
      this.getPayableDetails();
    }
  };
  receivableTypeChange = (val, id) => (e) => {
    // consoleLog("val:", val);
    if (val == "receivable") {
      let selectedArr = this.state.selectedListData;
      let brr = [];

      let arr = this.state.listData;
      if (e.target.checked) {
        arr[id].isSelected = true;
      } else {
        arr[id].isSelected = false;
      }

      this.setState({
        listData: arr,
        isChecked: arr[id].isSelected,
        selectedListData: selectedArr,
      });
    } else {
      // let selectedArr = this.state.selectedListData;
      let brr = [];

      let arr = this.state.payableData;
      if (e.target.checked) {
        arr[id].isSelected = true;
      } else {
        arr[id].isSelected = false;
      }

      this.setState({
        payableData: arr,
        isChecked: arr[id].isSelected,
        // selectedListData: selectedArr,
      });
    }
  };

  onExport = async () => {
    let brr = [],
      arrId = [],
      clientID = "",
      jobID = "",
      invoiceId = "",
      mainInvoiceId = "",
      clientName = "";
    for (let i = 0; i < this.state.listData.length; i++) {
      if (this.state.listData[i].isSelected === true) {
        brr.push(this.state.listData[i]);
      }
    }
    // consoleLog("%%%%", brr);

    brr.map((obj) => {
      arrId.push(obj.id);
      // clientID = obj.clientId;
      // jobID.push(obj.jobId);
      // clientName = obj.clientName;
      // invoiceId = obj.id;
    });

    if (brr.length < 1) {
      toast.error("Please select one row");
    } else {
      let obj = { id: arrId };

      let res = await ApiCall("exportInvoiceReceivables", obj);
      // consoleLog("resss", res);
      const decodeData = Decoder.decode(res.data.payload);
      // consoleLog("payload", decodeData);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        window.open(decodeData.data.url, "_blank");
      }
    }
  };

  onExportPayable = async () => {
    let brr = [],
      arrId = [],
      clientName = "";
    for (let i = 0; i < this.state.payableData.length; i++) {
      if (this.state.payableData[i].isSelected === true) {
        brr.push(this.state.payableData[i]);
      }
    }
    // consoleLog("%%%%", brr);

    brr.map((obj) => {
      arrId.push(obj.id);
      // clientID = obj.clientId;
      // jobID.push(obj.jobId);
      // clientName = obj.clientName;
      // invoiceId = obj.id;
    });

    if (brr.length < 1) {
      toast.error("Please select one row");
    } else {
      let obj = { id: arrId };

      let res = await ApiCall("exportInvoicePayables", obj);
      // consoleLog("resss", res);
      const decodeData = Decoder.decode(res.data.payload);
      // consoleLog("payload", decodeData);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        window.open(decodeData.data.url, "_blank");
      }
    }
  };

  resetData = () => {
    this.setState({
      formDate: "",
      toDate: "",
      selectedVendor:{},
      selectedClient:{},
      id:"",
      input:"",
      selectedFormat:{},
      selectedTrainingCategory:{},
      selectedCourse:{},
      selectedRequester:{},

      selectedContract:{},
  
    })
  }

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open

    const checkStatus = (status) => {
      if (status === 0) {
        return <span className="progress-btn yellow">Pending</span>;
      } else if (status === 1) {
        return (
          <a href="javascript:void(0)" className="progress-btn sky">
            Verified
          </a>
        );
      } else if (status === 5) {
        return (
          <a href="javascript:void(0)" className="progress-btn red">
            Rejected
          </a>
        );
      }
    };

    const checkAction = (data, index) => {
      // consoleLog("data::", data);
      return (
        <React.Fragment>
          <a href="javascript:void(0)">
            <img
              src={ImageName.IMAGE_NAME.EYE_BTN}
              onClick={() => this.showDetails(data, index)}
              style={{ marginRight: "5px" }}
            />
          </a>
          <a href="javascript:void(0)">
            <img
              src={ImageName.IMAGE_NAME.BLUE_TICK_JPG}
              onClick={() => this.onTick(data.status, data.id)}
            />
          </a>
        </React.Fragment>
      );
    };

    // const checkAction = (status, id, index) => {
    //   if (status === 0 || status === 5) {
    //     return (
    //       <React.Fragment>
    //         {status === 5 ? (
    //           <React.Fragment></React.Fragment>
    //         ) : (
    //           <React.Fragment>
    //             <a href="javascript:void(0)">
    //               <img
    //                 src={ImageName.IMAGE_NAME.EYE_BTN}
    //                 onClick={() =>
    //                   this.showDetails(data, i)
    //                 }
    //                 style={{ marginRight: "5px" }}
    //               />
    //             </a>
    //           </React.Fragment>
    //         )}
    //         {status === 0 || status === 5 ? (
    //           <React.Fragment>
    //             <a href="javascript:void(0)">
    //               <img
    //                 src={ImageName.IMAGE_NAME.BLUE_TICK_JPG}
    //                 onClick={() => this.onTick(status, id)}
    //               />
    //             </a>
    //           </React.Fragment>
    //         ) : (
    //           <React.Fragment />
    //         )}
    //       </React.Fragment>
    //     );
    //   }
    // };
    return (
      <React.Fragment>
        <ToastContainer hideProgressBar theme="colored" />

        <div className="vendor-info _fl sdw">
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
                    Project ID
                  </span>
                  {this.state.isReceivable ? <React.Fragment>
                    <InputText
                    placeholder="Search"
                    className="inputfield"
                    value={this.state.id}
                    onTextChange={(value) => {
                      this.onIdChange(value);
                    }}
                  />
                  </React.Fragment> : <React.Fragment>
                  <InputText
                    placeholder="Search"
                    className="inputfield"
                    value={this.state.id}
                    onTextChange={(value) => {
                      this.onIdChange_payable(value);
                    }}
                  />
                    </React.Fragment>}
                  {/* <InputText
                    placeholder="Search"
                    className="inputfield"
                    value={this.state.id}
                    onTextChange={(value) => {
                      this.onIdChange(value);
                    }}
                  /> */}
                </div>
              </div>
              <div className="col-md-4">
                <div className="vn_frm">
                {this.state.isReceivable ? (
                    <React.Fragment>
                      <span
                        style={{
                          // width: "10%",
                          // paddingLeft: "5px",
                          fontSize: "14px",
                        }}
                      >
                        Client
                      </span>

                      <div className="dropdwn" style={{marginLeft:"60px"}}>
                        <SelectBox
                          optionData={this.state.allClientArr}
                          value={this.state.selectedClient}
                          onSelectChange={(value) => this.clientChange(value)}
                          // isDisabled = {true}
                        ></SelectBox>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <span
                        style={{
                          // width: "10%",
                          // paddingLeft: "5px",
                          fontSize: "14px",
                        }}
                      >
                        Vendor
                      </span>

                      <div className="dropdwn" style={{marginLeft:"60px"}}>
                        <SelectBox
                          optionData={this.state.vendorArr}
                          value={this.state.selectedVendor}
                          onSelectChange={(value) => this.vendorChange(value)}
                          // isDisabled = {true}
                        ></SelectBox>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div className="vn_frm ">
                  
                {this.state.isReceivable ? <React.Fragment>
                    <input
                    type="text"
                    value={this.state.input}
                    name=""
                    placeholder="Search"
                    className="inputfield"
                    onChange={this.inputChange}
                    style={{ width: "80%", marginLeft: "40px" }}
                  />
                  </React.Fragment> : <React.Fragment>
                  <input
                    type="text"
                    value={this.state.input}
                    name=""
                    placeholder="Search"
                    className="inputfield"
                    onChange={this.inputChange_payable}
                    style={{ width: "80%", marginLeft: "40px" }}
                  />
                    </React.Fragment>}
                </div>
              </div>
            </div>
          </div>
          <div className="vn-form _fl" style={{ marginTop: "50px" }}>
            <div className="row">
              <div className="col-md-4">
                <div className="_fl verificaiton-doc-tab ven">
                  <ul>
                    <li
                      className="active"
                      id="rec"
                      data-related="trainingReceivable"
                      onClick={() => {
                        this.onTabClick("receivables");
                      }}
                    >
                      Receivables
                    </li>
                    <li
                      data-related="trainingPayable"
                      onClick={() => {
                        this.onTabClick("payables");
                      }}
                    >
                      Payables
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-4"></div>
              <div className="col-md-2"></div>
              <div className="col-md-2">
                {this.state.isReceivable ? <React.Fragment>
                  <a
                    href="javascript:void(0)"
                    className="progress-btn sky"
                    style={{
                      textAlign: "center",
                      textDecoration: "none",
                      fontSize: "12px",
                      // pointerEvents:this.state.isChecked ? "" : "none"
                    }}
                    onClick={this.onExport}
                  >
                    Export
                  </a>
                </React.Fragment> : <React.Fragment>
                  <a
                    href="javascript:void(0)"
                    className="progress-btn sky"
                    style={{
                      textAlign: "center",
                      textDecoration: "none",
                      fontSize: "12px",
                      // pointerEvents:this.state.isChecked ? "" : "none"
                    }}
                    onClick={this.onExportPayable}
                  >
                    Export
                  </a>
                </React.Fragment>}

              </div>
            </div>
          </div>
        </div>

        {this.state.isReceivable ? (
          <React.Fragment>
            <div className="table-filter-app-b">
              <div className="filter-btn">
                <a
                  href={"javascript:void(0)"}
                  onClick={this.openFilterModal}
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
              <div className="table-filter-box">
                <div className="tble-short">
                  <span className="lbl">Display</span>
                  <div
                    className="dropdwn"
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
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="table-filter-app-b">
              <div className="filter-btn">
                <a
                  href={"javascript:void(0)"}
                  onClick={this.openFilterModal}
                >
                  Filter
                </a>
              </div>
              <div className="filter-pagination">
                <button
                  className="prev_btn"
                  onClick={this.exLeft_payable}
                ></button>
                <button className="prv_btn" onClick={this.prev_payable}>
                  {" "}
                  {"<"}
                </button>
                <span
                  className="num"
                  onChange={(e) => this.clickChange_payable(e)}
                >
                  {this.state.current_page_payable}
                </span>
                <button className="nxt_btn" onClick={this.next_payable}>
                  {">"}
                </button>
                <button
                  className="next_btn"
                  onClick={this.exRigth_payable}
                ></button>
              </div>
              <div className="table-filter-box">
                <div className="tble-short">
                  <span className="lbl">Display</span>
                  <div
                    className="dropdwn"
                    style={{
                      width: "70px",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    <PaginationDropdown
                      optionData={CommonData.COMMON.DISPLAY_ARR}
                      value={this.state.selectedDisplayData_payable}
                      placeholder="Select"
                      onSelectChange={(value) => {
                        this.onChangeLimit_payable(value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}

        <div className="tab-app-information activeLnk" id="trainingReceivable">
          <div className="table-listing-app">
            <div className="table-responsive">
              <table
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
              >
                <tbody>
                  <tr>
                    <th style={{ width: "8%" }}>
                      <strong>Project ID</strong>
                    </th>
                    <th style={{ width: "10%" }}>Service</th>
                    <th style={{ width: "10%" }}>Client(Bill To)</th>
                    {/* <th style={{ width: "10%" }}>Vendor</th>
                        <th style={{ width: "10%" }}>Vendor Type</th> */}
                    <th style={{ width: "12%" }}>Actual Date</th>
                    <th style={{ width: "10%" }}>Status</th>
                    <th style={{ width: "11%" }}>Total Amount</th>
                    <th style={{ width: "6%" }}>Action</th>
                  </tr>
                </tbody>
                <tbody>
                  {this.state.listData.length > 0 ? (
                    <React.Fragment>
                      {this.state.listData.map((data, i) => (
                        <React.Fragment>
                          <tr>
                            <td
                              style={{ width: "8%" }}
                              data-toggle="tooltip"
                              data-placement="top"
                              title={data.jobId}
                            >
                              <label className="custom_check2">
                                <input
                                  type="checkbox"
                                  name={i}
                                  checked={data.isSelected}
                                  onChange={this.receivableTypeChange(
                                    "receivable",
                                    i
                                  )}
                                />
                                <span
                                  className="checkmark2"
                                  style={{ padding: "10px" }}
                                ></span>
                                <strong>
                                  <div
                                    onClick={() =>
                                      this.showDetails(data, i)
                                    }
                                    style={{
                                      paddingLeft: "5px",
                                      paddingTop: "4px",
                                    }}
                                  >
                                    {data.jobId.length > 15
                                      ? textTruncate(data.jobId, 15)
                                      : data.jobId}
                                    {/* // {textTruncate(data.jobId, 15)} */}
                                  </div>
                                </strong>
                              </label>
                            </td>
                            <td style={{ width: "10%" }}>
                              {data.serviceType}
                            </td>
                            <td
                              style={{ width: "10%" }}
                              data-toggle="tooltip"
                              data-placement="top"
                              title={data.email}
                            >
                              {data.clientName.length > 20
                                ? textTruncate(data.clientName, 20)
                                : data.clientName}
                            </td>
                            {/* <td style={{ width: "10%" }}>
                                  {data.vendorName}
                                </td>
                                <td style={{ width: "10%" }}>
                                  {" "}
                                  {data.vendotType}
                                </td> */}
                            <td style={{ width: "12%" }}>
                              {SetDateFormat(data.endTime) +
                                " | " +
                                SetTimeFormat(data.endTime)}
                            </td>
                            <td style={{ width: "10%" }}>
                              {data.status === 0 ? (
                                <React.Fragment>
                                  <span className="progress-btn yellow">
                                    Pending
                                  </span>
                                </React.Fragment>
                              ) : data.status === 1 ? (
                                <React.Fragment>
                                  <span
                                    href="#"
                                    className="progress-btn sky"
                                  >
                                    Verified
                                  </span>
                                </React.Fragment>
                              ) : data.status === 2 ? (
                                <React.Fragment>
                                  <span
                                    href="#"
                                    className="progress-btn blue"
                                  >
                                    Invoice Created
                                  </span>
                                </React.Fragment>
                              ) : data.status === 3 ? (
                                <React.Fragment>
                                  <span
                                    href="#"
                                    className="progress-btn green"
                                  >
                                    Paid
                                  </span>
                                </React.Fragment>
                              ) : data.status === 1 ? (
                                <React.Fragment>
                                  <span
                                    href="#"
                                    className="progress-btn red"
                                  >
                                    Payment Failed
                                  </span>
                                </React.Fragment>
                              ) : data.status === 1 ? (
                                <React.Fragment>
                                  <span
                                    href="#"
                                    className="progress-btn red"
                                  >
                                    Rejected
                                  </span>
                                </React.Fragment>
                              ) : (
                                <React.Fragment />
                              )}

                              {/* <a href="#" className="progress-btn sky">Verified</a> */}
                            </td>
                            <td style={{ width: "11%" }}>
                              $ {data.totalAmount}
                            </td>
                            <td style={{ width: "6%" }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                              >
                                {/* {checkAction(data.status, data.id, i)} */}
                                {checkAction(data, i)}
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
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
        <div className="tab-app-information" id="trainingPayable">
          <div className="table-listing-app">
            <div className="table-responsive">
              <table
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
              >
                <tbody>
                  <tr>
                    <th style={{ width: "9%" }}>
                      <strong>Project ID</strong>
                    </th>
                    <th style={{ width: "10%" }}>Service</th>
                    {/* <th style={{ width: "10%" }}>Client(Bill To)</th> */}
                    <th style={{ width: "10%" }}>Vendor</th>
                    <th style={{ width: "10%" }}>Vendor Type</th>
                    <th style={{ width: "12%" }}>Actual Date</th>
                    <th style={{ width: "10%" }}>Status</th>
                    <th style={{ width: "9%" }}>Total Amount</th>
                    <th style={{ width: "6%" }}>Action</th>
                  </tr>
                </tbody>
                <tbody>
                  {this.state.payableData.length > 0 ? (
                    <React.Fragment>
                      {this.state.payableData.map((data, i) => (
                        <React.Fragment>
                          <tr>
                            <td
                              style={{ width: "9%" }}
                              data-toggle="tooltip"
                              data-placement="top"
                              title={data.jobId}
                            >
                              <label className="custom_check2">
                                <input
                                  type="checkbox"
                                  name={i}
                                  checked={data.isSelected}
                                  onChange={this.receivableTypeChange(
                                    "payable",
                                    i
                                  )}
                                />
                                <span
                                  className="checkmark2"
                                  style={{ padding: "10px" }}
                                ></span>
                                <strong>
                                  <div
                                    onClick={() =>
                                      this.showDetails(data, i)
                                    }
                                    style={{
                                      paddingLeft: "5px",
                                      paddingTop: "4px",
                                    }}
                                  >
                                    {data.jobId.length > 15
                                      ? textTruncate(data.jobId, 15)
                                      : data.jobId}
                                    {/* {data.jobId} */}
                                  </div>
                                </strong>
                              </label>
                            </td>
                            <td style={{ width: "10%" }}>
                              {data.serviceType}
                            </td>
                            {/* <td style={{ width: "10%" }}>{data.clientName}</td> */}
                            <td
                              style={{ width: "10%" }}
                              data-toggle="tooltip"
                              data-placement="top"
                              title={data.vendorName}
                            >
                              {data.vendorName.length > 20
                                ? textTruncate(data.vendorName, 20)
                                : data.vendorName}
                            </td>
                            <td style={{ width: "10%" }}>
                              {" "}
                              {data.vendorType}
                            </td>
                            <td style={{ width: "12%" }}>
                              {SetDateFormat(data.endTime) +
                                " | " +
                                SetTimeFormat(data.endTime)}
                            </td>
                            <td style={{ width: "10%" }}>
                              {data.status === 0 ? (
                                <React.Fragment>
                                  <span className="progress-btn yellow">
                                    Pending
                                  </span>
                                </React.Fragment>
                              ) : data.status === 1 ? (
                                <React.Fragment>
                                  <span
                                    href="#"
                                    className="progress-btn sky"
                                  >
                                    Verified
                                  </span>
                                </React.Fragment>
                              ) : data.status === 2 ? (
                                <React.Fragment>
                                  <span
                                    href="#"
                                    className="progress-btn blue"
                                  >
                                    Invoice Created
                                  </span>
                                </React.Fragment>
                              ) : data.status === 3 ? (
                                <React.Fragment>
                                  <span
                                    href="#"
                                    className="progress-btn green"
                                  >
                                    Paid
                                  </span>
                                </React.Fragment>
                              ) : data.status === 1 ? (
                                <React.Fragment>
                                  <span
                                    href="#"
                                    className="progress-btn red"
                                  >
                                    Payment Failed
                                  </span>
                                </React.Fragment>
                              ) : data.status === 1 ? (
                                <React.Fragment>
                                  <span
                                    href="#"
                                    className="progress-btn red"
                                  >
                                    Rejected
                                  </span>
                                </React.Fragment>
                              ) : (
                                <React.Fragment />
                              )}

                              {/* <a href="#" className="progress-btn sky">Verified</a> */}
                            </td>
                            <td style={{ width: "9%" }}>
                              $ {data.totalAmount}
                            </td>
                            <td style={{ width: "6%" }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                              >
                                {checkAction(data, i)}
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
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
        {/* </div> */}
        {/* </div> */}

        {/* ..................modal................................. */}
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
                  <div class="_fl filterTab">
                    <ul style={{cursor:"pointer"}}>
                      <li className="active" data-related="tble-data-d" style={{padding:"20px 20px"}}>
                        Training Category
                      </li>
                      <li data-related="tble-data-e" style={{padding:"20px 20px"}}>Training Course</li>
                      <li data-related="tble-data-f" style={{padding:"20px 20px"}}>Requester</li>
                      <li data-related="tble-data-g" style={{padding:"20px 20px"}}>Format</li>
                      <li data-related="tble-data-h" style={{padding:"20px 20px"}}>Date</li>
                      {this.state.isReceivable ? (
                      <li data-related="tble-data-i" style={{padding:"20px 20px"}}>Contract Type</li>
                      ) : (
                        <React.Fragment />
                      )}
                      
                    
                    </ul>
                  </div>
                </div>
                <div
                  className="tab-app-information activeLnk1 "
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
                                  Training Category
                                </div>
                              </div>
                              <div className="row">
                                <div
                                  class="dropdwn"
                                  style={{ cursor: "pointer" }}
                                >
                                  <SelectBox
                             
                                    optionData={this.state.trainingCategoryArr}
                                   
                                    value={this.state.selectedTrainingCategory}
                                    placeholder="Select"
                                    onSelectChange={(value) => {
                                      this.onCategoryChange(value);
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
                <div className="tab-app-information" id="tble-data-e">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row" style={{ padding: "30px" }}>
                            <div className="col-md-12">
                              <div className="row">
                                {/* 
                                <div className="web-form-bx">
                                  <div className="frm-label">SOURCE LANGUAGE</div>
                                  <div className="bts-drop">
                                    <MultiSelectBox
                                      optionData={this.state.languageArr}
                                      value={this.state.sourceLangData}
                                      onSelectChange={(value) =>
                                        this.onSourceLangChange(value)
                                      }
                                    ></MultiSelectBox>
                                  </div>
                                </div> */}

                                <div className="web-form-bx">
                                  <div  class="lable-text"
                                  style={{ fontSize: "20px" }}> COURSE</div>
                                  <div className="bts-drop">
                                    <SelectBox
                                      optionData={this.state.courseArr}
                                      value={this.state.selectedCourse}
                                      onSelectChange={(value) =>
                                        this.onCourseChange(value)
                                      }
                                    ></SelectBox>
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
                <div className="tab-app-information" id="tble-data-f">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row">
                                <div className="web-form-bx">
                                  <div
                                    c
                                    className="lable-text"
                                    style={{ fontSize: "20px" }}
                                  >
                                    {" "}
                                    REQUESTER
                                  </div>
                                  <div className="bts-drop">
                                    <SelectBox
                                      optionData={this.state.requesterArr}
                                      value={this.state.selectedRequester}
                                      onSelectChange={(value) =>
                                        this.requesterChange(value)
                                      }
                                    ></SelectBox>
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
                <div className="tab-app-information" id="tble-data-g">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row">
                              <div className="web-form-bx">
                                  <div
                                    c
                                    className="lable-text"
                                    style={{ fontSize: "20px" }}
                                  >
                                    {" "}
                                    FORMAT
                                  </div>
                                  <div className="bts-drop">
                                    <SelectBox
                                      optionData={this.state.formatTypeArr}
                                      value={this.state.selectedFormat}
                                      onSelectChange={(value) =>
                                        this.onFormatChange(value)
                                      }
                                    ></SelectBox>
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
                              Date
                            </div>
                            <div className="row">
                              {/* <div className="col-md-10">
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
                              </div> */}
                              <div
                                className="input-group"
                                style={{
                                  width: "100%",
                                  borderRadius: "9px",
                                  height: "43px",
                                  border: "1px solid #ced4da",
                                  boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                }}
                              >
                                <div style={{ width: "80%", padding: "8px" }}>
                                  <span>{this.state.formDate}</span>
                                </div>
                                <div style={{ width: "20%" }}>
                                  <a style={{ float: "right" }}>
                                    <DatePicker
                                      dropdownMode="select"
                                      showMonthDropdown
                                      showYearDropdown
                                      adjustDateOnChange
                                      // minDate={new Date()}
                                      onChange={(date) =>
                                        this.formDateChange(date)
                                      }
                                      customInput={<Schedule />}
                                    />
                                  </a>
                                </div>
                              </div>
                              {/* <div className="t-time">
                                <span className="t1">
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.hourChangeUp_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.hour_fiter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.hourChange_filter}
                                    />
                                  </small>
                                </span>
                                <span className="t2">
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.minChangeUp_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.min_filter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.minChange_filter}
                                    />
                                  </small>
                                </span>
                                <span
                                  className="t3"
                                  style={{ marginLeft: "2%" }}
                                >
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.ampmChange_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.ampm_filter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.ampmChange_filter}
                                    />
                                  </small>
                                </span>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-app-information" id="tble-data-z">
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
                                <SelectBox
                                  // styles={customStyles}
                                  optionData={this.state.statusArr}
                                  // components={{
                                  //   DropdownIndicator,
                                  //   IndicatorSeparator: () => null,
                                  // }}
                                  value={this.state.statusData}
                                  placeholder="Select"
                                  onSelectChange={(value) => {
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
                                <SelectBox
                                  // styles={customStyles}
                                  optionData={this.state.leiArr}
                                  // components={{
                                  //   DropdownIndicator,
                                  //   IndicatorSeparator: () => null,
                                  // }}
                                  value={this.state.leiData}
                                  placeholder="Select"
                                  onSelectChange={(value) => {
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
                                CONTRACT TYPE{" "}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-8">
                              <div
                                class="dropdwn"
                                style={{ cursor: "pointer" }}
                              >
                                <SelectBox
                                  // styles={customStyles}
                                  optionData={contractTypeArr}
                                  // components={{
                                  //   DropdownIndicator,
                                  //   IndicatorSeparator: () => null,
                                  // }}
                                  value={this.state.selectedContract}
                                  placeholder="Select"
                                  onSelectChange={(value) => {
                                    this.onContractChange(value);
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

        <div
          className="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
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
