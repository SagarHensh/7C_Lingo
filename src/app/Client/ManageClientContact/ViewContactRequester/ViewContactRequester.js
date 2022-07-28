import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ApiCall, ApiCallClient } from "../../../../services/middleware";
import history from "../../../../history";
import { InputText, SelectBox } from "../../../Admin/SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../enums";
import $ from "jquery";
import {
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
  getLookUpDataFromAPI,
  phoneNumberCheck,
} from "../../../../services/common-function";
import { ErrorCode } from "../../../../services/constant";
import { IMAGE_URL } from "../../../../services/config/api_url";
import axios from "axios";
import Select, { components } from "react-select";
import { Link } from "react-router-dom";
import ReactLoader from "../../../Loader";
// .................mui switch...................................


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

export default class ViewContactRequester extends Component {
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
      industryData: "",
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
      jobTitle: "",
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
     
      // isSameAddress: false,
      billingIsSameAddress: false,
      allClientArr: [],
      clientData: {},

      departmentid: [],
      locArr: [],
      departmentInfoArr: [],
      languageArr: [],
      languageData: {},
      departmentData:[],
      amount: "",
      requesterData:{},
      allRequester:[],
      directLine: "",
      declineMessage: "",
      showId: "",
      userType:"",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    let mainData = this.props.location;
    let preData = mainData.state;
    console.log("preData::",preData)
    this.setState({
      showId: preData.clientcontactid,
      
    });

    window.$(".my-form-rw h3").click(function () {
      $(this).parent().find(".my-form-bx").slideToggle();
      $(this).toggleClass("open");
    });
    var classInstance = this;
    var modal = document.getElementById("decline-model");

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        classInstance.closeModal();
      }
    };

    // this.fetchClientInfo();
    this.load();
  }

  load = async () => {
    let industryDataArr = [],
      clientAddressData = [],
      clientBillAddressData = [],
      clientUserData = {},
      clientDataObj = {},
      industryObjData={},
      deptArr = [],
      deptObjData = [],
      deptMainData = [],
      location = [],
      deptInfo = [],
      languageArrData = [],
      languageResArrData = [],
      requesterMainArr=[],
      languageDataObj={},
      allClientArr = await getClientInfo(),
      lookupData = await getLookUpDataFromAPI();

    let mainData = this.props.location;
    let preData = mainData.state;
    // consoleLog("preData::", preData);
    let clientData = {
      clientcontactid: preData.clientcontactid,
      userType:preData.userTypeId
    };
    consoleLog("lookupDta:::", lookupData);

    
    lookupData.CLIENT_CONTACT_TYPE.map((obj) => {
      if(obj.id == preData.userTypeId){
        this.setState({
          userType:obj.id
        })
      }
    })


    let clientInfoRes = await ApiCall(
      "getclientcontactrequestdetails",
      clientData
    );

    if (
      clientInfoRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      clientInfoRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(clientInfoRes.data.payload);
      consoleLog("clientRepayloads::", payload.data);
      clientUserData = payload.data.clientcontactinfo[0];

      // ...........location .................
      let arrData = [],
        locationDataObj = {};
      let locationData = [];
      let locationRes = await ApiCall("getlocaiondescription", {
        place: clientAddressData.address,
      });
      if (
        locationRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        locationRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let locationArr = Decoder.decode(locationRes.data.payload);
        locationData = locationArr.data.locaionsuggesion;
        // consoleLog("data::::location:", locationData);
        for (let i = 0; i < locationData.length; i++) {
          arrData.push({
            label: locationData[i].description,
            value: locationData[i].placeid,
          });
          locationDataObj = {
            label: locationData[i].description,
            value: locationData[i].placeid,
          };
        }

        // consoleLog("locationdataaaaaaaaaaaaaa::",locationDataObj)
        let obj = {
          placeid: locationDataObj.value,
        };
        // consoleLog("Get Coordinante from place id::", obj)
        let locationDataPlace = await ApiCall("getcoordinatefromplaceid", obj);
        if (
          locationDataPlace.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          locationDataPlace.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          let locationArr = Decoder.decode(locationDataPlace.data.payload);
          let locateAdd = {};
          locateAdd = {
            lat: locationArr.data.coordinatedetails[0].lat,
            long: locationArr.data.coordinatedetails[0].lng,
            locationName: locationDataObj.label,
            locationId: locationDataObj.value,
          };
          // consoleLog("Location details::", locateAdd);
          this.setState({
            selectLocation: locateAdd,
          });
        }

        this.setState({
          locationArr: arrData,
          //   locationData: val,
        });
      }

      // ......client dropdown ....................
      allClientArr.map((obj) => {
      if(obj.value == clientUserData.clientid){
        clientDataObj = {
          label: obj.label,
          value: obj.value,
        };
      }
      })

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
        // consoleLog("payload:::::dept infoo:::::", deptInfo);
  
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

      // ...........requester dropdown,,,,,,,,,,,,,,,,,,,,,
      let requesterData = {
        clientid:clientDataObj.value
      }
      // consoleLog("requesterReq:::",requesterData)

      let requesterRes = await ApiCall("fetchAllRequesterByClientId",requesterData);

      if (
        requesterRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        requesterRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let requesterArr = Decoder.decode(requesterRes.data.payload);
        // consoleLog("requester:::",requesterArr.data.requesterList)
        requesterArr.data.requesterList.map((obj) => {
          requesterMainArr.push({
            label:obj.name,
            value:obj.userId
          })
        })

      }

      // .......................billing location,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

      let arrDataBill = [],
        locationDataObjBill = {};
      let locationDataBill = [];
      let locationResBill = await ApiCall("getlocaiondescription", {
        place: clientBillAddressData.address,
      });
      if (
        locationResBill.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        locationResBill.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let locationArr = Decoder.decode(locationResBill.data.payload);
        locationDataBill = locationArr.data.locaionsuggesion;
        // consoleLog("data::::location:", locationDataBill);
        for (let i = 0; i < locationDataBill.length; i++) {
          arrDataBill.push({
            label: locationDataBill[i].description,
            value: locationDataBill[i].placeid,
          });
          locationDataObjBill = {
            label: locationDataBill[i].description,
            value: locationDataBill[i].placeid,
          };
        }
        let obj = {
          placeid: locationDataObjBill.value,
        };
        let locationDataPlaceBill = await ApiCall(
          "getcoordinatefromplaceid",
          obj
        );
        if (
          locationDataPlaceBill.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          locationDataPlaceBill.respondcode ===
            ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          let locationArr = Decoder.decode(locationDataPlaceBill.data.payload);
          let locateAddBill = {};
          locateAddBill = {
            lat: locationArr.data.coordinatedetails[0].lat,
            long: locationArr.data.coordinatedetails[0].lng,
            locationName: locationDataObjBill.label,
            locationId: locationDataObjBill.value,
          };
          this.setState({
            selectLocation: locateAddBill,
          });
        }

        this.setState({
          billingLocationArr: arrDataBill,
        });
      }

      // ........language..................
      let languageResData = await ApiCall("getlanguagelist");
      let languagePayload = Decoder.decode(languageResData.data.payload);
      languageResArrData = languagePayload.data.languagelist;
      for (let n = 0; n < languageResArrData.length; n++) {
        languageArrData.push({
          label: languageResArrData[n].language,
          value: languageResArrData[n].id,
        });
  
       
          // if (languageResArrData[n].language === "English") {
          //   languageDataObj = {
          //     label: languageResArrData[n].language,
          //     value: languageResArrData[n].id,
          //   };
          //   language = languageResArrData[n].id;
          // }
       
      }

      this.setState({
        uname: clientUserData.clientName,
        industryTypeId: clientUserData.industryType,
        businessEmail: clientUserData.businessEmail,
        businessPhone:
          "+" +
          clientUserData.businessCountryCode +
          " " +
          clientUserData.businessPhone,
          email:clientUserData.email,
          depMainArr: deptInfo,
          departmentInfoArr: deptArr,
          departmentid: deptIdArr,
          locArr: loc,
        website: clientUserData.website,
        fax: clientUserData.fax,
        //   purchaseOrder: clientUserData.purchaseOrder,
        //   checkStatus: clientUserData.status === 1 ? true : false,
        fname: clientUserData.fName,
        lname: clientUserData.lName,
        //   email: clientUserData.email,
        phone: "+" + clientUserData.countryCode + " " + clientUserData.mobile,
        clientData: clientDataObj,
        //   // phone: clientUserData.adminPhone,
        isSelected: clientUserData.isOutOfTown === 1 ? true : false,
        // industryData:clientUserData.industrytype,
        languageArr: languageArrData,
        directLine:
        "+" + this.state.countryCode + " " + "",
        allRequester:requesterMainArr
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
        if (clientUserData.industryTypeId === industryArr[i].id) {
          industryObjData = {
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
      industryData: industryObjData,
      industryData: industryObjData,
      // industryData: industryData,
      // stateData: stateobjData,
      // billingStateData: billingStateobjData,
      // businessPhone: "+" + this.state.countryCode + " ",
      // phone: "+" + this.state.countryCode + " ",
      isLoad: false,
    });
  };



  openModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("decline-model").style.display = "block";
    document.getElementById("decline-model").classList.add("show");
  };

  closeModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("decline-model").style.display = "none";
    document.getElementById("decline-model").classList.remove("show");
  };
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
  onLanguageChange = (data) => {
    this.setState({
      languageData: data,
      language: data.value
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
        // consoleLog("test", phoneNumberCheck(value));
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
  onEmailChange = (e) => {
    this.setState({
      email: e.target.value,
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
  onJobTitleChange = (value) => {
    this.setState({
      jobTitle: value,
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
  onAmountChange = (data) => {
    let val = zipValidate(data);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        amount: val,
      });
    }
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
  onAddressNext = async () => {
    let mainData = this.props.location;
    let preData = mainData.state;
    window.scrollTo(0, 0);
    let mobileNo = this.state.phone.substring(3, 15);
    // let contactNo = this.state.contactPhone.substring(3, 15);
    let directNo = this.state.directLine.substring(3, 15);
    let errorCount = 0;
    let validateDirectLine = inputEmptyValidate(directNo);
    let validateAmount = inputEmptyValidate(this.state.amount);
    let validateOutOfTown = inputEmptyValidate(this.state.isSelected);
    // ............
    let validateFName = inputEmptyValidate(this.state.fname);
    let validateFNameLength = departmentValidator(this.state.fname);
    let validateLName = inputEmptyValidate(this.state.lname);
    let validateLNameLength = departmentValidator(this.state.lname);
    let validateDepartment = inputEmptyValidate(this.state.departmentData);
    let validateLanguage = inputEmptyValidate(this.state.language);
    let validateEmail = emailValidator(this.state.email);
    let validatePhone = inputEmptyValidate(mobileNo);
    let validateJobTitle = inputEmptyValidate(this.state.jobTitle);
    
    let validatePassword = passwordValidator(this.state.password);
    let validateCpassword = inputEmptyValidate(this.state.cpassword);

    let validateRequesterData = inputEmptyValidate(this.state.requesterData.value);


    if(validateRequesterData === false && this.state.isSelected_merge === "true"){
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_REQUESTER_DROPDOWN, {
        hideProgressBar: true,
      });
      errorCount++;
    }
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
    } else if(validateDepartment === false){
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_DEPARTMENT, {
        hideProgressBar: true,
      });
      errorCount++;
    }  else if (validateLanguage === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_LANGUAGE, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if(validateEmail.status === false){
      toast.error(validateEmail.message,{
        hideProgressBar:true
      });
      errorCount++;
    }else if (this.state.email.length > 100) {
      toast.error(AlertMessage.MESSAGE.EMAIL.MAX_EMAIL_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if(validatePhone === false){
      toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY,{hideProgressBar:true});
      errorCount++;
    } else  if (validateJobTitle === false) {
      toast.error(AlertMessage.MESSAGE.CLIENT.EMPTY_CONTACT_JOB_TITLE, {
        hideProgressBar: true,
      });
      errorCount++;
    }  else if (validatePassword.status === false) {
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
    }
   

   else if (validateDirectLine === false) {
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
        // clientcontacttype: this.state.roleData.value,
        fname: this.state.fname,
        lname: this.state.lname,
        // dob: this.state.dobDate,
        
        altcountrycode: this.state.countryCode,
      
        mobile: mobileNo,
        clientid: this.state.clientData.value,
        department: this.state.departmentid,
        industrytype: this.state.industryData.value === null || this.state.industryData.value === undefined ? "" :this.state.industryData.value,
        // jobtype: this.state.jobTypeData.value,
        jobtitle: this.state.jobTitle,
        language: this.state.language,
        profilepic: this.state.adminPhoto,
        directline: directNo,
        outoftown: this.state.isSelected ? "1" : "0",
        amount: this.state.amount,
        countrycode: this.state.countryCode,
        clientcontactid: preData.clientcontactid,
        password: this.state.password,
        requesterId:this.state.requesterData.value == null || this.state.requesterData.value == undefined ? "" :this.state.requesterData.value,
        isMerge:this.state.isSelected_merge == "true" ? "1" : "0",
      };
      // return history.push("/adminAddClientPageThree");

      consoleLog("req accpet",data)

      let res = await ApiCall("clientContactMerge", data);
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
  onBillingZipChange = (value) => {
    let val = zipValidate(value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        billingZipCode: val,
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
        billingSelectedLocation: this.state.selectedLocation,
        billingLocationData: this.state.locationData,
        billingCountryData: this.state.countryData,

        billingStateData: this.state.stateData,
        billingCity: this.state.city,
        billingZipCode: this.state.zipCode,
        billingIsSameAddress: !this.state.billingIsSameAddress,
      });
    } else {
      this.setState({
        billingSelectedLocation: "",
        billingCountryData: {},

        billingCountryId: "",
        billingStateData: {},
        billingCity: "",
        billingZipCode: "",
        billingIsSameAddress: !this.state.billingIsSameAddress,
      });
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
  onRequesterChamge = (val) => {
    this.setState({
      requesterData: val,
    });
  };
  declineModal = () => {
    // window.$("#decline-model").modal("show");
    window.scrollTo(0, 0);
    this.openModal();
  };
  declineRequest = () => {
    let errorCount = 0;
    let validateReason = inputEmptyValidate(this.state.declineMessage);
    if (validateReason === false) {
      toast.error(AlertMessage.MESSAGE.DECLINE_MODAL.EMPTY_MESSAGE, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      let data = {
        status: "2",
        clientcontactid: this.state.showId,
        reason: this.state.declineMessage,
      };
      // console.log("data Decline", data)
      this.modifyStatus(data);
      this.declineClose();
    }
  };
  modifyStatus = async (data) => {
    let res = await ApiCall("modifyclientcontactstatus", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      if (data.status === "1") {
        toast.success(AlertMessage.MESSAGE.CLIENT_REQUEST.REQUEST_ACCEPTED, {
          hideProgressBar: true,
        });
        return history.push("/clientContactListPage")
      } else if (data.status === "2") {
        toast.success(AlertMessage.MESSAGE.CLIENT_REQUEST.REQUEST_DECLINED, {
          hideProgressBar: true,
        });
      }
      this.load();
    }
  };
  declineMessageChange = (e) => {
    this.setState({
      declineMessage: e.target.value,
    });
  };
  declineClose = () => {
    this.setState({
      declineMessage: "",
    });
    // window.$("#decline-model").modal("hide");
    this.closeModal();
  };


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
            <Link to="/clientContactRequestPage">Contacts Request</Link> / Edit
          </div>
          <div className="vender-head _fl">Client Details</div>
          <div className="myaccount-section-wrap _fl">
            <div className="row">
              <div className="col-md-9">

              <div className="my-form-rw _fl">
              <div className="my-form-bx" style={{ display: "block" }}>
              <div className="web-form-bx selct">
                  <div className="frm-label lblSize">
                    Would you like to Merge with Existing Requester ?
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
                {this.state.isSelected_merge == "true" ? (
                  <React.Fragment>
                    <div className="web-form-bx">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="vn_frm">
                            {" "}
                            <span>Requester</span>
                            <div className="bts-drop">
                              <div className="dropdown bootstrap-select">
                                <SelectBox
                                  value={this.state.requesterData}
                                  optionData={this.state.allRequester}
                                  onSelectChange={(value) => {
                                    this.onRequesterChamge(value);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment />
                )}
                </div>
                </div>
                <div className="my-form-rw _fl">
                  <div className="boxTitle">Account Information</div>
                  {/* <AccountInformation /> */}
                  <div className="my-form-bx" style={{ display: "block" }}>
                    
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
                              isDisabled
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
                          
                       
                             
                          
                        </div>
                      </div>
                    </div>
                    <div className="department-form">
                      <div className="row">
                        <div className="col-md-5">
                        
                          <div className="form_rbx">
                           
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
                          </div>
                        </div>
                        <div className="col-md-2"></div>
                        <div className="col-md-5">
                          <div className="form_rbx">
                            <span className="">Preferred Language *</span>

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
                            <span className="">Email *</span>

                            <input
                              type="text"
                              placeholder=""
                              className="in-field2"
                              value={this.state.email}
                              onChange={(e) => {
                                this.onEmailChange(e);
                              }}
                            />
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
                      </div>
                    </div>

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
                  </div>
                </div>

                <div className="my-form-rw _fl">
                  <div className="boxTitle">Address Information</div>
                  {/* <AccountInformation /> */}
                  <div className="my-form-bx" style={{ display: "block" }}>
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
                    
                    
                  </div>
                </div>
                <div className="my-form-rw _fl">
                  <div className="boxTitle">Settings</div>

                  {/* <AccountInformation /> */}
                  <div className="my-form-bx" style={{ display: "block" }}>
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
                            <div className="col-md-6">
                          {this.state.isSelected === true ? <React.Fragment>
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
                          </React.Fragment> : <React.Fragment />}

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
                      return history.push("/clientContactRequestPage");
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
                    onClick={this.declineModal}
                  >
                    Decline
                  </a>
                  <a
                    href="javascript:void(0)"
                    className="blue-btn"
                    style={{ textDecoration: "none" }}
                    onClick={this.onAddressNext}
                  >
                    {this.state.isSelected_merge == "true"
                      ? "Merge & Accept"
                      : "Accept"}
                  </a>
                  {/* </React.Fragment> : <React.Fragment/>} */}
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
        </div>

         {/* ..................Decline modal................................. */}
         <div
          id="decline-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content" style={{ width: "100%" }}>
              <div className="cancel-job-head">
                <div className="row">
                  <div className="col-md-12">
                    <h2>
                      REASON TO <span>DECLINE</span>
                    </h2>
                    <button className="close-page">
                      <img
                        src={ImageName.IMAGE_NAME.CLOSE_BTN_3}
                        onClick={this.declineClose}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-body">
                <div className="model-info f-model">
                  <div className="form-search-app">
                    <textarea
                      placeholder="Reason"
                      className="in-textarea msg min"
                      style={{ resize: "none" }}
                      value={this.state.declineMessage}
                      onChange={this.declineMessageChange}
                    ></textarea>
                    <div className="web-form-bx margin-top-20">
                      <div className="_button-style _fl text-center">
                        <a className="white-btn" onClick={this.declineClose}>
                          cancel
                        </a>
                        <a
                          className="blue-btn"
                          style={{ color: "#fff" }}
                          onClick={this.declineRequest}
                        >
                          submit
                        </a>
                      </div>
                    </div>
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
      </React.Fragment>

    );
  }
}


