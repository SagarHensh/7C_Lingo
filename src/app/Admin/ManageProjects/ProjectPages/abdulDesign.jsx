import React from "react";
import { ImageName } from "../../../../enums";
import { SelectBox } from "../../SharedComponents/inputText";
// import "./main-style.css";

export default class NewDesign extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="component-wrapper">
                    <div className="job-details-tab _fl sdw bid_vend_assign_pge">
                        <ul className="nav nav-tabs stb">

                            <li className="nav-item">
                                {" "}
                                <a
                                    className="nav-link active"
                                    data-toggle="tab"
                                    href="#documrnts"
                                >
                                    <div className="taber">
                                        <figure>
                                            <img src={ImageName.IMAGE_NAME.DOCUMENTICON} />
                                        </figure>
                                        Documents
                                    </div>
                                </a>{" "}
                            </li>
                            <li className="nav-item">
                                {" "}
                                <a className="nav-link" data-toggle="tab" href="#projectdetltsks">
                                    <div className="taber">
                                        <figure>
                                            <img
                                                src={ImageName.IMAGE_NAME.CHAT_ICON}
                                                style={{ padding: "10px", width: "48px" }}
                                            />
                                        </figure>
                                        Project Details & Task[s]{" "}
                                    </div>
                                </a>{" "}
                            </li>
                            <li className="nav-item">
                                {" "}
                                <a className="nav-link" data-toggle="tab" href="#vendorbids">
                                    <div className="taber">
                                        <figure>
                                            <img src={ImageName.IMAGE_NAME.CHARSMSICON} />
                                        </figure>
                                        Vendor Bids
                                    </div>
                                </a>{" "}
                            </li>

                        </ul>

                        <div className="tab-content">




                            <div className="tab-pane active" id="documrnts">

                                <div className="document-list-wrap _fl sdw margin-top-30">
                                    <div className="_fl doc-wrap">
                                        <h3>Translated Documents</h3>

                                        <div className="table-listing-app tblt">
                                            <div className="table-listing-app proj_tbl">
                                                <div className="table-responsive">
                                                    <div className="add_tsts">
                                                        <div className="text_rite">
                                                            <button className="adtst_btn">Download</button>
                                                        </div>
                                                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <th style={{ width: "10%" }}>File Name</th>
                                                                    <th style={{ width: "18%" }}>Service Type</th>
                                                                    <th style={{ width: "8%" }}>Task ID</th>
                                                                    <th style={{ width: "18%" }}>Last Modified On</th>
                                                                    <th style={{ width: "18%" }}>Action</th>
                                                                    <th style={{ width: "18%" }}>Notes to Vendor</th>
                                                                </tr>
                                                            </tbody>
                                                            <tbody>
                                                                <tr>


                                                                    <td style={{ width: "10%" }}><div className="web-form-bx">
                                                                        <input type="text" value="" name="" placeholder="xyz.pdf" className="in-field2" />
                                                                    </div></td>

                                                                    <td style={{ width: "18%" }}>Translation</td>
                                                                    <td style={{ width: "8%" }}><div className="web-form-bx">
                                                                        <input type="text" value="" name="" placeholder="1" className="in-field2" />
                                                                        <a href="">
                                                                            <img src={ImageName.IMAGE_NAME.EYE_BTN} />
                                                                        </a>
                                                                    </div>



                                                                    </td>
                                                                    <td style={{ width: "18%" }}>
                                                                        02/01/2022

                                                                    </td>
                                                                    <td style={{ width: "18%" }}>
                                                                        <div className="bts-drop">
                                                                            <SelectBox
                                                                                // optionData={this.state.allLanguage}
                                                                                // value={this.state.selectedSourceLanguage}
                                                                                // onSelectChange={(value) => this.sourceLanguageChange(value)}
                                                                                // isDisabled={true}
                                                                            >
                                                                            </SelectBox>
                                                                        </div>
                                                                    </td>
                                                                    <td style={{ width: "18%" }}><div className="web-form-bx">
                                                                        <input type="text" value="" name="" placeholder="Enter" className="in-field2" />
                                                                    </div></td>


                                                                </tr>
                                                                <tr>


                                                                    <td style={{ width: "10%" }}><div className="web-form-bx">
                                                                        <input type="text" value="" name="" placeholder="xyz.pdf" className="in-field2" />
                                                                    </div></td>

                                                                    <td style={{ width: "18%" }}>Translation</td>
                                                                    <td style={{ width: "8%" }}><div className="web-form-bx">
                                                                        <input type="text" value="" name="" placeholder="1" className="in-field2" />
                                                                        <a href="">
                                                                            <img src={ImageName.IMAGE_NAME.EYE_BTN} />
                                                                        </a>
                                                                    </div>



                                                                    </td>
                                                                    <td style={{ width: "18%" }}>
                                                                        02/01/2022

                                                                    </td>
                                                                    <td style={{ width: "18%" }}>
                                                                        <div className="bts-drop">
                                                                            <SelectBox
                                                                                // optionData={this.state.allLanguage}
                                                                                // value={this.state.selectedSourceLanguage}
                                                                                // onSelectChange={(value) => this.sourceLanguageChange(value)}
                                                                                // isDisabled={true}
                                                                            >
                                                                            </SelectBox>
                                                                        </div>
                                                                    </td>
                                                                    <td style={{ width: "18%" }}><div className="web-form-bx">
                                                                        <input type="text" value="" name="" placeholder="Enter" className="in-field2" />
                                                                    </div></td>


                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                        <div className="text_rite">
                                                            <button className="adtst_btn">Sumit</button>
                                                            <button className="adtst_btn">Reset</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>


                                    </div>
                                </div>



                            </div>


                            <div className="tab-pane" id="projectdetltsks">


                                <div className="document-list-wrap _fl sdw margin-top-30">
                                    <div className="_fl doc-wrap">
                                        <h3>Task[s] Assigned</h3>

                                        <div className="table-listing-app tblt">
                                            <div className="table-listing-app proj_tbl">
                                                <p className="serv_typ">Service Type: Translation</p>
                                                <div className="table-responsive">
                                                    <div className="add_tsts">
                                                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <th style={{ width: "5%" }}>
                                                                        <label className="custom_check2">
                                                                            <input type="checkbox" onClick={this.checked} />
                                                                            <span className="checkmark2"></span>
                                                                        </label>
                                                                    </th>
                                                                    <th style={{ width: "5%" }}>Task ID</th>
                                                                    <th style={{ width: "18%" }}>Task</th>
                                                                    <th style={{ width: "18%" }}>Source Lang</th>
                                                                    <th style={{ width: "18%" }}>Target Lang</th>
                                                                    <th style={{ width: "18%" }}>Due Date</th>
                                                                    <th style={{ width: "10%" }}>Notes</th>
                                                                    <th style={{ width: "24%" }}>Vendor[s]</th>
                                                                </tr>
                                                            </tbody>
                                                            <tbody>
                                                                <tr>
                                                                    <td style={{ width: "5%" }}>
                                                                        <label className="custom_check2">
                                                                            <input type="checkbox" />

                                                                            <span className="checkmark2"></span>
                                                                        </label>
                                                                    </td>
                                                                    <td style={{ width: "5%" }}>1</td>
                                                                    <td style={{ width: "18%" }}><div className="bts-drop">
                                                                        <SelectBox
                                                                            // optionData={this.state.allLanguage}
                                                                            // value={this.state.selectedSourceLanguage}
                                                                            // onSelectChange={(value) => this.sourceLanguageChange(value)}
                                                                            // isDisabled={true}
                                                                        >
                                                                        </SelectBox>
                                                                    </div></td>
                                                                    <td style={{ width: "18%" }}><div className="bts-drop">
                                                                        <SelectBox
                                                                            // optionData={this.state.allLanguage}
                                                                            // value={this.state.selectedSourceLanguage}
                                                                            // onSelectChange={(value) => this.sourceLanguageChange(value)}
                                                                            // isDisabled={true}
                                                                        >
                                                                        </SelectBox>
                                                                    </div></td>
                                                                    <td style={{ width: "18%" }}><div className="bts-drop">
                                                                        <SelectBox
                                                                            // optionData={this.state.allLanguage}
                                                                            // value={this.state.selectedSourceLanguage}
                                                                            // onSelectChange={(value) => this.sourceLanguageChange(value)}
                                                                            // isDisabled={true}
                                                                        >
                                                                        </SelectBox>
                                                                    </div></td>
                                                                    <td style={{ width: "18%" }}>
                                                                        <div className="form-input-fields">
                                                                            <input type="text" id="from_datepicker" className="textbox4 d-icon" placeholder="Select" />
                                                                        </div>

                                                                    </td>
                                                                    <td style={{ width: "10%" }}><div className="web-form-bx">
                                                                        <input type="text" value="" name="" placeholder="Enter" className="in-field2" />
                                                                    </div></td>
                                                                    <td style={{ width: "24%" }}>
                                                                        <div className="web-form-bx">
                                                                            <input type="text" value="" name="" placeholder="Vendor Chosen" className="in-field2" />
                                                                            <a href="">
                                                                                <img src={ImageName.IMAGE_NAME.EYE_BTN} />
                                                                            </a>
                                                                        </div>
                                                                    </td>


                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                        <button className="adtst_btn">Add Task</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="table-listing-app proj_tbl">
                                                <p className="serv_typ">Service Type: Subtitling</p>
                                                <div className="table-responsive">
                                                    <div className="add_tsts">
                                                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <th style={{ width: "5%" }}>
                                                                        <label className="custom_check2">
                                                                            <input type="checkbox" onClick={this.checked} />
                                                                            <span className="checkmark2"></span>
                                                                        </label>
                                                                    </th>
                                                                    <th style={{ width: "5%" }}>Task ID</th>
                                                                    <th style={{ width: "18%" }}>Task</th>
                                                                    <th style={{ width: "18%" }}>Source Lang</th>
                                                                    <th style={{ width: "18%" }}>Target Lang</th>
                                                                    <th style={{ width: "18%" }}>Due Date</th>
                                                                    <th style={{ width: "10%" }}>Notes</th>
                                                                    <th style={{ width: "24%" }}>Vendor[s]</th>
                                                                </tr>
                                                            </tbody>
                                                            <tbody>
                                                                <tr>
                                                                    <td style={{ width: "5%" }}>
                                                                        <label className="custom_check2">
                                                                            <input type="checkbox" />

                                                                            <span className="checkmark2"></span>
                                                                        </label>
                                                                    </td>
                                                                    <td style={{ width: "5%" }}>1</td>
                                                                    <td style={{ width: "18%" }}><div className="bts-drop">
                                                                        <SelectBox
                                                                            // optionData={this.state.allLanguage}
                                                                            // value={this.state.selectedSourceLanguage}
                                                                            // onSelectChange={(value) => this.sourceLanguageChange(value)}
                                                                            // isDisabled={true}
                                                                        >
                                                                        </SelectBox>
                                                                    </div></td>
                                                                    <td style={{ width: "18%" }}><div className="bts-drop">
                                                                        <SelectBox
                                                                            // optionData={this.state.allLanguage}
                                                                            // value={this.state.selectedSourceLanguage}
                                                                            // onSelectChange={(value) => this.sourceLanguageChange(value)}
                                                                            // isDisabled={true}
                                                                        >
                                                                        </SelectBox>
                                                                    </div></td>
                                                                    <td style={{ width: "18%" }}><div className="bts-drop">
                                                                        <SelectBox
                                                                            // optionData={this.state.allLanguage}
                                                                            // value={this.state.selectedSourceLanguage}
                                                                            // onSelectChange={(value) => this.sourceLanguageChange(value)}
                                                                            // isDisabled={true}
                                                                        >
                                                                        </SelectBox>
                                                                    </div></td>
                                                                    <td style={{ width: "18%" }}>
                                                                        <div className="form-input-fields">
                                                                            <input type="text" id="from_datepicker" className="textbox4 d-icon" placeholder="Select" />
                                                                        </div>

                                                                    </td>
                                                                    <td style={{ width: "10%" }}><div className="web-form-bx">
                                                                        <input type="text" value="" name="" placeholder="Enter" className="in-field2" />
                                                                    </div></td>
                                                                    <td style={{ width: "24%" }}>
                                                                        <div className="web-form-bx">
                                                                            <input type="text" value="" name="" placeholder="Vendor Chosen" className="in-field2" />
                                                                            <a href="">
                                                                                <img src={ImageName.IMAGE_NAME.EYE_BTN} />
                                                                            </a>
                                                                        </div>
                                                                    </td>


                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                        <div className="text_rite"><button className="adtst_btn">Add Task</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>



                            </div>




                            <div className="tab-pane" id="vendorbids">
                                <div className="job-section-tab">

                                    <div className="create-offer_top">
                                        <div className="_fl create-offer-list">
                                            <div className="_fl wdth-80 px-0 vendBits">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <p><span>Project Id</span> 2029/20</p>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <p><span>Requested On</span> 2029/20</p>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <p><span>Expected Deadline</span> 2029/20</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="_fl wdth-80 p-20">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p className="notes">Notes From <span>7C Lingo</span></p>
                                                    <p>Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.
                                                    </p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p className="notes">Notes from Client</p>
                                                    <p>Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="create-offer sdw _fl">
                                            <div className="tsk-col _fl m30 p-20">
                                                <h2>Service Type: Translation</h2>
                                                <h3>Task 1 Translation</h3>
                                                <ul>
                                                    <li><a href="#">English</a></li>
                                                    <li><a href="#">Spanish</a></li>
                                                </ul>
                                            </div>
                                            <div className="tsk-tabl">
                                                <h3>Matching Vendors</h3>

                                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <th style={{ width: "40%" }} align="left">Vendor Name</th>
                                                        <th style={{ width: "10%" }}>Jane D</th>
                                                        <th style={{ width: "10%" }}>Amy E</th>
                                                        <th style={{ width: "10%" }}>Lisa F</th>
                                                        <th style={{ width: "10%" }}>Roy G</th>
                                                    </tr>



                                                    <tr>
                                                        <td style={{ width: "40%" }} align="left">Action/Status</td>
                                                        <td style={{ width: "10%" }} align="center" className="text-ttt">Accepted</td>
                                                        <td style={{ width: "10%" }} align="center" className="text-ttt">Accepted</td>
                                                        <td style={{ width: "10%" }} align="center" className="text-ttt">Accepted</td>
                                                        <td style={{ width: "10%" }} align="center" className="text-rej">Rejected</td>

                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: "40%" }} align="left">Approximate Word Count</td>
                                                        <td style={{ width: "10%" }} align="center">2500</td>
                                                        <td style={{ width: "10%" }} align="center">2500</td>
                                                        <td style={{ width: "10%" }} align="center">2500</td>
                                                        <td style={{ width: "10%" }} align="center">---</td>

                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: "40%" }} align="left">Unit Cost per Word</td>
                                                        <td style={{ width: "10%" }} align="center">$0.25</td>
                                                        <td style={{ width: "10%" }} align="center">$0.25</td>
                                                        <td style={{ width: "10%" }} align="center">$0.25</td>
                                                        <td style={{ width: "10%" }} align="center">---</td>

                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: "40%" }} align="left">DTP Hours [if needed]</td>
                                                        <td style={{ width: "10%" }} align="center">1</td>
                                                        <td style={{ width: "10%" }} align="center">1</td>
                                                        <td style={{ width: "10%" }} align="center">1</td>
                                                        <td style={{ width: "10%" }} align="center">---</td>

                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: "40%" }} align="left">DTP Hours cost [if applicable]</td>
                                                        <td style={{ width: "10%" }} align="center">$0.25</td>
                                                        <td style={{ width: "10%" }} align="center">$0.25</td>
                                                        <td style={{ width: "10%" }} align="center">$0.25</td>
                                                        <td style={{ width: "10%" }} align="center">---</td>

                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: "40%" }} align="left">Addational fee [if applicable]</td>
                                                        <td style={{ width: "10%" }} align="center">---</td>
                                                        <td style={{ width: "10%" }} align="center">---</td>
                                                        <td style={{ width: "10%" }} align="center">---</td>
                                                        <td style={{ width: "10%" }} align="center">---</td>

                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: "40%" }} align="left" className="text-totle">Total Quote</td>
                                                        <td style={{ width: "10%" }} align="center" className="text-totle">$325.25</td>
                                                        <td style={{ width: "10%" }} align="center" className="text-totle">$325.25</td>
                                                        <td style={{ width: "10%" }} align="center" className="text-totle">$325.25</td>
                                                        <td style={{ width: "10%" }} align="center" className="text-totle">$0</td>

                                                    </tr>


                                                </table>
                                            </div>



                                            <div className="_button-style m30 _fl text-center"><a href="#" className="blue-btn">Assign</a><a href="#" className="blue-btn">Assign</a><a href="#" className="blue-btn">Assign</a></div>
                                        </div>
                                    </div>




                                </div>
                            </div>


                        </div>
                    </div>
                </div>



            </React.Fragment>
        )
    }
}