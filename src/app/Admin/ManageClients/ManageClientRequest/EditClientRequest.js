import React, { Component } from "react";
import { styled, Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import { ToastContainer, toast } from "react-toastify";
import { ApiCall, ApiCallClient } from "../../../../services/middleware";
import history from "../../../../history";
import { InputText, SelectBox } from "../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../enums";
import $, { data } from "jquery";
import "./clientRequest.css";
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
import {
  consoleLog,
  getClientInfo,
  phoneNumberCheck,
} from "../../../../services/common-function";
import { ErrorCode } from "../../../../services/constant";
import ReactLoader from "../../../Loader";
import {
  IMAGE_PATH_ONLY,
  IMAGE_STORE_PATH,
  IMAGE_URL,
} from "../../../../services/config/api_url";
import axios from "axios";
import Select, { components } from "react-select";
import { Link } from "react-router-dom";
import AccountInformation from "./SubComponents/AccountInformation";
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

// For Dropdown

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

export default class EditClientRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: true,
      showPage: false,
      showBillingPage: false,
      isLoad: true,
      checkStatus: false,
      isSelected_merge: "false",
      uname: "",
      businessEmail: "",
      businessPhone: "",
      website: "",
      fax: "",
      purchaseOrder: "",
      industryArr: [],
      industryData: {},
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
      location: "",
      locationData: {},

      locationArr: [],
      billingLocationArr: [],

      allAdddress: [],
      selectAddress: [],
      isSelected: null,
      selectedLocation: "",
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
      allClientArr:[],
      clientData:{}
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    // this.setState({
    //   locationData: {
    //     label: "def",
    //     value: 111111,
    //   },
    // });

    window.$(".my-form-rw h3").click(function () {
      $(this).parent().find(".my-form-bx").slideToggle();
      $(this).toggleClass("open");
    });

    // this.fetchClientInfo();
    this.load();
  }

  load = async () => {
    let industryDataArr = [],
      clientAddressData = [],
      clientBillAddressData = [],
      clientUserData={},
      industryData = {},
      clientArr=[],
      allClientArr=[];
      // allClientArr = await getClientInfo();

    let mainData = this.props.location;
    let preData = mainData.state;
    consoleLog("preData::",preData)
    let clientData = {
      clientid: preData.userId,
    };
    consoleLog("clientData:::",clientData)
    let clientInfoRes = await ApiCall("fetchclientinfoForMerge", clientData);

    if (
      clientInfoRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      clientInfoRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(clientInfoRes.data.payload);
      consoleLog("clientRepayloads::", payload);
       clientUserData = payload.data;

      //  ................approved client ..,,,,,,,,,,,,,,

      let clientApprovedRes = await ApiCall("fetchApproveClientList");

      // consoleLog("client dropsown::",clientApprovedRes);
      if (
        clientApprovedRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        clientApprovedRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        consoleLog("client dropsown: iii:",Decoder.decode(clientApprovedRes.data.payload));
         clientArr = Decoder.decode(clientApprovedRes.data.payload);
      

        clientArr.data.map((obj) => {
          allClientArr.push({
            label:obj.name,
            value:obj.clientId
          })
         
        })
      }

      // ...........location .................
      // let arrData = [],
      //   locationDataObj = {};
      // let locationData = [];
      // let locationRes = await ApiCall("getlocaiondescription", {
      //   place: clientAddressData.address,
      // });
      // if (
      //   locationRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      //   locationRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      // ) {
      //   let locationArr = Decoder.decode(locationRes.data.payload);
      //   locationData = locationArr.data.locaionsuggesion;
      //   // consoleLog("data::::location:", locationData);
      //   for (let i = 0; i < locationData.length; i++) {
      //     arrData.push({
      //       label: locationData[i].description,
      //       value: locationData[i].placeid,
      //     });
      //     locationDataObj = {
      //       label: locationData[i].description,
      //       value: locationData[i].placeid,
      //     };
      //   }

      //   let obj = {
      //     placeid: locationDataObj.value,
      //   };
      //   let locationDataPlace = await ApiCall("getcoordinatefromplaceid", obj);
      //   if (
      //     locationDataPlace.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      //     locationDataPlace.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      //   ) {
      //     let locationArr = Decoder.decode(locationDataPlace.data.payload);
      //     let locateAdd = {};
      //     locateAdd = {
      //       lat: locationArr.data.coordinatedetails[0].lat,
      //       long: locationArr.data.coordinatedetails[0].lng,
      //       locationName: locationDataObj.label,
      //       locationId: locationDataObj.value,
      //     };
      //     this.setState({
      //       selectLocation: locateAdd,
      //     });
      //   }

      //   this.setState({
      //     locationArr: arrData,
      //     //   locationData: val,
      //   });
      // }

      // .......................billing location,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

      // let arrDataBill = [],
      //   locationDataObjBill = {};
      // let locationDataBill = [];
      // let locationResBill = await ApiCall("getlocaiondescription", {
      //   place: clientBillAddressData.address,
      // });
      // if (
      //   locationResBill.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      //   locationResBill.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      // ) {
      //   let locationArr = Decoder.decode(locationResBill.data.payload);
      //   locationDataBill = locationArr.data.locaionsuggesion;
      //   for (let i = 0; i < locationDataBill.length; i++) {
      //     arrDataBill.push({
      //       label: locationDataBill[i].description,
      //       value: locationDataBill[i].placeid,
      //     });
      //     locationDataObjBill = {
      //       label: locationDataBill[i].description,
      //       value: locationDataBill[i].placeid,
      //     };
      //   }
      //   let obj = {
      //     placeid: locationDataObjBill.value,
      //   };
      //   let locationDataPlaceBill = await ApiCall(
      //     "getcoordinatefromplaceid",
      //     obj
      //   );
      //   if (
      //     locationDataPlaceBill.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      //     locationDataPlaceBill.respondcode ===
      //       ErrorCode.ERROR.ERROR_CODE.SUCCESS
      //   ) {
      //     let locationArr = Decoder.decode(locationDataPlaceBill.data.payload);
      //     let locateAddBill = {};
      //     locateAddBill = {
      //       lat: locationArr.data.coordinatedetails[0].lat,
      //       long: locationArr.data.coordinatedetails[0].lng,
      //       locationName: locationDataObjBill.label,
      //       locationId: locationDataObjBill.value,
      //     };
      //     this.setState({
      //       selectLocation: locateAddBill,
      //     });
      //   }

      //   this.setState({
      //     billingLocationArr: arrDataBill,
      //   });
      // }

      this.setState({
        uname: clientUserData.clientName,
        industryTypeId: clientUserData.industryType,
        businessEmail: clientUserData.businessEmail,
      businessPhone: "+" + this.state.billingCountryCode + " " + clientUserData.businessPhone,
        
        website: clientUserData.website,
        fax: clientUserData.fax,
      //   purchaseOrder: clientUserData.purchaseOrder,
      //   checkStatus: clientUserData.status === 1 ? true : false,
        fname: clientUserData.fname,
        lname: clientUserData.lName,
      //   email: clientUserData.email,
        phone: "+" + this.state.countryCode + " " + "",

      //   // phone: clientUserData.adminPhone,
        isSelected: clientUserData.isOutOfTown === 1 ? true : false,
      //   // selectedLocation: clientAddressData.address,
      //   locationData: locationDataObj,

      //   countryId: clientAddressData.countryId,
      //   stateId: clientAddressData.stateId,
      //   city: clientAddressData.city,
      //   zipCode: clientAddressData.zipCode,
      //   adminPhoto: clientUserData.companyLogo,
      //   // billingSelectedLocation: clientBillAddressData.address,
      //   billingLocationData: locationDataObjBill,
      //   billingCountryId: clientBillAddressData.countryId,
      //   billingStateId: clientBillAddressData.stateId,
      //   billingCity: clientBillAddressData.city,
      //   billingZipCode: clientBillAddressData.zipCode,
      //   billingIsSameAddress:
      //     clientBillAddressData.sameAsPrimary === 0 ? true : false,
      });

      // if (
      //   clientUserData.companyLogo === null ||
      //   clientUserData.companyLogo === undefined ||
      //   clientUserData.companyLogo === ""
      // ) {
      //   this.setState({
      //     imagePath: IMAGE_STORE_PATH + "profilepic1635924283919.png",
      //   });
      // } else {
      //   this.setState({
      //     imagePath: IMAGE_PATH_ONLY + clientUserData.companyLogo,
      //   });
      // }
    }

    // ...............lookup data...................................

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
        if (this.state.industryTypeId === industryArr[i].id) {
          industryData = {
            label: industryArr[i].name,
            value: industryArr[i].id,
          };
        }
      }
    }
    // .........api for country list...............

    let arrCountry = [];
    let countryArr = [],
      countryObjData = {},
      billingCountryObjData = {},
      billingStateobjData = {},
      stateobjData = {};

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
        if (this.state.countryId === countryArr[i].id) {
          countryObjData = {
            label: countryArr[i].name,
            value: countryArr[i].id,
          };
        }
        if (this.state.billingCountryId === countryArr[i].id) {
          billingCountryObjData = {
            label: countryArr[i].name,
            value: countryArr[i].id,
          };
        }
      }
    }
    let countryData = {
      countryid: parseInt(clientAddressData.countryId),
    };
    let resState = await ApiCall("getstatelistofselectedcountry", countryData);
    let stateArrData = [],
      arrState = [];

    if (
      resState.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resState.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(resState.data.payload);

      stateArrData = payload.data.statelist;
      // console.log("payload:::", payload);
      for (let i = 0; i < stateArrData.length; i++) {
        arrState.push({
          label: stateArrData[i].name,
          value: stateArrData[i].id,
        });
        if (this.state.stateId === stateArrData[i].id) {
          stateobjData = {
            label: stateArrData[i].name,
            value: stateArrData[i].id,
          };
        }
        if (this.state.billingStateId === stateArrData[i].id) {
          billingStateobjData = {
            label: stateArrData[i].name,
            value: stateArrData[i].id,
          };
        }
      }
    }

    this.setState({
      allClientArr: allClientArr,
      // locationArr: locationArr,
      countryInfoArr: arrCountry,
      // countryData: countryObjData,
      // billingCountryData: billingCountryObjData,
      billingCountryInfoArr: arrCountry,
      industryArr: industryDataArr,
      industryData: industryData,
      // stateData: stateobjData,
      // billingStateData: billingStateobjData,
      // businessPhone: "+" + this.state.countryCode + " ",
      // phone: "+" + this.state.countryCode + " ",
      isLoad: false,
    });
  };
  // fetchClientInfo = async () => {

  // };
  // ...............for account info..........................

  onNameChange = (value) => {
    // var pattern = new RegExp(Regex.NAME_REGEX);
    // let nameCheck = nameRegexValidator(value);
    // if (pattern.test(value)) {

    this.setState({
      uname: value,
    });
  };
  onIndustryChange = (data) => {
    this.setState({
      industryTypeId: data.value,
      industryData: data,
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
        consoleLog("test",phoneNumberCheck(value))
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
        adminPhoto: res.data.data.path + res.data.data.filename,
      });
      this.onUpdate();
    });
  };
  onUpdate = async () => {
    let mainData = this.props.location;
    let preData = mainData.state;

    let objData = {
      selectedUserId: preData.userId,
      photo: this.state.adminPhoto,
    };
    let res = await ApiCall("updateUserProfilePic", objData);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.UPDATE.PROFILE_SUCCESS, {
        hideProgressBar: true,
      });
    }
  };

  onNext = async () => {
    window.scrollTo(0, 0);
    let mobileNo = this.state.businessPhone.substring(3, 15);
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
      this.setState({
        showPage: true,
        page: false,
      });
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
    window.scrollTo(0, 0);
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
      selectedLocation: data,
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
 
  // .....................func for cancel btn......................

  onAddressCancel = () => {
    window.scrollTo(0, 0);
    this.setState({
      showPage: false,
      page: true,
    });
  };

  // .........................******************************......................................
  // ..............................billing info func................................................

  onBillingLocationChange = (data) => {
    // console.log("data::::loc",data);
    this.setState({
      billingSelectedLocation: data,
      billingLocationData: data,
    });
  };
  onBillingLocationInputChange = async (val) => {
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
          billingLocationData: val,
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
  onBillingZipChange = (e) => {
    let val = zipValidate(e.target.value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        billingZipCode: val,
      });
    }
  };

  onBillingCityChange = (e) => {
    this.setState({
      billingCity: e.target.value,
    });
  };
  isSameAddress = () => {
    // console.log("res==============>", this.state.billingIsSameAddress);

    if (this.state.billingIsSameAddress === false) {
      this.setState({
        billingSelectedLocation: this.state.selectedLocation,
        billingLocationData: this.state.locationData,
        billingCountryData: this.state.countryData,

        billingStateData: this.state.stateData,
        billingCity: this.state.city,
        billingZipCode: this.state.zipCode,
        billingIsSameAddress: !this.state.billingIsSameAddress,
      });
    } 
    else {
      this.setState({
        // billingSelectedLocation: "",
        // billingCountryData: {},

        // billingCountryId: "",
        // billingStateData: {},
        // billingCity: "",
        // billingZipCode: "",
        billingIsSameAddress: !this.state.billingIsSameAddress,
      });
    }
  };

  onBillingNext = async () => {
    window.scrollTo(0, 0);
    let businessMobileNo = this.state.businessPhone.substring(3, 15);
    let mobileNo = this.state.phone.substring(3, 15);
    
    let errorCount = 0;

    // ...............................BILLING VALIDATIONS VARIABLES..........................
    let validateIndustry = inputEmptyValidate(this.state.industryTypeId);
    let validateBusinessEmail = emailValidator(this.state.businessEmail);
    let validateBussinessPhone = inputEmptyValidate(businessMobileNo);

    let validateName = inputEmptyValidate(this.state.uname);
    let validateNameLength = departmentValidator(this.state.uname);

    let validateFName = inputEmptyValidate(this.state.fname);
    let validateFNameLength = departmentValidator(this.state.fname);
    let validateLName = inputEmptyValidate(this.state.lname);
    let validateLNameLength = departmentValidator(this.state.lname);
    let validateEmail = emailValidator(this.state.email);
    let validatePhone = inputEmptyValidate(mobileNo);
    let validatePassword = passwordValidator(this.state.password);
    let validateCpassword = inputEmptyValidate(this.state.cpassword);
    let validateAddress = inputEmptyValidate(this.state.locationData.label);
    let validateCountry = inputEmptyValidate(this.state.countryId);
    let validateState = inputEmptyValidate(this.state.stateId);
    let validateCity = inputEmptyValidate(this.state.city);
    let validateZip = inputEmptyValidate(this.state.zipCode);

    // .........................................
    let validateBillingAddress = inputEmptyValidate(
      this.state.billingLocationData.label
    );
    let validateBillingCountry = inputEmptyValidate(
      this.state.billingCountryData
    );
    let validateBillingState = inputEmptyValidate(this.state.billingStateData);
    let validateBillingCity = inputEmptyValidate(this.state.billingCity);
    let validateBillingZip = inputEmptyValidate(this.state.billingZipCode);
    let validateClientData = inputEmptyValidate(this.state.clientData.value)
    // ........acccount VALIDATIONS,,,,,,,,,,,,,,,,,,,,,,
    if(validateClientData === false && this.state.isSelected_merge === "true"){
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_CLIENT_DROPDOWN, {
        hideProgressBar: true,
      });
      errorCount++;
    }
   else if (validateName === false) {
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
      toast.error(validateBusinessEmail.message, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (this.state.businessEmail.length > 100) {
      toast.error(AlertMessage.MESSAGE.EMAIL.MAX_EMAIL_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateBussinessPhone === false) {
      toast.error(AlertMessage.MESSAGE.MOBILE.BUSINESS_MOBILE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    // ..........................................
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
    }
     else if (validatePassword.status === false) {
      toast.error(validatePassword.message, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    else if (validateCpassword === false) {
      toast.error(AlertMessage.MESSAGE.PASSWORD.CONFIRM_PASS_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    else if (this.state.password !== this.state.cpassword) {
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
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_BILLING_ADDRESSINFO_LOCATION, {
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
      let mainData = this.props.location;
      let preData = mainData.state;

      let data = {
        clientname: this.state.uname,
        industryid: this.state.industryTypeId,
        businessemail: this.state.businessEmail,
        businessphone: businessMobileNo,
        countrycode: this.state.countryCode.toString(),
        website: this.state.website,
        purchaseorder: this.state.purchaseOrder,
        fax: this.state.fax,
        companylogo: this.state.adminPhoto,
        status:"1",
        fname: this.state.fname,
        lname: this.state.lname,
        email: this.state.email,
        mobile: mobileNo,
        password: this.state.password,
        outoftown: this.state.isSelected ? "1" : "0",
        // clientId: 1,
        clientReqId: preData.userId,
        primaryaddress: this.state.locationData.label,
        primarycountryid: this.state.countryData.value,
        primarystateid: this.state.stateData.value,
        primarycity: this.state.city,
        primaryzipcode: parseInt(this.state.zipCode),
        billingaddress: this.state.billingLocationData.label,
        billingcountryid: this.state.billingCountryData.value,
        billingstateid: this.state.billingStateData.value,
        billingcity: this.state.billingCity,
        billingzipcode: parseInt(this.state.billingZipCode),
        sameaddress: this.state.billingIsSameAddress ? "1" : "0",
        isMerge:this.state.isSelected_merge == "true" ? "1" : "0",
        clientId:this.state.clientData.value == null || this.state.clientData.value == undefined ? "" : this.state.clientData.value,
        
      };

      console.log(">:>:>:>:>:", data);
      // return history.push("/adminClientList");

      let res = await ApiCall("clientMerge", data);

      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.CLIENT.CLIENT_UPDATED_SUCCESS, {
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
    window.scrollTo(0, 0);
    // history.push("/adminStaff");
    this.setState({
      showBillingPage: false,
      showPage: true,
    });
  };

  rescheduledCheck = (e) => {
    // console.log(typeof e.target.value);
    this.setState({
      isSelected_merge: e.target.value,
    });
  };
  onClientChamge = (val) => {
    this.setState({
      clientData:val
    })
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer hideProgressBar theme="colored" />
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>
        <div className="component-wrapper" hidden={this.state.isLoad}>
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            {" "}
            <Link to="/adminDashboard">Dashboard</Link> /{" "}
            <Link to="/adminClientRequstList">Client Request</Link> / Edit
          </div>
          <div className="vender-head _fl">Client Details</div>
          <div className="myaccount-section-wrap _fl">
            <div className="row">
              <div className="col-md-9">
              <div className="my-form-rw _fl">
              <div className="my-form-bx" style={{ display: "block" }}>
              <div className="web-form-bx selct">
                  <div className="frm-label lblSize">
                    Would you like to Merge with Existing Client ?
                  </div>
                  <div className="check-field">
                    <label className="checkbox_btn">
                      <input
                        type="radio"
                        value="true"
                        checked={this.state.isSelected_merge === "true"}
                        onChange={this.rescheduledCheck}
                      />
                      <span className="checkmark3"></span> Yes
                    </label>
                  </div>
                  <div className="check-field">
                    <label className="checkbox_btn">
                      <input
                        type="radio"
                        value="false"
                        checked={this.state.isSelected_merge == "false"}
                        onChange={this.rescheduledCheck}
                      />
                      <span className="checkmark3"></span> No
                    </label>
                  </div>
                </div>
                {this.state.isSelected_merge == "true" ? <React.Fragment>
                <div className="web-form-bx">
                  <div className="row">
                    <div className="col-md-6">
                    <div className="vn_frm">
                    {" "}
                    <span>Client</span>
                    <div className="bts-drop">
                      <div className="dropdown bootstrap-select">
                        <SelectBox
                          value={this.state.clientData}
                          optionData={this.state.allClientArr}
                          onSelectChange={(value) => {
                            this.onClientChamge(value);
                          }}
                        />
                        </div>
                        </div>
                        </div>
                    </div>
                  
                  </div>
                
                </div>
                </React.Fragment> : <React.Fragment/>}
                </div>
                </div>
                <div className="my-form-rw _fl">
                  <div className="boxTitle">Account Information</div>
                  {/* <AccountInformation /> */}
                  <div className="my-form-bx" style={{ display: "block" }}>
                  <div className="row">
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Client *</span>
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
                            <span className="">Industry Type *</span>
                            <Select
                              options={this.state.industryArr}
                              placeholder="Select"
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.industryData}
                              onChange={(value) => {
                                this.onIndustryChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Business Email *</span>
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
                            <span className="">Business Phone *</span>
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
                      {/* <div className="row">
                        <div className="col-md-1">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Status</span>
                            <FormControl
                              component="fieldset"
                              variant="standard"
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                {this.state.checkStatus ? (
                                  <AntSwitch
                                    checked={true}
                                    inputProps={{
                                      "aria-label": "ant design",
                                    }}
                                    name="active"
                                    onClick={() => this.onStatusChange()}
                                  />
                                ) : (
                                  <AntSwitch
                                    checked={false}
                                    inputProps={{
                                      "aria-label": "ant design",
                                    }}
                                    name="active"
                                    onClick={() => this.onStatusChange()}
                                  />
                                )}
                              </Stack>
                            </FormControl>
                          </div>
                        </div>
                        <div className="col-md-1 status-btn">
                          <div className="status_text">
                            {this.state.checkStatus ? "Active" : "Inactive"}
                          </div>
                        </div>
                      </div> */}
                  </div>


                </div>
               
                <div className="my-form-rw _fl">
                  <div className="boxTitle">Admin Information</div>
                  {/* <AccountInformation /> */}
                  <div className="my-form-bx" style={{ display: "block" }}>
                  <div className="row">
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span className="">First Name *</span>
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
                            <span className="">Last Name *</span>
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
                      <div className="row">
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Email *</span>
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
                            <span className="">Phone No *</span>
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
                      <div className="row">
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Password *</span>
                            <InputText
                              type="password"
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
                            <span className="">Confirm Password *</span>
                            <InputText
                              type="password"
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
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Out Of Town *</span>
                            <div className="check-field">
                              <label className="checkbox_btn">
                                <input
                                  type="radio"
                                  name="radio"
                                  checked={
                                    this.state.isSelected === true
                                      ? true
                                      : false
                                  }
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
                                  checked={
                                    this.state.isSelected === false
                                      ? true
                                      : false
                                  }
                                  onClick={(e) => this.onSelectNo(e)}
                                />
                                <span className="checkmark3"></span> No
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
                <div className="my-form-rw _fl">
                  <div className="boxTitle">Address Information</div>

                  {/* <AccountInformation /> */}
                  <div className="my-form-bx" style={{ display: "block" }}>
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
                              Location *
                            </span>
                            {/* <InputText
                              type="text"
                              placeholder=""
                              className="in-field2"
                              value={this.state.selectedLocation}
                              onTextChange={(value) => {
                                this.onLocationChange(value);
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
                          </div>
                        </div>
                        <div className="col-md-2"></div>
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span>Country *</span>
                            <div class="dropdwn">
                              {/* <select className="myDropdown_address_country frm4-select"></select> */}
                              <Select
                                options={this.state.countryInfoArr}
                                components={{
                                  DropdownIndicator,
                                  IndicatorSeparator: () => null,
                                }}
                                value={this.state.countryData}
                                placeholder="Select"
                                onChange={(value) =>
                                  this.oncountryChange(value)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span className="">State *</span>
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
                            <span className="">City *</span>
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
                            <span className="">Zip Code *</span>
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
                </div>
                <div className="my-form-rw _fl">
                  <div className="boxTitle">Billing Information</div>

                  {/* <AccountInformation /> */}
                  <div className="my-form-bx" style={{ display: "block" }}>
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
                          <input
                            type="checkbox"
                            checked={
                              this.state.billingIsSameAddress ? true : false
                            }
                            onClick={this.isSameAddress}
                          />
                          <span className="checkmark"></span>{" "}
                        </label>
                      </div>
                    </div>
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
                              Location *
                            </span>
                            {/* <InputText
                              disabled={
                                this.state.billingIsSameAddress ? true : false
                              }
                              type="text"
                              placeholder=""
                              className="in-field2"
                              value={this.state.billingSelectedLocation}
                              onTextChange={(value) => {
                                this.onBillingLocationChange(value);
                              }}
                            /> */}
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
                            <span>Country *</span>
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
                      <div className="row">
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span className="">State *</span>
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
                            <span className="">City *</span>
                            <input
                              disabled={
                                this.state.billingIsSameAddress ? true : false
                              }
                              type="text"
                              placeholder=""
                              className="in-field2"
                              value={this.state.billingCity}
                              onChange={(e) => {
                                this.onBillingCityChange(e);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Zip Code *</span>
                            <input
                              disabled={
                                this.state.billingIsSameAddress ? true : false
                              }
                              type="text"
                              placeholder=""
                              className="in-field2"
                              value={this.state.billingZipCode}
                              onChange={(value) => {
                                this.onBillingZipChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              
               
                <div className="_button-style m30 _fl text-center">
                  <a
                    href="javascript:void(0)"
                    className="white-btn"
                    style={{ textDecoration: "none" }}
                    onClick={() => {
                      return history.push("/adminClientRequstList");
                    }}
                  >
                    Back
                  </a>
                  {/* {this.state.approvalStatus == 0 || this.state.approvalStatus == 1 ? <React.Fragment> */}
                  <a
                    href="javascript:void(0)"
                    className="red-btn"
                    style={{
                      textDecoration: "none",
                      backgroundColor: "#993921",
                    }}
                    // onClick={this.onDecline}
                  >
                    Decline
                  </a>
                  <a
                    href="javascript:void(0)"
                    className="blue-btn"
                    style={{ textDecoration: "none" }}
                    onClick={this.onBillingNext}
                  >
                  {this.state.isSelected_merge == "true" ? "Merge & Accept" : "Accept"}
                  </a>
                  {/* </React.Fragment> : <React.Fragment/>} */}
                </div>
              </div>
               <div className="col-md-3">
                  <div className="profile-pic-data">
                    <div className="c-logo">
                      <img
                        className="border_50_img"
                        src={this.state.imagePath}
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
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
