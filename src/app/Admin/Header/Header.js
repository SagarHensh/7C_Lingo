import React, { Component } from "react";
import "../../../app/Admin/Header/header.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import styled from "styled-components";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// import { showClient } from "./";
import { showClientHeader, changeHeader } from "./Actions/Action";
import { valueChange } from "../../../store/CombineReducer/actions/Action";

import history from "../../../history";
import { ApiCall, ApiCallClient } from "../../../services/middleware";
import { AlertMessage, ImageName } from "../../../enums";
import { Decoder } from "../../../services/auth";
import { IMAGE_PATH_ONLY, IMAGE_STORE_PATH } from "../../../services/config/api_url";
import { Link } from "react-router-dom";
import { ErrorCode, UsersEnums } from "../../../services/constant";
import { consoleLog } from "../../../services/common-function";
import { passwordValidator } from "../../../validators";
import { toast } from "react-toastify";
import { InputText } from "../SharedComponents/inputText";
import { passWordRandomGenerate } from "./function";

// import "../../../Styles/style.css";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      anchorEl: null, //menu button
      imagePath: ImageName.IMAGE_NAME.PROFILE_PIC,
      userType: 0,
      // ...for password modal,,,,
      resetPasswordData: ""
    };

    this.onLoad();

  }

  componentDidMount() {
    let data = localStorage.getItem("AuthToken");
    let authUser = Decoder.decode(data);
    if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN) {
      this.setState({
        userType: UsersEnums.APPLICATION_ROLE.SUPER_ADMIN
      })
    } else if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT) {
      this.setState({
        userType: UsersEnums.APPLICATION_ROLE.CLIENT
      })
    } else if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.ADMIN_STAFF) {
      this.setState({
        userType: UsersEnums.APPLICATION_ROLE.ADMIN_STAFF
      })
    } else if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.VENDOR) {
      this.setState({
        userType: UsersEnums.APPLICATION_ROLE.VENDOR
      })
    }
  }

  componentDidUpdate(prevProps) {
    // console.log("Header Update");
    // console.log("Current Props>>>", this.props.imagePath);
    // console.log("PrevProps:>>", prevProps.imagePath)
    if (this.props.imagePath !== prevProps.imagePath) {
      this.setState({
        imagePath: this.props.imagePath
      })
    }
    var classInstance = this;
    var jobModal = document.getElementById("create-request");
    var projectModal = document.getElementById("create-project-request");
    var passwordModal = document.getElementById("password-model");


    window.onclick = function (event) {
      if (event.target === jobModal) {
        classInstance.closeModal();
      }
      if (event.target === projectModal) {
        classInstance.closeProjectModal();
      }
      if (event.target === passwordModal) {
        classInstance.closePasswordModal();
      }
    }
  }

  // static defaultProps = {
  //   imagePath: "http://52.201.119.41:3001/images/profilepic1635924283919.png"
  // }

  onLoad = async () => {
    let res = await ApiCall("getAdminProfile");
    let payload = await Decoder.decode(res.data.payload);
    let admindata = payload.data.adminInfo[0];
    if (admindata.photo === null || admindata.photo === undefined || admindata.photo === "" || admindata.photo === "aaa.jpg") {
      this.setState({
        imagePath: IMAGE_STORE_PATH + "profilepic1635924283919.png"
      })
    } else {
      this.setState({
        imagePath: IMAGE_PATH_ONLY + admindata.photo
      });
    }
  }

  changeHeader = () => {
    let title = this.props.clientTitle;

    this.props.valueChange();
  };
  menuBtnhandleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };
  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  logOut = async () => {
    let data = {
      platform: "WEB"
    }
    let res = await ApiCall("signout", data);
    if (res.error === 0 && res.respondcode === 200) {
      localStorage.removeItem("AuthToken");
      history.push("/");
    }
  }

  goToProfile = () => {
    this.handleMenuClose();
    // consoleLog("UserType :::", this.state.userType)
    if (this.state.userType === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN || this.state.userType === UsersEnums.APPLICATION_ROLE.ADMIN_STAFF) {
      history.push("/adminEditProfile");
    } else if (this.state.userType === UsersEnums.APPLICATION_ROLE.CLIENT) {
      history.push("/clientProfile");
    } else if (this.state.userType === UsersEnums.APPLICATION_ROLE.VENDOR) {
      history.push("/VendorEdit");
    }
  }


  onViewNotification = () => {
    // consoleLog("UserType :::", this.state.userType)
    if (this.state.userType === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN || this.state.userType === UsersEnums.APPLICATION_ROLE.ADMIN_STAFF) {
      // history.push("/adminEditProfile");
    } else if (this.state.userType === UsersEnums.APPLICATION_ROLE.CLIENT) {
      // history.push("/clientProfile");
    } else if (this.state.userType === UsersEnums.APPLICATION_ROLE.VENDOR) {
      history.push("/vendorNotificationList");
    }

  }



  openModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("create-request").style.display = "block";
    document.getElementById("create-request").classList.add("show");
  };

  closeModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("create-request").style.display = "none";
    document.getElementById("create-request").classList.remove("show");
  };

  openProjectModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("create-project-request").style.display = "block";
    document.getElementById("create-project-request").classList.add("show");
  };

  closeProjectModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("create-project-request").style.display = "none";
    document.getElementById("create-project-request").classList.remove("show");
  };
  openPasswordModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("password-model").style.display = "block";
    document.getElementById("password-model").classList.add("show");
  };
  closePasswordModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("password-model").style.display = "none";
    document.getElementById("password-model").classList.remove("show");

  }



  // for password section

  onResetPassChange = (e) => {
    this.setState({
      resetPasswordData: e.target.value,
    });
  };


  openResetPassword = () => {
    let mainPass = passWordRandomGenerate();
    this.setState({
      resetPasswordData: mainPass
    })
    this.handleMenuClose();
    this.openPasswordModal();
  }

  onResetPassword = async () => {
    let errorCount = 0;

    let validatePassword = passwordValidator(this.state.resetPasswordData)

    if (validatePassword.status === false) {
      toast.error(validatePassword.message, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {

      let data = {
        password: this.state.resetPasswordData,
      };
      let status = await ApiCallClient("modifyclientpassword", data);
      if (
        status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        this.closePasswordModal();
        toast.success(AlertMessage.MESSAGE.PASSWORD.RESET_SUCCESS);
      }
    }
  }

  onCloseResetPassword = () => {
    this.closePasswordModal();
  }

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <>
        <header className="header-information">
          <div className="container-fluid">
            <div className="row" id="head-cont">
              <div className="col-6 col-md-4">
                <img src="images/Menu.png" id="img" />
                <figure className="logo" id="logo-img">
                  <Link to="/adminDashboard">
                    <img src={ImageName.IMAGE_NAME.LOGO_WITH_TEXT_BLACK} />
                  </Link>
                </figure>
                <button className="responsive-menu">
                  <img src={ImageName.IMAGE_NAME.MENU_ICON} />
                </button>
              </div>
              <div className="col-6 col-md-8">
                <div className="app-right-info">
                  <div className="head_btn" hidden={this.state.userType === UsersEnums.APPLICATION_ROLE.VENDOR ? true : false}>
                    <a
                      href="javascript:void(0)"
                      className="_btn"
                      style={{ textDecoration: 'none' }}
                      onClick={this.openModal}
                    >
                      <span>create Jobs</span>
                    </a>
                    <a
                      href="javascript:void(0)"
                      className="_btn blue"
                      style={{ textDecoration: 'none' }}
                      onClick={this.openProjectModal}
                    >
                      <span id="cre-proj-text">Create Project</span>
                    </a>
                  </div>
                  <div className="notification">
                    <a href="javascript:void(0)" id="bell" onClick={this.onViewNotification}>
                      <img src={ImageName.IMAGE_NAME.BELL} />
                      {/* <span>1</span> */}
                    </a>
                  </div>
                  <div className="profile-pic">
                    <a href="javascript:void(0)">
                      <img
                        className="profile_img"
                        src={this.state.imagePath}
                        id="basic-button"
                        aria-controls="basic-menu"
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={this.menuBtnhandleClick}
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
                        <MenuItem onClick={this.goToProfile}>View Profile</MenuItem>
                        {this.state.userType === UsersEnums.APPLICATION_ROLE.VENDOR ?
                          <MenuItem onClick={this.openResetPassword}>Change Password</MenuItem>
                          : <></>}

                        <MenuItem onClick={this.logOut}>Log Out</MenuItem>
                      </Menu>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* <!--Create Job Modal --> */}
        <div
          id="create-request"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={this.closeModal}>
                  X
                </button>
                <h4 className="modal-title">New Request</h4>
              </div>
              <div className="modal-body">
                <div className="model-info">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="request_model-info">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.CAMERA_BLUE} />
                        </figure>
                        <h3 className="text-center">schedule interpretation</h3>
                        <p>
                          Reference site about Lorem Ipsum, giving information
                          on its origins, as well as a random Lipsum generator.
                          Reference site about Lorem Ipsum, giving information
                          on its origins, as well as a random Lipsum
                          generator.Reference site about Lorem Ipsum, giving
                          information on its origins, as well as a random Lipsum
                          generator.Reference site about Lorem Ipsum, giving
                          information on its origins, as well as a random Lipsum
                          generator.
                        </p>

                        <div className="re_model text-center">
                          <Link to="/adminCreateNewJob" style={{ textDecoration: "none" }} onClick={this.closeModal}>select</Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="request_model-info">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.CAMERA_BLUE} />
                        </figure>
                        <h3 className="text-center">On-Demand Interpretation</h3>
                        <p>
                          Reference site about Lorem Ipsum, giving information
                          on its origins, as well as a random Lipsum generator.
                          Reference site about Lorem Ipsum, giving information
                          on its origins, as well as a random Lipsum
                          generator.Reference site about Lorem Ipsum, giving
                          information on its origins, as well as a random Lipsum
                          generator.Reference site about Lorem Ipsum, giving
                          information on its origins, as well as a random Lipsum
                          generator.
                        </p>

                        <div className="re_model text-center">
                          <Link to="/adminCreateOnDemandJob" style={{ textDecoration: "none" }} onClick={this.closeModal}>select</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* <!--Create Project Modal --> */}
        <div
          id="create-project-request"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={this.closeProjectModal}>
                  X
                </button>
                <h4 className="modal-title">New Request</h4>
              </div>
              <div className="modal-body">
                <div className="model-info">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="request_model-info">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.CAMERA_BLUE} />
                        </figure>
                        <h3 className="text-center">Translation</h3>
                        <p>
                          Reference site about Lorem Ipsum, giving information
                          on its origins, as well as a random Lipsum generator.
                          Reference site about Lorem Ipsum, giving information
                          on its origins, as well as a random Lipsum
                          generator.Reference site about Lorem Ipsum, giving
                          information on its origins, as well as a random Lipsum
                          generator.Reference site about Lorem Ipsum, giving
                          information on its origins, as well as a random Lipsum
                          generator.
                        </p>

                        <div className="re_model text-center">
                          <Link to="/adminCreateNewTranslation" style={{ textDecoration: "none" }} onClick={this.closeProjectModal}>select</Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="request_model-info">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.CAMERA_BLUE} />
                        </figure>
                        <h3 className="text-center">Training</h3>
                        <p>
                          Reference site about Lorem Ipsum, giving information
                          on its origins, as well as a random Lipsum generator.
                          Reference site about Lorem Ipsum, giving information
                          on its origins, as well as a random Lipsum
                          generator.Reference site about Lorem Ipsum, giving
                          information on its origins, as well as a random Lipsum
                          generator.Reference site about Lorem Ipsum, giving
                          information on its origins, as well as a random Lipsum
                          generator.
                        </p>

                        <div className="re_model text-center">
                          <Link to="/adminCreateNewTraining" style={{ textDecoration: "none" }} onClick={this.closeProjectModal}>select</Link>
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
          id="password-model"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="modal-body">
                <div className="model-info f-model">
                  <div className="form-search-app">
                    <center>
                      <h6>
                        Change Password
                      </h6>
                    </center>
                    <div className="row" style={{ marginTop: "20px" }}>
                      <center>
                        <div className="col-md-6">
                          <input

                            className="inputfield"
                            value={this.state.resetPasswordData}
                            onChange={(e) =>
                              this.onResetPassChange(e)
                            }
                          />
                        </div>
                      </center>
                    </div>


                    <div className="row">
                      <div
                        class="_button-style _fl text-center"
                        style={{ marginTop: "2%" }}
                      >
                        <a
                          href="javascript:void(0)"
                          className="white-btn"
                          style={{ textDecoration: "none" }}
                          onClick={this.onCloseResetPassword}
                        >
                          No
                        </a>
                        <a
                          href="javascript:void(0)"
                          className="blue-btn"
                          style={{ textDecoration: "none" }}
                          onClick={this.onResetPassword}
                        >
                          Yes
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
      </>
    );
  }
}
const mapStateToProps = (state) => {
  const showClientData = state.headerData;
  let clientData = state.mainData;
  let imagePath = state.mainData.imagePath;
  // console.log("Headedr State to props call:", clientData);
  return {
    showClientData,
    clientTitle: clientData.header,
    imagePath
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ showClientHeader, changeHeader, valueChange }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Header);
// export default Header;
