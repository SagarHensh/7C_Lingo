import React, { Component } from 'react';
import './AddNewJob.css';
import { AlertMessage, ImageName } from "../../../../enums";
import Select, { components } from 'react-select'
import { ApiCall } from "../../../../services/middleware";
import { Decoder } from "../../../../services/auth";




const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            {/* <img
                src={ImageName.IMAGE_NAME.DOWN_ARROW_BLUE}
                style={{ width: "17px" }}
            /> */}
        </components.DropdownIndicator>
    );
};







const appointmentType = [
    {
        label: "F2F",
        value: 1,
    },
    {
        label: "OPI",
        value: 2,
    },
    {
        label: "VRI",
        value: 3,
    },
]


const serviceArr = [
    {
        label: "Translation",
        value: 1,
    },
    {
        label: "Subtitling",
        value: 2,
    },
    {
        label: "Interpretation",
        value: 3,
    },
    {
        label: "Training",
        value: 4,
    },
    {
        label: "Voice Over",
        value: 5,
    },
    {
        label: "I want to make a general enquiry",
        value: 6,
    },
]


export class JobList extends Component {


    constructor(props) {
        super(props);
        this.state = {
            industryType: '',
            serviceType: '',
            roleData: {},
            isLoad: true,
            role: "",
            jobTypeArr: [],
            jobTypeData: {},
        }
    };


    componentDidMount() {
        window.scrollTo(0, 0);
        this.setState({
            roleData: {
                label: "Requester",
                value: 6,
            },
        });
        this.load();
    }

    load = async () => {
        let industryDataArr = [],
            languageResArrData = [],
            languageArrData = [];

        let languageResData = await ApiCall("getlanguagelist");
        let languagePayload = Decoder.decode(languageResData.data.payload);
        languageResArrData = languagePayload.data.languagelist;
        for (let n = 0; n < languageResArrData.length; n++) {
            languageArrData.push({
                label: languageResArrData[n].language,
                value: languageResArrData[n].id,
            });
        }

        this.setState({
            languageArr: languageArrData,
            isLoad: false,
        });

    }



    changeAppointmentType = (data) => {
        this.setState({
            appointmentType: data.value,
        });
    };

    onServiceChange = (data) => {
        this.setState({
            serviceType: data.value,
        });
    };



    render() {
        return (
            <React.Fragment>
                <div class="component-wrapper">
                    <div class="breadcrumb-info _fl">
                        <ul>
                            <li>Interpretation Jobs<small>&gt;</small> </li>
                            <li><a href="#">All Jobs <small> &gt;</small> </a></li>
                            <li><a href="#">Create Jobs</a></li>
                        </ul>
                    </div>
                    <div class="createform-box sdw _fl">
                        <div class="create-head">
                            <div class="row">
                                <div class="col-md-6">
                                    <h2><a href="#">Create new jobs</a></h2>
                                </div>
                                <div class="col-md-6">
                                    <div class="web_btn f-right">
                                        <a href="#">RESET</a>
                                        <a href="#" class="blue">SUBMIT</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="create-jeneral-wrap crt-form _fl">
                            <div class="create-jeneral-info _fl">
                                <div class="create-sb-head">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h3>General Information</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="create-row-app">
                                    <div class="row">
                                        <div class="col-md-6 wt-left">
                                            <div class="web-form-app">
                                                <div class="web-form-bx">
                                                    <div class="frm-label">Service Type</div>
                                                    <div class="dropdwn">
                                                        <Select
                                                            // styles={customStyles}
                                                            options={serviceArr}
                                                            components={{
                                                                DropdownIndicator,
                                                                IndicatorSeparator: () => null,
                                                            }}
                                                            placeholder="Select"
                                                            onChange={(value) => {
                                                                this.onServiceChange(value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">Appointment Type</div>
                                                    <div class="dropdwn">
                                                        <Select
                                                            options={appointmentType}
                                                            placeholder="Appointment Type"
                                                            onSelectChange={(value) => {
                                                                this.changeAppointmentType(value);
                                                            }}
                                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                        />
                                                    </div>
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">Source Language</div>
                                                    <div class="dropdwn">
                                                        <Select
                                                            options={this.state.languageArr}
                                                            placeholder="Source Language"
                                                            onSelectChange={(value) => {
                                                                this.changeAppointmentType(value);
                                                            }}
                                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                        />
                                                    </div>
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">Target Language</div>
                                                    <div class="dropdwn">
                                                        <Select
                                                            options={this.state.languageArr}
                                                            placeholder="Target Language"
                                                            onSelectChange={(value) => {
                                                                this.changeAppointmentType(value);
                                                            }}
                                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                        />
                                                    </div>
                                                </div>
                                                <div class="web-form-bx md4">
                                                    <div class="frm-label">Number of Interested Required</div>
                                                    <div class="dropdwn md4">
                                                        <Select
                                                            options={appointmentType}
                                                            placeholder="Source Language"
                                                            onSelectChange={(value) => {
                                                                this.changeAppointmentType(value);
                                                            }}
                                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                        />
                                                    </div>
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">Will the interpreter check-in with</div>
                                                    <div class="check-field">
                                                        <label class="checkbox_btn">
                                                            <input type="radio" name="radio1" />
                                                            <span class="checkmark3"></span> Yes</label>
                                                    </div>
                                                    <div class="check-field">
                                                        <label class="checkbox_btn">
                                                            <input type="radio" name="radio1" />
                                                            <span class="checkmark3"></span> No</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6 wt-right">
                                            <div class="web-form-app">
                                                <div class="pic-data">
                                                    <figure><img src={ImageName.IMAGE_NAME.NEWJOBPIC} /></figure>
                                                </div>
                                                <div class="web-form-bx md4">
                                                    <div class="frm-label">Job Type</div>
                                                    <div class="dropdwn">
                                                        <Select
                                                            options={appointmentType}
                                                            placeholder="Source Language"
                                                            onSelectChange={(value) => {
                                                                this.changeAppointmentType(value);
                                                            }}
                                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="create-jeneral-info _fl margin-top-30">
                                <div class="create-sb-head">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h3>Job Details</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="create-row-app">
                                    <div class="row">
                                        <div class="col-md-6 wt-left">
                                            <div class="web-form-app">
                                                <div class="web-form-bx">
                                                    <div class="frm-label">Appointment notes for interpreter</div>
                                                    <div class="form-input-fields">
                                                        <input type="text" value="" name="" placeholder="Enter notes here..." class="textbox4" />
                                                    </div>
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">Appointment date and time</div>
                                                    <div class="form-input-fields">
                                                        <input type="text" id="from_datepicker" class="textbox4 d-icon" placeholder="10/25/2021" />
                                                    </div>
                                                    <div class="t-time"> <span class="t1"><small>09</small></span> <span class="t2"><small>00</small></span> <span class="t3"><small>AM</small></span> </div>
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">Onsite Contact</div>
                                                    <input type="text" value="" name="" placeholder="Prefiled" class="in-field2" />
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">Will the interpreter check-in with</div>
                                                    <div class="check-field">
                                                        <label class="checkbox_btn">
                                                            <input type="radio" name="radio" />
                                                            <span class="checkmark3"></span> Yes</label>
                                                    </div>
                                                    <div class="check-field">
                                                        <label class="checkbox_btn">
                                                            <input type="radio" name="radio" />
                                                            <span class="checkmark3"></span> No</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6 wt-right">
                                            <div class="web-form-app">
                                                <div class="web-form-bx">
                                                    <div class="frm-label">Appointment notes for interpreter</div>
                                                    <div class="tr-3">
                                                        <textarea placeholder="Address" class="in-textarea"></textarea>
                                                        <div class="ak"><img src="images/location.png" /></div>
                                                    </div>
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">Duration</div>
                                                    <div class="dropdwn">
                                                        <Select
                                                            options={appointmentType}
                                                            placeholder="Source Language"
                                                            onSelectChange={(value) => {
                                                                this.changeAppointmentType(value);
                                                            }}
                                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                        />
                                                    </div>
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">Any Qualification Required</div>
                                                    <div class="dropdwn">
                                                        <Select
                                                            options={appointmentType}
                                                            placeholder="Source Language"
                                                            onSelectChange={(value) => {
                                                                this.changeAppointmentType(value);
                                                            }}
                                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                        />
                                                    </div>
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">Site Contact Phone Number</div>
                                                    <input type="text" value="" name="" placeholder="Prefiled" class="in-field2" />
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">Would you like to have prefered Interpreter?</div>
                                                    <div class="check-field">
                                                        <label class="checkbox_btn">
                                                            <input type="radio" name="radio" />
                                                            <span class="checkmark3"></span> Yes</label>
                                                    </div>
                                                    <div class="check-field">
                                                        <label class="checkbox_btn">
                                                            <input type="radio" name="radio" />
                                                            <span class="checkmark3"></span> No</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="create-jeneral-info _fl margin-top-30">
                                <div class="create-sb-head">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h3>Limtted english individual information (lei)</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="create-row-app">
                                    <div class="row">
                                        <div class="col-md-6 wt-left">
                                            <div class="web-form-app">
                                                <div class="web-form-bx">
                                                    <div class="frm-label">Limitted English Individual (LEI)</div>
                                                    <div class="dropdwn">
                                                        <Select
                                                            options={appointmentType}
                                                            placeholder="Source Language"
                                                            onSelectChange={(value) => {
                                                                this.changeAppointmentType(value);
                                                            }}
                                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                        />
                                                    </div>
                                                    <button class="addnew">Add New</button>
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">LEI Phone Number</div>
                                                    <input type="text" value="" name="" placeholder="0104  0125  012" class="in-field2" />
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">Gender Preference(If any)</div>
                                                    <div class="dropdwn">
                                                        <Select
                                                            options={appointmentType}
                                                            placeholder="Source Language"
                                                            onSelectChange={(value) => {
                                                                this.changeAppointmentType(value);
                                                            }}
                                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                        />
                                                    </div>
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">LEI Country of origin</div>
                                                    <div class="dropdwn">
                                                        <Select
                                                            options={appointmentType}
                                                            placeholder="Source Language"
                                                            onSelectChange={(value) => {
                                                                this.changeAppointmentType(value);
                                                            }}
                                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6 wt-right">
                                            <div class="web-form-app">
                                                <div class="web-form-bx">
                                                    <div class="frm-label">LEI Date of Birth</div>
                                                    <div class="form-input-fields">
                                                        <input type="text" id="datepicker2" class="textbox4 d-icon" placeholder="10/25/2021" />
                                                    </div>
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">LEI Email ID</div>
                                                    <input type="text" value="" name="" placeholder="Email id" class="in-field2" />
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">LEI reference Number</div>
                                                    <input type="text" value="" name="" placeholder="0104  0125  012" class="in-field2" />
                                                </div>
                                                <div class="web-form-bx">
                                                    <div class="frm-label">LEI Prefered language</div>
                                                    <div class="dropdwn">
                                                        <Select
                                                            options={appointmentType}
                                                            placeholder="Source Language"
                                                            onSelectChange={(value) => {
                                                                this.changeAppointmentType(value);
                                                            }}
                                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                        />
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
            </React.Fragment>
        )
    }
}

export default JobList
