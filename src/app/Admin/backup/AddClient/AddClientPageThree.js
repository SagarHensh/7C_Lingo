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

import { Decoder } from "../../../../services/auth";
import { phoneNumberCheck } from "../../../../services/common-function";
import { ErrorCode } from "../../../../services/constant";
import ReactLoader from "../../../Loader";
import { IMAGE_URL } from "../../../../services/config/api_url";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";
import { inputEmptyValidate } from "../../../../validators";

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

export default class AddClientPageThree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      billingAddress: "",
      billingCountryId: "",
      billingCountryInfoArr: [],
      billingStateDataArr: [],
      billingStateId: "",
      billingCity: "",
      billingZipCode: "",
      billingCountryCode: 1,
      billingAllAdddress: [],
      billingSelectAddress: [],

      billingIsSameAddress: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    let arrCountry = [];
    let arrState = [];
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
      billingCountryInfoArr: arrCountry,
      isLoad: false,
    });
  };

  onBillingStateChange = (data) => {
    this.setState({
      billingStateId: data.value,
    });
  };
  onBillingCountryChange = async (data) => {
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
      billingCountryId: data.value,
      // stateDataArr: stateArrData,
      billingStateDataArr: arrState,
    });
  };
  onBillingZipChange = (value) => {
    this.setState({
      billingZipCode: value,
    });
  };

  onBillingCityChange = (value) => {
    this.setState({
      billingCity: value,
    });
  };
  isSameAddress = () => {
    this.setState({
      billingIsSameAddress: !this.state.billingIsSameAddress,
    });

    // if (this.state.isSameAddress === false) {
    //   this.setState({
    //     billingAddress: "",
    //     selectBillingAddress: this.state.selectAddress,
    //     addressBillingInfoCountry: this.state.addressInfoCountry,
    //     billingState: this.state.primaryState,
    //     billingCity: this.state.primaryCity,
    //     billingZip: this.state.primaryZip,
    //   });
    // } else {
    //   this.setState({
    //     billingAddress: "",
    //     selectBillingAddress: "",
    //     addressBillingInfoCountry: "",
    //     billingState: "",
    //     billingCity: "",
    //     billingZip: "",
    //   });
    // }
  };

  // ......................location............................

  locationBillingData = async (e) => {
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
          billingAllAdddress: locationArr.data.locaionsuggesion,
        });
      }
    }
  };

  onLocationBillingSelect = async (event, value, reason, details) => {
    let locateAdd = this.state.billingSelectAddress;
    for (let i = 0; i < this.state.billingAllAdddress.length; i++) {
      if (this.state.billingAllAdddress[i].description === value) {
        let locationData = await ApiCall("getcoordinatefromplaceid", {
          placeid: this.state.billingAllAdddress[i].placeid,
        });
        if (
          locationData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          locationData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          let locationArr = Decoder.decode(locationData.data.payload);
          let findCount = 0;
          for (let j = 0; j < locateAdd.length; j++) {
            if (this.state.billingAllAdddress[i].description === locateAdd[j]) {
              findCount++;
            }
          }
          if (findCount === 0) {
            locateAdd.push({
              lat: locationArr.data.coordinatedetails[0].lat,
              long: locationArr.data.coordinatedetails[0].lng,
              location: this.state.billingAllAdddress[i].description,
            });
            console.log("location::::", locateAdd);
            this.setState({
              billingSelectAddress: locateAdd,
            });
          }
        }
      }
    }
  };
  removeBillingAddress = (index) => {
    let selectAddress = this.state.billingSelectAddress;
    selectAddress.splice(index, 1);
    this.setState({
      billingSelectAddress: selectAddress,
    });
  };

  onBillingNext = async () => {
    let errorCount = 0;
    let validateAddress = inputEmptyValidate(this.state.billingSelectAddress);
    let validateCountry = inputEmptyValidate(this.state.billingCountryId);
    let validateState = inputEmptyValidate(this.state.billingStateId);
    let validateCity = inputEmptyValidate(this.state.billingCity);
    let validateZip = inputEmptyValidate(this.state.billingZipCode);
    if (validateAddress === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_ADDRESSINFO_LOCATION, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateCountry === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_ADDRESSINFO_COUNTRY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateState === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_ADDRESSINFO_STATE, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateCity === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_ADDRESSINFO_CITY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateZip === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_ADDRESSINFO_ZIP, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // .........................................
    if (errorCount === 0) {
      let objData = {
        address: this.state.billingSelectAddress,
        country: this.state.billingCountryId,
        state: this.state.billingStateId,
        city: this.state.billingCity,
        zipCode: this.state.billingZipCode,
      };
      console.log(">:>:>:>:>:", objData);
      return history.push("/adminClientList");

      //   let res = await ApiCall("createuser", objData);
      //   let payload = Decoder.decode(res.data.payload);
      //   if (
      //     res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      //     res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      //   ) {
      //     toast.success(AlertMessage.MESSAGE.CREATE.SUCCESS, {
      //       hideProgressBar: true,
      //     });
      //
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

  onBillingCancel = () => {
    // history.push("/adminStaff");
    this.setState({
      showBillingPage: false,
    });
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
                <h3>BILLING INFORMATION</h3>
                <div className="row">
                  <div
                    className="billing-info"
                    style={{
                      borderTop: "none",
                      borderBottom: "none",
                      paddingRight: "20px",
                    }}
                  >
                    {/* <h4 className="text-billing">Billing Info</h4> */}
                    <label className="custom_check">
                      Same as Address Info
                      <input type="checkbox" onClick={this.isSameAddress} />
                      <span className="checkmark"></span>{" "}
                    </label>
                  </div>
                </div>
                <div className="department-form">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="web-form-bx">
                        {" "}
                        <span
                          className=""
                          style={{
                            fontSize: "13px",
                            color: "var(--greyLight)",
                          }}
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
                                this.onLocationBillingSelect(
                                  event,
                                  value,
                                  reason,
                                  details
                                )
                              }
                              options={this.state.billingAllAdddress.map(
                                (option) => option.description
                              )}
                              renderInput={(params) => (
                                <TextField
                                  onChange={this.locationBillingData}
                                  {...params}
                                />
                              )}
                            />
                          </Stack>
                          {this.state.billingSelectAddress.map((item, key) => (
                            <React.Fragment key={key}>
                              <span className="span_loc">
                                {item.location}
                                <img
                                  onClick={() => this.removeBillingAddress(key)}
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
                            optionData={this.state.billingCountryInfoArr}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onBillingCountryChange(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="department-form">
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
                            optionData={this.state.billingStateDataArr}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onBillingStateChange(value);
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
                          value={this.state.billingCity}
                          onTextChange={(value) => {
                            this.onBillingCityChange(value);
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
                        <span className="">Zip Code</span>
                        <InputText
                          type="text"
                          placeholder=""
                          className="in-field2"
                          value={this.state.billingZipCode}
                          onTextChange={(value) => {
                            this.onBillingZipChange(value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="_button-style m30 _fl text-center">
                  <a
                    className="white-btn"
                    style={{ textDecoration: "none" }}
                    onClick={this.onBillingCancel}
                  >
                    Back
                  </a>
                  <a
                    className="blue-btn"
                    style={{ textDecoration: "none" }}
                    onClick={this.onBillingNext}
                  >
                    Next
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
