import React from "react";
import { Link } from "react-router-dom";
import "../../../../css/createnewjob.css";
import { ImageName } from "../../../../enums";
import { Decoder } from "../../../../services/auth";
import {
  consoleLog,
  getClientInfo,
  getCountryList,
  getLanguageArray,
  getLookUpDataFromAPI,
  phoneNumberCheck,
  SetDOBFormat,
  SetUSAdateFormat,
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
import { Sd } from "@mui/icons-material";
import { format } from "crypto-js";
import moment from "moment";
import ReactLoader, { ReactSmallLoader } from "../../../Loader";
import { borderRadius } from "@mui/system";

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
    label: "1:00 Hour",
    value: "1 Hour",
  },
  {
    label: "2:00 Hour",
    value: "2 Hour",
  },
  {
    label: "3:00 Hour",
    value: "3 Hour",
  },
  {
    label: "5:00 Hour",
    value: "5 Hour",
  },
  {
    label: "10:00 Hour",
    value: "10 Hour",
  },
  {
    label: "20:00 Hour",
    value: "20 Hour",
  },
  {
    label: "1 Day",
    value: "1 Day",
  },
  {
    label: "2 Day",
    value: "2 Day",
  },
  {
    label: "3 Day",
    value: "3 Day",
  },
];

export default class EditTrainingDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryCode: 1,
      allClientArr: [],
      selectedClient: {},
      allRequesterArr: [],
      selectedRequester: {},
      client: "",
      allServiceArr: [],
      selectedService: {
        label: "Training",
        value: 47,
      },
      service: 47,
      allTrainingCourseType: [],
      selectedTrainingCourseType: {},
      trainingCourseType: "",
      trainingCourseTypeData: [],
      courseDescription: "",
      allTrainingCategory: [],
      trainingCategory: {},
      allTrainingData: [],
      adminNotes: "",
      allTrainingFormat: [],
      trainingFormat: "",
      requirements: "",
      numbersOption: [],
      selectedParticipants: {
        label: 1,
        value: 1,
      },
      totalParticipants: 1,
      receiveAlertsMail: "",
      trainerNotes: "",
      trainingDate: "",
      allTrainingDuration: jobDuration,
      selectedTrainingDuration: {
        label: "1:00 Hour",
        value: "1 Hour",
      },
      trainingDuration: "1 Hour",
      budget: "",
      allGenderOption: [],
      selectedGender: {},
      gender: "",
      onsiteContact: "",
      hour: "08",
      min: "00",
      ampm: "AM",
      locationData: {},
      locationArr: [],
      onSiteContactPhone: "",

      userType: 0,
      isLoad: true,
      reqId: ""
    };
  }

  componentDidMount() {
    let authData = localStorage.getItem("AuthToken");
    let authUser = Decoder.decode(authData);

    if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT) {
      //   consoleLog("userType:::", UsersEnums.APPLICATION_ROLE.CLIENT);
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


    // ................................
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
      allGenterType = [],
      allTrainingFormat = [],
      allCategoryType = [],
      allTrainingData = [],
      categoryObj = {},
      clientObj = {},
      courseObj = {},
      description = "",
      trainingCourses = [],
      trainingType = "",
      genderObj = {},
      serviceObj = {},
      requesterObj={},
      requesterArr=[],
      trainingDetailsRes = {};






    allLookupValue = await getLookUpDataFromAPI();
    // console.log("All Lookupdata", allLookupValue);
    // .......for fetch data of training details......ApiCall......

    // consoleLog("propsss:::",this.props.mainData)
    let obj = {
      projectId: this.props.mainData
    }
    this.setState({
      reqId: this.props.mainData
    })

    let trainingRes = await ApiCall("fetchTrainingDetails", obj)
    if (
      trainingRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      trainingRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payloadTraining = Decoder.decode(trainingRes.data.payload);

      consoleLog("payload training:::",payloadTraining);
      trainingDetailsRes = payloadTraining.data.translationDetails[0];
    }


    if(trainingDetailsRes.clientId == null){
      trainingDetailsRes.clientId = "";
    } else {
      let obj = {
        clientId: trainingDetailsRes.clientId,
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
            requesterArr.push({
              label: obj.name,
              value: obj.userId,
            });
            if(trainingDetailsRes.requester === obj.userId){
              requesterObj = {
                label:obj.name,
                value:obj.userId
              }
            }
            
          });
  
          this.setState({
            allRequesterArr: requesterArr,
          });
        }
      }
    }



    allClientArr = await getClientInfo();

    // consoleLog("client",allClientArr)
    allTrainingFormat = allLookupValue.COURSE_FORMAT_TYPE;
    // consoleLog("All Training Format:::", allTrainingFormat);

    allLookupValue.SERVICE_CATEGORY_TYPE.map((data) => {
      allServiveArr.push({
        label: data.name,
        value: data.id,
      });
    });

    allLookupValue.GENDER_TYPE.map((data) => {
      allGenterType.push({
        label: data.name,
        value: data.id,
      });
      if (trainingDetailsRes.genderPref == data.id) {
        genderObj = {
          label: data.name,
          value: data.id
        }
      }
    });

    let res = await ApiCall("getCourseWithCategory");
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      allTrainingData = payload.data;
      if (payload.data.length > 0) {
        payload.data.map((data) => {
          allCategoryType.push({
            label: data.name,
            value: data.id,
          });
          if (trainingDetailsRes.trainingCatId == data.id) {
            categoryObj = {
              label: data.name,
              value: data.id,
            }
          }
        });

      }
    }
    // .............all client ..................
    allClientArr.map((obj) => {
      if (trainingDetailsRes.clientId == obj.value) {
        clientObj = {
          label: obj.label,
          value: obj.value
        }
      }
    })
    // ...............course dropdown................
    allTrainingData.map((obj) => {
      //  consoleLog("obj:course:",obj)
    })
    allTrainingData.map((data) => {
      if (data.id === trainingDetailsRes.trainingCatId) {
        let allCourse = data.courses;

        if (allCourse.length > 0) {
          allCourse.map((cd) => {
            // consoleLog("cd:::",cd)/
            trainingCourses.push({
              label: cd.name,
              value: cd.id,
            });
            if (trainingDetailsRes.courseId == cd.id) {
              courseObj = {
                label: cd.name,
                value: cd.id
              }
              description = cd.description;
              trainingType = cd.formatTypeId;
            }

          });
          this.setState({
            trainingCourseTypeData: allCourse,
          })
        }
      }
    });

    // .......date time...........

    let modHour = trainingDetailsRes.scheduleTime;
    let ampmData = "";

    var dt = moment(modHour, ["h:mm A"]).format("hh:mm");
    let tim = dt.split(":");

    // consoleLog("converted Time::",dt)
    let hourCheck = modHour.split(":");
    if (hourCheck[0] > 12) {
      ampmData = "PM";
    } else {
      ampmData = "AM";
    }

    this.state.numbersOption.map((obj) => {
      if (trainingDetailsRes.noOfserviceProvider == obj.value) {
        serviceObj = {
          label: obj.label,
          value: obj.value
        }
      }
    })

    // .....location........
    let arrDataObj = {};
    let arrData = [];

    let locationRes = await ApiCall("getlocaiondescription", {
      place: trainingDetailsRes.location,
    });
    if (
      locationRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      locationRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let locationArr = Decoder.decode(locationRes.data.payload);
      let locationData = locationArr.data.locaionsuggesion;
      // console.log("data:::::", locationData);
      for (let i = 0; i < locationData.length; i++) {
        arrData.push({
          label: locationData[i].description,
          value: locationData[i].placeid,
        });
        arrDataObj = {
          label: locationData[i].description,
          value: locationData[i].placeid,
        }
      }

      this.setState({
        locationArr: arrData,
        locationData: arrDataObj,
      });
    }




    this.setState({
      allClientArr: allClientArr,
      allServiveArr: allServiveArr,
      allGenderOption: allGenterType,
      allTrainingFormat: allTrainingFormat,
      allTrainingCategory: allCategoryType,
      allTrainingData: allTrainingData,
      allTrainingCourseType: trainingCourses,
      // ........
      selectedClient: clientObj,
      trainingCategory: categoryObj,
      selectedTrainingCourseType: courseObj,
      courseDescription: description,
      adminNotes: trainingDetailsRes.noteForAdmin,
      trainingFormat: trainingType,
      trainingDate: SetUSAdateFormat(trainingDetailsRes.scheduleDate),
      hour: tim[0],
      min: tim[1],
      ampm: ampmData,
      receiveAlertsMail: trainingDetailsRes.alertEmail,
      trainerNotes: trainingDetailsRes.note,
      trainingDuration: trainingDetailsRes.duration,
      requirements: trainingDetailsRes.targetAudience,
      budget: trainingDetailsRes.budget,
      selectedGender: genderObj,
      selectedParticipants: serviceObj,
      onSiteContactPhone: trainingDetailsRes.siteContactPhone,
      onsiteContact: trainingDetailsRes.siteContact,
      selectedRequester:requesterObj,
      isLoad: false
    });
  };

  clientChange = (value) => {
    // console.log("selected Client",value);
    this.setState({
      selectedClient: value,
      client: value.value,
    });
  };

  trainingCourseTypeChange = (value) => {
    // console.log("selected Client",value);
    let description = "",
      trainingType = "",
      duration = "";
    this.state.trainingCourseTypeData.map((data) => {
      if (data.id === value.value) {
        description = data.description;
        trainingType = data.formatTypeId;
        duration = data.duration + " " + data.durationUnit;
      }
    });
    this.setState({
      selectedTrainingCourseType: value,
      trainingCourseType: value.value,
      courseDescription: description,
      trainingDuration: duration,
      trainingFormat: trainingType,
    });
  };

  totalParticipantsChange = (value) => {
    // console.log("selected Client",value);
    this.setState({
      selectedParticipants: value,
      totalParticipants: value.value,
    });
  };

  trainingCategoryChange = (value) => {
    // console.log("selected Client",value);
    let allCourse = [],
      trainingCourses = [];
    this.state.allTrainingData.map((data) => {
      if (data.id === value.value) {
        allCourse = data.courses;
        trainingCourses = [];
        if (allCourse.length > 0) {
          allCourse.map((cd) => {
            trainingCourses.push({
              label: cd.name,
              value: cd.id,
            });
          });
        }
      }
    });

    // consoleLog("All Course::", allCourse)

    this.setState({
      trainingCategory: value,
      allTrainingCourseType: trainingCourses,
      trainingCourseTypeData: allCourse,
      selectedTrainingCourseType: {},
      trainingCourseType: "",
      courseDescription: "",
      trainingDuration: "1 Hour",
      trainingFormat: "",
    });
  };

  receiveAlertsMailChange = (e) => {
    this.setState({
      receiveAlertsMail: e.target.value,
    });
  };

  onAdminNotesChange = (e) => {
    this.setState({
      adminNotes: e.target.value,
    });
  };

  trainerNotesChange = (e) => {
    this.setState({
      trainerNotes: e.target.value,
    });
  };

  trainingDurationChange = (value) => {
    // console.log("selected Client",value);
    this.setState({
      selectedTrainingDuration: value,
      trainingDuration: value.value,
    });
  };

  trainingRequirementChange = (e) => {
    this.setState({
      requirements: e.target.value,
    });
  };

  trainingDateChange = (date) => {
    this.setState({
      trainingDate: SetUSAdateFormat(date),
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
    // console.log("location value", value)
    this.setState({
      locationData: value,
    });
  };

  onSiteContactChange = (e) => {
    this.setState({
      onsiteContact: e.target.value,
    });
  };

  onBudgetChange = (e) => {
    this.setState({
      budget: e.target.value,
    });
  };

  genderChange = (value) => {
    this.setState({
      selectedGender: value,
      gender: value.value,
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

  trainingFormatChange = (e) => {
    if (e.target.value === "yes") {
      this.setState({
        trainingFormat: true,
      });
    } else {
      this.setState({
        trainingFormat: false,
      });
    }
  };

  onSubmit = async () => {

    let authData = localStorage.getItem("AuthToken");
    let authUser = Decoder.decode(authData);
    let errorCounter = 0,
      validateClient = inputEmptyValidate(this.state.selectedClient.value),
      validateTrainingCategory = inputEmptyValidate(
        this.state.trainingCategory
      ),
      validateTrainingCourse = inputEmptyValidate(
        this.state.selectedTrainingCourseType
      ),
      validateTrainingDate = inputEmptyValidate(this.state.trainingDate),
      validateReceiveAlerts = inputEmptyValidate(this.state.receiveAlertsMail),
      validateBudget = inputEmptyValidate(this.state.budget),
      validateLocation = inputEmptyValidate(this.state.locationData),
      validateRequester = inputEmptyValidate(this.state.selectedRequester.value);

    if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT) {
       if (!validateRequester) {
        toast.error("Please select a Requester");
        errorCounter++;
        return false;
      } else if (!validateTrainingCategory) {
        toast.error("Please select training category");
        errorCounter++;
        return false;
      } else if (!validateTrainingCourse) {
        toast.error("Please select course");
        errorCounter++;
        return false;
      } else if (!validateTrainingDate) {
        toast.error("Please select date");
        errorCounter++;
        return false;
      } else if (!validateReceiveAlerts) {
        toast.error("Please input receiving alerts");
        errorCounter++;
        return false;
      } else if (!validateBudget) {
        toast.error("Please input budget");
        errorCounter++;
        return false;
      } else if (!validateLocation) {
        toast.error("Please select location");
        errorCounter++;
        return false;
      } else if (Number(this.state.hour) > 12) {
        toast.error("Hour cannot be set greater than 12 in appointment time");
        errorCounter++;
      } else if (Number(this.state.min) > 59) {
        toast.error("Minute cannot be set greater than 59 in appointment time");
        errorCounter++;
      }
      if (errorCounter === 0) {
        let modHour =
        (this.state.hour === "" ? Number("00") : this.state.hour) + ":" + (this.state.min === "" ? Number("00") : this.state.min) + " " + this.state.ampm;

        var dt = moment(modHour, ["h:mm A"]).format("HH:mm");
        let finalData = {
          clientId: authUser.data.userid,
          projectId: this.state.reqId,
          serviceTypeId: this.state.service,
          trainingCatId: this.state.trainingCategory.value,
          courseId: this.state.selectedTrainingCourseType.value,
          noteForAdmin: this.state.adminNotes,
          trainingFormatId: this.state.trainingFormat,
          scheduleDate: SetDOBFormat(this.state.trainingDate),
          scheduleTime: dt + ":00",
          requirement: this.state.requirements,
          noOfParticipants: this.state.selectedParticipants.value,
          totalDuration: this.state.trainingDuration,
          alertEmail: this.state.receiveAlertsMail,
          budget: this.state.budget,
          location: this.state.locationData.label
            ? this.state.locationData.label
            : "",
          genderPref: this.state.selectedGender.value,
          noteForTrainer: this.state.trainerNotes,
          siteContactNo: this.state.onSiteContactPhone,
          siteContactName: this.state.onsiteContact,
          requester: this.state.selectedRequester.value,
        };

        console.log("Final Submit data >>>>>", finalData);

        let res = await ApiCall("modifyTraining", finalData);
        if (
          res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          toast.success("Training Updated successfully");
          return history.push("/clientTrainingList");
        } else {
          toast.error("Error occured!!!");
        }
      }

    } else if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN) {
      if (!validateClient) {
        toast.error("Please select a client");
        errorCounter++;
        return false;
      } else if (!validateRequester) {
        toast.error("Please select a Requester");
        errorCounter++;
        return false;
      }else if (!validateTrainingCategory) {
        toast.error("Please select training category");
        errorCounter++;
        return false;
      } else if (!validateTrainingCourse) {
        toast.error("Please select course");
        errorCounter++;
        return false;
      } else if (!validateTrainingDate) {
        toast.error("Please select date");
        errorCounter++;
        return false;
      } else if (!validateReceiveAlerts) {
        toast.error("Please input receiving alerts");
        errorCounter++;
        return false;
      } else if (!validateBudget) {
        toast.error("Please input budget");
        errorCounter++;
        return false;
      } else if (!validateLocation) {
        toast.error("Please select location");
        errorCounter++;
        return false;
      } else if (Number(this.state.hour) > 12) {
        toast.error("Hour cannot be set greater than 12 in appointment time");
        errorCounter++;
      } else if (Number(this.state.min) > 59) {
        toast.error("Minute cannot be set greater than 59 in appointment time");
        errorCounter++;
      }
      if (errorCounter === 0) {

        let modHour =
        (this.state.hour === "" ? Number("00") : this.state.hour) + ":" + (this.state.min === "" ? Number("00") : this.state.min) + " " + this.state.ampm;

        var dt = moment(modHour, ["h:mm A"]).format("HH:mm");
        let finalData = {
          projectId: this.state.reqId,
          clientId: this.state.selectedClient.value,
          serviceTypeId: this.state.service,
          trainingCatId: this.state.trainingCategory.value,
          courseId: this.state.selectedTrainingCourseType.value,
          noteForAdmin: this.state.adminNotes,
          trainingFormatId: this.state.trainingFormat,
          scheduleDate: SetDOBFormat(this.state.trainingDate),
          scheduleTime: dt + ":00",
          requirement: this.state.requirements,
          noOfParticipants: this.state.selectedParticipants.value,
          totalDuration: this.state.trainingDuration,
          alertEmail: this.state.receiveAlertsMail,
          budget: this.state.budget,
          location: this.state.locationData.label
            ? this.state.locationData.label
            : "",
          genderPref: this.state.selectedGender.value,
          noteForTrainer: this.state.trainerNotes,
          // siteContactNo: this.state.onSiteContactPhone.substring(3,15),
          siteContactNo: this.state.onSiteContactPhone,
          siteContactName: this.state.onsiteContact,
          requester: this.state.selectedRequester.value,
        };

        // console.log("Final Submit data >>>>>", finalData);

        let res = await ApiCall("modifyTraining", finalData);
        if (
          res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          toast.success("Training Updated successfully");
          window.scrollTo(0, 0);
          // return history.push("/adminClientRfqList");
        } else {
          toast.error("Error occured!!!");
        }
      }
    }
  };
  // goBack = () => {
  //   return history.push("/adminClientRfqList")
  // }


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
        {/* <div className="component-wrapper"> */}
        {/* <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            {" "}
            <Link to="/adminDashboard">Dashboard</Link> / Create New Training
          </div> */}
        <div className="" hidden={!this.state.isLoad} >
          <ReactLoader />
        </div>
        <div className="" hidden={this.state.isLoad}>
          <div className="main-container">

            <div className="createform-box sdw _fl">


              <div className="create-jeneral-wrap _fl">
                <div className="create-jeneral-info sdw _fl">
                  <div className="create-sb-head">
                    <div className="row">
                      <div className="col-md-6" style={{ display: "flex", alignItems: "center" }}>
                        <h3>GENERAL INFORMATION</h3>
                      </div>
                      <div className="col-md-4"></div>
                      <div className="col-md-2">
                        <button

                          style={{ textDecoration: "none", padding: "5px 10px 5px 10px", borderRadius: "10px", fontSize: "13px" }}
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
                            <React.Fragment> </React.Fragment>
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
                          {this.state.userType ===
                            UsersEnums.APPLICATION_ROLE.CLIENT ? (
                            <React.Fragment>
                              <div className="web-form-bx md4">
                                <div className="frm-label">
                                  Training Category *
                                </div>
                                <div className="bts-drop">
                                  <SelectBox
                                    optionData={
                                      this.state.allTrainingCategory
                                    }
                                    value={this.state.trainingCategory}
                                    onSelectChange={(value) =>
                                      this.trainingCategoryChange(value)
                                    }
                                  ></SelectBox>
                                </div>
                              </div>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <div className="web-form-bx">
                                <div className="frm-label">Course *</div>
                                <div className="bts-drop">
                                  <SelectBox
                                    optionData={
                                      this.state.allTrainingCourseType
                                    }
                                    value={
                                      this.state.selectedTrainingCourseType
                                    }
                                    onSelectChange={(value) =>
                                      this.trainingCourseTypeChange(value)
                                    }
                                  ></SelectBox>
                                </div>
                              </div>
                            </React.Fragment>
                          )}

                          <div className="web-form-bx">
                            <div className="frm-label">
                              Course Description *
                            </div>
                            <div className="bts-drop">
                              <p>
                                {this.state.courseDescription === ""
                                  ? "N/A"
                                  : this.state.courseDescription}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 wt-right">
                        <div className="web-form-app">
                          {this.state.userType === UsersEnums.APPLICATION_ROLE.CLIENT ? (<React.Fragment>
                            <div className="web-form-bx">
                              <div className="frm-label">Course *</div>
                              <div className="bts-drop">
                                <SelectBox
                                  optionData={
                                    this.state.allTrainingCourseType
                                  }
                                  value={
                                    this.state.selectedTrainingCourseType
                                  }
                                  onSelectChange={(value) =>
                                    this.trainingCourseTypeChange(value)
                                  }
                                ></SelectBox>
                              </div>
                            </div>
                          </React.Fragment>) : (<React.Fragment>
                            <div className="web-form-bx md4">
                              <div className="frm-label">Training Category *</div>
                              <div className="bts-drop">
                                <SelectBox
                                  optionData={this.state.allTrainingCategory}
                                  value={this.state.trainingCategory}
                                  onSelectChange={(value) =>
                                    this.trainingCategoryChange(value)
                                  }
                                ></SelectBox>
                              </div>
                            </div>
                          </React.Fragment>)}

                          <div className="web-form-bx md4">
                            <div className="frm-label">
                              Notes for{" "}
                              <span style={{ color: "#00a0df" }}>
                                7C Admin 
                              </span>
                            </div>
                            <textarea
                              rows="2"
                              placeholder="Enter description here"
                              className="in-textarea msg min"
                              value={this.state.adminNotes}
                              style={{
                                height: "100px",
                                color: "var(--grey)",
                                borderRadius: "10px",
                                boxShadow: "2px",
                                resize: "none",
                              }}
                              onChange={this.onAdminNotesChange}
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
                        <h3>Training Details</h3>
                      </div>
                    </div>
                  </div>
                  <div className="create-row-app">
                    <div className="row">
                      <div className="col-md-6 wt-left">
                        <div className="web-form-app">
                          <div className="web-form-bx">
                            <div className="frm-label">Format *</div>
                            {this.state.allTrainingFormat.map((data, i) => (
                              <div className="check-field">
                                <label className="checkbox_btn">
                                  <input
                                    type="radio"
                                    name="radio"
                                    checked={
                                      data.id === this.state.trainingFormat
                                        ? true
                                        : false
                                    }
                                    value={data.id}
                                    onChange={this.trainingFormatChange}
                                    disabled={true}
                                  />
                                  <span className="checkmark3"></span>{" "}
                                  {data.id === 30 ? "Online" : "Onsite"}
                                </label>
                              </div>
                            ))}
                            {/* <div className="check-field">
                                                                <label className="checkbox_btn">
                                                                    {this.state.trainingFormat ?
                                                                        <input type="radio" name="radio" checked={true} value="yes" onChange={this.trainingFormatChange} /> :
                                                                        <input type="radio" name="radio" checked={false} value="yes" onChange={this.trainingFormatChange} />}
                                                                    <span className="checkmark3"></span> Online</label>
                                                            </div>
                                                            <div className="check-field">
                                                                <label className="checkbox_btn">
                                                                    {this.state.trainingFormat ?
                                                                        <input type="radio" name="radio" checked={false} value="no" onChange={this.trainingFormatChange} /> :
                                                                        <input type="radio" name="radio" checked={true} value="no" onChange={this.trainingFormatChange} />}
                                                                    <span className="checkmark3"></span> Onsite</label>
                                                            </div> */}
                          </div>
                          <div className="web-form-bx">
                            <div className="frm-label">Requirement *</div>
                            <div className="form-input-fields">
                              <input
                                type="text"
                                placeholder="Enter objective for training"
                                className="textbox4"
                                style={{
                                  borderRadius: "9px",
                                  boxShadow:
                                    "0px 0px 4px 0px rgb(0 0 0 / 20%)",
                                }}
                                value={this.state.requirements}
                                onChange={this.trainingRequirementChange}
                              />
                            </div>
                          </div>
                          <div className="web-form-bx md4">
                            <div className="frm-label">
                              No. of Participants *
                            </div>
                            <div className="bts-drop">
                              <SelectBox
                                optionData={this.state.numbersOption}
                                value={this.state.selectedParticipants}
                                onSelectChange={(value) =>
                                  this.totalParticipantsChange(value)
                                }
                              ></SelectBox>
                            </div>
                          </div>
                          <div className="web-form-bx">
                            <div className="frm-label">
                              Who else should receive training alerts ? *
                            </div>
                            <input
                              type="text"
                              placeholder="Enter"
                              className="in-field2"
                              value={this.state.receiveAlertsMail}
                              onChange={this.receiveAlertsMailChange}
                            />
                          </div>
                          {this.state.trainingFormat === 31 ? (
                            <React.Fragment>
                              <div className="web-form-bx">
                                <div className="frm-label">
                                  Training Location *
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
                            </React.Fragment>
                          ) : (
                            <React.Fragment></React.Fragment>
                          )}
                          <div className="web-form-bx md4">
                            <div className="frm-label">
                              Notes for the trainer *
                            </div>
                            <textarea
                              rows="2"
                              placeholder="Enter description here"
                              className="in-textarea msg min"
                              value={this.state.trainerNotes}
                              style={{
                                height: "100px",
                                color: "var(--grey)",
                                borderRadius: "10px",
                                boxShadow: "2px",
                                resize: "none",
                              }}
                              onChange={this.trainerNotesChange}
                            ></textarea>
                          </div>
                          {this.state.trainingFormat === 31 ? (
                            <div className="web-form-bx">
                              <div className="frm-label">
                                Site Contact Phone Number *
                              </div>
                              <input
                                type="text"
                                value={this.state.onSiteContactPhone}
                                placeholder="Prefiled"
                                className="in-field2"
                                onChange={this.siteContactPhoneChange}
                              />
                            </div>
                          ) : (
                            <React.Fragment></React.Fragment>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 wt-right">
                        <div className="web-form-app">
                          <div className="web-form-bx">
                            <div className="frm-label">Date & Time *</div>
                            <div className="form-input-fields unstyled">
                              {/* <input
                                  type="date"
                                  id="from_datepicker"
                                  className="textbox4 d-icon"
                                  placeholder="10/25/2021"
                                  onChange={this.trainingDateChange}
                                  style={{
                                    borderRadius: "9px",
                                    boxShadow:
                                      "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                  }}
                                /> */}

                              <div className="input-group" style={{ width: "100%", borderRadius: "9px", height: "43px", border: "1px solid #ced4da", boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)" }}>
                                <div style={{ width: "80%", padding: "8px" }}>
                                  <span>{this.state.trainingDate}</span>
                                </div>
                                <div style={{ width: "20%" }}>
                                  <a style={{ float: "right" }}><DatePicker minDate={new Date()} onChange={(date) => this.trainingDateChange(date)} customInput={(<Schedule />)} /></a>
                                </div>
                              </div>
                            </div>

                            <div className="t-time">
                              <span className="t1">
                                <small>
                                  <img src={ImageName.IMAGE_NAME.U_IMG} alt="" style={{ cursor: "pointer" }} onClick={this.hourChangeUp} /><br />
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
                                    onClick={this.hourChange}
                                  />
                                </small>
                              </span>
                              <span className="t2">
                                <small>
                                  <img src={ImageName.IMAGE_NAME.U_IMG} alt="" style={{ cursor: "pointer" }} onClick={this.minChangeUp} /><br />
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
                                    onClick={this.minChange}
                                  />
                                </small>
                              </span>
                              <span
                                className="t3"
                                style={{ marginLeft: "2%" }}
                              >
                                <small>
                                  <img src={ImageName.IMAGE_NAME.U_IMG} alt="" style={{ cursor: "pointer" }} onClick={this.ampmChange} /><br />
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
                          <div className="web-form-bx">
                            <div className="frm-label">Duration</div>
                            <div className="bts-drop">
                              <p>{this.state.trainingDuration}</p>
                              {/* <SelectBox
                                                                    optionData={this.state.allTrainingDuration}
                                                                    value={this.state.selectedTrainingDuration}
                                                                    onSelectChange={(value) => this.trainingDurationChange(value)}
                                                                >

                                                                </SelectBox> */}
                            </div>
                          </div>
                          <div className="web-form-bx">
                            <div className="frm-label">Budget $ *</div>
                            <input
                              type="text"
                              placeholder="Enter"
                              className="in-field2"
                              value={this.state.budget}
                              onChange={this.onBudgetChange}
                            />
                          </div>
                          <div className="web-form-bx">
                            <div className="frm-label">
                              Gender Preference(If any)
                            </div>
                            <div className="bts-drop">
                              <SelectBox
                                optionData={this.state.allGenderOption}
                                value={this.state.selectedGender}
                                onSelectChange={(value) =>
                                  this.genderChange(value)
                                }
                              ></SelectBox>
                            </div>
                          </div>
                          {this.state.trainingFormat === 31 ? (
                            <div className="web-form-bx">
                              <div className="frm-label">Onsite Contact *</div>
                              <div className="form-input-fields">
                                <input
                                  type="text"
                                  placeholder="Enter Name"
                                  className="textbox4"
                                  style={{
                                    borderRadius: "9px",
                                    boxShadow:
                                      "0px 0px 4px 0px rgb(0 0 0 / 20%)",
                                  }}
                                  value={this.state.onsiteContact}
                                  onChange={this.onSiteContactChange}
                                />
                              </div>
                            </div>
                          ) : (
                            <React.Fragment></React.Fragment>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row m20">
                  <div className="col-md-12 text-center">
                    {/* <button type="submit" className="cn_btn" onClick={this.goBack}>
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
      <img style={{ width: "35px", height: "37px", borderRadius: "4px", cursor: "pointer" }} src={ImageName.IMAGE_NAME.CALENDER4} onClick={onClick} />
    );
  }
}