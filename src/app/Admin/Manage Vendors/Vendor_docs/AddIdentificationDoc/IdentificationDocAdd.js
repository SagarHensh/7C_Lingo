import axios from "axios";
import React, { Component } from "react";
import { toast } from "react-toastify";
import { AlertMessage, ImageName } from "../../../../../enums";
import { Decoder } from "../../../../../services/auth";
import { consoleLog } from "../../../../../services/common-function";
import { IMAGE_URL } from "../../../../../services/config/api_url";
import { ErrorCode } from "../../../../../services/constant";
import { ApiCall, ApiCallVendor } from "../../../../../services/middleware";
import SmallReactLoader from "../../../../Loader/SmallLoader";

class IdentificationDocAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendorId: "",


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
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    var classInstance = this;
    var imageModal = document.getElementById("image-model");
    window.onclick = function (event) {
      if (event.target === imageModal) {
        classInstance.closeImageModal();
      }
    };
    this.onLoad();
  }

  onLoad = async () => {
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
    consoleLog("vendorId", this.props.vendorId)
    this.setState({
      vendorId: this.props.vendorId
    })
    this.listApi(this.props.vendorId);
  };
  listApi = async (data) => {
    let drivingDoc = {},
      passportDoc = {},
      ssnDoc = {},
      govtDoc = {},
      contractDecodeData = [],
      educationDecodeData = [],
      recordDoc = {};

    // consoleLog("))))))))", auth);
    let res = await ApiCallVendor("getVendorIdentificationDoc", data);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      consoleLog("identify docs:::", decodeData);

      drivingDoc = decodeData.data[0];
      passportDoc = decodeData.data[1];
      ssnDoc = decodeData.data[2];
      govtDoc = decodeData.data[3];
      if (decodeData.data.length > 4) {
        recordDoc = decodeData.data[4];
      }
    }
  }

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
      let objData = {
        vendorId: this.state.vendorId,
        useId: this.state.vendorId,
        doc: reqData
      };
      consoleLog("obj<<<<<<", objData);
      let responseContractData = await ApiCallVendor(
        "addVendorIdentificationDoc",
        objData
      );

      if (
        responseContractData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        responseContractData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success("Successfully Added");
        window.scrollTo(0, 0);
      } else {
        toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
      }
    }
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
  onModalClose = () => {
    this.closeImageModal();
  };

  render() {
    return (
      <React.Fragment>
        <div className="table-listing-app">
          <div className="table-responsive">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <th style={{ width: "30%" }}>Document Name</th>
                <th style={{ width: "30%" }}>Front Image</th>
                <th style={{ width: "30%" }}>Back Image</th>
              </tr>
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
                          Driving License
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
                              // title={this.state.drivingFrontPhoto.substring(
                              //   8
                              // )}
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
                              // title={this.state.drivingBackPhoto.substring(
                              //   8
                              // )}
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
                          Passport
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
                              // title={this.state.passportFrontPhoto.substring(
                              //   8
                              // )}
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
                              // title={this.state.passportBackPhoto.substring(
                              //   8
                              // )}
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
                          SSN
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
                              // title={this.state.ssnFrontPhoto.substring(
                              //   8
                              // )}
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
                              // title={this.state.ssnBackPhoto.substring(8)}
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
                          Govt Issued ID Card
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
                              // title={this.state.govtFrontPhoto.substring(
                              //   8
                              // )}
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
                              // title={this.state.govtBackPhoto.substring(
                              //   8
                              // )}
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
        <div
          className="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}

export default IdentificationDocAdd;
