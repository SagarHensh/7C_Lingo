import React from "react";
import history from "../../../history";
import "bootstrap/dist/css/bootstrap.css";
import "../../../css/myaccount-setting.css";
import { Link } from "react-router-dom";
import { SelectBox, InputText } from "../../Admin/SharedComponents/inputText";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import { ImageName } from "../../../enums";
import { AlertMessage } from "../../../enums";
import { ApiCall, ApiCallClient } from "../../../services/middleware";
import { ErrorCode } from "../../../services/constant";
import { Decoder } from "../../../services/auth";
import { IMAGE_PATH_ONLY, IMAGE_URL } from "../../../services/config/api_url";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import * as Action from ".././../../store/CombineReducer/actions/Action";

import {
  departmentValidator,
  emailValidator,
  inputEmptyValidate,
  mobileNumberValidator,
  numberValidator,
  zipValidate,
  newPassValidator,
  passwordValidator,
  websiteValidate,
} from "../../../validators/index";

import {
  consoleLog,
  getCountryList,
  getLookUpDataFromAPI,
  getVendorServiceList,
  phoneNumberCheck,
  SetDOBFormat,
} from "../../../services/common-function";

import { Regex } from "../../../services/config";
import { connect } from "react-redux";

// import Select from 'react-dropdown';
// import 'react-dropdown/style.css';

const industryTypeArr = [
  {
    label: "Hospital",
    value: 1,
  },
  {
    label: "Educaton",
    value: 2,
  },
  {
    label: "Tourism",
    value: 3,
  },
];

export class ClientProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adminAccDet: false,
      companyDet: false,
      addressDet: false,
      passwordDet: false,

      firstName: "",
      lastName: "",
      adminEmail: "",
      userRole: "",
      adminPhone: "",

      companyName: "",
      businessWeb: "",
      businessEmail: "",
      businessPhone: "",
      purchOrder: "",
      industryTypeId: "",
      industryTypeList: [],
      industryTypeData: {},
      fax: "",

      sameAddressCheck: false,
      primaryLocation: "",
      countryName: "",
      stateName: "",
      cityName: "",
      zipCode: "",
      billingLocation: "",
      billCountryName: "",
      billStateName: "",
      billCityName: "",
      billZipCode: "",
      billContactEmail: "",
      billContactName: "",
      billContactPhone: "",
      country: "",
      countryArr: [],
      countryData: {},
      primaryCountryId: "",
      billingCountryId: "",
      primaryStateId: "",
      billingStateId: "",
      primaryCountryData: {},
      secondaryCountryData: {},
      primaryStateArr: [],
      secondaryStateArr: [],
      primaryStateData: {},
      secondaryStateData: {},

      allAdddress: [],
      selectAddress: [],
      allAdddressBill: [],
      selectAddressBill: [],

      curentPassCheck: true,
      newPassCheck: true,
      cnfPassCheck: true,

      curPassword: "",
      newPassword: "",
      confPassword: "",

      imagePath: "images/profile-pic.png",
      profilePhoto: "",
      clientId: "",
      notes: "",

      contractPath: "",
      contractPathView: "",
      // ............
      countryCode: 1,
      businessCountryCode: 1,
      billingCountryCode: 1,
      primaryLocationClient: [],
      billingLocationClient: []
    };
  }

  componentDidMount() {
    window.$(".my-form-rw h3").click(function () {
      $(this).parent().find(".my-form-bx").slideToggle();
      $(this).toggleClass("open");
    });

    window.$(".myDropdown").ddslick();
    let auth = localStorage.getItem("AuthToken");
    let authUser = Decoder.decode(auth);
    // consoleLog("clientid=>", authUser);
    this.setState({
      clientId: authUser.data.userid,
    });
    // consoleLog("clientid=>", authUser.data.userid);

    this.getClientInfo();
    this.getCommonData();
  }

  getClientInfo = async () => {

    // static client is taken for static data otherwise client id is coming from mainData

    let auth = localStorage.getItem("AuthToken");
    let authUser = Decoder.decode(auth);
    this.setState({
      clientId: authUser.data.userid,
    });

    let clientId = {
      clientid: authUser.data.userid,
    };

    let res = await ApiCallClient("fetchclientinfoClient", clientId);
    let payload = Decoder.decode(res.data.payload);
    consoleLog("CLIENT PROFILE API RESP==>>", Decoder.decode(res.data.payload));
    let admindata = payload.data[0].userInfo[0];
    let companydata = payload.data[1].address[0];
    let billingdata = payload.data[2].billaddress[0];
    let tempContractPath = [];
    let contractFileName = "";
    let primaryLocArr = [],
      billingLocArr = [];

    if (companydata.countryId !== undefined || companydata.countryId !== "") {
      let countryData = {
        countryid: parseInt(companydata.countryId),
      };
    }
    if (admindata.ContractPath) {
      tempContractPath = admindata.ContractPath.split("/");
      if (tempContractPath.length > 3) {
        contractFileName = tempContractPath[4];
      }
    }

    if (companydata.lat !== undefined && companydata.lng !== undefined && companydata.locationName !== undefined && companydata.locationId !== undefined) {
      primaryLocArr.push({
        lat: companydata.lat,
        long: companydata.lng,
        locationName: companydata.locationName,
        locationId: companydata.locationId
      })
    }

    if (billingdata.lat !== undefined && billingdata.lng !== undefined && billingdata.locationName !== undefined && billingdata.locationId !== undefined) {
      billingLocArr.push({
        lat: billingdata.lat,
        long: billingdata.lng,
        locationName: billingdata.locationName,
        locationId: billingdata.locationId
      })
    }

    this.setState({

      firstName: admindata.fname,
      lastName: admindata.lName,
      adminEmail: admindata.email,
      adminPhone: "+1 " + admindata.adminPhone,
      userRole: "Client",
      companyName: admindata.clientName,
      businessWeb: admindata.website,
      businessEmail: admindata.businessEmail,
      purchOrder: admindata.purchaseOrder,
      businessPhone:
        "+" + this.state.businessCountryCode + " " + admindata.businessPhone,
      industryTypeId: admindata.industryType,
      fax: admindata.fax,
      primaryLocation: companydata.address,
      primaryCountryId: companydata.countryId,
      primaryStateId: companydata.stateId,
      cityName: companydata.city,
      zipCode: companydata.zipCode,
      billingLocation: billingdata.address,
      billingCountryId: billingdata.countryId,
      billingStateId: billingdata.stateId,
      billCityName: billingdata.city,
      billZipCode: billingdata.zipCode,
      country: companydata.countryId,
      imagePath: admindata.companyLogo,
      profilePhoto: IMAGE_PATH_ONLY + admindata.companyLogo,
      billContactName: admindata.billContactName,
      billContactEmail: admindata.billContactEmail,
      billContactPhone: "+1" + " " + admindata.billContactPhone,
      notes: admindata.notes,
      contractPath: admindata.ContractPath,
      contractPathView: contractFileName,
      selectAddress: primaryLocArr,
      selectAddressBill: billingLocArr
    });
  };

  getCommonData = async () => {
    let countryResData = await getCountryList();
    let industryTypeArrData = [],
      industryTypeIdData = {},
      countryArrData = [],
      countryIdData = {},
      primaryCountryIdData = {},
      billingCountryIdData = {},
      primaryStateIdData = {},
      billingStateIdData = {},
      stateObjData = {},
      stateObjDataBill = {};
    let lookUpData = await getLookUpDataFromAPI();
    for (let i = 0; i < lookUpData.INDUSTRY_TYPE.length; i++) {
      industryTypeArrData.push({
        label: lookUpData.INDUSTRY_TYPE[i].name,
        value: lookUpData.INDUSTRY_TYPE[i].id,
      });

      if (this.state.industryTypeId === lookUpData.INDUSTRY_TYPE[i].id) {
        industryTypeIdData = {
          label: lookUpData.INDUSTRY_TYPE[i].name,
          value: lookUpData.INDUSTRY_TYPE[i].id,
        };
      }
    }

    for (let l = 0; l < countryResData.length; l++) {
      countryArrData.push({
        label: countryResData[l].name,
        value: countryResData[l].id,
      });
      if (this.state.country === countryResData[l].id) {
        countryIdData = {
          label: countryResData[l].name,
          value: countryResData[l].id,
        };
      }
      if (this.state.primaryCountryId === countryResData[l].id) {
        primaryCountryIdData = {
          label: countryResData[l].name,
          value: countryResData[l].id,
        };
      }
      if (this.state.billingCountryId === countryResData[l].id) {
        billingCountryIdData = {
          label: countryResData[l].name,
          value: countryResData[l].id,
        };
      }
    }

    if (primaryCountryIdData.value === billingCountryIdData.value) {
      let countryParam = {
        countryid: primaryCountryIdData.value,
      };
      let res = await ApiCall("getstatelistofselectedcountry", countryParam);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let payload = Decoder.decode(res.data.payload);
        let stateData = payload.data.statelist;

        for (let i = 0; i < stateData.length; i++) {
          if (this.state.primaryStateId === stateData[i].id) {
            stateObjData = {
              label: stateData[i].name,
              value: stateData[i].id,
            };
          }
          if (this.state.billingStateId === stateData[i].id) {
            stateObjDataBill = {
              label: stateData[i].name,
              value: stateData[i].id,
            };
          }
        }
      }
    } else {
      let countryParam = {
        countryid: billingCountryIdData.value,
      };
      let res = await ApiCall("getstatelistofselectedcountry", countryParam);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let payload = Decoder.decode(res.data.payload);
        let stateData = payload.data.statelist;

        for (let i = 0; i < stateData.length; i++) {
          if (this.state.billingStateId === stateData[i].id) {
            stateObjDataBill = {
              label: stateData[i].name,
              value: stateData[i].id,
            };
          }
        }
      }
    }

    // console.log("CountryData",billingCountryIdData);
    this.setState({
      industryTypeList: industryTypeArrData,
      industryTypeData: industryTypeIdData,
      countryArr: countryArrData,
      countryData: countryIdData,
      primaryCountryData: primaryCountryIdData,
      secondaryCountryData: billingCountryIdData,
      primaryStateData: stateObjData,
      secondaryStateData: stateObjDataBill,
    });
  };

  onFNameChange = (e) => {
    var pattern = new RegExp(Regex.STRING_NUMBER_REGEX);
    if (departmentValidator(e.target.value)) {
      if (pattern.test(e.target.value)) {
        this.setState({
          firstName: e.target.value,
        });
      }
    }
  };

  onLNameChange = (e) => {
    var pattern = new RegExp(Regex.STRING_NUMBER_REGEX);
    if (departmentValidator(e.target.value)) {
      if (pattern.test(e.target.value)) {
        this.setState({
          lastName: e.target.value,
        });
      }
    }
  };

  onBusinessPhoneChange = (e) => {
    if (numberValidator(e.target.value) === true) {
      if (mobileNumberValidator(e.target.value) === true) {
        let phoneCheck = phoneNumberCheck(e.target.value);
        if (phoneCheck) {
          this.setState({
            businessPhone: phoneCheck,
          });
        }
      }
    }
  };

  onLocationSelect = async (event, value, reason, details) => {
    let locateAdd = [];
    // consoleLog("All Address view on Dropdown::", this.state.allAdddress)
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
          // consoleLog("Location primary autocomplete aerray::", locationArr)
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
              locationName: this.state.allAdddress[i].description,
              locationId: this.state.allAdddress[i].placeid
            });
            this.setState({
              selectAddress: locateAdd,
              primaryLocation : this.state.allAdddress[i].description
            });
          }
        }
      }
    }
  };

  onBillLocationSelect = async (event, value, reason, details) => {
    let locateAdd = [];
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
              locationName: this.state.allAdddress[i].description,
              locationId: this.state.allAdddress[i].placeid
            });
            this.setState({
              selectAddressBill: locateAdd,
              billingLocation : this.state.allAdddress[i].description
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

  changeUserPhone = (value) => {
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

  addressSubmit = async () => {
    let mobileNo = this.state.billContactPhone.substring(3, 15);
    let businessPhone = this.state.businessPhone.substring(3, 15);
    let adminPhone = this.state.adminPhone.substring(3, 15);
    let validatePrimaryLocation = inputEmptyValidate(
      this.state.primaryLocation
    );
    let validateBillingLocation = departmentValidator(
      this.state.billingLocation
    );
    let validateCountry = inputEmptyValidate(
      this.state.primaryCountryData.value
    );
    let validateBillCountry = inputEmptyValidate(
      this.state.secondaryCountryData.value
    );
    let validateState = inputEmptyValidate(this.state.primaryStateData.value);
    let validateBillState = inputEmptyValidate(
      this.state.secondaryStateData.value
    );
    let validateCity = inputEmptyValidate(this.state.cityName);
    let validateBillCity = inputEmptyValidate(this.state.billCityName);
    let validateZip = inputEmptyValidate(this.state.zipCode);
    let validateBillZip = inputEmptyValidate(this.state.billZipCode);

    let errorCounter = 0;
    if (validatePrimaryLocation === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ADDRESSINFO_LOCATION, {
        hideProgressBar: true,
      });
      errorCounter++;
    } else if (validateBillingLocation === false) {
      errorCounter++;
      toast.error(
        AlertMessage.MESSAGE.CLIENT_PROFILE.EMPTY_ADDRESSINFO_BILLING_LOCATION,
        {
          hideProgressBar: true,
        }
      );
    } else if (validateCountry === false) {
      errorCounter++;
      toast.error(AlertMessage.MESSAGE.COUNTRY.EMPTY_COUNTRY, {
        hideProgressBar: true,
      });
    } else if (validateBillCountry === false) {
      errorCounter++;
      toast.error(
        AlertMessage.MESSAGE.CLIENT_PROFILE.EMPTY_ADDRESSINFO_BILLING_COUNTRY,
        { hideProgressBar: true }
      );
    } else if (validateState === false) {
      errorCounter++;
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ADDRESSINFO_STATE, {
        hideProgressBar: true,
      });
    } else if (validateBillState === false) {
      errorCounter++;
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ADDRESSINFO_BILLING_STATE, {
        hideProgressBar: true,
      });
    } else if (validateCity === false) {
      errorCounter++;
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ADDRESSINFO_CITY, {
        hideProgressBar: true,
      });
    } else if (validateBillCity === false) {
      errorCounter++;
      toast.error(
        AlertMessage.MESSAGE.CLIENT_PROFILE.EMPTY_ADDRESSINFO_BILLING_CITY,
        { hideProgressBar: true }
      );
    } else if (validateZip === false) {
      errorCounter++;
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ADDRESSINFO_ZIP, {
        hideProgressBar: true,
      });
    } else if (validateBillZip === false) {
      errorCounter++;
      toast.error(
        AlertMessage.MESSAGE.CLIENT_PROFILE.EMPTY_ADDRESSINFO_BILLING_ZIP,
        { hideProgressBar: true }
      );
    }
    if (errorCounter === 0) {
      let data = {
        clientname: this.state.companyName,
        industryid: this.state.industryTypeId,
        businessemail: this.state.businessEmail,
        businessphone: businessPhone,
        countrycode: this.state.primaryCountryId,
        website: this.state.businessWeb,
        purchaseorder: this.state.purchOrder,
        fax: this.state.fax,
        companylogo: this.state.imagePath,
        // "status": this.state.checkStatus ? "1" : "0",
        fname: this.state.firstName,
        lname: this.state.lastName,
        email: this.state.adminEmail,
        mobile: adminPhone,
        password: this.state.confPassword,
        // "outoftown": this.state.isSelected ? "1" : "0",
        clientId: 1,
        clientid: this.state.clientId,
        primaryaddress: this.state.primaryLocation,
        primarycountryid: this.state.primaryCountryId,
        primarystateid: this.state.primaryStateId,
        primarycity: this.state.cityName,
        primaryzipcode: this.state.zipCode,
        primarylocation: this.state.selectAddress,
        billinglocation: this.state.selectAddressBill,
        billingaddress: this.state.billingLocation,
        billingcountryid: this.state.billingCountryId,
        billingstateid: this.state.billingStateId,
        billingcity: this.state.billCityName,
        billingzipcode: this.state.billZipCode,
        sameaddress: this.state.sameAddressCheck ? "1" : "0",
        billContactName: this.state.billContactName,
        billContactEmail: this.state.billContactEmail,
        billContactPhone: mobileNo,
        notes: this.state.notes,
        contractPath: this.state.contractPath,
      };

      // console.log("Address Data==>", data);

      let res = await ApiCallClient("modifyclientinfoClient", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.CLIENT.CLIENT_UPDATED_SUCCESS, {
          hideProgressBar: true,
        });
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

  // same address check
  sameBillAddress = (e) => {
    this.setState({ sameAddressCheck: !this.state.sameAddressCheck });
    // console.log("========>>", this.state.selectAddress);
    if (e.target.checked) {
      this.setState({
        // billingLocation: this.state.primaryLocation,
        selectAddressBill: this.state.selectAddress,
        secondaryCountryData: this.state.primaryCountryData,
        secondaryStateData: this.state.primaryStateData,
        billingLocation: this.state.primaryLocation,
        billCityName: this.state.cityName,
        billZipCode: this.state.zipCode,
        billingIsSameAddress: !this.state.billingIsSameAddress,
      });
    } else {
      this.setState({
        // primaryLocation:"",
        selectAddressBill: {},
        secondaryCountryData: "",
        secondaryStateData: "",
        billingLocation: "",
        billCityName: "",
        billZipCode: "",
        billingIsSameAddress: !this.state.billingIsSameAddress,
      });
    }
    // console.log("========>>", this.state.selectAddress, "<========>", this.state.selectAddressBill);
  };

  resetPasswordField = () => {
    this.setState({
      curPassword: "",
      newPassword: "",
      confPassword: "",
    });
  };

  passwordSubmit = async () => {

    let mobileNo = this.state.billContactPhone.substring(3, 15);
    let businessPhone = this.state.businessPhone.substring(3, 15);
    let adminPhone = this.state.adminPhone.substring(3, 15);
    let errorCounter = 0;
    let currentPasswordStatus = passwordValidator(this.state.curPassword);
    let newPasswordStatus = newPassValidator(this.state.newPassword);
    let confirmPasswordStatus = inputEmptyValidate(this.state.confPassword);

    if (currentPasswordStatus.status === false) {
      toast.error(currentPasswordStatus.message, { hideProgressBar: true });
      errorCounter++;
    }
    if (newPasswordStatus.status === false) {
      toast.error(newPasswordStatus.message, { hideProgressBar: true });
      errorCounter++;
    } else {
      if (confirmPasswordStatus === false) {
        toast.error(AlertMessage.MESSAGE.PASSWORD.CNF_PASS_EMPTY, {
          hideProgressBar: true,
        });
        errorCounter++;
      }
    }

    if (errorCounter === 0) {
      if (this.state.curPassword === this.state.newPassword) {
        toast.error(AlertMessage.MESSAGE.PASSWORD.DUPLICATE_PASS, {
          hideProgressBar: true,
        });
      } else {
        if (this.state.newPassword != this.state.confPassword) {
          toast.error(AlertMessage.MESSAGE.PASSWORD.PASS_CNFPASS_NOT_MATCH, {
            hideProgressBar: true,
          });
        } else {
          let data = {
            oldpass: this.state.curPassword,
            newpass: this.state.newPassword,
            reqtime: Date.now(),
          };
        }
      }
      // console.log("ball", this.state.curPassword, "ball", this.state.newPassword, "ball", this.state.confPassword)
      let data = {
        clientname: this.state.companyName,
        industryid: this.state.industryTypeId,
        businessemail: this.state.businessEmail,
        businessphone: businessPhone,
        countrycode: this.state.primaryCountryId,
        website: this.state.businessWeb,
        purchaseorder: this.state.purchOrder,
        fax: this.state.fax,
        companylogo: this.state.imagePath,
        // "status": this.state.checkStatus ? "1" : "0",
        fname: this.state.firstName,
        lname: this.state.lastName,
        email: this.state.adminEmail,
        mobile: adminPhone,
        password: this.state.confPassword,
        // "outoftown": this.state.isSelected ? "1" : "0",
        clientId: 1,
        clientid: this.state.clientId,
        primaryaddress: this.state.primaryLocation,
        primarycountryid: this.state.primaryCountryId,
        primarystateid: this.state.primaryStateId,
        primarycity: this.state.cityName,
        primaryzipcode: this.state.zipCode,
        primarylocation: this.state.selectAddress,
        billinglocation: this.state.selectAddressBill,
        billingaddress: this.state.billingLocation,
        billingcountryid: this.state.billingCountryId,
        billingstateid: this.state.billingStateId,
        billingcity: this.state.billCityName,
        billingzipcode: this.state.billZipCode,
        sameaddress: this.state.sameAddressCheck ? "1" : "0",
        billContactName: this.state.billContactName,
        billContactEmail: this.state.billContactEmail,
        billContactPhone: mobileNo,
        notes: this.state.notes,
        contractPath: this.state.contractPath,
      };

      // console.log("password Data==>", data);

      let res = await ApiCallClient("modifyclientinfoClient", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.CLIENT.CLIENT_UPDATED_SUCCESS, {
          hideProgressBar: true,
        });
        localStorage.removeItem("AuthToken");
        return history.push("/");
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

  companySubmit = async (val) => {
    // consoleLog("value", val);
    let mobileNo = this.state.businessPhone.substring(3, 15);
    let adminPhne = this.state.adminPhone.substring(3, 15);
    let billingPhne = this.state.billContactPhone.substring(3, 15);
    let errorCount = 0;
    let validateName = inputEmptyValidate(this.state.companyName);
    let validateNameLength = departmentValidator(this.state.companyName);
    let validateEmail = emailValidator(this.state.businessEmail);
    let validatePhone = inputEmptyValidate(mobileNo);
    let validateIndustry = inputEmptyValidate(
      this.state.industryTypeData.value
    );
    let validateWebsite = websiteValidate(this.state.businessWeb);
    if (val == "profile") {
      if (validateName === false) {
        toast.error(AlertMessage.MESSAGE.USER.NAME_VALID, {
          hideProgressBar: true,
        });
        errorCount++;
      } else if (validateNameLength === false) {
        toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
          hideProgressBar: true,
        });
        errorCount++;
      } else if (validateEmail.status === false) {
        toast.error(AlertMessage.MESSAGE.EMAIL.BUSSINESS_EMAIL_EMPTY, {
          hideProgressBar: true,
        });
        errorCount++;
      } else if (validatePhone === false) {
        toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY, {
          hideProgressBar: true,
        });
        errorCount++;
      } else if (validateIndustry === false) {
        toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_INDUSTRY_EMPTY, {
          hideProgressBar: true,
        });
        errorCount++;
      }
    } else {
      if (validateName === false) {
        toast.error(AlertMessage.MESSAGE.USER.NAME_VALID, {
          hideProgressBar: true,
        });
        errorCount++;
      } else if (validateNameLength === false) {
        toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
          hideProgressBar: true,
        });
        errorCount++;
      } else if (validateWebsite === false) {
        toast.error(AlertMessage.MESSAGE.WEBSITE.INVALID_WEBSITE, {
          hideProgressBar: true,
        });
        errorCount++;
      } else if (validateEmail.status === false) {
        toast.error(AlertMessage.MESSAGE.EMAIL.BUSSINESS_EMAIL_EMPTY, {
          hideProgressBar: true,
        });
        errorCount++;
      } else if (validatePhone === false) {
        toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY, {
          hideProgressBar: true,
        });
        errorCount++;
      } else if (validateIndustry === false) {
        toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_INDUSTRY_EMPTY, {
          hideProgressBar: true,
        });
        errorCount++;
      }
    }

    if (errorCount === 0) {
      // let mainData = this.props.location;
      // let preData = mainData.state;

      // let companyData = {
      //     "companyName": this.state.companyName,
      //     "businessWeb": this.state.businessWeb,
      //     "businessEmail": this.state.businessEmail,
      //     "businessPhone": this.state.businessPhone,
      //     "purchOrder": this.state.purchOrder,
      //     "industryType": this.state.industryType,
      //     "fax": this.state.fax
      // };

      let data = {
        clientname: this.state.companyName,
        industryid: this.state.industryTypeId,
        businessemail: this.state.businessEmail,
        businessphone: mobileNo,
        countrycode: this.state.primaryCountryId,
        website: this.state.businessWeb,
        purchaseorder: this.state.purchOrder,
        fax: this.state.fax,
        companylogo: this.state.imagePath,
        status: this.state.checkStatus ? "1" : "0",
        fname: this.state.firstName,
        lname: this.state.lastName,
        email: this.state.adminEmail,
        // mobile: this.state.adminPhone,
        mobile: adminPhne,
        password: this.state.confPassword,
        outoftown: this.state.isSelected ? "1" : "0",
        clientId: 1,
        clientid: this.state.clientId,
        primaryaddress: this.state.primaryLocation,
        primarycountryid: this.state.primaryCountryId,
        primarystateid: this.state.primaryStateId,
        primarycity: this.state.cityName,
        primaryzipcode: this.state.zipCode,
        primarylocation: this.state.selectAddress,
        billinglocation: this.state.selectAddressBill,
        billingaddress: this.state.billingLocation,
        billingcountryid: this.state.billingCountryId,
        billingstateid: this.state.billingStateId,
        billingcity: this.state.billCityName,
        billingzipcode: this.state.billZipCode,
        sameaddress: this.state.sameAddressCheck ? "1" : "0",
        billContactName: this.state.billContactName,
        billContactEmail: this.state.billContactEmail,
        billContactPhone: billingPhne,
        notes: this.state.notes,
        contractPath: this.state.contractPath,
      };

      // console.log("Company Data==>", data);

      let res = await ApiCallClient("modifyclientinfoClient", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.CLIENT.CLIENT_UPDATED_SUCCESS, {
          hideProgressBar: true,
        });
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

  onContractChange = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      // console.log("=====>>", res.data.data);
      this.setState({
        contractPath: res.data.data.path + res.data.data.filename,
        contractPathView: res.data.data.filename,
      });
    });
  };

  onProfileImage = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      // console.log("=====>>", res.data.data);
      this.setState({
        imagePath: res.data.data.path + res.data.data.filename,
        profilePhoto:
          IMAGE_PATH_ONLY + res.data.data.path + res.data.data.filename,
      });
      this.props.getDemo(res.data.data.url);
      this.companySubmit();
    });
    // consoleLog("==",this.state.imagePath);
  };

  // for passwor section
  currentPassword = (value) => {
    this.setState({
      curPassword: value.trim(),
    });
  };

  newPassword = (value) => {
    this.setState({
      newPassword: value.trim(),
    });
  };

  confirmPassword = (value) => {
    this.setState({
      confPassword: value.trim(),
    });
  };

  // password view or not
  changeEye = (data) => {
    let curentPassCheck = this.state.curentPassCheck,
      newPassCheck = this.state.newPassCheck,
      cnfPassCheck = this.state.cnfPassCheck;
    if (data === "curPass") {
      curentPassCheck = !curentPassCheck;
    } else if (data === "newPass") {
      newPassCheck = !newPassCheck;
    } else if (data === "cnfPass") {
      cnfPassCheck = !cnfPassCheck;
    }
    this.setState({
      curentPassCheck: curentPassCheck,
      newPassCheck: newPassCheck,
      cnfPassCheck: cnfPassCheck,
    });
  };

  onZipChange = (e) => {
    let val = zipValidate(e.target.value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        zipCode: val,
      });
    }
  };

  billPhoneChange = (e) => {
    // console.log(e.target.value);
    // this.setState({
    //   billContactPhone: e.target.value,
    // });
    if (numberValidator(e.target.value) === true) {
      if (mobileNumberValidator(e.target.value) === true) {
        let phoneCheck = phoneNumberCheck(e.target.value);
        if (phoneCheck) {
          this.setState({
            billContactPhone: phoneCheck,
          });
        }
      }
    }
  };
  onBillContactNameChange = (e) => {
    this.setState({
      billContactName: e.target.value,
    })
  }
  onBillEmailChange = (e) => {
    this.setState({
      billContactEmail: e.target.value,
    })
  }
  onNotesChange = (e) => {
    // console.log(e.target.value);
    this.setState({
      notes: e.target.value,
    });
  };


  onBillingZipChange = (e) => {
    // console.log(e.target.value)
    let val = zipValidate(e.target.value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        billZipCode: val,
      });
    }
  };

  changeBillCityName = (e) => {
    this.setState({
      billCityName: e.target.value,
    });
  };

  changeBillStateName = (e) => {
    this.setState({
      secondaryStateData: e,
    });
  };

  changeBillCountry = async (data) => {
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
    this.setState({
      secondaryCountryData: data,
      secondaryStateArr: arrState,
    });
    // console.log("country=>>", this.state.secondaryCountryData);
  };

  changeCity = (e) => {
    this.setState({
      cityName: e.target.value,
    });
  };

  changeState = (e) => {
    this.setState({
      primaryStateData: e,
    });
    // console.log("state=>>", e);
  };

  changeCountry = async (data) => {
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
    this.setState({
      primaryCountryData: data,
      primaryStateArr: arrState,
    });
    //   console.log("country=>>",this.state.primaryCountryData);
  };

  changeFax = (e) => {
    this.setState({
      fax: e.value,
    });
  };

  changeIndustryType = (e) => {
    this.setState({
      industryTypeData: e,
    });
  };

  // adminDetState = (data) => {
  //     // console.log(data)
  //     let adminCount = this.state.adminAccDet,
  //         companyCount = this.state.companyDet,
  //         addressCount = this.state.addressDet,
  //         passCount = this.state.passwordDet;
  //     if (data === 0) {
  //         adminCount = !adminCount;
  //     }
  //     if (data === 1) {
  //         companyCount = !companyCount;

  //     }
  //     if (data === 2) {
  //         addressCount = !addressCount;

  //     }
  //     if (data === 3) {
  //         passCount = !passCount;

  //     }
  //     this.setState({
  //         adminAccDet: adminCount,
  //         companyDet: companyCount,
  //         addressDet: addressCount,
  //         passwordDet: passCount
  //     });
  // }

  onCompanyNameChange = (e) => {
    this.setState({
      companyName: e.target.value,
    });
  };
  onWebsiteChange = (e) => {
    {
      this.setState({ businessWeb: e.target.value });
    }
  };
  onBusinessEmailChange = (e) => {
    this.setState({ businessEmail: e.target.value });
  };

  onPurchaseOrderChange = (e) => {
    this.setState({ purchOrder: e.target.value });
  };

  onFaxChange = (e) => {
    this.setState({ fax: e.target.value })
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer hideProgressBar theme="colored" />
        <div className="component-wrapper">
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            {" "}
            <Link to="/clientDashboard">Dashboard</Link> / Client Profile
          </div>
          <div className="myaccount-section-wrap _fl">
            <div className="row">
              <div className="col-md-8">
                <div className="my-form-rw _fl">
                  <h3 className="open">Admin Account Details </h3>
                  <div className="my-form-bx" style={{ display: "block" }}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">First Name&nbsp;*</span>
                          <input
                            type="text"
                            name=""
                            placeholder=""
                            className="in-field2"
                            value={this.state.firstName}
                            onChange={(e) => this.onFNameChange(e)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Last Name&nbsp;*</span>
                          <input
                            type="text"
                            name=""
                            placeholder=""
                            className="in-field2"
                            value={this.state.lastName}
                            onChange={(e) => this.onLNameChange(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Email&nbsp;*</span>
                          <input
                            type="text"
                            value={this.state.adminEmail}
                            name=""
                            placeholder=""
                            className="in-field2"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Role&nbsp;*</span>
                          <input
                            type="text"
                            value={this.state.userRole}
                            name=""
                            placeholder="Client Admin"
                            className="in-field2"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Phone Number&nbsp;*</span>
                          {/* <input type="text" value="" name="" placeholder="" className="in-field2"
                                                        value={this.state.adminPhone}
                                                    /> */}
                          <InputText
                            value={this.state.adminPhone}
                            placeholder=""
                            onTextChange={(value) => {
                              this.changeUserPhone(value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 text-center">
                          <button
                            type="submit"
                            className="sv_btn"
                            onClick={() => this.companySubmit("profile")}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-form-rw _fl">
                  <h3>Company Details </h3>
                  <div className="my-form-bx">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Company Name&nbsp;*</span>
                          <input
                            type="text"
                            name=""
                            placeholder=""
                            className="in-field2"
                            value={this.state.companyName}
                            onChange={(e) => this.onCompanyNameChange(e)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Website</span>
                          <input
                            type="text"
                            name=""
                            placeholder=""
                            className="in-field2"
                            value={this.state.businessWeb}
                            onChange={(e) => this.onWebsiteChange(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Business Email&nbsp;*</span>
                          <input
                            type="text"
                            name=""
                            placeholder=""
                            className="in-field2"
                            value={this.state.businessEmail}
                            onChange={(e) => this.onBusinessEmailChange(e)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Purchase Order#</span>
                          <input
                            type="text"
                            name=""
                            className="in-field2"
                            value={this.state.purchOrder}
                            onChange={(e) => this.onPurchaseOrderChange(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Business Phone&nbsp;*</span>
                          <input
                            type="text"
                            name=""
                            placeholder=""
                            className="in-field2"
                            value={this.state.businessPhone}
                            onChange={(e) => this.onBusinessPhoneChange(e)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Industry Type&nbsp;*</span>
                          <SelectBox
                            optionData={this.state.industryTypeList}
                            placeholder="Select"
                            value={this.state.industryTypeData}
                            onSelectChange={(value) => {
                              this.changeIndustryType(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Fax</span>
                          <input
                            type="text"
                            name=""
                            placeholder=""
                            className="in-field2"
                            value={this.state.fax}
                            onChange={(e) => this.onFaxChange(e)}


                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form_rbx">
                          <span className="">Contract</span>
                          <div className="doc-opload">
                            <label
                              for="myfile"
                              className="file-sheet"
                              style={{ cursor: "pointer" }}
                            >
                              {this.state.contractPath === "" ? (
                                <span>Select a file:</span>
                              ) : (
                                <React.Fragment>
                                  <span>{this.state.contractPathView}</span>
                                </React.Fragment>
                              )}
                            </label>
                            <input
                              type="file"
                              id="myfile"
                              name="myfile"
                              style={{ display: "none" }}
                              onChange={this.onContractChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <button
                          type="submit"
                          className="sv_btn"
                          onClick={() => this.companySubmit("company")}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-form-rw _fl">
                  <h3>Address Info</h3>
                  <div className="my-form-bx">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form_rbx">
                          <Autocomplete
                            id="free-solo-demo"
                            freeSolo
                            size="small"
                            value={this.state.primaryLocation}
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
                          <div className="ak">
                            <img
                              src={ImageName.IMAGE_NAME.LOCATION}
                              style={{ margin: "-1px" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Country&nbsp;*</span>
                          <SelectBox
                            optionData={this.state.countryArr}
                            placeholder="Select"
                            value={this.state.primaryCountryData}
                            onSelectChange={(value) => {
                              this.changeCountry(value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">State&nbsp;*</span>
                          <SelectBox
                            optionData={this.state.primaryStateArr}
                            placeholder="Select"
                            value={this.state.primaryStateData}
                            onSelectChange={(value) => {
                              this.changeState(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">City&nbsp;*</span>
                          <input
                            type="text"
                            name=""
                            placeholder=""
                            className="in-field2"
                            value={this.state.cityName}
                            onChange={(e) => this.changeCity(e)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Zip Code</span>
                          <input
                            type="text"
                            name=""
                            placeholder=""
                            className="in-field2"
                            value={this.state.zipCode}
                            onChange={(e) => this.onZipChange(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="billing-info">
                      <h4>Billing Info</h4>
                      <label className="custom_check">
                        Same as Address Info
                        <input
                          type="checkbox"
                          onChange={this.sameBillAddress}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="billing-address-info">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form_rbx">
                            <Autocomplete
                              id="free-solo-demo"
                              freeSolo
                              size="small"
                              value={this.state.billingLocation}
                              onChange={(event, value, reason, details) =>
                                this.onBillLocationSelect(
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
                            <div className="ak">
                              <img
                                src={ImageName.IMAGE_NAME.LOCATION}
                                style={{ margin: "-1px" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form_rbx">
                            <span className="">Country&nbsp;*</span>
                            <SelectBox
                              optionData={this.state.countryArr}
                              placeholder="Select"
                              value={this.state.secondaryCountryData}
                              onSelectChange={(value) => {
                                this.changeBillCountry(value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form_rbx">
                            <span className="">State&nbsp;*</span>
                            <SelectBox
                              optionData={this.state.secondaryStateArr}
                              placeholder="Select"
                              value={this.state.secondaryStateData}
                              onSelectChange={(value) => {
                                this.changeBillStateName(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form_rbx">
                            <span className="">City&nbsp;*</span>
                            <input
                              type="text"
                              name=""
                              placeholder=""
                              className="in-field2"
                              value={this.state.billCityName}
                              onChange={(e) => this.changeBillCityName(e)}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form_rbx">
                            <span className="">Zip Code</span>
                            <input
                              type="text"
                              name=""
                              placeholder=""
                              className="in-field2"
                              value={this.state.billZipCode}
                              onChange={(e) => this.onBillingZipChange(e)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="billing-info">
                      <h4>Billing Contact Info</h4>
                    </div>
                    <div className="billing-address-info">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form_rbx">
                            <span className="">
                              Billing Contact Name&nbsp;*
                            </span>
                            <input
                              type="text"
                              name=""
                              placeholder=""
                              className="in-field2"
                              value={this.state.billContactName}
                              onChange={(e) => this.onBillContactNameChange(e)}

                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form_rbx">
                            <span className="">
                              Billing Contact Email&nbsp;*
                            </span>
                            <input
                              type="text"
                              name=""
                              placeholder=""
                              className="in-field2"
                              value={this.state.billContactEmail}
                              onChange={(e) => this.onBillEmailChange(e)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form_rbx">
                            <span className="">
                              Billing Contact Phone No.&nbsp;*
                            </span>
                            <input
                              type="text"
                              name=""
                              placeholder=""
                              className="in-field2"
                              value={this.state.billContactPhone}
                              onChange={(e) => this.billPhoneChange(e)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-8">
                          <div className="form_rbx">
                            <span className="">Notes&nbsp;*</span>
                            <textarea
                              placeholder=""
                              className="in-textarea min"
                              value={this.state.notes}
                              onChange={(e) => this.onNotesChange(e)}

                              style={{ resize: "none" }}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <button
                          type="submit"
                          className="sv_btn"
                          onClick={this.addressSubmit}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-form-rw _fl">
                  <h3>Change Password</h3>
                  <div className="my-form-bx">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Current Password&nbsp;*</span>
                          <div className="_psw">
                            <InputText
                              type={
                                this.state.curentPassCheck ? "password" : "text"
                              }
                              placeholder=""
                              className="in-field3_cp"
                              value={this.state.curPassword}
                              onTextChange={(value) => {
                                this.currentPassword(value);
                              }}
                            />
                            <button
                              className={
                                this.state.curentPassCheck ? "shclose" : "sh"
                              }
                              onClick={() => this.changeEye("curPass")}
                            >
                              eye
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">New Password&nbsp;*</span>
                          <div className="_psw">
                            <InputText
                              type={
                                this.state.newPassCheck ? "password" : "text"
                              }
                              placeholder=""
                              className="in-field3_cp"
                              value={this.state.newPassword}
                              onTextChange={(value) => {
                                this.newPassword(value);
                              }}
                            />
                            <button
                              className={
                                this.state.newPassCheck ? "shclose" : "sh"
                              }
                              onClick={() => this.changeEye("newPass")}
                            >
                              eye
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          <span className="">Confirm Password&nbsp;*</span>
                          <div className="_psw">
                            <InputText
                              type={
                                this.state.cnfPassCheck ? "password" : "text"
                              }
                              placeholder=""
                              className="in-field3_cp"
                              value={this.state.confPassword}
                              onTextChange={(value) => {
                                this.confirmPassword(value);
                              }}
                            />
                            <button
                              className={
                                this.state.cnfPassCheck ? "shclose" : "sh"
                              }
                              onClick={() => this.changeEye("cnfPass")}
                            >
                              eye
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row m20">
                      <div className="col-md-12 text-center">
                        <button
                          type="submit"
                          className="cn_btn"
                          onClick={this.resetPasswordField}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="sv_btn"
                          onClick={this.passwordSubmit}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="c-logo">
                  <img
                    className="border_50_img"
                    src={this.state.profilePhoto}
                  />
                  <button className="pht">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={this.onProfileImage}
                    />
                  </button>
                </div>
                {/* <h4 className="h4_text">{this.state.clientId}</h4> */}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  let data = state;
  return {
    data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDemo: (imagePath) => {
      dispatch(Action.valueChange(imagePath));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientProfile);
