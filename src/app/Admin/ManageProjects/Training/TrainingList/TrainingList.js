import React, { Component } from "react";
import { styled, Box } from "@mui/system"; //imported for modal
import ModalUnstyled from "@mui/core/ModalUnstyled"; //imported forr modal
import FormControl from "@mui/material/FormControl";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import history from "../../../../../history";
import Stack from "@mui/material/Stack";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

import "./trainingList.css";

import { AlertMessage, ImageName } from "../../../../../enums";
import { InputText } from "../../../SharedComponents/inputText";
import { ApiCall } from "../../../../../services/middleware";
import { CryptoDecoder, Decoder } from "../../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";
import {
  SetDateFormat,
  SetTimeFormat,
  textTruncate,
} from "../../../../../services/common-function";
import {
  mobileNumberValidator,
  numberValidator,
  zipValidate,
} from "../../../../../validators";
import { Regex } from "../../../../../services/config";
import Select, { components } from "react-select";

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

export default class TrainingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      current_page: 1,
      total_page: 10,
      limit: 10,
      display: "",
      name: "",
      email: "",
      mobile: "",
      departmentId: "",
      departmentArr: [],
      departmentData: [],
      roleId: "",
      clientId: "",
      clientArr: [],
      clientData: {},
      filterRoleArr: [],
      filterRoleData: {},
      switch: false,
      anchorEl: null, //menu button
      anchorEl1: null, //menu button
      openModal: false, // open decline modal false
      isSelected: 0,

      // listData: [],
      curIndex: 0,
      formDate: "",
      toDate: "",
      filterTrainingCategory: "",
      filterStatus: "",
      departmentData: {
        label: "",
        value: "",
      },
      clientData: { label: "", value: "" },
      filterRoleData: { label: "", value: "" },

      listData: [
        {
          projectId: "123456",
          client: "j p hospital",
          requester: "David Jones",
          requirement: "Translation",
          trainingCategory: "Medical",
          startDate: "13th March,2020",
          endDate: "13th March,2020",
          totalDuration: "30",
          vendors: "3",
          status: 0,
        },
        {
          projectId: "123456",
          client: "j p hospital",
          requester: "David Jones",
          requirement: "Translation",
          trainingCategory: "Medical",
          startDate: "13th March,2020",
          endDate: "13th March,2020",
          totalDuration: "30",
          vendors: "3",
          status: 1,
        },
        {
          projectId: "123456",
          client: "j p hospital",
          requester: "David Jones",
          requirement: "Translation",
          trainingCategory: "Medical",
          startDate: "13th March,2020",
          endDate: "13th March,2020",
          totalDuration: "30",
          vendors: "3",
          status: 2,
        },
        {
          projectId: "123456",
          client: "j p hospital",
          requester: "David Jones",
          requirement: "Translation",
          trainingCategory: "Medical",
          startDate: "13th March,2020",
          endDate: "13th March,2020",
          totalDuration: "30",
          vendors: "3",
          status: 3,
        },
        {
          projectId: "123456",
          client: "j p hospital",
          requester: "David Jones",
          requirement: "Translation",
          trainingCategory: "Medical",
          startDate: "13th March,2020",
          endDate: "13th March,2020",
          totalDuration: "30",
          vendors: "3",
          status: 4,
        },
        {
          projectId: "123456",
          client: "j p hospital",
          requester: "David Jones",
          requirement: "Translation",
          trainingCategory: "Medical",
          startDate: "13th March,2020",
          endDate: "13th March,2020",
          totalDuration: "30",
          vendors: "3",
          status: 5,
        },
        {
          projectId: "123456",
          client: "j p hospital",
          requester: "David Jones",
          requirement: "Translation",
          trainingCategory: "Medical",
          startDate: "13th March,2020",
          endDate: "13th March,2020",
          totalDuration: "30",
          vendors: "3",
          status: 6,
        },
      ],
      historyData: [
        {
          quoteId: "123",
          projectId: "123456",
          client: "j p hospital",
          requester: "David Jones",
          serviceType: "Translation",
          expectedDeadline: "13th March,2020",
          sourceLang: "Mexican",
          targetLang: "spanish",
          teamSize: "3",
          noOfDocs: "10",
          lastModified: "13th March,2020",
          status: 9,
        },
        {
          quoteId: "123",
          projectId: "123456",
          client: "j p hospital",
          requester: "David Jones",
          serviceType: "Translation",
          expectedDeadline: "13th March,2020",
          sourceLang: "Mexican",
          targetLang: "spanish",
          teamSize: "3",
          noOfDocs: "10",
          lastModified: "13th March,2020",
          status: 9,
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
        // classInstance.load();
      },
    });

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

    // this.load();
  }

  load = async () => {
    let roleDataArr = [],
      clientDataArr = [];
    let data = {
      clientcontactname: "",
      email: "",
      mobile: "",
      direc: "",
      orderby: "",
      searchto: "",
      searchfrom: "",
      clientid: "",
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      status: "",
      roleid: "",
      departmentid: "",
    };
    this.listApi(data);

    let lookupres = await ApiCall("getLookUpData");
    if (
      lookupres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      lookupres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(lookupres.data.payload);
      console.log("payload::::::::::", payload);

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
        filterRoleArr: roleDataArr,
        clientArr: clientDataArr,
      });
    }
  };

  //   listApi = async (data) => {
  //     const res = await ApiCall("fetchapprovedclientcontactlist", data);
  //     console.log("resData::::", res);
  //     if (
  //       res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
  //       res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  //     ) {
  //       const decodeData = Decoder.decode(res.data.payload);
  //       console.log("Payload data>>>", decodeData);
  //       let listDetails = decodeData.data.clientContactDetailsList;
  //       let totalPage = Math.ceil(decodeData.data.totalCount / this.state.limit);
  //       console.log("Total Page>>>", listDetails);
  //       this.setState({
  //         listData: decodeData.data.clientContactDetailsList,
  //         total_page: totalPage,
  //       });
  //     }
  //   };

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
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: "",
      clientid: "",
      roleid: "",
      departmentid: "",
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
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: "",
      clientid: "",
      roleid: "",
      departmentid: "",
      status: "",
    };

    this.listApi(data);
  };
  onMobileChange = (value) => {
    let val = zipValidate(value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        mobile: val,
      });
      let data = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify(
          (this.state.current_page - 1) * this.state.limit
        ),

        clientcontactname: this.state.name,
        email: this.state.email,
        mobile: value,
        orderby: "",
        direc: "",
        searchto: "",
        searchfrom: "",
        clientid: "",
        roleid: "",
        departmentid: "",
        status: "",
      };

      this.listApi(data);
    }
  };

  onDisplayChange = (e) => {
    this.setState({
      display: e.target.value,
    });
  };
  jobSelect = () => {
    this.setState({
      isSelected: 0,
    });
  };
  historySelect = () => {
    this.setState({
      isSelected: 1,
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
    return history.push("/adminAddClientContact");
  };

  onRoleChange = async (data) => {
    console.log(">>>>>>>>", typeof data.value.toString());

    this.setState({
      filterRoleData: data,
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
    console.log("Payload data>>>", deptRes);
    if (
      deptRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      deptRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(deptRes.data.payload);
      console.log("payload::::::::::", payload);
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
    console.log(">>>>>>>>>>dataaaa::", JSON.stringify(data));
    let status = await ApiCall("modifyapprovedclientcontactstatus", data);
    // console.log(">>>>>>>>>status:", status);

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

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",

      clientcontactname: this.state.name,
      email: this.state.email,
      mobile: this.state.mobile,
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: "",
      clientid: "",
      roleid: "",
      departmentid: "",
      status: "",
    };
    this.listApi(data);
  };

  // This is goes to the last page
  exRigth = () => {
    let totalPage = this.state.total_page;
    this.setState({
      current_page: parseInt(totalPage),
    });

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit),

      clientcontactname: this.state.name,
      email: this.state.email,
      mobile: this.state.mobile,
      orderby: "",
      direc: "",
      searchto: "",
      searchfrom: "",
      clientid: "",
      roleid: "",
      departmentid: "",
      status: "",
    };
    this.listApi(data);
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

        clientcontactname: this.state.name,
        email: this.state.email,
        mobile: this.state.mobile,
        orderby: "",
        direc: "",
        searchto: "",
        searchfrom: "",
        clientid: "",
        roleid: "",
        departmentid: "",
        status: "",
      };
      this.listApi(data);
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

        clientcontactname: this.state.name,
        email: this.state.email,
        mobile: this.state.mobile,
        orderby: "",
        direc: "",
        searchto: "",
        searchfrom: "",
        clientid: "",
        roleid: "",
        departmentid: "",
        status: "",
      };
      this.listApi(data);
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

  onChangeLimit = (e) => {
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

  onFilterRoleChange = (e) => {
    this.setState({
      filterRole: e.target.value,
    });
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
      clientid: this.state.clientData.value,
      roleid: this.state.filterRoleData.value,
      departmentid: this.state.departmentData.value,
      status: "",
    };
    // console.log("}}}}}}}}}}}", data);

    // window.$("#create-filter-model").modal("hide");
    // console.log("Filter data", data);

    this.listApi(data);
    this.closeModal();

    this.setState({
      formDate: "",
      toDate: "",
      filterRoleData: {},
      clientData: {},
      departmentData: {},
    });
  };

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: "",
      clientData: {},
      filterRoleData: {},
      departmentData: {},
    });
  };
  goEdit = () => {
    this.props.history.push({
      pathname: "/adminEditClientContact",
      state: this.state.listData[this.state.curIndex],
    });
  };

  handleReset = () => {
    this.handleMenuClose();
    this.openPasswordModal();
  };
  handleDelete = () => {
    this.handleMenuClose();
    this.openDeleteModal();
  };
  //............Reset Password...........

  onResetPassword = async () => {
    this.closeModal();

    let pass = this.randomString(10, "aA#!");

    let data = {
      staffid: this.state.listData[this.state.curIndex].userId,
      password: pass,
    };

    let status = await ApiCall("userpasswordreset", data);
    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.PASSWORD.RESET_SUCCESS);
    }
  };
  //........ No Delete .......

  cancelDelete = () => {
    // window.$("#status-model").modal("hide");
    this.closeModal();
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    const open1 = Boolean(this.state.anchorEl1);
    return (
      <React.Fragment>
        {/* <div className="wrapper">
        <Header /> */}
        <ToastContainer hideProgressBar />
        {/* <Sidebar /> */}
        <div className="component-wrapper">
          <div className="listing-component-app">
            {/* ............................. */}
            <div role="presentation" style={{ marginBottom: "20px" }}>
              <Breadcrumbs aria-label="breadcrumb">
                {/* <Link underline="hover" color="inherit" href="/">
                  MUI
                </Link> */}
                <Link
                  underline="hover"
                  color="inherit"
                  href="/adminClientContactList"
                >
                  Projects
                </Link>
                <Link
                  underline="hover"
                  color="text.primary"
                  href="/adminTrainingList"
                  aria-current="page"
                >
                  TrainingList
                </Link>
              </Breadcrumbs>
            </div>
            {/* ................................... */}
            <div
              className="vendor-info _fl sdw"
              style={{
                boxShadow: "  0px 0px 3px 0px rgb(0 0 0 / 23%)",
                borderRadius: "20px",
                padding: "opx 30px",
              }}
            >
              <div className="vn-form _fl"></div>
              <div className="vn-form _fl">
                <div className="row">
                  <div className="col-md-6">
                    <div className="vn_frm">
                      <span
                        style={{
                          width: "30%",
                          paddingLeft: "5px",
                          fontSize: "14px",
                        }}
                      >
                        Client
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
                  {/* <div className="col-md-4">
                    <div className="vn_frm">
                      <span
                        style={{
                          width: "30%",
                          paddingLeft: "20px",
                          fontSize: "14px",
                        }}
                      >
                        Email Id
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
                  </div> */}
                  {/* <div className="col-md-4">
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
                  </div> */}
                </div>

                {/* <div class="service-type-tab"> */}
                <div class="row" style={{ marginTop: "20px" }}>
                  {/* <div class="col-md-4">
                    <div class="_fl verificaiton-doc-tab ven">
                      <ul style={{ borderRadius: "10px" }}>
                        <li
                          className="active"
                          // data-related="tble-data-a"
                          onClick={this.jobSelect}
                        >
                          All Jobs
                        </li>
                        <li
                          // data-related="tble-data-b"
                          onClick={this.historySelect}
                        >
                          History
                        </li>
                      </ul>
                    </div>
                  </div> */}
                </div>
                {/* </div> */}
              </div>
            </div>

            {/* ................................... */}
            <div class="table-filter-app">
              <div class="row">
                <div class="col-md-6">
                  <div class="cus-filter-btn btns">
                    {" "}
                    <button class="button_one">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN} />
                    </button>
                    <button class="button_two">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN_ONE} />
                    </button>
                    <button class="button_three">
                      <img src={ImageName.IMAGE_NAME.MENU_BTN_TWO} />
                    </button>
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
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="table-filter-box">
                    <div class="export-btn">
                      <a href="#">
                        Export
                        <img
                          src={ImageName.IMAGE_NAME.EXPORT_BTN}
                          style={{ width: "25px", cursor: "pointer" }}
                          onClick={this.handleExport}
                        />
                      </a>
                    </div>
                    {/* <div class="addnew">
                      <a href="#">
                        Add New
                        <img
                          className=""
                          src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                          style={{ width: "25px", cursor: "pointer" }}
                          onClick={this.addNew}
                        />
                      </a>
                    </div> */}
                    <div class="tble-short">
                      {" "}
                      <span class="lbl">Display</span>
                      <div class="dropdwn">
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

            {/* <div class="tab-app-information activeLnk" id="tble-data-a"> */}
            <div className="table-listing-app">
              <div className="table-responsive_cus table-style-a">
                <table width="100%" border="0" cellPadding="0" cellSpacing="0">
                  <tr>
                    <th style={{ width: "7%" }}>
                      {/* <div class="sorting_btn">
                        <button class="t1" onClick={() => this.ascOrder("subDepartment")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button class="t1" onClick={() => this.descOrder("subDepartment")}>
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      Project Id
                    </th>
                    <th style={{ width: "7%" }}>
                      {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("location")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("location")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      Client
                    </th>

                    <th style={{ width: "7%" }}>
                      {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("client")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("client")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      Requester
                    </th>

                    <th style={{ width: "7%" }}>
                      {/* <div class="sorting_btn">
                        <button
                          class="t1"
                          onClick={() => this.ascOrder("supervisor")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button
                          class="t1"
                          onClick={() => this.descOrder("supervisor")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_DOWN} />
                        </button>
                      </div> */}
                      Requirement
                    </th>
                    <th style={{ width: "8%" }}>Training Category</th>
                    <th style={{ width: "9%" }}>Start Date</th>
                    <th style={{ width: "9%" }}>End Date</th>
                    <th style={{ width: "8%" }}>Total Duration</th>
                    <th style={{ width: "8%" }}>Vendor(s)</th>
                    <th style={{ width: "11%" }}>Status</th>
                    <th style={{ width: "5%" }}>Action</th>
                  </tr>
                  {this.state.listData.map((item, key) => (
                    <tr key={key}>
                      <td colSpan="13">
                        <div className="tble-row_t">
                          <table
                            width="100%"
                            border="0"
                            cellPadding="0"
                            cellSpacing="0"
                          >
                            <tr>
                              <td style={{ width: "7%" }}>{item.projectId}</td>

                              <td style={{ width: "7%" }}>{item.client}</td>
                              {/* {item.email.length > 20 ? ( */}

                              {/* ) : ( */}
                              <td style={{ width: "7%" }}>{item.requester}</td>
                              {/* )} */}
                              {/* <td style={{ width: "8%" }}>{item.clientId}</td> */}
                              <td style={{ width: "7%" }}>
                                {item.requirement}
                                {/* {item.duration} {item.durationUnit} */}
                              </td>
                              {/* <td style={{ width: "10%" }}>{item.user}</td> */}
                              <td style={{ width: "8%" }}>
                                {item.trainingCategory}
                              </td>
                              <td style={{ width: "9%" }}>{item.startDate}</td>
                              <td style={{ width: "9%" }}> {item.endDate}</td>
                              <td style={{ width: "8%" }}>
                                {" "}
                                {item.totalDuration}
                              </td>
                              <td style={{ width: "8%" }}> {item.vendors}</td>

                              <td style={{ width: "11%" }}>
                                {item.status === 0 ? (
                                  <React.Fragment>
                                    <span class="progress-btn sky">
                                      Pending
                                    </span>
                                  </React.Fragment>
                                ) : item.status === 1 ? (
                                  <React.Fragment>
                                    <span href="#" class="progress-btn yellow">
                                      Quote Sent
                                    </span>
                                  </React.Fragment>
                                ) : item.status === 2 ? (
                                  <React.Fragment>
                                    <span href="#" class="progress-btn green">
                                      Quote Accepted
                                    </span>
                                  </React.Fragment>
                                ) : item.status === 3 ? (
                                  <React.Fragment>
                                    <span href="#" class="progress-btn blue">
                                      offer Sent
                                    </span>
                                  </React.Fragment>
                                ) : item.status === 4 ? (
                                  <React.Fragment>
                                    <span href="#" class="progress-btn green">
                                      Bids received
                                    </span>
                                  </React.Fragment>
                                ) : item.status === 5 ? (
                                  <React.Fragment>
                                    <span href="#" class="progress-btn blue">
                                      Assined
                                    </span>
                                  </React.Fragment>
                                ) : item.status === 6 ? (
                                  <React.Fragment>
                                    <span href="#" class="progress-btn yellow">
                                      in progress
                                    </span>
                                  </React.Fragment>
                                ) : item.status === 7 ? (
                                  <React.Fragment>
                                    <span href="#" class="progress-btn grey">
                                      review
                                    </span>
                                  </React.Fragment>
                                ) : item.status === 8 ? (
                                  <React.Fragment>
                                    <span href="#" class="progress-btn green">
                                      Completed
                                    </span>
                                  </React.Fragment>
                                ) : item.status === 9 ? (
                                  <React.Fragment>
                                    <span
                                      href="#"
                                      class="progress-btn deep_grey"
                                    >
                                      cancel
                                    </span>
                                  </React.Fragment>
                                ) : (
                                  <React.Fragment></React.Fragment>
                                )}
                              </td>

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
                                  <MenuItem onClick={() => this.goEdit()}>
                                    View
                                  </MenuItem>
                                  {/* <MenuItem onClick={this.handleReset}>
                                    Assign/Reassign Vendor
                                  </MenuItem>
                                  <MenuItem>Documents</MenuItem>
                                  <MenuItem>Cancel</MenuItem> */}

                                  {/* <MenuItem>Chat</MenuItem>
                                  <MenuItem onClick={this.handleDelete}>
                                    Delete
                                  </MenuItem> */}
                                  {/* <MenuItem
                                    onClick={() => this.onStatusModal()}
                                  >
                                    De-Activate or Activate
                                  </MenuItem> */}
                                </Menu>
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

            {/* <div class="tab-app-information activeLnk" id="tble-data-b">
              History
            </div> */}

            {/* ............................................................... */}
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
                      <div class="col-md-5">
                        <div class="sf-row">
                          <div class="lable-text" style={{ fontSize: "13px" }}>
                            Client
                          </div>
                          <div class="dropdwn" style={{ cursor: "pointer" }}>
                            <Select
                              styles={customStyles}
                              options={this.state.clientArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.clientData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onClientChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-1"></div>
                      <div class="col-md-6">
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
                    </div>
                    <div className="row" style={{ marginTop: "20px" }}>
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
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          {/* ...........................delete modal.............................. */}
        </div>
        {/* ..............................delete modal............................. */}
        <div id="delete-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div className="modal-content" style={{ padding: "10px" }}>
              <div className="delete-head">Delete contact</div>
              <div className="modal-body">
                <div className="body-txt">
                  Are You Sure to delete the contact?
                </div>

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
                      width: "10%",
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
        {/* ..................Reset Password modal................................. */}
        <div
          id="password-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
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
                  <div className="row">
                    <div className="col-md-4"></div>
                    <div
                      class="_button-style _fl text-center"
                      style={{ marginTop: "2%" }}
                    >
                      <a
                        className="white-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.cancelDelete}
                      >
                        No
                      </a>
                      <a
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
