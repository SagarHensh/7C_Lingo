import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import { AlertMessage, ImageName } from "../../../../enums";
import { Decoder } from "../../../../services/auth";
import {
  consoleLog,
  SetDateFormat,
  SetTimeFormat,
  textTruncate,
} from "../../../../services/common-function";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { ApiCall } from "../../../../services/middleware";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../../SharedComponents/inputText";
import "./invoicesbillsunderv.css";
import $ from "jquery";
import { Link } from "react-router-dom";
import Select, { components } from "react-select";
import { MenuItem } from "@mui/material";
import Menu from "@mui/material/Menu";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import { styled, Box } from "@mui/system"; //imported for modal
import axios from "axios";
import { IMAGE_URL } from "../../../../services/config/api_url";
import Switch from "@mui/material/Switch";

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
  status: "",
};

export default class invoicesbillsunderv extends React.Component {
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
      invoiceId: "12345",
      invoiceDate: "25-12-2021",
      dueDate: "25-01-2022",
      invoiceStatusArr: [],
      invoiceStatusData: "",
      invoicePeriodFromDate: "",
      invoicePeriodToDate: "",
      clientName: "",
      billingAddress: "",
      phoneNumber: "",
      invoiceEmail: "",
      invoiceNote: "",
      payableItems: [
        {
          id: "1234",
          type: "pdf",
          description: "abc",
          quantity: "1",
          unitPrice: "100",
          totalPrice: "100",
        },
        {
          id: "1234",
          type: "pdf",
          description: "abc",
          quantity: "1",
          unitPrice: "100",
          totalPrice: "100",
        },
        {
          id: "1234",
          type: "pdf",
          description: "abc",
          quantity: "1",
          unitPrice: "100",
          totalPrice: "100",
        },
      ],
      imagePath: "images/profile-pic.png",

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

      availableColumnsList: [
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
      displayAvailableColumnsList: [
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
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
    document.getElementById("backdrop").style.display = "none";
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
  }

  load = async () => {
    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
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

      // consoleLog("*****", payload.data);
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
  };

  getListDetails = async (data) => {
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
      consoleLog("Bill Payload:", allBillInvoice);
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
      consoleLog("Bill Payload payload payable:", allBillInvoice);
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
  // ........payable.........
  formDateChange_payable = (e) => {
    this.setState({
      formDate_payable: e.target.value,
    });
  };

  toDateChange_payable = (e) => {
    this.setState({
      toDate_payable: e.target.value,
    });
  };

  invoiceFormDateChange = (e) => {
    consoleLog("val::", e.target.value);
    this.setState({
      invoicePeriodFromDate: e.target.value,
    });
  };

  invoiceToDateChange = (e) => {
    consoleLog("val::", e.target.value);
    this.setState({
      invoicePeriodToDate: e.target.value,
    });
  };

  onFilterApply = () => {
    if (this.state.isReceivable == true) {
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

      this.closeFilterModal();
    } else {
      let resData = {
        limit: this.state.limit_payable,
        offset: this.state.offset_payable.toString(),
        search: this.state.input,
        jobId: this.state.id,
        searchto: this.state.toDate_payable,
        searchfrom: this.state.formDate_payable,
      };

      let mainData = Object.assign(reqData, resData);

      this.getPayableDetails(mainData);

      // this.setState({
      //   formDate: "",
      //   toDate: "",
      // });
      this.closeFilterModal();
    }
  };

  onResetFilter = () => {
    this.load();
    this.setState({
      formDate: "",
      toDate: "",
      current_page: 1,
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
    });

    this.closeFilterModal();
  };
  onVendorChange = async (dat) => {
    let obj = { label: dat.label, value: dat.value };

    let resData = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      jobId: dat.value,
    };

    let mainData = Object.assign(reqData, resData);

    this.getListDetails(mainData);
    this.setState({
      selectedVendorData: obj,
    });
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

  onTick = async (item, id) => {
    consoleLog("%%%%%%", id);
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
    consoleLog("88", val);
    if (val.serviceTypeId === 45) {
      this.props.history.push({
        pathname: "/adminJobDetailsFromBillVerification",
        state: val.requestId,
      });
    } else if (val.serviceTypeId === 46) {
      this.props.history.push({
        pathname: "/adminTranslationDetailsFromBillVerification",
        state: val.requestId,
      });
    } else if (val.serviceTypeId === 47) {
      this.props.history.push({
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

  // ..................admin info function.....................

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
  onStateChange = (e) => {
    this.setState({
      stateData: e.target.value,
    });
  };
  onZipChange = (e) => {
    this.setState({
      adminZipCode: e.target.value,
    });
  };
  onPhoneChange = (e) => {
    this.setState({
      adminPhone: e.target.value,
    });
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
      adminPhone: "",
      adminFax: "",
      adminWebsite: "",
    });
  };

  onSubmitAdminInfo = () => {
    consoleLog("submit::");
  };

  // ................create templete modal function...............

  onTemplateNameChange = (val) => {
    this.setState({
      templateName: val,
    });
  };

  // onSearchData = (val) => {
  //   this.setState({
  //     searchColumnData: val,
  //   });
  // };

  onCreateTemplateCancel = () => {
    this.closeCreateTemplateModal();
  };

  onCreateTemplate = async () => {
    let data = {
      templateName: this.state.templateName,
      content: this.state.selectedColumnList,
    };

    let res = await ApiCall("insertInvoiceTemplate", data);
    consoleLog("rsponse", res);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.TEMPLATE.ADD_SUCCESS);
      this.closeCreateTemplateModal();
      this.setState({
        isEditable: true,
      });
    }

    consoleLog("data:::", data);
  };

  //..............function for MenuButton close..............
  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
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
    // consoleLog("brr::", brr);

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

  chooseTemplateApi = async () => {
    let arr = [];
    let res = await ApiCall("fetchInvoiceTemplateList");

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);

      consoleLog("decodeData::", decodeData.data);
      decodeData.data.map((obj) => {
        arr.push({
          label: obj.templateName,
          value: obj.id,
        });
      });
      this.setState({
        templateArr: arr,
        templateId: this.state.selectedTemplateData.value,
      });
    }
  };

  fetchTemplateApi = async () => {
    let res = await ApiCall("getInvoiceTemplateById", {
      id: this.state.selectedTemplateData.value,
    });

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      consoleLog("decodeData:::", decodeData);
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
    this.fetchTemplateApi();
    this.closeSelectTemplateModal();
  };

  onSearchData = (val) => {
    let display = this.state.displayAvailableColumnsList.filter((item) =>
      item.name.toUpperCase().includes(val.toUpperCase())
    );
    this.setState({
      searchColumnData: val,
      availableColumnsList: display,
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
    //  consoleLog("check::",flag)
    this.setState({
      primaryCheck: flag,
    });

    // let arrData = this.state.listData;
    // let stat = 0;
    // if (arrData[index].status === 0) {
    //   stat = 1;
    // } else {
    //   stat = 0;
    // }
    // arrData[index].status = stat;
    // this.setState({
    //   listData: arrData,
    // });

    // let data = {
    //   clientcontactid: arrData[index].clientcontactid,
    //   status: stat.toString(),
    // };

    // let status = await ApiCall("modifyapprovedclientcontactstatus", data);

    // if (
    //   status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {
    //   let decodeData = Decoder.decode(status.data.payload);

    //   toast.success(AlertMessage.MESSAGE.UPDATE_STATUS.SUCCESS);
    // }
  };

  onTabClick = (value) => {
    if (value === "receivables") {
      let resData = {
        limit: this.state.limit,
        offset: this.state.offset.toString(),
      };

      let MainData = Object.assign(reqData, resData);

      this.getListDetails(MainData);
      this.setState({
        isPayable: false,
        isReceivable: true,
      });
    } else if (value === "payables") {
      let resDataPayable = {
        limit: this.state.limit_payable,
        offset: this.state.offset_payable.toString(),
      };

      let MainDataPayable = Object.assign(reqData, resDataPayable);

      this.getPayableDetails(MainDataPayable);
      this.setState({
        isPayable: true,
        isReceivable: false,
      });
    }
  };
  receivableTypeChange = (val, id) => (e) => {
    consoleLog("val:", val);
    if(val == "receivable"){
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

  onExport = async() => {
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
    consoleLog("%%%%",brr)

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
      let obj = {id:arrId};
      
      let res = await ApiCall("exportInvoiceReceivables", obj);
      consoleLog("resss",res)
      const decodeData = Decoder.decode(res.data.payload);
      consoleLog("payload",decodeData)
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        window.open(decodeData.data.url, "_blank");
      }

    }
  }

  onExportPayable = async() => {
    let brr = [],
      arrId = [],
      clientID = "",
      jobID = "",
      invoiceId = "",
      mainInvoiceId = "",
      clientName = "";
    for (let i = 0; i < this.state.payableData.length; i++) {
      if (this.state.payableData[i].isSelected === true) {
        brr.push(this.state.payableData[i]);
        
      }
    }
    consoleLog("%%%%",brr)

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
      let obj = {id:arrId};
      
      let res = await ApiCall("exportInvoicePayables", obj);
      consoleLog("resss",res)
      const decodeData = Decoder.decode(res.data.payload);
      consoleLog("payload",decodeData)
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        window.open(decodeData.data.url, "_blank");
      }
    }
  }

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open

    const checkStatus = (status) => {
      if (status === 0) {
        return <span className="progress-btn yellow">Pending</span>;
      } else if (status === 1) {
        return (
          <a href="javascript:void(0)" class="progress-btn sky">
            Verified
          </a>
        );
      } else if (status === 5) {
        return (
          <a href="javascript:void(0)" class="progress-btn red">
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
        <div class="component-wrapper vewaljobs invoc_pge">
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            <Link to="/adminDashboard">Dashboard</Link> / Bills Under
            verificaiton
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
                            this.onTabClick("receivables");
                          }}
                        >
                          Receivables
                        </li>
                        <li
                          data-related="tble-data-b"
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
                      class="progress-btn sky"
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
                    </React.Fragment>: <React.Fragment>
                    <a
                      href="javascript:void(0)"
                      class="progress-btn sky"
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
            ) : (
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
                          <strong>ID</strong>
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

                                  {/* <a href="#" class="progress-btn sky">Verified</a> */}
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
                        <th style={{ width: "9%" }}>
                          <strong>ID</strong>
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

                                  {/* <a href="#" class="progress-btn sky">Verified</a> */}
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
          </div>
        </div>

        {/* ..................modal................................. */}
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
              {this.state.isReceivable ? (
                <React.Fragment>
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
                </React.Fragment>
              ) : (
                <React.Fragment>
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
                            value={this.state.formDate_payable}
                            onChange={this.formDateChange_payable}
                          />
                        </div>
                        <div class="form-field-app">
                          <span>to</span>
                          <input
                            type="date"
                            class="datefield bd"
                            placeholder="10/25/2021"
                            value={this.state.toDate_payable}
                            onChange={this.toDateChange_payable}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>

        {/* ........................invoice modal................ */}

        {/* <div id="invoice-model" class="modal fade modelwindow" role="dialog">
          <div class="modal-dialog modal-lg">
            
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
                        onClick={this.closeInvoiceModal}
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
                          <MenuItem onClick={this.openTemplateModal}>
                            Edit Template
                          </MenuItem>
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
                    {this.state.showHide.invoiceIdTemplate === true ? (
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
                            options={this.state.invoiceStatusArr}
                            onChange={() => this.onInvoiceStatusChange()}
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
                                  <span>from</span>
                                  <input
                                    type="date"
                                    className="datefield bd"
                                    placeholder="10/25/2021"
                                    value={this.state.invoicePeriodFromDate}
                                    onChange={this.invoiceFormDateChange}
                                    style={{ width: "115%" }}
                                  />
                                </div>
                              </div>
                            
                              <div className="col-md-6">
                                <div className="form-field-app">
                                  <span>to</span>
                                  <input
                                    type="date"
                                    className="datefield bd"
                                    placeholder="10/25/2021"
                                    value={this.state.invoicePeriodToDate}
                                    onChange={this.invoiceToDateChange}
                                    style={{ width: "115%" }}
                                  />
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
                  )} */}

                  {/* {this.state.showHide.payableItemsTemplate ? (
                    <React.Fragment>
                      <h6 style={{ marginTop: "15px" }}>Payable Items</h6>
                      <div className="table-listing-app">
                        <div className="table-responsive">
                          <table
                            width="100%"
                            border="0"
                            cellPadding="0"
                            cellSpacing="0"
                          >
                            <tr>
                              <th style={{ width: "10%" }}>ID</th>
                              <th style={{ width: "10%" }}>Type</th>
                              <th style={{ width: "20%" }}>Description</th>
                              <th style={{ width: "10%" }}>Quantity</th>
                              <th style={{ width: "10%" }}>Unit Cost $</th>
                              <th style={{ width: "10%" }}>Price($)</th>
                            </tr>
                            {this.state.payableItems.length > 0 ? (
                              <React.Fragment>
                                {this.state.payableItems.map((item, key) => (
                                  <tr key={key}>
                                    <td colSpan="6">
                                      <div className="">
                                        <table
                                          width="100%"
                                          border="0"
                                          cellPadding="0"
                                          cellSpacing="0"
                                        >
                                          <tr>
                                            <td style={{ width: "10%" }}>
                                              {item.id}
                                            </td>
                                            <td style={{ width: "10%" }}>
                                              {item.type}
                                            </td>
                                            <td style={{ width: "20%" }}>
                                              {item.description}
                                            </td>
                                            <td style={{ width: "10%" }}>
                                              {item.quantity}
                                            </td>
                                            <td style={{ width: "10%" }}>
                                              {item.unitPrice}
                                            </td>
                                            <td style={{ width: "10%" }}>
                                              {item.totalPrice}
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
                                  <td colSpan="6">
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
                    </React.Fragment>
                  ) : (
                    <React.Fragment />
                  )} */}
                {/* </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* ................admininfo modal.................... */}

        {/* <div id="adminInfo-model" class="modal fade modelwindow" role="dialog">
          <div class="modal-dialog modal-lg modal-dialog-centered">
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
                          onChange={() => this.onStateChange()}
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
                      <input
                        type="text"
                        placeholder=""
                        className="in-field2"
                        value={this.state.adminPhone}
                        onChange={(e) => this.onPhoneChange(e)}
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
        </div> */}

        {/* ................create template modal.................... */}
        {/* <div
          id="createTemplate-model"
          class="modal fade modelwindow"
          role="dialog"
        >
          <div class="modal-dialog modal-lg modal-dialog-centered">
            
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
                        <div className="availableInvoiceCheckBox">
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
        </div> */}

        {/* ................create template modal.................... */}
        {/* <div
          id="chooseTemplate-model"
          class="modal fade modelwindow"
          role="dialog"
        >
          <div class="modal-dialog modal-lg modal-dialog-centered">
            
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
                      <span className="invoiceLabel">Invoice PDF</span>
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
        </div> */}

        <div
          className="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}
