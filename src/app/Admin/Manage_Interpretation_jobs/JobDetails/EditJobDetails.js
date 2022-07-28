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
  SetDateFormat,
  SetDOBFormat,
  SetScheduleDate,
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
  timeValidator,
} from "../../../../validators";
import { ToastContainer, toast } from "react-toastify";
import history from "../../../../history";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IMAGE_PATH_ONLY } from "../../../../services/config/api_url";
import ReactLoader from "../../../Loader";
import moment, { duration } from "moment";
import { timers } from "jquery";
import LotteLoader from "../../../Loader/LotteLoader";

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

export default class EditJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryCode: 1,
      imagePath: ImageName.IMAGE_NAME.PROFILE_PIC,
      numbersOption: [],
      allClientArr: [],
      selectedClient: {},
      allRequesterArr: [],
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

      jobType: {},
      jobNotes: "",
      appointmentNotes: "",
      appointmentDate: "",
      hour: "08",
      min: "00",
      ampm: "AM",
      locationData: {},
      locationArr: [],
      onsiteContact: "",
      onSiteContactPhone: "",
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
      selectLocation: {},
      allClientDepartment: [],
      selectedClientDepartment: [],
      clientDepartment: [],
      isLoad: true,
      clientId: "",

      reqId: "",
      interpreterSubType: ""
    };
  }

  componentDidMount() {
    let authData = localStorage.getItem("AuthToken");
    let authUser = Decoder.decode(authData);

    // ........................for client details.......................

    if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT) {
      this.getRequesterData(authUser.data.userid);
      this.setState({
        userType: UsersEnums.APPLICATION_ROLE.CLIENT,
      });
    } else if (
      authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN
    ) {
      this.setState({
        userType: UsersEnums.APPLICATION_ROLE.SUPER_ADMIN,
      });
    }

    // consoleLog("Client Id::", authUser.data.userid)
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

  onLoad = async () => {
    let authData = localStorage.getItem("AuthToken");
    let authUser = Decoder.decode(authData);
    let allClientArr = [],
      allLookupValue = [],
      allServiveArr = [],
      allAppointmentType = [],
      allLanguageArr = [],
      allJobType = [],
      allCountryList = [],
      allGenterType = [],
      jobDetailsRes = {},
      allClientObj = {},
      allDeptObj = [],
      serviceProviderObj = {},
      languageObj = {},
      targetLanguageArr = [],
      jobTypeObj = {},
      jobDurationObj = {},
      genderObj = {},
      countryObj = {},
      leiLangObj = {},
      leiIdObj = {},
      locationDataObj = {},
      contryCode = 0,
      deptResArr = [],
      allClientDept = [],
      userInfo = [],
      requesterObj = {},
      requesterArr = [],
      appointmentTypeObj = {};
    allClientArr = await getClientInfo();
    // console.log("All Client array >>>>", allClientArr);

    // ......props data......................
    // consoleLog("maindata", this.props.mainData);
    let editObj = {
      jobId: this.props.mainData,
    };

    this.setState({
      reqId: this.props.mainData,
    });

    // consoleLog("editObj",editObj)

    let editRes = await ApiCall("fetchJobDetails", editObj);

    if (
      editRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      editRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(editRes.data.payload);
      consoleLog("edit details payload", payload);
      jobDetailsRes = payload.data.jobDetails;

      allClientArr.map((obj) => {
        if (obj.value == jobDetailsRes.clientId) {
          allClientObj = {
            label: obj.label,
            value: obj.value,
          };
        }
      });

      if (jobDetailsRes.clientId == null) {
        jobDetailsRes.clientId = "";
      } else {
        let obj = {
          clientId: jobDetailsRes.clientId,
        };
        let deptRes = await ApiCall("getRequestorByClient", obj);
        if (
          deptRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          deptRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          let payload = Decoder.decode(deptRes.data.payload);
          // consoleLog("requesterData", payload.data);
          if (payload.data.requestorList != null || payload.data.requestorList != undefined) {
            payload.data.requestorList.map((obj) => {
              consoleLog("Requester Obj:", obj)
              requesterArr.push({
                label: obj.name,
                value: obj.userId,
              });
              if (jobDetailsRes.requester === obj.userId) {
                requesterObj = {
                  label: obj.name,
                  value: obj.userId
                }
              }

            });

            this.setState({
              allRequesterArr: requesterArr,
            });
          }
        }
      }

      // ........department...............
      if (jobDetailsRes.clientDepartmentId == null) {
        jobDetailsRes.clientDepartmentId = [];
      } else {

        deptResArr = jobDetailsRes.clientDepartmentId;

        // consoleLog("deptSplitArr", deptResArr);

        let data = {
          clientid: jobDetailsRes.clientId,
        };

        let deptRes = await ApiCall("fetchselectedclientdeptinfo", data);
        if (
          deptRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          deptRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          let payload = Decoder.decode(deptRes.data.payload);
          let deptInfo = payload.data.deptinfo;

          // consoleLog("dept:::", deptResArr);

          for (let i = 0; i < deptInfo.length; i++) {
            allClientDept.push({
              label: deptInfo[i].department,
              value: deptInfo[i].id,
            });
            for (let j = 0; j < deptResArr.length; j++) {
              // consoleLog("deptinfo:", deptInfo[i].id)
              if (deptInfo[i].id == deptResArr[j]) {
                allDeptObj.push({
                  label: deptInfo[i].department,
                  value: deptInfo[i].id,
                });
              }
            }
          }
          // consoleLog("deptObj:", allDeptObj)
        }
      }
      //  else {
      //   jobDetailsRes.clientDepartmentId = [];
      // }

      //   ......no. of this.interpreter...................

      this.state.numbersOption.map((obj) => {
        if (obj.value == jobDetailsRes.noOfserviceProvider) {
          serviceProviderObj = {
            label: obj.label,
            value: obj.value,
          };
        }
      });

      this.setState({
        allClientArr: allClientArr,
        allClientDepartment: allClientDept,
        selectedClient: allClientObj,
        selectedClientDepartment: allDeptObj,
        selectedRequiredInterpreter: serviceProviderObj,
        clientDepartment: deptResArr,
        selectedRequester: requesterObj
      });
    }

    // .................for admin client details   .....................

    let clientDataObj = {
      clientid: jobDetailsRes.clientId
    };


    let clientDataRes = await ApiCall("fetchclientinfo", clientDataObj);

    if (clientDataRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      clientDataRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {

      let payload = Decoder.decode(clientDataRes.data.payload);
      // console.log("Client Data>>>>>>>", payload);
      let userInfo = payload.data[0].userInfo[0];
      this.setState({
        clientName: userInfo.clientName,
        clientPhone: userInfo.adminPhone,
      });
      if (userInfo.clientName == jobDetailsRes.siteContact && userInfo.adminPhone == jobDetailsRes.siteContactPhone) {
        this.setState({
          interpreterCheckIn: true
        })
      } else {
        this.setState({
          interpreterCheckIn: false
        })
      }
    }

    // .............................FOR CLIENT INFO..........................

    if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT) {
      let data = {
        clientid: authUser.data.userid,
      },
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
    }

    allLookupValue = await getLookUpDataFromAPI();
    // consoleLog("All Lookupdata", allLookupValue);
    allLookupValue.SERVICE_CATEGORY_TYPE.map((data) => {
      allServiveArr.push({
        label: data.name,
        value: data.id,
      });
    });

    if (
      jobDetailsRes.appointmentType == 66 ||
      jobDetailsRes.appointmentType == 67
    ) {
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
    } else {
      allLookupValue.SCHEDULE_TYPE.map((data) => {
        if (data.id === 63) {
          allAppointmentType.push({
            label: (
              <div>
                <img
                  src={ImageName.IMAGE_NAME.F2F}
                  height="30px"
                  width="25px"
                  style={{ float: "Left" }}
                />
                <span style={{ paddingLeft: "5%" }}>{data.name}</span>
              </div>
            ),
            value: data.id,
          });
        } else if (data.id === 64) {
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
        } else if (data.id === 65) {
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
    }

    // consoleLog("appointment type::::", allAppointmentType);

    allAppointmentType.map((obj) => {
      if (obj.value == jobDetailsRes.appointmentType) {
        appointmentTypeObj = {
          label: obj.label,
          value: obj.value,
        };
      }
    });

    //    consoleLog("appoint::::",appointmentTypeObj)

    allLookupValue.INDUSTRY_TYPE.map((data) => {
      allJobType.push({
        label: data.name,
        value: data.id,
        imagePath: data.others,
      });
      if (data.id == jobDetailsRes.jobTypeId) {
        jobTypeObj = {
          label: data.name,
          value: data.id,
          imagePath: data.others,
        };
      }
    });

    allLookupValue.GENDER_TYPE.map((data) => {
      allGenterType.push({
        label: data.name,
        value: data.id,
      });
      if (jobDetailsRes.leiGender == data.id) {
        genderObj = {
          label: data.name,
          value: data.id,
        };
      }
    });

    allLanguageArr = await getLanguageArray();

    // consoleLog("lang::::",allLanguageArr)

    allLanguageArr.map((obj) => {
      if (obj.value == jobDetailsRes.targetLanguage) {
        languageObj = {
          label: obj.label,
          value: obj.value,
        };
      }
      if (obj.value == jobDetailsRes.leiLanguage) {
        leiLangObj = {
          label: obj.label,
          value: obj.value,
        };
      }
    });
    targetLanguageArr.push(jobDetailsRes.targetLanguage);

    let resCountry = await getCountryList();
    // console.log("Country List>>>>>", resCountry);
    resCountry.map((data) => {
      allCountryList.push({
        label: data.name,
        value: data.id,
      });
      if (jobDetailsRes.leiCountry == data.id) {
        countryObj = {
          label: data.name,
          value: data.id,
        };
      }
    });

    //    ..................job duration....................

    let duration = jobDetailsRes.duration.split(" ");

    jobDuration.map((obj) => {
      if (duration[1] == obj.value) {
        jobDurationObj = {
          label: obj.label,
          value: obj.value,
        };
      }
    });

    // .......appointment time.........
    let modHour = jobDetailsRes.scheduleTime;
    let ampmData = "";

    var dt = moment(modHour, ["h:mm A"]).format("hh:mm");
    let tim = dt.split(":");

    // consoleLog("converted Time::", dt);
    let hourCheck = modHour.split(":");
    if (hourCheck[0] > 12) {
      ampmData = "PM";
    } else {
      ampmData = "AM";
    }

    // consoleLog("tim::",tim)

    // .................lei dropdown..............
    let leiData = {
      clientId: jobDetailsRes.clientId,
    };
    let LeiArr = [];
    let resLei = await ApiCall("fetchLeiByClient", leiData);
    if (
      resLei.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      resLei.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = await Decoder.decode(resLei.data.payload);
      // console.log("PAyload>>>Lei", payload.data.leiList);
      if (payload.data.leiList.length > 0) {
        payload.data.leiList.map((ldata) => {
          LeiArr.push({
            label: ldata.name,
            value: ldata.userId,
          });
          if (jobDetailsRes.leiId == ldata.userId) {
            leiIdObj = {
              label: ldata.name,
              value: ldata.userId,
            };
          }
          // consoleLog("cun::",ldata.countryCode)
          contryCode = ldata.countryCode;
        });
      }
      this.setState({
        allLeiList: payload.data.leiList,
        leiOptionList: LeiArr,
        leiCountryCode: contryCode,
      });
    }

    // ...........location .................
    let arrData = [];
    let locationData = [];
    let locationRes = await ApiCall("getlocaiondescription", {
      place: jobDetailsRes.location,
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



    this.setState({

      clientId: jobDetailsRes.clientId,
      allClientArr: allClientArr,
      allServiveArr: allServiveArr,
      allAppointmentType: allAppointmentType,
      selectedAppointmentType: appointmentTypeObj,
      appointmentType: jobDetailsRes.appointmentType,
      allLanguage: allLanguageArr,
      selectedTargetLanguage: languageObj,
      targetLanguage: targetLanguageArr,
      allJobType: allJobType,
      jobType: jobTypeObj,
      imagePath: IMAGE_PATH_ONLY + jobTypeObj.imagePath,
      jobNotes: jobDetailsRes.noteForAdmin,
      locationData: locationDataObj,
      otherServices: jobDetailsRes.otherServices == 0 ? false : true,
      otherServicesData: jobDetailsRes.otherServicesData,
      appointmentDate: SetUSAdateFormat(jobDetailsRes.scheduledDate),
      appointmentNotes: jobDetailsRes.note,
      jobDurationValue: duration[0],
      selectedJobDuration: jobDurationObj,
      onSiteContactPhone: jobDetailsRes.siteContactPhone,
      onsiteContact: jobDetailsRes.siteContact,
      hour: tim[0],
      min: tim[1],
      ampm: ampmData,
      selectedLei: leiIdObj,
      leiPhone: "+" + jobDetailsRes.leiCunCode + " " + jobDetailsRes.leiMobile,
      leiEmail: jobDetailsRes.leiEmail,
      leiReference: jobDetailsRes.leiRefence,
      allCountryOption: allCountryList,
      selectedCountry: countryObj,
      allGenderOption: allGenterType,
      interpreterCheckIn: jobDetailsRes.interpreterCheck == 1 ? true : false,
      leiDob: jobDetailsRes.leiDOB,
      selectedLeiGender: genderObj,
      leiLanguage: jobDetailsRes.leiLanguage,
      selectedLeiLanguage: leiLangObj,
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
      });
    }
  };

  getClientData = async (value) => {
    //   consoleLog("val:::",value)
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
    // consoleLog("clientId:::", val);
    let obj = {
      clientId: val,
    };
    let deptRes = await ApiCall("getRequestorByClient", obj);
    if (
      deptRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      deptRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(deptRes.data.payload);
      // consoleLog("requesterData", payload.data);
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
    this.getClientData(value);
    this.getRequesterData(value.value);
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
    if (this.state.clientId !== 0) {
      let obj = {
        clientId: this.state.clientId,
      };
      // consoleLog("Client : ", this.state.client)

      this.getLEIdata(obj);
    } else {
      toast.error(AlertMessage.MESSAGE.CLIENT.CLIENT_NOT_SELECTED);
    }
  };

  appointmentTypeChange = (value) => {
    // consoleLog("selected Appointment", value);
    this.setState({
      selectedAppointmentType: value,
      appointmentType: value.value,
      interpreterCheckIn: false,
      locationData: {},
      locationArr: [],
      onsiteContact: "",
      onSiteContactPhone: "",
    });
  };

  sourceLanguageChange = (value) => {
    // console.log("selected Client",value);
    this.setState({
      selectedSourceLanguage: value,
      sourceLanguage: value.value,
    });
  };

  targetLanguageChange = (value) => {
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
        onSiteContactPhone: this.state.clientPhone,
      });
    } else {
      this.setState({
        interpreterCheckIn: false,
        onsiteContact: "",
        onSiteContactPhone: "",
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
    // consoleLog("selected Client", value);
    this.setState({
      jobType: value,
      imagePath: IMAGE_PATH_ONLY + value.imagePath,
    });
  };

  onJobNotesChange = (e) => {
    this.setState({
      jobNotes: e.target.value,
    });
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

  appointmentdateChange = (date) => {
    this.setState({
      appointmentDate: SetUSAdateFormat(date),
    });
    // consoleLog("Date::", date)
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

  hourChangeUp = () => {
    let hr = parseInt(this.state.hour) - 1;
    if (hr < 1) {
      this.setState({
        hour: "12",
      });
    } else {
      if (hr > 9) {
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

  hourInputChange = (e) => {
    if (timeValidator(e.target.value)) {
      this.setState({
        hour: e.target.value
      })
    }
  }

  minInputChange = (e) => {
    if (timeValidator(e.target.value)) {
      this.setState({
        min: e.target.value
      })
    }
  }

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

  minChangeUp = () => {
    let min = parseInt(this.state.min) - 1;
    if (min < 0) {
      this.setState({
        min: "59",
      });
    } else {
      if (min > 9) {
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
        // consoleLog("data:::::", locationData);
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

  onLocationChange = async (value) => {
    // consoleLog("location&&&", value);
    let obj = {
      placeid: value.value,
    };
    // consoleLog("Get Coordinante from place id::", obj)
    let locationData = await ApiCall("getcoordinatefromplaceid", obj);
    if (
      locationData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      locationData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let locationArr = Decoder.decode(locationData.data.payload);
      let locateAdd = {};
      locateAdd = {
        lat: locationArr.data.coordinatedetails[0].lat,
        long: locationArr.data.coordinatedetails[0].lng,
        locationName: value.label,
        locationId: value.value,
      };
      // consoleLog("Location details::", locateAdd)
      this.setState({
        selectLocation: locateAdd,
      });
    }
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

  genderChange = (value) => {
    this.setState({
      selectedLeiGender: value,
    });
  };

  onLeiAdd = () => {
    // return history.push("/adminAddClientContact");
    var newWindow = window.open("/adminAddLEI");
    newWindow.clientId = this.state.clientId;
  };

  onSubmit = async () => {
    let authData = localStorage.getItem("AuthToken");
    let authUser = Decoder.decode(authData);
    let errorCounter = 0,
      validateClient = inputEmptyValidate(this.state.clientId),
      validateAppointmentType = inputEmptyValidate(this.state.appointmentType),
      validateJobType = inputEmptyValidate(this.state.jobType.value),
      validateNoOfInterpreter = inputEmptyValidate(
        this.state.interpreterRequiredNumber
      ),
      validateSourceLanguage = inputEmptyValidate(this.state.sourceLanguage),
      validateTargetLanguage = inputEmptyValidate(
        this.state.selectedTargetLanguage
      ),

      validateRequester = inputEmptyValidate(this.state.selectedRequester.value),
      validateleiId = inputEmptyValidate(this.state.selectedLei),
      validateDate = inputEmptyValidate(this.state.appointmentDate),
      validateJobDuration = inputEmptyValidate(this.state.jobDurationValue),
      validateOnsiteContactName = inputEmptyValidate(this.state.onsiteContact);

    if (!validateClient) {
      toast.error("Please select a client");
      errorCounter++;
      return false;
    } else if (!validateRequester) {
      toast.error("Please select a Requester");
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
    } else if (!validateDate) {
      toast.error("Please select appointment date");
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
    } else if (Number(this.state.hour) > 12) {
      toast.error("Hour cannot be set greater than 12 in appointment time");
      errorCounter++;
    } else if (Number(this.state.min) > 59) {
      toast.error("Minute cannot be set greater than 59 in appointment time");
      errorCounter++;
    } else if (this.state.appointmentType == 63) {
      if (Object.keys(this.state.selectLocation).length == 0) {
        toast.error("Please select location");
        errorCounter++;
      } else if (!validateOnsiteContactName) {
        toast.error("Please enter onsite contact");
        errorCounter++;
      } else if (this.state.onSiteContactPhone.substring(3, 15) === "") {
        toast.error("Please enter onsite contact phone");
        errorCounter++;
      }
    }

    if (errorCounter === 0) {
      window.scrollTo(0, 0);
      this.setState({
        isLoad: true
      });
      // consoleLog("Location>>>", this.state.locationData)
      if (this.state.userType === UsersEnums.APPLICATION_ROLE.CLIENT) {
        let modHour =
          (this.state.hour === "" ? Number("00") : this.state.hour) + ":" + (this.state.min === "" ? Number("00") : this.state.min) + " " + this.state.ampm;

        var dt = moment(modHour, ["h:mm A"]).format("HH:mm");
        let finalData = {
          clientId: authUser.data.userid,
          jobId: this.state.reqId,
          appointmentType: this.state.appointmentType.toString(),
          jobType: this.state.jobType.value.toString(),
          noOfInterpreter: this.state.interpreterRequiredNumber.toString(),
          note: this.state.jobNotes,
          sourceLanguage: this.state.sourceLanguage.toString(),
          targetLanguage: this.state.targetLanguage,
          interpreterNote: this.state.appointmentNotes,
          appointmentLocation:
            this.state.locationData.label === undefined
              ? ""
              : this.state.locationData.label,
          locationLat:
            Object.keys(this.state.selectLocation).length > 0
              ? this.state.selectLocation.lat
              : null,
          locationLng:
            Object.keys(this.state.selectLocation).length > 0
              ? this.state.selectLocation.long
              : null,
          locationId:
            Object.keys(this.state.selectLocation).length > 0
              ? this.state.selectLocation.locationId
              : null,
          duration:
            this.state.jobDurationValue + " " + this.state.jobDurationLimit,
          scheduledDate: SetDatabaseDateFormat(this.state.appointmentDate),
          scheduledTime: dt + ":00",
          siteContact: this.state.onsiteContact,
          siteContactMobile: this.state.onSiteContactPhone.substring(3, 15),
          leiId: this.state.selectedLei.value.toString(),
          leiDOB: SetDatabaseDateFormat(this.state.leiDob),
          leiCountryCode: this.state.leiCountryCode,
          leiMobile: this.state.leiPhone.substring(3, 15),
          leiEmail: this.state.leiEmail,
          leiGender: this.state.selectedLeiGender.value,
          leiReference: this.state.leiReference,
          leiCountry: this.state.leiCountry.toString(),
          leiPreferredLanguage: this.state.leiLanguage,
          countryDialect: this.state.countrySpecificDialect ? "1" : "0",
          interpreterCheck: this.state.interpreterCheckIn ? "1" : "0",
          otherServices: this.state.otherServices ? "1" : "0",
          otherServicesData: this.state.otherServicesData,
          clientDepartment: this.state.clientDepartment,

          requester: this.state.selectedRequester.value,
        };

        // consoleLog("Final Submit data >>>>>", finalData);

        let res = await ApiCall("modifyInterPretationJobFromAdmin", finalData);
        if (
          res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          this.setState({
            isLoad: false
          })
          toast.success("Job Updated successfully");
          // return history.push("/clientAllJobs");
        } else {
          this.setState({
            isLoad: false
          })
          toast.error(res.message);
        }
      } else if (
        this.state.userType === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN || this.state.userType === UsersEnums.APPLICATION_ROLE.ADMIN_STAFF
      ) {
        let modHour =
          (this.state.hour === "" ? Number("00") : this.state.hour) + ":" + (this.state.min === "" ? Number("00") : this.state.min) + " " + this.state.ampm;

        var dt = moment(modHour, ["h:mm A"]).format("HH:mm");

        // consoleLog("dt::::", dt);

        let finalData = {
          jobId: this.state.reqId,
          clientId: this.state.clientId,
          appointmentType: this.state.appointmentType.toString(),
          jobType: this.state.jobType.value.toString(),
          noOfInterpreter: this.state.interpreterRequiredNumber.toString(),
          note: this.state.jobNotes,
          sourceLanguage: this.state.sourceLanguage.toString(),
          targetLanguage: this.state.targetLanguage,
          interpreterNote: this.state.appointmentNotes,
          appointmentLocation:
            this.state.locationData.label === undefined
              ? ""
              : this.state.locationData.label,
          locationLat:
            Object.keys(this.state.selectLocation).length > 0
              ? this.state.selectLocation.lat
              : null,
          locationLng:
            Object.keys(this.state.selectLocation).length > 0
              ? this.state.selectLocation.long
              : null,
          locationId:
            Object.keys(this.state.selectLocation).length > 0
              ? this.state.selectLocation.locationId
              : null,
          duration:
            this.state.jobDurationValue + " " + this.state.jobDurationLimit,
          scheduledDate: SetDatabaseDateFormat(this.state.appointmentDate),
          scheduledTime: dt + ":00",
          siteContact: this.state.onsiteContact,
          siteContactMobile: this.state.onSiteContactPhone.substring(3, 15),
          leiId: this.state.selectedLei.value.toString(),
          leiDOB: SetDatabaseDateFormat(this.state.leiDob),
          leiCountryCode: this.state.leiCountryCode,
          leiMobile: this.state.leiPhone.substring(3, 15),
          leiEmail: this.state.leiEmail,
          leiGender: this.state.selectedLeiGender.value,
          leiReference: this.state.leiReference,
          leiCountry: this.state.leiCountry.toString(),
          leiPreferredLanguage: this.state.leiLanguage,
          countryDialect: this.state.countrySpecificDialect ? "1" : "0",
          interpreterCheck: this.state.interpreterCheckIn ? "1" : "0",
          otherServices: this.state.otherServices ? "1" : "0",
          otherServicesData: this.state.otherServicesData,
          clientDepartment: this.state.clientDepartment,
          requester: this.state.selectedRequester.value,
        };

        // consoleLog("Final Submit data >>>>>", finalData);

        let res = await ApiCall("modifyInterPretationJobFromAdmin", finalData);

        // consoleLog("response::", res);
        if (
          res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          this.setState({
            isLoad: false
          })
          toast.success("Job Updated successfully");
          setTimeout(() => {
            return history.push("/adminViewAllJobs");
          }, 1000);

        } else {
          this.setState({
            isLoad: false
          })
          toast.error(res.message);
        }
      }
    }
  };

  // onBack = () => {
  //   return history.push("/adminViewAllJobs");
  // };

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
        {/* <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div> */}
        {/* <div className="component-wrapper" hidden={this.state.isLoad}> */}
        {/* <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "3%" }}
          >
            {" "}
            <Link to="/adminDashboard">Dashboard</Link> / Create Scheduled
            Interpretation Job
          </div> */}

        {/* <div className="create-new-job-wrap"> */}

        <div className="main-container">
          <div className="createform-box sdw _fl" hidden={!this.state.isLoad}>
            {/* <ReactLoader /> */}
            <LotteLoader />
          </div>
          <div className="createform-box sdw _fl" hidden={this.state.isLoad}>
            <div className="create-jeneral-wrap _fl">
              <div className="create-jeneral-info sdw _fl">
                <div className="create-sb-head">
                  <div className="row">
                    <div
                      className="col-md-6"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <h3>GENERAL INFORMATION</h3>
                    </div>
                    <div className="col-md-4"></div>
                    <div className="col-md-2">
                      <button
                        style={{
                          textDecoration: "none",
                          padding: "5px 10px 5px 10px",
                          borderRadius: "10px",
                          fontSize: "13px",
                        }}
                        className="btn btn-info"
                        onClick={() => {
                          this.onSubmit();
                        }}
                      >
                        UPDATE
                      </button>
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
                                  isDisabled={true}
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
                          <div className="frm-label">Appointment Type *</div>
                          <div className="bts-drop">
                            <SelectBox
                              optionData={this.state.allAppointmentType}
                              value={this.state.selectedAppointmentType}
                              onSelectChange={(value) =>
                                this.appointmentTypeChange(value)
                              }
                            // isDisabled={true}
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
                          style={{ width: "52%" }}
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
                        {this.state.appointmentType === 63 ? (
                          <div className="web-form-bx">
                            <div className="frm-label">
                              Will the interpreter check-in with you at the time
                              of interpretation ? *
                            </div>
                            <div className="check-field">
                              <label className="checkbox_btn">
                                {this.state.interpreterCheckIn ? (
                                  <input
                                    type="radio"
                                    name="radio1"
                                    checked={true}
                                    value="yes"
                                    onChange={this.interpreterCheckIn}
                                  />
                                ) : (
                                  <input
                                    type="radio"
                                    name="radio1"
                                    checked={false}
                                    value="yes"
                                    onChange={this.interpreterCheckIn}
                                  />
                                )}
                                <span className="checkmark3"></span> Yes
                              </label>
                            </div>
                            <div className="check-field">
                              <label className="checkbox_btn">
                                {this.state.interpreterCheckIn ? (
                                  <input
                                    type="radio"
                                    name="radio1"
                                    checked={false}
                                    value="no"
                                    onChange={this.interpreterCheckIn}
                                  />
                                ) : (
                                  <input
                                    type="radio"
                                    name="radio1"
                                    checked={true}
                                    value="no"
                                    onChange={this.interpreterCheckIn}
                                  />
                                )}
                                <span className="checkmark3"></span> No
                              </label>
                            </div>
                          </div>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 wt-right">
                      <div className="web-form-app">
                        <div className="pic-data" style={{ marginLeft: "20%" }}>
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
                              value={this.state.jobType}
                              onSelectChange={(value) =>
                                this.jobTypeChange(value)
                              }
                            ></SelectBox>
                          </div>
                        </div>
                        <div className="web-form-bx md4">
                          <div className="frm-label">
                            Notes for{" "}
                            <span style={{ color: "#00a0df" }}>7C Admin *</span>
                          </div>
                          <textarea
                            rows="2"
                            placeholder=""
                            className="in-textarea msg min"
                            value={this.state.jobNotes}
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
                                        onChange={this.otherServiceRadioChange}
                                      />
                                    ) : (
                                      <input
                                        type="radio"
                                        name="other_radio1"
                                        checked={false}
                                        value="yes"
                                        onChange={this.otherServiceRadioChange}
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
                                        onChange={this.otherServiceRadioChange}
                                      />
                                    ) : (
                                      <input
                                        type="radio"
                                        name="other_radio1"
                                        checked={true}
                                        value="no"
                                        onChange={this.otherServiceRadioChange}
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
                            Appointment Notes for Interpreter *
                          </div>
                          <div className="form-input-fields">
                            <input
                              type="text"
                              placeholder="Enter notes here..."
                              className="textbox4"
                              value={this.state.appointmentNotes}
                              style={{
                                borderRadius: "9px",
                                boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 20%)",
                              }}
                              onChange={this.appointmentsNotesChange}
                            />
                          </div>
                        </div>

                        {this.state.appointmentType === 66 ||
                          this.state.appointmentType === 67 ? (
                          <React.Fragment></React.Fragment>
                        ) : (
                          <React.Fragment>
                            <div className="web-form-bx">
                              <div className="frm-label">
                                Appointment Date & Time *
                              </div>

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
                                  <span>{this.state.appointmentDate}</span>
                                </div>
                                <div style={{ width: "20%" }}>
                                  <a style={{ float: "right" }}>
                                    <DatePicker
                                      dropdownMode="select"
                                      showMonthDropdown
                                      showYearDropdown
                                      adjustDateOnChange
                                      minDate={new Date()}
                                      onChange={(date) =>
                                        this.appointmentdateChange(date)
                                      }
                                      customInput={<Schedule />}
                                    />
                                  </a>
                                </div>
                              </div>

                              <div className="t-time">
                                <span className="t1">
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.hourChange}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.hour}
                                      className="tsd2"
                                      onChange={this.hourInputChange}
                                    // readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.hourChangeUp}
                                    />
                                  </small>
                                </span>
                                <span className="t2">
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.minChange}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.min}
                                      className="tsd2"
                                      onChange={this.minInputChange}
                                    // readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.minChangeUp}
                                    />
                                  </small>
                                </span>
                                <span
                                  className="t3"
                                  style={{ marginLeft: "2%" }}
                                >
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.ampmChange}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.ampm}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.ampmChange}
                                    />
                                  </small>
                                </span>
                              </div>
                            </div>
                          </React.Fragment>
                        )}

                        {this.state.appointmentType === 63 ? (
                          <div className="web-form-bx">
                            <div className="frm-label">Onsite Contact *</div>
                            <input
                              type="text"
                              placeholder="Enter Name"
                              className="in-field2"
                              value={this.state.onsiteContact}
                              onChange={this.onSiteContactNameChange}
                              readOnly={this.state.interpreterCheckIn}
                            />
                          </div>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 wt-right">
                      <div className="web-form-app">
                        {this.state.appointmentType !== "" ? (
                          <React.Fragment>
                            {this.state.appointmentType !== 63 &&
                              !this.state.otherServices ? (
                              <div className="web-form-bx md4">
                                <div className="frm-label">
                                  Meeting link (3rd party conference service) *
                                </div>
                                <textarea
                                  rows="2"
                                  placeholder=""
                                  className="in-textarea msg min"
                                  value={this.state.otherServicesData}
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
                        {this.state.appointmentType === 63 ? (
                          <div className="web-form-bx">
                            <div className="frm-label">
                              Appointment Location *
                            </div>
                            <div className="tr-3">
                              {/* <textarea placeholder="Address" className="in-textarea"></textarea>
                                                                <div className="ak"><img src="images/location.png" /></div> */}
                              <Select
                                options={this.state.locationArr}
                                components={{
                                  DropdownIndicator,
                                  IndicatorSeparator: () => null,
                                }}
                                value={this.state.locationData}
                                placeholder="Select"
                                onChange={(value) =>
                                  this.onLocationChange(value)
                                }
                                onInputChange={(value) => {
                                  this.onLocationInputChange(value);
                                }}
                                styles={customStylesDropdown}
                              />
                            </div>
                          </div>
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
                                  boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 20%)",
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
                        {this.state.appointmentType === 63 ? (
                          <div className="web-form-bx">
                            <div className="frm-label">
                              Site Contact Phone Number *
                            </div>
                            <input
                              type="text"
                              value={this.state.onSiteContactPhone}
                              placeholder=""
                              className="in-field2"
                              onChange={this.siteContactPhoneChange}
                              readOnly={this.state.interpreterCheckIn}
                            />
                          </div>
                        ) : (
                          <React.Fragment></React.Fragment>
                        )}
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
                              {/* <img src={ImageName.IMAGE_NAME.RESET_BTN} alt="reset" /><br/><span style={{fontSize:"11px", color:"gray"}}>Reset</span> */}
                            </div>
                          </div>
                        </div>
                        <div className="web-form-bx">
                          <div className="frm-label">LEI Phone Number</div>
                          <input
                            type="text"
                            value={this.state.leiPhone}
                            placeholder="0104  0125  012"
                            className="in-field2"
                            // onChange={this.leiPhone}
                            readonly
                          />
                        </div>
                        <div className="web-form-bx">
                          <div className="frm-label">
                            Gender Preference(If any)
                          </div>
                          <div className="bts-drop">
                            <SelectBox
                              optionData={this.state.allGenderOption}
                              value={this.state.selectedLeiGender}
                              onSelectChange={(value) =>
                                this.genderChange(value)
                              }
                              isDisabled={true}
                            ></SelectBox>
                          </div>
                        </div>
                        <div className="web-form-bx">
                          <div className="frm-label">LEI Country of origin</div>
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
                        <div className="web-form-bx">
                          <div className="frm-label">LEI Email ID</div>
                          <input
                            type="text"
                            value={this.state.leiEmail}
                            placeholder="Email id"
                            className="in-field2"
                            readonly
                          />
                        </div>
                        <div className="web-form-bx">
                          <div className="frm-label">LEI reference Number</div>
                          <input
                            type="text"
                            value={this.state.leiReference}
                            placeholder="0104  0125  012"
                            className="in-field2"
                            readonly
                          />
                        </div>
                        <div className="web-form-bx">
                          <div className="frm-label">
                            LEI Preferred language
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

              <div className=" m20">
                <div className="text-center">
                  {/* <button
                    type="submit"
                    className="cn_btn"
                    onClick={() => {
                      this.onBack();
                    }}
                  >
                    Back
                  </button> */}
                  <button
                    type="submit"
                    className="sv_btn"
                    onClick={() => {
                      this.onSubmit();
                    }}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
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
