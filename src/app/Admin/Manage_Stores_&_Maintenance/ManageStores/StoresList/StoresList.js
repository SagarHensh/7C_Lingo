import React from "react";
import "./storeList.css";
import { styled } from "@mui/system"; //imported for modal
import FormControl from "@mui/material/FormControl";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";
import Select, { components } from "react-select";
import {
  InputText,
  PaginationDropdown,
  SelectBox,
} from "../../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../../enums";
import {
  courseFeeValidate,
  mobileNumberValidator,
  numberValidator,
} from "../../../../../validators";
import { ApiCall } from "../../../../../services/middleware";
import { CommonData, ErrorCode } from "../../../../../services/constant";
import { Decoder } from "../../../../../services/auth";
import {
  consoleLog,
  getLookUpDataFromAPI,
  textTruncate,
} from "../../../../../services/common-function";
import history from "../../../../../history";
import { ToastContainer, toast } from "react-toastify";
import { IMAGE_PATH_ONLY } from "../../../../../services/config/api_url";
import { Link } from "react-router-dom";

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={ImageName.IMAGE_NAME.LOCATION} style={{ width: "17px" }} />
    </components.DropdownIndicator>
  );
};

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

export default class StoresList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: 1,
      total_page: 10,
      limit: 20,
      offset: 0,
      curIndex: 0,
      anchorEl: null, //menu button
      listData: [],
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      name: "",
      email: "",
      mobile: "",
      storeTypeArr: [],
      selectedStoreTypeData: "",
      locationData: {},
      locationDataTxt: "",
      locationArr: [],
      status: 0,
      formDate: "",
      toDate: "",
      declineMessage: "",
      storeManager: "",
      selectedStatus: {},
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
    document.getElementById("backdrop").style.display = "none";

    var classInstance = this;

    var modal = document.getElementById("delete-model");
    var filterModal = document.getElementById("filter-model");

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === modal) {
        classInstance.closeDeleteModal();
      } else if (event.target === filterModal) {
        classInstance.closeFilterModal();
      }
    };
  }

  load = async () => {
    let type = [],
      statusDataArr = [];
    let storeArr = [];

    let res = await ApiCall("getlookuplistbylookuptype", {
      lookuptype: "STORE_TYPE",
    });
    let req = {
      name: "",
      location: "",
      email: "",
      mobile: "",
      storeManager: "",
      status: "",
      storeTypeId: "",
      limit: this.state.limit,
      offset: this.state.offset.toString(),
    };

    let decodeData = Decoder.decode(res.data.payload);
    consoleLog("data:::", decodeData);
    let storeData = decodeData.data.lookupdata;

    storeData.map((obj) => {
      storeArr.push({
        label: obj.name,
        value: obj.id,
      });
    });

    this.listApi(req);

    this.setState({
      storeTypeArr: storeArr,
    });
  };

  listApi = async (data) => {
    consoleLog("req data::", data);
    let res = await ApiCall("fetchStoreList", data);
    // consoleLog("listdata::",res)

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(res.data.payload);
      consoleLog("listdata::", payload);
      let totalPage = Math.ceil(payload.data.count / this.state.limit);
      this.setState({
        listData: payload.data.details,
        total_page: totalPage,
      });
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

    let data = {
      limit: this.state.limit,
      offset: this.state.offset.toString(),
      name: this.state.name,
      direc: "",
      orderby: "",
      email: this.state.email,
      mobile: this.state.mobile,
      storeManager: this.state.storeManager,
      status:
        this.state.selectedStatus.value == undefined ||
          this.state.selectedStatus.value == null
          ? ""
          : this.state.selectedStatus.value,
      location:
        this.state.locationDataTxt == undefined ||
          this.state.locationDataTxt == null
          ? ""
          : this.state.locationDataTxt,
      storeTypeId:
        this.state.selectedStoreTypeData.value == undefined ||
          this.state.selectedStoreTypeData.value == null
          ? ""
          : this.state.selectedStoreTypeData.value,
    };
    this.listApi(data);
  };
  exRigth = () => {
    let totalPage = this.state.total_page;
    this.setState({
      current_page: totalPage,
    });

    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((totalPage - 1) * this.state.limit),
      name: this.state.name,
      direc: "",
      orderby: "",
      email: this.state.email,
      mobile: this.state.mobile,
      storeManager: this.state.storeManager,
      status:
        this.state.selectedStatus.value == undefined ||
          this.state.selectedStatus.value == null
          ? ""
          : this.state.selectedStatus.value,
      location:
        this.state.locationDataTxt == undefined ||
          this.state.locationDataTxt == null
          ? ""
          : this.state.locationDataTxt,
      storeTypeId:
        this.state.selectedStoreTypeData.value == undefined ||
          this.state.selectedStoreTypeData.value == null
          ? ""
          : this.state.selectedStoreTypeData.value,
    };
    this.listApi(data);
  };
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
        name: this.state.name,
        direc: "",
        orderby: "",
        email: this.state.email,
        mobile: this.state.mobile,
        storeManager: this.state.storeManager,
        status:
          this.state.selectedStatus.value == undefined ||
            this.state.selectedStatus.value == null
            ? ""
            : this.state.selectedStatus.value,
        location:
          this.state.locationData == undefined ||
            this.state.locationData == null
            ? ""
            : this.state.locationData,
        storeTypeId:
          this.state.selectedStoreTypeData.value == undefined ||
            this.state.selectedStoreTypeData.value == null
            ? ""
            : this.state.selectedStoreTypeData.value,
      };
      this.listApi(data);
    }
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
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((currentPage - 1) * this.state.limit),
      name: this.state.name,
      direc: "",
      orderby: "",
      email: this.state.email,
      mobile: this.state.mobile,
      storeManager: this.state.storeManager,
      status:
        this.state.selectedStatus.value == undefined ||
          this.state.selectedStatus.value == null
          ? ""
          : this.state.selectedStatus.value,
      location:
        this.state.locationDataTxt == undefined ||
          this.state.locationDataTxt == null
          ? ""
          : this.state.locationDataTxt,
      storeTypeId:
        this.state.selectedStoreTypeData.value == undefined ||
          this.state.selectedStoreTypeData.value == null
          ? ""
          : this.state.selectedStoreTypeData.value,
    };
    // consoleLog("****",data)
    this.listApi(data);
  };

  //......Ascending order .........

  ascOrder = (data) => {
    let filter = "";
    if (data === "type") {
      filter = "type";
    } else if (data === "fname") {
      filter = "fName";
    } else if (data === "lname") {
      filter = "lName";
    } else if (data === "agency") {
      filter = "agencyName";
    } else if (data === "email") {
      filter = "email";
    } else if (data === "mobile") {
      filter = "phone";
    }

    let req = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.name,
      email: this.state.email,
      phone: this.state.mobile,
      orderby: filter,
      direc: "ASC",
      searchto: "",
      searchfrom: "",
      type: "",
      status: "",
    };

    this.listApi(req);
  };

  //......Descending order .........

  descOrder = (data) => {
    let filter = "";
    if (data === "type") {
      filter = "type";
    } else if (data === "fname") {
      filter = "fName";
    } else if (data === "lname") {
      filter = "lName";
    } else if (data === "agency") {
      filter = "agencyName";
    } else if (data === "email") {
      filter = "email";
    } else if (data === "mobile") {
      filter = "phone";
    }

    let req = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.name,
      email: this.state.email,
      phone: this.state.mobile,
      orderby: filter,
      direc: "DESC",
      searchto: "",
      searchfrom: "",
      type: "",
      status: "",
    };

    this.listApi(req);
  };
  //................funct for menuBtn on click................
  menuBtnhandleClick = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  //..... for search name......

  onNameChange = (value) => {
    // consoleLog("___",value)
    this.setState({
      name: value,
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: value,
      direc: "",
      orderby: "",
      email: this.state.email,
      mobile: this.state.mobile,
      storeManager: this.state.storeManager,
      status:
        this.state.selectedStatus.value == undefined ||
          this.state.selectedStatus.value == null
          ? ""
          : this.state.selectedStatus.value,
      location:
        this.state.locationDataTxt == undefined ||
          this.state.locationDataTxt == null
          ? ""
          : this.state.locationDataTxt,
      storeTypeId:
        this.state.selectedStoreTypeData.value == undefined ||
          this.state.selectedStoreTypeData.value == null
          ? ""
          : this.state.selectedStoreTypeData.value,
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
      name: this.state.name,
      direc: "",
      orderby: "",
      email: value,
      mobile: this.state.mobile,
      storeManager: this.state.storeManager,
      status:
        this.state.selectedStatus.value == undefined ||
          this.state.selectedStatus.value == null
          ? ""
          : this.state.selectedStatus.value,
      location:
        this.state.locationDataTxt == undefined ||
          this.state.locationDataTxt == null
          ? ""
          : this.state.locationDataTxt,
      storeTypeId:
        this.state.selectedStoreTypeData.value == undefined ||
          this.state.selectedStoreTypeData.value == null
          ? ""
          : this.state.selectedStoreTypeData.value,
    };

    this.listApi(data);
  };
  onMobileChange = (value) => {
    let v = courseFeeValidate(value);
    this.setState({
      mobile: v,
    });
    let data = {
      limit: parseInt(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.name,
      direc: "",
      orderby: "",
      email: this.state.email,
      mobile: value,
      storeManager: this.state.storeManager,
      status:
        this.state.selectedStatus.value == undefined ||
          this.state.selectedStatus.value == null
          ? ""
          : this.state.selectedStatus.value,
      location:
        this.state.locationDataTxt == undefined ||
          this.state.locationDataTxt == null
          ? ""
          : this.state.locationDataTxt,
      storeTypeId:
        this.state.selectedStoreTypeData.value == undefined ||
          this.state.selectedStoreTypeData.value == null
          ? ""
          : this.state.selectedStoreTypeData.value,
    };

    this.listApi(data);
  };

  onManagerChange = (value) => {
    // consoleLog("___",value)
    this.setState({
      storeManager: value,
    });
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      name: this.state.name,


      direc: "",
      orderby: "",
      email: this.state.email,
      mobile: this.state.mobile,
      storeManager: value,

      status:
        this.state.selectedStatus.value == undefined ||
          this.state.selectedStatus.value == null
          ? ""
          : this.state.selectedStatus.value,
      location:
        this.state.locationDataTxt == undefined ||
          this.state.locationDataTxt == null
          ? ""
          : this.state.locationDataTxt,
      storeTypeId:
        this.state.selectedStoreTypeData.value == undefined ||
          this.state.selectedStoreTypeData.value == null
          ? ""
          : this.state.selectedStoreTypeData.value,
    };

    this.listApi(data);
  };

  onLocationInputChange = async (val) => {
    console.log(")))))))))))))))", val);
    let arrData = [];
    let locationData = [];

    if (val.length > 0) {
      let locationRes = await ApiCall("getlocaiondescription", {
        place: val,
      });
      if (
        locationRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        locationRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let locationArr = Decoder.decode(locationRes.data.payload);
        locationData = locationArr.data.locaionsuggesion;
        // console.log("data:::::", locationData);
        for (let i = 0; i < locationData.length; i++) {
          arrData.push({
            label: locationData[i].description,
            value: locationData[i].placeid,
          });
        }

        this.setState({
          locationArr: arrData,
          locationDataTxt: val,
        });
      }
    }
  };

  onLocationChange = (value) => {
    console.log("location value", value)
    this.setState({
      locationData: value,
      locationDataTxt:value.label
    });
  };

  onStoreTypeChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      selectedStoreTypeData: obj,
    });
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
    let data = {
      id: arrData[index].id,
      status: JSON.stringify(stat),
    };
    let res = await ApiCall("changeStatusStore", data);
    if (res.error === 0 && res.respondcode === 200) {
      toast.success(AlertMessage.MESSAGE.UPDATE_STATUS.SUCCESS, {
        hideProgressBar: true,
      });
      arrData[index].status = stat;
      this.setState({
        listData: arrData,
      });
    } else {
      if (
        res.error === 1 &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.INTERNAL_SERVER_ERROR
      ) {
        toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR, {
          hideProgressBar: true,
        });
      }
    }
  };

  openDeleteModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("delete-model").style.display = "block";
    document.getElementById("delete-model").classList.add("show");
  };

  closeDeleteModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("delete-model").style.display = "none";
    document.getElementById("delete-model").classList.remove("show");
  };
  openFilterModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("filter-model").style.display = "block";
    document.getElementById("filter-model").classList.add("show");
  };
  closeFilterModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("filter-model").style.display = "none";
    document.getElementById("filter-model").classList.remove("show");
  };

  // .............filter modal function...................

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
  onFilterStatusChange = (dat) => {
    this.setState({
      selectedStatus: dat,
    });
  };

  onResetFilter = () => {
    this.setState({
      // formDate: "",
      // toDate: "",
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      current_page: 1,
      selectedStoreTypeData: "",
      locationData: "",
      locationDataTxt: ""
    });
    this.closeFilterModal();
    this.load();
  };


  onFilterApply = () => {
    let data = {
      limit: JSON.stringify(this.state.limit),
      offset: "0",
      name: this.state.name,
      status:
        this.state.selectedStatus.value == undefined ||
          this.state.selectedStatus.value == null
          ? ""
          : this.state.selectedStatus.value,
      location:
        this.state.locationDataTxt == undefined ||
          this.state.locationDataTxt == null
          ? ""
          : this.state.locationDataTxt,
      storeTypeId:
        this.state.selectedStoreTypeData.value == undefined ||
          this.state.selectedStoreTypeData.value == null
          ? ""
          : this.state.selectedStoreTypeData.value,
      direc: "",
      orderby: "",
      email: this.state.email,
      mobile: this.state.mobile,
      storeManager: this.state.storeManager,

    };
    consoleLog("filter:::", data)

    // window.$("#create-filter-model").modal("hide");
    this.closeFilterModal();
    // console.log("Filter data", data)

    this.listApi(data);
    this.setState({
      current_page: 1
    });
  };

  onEdit = (item) => {
    this.props.history.push({
      pathname: "/adminEditStore",
      state: this.state.listData[this.state.curIndex],
    });
  };
  onMaintenance = () => {
    this.props.history.push("/adminMaintenanceList");
  };

  onChangeLimit = (dat) => {
    // consoleLog("changelimitmmm:::", dat);
    this.setState({
      limit: parseInt(dat.value),
      selectedDisplayData: dat,
      current_page: 1
    });

    let data = {
      limit: JSON.stringify(dat.value),
      offset: "0",
      name: this.state.name,
      status:
        this.state.selectedStatus.value == undefined ||
          this.state.selectedStatus.value == null
          ? ""
          : this.state.selectedStatus.value,
      location:
        this.state.locationDataTxt == undefined ||
          this.state.locationDataTxt == null
          ? ""
          : this.state.locationDataTxt,
      storeTypeId:
        this.state.selectedStoreTypeData.value == undefined ||
          this.state.selectedStoreTypeData.value == null
          ? ""
          : this.state.selectedStoreTypeData.value,
      direc: "",
      orderby: "",
      email: this.state.email,
      mobile: this.state.mobile,
      storeManager: this.state.storeManager,
      // searchto: this.state.toDate,
      // searchfrom: this.state.formDate,
      // type: this.state.type,
      // status: this.state.status.toString(),
    };

    // consoleLog("changelimit:::", data);

    this.listApi(data);
  };

  handleDelete = () => {
    this.handleMenuClose();
    this.openDeleteModal();
  };
  deleteItem = async () => {
    let data = {
      id: this.state.listData[this.state.curIndex].id,
      status: 2,
    };
    // console.log(">>>>>>>>>>dataaaa::", JSON.stringify(data));
    let status = await ApiCall("changeStatusStore", data);
    // console.log(">>>>>>>>>status:", status);

    // window.$("#delete-modal").modal("hide");
    this.closeDeleteModal();
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

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    const customStylesDropdown = {
      control: (styles) => ({
        ...styles,
        backgroundColor: "white",
        boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
        borderRadius: "10px",
        height: 45,
        minHeight: 45,
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

    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
        {/* <Header /> */}
        <ToastContainer hideProgressBar={true} theme="colored" />
        {/* <Sidebar /> */}
        <div className="component-wrapper">
          <div className="listing-component-app">
            <div
              className="vn_frm"
              style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
            >
              {" "}
              <Link to="/adminDashboard">Dashboard</Link> / Store
            </div>
            <div className="vendor-info _fl sdw">
              <div className="vn-form _fl">
                <div className="row">
                  <div className="col-md-4">
                    <div className="vn_frm">
                      {" "}
                      <span>Store Name</span>
                      <InputText
                        type="text"
                        value={this.state.name}
                        placeholder="Search"
                        className="inputfield"
                        onTextChange={(value) => {
                          this.onNameChange(value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="vn_frm">
                      {" "}
                      <span>Email Id</span>
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
                      {" "}
                      <span>Phone No.</span>
                      <InputText
                        type="text"
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
                <div className="vn-form _fl">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="vn_frm">
                        {" "}
                        <span>Store Manager</span>
                        <InputText
                          type="text"
                          placeholder="Search"
                          className="inputfield"
                          value={this.state.storeManager}
                          onTextChange={(value) => {
                            this.onManagerChange(value);
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
              <div class="table-filter-box">
                <div
                  class="addnew"
                  onClick={() => {
                    return history.push("/adminAddStore");
                  }}
                >
                  <a href="javascript:void(0)">
                    Add Store{" "}
                    <img
                      className=""
                      src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                      style={{ width: "25px", cursor: "pointer" }}
                    />
                  </a>
                </div>
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

            <div className="table-listing-app md4">
              <div className="table-responsive">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    {/* <th style={{width:"5%"}}></th> */}
                    <th style={{ width: "15%" }} colSpan="2">
                      {/* <div className="sorting_btn">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("type")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button className="t1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("type")}
                          />
                        </button>
                      </div> */}
                      Store Name
                    </th>
                    <th style={{ width: "10%" }}>
                      {/* <div className="sorting_btn">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("fname")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button className="t1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("fname")}
                          />
                        </button>
                      </div> */}
                      Store Type
                    </th>
                    <th style={{ width: "15%" }}>
                      {/* <div className="sorting_btn">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("lname")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button className="t1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("lname")}
                          />
                        </button>
                      </div> */}
                      Location
                    </th>
                    <th style={{ width: "15%" }}>
                      {/* <div className="sorting_btn">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("agency")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button className="t1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("agency")}
                          />
                        </button>
                      </div> */}
                      Business Email
                    </th>
                    <th style={{ width: "15%" }}>
                      {/* <div className="sorting_btn">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("email")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button className="t1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("email")}
                          />
                        </button>
                      </div> */}
                      Business Phone
                    </th>
                    <th style={{ width: "15% " }}>
                      {/* <div className="sorting_btn">
                        <button
                          className="t1"
                          onClick={() => this.ascOrder("mobile")}
                        >
                          <img src={ImageName.IMAGE_NAME.ARROW_UP} />
                        </button>
                        <button className="t1">
                          <img
                            src={ImageName.IMAGE_NAME.ARROW_DOWN}
                            onClick={() => this.descOrder("mobile")}
                          />
                        </button>
                      </div> */}
                      Store Manager
                    </th>

                    <th style={{ width: "6%" }}>Status</th>
                    <th style={{ width: "4%" }}>Action</th>
                  </tr>
                  {this.state.listData.length > 0 ? (
                    <React.Fragment>
                      {this.state.listData.map((data, key) => (
                        <tr style={{ textAlign: "center" }}>
                          <td colspan="9">
                            <div className="tble-row">
                              <table
                                width="100%"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tr>
                                  <td
                                    style={{ width: "5%", paddingLeft: "10px" }}
                                  >
                                    <div className="store_logo">
                                      <img
                                        src={IMAGE_PATH_ONLY + data.storeLogo}
                                        style={{
                                          height: "40px",
                                          width: "40px",
                                          borderRadius: "50%",
                                        }}
                                      ></img>
                                    </div>
                                  </td>
                                  <td
                                    style={{ width: "9%", textAlign: "left" }}
                                    data-toogle="tooltip"
                                    title={data.name}
                                  >
                                    {data.name.length > 15
                                      ? textTruncate(data.name, 15)
                                      : data.name}
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    {data.TypeName}
                                  </td>
                                  <td
                                    style={{ width: "15%" }}
                                    data-toogle="tooltip"
                                    title={data.location}
                                  >
                                    {data.location.length > 20
                                      ? textTruncate(data.location)
                                      : data.location}
                                  </td>
                                  {data.businessEmail.length > 20 ? (
                                    <td
                                      style={{ width: "15%" }}
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title={data.businessEmail}
                                    >
                                      {textTruncate(data.businessEmail, 20)}
                                    </td>
                                  ) : (
                                    <td style={{ width: "15%" }}>
                                      {textTruncate(data.businessEmail, 20)}
                                    </td>
                                  )}

                                  <td style={{ width: "15%" }}>
                                    {data.businessPhone}
                                  </td>

                                  {/* <td style={{ width: "10%" }}>{data.email}</td> */}
                                  <td
                                    style={{ width: "15%" }}
                                    data-toogle="tooltip"
                                    title={data.storeManager}
                                  >
                                    {data.storeManager.length > 15
                                      ? textTruncate(data.storeManager)
                                      : data.storeManager}
                                  </td>

                                  <td style={{ width: "6%" }}>
                                    <FormControl
                                      component="fieldset"
                                      variant="standard"
                                    >
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                      >
                                        {data.status === 1 ? (
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
                                        {data.status == 1
                                          ? "ACTIVE"
                                          : "INACTIVE"}
                                      </FormHelperText>
                                    </FormControl>
                                  </td>

                                  <td style={{ width: "4%" }}>
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
                                      <MenuItem
                                        onClick={() => this.onEdit(key)}
                                      >
                                        Edit
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => this.onMaintenance(key)}
                                      >
                                        Maintenance Request
                                      </MenuItem>
                                      <MenuItem onClick={this.handleDelete}>
                                        Delete
                                      </MenuItem>
                                    </Menu>
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
                        <td colSpan="7">
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

            <div class="table-filter-app-b">
              {/* <div class="filter-btn">
                <a href={"javascript:void(0)"} onClick={this.openFilterModal}>
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
                <button className="next_btn" onClick={this.exRigth}></button>
              </div>
              <div class="table-filter-box">
                {/* <div class="addnew" onClick={() => { return history.push("/adminAddStore")}}>
                  <a href="javascript:void(0)">
                    Add Store{" "}
                    <img
                      className=""
                      src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                      style={{ width: "25px", cursor: "pointer" }}
                    />
                  </a>
                </div> */}
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
          </div>
        </div>

        {/* ..................modal................................. */}
        <div id="filter-model" class="modal fade modelwindow" role="dialog">
          <div class="modal-dialog modal-lg modal-dialog-centered">
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
                    {/* <div class="lable-text">requested on</div>
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
                    </div> */}
                  </div>
                  <div class="m-select _fl">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="sf-row">
                          <div
                            class="lable-text"
                            style={{ paddingRight: "10px", fontSize: "13px" }}
                          >
                            Store Type
                          </div>
                          <div class="dropdwn" style={{ marginLeft: "25%" }}>
                            <SelectBox
                              optionData={this.state.storeTypeArr}
                              value={this.state.selectedStoreTypeData}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onStoreTypeChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="sf-row">
                          <div
                            class="lable-text"
                            style={{ paddingLeft: "10px", fontSize: "13px" }}
                          >
                            Location
                          </div>
                          <div class="dropdwn" style={{ marginLeft: "25%" }}>
                            <div className="tr-3">
                              <Select
                                options={this.state.locationArr}
                                components={{
                                  DropdownIndicator,
                                  IndicatorSeparator: () => null,
                                }}
                                value={this.state.locationData}
                                placeholder="Select"
                                onChange={(value) =>
                                  this.onLocationChange(value)
                                }
                                onInputChange={(value) => {
                                  this.onLocationInputChange(value);
                                }}
                                styles={customStylesDropdown}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: "20px" }}>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ..............................delete modal............................. */}
        <div id="delete-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div className="modal-content" style={{ padding: "10px" }}>
              <div className="delete-head">Delete Store</div>
              <div className="modal-body">
                <div className="body-txt">
                  Are You Sure to delete the Store?
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
