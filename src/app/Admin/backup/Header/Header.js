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
import { ApiCall } from "../../../services/middleware";
import { ImageName } from "../../../enums";
import { Decoder } from "../../../services/auth";
import { IMAGE_STORE_PATH } from "../../../services/config/api_url";

// import "../../../Styles/style.css";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      anchorEl: null, //menu button
      imagePath: ImageName.IMAGE_NAME.PROFILE_PIC
    };

    this.onLoad();

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
        imagePath: IMAGE_STORE_PATH + admindata.photo
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
    let data = localStorage.getItem("AuthToken");
    let res = await ApiCall("signout");
    if (res.error === 0 && res.respondcode === 200) {
      localStorage.removeItem("AuthToken");
      history.push("/");
    }
  }

  goToProfile = () => {
    this.handleMenuClose();
    history.push("/adminEditProfile");
  }

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    return (
      <>
        <header className="header-information">
          <div className="container-fluid">
            <div className="row">
              <div className="col-6 col-md-4">
                <figure className="logo">
                  <a href="#">
                    <img src={ImageName.IMAGE_NAME.LOGO_WITH_TEXT_BLACK} />
                  </a>
                </figure>
                <button className="responsive-menu">
                  <img src={ImageName.IMAGE_NAME.MENU_ICON} />
                </button>
              </div>
              <div className="col-6 col-md-8">
                <div className="app-right-info">
                  <div className="head_btn">
                    <a
                      href="#"
                      className="_btn"
                      data-toggle="modal"
                      data-target="#create-request"
                      style={{ textDecoration: 'none' }}
                    >
                      <span>create Jobs</span>
                    </a>
                    <a href="#" className="_btn blue"
                      style={{ textDecoration: 'none' }}>
                      <span>Create Project</span>
                    </a>
                  </div>
                  <div className="notification">
                    <a href="#">
                      <img src={ImageName.IMAGE_NAME.BELL} />
                      {/* <span>1</span> */}
                    </a>
                  </div>
                  <div className="profile-pic">
                    <a href="#">
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
                        {/* <MenuItem>Accept</MenuItem> */}
                        <MenuItem onClick={this.logOut}>Log Out</MenuItem>
                      </Menu>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* <!-- Modal --> */}
        <div
          id="create-request"
          className="modal fade modelwindow"
          role="dialog"
        >
          <div className="modal-dialog modal-lg">
            {/* <!-- Modal content--> */}
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">
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
                          <a href="#">select</a>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="request_model-info">
                        <figure>
                          <img src={ImageName.IMAGE_NAME.CAMERA_BLUE} />
                        </figure>
                        <h3 className="text-center">request project</h3>
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
                          <a href="#">select</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
