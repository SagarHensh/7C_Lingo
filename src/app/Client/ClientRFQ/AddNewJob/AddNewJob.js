import React from "react";
import { Link } from "react-router-dom";
import { ImageName } from "../../../../enums";
import { Decoder } from "../../../../services/auth";
import { consoleLog, getClientInfo, getCountryList, getLanguageArray, getLookUpDataFromAPI, phoneNumberCheck, SetDOBFormat } from "../../../../services/common-function";
import { ApiCall } from "../../../../services/middleware";
import { MultiSelectBox, SelectBox } from "../../../Admin/SharedComponents/inputText";
import Select, { components } from "react-select";
import { ErrorCode } from "../../../../services/constant";
import { inputEmptyValidate, mobileNumberValidator, numberValidator } from "../../../../validators";
import { ToastContainer, toast } from "react-toastify";
import history from "../../../../history";


// For Dropdown

const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <img
                src={ImageName.IMAGE_NAME.LOCATION}
                style={{ width: "17px" }}
            />
        </components.DropdownIndicator>
    );
};

const jobDuration = [
    {
        label: "1:00 Hour",
        value: "1 Hour"
    },
    {
        label: "2:00 Hour",
        value: "2 Hour"
    },
    {
        label: "3:00 Hour",
        value: "3 Hour"
    },
    {
        label: "5:00 Hour",
        value: "5 Hour"
    },
    {
        label: "10:00 Hour",
        value: "10 Hour"
    },
    {
        label: "20:00 Hour",
        value: "20 Hour"
    },
    {
        label: "1 Day",
        value: "1 Day"
    },
    {
        label: "2 Day",
        value: "2 Day"
    },
    {
        label: "3 Day",
        value: "3 Day"
    }
]

export default class AddNewJob extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countryCode: 1,
            imagePath: ImageName.IMAGE_NAME.PROFILE_PIC,
            numbersOption: [],
            allClientArr: [],
            selectedClient: {},
            client: '',
            allServiceArr: [],
            selectedService: {
                label: "Interpretation",
                value: 45
            },
            service: 45,
            allAppointmentType: [],
            selectedAppointmentType: {},
            appointmentType: "",
            allLanguage: [],
            selectedSourceLanguage: {
                label: "English",
                value: 110
            },
            selectedTargetLanguage: {},
            sourceLanguage: 110,
            targetLanguage: [],
            selectedRequiredInterpreter: {
                label: 1,
                value: 1
            },
            interpreterRequiredNumber: 1,
            interpreterCheckIn: false,
            allJobType: [],
            jobType: '',
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
                valye: 231
            },
            allGenderOption: [],
            selectedLeiGender: {},
            selectedLeiLanguage: {},
            allJobDuration: jobDuration,
            selectedJobDuration: {
                label: "1:00 Hour",
                value: "1 Hour"
            },
            jobDuration: "1 Hour",
            clientName: "",
            clientPhone: "",
        }
    }

    componentDidMount() {
        let arr = [];
        for (let i = 0; i < 10; i++) {
            arr.push({
                label: i + 1,
                value: i + 1
            });
        }
        this.setState({
            numbersOption: arr
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
                value: data.id
            })
        });

        allLookupValue.SCHEDULE_TYPE.map((data) => {
            if (data.id === 63) {
                allAppointmentType.push({
                    label: <div><img src={ImageName.IMAGE_NAME.F2F} height="30px" width="25px" style={{ float: "Left" }} /><span style={{ paddingLeft: "5%" }}>{data.name}</span></div>,
                    value: data.id
                })
            } else if (data.id === 64) {
                allAppointmentType.push({
                    label: <div><img src={ImageName.IMAGE_NAME.VRI_ICON} height="30px" width="25px" style={{ float: "Left" }} /><span style={{ paddingLeft: "5%" }}>{data.name}</span></div>,
                    value: data.id
                })
            } else if (data.id === 65) {
                allAppointmentType.push({
                    label: <div><img src={ImageName.IMAGE_NAME.OPI_ICON} height="30px" width="25px" style={{ float: "Left" }} /><span style={{ paddingLeft: "5%" }}>{data.name}</span></div>,
                    value: data.id
                })
            }
        })

        allLookupValue.INDUSTRY_TYPE.map((data) => {
            allJobType.push({
                label: data.name,
                value: data.id
            })
        })

        allLookupValue.GENDER_TYPE.map((data) => {
            allGenterType.push({
                label: data.name,
                value: data.id
            })
        })

        allLanguageArr = await getLanguageArray();

        let resCountry = await getCountryList();
        // console.log("Country List>>>>>", resCountry);
        resCountry.map((data) => {
            allCountryList.push({
                label: data.name,
                value: data.id
            })
        })



        this.setState({
            allClientArr: allClientArr,
            allServiveArr: allServiveArr,
            allAppointmentType: allAppointmentType,
            allLanguage: allLanguageArr,
            allJobType: allJobType,
            allCountryOption: allCountryList,
            allGenderOption: allGenterType
        })
    }

    getLEIdata = async (data) => {
        let arr = [];
        let res = await ApiCall("fetchLeiByClient", data);
        if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = await Decoder.decode(res.data.payload);
            // console.log("PAyload>>>", payload.data);
            if (payload.data.leiList.length > 0) {
                payload.data.leiList.map((ldata) => {
                    arr.push({
                        label: ldata.name,
                        value: ldata.userId
                    })
                })
            }
            this.setState({
                allLeiList: payload.data.leiList,
                leiOptionList: arr
            });
        }
    }

    getClientData = async (value) => {
        let data = {
            clientid: value.value
        },
            userInfo = [];
        let res = await ApiCall("fetchclientinfo", data);
        if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = Decoder.decode(res.data.payload);
            // console.log("Client Data>>>>>>>", payload);
            if (payload.data.length > 0) {
                if (payload.data[0].userInfo && payload.data[0].userInfo.length > 0) {
                    userInfo = payload.data[0].userInfo[0];
                    this.setState({
                        clientName: userInfo.clientName,
                        clientPhone: userInfo.adminPhone
                    })
                }
            }
        }
    }

    clientChange = (value) => {
        // console.log("selected Client",value);
        this.setState({
            selectedClient: value,
            client: value.value
        });

        let data = {
            clientId: value.value
        }

        this.getLEIdata(data);
        this.getClientData(value);
    }

    appointmentTypeChange = (value) => {
        // consoleLog("selected Appointment", value);
        this.setState({
            selectedAppointmentType: value,
            appointmentType: value.value,
            interpreterCheckIn: false,
            locationData: {},
            locationArr: [],
            onsiteContact: "",
            onSiteContactPhone: "+" + 1 + " ",
        })
    }

    sourceLanguageChange = (value) => {
        // console.log("selected Client",value);
        this.setState({
            selectedSourceLanguage: value,
            sourceLanguage: value.value
        })
    }

    targetLanguageChange = (value) => {
        let arr = [];
        let dd = value.value;
        arr.push(dd);
        this.setState({
            selectedTargetLanguage: value,
            targetLanguage: arr
        })
    }

    requiredInterpreterChange = (value) => {
        // console.log("selected Client",value);
        this.setState({
            selectedRequiredInterpreter: value,
            interpreterRequiredNumber: value.value
        })
    }

    interpreterCheckIn = (e) => {
        // console.log("e.target.value", e.target.value);
        if (e.target.value === "yes") {
            this.setState({
                interpreterCheckIn: true,
                onsiteContact: this.state.clientName,
                onSiteContactPhone: "+1" + " " + this.state.clientPhone
            })
        } else {
            this.setState({
                interpreterCheckIn: false,
                onsiteContact: "",
                onSiteContactPhone: "+1"
            })
        }
    }

    jobTypeChange = (value) => {
        // console.log("selected Client",value);
        this.setState({
            jobType: value.value,
            imagePath: value.value === 13 ? ImageName.IMAGE_NAME.MEDICAL_ICON_1 : ImageName.IMAGE_NAME.LEAGAL_ICON
        })
    }

    onJobNotesChange = (e) => {
        this.setState({
            jobNotes: e.target.value
        })
    }

    jobDurationChange = (value) => {
        // console.log("selected Client",value);
        this.setState({
            selectedJobDuration: value,
            jobDuration: value.value
        })
    }

    appointmentsNotesChange = (e) => {
        this.setState({
            appointmentNotes: e.target.value
        })
    }

    appointmentdateChange = (e) => {
        this.setState({
            appointmentDate: e.target.value
        })
    }

    hourChange = () => {
        let hr = parseInt(this.state.hour) + 1;
        if (parseInt(this.state.hour) + 1 > 12) {
            this.setState({
                hour: "01"
            })
        } else {
            if (parseInt(this.state.hour) + 1 > 9) {
                this.setState({
                    hour: hr
                })
            } else {
                this.setState({
                    hour: "0" + hr
                })
            }
        }
    }

    minChange = () => {
        let min = parseInt(this.state.min) + 1;
        if (parseInt(this.state.min) + 1 > 59) {
            this.setState({
                min: "00"
            })
        } else {
            if (parseInt(this.state.min) + 1 > 9) {
                this.setState({
                    min: min
                })
            } else {
                this.setState({
                    min: "0" + min
                })
            }
        }
    }

    ampmChange = () => {
        if (this.state.ampm === "AM") {
            this.setState({
                ampm: "PM"
            })
        } else {
            this.setState({
                ampm: "AM"
            })
        }
    }


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
            locationData: value
        })
    }

    onSiteContactNameChange = (e) => {
        this.setState({
            onsiteContact: e.target.value
        })
    }

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
    }

    countrySpecific = (e) => {
        if (e.target.value === "yes") {
            this.setState({
                countrySpecificDialect: true
            })
        } else {
            this.setState({
                countrySpecificDialect: false
            })
        }
    }

    prefferedInterpreter = (e) => {
        if (e.target.value === "yes") {
            this.setState({
                havePrefferedInterpreter: true
            })
        } else {
            this.setState({
                havePrefferedInterpreter: false
            })
        }
    }

    leiChange = (value) => {
        // console.log("selected Client",value);
        this.setState({
            selectedLei: value,
            leiId: value.value
        });

        this.state.allLeiList.map((data) => {
            if (data.userId === value.value) {
                let gender = {},
                    language = {};

                this.state.allGenderOption.map((gn) => {
                    if (gn.value === data.genderTypeId) {
                        gender = {
                            label: gn.label,
                            value: gn.value
                        }
                    }
                })

                this.state.allLanguage.map((ln) => {
                    if (ln.value === data.languageId) {
                        language = {
                            label: ln.label,
                            value: ln.value
                        }
                    }
                })

                this.setState({
                    leiDob: data.dob,
                    leiPhone: "+" + data.countryCode + " " + data.mobile,
                    leiReference: data.reference,
                    leiEmail: data.email,
                    leiLanguage: data.languageId,
                    leiGender: data.genderTypeId,
                    selectedLeiGender: gender,
                    selectedLeiLanguage: language,
                    leiCountryCode: data.countryCode,
                    countrySpecificDialect: true,
                    havePrefferedInterpreter: false,
                })
            }
        })
    }

    onLeiAdd = () => {
        return history.push("/adminAddClientContact");
    }

    onSubmit = async () => {
        let errorCounter = 0,
            validateClient = inputEmptyValidate(this.state.client),
            validateAppointmentType = inputEmptyValidate(this.state.appointmentType),
            validateJobType = inputEmptyValidate(this.state.jobType),
            validateNoOfInterpreter = inputEmptyValidate(this.state.interpreterRequiredNumber),
            validateSourceLanguage = inputEmptyValidate(this.state.sourceLanguage),
            validateTargetLanguage = inputEmptyValidate(this.state.targetLanguage),
            validateleiId = inputEmptyValidate(this.state.leiId);

        if (!validateClient) {
            toast.error("Please select a client");
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
        } else if (!validateleiId) {
            toast.error("Please select LEI");
            errorCounter++;
            return false;
        }

        if (errorCounter === 0) {
            // consoleLog("Location>>>", this.state.locationData)
            let finalData = {
                clientId: this.state.client.toString(),
                appointmentType: this.state.appointmentType.toString(),
                jobType: this.state.jobType.toString(),
                noOfInterpreter: this.state.interpreterRequiredNumber.toString(),
                note: this.state.jobNotes,
                sourceLanguage: this.state.sourceLanguage.toString(),
                targetLanguage: this.state.targetLanguage,
                interpreterNote: this.state.appointmentNotes,
                appointmentLocation: this.state.locationData.label===undefined ? "" : this.state.locationData.label,
                duration: this.state.jobDuration,
                scheduledDate: SetDOBFormat(this.state.appointmentDate),
                scheduledTime: this.state.hour + ":" + this.state.min + ":00",
                siteContact: this.state.onsiteContact,
                siteContactMobile: this.state.onSiteContactPhone.substring(3, 14),
                leiId: this.state.leiId.toString(),
                leiDOB: this.state.leiDob,
                leiCountryCode: this.state.leiCountryCode,
                leiMobile: this.state.leiPhone.substring(3, 14),
                leiEmail: this.state.leiEmail,
                leiGender: this.state.leiGender.toString(),
                leiReference: this.state.leiReference,
                leiCountry: this.state.leiCountry.toString(),
                leiPreferredLanguage: this.state.leiLanguage,
                countryDialect: this.state.countrySpecificDialect ? "1" : "0",
                interpreterCheck: this.state.interpreterCheckIn ? "1" : "0"
            }

            // console.log("Final Submit data >>>>>", finalData);

            let res = await ApiCall("createInterPretationJobFromAdmin", finalData);
            if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                toast.success("Job requested successfully");
                return history.push("/adminClientRfqList");
            } else {
                toast.error("Error occured!!!")
            }
        }
    }


    render() {
        const customStylesDropdown = {
            control: (styles) => ({
                ...styles,
                backgroundColor: "white",
                boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                borderRadius: "10px",
                height: 45,
                minHeight: 45
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

                    <div className="create-new-job-wrap">
                        <div className="main-container">
                            <div className="createform-box sdw _fl">
                                <div className="create-head">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h2><Link to="/adminDashboard" style={{ textDecoration: "none" }}>Create new job (INTERPRETATION)</Link></h2>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="web_btn f-right">
                                                <a href="" style={{ textDecoration: "none" }}>RESET</a>
                                                <a href="#" style={{ textDecoration: "none" }} className="blue" onClick={() => { this.onSubmit() }}>SUBMIT</a>
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
                                                        <div className="web-form-bx">
                                                            <div className="frm-label">Client</div>
                                                            <div className="bts-drop">
                                                                <SelectBox
                                                                    optionData={this.state.allClientArr}
                                                                    value={this.state.selectedClient}
                                                                    onSelectChange={(value) => this.clientChange(value)}
                                                                // isDisabled = {true}
                                                                >

                                                                </SelectBox>
                                                            </div>
                                                        </div>
                                                        {/* <div className="web-form-bx">
                                                            <div className="frm-label">Service Type</div>
                                                            <div className="bts-drop">
                                                                <SelectBox
                                                                    optionData={this.state.allServiceArr}
                                                                    value={this.state.selectedService}
                                                                    // onSelectChange = {(value)=> this.clientChange(value)}
                                                                    isDisabled={true}
                                                                >

                                                                </SelectBox>
                                                            </div>
                                                        </div> */}
                                                        <div className="web-form-bx">
                                                            <div className="frm-label">Appointment Type</div>
                                                            <div className="bts-drop">
                                                                <SelectBox
                                                                    optionData={this.state.allAppointmentType}
                                                                    value={this.state.selectedAppointmentType}
                                                                    onSelectChange={(value) => this.appointmentTypeChange(value)}
                                                                >
                                                                </SelectBox>
                                                            </div>
                                                        </div>
                                                        <div className="web-form-bx">
                                                            <div className="frm-label">Source Language</div>
                                                            <div className="bts-drop">
                                                                <SelectBox
                                                                    optionData={this.state.allLanguage}
                                                                    value={this.state.selectedSourceLanguage}
                                                                    onSelectChange={(value) => this.sourceLanguageChange(value)}
                                                                    isDisabled={true}
                                                                >
                                                                </SelectBox>
                                                            </div>
                                                        </div>
                                                        <div className="web-form-bx">
                                                            <div className="frm-label">Target Language</div>
                                                            <div className="bts-drop">
                                                                <SelectBox
                                                                    optionData={this.state.allLanguage}
                                                                    value={this.state.selectedTargetLanguage}
                                                                    onSelectChange={(value) => this.targetLanguageChange(value)}
                                                                >

                                                                </SelectBox>
                                                            </div>
                                                        </div>
                                                        <div className="web-form-bx md4" style={{ width: "50%" }}>
                                                            <div className="frm-label">No. of Interpreters required</div>
                                                            <div className="bts-drop">
                                                                <SelectBox
                                                                    optionData={this.state.numbersOption}
                                                                    value={this.state.selectedRequiredInterpreter}
                                                                    onSelectChange={(value) => this.requiredInterpreterChange(value)}
                                                                >
                                                                </SelectBox>
                                                            </div>
                                                        </div>
                                                        {this.state.appointmentType === 63 ?
                                                            <div className="web-form-bx">
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
                                                            </div> : <React.Fragment></React.Fragment>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="col-md-6 wt-right">
                                                    <div className="web-form-app">
                                                        <div className="pic-data" style={{ marginLeft: "20%" }}>
                                                            <div className="c-logo">
                                                                <img className="border_50_img" src={this.state.imagePath} />
                                                                {/* <button className="pht" >
                                                                    <input type="file" accept="image/*" />
                                                                </button> */}
                                                            </div>
                                                        </div>
                                                        <div className="web-form-bx md4">
                                                            <div className="frm-label">Job Type</div>
                                                            <div className="bts-drop">
                                                                <SelectBox
                                                                    optionData={this.state.allJobType}
                                                                    onSelectChange={(value) => this.jobTypeChange(value)}
                                                                >
                                                                </SelectBox>
                                                            </div>
                                                        </div>
                                                        <div className="web-form-bx md4">
                                                            <div className="frm-label">Notes for <span style={{ color: "#00a0df" }}>7C Admin</span></div>
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
                                                        <div className="web-form-bx">
                                                            <div className="frm-label">Appointment Notes for Interpreter</div>
                                                            <div className="form-input-fields">
                                                                <input type="text" placeholder="Enter notes here..." className="textbox4" style={{ borderRadius: "9px", boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 20%)" }} onChange={this.appointmentsNotesChange} />
                                                            </div>
                                                        </div>
                                                        <div className="web-form-bx">
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

                                                        </div>
                                                        {this.state.appointmentType === 63 ?
                                                            <div className="web-form-bx">
                                                                <div className="frm-label">Onsite Contact</div>
                                                                <input type="text" placeholder="Enter Name" className="in-field2" value={this.state.onsiteContact} onChange={this.onSiteContactNameChange} readOnly={this.state.interpreterCheckIn} />
                                                            </div> : <React.Fragment></React.Fragment>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="col-md-6 wt-right">
                                                    <div className="web-form-app">
                                                        {this.state.appointmentType === 63 ?
                                                            <div className="web-form-bx">
                                                                <div className="frm-label">Appointment Location</div>
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
                                                                        onChange={(value) => this.onLocationChange(value)}
                                                                        onInputChange={(value) => {
                                                                            this.onLocationInputChange(value);
                                                                        }}
                                                                        styles={customStylesDropdown}
                                                                    />
                                                                </div>
                                                            </div> : <React.Fragment></React.Fragment>
                                                        }
                                                        <div className="web-form-bx">
                                                            <div className="frm-label">Duration</div>
                                                            <div className="bts-drop">
                                                                <SelectBox
                                                                    optionData={this.state.allJobDuration}
                                                                    value={this.state.selectedJobDuration}
                                                                    onSelectChange={(value) => this.jobDurationChange(value)}
                                                                >

                                                                </SelectBox>
                                                            </div>
                                                        </div>
                                                        <div className="web-form-bx">
                                                            {/* <div className="frm-label">Any Qualification Required</div>
                                                            <div className="bts-drop">
                                                                <SelectBox>

                                                                </SelectBox>
                                                            </div> */}
                                                        </div>
                                                        {this.state.appointmentType === 63 ?
                                                            <div className="web-form-bx">
                                                                <div className="frm-label">Site Contact Phone Number</div>
                                                                <input type="text" value={this.state.onSiteContactPhone} placeholder="" className="in-field2" onChange={this.siteContactPhoneChange} readOnly={this.state.interpreterCheckIn} />
                                                            </div> : <React.Fragment></React.Fragment>
                                                        }
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
                                                            <div className="frm-label">Limited English Individual (LEI)</div>
                                                            <div className="bts-drop">
                                                                <SelectBox
                                                                    optionData={this.state.leiOptionList}
                                                                    value={this.state.selectedLei}
                                                                    onSelectChange={(value) => this.leiChange(value)}
                                                                >
                                                                </SelectBox>
                                                            </div>
                                                            <button className="addnew_lei" onClick={() => { this.onLeiAdd() }}>Add New</button>
                                                        </div>
                                                        <div className="web-form-bx">
                                                            <div className="frm-label">Is there a country specific dialect required ?</div>
                                                            <div className="check-field">
                                                                <label className="checkbox_btn">
                                                                    {this.state.countrySpecificDialect ?
                                                                        <input type="radio" name="radio" checked={true} value="yes" onChange={this.countrySpecific} disabled /> :
                                                                        <input type="radio" name="radio" checked={false} value="yes" onChange={this.countrySpecific} disabled />}
                                                                    <span className="checkmark3"></span> Yes</label>
                                                            </div>
                                                            <div className="check-field">
                                                                <label className="checkbox_btn">
                                                                    {this.state.countrySpecificDialect ?
                                                                        <input type="radio" name="radio" checked={false} value="no" onChange={this.countrySpecific} disabled /> :
                                                                        <input type="radio" name="radio" checked={true} value="no" onChange={this.countrySpecific} disabled />}
                                                                    <span className="checkmark3"></span> No</label>
                                                            </div>
                                                        </div>
                                                        <div className="web-form-bx">
                                                            <div className="frm-label">LEI Phone Number</div>
                                                            <input type="text" value={this.state.leiPhone} placeholder="0104  0125  012" className="in-field2" readonly />
                                                        </div>
                                                        <div className="web-form-bx">
                                                            <div className="frm-label">Gender Preference(If any)</div>
                                                            <div className="bts-drop">
                                                                <SelectBox
                                                                    optionData={this.state.allGenderOption}
                                                                    value={this.state.selectedLeiGender}
                                                                    // onSelectChange={(value) => this.leiChange(value)}
                                                                    isDisabled={true}
                                                                >

                                                                </SelectBox>
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
                                                                >

                                                                </SelectBox>
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
                                                            <div className="form-input-fields unstyled">
                                                                <input type="date" id="datepicker2" className="textbox4 d-icon" placeholder="10/25/2021" value={this.state.leiDob} disabled={true} style={{ borderRadius: "9px", boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)" }} />
                                                            </div>
                                                        </div>
                                                        <div className="web-form-bx">
                                                            <div className="frm-label">Would you like to have preffered interpreter?</div>
                                                            <div className="check-field">
                                                                <label className="checkbox_btn">
                                                                    {this.state.havePrefferedInterpreter ?
                                                                        <input type="radio" name="radio_in" value="yes" checked={true} onChange={this.prefferedInterpreter} disabled /> :
                                                                        <input type="radio" name="radio_in" value="yes" checked={false} onChange={this.prefferedInterpreter} disabled />}
                                                                    <span className="checkmark3"></span> Yes</label>
                                                            </div>
                                                            <div className="check-field">
                                                                <label className="checkbox_btn">
                                                                    {this.state.havePrefferedInterpreter ?
                                                                        <input type="radio" name="radio_in" value="no" checked={false} onChange={this.prefferedInterpreter} disabled /> :
                                                                        <input type="radio" name="radio_in" value="no" checked={true} onChange={this.prefferedInterpreter} disabled />}
                                                                    <span className="checkmark3"></span> No</label>
                                                            </div>
                                                        </div>
                                                        <div className="web-form-bx">
                                                            <div className="frm-label">LEI Email ID</div>
                                                            <input type="text" value={this.state.leiEmail} placeholder="Email id" className="in-field2" readonly />
                                                        </div>
                                                        <div className="web-form-bx">
                                                            <div className="frm-label">LEI reference Number</div>
                                                            <input type="text" value={this.state.leiReference} placeholder="0104  0125  012" className="in-field2" readonly />
                                                        </div>
                                                        <div className="web-form-bx">
                                                            <div className="frm-label">LEI Prefered language</div>
                                                            <div className="bts-drop">
                                                                <SelectBox
                                                                    optionData={this.state.allLanguage}
                                                                    value={this.state.selectedLeiLanguage}
                                                                    // onSelectChange={(value) => this.leiChange(value)}
                                                                    isDisabled={true}
                                                                >

                                                                </SelectBox>
                                                            </div>
                                                        </div>
                                                    </div>
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
        )
    }
}