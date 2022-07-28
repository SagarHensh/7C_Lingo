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
import { InputText, MultiSelectBox, SelectBox } from "../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../enums";
import "./editClientContact.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  phoneNumberCheck,
  SetUSAdateFormat,
  getCountryList,
  decimalValue,
  SetDatabaseDateFormat
} from "../../../../services/common-function";
import { ErrorCode } from "../../../../services/constant";
import ReactLoader from "../../../Loader";
import {
  IMAGE_PATH_ONLY,
  IMAGE_URL,
} from "../../../../services/config/api_url";
import axios from "axios";
import { Autocomplete, listSubheaderClasses, TextField } from "@mui/material";
import { LocalLibraryRounded, ThumbDown } from "@material-ui/icons";
// import Select from "react-select/dist/declarations/src/Select";
import Select, { components } from "react-select";
import { VALIDATIONS } from "../../../../services/constant/lengthValidation";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

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

const languageSkillArr = [
  {
      label: "Read",
      value: 1,
  },
  {
      label: "Write",
      value: 2,
  },
  {
      label: "Speak",
      value: 3,
  },
];


export default class EditClientContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: true,
      showPage: false,
      isSelected_language:"false",
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
      clientId: "",
      clientData: {},
      industryArr: [],
      industryArrData: [],
      industryData: {},
      departmentArr: [],
      departmentData: [],
      supervisorDepartmentData: {},
      languageArr: [],
      languageData: {},
      departmentInfoArr: [],
      depMainArr: [],
      locationInfoArr: [],
      locArr: [],
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
      additionalCountryCode:1,
      amount: "",
      checked: "",
      adminPhoto: "",
      directLine: "",
      dobDate: "",
      outOfTown: "",
      imagePath: "images/profile-pic.png",
      allCountryOption: [],
      selectedCountry: {},

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
      departmentid: [],
     
      language: "",

      countrySpecificDialect: false,
      specificDialectCode: false,
      userId:"",

            // language for lei 
            otherLanguageData: [],
            otherLanguageSet:[],
      
            primaryLanguageSkillArr: languageSkillArr,
            primaryLanguageData: {},
            primaryLanguageSkillData: [],
            primaryLanguageRating: "",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.load();
  }

  load = async () => {
    let mainData = this.props.location;
    let preData = mainData.state;
    // console.log("preData::", preData);
    let industryDataArr = [],
      location = [],
      deptArr = [],
      deptInfo = [],
      roleDataArr = [],
      allCountryList=[],
      roleObjData = {},
      clientDataArr = [],
      clientDataObj = {},
      industryResArr = [],
      genderDataArr = [],
      genderObjData = {},
      languageResArrData = [],
      clientContactInfo = [],
      jobTypeObjData = {},
      industryObjData = {},
      languageDataObj = {},
      deptDataInfo = [],
      languageInfo=[],
      deptObjData = [],
      deptMainData = [],
      deptArrMain = [],
      totalArr = [],
      languageArrData = [],
      imagePath = "",
      countryDataObj={},
      language = "";

    let getDataObj = {
      clientcontactid: preData.clientcontactid,
    };

    let contactResData = await ApiCall(
      "getapprovedclientcontactdetails",
      getDataObj
    );
    if (
      contactResData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      contactResData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(contactResData.data.payload);
      consoleLog("contactDetailspayload::::::::::", payload);
      clientContactInfo = payload.data.clientinfo;
      deptDataInfo = payload.data.deptInfo;
      languageInfo = payload.data.language

      for (let i = 0; i < deptDataInfo.length; i++) {
        deptMainData.push({
          label: deptDataInfo[i].location,
          value: deptDataInfo[i].id,
        });
      }
    }

    // ...............................................

    let languageResData = await ApiCall("getlanguagelist");
    let languagePayload = Decoder.decode(languageResData.data.payload);
    languageResArrData = languagePayload.data.languagelist;
    for (let n = 0; n < languageResArrData.length; n++) {
      languageArrData.push({
        label: languageResArrData[n].language,
        value: languageResArrData[n].id,
      });

      if (clientContactInfo.prefLangId === null || clientContactInfo.prefLangId === undefined || clientContactInfo.prefLangId === "") {
        if (languageResArrData[n].language === "English") {
          languageDataObj = {
            label: languageResArrData[n].language,
            value: languageResArrData[n].id,
          };
          language = languageResArrData[n].id;
        }
      } else {
        if (clientContactInfo.prefLangId === languageResArrData[n].id) {
          languageDataObj = {
            label: languageResArrData[n].language,
            value: languageResArrData[n].id,
          };
          language = languageResArrData[n].id;
        }
      }
    }

    // ...................................................................

    // let departmentResData = await ApiCall("fetchselectedclientdeptinfo");
    // ............................................................

    let clientinfoRes = await ApiCall("getallclinetinfo");
    if (
      clientinfoRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      clientinfoRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let clientPayload = await Decoder.decode(clientinfoRes.data.payload);
      let clientResData = clientPayload.data.clientlist;
      // console.log("payload::::::::::", clientResData);
      for (let i = 0; i < clientResData.length; i++) {
        clientDataArr.push({
          label: clientResData[i].clientName,
          value: clientResData[i].clientid,
        });
        // console.log("payload::::::::::", clientContactInfo.clientContactId);
        // console.log("payload::::::::::", clientResData[i].clientid);
        if (clientContactInfo.clientId === clientResData[i].clientid) {
          clientDataObj = {
            label: clientResData[i].clientName,
            value: clientResData[i].clientid,
          };
        }
      }
      for (let j = 0; j < clientResData.length; j++) {
        industryResArr.push({
          label: clientResData[j].industry,
          value: clientResData[j].industryType,
        });
      }
    }
    let clientObjData = {
      clientid: clientDataObj.value,
    };

    let deptResData = await ApiCall(
      "fetchselectedclientdeptinfo",
      clientObjData
    );
    let deptIdArr = [];
    let loc = [],
      locArray = [];
    // console.log("_________response", deptResData);

    if (
      deptResData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      deptResData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payloadDept = Decoder.decode(deptResData.data.payload);
      // console.log("payload::::::::::", payloadDept);
      deptInfo = payloadDept.data.deptinfo;
      location = payloadDept.data.location;
      // consoleLog("payload::::::::::", deptInfo);

      for (let i = 0; i < deptInfo.length; i++) {
        deptArr.push({
          label: deptInfo[i].department,
          value: deptInfo[i].id,
        });
      }
      for (let h = 0; h < deptMainData.length; h++) {
        for (let m = 0; m < deptInfo.length; m++) {
          if (deptMainData[h].value === deptInfo[m].id) {
            deptObjData.push({
              label: deptInfo[m].department,
              value: deptInfo[m].id,
            });
            deptIdArr.push(deptInfo[m].id);
          }
        }
      }
      // consoleLog("deptId::", deptIdArr);

      for (let p = 0; p < deptObjData.length; p++) {
        for (let q = 0; q < deptInfo.length; q++) {
          if (deptInfo[q].id === deptObjData[p].value) {
            loc.push({
              name: deptInfo[q].department,
              loc: deptInfo[q].deptLocation,
            });
          }
        }
      }
    }

    let lookupres = await ApiCall("getLookUpData");
    if (
      lookupres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      lookupres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(lookupres.data.payload);
      // consoleLog("payload::::::::::", payload);
      let industryArr = payload.data.lookupdata.INDUSTRY_TYPE;
      let roleArr = payload.data.lookupdata.CLIENT_CONTACT_TYPE;
      let genderArr = payload.data.lookupdata.GENDER_TYPE;
      // consoleLog(":::::roleArr", industryArr);

      for (let i = 0; i < industryArr.length; i++) {
        industryDataArr.push({
          label: industryArr[i].name,
          value: industryArr[i].id,
        });
        if (clientContactInfo.jobTypeId === industryArr[i].id) {
          jobTypeObjData = {
            label: industryArr[i].name,
            value: industryArr[i].id,
          };
        }
        if (clientContactInfo.industryTypeId === industryArr[i].id) {
          industryObjData = {
            label: industryArr[i].name,
            value: industryArr[i].id,
          };
        }
      }
      for (let j = 0; j < roleArr.length; j++) {
        roleDataArr.push({
          label: roleArr[j].name,
          value: roleArr[j].id,
        });
        if (clientContactInfo.clientContactTypeId === roleArr[j].id) {
          roleObjData = {
            label: roleArr[j].name,
            value: roleArr[j].id,
          };
        }
      }
      for (let k = 0; k < genderArr.length; k++) {
        genderDataArr.push({
          label: genderArr[k].name,
          value: genderArr[k].id,
        });

        if (clientContactInfo.genderTypeId === genderArr[k].id) {
          genderObjData = {
            label: genderArr[k].name,
            value: genderArr[k].id,
          };
        }
      }
    }
// ...................lei country ..........
// console.log("ssss",clientContactInfo.countryOrigin)

    let resCountry = await getCountryList();
    // console.log("Country List>>>>>", resCountry);
    resCountry.map((data) => {
      // console.log("ssseuwryews",data.id)
      allCountryList.push({
        label: data.name,
        value: data.id,
      });
      if(clientContactInfo.countryOrigin == data.id){
        countryDataObj = {
        label: data.name,
        value: data.id,
        }
      }
    });


    // ..............other language data.............
    let otherLangDataArr = [];
    let otherLangIdArr = [];
   
if(languageInfo.length > 0){

languageInfo.map((langObj) => {
  let crr = [];
  languageArrData.map((obj) => {
    if(obj.value == langObj.languageId){
      if(langObj.canRead == 1){
        crr.push({
          label:"Read",
          value:1
        })
      }
      if(langObj.canWrite == 1){
        crr.push({
          label:"Write",
          value:2
        })
      }
      if(langObj.canSpeak == 1){
        crr.push({
          label:"Speak",
          value:3
        })
      }

      // consoleLog("crr",crr)

      otherLangDataArr.push({
        id:langObj.languageId,
        name:obj.label,
        skill:crr,
        rating:langObj.ratings
      })

      otherLangIdArr.push({
        label:obj.label,
        value:obj.value
      })

    }
  })
})
}
  
   



    this.setState({
      fname: clientContactInfo.fName,
      lname: clientContactInfo.lName,
      clientId: clientContactInfo.clientId,
      email: clientContactInfo.email,
      jobTitle: clientContactInfo.jobTitle,
      jobTypeData: jobTypeObjData,
      amount: clientContactInfo.amount,
      industryData: industryObjData,
      isSelected: clientContactInfo.outOfTownAuth === 0 ? false : true,
      // phone:clientContactInfo.mobile,

      // locationInfoArr: locationInfoArr,

      // totalArrData: totalArr,
      // ......................................
      roleArr: roleDataArr,
      roleData: roleObjData,
      departmentInfoArr: deptArr,
      dobDate: SetUSAdateFormat(clientContactInfo.createDate),
      departmentData: deptObjData,
      genderArr: genderDataArr,
      genderData: genderObjData,
      clientArr: clientDataArr,
      clientData: clientDataObj,
      industryArr: industryResArr,
      industryArrData: industryDataArr,
      languageData: languageDataObj,
      languageArr: languageArrData,
      adminPhoto: clientContactInfo.profilePic,
      directLine:
        "+" + this.state.countryCode + " " + clientContactInfo.directLine,
      phone: "+" + this.state.countryCode + " " + clientContactInfo.mobile,
      contactPhone: "+" + this.state.countryCode + " ",
      isLoad: false,
      depMainArr: deptInfo,
      departmentid: deptIdArr,
      locArr: loc,
      imagePath: imagePath,
      language: language,
      checkStatus: clientContactInfo.status === 1 ? true : false,
      allCountryOption: allCountryList,
      selectedCountry:countryDataObj,
      specificDialectCode:clientContactInfo.specificDialectCode == "0" ? false : true,
      userId:clientContactInfo.userId,
      isSelected_language:clientContactInfo.proficiencyLanguage == 0 ? "false" : "true",
      otherLanguageSet:otherLangDataArr,
      otherLanguageData:otherLangIdArr,
      reference:clientContactInfo.reference,
      contactRelation:clientContactInfo.relationshipToUser == null || clientContactInfo.relationshipToUser == undefined ? "" : clientContactInfo.relationshipToUser,
      contactEmail:clientContactInfo.additonalContactEmail == null || clientContactInfo.additonalContactEmail == undefined ? "" : clientContactInfo.additonalContactEmail, 
      contactPhone:clientContactInfo.additonalContactPhone == null || clientContactInfo.additonalContactPhone == undefined ? "+" + this.state.additionalCountryCode + " " : "+" + this.state.additionalCountryCode + " " +clientContactInfo.additonalContactPhone, 
      contactName : clientContactInfo.additonalContactname == null || clientContactInfo.additonalContactname == undefined ? "" : clientContactInfo.additonalContactname, 
     
    });

    if (
      clientContactInfo.profilePic === null ||
      clientContactInfo.profilePic === undefined ||
      clientContactInfo.profilePic === ""
    ) {
      this.setState({
        imagePath: ImageName.IMAGE_NAME.PROFILE_PIC,
      });
    } else {
      this.setState({
        imagePath: IMAGE_PATH_ONLY + clientContactInfo.profilePic,
      });
    }
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
  onClientChange = async (data) => {
    this.setState({
      departmentData: [],
    });
    // console.log("Client Selected data>>>>", data);
    let indusObj = {},
      location = [],
      deptArr = [],
      deptInfo = [];

    let clientObjData = {
      clientid: data.value,
    };
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

    let deptRes = await ApiCall("fetchselectedclientdeptinfo", clientObjData);
    // console.log("_________response", deptRes);
    if (
      deptRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      deptRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(deptRes.data.payload);
      console.log("payload::::::::::", payload);
      deptInfo = payload.data.deptinfo;
      location = payload.data.location;

      if (deptInfo !== null || deptInfo !== undefined || deptInfo !== "") {
        for (let i = 0; i < deptInfo.length; i++) {
          deptArr.push({
            label: deptInfo[i].department,
            value: deptInfo[i].id,
          });
        }
      }
      // else {

      //   this.setState({
      //     departmentData: [],
      //   });
      // }
    }
    this.setState({
      clientData: data,
      departmentInfoArr: deptArr,
      locationInfoArr: location,
      depMainArr: deptInfo,
    });
  };
  onIndustryChange = (data) => {
    this.setState({
      industryData: data,
    });
  };
  onDepartmentChange = (option) => {
    let arr = [],
      loc = [];

    option.map((obj) => {
      arr.push(obj.value);
    })
    for (let p = 0; p < option.length; p++) {
      for (let q = 0; q < this.state.depMainArr.length; q++) {
        if (this.state.depMainArr[q].id === option[p].value) {
          loc.push({
            name: this.state.depMainArr[q].department,
            loc: this.state.depMainArr[q].deptLocation,
          });
        }
      }
    }

    this.setState({
      departmentData: option,
      departmentid: arr,

      locArr: loc,
    });
  };
  onSupervisorDepartmentChange = (option) => {
    // console.log("_______data", option);
    this.setState({
      supervisorDepartmentData: option,
    });
  };
  onLanguageChange = (data) => {
    this.setState({
      languageData: data,
      language: data.value
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
    // this.setState({
    //   directLine: value,
    // });
  };

  leiCountryChange = (value) => {
    // consoleLog("valll:::",value)
    this.setState({
      selectedCountry:value
    })
  }
  onAmountChange = (e) => {
    // let val = zipValidate(data);
    // if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      if(decimalValue(e.target.value))
      this.setState({
        amount: e.target.value,
      });
    // }
  };
  onStatusChange = (e) => {
    this.setState({
      checkStatus: !this.state.checkStatus,
    });
  };
  dobDateChange = (date) => {
    this.setState({
      dobDate: SetUSAdateFormat(date),
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
  languageCheck = (e) => {
    this.setState({
      isSelected_language:e.target.value
    })
  }
  onProfileImage = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      // consoleLog("Photo",res.data.data);
      this.setState({
        imagePath: res.data.data.url,
        adminPhoto: res.data.data.path + res.data.data.filename,
      });
      let adminPhoto = res.data.data.path + res.data.data.filename;
      this.onUpdate(adminPhoto);
    });
  };
  onUpdate = async (adminPhoto) => {
    let mainData = this.props.location;
    let preData = mainData.state;

    let objData = {
      selectedUserId: preData.clientcontactid,
      photo: adminPhoto,
    };
    // consoleLog("req photo data", objData);
    // let res = await ApiCall("updateUserProfilePic", objData);
    // if (
    //   res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //   res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    // ) {
    //   toast.success(AlertMessage.MESSAGE.UPDATE.PROFILE_SUCCESS, {
    //     hideProgressBar: true,
    //   });
    // }

    let res = await ApiCall("updateClientContactProfilePic", objData);
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
    let mainData = this.props.location;
    let preData = mainData.state;
    window.scrollTo(0, 0);
    let mobileNo = this.state.phone.substring(3, 15);
    let contactNo = this.state.contactPhone.substring(3, 15);
    let directNo = this.state.directLine.substring(3, 15);
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
    let validateCountryOrigin = inputEmptyValidate(this.state.selectedCountry.value);
    let validateLanguage = inputEmptyValidate(this.state.language);
    let validateEmail = emailValidator(this.state.email);
    let validatePhone = inputEmptyValidate(mobileNo);
    let validateJobTitle = inputEmptyValidate(this.state.jobTitle);
    // let validateJobType = inputEmptyValidate(this.state.jobTypeData);
    let validateRole = inputEmptyValidate(this.state.roleData);
    let validateDob = inputEmptyValidate(this.state.dobDate)
    let validateotherLanguage = inputEmptyValidate(this.state.otherLanguageData)
    // consoleLog("validateTitle", validateJobTitle);

      // consoleLog("valid::",validateSupervisorDepartment);


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
    }
    else if (
      this.state.roleData.label === "LEI" &&
      validateDob === false
    ) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_DOB, {
        hideProgressBar: true,
      });
      errorCount++;
    } 
   else if (this.state.roleData.label === "Requester" && validateDepartment === false ) {
   
        toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_DEPARTMENT, {
          hideProgressBar: true,
        });
        errorCount++;
      
    } else if (this.state.roleData.label === "Supervisor" && validateDepartment === false) {
      
        toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_DEPARTMENT, {
          hideProgressBar: true,
        });
        errorCount++;
      
    }
   else if (validateLanguage === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_LANGUAGE, {
        hideProgressBar: true,
      });
      errorCount++;
    } 
    else if(validateotherLanguage === false && this.state.isSelected_language == "true"){
      toast.error("Please select other language");
      errorCount++;
    } else if(this.state.isSelected_language == "true"){
      
      this.state.otherLanguageSet.map((obj,i) => {
        // consoleLog("skill",obj)
        if(obj.skill.length == 0 || obj.rating === ""){
          toast.error(AlertMessage.MESSAGE.OTHER_LANGUAGE.ALL_FIELDS_REQUIRED + " at row " + Number(i + 1));
          errorCount++;
        } 
      })
    }
     if (this.state.email === "" && validatePhone === false && this.state.roleData.label === "LEI") {
      toast.error("Please enter Email or Phone No !", {
        hideProgressBar: true,
      });
      errorCount++;
    } else if(validatePhone === false && validateEmail.status === false && this.state.roleData.label === "LEI"){
      toast.error(validateEmail.message,{hideProgressBar:true});
      errorCount++;
    }
     else if(validateEmail.status === false && (this.state.roleData.label == "Supervisor" || this.state.roleData.label == "Requester")){
      toast.error(validateEmail.message,{hideProgressBar:true});
      errorCount++;
    }
     else if (this.state.email.length > 100) {
      toast.error(AlertMessage.MESSAGE.EMAIL.MAX_EMAIL_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validatePhone === false && validateEmail.status === false && this.state.roleData.label === "LEI") {
      toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if(validatePhone === false && this.state.roleData.label == "Supervisor" || this.state.roleData.label == "Requester"){
      toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY, {
        hideProgressBar: true,
      });
    } else if (validateRole === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_CONTACT_ROLE_TYPE, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    if (validateJobTitle === false && (this.state.roleData.label === "Requester" ||
      this.state.roleData.label === "Supervisor")
    ) {
     
        toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_CONTACT_JOB_TITLE, {
          hideProgressBar: true,
        });
        errorCount++;
    
    }
    // if(this.state.roleData.label === "Requester" ||
    // this.state.roleData.label === "Supervisor"){
    //   if (this.state.password !== "") {
    //     if (this.state.password.length < 7 || this.state.password.length > 16) {
    //       toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_LENGTH, {
    //         hideProgressBar: true,
    //       });
    //       errorCount++;
    //     } else if (!this.state.password.match(Regex.PASS_REGEX)) {
    //       //match the password with the regex condition is (Password must contain Minimum eight characters, at least one uppercase letter, one lowercase letter and one number)
    //       toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_NOT_VALID, {
    //         hideProgressBar: true,
    //       });
    //       errorCount++;
    //     } else if (this.state.password !== this.state.cpassword) {
    //       toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_NOT_MATCH, {
    //         hideProgressBar: true,
    //       });
    //       errorCount++;
    //     }
    //   }
    // }

    if(this.state.roleData.label === "LEI"){
      if(validateCountryOrigin === false) {
        toast.error("Please select LEI Country of Origin");
        errorCount++;
      }
    }
    

    // if (validatePassword.status === false) {
    //   toast.error(validatePassword.message, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // }
    //  else if (validateCpassword === false) {
    //   toast.error(AlertMessage.MESSAGE.PASSWORD.CONFIRM_PASS_EMPTY, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // }

    //  else if (validateCpassword === false) {
    //   toast.error(AlertMessage.MESSAGE.PASSWORD.CONFIRM_PASS_EMPTY, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // }

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

      if (this.state.roleData.label === "LEI") {
        let objData = {  
          oherLanguageSet: this.state.otherLanguageSet,
      };
      var lang = [];
      if (objData.oherLanguageSet != undefined) {
        for (let j = 0; j < objData.oherLanguageSet.length; j++) {
            var langInfo = objData.oherLanguageSet[j];
            var langobj = {
                "languageId": langInfo.id,
                "targetLanguageId": langInfo.id,
                "isPrimary": "0",
                "canSpeak": "0",
                "canRead": "0",
                "canWrite": "0",
                "ratings": langInfo.rating
            };
            for (let i = 0; i < langInfo.skill.length; i++) {
                if (langInfo.skill[i].label == "Read") {
                    langobj.canRead = "1";
                } else if (langInfo.skill[i].label == "Write") {
                    langobj.canWrite = "1";
                } else if (langInfo.skill[i].label == "Speak") {
                    langobj.canSpeak = "1";
                }
            }
            lang.push(langobj);
        }
    }
        let data = {
          clientcontacttype: this.state.roleData.value,
          fname: this.state.fname,
          lname: this.state.lname,
          dob: this.state.dobDate == "" ? "" : SetDatabaseDateFormat(this.state.dobDate),
          altcountrycode: this.state.countryCode,
          altmobile: "",
          department: this.state.departmentid,
          gender: this.state.genderData.value,
          mobile: mobileNo,
          clientid: this.state.clientData.value,
          industrytype: this.state.industryData.value,
          jobtype: this.state.jobTypeData.value,
          jobtitle: this.state.jobTitle,
          language: this.state.language,
          profilepic: this.state.adminPhoto,
          directline: directNo,
          outoftown: this.state.isSelected ? "1" : "0",
          amount: this.state.amount,
          referance: this.state.reference,
          additionalcontactname: this.state.contactName,
          additionalemail: this.state.contactEmail,
          additionalcountrycode: this.state.countryCode,
          additionalphone: contactNo,
          relationship: this.state.contactRelation,
          status: this.state.checkStatus ? "1" : "0",
          userTypeId: this.state.roleData.value,
          countrycode: this.state.countryCode,
          clientcontactid: preData.clientcontactid,
          password: this.state.password,
          countryOrigin:this.state.selectedCountry.value,
          countrySpecificDialect: this.state.specificDialectCode ? "1" : "0",
          leiId:this.state.userId,
          otherLanguageCheck:this.state.isSelected_language == "true" ? "1" : "0",
          // oherLanguageSet: this.state.otherLanguageSet,
          otherLanguageSet:lang
        };

   
        console.log("=================>", data);
        // return history.push("/adminAddClientPageTwo");

        let res = await ApiCall("updateClientContactDetailsLEIV2", data);
        // console.log("=================>", res);
        //   let payload = Decoder.decode(res.data.payload);
        if (
          res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          toast.success(AlertMessage.MESSAGE.CONTACT.UPDATE_SUCCESS, {
            hideProgressBar: true,
          });
          return history.push("/adminClientContactList");
        } else {
          if (
            res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST
          ) {
            toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_EXIST, {
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
          }else if (
            res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.DUPLICATE_LEI
          ) {
            toast.error(AlertMessage.MESSAGE.LEI.DUBLICATE_LEI, {
              hideProgressBar: true,
            });
          }
        }
      }
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
    let mainData = this.props.location;
    let preData = mainData.state;
    window.scrollTo(0, 0);
    let mobileNo = this.state.phone.substring(3, 15);
    let contactNo = this.state.contactPhone.substring(3, 15);
    let directNo = this.state.directLine.substring(3, 15);
    let errorCount = 0;
    let validateDirectLine = inputEmptyValidate(this.state.directLine);
    let validateAmount = inputEmptyValidate(this.state.amount);
    let validateOutOfTown = inputEmptyValidate(this.state.isSelected);

    if (validateDirectLine === false) {
      toast.error(AlertMessage.MESSAGE.CONTACT.EMPTY_DIRECTLINE, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateOutOfTown === false) {
      toast.error(AlertMessage.MESSAGE.CONTACT.EMPTY_OUT_OF_TOWN, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (this.state.isSelected === true && validateAmount === false) {
      toast.error(AlertMessage.MESSAGE.CONTACT.EMPTY_AMOUNT, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // .......................................................
    if (errorCount === 0) {
      window.scrollTo(0, 0);

      let data = {
        clientcontacttype: this.state.roleData.value,
        fname: this.state.fname,
        lname: this.state.lname,
        // dob: this.state.dobDate,
        dob: "",
        altcountrycode: this.state.countryCode,
        altmobile: "",
        gender: "",
        mobile: mobileNo,
        clientid: this.state.clientData.value,
        department: this.state.departmentid,
        industrytype: this.state.industryData.value,
        jobtype: this.state.jobTypeData.value,
        jobtitle: this.state.jobTitle,
        language: this.state.language,
        profilepic: this.state.adminPhoto,
        directline: directNo,
        outoftown: this.state.isSelected ? "1" : "0",
        amount: this.state.amount,
        referance: this.state.reference,
        additionalcontactname: this.state.contactName,
        additionalemail: this.state.contactEmail,
        additionalcountrycode: this.state.countryCode,
        additionalphone: contactNo,
        relationship: this.state.contactRelation,
        status: this.state.checkStatus ? "1" : "0",
        userTypeId: this.state.roleData.value,
        countrycode: this.state.countryCode,
        clientcontactid: preData.clientcontactid,
        password: this.state.password,
      };
      // return history.push("/adminAddClientPageThree");

      let res = await ApiCall("updateClientContactDetails", data);
      // console.log("=================>", res);
      //   let payload = Decoder.decode(res.data.payload);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.CONTACT.UPDATE_SUCCESS, {
          hideProgressBar: true,
        });
        return history.push("/adminClientContactList");
      } else {
        if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST
        ) {
          toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_EXIST, {
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


  countrySpecific = (e) => {
    if (e.target.value === "yes") {
      this.setState({
        specificDialectCode: true,
      });
    } else {
      this.setState({
        specificDialectCode: false,
      });
    }
  };

  onOtherLanguageChange = (option) => {
    let arr = [];
    option.map((data) => {
        arr.push({
            id: data.value,
            name: data.label,
            skill: [],
            rating: "",
        });
    });
    this.setState({
        otherLanguageData: option,
        otherLanguageSet: arr,
    });
  };
  
  onOtherLanguageSkillChange = (option, pos) => {
    let arr = this.state.otherLanguageSet;
    arr[pos].skill = option;
    this.setState({
        otherLanguageSet: arr,
    });
  };
  
  otherLanguageRatingChange = (newRating, pos) => {
    let arr = this.state.otherLanguageSet;
    arr[pos].rating = newRating;
    this.setState({
        otherLanguageSet: arr,
    });
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer hideProgressBar theme="colored" />
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>
        {this.state.page ? (
          <React.Fragment>
            <div className="component-wrapper" hidden={this.state.isLoad}>
              <div
                className="vn_frm"
                style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
              >
                {" "}
                <Link to="/adminDashboard">Dashboard</Link> / <Link to="/adminClientContactList">Client Contacts</Link> / Edit
              </div>
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
                            <span className="">Role *</span>
                            <Select
                              styles={customStyles}
                              options={this.state.roleArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              isDisabled
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
                      </div>
                      <div className="department-form">
                        <div className="row">
                          <div className="col-md-5">
                            <div className="form_rbx">
                              {" "}
                              <span className="">Client *</span>
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
                                  <span className="">Date Of Birth *</span>
                               
                                  <div className="input-group" style={{ width: "100%", borderRadius: "9px", height: "43px", border: "1px solid #ced4da", boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)" }}>
                                    <div style={{ width: "80%", padding: "8px" }}>
                                      {this.state.dobDate}
                                    </div>
                                    <div style={{ width: "20%" }}>
                                      <a style={{ float: "right" }}>
                                        <DatePicker
                                          dropdownMode="select"
                                          showMonthDropdown
                                          showYearDropdown
                                          adjustDateOnChange
                                          onChange={(date) => this.dobDateChange(date)}
                                          customInput={(<Schedule />)}
                                        />
                                      </a>
                                    </div>
                                  </div>
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
                            { }
                            <div className="form_rbx">
                              {this.state.roleData.label === "Requester" ? (
                                <React.Fragment>
                                  <span className="">Department(s) *</span>
                                  <Select
                                    styles={customStyles}
                                    name="select"
                                    placeholder="Select"
                                    components={{
                                      DropdownIndicator,
                                      IndicatorSeparator: () => null,
                                    }}
                                    value={this.state.departmentData}
                                    options={this.state.departmentInfoArr}
                                    onChange={this.onDepartmentChange}
                                    isMulti
                                  />
                                </React.Fragment>
                              ) : (
                                <React.Fragment></React.Fragment>
                              )}
                              {this.state.roleData.label === "Supervisor" ? (
                                <React.Fragment>
                                  <span className="">Department(s) *</span>
                                  <Select
                                    styles={customStyles}
                                    name="select"
                                    placeholder="Select"
                                    components={{
                                      DropdownIndicator,
                                      IndicatorSeparator: () => null,
                                    }}
                                    value={this.state.departmentData}
                                    options={this.state.departmentInfoArr}
                                    onChange={this.onDepartmentChange}
                                    isMulti
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
                                  <span className="">Preferred Language *</span>
                                </React.Fragment>
                              ) : (
                                <React.Fragment>
                                  <span className="">Native Language *</span>
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
                      {this.state.roleData.label === "LEI" ? <React.Fragment>
                      <div className="department-form">
                      <div className="row">
                            <div className="col-md-6">
                                <div className="form_rbx">
                                    {" "}
                                    <span className="">
                                        Proficient Other Languages? *
                                    </span>
                                    <div className="check-field">
                                        <label className="checkbox_btn">
                                            <input
                                                type="radio"
                                               
                                                value="true"
                                                checked={
                                                  this.state.isSelected_language === "true"
                                                }
                                                onChange={this.languageCheck}
                                                // onClick={(e) => this.onSelectYes_language(e)}
                                            />
                                            <span className="checkmark3"></span> Yes
                                        </label>
                                    </div>
                                    <div className="check-field">
                                        <label className="checkbox_btn">
                                            <input
                                                type="radio"
                                              
                                               value="false"
                                                checked={
                                                  this.state.isSelected_language === "false"
                                                   
                                                }
                                                onChange={this.languageCheck}
                                                // onClick={(e) => this.onSelectNo_language(e)}
                                            />
                                            <span className="checkmark3"></span> No
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                      </div>
                      <div className="department-form">
                      {this.state.isSelected_language == "true" ? (
                            <React.Fragment>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form_rbx">
                                            {" "}
                                            <span className="">Other language[s]</span>
                                            <div
                                                className="dropdwn"
                                                style={{
                                                    width: "93%",
                                                    cursor: "pointer",
                                                }}
                                            >

                                                <MultiSelectBox
                                                    optionData={this.state.languageArr}
                                                    value={this.state.otherLanguageData}
                                                    placeholder="Select"
                                                    onSelectChange={(value) => {
                                                        this.onOtherLanguageChange(value);
                                                    }}
                                                />
                                          
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                    </div>
                                    <div className="col-md-4">
                                    </div>
                                </div>
                                {this.state.otherLanguageSet.length > 0 ? (
                                    this.state.otherLanguageSet.map((oth, l) => (
                                        <React.Fragment key={l}>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form_rbx">
                                                        {" "}
                                                        <span className="">
                                                            Other language{" "}*
                                                        </span>
                                                        <div>{oth.name}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form_rbx">
                                                        {" "}
                                                        <span className="">
                                                            Other Language Proficiency Skills *
                                                        </span>

                                                        <MultiSelectBox
                                                            optionData={this.state.primaryLanguageSkillArr}
                                                            value={oth.skill}
                                                            placeholder="Select"
                                                            onSelectChange={(value) => {
                                                                this.onOtherLanguageSkillChange(value, l);
                                                            }}
                                                        />
                                                       
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form_rbx">
                                                        {" "}
                                                        <span className="">
                                                            Other Language Fluency Ratings *
                                                        </span>
                                                        <div className="rate">
                                                            <ReactStars
                                                                count={5}
                                                                onChange={(value) => {
                                                                    this.otherLanguageRatingChange(value, l);
                                                                }}
                                                                size={30}
                                                                // color="#fff"
                                                                activeColor="#009fe0"
                                                                value={oth.rating}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <React.Fragment></React.Fragment>
                                )}
                            </React.Fragment>
                        ) : (
                            <React.Fragment></React.Fragment>
                        )}

                      </div>
                      </React.Fragment> : <React.Fragment>
                        
                        </React.Fragment>}
                      <div className="department-form">
                        <div className="row">
                          <div className="col-md-5">
                            <div className="form_rbx">
                              <span className="">Email *</span>
                              {this.state.roleData.label === "LEI" ? (
                                <input
                                  disabled
                                  type="text"
                                  placeholder=""
                                  className="in-field2"
                                  value={this.state.email}
                                  onChange={(value) => {
                                    this.onEmailChange(value);
                                  }}
                                />
                              ) : (
                                <input
                                  type="text"
                                  placeholder=""
                                  className="in-field2"
                                  value={this.state.email}
                                  onChange={(value) => {
                                    this.onEmailChange(value);
                                  }}
                                />
                              )}
                            </div>
                          </div>
                          <div className="col-md-2"></div>
                          <div className="col-md-5">
                            <div className="form_rbx">
                              {" "}
                              <span className="">Mobile No *</span>
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
                                  <span className="">Job Title *</span>
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
                                {/* <div className="form_rbx">
                                  {" "}
                                  <span className="">Job Type *</span>
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
                                </div> */}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          {/* <div className="department-form">
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
                          </div> */}
                        </React.Fragment>
                      )}

                      {this.state.roleData.label === "LEI" ? <></> : <>
                        <div className="department-form">
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
                        </div>
                      </>
                      }
                      {this.state.roleData.label === "LEI" ? (
                        <React.Fragment>
                          <div className="department-form">
                            <div className="row">
                              <div className="col-md-5">
                                <div className="form_rbx">
                                  <span className="">Reference (MRN,Client ID or Other)</span>
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
                              <div className="col-md-2"></div>
                              <div className="col-md-5">
                                <div className="form_rbx">
                                  <span>
                                    Is there a country specific dialect required
                                    ?
                                  </span>
                                  <div className="check-field">
                                    <label className="checkbox_btn">
                                      {this.state.specificDialectCode ? (
                                        <input
                                          type="radio"
                                          name="radio"
                                          checked={true}
                                          value="yes"
                                          onChange={this.countrySpecific}
                                          // disabled
                                        />
                                      ) : (
                                        <input
                                          type="radio"
                                          name="radio"
                                          checked={false}
                                          value="yes"
                                          onChange={this.countrySpecific}
                                          // disabled
                                        />
                                      )}
                                      <span className="checkmark3"></span> Yes
                                    </label>
                                  </div>
                                  <div className="check-field">
                                    <label className="checkbox_btn">
                                      {this.state.specificDialectCode ? (
                                        <input
                                          type="radio"
                                          name="radio"
                                          checked={false}
                                          value="no"
                                          onChange={this.countrySpecific}
                                          // disabled
                                        />
                                      ) : (
                                        <input
                                          type="radio"
                                          name="radio"
                                          checked={true}
                                          value="no"
                                          onChange={this.countrySpecific}
                                          // disabled
                                        />
                                      )}
                                      <span className="checkmark3"></span> No
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="department-form">
                            <div className="row">
                              <div className="col-md-5">
                                <div className="form_rbx">
                                  <span>Country Of Origin</span>
                                  <SelectBox
                                    optionData={this.state.allCountryOption}
                                    value={this.state.selectedCountry}
                                    onSelectChange={(value) => this.leiCountryChange(value)}
                                  
                                  ></SelectBox>
                                </div>
                              </div>
                              <div className="col-md-2"></div>
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
                                  {this.state.checkStatus
                                    ? "Active"
                                    : "Inactive"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}
                        {this.state.roleData.label === "LEI" ? (
                        <React.Fragment />
                      ) : (
                        <React.Fragment>

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
                                  {this.state.checkStatus ?
                                    <AntSwitch
                                      checked={true}
                                      inputProps={{
                                        "aria-label": "ant design",
                                      }}
                                      name="active"
                                      onClick={(e) => this.onStatusChange(e)}
                                    /> :
                                    <AntSwitch
                                      checked={false}
                                      inputProps={{
                                        "aria-label": "ant design",
                                      }}
                                      name="active"
                                      onClick={(e) => this.onStatusChange(e)}
                                    />
                                  }
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
                      </React.Fragment>
                      )}
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
                                  <span className="">Contact Email</span>
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
                        href="javascript:void(0)"
                        className="white-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.onCancel}
                      >
                        Back
                      </a>
                      <a
                        href="javascript:void(0)"
                        className="blue-btn"
                        style={{ textDecoration: "none", color: "#fff" }}
                        onClick={this.onNext}
                      >
                        {this.state.roleData.label === "LEI"
                          ? "Update"
                          : "Next"}
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
              <div
                className=""
                style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
              >
                {" "}
                <Link to="/adminDashboard">Dashboard</Link> / <Link to="/adminClientContactList">Client Contacts</Link> / Edit
              </div>
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
                            <th style={{ width: "30%", textAlign: "left" }}>
                              Address
                            </th>
                          </tr>
                          {this.state.locArr.map((item) => (
                            <tr>
                              <td colSpan="10">
                                <div className="tble-row">
                                  <table
                                    width="100%"
                                    border="0"
                                    cellPadding="0"
                                    cellSpacing="0"
                                  >
                                    <React.Fragment>
                                      <td style={{ width: "30%" }}>
                                        {item.name}
                                      </td>

                                      <td style={{ width: "40%" }}></td>

                                      <td
                                        style={{
                                          width: "30%",
                                          textAlign: "left",
                                        }}
                                      >
                                        {item.loc.map(
                                          (item1, key) =>
                                            (key ? ", " : "") + item1.location
                                        )}
                                      </td>
                                    </React.Fragment>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          ))}
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
                              Direct Line(After Business Hours/for Emergency) *
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
                            {/* <div className="department-form">
                              <div className="row"> */}
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
                            {/* </div>
                            </div> */}
                          </React.Fragment>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}
                      </div>
                    </div>
                    {this.state.roleData.label === "Requester" ? (
                      <React.Fragment>
                        <div className="col-md-6">
                          {this.state.isSelected === true ? <React.Fragment>
                            <div className="form_rbx">
                              <span className="">Amount($)</span>
                              {/* <InputText
                                type="text"
                                placeholder=""
                                className="in-field2"
                                value={this.state.amount}
                                onTextChange={(value) => {
                                  this.onAmountChange(value);
                                }}
                              /> */}
                               <div className="input-group">
                                  <div class="input-group-prepend">
                                    <span
                                      class="input-group-text dollar"
                                      id="basic-addon1"
                                      style={{ fontSize: "17px" }}
                                    >
                                      $
                                    </span>
                                  </div>

                                  <input
                                    className="inputfield flr"
                                    type="text"
                                    placeholder="Enter Amount"
                                    value={this.state.amount}
                                    style={{ width: "75%" }}
                                    onChange={(e) =>
                                      this.onAmountChange(e)
                                    }
                                  />
                                </div>
                            </div>
                          </React.Fragment> : <React.Fragment />}

                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}

                    <div className="_button-style m30 _fl text-center">
                      <a
                        href="javascript:void(0)"
                        className="white-btn"
                        style={{ textDecoration: "none" }}
                        onClick={this.onAddressCancel}
                      >
                        Back
                      </a>
                      <a
                        href="javascript:void(0)"
                        className="blue-btn"
                        style={{ textDecoration: "none", color: "#fff" }}
                        onClick={this.onAddressNext}
                      >
                        Update
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
      </React.Fragment>
    );
  }
}

class Schedule extends React.Component {
  render() {
    const { onClick } = this.props;
    return (
      <img style={{ width: "35px", height: "37px", borderRadius: "4px", cursor: "pointer" }} src={ImageName.IMAGE_NAME.CALENDER4} onClick={onClick} />
    );
  }
}
