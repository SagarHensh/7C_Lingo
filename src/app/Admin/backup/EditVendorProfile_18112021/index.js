import React from "react";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import "./vendorEdit.css";
import "./bootSelect.css";
import $, { data } from "jquery";
import ReactStars from "react-rating-stars-component";
import Multiselect from "multiselect-react-dropdown";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import {
  getCountryList,
  getLookUpDataFromAPI,
  getVendorServiceList,
  phoneNumberCheck,
  SetDOBFormat,
} from "../../../../services/common-function";
import {
  departmentValidator,
  inputEmptyValidate,
  mobileNumberValidator,
  numberValidator,
} from "../../../../validators";
import { ApiCall } from "../../../../services/middleware";
import {
  IMAGE_STORE_PATH,
  IMAGE_URL,
  VENDOR_SERVICE_OFFERED,
} from "../../../../services/config/api_url";
import axios from "axios";
import { ErrorCode } from "../../../../services/constant";
import { Decoder } from "../../../../services/auth";
import { TextField } from "@mui/material";
import { AlertMessage, ImageName } from "../../../../enums";
import { toast } from "react-toastify";
import ReactLoader from "../../../Loader";

const primaryLanguageArr = [
  {
    text: "English",
    value: 1,
  },
  {
    text: "Hindi",
    value: 2,
  },
  {
    text: "Bengali",
    value: 3,
  },
  {
    text: "Spanish",
    value: 4,
  },
];
const otherLanguageArr = [
  {
    text: "English",
    value: 1,
  },
  {
    text: "Hindi",
    value: 2,
  },
  {
    text: "Bengali",
    value: 3,
  },
  {
    text: "Spanish",
    value: 4,
  },
];

const roleArr = [
  {
    text: "Interpreter",
    value: 1,
  },
  {
    text: "Translator",
    value: 2,
  },
  {
    text: "Trainer",
    value: 3,
  },
];

const languageSkillArr = [
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
const paymentArr = [
  {
    text: "PayPal",
    value: 1,
  },
  {
    text: "Payoneer",
    value: 2,
  },
  {
    text: "Western Union",
    value: 3,
  },
];
// const workExpirienceArr = [
//   {
//     text: "1",
//     value: 1,
//   },
//   {
//     text: "2",
//     value: 2,
//   },
//   {
//     text: "3",
//     value: 3,
//   },
//   {
//     text: "4",
//     value: 4,
//   },
//   {
//     text: "5",
//     value: 5,
//   },
//   {
//     text: "6",
//     value: 6,
//   },
//   {
//     text: "7",
//     value: 7,
//   },
//   {
//     text: "8",
//     value: 8,
//   },
//   {
//     text: "9",
//     value: 9,
//   },
//   {
//     text: "10",
//     value: 10,
//   },
//   {
//     text: "10+",
//     value: 11,
//   },
// ];
export default class EditVendorProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      alternateEmail: "",
      phoneNumber: "",
      alternatePhoneNumber: "",
      whatsappNumber: "",
      allGender: [],
      gender: "",
      dob: "",
      workExperience: "",
      source: "",
      allSourses: [],
      sourceName: "",
      country: "",
      timezone: "",
      bio: "",
      isFriend: false,
      countryCode: 1,

      allRoles: [],
      // role: "",
      allLanguages: [],
      primaryLanguage: "",
      allProficiencySkills: [],
      primaryProficiencySkills: [],
      primaryLanguageRating: "",
      otherLanguage: false,
      proficientOtherLanguages: [],
      otherProficientSkills: [],
      otherLanguageRating: "",
      allServices: [],
      servicesOffered: [],
      notes: "",

      PrimaryLocation: "",
      allCountry: [],
      allState: [],
      primaryCountry: "",
      primaryState: "",
      primaryCity: "",
      primaryZip: "",

      isSameAddress: false,

      billingAddress: "",
      billingCountry: "",
      billingState: "",
      billingCity: "",
      billingZip: "",

      allPaymentMethods: [],
      paymentMethod: "",
      notes: "",

      bankAccountNo: "",
      bankRoutingNo: "",

      paypalEmail: "",

      payoneerEmail: "",

      westernUnionEmail: "",
      westernUnionAccountNo: "",
      // ..........
      role: "",
      primaryLanguage: "",
      otherLanguage: "",
      languageSkillArrData: [],
      languageSkillId: [],
      otherLanguageSkillArrData: [],
      otherLanguageSkillId: [],
      serviceArrData: [],
      subArrData: [],
      serviceId: [],
      paymentArrData: [],
      payment: "",
      subType: [],
      selectAddress: [],
      stateArrData: [],
      resTrainingCategoryArr: [],
      allAdddress: [], //for location address
      isChecked: false,
      adminPhoto: "",
      imagePath: "images/profile-pic.png",
      isLoad: true,
      vendorId: "0",
      allTimeZone: [],
    };
  }

  componentDidMount() {
    this.getCommonData();
    this.getTimeZone();
    this.getWorkExperience();
    this.getStateData();
    this.getService();
    // this.trainerService();

    this.setState({
      phoneNumber: "+" + this.state.countryCode + " ",
      alternatePhoneNumber: "+" + this.state.countryCode + " ",
      whatsappNumber: "+" + this.state.countryCode + " ",
      languageSkillArrData: languageSkillArr,
      otherLanguageSkillArrData: otherLanguageSkillArr,
      paymentArrData: paymentArr,

      // serviceArrData: serviceArr,
    });
    window.$(".my-form-rw h3").click(function () {
      $(this).parent().find(".my-form-bx").slideToggle();
      $(this).toggleClass("open");
    });
    this.getPayment();
    this.dropdownData();
    this.getVendorInfo();
  }

  // trainerService = () => {
  //   let data = {};
  //   let res = await ApiCall("getLookUpData", data);

  //   if (
  //     res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
  //     res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  //   ) {
  //     let payload = Decoder.decode(res.data.payload);
  //     let lookUpData = payload.data.lookupdata;
  //     let trainingCategoryArr = lookUpData.TRAINING_CATEGORY_TYPE;

  //     this.setState({
  //       resTrainingCategoryArr: trainingCategoryArr,
  //     });
  //   }
  // };

  getVendorInfo = async () => {
    let mainData = this.props.location;
    let preData = mainData.state;
    console.log("***********", preData);
    let data = {
      vendorid: preData.id,
    };
    let res = await ApiCall("vendoraccountinfo", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      console.log(":::::payload", payload.data[0]);
      let admindata = payload.data[0];
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
        gender: payload.data[0].genderTypeId,
        dob: payload.data[0].dob,
        workExperience: payload.data[0].experience,
        bio: payload.data[0].bio,
        timezone: payload.data[0].timezoneId,
        source: payload.data[0].sourceTypeId,
        adminPhoto: admindata.photo,
        isLoad: false,
        vendorId: preData.id,
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
          imagePath: IMAGE_STORE_PATH + admindata.photo,
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
  };

  getPayment = () => {
    let paymentDataArr = [
      {
        text: "Select",
        value: "",
      },
    ];
    paymentArr.map((data) => {
      paymentDataArr.push({
        text: data.text,
        value: data.value,
      });
    });
    var classInstance = this;
    window.$(".myDropdown_payment").ddslick({
      data: paymentDataArr,
      onSelected: function (data) {
        classInstance.setState({
          payment: data.selectedData.value,
        });
      },
    });
  };

  getService = async () => {
    axios.post(VENDOR_SERVICE_OFFERED).then((res) => {
      if (
        res.data.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.data.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let payload = Decoder.decode(res.data.data.payload);

        let serviceArr = payload.data.services;
        let serviceResData = serviceArr[0].subItem;

        // let scheduleData = serviceResData[0].subData;
        // let onDemandData = serviceResData[1].subData;

        this.setState({
          serviceArrData: serviceResData,
          scheduleData: serviceResData[0].subData,
          onDemandData: serviceResData[1].subData,
        });
      }
    });
  };

  getStateData = async () => {
    let data = {
      // countryid: 101,
      countryid: this.state.countryCode,
    };
    let res = await ApiCall("getstatelistofselectedcountry", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);

      let stateData = payload.data.statelist;
      this.setState({
        stateArrData: stateData,
      });

      let stateArr = [
        {
          text: "Select",
          value: "",
        },
      ];
      stateData.map((data) => {
        stateArr.push({
          text: data.name,
          value: data.id,
        });
      });

      var classInstance = this;
      window.$(".myDropdown_state").ddslick({
        data: stateArr,
        onSelected: function (data) {
          classInstance.setState({
            state: data.selectedData.value,
          });
        },
      });
    }
  };

  getCommonData = async () => {
    let country = await getCountryList();

    this.setState({
      allCountry: country,
    });
    this.getCountryData(country);

    let lookUpData = await getLookUpDataFromAPI();
    console.log("All LookupData", lookUpData);
    this.setState({
      allGender: lookUpData.GENDER_TYPE,
      allSourses: lookUpData.SOURCE_TYPE,
    });

    this.getSource(lookUpData.SOURCE_TYPE);

    let genderArr = [
      {
        text: "Select",
        value: "",
        selected: false,
      },
    ];
    lookUpData.GENDER_TYPE.map((data) => {
      if (data.id === this.state.gender) {
        genderArr.push({
          text: data.name,
          value: data.id,
          selected: true,
        });
      } else {
        genderArr.push({
          text: data.name,
          value: data.id,
          selected: false,
        });
      }
    });

    var classInstance = this;
    window.$(".myDropdown").ddslick({
      data: genderArr,
      onSelected: function (data) {
        classInstance.setState({
          gender: data.selectedData.value,
        });
      },
    });
  };

  dropdownData = () => {
    let roleDataArr = [
      {
        text: "Select",
        value: "",
      },
    ];
    roleArr.map((data) => {
      roleDataArr.push({
        text: data.text,
        value: data.value,
      });
    });
    var classInstance = this;
    window.$(".myDropdown_role").ddslick({
      data: roleDataArr,
      onSelected: function (data) {
        classInstance.setState({
          role: data.selectedData.value,
        });
      },
    });

    // ....................primary language .............
    let languageDataArr = [
      {
        text: "Select",
        value: "",
      },
    ];
    primaryLanguageArr.map((data) => {
      languageDataArr.push({
        text: data.text,
        value: data.value,
      });
    });
    var classInstance = this;
    window.$(".myDropdown_language_primary").ddslick({
      data: languageDataArr,
      onSelected: function (data) {
        classInstance.setState({
          primaryLanguage: data.selectedData.value,
        });
      },
    });
    // ...............other language............
    let otherLanguageDataArr = [
      {
        text: "Select",
        value: "",
      },
    ];
    otherLanguageArr.map((data) => {
      otherLanguageDataArr.push({
        text: data.text,
        value: data.value,
      });
    });
    var classInstance = this;
    window.$(".myDropdown_language_other").ddslick({
      data: otherLanguageDataArr,
      onSelected: function (data) {
        classInstance.setState({
          otherLanguage: data.selectedData.value,
        });
      },
    });
  };
  //   // .................experience........................
  getWorkExperience = () => {
    let workArr = [
      {
        text: "0",
        value: 0,
      },
      {
        text: "1",
        value: 1,
      },
      {
        text: "2",
        value: 2,
      },
      {
        text: "3",
        value: 3,
      },
      {
        text: "4",
        value: 4,
      },
      {
        text: "5",
        value: 5,
      },
      {
        text: "6",
        value: 6,
      },
      {
        text: "7",
        value: 7,
      },
      {
        text: "8",
        value: 8,
      },
      {
        text: "9",
        value: 9,
      },
      {
        text: "10",
        value: 10,
      },
      {
        text: "10+",
        value: 11,
      },
    ];
    let workExpArr = [
      {
        text: "Select",
        value: "",
        selected: false,
      },
    ];

    workArr.map((data) => {
      console.log("######", data);
      workExpArr.push({
        text: data.text,
        value: data.value,
        // selected: true,
      });
    });
    var classInstance = this;
    window.$(".myDropdown_work_experience").ddslick({
      data: workExpArr,
      onSelected: function (data) {
        classInstance.setState({
          workExperience: data.selectedData.value,
        });
      },
    });
  };

  getTimeZone = async () => {
    let timeZone = await getCountryList();
    console.log(">>>><><><><", timeZone);
    this.setState({
      allTimeZone: timeZone,
    });
    let zoneArr = [
      {
        text: "None",
        value: "",
        selected: false,
      },
    ];
    timeZone.map((data) => {
      if (data.id === this.state.timezone) {
        zoneArr.push({
          text: data.name,
          value: data.id,
          selected: true,
        });
      } else {
        zoneArr.push({
          text: data.name,
          value: data.id,
          selected: false,
        });
      }
    });

    var classInstance = this;
    window.$(".myDropdown_timeZone").ddslick({
      data: zoneArr,
      onSelected: function (data) {
        classInstance.setState({
          timezone: data.selectedData.value,
        });
      },
    });
  };

  getCountryData = async (allData) => {
    let countryArr = [
      {
        text: "None",
        value: "",
        selected: false,
      },
    ];
    allData.map((data) => {
      if (data.id === this.state.source) {
        countryArr.push({
          text: data.name,
          value: data.id,
          selected: true,
        });
      } else {
        countryArr.push({
          text: data.name,
          value: data.id,
          selected: false,
        });
      }
    });

    var classInstance = this;
    window.$(".myDropdown_country").ddslick({
      data: countryArr,
      onSelected: function (data) {
        classInstance.setState({
          country: data.selectedData.value,
        });
      },
    });
  };

  getSource = (allSource) => {
    let sourseArr = [
      {
        text: "None",
        value: "",
        selected: false,
      },
    ];
    allSource.map((data) => {
      if (data.id === this.state.source) {
        sourseArr.push({
          text: data.name,
          value: data.id,
          selected: true,
        });
      } else {
        sourseArr.push({
          text: data.name,
          value: data.id,
          selected: false,
        });
      }
    });

    var classInstance = this;
    window.$(".myDropdown_sourse").ddslick({
      data: sourseArr,
      onSelected: function (data) {
        if (data.selectedData.value === 16) {
          classInstance.setState({
            source: data.selectedData.value,
            isFriend: true,
          });
        } else {
          classInstance.setState({
            source: data.selectedData.value,
            isFriend: false,
          });
        }
        // classInstance.setState({
        //     source: data.selectedData.value
        // });
      },
    });
  };

  ratingChangedProfile = (newRating) => {
    console.log("New Rating>>>", newRating);
  };

  PrimaryLanguageRatingChanged = (newRating) => {
    console.log("New Primary Language Rating>>>", newRating);
  };

  otherLanguageRatingChange = (newRating) => {
    console.log("Other Languages", newRating);
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
    // this.setState({
    //     phoneNumber: e.target.value
    // })
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
    // this.setState({
    //     alternatePhoneNumber: e.target.value
    // })
  };

  whatsappChange = (e) => {
    console.log("::::----", e.target.value);
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
    // this.setState({
    //     whatsappNumber: e.target.value
    // })
  };

  dobChange = (e) => {
    this.setState({
      dob: e.target.value,
    });
  };

  sourseNameChange = (e) => {
    this.setState({
      sourceName: e.target.value,
    });
  };

  bioChange = (e) => {
    this.setState({
      bio: e.target.value,
    });
  };

  // ..................multiselect dropdown for primary language skill........................
  onSelect = (selectedList, selectedItem) => {
    // let intendArray = this.state.intendedUserArr;
    console.log(":::::::::", selectedItem);

    let arr = this.state.languageSkillId;
    for (let i = 0; i < this.state.languageSkillArrData.length; i++) {
      if (this.state.languageSkillArrData[i].value === selectedItem.value) {
        arr.push({
          value: selectedItem.value,
          text: this.state.languageSkillArrData[i].text,
        });
        console.log("total arr::::::::", arr);

        this.setState({
          languageSkillId: arr,
        });
      }
    }
  };

  onRemove = (selectedList, removedItem) => {
    let arr = [];
    for (let i = 0; i < selectedList.length; i++) {
      arr.push({ value: selectedList[i].value, text: selectedList[i].text });
    }
    console.log("total arr on remove::::::::", arr);
    this.setState({
      languageSkillId: arr,
    });
  };

  // ..................multiselect dropdown for other language skill........................
  onOtherSelect = (selectedList, selectedItem) => {
    // let intendArray = this.state.intendedUserArr;

    let arr = this.state.otherLanguageSkillId;
    for (let i = 0; i < this.state.otherLanguageSkillArrData.length; i++) {
      if (
        this.state.otherLanguageSkillArrData[i].value === selectedItem.value
      ) {
        arr.push({
          value: selectedItem.value,
          text: this.state.otherLanguageSkillArrData[i].text,
        });
        console.log("total arr::::::::", arr);

        this.setState({
          otherLanguageSkillId: arr,
        });
      }
    }
  };

  onOtherRemove = (selectedList, removedItem) => {
    let arr = [];
    for (let i = 0; i < selectedList.length; i++) {
      arr.push({ value: selectedList[i].value, text: selectedList[i].text });
    }
    console.log("total arr on remove::::::::", arr);
    this.setState({
      otherLanguageSkillId: arr,
    });
  };
  // ..................multiselect dropdown for sevices offered........................
  onServiceSelect = (selectedList, selectedItem) => {
    // let intendArray = this.state.intendedUserArr;
    console.log(":::::::::", this.state.serviceArrData);

    let arr = this.state.serviceId;

    for (let i = 0; i < this.state.serviceArrData.length; i++) {
      if (this.state.serviceArrData[i].id === selectedItem.id) {
        console.log("##########", this.state.serviceArrData[i].subData);
        arr.push({
          id: selectedItem.id,
          subItemName: this.state.serviceArrData[i].subItemName,
          subData: this.state.serviceArrData[i].subData,
        });
      }
      this.setState({
        serviceId: arr,

        // subArrData: this.state.serviceArrData[i].subData,
        // subArrData: this.state.serviceArrData[i].subData,
      });
    }
    console.log("total arr::::::::", arr);
    // console.log("total subdata::::::::", arr[0].subData);
  };

  onServiceRemove = (selectedList, removedItem) => {
    let arr = [];

    for (let i = 0; i < selectedList.length; i++) {
      arr.push({
        id: selectedList[i].id,
        subItemName: selectedList[i].subItemName,
        subData: this.state.serviceArrData[i].subData,
      });
    }
    this.setState({
      serviceId: arr,

      // showSchedule: true,
      // showDemand: true,
    });

    console.log(":::L:L:L::", this.state.subArrData);

    console.log("total arr on remove::::::::", arr);
  };

  // ..................service checkbox.......................

  subTypeChange = (e) => {
    let arr = this.state.subType;
    if (e.target.checked) {
      arr.push(e.target.value);
    } else {
      if (arr.length > 0) {
        arr.map((data, i) => {
          if (data === e.target.value) {
            arr.splice(i, 1);
          }
        });
      }
    }

    // console.log("SubType arr>>>", arr);

    this.setState({
      subType: arr,
      isChecked: !this.state.isChecked,
    });
  };
  subHeadCheckChange = () => {
    this.setState({
      isChecked: true,
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
  // ...............................payment............................
  // ...............document....................

  onProfileImage = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      console.log(res.data.data);
      this.setState({
        imagePath: res.data.data.url,
        adminPhoto: res.data.data.filename,
      });
      this.onUpdate();
    });
  };
  // .....................................
  isSameAddress = () => {
    this.setState({
      billingAddress: "",
      billingCountry: "",
      billingState: "",
      billingCity: "",
      billingZip: "",
    });
  };

  onUpdate = async () => {
    // let mobileNo = this.state.phoneNumber.substring(3, 14).replace(/\s/g, "");
    let mobileNo = this.state.phoneNumber.substring(3, 14);
    let data = {
      fName: this.state.fname,
      lName: this.state.lname,
      altEmail: this.state.alternateEmail,
      altPhone: this.state.alternatePhoneNumber,
      whatsapp: this.state.whatsappNumber,
      genderTypeId: this.state.gender,
      dob: SetDOBFormat(this.state.dob),
      sourceTypeId: this.state.source,
      experience: this.state.workExperience,
      additionalSource: this.state.sourceName,
      bio: this.state.bio,
      timezoneId: "591",
      countryId: this.state.country,
      ratings: "0",
      photo: this.state.adminPhoto,
      email: this.state.email,
      countrycode: this.state.countryCode,
      phone: mobileNo,
      rating: "3",

      vendorid: "47",
    };
    // console.log("actual data", data);
    let res = await ApiCall("modifyvendoraccount", data);
    // console.log("%%%%%%%%_____________________", res);
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
    // let mobileNo = this.state.phone.substring(3, 14);
    let mobileNo = this.state.phoneNumber.substring(3, 14).replace(/\s/g, "");
    let altMobile = this.state.alternatePhoneNumber
      .substring(3, 14)
      .replace(/\s/g, "");
    let whatsappNo = this.state.whatsappNumber
      .substring(3, 14)
      .replace(/\s/g, "");
    // ......................................................

    let errorCount = 0;
    let validateFName = inputEmptyValidate(this.state.fname);
    let validateFNameLength = departmentValidator(this.state.fname);
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
    }
    let validateLName = inputEmptyValidate(this.state.lname);
    let validateLNameLength = departmentValidator(this.state.lname);
    if (validateLName === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_LNAME, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateLNameLength === false) {
      toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    // let validateEmail = emailValidator(this.state.emailId);
    // if (validateEmail.status === false) {
    //   toast.error(validateEmail.message, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // } else {
    //   if (this.state.emailId.length > 50) {
    //     toast.error(AlertMessage.MESSAGE.EMAIL.MAX_EMAIL_LENGTH, {
    //       hideProgressBar: true,
    //     });
    //     errorCount++;
    //   }
    // }
    let validatePhone = inputEmptyValidate(mobileNo);

    if (validatePhone === false) {
      toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    let validateGender = inputEmptyValidate(this.state.gender);

    if (validateGender === false) {
      toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_GENDER, {
        hideProgressBar: true,
      });
      errorCount++;
    }
    // let validateDob = inputEmptyValidate(this.state.dob);
    // if (validateDob === false) {
    //   toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_DOB, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // }
    // let validateDob = inputEmptyValidate(this.state.dob);
    // if (validateDob === false) {
    //   toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_DOB, {
    //     hideProgressBar: true,
    //   });
    //   errorCount++;
    // }

    // .................................................
    if (errorCount === 0) {
      let data = {
        fName: this.state.fname,
        lName: this.state.lname,
        altEmail: this.state.alternateEmail,
        altPhone: altMobile,
        whatsapp: whatsappNo,
        genderTypeId: this.state.gender,
        dob: SetDOBFormat(this.state.dob),
        sourceTypeId: this.state.source,
        experience: this.state.workExperience,
        additionalSource: this.state.sourceName,
        bio: this.state.bio,
        timezoneId: this.state.timezone,
        countryId: this.state.country,
        ratings: "0",
        photo: this.state.adminPhoto,
        email: this.state.email,
        countrycode: this.state.countryCode,
        phone: mobileNo,
        rating: "3",
        photo: this.state.adminPhoto,
        vendorid: this.state.vendorId.toString(),
      };
      // console.log("req data", data);
      let res = await ApiCall("modifyvendoraccount", data);
      // console.log("%%%%%%%%)))))))))", res);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.UPDATE.PROFILE_SUCCESS, {
          hideProgressBar: true,
        });
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="wrapper">
          <Header />
          <Sidebar />
          <div class="component-wrapper" hidden={!this.state.isLoad}>
            <ReactLoader />
          </div>
          <div className="component-wrapper" hidden={this.state.isLoad}>
            <div className="vender-head _fl"> Vendor Profile </div>
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
                            <span className="">First Name</span>
                            <input
                              type="text"
                              value={this.state.fname}
                              onChange={this.firstNameChange}
                              name=""
                              placeholder="Xxxxxxx"
                              className="in-field2"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Last Name</span>
                            <input
                              type="text"
                              value={this.state.lname}
                              onChange={this.lastNameChange}
                              name=""
                              placeholder="Xxxxxxx"
                              className="in-field2"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Email ID</span>
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
                            <span className="">Alternate Email ID</span>
                            <input
                              type="text"
                              value={this.state.alternateEmail}
                              onChange={this.alternateEmailChange}
                              name=""
                              placeholder="zzzz@gmail.com"
                              className="in-field2"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Phone Number</span>
                            <input
                              type="text"
                              value={this.state.phoneNumber}
                              onChange={this.phoneChange}
                              name=""
                              placeholder="+1-Xxxxxxx"
                              className="in-field2"
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
                              placeholder="+1-Xxxxxxx"
                              className="in-field2"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Gender</span>
                            <div class="dropdwn">
                              <select className="myDropdown frm4-select"></select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form_rbx">
                            {" "}
                            <span>Date of Birth</span>
                            <div className="form-input-fields">
                              <input
                                type="date"
                                id="from_datepicker"
                                className="textbox4"
                                // className="textbox4 d-icon"
                                placeholder="10/25/2021"
                                value={this.state.dob}
                                onChange={this.dobChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Work Experience</span>
                            <div class="dropdwn">
                              <select className="myDropdown_work_experience frm4-select"></select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form_rbx">
                            {" "}
                            <span>How did you hear about us?</span>
                            <div class="dropdwn">
                              <select className="myDropdown_sourse frm4-select"></select>
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
                            <span>Country of Origin</span>
                            <div class="dropdwn">
                              <select className="myDropdown_country frm4-select"></select>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Time Zone</span>
                            <div class="dropdwn">
                              <select className="myDropdown_timeZone frm4-select"></select>
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
                      </div>
                      <div className="row">
                        <div className="col-md-12 text-center">
                          <button type="submit" className="delete_button">
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="sv_btn"
                            // onClick={() => this.onNext()}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="my-form-rw _fl">
                    <h3>Service Info </h3>
                    <div className="my-form-bx">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Role(s)</span>
                            <div
                              class="dropdwn"
                              style={{ width: "60%", cursor: "pointer" }}
                            >
                              <select className="myDropdown_role frm4-select"></select>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* {this.state.role === 1 ? ( */}

                      <React.Fragment>
                        <div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form_rbx">
                                {" "}
                                <span className="">
                                  Primary (Native/Source) Language
                                </span>
                                <div
                                  className="dropdwn"
                                  style={{ width: "93%", cursor: "pointer" }}
                                >
                                  <select className="myDropdown_language_primary frm4-select"></select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_rbx">
                                {" "}
                                <span className="">
                                  Primary Language Proficiency Skills
                                </span>
                                <div className="dropdwn">
                                  <Multiselect
                                    options={this.state.languageSkillArrData} // Options to display in the dropdown
                                    selectedValues={this.state.languageSkillId} // Preselected value to persist in dropdown
                                    onSelect={this.onSelect} // Function will trigger on select event
                                    onRemove={this.onRemove} // Function will trigger on remove event
                                    displayValue="text" // Property name to display in the dropdown options
                                    showCheckbox
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_rbx">
                                {" "}
                                <span className="">
                                  Primary Language Fluency Ratings
                                </span>
                                <div className="rate">
                                  <ReactStars
                                    count={5}
                                    onChange={this.PrimaryLanguageRatingChanged}
                                    size={35}
                                    // color="#fff"
                                    activeColor="#009fe0"
                                    // value={data.rating}
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
                                  Proficient Other Languages?
                                </span>
                                <div className="check-field">
                                  <label className="checkbox_btn">
                                    <input type="radio" name="radio" />
                                    <span className="checkmark3"></span> Yes
                                  </label>
                                </div>
                                <div className="check-field">
                                  <label className="checkbox_btn">
                                    <input type="radio" name="radio" />
                                    <span className="checkmark3"></span> No
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form_rbx">
                                {" "}
                                <span className="">Other language[s]</span>
                                <div
                                  className="dropdwn"
                                  style={{ width: "93%", cursor: "pointer" }}
                                >
                                  <select className="myDropdown_language_other frm4-select"></select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_rbx">
                                {" "}
                                <span className="">
                                  Other Language Proficiency Skills
                                </span>
                                <div className="dropdwn">
                                  <Multiselect
                                    options={
                                      this.state.otherLanguageSkillArrData
                                    } // Options to display in the dropdown
                                    selectedValues={
                                      this.state.otherLanguageSkillId
                                    } // Preselected value to persist in dropdown
                                    onSelect={this.onOtherSelect} // Function will trigger on select event
                                    onRemove={this.onOtherRemove} // Function will trigger on remove event
                                    displayValue="text" // Property name to display in the dropdown options
                                    showCheckbox
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_rbx">
                                {" "}
                                <span className="">
                                  Primary Language Fluency Ratings
                                </span>
                                <div className="rate">
                                  <ReactStars
                                    count={5}
                                    onChange={this.otherLanguageRatingChange}
                                    size={35}
                                    // color="#fff"
                                    activeColor="#009fe0"
                                    // value={data.rating}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-8">
                              <div className="form_rbx">
                                {" "}
                                <span className="">Service Offered</span>
                                <div className="dropdwn">
                                  <Multiselect
                                    options={this.state.serviceArrData} // Options to display in the dropdown
                                    selectedValues={this.state.serviceId} // Preselected value to persist in dropdown
                                    onSelect={this.onServiceSelect} // Function will trigger on select event
                                    onRemove={this.onServiceRemove} // Function will trigger on remove event
                                    displayValue="subItemName" // Property name to display in the dropdown options
                                    showCheckbox
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_rbx">
                                {" "}
                                {/* <span className="">Are you a/an</span> */}
                                {/* {this.state.showSchedule ? ( */}
                                <div
                                  class="multiple-option-check"
                                  style={{
                                    paddingLeft: "60px",
                                    paddingTop: "30px",
                                  }}
                                >
                                  {this.state.serviceId.map((item, key) => (
                                    <React.Fragment key={key}>
                                      {console.log(
                                        "data:::;",
                                        item.subItemName
                                      )}
                                      <div class="check-field">
                                        <label
                                          class="checkbox_btn"
                                          style={{ fontWeight: 700 }}
                                        >
                                          <input
                                            checked={!this.state.isChecked}
                                            type="checkbox"
                                            name="pp"
                                            value={item.subItemName}
                                            onChange={this.subHeadCheckChange}
                                          />
                                          <span class="checkmark3"></span>{" "}
                                          {item.subItemName}
                                        </label>
                                      </div>
                                      {item.subData.map((item1) => (
                                        <div class="check-field">
                                          <label class="checkbox_btn">
                                            <input
                                              checked={!this.state.isChecked}
                                              type="checkbox"
                                              name="pp"
                                              value={item1.name}
                                              onChange={this.subTypeChange}
                                            />
                                            <span class="checkmark3"></span>{" "}
                                            {item1.name}
                                          </label>
                                        </div>
                                      ))}
                                    </React.Fragment>
                                  ))}
                                </div>
                                {/* ) : ( */}
                                <div class="multiple-option-check"></div>
                                {/* )} */}
                                {/* ....................................... */}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* ) : ( */}
                      </React.Fragment>
                      {/* )} */}
                      {/* .............................3........................... */}
                    </div>
                  </div>
                  <div className="my-form-rw _fl">
                    <h3>Address Info</h3>
                    <div className="my-form-bx">
                      <h4 className="h4_heading">Primary address</h4>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form_rbx adr">
                            {" "}
                            <span className="">Address</span>
                            {/* <textarea
                              placeholder="Address"
                              className="in-textarea"
                            ></textarea> */}
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
                            <div className="ak">
                              <img src="images/location.png" />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form_rbx">
                            {" "}
                            <span className="">State</span>
                            {/* <div className="bts-drop">
                              <select className="selectpicker">
                                <option>Californina</option>
                                <option>Canada</option>
                                <option>Texas</option>
                              </select>
                            </div> */}
                            <div
                              class="dropdwn"
                              style={{ width: "100%", cursor: "pointer" }}
                            >
                              <select className="myDropdown_state frm4-select"></select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="web-form-bx">
                            {" "}
                            <span className="">City</span>
                            <input
                              type="text"
                              value=""
                              name=""
                              placeholder="Xxxxxxx"
                              className="in-field2"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Zip Code</span>
                            <input
                              type="text"
                              value=""
                              name=""
                              placeholder="00000"
                              className="in-field2"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="billing-info">
                        <h4 className="text-billing">Billing Info</h4>
                        <label className="custom_check">
                          Same as Address Info
                          <input type="checkbox" onClick={this.isSameAddress} />
                          <span className="checkmark"></span>{" "}
                        </label>
                      </div>
                      <div className="billing-address-info">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form_rbx adr">
                              {" "}
                              <span className="">Address</span>
                              <div class="dropdwn">
                                <Stack
                                  spacing={2}
                                  style={{ marginTop: "15px" }}
                                >
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
                              <div className="ak">
                                <img src="images/location.png" />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form_rbx">
                              {" "}
                              <span className="">State</span>
                              <div
                                class="dropdwn"
                                style={{ width: "100%", cursor: "pointer" }}
                              >
                                <select className="myDropdown_state frm4-select"></select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form_rbx">
                              {" "}
                              <span className="">City</span>
                              <input
                                type="text"
                                value=""
                                name=""
                                placeholder="Xxxxxxx"
                                className="in-field2"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form_rbx">
                              {" "}
                              <span className="">Zip Code</span>
                              <input
                                type="text"
                                value=""
                                name=""
                                placeholder="00000"
                                className="in-field2"
                              />
                            </div>
                          </div>
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
                            <span className="">Payment Method</span>
                            <div className="dropdwn">
                              <select className="myDropdown_payment frm4-select"></select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Account Number</span>
                            <input
                              type="text"
                              value=""
                              name=""
                              placeholder="Xxxxxxx"
                              className="in-field2"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Routing Number</span>
                            <input
                              type="text"
                              value=""
                              name=""
                              placeholder="00000"
                              className="in-field2"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-8">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Notes</span>
                            <textarea
                              placeholder="......."
                              className="in-textarea min"
                            ></textarea>
                          </div>
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
                    <h4 className="h4_text">VENDOR ID</h4>
                    <div className="rate rtg">
                      <ReactStars
                        count={5}
                        onChange={this.ratingChangedProfile}
                        size={35}
                        // color="#fff"
                        activeColor="#009fe0"
                        // value={data.rating}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="_fl">
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
            </div>
          </div>
        </div>
        {/* <!-- Modal --> */}
        <div
          id="create-request"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">
                  X
                </button>
                <h4 className="modal-title">New Request</h4>
              </div>
              <div className="modal-body">
                <div className="model-info">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="request_model-info">
                        <figure>
                          <img src="images/m-camera.png" />
                        </figure>
                        <h3 className="text-center">schedule interpretation</h3>
                        <p>
                          Reference site about Lorem Ipsum, giving information
                          on its origins, as well as a random Lipsum generator.
                          Reference site about Lorem Ipsum, giving information
                          on its origins, as well as a random Lipsum
                          generator.Reference site about Lorem Ipsum, giving
                          information on its origins, as well as a random Lipsum
                          generator.Reference site about Lorem Ipsum, giving
                          information on its origins, as well as a random Lipsum
                          generator.
                        </p>
                        <div className="re_model text-center">
                          <a href="#">select</a>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="request_model-info">
                        <figure>
                          <img src="images/m-camera.png" />
                        </figure>
                        <h3 className="text-center">request project</h3>
                        <p>
                          Reference site about Lorem Ipsum, giving information
                          on its origins, as well as a random Lipsum generator.
                          Reference site about Lorem Ipsum, giving information
                          on its origins, as well as a random Lipsum
                          generator.Reference site about Lorem Ipsum, giving
                          information on its origins, as well as a random Lipsum
                          generator.Reference site about Lorem Ipsum, giving
                          information on its origins, as well as a random Lipsum
                          generator.
                        </p>
                        <div className="re_model text-center">
                          <a href="#">select</a>
                        </div>
                      </div>
                    </div>
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
