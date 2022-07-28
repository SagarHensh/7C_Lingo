import React from "react";
import { ImageName } from "../../../../enums";
import { SelectBox } from "../../../Admin/SharedComponents/inputText";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select, { components } from "react-select";
import { consoleLog, getLanguageArray, getLookUpDataFromAPI, phoneNumberCheck, SetDatabaseDateFormat, SetUSAdateFormat, SetUSAdateFormatV2 } from "../../../../services/common-function";
import { mobileNumberValidator, numberValidator, timeValidator } from "../../../../validators";
import { Decoder } from "../../../../services/auth";
import { ApiCall } from "../../../../services/middleware";
import { ErrorCode } from "../../../../services/constant";
import { IMAGE_PATH_ONLY } from "../../../../services/config/api_url";
import history from "../../../../history";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import Lottie from "lottie-react";
import loader from "./loader.json";
import LotteLoader from "../../../Loader/LotteLoader";
import { Link } from "react-router-dom";


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

const style = {
    height: 400,
    width: 400,
    marginTop: "10%"
};

export default class FollowUpJobs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientId: '',
            mainData: {},
            countryCode: 1,
            allAppointmentType: [],
            selectedAppointmentType: {},
            appointmentType: '',
            imagePath: ImageName.IMAGE_NAME.PROFILE_PIC,
            allJobType: [],
            selectedJobType: {},
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
            onSiteContactPhone: "",
            allLanguage: [],
            selectedLanguage: {},
            language: '',
            numbersOption: [],
            jobDurationValue: 1,
            allJobDuration: jobDuration,
            selectedJobDuration: {
                label: "Hour",
                value: "Hour",
            },
            jobDurationLimit: "Hour",
            additionalInfoNotes: "",
            isLoad: true
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let authData = localStorage.getItem("AuthToken");
        let authUser = Decoder.decode(authData);
        this.setState({
            clientId: authUser.data.userid
        })
        let mainData = this.props.location,
            preData = mainData.state;
        consoleLog("ALl main data", preData);
        if (preData === undefined) {
            return history.push("/clientAllJobs");
        } else {
            this.load();
        }
        // this.load();
    }

    load = async () => {
        let allLookupValue = [],
            allServiveArr = [],
            selectedJobType = {},
            jobType = "",
            imagePath = "",
            allAppointmentType = [],
            selectedAppointmentType = {},
            appointmentType = '',
            allLanguageArr = [],
            selectedLanguage = {},
            language = "",
            allJobType = [],
            jobDetails = {},
            appointmentDate = '',
            locationDataObj = {},
            selectedJobDuration = {},
            jobDurationLimit = "",
            jobDurationValue = 1;



        allLanguageArr = await getLanguageArray();

        allLookupValue = await getLookUpDataFromAPI();

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

        allLookupValue.INDUSTRY_TYPE.map((data) => {
            allJobType.push({
                label: data.name,
                value: data.id,
                imagePath: data.others,
            });
        });

        // ============ Get Job details ============

        let mainData = this.props.location,
            preData = mainData.state;
        this.setState({
            requestId: preData,
        });

        let detailData = {
            jobId: preData,
        };
        let editRes = await ApiCall("fetchJobDetails", detailData);
        if (
            editRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            editRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            let detailPayload = Decoder.decode(editRes.data.payload);
            consoleLog("Client Job details:", detailPayload);
            if (detailPayload.data.jobDetails) {
                jobDetails = detailPayload.data.jobDetails;

                allAppointmentType.map((data) => {
                    if (data.value == jobDetails.appointmentType) {
                        selectedAppointmentType = data;
                        appointmentType = data.value
                    }
                })

                allJobType.map((data) => {
                    if (data.value == jobDetails.jobTypeId) {
                        selectedJobType = data;
                        jobType = data.value;
                        imagePath = IMAGE_PATH_ONLY + data.imagePath;
                    }
                })

                allLanguageArr.map((data) => {
                    if (data.value == jobDetails.targetLanguage) {
                        selectedLanguage = data;
                        language = data.value
                    }
                })

                this.getTimeFieldData(jobDetails.scheduleTime);
                appointmentDate = SetUSAdateFormatV2(jobDetails.scheduleDate);

                // ...........location .................
                let arrData = [];
                let locationData = [];
                let locationRes = await ApiCall("getlocaiondescription", {
                    place: jobDetails.location,
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

                let jd = jobDetails.duration.split(" ");
                if (jd[1] != "") {
                    this.state.allJobDuration.map((jj) => {
                        if (jj.value == jd[1]) {
                            selectedJobDuration = jj;
                            jobDurationLimit = jj.value;
                        }
                    })
                }
                jobDurationValue = jd[0];
                this.setState({
                    onsiteContact: jobDetails.siteContact,
                    onSiteContactPhone: this.formatPhoneNumber(jobDetails.siteContactPhone),
                    selectedJobDuration: selectedJobDuration,
                    jobDurationLimit: jobDurationLimit,
                    jobDurationValue: jobDurationValue,
                    jobNotes: jobDetails.noteForAdmin,
                    additionalInfoNotes: jobDetails.note,
                    isLoad: false
                })
            }
        } else {
            toast.error(editRes.message);
        }

        this.setState({
            allJobType: allJobType,
            selectedJobType: selectedJobType,
            jobType: jobType,
            imagePath: imagePath,
            allAppointmentType: allAppointmentType,
            selectedAppointmentType: selectedAppointmentType,
            appointmentType: appointmentType,
            allLanguage: allLanguageArr,
            selectedLanguage: selectedLanguage,
            language: language,
            appointmentDate: appointmentDate,
            locationData: locationDataObj
        })
    }

    getTimeFieldData = (value) => {
        let aa = value.split(":"),
            hr = '',
            mn = '',
            ampm = '';
        if (aa[0] >= 12) {
            if (aa[0] > 12) {
                hr = aa[0] - 12;
                hr = hr > 9 ? hr : '0' + hr;
            } else {
                hr = aa[0];
            }
            ampm = "PM"
        } else {
            if (aa[0] == "00") {
                hr = 12;
            } else {
                hr = aa[0];
            }
            ampm = "AM"
        }

        mn = aa[1];

        this.setState({
            hour: hr,
            min: mn,
            ampm: ampm
        })
    }

    appointmentTypeChange = (value) => {
        // consoleLog("selected Appointment", value);
        this.setState({
            selectedAppointmentType: value,
            appointmentType: value.value,
            locationData: {},
            locationArr: [],
            onsiteContact: "",
            onSiteContactPhone: "+" + 1 + " ",
        });
    };

    languageChange = (value) => {
        // console.log("selected Client",value);
        this.setState({
            selectedLanguage: value,
            language: value.value,
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



    jobTypeChange = (value) => {
        // consoleLog("selected Client",value);
        this.setState({
            jobType: value.value,
            selectedJobType: value,
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

    hourInputChange = (e) => {
        if (timeValidator(e.target.value)) {
            this.setState({
                hour: e.target.value,
            });
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
                min: e.target.value,
            });
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
        this.setState({
            onSiteContactPhone: this.formatPhoneNumber(e.target.value)
        })
        // let value = e.target.value;
        // if (numberValidator(value) === true) {
        //     if (mobileNumberValidator(value) === true) {
        //         let phoneCheck = phoneNumberCheck(value);
        //         if (phoneCheck) {
        //             this.setState({
        //                 onSiteContactPhone: phoneCheck,
        //             });
        //         }
        //     }
        // }

    };

    formatPhoneNumber = (phoneNumberString) => {
        var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return match[1] + "-" + match[2] + "-" + match[3];
        } else {
            let newPhNum = "";
            for (let i = 0; i < cleaned.length; i++) {
                if (i === 3 || i === 6) {
                    newPhNum = newPhNum + "-";
                } else if (i >= 10) {
                    break;
                }
                newPhNum = newPhNum + cleaned.substr(i, 1);
            }
            return newPhNum;
        }
    }

    additionalInfoChange = (e) => {
        this.setState({
            additionalInfoNotes: e.target.value
        })
    }

    onSubmitFollowUp = async () => {
        let modHour =
            (this.state.hour === "" ? Number("00") : this.state.hour) +
            ":" +
            (this.state.min === "" ? Number("00") : this.state.min) +
            " " +
            this.state.ampm;
        var dt = moment(modHour, ["h:mm A"]).format("HH:mm");

        let errorCounter = 0;
        if (this.state.appointmentType == "") {
            toast.error("Please Select Appointment Type");
            errorCounter++;
            return false;
        } else if (this.state.jobType == "") {
            toast.error("Please Select Job Type");
            errorCounter++;
            return false;
        } else if (this.state.language == "") {
            toast.error("Please Select Language");
            errorCounter++;
            return false;
        } else if (this.state.additionalInfoNotes == "") {
            toast.error("Please Input Additional Info");
            errorCounter++;
            return false;
        } else if (this.state.jobNotes == "") {
            toast.error("Please Input Notes");
            errorCounter++;
            return false;
        } else if (this.state.appointmentDate == "") {
            toast.error("Please Select Appointment Date");
            errorCounter++;
            return false;
        } else if (this.state.appointmentType == 63) {
            if (Object.keys(this.state.selectLocation).length == 0) {
                toast.error("Please select location");
                errorCounter++;
            } else if (this.state.onsiteContact == "") {
                toast.error("Please Enter Onsite Contact Name");
                errorCounter++;
            } else if (this.state.onSiteContactPhone === "") {
                toast.error("Please Enter Onsite Contact Phone");
                errorCounter++;
            }
        }

        if (errorCounter == 0) {

            let req = {
                "requestId": this.state.requestId,
                "clientId": this.state.clientId,
                "appointmentType": this.state.appointmentType,
                "jobType": this.state.jobType,
                "targetLanguage": [this.state.language],
                "interpreterNote": this.state.additionalInfoNotes,
                "note": this.state.jobNotes,
                "appointmentLocation": Object.keys(this.state.selectLocation).length > 0 ? this.state.selectLocation.locationName : "",
                "locationLat": Object.keys(this.state.selectLocation).length > 0 ? this.state.selectLocation.lat : null,
                "locationLng": Object.keys(this.state.selectLocation).length > 0 ? this.state.selectLocation.long : null,
                "locationId": Object.keys(this.state.selectLocation).length > 0 ? this.state.selectLocation.locationId : null,
                "scheduledDate": SetDatabaseDateFormat(this.state.appointmentDate),
                "scheduledTime": dt + ":00",
                "siteContact": this.state.onsiteContact,
                "siteContactMobile": this.state.onSiteContactPhone
            }

            // consoleLog("Request DAta for followup:", req);
            let res = await ApiCall("followUpJobs", req);
            if (
                res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
            ) {
                toast.success("Job schedule successfully");
                return history.push("/clientJobsHistory")
            } else {
                toast.error(res.message);
            }
        }
    }

    backButton = () => {
        return history.push("/clientJobsHistory")
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
                <div class="component-wrapper" hidden={!this.state.isLoad}>
                    {/* <center><Lottie animationData={loader} loop={true} style={style} /></center> */}
                    <LotteLoader />
                </div>
                <div class="component-wrapper" hidden={this.state.isLoad}>
                    <ToastContainer hideProgressBar theme="colored" />
                    <div
                        className="vn_frm"
                        style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
                    >
                        {" "}
                        <Link to="/clientDashboard">Dashboard</Link> /{" "}
                        <Link to="/clientJobsHistory">All Jobs</Link> / Follow Up Appointment
                    </div>
                    <div class="createform-box sdw _fl" style={{ width: "70%" }}>
                        <div class="create-form-dashboard">
                            <h2>FOLLOW UP APPOINTMENT</h2>
                            <div class="create-form _fl">
                                <div className="row">
                                    <div className="col-md-6">
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
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 wt-left">
                                        <div className="web-form-bx md4">
                                            <div className="frm-label">Job Type *</div>
                                            <div className="bts-drop">
                                                <SelectBox
                                                    optionData={this.state.allJobType}
                                                    value={this.state.selectedJobType}
                                                    onSelectChange={(value) =>
                                                        this.jobTypeChange(value)
                                                    }
                                                ></SelectBox>
                                            </div>
                                        </div>
                                        <div className="web-form-bx">
                                            <div className="frm-label">Language *</div>
                                            <div className="bts-drop">
                                                <SelectBox
                                                    optionData={this.state.allLanguage}
                                                    value={this.state.selectedLanguage}
                                                    onSelectChange={(value) =>
                                                        this.languageChange(value)
                                                    }
                                                ></SelectBox>
                                            </div>
                                        </div>

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

                                        {this.state.appointmentType === 63 ? (
                                            <div className="web-form-bx">
                                                <div className="frm-label">
                                                    Onsite Contact *
                                                </div>
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

                                        <div className="web-form-bx md4">
                                            <div className="frm-label">
                                                Notes
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
                                    </div>
                                    <div className="col-md-6 wt-right">
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


                                        <div className="web-form-bx md4">
                                            <div className="frm-label">
                                                Additional info about the job
                                            </div>
                                            <textarea
                                                rows="2"
                                                placeholder=""
                                                className="in-textarea msg min"
                                                value={this.state.additionalInfoNotes}
                                                style={{
                                                    height: "100px",
                                                    color: "var(--grey)",
                                                    borderRadius: "10px",
                                                    boxShadow: "2px",
                                                    resize: "none",
                                                }}
                                                onChange={this.additionalInfoChange}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="m20">
                                    <div className="text-center">
                                        <button type="submit" className="cn_btn"
                                            onClick={() => this.backButton()}
                                        >
                                            CANCEL
                                        </button>
                                        <button
                                            type="submit"
                                            className="sv_btn"
                                            onClick={() => {
                                                this.onSubmitFollowUp();
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
            </React.Fragment>
        )
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
