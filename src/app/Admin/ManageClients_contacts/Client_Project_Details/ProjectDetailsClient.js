import { Menu, MenuItem } from "@mui/material";
import React, { Component } from "react";
import { AlertMessage, ImageName } from "../../../../enums";
import { Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { ApiCall, ApiCallClient } from "../../../../services/middleware";
import { PaginationDropdown, SelectBox } from "../../SharedComponents/inputText";
import Select, { components } from "react-select";
import $ from "jquery";
// import "./viewAllJobs.css";
import {
    consoleLog,
    SetDateFormat,
    SetTimeFormat,
} from "../../../../services/common-function";
import { toast, ToastContainer } from "react-toastify";
import ReactLoader from "../../../Loader";
import { inputEmptyValidate } from "../../../../validators";
import ViewCalender from "../../../ReactBigCalender/ViewCalender";
import { Link } from "react-router-dom";

const customStyles = {
    control: (styles) => ({
        ...styles,
        backgroundColor: "white",
        boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
        borderRadius: "6px",
        height: 50,
        minHeight: 50,
        textAlign: "center",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = "yellow";
        return {
            ...styles,
            color: isFocused ? "grey" : "white",
            color: "#000",
            cursor: isDisabled ? "not-allowed" : "default",
        };
    },
};
const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <img
                src={ImageName.IMAGE_NAME.DOWN_ARROW_BLUE}
                style={{ width: "17px" }}
            />
        </components.DropdownIndicator>
    );
};

const cancelationArr = [
    {
        label: "Last minute reschedule ",
        value: "1",
    },
    {
        label: "Duplicate/Error ",
        value: "2",
    },
    {
        label: "Consumer No Show",
        value: "3",
    },
    {
        label: "Interpreter No Show",
        value: "4",
    },
    {
        label: "Other Service being utilized",
        value: "5",
    },
    {
        label: "Other ",
        value: "6",
    },
];

const reqData = {
    limit: "",
    offset: "",
    status: "",
    serviceType: "",
    orderby: "",
    direc: "",
    searchFrom: "",
    searchTo: "",
    rfqId: "",
    clientid:""
};

export default class ProjectDetailsClient extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoad: true,
            isTranslation: true,
            isTraining: false,
            current_page: 1,
            total_page: 10,
            limit: 20,
            offset:0,
            current_page_training: 1,
            total_page_training: 10,
            limit_training: 20,
            offset_training:0,
            anchorEl: null, //menu button
            anchorEl1: null,
            cancellationData: {},
            rescheduledCheck: null,
            isSelected: null,
            clientArr: [],
            clientData: {},
            appointmentTypeArr: [],
            appointmentTypeData: {},
            targetLangData: {},
            sourceLangData: {},
            languageArr: [],
            statusArr: [],
            statusData: {},
            leiArr: [],
            leiData: {},
            industryArr: [],
            industryData: {},
            otherReason: "",
            formDate: "",
            toDate: "",
            listData: [],
            traininglistData:[],
            historyList: [],
            selectedDisplayData: {
                label: "20",
                value: "20"
            },
            selectedDisplayData_Training:{
                label:"20",
                value:"20"
            },
            isCalender: false,
            calenderData: [],
            userId:""
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.load();
        var classInstance = this;

        // When the user clicks anywhere outside of the modal, close it

        var modal = document.getElementById("decline-model");
        var filterModal = document.getElementById("filter-model");
        window.onclick = function (event) {
            if (event.target == modal || event.target == filterModal) {
                classInstance.closeModal();
            }
        };

        window.$(".verificaiton-doc-tab ul li").on("click", function () {
            $(".verificaiton-doc-tab ul li").removeClass("active");
            $(this).addClass("active");
            $("div").removeClass("activeLnk");
            $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
          });
    }

    load = async () => {
        let languageArrData = [],
            languageObjData = {},
            languageResArrData = [],
            industryDataArr = [],
            industryArr = [],
            leiDataArr = [],
            leiArr = [],
            statusDataArr = [];

        // ....................For List Data..........................................
        let mainData = this.props.location,
        preData = mainData.state;

        if(preData){
            let fetchData = {
                limit: JSON.stringify(this.state.limit),
                offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
                clientid:preData.userId,
                serviceType: "46"
            };
            this.setState({
                userId:preData.userId
            })

            let returnData = Object.assign(reqData, fetchData);
            this.listApi(returnData);

            let fetchDataTraining = {
                limit: JSON.stringify(this.state.limit_training),
                offset: JSON.stringify((this.state.current_page_training - 1) * this.state.limit_training),
                clientid:preData.userId,
                serviceType: "47"
            };
            let returnDataTraining = Object.assign(reqData, fetchDataTraining);
            this.listApi_training(returnDataTraining);
        }

       

        //For language dropdown in filter
        let languageResData = await ApiCall("getlanguagelist");
        let languagePayload = Decoder.decode(languageResData.data.payload);
        languageResArrData = languagePayload.data.languagelist;
        for (let n = 0; n < languageResArrData.length; n++) {
            languageArrData.push({
                label: languageResArrData[n].language,
                value: languageResArrData[n].id,
            });
            if (languageResArrData[n].language === "English") {
                languageObjData = {
                    label: languageResArrData[n].language,
                    value: languageResArrData[n].id,
                };
            }
        }

        let lookupres = await ApiCall("getLookUpData");
        if (
            lookupres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            lookupres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            let payload = await Decoder.decode(lookupres.data.payload);
            // console.log("payload::::::::::", payload);

            industryDataArr = payload.data.lookupdata.INDUSTRY_TYPE;

            for (let j = 0; j < industryDataArr.length; j++) {
                industryArr.push({
                    label: industryDataArr[j].name,
                    value: industryDataArr[j].id,
                });
            }
        }

        let leiRes = await ApiCall("getAllLeiList");
        if (
            leiRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            leiRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            let payload = await Decoder.decode(leiRes.data.payload);

            leiDataArr = payload.data.leiList;
            for (let k = 0; k < leiDataArr.length; k++) {
                leiArr.push({
                    label: leiDataArr[k].name,
                    value: leiDataArr[k].userId,
                });
            }
        }

        let statusRes = await ApiCall("getInterpretionJobStatuslist");
        if (
            statusRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            statusRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            let payload = await Decoder.decode(statusRes.data.payload);
            // console.log("status::::::::::", payload);
            statusDataArr = payload.data.statusList;
            for (let k = 0; k < statusDataArr.length; k++) {
                // console.log(">>>><<<", statusDataArr[k]);
                // statusArr.push({
                //   label: statusDataArr[k],

                // });
            }
        }
        // ............................................................
        let clientDataArr = [];

        let clientinfoRes = await ApiCall("getallclinetinfo");
        if (
            clientinfoRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            clientinfoRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            let clientPayload = await Decoder.decode(clientinfoRes.data.payload);
            let clientResData = clientPayload.data.clientlist;
            // console.log("payload::::::::::", clientResData);
            for (let i = 0; i < clientResData.length; i++) {
                clientDataArr.push({
                    label: clientResData[i].clientName,
                    value: clientResData[i].clientid,
                });
            }
        }

        this.setState({
            clientArr: clientDataArr,
            sourceLangData: languageObjData,
            targetLangData: languageObjData,
            languageArr: languageArrData,
            industryArr: industryArr,
            leiArr: leiArr,
            isLoad: false,
        });
    };

    //...........For translation Project Listing...............
    listApi = async (data) => {
        const res = await ApiCallClient("getAllProjectsByClient", data);
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            const decodeData = Decoder.decode(res.data.payload);
            let arr = [];
            if (decodeData.data.projectList.length > 0) {
                decodeData.data.projectList.map((item) => {
                    if (item.serviceTypeId === 46) {
                        arr.push(item)
                    }
                })
            }
            let totalPage = Math.ceil(
                decodeData.data.projectCount / this.state.limit
            );
            consoleLog("____trans",arr)
            this.setState({
                listData: arr,
                total_page: totalPage,
            });
        }

       
       
    };
     // ..............for training listing...............

     listApi_training = async (data) => {
        const res = await ApiCallClient("getAllProjectsByClient", data);
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            const decodeData = Decoder.decode(res.data.payload);
            let arr = [];
            if (decodeData.data.projectList.length > 0) {
                decodeData.data.projectList.map((item) => {
                    if (item.serviceTypeId === 47) {
                        arr.push(item)
                    }
                })
            }
            let totalPage = Math.ceil(
                decodeData.data.projectCount / this.state.limit
            );
            consoleLog("____trainin",arr)
            this.setState({
                traininglistData: arr,
                total_page: totalPage,
            });
        }

       
       
    };


    // .............filter modal function...................

    onClientChamge = (data) => {
        // console.log("client:::", data.value);
        let fetchData = {
            clientId: data.value,
        };
        let returnData = Object.assign(reqData, fetchData);
        this.listApi(returnData);

        this.setState({
            clientData: data,
        });
    };
    onOtherReasonChange = (e) => {
        this.setState({
            otherReason: e.target.value,
        });
    };
    //........Page show Limit.........

    onChangeLimit = (dat) => {
        this.setState({
            limit: parseInt(dat.value),
            selectedDisplayData: dat
        });

        let data = {
            limit: dat.value,
            offset: JSON.stringify(
                (this.state.current_page - 1) * parseInt(dat.value)
            ),
            status: "",
    serviceType: "46",
    orderby: "",
    direc: "",
    searchFrom: "",
    searchTo: "",
    rfqId: "",
    clientid:this.state.userId

        };

        this.listApi(data);
    };
    onChangeLimit_Training = (dat) => {
        this.setState({
            limit: parseInt(dat.value),
            selectedDisplayData_Training: dat
        });

        let data = {
            limit: dat.value,
            offset: JSON.stringify(
                (this.state.current_page_training - 1) * parseInt(dat.value)
            ),
            status: "",
    serviceType: "47",
    orderby: "",
    direc: "",
    searchFrom: "",
    searchTo: "",
    rfqId: "",
    clientid:this.state.userId

        };

        this.listApi(data);
    };
    onChangeStatus = (e) => {
        this.setState({
            limit: parseInt(e.target.value),
        });

        let data = {
            limit: e.target.value,
            offset: JSON.stringify(
                (this.state.current_page - 1) * parseInt(e.target.value)
            ),
        };

        this.listApi(data);
    };

    //........... Export File...............

    onExport = async () => {
        let data = {
            // name: this.state.uname,
            // email: this.state.emailId,
            // mobile: this.state.mobileNo,
            orderby: "",
            direc: "",
            searchto: "",
            searchfrom: "",
        };
        // let res = await ApiCall("exportadminstaff", data);
        // const decodeData = Decoder.decode(res.data.payload);
        // if (
        //   res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        //   res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        // ) {
        //   window.open(decodeData.data.fileUrl, "_blank");
        // }
    };

    openModal = () => {
        document.getElementById("backdrop").style.display = "block";
        document.getElementById("filter-model").style.display = "block";
        document.getElementById("filter-model").classList.add("show");
    };
    openHistoryModal = () => {
        document.getElementById("backdrop").style.display = "block";
        document.getElementById("history-model").style.display = "block";
        document.getElementById("history-model").classList.add("show");
    };
    openDeclineModal = () => {
        document.getElementById("backdrop").style.display = "block";
        document.getElementById("decline-model").style.display = "block";
        document.getElementById("decline-model").classList.add("show");
    };
    // openDeleteModal = () => {
    //   document.getElementById("backdrop").style.display = "block";
    //   document.getElementById("delete-model").style.display = "block";
    //   document.getElementById("delete-model").classList.add("show");
    // };

    closeModal = () => {
        document.getElementById("backdrop").style.display = "none";
        document.getElementById("filter-model").style.display = "none";
        document.getElementById("filter-model").classList.remove("show");
        document.getElementById("decline-model").style.display = "none";
        document.getElementById("decline-model").classList.remove("show");
        // document.getElementById("history-model").style.display = "none";
        // document.getElementById("history-model").classList.remove("show");
    };

    filterModal = () => {
        this.openModal();
        this.handleMenuClose();
    };
    declineModal = () => {
        // window.$("#decline-model").modal("show");
        this.openDeclineModal();
        this.handleMenuClose();
    };
    historyModal = () => {
        this.openHistoryModal();
        this.handleMenuClose();
    };
    declineClose = () => {
        this.setState({
            declineMessage: "",
        });
        this.closeModal();
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
    //................funct for menuBtn on click................
    menuBtnhandleClick = (index, event) => {
        this.setState({
            curIndex: index,
            anchorEl: event.currentTarget,
        });
    };
    menuBtnhandleClick_b = (index, event) => {
        this.setState({
            curIndex: index,
            anchorEl1: event.currentTarget,
        });
    };

    handleMenuClose = () => {
        this.setState({
            anchorEl: null,
            anchorEl1: null,
        });
    };

    // ............translation.pagination function..........

    clickChange = (e) => {
        this.setState({
            current_page: e.target.value,
        });
    };

    // This is goes to the previous page
    exLeft = () => {
        this.setState({
            current_page: 1,
        });
        let fetchData = {
            limit: JSON.stringify(this.state.limit),
            offset: "0",
            clientid:this.state.userId,
            serviceType: "46"
        };
        let returnData = Object.assign(reqData, fetchData);
        this.listApi(returnData);
    };

    // This is goes to the last page
    exRigth = () => {
        let totalPage = this.state.total_page;
        this.setState({
            current_page: totalPage,
        });
        let fetchData = {
            limit: JSON.stringify(this.state.limit),
            offset: JSON.stringify((totalPage - 1) * this.state.limit),
            clientid:this.state.userId,
            serviceType: "46"
        };
        let returnData = Object.assign(reqData, fetchData);
        this.listApi(returnData);
    };

    // This is goes to the first page
    prev = () => {
        let currentPage = this.state.current_page;
        if (currentPage > 1) {
            currentPage--;
            this.setState({
                current_page: currentPage,
            });
            let fetchData = {
                limit: JSON.stringify(this.state.limit),
                offset: JSON.stringify((currentPage - 1) * this.state.limit),
                clientid:this.state.userId,
                serviceType: "46"
            };
            let returnData = Object.assign(reqData, fetchData);
            this.listApi(returnData);
        }
    };

    // This is goes to the next page
    next = () => {
        let currentPage = this.state.current_page;
        let totalPage = this.state.total_page;
        if (currentPage < totalPage) {
            currentPage++;
            this.setState({
                current_page: currentPage,
            });
            
        }
        let fetchData = {
            limit: JSON.stringify(this.state.limit),
            offset: JSON.stringify((currentPage - 1) * this.state.limit),
            clientid:this.state.userId,
            serviceType: "46"
        };
        let returnData = Object.assign(reqData, fetchData);
        this.listApi(returnData);
    };

    onFilterApply = () => {
        // let fetchData = {
        //   limit: JSON.stringify(this.state.limit),
        //   offset: "0",
        //   searchto: this.state.toDate,
        //   searchfrom: this.state.formDate,
        //   status: "",
        //   clientId: "",
        //   serviceType: "",
        //   orderby: "",
        //   direc: "",
        //   rfqId: "",
        // };
        // let returnData = Object.assign(reqData, fetchData);
        // this.listApi(returnData);
        // let data = {
        //   limit: JSON.stringify(this.state.limit),
        //   offset: "0",
        //   name: this.state.name,
        //   email: this.state.email,
        //   phone: this.state.mobile,
        //   orderby: "",
        //   direc: "",
        //   searchto: this.state.toDate,
        //   searchfrom: this.state.formDate,
        //   type: this.state.type,
        //   status: this.state.status.toString(),
        // };

        // console.log("Filter data", data)
        this.closeModal();

        // this.listApi(data);

        // this.setState({
        //   formDate: "",
        //   toDate: "",
        // });
    };

    onResetFilter = () => {
        this.setState({
            formDate: "",
            toDate: "",
            selectedDisplayData: {
                label: "20",
                value: "20"
            },
            current_page: 1
        });
        this.load();
    };

    // ............translation.pagination function..........

    clickChange_Training = (e) => {
        this.setState({
            current_page_training: e.target.value,
        });
    };

    // This is goes to the previous page
    exLeft_Training = () => {
        this.setState({
            current_page_training: 1,
        });
        let fetchData = {
            limit: JSON.stringify(this.state.limit_training),
            offset: "0",
            clientid:this.state.userId,
            serviceType: "47"
        };
        let returnData = Object.assign(reqData, fetchData);
        this.listApi_training(returnData);
    };

    // This is goes to the last page
    exRigth_Training = () => {
        let totalPage = this.state.total_page_training;
        this.setState({
            current_page_training: totalPage,
        });
        let fetchData = {
            limit: JSON.stringify(this.state.limit_training),
            offset: JSON.stringify((totalPage - 1) * this.state.limit_training),
            clientid:this.state.userId,
            serviceType: "47"
        };
        let returnData = Object.assign(reqData, fetchData);
        this.listApi_training(returnData);
    };

    // This is goes to the first page
    prev_Training= () => {
        let currentPage = this.state.current_page_training;
        if (currentPage > 1) {
            currentPage--;
            this.setState({
                current_page_training: currentPage,
            });
           
        }
        let fetchData = {
            limit: JSON.stringify(this.state.limit_training),
            offset: JSON.stringify((currentPage - 1) * this.state.limit_training),
            clientid:this.state.userId,
            serviceType: "46"
        };
        let returnData = Object.assign(reqData, fetchData);
        this.listApi_training(returnData);
    };

    // This is goes to the next page
    next_Training = () => {
        let currentPage = this.state.current_page_training;
        let totalPage = this.state.total_page_training;
        if (currentPage < totalPage) {
            currentPage++;
            this.setState({
                current_page_training: currentPage,
            });
           
        }
        let fetchData = {
            limit: JSON.stringify(this.state.limit_training),
            offset: JSON.stringify((currentPage - 1) * this.state.limit_training),
            clientid:this.state.userId,
            serviceType: "47"
        };
        let returnData = Object.assign(reqData, fetchData);
        this.listApi_training(returnData);
    };

    onFilterApply_Training = () => {
        // let fetchData = {
        //   limit: JSON.stringify(this.state.limit),
        //   offset: "0",
        //   searchto: this.state.toDate,
        //   searchfrom: this.state.formDate,
        //   status: "",
        //   clientId: "",
        //   serviceType: "",
        //   orderby: "",
        //   direc: "",
        //   rfqId: "",
        // };
        // let returnData = Object.assign(reqData, fetchData);
        // this.listApi(returnData);
        // let data = {
        //   limit: JSON.stringify(this.state.limit),
        //   offset: "0",
        //   name: this.state.name,
        //   email: this.state.email,
        //   phone: this.state.mobile,
        //   orderby: "",
        //   direc: "",
        //   searchto: this.state.toDate,
        //   searchfrom: this.state.formDate,
        //   type: this.state.type,
        //   status: this.state.status.toString(),
        // };

        // console.log("Filter data", data)
        this.closeModal();

        // this.listApi(data);

        // this.setState({
        //   formDate: "",
        //   toDate: "",
        // });
    };

    onResetFilter_Training = () => {
        this.setState({
            formDate: "",
            toDate: "",
            selectedDisplayData: {
                label: "20",
                value: "20"
            },
            current_page: 1
        });
        this.load();
    };

    onCancelDataChange = (data) => {
        this.setState({
            cancellationData: data,
        });
    };
    rescheduledCheckYes = (e) => {
        // console.log(e.target.checked);
        this.setState({
            isSelected: true,
            rescheduledCheck: e.target.checked,
        });
    };
    rescheduledCheckNo = (e) => {
        // console.log(e.target.checked);
        this.setState({
            isSelected: false,
            rescheduledCheck: e.target.checked,
        });
    };

    onDeclineSubmit = async () => {
        let mainData = this.props.location;
        let preData = mainData.state;
        let errorCount = 0;

        let validateCancelReason = inputEmptyValidate(this.state.cancellationData);

        // if (validateInterpretationFee === false) {
        if (validateCancelReason === 0) {
            toast.error(AlertMessage.MESSAGE.JOB.EMPTY_MAIN_REASON, {
                hideProgressBar: true,
            });
            errorCount++;
        }

        if (errorCount === 0) {
            let data = {
                requestId: this.state.listData[this.state.curIndex].id,
                selectReason:
                    this.state.cancellationData.value === 6
                        ? this.state.otherReason
                        : this.state.cancellationData.label,
                isScheduled: this.state.isSelected ? 1 : 0,
            };
            let res = await ApiCall("cancelJobDetails", data);
            if (
                res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
            ) {
                toast.success(AlertMessage.MESSAGE.JOB.CANCEL, {
                    hideProgressBar: true,
                });
                this.declineClose();
                this.load();
            } else {
                if (
                    res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
                    res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST
                ) {
                    toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_EXIST, {
                        hideProgressBar: true,
                    });
                } else if (
                    res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
                    res.respondcode === ErrorCode.ERROR.ERROR_CODE.PHONE_EXIST
                ) {
                    toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EXIST, {
                        hideProgressBar: true,
                    });
                } else if (
                    res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
                    res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_PHONE_EXIST
                ) {
                    toast.error(AlertMessage.MESSAGE.EMAIL_MOBILE.DUBLICATE, {
                        hideProgressBar: true,
                    });
                }
            }
        }
    };

    onCreateOffer = () => {
        // console.log("hello");
        this.props.history.push({
            pathname: "/adminVendorOffer",
            state: this.state.listData[this.state.curIndex],
        });

        // window.location.reload(false);
    };

    onTabClick = (value) => {
        if (value === "translation") {
            this.setState({
                
                isTranslation: true,
                isTraining: false,
             
            });
        } else if (value === "training") {
            this.setState({
              
                isTranslation: false,
                isTraining: true,
            });
        }
    };

    onAppointmentTypeChange = (data) => {
        this.setState({
            appointmentTypeData: data,
        });
    };
    onTargetLangChange = (data) => {
        this.setState({
            targetLangData: data,
        });
    };
    onsourceLangChange = (data) => {
        this.setState({
            sourceLangData: data,
        });
    };
    onStatusChange = (data) => {
        this.setState({
            statusData: data,
        });
    };
    onLeiChange = (data) => {
        this.setState({
            leiData: data,
        });
    };
    onIndustryChange = (data) => {
        this.setState({
            industryData: data,
        });
    };

    goEdit = () => {
        this.props.history.push({
            pathname: "/adminTranslationDetails",
            state: this.state.listData[this.state.curIndex].id,
        });
    };

    openTable = () => {
        this.setState({
            isCalender: false
        })
    }

    openCalender = async () => {
        let reqData = {
            limit: "",
            offset: "",
            status: "",
            clientId: "",
            serviceType: "46",
            orderby: "",
            direc: "",
            searchFrom: "",
            searchTo: "",
            rfqId: "",
        };
        //...... For All jobs listing for calender.............
        const res = await ApiCall("getAllProjects", reqData);
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            const decodeData = Decoder.decode(res.data.payload);
            let listDetails = [];
            if (decodeData.data.projectList.length > 0) {
                listDetails = decodeData.data.projectList;
            }
            // consoleLog("CalenderDAta : ", listDetails)
            this.setState({
                calenderData: listDetails,
                isCalender: true
            });
        }


    }

    detailJob = (value) => {
        // consoleLog("Calender Click", value);
        this.setState({
            curIndex: value.curIndex
        });

        this.props.history.push({
            pathname: "/adminTranslationDetails",
            state: this.state.calenderData[value.curIndex].id,
        });

    }

    render() {
        const open = Boolean(this.state.anchorEl); //used in MenuButton open
        const open1 = Boolean(this.state.anchorEl1);
        return (
            <React.Fragment>
                <ToastContainer hideProgressBar theme="colored" />
                {/* <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div> */}
                <div className="component-wrapper vewaljobs">
                    {/* <ReactLoader /> */}
                    <div
                        className="vn_frm"
                        style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
                    >
                        <Link to="/adminDashboard">Dashboard</Link> / <Link to="/adminClientList">Client</Link> / Translation
                        
                    </div>
                    <div className="vendor-info p-10 _fl sdw">
            <div className="vn-form _fl">

            <div className="row"></div>
            <div className="row" style={{ marginTop: "20px" }}>
                  <div className="col-md-6 rateList">
                    <div className="_fl verificaiton-doc-tab">
                      <ul>
                        <li
                          className="active"
                          data-related="tble-data-a"
                          onClick={() => {
                            this.onTabClick("translation");
                          }}
                          style={{width:"50%"}}
                        >
                          Translation
                        </li>
                        <li
                          className=""
                          data-related="tble-data-b"
                          onClick={() => {
                            this.onTabClick("training");
                          }}
                          style={{width:"50%"}}
                        >
                          Training
                        </li>
                        
                      </ul>
                    </div>
                  </div>
                </div>
            </div>
          </div>
                    <div className="table-filter-app">
                        {!this.state.isCalender ? <React.Fragment>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="cus-filter-btn">
                                        {/* <button className="button">
                                            <img src={ImageName.IMAGE_NAME.MENU_BTN} onClick={this.openTable}/>
                                        </button>
                                     
                                        <button className="button">
                                            <img src={ImageName.IMAGE_NAME.MENU_BTN_TWO} onClick={this.openCalender}/>
                                        </button>

                                        <div
                                            class="filter-btn"
                                            style={{ float: "none", paddingLeft: "10px" }}
                                        >
                                            <a href="#" onClick={this.filterModal}>
                                                Filter
                                            </a>
                                        </div> */}

                                        {this.state.isTranslation ? <React.Fragment>
                                            <div className="filter-pagination">
                                            <button className="prev_btn" onClick={this.exLeft}></button>
                                            <button className="prv_btn" onClick={this.prev}>
                                                {" "}
                                                {"<"}
                                            </button>
                                            <span className="num" onChange={(e) => this.clickChange(e)}>
                                                {this.state.current_page}
                                            </span>
                                            <button className="nxt_btn" onClick={this.next}>
                                                {">"}
                                            </button>
                                            <button
                                                className="next_btn"
                                                onClick={this.exRigth}
                                            ></button>
                                        </div>
                                        </React.Fragment> : <React.Fragment>
                                        <div className="filter-pagination">
                                            <button className="prev_btn" onClick={this.exLeft_Training}></button>
                                            <button className="prv_btn" onClick={this.prev_Training}>
                                                {" "}
                                                {"<"}
                                            </button>
                                            <span className="num" onChange={(e) => this.clickChange_Training(e)}>
                                                {this.state.current_page}
                                            </span>
                                            <button className="nxt_btn" onClick={this.next_Training}>
                                                {">"}
                                            </button>
                                            <button
                                                className="next_btn"
                                                onClick={this.exRigth_Training}
                                            ></button>
                                        </div>
                                            </React.Fragment>}

                                        
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="table-filter-box">

                                        <div className="tble-short">
                                            {" "}
                                            <span className="lbl">Display</span>
                                            <div
                                                class="dropdwn"
                                                style={{
                                                    width: "70px",
                                                    fontSize: "12px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {this.state.isTranslation ? <React.Fragment>
                                                    <PaginationDropdown
                                                    optionData={CommonData.COMMON.DISPLAY_ARR}
                                                    value={this.state.selectedDisplayData}
                                                    placeholder="Select"
                                                    onSelectChange={(value) => {
                                                        this.onChangeLimit(value);
                                                    }}
                                                />
                                                </React.Fragment>:<React.Fragment>
                                                <PaginationDropdown
                                                    optionData={CommonData.COMMON.DISPLAY_ARR}
                                                    value={this.state.selectedDisplayData_Training}
                                                    placeholder="Select"
                                                    onSelectChange={(value) => {
                                                        this.onChangeLimit_Training(value);
                                                    }}
                                                />
                                                    </React.Fragment>}
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment> : <React.Fragment>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="cus-filter-btn">
                                        <button className="button" onClick={this.openTable}>
                                            <img src={ImageName.IMAGE_NAME.GREY_HAMBURGER} style={{ width: "20px", marginTop: "15px" }} />
                                        </button>
                                        <button className="button" onClick={this.openCalender}>
                                            <img src={ImageName.IMAGE_NAME.BLUE_CALENDER} style={{ width: "20px", marginTop: "15px" }} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                        }
                    </div>

                    {this.state.isCalender ? <React.Fragment>
                        <div className="table-listing-app">
                            <ViewCalender id={this.state.calenderData} type="translation" detailClick={(value) => { this.detailJob(value) }} />
                        </div>
                    </React.Fragment> :
                        <React.Fragment>
                            <div
                                className="tab-app-information activeLnk"
                                id="tble-data-a"
                                hidden={!this.state.isTranslation}
                            >
                                <div className="table-listing-app">
                                    <div className="table-responsive_cus table-style-a">
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                            <tbody>
                                                <tr>
                                                    <th style={{ width: "15%" }}>Project#</th>
                                                   
                                                    <th style={{ width: "15%" }}>Service Type</th>
                                                    <th style={{ width: "15%" }}>Date</th>
                                                    <th style={{ width: "20%" }}>
                                                        Language{" "}
                                                    </th>
                                                    <th style={{ width: "12%" }}>Status</th>
                                                    <th style={{ width: "8%" }}>Action</th>
                                                </tr>
                                                {this.state.listData.length > 0 ? (<React.Fragment>
                                                    {this.state.listData.map((item, key) => (
                                                        <tr>
                                                            <td colspan="6">
                                                                <div className="tble-row">
                                                                    <table
                                                                        width="100%"
                                                                        border="0"
                                                                        cellpadding="0"
                                                                        cellspacing="0"
                                                                    >
                                                                        <tbody>
                                                                            <tr>
                                                                                <td style={{ width: "15%" }}>
                                                                                    {item.requestId}
                                                                                </td>
                                                                                {/* <td style={{ width: "15%" }}>
                                                                                    {item.clientName}
                                                                                </td> */}
                                                                                {item.serviceTypeId === 46 ?
                                                                                    <td style={{ width: "15%" }}>
                                                                                        {item.servicename} ({item.naminService})
                                                                                    </td> :
                                                                                    <td style={{ width: "15%" }}>
                                                                                        {item.trainingCategory} ({item.naminService})
                                                                                    </td>
                                                                                }
                                                                                <td style={{ width: "15%" }}>
                                                                                    {SetDateFormat(item.date)}
                                                                                </td>
                                                                                <td style={{ width: "20%" }}>
                                                                                    {item.language}
                                                                                </td>
                                                                                {/* <td style={{ width: "8%" }}></td> */}
                                                                                <td style={{ width: "12%" }}>
                                                                                    {item.status === 0 ? (
                                                                                        <React.Fragment>
                                                                                            <span className="progress-btn yellow">
                                                                                                Pending
                                                                                            </span>
                                                                                        </React.Fragment>
                                                                                    ) : item.status === 1 ? (
                                                                                        <React.Fragment>
                                                                                            <span
                                                                                                href="#"
                                                                                                className="progress-btn sky"
                                                                                            >
                                                                                                Quote Sent
                                                                                            </span>
                                                                                        </React.Fragment>
                                                                                    ) : item.status === 2 ? (
                                                                                        <React.Fragment>
                                                                                            <span
                                                                                                href="#"
                                                                                                className="progress-btn green"
                                                                                            >
                                                                                                Quote Accepted
                                                                                            </span>
                                                                                        </React.Fragment>
                                                                                    ) : item.status === 3 ? (
                                                                                        <React.Fragment>
                                                                                            <span
                                                                                                href="#"
                                                                                                className="progress-btn sky"
                                                                                            >
                                                                                                offer Sent
                                                                                            </span>
                                                                                        </React.Fragment>
                                                                                    ) : item.status === 4 ? (
                                                                                        <React.Fragment>
                                                                                            <span
                                                                                                href="#"
                                                                                                className="progress-btn blue"
                                                                                            >
                                                                                                Offer Accepted
                                                                                            </span>
                                                                                        </React.Fragment>
                                                                                    ) : item.status === 5 ? (
                                                                                        <React.Fragment>
                                                                                            <span
                                                                                                href="#"
                                                                                                className="progress-btn red"
                                                                                            >
                                                                                                Offer Rejected
                                                                                            </span>
                                                                                        </React.Fragment>
                                                                                    ) : item.status === 6 ? (
                                                                                        <React.Fragment>
                                                                                            <span
                                                                                                href="#"
                                                                                                className="progress-btn blue"
                                                                                            >
                                                                                                Bids Received
                                                                                            </span>
                                                                                        </React.Fragment>
                                                                                    ) : item.status === 7 ? (
                                                                                        <React.Fragment>
                                                                                            <span
                                                                                                href="#"
                                                                                                className="progress-btn red"
                                                                                            >
                                                                                                Quote Rejected
                                                                                            </span>
                                                                                        </React.Fragment>
                                                                                    ) : item.status === 8 ? (
                                                                                        <React.Fragment>
                                                                                            <span
                                                                                                href="#"
                                                                                                className="progress-btn green"
                                                                                            >
                                                                                                Assigned
                                                                                            </span>
                                                                                        </React.Fragment>
                                                                                    ) : item.status === 9 ? (
                                                                                        <React.Fragment>
                                                                                            <span
                                                                                                href="#"
                                                                                                className="progress-btn yellow"
                                                                                            >
                                                                                                In Progress
                                                                                            </span>
                                                                                        </React.Fragment>
                                                                                    ) : item.status === 10 ? (
                                                                                        <React.Fragment>
                                                                                            <span
                                                                                                href="#"
                                                                                                className="progress-btn green"
                                                                                            >
                                                                                                completed
                                                                                            </span>
                                                                                        </React.Fragment>
                                                                                    ) : item.status === 11 ? (
                                                                                        <React.Fragment>
                                                                                            <span
                                                                                                href="#"
                                                                                                className="progress-btn green"
                                                                                            >
                                                                                                cancelled
                                                                                            </span>
                                                                                        </React.Fragment>
                                                                                    ) : (
                                                                                        <React.Fragment></React.Fragment>
                                                                                    )}
                                                                                </td>
                                                                                <td style={{ width: "8%" }}>
                                                                                    {item.status === 2 ? (
                                                                                        <React.Fragment>
                                                                                            <img
                                                                                                src={
                                                                                                    ImageName.IMAGE_NAME.MENU_VERTICAL
                                                                                                }
                                                                                                style={{ cursor: "pointer" }}
                                                                                                id="basic-button"
                                                                                                aria-controls="basic-menu"
                                                                                                aria-haspopup="true"
                                                                                                aria-expanded={
                                                                                                    open ? "true" : undefined
                                                                                                }
                                                                                                onClick={(e) =>
                                                                                                    this.menuBtnhandleClick(key, e)
                                                                                                }
                                                                                            />
                                                                                            <Menu
                                                                                                id="basic-menu"
                                                                                                anchorEl={this.state.anchorEl}
                                                                                                open={open}
                                                                                                onClose={this.handleMenuClose}
                                                                                                MenuListProps={{
                                                                                                    "aria-labelledby": "basic-button",
                                                                                                }}
                                                                                            >
                                                                                                <MenuItem onClick={this.goEdit}>
                                                                                                    View Details
                                                                                                </MenuItem>
                                                                                                <MenuItem
                                                                                                    onClick={() => this.onCreateOffer()}
                                                                                                >
                                                                                                    Create Offer
                                                                                                </MenuItem>
                                                                                                {/* <MenuItem>Chat</MenuItem>
                                                                                                <MenuItem onClick={this.declineModal}>
                                                                                                    Cancel
                                                                                                </MenuItem> */}
                                                                                            </Menu>
                                                                                        </React.Fragment>
                                                                                    ) : (
                                                                                        <React.Fragment>
                                                                                            <img
                                                                                                src={
                                                                                                    ImageName.IMAGE_NAME.MENU_VERTICAL
                                                                                                }
                                                                                                style={{ cursor: "pointer" }}
                                                                                                id="basic-button"
                                                                                                aria-controls="basic-menu"
                                                                                                aria-haspopup="true"
                                                                                                aria-expanded={
                                                                                                    open1 ? "true" : undefined
                                                                                                }
                                                                                                onClick={(e) =>
                                                                                                    this.menuBtnhandleClick_b(key, e)
                                                                                                }
                                                                                            />
                                                                                            <Menu
                                                                                                id="basic-menu"
                                                                                                anchorEl={this.state.anchorEl1}
                                                                                                open={open1}
                                                                                                onClose={this.handleMenuClose}
                                                                                                MenuListProps={{
                                                                                                    "aria-labelledby": "basic-button",
                                                                                                }}
                                                                                            >
                                                                                                <MenuItem onClick={this.goEdit}>
                                                                                                    View Details
                                                                                                </MenuItem>

                                                                                                {/* <MenuItem>Chat</MenuItem>
                                                                                                <MenuItem onClick={this.declineModal}>
                                                                                                    Cancel
                                                                                                </MenuItem> */}
                                                                                            </Menu>
                                                                                        </React.Fragment>
                                                                                    )}
                                                                                    {/* </div> */}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>) : (<React.Fragment>
                                                    <tr style={{ textAlign: "center" }}>
                                                        <td colSpan="6">
                                                            <center style={{ fontSize: "20px" }}>
                                                                No data found !!!
                                                            </center>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>)}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="tab-app-information"
                                id="tble-data-b"
                                hidden={!this.state.isTraining}
                            >
                                <div className="table-listing-app">
                            <div className="table-responsive_cus table-style-a">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                    <tbody>
                                        <tr>
                                            <th style={{ width: "20%" }}>Project#</th>
                                          
                                            <th style={{ width: "20%" }}>Service Type</th>
                                            <th style={{ width: "15%" }}>Date</th>
                                            <th style={{ width: "15%" }}>Status</th>
                                            <th style={{ width: "10%" }}>Action</th>
                                        </tr>
                                        {this.state.traininglistData.length > 0 ? (<React.Fragment>
                                            {this.state.traininglistData.map((item, key) => (
                                                <tr>
                                                    <td colspan="11">
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
                                                                            {item.requestId}
                                                                        </td>
                                                                        {/* <td style={{ width: "20%" }}>
                                                                            {item.clientName}
                                                                        </td> */}
                                                                        {item.serviceTypeId === 46 ?
                                                                            <td style={{ width: "20%" }}>
                                                                                {item.servicename} 
                                                                            </td> :
                                                                            <td style={{ width: "20%" }}>
                                                                                {item.trainingCategory}
                                                                            </td>
                                                                        }
                                                                        <td style={{ width: "15%" }}>
                                                                            {SetDateFormat(item.date)}
                                                                        </td>
                                                                        {/* <td style={{ width: "20%" }}>
                                                                        {item.language}
                                                                    </td> */}
                                                                        {/* <td style={{ width: "8%" }}></td> */}
                                                                        <td style={{ width: "15%" }}>
                                                                            {item.status === 0 ? (
                                                                                <React.Fragment>
                                                                                    <span className="progress-btn yellow">
                                                                                        Pending
                                                                                    </span>
                                                                                </React.Fragment>
                                                                            ) : item.status === 1 ? (
                                                                                <React.Fragment>
                                                                                    <span
                                                                                        href="#"
                                                                                        className="progress-btn sky"
                                                                                    >
                                                                                        Quote Sent
                                                                                    </span>
                                                                                </React.Fragment>
                                                                            ) : item.status === 2 ? (
                                                                                <React.Fragment>
                                                                                    <span
                                                                                        href="#"
                                                                                        className="progress-btn green"
                                                                                    >
                                                                                        Quote Accepted
                                                                                    </span>
                                                                                </React.Fragment>
                                                                            ) : item.status === 3 ? (
                                                                                <React.Fragment>
                                                                                    <span
                                                                                        href="#"
                                                                                        className="progress-btn sky"
                                                                                    >
                                                                                        offer Sent
                                                                                    </span>
                                                                                </React.Fragment>
                                                                            ) : item.status === 4 ? (
                                                                                <React.Fragment>
                                                                                    <span
                                                                                        href="#"
                                                                                        className="progress-btn blue"
                                                                                    >
                                                                                        Offer Accepted
                                                                                    </span>
                                                                                </React.Fragment>
                                                                            ) : item.status === 5 ? (
                                                                                <React.Fragment>
                                                                                    <span
                                                                                        href="#"
                                                                                        className="progress-btn red"
                                                                                    >
                                                                                        Offer Rejected
                                                                                    </span>
                                                                                </React.Fragment>
                                                                            ) : item.status === 6 ? (
                                                                                <React.Fragment>
                                                                                    <span
                                                                                        href="#"
                                                                                        className="progress-btn blue"
                                                                                    >
                                                                                        Bids Received
                                                                                    </span>
                                                                                </React.Fragment>
                                                                            ) : item.status === 7 ? (
                                                                                <React.Fragment>
                                                                                    <span
                                                                                        href="#"
                                                                                        className="progress-btn red"
                                                                                    >
                                                                                        Quote Rejected
                                                                                    </span>
                                                                                </React.Fragment>
                                                                            ) : item.status === 8 ? (
                                                                                <React.Fragment>
                                                                                    <span
                                                                                        href="#"
                                                                                        className="progress-btn green"
                                                                                    >
                                                                                        Assigned
                                                                                    </span>
                                                                                </React.Fragment>
                                                                            ) : item.status === 9 ? (
                                                                                <React.Fragment>
                                                                                    <span
                                                                                        href="#"
                                                                                        className="progress-btn yellow"
                                                                                    >
                                                                                        In Progress
                                                                                    </span>
                                                                                </React.Fragment>
                                                                            ) : item.status === 10 ? (
                                                                                <React.Fragment>
                                                                                    <span
                                                                                        href="#"
                                                                                        className="progress-btn green"
                                                                                    >
                                                                                        completed
                                                                                    </span>
                                                                                </React.Fragment>
                                                                            ) : item.status === 11 ? (
                                                                                <React.Fragment>
                                                                                    <span
                                                                                        href="#"
                                                                                        className="progress-btn green"
                                                                                    >
                                                                                        cancelled
                                                                                    </span>
                                                                                </React.Fragment>
                                                                            ) : (
                                                                                <React.Fragment></React.Fragment>
                                                                            )}
                                                                        </td>
                                                                        <td style={{ width: "10%" }}>
                                                                            {item.status === 2 ? (
                                                                                <React.Fragment>
                                                                                    <img
                                                                                        src={
                                                                                            ImageName.IMAGE_NAME.MENU_VERTICAL
                                                                                        }
                                                                                        style={{ cursor: "pointer" }}
                                                                                        id="basic-button"
                                                                                        aria-controls="basic-menu"
                                                                                        aria-haspopup="true"
                                                                                        aria-expanded={
                                                                                            open ? "true" : undefined
                                                                                        }
                                                                                        onClick={(e) =>
                                                                                            this.menuBtnhandleClick(key, e)
                                                                                        }
                                                                                    />
                                                                                    <Menu
                                                                                        id="basic-menu"
                                                                                        anchorEl={this.state.anchorEl}
                                                                                        open={open}
                                                                                        onClose={this.handleMenuClose}
                                                                                        MenuListProps={{
                                                                                            "aria-labelledby": "basic-button",
                                                                                        }}
                                                                                    >
                                                                                        <MenuItem onClick={this.goEdit}>
                                                                                            View Details
                                                                                        </MenuItem>
                                                                                        <MenuItem
                                                                                            onClick={() => this.goEdit()}
                                                                                        >
                                                                                            Create Offer
                                                                                        </MenuItem>
                                                                                        {/* <MenuItem>Chat</MenuItem>
                                                                                        <MenuItem onClick={this.declineModal}>
                                                                                            Cancel
                                                                                        </MenuItem> */}
                                                                                    </Menu>
                                                                                </React.Fragment>
                                                                            ) : (
                                                                                <React.Fragment>
                                                                                    <img
                                                                                        src={
                                                                                            ImageName.IMAGE_NAME.MENU_VERTICAL
                                                                                        }
                                                                                        style={{ cursor: "pointer" }}
                                                                                        id="basic-button"
                                                                                        aria-controls="basic-menu"
                                                                                        aria-haspopup="true"
                                                                                        aria-expanded={
                                                                                            open1 ? "true" : undefined
                                                                                        }
                                                                                        onClick={(e) =>
                                                                                            this.menuBtnhandleClick_b(key, e)
                                                                                        }
                                                                                    />
                                                                                    <Menu
                                                                                        id="basic-menu"
                                                                                        anchorEl={this.state.anchorEl1}
                                                                                        open={open1}
                                                                                        onClose={this.handleMenuClose}
                                                                                        MenuListProps={{
                                                                                            "aria-labelledby": "basic-button",
                                                                                        }}
                                                                                    >
                                                                                        <MenuItem onClick={this.goEdit}>
                                                                                            View Details
                                                                                        </MenuItem>

                                                                                        {/* <MenuItem>Chat</MenuItem>
                                                                                        <MenuItem onClick={this.declineModal}>
                                                                                            Cancel
                                                                                        </MenuItem> */}
                                                                                    </Menu>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {/* </div> */}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>) : (<React.Fragment>
                                            <tr style={{ textAlign: "center" }}>
                                                <td colSpan="11">
                                                    <center style={{ fontSize: "20px" }}>
                                                        No data found !!!
                                                    </center>
                                                </td>
                                            </tr>
                                        </React.Fragment>)}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                            </div>

                        </React.Fragment>
                    }

                   <div className="table-filter-app">
                        {!this.state.isCalender ? <React.Fragment>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="cus-filter-btn">
                                        {/* <button className="button">
                                            <img src={ImageName.IMAGE_NAME.MENU_BTN} onClick={this.openTable}/>
                                        </button>
                                     
                                        <button className="button">
                                            <img src={ImageName.IMAGE_NAME.MENU_BTN_TWO} onClick={this.openCalender}/>
                                        </button>

                                        <div
                                            class="filter-btn"
                                            style={{ float: "none", paddingLeft: "10px" }}
                                        >
                                            <a href="#" onClick={this.filterModal}>
                                                Filter
                                            </a>
                                        </div> */}

                                        {this.state.isTranslation ? <React.Fragment>
                                            <div className="filter-pagination">
                                            <button className="prev_btn" onClick={this.exLeft}></button>
                                            <button className="prv_btn" onClick={this.prev}>
                                                {" "}
                                                {"<"}
                                            </button>
                                            <span className="num" onChange={(e) => this.clickChange(e)}>
                                                {this.state.current_page}
                                            </span>
                                            <button className="nxt_btn" onClick={this.next}>
                                                {">"}
                                            </button>
                                            <button
                                                className="next_btn"
                                                onClick={this.exRigth}
                                            ></button>
                                        </div>
                                        </React.Fragment> : <React.Fragment>
                                        <div className="filter-pagination">
                                            <button className="prev_btn" onClick={this.exLeft_Training}></button>
                                            <button className="prv_btn" onClick={this.prev_Training}>
                                                {" "}
                                                {"<"}
                                            </button>
                                            <span className="num" onChange={(e) => this.clickChange_Training(e)}>
                                                {this.state.current_page}
                                            </span>
                                            <button className="nxt_btn" onClick={this.next_Training}>
                                                {">"}
                                            </button>
                                            <button
                                                className="next_btn"
                                                onClick={this.exRigth_Training}
                                            ></button>
                                        </div>
                                            </React.Fragment>}

                                        
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="table-filter-box">

                                        <div className="tble-short">
                                            {" "}
                                            <span className="lbl">Display</span>
                                            <div
                                                class="dropdwn"
                                                style={{
                                                    width: "70px",
                                                    fontSize: "12px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {this.state.isTranslation ? <React.Fragment>
                                                    <PaginationDropdown
                                                    optionData={CommonData.COMMON.DISPLAY_ARR}
                                                    value={this.state.selectedDisplayData}
                                                    placeholder="Select"
                                                    onSelectChange={(value) => {
                                                        this.onChangeLimit(value);
                                                    }}
                                                />
                                                </React.Fragment>:<React.Fragment>
                                                <PaginationDropdown
                                                    optionData={CommonData.COMMON.DISPLAY_ARR}
                                                    value={this.state.selectedDisplayData_Training}
                                                    placeholder="Select"
                                                    onSelectChange={(value) => {
                                                        this.onChangeLimit_Training(value);
                                                    }}
                                                />
                                                    </React.Fragment>}
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment> : <React.Fragment>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="cus-filter-btn">
                                        <button className="button" onClick={this.openTable}>
                                            <img src={ImageName.IMAGE_NAME.GREY_HAMBURGER} style={{ width: "20px", marginTop: "15px" }} />
                                        </button>
                                        <button className="button" onClick={this.openCalender}>
                                            <img src={ImageName.IMAGE_NAME.BLUE_CALENDER} style={{ width: "20px", marginTop: "15px" }} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                        }
                    </div>
                </div>
                <div
                    id="filter-model"
                    className="modal fade modelwindow filter-pop"
                    role="dialog"
                >
                    <div className="modal-dialog modal-lg jobhrtypage">
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
                            {/* <div className="filter-head _fl">
                                <h3>Filter by</h3>
                                <div className="reset-btn">
                                <button className="reset">Reset</button>
                                <button className="apply">Apply</button>
                                <button className="close-page">
                                    <img src={ImageName.IMAGE_NAME.CLOSE_BTN_2} />
                                    &nbsp;
                                </button>
                                </div>
                            </div> */}
                            <div className="modal-body">
                                <div className="job_filt_lfe">
                                    <div class="_fl verificaiton-doc-tab">
                                        <ul>
                                            <li className="active" data-related="tble-data-d">
                                                Appointment Type
                                            </li>
                                            <li data-related="tble-data-e">Language</li>
                                            {/* <li data-related="tble-data-f">Requests</li>
                      <li data-related="tble-data-g">No. of Interpreters</li> */}
                                            <li data-related="tble-data-h">Date & Time</li>
                                            <li data-related="tble-data-i">Status</li>
                                            <li data-related="tble-data-j">
                                                Limited English Individual [LEI]
                                            </li>
                                            <li data-related="tble-data-k">Industry Type</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="tab-app-information activeLnk" id="tble-data-d">
                                    <div className="jobfilterpop table-listing-app">
                                        <div className="table-responsive_cus table-style-a">
                                            <div className="filter-jeneral-wrap">
                                                <div className="create-row-app">
                                                    <div className="row" style={{ padding: "30px" }}>
                                                        <div className="col-md-10">
                                                            <div className="row">
                                                                <div
                                                                    class="lable-text"
                                                                    style={{ fontSize: "20px" }}
                                                                >
                                                                    APPOINTMENT TYPE
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div
                                                                    class="dropdwn"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <Select
                                                                        styles={customStyles}
                                                                        options={this.state.appointmentTypeArr}
                                                                        components={{
                                                                            DropdownIndicator,
                                                                            IndicatorSeparator: () => null,
                                                                        }}
                                                                        value={this.state.appointmentTypeData}
                                                                        placeholder="Select"
                                                                        onChange={(value) => {
                                                                            this.onAppointmentTypeChange(value);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className="row">
                            <div className="col-md-6">
                              <div className="web-form-app">
                                <div className="web-form-bx">
                                  <div className="apoi-tble-short">
                                    {" "}
                                    <div className="frm-label">
                                      Appointment Type
                                    </div>
                                    <div className="dropdwn">
                                      <select
                                        className="frm4-select"
                                        id="select25"
                                      >
                                         <option>Face to Face</option>
                                        <option>
                                          Over the Phone Interpretation
                                        </option>
                                        <option>
                                          Video Remot Interpreting
                                        </option>
                                      </select>
                                    </div>
                                  </div>
                                </div>

                                <div className="web-form-bx">
                                  <div className="frm-label">
                                    Is the job reschudeld?
                                  </div>
                                  <div className="check-field">
                                    <label className="checkbox_btn">
                                      <input type="radio" name="radio1" />
                                      <span className="checkmark3"></span> Yes
                                    </label>
                                  </div>
                                  <div className="check-field">
                                    <label className="checkbox_btn">
                                      <input type="radio" name="radio1" />
                                      <span className="checkmark3"></span> No
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div> */}
                                                    {/* <div className="row">
                            <div className="col-md-6">
                              <div className="web-form-bx">
                                <div className="frm-label">
                                  Appointment date and time
                                </div>
                                <div className="form-input-fields">
                                  <input
                                    type="text"
                                    id="from_datepicker"
                                    className="textbox4 d-icon"
                                    placeholder="10/25/2021"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="t-time prt" id="current-time">
                                <span className="t1">
                                  <small>09</small>
                                </span>
                                <span className="t2">
                                  <small>09</small>
                                </span>
                                <span className="t3">
                                  <small>09</small>
                                </span>
                              </div>
                            </div>
                          </div> */}
                                                    {/* <div className="row">
                            <div className="col-md-6">
                              <div className="web-form-bx">
                                <div className="frm-label">Source Language</div>
                                <div className="dropdwn">
                                  <select className="frm4-select" id="select25">
                                    <option>Select</option>
                                    <option>Select 1</option>
                                    <option>Select 2</option>
                                    <option>Select 3</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="web-form-bx">
                                <div className="frm-label">target Language</div>
                                <div className="dropdwn">
                                  <select className="frm4-select" id="select25">
                                    <option>Select</option>
                                    <option>Select 1</option>
                                    <option>Select 2</option>
                                    <option>Select 3</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="web-form-bx">
                                <div className="frm-label">Location Within</div>
                                <div className="dropdwn">
                                  <select className="frm4-select" id="select25">
                                    <option>Select</option>
                                    <option>Select 1</option>
                                    <option>Select 2</option>
                                    <option>Select 3</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="web-form-bx">
                                <div className="frm-label">&nbsp;</div>
                                <div className="dropdwn">
                                  <select className="frm4-select" id="select25">
                                    <option>Select</option>
                                    <option>Select 1</option>
                                    <option>Select 2</option>
                                    <option>Select 3</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div> */}
                                                    {/* <div className="row">
                            <div className="col-md-12">
                              <div className="web-form-bx">
                                <div className="_button-style _fl text-center">
                                  <a href="#" className="white-btn">
                                    cancel
                                  </a>
                                  <a href="#" className="blue-btn">
                                    submit
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-app-information" id="tble-data-e">
                                    <div className="jobfilterpop table-listing-app">
                                        <div className="table-responsive_cus table-style-a">
                                            <div className="filter-jeneral-wrap">
                                                <div className="create-row-app">
                                                    <div className="row" style={{ padding: "30px" }}>
                                                        <div className="col-md-12">
                                                            <div className="row">
                                                                <div className="col-md-5">
                                                                    <div
                                                                        class="lable-text"
                                                                        style={{ fontSize: "20px" }}
                                                                    >
                                                                        SOURCE LANGUAGE
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-1"></div>
                                                                <div className="col-md-5">
                                                                    {" "}
                                                                    <div
                                                                        class="lable-text"
                                                                        style={{ fontSize: "20px" }}
                                                                    >
                                                                        TARGET LANGUAGE
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-5">
                                                                    <div
                                                                        class="dropdwn"
                                                                        style={{ cursor: "pointer" }}
                                                                    >
                                                                        <Select
                                                                            styles={customStyles}
                                                                            options={this.state.languageArr}
                                                                            components={{
                                                                                DropdownIndicator,
                                                                                IndicatorSeparator: () => null,
                                                                            }}
                                                                            value={this.state.sourceLangData}
                                                                            placeholder="Select"
                                                                            onChange={(value) => {
                                                                                this.onSourceLangChange(value);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-1"></div>
                                                                <div className="col-md-5">
                                                                    <div
                                                                        class="dropdwn"
                                                                        style={{ cursor: "pointer" }}
                                                                    >
                                                                        <Select
                                                                            styles={customStyles}
                                                                            options={this.state.languageArr}
                                                                            components={{
                                                                                DropdownIndicator,
                                                                                IndicatorSeparator: () => null,
                                                                            }}
                                                                            value={this.state.targetLangData}
                                                                            placeholder="Select"
                                                                            onChange={(value) => {
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
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="tab-app-information" id="tble-data-f">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">Requests </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                                {/* <div className="tab-app-information" id="tble-data-g">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">
                              No. of Interpreters{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                                <div className="tab-app-information" id="tble-data-h">
                                    <div className="jobfilterpop table-listing-app">
                                        <div className="table-responsive_cus table-style-a">
                                            <div className="filter-jeneral-wrap">
                                                <div className="create-row-app">
                                                    <div className="form-search-app">
                                                        <div
                                                            className="lable-text"
                                                            style={{ fontSize: "20px" }}
                                                        >
                                                            Appointment Date
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-10">
                                                                <div className="form-field-app date-input">
                                                                    <span style={{ marginTop: "8px" }}>from</span>
                                                                    <input
                                                                        type="date"
                                                                        className="datefield bd"
                                                                        placeholder="10/25/2021"
                                                                        value={this.state.formDate}
                                                                        onChange={this.formDateChange}
                                                                        style={{
                                                                            textAlign: "center",
                                                                            height: "50px",
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row" style={{ marginTop: "30px" }}>
                                                            <div className="col-md-10">
                                                                <div className="form-field-app date-input">
                                                                    <span style={{ marginTop: "8px" }}>to</span>
                                                                    <input
                                                                        type="date"
                                                                        className="datefield bd"
                                                                        placeholder="10/25/2021"
                                                                        value={this.state.toDate}
                                                                        onChange={this.toDateChange}
                                                                        style={{
                                                                            textAlign: "center",
                                                                            height: "50px",
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
                                <div className="tab-app-information" id="tble-data-i">
                                    <div className="jobfilterpop table-listing-app">
                                        <div className="table-responsive_cus table-style-a">
                                            <div className="filter-jeneral-wrap">
                                                <div className="create-row-app">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div
                                                                class="lable-text"
                                                                style={{ fontSize: "20px" }}
                                                            >
                                                                Status{" "}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-8">
                                                            <div
                                                                class="dropdwn"
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                <Select
                                                                    styles={customStyles}
                                                                    options={this.state.statusArr}
                                                                    components={{
                                                                        DropdownIndicator,
                                                                        IndicatorSeparator: () => null,
                                                                    }}
                                                                    value={this.state.statusData}
                                                                    placeholder="Select"
                                                                    onChange={(value) => {
                                                                        this.onStatusChange(value);
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
                                <div className="tab-app-information" id="tble-data-j">
                                    <div className="jobfilterpop table-listing-app">
                                        <div className="table-responsive_cus table-style-a">
                                            <div className="filter-jeneral-wrap">
                                                <div className="create-row-app">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div
                                                                class="lable-text"
                                                                style={{ fontSize: "20px" }}
                                                            >
                                                                Limited English Individual [LEI]{" "}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-8">
                                                            <div
                                                                class="dropdwn"
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                <Select
                                                                    styles={customStyles}
                                                                    options={this.state.leiArr}
                                                                    components={{
                                                                        DropdownIndicator,
                                                                        IndicatorSeparator: () => null,
                                                                    }}
                                                                    value={this.state.leiData}
                                                                    placeholder="Select"
                                                                    onChange={(value) => {
                                                                        this.onLeiChange(value);
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
                                <div className="tab-app-information" id="tble-data-k">
                                    <div className="jobfilterpop table-listing-app">
                                        <div className="table-responsive_cus table-style-a">
                                            <div className="filter-jeneral-wrap">
                                                <div className="create-row-app">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div
                                                                class="lable-text"
                                                                style={{ fontSize: "20px" }}
                                                            >
                                                                INDUSTRY TYPE{" "}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-8">
                                                            <div
                                                                class="dropdwn"
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                <Select
                                                                    styles={customStyles}
                                                                    options={this.state.industryArr}
                                                                    components={{
                                                                        DropdownIndicator,
                                                                        IndicatorSeparator: () => null,
                                                                    }}
                                                                    value={this.state.industryData}
                                                                    placeholder="Select"
                                                                    onChange={(value) => {
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
                        </div>
                    </div>
                </div>
                {/* ..................... */}

                {/* ..................Decline modal................................. */}
                <div
                    id="decline-model"
                    className="modal fade modelwindow"
                    role="dialog"
                >
                    <div className="modal-dialog modal-md modal-dialog-centered decline-modal-width">
                        <div className="modal-content" style={{ width: "100%" }}>
                            <div className="cancel-job-head">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h2>
                                            Cancel Job{" "}
                                            <span style={{ fontSize: "17px", marginLeft: "7px" }}>
                                                (Interpretation)
                                            </span>
                                        </h2>
                                        <button className="close-page">
                                            <img
                                                src={ImageName.IMAGE_NAME.CLOSE_BTN_3}
                                                onClick={this.declineClose}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-body">
                                <div className="create-jeneral-wrap _fl">
                                    <div className="create-row-app">
                                        <div className="row" style={{ marginBottom: "15px" }}>
                                            <div className="col-md-6">
                                                <div className="web-form-app">
                                                    <div className="web-form-bx selct">
                                                        <div className="frm-label lblSize">
                                                            Reason for Cancellation
                                                        </div>
                                                        <div className="dropdwn selct">
                                                            <SelectBox
                                                                optionData={cancelationArr}
                                                                value={this.state.cancellationData}
                                                                onSelectChange={(value) => {
                                                                    this.onCancelDataChange(value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="web-form-bx selct">
                                                        <div className="frm-label lblSize">
                                                            Other Reason
                                                        </div>
                                                        <div
                                                            className="form-input-fields"
                                                            style={{ marginBottom: "20px" }}
                                                        >
                                                            <textarea
                                                                value={this.state.otherReason}
                                                                placeholder=""
                                                                className="in-textarea msg min table-style"
                                                                onChange={this.onOtherReasonChange}
                                                            ></textarea>
                                                        </div>
                                                    </div>

                                                    <div className="web-form-bx selct">
                                                        <div className="frm-label lblSize">
                                                            Is the job rescheduled?
                                                        </div>
                                                        <div className="check-field">
                                                            <label className="checkbox_btn">
                                                                <input
                                                                    type="radio"
                                                                    name="radio1"
                                                                    onClick={(e) => this.rescheduledCheckYes(e)}
                                                                />
                                                                <span className="checkmark3"></span> Yes
                                                            </label>
                                                        </div>
                                                        <div className="check-field">
                                                            <label className="checkbox_btn">
                                                                <input
                                                                    type="radio"
                                                                    name="radio1"
                                                                    onClick={(e) => this.rescheduledCheckNo(e)}
                                                                />
                                                                <span className="checkmark3"></span> No
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6"></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="web-form-bx selct">
                                                    <div className="_button-style _fl text-center">
                                                        <a
                                                            href="#"
                                                            className="white-btn"
                                                            onClick={this.declineClose}
                                                            style={{ textDecoration: "none" }}
                                                        >
                                                            cancel
                                                        </a>
                                                        <a
                                                            href="#"
                                                            className="blue-btn"
                                                            style={{ textDecoration: "none" }}
                                                            onClick={this.onDeclineSubmit}
                                                        >
                                                            submit
                                                        </a>
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

                <div
                    className="modal-backdrop fade show"
                    id="backdrop"
                    style={{ display: "none" }}
                ></div>
            </React.Fragment>
        );
    }
}
