import React from "react";
import { AlertMessage, ImageName } from "../../../../enums";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import $ from "jquery";
import "./docs.css";
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
import { ApiCall } from "../../../../services/middleware";
import { ErrorCode } from "../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";
import { inputEmptyValidate } from "../../../../validators";
import { Link } from "react-router-dom";
import SmallReactLoader from "../../../Loader/SmallLoader";
import { PaginationDropdown } from "../../SharedComponents/inputText";
import { COMMON } from "../../../../services/constant/connpmData";
import IdentificationDocAdd from "./AddIdentificationDoc/IdentificationDocAdd";
import ReactLoader from "../../../Loader";

export default class VendorDocs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      flag: false,
      current_page: 1,
      total_page: 10,
      limit: 20,
      curIndex: 0,
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

      frontLoad: true,
      backLoad: true,

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
    };
  }

  componentDidMount() {
    let mainData = this.props.location;
    let preData = mainData.state;
    // consoleLog("predata", preData);
    if (preData === undefined) {
      return history.push("/adminVendorList");
    }
    // consoleLog("predata::", preData);
    this.setState({
      showId: preData,
    });

    window.scrollTo(0, 0);

    this.onLoad();

    // var ddData = [
    //   {
    //     text: "10",
    //     value: 10,
    //   },
    //   {
    //     text: "20",
    //     value: 20,
    //   },
    //   {
    //     text: "30",
    //     value: 30,
    //   },
    //   {
    //     text: "40",
    //     value: 40,
    //   },
    //   {
    //     text: "50",
    //     value: 50,
    //   },
    // ];

    var classInstance = this;
    // window.$(".myDropdown").ddslick({
    //   data: ddData,
    //   onSelected: function (data) {
    //     classInstance.setState({
    //       limit: data.selectedData.value,
    //       offset: "0",
    //     });
    //     //   classInstance.load();
    //   },
    // });

    window.$(".verificaiton-doc-tab ul li").on("click", function () {
      $(".verificaiton-doc-tab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
    });

    // When the user clicks anywhere outside of the modal, close it

    var modal = document.getElementById("view-docs-modal");
    var addDocsmodal = document.getElementById("add-docs-modal");
    window.onclick = function (event) {
      if (event.target == modal) {
        classInstance.closeViewDocsModal();
      } else if (event.target == addDocsmodal) {
        classInstance.closeAddDocsModal();
      }
    };
    this.vendorDocsDataApi(preData);
  }

  onLoad = async () => {
    this.setState({
      frontLoad: false,
      backLoad: false,
    });
  };

  //for open document view modal

  openViewDocsModal = (pos) => {
    this.setState({
      view_modal_id: this.state.identificationDocs[pos].id,
      id_modalFront: this.state.identificationDocs[pos].documentPath,
      id_modalBack: this.state.identificationDocs[pos].altDocumentPath,
    });
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("view-docs-modal").style.display = "block";
    document.getElementById("view-docs-modal").classList.add("show");
  };

  openDeclineModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("decline-model").style.display = "block";
    document.getElementById("decline-model").classList.add("show");
  };
  closeViewDocsModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("view-docs-modal").style.display = "none";
    document.getElementById("view-docs-modal").classList.remove("show");
  };
  closeDeclineModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("decline-model").style.display = "none";
    document.getElementById("decline-model").classList.remove("show");
  };
  onCloseDeclineModal = () => {
    this.closeDeclineModal();
    this.setState({
      declineMessage: "",
    });
  };
  //for open document add modal

  openAddDocsModal = (pos) => {
    // this.setState({
    //   view_modal_id: this.state.identificationDocs[pos].id,
    //   id_modalFront: this.state.identificationDocs[pos].documentPath,
    //   id_modalBack: this.state.identificationDocs[pos].altDocumentPath,
    // });
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("add-docs-modal").style.display = "block";
    document.getElementById("add-docs-modal").classList.add("show");
  };
  closeAddDocsModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("add-docs-modal").style.display = "none";
    document.getElementById("add-docs-modal").classList.remove("show");
  };

  vendorDocsDataApi = async (id) => {
    let data = {
      userId: id,
    };

    //* ********* Api for contractList******* */

    let payload = await ApiCall("getVendorContractListV2", {
      vendorid: id,
    });
    let resContract = Decoder.decode(payload.data.payload);
    consoleLog("contarct", resContract);
    // this.setState({
    //   allContractListData: resContract.data.contractList,

    // });

    //* ********* Api for training tList******* */

    let payloadTraining = await ApiCall("getVendorTrainingList", {
      vendorid: id,
    });
    let resTraining = Decoder.decode(payloadTraining.data.payload);

    // this.setState({
    //   allTrainingData: resTraining.data.traningList,
    // });

    const encodeData = Encoder.encode(data);
    axios
      .post(VENDOR_IDENTIFICATION_DOCS, {
        payload: encodeData,
      })
      .then((res) => {
        let payload = Decoder.decode(res.data.data.payload);
        let respObject = payload.data;
        consoleLog("docs data:::", respObject);
        this.setState({
          identificationDocs: respObject,
          isLoad: false
        });
      });

    // let contract = await ApiCall("getVendorContractList",{
    //   vendorid: id,
    // })

    // // consoleLog("contract data::",contract)
    // let payloadData = Decoder.decode(contract.data.payload);
    // consoleLog("payload contract data::",payloadData)
    this.setState({
      allContractListData: resContract.data.contractList,
      allTrainingData: resTraining.data.traningList,
      isLoad: false
    })
  };

  approveDocument = (id) => {
    let data = {
      id: id,
      status: "1",
      reason: "",
    };
    this.modifyStatus(data);
  };

  modifyStatus = async (data) => {
    let res = await ApiCall("modifyvendordocumentstatus", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.vendorDocsDataApi(this.state.showId);
      if (data.status === "1") {
        toast.success(AlertMessage.MESSAGE.DOCUMENT.DOCUMENT_STATUS_APPROVED, {
          hideProgressBar: true,
        });
      } else if (data.status === "2") {
        toast.success(AlertMessage.MESSAGE.DOCUMENT.DOCUMENT_STATUS_DECLINED, {
          hideProgressBar: true,
        });
      }
    }
  };

  onDownload = (pos) => {
    window.open(
      IMAGE_PATH_ONLY + this.state.identificationDocs[pos].documentPath,
      "_blank"
    );
  };

  onDownloadContract = (pos) => {
    consoleLog("Document::", IMAGE_PATH_ONLY + this.state.allContractListData[pos].documentPath)
    window.open(
      IMAGE_PATH_ONLY + this.state.allContractListData[pos].documentPath,
      "_blank"
    );
  };

  onDownloadTraining = (pos) => {
    window.open(
      IMAGE_PATH_ONLY +
      JSON.parse(this.state.allTrainingData[pos].documentPath),
      "_blank"
    );
  };

  rejectDocuments = (id) => {
    this.setState({
      setDocumentId: id,
    });
    this.openDeclineModal();
  };

  declineMessageChange = (e) => {
    this.setState({
      declineMessage: e.target.value,
    });
  };

  declineRequest = () => {
    let errorCount = 0;
    let validateReason = inputEmptyValidate(this.state.declineMessage);
    if (validateReason === false) {
      toast.error(AlertMessage.MESSAGE.DECLINE_MODAL.EMPTY_MESSAGE, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      let data = {
        status: "2",
        id: this.state.setDocumentId,
        reason: this.state.declineMessage,
      };
      this.modifyStatus(data);
      this.onCloseDeclineModal();
    }
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

  // ........................................................

  onDrivingLicenseChange = (e, value, index) => {
    consoleLog("index:::", index);
    consoleLog("index:::", index);
    let stateObj = {};
    const formData = new FormData();

    switch (value) {
      case "front":
        consoleLog("::::)))))", e.target.files);

        if (e.target.files.length > 0) {
          this.state.identificationDocs.map((obj, key) => {
            if (key == index) {
              this.setState({
                frontLoad: true,
              });
            }
          });

          // stateObj["drivingLicenseCheckFront"] = true;

          formData.append("file", e.target.files[0]);
          axios.post(IMAGE_URL, formData).then((res) => {
            // consoleLog("res:::", res.data.data);
            this.state.identificationDocs.map((obj, key) => {
              if (key == index) {
                obj.documentPath = res.data.data.path + res.data.data.filename;
                this.setState({
                  frontLoad: false,
                });
              }
            });

            this.setState({
              drivingFrontImagePath: res.data.data.url,
              drivingFrontPhoto: res.data.data.path + res.data.data.filename,
              identificationDocs: this.state.identificationDocs,
              // frontLoad: false,
            });
          });

          consoleLog("doc data", this.state.identificationDocs);
        }

        break;
      case "back":
        // consoleLog("::::", e.target.files[0]);
        if (e.target.files.length > 0) {
          this.setState({
            backLoad: true,
          });
          // stateObj["drivingLicenseCheckBack"] = true;
          // const formData = new FormData();
          formData.append("file", e.target.files[0]);
          axios.post(IMAGE_URL, formData).then((res) => {
            // consoleLog("res:::", res.data.data);
            this.state.identificationDocs.map((obj, key) => {
              if (key == index) {
                obj.altDocumentPath =
                  res.data.data.path + res.data.data.filename;
              }
            });
            this.setState({
              drivingBackImagePath: res.data.data.url,
              drivingBackPhoto: res.data.data.path + res.data.data.filename,
              identificationDocs: this.state.identificationDocs,
            });
          });
        }
        break;
    }
    this.setState(stateObj);
  };

  //   ...........for Passport .................

  onClose = (value, index) => {
    // consoleLog("::index:::::", index);

    switch (value) {
      case "drivingFront":
        // stateObj["drivingLicenseCheckFront"] = false;

        for (let i = 0; i < this.state.identificationDocs.length; i++) {
          if (i == index) {
            this.state.identificationDocs[i].documentPath = "";
          }
        }
        this.setState({
          identificationDocs: this.state.identificationDocs,
        });

        // consoleLog("front image docs",this.state.identificationDocs)
        break;

      case "drivingBack":
        for (let i = 0; i < this.state.identificationDocs.length; i++) {
          if (i == index) {
            this.state.identificationDocs[i].altDocumentPath = "";
          }
        }
        this.setState({
          identificationDocs: this.state.identificationDocs,
        });
        break;
    }

    this.setState({
      identificationDocs: this.state.identificationDocs,
    });
  };

  onSave = async () => {
    var errorCount = 0;

    this.state.identificationDocs.map((obj) => {
      if (obj.documentPath == "" || obj.altDocumentPath == "") {
        if (obj.documentName == "Driving License") {
          toast.error("Please select Driving License");

          errorCount++;
        } else if (obj.documentName == "Passport") {
          toast.error("Please select Passport");

          errorCount++;
        } else if (obj.documentName == "SSN") {
          toast.error("Please select SSN");

          errorCount++;
        } else if (obj.documentName == "Govt Issued ID Card") {
          toast.error("Please select Govt Issued ID Card");

          errorCount++;
        }
      }
    });

    if (errorCount === 0) {
      let obj = {
        vendorId: this.state.showId,
        docList: this.state.identificationDocs,
      };
      // consoleLog("idenfication docs:::",obj)
      let res = await ApiCall("updateIdentificationDoc", obj);

      console.log();
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success("Updated Successfully");
        this.onLoad();
        window.scrollTo(0, 0);
      } else {
        toast.error("Error Occured!");
      }
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

  //   ..........add new button.......................
  addNew = () => {
    this.props.history.push({
      pathname: "/adminAddVendorCertificate",
      state: this.state.showId,
    });
  };
  editPage = (index) => {
    this.props.history.push({
      pathname: "/adminEditVendorCertificate",
      state: this.state.allTrainingData[index],
    });
  };

  onUpload = (i, e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      consoleLog("res:::", res.data.data);
      consoleLog("Contract Details::", this.state.allContractListData[i]);
      let obj = {
        vendorId: this.state.showId,
        documentId: this.state.allContractListData[i].id,
        documentName: this.state.allContractListData[i].name,
        documentPath: res.data.data.path + res.data.data.filename
      }
      this.uploadContract(obj)
    });
  }

  uploadContract = async (obj) => {
    let res = await ApiCall("uploadVendorContract", obj);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let payload = Decoder.decode(res.data.payload);
      consoleLog("Image upload res::", payload)
    }
  }

  render() {
    // window.open(decodeData.data.fileUrl, "_blank");
    return (
      <React.Fragment>
        <ToastContainer hideProgressBar={true} theme="colored" />
        {/* <div className="wrapper"> */}
        {/* <Header />
                    <Sidebar /> */}
        <div className="component-wrapper">
          <div className="listing-component-app">
            <div
              className="vn_frm"
              style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
            >
              {" "}
              <Link to="/adminDashboard">Dashboard</Link> /{" "}
              <Link to="/adminVendorList">Vendor</Link> / Vendor Document
            </div>
            <h3 className="dcs">Document Verification</h3>
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
            <div className="tab-app-information activeLnk" id="tble-data-a" hidden={!this.state.isLoad}>
              <ReactLoader />
            </div>
            <div className="tab-app-information activeLnk" id="tble-data-a" hidden={this.state.isLoad}>
              <div className="table-listing-app">
                <div className="table-responsive">
                  <table
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                  >
                    <tr>
                      <th style={{ width: "25%" }}>Document Name</th>
                      <th style={{ width: "25%" }}>Last Modified On</th>
                      <th style={{ width: "20%" }}>Status</th>
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
                                  <td style={{ width: "25%", cursor: "pointer" }} onClick={() => this.onDownloadContract(i)}>{data.name}</td>
                                  <td style={{ width: "25%" }}>
                                    {data.requestDate == null ? <>N/A</> : <>
                                      {SetDateFormat(data.requestDate)} |{" "}
                                      {SetTimeFormat(data.requestDate)}
                                    </>}
                                  </td>
                                  {data.verificationStatus == null ? <td style={{ width: "20%" }}> N/A</td> : <>
                                    {data.verificationStatus === 0 ? (
                                      <td style={{ width: "20%" }}>
                                        <span className="Pending_btn">
                                          Pending
                                        </span>
                                      </td>
                                    ) : data.verificationStatus === 1 ? (
                                      <td style={{ width: "20%" }}>
                                        <span className="approve_status_btn">
                                          Verified
                                        </span>
                                      </td>
                                    ) : (
                                      <td style={{ width: "20%" }}>
                                        <span className="declined_btn">
                                          Declined
                                        </span>
                                      </td>
                                    )}
                                  </>}
                                  <td
                                    style={{
                                      width: "30%",
                                      textAlign: "center",
                                    }}
                                  >
                                    <div
                                      className="dcs-link"
                                      style={{ display: "inline-flex" }}
                                    >
                                      {/* <img
                                        data-toggle="tooltip"
                                        title="Download"
                                        className="contract_upld_icon"
                                        src={ImageName.IMAGE_NAME.DWN_ICON}
                                        onClick={() => this.onDownload(i)}
                                      /> */}
                                      {/* <label for="upload"> */}
                                      {/* <img
                                        data-toggle="tooltip"
                                        title="Upload"
                                        className="contract_upload"
                                        src={
                                          ImageName.IMAGE_NAME.UPLOAD_BTN_NEW
                                        }
                                      />
                                      <input
                                        id="upload"
                                        type="file"
                                        onChange={(e) => this.onUpload(i, e)}
                                        style={{ display: "none" }}
                                      /> */}
                                      {/* </label> */}

                                      {/* <span className="brd"></span> */}
                                      {/* <img
                                        className="pd_rt_5"
                                        src={ImageName.IMAGE_NAME.EYE_BTN}
                                        onClick={() => {
                                          this.onDownloadContract(i);
                                        }}
                                      /> */}
                                      <label
                                        htmlFor="file-upload"
                                        for={"upload" + i}
                                        className=""
                                        style={{
                                          cursor: "pointer"
                                        }}
                                      >
                                        <img
                                          data-toggle="tooltip"
                                          title="Upload"
                                          htmlFor="upload"
                                          className="contract_upload pd_rt_5"
                                          src={
                                            ImageName.IMAGE_NAME.UPLOAD_BTN_NEW
                                          }
                                        />
                                        <input
                                          id={"upload" + i}
                                          type="file"
                                          onChange={(e) => this.onUpload(i, e)}
                                          style={{ display: "none" }}
                                        />
                                      </label>
                                      {data.verificationStatus == null ? <></> : <>
                                        {data.verificationStatus === 1 ? (
                                          <React.Fragment></React.Fragment>
                                        ) : (
                                          <React.Fragment>
                                            {data.verificationStatus === 2 ? (
                                              <a href="javascript:void(0)" className="pd_rt_5">
                                                <img
                                                  src={
                                                    ImageName.IMAGE_NAME
                                                      .BLUE_TICK_JPG
                                                  }
                                                  onClick={() => {
                                                    this.approveDocument(data.id);
                                                  }}
                                                />
                                              </a>
                                            ) : (
                                              <React.Fragment>
                                                <a href="javascript:void(0)" className="pd_rt_5">
                                                  <img
                                                    src={
                                                      ImageName.IMAGE_NAME
                                                        .CANCEL_BTN
                                                    }
                                                    onClick={() => {
                                                      this.rejectDocuments(
                                                        data.id
                                                      );
                                                    }}
                                                  />
                                                </a>
                                                <a href="javascript:void(0)" className="pd_rt_5">
                                                  <img
                                                    src={
                                                      ImageName.IMAGE_NAME
                                                        .BLUE_TICK_JPG
                                                    }
                                                    onClick={() => {
                                                      this.approveDocument(
                                                        data.id
                                                      );
                                                    }}
                                                  />
                                                </a>
                                              </React.Fragment>
                                            )}
                                          </React.Fragment>
                                        )}
                                        <img
                                          className="pd_rt_5"
                                          src={ImageName.IMAGE_NAME.DWN_ICON}
                                          onClick={() => {
                                            this.onDownloadContract(i);
                                          }}
                                        />
                                      </>}
                                    </div>{" "}
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
                          <td colSpan="6">
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
            <div className="tab-app-information" id="tble-data-b" hidden={!this.state.isLoad}>
              <ReactLoader />
            </div>
            <div className="tab-app-information" id="tble-data-b" hidden={this.state.isLoad}>
              {this.state.identificationDocs.length > 0 ? (
                <React.Fragment>
                  <div className="table-listing-app">
                    <div className="table-responsive">
                      <table
                        width="100%"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <th style={{ width: "15%" }}>Document Name</th>
                          <th style={{ width: "15%" }}>Front Image</th>
                          <th style={{ width: "10%" }}>Back Image</th>
                          <th style={{ width: "14%" }}>Issuing date</th>
                          <th style={{ width: "14%" }}>Expiration Date</th>
                          <th style={{ width: "10%" }}>Status</th>
                          <th style={{ width: "22%", textAlign: "center" }}>
                            Action
                          </th>
                        </tr>
                        {this.state.identificationDocs.map((data, i) => (
                          <tr key={i}>
                            <td colspan="7">
                              <div className="tble-row">
                                <table
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                >
                                  <tr>
                                    <td style={{ width: "15%" }}>
                                      {data.documentName}
                                    </td>
                                    <td style={{ width: "15%" }}>
                                      <div
                                        className="upload-profile doc-img">
                                        {data.documentPath ? (
                                          <React.Fragment>
                                            <div
                                              className="cross-btn"
                                              onClick={() =>
                                                this.onClose("drivingFront", i)
                                              }
                                            >
                                              <img
                                                src={
                                                  ImageName.IMAGE_NAME.CROSS_BTN
                                                }
                                              />
                                            </div>
                                          </React.Fragment>
                                        ) : (
                                          <React.Fragment />
                                        )}
                                        <label
                                          htmlFor="file-upload"
                                          for={"driving_license_front" + i}
                                          className=""
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          // title={this.state.drivingFrontPhoto.substring(
                                          //   8
                                          // )}
                                          style={{
                                            cursor: "pointer",
                                            marginBottom: "0px",
                                          }}
                                        // hidden={this.state.onDocLoad}
                                        >
                                          {data.documentPath != "" ? (
                                            <React.Fragment>
                                              <div>
                                                <img
                                                  style={{
                                                    cursor: "pointer",
                                                    height: "35px",
                                                    width: "40px",
                                                  }}
                                                  src={
                                                    IMAGE_PATH_ONLY +
                                                    data.documentPath
                                                  }
                                                // onClick={() =>
                                                //   this.openImageModal(
                                                //     "drivingFront"
                                                //   )
                                                // }
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
                                            </React.Fragment>
                                          )}

                                          <input
                                            disabled={
                                              data.documentPath != ""
                                                ? true
                                                : false
                                            }
                                            accept="image/*"
                                            type="file"
                                            id={"driving_license_front" + i}
                                            style={{ display: "none" }}
                                            onChange={(e) =>
                                              this.onDrivingLicenseChange(
                                                e,
                                                "front",
                                                i
                                              )
                                            }
                                          />
                                        </label>
                                      </div>
                                      {/* ...................... */}
                                      {/* <figure>
                                    <img
                                      className="doc_img_id"
                                      src={IMAGE_PATH_ONLY + data.documentPath}
                                    />
                                  </figure> */}
                                    </td>
                                    <td style={{ width: "10%" }}>
                                      {/* <div
                                  hidden={!this.state.backLoad}
                                  className="upload-profile doc-img"
                                >
                                  <SmallReactLoader />
                                </div> */}
                                      <div
                                        className="upload-profile doc-img"
                                      // hidden={this.state.backLoad}
                                      >
                                        {data.altDocumentPath ? (
                                          <React.Fragment>
                                            <div
                                              className="cross-btn"
                                              onClick={() =>
                                                this.onClose("drivingBack", i)
                                              }
                                            >
                                              <img
                                                src={
                                                  ImageName.IMAGE_NAME.CROSS_BTN
                                                }
                                              />
                                            </div>
                                          </React.Fragment>
                                        ) : (
                                          <React.Fragment />
                                        )}
                                        <label
                                          htmlFor="file-upload"
                                          for={"driving_license_back" + i}
                                          className=""
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          // title={this.state.drivingBackPhoto.substring(
                                          //   8
                                          // )}
                                          style={{
                                            cursor: "pointer",
                                            marginBottom: "0px",
                                          }}
                                        // hidden={this.state.onDocLoad}
                                        >
                                          {data.altDocumentPath != "" ? (
                                            <React.Fragment>
                                              <div>
                                                <img
                                                  style={{
                                                    cursor: "pointer",
                                                    height: "35px",
                                                    width: "40px",
                                                  }}
                                                  src={
                                                    IMAGE_PATH_ONLY +
                                                    data.altDocumentPath
                                                  }
                                                // onClick={() =>
                                                //   this.openImageModal("drivingBack")
                                                // }
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
                                              data.altDocumentPath != ""
                                                ? true
                                                : false
                                            }
                                            accept="image/*"
                                            type="file"
                                            id={"driving_license_back" + i}
                                            style={{ display: "none" }}
                                            onChange={(e) =>
                                              this.onDrivingLicenseChange(
                                                e,
                                                "back",
                                                i
                                              )
                                            }
                                          />
                                        </label>
                                      </div>

                                      {/* <figure>
                                    <img
                                      className="doc_img_id"
                                      src={
                                        IMAGE_PATH_ONLY + data.altDocumentPath
                                      }
                                    />
                                  </figure> */}
                                    </td>
                                    {data.issuingDate === "" ? (
                                      <td style={{ width: "14%" }}>NA</td>
                                    ) : (
                                      <td style={{ width: "14%" }}>
                                        {SetDateFormat(data.issuingDate)}
                                      </td>
                                    )}
                                    {data.expirationDate === "" ? (
                                      <td style={{ width: "14%" }}>NA</td>
                                    ) : (
                                      <td style={{ width: "14%" }}>
                                        {SetDateFormat(data.expirationDate)}
                                      </td>
                                    )}
                                    {data.verificationStatus === 0 ? (
                                      <td style={{ width: "10%" }}>
                                        <span className="Pending_btn">
                                          Pending
                                        </span>
                                      </td>
                                    ) : data.verificationStatus === 1 ? (
                                      <td style={{ width: "10%" }}>
                                        <span className="approve_status_btn">
                                          Verified
                                        </span>
                                      </td>
                                    ) : (
                                      <td style={{ width: "10%" }}>
                                        <span className="declined_btn">
                                          Declined
                                        </span>
                                      </td>
                                    )}
                                    <td
                                      style={{
                                        width: "22%",
                                        textAlign: "center",
                                      }}
                                    >
                                      <div className="dcs-link">
                                        <a href="javascript:void(0)">
                                          <img
                                            src={ImageName.IMAGE_NAME.EYE_BTN}
                                            onClick={() => {
                                              this.openViewDocsModal(i);
                                            }}
                                          />
                                        </a>
                                        {data.verificationStatus === 1 ? (
                                          <React.Fragment></React.Fragment>
                                        ) : (
                                          <React.Fragment>
                                            {data.verificationStatus === 2 ? (
                                              <a href="javascript:void(0)">
                                                <img
                                                  src={
                                                    ImageName.IMAGE_NAME
                                                      .BLUE_TICK_JPG
                                                  }
                                                  onClick={() => {
                                                    this.approveDocument(
                                                      data.id
                                                    );
                                                  }}
                                                />
                                              </a>
                                            ) : (
                                              <React.Fragment>
                                                <a href="javascript:void(0)">
                                                  <img
                                                    src={
                                                      ImageName.IMAGE_NAME
                                                        .CANCEL_BTN
                                                    }
                                                    onClick={() => {
                                                      this.rejectDocuments(
                                                        data.id
                                                      );
                                                    }}
                                                  />
                                                </a>
                                                <a href="javascript:void(0)">
                                                  <img
                                                    src={
                                                      ImageName.IMAGE_NAME
                                                        .BLUE_TICK_JPG
                                                    }
                                                    onClick={() => {
                                                      this.approveDocument(
                                                        data.id
                                                      );
                                                    }}
                                                  />
                                                </a>
                                              </React.Fragment>
                                            )}
                                          </React.Fragment>
                                        )}

                                        <a href="#">
                                          <img
                                            src={ImageName.IMAGE_NAME.DWN_ICON}
                                            onClick={() => {
                                              this.onDownload(i);
                                            }}
                                          />
                                        </a>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </table>
                    </div>

                    <div className="docIdentification_btn">
                      <a
                        className="blue-btn doc-save-btn"
                        style={{
                          textDecoration: "none",
                          color: "white",
                          cursor: "pointer",
                        }}
                        onClick={this.onSave}
                      >
                        UPDATE
                      </a>
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>

                  <IdentificationDocAdd vendorId={this.props.location.state} />

                </React.Fragment>
              )}

              <div></div>
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
                      <th style={{ width: "15%" }}>Document Name</th>
                      <th style={{ width: "15%" }}>Issuing Organisation</th>
                      <th style={{ width: "15%" }}>Last Modified On</th>
                      <th style={{ width: "15%" }}>Issuing Date</th>
                      <th style={{ width: "15%" }}>Expiration Date</th>
                      <th style={{ width: "25%", textAlign: "center" }}>
                        Action
                      </th>
                    </tr>
                    {this.state.allTrainingData.length > 0 ? (
                      this.state.allTrainingData.map((data, i) => (
                        <tr key={i}>
                          <td colspan="6">
                            <div className="tble-row">
                              <table
                                width="100%"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tr>
                                  <td style={{ width: "15%" }}>
                                    {data.documentName}
                                  </td>
                                  <td style={{ width: "15%" }}>
                                    {data.issuingOrganization}
                                  </td>
                                  <td style={{ width: "15%" }}>
                                    {SetDateFormat(data.requestDate)} |{" "}
                                    {SetTimeFormat(data.requestDate)}{" "}
                                  </td>
                                  {data.issuingDate === "" ? (
                                    <td style={{ width: "15%" }}>NA </td>
                                  ) : (
                                    <td style={{ width: "15%" }}>
                                      {SetDateFormat(data.issuingDate)}{" "}
                                    </td>
                                  )}
                                  {data.expirationDate === "" ? (
                                    <td style={{ width: "15%" }}>NA </td>
                                  ) : (
                                    <td style={{ width: "15%" }}>
                                      {SetDateFormat(data.expirationDate)}{" "}
                                    </td>
                                  )}
                                  <td
                                    style={{
                                      width: "25%",
                                      textAlign: "center",
                                    }}
                                  >
                                    <div className="dcs-link">
                                      {/* <a href="javascript:void(0)">
                                        <img
                                          src={ImageName.IMAGE_NAME.EYE_BTN}
                                          onClick={() => {
                                            this.onDownloadTraining(i);
                                          }}
                                        />
                                      </a> */}
                                      {data.verificationStatus === 1 ? (
                                        <React.Fragment></React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          {data.verificationStatus === 2 ? (
                                            <a href="javascript:void(0)">
                                              <img
                                                src={
                                                  ImageName.IMAGE_NAME
                                                    .BLUE_TICK_JPG
                                                }
                                                onClick={() => {
                                                  this.approveDocument(data.id);
                                                }}
                                              />
                                            </a>
                                          ) : (
                                            <React.Fragment>
                                              <a href="javascript:void(0)">
                                                <img
                                                  src={
                                                    ImageName.IMAGE_NAME
                                                      .CANCEL_BTN
                                                  }
                                                  onClick={() => {
                                                    this.rejectDocuments(
                                                      data.id
                                                    );
                                                  }}
                                                />
                                              </a>
                                              <a href="javascript:void(0)">
                                                <img
                                                  src={
                                                    ImageName.IMAGE_NAME
                                                      .BLUE_TICK_JPG
                                                  }
                                                  onClick={() => {
                                                    this.approveDocument(
                                                      data.id
                                                    );
                                                  }}
                                                />
                                              </a>
                                            </React.Fragment>
                                          )}
                                        </React.Fragment>
                                      )}
                                      <a href="javascript:void(0)">
                                        <img
                                          src={ImageName.IMAGE_NAME.DWN_ICON}
                                          onClick={() => {
                                            this.onDownloadTraining(i);
                                          }}
                                        />
                                        {data.verificationStatus === 1 ? (
                                          <React.Fragment></React.Fragment>
                                        ) : (
                                          <React.Fragment>
                                            <img
                                              src={
                                                ImageName.IMAGE_NAME.EDIT_SQUARE
                                              }
                                              style={{ cursor: "pointer" }}
                                              id="basic-button"
                                              className="serv-cat-edit-btn"
                                              onClick={() => this.editPage(i)}
                                            />
                                          </React.Fragment>
                                        )}
                                      </a>
                                    </div>
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
                          <td colSpan="6">
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

        <div
          id="document-detail-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-md">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="filter-head _fl document-hd">
                <h3>Document Details</h3>
                <button type="button" className="close" data-dismiss="modal">
                  X
                </button>
              </div>

              <div className="modal-body">
                <div className="model-info dd-doc f-model">
                  <table
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                  >
                    <tr>
                      <th>Document Name</th>
                      <td>Passport</td>
                    </tr>
                    <tr>
                      <th>Issuing Date</th>
                      <td>sdfsf</td>
                    </tr>

                    <tr>
                      <th>Expirtaion Date</th>
                      <td>52222</td>
                    </tr>

                    <tr>
                      <th>Status</th>
                      <td>Verification Pending</td>
                    </tr>
                    <tr>
                      <th>Last Modified Date</th>
                      <td>Feb 15 2021 | 12:20AM</td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <table width="100%">
                          <tr>
                            <th>Front Image</th>
                            <td>
                              <figure>
                                <img src={ImageName.IMAGE_NAME.FRONT_IMG} />
                              </figure>
                            </td>
                            <th>Back Image</th>
                            <td>
                              <figure>
                                <img src={ImageName.IMAGE_NAME.FRONT_IMG} />
                              </figure>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </div>
                <div className="md-btn text-center">
                  <a href="#" className="edit">
                    EDIT
                  </a>
                  <a href="#" className="reject">
                    REJECT
                  </a>
                  <a href="#" className="approved">
                    APPROVED
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
                        href="javascript:void(0)"
                        onClick={() => {
                          this.rejectDocuments(this.state.view_modal_id);
                        }}
                        className="reject"
                        style={{ textDecoration: "none", color: "#fff" }}
                      >
                        REJECT
                      </a>
                      <a
                        href="javascript:void(0)"
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


        {/* ..................Add Document Modal................................. */}
        <div
          id="add-docs-modal"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content" style={{ width: "100%" }}>
              <div className="docs-modal-head">
                <div className="row">
                  <div className="col-md-12">
                    ADD DOCUMENT DETAILS
                    <button className="close-page">
                      <img
                        src={ImageName.IMAGE_NAME.CLOSE_BTN_2}
                        onClick={() => {
                          this.closeAddDocsModal();
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
                    {/* <div className="md-btn text-center">
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.rejectDocuments(this.state.view_modal_id);
                        }}
                        className="reject"
                        style={{ textDecoration: "none", color: "#fff" }}
                      >
                        REJECT
                      </a>
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.approveDocument(this.state.view_modal_id);
                        }}
                        className="approved"
                        style={{ textDecoration: "none", color: "#fff" }}
                      >
                        APPROVED
                      </a>
                    </div> */}
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
                        onClick={this.onCloseDeclineModal}
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
                          href="javascript:void(0)"
                          className="white-btn"
                          onClick={this.onCloseDeclineModal}
                        >
                          cancel
                        </a>
                        <a
                          href="javascript:void(0)"
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
          class="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}
