import React, { Component } from "react";
import { styled, Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import { ToastContainer, toast } from "react-toastify";
import { ApiCall } from "../../../../../services/middleware";
import history from "../../../../../history";
import { InputText, SelectBox } from "../../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../../enums";
// import "./addClientContact.css";

import {
  alphaNumericValidator,
  courseFeeValidate,
  departmentValidator,
  emailValidator,
  inputEmptyValidate,
  mobileNumberValidator,
  nameRegexValidator,
  numberValidator,
  passwordValidator,
  zipValidate,
} from "../../../../../validators";
import { Regex } from "../../../../../services/config";
import { Decoder } from "../../../../../services/auth";
import {
  consoleLog,
  getLookUpDataFromAPI,
  phoneNumberCheck,
} from "../../../../../services/common-function";
import { ErrorCode } from "../../../../../services/constant";
import ReactLoader from "../../../../Loader";
import { IMAGE_URL } from "../../../../../services/config/api_url";
import axios from "axios";
import Select, { components } from "react-select";
import { Link } from "react-router-dom";


// .......................for react select icon.............................................

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={ImageName.IMAGE_NAME.LOCATION} style={{ width: "17px" }} />
    </components.DropdownIndicator>
  );
};


const statusArr = [
  {
    label: "Inactive",
    value: "0",
  },
  {
    label: "Active",
    value: "1",
  },
];

export default class AddStore extends Component {
  constructor(props) {
    super(props);
    this.state = {   
      // isLoad: true,
     
      storeName: "",
      storeTypeArr:[],
      selectedStoreTypeData:"",
      description:"",
      statusData:"",
      managerName:"",
      email: "",
      phone: "",
      address:"",
      countryCode: "1",
      storePhoto:"",
     
      imagePath: "images/profile-pic.png",
      locationData: {},
      locationArr: [],
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    let storeArr = [];

    let res =await ApiCall("getlookuplistbylookuptype",{ lookuptype:"STORE_TYPE"
  });
   let decodeData = Decoder.decode(res.data.payload);
  //  consoleLog("data:::",decodeData);
   let storeData = decodeData.data.lookupdata;

   storeData.map((obj) => {
     storeArr.push({
       label:obj.name,
       value:obj.id
     })
   })

    this.setState({     
      storeTypeArr:storeArr,
      phone: "+" + this.state.countryCode + " ",
      isLoad: false,
    });
  };

  // ...............for account info..........................
  onStoreNameChange = (value) => {
    
    let nameCheck = alphaNumericValidator(value);
    this.setState({
      storeName: nameCheck,
    });
  };
  onStoreTypeChange = (dat) => {
    let obj = {label:dat.label,value:dat.value}
    this.setState({
      selectedStoreTypeData:obj
    })

  }

  onDescriptionChange = (e) => {
    this.setState({
      description:e.target.value
    })
  }
  
 
  onEmailChange = (value) => {
    this.setState({
      email: value,
    });
  };
  onPhoneChange = (value) => {
    if (numberValidator(value) === true) {
      if (mobileNumberValidator(value) === true) {
        let phoneCheck = phoneNumberCheck(value);
        if (phoneCheck) {
          this.setState({
            phone: phoneCheck,
          });
        }
      }
    }
  };
  onManagerChange = (value) => {
    let nameCheck = alphaNumericValidator(value);
    this.setState({
      managerName: nameCheck,
    });
  }
 
  onStatusChange = (dat) => {
    // consoleLog(">>>>>>>>>>>>>>>>..", data);
    let obj = {label:dat.label,value:dat.value}
    this.setState({
      statusData: obj,
    });
  };


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
        // console.log("data:::::", locationData);
        for (let i = 0; i < locationData.length; i++) {
          arrData.push({
            label: locationData[i].description,
            value: locationData[i].placeid,
          });
        }

        this.setState({
          locationArr: arrData,
          locationData: val,
        });
      }
    }
  };

  onLocationChange = (value) => {
    // console.log("location value", value)
    this.setState({
      locationData: value,
    });
  };
  onAddressChange = (value) => {
    this.setState({
      address: value,
    });
  }

  

 
  onProfileImage = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios.post(IMAGE_URL, formData).then((res) => {
      // console.log(res.data.data);
      this.setState({
        imagePath: res.data.data.url,
        storePhoto: res.data.data.path + res.data.data.filename,
      });
      // this.onUpdate();
    });
  };
  onUpdate = async () => {
    // let mobileNo = this.state.phoneNumber.substring(3, 14).replace(/\s/g, "");
    let mobileNo = this.state.phone.substring(3, 14);
    let objData = {
      name:this.state.storeName,
    storeTypeId:this.state.selectedStoreTypeData.value,
    description:this.state.description,
    address:this.state.address,
    location:this.state.locationData.label,
    businessEmail:this.state.email,
    countryCode:this.state.countryCode,
    businessPhone:mobileNo,
    storeManager:this.state.managerName,
    status:this.state.statusData.value,
    storeLogo:this.state.storePhoto
    }
   
    let res = await ApiCall("modifyvendoraccount", objData);
  
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      toast.success(AlertMessage.MESSAGE.STORE.ADD_STORE_PHOTO, {
        hideProgressBar: true,
      });
    }
  };

  onNext = async () => {
    window.scrollTo(0, 0);
    let mobileNo = this.state.phone.substring(3, 15);
  
    let errorCount = 0;
    let validateStoreName = inputEmptyValidate(this.state.storeName);
    let validateStoreNameLength = departmentValidator(this.state.storeName);
    let validateStoreType = inputEmptyValidate(this.state.selectedStoreTypeData.value);
    let validateDescription = inputEmptyValidate(this.state.description);
    let validateLocation = inputEmptyValidate(this.state.locationData.value);
    let validateManagerName = inputEmptyValidate(this.state.managerName);
    let validateStorePhoto = inputEmptyValidate(this.state.storePhoto);
    let validateAddress = inputEmptyValidate(this.state.address);
    // let validateSupervisorDepartment = inputEmptyValidate(
    //   this.state.supervisorDepartmentData
    // );
    let validateStatus = inputEmptyValidate(this.state.statusData.value);
    let validateEmail = emailValidator(this.state.email);
    let validatePhone = inputEmptyValidate(mobileNo);
   
    if (validateStoreName === false) {
      toast.error(AlertMessage.MESSAGE.STORE.EMPTY_NAME, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateStoreNameLength === false) {
      toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateStoreType === false) {
      toast.error(AlertMessage.MESSAGE.STORE.EMPTY_STORE_TYPE, {
        hideProgressBar: true,
      });
      errorCount++;
    }  else if (validateDescription === false) {
      toast.error(AlertMessage.MESSAGE.STORE.EMPTY_DESCRIPTION, {
        hideProgressBar: true,
      });
      errorCount++;
    }  else if (validateLocation === false) {
      toast.error(AlertMessage.MESSAGE.STORE.EMPTY_LOCATION, {
        hideProgressBar: true,
      });
      errorCount++;
    }  else if (validateAddress === false) {
      toast.error(AlertMessage.MESSAGE.STORE.EMPTY_ADDRESS, {
        hideProgressBar: true,
      });
      errorCount++;
    } 
    else if (validateEmail.status === false) {
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
    } else if (validateManagerName === false) {
      toast.error(AlertMessage.MESSAGE.STORE.EMPTY_MANAGER_NAME, {
        hideProgressBar: true,
      });
      errorCount++;
    }else if (validateStatus === false) {
      toast.error(AlertMessage.MESSAGE.STORE.EMPTY_STATUS, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateStorePhoto === false) {
      toast.error(AlertMessage.MESSAGE.STORE.EMPTY_STORE_LOGO, {
        hideProgressBar: true,
      });
      errorCount++;
    }

    if (errorCount === 0) {
      let data = {
        name:this.state.storeName,
      storeTypeId:this.state.selectedStoreTypeData.value,
      description:this.state.description,
      address:this.state.address,
      location:this.state.locationData.label,
      businessEmail:this.state.email,
      countryCode:this.state.countryCode,
      businessPhone:mobileNo,
      storeManager:this.state.managerName,
      status:this.state.statusData.value,
      storeLogo:this.state.storePhoto
      }

      // consoleLog("&&&data::",data)

      let res = await ApiCall("insertStores",data);

      if (
          res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
          toast.success(AlertMessage.MESSAGE.STORE.ADD_STORE_SUCCESS);

          return history.push("/adminStoreList")
        }  else if (
            res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.INTERNAL_SERVER_ERROR
          ) {
            toast.error(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
          } else if(
            res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST){
              // consoleLog("email:::",ErrorCode.ERROR.ERROR_CODE.EMAIL_EXIST);

              toast.error(AlertMessage.MESSAGE.STORE.MANAGER_EXIST);
            }else if(
              res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
              res.respondcode === ErrorCode.ERROR.ERROR_CODE.DUPLICATE_DEPT){

              // consoleLog("manager:::",ErrorCode.ERROR.ERROR_CODE.DUPLICATE_DEPT);
                toast.error(AlertMessage.MESSAGE.EMAIL.EMAIL_EXIST);
              }
        
    }
  };

  // .....................func for cancel btn......................

  onCancel = () => {
    window.scrollTo(0, 0);
    return history.push("/adminStoreList");
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
        {/* <div className="wrapper">
        <Header /> */}
        <ToastContainer hideProgressBar theme="colored" />
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
              <Link to="/adminDashboard">Dashboard</Link> / <Link to="/adminStoreList">Store</Link> / Add Store
            </div>
          <h3 className="dcs">ADD NEW STORE</h3>
          <div className="row">
            <div className="col-md-9">
              <div className="department-component-app _fl sdw">
                <h3>STORE INFORMATION</h3>

                <div className="department-form">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Store Name *</span>
                        <InputText
                          placeholder=""
                          className="in-field2"
                          value={this.state.storeName}
                          onTextChange={(value) => {
                            this.onStoreNameChange(value);
                          }}
                        />
                      </div>
                    </div>
                   
                   
                  </div>
                </div>

                <div>
                  <div className="department-form">
                    <div className="row">

                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Store Type *</span>
                        <SelectBox
                                optionData={this.state.storeTypeArr}
                                value={this.state.selectedStoreTypeData}
                                placeholder="Select"
                                onSelectChange={(value) => {
                                  this.onStoreTypeChange(value);
                                }}
                              />
                      </div>
                    </div>
                    <div className="col-md-2"></div>
                      <div className="col-md-5">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Description *</span>
                          <textarea
                            placeholder=""
                            className="in-textarea min"
                            value={this.state.description}
                            onChange={(value) => {
                              this.onDescriptionChange(value);
                            }}
                            style={{
                              borderRadius: "10px",
                              maxHeight: "50px",
                              resize: "none",
                            }}
                          />
                          {/* </textarea> */}
                        </div>
                      </div>
                      
                      
                    </div>
                  </div>
                  <div className="department-form">
                    <div className="row">
                    <div className="col-md-5">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Location *</span>
                          <div className="tr-3">
                              <Select
                              options={this.state.locationArr}
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.locationData}
                              placeholder="Select"
                              onChange={(value) => this.onLocationChange(value)}
                              onInputChange={(value) => {
                                this.onLocationInputChange(value);
                              }}
                              styles={customStylesDropdown}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-2"></div>
                      <div className="col-md-5">
                      <div className="form_rbx">
                          <span className="">Address *</span>
                          <InputText
                            type="text"
                            placeholder=""
                            className="in-field2"
                            value={this.state.address}
                            onTextChange={(value) => {
                              this.onAddressChange(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="department-form">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="form_rbx">
                          <span className="">Business Email *</span>
                          <InputText
                            type="text"
                            placeholder=""
                            className="in-field2"
                            value={this.state.email}
                            onTextChange={(value) => {
                              this.onEmailChange(value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-2"></div>
                      <div className="col-md-5">
                        <div className="form_rbx">
                          {" "}
                          <span className="">Business Phone *</span>
                          <InputText
                            type="text"
                            placeholder=""
                            className="in-field2"
                            value={this.state.phone}
                            onTextChange={(value) => {
                              this.onPhoneChange(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                 
                    <div className="department-form">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="form_rbx">
                            <span className="">Store Manager *</span>
                            <InputText
                              type="text"
                              placeholder=""
                              className="in-field2"
                              value={this.state.managerName}
                              onTextChange={(value) => {
                                this.onManagerChange(value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-2"></div>
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Status *</span>
                            <div className="dropdwn">
                              <SelectBox
                                optionData={statusArr}
                                value={this.state.statusData}
                                placeholder="Select"
                                onSelectChange={(value) => {
                                  this.onStatusChange(value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>

                {/* ..................................................................... */}

                <div className="_button-style m30 _fl text-center">
                  <a
                    href="javascript:void(0)"
                    className="white-btn"
                    style={{ textDecoration: "none" }}
                    onClick={this.onCancel}
                  >
                    Back
                  </a>
                  <a
                    href="javascript:void(0)"
                    className="blue-btn"
                    style={{ textDecoration: "none", color: "#fff" }}
                    onClick={this.onNext}
                  >
                    Save
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="profile-pic-data">
                <div className="c-logo">
                  <img className="border_50_img" src={this.state.imagePath} />
                  <button className="pht">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={this.onProfileImage}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
