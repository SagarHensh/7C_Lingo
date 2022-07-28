import React, { Component } from "react";

// import "./VendorRateList.css";

import $ from "jquery";
// import { InputText } from "../../SharedComponents/inputText";
import { ApiCall } from "../../../services/middleware";
import { CommonData, ErrorCode } from "../../../services/constant";
import { AlertMessage, ImageName } from "../../../enums";
import { toast, ToastContainer } from "react-toastify";
import { CryptoDecoder, Decoder } from "../../../services/auth";
import {
  SmallSelectBox,
  SelectBox,
} from "../../Admin/SharedComponents/inputText";
import { NoEncryption } from "@material-ui/icons";
import {
  consoleLog,
  getLanguageArray,
  getLookUpDataFromAPI,
} from "../../../services/common-function";
import history from "../../../history";
import { numberValidator } from "../../../validators";
import { Alert } from "@mui/material";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

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
  },
];

const hdArr = [
  {
    label: "Hour",
    value: "Hour",
  },
  {
    label: "Days",
    value: "Days",
  },
];

const mhArr = [
  {
    label: "Minutes",
    value: "Minutes",
  },
  {
    label: "Hours",
    value: "Hours",
  },
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
  },
];

const mileageArr = [
  {
    label: "0-5",
    value: 5,
  },
  {
    label: "5-10",
    value: 10,
  },
  {
    label: "10-15",
    value: 15,
  },
  {
    label: "15-20",
    value: 20,
  },
  {
    label: "20-25",
    value: 25,
  },
];

const rateCardData = [
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
    mileageRate: "",
    cancelRate: "",
    cancelUnit: "",
    rushPolicyRate: "",
    rushPolicyUnit: "",
    rushFeeRate: "",
    rushFeeUnit: "",
  },
];

export class VendorRateCardList extends Component {
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
        value: 110,
      },
      selectedTargetLanguage: {},
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
          mileageRate: "",
          cancelRate: "",
          cancelUnit: "",
          rushPolicyRate: "",
          rushPolicyUnit: "",
          rushFeeRate: "",
          rushFeeUnit: "",
        },
      ],

      interpretationData: [],
      interpretationModal: false,
      searchValue: "",

      targetLanguageId: "",
      sourceLanguageId: "",

      editModalData: [],
      isEditInterpretation: false,

      appointmentTypeArr: [],
      selectedAppointmentTypeData: "",
      industryTypeArr: [],
      selectedIndustryTypeData: "",
      formDate: "",
      toDate: "",
      sourceLanguageName: "",
      targetLanguageName: "",
    };
  }

  componentDidMount() {
    // let mainData = this.props.location;
    // let preData = mainData.state;
    // let auth = Decoder.decode(localStorage.getItem("AuthToken"));
    // consoleLog("Predata>>>", auth)

    // consoleLog("Predata>>>", preData)
    // if (preData === undefined) {
    //   return history.push("/vendorRateCard");
    // } else {
    //   this.setState({
    //     vendorId: preData.id,
    //     vendorName: preData.fName + " " + preData.lName,
    //   });

    //   let data = {
    //     vendorId: preData.id,
    //     serviceId: 45,
    //   };

    //   this.getVendorLanguage(data);
    //   this.getRateList(data);
    // }

    let auth = Decoder.decode(localStorage.getItem("AuthToken"));
    consoleLog("Predata>>>", auth.data);

    if (
      auth.data.userid === undefined ||
      auth.data.userid === null ||
      auth.data.userid === ""
    ) {
      return history.push("/vendorRateCard");
    } else {
      this.setState({
        vendorId: auth.data.userid,
        //   vendorName: preData.fName + " " + preData.lName,
      });

      let data = {
        vendorId: auth.data.userid,
        serviceId: 45,
        industryTypeId: "",
        appointmentTypeId: "",
      };
     

      this.getVendorLanguage(data);
      this.getRateList(data);
    }

    document.getElementById("backdrop").style.display = "none";

    window.scrollTo(0, 0);

    var classInstance = this;

    var addModal = document.getElementById("interpretationModal");
    var addFilterModal = document.getElementById("filter-model");
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === addModal) {
        classInstance.closeInterpretationModal();
      } else if (event.target === addFilterModal) {
        classInstance.closeFilterModal();
      }
    };
    this.onLoad();
  }

  onLoad = async () => {
    let allLookupValue = [],
      allAppointmentType = [],
      allJobType = [];

    allLookupValue = await getLookUpDataFromAPI();

    // consoleLog("lookup::", allLookupValue);

    allLookupValue.INDUSTRY_TYPE.map((data) => {
      allJobType.push({
        label: data.name,
        value: data.id,
      });
    });

    allLookupValue.SCHEDULE_TYPE.map((data) => {
      if (data.id === 63) {
        allAppointmentType.push({
          label: data.name,
          //    (
          //     <div>
          //       <img
          //         src={ImageName.IMAGE_NAME.F2F}
          //         height="20px"
          //         width="20px"
          //         style={{ float: "Left" }}
          //       />
          //       <span style={{ paddingLeft: "5%" }}>{data.name}</span>
          //     </div>
          //   ),
          value: data.id,
        });
      } else if (data.id === 64) {
        allAppointmentType.push({
          label: data.name,
          //   (
          //     <div>
          //       <img
          //         src={ImageName.IMAGE_NAME.VRI_ICON}
          //         height="20px"
          //         width="20px"
          //         style={{ float: "Left" }}
          //       />
          //       <span style={{ paddingLeft: "5%" }}>{data.name}</span>
          //     </div>
          //   ),
          value: data.id,
        });
      } else if (data.id === 65) {
        allAppointmentType.push({
          label: data.name,
          //   (
          //     <div>
          //       <img
          //         src={ImageName.IMAGE_NAME.OPI_ICON}
          //         height="20px"
          //         width="20px"
          //         style={{ float: "Left" }}
          //       />
          //       <span style={{ paddingLeft: "5%" }}>{data.name}</span>
          //     </div>
          //   ),
          value: data.id,
        });
      }
    });

    this.setState({
      allAppointmentType: allAppointmentType,
      allJobType: allJobType,
      industryTypeArr: allJobType,
      appointmentTypeArr: allAppointmentType,
    });
  };

  getRateList = async (data) => {
    let res = await ApiCall("getVendorRatecardListForVendorWeb", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      consoleLog("RateCardList>>", JSON.stringify(payload.data.ratecardInfo));
      if (payload.data.ratecardInfo) {
        if (payload.data.ratecardInfo.length > 0) {
          this.setState({
            interpretationData: payload.data.ratecardInfo,
          });
        } else {
          this.setState({
            interpretationData:[]
          })
        }
      }
    }
  };

  openFilterModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("filter-model").style.display = "block";
    document.getElementById("filter-model").classList.add("show");
  };
  closeFilterModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("filter-model").style.display = "none";
    document.getElementById("filter-model").classList.remove("show");
  };

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
              value: lan.id,
            });
            if (lan.target && lan.target.length > 0) {
              let brr = [];
              let obj = {};
              obj = {
                label: lan.target[0].name,
                value: lan.target[0].id,
              };
              lan.target.map((tar) => {
                brr.push({
                  label: tar.name,
                  value: tar.id,
                });
              });
              this.setState({
                allTargetLanguage: brr,
                selectedTargetLanguage: obj,
                targetLanguage: obj.value,
              });
            }
          });
          this.setState({
            allSourceLanguage: arr,
            allVendorLanguage: payload.data.languageInfo,
          });
        }
      }
    }
  };

  //   deleteRate = async (value) => {
  //     // consoleLog("DeletId>>>", value);
  //     let data = {
  //       id: value,
  //     };
  //     let res = await ApiCall("deleteVendorRatecard", data);
  //     if (
  //       res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
  //       res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  //     ) {
  //       toast.success(AlertMessage.MESSAGE.RATE_CARD.DELETE_RATE_SUCCESS);
  //       let obj = {
  //         vendorId: this.state.vendorId,
  //       };
  //       this.getRateList(obj);
  //     }
  //   };

  addNewRow = () => {
    let arr = this.state.rateCardData;
    arr.push({
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
      mileageRate: "",
      cancelRate: "",
      cancelUnit: "",
      rushPolicyRate: "",
      rushPolicyUnit: "",
      rushFeeRate: "",
      rushFeeUnit: "",
    });
    this.setState({
      rateCardData: arr,
    });
  };

  onSourceLangChange = (data) => {
    this.setState({
      sourceLanguage: data.value,
      selectedSourceLanguage: data,
    });
    this.state.allVendorLanguage.map((lan) => {
      if (lan.id === data.value) {
        if (lan.target && lan.target.length > 0) {
          let arr = [];
          lan.target.map((tar) => {
            arr.push({
              label: tar.name,
              value: tar.id,
            });
          });
          this.setState({
            allTargetLanguage: arr,
          });
        } else {
          toast.error(AlertMessage.MESSAGE.RATE_CARD.BLANK_TARGET_LANGUAGE);
        }
      }
    });
  };

  onTargetLangChange = async (data) => {
    this.setState({
      targetLanguage: data.value,
    });

    let obj = {
      vendorId: this.state.vendorId,
      serviceId: 45,
      sourceLanguage: this.state.sourceLanguage,
      targetLanguage: data.value,
    };
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
            selectedAppointmentName = "",
            selectedIndustryTypeName = "",
            selectedMinimumDurationUnitName = "",
            selectedBillingIncrementUnitName = "",
            selectedNightWeekendUnitName = "",
            selectedCancelUnitName = "",
            selectedRushPolicyUnitName = "",
            selectedRushFeeUnitName = "";

          this.state.allAppointmentType.map((ap) => {
            if (data.appointmentType === ap.value) {
              selectedAppointment = ap;
              selectedAppointmentName = ap.label;
            }
          });

          this.state.allJobType.map((jb) => {
            if (data.industryType === jb.value) {
              selectedIndustryType = jb;
              selectedIndustryTypeName = jb.label;
            }
          });

          hdfArr.map((aa) => {
            if (data.minimumDurationUnit === aa.value) {
              selectedMinimumDurationUnit = aa;
              selectedMinimumDurationUnitName = aa.label;
            }
          });

          mhArr.map((aa) => {
            if (data.billingIncrementUnit === aa.value) {
              selectedBillingIncrementUnit = aa;
              selectedBillingIncrementUnitName = aa.label;
            }
          });

          mhfArr.map((aa) => {
            if (data.nightWeekendUnit === aa.value) {
              selectedNightWeekendUnit = aa;
              selectedNightWeekendUnitName = aa.label;
            }
          });

          hdArr.map((aa) => {
            if (data.cancelUnit === aa.value) {
              selectedCancelUnit = aa;
              selectedCancelUnitName = aa.label;
            }
          });

          hdArr.map((aa) => {
            if (data.rushPolicyUnit === aa.value) {
              selectedRushPolicyUnit = aa;
              selectedRushPolicyUnitName = aa.label;
            }
          });

          mhfArr.map((aa) => {
            if (data.rushFeeUnit === aa.value) {
              selectedRushFeeUnit = aa;
              selectedRushFeeUnitName = aa.label;
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
            selectedRushFeeUnit: selectedRushFeeUnit,
          });
        });
      } else {
        arr = rateCardData;
      }
      // consoleLog("RateCArdArray>>>", arr)
      this.setState({
        rateCardData: arr,
      });
    }
  };

  appointmentTypeChange = (value, i) => {
    let arr = this.state.rateCardData;
    arr[i].appointmentType = value.value;
    this.setState({
      rateCardData: arr,
    });
  };

  handleJobType = (value, i) => {
    let arr = this.state.rateCardData;
    arr[i].industryType = value.value;
    this.setState({
      rateCardData: arr,
    });
  };

  regularRateHourChange = (i, e) => {
    let arr = this.state.rateCardData;
    if (numberValidator(e.target.value)) {
      arr[i].regularRateHour = e.target.value;
      this.setState({
        rateCardData: arr,
      });
    }
  };

  handleRegularRateHalfDay = (e, i) => {
    let arr = this.state.rateCardData;
    if (numberValidator(e.target.value)) {
      arr[i].regularRateHalfDay = e.target.value;
      this.setState({
        rateCardData: arr,
      });
    }
  };

  handleRegularRateFullDay = (e, i) => {
    let arr = this.state.rateCardData;
    if (numberValidator(e.target.value)) {
      arr[i].regularRateFullDay = e.target.value;
      this.setState({
        rateCardData: arr,
      });
    }
  };

  handleMinimumDurationrate = (e, i) => {
    let arr = this.state.rateCardData;
    if (numberValidator(e.target.value)) {
      arr[i].minimumDurationRate = e.target.value;
      this.setState({
        rateCardData: arr,
      });
    }
  };

  handleMinimumDurationUnit = (value, i) => {
    let arr = this.state.rateCardData;
    arr[i].minimumDurationUnit = value.value;
    this.setState({
      rateCardData: arr,
    });
  };

  handleBillingRate = (e, i) => {
    let arr = this.state.rateCardData;
    if (numberValidator(e.target.value)) {
      arr[i].billingIncrementRate = e.target.value;
      this.setState({
        rateCardData: arr,
      });
    }
  };

  handleBillingUnit = (value, i) => {
    let arr = this.state.rateCardData;
    arr[i].billingIncrementUnit = value.value;
    this.setState({
      rateCardData: arr,
    });
  };

  handleNightPerWeekendRate = (e, i) => {
    let arr = this.state.rateCardData;
    if (numberValidator(e.target.value)) {
      arr[i].nightWeekendRate = e.target.value;
      this.setState({
        rateCardData: arr,
      });
    }
  };

  handleNightPerWeekendUnit = (value, i) => {
    let arr = this.state.rateCardData;
    arr[i].nightWeekendUnit = value.value;
    this.setState({
      rateCardData: arr,
    });
  };

  handleMileageRate = (e, i) => {
    let arr = this.state.rateCardData;
    if (numberValidator(e.target.value)) {
      arr[i].mileageRate = e.target.value;
      this.setState({
        rateCardData: arr,
      });
    }
  };

  // handleMileageUnit = (value, i) => {
  //     let arr = this.state.rateCardData;
  //     arr[i].mileage = value.value;
  //     this.setState({
  //         rateCardData: arr
  //     })
  // }

  handleCancelRate = (e, i) => {
    let arr = this.state.rateCardData;
    if (numberValidator(e.target.value)) {
      arr[i].cancelRate = e.target.value;
      this.setState({
        rateCardData: arr,
      });
    }
  };

  handleCancelUnit = (value, i) => {
    let arr = this.state.rateCardData;
    arr[i].cancelUnit = value.value;
    this.setState({
      rateCardData: arr,
    });
  };

  handleRushPolicyrate = (e, i) => {
    let arr = this.state.rateCardData;
    if (numberValidator(e.target.value)) {
      arr[i].rushPolicyRate = e.target.value;
      this.setState({
        rateCardData: arr,
      });
    }
  };

  handleRushPolicyUnit = (value, i) => {
    let arr = this.state.rateCardData;
    arr[i].rushPolicyUnit = value.value;
    this.setState({
      rateCardData: arr,
    });
  };

  handleRushFeeRate = (e, i) => {
    let arr = this.state.rateCardData;
    if (numberValidator(e.target.value)) {
      arr[i].rushFeeRate = e.target.value;
      this.setState({
        rateCardData: arr,
      });
    }
  };

  handleRushFeeUnit = (value, i) => {
    let arr = this.state.rateCardData;
    arr[i].rushFeeUnit = value.value;
    this.setState({
      rateCardData: arr,
    });
  };

  onSubmitRate = async () => {
    let errorCounter = 0;
    this.state.rateCardData.map((data, i) => {
      if (
        data.appointmentType === "" ||
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
        data.mileageRate === "" ||
        data.cancelRate === "" ||
        data.cancelUnit === "" ||
        data.rushPolicyRate === "" ||
        data.rushPolicyUnit === "" ||
        data.rushFeeRate === "" ||
        data.rushFeeUnit === ""
      ) {
        toast.error(
          AlertMessage.MESSAGE.RATE_CARD.ALL_FIELDS_REQUIRED +
            "at row " +
            Number(i + 1)
        );
        errorCounter++;
        return false;
      }
    });

    for (let i = 0; i < this.state.rateCardData.length; i++) {
      // consoleLog("Appointmenttyoe", this.state.rateCardData[i].appointmentType)
      if (i !== this.state.rateCardData.length - 1) {
        if (
          this.state.rateCardData[i].appointmentType ===
            this.state.rateCardData[i + 1].appointmentType &&
          this.state.rateCardData[i].industryType ===
            this.state.rateCardData[i + 1].industryType
        ) {
          toast.error(AlertMessage.MESSAGE.RATE_CARD.DUPLICATE_ENTRY);
          errorCounter++;
          return false;
        }
      }
    }

    if (errorCounter === 0) {
      let finalData = {
        vendorId: this.state.vendorId,
        sourceLanguage: this.state.sourceLanguage,
        targetLanguage: this.state.targetLanguage,
        rateCardData: this.state.rateCardData,
      };
      // consoleLog("Final Submit Rate Card Data::>>>>", finalData);
      let res = await ApiCall("addVendorRatecard", finalData);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.RATE_CARD.ADD_RATE_SUCCESS);
        this.closeInterpretationModal();
        let obj = {
          vendorId: this.state.vendorId,
        };
        this.getRateList(obj);
      }
    }
  };

  rateCardModal = async (source, target) => {
    this.state.allSourceLanguage.map((aa) => {
      if (aa.value === source) {
        this.setState({
          selectedSourceLanguage: aa,
          sourceLanguageName: aa.label,
        });
      }
    });

    this.state.allTargetLanguage.map((aa) => {
      if (aa.value === target) {
        this.setState({
          selectedTargetLanguage: aa,
          targetLanguageName: aa.label,
        });
      }
    });

    let obj = {
      vendorId: this.state.vendorId,
      serviceId: 45,
      sourceLanguage: source,
      targetLanguage: target,
    };
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
            selectedAppointmentName = "",
            selectedIndustryTypeName = "",
            selectedMinimumDurationUnitName = "",
            selectedBillingIncrementUnitName = "",
            selectedNightWeekendUnitName = "",
            selectedCancelUnitName = "",
            selectedRushPolicyUnitName = "",
            selectedRushFeeUnitName = "";

          this.state.allAppointmentType.map((ap) => {
            if (data.appointmentType === ap.value) {
              selectedAppointment = ap;
              selectedAppointmentName = ap.label;
            }
          });

          this.state.allJobType.map((jb) => {
            if (data.industryType === jb.value) {
              selectedIndustryType = jb;
              selectedIndustryTypeName = jb.label;
            }
          });

          hdfArr.map((aa) => {
            if (data.minimumDurationUnit === aa.value) {
              selectedMinimumDurationUnit = aa;
              selectedMinimumDurationUnitName = aa.label;
            }
          });

          mhArr.map((aa) => {
            if (data.billingIncrementUnit === aa.value) {
              selectedBillingIncrementUnit = aa;
              selectedBillingIncrementUnitName = aa.label;
            }
          });

          mhfArr.map((aa) => {
            if (data.nightWeekendUnit === aa.value) {
              selectedNightWeekendUnit = aa;
              selectedNightWeekendUnitName = aa.label;
            }
          });

          hdArr.map((aa) => {
            if (data.cancelUnit === aa.value) {
              selectedCancelUnit = aa;
              selectedCancelUnitName = aa.label;
            }
          });

          hdArr.map((aa) => {
            if (data.rushPolicyUnit === aa.value) {
              selectedRushPolicyUnit = aa;
              selectedRushPolicyUnitName = aa.label;
            }
          });

          mhfArr.map((aa) => {
            if (data.rushFeeUnit === aa.value) {
              selectedRushFeeUnit = aa;
              selectedRushFeeUnitName = aa.label;
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
            selectedRushFeeUnit: selectedRushFeeUnit,

            selectedAppointmentName: selectedAppointmentName,
            selectedIndustryTypeName: selectedIndustryTypeName,
            selectedMinimumDurationUnitName: selectedMinimumDurationUnitName,
            selectedBillingIncrementUnitName: selectedBillingIncrementUnitName,
            selectedNightWeekendUnitName: selectedNightWeekendUnitName,
            selectedCancelUnitName: selectedCancelUnitName,
            selectedRushPolicyUnitName: selectedRushPolicyUnitName,
            selectedRushFeeUnitName: selectedRushFeeUnitName,
          });
        });
      } else {
        arr = rateCardData;
      }
      // consoleLog("RateCArdArray>>>", arr)
      this.setState({
        rateCardData: arr,
      });
    }
    this.openInterpretationModal();
  };

  openInterpretationModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("interpretationModal").style.display = "block";
    document.getElementById("interpretationModal").classList.add("show");
  };

  closeInterpretationModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("interpretationModal").style.display = "none";
    document.getElementById("interpretationModal").classList.remove("show");
  };

  removeObject = (i) => {
    let arr = this.state.rateCardData;
    arr.splice(i, 1);
    this.setState({
      rateCardData: arr,
    });
  };

  onFilterApply = () => {
    let data = {
      vendorId: this.state.vendorId,
      serviceId: 45,
      industryTypeId:
        this.state.selectedIndustryTypeData.value === "" ||
        this.state.selectedIndustryTypeData.value === null ||
        this.state.selectedIndustryTypeData.value === undefined ? "" : parseInt(this.state.selectedIndustryTypeData.value),
      appointmentTypeId:  this.state.selectedAppointmentTypeData.value === "" ||
      this.state.selectedAppointmentTypeData.value == null ||
      this.state.selectedAppointmentTypeData.value == undefined ? "" : parseInt(this.state.selectedAppointmentTypeData.value),
    };
    consoleLog("dataa:::", data);

    this.closeFilterModal();

    this.getRateList(data);

    this.setState({
      formDate: "",
      toDate: "",
    });
  };

  onResetFilter = () => {
    this.setState({
      formDate: "",
      toDate: "",
      selectedIndustryTypeData: "",
      selectedAppointmentTypeData: "",
    });
    // // consoleLog("limit", this.state.limit);
    let data = {
      vendorId: this.state.vendorId,
      serviceId: 45,
      industryTypeId:"",
       
      appointmentTypeId: ""
       };

    this.getRateList(data);
  
    this.closeFilterModal();
  };

  formDateChange = (e) => {
    this.setState({
      formDate: e.target.value,
    });
  };

  toDateChange = (e) => {
    this.setState({
      toDate: e.target.value,
    });
  };
  onAppointmentChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      selectedAppointmentTypeData: obj,
    });
  };
  onIndustryChange = (dat) => {
    let obj = { label: dat.label, value: dat.value };
    this.setState({
      selectedIndustryTypeData: obj,
    });
  };

  render() {
    return (
      <React.Fragment>
        {/* <div className="wrapper">
          <Header />
          <Sidebar /> */}
          <div className="component-wrapper">
            <ToastContainer hideProgressBar theme="colored" />
            <div className="listing-component-app">
              <div>
                <div
                  className="vn_frm"
                  style={{
                    color: "grey",
                    paddingBottom: "2%",
                    paddingTop: "5%",
                  }}
                >
                  {" "}
                  Rate Cards
                </div>
                {/* <div className="vendor-info _fl sdw">
                <div className="vn-form _fl">
                  <div className="row">
                    <div className="col-md-4">
                      <div
                        className="vn_frm"
                        style={{ color: "grey", fontSize: "15px" }}
                      >
                        {" "}
                        Vendor: {this.state.vendorName}
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div> */}
                <div className="table-filter-app">
                  <div
                    class="filter-btn"
                    style={{ float: "none", paddingLeft: "10px" }}
                  >
                    <a
                      href="javascript:void(0)"
                      onClick={() => {
                        this.openFilterModal();
                      }}
                    >
                      Filter
                    </a>
                  </div>
                </div>
              </div>
              <div hidden={!this.state.isInterpretation}>
                <div className="table-listing-app">
                  <div className="table-responsive">
                    {/* <div className="table-responsive_cus table-style-a"> */}
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                    >
                      <tbody>
                        <tr>
                          <th style={{ width: "20%" }}>Source Language</th>
                          <th style={{ width: "20%" }}>Target Language</th>
                          <th style={{ width: "20%" }}>Appointment Type</th>
                          <th style={{ width: "20%" }}>Industry Type</th>
                          <th style={{ width: "20%" }}>Action</th>
                        </tr>
                        {this.state.interpretationData.length > 0 ? (
                          <React.Fragment>
                            {this.state.interpretationData.map((item, key) => (
                              <tr>
                                <td colSpan="11">
                                  <div className="tble-row">
                                    <table
                                      width="100%"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                    >
                                      <tbody>
                                        <tr>
                                          <td style={{ width: "20%" }}>
                                            {item.sourceLanguage}
                                          </td>
                                          <td style={{ width: "20%" }}>
                                            {item.targetLanguage}
                                          </td>
                                          <td style={{ width: "20%" }}>
                                            {item.appointmentType}
                                          </td>
                                          <td style={{ width: "20%" }}>
                                            {item.industryType}
                                          </td>
                                          <td style={{ width: "20%" }}>
                                            <div className="tbl-editing-links">
                                              <button
                                                className="tr-toggle"
                                                onClick={() =>
                                                  this.rateCardModal(
                                                    item.sourceLanguageId,
                                                    item.targetLanguageId
                                                  )
                                                }
                                              >
                                                <img
                                                  src={
                                                    ImageName.IMAGE_NAME.EYE_BTN
                                                  }
                                                />
                                              </button>

                                              {/* <button
                                          className="tr-toggle"
                                          onClick={() =>
                                            this.deleteRate(item.id)
                                          }
                                        >
                                          <img
                                            src={ImageName.IMAGE_NAME.TRASH_BTN}
                                          />
                                        </button> */}
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <tr style={{ textAlign: "center" }}>
                              <td colSpan="7">
                                <center style={{ fontSize: "20px" }}>
                                  No data found !!!
                                </center>
                              </td>
                            </tr>
                          </React.Fragment>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            id="interpretationModal"
            className="modal fade"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              role="document"
            >
              <div className="modal-content">
                <div className="filter-head _fl document-hd">
                  <h3 className="text-center center-text"> Rate Card</h3>
                  <button
                    type="button"
                    className="close"
                    onClick={this.closeInterpretationModal}
                  >
                    X
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-wrap">
                    <div className="sdw _fl _mg4">
                      {/* <h4 className="h4-grey-text">
                      Vendor: {this.state.vendorName}
                    </h4> */}
                      <div className="form-step-row m30 _fl">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-stp">
                              <span>Source Language</span>
                              <div
                                className="selectbox"
                                style={{ width: "60%" }}
                              >
                                <p style={{ fontSize: "14px" }}>
                                  {this.state.sourceLanguageName}
                                </p>
                                {/* <SelectBox
                                  isDisabled
                                  optionData={this.state.allSourceLanguage}
                                  value={this.state.selectedSourceLanguage}
                                  placeholder="Select"
                                  onSelectChange={(value) => {
                                    this.onSourceLangChange(value);
                                  }}
                                /> */}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4"></div>
                          <div className="col-md-4">
                            <div className="form-stp">
                              <span>Target Language</span>
                              <div
                                className="selectbox"
                                style={{ width: "60%" }}
                              >
                                <p style={{ fontSize: "14px" }}>
                                  {this.state.targetLanguageName}
                                </p>
                                {/* <SelectBox
                                  isDisabled
                                  optionData={this.state.allTargetLanguage}
                                  value={this.state.selectedTargetLanguage}
                                  placeholder="Select"
                                  onSelectChange={(value) => {
                                    this.onTargetLangChange(value);
                                  }}
                                /> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="table-listing-app card">
                    <div
                      className="table-responsive"
                      style={{ paddingBottom: "10%" }}
                    >
                      <table
                        width="100%"
                        border="0"
                        cellpadding="0"
                        cellSpacing="0"
                      >
                        <tr>
                          <th style={{ width: "7%" }}>Appointment Type</th>
                          <th style={{ width: "7%", paddingLeft: "2%" }}>
                            Industry Type
                          </th>
                          <th style={{ width: "16%", paddingLeft: "2%" }}>
                            Regular Rate ($/Unit)
                          </th>
                          <th style={{ width: "10%", paddingLeft: "2%" }}>
                            Minimum Duration
                          </th>
                          <th style={{ width: "10%", paddingLeft: "2%" }}>
                            Billing Increment
                          </th>
                          <th style={{ width: "10%", paddingLeft: "2%" }}>
                            Night/weekends
                          </th>
                          <th style={{ width: "6%", paddingLeft: "2%" }}>
                            Mileage Rate
                          </th>
                          <th style={{ width: "10%", paddingLeft: "2%" }}>
                            Cancellation Charges
                          </th>
                          <th style={{ width: "10%", paddingLeft: "2%" }}>
                            Rush Policy
                          </th>
                          <th style={{ width: "10%", paddingLeft: "2%" }}>
                            Rush Fee
                          </th>
                          <th style={{ width: "4%", paddingLeft: "2%" }}></th>
                        </tr>
                        {this.state.rateCardData.map((item, index) => (
                          <React.Fragment key={index}>
                            <tr style={{ borderBottom: "1px solid #b7b8b8" }}>
                              <td style={{ width: "7%" }}>
                                <p style={{ fontSize: "10px" }}>
                                  {item.selectedAppointmentName}
                                </p>
                                {/* <input
                                  disabled
                                  type="text"
                                  className="in-field3_vr"
                                  value={item.selectedAppointmentName}
                                  placeholder="Select"
                                 
                                ></input> */}
                              </td>
                              <td style={{ width: "7%" }}>
                                <p style={{ fontSize: "10px" }}>
                                  {item.selectedIndustryTypeName}
                                </p>
                                {/* <input
                                   disabled
                                   type="text"
                                  optionData={this.state.allJobType}
                                  value={item.selectedIndustryTypeName}
                                  placeholder="Select"
                                  className="in-field3_vr"
                                  // onSelectChange={(value) => {
                                  //   this.handleJobType(value, index);
                                  // }}
                                  
                                /> */}
                              </td>
                              <td style={{ width: "16%", paddingLeft: "1%" }}>
                                <p style={{ fontSize: "10px" }}>
                                  {item.regularRateHour != "" ||
                                  item.regularRateHour != null ||
                                  item.regularRateHour != undefined
                                    ? "$ " + item.regularRateHour + " /Hour"
                                    : ""}{" "}
                                </p>
                                <p style={{ fontSize: "10px" }}>
                                  {item.regularRateHalfDay != "" ||
                                  item.regularRateHalfDay != null ||
                                  item.regularRateHalfDay != undefined
                                    ? "$ " +
                                      item.regularRateHalfDay +
                                      " /Half Day"
                                    : ""}{" "}
                                </p>
                                <p style={{ fontSize: "10px" }}>
                                  {item.regularRateFullDay != "" ||
                                  item.regularRateFullDay != null ||
                                  item.regularRateFullDay != undefined
                                    ? "$ " + item.regularRateHour + " /Day"
                                    : ""}{" "}
                                </p>
                                {/* <div
                                  className="row no-gutters"
                                  style={{ padding: "5%" }}
                                >
                                  <div className="col-md-4">
                                      
                                    <input
                                      disabled
                                      type="text"
                                      value={item.regularRateHour}
                                      name=""
                                      placeholder="per hour"
                                      className="in-field3_vr"
                                      style={{ cursor: "pointer" }}
                                      // onChange={(e) =>
                                      //   this.regularRateHourChange(index, e)
                                      // }
                                    />
                                  </div>
                                  <div className="col-md-4">
                                    <input
                                      disabled
                                      type="text"
                                      value={item.regularRateHalfDay}
                                      name=""
                                      placeholder="Half day"
                                      className="in-field3_vr"
                                      style={{ cursor: "pointer" }}
                                      // onChange={(e) =>
                                      //   this.handleRegularRateHalfDay(e, index)
                                      // }
                                    />
                                  </div>
                                  <div className="col-md-4">
                                    <input
                                      disabled
                                      type="text"
                                      value={item.regularRateFullDay}
                                      name=""
                                      placeholder="Full Day"
                                      className="in-field3_vr"
                                      style={{ cursor: "pointer" }}
                                      // onChange={(e) =>
                                      //   this.handleRegularRateFullDay(e, index)
                                      // }
                                    />
                                  </div>
                                </div> */}
                              </td>
                              <td style={{ width: "10%", paddingLeft: "2%" }}>
                                <p style={{ fontSize: "10px" }}>
                                  {item.minimumDurationRate !== "" ||
                                  item.minimumDurationRate !== null ||
                                  item.minimumDurationRate !== undefined ||
                                  item.selectedMinimumDurationUnitName !== "" ||
                                  item.selectedMinimumDurationUnitName !==
                                    null ||
                                  item.selectedMinimumDurationUnitName !==
                                    undefined
                                    ? item.minimumDurationRate +
                                      " " +
                                      item.selectedMinimumDurationUnitName
                                    : ""}
                                </p>

                                {/* <div
                                  className="row no-gutters"
                                  style={{ padding: "2%" }}
                                >
                                  <div className="col-md-4">
                               
                                    <input
                                      disabled
                                      type="text"
                                      value={item.minimumDurationRate}
                                      name=""
                                      placeholder="$"
                                      className="in-field3_vr"
                                      // onChange={(e) =>
                                      //   this.handleMinimumDurationrate(e, index)
                                      // }
                                    />
                                  </div>
                                  <div className="col-md-8">
                                    <input
                                      disabled
                                      type="text"
                                    //   optionData={hdfArr}
                                      value={item.selectedMinimumDurationUnitName}
                                      placeholder="Select"
                                      className="in-field3_vr"
                                      // onSelectChange={(value) => {
                                      //   this.handleMinimumDurationUnit(
                                      //     value,
                                      //     index
                                      //   );
                                      // }}
                                    />
                                  </div>
                                </div> */}
                              </td>
                              <td style={{ width: "10%", paddingLeft: "2%" }}>
                                <p style={{ fontSize: "10px" }}>
                                  {item.billingIncrementRate !== "" ||
                                  item.billingIncrementRate !== null ||
                                  item.billingIncrementRate !== undefined ||
                                  item.selectedBillingIncrementUnitName !==
                                    "" ||
                                  item.selectedBillingIncrementUnitName !==
                                    null ||
                                  item.selectedBillingIncrementUnitName !==
                                    undefined
                                    ? item.billingIncrementRate +
                                      " " +
                                      item.selectedBillingIncrementUnitName
                                    : ""}
                                </p>
                                {/* <p style={{ fontSize: "10px" }}>
                                  {item.billingIncrementRate}{" "}
                                  {item.selectedBillingIncrementUnitName}
                                </p> */}
                                {/* <div
                                  className="row no-gutters"
                                  style={{ padding: "1%" }}
                                >
                                  <div className="col-md-4">
                                    <input
                                      disabled
                                      type="text"
                                      value={item.billingIncrementRate}
                                      name=""
                                      placeholder="$"
                                      className="in-field3_vr"
                                      // onChange={(e) =>
                                      //   this.handleBillingRate(e, index)
                                      // }
                                    />
                                  </div>
                                  <div className="col-md-8">
                                    <input
                                      disabled
                                      type="text"
                                    //   optionData={mhArr}
                                      value={item.selectedBillingIncrementUnitName}
                                      placeholder="Select"
                                      className="in-field3_vr"
                                      // onSelectChange={(value) => {
                                      //   this.handleBillingUnit(value, index);
                                      // }}
                                    />
                                  </div>
                                </div> */}
                              </td>
                              <td style={{ width: "10%", paddingLeft: "2%" }}>
                                <p style={{ fontSize: "10px" }}>
                                  {item.nightWeekendRate !== "" ||
                                  item.nightWeekendRate !== null ||
                                  item.nightWeekendRate !== undefined ||
                                  item.selectedNightWeekendUnitName !== null ||
                                  item.selectedNightWeekendUnitName !== "" ||
                                  item.selectedNightWeekendUnitName !==
                                    undefined
                                    ? "$ " +
                                      item.nightWeekendRate +
                                      " /" +
                                      item.selectedNightWeekendUnitName
                                    : ""}
                                </p>
                                {/* <p style={{ fontSize: "10px" }}>
                                  {"$ " +
                                    item.nightWeekendRate +
                                    "/" +
                                    item.selectedNightWeekendUnitName}
                                </p> */}

                                {/* <div
                                  className="row no-gutters"
                                  style={{ padding: "2%" }}
                                >
                                  <div className="col-md-4">
                                    <input
                                      disabled
                                      type="text"
                                      value={item.nightWeekendRate}
                                      placeholder="$"
                                      className="in-field3_vr"
                                      // onChange={(e) =>
                                      //   this.handleNightPerWeekendRate(e, index)
                                      // }
                                    />
                                  </div>
                                  <div className="col-md-8">
                                    <input
                                        disabled
                                        type="text"
                                    //   optionData={mhfArr}
                                      value={item.selectedNightWeekendUnitName}
                                      placeholder="Select"
                                      className="in-field3_vr"
                                      // onSelectChange={(value) => {
                                      //   this.handleNightPerWeekendUnit(
                                      //     value,
                                      //     index
                                      //   );
                                      // }}
                                    />
                                  </div>
                                </div> */}
                              </td>
                              <td style={{ width: "6%", paddingLeft: "2%" }}>
                                <p style={{ fontSize: "10px" }}>
                                  {item.mileageRate !== "" ||
                                  item.mileageRate !== null ||
                                  item.mileageRate !== undefined
                                    ? "$ " + item.mileageRate
                                    : ""}
                                </p>
                                {/* <div
                                  className="row no-gutters"
                                  style={{ padding: "2%" }}
                                >
                                  <div className="col-md-12">
                                    <input
                                      disabled
                                      type="text"
                                      value={item.mileageRate}
                                      placeholder="Per mile"
                                      className="in-field3_vr"
                                      // onChange={(e) =>
                                      //   this.handleMileageRate(e, index)
                                      // }
                                    />
                                  </div>
                               
                                </div> */}
                              </td>
                              <td style={{ width: "10%", paddingLeft: "2%" }}>
                                <p style={{ fontSize: "10px" }}>
                                  {item.cancelRate !== "" ||
                                  item.cancelRate !== null ||
                                  item.cancelRate !== undefined ||
                                  item.selectedCancelUnitName !== null ||
                                  item.selectedCancelUnitName !== "" ||
                                  item.selectedCancelUnitName !== undefined
                                    ? "$ " +
                                      item.cancelRate +
                                      " /" +
                                      item.selectedCancelUnitName
                                    : ""}
                                </p>
                                {/* <div
                                  className="row no-gutters"
                                  style={{ paddingLeft: "1%" }}
                                >
                                  <div className="col-md-4">
                                    <input
                                      disabled
                                      type="text"
                                      value={item.cancelRate}
                                      name=""
                                      placeholder="$"
                                      className="in-field3_vr"
                                      // onChange={(e) =>
                                      //   this.handleCancelRate(e, index)
                                      // }
                                    />
                                  </div>
                                  <div className="col-md-8">
                                    <input
                                      disabled
                                      type="text"
                                      //   optionData={hdArr}
                                      value={item.selectedCancelUnitName}
                                      placeholder="Select"
                                      className="in-field3_vr"
                                      // onSelectChange={(value) => {
                                      //   this.handleCancelUnit(value, index);
                                      // }}
                                    />
                                  </div>
                                </div> */}
                              </td>
                              <td style={{ width: "10%", paddingLeft: "2%" }}>
                                <p style={{ fontSize: "10px" }}>
                                  {item.rushPolicyRate !== "" ||
                                  item.rushPolicyRate !== null ||
                                  item.rushPolicyRate !== undefined ||
                                  item.selectedRushPolicyUnitName !== null ||
                                  item.selectedRushPolicyUnitName !== "" ||
                                  item.selectedRushPolicyUnitName !== undefined
                                    ? item.rushPolicyRate +
                                      " " +
                                      item.selectedRushPolicyUnitName
                                    : ""}
                                </p>
                                {/* <div
                                  className="row no-gutters"
                                  style={{ paddingLeft: "1%" }}
                                >
                                  <div className="col-md-4">
                                    <input
                                      disabled
                                      type="text"
                                      value={item.rushPolicyRate}
                                      name=""
                                      placeholder="$"
                                      className="in-field3_vr"
                                      // onChange={(e) =>
                                      //   this.handleRushPolicyrate(e, index)
                                      // }
                                    />
                                  </div>
                                  <div className="col-md-8">
                                    <input
                                      disabled
                                      type="text"
                                      //   optionData={hdArr}
                                      value={item.selectedRushPolicyUnitName}
                                      placeholder="Select"
                                      className="in-field3_vr"
                                      // onSelectChange={(value) => {
                                      //   this.handleRushPolicyUnit(value, index);
                                      // }}
                                    />
                                  </div>
                                </div> */}
                              </td>
                              <td style={{ width: "10%", paddingLeft: "2%" }}>
                                <p style={{ fontSize: "10px" }}>
                                  {item.rushFeeRate !== "" ||
                                  item.rushFeeRate !== null ||
                                  item.rushFeeRate !== undefined ||
                                  item.selectedRushFeeUnitName !== null ||
                                  item.selectedRushFeeUnitName !== "" ||
                                  item.selectedRushFeeUnitName !== undefined
                                    ? "$ " +
                                      item.rushFeeRate +
                                      " /" +
                                      item.selectedRushFeeUnitName
                                    : ""}
                                </p>
                                {/* <div
                                  className="row no-gutters"
                                  style={{ paddingLeft: "1%" }}
                                >
                                  <div className="col-md-4">
                                    <input
                                      disabled
                                      type="text"
                                      value={item.rushFeeRate}
                                      name=""
                                      placeholder="$"
                                      className="in-field3_vr"
                                      // onChange={(e) =>
                                      //   this.handleRushFeeRate(e, index)
                                      // }
                                    />
                                  </div>
                                  <div className="col-md-8">
                                    <input
                                      disabled
                                      type="text"
                                      //   optionData={mhfArr}
                                      value={item.selectedRushFeeUnitName}
                                      placeholder="Select"
                                      className="in-field3_vr"
                                      // onSelectChange={(value) => {
                                      //   this.handleRushFeeUnit(value, index);
                                      // }}
                                    />
                                  </div>
                                </div> */}
                              </td>
                              {/* <td style={{ width: "4%", paddingLeft: "2%" }}>
                              {index > 0 ? (
                                <img
                                  src={ImageName.IMAGE_NAME.CANCEL_BTN}
                                  style={{ cursor: "pointer" }}
                                  alt=""
                                  onClick={() => this.removeObject(index)}
                                />
                              ) : (
                                <React.Fragment></React.Fragment>
                              )}
                            </td> */}
                            </tr>
                          </React.Fragment>
                        ))}
                      </table>
                    </div>
                  </div>
                  {/* <div
                  className="_button-style _fl text-center"
                  style={{ paddingBottom: "5%" }}
                >
                  <a
                    href="javascript:void(0)"
                    className="blue-btn"
                    onClick={this.addNewRow}
                  >
                    Add More
                  </a>
                </div> */}
                  {/* <div className="b-i-s _fl text-right _button-style m30">
                                    <a href="#" className="blue-btn">Add language Pair</a>
                                </div> */}
                  {/* <div className="_button-style _fl text-center">
                  <a
                    href="javascript:void(0)"
                    className="grey-btn"
                    style={{ textDecoration: "none" }}
                    onClick={this.closeInterpretationModal}
                  >
                    cancel
                  </a>
                 
                  <a
                    href="javascript:void(0)"
                    className="blue-btn"
                    onClick={() => this.onSubmitRate()}
                  >
                    SAVE
                  </a>
                </div> */}
                </div>
              </div>
            </div>
          </div>
          <div
            id="filter-model"
            className="modal fade modelwindow"
            role="dialog"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              {/* <!-- Modal content--> */}
              <div className="modal-content">
                <div className="filter-head _fl mdf">
                  <h3>Filter by</h3>
                  <div className="reset-btn-dp">
                    <button className="reset" data-dismiss="modal">
                      <img
                        src={ImageName.IMAGE_NAME.RESET_BTN}
                        onClick={this.onResetFilter}
                      />
                      Reset
                    </button>
                    <button className="apply" data-dismiss="modal">
                      <img
                        src={ImageName.IMAGE_NAME.BLUE_TICK}
                        onClick={this.onFilterApply}
                      />
                      Apply
                    </button>
                  </div>
                </div>
                <div className="modal-body">
                  <div className="model-info f-model">
                    {/* <div className="form-search-app">
                      <div className="lable-text">requested on</div>
                      <div className="form-field-app">
                        <span>from</span>
                        <input
                          type="date"
                          className="datefield bd"
                          placeholder="10/25/2021"
                          value={this.state.formDate}
                          onChange={this.formDateChange}
                        />
                      </div>
                      <div className="form-field-app">
                        <span>to</span>
                        <input
                          type="date"
                          className="datefield bd"
                          placeholder="10/25/2021"
                          value={this.state.toDate}
                          onChange={this.toDateChange}
                        />
                      </div>
                    </div> */}
                    <div className="m-select _fl">
                      <div class="row">
                        <div class="col-md-2" style={{ textAlign: "center" }}>
                          <div class="lable-text" style={{ fontSize: "11px" }}>
                            Appointment Type
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div class="dropdwn">
                            <SelectBox
                              optionData={this.state.appointmentTypeArr}
                              value={this.state.selectedAppointmentTypeData}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onAppointmentChange(value);
                              }}
                            />
                          </div>
                        </div>
                        <div class="col-md-2" style={{ textAlign: "center" }}>
                          <div class="lable-text" style={{ fontSize: "11px" }}>
                            Industry Type
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div class="dropdwn">
                            <SelectBox
                              optionData={this.state.industryTypeArr}
                              value={this.state.selectedIndustryTypeData}
                              placeholder="Select"
                              onSelectChange={(value) => {
                                this.onIndustryChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/* </div> */}

        <div
          class="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}

export default VendorRateCardList;
