import React, { Component } from 'react'
import "bootstrap/dist/css/bootstrap.css";
import "../.././../css/client-login.css";
import { SmallSelectBox, SelectBox } from "../../Admin/SharedComponents/inputText";
import { components } from 'react-select';
import Select from 'react-select'
import { Link } from 'react-router-dom';
import { consoleLog, getLookUpDataFromAPI } from '../../../services/common-function';
import history from '../../../history';
import InterpreationModal from './interpreationJobModal';
import TrainingModal from './TrainingModal';
import Autocomplete from 'react-autocomplete';
import { ApiCall, ApiCallClient } from '../../../services/middleware';
import { ErrorCode, UsersEnums } from '../../../services/constant';
import { Decoder } from '../../../services/auth';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { ToastContainer, toast } from 'react-toastify';
import { inputEmptyValidate } from '../../../validators';
import { AlertMessage } from '../../../enums';
import './clientReq.css';
import TranslationModal from './TranslationModal';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
// import { makeStyles } from '@mui/styles';


const style = {
    boxStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "75%",
        bgcolor: 'background.paper',
        border: 'none',
        boxShadow: 24,
        p: 4,
        borderRadius: "10px",
        overflowY: 'auto',
        height: '90%',
        display: 'block'
    }
};



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


var setBusinessArr = [];

export class ClientReq extends Component {


    constructor(props) {
        super(props);
        this.state = {
            industryType: '',
            serviceType: "",
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            countryCode: "",
            clientId: "",
            businessName: '',
            aboutUs: '',
            sourceType: "",
            serviceTypeArr: [],
            selectedServiceType: {},
            allSourceType: [],
            selectedSourceType: {},
            allIndustryType: [],
            selectedIndustryType: {
                label: "",
                value: ""
            },
            allBusinessName: [],
            allClientDetails: [],
            clientMobile: "",

            // ................
            companyName: "",
            officeName: "",
            contactInfo: "",
            open: false,
        }
    }

    componentDidMount() {

        if (localStorage.getItem("AuthToken")) {
            // return history.push("/adminDashboard");
            let authtoken = localStorage.getItem("AuthToken");
            let authUser = Decoder.decode(authtoken);
            if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN) {
                return history.push("/adminDashboard");
            } else if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT) {
                return history.push("/clientDashboard");
            } else if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.ADMIN_STAFF) {
                return history.push("/adminDashboard");
            } else if (
                authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.VENDOR
            ) {
                return history.push("/vendorDashboard");
            }
        }
        document.getElementById("backdrop").style.display = "none";

        var classInstance = this;

        var interpretationModal = document.getElementById("interpretation_modal");

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == interpretationModal) {
                classInstance.closeInterpreationModal();
            }
        };
        this.load();
    }

    openInterpreationModal = () => {
        document.getElementById("backdrop").style.display = "block";
        document.getElementById("interpretation_modal").style.display = "block";
        document.getElementById("interpretation_modal").classList.add("show");
    };

    closeInterpreationModal = () => {
        document.getElementById("backdrop").style.display = "none";
        document.getElementById("interpretation_modal").style.display = "none";
        document.getElementById("interpretation_modal").classList.remove("show");
    };

    load = async () => {
        let lookUpData = await getLookUpDataFromAPI();
        // consoleLog("lookupvalue :::", lookUpData);

        let allServiceCategory = [],
            serviceTypeArr = [],
            allSourceType = [],
            allIndustryType = [];
        allServiceCategory = lookUpData.SERVICE_CATEGORY_TYPE;
        allServiceCategory.map((data) => {
            if (data.id === 60) {
                serviceTypeArr.push({
                    label: "I want to make a general enquiry",
                    value: data.id
                })
            } else {
                serviceTypeArr.push({
                    label: data.name,
                    value: data.id
                })
            }
        });
        lookUpData.SOURCE_TYPE.map((data) => {
            allSourceType.push({
                label: data.name,
                value: data.id
            })
        })
        lookUpData.INDUSTRY_TYPE.map((data) => {
            allIndustryType.push({
                label: data.name,
                value: data.id
            })
        })
        this.setState({
            serviceTypeArr: serviceTypeArr,
            allSourceType: allSourceType,
            allIndustryType: allIndustryType
        })
    }




    changeBusinessNameText = (e) => {
        // let obj = {};
        this.setState({
            businessName: e.target.value
        });
        // if (e.target.value === "") {
        //     obj = {
        //         businessName: ""
        //     }
        // } else {
        //     obj = {
        //         businessName: e.target.value
        //     }
        // }
        // this.getAllBusiness(obj);
    }

    changeBusinessNameSelect = (value) => {
        // consoleLog("Business Name ::", setBusinessArr);
        let clientId = "";
        if (setBusinessArr.length > 0) {
            setBusinessArr.map((data) => {
                if (data.label === value) {
                    // consoleLog("label", data.label)
                    // consoleLog("value", data.value)
                    clientId = data.value
                }
            })
        }
        this.setState({
            businessName: value,
            clientId: clientId
        });
    }

    getAllBusiness = async (obj) => {
        let arr = [];
        const res = await ApiCallClient("findBusinessName", obj);
        if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {

            const decodeData = Decoder.decode(res.data.payload);
            // consoleLog("ALl Business Data :", decodeData);

            if (decodeData.data && decodeData.data.length > 0) {
                arr = decodeData.data
            } else {
                arr = []
            }

            let brr = [];
            if (arr.length > 0) {
                arr.map((data) => {
                    brr.push({
                        label: data.clientName,
                        value: data.userId
                    })
                });
                // consoleLog("BRR:::", brr)
                setBusinessArr = brr;
            } else {
                brr = arr;
                setBusinessArr = arr;
            }
            this.setState({
                allBusinessName: brr,
                allClientDetails: arr
            })
        }

    }



    changePhone = (value, data, event, formattedValue) => {
        // consoleLog("Phone value::", data);
        // consoleLog("Event::", event);
        // consoleLog("Formatted Value ::", formattedValue);
        // consoleLog("Raw phone::", value.slice(data.dialCode.length))
        this.setState({
            phone: value,
            countryCode: data.dialCode,
            clientMobile: value.slice(data.dialCode.length)
        });
    }

    changeEmail = (e) => {
        this.setState({
            email: e.target.value
        });
    }

    changeFirstName = (e) => {
        this.setState({
            firstName: e.target.value
        });
    }

    changeLastName = (e) => {
        this.setState({
            lastName: e.target.value
        });
    }

    changeIndustryType = (data) => {
        // consoleLog("IndustryType data :: ", data)
        this.setState({
            industryType: data.value,
            selectedIndustryType: data
        });
    };


    changeServiceType = (data) => {
        // consoleLog("service Type value :", data.value)
        this.setState({
            serviceType: data.value,
            selectedServiceType: data
        });
        // if (data.value !== 48) {
        //     this.openInterpreationModal();
        // }


        // if (data.value === 45) {
        //     consoleLog("Open interpreataion modal")
        //     this.openInterpreationModal();
        // } else if (data.value === 46) {

        // } else if (data.value === 47) {

        // }
    };

    changeSourceType = (value) => {
        this.setState({
            sourceType: value.value,
            selectedSourceType: value
        })
    }

    changeAboutUsType = (data) => {
        this.setState({
            aboutUs: data.value,

        });
    };

    handleClose = () => {
        this.setState({
            open: false
        })
    }

    handleOpenTranslationModal = () => {
        this.setState({
            open: true
        })
    }


    onSubmit = async () => {



        let errorCounter = 0,
            validateFname = inputEmptyValidate(this.state.firstName),
            validateLname = inputEmptyValidate(this.state.lastName),
            validateEmail = inputEmptyValidate(this.state.email),
            validateMobile = inputEmptyValidate(this.state.clientMobile),
            validateBusinessName = inputEmptyValidate(this.state.businessName);

        if (!validateFname) {
            toast.error(AlertMessage.MESSAGE.REQ.FIRST_NAME_EMPTY);
            errorCounter++;
        } else if (!validateLname) {
            toast.error(AlertMessage.MESSAGE.REQ.LAST_NAME_EMPTY);
            errorCounter++;
        } else if (!validateEmail) {
            toast.error(AlertMessage.MESSAGE.REQ.EMAIL_EMPTY);
            errorCounter++;
        } else if (!validateMobile) {
            toast.error(AlertMessage.MESSAGE.REQ.EMPTY_PHONE);
            errorCounter++;
        } else if (!validateBusinessName) {
            toast.error(AlertMessage.MESSAGE.REQ.BUSINESS_NAME_EMPTY);
            errorCounter++;
        } else {
            if (errorCounter === 0) {
                let obj = {
                    clientId: this.state.clientId,
                    fname: this.state.firstName,
                    lname: this.state.lastName,
                    emailId: this.state.email,
                    countrycode: this.state.countryCode,
                    mobile: this.state.clientMobile,
                    businessName: this.state.businessName,
                    industrytype: this.state.industryType
                }


                const res = await ApiCallClient("addrequesterFromClientREQ", obj);
                if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                    res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                    const decodeData = Decoder.decode(res.data.payload);
                    // consoleLog("Add Requester Data :", decodeData);
                    if (decodeData.data.clientId) {
                        this.setState({
                            clientId: decodeData.data.clientId
                        })

                        if (this.state.serviceType === 45 || this.state.serviceType === 47) {
                            // consoleLog("1", this.state.serviceType)
                            this.openInterpreationModal()
                        } else if (this.state.serviceType === 46) {
                            // consoleLog("2", this.state.serviceType)
                            this.handleOpenTranslationModal();
                        } else {
                            this.reset();
                        }
                        toast.success("Client Created Successfully");

                    }
                } else {
                    toast.error(res.message);
                }
            }
        }
    }

    reset = () => {
        this.setState({
            industryType: '',
            serviceType: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: "1",
            countryCode: "",
            clientId: "",
            businessName: '',
            aboutUs: '',
            sourceType: "",
            selectedServiceType: {},
            selectedSourceType: {},
            selectedIndustryType: {
                label: "",
                value: ""
            },
            allBusinessName: [],
            allClientDetails: [],
            clientMobile: "",
        })

    }

    closeAll = () => {
        this.closeInterpreationModal();
        this.handleClose();
        this.setState({
            industryType: '',
            serviceType: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: "1",
            countryCode: "",
            clientId: "",
            businessName: '',
            aboutUs: '',
            sourceType: "",
            selectedServiceType: {},
            selectedSourceType: {},
            selectedIndustryType: {
                label: "",
                value: ""
            },
            allBusinessName: [],
            allClientDetails: [],
            clientMobile: "",
        })
    }

    onCompanyNameChange = (e) => {
        this.setState({
            companyName: e.target.value
        })

    }
    onOfficeChange = (e) => {
        this.setState({
            officeName: e.target.value
        })

    }
    onInfoChange = (e) => {
        this.setState({
            contactInfo: e.target.value
        })

    }

    onSubmitContactUS = async () => {
        let errorCount = 0;
        let validateCompanyName = inputEmptyValidate(this.state.companyName),
            validateOffice = inputEmptyValidate(this.state.officeName),
            validateContactInfo = inputEmptyValidate(this.state.contactInfo);

        if (validateCompanyName === false) {
            toast.error("Please enter company name!");
            errorCount++;
        } else if (validateOffice === false) {
            toast.error("Please enter office details!");
            errorCount++;
        } else if (validateContactInfo === false) {
            toast.error("Please enter contact info!");
            errorCount++;
        }

        if (errorCount === 0) {
            let obj = {
                companyName: this.state.companyName,
                office: this.state.officeName,
                contactInfo: this.state.contactInfo
            }

            let res = await ApiCall("insertClientContactUs", obj)
            if (
                res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
            ) {
                toast.success("Submitted Successfully");
                window.scrollTo(0, 0);
                this.setState({
                    contactName: "",
                    officeName: "",
                    contactInfo: ""
                })
            } else {
                toast.error("Error Occured")
            }
        }

    }


    render() {
        // styles for the select
        const customStyles = {
            control: (styles) => ({
                ...styles,
                backgroundColor: "white",
                boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                borderRadius: "5px",
                // height: 45,
                minHeight: 45
            }),
            option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                const color = "yellow";
                return {
                    ...styles,
                    color: isFocused ? "grey" : "white",
                    //   backgroundColor: isDisabled ? "red" : "white",
                    color: "#000",
                    cursor: isDisabled ? "not-allowed" : "default",
                };
            },
        };

        return (
            <React.Fragment>
                <ToastContainer hideProgressBar theme='colored' />
                <div className="bg-form2">
                    <div className="wrapper">
                        <header className="header-information grey">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <span><Link to="/login" className="request-quote-btn" style={{ marginLeft: "2%", textDecoration: "none" }}>Login</Link></span>
                                        {/* <a href="javascript:void(0)" className="request-quote-btn" style={{ textDecoration: "none" }}>Request Quote</a> */}
                                    </div>
                                </div>
                            </div>
                        </header>
                        <div className="cotact-information-row bg-form2">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="c-form-bx">
                                            <h3>Contact Us</h3>
                                            <div className="_fl frm">
                                                <input type="text" placeholder="Company Name" className="frm-field" value={this.state.companyName} onChange={this.onCompanyNameChange} />
                                            </div>
                                            <div className="_fl frm">
                                                <input type="text" value={this.state.officeName} placeholder="Offices" className="frm-field" onChange={this.onOfficeChange} />
                                            </div>
                                            <div className="_fl frm">
                                                <input type="text" value={this.state.contactInfo} placeholder="Contact Info" className="frm-field" onChange={this.onInfoChange} />
                                            </div>
                                            <div className="contact_submit_btn">
                                                <button className='btn btn-primary' style={{ marginTop: "30px", borderRadius: "10px" }} onClick={this.onSubmitContactUS}>Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="frm-right-app">
                                            <div className="lg-logo _fl text-center"><a href="#"><img src="images/logo2.jpg" /></a></div>
                                            <div className="frm-info _fl">
                                                <div className="frm-bx _fl">
                                                    <div className="row">
                                                        <div className="col-6 col-md-6">
                                                            <div className="frm-label">First Name*</div>
                                                            <input type="text" value={this.state.firstName} name="" placeholder="First Name*" className="frm4-field" onChange={this.changeFirstName} />
                                                        </div>
                                                        <div className="col-6 col-md-6">
                                                            <div className="frm-label">Last Name*</div>
                                                            <input type="text" value={this.state.lastName} name="" placeholder="Last Name*" className="frm4-field" onChange={this.changeLastName} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="frm-bx _fl">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="frm-label">Email*</div>
                                                            <input type="text" value={this.state.email} name="" placeholder="Email*" className="frm4-field" onChange={this.changeEmail} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="frm-bx _fl">
                                                    <div className="row">
                                                        <div className="frm-label">Phone*</div>
                                                        <div className="col-md-6">
                                                            <PhoneInput
                                                                country={'us'}
                                                                countryCodeEditable={false}
                                                                value={this.state.phone}
                                                                onChange={this.changePhone}
                                                            />
                                                            {/* <input type="text" value={this.state.phone} name="" placeholder="Phone*" className="frm4-field" onChange={this.changePhone} /> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="frm-bx _fl">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="frm-label">Business Name *</div>
                                                            {/* <Autocomplete
                                                                wrapperProps={{
                                                                    style: {
                                                                        display: "inline"
                                                                    }
                                                                }}
                                                                getItemValue={(item) => item.label}
                                                                items={setBusinessArr}
                                                                renderItem={(item, isHighlighted) =>
                                                                    <div style={{ background: isHighlighted ? '#00a0de' : 'white', padding: "5px", fontSize: "18px" }}>
                                                                        {item.label}
                                                                    </div>
                                                                }
                                                                menuStyle={{
                                                                    borderRadius: '3px',
                                                                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                                                                    background: 'rgba(255, 255, 255, 0.9)',
                                                                    padding: '2px 3px',
                                                                    fontSize: '90%',
                                                                    position: 'fixed',
                                                                    overflow: "auto",
                                                                    maxHeight: '50%',
                                                                    zIndex: "9999" // TODO: don't cheat, let it flow to the bottom
                                                                }}
                                                                // Added style in Autocomplete component
                                                                inputProps={{
                                                                    className: "frm4-field",
                                                                    placeholder: 'Business Name*'
                                                                }}
                                                                value={this.state.businessName}
                                                                onChange={(e) => this.changeBusinessNameText(e)}
                                                                onSelect={(val) => this.changeBusinessNameSelect(val)}
                                                            /> */}
                                                            <input type="text" value={this.state.businessName} name="" placeholder="Business Name" className="frm4-field" onChange={(e) => this.changeBusinessNameText(e)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="frm-bx _fl">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="frm-label">Industry Type *</div>
                                                            <Select
                                                                styles={customStyles}
                                                                options={this.state.allIndustryType}
                                                                placeholder="Industry Type*"
                                                                value={this.state.selectedIndustryType}
                                                                onChange={(value) => this.changeIndustryType(value)}
                                                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="frm-bx _fl">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="frm-label">Service Type *</div>
                                                            <Select
                                                                styles={customStyles}
                                                                options={this.state.serviceTypeArr}
                                                                placeholder="Select*"
                                                                value={this.state.selectedServiceType}
                                                                onChange={(value) => this.changeServiceType(value)}
                                                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="frm-bx _fl">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="frm-label">How did you hear about Us?</div>
                                                            <Select
                                                                styles={customStyles}
                                                                options={this.state.allSourceType}
                                                                placeholder="How did you hear about Us?"
                                                                value={this.state.selectedSourceType}
                                                                onChange={(value) => this.changeSourceType(value)}
                                                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <a href="javascript:void(0)" className="request-quote-btn" style={{ textDecoration: "none" }} onClick={() => this.onSubmit()} >Submit</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ..................modal................................. */}
                <div id="interpretation_modal" className="modal fade modelwindow" role="dialog">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        {/* <!-- Modal content--> */}
                        <div className="modal-content">

                            <div className="modal-body">
                                <div className="model-info f-model">
                                    {this.state.clientId !== "" ? <React.Fragment>
                                        {this.state.serviceType === 45 ?
                                            <InterpreationModal value={this.state} closeModal={this.closeAll} /> :
                                            <React.Fragment>
                                                {this.state.serviceType === 46 ? <React.Fragment>
                                                    {/* <TranslationModal value={this.state} closeModal={this.closeAll} /> */}
                                                </React.Fragment> :
                                                    <React.Fragment>
                                                        {this.state.serviceType === 47 ? <React.Fragment>
                                                            <TrainingModal value={this.state} closeModal={this.closeAll} />
                                                        </React.Fragment> : <React.Fragment>

                                                        </React.Fragment>
                                                        }
                                                    </React.Fragment>
                                                }
                                            </React.Fragment>
                                        }
                                    </React.Fragment> : <React.Fragment></React.Fragment>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="modal-backdrop fade show"
                    id="backdrop"
                    style={{ display: "none" }}
                >
                </div>



                <Modal
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                // className={classes.root}
                // sx={style.modalStyle1}
                >
                    <Box sx={style.boxStyle}>
                        {this.state.clientId !== "" ? <React.Fragment>
                            <TranslationModal value={this.state} closeModal={this.closeAll} />
                        </React.Fragment> : <React.Fragment></React.Fragment>}
                    </Box>
                </Modal>
            </React.Fragment>
        )
    }
}

export default ClientReq;
