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
  SetDatabaseDateFormat,
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
import moment from "moment";

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

export default class CreateNewTraining extends React.Component {
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
      trainingCategory: "",
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
      onSiteContactPhone: "+" + 1 + " ",

      userType: 0,
      currentTimeZone : Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  componentDidMount() {
    let authData = localStorage.getItem("AuthToken");
    let authUser = Decoder.decode(authData);

    if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT) {

      this.getRequesterData(authUser.data.userid);
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
      allTrainingData = [];

    allClientArr = await getClientInfo();

    allLookupValue = await getLookUpDataFromAPI();
    // console.log("All Lookupdata", allLookupValue);

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
    });

    let res = await ApiCall("getCourseWithCategory");
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      console.log("resData>>>", payload);
      allTrainingData = payload.data;
      if (payload.data.length > 0) {
        payload.data.map((data) => {
          allCategoryType.push({
            label: data.name,
            value: data.id,
          });
        });
      }
    }

    this.setState({
      allClientArr: allClientArr,
      allServiveArr: allServiveArr,
      allGenderOption: allGenterType,
      allTrainingFormat: allTrainingFormat,
      allTrainingCategory: allCategoryType,
      allTrainingData: allTrainingData,
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
    });
    this.getRequesterData(value.value);
  };
  requesterChange = (val) => {
    this.setState({
      selectedRequester: val,
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

    this.setState({
      trainingCategory: value.value,
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

  hourInputChange = (e) => {
    if (timeValidator(e.target.value)) {
      this.setState({
        hour: e.target.value
      })
    }
  }

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
      validateClient = inputEmptyValidate(this.state.client),
      validateTrainingCategory = inputEmptyValidate(
        this.state.trainingCategory
      ),
      validateTrainingCourse = inputEmptyValidate(
        this.state.trainingCourseType
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
        let modHour = (this.state.hour === "" ? Number("00") : this.state.hour) + ":" + (this.state.min === "" ? Number("00") : this.state.min) + " " + this.state.ampm;
        var dt = moment(modHour, ["h:mm A"]).format("HH:mm");


        let finalData = {
          clientId: authUser.data.userid,
          serviceTypeId: this.state.service,
          trainingCatId: this.state.trainingCategory,
          courseId: this.state.trainingCourseType,
          noteForAdmin: this.state.adminNotes,
          trainingFormatId: this.state.trainingFormat,
          scheduleDate: SetDatabaseDateFormat(this.state.trainingDate),
          scheduleTime: dt + ":00",
          requirement: this.state.requirements,
          noOfParticipants: this.state.totalParticipants,
          totalDuration: this.state.trainingDuration,
          alertEmail: this.state.receiveAlertsMail,
          budget: this.state.budget,
          location: this.state.locationData.label
            ? this.state.locationData.label
            : "",
          genderPref: this.state.gender,
          noteForTrainer: this.state.trainerNotes,
          siteContactNo: this.state.onSiteContactPhone,
          siteContactName: this.state.onsiteContact,
          requester: this.state.selectedRequester.value,
          timeZone : this.state.currentTimeZone
        };

        console.log("Final Submit data >>>>>", finalData);

        let res = await ApiCall("createTraining", finalData);
        if (
          res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          toast.success("Training created successfully");
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
        let modHour = (this.state.hour === "" ? Number("00") : this.state.hour) + ":" + (this.state.min === "" ? Number("00") : this.state.min) + " " + this.state.ampm;
        var dt = moment(modHour, ["h:mm A"]).format("HH:mm");

        let finalData = {
          clientId: this.state.client,
          serviceTypeId: this.state.service,
          trainingCatId: this.state.trainingCategory,
          courseId: this.state.trainingCourseType,
          noteForAdmin: this.state.adminNotes,
          trainingFormatId: this.state.trainingFormat,
          scheduleDate: SetDatabaseDateFormat(this.state.trainingDate),
          scheduleTime: dt + ":00",
          requirement: this.state.requirements,
          noOfParticipants: this.state.totalParticipants,
          totalDuration: this.state.trainingDuration,
          alertEmail: this.state.receiveAlertsMail,
          budget: this.state.budget,
          location: this.state.locationData.label
            ? this.state.locationData.label
            : "",
          genderPref: this.state.gender,
          noteForTrainer: this.state.trainerNotes,
          siteContactNo: this.state.onSiteContactPhone,
          siteContactName: this.state.onsiteContact,
          requester: this.state.selectedRequester.value,
          timeZone : this.state.currentTimeZone
        };

        // console.log("Final Submit data >>>>>", finalData);

        let res = await ApiCall("createTraining", finalData);
        if (
          res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          toast.success("Training created successfully");
          return history.push("/adminClientRfqList");
        } else {
          toast.error(res.message);
        }
      }
    }
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
    return (
      <React.Fragment>
        <ToastContainer hideProgressBar theme="colored" />
        <div className="component-wrapper">
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            {" "}
            <Link to={this.state.userType === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN ? "/adminDashboard" : "/clientDashboard"}>Dashboard</Link> / Create New Training
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
                          Create new project (TRAINING)
                        </Link>
                      </h2>
                    </div>
                    <div className="col-md-6">
                      <div className="web_btn f-right">
                        <a
                          href="javascript:void(0)"
                          style={{ textDecoration: "none" }}
                        >
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
                                // value={this.state.message}
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
                              <div className="frm-label">Requirement</div>
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
                                  onChange={this.trainingRequirementChange}
                                />
                              </div>
                            </div>
                            <div className="web-form-bx md4">
                              <div className="frm-label">
                                No. of Participants
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
                                Notes For The Trainer
                              </div>
                              <textarea
                                rows="2"
                                placeholder="Enter description here"
                                className="in-textarea msg min"
                                // value={this.state.trainerNotes}
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
                                  Site Contact Phone Number
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
                                    <img src={ImageName.IMAGE_NAME.U_IMG} alt="" style={{ cursor: "pointer" }} onClick={this.hourChange} /><br />
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
                                    <img src={ImageName.IMAGE_NAME.U_IMG} alt="" style={{ cursor: "pointer" }} onClick={this.minChange} /><br />
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
                              <div className="frm-label">Duration *</div>
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
                              <div className="frm-label">Budget ($) *</div>
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
                                Gender Preference (If any)
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
                                <div className="frm-label">Onsite Contact</div>
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

                  <div className="m20">
                    <div className="text-center">
                      <button type="submit" className="cn_btn">
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
      <img style={{ width: "35px", height: "37px", borderRadius: "4px", cursor: "pointer" }} src={ImageName.IMAGE_NAME.CALENDER4} onClick={onClick} />
    );
  }
}