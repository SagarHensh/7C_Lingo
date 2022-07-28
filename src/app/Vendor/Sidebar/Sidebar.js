import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import "./Sidebar.css";

import history from "../../../history";
import { Link } from "react-router-dom";
import { ImageName } from "../../../enums";

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    window.$("._menubtn").click(function () {
      $(".side-navigaiton,.component-wrapper").toggleClass("hp");
    });

    window.$(".responsive-menu").click(function () {
      $(".side-navigaiton").toggleClass("hp");
    });

    window.$(".close-nav").click(function () {
      $(".side-navigaiton").removeClass("hp");
    });

    window.$(".arrow_btn").click(function () {
      $(this).toggleClass("op");
      if ($(this).hasClass("op")) {
        $(this).toggleClass("op");
        $(this).parent().find(".dropdown-app").slideUp();
      } else {
        $(this).toggleClass("op");
        $(this).parent().find(".dropdown-app").slideDown();
      }
    });
  }

  toggledown = () => {
    // window.$('.dropdown-app .op').slideToggle();
    document.getElementsByClassName(".dropdown-app .op").slideToggle();
  };

  render() {
    return (
      <nav className="side-navigaiton">
        <button className="_menubtn">
          <img src={ImageName.IMAGE_NAME.MENU_ICON} />
        </button>
        <button className="close-nav">X</button>
        <div className="side_navigatoin">
          <ul>
            <li className="active">
              <Link
                className="ico dashboard"
                to="/vendorDashboard"
                style={{ textDecoration: "none" }}
              >
                <figure className="menu-link-icon">
                  <img src={ImageName.IMAGE_NAME.MENU.DASHBOARD_PUZZLE_ICON} />
                </figure>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
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

            <li className="dd-menu">
              <Link
                to="/vendorDashboard"
                className="ico Clinets"
                style={{
                  textDecoration: "none",
                  color: "rgb(255 255 255 / 50% )",
                }}
              >
                <figure className="menu-link-icon">
                  <img src={ImageName.IMAGE_NAME.MENU.PROJECT_ICON} />
                </figure>
                <span>Projects</span>
              </Link>
              <button className="arrow_btn"></button>
              <div className="dropdown-app">
                <ul>
                  {/* <li>
                    <Link
                      to="/vendorTranslationList"
                      style={{
                        textDecoration: "none",
                        color: "rgb(255 255 255 / 50% )",
                      }}
                    >
                      Translation
                    </Link>
                  </li> */}
                  <li>
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

            <li>
              <Link
                to="/vendorRateCard"
                className="ico Documents"
                style={{
                  textDecoration: "none",
                  color: "rgb(255 255 255 / 50% )",
                }}
              >
                <figure className="menu-link-icon">
                  <img src={ImageName.IMAGE_NAME.MENU.INVOICE_DOLLER} />
                </figure>
                <span>Rate Card</span>
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
                  <img src={ImageName.IMAGE_NAME.MENU.NOTIFICATION_SIDE} />
                </figure>
                <span>Notifications</span>
              </Link>
            </li>

            <li className="dd-menu">
              <a
                href="#"
                className="ico Clinets"
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
              <button className="arrow_btn"></button>
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
                  <li>
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
            <li className="dd-menu">
              <Link
                to="/contact7C"
                className="ico Documents"
                style={{
                  textDecoration: "none",
                  color: "rgb(255 255 255 / 50% )",
                }}
              >
                <figure className="menu-link-icon">
                  <img src={ImageName.IMAGE_NAME.MENU.INVOICE_DOLLER} />
                </figure>
                <span>Contact 7C</span>
              </Link>
            </li>
          </ul>
          <ul style={{ height: "1050px" }}></ul>
        </div>
      </nav>
    );
  }
}
