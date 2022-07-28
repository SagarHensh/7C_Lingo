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
import { ApiCall } from "../../../../services/middleware";
import { ErrorCode } from "../../../../services/constant";
import { toast, ToastContainer } from "react-toastify";
import { inputEmptyValidate } from "../../../../validators";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SmallReactLoader from "../../../Loader/SmallLoader";

export default class VendorDocumentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
      flag: false,
      isOpen: false,
      isLoad: true,
      adminPhoto: "",
      frontPhoto: "",
      backPhoto: "",
      //   imagePath: "images/profile-pic.png",
      imagePath: "",
      backimagePath: "",
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
      allContractListData: [
        {
          documentType: "PDF",
          requestDate: "",
          verificationStatus: 0,
        },
        {
          documentName: "PDF",
          requestDate: "",
          verificationStatus: 1,
        },
        {
          documentName: "PDF",
          requestDate: "",
          verificationStatus: 2,
        },
      ],
      allDocListData: [
        {
          documentType: "Driving Licence",
          frontImage: 0,
          backImage: 0,
          frontPath: "",
          backPath: "",
        },
        {
          documentType: "Passport",
          frontImage: 0,
          backImage: 0,
          frontPath: "",
          backPath: "",
        },
        {
          documentType: "SSN",
          frontImage: 0,
          backImage: 0,
          frontPath: "",
          backPath: "",
        },
        {
          documentType: "Govt Issued ID Card",
          frontImage: 0,
          backImage: 0,
          frontPath: "",
          backPath: "",
        },
        {
          documentType: "Immunization Records",
          frontImage: 0,
          backImage: 0,
          frontPath: "",
          backPath: "",
        },
      ],
      allTrainingData: [
        {
          documentType: "PDF",
          requestDate: "",
          verificationStatus: 0,
        },
        {
          documentName: "PDF",
          requestDate: "",
          verificationStatus: 1,
        },
        {
          documentName: "PDF",
          requestDate: "",
          verificationStatus: 2,
        },
      ],
      view_modal_id: "",
    };
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
      isLoad: false,
    });
  };

  clickImage = (index) => {};

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

  openImageModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("image-model").style.display = "block";
    document.getElementById("image-model").classList.add("show");
  };

  closeImageModal = () => {
    document.getElementById("backdrop").style.display = "none";

    document.getElementById("image-model").style.display = "none";
    document.getElementById("image-model").classList.remove("show");
  };
  menuBtnhandleClick = (index, event) => {
    this.setState({
      curIndex: index,
      anchorEl: event.currentTarget,
    });
  };
  //..............function for MenuButton close..............
  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  onCancel = () => {
    // window.$("#delete-modal").modal("hide");
    this.closeDeleteModal();
  };
  deletePage = (index) => {
    this.setState({
      curIndex: index,
      // workingId: this.state.listData[index].id,
    });
    // window.$("#delete-modal").modal("show");
    this.openDeleteModal();
  };
  deleteItem = async () => {
    let stat = 2;
    // window.$("#delete-modal").modal("hide");
    this.closeDeleteModal();
    let data = {
      id: this.state.workingId,
      status: stat.toString(),
    };
    let status = await ApiCall("changeStatusService", data);
    if (
      status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      this.load();
      toast.success(AlertMessage.MESSAGE.DELETE.DELETED);
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

  onProfileFrontImage = (e, index) => {
    let isCheck = 0;

    for (let i = 0; i < this.state.allDocListData.length; i++) {
      if (i === index) {
        this.setState({
          isLoad: true,
        });
      }
    }

    if (this.state.allDocListData[index].frontImage === 0) {
      isCheck = 1;
    } else {
      isCheck = 0;
    }
    this.state.allDocListData[index].frontImage = isCheck;

    consoleLog("::::", e.target.files[0]);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      let mainPath = res.data.data.url;
      this.state.allDocListData[index].frontPath = mainPath;
      consoleLog("res:::", mainPath);
      this.setState({
        allDocListData: this.state.allDocListData,
        imagePath: res.data.data.url,
        frontPhoto: res.data.data.path + res.data.data.filename,
        isLoad: false,
      });
    });

    // ...................................

    // const formData = new FormData();
    // formData.append("file", e.target.files[0]);
    // axios.post(IMAGE_URL, formData).then((res) => {
    //   consoleLog("res:::", res.data.data);
    //   this.setState({
    //     frontimagePath: res.data.data.url,
    //     frontPhoto: res.data.data.path + res.data.data.filename,
    //   });

    //  if (res.data.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR) {
    //    this.setState({
    //      hidden: true,
    //      onDocLoad: true,
    //    });
    //    toast.success(
    //      AlertMessage.MESSAGE.DOCUMENT.DOCUMENT_UPLOAD_SUCCESS,
    //      {
    //        hideProgressBar: true,
    //      }
    //    );
    //  } else {
    //    this.setState({
    //      hidden: false,
    //    });
    //  }
    // });
  };
  onProfileBackImage = (e, index) => {
    consoleLog("::::", index);
    let isCheck = 0;

    if (this.state.allDocListData[index].backImage === 0) {
      isCheck = 1;
    } else {
      isCheck = 1;
    }
    this.state.allDocListData[index].backImage = isCheck;

    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      let mainPath = res.data.data.url;
      this.state.allDocListData[index].backPath = mainPath;
      consoleLog("res:::", mainPath);

      this.setState({
        imagePath: res.data.data.url,
        allDocListData: this.state.allDocListData,
        backPhoto: res.data.data.path + res.data.data.filename,
      });

      //      if (res.data.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR) {
      //        this.setState({
      //          hidden: true,
      //          onDocLoad: true,
      //        });
      //        toast.success(
      //          AlertMessage.MESSAGE.DOCUMENT.DOCUMENT_UPLOAD_SUCCESS,
      //          {
      //            hideProgressBar: true,
      //          }
      //        );
      //      } else {
      //        this.setState({
      //          hidden: false,
      //        });
      //      }
    });
  };
  handleShowDialog = () => {
    this.setState({ isOpen: !this.state.isOpen });
    // console.log("cliked");
  };

  onClose = (index, value) => {
    // consoleLog("<><><><><<>>", value);
    if (value === "front") {
      this.state.allDocListData[index].frontImage = 0;
      this.state.allDocListData[index].frontPath = "";
    } else if (value === "back") {
      this.state.allDocListData[index].backImage = 0;
      this.state.allDocListData[index].backPath = "";
    }

    this.setState({
      allDocListData: this.state.allDocListData,
    });
  };
  onModalClose = () => {
    this.closeImageModal();
  };

  //   ..........add new button.......................
  addNew = () => {
    return history.push("/vendorAddDocument");
  };
  editPage = () => {
    this.props.history.push({
      pathname: "/vendorEditDocument",
      state: this.state.allTrainingData[this.state.curIndex],
    });
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <React.Fragment>
        {/* <div className="wrapper"> */}
          <ToastContainer hideProgressBar={true} theme="colored"/>

          {/* <Header />
          <Sidebar /> */}
          <div className="component-wrapper">
            <div className="listing-component-app">
              <div
                className="vn_frm"
                style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
              >
                {" "}
                Document
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
                      <div class="addnew">
                        <a href={"javascript:void(0)"}>
                          {/* <a href={void 0}> */}
                          Add New{" "}
                          <img
                            className=""
                            src={ImageName.IMAGE_NAME.ADD_WITH_CIRCLE_BG}
                            style={{ width: "25px", cursor: "pointer" }}
                            onClick={this.addNew}
                          />
                        </a>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment></React.Fragment>
                  )}
                  <div className="tble-short">
                    <span className="lbl">Display</span>

                    <div class="dropdwn">
                      <select class="myDropdown frm4-select"></select>
                    </div>
                  </div>
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
                                      <React.Fragment>
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
                                          <MenuItem
                                            onClick={() => this.onUpload(i)}
                                          >
                                            Upload
                                          </MenuItem>
                                        </Menu>
                                      </React.Fragment>
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
                        <th style={{ width: "30%" }}>Document Type</th>
                        <th style={{ width: "30%" }}>Front Image</th>
                        <th style={{ width: "30%" }}>Back Image</th>
                      </tr>
                      {this.state.allDocListData.map((item, key) => (
                        <tr key={key}>
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
                                    {item.documentType}
                                  </td>
                                  <td style={{ width: "30%" }}>
                                    <div
                                      hidden={!this.state.isLoad}
                                      class="upload-profile doc-img"
                                    >
                                      <SmallReactLoader />
                                    </div>
                                    <div
                                      hidden={this.state.isLoad}
                                      class="upload-profile doc-img"
                                    >
                                      {item.frontImage === 1 ? (
                                        <div
                                          className="cross-btn"
                                          onClick={() =>
                                            this.onClose(key, "front")
                                          }
                                        >
                                          <img
                                            src={ImageName.IMAGE_NAME.CROSS_BTN}
                                          />
                                        </div>
                                      ) : (
                                        <React.Fragment></React.Fragment>
                                      )}

                                      <label
                                        htmlFor="file-upload"
                                        for={"profile_image" + key}
                                        className=""
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title={this.state.frontPhoto.substring(
                                          8
                                        )}
                                        style={{
                                          cursor: "pointer",
                                          marginBottom: "0px",
                                        }}
                                        // hidden={this.state.onDocLoad}
                                      >
                                        {item.frontImage === 1 ? (
                                          <React.Fragment>
                                            {" "}
                                            <img
                                              style={{
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                this.openImageModal(key)
                                              }
                                              src={item.frontPath}
                                            />
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
                                            item.frontImage === 1 ? true : false
                                          }
                                          accept="image/*"
                                          type="file"
                                          id={"profile_image" + key}
                                          style={{ display: "none" }}
                                          onChange={(e) =>
                                            this.onProfileFrontImage(e, key)
                                          }
                                        />
                                      </label>
                                    </div>
                                  </td>
                                  <td style={{ width: "30%" }}>
                                    <div class="upload-profile doc-img">
                                      {item.backImage === 1 ? (
                                        <div
                                          className="cross-btn"
                                          onClick={() =>
                                            this.onClose(key, "back")
                                          }
                                        >
                                          <img
                                            src={ImageName.IMAGE_NAME.CROSS_BTN}
                                          />
                                        </div>
                                      ) : (
                                        <React.Fragment></React.Fragment>
                                      )}
                                      <label
                                        htmlFor="file-upload"
                                        for={"profile_back_image" + key}
                                        className=""
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title={this.state.backPhoto.substring(
                                          8
                                        )}
                                        style={{
                                          cursor: "pointer",
                                          marginBottom: "0px",
                                        }}
                                        // hidden={this.state.onDocLoad}
                                      >
                                        {item.backImage === 1 ? (
                                          <React.Fragment>
                                            {" "}
                                            <img
                                              style={{
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                this.openImageModal(key)
                                              }
                                              //   src={
                                              //     ImageName.IMAGE_NAME
                                              //       .UPLOADED_FILE
                                              //   }
                                              src={item.backPath}
                                            />
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
                                            item.backImage === 1 ? true : false
                                          }
                                          accept="image/*"
                                          type="file"
                                          id={"profile_back_image" + key}
                                          style={{ display: "none" }}
                                          onChange={(e) =>
                                            this.onProfileBackImage(e, key)
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
                      ))}
                      <tr>
                        <td style={{ width: "30%" }}></td>
                        <td style={{ width: "30%", padding: "20px" }}>
                          <a
                            className="blue-btn doc-save-btn"
                            style={{ textDecoration: "none", color: "white" }}
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
                                        onClick={() => this.editPage()}
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
                        <React.Fragment></React.Fragment>
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
          <div className="modal-dialog modal-lg modal-dialog-centered">
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
                      width: "10%",
                    }}
                    data-dismiss="modal"
                    // onClick={() => this.deleteItem()}
                  >
                    Yes
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

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

        {/* ..................Decline modal................................. */}

        <div
          class="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}
