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
  SetDateFormat,
  SetDOBFormat,
  SetDueDate,
  SetScheduleDate,
  SetTimeFormat,
  SetUSAdateFormat,
  textTruncate,
} from "../../../../services/common-function";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { ApiCall } from "../../../../services/middleware";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../../SharedComponents/inputText";
// import "./invoicesaccountreceivable.css";
import $, { data } from "jquery";
import { Link } from "react-router-dom";
import Select, { components } from "react-select";
import {  MenuItem } from "@mui/material";
import Menu from "@mui/material/Menu";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import { styled, Box } from "@mui/system"; //imported for modal
import axios from "axios";
import {
  IMAGE_PATH_ONLY,
  IMAGE_URL,
  INVOICE_PATH_ONLY,
} from "../../../../services/config/api_url";
import Switch from "@mui/material/Switch";
import {
  emailValidator,
  inputEmptyValidate,
  mobileNumberValidator,
  numberValidator,
} from "../../../../validators";


import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { getInvoiceIdFromArray } from "./function";

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



const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 10,
    marginTop: 5,
    minWidth: 100,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 2%) 0px 0px 0px 1px, rgba(0, 0, 0, 0%) 0px 10px 15px -3px, rgba(0, 0, 0, 0%) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
  },
}));

// ......................for button Dropdown.....................
const StyledMenuBtn = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 10,
    marginTop: 5,
    minWidth: 100,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 2%) 0px 0px 0px 1px, rgba(0, 0, 0, 0%) 0px 10px 15px -3px, rgba(0, 0, 0, 0%) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
  },
}));

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

const reqData = {
  limit: "",
  offset: "",
  jobId: "",
  search: "",
  searchto: "",
  searchfrom: "",
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



export default class InvoicesPayable extends React.Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    this.state = {
      clientId: "",
      curIndexList: 0,
      selectedListData: [],
      selectedInvoiceData: [],
      isDuplicateData: false,
      isChecked: false,
      isVerifiedJobs: true,
      isInvoices: false,
      current_page: 1,
      total_page: 10,
      limit: 20,
      offset: 0,
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      // ......for invoice tab......
      current_page_invoice: 1,
      total_page_invoice: 10,
      limit_invoice: 20,
      offset_invoice: 0,
      selectedDisplayData_invoice: {
        label: "20",
        value: "20",
      },
      formDate_invoice: "",
      toDate_invoice: "",

      listData: [],
      invoiceData: [],
      curIndex: 0,
      formDate: "",
      toDate: "",
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
      payableItems: [

      ],
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
      preview_payableItems: [

      ],

      // .........adminInfo..............

      adminName: "",
      adminStreet: "",
      adminCity: "",
      stateArr: [],
      stateData: {},
      adminZipCode: "",
      adminPhone: "",
      adminFax: "",
      adminWebsite: "",

      // ..............create template...........
      templateName: "",

      availableColumnsList: [],
      availableColumnsList1: [
        {
          isSelected: false,
          name: "Due Date",
        },
        {
          isSelected: false,
          name: "Invoice Period",
        },
        {
          isSelected: false,
          name: "Billing Address",
        },
        {
          isSelected: false,
          name: "Phone Number",
        },
        {
          isSelected: false,
          name: "Email",
        },
        {
          isSelected: false,
          name: "Invoice Notes",
        },
        {
          isSelected: false,
          name: "Payable Item[s]",
        },
        {
          isSelected: false,
          name: "Invoice #",
        },
        {
          isSelected: false,
          name: "Invoice Date",
        },
      ],
      selectedColumnList: [],

      searchColumnData: "",

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
      countryCode: 1,
      adminCountryCode: 1,

      tempId:0,
      vendorId:"",
      invoiceArrId:[]
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();

    let d = SetDueDate(new Date());
    //  consoleLog("after one month::",SetDOBFormat(d._d))
    this.setState({
      dueDate: SetDOBFormat(d._d)
    })

    document.getElementById("backdrop").style.display = "none";
    var classInstance = this;

    var filterModal = document.getElementById("filter-model");
    var filterModal_invoice = document.getElementById("filter-model-invoice");
    var invoiceModal = document.getElementById("invoice-model");
    var adminInfoModal = document.getElementById("adminInfo-model");
    var createTemplateModal = document.getElementById("createTemplate-model");
    var chooseTemplateModal = document.getElementById("chooseTemplate-model");
    var previewInvoiceModal = document.getElementById("previewInvoice-model");

    window.onclick = function (event) {
      if (event.target === filterModal) {
        classInstance.closeFilterModal();
      } else if (event.target === filterModal_invoice) {
        classInstance.closeFilterModal_invoice();
      } else if (event.target === invoiceModal) {
        classInstance.closeInvoiceModal();
      } else if (event.target === adminInfoModal) {
        classInstance.closeAdminInfoModal();
      } else if (event.target === createTemplateModal) {
        classInstance.closeCreateTemplateModal();
      } else if (event.target === chooseTemplateModal) {
        classInstance.closeChooseTemplateModal();
      } else if (event.target === previewInvoiceModal) {
        classInstance.closePreviewInvoiceModal();
      }
    };

    window.$(".verificaiton-doc-tab ul li").on("click", function () {
      $(".verificaiton-doc-tab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
    });
  }

  load = async () => {
    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      search: "",
      jobId: "",
      searchto: "",
      searchfrom: "",
    };

    let MainData = Object.assign(reqData, resData);

    this.getListDetails(MainData);



    // ...............vendor list.........................

    let vendorArrMainData = [];

    let vendorRes = await ApiCall("fetchAllVendorList", {});

    if (
      vendorRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      vendorRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(vendorRes.data.payload);

      consoleLog("*****", payload.data);
      let vendorArrData = payload.data.vendorList;
      vendorArrData.map((obj) => {
        vendorArrMainData.push({
          label: obj.name,
          value: obj.userId,
        });
      });
      this.setState({
        vendorArr: vendorArrMainData,
      });
    }
    this.setState({
      phoneNumber: "+" + this.state.countryCode + " ",
    });
  };

  getListDetails = async (data) => {
    // .............................................
    let modifyData = { isSelected: false };

    let res = await ApiCall("fetchInvoiceAllJobsPayable", data);
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
      consoleLog("Bill Payload:", payload);
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
  getinvoiceDetails = async (data) => {
    let modifyData = { isSelected: false };
    let res = await ApiCall("fetchAllInvoicePayable", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload),
        allBillInvoice = payload.data.details;

      consoleLog("invoices:::", payload);
      allBillInvoice.map((obj) => {
        Object.assign(obj, modifyData);
      });

      let totalPage = Math.ceil(payload.data.count / this.state.limit_invoice);
      if (
        allBillInvoice == null ||
        allBillInvoice == [] ||
        allBillInvoice == undefined
      ) {
        this.setState({
          invoiceData: [],
        });
      } else {
        this.setState({
          invoiceData: allBillInvoice,

          total_page_invoice: totalPage,
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
      search: this.state.input,
      searchto: this.state.toDate,
      searchfrom: this.state.formDate,
    };
    let mainData = Object.assign(reqData, resData);

    this.getListDetails(mainData);
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
      search: this.state.input,
      searchto: this.state.toDate,
      searchfrom: this.state.formDate,
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
      searchto: this.state.toDate,
      searchfrom: this.state.formDate,
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
      searchto: this.state.toDate,
      searchfrom: this.state.formDate,
    };
    let mainData = Object.assign(reqData, resData);

    this.getListDetails(mainData);
  };
  onChangeLimit = async (dat) => {
    this.setState({
      limit: parseInt(dat.value),
      selectedDisplayData: dat,
    });

    let resData = {
      limit: dat.value,
      offset: JSON.stringify(
        (this.state.current_page - 1) * parseInt(dat.value)
      ),
      jobId: this.state.id,
      search: this.state.input,
      searchto: this.state.toDate,
      searchfrom: this.state.formDate,
    };
    let mainData = Object.assign(reqData, resData);

    this.getListDetails(mainData);
  };

  // .............pagination function for invoices..........
  clickChange_invoice = (e) => {
    this.setState({
      current_page_invoice: e.target.value,
    });
  };
  exLeft_invoice = () => {
    this.setState({
      current_page_invoice: 1,
    });

    let resData = {
      limit: this.state.limit_invoice,
      offset: this.state.offset_invoice.toString(),
      jobId: this.state.id,
      search: this.state.input,
      searchto: this.state.toDate,
      searchfrom: this.state.formDate,
    };
    let mainData = Object.assign(reqData, resData);

    this.getinvoiceDetails(mainData);
  };
  exRigth_invoice = () => {
     let totalPage = this.state.total_page_invoice;
   
    this.setState({
      current_page_invoice: totalPage,
    });
    let resData = {
      limit: JSON.stringify(this.state.limit_invoice),
      offset: JSON.stringify((totalPage - 1) * this.state.limit_invoice),
      jobId: this.state.id,
      search: this.state.input,
      searchto: this.state.toDate,
      searchfrom: this.state.formDate,
    };
    let mainData = Object.assign(reqData, resData);

    // consoleLog("exright::",mainData)

    this.getinvoiceDetails(mainData);
  };
  prev_invoice = () => {
    let currentPage = this.state.current_page_invoice;
    if (currentPage > 1) {
      currentPage--;
      this.setState({
        current_page_invoice: currentPage,
      });
    }
    let resData = {
      limit: JSON.stringify(this.state.limit_invoice),
      offset: JSON.stringify((currentPage - 1) * this.state.limit_invoice),
      jobId: this.state.id,
      search: this.state.input,
      searchto: this.state.toDate,
      searchfrom: this.state.formDate,
    };
    let mainData = Object.assign(reqData, resData);

    this.getinvoiceDetails(mainData);
  };
  next_invoice = () => {
    let currentPage = this.state.current_page_invoice;
    let totalPage = this.state.total_page_invoice;

    if (currentPage < totalPage) {
      currentPage++;
      this.setState({
        current_page_invoice: currentPage,
      });
    }
    let resData = {
      limit: JSON.stringify(this.state.limit_invoice),
      offset: JSON.stringify((currentPage - 1) * this.state.limit_invoice),
      jobId: this.state.id,
      search: this.state.input,
      searchto: this.state.toDate,
      searchfrom: this.state.formDate,
    };
    let mainData = Object.assign(reqData, resData);

    this.getinvoiceDetails(mainData);
  };
  onChangeLimit_invoice = async (dat) => {
    this.setState({
      limit: parseInt(dat.value),
      selectedDisplayData_invoice: dat,
    });

    let fetchData = {
      limit: dat.value,
      offset: JSON.stringify(
        (this.state.current_page - 1) * parseInt(dat.value)
      ),
      jobId: this.state.id,
      search: this.state.input,
      searchto: this.state.toDate,
      searchfrom: this.state.formDate,
    };
    let returnData = Object.assign(reqData, fetchData);

    this.getinvoiceDetails(returnData);
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
  openFilterModal_invoice = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("filter-model-invoice").style.display = "block";
    document.getElementById("filter-model-invoice").classList.add("show");
  };

  closeFilterModal_invoice = () => {
    document.getElementById("filter-model-invoice").style.display = "none";
    document.getElementById("filter-model-invoice").classList.remove("show");
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
  openChooseTemplateModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("chooseTemplate-model").style.display = "block";
    document.getElementById("chooseTemplate-model").classList.add("show");
  };
  closeChooseTemplateModal = () => {
    document.getElementById("chooseTemplate-model").style.display = "none";
    document.getElementById("chooseTemplate-model").classList.remove("show");
    document.getElementById("backdrop").style.display = "none";
    this.setState({
      selectedTemplateData: {},
    });
  };

  // .............fetch payable items function..........................


  fetchPayableItems = async(value) => {
    let resPayable = await ApiCall("fetchPayableItemOnCreateInvoice", {
      id: value,
    });

   
    if (
      resPayable.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resPayable.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeDataPayable = Decoder.decode(resPayable.data.payload);

      consoleLog("dataresss:: payableItems", decodeDataPayable);
      this.setState({
        payableItems: decodeDataPayable.data.payableItems,
      });
    }
  }

  // .............fectch template list..function.................

  fetchTemplateList = async(value) => {
   let arr = [];
    let resInvoice = await ApiCall("fetchTemplateListByUserId", {
      userId: value,
    });

    if (
      resInvoice.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resInvoice.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeDataInvoice = Decoder.decode(resInvoice.data.payload);

      consoleLog("responce invoice", decodeDataInvoice);
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
              // payableItemsTemplate: false,
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
            consoleLog("content::", showHideObj);
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
            // payableItemsTemplate: true,
            invoiceIdTemplate: true,
            invoiceDateTemplate: true,
          },
        });
      }
    }
  }

  
  

  // ................fetch invoice data on preview .................
  fetchInvoiceDataOnPreview = async(value) => {
     let statusObj = {};
     consoleLog("value::",value)
    let resData = await ApiCall("fetchInvoiceByJobId", value)
    consoleLog("preview data", resData);
    if (
      resData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(resData.data.payload);
      let previewData = decodeData.data.invoiceData[0];
        let payableData = decodeData.data.payableItems;
      consoleLog("preview data", decodeData);
      if (
        previewData != null ||
        previewData != undefined ||
        previewData != [] ||
        previewData != {} ||
        previewData != ""  ||
         payableData != null ||
        payableData != undefined ||
        payableData != [] ||
        payableData != {} ||
        payableData != "" 
      ) {
        if(previewData.status != null || previewData.status != undefined || previewData.status != "" || previewData.status != {} || previewData.status != []){
          invoiceStatusArr.map((obj) => {
            if (obj.value === previewData.status) {
              statusObj = {
                label: obj.label,
                value: obj.value
              }
            }
          })

          this.setState({
            preview_invoiceStatusData: statusObj,
            preview_invoiceId: previewData.invoiceId,
            preview_dueDate: SetScheduleDate(previewData.dueDate),
            preview_phoneNumber: "+" + previewData.countryCode + " " + previewData.mobile,
            preview_clientName: previewData.clientName,
            preview_invoicePeriodFromDate: SetUSAdateFormat(previewData.fromDate),
            preview_invoicePeriodToDate: SetUSAdateFormat(previewData.toDate),
            preview_billingAddress: previewData.billAddress,
            preview_invoiceNote: previewData.invoiceNote,
            preview_invoiceEmail: previewData.email,
            preview_invoiceDate: SetScheduleDate(previewData.invoiceDate),
            preview_payableItems:payableData
          })
        } else {
          toast.error("status undefined")
        }
  
      }
    }
  }

  // ................

  openPrevInvoiceModal = async () => {
    let brr = [],
      arr = [],
      arrId=[],
      clientID = "",
      jobID = "",
      invoiceId = "",
      mainInvoiceId = "",
      clientName = "";
    for (let i = 0; i < this.state.invoiceData.length; i++) {
      if (this.state.invoiceData[i].isSelected === true) {
        brr.push(this.state.invoiceData[i]);
        this.setState({
          selectedInvoiceData: brr,
        });
      }
    }

    brr.map((obj) => {
      clientID = obj.clientId;
      jobID = obj.jobId;
      clientName = obj.clientName;
      invoiceId = obj.id;
      mainInvoiceId = obj.invoiceId;
      arrId.push(obj.id);
    });

    this.setState({
      invoiceId: invoiceId,
      clientName: clientName,
      clientId: clientID,
      jobId: jobID,
      mainInvoiceId: mainInvoiceId
    });
consoleLog("brr::",brr)
    if (brr.length > 1) {
      toast.error("Please select only one row");
    } else {

      // ..........for fetching payableItems on creating invoice time........

      // this.fetchPayableItemsOnCreateInvoice();
      // ....................fetch payable items on create invoice ......................

      // let resData = await ApiCall("fetchInvoiceByJobId", {
      //   jobId: jobID,
      //   invoiceId: invoiceId,
      // });
  
      // if (
      //   resData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      //   resData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      // ) {
      //   let decodeData = Decoder.decode(resData.data.payload);
      //   consoleLog("decodeData::for preview invoice:",decodeData)
      // }

    // let obj = {
    //   id:arrId
    // }
    // let resPay = await ApiCall("fetchPayableItemOnCreateInvoice",obj);

    //   if (
    //     resPay.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //     resPay.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    //   ) {
    //     let decodeData = Decoder.decode(resPay.data.payload);

    //     consoleLog("payable preview::", decodeData)
    //     if (decodeData.data.payableItems != [] || decodeData.data.payableItems != null || decodeData.data.payableItems != undefined || decodeData.data.payableItems != {} || decodeData.data.payableItems != "") {
    //       this.setState({
    //         preview_payableItems: decodeData.data.payableItems
    //       })
    //     }

    //   }

      // .......for fetching payable List.......

      this.fetchPayableItems(arrId);


      // ..........for fetching template list...........

     this.fetchTemplateList(clientID);

     
      // ..............for preview invoice data..........
      consoleLog("invoiceId",this.state.mainInvoiceId)
     
      let reqData = {jobId: jobID, invoiceId: mainInvoiceId}

      this.fetchInvoiceDataOnPreview(reqData);

    }
  };

  // .............filter modal function...................
  openCreateInvoiceModal = async () => {
    let userInfo = {},
      arrId = [],
      arr = [],
      invoiceId = "",
      billingInfo = {},
      clientID = "",
      vendorId = [],
      jobID = [],
      clientName = "";

    let isDuplicate = null;
    let brr = [];
    for (let i = 0; i < this.state.listData.length; i++) {
      if (this.state.listData[i].isSelected === true) {
        brr.push(this.state.listData[i]);
        this.setState({
          selectedListData: brr,
        });
      }
    }
    consoleLog("brr",brr)

    brr.map((obj) => {
      arrId.push(obj.id);
      clientID = obj.clientId;
      vendorId = obj.vendorId;
      jobID.push(obj.jobId);
      clientName = obj.clientName;
      invoiceId = obj.id;
    });

    consoleLog("id::", jobID);
    consoleLog("vendorId::", vendorId);
    this.setState({
      jobId: jobID,
      clientName: clientName,
      clientId: clientID,
      invoiceId: arrId,
      vendorId:vendorId
    });

    if(brr.length < 1){
      toast.error("Please select one row")
    } else {
      let resPayable = await ApiCall("fetchPayableItemOnCreateInvoice", {
        id: arrId,
      });
  
      if (
        resPayable.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        resPayable.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let decodeDataPayable = Decoder.decode(resPayable.data.payload);
  
        consoleLog("dataresss::", decodeDataPayable);
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
  
        consoleLog("responce invoice", decodeDataInvoice);
        if (
          decodeDataInvoice.data != null ||
          decodeDataInvoice.data != undefined ||
          decodeDataInvoice.data != [] ||
          decodeDataInvoice.data != {} ||
          decodeDataInvoice.data != ""
        ) {
          decodeDataInvoice.data.map((obj) => {
            arr.push({
              label: obj.templateName,
              value: obj.id,
            });
  
            if (obj.isPrimary == 1) {
              this.setState({
                tempId:obj.id
              })
              let content = [];
              content = JSON.parse(obj.content);
  
              let showHideObj = {
                dueDateTemplate: false,
                invoicePeriodTemplate: false,
                billingAddressTemplate: false,
                phoneNumberTemplate: false,
                emailTemplate: false,
                invoiceNotesTemplate: false,
                // payableItemsTemplate: false,
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
              // consoleLog("content::", showHideObj);
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
              // payableItemsTemplate: true,
              invoiceIdTemplate: true,
              invoiceDateTemplate: true,
            },
          });
        }
      }
  
      for (let x = 0; x < brr.length; x++) {
        for (let y = 0; y < brr.length; y++) {
          if (x != y) {
            if (brr[x].vendorName == brr[y].vendorName) {
              isDuplicate = true;
            } else {
              isDuplicate = false;
            }
          }
        }
      }
  
      const isDuplicateData = new Set(brr.map((v) => v.clientName));
  
      if (brr.length != 0) {
        if (brr.length > 1) {
          if (isDuplicate === true) {
  
            let obj = {
              id: arrId
            }
            consoleLog("id:::::", obj)
  
            let resPayable = await ApiCall("fetchPayableItemOnCreateInvoice", obj);
  
            if (
              resPayable.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
              resPayable.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
            ) {
              let decodeData = Decoder.decode(resPayable.data.payload);
  
              consoleLog("payable:: fetch items", decodeData)
              this.setState({
                payableItems: decodeData.data.payableItems
              })
            }
  
            this.openInvoiceModal();
            let res = await ApiCall("fetchclientinfoByID", {
              clientid: clientID,
            });
  
            if (
              res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
              res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
            ) {
              let decodeData = Decoder.decode(res.data.payload);
  
              userInfo = decodeData.data[0].userInfo[0];
              billingInfo = decodeData.data[2].billaddress[0];
              // consoleLog("clientInfo::", userInfo);
  
              this.setState({
                phoneNumber:
                  "+" + userInfo.adminCountryCode + " " + userInfo.adminPhone,
                invoiceEmail: userInfo.email,
                billingAddress: billingInfo.address,
              });
            }
          } else {
            toast.error("Please select same user information");
          }
        } else {
          if (brr.length === 1) {
  
            let obj = {
              id: arrId
            }
            consoleLog("id:::::", obj)
  
            let resPayable = await ApiCall("fetchPayableItemOnCreateInvoice", obj);
  
            if (
              resPayable.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
              resPayable.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
            ) {
              let decodeData = Decoder.decode(resPayable.data.payload);
  
              consoleLog("payable::", decodeData)
              this.setState({
                payableItems: decodeData.data.payableItems
              })
            }
  
            this.openInvoiceModal();
            let res = await ApiCall("fetchclientinfoByID", {
              clientid: clientID,
            });
  
            if (
              res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
              res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
            ) {
              let decodeData = Decoder.decode(res.data.payload);
  
              userInfo = decodeData.data[0].userInfo[0];
              billingInfo = decodeData.data[2].billaddress[0];
              // consoleLog("clientInfo::", userInfo);
              this.setState({
                phoneNumber:
                  "+" + userInfo.adminCountryCode + " " + userInfo.adminPhone,
                invoiceEmail: userInfo.email,
                billingAddress: billingInfo.address,
              });
            }
          }
        }
      } else {
        toast.error("Please select atleast one row");
      }
    }

   
  };

  openInfoModal = async () => {
    let stateObj = {};
    var stateResArr = [];
    this.openAdminInfoModal();
    this.handleMenuClose();

    let resState = await ApiCall("getstatelistofselectedcountry", {
      countryid: 13,
    });

    if (
      resState.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resState.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(resState.data.payload);
      // console.log("payload:::", payload);
      let stateData = payload.data.statelist;
      // console.log("stateData:::::", stateData);
      for (let i = 0; i < stateData.length; i++) {
        stateResArr.push({
          label: stateData[i].name,
          value: stateData[i].id,
        });
      }
    }

    let res = await ApiCall("getAdminAddress", { userId: this.state.clientId });
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      consoleLog("value", decodeData);

      if (
        decodeData.data.getAdminAddressDetails != [] ||
        decodeData.data.getAdminAddressDetails != "" ||
        decodeData.data.getAdminAddressDetails != {} ||
        decodeData.data.getAdminAddressDetails != null ||
        decodeData.data.getAdminAddressDetails != undefined
      ) {
        stateResArr.map((obj) => {
          if (obj.value == decodeData.data.getAdminAddressDetails[0].state) {
            stateObj = {
              label: obj.label,
              value: obj.value,
            };
          }
        });
      } else {
        toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
      }

      // consoleLog("respon::", decodeData.data.getAdminAddressDetails[0]);
      this.setState({
        adminName: decodeData.data.getAdminAddressDetails[0].adminName,
        adminStreet: decodeData.data.getAdminAddressDetails[0].street,
        adminCity: decodeData.data.getAdminAddressDetails[0].city,
        adminZipCode: decodeData.data.getAdminAddressDetails[0].zipCode,
        adminPhone:
          "+" +
          this.state.adminCountryCode +
          " " +
          decodeData.data.getAdminAddressDetails[0].phone,
        adminFax: decodeData.data.getAdminAddressDetails[0].fax,
        adminWebsite: decodeData.data.getAdminAddressDetails[0].website,
        stateArr: stateResArr,
        stateData: stateObj,
        imagePath:
          IMAGE_PATH_ONLY + decodeData.data.getAdminAddressDetails[0].logo,
        adminPhoto: decodeData.data.getAdminAddressDetails[0].logo,
      });
    }
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
    // this.chooseTemplateApi();
    this.handleMenuClose();
  };

  // ...........for filter modal..................

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

  // ......for invoice template modal................

  invoiceFormDateChange = (date) => {
    this.setState({
      invoicePeriodFromDate: SetUSAdateFormat(date),
    });
  };

  invoiceToDateChange = (date) => {
    this.setState({
      invoicePeriodToDate: SetUSAdateFormat(date),
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
      searchto: this.state.toDate,
      searchfrom: this.state.formDate,
    };

    let mainData = Object.assign(reqData, resData);

    this.getListDetails(mainData);

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
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
    });

    this.load();

    this.closeFilterModal();
  };

  // ...........for filter modal invoice tab......................
  onFilterApply_invoice = () => {
    let resData = {
      limit: this.state.limit_invoice,
      offset: this.state.offset_invoice.toString(),
      search: this.state.input,
      jobId: this.state.id,
      searchto: this.state.toDate_invoice,
      searchfrom: this.state.formDate_invoice,
    };

    let mainData = Object.assign(reqData, resData);

    this.getinvoiceDetails(mainData);

    this.setState({
      formDate_invoice: "",
      toDate_invoice: "",
    });
    this.closeFilterModal_invoice();
  };

  onResetFilter_invoice = () => {
    this.setState({
      formDate_invoice: "",
      toDate_invoice: "",
      current_page_invoice: 1,
      selectedDisplayData_invoice: {
        label: "20",
        value: "20",
      },
    });

    this.load();

    this.closeFilterModal_invoice();
  };

  onIdChange = (val) => {
    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      search: this.state.input,
      jobId: val,
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
    };

    let mainData = Object.assign(reqData, resData);

    this.getListDetails(mainData);

    this.setState({
      input: e.target.value,
    });
  };

  onBulkChange = (val) => {
    this.setState({
      bulkData: val,
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

  onAdminInfoCancel = (e) => {
    this.closeAdminInfoModal();
    this.setState({
      adminStreet: "",
      adminCity: "",
      stateData: {},
      adminZipCode: "",
      adminPhone: "+" + this.state.adminCountryCode + " " + "",
      adminFax: "",
      adminWebsite: "",
    });
  };

  onSubmitAdminInfo = async () => {
    let mobileNo = this.state.adminPhone.substring(3, 15);
    let errorCount = 0;
    let validateStreet = inputEmptyValidate(this.state.adminStreet),
      validateCity = inputEmptyValidate(this.state.adminCity),
      validateState = inputEmptyValidate(this.state.stateData.value),
      validateZip = inputEmptyValidate(this.state.adminZipCode),
      validatePhone = inputEmptyValidate(mobileNo),
      validatePhoto = inputEmptyValidate(this.state.adminPhoto);

    // consoleLog("submit::");
    if (validatePhoto === false) {
      toast.error(AlertMessage.MESSAGE.COMPANYINFO.EMPTY_LOGO);
      errorCount++;
    } else if (validateStreet === false) {
      toast.error(AlertMessage.MESSAGE.COMPANYINFO.EMPTY_STREET);
      errorCount++;
    } else if (validateCity === false) {
      toast.error(AlertMessage.MESSAGE.COMPANYINFO.EMPTY_CITY);
      errorCount++;
    } else if (validateState === false) {
      toast.error(AlertMessage.MESSAGE.COMPANYINFO.EMPTY_STATE);
      errorCount++;
    } else if (validateZip === false) {
      toast.error(AlertMessage.MESSAGE.COMPANYINFO.EMPTY_ZIP);
      errorCount++;
    } else if (validatePhone === false) {
      toast.error(AlertMessage.MESSAGE.COMPANYINFO.EMPTY_PHONE);
      errorCount++;
    }

    if (errorCount === 0) {
      let data = {
        userId: this.state.clientId,
        adminName: this.state.adminName,
        streetName: this.state.adminStreet,
        city: this.state.adminCity,
        state: this.state.stateData.value,
        zipCode: this.state.adminZipCode,
        phone: mobileNo,
        fax: this.state.adminFax,
        website: this.state.adminWebsite,
        logo: this.state.adminPhoto,
      };

      // consoleLog("dataa:::", data);

      let res = await ApiCall("insertAdminAddress", data);

      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success("Saved Successfully");
        this.onAdminInfoCancel();
      }
    }
  };

  // ................create templete modal function...............

  onTemplateNameChange = (val) => {
    this.setState({
      templateName: val,
    });
  };

  onCreateTemplateCancel = () => {
    this.closeCreateTemplateModal();
  };

  onCreateTemplate = async () => {
    let data = {
      userId: this.state.clientId,
      templateName: this.state.templateName,
      isdefault: this.state.primaryCheck ? "1" : "0",
      content: this.state.selectedColumnList,
    };

    let res = await ApiCall("insertInvoiceTemplate", data);
    // consoleLog("rsponse", res);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.TEMPLATE.ADD_SUCCESS);
      this.closeCreateTemplateModal();
    }

    let arr = [];

    let resInvoice = await ApiCall("fetchTemplateListByUserId", {
      userId: this.state.clientId,
    });

    if (
      resInvoice.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resInvoice.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeDataInvoice = Decoder.decode(resInvoice.data.payload);

      consoleLog("responce invoice", decodeDataInvoice);
      if (decodeDataInvoice) {
        decodeDataInvoice.data.map((obj) => {
          arr.push({
            label: obj.templateName,
            value: obj.id,
          });
        });

        this.setState({
          templateArr: arr,
        });
      }
    }
  };

  //..............function for MenuButton close..............
  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
      anchorEl1: null,
    });
  };
  onVoidClick = async() => {
    if(this.state.invoiceArrId.length < 1){
      toast.error("Please select atleast one row !!")
    } else {
      let obj = {
        invoiceId:this.state.invoiceArrId
      }
      consoleLog("arr id::",obj)
  
      let res = await ApiCall("bulkActionToVoid",obj);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        window.scrollTo(0,0);
        toast.success("Invoice Status Change Successfully !!");
        let resInvoiceData = {
          limit: this.state.limit_invoice,
          offset: this.state.offset_invoice.toString(),
          search: "",
          jobId: "",
          searchto: "",
          searchfrom: "",
        };
  
        let MainInvoiceData = Object.assign(reqData, resInvoiceData);
  
        this.getinvoiceDetails(MainInvoiceData);
        this.handleMenuClose();
      } else {
        toast.error("Error Occured !!")
      }
    }

  }
  onDownloadClick = () => {
    this.handleMenuClose();
  }
  onEmailClick = () => {
    this.handleMenuClose();
  }
  onPaidClick = async() => {
    if(this.state.invoiceArrId.length < 1){
      toast.error("Please select atleast one row !!")
    } else {
      let obj = {
        invoiceId:this.state.invoiceArrId
      }
  
      let res = await ApiCall("bulkActionToPaid",obj);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        window.scrollTo(0,0);
        toast.success("Invoice Status Change Successfully !!");
        let resInvoiceData = {
          limit: this.state.limit_invoice,
          offset: this.state.offset_invoice.toString(),
          search: "",
          jobId: "",
          searchto: "",
          searchfrom: "",
        };
  
        let MainInvoiceData = Object.assign(reqData, resInvoiceData);
  
        this.getinvoiceDetails(MainInvoiceData);
        this.handleMenuClose();
      } else {
        toast.error("Error Occured !!")
      }
    }
    
  }
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

  onAddColumnData = () => {
    let arr = this.state.selectedColumnList,
      brr = [];

    this.state.availableColumnsList.map((data) => {
      if (data.isSelected) {
        arr.push({
          isSelected: false,
          name: data.name,
        });
      } else {
        brr.push({
          isSelected: false,
          name: data.name,
        });
      }
    });

    this.setState({
      selectedColumnList: arr,
      availableColumnsList: brr,
    });
  };

  onDeleteColumnData = () => {
    let arr = this.state.availableColumnsList,
      brr = [];

    this.state.selectedColumnList.map((data) => {
      if (data.isSelected) {
        arr.push({
          isSelected: false,
          name: data.name,
        });
      } else {
        brr.push({
          isSelected: false,
          name: data.name,
        });
      }
    });

    this.setState({
      selectedColumnList: brr,
      availableColumnsList: arr,
    });
  };

  //.............choose template..........
  onTemplateChange = (val) => {
    this.setState({
      selectedTemplateData: val,
    });
  };

  closeSelectTemplateModal = () => {
    this.closeChooseTemplateModal();
  };

  // chooseTemplateApi = async () => {
  //   let arr = [];
  //   let res = await ApiCall("fetchInvoiceTemplateList");

  //   if (
  //     res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
  //     res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  //   ) {
  //     let decodeData = Decoder.decode(res.data.payload);

  //     consoleLog("Template decodeData::", decodeData.data);
  //     decodeData.data.map((obj) => {
  //       arr.push({
  //         label: obj.templateName,
  //         value: obj.id,
  //       });
  //     });
  //     this.setState({
  //       templateArr: arr,
  //       templateId: this.state.selectedTemplateData.value,
  //     });
  //   }
  // };

  fetchTemplateApi = async () => {
    let res = await ApiCall("getInvoiceTemplateById", {
      id: this.state.selectedTemplateData.value,
    });

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      // consoleLog("decodeData:::", decodeData);
      let templateData = JSON.parse(decodeData.data[0].content);
      consoleLog("templateData:::", templateData);

      if (templateData.length > 0) {
        let showHideObj = {
          dueDateTemplate: false,
          invoicePeriodTemplate: false,
          billingAddressTemplate: false,
          phoneNumberTemplate: false,
          emailTemplate: false,
          invoiceNotesTemplate: false,
          payableItemsTemplate: false,
          invoiceIdTemplate: false,
          invoiceDateTemplate: false,
        };
        templateData.map((obj) => {
          if (obj.name === "Due Date") {
            showHideObj.dueDateTemplate = true;
          } else if (obj.name === "Invoice Period") {
            showHideObj.invoicePeriodTemplate = true;
          } else if (obj.name === "Billing Address") {
            showHideObj.billingAddressTemplate = true;
          } else if (obj.name === "Phone Number") {
            showHideObj.phoneNumberTemplate = true;
          } else if (obj.name === "Email") {
            showHideObj.emailTemplate = true;
          } else if (obj.name === "Invoice Notes") {
            showHideObj.invoiceNotesTemplate = true;
          } else if (obj.name === "Payable Item[s]") {
            showHideObj.payableItemsTemplate = true;
          } else if (obj.name === "Invoice #") {
            showHideObj.invoiceIdTemplate = true;
          } else if (obj.name === "Invoice Date") {
            showHideObj.invoiceDateTemplate = true;
          }
        });
        this.setState({
          showHide: showHideObj,
        });
      }
    }
  };

  onSelectTemplate = () => {
    this.setState({
      tempId:this.state.selectedTemplateData.value
    })
    this.fetchTemplateApi();
    this.closeSelectTemplateModal();
  };

  onSearchData = (val) => {
    let displayData = [];

    let display = this.state.availableColumnsList1.filter((item) =>
      item.name.toUpperCase().includes(val.toUpperCase())
    );
    for (let i = 0; i < display.length; i++) {
      let flag = 0;
      for (let j = 0; j < this.state.selectedColumnList.length; j++) {
        if (this.state.selectedColumnList[j].name === display[i].name) {
          flag = 1;
          break;
        }
      }
      if (flag === 0) {
        displayData.push(display[i]);
      }
    }
    this.setState({
      searchColumnData: val,
      availableColumnsList: displayData,
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

    // let arrData = this.state.listData;
    // let stat = 0;

    // let data = {
    //   staffid: arrData[index].userId,
    //   status: stat.toString(),
    //   staffusertypetd: arrData[index].userTypeId,
    // };

    // let status = await ApiCall("adminstaffstatuschange", data);
    // if (
    //   status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {
    //   if (arrData[index].status === 0) {
    //     // stat = 1;
    //     arrData[index].status = 1;
    //   } else {
    //     // stat = 0;
    //     arrData[index].status = 0;
    //   }
    //   this.setState({
    //     listData: arrData,
    //   });
    //   toast.success(AlertMessage.MESSAGE.UPDATE_STATUS.SUCCESS);
    // } else {
    //   toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);

    //   if (arrData[index].status === 0) {
    //     arrData[index].status = 0;
    //   } else {
    //     arrData[index].status = 1;
    //   }
    //   this.setState({
    //     listData: this.state.listData,
    //   });
    // }
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
  onTabClick = (value) => {
    if (value === "verifiedJobs") {
      this.setState({
        isVerifiedJobs: true,
        isInvoices: false,
      });
    } else if (value === "invoices") {
      //................invoice......................

      let resInvoiceData = {
        limit: this.state.limit_invoice,
        offset: this.state.offset_invoice.toString(),
        search: "",
        jobId: "",
        searchto: "",
        searchfrom: "",
      };

      let MainInvoiceData = Object.assign(reqData, resInvoiceData);

      this.getinvoiceDetails(MainInvoiceData);
      this.setState({
        isVerifiedJobs: false,
        isInvoices: true,
      });
    }
  };
  addParticularField = () => {
    let payableData = this.state.payableItems;
    let data = {
      id: "",
      serviceType: "",
      description: "",
      unit: "",
      unitPrice: "",
      totalPrice: "",
      isEditable: 1,
    };
    payableData.push(data);

    this.state.payableItems = payableData;

    this.setState({
      // completionData: this.state.completionData,
      payableItems: this.state.payableItems,
      isEditable: true,
    });
  };
  onDeleteParticulars = (index) => {
    this.state.payableItems.splice(index, 1);
    this.setState({
      // completionData: this.state.completionData,
      payableItems: this.state.payableItems,
    });
  };
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
    // let brr = [];

    let arr = this.state.invoiceData;

    

    // if (e.target.checked) {
    //   arr[id].isSelected = true;
    // } else {
    //   arr[id].isSelected = false;
    // }

    arr[id].isSelected = !arr[id].isSelected; 
    // consoleLog("arr Id",getInvoiceIdFromArray(val,this.state.invoiceArrId))

    this.setState({
      invoiceData: arr,
      isChecked: arr[id].isSelected,
      selectedListData: selectedArr,
      invoiceArrId:getInvoiceIdFromArray(val,this.state.invoiceArrId)
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
      let t = e.target.value * this.state.payableItems[index].unitPrice
      this.state.payableItems[index].totalPrice = t
      this.setState({
        payableItems: this.state.payableItems,
      });
    }
  };
  payableUnitPriceChange = (index) => (e) => {
    if (decimalValue(e.target.value)) {
      this.state.payableItems[index].unitPrice = e.target.value;
      let t = e.target.value * this.state.payableItems[index].unit
      this.state.payableItems[index].totalPrice = t
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

  // setStateByCountry = async (data) => {

  // }

  onCreateInvoice = async () => {
    let mobileNo = this.state.phoneNumber.substring(3, 15);

    let errorCount = 0;
    let validateInvoiceStatus = inputEmptyValidate(
      this.state.invoiceStatusData.value
    ),
      validateInvoicePeriodFromDate = inputEmptyValidate(
        this.state.invoicePeriodFromDate
      ),
      validateInvoicePeridToDate = inputEmptyValidate(
        this.state.invoicePeriodToDate
      ),
      validateInvoiceBillingAddress = inputEmptyValidate(
        this.state.billingAddress
      ),
      validateInvoicePhone = inputEmptyValidate(mobileNo),
      validateInvoiceEmail = emailValidator(this.state.invoiceEmail),
      validateNote = inputEmptyValidate(this.state.invoiceNote);

    if (validateInvoiceStatus === false) {
      toast.error(AlertMessage.MESSAGE.INVOICE.EMPTY_STATUS);
      errorCount++;
    } else if (
      validateInvoicePeriodFromDate === false &&
      this.state.showHide.invoicePeriodTemplate
    ) {
      toast.error(AlertMessage.MESSAGE.INVOICE.EMPTY_FROM_DATE_PERIOD);
      errorCount++;
    } else if (
      validateInvoicePeridToDate === false &&
      this.state.showHide.invoicePeriodTemplate
    ) {
      toast.error(AlertMessage.MESSAGE.INVOICE.EMPTY_TO_DATE_PERIOD);
      errorCount++;
    }else if(this.state.invoicePeriodToDate < this.state.invoicePeriodFromDate){
      toast.error("From Date cannot be greater than To Date");
      errorCount++;
    } else if (
      validateInvoiceBillingAddress === false &&
      this.state.showHide.billingAddressTemplate
    ) {
      toast.error(AlertMessage.MESSAGE.INVOICE.EMPTY_ADDRESS);
      errorCount++;
    } else if (
      validateInvoicePhone === false &&
      this.state.showHide.phoneNumberTemplate
    ) {
      toast.error(AlertMessage.MESSAGE.INVOICE.EMPTY_PHONE);
      errorCount++;
    } else if (
      validateInvoiceEmail === false &&
      this.state.showHide.emailTemplate
    ) {
      toast.error(AlertMessage.MESSAGE.INVOICE.EMPTY_EMAIL);
      errorCount++;
    }

    // this.state.payableItems.map((obj) => {
    //   let validateId = inputEmptyValidate(obj.id),
    //     validateType = inputEmptyValidate(obj.serviceType),
    //     validateDesc = inputEmptyValidate(obj.description),
    //     validateQuantity = inputEmptyValidate(obj.unit),
    //     validateUnitCost = inputEmptyValidate(obj.unitPrice),
    //     validateTotalPrice = inputEmptyValidate(obj.totalPrice);

    //   if (validateId === false) {
    //     toast.error(AlertMessage.MESSAGE.INVOICE.PAYABLE_ITEM.EMPTY_ID);
    //     errorCount++;
    //   } else if (validateType === false) {
    //     toast.error(AlertMessage.MESSAGE.INVOICE.PAYABLE_ITEM.EMPTY_TYPE);
    //     errorCount++;
    //   } else if (validateDesc === false) {
    //     toast.error(
    //       AlertMessage.MESSAGE.INVOICE.PAYABLE_ITEM.EMPTY_DESCRIPTION
    //     );
    //     errorCount++;
    //   } else if (validateQuantity === false) {
    //     toast.error(AlertMessage.MESSAGE.INVOICE.PAYABLE_ITEM.EMPTY_QUANTITY);
    //     errorCount++;
    //   } else if (validateUnitCost === false) {
    //     toast.error(AlertMessage.MESSAGE.INVOICE.PAYABLE_ITEM.EMPTY_UNIT_COST);
    //     errorCount++;
    //   } else if (validateTotalPrice === false) {
    //     toast.error(AlertMessage.MESSAGE.INVOICE.PAYABLE_ITEM.EMPTY_PRICE);
    //     errorCount++;
    //   }
    // });

    if (errorCount === 0) {
      let totalPayableAmount = 0;
      for (let i = 0; i < this.state.payableItems.length; i++) {
        totalPayableAmount = totalPayableAmount + Number(this.state.payableItems[i].totalPrice)
      }
      let data = {
        templateId:this.state.tempId,
        totalPayableAmount: totalPayableAmount,
        type: "1",
        Id: this.state.invoiceId,
        jobId: this.state.jobId,
        invoiceDate: this.state.invoiceDate,
        dueDate: this.state.dueDate,
        status: this.state.invoiceStatusData.value.toString(),
        fromInvoiceDate: this.state.showHide.invoicePeriodTemplate
          ? SetDOBFormat(this.state.invoicePeriodFromDate)
          : "",
        toInvoiceDate: this.state.showHide.invoicePeriodTemplate
          ? SetDOBFormat(this.state.invoicePeriodToDate)
          : "",
        clientName: this.state.clientName,
        // clientId: this.state.clientId,
        invoiceUserId:this.state.vendorId,
        countryCode: this.state.countryCode,
        billingAddress: this.state.showHide.billingAddressTemplate
          ? this.state.billingAddress
          : "",
        invoicePhone: this.state.showHide.phoneNumberTemplate ? mobileNo : "",
        email: this.state.showHide.emailTemplate ? this.state.invoiceEmail : "",
        invoiceNote: this.state.showHide.invoiceNotesTemplate
          ? this.state.invoiceNote
          : "",
        payableItems: this.state.payableItems,
      };

      console.log("dataaaa:::", data);

      let res = await ApiCall("createInvoice", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.INVOICE.CREATE_SUCCESSFULL, {
          hideProgressBar: true,
        });

        this.closeInvoiceModal();
        this.load();
      } else {
        toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
      }
    }
  };

  onCancelInvoice = () => {
    let showHideObj = {
      dueDateTemplate: true,
      invoicePeriodTemplate: true,
      billingAddressTemplate: true,
      phoneNumberTemplate: true,
      emailTemplate: true,
      invoiceNotesTemplate: true,
      payableItemsTemplate: true,
      invoiceIdTemplate: true,
      invoiceDateTemplate: true,
    };
    this.setState({
      // invoiceId:"",
      // invoiceDate:"",
      // dueDate:"",
      invoiceStatusData: {},
      invoicePeriodFromDate: "",
      invoicePeriodToDate: "",
      billingAddress: "",
      phoneNumber: "+" + this.state.countryCode + "",
      invoiceEmail: "",
      invoiceNote: "",
      showHide: showHideObj,
    });
    this.closeInvoiceModal();
  };
  // onCancelTemplate = () => {
  //     this.setState({
  //       templateName:"",
  //       selectedColumnList:[],
  //       availableColumnsList:this.state.availableColumnsList
  //     })
  // }

  onDownloadInvoice = async(data) => {
    // consoleLog("downloaddata",data)
    let obj = {
      invoiceId:data.invoiceId
    };

    let res = await ApiCall("getInvoicePathById",obj)

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
     let invoicePath =  decodeData.data.invoicePath[0];
      // consoleLog("response:::::::::::::::::",invoicePath.invoicePath)
      if(invoicePath.invoicePath == null || invoicePath.invoicePath == undefined){
        invoicePath.invoicePath = "";
      } else {
         window.open(
        INVOICE_PATH_ONLY + invoicePath.invoicePath
      );
      }
     
    } else {
      toast.error("error occured")
    }

  };

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
            <Link to="/adminDashboard">Dashboard</Link> / Accounts / Payables
          </div>
          <div class="listing-component-app">
            <div class="vendor-info _fl sdw">
              <div class="vn-form _fl">
                <div class="row">
                  <div class="col-md-4">
                    <div className="vn_frm">
                      <span
                        style={{
                          width: "10%",
                          paddingLeft: "5px",
                          fontSize: "14px",
                        }}
                      >
                        ID
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
              </div>

              <div className="vn-form _fl" style={{ marginTop: "50px" }}>
                <div class="row">
                  <div class="col-md-4">
                    <div class="_fl verificaiton-doc-tab ven">
                      <ul>
                        <li
                          class="active"
                          data-related="tble-data-a"
                          onClick={() => {
                            this.onTabClick("verifiedJobs");
                          }}
                        >
                          Verified Jobs
                        </li>
                        <li
                          data-related="tble-data-b"
                          onClick={() => {
                            this.onTabClick("invoices");
                          }}
                        >
                          Invoices
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-4"></div>
                  <div className="col-md-2"></div>
                  <div className="col-md-2">
                    {this.state.isVerifiedJobs ? (
                      <React.Fragment>
                        <a
                          href="javascript:void(0)"
                          class="progress-btn sky"
                          style={{
                            textAlign: "center",
                            textDecoration: "none",
                            fontSize: "12px",
                            // pointerEvents:this.state.isChecked ? "" : "none"
                          }}
                          onClick={this.openCreateInvoiceModal}
                        >
                          Create Invoice
                        </a>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <a
                          href="javascript:void(0)"
                          class="progress-btn previewInvoiceBtn"
                          onClick={this.openPrevInvoiceModal}
                        >
                          Preview Invoice
                        </a>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {this.state.isVerifiedJobs ? (
              <React.Fragment>
                <div class="table-filter-app-b">
                
                  
                      <div class="filter-btn">
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
                  

                    
                    
                      <div class="table-filter-box">
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
              </React.Fragment>
            ) : this.state.isInvoices ? (
              <React.Fragment>
                <div class="table-filter-app-b">
                  <div class="filter-btn">
                    <a
                      href={"javascript:void(0)"}
                      onClick={this.openFilterModal_invoice}
                    >
                      Filter
                    </a>
                  </div>
                  <div className="filter-pagination">
                    <button
                      className="prev_btn"
                      onClick={this.exLeft_invoice}
                    ></button>
                    <button className="prv_btn" onClick={this.prev_invoice}>
                      {" "}
                      {"<"}
                    </button>
                    <span
                      className="num"
                      onChange={(e) => this.clickChange_invoice(e)}
                    >
                      {this.state.current_page_invoice}
                    </span>
                    <button className="nxt_btn" onClick={this.next_invoice}>
                      {">"}
                    </button>
                    <button
                      className="next_btn"
                      onClick={this.exRigth_invoice}
                    ></button>
                  </div>
                  <div className="" style={{float:"left"}}>
                  
                        <Button
                          id="demo-customized-button"
                          aria-controls={
                            open1 ? "demo-customized-menu" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={open1 ? "true" : undefined}
                          variant="contained"
                          disableElevation
                          onClick={this.menuBtnhandleClick_b}
                          endIcon={<KeyboardArrowDownIcon />}
                        >
                          Bulk Action
                        </Button>
                        <StyledMenuBtn
                          id="demo-customized-menu"
                          MenuListProps={{
                            "aria-labelledby": "demo-customized-button",
                          }}
                          anchorEl={this.state.anchorEl1}
                          open={open1}
                          onClose={this.handleMenuClose}
                        >
                          <MenuItem disableRipple onClick={this.onVoidClick}>
                            {/* <EditIcon /> */}
                            Void
                          </MenuItem>
                          <MenuItem disableRipple onClick={this.onEmailClick}>
                            {/* <FileCopyIcon /> */}
                            Email
                          </MenuItem>

                          <MenuItem
                            disableRipple
                            onClick={this.onDownloadClick}
                          >
                            {/* <ArchiveIcon /> */}
                            Download
                          </MenuItem>
                          <MenuItem disableRipple onClick={this.onPaidClick}>
                            {/* <MoreHorizIcon /> */}
                            Paid
                          </MenuItem>
                        </StyledMenuBtn>
                      
                      {/* <Select
                        styles={bulkStyles}
                        name="select"
                        placeholder="BULK ACTION"
                        components={{
                          DropdownIndicator,
                          IndicatorSeparator: () => null,
                        }}
                        value={this.state.bulkData}
                        options={bulkArr}
                        onChange={(value) => this.onBulkChange(value)}
                      /> */}
                    </div>
                  <div class="table-filter-box">
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
                          value={this.state.selectedDisplayData_invoice}
                          placeholder="Select"
                          onSelectChange={(value) => {
                            this.onChangeLimit_invoice(value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment />
            )}

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
                        <th style={{ width: "11%" }}>
                          <strong>ID</strong>
                        </th>
                        <th style={{ width: "10%" }}>Service</th>
                        <th style={{ width: "10%" }}>Client(Bill To)</th>
                        <th style={{ width: "10%" }}>Vendor</th>
                        <th style={{ width: "10%" }}>Vendor Type</th>
                        <th style={{ width: "12%" }}>Actual Date</th>
                        <th style={{ width: "10%" }}>Status</th>
                        <th style={{ width: "9%" }}>Total Amount</th>
                      </tr>
                    </tbody>
                    <tbody>
                      {this.state.listData.length > 0 ? (
                        <React.Fragment>
                          {this.state.listData.map((data, i) => (
                            <React.Fragment>
                              <tr>
                                <td style={{ width: "11%" }}
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title={data.jobId}>
                                  {data.status === 0 ? <div
                                    // onClick={() =>
                                    //   this.showDetails(data, i)
                                    // }
                                    style={{
                                      paddingLeft: "5px",
                                      paddingTop: "4px",
                                      fontSize: "14px"
                                    }}
                                  >
                                    {data.jobId.length > 15
                                      ? textTruncate(data.jobId, 15)
                                      : data.jobId}
                                  </div> : <label className="custom_check2">
                                    <input
                                      type="checkbox"
                                      name={i}
                                      checked={data.isSelected}
                                      onChange={this.receivableTypeChange(
                                        data,
                                        i
                                      )}
                                    />
                                    <span
                                      className="checkmark2"
                                      style={{ padding: "10px" }}
                                    ></span>
                                    <strong>
                                      <div
                                        // onClick={() =>
                                        //   this.showDetails(data, i)
                                        // }
                                        style={{
                                          paddingLeft: "5px",
                                          paddingTop: "4px",
                                        }}
                                      >
                                        {data.jobId.length > 15
                                          ? textTruncate(data.jobId, 15)
                                          : data.jobId}
                                      </div>
                                    </strong>
                                  </label>}
                                </td>
                                <td style={{ width: "10%" }}>
                                  {data.serviceType}
                                </td>
                                <td style={{ width: "10%" }}>
                                  {data.clientName}
                                </td>
                                <td style={{ width: "10%" }}>
                                  {data.vendorName}
                                </td>
                                <td style={{ width: "10%" }}>
                                  {" "}
                                  {data.vendotType}
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
                                        className="progress-btn sky"
                                      >
                                        Invoice Created
                                      </span>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment />
                                  )}

                                  {/* <a href="#" class="progress-btn sky">Verified</a> */}
                                </td>
                                <td style={{ width: "9%" }}>
                                  $ {data.totalAmount}
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <tr style={{ textAlign: "center" }}>
                            <td colSpan="8">
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
            <div class="tab-app-information" id="tble-data-b">
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
                          <strong>ID</strong>
                        </th>
                        <th style={{ width: "15%" }}>Vendor(Bill To)</th>
                        <th style={{ width: "12%" }}>Actual Date</th>
                        <th style={{ width: "10%" }}>Status</th>
                        <th style={{ width: "11%" }}>Total Amount</th>
                        <th style={{ width: "11%" }}>Action</th>
                      </tr>
                    </tbody>
                    <tbody>
                      {this.state.invoiceData.length > 0 ? (
                        <React.Fragment>
                          {this.state.invoiceData.map((data, i) => (
                            <React.Fragment>
                              <tr>
                                <td style={{ width: "8%" }}
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title={data.invoiceId}
                                >
                                  {/* {data.jobId} */}
                                  <label className="custom_check2">
                                    <input
                                      type="checkbox"
                                      name={i}
                                      checked={data.isSelected}
                                      onChange={this.receivableInvoiceTypeChange(
                                        data,
                                        i
                                      )}
                                    />
                                    <span
                                      className="checkmark2"
                                      style={{ padding: "10px" }}
                                    ></span>
                                    <strong>
                                      <div
                                        style={{
                                          paddingLeft: "5px",
                                          paddingTop: "4px",
                                        }}
                                      >
                                        {data.invoiceId.length > 15
                                          ? textTruncate(data.invoiceId, 15)
                                          : data.invoiceId}
                                      </div>
                                    </strong>
                                  </label>
                                </td>
                                {/* <td style={{ width: "10%" }}>
                                  {data.serviceType}
                                </td> */}
                                <td style={{ width: "15%" }}>
                                  {data.clientName}
                                </td>
                                {/* <td style={{ width: "10%" }}>
                                  {data.vendorName}
                                </td>
                                <td style={{ width: "10%" }}>
                                  {" "}
                                  {data.vendotType}
                                </td> */}
                                <td style={{ width: "12%" }}>
                                  {SetDateFormat(data.invoiceDate) +
                                    " | " +
                                    SetTimeFormat(data.invoiceDate)}
                                </td>
                                <td style={{ width: "10%" }}>
                                  {data.status === 0 ? (
                                    <React.Fragment>
                                      <span className="progress-btn yellow">
                                        Raised
                                      </span>
                                    </React.Fragment>
                                  ) : data.status === 1 ? (
                                    <React.Fragment>
                                      <span
                                        href="#"
                                        className="progress-btn sky"
                                      >
                                        Received
                                      </span>
                                    </React.Fragment>
                                  ) : data.status === 2 ? (
                                    <React.Fragment>
                                      <span className="progress-btn yellow">
                                        Paid
                                      </span>
                                    </React.Fragment>
                                  ) : data.status === 3 ? (
                                    <React.Fragment>
                                      <span
                                        href="#"
                                        className="progress-btn sky"
                                      >
                                        Payment Failed
                                      </span>
                                    </React.Fragment>
                                  ) : data.status === 4 ? (
                                    <React.Fragment>
                                      <span className="progress-btn yellow">
                                        Rejected
                                      </span>
                                    </React.Fragment>
                                  ) : data.status === 5 ? (
                                    <React.Fragment>
                                      <span
                                        href="#"
                                        className="progress-btn sky"
                                      >
                                        Void
                                      </span>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment />
                                  )}
                                </td>
                                <td style={{ width: "11%" }}>
                                  $ {data.amount}
                                </td>
                                <td style={{ width: "11%" }}>
                                  <div>
                                    <a href="javascript:void(0)">
                                      <img
                                        src={ImageName.IMAGE_NAME.DOWNLOAD_SHEET_ICON}
                                        onClick={() =>
                                          this.onDownloadInvoice(data)
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
                            <td colSpan="8">
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* .................filter.modal..invoice................................. */}
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
                      onClick={this.onResetFilter_invoice}
                    />
                    Reset
                  </button>
                  <button class="apply" data-dismiss="modal">
                    <img
                      src={ImageName.IMAGE_NAME.BLUE_TICK}
                      onClick={this.onFilterApply_invoice}
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
                        value={this.state.formDate_invoice}
                        onChange={this.formDateChange_invoice}
                      />
                    </div>
                    <div class="form-field-app">
                      <span>to</span>
                      <input
                        type="date"
                        class="datefield bd"
                        placeholder="10/25/2021"
                        value={this.state.toDate_invoice}
                        onChange={this.toDateChange_invoice}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ........................invoice modal................ */}

        <div id="invoice-model" class="modal fade modelwindow" role="dialog">
          <div class="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div class="modal-content" style={{ width: "110%" }}>
              <div class="filter-head _fl mdf">
                <div className="row">
                  <div className="col-md-3">
                    <h3 style={{ background: "none", fontSize: "14px" }}>
                      Create Invoice
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
                        onClick={this.onCancelInvoice}
                      >
                        Cancel
                      </button>
                      <button
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
                      </button>
                      <button class="apply" style={{ width: "110px" }}>
                        <a
                          href="javascript:void(0)"
                          class="progress-btn sky"
                          style={{ textDecoration: "none", fontSize: "12px" }}
                          id={"basic-button"}
                          aria-controls={"basic-menu"}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={(e) => this.menuBtnhandleClick(e)}
                        >
                          Customize
                        </a>
                        <StyledMenu
                          id={"basic-menu"}
                          anchorEl={this.state.anchorEl}
                          open={open}
                          onClose={this.handleMenuClose}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                        >
                          {/* <MenuItem onClick={this.openTemplateModal}>
                            Edit Template
                          </MenuItem> */}
                          <MenuItem onClick={this.openSelectTemplateModal}>
                            Choose Template
                          </MenuItem>
                          <MenuItem onClick={this.openTemplateModal}>
                            Manage Custom Fields
                          </MenuItem>
                          <MenuItem onClick={this.openInfoModal}>
                            Update Logo & Address
                          </MenuItem>
                        </StyledMenu>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-body">
                <div class="model-info f-model">
                  <div className="row">
                    {/* {this.state.showHide.invoiceIdTemplate === true ? (
                      <React.Fragment>
                        <div className="col-md-3">
                          <div className="form_rbx">
                            {" "}
                            <span className="invoiceLabel">Invoice ID</span>
                            <input
                              placeholder=""
                              className="inputfield"
                              value={this.state.invoiceId}
                              disabled
                              style={{ width: "120%" }}
                            />
                          </div>
                        </div>
                        <div className="col-md-1"></div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment />
                    )} */}

                    {this.state.showHide.invoiceDateTemplate === true ? (
                      <React.Fragment>
                        <div className="col-md-3">
                          <div className="form_rbx">
                            {" "}
                            <span className="invoiceLabel">Invoice Date</span>
                            <input
                              placeholder=""
                              className="inputfield"
                              value={this.state.invoiceDate}
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
                              value={this.state.dueDate}
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
                            value={this.state.invoiceStatusData}
                            options={invoiceStatusArr}
                            onChange={(value) =>
                              this.onInvoiceStatusChange(value)
                            }
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
                                      <span>From {this.state.invoicePeriodFromDate}</span>
                                    </div>
                                    <div style={{ width: "20%" }}>
                                      <a style={{ float: "right" }}>
                                        <DatePicker
                                          onChange={(date) =>
                                            this.invoiceFormDateChange(date)
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
                                      <span>To {this.state.invoicePeriodToDate}</span>
                                    </div>
                                    <div style={{ width: "20%" }}>
                                      <a style={{ float: "right" }}>
                                        <DatePicker
                                          onChange={(date) =>
                                            this.invoiceToDateChange(date)
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
                          value={this.state.clientName}
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
                              value={this.state.billingAddress}
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
                                value={this.state.phoneNumber}
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
                                value={this.state.invoiceEmail}
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
                              value={this.state.invoiceNote}
                              onChange={(value) => {
                                this.onInvoiceNotesChange(value);
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

                        {this.state.payableItems.map((item, key) => (
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
                                          disabled
                                          type="text"
                                          className="inputfield"
                                          value={item.id}
                                          onChange={this.payableIdChange(
                                            key
                                          )}
                                        />
                                      </div>
                                      {/* </React.Fragment>
                                      ) : ( */}
                                      {/* <React.Fragment>
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
                                          onChange={this.payableTypeChange(
                                            key
                                          )}
                                        />
                                      </div>
                                      {/* </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <div style={{ fontSize: "12px" }}>
                                            {item.serviceType}
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
                                            {item.unit}
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
                                      <div className="col-md-1 delete-btn">
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
                                      </div>
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
                  <div className="addPayableItem">
                    <a
                      href="javascript:void(0)"
                      class="progress-btn previewInvoiceBtn"
                      onClick={this.addParticularField}
                    >
                      Add Item
                    </a>
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
                                        {this.state.preview_invoicePeriodFromDate}
                                      </span>
                                    </div>
                                    <div style={{ width: "20%" }}>
                                      <a style={{ float: "right" }}>
                                        <DatePicker
                                          disabled
                                          onChange={(date) =>
                                            this.preview_invoiceFormDateChange(date)
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
                                            this.preview_invoiceToDateChange(date)
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
                                          disabled
                                          type="text"
                                          className="inputfield"
                                          value={item.id}
                                          onChange={this.payableIdChange(
                                            key
                                          )}
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
                                          onChange={this.payableTypeChange(
                                            key
                                          )}
                                          disabled
                                        />
                                      </div>
                                      {/* </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <div   style={{ fontSize: "12px" }}>
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
                                          disabled
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
                                          disabled
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
                                          disabled
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
                                          disabled
                                          type="text"
                                          className="inputfield"
                                          value={item.totalPrice}
                                          onChange={this.payableTotalPriceChange(
                                            key
                                          )}
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

        {/* ................admininfo modal.................... */}

        <div id="adminInfo-model" class="modal fade modelwindow" role="dialog">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div
              class="modal-content"
              style={{ margin: "100px 0px 100px 100px" }}
            >
              <div class="filter-head _fl mdf">
                <h3
                  style={{
                    background: "none",
                    fontSize: "14px",
                    paddingLeft: "0px",
                  }}
                >
                  Update 7c Logo & Address
                </h3>
                <div class="reset-btn-dp">
                  <button className="close-page" style={{ top: "15px" }}>
                    <img
                      src={ImageName.IMAGE_NAME.CLOSE_BTN_2}
                      onClick={this.onAdminInfoCancel}
                    />
                  </button>
                </div>
              </div>

              <div class="modal-body" style={{ padding: "35px" }}>
                <div
                  className="row"
                  style={{ borderBottom: "1px solid #dfdede" }}
                >
                  <div className="col-md-3">
                    <div className="profile-pic-data">
                      <div className="invoiceLogo">
                        <img
                          className="border_50_img"
                          src={this.state.imagePath}
                          style={{
                            width: "120px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                        <button className="pht">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={this.onProfileImage}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-7"
                    style={{ padding: "35px 0px 0px 10px" }}
                  >
                    <span className="invoiceLabel" style={{ fontSize: "11px" }}>
                      This Logo will appear on all the invoices that are created
                    </span>
                    <br />
                    <br />
                    <span className="invoiceLabel" style={{ fontSize: "11px" }}>
                      Prefered Image Size: 240px * 240px @72 DPI{" "}
                    </span>
                    <br />
                    <span className="invoiceLabel" style={{ fontSize: "11px" }}>
                      Max size of 1MB
                    </span>
                  </div>
                </div>
                <div className="row" style={{ marginTop: "50px" }}>
                  <div className="col-md-6">
                    <input
                      type="text"
                      placeholder=""
                      className="in-field2"
                      value={this.state.adminName}
                      onChange={(e) => this.onAdminNameChange(e)}
                    />
                  </div>
                </div>
                <div className="row" style={{ marginTop: "20px" }}>
                  <div className="col-md-6">
                    <div className="form_rbx">
                      <span className="invoiceLabel">Street</span>
                      <input
                        type="text"
                        placeholder=""
                        className="in-field2"
                        value={this.state.adminStreet}
                        onChange={(e) => this.onStreetChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form_rbx">
                      <span className="invoiceLabel">City</span>
                      <input
                        type="text"
                        placeholder=""
                        className="in-field2"
                        value={this.state.adminCity}
                        onChange={(e) => this.onCityChange(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form_rbx">
                      {" "}
                      <span className="invoiceLabel">State</span>
                      <div className="dropdwn">
                        <Select
                          styles={customStyles}
                          name="select"
                          placeholder="Select"
                          components={{
                            DropdownIndicator,
                            IndicatorSeparator: () => null,
                          }}
                          value={this.state.stateData}
                          options={this.state.stateArr}
                          onChange={(value) => this.onStateChange(value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form_rbx">
                      <span className="invoiceLabel">Zip Code</span>
                      <input
                        type="text"
                        placeholder=""
                        className="in-field2"
                        value={this.state.adminZipCode}
                        onChange={(e) => this.onZipChange(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form_rbx">
                      {" "}
                      <span className="invoiceLabel">Phone Number</span>
                      <InputText
                        placeholder=""
                        className="in-field2"
                        value={this.state.adminPhone}
                        onTextChange={(value) => {
                          this.onPhoneChange(value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form_rbx">
                      <span className="invoiceLabel">Fax</span>
                      <input
                        type="text"
                        placeholder=""
                        className="in-field2"
                        value={this.state.adminFax}
                        onChange={(e) => this.onFaxChange(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form_rbx">
                      <span className="invoiceLabel">Website</span>
                      <input
                        type="text"
                        placeholder=""
                        className="in-field2"
                        value={this.state.adminWebsite}
                        onChange={(e) => this.onWebsiteChange(e)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row" style={{ marginTop: "30px" }}>
                  <div className="col-md-5">
                    <div className="reset-btn-dp" style={{ float: "left" }}>
                      <button
                        class="apply"
                        data-dismiss="modal"
                        style={{ width: "110px" }}
                      >
                        <a
                          href="javascript:void(0)"
                          class="progress-btn sky"
                          style={{ textDecoration: "none", fontSize: "12px" }}
                          onClick={this.onSubmitAdminInfo}
                        >
                          Save
                        </a>
                      </button>
                      <button
                        class="reset"
                        data-dismiss="modal"
                        style={{
                          width: "110px",
                          textDecoration: "none",
                          fontSize: "12px",
                        }}
                        onClick={this.onAdminInfoCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ................create template modal.................... */}
        <div
          id="createTemplate-model"
          class="modal fade modelwindow"
          role="dialog"
        >
          <div class="modal-dialog modal-lg modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div
              class="modal-content"
              style={{ margin: "100px 0px 100px 100px" }}
            >
              <div class="filter-head _fl mdf">
                <h3
                  style={{
                    background: "none",
                    fontSize: "14px",
                    paddingLeft: "0px",
                  }}
                >
                  Create Custom View
                </h3>
                <h3
                  style={{
                    background: "none",
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "end",
                    width: "55%",
                    paddingRight: "10px",
                  }}
                >
                  Primary
                </h3>
                <div className="invoiceSwitch">
                  <FormControl component="fieldset" variant="standard">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AntSwitch
                        // defaultChecked={
                        //   item.status === 1 ? true : false
                        // }
                        checked={this.state.primaryCheck}
                        inputProps={{
                          "aria-label": "ant design",
                        }}
                        name="active"
                        onClick={() => this.onStatusChange()}
                      />
                    </Stack>

                    <FormHelperText
                      style={{
                        textAlign: "center",
                        fontSize: "8px",
                      }}
                    >
                      {" "}
                      {this.state.primaryCheck === true ? "YES" : "NO"}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div class="reset-btn-dp">
                  <button className="close-page" style={{ top: "15px" }}>
                    <img
                      src={ImageName.IMAGE_NAME.CLOSE_BTN_2}
                      onClick={this.onCreateTemplateCancel}
                    />
                  </button>
                </div>
              </div>

              <div class="modal-body" style={{ padding: "35px" }}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form_rbx" style={{ width: "140%" }}>
                      <span className="invoiceLabel">Template Name</span>
                      <InputText
                        type="text"
                        placeholder=""
                        className="inputfield"
                        value={this.state.templateName}
                        onTextChange={(value) => {
                          this.onTemplateNameChange(value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form_rbx" style={{ width: "140%" }}>
                      <span className="invoiceLabel">Client</span>
                      <input
                        type="text"
                        placeholder=""
                        className="inputfield"
                        value={this.state.clientName}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <h6
                  style={{
                    borderBottom: "1px solid rgb(223, 222, 222)",
                    paddingBottom: "10px",
                    marginTop: "20px",
                  }}
                >
                  Column Preference
                </h6>

                <div className="row">
                  <div className="invoiceTemplateColumn">
                    <div className="form_rbx">
                      <span className="invoiceLabel">Available Columns</span>
                      <div className="invoiceColumnList">
                        <div
                          className="row"
                          style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        >
                          <InputText
                            type="text"
                            id="search"
                            placeholder="Search"
                            className="inputfield"
                            value={this.state.searchColumnData}
                            onTextChange={(value) => this.onSearchData(value)}
                          />
                        </div>
                        <div className="availableInvoiceCheckBox">
                          <div class="multiple-option-check" style={{}}>
                            {this.state.availableColumnsList.map(
                              (item1, key1) => (
                                <React.Fragment key={key1}>
                                  <div class="check-field">
                                    <label class="checkbox_btn">
                                      <input
                                        type="checkbox"
                                        name={key1}
                                        checked={item1.isSelected}
                                        onChange={this.subTypeChange(key1)}
                                      />
                                      <span class="checkmark3"></span>{" "}
                                      {item1.name}
                                    </label>
                                  </div>
                                </React.Fragment>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div
                          className="reset-btn-dp invoiceColumnBtn"
                          style={{ float: "right" }}
                        >
                          <button
                            class="apply"
                            data-dismiss="modal"
                            style={{ width: "110px" }}
                          >
                            <a
                              href="javascript:void(0)"
                              class="progress-btn green"
                              style={{
                                textDecoration: "none",
                                fontSize: "12px",
                              }}
                              onClick={this.onAddColumnData}
                            >
                              Add
                            </a>
                          </button>
                        </div>
                      </div>
                    </div>
                    <img
                      src={ImageName.IMAGE_NAME.BLUE_RIGHT_ARROW}
                      style={{ width: "17px", margin: "5px" }}
                    />

                    <div className="form_rbx">
                      <span className="invoiceLabel">Selected Columns</span>
                      <div className="invoiceColumnList">
                        <div
                          className="row"
                          style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        ></div>
                        <div className="availableInvoiceCheckBox" id="style-1">
                          <div class="multiple-option-check" style={{}}>
                            {this.state.selectedColumnList.map(
                              (item1, key1) => (
                                <React.Fragment key={key1}>
                                  <div class="check-field">
                                    <label class="checkbox_btn">
                                      <input
                                        type="checkbox"
                                        name={key1}
                                        checked={item1.isSelected}
                                        onChange={this.selectedSubTypeChange(
                                          key1
                                        )}
                                      />
                                      <span class="checkmark3"></span>{" "}
                                      {item1.name}
                                    </label>
                                  </div>
                                </React.Fragment>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row" style={{ marginTop: "3px" }}>
                        <div
                          className="reset-btn-dp invoiceColumnBtn"
                          style={{ float: "right" }}
                        >
                          <button
                            class="apply"
                            data-dismiss="modal"
                            style={{ width: "110px" }}
                          >
                            <a
                              href="javascript:void(0)"
                              class="progress-btn red"
                              style={{
                                textDecoration: "none",
                                fontSize: "12px",
                              }}
                              onClick={this.onDeleteColumnData}
                            >
                              Delete
                            </a>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row" style={{ marginTop: "30px" }}>
                  <div className="col-md-5">
                    <div className="reset-btn-dp" style={{ float: "left" }}>
                      <button
                        class="apply"
                        data-dismiss="modal"
                        style={{ width: "110px" }}
                      >
                        <a
                          href="javascript:void(0)"
                          class="progress-btn sky"
                          style={{ textDecoration: "none", fontSize: "12px" }}
                          onClick={this.onCreateTemplate}
                        >
                          Save
                        </a>
                      </button>
                      <button
                        class="reset"
                        data-dismiss="modal"
                        style={{
                          width: "110px",
                          textDecoration: "none",
                          fontSize: "12px",
                        }}
                        onClick={this.onCreateTemplateCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ................create template modal.................... */}
        <div
          id="chooseTemplate-model"
          class="modal fade modelwindow"
          role="dialog"
        >
          <div class="modal-dialog modal-lg modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div
              class="modal-content"
              style={{ margin: "100px 0px 100px 100px" }}
            >
              <div class="filter-head _fl mdf">
                <h3
                  style={{
                    background: "none",
                    fontSize: "14px",
                    paddingLeft: "0px",
                  }}
                >
                  Choose Template
                </h3>
                <div class="reset-btn-dp">
                  <button className="close-page" style={{ top: "15px" }}>
                    <img
                      src={ImageName.IMAGE_NAME.CLOSE_BTN_2}
                      onClick={this.closeSelectTemplateModal}
                    />
                  </button>
                </div>
              </div>

              <div class="modal-body" style={{ padding: "35px" }}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form_rbx" style={{ width: "140%" }}>
                      <span className="invoiceLabel">Choose Template</span>
                      <SelectBox
                        optionData={this.state.templateArr}
                        value={this.state.selectedTemplateData}
                        placeholder="Select"
                        onSelectChange={(value) => {
                          this.onTemplateChange(value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="row" style={{ marginTop: "30px" }}>
                  <div className="col-md-5">
                    <div className="reset-btn-dp" style={{ float: "left" }}>
                      <button
                        class="apply"
                        data-dismiss="modal"
                        style={{ width: "110px" }}
                      >
                        <a
                          href="javascript:void(0)"
                          class="progress-btn sky"
                          style={{ textDecoration: "none", fontSize: "12px" }}
                          onClick={this.onSelectTemplate}
                        >
                          Save
                        </a>
                      </button>
                      <button
                        class="reset"
                        data-dismiss="modal"
                        style={{
                          width: "110px",
                          textDecoration: "none",
                          fontSize: "12px",
                        }}
                        onClick={this.closeSelectTemplateModal}
                      >
                        Cancel
                      </button>
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