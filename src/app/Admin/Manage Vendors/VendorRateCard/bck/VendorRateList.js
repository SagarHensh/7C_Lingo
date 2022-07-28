import React, { Component } from 'react';
import ModalUnstyled from "@mui/core/ModalUnstyled"; //imported forr modal
import { styled } from "@mui/system"; //imported for modal
import Switch from "@mui/material/Switch";
import "./VendorRateList.css";
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import { ImageName } from '../../../../enums';
import $ from 'jquery';

export class VendorRateList extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isInterpretation: true,
            isTranslation: false,
            isTraining: false,
            interpretationData: [
                {
                    id: 1,
                    regularRate: 121,
                    nightPerWeekend: 150,
                    miniDuration: "30 mins",
                    appointmentType: "faceToface",
                    language1: "English",
                    language2: "French",
                    jobType: "Interpretation",
                    cancellationBefore: "10th Oct,2021|10:30 AM",
                    milleageThresold: 2
                },
                {
                    id: 1,
                    regularRate: 232,
                    nightPerWeekend: 250,
                    miniDuration: "45 mins",
                    appointmentType: "faceToface",
                    language1: "Bengali",
                    language2: "English",
                    jobType: "Interpretation",
                    cancellationBefore: "10th Dec,2021|12:30 PM",
                    milleageThresold: 4
                }
            ],
            translationData: [
                {
                    id: 2,
                    service: "Editing",
                    sourceLanguage: "English",
                    targetLanguage: "Spanish",
                    regularRate: 138,
                    customCharges: 15,
                    cancellationBefore: "10th Oct,2021|10:30 AM"
                },
                {
                    id: 3,
                    service: "DTP",
                    sourceLanguage: "French",
                    targetLanguage: "English",
                    regularRate: 167,
                    customCharges: 10,
                    cancellationBefore: "25th Dec,2021|09:00 PM"
                }
            ],
            trainingData: [
                {
                    id: 5,
                    trainingCatagory: "Translation",
                    trainingMode: "Online|Onsite",
                    regularRate: 543,
                    billingIncrement: 30,
                    cancellationBefore: "15th Nov,2021|10:00 PM"
                },
                {
                    id: 2,
                    trainingCatagory: "Interpretation",
                    trainingMode: "Online|Onsite",
                    regularRate: 327,
                    billingIncrement: 50,
                    cancellationBefore: "10th Dec,2021|12:00 PM"
                }
            ],

            interpretationModal: false,
            trainingModal: false,
            translationModal: false,
            searchValue: "",
            regularRate: "",
            regularRateUnit: "",
            appointmentType: "",
            nightPerWeekend: "",
            nightPerWeekendUnit: "",
            miniDuration: "",
            miniDurationUnit: "",
            billing: "",
            billingUnit: "",
            cancellationBefore: "",
            cancellationBeforeUnit: "",
            mileage: "",
            mileageUnit: ""
        };

    }

    componentDidMount() {

        window.scrollTo(0, 0);
        var ddData = [{
            text: "10",
            value: 10
        }, {
            text: "20",
            value: 20
        }, {
            text: "30",
            value: 30
        }, {
            text: "40",
            value: 40
        }, {
            text: "50",
            value: 50
        }];

        var classInstance = this;
        window.$('.myDropdown').ddslick({
            data: ddData,
            onSelected: function (data) {
                classInstance.setState({
                    limit: data.selectedData.value,
                    offset: "0"
                });
                //   classInstance.load();
            }
        });

        window.$(".verificaiton-doc-tab ul li").on("click", function () {
            $(".verificaiton-doc-tab ul li").removeClass('active');
            $(this).addClass('active');
            $("div").removeClass("activeLnk");
            $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
        });
    }



    // Functions for Interpretation add rate card fields...
    handleMileageUnit = (e) => {
        this.setState({
            mileageUnit: e.target.value
        });
    }

    handleMileage = (e) => {
        this.setState({
            mileage: e.target.value
        });
    }

    handleCancellationBeforeUnit = (e) => {
        this.setState({
            cancellationBeforeUnit: e.target.value
        });
    }

    handleCancellationBefore = (e) => {
        this.setState({
            cancellationBefore: e.target.value
        });
    }

    handleBilling = (e) => {
        this.setState({
            billing: e.target.value
        });
    }

    handleBillingUnit = (e) => {
        this.setState({
            billingUnit: e.target.value
        });
    }

    handleMinimumDurationUnit = (e) => {
        this.setState({
            miniDurationUnit: e.target.value
        });
    }

    handleMiniDuration = (e) => {
        this.setState({
            miniDuration: e.target.value
        });
    }

    handleNightPerWeekendUnit = (e) => {
        this.setState({
            nightPerWeekendUnit: e.target.value
        });
    }

    handleNightPerWeekend = (e) => {
        this.setState({
            nightPerWeekend: e.target.value
        });
    }

    handleAppointType = (e) => {
        this.setState({
            appointmentType: e.target.value
        });
    }

    handleRegularRateUnit = (e) => {
        this.setState({
            regularRateUnit: e.target.value
        });
    }

    handleRegularRate = (e) => {
        this.setState({
            regularRate: e.target.value
        });
    }


    // Save training modal data and add new data
    saveTrainingData = () => {
        console.log("bell");
        window.$("#trainingModal").modal("show");
    }

    // Save translation modal data and add new data
    saveTranslationData = () => {
        console.log("bat");
        window.$("#translationModal").modal("show");
    }

    // Save interpretation modal data and add new data
    saveInterpretationData = () => {
        console.log("ball");
        let interpretationStore = {
            "appointmentType": this.state.appointmentType,
            "regularRate": this.state.regularRate,
            "regularRateUnit": this.state.regularRateUnit,
            "nightPerWeekend": this.state.nightPerWeekend,
            "nightPerWeekendUnit": this.state.nightPerWeekendUnit,
            "minimumDuration": this.state.miniDuration,
            "minimumDurationUnit": this.state.miniDurationUnit,
            "billing": this.state.billing,
            "bilingUnit": this.state.billingUnit,
            "cancellationBefore": this.state.cancellationBefore,
            "cancellationBeforeUnit": this.state.cancellationBeforeUnit,
            "mileageThreshold": this.state.mileage,
            "mileageThresholdUnit": this.state.mileageUnit
        }
        console.log(interpretationStore);
        window.$("#interpretationModal").modal("show");
    }


    // Closing every modal for this page
    closeModal = () => {
        // console.log("close modal");
        window.$("#interpretationModal").modal("hide");
        window.$("#translationModal").modal("hide");
        window.$("#trainingModal").modal("hide");
        window.$("#interpretationModalEdit").modal("hide");
        window.$("#translationModalEdit").modal("hide");
        window.$("#trainingModalEdit").modal("hide");
    }

    deleteInterpretation = (id) => {
        console.log("delete interpretation", id);
    }

    deleteTranslation = (id) => {
        console.log("delete translation", id);
    }

    deleteTraining = (id) => {
        console.log("delete training", id);
    }

    handlEditInterpretation = (id) => {
        console.log("Edit Interpretation", id);
        window.$("#interpretationModalEdit").modal("show");
    }

    handlEditTranslation = (id) => {
        console.log("Edit Translation", id);
        window.$("#translationModalEdit").modal("show");
    }

    handlEditTraining = (id) => {
        console.log("Edit Training", id);
        window.$("#trainingModalEdit").modal("show");
    }

    handleNotesModalOpen = () => {
        // console.log("int", this.state.interpretationModal);
        // console.log("trans", this.state.translationModal);
        // console.log("train", this.state.trainingModal);
        if (this.state.interpretationModal) {
            window.$("#interpretationModal").modal("show");
        } else if (this.state.translationModal) {
            window.$("#translationModal").modal("show");
        } else if (this.state.trainingModal) {
            window.$("#trainingModal").modal("show");
        }
    }


    onTabClick = (value) => {
        if (value === "interpretation") {
            this.setState({
                interpretationModal: true,
                translationModal: false,
                trainingModal: false,
                isInterpretation: true,
                isTranslation: false,
                isTraining: false
            })
        } else if (value === "translation") {
            this.setState({
                interpretationModal: false,
                translationModal: true,
                trainingModal: false,
                isInterpretation: false,
                isTranslation: true,
                isTraining: false
            })
        } else if (value === "training") {
            this.setState({
                interpretationModal: false,
                translationModal: false,
                trainingModal: true,
                isInterpretation: false,
                isTranslation: false,
                isTraining: true
            })
        }
    }




    render() {

        return (
            <React.Fragment>
                <div className="wrapper">
                    <Header />
                    <Sidebar />
                    <div className="component-wrapper">
                        <div className="listing-component-app">
                            <div>
                                <div className="vendor-info _fl sdw">
                                    <div className="vn-form _fl">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="vn_frm" style={{ color: "grey" }}> Vendor
                                                </div>
                                            </div>
                                            <div className="col-md-8 ">
                                                <div className="vn_frm rt">
                                                    <input type="text" value={this.state.searchValue} name="" placeholder="Search" className="inputfield" onChange={e => this.setState({ searchValue: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 rateList">
                                                <div className="_fl verificaiton-doc-tab">
                                                    <ul>
                                                        <li className="active" onClick={() => { this.onTabClick("interpretation") }}>INTERPRETATION</li>
                                                        <li onClick={() => { this.onTabClick("translation") }}>TRANSLATION</li>
                                                        <li onClick={() => { this.onTabClick("training") }}>TRAINING</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col-md-2" />
                                            <div className="col-md-4">
                                                <div className="c-nt-btn_rate"><button onClick={this.handleNotesModalOpen}>ADD RATE CARD</button></div>
                                                {/* <div className="md-btn text-center"><a href="#" data-toggle="modal" data-target="#translationModal" className="approved" active>ADD RATE CARD</a></div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-filter-app">
                                    <div className="table-filter-box">
                                        <div className="tble-short">
                                            <span className="lbl">Display</span>
                                            <div class="dropdwn">
                                                <select class="myDropdown frm4-select" >
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div hidden={!this.state.isInterpretation}>
                                <div className="table-listing-app" >
                                    <div className="table-responsive">
                                        {/* <div className="table-responsive_cus table-style-a"> */}
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                            <tbody>
                                                <tr>
                                                    <th style={{ width: "9%" }}>Regular Rate [$/Unit]</th>
                                                    <th style={{ width: "9%" }}>Nights/ Weekends [$/Unit]</th>
                                                    <th style={{ width: "9%" }}>Minimum Duration</th>
                                                    <th style={{ width: "10%" }}>Appointment Type</th>
                                                    <th style={{ width: "11%" }}>Language 1[s]</th>
                                                    <th style={{ width: "11%" }}>Language 2[s]</th>
                                                    <th style={{ width: "10%" }}>Job Type</th>
                                                    <th style={{ width: "15%" }}>Cancellation Before</th>
                                                    <th style={{ width: "9%" }}>Mileage Threshold</th>
                                                    <th style={{ width: "10%" }}>Action</th>
                                                </tr>
                                                {this.state.interpretationData.map((item, key) => (
                                                    <tr>
                                                        <td colSpan="11">
                                                            <div className="tble-row">
                                                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ width: "6%", paddingLeft: "2%" }}>{item.regularRate}</td>
                                                                            <td style={{ width: "7%", paddingLeft: "3%" }}>{item.nightPerWeekend}</td>
                                                                            <td style={{ width: "7%", paddingLeft: "2%" }}>{item.miniDuration}</td>
                                                                            <td style={{ width: "6%", paddingLeft: "2%" }}>
                                                                                <div className="f2f_rate">F2F</div>
                                                                            </td>
                                                                            <td style={{ width: "9%", paddingLeft: "4%" }}>{item.language1}</td>
                                                                            <td style={{ width: "9%", paddingLeft: "4%" }}>{item.language2}</td>
                                                                            <td style={{ width: "9%", paddingLeft: "1%" }}>{item.jobType}</td>
                                                                            <td style={{ width: "11%", paddingLeft: "1%" }}>{item.cancellationBefore}</td>
                                                                            <td style={{ width: "4%", paddingLeft: "2%" }}>{item.milleageThresold}</td>
                                                                            <td style={{ width: "8%", paddingLeft: "2%" }}>
                                                                                <div className="tbl-editing-links">
                                                                                    <button className="tr-toggle" onClick={() => this.handlEditInterpretation(item)}><img src={ImageName.IMAGE_NAME.EDIT_SQUARE} /></button>
                                                                                    <button className="tr-toggle" onClick={() => this.deleteInterpretation(item)}><img src={ImageName.IMAGE_NAME.TRASH_BTN} /></button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div hidden={!this.state.isTranslation}>
                                <div className="table-listing-app" >
                                    <div className="table-responsive">
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                            <tbody>
                                                <tr>
                                                    <th style={{ width: "8%" }}>Service[s]</th>
                                                    <th style={{ width: "9%" }}>Source Language</th>
                                                    <th style={{ width: "10%" }}>Target Language [s]</th>
                                                    <th style={{ width: "9%" }}>Regular Rate [$/Unit]</th>
                                                    <th style={{ width: "11%" }}>Custom Charges [If applicable]</th>
                                                    <th style={{ width: "15%" }}>Cancellation Before</th>
                                                    <th style={{ width: "10%" }}>Action</th>
                                                </tr>
                                                {this.state.translationData.map((item, key) => (
                                                    <tr>
                                                        <td colSpan="11">
                                                            <div className="tble-row">
                                                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ width: "6%", paddingLeft: "2%" }}>{item.service}</td>
                                                                            <td style={{ width: "7%", paddingLeft: "3%" }}>{item.sourceLanguage}</td>
                                                                            <td style={{ width: "7%", paddingLeft: "2%" }}>{item.targetLanguage}</td>
                                                                            <td style={{ width: "8%", paddingLeft: "4%" }}>{item.regularRate}</td>
                                                                            <td style={{ width: "8%", paddingLeft: "4%" }}>{item.customCharges}</td>
                                                                            <td style={{ width: "11%", paddingLeft: "1%" }}>{item.cancellationBefore}</td>                                                                            <td style={{ width: "8%", paddingLeft: "2%" }}>
                                                                                <div className="tbl-editing-links">
                                                                                    <button className="tr-toggle" onClick={() => this.handlEditTranslation(item)}><img src={ImageName.IMAGE_NAME.EDIT_SQUARE} /></button>
                                                                                    <button className="tr-toggle" onClick={() => this.deleteTranslation(item)}><img src={ImageName.IMAGE_NAME.TRASH_BTN} /></button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div hidden={!this.state.isTraining}>
                                <div className="table-listing-app" >
                                    <div className="table-responsive">
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                            <tbody>
                                                <tr>
                                                    <th style={{ width: "9%" }}>Training Category</th>
                                                    <th style={{ width: "9%" }}>Training Mode</th>
                                                    <th style={{ width: "9%" }}>Regular Rate [$/Unit]</th>
                                                    <th style={{ width: "10%" }}>Billing Increment</th>
                                                    <th style={{ width: "15%" }}>Cancellation Before</th>
                                                    <th style={{ width: "10%" }}>Action</th>
                                                </tr>
                                                {this.state.trainingData.map((item, key) => (
                                                    <tr>
                                                        <td colSpan="11">
                                                            <div className="tble-row">
                                                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ width: "6%", paddingLeft: "2%" }}>{item.trainingCatagory}</td>
                                                                            <td style={{ width: "7%", paddingLeft: "3%" }}>{item.trainingMode}</td>
                                                                            <td style={{ width: "7%", paddingLeft: "2%" }}>{item.regularRate}</td>
                                                                            <td style={{ width: "8%", paddingLeft: "4%" }}>{item.billingIncrement}</td>
                                                                            <td style={{ width: "11%", paddingLeft: "1%" }}>{item.cancellationBefore}</td>                                                                            <td style={{ width: "8%", paddingLeft: "2%" }}>
                                                                                <div className="tbl-editing-links">
                                                                                    <button className="tr-toggle" onClick={() => this.handlEditTraining(item)}><img src={ImageName.IMAGE_NAME.EDIT_SQUARE} /></button>
                                                                                    <button className="tr-toggle" onClick={() => this.deleteTraining(item)}><img src={ImageName.IMAGE_NAME.TRASH_BTN} /></button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="interpretationModal" className="modal fade modelwindow" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="filter-head _fl document-hd">
                                <h3 className="text-center center-text">Add Rate Card</h3>
                                <button type="button" className="close" onClick={() => this.closeModal()}>X</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-wrap">
                                    <div className="sdw _fl _mg4">
                                        <h4 className="h4-grey-text">Vendor: Stev paul</h4>
                                        <div className="form-step-row m30 _fl">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-stp">
                                                        <span>Source Language</span>
                                                        <div className="selectbox">
                                                            <select className="m-selectbox">
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4"></div>
                                                <div className="col-md-4">
                                                    <div className="form-stp rt">
                                                        <span>Target Language</span>
                                                        <div className="selectbox">
                                                            <select className="m-selectbox">
                                                                <option>Select</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-listing-app card">
                                    <div className="table-responsive">
                                        <table width="100%" border="0" cellpadding="0" cellSpacing="0">
                                            <tr>
                                                <th style={{ width: "7%" }}>Appointment Type</th>
                                                <th style={{ width: "8%" }}>Job Type</th>
                                                <th style={{ width: "11%" }}>Regular Rate ($/Unit)</th>
                                                <th style={{ width: "13%" }}>Night/weekends</th>
                                                <th style={{ width: "17%" }}>Minimum Duration</th>
                                                <th style={{ width: "17%" }}>Billing</th>
                                                <th style={{ width: "17%" }}>Cancellation Before</th>
                                                <th style={{ width: "11%" }}>Mileage Threshold</th>
                                            </tr>
                                            <tr>
                                                <td>F2F</td>
                                                <td><select className="m-selectbox mini" onChange={(e) => this.handleAppointType(e)} >
                                                    <option>Select</option>
                                                    <option value="interpretation">Interpretation</option>
                                                    <option value="translation">Translation</option>
                                                </select>
                                                </td>
                                                <td><input type="text" value={this.state.regularRate} name="" placeholder="$" className="in-field3" onChange={(e) => this.handleRegularRate(e)} />
                                                    <select className="m-selectbox mini" onChange={(e) => this.handleRegularRateUnit(e)}>
                                                        <option>Select</option>
                                                        <option value="day">/ Day</option>
                                                        <option value="hour">/ Hour</option>
                                                    </select>
                                                </td>
                                                <td><input type="text" value={this.state.nightPerWeekend} name="" placeholder="$" className="in-field3" onChange={(e) => this.handleNightPerWeekend(e)} />
                                                    <select className="m-selectbox mini" onChange={(e) => this.handleNightPerWeekendUnit(e)} >
                                                        <option>Select</option>
                                                        <option value="day">/Day</option>
                                                        <option value="hour">/ Hour</option>
                                                    </select>
                                                </td>
                                                <td><input type="text" value={this.state.miniDuration} name="" placeholder="Hour" className="in-field3" onChange={(e) => this.handleMiniDuration(e)} />
                                                    <select className="m-selectbox mini" onChange={(e) => this.handleMinimumDurationUnit(e)} >
                                                        <option>Select</option>
                                                        <option value="day">/Day</option>
                                                        <option value="hour">/ Hour</option>
                                                    </select></td>
                                                <td><input type="text" value={this.state.billing} name="" placeholder="Enter" className="in-field3" onChange={(e) => this.handleBilling(e)} />
                                                    <select className="m-selectbox mini" onChange={(e) => this.handleBillingUnit(e)} >
                                                        <option>Select</option>
                                                        <option value="day">/Day</option>
                                                        <option value="hour">/ Hour</option>
                                                    </select></td>
                                                <td><input type="text" value={this.state.cancellationBefore} name="" placeholder="Enter" className="in-field3" onChange={(e) => this.handleCancellationBefore(e)} />
                                                    <select className="m-selectbox mini" onChange={(e) => this.handleCancellationBeforeUnit(e)}>
                                                        <option>Select</option>
                                                        <option value="day">/Day</option>
                                                        <option value="hour">/ Hour</option>
                                                    </select></td>
                                                <td><input type="text" value={this.state.mileage} name="" placeholder="¢" className="in-field3" onChange={(e) => this.handleMileage(e)} />
                                                    <select className="m-selectbox mini" onChange={(e) => this.handleMileageUnit(e)} >
                                                        <option>Select</option>
                                                        <option value="day">/Day</option>
                                                        <option value="hour">/ Hour</option>
                                                    </select></td>
                                            </tr>
                                            <tr>
                                                <td>OPI</td>
                                                <td><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" />
                                                    <select className="m-selectbox mini" >
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                    </select>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" />
                                                    <select className="m-selectbox mini" >
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                    </select>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="¢" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>VRI</td>
                                                <td><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" />
                                                    <select className="m-selectbox mini" >
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                    </select>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" />
                                                    <select className="m-selectbox mini" >
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                    </select>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="¢" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                {/* <div className="b-i-s _fl text-right _button-style m30">
                                    <a href="#" className="blue-btn">Add language Pair</a>
                                </div> */}
                                <div className="_button-style _fl text-center">
                                    <a className="grey-btn" onClick={() => this.closeModal()}>cancel</a>
                                    {/* <a href="#" className="blue-btn" >save</a> */}
                                    <a className="blue-btn" onClick={() => this.saveInterpretationData()}>SAVE & ADD</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="translationModal" className="modal fade modelwindow" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="filter-head _fl document-hd">
                                <h3 className="text-center center-text">Add Rate Card</h3>
                                <button type="button" className="close" onClick={() => this.closeModal()}>X</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-wrap">
                                    <div className="sdw _fl _mg4">
                                        <h4 className="h4-grey-text">Vendor: Stev paul</h4>

                                        <div className="form-step-row m30 _fl">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-stp">
                                                        <span>Source Language</span>
                                                        <div className="selectbox">
                                                            <select className="m-selectbox">
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4"></div>
                                                <div className="col-md-4">
                                                    <div className="form-stp rt">
                                                        <span>Target Language</span>
                                                        <div className="selectbox">
                                                            <select className="m-selectbox">
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-listing-app card">
                                    <div className="table-responsive">
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <th style={{ width: "10%" }}>Task</th>
                                                <th style={{ width: "25%" }}>Regular Rate ($/Unit)</th>
                                                <th style={{ width: "25%" }}>Minimum</th>
                                                <th style={{ width: "20%" }}>Night/weekends</th>
                                                <th style={{ width: "20%" }}>Cancellation Before</th>
                                            </tr>
                                            <tr>
                                                <td>Translation</td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>Translation</td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>Editing/Proofreading</td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>TEP</td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>DTP</td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>Transcription</td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>Subtitling</td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>Voice Over</td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                {/* <div className="b-i-s _fl text-right _button-style m30">
                                    <a href="#" className="blue-btn">Add language Pair</a>
                                </div> */}
                                <div className="_button-style _fl text-center">
                                    <a className="grey-btn" onClick={() => this.closeModal()}>cancel</a>
                                    <a className="blue-btn" onClick={() => this.saveTranslationData()}>save & add</a>
                                    {/* <a href="#" className="buledark-btn">save & reverse</a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="trainingModal" className="modal fade modelwindow" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="filter-head _fl document-hd">
                                <h3 className="text-center center-text">Add Rate Card</h3>
                                <button type="button" className="close" onClick={() => this.closeModal()}>X</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-wrap">
                                    <div className="sdw _fl _mg4">
                                        <h4 className="h4-grey-text">Vendor: Stev paul</h4>
                                    </div>
                                </div>
                                <div className="table-listing-app card">
                                    <div className="table-responsive">
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <th style={{ width: "12%" }}>Training Type</th>
                                                <th style={{ width: "18%" }}>Per Hour($)</th>
                                                <th style={{ width: "18%" }}>Per Half Day($)</th>
                                                <th style={{ width: "18%" }}>Per Day($)</th>
                                                <th style={{ width: "18%" }}>Billing</th>
                                                <th style={{ width: "18%" }}>Cancellation</th>
                                                <th style={{ width: "8%" }}>Charge</th>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="sdw _fl" style={{ paddingTop: "2%" }}>
                                                        <p className="h4-grey-text2">Cultural Intelligence</p>
                                                    </div>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" />
                                                    <select className="m-selectbox mini" >
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                    </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field4" /></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="sdw _fl" style={{ paddingTop: "2%" }}>
                                                        <p className="h4-grey-text2">Cultural Intelligence</p>
                                                    </div>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" />
                                                    <select className="m-selectbox mini" >
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                    </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field4" /></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="sdw _fl" style={{ paddingTop: "2%" }}>
                                                        <p className="h4-grey-text2">Cultural Intelligence</p>
                                                    </div>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" />
                                                    <select className="m-selectbox mini" >
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                    </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field4" /></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                {/* <div className="b-i-s _fl text-right _button-style m30">
                                    <a href="#" className="blue-btn">Add language Pair</a>
                                </div> */}
                                <div className="_button-style _fl text-center">
                                    <a className="grey-btn" onClick={() => this.closeModal()}>cancel</a>
                                    <a className="blue-btn" onClick={() => this.saveTrainingData()}>save & add</a>
                                    {/* <a href="#" className="buledark-btn">save & reverse</a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="interpretationModalEdit" className="modal fade modelwindow" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="filter-head _fl document-hd">
                                <h3 className="text-center center-text">Add Rate Card</h3>
                                <button type="button" className="close" onClick={() => this.closeModal()}>X</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-wrap">
                                    <div className="sdw _fl _mg4">
                                        <h4 className="h4-grey-text">Vendor: Stev paul</h4>
                                        <div className="form-step-row m30 _fl">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-stp">
                                                        <span>Source Language</span>
                                                        <div className="selectbox">
                                                            <select className="m-selectbox">
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4"></div>
                                                <div className="col-md-4">
                                                    <div className="form-stp rt">
                                                        <span>Target Language</span>
                                                        <div className="selectbox">
                                                            <select className="m-selectbox">
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-listing-app card">
                                    <div className="table-responsive">
                                        <table width="100%" border="0" cellpadding="0" cellSpacing="0">
                                            <tr>
                                                <th style={{ width: "7%" }}>Appointment Type</th>
                                                <th style={{ width: "8%" }}>Job Type</th>
                                                <th style={{ width: "11%" }}>Regular Rate (Enter/Unit)</th>
                                                <th style={{ width: "13%" }}>Night/weekends</th>
                                                <th style={{ width: "17%" }}>Minimum Duration</th>
                                                <th style={{ width: "17%" }}>Billing</th>
                                                <th style={{ width: "17%" }}>Cancellation Before</th>
                                                <th style={{ width: "11%" }}>Mileage Threshold</th>
                                            </tr>
                                            <tr>
                                                <td>F2F</td>
                                                <td><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" />
                                                    <select className="m-selectbox mini" >
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                    </select>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" />
                                                    <select className="m-selectbox mini" >
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                    </select>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="¢" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>OPI</td>
                                                <td><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" />
                                                    <select className="m-selectbox mini" >
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                    </select>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" />
                                                    <select className="m-selectbox mini" >
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                    </select>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="¢" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>VRI</td>
                                                <td><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" />
                                                    <select className="m-selectbox mini" >
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                    </select>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" />
                                                    <select className="m-selectbox mini" >
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                    </select>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="¢" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                {/* <div className="b-i-s _fl text-right _button-style m30">
                                    <a href="#" className="blue-btn">Add language Pair</a>
                                </div> */}
                                <div className="_button-style _fl text-center">
                                    <a className="grey-btn" onClick={() => this.closeModal()}>cancel</a>
                                    <a className="blue-btn">save</a>
                                    {/* <a href="#" className="buledark-btn">save & reverse</a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="translationModalEdit" className="modal fade modelwindow" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="filter-head _fl document-hd">
                                <h3 className="text-center center-text">Add Rate Card</h3>
                                <button type="button" className="close" onClick={() => this.closeModal()}>X</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-wrap">
                                    <div className="sdw _fl _mg4">
                                        <h4 className="h4-grey-text">Vendor: Stev paul</h4>

                                        <div className="form-step-row m30 _fl">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-stp">
                                                        <span>Source Language</span>
                                                        <div className="selectbox">
                                                            <select className="m-selectbox">
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4"></div>
                                                <div className="col-md-4">
                                                    <div className="form-stp rt">
                                                        <span>Target Language</span>
                                                        <div className="selectbox">
                                                            <select className="m-selectbox">
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                                <option>Select</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-listing-app card">
                                    <div className="table-responsive">
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <th style={{ width: "10%" }}>Task</th>
                                                <th style={{ width: "25%" }}>Regular Rate ($/Unit)</th>
                                                <th style={{ width: "25%" }}>Minimum</th>
                                                <th style={{ width: "20%" }}>Night/weekends</th>
                                                <th style={{ width: "20%" }}>Cancellation Before</th>
                                            </tr>
                                            <tr>
                                                <td>Translation</td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>Translation</td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>Editing/Proofreading</td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>TEP</td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>DTP</td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>Transcription</td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>Subtitling</td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>Voice Over</td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                {/* <div className="b-i-s _fl text-right _button-style m30">
                                    <a href="#" className="blue-btn">Add language Pair</a>
                                </div> */}
                                <div className="_button-style _fl text-center">
                                    <a className="grey-btn" onClick={() => this.closeModal()}>cancel</a>
                                    <a className="blue-btn">save</a>
                                    {/* <a href="#" className="buledark-btn">save & reverse</a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="trainingModalEdit" className="modal fade modelwindow" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="filter-head _fl document-hd">
                                <h3 className="text-center center-text">Add Rate Card</h3>
                                <button type="button" className="close" onClick={() => this.closeModal()}>X</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-wrap">
                                    <div className="sdw _fl _mg4">
                                        <h4 className="h4-grey-text">Vendor: Stev paul</h4>
                                    </div>
                                </div>
                                <div className="table-listing-app card">
                                    <div className="table-responsive">
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <th style={{ width: "15%" }}>Training Type</th>
                                                <th style={{ width: "15%" }}>Per Hour($)</th>
                                                <th style={{ width: "15%" }}>Per Half Day($)</th>
                                                <th style={{ width: "20%" }}>Per Day($)</th>
                                                <th style={{ width: "20%" }}>Billing</th>
                                                <th style={{ width: "25%" }}>Cancellation</th>
                                                <th style={{ width: "25%" }}>Charge</th>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="sdw _fl" style={{ paddingTop: "2%" }}>
                                                        <p className="h4-grey-text2">Cultural Intelligence</p>
                                                    </div>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" />
                                                    <select className="m-selectbox mini" >
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                    </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field4" /></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="sdw _fl" style={{ paddingTop: "2%" }}>
                                                        <p className="h4-grey-text2">Cultural Intelligence</p>
                                                    </div>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" />
                                                    <select className="m-selectbox mini" >
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                    </select></td>
                                                <td><input type="text" value="" name="" placeholder="Enter" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field4" /></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="sdw _fl" style={{ paddingTop: "2%" }}>
                                                        <p className="h4-grey-text2">Cultural Intelligence</p>
                                                    </div>
                                                </td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" />
                                                    <select className="m-selectbox mini" >
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                        <option>Select</option>
                                                    </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini" >
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field3" /><select className="m-selectbox mini">
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                    <option>Select</option>
                                                </select></td>
                                                <td><input type="text" value="" name="" placeholder="$" className="in-field4" /></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                {/* <div className="b-i-s _fl text-right _button-style m30">
                                    <a href="#" className="blue-btn">Add language Pair</a>
                                </div> */}
                                <div className="_button-style _fl text-center">
                                    <a className="grey-btn" onClick={() => this.closeModal()}>cancel</a>
                                    <a className="blue-btn">save</a>
                                    {/* <a href="#" className="buledark-btn">save & reverse</a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>

        )
    }
}

export default VendorRateList;
