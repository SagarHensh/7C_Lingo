import React, { Component } from "react";
import { styled, Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import FormControl from "@mui/material/FormControl";
import { ToastContainer, toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";
import { ApiCall } from "../../../../services/middleware";
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import history from "../../../../history";
import { InputText, SelectBox } from "../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../enums";
import "./addClient.css";
import {
  courseFeeValidate,
  departmentMobileValidator,
  departmentValidator,
  emailValidator,
  inputEmptyValidate,
  mobileNumberValidator,
  nameRegexValidator,
  numberValidator,
  passwordValidator,
} from "../../../../validators";
import { Regex } from "../../../../services/config";
import { Decoder } from "../../../../services/auth";
import { phoneNumberCheck } from "../../../../services/common-function";
import { ErrorCode } from "../../../../services/constant";
import ReactLoader from "../../../Loader";
import { IMAGE_URL } from "../../../../services/config/api_url";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";

// .................mui switch...................................
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 68,
  height: 28,
  padding: 0,
  borderRadius: "15%/50%",
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 25,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(5px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(42px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#335b7b",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 16,
    height: 16,
    borderRadius: 8,
    color: "white",
    marginTop: 4,
    marginLeft: 2,
    // transition: theme.transitions.create(["width"], {
    //   duration: 200,
    // }
    // ),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255,255,255,.35)" : "#993921",
    boxSizing: "border-box",
  },
}));
const roleArr = [
  { id: "INTER", name: "interpretation" },
  { id: "SUB", name: "Subtitling" },
  { id: "VOI", name: "voice over" },
];

export default class AddClientPageTwo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad: true,
      checkStatus: false,
      isSelected: null,
      fname: "",
      lname: "",
      email: "",
      phone: "",
      password: "",
      cpassword: "",
      address: "",
      countryId: "",
      countryInfoArr: [],
      stateDataArr: [],
      stateId: "",
      city: "",
      zipCode: "",
      countryCode: 1,
      allAdddress: [],
      selectAddress: [],
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    let arrCountry = [];
    let countryArr = [];
    let data = {};
    let res = await ApiCall("getcountrylist", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      countryArr = payload.data.countryInfo;
      for (let i = 0; i < countryArr.length; i++) {
        arrCountry.push({
          label: countryArr[i].name,
          value: countryArr[i].id,
        });
      }
    }

    this.setState({
      countryInfoArr: arrCountry,
      phone: "+" + this.state.countryCode + " ",
      isLoad: false,
    });
  };
  // ...............for tabs..........................

  onFNameChange = (value) => {
    let nameCheck = nameRegexValidator(value);
    this.setState({
      fname: nameCheck,
    });
  };
  onLNameChange = (value) => {
    let nameCheck = nameRegexValidator(value);
    this.setState({
      lname: nameCheck,
    });
  };
  onEmailChange = (value) => {
    this.setState({
      email: value,
    });
  };
  onPhoneChange = (value) => {
    if (numberValidator(value) === true) {
      if (mobileNumberValidator(value) === true) {
        let phoneCheck = phoneNumberCheck(value);
        if (phoneCheck) {
          this.setState({
            phone: phoneCheck,
          });
        }
      }
    }
  };

  onPasswordChange = (value) => {
    this.setState({
      password: value,
    });
  };
  onCpasswordChange = (value) => {
    this.setState({
      cpassword: value,
    });
  };

  onCityChange = (value) => {
    this.setState({
      city: value,
    });
  };
  onZipChange = (value) => {
    this.setState({
      zipCode: value,
    });
  };

  // ...............................option............................
  onSelectYes = (e) => {
    // console.log(">>>>>>>>>>>>>>>", typeof e.target.value);
    this.setState({
      isSelected: true,
    });
  };
  onSelectNo = (e) => {
    // console.log(">>>>>>>>>>>>>>>", typeof e.target.value);
    this.setState({
      isSelected: false,
    });
  };

  oncountryChange = async (data) => {
    let stateArrData = [];
    let arrState = [];
    let countryData = {
      countryid: parseInt(data.value),
    };

    if (data.value !== null || data.value !== undefined || data.value !== "") {
      if (data.value) {
        let res = await ApiCall("getstatelistofselectedcountry", countryData);

        if (
          res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          let payload = Decoder.decode(res.data.payload);

          stateArrData = payload.data.statelist;
          console.log("payload:::", payload);
          for (let i = 0; i < stateArrData.length; i++) {
            arrState.push({
              label: stateArrData[i].name,
              value: stateArrData[i].id,
            });
          }
        }
      }
    }
    console.log("________________", arrState);
    this.setState({
      countryId: data.value,
      // stateDataArr: stateArrData,
      stateDataArr: arrState,
    });
  };
  onStateChange = (data) => {
    this.setState({
      stateId: data.value,
    });
  };

  onProfileImage = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      // console.log(res.data.data);
      this.setState({
        imagePath: res.data.data.url,
        adminPhoto: res.data.data.filename,
      });
      //   this.onUpdate();
    });
  };

  // ......................location............................

  locationData = async (e) => {
    if (e.target.value.length >= 3) {
      let locationData = await ApiCall("getlocaiondescription", {
        place: e.target.value,
      });
      if (
        locationData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        locationData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let locationArr = Decoder.decode(locationData.data.payload);
        this.setState({
          allAdddress: locationArr.data.locaionsuggesion,
        });
      }
    }
  };

  onLocationSelect = async (event, value, reason, details) => {
    let locateAdd = this.state.selectAddress;
    for (let i = 0; i < this.state.allAdddress.length; i++) {
      if (this.state.allAdddress[i].description === value) {
        let locationData = await ApiCall("getcoordinatefromplaceid", {
          placeid: this.state.allAdddress[i].placeid,
        });
        if (
          locationData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          locationData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          let locationArr = Decoder.decode(locationData.data.payload);
          let findCount = 0;
          for (let j = 0; j < locateAdd.length; j++) {
            if (this.state.allAdddress[i].description === locateAdd[j]) {
              findCount++;
            }
          }
          if (findCount === 0) {
            locateAdd.push({
              lat: locationArr.data.coordinatedetails[0].lat,
              long: locationArr.data.coordinatedetails[0].lng,
              location: this.state.allAdddress[i].description,
            });
            // console.log("location::::", locateAdd);
            this.setState({
              selectAddress: locateAdd,
            });
          }
        }
      }
    }
  };
  removeAddress = (index) => {
    let selectAddress = this.state.selectAddress;
    selectAddress.splice(index, 1);
    this.setState({
      selectAddress: selectAddress,
    });
  };

  onNext = async () => {
    let mobileNo = this.state.phone.substring(3, 14);
    let errorCount = 0;
    let validateFName = inputEmptyValidate(this.state.fname);
    let validateFNameLength = departmentValidator(this.state.fname);
    if (validateFName === false) {
      toast.error(AlertMessage.MESSAGE.USER.EMPTY_USER, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateFNameLength === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.FIRST_NAME_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    let validateLName = inputEmptyValidate(this.state.lname);
    let validateLNameLength = departmentValidator(this.state.lname);
    if (validateLName === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.LAST_NAME_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateLNameLength === false) {
      toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    let validateEmail = emailValidator(this.state.email);

    if (validateEmail.status === false) {
      toast.error(validateEmail.message, {
        hideProgressBar: true,
      });
      errorCount++;
    } else {
      if (this.state.email.length > 100) {
        toast.error(AlertMessage.MESSAGE.EMAIL.MAX_EMAIL_LENGTH, {
          hideProgressBar: true,
        });
        errorCount++;
      }
    }

    let validatePhone = inputEmptyValidate(mobileNo);
    if (validatePhone === false) {
      toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    let validatePassword = passwordValidator(this.state.password);
    if (validatePassword.status === false) {
      toast.error(validatePassword.message, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    let validateCpassword = inputEmptyValidate(this.state.cpassword);
    if (validateCpassword === false) {
      toast.error(AlertMessage.MESSAGE.PASSWORD.CONFIRM_PASS_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    if (this.state.password !== this.state.cpassword) {
      toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_NOT_MATCH, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    if (this.state.isSelected === null) {
      toast.error(AlertMessage.MESSAGE.CLIENT.OUT_OF_TOWN_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    let validateAddress = inputEmptyValidate(this.state.selectAddress);
    if (validateAddress === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_ADDRESSINFO_LOCATION, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    let validateCountry = inputEmptyValidate(this.state.countryId);
    if (validateCountry === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_ADDRESSINFO_COUNTRY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    let validateState = inputEmptyValidate(this.state.stateId);
    if (validateState === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_ADDRESSINFO_STATE, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    let validateCity = inputEmptyValidate(this.state.city);
    if (validateCity === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_ADDRESSINFO_CITY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    let validateZip = inputEmptyValidate(this.state.zipCode);
    if (validateZip === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_ADDRESSINFO_ZIP, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // .......................................................
    if (errorCount === 0) {
      let objData = {
        firstName: this.state.fname,
        lastName: this.state.lname,
        email: this.state.email,
        phone: mobileNo,
        password: this.state.password,
        confirmPassword: this.state.cpassword,
        isSelected: this.state.isSelected ? "1" : "0",
        address: this.state.selectAddress,
        country: this.state.countryId,
        state: this.state.stateId,
        city: this.state.city,
        zipCode: this.state.zipCode,
      };
      console.log("_+_+_+_+_+", objData);
      return history.push("/adminAddClientPageThree");
      //   let res = await ApiCall("createuser", objData);
      //   let payload = Decoder.decode(res.data.payload);
      //   if (
      //     res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      //     res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      //   ) {
      //     toast.success(AlertMessage.MESSAGE.CREATE.SUCCESS, {
      //       hideProgressBar: true,
      //     });
      //     return history.push("/adminStaff");
      //   } else {
      //     if (
      //       res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
      //       res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST
      //     ) {
      //       toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_EXIST, {
      //         hideProgressBar: true,
      //       });
      //     } else if (
      //       res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
      //       res.respondcode === ErrorCode.ERROR.ERROR_CODE.PHONE_EXIST
      //     ) {
      //       toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EXIST, {
      //         hideProgressBar: true,
      //       });
      //     } else if (
      //       res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
      //       res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_PHONE_EXIST
      //     ) {
      //       toast.error(AlertMessage.MESSAGE.EMAIL_MOBILE.DUBLICATE, {
      //         hideProgressBar: true,
      //       });
      //     }
      //   }
    }
  };

  // .....................func for cancel btn......................

  onCancel = () => {
    history.push("/adminClientList");
  };

  render() {
    return (
      <div className="wrapper">
        <Header />
        <ToastContainer />
        <Sidebar />
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>
        <div className="component-wrapper" hidden={this.state.isLoad}>
          <h3 className="dcs">ADD NEW CLIENT</h3>
          <div className="row">
            <div className="col-md-9">
              <div className="department-component-app _fl sdw">
                <h3>ADMIN INFORMATION</h3>
                <div className="department-form">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">First Name</span>
                        <InputText
                          placeholder=""
                          className="in-field2"
                          value={this.state.fname}
                          onTextChange={(value) => {
                            this.onFNameChange(value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Last Name</span>
                        <InputText
                          placeholder=""
                          className="in-field2"
                          value={this.state.lname}
                          onTextChange={(value) => {
                            this.onLNameChange(value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="department-form">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Email Id</span>
                        <div className="dropdwn">
                          <InputText
                            type="text"
                            placeholder=""
                            className="in-field2"
                            value={this.state.email}
                            onTextChange={(value) => {
                              this.onEmailChange(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Phone No</span>
                        <InputText
                          type="text"
                          placeholder=""
                          className="in-field2"
                          value={this.state.phone}
                          onTextChange={(value) => {
                            this.onPhoneChange(value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="department-form">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Password</span>
                        <InputText
                          type="text"
                          placeholder=""
                          className="in-field2"
                          value={this.state.password}
                          onTextChange={(value) => {
                            this.onPasswordChange(value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Confirm Password</span>
                        <InputText
                          type="text"
                          placeholder=""
                          className="in-field2"
                          value={this.state.cpassword}
                          onTextChange={(value) => {
                            this.onCpasswordChange(value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="department-form">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Out Of Town</span>
                        <div className="check-field">
                          <label className="checkbox_btn">
                            <input
                              type="radio"
                              name="radio"
                              onClick={(e) => this.onSelectYes(e)}
                            />
                            <span className="checkmark3"></span> Yes
                          </label>
                        </div>
                        <div className="check-field">
                          <label className="checkbox_btn">
                            <input
                              type="radio"
                              name="radio"
                              onClick={(e) => this.onSelectNo(e)}
                            />
                            <span className="checkmark3"></span> No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h3>ADDRESS INFORMATION</h3>
                <div className="row">
                  <div className="col-md-5">
                    <div className="web-form-bx">
                      {" "}
                      <span
                        className=""
                        style={{ fontSize: "13px", color: "var(--greyLight)" }}
                      >
                        Location
                      </span>
                      <div class="dropdwn">
                        <Stack spacing={2} style={{ marginTop: "15px" }}>
                          <Autocomplete
                            id="free-solo-demo"
                            freeSolo
                            size="small"
                            onChange={(event, value, reason, details) =>
                              this.onLocationSelect(
                                event,
                                value,
                                reason,
                                details
                              )
                            }
                            options={this.state.allAdddress.map(
                              (option) => option.description
                            )}
                            renderInput={(params) => (
                              <TextField
                                onChange={this.locationData}
                                {...params}
                              />
                            )}
                          />
                        </Stack>
                        {this.state.selectAddress.map((item, key) => (
                          <React.Fragment key={key}>
                            <span className="span_loc">
                              {item.location}
                              <img
                                onClick={() => this.removeAddress(key)}
                                src={ImageName.IMAGE_NAME.CLOSE_BTN}
                                className="close-img"
                              />
                            </span>
                          </React.Fragment>
                        ))}
                      </div>
                      {/* <div className="ak">
                        <img src="images/location.png" />
                      </div> */}
                    </div>
                  </div>
                  <div className="col-md-2"></div>
                  <div className="col-md-5">
                    <div className="form_rbx">
                      {" "}
                      <span>Country</span>
                      <div class="dropdwn">
                        {/* <select className="myDropdown_address_country frm4-select"></select> */}
                        <SelectBox
                          optionData={this.state.countryInfoArr}
                          placeholder="Select"
                          onSelectChange={(value) => {
                            this.oncountryChange(value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-5">
                    <div className="form_rbx">
                      {" "}
                      <span className="">State</span>
                      <div
                        class="dropdwn"
                        style={{ width: "100%", cursor: "pointer" }}
                      >
                        {/* <select className="myDropdown_primary_state frm4-select"></select> */}
                        <SelectBox
                          optionData={this.state.stateDataArr}
                          placeholder="Select"
                          onSelectChange={(value) => {
                            this.onStateChange(value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2"></div>
                  <div className="col-md-5">
                    <div className="form_rbx">
                      {" "}
                      <span className="">City</span>
                      <InputText
                        type="text"
                        placeholder=""
                        className="in-field2"
                        value={this.state.city}
                        onTextChange={(value) => {
                          this.onCityChange(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-5">
                    <div className="form_rbx">
                      {" "}
                      <span className="">Zip Code</span>
                      <InputText
                        type="text"
                        placeholder=""
                        className="in-field2"
                        value={this.state.zipCode}
                        onTextChange={(value) => {
                          this.onZipChange(value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* ....................................... */}

                <div className="_button-style m30 _fl text-center">
                  <a
                    className="white-btn"
                    style={{ textDecoration: "none" }}
                    onClick={this.onCancel}
                  >
                    Back
                  </a>
                  <a
                    className="blue-btn"
                    style={{ textDecoration: "none" }}
                    onClick={this.onNext}
                  >
                    Next
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-3"></div>
          </div>
        </div>
      </div>
    );
  }
}
