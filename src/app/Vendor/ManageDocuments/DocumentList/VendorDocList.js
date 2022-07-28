import React from "react";
import { AlertMessage, ImageName } from "../../../../enums";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import $ from "jquery";
import "./vendorDocumentList.css";
import axios from "axios";
import {
  IMAGE_PATH_ONLY,
  IMAGE_STORE_PATH,
  IMAGE_URL,
  VENDOR_IDENTIFICATION_DOCS,
} from "../../../../services/config/api_url";
import { Decoder, Encoder } from "../../../../services/auth";
import {
  consoleLog,
  SetDateFormat,
  SetTimeFormat,
} from "../../../../services/common-function";
import history from "../../../../history";
import { ApiCall, ApiCallVendor } from "../../../../services/middleware";
import { ErrorCode } from "../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";
import { inputEmptyValidate } from "../../../../validators";
import ReactLoader from "../../../Loader";
import SmallReactLoader from "../../../Loader/SmallLoader";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  PaginationDropdown,
  SelectBox,
} from "../../../Admin/SharedComponents/inputText";
import { Link } from "react-router-dom";
import { COMMON } from "../../../../services/constant/connpmData";



export default class VendorDocList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      hidden: false,
      isOpen: false,

      anchorEl: null,
      imagePath: "",
      userId: "",
      docName: "",
      contractId: 0,

      drivingName: "Driving License",
      passportName: "Passport",
      ssnName: "SSN",
      govtName: "Govt Issued ID Card",
      recordsName: "Immunization Records",
      docPath: "",

      drivingVerificationStatus: 0,
      passportVerificationStatus: 0,
      ssnVerificationStatus: 0,
      govtVerificationStatus: 0,
      recordsVerificationStatus: 0,

      isDrivingFrontLoad: true,
      isDrivingBackLoad: true,
      isPassportFrontLoad: true,
      isPassportBackLoad: true,
      isSsnFrontLoad: true,
      isSsnBackLoad: true,
      isGovtFrontLoad: true,
      isGovtBackLoad: true,
      isRecordsFrontLoad: true,
      isRecordsBackLoad: true,

      drivingLicenseCheckFront: false,
      drivingLicenseCheckBack: false,
      passportCheckFront: false,
      passportCheckBack: false,
      ssnCheckFront: false,
      ssnCheckBack: false,
      govtCheckFront: false,
      govtCheckBack: false,
      recordsCheckFront: false,
      recordsCheckBack: false,

      adminPhoto: "",
      drivingFrontPhoto: "",
      drivingBackPhoto: "",
      passportFrontPhoto: "",
      passportBackPhoto: "",
      ssnFrontPhoto: "",
      ssnBackPhoto: "",
      govtFrontPhoto: "",
      govtBackPhoto: "",
      recordsFrontPhoto: "",
      recordsBackPhoto: "",

      drivingFrontImagePath: "",
      drivingBackImagePath: "",
      passportFrontImagePath: "",
      passportBackImagePath: "",
      ssnFrontImagePath: "",
      ssnBackImagePath: "",
      govtFrontImagePath: "",
      govtBackImagePath: "",
      recordsFrontImagePath: "",
      recordsBackImagePath: "",

      current_page: 1,
      total_page: 10,
      limit: 20,
      curIndex: 0,
      workingId: 0,
      anchorEl: null, //menu button
      listData: [],
      name: "",
      email: "",
      mobile: "",
      showId: "",
      identificationDocs: [],
      id_modalFront: "",
      id_modalBack: "",
      declineMessage: "",
      setDocumentId: "",
      allContractListData: [],
      allTrainingData: [],
      view_modal_id: "",

      selectedDisplayData: {
        label: "20",
        value: "20",
      },
    };
    // ...............
  }

  componentDidMount() {
    // let mainData = this.props.location;
    // let preData = mainData.state;
    // if (preData === undefined) {
    //   return history.push("/adminVendorRegistration");
    // }
    // // console.log("My id path>>>>", preData)
    // this.setState({
    //   showId: preData,
    // });

    window.scrollTo(0, 0);

    var classInstance = this;

    var deleteModal = document.getElementById("delete-model");
    var imageModal = document.getElementById("image-model");
    window.onclick = function (event) {
      if (event.target === deleteModal) {
        classInstance.closeDeleteModal();
      } else if (event.target === imageModal) {
        classInstance.closeImageModal();
      }
    };

    window.$(".verificaiton-doc-tab ul li").on("click", function () {
      $(".verificaiton-doc-tab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
    });

    // When the user clicks anywhere outside of the modal, close it

    var modal = document.getElementById("view-docs-modal");
    window.onclick = function (event) {
      if (event.target == modal) {
        classInstance.closeViewDocsModal();
      }
    };
    // this.vendorDocsDataApi(preData);
    this.load();
  }

  load = () => {
    this.setState({
      isDrivingFrontLoad: false,
      isDrivingBackLoad: false,
      isPassportFrontLoad: false,
      isPassportBackLoad: false,
      isSsnFrontLoad: false,
      isSsnBackLoad: false,
      isGovtFrontLoad: false,
      isGovtBackLoad: false,
      isRecordsFrontLoad: false,
      isRecordsBackLoad: false,
    });

    this.listApi();
  };

  listApi = async () => {
    let drivingDoc = {},
      passportDoc = {},
      ssnDoc = {},
      govtDoc = {},
      contractDecodeData = [],
      educationDecodeData = [],
      recordDoc = {};
    let auth = Decoder.decode(localStorage.getItem("AuthToken"));
    // consoleLog("))))))))", auth);

    let data = { userId: auth.data.userid };
    let res = await ApiCallVendor("getVendorIdentificationDoc", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      consoleLog("identify docs:::", decodeData);

      if (decodeData.data.length > 0) {

        drivingDoc = decodeData.data[0];
        passportDoc = decodeData.data[1];
        ssnDoc = decodeData.data[2];
        govtDoc = decodeData.data[3];
        if (decodeData.data.length > 4) {
          recordDoc = decodeData.data[4];
          this.setState({
            recordsFrontImagePath: Object.keys(recordDoc).length > 0 ? IMAGE_PATH_ONLY + recordDoc.documentPath : "",
            recordsBackImagePath: Object.keys(recordDoc).length > 0 ? IMAGE_PATH_ONLY + recordDoc.altDocumentPath : "",
            recordsFrontPhoto: recordDoc.documentPath,
            recordsBackPhoto: recordDoc.altDocumentPath,
            recordsName: recordDoc.documentName,
            recordsVerificationStatus: recordDoc.verificationStatus,
            recordsCheckFront: recordDoc.verificationStatus === 0 ? true : false,
            recordsCheckBack: recordDoc.verificationStatus === 0 ? true : false,
          })
        }

        this.setState({
          drivingFrontImagePath: IMAGE_PATH_ONLY + drivingDoc.documentPath,
          drivingBackImagePath: IMAGE_PATH_ONLY + drivingDoc.altDocumentPath,
          passportFrontImagePath: IMAGE_PATH_ONLY + passportDoc.documentPath,
          passportBackImagePath: IMAGE_PATH_ONLY + passportDoc.altDocumentPath,
          ssnFrontImagePath: IMAGE_PATH_ONLY + ssnDoc.documentPath,
          ssnBackImagePath: IMAGE_PATH_ONLY + ssnDoc.altDocumentPath,
          govtFrontImagePath: IMAGE_PATH_ONLY + govtDoc.documentPath,
          govtBackImagePath: IMAGE_PATH_ONLY + govtDoc.altDocumentPath,

          drivingFrontPhoto: drivingDoc.documentPath,
          drivingBackPhoto: drivingDoc.altDocumentPath,
          passportFrontPhoto: passportDoc.documentPath,
          passportBackPhoto: passportDoc.altDocumentPath,
          ssnFrontPhoto: ssnDoc.documentPath,
          ssnBackPhoto: ssnDoc.altDocumentPath,
          govtFrontPhoto: govtDoc.documentPath,
          govtBackPhoto: govtDoc.altDocumentPath,

          // drivingName: drivingDoc.documentName,
          // passportName: passportDoc.documentName,
          // ssnName: ssnDoc.documentName,
          // govtName: govtDoc.documentName,
          drivingVerificationStatus: drivingDoc.verificationStatus,
          passportVerificationStatus: passportDoc.verificationStatus,
          ssnVerificationStatus: ssnDoc.verificationStatus,
          govtVerificationStatus: govtDoc.verificationStatus,
          drivingLicenseCheckFront:
            drivingDoc.verificationStatus === 0 ? true : false,
          drivingLicenseCheckBack:
            drivingDoc.verificationStatus === 0 ? true : false,
          passportCheckFront: passportDoc.verificationStatus === 0 ? true : false,
          passportCheckBack: passportDoc.verificationStatus === 0 ? true : false,
          ssnCheckFront: ssnDoc.verificationStatus === 0 ? true : false,
          ssnCheckBack: ssnDoc.verificationStatus === 0 ? true : false,
          govtCheckFront: govtDoc.verificationStatus === 0 ? true : false,
          govtCheckBack: govtDoc.verificationStatus === 0 ? true : false,


        })
      }
    }

    // ...................contracts.......................

    let contractRes = await ApiCallVendor("getVendorContracts");
    if (
      contractRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      contractRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      contractDecodeData = Decoder.decode(contractRes.data.payload);

      consoleLog("ContraACTS::", contractDecodeData);
    }

    // ...............education training................
    let educationRes = await ApiCallVendor("getvendorCertificateList", data);
    if (
      educationRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      educationRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      educationDecodeData = Decoder.decode(educationRes.data.payload);

      consoleLog("education training", educationDecodeData);
    }

    this.setState({
      // ..........contract.............
      allContractListData: contractDecodeData.data,

      allTrainingData: educationDecodeData.data,
    });
  };

  openDeleteModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("delete-model").style.display = "block";
    document.getElementById("delete-model").classList.add("show");
  };

  closeDeleteModal = () => {
    document.getElementById("backdrop").style.display = "none";

    document.getElementById("delete-model").style.display = "none";
    document.getElementById("delete-model").classList.remove("show");
  };
  openImageModal = (value) => {
    // consoleLog("()()()()()(", value);
    if (value === "drivingFront") {
      let drivingFront = this.state.drivingFrontImagePath;
      this.setState({
        imagePath: drivingFront,
      });
    } else if (value === "drivingBack") {
      let drivingBack = this.state.drivingBackImagePath;
      this.setState({
        imagePath: drivingBack,
      });
    } else if (value === "passportFront") {
      let passportFront = this.state.passportBackImagePath;
      this.setState({
        imagePath: passportFront,
      });
    } else if (value === "passportBack") {
      let passportBack = this.state.passportBackImagePath;
      this.setState({
        imagePath: passportBack,
      });
    } else if (value === "ssnFront") {
      let ssnFront = this.state.ssnFrontImagePath;
      this.setState({
        imagePath: ssnFront,
      });
    } else if (value === "ssnBack") {
      let ssnBack = this.state.ssnBackImagePath;
      this.setState({
        imagePath: ssnBack,
      });
    } else if (value === "govtFront") {
      let govtFront = this.state.govtFrontImagePath;
      this.setState({
        imagePath: govtFront,
      });
    } else if (value === "govtBack") {
      let govtBack = this.state.govtBackImagePath;
      this.setState({
        imagePath: govtBack,
      });
    } else if (value === "recordsFront") {
      let recordsFront = this.state.recordsFrontImagePath;
      this.setState({
        imagePath: recordsFront,
      });
    } else if (value === "recordsBack") {
      let recordsBack = this.state.recordsBackImagePath;
      this.setState({
        imagePath: recordsBack,
      });
    }

    this.showImageModal();
  };

  showImageModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("image-model").style.display = "block";
    document.getElementById("image-model").classList.add("show");
  };

  closeImageModal = () => {
    document.getElementById("backdrop").style.display = "none";

    document.getElementById("image-model").style.display = "none";
    document.getElementById("image-model").classList.remove("show");
  };

  onCancel = () => {
    // window.$("#delete-modal").modal("hide");
    this.closeDeleteModal();
  };
  //........Page show Limit.........

  onChangeLimit = (obj) => {
    this.setState({
      limit: parseInt(obj.value),
      selectedDisplayData: obj,
    });

    // let resData = {
    //   limit: parseInt(obj.value),
    //   offset: JSON.stringify(
    //     (this.state.current_page - 1) * parseInt(obj.value)
    //   ),
    // };
    // let curData = Object.assign(reqData, resData);

    // this.listApi(curData);
  };

  onDrivingLicenseChange = (e, value) => {
    // consoleLog("val:::", value);
    let stateObj = {};
    const formData = new FormData();

    switch (value) {
      case "front":
        // consoleLog("::::)))))", e.target.files);

        if (e.target.files.length > 0) {
          this.setState({
            isDrivingFrontLoad: true,
          });

          stateObj["drivingLicenseCheckFront"] = true;

          formData.append("file", e.target.files[0]);
          axios.post(IMAGE_URL, formData).then((res) => {
            // consoleLog("res:::", res.data.data);
            this.setState({
              drivingFrontImagePath: res.data.data.url,
              drivingFrontPhoto: res.data.data.path + res.data.data.filename,
              isDrivingFrontLoad: false,
            });
          });
        }

        break;
      case "back":
        // consoleLog("::::", e.target.files[0]);
        if (e.target.files.length > 0) {
          this.setState({
            isDrivingBackLoad: true,
          });
          stateObj["drivingLicenseCheckBack"] = true;
          // const formData = new FormData();
          formData.append("file", e.target.files[0]);
          axios.post(IMAGE_URL, formData).then((res) => {
            // consoleLog("res:::", res.data.data);
            this.setState({
              drivingBackImagePath: res.data.data.url,
              drivingBackPhoto: res.data.data.path + res.data.data.filename,
              isDrivingBackLoad: false,
            });
          });
        }
        break;
    }
    this.setState(stateObj);
  };

  //   ...........for Passport .................

  onPassportChange = (e, value) => {
    // consoleLog("val:::", value);
    let stateObj = {};
    const formData = new FormData();

    switch (value) {
      case "front":
        // consoleLog("::::", e.target.files[0]);
        if (e.target.files.length > 0) {
          this.setState({
            isPassportFrontLoad: true,
          });
          stateObj["passportCheckFront"] = true;

          formData.append("file", e.target.files[0]);
          axios.post(IMAGE_URL, formData).then((res) => {
            // consoleLog("res:::", res.data.data);
            this.setState({
              passportFrontImagePath: res.data.data.url,
              passportFrontPhoto: res.data.data.path + res.data.data.filename,
              isPassportFrontLoad: false,
            });
          });
        }
        break;
      case "back":
        // consoleLog("::::", e.target.files[0]);
        if (e.target.files.length > 0) {
          this.setState({
            isPassportBackLoad: true,
          });
          stateObj["passportCheckBack"] = true;
          // const formData = new FormData();
          formData.append("file", e.target.files[0]);
          axios.post(IMAGE_URL, formData).then((res) => {
            // consoleLog("res:::", res.data.data);
            this.setState({
              passportBackImagePath: res.data.data.url,
              passportBackPhoto: res.data.data.path + res.data.data.filename,
              isPassportBackLoad: false,
            });
          });
        }
        break;
    }
    this.setState(stateObj);
  };

  //   ........for SSN .......................
  onSsnChange = (e, value) => {
    // consoleLog("val:::", value);
    let stateObj = {};
    const formData = new FormData();

    switch (value) {
      case "front":
        // consoleLog("::::", e.target.files[0]);
        if (e.target.files.length > 0) {
          this.setState({
            isSsnFrontLoad: true,
          });
          stateObj["ssnCheckFront"] = true;

          formData.append("file", e.target.files[0]);
          axios.post(IMAGE_URL, formData).then((res) => {
            // consoleLog("res:::", res.data.data);
            this.setState({
              ssnFrontImagePath: res.data.data.url,
              ssnFrontPhoto: res.data.data.path + res.data.data.filename,
              isSsnFrontLoad: false,
            });
          });
        }
        break;
      case "back":
        // consoleLog("::::", e.target.files[0]);
        if (e.target.files.length > 0) {
          this.setState({
            isSsnBackLoad: true,
          });
          stateObj["ssnCheckBack"] = true;
          // const formData = new FormData();
          formData.append("file", e.target.files[0]);
          axios.post(IMAGE_URL, formData).then((res) => {
            // consoleLog("res:::", res.data.data);
            this.setState({
              ssnBackImagePath: res.data.data.url,
              ssnBackPhoto: res.data.data.path + res.data.data.filename,
              isSsnBackLoad: false,
            });
          });
        }
        break;
    }
    this.setState(stateObj);
  };

  //   ........for Govt Id .......................
  onGovtChange = (e, value) => {
    // consoleLog("val:::", value);
    let stateObj = {};
    const formData = new FormData();

    switch (value) {
      case "front":
        // consoleLog("::::", e.target.files[0]);
        if (e.target.files.length > 0) {
          this.setState({
            isGovtFrontLoad: true,
          });
          stateObj["govtCheckFront"] = true;

          formData.append("file", e.target.files[0]);
          axios.post(IMAGE_URL, formData).then((res) => {
            // consoleLog("res:::", res.data.data);
            this.setState({
              govtFrontImagePath: res.data.data.url,
              govtFrontPhoto: res.data.data.path + res.data.data.filename,
              isGovtFrontLoad: false,
            });
          });
        }
        break;
      case "back":
        // consoleLog("::::", e.target.files[0]);
        if (e.target.files.length > 0) {
          this.setState({
            isGovtBackLoad: true,
          });
          stateObj["govtCheckBack"] = true;
          // const formData = new FormData();
          formData.append("file", e.target.files[0]);
          axios.post(IMAGE_URL, formData).then((res) => {
            // consoleLog("res:::", res.data.data);
            this.setState({
              govtBackImagePath: res.data.data.url,
              govtBackPhoto: res.data.data.path + res.data.data.filename,
              isGovtBackLoad: false,
            });
          });
        }
        break;
    }
    this.setState(stateObj);
  };
  //   ........for Immunization Record .......................
  onRecordsChange = (e, value) => {
    // consoleLog("val:::", value);
    let stateObj = {};
    const formData = new FormData();

    switch (value) {
      case "front":
        // consoleLog("::::", e.target.files[0]);
        if (e.target.files.length > 0) {
          this.setState({
            isRecordsFrontLoad: true,
          });
          stateObj["recordsCheckFront"] = true;

          formData.append("file", e.target.files[0]);
          axios.post(IMAGE_URL, formData).then((res) => {
            // consoleLog("res:::", res.data.data);
            this.setState({
              recordsFrontImagePath: res.data.data.url,
              recordsFrontPhoto: res.data.data.path + res.data.data.filename,
              isRecordsFrontLoad: false,
            });
          });
        }
        break;
      case "back":
        // consoleLog("::::", e.target.files[0]);
        if (e.target.files.length > 0) {
          this.setState({
            isRecordsBackLoad: true,
          });
          stateObj["recordsCheckBack"] = true;
          // const formData = new FormData();
          formData.append("file", e.target.files[0]);
          axios.post(IMAGE_URL, formData).then((res) => {
            // consoleLog("res:::", res.data.data);
            this.setState({
              recordsBackImagePath: res.data.data.url,
              recordsBackPhoto: res.data.data.path + res.data.data.filename,
              isRecordsBackLoad: false,
            });
          });
        }
        break;
    }
    this.setState(stateObj);
  };

  onClose = (value) => {
    let stateObj = {};
    // consoleLog(":::::::", value);

    switch (value) {
      case "drivingFront":
        stateObj["drivingLicenseCheckFront"] = false;
        this.setState({
          drivingFrontImagePath: "",
        });
        break;
      case "drivingBack":
        stateObj["drivingLicenseCheckBack"] = false;
        this.setState({
          drivingBackImagePath: "",
        });
        break;
      case "passportFront":
        stateObj["passportCheckFront"] = false;
        this.setState({
          passportFrontImagePath: "",
        });
        break;
      case "passportBack":
        stateObj["passportCheckBack"] = false;
        this.setState({
          passportBackImagePath: "",
        });
        break;
      case "ssnFront":
        stateObj["ssnCheckFront"] = false;
        this.setState({
          ssnFrontImagePath: "",
        });
        break;
      case "ssnBack":
        stateObj["ssnCheckBack"] = false;
        this.setState({
          ssnBackImagePath: "",
        });
        break;
      case "govtFront":
        stateObj["govtCheckFront"] = false;
        this.setState({
          govtFrontImagePath: "",
        });
        break;
      case "govtBack":
        stateObj["govtCheckBack"] = false;
        this.setState({
          govtBackImagePath: "",
        });
        break;
      case "recordsFront":
        stateObj["recordsCheckFront"] = false;
        this.setState({
          recordsFrontImagePath: "",
        });
        break;
      case "recordsBack":
        stateObj["recordsCheckBack"] = false;
        this.setState({
          recordsBackImagePath: "",
        });
        break;
    }

    this.setState(stateObj);
  };
  // handleShowDialog = () => {
  //   this.setState({ isOpen: !this.state.isOpen });
  //   console.log("cliked");
  // };

  deletePage = (index) => {
    this.setState({
      curIndex: index,
      workingId: this.state.allTrainingData[index].id,
    });
    // window.$("#delete-modal").modal("show");
    this.openDeleteModal();
  };
  deleteItem = async () => {
    this.closeDeleteModal();
    let data = {
      id: this.state.workingId,
    };
    let status = await ApiCallVendor("deleteVendorCertificate", data);
    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.load();
      toast.success(AlertMessage.MESSAGE.DELETE.DELETED);
    } else {
      toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
    }
  };
  onSelectTab = (value) => {
    switch (value) {
      case "Contract":
        this.setState({
          flag: false,
        });
        break;
      case "IdentificationDoc":
        this.setState({
          flag: false,
        });
        break;
      case "EducationTraining":
        this.setState({
          flag: true,
        });
        break;
    }
  };
  menuBtnhandleClick = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl: event.currentTarget,
      contractId: this.state.allContractListData[index].id,
    });
  };
  //..............function for MenuButton close..............
  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };
  editPage = (index) => {
    this.props.history.push({
      pathname: "/vendorEditDocument",
      state: this.state.allTrainingData[index],
    });
  };
  onModalClose = () => {
    this.closeImageModal();
  };

  //   ..........add new button.......................
  addNew = () => {
    return history.push("/vendorAddDocument");
  };

  onDownload = (index) => {
    window.open(
      IMAGE_PATH_ONLY + this.state.allContractListData[index].documentPath
    );
  };

  onUploadFile = async (data) => {
    let addDoc = await ApiCallVendor("addVendorContracts", data);
    if (
      addDoc.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      addDoc.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.CONTRACTS.UPLOAD_DOCUMENT);
    }
  };
  onUpload = async (index, e) => {
    let auth = Decoder.decode(localStorage.getItem("AuthToken"));
    var data = {},
      listData = this.state.allContractListData;
    var curInst = this;

    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      if (res.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
        listData[index].documentPath = res.data.data.path + res.data.data.filename;
        curInst.setState({
          userId: auth.data.userid,
          docName: res.data.data.filename,
          docPath: res.data.data.path + res.data.data.filename,
          allContractListData: listData,
        });
        let data = {
          userId: this.state.userId,
          refId: this.state.contractId,
          documentName: res.data.data.filename,
          documentPath: res.data.data.path + res.data.data.filename,
        };
        this.onUploadFile(data);
      }
    });
    // const formData = new FormData();
    // formData.append("file", e.target.files[0]);
    // axios.post(
    //   IMAGE_URL,
    //   formData,
    //   await function (res, err) {
    //     consoleLog("))))))))", err);

    // );
    // data = {
    //   userId: this.state.userId,
    //   refId: this.state.contractId,
    //   documentName: this.state.docName,
    //   documentPath: this.state.docPath,
    // };

    //  if (
    //    addDoc.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    //    addDoc.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    //  ) {
    //    toast.success("File Upload succesfully.");
    //  } else {
    //    toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
    //  }

    // this.setState({
    //   docPath: res.data.data.path + res.data.data.filename,
    // });

    this.handleMenuClose();
  };

  onSave = async () => {
    let auth = Decoder.decode(localStorage.getItem("AuthToken"));
    // consoleLog("))))))))", auth);

    // consoleLog("data:::", this.state.drivingFrontImagePath.length);

    let errorCount = 0;
    if (
      this.state.drivingFrontImagePath.length === 0 ||
      this.state.drivingBackImagePath.length === 0
    ) {
      toast.error("Please select Driving License");

      errorCount++;
    }
    if (
      this.state.passportFrontImagePath.length === 0 ||
      this.state.passportBackImagePath.length === 0
    ) {
      toast.error("Please select Passport");

      errorCount++;
    }
    if (
      this.state.ssnFrontImagePath.length === 0 ||
      this.state.ssnBackImagePath.length === 0
    ) {
      toast.error("Please select SSN");

      errorCount++;
    }
    if (
      this.state.govtFrontImagePath.length === 0 ||
      this.state.govtBackImagePath.length === 0
    ) {
      toast.error("Please select Govt Issued ID Card");

      errorCount++;
    }
    if (
      this.state.recordsFrontImagePath.length > 0 ||
      this.state.recordsBackImagePath.length > 0
    ) {
      if (
        this.state.recordsFrontImagePath.length === 0 ||
        this.state.recordsBackImagePath.length === 0
      ) {
        toast.error("Please select Immunization Records");

        errorCount++;
      }
    }

    if (errorCount === 0) {
      let drivingLicenseObj = {
        documentName: "Driving License",
        documentPath: this.state.drivingFrontPhoto,
        altDocumentPath: this.state.drivingBackPhoto,
      };
      let passportObj = {
        documentName: "Passport",
        documentPath: this.state.passportFrontPhoto,
        altDocumentPath: this.state.passportBackPhoto,
      };
      let ssnObj = {
        documentName: "SSN",
        documentPath: this.state.ssnFrontPhoto,
        altDocumentPath: this.state.ssnBackPhoto,
      };
      let govtObj = {
        documentName: "Govt Issued ID Card",
        documentPath: this.state.govtBackPhoto,
        altDocumentPath: this.state.govtBackPhoto,
      };
      let immunizationtObj = {
        documentName: "Immunization Records",
        documentPath: this.state.recordsFrontPhoto,
        altDocumentPath: this.state.recordsBackPhoto,
      };
      let reqData = [];
      reqData.push(drivingLicenseObj);
      reqData.push(passportObj);
      reqData.push(ssnObj);
      reqData.push(govtObj);
      if (
        this.state.recordsFrontImagePath.length > 0 ||
        this.state.recordsBackImagePath.length > 0
      ) {
        reqData.push(immunizationtObj);
      }
      let objData = { userId: auth.data.userid, doc: reqData };
      consoleLog("obj<<<<<<", objData);
      let responseContractData = await ApiCallVendor(
        "addVendorIdentificationDoc",
        objData
      );

      if (
        responseContractData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        responseContractData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success("Successfully updated");
        window.scrollTo(0, 0);
      } else {
        toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
      }
    }
  };

  render() {
    // window.open(decodeData.data.fileUrl, "_blank");

    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
        <ToastContainer hideProgressBar theme="colored" />

        {/* <Header />
          <Sidebar /> */}
        <div className="component-wrapper">
          <div className="listing-component-app">
            <div
              className="vn_frm"
              style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
            >
              {" "}
              <Link to="/vendorDashboard">Dashboard</Link> / Document
            </div>
            <div className="vendor-info _fl sdw">
              <div className="vn-form _fl">
                <div className="row">
                  <div className="col-md-7">
                    {/* <div className="vn_frm mnp"> <span>Document Name</span>
                                            <input type="text" value="" placeholder="Search" className="inputfield" />
                                        </div> */}
                  </div>
                </div>
              </div>
              <div className="_fl verificaiton-doc-tab">
                <ul>
                  <li
                    className="active"
                    data-related="tble-data-a"
                    onClick={() => this.onSelectTab("Contract")}
                  >
                    Contract
                  </li>
                  <li
                    data-related="tble-data-b"
                    onClick={() => this.onSelectTab("IdentificationDoc")}
                  >
                    indentification docs
                  </li>
                  <li
                    data-related="tble-data-c"
                    onClick={() => this.onSelectTab("EducationTraining")}
                  >
                    <span>Continued</span> Education Training
                  </li>
                </ul>
              </div>
            </div>
            <div className="table-filter-app">
              <div className="table-filter-box">
                {this.state.flag ? (
                  <React.Fragment>
                    <div className="addnew" onClick={this.addNew}>
                      <a href={"javascript:void(0)"}>
                        {/* <a href={void 0}> */}
                        Add New{" "}
                        <img
                          className=""
                          src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                          style={{ width: "25px", cursor: "pointer" }}
                        />
                      </a>
                    </div>
                    <div className="tble-short">
                      <span className="lbl">Display</span>

                      <div className="dropdwn" style={{ width: "90px" }}>
                        <PaginationDropdown
                          optionData={COMMON.DISPLAY_ARR}
                          value={this.state.selectedDisplayData}
                          placeholder="Select"
                          onSelectChange={(value) => {
                            this.onChangeLimit(value);
                          }}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment></React.Fragment>
                )}
              </div>
            </div>
            <div className="tab-app-information activeLnk" id="tble-data-a">
              <div className="table-listing-app">
                <div className="table-responsive">
                  <table
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                  >
                    <tr>
                      <th style={{ width: "30%" }}>Document Name</th>
                      <th style={{ width: "30%" }}>Last Modified On</th>
                      {/* <th style={{ width: "25%" }}>Status</th> */}
                      <th style={{ width: "30%", textAlign: "center" }}>
                        Action
                      </th>
                    </tr>
                    {this.state.allContractListData.length > 0 ? (
                      this.state.allContractListData.map((data, i) => (
                        <tr key={i}>
                          <td colspan="4">
                            <div className="tble-row">
                              <table
                                width="100%"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tr>
                                  <td style={{ width: "30%" }}>{data.name}</td>
                                  <td style={{ width: "30%" }}>
                                    {SetDateFormat(data.date)} |{" "}
                                    {SetTimeFormat(data.date)}
                                  </td>
                                  {/* {data.verificationStatus === 0 ? (
                                      <td style={{ width: "25%" }}>
                                        <span className="Pending_btn">
                                          Pending
                                        </span>
                                      </td>
                                    ) : data.verificationStatus === 1 ? (
                                      <td style={{ width: "25%" }}>
                                        <span className="approve_status_btn">
                                          Verified
                                        </span>
                                      </td>
                                    ) : (
                                      <td style={{ width: "25%" }}>
                                        <span className="declined_btn">
                                          Declined
                                        </span>
                                      </td>
                                    )} */}
                                  <td
                                    style={{
                                      width: "30%",
                                      textAlign: "center",
                                    }}
                                  >
                                    <img
                                      data-toggle="tooltip"
                                      title="Download"
                                      src={
                                        ImageName.IMAGE_NAME.DOWNLOAD_SHEET_ICON
                                      }
                                      style={{
                                        cursor: "pointer",
                                        marginRight: "5px",
                                      }}
                                      onClick={() => this.onDownload(i)}
                                    />
                                    <label for="upload">
                                      <img
                                        data-toggle="tooltip"
                                        title="Upload"
                                        src={ImageName.IMAGE_NAME.UPLOAD_BTN}
                                        style={{
                                          cursor: "pointer",
                                          width: "45px",
                                          marginLeft: "5px",
                                        }}
                                      />
                                      <input
                                        id="upload"
                                        type="file"
                                        onChange={(e) => this.onUpload(i, e)}
                                        style={{ display: "none" }}
                                      />
                                    </label>
                                    {/* <React.Fragment>
                                        <img
                                          // src="/assets_temp/images/edit.png"
                                          src={ImageName.IMAGE_NAME.EDIT_SQUARE}
                                          style={{ cursor: "pointer" }}
                                          id="basic-button"
                                          aria-controls="basic-menu"
                                          aria-haspopup="true"
                                          aria-expanded={
                                            open ? "true" : undefined
                                          }
                                          onClick={(e) =>
                                            this.menuBtnhandleClick(i, e)
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
                                          <MenuItem
                                            onClick={() => this.onDownload(i)}
                                          >
                                            Download
                                          </MenuItem>
                                          <label for="upload">
                                            <MenuItem>
                                              <input
                                                id="upload"
                                                type="file"
                                                onChange={(e) =>
                                                  this.onUpload(i, e)
                                                }
                                                style={{ display: "none" }}
                                              />
                                              Upload
                                            </MenuItem>
                                          </label>
                                        </Menu>
                                      </React.Fragment> */}
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <React.Fragment>
                        <tr style={{ textAlign: "center" }}>
                          <td colSpan="4">
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
            <div className="tab-app-information" id="tble-data-b">
              <div className="table-listing-app">
                <div className="table-responsive">
                  <table
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                  >
                    <tr>
                      <th style={{ width: "30%" }}>Document Type</th>
                      <th style={{ width: "30%" }}>Front Image</th>
                      <th style={{ width: "30%" }}>Back Image</th>
                    </tr>
                    {/* ...................for driving license................. */}
                    <tr>
                      <td colspan="3">
                        <div className="tble-row doc-table-row">
                          <table
                            width="100%"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                          >
                            <tr>
                              <td style={{ width: "30%" }}>
                                {this.state.drivingName}
                              </td>
                              <td style={{ width: "30%" }}>
                                <div
                                  hidden={!this.state.isDrivingFrontLoad}
                                  className="upload-profile doc-img"
                                >
                                  <SmallReactLoader />
                                </div>
                                <div
                                  className="upload-profile doc-img"
                                  hidden={this.state.isDrivingFrontLoad}
                                >
                                  {this.state.drivingLicenseCheckFront ? (
                                    <React.Fragment>
                                      <div
                                        className="cross-btn"
                                        onClick={() =>
                                          this.onClose("drivingFront")
                                        }
                                      >
                                        <img
                                          src={ImageName.IMAGE_NAME.CROSS_BTN}
                                        />
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment />
                                  )}
                                  <label
                                    htmlFor="file-upload"
                                    for="driving_license_front"
                                    className=""
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title={this.state.drivingFrontPhoto === "" ? "" : this.state.drivingFrontPhoto.substring(
                                      8
                                    )}
                                    style={{
                                      cursor: "pointer",
                                      marginBottom: "0px",
                                    }}
                                  // hidden={this.state.onDocLoad}
                                  >
                                    {this.state.drivingFrontImagePath != "" ? (
                                      <React.Fragment>
                                        <div>
                                          <img
                                            style={{
                                              cursor: "pointer",
                                              height: "35px",
                                              width: "40px",
                                            }}
                                            src={
                                              this.state.drivingFrontImagePath
                                            }
                                            onClick={() =>
                                              this.openImageModal(
                                                "drivingFront"
                                              )
                                            }
                                          />
                                        </div>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        <img
                                          style={{ cursor: "pointer" }}
                                          src={
                                            ImageName.IMAGE_NAME
                                              .ADD_WITH_CIRCLE_BG
                                          }
                                        />
                                        {/* <span id="wait">Upload File</span> */}
                                      </React.Fragment>
                                    )}

                                    <input
                                      disabled={
                                        this.state.drivingFrontImagePath != ""
                                          ? true
                                          : false
                                      }
                                      accept="image/*"
                                      type="file"
                                      id="driving_license_front"
                                      style={{ display: "none" }}
                                      onChange={(e) =>
                                        this.onDrivingLicenseChange(e, "front")
                                      }
                                    />
                                  </label>
                                </div>
                              </td>
                              <td style={{ width: "30%" }}>
                                <div
                                  hidden={!this.state.isDrivingBackLoad}
                                  className="upload-profile doc-img"
                                >
                                  <SmallReactLoader />
                                </div>
                                <div
                                  className="upload-profile doc-img"
                                  hidden={this.state.isDrivingBackLoad}
                                >
                                  {this.state.drivingLicenseCheckBack ? (
                                    <React.Fragment>
                                      <div
                                        className="cross-btn"
                                        onClick={() =>
                                          this.onClose("drivingBack")
                                        }
                                      >
                                        <img
                                          src={ImageName.IMAGE_NAME.CROSS_BTN}
                                        />
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment />
                                  )}
                                  <label
                                    htmlFor="file-upload"
                                    for="driving_license_back"
                                    className=""
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title={this.state.drivingBackPhoto.substring(
                                      8
                                    )}
                                    style={{
                                      cursor: "pointer",
                                      marginBottom: "0px",
                                    }}
                                  // hidden={this.state.onDocLoad}
                                  >
                                    {this.state.drivingBackImagePath != "" ? (
                                      <React.Fragment>
                                        <div>
                                          <img
                                            style={{
                                              cursor: "pointer",
                                              height: "35px",
                                              width: "40px",
                                            }}
                                            src={
                                              this.state.drivingBackImagePath
                                            }
                                            onClick={() =>
                                              this.openImageModal("drivingBack")
                                            }
                                          />
                                        </div>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        <img
                                          style={{ cursor: "pointer" }}
                                          src={
                                            ImageName.IMAGE_NAME
                                              .ADD_WITH_CIRCLE_BG
                                          }
                                        />
                                        {/* <span id="wait">Upload File</span> */}
                                      </React.Fragment>
                                    )}

                                    <input
                                      disabled={
                                        this.state.drivingBackImagePath != ""
                                          ? true
                                          : false
                                      }
                                      accept="image/*"
                                      type="file"
                                      id="driving_license_back"
                                      style={{ display: "none" }}
                                      onChange={(e) =>
                                        this.onDrivingLicenseChange(e, "back")
                                      }
                                    />
                                  </label>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                    {/* ...................for passport................. */}
                    <tr>
                      <td colspan="3">
                        <div className="tble-row doc-table-row">
                          <table
                            width="100%"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                          >
                            <tr>
                              <td style={{ width: "30%" }}>
                                {this.state.passportName}
                              </td>
                              <td style={{ width: "30%" }}>
                                <div
                                  hidden={!this.state.isPassportFrontLoad}
                                  className="upload-profile doc-img"
                                >
                                  <SmallReactLoader />
                                </div>
                                <div
                                  className="upload-profile doc-img"
                                  hidden={this.state.isPassportFrontLoad}
                                >
                                  {this.state.passportCheckFront ? (
                                    <React.Fragment>
                                      <div
                                        className="cross-btn"
                                        onClick={() =>
                                          this.onClose("passportFront")
                                        }
                                      >
                                        <img
                                          src={ImageName.IMAGE_NAME.CROSS_BTN}
                                        />
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment />
                                  )}
                                  <label
                                    htmlFor="file-upload"
                                    for="passport_front"
                                    className=""
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title={this.state.passportFrontPhoto.substring(
                                      8
                                    )}
                                    style={{
                                      cursor: "pointer",
                                      marginBottom: "0px",
                                    }}
                                  // hidden={this.state.onDocLoad}
                                  >
                                    {this.state.passportFrontImagePath != "" ? (
                                      <React.Fragment>
                                        <div>
                                          <img
                                            style={{
                                              cursor: "pointer",
                                              height: "35px",
                                              width: "40px",
                                            }}
                                            src={
                                              this.state.passportFrontImagePath
                                            }
                                            onClick={() =>
                                              this.openImageModal(
                                                "passportFront"
                                              )
                                            }
                                          />
                                        </div>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        <img
                                          style={{ cursor: "pointer" }}
                                          src={
                                            ImageName.IMAGE_NAME
                                              .ADD_WITH_CIRCLE_BG
                                          }
                                        />
                                        {/* <span id="wait">Upload File</span> */}
                                      </React.Fragment>
                                    )}

                                    <input
                                      disabled={
                                        this.state.passportFrontImagePath != ""
                                          ? true
                                          : false
                                      }
                                      accept="image/*"
                                      type="file"
                                      id="passport_front"
                                      style={{ display: "none" }}
                                      onChange={(e) =>
                                        this.onPassportChange(e, "front")
                                      }
                                    />
                                  </label>
                                </div>
                              </td>
                              <td style={{ width: "30%" }}>
                                <div
                                  hidden={!this.state.isPassportBackLoad}
                                  className="upload-profile doc-img"
                                >
                                  <SmallReactLoader />
                                </div>
                                <div
                                  className="upload-profile doc-img"
                                  hidden={this.state.isPassportBackLoad}
                                >
                                  {this.state.passportCheckBack ? (
                                    <React.Fragment>
                                      <div
                                        className="cross-btn"
                                        onClick={() =>
                                          this.onClose("passportBack")
                                        }
                                      >
                                        <img
                                          src={ImageName.IMAGE_NAME.CROSS_BTN}
                                        />
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment />
                                  )}
                                  <label
                                    htmlFor="file-upload"
                                    for="passport_back"
                                    className=""
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title={this.state.passportBackPhoto.substring(
                                      8
                                    )}
                                    style={{
                                      cursor: "pointer",
                                      marginBottom: "0px",
                                    }}
                                  // hidden={this.state.onDocLoad}
                                  >
                                    {this.state.passportBackImagePath != "" ? (
                                      <React.Fragment>
                                        <div>
                                          <img
                                            style={{
                                              cursor: "pointer",
                                              height: "35px",
                                              width: "40px",
                                            }}
                                            src={
                                              this.state.passportBackImagePath
                                            }
                                            onClick={() =>
                                              this.openImageModal(
                                                "passportBack"
                                              )
                                            }
                                          />
                                        </div>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        <img
                                          style={{ cursor: "pointer" }}
                                          src={
                                            ImageName.IMAGE_NAME
                                              .ADD_WITH_CIRCLE_BG
                                          }
                                        />
                                        {/* <span id="wait">Upload File</span> */}
                                      </React.Fragment>
                                    )}

                                    <input
                                      disabled={
                                        this.state.passportBackImagePath != ""
                                          ? true
                                          : false
                                      }
                                      accept="image/*"
                                      type="file"
                                      id="passport_back"
                                      style={{ display: "none" }}
                                      onChange={(e) =>
                                        this.onPassportChange(e, "back")
                                      }
                                    />
                                  </label>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                    {/* ...................for SSN................. */}
                    <tr>
                      <td colspan="3">
                        <div className="tble-row doc-table-row">
                          <table
                            width="100%"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                          >
                            <tr>
                              <td style={{ width: "30%" }}>
                                {this.state.ssnName}
                              </td>
                              <td style={{ width: "30%" }}>
                                <div
                                  hidden={!this.state.isSsnFrontLoad}
                                  className="upload-profile doc-img"
                                >
                                  <SmallReactLoader />
                                </div>
                                <div
                                  className="upload-profile doc-img"
                                  hidden={this.state.isSsnFrontLoad}
                                >
                                  {this.state.ssnCheckFront ? (
                                    <React.Fragment>
                                      <div
                                        className="cross-btn"
                                        onClick={() => this.onClose("ssnFront")}
                                      >
                                        <img
                                          src={ImageName.IMAGE_NAME.CROSS_BTN}
                                        />
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment />
                                  )}
                                  <label
                                    htmlFor="file-upload"
                                    for="ssn_front"
                                    className=""
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title={this.state.ssnFrontPhoto.substring(
                                      8
                                    )}
                                    style={{
                                      cursor: "pointer",
                                      marginBottom: "0px",
                                    }}
                                  // hidden={this.state.onDocLoad}
                                  >
                                    {this.state.ssnFrontImagePath != "" ? (
                                      <React.Fragment>
                                        <div>
                                          <img
                                            style={{
                                              cursor: "pointer",
                                              height: "35px",
                                              width: "40px",
                                            }}
                                            src={this.state.ssnFrontImagePath}
                                            onClick={() =>
                                              this.openImageModal("ssnFront")
                                            }
                                          />
                                        </div>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        <img
                                          style={{ cursor: "pointer" }}
                                          src={
                                            ImageName.IMAGE_NAME
                                              .ADD_WITH_CIRCLE_BG
                                          }
                                        />
                                        {/* <span id="wait">Upload File</span> */}
                                      </React.Fragment>
                                    )}

                                    <input
                                      disabled={
                                        this.state.ssnFrontImagePath != ""
                                          ? true
                                          : false
                                      }
                                      accept="image/*"
                                      type="file"
                                      id="ssn_front"
                                      style={{ display: "none" }}
                                      onChange={(e) =>
                                        this.onSsnChange(e, "front")
                                      }
                                    />
                                  </label>
                                </div>
                              </td>
                              <td style={{ width: "30%" }}>
                                <div
                                  hidden={!this.state.isSsnBackLoad}
                                  className="upload-profile doc-img"
                                >
                                  <SmallReactLoader />
                                </div>
                                <div
                                  className="upload-profile doc-img"
                                  hidden={this.state.isSsnBackLoad}
                                >
                                  {this.state.ssnCheckBack ? (
                                    <React.Fragment>
                                      <div
                                        className="cross-btn"
                                        onClick={() => this.onClose("ssnBack")}
                                      >
                                        <img
                                          src={ImageName.IMAGE_NAME.CROSS_BTN}
                                        />
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment />
                                  )}
                                  <label
                                    htmlFor="file-upload"
                                    for="ssn_back"
                                    className=""
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title={this.state.ssnBackPhoto.substring(8)}
                                    style={{
                                      cursor: "pointer",
                                      marginBottom: "0px",
                                    }}
                                  // hidden={this.state.onDocLoad}
                                  >
                                    {this.state.ssnBackImagePath != "" ? (
                                      <React.Fragment>
                                        <div>
                                          <img
                                            style={{
                                              cursor: "pointer",
                                              height: "35px",
                                              width: "40px",
                                            }}
                                            src={this.state.ssnBackImagePath}
                                            onClick={() =>
                                              this.openImageModal("ssnBack")
                                            }
                                          />
                                        </div>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        <img
                                          style={{ cursor: "pointer" }}
                                          src={
                                            ImageName.IMAGE_NAME
                                              .ADD_WITH_CIRCLE_BG
                                          }
                                        />
                                        {/* <span id="wait">Upload File</span> */}
                                      </React.Fragment>
                                    )}

                                    <input
                                      disabled={
                                        this.state.ssnBackImagePath != ""
                                          ? true
                                          : false
                                      }
                                      accept="image/*"
                                      type="file"
                                      id="ssn_back"
                                      style={{ display: "none" }}
                                      onChange={(e) =>
                                        this.onSsnChange(e, "back")
                                      }
                                    />
                                  </label>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                    {/* ...................for Govt Id................. */}
                    <tr>
                      <td colspan="3">
                        <div className="tble-row doc-table-row">
                          <table
                            width="100%"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                          >
                            <tr>
                              <td style={{ width: "30%" }}>
                                {this.state.govtName}
                              </td>
                              <td style={{ width: "30%" }}>
                                <div
                                  hidden={!this.state.isGovtFrontLoad}
                                  className="upload-profile doc-img"
                                >
                                  <SmallReactLoader />
                                </div>
                                <div
                                  className="upload-profile doc-img"
                                  hidden={this.state.isGovtFrontLoad}
                                >
                                  {this.state.govtCheckFront ? (
                                    <React.Fragment>
                                      <div
                                        className="cross-btn"
                                        onClick={() =>
                                          this.onClose("govtFront")
                                        }
                                      >
                                        <img
                                          src={ImageName.IMAGE_NAME.CROSS_BTN}
                                        />
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment />
                                  )}
                                  <label
                                    htmlFor="file-upload"
                                    for="govt_front"
                                    className=""
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title={this.state.govtFrontPhoto.substring(
                                      8
                                    )}
                                    style={{
                                      cursor: "pointer",
                                      marginBottom: "0px",
                                    }}
                                  // hidden={this.state.onDocLoad}
                                  >
                                    {this.state.govtFrontImagePath != "" ? (
                                      <React.Fragment>
                                        <div>
                                          <img
                                            style={{
                                              cursor: "pointer",
                                              height: "35px",
                                              width: "40px",
                                            }}
                                            src={this.state.govtFrontImagePath}
                                            onClick={() =>
                                              this.openImageModal("govtFront")
                                            }
                                          />
                                        </div>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        <img
                                          style={{ cursor: "pointer" }}
                                          src={
                                            ImageName.IMAGE_NAME
                                              .ADD_WITH_CIRCLE_BG
                                          }
                                        />
                                        {/* <span id="wait">Upload File</span> */}
                                      </React.Fragment>
                                    )}

                                    <input
                                      disabled={
                                        this.state.govtFrontImagePath != ""
                                          ? true
                                          : false
                                      }
                                      accept="image/*"
                                      type="file"
                                      id="govt_front"
                                      style={{ display: "none" }}
                                      onChange={(e) =>
                                        this.onGovtChange(e, "front")
                                      }
                                    />
                                  </label>
                                </div>
                              </td>
                              <td style={{ width: "30%" }}>
                                <div
                                  hidden={!this.state.isGovtBackLoad}
                                  className="upload-profile doc-img"
                                >
                                  <SmallReactLoader />
                                </div>
                                <div
                                  className="upload-profile doc-img"
                                  hidden={this.state.isGovtBackLoad}
                                >
                                  {this.state.govtCheckBack ? (
                                    <React.Fragment>
                                      <div
                                        className="cross-btn"
                                        onClick={() => this.onClose("govtBack")}
                                      >
                                        <img
                                          src={ImageName.IMAGE_NAME.CROSS_BTN}
                                        />
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment />
                                  )}
                                  <label
                                    htmlFor="file-upload"
                                    for="govt_back"
                                    className=""
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title={this.state.govtBackPhoto.substring(
                                      8
                                    )}
                                    style={{
                                      cursor: "pointer",
                                      marginBottom: "0px",
                                    }}
                                  // hidden={this.state.onDocLoad}
                                  >
                                    {this.state.govtBackImagePath != "" ? (
                                      <React.Fragment>
                                        <div>
                                          <img
                                            style={{
                                              cursor: "pointer",
                                              height: "35px",
                                              width: "40px",
                                            }}
                                            src={this.state.govtBackImagePath}
                                            onClick={() =>
                                              this.openImageModal("govtBack")
                                            }
                                          />
                                        </div>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        <img
                                          style={{ cursor: "pointer" }}
                                          src={
                                            ImageName.IMAGE_NAME
                                              .ADD_WITH_CIRCLE_BG
                                          }
                                        />
                                        {/* <span id="wait">Upload File</span> */}
                                      </React.Fragment>
                                    )}

                                    <input
                                      disabled={
                                        this.state.govtBackImagePath != ""
                                          ? true
                                          : false
                                      }
                                      accept="image/*"
                                      type="file"
                                      id="govt_back"
                                      style={{ display: "none" }}
                                      onChange={(e) =>
                                        this.onGovtChange(e, "back")
                                      }
                                    />
                                  </label>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                    {/* ...................for Immunization records................. */}
                    <tr>
                      <td colspan="3">
                        <div className="tble-row doc-table-row">
                          <table
                            width="100%"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                          >
                            <tr>
                              <td style={{ width: "30%" }}>
                                Immunization Records
                              </td>
                              <td style={{ width: "30%" }}>
                                <div
                                  hidden={!this.state.isRecordsFrontLoad}
                                  className="upload-profile doc-img"
                                >
                                  <SmallReactLoader />
                                </div>
                                <div
                                  className="upload-profile doc-img"
                                  hidden={this.state.isRecordsFrontLoad}
                                >
                                  {this.state.recordsCheckFront ? (
                                    <React.Fragment>
                                      <div
                                        className="cross-btn"
                                        onClick={() =>
                                          this.onClose("recordsFront")
                                        }
                                      >
                                        <img
                                          src={ImageName.IMAGE_NAME.CROSS_BTN}
                                        />
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment />
                                  )}
                                  <label
                                    htmlFor="file-upload"
                                    for="records_front"
                                    className=""
                                    // data-toggle="tooltip"
                                    // data-placement="top"
                                    // title={this.state.recordsFrontPhoto.substring(
                                    //   8
                                    // )}
                                    style={{
                                      cursor: "pointer",
                                      marginBottom: "0px",
                                    }}
                                  // hidden={this.state.onDocLoad}
                                  >
                                    {this.state.recordsFrontImagePath != "" ? (
                                      <React.Fragment>
                                        <div>
                                          <img
                                            style={{
                                              cursor: "pointer",
                                              height: "35px",
                                              width: "40px",
                                            }}
                                            src={
                                              this.state.recordsFrontImagePath
                                            }
                                            onClick={() =>
                                              this.openImageModal(
                                                "recordsFront"
                                              )
                                            }
                                          />
                                        </div>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        <img
                                          style={{ cursor: "pointer" }}
                                          src={
                                            ImageName.IMAGE_NAME
                                              .ADD_WITH_CIRCLE_BG
                                          }
                                        />
                                        {/* <span id="wait">Upload File</span> */}
                                      </React.Fragment>
                                    )}

                                    <input
                                      disabled={
                                        this.state.recordsFrontImagePath != ""
                                          ? true
                                          : false
                                      }
                                      accept="image/*"
                                      type="file"
                                      id="records_front"
                                      style={{ display: "none" }}
                                      onChange={(e) =>
                                        this.onRecordsChange(e, "front")
                                      }
                                    />
                                  </label>
                                </div>
                              </td>
                              <td style={{ width: "30%" }}>
                                <div
                                  hidden={!this.state.isRecordsBackLoad}
                                  className="upload-profile doc-img"
                                >
                                  <SmallReactLoader />
                                </div>
                                <div
                                  className="upload-profile doc-img"
                                  hidden={this.state.isRecordsBackLoad}
                                >
                                  {this.state.recordsCheckBack ? (
                                    <React.Fragment>
                                      <div
                                        className="cross-btn"
                                        onClick={() =>
                                          this.onClose("recordsBack")
                                        }
                                      >
                                        <img
                                          src={ImageName.IMAGE_NAME.CROSS_BTN}
                                        />
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment />
                                  )}
                                  <label
                                    htmlFor="file-upload"
                                    for="records_back"
                                    className=""
                                    // data-toggle="tooltip"
                                    // data-placement="top"
                                    // title={this.state.recordsBackPhoto.substring(
                                    //   8
                                    // )}
                                    style={{
                                      cursor: "pointer",
                                      marginBottom: "0px",
                                    }}
                                  // hidden={this.state.onDocLoad}
                                  >
                                    {this.state.recordsBackImagePath != "" ? (
                                      <React.Fragment>
                                        <div>
                                          <img
                                            style={{
                                              cursor: "pointer",
                                              height: "35px",
                                              width: "40px",
                                            }}
                                            src={
                                              this.state.recordsBackImagePath
                                            }
                                            onClick={() =>
                                              this.openImageModal("recordsBack")
                                            }
                                          />
                                        </div>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        <img
                                          style={{ cursor: "pointer" }}
                                          src={
                                            ImageName.IMAGE_NAME
                                              .ADD_WITH_CIRCLE_BG
                                          }
                                        />
                                        {/* <span id="wait">Upload File</span> */}
                                      </React.Fragment>
                                    )}

                                    <input
                                      disabled={
                                        this.state.recordsBackImagePath != ""
                                          ? true
                                          : false
                                      }
                                      accept="image/*"
                                      type="file"
                                      id="records_back"
                                      style={{ display: "none" }}
                                      onChange={(e) =>
                                        this.onRecordsChange(e, "back")
                                      }
                                    />
                                  </label>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "30%" }}></td>
                      <td style={{ width: "30%", padding: "20px" }}>
                        <a
                          className="blue-btn doc-save-btn"
                          style={{
                            textDecoration: "none",
                            color: "white",
                            cursor: "pointer",
                          }}
                          onClick={this.onSave}
                        >
                          SAVE
                        </a>
                      </td>
                      <td style={{ width: "30%" }}></td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div className="tab-app-information" id="tble-data-c">
              <div className="table-listing-app">
                <div className="table-responsive">
                  <table
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                  >
                    <tr>
                      <th style={{ width: "30%" }}>Document Name</th>
                      <th style={{ width: "30%" }}>Last Modified On</th>
                      {/* <th style={{ width: "25%" }}>Status</th> */}
                      <th style={{ width: "30%", textAlign: "center" }}>
                        Action
                      </th>
                    </tr>
                    {this.state.allTrainingData.length > 0 ? (
                      this.state.allTrainingData.map((data, i) => (
                        <tr key={i}>
                          <td colspan="4">
                            <div className="tble-row">
                              <table
                                width="100%"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tr>
                                  <td style={{ width: "30%" }}>
                                    {data.documentName}
                                  </td>
                                  <td style={{ width: "30%" }}>
                                    {SetDateFormat(data.requestDate)} |{" "}
                                    {SetTimeFormat(data.requestDate)}
                                  </td>
                                  {/* {data.verificationStatus === 0 ? (
                                      <td style={{ width: "25%" }}>
                                        <span className="Pending_btn">
                                          Pending
                                        </span>
                                      </td>
                                    ) : data.verificationStatus === 1 ? (
                                      <td style={{ width: "25%" }}>
                                        <span className="approve_status_btn">
                                          Verified
                                        </span>
                                      </td>
                                    ) : (
                                      <td style={{ width: "25%" }}>
                                        <span className="declined_btn">
                                          Declined
                                        </span>
                                      </td>
                                    )} */}
                                  <td
                                    style={{
                                      width: "30%",
                                      textAlign: "center",
                                    }}
                                  >
                                    <img
                                      src={ImageName.IMAGE_NAME.EDIT_SQUARE}
                                      style={{ cursor: "pointer" }}
                                      id="basic-button"
                                      className="serv-cat-edit-btn"
                                      onClick={() => this.editPage(i)}
                                    />
                                    <img
                                      src={ImageName.IMAGE_NAME.TRASH_BTN}
                                      style={{
                                        cursor: "pointer",
                                        marginLeft: "10px",
                                      }}
                                      id="basic-button"
                                      className="serv-cat-del-btn"
                                      onClick={() => this.deletePage(i)}
                                    />
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <React.Fragment>
                        <tr style={{ textAlign: "center" }}>
                          <td colSpan="4">
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
        {/* </div> */}
        {/* ......................................................... */}
        <div id="image-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content" style={{ padding: "10px" }}>
              <div className="modal-body modal-doc-img">
                <div
                  className="cross-btn modal-doc-close "
                  onClick={() => this.onModalClose()}
                >
                  <img src={ImageName.IMAGE_NAME.CROSS_BTN} />
                </div>
                <img src={this.state.imagePath} />
              </div>
            </div>
          </div>
        </div>

        {/* ..............................delete modal............................. */}

        <div id="delete-model" className="modal fade modelwindow" role="dialog">
          <div className="modal-dialog modal-md modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content" style={{ padding: "10px" }}>
              <div className="delete-head">Delete Document</div>
              <div className="modal-body">
                <div className="body-txt">Are You Sure?</div>

                <div className="_button-style m30 _fl text-center">
                  <a
                    className="white-btn"
                    style={{ textDecoration: "none", color: "grey" }}
                    onClick={this.onCancel}
                  >
                    NO
                  </a>
                  <a
                    className="blue-btn"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      width: "15%",
                    }}
                    data-dismiss="modal"
                    onClick={() => this.deleteItem()}
                  >
                    Yes
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ..................View Document Modal................................. */}
        <div
          id="view-docs-modal"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content" style={{ width: "100%" }}>
              <div className="docs-modal-head">
                <div className="row">
                  <div className="col-md-12">
                    DOCUMENT DETAILS
                    <button className="close-page">
                      <img
                        src={ImageName.IMAGE_NAME.CLOSE_BTN_2}
                        onClick={() => {
                          this.closeViewDocsModal();
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-body">
                <div className="model-info f-model">
                  <div className="form-search-app doc-modal">
                    <div className="row">
                      <div className="col-md-4">
                        <span>Document Name : </span>
                      </div>
                      <div className="col-md-8">Passport</div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <span>Issuing Date : </span>
                      </div>
                      <div className="col-md-8">NA</div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <span>Expiration date : </span>
                      </div>
                      <div className="col-md-8">NA</div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <span>Status : </span>
                      </div>
                      <div className="col-md-8">Verification Pending</div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <span>Last Modified on : </span>
                      </div>
                      <div className="col-md-8">Feb 15, 2021 10:00 A.M.</div>
                    </div>
                    <div className="row" style={{ paddingTop: "4%" }}>
                      <div className="col-md-3">
                        <span>Front Image : </span>
                      </div>
                      <div className="col-md-3">
                        <figure>
                          <img
                            className="doc_img_id"
                            src={IMAGE_PATH_ONLY + this.state.id_modalFront}
                          />
                        </figure>
                      </div>
                      <div className="col-md-3">
                        <span>Back Image : </span>
                      </div>
                      <div className="col-md-3">
                        <figure>
                          <img
                            className="doc_img_id"
                            src={IMAGE_PATH_ONLY + this.state.id_modalBack}
                          />
                        </figure>
                      </div>
                    </div>

                    {/* <div className="web-form-bx margin-top-20">
                                            <div className="_button-style _fl text-center">
                                                <a className="white-btn"
                                                    onClick={() => { this.closeViewDocsModal() }}
                                                >
                                                    cancel
                                                </a>
                                                <a
                                                    className="blue-btn"
                                                    style={{ color: "#fff" }}
                                                // onClick={this.declineRequest}
                                                >
                                                    submit
                                                </a>
                                            </div>
                                        </div> */}
                    <div className="md-btn text-center">
                      {/* <a href="#" className="edit" style={{textDecoration : "none"}}>EDIT</a> */}
                      <a
                        onClick={() => {
                          this.rejectDocuments(this.state.view_modal_id);
                        }}
                        className="reject"
                        style={{ textDecoration: "none", color: "#fff" }}
                      >
                        REJECT
                      </a>
                      <a
                        onClick={() => {
                          this.approveDocument(this.state.view_modal_id);
                        }}
                        className="approved"
                        style={{ textDecoration: "none", color: "#fff" }}
                      >
                        APPROVED
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ..................Decline modal................................. */}
        <div
          id="decline-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content" style={{ width: "100%" }}>
              <div className="cancel-job-head">
                <div className="row">
                  <div className="col-md-12">
                    <h2>
                      REASON TO <span>DECLINE</span>
                    </h2>
                    <button className="close-page">
                      <img
                        src={ImageName.IMAGE_NAME.CLOSE_BTN_3}
                        onClick={this.closeViewDocsModal}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-body">
                <div className="model-info f-model">
                  <div className="form-search-app">
                    <textarea
                      placeholder="Reason"
                      className="in-textarea msg min"
                      style={{ resize: "none" }}
                      value={this.state.declineMessage}
                      onChange={this.declineMessageChange}
                    ></textarea>
                    <div className="web-form-bx margin-top-20">
                      <div className="_button-style _fl text-center">
                        <a
                          className="white-btn"
                          onClick={this.closeViewDocsModal}
                        >
                          cancel
                        </a>
                        <a
                          className="blue-btn"
                          style={{ color: "#fff" }}
                          onClick={this.declineRequest}
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

        <div
          className="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}
