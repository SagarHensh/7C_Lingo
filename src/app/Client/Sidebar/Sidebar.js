import React from "react";
import ReactDOM from "react-dom";
import $ from 'jquery';
import './sidebar.css';

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
      $('.side-navigaiton,.component-wrapper').toggleClass('hp');
    });


    window.$('.responsive-menu').click(function () {
      $('.side-navigaiton').toggleClass('hp');
    });

    window.$('.close-nav').click(function () {
      $('.side-navigaiton').removeClass('hp');
    });

    window.$('.arrow_btn').click(function () {
      $(this).toggleClass('op');
      $(this).parent().find('.dropdown-app').slideToggle();
    });
  }
  openDashboard = () => {
    history.push("/adminDashboard");
  };
  openVendorRequest = () => {
    history.push("/vendorrequest");
  };
  openClientRequest = () => {
    history.push("/clientrequest");
  };
  openClientProfile = () => {
    history.push("/clientprofile");
  };
  openUserTable = () => {
    history.push("/adminstaffUserTable");
  };
  openMasterDeptTable = () => {
    history.push("/departmentlist");
  };
  openClientDeptTable = () => {
    history.push("/clientdepartment");
  };
  render() {
    return (
      <nav className="side-navigaiton">
        <button className="_menubtn"><img src={ImageName.IMAGE_NAME.MENU_ICON} /></button>
        <button className="close-nav">X</button>
        <div className="side_navigatoin">
          <ul>
            <li className="active"><Link className="ico dashboard" to="/adminDashboard"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.DASHBOARD_PUZZLE_ICON} /></figure><span>Dashoard</span></Link></li>
            <li><a href="#" className="ico Roles"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.ROLES}  /></figure><span>Roles</span></a></li>
            <li><a href="#" className="ico Users"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.USERS} /></figure><span>Users</span></a></li>
            <li className="dd-menu"><a href="#" className="ico Requests"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.REQUEST_NOTE} /></figure><span>Requests</span></a><button className="arrow_btn"></button>
              <div className="dropdown-app">
                <ul>
                  <li><a href="#">Contact Registration</a></li>
                  <li><a href="#">Vendor Registration</a></li>
                </ul>
              </div>
            </li>
            <li><a href="#" className="ico Job"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.JOB_TYPE} /></figure><span>Job Type</span></a></li>
            <li><a href="#" className="ico Servcie"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.SERVICE_OFFERED} /></figure><span>Servcie Offered</span></a></li>

            <li className="dd-menu"><a href="#" className="ico Departments"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.DEPARTMENT_ICON} /></figure><span>Departments</span></a><button className="arrow_btn"></button>
              <div className="dropdown-app">
                <ul>
                  <li><Link to="/masterDepartment">Master Departments</Link></li>
                  <li><Link to="/clientDepartment">Client Departments</Link></li>
                </ul>
              </div>
            </li>
            <li className="dd-menu"><a href="#" className="ico Clinets"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.CLIENT_ICON} /></figure><span>Clients & Contacts</span></a> <button className="arrow_btn"></button>
              <div className="dropdown-app">
                <ul>
                  <li><a href="#">Contact Registration</a></li>
                  <li><a href="#">Vendor Registration</a></li>
                </ul>
              </div>
            </li>
            <li><a href="#" className="ico Vendors"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.VENDOR} /></figure><span>Vendors</span></a></li>
            <li><a href="#" className="ico Clinets-faq"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.INVOICE_SQUARE} /></figure><span>Client RFQs</span></a></li>
            <li><a href="#" className="ico interpretation"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.INTERPRETATION} /></figure><span>interpretation Jobs</span></a></li>
            <li><a href="#" className="ico Projects"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.PROJECT_ICON} /></figure><span>Projects</span></a></li>
            <li><a href="#" className="ico Vendor"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.VENDOR_BID} /></figure><span>Vendor bids</span></a></li>
            <li><a href="#" className="ico Remote"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.INTERPRETATION_HISTORY} /></figure><span>Remote interpretation Histry</span></a></li>
            <li><a href="#" className="ico Invoices"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.INVOICE_DOLLER} /></figure><span>Invoices</span></a></li>
            <li><a href="#" className="ico Documents"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.DOCUMENTS_TASK} /></figure><span>Documents</span></a></li>
            <li><a href="#" className="ico Store"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.STORE} /></figure><span>Store & Maintenance</span></a></li>
            <li><a href="#" className="ico Email"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.EMAIL_ARROW} /></figure><span>Email & SMS</span></a></li>
            <li><a href="#" className="ico Notifications"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.NOTIFICATION_SIDE} /></figure><span>Notifications</span></a></li>
            <li><a href="#" className="ico Chats"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.CHAT_ICON_BLUE} /></figure><span>Chats</span></a></li>
            <li><Link to="/adminEditProfile" className="ico Settings"><figure className="menu-link-icon"><img src={ImageName.IMAGE_NAME.MENU.SETTINGS} /></figure><span>Settings</span></Link></li>
          </ul>
        </div>
      </nav>
    );
  }
}
