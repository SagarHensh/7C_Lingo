import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import "./sidebar.css";
import { Link } from "react-router-dom";
import { ImageName } from "../../../enums";
import { CLIENT_PATH } from "../../../Router/RouterIndex";

export default class ClientSidebar extends React.Component {
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

    $('.arrow_btn').on("click", function () {


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
    return (
      <React.Fragment>
        <nav className="side-navigaiton">
          <button className="_menubtn">
            <img src={ImageName.IMAGE_NAME.MENU_ICON} />
          </button>
          <button className="close-nav">X</button>
          <div className="side_navigatoin">
            <ul>
              <li className={CLIENT_PATH.DASHBOARD.indexOf(path) >= 0 ? "active" : ""}>
                <Link
                  className="ico dashboard"
                  to="/clientDashboard"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )"
                  }}
                >
                  <figure className="menu-link-icon">
                    <img
                      src={ImageName.IMAGE_NAME.MENU.DASHBOARD_PUZZLE_ICON}
                    />
                  </figure>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className={CLIENT_PATH.CONTACT.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
                <a
                  href="javascript:void(0)"
                  className="ico Clinets arrow_btn"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.CONTACT_ICON} />
                  </figure>
                  <span>Contacts</span>
                </a>
                <div className="dropdown-app">
                  <ul>
                    <li className={CLIENT_PATH.CONTACT_REQUEST.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/clientContactRequestPage"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        View Request
                      </Link>
                    </li>
                    <li className={CLIENT_PATH.CONTACT_LIST.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/clientContactListPage"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        View Listing
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className={CLIENT_PATH.DEPARTMENT.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
                <Link
                  to="departmentClient"
                  className="ico Departments"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.DEPARTMENT_ICON} />
                  </figure>
                  <span>Departments</span>
                </Link>
              </li>
              <li className={CLIENT_PATH.JOB_PANEL.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
                <a
                  href="javascript:void(0)"
                  className="ico Clinets arrow_btn"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.JOB_TYPE} />
                  </figure>
                  <span>Interpretation Jobs</span>
                </a>
                <div className="dropdown-app">
                  <ul>
                    <li className={CLIENT_PATH.NEED_ATTENTION.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/clientNeedAttentionJobs"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      // onClick={() => this.tabChange(1)}
                      >
                        Need Attention
                      </Link>
                    </li>
                    {/* <li><Link to="/adminViewAllJobs" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Need Attention</Link></li> */}
                    <li className={CLIENT_PATH.UNASSIGNED.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/clientUnAssignedJobs"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Unassigned
                      </Link>
                    </li>
                    <li className={CLIENT_PATH.ASIGNED.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/clientAssignedJobs"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Assigned
                      </Link>
                    </li>
                    <li className={CLIENT_PATH.ALL_JOBS.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/clientAllJobsMain"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        All Jobs
                      </Link>
                    </li>
                    <li className={CLIENT_PATH.HISTORY.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/clientJobsHistory"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        History
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="ico Documents"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.INTERPRETATION_HISTORY} />
                  </figure>
                  <span>Interpretation History</span>
                </a>
              </li>
              <li className={CLIENT_PATH.PROJECTS.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
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
                    <li className={CLIENT_PATH.TRANSLATION.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/clientTranslationList"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Translation
                      </Link>
                    </li>
                    <li className={CLIENT_PATH.TRAINING.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/clientTrainingList"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Training
                      </Link>
                    </li>
                    {/* <li><a href="#" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Internal Projects</a></li> */}
                  </ul>
                </div>
              </li>
              <li className={CLIENT_PATH.INVOICE.indexOf(path) >= 0 ? "active" : ""}>
                <Link
                  to="/clientInvoiceList"
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
                <a
                  href="javascript:void(0)"
                  className="ico Documents"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.CHAT_ICON_BLUE} />
                  </figure>
                  <span>Chat</span>
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="ico Documents"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.DOCUMENTS_TASK} />
                  </figure>
                  <span>Resources</span>
                </a>
              </li>

              <li className="dd-menu">
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
                </a>
                <div className="dropdown-app">
                  <ul>
                    <li className="dd-menu">
                      <a
                        href="javascript:void(0)"
                        className="ico Clinets"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        <figure className="menu-link-icon"></figure>
                        <span>Notifications</span>
                      </a>
                      {/* <div className="dropdown-app">
                      <ul>
                        <li><a href="#" style={{ textDecoration: 'none' }}>Notifications Listing</a></li>
                        <li><a href="#" style={{ textDecoration: 'none' }}>Configurable Notification</a></li>
                      </ul>
                    </div> */}
                    </li>
                    {/* <li>
                          <a href="javascript:void(0)"
                            style={{
                              textDecoration: "none",
                              color: "rgb(255 255 255 / 50% )",
                            }}
                          >
                            Configuration Panel
                          </a>
                        </li> */}
                    <li>
                      <a
                        href="javascript:void(0)"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Notification Panel
                      </a>
                    </li>
                    {/* <li><a href="javascript:void(0)" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Industry Type</a></li>
                        <li><a href="javascript:void(0)" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Service Offered</a></li>
                        <li><a href="javascript:void(0)" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Training Courses</a></li>
                        <li><a href="javascript:void(0)" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Roles</a></li>
                        <li><a href="javascript:void(0)" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Users</a></li>
                        <li><a href="javascript:void(0)" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Manage Static Content</a></li> */}
                  </ul>
                </div>
              </li>
            </ul>
            {/*<ul style={{ height: '1050px' }}></ul>*/}
          </div>
        </nav>
      </React.Fragment>
    );
  }
}
