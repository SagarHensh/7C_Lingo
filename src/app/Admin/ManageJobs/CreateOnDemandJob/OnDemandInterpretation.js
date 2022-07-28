import React from "react";
import { Link } from "react-router-dom";
import "../../../../css/createnewjob.css";
import { AlertMessage, ImageName } from "../../../../enums";
import { Decoder } from "../../../../services/auth";
import {
  consoleLog,
  getClientInfo,
  getCountryList,
  getLanguageArray,
  getLookUpDataFromAPI,
  phoneNumberCheck,
  SetDatabaseDateFormat,
  SetDOBFormat,
  SetTimeMinSecFormat,
  SetUSAdateFormat,
  SetUSAdateFormatV2,
} from "../../../../services/common-function";
import { ApiCall } from "../../../../services/middleware";
import { MultiSelectBox, SelectBox } from "../../SharedComponents/inputText";
import Select, { components } from "react-select";
import { ErrorCode, UsersEnums } from "../../../../services/constant";
import {
  inputEmptyValidate,
  mobileNumberValidator,
  numberValidator,
} from "../../../../validators";
import { ToastContainer, toast } from "react-toastify";
import history from "../../../../history";
import { IMAGE_PATH_ONLY } from "../../../../services/config/api_url";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactLoader from "../../../Loader";

// For Dropdown

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={ImageName.IMAGE_NAME.LOCATION} style={{ width: "17px" }} />
    </components.DropdownIndicator>
  );
};

const jobDuration = [
  {
    label: "Minute",
    value: "Minute",
  },
  {
    label: "Hour",
    value: "Hour",
  },
  {
    label: "Day",
    value: "Day",
  },
];

export default class OnDemandInterpretation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      countryCode: 1,
      imagePath: ImageName.IMAGE_NAME.PROFILE_PIC,
      numbersOption: [],
      allClientArr: [],
      allRequesterArr: [],
      selectedClient: {},
      selectedRequester: {},
      client: 0,
      allServiceArr: [],
      selectedService: {
        label: "Interpretation",
        value: 45,
      },
      service: 45,
      allAppointmentType: [],
      selectedAppointmentType: {},
      appointmentType: "",
      allLanguage: [],
      selectedSourceLanguage: {
        label: "English",
        value: 110,
      },
      selectedTargetLanguage: {},
      sourceLanguage: 110,
      targetLanguage: [],
      selectedRequiredInterpreter: {
        label: 1,
        value: 1,
      },
      interpreterRequiredNumber: 1,
      interpreterCheckIn: false,
      allJobType: [],
      jobType: "",
      jobNotes: "",
      appointmentNotes: "",
      appointmentDate: "",
      hour: "08",
      min: "00",
      ampm: "AM",
      locationData: {},
      locationArr: [],
      onsiteContact: "",
      onSiteContactPhone: "+" + 1 + " ",
      countrySpecificDialect: false,
      havePrefferedInterpreter: false,
      allLeiList: [],
      leiOptionList: [],
      selectedLei: {},
      leiId: "",
      leiDob: "",
      leiEmail: "",
      leiPhone: "",
      leiCountryCode: "",
      leiGender: "",
      leiReference: "",
      leiCountry: 231,
      leiLanguage: "",
      leiNote: "",
      allCountryOption: [],
      selectedCountry: {
        label: "United States",
        valye: 231,
      },
      allGenderOption: [],
      selectedLeiGender: {},
      selectedLeiLanguage: {},
      jobDurationValue: 1,
      allJobDuration: jobDuration,
      selectedJobDuration: {
        label: "Hour",
        value: "Hour",
      },
      jobDurationLimit: "Hour",
      clientName: "",
      clientPhone: "",
      otherServices: true,
      otherServicesData: "",

      userType: 0,
      allClientDepartment: [],
      selectedClientDepartment: [],
      clientDepartment: [],

      clientIDforLei: "",
      currentTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  componentDidMount() {
    let authData = localStorage.getItem("AuthToken");
    let authUser = Decoder.decode(authData);
    let clientIdObj = {};

    if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT) {
      clientIdObj = {
        label: "label",
        value: authUser.data.userid,
      };
      //   consoleLog("userType:::", UsersEnums.APPLICATION_ROLE.CLIENT);
      this.getRequesterData(authUser.data.userid);
      this.getLEIdata({ clientId: authUser.data.userid });

      this.getClientData(clientIdObj);
      this.setState({
        userType: UsersEnums.APPLICATION_ROLE.CLIENT,
      });
    } else if (
      authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN
    ) {
      //   consoleLog("userType:::", UsersEnums.APPLICATION_ROLE.CLIENT);
      this.setState({
        userType: UsersEnums.APPLICATION_ROLE.SUPER_ADMIN,
      });
    }

    // .....  ..............LEI Data..........................
    if (authData) {
      let data = {
        clientId: authUser.data.userid,
      };
      this.getLEIdata(data);
    }

    let arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push({
        label: i + 1,
        value: i + 1,
      });
    }
    this.setState({
      numbersOption: arr,
    });
    this.onLoad();
  }

  onLoad = async () => {
    let allClientArr = [],
      allLookupValue = [],
      allServiveArr = [],
      allAppointmentType = [],
      allLanguageArr = [],
      allJobType = [],
      allCountryList = [],
      allGenterType = [];
    allClientArr = await getClientInfo();
    // console.log("All Client array >>>>", allClientArr);

    allLookupValue = await getLookUpDataFromAPI();
    // console.log("All Lookupdata", allLookupValue);
    allLookupValue.SERVICE_CATEGORY_TYPE.map((data) => {
      allServiveArr.push({
        label: data.name,
        value: data.id,
      });
    });

    allLookupValue.ON_DEMAND_TYPE.map((data) => {
      if (data.id === 66) {
        allAppointmentType.push({
          label: (
            <div>
              <img
                src={ImageName.IMAGE_NAME.VRI_ICON}
                height="30px"
                width="25px"
                style={{ float: "Left" }}
              />
              <span style={{ paddingLeft: "5%" }}>{data.name}</span>
            </div>
          ),
          value: data.id,
        });
      } else if (data.id === 67) {
        allAppointmentType.push({
          label: (
            <div>
              <img
                src={ImageName.IMAGE_NAME.OPI_ICON}
                height="30px"
                width="25px"
                style={{ float: "Left" }}
              />
              <span style={{ paddingLeft: "5%" }}>{data.name}</span>
            </div>
          ),
          value: data.id,
        });
      }
    });

    allLookupValue.INDUSTRY_TYPE.map((data) => {
      allJobType.push({
        label: data.name,
        value: data.id,
        imagePath: data.others,
      });
    });

    allLookupValue.GENDER_TYPE.map((data) => {
      allGenterType.push({
        label: data.name,
        value: data.id,
      });
    });

    allLanguageArr = await getLanguageArray();

    let resCountry = await getCountryList();
    // console.log("Country List>>>>>", resCountry);
    resCountry.map((data) => {
      allCountryList.push({
        label: data.name,
        value: data.id,
      });
    });

    this.setState({
      allClientArr: allClientArr,
      allServiveArr: allServiveArr,
      allAppointmentType: allAppointmentType,
      allLanguage: allLanguageArr,
      allJobType: allJobType,
      allCountryOption: allCountryList,
      allGenderOption: allGenterType,
      isLoad: false,
    });
  };

  getLEIdata = async (data) => {
    let arr = [];
    let res = await ApiCall("fetchLeiByClient", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(res.data.payload);
      // console.log("PAyload>>>", payload.data);
      if (payload.data.leiList.length > 0) {
        payload.data.leiList.map((ldata) => {
          arr.push({
            label: ldata.name,
            value: ldata.userId,
          });
        });
      }
      this.setState({
        allLeiList: payload.data.leiList,
        leiOptionList: arr,
        clientIDforLei: data,
      });
    }
  };

  getClientData = async (value) => {
    let data = {
      clientid: value.value,
    },
      allClientDept = [],
      userInfo = [];
    let res = await ApiCall("fetchclientinfo", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      // console.log("Client Data>>>>>>>", payload);
      if (payload.data.length > 0) {
        if (payload.data[0].userInfo && payload.data[0].userInfo.length > 0) {
          userInfo = payload.data[0].userInfo[0];
          this.setState({
            clientName: userInfo.clientName,
            clientPhone: userInfo.adminPhone,
          });
        }
      }
    }

    let deptRes = await ApiCall("fetchselectedclientdeptinfo", data);
    if (
      deptRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      deptRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(deptRes.data.payload);
      let deptInfo = payload.data.deptinfo;

      for (let i = 0; i < deptInfo.length; i++) {
        allClientDept.push({
          label: deptInfo[i].department,
          value: deptInfo[i].id,
        });
      }
    }

    this.setState({
      allClientDepartment: allClientDept,
    });
  };

  getRequesterData = async (val) => {
    let requesterArr = [];
    consoleLog("clientId:::", val);
    let obj = {
      clientId: val,
    };
    let deptRes = await ApiCall("getRequestorByClient", obj);
    if (
      deptRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      deptRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(deptRes.data.payload);
      consoleLog("requesterData", payload.data);
      if (payload.data.requestorList) {
        payload.data.requestorList.map((obj) => {
          requesterArr.push({
            label: obj.name,
            value: obj.userId,
          });
        });

        this.setState({
          allRequesterArr: requesterArr,
        });
      }
    }
  };

  clientChange = (value) => {
    // console.log("selected Client",value);
    this.setState({
      selectedClient: value,
      client: value.value,
      selectedClientDepartment: [],
      clientDepartment: [],
    });

    let data = {
      clientId: value.value,
    };

    this.getLEIdata(data);
    this.getRequesterData(value.value)
    this.getClientData(value);
  };
  requesterChange = (val) => {
    this.setState({
      selectedRequester: val,
    });
  };

  onClientDepartmentChange = (option) => {
    let arr = [];

    option.map((obj) => {
      arr.push(obj.value);
    });

    this.setState({
      selectedClientDepartment: option,
      clientDepartment: arr,
    });
  };

  refreshLEIdata = () => {
    if (this.state.client !== 0) {
      let obj = {
        clientId: this.state.client,
      };
      // consoleLog("Client : ", this.state.client)

      this.getLEIdata(obj);
    } else {
      toast.error(AlertMessage.MESSAGE.CLIENT.CLIENT_NOT_SELECTED);
    }
  };

  appointmentTypeChange = (value) => {
    this.setState({
      selectedAppointmentType: value,
      appointmentType: value.value,
      interpreterCheckIn: false,
      locationData: {},
      locationArr: [],
      onsiteContact: "",
      onSiteContactPhone: "+" + 1 + " ",
    });
  };

  sourceLanguageChange = (value) => {
    // console.log("selected Source Language",value);
    this.setState({
      selectedSourceLanguage: value,
      sourceLanguage: value.value,
    });
  };

  targetLanguageChange = (value) => {
    // console.log("selected Client",value);
    let arr = [];
    let dd = value.value;
    arr.push(dd);
    this.setState({
      selectedTargetLanguage: value,
      targetLanguage: arr,
    });
  };

  requiredInterpreterChange = (value) => {
    // console.log("selected Client",value);
    this.setState({
      selectedRequiredInterpreter: value,
      interpreterRequiredNumber: value.value,
    });
  };

  interpreterCheckIn = (e) => {
    // console.log("e.target.value", e.target.value);
    if (e.target.value === "yes") {
      this.setState({
        interpreterCheckIn: true,
        onsiteContact: this.state.clientName,
        onSiteContactPhone: "+1" + " " + this.state.clientPhone,
      });
    } else {
      this.setState({
        interpreterCheckIn: false,
        onsiteContact: "",
        onSiteContactPhone: "+1",
      });
    }
  };

  otherServiceRadioChange = (e) => {
    // console.log("e.target.value", e.target.value);
    if (e.target.value === "yes") {
      this.setState({
        otherServices: true,
      });
    } else {
      this.setState({
        otherServices: false,
      });
    }
  };

  otherServicesDataChange = (e) => {
    this.setState({
      otherServicesData: e.target.value,
    });
  };

  jobTypeChange = (value) => {
    // console.log("selected Client",value);
    this.setState({
      jobType: value.value,
      imagePath: IMAGE_PATH_ONLY + value.imagePath,
    });
  };

  onJobNotesChange = (e) => {
    this.setState({
      jobNotes: e.target.value,
    });
  };

  decimalValue = (text) => {
    const validated = text.match(/^(\d*\.{0,1}\d{0,2}$)/);
    return validated;
  };

  jobDurationValueChange = (e) => {
    let text = this.decimalValue(e.target.value);
    if (text) {
      this.setState({
        jobDurationValue: e.target.value,
      });
    }
  };

  jobDurationLimitChange = (value) => {
    this.setState({
      selectedJobDuration: value,
      jobDurationLimit: value.value,
    });
  };

  appointmentsNotesChange = (e) => {
    this.setState({
      appointmentNotes: e.target.value,
    });
  };

  appointmentdateChange = (e) => {
    this.setState({
      appointmentDate: e.target.value,
    });
  };

  hourChange = () => {
    let hr = parseInt(this.state.hour) + 1;
    if (parseInt(this.state.hour) + 1 > 12) {
      this.setState({
        hour: "01",
      });
    } else {
      if (parseInt(this.state.hour) + 1 > 9) {
        this.setState({
          hour: hr,
        });
      } else {
        this.setState({
          hour: "0" + hr,
        });
      }
    }
  };

  minChange = () => {
    let min = parseInt(this.state.min) + 1;
    if (parseInt(this.state.min) + 1 > 59) {
      this.setState({
        min: "00",
      });
    } else {
      if (parseInt(this.state.min) + 1 > 9) {
        this.setState({
          min: min,
        });
      } else {
        this.setState({
          min: "0" + min,
        });
      }
    }
  };

  ampmChange = () => {
    if (this.state.ampm === "AM") {
      this.setState({
        ampm: "PM",
      });
    } else {
      this.setState({
        ampm: "AM",
      });
    }
  };

  onLocationInputChange = async (val) => {
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

  onLocationChange = (value) => {
    this.setState({
      locationData: value,
    });
  };

  onSiteContactNameChange = (e) => {
    this.setState({
      onsiteContact: e.target.value,
    });
  };

  siteContactPhoneChange = (e) => {
    // this.setState({
    //     onSiteContactPhone: e.target.value
    // })
    let value = e.target.value;
    if (numberValidator(value) === true) {
      if (mobileNumberValidator(value) === true) {
        let phoneCheck = phoneNumberCheck(value);
        if (phoneCheck) {
          this.setState({
            onSiteContactPhone: phoneCheck,
          });
        }
      }
    }
  };

  countrySpecific = (e) => {
    if (e.target.value === "yes") {
      this.setState({
        countrySpecificDialect: true,
      });
    } else {
      this.setState({
        countrySpecificDialect: false,
      });
    }
  };

  prefferedInterpreter = (e) => {
    if (e.target.value === "yes") {
      this.setState({
        havePrefferedInterpreter: true,
      });
    } else {
      this.setState({
        havePrefferedInterpreter: false,
      });
    }
  };

  leiChange = (value) => {
    // console.log("selected Client",value);
    this.setState({
      selectedLei: value,
      leiId: value.value,
    });

    this.state.allLeiList.map((data) => {
      if (data.userId === value.value) {
        let gender = {},
          genderTypeId = "",
          language = {};

        this.state.allGenderOption.map((gn) => {
          if (gn.value === data.genderTypeId) {
            gender = {
              label: gn.label,
              value: gn.value,
            };
          }
        });

        this.state.allLanguage.map((ln) => {
          if (ln.value === data.languageId) {
            language = {
              label: ln.label,
              value: ln.value,
            };
          }
        });

        if (data.genderTypeId != null || data.genderTypeId != undefined) {
          genderTypeId = data.genderTypeId;
        }

        this.setState({
          leiDob: data.dob === "" || data.dob === null ? "" : SetUSAdateFormatV2(data.dob),
          leiPhone: "+" + data.countryCode + " " + data.mobile,
          leiReference: data.reference,
          leiEmail: data.email,
          leiLanguage: data.languageId,
          leiGender: genderTypeId,
          selectedLeiGender: gender,
          selectedLeiLanguage: language,
          leiCountryCode: data.countryCode,
          countrySpecificDialect: true,
          havePrefferedInterpreter: false,
        });
      }
    });
  };

  onLeiAdd = () => {
    // return history.push("/adminAddClientContact");
    var newWindow = window.open("/adminAddLEI");
    newWindow.clientId = this.state.client;
  };

  onDateChange = () => {
    let d = new Date(Date.now());
    // let dd = d.now();
    let dd = d.getDate();
    dd = dd > 9 ? dd : "0" + dd;
    let mm = d.getMonth() + 1;
    mm = mm > 9 ? mm : "0" + mm;
    let yyyy = d.getFullYear();
    let finalStr = mm + "-" + dd + "-" + yyyy;
    return finalStr;
    // console.log("ddtime ::", mm + "-" + dd + "-" + yyyy)

  }

  onSubmit = async () => {
    let authData = localStorage.getItem("AuthToken");
    let authUser = Decoder.decode(authData);
    let errorCounter = 0,
      validateClient = inputEmptyValidate(this.state.selectedClient.value),
      validateAppointmentType = inputEmptyValidate(this.state.appointmentType),
      validateJobType = inputEmptyValidate(this.state.jobType),
      validateNoOfInterpreter = inputEmptyValidate(
        this.state.interpreterRequiredNumber
      ),
      validateSourceLanguage = inputEmptyValidate(this.state.sourceLanguage),
      validateTargetLanguage = inputEmptyValidate(this.state.targetLanguage),
      validateleiId = inputEmptyValidate(this.state.leiId),
      validateDate = inputEmptyValidate(this.state.appointmentDate),

      validateRequester = inputEmptyValidate(this.state.selectedRequester.value),
      validateJobDuration = inputEmptyValidate(this.state.jobDurationValue),
      validateOnsiteContactName = inputEmptyValidate(this.state.onsiteContact);

    if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT || authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT_CONTACT) {
      if (!validateRequester) {
        toast.error("Please select a Requester");
        errorCounter++;
        return false;
      } else if (this.state.clientDepartment.length == 0) {
        toast.error("Please select a department");
        errorCounter++;
        return false;
      } else if (!validateAppointmentType) {
        toast.error("Please select appointment type");
        errorCounter++;
        return false;
      } else if (!validateJobType) {
        toast.error("Please select job type");
        errorCounter++;
        return false;
      } else if (!validateNoOfInterpreter) {
        toast.error("Please select no of interpreter");
        errorCounter++;
        return false;
      } else if (!validateSourceLanguage) {
        toast.error("Please select source language");
        errorCounter++;
        return false;
      } else if (!validateTargetLanguage) {
        toast.error("Please select target language");
        errorCounter++;
        return false;
      } else if (!validateJobDuration) {
        toast.error("Please input job duration");
        errorCounter++;
        return false;
      } else if (!validateleiId) {
        toast.error("Please select LEI");
        errorCounter++;
        return false;
      }
      //  else if (!validateOnsiteContactName) {
      //   toast.error("Please enter onsite contact");
      //   errorCounter++;
      // } else if (this.state.onSiteContactPhone.substring(3, 15) === "") {
      //   toast.error("Please enter onsite contact phone");
      //   errorCounter++;
      // }
    }

    if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN || authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.ADMIN_STAFF) {
      if (!validateClient) {
        toast.error("Please select a client");
        errorCounter++;
        return false;
      } else if (!validateRequester) {
        toast.error("Please select a Requester");
        errorCounter++;
        return false;
      } else if (this.state.clientDepartment.length == 0) {
        toast.error("Please select a department");
        errorCounter++;
        return false;
      } else if (!validateAppointmentType) {
        toast.error("Please select appointment type");
        errorCounter++;
        return false;
      } else if (!validateJobType) {
        toast.error("Please select job type");
        errorCounter++;
        return false;
      } else if (!validateNoOfInterpreter) {
        toast.error("Please select no of interpreter");
        errorCounter++;
        return false;
      } else if (!validateSourceLanguage) {
        toast.error("Please select source language");
        errorCounter++;
        return false;
      } else if (!validateTargetLanguage) {
        toast.error("Please select target language");
        errorCounter++;
        return false;
      } else if (!validateJobDuration) {
        toast.error("Please input job duration");
        errorCounter++;
        return false;
      }
      // else if (!validateOnsiteContactName) {
      //   toast.error("Please enter onsite contact");
      //   errorCounter++;
      // } else if (this.state.onSiteContactPhone.substring(3, 15) === "") {
      //   toast.error("Please enter onsite contact phone");
      //   errorCounter++;
      // } 
      else if (!validateleiId) {
        toast.error("Please select LEI");
        errorCounter++;
        return false;
      }
    }

    if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT || authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT_CONTACT) {
      if (errorCounter === 0) {
        let finalData = {
          clientId: authUser.data.userid,
          appointmentType: this.state.appointmentType.toString(),
          jobType: this.state.jobType.toString(),
          noOfInterpreter: this.state.interpreterRequiredNumber.toString(),
          note: this.state.jobNotes,
          sourceLanguage: this.state.sourceLanguage.toString(),
          targetLanguage: this.state.targetLanguage,
          interpreterNote: this.state.appointmentNotes,
          appointmentLocation: "",
          locationLat: null,
          locationLng: null,
          duration:
            this.state.jobDurationValue + " " + this.state.jobDurationLimit,
          scheduledDate: SetDatabaseDateFormat(this.onDateChange()),
          scheduledTime: SetTimeMinSecFormat(Date.now()),
          siteContact: this.state.onsiteContact,
          siteContactMobile: this.state.onSiteContactPhone.substring(3, 15),
          leiId: this.state.leiId.toString(),
          leiDOB: SetDatabaseDateFormat(this.state.leiDob),
          leiCountryCode: this.state.leiCountryCode,
          leiMobile: this.state.leiPhone.substring(3, 15),
          leiEmail: this.state.leiEmail,
          leiGender: this.state.leiGender,
          leiReference: this.state.leiReference,
          leiCountry: this.state.leiCountry.toString(),
          leiPreferredLanguage: this.state.leiLanguage,
          countryDialect: this.state.countrySpecificDialect ? "1" : "0",
          interpreterCheck: this.state.interpreterCheckIn ? "1" : "0",
          otherServices: this.state.otherServices ? "1" : "0",
          otherServicesData: this.state.otherServicesData,
          clientDepartment: this.state.clientDepartment,

          requester: this.state.selectedRequester.value,
          timeZone : this.state.currentTimeZone
        };

        // console.log("Final Submit data >>>>>", finalData);

        let res = await ApiCall("createInterPretationJobFromAdmin", finalData);
        if (
          res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          toast.success("Job request successfully");
          return history.push("/clientAllJobsMain");
        } else {
          toast.error(res.message);
        }
      }
    } else if (
      authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN || authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.ADMIN_STAFF
    ) {
      if (errorCounter === 0) {
        let finalData = {
          clientId: this.state.client,
          appointmentType: this.state.appointmentType.toString(),
          jobType: this.state.jobType.toString(),
          noOfInterpreter: this.state.interpreterRequiredNumber.toString(),
          note: this.state.jobNotes,
          sourceLanguage: this.state.sourceLanguage.toString(),
          targetLanguage: this.state.targetLanguage,
          interpreterNote: this.state.appointmentNotes,
          appointmentLocation: "",
          locationLat: null,
          locationLng: null,
          duration:
            this.state.jobDurationValue + " " + this.state.jobDurationLimit,
          scheduledDate: SetDatabaseDateFormat(this.onDateChange()),
          scheduledTime: SetTimeMinSecFormat(Date.now()),
          siteContact: this.state.onsiteContact,
          siteContactMobile: this.state.onSiteContactPhone.substring(3, 15),
          leiId: this.state.leiId.toString(),
          leiDOB: SetDatabaseDateFormat(this.state.leiDob),
          leiCountryCode: this.state.leiCountryCode,
          leiMobile: this.state.leiPhone.substring(3, 15),
          leiEmail: this.state.leiEmail,
          leiGender: this.state.leiGender,
          leiReference: this.state.leiReference,
          leiCountry: this.state.leiCountry.toString(),
          leiPreferredLanguage: this.state.leiLanguage,
          countryDialect: this.state.countrySpecificDialect ? "1" : "0",
          interpreterCheck: this.state.interpreterCheckIn ? "1" : "0",
          otherServices: this.state.otherServices ? "1" : "0",
          otherServicesData: this.state.otherServicesData,
          clientDepartment: this.state.clientDepartment,
          requester: this.state.selectedRequester.value,
          timeZone : this.state.currentTimeZone
        };

        console.log("Final Submit data >>>>>", finalData);

        let res = await ApiCall("createInterPretationJobFromAdmin", finalData);
        if (
          res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          toast.success("Job request successfully");
          return history.push("/adminViewAllJobs");
        } else {
          toast.error(res.message);
        }
      }
    }
  };

  submitResetBtn = () => {
    this.setState({
      imagePath: ImageName.IMAGE_NAME.PROFILE_PIC,
      selectedRequester: {},
      selectedClient: {},
      allRequesterArr: [],
      client: 0,
      selectedAppointmentType: {},
      appointmentType: "",
      selectedTargetLanguage: {},
      targetLanguage: [],
      selectedRequiredInterpreter: {
        label: 1,
        value: 1,
      },
      interpreterRequiredNumber: 1,
      interpreterCheckIn: false,
      jobType: "",
      jobNotes: "",
      appointmentNotes: "",
      appointmentDate: "",
      hour: "08",
      min: "00",
      ampm: "AM",
      locationData: {},
      locationArr: [],
      onsiteContact: "",
      onSiteContactPhone: "+" + 1 + " ",
      allLeiList: [],
      leiOptionList: [],
      selectedLei: {},
      leiId: "",
      leiDob: "",
      leiEmail: "",
      leiPhone: "",
      leiCountryCode: "",
      leiGender: "",
      leiReference: "",
      leiCountry: 231,
      leiLanguage: "",
      leiNote: "",
      allGenderOption: [],
      selectedLeiGender: {},
      selectedLeiLanguage: {},
      jobDurationValue: 1,
      allJobDuration: jobDuration,
      selectedJobDuration: {
        label: "Hour",
        value: "Hour",
      },
      jobDurationLimit: "Hour",
      clientName: "",
      clientPhone: "",
      otherServices: true,
      otherServicesData: "",
      selectLocation: {},
      allClientDepartment: [],
      selectedClientDepartment: [],
      clientDepartment: [],
      clientIDforLei: "",
      selectedJobType: {}
    })
  }

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
    return (
      <React.Fragment>
        <ToastContainer hideProgressBar theme="colored" />
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>
        <div className="component-wrapper" hidden={this.state.isLoad}>
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "3%" }}
          >
            {" "}
            <Link to={this.state.userType === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN ? "/adminDashboard" : "/clientDashboard"}>Dashboard</Link> / Create OnDemand
            Interpretation Job
          </div>
          <div className="create-new-job-wrap">
            <div className="main-container">
              <div className="createform-box sdw _fl">
                <div className="create-head">
                  <div className="row">
                    <div className="col-md-6">
                      <h2>
                        <Link
                          to={this.state.userType == UsersEnums.APPLICATION_ROLE.SUPER_ADMIN ? "/adminDashboard" : "/clientDashboard"}

                          style={{ textDecoration: "none" }}
                        >
                          Create new job (INTERPRETATION)
                        </Link>
                      </h2>
                    </div>
                    <div className="col-md-6">
                      <div className="web_btn f-right">
                        <a href="javascript:void(0)" style={{ textDecoration: "none" }} onClick={() => this.submitResetBtn()}>
                          RESET
                        </a>
                        <a
                          href="javascript:void(0)"
                          style={{ textDecoration: "none" }}
                          className="blue"
                          onClick={() => {
                            this.onSubmit();
                          }}
                        >
                          SUBMIT
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="create-jeneral-wrap _fl">
                  <div className="create-jeneral-info sdw _fl">
                    <div className="create-sb-head">
                      <div className="row">
                        <div className="col-md-6">
                          <h3>GENERAL INFORMATION</h3>
                        </div>
                      </div>
                    </div>
                    <div className="create-row-app">
                      <div className="row">
                        <div className="col-md-6 wt-left">
                          <div className="web-form-app">
                            {this.state.userType ===
                              UsersEnums.APPLICATION_ROLE.CLIENT ? (
                              <React.Fragment />
                            ) : (
                              <React.Fragment>
                                <div className="web-form-bx">
                                  <div className="frm-label">Client *</div>
                                  <div className="bts-drop">
                                    <SelectBox
                                      optionData={this.state.allClientArr}
                                      value={this.state.selectedClient}
                                      onSelectChange={(value) =>
                                        this.clientChange(value)
                                      }
                                    // isDisabled = {true}
                                    ></SelectBox>
                                  </div>
                                </div>
                              </React.Fragment>
                            )}
                            <div className="web-form-bx">
                              <div className="frm-label">Requester *</div>
                              <div className="bts-drop">
                                <SelectBox
                                  optionData={this.state.allRequesterArr}
                                  value={this.state.selectedRequester}
                                  onSelectChange={(value) =>
                                    this.requesterChange(value)
                                  }
                                // isDisabled = {true}
                                ></SelectBox>
                              </div>
                            </div>
                            <div className="web-form-bx">
                              <div className="frm-label">Department *</div>
                              <div className="bts-drop">
                                <MultiSelectBox
                                  optionData={this.state.allClientDepartment}
                                  value={this.state.selectedClientDepartment}
                                  onSelectChange={(value) =>
                                    this.onClientDepartmentChange(value)
                                  }
                                ></MultiSelectBox>
                              </div>
                            </div>
                            <div className="web-form-bx">
                              <div className="frm-label">
                                Appointment Type *
                              </div>
                              <div className="bts-drop">
                                <SelectBox
                                  optionData={this.state.allAppointmentType}
                                  value={this.state.selectedAppointmentType}
                                  onSelectChange={(value) =>
                                    this.appointmentTypeChange(value)
                                  }
                                ></SelectBox>
                              </div>
                            </div>
                            <div className="web-form-bx">
                              <div className="frm-label">Source Language *</div>
                              <div className="bts-drop">
                                <SelectBox
                                  optionData={this.state.allLanguage}
                                  value={this.state.selectedSourceLanguage}
                                  onSelectChange={(value) =>
                                    this.sourceLanguageChange(value)
                                  }
                                  isDisabled={true}
                                ></SelectBox>
                              </div>
                            </div>
                            <div className="web-form-bx">
                              <div className="frm-label">Target Language *</div>
                              <div className="bts-drop">
                                <SelectBox
                                  optionData={this.state.allLanguage}
                                  value={this.state.selectedTargetLanguage}
                                  onSelectChange={(value) =>
                                    this.targetLanguageChange(value)
                                  }
                                ></SelectBox>
                              </div>
                            </div>
                            <div
                              className="web-form-bx md4"
                              style={{ width: "60%" }}
                            >
                              <div className="frm-label">
                                No. of Interpreters required *
                              </div>
                              <div className="bts-drop">
                                <SelectBox
                                  optionData={this.state.numbersOption}
                                  value={this.state.selectedRequiredInterpreter}
                                  onSelectChange={(value) =>
                                    this.requiredInterpreterChange(value)
                                  }
                                ></SelectBox>
                              </div>
                            </div>
                            {/* <div className="web-form-bx">
                                                            <div className="frm-label">Will the interpreter check-in with you at the time of interpretation ?</div>
                                                            <div className="check-field">
                                                                <label className="checkbox_btn">
                                                                    {this.state.interpreterCheckIn ?
                                                                        <input type="radio" name="radio1" checked={true} value="yes" onChange={this.interpreterCheckIn} /> :
                                                                        <input type="radio" name="radio1" checked={false} value="yes" onChange={this.interpreterCheckIn} />}
                                                                    <span className="checkmark3"></span> Yes</label>
                                                            </div>
                                                            <div className="check-field">
                                                                <label className="checkbox_btn">
                                                                    {this.state.interpreterCheckIn ?
                                                                        <input type="radio" name="radio1" checked={false} value="no" onChange={this.interpreterCheckIn} /> :
                                                                        <input type="radio" name="radio1" checked={true} value="no" onChange={this.interpreterCheckIn} />}
                                                                    <span className="checkmark3"></span> No</label>
                                                            </div>
                                                        </div> */}
                          </div>
                        </div>
                        <div className="col-md-6 wt-right">
                          <div className="web-form-app">
                            <div
                              className="pic-data"
                              style={{ marginLeft: "20%" }}
                            >
                              <div className="c-logo">
                                <img
                                  className="border_50_img"
                                  src={this.state.imagePath}
                                />
                                {/* <button className="pht" >
                                                                    <input type="file" accept="image/*" />
                                                                </button> */}
                              </div>
                            </div>
                            <div className="web-form-bx md4">
                              <div className="frm-label">Job Type *</div>
                              <div className="bts-drop">
                                <SelectBox
                                  optionData={this.state.allJobType}
                                  onSelectChange={(value) =>
                                    this.jobTypeChange(value)
                                  }
                                ></SelectBox>
                              </div>
                            </div>
                            <div className="web-form-bx md4">
                              <div className="frm-label">
                                Notes for{" "}
                                <span style={{ color: "#00a0df" }}>
                                  7C Admin
                                </span>
                              </div>
                              <textarea
                                rows="2"
                                placeholder=""
                                className="in-textarea msg min"
                                // value={this.state.message}
                                style={{
                                  height: "100px",
                                  color: "var(--grey)",
                                  borderRadius: "10px",
                                  boxShadow: "2px",
                                  resize: "none",
                                }}
                                onChange={this.onJobNotesChange}
                              ></textarea>
                            </div>
                            <div className="web-form-bx">
                              <div className="frm-label">
                                Timezone
                              </div>
                              <div className="form-input-fields">
                                <input
                                  type="text"
                                  placeholder="Enter notes here..."
                                  className="textbox4"
                                  style={{
                                    borderRadius: "9px",
                                    boxShadow:
                                      "0px 0px 4px 0px rgb(0 0 0 / 20%)",
                                  }}
                                  value={this.state.currentTimeZone}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="create-jeneral-info sdw _fl margin-top-30">
                    <div className="create-sb-head">
                      <div className="row">
                        <div className="col-md-6">
                          <h3>Job Details</h3>
                        </div>
                      </div>
                    </div>
                    <div className="create-row-app">
                      <div className="row">
                        <div className="col-md-6 wt-left">
                          <div className="web-form-app">
                            {this.state.appointmentType !== "" ? (
                              <React.Fragment>
                                {this.state.appointmentType !== 63 ? (
                                  <div className="web-form-bx">
                                    <div className="frm-label">
                                      Will you use <span style={{ color: "#00a0df" }}>7C Lingo</span> voice/video services for
                                      this job ? *
                                    </div>
                                    <div className="check-field">
                                      <label className="checkbox_btn">
                                        {this.state.otherServices ? (
                                          <input
                                            type="radio"
                                            name="other_radio1"
                                            checked={true}
                                            value="yes"
                                            onChange={
                                              this.otherServiceRadioChange
                                            }
                                          />
                                        ) : (
                                          <input
                                            type="radio"
                                            name="other_radio1"
                                            checked={false}
                                            value="yes"
                                            onChange={
                                              this.otherServiceRadioChange
                                            }
                                          />
                                        )}
                                        <span className="checkmark3"></span> Yes
                                      </label>
                                    </div>
                                    <div className="check-field">
                                      <label className="checkbox_btn">
                                        {this.state.otherServices ? (
                                          <input
                                            type="radio"
                                            name="other_radio1"
                                            checked={false}
                                            value="no"
                                            onChange={
                                              this.otherServiceRadioChange
                                            }
                                          />
                                        ) : (
                                          <input
                                            type="radio"
                                            name="other_radio1"
                                            checked={true}
                                            value="no"
                                            onChange={
                                              this.otherServiceRadioChange
                                            }
                                          />
                                        )}
                                        <span className="checkmark3"></span> No
                                      </label>
                                    </div>
                                  </div>
                                ) : (
                                  <React.Fragment></React.Fragment>
                                )}
                              </React.Fragment>
                            ) : (
                              <React.Fragment></React.Fragment>
                            )}
                            <div className="web-form-bx">
                              <div className="frm-label">
                                Appointment Notes for Interpreter
                              </div>
                              <div className="form-input-fields">
                                <input
                                  type="text"
                                  placeholder="Enter notes here..."
                                  className="textbox4"
                                  style={{
                                    borderRadius: "9px",
                                    boxShadow:
                                      "0px 0px 4px 0px rgb(0 0 0 / 20%)",
                                  }}
                                  onChange={this.appointmentsNotesChange}
                                />
                              </div>
                            </div>
                            {/* <div className="web-form-bx">
                                                            <div className="frm-label">Appointment Date & Time</div>
                                                            <div className="form-input-fields unstyled">
                                                                <input type="date" id="from_datepicker" className="textbox4 d-icon" placeholder="10/25/2021" onChange={this.appointmentdateChange} style={{ borderRadius: "9px", boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)" }} />
                                                            </div>

                                                            <div className="t-time">
                                                                <span className="t1">
                                                                    <small>
                                                                        <input type="text" placeholder="" value={this.state.hour} className="tsd2" readonly /><br />
                                                                        <img src={ImageName.IMAGE_NAME.B_ARROW} alt="" style={{ cursor: "pointer" }} onClick={this.hourChange} />
                                                                    </small>
                                                                </span>
                                                                <span className="t2">
                                                                    <small>
                                                                        <input type="text" placeholder="" value={this.state.min} className="tsd2" readonly /><br />
                                                                        <img src={ImageName.IMAGE_NAME.B_ARROW} alt="" style={{ cursor: "pointer" }} onClick={this.minChange} />
                                                                    </small>
                                                                </span>
                                                                <span className="t3" style={{ marginLeft: "2%" }}>
                                                                    <small>
                                                                        <input type="text" placeholder="" value={this.state.ampm} className="tsd2" readonly /><br />
                                                                        <img src={ImageName.IMAGE_NAME.B_ARROW} alt="" style={{ cursor: "pointer" }} onClick={this.ampmChange} />
                                                                    </small>
                                                                </span>
                                                            </div>

                                                        </div> */}
                            {/* <div className="web-form-bx">
                                                            <div className="frm-label">Onsite Contact</div>
                                                            <input type="text" placeholder="Enter Name" className="in-field2" value={this.state.onsiteContact} onChange={this.onSiteContactNameChange} readOnly={this.state.interpreterCheckIn}  />
                                                        </div>
                                                        <div className="web-form-bx">
                                                            <div className="frm-label">Site Contact Phone Number</div>
                                                            <input type="text" value={this.state.onSiteContactPhone} placeholder="" className="in-field2" onChange={this.siteContactPhoneChange} readOnly={this.state.interpreterCheckIn}  />
                                                        </div> */}
                          </div>
                        </div>
                        <div className="col-md-6 wt-right">
                          <div className="web-form-app">
                            {/* <div className="web-form-bx">
                                                            <div className="frm-label">Appointment Location</div>
                                                            <div className="tr-3">
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
                                                                    styles={customStylesDropdown}
                                                                />
                                                            </div>
                                                        </div> */}
                            {this.state.appointmentType !== "" ? (
                              <React.Fragment>
                                {this.state.appointmentType !== 63 &&
                                  !this.state.otherServices ? (
                                  <div className="web-form-bx md4">
                                    <div className="frm-label">
                                      Meeting link (3rd party conference
                                      service) *
                                    </div>
                                    <textarea
                                      rows="2"
                                      placeholder=""
                                      className="in-textarea msg min"
                                      // value={this.state.message}
                                      style={{
                                        height: "100px",
                                        color: "var(--grey)",
                                        borderRadius: "10px",
                                        boxShadow: "2px",
                                        resize: "none",
                                      }}
                                      onChange={this.otherServicesDataChange}
                                    ></textarea>
                                  </div>
                                ) : (
                                  <React.Fragment></React.Fragment>
                                )}
                              </React.Fragment>
                            ) : (
                              <React.Fragment></React.Fragment>
                            )}
                            <div className="web-form-bx">
                              <div className="frm-label">Duration *</div>
                              <div
                                className=""
                                style={{ display: "inline-flex" }}
                              >
                                <div className="" style={{ width: "35%" }}>
                                  <input
                                    type="text"
                                    className="textbox4"
                                    style={{
                                      borderRadius: "9px",
                                      boxShadow:
                                        "0px 0px 4px 0px rgb(0 0 0 / 20%)",
                                    }}
                                    value={this.state.jobDurationValue}
                                    onChange={this.jobDurationValueChange}
                                  />
                                </div>
                                <div
                                  className=""
                                  style={{ width: "50%", paddingLeft: "20px" }}
                                >
                                  <div className="bts-drop">
                                    <SelectBox
                                      optionData={this.state.allJobDuration}
                                      value={this.state.selectedJobDuration}
                                      onSelectChange={(value) =>
                                        this.jobDurationLimitChange(value)
                                      }
                                    ></SelectBox>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="web-form-bx">
                              {/* <div className="frm-label">Any Qualification Required</div>
                                                            <div className="bts-drop">
                                                                <SelectBox>

                                                                </SelectBox>
                                                            </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="create-jeneral-info sdw _fl margin-top-30">
                    <div className="create-sb-head">
                      <div className="row">
                        <div className="col-md-6">
                          <h3>Limited English Individual Information (lei)</h3>
                        </div>
                      </div>
                    </div>
                    <div className="create-row-app">
                      <div className="row">
                        <div className="col-md-6 wt-left">
                          <div className="web-form-app">
                            <div className="web-form-bx">
                              <div className="frm-label">
                                Limited English Individual (LEI) *
                              </div>
                              <div className="">
                                <div
                                  className=""
                                  style={{ paddingRight: "5%", width: "88%" }}
                                >
                                  <div className="bts-drop">
                                    <SelectBox
                                      optionData={this.state.leiOptionList}
                                      value={this.state.selectedLei}
                                      onSelectChange={(value) =>
                                        this.leiChange(value)
                                      }
                                    ></SelectBox>
                                  </div>
                                </div>
                                <div className="">
                                  {this.state.userType ===
                                    UsersEnums.APPLICATION_ROLE.CLIENT ? (
                                    <React.Fragment />
                                  ) : (
                                    <React.Fragment>
                                      <button
                                        className="reset_lei"
                                        onClick={() => {
                                          this.refreshLEIdata();
                                        }}
                                      >
                                        Refresh
                                      </button>
                                      <button
                                        className="addnew_lei"
                                        onClick={() => {
                                          this.onLeiAdd();
                                        }}
                                      >
                                        Add New
                                      </button>
                                    </React.Fragment>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* <div className="web-form-bx">
                              <div className="frm-label">
                                Is there a country specific dialect required ?
                              </div>
                              <div className="check-field">
                                <label className="checkbox_btn">
                                  {this.state.countrySpecificDialect ? (
                                    <input
                                      type="radio"
                                      name="radio"
                                      checked={true}
                                      value="yes"
                                      onChange={this.countrySpecific}
                                      disabled
                                    />
                                  ) : (
                                    <input
                                      type="radio"
                                      name="radio"
                                      checked={false}
                                      value="yes"
                                      onChange={this.countrySpecific}
                                      disabled
                                    />
                                  )}
                                  <span className="checkmark3"></span> Yes
                                </label>
                              </div>
                              <div className="check-field">
                                <label className="checkbox_btn">
                                  {this.state.countrySpecificDialect ? (
                                    <input
                                      type="radio"
                                      name="radio"
                                      checked={false}
                                      value="no"
                                      onChange={this.countrySpecific}
                                      disabled
                                    />
                                  ) : (
                                    <input
                                      type="radio"
                                      name="radio"
                                      checked={true}
                                      value="no"
                                      onChange={this.countrySpecific}
                                      disabled
                                    />
                                  )}
                                  <span className="checkmark3"></span> No
                                </label>
                              </div>
                            </div> */}
                            <div className="web-form-bx">
                              <div className="frm-label">LEI Phone Number</div>
                              <input
                                type="text"
                                value={this.state.leiPhone}
                                placeholder=""
                                className="in-field2"
                                readonly
                              />
                            </div>
                            <div className="web-form-bx">
                              <div className="frm-label">
                                Gender Preference (If any)
                              </div>
                              <div className="bts-drop">
                                <SelectBox
                                  optionData={this.state.allGenderOption}
                                  value={this.state.selectedLeiGender}
                                  // onSelectChange={(value) => this.leiChange(value)}
                                  isDisabled={true}
                                ></SelectBox>
                              </div>
                            </div>
                            <div className="web-form-bx">
                              <div className="frm-label">
                                LEI Country of Origin
                              </div>
                              <div className="bts-drop">
                                <SelectBox
                                  optionData={this.state.allCountryOption}
                                  value={this.state.selectedCountry}
                                  // onSelectChange={(value) => this.leiChange(value)}
                                  isDisabled={true}
                                ></SelectBox>
                              </div>
                            </div>
                            {/* <div className="web-form-bx">
                                                            <div className="frm-label">Notes for <i>7C Admin</i></div>
                                                            <div className="form-input-fields">
                                                                <textarea placeholder="......." className="in-textarea msg min"></textarea>
                                                            </div>
                                                        </div> */}
                          </div>
                        </div>
                        <div className="col-md-6 wt-right">
                          <div className="web-form-app">
                            <div className="web-form-bx">
                              <div className="frm-label">LEI Date of Birth</div>
                              {/* <div className="form-input-fields unstyled">
                                <input
                                  type="date"
                                  id="datepicker2"
                                  className="textbox4 d-icon"
                                  placeholder="10/25/2021"
                                  value={this.state.leiDob}
                                  disabled={true}
                                  style={{
                                    borderRadius: "9px",
                                    boxShadow:
                                      "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                  }}
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
                                  <span>{this.state.leiDob}</span>
                                </div>
                                <div style={{ width: "20%" }}>
                                  <a style={{ float: "right" }}>
                                    <DatePicker
                                      customInput={<Schedule />}
                                      disabled={true}
                                    />
                                  </a>
                                </div>
                              </div>
                            </div>
                            {/* <div className="web-form-bx">
                              <div className="frm-label">
                                Would you like to have preffered interpreter?
                              </div>
                              <div className="check-field">
                                <label className="checkbox_btn">
                                  {this.state.havePrefferedInterpreter ? (
                                    <input
                                      type="radio"
                                      name="radio_in"
                                      value="yes"
                                      checked={true}
                                      onChange={this.prefferedInterpreter}
                                      disabled
                                    />
                                  ) : (
                                    <input
                                      type="radio"
                                      name="radio_in"
                                      value="yes"
                                      checked={false}
                                      onChange={this.prefferedInterpreter}
                                      disabled
                                    />
                                  )}
                                  <span className="checkmark3"></span> Yes
                                </label>
                              </div>
                              <div className="check-field">
                                <label className="checkbox_btn">
                                  {this.state.havePrefferedInterpreter ? (
                                    <input
                                      type="radio"
                                      name="radio_in"
                                      value="no"
                                      checked={false}
                                      onChange={this.prefferedInterpreter}
                                      disabled
                                    />
                                  ) : (
                                    <input
                                      type="radio"
                                      name="radio_in"
                                      value="no"
                                      checked={true}
                                      onChange={this.prefferedInterpreter}
                                      disabled
                                    />
                                  )}
                                  <span className="checkmark3"></span> No
                                </label>
                              </div>
                            </div> */}
                            <div className="web-form-bx">
                              <div className="frm-label">LEI Email</div>
                              <input
                                type="text"
                                value={this.state.leiEmail}
                                placeholder="LEI Email"
                                className="in-field2"
                                readonly
                              />
                            </div>
                            <div className="web-form-bx">
                              <div className="frm-label">
                                LEI Reference Number (MRN,Client ID or Other)
                              </div>
                              <input
                                type="text"
                                value={this.state.leiReference}
                                placeholder=""
                                className="in-field2"
                                readonly
                              />
                            </div>
                            <div className="web-form-bx">
                              <div className="frm-label">
                                LEI Preferred Language
                              </div>
                              <div className="bts-drop">
                                <SelectBox
                                  optionData={this.state.allLanguage}
                                  value={this.state.selectedLeiLanguage}
                                  // onSelectChange={(value) => this.leiChange(value)}
                                  isDisabled={true}
                                ></SelectBox>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="m20">
                    <div className="text-center">
                      <button type="submit" className="cn_btn" onClick={() => this.submitResetBtn()}>
                        RESET
                      </button>
                      <button
                        type="submit"
                        className="sv_btn"
                        onClick={() => {
                          this.onSubmit();
                        }}
                      >
                        Submit
                      </button>
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
