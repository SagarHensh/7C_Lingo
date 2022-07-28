import React, { Component } from 'react';
import ModalUnstyled from "@mui/core/ModalUnstyled"; //imported forr modal
import { styled } from "@mui/system"; //imported for modal
import Switch from "@mui/material/Switch";
import "./VendorRateList.css";
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import $ from 'jquery';
import { InputText, MultiSelectBox } from "../../SharedComponents/inputText";
import { ApiCall } from "../../../../services/middleware";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { AlertMessage, ImageName } from "../../../../enums";
import { toast, ToastContainer } from "react-toastify";
import { CryptoDecoder, Decoder } from "../../../../services/auth";
import { SmallSelectBox, SelectBox } from "../../SharedComponents/inputText";
import { NoEncryption } from '@material-ui/icons';
import { consoleLog, decimalValue, getLanguageArray, getLookUpDataFromAPI } from '../../../../services/common-function';
import history from '../../../../history';
import { numberValidator } from '../../../../validators';
import { Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const hdfArr = [
    {
        label: "Hour",
        value: "Hour",
    },
    {
        label: "Half day",
        value: "Half day",
    },
    {
        label: "Full day",
        value: "Full day",
    }
];

const hdArr = [
    {
        label: "Hour",
        value: "Hour",
    },
    {
        label: "Days",
        value: "Days",
    }
];

const mhArr = [
    {
        label: "Minutes",
        value: "Minutes",
    },
    {
        label: "Hours",
        value: "Hours",
    }
];

const mhfArr = [
    {
        label: "Minutes",
        value: "Minutes",
    },
    {
        label: "Hours",
        value: "Hours",
    },
    {
        label: "Flat Rate",
        value: "Flat Rate",
    }
];


export class VendorRateList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showId: "",
            isInterpretation: true,
            isLoad: true,
            current_page: 1,
            total_page: 10,
            limit: 10,
            display: "",

            allLanguageArr: [],
            allAppointmentType: [],
            allJobType: [],


            vendorId: "",
            vendorName: "",
            allVendorLanguage: [],
            allSourceLanguage: [],
            allTargetLanguage: [],
            selectedSourceLanguage: {
                label: "English",
                value: 110
            },
            selectedTargetLanguage: {},
            allTargetLanguageForAdd: [],
            selectedtargetLanguageForAdd: [],
            targetLanguageForAdd: [],
            sourceLanguage: 110,
            targetLanguage: "",
            rateCardData: [
                {
                    appointmentType: "",
                    industryType: "",
                    regularRateHour: "",
                    regularRateHalfDay: "",
                    regularRateFullDay: "",
                    minimumDurationRate: "",
                    minimumDurationUnit: "",
                    billingIncrementRate: "",
                    billingIncrementUnit: "",
                    nightWeekendRate: "",
                    nightWeekendUnit: "",
                    mileageRate: [{
                        from: "",
                        to: "",
                        ratePerMile: ""
                    }],
                    cancelRate: "",
                    cancelUnit: "",
                    rushPolicyRate: "",
                    rushPolicyUnit: "",
                    rushFeeRate: "",
                    rushFeeUnit: "",
                }
            ],


            interpretationData: [],
            interpretationModal: false,
            searchValue: "",

            targetLanguageId: "",
            sourceLanguageId: "",

            editModalData: [],
            isEditInterpretation: false,

            isAdd: true,
            isAllLang: true,
            cardRowPosition: 0,
            bookingFeeArr: []
        };

    }



    componentDidMount() {
        let mainData = this.props.location;
        let preData = mainData.state;
        // consoleLog("Predata>>>", preData)
        if (preData === undefined) {
            return history.push("/adminVendorList")
        } else {
            this.setState({
                vendorId: preData.id,
                vendorName: preData.fName + " " + preData.lName
            });

            let data = {
                vendorId: preData.id,
                serviceId: 45
            }

            this.getVendorLanguage(data);
            this.getRateList(data);
        }
        document.getElementById("backdrop").style.display = "none";

        window.scrollTo(0, 0);

        var classInstance = this;

        var editModal = document.getElementById("interpretationModal");
        var addModal = document.getElementById("addRateCardModal");
        var mileageModal = document.getElementById("mileage-modal");
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target === editModal) {
                classInstance.closeInterpretationModal();
            } else if (event.target === addModal) {
                classInstance.closeAddInterpretationModal();
            } else if (event.target === mileageModal) {
                classInstance.closeMileageModal();
            }
        };
        this.onLoad();
    }

    onLoad = async () => {
        let allLookupValue = [],
            allAppointmentType = [],
            allJobType = [];


        allLookupValue = await getLookUpDataFromAPI();


        allLookupValue.INDUSTRY_TYPE.map((data) => {
            allJobType.push({
                label: data.name,
                value: data.id
            })
        })

        allLookupValue.SCHEDULE_TYPE.map((data) => {
            if (data.id === 63) {
                allAppointmentType.push({
                    label: <div><img src={ImageName.IMAGE_NAME.F2F} height="20px" width="20px" style={{ float: "Left" }} /><span style={{ paddingLeft: "5%" }}>{data.name}</span></div>,
                    value: data.id
                })
            } else if (data.id === 64) {
                allAppointmentType.push({
                    label: <div><img src={ImageName.IMAGE_NAME.VRI_ICON} height="20px" width="20px" style={{ float: "Left" }} /><span style={{ paddingLeft: "5%" }}>{data.name}</span></div>,
                    value: data.id
                })
            } else if (data.id === 65) {
                allAppointmentType.push({
                    label: <div><img src={ImageName.IMAGE_NAME.OPI_ICON} height="20px" width="20px" style={{ float: "Left" }} /><span style={{ paddingLeft: "5%" }}>{data.name}</span></div>,
                    value: data.id
                })
            }
        })

        this.setState({
            allAppointmentType: allAppointmentType,
            allJobType: allJobType
        })
    }

    getRateList = async (data) => {
        let res = await ApiCall("getVendorRatecardList", data);
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            let payload = Decoder.decode(res.data.payload);
            // consoleLog("RateCardList>>", payload.data.ratecardInfo);
            if (payload.data.ratecardInfo) {
                if (payload.data.ratecardInfo.length > 0) {
                    this.setState({
                        interpretationData: payload.data.ratecardInfo
                    })
                } else {
                    this.setState({
                        interpretationData: []
                    })
                }
            }
        }
    }

    getVendorLanguage = async (data) => {
        let res = await ApiCall("getUserLanguagesByServiceId", data);
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            let payload = Decoder.decode(res.data.payload);
            if (payload.data.languageInfo) {
                if (payload.data.languageInfo.length > 0) {
                    let arr = [];
                    payload.data.languageInfo.map((lan) => {
                        arr.push({
                            label: lan.name,
                            value: lan.id
                        });
                        if (lan.target && lan.target.length > 0) {
                            let brr = [],
                                crr = [{
                                    label: "All",
                                    value: "all"
                                }];
                            let obj = {};
                            obj = {
                                label: lan.target[0].name,
                                value: lan.target[0].id
                            }
                            lan.target.map((tar) => {
                                brr.push({
                                    label: tar.name,
                                    value: tar.id
                                });

                                crr.push({
                                    label: tar.name,
                                    value: tar.id
                                })
                            });
                            this.setState({
                                allTargetLanguage: brr,
                                allTargetLanguageForAdd: crr,
                                selectedTargetLanguage: obj,
                                targetLanguage: obj.value
                            })
                        }
                    });
                    this.setState({
                        allSourceLanguage: arr,
                        allVendorLanguage: payload.data.languageInfo
                    })
                }
            }
        }
    }

    deleteRate = async (value) => {
        // consoleLog("DeletId>>>", value);
        let data = {
            id: value
        }
        let res = await ApiCall("deleteVendorRatecard", data);
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            toast.success(AlertMessage.MESSAGE.RATE_CARD.DELETE_RATE_SUCCESS);
            let obj = {
                vendorId: this.state.vendorId
            }
            this.getRateList(obj)
        }
    }

    addNewRow = () => {
        let arr = this.state.rateCardData;
        arr.push(
            {
                appointmentType: "",
                industryType: "",
                regularRateHour: "",
                regularRateHalfDay: "",
                regularRateFullDay: "",
                minimumDurationRate: "",
                minimumDurationUnit: "",
                billingIncrementRate: "",
                billingIncrementUnit: "",
                nightWeekendRate: "",
                nightWeekendUnit: "",
                mileageRate: [{
                    from: "",
                    to: "",
                    ratePerMile: ""
                }],
                cancelRate: "",
                cancelUnit: "",
                rushPolicyRate: "",
                rushPolicyUnit: "",
                rushFeeRate: "",
                rushFeeUnit: "",
            }
        );
        this.setState({
            rateCardData: arr
        })
    }

    onSourceLangChange = (data) => {
        this.setState({
            sourceLanguage: data.value,
            selectedSourceLanguage: data
        });
        this.state.allVendorLanguage.map((lan) => {
            if (lan.id === data.value) {
                if (lan.target && lan.target.length > 0) {
                    let arr = [];
                    lan.target.map((tar) => {
                        arr.push({
                            label: tar.name,
                            value: tar.id
                        })
                    });
                    this.setState({
                        allTargetLanguage: arr
                    })
                } else {
                    toast.error(AlertMessage.MESSAGE.RATE_CARD.BLANK_TARGET_LANGUAGE);
                }
            }
        })

    };

    onTargetLangChangeForAdd = (value) => {
        let arr = [],
            crr = [],
            brr = [{
                label: "All",
                value: "all"
            }];
        if (value.length > 0) {
            value.map((data) => {
                if (data.value === "all") {
                    arr = [];
                    crr = [{
                        label: "All",
                        value: "all"
                    }];
                    this.state.allTargetLanguage.map((ln) => {
                        arr.push(ln.value)
                    });
                    this.setState({
                        allTargetLanguageForAdd: [],
                        isAllLang: true
                    })
                } else {
                    arr.push(data.value);
                    crr = value;
                    this.setState({
                        isAllLang: false
                    })
                }
            });
        } else {
            this.state.allTargetLanguage.map((ln) => {
                brr.push(ln);
            });
            this.setState({
                allTargetLanguageForAdd: brr,
            })
        }
        // consoleLog("selected target for add :", arr)
        this.setState({
            selectedtargetLanguageForAdd: crr,
            targetLanguageForAdd: arr
        })
    }


    onTargetLangChange = async (data) => {
        this.setState({
            targetLanguage: data.value,
        });

        let obj = {
            vendorId: this.state.vendorId,
            serviceId: 45,
            sourceLanguage: this.state.sourceLanguage,
            targetLanguage: data.value
        }
        let res = await ApiCall("getRatecardByLanguage", obj);
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            let payload = Decoder.decode(res.data.payload);
            let arr = [];
            if (payload.data.ratecardInfo.rateCardData.length > 0) {
                payload.data.ratecardInfo.rateCardData.map((data) => {
                    let selectedAppointment = {},
                        selectedIndustryType = {},
                        selectedMinimumDurationUnit = {},
                        selectedBillingIncrementUnit = {},
                        selectedNightWeekendUnit = {},
                        selectedCancelUnit = {},
                        selectedRushPolicyUnit = {},
                        selectedRushFeeUnit = {};

                    this.state.allAppointmentType.map((ap) => {
                        if (data.appointmentType === ap.value) {
                            selectedAppointment = ap;
                        }
                    });

                    this.state.allJobType.map((jb) => {
                        if (data.industryType === jb.value) {
                            selectedIndustryType = jb;
                        }
                    });

                    hdfArr.map((aa) => {
                        if (data.minimumDurationUnit === aa.value) {
                            selectedMinimumDurationUnit = aa;
                        }
                    });

                    mhArr.map((aa) => {
                        if (data.billingIncrementUnit === aa.value) {
                            selectedBillingIncrementUnit = aa;
                        }
                    });

                    mhfArr.map((aa) => {
                        if (data.nightWeekendUnit === aa.value) {
                            selectedNightWeekendUnit = aa;
                        }
                    });

                    hdArr.map((aa) => {
                        if (data.cancelUnit === aa.value) {
                            selectedCancelUnit = aa;
                        }
                    });

                    hdArr.map((aa) => {
                        if (data.rushPolicyUnit === aa.value) {
                            selectedRushPolicyUnit = aa;
                        }
                    });

                    mhfArr.map((aa) => {
                        if (data.rushFeeUnit === aa.value) {
                            selectedRushFeeUnit = aa;
                        }
                    });

                    arr.push({
                        appointmentType: data.appointmentType,
                        selectedAppointmentType: selectedAppointment,
                        industryType: data.industryType,
                        selectedIndustryType: selectedIndustryType,
                        regularRateHour: data.regularRateHour,
                        regularRateHalfDay: data.regularRateHalfDay,
                        regularRateFullDay: data.regularRateFullDay,
                        minimumDurationRate: data.minimumDurationRate,
                        minimumDurationUnit: data.minimumDurationUnit,
                        selectedMinimumDurationUnit: selectedMinimumDurationUnit,
                        billingIncrementRate: data.billingIncrementRate,
                        billingIncrementUnit: data.billingIncrementUnit,
                        selectedBillingIncrementUnit: selectedBillingIncrementUnit,
                        nightWeekendRate: data.nightWeekendRate,
                        nightWeekendUnit: data.nightWeekendUnit,
                        selectedNightWeekendUnit: selectedNightWeekendUnit,
                        mileageRate: data.mileageRate,
                        cancelRate: data.cancelRate,
                        cancelUnit: data.cancelUnit,
                        selectedCancelUnit: selectedCancelUnit,
                        rushPolicyRate: data.rushPolicyRate,
                        rushPolicyUnit: data.rushPolicyUnit,
                        selectedRushPolicyUnit: selectedRushPolicyUnit,
                        rushFeeRate: data.rushFeeRate,
                        rushFeeUnit: data.rushFeeUnit,
                        selectedRushFeeUnit: selectedRushFeeUnit
                    })
                });
            } else {
                arr = this.state.rateCardData;
            }
            // consoleLog("RateCArdArray>>>", arr)
            this.setState({
                rateCardData: arr
            })
        }
    };


    appointmentTypeChange = (value, i) => {
        let arr = this.state.rateCardData;
        arr[i].appointmentType = value.value;
        this.setState({
            rateCardData: arr
        })
    }

    handleJobType = (value, i) => {
        let arr = this.state.rateCardData;
        arr[i].industryType = value.value;
        this.setState({
            rateCardData: arr
        })
    }

    regularRateHourChange = (i, e) => {
        let arr = this.state.rateCardData;
        if (decimalValue(e.target.value)) {
            arr[i].regularRateHour = e.target.value;
            this.setState({
                rateCardData: arr
            });
        }
    }

    handleRegularRateHalfDay = (e, i) => {
        let arr = this.state.rateCardData;
        if (decimalValue(e.target.value)) {
            arr[i].regularRateHalfDay = e.target.value;
            this.setState({
                rateCardData: arr
            })
        }
    }

    handleRegularRateFullDay = (e, i) => {
        let arr = this.state.rateCardData;
        if (decimalValue(e.target.value)) {
            arr[i].regularRateFullDay = e.target.value;
            this.setState({
                rateCardData: arr
            })
        }
    }

    handleMinimumDurationrate = (e, i) => {
        let arr = this.state.rateCardData;
        if (decimalValue(e.target.value)) {
            arr[i].minimumDurationRate = e.target.value;
            this.setState({
                rateCardData: arr
            })
        }
    }

    handleMinimumDurationUnit = (value, i) => {
        let arr = this.state.rateCardData;
        arr[i].minimumDurationUnit = value.value;
        this.setState({
            rateCardData: arr
        })
    }

    handleBillingRate = (e, i) => {
        let arr = this.state.rateCardData;
        if (decimalValue(e.target.value)) {
            arr[i].billingIncrementRate = e.target.value;
            this.setState({
                rateCardData: arr
            })
        }
    }

    handleBillingUnit = (value, i) => {
        let arr = this.state.rateCardData;
        arr[i].billingIncrementUnit = value.value;
        this.setState({
            rateCardData: arr
        })
    }

    handleNightPerWeekendRate = (e, i) => {
        let arr = this.state.rateCardData;
        if (decimalValue(e.target.value)) {
            arr[i].nightWeekendRate = e.target.value;
            this.setState({
                rateCardData: arr
            })
        }
    }

    handleNightPerWeekendUnit = (value, i) => {
        let arr = this.state.rateCardData;
        arr[i].nightWeekendUnit = value.value;
        this.setState({
            rateCardData: arr
        })
    }

    handleCancelRate = (e, i) => {
        let arr = this.state.rateCardData;
        if (decimalValue(e.target.value)) {
            arr[i].cancelRate = e.target.value;
            this.setState({
                rateCardData: arr
            })
        }
    }

    handleCancelUnit = (value, i) => {
        let arr = this.state.rateCardData;
        arr[i].cancelUnit = value.value;
        this.setState({
            rateCardData: arr
        })
    }

    handleRushPolicyrate = (e, i) => {
        let arr = this.state.rateCardData;
        if (decimalValue(e.target.value)) {
            arr[i].rushPolicyRate = e.target.value;
            this.setState({
                rateCardData: arr
            })
        }
    }

    handleRushPolicyUnit = (value, i) => {
        let arr = this.state.rateCardData;
        arr[i].rushPolicyUnit = value.value;
        this.setState({
            rateCardData: arr
        })
    }

    handleRushFeeRate = (e, i) => {
        let arr = this.state.rateCardData;
        if (decimalValue(e.target.value)) {
            arr[i].rushFeeRate = e.target.value;
            this.setState({
                rateCardData: arr
            })
        }
    }

    handleRushFeeUnit = (value, i) => {
        let arr = this.state.rateCardData;
        arr[i].rushFeeUnit = value.value;
        this.setState({
            rateCardData: arr
        })
    }


    onSubmitRate = async () => {
        let errorCounter = 0;

        if (this.state.isAdd) {
            if (this.state.targetLanguageForAdd.length == 0) {
                toast.error(AlertMessage.MESSAGE.RATE_CARD.TARGET_LANG_BLANK);
                errorCounter++;
                return false;
            }
        } else {
            if (this.state.targetLanguage === "") {
                toast.error(AlertMessage.MESSAGE.RATE_CARD.TARGET_LANG_BLANK);
                errorCounter++;
                return false;
            }
        }

        this.state.rateCardData.map((data, i) => {
            if (data.appointmentType === "" ||
                data.industryType === "" ||
                data.regularRateHour === "" ||
                data.regularRateHalfDay === "" ||
                data.regularRateFullDay === "" ||
                data.minimumDurationRate === "" ||
                data.minimumDurationUnit === "" ||
                data.billingIncrementRate === "" ||
                data.billingIncrementUnit === "" ||
                data.nightWeekendRate === "" ||
                data.nightWeekendUnit === "" ||
                data.mileageRate.length == 0 ||
                data.cancelRate === "" ||
                data.cancelUnit === "" ||
                data.rushPolicyRate === "" ||
                data.rushPolicyUnit === "" ||
                data.rushFeeRate === "" ||
                data.rushFeeUnit === ""
            ) {
                toast.error(AlertMessage.MESSAGE.RATE_CARD.ALL_FIELDS_REQUIRED + " at row " + Number(i + 1));
                errorCounter++;
                return false;
            } else if (data.mileageRate.length > 0) {
                let er = 0;
                data.mileageRate.map((mil, j) => {
                    if (mil.from === "" ||
                        mil.to === "" ||
                        mil.ratePerMile === "") {
                        er++;
                        return false;
                    }
                })
                if (er !== 0) {
                    toast.error(AlertMessage.MESSAGE.RATE_CARD.BOOKING_FEE_BLANK + " at row " + Number(i + 1));
                    errorCounter++;
                    return false;
                }
            }
        });

        for (let i = 0; i < this.state.rateCardData.length; i++) {
            // consoleLog("Appointmenttyoe", this.state.rateCardData[i].appointmentType)
            if (i !== this.state.rateCardData.length - 1) {
                if (this.state.rateCardData[i].appointmentType === this.state.rateCardData[i + 1].appointmentType &&
                    this.state.rateCardData[i].industryType === this.state.rateCardData[i + 1].industryType) {
                    toast.error(AlertMessage.MESSAGE.RATE_CARD.DUPLICATE_ENTRY);
                    errorCounter++;
                    return false;
                }
            }
        }

        if (errorCounter === 0) {
            if (this.state.isAdd) {
                let finalData = {
                    vendorId: this.state.vendorId,
                    sourceLanguage: this.state.sourceLanguage,
                    targetLanguage: this.state.targetLanguageForAdd,
                    isAllLang: this.state.isAllLang ? "1" : "0",
                    rateCardData: this.state.rateCardData
                }
                // consoleLog("Final Submit Rate Card Data::>>>>", finalData);
                let res = await ApiCall("addVendorRatecardNew", finalData);
                if (
                    res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                    res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
                ) {
                    toast.success(AlertMessage.MESSAGE.RATE_CARD.ADD_RATE_SUCCESS);
                    this.closeAddInterpretationModal();
                    let obj = {
                        vendorId: this.state.vendorId
                    }
                    this.getRateList(obj);
                }

            } else {
                let finalData = {
                    vendorId: this.state.vendorId,
                    sourceLanguage: this.state.sourceLanguage,
                    targetLanguage: this.state.targetLanguage,
                    rateCardData: this.state.rateCardData
                }
                // consoleLog("Final Submit Rate Card Data::>>>>", finalData);
                let res = await ApiCall("addVendorRatecard", finalData);
                if (
                    res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                    res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
                ) {
                    toast.success(AlertMessage.MESSAGE.RATE_CARD.ADD_RATE_SUCCESS);
                    this.closeInterpretationModal();
                    let obj = {
                        vendorId: this.state.vendorId
                    }
                    this.getRateList(obj);
                }
            }
        }
    }

    rateCardModal = async (source, target) => {
        this.state.allSourceLanguage.map((aa) => {
            if (aa.value === source) {
                this.setState({
                    selectedSourceLanguage: aa
                })
            }
        });

        this.state.allTargetLanguage.map((aa) => {
            if (aa.value === target) {
                this.setState({
                    selectedTargetLanguage: aa
                })
            }
        });

        let obj = {
            vendorId: this.state.vendorId,
            serviceId: 45,
            sourceLanguage: source,
            targetLanguage: target
        }
        let res = await ApiCall("getRatecardByLanguage", obj);
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            let payload = Decoder.decode(res.data.payload);
            let arr = [];
            if (payload.data.ratecardInfo.rateCardData.length > 0) {
                payload.data.ratecardInfo.rateCardData.map((data) => {
                    let selectedAppointment = {},
                        selectedIndustryType = {},
                        selectedMinimumDurationUnit = {},
                        selectedBillingIncrementUnit = {},
                        selectedNightWeekendUnit = {},
                        selectedCancelUnit = {},
                        selectedRushPolicyUnit = {},
                        selectedRushFeeUnit = {},
                        mileageRate = [];

                    this.state.allAppointmentType.map((ap) => {
                        if (data.appointmentType === ap.value) {
                            selectedAppointment = ap;
                        }
                    });

                    this.state.allJobType.map((jb) => {
                        if (data.industryType === jb.value) {
                            selectedIndustryType = jb;
                        }
                    });

                    hdfArr.map((aa) => {
                        if (data.minimumDurationUnit === aa.value) {
                            selectedMinimumDurationUnit = aa;
                        }
                    });

                    mhArr.map((aa) => {
                        if (data.billingIncrementUnit === aa.value) {
                            selectedBillingIncrementUnit = aa;
                        }
                    });

                    mhfArr.map((aa) => {
                        if (data.nightWeekendUnit === aa.value) {
                            selectedNightWeekendUnit = aa;
                        }
                    });

                    hdArr.map((aa) => {
                        if (data.cancelUnit === aa.value) {
                            selectedCancelUnit = aa;
                        }
                    });

                    hdArr.map((aa) => {
                        if (data.rushPolicyUnit === aa.value) {
                            selectedRushPolicyUnit = aa;
                        }
                    });

                    mhfArr.map((aa) => {
                        if (data.rushFeeUnit === aa.value) {
                            selectedRushFeeUnit = aa;
                        }
                    });

                    if (data.mileageRate.length > 0) {
                        data.mileageRate.map((mm) => {
                            mileageRate.push({
                                from: mm.fromMile.toString(),
                                to: mm.toMile.toString(),
                                ratePerMile: mm.rate.toString()
                            })
                        })
                    } else {
                        mileageRate.push({
                            from: "",
                            to: "",
                            ratePerMile: ""
                        })
                    }

                    arr.push({
                        appointmentType: data.appointmentType,
                        selectedAppointmentType: selectedAppointment,
                        industryType: data.industryType,
                        selectedIndustryType: selectedIndustryType,
                        regularRateHour: data.regularRateHour,
                        regularRateHalfDay: data.regularRateHalfDay,
                        regularRateFullDay: data.regularRateFullDay,
                        minimumDurationRate: data.minimumDurationRate,
                        minimumDurationUnit: data.minimumDurationUnit,
                        selectedMinimumDurationUnit: selectedMinimumDurationUnit,
                        billingIncrementRate: data.billingIncrementRate,
                        billingIncrementUnit: data.billingIncrementUnit,
                        selectedBillingIncrementUnit: selectedBillingIncrementUnit,
                        nightWeekendRate: data.nightWeekendRate,
                        nightWeekendUnit: data.nightWeekendUnit,
                        selectedNightWeekendUnit: selectedNightWeekendUnit,
                        mileageRate: mileageRate,
                        cancelRate: data.cancelRate,
                        cancelUnit: data.cancelUnit,
                        selectedCancelUnit: selectedCancelUnit,
                        rushPolicyRate: data.rushPolicyRate,
                        rushPolicyUnit: data.rushPolicyUnit,
                        selectedRushPolicyUnit: selectedRushPolicyUnit,
                        rushFeeRate: data.rushFeeRate,
                        rushFeeUnit: data.rushFeeUnit,
                        selectedRushFeeUnit: selectedRushFeeUnit
                    })
                });
            } else {
                arr = this.state.rateCardData;
            }
            // consoleLog("RateCArdArray>>>", arr)
            this.setState({
                rateCardData: arr,
                isAdd: false
            })
        }
        this.openInterpretationModal();
    }


    openInterpretationModal = () => {
        document.getElementById("backdrop").style.display = "block";
        document.getElementById("interpretationModal").style.display = "block";
        document.getElementById("interpretationModal").classList.add("show");
    }

    closeInterpretationModal = () => {
        document.getElementById("backdrop").style.display = "none";
        document.getElementById("interpretationModal").style.display = "none";
        document.getElementById("interpretationModal").classList.remove("show");
    }


    openAddInterpretationModal = () => {
        document.getElementById("backdrop").style.display = "block";
        document.getElementById("addRateCardModal").style.display = "block";
        document.getElementById("addRateCardModal").classList.add("show");
        this.setState({
            isAdd: true
        })
    }

    closeAddInterpretationModal = () => {
        document.getElementById("backdrop").style.display = "none";
        document.getElementById("addRateCardModal").style.display = "none";
        document.getElementById("addRateCardModal").classList.remove("show");
    }


    openMileageModal = (pos) => {
        document.getElementById("backdrop").style.display = "block";
        document.getElementById("mileage-modal").style.display = "block";
        document.getElementById("mileage-modal").classList.add("show");
        this.setState({
            cardRowPosition: pos,
            bookingFeeArr: this.state.rateCardData[pos].mileageRate
        });
    }

    closeMileageModal = () => {
        document.getElementById("backdrop").style.display = "none";
        document.getElementById("mileage-modal").style.display = "none";
        document.getElementById("mileage-modal").classList.remove("show");
        this.setState({
            cardRowPosition: 0
        })
    }

    removeObject = (i) => {
        let arr = this.state.rateCardData;
        arr.splice(i, 1);
        this.setState({
            rateCardData: arr
        })
    }

    addBookingFeeRow = (pos) => {
        let arr = this.state.rateCardData;
        arr[pos].mileageRate.push({
            form: "",
            to: "",
            ratePerMile: ""
        });
        this.setState({
            rateCardData: arr
        })

    }

    addNewBookingRange = () => {
        let arr = this.state.bookingFeeArr;
        arr.push({
            from: "",
            to: "",
            ratePerMile: ""
        })
        this.setState({
            bookingFeeArr: arr
        })
    }

    removeBookingFeeRow = (pos) => {
        let arr = this.state.rateCardData;
        if (arr[this.state.cardRowPosition].mileageRate.length > 1) {
            arr[this.state.cardRowPosition].mileageRate.splice(pos, 1)
        } else {
            toast.error("Atleast required one booking fee");
        }
        this.setState({
            rateCardData: arr
        });
    }

    removeBookingRange = (pos) => {
        let arr = this.state.bookingFeeArr;
        arr.splice(pos, 1);
        this.setState({
            bookingFeeArr: arr
        })
    }

    formMileage = (e, pos) => {
        // let arr = this.state.rateCardData;
        // if (decimalValue(e.target.value)) {
        //     arr[this.state.cardRowPosition].mileageRate[pos].form = e.target.value;
        //     this.setState({
        //         rateCardData: arr
        //     });
        // }
        let arr = this.state.bookingFeeArr;
        if (decimalValue(e.target.value)) {
            arr[pos].from = e.target.value;
            this.setState({
                bookingFeeArr: arr
            })
        }
    }

    toMileage = (e, pos) => {
        // let arr = this.state.rateCardData;
        // if (decimalValue(e.target.value)) {
        //     arr[this.state.cardRowPosition].mileageRate[pos].to = e.target.value;
        //     this.setState({
        //         rateCardData: arr
        //     });
        // }
        let arr = this.state.bookingFeeArr;
        if (decimalValue(e.target.value)) {
            arr[pos].to = e.target.value;
            this.setState({
                bookingFeeArr: arr
            })
        }
    }

    ratePerMile = (e, pos) => {
        // let arr = this.state.rateCardData;
        // if (decimalValue(e.target.value)) {
        //     arr[this.state.cardRowPosition].mileageRate[pos].ratePerMile = e.target.value;
        //     this.setState({
        //         rateCardData: arr
        //     });
        // }
        let arr = this.state.bookingFeeArr;
        if (decimalValue(e.target.value)) {
            arr[pos].ratePerMile = e.target.value;
            this.setState({
                bookingFeeArr: arr
            })
        }
    }

    compareTwoMilerange = (a, b) => {
        if (a.from <= b.from && a.to >= b.from && a.from >= b.to && a.to <= b.to) {
            return true;
        } else {
            return false;
        }
    }

    applyMileageBtn = () => {
        let arr = this.state.bookingFeeArr,
            errorCount = 0;
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (this.compareTwoMilerange(arr[i], arr[j])) {
                    consoleLog("error");
                    toast.error("Error in range");
                    errorCount++;
                }
                //  else {
                //     toast.success("All Range chec  kout fine");
                // }
            }
        }

        if (errorCount > 0) {
            toast.error("Please enter valid mileage range");
        } else {
            let brr = this.state.rateCardData;
            brr[this.state.cardRowPosition].mileageRate = arr;
            this.setState({
                rateCardData: brr,
                bookingFeeArr: []
            });
            this.closeMileageModal();
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="component-wrapper">
                    <ToastContainer hideProgressBar theme='colored' />
                    <div className="listing-component-app">
                        <div> <div
                            className="vn_frm"
                            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
                        >
                            {" "}
                            <Link to="/adminDashboard">Dashboard</Link> / <Link to="/adminVendorList">Vendors</Link> / Rate Card
                        </div>
                            <div className="vendor-info _fl sdw">
                                <div className="vn-form _fl">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="vn_frm" style={{ color: "grey", fontSize: "15px" }}> Vendor: {this.state.vendorName}
                                            </div>
                                        </div>
                                        <div className="col-md-4" />
                                        <div className="col-md-4 ">
                                            {/* <div className="vn_frm rt">
                                                <InputText
                                                    placeholder="Search"
                                                    className="inputfield"
                                                    value={this.state.searchValue}
                                                    onTextChange={(value) => {
                                                        this.handleVendorChange(value);
                                                    }}
                                                />
                                            </div> */}

                                            <div className="md-btn_rate text-center">
                                                <a href='javascript:void(0)' className="children" onClick={() => this.openAddInterpretationModal()}>ADD RATE CARD</a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="row"> */}
                                    {/* <div className="col-md-6 rateList"> */}
                                    {/* <div className="_fl verificaiton-doc-tab">
                                                <ul>
                                                    <li className="active" onClick={() => { this.onTabClick("interpretation") }}>INTERPRETATION</li>
                                                    <li onClick={() => { this.onTabClick("translation") }}>TRANSLATION</li>
                                                    <li onClick={() => { this.onTabClick("training") }}>TRAINING</li>
                                                </ul>
                                            </div> */}
                                    {/* </div> */}
                                    {/* <div className="col-md-2" />
                                        <div className="col-md-4">

                                        </div> */}
                                    {/* </div> */}
                                </div>
                            </div>
                            {/* <div className="table-filter-app">
                                <div className="table-filter-box">
                                    <div className="tble-short">
                                        <span className="lbl">Display</span>
                                        <div class="dropdwn">
                                            <select class="myDropdown frm4-select" >
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        <div hidden={!this.state.isInterpretation}>
                            <div className="table-listing-app" >
                                <div className="table-responsive">
                                    {/* <div className="table-responsive_cus table-style-a"> */}
                                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <th style={{ width: "20%" }}>Source Language</th>
                                                <th style={{ width: "20%" }}>Target Language</th>
                                                <th style={{ width: "20%" }}>Appointment Type</th>
                                                <th style={{ width: "20%" }}>Industry Type</th>
                                                <th style={{ width: "20%" }}>Action</th>
                                            </tr>
                                            {this.state.interpretationData.length > 0 ? <React.Fragment>
                                                {
                                                    this.state.interpretationData.map((item, key) => (
                                                        <tr>
                                                            <td colSpan="11">
                                                                <div className="tble-row">
                                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td style={{ width: "20%" }}>{item.sourceLanguage}</td>
                                                                                <td style={{ width: "20%" }}>{item.targetLanguage}</td>
                                                                                <td style={{ width: "20%" }}>
                                                                                    {item.appointmentType}
                                                                                </td>
                                                                                <td style={{ width: "20%" }}>{item.industryType}</td>
                                                                                <td style={{ width: "20%" }}>
                                                                                    <div className="tbl-editing-links">
                                                                                        <button className="tr-toggle" onClick={() => this.rateCardModal(item.sourceLanguageId, item.targetLanguageId)}>
                                                                                            <img src={ImageName.IMAGE_NAME.EDIT_SQUARE} />
                                                                                        </button>

                                                                                        <button className="tr-toggle" onClick={() => this.deleteRate(item.id)}><img src={ImageName.IMAGE_NAME.TRASH_BTN} /></button>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                } </React.Fragment> :

                                                <tr style={{ textAlign: "center" }}>
                                                    <td colSpan="5">
                                                        <center style={{ fontSize: "20px" }}>
                                                            No data found !!!
                                                        </center>
                                                    </td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="interpretationModal" className="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="filter-head _fl document-hd">
                                <h3 className="text-center center-text">Edit Rate Card</h3>
                                <button type="button" className="close" onClick={this.closeInterpretationModal}>X</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-wrap">
                                    <div className="sdw _fl _mg4">
                                        <h4 className="h4-grey-text">Vendor: {this.state.vendorName}</h4>
                                        <div className="form-step-row m30 _fl">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-stp">
                                                        <span>Source Language</span>
                                                        <div className="selectbox" style={{ width: "60%" }}>
                                                            <SelectBox
                                                                optionData={this.state.allSourceLanguage}
                                                                value={this.state.selectedSourceLanguage}
                                                                placeholder="Select"
                                                                onSelectChange={(value) => {
                                                                    this.onSourceLangChange(value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4"></div>
                                                <div className="col-md-4">
                                                    <div className="form-stp">
                                                        <span>Target Language</span>
                                                        <div className="selectbox" style={{ width: "60%" }}>
                                                            <SelectBox
                                                                optionData={this.state.allTargetLanguage}
                                                                value={this.state.selectedTargetLanguage}
                                                                placeholder="Select"
                                                                onSelectChange={(value) => {
                                                                    this.onTargetLangChange(value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-listing-app card">
                                    <div className="table-responsive" style={{ paddingBottom: "10%" }}>
                                        <table width="100%" border="0" cellpadding="0" cellSpacing="0">
                                            <tr>
                                                <th style={{ width: "7%" }}>Appointment Type</th>
                                                <th style={{ width: "7%", paddingLeft: "2%" }}>Industry Type</th>
                                                <th style={{ width: "16%", paddingLeft: "2%" }}>Regular Rate ($/Unit)</th>
                                                <th style={{ width: "10%", paddingLeft: "2%" }}>Minimum Duration</th>
                                                <th style={{ width: "10%", paddingLeft: "2%" }}>Billing Increment</th>
                                                <th style={{ width: "10%", paddingLeft: "2%" }}>Night/weekends</th>
                                                <th style={{ width: "10%", paddingLeft: "2%" }}>Cancellation Charges</th>
                                                <th style={{ width: "10%", paddingLeft: "2%" }}>Rush Policy</th>
                                                <th style={{ width: "10%", paddingLeft: "2%" }}>Rush Fee</th>
                                                <th style={{ width: "6%", paddingLeft: "2%" }}>Booking Fee</th>
                                                <th style={{ width: "4%", paddingLeft: "2%" }}></th>
                                            </tr>
                                            {this.state.rateCardData.map((item, index) =>
                                                <React.Fragment key={index}>
                                                    <tr>
                                                        <td style={{ width: "7%" }}>
                                                            <SmallSelectBox
                                                                optionData={this.state.allAppointmentType}
                                                                value={item.selectedAppointmentType}
                                                                placeholder="Select"
                                                                onSelectChange={(value) => {
                                                                    this.appointmentTypeChange(value, index);
                                                                }}
                                                            >
                                                            </SmallSelectBox>
                                                        </td>
                                                        <td style={{ width: "7%", paddingLeft: "1%" }}>
                                                            <SmallSelectBox
                                                                optionData={this.state.allJobType}
                                                                value={item.selectedIndustryType}
                                                                placeholder="Select"
                                                                onSelectChange={(value) => {
                                                                    this.handleJobType(value, index);
                                                                }}
                                                            />
                                                        </td>
                                                        <td style={{ width: "16%", paddingLeft: "1%" }}>
                                                            <div className="row no-gutters" style={{ padding: "5%" }}>
                                                                <div className="col-md-4">
                                                                    <input
                                                                        type="text"
                                                                        value={item.regularRateHour}
                                                                        name=""
                                                                        placeholder="per hour"
                                                                        className="in-field3_vr"
                                                                        style={{ cursor: "pointer" }}
                                                                        onChange={(e) => this.regularRateHourChange(index, e)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <input
                                                                        type="text"
                                                                        value={item.regularRateHalfDay}
                                                                        name=""
                                                                        placeholder="Half day"
                                                                        className="in-field3_vr"
                                                                        style={{ cursor: "pointer" }}
                                                                        onChange={(e) => this.handleRegularRateHalfDay(e, index)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <input
                                                                        type="text"
                                                                        value={item.regularRateFullDay}
                                                                        name=""
                                                                        placeholder="Full Day"
                                                                        className="in-field3_vr"
                                                                        style={{ cursor: "pointer" }}
                                                                        onChange={(e) => this.handleRegularRateFullDay(e, index)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: "10%", paddingLeft: "2%" }}>
                                                            <div className="row no-gutters" style={{ padding: "2%" }}>
                                                                <div className="col-md-4">
                                                                    <input type="text"
                                                                        value={item.minimumDurationRate}
                                                                        name=""
                                                                        placeholder=""
                                                                        className="in-field3_vr"
                                                                        onChange={(e) => this.handleMinimumDurationrate(e, index)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-8">
                                                                    <SmallSelectBox
                                                                        optionData={hdfArr}
                                                                        value={item.selectedMinimumDurationUnit}
                                                                        placeholder="Select"
                                                                        onSelectChange={(value) => {
                                                                            this.handleMinimumDurationUnit(value, index);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: "10%", paddingLeft: "2%" }}>
                                                            <div className="row no-gutters" style={{ padding: "1%" }}>
                                                                <div className="col-md-4">
                                                                    <input
                                                                        type="text"
                                                                        value={item.billingIncrementRate}
                                                                        name=""
                                                                        placeholder=""
                                                                        className="in-field3_vr"
                                                                        onChange={(e) => this.handleBillingRate(e, index)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-8">
                                                                    <SmallSelectBox
                                                                        optionData={mhArr}
                                                                        value={item.selectedBillingIncrementUnit}
                                                                        placeholder="Select"
                                                                        onSelectChange={(value) => {
                                                                            this.handleBillingUnit(value, index);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: "10%", paddingLeft: "2%" }}>
                                                            <div className="row no-gutters" style={{ padding: "2%" }}>
                                                                <div className="col-md-4">
                                                                    <input
                                                                        type="text"
                                                                        value={item.nightWeekendRate}
                                                                        placeholder="$"
                                                                        className="in-field3_vr"
                                                                        onChange={(e) => this.handleNightPerWeekendRate(e, index)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-8">
                                                                    <SmallSelectBox
                                                                        optionData={mhfArr}
                                                                        value={item.selectedNightWeekendUnit}
                                                                        placeholder="Select"
                                                                        onSelectChange={(value) => {
                                                                            this.handleNightPerWeekendUnit(value, index);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: "10%", paddingLeft: "2%" }}>
                                                            <div className="row no-gutters" style={{ paddingLeft: "1%" }}>
                                                                <div className="col-md-4">
                                                                    <input type="text"
                                                                        value={item.cancelRate}
                                                                        name=""
                                                                        placeholder="$"
                                                                        className="in-field3_vr"
                                                                        onChange={(e) => this.handleCancelRate(e, index)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-8">
                                                                    <SmallSelectBox
                                                                        optionData={hdArr}
                                                                        value={item.selectedCancelUnit}
                                                                        placeholder="Select"
                                                                        onSelectChange={(value) => {
                                                                            this.handleCancelUnit(value, index);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: "10%", paddingLeft: "2%" }}>
                                                            <div className="row no-gutters" style={{ paddingLeft: "1%" }}>
                                                                <div className="col-md-4">
                                                                    <input type="text"
                                                                        value={item.rushPolicyRate}
                                                                        name=""
                                                                        placeholder=""
                                                                        className="in-field3_vr"
                                                                        onChange={(e) => this.handleRushPolicyrate(e, index)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-8">
                                                                    <SmallSelectBox
                                                                        optionData={hdArr}
                                                                        value={item.selectedRushPolicyUnit}
                                                                        placeholder="Select"
                                                                        onSelectChange={(value) => {
                                                                            this.handleRushPolicyUnit(value, index);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: "10%", paddingLeft: "2%" }}>
                                                            <div className="row no-gutters" style={{ paddingLeft: "1%" }}>
                                                                <div className="col-md-4">
                                                                    <input type="text"
                                                                        value={item.rushFeeRate}
                                                                        name=""
                                                                        placeholder="$"
                                                                        className="in-field3_vr"
                                                                        onChange={(e) => this.handleRushFeeRate(e, index)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-8">
                                                                    <SmallSelectBox
                                                                        optionData={mhfArr}
                                                                        value={item.selectedRushFeeUnit}
                                                                        placeholder="Select"
                                                                        onSelectChange={(value) => {
                                                                            this.handleRushFeeUnit(value, index);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: "6%", paddingLeft: "2%" }}>
                                                            <div className="row no-gutters" style={{ padding: "2%" }}>
                                                                <div className="col-md-12">
                                                                    {/* <input
                                                                        type="text"
                                                                        value={item.mileageRate}
                                                                        placeholder="Per mile"
                                                                        className="in-field3_vr"
                                                                        onChange={(e) => this.handleMileageRate(e, index)}
                                                                    /> */}
                                                                    <Button variant="text" onClick={() => this.openMileageModal(index)}>View</Button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: "4%", paddingLeft: "2%" }}>
                                                            {index > 0 ?
                                                                <img src={ImageName.IMAGE_NAME.CANCEL_BTN} style={{ cursor: "pointer" }} alt="" onClick={() => this.removeObject(index)} />
                                                                : <React.Fragment></React.Fragment>
                                                            }
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            )}
                                        </table>
                                    </div>
                                </div>
                                <div className="_button-style _fl text-center" style={{ paddingBottom: "5%" }}>
                                    <a href="javascript:void(0)" className="blue-btn" onClick={this.addNewRow}>Add More</a>
                                </div>
                                {/* <div className="b-i-s _fl text-right _button-style m30">
                                    <a href="#" className="blue-btn">Add language Pair</a>
                                </div> */}
                                <div className="_button-style _fl text-center">
                                    <a href="javascript:void(0)" className="grey-btn" style={{ textDecoration: "none" }} onClick={this.closeInterpretationModal}>cancel</a>
                                    {/* <a href="#" className="blue-btn" >save</a> */}
                                    <a href="javascript:void(0)" className="blue-btn" onClick={() => this.onSubmitRate()}>SAVE</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="addRateCardModal" className="modal fade" tabindex="-1" role="dialog" aria-labelledby="addRateCardModal" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="filter-head _fl document-hd">
                                <h3 className="text-center center-text">Add Rate Card</h3>
                                <button type="button" className="close" onClick={this.closeAddInterpretationModal}>X</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-wrap">
                                    <div className="sdw _fl _mg4">
                                        <h4 className="h4-grey-text">Vendor: {this.state.vendorName}</h4>
                                        <div className="form-step-row m30 _fl">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-stp">
                                                        <span>Source Language</span>
                                                        <div className="selectbox" style={{ width: "60%" }}>
                                                            <SelectBox
                                                                optionData={this.state.allSourceLanguage}
                                                                value={this.state.selectedSourceLanguage}
                                                                placeholder="Select"
                                                                onSelectChange={(value) => {
                                                                    this.onSourceLangChange(value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4"></div>
                                                <div className="col-md-4">
                                                    <div className="form-stp">
                                                        <span>Target Language</span>
                                                        <div className="selectbox" style={{ width: "60%" }}>
                                                            <MultiSelectBox
                                                                optionData={this.state.allTargetLanguageForAdd}
                                                                value={this.state.selectedtargetLanguageForAdd}
                                                                placeholder="Select"
                                                                onSelectChange={(value) => {
                                                                    this.onTargetLangChangeForAdd(value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-listing-app card">
                                    <div className="table-responsive" style={{ paddingBottom: "10%" }}>
                                        <table width="100%" border="0" cellpadding="0" cellSpacing="0">
                                            <tr>
                                                <th style={{ width: "7%" }}>Appointment Type</th>
                                                <th style={{ width: "7%", paddingLeft: "2%" }}>Industry Type</th>
                                                <th style={{ width: "16%", paddingLeft: "2%" }}>Regular Rate ($/Unit)</th>
                                                <th style={{ width: "10%", paddingLeft: "2%" }}>Minimum Duration</th>
                                                <th style={{ width: "10%", paddingLeft: "2%" }}>Billing Increment</th>
                                                <th style={{ width: "10%", paddingLeft: "2%" }}>Night/weekends</th>
                                                <th style={{ width: "10%", paddingLeft: "2%" }}>Cancellation Charges</th>
                                                <th style={{ width: "10%", paddingLeft: "2%" }}>Rush Policy</th>
                                                <th style={{ width: "10%", paddingLeft: "2%" }}>Rush Fee</th>
                                                <th style={{ width: "6%", paddingLeft: "2%" }}>Booking Fee</th>
                                                <th style={{ width: "4%", paddingLeft: "2%" }}></th>
                                            </tr>
                                            {this.state.rateCardData.map((item, index) =>
                                                <React.Fragment key={index}>
                                                    <tr>
                                                        <td style={{ width: "7%" }}>
                                                            <SmallSelectBox
                                                                optionData={this.state.allAppointmentType}
                                                                value={item.selectedAppointmentType}
                                                                placeholder="Select"
                                                                onSelectChange={(value) => {
                                                                    this.appointmentTypeChange(value, index);
                                                                }}
                                                            >
                                                            </SmallSelectBox>
                                                        </td>
                                                        <td style={{ width: "7%", paddingLeft: "1%" }}>
                                                            <SmallSelectBox
                                                                optionData={this.state.allJobType}
                                                                value={item.selectedIndustryType}
                                                                placeholder="Select"
                                                                onSelectChange={(value) => {
                                                                    this.handleJobType(value, index);
                                                                }}
                                                            />
                                                        </td>
                                                        <td style={{ width: "16%", paddingLeft: "1%" }}>
                                                            <div className="row no-gutters" style={{ padding: "5%" }}>
                                                                <div className="col-md-4">
                                                                    <input
                                                                        type="text"
                                                                        value={item.regularRateHour}
                                                                        name=""
                                                                        placeholder="per hour"
                                                                        className="in-field3_vr"
                                                                        style={{ cursor: "pointer" }}
                                                                        onChange={(e) => this.regularRateHourChange(index, e)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <input
                                                                        type="text"
                                                                        value={item.regularRateHalfDay}
                                                                        name=""
                                                                        placeholder="Half day"
                                                                        className="in-field3_vr"
                                                                        style={{ cursor: "pointer" }}
                                                                        onChange={(e) => this.handleRegularRateHalfDay(e, index)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <input
                                                                        type="text"
                                                                        value={item.regularRateFullDay}
                                                                        name=""
                                                                        placeholder="Full Day"
                                                                        className="in-field3_vr"
                                                                        style={{ cursor: "pointer" }}
                                                                        onChange={(e) => this.handleRegularRateFullDay(e, index)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: "10%", paddingLeft: "2%" }}>
                                                            <div className="row no-gutters" style={{ padding: "2%" }}>
                                                                <div className="col-md-4">
                                                                    <input type="text"
                                                                        value={item.minimumDurationRate}
                                                                        name=""
                                                                        placeholder=""
                                                                        className="in-field3_vr"
                                                                        onChange={(e) => this.handleMinimumDurationrate(e, index)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-8">
                                                                    <SmallSelectBox
                                                                        optionData={hdfArr}
                                                                        value={item.selectedMinimumDurationUnit}
                                                                        placeholder="Select"
                                                                        onSelectChange={(value) => {
                                                                            this.handleMinimumDurationUnit(value, index);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: "10%", paddingLeft: "2%" }}>
                                                            <div className="row no-gutters" style={{ padding: "1%" }}>
                                                                <div className="col-md-4">
                                                                    <input
                                                                        type="text"
                                                                        value={item.billingIncrementRate}
                                                                        name=""
                                                                        placeholder=""
                                                                        className="in-field3_vr"
                                                                        onChange={(e) => this.handleBillingRate(e, index)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-8">
                                                                    <SmallSelectBox
                                                                        optionData={mhArr}
                                                                        value={item.selectedBillingIncrementUnit}
                                                                        placeholder="Select"
                                                                        onSelectChange={(value) => {
                                                                            this.handleBillingUnit(value, index);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: "10%", paddingLeft: "2%" }}>
                                                            <div className="row no-gutters" style={{ padding: "2%" }}>
                                                                <div className="col-md-4">
                                                                    <input
                                                                        type="text"
                                                                        value={item.nightWeekendRate}
                                                                        placeholder="$"
                                                                        className="in-field3_vr"
                                                                        onChange={(e) => this.handleNightPerWeekendRate(e, index)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-8">
                                                                    <SmallSelectBox
                                                                        optionData={mhfArr}
                                                                        value={item.selectedNightWeekendUnit}
                                                                        placeholder="Select"
                                                                        onSelectChange={(value) => {
                                                                            this.handleNightPerWeekendUnit(value, index);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: "10%", paddingLeft: "2%" }}>
                                                            <div className="row no-gutters" style={{ paddingLeft: "1%" }}>
                                                                <div className="col-md-4">
                                                                    <input type="text"
                                                                        value={item.cancelRate}
                                                                        name=""
                                                                        placeholder="$"
                                                                        className="in-field3_vr"
                                                                        onChange={(e) => this.handleCancelRate(e, index)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-8">
                                                                    <SmallSelectBox
                                                                        optionData={hdArr}
                                                                        value={item.selectedCancelUnit}
                                                                        placeholder="Select"
                                                                        onSelectChange={(value) => {
                                                                            this.handleCancelUnit(value, index);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: "10%", paddingLeft: "2%" }}>
                                                            <div className="row no-gutters" style={{ paddingLeft: "1%" }}>
                                                                <div className="col-md-4">
                                                                    <input type="text"
                                                                        value={item.rushPolicyRate}
                                                                        name=""
                                                                        placeholder=""
                                                                        className="in-field3_vr"
                                                                        onChange={(e) => this.handleRushPolicyrate(e, index)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-8">
                                                                    <SmallSelectBox
                                                                        optionData={hdArr}
                                                                        value={item.selectedRushPolicyUnit}
                                                                        placeholder="Select"
                                                                        onSelectChange={(value) => {
                                                                            this.handleRushPolicyUnit(value, index);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: "10%", paddingLeft: "2%" }}>
                                                            <div className="row no-gutters" style={{ paddingLeft: "1%" }}>
                                                                <div className="col-md-4">
                                                                    <input type="text"
                                                                        value={item.rushFeeRate}
                                                                        name=""
                                                                        placeholder="$"
                                                                        className="in-field3_vr"
                                                                        onChange={(e) => this.handleRushFeeRate(e, index)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-8">
                                                                    <SmallSelectBox
                                                                        optionData={mhfArr}
                                                                        value={item.selectedRushFeeUnit}
                                                                        placeholder="Select"
                                                                        onSelectChange={(value) => {
                                                                            this.handleRushFeeUnit(value, index);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: "6%", paddingLeft: "2%" }}>
                                                            <div className="row no-gutters" style={{ padding: "2%" }}>
                                                                <div className="col-md-12">
                                                                    {/* <input
                                                                        type="text"
                                                                        value={item.mileageRate}
                                                                        placeholder="Per mile"
                                                                        className="in-field3_vr"
                                                                        onChange={(e) => this.handleMileageRate(e, index)}
                                                                    /> */}
                                                                    <Button variant="text" onClick={() => this.openMileageModal(index)}>View</Button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: "4%", paddingLeft: "2%" }}>
                                                            {index > 0 ?
                                                                <img src={ImageName.IMAGE_NAME.CANCEL_BTN} style={{ cursor: "pointer" }} alt="" onClick={() => this.removeObject(index)} />
                                                                : <React.Fragment></React.Fragment>
                                                            }
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            )}
                                        </table>
                                    </div>
                                </div>
                                <div className="_button-style _fl text-center" style={{ paddingBottom: "5%" }}>
                                    <a href="javascript:void(0)" className="blue-btn" onClick={this.addNewRow}>Add More</a>
                                </div>
                                {/* <div className="b-i-s _fl text-right _button-style m30">
                                    <a href="#" className="blue-btn">Add language Pair</a>
                                </div> */}
                                <div className="_button-style _fl text-center">
                                    <a href="javascript:void(0)" className="grey-btn" style={{ textDecoration: "none" }} onClick={this.closeAddInterpretationModal}>cancel</a>
                                    {/* <a href="#" className="blue-btn" >save</a> */}
                                    <a href="javascript:void(0)" className="blue-btn" onClick={() => this.onSubmitRate()}>SAVE</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div id="mileage-modal" className="modal fade modelwindow" role="dialog">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="filter-head _fl document-hd">
                                <h3 className="text-center center-text">Booking Fee</h3>
                                <button type="button" className="close" onClick={() => this.closeMileageModal()}>X</button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className='col-md-12'>
                                        <table className='dataTable_project' style={{ width: "100%" }}>
                                            <tr style={{ textAlign: "center" }}>
                                                <th>Form</th>
                                                <th>To</th>
                                                <th>Rate /Mile</th>
                                            </tr>
                                            {/* {this.state.rateCardData[this.state.cardRowPosition].mileageRate.length > 0 ? <React.Fragment>
                                {this.state.rateCardData[this.state.cardRowPosition].mileageRate.map((data, i) => */}
                                            {this.state.bookingFeeArr.length > 0 ? <React.Fragment>
                                                {this.state.bookingFeeArr.map((data, i) =>
                                                    <React.Fragment>
                                                        <tr style={{ textAlign: "center" }}>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="in-field3"
                                                                    placeholder="in mile"
                                                                    value={data.from}
                                                                    onChange={(e) => {
                                                                        this.formMileage(e, i);
                                                                    }}
                                                                    style={{ width: "70%" }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="in-field3"
                                                                    placeholder="in mile"
                                                                    value={data.to}
                                                                    onChange={(e) => {
                                                                        this.toMileage(e, i);
                                                                    }}
                                                                    style={{ width: "70%" }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="in-field3"
                                                                    placeholder="$"
                                                                    value={data.ratePerMile}
                                                                    onChange={(e) => {
                                                                        this.ratePerMile(e, i);
                                                                    }}
                                                                    style={{ width: "70%" }}
                                                                />
                                                            </td>
                                                            <td style={{
                                                                width: "8%"
                                                            }}>
                                                                <img
                                                                    src={ImageName.IMAGE_NAME.CANCEL_BTN}
                                                                    style={{ cursor: "pointer" }}
                                                                    alt=""
                                                                    onClick={() => this.removeBookingRange(i)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>)}
                                            </React.Fragment> : <React.Fragment>
                                                <td colSpan="4">
                                                    No Data Found
                                                </td>
                                            </React.Fragment>}
                                        </table>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <div className="md-btn_rate text-center">
                                            <Stack spacing={2} direction="row" style={{ float: "right" }}>
                                                {/* <a href='javascript:void(0)' className="children" onClick={() => this.addBookingFeeRow(this.state.cardRowPosition)}>ADD</a> */}
                                                <Button variant="contained" onClick={() => this.addNewBookingRange(this.state.cardRowPosition)}>Add</Button>
                                                <Button variant="contained" onClick={() => this.applyMileageBtn()}>Apply</Button>
                                            </Stack>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="modal-backdrop fade"
                    id="backdrop"
                    style={{ display: "none" }}
                ></div>
            </React.Fragment>

        )
    }
}

export default VendorRateList;
