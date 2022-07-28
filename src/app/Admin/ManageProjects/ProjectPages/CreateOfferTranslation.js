import React, { Component } from "react";
import { styled, Box, textAlign } from "@mui/system"; //imported for modal
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
const MainResData = {
  projectId: "123456",
  requestedOn: "11/12/2021",
  tableList: [
    {
      taskName: "Translation",
      sourceLang: "english",
      targetLang: "spanish",
      itemArr: [
        {
          itemName: "Free",
          unitCost: "000",
          Rate: "000",
        },
      ],
    },
    {
      taskName: "DTP",
      sourceLang: "english",
      targetLang: "spanish",
      itemArr: [
        {
          itemName: "Free",
          unitCost: "000",
          Rate: "000",
        },
      ],
    },
  ],
};

export default class CreateOfferTranslation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,

      switch: false,
      anchorEl: null, //menu button
      anchorEl1: null, //menu button

      projectId: "",
      requestedOn: "",
      translationUnitCost: "",
      dtpUnitCost: "",
      translationRate: "",
      dtpRate: "",
      tanslationSubTotal: "",
      rushFreeRate: "",

      listData: [],
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  load = async () => {};

  //..... for search name......

  onTranslationUnitCostChange = (e) => {
    let val = zipValidate(e.target.value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        translationUnitCost: val,
      });
    }
  };
  onTranslationRateChange = (e) => {
    let val = zipValidate(e.target.value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        translationRate: val,
      });
    }
  };
  onDtpUnitCostChange = (e) => {
    let val = zipValidate(e.target.value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        dtpUnitCost: val,
      });
    }
  };
  onDtpRateChange = (e) => {
    let val = zipValidate(e.target.value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        dtpRate: val,
      });
    }
  };
  onRushFreeRateChange = (e) => {
    let val = zipValidate(e.target.value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        rushFreeRate: val,
      });
    }
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

  //........ No Delete .......

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    const open1 = Boolean(this.state.anchorEl1);
    return (
      <React.Fragment>
        {/* <div className="wrapper">
        <Header /> */}
        <ToastContainer hideProgressBar />
        {/* <Sidebar /> */}
        <div class="component-wrapper">
          <div class="create-offer sdw _fl">
            <div class="_fl create-offer-list">
              <h2>Create Offer</h2>
              <p>
                <span>Project Id</span> 2029/20
              </p>
              <p>
                <span>Requested On</span> 2029/20
              </p>
            </div>
            <div class="_fl wdth-80 p-20">
              <div class="row">
                <div class="col-md-6">
                  <p class="notes">
                    Notes From <span>7C Lingo</span>
                  </p>
                  <p>
                    Reference site about Lorem Ipsum, giving information on its
                    origins, as well as a random Lipsum generator.
                  </p>
                </div>
                <div class="col-md-6">
                  <p class="notes">Notes from Client</p>
                  <p>
                    Reference site about Lorem Ipsum, giving information on its
                    origins, as well as a random Lipsum generator.
                  </p>
                </div>
              </div>
            </div>
            <div class="tsk-col _fl m30 p-20">
              <h3>Task 1 Translation</h3>
              <ul>
                <li>
                  <a href="#" style={{ textDecoration: "none" }}>
                    English
                  </a>
                </li>
                <li>
                  <a href="#" style={{ textDecoration: "none" }}>
                    Spanish
                  </a>
                </li>
              </ul>
            </div>
            <div class="tsk-tabl">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <th style={{ width: "33%", textAlign: "center" }}>ITEM(S)</th>
                  <th style={{ width: "33%", textAlign: "center" }}>
                    UNIT COST/WORD
                  </th>
                  <th style={{ width: "33%", textAlign: "center" }}>RATE</th>
                </tr>

                <tr>
                  <td style={{ textAlign: "left" }}>Free</td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="text"
                      value={this.state.translationUnitCost}
                      name=""
                      placeholder="$000"
                      class="in-field4"
                      onChange={this.onTranslationUnitCostChange}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="text"
                      value={this.state.translationRate}
                      name=""
                      placeholder="$000"
                      class="in-field4"
                      onChange={this.onTranslationRateChange}
                    />
                  </td>
                </tr>

                <tr>
                  <td style={{ textAlign: "left" }}>SUB COST</td>
                  <td style={{ textAlign: "center" }}>&nbsp;</td>
                  <td style={{ textAlign: "center" }} class="text-ttt">
                    $6650.000
                  </td>
                </tr>
              </table>
            </div>

            <div class="tsk-col _fl m30 p-20">
              <h3>Task 2 DTP</h3>
              <ul>
                <li>
                  <a href="#" style={{ textDecoration: "none" }}>
                    English
                  </a>
                </li>
                <li>
                  <a href="#" style={{ textDecoration: "none" }}>
                    Spanish
                  </a>
                </li>
              </ul>
            </div>
            <div class="tsk-tabl">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <th style={{ width: "33%", textAlign: "center" }}>ITEM(S)</th>
                  <th style={{ width: "33%", textAlign: "center" }}>
                    UNIT COST/WORD
                  </th>
                  <th style={{ width: "33%", textAlign: "center" }}>RATE</th>
                </tr>

                <tr>
                  <td style={{ textAlign: "left" }}>Free</td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="text"
                      value={this.state.dtpUnitCost}
                      name=""
                      placeholder="$000"
                      class="in-field4"
                      onChange={this.onDtpCostUnitChange}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="text"
                      value={this.state.dtpRate}
                      name=""
                      placeholder="$000"
                      class="in-field4"
                      onChange={this.onDtpRateChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>Rush Free Applicable</td>
                  <td style={{ textAlign: "center" }}>&nbsp;</td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="text"
                      value={this.state.rushFreeRate}
                      name=""
                      placeholder="$000"
                      class="in-field4"
                      onChange={this.onRushFreeRateChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>SUB COST</td>
                  <td style={{ textAlign: "center" }}>&nbsp;</td>
                  <td style={{ textAlign: "center" }} class="text-ttt">
                    $6650.000
                  </td>
                </tr>
              </table>
            </div>
            <div class="_button-style m30 _fl text-center">
              <a href="#" class="white-btn">
                back
              </a>
              <a href="#" class="blue-btn">
                submit
              </a>
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
