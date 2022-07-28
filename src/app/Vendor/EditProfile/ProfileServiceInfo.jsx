import axios from "axios";
import React from "react";
import ReactStars from "react-rating-stars-component";
import { toast, ToastContainer } from "react-toastify";
import { Decoder } from "../../../services/auth";
import { consoleLog, getLanguageArray } from "../../../services/common-function";
import { VENDOR_SERVICE_OFFERED } from "../../../services/config/api_url";
import { ErrorCode } from "../../../services/constant";
import { ApiCall } from "../../../services/middleware";
import { MultiSelectBox, SelectBox } from "../../Admin/SharedComponents/inputText";

const languageSkillArr = [
    {
        label: "Read",
        value: 1,
    },
    {
        label: "Write",
        value: 2,
    },
    {
        label: "Speak",
        value: 3,
    },
];

export default class ProfileServiceInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showId: this.props.vendorId,
            role: "45",
            languageArr: [],
            primaryLanguageSkillArr: languageSkillArr,
            primaryLanguageData: {},
            primaryLanguageSkillData: [],
            primaryLanguageRating: "",
            isSelected: false,
            otherLanguageData: [],
            otherLanguageSet: [],

            serviceId: [],
            serviceArrData: [],
            translatorLanguageSet: [{
                id: "",
                name: "",
                source: "110",
                selectedTranslationSourceLanguage: {
                    label: "English",
                    value: "110"
                },
                target: "",
                selectedTranslationTargetLanguage: {},
                skill: [],
                rating: ""
            }],
            translationServiceArr: [],
            selectedTranslationServices: [],
            serviceArrDataTranslation: [],
            restrainingServicesArr: [],
            allTrainingMode: [],
            trainerNotes: "",
            selectedMode: "30",
            trainingServiceData: []
        }

        this.getTrainingServices();
        this.onLoad();
    }

    onLoad = async () => {
        let languageArrData = [],
            serviceDataArr = [],
            parseData = {},
            serviceArr = [],
            interpretorArr = [],
            roleLanguageArr = [];
        languageArrData = await getLanguageArray();
        // consoleLog("Language Arr : ", languageArrData);
        this.setState({
            languageArr: languageArrData
        });


        let addressData = {
            vendorid: this.props.vendorId,
        };
        // consoleLog("AddressData", addressData)
        let serviceRes = await ApiCall("fetchVendorService", addressData);
        if (
            serviceRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            serviceRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            let payload = Decoder.decode(serviceRes.data.payload);
            serviceArr = payload.data.service;
            roleLanguageArr = payload.data.languages;
            // consoleLog("Vendor serviceInfo response>>>>>>>", serviceArr);
            // consoleLog("Vendor Language Array ::", roleLanguageArr);
            if (serviceArr.length > 0) {
                for (let i = 0; i < serviceArr.length; i++) {
                    parseData = JSON.parse(serviceArr[i].details);
                    serviceDataArr.push({
                        label: parseData.name,
                        value: parseData.id,
                    });
                }


                //Interpretation translation service..................


                let serviceResDataInt = [];
                axios.post(VENDOR_SERVICE_OFFERED).then((res) => {
                    if (
                        res.data.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                        res.data.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
                    ) {
                        let payload = Decoder.decode(res.data.data.payload);

                        let allserviceArr = payload.data.services,
                            serArr = [];
                        // consoleLog("All service Arr>>>", allserviceArr);
                        if (allserviceArr.length > 0) {
                            allserviceArr.map((data) => {
                                if (data.id === parseInt("45")) {
                                    if (data.subItem.length > 0) {
                                        data.subItem.map((aa) => {
                                            serArr.push({
                                                label: aa.subItemName,
                                                value: aa.id,
                                                subData: aa.subData
                                            })
                                        })
                                    }
                                    serviceResDataInt = serArr;
                                }
                            })
                        }
                        this.setState({
                            serviceArrData: serviceResDataInt,
                        });
                    }
                })

                for (let a = 0; a < serviceArr.length; a++) {
                    if (serviceArr[a].serviceid === 45) {
                        interpretorArr = JSON.parse(serviceArr[a].details);
                        // consoleLog("Interpretor Arr::", interpretorArr);

                        let obj = {};
                        obj = {
                            label: interpretorArr.name,
                            value: parseInt(interpretorArr.id)
                        }


                        let serviceResData = [];
                        axios.post(VENDOR_SERVICE_OFFERED).then((res) => {
                            if (
                                res.data.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                                res.data.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
                            ) {
                                let payload = Decoder.decode(res.data.data.payload);

                                let allserviceArr = payload.data.services,
                                    serArr = [];
                                // consoleLog("All service Arr>>>", allserviceArr);
                                if (allserviceArr.length > 0) {
                                    allserviceArr.map((data) => {
                                        if (data.id === parseInt(serviceArr[a].serviceid)) {
                                            if (data.subItem.length > 0) {
                                                data.subItem.map((aa) => {
                                                    serArr.push({
                                                        label: aa.subItemName,
                                                        value: parseInt(aa.id),
                                                        subData: aa.subData
                                                    })
                                                })
                                            }
                                            serviceResData = serArr;
                                        }
                                    })
                                }
                                this.setState({
                                    serviceArrData: serviceResData,
                                });
                                if (serviceResData.length > 0) {

                                    let arr = [];
                                    serviceResData.map((data) => {
                                        if (interpretorArr.subItem) {
                                            interpretorArr.subItem.map((int) => {
                                                if (data.value == int.id) {
                                                    if (int.subData && data.subData) {
                                                        var brr = [];
                                                        for (let a = 0; a < data.subData.length; a++) {
                                                            var aa = data.subData[a];
                                                            var chkFlag = 0;
                                                            for (let b = 0; b < int.subData.length; b++) {
                                                                var bb = int.subData[b];
                                                                if (aa.id == bb.id) {
                                                                    chkFlag = 1;
                                                                    break;
                                                                }
                                                            }
                                                            if (chkFlag == 1) {
                                                                brr.push({
                                                                    id: aa.id,
                                                                    name: aa.name,
                                                                    isChecked: true
                                                                })
                                                            } else {
                                                                brr.push({
                                                                    id: aa.id,
                                                                    name: aa.name,
                                                                    isChecked: false
                                                                })
                                                            }
                                                        }
                                                        arr.push({
                                                            label: int.subItemName,
                                                            value: parseInt(int.id),
                                                            subData: brr
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    })
                                    // consoleLog("array service offered>>>", arr)
                                    this.setState({
                                        serviceId: arr,
                                    });
                                }
                            }
                        });

                        if (roleLanguageArr.length > 0) {
                            roleLanguageArr.map((data, i) => {
                                if (data.serviceId === parseInt(interpretorArr.id)) {
                                    if (data.info.length > 0) {
                                        if (data.info.length > 1) {
                                            this.setState({
                                                isSelected: true
                                            });
                                            document.getElementById("otherLan_yes").checked = true;
                                            let arr = [];
                                            let brr = [];
                                            for (let i = 1; i < data.info.length; i++) {
                                                let crr = [];
                                                if (data.info[i].isPrimary === 0) {
                                                    languageArrData.map((ldata) => {
                                                        if (ldata.value === data.info[i].languageId) {
                                                            if (data.info[i].canRead === 1) {
                                                                crr.push({
                                                                    label: "Read",
                                                                    value: 1,
                                                                })
                                                            }
                                                            if (data.info[i].canWrite === 1) {
                                                                crr.push({
                                                                    label: "Write",
                                                                    value: 2,
                                                                })
                                                            }
                                                            if (data.info[i].canSpeak === 1) {
                                                                crr.push({
                                                                    label: "Speak",
                                                                    value: 3,
                                                                })
                                                            }
                                                            arr.push({
                                                                id: data.info[i].languageId,
                                                                name: ldata.label,
                                                                skill: crr,
                                                                rating: data.info[i].ratings
                                                            });
                                                            brr.push({
                                                                label: ldata.label,
                                                                value: ldata.value
                                                            })
                                                        }
                                                    })

                                                }
                                            }
                                            this.setState({
                                                otherLanguageData: brr,
                                                otherLanguageSet: arr
                                            })
                                        } else {
                                            document.getElementById("otherLan_no").checked = true;
                                        }
                                        data.info.map((linfo, j) => {
                                            if (linfo.isPrimary === 1) {
                                                languageArrData.map((lan) => {
                                                    if (lan.value === linfo.languageId) {
                                                        this.setState({
                                                            primaryLanguageData: {
                                                                label: lan.label,
                                                                value: lan.value
                                                            }
                                                        })
                                                    }
                                                });
                                                let primarySkillArr = [];
                                                if (linfo.canRead === 1) {
                                                    primarySkillArr.push({
                                                        label: "Read",
                                                        value: 1
                                                    })
                                                }
                                                if (linfo.canWrite === 1) {
                                                    primarySkillArr.push({
                                                        label: "Write",
                                                        value: 2
                                                    })
                                                }
                                                if (linfo.canSpeak === 1) {
                                                    primarySkillArr.push({
                                                        label: "Speak",
                                                        value: 3
                                                    })
                                                }
                                                // console.log("Primary ratings : ", linfo.ratings)
                                                this.setState({
                                                    primaryLanguageSkillData: primarySkillArr,
                                                    primaryLanguageRating: linfo.ratings
                                                })
                                            }
                                        })
                                    }
                                }

                            })
                        }
                    }



                    //Translation Service data..........


                    let serviceResDataTr = [];

                    axios.post(VENDOR_SERVICE_OFFERED).then((res) => {
                        if (
                            res.data.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                            res.data.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
                        ) {
                            let payload = Decoder.decode(res.data.data.payload);

                            let allserviceArr = payload.data.services,
                                serArr = [];
                            // consoleLog("All service Arr>>>", allserviceArr);
                            if (allserviceArr.length > 0) {
                                allserviceArr.map((data) => {
                                    if (data.id === parseInt("46")) {
                                        if (data.subItem.length > 0) {
                                            data.subItem.map((aa) => {
                                                serArr.push({
                                                    label: aa.subItemName,
                                                    value: aa.id
                                                })
                                            })
                                        }
                                        serviceResDataTr = serArr;
                                    }
                                })
                            }
                            this.setState({
                                translationServiceArr: serviceResDataTr,
                            });
                        }
                    })

                    if (serviceArr[a].serviceid === 46) {
                        let translatorArr = JSON.parse(serviceArr[a].details);
                        let translatorLanguageData = [];
                        let selectedTranslationServices = [];
                        // consoleLog("Translator Arr::", translatorArr);
                        if (roleLanguageArr.length > 0) {
                            roleLanguageArr.map((data) => {
                                if (data.serviceId === parseInt(translatorArr.id)) {
                                    if (data.info.length > 0) {

                                        data.info.map((linfo, j) => {
                                            let selectedSourceLanguage = {},
                                                selectedTargetLanguage = {},
                                                selectedSkill = [];

                                            if (linfo.isPrimary === 1) {

                                                //Set translation source Language.........
                                                languageArrData.map((lan) => {
                                                    if (lan.value === linfo.languageId) {

                                                        selectedSourceLanguage = {
                                                            label: lan.label,
                                                            value: lan.value
                                                        }
                                                    }
                                                });

                                                //........set Translation Target Language.......
                                                languageArrData.map((lan) => {
                                                    if (lan.value === linfo.targetLanguageId) {

                                                        selectedTargetLanguage = {
                                                            label: lan.label,
                                                            value: lan.value
                                                        }
                                                    }
                                                });

                                                //.......... Set Translation Language Skills.......
                                                if (linfo.canRead === 1) {
                                                    selectedSkill.push({
                                                        label: "Read",
                                                        value: 1
                                                    })
                                                }
                                                if (linfo.canWrite === 1) {
                                                    selectedSkill.push({
                                                        label: "Write",
                                                        value: 2
                                                    })
                                                }
                                                if (linfo.canSpeak === 1) {
                                                    selectedSkill.push({
                                                        label: "Speak",
                                                        value: 3
                                                    })
                                                }

                                                translatorLanguageData.push({
                                                    id: linfo.id,
                                                    name: "",
                                                    source: linfo.languageId,
                                                    selectedTranslationSourceLanguage: selectedSourceLanguage,
                                                    target: linfo.targetLanguageId,
                                                    selectedTranslationTargetLanguage: selectedTargetLanguage,
                                                    skill: selectedSkill,
                                                    rating: linfo.ratings.toString()
                                                })


                                            }
                                        })
                                        this.setState({
                                            translatorLanguageSet: translatorLanguageData
                                        })
                                    }
                                }

                            })
                        }



                        //For Selected translation Services....................
                        if (translatorArr.subItem) {
                            translatorArr.subItem.map((int) => {
                                selectedTranslationServices.push({
                                    label: int.subItemName,
                                    value: parseInt(int.id)
                                })
                            })

                        }

                        this.setState({
                            selectedTranslationServices: selectedTranslationServices
                        })

                    }
                    if (serviceArr[a].serviceid === 47) {
                        let trainingArr = JSON.parse(serviceArr[a].details);
                        // consoleLog("Training Arr::", trainingArr);

                        let selectedTrainingServices = [],
                            trainingMode = "";

                        if (trainingArr.subItem) {
                            trainingArr.subItem.map((int) => {
                                selectedTrainingServices.push({
                                    label: int.subItemName,
                                    value: parseInt(int.id)
                                })
                            })
                        }

                        if (trainingArr.mode) {
                            if (trainingArr.mode.length > 0) {
                                trainingMode = trainingArr.mode[0].id
                            }
                        }

                        this.setState({
                            trainingServiceData: selectedTrainingServices,
                            trainingMode: trainingMode
                        })
                    }


                }

            }
        }
    }

    // getServiceArrData = async (serviceArr) => {

    //     let serviceResData = [];
    //     axios.post(VENDOR_SERVICE_OFFERED).then((res) => {
    //         if (
    //             res.data.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //             res.data.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    //         ) {
    //             let payload = Decoder.decode(res.data.data.payload);

    //             let allserviceArr = payload.data.services,
    //                 serArr = [];
    //             // consoleLog("All service Arr>>>", allserviceArr);
    //             if (allserviceArr.length > 0) {
    //                 allserviceArr.map((data) => {
    //                     if (data.id === parseInt("45")) {
    //                         if (data.subItem.length > 0) {
    //                             data.subItem.map((aa) => {
    //                                 serArr.push({
    //                                     label: aa.subItemName,
    //                                     value: aa.id,
    //                                     subData: aa.subData
    //                                 })
    //                             })
    //                         }
    //                         serviceResData = serArr;
    //                     }
    //                 })
    //             }
    //             this.setState({
    //                 serviceArrData: serviceResData,
    //             });

    //             return serviceResData;
    //         }
    //     });
    // }


    onPrimaryLanguageChange = (data) => {
        this.setState({
            primaryLanguageData: data,
        });
    };


    onPrimaryLanguageSkillChange = (option) => {
        this.setState({
            primaryLanguageSkillData: option,
        });
    };

    PrimaryLanguageRatingChanged = (newRating) => {
        this.setState({
            primaryLanguageRating: newRating,
        });
    };

    onSelectYes = (e) => {
        this.setState({
            isSelected: true,
        });
    };

    onSelectNo = (e) => {
        this.setState({
            isSelected: false,
        });
    };

    onOtherLanguageChange = (option) => {
        let arr = [];
        option.map((data) => {
            arr.push({
                id: data.value,
                name: data.label,
                skill: [],
                rating: "",
            });
        });
        this.setState({
            otherLanguageData: option,
            otherLanguageSet: arr,
        });
    };

    onOtherLanguageSkillChange = (option, pos) => {
        let arr = this.state.otherLanguageSet;
        arr[pos].skill = option;
        this.setState({
            otherLanguageSet: arr,
        });
    };

    otherLanguageRatingChange = (newRating, pos) => {
        let arr = this.state.otherLanguageSet;
        arr[pos].rating = newRating;
        this.setState({
            otherLanguageSet: arr,
        });
    };

    // ..................multiselect dropdown for sevices offered........................
    onServiceSelect = (value) => {

        let arr = [];
        this.state.serviceArrData.map((data) => {
            if (data.subData) {
                value.map((aa) => {
                    if (data.value === aa.value) {
                        // consoleLog("Push Data::", data);
                        let subDataArr = [];

                        data.subData.map((ss) => {
                            subDataArr.push({
                                id: ss.id,
                                name: ss.name,
                                isChecked: false
                            })
                        });
                        arr.push({
                            label: data.label,
                            value: data.value,
                            subData: subDataArr
                        })
                        // arr.push(data)
                    }
                })
                // consoleLog("Main Service Arr : :", arr)
                this.setState({
                    serviceId: arr
                })
            } else {
                this.setState({
                    serviceId: value
                })
            }
        });
    };

    subTypeChange = (e, parentId, subItemName, name) => {
        // consoleLog("Event Value::", e.target.value)
        // consoleLog("service ID ::", this.state.serviceId);
        // consoleLog("selectedSubData :: ", this.state.selectedSubData);
        // console.log(parentId, subItemName, name);


        let arr = this.state.serviceId;

        arr.map((data) => {
            if (data.value == parentId) {
                if (data.subData !== undefined) {
                    data.subData.map((item) => {
                        if (e.target.value == item.id) {
                            if (e.target.checked) {
                                item.isChecked = true;
                            } else {
                                item.isChecked = false;
                            }
                        }
                    })
                }
            }
        });

        this.setState({
            serviceId: arr
        })
        // let arr = this.state.subType;
        // let brr = this.state.selectedSubData;
        // let crr = [];

        // if (e.target.checked) {

        //   if (brr.length > 0) {
        //     let countFlag = 0;
        //     for (let i = 0; i < brr.length; i++) {
        //       if (brr[i].id == id) {
        //         countFlag = 1;
        //         if (brr[i].subData !== undefined) {
        //           brr[i].subData.push({
        //             id: e.target.value,
        //             name: name
        //           })
        //         } else {
        //           brr[i]["subData"] = [];
        //           brr[i].subData.push({
        //             id: e.target.value,
        //             name: name
        //           })
        //         }
        //       }
        //     }
        //     if (countFlag === 0) {
        //       brr.push({
        //         id: id,
        //         subItemName: subItemName,
        //         subData: [{
        //           id: e.target.value,
        //           name: name
        //         }]
        //       })
        //     }
        //   } else {
        //     brr.push({
        //       id: id,
        //       subItemName: subItemName,
        //       subData: [{
        //         id: e.target.value,
        //         name: name,
        //         isChecked: true
        //       }]
        //     })

        //   }
        //   this.setState({
        //     selectedSubData: brr,
        //     isChecked: !this.state.isChecked,
        //   })
        // } else {
        //   for (let i = 0; i < brr.length; i++) {
        //     if (brr[i].id == id) {
        //       let temp = {
        //         id: id,
        //         subItemName: subItemName,
        //         subData: []
        //       };
        //       for (let j = 0; j < brr[i].subData.length; i++) {
        //         if (brr[i].subData[j].id == e.target.value) {

        //         } else {
        //           temp.subData = brr[i].subData
        //         }
        //       }
        //       crr.push(temp);
        //     } else {
        //       crr.push(brr[i])
        //     }
        //   }
        //   this.setState({
        //     selectedSubData: crr,
        //     isChecked: !this.state.isChecked,
        //   })

        // }


        // if (e.target.checked) {
        //   arr.push(e.target.value);
        //   this.state.serviceId.map((data) => {
        //     if (data.subData && data.subData.length > 0) {
        //       data.subData.map((sub) => {

        //       })
        //     }
        //   })
        // } else {
        //   if (arr.length > 0) {
        //     arr.map((data, i) => {
        //       if (data === e.target.value) {
        //         arr.splice(i, 1);
        //         crr.splice(i, 1);
        //       }
        //     });
        //   }
        // }

        // this.setState({
        //   subType: arr,
        //   isChecked: !this.state.isChecked,
        //   selectedSubData: crr
        // });
    };





    sourceLanguageChange = (value, i) => {
        let arr = this.state.translatorLanguageSet;
        arr[i].source = value.value;
        this.setState({
            translatorLanguageSet: arr
        })
    }

    targetLanguageChange = (value, i) => {
        let arr = this.state.translatorLanguageSet;
        arr[i].target = value.value;
        this.setState({
            translatorLanguageSet: arr
        })
    }

    translatorLanguageskillChange = (value, i) => {
        let arr = this.state.translatorLanguageSet;
        arr[i].skill = value;
        this.setState({
            translatorLanguageSet: arr
        })
    }

    translatorLanguageRatingChange = (value, i) => {
        let arr = this.state.translatorLanguageSet;
        arr[i].rating = value;
        this.setState({
            translatorLanguageSet: arr
        })
    }

    addLanguagePair = () => {
        let arr = this.state.translatorLanguageSet;
        arr.push({
            id: "",
            name: "",
            source: "",
            selectedTranslationSourceLanguage: {},
            target: "",
            selectedTranslationTargetLanguage: {},
            skill: [],
            rating: ""
        });
        this.setState({
            translatorLanguageSet: arr
        })
    }



    // ..................multiselect dropdown for Translation sevices offered........................
    onServiceSelectTranslation = (value) => {
        this.setState({
            selectedTranslationServices: value
        })
    };

    getTrainingServices = async () => {
        let data = {};
        let trainingArr = [];
        let allModes = [];
        let res = await ApiCall("getLookUpData", data);
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            let payload = Decoder.decode(res.data.payload);
            let lookUpData = payload.data.lookupdata;
            // consoleLog("Lookup data res>>>>", lookUpData);
            allModes = lookUpData.COURSE_FORMAT_TYPE;


            let trainingServices = lookUpData.TRAINING_CATEGORY_TYPE;

            for (let i = 0; i < trainingServices.length; i++) {
                trainingArr.push({
                    label: trainingServices[i].name,
                    value: trainingServices[i].id,
                });
            }

            this.setState({
                allTrainingMode: allModes,
                restrainingServicesArr: trainingArr,
            });
        }
    };

    onTrainerNotesChange = (e) => {
        this.setState({
            trainerNotes: e.target.value,
        });
    };

    onSelectOnline = (e) => {
        this.setState({
            trainingMode: e.target.value,
        });
    };

    onSelectOnsite = (e) => {
        this.setState({
            trainingMode: e.target.value,
        });
    };

    onTraningServiceChange = (option) => {
        this.setState({
            trainingServiceData: option,
        });
    };




    onServiceInfoUpdate = async () => {
        let errorCount = 0;
        let mainServiceArr = [],
            mainLanguageArr = [];

        if (errorCount === 0) {
            let objData = {
                role: this.state.role,
                primaryLanguage: this.state.primaryLanguageData.value,
                primaryLanguageSkill: this.state.primaryLanguageSkillData,
                primaryLanguageRating: this.state.primaryLanguageRating,
                oherLanguageSet: this.state.otherLanguageSet,
                services: this.state.serviceId,
                subtypecheck: this.state.subType,
                translatorLanguageSet: this.state.translatorLanguageSet
            };

            // console.log("Service Info submit data>>>", objData);

            var lang = [];
            var langobj = {
                "languageId": objData.primaryLanguage,
                "targetLanguageId": objData.primaryLanguage,
                "isPrimary": "1",
                "canSpeak": "0",
                "canRead": "0",
                "canWrite": "0",
                "ratings": objData.primaryLanguageRating
            };
            for (let i = 0; i < objData.primaryLanguageSkill.length; i++) {
                if (objData.primaryLanguageSkill[i].label == "Read") {
                    langobj.canRead = "1";
                } else if (objData.primaryLanguageSkill[i].label == "Write") {
                    langobj.canWrite = "1";
                } else if (objData.primaryLanguageSkill[i].label == "Speak") {
                    langobj.canSpeak = "1";
                }
            }
            lang.push(langobj);
            if (objData.oherLanguageSet != undefined) {
                for (let j = 0; j < objData.oherLanguageSet.length; j++) {
                    var langInfo = objData.oherLanguageSet[j];
                    var langobj = {
                        "languageId": langInfo.id,
                        "targetLanguageId": langInfo.id,
                        "isPrimary": "0",
                        "canSpeak": "0",
                        "canRead": "0",
                        "canWrite": "0",
                        "ratings": langInfo.rating
                    };
                    for (let i = 0; i < langInfo.skill.length; i++) {
                        if (langInfo.skill[i].label == "Read") {
                            langobj.canRead = "1";
                        } else if (langInfo.skill[i].label == "Write") {
                            langobj.canWrite = "1";
                        } else if (langInfo.skill[i].label == "Speak") {
                            langobj.canSpeak = "1";
                        }
                    }
                    lang.push(langobj);
                }
            }

            // console.log("Service Info submit data Array>>>", lang);
            let brr = [];
            // consoleLog("this.state.serviceID:", this.state.serviceId);
            this.state.serviceId.map((data) => {
                let aa = [];
                if (data.subData !== undefined) {
                    data.subData.map((sub) => {
                        if (sub.isChecked) {
                            aa.push({
                                id: sub.id,
                                name: sub.name
                            })
                        }
                    })
                }
                brr.push({
                    id: data.value,
                    subItemName: data.label,
                    subData: aa
                })
            })

            // let finalData = {
            //     vendorid: this.state.showId,
            //     serviceId: this.state.role,
            //     languages: lang,
            //     service: {
            //         id: "45",
            //         name: "Interpretation",
            //         subItem: brr
            //     }
            // }

            // =====================================

            if (lang.length > 0) {
                mainLanguageArr.push({
                    serviceId: "45",
                    info: lang
                })
            }

            // =========================================

            let transService = [];
            this.state.selectedTranslationServices.map((tr) => {
                transService.push({
                    id: tr.value,
                    subItemName: tr.label
                })
            })


            var langTrans = [];

            this.state.translatorLanguageSet.map((tr, t) => {
                langTrans.push({
                    "languageId": tr.source,
                    "targetLanguageId": tr.target,
                    "isPrimary": "1",
                    "canSpeak": "0",
                    "canRead": "0",
                    "canWrite": "0",
                    "ratings": tr.rating
                })
                for (let i = 0; i < tr.skill.length; i++) {
                    if (tr.skill[i].label == "Read") {
                        langTrans[t].canRead = "1";
                    } else if (tr.skill[i].label == "Write") {
                        langTrans[t].canWrite = "1";
                    } else if (tr.skill[i].label == "Speak") {
                        langTrans[t].canSpeak = "1";
                    }
                }
            });

            // ===========================================
            // Translation Language
            if (langTrans.length > 0) {
                mainLanguageArr.push({
                    serviceId: "46",
                    info: langTrans
                })
            }

            // let finalData = {
            //     vendorid: this.state.showId,
            //     serviceId: "46",
            //     languages: langTrans,
            //     service: {
            //         id: "46",
            //         name: "Translation",
            //         subItem: transService
            //     }
            // }

            // ============================================
            // Training Service.................
            let trainingService = [],
                trainigMode = [];
            if (this.state.trainingServiceData.length > 0) {
                this.state.trainingServiceData.map((tr) => {
                    trainingService.push({
                        id: tr.value,
                        subItemName: tr.label
                    })
                })
            }
            // training Mode...................
            this.state.allTrainingMode.map((tm) => {
                if (this.state.trainingMode == tm.id) {
                    trainigMode.push(tm)
                }
            })

            // let finalData = {
            //     vendorid: this.state.showId,
            //     serviceId: "47",
            //     languages: [],
            //     service: {
            //         id: "47",
            //         name: "Training",
            //         subItem: trainingService,
            //         mode: trainigMode
            //     }
            // }



            // ===========================================

            if (brr.length > 0) {
                mainServiceArr.push({
                    serviceid: "45",
                    details: {
                        id: "45",
                        name: "Interpretation",
                        subItem: brr
                    }
                })
            }

            if (transService.length > 0) {
                mainServiceArr.push({
                    serviceid: "46",
                    details: {
                        id: "46",
                        name: "Translation",
                        subItem: transService
                    }
                })
            }

            if (trainingService.length > 0) {
                mainServiceArr.push({
                    serviceid: "47",
                    details: {
                        id: "47",
                        name: "Training",
                        subItem: trainingService,
                        mode: trainigMode
                    }
                })
            }



            // let newReqObj = {
            //     vendorId: this.state.showId,
            //     interpretationService: {
            //         serviceId: "45",
            //         languages: lang,
            //         service: {
            //             id: "45",
            //             name: "Interpretation",
            //             subItem: brr
            //         }
            //     },
            //     translationService: {
            //         serviceId: "46",
            //         languages: langTrans,
            //         service: this.state.selectedTranslationServices
            //     },
            //     trainingService: {
            //         serviceId: "47",
            //         trainingMode: this.state.trainingMode,
            //         trainingNotes: this.state.trainerNotes,
            //         service: this.state.trainingServiceData
            //     }
            // }

            let newReqObj = {
                vendorId: this.props.vendorId,
                service: mainServiceArr,
                languages: mainLanguageArr
            }

            // console.log("Service Info submit data Array>>>", newReqObj);


            let modifyReq = await ApiCall("addVendorServiceNLanguage", newReqObj);
            if (
                modifyReq.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                modifyReq.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
            ) {
                toast.success("Service updated successfully");
            }


        }
    };

    render() {
        return (
            <React.Fragment>
                <ToastContainer hideProgressBar theme="colored" />
                <div className="my-form-bx">
                    <h4 className="h4_heading">Interpreatation</h4>
                    {/* <div className="row">
                        <div className="col-md-6">
                            <div className="form_rbx">
                                {" "}
                                <span className="">Role(s) *</span>
                                <div
                                    class="dropdwn"
                                    style={{ width: "60%", cursor: "pointer" }}
                                >
                                    <Select
                                        styles={customStyles}
                                        name="Select"
                                        options={this.state.roleArr}
                                        components={{
                                            DropdownIndicator,
                                            IndicatorSeparator: () => null,
                                        }}
                                        value={this.state.roleData}
                                        placeholder="Select"
                                        onChange={(value) => {
                                            this.onRoleChange(value);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {/* ......................................... */}
                    {/* {this.state.role === "45"
                        ?  */}
                    <React.Fragment>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form_rbx">
                                    {" "}
                                    <span className="">
                                        Primary (Native/Source) Language *
                                    </span>
                                    <SelectBox
                                        optionData={this.state.languageArr}
                                        value={this.state.primaryLanguageData}
                                        placeholder="Select"
                                        onSelectChange={(value) => {
                                            this.onPrimaryLanguageChange(value);
                                        }}
                                    />

                                    {/* <Select
                                                styles={customStyles}
                                                name="Select"
                                                options={this.state.languageArr}
                                                components={{
                                                    DropdownIndicator,
                                                    IndicatorSeparator: () => null,
                                                }}
                                                value={this.state.primaryLanguageData}
                                                placeholder="Select"
                                                onChange={(value) => {
                                                    this.onPrimaryLanguageChange(value);
                                                }}
                                            /> */}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form_rbx">
                                    {" "}
                                    <span className="">
                                        Primary Language Proficiency Skills *
                                    </span>
                                    <div className="dropdwn">
                                        <MultiSelectBox
                                            optionData={this.state.primaryLanguageSkillArr}
                                            value={this.state.primaryLanguageSkillData}
                                            placeholder="Select"
                                            onSelectChange={(value) => {
                                                this.onPrimaryLanguageSkillChange(value);
                                            }}
                                        />
                                        {/* <Select
                                                    styles={customStyles}
                                                    name="select"
                                                    placeholder="Select"
                                                    components={{
                                                        DropdownIndicator,
                                                        IndicatorSeparator: () => null,
                                                    }}
                                                    value={this.state.primaryLanguageSkillData}
                                                    options={this.state.primaryLanguageSkillArr}
                                                    onChange={this.onPrimaryLanguageSkillChange}
                                                    isMulti
                                                /> */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form_rbx">
                                    {" "}
                                    <span className="">
                                        Primary Language Fluency Ratings *
                                    </span>
                                    <div className="rate">
                                        <ReactStars
                                            count={5}
                                            value={this.state.primaryLanguageRating}
                                            onChange={this.PrimaryLanguageRatingChanged}
                                            size={30}
                                            color2="#009fe0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form_rbx">
                                    {" "}
                                    <span className="">
                                        Proficient Other Languages? *
                                    </span>
                                    <div className="check-field">
                                        <label className="checkbox_btn">
                                            <input
                                                type="radio"
                                                name="radio"
                                                id="otherLan_yes"
                                                // defaultChecked={this.state.isSelected}
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
                                                id="otherLan_no"
                                                // defaultChecked={this.state.isSelected}
                                                onClick={(e) => this.onSelectNo(e)}
                                            />
                                            <span className="checkmark3"></span> No
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.state.isSelected ? (
                            <React.Fragment>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form_rbx">
                                            {" "}
                                            <span className="">Other language[s]</span>
                                            <div
                                                className="dropdwn"
                                                style={{
                                                    width: "93%",
                                                    cursor: "pointer",
                                                }}
                                            >

                                                <MultiSelectBox
                                                    optionData={this.state.languageArr}
                                                    value={this.state.otherLanguageData}
                                                    placeholder="Select"
                                                    onSelectChange={(value) => {
                                                        this.onOtherLanguageChange(value);
                                                    }}
                                                />
                                                {/* <Select
                                                            styles={customStyles}
                                                            name="select"
                                                            placeholder="Select"
                                                            components={{
                                                                DropdownIndicator,
                                                                IndicatorSeparator: () => null,
                                                            }}
                                                            value={this.state.otherLanguageData}
                                                            options={this.state.languageArr}
                                                            onChange={this.onOtherLanguageChange}
                                                            isMulti
                                                        /> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                    </div>
                                    <div className="col-md-4">
                                    </div>
                                </div>
                                {this.state.otherLanguageSet.length > 0 ? (
                                    this.state.otherLanguageSet.map((oth, l) => (
                                        <React.Fragment key={l}>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form_rbx">
                                                        {" "}
                                                        <span className="">
                                                            Other language{" "}*
                                                        </span>
                                                        <div>{oth.name}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form_rbx">
                                                        {" "}
                                                        <span className="">
                                                            Other Language Proficiency Skills *
                                                        </span>

                                                        <MultiSelectBox
                                                            optionData={this.state.primaryLanguageSkillArr}
                                                            value={oth.skill}
                                                            placeholder="Select"
                                                            onSelectChange={(value) => {
                                                                this.onOtherLanguageSkillChange(value, l);
                                                            }}
                                                        />
                                                        {/* <div className="dropdwn">
                                                                    <Select
                                                                        styles={customStyles}
                                                                        name="select"
                                                                        placeholder="Select"
                                                                        components={{
                                                                            DropdownIndicator,
                                                                            IndicatorSeparator: () => null,
                                                                        }}
                                                                        value={oth.skill}
                                                                        options={
                                                                            this.state
                                                                                .primaryLanguageSkillArr
                                                                        }
                                                                        onChange={(value) => {
                                                                            this.onOtherLanguageSkillChange(
                                                                                value,
                                                                                l
                                                                            );
                                                                        }}
                                                                        isMulti
                                                                    />
                                                                </div> */}
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form_rbx">
                                                        {" "}
                                                        <span className="">
                                                            Other Language Fluency Ratings *
                                                        </span>
                                                        <div className="rate">
                                                            <ReactStars
                                                                count={5}
                                                                onChange={(value) => {
                                                                    this.otherLanguageRatingChange(value, l);
                                                                }}
                                                                size={30}
                                                                // color="#fff"
                                                                color2="#009fe0"
                                                                value={oth.rating}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <React.Fragment></React.Fragment>
                                )}
                            </React.Fragment>
                        ) : (
                            <React.Fragment></React.Fragment>
                        )}

                        <div className="row">
                            <div className="col-md-8">
                                <div className="form_rbx">
                                    {" "}
                                    <span className="">Service Offered *</span>
                                    <div className="dropdwn">
                                        <MultiSelectBox
                                            optionData={this.state.serviceArrData}
                                            value={this.state.serviceId}
                                            placeholder="Select"
                                            onSelectChange={(value) => this.onServiceSelect(value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            {this.state.role === "45" ?
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        <div
                                            class="multiple-option-check"
                                            style={{
                                                paddingLeft: "60px",
                                                paddingTop: "30px",
                                            }}
                                        >
                                            {this.state.serviceId.map((item, key) => (
                                                <React.Fragment key={key}>
                                                    <div class="check-field">
                                                        {item.label}
                                                    </div>
                                                    {item.subData.map((item1, key1) => (
                                                        <div class="check-field">
                                                            <label class="checkbox_btn">
                                                                <input
                                                                    type="checkbox"
                                                                    name={key1}
                                                                    checked={item1.isChecked}
                                                                    value={item1.id}
                                                                    onChange={(e) => this.subTypeChange(e, item.value, item.label, item1.name)}
                                                                />
                                                                <span class="checkmark3"></span>{" "}
                                                                {item1.name}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                        {/* ....................................... */}
                                    </div>
                                </div> :
                                <React.Fragment></React.Fragment>}
                        </div>
                    </React.Fragment>
                    {/* : 
                            <React.Fragment></React.Fragment>
                        } */}

                    {/* {this.state.role === "46" ? */}
                    <React.Fragment>
                        <h4 className="h4_heading">Translation</h4>
                        {this.state.translatorLanguageSet.length > 0 ?
                            this.state.translatorLanguageSet.map((data, i) =>
                                <div className="row" key={i}>
                                    <div className="col-md-3">
                                        <div className="form_rbx">
                                            <span>
                                                Source Language *
                                            </span>
                                            {/* <Select
                                                    styles={customStyles}
                                                    name="Source_language"
                                                    options={this.state.languageArr}
                                                    value={data.selectedTranslationSourceLanguage}
                                                    components={{
                                                        DropdownIndicator,
                                                        IndicatorSeparator: () => null,
                                                    }}
                                                    placeholder="Select"
                                                    onChange={(value) => { this.sourceLanguageChange(value, i) }}
                                                /> */}
                                            <SelectBox
                                                optionData={this.state.languageArr}
                                                value={data.selectedTranslationSourceLanguage}
                                                placeholder="Select"
                                                onSelectChange={(value) => { this.sourceLanguageChange(value, i) }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form_rbx">
                                            <span>
                                                Target Language *
                                            </span>
                                            <SelectBox
                                                optionData={this.state.languageArr}
                                                value={data.selectedTranslationTargetLanguage}
                                                placeholder="Select"
                                                onSelectChange={(value) => { this.targetLanguageChange(value, i) }}
                                            />
                                            {/* <Select
                                                    styles={customStyles}
                                                    name="target_language"
                                                    options={this.state.languageArr}
                                                    value={data.selectedTranslationTargetLanguage}
                                                    components={{
                                                        DropdownIndicator,
                                                        IndicatorSeparator: () => null,
                                                    }}
                                                    placeholder="Select"
                                                    onChange={(value) => { this.targetLanguageChange(value, i) }}
                                                /> */}
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form_rbx">
                                            {" "}
                                            <span className="">
                                                Proficiency Skills *
                                            </span>
                                            <div className="dropdwn">
                                                {/* <Select
                                                        styles={customStyles}
                                                        name="select"
                                                        placeholder="Select"
                                                        components={{
                                                            DropdownIndicator,
                                                            IndicatorSeparator: () => null,
                                                        }}
                                                        value={data.skill}
                                                        options={this.state.primaryLanguageSkillArr}
                                                        onChange={(value) => { this.translatorLanguageskillChange(value, i) }}
                                                        isMulti
                                                    /> */}
                                                <MultiSelectBox
                                                    optionData={this.state.primaryLanguageSkillArr}
                                                    value={data.skill}
                                                    placeholder="Select"
                                                    onSelectChange={(value) => { this.translatorLanguageskillChange(value, i) }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form_rbx">
                                            {" "}
                                            <span className="">
                                                Ratings *
                                            </span>
                                            <div className="rate">
                                                <ReactStars
                                                    count={5}
                                                    onChange={(value) => { this.translatorLanguageRatingChange(value, i) }}
                                                    size={25}
                                                    value={data.rating}
                                                    color2="#009fe0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>) : <React.Fragment></React.Fragment>}

                        <div className="row" style={{ paddingBottom: "3%" }}>
                            <div className="md-btn">
                                <a onClick={() => { this.addLanguagePair() }} className="approved" style={{ textDecoration: "none", color: "#fff" }}>ADD</a>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-8">
                                <div className="form_rbx">
                                    {" "}
                                    <span className="">Service Offered *</span>
                                    <div className="dropdwn">
                                        <MultiSelectBox
                                            optionData={this.state.translationServiceArr}
                                            value={this.state.selectedTranslationServices}
                                            placeholder="Select"
                                            onSelectChange={(value) => this.onServiceSelectTranslation(value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                    {/* : <React.Fragment></React.Fragment>
                    } */}

                    {/* {this.state.role === "47" ? ( */}
                    <div>
                        <h4 className="h4_heading">Training</h4>
                        <div className="row">
                            <div className="col-md-8">
                                <div className="form_rbx">
                                    {" "}
                                    <span className="">Service(s) Offered *</span>
                                    <span className="training-title">Training</span>
                                    <div className="dropdwn">
                                        <MultiSelectBox
                                            optionData={this.state.restrainingServicesArr}
                                            value={this.state.trainingServiceData}
                                            onSelectChange={(value) => this.onTraningServiceChange(value)}
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form_rbx">
                                    <span className="">Training Mode *</span>
                                    {this.state.allTrainingMode.map((md) =>
                                        md.id === 30 ?
                                            <div className="check-field">
                                                <label className="checkbox_btn">
                                                    <input
                                                        type="radio"
                                                        name="radio"
                                                        value="30"
                                                        checked={this.state.trainingMode === "30" ? true : false}
                                                        onClick={(e) => this.onSelectOnline(e)}
                                                    />
                                                    <span className="checkmark3"></span> Online
                                                </label>
                                            </div> :
                                            <div className="check-field">
                                                <label className="checkbox_btn">
                                                    <input
                                                        type="radio"
                                                        name="radio"
                                                        value="31"
                                                        checked={this.state.trainingMode === "31" ? true : false}
                                                        onClick={(e) => this.onSelectOnsite(e)}
                                                    />
                                                    <span className="checkmark3"></span> Onsite
                                                </label>
                                            </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* <div className="row">
                            <div className="col-md-8">
                                <div className="form_rbx">
                                    {" "}
                                    <span className="">Notes *</span>
                                    <textarea
                                        placeholder=""
                                        className="in-textarea min"
                                        value={this.state.trainerNotes}
                                        onChange={this.onTrainerNotesChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    {/* // ) : (
                    //     <React.Fragment></React.Fragment>
                    // )} */}

                    <div className="row">
                        <div className="col-md-12 text-center">
                            <button
                                type="submit"
                                className="delete_button"
                                onClick={() => this.onCancel()}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="sv_btn"
                                onClick={() => this.onServiceInfoUpdate()}
                            >
                                Update
                            </button>
                        </div>
                    </div>

                    {/* .............................3........................... */}

                    {/* .................................................................. */}
                </div>

            </React.Fragment>
        )
    }
}