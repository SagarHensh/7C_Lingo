import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import "./sidebar.css";
import { Link } from "react-router-dom";
import { ImageName } from "../../../enums";
import { consoleLog } from "../../../services/common-function";
import { ADMIN_PATH } from "../../../Router/RouterIndex";

export default class AdminSidebar extends React.Component {
  constructor(props) {
    super(props);
    // console.log("Props::", props)
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
    return (
      <React.Fragment>
        <nav className="side-navigaiton">
          <button className="_menubtn">
            <img src={ImageName.IMAGE_NAME.MENU_ICON} />
          </button>
          <button className="close-nav">X</button>
          <div className="side_navigatoin">
            <ul>
              <li className={ADMIN_PATH.DASHBOARD.indexOf(path) >= 0 ? "active" : ""}>
                <Link
                  className="ico dashboard"
                  to="/adminDashboard"
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
              <li className={ADMIN_PATH.DEPARTMENT.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
                <a
                  href="javascript:void(0)"
                  className="ico Departments arrow_btn"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.DEPARTMENT_ICON} />
                  </figure>
                  <span>Departments</span>
                </a>
                <div className="dropdown-app">
                  <ul>
                    <li className={ADMIN_PATH.MASTER_DEPT.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/masterDepartment"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Master Departments
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.CLIENT_DEPT.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/clientDepartment"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Client Departments
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className={ADMIN_PATH.CLIENT_CONTACT.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
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
                  <span>Clients & Contacts</span>
                </a>
                <div className="dropdown-app">
                  <ul>
                    <li className={ADMIN_PATH.CLIENT.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminClientList"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Client
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.CLIENT_REQUEST.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminClientRequstList"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Client Request
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.CONTACT.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminClientContactList"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Contacts
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.CONTACT_REQUEST.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminContactsRequest"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Contact request
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className={ADMIN_PATH.VENDOR_PANEL.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
                <a
                  href="javascript:void(0)"
                  className="ico Clinets arrow_btn"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.VENDOR} />
                  </figure>
                  <span>Vendors</span>
                </a>
                <div className="dropdown-app">
                  <ul>
                    <li className={ADMIN_PATH.VENDOR_REGISTRATION.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminVendorRegistration"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Vendor Registration
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.VENDOR.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminVendorList"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Vendor
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className={ADMIN_PATH.CLIENT_RFQ.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
                <Link
                  to="/adminClientRfqList"
                  className="ico Clinets"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.INVOICE_SQUARE} />
                  </figure>
                  <span>Client RFQs</span>
                </Link>
              </li>
              <li className={ADMIN_PATH.JOB_PANEL.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
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
                  <span>Jobs</span>
                </a>
                <div className="dropdown-app">
                  <ul>
                    <li className={ADMIN_PATH.INTERPRETATION.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminViewAllJobs"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Interpretation Jobs
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.REMOTE_HISTORY.indexOf(path) >= 0 ? "active" : ""}>
                      <a
                        href="javascript:void(0)"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Remote Interpretation History
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li className={ADMIN_PATH.PROJECTS.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
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
                    <li className={ADMIN_PATH.TRANSLATION.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminProjectList"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Translation
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.TRAINING.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminTrainingList"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Training
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/adminInternalProjectList"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Internal Projects
                      </Link>
                    </li>
                    {/* <li><a href="#" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Internal Projects</a></li> */}
                  </ul>
                </div>
              </li>
              <li className={ADMIN_PATH.DOCUMENTS.indexOf(path) >= 0 ? "active" : ""}>
                <Link
                  to="/adminDocuments"
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
              {/* <li className="dd-menu"><a href="javascript:void(0)" className="ico Clinets arrow_btn" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.INVOICE_DOLLER} /></figure><span>Accounts</span></a>
                                <div className="dropdown-app">
                                    <ul>
                                        <li><Link to="/adminInvoicesBillsUnderV" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Bills Under Verifications</Link></li>
                                        <li><Link to="/adminInvoicesAccountPayable" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Invoice Listing</Link></li>
                                    </ul>
                                </div>
                            </li> */}
              <li className={ADMIN_PATH.ACCOUNTS.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
                <a
                  href="javascript:void(0)"
                  className="ico Clinets arrow_btn"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.INVOICE_DOLLER} />
                  </figure>
                  <span>Accounts</span>
                </a>
                <div className="dropdown-app">
                  <ul>
                    <li className={ADMIN_PATH.BILL_VERIFICATION.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        // to="/adminInvoicesBillsUnderV"
                        to="/adminMainBillUnderVerification"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Bills Under Verification
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.RECEIVABLES.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        // to="/adminInvoicesAccountReceivable"
                        to="/adminMainReceivable"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Receivables
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.PAYABLES.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        // to="/adminInvoicesAccountPayable"
                        to="/adminMainPayables"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Payable
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className={ADMIN_PATH.STORE_PANEL.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
                <a
                  href="javascript:void(0)"
                  className="ico Clinets arrow_btn"
                  style={{
                    textDecoration: "none",
                    color: "rgb(255 255 255 / 50% )",
                  }}
                >
                  <figure className="menu-link-icon">
                    <img src={ImageName.IMAGE_NAME.MENU.STORE} />
                  </figure>
                  <span>Stores & Maintenance</span>
                </a>
                <div className="dropdown-app">
                  <ul>
                    <li className={ADMIN_PATH.STORE.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminStoreList"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Stores
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.MAINTAINANCE.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminMaintenanceList"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Maintenance Requests
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className={ADMIN_PATH.SETTINGS.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
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
                    <li className={ADMIN_PATH.NOTIFICATION.indexOf(path) >= 0 ? "dd-menu active" : "dd-menu"}>
                      <Link
                        to="/adminNotificationList"
                        className="ico Clinets"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        <figure className="menu-link-icon"></figure>
                        <span>Notifications</span>
                      </Link>
                      {/* <div className="dropdown-app">
                      <ul>
                        <li><a href="#" style={{ textDecoration: 'none' }}>Notifications Listing</a></li>
                        <li><a href="#" style={{ textDecoration: 'none' }}>Configurable Notification</a></li>
                      </ul>
                    </div> */}
                    </li>
                    <li className={ADMIN_PATH.CONFIGURATION.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminConfigurationPanel"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Configuration Panel
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.NOTIFICATION_PANEL.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminConfigurationPanelNotification"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Notification Panel
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.INDUSTRY_TYPE.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminIndustryTypeList"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Industry Type
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.SERVICE.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminServiceCategory"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Service Offered
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.TRAINING_COURSE.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminTrainingCourse"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Training Courses
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.ROLES.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminRoles"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Roles
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.ADMIN_STAFF.indexOf(path) >= 0 ? "active" : ""}>
                      <Link
                        to="/adminStaff"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Users
                      </Link>
                    </li>
                    <li className={ADMIN_PATH.MANAGE_STATIC_CONTENTS.indexOf(path) >= 0 ? "active" : ""}>
                      <a
                        href="#"
                        style={{
                          textDecoration: "none",
                          color: "rgb(255 255 255 / 50% )",
                        }}
                      >
                        Manage Static Content
                      </a>
                    </li>
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
