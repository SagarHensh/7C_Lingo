import React from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Select, { components } from "react-select";
import { AlertMessage, ImageName } from "../../../enums";
import { Decoder } from "../../../services/auth";
import { consoleLog, getClientInfo, getCountryList, getLanguageArray, getLookUpDataFromAPI, phoneNumberCheck, SetDatabaseDateFormat, SetDOBFormat, SetUSAdateFormat } from "../../../services/common-function";
import { ErrorCode } from "../../../services/constant";
import { ApiCall, ApiCallClient } from "../../../services/middleware";
import { inputEmptyValidate, mobileNumberValidator, numberValidator } from "../../../validators";
import { SelectBox } from "../../Admin/SharedComponents/inputText";
import history from "../../../history";
import { IMAGE_PATH_ONLY } from "../../../services/config/api_url";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


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
        label: "Minute",
        value: "Minute"
    },
    {
        label: "Hour",
        value: "Hour"
    },
    {
        label: "Day",
        value: "Day"
    }
]

export default class InterpreationModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countryCode: 1,
            imagePath: ImageName.IMAGE_NAME.PROFILE_PIC,
            numbersOption: [],
            allClientArr: [],
            selectedClient: {},
            client: "",
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
            leiName: "",
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
            jobDurationValue: 1,
            allJobDuration: jobDuration,
            selectedJobDuration: {
                label: "Hour",
                value: "Hour"
            },
            jobDurationLimit: "Hour",
            clientName: "",
            clientPhone: "",
            otherServices: true,
            otherServicesData: "",
            selectLocation: {},
        }
    }

    componentDidMount() {
        // .....  ..............LEI Data..........................
        if (this.props.value.clientId) {
            let data = {
                clientId: this.props.value.clientId,
            };
            this.getLEIdata(data);
        }
        let arr = [];
        for (let i = 0; i < 10; i++) {
            arr.push({
                label: i + 1,
                value: i + 1
            });
        }
        this.setState({
            numbersOption: arr,
            client: this.props.value.clientId,
            clientName: this.props.value.firstName + " " + this.props.value.lastName,
            clientPhone: this.props.value.clientMobile
        });
        this.onLoad();
    }

    // componentDidUpdate(prevProps) {
    //     consoleLog("under prev")
    //     if (this.props.value.clientId !== prevProps.value.clientId) {
    //         consoleLog("underprops")
    //         let data = {
    //             clientId: this.props.value.clientId,
    //         };
    //         this.getLEIdata(data);
    //         this.setState({
    //             clientId: this.props.value.clientId,
    //             clientName: this.props.value.firstName + " " + this.props.value.lastName,
    //             clientPhone: this.props.value.phone
    //         });
    //     } else{
    //         consoleLog("ott")
    //     }
    // }

    decimalValue = (text) => {
        const validated = text.match(/^(\d*\.{0,1}\d{0,2}$)/);
        return validated;
    }

    jobDurationValueChange = (e) => {
        let text = this.decimalValue(e.target.value);
        if (text) {
            this.setState({
                jobDurationValue: e.target.value
            })
        }
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
        // allClientArr = await getClientInfo();
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
                value: data.id,
                imagePath: data.others
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
            let payload = Decoder.decode(res.data.payload);
            console.log("PAyload LEI Data>>>", payload.data);
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

    // getClientData = async (value) => {
    //     let data = {
    //         clientid: value.value
    //     },
    //         userInfo = [];
    //     let res = await ApiCall("fetchclientinfo", data);
    //     if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //         res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
    //         let payload = Decoder.decode(res.data.payload);
    //         // console.log("Client Data>>>>>>>", payload);
    //         if (payload.data.length > 0) {
    //             if (payload.data[0].userInfo && payload.data[0].userInfo.length > 0) {
    //                 userInfo = payload.data[0].userInfo[0];
    //                 this.setState({
    //                     clientName: userInfo.clientName,
    //                     clientPhone: userInfo.adminPhone
    //                 })
    //             }
    //         }
    //     }
    // }

    // clientChange = (value) => {
    //     // console.log("selected Client",value);
    //     this.setState({
    //         selectedClient: value,
    //         client: value.value
    //     });

    //     let data = {
    //         clientId: value.value
    //     }

    //     this.getLEIdata(data);
    //     this.getClientData(value);
    // }

    // refreshLEIdata = () => {
    //     if (this.state.client !== 0) {
    //         let obj = {
    //             clientId: this.state.client
    //         }
    //         // consoleLog("Client : ", this.state.client)

    //         this.getLEIdata(obj);
    //     } else {
    //         toast.error(AlertMessage.MESSAGE.CLIENT.CLIENT_NOT_SELECTED);
    //     }
    // }

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

    otherServiceRadioChange = (e) => {
        // console.log("e.target.value", e.target.value);
        if (e.target.value === "yes") {
            this.setState({
                otherServices: true,
            })
        } else {
            this.setState({
                otherServices: false,
            })
        }
    }

    otherServicesDataChange = (e) => {
        this.setState({
            otherServicesData: e.target.value
        });
    }

    jobTypeChange = (value) => {
        // console.log("selected Client",value);
        this.setState({
            jobType: value.value,
            imagePath: IMAGE_PATH_ONLY + value.imagePath
        })
    }

    onJobNotesChange = (e) => {
        this.setState({
            jobNotes: e.target.value
        })
    }

    jobDurationLimitChange = (value) => {
        this.setState({
            selectedJobDuration: value,
            jobDurationLimit: value.value
        })
    }

    appointmentsNotesChange = (e) => {
        this.setState({
            appointmentNotes: e.target.value
        })
    }

    appointmentdateChange = (date) => {
        this.setState({
            appointmentDate: SetUSAdateFormat(date)
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
            let locationRes = await ApiCallClient("getlocaiondescriptionForClientRFQ", {
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

    onLocationChange = async (value) => {
        let obj = {
            placeid: value.value
        }
        // consoleLog("Get Coordinante from place id::", obj)
        let locationData = await ApiCall("getcoordinatefromplaceidforclientRFQ", obj);
        if (locationData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && locationData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let locationArr = Decoder.decode(locationData.data.payload);
            let locateAdd = {};
            locateAdd = {
                lat: locationArr.data.coordinatedetails[0].lat,
                long: locationArr.data.coordinatedetails[0].lng,
                locationName: value.label,
                locationId: value.value
            }
            // consoleLog("Location details::", locateAdd)
            this.setState({
                selectLocation: locateAdd,
            })
        }
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
                    genderTypeId = "",
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

                if (data.genderTypeId != null || data.genderTypeId != undefined) {
                    genderTypeId = data.genderTypeId
                }

                this.setState({
                    leiDob: data.dob === "" ? "" : SetUSAdateFormat(data.dob),
                    leiName: data.name,
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
                })
            }
        })
    }

    changeLeiName = (e) => {
        this.setState({
            leiName: e.target.value
        })
    }

    changeLeiPhone = (e) => {
        this.setState({
            leiPhone: e.target.value,
            leiCountryCode: "1"
        })
    }

    changeLeiGender = (value) => {
        this.setState({
            selectedLeiGender: value,
            leiGender: value.value
        })
    }

    changeLeiCountry = (value) => {
        this.setState({
            selectedCountry: value,
            leiCountry: value.value
        })
    }

    changeLeiDob = (date) => {
        this.setState({
            leiDob: SetUSAdateFormat(date)
        })
    }

    changeLeiEmail = (e) => {
        this.setState({
            leiEmail: e.target.value
        })
    }

    changeLeiReference = (e) => {
        this.setState({
            leiReference: e.target.value
        })
    }

    changeLeiLanguage = (value) => {
        this.setState({
            leiLanguage: value.value,
            selectedLeiLanguage: value
        })
    }

    onSubmit = async () => {
        let errorCounter = 0,
            validateClient = inputEmptyValidate(this.state.client),
            validateAppointmentType = inputEmptyValidate(this.state.appointmentType),
            validateJobType = inputEmptyValidate(this.state.jobType),
            validateNoOfInterpreter = inputEmptyValidate(this.state.interpreterRequiredNumber),
            validateSourceLanguage = inputEmptyValidate(this.state.sourceLanguage),
            validateTargetLanguage = inputEmptyValidate(this.state.targetLanguage),
            validateleiId = inputEmptyValidate(this.state.leiId),
            validateDate = inputEmptyValidate(this.state.appointmentDate),
            validateJobDuration = inputEmptyValidate(this.state.jobDurationValue);

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
        } else if (!validateDate) {
            toast.error("Please select appointment date");
            errorCounter++;
            return false;
        } else if (!validateJobDuration) {
            toast.error("Please input job duration");
            errorCounter++;
            return false;
        } else if (this.state.leiOptionList.length > 0) {
            if (!validateleiId) {
                toast.error("Please select LEI");
                errorCounter++;
                return false;
            }
        }

        if (errorCounter === 0) {
            // consoleLog("Location>>>", this.state.locationData)
            let finalData = {
                serviceCategoryType: "45",
                clientId: this.state.client.toString(),
                appointmentType: this.state.appointmentType.toString(),
                jobType: this.state.jobType.toString(),
                noOfInterpreter: this.state.interpreterRequiredNumber.toString(),
                note: this.state.jobNotes,
                sourceLanguage: this.state.sourceLanguage.toString(),
                targetLanguage: this.state.targetLanguage,
                interpreterNote: this.state.appointmentNotes,
                appointmentLocation: this.state.locationData.label === undefined ? "" : this.state.locationData.label,
                locationLat: Object.keys(this.state.selectLocation).length > 0 ? this.state.selectLocation.lat : null,
                locationLng: Object.keys(this.state.selectLocation).length > 0 ? this.state.selectLocation.long : null,
                duration: this.state.jobDurationValue + " " + this.state.jobDurationLimit,
                scheduledDate: SetDatabaseDateFormat(this.state.appointmentDate),
                scheduledTime: this.state.hour + ":" + this.state.min + ":00",
                siteContact: this.state.onsiteContact,
                siteContactMobile: this.state.onSiteContactPhone.substring(3, 15),
                leiId: this.state.leiId.toString(),
                leiName: this.state.leiName,
                leiDOB: SetDatabaseDateFormat(this.state.leiDob),
                leiCountryCode: this.state.leiCountryCode === "" ? "1" : this.state.leiCountryCode,
                leiMobile: this.state.leiPhone.substring(3, 15),
                leiEmail: this.state.leiEmail,
                leiGender: this.state.leiGender,
                leiReference: this.state.leiReference,
                leiCountry: this.state.leiCountry.toString(),
                leiPreferredLanguage: this.state.leiLanguage,
                countryDialect: this.state.countrySpecificDialect ? "1" : "0",
                interpreterCheck: this.state.interpreterCheckIn ? "1" : "0",
                otherServices: this.state.otherServices ? "1" : "0",
                otherServicesData: this.state.otherServicesData
            }

            // consoleLog("Final Submit data >>>>>", finalData);

            let res = await ApiCallClient("addNewJobFromClientREQ", finalData);
            if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                toast.success("Job requested successfully");
                // return history.push("/adminClientRfqList");
                this.props.closeModal();
            } else {
                toast.error("Error occured!!!")
            }
        }
    }

    render() {
        // if(this.props.value.clientId !== ""){
        //     consoleLog("Plan Success");
        //     let data = {
        //         clientId: this.props.value.clientId,
        //     };
        //     this.getLEIdata(data);

        // }
        // consoleLog("Render Props::", this.props.value);
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
                <div className="create-new-job-wrap">
                    <div className="main-container">
                        <div className="createform-box sdw _fl">
                            <div className="create-head">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h2><a href="javascript:void(0)" style={{ textDecoration: "none" }}>Create new job (INTERPRETATION)</a></h2>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="web_btn f-right">
                                            <a href="javascript:void(0)" style={{ textDecoration: "none" }}>RESET</a>
                                            <a href="javascript:void(0)" style={{ textDecoration: "none" }} className="blue" onClick={() => { this.onSubmit() }}>SUBMIT</a>
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
                                                    {/* <div className="web-form-bx">
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
                                                    </div> */}
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
                                                    {this.state.appointmentType !== "" ? <React.Fragment>
                                                        {this.state.appointmentType !== 63 ?
                                                            <div className="web-form-bx">
                                                                <div className="frm-label">Will you use <span style={{ color: "#00a0df" }}>7C Lingo</span> voice/video services for this job ?</div>
                                                                <div className="check-field">
                                                                    <label className="checkbox_btn">
                                                                        {this.state.otherServices ?
                                                                            <input type="radio" name="other_radio1" checked={true} value="yes" onChange={this.otherServiceRadioChange} /> :
                                                                            <input type="radio" name="other_radio1" checked={false} value="yes" onChange={this.otherServiceRadioChange} />}
                                                                        <span className="checkmark3"></span> Yes</label>
                                                                </div>
                                                                <div className="check-field">
                                                                    <label className="checkbox_btn">
                                                                        {this.state.otherServices ?
                                                                            <input type="radio" name="other_radio1" checked={false} value="no" onChange={this.otherServiceRadioChange} /> :
                                                                            <input type="radio" name="other_radio1" checked={true} value="no" onChange={this.otherServiceRadioChange} />}
                                                                        <span className="checkmark3"></span> No</label>
                                                                </div>
                                                            </div> : <React.Fragment></React.Fragment>
                                                        }</React.Fragment> : <React.Fragment></React.Fragment>}
                                                    <div className="web-form-bx">
                                                        <div className="frm-label">Appointment Notes for Interpreter</div>
                                                        <div className="form-input-fields">
                                                            <input type="text" placeholder="Enter notes here..." className="textbox4" style={{ borderRadius: "9px", boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 20%)" }} onChange={this.appointmentsNotesChange} />
                                                        </div>
                                                    </div>
                                                    <div className="web-form-bx">
                                                        <div className="frm-label">Appointment Date & Time</div>
                                                        {/* <div className="form-input-fields unstyled">
                                                            <input type="date" id="from_datepicker" className="textbox4 d-icon" placeholder="10/25/2021" onChange={this.appointmentdateChange} style={{ borderRadius: "9px", boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)" }} />
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
                                                                    <img src={ImageName.IMAGE_NAME.U_IMG} alt="" style={{ cursor: "pointer" }} onClick={this.hourChange} /><br />
                                                                    <input type="text" placeholder="" value={this.state.hour} className="tsd2" readonly /><br />
                                                                    <img src={ImageName.IMAGE_NAME.B_ARROW} alt="" style={{ cursor: "pointer" }} onClick={this.hourChangeUp} />
                                                                </small>
                                                            </span>
                                                            <span className="t2">
                                                                <small>
                                                                    <img src={ImageName.IMAGE_NAME.U_IMG} alt="" style={{ cursor: "pointer" }} onClick={this.minChange} /><br />
                                                                    <input type="text" placeholder="" value={this.state.min} className="tsd2" readonly /><br />
                                                                    <img src={ImageName.IMAGE_NAME.B_ARROW} alt="" style={{ cursor: "pointer" }} onClick={this.minChangeUp} />
                                                                </small>
                                                            </span>
                                                            <span className="t3" style={{ marginLeft: "2%" }}>
                                                                <small>
                                                                    <img src={ImageName.IMAGE_NAME.U_IMG} alt="" style={{ cursor: "pointer" }} onClick={this.ampmChange} /><br />
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
                                                    {this.state.appointmentType !== "" ? <React.Fragment>
                                                        {this.state.appointmentType !== 63 && !this.state.otherServices ?
                                                            <div className="web-form-bx md4">
                                                                <div className="frm-label">Meeting link (3rd party conference service)</div>
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
                                                            </div> : <React.Fragment></React.Fragment>
                                                        }</React.Fragment> : <React.Fragment></React.Fragment>}
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
                                                        <div className="row">
                                                            <div className="col-md-4">
                                                                <input type="text" className="textbox4" style={{ borderRadius: "9px", boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 20%)" }} value={this.state.jobDurationValue} onChange={this.jobDurationValueChange} />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="bts-drop">
                                                                    <SelectBox
                                                                        optionData={this.state.allJobDuration}
                                                                        value={this.state.selectedJobDuration}
                                                                        onSelectChange={(value) => this.jobDurationLimitChange(value)}
                                                                    >
                                                                    </SelectBox>
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
                                                        <div className="bts-drop" >
                                                            <SelectBox
                                                                optionData={this.state.leiOptionList}
                                                                value={this.state.selectedLei}
                                                                onSelectChange={(value) => this.leiChange(value)}
                                                            >
                                                            </SelectBox>
                                                        </div>
                                                    </div>
                                                    <div className="web-form-bx">
                                                        <div className="frm-label">LEI Name</div>
                                                        <input type="text" value={this.state.leiName} placeholder="Enter LEI name" className="in-field2" readOnly={this.state.leiOptionList.length > 0 ? true : false} onChange={this.changeLeiName} />
                                                    </div>
                                                    {/* <div className="web-form-bx">
                                                        <div className="frm-label">Is there a country specific dialect required ?</div>
                                                        <div className="check-field">
                                                            <label className="checkbox_btn">
                                                                {this.state.countrySpecificDialect ?
                                                                    <input type="radio" name="radio" checked={true} value="yes" onChange={this.countrySpecific} disabled={this.state.leiOptionList.length > 0 ? true : false} /> :
                                                                    <input type="radio" name="radio" checked={false} value="yes" onChange={this.countrySpecific} disabled={this.state.leiOptionList.length > 0 ? true : false} />}
                                                                <span className="checkmark3"></span> Yes</label>
                                                        </div>
                                                        <div className="check-field">
                                                            <label className="checkbox_btn">
                                                                {this.state.countrySpecificDialect ?
                                                                    <input type="radio" name="radio" checked={false} value="no" onChange={this.countrySpecific} disabled={this.state.leiOptionList.length > 0 ? true : false} /> :
                                                                    <input type="radio" name="radio" checked={true} value="no" onChange={this.countrySpecific} disabled={this.state.leiOptionList.length > 0 ? true : false} />}
                                                                <span className="checkmark3"></span> No</label>
                                                        </div>
                                                    </div> */}
                                                    <div className="web-form-bx">
                                                        <div className="frm-label">LEI Phone Number</div>
                                                        <input type="text" value={this.state.leiPhone} placeholder="LEI Phone" className="in-field2" onChange={this.changeLeiPhone} readOnly={this.state.leiOptionList.length > 0 ? true : false} />
                                                    </div>
                                                    <div className="web-form-bx">
                                                        <div className="frm-label">Gender Preference (If any)</div>
                                                        <div className="bts-drop">
                                                            <SelectBox
                                                                optionData={this.state.allGenderOption}
                                                                value={this.state.selectedLeiGender}
                                                                onSelectChange={(value) => this.changeLeiGender(value)}
                                                                isDisabled={this.state.leiOptionList.length > 0 ? true : false}
                                                            >

                                                            </SelectBox>
                                                        </div>
                                                    </div>
                                                    <div className="web-form-bx">
                                                        <div className="frm-label">LEI Country of Origin</div>
                                                        <div className="bts-drop">
                                                            <SelectBox
                                                                optionData={this.state.allCountryOption}
                                                                value={this.state.selectedCountry}
                                                                onSelectChange={(value) => this.changeLeiCountry(value)}
                                                                isDisabled={this.state.leiOptionList.length > 0 ? true : false}
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
                                                        {/* <div className="form-input-fields unstyled">
                                                            <input type="date" id="datepicker2" className="textbox4 d-icon" placeholder="10/25/2021" value={this.state.leiDob} onChange={this.changeLeiDob} disabled={this.state.leiOptionList.length > 0 ? true : false} style={{ borderRadius: "9px", boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)" }} />
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
                                                                        dropdownMode="select"
                                                                        showMonthDropdown
                                                                        showYearDropdown
                                                                        adjustDateOnChange
                                                                        onChange={(date) =>
                                                                            this.changeLeiDob(date)
                                                                        }
                                                                        customInput={<Schedule />}
                                                                    />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className="web-form-bx">
                                                        <div className="frm-label">Would you like to have preffered interpreter?</div>
                                                        <div className="check-field">
                                                            <label className="checkbox_btn">
                                                                {this.state.havePrefferedInterpreter ?
                                                                    <input type="radio" name="radio_in" value="yes" checked={true} onChange={this.prefferedInterpreter} disabled={this.state.leiOptionList.length > 0 ? true : false} /> :
                                                                    <input type="radio" name="radio_in" value="yes" checked={false} onChange={this.prefferedInterpreter} disabled={this.state.leiOptionList.length > 0 ? true : false} />}
                                                                <span className="checkmark3"></span> Yes</label>
                                                        </div>
                                                        <div className="check-field">
                                                            <label className="checkbox_btn">
                                                                {this.state.havePrefferedInterpreter ?
                                                                    <input type="radio" name="radio_in" value="no" checked={false} onChange={this.prefferedInterpreter} disabled={this.state.leiOptionList.length > 0 ? true : false} /> :
                                                                    <input type="radio" name="radio_in" value="no" checked={true} onChange={this.prefferedInterpreter} disabled={this.state.leiOptionList.length > 0 ? true : false} />}
                                                                <span className="checkmark3"></span> No</label>
                                                        </div>
                                                    </div> */}
                                                    <div className="web-form-bx">
                                                        <div className="frm-label">LEI Email</div>
                                                        <input type="text" value={this.state.leiEmail} placeholder="LEI Email" className="in-field2" onChange={this.changeLeiEmail} readOnly={this.state.leiOptionList.length > 0 ? true : false} />
                                                    </div>
                                                    <div className="web-form-bx">
                                                        <div className="frm-label">LEI Reference Number (MRN,Client ID or Other)</div>
                                                        <input type="text" value={this.state.leiReference} placeholder="LEI Reference No." className="in-field2" onChange={this.changeLeiReference} readOnly={this.state.leiOptionList.length > 0 ? true : false} />
                                                    </div>
                                                    <div className="web-form-bx">
                                                        <div className="frm-label">LEI Preferred Language</div>
                                                        <div className="bts-drop">
                                                            <SelectBox
                                                                optionData={this.state.allLanguage}
                                                                value={this.state.selectedLeiLanguage}
                                                                onSelectChange={(value) => this.changeLeiLanguage(value)}
                                                                isDisabled={this.state.leiOptionList.length > 0 ? true : false}
                                                            ></SelectBox>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row m20">
                                    <div className="col-md-12 text-center">
                                        <button type="submit" className="cn_btn">RESET</button>
                                        <button type="submit" className="sv_btn" onClick={() => { this.onSubmit() }}>Submit</button>
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
