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
import "./editClientContact.css";

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
// ..........................style for react select........................

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
// .......................for react select icon.............................................

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

const dept = [
  {
    label: "Cardiology",
    value: 1,
  },
  {
    label: "Radiology",
    value: 2,
  },
];
const lang = [
  {
    label: "English",
    value: 1,
  },
  {
    label: "Hindi",
    value: 2,
  },
  {
    label: "Spanish",
    value: 2,
  },
];

export default class EditClientContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: true,
      showPage: false,
      showBillingPage: false,
      isSelected: null,
      isLoad: true,
      role: "",

      checkStatus: false,
      fname: "",
      lname: "",
      email: "",
      phone: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      contactRelation: "",
      clientArr: [],
      clientData: {
        label: "",
        value: "",
      },
      industryArr: [],
      industryArrData: [],
      industryData: {},
      departmentArr: [],
      departmentData: [],
      supervisorDepartmentData: {},
      languageArr: [],
      languageData: {},
      jobTitle: "",
      jobTypeArr: [],
      jobTypeData: {},
      roleArr: [],
      roleData: {},
      genderArr: [],
      genderData: {},
      countryData: {},
      preferedData: [],
      preferedArr: [],
      excludeData: [],
      excludeArr: [],
      password: "",
      cpassword: "",
      reference: "",
      countryCode: 1,
      amount: "",
      checked: "",
      adminPhoto: "",
      directLine: "",
      dobDate: "",
      outOfTown: "",
      imagePath: "images/profile-pic.png",

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
    this.setState({
      roleData: {
        label: "Requester",
        value: 6,
      },
    });
    this.load();
  }

  load = async () => {
    let industryDataArr = [],
      roleDataArr = [],
      clientDataArr = [],
      industryResArr = [],
      genderDataArr = [],
      languageResArrData = [],
      languageArrData = [];

    let languageResData = await ApiCall("getlanguagelist");
    let languagePayload = Decoder.decode(languageResData.data.payload);
    languageResArrData = languagePayload.data.languagelist;
    for (let n = 0; n < languageResArrData.length; n++) {
      languageArrData.push({
        label: languageResArrData[n].language,
        value: languageResArrData[n].id,
      });
    }
    // ............................................................

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
      for (let j = 0; j < clientResData.length; j++) {
        industryResArr.push({
          label: clientResData[j].industry,
          value: clientResData[j].industryType,
        });
      }
    }

    let lookupres = await ApiCall("getLookUpData");
    if (
      lookupres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      lookupres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(lookupres.data.payload);
      console.log("payload::::::::::", payload);
      let industryArr = payload.data.lookupdata.INDUSTRY_TYPE;
      let roleArr = payload.data.lookupdata.CLIENT_CONTACT_TYPE;
      let genderArr = payload.data.lookupdata.GENDER_TYPE;

      for (let i = 0; i < industryArr.length; i++) {
        industryDataArr.push({
          label: industryArr[i].name,
          value: industryArr[i].id,
        });
      }
      for (let j = 0; j < roleArr.length; j++) {
        roleDataArr.push({
          label: roleArr[j].name,
          value: roleArr[j].id,
        });
      }
      for (let k = 0; k < genderArr.length; k++) {
        genderDataArr.push({
          label: genderArr[k].name,
          value: genderArr[k].id,
        });
      }
    }

    this.setState({
      roleArr: roleDataArr,
      departmentArr: dept,
      genderArr: genderDataArr,
      clientArr: clientDataArr,
      industryArr: industryResArr,
      industryArrData: industryDataArr,
      languageArr: languageArrData,
      directLine: "+" + this.state.countryCode + " ",
      phone: "+" + this.state.countryCode + " ",
      contactPhone: "+" + this.state.countryCode + " ",
      isLoad: false,
    });
  };

  // ...............for account info..........................
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
  onClientChange = (data) => {
    // console.log("Client Selected data>>>>", data);
    let indusObj = {};
    for (let i = 0; i < this.state.clientArr.length; i++) {
      if (data.value === this.state.clientArr[i].value) {
        indusObj = {
          label: this.state.industryArr[i].label,
          value: this.state.industryArr[i].value,
        };
        this.setState({
          industryData: indusObj,
        });
      }
    }

    this.setState({
      clientData: data,
    });
  };
  onIndustryChange = (data) => {
    this.setState({
      industryData: data,
    });
  };
  onDepartmentChange = (option) => {
    console.log("_______dataddd", option);
    this.setState({
      departmentData: option,
    });
  };
  onSupervisorDepartmentChange = (option) => {
    console.log("_______data", option);
    this.setState({
      supervisorDepartmentData: option,
    });
  };
  onLanguageChange = (data) => {
    this.setState({
      languageData: data,
    });
  };
  onGenderChange = (data) => {
    this.setState({
      genderData: data,
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
  onContactNameChange = (value) => {
    let nameCheck = nameRegexValidator(value);
    this.setState({
      contactName: nameCheck,
    });
  };
  onContactPhoneChange = (value) => {
    if (numberValidator(value) === true) {
      if (mobileNumberValidator(value) === true) {
        let phoneCheck = phoneNumberCheck(value);
        if (phoneCheck) {
          this.setState({
            contactPhone: phoneCheck,
          });
        }
      }
    }
  };
  onContactEmailChange = (value) => {
    this.setState({
      contactEmail: value,
    });
  };
  onContactRelationChange = (value) => {
    this.setState({
      contactRelation: value,
    });
  };
  onJobTitleChange = (value) => {
    this.setState({
      jobTitle: value,
    });
  };
  onJobTypeChange = (data) => {
    this.setState({
      jobTypeData: data,
    });
  };
  onPreferedChange = (data) => {
    this.setState({
      preferedData: data,
    });
  };
  onExcludeChange = (data) => {
    this.setState({
      excludeData: data,
    });
  };
  onRoleChange = (data) => {
    this.setState({
      roleData: data,
    });
  };
  onReferenceChange = (data) => {
    this.setState({
      reference: data,
    });
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
  onDirectLineChange = (value) => {
    if (numberValidator(value) === true) {
      if (mobileNumberValidator(value) === true) {
        let phoneCheck = phoneNumberCheck(value);
        if (phoneCheck) {
          this.setState({
            directLine: phoneCheck,
          });
        }
      }
    }
  };
  onAmountChange = (e) => {
    let val = zipValidate(e.target.value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        amount: val,
      });
    }
  };
  onStatusChange = (e) => {
    this.setState({
      checkStatus: !this.state.checkStatus,
    });
  };
  dobDateChange = (e) => {
    this.setState({
      dobDate: e.target.value,
    });
  };
  // .................out of Town...............
  onSelectYes = (e) => {
    // console.log(">>>>>>>>>>>>>>>", typeof e.target.value);
    this.setState({
      isSelected: true,
      outOfTown: e.target.value,
    });
  };
  onSelectNo = (e) => {
    // console.log(">>>>>>>>>>>>>>>", typeof e.target.value);
    this.setState({
      isSelected: false,
      outOfTown: e.target.value,
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
    let mobileNo = this.state.phone.substring(3, 14);
    let objData = {
      fname: this.state.fname,
      lname: this.state.lname,
      industryTypeId: this.state.industryData.value,
      email: this.state.email,
      cuncode: this.state.countryCode,
      phone: mobileNo,
      status: this.state.checkStatus ? "1" : "0",
      photo: this.state.adminPhoto,
    };
    console.log("actual data", objData);
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
    window.scrollTo(0, 0);
    let mobileNo = this.state.phone.substring(3, 14);
    let errorCount = 0;
    let validateFName = inputEmptyValidate(this.state.fname);
    let validateFNameLength = departmentValidator(this.state.fname);
    let validateLName = inputEmptyValidate(this.state.lname);
    let validateLNameLength = departmentValidator(this.state.lname);
    let validateClient = inputEmptyValidate(this.state.clientData);
    let validateDepartment = inputEmptyValidate(this.state.departmentData);
    let validateSupervisorDepartment = inputEmptyValidate(
      this.state.supervisorDepartmentData
    );
    let validateLanguage = inputEmptyValidate(this.state.languageData);
    let validateEmail = emailValidator(this.state.email);
    let validatePhone = inputEmptyValidate(mobileNo);
    let validatePassword = passwordValidator(this.state.password);
    let validateCpassword = inputEmptyValidate(this.state.cpassword);
    let validateJobTitle = inputEmptyValidate(this.state.jobTitle);
    let validateJobType = inputEmptyValidate(this.state.jobTypeData);
    let validateRole = inputEmptyValidate(this.state.roleData);
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
    } else if (validateClient === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_CLIENT_NAME, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (this.state.roleData.label === "Requester") {
      if (validateDepartment === false) {
        toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_DEPARTMENT, {
          hideProgressBar: true,
        });
        errorCount++;
      }
    } else if (this.state.roleData.label === "Supervisor") {
      if (validateSupervisorDepartment === false) {
        toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_DEPARTMENT, {
          hideProgressBar: true,
        });
        errorCount++;
      }
    } else if (validateLanguage === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_LANGUAGE, {
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
    } else if (
      this.state.roleData.label === "Requester" ||
      this.state.roleData.label === "Supervisor"
    ) {
      if (validateJobTitle === false) {
        toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_CONTACT_JOB_TITLE, {
          hideProgressBar: true,
        });
        errorCount++;
      }
    } else if (
      this.state.roleData.label === "Requester" ||
      this.state.roleData.label === "Supervisor"
    ) {
      if (validateJobType === false) {
        toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_CONTACT_JOB_TYPE, {
          hideProgressBar: true,
        });
        errorCount++;
      }
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
    } else if (validateCpassword === false) {
      toast.error(AlertMessage.MESSAGE.PASSWORD.CONFIRM_PASS_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateRole === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_CONTACT_ROLE_TYPE, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // .....................................................

    //

    if (errorCount === 0) {
      if (
        this.state.roleData.label === "Requester" ||
        this.state.roleData.label === "Supervisor"
      ) {
        this.setState({
          page: false,
          showPage: true,
        });
      }

      let objData = {
        fname: this.state.fname,
        lname: this.state.lname,
        client: this.state.clientData.value,
        industryTypeId: this.state.industryData.value,
        email: this.state.email,
        cuncode: this.state.countryCode,
        phone: mobileNo,
        // department: this.state.departmentData.value,
        language: this.state.languageData.value,
        jobTitle: this.state.jobTitle,
        jobType: this.state.jobTypeData.value,
        role: this.state.roleData.value,
        password: this.state.password,
        status: this.state.checkStatus ? "1" : "0",
        photo: this.state.adminPhoto,
      };
      console.log("=================>", objData);
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
    return history.push("/adminClientContactList");
  };
  //.........................................*************************.........................................
  // ...............................Admin and Address info. function.............................

  // .................out of Town...............

  onAddressNext = async () => {
    let mobileNo = this.state.phone.substring(3, 14);
    let errorCount = 0;
    let validateDirectLine = inputEmptyValidate(this.state.directLine);
    let validateAmount = departmentValidator(this.state.amount);
    let validateOutOfTown = inputEmptyValidate(this.state.outOfTown);

    if (validateDirectLine === false) {
      toast.error(AlertMessage.MESSAGE.CONTACT.EMPTY_DIRECTLINE, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateAmount === false) {
      toast.error(AlertMessage.MESSAGE.CONTACT.EMPTY_AMOUNT, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateOutOfTown === false) {
      toast.error(AlertMessage.MESSAGE.CONTACT.EMPTY_OUT_OF_TOWN, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // .......................................................
    if (errorCount === 0) {
      window.scrollTo(0, 0);
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
      };
      console.log("_+_+_+_+_+", objData);
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
    window.scrollTo(0, 0);
    this.setState({
      showPage: false,
      page: true,
    });
  };

  // .........................******************************......................................
  // ..............................billing info func................................................

  // .....................func for cancel btn......................

  onBillingCancel = () => {
    window.scrollTo(0, 0);
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
        {this.state.page ? (
          <React.Fragment>
            <div className="component-wrapper" hidden={this.state.isLoad}>
              <h3 className="dcs">EDIT CONTACT DETAILS</h3>
              <div className="row">
                <div className="col-md-9">
                  <div className="department-component-app _fl sdw">
                    <h3>ACCOUNT INFORMATION</h3>

                    <div className="department-form">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Role</span>
                            <Select
                              styles={customStyles}
                              options={this.state.roleArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.roleData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onRoleChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
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
                              <span className="">Client</span>
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
                          <div className="col-md-2"></div>
                          <div className="col-md-5">
                            {this.state.roleData.label === "Requester" ? (
                              <React.Fragment>
                                <div className="form_rbx">
                                  {" "}
                                  <span className="">Industry Type</span>
                                  <Select
                                    isDisabled
                                    options={this.state.industryArr}
                                    components={{
                                      DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                    value={this.state.industryData}
                                    placeholder="Select"
                                    onChange={(value) => {
                                      this.onIndustryChange(value);
                                    }}
                                  />
                                </div>
                              </React.Fragment>
                            ) : (
                              <React.Fragment></React.Fragment>
                            )}
                            {this.state.roleData.label === "Supervisor" ? (
                              <React.Fragment>
                                <div className="form_rbx">
                                  {" "}
                                  <span className="">Industry Type</span>
                                  <Select
                                    isDisabled
                                    options={this.state.industryArr}
                                    components={{
                                      DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                    value={this.state.industryData}
                                    placeholder="Select"
                                    onChange={(value) => {
                                      this.onIndustryChange(value);
                                    }}
                                  />
                                </div>
                              </React.Fragment>
                            ) : (
                              <React.Fragment></React.Fragment>
                            )}
                            {this.state.roleData.label === "LEI" ? (
                              <React.Fragment>
                                <div className="form_rbx">
                                  {" "}
                                  <span className="">Date Of Birth</span>
                                  <input
                                    type="date"
                                    className="datefield bd"
                                    placeholder="10/25/2000"
                                    value={this.state.dobDate}
                                    onChange={this.dobDateChange}
                                  />
                                </div>
                              </React.Fragment>
                            ) : (
                              <React.Fragment></React.Fragment>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="department-form">
                        <div className="row">
                          <div className="col-md-5">
                            {}
                            <div className="form_rbx">
                              {this.state.roleData.label === "Requester" ? (
                                <React.Fragment>
                                  <span className="">Department(s)</span>
                                  <Select
                                    styles={customStyles}
                                    name="select"
                                    placeholder="Select"
                                    components={{
                                      DropdownIndicator,
                                      IndicatorSeparator: () => null,
                                    }}
                                    value={this.state.departmentData}
                                    options={this.state.departmentArr}
                                    onChange={this.onDepartmentChange}
                                    isMulti
                                  />
                                </React.Fragment>
                              ) : (
                                <React.Fragment></React.Fragment>
                              )}
                              {this.state.roleData.label === "Supervisor" ? (
                                <React.Fragment>
                                  <span className="">Department</span>
                                  <Select
                                    styles={customStyles}
                                    placeholder="Select"
                                    components={{
                                      DropdownIndicator,
                                      IndicatorSeparator: () => null,
                                    }}
                                    value={this.state.supervisorDepartmentData}
                                    options={this.state.departmentArr}
                                    onChange={(value) => {
                                      this.onSupervisorDepartmentChange(value);
                                    }}
                                  />
                                </React.Fragment>
                              ) : (
                                <React.Fragment></React.Fragment>
                              )}
                              {this.state.roleData.label === "LEI" ? (
                                <React.Fragment>
                                  <span className="">Gender</span>
                                  <Select
                                    styles={customStyles}
                                    placeholder="Select"
                                    components={{
                                      DropdownIndicator,
                                      IndicatorSeparator: () => null,
                                    }}
                                    value={this.state.genderData}
                                    options={this.state.genderArr}
                                    onChange={(value) => {
                                      this.onGenderChange(value);
                                    }}
                                  />
                                </React.Fragment>
                              ) : (
                                <React.Fragment></React.Fragment>
                              )}
                            </div>
                          </div>
                          <div className="col-md-2"></div>
                          <div className="col-md-5">
                            <div className="form_rbx">
                              {this.state.roleData.label === "Requester" ||
                              this.state.roleData.label === "Supervisor" ? (
                                <React.Fragment>
                                  <span className="">Preferred Language</span>
                                </React.Fragment>
                              ) : (
                                <React.Fragment>
                                  <span className="">Native Language</span>
                                </React.Fragment>
                              )}

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
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="department-form">
                        <div className="row">
                          <div className="col-md-5">
                            <div className="form_rbx">
                              <span className="">Email</span>
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
                          <div className="col-md-2"></div>
                          <div className="col-md-5">
                            <div className="form_rbx">
                              {" "}
                              <span className="">Mobile No</span>
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
                      {this.state.roleData.label === "Requester" ||
                      this.state.roleData.label === "Supervisor" ? (
                        <React.Fragment>
                          <div className="department-form">
                            <div className="row">
                              <div className="col-md-5">
                                <div className="form_rbx">
                                  <span className="">Job Title</span>
                                  <InputText
                                    type="text"
                                    placeholder=""
                                    className="in-field2"
                                    value={this.state.jobTitle}
                                    onTextChange={(value) => {
                                      this.onJobTitleChange(value);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="col-md-2"></div>
                              <div className="col-md-5">
                                <div className="form_rbx">
                                  {" "}
                                  <span className="">Job Type</span>
                                  <Select
                                    styles={customStyles}
                                    name="Select"
                                    options={this.state.industryArrData}
                                    components={{
                                      DropdownIndicator,
                                      IndicatorSeparator: () => null,
                                    }}
                                    value={this.state.jobTypeData}
                                    placeholder="Select"
                                    onChange={(value) => {
                                      this.onJobTypeChange(value);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <div className="department-form">
                            <div className="row">
                              <div className="col-md-5">
                                <div className="form_rbx">
                                  <span className="">
                                    Preferred Interpreters
                                  </span>
                                  <Select
                                    styles={customStyles}
                                    name="select"
                                    placeholder="Select"
                                    components={{
                                      DropdownIndicator,
                                      IndicatorSeparator: () => null,
                                    }}
                                    value={this.state.preferedData}
                                    options={this.state.preferedArr}
                                    onChange={this.onPreferedChange}
                                    isMulti
                                  />
                                </div>
                              </div>
                              <div className="col-md-2"></div>
                              <div className="col-md-5">
                                <div className="form_rbx">
                                  {" "}
                                  <span className="">Exclude Interpreter</span>
                                  <Select
                                    styles={customStyles}
                                    name="select"
                                    placeholder="Select"
                                    components={{
                                      DropdownIndicator,
                                      IndicatorSeparator: () => null,
                                    }}
                                    value={this.state.excludeData}
                                    options={this.state.excludeArr}
                                    onChange={this.onExcludeChange}
                                    isMulti
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      )}

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
                      {this.state.roleData.label === "LEI" ? (
                        <React.Fragment>
                          <div className="department-form">
                            <div className="row">
                              <div className="col-md-5">
                                <div className="form_rbx">
                                  <span className="">Reference</span>
                                  <InputText
                                    type="text"
                                    placeholder=""
                                    className="in-field2"
                                    value={this.state.reference}
                                    onTextChange={(value) => {
                                      this.onReferenceChange(value);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}

                      <div className="department-form">
                        <div className="row">
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
                      {this.state.roleData.label === "LEI" ? (
                        <React.Fragment>
                          <h3>Additional Contact Info</h3>
                          <div className="department-form">
                            <div className="row">
                              <div className="col-md-5">
                                <div className="form_rbx">
                                  <span className="">Contact Name</span>
                                  <InputText
                                    type="text"
                                    placeholder=""
                                    className="in-field2"
                                    value={this.state.contactName}
                                    onTextChange={(value) => {
                                      this.onContactNameChange(value);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="col-md-2"></div>
                              <div className="col-md-5">
                                <div className="form_rbx">
                                  <span className="">Contact phone</span>
                                  <InputText
                                    type="text"
                                    placeholder=""
                                    className="in-field2"
                                    value={this.state.contactPhone}
                                    onTextChange={(value) => {
                                      this.onContactPhoneChange(value);
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
                                  <span className="">Contact Email Id</span>
                                  <InputText
                                    type="text"
                                    placeholder=""
                                    className="in-field2"
                                    value={this.state.contactEmail}
                                    onTextChange={(value) => {
                                      this.onContactEmailChange(value);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="col-md-2"></div>
                              <div className="col-md-5">
                                <div className="form_rbx">
                                  <span className="">Relationship to LEI</span>
                                  <InputText
                                    type="text"
                                    placeholder=""
                                    className="in-field2"
                                    value={this.state.contactRelation}
                                    onTextChange={(value) => {
                                      this.onContactRelationChange(value);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}
                    </div>

                    {/* ..................................................................... */}

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
          </React.Fragment>
        ) : (
          <React.Fragment></React.Fragment>
        )}

        {/* ............................admin and addressinfo...................... */}
        {this.state.showPage ? (
          <React.Fragment>
            <div className="component-wrapper" hidden={this.state.isLoad}>
              <div className="row">
                <div className="col-md-9">
                  <div className="department-component-app _fl sdw">
                    <h3>ADDRESS INFORMATION</h3>
                    <div className="table-listing-app">
                      <div className="table-responsive">
                        <table
                          width="100%"
                          border="0"
                          cellPadding="0"
                          cellSpacing="0"
                        >
                          <tr>
                            <th style={{ width: "30%" }}>Department Name</th>
                            <th style={{ width: "40%" }}></th>
                            <th style={{ width: "30%" }}>Address</th>
                          </tr>
                          <tr>
                            <td colSpan="10">
                              <div className="tble-row">
                                <table
                                  width="100%"
                                  border="0"
                                  cellPadding="0"
                                  cellSpacing="0"
                                >
                                  <tr>
                                    <td style={{ width: "30%" }}>Cardiology</td>
                                    <td style={{ width: "40%" }}></td>
                                    <td style={{ width: "30%" }}>Address</td>
                                  </tr>
                                </table>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="10">
                              <div className="tble-row">
                                <table
                                  width="100%"
                                  border="0"
                                  cellPadding="0"
                                  cellSpacing="0"
                                >
                                  <tr>
                                    <td style={{ width: "30%" }}>Cardiology</td>
                                    <td style={{ width: "40%" }}></td>
                                    <td style={{ width: "30%" }}>Address</td>
                                  </tr>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>
                    {/* ............................................................. */}
                    <h3>SETTINGS</h3>
                    <div className="department-form">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form_rbx">
                            {" "}
                            <span className="">
                              Direct Line(After Business Hours/for Emergency)
                            </span>
                            <InputText
                              type="text"
                              placeholder=""
                              className="in-field2"
                              value={this.state.directLine}
                              onTextChange={(value) => {
                                this.onDirectLineChange(value);
                              }}
                            />
                          </div>
                        </div>
                        {this.state.roleData.label === "Requester" ? (
                          <React.Fragment>
                            <div className="col-md-6">
                              <div className="form_rbx">
                                <span className="">Amount($)</span>
                                <InputText
                                  type="text"
                                  placeholder=""
                                  className="in-field2"
                                  value={this.state.amount}
                                  onTextChange={(value) => {
                                    this.onAmountChange(value);
                                  }}
                                />
                              </div>
                            </div>
                          </React.Fragment>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}
                      </div>
                    </div>
                    {this.state.roleData.label === "Requester" ? (
                      <React.Fragment>
                        <div className="department-form">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form_rbx">
                                {" "}
                                <span className="">
                                  Authorized to approve Out of Town
                                  interpreters?
                                </span>
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
                      </React.Fragment>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}

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
      {/* </div> */}
      </React.Fragment>
    );
  }
}
