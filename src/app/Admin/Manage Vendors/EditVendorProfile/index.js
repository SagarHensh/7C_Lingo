import React, { createRef } from "react";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import Select, { components } from "react-select";
import "./vendorEdit.css";
import "./bootSelect.css";
import $, { data } from "jquery";
import ReactStars from "react-rating-stars-component";
import Multiselect from "multiselect-react-dropdown";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import {
  consoleLog,
  getCountryList,
  getLookUpDataFromAPI,
  getVendorServiceList,
  phoneNumberCheck,
  SetDatabaseDateFormat,
  SetDOBFormat,
  SetUSAdateFormat,
} from "../../../../services/common-function";
import {
  departmentValidator,
  emailValidator,
  inputEmptyValidate,
  mobileNumberValidator,
  numberValidator,
  zipValidate,
} from "../../../../validators";
import { ApiCall } from "../../../../services/middleware";
import {
  IMAGE_PATH_ONLY,
  IMAGE_STORE_PATH,
  IMAGE_URL,
  VENDOR_SERVICE_OFFERED,
} from "../../../../services/config/api_url";
import axios from "axios";
import { ErrorCode } from "../../../../services/constant";
import { Decoder } from "../../../../services/auth";
import { TextField } from "@mui/material";
import { AlertMessage, ImageName } from "../../../../enums";
import { toast, ToastContainer } from "react-toastify";
import ReactLoader from "../../../Loader";
import history from "../../../../history";
import { MultiSelectBox, SelectBox } from "../../SharedComponents/inputText";
import { Regex } from "../../../../services/config";
import { Link } from "react-router-dom";
import moment from "moment";
import 'moment-timezone';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ServiceInfo from "./ServiceInfo";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { passWordRandomGenerate } from "../Vendor List/function";
import VendorMenuPages from "./VendorMenuPages";
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

//Style for option button................
const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

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

// ......................For Location Dropdown..........................................

const DropdownLocation = (props) => {
  return (
    <components.DropdownLocation {...props}>
      <img src={ImageName.IMAGE_NAME.LOCATION} style={{ width: "17px" }} />
    </components.DropdownLocation>
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
const otherLanguageSkillArr = [
  {
    text: "Read",
    value: 1,
  },
  {
    text: "Write",
    value: 2,
  },
  {
    text: "Speak",
    value: 3,
  },
];

const workArr = [{
  label: "0",
  value: "0",
  // selected: false,
},
{
  label: "1",
  value: "1",
  // selected: false,
},
{
  label: "2",
  value: "2",
  // selected: false,
},
{
  label: "3",
  value: "3",
  // selected: false,
},
{
  label: "4",
  value: "4",
  // selected: false,
},
{
  label: "5",
  value: "5",
  // selected: false,
},
{
  label: "6",
  value: "6",
  // selected: false,
},
{
  label: "7",
  value: "7",
  // selected: false,
},
{
  label: "8",
  value: "8",
  // selected: false,
},
{
  label: "9",
  value: "9",
  // selected: false,
},
{
  label: "10",
  value: "10",
  // selected: false,
},
{
  label: "10+",
  value: "11",
  // selected: false,
},
];

export default class EditVendorProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showId: "",
      fname: "",
      lname: "",
      email: "",
      alternateEmail: "",
      phoneNumber: "",
      alternatePhoneNumber: "",
      whatsappNumber: "",
      allGender: [],
      genderId: "",
      genderArr: [],
      genderData: {},
      dob: "",
      workExperience: "",
      workArr: [],
      workData: {},
      source: "",
      sourceArr: [],
      sourceData: {},
      allSourses: [],
      sourceName: "",
      country: "",
      primaryLocation: "",
      billingLocation: "",
      countryArr: [],
      countryData: {},
      timezone: "",
      timeZoneArr: [],
      timeZoneData: {},
      bio: "",
      isFriend: false,
      countryCode: 1,
      // ...................service info.......
      roleArr: [],
      roleData: {},
      role: "",
      languageArr: [],
      primaryLanguageArr: [],
      primaryLanguageData: {},
      primaryLanguageSkillArr: [],
      primaryLanguage: "",
      primaryLanguageId: "",
      primaryLanguageSkillArr: [],
      primaryLanguageSkillData: [],

      otherLanguageArr: [],
      otherLanguageData: [],
      otherLanguageSkillData: [],
      translationServiceArr: [],
      selectedTranslationServices: [],
      translationData: [],
      allProficiencySkills: [],
      primaryProficiencySkills: [],
      primaryLanguageRating: "",
      otherLanguage: false,
      proficientOtherLanguages: [],
      otherProficientSkills: [],
      otherLanguageRating: "",
      restrainingServicesArr: [],
      trainingServiceData: [],
      allServices: [],
      servicesOffered: [],
      notes: "",
      locationLabel: "",
      locationArr: [],
      locationData: {},
      billingLocationData: {},
      primaryLocationLabel: "",
      primaryCountryId: "",
      primaryStateId: "",
      primaryCountryData: {},
      billingCountryData: {},
      stateArr: [],

      primaryStateData: {},
      billingStateData: {},
      primaryCity: "",
      primaryZip: "",
      isSameAddress: false,
      billingIsSameAddress: false,
      billingLoctionLabel: "",
      billingCountryId: "",
      billingStateId: "",
      billingCity: "",
      billingZip: "",
      paymentArr: [],
      paymentData: {},
      paymentId: "",

      trainerNotes: "",
      translatorNotes: "",
      trainingMode: "",
      allTrainingMode: [],
      selectedMode: "30",

      bankAccountNo: "",
      bankRoutingNo: "",
      paymentEmail: "",

      westernUnionAccountNo: "",
      westernNotes: "",
      paymentNotes: "",
      paymentNotes: "",
      payoneerNotes: "",
      // ..........

      otherLanguage: "",

      serviceArrData: [],
      subArrData: [],
      serviceId: [],
      subType: [],
      selectAddress: [],
      selectBillingAddress: [],
      states: "",
      // stateArrData: [],
      resTrainingCategoryArr: [],
      allAdddress: [], //for location address
      isChecked: false,
      isHeadChecked: false,
      adminPhoto: "",
      imagePath: "images/profile-pic.png",
      isLoad: true,
      vendorId: "",
      allTimeZone: [],
      vendorRating: "",
      isSelected: null,

      translationArrId: "",
      addressInfoCountry: "",
      addressBillingInfoCountry: "",
      stateArrId: "",
      vendorUserId: "",
      otherLanguageSet: [],
      translatorLanguageSet: [{
        id: "",
        name: "",
        source: "",
        selectedTranslationSourceLanguage: {
          label: "English",
          value: "110"
        },
        target: "",
        selectedTranslationTargetLanguage: {},
        skill: [],
        rating: ""
      }],
      selectedSubData: [],
      roleLanguageArr: [],

      vendorLocationArr: [],
      vendorLocationData: {},
      vendorProfileLocation: [],
      anchorEl: null
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    let mainData = this.props.location;
    let preData = mainData.state;
    if (preData.id === undefined) {
      return history.push("/adminVendorList")
    } else {
      this.setState({
        showId: preData.id
      })
    }
    this.getTrainingServices();
    this.getVendorInfo();

    // this.getService();
    // this.trainerService();

    this.setState({
      phoneNumber: "+" + this.state.countryCode + " ",
      alternatePhoneNumber: "+" + this.state.countryCode + " ",
      whatsappNumber: "+" + this.state.countryCode + " ",
      // roleArr: roleArr,
      primaryLanguageSkillArr: languageSkillArr,
      otherLanguageSkillArrData: otherLanguageSkillArr,

      // serviceArrData: serviceArr,
    });
    window.$(".my-form-rw h3").click(function () {
      $(this).parent().find(".my-form-bx").slideToggle();
      $(this).toggleClass("open");
    });
  }

  getTrainingServices = async () => {
    let data = {};
    let trainingArr = [];
    let allModes = [];
    let res = await ApiCall("getLookUpData", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      let lookUpData = payload.data.lookupdata;
      // consoleLog("Lookup data res>>>>", lookUpData);
      allModes = lookUpData.COURSE_FORMAT_TYPE;


      let trainingServices = lookUpData.TRAINING_CATEGORY_TYPE;

      for (let i = 0; i < trainingServices.length; i++) {
        trainingArr.push({
          label: trainingServices[i].name,
          value: trainingServices[i].id,
        });
      }

      this.setState({
        allTrainingMode: allModes,
        restrainingServicesArr: trainingArr,
      });
    }
  };

  getVendorInfo = async () => {
    let mainData = this.props.location;
    let preData = mainData.state;
    let addressInfo = [],
      serviceDataArr = [],
      parseData = {},
      serviceDataObj = {},
      interpretorArr = [],
      translatorArr = [],
      trainerArr = [],
      serviceArr = [],
      billingInfo = [];
    let roleLanguageArr = [];
    let paymentDataResArr = [];
    let addressData = {
      vendorid: preData.id,
    };

    this.setState({
      showId: preData.id
    })

    let serviceRes = await ApiCall("fetchVendorService", addressData);
    if (
      serviceRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      serviceRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(serviceRes.data.payload);
      // consoleLog("Fetch Vendor Service Details", payload.data);
      serviceArr = payload.data.service;
      roleLanguageArr = payload.data.languages;
      // consoleLog("Vendor serviceInfo response>>>>>>>", serviceArr);
      // consoleLog("Vendor Language Array ::", roleLanguageArr)
      if (serviceArr.length > 0) {
        for (let i = 0; i < serviceArr.length; i++) {
          parseData = JSON.parse(serviceArr[i].details);
          serviceDataArr.push({
            label: parseData.name,
            value: parseData.id,
          });
          // serviceDataArrJSON.parse(serviceArr[i].details);
        }


        for (let a = 0; a < serviceArr.length; a++) {
          if (serviceArr[a].serviceid === 45) {

            interpretorArr = JSON.parse(serviceArr[a].details);
            // console.log("Interpretor parse datta>>", interpretorArr)

            // trainerArr = JSON.parse(serviceArr[2].details);



            let obj = {};
            obj = {
              label: interpretorArr.name,
              value: parseInt(interpretorArr.id)
            }
            // this.getService(parseInt(interpretorArr.id));

            let serviceResData = [];
            axios.post(VENDOR_SERVICE_OFFERED).then((res) => {
              if (
                res.data.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                res.data.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
              ) {
                let payload = Decoder.decode(res.data.data.payload);

                let allserviceArr = payload.data.services,
                  serArr = [];
                // consoleLog("All service Arr>>>", allserviceArr);
                if (allserviceArr.length > 0) {
                  allserviceArr.map((data) => {
                    if (data.id === parseInt(serviceArr[a].serviceid)) {
                      if (data.subItem.length > 0) {
                        data.subItem.map((aa) => {
                          serArr.push({
                            label: aa.subItemName,
                            value: aa.id,
                            subData: aa.subData
                          })
                        })
                      }
                      serviceResData = serArr;
                    }
                  })
                }
                this.setState({
                  serviceArrData: serviceResData,
                });

                // console.log("Service Res Data>>>", serviceResData);
                let arr = [];
                serviceResData.map((data) => {
                  if (interpretorArr.subItem) {
                    interpretorArr.subItem.map((int) => {
                      if (data.value == int.id) {
                        if (int.subData && data.subData) {
                          var brr = [];
                          for (let a = 0; a < data.subData.length; a++) {
                            var aa = data.subData[a];
                            var chkFlag = 0;
                            for (let b = 0; b < int.subData.length; b++) {
                              var bb = int.subData[b];
                              if (aa.id == bb.id) {
                                chkFlag = 1;
                                break;
                              }
                            }
                            if (chkFlag == 1) {
                              brr.push({
                                id: aa.id,
                                name: aa.name,
                                isChecked: true
                              })
                            } else {
                              brr.push({
                                id: aa.id,
                                name: aa.name,
                                isChecked: false
                              })
                            }
                          }
                          arr.push({
                            label: int.subItemName,
                            value: int.id,
                            subData: brr
                          })
                        }
                      }
                    })
                  }
                })
                // console.log("array service offered>>>", arr)
                this.setState({
                  serviceId: arr,
                });
              }
            });

            this.setState({
              roleData: obj,
              role: obj.value,
              // serviceId: interpretorArr.subItem
            });

            let languageResData = await ApiCall("getlanguagelist");
            let languagePayload = Decoder.decode(languageResData.data.payload);
            let languageResArrData = languagePayload.data.languagelist;
            // console.log("language Arr>>>", this.state.languageArr);
            let languageArrData = [];
            for (let n = 0; n < languageResArrData.length; n++) {
              languageArrData.push({
                label: languageResArrData[n].language,
                value: languageResArrData[n].id,
              });
            }
            this.setState({
              languageArr: languageArrData
            })
            // console.log("all language : ", languageArrData)

            roleLanguageArr.map((data, i) => {
              if (data.serviceId === parseInt(interpretorArr.id)) {
                if (data.info.length > 0) {
                  // console.log("Language Array Length>>>", data.info);
                  // console.log("Language List : ", languageArrData)
                  if (data.info.length > 1) {
                    this.setState({
                      isSelected: true
                    });
                    // document.getElementById("otherLan_yes").checked = true;
                    let arr = [];
                    let brr = [];
                    for (let i = 1; i < data.info.length; i++) {
                      let crr = [];
                      if (data.info[i].isPrimary === 0) {
                        languageArrData.map((ldata) => {
                          if (ldata.value === data.info[i].languageId) {
                            if (data.info[i].canRead === 1) {
                              crr.push({
                                label: "Read",
                                value: 1,
                              })
                            }
                            if (data.info[i].canWrite === 1) {
                              crr.push({
                                label: "Write",
                                value: 2,
                              })
                            }
                            if (data.info[i].canSpeak === 1) {
                              crr.push({
                                label: "Speak",
                                value: 3,
                              })
                            }
                            arr.push({
                              id: data.info[i].languageId,
                              name: ldata.label,
                              skill: crr,
                              rating: data.info[i].ratings
                            });
                            brr.push({
                              label: ldata.label,
                              value: ldata.value
                            })
                          }
                        })

                      }
                    }
                    this.setState({
                      otherLanguageData: brr,
                      otherLanguageSet: arr
                    })
                  } else {
                    // document.getElementById("otherLan_no").checked = true;
                  }
                  data.info.map((linfo, j) => {
                    if (linfo.isPrimary === 1) {
                      languageArrData.map((lan) => {
                        if (lan.value === linfo.languageId) {
                          this.setState({
                            primaryLanguageData: {
                              label: lan.label,
                              value: lan.value
                            }
                          })
                        }
                      });
                      let primarySkillArr = [];
                      if (linfo.canRead === 1) {
                        primarySkillArr.push({
                          label: "Read",
                          value: 1
                        })
                      }
                      if (linfo.canWrite === 1) {
                        primarySkillArr.push({
                          label: "Write",
                          value: 2
                        })
                      }
                      if (linfo.canSpeak === 1) {
                        primarySkillArr.push({
                          label: "Speak",
                          value: 3
                        })
                      }
                      // console.log("Primary ratings : ", linfo.ratings)
                      this.setState({
                        primaryLanguageSkillData: primarySkillArr,
                        primaryLanguageRating: linfo.ratings
                      })
                    }
                  })
                }
              }
              if (data.serviceId === 46) {
                let trLanArr = [];
                if (data.info.length > 0) {
                  data.info.map((lan) => {
                    let sourceObj = {
                      label: "English",
                      value: "110"
                    },
                      targetObj = {},
                      crr = [];
                    languageArrData.map((ll) => {
                      if (ll.value == lan.targetLanguageId) {
                        targetObj = ll;
                        if (lan.canRead === 1) {
                          crr.push({
                            label: "Read",
                            value: 1,
                          })
                        }
                        if (lan.canWrite === 1) {
                          crr.push({
                            label: "Write",
                            value: 2,
                          })
                        }
                        if (lan.canSpeak === 1) {
                          crr.push({
                            label: "Speak",
                            value: 3,
                          })
                        }

                        trLanArr.push({
                          id: lan.languageId,
                          name: ll.label,
                          source: "110",
                          selectedTranslationSourceLanguage: sourceObj,
                          target: lan.targetLanguageId.toString(),
                          selectedTranslationTargetLanguage: targetObj,
                          skill: crr,
                          rating: lan.ratings
                        })
                      }
                    })
                  });
                  // consoleLog("translatorLanguageSet",trLanArr)
                  this.setState({
                    translatorLanguageSet: trLanArr
                  })
                }
              }
            });
            break;
          } else if (serviceArr[a].serviceid === 46) {
            this.getService(46);
            let selectedTranslationServices = [];
            translatorArr = JSON.parse(serviceArr[1].details);
            // consoleLog("Translator details Arr::", translatorArr);
            if (translatorArr.subItem !== undefined) {
              if (translatorArr.subItem.length > 0) {
                translatorArr.subItem.map((tr) => {
                  selectedTranslationServices.push({
                    label: tr.subItemName,
                    value: tr.id
                  })
                })
              }
            }

            this.setState({
              selectedTranslationServices: selectedTranslationServices
            })
            break;

          } else if (serviceArr[a].serviceid === 47) {
            trainerArr = JSON.parse(serviceArr[a].details);
            let trrSer = [],
              trMode = "";

            consoleLog("Trainer Array ::", trainerArr)

            if (trainerArr.length > 0) {
              trainerArr.map((tr) => {
                trrSer.push({
                  label: tr.subItemName,
                  value: tr.id
                });
              })
            }

            if (trainerArr.mode) {
              if (Object.keys(trainerArr.mode).length > 0) {
                trMode = trainerArr.mode.id
              }
            }

            this.setState({
              trainingServiceData: trrSer,
              selectedMode: trMode
            })
            break;
          }
        }
      }
    }

    // ................ Vendor Address Data...................................

    let addressRes = await ApiCall("getVendorAddress", addressData);

    if (
      addressRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      addressRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(addressRes.data.payload);
      if (payload.data.length > 0) {
        addressInfo = payload.data[0];
        billingInfo = payload.data[1];
      }
    }
    // .................. Vendor Payment Data..........................
    let paymentRes = await ApiCall("getVendorPayment", addressData);
    if (
      paymentRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      paymentRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payloadPayment = Decoder.decode(paymentRes.data.payload);

      paymentDataResArr = payloadPayment.data;

      let routingNumber = "",
        accountNumber = "",
        westernUnionAccountNo = "",
        email = "";

      if (paymentDataResArr.paymentMethodTypeId === 18) {
        routingNumber = paymentDataResArr.paymentDetails.routingNumber;
        accountNumber = paymentDataResArr.paymentDetails.accountNumber;
        this.setState({
          paymentEmail: paymentDataResArr.paymentDetails.email,
        });
      }

      if (
        paymentDataResArr.paymentMethodTypeId === 19 ||
        paymentDataResArr.paymentMethodTypeId === 20 ||
        paymentDataResArr.paymentMethodTypeId === 21
      ) {
        email = paymentDataResArr.paymentDetails.email;
      }
      if (paymentDataResArr.paymentMethodTypeId === 21) {
        westernUnionAccountNo = paymentDataResArr.paymentDetails.accountNumber;
      }

      this.setState({
        paymentNotes: paymentDataResArr.notes,
        paymentEmail: email,
        paymentId: paymentDataResArr.paymentMethodTypeId,

        bankAccountNo: accountNumber,
        bankRoutingNo: routingNumber,
        westernUnionAccountNo: westernUnionAccountNo,
      });
    }

    if (addressInfo.countryId !== undefined || addressInfo.countryId !== "") {
      let countryData = {
        countryid: parseInt(addressInfo.countryId),
      };
      let statedata = await this.setStateByCountry(countryData);
      this.setState({
        stateArr: statedata
      })
    }
    this.setState({
      primaryLocation: addressInfo.address,
      billingLocation: billingInfo.address,
      // primaryLocationLabel: addressInfo.address,
      primaryCountryId: addressInfo.countryId,
      primaryStateId: addressInfo.stateId,
      primaryCity: addressInfo.city,
      primaryZip: addressInfo.zipCode,
      // billingLocationLabel: billingInfo.address,
      billingCountryId: billingInfo.countryId,
      billingStateId: billingInfo.stateId,
      billingCity: billingInfo.city,
      billingZip: billingInfo.zipCode,
      billingIsSameAddress: addressInfo.sameAsPrimary === 0 ? true : false,
      roleArr: serviceDataArr,
      roleLanguageArr: roleLanguageArr,
    });

    this.getVendorProfileInfo(preData.id);


  };

  getVendorProfileInfo = async (id) => {
    let data = {
      vendorid: id,
    };
    let admindata = [];
    let res = await ApiCall("vendoraccountinfo", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);

      admindata = payload.data[0];
      // consoleLog("Vendor account Info:::", admindata)
      if (payload.data.length > 0) {
        this.getCommonData(payload.data[0])
      }
      this.setState({
        fname: payload.data[0].fName,
        lname: payload.data[0].lName,
        email: payload.data[0].email,
        alternateEmail: payload.data[0].altEmail,

        phoneNumber:
          "+" + this.state.countryCode + " " + payload.data[0].mobile,
        alternatePhoneNumber:
          "+" + this.state.countryCode + " " + payload.data[0].altPhone,
        whatsappNumber:
          "+" + this.state.countryCode + " " + payload.data[0].whatsapp,
        genderId: payload.data[0].genderTypeId,
        dob: payload.data[0].dob == null ? "" : SetUSAdateFormat(payload.data[0].dob),
        workArr: workArr,
        workExperience: payload.data[0].experience,
        bio: payload.data[0].bio,
        timezone: payload.data[0].timezoneId,
        source: payload.data[0].sourceTypeId,
        isFriend: payload.data[0].sourceTypeId === 16 ? true : false,
        sourceName: payload.data[0].additionalSource,
        adminPhoto: admindata.photo,
        vendorId: id,
        country: payload.data[0].countryId,
        vendorRating: payload.data[0].ratings,
        vendorLocationData: {
          label: payload.data[0].locationName,
          value: payload.data[0].locationId,
        },
        vendorProfileLocation: [{
          lat: payload.data[0].lat,
          long: payload.data[0].lng,
          locationName: payload.data[0].locationName,
          locationId: payload.data[0].locationId
        }],
      });

      if (
        admindata.photo === null ||
        admindata.photo === undefined ||
        admindata.photo === "" ||
        admindata.photo === "aaa.jpg"
      ) {
        this.setState({
          imagePath: IMAGE_STORE_PATH + "profilepic1635924283919.png",
        });
      } else {
        this.setState({
          imagePath: IMAGE_PATH_ONLY + admindata.photo,
        });
      }

      if (
        this.state.adminPhoto !== "" &&
        this.state.adminPhoto !== undefined &&
        this.state.adminPhoto != null
      ) {
        this.setState({
          hidden: true,
        });
      } else {
        this.setState({
          hidden: false,
        });
      }
    }
  }

  getService = async (typeId) => {
    axios.post(VENDOR_SERVICE_OFFERED).then((res) => {
      if (
        res.data.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.data.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let payload = Decoder.decode(res.data.data.payload);

        let serviceArr = payload.data.services;
        let serviceResData = [],
          arr = [];
        serviceArr.map((data) => {
          if (data.id === typeId) {
            if (data.subItem.length > 0) {
              data.subItem.map((aa) => {
                if (aa.subData !== undefined) {
                  arr.push({
                    label: aa.subItemName,
                    value: aa.id,
                    subData: aa.subData
                  })
                } else {
                  arr.push({
                    label: aa.subItemName,
                    value: aa.id
                  })
                }
              })
            }
            serviceResData = arr
          }
        })

        this.setState({
          serviceArrData: serviceResData,
        });
      }
    });
  };

  getCommonData = async (apiData) => {
    consoleLog("Apidata::", apiData)
    let countryResData = await getCountryList();
    let timeResData = await ApiCall("fetchtimezonelist");
    let languageResData = await ApiCall("getlanguagelist");
    let genderArrData = [],
      sourceArrData = [],
      countryArrData = [],
      stateObjData = {},
      stateObjDataBill = {},
      genderIdData = {},
      workIdData = {},
      sourceIdData = {},
      countryIdData = {},
      primaryCountryIdData = {},
      billingCountryIdData = {},
      primaryStateIdData = {},
      billingStateIdData = {},
      timeZoneArrData = [],
      timeArrData = [],
      timeIdData = {},
      languageResArrData = [],
      languageArrData = [],
      paymentArrData = [],
      paymentObjData = {};

    // this.setState({
    //   allCountry: country,
    // });
    // this.getCountryData(country);

    let lookUpData = await getLookUpDataFromAPI();
    let timePayload = Decoder.decode(timeResData.data.payload);
    let languagePayload = Decoder.decode(languageResData.data.payload);
    timeZoneArrData = timePayload.data.timezonelist;
    languageResArrData = languagePayload.data.languagelist;
    // console.log("language::::", lookUpData.PAYMENT_METHOD_TYPE);
    for (let h = 0; h < lookUpData.PAYMENT_METHOD_TYPE.length; h++) {
      paymentArrData.push({
        label: lookUpData.PAYMENT_METHOD_TYPE[h].name,
        value: lookUpData.PAYMENT_METHOD_TYPE[h].id,
      });
      if (this.state.paymentId === lookUpData.PAYMENT_METHOD_TYPE[h].id) {
        paymentObjData = {
          label: lookUpData.PAYMENT_METHOD_TYPE[h].name,
          value: lookUpData.PAYMENT_METHOD_TYPE[h].id,
        };
      }
    }
    for (let i = 0; i < lookUpData.GENDER_TYPE.length; i++) {
      genderArrData.push({
        label: lookUpData.GENDER_TYPE[i].name,
        value: lookUpData.GENDER_TYPE[i].id,
      });

      if (apiData.genderTypeId === lookUpData.GENDER_TYPE[i].id) {
        genderIdData = {
          label: lookUpData.GENDER_TYPE[i].name,
          value: lookUpData.GENDER_TYPE[i].id,
        };
      }
    }

    for (let j = 0; j < workArr.length; j++) {
      if (Number(apiData.experience) == Number(workArr[j].value))
        workIdData = {
          label: workArr[j].label,
          value: workArr[j].value,
        };
    }
    for (let k = 0; k < lookUpData.SOURCE_TYPE.length; k++) {
      sourceArrData.push({
        label: lookUpData.SOURCE_TYPE[k].name,
        value: lookUpData.SOURCE_TYPE[k].id,
      });
      if (apiData.sourceTypeId === lookUpData.SOURCE_TYPE[k].id)
        sourceIdData = {
          label: lookUpData.SOURCE_TYPE[k].name,
          value: lookUpData.SOURCE_TYPE[k].id,
        };
    }
    for (let l = 0; l < countryResData.length; l++) {
      countryArrData.push({
        label: countryResData[l].name,
        value: countryResData[l].id,
      });
      if (apiData.countryId === countryResData[l].id) {
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

    if (this.state.timezone == "591" || this.state.timezone == "0") {
      var tz = moment.tz.guess();
      // consoleLog("Time Zone Moment::", tz);
      timeZoneArrData.map((tt) => {
        if (tt.timezone === tz) {
          timeIdData = {
            label: tt.timezone,
            value: tt.id
          }
        }
      })
    } else {
      for (let m = 0; m < timeZoneArrData.length; m++) {
        timeArrData.push({
          label: timeZoneArrData[m].timezone,
          value: timeZoneArrData[m].id,
        });

        if (this.state.timezone === timeZoneArrData[m].id) {
          timeIdData = {
            label: timeZoneArrData[m].timezone,
            value: timeZoneArrData[m].id,
          };
        }
      }
    }
    for (let n = 0; n < languageResArrData.length; n++) {
      languageArrData.push({
        label: languageResArrData[n].language,
        value: languageResArrData[n].id,
      });
    }
    let countryDataId = {
      countryid: this.state.primaryCountryId,
    };
    let res = await ApiCall("getstatelistofselectedcountry", countryDataId);

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

    this.setState({
      genderArr: genderArrData,
      genderData: genderIdData,
      sourceArr: sourceArrData,
      sourceData: sourceIdData,
      workData: workIdData,
      countryArr: countryArrData,
      countryData: countryIdData,
      primaryCountryData: primaryCountryIdData,
      billingCountryData: billingCountryIdData,
      timeZoneArr: timeArrData,
      timeZoneData: timeIdData,
      languageArr: languageArrData,
      paymentArr: paymentArrData,
      paymentData: paymentObjData,
      primaryStateData: stateObjData,
      billingStateData: stateObjDataBill,
      isLoad: false,
    });
  };

  onCityChange = (e) => {
    this.setState({
      primaryCity: e.target.value,
    });
  };
  onZipChange = (e) => {
    let val = zipValidate(e.target.value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        primaryZip: val,
      });
    }
    // let zip = numberValidator(e.target.value);
  };
  onBillingCityChange = (e) => {
    this.setState({
      billingCity: e.target.value,
    });
  };
  onBillingZipChange = (e) => {
    let val = zipValidate(e.target.value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        billingZip: val,
      });
    }
  };

  ratingChangedProfile = (newRating) => {
    // console.log("New Rating>>>", newRating);
    this.setState({
      vendorRating: newRating,
    });
  };

  PrimaryLanguageRatingChanged = (newRating) => {
    // console.log("New Primary Language Rating>>>", newRating);
    this.setState({
      primaryLanguageRating: newRating,
    });
  };

  otherLanguageRatingChange = (newRating, pos) => {
    // console.log("Other Languages", newRating);
    // console.log("Otherrating >>> ", pos);
    let arr = this.state.otherLanguageSet;
    arr[pos].rating = newRating;
    this.setState({
      // otherLanguageRating: newRating,
      otherLanguageSet: arr,
    });
  };

  /******* Account Info settings ******* */

  firstNameChange = (e) => {
    this.setState({
      fname: e.target.value,
    });
  };

  lastNameChange = (e) => {
    this.setState({
      lname: e.target.value,
    });
  };

  emailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  alternateEmailChange = (e) => {
    this.setState({
      alternateEmail: e.target.value,
    });
  };

  phoneChange = (e) => {
    if (numberValidator(e.target.value) === true) {
      if (mobileNumberValidator(e.target.value) === true) {
        let phoneCheck = phoneNumberCheck(e.target.value);
        if (phoneCheck) {
          this.setState({
            phoneNumber: phoneCheck,
          });
        }
      }
    }
  };

  alternatePhoneChange = (e) => {
    if (numberValidator(e.target.value) === true) {
      if (mobileNumberValidator(e.target.value) === true) {
        let phoneCheck = phoneNumberCheck(e.target.value);
        if (phoneCheck) {
          this.setState({
            alternatePhoneNumber: phoneCheck,
          });
        }
      }
    }
  };

  whatsappChange = (e) => {
    // console.log("::::----", e.target.value);
    if (numberValidator(e.target.value) === true) {
      if (mobileNumberValidator(e.target.value) === true) {
        let phoneCheck = phoneNumberCheck(e.target.value);
        if (phoneCheck) {
          this.setState({
            whatsappNumber: phoneCheck,
          });
        }
      }
    }
  };
  onGenderChange = (value) => {
    this.setState({
      genderData: value,
    });
  };

  onWorkExperienceChange = (value) => {
    this.setState({
      workData: value,
      workExperience: value.value
    });
  };
  dobChange = (date) => {
    this.setState({
      dob: SetUSAdateFormat(date),
    });
  };

  onSourceChange = (data) => {
    let friend = false;
    if (data.label === "Friends") {
      friend = true;
    } else {
      friend = false;
    }

    this.setState({
      isFriend: friend,
      sourceData: data,
    });
  };
  sourseNameChange = (e) => {
    this.setState({
      sourceName: e.target.value,
    });
  };
  onCountryChange = (data) => {
    this.setState({
      countryData: data,
    });
  };
  onTimeChange = (data) => {
    this.setState({
      timeZoneData: data,
    });
  };

  bioChange = (e) => {
    this.setState({
      bio: e.target.value,
    });
  };
  onRoleChange = (data) => {
    this.setState({
      roleData: data,
      role: data.value,
    });
    this.getService(parseInt(data.value));
    if (data.value == 46) {
      let trLanArr = [];
      var lanarr = this.state.roleLanguageArr;
      consoleLog("Lan Arr::", lanarr);
      lanarr.map((dd) => {
        if (dd.serviceId == 46) {
          if (dd.info.length > 0) {
            dd.info.map((lan) => {
              this.state.languageArr.map((ll) => {
                if (ll.value == lan.targetLanguageId) {
                  consoleLog("target language::", ll);

                  let targetObj = {},
                    crr = [],
                    sourceObj = {
                      label: "English",
                      value: 110
                    };
                  targetObj = ll;
                  if (lan.canRead === 1) {
                    crr.push({
                      label: "Read",
                      value: 1,
                    })
                  }
                  if (lan.canWrite === 1) {
                    crr.push({
                      label: "Write",
                      value: 2,
                    })
                  }
                  if (lan.canSpeak === 1) {
                    crr.push({
                      label: "Speak",
                      value: 3,
                    })
                  }

                  trLanArr.push({
                    id: lan.languageId,
                    name: ll.label,
                    source: "110",
                    selectedTranslationSourceLanguage: sourceObj,
                    target: lan.targetLanguageId.toString(),
                    selectedTranslationTargetLanguage: targetObj,
                    skill: crr,
                    rating: lan.ratings
                  })
                }
              })
            });
            consoleLog("translatorLanguageSet", trLanArr)
            this.setState({
              translatorLanguageSet: trLanArr
            })
          }
        }
      })
    }
  };
  onPrimaryLanguageChange = (data) => {
    this.setState({
      primaryLanguageData: data,
    });
  };
  onPrimaryLanguageSkillChange = (option) => {
    // console.log("Primary Language Skill>>>>", option)
    this.setState({
      primaryLanguageSkillData: option,
    });
  };
  onOtherLanguageChange = (option) => {
    // console.log("Other Language>>>", option);
    let arr = [];
    option.map((data) => {
      arr.push({
        id: data.value,
        name: data.label,
        skill: [],
        rating: "",
      });
    });
    // console.log("Language Set Arr>>>>", arr);
    this.setState({
      otherLanguageData: option,
      otherLanguageSet: arr,
    });
  };
  onOtherLanguageSkillChange = (option, pos) => {
    // console.log("skil option>>>", option);
    // console.log("skills position>>>>>", pos);
    let arr = this.state.otherLanguageSet;
    arr[pos].skill = option;
    this.setState({
      // otherLanguageSkillData: option,
      otherLanguageSet: arr,
    });
  };
  onTranslationChange = (option) => {
    this.setState({
      translationData: option,
    });
  };
  onTraningServiceChange = (option) => {
    this.setState({
      trainingServiceData: option,
    });
  };
  onTranslatorNotesChange = (e) => {
    this.setState({
      translatorNotes: e.target.value,
    });
  };
  onTrainerNotesChange = (e) => {
    this.setState({
      trainerNotes: e.target.value,
    });
  };

  // ..................multiselect dropdown for sevices offered........................
  onServiceSelect = (value) => {

    let arr = [];
    this.state.serviceArrData.map((data) => {
      if (data.subData) {
        value.map((aa) => {
          if (data.value === aa.value) {
            // consoleLog("Push Data::", data);
            let subDataArr = [];

            data.subData.map((ss) => {
              subDataArr.push({
                id: ss.id,
                name: ss.name,
                isChecked: false
              })
            });
            arr.push({
              label: data.label,
              value: data.value,
              subData: subDataArr
            })
            // arr.push(data)
          }
        })
        // consoleLog("Main Service Arr : :", arr)
        this.setState({
          serviceId: arr
        })
      } else {
        this.setState({
          serviceId: value
        })
      }
    });
  };

  onServiceRemove = (selectedList, removedItem) => {
    let arr = [];
    if (selectedList.length > 0) {
      for (let i = 0; i < selectedList.length; i++) {
        if (this.state.serviceArrData[i].subData) {
          arr.push({
            id: selectedList[i].id,
            subItemName: selectedList[i].subItemName,
            subData: this.state.serviceArrData[i].subData,
          });

          this.setState({
            serviceId: arr,
          });
        }
      }
    } else {
      this.setState({
        serviceId: []
      })
    }

  };

  // ..................service checkbox.......................
  subHeadCheckChange = (selectedList) => {
    // console.log(">>>>>>>>>>>>>>>>>>>head", selectedList);
    // let arr = [];
    // for (let i = 0; i < this.state.serviceId.length; i++) {
    //   arr.push({
    //     id: this.state.serviceId[i].id,
    //     subItemName: this.state.serviceId[i].subItemName,
    //     subData: this.state.serviceArrData[i].subData,
    //   });
    // }
    // this.setState({
    //   serviceId: arr,
    // });
  };

  subTypeChange = (e, parentId, subItemName, name) => {
    consoleLog("Event Value::", e.target.value)
    consoleLog("service ID ::", this.state.serviceId);
    consoleLog("selectedSubData :: ", this.state.selectedSubData);
    console.log(parentId, subItemName, name);


    let arr = this.state.serviceId;

    arr.map((data) => {
      if (data.value == parentId) {
        if (data.subData !== undefined) {
          data.subData.map((item) => {
            if (e.target.value == item.id) {
              if (e.target.checked) {
                item.isChecked = true;
              } else {
                item.isChecked = false;
              }
            }
          })
        }
      }
    });

    this.setState({
      serviceId: arr
    })
    // let arr = this.state.subType;
    // let brr = this.state.selectedSubData;
    // let crr = [];

    // if (e.target.checked) {

    //   if (brr.length > 0) {
    //     let countFlag = 0;
    //     for (let i = 0; i < brr.length; i++) {
    //       if (brr[i].id == id) {
    //         countFlag = 1;
    //         if (brr[i].subData !== undefined) {
    //           brr[i].subData.push({
    //             id: e.target.value,
    //             name: name
    //           })
    //         } else {
    //           brr[i]["subData"] = [];
    //           brr[i].subData.push({
    //             id: e.target.value,
    //             name: name
    //           })
    //         }
    //       }
    //     }
    //     if (countFlag === 0) {
    //       brr.push({
    //         id: id,
    //         subItemName: subItemName,
    //         subData: [{
    //           id: e.target.value,
    //           name: name
    //         }]
    //       })
    //     }
    //   } else {
    //     brr.push({
    //       id: id,
    //       subItemName: subItemName,
    //       subData: [{
    //         id: e.target.value,
    //         name: name,
    //         isChecked: true
    //       }]
    //     })

    //   }
    //   this.setState({
    //     selectedSubData: brr,
    //     isChecked: !this.state.isChecked,
    //   })
    // } else {
    //   for (let i = 0; i < brr.length; i++) {
    //     if (brr[i].id == id) {
    //       let temp = {
    //         id: id,
    //         subItemName: subItemName,
    //         subData: []
    //       };
    //       for (let j = 0; j < brr[i].subData.length; i++) {
    //         if (brr[i].subData[j].id == e.target.value) {

    //         } else {
    //           temp.subData = brr[i].subData
    //         }
    //       }
    //       crr.push(temp);
    //     } else {
    //       crr.push(brr[i])
    //     }
    //   }
    //   this.setState({
    //     selectedSubData: crr,
    //     isChecked: !this.state.isChecked,
    //   })

    // }


    // if (e.target.checked) {
    //   arr.push(e.target.value);
    //   this.state.serviceId.map((data) => {
    //     if (data.subData && data.subData.length > 0) {
    //       data.subData.map((sub) => {

    //       })
    //     }
    //   })
    // } else {
    //   if (arr.length > 0) {
    //     arr.map((data, i) => {
    //       if (data === e.target.value) {
    //         arr.splice(i, 1);
    //         crr.splice(i, 1);
    //       }
    //     });
    //   }
    // }

    // this.setState({
    //   subType: arr,
    //   isChecked: !this.state.isChecked,
    //   selectedSubData: crr
    // });
  };

  // ......................location............................

  onPrimaryLocationchange = (e) => {
    // console.log("PrimaryAddress:", e.target.value);
    this.setState({
      primaryLocation: e.target.value,
    });
  };
  onBillingLocationchange = (e) => {
    // console.log("BillingAddress:", e.target.value);
    this.setState({
      billingLocation: e.target.value,
    });
  };

  onLocationChange = (data) => {
    // console.log("data::::loc", data.label);
    if (data)
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
  onBillingLocationChange = (data) => {
    // console.log("data::::loc", data.label);
    if (data)
      this.setState({
        selectedLocation: data.label,
        billingLocationData: data,
      });
  };

  onBillingLocationInputChange = async (val) => {
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
          billingLocationData: val,
        });
      }
    }
  };
  onPrimaryCountryChange = async (data) => {
    let stateResArr = [];
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
          // console.log("payload:::", payload);
          let stateData = payload.data.statelist;
          // console.log("stateData:::::", stateData);
          for (let i = 0; i < stateData.length; i++) {
            stateResArr.push({
              label: stateData[i].name,
              value: stateData[i].id,
            });
          }
          this.setState({
            stateArrId: data.value,
            stateArr: stateResArr,
          });
        }
      }
    }
    this.setState({
      primaryCountryData: data,
    });
  };
  onBillingCountryChange = async (data) => {
    let stateResArr = [];
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
          // console.log("payload:::", payload);
          let stateData = payload.data.statelist;
          // console.log("stateData:::::", stateData);
          for (let i = 0; i < stateData.length; i++) {
            stateResArr.push({
              label: stateData[i].name,
              value: stateData[i].id,
            });
          }
          this.setState({
            stateArrId: data.value,
            stateArr: stateResArr,
          });
        }
      }
    }
    this.setState({
      billingCountryData: data,
    });
  };

  setStateByCountry = async (data) => {
    var stateResArr = [];
    let res = await ApiCall("getstatelistofselectedcountry", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      // console.log("payload:::", payload);
      let stateData = payload.data.statelist;
      // console.log("stateData:::::", stateData);
      for (let i = 0; i < stateData.length; i++) {
        stateResArr.push({
          label: stateData[i].name,
          value: stateData[i].id,
        });
      }
      return stateResArr;
    }
  }

  onPrimaryStateChange = (data) => {
    console.log("primarystateData::::", data);
    this.setState({
      primaryStateData: data,
    });
  };
  onBillingStateChange = (data) => {
    this.setState({
      billingStateData: data,
    });
  };

  onPaymentChange = (data) => {
    this.setState({
      paymentData: data,
    });
  };
  onAccountNumberChange = (e) => {
    let val = e.target.value;
    if (Regex.ONLY_NUMBER_REGEX.test(+val)) {
      this.setState({
        bankAccountNo: val,
      });
    }
  };
  westernAccountNumberChange = (e) => {
    let val = e.target.value;
    if (Regex.ONLY_NUMBER_REGEX.test(+val)) {
      this.setState({
        westernUnionAccountNo: val,
      });
    }
  };
  onRoutingNumberChange = (e) => {
    let val = e.target.value;
    if (Regex.ONLY_NUMBER_REGEX.test(+val)) {
      this.setState({
        bankRoutingNo: val,
      });
    }
  };
  onPaymentEmailChange = (e) => {
    this.setState({
      paymentEmail: e.target.value,
    });
  };

  onPaymentNotesChange = (e) => {
    this.setState({
      paymentNotes: e.target.value,
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
  onSelectOnline = (e) => {
    // console.log(">>>>>>>>>>>>>>>online", e.target.value);
    this.setState({
      trainingMode: e.target.value,
    });
  };
  onSelectOnsite = (e) => {
    // console.log(">>>>>>>>>>>>>>>onsite", e.target.value);
    this.setState({
      trainingMode: e.target.value,
    });
  };
  // ...............document....................

  onProfileImage = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      // console.log(res.data.data);
      this.setState({
        imagePath: res.data.data.url,
        adminPhoto: res.data.data.path + res.data.data.filename,
      });
      this.onNext();
    });
  };
  // .....................................
  isSameAddress = () => {
    // this.setState({
    //   isSameAddress: !this.state.isSameAddress,
    // });

    if (this.state.billingIsSameAddress === false) {
      this.setState({
        billingAddress: "",
        billingLocation: this.state.primaryLocation,
        // billingLocationData: this.state.locationData,
        billingCountryData: this.state.primaryCountryData,
        billingStateData: this.state.primaryStateData,
        billingCity: this.state.primaryCity,
        billingZip: this.state.primaryZip,
        billingIsSameAddress: !this.state.billingIsSameAddress,
      });
    } else {
      this.setState({
        billingAddress: "",
        billingLocation: "",
        billingLocationData: {},
        billingCountryData: {},
        billingStateData: {},
        billingCity: "",
        billingZip: "",
        billingIsSameAddress: !this.state.billingIsSameAddress,
      });
    }
  };

  onUpdate = async () => {
    // let mobileNo = this.state.phoneNumber.substring(3, 14).replace(/\s/g, "");
    let mobileNo = this.state.phoneNumber.substring(3, 15);
    let data = {
      fName: this.state.fname,
      lName: this.state.lname,
      altEmail: this.state.alternateEmail,
      altPhone: this.state.alternatePhoneNumber,
      whatsapp: this.state.whatsappNumber,
      genderTypeId: this.state.gender,
      dob: SetDOBFormat(this.state.dob),
      sourceTypeId: this.state.source,
      experience: this.state.workExperience.toString(),
      additionalSource: this.state.sourceName,
      bio: this.state.bio,
      timezoneId: this.state.timezone,
      countryId: this.state.country,
      photo: this.state.adminPhoto,
      email: this.state.email,
      countrycode: this.state.countryCode,
      phone: mobileNo,
      rating: this.state.vendorRating.toString(),
      vendorLocation: this.state.vendorProfileLocation,
      vendorid: this.state.vendorId.toString(),
    };
    // consoleLog("Modify vendor account info::", data);
    let res = await ApiCall("modifyvendoraccount", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.UPDATE.PROFILE_SUCCESS, {
        hideProgressBar: true,
      });
    } else {
      toast.error("Error Occured !!!");
    }
  };

  onNext = async () => {
    let mobileNo = this.state.phoneNumber.substring(3, 15).replace(/\s/g, "");
    let altMobile = this.state.alternatePhoneNumber
      .substring(3, 15)
      .replace(/\s/g, "");
    let whatsappNo = this.state.whatsappNumber
      .substring(3, 15)
      .replace(/\s/g, "");
    // ......................................................

    let errorCount = 0;
    let validateFName = inputEmptyValidate(this.state.fname);
    let validateFNameLength = departmentValidator(this.state.fname);
    let validateLName = inputEmptyValidate(this.state.lname);
    let validateLNameLength = departmentValidator(this.state.lname);
    let validatePhone = inputEmptyValidate(mobileNo);
    let validateWorkExp = inputEmptyValidate(this.state.workData);
    let validateGender = inputEmptyValidate(this.state.genderData);
    let validateDob = inputEmptyValidate(this.state.dob);
    let validateCountry = inputEmptyValidate(this.state.countryData);
    let validateTimeZone = inputEmptyValidate(this.state.timeZoneData);
    if (validateFName === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_FNAME, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateFNameLength === false) {
      toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateLName === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_LNAME, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateLNameLength === false) {
      toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (this.state.alternateEmail.length > 50) {
      toast.error(AlertMessage.MESSAGE.EMAIL.MAX_EMAIL_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validatePhone === false) {
      toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateGender === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_GENDER, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateDob === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_DOB, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateWorkExp === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_EXPERIENCE, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateCountry === false) {
      toast.error(AlertMessage.MESSAGE.COUNTRY.EMPTY_COUNTRY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateTimeZone === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_TIME_ZONE, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (this.state.vendorProfileLocation.length < 1) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_LOCATION, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    // .................................................
    if (errorCount === 0) {
      let data = {
        fName: this.state.fname,
        lName: this.state.lname,
        altEmail: this.state.alternateEmail,
        altPhone: altMobile,
        whatsapp: whatsappNo,
        genderTypeId: this.state.genderData.value,
        dob: SetDatabaseDateFormat(this.state.dob),
        sourceTypeId: this.state.sourceData.value,
        experience: this.state.workExperience,
        additionalSource: this.state.sourceName,
        bio: this.state.bio,
        timezoneId: this.state.timeZoneData.value,
        countryId: this.state.countryData.value,
        photo: this.state.adminPhoto,
        email: this.state.email,
        countrycode: this.state.countryCode,
        phone: mobileNo,
        ratings: this.state.vendorRating.toString(),
        photo: this.state.adminPhoto,
        vendorid: this.state.vendorId.toString(),
        vendorLocation: this.state.vendorProfileLocation,

      };
      // consoleLog("Vensor Account info data", data);
      let res = await ApiCall("modifyvendoraccount", data);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.UPDATE.PROFILE_SUCCESS, {
          hideProgressBar: true,
        });
        // return history.push("/adminVendorList");
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
        } else {
          toast.error("error Occured");
        }
      }
    }
  };

  onCancel = () => {
    return history.push("/adminVendorList");
  };


  onServiceInfoUpdate = async () => {
    let errorCount = 0;
    let validatePrimaryLanguage = inputEmptyValidate(
      this.state.primaryLanguageData.value
    );
    let validatePrimaryLanguageSkill = inputEmptyValidate(
      this.state.primaryLanguageSkillData
    );
    let validateProficient = inputEmptyValidate(this.state.isSelected);
    let validateOtherLanguage = inputEmptyValidate(
      this.state.otherLanguageData
    );
    let validateOtherLanguageSkill = inputEmptyValidate(
      this.state.otherLanguageSkillData
    );
    let validateServiceOffered = inputEmptyValidate(this.state.serviceId);
    let validateSubType = inputEmptyValidate(this.state.subType);
    let validateTraining = inputEmptyValidate(this.state.trainingServiceData);
    let validateTrainingMode = inputEmptyValidate(this.state.trainingMode);

    // if (validatePrimaryLanguage === false) {
    //   toast.error(
    //     AlertMessage.MESSAGE.VENDOR.EMPTY_SERVICEINFO_PRIMARY_LANGUAGE,
    //     {
    //       hideProgressBar: true,
    //     }
    //   );
    //   errorCount++;
    // } else if (validatePrimaryLanguageSkill === false) {
    //   toast.error(
    //     AlertMessage.MESSAGE.VENDOR.EMPTY_SERVICEINFO_PRIMARY_LANGUAGE_SKILL,
    //     {
    //       hideProgressBar: true,
    //     }
    //   );
    //   errorCount++;
    // } else if (this.state.isSelected === null) {
    //   toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_SERVICEINFO_PROFICIENT, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // } else if (this.state.isSelected === true) {
    //   if (validateOtherLanguage === false) {
    //     toast.error(
    //       AlertMessage.MESSAGE.VENDOR.EMPTY_SERVICEINFO_OTHER_LANGUAGE,
    //       {
    //         hideProgressBar: true,
    //       }
    //     );
    //     errorCount++;
    //   } else if (validateOtherLanguageSkill === false) {
    //     toast.error(
    //       AlertMessage.MESSAGE.VENDOR.EMPTY_SERVICEINFO_OTHER_LANGUAGE_SKILL,
    //       {
    //         hideProgressBar: true,
    //       }
    //     );
    //     errorCount++;
    //   } else if (validateSubType === false) {
    //     toast.error(
    //       AlertMessage.MESSAGE.VENDOR.EMPTY_SERVICEINFO_SERVICE_OFFERED,
    //       {
    //         hideProgressBar: true,
    //       }
    //     );
    //     errorCount++;
    //   }
    // } else if (validateSubType === false) {
    //   toast.error(
    //     AlertMessage.MESSAGE.VENDOR.EMPTY_SERVICEINFO_SERVICE_OFFERED,
    //     {
    //       hideProgressBar: true,
    //     }
    //   );
    //   errorCount++;
    // } else if (this.state.roleData.value === 3) {
    //   if (validateTraining === false) {
    //     toast.error(
    //       AlertMessage.MESSAGE.VENDOR.EMPTY_SERVICEINFO_TRAINING_SERVICE,
    //       {
    //         hideProgressBar: true,
    //       }
    //     );
    //     errorCount++;
    //   } else if (validateTrainingMode === false) {
    //     toast.error(
    //       AlertMessage.MESSAGE.VENDOR.EMPTY_SERVICEINFO_TRAINING_MODE,
    //       {
    //         hideProgressBar: true,
    //       }
    //     );
    //     errorCount++;
    //   }
    // }
    if (errorCount === 0) {
      let objData = {
        role: this.state.role,
        primaryLanguage: this.state.primaryLanguageData.value,
        primaryLanguageSkill: this.state.primaryLanguageSkillData,
        primaryLanguageRating: this.state.primaryLanguageRating,
        oherLanguageSet: this.state.otherLanguageSet,
        services: this.state.serviceId,
        subtypecheck: this.state.subType,
        translatorLanguageSet: this.state.translatorLanguageSet
      };

      // console.log("Service Info submit data>>>", objData);

      var lang = [];
      var langobj = {
        "source": objData.primaryLanguage,
        "target": objData.primaryLanguage,
        "isPrimary": "1",
        "speak": "0",
        "read": "0",
        "write": "0",
        "rating": objData.primaryLanguageRating
      };
      for (let i = 0; i < objData.primaryLanguageSkill.length; i++) {
        if (objData.primaryLanguageSkill[i].label == "Read") {
          langobj.read = "1";
        } else if (objData.primaryLanguageSkill[i].label == "Write") {
          langobj.write = "1";
        } else if (objData.primaryLanguageSkill[i].label == "Speak") {
          langobj.speak = "1";
        }
      }
      lang.push(langobj);
      if (objData.oherLanguageSet != undefined) {
        for (let j = 0; j < objData.oherLanguageSet.length; j++) {
          var langInfo = objData.oherLanguageSet[j];
          var langobj = {
            "source": langInfo.id,
            "target": langInfo.id,
            "isPrimary": "0",
            "speak": "0",
            "read": "0",
            "write": "0",
            "rating": langInfo.rating
          };
          for (let i = 0; i < langInfo.skill.length; i++) {
            if (langInfo.skill[i].label == "Read") {
              langobj.read = "1";
            } else if (langInfo.skill[i].label == "Write") {
              langobj.write = "1";
            } else if (langInfo.skill[i].label == "Speak") {
              langobj.speak = "1";
            }
          }
          lang.push(langobj);
        }
      }

      // console.log("Service Info submit data Array>>>", lang);
      let brr = [];
      // consoleLog("this.state.serviceID:", this.state.serviceId);
      this.state.serviceId.map((data) => {
        let aa = [];
        if (data.subData !== undefined) {
          data.subData.map((sub) => {
            if (sub.isChecked) {
              aa.push({
                id: sub.id,
                name: sub.name
              })
            }
          })
        }
        brr.push({
          id: data.value,
          subItemName: data.label,
          subData: aa
        })
      })

      let finalData = {
        vendorid: this.state.showId,
        serviceId: this.state.role,
        languages: lang,
        service: {
          id: this.state.role,
          name: this.state.roleData.label,
          subItem: brr
        }
      }

      console.log("Service Info submit data Array>>>", finalData);


      let modifyReq = await ApiCall("modifyVendorService", finalData);
      if (
        modifyReq.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        modifyReq.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success("Service updated successfully");
      }


    }
  };

  onAddressInfoUpdate = async () => {
    let errorCount = 0;
    let validateAddress = inputEmptyValidate(this.state.locationData);
    let validateCountry = inputEmptyValidate(this.state.countryData);
    let validateState = inputEmptyValidate(this.state.primaryStateData);
    let validateCity = inputEmptyValidate(this.state.primaryCity);
    let validateZip = inputEmptyValidate(this.state.primaryZip);
    let validateBillingAddress = inputEmptyValidate(
      this.state.billingLocationData
    );
    let validateBillingCountry = inputEmptyValidate(
      this.state.billingCountryData
    );
    let validateBillingState = inputEmptyValidate(this.state.billingStateData);
    let validateBillingCity = inputEmptyValidate(this.state.billingCity);
    let validateBillingZip = inputEmptyValidate(this.state.billingZip);

    if (validateAddress === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ADDRESSINFO_LOCATION, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateCountry === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ADDRESSINFO_COUNTRY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateState === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ADDRESSINFO_STATE, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateCity === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ADDRESSINFO_CITY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateZip === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ADDRESSINFO_ZIP, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateBillingAddress === false) {
      toast.error(
        AlertMessage.MESSAGE.VENDOR.EMPTY_BILLING_ADDRESSINFO_LOCATION,
        {
          hideProgressBar: true,
        }
      );
      errorCount++;
    } else if (validateBillingCountry === false) {
      toast.error(
        AlertMessage.MESSAGE.VENDOR.EMPTY_BILLING_ADDRESSINFO_COUNTRY,
        {
          hideProgressBar: true,
        }
      );
      errorCount++;
    } else if (validateBillingState === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_BILLING_ADDRESSINFO_STATE, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateBillingCity === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_BILLING_ADDRESSINFO_CITY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateBillingZip === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_BILLING_ADDRESSINFO_ZIP, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    // let validateState = inputEmptyValidate(this.state.billingState);
    // if (validateState === false) {
    //   toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ADDRESSINFO_STAT, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // }
    // if (validateBillingAddress === false) {
    //   toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ADDRESSINFO_LOCATION, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // } else if (validateBillingCountry === false) {
    //   toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ADDRESSINFO_COUNTRY, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // } else if (validateBillingState === false) {
    //   toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ADDRESSINFO_STATE, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // } else if (validateBillingCity === false) {
    //   toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ADDRESSINFO_CITY, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // } else if (validateBillingZip === false) {
    //   toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ADDRESSINFO_ZIP, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // }

    if (errorCount === 0) {
      let objData = {
        vendorid: this.state.vendorId,
        address: this.state.primaryLocation,
        countryid: this.state.primaryCountryData.value,
        stateid: this.state.primaryStateData.value,
        city: this.state.primaryCity,
        zipcode: this.state.primaryZip,
        sameaddress: this.state.billingIsSameAddress ? "0" : "1",
        billingaddress: this.state.billingLocation,
        billingcountryid: this.state.billingCountryData.value,
        billingstateid: this.state.billingStateData.value,
        billingcity: this.state.billingCity,
        billingzipcode: this.state.billingZip,
      };

      console.log(">>>>>>", objData);

      let res = await ApiCall("updateVendorAddress", objData);
      // console.log("address response::", res);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.UPDATE.PROFILE_ADDRESS_SUCCESS, {
          hideProgressBar: true,
        });
      }
    }
  };
  onFinancialInfoUpdate = async () => {
    let errorCount = 0;
    let validateBankAccountNo = inputEmptyValidate(this.state.bankAccountNo);
    let validateBankRoutingNo = inputEmptyValidate(this.state.bankRoutingNo);
    let validateWesternAccountNo = inputEmptyValidate(
      this.state.westernUnionAccountNo
    );
    let validateEmail = emailValidator(this.state.paymentEmail);

    // }
    if (this.state.paymentData.value === 18) {
      if (validateBankAccountNo === false) {
        toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_BANK_ACCOUNT_NUMBER, {
          hideProgressBar: true,
        });
        errorCount++;
      } else if (validateBankRoutingNo === false) {
        toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_ROUTING_NUMBER, {
          hideProgressBar: true,
        });
        errorCount++;
      }
    }
    if (this.state.paymentData.value === 21) {
      if (validateWesternAccountNo === false) {
        toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_WESTERN_ACCOUNT_NUMBER, {
          hideProgressBar: true,
        });
        errorCount++;
      }
    }
    if (
      this.state.paymentData.value === 19 ||
      this.state.paymentData.value === 20 ||
      this.state.paymentData.value === 21
    ) {
      if (validateEmail === false) {
        toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_EMPTY, {
          hideProgressBar: true,
        });
        errorCount++;
      } else if (validateEmail.status === false) {
        toast.error(validateEmail.message, {
          hideProgressBar: true,
        });
        errorCount++;
      }
    }
    // else if (this.state.paymentData.value === 19) {
    //   if (validatePaypalEmail === false) {
    //     toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_PAYPAL_EMAIL, {
    //       hideProgressBar: true,
    //     });
    //     errorCount++;
    //   } else if (validatePayEmail.status === false) {
    //     toast.error(validatePayEmail.message, {
    //       hideProgressBar: true,
    //     });
    //     errorCount++;
    //   }
    // } else if (this.state.paymentData.value === 20) {
    //   if (validatePayoneerEmail === false) {
    //     toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_PAYONEER_EMAIL, {
    //       hideProgressBar: true,
    //     });
    //     errorCount++;
    //   } else if (validatePayonEmail.status === false) {
    //     toast.error(validatePayonEmail.message, {
    //       hideProgressBar: true,
    //     });
    //     errorCount++;
    //   }
    // } else if (this.state.paymentData.value === 21) {
    //    if (validateWesternAccountNo === false) {
    //     toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_WESTERN_ACCOUNT_NUMBER, {
    //       hideProgressBar: true,
    //     });
    //     errorCount++;
    //   }
    // }
    if (errorCount === 0) {
      let paymentObj = {};
      if (this.state.paymentData.value === 18) {
        paymentObj["accountNumber"] = this.state.bankAccountNo;
        paymentObj["routingNumber"] = this.state.bankRoutingNo;
      }
      if (
        this.state.paymentData.value === 19 ||
        this.state.paymentData.value === 20 ||
        this.state.paymentData.value === 21
      ) {
        paymentObj["email"] = this.state.email;
      }
      if (this.state.paymentData.value === 21) {
        paymentObj["accountNumber"] = this.state.westernUnionAccountNo;
      }

      let data = {
        paymentMethodTypeId: this.state.paymentData.value,
        paymentDetails: paymentObj,
        notes: this.state.paymentNotes,
        vendorid: this.state.vendorId,
      };

      let responseData = await ApiCall("updateVendorPayment", data);
      // console.log(">>>>>>>", responseData);

      if (
        responseData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        responseData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.UPDATE.PROFILE_PAYMENT_SUCCESS, {
          hideProgressBar: true,
        });
      }
      // else {
      //   if (
      //     responseData.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
      //     responseData.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST
      //   ) {
      //     toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_EXIST, {
      //       hideProgressBar: true,
      //     });
      //   } else if (
      //     responseData.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
      //     responseData.respondcode === ErrorCode.ERROR.ERROR_CODE.PHONE_EXIST
      //   ) {
      //     toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EXIST, {
      //       hideProgressBar: true,
      //     });
      //   } else if (
      //     responseData.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
      //     responseData.respondcode ===
      //       ErrorCode.ERROR.ERROR_CODE.EMAIL_PHONE_EXIST
      //   ) {
      //     toast.error(AlertMessage.MESSAGE.EMAIL_MOBILE.DUBLICATE, {
      //       hideProgressBar: true,
      //     });
      //   }
      // }
    }
  };

  sourceLanguageChange = (value, i) => {
    let arr = this.state.translatorLanguageSet;
    arr[i].source = value.value;
    this.setState({
      translatorLanguageSet: arr
    })
  }

  targetLanguageChange = (value, i) => {
    let arr = this.state.translatorLanguageSet;
    arr[i].target = value.value;
    this.setState({
      translatorLanguageSet: arr
    })
  }

  translatorLanguageskillChange = (value, i) => {
    let arr = this.state.translatorLanguageSet;
    arr[i].skill = value;
    this.setState({
      translatorLanguageSet: arr
    })
  }

  translatorLanguageRatingChange = (value, i) => {
    let arr = this.state.translatorLanguageSet;
    arr[i].rating = value;
    this.setState({
      translatorLanguageSet: arr
    })
  }

  addLanguagePair = () => {
    let arr = this.state.translatorLanguageSet;
    arr.push({
      id: "",
      name: "",
      source: "",
      target: "",
      skill: [],
      rating: ""
    });
    this.setState({
      translatorLanguageSet: arr
    })
  }

  // ..........................address update function................................



  onVendorLocationInputChange = async (val) => {
    // console.log(")))))))))))))))", val);
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
        // consoleLog("data:::::", locationData);
        for (let i = 0; i < locationData.length; i++) {
          arrData.push({
            label: locationData[i].description,
            value: locationData[i].placeid,
          });
        }

        this.setState({
          vendorLocationArr: arrData,
          vendorLocationData: val,
        });
      }
    }
  };

  onVendorLocationChange = async (value) => {
    let obj = {
      placeid: value.value
    }
    // consoleLog("Location Dropdown value::", value)
    let locationData = await ApiCall("getcoordinatefromplaceid", obj);
    if (locationData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && locationData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
      let locationArr = Decoder.decode(locationData.data.payload);
      let locateAdd = [];
      locateAdd.push({
        lat: locationArr.data.coordinatedetails[0].lat,
        long: locationArr.data.coordinatedetails[0].lng,
        locationName: value.label,
        locationId: value.value
      })
      // consoleLog("Location details::", locateAdd)
      this.setState({
        vendorProfileLocation: locateAdd,
      })
    }
    this.setState({
      vendorLocationData: value,
    });
  };
  //................funct for menuBtn on click................
  menuBtnhandleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };
  render() {
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
    // const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
        <ToastContainer hideProgressBar theme="colored" />
        {/* <Header />
          <Sidebar /> */}
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>
        <div className="component-wrapper" hidden={this.state.isLoad}>
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            {" "}
            <Link to="/adminDashboard">Dashboard</Link> / <Link to="/adminVendorList">Vendors</Link> / Vendor Profile
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="vender-head _fl"> Vendor Profile </div>
            </div>
            {/* <div className="col-md-4">
              <VendorMenuPages value={this.state.showId}/>
            </div> */}
          </div>
          <div className="myaccount-section-wrap _fl">
            <div className="row">
              <div className="col-md-9">
                <div className="my-form-rw _fl">
                  <h3 className="open">My Account Informaiton </h3>
                  <div className="my-form-bx" style={{ display: "block" }}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span className="">First Name *</span>
                          <input
                            type="text"
                            value={this.state.fname}
                            onChange={this.firstNameChange}
                            name=""
                            placeholder=""
                            className="in-field2"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Last Name *</span>
                          <input
                            type="text"
                            value={this.state.lname}
                            onChange={this.lastNameChange}
                            name=""
                            placeholder=""
                            className="in-field2"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Email *</span>
                          <input
                            disabled
                            type="text"
                            value={this.state.email}
                            onChange={this.emailChange}
                            name=""
                            placeholder="Xxxx@xxx"
                            className="in-field2"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Alternate Email</span>
                          <input
                            type="text"
                            value={this.state.alternateEmail}
                            onChange={this.alternateEmailChange}
                            name=""
                            placeholder=""
                            className="in-field2"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Phone Number *</span>
                          <input
                            type="text"
                            value={this.state.phoneNumber}
                            onChange={this.phoneChange}
                            name=""
                            placeholder="+1-Xxxxxxx"
                            className="in-field2"
                          // disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Whatsapp Number</span>
                          <input
                            type="text"
                            value={this.state.whatsappNumber}
                            onChange={this.whatsappChange}
                            name=""
                            placeholder=""
                            className="in-field2"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Alternate Phone Number</span>
                          <input
                            type="text"
                            value={this.state.alternatePhoneNumber}
                            onChange={this.alternatePhoneChange}
                            name=""
                            placeholder=""
                            className="in-field2"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Gender *</span>
                          <div class="dropdwn">
                            {/* <select className="myDropdown frm4-select"></select> */}
                            <Select
                              styles={customStyles}
                              name="Select"
                              options={this.state.genderArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.genderData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onGenderChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span>Date of Birth *</span>
                          {/* <div className="form-input-fields">
                            <input
                              type="date"
                              id="from_datepicker"
                              className="textbox4"
                              // className="textbox4 d-icon"
                              placeholder="10/25/2021"
                              value={this.state.dob}
                              onChange={this.dobChange}
                            />
                          </div> */}

                          <div
                            className="input-group"
                            style={{
                              width: "100%",
                              borderRadius: "9px",
                              height: "43px",
                              border: "1px solid #ced4da",
                              boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                            }}
                          >
                            <div style={{ width: "80%", padding: "8px" }}>
                              <span style={{ fontSize: "16px", color: "black" }}>{this.state.dob}</span>
                            </div>
                            <div style={{ width: "20%" }}>
                              <a style={{ float: "right" }}>
                                <DatePicker
                                  dropdownMode="select"
                                  showMonthDropdown
                                  showYearDropdown
                                  adjustDateOnChange
                                  maxDate={
                                    new Date()
                                  }
                                  onChange={(date) =>
                                    this.dobChange(date)
                                  }
                                  customInput={<Schedule />}
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Work Experience</span>
                          <div class="dropdwn">
                            {/* <select className="myDropdown_work_experience frm4-select"></select> */}
                            <Select
                              styles={customStyles}
                              name="Select"
                              options={this.state.workArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.workData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onWorkExperienceChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span>How did you hear about us? *</span>
                          <div class="dropdwn">
                            {/* <select className="myDropdown_sourse frm4-select"></select> */}
                            <Select
                              styles={customStyles}
                              name="Select"
                              options={this.state.sourceArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.sourceData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onSourceChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        {this.state.isFriend ? (
                          <div className="form_rbx">
                            {" "}
                            <span className="">Friend Name</span>
                            <input
                              type="text"
                              value={this.state.sourceName}
                              onChange={this.sourseNameChange}
                              name=""
                              placeholder="Xxxxxxx"
                              className="in-field2"
                            />
                          </div>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span>Country of Origin *</span>
                          <div class="dropdwn">
                            {/* <select className="myDropdown_country frm4-select"></select> */}
                            <Select
                              styles={customStyles}
                              name="Select"
                              options={this.state.countryArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.countryData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onCountryChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Time Zone *</span>
                          <div class="dropdwn">
                            {/* <select className="myDropdown_timeZone frm4-select"></select> */}
                            <Select
                              styles={customStyles}
                              name="Select"
                              options={this.state.timeZoneArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.timeZoneData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onTimeChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span>Bio</span>
                          <textarea
                            rows="1"
                            placeholder=""
                            className="in-textarea msg min"
                            value={this.state.bio}
                            style={{
                              height: "52px",
                              color: "var(--grey)",
                              borderRadius: "10px",
                              boxShadow: "2px",
                              resize: "none",
                            }}
                            onChange={this.bioChange}
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-md-6">

                        <div className="form_rbx">
                          <span>
                            Vendor Location *
                          </span>
                          <div className="tr-3">
                            <Select
                              options={this.state.vendorLocationArr}
                              components={{
                                DropdownLocation,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.vendorLocationData}
                              placeholder="Select"
                              onChange={(value) =>
                                this.onVendorLocationChange(value)
                              }
                              onInputChange={(value) => {
                                this.onVendorLocationInputChange(value);
                              }}
                              styles={customStylesDropdown}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <button
                          type="submit"
                          className="delete_button"
                          onClick={() => this.onCancel()}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="sv_btn"
                          onClick={() => this.onNext()}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-form-rw _fl">
                  <h3>Service Info</h3>
                  <ServiceInfo vendorId={this.state.showId} />
                </div>

                {/* <div className="my-form-rw _fl">
                  <h3>Service Info </h3>
                  <div className="my-form-bx">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Role(s) *</span>
                          <div
                            class="dropdwn"
                            style={{ width: "60%", cursor: "pointer" }}
                          >
                            <Select
                              styles={customStyles}
                              name="Select"
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
                    {this.state.roleData.label === "Interpretation"
                      ? (
                        <React.Fragment>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form_rbx">
                                {" "}
                                <span className="">
                                  Primary (Native/Source) Language *
                                </span>
                                <Select
                                  styles={customStyles}
                                  name="Select"
                                  options={this.state.languageArr}
                                  components={{
                                    DropdownIndicator,
                                    IndicatorSeparator: () => null,
                                  }}
                                  value={this.state.primaryLanguageData}
                                  placeholder="Select"
                                  onChange={(value) => {
                                    this.onPrimaryLanguageChange(value);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_rbx">
                                {" "}
                                <span className="">
                                  Primary Language Proficiency Skills *
                                </span>
                                <div className="dropdwn">
                                  <Select
                                    styles={customStyles}
                                    name="select"
                                    placeholder="Select"
                                    components={{
                                      DropdownIndicator,
                                      IndicatorSeparator: () => null,
                                    }}
                                    value={this.state.primaryLanguageSkillData}
                                    options={this.state.primaryLanguageSkillArr}
                                    onChange={this.onPrimaryLanguageSkillChange}
                                    isMulti
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_rbx">
                                {" "}
                                <span className="">
                                  Primary Language Fluency Ratings *
                                </span>
                                <div className="rate">
                                  <ReactStars
                                    count={5}
                                    value={this.state.primaryLanguageRating}
                                    onChange={this.PrimaryLanguageRatingChanged}
                                    size={30}
                                    activeColor="#009fe0"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
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
                                      name="radio"
                                      id="otherLan_yes"
                                      // defaultChecked={this.state.isSelected}
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
                                      id="otherLan_no"
                                      // defaultChecked={this.state.isSelected}
                                      onClick={(e) => this.onSelectNo(e)}
                                    />
                                    <span className="checkmark3"></span> No
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          {this.state.isSelected ? (
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
                                      <Select
                                        styles={customStyles}
                                        name="select"
                                        placeholder="Select"
                                        components={{
                                          DropdownIndicator,
                                          IndicatorSeparator: () => null,
                                        }}
                                        value={this.state.otherLanguageData}
                                        options={this.state.languageArr}
                                        onChange={this.onOtherLanguageChange}
                                        isMulti
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
                                          <div className="dropdwn">
                                            <Select
                                              styles={customStyles}
                                              name="select"
                                              placeholder="Select"
                                              components={{
                                                DropdownIndicator,
                                                IndicatorSeparator: () => null,
                                              }}
                                              value={oth.skill}
                                              options={
                                                this.state
                                                  .primaryLanguageSkillArr
                                              }
                                              onChange={(value) => {
                                                this.onOtherLanguageSkillChange(
                                                  value,
                                                  l
                                                );
                                              }}
                                              isMulti
                                            />
                                          </div>
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
                                                this.otherLanguageRatingChange(
                                                  value,
                                                  l
                                                );
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

                          <div className="row">
                            <div className="col-md-8">
                              <div className="form_rbx">
                                {" "}
                                <span className="">Service Offered *</span>
                                <div className="dropdwn">
                                  <MultiSelectBox
                                    optionData={this.state.serviceArrData}
                                    value={this.state.serviceId}
                                    onSelectChange={(value) => this.onServiceSelect(value)}
                                  />
                                </div>
                              </div>
                            </div>
                            {this.state.roleData.label === "Interpretation" ?
                              <div className="col-md-4">
                                <div className="form_rbx">
                                  <div
                                    class="multiple-option-check"
                                    style={{
                                      paddingLeft: "60px",
                                      paddingTop: "30px",
                                    }}
                                  >
                                    {this.state.serviceId.map((item, key) => (
                                      <React.Fragment key={key}>
                                        <div class="check-field">
                                          {item.label}
                                        </div>
                                        {item.subData.map((item1, key1) => (
                                          <div class="check-field">
                                            <label class="checkbox_btn">
                                              <input
                                                type="checkbox"
                                                name={key1}
                                                checked={item1.isChecked}
                                                value={item1.id}
                                                onChange={(e) => this.subTypeChange(e, item.value, item.label, item1.name)}
                                              />
                                              <span class="checkmark3"></span>{" "}
                                              {item1.name}
                                            </label>
                                          </div>
                                        ))}
                                      </React.Fragment>
                                    ))}
                                  </div>
                                </div>
                              </div> :
                              <React.Fragment></React.Fragment>}
                          </div>
                        </React.Fragment>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}

                    {this.state.roleData.label === "Translation" ? <React.Fragment>
                      {this.state.translatorLanguageSet.length > 0 ?
                        this.state.translatorLanguageSet.map((data, i) =>
                          <div className="row" key={i}>
                            <div className="col-md-3">
                              <div className="form_rbx">
                                <span>
                                  Source Language *
                                </span>
                                <Select
                                  styles={customStyles}
                                  name="Source_language"
                                  options={this.state.languageArr}
                                  value={data.selectedTranslationSourceLanguage}
                                  components={{
                                    DropdownIndicator,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  onChange={(value) => { this.sourceLanguageChange(value, i) }}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form_rbx">
                                <span>
                                  Target Language *
                                </span>
                                <Select
                                  styles={customStyles}
                                  name="target_language"
                                  options={this.state.languageArr}
                                  value={data.selectedTranslationTargetLanguage}
                                  components={{
                                    DropdownIndicator,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  onChange={(value) => { this.targetLanguageChange(value, i) }}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form_rbx">
                                {" "}
                                <span className="">
                                  Proficiency Skills *
                                </span>
                                <div className="dropdwn">
                                  <Select
                                    styles={customStyles}
                                    name="select"
                                    placeholder="Select"
                                    components={{
                                      DropdownIndicator,
                                      IndicatorSeparator: () => null,
                                    }}
                                    value={data.skill}
                                    options={this.state.primaryLanguageSkillArr}
                                    onChange={(value) => { this.translatorLanguageskillChange(value, i) }}
                                    isMulti
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form_rbx">
                                {" "}
                                <span className="">
                                  Ratings *
                                </span>
                                <div className="rate">
                                  <ReactStars
                                    count={5}
                                    onChange={(value) => { this.translatorLanguageRatingChange(value, i) }}
                                    size={25}
                                    value={data.rating}
                                    activeColor="#009fe0"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>) : <React.Fragment></React.Fragment>}

                      <div className="row" style={{ paddingBottom: "3%" }}>
                        <div className="md-btn">
                          <a onClick={() => { this.addLanguagePair() }} className="approved" style={{ textDecoration: "none", color: "#fff" }}>ADD</a>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-8">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Service Offered *</span>
                            <div className="dropdwn">
                              <MultiSelectBox
                                optionData={this.state.serviceArrData}
                                value={this.state.selectedTranslationServices}
                                onSelectChange={(value) => this.onServiceSelect(value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment> : <React.Fragment></React.Fragment>}

                    {this.state.roleData.label === "Training" ? (
                      <div>
                        <div className="row">
                          <div className="col-md-8">
                            <div className="form_rbx">
                              {" "}
                              <span className="">Service(s) Offered *</span>
                              <span className="training-title">Training</span>
                              <div className="dropdwn">
                                <Select
                                  styles={customStyles}
                                  options={this.state.restrainingServicesArr}
                                  value={this.state.trainingServiceData}
                                  placeholder="Select"
                                  components={{
                                    DropdownIndicator,
                                    IndicatorSeparator: () => null,
                                  }}
                                  onChange={this.onTraningServiceChange}
                                  isMulti
                                  isCheckBox
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="form_rbx">
                              {" "}
                              <span className="">Training Mode *</span>
                              {this.state.allTrainingMode.map((md) =>
                                md.id === 30 ?
                                  <div className="check-field">
                                    <label className="checkbox_btn">
                                      <input
                                        type="radio"
                                        name="radio"
                                        value="30"
                                        defaultChecked={this.state.selectedMode === "30" ? true : false}
                                        onClick={(e) => this.onSelectOnline(e)}
                                      />
                                      <span className="checkmark3"></span> Online
                                    </label>
                                  </div> :
                                  <div className="check-field">
                                    <label className="checkbox_btn">
                                      <input
                                        type="radio"
                                        name="radio"
                                        value="31"
                                        defaultChecked={this.state.selectedMode === "31" ? true : false}
                                        onClick={(e) => this.onSelectOnline(e)}
                                      />
                                      <span className="checkmark3"></span> Onsite
                                    </label>
                                  </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-8">
                            <div className="form_rbx">
                              {" "}
                              <span className="">Notes *</span>
                              <textarea
                                placeholder="......."
                                className="in-textarea min"
                                value={this.state.trainerNotes}
                                onChange={this.onTrainerNotesChange}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}

                    <div className="row">
                      <div className="col-md-12 text-center">
                        <button
                          type="submit"
                          className="delete_button"
                          onClick={() => this.onCancel()}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="sv_btn"
                          onClick={() => this.onServiceInfoUpdate()}
                        >
                          Update
                        </button>
                      </div>
                    </div>

                  </div>
                </div> */}
                <div className="my-form-rw _fl">
                  <h3>Address Info</h3>
                  <div className="my-form-bx">
                    <h4 className="h4_heading">Primary address</h4>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx adr">
                          {" "}
                          <span className="">Address *</span>
                          <input
                            type="text"
                            value={this.state.primaryLocation}
                            name=""
                            placeholder=""
                            className="in-field2"
                            onChange={(e) => this.onPrimaryLocationchange(e)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span>Country *</span>
                          <div class="dropdwn">
                            <Select
                              styles={customStyles}
                              name="Select"
                              options={this.state.countryArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.primaryCountryData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onPrimaryCountryChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form_rbx">
                          {" "}
                          <span className="">State *</span>
                          <div
                            class="dropdwn"
                            style={{ width: "100%", cursor: "pointer" }}
                          >
                            <Select
                              styles={customStyles}
                              name="Select"
                              options={this.state.stateArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.primaryStateData}
                              placeholder="Select"
                              onChange={(value) => {
                                this.onPrimaryStateChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form_rbx">
                          {" "}
                          <span className="">City *</span>
                          <input
                            type="text"
                            value={this.state.primaryCity}
                            name=""
                            placeholder=""
                            className="in-field2"
                            onChange={this.onCityChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Zip Code *</span>
                          <input
                            type="text"
                            value={this.state.primaryZip}
                            name=""
                            placeholder=""
                            className="in-field2"
                            onChange={(e) => this.onZipChange(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="billing-info">
                      <h4 className="text-billing">Billing Info</h4>
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
                    <div className="billing-address-info">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form_rbx adr">
                            {" "}
                            <span className="">Address *</span>
                            {/* <Select
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
                              /> */}
                            <input
                              type="text"
                              value={this.state.billingLocation}
                              name=""
                              placeholder=""
                              className="in-field2"
                              onChange={(e) =>
                                this.onBillingLocationchange(e)
                              }
                            />
                            {/* <div className="ak">
                                <img src="images/location.png" />
                              </div> */}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form_rbx">
                            {" "}
                            <span>Country *</span>
                            <div class="dropdwn">
                              <Select
                                styles={customStyles}
                                name="Select"
                                options={this.state.countryArr}
                                components={{
                                  DropdownIndicator,
                                  IndicatorSeparator: () => null,
                                }}
                                value={this.state.billingCountryData}
                                placeholder="Select"
                                onChange={(value) => {
                                  this.onBillingCountryChange(value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-4">
                          <div className="form_rbx">
                            {" "}
                            <span className="">State *</span>
                            <div
                              class="dropdwn"
                              style={{ width: "100%", cursor: "pointer" }}
                            >
                              <Select
                                styles={customStyles}
                                name="Select"
                                options={this.state.stateArr}
                                components={{
                                  DropdownIndicator,
                                  IndicatorSeparator: () => null,
                                }}
                                value={this.state.billingStateData}
                                placeholder="Select"
                                onChange={(value) => {
                                  this.onBillingStateChange(value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form_rbx">
                            {" "}
                            <span className="">City *</span>
                            <input
                              type="text"
                              value={this.state.billingCity}
                              name=""
                              placeholder=""
                              className="in-field2"
                              onChange={(e) => this.onBillingCityChange(e)}
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Zip Code *</span>
                            <input
                              type="text"
                              value={this.state.billingZip}
                              name=""
                              placeholder=""
                              className="in-field2"
                              onChange={(e) => this.onBillingZipChange(e)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <button
                          type="submit"
                          className="delete_button"
                          onClick={() => this.onCancel()}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="sv_btn"
                          onClick={() => this.onAddressInfoUpdate()}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-form-rw _fl">
                  <h3>Financial info</h3>
                  <div className="my-form-bx">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Payment Method *</span>
                          <Select
                            styles={customStyles}
                            name="Select"
                            options={this.state.paymentArr}
                            components={{
                              DropdownIndicator,
                              IndicatorSeparator: () => null,
                            }}
                            value={this.state.paymentData}
                            placeholder="Select"
                            onChange={(value) => {
                              this.onPaymentChange(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        {this.state.paymentData.value === 18 ? (
                          <React.Fragment>
                            <div className="form_rbx">
                              {" "}
                              <span className="">Account Number *</span>
                              <input
                                type="text"
                                value={this.state.bankAccountNo}
                                name=""
                                placeholder=""
                                className="in-field2"
                                onChange={this.onAccountNumberChange}
                              />
                            </div>
                          </React.Fragment>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}

                        {this.state.paymentData.value === 19 ||
                          this.state.paymentData.value === 20 ||
                          this.state.paymentData.value === 21 ? (
                          <React.Fragment>
                            <div className="form_rbx">
                              {" "}
                              <span className="">Email *</span>
                              <input
                                type="text"
                                value={this.state.paymentEmail}
                                name=""
                                placeholder=""
                                className="in-field2"
                                onChange={this.onPaymentEmailChange}
                              />
                            </div>
                          </React.Fragment>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}
                      </div>
                      <div className="col-md-6">
                        {this.state.paymentData.value === 18 ? (
                          <React.Fragment>
                            <div className="form_rbx">
                              {" "}
                              <span className="">Routing Number *</span>
                              <input
                                type="text"
                                value={this.state.bankRoutingNo}
                                name=""
                                placeholder=""
                                className="in-field2"
                                onChange={this.onRoutingNumberChange}
                              />
                            </div>
                          </React.Fragment>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}
                        {this.state.paymentData.value === 21 ? (
                          <React.Fragment>
                            <div className="form_rbx">
                              {" "}
                              <span className="">Western Union Account *</span>
                              <input
                                type="text"
                                value={this.state.westernUnionAccountNo}
                                name=""
                                placeholder=""
                                className="in-field2"
                                onChange={this.westernAccountNumberChange}
                              />
                            </div>
                          </React.Fragment>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-8">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Notes </span>
                          <textarea
                            placeholder=""
                            className="in-textarea min"
                            value={this.state.paymentNotes}
                            onChange={this.onPaymentNotesChange}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <button
                          type="submit"
                          className="delete_button"
                          onClick={() => this.onCancel()}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="sv_btn"
                          onClick={() => this.onFinancialInfoUpdate()}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 text-center">
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
                  {/* <div className="c-logo">
                      <img src="images/c-logo.png" />
                      <button className="pht"></button>
                    </div> */}
                  {/* <div className="doc_upload ad">
                      <label
                        htmlFor="file-upload"
                        data-toggle="tooltip"
                        data-placement="top"
                        title={this.state.adminPhoto}
                      >
                        {this.state.hidden ? (
                          <React.Fragment>
                            <div className="c-logo">
                              <img
                                style={{ cursor: "pointer", height: "90px" }}
                                src={ImageName.IMAGE_NAME.UPLOADED_FILE}
                              />
                            </div>
                            <div style={{ marginTop: "20px" }}></div>
                          </React.Fragment>
                        ) : (
                          <div className="c-logo">
                            <img
                              style={{ cursor: "pointer" }}
                              // src={ImageName.IMAGE_NAME.PLUS_FILE}
                              src="images/c-logo.png"
                            />
                          </div>
                        )}
                      </label>

                      <input
                        id="file-upload"
                        type="file"
                        onChange={this.onProfileImage}
                      />
                    </div> */}
                  {/* <h4 className="h4_text">VENDOR ID:{this.state.vendorId}</h4> */}
                  <div className="rate rtg">
                    <ReactStars
                      count={5}
                      onChange={this.ratingChangedProfile}
                      size={35}
                      // color="#fff"
                      color2="#009fe0"
                      value={this.state.vendorRating}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="_fl">
            <div className="row m20">
              <div className="col-md-12 text-center">
                <button type="submit" className="delete_button">
                  Delete
                </button>
                <button type="submit" className="sv_btn">
                  Update
                </button>
              </div>
            </div>
          </div> */}
        </div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}

class Schedule extends React.Component {
  render() {
    const { onClick } = this.props;
    return (
      <img
        style={{
          width: "35px",
          height: "37px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        src={ImageName.IMAGE_NAME.CALENDER4}
        onClick={onClick}
      />
    );
  }
}
