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
// import "./clientContactList.css";

import { AlertMessage, ImageName } from "../../../../enums";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../../../Admin/SharedComponents/inputText";
import { ApiCall, ApiCallClient } from "../../../../services/middleware";
import { CryptoDecoder, Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";
import {
  consoleLog,
  SetDatabaseDateFormat,
  SetDateFormat,
  SetScheduleDate,
  SetTimeFormat,
  SetUSAdateFormat,
  textTruncate,
} from "../../../../services/common-function";
import {
  inputEmptyValidate,
  mobileNumberValidator,
  numberValidator,
  passwordValidator,
  zipValidate,
} from "../../../../validators";
import { Regex } from "../../../../services/config";
import Select, { components } from "react-select";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import { passWordRandomGenerate } from "./function";

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

// .............................................................

const customStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
    borderRadius: "6px",
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

const statusArrData = [
  {
    label: "Active",
    value: "1",
  },
  {
    label: "Inactive",
    value: "0",
  },
];

const reqData = {
  clientcontactname: "",
  email: "",
  mobile: "",
  direc: "",
  orderby: "",
  searchto: "",
  searchfrom: "",
  clientid: "",
  limit: "",
  offset: "",
  status: "",
  roleid: "",
  departmentid: "",
  status: "",
};

export default class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      current_page: 1,
      total_page: 10,
      limit: 20,
      display: "",
      name: "",
      email: "",
      mobile: "",
      departmentId: "",
      departmentArr: [],
      departmentData: [],
      roleId: "",
      clientId: "",
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      clientArr: [],
      clientData: {},
      filterRoleArr: [],
      filterRoleData: {},
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
      departmentData: {
        label: "Select",
        value: "",
      },
      clientData: { label: "Select", value: "" },
      filterRoleData: { label: "Select", value: "" },

      listData: [],
      selectedStatus: {},
      resetPasswordData: "",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    document.getElementById("backdrop").style.display = "none";

    var classInstance = this;

    var filterModal = document.getElementById("filter-model");
    var passwordModal = document.getElementById("password-model");
    var deleteModal = document.getElementById("delete-model");
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (
        event.target == filterModal ||
        event.target == passwordModal ||
        event.target == deleteModal
      ) {
        classInstance.closeModal();
      }
    };

    this.load();
  }

  load = async () => {
    let roleDataArr = [],
      clientDataArr = [];
    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      // offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      offset: "0",
      clientcontactname: "",
      email: "",
      mobile: "",
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom: "",
      clientid: "",
      status: "",
      roleid: "",
      departmentid: "",
      status: "",
    };

    this.listApi(fetchData);

    let lookupres = await ApiCall("getLookUpData");
    if (
      lookupres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      lookupres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(lookupres.data.payload);
      // console.log("payload::::::::::", payload);

      let filterRoleArr = payload.data.lookupdata.CLIENT_CONTACT_TYPE;

      for (let j = 0; j < filterRoleArr.length; j++) {
        roleDataArr.push({
          label: filterRoleArr[j].name,
          value: filterRoleArr[j].id,
        });
      }

      // ..............................................................

      // ..........................................................

      let clientinfoRes = await ApiCall("getallclinetinfo");
      if (
        clientinfoRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        clientinfoRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let clientPayload = Decoder.decode(clientinfoRes.data.payload);
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
        filterRoleArr: roleDataArr,
        clientArr: clientDataArr,
      });
    }
  };

  listApi = async (data) => {
    const res = await ApiCallClient(
      "fetchapprovedclientcontactlistClient",
      data
    );
    console.log("reqData::::", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      let listDetails = decodeData.data.clientContactDetailsList;
      consoleLog("list_data:::", decodeData.data);
      let totalPage = Math.ceil(decodeData.data.totalCount / this.state.limit);
      let listData = [];
      if (listDetails && listDetails.length > 0) {
        listData = decodeData.data.clientContactDetailsList;
      } else {
        listData = [];
      }
      this.setState({
        listData: listData,
        total_page: totalPage,
      });
    }
  };

  //..... for search name......

  onNameChange = (value) => {
    this.setState({
      name: value,
    });

    let fetchData = {
      clientcontactname: value,
      email: this.state.email,
      mobile: this.state.mobile,
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),

      orderby: "",
      direc: "",
      searchto:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom:
        this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      clientid:
        this.state.clientData.value === null ||
        this.state.clientData.value === undefined
          ? ""
          : this.state.clientData.value,
      roleid:
        this.state.filterRoleData.value === null ||
        this.state.filterRoleData.value === undefined
          ? ""
          : this.state.filterRoleData.value,
      departmentid:
        this.state.departmentData.value === null ||
        this.state.departmentData.value === undefined
          ? ""
          : this.state.departmentData.value,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
    };
    let returnData = Object.assign(reqData, fetchData);

    // let data = {
    //   limit: JSON.stringify(this.state.limit),
    //   offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),

    //   clientcontactname: value,
    //   email: this.state.email,
    //   mobile: this.state.mobile,
    //   orderby: "",
    //   direc: "",
    //   searchto: "",
    //   searchfrom: "",
    //   clientid: "",
    //   roleid: "",
    //   departmentid: "",
    //   status: "",
    // };

    this.listApi(returnData);
  };
  onEmailChange = (value) => {
    this.setState({
      email: value,
    });

    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      clientcontactname: this.state.name,
      email: value,
      mobile: this.state.mobile,
      orderby: "",
      direc: "",
      searchto:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom:
        this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      clientid:
        this.state.clientData.value === null ||
        this.state.clientData.value === undefined
          ? ""
          : this.state.clientData.value,
      roleid:
        this.state.filterRoleData.value === null ||
        this.state.filterRoleData.value === undefined
          ? ""
          : this.state.filterRoleData.value,
      departmentid:
        this.state.departmentData.value === null ||
        this.state.departmentData.value === undefined
          ? ""
          : this.state.departmentData.value,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
    };
    let returnData = Object.assign(reqData, fetchData);

    // let data = {
    //   limit: JSON.stringify(this.state.limit),
    //   offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
    //   clientcontactname: this.state.name,
    //   email: value,
    //   mobile: this.state.mobile,
    //   orderby: "",
    //   direc: "",
    //   searchto: "",
    //   searchfrom: "",
    //   clientid: "",
    //   roleid: "",
    //   departmentid: "",
    //   status: "",
    // };

    this.listApi(returnData);
  };
  onMobileChange = (value) => {
    let val = zipValidate(value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        mobile: val,
      });

      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify(
          (this.state.current_page - 1) * this.state.limit
        ),

        clientcontactname: this.state.name,
        email: this.state.email,
        mobile: value,
        orderby: "",
        direc: "",
        searchto:
          this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchfrom:
          this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        clientid:
          this.state.clientData.value === null ||
          this.state.clientData.value === undefined
            ? ""
            : this.state.clientData.value,
        roleid:
          this.state.filterRoleData.value === null ||
          this.state.filterRoleData.value === undefined
            ? ""
            : this.state.filterRoleData.value,
        departmentid:
          this.state.departmentData.value === null ||
          this.state.departmentData.value === undefined
            ? ""
            : this.state.departmentData.value,
        status:
          this.state.selectedStatus.value == null ||
          this.state.selectedStatus.value == undefined
            ? ""
            : this.state.selectedStatus.value,
      };
      let returnData = Object.assign(reqData, fetchData);

      this.listApi(returnData);
    }
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

  //   ..........add new button.......................
  addNew = () => {
    return history.push("/clientAddContactPage");
  };

  onRoleChange = async (data) => {
    // console.log(">>>>>>>>", typeof data.value.toString());

    this.setState({
      filterRoleData: data,
    });
  };
  onFilterStatusChange = (dat) => {
    this.setState({
      selectedStatus: dat,
    });
  };

  onClientChange = async (data) => {
    let indusObj = {},
      location = [],
      deptArr = [],
      deptInfo = [];
    let deptObj = {
      clientid: data.value.toString(),
    };

    let deptRes = await ApiCall("fetchselectedclientdeptinfo", deptObj);
    // console.log("Payload data>>>", deptRes);
    if (
      deptRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      deptRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(deptRes.data.payload);
      // console.log("payload::::::::::", payload);
      deptInfo = payload.data.deptinfo;
      location = payload.data.location;

      for (let i = 0; i < deptInfo.length; i++) {
        deptArr.push({
          label: deptInfo[i].department,
          value: deptInfo[i].deptid,
        });
      }
    }
    this.setState({
      clientData: data,
      departmentArr: deptArr,
    });
  };
  onDepartmentChange = (data) => {
    this.setState({
      departmentData: data,
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
  editPage = () => {
    this.props.history.push({
      pathname: "/adminEditTrainingCourse",
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
    // window.$("#delete-modal").modal("hide");
    this.closeModal();
  };

  deleteItem = async () => {
    let data = {
      clientcontactid: this.state.listData[this.state.curIndex].clientcontactid,
      status: 2,
    };
    // console.log(">>>>>>>>>>dataaaa::", JSON.stringify(data));
    let status = await ApiCall("modifyapprovedclientcontactstatus", data);
    console.log(">>>>>>>>>status:", status);

    // window.$("#delete-modal").modal("hide");
    this.closeModal();
    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.load();
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

    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      clientcontactname: this.state.name,
      email: this.state.email,
      mobile: this.state.mobile,
      orderby: "",
      direc: "",
      searchto:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom:
        this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      clientid:
        this.state.clientData.value === null ||
        this.state.clientData.value === undefined
          ? ""
          : this.state.clientData.value,
      roleid:
        this.state.filterRoleData.value === null ||
        this.state.filterRoleData.value === undefined
          ? ""
          : this.state.filterRoleData.value,
      departmentid:
        this.state.departmentData.value === null ||
        this.state.departmentData.value === undefined
          ? ""
          : this.state.departmentData.value,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
    };
    let returnData = Object.assign(reqData, fetchData);

    // let data = {
    //   limit: JSON.stringify(this.state.limit),
    //   offset: "0",

    //   clientcontactname: this.state.name,
    //   email: this.state.email,
    //   mobile: this.state.mobile,
    //   orderby: "",
    //   direc: "",
    //   searchto: "",
    //   searchfrom: "",
    //   clientid: "",
    //   roleid: "",
    //   departmentid: "",
    //   status: "",
    // };
    this.listApi(returnData);
  };

  // This is goes to the last page
  exRigth = () => {
    let totalPage = this.state.total_page;
    this.setState({
      current_page: parseInt(totalPage),
    });

    let fetchData = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit),
      clientcontactname: this.state.name,
      email: this.state.email,
      mobile: this.state.mobile,
      orderby: "",
      direc: "",
      searchto:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom:
        this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      clientid:
        this.state.clientData.value === null ||
        this.state.clientData.value === undefined
          ? ""
          : this.state.clientData.value,
      roleid:
        this.state.filterRoleData.value === null ||
        this.state.filterRoleData.value === undefined
          ? ""
          : this.state.filterRoleData.value,
      departmentid:
        this.state.departmentData.value === null ||
        this.state.departmentData.value === undefined
          ? ""
          : this.state.departmentData.value,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
    };
    let returnData = Object.assign(reqData, fetchData);

    // let data = {
    //   limit: JSON.stringify(this.state.limit),
    //   offset: JSON.stringify((totalPage - 1) * this.state.limit),

    //   clientcontactname: this.state.name,
    //   email: this.state.email,
    //   mobile: this.state.mobile,
    //   orderby: "",
    //   direc: "",
    //   searchto: "",
    //   searchfrom: "",
    //   clientid: "",
    //   roleid: "",
    //   departmentid: "",
    //   status: "",
    // };
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
        clientcontactname: this.state.name,
        email: this.state.email,
        mobile: this.state.mobile,
        orderby: "",
        direc: "",
        searchto:
          this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchfrom:
          this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        clientid:
          this.state.clientData.value === null ||
          this.state.clientData.value === undefined
            ? ""
            : this.state.clientData.value,
        roleid:
          this.state.filterRoleData.value === null ||
          this.state.filterRoleData.value === undefined
            ? ""
            : this.state.filterRoleData.value,
        departmentid:
          this.state.departmentData.value === null ||
          this.state.departmentData.value === undefined
            ? ""
            : this.state.departmentData.value,
        status:
          this.state.selectedStatus.value == null ||
          this.state.selectedStatus.value == undefined
            ? ""
            : this.state.selectedStatus.value,
      };
      let returnData = Object.assign(reqData, fetchData);

      // let data = {
      //   limit: JSON.stringify(this.state.limit),
      //   offset: JSON.stringify((currentPage - 1) * this.state.limit),

      //   clientcontactname: this.state.name,
      //   email: this.state.email,
      //   mobile: this.state.mobile,
      //   orderby: "",
      //   direc: "",
      //   searchto: "",
      //   searchfrom: "",
      //   clientid: "",
      //   roleid: "",
      //   departmentid: "",
      //   status: "",
      // };
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
        clientcontactname: this.state.name,
        email: this.state.email,
        mobile: this.state.mobile,
        orderby: "",
        direc: "",
        searchto:
          this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
        searchfrom:
          this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
        clientid:
          this.state.clientData.value === null ||
          this.state.clientData.value === undefined
            ? ""
            : this.state.clientData.value,
        roleid:
          this.state.filterRoleData.value === null ||
          this.state.filterRoleData.value === undefined
            ? ""
            : this.state.filterRoleData.value,
        departmentid:
          this.state.departmentData.value === null ||
          this.state.departmentData.value === undefined
            ? ""
            : this.state.departmentData.value,
        status:
          this.state.selectedStatus.value == null ||
          this.state.selectedStatus.value == undefined
            ? ""
            : this.state.selectedStatus.value,
      };
      let returnData = Object.assign(reqData, fetchData);

      // let data = {
      //   limit: JSON.stringify(this.state.limit),
      //   offset: JSON.stringify((currentPage - 1) * this.state.limit),

      //   clientcontactname: this.state.name,
      //   email: this.state.email,
      //   mobile: this.state.mobile,
      //   orderby: "",
      //   direc: "",
      //   searchto: "",
      //   searchfrom: "",
      //   clientid: "",
      //   roleid: "",
      //   departmentid: "",
      //   status: "",
      // };
      this.listApi(returnData);
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
      clientcontactid: arrData[index].clientcontactid,
      status: stat.toString(),
    };

    let status = await ApiCall("modifyapprovedclientcontactstatus", data);

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

  onChangeLimit = (dat) => {
    this.setState({
      limit: dat.value,
      selectedDisplayData: dat,
      current_page: 1,
    });

    let fetchData = {
      limit: dat.value,
      offset: "0",
      clientcontactname: this.state.name,
      email: this.state.email,
      mobile: this.state.mobile,
      orderby: "",
      direc: "",
      searchto:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom:
        this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      clientid:
        this.state.clientData.value === null ||
        this.state.clientData.value === undefined
          ? ""
          : this.state.clientData.value,
      roleid:
        this.state.filterRoleData.value === null ||
        this.state.filterRoleData.value === undefined
          ? ""
          : this.state.filterRoleData.value,
      departmentid:
        this.state.departmentData.value === null ||
        this.state.departmentData.value === undefined
          ? ""
          : this.state.departmentData.value,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
    };
    let returnData = Object.assign(reqData, fetchData);

    this.listApi(returnData);
  };
  // .............filter modal function...................
  openModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("filter-model").style.display = "block";
    document.getElementById("filter-model").classList.add("show");
  };
  openPasswordModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("password-model").style.display = "block";
    document.getElementById("password-model").classList.add("show");
  };
  openDeleteModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("delete-model").style.display = "block";
    document.getElementById("delete-model").classList.add("show");
  };

  closeModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("filter-model").style.display = "none";
    document.getElementById("filter-model").classList.remove("show");
    document.getElementById("password-model").style.display = "none";
    document.getElementById("password-model").classList.remove("show");
    document.getElementById("delete-model").style.display = "none";
    document.getElementById("delete-model").classList.remove("show");
  };

  filterModal = () => {
    this.openModal();
    this.handleMenuClose();
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

  onFilterApply = () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",

      clientcontactname: this.state.name,
      email: this.state.email,
      mobile: this.state.mobile,
      orderby: "",
      direc: "",
      searchto:
        this.state.toDate == "" ? "" : SetDatabaseDateFormat(this.state.toDate),
      searchfrom:
        this.state.formDate == "" ? "" : SetDatabaseDateFormat(this.state.formDate),
      clientid:
        this.state.clientData.value === null ||
        this.state.clientData.value === undefined
          ? ""
          : this.state.clientData.value,
      roleid:
        this.state.filterRoleData.value === null ||
        this.state.filterRoleData.value === undefined
          ? ""
          : this.state.filterRoleData.value,
      departmentid:
        this.state.departmentData.value === null ||
        this.state.departmentData.value === undefined
          ? ""
          : this.state.departmentData.value,
      status:
        this.state.selectedStatus.value == null ||
        this.state.selectedStatus.value == undefined
          ? ""
          : this.state.selectedStatus.value,
    };

    this.closeModal();
    this.listApi(data);

    this.setState({
      current_page: 1,
    });
  };

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: "",
      name: "",
      email: "",
      mobile: "",
      clientData: {},
      filterRoleData: {},
      departmentData: {},
      selectedStatus: {},
    });
    this.closeModal();
    this.load();
  };
  goEdit = () => {
    this.props.history.push({
      pathname: "/clientEditContactPage",
      state: this.state.listData[this.state.curIndex],
    });
  };

  handleReset = () => {
    let mainPass = passWordRandomGenerate();
    consoleLog("mainpass", mainPass);
    this.setState({
      resetPasswordData:mainPass
    })
    this.handleMenuClose();
    this.openPasswordModal();
  };
  handleDelete = () => {
    this.handleMenuClose();
    this.openDeleteModal();
  };
  //............Reset Password...........

  onResetPassword = async () => {
    

    let errorCount = 0;

    let validatePassword = passwordValidator(this.state.resetPasswordData)

    if (validatePassword.status === false) {
      toast.error(validatePassword.message, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // let pass = this.randomString(10, "aA#!");

    if(errorCount === 0) {
      
      let data = {
        staffid: this.state.listData[this.state.curIndex].clientcontactid,
        password: this.state.resetPasswordData,
      };
  
      let status = await ApiCall("userpasswordreset", data);
      if (
        status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        this.closeModal();
        toast.success(AlertMessage.MESSAGE.PASSWORD.RESET_SUCCESS);
      }
    }
   
  };
  //........ No Delete .......

  cancelDelete = () => {
    // window.$("#status-model").modal("hide");
    this.closeModal();
  };

  onResetPassChange = (e) => {
    this.setState({
      resetPasswordData: e.target.value,
    });
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    const open1 = Boolean(this.state.anchorEl1);
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
              <Link to="/clientDashboard">Dashboard</Link> / Client Contacts
            </div>
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
                        Name
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
                        Email
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
                        Phone No
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
                <a href="javascript:void(0)" onClick={this.filterModal}>
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
                    <th style={{ width: "10%" }}>Name</th>
                    <th style={{ width: "15%" }}>Email</th>

                    <th style={{ width: "8%" }}>Phone Number</th>

                    <th style={{ width: "8%" }}>Role</th>
                    <th style={{ width: "12%" }}>Department(s)</th>
                    <th style={{ width: "7%" }}> No. of Jobs</th>
                    <th style={{ width: "10%" }}> Approved By</th>
                    <th style={{ width: "12%" }}> Last Modified on</th>
                    <th style={{ width: "10%" }}>Status</th>
                    <th style={{ width: "5%" }}>Action</th>
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
                                  <td style={{ width: "10%" }}>{item.name}</td>
                                  {item.email.length > 20 ? (
                                    <td
                                      style={{ width: "15%" }}
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title={item.email}
                                    >
                                      {textTruncate(item.email, 20)}
                                    </td>
                                  ) : (
                                    <td style={{ width: "15%" }}>
                                      {textTruncate(item.email, 20)}
                                    </td>
                                  )}
                                  {/* <td style={{ width: "8%" }}>{item.clientId}</td> */}
                                  <td style={{ width: "8%" }}>
                                   
                                    {item.mobile == null || item.mobile == undefined || item.mobile == "" ? "N/A" : "+" + item.countrycode + " " + item.mobile}
                                   
                                    {/* {item.duration} {item.durationUnit} */}
                                  </td>
                                  {/* <td style={{ width: "10%" }}>{item.user}</td> */}
                                  <td style={{ width: "8%" }}>
                                    {item.roleName}
                                  </td>
                                  <td style={{ width: "12%" }}>
                                    {item.departmentName === null ||
                                    item.departmentName === undefined ||
                                    item.departmentName === ""
                                      ? "N/A"
                                      : item.departmentName}
                                  </td>
                                  <td style={{ width: "7%" }}>1</td>
                                  <td style={{ width: "10%" }}>
                                    {item.approvedBy}
                                  </td>
                                  <td style={{ width: "12%" }}>
                                    {SetDateFormat(item.createDate)} |{" "}
                                    {SetTimeFormat(item.createDate)}
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
                                            onClick={() =>
                                              this.onStatusChange(key)
                                            }
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
                                            onClick={() =>
                                              this.onStatusChange(key)
                                            }
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
                                        {item.status === 1
                                          ? "ACTIVE"
                                          : "INACTIVE"}
                                      </FormHelperText>
                                    </FormControl>
                                  </td>

                                  <td style={{ width: "5%" }}>
                                    <img
                                      src={ImageName.IMAGE_NAME.MENU_VERTICAL}
                                      style={{ cursor: "pointer" }}
                                      id={"basic-button" + key}
                                      aria-controls={"basic-menu" + key}
                                      aria-haspopup="true"
                                      aria-expanded={open ? "true" : undefined}
                                      onClick={(e) =>
                                        this.menuBtnhandleClick(key, e)
                                      }
                                    />
                                    <StyledMenu
                                      id={"basic-menu" + key}
                                      anchorEl={this.state.anchorEl}
                                      open={open}
                                      onClose={this.handleMenuClose}
                                      MenuListProps={{
                                        "aria-labelledby": "basic-button" + key,
                                      }}
                                    >
                                      <MenuItem onClick={() => this.goEdit()}>
                                        Edit
                                      </MenuItem>
                                      <MenuItem onClick={this.handleReset}>
                                        Reset Password
                                      </MenuItem>
                                      {/* <MenuItem>View Jobs</MenuItem>
                                      <MenuItem>View Projects</MenuItem>

                                      <MenuItem>View Invoices</MenuItem>
                                      <MenuItem>Chat</MenuItem> */}
                                      <MenuItem onClick={this.handleDelete}>
                                        Delete
                                      </MenuItem>
                                      {/* <MenuItem
                                    onClick={() => this.onStatusModal()}
                                  >
                                    De-Activate or Activate
                                  </MenuItem> */}
                                    </StyledMenu>
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
          </div>
        </div>
        {/* ..................modal................................. */}
        <div id="filter-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered">
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
                      {/* <input
                        type="date"
                        className="datefield bd"
                        placeholder="10/25/2021"
                        value={this.state.formDate}
                        onChange={this.formDateChange}
                      /> */}
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
                      {/* <input
                        type="date"
                        className="datefield bd"
                        placeholder="10/25/2021"
                        value={this.state.toDate}
                        onChange={this.toDateChange}
                      /> */}
                    </div>
                  </div>
                  <div className="m-select _fl">
                    <div class="row">
                      {/* <div class="col-md-5">
                        <div class="sf-row">
                          <div class="lable-text" style={{ fontSize: "12px" }}>
                            Department
                          </div>
                          <div
                            class="dropdwn"
                            style={{
                              cursor: "pointer",
                              width: "65%",
                              marginLeft: "100px",
                            }}
                          >
                            <Select
                              styles={customStyles}
                              options={this.state.departmentArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.departmentData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onDepartmentChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-1"></div> */}
                      <div class="col-md-5">
                        <div class="sf-row">
                          <div class="lable-text" style={{ fontSize: "13px" }}>
                            Role
                          </div>
                          <div class="dropdwn" style={{ cursor: "pointer" }}>
                            <Select
                              styles={customStyles}
                              options={this.state.filterRoleArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.filterRoleData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onRoleChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div class="sf-row">
                          <div class="lable-text">Status</div>

                          <div class="dropdwn" style={{ marginLeft: "87px" }}>
                            <SelectBox
                              optionData={statusArrData}
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
                    {/* <div className="row" style={{ marginTop: "20px" }}>
                      <div class="col-md-5">
                        <div class="sf-row">
                          <div class="lable-text" style={{ fontSize: "12px" }}>
                            Department
                          </div>
                          <div
                            class="dropdwn"
                            style={{
                              cursor: "pointer",
                              width: "65%",
                              marginLeft: "100px",
                            }}
                          >
                            <Select
                              styles={customStyles}
                              options={this.state.departmentArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.departmentData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onDepartmentChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ...........................delete modal.............................. */}
        </div>
        {/* ..............................delete modal............................. */}
        <div id="delete-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content" style={{ padding: "10px" }}>
              <div className="delete-head">Delete contact</div>
              <div className="modal-body">
                <div className="body-txt">
                  Are You Sure to delete the contact?
                </div>

                <div className="_button-style m30 _fl text-center">
                  <a
                    href="javascript:void(0)"
                    className="white-btn"
                    style={{ textDecoration: "none", color: "grey" }}
                    onClick={this.onCancel}
                  >
                    NO
                  </a>
                  <a
                    href="javascript:void(0)"
                    className="blue-btn"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      width: "10%",
                    }}
                    onClick={() => this.deleteItem()}
                  >
                    Yes
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ..................Reset Password modal................................. */}
        <div
          id="password-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="modal-body">
                {/* <div className="model-info f-model"> */}
                <div className="form-search-app">
                  <center>
                    <h6>
                      Are you really want to reset the password for selected
                      user?{" "}
                    </h6>
                  </center>
                  <div className="row" style={{ marginTop: "20px" }}>
                    <center>
                      <div className="col-md-6">
                        <input

                          className="inputfield"
                          value={this.state.resetPasswordData}
                          onChange={(e) =>
                            this.onResetPassChange(e)
                          }
                        />
                      </div>
                    </center>
                  </div>
                  <div className="row">
                    <div className="col-md-4"></div>
                    <div
                      class="_button-style _fl text-center"
                      style={{ marginTop: "2%" }}
                    >
                      <a
                        href="javascript:void(0)"
                        className="white-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.cancelDelete}
                      >
                        No
                      </a>
                      <a
                        href="javascript:void(0)"
                        className="blue-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.onResetPassword}
                      >
                        Yes
                      </a>
                    </div>
                    <div className="col-md-4"></div>
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
