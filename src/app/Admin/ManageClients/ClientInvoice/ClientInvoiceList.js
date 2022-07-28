import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import { AlertMessage, ImageName } from "../../../../enums";
import { Decoder } from "../../../../services/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  consoleLog,
  decimalValue,
  phoneNumberCheck,
  SetDatabaseDateFormat,
  SetDateFormat,
  SetDOBFormat,
  SetDueDate,
  SetScheduleDate,
  SetTimeFormat,
  SetUSAdateFormat,
  textTruncate,
} from "../../../../services/common-function";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { ApiCall, ApiCallClient } from "../../../../services/middleware";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../../../Admin/SharedComponents/inputText";
// import "./invoicesaccountreceivable.css";
import $, { data } from "jquery";
import { Link } from "react-router-dom";
import Select, { components } from "react-select";

import axios from "axios";
import {
  IMAGE_PATH_ONLY,
  IMAGE_STORE_PATH,
  IMAGE_URL,
  INVOICE_PATH_ONLY,
} from "../../../../services/config/api_url";
import Switch from "@mui/material/Switch";
import {
  mobileNumberValidator,
  numberValidator,
} from "../../../../validators";






// ..........................style for react select........................

const customStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
    borderRadius: "6px",
    // width: "120%",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = "yellow";

    return {
      ...styles,
      color: isFocused ? "grey" : "white",
      //   backgroundColor: isDisabled ? "red" : "white",
      color: "#000",
      cursor: isDisabled ? "not-allowed" : "default",
    };
  },
};


// .......................for react select icon.............................................

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

const invoiceStatusArr = [
  {
    label: "Raised",
    value: 0,
  },
  {
    label: "Received",
    value: 1,
  },
  {
    label: "Paid",
    value: 2,
  },
  {
    label: "Payment Failed",
    value: 3,
  },
  {
    label: "Rejected",
    value: 4,
  },
  {
    label: "Void",
    value: 5,
  },
];
// .........status  dropdown,,,,,,,,,,,

const statusArr = [
  {
    
    label:"Paid",
    value:"2",
  },
  {
    label:"Unpaid",
    value:"1",
   
  }
];

export default class ClientInvoiceList extends React.Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    this.state = {
      isLoad: true,
      clientId: "",
      curIndexList: 0,
      selectedListData: [],
      selectedInvoiceData: [],
      isDuplicateData: false,
      isChecked: false,
      isVerifiedJobs: true,
      isInvoices: false,
      current_page: 1,
      total_page: 20,
      limit: 20,
      offset: 0,
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
     
      formDate_invoice: "",
      toDate_invoice: "",

      invoiceData: [],
      curIndex: 0,
      formDate: "",
      toDate: "",

      formDueDate:"",
      toDueDate:"",
      selectedVendorData: "",
      vendorArr: [],
      totalCount: "",
      input: "",
      show: true,
      anchorEl: null,
      anchorEl1: null,

      // ...for invoice modal......
      jobId: "",
      invoiceId: "",
      invoiceDate: today,
      dueDate: "",
      invoiceStatusArr: [],
      invoiceStatusData: {},
      invoicePeriodFromDate: "",
      invoicePeriodToDate: "",
      clientName: "",
      billingAddress: "",
      phoneNumber: "",
      invoiceEmail: "",
      invoiceNote: "",
      payableItems: [],
      imagePath: "images/profile-pic.png",
      adminPhoto: "",
      // ...for preview invoice modal......

      preview_invoiceId: "",
      preview_invoiceDate: "",
      preview_dueDate: "2022-01-25",
      preview_invoiceStatusArr: [],
      preview_invoiceStatusData: {},
      preview_invoicePeriodFromDate: "",
      preview_invoicePeriodToDate: "",
      preview_clientName: "",
      preview_billingAddress: "",
      preview_phoneNumber: "",
      preview_invoiceEmail: "",
      preview_invoiceNote: "",
      preview_payableItems: [],

      // .......for choose template............

      templateArr: [],
      selectedTemplateData: {},
      templateId: "",
      isEditable: false,

      showHide: {
        dueDateTemplate: true,
        invoicePeriodTemplate: true,
        billingAddressTemplate: true,
        phoneNumberTemplate: true,
        emailTemplate: true,
        invoiceNotesTemplate: true,
        payableItemsTemplate: true,
        invoiceIdTemplate: true,
        invoiceDateTemplate: true,
      },

      primaryCheck: false,
      id: "",
      invoiceId: "",
      countryCode: 1,
      adminCountryCode: 1,

      mainInvoiceId: "",

      tempId: 0,
      leiArr:[],
      selectedLei:{},
      selectedStatus:{},
      clientData:""
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();

    let d = SetDueDate(new Date());
    //  consoleLog("after one month::",SetDOBFormat(d._d))
  

    this.setState({
      dueDate: SetDOBFormat(d._d),
     
    });

    document.getElementById("backdrop").style.display = "none";
    var classInstance = this;

    var filterModal = document.getElementById("filter-model");
    var previewInvoiceModal = document.getElementById("previewInvoice-model");

    window.onclick = function (event) {
      if (event.target === filterModal) {
        classInstance.closeFilterModal();
      } else if (event.target === previewInvoiceModal) {
        classInstance.closePreviewInvoiceModal();
      }
    };

    consoleLog("props::",this.props.location.state)

    window.$(".verificaiton-doc-tab ul li").on("click", function () {
      $(".verificaiton-doc-tab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
    });
  }

  load = async () => {

    let mainData = this.props.location,
        preData = mainData.state;
        consoleLog("client data:::",preData.userId)
        this.setState({
            clientData:preData.userId
        })

    let leiDataArr=[],
        leiArr=[];

    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      search: "",
      jobId: "",
      searchto: "",
      searchfrom: "",
      searchduefrom:"",
      searchdueto:"",
      leiId:"",
      status:"",
      clientId:preData.userId
    };

    // let MainData = Object.assign(reqData, resData);

    this.getListDetails(resData);

    // ...........lei dropdown,,,,,,,,,,,,
    let leiRes = await ApiCall("getAllLeiList");
    if (
      leiRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      leiRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(leiRes.data.payload);

      leiDataArr = payload.data.leiList;
      consoleLog("all lei::", leiDataArr);
      for (let k = 0; k < leiDataArr.length; k++) {
        leiArr.push({
          label: leiDataArr[k].name,
          value: leiDataArr[k].userId,
        });
      }
    }

    this.setState({
      leiArr: leiArr,
    })
  };

  getListDetails = async (data) => {
    // .............................................
    consoleLog("req_dataaaa:::::",data)

    let res = await ApiCall("fetchClientInvoiceByClientId", data);
    // consoleLog("Res:", res);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload),
        invoiceData = [];

      invoiceData = payload.data.invoiceData;
      consoleLog("Bill Payload:", payload.data);

      let totalPage = Math.ceil(payload.data.count / this.state.limit);

      if (
        invoiceData == null ||
        invoiceData == undefined ||
        invoiceData == [] ||
        invoiceData == {} ||
        invoiceData == ""
      ) {
        this.setState({
          invoiceData: [],
        });
      } else {
        this.setState({
          invoiceData: invoiceData,
          //   totalCount: payload.data.count,
          total_page: totalPage,
        });
      }
    }
  };

  // .............pagination function for verified jobs..........
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
      invoiceId: this.state.invoiceId,
      search: this.state.input,
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchduefrom:this.state.formDueDate == "" ? "" :SetDatabaseDateFormat(this.state.formDueDate),
      searchdueto:this.state.toDueDate == "" ? "" : SetDatabaseDateFormat(this.state.toDueDate),
      leiId:this.state.selectedLei.value == null || this.state.selectedLei.value == undefined ? "" : this.state.selectedLei.value,
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      clientId:this.state.clientData
    };

    this.getListDetails(resData);
  };
  exRigth = () => {
    let totalPage = this.state.total_page;
    this.setState({
      current_page: totalPage,
    });
    let resData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit),
      jobId: this.state.id,
      invoiceId: this.state.invoiceId,
      search: this.state.input,
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchduefrom:this.state.formDueDate == "" ? "" :SetDatabaseDateFormat(this.state.formDueDate),
      searchdueto:this.state.toDueDate == "" ? "" : SetDatabaseDateFormat(this.state.toDueDate),
      leiId:this.state.selectedLei.value == null || this.state.selectedLei.value == undefined ? "" : this.state.selectedLei.value,
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      clientId:this.state.clientData
    };
    // let mainData = Object.assign(reqData, resData);
    // consoleLog("exRight::",mainData);

    this.getListDetails(resData);
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
      invoiceId: this.state.invoiceId,
      search: this.state.input,
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchduefrom:this.state.formDueDate == "" ? "" :SetDatabaseDateFormat(this.state.formDueDate),
      searchdueto:this.state.toDueDate == "" ? "" : SetDatabaseDateFormat(this.state.toDueDate),
      leiId:this.state.selectedLei.value == null || this.state.selectedLei.value == undefined ? "" : this.state.selectedLei.value,
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      clientId:this.state.clientData
    };
    // let mainData = Object.assign(reqData, resData);
    // consoleLog("prev::",mainData);

    this.getListDetails(resData);
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
      invoiceId: this.state.invoiceId,
      search: this.state.input,
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchduefrom:this.state.formDueDate == "" ? "" :SetDatabaseDateFormat(this.state.formDueDate),
      searchdueto:this.state.toDueDate == "" ? "" : SetDatabaseDateFormat(this.state.toDueDate),
      leiId:this.state.selectedLei.value == null || this.state.selectedLei.value == undefined ? "" : this.state.selectedLei.value,
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      clientId:this.state.clientData
    };
    // let mainData = Object.assign(reqData, resData);
    // consoleLog("next::",mainData);

    this.getListDetails(resData);
  };
  onChangeLimit = async (dat) => {
    this.setState({
      limit: parseInt(dat.value),
      selectedDisplayData: dat,
      current_page: 1,
    });

    let resData = {
      limit: dat.value,
      offset: JSON.stringify(
        (this.state.current_page - 1) * parseInt(dat.value)
      ),
      jobId: this.state.id,
      invoiceId: this.state.invoiceId,
      search: this.state.input,
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchduefrom:this.state.formDueDate == "" ? "" :SetDatabaseDateFormat(this.state.formDueDate),
      searchdueto:this.state.toDueDate == "" ? "" : SetDatabaseDateFormat(this.state.toDueDate),
      leiId:this.state.selectedLei.value == null || this.state.selectedLei.value == undefined ? "" : this.state.selectedLei.value,
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      clientId:this.state.clientData
    };
    // let mainData = Object.assign(reqData, resData);

    this.getListDetails(resData);
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

  openPreviewInvoiceModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("previewInvoice-model").style.display = "block";
    document.getElementById("previewInvoice-model").classList.add("show");
  };
  closePreviewInvoiceModal = () => {
    document.getElementById("previewInvoice-model").style.display = "none";
    document.getElementById("previewInvoice-model").classList.remove("show");
    document.getElementById("backdrop").style.display = "none";
  };

  // ................

  openPrevInvoiceModal = async (val) => {
    // consoleLog("valuee",val);
    let data = localStorage.getItem("AuthToken");
    let authUser = Decoder.decode(data);

    // consoleLog("valuee",authUser);
    let brr = [],
      arr = [],
      clientID = "",
      jobID = "",
      invoiceId = "";

    jobID = val.jobId;
    clientID = authUser.data.userid;
    invoiceId = val.invoiceId;

    //   mainInvoiceId = "",
    //   clientName = "";
    // for (let i = 0; i < this.state.invoiceData.length; i++) {
    //   if (this.state.invoiceData[i].isSelected === true) {
    //     brr.push(this.state.invoiceData[i]);
    //     this.setState({
    //       selectedInvoiceData: brr,
    //     });
    //   }
    // }

    // brr.map((obj) => {
    //   clientID = obj.clientId;
    //   jobID = obj.jobId;
    //   clientName = obj.clientName;
    //   invoiceId = obj.id;
    //   mainInvoiceId = obj.invoiceId;
    // });

    // this.setState({
    //   invoiceId: invoiceId,
    //   clientName: clientName,
    //   clientId: clientID,
    //   jobId: jobID,
    //   mainInvoiceId: mainInvoiceId,
    // });

    // if (brr.length > 1) {
    //   toast.error("Please select only one row");
    // } else {
    let resPayable = await ApiCall("fetchPayableItemsById", {
      invoiceId: invoiceId,
    });

    if (
      resPayable.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resPayable.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeDataPayable = Decoder.decode(resPayable.data.payload);

      this.setState({
        payableItems: decodeDataPayable.data.payableItems,
      });
    }

    let resInvoice = await ApiCall("fetchTemplateListByUserId", {
      userId: clientID,
    });

    if (
      resInvoice.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resInvoice.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeDataInvoice = Decoder.decode(resInvoice.data.payload);

      // consoleLog("responce invoice", decodeDataInvoice);
      if (
        decodeDataInvoice.data != null ||
        decodeDataInvoice.data != undefined ||
        decodeDataInvoice.data != [] ||
        decodeDataInvoice.data != {} ||
        decodeDataInvoice.data != ""
      ) {
        this.openPreviewInvoiceModal();

        decodeDataInvoice.data.map((obj) => {
          arr.push({
            label: obj.templateName,
            value: obj.id,
          });

          if (obj.isPrimary == 1) {
            let content = [];
            content = JSON.parse(obj.content);

            let showHideObj = {
              dueDateTemplate: false,
              invoicePeriodTemplate: false,
              billingAddressTemplate: false,
              phoneNumberTemplate: false,
              emailTemplate: false,
              invoiceNotesTemplate: false,
              invoiceIdTemplate: false,
              invoiceDateTemplate: false,
            };

            content.map((obj1) => {
              if (obj1.name === "Due Date") {
                showHideObj.dueDateTemplate = true;
              } else if (obj1.name === "Invoice Period") {
                showHideObj.invoicePeriodTemplate = true;
              } else if (obj1.name === "Billing Address") {
                showHideObj.billingAddressTemplate = true;
              } else if (obj1.name === "Phone Number") {
                showHideObj.phoneNumberTemplate = true;
              } else if (obj1.name === "Email") {
                showHideObj.emailTemplate = true;
              } else if (obj1.name === "Invoice Notes") {
                showHideObj.invoiceNotesTemplate = true;
              } else if (obj1.name === "Invoice #") {
                showHideObj.invoiceIdTemplate = true;
              } else if (obj1.name === "Invoice Date") {
                showHideObj.invoiceDateTemplate = true;
              }
            });
            this.setState({
              showHide: showHideObj,
            });
          }
        });

        this.setState({
          templateArr: arr,
        });
      } else {
        this.setState({
          showHide: {
            dueDateTemplate: true,
            invoicePeriodTemplate: true,
            billingAddressTemplate: true,
            phoneNumberTemplate: true,
            emailTemplate: true,
            invoiceNotesTemplate: true,
            invoiceIdTemplate: true,
            invoiceDateTemplate: true,
          },
        });
      }
    }

    let statusObj = {};

    let resData = await ApiCall("fetchInvoiceByJobId", {
      jobId: jobID,
      invoiceId: invoiceId,
    });
    if (
      resData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(resData.data.payload);
      let previewData = decodeData.data.invoiceData[0];
      let payableData = decodeData.data.payableItems;

      // consoleLog("decodeData.data::",decodeData.data)
      if (
        previewData != null ||
        previewData != undefined ||
        previewData != [] ||
        previewData != {} ||
        previewData != ""
      ) {
        invoiceStatusArr.map((obj) => {
          if (obj.value === previewData.status) {
            statusObj = {
              label: obj.label,
              value: obj.value,
            };
          }
        });

        this.setState({
          preview_invoiceStatusData: statusObj,
          preview_invoiceId: previewData.invoiceId,
          preview_dueDate: SetScheduleDate(previewData.dueDate),
          preview_phoneNumber:
            "+" + previewData.countryCode + " " + previewData.mobile,
          preview_clientName: previewData.clientName,
          preview_invoicePeriodFromDate: SetUSAdateFormat(previewData.fromDate),
          preview_invoicePeriodToDate: SetUSAdateFormat(previewData.toDate),
          preview_billingAddress: previewData.billAddress,
          preview_invoiceNote: previewData.invoiceNote,
          preview_invoiceEmail: previewData.email,
          preview_invoiceDate: SetScheduleDate(previewData.invoiceDate),
          preview_payableItems: payableData,
        });
      }
    }
    // }
  };

  openTemplateModal = () => {
    this.state.availableColumnsList1.map((obj) => {
      obj.isSelected = false;
    });

    this.setState({
      availableColumnsList: this.state.availableColumnsList1,
      selectedColumnList: [],
    });

    this.openCreateTemplateModal();
    this.handleMenuClose();
  };

  openSelectTemplateModal = () => {
    this.openChooseTemplateModal();
    this.handleMenuClose();
  };

  // ...........for filter modal..................

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
  formDueDateChange = (date) => {
    this.setState({
      formDueDate: SetUSAdateFormat(date),
    });
  };

  toDueDateChange = (date) => {
    this.setState({
      toDueDate: SetUSAdateFormat(date),
    });
  };

  // ........for invoice tab.............

  formDateChange_invoice = (e) => {
    this.setState({
      formDate_invoice: e.target.value,
    });
  };

  toDateChange_invoice = (e) => {
    this.setState({
      toDate_invoice: e.target.value,
    });
  };

  // ......for preview invoice modal................

  preview_invoiceFormDateChange = (date) => {
    this.setState({
      preview_invoicePeriodFromDate: SetUSAdateFormat(date),
    });
  };

  preview_invoiceToDateChange = (date) => {
    this.setState({
      preview_invoicePeriodToDate: SetUSAdateFormat(date),
    });
  };

  // .......for filter modal.................

  onFilterApply = () => {
    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      search: this.state.input,
      jobId: this.state.id,
      invoiceId: this.state.invoiceId,
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchduefrom:this.state.formDueDate == "" ? "" :SetDatabaseDateFormat(this.state.formDueDate),
      searchdueto:this.state.toDueDate == "" ? "" : SetDatabaseDateFormat(this.state.toDueDate),
      leiId:this.state.selectedLei.value == null || this.state.selectedLei.value == undefined ? "" : this.state.selectedLei.value,
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      clientId:this.state.clientData
    };

    // let mainData = Object.assign(reqData, resData);

    this.getListDetails(resData);

    // this.setState({
    //   formDate: "",
    //   toDate: "",
    // });
    this.closeFilterModal();
  };

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: "",
      current_page: 1,
      formDueDate:"",
      toDueDate:"",
      selectedLei:{},
      selectedStatus:{}
    });

    this.load();

    this.closeFilterModal();
  };

  onIdChange = (val) => {
    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      search: this.state.input,
      jobId: val,
      invoiceId: this.state.invoiceId,
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchduefrom:this.state.formDueDate == "" ? "" :SetDatabaseDateFormat(this.state.formDueDate),
      searchdueto:this.state.toDueDate == "" ? "" : SetDatabaseDateFormat(this.state.toDueDate),
      leiId:this.state.selectedLei.value == null || this.state.selectedLei.value == undefined ? "" : this.state.selectedLei.value,
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      clientId:this.state.clientData
    };

    // let MainData = Object.assign(reqData, resData);

    this.getListDetails(resData);
    this.setState({
      id: val,
    });
  };
  onInvoiceIdChange = (val) => {
    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      search: this.state.input,
      jobId: this.state.id,
      invoiceId: val,
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchduefrom:this.state.formDueDate == "" ? "" :SetDatabaseDateFormat(this.state.formDueDate),
      searchdueto:this.state.toDueDate == "" ? "" : SetDatabaseDateFormat(this.state.toDueDate),
      leiId:this.state.selectedLei.value == null || this.state.selectedLei.value == undefined ? "" : this.state.selectedLei.value,
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      clientId:this.state.clientData
    };

    // let MainData = Object.assign(reqData, resData);

    this.getListDetails(resData);
    this.setState({
      invoiceId: val,
    });
  };

  inputChange = (e) => {
    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      jobId: this.state.id,
      search: e.target.value,
      invoiceId:this.state.invoiceId,
      searchto: this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom: this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      searchduefrom:this.state.formDueDate == "" ? "" :SetDatabaseDateFormat(this.state.formDueDate),
      searchdueto:this.state.toDueDate == "" ? "" : SetDatabaseDateFormat(this.state.toDueDate),
      leiId:this.state.selectedLei.value == null || this.state.selectedLei.value == undefined ? "" : this.state.selectedLei.value,
      status:this.state.selectedStatus.value == null || this.state.selectedStatus.value == undefined ? "" : this.state.selectedStatus.value,
      clientId:this.state.clientData
    };

    // let mainData = Object.assign(reqData, resData);

    this.getListDetails(resData);

    this.setState({
      input: e.target.value,
    });
  };

  onTick = async (item, id) => {
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

  goEdit = () => {
    this.props.history.push({
      pathname: "/adminTranslationDetails",
      state: this.state.listData[this.state.curIndex].requestId,
    });
  };

  // ..................for invoice modal.........................

  onInvoiceStatusChange = (value) => {
    // let obj = { label: value.label, value: value.value };
    this.setState({
      invoiceStatusData: value,
    });
  };

  preview_onInvoiceStatusChange = (value) => {
    // let obj = { label: value.label, value: value.value };
    this.setState({
      preview_invoiceStatusData: value,
    });
  };
  onInvoiceBillingChange = (e) => {
    this.setState({
      billingAddress: e.target.value,
    });
  };
  onInvoiceNotesChange = (e) => {
    this.setState({
      invoiceNote: e.target.value,
    });
  };
  onInvoicePhoneChange = (value) => {
    if (numberValidator(value) === true) {
      if (mobileNumberValidator(value) === true) {
        let phoneCheck = phoneNumberCheck(value);
        if (phoneCheck) {
          this.setState({
            phoneNumber: phoneCheck,
          });
        }
      }
    }
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
  menuBtnhandleClick_b = (event) => {
    this.setState({
      anchorEl1: event.currentTarget,
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
    });
  };

  // ..................admin info function.....................
  onAdminNameChange = (e) => {
    this.setState({
      adminName: e.target.value,
    });
  };

  onStreetChange = (e) => {
    this.setState({
      adminStreet: e.target.value,
    });
  };
  onCityChange = (e) => {
    this.setState({
      adminCity: e.target.value,
    });
  };
  onStateChange = (val) => {
    this.setState({
      stateData: val,
    });
  };
  onZipChange = (e) => {
    this.setState({
      adminZipCode: e.target.value,
    });
  };
  onPhoneChange = (value) => {
    if (numberValidator(value) === true) {
      if (mobileNumberValidator(value) === true) {
        let phoneCheck = phoneNumberCheck(value);
        if (phoneCheck) {
          this.setState({
            adminPhone: phoneCheck,
          });
        }
      }
    }
  };
  onFaxChange = (e) => {
    this.setState({
      adminFax: e.target.value,
    });
  };
  onWebsiteChange = (e) => {
    this.setState({
      adminWebsite: e.target.value,
    });
  };

  //..............function for MenuButton close..............
  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
      anchorEl1: null,
    });
  };

  onVoidClick = () => {
    this.handleMenuClose();
  };

  onEmailClick = () => {
    this.handleMenuClose();
  };
  onPaidClick = () => {
    this.handleMenuClose();
  };

  subTypeChange = (id) => (e) => {
    let arr = this.state.availableColumnsList;
    if (e.target.checked) {
      arr[id].isSelected = true;
    } else {
      arr[id].isSelected = false;
    }

    this.setState({
      availableColumnsList: arr,
    });
  };

  selectedSubTypeChange = (id) => (e) => {
    let arr = this.state.selectedColumnList;
    if (e.target.checked) {
      arr[id].isSelected = true;
    } else {
      arr[id].isSelected = false;
    }

    this.setState({
      selectedColumnList: arr,
    });
  };

  // ................status func...................
  onStatusChange = async () => {
    let flag = false;
    if (this.state.primaryCheck === true) {
      flag = false;
    } else {
      flag = true;
    }

    this.setState({
      primaryCheck: flag,
    });
  };

  // showDetails = (val, index) => {

  //   if (val.serviceTypeId === 45) {
  //     this.props.history.push({
  //       pathname: "/adminJobDetails",
  //       state: this.state.listData[index].requestId,
  //     });
  //   } else if (val.serviceTypeId === 46) {
  //     this.props.history.push({
  //       pathname: "/adminTranslationDetails",
  //       state: this.state.listData[index].requestId,
  //     });
  //   } else if (val.serviceTypeId === 47) {
  //     this.props.history.push({
  //       pathname: "/adminTrainingDetails",
  //       state: this.state.listData[index].requestId,
  //     });
  //   }
  // };

  receivableTypeChange = (val, id) => (e) => {
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
  };

  receivableInvoiceTypeChange = (val, id) => (e) => {
    let selectedArr = this.state.selectedListData;
    let brr = [];

    let arr = this.state.invoiceData;

    if (e.target.checked) {
      arr[id].isSelected = true;
    } else {
      arr[id].isSelected = false;
    }

    this.setState({
      invoiceData: arr,
      isChecked: arr[id].isSelected,
      selectedListData: selectedArr,
    });
  };

  // ...............for payable item Array...........

  payableIdChange = (index) => (e) => {
    this.state.payableItems[index].id = e.target.value;
    this.setState({
      payableItems: this.state.payableItems,
    });
  };

  payableTypeChange = (index) => (e) => {
    this.state.payableItems[index].serviceType = e.target.value;
    this.setState({
      payableItems: this.state.payableItems,
    });
  };

  payableDescriptionChange = (index) => (e) => {
    this.state.payableItems[index].description = e.target.value;
    this.setState({
      payableItems: this.state.payableItems,
    });
  };
  payableQuantityChange = (index) => (e) => {
    if (decimalValue(e.target.value)) {
      this.state.payableItems[index].unit = e.target.value;
      let t = e.target.value * this.state.payableItems[index].unitPrice;
      this.state.payableItems[index].totalPrice = t;
      this.setState({
        payableItems: this.state.payableItems,
      });
    }
  };
  payableUnitPriceChange = (index) => (e) => {
    if (decimalValue(e.target.value)) {
      this.state.payableItems[index].unitPrice = e.target.value;
      let t = e.target.value * this.state.payableItems[index].unit;
      this.state.payableItems[index].totalPrice = t;
      this.setState({
        payableItems: this.state.payableItems,
      });
    }
  };
  payableTotalPriceChange = (index) => (e) => {
    this.state.payableItems[index].totalPrice = e.target.value;
    this.setState({
      payableItems: this.state.payableItems,
    });
  };

  onDownloadClick = async (data) => {
    // consoleLog("downloaddata",data)
    let obj = {
      invoiceId: data.invoiceId,
    };

    let res = await ApiCall("getInvoicePathById", obj);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      let invoicePath = decodeData.data.invoicePath[0];
      // consoleLog("response:::::::::::::::::",invoicePath.invoicePath)
      if (
        invoicePath.invoicePath == null ||
        invoicePath.invoicePath == undefined
      ) {
        invoicePath.invoicePath = "";
      } else {
        window.open(INVOICE_PATH_ONLY + invoicePath.invoicePath);
      }
    } else {
      toast.error("error occured");
    }
  };

  onFilterStatusChange = (dat) => {
    this.setState({
      selectedStatus:dat
    })
  }

  onLeiChange = (dat) =>{
    this.setState({
      selectedLei:dat
    })
  }

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    const open1 = Boolean(this.state.anchorEl1);

    return (
      <React.Fragment>
        <ToastContainer hideProgressBar theme="colored" />
        <div class="component-wrapper vewaljobs invoc_pge">
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            <Link to="/clientDashboard">Dashboard</Link> / <Link to="/adminClientList">Clients</Link> / Invoices
          </div>
          <div class="listing-component-app">
            <div class="vendor-info _fl sdw">
              <div class="vn-form _fl">
                <div class="row">
                  <div class="col-md-4"></div>
                  <div className="col-md-3"></div>
                  <div class="col-md-4">
                    <div class="vn_frm rt">
                      <input
                        type="text"
                        value={this.state.input}
                        name=""
                        placeholder="Search"
                        class="inputfield"
                        onChange={this.inputChange}
                        style={{ width: "140%" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="vn-form _fl" style={{ marginTop: "50px" }}>
                  <div class="row">
                    <div class="col-md-4">
                      <div className="vn_frm">
                        <span
                          style={{
                            width: "25%%",

                            fontSize: "14px",
                          }}
                        >
                          Invoice ID
                        </span>
                        <InputText
                          placeholder="Search"
                          className="inputfield"
                          value={this.state.invoiceId}
                          onTextChange={(value) => {
                            this.onInvoiceIdChange(value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-3"></div>
                    <div class="col-md-5">
                      <div class="vn_frm">
                        <span
                          style={{
                            width: "30%",

                            fontSize: "14px",
                          }}
                        >
                          Job/Project Id
                        </span>
                        <InputText
                          placeholder="Search"
                          className="inputfield"
                          value={this.state.id}
                          onTextChange={(value) => {
                            this.onIdChange(value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="table-filter-app-b">
              <div class="filter-btn">
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
                {/* <div class="table-filter-box"> */}

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

            <div class="tab-app-information activeLnk" id="tble-data-a">
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
                          <strong>Invoice ID</strong>
                        </th>
                        <th style={{ width: "8%" }}>
                          <strong>Job/Project ID</strong>
                        </th>
                        <th style={{ width: "10%" }}>Service Type</th>
                        <th style={{ width: "10%" }}>LEI</th>
                        <th style={{ width: "10%" }}>Total Amount $</th>
                        <th style={{ width: "12%" }}>Invoice Generated On</th>
                        <th style={{ width: "12%" }}>Due Date</th>
                        <th style={{ width: "10%" }}>Status</th>
                        <th style={{ width: "11%" }}>Action</th>
                      </tr>
                    </tbody>
                    <tbody>
                      {this.state.invoiceData.length > 0 ? (
                        <React.Fragment>
                          {this.state.invoiceData.map((data, i) => (
                            <React.Fragment>
                              <tr>
                                <td
                                  style={{ width: "8%" }}
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title={data.invoiceId}
                                >
                                  {data.invoiceId.length > 15
                                    ? textTruncate(data.invoiceId, 15)
                                    : data.invoiceId}
                                </td>
                                <td
                                  style={{ width: "8%" }}
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title={data.jobId}
                                >
                                  {data.jobId.length > 15
                                    ? textTruncate(data.jobId, 15)
                                    : data.jobId}
                                </td>
                                <td style={{ width: "10%" }}>
                                  {data.serviceType}
                                </td>
                                <td style={{ width: "10%" }}>{data.leiName}</td>
                                <td
                                  style={{ width: "10%" }}
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title={data.amount}
                                >
                                  <p style={{ color: "#65A57C" }}>
                                    {data.amount}
                                  </p>
                                </td>
                                <td style={{ width: "10%" }}>
                                  {SetDateFormat(data.fromDate)}
                                </td>
                                {/* <td style={{ width: "10%" }}>
                                  {" "}
                                  {data.vendotType}
                                </td> */}
                                <td style={{ width: "12%" }}>
                                  {SetDateFormat(data.dueDate)}
                                </td>
                                <td style={{ width: "10%" }}>
                                  {data.status === 2 ? (
                                    <React.Fragment>
                                      <span className="progress-btn green">
                                        Paid
                                      </span>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment>
                                      <span
                                        href="#"
                                        className="progress-btn yellow"
                                      >
                                        Unpaid
                                      </span>
                                    </React.Fragment>
                                  )}

                                  {/* <a href="#" class="progress-btn sky">Verified</a> */}
                                </td>
                                <td style={{ width: "11%" }}>
                                  <div>
                                    {/* <a href="javascript:void(0)">
                                      <img
                                        src={ImageName.IMAGE_NAME.EYE_BTN}
                                        onClick={() =>
                                          this.openPrevInvoiceModal(data)
                                        }
                                        style={{ marginRight: "5px" }}
                                      />
                                    </a> */}
                                    <a href="javascript:void(0)">
                                      <img
                                        src={
                                          ImageName.IMAGE_NAME
                                            .DOWNLOAD_SHEET_ICON
                                        }
                                        onClick={() =>
                                          this.onDownloadClick(data)
                                        }
                                      />
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <tr style={{ textAlign: "center" }}>
                            <td colSpan="9">
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
        </div>

        {/* .................filter.modal................................. */}
        <div id="filter-model" class="modal fade modelwindow" role="dialog">
          <div class="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div class="modal-content">
              <div class="filter-head _fl mdf">
                <h3>Filter by</h3>
                <div class="reset-btn-dp">
                  <button class="reset" data-dismiss="modal">
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
                    <div class="lable-text">Invoice Generated On</div>
                    <div className="row">
                      <div className="col-md-4">
                        <div class="form-field-app">
                          <span></span>

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
                              <span style={{ color: "#B0B3B2" }}>
                                FROM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {this.state.formDate}
                              </span>
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
                      </div>
                      <div className="col-md-4">
                        <div class="form-field-app">
                          <span></span>

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
                              <span style={{ color: "#B0B3B2" }}>
                                TO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {this.state.toDate}
                              </span>
                            </div>
                            <div style={{ width: "20%" }}>
                              <a style={{ float: "right" }}>
                                <DatePicker
                                  dropdownMode="select"
                                  showMonthDropdown
                                  showYearDropdown
                                  adjustDateOnChange
                                  // minDate={new Date()}
                                  onChange={(date) => this.toDateChange(date)}
                                  customInput={<Schedule />}
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                     {/* .....................dueDate,,,,,,,,,,,,,,, */}
                     <div class="lable-text">Due Date</div>
                    <div className="row">
                        <div className="col-md-4">
                        <div class="form-field-app">
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
                          <span>FROM {this.state.formDueDate}</span>
                        </div>
                        <div style={{ width: "20%" }}>
                          <a style={{ float: "right" }}>
                            <DatePicker
                              dropdownMode="select"
                              showMonthDropdown
                              showYearDropdown
                              adjustDateOnChange
                              // minDate={new Date()}
                              onChange={(date) => this.formDueDateChange(date)}
                              customInput={<Schedule />}
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                        </div>
                        <div className="col-md-4">
                        <div class="form-field-app">
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
                          <span>To {this.state.toDueDate}</span>
                        </div>
                        <div style={{ width: "20%" }}>
                          <a style={{ float: "right" }}>
                            <DatePicker
                              dropdownMode="select"
                              showMonthDropdown
                              showYearDropdown
                              adjustDateOnChange
                              // minDate={new Date(this.state.formDate)}
                              onChange={(date) => this.toDueDateChange(date)}
                              customInput={<Schedule />}
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                        </div>
                    </div>
                    <div className="row" style={{marginTop:"40px"}}>
                        <div className="col-md-4">
                        <div className="sf-row">
                          <div
                            className="lable-text"
                            style={{ paddingLeft: "10px", fontSize: "13px" }}
                          >
                           LEI
                          </div>
                          <div
                            className="dropdwn"
                            style={{ marginLeft: "25%" }}
                          >
                            <SelectBox
                              optionData={this.state.leiArr}
                              value={this.state.selectedLei}
                              // placeholder="Select"
                              onSelectChange={(value) => {
                                this.onLeiChange(value);
                              }}
                            />
                          </div>
                        </div>
                        </div>
                        <div className="col-md-4">
                        <div className="sf-row">
                          <div
                            className="lable-text"
                            style={{ paddingRight: "10px", fontSize: "13px" }}
                          >
                            STATUS
                          </div>
                          <div
                            className="dropdwn"
                            style={{ marginLeft: "40%" }}
                          >
                            <SelectBox
                              optionData={statusArr}
                              value={this.state.selectedStatus}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onFilterStatusChange(value);
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

        {/* ......................preview.invoice modal................ */}

        <div
          id="previewInvoice-model"
          class="modal fade modelwindow"
          role="dialog"
        >
          <div class="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div class="modal-content" style={{ width: "110%" }}>
              <div class="filter-head _fl mdf">
                <div className="row">
                  <div className="col-md-3">
                    <h3 style={{ background: "none", fontSize: "14px" }}>
                      Preview Invoice
                    </h3>
                  </div>
                  <div className="col-md-3"></div>
                  <div className="col-md-6">
                    <div class="reset-btn-dp">
                      <button
                        class="reset"
                        data-dismiss="modal"
                        style={{
                          width: "110px",
                          textDecoration: "none",
                          fontSize: "12px",
                        }}
                        onClick={this.closePreviewInvoiceModal}
                      >
                        Cancel
                      </button>
                      {/* <button
                        class="apply"
                        data-dismiss="modal"
                        style={{ width: "110px" }}
                      >
                        <a
                          href="javascript:void(0)"
                          class="progress-btn sky"
                          style={{ textDecoration: "none", fontSize: "12px" }}
                          onClick={this.onCreateInvoice}
                        >
                          Save
                        </a>
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-body">
                <div class="model-info f-model">
                  <div className="row">
                    {this.state.showHide.invoiceIdTemplate === true ? (
                      <React.Fragment>
                        <div className="col-md-3">
                          <div className="form_rbx">
                            {" "}
                            <span className="invoiceLabel">Invoice ID</span>
                            <input
                              placeholder=""
                              className="inputfield"
                              value={this.state.preview_invoiceId}
                              disabled
                              style={{ width: "120%" }}
                            />
                          </div>
                        </div>
                        <div className="col-md-1"></div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment />
                    )}

                    {this.state.showHide.invoiceDateTemplate === true ? (
                      <React.Fragment>
                        <div className="col-md-3">
                          <div className="form_rbx">
                            {" "}
                            <span className="invoiceLabel">Invoice Date</span>
                            <input
                              placeholder=""
                              className="inputfield"
                              value={this.state.preview_invoiceDate}
                              disabled
                              style={{ width: "120%" }}
                            />
                          </div>
                        </div>
                        <div className="col-md-1"></div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment />
                    )}

                    {this.state.showHide.dueDateTemplate === true ? (
                      <React.Fragment>
                        <div className="col-md-3">
                          <div className="form_rbx">
                            {" "}
                            <span className="invoiceLabel">Due Date</span>
                            <input
                              placeholder=""
                              className="inputfield"
                              value={this.state.preview_dueDate}
                              disabled
                              style={{ width: "120%" }}
                            />
                          </div>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment />
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-3">
                      <div className="form_rbx">
                        {" "}
                        <span className="invoiceLabel">Invoice Status</span>
                        <div className="dropdwn" style={{ width: "120%" }}>
                          <Select
                            styles={customStyles}
                            name="select"
                            placeholder="Select"
                            components={{
                              DropdownIndicator,
                              IndicatorSeparator: () => null,
                            }}
                            value={this.state.preview_invoiceStatusData}
                            options={invoiceStatusArr}
                            onChange={(value) =>
                              this.preview_onInvoiceStatusChange(value)
                            }
                            isDisabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-1"></div>
                    {this.state.showHide.invoicePeriodTemplate ? (
                      <React.Fragment>
                        <div className="col-md-8">
                          <div className="form-search-app">
                            <div
                              className="invoiceLabel"
                              style={{
                                fontWeight: "500",
                                fontSize: "14px",
                                marginBottom: "5px",
                              }}
                            >
                              Invoice Period
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-field-app">
                                  <span></span>
                                  <div
                                    className="input-group"
                                    style={{
                                      width: "100%",
                                      borderRadius: "9px",
                                      height: "43px",
                                      border: "1px solid #ced4da",
                                      boxShadow:
                                        "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                    }}
                                  >
                                    <div
                                      style={{ width: "80%", padding: "8px" }}
                                    >
                                      <span>
                                        {
                                          this.state
                                            .preview_invoicePeriodFromDate
                                        }
                                      </span>
                                    </div>
                                    <div style={{ width: "20%" }}>
                                      <a style={{ float: "right" }}>
                                        <DatePicker
                                          disabled
                                          onChange={(date) =>
                                            this.preview_invoiceFormDateChange(
                                              date
                                            )
                                          }
                                          customInput={<Schedule />}
                                        />
                                      </a>
                                    </div>
                                  </div>
                                  {/* <input
                                    type="date"
                                    className="datefield bd"
                                    placeholder="10/25/2021"
                                    value={this.state.invoicePeriodFromDate}
                                    onChange={this.invoiceFormDateChange}
                                    style={{ width: "115%" }}
                                  /> */}
                                </div>
                              </div>
                              {/* <div className="col-md-2"></div> */}
                              <div className="col-md-6">
                                <div className="form-field-app">
                                  <span></span>
                                  <div
                                    className="input-group"
                                    style={{
                                      width: "100%",
                                      borderRadius: "9px",
                                      height: "43px",
                                      border: "1px solid #ced4da",
                                      boxShadow:
                                        "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                    }}
                                  >
                                    <div
                                      style={{ width: "80%", padding: "8px" }}
                                    >
                                      <span>
                                        {this.state.preview_invoicePeriodToDate}
                                      </span>
                                    </div>
                                    <div style={{ width: "20%" }}>
                                      <a style={{ float: "right" }}>
                                        <DatePicker
                                          disabled
                                          onChange={(date) =>
                                            this.preview_invoiceToDateChange(
                                              date
                                            )
                                          }
                                          customInput={<Schedule />}
                                        />
                                      </a>
                                    </div>
                                  </div>
                                  {/* <input
                                    type="date"
                                    className="datefield bd"
                                    placeholder="10/25/2021"
                                    value={this.state.invoicePeriodToDate}
                                    onChange={this.invoiceToDateChange}
                                    style={{ width: "115%" }}
                                  /> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment />
                    )}
                  </div>
                  <h6 style={{ marginTop: "15px" }}>Client Info</h6>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form_rbx">
                        {" "}
                        <span className="invoiceLabel">Client</span>
                        <input
                          placeholder=""
                          className="inputfield"
                          value={this.state.preview_clientName}
                          disabled
                          style={{ width: "120%" }}
                        />
                      </div>
                    </div>
                  </div>
                  {this.state.showHide.billingAddressTemplate ? (
                    <React.Fragment>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="form_rbx">
                            {" "}
                            <span className="invoiceLabel">
                              Billing Address
                            </span>
                            <textarea
                              placeholder="......."
                              className="in-textarea min"
                              value={this.state.preview_billingAddress}
                              onChange={(value) => {
                                this.onInvoiceBillingChange(value);
                              }}
                              style={{
                                borderRadius: "10px",
                                resize: "none",
                                width: "120%",
                              }}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment />
                  )}
                  <div className="row">
                    {this.state.showHide.phoneNumberTemplate ? (
                      <React.Fragment>
                        <div className="col-md-3">
                          <div className="form_rbx">
                            {" "}
                            <span className="invoiceLabel">Phone Number</span>
                            <div className="dropdwn" style={{ width: "185%" }}>
                              <InputText
                                placeholder=""
                                className="inputfield"
                                value={this.state.preview_phoneNumber}
                                onTextChange={(value) => {
                                  this.onInvoicePhoneChange(value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-1"></div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment />
                    )}
                    {this.state.showHide.emailTemplate ? (
                      <React.Fragment>
                        <div className="col-md-3">
                          <div className="form_rbx">
                            {" "}
                            <span className="invoiceLabel">Email</span>
                            <div className="dropdwn" style={{ width: "185%" }}>
                              <InputText
                                placeholder=""
                                className="inputfield"
                                value={this.state.preview_invoiceEmail}
                                onTextChange={(value) => {
                                  this.onInvoiceEmailChange(value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment />
                    )}
                  </div>
                  {this.state.showHide.invoiceNotesTemplate ? (
                    <React.Fragment>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="form_rbx">
                            {" "}
                            <span className="invoiceLabel">Invoice Note</span>
                            <textarea
                              placeholder="......."
                              className="in-textarea min"
                              value={this.state.preview_invoiceNote}
                              onChange={(value) => {
                                this.onInvoiceNotesChange(value);
                              }}
                              disabled
                              style={{
                                borderRadius: "10px",
                                resize: "none",
                                width: "120%",
                              }}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment />
                  )}

                  <h6 style={{ marginTop: "15px" }}>Payable Items</h6>
                  <div className="table-listing-app">
                    <div className="table-responsive">
                      <table
                        width="100%"
                        border="0"
                        cellPadding="0"
                        cellSpacing="0"
                      >
                        {/* {this.state.payableItems.length > 0 ? (
                              <React.Fragment> */}
                        <tr>
                          <th style={{ width: "10%" }}>ID</th>
                          <th style={{ width: "10%" }}>Type</th>
                          <th style={{ width: "20%" }}>Description</th>
                          <th style={{ width: "10%" }}>Quantity</th>
                          <th style={{ width: "10%" }}>Unit Cost $</th>
                          <th style={{ width: "10%" }}>Price($)</th>
                          <th style={{ width: "5%" }}></th>
                        </tr>
                        {/* </React.Fragment>
                            ) : (
                              <React.Fragment />
                            )} */}

                        {this.state.preview_payableItems.map((item, key) => (
                          <tr key={key}>
                            <td colSpan="7">
                              <div className="">
                                <table
                                  width="100%"
                                  border="0"
                                  cellPadding="0"
                                  cellSpacing="0"
                                >
                                  <tr>
                                    <td style={{ width: "10%" }}>
                                      {/* {item.isEditable == 1 ? (
                                        <React.Fragment> */}
                                      <div style={{ fontSize: "12px" }}>
                                        <input
                                          type="text"
                                          className="inputfield"
                                          value={item.id}
                                          onChange={this.payableIdChange(key)}
                                          disabled
                                        />
                                      </div>
                                      {/* </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <div style={{ fontSize: "12px" }}>
                                            {" "}
                                            {item.id}
                                          </div>
                                        </React.Fragment>
                                      )} */}
                                    </td>
                                    <td style={{ width: "10%" }}>
                                      {/* {item.isEditable == 1 ? (
                                        <React.Fragment> */}
                                      <div style={{ fontSize: "12px" }}>
                                        <input
                                          type="text"
                                          className="inputfield"
                                          value={item.serviceType}
                                          onChange={this.payableTypeChange(key)}
                                        />
                                      </div>
                                      {/* </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <div style={{ fontSize: "12px" }}>
                                            {item.type}
                                          </div>
                                        </React.Fragment>
                                      )} */}
                                    </td>
                                    <td style={{ width: "20%" }}>
                                      {/* {item.isEditable == 1 ? (
                                        <React.Fragment> */}
                                      <div style={{ fontSize: "12px" }}>
                                        <textarea
                                          rows="2"
                                          placeholder=""
                                          className="in-textarea msg min"
                                          value={item.description}
                                          style={{
                                            height: "100px",
                                            color: "var(--grey)",
                                            borderRadius: "10px",
                                            boxShadow: "2px",
                                            resize: "none",
                                          }}
                                          disabled
                                          onChange={this.payableDescriptionChange(
                                            key
                                          )}
                                        ></textarea>
                                        {/* <input
                                          type="text"
                                          className="inputfield"
                                          value={item.description}
                                          onChange={this.payableDescriptionChange(
                                            key
                                          )}
                                        /> */}
                                      </div>
                                      {/* </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <div style={{ fontSize: "12px" }}>
                                            {item.description}
                                          </div>
                                        </React.Fragment>
                                      )} */}
                                    </td>
                                    <td style={{ width: "10%" }}>
                                      {/* {item.isEditable == 1 ? (
                                        <React.Fragment> */}
                                      <div style={{ fontSize: "12px" }}>
                                        <input
                                          type="text"
                                          className="inputfield"
                                          value={item.unit}
                                          onChange={this.payableQuantityChange(
                                            key
                                          )}
                                        />
                                      </div>
                                      {/* </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <div style={{ fontSize: "12px" }}>
                                            {item.quantity}
                                          </div>
                                        </React.Fragment>
                                      )} */}
                                    </td>
                                    <td style={{ width: "10%" }}>
                                      {/* {item.isEditable == 1 ? (
                                        <React.Fragment> */}
                                      <div style={{ fontSize: "12px" }}>
                                        <input
                                          type="text"
                                          className="inputfield"
                                          value={item.unitPrice}
                                          onChange={this.payableUnitPriceChange(
                                            key
                                          )}
                                        />
                                      </div>
                                      {/* </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <div style={{ fontSize: "12px" }}>
                                            {item.unitPrice}
                                          </div>
                                        </React.Fragment>
                                      )} */}
                                    </td>
                                    <td style={{ width: "10%" }}>
                                      {/* {item.isEditable == 1 ? (
                                        <React.Fragment> */}
                                      <div style={{ fontSize: "12px" }}>
                                        <input
                                          type="text"
                                          className="inputfield"
                                          value={item.totalPrice}
                                          onChange={this.payableTotalPriceChange(
                                            key
                                          )}
                                          disabled
                                        />
                                      </div>
                                      {/* </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <div style={{ fontSize: "12px" }}>
                                            {item.totalPrice}
                                          </div>
                                        </React.Fragment>
                                      )} */}
                                    </td>
                                    <td style={{ width: "5%" }}>
                                      {/* <div className="col-md-1 delete-btn">
                                        <img
                                          src={ImageName.IMAGE_NAME.TRASH_BTN}
                                          onClick={() =>
                                            this.onDeleteParticulars(key)
                                          }
                                          style={{
                                            cursor: "pointer",
                                            maxWidth: "500%",
                                          }}
                                        />
                                      </div> */}
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
                  {/* <div className="addPayableItem">
                    <a
                      href="javascript:void(0)"
                      class="progress-btn previewInvoiceBtn"
                      onClick={this.addParticularField}
                    >
                      Add Item
                    </a>
                  </div> */}
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
