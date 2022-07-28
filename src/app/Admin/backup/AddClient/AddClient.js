import React, { Component } from "react";
import { styled, Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import FormControl from "@mui/material/FormControl";
import { ToastContainer, toast } from "react-toastify";
import { ApiCall } from "../../../../services/middleware";
import history from "../../../../history";
import { InputText, SelectBox } from "../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../enums";
import "./addClient.css";
import {
  courseFeeValidate,
  departmentValidator,
  emailValidator,
  inputEmptyValidate,
  mobileNumberValidator,
  nameRegexValidator,
  numberValidator,
  passwordValidator,
  zipValidate,
} from "../../../../validators";
import { Regex } from "../../../../services/config";
import { Decoder } from "../../../../services/auth";
import { phoneNumberCheck } from "../../../../services/common-function";
import { ErrorCode } from "../../../../services/constant";
import ReactLoader from "../../../Loader";
import { IMAGE_URL } from "../../../../services/config/api_url";
import axios from "axios";
import { Autocomplete, listSubheaderClasses, TextField } from "@mui/material";
import { ThumbDown } from "@material-ui/icons";
// import Select from "react-select/dist/declarations/src/Select";
import Select, { components } from "react-select";
import { VALIDATIONS } from "../../../../services/constant/lengthValidation";

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

// For Dropdown

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

export default class AddClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPage: false,
      showBillingPage: false,
      isLoad: true,
      checkStatus: false,
      uname: "",
      businessEmail: "",
      businessPhone: "",
      website: "",
      fax: "",
      purchaseOrder: "",
      industryArr: [],
      industryTypeId: "",
      countryCode: 1,
      checked: "",
      adminPhoto: "",
      imagePath: "images/profile-pic.png",

      // ...................account and primary address.............................
      fname: "",
      lname: "",
      email: "",
      phone: "",
      password: "",
      cpassword: "",
      address: "",
      countryId: "",
      countryData: {},
      countryName: "",
      countryInfoArr: [],
      stateData: {},
      stateDataArr: [],
      stateId: "",
      city: "",
      zipCode: "",
      countryCode: 1,
      selectedLocation: "",
      locationData: {},

      locationArr: [],

      allAdddress: [],
      selectAddress: [],
      isSelected: null,
      //.......................billing address.................................
      billingSelectedLocation: "",
      billingLocationData: {},
      billingCountryId: "",
      billingCountryData: {},
      billingCountryName: "",
      billingCountryInfoArr: [],
      billingStateData: {},
      billingStateDataArr: [],
      billingStateId: "",
      billingCity: "",
      billingZipCode: "",
      billingCountryCode: 1,

      billingAllAdddress: [],
      billingSelectAddress: [],

      // isSameAddress: false,
      billingIsSameAddress: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    // console.log("bill::", this.state.billingIsSameAddress);
    let industryDataArr = [];
    let lookupres = await ApiCall("getLookUpData");
    if (
      lookupres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      lookupres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(lookupres.data.payload);
      let industryArr = payload.data.lookupdata.INDUSTRY_TYPE;

      for (let i = 0; i < industryArr.length; i++) {
        industryDataArr.push({
          label: industryArr[i].name,
          value: industryArr[i].id,
        });
      }
    }
    //api for location list......................

    // let locationArr = [];
    // let locationData = await ApiCall("getlocaiondescription", {
    //   place: e.target.value,
    // });
    // if (
    //   locationData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   locationData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {
    //   let locationArr = Decoder.decode(locationData.data.payload);
    //   locationArr = locationArr.data.locaionsuggesion;
    // this.setState({
    //   allAdddress: locationArr.data.locaionsuggesion,
    // });
    // }
    // .........api for country list...............

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
      // locationArr: locationArr,
      countryInfoArr: arrCountry,
      billingCountryInfoArr: arrCountry,
      industryArr: industryDataArr,
      businessPhone: "+" + this.state.countryCode + " ",
      phone: "+" + this.state.countryCode + " ",
      isLoad: false,
    });
  };
  // ...............for account info..........................

  onNameChange = (value) => {
    // var pattern = new RegExp(Regex.NAME_REGEX);
    let nameCheck = nameRegexValidator(value);
    // if (pattern.test(value)) {

    this.setState({
      uname: nameCheck,
    });
  };
  onIndustryChange = (data) => {
    this.setState({
      industryTypeId: data.value,
    });
  };
  onBusinessEmailChange = (value) => {
    this.setState({
      businessEmail: value,
    });
  };

  onBusinessPhoneChange = (value) => {
    if (numberValidator(value) === true) {
      if (mobileNumberValidator(value) === true) {
        let phoneCheck = phoneNumberCheck(value);
        if (phoneCheck) {
          this.setState({
            businessPhone: phoneCheck,
          });
        }
      }
    }
  };

  onWebsiteChange = (value) => {
    this.setState({
      website: value,
    });
  };
  onFaxChange = (value) => {
    this.setState({
      fax: value,
    });
  };
  onPurchaseChange = (value) => {
    this.setState({
      purchaseOrder: value,
    });
  };

  onStatusChange = (e) => {
    this.setState({
      checkStatus: !this.state.checkStatus,
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
      this.onUpdate();
    });
  };
  onUpdate = async () => {
    // let mobileNo = this.state.phoneNumber.substring(3, 14).replace(/\s/g, "");
    let mobileNo = this.state.businessPhone.substring(3, 14);
    let objData = {
      name: this.state.uname,
      industryTypeId: this.state.industryTypeId,
      email: this.state.businessEmail,
      cuncode: this.state.countryCode,
      phone: mobileNo,
      website: this.state.website,
      fax: this.state.fax,
      purchaseOrder: this.state.purchaseOrder,
      status: this.state.checkStatus ? "1" : "0",
      photo: this.state.adminPhoto,
    };
    // console.log("actual data", objData);
    // let res = await ApiCall("modifyvendoraccount", data);
    // console.log("%%%%%%%%_____________________", res);
    // if (
    //   res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {
    //   toast.success(AlertMessage.MESSAGE.UPDATE.PROFILE_SUCCESS, {
    //     hideProgressBar: true,
    //   });
    // }
  };

  onNext = async () => {
    this.setState({
      showPage: true,
    });
    let mobileNo = this.state.businessPhone.substring(3, 14);
    let errorCount = 0;
    let validateIndustry = inputEmptyValidate(this.state.industryTypeId);
    let validateEmail = emailValidator(this.state.businessEmail);
    let validatePhone = inputEmptyValidate(mobileNo);

    let validateName = inputEmptyValidate(this.state.uname);
    let validateNameLength = departmentValidator(this.state.uname);
    if (validateName === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_CLIENT_NAME, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateNameLength === false) {
      toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateIndustry === false) {
      toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_INDUSTRY_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateEmail.status === false) {
      toast.error(AlertMessage.MESSAGE.EMAIL.BUSSINESS_EMAIL_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (this.state.businessEmail.length > 100) {
      toast.error(AlertMessage.MESSAGE.EMAIL.MAX_EMAIL_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validatePhone === false) {
      toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // .....................................................

    //

    if (errorCount === 0) {
      let objData = {
        name: this.state.uname,
        industryTypeId: this.state.industryTypeId,
        email: this.state.businessEmail,
        cuncode: this.state.countryCode,
        phone: mobileNo,
        website: this.state.website,
        fax: this.state.fax,
        purchaseOrder: this.state.purchaseOrder,
        status: this.state.checkStatus ? "1" : "0",
        photo: this.state.adminPhoto,
      };
      // console.log("=================>", objData);
      // return history.push("/adminAddClientPageTwo");

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
    return history.push("/adminClientList");
  };
  //.........................................*************************.........................................
  // ...............................Admin and Address info. function.............................

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
  // .................out of Town...............
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

  onLocationChange = (data) => {
    // console.log("data::::loc", data.label);
    this.setState({
      selectedLocation: data.label,
      locationData: data,
    });
  };
  onLocationInputChange = async (val) => {
    // console.log(")))))))))))))))", val);
    let arrData = [];
    let locationData = [];

    if (val.length >= 3) {
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
          locationData: val,
        });
      }
    }
  };
  oncountryChange = async (data) => {
    // console.log("name::::::", data);
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
          // console.log("payload:::", payload);
          for (let i = 0; i < stateArrData.length; i++) {
            arrState.push({
              label: stateArrData[i].name,
              value: stateArrData[i].id,
            });
          }
        }
      }
    }
    // console.log("________________", arrState);
    this.setState({
      countryData: data,
      countryId: data.value,

      stateDataArr: arrState,
    });
  };
  onStateChange = (data) => {
    this.setState({
      stateData: data,
      stateId: data.value,
    });
  };

  onCityChange = (value) => {
    this.setState({
      city: value,
    });
  };
  onZipChange = (value) => {
    let val = zipValidate(value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        zipCode: val,
      });
    }
  };
  onAddressNext = async () => {
    let mobileNo = this.state.phone.substring(3, 14);
    let errorCount = 0;
    let validateFName = inputEmptyValidate(this.state.fname);
    let validateFNameLength = departmentValidator(this.state.fname);
    let validateLName = inputEmptyValidate(this.state.lname);
    let validateLNameLength = departmentValidator(this.state.lname);
    let validateEmail = emailValidator(this.state.email);
    let validatePhone = inputEmptyValidate(mobileNo);
    let validatePassword = passwordValidator(this.state.password);
    let validateCpassword = inputEmptyValidate(this.state.cpassword);
    let validateAddress = inputEmptyValidate(this.state.locationData);
    let validateCountry = inputEmptyValidate(this.state.countryId);
    let validateState = inputEmptyValidate(this.state.stateId);
    let validateCity = inputEmptyValidate(this.state.city);
    let validateZip = inputEmptyValidate(this.state.zipCode);
    if (validateFName === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.FIRST_NAME_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateFNameLength === false) {
      toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateLName === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.LAST_NAME_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateLNameLength === false) {
      toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateEmail.status === false) {
      toast.error(validateEmail.message, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (this.state.email.length > 100) {
      toast.error(AlertMessage.MESSAGE.EMAIL.MAX_EMAIL_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validatePhone === false) {
      toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validatePassword.status === false) {
      toast.error(validatePassword.message, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateCpassword === false) {
      toast.error(AlertMessage.MESSAGE.PASSWORD.CONFIRM_PASS_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (this.state.password !== this.state.cpassword) {
      toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_NOT_MATCH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (this.state.isSelected === null) {
      toast.error(AlertMessage.MESSAGE.CLIENT.OUT_OF_TOWN_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateAddress === false) {
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
    // .......................................................
    if (errorCount === 0) {
      this.setState({
        showBillingPage: true,
      });
      let objData = {
        firstName: this.state.fname,
        lastName: this.state.lname,
        email: this.state.email,
        phone: mobileNo,
        password: this.state.password,
        confirmPassword: this.state.cpassword,
        isSelected: this.state.isSelected ? "1" : "0",
        address: this.state.locationData.label,
        country: this.state.countryData.value,
        state: this.state.stateData.value,
        city: this.state.city,
        zipCode: this.state.zipCode,
      };
      // console.log("_+_+_+_+_+", objData);
      // return history.push("/adminAddClientPageThree");
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

  onAddressCancel = () => {
    this.setState({
      showPage: false,
    });
  };

  // .........................******************************......................................
  // ..............................billing info func................................................

  onBillingLocationChange = (data) => {
    // console.log("data::::loc", typeof data.label);
    this.setState({
      billingSelectedLocation: data.label,
      billingLocationData: data,
    });
  };
  onBillingLocationInputChange = async (val) => {
    let arrData = [];
    if (val.length >= 3) {
      let locationData = await ApiCall("getlocaiondescription", {
        place: val,
      });
      if (
        locationData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        locationData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let locationArr = Decoder.decode(locationData.data.payload);
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
        });
      }
    }
  };

  onBillingCountryChange = async (data) => {
    // console.log("data:::::::", data.value);
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
          for (let i = 0; i < stateArrData.length; i++) {
            arrState.push({
              label: stateArrData[i].name,
              value: stateArrData[i].id,
            });
          }
        }
      }
    }

    this.setState({
      billingCountryId: data.label,
      billingCountryData: data,
      billingStateDataArr: arrState,
    });
  };
  onBillingStateChange = (data) => {
    // console.log("state::::", data.value);
    this.setState({
      billingStateData: data,
      billingStateId: data.value,
    });
  };
  onBillingZipChange = (value) => {
    let val = zipValidate(value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        zipCode: val,
      });
    }
  };

  onBillingCityChange = (value) => {
    this.setState({
      billingCity: value,
    });
  };
  isSameAddress = () => {
    // console.log("res==============>", this.state.billingIsSameAddress);

    if (this.state.billingIsSameAddress === false) {
      this.setState({
        billingLocationData: this.state.locationData,
        billingCountryData: this.state.countryData,

        billingStateData: this.state.stateData,
        billingCity: this.state.city,
        billingZipCode: this.state.zipCode,
        billingIsSameAddress: !this.state.billingIsSameAddress,
      });
    } else {
      this.setState({
        billingLocationData: {},
        billingCountryData: {},

        billingCountryId: "",
        billingStateData: {},
        billingCity: "",
        billingZipCode: "",
        billingIsSameAddress: !this.state.billingIsSameAddress,
      });
    }
  };

  onBillingNext = async () => {
    let businessMobileNo = this.state.businessPhone.substring(3, 14);
    let mobileNo = this.state.phone.substring(3, 14);
    let errorCount = 0;
    //...............................ACCOUNT INFO VALIDATION...........................
    let validateIndustry = inputEmptyValidate(this.state.industryTypeId);
    let validateBusinessEmail = emailValidator(this.state.businessEmail);
    let validateBusinessPhone = inputEmptyValidate(mobileNo);

    let validateName = inputEmptyValidate(this.state.uname);
    let validateNameLength = departmentValidator(this.state.uname);
    //...............................ADDRESS VALIDATION VARIABLES...............................
    let validateFName = inputEmptyValidate(this.state.fname);
    let validateFNameLength = departmentValidator(this.state.fname);
    let validateLName = inputEmptyValidate(this.state.lname);
    let validateLNameLength = departmentValidator(this.state.lname);
    let validateEmail = emailValidator(this.state.email);
    let validatePhone = inputEmptyValidate(businessMobileNo);
    let validatePassword = passwordValidator(this.state.password);
    let validateCpassword = inputEmptyValidate(this.state.cpassword);
    let validateAddress = inputEmptyValidate(this.state.locationData);
    let validateCountry = inputEmptyValidate(this.state.countryId);
    let validateState = inputEmptyValidate(this.state.stateId);
    let validateCity = inputEmptyValidate(this.state.city);
    let validateZip = inputEmptyValidate(this.state.zipCode);

    // ...............................BILLING VALIDATIONS VARIABLES..........................
    let validateBillingAddress = inputEmptyValidate(
      this.state.billingLocationData
    );
    let validateBillingCountry = inputEmptyValidate(
      this.state.billingCountryData
    );
    let validateBillingState = inputEmptyValidate(this.state.billingStateData);
    let validateBillingCity = inputEmptyValidate(this.state.billingCity);
    let validateBillingZip = inputEmptyValidate(this.state.billingZipCode);

    // ..........................ACCOUNT VALIDATIONS..............................
    if (validateName === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_CLIENT_NAME, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateNameLength === false) {
      toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateIndustry === false) {
      toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_INDUSTRY_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateBusinessEmail.status === false) {
      toast.error(AlertMessage.MESSAGE.EMAIL.BUSSINESS_EMAIL_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (this.state.businessEmail.length > 100) {
      toast.error(AlertMessage.MESSAGE.EMAIL.MAX_EMAIL_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateBusinessPhone === false) {
      toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    // ..........................ADDRESS VALIDATIONS..............................
    else if (validateFName === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.FIRST_NAME_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateFNameLength === false) {
      toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateLName === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.LAST_NAME_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateLNameLength === false) {
      toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateEmail.status === false) {
      toast.error(validateEmail.message, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (this.state.email.length > 100) {
      toast.error(AlertMessage.MESSAGE.EMAIL.MAX_EMAIL_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validatePhone === false) {
      toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validatePassword.status === false) {
      toast.error(validatePassword.message, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateCpassword === false) {
      toast.error(AlertMessage.MESSAGE.PASSWORD.CONFIRM_PASS_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (this.state.password !== this.state.cpassword) {
      toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_NOT_MATCH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (this.state.isSelected === null) {
      toast.error(AlertMessage.MESSAGE.CLIENT.OUT_OF_TOWN_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateAddress === false) {
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
    // ..........................BILLING VALIDATIONS..............................
    else if (validateBillingAddress === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_ADDRESSINFO_LOCATION, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateBillingCountry === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_ADDRESSINFO_COUNTRY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateBillingState === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_ADDRESSINFO_STATE, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateBillingCity === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_ADDRESSINFO_CITY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateBillingZip === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_ADDRESSINFO_ZIP, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // .........................................
    if (errorCount === 0) {
      let data = {
        clientname: this.state.uname,
        industryid: this.state.industryTypeId,
        businessemail: this.state.businessEmail,
        businessphone: this.state.businessPhone,
        countrycode: this.state.countryCode,
        website: this.state.website,
        purchaseorder: this.state.purchaseOrder,
        fax: this.state.fax,
        companylogo: this.state.adminPhoto,
        status: this.state.checkStatus ? "1" : "0",
        fname: this.state.fname,
        lname: this.state.lname,
        email: this.state.email,
        mobile: this.state.phone,
        password: this.state.password,
        outoftown: this.state.isSelected ? "1" : "0",
        clientId: 1,
        primaryaddress: this.state.locationData.label,
        primarycountryid: this.state.countryData.value,
        primarystateid: this.state.stateData.value,
        primarycity: this.state.city,
        primaryzipcode: this.state.zipCode,
        billingaddress: this.state.billingLocationData.label,
        billingcountryid: this.state.billingCountryData.value,
        billingstateid: this.state.billingStateData.value,
        billingcity: this.state.billingCity,
        billingzipcode: this.state.billingZipCode,
        sameaddress: this.state.billingIsSameAddress ? "0" : "1",
      };

      // console.log(">:>:>:>:>:", data);
      // return history.push("/adminClientList");

      let res = await ApiCall("createclientaccount", data);
      // console.log(">:>:>:>:>:", res);
      // let payload = Decoder.decode(res.data.payload);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.CLIENT.CLIENT_ADD_SUCCESS, {
          hideProgressBar: true,
        });
        return history.push("/adminClientList");
      } else {
        if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST
        ) {
          toast.error(AlertMessage.MESSAGE.EMAIL.BUSINESS_EMAIL_EXIST, {
            hideProgressBar: true,
          });
        } else if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.PHONE_EXIST
        ) {
          toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EXIST, {
            hideProgressBar: true,
          });
        } else if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_PHONE_EXIST
        ) {
          toast.error(AlertMessage.MESSAGE.EMAIL_MOBILE.DUBLICATE, {
            hideProgressBar: true,
          });
        }
      }
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
      <React.Fragment>
        {/* <div className="wrapper">
        <Header /> */}
        <ToastContainer />
        {/* <Sidebar /> */}
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>
        <div className="component-wrapper" hidden={this.state.isLoad}>
          <h3 className="dcs">ADD NEW CLIENT</h3>
          <div className="row">
            <div className="col-md-9">
              <div className="department-component-app _fl sdw">
                <h3>ACCOUNT INFORMATION</h3>
                <div className="department-form">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Client</span>
                        <InputText
                          placeholder=""
                          className="in-field2"
                          value={this.state.uname}
                          onTextChange={(value) => {
                            this.onNameChange(value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Industry Type</span>
                        <SelectBox
                          optionData={this.state.industryArr}
                          placeholder="Select"
                          onSelectChange={(value) => {
                            this.onIndustryChange(value);
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
                        <span className="">Business Email</span>
                        <div className="dropdwn">
                          <InputText
                            type="text"
                            placeholder=""
                            className="in-field2"
                            value={this.state.businessEmail}
                            onTextChange={(value) => {
                              this.onBusinessEmailChange(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Business Phone</span>
                        <InputText
                          type="text"
                          placeholder=""
                          className="in-field2"
                          value={this.state.businessPhone}
                          onTextChange={(value) =>
                            this.onBusinessPhoneChange(value)
                          }
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
                        <span className="">Website</span>
                        <div className="dropdwn">
                          <InputText
                            type="text"
                            placeholder=""
                            className="in-field2"
                            value={this.state.website}
                            onTextChange={(value) => {
                              this.onWebsiteChange(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Fax</span>
                        <div className="dropdwn">
                          <InputText
                            type="text"
                            placeholder=""
                            className="in-field2"
                            value={this.state.fax}
                            onTextChange={(value) => {
                              this.onFaxChange(value);
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
                        <span className="">Purchase Order</span>
                        <InputText
                          type="text"
                          placeholder=""
                          className="in-field2"
                          value={this.state.purchaseOrder}
                          onTextChange={(value) => {
                            this.onPurchaseChange(value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="department-form">
                  <div className="row">
                    <div className="col-md-1">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Status</span>
                        <FormControl component="fieldset" variant="standard">
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <AntSwitch
                              defaultChecked={this.state.checkStatus}
                              inputProps={{
                                "aria-label": "ant design",
                              }}
                              name="active"
                              onClick={(e) => this.onStatusChange(e)}
                            />
                          </Stack>
                        </FormControl>
                      </div>
                    </div>
                    <div className="col-md-1 status-btn">
                      <div className="status_text">
                        {this.state.checkStatus ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </div>
                </div>

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
            <div className="col-md-3">
              <div className="profile-pic-data">
                <div className="c-logo">
                  <img className="border_50_img" src={this.state.imagePath} />
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
          </div>
        </div>
        {/* ............................admin and addressinfo...................... */}
        {this.state.showPage ? (
          <React.Fragment>
            <div className="component-wrapper" hidden={this.state.isLoad}>
              {/* <h3 className="dcs">ADD NEW CLIENT</h3> */}
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
                            {/* <SelectBox
                              value={this.state.selectedLocation}
                              optionData={this.state.locationArr}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onLocationChange(value);
                              }}
                              onInputChange={(value) => {
                                this.onLocInputChange(value);
                              }}
                            /> */}
                            <Select
                              options={this.state.locationArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.locationData}
                              placeholder="Select"
                              onChange={(value) => this.onLocationChange(value)}
                              onInputChange={(value) => {
                                this.onLocationInputChange(value);
                              }}
                            />
                            {/* <Select
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              onChange={(value) => {
                                this.onLocationChange(value);
                              }}
                              options={this.state.locationArr}
                              onInputChange={(value) => {
                                this.onLocationInputChange(value);
                              }}
                            /> */}
                            {/* <div class="dropdwn">
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
                            </div> */}
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
                              <Select
                                options={this.state.countryInfoArr}
                                components={{
                                  DropdownIndicator,
                                  IndicatorSeparator: () => null,
                                }}
                                value={this.state.countryData}
                                // value={selectedOption}
                                placeholder="Select"
                                onChange={(value) =>
                                  this.oncountryChange(value)
                                }
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
                            <Select
                              options={this.state.stateDataArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              defaultInputValue=""
                              value={this.state.stateData}
                              placeholder="Select"
                              onChange={(value) => this.onStateChange(value)}
                            />
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
                              value={this.state.zipCode}
                              onTextChange={(value) => {
                                this.onZipChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ....................................... */}

                    <div className="_button-style m30 _fl text-center">
                      <a
                        className="white-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.onAddressCancel}
                      >
                        Back
                      </a>
                      <a
                        className="blue-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.onAddressNext}
                      >
                        Next
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-3"></div>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment></React.Fragment>
        )}
        {this.state.showBillingPage ? (
          <React.Fragment>
            <div className="component-wrapper" hidden={this.state.isLoad}>
              {/* <h3 className="dcs">ADD NEW CLIENT</h3> */}
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
                            <Select
                              isDisabled={
                                this.state.billingIsSameAddress ? true : false
                              }
                              options={this.state.locationArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.billingLocationData}
                              placeholder="Select"
                              onChange={(value) =>
                                this.onBillingLocationChange(value)
                              }
                              onInputChange={(value) => {
                                this.onBillingLocationInputChange(value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-2"></div>
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span>Country</span>
                            <div class="dropdwn">
                              <Select
                                isDisabled={
                                  this.state.billingIsSameAddress ? true : false
                                }
                                options={this.state.billingCountryInfoArr}
                                components={{
                                  DropdownIndicator,
                                  IndicatorSeparator: () => null,
                                }}
                                defaultInputValue=""
                                value={this.state.billingCountryData}
                                // value={selectedOption}
                                placeholder="Select"
                                onChange={(value) =>
                                  this.onBillingCountryChange(value)
                                }
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
                            <Select
                              isDisabled={
                                this.state.billingIsSameAddress ? true : false
                              }
                              options={this.state.billingStateDataArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              defaultInputValue=""
                              value={this.state.billingStateData}
                              placeholder="Select"
                              onChange={(value) =>
                                this.onBillingStateChange(value)
                              }
                            />
                            {/* <div
                              class="dropdwn"
                              style={{ width: "100%", cursor: "pointer" }}
                            >
                            
                              <SelectBox
                                optionData={this.state.billingStateDataArr}
                                placeholder="Select"
                                onSelectChange={(value) => {
                                  this.onBillingStateChange(value);
                                }}
                              />
                            </div> */}
                          </div>
                        </div>
                        <div className="col-md-2"></div>
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span className="">City</span>
                            <InputText
                              disabled={
                                this.state.billingIsSameAddress ? true : false
                              }
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
                              disabled={
                                this.state.billingIsSameAddress ? true : false
                              }
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
          </React.Fragment>
        ) : (
          <React.Fragment></React.Fragment>
        )}
        {/* </div> */}
      </React.Fragment>
    );
  }
}
