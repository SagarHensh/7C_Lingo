import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import "./sidebar.css";
import { Link } from "react-router-dom";
import { ImageName } from "../../../enums";
import { VENDOR_PATH } from "../../../Router/RouterIndex";

export default class VendorSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: 0,
    };
  }
  componentDidMount() {
    // let data = localStorage.getItem("AuthToken");
    // let authUser = Decoder.decode(data);
    // if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN) {
    //   this.setState({
    //     userType: UsersEnums.APPLICATION_ROLE.SUPER_ADMIN
    //   })
    // } else if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT) {
    //   this.setState({
    //     userType: UsersEnums.APPLICATION_ROLE.CLIENT
    //   })
    // } else if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.ADMIN_STAFF) {
    //   this.setState({
    //     userType: UsersEnums.APPLICATION_ROLE.ADMIN_STAFF
    //   })
    // } else if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.VENDOR) {
    //   this.setState({
    //     userType: UsersEnums.APPLICATION_ROLE.VENDOR
    //   })
    // }

    window.$("._menubtn").click(function () {
      $(".side-navigaiton,.component-wrapper").toggleClass("hp");
    });

    window.$(".responsive-menu").click(function () {
      $(".side-navigaiton").toggleClass("hp");
    });

    window.$(".close-nav").click(function () {
      $(".side-navigaiton").removeClass("hp");
    });

    //........ For toggle down menu to sub menu's............

    $(".arrow_btn").on("click", function () {
      if ($(this).hasClass("op")) {
        $(this).toggleClass("op");
        $(this).parent().find(".dropdown-app").slideUp();
      } else {
        $(this).addClass("op");
        $(this).parent().find(".dropdown-app").slideDown();
      }
    });
  }

  toggledown = () => {
    // window.$('.dropdown-app .op').slideToggle();
    document.getElementsByClassName(".dropdown-app .op").slideToggle();
  };
  render() {
    const path = window.location.pathname;
    // const path= "/vendorDashboard";
    return (
      <React.Fragment>
        <nav className="side-navigaiton">
          <button className="_menubtn">
            <img src={ImageName.IMAGE_NAME.MENU_ICON} />
          </button>
          <button className="close-nav">X</button>
          <div className="side_navigatoin">
            <ul>
              <li className={VENDOR_PATH.DASHBOARD.indexOf(path) >= 0 ? "active" : ""}>
                <Link
                  className="ico dashboard"
                  to="/vendorDashboard"
                  style={{ textDecoration: "none",
                  color: "rgb(255 255 255 / 50% )", }}
                >
                  <figure className="menu-link-icon">
                    <img
                      src={ImageName.IMAGE_NAME.MENU.DASHBOARD_PUZZLE_ICON}
                    />
                  </figure>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className={VENDOR_PATH.DOCUMENTS.indexOf(path) >= 0 ? "active" : ""}>
                <Link
                  to="/vendorDocList"
                  className="ico Documents"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.DOCUMENTS_TASK} />
                  </figure>
                  <span>Documents</span>
                </Link>
              </li>

              <li className={VENDOR_PATH.PROJECT.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
                <a
                  href="javascript:void(0)"
                  className="ico Clinets arrow_btn"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.PROJECT_ICON} />
                  </figure>
                  <span>Projects</span>
                </a>
                <div className="dropdown-app">
                  <ul>
                    <li className={VENDOR_PATH.TRANSLATION.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/vendorTranslationList"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Translation
                      </Link>
                    </li>
                    <li className={VENDOR_PATH.TRAINING.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/vendorTrainingList"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Training
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className={VENDOR_PATH.RATE_CARD.indexOf(path) >= 0 ? "active" : ""}>
                <Link
                  to="/vendorRateCard"
                  className="ico Documents"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.DOCUMENTS_TASK} />
                  </figure>
                  <span>Rate Card</span>
                </Link>
              </li>
              <li className={VENDOR_PATH.INVOICE.indexOf(path) >= 0 ? "active" : ""}>
                <Link
                  to="/vendorInvoicePage"
                  className="ico Documents"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.INVOICE_DOLLER} />
                  </figure>
                  <span>Invoices</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/vendorDashboard"
                  className="ico Documents"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.DEPARTMENT_ICON} />
                  </figure>
                  <span>Statistics</span>
                </Link>
              </li>
              <li className={VENDOR_PATH.NOTIFICATION.indexOf(path) >= 0 ? "active" : ""}>
                <Link
                  to="/vendorNotificationList"
                  className="ico Documents"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.NOTIFICATION_SIDE} />
                  </figure>
                  <span>Notifications</span>
                </Link>
              </li>

              <li className={VENDOR_PATH.SETTINGS.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
                <a
                  href="javascript:void(0)"
                  className="ico Clinets arrow_btn"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.SETTINGS} />
                  </figure>
                  <span>Settings</span>
                </a>{" "}
                <div className="dropdown-app">
                  <ul>
                    <li>
                      <Link
                        to="/vendorDashboard"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Configuration Panel
                      </Link>
                    </li>
                    <li className={VENDOR_PATH.REMINDER.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/vendorReminderList"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Reminder
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className={VENDOR_PATH.CONTACT_7C.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
                <Link
                  to="/contact7C"
                  className="ico Documents"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.EMAIL_ARROW} />
                  </figure>
                  <span>Contact 7C</span>
                </Link>
              </li>
            </ul>
            <ul style={{ height: "1050px" }}></ul>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}
