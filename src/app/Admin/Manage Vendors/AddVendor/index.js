import React, { Component } from "react";
import FormControl from "@mui/material/FormControl";
import { ToastContainer, toast } from "react-toastify";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import ReactLoader from "../../../Loader";
import "./vendorAdd.css";
import Multiselect from 'multiselect-react-dropdown';
import { emailValidator, inputEmptyValidate, mobileNumberValidator, numberValidator, passwordValidator } from "../../../../validators";
import { ApiCall } from "../../../../services/middleware";
import { Decoder } from "../../../../services/auth";
import { Link } from "react-router-dom";
import { AlertMessage, ImageName } from "../../../../enums";
import { consoleLog, getLookUpDataFromAPI, phoneNumberCheck, serviceSubType } from "../../../../services/common-function";
import { ThreeSixty } from "@material-ui/icons";
import history from "../../../../history";
import { VENDOR_SERVICE_OFFERED } from "../../../../services/config/api_url";
import axios from "axios";
import { ErrorCode } from "../../../../services/constant";
import { MultiSelectBox, SelectBox } from "../../SharedComponents/inputText";
import Select, { components } from "react-select";


// For Dropdown

const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <img src={ImageName.IMAGE_NAME.LOCATION} style={{ width: "17px" }} />
        </components.DropdownIndicator>
    );
};

export default class AddVendor extends Component {
    constructor(props) {
        super(props);
        // let mainData = this.props.location;
        // let preData = mainData.state;
        this.state = {
            isLoad: false,
            showId: 1,
            fname: "",
            lname: "",
            agencyName: "",
            email: "",
            type: "",
            phone: "",
            requestOn: "",
            serviceOffered: [],
            status: 0,
            hear: "",
            friendsName: "",

            vandorType: "9",
            subType: [],
            isAgency: false,
            allServices: [],
            selectedServiceType: [],
            allSources: [],
            selectedSources: {},
            source: "",
            allVendorType: [],
            allVendorServiceType: [],
            password: "",
            confirmPassword: "",
            isFriend: false,
            countryCode: 1,


            allServiceSubType: [],
            allCountry: [],
            selecetdCountry: {},
            country: "",
            locationData: [],
            locationArr: [],
            location: {},
            currentTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    componentDidMount() {

        this.getCountry();
        this.serviceSubType();
        this.load();

        this.setState({
            phone: "+" + this.state.countryCode + " "
        })
    }

    serviceSubType = () => {
        axios.post(VENDOR_SERVICE_OFFERED, {}).then(res => {

            let payload = Decoder.decode(res.data.data.payload)
            //  console.log("SubTypeRes", payload.data.services);

            this.setState({
                allServiceSubType: payload.data.services
            })

        })
    }

    load = async () => {
        let allServiceType = [],
            sourceArr = [];

        var lookUpData = await getLookUpDataFromAPI();
        // console.log("lookup",lookUpData);
        if (lookUpData.SERVICE_CATEGORY_TYPE.length > 0) {
            lookUpData.SERVICE_CATEGORY_TYPE.map((data) => {
                allServiceType.push({
                    label: data.name,
                    value: data.id
                })
            })
        }

        if (lookUpData.SOURCE_TYPE.length > 0) {
            lookUpData.SOURCE_TYPE.map((data) => {
                sourceArr.push({
                    label: data.name,
                    value: data.id
                })
            });
        }

        this.setState({
            allServices: allServiceType,
            allSources: sourceArr,
            allVendorType: lookUpData.VENDOR_TYPE,
            allVendorServiceType: lookUpData.VENDOR_SERVICE_TYPE,
        });
    }

    getCountry = async () => {
        let allCountry = [];
        let res = await ApiCall("getcountrylist");
        if (res.error === 0 && res.respondcode === 200) {
            let payload = Decoder.decode(res.data.payload);
            if (payload.data.countryInfo.length > 0) {
                payload.data.countryInfo.map((data) => {
                    allCountry.push({
                        label: data.name,
                        value: data.id,
                        cuntryCode: data.countrycode
                    })
                })
            }
            this.setState({
                allCountry: allCountry
            })
        }
    }

    vendorTypeChange = (e) => {
        // console.log("Vendor type:", e.target.value);
        this.setState({
            vandorType: e.target.value
        });
        if (e.target.value === "10") {
            this.setState({
                isAgency: true
            })
        } else {
            this.setState({
                isAgency: false
            })
        }
    }

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

    agencyNameChange = (e) => {
        this.setState({
            agencyName: e.target.value
        })
    }

    subTypeChange = (e) => {
        let arr = this.state.subType;
        if (e.target.checked) {
            arr.push(e.target.value);
        } else {
            if (arr.length > 0) {
                arr.map((data, i) => {
                    if (data === e.target.value) {
                        arr.splice(i, 1);
                    }
                })
            }
        }

        this.setState({
            subType: arr
        })
    }

    emailChange = (e) => {
        this.setState({
            email: e.target.value
        })
    }

    // onSelect = (selectedList, selectedItem) => {
    //     // console.log("Selected vsalue", selectedItem);
    //     let arr = this.state.serviceOffered;

    //     this.state.allServiceSubType.map((data) => {
    //         if (data.id === selectedItem.id) {
    //             let ad = {
    //                 id: selectedItem.id,
    //                 name: selectedItem.name,
    //                 subItem: data.subItem
    //             }
    //             arr.push(ad);
    //         }
    //     });
    //     // console.log("SErvice Offered:", arr);
    //     this.setState({
    //         serviceOffered: arr,
    //     });

    // }

    onChangeServiceType = (value) => {
        let arr = [];
        value.map((val) => {
            this.state.allServiceSubType.map((data) => {
                if (data.id === val.value) {
                    let ad = {
                        id: val.value,
                        name: val.label,
                        subItem: data.subItem
                    }
                    arr.push(ad);
                }
            });
        })
        this.setState({
            serviceOffered: arr,
            selectedServiceType: value
        })
    }

    // onRemove = (selectedList, removedItem) => {
    //     // console.log("selected after reemove", selectedList);
    //     let arr = [];
    //     for (let i = 0; i < selectedList.length; i++) {
    //         // arr.push(selectedList[i].id);
    //         this.state.allServiceSubType.map((data) => {
    //             if (data.id === selectedList[i].id) {
    //                 let ad = {
    //                     id: selectedList[i].id,
    //                     name: selectedList[i].name,
    //                     subItem: data.subItem
    //                 }
    //                 arr.push(ad);
    //             }
    //         });
    //     }
    //     // console.log("After Remove : ", arr)
    //     this.setState({
    //         serviceOffered: arr
    //     });
    // }


    onMobileChange = (e) => {
        if (numberValidator(e.target.value) === true) {
            if (mobileNumberValidator(e.target.value) === true) {
                let phoneCheck = phoneNumberCheck(e.target.value);
                if (phoneCheck) {
                    this.setState({
                        phone: phoneCheck
                    })
                }
            }
        }
    };

    onChangeCountry = (value) => {
        this.setState({
            country: value.value,
            selecetdCountry: value
        })
    }

    onChangeSource = (value) => {
        if (value.value === 16) {
            this.setState({
                source: value.value,
                selectedSources: value,
                isFriend: true
            });
        } else {
            this.setState({
                source: value.value,
                selectedSources: value,
                isFriend: false
            });
        }
    }

    onPasswordChange = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    onConfirmPasswordChange = (e) => {
        this.setState({
            confirmPassword: e.target.value
        })
    }

    onChangeFriendName = (e) => {
        this.setState({
            friendsName: e.target.value
        })
    }

    onLocationInputChange = async (val) => {
        // console.log(")))))))))))))))", val);
        let arrData = [];
        let locationData = [];

        if (val.length > 0) {
            let locationRes = await ApiCall("getlocaiondescription", {
                place: val,
            });
            if (
                locationRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                locationRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
            ) {
                let locationArr = Decoder.decode(locationRes.data.payload);
                locationData = locationArr.data.locaionsuggesion;
                // consoleLog("data:::::", locationData);
                for (let i = 0; i < locationData.length; i++) {
                    arrData.push({
                        label: locationData[i].description,
                        value: locationData[i].placeid,
                    });
                }

                this.setState({
                    locationArr: arrData,
                    location: val,
                });
            }
        }
    };

    onLocationChange = async (value) => {
        let obj = {
            placeid: value.value
        }
        // consoleLog("Get Coordinante from place id::", obj)
        let locationData = await ApiCall("getcoordinatefromplaceid", obj);
        if (locationData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && locationData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let locationArr = Decoder.decode(locationData.data.payload);
            let locateAdd = [];
            locateAdd.push({
                lat: locationArr.data.coordinatedetails[0].lat,
                long: locationArr.data.coordinatedetails[0].lng,
                locationName: value.label,
                locationId: value.value
            })
            // consoleLog("Location details::", locateAdd)
            this.setState({
                locationData: locateAdd,
            })
        }
        this.setState({
            location: value,
        });
    };

    onNext = async () => {
        let mobileNo = this.state.phone.substring(3, 15);
        let errorCount = 0;
        var countryCode = 0;
        this.state.allCountry.map((data) => {
            if (data.value === parseInt(this.state.country)) {
                countryCode = data.cuntryCode
            }
        })


        let validateFirstName = inputEmptyValidate(this.state.fname);
        let validateLastName = inputEmptyValidate(this.state.lname);
        let validateEmail = emailValidator(this.state.email);
        let validatePhone = inputEmptyValidate(mobileNo);
        let emptyPassword = inputEmptyValidate(this.state.password);
        let validatePassword = passwordValidator(this.state.password);
        let validateCpassword = inputEmptyValidate(this.state.confirmPassword);
        let emptyCountry = inputEmptyValidate(this.state.country);
        let validateAgencyName = inputEmptyValidate(this.state.agencyName);

        if (validateFirstName === false) {
            toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_FNAME, {
                hideProgressBar: true,
            });
            errorCount++;
        } else if (validateLastName === false) {
            toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_LNAME, {
                hideProgressBar: true,
            });
            errorCount++;
        } else if (this.state.isAgency && validateAgencyName === false) {
            toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_AGENCY_NAME, {
                hideProgressBar: true,
            });
            errorCount++;
        } else if (!this.state.isAgency && this.state.subType.length < 1) {
            toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_SUB_TYPE, {
                hideProgressBar: true,
            });
            errorCount++;
        } else if (Object.keys(this.state.locationData).length < 1) {
            toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_LOCATION);
            errorCount++;
        } else if (validateEmail.status === false) {
            toast.error(validateEmail.message, {
                hideProgressBar: true,
            });
            errorCount++;
        } else if (this.state.email.length > 50) {
            toast.error(AlertMessage.MESSAGE.EMAIL.MAX_EMAIL_LENGTH, {
                hideProgressBar: true,
            });
            errorCount++;
        } else if (validatePhone === false) {
            toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EMPTY, {
                hideProgressBar: true,
            });
            errorCount++;
        } else if (this.state.serviceOffered.length < 1) {
            toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_SERVICE, {
                hideProgressBar: true,
            });
            errorCount++;
        } else if (emptyCountry === false) {
            toast.error(AlertMessage.MESSAGE.COUNTRY.EMPTY_COUNTRY, {
                hideProgressBar: true,
            });
            errorCount++;
        } else if (emptyPassword === false) {
            toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_EMPTY, {
                hideProgressBar: true,
            });
        } else if (validatePassword.status === false) {
            toast.error(validatePassword.message, {
                hideProgressBar: true,
            });
            errorCount++;
        } else if (validateCpassword === false) {
            toast.error(AlertMessage.MESSAGE.PASSWORD.CNF_PASS_EMPTY, {
                hideProgressBar: true,
            });
            errorCount++;
        } else if (this.state.password !== this.state.confirmPassword) {
            toast.error(AlertMessage.MESSAGE.PASSWORD.PASSWORD_NOT_MATCH, {
                hideProgressBar: true,
            });
            errorCount++;
        } else if (this.state.source === "") {
            toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_HEAR, {
                hideProgressBar: true,
            });
            errorCount++;
        } else if (this.state.source === 16) {
            let emptyFriendsName = inputEmptyValidate(this.state.friendsName);
            if (emptyFriendsName === false) {
                toast.error(AlertMessage.MESSAGE.VENDOR.EMPTY_FRIEND_NAME, {
                    hideProgressBar: true,
                });
                errorCount++;
            }
        }

        if (errorCount === 0) {
            let objData = {
                vendorTypeId: this.state.vandorType.toString(),
                fName: this.state.fname,
                lName: this.state.lname,
                agencyName: this.state.agencyName,
                serviceAs: this.state.subType,
                email: this.state.email,
                serviceOffered: this.state.serviceOffered,
                countryId: this.state.country.toString(),
                mobile: mobileNo,
                sourceTypeId: this.state.source.toString(),
                password: this.state.password,
                additionalSource: this.state.friendsName,
                countryCode: countryCode.toString(),
                serviceAsName: "",
                vendorLocation: this.state.locationData,
                timeZone : this.state.currentTimeZone
            };

            // console.log("Final Submission Data>>>>", objData);

            let res = await ApiCall("createvendoraccount", objData);
            // let payload = Decoder.decode(res.data.payload);
            if (
                res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
            ) {
                toast.success(AlertMessage.MESSAGE.CREATE.SUCCESS, {
                    hideProgressBar: true,
                });
                return history.push("/adminVendorRegistration");
            }
            else {
                if (
                    res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
                    res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST
                ) {
                    toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_EXIST, {
                        hideProgressBar: true,
                    });
                } else if (
                    res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
                    res.respondcode === ErrorCode.ERROR.ERROR_CODE.PHONE_EXIST
                ) {
                    toast.error(AlertMessage.MESSAGE.MOBILE.MOBILE_EXIST, {
                        hideProgressBar: true,
                    });
                } else if (
                    res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
                    res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_PHONE_EXIST
                ) {
                    toast.error(AlertMessage.MESSAGE.EMAIL_MOBILE.DUBLICATE, {
                        hideProgressBar: true,
                    });
                }
            }
        }
    };

    render() {
        const customStylesDropdown = {
            control: (styles) => ({
                ...styles,
                backgroundColor: "white",
                boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                borderRadius: "10px",
                height: 45,
                minHeight: 45,
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
                {/* <div className="wrapper"> */}
                {/* <Header /> */}
                <ToastContainer hideProgressBar={true} theme="colored" />
                {/* <Sidebar /> */}
                <div class="component-wrapper" hidden={!this.state.isLoad}>
                    <ReactLoader />
                </div>
                <div className="component-wrapper" hidden={this.state.isLoad}>
                    <div
                        className="vn_frm"
                        style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
                    >
                        {" "}
                        <Link to="/adminDashboard">Dashboard</Link> / <Link to="/adminVendorList">Vendors</Link> / Add
                    </div>
                    <div className="department-component-app _fl sdw">
                        <h3>ADD VENDOR DETAILS</h3>
                        <div className="department-form">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form_rbx">
                                        <span class="">Vendor Type *</span>
                                        {this.state.allVendorType.map((data, i) =>
                                            <div class="check-field" key={i}>
                                                <label class="checkbox_btn">
                                                    <input type="radio" name="radio" value={data.id} defaultChecked={data.id == 9 ? true : false} onChange={this.vendorTypeChange} />
                                                    <span class="checkmark3"></span>
                                                    {data.name}
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="department-form">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">First Name *</span>
                                        <input type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.fname}
                                            onChange={this.firstNameChange}
                                        />
                                        <br />
                                        <br />
                                        <br />
                                        <div className="form_rbx">
                                            <span>
                                                Vendor Location
                                            </span>
                                            <div className="tr-3">
                                                <Select
                                                    options={this.state.locationArr}
                                                    components={{
                                                        DropdownIndicator,
                                                        IndicatorSeparator: () => null,
                                                    }}
                                                    value={this.state.location}
                                                    placeholder="Select"
                                                    onChange={(value) =>
                                                        this.onLocationChange(value)
                                                    }
                                                    onInputChange={(value) => {
                                                        this.onLocationInputChange(value);
                                                    }}
                                                    styles={customStylesDropdown}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Last Name *</span>
                                        <input type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.lname}
                                            onChange={this.lastNameChange}
                                        />
                                    </div>
                                </div>

                                {this.state.isAgency ?
                                    <div className="col-md-4">
                                        <div className="form_rbx">
                                            {" "}
                                            <span className="">Agency Name *</span>
                                            <input type="text"
                                                placeholder=""
                                                className="in-field2"
                                                value={this.state.agencyName}
                                                onChange={this.agencyNameChange}
                                            />
                                        </div>
                                    </div> :

                                    <div class="col-md-4">
                                        <div className="form_rbx">
                                            {" "}
                                            <span className="">Are you a/an *</span>
                                            <div class="multiple-option-check">
                                                {this.state.allVendorServiceType.map((data, i) =>
                                                    <div class="check-field" key={i}>
                                                        <label class="checkbox_btn">
                                                            <input type="checkbox" name="pp" value={data.id} onChange={this.subTypeChange} />
                                                            <span class="checkmark3"></span> {data.name}</label>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="department-form">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Email *</span>
                                        <input type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.email}
                                            onChange={this.emailChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Service(s) Offered *</span>
                                        <div class="dropdwn">
                                            {/* <Multiselect
                                                options={this.state.allServices} // Options to display in the dropdown
                                                // selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                                onSelect={this.onSelect} // Function will trigger on select event
                                                onRemove={this.onRemove} // Function will trigger on remove event
                                                displayValue="name" // Property name to display in the dropdown options
                                                showCheckbox
                                            /> */}
                                            <MultiSelectBox
                                                optionData={this.state.allServices}
                                                value={this.state.selectedServiceType}
                                                placeholder=""
                                                onSelectChange={(value) => {
                                                    this.onChangeServiceType(value);
                                                }}
                                            ></MultiSelectBox>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="department-form">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Phone Number *</span>
                                        <input type="text"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.phone}
                                            onChange={this.onMobileChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Country of Origin *</span>
                                        <div class="dropdwn">
                                            <SelectBox
                                                optionData={this.state.allCountry}
                                                value={this.state.selecetdCountry}
                                                placeholder=""
                                                onSelectChange={(value) => {
                                                    this.onChangeCountry(value);
                                                }}
                                            ></SelectBox>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="department-form">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Password *</span>
                                        <input type="password"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.password}
                                            onChange={this.onPasswordChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Confirm Password *</span>
                                        <input type="password"
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.confirmPassword}
                                            onChange={this.onConfirmPasswordChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="department-form">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">How did you hear about us ? *</span>
                                        <div class="dropdwn">
                                            <SelectBox
                                                optionData={this.state.allSources}
                                                value={this.state.selectedSources}
                                                placeholder=""
                                                onSelectChange={(value) => {
                                                    this.onChangeSource(value);
                                                }}
                                            ></SelectBox>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    {this.state.isFriend ?
                                        <div className="form_rbx" >
                                            {" "}
                                            <span className="">Friend's Name *</span>
                                            <input type="text"
                                                placeholder=""
                                                className="in-field2"
                                                value={this.state.friendsName}
                                                onChange={this.onChangeFriendName}
                                            />
                                        </div> : <React.Fragment></React.Fragment>}
                                </div>
                                <div className="col-md-4">

                                    <div className="web-form-bx">
                                        <div className="frm-label">
                                            Timezone
                                        </div>
                                        <div className="form-input-fields">
                                            <input
                                                type="text"
                                                placeholder="Enter notes here..."
                                                className="textbox4"
                                                style={{
                                                    borderRadius: "9px",
                                                    boxShadow:
                                                        "0px 0px 4px 0px rgb(0 0 0 / 20%)",
                                                }}
                                                value={this.state.currentTimeZone}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="department-form">
                            <div className="row">
                                <div className="col-md-4">

                                </div>
                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                </div>
                            </div>
                        </div>

                        <div className="_button-style m30 _fl text-center">
                            <Link
                                to="/adminVendorList"
                                className="white-btn"
                                style={{ textDecoration: "none" }}
                            // onClick={this.onCancel}
                            >
                                back
                            </Link>
                            <a
                                href="javascript:void(0)"
                                className="blue-btn"
                                style={{ textDecoration: "none", color: "#fff" }}
                                onClick={this.onNext}
                            >
                                submit
                            </a>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </React.Fragment>
        );
    }
}
