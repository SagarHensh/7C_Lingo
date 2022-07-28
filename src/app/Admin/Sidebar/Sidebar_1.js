import React from "react";
import ReactDOM from "react-dom";
import $ from 'jquery';
import './sidebar.css';

import history from "../../../history";
import { Link } from "react-router-dom";
import { ImageName } from "../../../enums";
import { Decoder } from "../../../services/auth";
import { UsersEnums } from "../../../services/constant";

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: 0,
    };
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

    window.$("._menubtn").click(function () {
      $('.side-navigaiton,.component-wrapper').toggleClass('hp');
    });


    window.$('.responsive-menu').click(function () {
      $('.side-navigaiton').toggleClass('hp');
    });

    window.$('.close-nav').click(function () {
      $('.side-navigaiton').removeClass('hp');
    });

    //........ For toggle down menu to sub menu's............

    window.$('.arrow_btn').click(function () {
      $(this).toggleClass('op');

      if ($(this).hasClass('op')) {
        $(this).toggleClass('op');
        $(this).parent().find('.dropdown-app').slideUp();
      } else {
        $(this).toggleClass('op');
        $(this).parent().find('.dropdown-app').slideDown();
      }
    });
  }

  toggledown = () => {
    // window.$('.dropdown-app .op').slideToggle();
    document.getElementsByClassName(".dropdown-app .op").slideToggle();
  }
  render() {
    return (
      <React.Fragment>
        {this.state.userType === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN ? <React.Fragment>
          <nav className="side-navigaiton">
            <button className="_menubtn"><img src={ImageName.IMAGE_NAME.MENU_ICON} /></button>
            <button className="close-nav">X</button>
            <div className="side_navigatoin">
              <ul>
                <li className="active">
                  <Link className="ico dashboard" to="/adminDashboard" style={{ textDecoration: 'none' }}>
                    <figure className="menu-link-icon">
                      <img src={ImageName.IMAGE_NAME.MENU.DASHBOARD_PUZZLE_ICON} />
                    </figure>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li className="dd-menu">
                  <a href="javascript:void(0)" className="ico Departments arrow_btn" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>
                    <figure className="menu-link-icon">
                      <img src={ImageName.IMAGE_NAME.MENU.DEPARTMENT_ICON} />
                    </figure>
                    <span>Departments</span>
                  </a>
                  <div className="dropdown-app">
                    <ul>
                      <li><Link to="/masterDepartment" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Master Departments</Link></li>
                      <li><Link to="/clientDepartment" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Client Departments</Link></li>
                    </ul>
                  </div>
                </li>
                <li className="dd-menu">
                  <a href="javascript:void(0)" className="ico Clinets arrow_btn" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>
                    <figure className="menu-link-icon">
                      <img src={ImageName.IMAGE_NAME.MENU.CONTACT_ICON} />
                    </figure>
                    <span>Clients & Contacts</span>
                  </a>
                  <div className="dropdown-app">
                    <ul>
                      <li><Link to="/adminClientList" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Client</Link></li>
                      <li><Link to="/adminClientContactList" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Contacts</Link></li>
                      <li><Link to="/adminContactsRequest" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Contact request</Link></li>
                    </ul>
                  </div>
                </li>
                <li className="dd-menu">
                  <a href="javascript:void(0)" className="ico Clinets arrow_btn" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.VENDOR} /></figure><span>Vendors</span></a>
                  <div className="dropdown-app">
                    <ul>
                      <li><Link to="/adminVendorRegistration" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Vendor Registration</Link></li>
                      <li><Link to="/adminVendorList" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Vendor</Link></li>
                    </ul>
                  </div>
                </li>
                <li className="dd-menu"><Link to="/adminClientRfqList" className="ico Clinets" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.INVOICE_SQUARE} /></figure><span>Client RFQs</span></Link></li>
                <li className="dd-menu"><a href="javascript:void(0)" className="ico Clinets arrow_btn" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.JOB_TYPE} /></figure><span>Jobs</span></a>
                  <div className="dropdown-app">
                    <ul>
                      <li><Link to="/adminViewAllJobs" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Interpretation Jobs</Link></li>
                      <li><a href="#" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Remote Interpretation History</a></li>
                    </ul>
                  </div>
                </li>
                <li className="dd-menu"><a href="javascript:void(0)" className="ico Clinets arrow_btn" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.PROJECT_ICON} /></figure><span>Projects</span></a>
                  <div className="dropdown-app">
                    <ul>
                      <li><Link to="/adminProjectList" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Translation</Link></li>
                      <li><Link to="/adminTrainingList" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Training</Link></li>
                      {/* <li><a href="#" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Internal Projects</a></li> */}
                    </ul>
                  </div>
                </li>
                <li><Link to="/adminDocuments" className="ico Documents" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.DOCUMENTS_TASK} /></figure><span>Documents</span></Link></li>
                <li className="dd-menu"><a href="javascript:void(0)" className="ico Clinets arrow_btn" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.INVOICE_DOLLER} /></figure><span>Bill Verifications</span></a>
                  <div className="dropdown-app">
                    <ul>
                      <li><Link to="/adminInvoicesBillsUnderV" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Bills Under Verifications</Link></li>
                      <li><Link to="/adminInvoicesAccountPayable" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Invoice Listing</Link></li>
                    </ul>
                  </div>
                </li>
                <li className="dd-menu"><a href="javascript:void(0)" className="ico Clinets arrow_btn" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.STORE} /></figure><span>Stores & Maintenance</span></a>
                  <div className="dropdown-app">
                    <ul>
                      <li><Link to="/adminStoreList" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Stores</Link></li>
                      <li><Link to="/adminMaintenanceList" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Maintenance Requests</Link></li>
                    </ul>
                  </div>
                </li>
                <li className="dd-menu"><a href="javascript:void(0)" className="ico Clinets arrow_btn" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.SETTINGS} /></figure><span>Settings</span></a>
                  <div className="dropdown-app">
                    <ul>
                      <li className="dd-menu">
                        <Link
                          to="/adminNotificationList"
                          className="ico Clinets"
                          style={{
                            textDecoration: "none",
                            color: "rgb(255 255 255 / 50% )"
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
                      <li>
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
                      <li>
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
                      <li><a href="#" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Industry Type</a></li>
                      <li><Link to="/adminServiceCategory" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Service Offered</Link></li>
                      <li><Link to="/adminTrainingCourse" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Training Courses</Link></li>
                      <li><Link to="/adminRoles" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Roles</Link></li>
                      <li><Link to="/adminStaff" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Users</Link></li>
                      <li><a href="#" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Manage Static Content</a></li>
                    </ul>
                  </div>
                </li>
              </ul>
              {/*<ul style={{ height: '1050px' }}></ul>*/}
            </div>
          </nav>
        </React.Fragment> : <React.Fragment>
          {this.state.userType === UsersEnums.APPLICATION_ROLE.CLIENT ?
            <nav className="side-navigaiton">
              <button className="_menubtn"><img src={ImageName.IMAGE_NAME.MENU_ICON} /></button>
              <button className="close-nav">X</button>
              <div className="side_navigatoin">
                <ul>
                  <li className="active">
                    <Link className="ico dashboard" to="/clientDashboard" style={{ textDecoration: 'none' }}>
                      <figure className="menu-link-icon">
                        <img src={ImageName.IMAGE_NAME.MENU.DASHBOARD_PUZZLE_ICON} />
                      </figure>
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li className="dd-menu">
                    <a href="javascript:void(0)" className="ico Clinets arrow_btn" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>
                      <figure className="menu-link-icon">
                        <img src={ImageName.IMAGE_NAME.MENU.CONTACT_ICON} />
                      </figure>
                      <span>Contacts</span>
                    </a>
                    <div className="dropdown-app">
                      <ul>
                        <li><Link to="/adminClientList" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>View Request</Link></li>
                        <li><Link to="/adminClientContactList" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>View Listing</Link></li>
                      </ul>
                    </div>
                  </li>
                  <li className="dd-menu">
                    <Link to="departmentClient" className="ico Departments" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>
                      <figure className="menu-link-icon">
                        <img src={ImageName.IMAGE_NAME.MENU.DEPARTMENT_ICON} />
                      </figure>
                      <span>Departments</span>
                    </Link>
                  </li><li className="dd-menu"><a href="javascript:void(0)" className="ico Clinets arrow_btn" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.JOB_TYPE} /></figure><span>Interpretation Jobs</span></a>
                    <div className="dropdown-app">
                      <ul>
                        <li><a href="javascript:void(0)" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Need Attention</a></li>
                        {/* <li><Link to="/adminViewAllJobs" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Need Attention</Link></li> */}
                        <li><a href="javascript:void(0)" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Unassigned</a></li>
                        <li><a href="javascript:void(0)" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Assigned</a></li>
                        <li><a href="javascript:void(0)" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>All Jobs</a></li>
                        <li><a href="javascript:void(0)" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>History</a></li>
                      </ul>
                    </div>
                  </li>
                  <li><a href="javascript:void(0)" className="ico Documents" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.DOCUMENTS_TASK} /></figure><span>Interpretation History</span></a></li>
                  <li className="dd-menu"><a href="javascript:void(0)" className="ico Clinets arrow_btn" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.PROJECT_ICON} /></figure><span>Projects</span></a>
                    <div className="dropdown-app">
                      <ul>
                        <li><a href="javascript:void(0)" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Translation</a></li>
                        <li><a href="javascript:void(0)" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Training</a></li>
                        {/* <li><a href="#" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}>Internal Projects</a></li> */}
                      </ul>
                    </div>
                  </li>
                  <li><a href="javascript:void(0)" className="ico Documents" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.DOCUMENTS_TASK} /></figure><span>Invoices</span></a></li>
                  <li><a href="javascript:void(0)" className="ico Documents" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.DOCUMENTS_TASK} /></figure><span>Chat</span></a></li>
                  <li><a href="javascript:void(0)" className="ico Documents" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.DOCUMENTS_TASK} /></figure><span>Resources</span></a></li>


                  <li className="dd-menu"><a href="javascript:void(0)" className="ico Clinets arrow_btn" style={{ textDecoration: 'none', color: "rgb(255 255 255 / 50% )" }}><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.SETTINGS} /></figure><span>Settings</span></a>
                    <div className="dropdown-app">
                      <ul>
                        <li className="dd-menu">
                          <a href="javascript:void(0)"
                            className="ico Clinets"
                            style={{
                              textDecoration: "none",
                              color: "rgb(255 255 255 / 50% )"
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
                          <a href="javascript:void(0)"
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
            </nav> : <React.Fragment></React.Fragment>
          }

        </React.Fragment>
        }
      </React.Fragment>
    );
  }
}
