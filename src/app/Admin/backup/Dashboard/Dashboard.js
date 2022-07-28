import React, { Component } from "react";
// import "";
import './dashboard.css';
import ReactDOM from "react-dom";
import TextField from "@mui/material/TextField";
import "bootstrap/dist/css/bootstrap.css";

import $ from 'jquery';
// import { jQuery } from 'jquery';

import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import "../../../Styles/style.css";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import history from "../../../history";
import { ImageName } from "../../../enums";


class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      intertoggleState: 0,
      currentValue: 0,
      check: false,
      value: 0,
      widgets: [],
    };
  }

  componentDidMount() {
    if (!localStorage.getItem("AuthToken")) {
      return history.push("/");
    }
  }

  // onDateClick = () =>{
  //   alert("hello");
  // }

  toggleTabInter = (index) => {
    this.setState({
      check: true,
      intertoggleState: index,
    });
  };

  handleChange = (event, newValue) => {
    this.setState({
      value: newValue,
    });
  };
  tabChange = (index, index2) => {
    let widgetData = this.state.widgets;

    for (let i = 0; i < widgetData.length; i++) {
      if (i === index) {
        widgetData[i].currentValue = index2;
      }
    }
    this.setState({
      widgets: widgetData,
    });
  };

  render() {
    return (
      <React.Fragment>
      {/* <div className="wrapper"> */}
        {/* <Header />
        <Sidebar /> */}
        <div className="component-wrapper">
          <div className="form-search-app">
            <div className="form-hlf-right">
              <div className="form-field-app">
                <span>from</span>
                <input
                  type="text"
                  id="from_datepicker"
                  className="datefield"
                  placeholder="10/25/2021"
                />
              </div>
              <div className="form-field-app">
                <span>to</span>
                <input
                  type="text"
                  id="to_datepicker"
                  className="datefield"
                  placeholder="10/25/2021"
                />
              </div>
              <div className="form-field-app _apl">
                <button type="submit" className="apl-btn">
                  apply
                </button>
              </div>
            </div>
          </div>
          <div className="page-head-section">
            <h1 className="text-uppercase">
              Admin Dashboard <span style={{marginTop:'2%'}}>Client</span>
            </h1>
          </div>
          <div className="_fl dashboard-list">
            <div className="row">
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr1">
                  <div className="dh-head _fl">
                    <h3>Interpretation</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.REQUIRE_WHITE} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home"
                      >
                        Unassigned
                      </a>{" "}
                    </li>
                    <li className="nav-item">
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu1">
                        Assigned job
                      </a>{" "}
                    </li>
                    <li className="nav-item">
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu2">
                        quote sent
                      </a>{" "}
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane  active" id="home">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane  fade" id="menu1">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane  fade" id="menu2">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr2">
                  <div className="dh-head _fl">
                    <h3>Projects</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.NOTE_ICON} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home_1"
                      >
                        Unassigned
                      </a>{" "}
                    </li>
                    <li className="nav-item">
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu1_1">
                        quote sent
                      </a>{" "}
                    </li>
                    <li className="nav-item">
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu2_1">
                        Assigned Pro
                      </a>{" "}
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane  active" id="home_1">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane  fade" id="menu1_1">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane  fade" id="menu2_1">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr3 tbl_two">
                  <div className="dh-head _fl">
                    <h3>Bills under verification</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.REQUIRE_WHITE} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home_4"
                      >
                        unverified
                      </a>{" "}
                    </li>
                    <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link"
                        data-toggle="tab"
                        href="#menu12_4"
                      >
                        verified
                      </a>{" "}
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane  active" id="home_4">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane  fade" id="menu12_4">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr2 tbl_two">
                  <div className="dh-head _fl">
                    <h3>Invoices</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.INVOICE_ICON} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home_5"
                      >
                        unpaid
                      </a>{" "}
                    </li>
                    <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link"
                        data-toggle="tab"
                        href="#menu12_5"
                      >
                        overhide
                      </a>{" "}
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane  active" id="home_5">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane  fade" id="menu12_5">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="_fl dashboard-list tp">
            <h2 className="_fl h2_text">Vendor</h2>
            <div className="row">
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr1">
                  <div className="dh-head _fl">
                    <h3>Interpretation</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.REQUIRE_WHITE} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home"
                      >
                        Unassigned
                      </a>{" "}
                    </li>
                    <li className="nav-item">
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu1">
                        Assigned job
                      </a>{" "}
                    </li>
                    <li className="nav-item">
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu2">
                        quote sent
                      </a>{" "}
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane  active" id="home">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                            <div className="_fl tp-jsd">
                              <span>Job sent to 10 Vendors</span>
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                            <div className="_fl tp-jsd">
                              <span>Job sent to 10 Vendors</span>
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                            <div className="_fl tp-jsd">
                              <span>Job sent to 10 Vendors</span>
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                            <div className="_fl tp-jsd">
                              <span>Job sent to 10 Vendors</span>
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                            <div className="_fl tp-jsd">
                              <span>Job sent to 10 Vendors</span>
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                            <div className="_fl tp-jsd">
                              <span>Job sent to 10 Vendors</span>
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                            <div className="_fl tp-jsd">
                              <span>Job sent to 10 Vendors</span>
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                            <div className="_fl tp-jsd">
                              <span>Job sent to 10 Vendors</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane  fade" id="menu1">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p className="green-text">
                                List of vendors offered 10
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane  fade" id="menu2">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr2">
                  <div className="dh-head _fl">
                    <h3>Projects</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.NOTE_ICON} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home_1"
                      >
                        Unassigned
                      </a>{" "}
                    </li>
                    <li className="nav-item">
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu1_1">
                        quote sent
                      </a>{" "}
                    </li>
                    <li className="nav-item">
                      {" "}
                      <a className="nav-link" data-toggle="tab" href="#menu2_1">
                        Assigned Pro
                      </a>{" "}
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane  active" id="home_1">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane  fade" id="menu1_1">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane  fade" id="menu2_1">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <a href="#" className="trsn">
                                Translation
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr3 tbl_two">
                  <div className="dh-head _fl">
                    <h3>Bills under verification</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.REQUIRE_WHITE} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home_4"
                      >
                        unverified
                      </a>{" "}
                    </li>
                    <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link"
                        data-toggle="tab"
                        href="#menu12_4"
                      >
                        verified
                      </a>{" "}
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane  active" id="home_4">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane  fade" id="menu12_4">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="_fl dashboard-list-bx pr2 tbl_two">
                  <div className="dh-head _fl">
                    <h3>Invoices</h3>
                    <figure>
                      <img src={ImageName.IMAGE_NAME.INVOICE_ICON} />
                    </figure>
                  </div>
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#home_5"
                      >
                        unpaid
                      </a>{" "}
                    </li>
                    <li className="nav-item">
                      {" "}
                      <a
                        className="nav-link"
                        data-toggle="tab"
                        href="#menu12_5"
                      >
                        overhide
                      </a>{" "}
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane  active" id="home_5">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane  fade" id="menu12_5">
                      <div className="_fl _dsbx">
                        <p className="_fl viewall text-right">
                          <a href="#">View all</a>
                        </p>
                        <div className="_fl _dsbxrow">
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Legal</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                          <div className="_fl _ddrow">
                            <div className="_ddhead">
                              <p>123456</p>
                              <p>December 23, 2021 | 7:30 AM</p>
                              <p>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                New york, 20ml
                              </p>
                            </div>
                            <div className="dd_rt">
                              {" "}
                              <span>Medical</span>{" "}
                              <a href="#" className="fds">
                                F2F
                              </a>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="page-head-section">
                <h2 className="_fl h2_text">Internal Tasks</h2>
              </div>
              <div className="_fl dashboard-list">
                <div className="row">
                  <div className="col-md-4">
                    <div className="_fl dashboard-list-bx pr2 tbl_two">
                      <div className="dh-head _fl">
                        <h3>Projects</h3>
                        <figure>
                          <img src={ImageName.IMAGE_NAME.NOTE_ICON} />
                        </figure>
                      </div>
                      <ul className="nav nav-tabs">
                        <li className="nav-item">
                          {" "}
                          <a
                            className="nav-link active"
                            data-toggle="tab"
                            href="#home_5"
                          >
                            upcoming
                          </a>{" "}
                        </li>
                        <li className="nav-item">
                          {" "}
                          <a
                            className="nav-link"
                            data-toggle="tab"
                            href="#menu12_5"
                          >
                            overdue
                          </a>{" "}
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div className="tab-pane  active" id="home_5">
                          <div className="_fl _dsbx">
                            <div className="_fl _dsbxrow">
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane  fade" id="menu12_5">
                          <div className="_fl _dsbx">
                            <p className="_fl viewall text-right">
                              <a href="#">View all</a>
                            </p>
                            <div className="_fl _dsbxrow">
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                              <div className="_fl _ddrow">
                                <div className="_ddhead">
                                  <p>123456</p>
                                  <p>December 23, 2021 | 7:30 AM</p>
                                  <p>
                                    <i
                                      className="fa fa-map-marker"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    New york, 20ml
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  const clientData = state.mainData;
  return {
    clientTitle: clientData.header,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

// export default Dashboard;
