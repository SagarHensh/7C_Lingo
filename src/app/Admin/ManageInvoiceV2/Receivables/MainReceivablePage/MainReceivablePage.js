import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
// import "./InterpretationInvoicePage.css";
import $ from "jquery";
import { Link } from "react-router-dom";
import ReceivableInterpretationPage from "../InterpretationPage/ReceivableInterpretationPage";
import ReceivableTrainingPage from "../TrainingPage/ReceivableTrainingPage";
import ReceivableTranslationPage from "../TranslationPage/ReceivableTranslationPage";


export default class MainReceivablePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      serviceTypeId: "45"
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    window.$(".headerTab ul li").on("click", function () {
      $(".headerTab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnkHead");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnkHead");

        $(".verificaiton-doc-tab ul li").removeClass("active");
        $(this).addClass("active");
        $("div").removeClass("activeLnk");
        $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
    });
  }

  onTabClick_head = (value) => {
    if (value === "45") {
      this.setState({
        serviceTypeId: "45"
      })
    } else if (value === "46") {
      this.setState({
        serviceTypeId: "46"
      })
    } else if (value === "47") {
      this.setState({
        serviceTypeId: "47"
      })
    }

  }

  render() {

    return (
      <React.Fragment>
        <ToastContainer hideProgressBar theme="colored" />
        <div className="component-wrapper vewaljobs invoc_pge">
          <div
            className="vn_frm "
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            <Link to="/adminDashboard">Dashboard</Link> / Receivable / {this.state.serviceTypeId == "45" ? "Interpretation" : this.state.serviceTypeId == "46" ? "Translation" : "Training"}
          </div>
          <div className="_fl headerTab">
            <ul>
              <li
                className="active"
                data-related="interpretationTab"
                onClick={() => {
                  this.onTabClick_head("45");
                }}
              >
                InterPretation
              </li>
              <li
                data-related="translationTab"
                onClick={() => {
                  this.onTabClick_head("46");
                }}
              >
                Translation
              </li>
              <li
                data-related="trainingTab"
                onClick={() => {
                  this.onTabClick_head("47");
                }}
              >
                training
              </li>
            </ul>
          </div>
          <div className="listing-component-app tab-app-information activeLnkHead" id="interpretationTab">
            {this.state.serviceTypeId === "45" ?
              <ReceivableInterpretationPage /> : <React.Fragment></React.Fragment>}
          </div>
          <div className="listing-component-app tab-app-information" id="translationTab">
            {this.state.serviceTypeId === "46" ?
              <ReceivableTranslationPage /> : <React.Fragment></React.Fragment>
              }
          </div>
          <div className="listing-component-app tab-app-information" id="trainingTab">
            {this.state.serviceTypeId === "47" ?
              <ReceivableTrainingPage /> : <React.Fragment></React.Fragment>}
          </div>

        </div>
      </React.Fragment>
    );
  }
}
