import React, { Component } from "react";
import { styled, Box } from "@mui/system"; //imported for modal
// import ModalUnstyled from "@mui/core/ModalUnstyled"; //imported forr modal
// import FormControl from "@mui/material/FormControl";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
import history from "../../../../history";
// import Stack from "@mui/material/Stack";
// import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";

import { AlertMessage, ImageName } from "../../../../enums";
// import { InputText } from "../../../SharedComponents/inputText";
import { ApiCall } from "../../../../services/middleware";
import { CryptoDecoder, Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";
// import {
//   SetDateFormat,
//   SetTimeFormat,
//   textTruncate,
// } from "../../../../../services/common-function";
import {
  mobileNumberValidator,
  numberValidator,
  zipValidate,
} from "../../../../validators";
import { Regex } from "../../../../services/config";
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

const clientArr = [
  {
    label: "J p Hospital",
    value: "1",
  },
  {
    label: "Tagore Hospital",
    value: "2",
  },
];
const taskArr = [
  {
    label: "Translation & Proof Reading",
    value: "1",
  },
  {
    label: "Editing",
    value: "2",
  },
  {
    label: "Desktop Publishing",
    value: "3",
  },
  {
    label: "Formatting",
    value: "4",
  },
];
const statusArr = [
  {
    label: "Pending",
    value: "1",
  },
  {
    label: "Quote Sent",
    value: "2",
  },
  {
    label: "Quote Accepted",
    value: "3",
  },
  {
    label: "Offer Sent",
    value: "4",
  },
  {
    label: "Bids Received",
    value: "5",
  },
  {
    label: "Quote Rejected",
    value: "6",
  },
  {
    label: "Assigned In",
    value: "7",
  },
  {
    label: "Progress",
    value: "8",
  },
  {
    label: "Review",
    value: "9",
  },
  {
    label: "Completed",
    value: "10",
  },
];

export default class CreateOfferPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,

      switch: false,
      anchorEl: null, //menu button
      anchorEl1: null, //menu button
      openModal: false, // open decline modal false
      isSelected: 0,
      task: "",
      vendors: "",
      // listData: [],
      curIndex: 0,
      formDate: "",
      toDate: "",
      filterTrainingCategory: "",
      filterStatus: "",
      languageArr: [],
      languageData: {},
      listData: [],
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

    var taskData = [
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
    window.$(".myDropdown_task").ddslick({
      data: taskData,
      onSelected: function (data) {
        var statusData = window.$(".myDropdown_task").data("ddslick");

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

    this.load();
  }

  load = async () => {
    let roleDataArr = [],
      clientDataArr = [],
      languageResArrData = [],
      languageObjData = {},
      languageArrData = [];

    // this.listApi(data);

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
        languageArr: languageArrData,
        languageData: languageObjData,
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
  onVendorChange = (e) => {
    this.setState({
      vendors: e.target.value,
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
  onChangeTask = (e) => {
    this.setState({
      task: parseInt(e.target.value),
    });
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
      statusData: {},
      taskData: {},
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

  onClientChange = async (data) => {
    this.setState({
      clientData: data,
    });
  };
  onLanguageChange = (data) => {
    this.setState({
      languageData: data,
    });
  };

  onTaskChange = (data) => {
    this.setState({
      taskData: data,
    });
  };
  onFilterStatusChange = (data) => {
    this.setState({
      statusData: data,
    });
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
          <div className="create-offer sdw _fl p25">
            <h2>
              {/* view */}
              CREATE OFFER
              <div className="msd-col-row">
                <div className="row">
                  <div className="col-6 col-md-4">
                    <h4>Project Id</h4>
                    <p>123456</p>
                  </div>
                  <div className="col-6 col-md-4">
                    <h4>Target Audience</h4>
                    <p>Patients,Accountant</p>
                  </div>
                  <div className="col-6 col-md-4">
                    <h4>Expected Deadline</h4>
                    <p>15th June,2021</p>
                  </div>
                </div>
              </div>
              {/* project details */}
            </h2>

            <div className="msd-col-row">
              <div className="row">
                <div className="col-md-12">
                  <h4>Discription</h4>
                  <p>
                    Kindly check both milestones,added bellow.We need two
                    different sets of Translations
                  </p>
                </div>
              </div>
            </div>
            <div className="msd-col-row">
              <div className="_fl">
                <h2>Translation</h2>
              </div>
              <div className="_fl">
                <div className="row">
                  <div className="col-6 col-md-2">
                    <h4>Source Language</h4>
                    <p>English</p>
                  </div>
                  <div className="col-6 col-md-2">
                    <h4>Target Language</h4>
                    <p>Chinese,Arabic,Hindi</p>
                  </div>
                  <div className="col-6 col-md-2">
                    <h4>Document Name</h4>
                    <p>Doc1,Doc2,Doc3</p>
                  </div>
                  <div className="col-6 col-md-2">
                    <h4>Word Count</h4>
                    <p>1000</p>
                  </div>
                  <div className="col-6 col-md-2">
                    <h4>Word Count</h4>
                    <p style={{ paddingLeft: "15%" }}>
                      <a href="#">
                        <img
                          src={ImageName.IMAGE_NAME.EYE_BTN}
                          style={{ width: "25px" }}
                        />
                      </a>
                    </p>
                  </div>
                  <div className="col-6 col-md-2">
                    <h4>Source file</h4>
                    <p style={{ paddingLeft: "10%" }}>
                      <a href="#">
                        <img src={ImageName.IMAGE_NAME.DOWNLOAD_ICON} />
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="msd-col-row">
              <div className="_fl">
                <h2>Voice Over</h2>
              </div>
              <div className="_fl">
                <div className="row">
                  <div className="col-6 col-md-2">
                    <h4>Source Language</h4>
                    <p>English</p>
                  </div>
                  <div className="col-6 col-md-2">
                    <h4>Target Language</h4>
                    <p>Chinese,Arabic,Hindi</p>
                  </div>
                  <div className="col-6 col-md-2">
                    <h4>Document Name</h4>
                    <p>Doc1,Doc2,Doc3</p>
                  </div>
                  <div className="col-6 col-md-2">
                    <h4>Word Count</h4>
                    <p>1000</p>
                  </div>
                  <div className="col-6 col-md-2">
                    <h4>Word Count</h4>
                    <p style={{ paddingLeft: "15%" }}>
                      <a href="#">
                        <img
                          src={ImageName.IMAGE_NAME.EYE_BTN}
                          style={{ width: "25px" }}
                        />
                      </a>
                    </p>
                  </div>
                  <div className="col-6 col-md-2">
                    <h4>Source file</h4>
                    <p style={{ paddingLeft: "10%" }}>
                      <a href="#">
                        <img src={ImageName.IMAGE_NAME.DOWNLOAD_ICON} />
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="msd-col-row">
              <div className="_fl">
                <h2 className="inline-text_">Task Detail</h2>

                <div className="dropdwn md5">
                  <select
                    className="myDropdown_task frm4-select"
                    onChange={this.onChangeTask}
                  ></select>
                </div>
              </div>
              <div className="table-listing-app">
                <div className="depr_table">
                  <div className="table-responsive">
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                    >
                      <tr>
                        <th style={{ width: "5%" }}>
                          <label className="custom_check2">
                            <input type="checkbox" />
                            <span className="checkmark2"></span>
                          </label>
                        </th>
                        <th style={{ width: "15%" }}>Source</th>
                        <th style={{ width: "15%" }}>Source Language</th>
                        <th style={{ width: "15%" }}>Target Language</th>
                        <th style={{ width: "10%" }}>Start Date</th>
                        <th style={{ width: "10%" }}>End Date</th>
                        <th style={{ width: "10%" }}>Document</th>
                        <th style={{ width: "20%" }}>Selectoin Vendor</th>
                      </tr>
                      <tr>
                        <td>
                          <label class="custom_check2">
                            <input type="checkbox" />
                            <span class="checkmark2"></span>
                          </label>
                        </td>
                        <td>Translation</td>
                        <td>
                          <Select
                            styles={customStyles}
                            options={this.state.languageArr}
                            components={{
                              DropdownIndicator,
                              IndicatorSeparator: () => null,
                            }}
                            value={this.state.languageData}
                            placeholder="Select"
                            onChange={(value) => {
                              this.onLanguageChange(value);
                            }}
                          />
                        </td>
                        <td>Hindi</td>
                        <td>20/5/2021</td>
                        <td>20/5/2021</td>
                        <td>
                          <a href="#">Doc1</a>
                          <a href="#">Doc1</a>
                        </td>
                        <td>Vendor 1,Vendor 2,Vendor 3</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="addmore_service text-center">
              <a href="#" style={{ textDecoration: "none" }}>
                Add More Service
              </a>
            </div>

            <div className="_button-style m30 _fl text-center">
              <a
                href="#"
                className="white-btn"
                style={{ textDecoration: "none" }}
              >
                Reset
              </a>
              <a
                href="#"
                className="blue-btn"
                style={{ textDecoration: "none" }}
              >
                Next
              </a>
            </div>

            <div className="vn-form _vns _fl">
              <div className="row">
                <div className="col-md-6">
                  <div className="vn_frm">
                    <span>Vendor(s)</span>
                    <input
                      type="text"
                      value={this.state.vendors}
                      name=""
                      placeholder="Search"
                      class="inputfield"
                      onChange={this.onVendorChange}
                    />
                    <a
                      href="#"
                      className="blue-btn_"
                      style={{ textDecoration: "none" }}
                    >
                      Send
                    </a>
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
                  {/* <div className="form-search-app">
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
                  </div> */}
                  <div className="m-select _fl">
                    <div class="row">
                      <div class="col-md-5">
                        <div class="sf-row">
                          <div class="lable-text" style={{ fontSize: "13px" }}>
                            TASK(S)
                          </div>
                          <div class="dropdwn" style={{ cursor: "pointer" }}>
                            <Select
                              styles={customStyles}
                              options={taskArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.taskData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onTaskChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-1"></div>
                      <div class="col-md-6">
                        <div class="sf-row">
                          <div class="lable-text" style={{ fontSize: "13px" }}>
                            STATUS
                          </div>
                          <div class="dropdwn" style={{ cursor: "pointer" }}>
                            <Select
                              styles={customStyles}
                              options={statusArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.statusData}
                              placeholder="Select"
                              onChange={(value) => {
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
