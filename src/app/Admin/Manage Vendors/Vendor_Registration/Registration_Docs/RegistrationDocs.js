import React from "react";
import { AlertMessage, ImageName } from "../../../../../enums";
// import Header from "../../Header/Header";
// import Sidebar from "../../Sidebar/Sidebar";
import $ from "jquery";
// import "./docs.css";
import axios from "axios";
import {
  IMAGE_PATH_ONLY,
  IMAGE_STORE_PATH,
  VENDOR_IDENTIFICATION_DOCS,
} from "../../../../../services/config/api_url";
import { Decoder, Encoder } from "../../../../../services/auth";
import {
  SetDateFormat,
  SetTimeFormat,
} from "../../../../../services/common-function";
import history from "../../../../../history";
import { ApiCall } from "../../../../../services/middleware";
import { ErrorCode } from "../../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";
import { inputEmptyValidate } from "../../../../../validators";
import { Link } from "react-router-dom";

export default class VendorRegistrationDocs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: 1,
      total_page: 10,
      limit: 10,
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
        label: "10",
        value: "10",
      },
    };
  }

  componentDidMount() {
    let mainData = this.props.location;
    let preData = mainData.state;
    if (preData === undefined) {
      return history.push("/adminVendorRegistration");
    }
    this.setState({
      showId: preData,
    });

    window.scrollTo(0, 0);
    var ddData = [
      {
        text: "10",
        value: 10,
      },
      {
        text: "20",
        value: 20,
      },
      {
        text: "30",
        value: 30,
      },
      {
        text: "40",
        value: 40,
      },
      {
        text: "50",
        value: 50,
      },
    ];

    var classInstance = this;
    window.$(".myDropdown").ddslick({
      data: ddData,
      onSelected: function (data) {
        classInstance.setState({
          limit: data.selectedData.value,
          offset: "0",
        });
        //   classInstance.load();
      },
    });

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
    this.vendorDocsDataApi(preData);
  }

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

  vendorDocsDataApi = async (id) => {
    let data = {
      userId: id,
    };

    //* ********* Api for contractList******* */

    let payload = await ApiCall("getVendorContractList", {
      vendorid: id,
    });
    let resContract = Decoder.decode(payload.data.payload);
    this.setState({
      allContractListData: resContract.data.contractList,
    });

    //* ********* Api for training tList******* */

    let payloadTraining = await ApiCall("getVendorTrainingList", {
      vendorid: id,
    });
    let resTraining = Decoder.decode(payloadTraining.data.payload);
    this.setState({
      allTrainingData: resTraining.data.traningList,
    });

    const encodeData = Encoder.encode(data);
    axios
      .post(VENDOR_IDENTIFICATION_DOCS, {
        payload: encodeData,
      })
      .then((res) => {
        let payload = Decoder.decode(res.data.data.payload);
        let respObject = payload.data;
        this.setState({
          identificationDocs: respObject,
        });
      });
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
      if (data.status === "1") {
        toast.success(AlertMessage.MESSAGE.DOCUMENT.DOCUMENT_STATUS_APPROVED, {
          hideProgressBar: true,
        });
      } else if (data.status === "2") {
        toast.success(AlertMessage.MESSAGE.DOCUMENT.DOCUMENT_STATUS_DECLINED, {
          hideProgressBar: true,
        });
      }
      this.vendorDocsDataApi(this.state.showId);
    }
  };

  onDownload = (pos) => {
    window.open(
      IMAGE_PATH_ONLY + this.state.identificationDocs[pos].documentPath,
      "_blank"
    );
  };

  onDownloadContract = (pos) => {
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
      this.closeViewDocsModal();
    }
  };

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
              <Link to="/adminVendorRegistration">Vendor Registration</Link> / Vendor Document
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
                  <li className="active" data-related="tble-data-a">
                    Contract
                  </li>
                  <li data-related="tble-data-b">indentification docs</li>
                  <li data-related="tble-data-c">
                    <span>Continued</span> Education Training
                  </li>
                </ul>
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
                      <th style={{ width: "25%" }}>Document Name</th>
                      <th style={{ width: "25%" }}>Last Modified On</th>
                      <th style={{ width: "25%" }}>Status</th>
                      <th style={{ width: "25%", textAlign: "center" }}>
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
                                  <td style={{ width: "25%" }}>
                                    {data.documentName}
                                  </td>
                                  <td style={{ width: "25%" }}>
                                    {SetDateFormat(data.requestDate)} |{" "}
                                    {SetTimeFormat(data.requestDate)}
                                  </td>
                                  {data.verificationStatus === 0 ? (
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
                                  )}
                                  <td
                                    style={{
                                      width: "25%",
                                      textAlign: "center",
                                    }}
                                  >
                                    <div className="dcs-link">
                                      <img
                                        src={ImageName.IMAGE_NAME.EYE_BTN}
                                        onClick={() => {
                                          this.onDownloadContract(i);
                                        }}
                                      />
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
                                      <img
                                        src={ImageName.IMAGE_NAME.DWN_ICON}
                                        onClick={() => {
                                          this.onDownloadContract(i);
                                        }}
                                      />
                                    </div>{" "}
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <React.Fragment></React.Fragment>
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
                                  <figure>
                                    <img
                                      className="doc_img_id"
                                      src={IMAGE_PATH_ONLY + data.documentPath}
                                    />
                                  </figure>
                                </td>
                                <td style={{ width: "10%" }}>
                                  <figure>
                                    <img
                                      className="doc_img_id"
                                      src={
                                        IMAGE_PATH_ONLY + data.altDocumentPath
                                      }
                                    />
                                  </figure>
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
                                    <span className="Pending_btn">Pending</span>
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
                                  style={{ width: "22%", textAlign: "center" }}
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
                                                  this.rejectDocuments(data.id);
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
                                                  this.approveDocument(data.id);
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
                                      <a href="javascript:void(0)">
                                        <img
                                          src={ImageName.IMAGE_NAME.EYE_BTN}
                                          onClick={() => {
                                            this.onDownloadTraining(i);
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
                      <React.Fragment></React.Fragment>
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
