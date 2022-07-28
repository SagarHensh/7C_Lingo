import React from "react";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import "./vendorEdit.css";
import "./bootSelect.css";
import $ from 'jquery';
import ReactStars from "react-rating-stars-component";
import { getCountryList, getLookUpDataFromAPI, phoneNumberCheck } from "../../../../services/common-function";
import { mobileNumberValidator, numberValidator } from "../../../../validators";

export default class EditVendorProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fname: "",
            lname: "",
            email: "",
            alternateEmail: "",
            phoneNumber: "",
            alternatePhoneNumber: "",
            whatsappNumber: "",
            allGender: [],
            gender: "",
            dob: "",
            workExperience: "",
            source: "",
            allSourses: [],
            sourceName: "",
            country: "",
            timezone: "",
            bio: "",
            isFriend: false,
            countryCode: 1,


            allRoles: [],
            role: "",
            allLanguages: [],
            primaryLanguage: "",
            allProficiencySkills: [],
            primaryProficiencySkills: [],
            primaryLanguageRating: "",
            otherLanguage: false,
            proficientOtherLanguages: [],
            otherProficientSkills: [],
            otherLanguageRating: "",
            allServices: [],
            servicesOffered: [],
            notes: "",


            PrimaryLocation: "",
            allCountry: [],
            allState: [],
            primaryCountry: "",
            primaryState: "",
            primaryCity: "",
            primaryZip: "",

            isSameAddress: false,

            billingAddress: "",
            billingCountry: "",
            billingState: "",
            billingCity: "",
            billingZip: "",


            allPaymentMethods: [],
            paymentMethod: "",
            notes: "",

            bankAccountNo: "",
            bankRoutingNo: "",

            paypalEmail: "",

            payoneerEmail: "",

            westernUnionEmail: "",
            westernUnionAccountNo: "",
        }

    }

    componentDidMount() {
        this.getCommonData();
        this.getTimeZone();
        this.getWorkExperience();

        this.setState({
            phoneNumber: "+" + this.state.countryCode + " ",
            alternatePhoneNumber: "+" + this.state.countryCode + " ",
            whatsappNumber: "+" + this.state.countryCode + " ",
        })
        window.$('.my-form-rw h3').click(function () {

            $(this).parent().find('.my-form-bx').slideToggle();
            $(this).toggleClass('open');
        });

    }

    getCommonData = async () => {
        let country = await getCountryList();
        this.setState({
            allCountry: country
        });
        this.getCountryData(country);

        let lookUpData = await getLookUpDataFromAPI();
        console.log("All LookupData", lookUpData);
        this.setState({
            allGender: lookUpData.GENDER_TYPE,
            allSourses: lookUpData.SOURCE_TYPE,

        });

        this.getSource(lookUpData.SOURCE_TYPE);

        let genderArr = [{
            text: "Select",
            value: ""
        }];
        lookUpData.GENDER_TYPE.map((data) => {
            genderArr.push({
                text: data.name,
                value: data.id
            })
        })

        var classInstance = this;
        window.$('.myDropdown').ddslick({
            data: genderArr,
            onSelected: function (data) {
                classInstance.setState({
                    gender: data.selectedData.value
                });
            }
        });
    }

    getWorkExperience = () => {
        let expArr = [{
            text: "None",
            value: ""
        }];

        var classInstance = this;
        window.$('.myDropdown_work_experience').ddslick({
            data: expArr,
            onSelected: function (data) {
                classInstance.setState({
                    workExperience: data.selectedData.value
                });
            }
        });
    }

    getTimeZone = () => {
        let zoneArr = [{
            text: "None",
            value: ""
        }];

        var classInstance = this;
        window.$('.myDropdown_timeZone').ddslick({
            data: zoneArr,
            onSelected: function (data) {
                classInstance.setState({
                    timezone: data.selectedData.value
                });
            }
        });
    }

    getCountryData = (allData) => {
        let countryArr = [{
            text: "None",
            value: ""
        }];
        allData.map((data) => {
            countryArr.push({
                text: data.name,
                value: data.id
            });
        });

        var classInstance = this;
        window.$('.myDropdown_country').ddslick({
            data: countryArr,
            onSelected: function (data) {
                classInstance.setState({
                    country: data.selectedData.value
                });
            }
        });
    }

    getSource = (allSource) => {
        let sourseArr = [{
            text: "None",
            value: ""
        }];
        allSource.map((data) => {
            sourseArr.push({
                text: data.name,
                value: data.id
            });
        });

        var classInstance = this;
        window.$('.myDropdown_sourse').ddslick({
            data: sourseArr,
            onSelected: function (data) {
                if (data.selectedData.value === 16) {
                    classInstance.setState({
                        source: data.selectedData.value,
                        isFriend: true
                    })
                } else {
                    classInstance.setState({
                        source: data.selectedData.value,
                        isFriend: false
                    })
                }
                // classInstance.setState({
                //     source: data.selectedData.value
                // });
            }
        });
    }



    ratingChangedProfile = (newRating) => {
        console.log("New Rating>>>", newRating);
    }

    PrimaryLanguageRatingChanged = (newRating) => {
        console.log("New Primary Language Rating>>>", newRating);
    }

    otherLanguageRatingChange = (newRating) => {
        console.log("Other Languages", newRating);
    }

    /******* Account Info settings ******* */

    firstNameChange = (e) => {
        this.setState({
            fname: e.target.value
        })
    }

    lastNameChange = (e) => {
        this.setState({
            lname: e.target.value
        })
    }

    emailChange = (e) => {
        this.setState({
            email: e.target.value
        })
    }

    alternateEmailChange = (e) => {
        this.setState({
            alternateEmail: e.target.value
        })
    }

    phoneChange = (e) => {
        if (numberValidator(e.target.value) === true) {
          if (mobileNumberValidator(e.target.value) === true) {
            let phoneCheck = phoneNumberCheck(e.target.value);
            if (phoneCheck) {
              this.setState({
                phoneNumber: phoneCheck
              })
            }
          }
        }
        // this.setState({
        //     phoneNumber: e.target.value
        // })
    }

    alternatePhoneChange = (e) => {
        if (numberValidator(e.target.value) === true) {
          if (mobileNumberValidator(e.target.value) === true) {
            let phoneCheck = phoneNumberCheck(e.target.value);
            if (phoneCheck) {
              this.setState({
                alternatePhoneNumber: phoneCheck
              })
            }
          }
        }
        // this.setState({
        //     alternatePhoneNumber: e.target.value
        // })
    }

    whatsappChange = (e) => {
        if (numberValidator(e.target.value) === true) {
          if (mobileNumberValidator(e.target.value) === true) {
            let phoneCheck = phoneNumberCheck(e.target.value);
            if (phoneCheck) {
              this.setState({
                whatsappNumber: phoneCheck
              })
            }
          }
        }
        // this.setState({
        //     whatsappNumber: e.target.value
        // })
    }

    dobChange = (e) => {
        this.setState({
            dob: e.target.value
        })
    }

    sourseNameChange = (e) => {
        this.setState({
            sourceName: e.target.value
        })
    }

    bioChange = (e) => {
        this.setState({
            bio: e.target.value
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className="wrapper">
                    <Header />
                    <Sidebar />

                    <div className="component-wrapper">
                        <div className="vender-head _fl"> Vendor Profile </div>
                        <div className="myaccount-section-wrap _fl">
                            <div className="row">
                                <div className="col-md-9">
                                    <div className="my-form-rw _fl">
                                        <h3 className="open">My Account Informaiton </h3>
                                        <div className="my-form-bx" style={{ display: "block" }}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">First Name</span>
                                                        <input type="text" value={this.state.fname} onChange={this.firstNameChange} name="" placeholder="Xxxxxxx" className="in-field2" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">Last Name</span>
                                                        <input type="text" value={this.state.lname} onChange={this.lastNameChange} name="" placeholder="Xxxxxxx" className="in-field2" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">Email ID</span>
                                                        <input type="text" value={this.state.email} onChange={this.emailChange} name="" placeholder="Xxxx@xxx" className="in-field2" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">Alternate Email ID</span>
                                                        <input type="text" value={this.state.alternateEmail} onChange={this.alternateEmailChange} name="" placeholder="zzzz@gmail.com" className="in-field2" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">Phone Number</span>
                                                        <input type="text" value={this.state.phoneNumber} onChange={this.phoneChange} name="" placeholder="+1-Xxxxxxx" className="in-field2" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">Whatsapp Number</span>
                                                        <input type="text" value={this.state.whatsappNumber} onChange={this.whatsappChange} name="" placeholder="+1-Xxxxxxx" className="in-field2" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">Alternate Phone Number</span>
                                                        <input type="text" value={this.state.alternatePhoneNumber} onChange={this.alternatePhoneChange} name="" placeholder="+1-Xxxxxxx" className="in-field2" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">Gender</span>
                                                        <div class="dropdwn">
                                                            <select className="myDropdown frm4-select"></select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span>Date of Birth</span>
                                                        <div className="form-input-fields">
                                                            <input type="date" id="from_datepicker" 
                                                            className="textbox4"
                                                            // className="textbox4 d-icon"
                                                             placeholder="10/25/2021" value={this.state.dob} onChange={this.dobChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">Work Experience</span>
                                                        <div class="dropdwn">
                                                            <select className="myDropdown_work_experience frm4-select"></select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span>How did you hear about us?</span>
                                                        <div class="dropdwn">
                                                            <select className="myDropdown_sourse frm4-select"></select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    {this.state.isFriend ?
                                                        <div className="form_rbx"> <span className="">Friend Name</span>
                                                            <input type="text" value={this.state.sourceName} onChange={this.sourseNameChange} name="" placeholder="Xxxxxxx" className="in-field2" />
                                                        </div> : <React.Fragment></React.Fragment>}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span>Country of Origin</span>
                                                        <div class="dropdwn">
                                                            <select className="myDropdown_country frm4-select"></select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">Time Zone</span>
                                                        <div class="dropdwn">
                                                            <select className="myDropdown_timeZone frm4-select"></select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span>Bio</span>
                                                        <textarea
                                                            rows="1"
                                                            placeholder=""
                                                            className="in-textarea msg min"
                                                            value={this.state.bio}
                                                            style={{
                                                                height: "52px",
                                                                color: "var(--grey)",
                                                                borderRadius: "10px",
                                                                boxShadow: "2px",
                                                                resize: "none",
                                                            }}
                                                            onChange={this.bioChange}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="my-form-rw _fl">
                                        <h3>Service Info </h3>
                                        <div className="my-form-bx">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">Role(s)</span>
                                                        <div className="bts-drop">
                                                            <select className="selectpicker">
                                                                <option>Type</option>
                                                                <option>Translation</option>
                                                                <option>Interpretation</option>
                                                                <option>Subtitling</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form_rbx"> <span className="">Primary (Native/Source) Language</span>
                                                        <div className="bts-drop">
                                                            <select className="selectpicker">
                                                                <option>Select</option>
                                                                <option>English</option>
                                                                <option>Maxican</option>
                                                                <option>Spanish</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form_rbx"> <span className="">Primary Language Proficiency Skills</span>
                                                        <div className="bts-drop">
                                                            <select className="selectpicker">
                                                                <option>Select</option>
                                                                <option>Speak</option>
                                                                <option>Read</option>
                                                                <option>Wright</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form_rbx"> <span className="">Primary  Language Fluency Ratings</span>
                                                        <div className="rate">
                                                            <ReactStars
                                                                count={5}
                                                                onChange={this.PrimaryLanguageRatingChanged}
                                                                size={35}
                                                                // color="#fff"
                                                                activeColor="#009fe0"
                                                            // value={data.rating}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">Proficient Other Languages?</span>
                                                        <div className="check-field">
                                                            <label className="checkbox_btn">
                                                                <input type="radio" name="radio" />
                                                                <span className="checkmark3"></span> Yes</label>
                                                        </div>
                                                        <div className="check-field">
                                                            <label className="checkbox_btn">
                                                                <input type="radio" name="radio" />
                                                                <span className="checkmark3"></span> No</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form_rbx"> <span className="">Primary (Native/Source) Language</span>
                                                        <div className="bts-drop">
                                                            <select className="selectpicker">
                                                                <option>Select</option>
                                                                <option>English</option>
                                                                <option>Maxican</option>
                                                                <option>Spanish</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form_rbx"> <span className="">Primary Language Proficiency Skills</span>
                                                        <div className="bts-drop">
                                                            <select className="selectpicker">
                                                                <option>Select</option>
                                                                <option>Speak</option>
                                                                <option>Read</option>
                                                                <option>Wright</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form_rbx"> <span className="">Primary  Language Fluency Ratings</span>
                                                        <div className="rate">
                                                            <ReactStars
                                                                count={5}
                                                                onChange={this.otherLanguageRatingChange}
                                                                size={35}
                                                                // color="#fff"
                                                                activeColor="#009fe0"
                                                            // value={data.rating}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <div className="form_rbx"> <span className="">Service Offerd</span>
                                                        <div className="bts-drop multiple-drop">
                                                            <select id="multiple-checkboxes" multiple="multiple">
                                                                <option value="php">PHP</option>
                                                                <option value="javascript">JavaScript</option>
                                                                <option value="java">Java</option>
                                                                <option value="sql">SQL</option>
                                                                <option value="jquery">Jquery</option>
                                                                <option value=".net">.Net</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="my-form-rw _fl">
                                        <h3>Address Info</h3>
                                        <div className="my-form-bx">
                                            <h4 className="h4_heading">Primary address</h4>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form_rbx adr"> <span className="">Address</span>
                                                        <textarea placeholder="Address" className="in-textarea"></textarea>
                                                        <div className="ak"><img src="images/location.png" /></div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">State</span>
                                                        <div className="bts-drop">
                                                            <select className="selectpicker">
                                                                <option>Californina</option>
                                                                <option>Canada</option>
                                                                <option>Texas</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">City</span>
                                                        <input type="text" value="" name="" placeholder="Xxxxxxx" className="in-field2" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">Zip Code</span>
                                                        <input type="text" value="" name="" placeholder="00000" className="in-field2" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="billing-info">
                                                <h4 className="text-billing">Billing Info</h4>
                                                <label className="custom_check">Same as Address Info
                                                    <input type="checkbox" />
                                                    <span className="checkmark"></span> </label>
                                            </div>
                                            <div className="billing-address-info">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form_rbx adr"> <span className="">Address</span>
                                                            <textarea placeholder="Address" className="in-textarea"></textarea>
                                                            <div className="ak"><img src="images/location.png" /></div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form_rbx"> <span className="">State</span>
                                                            <div className="bts-drop">
                                                                <select className="selectpicker">
                                                                    <option>Californina</option>
                                                                    <option>Canada</option>
                                                                    <option>Texas</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form_rbx"> <span className="">City</span>
                                                            <input type="text" value="" name="" placeholder="Xxxxxxx" className="in-field2" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form_rbx"> <span className="">Zip Code</span>
                                                            <input type="text" value="" name="" placeholder="00000" className="in-field2" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="my-form-rw _fl">
                                        <h3>Financial info</h3>
                                        <div className="my-form-bx">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">Payment Method</span>
                                                        <div className="bts-drop">
                                                            <div className="bts-drop multiple-drop">
                                                                <select id="multiple-checkboxes-payemnt" multiple="multiple">
                                                                    <option value="Paypal">Paypal</option>
                                                                    <option value="Payoneer">Payoneer</option>
                                                                    <option value="Western Union">Western Union</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">Account Number</span>
                                                        <input type="text" value="" name="" placeholder="Xxxxxxx" className="in-field2" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form_rbx"> <span className="">Routing Number</span>
                                                        <input type="text" value="" name="" placeholder="00000" className="in-field2" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <div className="form_rbx"> <span className="">Notes</span>
                                                        <textarea placeholder="......." className="in-textarea min"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 text-center">
                                    <div className="profile-pic-data">
                                        <div className="c-logo"><img src="images/c-logo.png" />
                                            <button className="pht"></button>
                                        </div>
                                        <h4 className="h4_text">Client id</h4>
                                        <div className="rate rtg">
                                            <ReactStars
                                                count={5}
                                                onChange={this.ratingChangedProfile}
                                                size={35}
                                                // color="#fff"
                                                activeColor="#009fe0"
                                            // value={data.rating}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="_fl">
                            <div className="row m20">
                                <div className="col-md-12 text-center">
                                    <button type="submit" className="delete_button">Delete</button>
                                    <button type="submit" className="sv_btn">Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Modal --> */}
                <div id="create-request" className="modal fade modelwindow" role="dialog">
                    <div className="modal-dialog modal-lg">
                        {/* <!-- Modal content--> */}
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">X</button>
                                <h4 className="modal-title">New Request</h4>
                            </div>
                            <div className="modal-body">
                                <div className="model-info">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="request_model-info">
                                                <figure><img src="images/m-camera.png" /></figure>
                                                <h3 className="text-center">schedule interpretation</h3>
                                                <p>Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator. Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.</p>
                                                <div className="re_model text-center"><a href="#">select</a></div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="request_model-info">
                                                <figure><img src="images/m-camera.png" /></figure>
                                                <h3 className="text-center">request project</h3>
                                                <p>Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator. Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.</p>
                                                <div className="re_model text-center"><a href="#">select</a></div>
                                            </div>
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