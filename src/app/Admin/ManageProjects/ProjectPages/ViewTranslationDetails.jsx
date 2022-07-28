import React, { Component } from "react";

import "./viewTranslationDetail.css";

import { AlertMessage, ImageName } from "../../../../enums";
import { ApiCall } from "../../../../services/middleware";
import { CryptoDecoder, Decoder } from "../../../../services/auth";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";
import {
  courseFeeValidate,
  inputEmptyValidate,
  mobileNumberValidator,
  numberValidator,
  startsWithZero,
  zipValidate,
} from "../../../../validators";
import { APP_URL, Regex } from "../../../../services/config";

import history from "../../../../history";
import {
  consoleLog,
  decimalValue,
  getLanguageArray,
  SetDatabaseDateFormat,
  SetDateFormat,
  SetDOBFormat,
  SetTimeFormat,
  SetUSAdateFormat,
  textTruncate,
} from "../../../../services/common-function";
import ReactLoader from "../../../Loader";
import { IMAGE_PATH_ONLY } from "../../../../services/config/api_url";
// import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import { MultiSelectBox, SelectBox } from "../../SharedComponents/inputText";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { COMMON } from "../../../../services/constant/connpmData";
import Select, { components } from "react-select";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FiEdit } from "react-icons/fi";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


// ..........................style for react select........................

const customStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
    borderRadius: "6px",
    // width: "120%",
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
// .......................for react select icon.............................................

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

// ...................For Action Modal..........................
const styleCancelModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "500px",
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  // p: 4,
  borderRadius: "15px"
};

export default class ViewTranslationDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      requestId: "",
      clientId: "",
      clientFirstName: "",
      clientLastName: "",
      clientName: "",
      clientEmailId: "",
      clientPhone: "",
      clientIndustryType: "",
      //   .................jobDetails...........
      jobId: "",
      appointmentType: "",
      jobType: "",
      language: "",
      date: "",
      serviceAddress: "",
      siteContant: "",
      consumer: "",
      notesByClient: "",
      notesBy7C: "",
      taskList: [],
      taskData: [],
      // ................sendQuote............
      quoteId: "",
      quoteStatus: 0,
      targetAdience: "",
      location: "",
      dateTime: "",
      notesFromClient: "",
      deliveryType: "",
      duration: "",
      rushFee: 0,
      interpretationFee: 0,
      particularsArr: [],
      particular: "",
      particularAmount: [],
      totalParticularAmt: 0,
      particularAmt: 0,
      particularDataArr: [],
      particularAmountDataArr: [],
      totalAmount: 0,

      appointmentTypeArr: [],
      appointmentTypeData: [],
      languageArr: [],

      sourceLangData: {},
      targetLangData: {},
      listData: [],
      rushFee: "",
      taskDetails: [],
      translationUnitCost: "",
      dtpUnitCost: "",
      translationRate: "",
      countryCode: "",

      allChecked: false,
      vendorAssigned: [],
      targetLanguage: "",
      bidFee: 0,
      totalBidFee: 0,
      bidTask: "",
      bidtaskType: "",
      bidVendorDetails: [],
      bidWidth: "10%",
      additionalTranslationCharges: [],
      availabileData: {},
      allSourceDocuments: [],
      allTranslatedList: [],
      allVendorReviewdocs: [],
      allClientReviewDocs: [],
      allFinalDocs: [],

      open: false,
      anchorEl: "",
      curIndex: "",
      reviewNote: "",
      reviewDocId: "",
      newTaskList: [],
      allLanguageArr: [],
      allTranslationService: [],

      vendorListModalDetails: {},

      dummyTaskList: [],
      // ................

      dummySourceDoc: [
        {
          id: 50,
          fileName: "abc.pdf",
          serviceType: "Translation",
          taskId: "1",
          notesToVendor: "Doc notes",
          lastModified: "2022-02-14T07:09:43.000Z",
          Action: "",
        },
        {
          id: 51,
          fileName: "xyz.pdf",
          serviceType: "Translation",
          taskId: "1",
          notesToVendor: "Doc notes",
          lastModified: "2022-02-18T07:09:43.000Z",
          Action: "",
        },
      ],
      dummyTranslatedDoc: [
        {
          id: 50,
          fileName: "abc.pdf",
          serviceType: "Translation",
          taskId: "1",
          notesToVendor: "Doc notes",
          lastModified: "2022-02-14T07:09:43.000Z",
          Action: "",
        },
        {
          id: 51,
          fileName: "xyz.pdf",
          serviceType: "Translation",
          taskId: "1",
          notesToVendor: "Doc notes",
          lastModified: "2022-02-18T07:09:43.000Z",
          Action: "",
        },
      ],
      dummyVendorReviewDoc: [
        {
          id: 50,
          fileName: "abc.pdf",
          serviceType: "Translation",
          taskId: "1",
          notesToVendor: "Doc notes",
          lastModified: "2022-02-14T07:09:43.000Z",
          Action: "",
        },
        {
          id: 51,
          fileName: "xyz.pdf",
          serviceType: "Translation",
          taskId: "1",
          notesToVendor: "Doc notes",
          lastModified: "2022-02-18T07:09:43.000Z",
          Action: "",
        },
      ],
      dummyClientReviewDoc: [
        {
          id: 50,
          fileName: "abc.pdf",
          serviceType: "Translation",
          taskId: "1",
          notesToVendor: "Doc notes",
          lastModified: "2022-02-14T07:09:43.000Z",
          Action: "",
        },
        {
          id: 51,
          fileName: "xyz.pdf",
          serviceType: "Translation",
          taskId: "1",
          notesToVendor: "Doc notes",
          lastModified: "2022-02-18T07:09:43.000Z",
          Action: "",
        },
      ],
      dummyFinalDoc: [
        {
          id: 50,
          fileName: "abc.pdf",
          serviceType: "Translation",
          taskId: "1",
          notesToVendor: "Doc notes",
          lastModified: "2022-02-14T07:09:43.000Z",
          Action: "",
        },
        {
          id: 51,
          fileName: "xyz.pdf",
          serviceType: "Translation",
          taskId: "1",
          notesToVendor: "Doc notes",
          lastModified: "2022-02-18T07:09:43.000Z",
          Action: "",
        },
      ],
      pathCheck: false,
      actionModal: false,
      modalActionArr: [],
      selectedModalActionArr: {},
      modalNotes: "",
      modalActionData: {},
      modalDataPos: {},
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    window.$(".doc-wrap h3").click(function () {
      window.$(this).parent().find(".table-listing-app").slideToggle();
    });
    document.getElementById("backdrop").style.display = "none";
    let mainData = this.props.location,
      preData = mainData.state;
    if (preData === undefined) {
      return history.push("/adminProjectList");
    } else {
      this.load();
    }
    // this.load();
    if (
      this.props.match.path === "/adminTranslationDetailsFromBillVerification"
    ) {
      this.setState({
        pathCheck: true,
      });
    } else {
      this.setState({
        pathCheck: false,
      });
    }

    var classInstance = this;

    var viewModal = document.getElementById("viewModal");
    var bidModal = document.getElementById("bid-modal");
    var reviewModal = document.getElementById("review-modal");
    var vendorListModal = document.getElementById("vendor_list_modal");
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == viewModal) {
        classInstance.closeViewModal();
      } else if (event.target == bidModal) {
        classInstance.closeBidModal();
      } else if (event.target == reviewModal) {
        classInstance.closeReviewModal();
      } else if (event.target == vendorListModal) {
        classInstance.closeVendorListModal();
      }
    };
  }

  load = async () => {
    let mainData = this.props.location,
      preData = mainData.state;
    this.setState({
      requestId: preData,
    });
    let detailData = {
      requestId: preData,
    };
    // consoleLog("DetailData>>> ::", detailData)

    let clientDetails = {},
      jobDetails = {},
      quoteInfo = {},
      taskDetails = [],
      newTaskList = [],
      arr = [],
      quoteId = "",
      additionalTranslationCharges = [],
      allTranslationService = [],
      allLanguageArr = [];

    this.getAllSourceDocuments(detailData);
    allLanguageArr = await getLanguageArray();

    axios.post(APP_URL.VENDOR_SERVICE_OFFERED).then((res) => {
      // console.log("RES>>>>", res);
      let respObject = res.data;
      if (
        respObject.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        respObject.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let payload = Decoder.decode(respObject.data.payload);
        // console.log("service response payload>>>", payload);
        if (payload.data) {
          if (payload.data.services) {
            if (payload.data.services.length > 0) {
              payload.data.services.map(async (ser) => {
                if (
                  ser.id === 46 &&
                  ser.name === "Translation" &&
                  ser.subItem.length > 0
                ) {
                  ser.subItem.map((item) => {
                    allTranslationService.push({
                      label: item.subItemName,
                      value: item.id,
                    });
                  });
                  // consoleLog("allTranslationService::", allTranslationService)
                  // consoleLog(
                  //   "All Translation Services::>>>",
                  //   allTranslationService
                  // );

                  this.setState({
                    allTranslationService: allTranslationService,
                  });
                  // .................Translation Details............................

                  let detailsRes = await ApiCall("getTranslationDetails", detailData);

                  let detailPayload = Decoder.decode(detailsRes.data.payload);
                  consoleLog("Project Details Translation>>>>", detailPayload);

                  clientDetails = detailPayload.data.clientDetails;
                  jobDetails = detailPayload.data.jobDetails;
                  taskDetails = detailPayload.data.taskDetails;
                  if (detailPayload.data.quoteInfo) {
                    quoteInfo = detailPayload.data.quoteInfo;
                  }

                  if (taskDetails.length > 0) {
                    taskDetails.map((task, t) => {
                      // consoleLog("Sub Task main::", task.subTask)
                      let selectedTask = {},
                        selectedSourceLanguage = {},
                        selectedTargetLangugae = [],
                        subTask = [];

                      let targetLanArr = task.targetLanguageId.split(",");

                      if (allTranslationService.length > 0) {
                        allTranslationService.map((aa) => {
                          if (aa.value == task.serviceId) {
                            selectedTask = aa;
                          }
                        });
                      }

                      if (allLanguageArr.length > 0) {
                        allLanguageArr.map((ll) => {
                          if (ll.value == task.sourceLanguageId) {
                            selectedSourceLanguage = ll;
                          }
                        });
                      }

                      targetLanArr.map((tar, t) => {
                        allLanguageArr.map((ll) => {
                          if (tar == ll.value) {
                            selectedTargetLangugae.push(ll);
                          }
                        })
                      })

                      task.subTask.map((sub, s) => {
                        let selectedSubTask = {},
                          selectedSourceLanguageSub = {},
                          selectedTargetLangugaeSub = [];

                        let targetLanArrSub = sub.targetLanguageId.split(",");

                        if (allTranslationService.length > 0) {
                          allTranslationService.map((aa) => {
                            if (aa.value == sub.serviceId) {
                              selectedSubTask = aa;
                            }
                          });
                        }

                        if (allLanguageArr.length > 0) {
                          allLanguageArr.map((ll) => {
                            if (ll.value == sub.sourceLanguageId) {
                              selectedSourceLanguageSub = ll;
                            }
                          });
                        }

                        targetLanArrSub.map((tar) => {
                          allLanguageArr.map((ll) => {
                            if (tar == ll.value) {
                              selectedTargetLangugaeSub.push(ll);
                            }
                          })
                        })

                        let len = task.subTask.length;

                        subTask.push({
                          id: t + 1 + "." + Number(s + 1),
                          taskId: sub.taskId,
                          taskNo: sub.taskNo,
                          subTaskNo: s + 1,
                          targetLanguageId: sub.targetLanguageId,
                          selectedTargetLangugae: selectedTargetLangugaeSub,
                          sourceLanguageId: sub.sourceLanguageId,
                          selectedSourceLanguage: selectedSourceLanguageSub,
                          selectedTask: selectedSubTask,
                          sourceLanguage: sub.sourceLanguage,
                          serviceName: sub.serviceName,
                          serviceId: sub.serviceId,
                          targetLanguage: sub.targetLanguage,
                          dueDate: SetUSAdateFormat(sub.dueDate),
                          documentName: sub.documentName,
                          docZipPath: sub.docZipPath,
                          docDataArr: sub.docDataArr,
                          wordCount: sub.wordCount,
                          notes: sub.notes,
                          vendors: [],
                          isDisabled: true,
                          bidCounter: sub.bidCounter,
                          vendor: sub.vendor
                        })

                      })

                      newTaskList.push({
                        id: task.id,
                        taskId: task.taskId,
                        taskNo: task.taskNo,
                        subTaskNo: task.subTaskNo,
                        selectedTask: selectedTask,
                        serviceId: task.serviceId,
                        serviceName: task.serviceName,
                        documentName: task.documentName,
                        docZipPath: task.docZipPath,
                        docDataArr: task.docDataArr,
                        wordCount: task.wordCount,
                        sourceLanguage: task.sourceLanguage,
                        targetLanguage: task.targetLanguage,
                        bidCounter: task.bidCounter,
                        targetLanguageId: task.targetLanguageId,
                        selectedTargetLangugae: selectedTargetLangugae,
                        sourceLanguageId: task.sourceLanguageId,
                        selectedSourceLanguage: selectedSourceLanguage,
                        dueDate: SetUSAdateFormat(task.dueDate),
                        notes: task.notes,
                        vendors: [],
                        subTask: subTask,
                        vendor: task.vendor
                      });
                    });
                  }

                  if (Object.keys(quoteInfo).length > 0) {
                    quoteId = quoteInfo.quoteId;
                    let quoteData = JSON.parse(quoteInfo.additionalFee),
                      brr = quoteData.task;
                    if (quoteData.additionalFee) {
                      additionalTranslationCharges = quoteData.additionalFee;
                    }
                    brr.map((data) => {
                      arr.push({
                        taskId: parseInt(data.id),
                        service: data.service,
                        sourceLanguage: data.sourceLanguage,
                        targetLanguage: data.targetLanguage,
                        wordCountQty: Number(data.wordCountQty),
                        wordCountCost: Number(data.wordCountCost),
                        wordCountRate: Number(data.wordCountRate),
                        dtpQty: Number(data.dtpQty),
                        dtpCost: Number(data.dtpCost),
                        dtpRate: Number(data.dtpRate),
                        rushFeeUnit: Number(data.rushFeeUnit),
                        rushFeeCost: Number(data.rushFeeCost),
                        rushFeeRate: Number(data.rushFeeRate),
                        SubCost: Number(data.SubCost),
                      });
                    });
                    this.setState({
                      totalAmount: Number(quoteInfo.total)
                    });
                  } else
                    if (taskDetails.length > 0) {
                      taskDetails.map((data) => {
                        arr.push({
                          taskId: data.id,
                          service: data.serviceName,
                          sourceLanguage: data.sourceLanguage,
                          targetLanguage: data.targetLanguage,
                          wordCountQty: 0,
                          wordCountCost: 0,
                          wordCountRate: 0,
                          dtpQty: 0,
                          dtpCost: 0,
                          dtpRate: 0,
                          rushFeeUnit: 0,
                          rushFeeCost: 0,
                          rushFeeRate: 0,
                          SubCost: 0
                        })
                      })
                    }

                  // ...........................................

                  this.setState({
                    // ..........Client Details..........
                    clientId: jobDetails.clientId,
                    clientFirstName: clientDetails.fName,
                    clientLastName: clientDetails.lName,
                    clientEmailId: clientDetails.businessEmail,
                    clientName: clientDetails.clientName,
                    clientIndustryType: clientDetails.industtryType,
                    clientPhone: clientDetails.adminPhone,
                    //.................Job details..............
                    quoteStatus: jobDetails.quoteStatus,
                    jobId: jobDetails.jobId,
                    appointmentType: jobDetails.appointmentType,
                    jobType:
                      jobDetails.jobType === null ||
                        jobDetails.jobType === undefined ||
                        jobDetails.jobType === ""
                        ? "N/A"
                        : jobDetails.jobType,
                    language: jobDetails.sourceLanguage,
                    date: jobDetails.expectedDeadline,
                    countryCode: clientDetails.adminCountryCode,
                    serviceAddress:
                      jobDetails.location === null ||
                        jobDetails.location === undefined ||
                        jobDetails.location === ""
                        ? "N/A"
                        : jobDetails.location,
                    siteContant:
                      jobDetails.siteContact === null ||
                        jobDetails.siteContact === undefined ||
                        jobDetails.siteContact === ""
                        ? "N/A"
                        : jobDetails.siteContact,
                    consumer: jobDetails.consumer,
                    notesByClient: jobDetails.noteByClient,
                    notesBy7C: jobDetails.noteFor7C,
                    quoteId: quoteId,
                    targetAdience:
                      jobDetails.targetAudience === null ||
                        jobDetails.targetAudience === undefined ||
                        jobDetails.targetAudience === ""
                        ? "N/A"
                        : jobDetails.targetAudience,
                    isDtp: jobDetails.isDtp,
                    location:
                      jobDetails.location === null ||
                        jobDetails.location === undefined ||
                        jobDetails.location === ""
                        ? "N/A"
                        : jobDetails.location,
                    dateTime: jobDetails.scheduleDate,
                    notesFromClient: jobDetails.noteByClient,
                    deliveryType: clientDetails.isOutOfTown === 1 ? "OUT OF TOWN" : "IN TOWN",
                    duration: jobDetails.duration,
                    clientIndustryType: clientDetails.industtryType,
                    translationRate: quoteInfo.fee,
                    taskList: taskDetails,
                    taskData: arr,
                    rushFee: quoteInfo.rushFee,
                    additionalTranslationCharges: additionalTranslationCharges,
                    // totalAmount: quoteInfo.total,
                    newTaskList: newTaskList,
                    allLanguageArr: allLanguageArr,
                    isLoad: false,
                  });
                }
              });
            }
          }
        }
      }
    });
  };

  // listApi = async (data) => {
  //   const res = await ApiCall("fetchapprovedclientcontactlist", data);
  //   console.log("resData::::", res);
  //   if (
  //     res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
  //     res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  //   ) {
  //     const decodeData = Decoder.decode(res.data.payload);
  //     console.log("Payload data>>>", decodeData);
  //     let listDetails = decodeData.data.clientContactDetailsList;
  //     let totalPage = Math.ceil(decodeData.data.totalCount / this.state.limit);
  //     console.log("Total Page>>>", listDetails);
  //     this.setState({
  //       listData: decodeData.data.clientContactDetailsList,
  //       total_page: totalPage,
  //     });
  //   }
  // };

  getAllSourceDocuments = async (data) => {
    let allSourceDocuments = [],
      allTranslatedList = [],
      allVendorReviewdocs = [],
      allClientReviewDocs = [],
      allFinalDocs = [];
    let res = await ApiCall("getAdminTranslationDocs", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      consoleLog("AllSourceDocs::", payload.data);
      if (payload.data.source.length > 0) {
        payload.data.source.map((doc) => {
          let fileArr = [],
            actionArr = [];
          if (Object.keys(payload.data.action).length > 0 && doc.taskNo in payload.data.action) {
            // consoleLog("DOcument Action::", payload.data.action[doc.taskNo])

            payload.data.action[doc.taskNo].map((ac) => {
              let textObj = {
                label: "Send to " + ac.name + " for " + ac.serviceName,
                value: "Send to " + ac.name + " for " + ac.serviceName,
                userId: ac.userId,
                name: ac.name,
                taskId: ac.taskId,
                requestId: ac.requestId,
                taskNo: ac.taskNo,
                subTaskNo: ac.subTaskNo,
                serviceId: ac.serviceId,
                serviceName: ac.serviceName,
                bidId: ac.bidId,
                flag: "vendor",
              }
              actionArr.push(textObj);
            })
          }
          fileArr = doc.docPath.split("/");
          allSourceDocuments.push({
            id: doc.id,
            filename: fileArr[2],
            serviceName: doc.serviceName,
            requestId: doc.requestId,
            serviceId: doc.serviceId,
            taskId: doc.taskId,
            taskNo: doc.taskNo,
            subTaskNo: doc.subTaskNo,
            revisionNo: doc.revisionNo,
            docName: doc.docName,
            docPath: doc.docPath,
            uploadedBy: doc.uploadedBy,
            uploadedByName: doc.uploadedByName,
            assignedTo: doc.assignedTo,
            assignedName: doc.assignedName,
            assignedTaskId: doc.assignedTaskId,
            directory: doc.directory,
            notes: doc.notes,
            action: doc.action,
            lastUpdated: doc.lastUpdated,
            bidId: doc.bidId,
            action: doc.action,
            actionArr: actionArr,
            selectedAction: {},
            userNotes: doc.userNotes == null || doc.userNotes == undefined || doc.userNotes == "" ? "" : doc.userNotes,
            flag: "source",
          })
        })
      }

      if (payload.data.vendor.length > 0) {
        payload.data.vendor.map((doc) => {
          let fileArr = [],
            actionArr = [];
          if (Object.keys(payload.data.action).length > 0) {
            payload.data.action[doc.taskNo].map((ac) => {
              let textObj = {
                label: "Send to " + ac.name + " for " + ac.serviceName,
                value: "Send to " + ac.name + " for " + ac.serviceName,
                userId: ac.userId,
                name: ac.name,
                taskId: ac.taskId,
                requestId: ac.requestId,
                taskNo: ac.taskNo,
                subTaskNo: ac.subTaskNo,
                serviceId: ac.serviceId,
                serviceName: ac.serviceName,
                bidId: ac.bidId,
                flag: "vendor",
              }
              actionArr.push(textObj);
            })
          }
          actionArr.push({
            label: "Send to client review",
            value: "Send to client review",
            // userId: ac.userId,
            // name: ac.name,
            taskId: doc.taskId,
            requestId: doc.requestId,
            taskNo: doc.taskNo,
            subTaskNo: doc.subTaskNo,
            serviceId: doc.serviceId,
            // serviceName: ac.serviceName,
            bidId: doc.bidId,
            flag: "client",
          })
          fileArr = doc.docPath.split("/");
          allVendorReviewdocs.push({
            id: doc.id,
            filename: fileArr[2],
            serviceName: doc.serviceName,
            requestId: doc.requestId,
            serviceId: doc.serviceId,
            taskId: doc.taskId,
            taskNo: doc.taskNo,
            subTaskNo: doc.subTaskNo,
            revisionNo: doc.revisionNo,
            docName: doc.docName,
            docPath: doc.docPath,
            uploadedBy: doc.uploadedBy,
            uploadedByName: doc.uploadedByName,
            assignedTo: doc.assignedTo,
            assignedName: doc.assignedName,
            assignedTaskId: doc.assignedTaskId,
            directory: doc.directory,
            notes: doc.notes,
            action: doc.action,
            lastUpdated: doc.lastUpdated,
            bidId: doc.bidId,
            action: doc.action,
            actionArr: actionArr,
            selectedAction: {},
            userNotes: doc.userNotes == null || doc.userNotes == undefined || doc.userNotes == "" ? "" : doc.userNotes,
            flag: "vendor",
          })
        })
      }

      if (payload.data.client.length > 0) {
        payload.data.client.map((doc) => {
          let fileArr = [],
            actionArr = [];
          if (Object.keys(payload.data.action).length > 0) {
            payload.data.action[doc.taskNo].map((ac) => {
              let textObj = {
                label: "Send to " + ac.name + " for " + ac.serviceName,
                value: "Send to " + ac.name + " for " + ac.serviceName,
                userId: ac.userId,
                name: ac.name,
                taskId: ac.taskId,
                requestId: ac.requestId,
                taskNo: ac.taskNo,
                subTaskNo: ac.subTaskNo,
                serviceId: ac.serviceId,
                serviceName: ac.serviceName,
                bidId: ac.bidId,
                flag: "vendor",
              }
              actionArr.push(textObj);
            })
          }
          fileArr = doc.docPath.split("/");
          allClientReviewDocs.push({
            id: doc.id,
            filename: fileArr[2],
            serviceName: doc.serviceName,
            requestId: doc.requestId,
            serviceId: doc.serviceId,
            taskId: doc.taskId,
            taskNo: doc.taskNo,
            subTaskNo: doc.subTaskNo,
            revisionNo: doc.revisionNo,
            docName: doc.docName,
            docPath: doc.docPath,
            uploadedBy: doc.uploadedBy,
            uploadedByName: doc.uploadedByName,
            assignedTo: doc.assignedTo,
            assignedName: doc.assignedName,
            assignedTaskId: doc.assignedTaskId,
            directory: doc.directory,
            notes: doc.notes,
            action: doc.action,
            lastUpdated: doc.lastUpdated,
            bidId: doc.bidId,
            action: doc.action,
            actionArr: actionArr,
            selectedAction: {},
            userNotes: doc.userNotes == null || doc.userNotes == undefined || doc.userNotes == "" ? "" : doc.userNotes,
            flag: "client",
          })
        })
      }

      if (payload.data.final.length > 0) {
        payload.data.final.map((doc) => {
          let fileArr = [],
            actionArr = [];
          // if (Object.keys(payload.data.action).length > 0) {
          //   payload.data.action[doc.taskNo].map((ac) => {
          //     let textObj = {
          //       label: "Send to " + ac.name + " for " + ac.serviceName,
          //       value: "Send to " + ac.name + " for " + ac.serviceName,
          //       userId: ac.userId,
          //       name: ac.name,
          //       taskId: ac.taskId,
          //       requestId: ac.requestId,
          //       taskNo: ac.taskNo,
          //       subTaskNo: ac.subTaskNo,
          //       serviceId: ac.serviceId,
          //       serviceName: ac.serviceName,
          //       bidId: ac.bidId,
          //       flag: "final",
          //     }
          //     actionArr.push(textObj);
          //   })
          // }
          fileArr = doc.docPath.split("/");
          allFinalDocs.push({
            id: doc.id,
            filename: fileArr[2],
            serviceName: doc.serviceName,
            requestId: doc.requestId,
            serviceId: doc.serviceId,
            taskId: doc.taskId,
            taskNo: doc.taskNo,
            subTaskNo: doc.subTaskNo,
            revisionNo: doc.revisionNo,
            docName: doc.docName,
            docPath: doc.docPath,
            uploadedBy: doc.uploadedBy,
            uploadedByName: doc.uploadedByName,
            assignedTo: doc.assignedTo,
            assignedName: doc.assignedName,
            assignedTaskId: doc.assignedTaskId,
            directory: doc.directory,
            notes: doc.notes,
            action: doc.action,
            lastUpdated: doc.lastUpdated,
            bidId: doc.bidId,
            action: doc.action,
            actionArr: [],
            selectedAction: {},
            userNotes: doc.userNotes == null || doc.userNotes == undefined || doc.userNotes == "" ? "" : doc.userNotes,
            flag: "final",
          })
        })
      }
      // if (payload.data.translatedList) {
      //   allTranslatedList = payload.data.translatedList;
      // }
      // if (payload.data.vendorReviewList) {
      //   allVendorReviewdocs = payload.data.vendorReviewList;
      // }
      // if (payload.data.clientReviewList) {
      //   allClientReviewDocs = payload.data.clientReviewList;
      // }
      // if (payload.data.finalList) {
      //   allFinalDocs = payload.data.finalList;
      // }

      this.setState({
        allSourceDocuments: allSourceDocuments,
        allTranslatedList: [],
        allVendorReviewdocs: allVendorReviewdocs,
        allClientReviewDocs: allClientReviewDocs,
        allFinalDocs: allFinalDocs,
      });
    }
  };

  onTranslationUnitCostChange = (e) => {
    let val = zipValidate(e.target.value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        translationUnitCost: val,
      });
    }
  };
  onTranslationRateChange = (e) => {
    let val = zipValidate(e.target.value);
    if (Regex.ONLY_15DIGITS_REGEX.test(+val)) {
      this.setState({
        translationRate: val,
      });
    }
  };

  onAppointmentChange = (data) => {
    this.setState({
      appointmentTypeData: data,
    });
  };

  onSourceLangChange = (data) => {
    this.setState({
      sourceLangData: data,
    });
  };

  onTargetLangChange = (data) => {
    this.setState({
      targetLangData: data,
    });
  };

  onParticularChange = (e, index) => {
    let amt = this.state.additionalTranslationCharges;
    for (let i = 0; i < this.state.additionalTranslationCharges.length; i++) {
      if (i === index) {
        amt[i].title = e.target.value;
      }
    }

    this.setState({
      additionalTranslationCharges: amt,
    });
  };

  onParticularAmountChange = (e, index) => {
    let data = e.target.value;
    var valid = !isNaN(data);

    let amount = e.target.value === "" ? 0 : parseInt(e.target.value);
    // consoleLog("Particulars array amount", amount)

    let amt = this.state.additionalTranslationCharges,
      totalAmt = 0,
      allTranslationSum = 0,
      sum = 0;
    if (valid) {
      this.state.taskData.map((aa) => {
        allTranslationSum = allTranslationSum + (aa.SubCost)
      })
      for (let i = 0; i < amt.length; i++) {
        if (i === index) {
          amt[i].amt = amount.toString();
        }

        sum = sum + parseFloat(amt[i].amt);
      }
      totalAmt = parseFloat(sum) + parseFloat(allTranslationSum);
    }

    this.setState({
      additionalTranslationCharges: amt,
      totalParticularAmt: sum,
      totalAmount: totalAmt,
    });
  };

  addParticularField = () => {
    let arr = this.state.additionalTranslationCharges;
    // particularItem = "",
    // particularAmnt = 0;
    // for (let i = 0; i < this.state.particularsArr.length; i++) {
    arr.push({
      title: this.state.particular,
      // particularAmt: parseInt(this.state.particularAmt),
      amt: this.state.particularAmt,
    });

    this.setState({
      additionalTranslationCharges: arr,
    });
  };


  onDeleteParticulars = (index) => {
    let particularArray = this.state.additionalTranslationCharges;

    let arr = [],
      amt = 0,
      allTranslationSum = 0,
      particularAmt = 0;
    for (let i = 0; i < particularArray.length; i++) {
      if (i != index) {
        particularAmt = particularAmt + parseFloat(particularArray[i].amt);
        arr.push(particularArray[i]);
      }
    }
    this.state.taskData.map((aa) => {
      allTranslationSum = allTranslationSum + (aa.SubCost)
    })
    amt =
      amt +
      particularAmt +
      parseFloat(allTranslationSum)

    this.setState({
      additionalTranslationCharges: arr,
      totalAmount: amt,
    });
  };


  onCreateQuote = async () => {
    let mainData = this.props.location;
    let preData = mainData.state;
    let errorCount = 0;

    this.state.additionalTranslationCharges.map((aa) => {
      if (aa.title === "") {
        toast.error("Please input particulars on additional charges !!!");
        errorCount++;
      }
    })



    if (errorCount === 0) {
      let data = {
        requestId: preData.id,
        fee: this.state.interpretationFee,
        total: this.state.totalAmount,
        rushFee: this.state.rushFee,
        additionalFee: this.state.particularsArr,
        additionalTranslationCharges: this.state.additionalTranslationCharges
      };
      consoleLog("CreateQuote DAta ::", data)
      // let res = await ApiCall("createQuote", data);
      // if (
      //   res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      //   res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      // ) {
      //   toast.success(AlertMessage.MESSAGE.JOB.QUOTE_SEND, {
      //     hideProgressBar: true,
      //   });
      //   return history.push("/adminViewAllJobs");
      // } else{
      //   toast.error("Error Occured!!!");
      // }
    }
  };

  // handleWordQty = (e, i) => {
  //   let arr = this.state.taskData;
  //   let val = 0;
  //   if (
  //     e.target.value !== "" &&
  //     !isNaN(e.target.value) &&
  //     e.target.value !== 0
  //   ) {
  //     val = parseFloat(e.target.value);
  //   } else {
  //     val = 0;
  //   }
  //   arr[i].wordCountQty = val;
  //   arr[i].wordCountRate = val * arr[i].wordCountCost;
  //   arr[i].SubCost = arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate;
  //   this.setState({
  //     taskData: arr
  //   })
  //   this.getTotalAmount();
  // }

  handleWordCost = (e, i) => {
    let arr = this.state.taskData;
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      val = parseFloat(e.target.value);
    } else {
      val = 0;
    }
    arr[i].wordCountCost = val;
    arr[i].wordCountRate = val * arr[i].wordCountQty;
    arr[i].SubCost = arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate;
    this.setState({
      taskData: arr
    })
    this.getTotalAmount();
  }

  handleDtpQty = (e, i) => {
    let arr = this.state.taskData;
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      val = parseFloat(e.target.value);
    } else {
      val = 0;
    }
    arr[i].dtpQty = val;
    arr[i].dtpRate = val * arr[i].dtpCost;
    arr[i].SubCost = arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate;
    this.setState({
      taskData: arr
    })
    this.getTotalAmount();
  }

  handleDtpUnitCost = (e, i) => {
    let arr = this.state.taskData;
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      val = parseFloat(e.target.value);
    } else {
      val = 0;
    }
    arr[i].dtpCost = val;
    arr[i].dtpRate = val * arr[i].dtpQty;
    arr[i].SubCost = arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate;
    this.setState({
      taskData: arr
    })
    this.getTotalAmount();
  }

  handleRushUnit = (e, i) => {
    let arr = this.state.taskData;
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      val = parseFloat(e.target.value);
    } else {
      val = 0;
    }
    arr[i].rushFeeUnit = val;
    arr[i].rushFeeRate = val * arr[i].rushFeeCost;
    arr[i].SubCost = arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate;
    this.setState({
      taskData: arr
    })
    this.getTotalAmount();
  }

  handleRushUnitCost = (e, i) => {
    let arr = this.state.taskData;
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      val = parseFloat(e.target.value);
    } else {
      val = 0;
    }
    arr[i].rushFeeCost = val;
    arr[i].rushFeeRate = val * arr[i].rushFeeUnit;
    arr[i].SubCost = arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate;
    this.setState({
      taskData: arr
    });
    this.getTotalAmount();
  }

  getTotalAmount = () => {
    let arr = this.state.taskData,
      totalAmt = 0;

    arr.map((data, i) => {
      totalAmt = totalAmt + (data.SubCost);
    });

    this.setState({
      totalAmount: totalAmt
    });
  }

  // OnSendQuote = async () => {
  //   let errorCount = 0;

  //   this.state.additionalTranslationCharges.map((aa) => {
  //     if (aa.title === "") {
  //       toast.error("Please input particulars on additional charges !!!");
  //       errorCount++;
  //     }
  //   })

  //   if (errorCount === 0) {
  //     let finalData = {
  //       requestId: this.state.requestId,
  //       total: this.state.totalAmount.toString(),
  //       taskDetails: this.state.taskData,
  //       additionalFee: this.state.additionalTranslationCharges
  //     }
  //     // consoleLog("Final Quote Send Data", finalData);
  //     let res = await ApiCall("createQuoteTranslation", finalData);
  //     if (
  //       res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
  //       res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  //     ) {
  //       toast.success(AlertMessage.MESSAGE.JOB.QUOTE_SEND);
  //       return history.push("/adminProjectList");
  //     }
  //   }
  // }

  onDownload = (pos) => {
    this.handleMenuClose();
    // window.open(
    //   IMAGE_PATH_ONLY + this.state.taskList[pos].docZipPath,
    //   "_blank"
    // );
    var file_path = IMAGE_PATH_ONLY + this.state.taskList[pos].docZipPath;
    var a = document.createElement('a');
    a.href = file_path;
    a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  onDownloadSourceDocs = (pos) => {
    // this.handleMenuClose();
    // window.open(
    //   IMAGE_PATH_ONLY + this.state.allSourceDocuments[pos].filePath,
    //   "_blank"
    // );
    var file_path = IMAGE_PATH_ONLY + this.state.allSourceDocuments[pos].docPath;
    var a = document.createElement('a');
    a.href = file_path;
    a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  onDownloadTranslatedDocs = (pos) => {
    this.handleMenuClose();
    window.open(
      IMAGE_PATH_ONLY + this.state.allTranslatedList[pos].filePath,
      "_blank"
    );
  };

  onDownloadVendorReviewDocs = (pos) => {
    // this.handleMenuClose();
    // window.open(
    //   IMAGE_PATH_ONLY + this.state.allVendorReviewdocs[pos].filePath,
    //   "_blank"
    // );
    var file_path = IMAGE_PATH_ONLY + this.state.allVendorReviewdocs[pos].docPath;
    var a = document.createElement('a');
    a.href = file_path;
    a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  onDownloadClientReviewDocs = (pos) => {
    // this.handleMenuClose();
    // window.open(
    //   IMAGE_PATH_ONLY + this.state.allClientReviewDocs[pos].filePath,
    //   "_blank"
    // );
    var file_path = IMAGE_PATH_ONLY + this.state.allClientReviewDocs[pos].docPath;
    var a = document.createElement('a');
    a.href = file_path;
    a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  onDownloadFinalDocs = (pos) => {
    // this.handleMenuClose();
    // window.open(
    //   IMAGE_PATH_ONLY + this.state.allFinalDocs[pos].filePath,
    //   "_blank"
    // );
    var file_path = IMAGE_PATH_ONLY + this.state.allFinalDocs[pos].docPath;
    var a = document.createElement('a');
    a.href = file_path;
    a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  handleWordQty = (e, i) => {
    let arr = this.state.taskData;
    let targetLanArr = [];
    targetLanArr = arr[i].targetLanguage.split(",");
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      val = parseFloat(e.target.value)
    } else {
      val = 0;
    }
    arr[i].wordCountQty = val;
    arr[i].wordCountRate = val * arr[i].wordCountCost;
    arr[i].SubCost = ((arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate) * parseInt(targetLanArr.length)).toFixed(2);
    this.setState({
      taskData: arr,
    });
    this.getTotalAmount();
  };

  handleWordCost = (e, i) => {
    let arr = this.state.taskData;
    let targetLanArr = [];
    targetLanArr = arr[i].targetLanguage.split(",");
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      if (decimalValue(e.target.value)) {
        val = e.target.value;
      } else {
        return false;
      }
      // val = parseFloat(e.target.value);
    } else {
      val = 0;
    }
    arr[i].wordCountCost = val;
    arr[i].wordCountRate = val * arr[i].wordCountQty;
    arr[i].SubCost = ((arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate) * parseInt(targetLanArr.length)).toFixed(2);
    this.setState({
      taskData: arr,
    });
    this.getTotalAmount();
  };

  handleDtpQty = (e, i) => {
    let arr = this.state.taskData;
    let targetLanArr = [];
    targetLanArr = arr[i].targetLanguage.split(",");
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      val = parseFloat(e.target.value);
    } else {
      val = 0;
    }
    arr[i].dtpQty = val;
    arr[i].dtpRate = val * arr[i].dtpCost;
    arr[i].SubCost = ((arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate) * parseInt(targetLanArr.length)).toFixed(2);
    this.setState({
      taskData: arr,
    });
    this.getTotalAmount();
  };

  handleDtpUnitCost = (e, i) => {
    let arr = this.state.taskData;
    let targetLanArr = [];
    targetLanArr = arr[i].targetLanguage.split(",");
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      if (decimalValue(e.target.value)) {
        val = e.target.value;
      } else {
        return false;
      }
      // val = parseFloat(e.target.value);
    } else {
      val = 0;
    }
    arr[i].dtpCost = val;
    arr[i].dtpRate = val * arr[i].dtpQty;
    arr[i].SubCost = ((arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate) * parseInt(targetLanArr.length)).toFixed(2);
    this.setState({
      taskData: arr,
    });
    this.getTotalAmount();
  };

  handleRushUnit = (e, i) => {
    let arr = this.state.taskData;
    let targetLanArr = [];
    targetLanArr = arr[i].targetLanguage.split(",");
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      val = parseFloat(e.target.value);
    } else {
      val = 0;
    }
    arr[i].rushFeeUnit = val;
    arr[i].rushFeeRate = val * arr[i].rushFeeCost;
    arr[i].SubCost = ((arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate) * parseInt(targetLanArr.length)).toFixed(2);
    this.setState({
      taskData: arr,
    });
    this.getTotalAmount();
  };

  handleRushUnitCost = (e, i) => {
    let arr = this.state.taskData;
    let targetLanArr = [];
    targetLanArr = arr[i].targetLanguage.split(",");
    let val = 0;
    if (
      e.target.value !== "" &&
      !isNaN(e.target.value) &&
      e.target.value !== 0
    ) {
      if (decimalValue(e.target.value)) {
        val = e.target.value;
      } else {
        return false;
      }
      // val = parseFloat(e.target.value);
    } else {
      val = 0;
    }
    arr[i].rushFeeCost = val;
    arr[i].rushFeeRate = val * arr[i].rushFeeUnit;
    arr[i].SubCost = ((arr[i].wordCountRate + arr[i].dtpRate + arr[i].rushFeeRate) * parseInt(targetLanArr.length)).toFixed(2);
    this.setState({
      taskData: arr,
    });
    this.getTotalAmount();
  };

  getTotalAmount = () => {
    let arr = this.state.taskData,
      totalAmt = 0;

    arr.map((data, i) => {
      totalAmt = totalAmt + data.SubCost;
    });

    this.setState({
      totalAmount: parseFloat(totalAmt),
    });
  };

  OnSendQuote = async () => {
    let finalData = {
      requestId: this.state.requestId,
      total: this.state.totalAmount.toString(),
      taskDetails: this.state.taskData,
      additionalFee: this.state.additionalTranslationCharges
    };
    // consoleLog("Final Quote Send Data", finalData);
    let res = await ApiCall("createQuoteTranslation", finalData);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.JOB.QUOTE_SEND);
      this.load();
    } else {
      toast.error(res.message);
    }
  };

  // acceptClient = async () => {
  //   let data = {
  //     clientId: this.state.clientId,
  //     requestId: this.state.requestId
  //   }
  //   let res = await ApiCall("acceptClientQuote", data);
  //   if (
  //     res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
  //     res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  //   ) {
  //     toast.success(AlertMessage.MESSAGE.JOB.QUOTE_ACCEPTED_BY_CLIENT);
  //     setTimeout(
  //       function () {
  //         return history.push("/adminProjectList")
  //       }
  //         .bind(this),
  //       1000
  //     );
  //   }
  // }

  allVendorCheck = (e) => {
    let arr = this.state.listData;
    let brr = [];
    if (e.target.checked) {
      arr.map((data) => {
        data.isQuoteSent = 1;
        brr.push(data.userId);
      });
      this.setState({
        allChecked: true,
        listData: arr,
        vendorAssigned: brr,
      });
    } else {
      arr.map((data) => {
        data.isQuoteSent = 0;
      });
      brr = [];
      this.setState({
        allChecked: false,
        listData: arr,
        vendorAssigned: brr,
      });
    }
  };

  listChecked = (e, i) => {
    let arr = this.state.listData,
      brr = this.state.vendorAssigned;
    if (e.target.checked) {
      arr[i].isQuoteSent = 1;
      brr.push(arr[i].userId);
      this.setState({
        vendorAssigned: brr,
      });
    } else {
      arr[i].isQuoteSent = 0;
      brr.map((data, k) => {
        if (data === arr[i].userId) {
          brr.splice(k, 1);
        }
      });
      consoleLog("Brr >>> ", brr)
      this.setState({
        vendorAssigned: brr,
      });
    }
  };

  handleVendorAssign = async () => {
    let data = {
      requestId: this.state.requestId,
      vendorId: this.state.vendorAssigned,
      taskId: this.state.vendorListModalDetails.taskId,
      taskNo: this.state.vendorListModalDetails.taskNo.toString(),
      subTaskNo: this.state.vendorListModalDetails.subTaskNo.toString(),
    };
    let res = await ApiCall("sentTranslationOfferToVendor", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.closeVendorListModal();
      toast.success(AlertMessage.MESSAGE.JOB.OFFER_SENT_SUCCESS);
      // return history.push("/adminProjectList");
      window.scrollTo(0, 0);
      this.setState({
        isLoad: true
      })
      this.load();
    }
  };

  // openViewModal = () => {
  //   document.getElementById("backdrop").style.display = "block";
  //   document.getElementById("viewModal").style.display = "block";
  //   document.getElementById("viewModal").classList.add("show");
  // };
  // closeViewModal = () => {
  //   document.getElementById("backdrop").style.display = "none";
  //   document.getElementById("viewModal").style.display = "none";
  //   document.getElementById("viewModal").classList.remove("show");
  // };

  handleBidModal = async (id) => {
    let arr = this.state.taskList,
      obj = {};
    arr.map((data) => {
      if (data.taskId === id) {
        obj = {
          // requestId: this.state.requestId,
          taskId: id
        };
        this.setState({
          bidtaskType: data.serviceName,
          bidTask: data.sourceLanguage + ">" + data.targetLanguage,
        });
        // consoleLog("Bid View Request ::", obj);
      }
    });
    let res = await ApiCall("getBidReqStat", obj);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      // consoleLog("Bid Request Details : ", payload.data);
      let tableWidth = 50 / payload.data.vendorList.length;
      // consoleLog("WidthLength ::", tableWidth)
      this.setState({
        bidVendorDetails: payload.data.vendorList,
        bidWidth: tableWidth + "%",
      });
      this.openBidModal();
    }
  };

  handleBidModalForSubTask = async (id, i, j) => {
    let arr = this.state.taskList[i].subTask,
      obj = {};
    arr.map((data) => {
      if (data.taskId === id) {
        obj = {
          // requestId: this.state.requestId,
          taskId: id
        };
        this.setState({
          bidtaskType: data.serviceName,
          bidTask: data.sourceLanguage + ">" + data.targetLanguage,
        });
        // consoleLog("Bid View Request ::", obj);
      }
    });
    let res = await ApiCall("getBidReqStat", obj);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      // consoleLog("Bid Request Details : ", payload.data);
      let tableWidth = 50 / payload.data.vendorList.length;
      // consoleLog("WidthLength ::", tableWidth)
      this.setState({
        bidVendorDetails: payload.data.vendorList,
        bidWidth: tableWidth + "%",
      });
      this.openBidModal();
    }
  };
  openBidModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("bid-modal").style.display = "block";
    document.getElementById("bid-modal").classList.add("show");
  };
  closeBidModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("bid-modal").style.display = "none";
    document.getElementById("bid-modal").classList.remove("show");
  };

  vendorAssigned = async (id) => {
    let apiObj = {
      requestId: this.state.requestId,
      vendorId: this.state.bidVendorDetails[id].userId,
      taskId: this.state.bidVendorDetails[id].taskId,
      // taskNumber: this.state.bidVendorDetails[id].taskNo,
      bidId: this.state.bidVendorDetails[id].bidId,
    };
    // consoleLog("Assigned Vendor data", apiObj);
    let res = await ApiCall("assignVendorForTranslationV2", apiObj);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.JOB.VENDOR_ASSIGNED_SUCCESS);
      this.closeBidModal();
      // setTimeout(
      //   function () {
      //     return history.push("/adminProjectList");
      //   }.bind(this),
      //   1000
      // );
      window.scrollTo(0, 0);
      this.setState({
        isLoad: true
      })
      this.load();
    }
  };


  //................funct for menuBtn on click................
  menuBtnhandleClick = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
      anchorEl1: null,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleClick = () => {
    this.setState({
      open: true,
    });
  };
  openReviewModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("review-modal").style.display = "block";
    document.getElementById("review-modal").classList.add("show");
  };
  closeReviewModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("review-modal").style.display = "none";
    document.getElementById("review-modal").classList.remove("show");
  };
  openVendorListModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("vendor_list_modal").style.display = "block";
    document.getElementById("vendor_list_modal").classList.add("show");
  };
  closeVendorListModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("vendor_list_modal").style.display = "none";
    document.getElementById("vendor_list_modal").classList.remove("show");
  };

  onReviewNoteChange = (e) => {
    this.setState({
      reviewNote: e.target.value,
    });
  };

  sentUnderReview = async () => {
    this.closeReviewModal();
    let obj = {
      documentId: this.state.reviewDocId,
      note: this.state.reviewNote,
    };
    // consoleLog("ObjSend review API ::", obj)
    let res = await ApiCall("setVendorReviewDocument", obj);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success("Document under reviewed");
      this.setState({
        reviewDocId: "",
        reviewNote: "",
      });

      let detailData = {
        requestId: this.state.requestId,
      };
      this.getAllSourceDocuments(detailData);
    }
  };

  sentToClient = async (docid) => {
    this.handleMenuClose();
    let obj = {
      documentId: docid,
    };
    consoleLog("ObjSend sentClient API ::", obj);
    let res = await ApiCall("sentDocToClient", obj);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success("Document sent to client");

      let detailData = {
        requestId: this.state.requestId,
      };
      this.getAllSourceDocuments(detailData);
    }
  };

  openRiview = (id) => {
    this.handleMenuClose();
    this.setState({
      reviewDocId: id,
    });
    this.openReviewModal();
  };

  translationServiceTypeChange = (value, i, j) => {
    let arr = this.state.newTaskList;
    arr[i].subTask[j].selectedTask = value;
    arr[i].subTask[j].serviceName = value.label;
    arr[i].subTask[j].serviceId = value.value;
    this.setState({
      newTaskList: arr
    })

  };

  sourceLanguageChangeTask = (value, i, j) => {
    let arr = this.state.newTaskList;
    arr[i].subTask[j].selectedSourceLanguage = value;
    arr[i].subTask[j].sourceLanguage = value.label;
    arr[i].subTask[j].sourceLanguageId = value.value;
    this.setState({
      newTaskList: arr
    })
  };

  targetLanguageChangeTask = (value, i, j) => {
    let lanArrId = [],
      lanArrName = [];
    value.map((ll) => {
      lanArrId.push(ll.value);
      lanArrName.push(ll.label);
    })
    let arr = this.state.newTaskList;
    arr[i].subTask[j].selectedTargetLangugae = value;
    arr[i].subTask[j].targetLanguage = lanArrName.join(",");
    arr[i].subTask[j].targetLanguageId = lanArrId.join(",");
    this.setState({
      newTaskList: arr
    })
  };

  dueDateChangeTask = (date, id) => {
    let arr = this.state.newTaskList;
    arr[id].dueDate = SetUSAdateFormat(date);
    this.setState({
      newTaskList: arr
    })
  };

  dueDateChangeSubTask = (date, i, j) => {
    let arr = this.state.newTaskList;
    arr[i].subTask[j].dueDate = SetUSAdateFormat(date);
    this.setState({
      newTaskList: arr
    })
  };

  noteChangeTask = (e, i, j) => {
    let arr = this.state.newTaskList;
    arr[i].subTask[j].notes = e.target.value;
    this.setState({
      newTaskList: arr
    })
  };

  addSubtask = (pos) => {
    let arr = this.state.newTaskList;
    arr.map((data, i) => {
      if (i == pos) {
        let len = data.subTask.length + 1;
        data.subTask.push({
          id: i + 1 + "." + len,
          taskId: "0",
          taskNo: data.taskNo,
          subTaskNo: len,
          targetLanguageId: data.targetLanguageId,
          selectedTargetLangugae: data.selectedTargetLangugae,
          sourceLanguageId: data.sourceLanguageId,
          selectedSourceLanguage: data.selectedSourceLanguage,
          selectedTask: data.selectedTask,
          sourceLanguage: data.sourceLanguage,
          serviceName: data.serviceName,
          serviceId: data.serviceId,
          targetLanguage: data.targetLanguage,
          dueDate: data.dueDate,
          documentName: data.documentName,
          docZipPath: data.docZipPath,
          docDataArr: data.docDataArr,
          wordCount: data.wordCount,
          notes: "",
          vendors: [],
          isDisabled: false,
          bidCounter: data.bidCounter,
          vendor: ""
        });
      }
    });
    this.setState({
      newTaskList: arr,
    });
  };

  // .....................new source doc functionality...........................

  onFileChange = (index) => (e) => {
    this.state.dummySourceDoc[index].fileName = e.target.value;
    this.setState({
      dummySourceDoc: this.state.dummySourceDoc,
    });
  };
  onTaskIdChange = (index) => (e) => {
    this.state.dummySourceDoc[index].taskId = e.target.value;
    this.setState({
      dummySourceDoc: this.state.dummySourceDoc,
    });
  };
  onNotesChange = (index) => (e) => {
    this.state.dummySourceDoc[index].notesToVendor = e.target.value;
    this.setState({
      dummySourceDoc: this.state.dummySourceDoc,
    });
  };
  onActionChange = () => { };
  onSubmitSourceDoc = () => { };

  onResetSourceDoc = () => {
    this.state.dummySourceDoc.map((obj) => {
      obj.fileName = "";
      obj.taskId = "";
      obj.notesToVendor = "";
    });
    this.setState({
      dummySourceDoc: this.state.dummySourceDoc,
    });
  };

  // .....................new translated doc functionality...........................

  onFileChange_Translated = (index) => (e) => {
    this.state.dummyTranslatedDoc[index].fileName = e.target.value;
    this.setState({
      dummyTranslatedDoc: this.state.dummyTranslatedDoc,
    });
  };
  onTaskIdChange_Translated = (index) => (e) => {
    this.state.dummyTranslatedDoc[index].taskId = e.target.value;
    this.setState({
      dummyTranslatedDoc: this.state.dummyTranslatedDoc,
    });
  };
  onNotesChange_Translated = (index) => (e) => {
    this.state.dummyTranslatedDoc[index].notesToVendor = e.target.value;
    this.setState({
      dummyTranslatedDoc: this.state.dummyTranslatedDoc,
    });
  };
  onActionChange = () => { };

  onSubmitTranslatedDoc = () => { };

  onResetTranslatedDoc = () => {
    this.state.dummyTranslatedDoc.map((obj) => {
      obj.fileName = "";
      obj.taskId = "";
      obj.notesToVendor = "";
    });
    this.setState({
      dummyTranslatedDoc: this.state.dummyTranslatedDoc,
    });
  };
  // .....................new vendor review doc functionality...........................

  onFileChange_VendorReview = (index) => (e) => {
    this.state.dummyVendorReviewDoc[index].fileName = e.target.value;
    this.setState({
      dummyVendorReviewDoc: this.state.dummyVendorReviewDoc,
    });
  };
  onTaskIdChange_VendorReview = (index) => (e) => {
    this.state.dummyVendorReviewDoc[index].taskId = e.target.value;
    this.setState({
      dummyVendorReviewDoc: this.state.dummyVendorReviewDoc,
    });
  };
  onNotesChange_VendorReview = (index) => (e) => {
    this.state.dummyVendorReviewDoc[index].notesToVendor = e.target.value;
    this.setState({
      dummyVendorReviewDoc: this.state.dummyVendorReviewDoc,
    });
  };
  onActionChange = () => { };

  onSubmitVendorReviewDoc = () => { };

  onResetVendorReviewDoc = () => {
    this.state.dummyVendorReviewDoc.map((obj) => {
      obj.fileName = "";
      obj.taskId = "";
      obj.notesToVendor = "";
    });
    this.setState({
      dummyVendorReviewDoc: this.state.dummyVendorReviewDoc,
    });
  };

  // .....................new client review doc functionality...........................

  onFileChange_ClientReview = (index) => (e) => {
    this.state.dummyClientReviewDoc[index].fileName = e.target.value;
    this.setState({
      dummyClientReviewDoc: this.state.dummyClientReviewDoc,
    });
  };
  onTaskIdChange_ClientReview = (index) => (e) => {
    this.state.dummyClientReviewDoc[index].taskId = e.target.value;
    this.setState({
      dummyClientReviewDoc: this.state.dummyClientReviewDoc,
    });
  };
  onNotesChange_ClientReview = (index) => (e) => {
    this.state.dummyClientReviewDoc[index].notesToVendor = e.target.value;
    this.setState({
      dummyClientReviewDoc: this.state.dummyClientReviewDoc,
    });
  };
  onActionChange = () => { };

  onSubmitClientReviewDoc = () => { };

  onResetClientReviewDoc = () => {
    this.state.dummyClientReviewDoc.map((obj) => {
      obj.fileName = "";
      obj.taskId = "";
      obj.notesToVendor = "";
    });
    this.setState({
      dummyClientReviewDoc: this.state.dummyClientReviewDoc,
    });
  };

  // .....................new final doc functionality...........................

  onFileChange_Final = (index) => (e) => {
    this.state.dummyFinalDoc[index].fileName = e.target.value;
    this.setState({
      dummyFinalDoc: this.state.dummyFinalDoc,
    });
  };
  onTaskIdChange_Final = (index) => (e) => {
    this.state.dummyFinalDoc[index].taskId = e.target.value;
    this.setState({
      dummyFinalDoc: this.state.dummyFinalDoc,
    });
  };
  onNotesChange_Final = (index) => (e) => {
    this.state.dummyFinalDoc[index].notesToVendor = e.target.value;
    this.setState({
      dummyFinalDoc: this.state.dummyFinalDoc,
    });
  };
  onActionChange = () => { };

  onSubmitFinalDoc = () => { };

  onResetFinalDoc = () => {
    this.state.dummyFinalDoc.map((obj) => {
      obj.fileName = "";
      obj.taskId = "";
      obj.notesToVendor = "";
    });
    this.setState({
      dummyFinalDoc: this.state.dummyFinalDoc,
    });
  };



  onSubmitTaskReviewList = async () => {
    let arr = this.state.newTaskList,
      brr = [];

    arr.map((task) => {
      let crr = [];
      task.subTask.map((data) => {
        crr.push({
          id: data.id,
          taskId: data.taskId.toString(),
          taskNo: data.taskNo.toString(),
          subTaskNo: data.subTaskNo.toString(),
          serviceId: data.serviceId,
          serviceName: data.serviceName,
          targetLanguageId: data.targetLanguageId,
          sourceLanguageId: data.sourceLanguageId,
          sourceLanguage: data.sourceLanguage,
          targetLanguage: data.targetLanguage,
          dueDate: SetDatabaseDateFormat(data.dueDate),
          notes: data.notes,
          documentName: data.documentName,
          docZipPath: data.docZipPath,
          docDataArr: data.docDataArr,
          wordCount: data.wordCount.toString(),
          vendors: data.vendors
        })
      })
      brr.push({
        id: task.id,
        taskId: task.taskId.toString(),
        taskNo: task.taskNo.toString(),
        subTaskNo: task.subTaskNo.toString(),
        serviceId: task.serviceId,
        serviceName: task.serviceName,
        documentName: task.documentName,
        docZipPath: task.docZipPath,
        docDataArr: task.docDataArr,
        wordCount: task.wordCount.toString(),
        sourceLanguage: task.sourceLanguage,
        targetLanguage: task.targetLanguage,
        bidCounter: task.bidCounter,
        targetLanguageId: task.targetLanguageId,
        sourceLanguageId: task.sourceLanguageId,
        dueDate: SetDatabaseDateFormat(task.dueDate),
        notes: task.notes,
        vendors: task.vendors,
        subTask: crr,
      })
    })
    // consoleLog("NewTask List::", brr);

    let reqObj = {
      data: brr
    }
    if (brr.length == arr.length) {
      let res = await ApiCall("updateTranslationTask", reqObj);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success("Data Updated Successfully");
        // setTimeout(
        //   () => { return history.push("/adminProjectList"); },
        //   1000
        // );
        window.scrollTo(0, 0);
        this.setState({
          isLoad: true
        })
        this.load();

      } else {
        toast.error("Error occured");
      }
    }

  }

  onOpenVendorListByTask = async (serviceId, sourceId, sourceLanguage, targetId, targetLanguage, taskId, taskNo, subTaskNo, serviceName, wordCount) => {
    if (wordCount == 0) {
      toast.error("Word count should not be 0")
    } else {
      let reqObj = {
        requestId: this.state.requestId,
        serviceId: serviceId,
        sourceLanguageId: sourceId,
        sourceLanguage: sourceLanguage,
        targetLanguageId: targetId,
        targetLanguage: targetLanguage,
        taskId: taskId,
        taskNo: taskNo.toString(),
        subTaskNo: subTaskNo.toString(),
        serviceName: serviceName
      }

      // consoleLog("Vendor List Req Obj ::", reqObj)

      //................ For all Vendor.................

      let res = await ApiCall("getVendorsWorkingStatusTranslation", reqObj);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let payload = Decoder.decode(res.data.payload);
        // consoleLog("All Vendor List For translation>>>>>", payload.data)
        let vendorList = payload.data.vendorList,
          brr = [],
          scount = 0,
          totalPage = Math.ceil(payload.data.length / this.state.limit);

        vendorList.map((aa) => {
          if (aa.isQuoteSent === 1) {
            brr.push(aa.userId);
          }
          if (aa.status === 2) {
            scount++;
          }
        });
        if (scount > 0) {
          this.setState({
            isVendorAssigned: true,
          });
        }

        this.setState({
          listData: vendorList,
          total_page: totalPage,
          vendorAssigned: brr,
          vendorListModalDetails: reqObj
        });
        this.openVendorListModal();
      }
    }
  }

  removeSubTask = async (i, j) => {
    if (this.state.newTaskList[i].subTask[j].taskId !== "0") {
      let reqObj = {
        taskId: this.state.newTaskList[i].subTask[j].taskId
      }
      let res = await ApiCall("removeTask", reqObj);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success("Subtask removed successfully");

        let arr = this.state.newTaskList;
        let subTask = [];
        arr[i].subTask.splice(j, 1);
        // consoleLog("New task after remove::", arr);
        let brr = arr[i].subTask;
        brr.map((sub, s) => {
          subTask.push({
            id: arr[i].taskNo + "." + Number(s + 1),
            taskId: sub.taskId,
            taskNo: sub.taskNo,
            subTaskNo: s + 1,
            targetLanguageId: sub.targetLanguageId,
            selectedTargetLangugae: sub.selectedTargetLangugae,
            sourceLanguageId: sub.sourceLanguageId,
            selectedSourceLanguage: sub.selectedSourceLanguage,
            selectedTask: sub.selectedTask,
            sourceLanguage: sub.sourceLanguage,
            serviceName: sub.serviceName,
            serviceId: sub.serviceId,
            targetLanguage: sub.targetLanguage,
            dueDate: SetUSAdateFormat(sub.dueDate),
            documentName: sub.documentName,
            docZipPath: sub.docZipPath,
            docDataArr: sub.docDataArr,
            wordCount: sub.wordCount,
            notes: sub.notes,
            vendors: sub.vendors,
            isDisabled: sub.taskId === "0" ? false : true,
            bidCounter: sub.bidCounter,
            vendor: sub.vendor
          })
        });

        arr[i].subTask = subTask;

        this.setState({
          newTaskList: arr
        })
      }
    } else {
      toast.success("Subtask removed successfully");
      let arr = this.state.newTaskList;
      let subTask = [];
      arr[i].subTask.splice(j, 1);
      // consoleLog("New task after remove::", arr);
      let brr = arr[i].subTask;
      brr.map((sub, s) => {
        subTask.push({
          id: arr[i].taskNo + "." + Number(s + 1),
          taskId: sub.taskId,
          taskNo: sub.taskNo,
          subTaskNo: s + 1,
          targetLanguageId: sub.targetLanguageId,
          selectedTargetLangugae: sub.selectedTargetLangugae,
          sourceLanguageId: sub.sourceLanguageId,
          selectedSourceLanguage: sub.selectedSourceLanguage,
          selectedTask: sub.selectedTask,
          sourceLanguage: sub.sourceLanguage,
          serviceName: sub.serviceName,
          serviceId: sub.serviceId,
          targetLanguage: sub.targetLanguage,
          dueDate: SetUSAdateFormat(sub.dueDate),
          documentName: sub.documentName,
          docZipPath: sub.docZipPath,
          docDataArr: sub.docDataArr,
          wordCount: sub.wordCount,
          notes: sub.notes,
          vendors: sub.vendors,
          isDisabled: sub.taskId === "0" ? false : true,
          bidCounter: sub.bidCounter,
          vendor: sub.vendor
        })
      });

      arr[i].subTask = subTask;

      this.setState({
        newTaskList: arr
      })
    }
  }

  onSourceDocActionChange = (value) => {
    // let arr = this.state.allSourceDocuments;
    // arr[i].selectedAction = value;
    // this.setState({
    //   allSourceDocuments: arr
    // })

    this.setState({
      selectedModalActionArr: value
    })
  }

  showAction = (data) => {
    this.setState({
      modalActionData: data,
      modalActionArr: data.actionArr,
      selectedModalActionArr: data.selectedAction
    });
    this.openActionModal();
  }

  openActionModal = () => {
    this.setState({
      actionModal: true
    })
  }

  closeActionModal = () => {
    this.setState({
      actionModal: false
    })
  }

  actionModalNotesChange = (e) => {
    this.setState({
      modalNotes: e.target.value
    })
  }

  onSubmitActionDocument = async () => {
    if (Object.keys(this.state.modalActionData).length > 0) {
      let data = this.state.modalActionData;
      let selectedModalActionArr = this.state.selectedModalActionArr;
      let obj = {
        requestId: selectedModalActionArr.requestId,
        parentId: data.id,
        taskId: selectedModalActionArr.taskId,
        taskNo: selectedModalActionArr.taskNo,
        subTaskNo: selectedModalActionArr.subTaskNo.toString(),
        bidId: selectedModalActionArr.bidId,
        notes: this.state.modalNotes,
        docName: data.docName,
        action: selectedModalActionArr.value,
        serviceId: selectedModalActionArr.serviceId,
        directory: selectedModalActionArr.flag,
        vendor: selectedModalActionArr.userId
      }
      consoleLog("Request Docs Api Modal", obj)
      let res = await ApiCall("sendTranslationDocRequest", obj);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        this.closeActionModal();
        toast.success("Request has been added successfully");
        // return history.push("/adminProjectList");
        window.scrollTo(0, 0);
        this.setState({
          isLoad: true
        })
        this.load();
      }
    }
  }

  changeTaskWordCount = (e, i) => {
    if (numberValidator(e.target.value)) {
      let number = e.target.value.toString();
      let aa = number.split("");
      if (aa[0] == 0 || aa[0] == " ") {
        let arr = this.state.taskList;
        arr[i].wordCount = aa[1];
        this.setState({
          taskList: arr
        })
      } else {
        let arr = this.state.taskList;
        arr[i].wordCount = e.target.value;
        this.setState({
          taskList: arr
        })
      }
    } else if (e.target.value === "") {
      let arr = this.state.taskList;
      arr[i].wordCount = 0;
      this.setState({
        taskList: arr
      })
    }
  }

  updateWordCount = async (data) => {
    // consoleLog("All Data::", data);
    let obj = {
      requestId: this.state.requestId,
      taskNo: data.taskNo.toString(),
      wordCount: data.wordCount.toString()
    }
    consoleLog("Request for word count update", obj)
    let res = await ApiCall("updateWordCount", obj);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success("Word Count has been updated successfully");
      this.load();
    }
  }

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    // const open1 = Boolean(this.state.anchorEl1);
    return (
      <React.Fragment>
        <ToastContainer hideProgressBar theme="colored" />
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>

        <div className="component-wrapper" hidden={this.state.isLoad}>
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            {" "}
            <Link to="/adminDashboard">Dashboard</Link> /{" "}
            {this.state.pathCheck == true ? (
              <Link to="/adminMainBillUnderVerification">
                Bills Under Verification
              </Link>
            ) : (
              <Link to="/adminProjectList">Translation</Link>
            )}
            / Details
          </div>
          <div className="job-details-tab jobdltste _fl sdw bid_vend_assign_pge">
            <ul className="nav nav-tabs">
              {/* <li className="nav-item">
                {" "}
                <a
                  className="nav-link active"
                  data-toggle="tab"
                  href="#jobdetails"
                >
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.JOB_DETAILS} />
                    </figure>{" "}
                    Details
                  </div>
                </a>{" "}
              </li> */}
              <li className="nav-item">
                {" "}
                <a
                  className="nav-link active"
                  data-toggle="tab"
                  href="#projectdetails"
                >
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.JOB_DETAILS} />
                    </figure>{" "}
                    Project Details & Tasks
                  </div>
                </a>{" "}
              </li>
              <li className="nav-item">
                {" "}
                <a className="nav-link" data-toggle="tab" href="#clientdetails">
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.TAB_USER_ICON} />
                    </figure>
                    Client Details
                  </div>
                </a>{" "}
              </li>
              <li className="nav-item">
                {" "}
                <a className="nav-link" data-toggle="tab" href="#sendqute">
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.TABBAR} />
                    </figure>

                    {this.state.quoteId === "" ? "Sent Quote" : "View Quote"}
                  </div>
                </a>{" "}
              </li>
              <li className="nav-item p1">
                <a className="nav-link" data-toggle="tab" href="#Document">
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.DOCUMENTICON} />
                    </figure>
                    Document
                  </div>
                </a>
              </li>
              {/* {this.state.quoteStatus === null ||
                this.state.quoteStatus === 2 ||
                this.state.quoteStatus === 3 ||
                this.state.quoteStatus === 6 ||
                this.state.quoteStatus === 8 ? (
                <li className="nav-item">
                  {" "}
                  <a className="nav-link" data-toggle="tab" href="#vendoroff">
                    <div className="taber">
                      <figure>
                        <img src={ImageName.IMAGE_NAME.DOCUMENTICON} />
                      </figure>
                      {this.state.quoteStatus === 8
                        ? "Vendors Offered"
                        : "Available vendors"}
                    </div>
                  </a>{" "}
                </li>
              ) : (
                <React.Fragment></React.Fragment>
              )} */}
              {/* <li className="nav-item">
                {" "}
                <a className="nav-link" data-toggle="tab" href="#chattab">
                  <div className="taber">
                    <figure>
                      <img
                        src={ImageName.IMAGE_NAME.CHAT_ICON}
                        style={{ padding: "10px", width: "48px" }}
                      />
                    </figure>
                    Chat{" "}
                  </div>
                </a>{" "}
              </li> */}
              {/* <li className="nav-item">
                {" "}
                <a className="nav-link" data-toggle="tab" href="#nofifications">
                  <div className="taber">
                    <figure>
                      <img src={ImageName.IMAGE_NAME.NOTIFICATION_ICON} />
                    </figure>
                    Notifications
                  </div>
                </a>{" "}
              </li> */}
            </ul>

            <div className="tab-content">
              <div className="tab-pane " id="jobdetails">
                <div className="job-section-tab">
                  <table
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                  >
                    <tbody>
                      <tr>
                        <td width="50%" align="left">
                          Job ID
                        </td>
                        <th width="50%" align="right">
                          {this.state.jobId}
                        </th>
                      </tr>

                      {/* <tr>
                        <td width="50%" align="left">
                          Appointment Type
                        </td>
                        <th width="50%" align="right">
                          <div className="f2f-b">
                            {this.state.appointmentType}
                          </div>
                        </th>
                      </tr> */}

                      {/* <tr>
                        <td width="50%" align="left">
                          Job Type
                        </td>
                        <th width="50%" align="right">
                          {this.state.jobType}
                        </th>
                      </tr> */}

                      {/* <tr>
                        <td width="50%" align="left">
                          Language
                        </td>
                        <th width="50%" align="right">
                          {this.state.language}
                        </th>
                      </tr> */}

                      <tr>
                        <td width="50%" align="left">
                          Target Audience
                        </td>
                        <th width="50%" align="right">
                          {this.state.targetAdience}
                        </th>
                      </tr>

                      <tr>
                        <td width="50%" align="left">
                          DTP format required
                        </td>
                        <th width="50%" align="right">
                          {this.state.isDtp === 1 ? "YES" : "NO"}
                        </th>
                      </tr>

                      <tr>
                        <td width="50%" align="left">
                          Expected Deadline
                        </td>
                        <th width="50%" align="right">
                          {SetDateFormat(this.state.date)}
                        </th>
                      </tr>

                      {/* <tr>
                        <td width="50%" align="left">
                          Service Location Address
                        </td>
                        <th width="50%" align="right">
                          {this.state.serviceAddress}
                        </th>
                      </tr> */}

                      {/* <tr>
                        <td width="50%" align="left">
                          Site Contant
                        </td>
                        <th width="50%" align="right">
                          {this.state.siteContant}
                        </th>
                      </tr> */}

                      <tr>
                        <td width="50%" align="left">
                          Consumer
                        </td>
                        <th width="50%" align="right">
                          {this.state.consumer}
                        </th>
                      </tr>
                      <tr>
                        <td width="50%" align="left">
                          Notes by Client
                        </td>
                        <th width="50%" align="right">
                          &nbsp;{this.state.notesByClient}
                        </th>
                      </tr>
                      {/* <tr>
                        <td width="50%" align="left">
                          <p class="notes">
                            Notes From <span>7C Lingo</span>
                          </p>
                        </td>
                        <th width="50%" align="right">
                          &nbsp;{this.state.notesBy7C}
                        </th>
                      </tr> */}
                    </tbody>
                  </table>
                  {this.state.taskList.length > 0 ? (
                    this.state.taskList.map((data, i) => (
                      <div className="c-l-s _fl text-center" key={i}>
                        <div className="row">
                          <div className="col-md-3">
                            <h4>Service type</h4>
                            <p>{data.serviceName}</p>
                          </div>
                          <div className="col-md-2">
                            <h4>Source Language</h4>
                            <p>{data.sourceLanguage}</p>
                          </div>
                          <div className="col-md-2">
                            <h4>Target Language</h4>
                            <p>{data.targetLanguage}</p>
                          </div>
                          <div className="col-md-2">
                            <h4>Document Name</h4>
                            <p>{data.documentName}</p>
                          </div>
                          <div className="col-md-2">
                            <h4>Source File</h4>
                            <p>
                              <a href="javascript:void(0)">
                                <img
                                  src={ImageName.IMAGE_NAME.DOWNLOADSHEET}
                                  onClick={() => this.onDownload(i)}
                                />
                              </a>
                            </p>
                          </div>
                          <div className="col-md-1">
                            {data.bidCounter > 0 ? (
                              <React.Fragment>
                                <h4>Bid</h4>
                                <p>
                                  <a href="javascript:void(0)">
                                    <img
                                      src={ImageName.IMAGE_NAME.EYE_BTN}
                                      onClick={() =>
                                        this.handleBidModal(data.taskId)
                                      }
                                    />
                                  </a>
                                </p>
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <h4>Bid</h4>
                                <p>N/A</p>
                              </React.Fragment>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <React.Fragment></React.Fragment>
                  )}
                </div>
              </div>
              <div className="tab-pane active" id="projectdetails">
                <div className="text_rite">
                  <div className="web_btn f-right">
                    <a
                      href="javascript:void(0)"
                      className="white-btn"
                      style={{ textDecoration: "none" }}
                      onClick={() => {
                        return history.push("/adminProjectList");
                      }}
                    >
                      BACK
                    </a>
                    <a
                      href="javascript:void(0)"
                      className="blue"
                      style={{ textDecoration: "none" }}
                      onClick={this.onSubmitTaskReviewList}
                    >
                      SUBMIT
                    </a>
                  </div>
                </div>

                <div className="document-list-wrap _fl sdw margin-top-30">
                  <div className="_fl doc-wrap">
                    <h3>Project Summary</h3>

                    <div className="c-l-s _fl table-listing-app">
                      <div className="row">
                        <div className="col-md-4">
                          <h4>Project ID</h4>
                          <p>{this.state.jobId}</p>
                        </div>
                        <div className="col-md-4">
                          <h4>Target Audience</h4>
                          <p>{this.state.targetAdience}</p>
                        </div>
                        <div className="col-md-4">
                          <h4>Expected Deadline</h4>
                          <p>
                            <span>{SetDateFormat(this.state.date)}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="document-list-wrap _fl sdw margin-top-30">
                  <div className="_fl doc-wrap">
                    <h3>Service Info</h3>

                    <div className="job-section-tab table-listing-app">
                      {this.state.taskList.length > 0 ? (
                        this.state.taskList.map((data, i) => (
                          <div className="c-l-s _fl text-center" key={i}>
                            <div className="row">
                              <div className="col-md-2">
                                <h4>Service type</h4>
                                <p>{data.serviceName}</p>
                              </div>
                              <div className="col-md-2">
                                <h4>Source Language</h4>
                                <p>{data.sourceLanguage}</p>
                              </div>
                              <div className="col-md-2">
                                <h4>Target Language</h4>
                                <p>
                                  <span
                                    data-toggle="tooltip"
                                    title={data.targetLanguage}>
                                    {textTruncate(data.targetLanguage, 15)}
                                  </span>
                                </p>
                              </div>
                              <div className="col-md-2">
                                <h4>Document Name</h4>
                                <p>
                                  <span
                                    data-toggle="tooltip"
                                    title={data.documentName}>
                                    {textTruncate(data.documentName, 15)}
                                  </span>
                                </p>
                              </div>
                              <div className="col-md-1">
                                <h4>Word Count</h4>
                                <input
                                  type="text"
                                  value={data.wordCount}
                                  name="mainTask_notes"
                                  placeholder="Enter"
                                  className="in-field2"
                                  onChange={(e) =>
                                    this.changeTaskWordCount(e, i)
                                  }
                                />
                                {/* <p>{data.wordCount}</p> */}
                                {/* {data.wordCount == 0 ? <>
                                  <div className="web-form-bx">
                                    <input
                                      type="text"
                                      value={data.wordCount}
                                      name="mainTask_notes"
                                      placeholder="Enter"
                                      className="in-field2"
                                      // onChange={(e) =>
                                      //   this.noteChangeTask(e, i)
                                      // }
                                      // readOnly
                                    />
                                  </div>
                                </>
                                  :
                                  <p>{data.wordCount}</p>} */}
                              </div>
                              <div className="col-md-2">
                                <h4>Source File</h4>
                                <p>
                                  <a href="javascript:void(0)">
                                    <img
                                      src={ImageName.IMAGE_NAME.DOWNLOADSHEET}
                                      onClick={() => this.onDownload(i)}
                                    />
                                  </a>
                                </p>
                              </div>
                              <div className="col-md-1 mrtp_40">
                                <button
                                  className="adtst_btn"
                                  onClick={() => this.updateWordCount(data)}
                                >
                                  Update
                                </button>
                              </div>
                              {/* <div className="col-md-1">
                                {data.bidCounter > 0 ? <React.Fragment>
                                  <h4>Bid</h4>
                                  <p><a href="javascript:void(0)"><img src={ImageName.IMAGE_NAME.EYE_BTN} onClick={() => this.handleBidModal(data.taskId)} /></a></p>
                                </React.Fragment> : <React.Fragment>
                                  <h4>Bid</h4>
                                  <p>N/A</p>
                                </React.Fragment>
                                }
                              </div> */}
                            </div>
                          </div>
                        ))
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}
                    </div>
                  </div>
                </div>

                <div className="document-list-wrap _fl sdw margin-top-30">
                  <div className="_fl doc-wrap">
                    <h3>Task[s] Assigned</h3>
                    {this.state.newTaskList.length > 0 ? (
                      <React.Fragment>
                        {this.state.newTaskList.map((data, i) => (
                          <React.Fragment>
                            <div className="table-listing-app tblt">
                              <div className="table-listing-app proj_tbl">
                                <p className="serv_typ">
                                  Service Type: {data.serviceName}
                                </p>
                                {/* <div className="table-responsive"> */}
                                <div>
                                  <div className="add_tsts">
                                    <table
                                      width="100%"
                                      cellspacing="0"
                                      cellpadding="0"
                                      border="0"
                                    >
                                      <tbody>
                                        <tr>
                                          {/* <th style={{ width: "5%" }}>
                                            <label className="custom_check2">
                                              <input
                                                type="checkbox"
                                                onClick={this.checked}
                                              />
                                              <span className="checkmark2"></span>
                                            </label>
                                          </th> */}
                                          <th style={{ width: "5%" }}>
                                            Task ID
                                          </th>
                                          <th style={{ width: "18%" }}>Task</th>
                                          <th style={{ width: "18%" }}>
                                            Source Lang
                                          </th>
                                          <th style={{ width: "18%" }}>
                                            Target Lang
                                          </th>
                                          <th style={{ width: "18%" }}>
                                            Due Date
                                          </th>
                                          <th style={{ width: "10%" }}>
                                            Notes
                                          </th>
                                          <th style={{ width: "5%" }}>
                                            Vendor[s]
                                          </th>
                                        </tr>
                                      </tbody>
                                      <tbody>
                                        <tr>
                                          {/* <td style={{ width: "5%" }}>
                                            <label className="custom_check2">
                                              <input type="checkbox" />

                                              <span className="checkmark2"></span>
                                            </label>
                                          </td> */}
                                          <td style={{ width: "5%" }}>
                                            {i + 1}
                                          </td>
                                          <td style={{ width: "18%" }}>
                                            <div className="bts-drop">
                                              <SelectBox
                                                optionData={
                                                  this.state
                                                    .allTranslationService
                                                }
                                                value={data.selectedTask}
                                                // onSelectChange={(value) => this.translationServiceTypeChange(value)}
                                                isDisabled={true}
                                              ></SelectBox>
                                            </div>
                                          </td>
                                          <td style={{ width: "18%" }}>
                                            <div className="bts-drop">
                                              <SelectBox
                                                optionData={
                                                  this.state.allLanguageArr
                                                }
                                                value={
                                                  data.selectedSourceLanguage
                                                }
                                                // onSelectChange={(value) => this.sourceLanguageChangeTask(value)}
                                                isDisabled={true}
                                              ></SelectBox>
                                            </div>
                                          </td>
                                          <td style={{ width: "18%" }}>
                                            <div className="bts-drop">
                                              <MultiSelectBox
                                                optionData={
                                                  this.state.allLanguageArr
                                                }
                                                value={
                                                  data.selectedTargetLangugae
                                                }
                                                // onSelectChange={(value) => this.targetLanguageChangeTask(value)}
                                                isDisabled={true}
                                              ></MultiSelectBox>
                                            </div>
                                          </td>
                                          <td style={{ width: "18%" }}>
                                            <div className="form-input-fields">
                                              <div
                                                className="input-group"
                                                style={{
                                                  width: "100%",
                                                  borderRadius: "9px",
                                                  height: "43px",
                                                  border: "1px solid #ced4da",
                                                  boxShadow:
                                                    "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    width: "80%",
                                                    padding: "8px",
                                                  }}
                                                >
                                                  <span>
                                                    {data.dueDate}
                                                  </span>
                                                </div>
                                                <div style={{ width: "20%" }}>
                                                  <a style={{ float: "right" }}>
                                                    <DatePicker
                                                      dropdownMode="select"
                                                      showMonthDropdown
                                                      showYearDropdown
                                                      adjustDateOnChange
                                                      minDate={new Date()}
                                                      onChange={(date) => this.dueDateChangeTask(date, i)}
                                                      customInput={<Schedule />}
                                                    // disabled
                                                    />
                                                  </a>
                                                </div>
                                              </div>
                                            </div>
                                          </td>
                                          <td style={{ width: "10%" }}>
                                            <div className="web-form-bx">
                                              <input
                                                type="text"
                                                value={data.notes}
                                                name="mainTask_notes"
                                                placeholder="Enter"
                                                className="in-field2"
                                                // onChange={(e) =>
                                                //   this.noteChangeTask(e, i)
                                                // }
                                                readOnly
                                              />
                                            </div>
                                          </td>
                                          <td style={{ width: "5%" }}>
                                            <div className="web-form-bx">
                                              {data.vendor === "" ? <>
                                                {data.bidCounter > 0 ?
                                                  <>
                                                    <a href="javascript:void(0)" onClick={() => { this.onOpenVendorListByTask(data.serviceId, data.sourceLanguageId, data.sourceLanguage, data.targetLanguageId, data.targetLanguage, data.taskId, data.taskNo, data.subTaskNo, data.serviceName, data.wordCount) }}>
                                                      <img
                                                        src={
                                                          ImageName.IMAGE_NAME.EYE_BTN
                                                        }
                                                      />
                                                    </a>
                                                    <a href="javascript:void(0)" style={{ paddingLeft: "5%" }} onClick={() => this.handleBidModal(data.taskId)} ><CgProfile size={25} /></a>
                                                  </>
                                                  : <a href="javascript:void(0)" onClick={() => { this.onOpenVendorListByTask(data.serviceId, data.sourceLanguageId, data.sourceLanguage, data.targetLanguageId, data.targetLanguage, data.taskId, data.taskNo, data.subTaskNo, data.serviceName, data.wordCount) }}>
                                                    <img
                                                      src={
                                                        ImageName.IMAGE_NAME.EYE_BTN
                                                      }
                                                    />
                                                  </a>
                                                }</> : <>
                                                <span
                                                  data-toggle="tooltip"
                                                  title={data.vendor}>
                                                  {textTruncate(data.vendor, 20)}
                                                </span>
                                              </>}
                                            </div>
                                          </td>
                                        </tr>
                                        {data.subTask.length > 0 ? (
                                          <React.Fragment>
                                            {data.subTask.map((sub, j) => (
                                              <React.Fragment key={j}>
                                                <tr>
                                                  {/* <td style={{ width: "5%" }}>
                                                    <label className="custom_check2">
                                                      <input type="checkbox" />

                                                      <span className="checkmark2"></span>
                                                    </label>
                                                  </td> */}
                                                  <td style={{ width: "5%" }}>
                                                    {sub.id}
                                                  </td>
                                                  <td style={{ width: "18%" }}>
                                                    <div className="bts-drop">
                                                      <SelectBox
                                                        optionData={
                                                          this.state
                                                            .allTranslationService
                                                        }
                                                        value={
                                                          sub.selectedTask
                                                        }
                                                        onSelectChange={(
                                                          value
                                                        ) =>
                                                          this.translationServiceTypeChange(
                                                            value, i,
                                                            j
                                                          )
                                                        }
                                                        isDisabled={sub.isDisabled}
                                                      ></SelectBox>
                                                    </div>
                                                  </td>
                                                  <td style={{ width: "18%" }}>
                                                    <div className="bts-drop">
                                                      <SelectBox
                                                        optionData={
                                                          this.state
                                                            .allLanguageArr
                                                        }
                                                        value={
                                                          sub.selectedSourceLanguage
                                                        }
                                                        onSelectChange={(
                                                          value
                                                        ) =>
                                                          this.sourceLanguageChangeTask(
                                                            value, i,
                                                            j
                                                          )
                                                        }
                                                        isDisabled={sub.isDisabled}
                                                      ></SelectBox>
                                                    </div>
                                                  </td>
                                                  <td style={{ width: "18%" }}>
                                                    <div className="bts-drop">
                                                      <MultiSelectBox
                                                        optionData={
                                                          this.state
                                                            .allLanguageArr
                                                        }
                                                        value={
                                                          sub.selectedTargetLangugae
                                                        }
                                                        onSelectChange={(
                                                          value
                                                        ) =>
                                                          this.targetLanguageChangeTask(
                                                            value, i,
                                                            j
                                                          )
                                                        }
                                                        isDisabled={sub.isDisabled}
                                                      ></MultiSelectBox>
                                                    </div>
                                                  </td>
                                                  <td style={{ width: "18%" }}>
                                                    <div className="form-input-fields">
                                                      <div
                                                        className="input-group"
                                                        style={{
                                                          width: "100%",
                                                          borderRadius: "9px",
                                                          height: "43px",
                                                          border:
                                                            "1px solid #ced4da",
                                                          boxShadow:
                                                            "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                                        }}
                                                      >
                                                        <div
                                                          style={{
                                                            width: "80%",
                                                            padding: "8px",
                                                          }}
                                                        >
                                                          <span>
                                                            {
                                                              sub.dueDate
                                                            }
                                                          </span>
                                                        </div>
                                                        <div
                                                          style={{
                                                            width: "20%",
                                                          }}
                                                        >
                                                          <a
                                                            style={{
                                                              float: "right",
                                                            }}
                                                          >
                                                            <DatePicker
                                                              dropdownMode="select"
                                                              showMonthDropdown
                                                              showYearDropdown
                                                              adjustDateOnChange
                                                              minDate={
                                                                new Date()
                                                              }
                                                              onChange={(
                                                                date
                                                              ) =>
                                                                this.dueDateChangeSubTask(
                                                                  date, i,
                                                                  j
                                                                )
                                                              }
                                                              customInput={
                                                                <Schedule />
                                                              }
                                                              disabled={sub.isDisabled}
                                                            />
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td style={{ width: "10%" }}>
                                                    <div className="web-form-bx">
                                                      <input
                                                        type="text"
                                                        value={sub.notes}
                                                        name="subTask_notes"
                                                        placeholder="Enter"
                                                        className="in-field2"
                                                        onChange={(e) =>
                                                          this.noteChangeTask(
                                                            e, i,
                                                            j
                                                          )
                                                        }
                                                        readOnly={sub.isDisabled}
                                                      />
                                                    </div>
                                                  </td>
                                                  <td style={{ width: "5%" }}>
                                                    <div className="web-form-bx">
                                                      {sub.vendor === "" ? <>
                                                        {sub.taskId === "0" ? <>
                                                          <img
                                                            src={ImageName.IMAGE_NAME.CANCEL_BTN}
                                                            style={{ cursor: "pointer" }}
                                                            alt=""
                                                            onClick={() => this.removeSubTask(i, j)}
                                                          />
                                                        </> : <>
                                                          {sub.bidCounter > 0 ? <>
                                                            <a href="javascript:void(0)">
                                                              <img
                                                                src={
                                                                  ImageName.IMAGE_NAME
                                                                    .EYE_BTN
                                                                }
                                                                onClick={() => { this.onOpenVendorListByTask(sub.serviceId, sub.sourceLanguageId, sub.sourceLanguage, sub.targetLanguageId, sub.targetLanguage, sub.taskId, sub.taskNo, sub.subTaskNo, data.serviceName, data.wordCount) }}
                                                              />
                                                              <a href="javascript:void(0)" style={{ paddingLeft: "5%" }} onClick={() => this.handleBidModalForSubTask(sub.taskId, i, j)} ><CgProfile size={25} /></a>
                                                            </a>
                                                          </> :
                                                            <a href="javascript:void(0)">
                                                              <img
                                                                src={
                                                                  ImageName.IMAGE_NAME
                                                                    .EYE_BTN
                                                                }
                                                                onClick={() => { this.onOpenVendorListByTask(sub.serviceId, sub.sourceLanguageId, sub.sourceLanguage, sub.targetLanguageId, sub.targetLanguage, sub.taskId, sub.taskNo, sub.subTaskNo, data.serviceName, data.wordCount) }}
                                                              />
                                                              <img
                                                                src={ImageName.IMAGE_NAME.CANCEL_BTN}
                                                                style={{ cursor: "pointer", paddingLeft: "5%" }}
                                                                alt=""
                                                                onClick={() => this.removeSubTask(i, j)}
                                                              />
                                                            </a>
                                                          }
                                                        </>
                                                        }
                                                      </> : <>
                                                        <span
                                                          data-toggle="tooltip"
                                                          title={sub.vendor}>
                                                          {textTruncate(sub.vendor, 20)}
                                                        </span>
                                                      </>}
                                                    </div>
                                                  </td>
                                                </tr>
                                              </React.Fragment>
                                            ))}
                                          </React.Fragment>
                                        ) : (
                                          <React.Fragment></React.Fragment>
                                        )}
                                      </tbody>
                                    </table>

                                    <div className="text_rite">
                                      <button
                                        className="adtst_btn"
                                        onClick={() => this.addSubtask(i)}
                                      >
                                        Add Task
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                  </div>
                </div>

                <div className="_button-style m30 _fl text-center">
                  <a
                    href="javascript:void(0)"
                    className="white-btn"
                    style={{ textDecoration: "none" }}
                    onClick={() => {
                      return history.push("/adminProjectList");
                    }}
                  >
                    Back
                  </a>
                  <a
                    href="javascript:void(0)"
                    className="blue-btn"
                    style={{ textDecoration: "none", color: "#fff" }}
                    onClick={this.onSubmitTaskReviewList}
                  >
                    Submit
                  </a>
                  {/* {this.state.quoteStatus === 1 ? <>
                      <button type="button" class="btn btn-success" onClick={this.acceptClient}>Accept</button> <span style={{ color: "gray" }}>(On behalf of client)</span>
                    </> : <></>
                    } */}
                </div>
              </div>

              <div className="tab-pane" id="sendqute">
                <div className="job-section-tab">
                  <div className="view-quote-details-wrap">
                    <h3>View Quote</h3>
                    {this.state.quoteId === "" ? <React.Fragment></React.Fragment> :
                      <p>
                        <span>Quote ID</span>
                        {this.state.quoteId}
                      </p>
                    }
                    <p>
                      <span>Target Audience</span> {this.state.targetAdience}
                    </p>
                    <p>
                      <span>Expected Deadline</span>{" "}
                      {SetDateFormat(this.state.dateTime)}
                    </p>
                    <p>
                      <span>Notes from Client</span>
                      {this.state.notesFromClient}
                    </p>
                    <p>
                      <span>Industry Type</span> {this.state.clientIndustryType}
                    </p>
                  </div>
                  <div className="translation_table">
                    {this.state.taskData.length > 0 ? (
                      <React.Fragment>
                        {this.state.taskData.map((item, i) => (
                          <div className="task_table">
                            <div class="tsk-col _fl m30 p-20">
                              <h3>
                                Task {i + 1} : {item.service}
                              </h3>
                              <ul>
                                <li
                                  data-toggle="tooltip"
                                  title={item.sourceLanguage}
                                >
                                  {/* {consoleLog("Item detail::", item.sourceLanguage)} */}
                                  <a
                                    href="javascript:void(0)"
                                    style={{ textDecoration: "none" }}
                                  >
                                    {textTruncate(item.sourceLanguage, 10)}
                                  </a>
                                </li>
                                <li
                                  data-toggle="tooltip"
                                  title={item.targetLanguage}
                                >
                                  <a
                                    href="javascript:void(0)"
                                    style={{ textDecoration: "none" }}
                                  >
                                    {textTruncate(item.targetLanguage, 10)}
                                  </a>
                                </li>
                              </ul>
                            </div>
                            <div class="tsk-tabl">
                              <table
                                width="100%"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tr>
                                  <th
                                    style={{
                                      width: "25%",
                                      textAlign: "center",
                                    }}
                                  >
                                    ITEM(S)
                                  </th>
                                  <th
                                    style={{
                                      width: "25%",
                                      textAlign: "center",
                                    }}
                                  >
                                    QUANTITY
                                  </th>
                                  <th
                                    style={{
                                      width: "25%",
                                      textAlign: "center",
                                    }}
                                  >
                                    UNIT COST
                                  </th>
                                  <th
                                    style={{
                                      width: "25%",
                                      textAlign: "center",
                                    }}
                                  >
                                    RATE
                                  </th>
                                </tr>

                                <tr>
                                  <td style={{ textAlign: "left" }}>
                                    Approx Word Count
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <div
                                      className="input-group"
                                      style={{ justifyContent: "center" }}
                                    >
                                      <input
                                        type="text"
                                        value={item.wordCountQty}
                                        name=""
                                        placeholder=""
                                        class="in-field4 unit-cost"
                                        onChange={(e) => { this.handleWordQty(e, i) }}
                                        readOnly={this.state.quoteId === "" ? false : true}
                                      />
                                    </div>
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <div
                                      className="input-group"
                                      style={{ justifyContent: "center" }}
                                    >
                                      <div class="input-group-prepend">
                                        <span
                                          class="input-group-text"
                                          id="basic-addon1"
                                        >
                                          $
                                        </span>
                                      </div>
                                      <input
                                        type="text"
                                        value={item.wordCountCost}
                                        name=""
                                        placeholder=""
                                        class="in-field4 unit-cost"
                                        onChange={(e) => { this.handleWordCost(e, i) }}
                                        readOnly={this.state.quoteId === "" ? false : true}
                                      />
                                    </div>
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    $ {item.wordCountRate}
                                  </td>
                                </tr>

                                {this.state.isDtp === 1 ? (
                                  <tr>
                                    <td style={{ textAlign: "left" }}>
                                      Approx DTP Hours
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                      <div
                                        className="input-group"
                                        style={{ justifyContent: "center" }}
                                      >
                                        <input
                                          type="text"
                                          value={item.dtpQty}
                                          name=""
                                          placeholder=""
                                          class="in-field4 unit-cost"
                                          onChange={(e) => { this.handleDtpQty(e, i) }}
                                          readOnly={this.state.quoteId === "" ? false : true}
                                        />
                                      </div>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                      <div
                                        className="input-group"
                                        style={{ justifyContent: "center" }}
                                      >
                                        <div class="input-group-prepend">
                                          <span
                                            class="input-group-text"
                                            id="basic-addon1"
                                          >
                                            $
                                          </span>
                                        </div>
                                        <input
                                          type="text"
                                          value={item.dtpCost}
                                          name=""
                                          placeholder=""
                                          class="in-field4 unit-cost"
                                          onChange={(e) => { this.handleDtpUnitCost(e, i) }}
                                          readOnly={this.state.quoteId === "" ? false : true}
                                        />
                                      </div>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                      $ {item.dtpRate}
                                    </td>
                                  </tr>
                                ) : (
                                  <React.Fragment></React.Fragment>
                                )}
                                <tr>
                                  <td style={{ textAlign: "left" }}>
                                    Rush Fee (If Applicable)
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <div
                                      className="input-group"
                                      style={{ justifyContent: "center" }}
                                    >
                                      <input
                                        type="text"
                                        value={item.rushFeeUnit}
                                        name=""
                                        placeholder=""
                                        class="in-field4 unit-cost"
                                        onChange={(e) => { this.handleRushUnit(e, i) }}
                                        readOnly={this.state.quoteId === "" ? false : true}
                                      />
                                    </div>
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <div
                                      className="input-group"
                                      style={{ justifyContent: "center" }}
                                    >
                                      <div class="input-group-prepend">
                                        <span
                                          class="input-group-text"
                                          id="basic-addon1"
                                        >
                                          $
                                        </span>
                                      </div>
                                      <input
                                        type="text"
                                        value={item.rushFeeCost}
                                        name=""
                                        placeholder=""
                                        class="in-field4 unit-cost"
                                        onChange={(e) => { this.handleRushUnitCost(e, i) }}
                                        readOnly={this.state.quoteId === "" ? false : true}
                                      />
                                    </div>
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    $ {item.rushFeeRate}
                                  </td>
                                </tr>

                                <tr>
                                  <td style={{ textAlign: "left" }}>
                                    SUB COST
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    &nbsp;
                                  </td>
                                  <td style={{ textAlign: "center" }}></td>
                                  <td
                                    className="text-ttt"
                                    style={{ textAlign: "center" }}
                                  >
                                    $ {item.SubCost}
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </div>
                        ))}
                      </React.Fragment>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                    {this.state.quoteId === "" ?
                      <div class="addmore_service text-right">
                        <a href="javascript:void(0)">
                          <div
                            onClick={this.addParticularField}
                            style={{ marginTop: "8px" }}
                          >
                            Add Additional Field
                          </div>
                        </a>
                      </div> : <></>}
                    {this.state.additionalTranslationCharges.length > 0 ? (
                      <React.Fragment>
                        <div class="tsk-col _fl p-20">
                          <h3>Additional Fees</h3>
                        </div>
                        <table style={{ border: "none", width: "100%" }}>
                          {this.state.additionalTranslationCharges.map(
                            (item, key) => (
                              <tr>
                                <td width="50%" align="left">
                                  <input
                                    className="inputfield flr"
                                    type="text"
                                    placeholder="Particulars"
                                    value={item.title}
                                    readOnly={this.state.quoteId === "" ? false : true}
                                    onChange={(e) =>
                                      this.onParticularChange(e, key)
                                    }
                                  />
                                </td>
                                <td width="50%" align="right">
                                  <div className="row">
                                    <div className="col-md-5"></div>
                                    <div className="col-md-6">
                                      <div
                                        className="input-group"
                                        style={{ justifyContent: "end" }}
                                      >
                                        <div class="input-group-prepend">
                                          <span
                                            class="input-group-text dollar"
                                            id="basic-addon1"
                                          >
                                            $
                                          </span>
                                        </div>
                                        <input
                                          className="inputfield flr"
                                          type="text"
                                          placeholder="Enter Amount"
                                          value={item.amt}
                                          style={{ width: "75%" }}
                                          onChange={(e) =>
                                            this.onParticularAmountChange(e, key)
                                          }
                                          readOnly={this.state.quoteId === "" ? false : true}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-1 delete-btn">
                                      {this.state.quoteId === "" ?
                                        <img
                                          src={ImageName.IMAGE_NAME.TRASH_BTN}
                                          onClick={() =>
                                            this.onDeleteParticulars(key)
                                          }
                                          style={{ cursor: "pointer" }}
                                        /> : <></>
                                      }
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                        </table>
                      </React.Fragment>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                    <table style={{ border: "none", width: "100%" }}>
                      <tr>
                        <td style={{ width: "25%" }}>
                          <span
                            style={{
                              color: "#6aa881",
                              fontSize: "22px",
                              fontWeight: "800",
                            }}
                          >
                            Total Amount :{" "}
                          </span>
                        </td>
                        <td style={{ width: "25%" }}></td>
                        <td style={{ width: "25%" }}></td>
                        <td style={{ width: "25%" }}>
                          <span
                            style={{
                              color: "#6aa881",
                              fontSize: "22px",
                              fontWeight: "800",
                            }}
                          >
                            $ {this.state.totalAmount}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div className="_button-style m30 _fl text-center">
                    <a
                      href="javascript:void(0)"
                      className="white-btn"
                      style={{ textDecoration: "none" }}
                      onClick={() => {
                        return history.push("/adminProjectList");
                      }}
                    >
                      Back
                    </a>
                    {this.state.quoteId === "" ?
                      <a
                        href="javascript:void(0)"
                        className="blue-btn"
                        style={{ textDecoration: "none", color: "#fff" }}
                        onClick={this.OnSendQuote}
                      >
                        Send Quote
                      </a> : <></>
                    }
                    {/* {this.state.quoteStatus === 1 ? <>
                      <button type="button" class="btn btn-success" onClick={this.acceptClient}>Accept</button> <span style={{ color: "gray" }}>(On behalf of client)</span>
                    </> : <></>
                    } */}
                  </div>
                </div>
              </div>

              {/* ..............For Documents Tab.............. */}

              <div className="tab-pane" id="Document">
                {/* ..................................new docs source accordian,,,,,,,,,,,,,,, */}

                <div className="document-list-wrap _fl sdw margin-top-30">
                  <div className="_fl doc-wrap">
                    <h3>Source Documents</h3>

                    <div className="table-listing-app tblt">
                      {/* <div style={{ float: "right", marginBottom: "10px" }}>
                        <button type="button" class="btn btn-secondary">
                          Download
                        </button>
                      </div> */}
                      <div className="table-responsive">
                        <table
                          width="100%"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                        >
                          <tr>
                            <th style={{ width: "10%" }}>Filename</th>
                            <th style={{ width: "10%" }}>Service Type</th>
                            <th style={{ width: "5%" }}>Task ID</th>
                            <th style={{ width: "10%" }}>Last Modified on</th>
                            <th style={{ width: "20%" }}>Notes to Vendor</th>
                            <th style={{ width: "20%" }}>Action</th>
                            {/* <th style={{ width: "10%" }}>Action</th> */}
                          </tr>
                          {this.state.allSourceDocuments.length > 0 ? (
                            <React.Fragment>
                              {this.state.allSourceDocuments.map((data, i) => (
                                <React.Fragment key={i}>
                                  <tr>
                                    <td>
                                      <p onClick={() => this.onDownloadSourceDocs(i)} style={{ cursor: "pointer" }}>{data.docName}</p>
                                    </td>
                                    <td><p>{data.serviceName}</p></td>
                                    <td>
                                      <p>
                                        {data.subTaskNo == 0 ?
                                          data.taskNo :
                                          data.taskNo + "." + data.subTaskNo
                                        }
                                      </p>
                                    </td>
                                    <td>
                                      <p>
                                        {SetDateFormat(data.lastUpdated) +
                                          " | " +
                                          SetTimeFormat(data.lastUpdated)}
                                      </p>
                                    </td>
                                    <td>
                                      <p className="tr_notes_p">
                                        <span
                                          className="tr_nl"
                                          data-toggle="tooltip"
                                          title={data.notes}>
                                          Instructed : {textTruncate(data.notes, 30)}
                                        </span>
                                        {data.userNotes === "" ? <></> :
                                          <span
                                            className="tr_nl"
                                            data-toggle="tooltip"
                                            title={data.notes}>
                                            User :  {textTruncate(data.userNotes, 45)}
                                          </span>
                                        }
                                      </p>
                                    </td>
                                    <td>
                                      {data.action === "" ? <>
                                        {/* <div
                                          className="dropdwn"
                                          style={{ width: "100%" }}
                                        >
                                          <Select
                                            styles={customStyles}
                                            name="select"
                                            placeholder="Select"
                                            components={{
                                              DropdownIndicator,
                                              IndicatorSeparator: () => null,
                                            }}
                                            value={data.selectedAction}
                                            options={data.actionArr}
                                            onChange={(value) =>
                                              this.onSourceDocActionChange(value, i)
                                            }
                                          />

                                        </div> */}
                                        <FiEdit size={25} style={{ cursor: "pointer" }} onClick={() => this.showAction(data)} />
                                      </>
                                        : <>
                                          <p>
                                            {data.action}
                                          </p>
                                        </>

                                      }
                                    </td>
                                  </tr>
                                </React.Fragment>
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
                        </table>
                      </div>
                      {/* <div style={{ float: "right", marginTop: "10px" }}>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          style={{ marginRight: "10px" }}
                          onClick={this.onSubmitSourceDoc}
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          onClick={this.onResetSourceDoc}
                        >
                          Reset
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* ..................................new translated source accordian,,,,,,,,,,,,,,, */}

                <div className="document-list-wrap _fl sdw margin-top-30">
                  <div className="_fl doc-wrap">
                    <h3>Translated Documents</h3>

                    <div className="table-listing-app tblt">
                      {/* <div style={{ float: "right", marginBottom: "10px" }}>
                        <button type="button" class="btn btn-secondary">
                          Download
                        </button>
                      </div> */}
                      <div className="table-responsive">
                        <table
                          width="100%"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                        >
                          <tr>
                            <th style={{ width: "15%" }}>Filename</th>
                            <th style={{ width: "10%" }}>Service Type</th>
                            <th style={{ width: "15%" }}>Task ID</th>
                            <th style={{ width: "20%" }}>Last Modified on</th>
                            <th style={{ width: "10%" }}>Action</th>
                            <th style={{ width: "20%" }}>Notes to Vendor</th>
                          </tr>
                          {this.state.allTranslatedList.length > 0 ? (
                            <React.Fragment>
                              {this.state.allTranslatedList.map((data, i) => (
                                <React.Fragment key={i}>
                                  <tr>
                                    <td>
                                      <input
                                        type="text"
                                        className="in-field2"
                                        value={data.fileName}
                                        style={{ width: "90%" }}
                                        onChange={this.onFileChange_Translated(
                                          i
                                        )}
                                      />
                                    </td>
                                    <td>{data.serviceType}</td>
                                    <td>
                                      {" "}
                                      <input
                                        type="text"
                                        className="in-field2"
                                        value={data.taskId}
                                        style={{ width: "90%" }}
                                        onChange={this.onTaskIdChange_Translated(
                                          i
                                        )}
                                      />
                                    </td>
                                    <td>{data.lastModified}</td>
                                    <td>
                                      <div
                                        className="dropdwn"
                                        style={{ width: "110%" }}
                                      >
                                        <Select
                                          styles={customStyles}
                                          name="select"
                                          placeholder="Select"
                                          components={{
                                            DropdownIndicator,
                                            IndicatorSeparator: () => null,
                                          }}
                                        // value={this.state.actionData}
                                        // options={this.state.actionArr}
                                        // onChange={(value) =>
                                        //   this.onActionChange(value)
                                        // }
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      {" "}
                                      <input
                                        type="text"
                                        className="in-field2"
                                        value={data.notesToVendor}
                                        style={{
                                          width: "90%",
                                          marginLeft: "25px",
                                        }}
                                        onChange={this.onNotesChange_Translated(
                                          i
                                        )}
                                      />
                                    </td>
                                  </tr>
                                </React.Fragment>
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
                        </table>
                      </div>
                      {/* <div style={{ float: "right", marginTop: "10px" }}>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          style={{ marginRight: "10px" }}
                          onClick={this.onSubmitTranslatedDoc}
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          onClick={this.onResetTranslatedDoc}
                        >
                          Reset
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* ..................................new vendor review accordian,,,,,,,,,,,,,,, */}

                <div className="document-list-wrap _fl sdw margin-top-30">
                  <div className="_fl doc-wrap">
                    <h3>Vendor Review Documents</h3>

                    <div className="table-listing-app tblt">
                      {/* <div style={{ float: "right", marginBottom: "10px" }}>
                        <button type="button" class="btn btn-secondary">
                          Download
                        </button>
                      </div> */}
                      <div className="table-responsive">
                        <table
                          width="100%"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                        >
                          <tr>
                            <th style={{ width: "10%" }}>Filename</th>
                            <th style={{ width: "10%" }}>Service Type</th>
                            <th style={{ width: "5%" }}>Task ID</th>
                            <th style={{ width: "10%" }}>Last Modified on</th>
                            <th style={{ width: "20%" }}>Notes to Vendor</th>
                            <th style={{ width: "20%" }}>Action</th>
                          </tr>
                          {this.state.allVendorReviewdocs.length > 0 ? (
                            <React.Fragment>
                              {this.state.allVendorReviewdocs.map(
                                (data, i) => (
                                  <React.Fragment key={i}>
                                    <tr>
                                      <td>
                                        <p onClick={() => this.onDownloadVendorReviewDocs(i)} style={{ cursor: "pointer" }}>{data.docName}</p>
                                      </td>
                                      <td><p>{data.serviceName}</p></td>
                                      <td>
                                        <p>
                                          {data.subTaskNo == 0 ?
                                            data.taskNo :
                                            data.taskNo + "." + data.subTaskNo
                                          }
                                        </p>
                                      </td>
                                      <td>
                                        <p>
                                          {SetDateFormat(data.lastUpdated) +
                                            " | " +
                                            SetTimeFormat(data.lastUpdated)}
                                        </p>
                                      </td>
                                      <td>
                                        <p className="tr_notes_p">
                                          <span
                                            className="tr_nl"
                                            data-toggle="tooltip"
                                            title={data.notes}>
                                            Instructed : {textTruncate(data.notes, 30)}
                                          </span>
                                          {data.userNotes === "" ? <></> :
                                            <span
                                              className="tr_nl"
                                              data-toggle="tooltip"
                                              title={data.notes}>
                                              User :  {textTruncate(data.userNotes, 45)}
                                            </span>
                                          }
                                        </p>
                                      </td>
                                      <td>
                                        {data.action === "" ? <>
                                          {/* <div
                                          className="dropdwn"
                                          style={{ width: "100%" }}
                                        >
                                          <Select
                                            styles={customStyles}
                                            name="select"
                                            placeholder="Select"
                                            components={{
                                              DropdownIndicator,
                                              IndicatorSeparator: () => null,
                                            }}
                                            value={data.selectedAction}
                                            options={data.actionArr}
                                            onChange={(value) =>
                                              this.onSourceDocActionChange(value, i)
                                            }
                                          />

                                        </div> */}
                                          <FiEdit size={25} style={{ cursor: "pointer" }} onClick={() => this.showAction(data)} />
                                        </>
                                          : <>
                                            <p>
                                              {data.action}
                                            </p>
                                          </>

                                        }
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                )
                              )}
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
                        </table>
                      </div>
                      {/* <div style={{ float: "right", marginTop: "10px" }}>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          style={{ marginRight: "10px" }}
                          onClick={this.onSubmitVendorReviewDoc}
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          onClick={this.onResetVendorReviewDoc}
                        >
                          Reset
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* ..................................new client review accordian,,,,,,,,,,,,,,, */}

                <div className="document-list-wrap _fl sdw margin-top-30">
                  <div className="_fl doc-wrap">
                    <h3>Client Review Documents</h3>

                    <div className="table-listing-app tblt">
                      {/* <div style={{ float: "right", marginBottom: "10px" }}>
                        <button type="button" class="btn btn-secondary">
                          Download
                        </button>
                      </div> */}
                      <div className="table-responsive">
                        <table
                          width="100%"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                        >
                          <tr>
                            <th style={{ width: "10%" }}>Filename</th>
                            <th style={{ width: "10%" }}>Service Type</th>
                            <th style={{ width: "5%" }}>Task ID</th>
                            <th style={{ width: "10%" }}>Last Modified on</th>
                            <th style={{ width: "20%" }}>Notes to Vendor</th>
                            <th style={{ width: "20%" }}>Action</th>
                          </tr>
                          {this.state.allClientReviewDocs.length > 0 ? (
                            <React.Fragment>
                              {this.state.allClientReviewDocs.map(
                                (data, i) => (
                                  <React.Fragment key={i}>
                                    <tr>
                                      <td>
                                        <p onClick={() => this.onDownloadClientReviewDocs(i)} style={{ cursor: "pointer" }}>{data.docName}</p>
                                      </td>
                                      <td><p>{data.serviceName}</p></td>
                                      <td>
                                        <p>
                                          {data.subTaskNo == 0 ?
                                            data.taskNo :
                                            data.taskNo + "." + data.subTaskNo
                                          }
                                        </p>
                                      </td>
                                      <td>
                                        <p>
                                          {SetDateFormat(data.lastUpdated) +
                                            " | " +
                                            SetTimeFormat(data.lastUpdated)}
                                        </p>
                                      </td>
                                      <td>
                                        <p className="tr_notes_p">
                                          <span
                                            className="tr_nl"
                                            data-toggle="tooltip"
                                            title={data.notes}>
                                            Instructed : {textTruncate(data.notes, 30)}
                                          </span>
                                          {data.userNotes === "" ? <></> :
                                            <span
                                              className="tr_nl"
                                              data-toggle="tooltip"
                                              title={data.notes}>
                                              User :  {textTruncate(data.userNotes, 45)}
                                            </span>
                                          }
                                        </p>
                                      </td>
                                      <td>
                                        {data.action === "" ? <>
                                          {/* <div
                                        className="dropdwn"
                                        style={{ width: "100%" }}
                                      >
                                        <Select
                                          styles={customStyles}
                                          name="select"
                                          placeholder="Select"
                                          components={{
                                            DropdownIndicator,
                                            IndicatorSeparator: () => null,
                                          }}
                                          value={data.selectedAction}
                                          options={data.actionArr}
                                          onChange={(value) =>
                                            this.onSourceDocActionChange(value, i)
                                          }
                                        />

                                      </div> */}
                                          <FiEdit size={25} style={{ cursor: "pointer" }} onClick={() => this.showAction(data)} />
                                        </>
                                          : <>
                                            <p>
                                              {data.action}
                                            </p>
                                          </>

                                        }
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                )
                              )}
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
                        </table>
                      </div>
                      {/* <div style={{ float: "right", marginTop: "10px" }}>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          style={{ marginRight: "10px" }}
                          onClick={this.onSubmitClientReviewDoc}
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          onClick={this.onResetClientReviewDoc}
                        >
                          Reset
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* ..................................new final doc accordian,,,,,,,,,,,,,,, */}

                <div className="document-list-wrap _fl sdw margin-top-30">
                  <div className="_fl doc-wrap">
                    <h3>Final Documents</h3>

                    <div className="table-listing-app tblt">
                      <div className="table-responsive">
                        <table
                          width="100%"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                        >
                          <tr>
                            <th style={{ width: "20%" }}>Filename</th>
                            <th style={{ width: "20%" }}>Service Type</th>
                            <th style={{ width: "20%" }}>Task ID</th>
                            <th style={{ width: "20%" }}>Last Modified on</th>
                            <th style={{ width: "20%" }}>Notes to 7C</th>
                          </tr>
                          {this.state.allFinalDocs.length > 0 ? (
                            <React.Fragment>
                              {this.state.allFinalDocs.map((data, i) => (
                                <React.Fragment key={i}>
                                  <tr>
                                    <td>
                                      <p onClick={() => this.onDownloadFinalDocs(i)} style={{ cursor: "pointer" }}>{data.docName}</p>
                                    </td>
                                    <td><p>{data.serviceName}</p></td>
                                    <td>
                                      <p>
                                        {data.subTaskNo == 0 ?
                                          data.taskNo :
                                          data.taskNo + "." + data.subTaskNo
                                        }
                                      </p>
                                    </td>
                                    <td>
                                      <p>
                                        {SetDateFormat(data.lastUpdated) +
                                          " | " +
                                          SetTimeFormat(data.lastUpdated)}
                                      </p>
                                    </td>
                                    <td>
                                      <p className="tr_notes_p">
                                        <span
                                          className="tr_nl"
                                          data-toggle="tooltip"
                                          title={data.notes}>
                                          Instructed : {textTruncate(data.notes, 30)}
                                        </span>
                                        {data.userNotes === "" ? <></> :
                                          <span
                                            className="tr_nl"
                                            data-toggle="tooltip"
                                            title={data.notes}>
                                            User :  {textTruncate(data.userNotes, 45)}
                                          </span>
                                        }
                                      </p>
                                    </td>
                                  </tr>
                                </React.Fragment>
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
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tab-pane" id="vendoroff">
                <div className="job-section-tab">
                  <div className="table-listing-app">
                    <div className="table-responsive">
                      <table
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >
                        <tbody>
                          <tr>
                            {this.state.quoteStatus === 8 ? (
                              <React.Fragment></React.Fragment>
                            ) : (
                              <React.Fragment>
                                <th style={{ width: "5%" }}>
                                  <label className="custom_check2">
                                    <input
                                      type="checkbox"
                                      checked={this.state.allChecked}
                                      onClick={this.allVendorCheck}
                                    />
                                    <span className="checkmark2"></span>
                                  </label>
                                </th>
                              </React.Fragment>
                            )}
                            <th style={{ width: "30%" }}>Name / Agency</th>
                            <th style={{ width: "20%" }}>Email </th>
                            <th style={{ width: "20%" }}>Phone Number</th>
                            <th style={{ width: "10%" }}>Ratings</th>
                            {this.state.quoteStatus === 8 ? (
                              <React.Fragment>
                                <th style={{ width: "15%" }}>Status</th>
                              </React.Fragment>
                            ) : (
                              <th style={{ width: "15%" }}>Status</th>
                            )}
                          </tr>
                        </tbody>
                        <tbody>
                          {this.state.listData.map((item, key) => (
                            <tr key={key}>
                              {this.state.quoteStatus === 8 ? (
                                <React.Fragment></React.Fragment>
                              ) : (
                                <React.Fragment>
                                  <td style={{ width: "5%" }}>
                                    <label className="custom_check2">
                                      <input
                                        type="checkbox"
                                        defaultChecked={
                                          item.isQuoteSent === 1 ? true : false
                                        }
                                        onChange={(e) =>
                                          this.listChecked(e, key)
                                        }
                                      />

                                      <span className="checkmark2"></span>
                                    </label>
                                  </td>
                                </React.Fragment>
                              )}
                              <td style={{ width: "30%" }}>
                                {item.agencyName === ""
                                  ? item.fName + " " + item.lName
                                  : item.fName +
                                  " " +
                                  item.lName +
                                  " (" +
                                  item.agencyName +
                                  ")"}
                              </td>
                              <td style={{ width: "20%" }}>
                                <a href="" className="viewlink">
                                  {item.email}
                                </a>
                              </td>
                              <td style={{ width: "20%" }}>+1 {item.mobile}</td>
                              <td style={{ width: "10%" }}>
                                <img src={ImageName.IMAGE_NAME.STARYELLOW} />
                                <span className="rat_txt">{item.ratings}</span>
                              </td>
                              {/* <td style={{ width: "10%" }}>
                                <a
                                  href="javascript:void(0)"
                                  className="view"
                                  style={{
                                    cursor: "pointer",
                                    color: "green",
                                  }}
                                  onClick={()=>this.handleViewModal(item.userId)}
                                >
                                  View
                                </a>
                              </td> */}

                              {this.state.quoteStatus === 8 ? (
                                <React.Fragment>
                                  <td style={{ width: "15%" }}>
                                    {item.status === 2 ? (
                                      <>
                                        <span
                                          style={{
                                            color: "green",
                                            fontSize: "12px",
                                          }}
                                        >
                                          Assigned
                                        </span>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </td>
                                </React.Fragment>
                              ) : (
                                <React.Fragment>
                                  <td style={{ width: "15%" }}>
                                    {/* {item.status === 0 ?
                                    <a href="javascript:void(0)">
                                      <img src={ImageName.IMAGE_NAME.EYE_BTN} onClick={() => { this.handleBidModal(item.userId) }} />
                                    </a> :
                                    <React.Fragment></React.Fragment>
                                  } */}
                                  </td>
                                </React.Fragment>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {this.state.quoteStatus === 8 ? (
                    <React.Fragment></React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div className="_button-style _fl text-center margin-top-30">
                        <a
                          href="javascript:void(0)"
                          className="grey-btn"
                          style={{ textDecoration: "none" }}
                        >
                          Reset
                        </a>
                        <a
                          href="javascript:void(0)"
                          className="blue-btn"
                          style={{ textDecoration: "none" }}
                          onClick={this.handleVendorAssign}
                        >
                          Send Offer
                        </a>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>

              <div className="tab-pane" id="clientdetails">
                <div className="job-section-tab">
                  <h3>Client Information</h3>
                  <div className="c-l-s _fl">
                    <div className="row">
                      <div className="col-md-4">
                        <h4>First Name</h4>
                        <p>{this.state.clientFirstName}</p>
                      </div>
                      <div className="col-md-4">
                        <h4>Last Name</h4>
                        <p>{this.state.clientLastName}</p>
                      </div>
                      <div className="col-md-4">
                        <h4>Client</h4>
                        <p>
                          <span className="blue">{this.state.clientName}</span>
                        </p>
                      </div>
                      <div className="col-md-4">
                        <h4>Email ID</h4>
                        <p>{this.state.clientEmailId}</p>
                      </div>
                      <div className="col-md-4">
                        <h4>Phone Number</h4>
                        <p>
                          +{this.state.countryCode} {this.state.clientPhone}
                        </p>
                      </div>
                      <div className="col-md-4">
                        <h4>Industry Type</h4>
                        <p>{this.state.clientIndustryType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tab-pane" id="chattab">
                <div className="job-section-tab">
                  <div className="chat-app-information-component">
                    <div className="prticipants-area _fl">
                      <div className="row">
                        <div className="col-md-6">
                          <h3>3 Participants</h3>
                        </div>

                        <div className="col-md-6">
                          <a href="#" className="add-part-btn">
                            Add Participants
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="chat-app-component">
                      <div className="participants-chat-row">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.LOGO1} />
                        </figure>
                        <div className="chatinfo-bx">
                          <p className="cht-user">
                            <b>Admin ID</b> <span>10:20 AM</span>
                          </p>
                          <p className="chat-text">
                            Kindly check milestones, added bellowKindly check
                            milestones, added bellowKindly check milestones,
                            awKindly check milestones, added bellow
                          </p>
                        </div>
                      </div>
                      <div className="participants-chat-row">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.LOGO1} />
                        </figure>
                        <div className="chatinfo-bx">
                          <p className="cht-user">
                            <b>Admin ID</b> <span>10:20 AM</span>
                          </p>
                          <p className="chat-text">
                            Kindly check milestones, added bellowKindly check
                            milestones, added bellowKindly check milestones,
                            awKindly check milestones, added bellow
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="chat-app-component">
                      <div className="participants-chat-row reply">
                        <div className="chatinfo-bx">
                          <p className="cht-user">
                            <b>Admin ID</b> <span>10:20 AM</span>
                          </p>
                          <p className="chat-text">
                            Kindly check milestones, added bellowKindly check
                            milestones, added bellowKindly check milestones,
                            awKindly check milestones, added bellow
                          </p>
                        </div>
                      </div>
                      <div className="participants-chat-row">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.LOGO1} />
                        </figure>
                        <div className="chatinfo-bx">
                          <p className="cht-user">
                            <b>Admin ID</b> <span>10:20 AM</span>
                          </p>
                          <p className="chat-text">
                            Kindly check milestones, added bellowKindly check
                            milestones, added bellowKindly check milestones,
                            awKindly check milestones, added bellow
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chat-app-type-area">
                    <input
                      type="text"
                      value=""
                      name=""
                      className="chat-field-bx"
                    />
                    <button type="submit" className="send-btn-app">
                      send
                    </button>
                  </div>
                </div>
              </div>

              <div className="tab-pane" id="nofifications">
                Notification
              </div>
            </div>
          </div>
        </div>

        <div id="viewModal" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="filter-head _fl document-hd">
                <h3 className="text-center center-text">
                  Interpreter Availability
                </h3>
                <button
                  type="button"
                  className="close"
                  onClick={() => this.closeViewModal()}
                >
                  X
                </button>
              </div>

              <div className="modal-body">
                <div className="table-listing-app card">
                  <div className="table-responsive">
                    {/* {consoleLog(
                      "Available Data HTML>>",
                      this.state.availabileData.Tuesday
                    )} */}
                    {Object.keys(this.state.availabileData).length > 0 ? (
                      <BidModal value={this.state.availabileData} />
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                  </div>
                </div>

                <div className="_button-style _fl text-center">
                  {/* <a className="grey-btn" onClick={() => this.closeModal()}>cancel</a> */}
                  {/* <a className="blue-btn">save</a> */}
                  {/* <a href="#" className="buledark-btn">save & reverse</a> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* //...................... For Bid show Modal....................... */}
        <div
          id="bid-modal"
          className="modal fade modelwindow largewindow"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-body p30">
                <div className="mtch-top-text">
                  <p>
                    <span>Project ID</span> {this.state.jobId}
                  </p>
                  <p>
                    <span>Service</span> {this.state.bidtaskType}
                  </p>
                  <p>
                    <span>Task</span> {this.state.bidTask}
                  </p>
                  <p>
                    <span>Client Name</span>
                    {this.state.clientName}
                  </p>
                </div>

                <div className="mv-text _fl">
                  <h2>Matching Vendor</h2>
                </div>

                <div className="matching-vendor-table _fl sdw">
                  <div className="depr_table p10">
                    <div className="table-responsive">
                      <table
                        width="100%"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tbody>
                          <tr>
                            <th style={{ width: "60%" }}>Vendor Name</th>
                            {this.state.bidVendorDetails.length > 0 ? (
                              <React.Fragment>
                                {this.state.bidVendorDetails.map((data) => (
                                  <React.Fragment>
                                    <th
                                      style={{ width: this.state.bidWidth }}
                                      className="th_1"
                                    >
                                      {data.name}
                                    </th>
                                  </React.Fragment>
                                ))}
                              </React.Fragment>
                            ) : (
                              <React.Fragment></React.Fragment>
                            )}
                          </tr>
                          <tr>
                            <td>Action/Status</td>
                            {this.state.bidVendorDetails.length > 0 ? (
                              <React.Fragment>
                                {this.state.bidVendorDetails.map((data) => (
                                  <React.Fragment>
                                    {data.status === 1 ? (
                                      <React.Fragment>
                                        <td className="accept">Accepted</td>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        {data.status == 5 ? (
                                          <td className="reject">Rejected</td>
                                        ) : (
                                          <React.Fragment>
                                            <td style={{ color: "orange" }}>
                                              Pending
                                            </td>
                                          </React.Fragment>
                                        )}
                                      </React.Fragment>
                                    )}
                                  </React.Fragment>
                                ))}
                              </React.Fragment>
                            ) : (
                              <React.Fragment></React.Fragment>
                            )}
                          </tr>
                          <tr>
                            <td>Aproximate Word count</td>
                            {this.state.bidVendorDetails.length > 0 ? (
                              <React.Fragment>
                                {this.state.bidVendorDetails.map((data) => (
                                  <React.Fragment>
                                    {data.status === 1 ? (
                                      <td
                                        style={{ width: this.state.bidWidth }}
                                      >
                                        {data.wordCount}
                                      </td>
                                    ) : (
                                      <td
                                        style={{ width: this.state.bidWidth }}
                                      >
                                        ....
                                      </td>
                                    )}
                                  </React.Fragment>
                                ))}
                              </React.Fragment>
                            ) : (
                              <React.Fragment></React.Fragment>
                            )}
                          </tr>

                          <tr>
                            <td>Unit/Word Cost</td>
                            {this.state.bidVendorDetails.length > 0 ? (
                              <React.Fragment>
                                {this.state.bidVendorDetails.map((data) => (
                                  <React.Fragment>
                                    {data.status === 1 ? (
                                      <td
                                        style={{ width: this.state.bidWidth }}
                                      >
                                        $ {data.bidFee}
                                      </td>
                                    ) : (
                                      <td
                                        style={{ width: this.state.bidWidth }}
                                      >
                                        ....
                                      </td>
                                    )}
                                  </React.Fragment>
                                ))}
                              </React.Fragment>
                            ) : (
                              <React.Fragment></React.Fragment>
                            )}
                          </tr>
                          <tr>
                            <td>Aproximate DTP hours</td>
                            {this.state.bidVendorDetails.length > 0 ? (
                              <React.Fragment>
                                {this.state.bidVendorDetails.map((data) => (
                                  <React.Fragment>
                                    {data.status === 1 ? (
                                      <td
                                        style={{ width: this.state.bidWidth }}
                                      >
                                        {data.additionalFees.dtpHour}
                                      </td>
                                    ) : (
                                      <td
                                        style={{ width: this.state.bidWidth }}
                                      >
                                        ....
                                      </td>
                                    )}
                                  </React.Fragment>
                                ))}
                              </React.Fragment>
                            ) : (
                              <React.Fragment></React.Fragment>
                            )}
                          </tr>
                          <tr>
                            <td>DTP/Hour Rate</td>
                            {this.state.bidVendorDetails.length > 0 ? (
                              <React.Fragment>
                                {this.state.bidVendorDetails.map((data) => (
                                  <React.Fragment>
                                    {data.status === 1 ? (
                                      <td
                                        style={{ width: this.state.bidWidth }}
                                      >
                                        $ {data.additionalFees.dtpHourRate}
                                      </td>
                                    ) : (
                                      <td
                                        style={{ width: this.state.bidWidth }}
                                      >
                                        ....
                                      </td>
                                    )}
                                  </React.Fragment>
                                ))}
                              </React.Fragment>
                            ) : (
                              <React.Fragment></React.Fragment>
                            )}
                          </tr>

                          <tr className="tt-count">
                            <td className="f1">Total Quote</td>
                            {this.state.bidVendorDetails.length > 0 ? (
                              <React.Fragment>
                                {this.state.bidVendorDetails.map((data) => (
                                  <React.Fragment>
                                    {data.status === 1 ? (
                                      <td
                                        style={{
                                          width: this.state.bidWidth,
                                          color: "green",
                                        }}
                                      >
                                        $ {data.totalBidFee}
                                      </td>
                                    ) : (
                                      <td
                                        style={{ width: this.state.bidWidth }}
                                      >
                                        ....
                                      </td>
                                    )}
                                  </React.Fragment>
                                ))}
                              </React.Fragment>
                            ) : (
                              <React.Fragment></React.Fragment>
                            )}
                          </tr>
                          <tr>
                            <td>&nbsp;</td>
                            {this.state.bidVendorDetails.length > 0 ? (
                              <React.Fragment>
                                {this.state.bidVendorDetails.map((data, i) => (
                                  <React.Fragment key={i}>
                                    {data.status === 1 ? (
                                      <React.Fragment>
                                        <td>
                                          <a
                                            className="bidAssignBtn"
                                            onClick={() =>
                                              this.vendorAssigned(i)
                                            }
                                          >
                                            Assign
                                          </a>
                                        </td>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        {/* {data.status === 2 ?
                                      <td className="reject" >Rejected</td> : <React.Fragment>
                                        <td style={{ color: "orange" }}>Pending</td>
                                      </React.Fragment>
                                    } */}
                                      </React.Fragment>
                                    )}
                                  </React.Fragment>
                                ))}
                              </React.Fragment>
                            ) : (
                              <React.Fragment></React.Fragment>
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ..................Decline modal................................. */}
        <div id="review-modal" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-md modal-dialog-centered decline-modal-width">
            <div className="modal-content" style={{ width: "100%" }}>
              <div className="cancel-job-head">
                <div className="row">
                  <div className="col-md-12">
                    <h2>Under Review Notes</h2>
                    <button className="close-page">
                      <img
                        src={ImageName.IMAGE_NAME.CLOSE_BTN_3}
                        onClick={this.closeReviewModal}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-body">
                <div className="create-jeneral-wrap _fl">
                  <div className="create-row-app">
                    <div className="row" style={{ marginBottom: "15px" }}>
                      <div className="col-md-12">
                        <div className="web-form-app">
                          <div className="web-form-bx selct">
                            <div className="frm-label lblSize">Notes</div>
                            <div
                              className="form-input-fields"
                              style={{ marginBottom: "20px" }}
                            >
                              <textarea
                                value={this.state.reviewNote}
                                placeholder=""
                                style={{ resize: "none" }}
                                className="in-textarea msg min table-style"
                                onChange={this.onReviewNoteChange}
                              ></textarea>
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
                              href="javascript:void(0)"
                              className="white-btn"
                              onClick={this.closeReviewModal}
                              style={{ textDecoration: "none" }}
                            >
                              cancel
                            </a>
                            <a
                              href="javascript:void(0)"
                              className="blue-btn"
                              style={{ textDecoration: "none" }}
                              onClick={this.sentUnderReview}
                            >
                              Sent
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

        {/* ...............Vendor List Modal............... */}
        <div id="vendor_list_modal" class="modal fade modelwindow full" role="dialog">
          <div class="modal-dialog modal-dialog-centered modal-lg">

            {/* <!-- Modal content--> */}
            <div class="modal-content">
              <div class="modal-body inset-padding">

                <div class="_fl list_head-row">
                  <div class="row">
                    <div class="col-md-8">
                      <ul>
                        <li>{this.state.vendorListModalDetails.serviceName}</li>
                        <li><a href="javascript:void(0)" style={{ textDecoration: "none" }}>{this.state.vendorListModalDetails.sourceLanguage} {">"}</a></li>
                        <li><a href="javascript:void(0)" style={{ textDecoration: "none" }}>{this.state.vendorListModalDetails.targetLanguage}</a></li>
                      </ul>
                    </div>
                    <div class="col-md-4"><div class="vn_frm">
                      <input type="text" value="" name="" placeholder="Search" class="inputfield flr" />
                    </div>
                    </div>
                  </div>
                </div>

                <div class="table-listing-app">
                  <div class="table-responsive">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tbody>
                        <tr>
                          <th style={{ width: "5%", paddingLeft: "12px" }}> <label class="custom_check2">
                            <input type="checkbox" />
                            <span class="checkmark2"></span></label></th>
                          <th style={{ width: "30%" }}>Name / Agency</th>
                          <th style={{ width: "20%" }}>Email </th>
                          <th style={{ width: "15%" }}>Phone Number</th>
                          <th style={{ width: "10%" }}>Rating</th>
                          {/* <th style={{ width: "10%" }}>Availability</th> */}
                          <th style={{ width: "10%" }}>Status</th>
                        </tr>
                        {this.state.listData.length > 0 ? <React.Fragment>
                          {this.state.listData.map((item, key) => <React.Fragment>
                            <tr>
                              <td colspan="11"><div class="tble-row">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style={{ width: "5%", paddingLeft: "12px" }}><label class="custom_check2">
                                      <input type="checkbox"
                                        defaultChecked={
                                          item.isQuoteSent === 1 ? true : false
                                        }
                                        onChange={(e) =>
                                          this.listChecked(e, key)
                                        } />
                                      <span class="checkmark2"></span></label>
                                    </td>
                                    <td style={{ width: "30%" }}>
                                      {item.agencyName === ""
                                        ? item.fName + " " + item.lName
                                        : item.fName +
                                        " " +
                                        item.lName +
                                        " (" +
                                        item.agencyName +
                                        ")"}
                                    </td>
                                    <td style={{ width: "20%" }}>
                                      <a href="javascript:void(0)" className="viewlink">
                                        {item.email}
                                      </a>
                                    </td>
                                    <td style={{ width: "15%" }}>+1 {item.mobile}</td>
                                    <td style={{ width: "10%" }}>
                                      <img src={ImageName.IMAGE_NAME.STARYELLOW} />
                                      <span className="rat_txt">{item.ratings}</span>
                                    </td>
                                    {/* <td style={{ width: "10%" }}></td> */}
                                    <td style={{ width: "10%" }}></td>
                                  </tr>
                                </table>
                              </div>
                              </td>
                            </tr>
                          </React.Fragment>)}
                        </React.Fragment> : <React.Fragment>
                          <tr>
                            <td colspan="6">No data found</td>
                          </tr>
                        </React.Fragment>}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="_button-style _fl text-center margin-top-30">
                  <a href="javascript:void(0)" style={{ textDecoration: "none" }} className="white-btn" onClick={() => { this.closeVendorListModal() }}>Cancel</a>
                  <a href="javascript:void(0)" style={{ textDecoration: "none", color: "#fff" }} className="blue-btn" onClick={() => { this.handleVendorAssign() }}>Apply</a>
                </div>
              </div>

            </div>

          </div>
        </div>

        <div
          class="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>


        <Modal
          open={this.state.actionModal}
          onClose={this.closeActionModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleCancelModal}>
            <div className="doc_action_modal">
              <div className="row">
                <div className="web-form-bx">
                  Action :
                  <div
                    className="dropdwn"
                    style={{ width: "100%" }}
                  >
                    <Select
                      styles={customStyles}
                      name="select"
                      placeholder="Select"
                      components={{
                        DropdownIndicator,
                        IndicatorSeparator: () => null,
                      }}
                      value={this.state.selectedModalActionArr}
                      options={this.state.modalActionArr}
                      onChange={(value) =>
                        this.onSourceDocActionChange(value)
                      }
                    />

                  </div>
                </div>
              </div>
              <div className="row">
                <div className="web-form-bx">
                  Notes :
                  <div className="form-input-fields">
                    <textarea
                      value={this.state.modalNotes}
                      placeholder=""
                      className="in-textarea msg min table-style"
                      onChange={this.actionModalNotesChange}
                      style={{ resize: "none" }}
                    ></textarea>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="web-form-bx selct">
                    <div className="_button-style _fl text-center">
                      <a
                        href="javascript:void(0)"
                        className="white-btn"
                        onClick={() => this.closeActionModal()}
                        style={{ textDecoration: "none" }}
                      >
                        close
                      </a>
                      <a
                        href="javascript:void(0)"
                        className="blue-btn"
                        style={{ textDecoration: "none", color: "#fff" }}
                        onClick={() => this.onSubmitActionDocument()}
                      >
                        submit
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </React.Fragment >
    );
  }
}

class BidModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <th style={{ width: "14%" }}>Sunday</th>
            <th style={{ width: "14%" }}>Monday</th>
            <th style={{ width: "14%" }}>Tuesday</th>
            <th style={{ width: "14%" }}>Wednesday</th>
            <th style={{ width: "14%" }}>Thursday</th>
            <th style={{ width: "14%" }}>Friday</th>
            <th style={{ width: "14%" }}>Saturday</th>
          </tr>
          <tr>
            <td
              style={{
                justifyContent: "center",
              }}
            >
              {this.props.value.Sunday.map((obj) => (
                <React.Fragment>
                  <div>
                    {obj.serviceName.split(",").map((item) => (
                      <div className="f2f_rate">{item}</div>
                    ))}
                    <div
                      style={{
                        marginLeft: "5px",
                        marginTop: "8px",
                      }}
                    >
                      {obj.startTime} - {obj.endTime}
                    </div>
                  </div>
                  <br />
                </React.Fragment>
              ))}
            </td>
            {/* .............monday................. */}
            <td
              style={{
                justifyContent: "center",
              }}
            >
              {this.props.value.Monday.map((obj) => (
                <React.Fragment>
                  <div>
                    {obj.serviceName.split(",").map((item) => (
                      <div className="f2f_rate">{item}</div>
                    ))}
                    <div
                      style={{
                        marginLeft: "5px",
                        marginTop: "8px",
                      }}
                    >
                      {obj.startTime} - {obj.endTime}
                    </div>
                  </div>
                  <br />
                </React.Fragment>
              ))}
            </td>
            {/* ..............Tuesday................ */}
            <td
              style={{
                justifyContent: "center",
              }}
            >
              {this.props.value.Tuesday.map((obj) => (
                <React.Fragment>
                  <div>
                    {obj.serviceName.split(",").map((item) => (
                      <div className="f2f_rate">{item}</div>
                    ))}
                    <div
                      style={{
                        marginLeft: "5px",
                        marginTop: "8px",
                      }}
                    >
                      {obj.startTime} - {obj.endTime}
                    </div>
                  </div>
                  <br />
                </React.Fragment>
              ))}
            </td>
            {/* ..........wednesday............... */}
            <td
              style={{
                justifyContent: "center",
              }}
            >
              {this.props.value.Wednesday.map((obj) => (
                <React.Fragment>
                  <div>
                    {obj.serviceName.split(",").map((item) => (
                      <div className="f2f_rate">{item}</div>
                    ))}
                    <div
                      style={{
                        marginLeft: "5px",
                        marginTop: "8px",
                      }}
                    >
                      {obj.startTime} - {obj.endTime}
                    </div>
                  </div>
                  <br />
                </React.Fragment>
              ))}
            </td>
            {/* ................thursday............... */}
            <td
              style={{
                justifyContent: "center",
              }}
            >
              {this.props.value.Thursday.map((obj) => (
                <React.Fragment>
                  <div>
                    {obj.serviceName.split(",").map((item) => (
                      <div className="f2f_rate">{item}</div>
                    ))}
                    <div
                      style={{
                        marginLeft: "5px",
                        marginTop: "8px",
                      }}
                    >
                      {obj.startTime} - {obj.endTime}
                    </div>
                  </div>
                  <br />
                </React.Fragment>
              ))}
            </td>
            {/* ............friday.................... */}
            <td
              style={{
                justifyContent: "center",
              }}
            >
              {this.props.value.Friday.map((obj) => (
                <React.Fragment>
                  <div>
                    {obj.serviceName.split(",").map((item) => (
                      <div className="f2f_rate">{item}</div>
                    ))}
                    <div
                      style={{
                        marginLeft: "5px",
                        marginTop: "8px",
                      }}
                    >
                      {obj.startTime} - {obj.endTime}
                    </div>
                  </div>
                  <br />
                </React.Fragment>
              ))}
            </td>
            {/* ................saturday.......... */}
            <td
              style={{
                justifyContent: "center",
              }}
            >
              {this.props.value.Saturday.map((obj) => (
                <React.Fragment>
                  <div>
                    {obj.serviceName.split(",").map((item) => (
                      <div className="f2f_rate">{item}</div>
                    ))}
                    <div
                      style={{
                        marginLeft: "5px",
                        marginTop: "8px",
                      }}
                    >
                      {obj.startTime} - {obj.endTime}
                    </div>
                  </div>
                  <br />
                </React.Fragment>
              ))}
            </td>
          </tr>
        </table>
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
