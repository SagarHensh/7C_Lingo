import React, { Component } from "react";
import { styled, Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import FormControl from "@mui/material/FormControl";
import { ToastContainer, toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";
import { ApiCall } from "../../../../services/middleware";
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import history from "../../../../history";
import { InputText } from "../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../enums";
import "./EditServiceCategory.css";
import {
  courseFeeValidate,
  departmentMobileValidator,
  departmentValidator,
  emailValidator,
  inputEmptyValidate,
  mobileNumberValidator,
  nameRegexValidator,
  numberValidator,
  passwordValidator,
} from "../../../../validators";
import { Regex } from "../../../../services/config";
import { Decoder } from "../../../../services/auth";
import { phoneNumberCheck } from "../../../../services/common-function";
import { ErrorCode } from "../../../../services/constant";
import ReactLoader from "../../../Loader";
import { Link } from "react-router-dom";

// .................mui switch...................................
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 68,
  height: 28,
  padding: 0,
  borderRadius: "15%/50%",
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 25,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(5px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(42px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#335b7b",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 16,
    height: 16,
    borderRadius: 8,
    color: "white",
    marginTop: 4,
    marginLeft: 2,
    // transition: theme.transitions.create(["width"], {
    //   duration: 200,
    // }
    // ),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255,255,255,.35)" : "#993921",
    boxSizing: "border-box",
  },
}));

export default class EditSeviceCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoad: true,
      checkStatus: false,

      serviceName: "",
      description: "",
      myStatus: 0,
    };
  }

  componentDidMount() {
    // let mainData = this.props.location;
    // let preData = mainData.state;

    // window.$(".myDropdown").ddslick();
    // window.$(".frm4-select").ddslick();
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    let mainData = this.props.location;
    let preData = mainData.state;
    let data = {
      id: preData.id,
    };
    let res = await ApiCall("fetchServiceDetails", data);
    let payload = Decoder.decode(res.data.payload);

    this.setState({
      serviceName: payload.data[0].name,
      description: payload.data[0].description,
      myStatus: payload.data[0].status,
      checkStatus: payload.data[0].status === 1 ? true : false,
      isLoad: false,
    });
    // } else {
    // }
  };
  // ...............for tabs..........................

  onServiceNameChange = (value) => {
    var pattern = new RegExp(Regex.STRING_NUMBER_REGEX);
    if (departmentValidator(value)) {
      if (pattern.test(value)) {
        this.setState({
          serviceName: value,
        });
      }
    }
  };

  onDescriptionChange = (e) => {
    this.setState({
      description: e.target.value,
    });
  };

  onStatusChange = (e) => {
    this.setState({
      checkStatus: !this.state.checkStatus,
    });
  };

  onNext = async () => {
    // let mobileNo = this.state.phone.substring(3, 14);
    let validateNameLength = departmentValidator(this.state.serviceName);
    let errorCount = 0;
    let validateName = inputEmptyValidate(this.state.serviceName);
    let validatedescription = inputEmptyValidate(this.state.description);

    if (validateName === false) {
      toast.error(AlertMessage.MESSAGE.SERVICE_CATEGORY.SERVICE_NAME_EMPTY, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validateNameLength === false) {
      toast.error(AlertMessage.MESSAGE.USER.MAX_NAME_LENGTH, {
        hideProgressBar: true,
      });
      errorCount++;
    } else if (validatedescription === false) {
      toast.error(
        AlertMessage.MESSAGE.SERVICE_CATEGORY.SERVICE_DESCRIPTION_EMPTY,
        {
          hideProgressBar: true,
        }
      );
      errorCount++;
    }

    if (errorCount === 0) {
      let mainData = this.props.location;
      let preData = mainData.state;
      let objData = {
        id: preData.id,
        name: this.state.serviceName,
        description: this.state.description,
        status: this.state.checkStatus ? "1" : "0",
      };

      let res = await ApiCall("updateService", objData);
      //   let payload = Decoder.decode(res.data.payload);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(AlertMessage.MESSAGE.CREATE.SUCCESS, {
          hideProgressBar: true,
        });
        window.setTimeout(() => {
          return history.push("/adminServiceCategory");
        }, 3000);
      }
      else {
        if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.DUPLICATE_DEPT
        ) {
          toast.error(
            AlertMessage.MESSAGE.SERVICE_CATEGORY.SERVICE_NAME_DUPLICATE,
            {
              hideProgressBar: true,
            }
          );
        }
      }
    }
    this.setState({
      isPublish: 0,
    });
  };

  onPublish = () => {
    this.setState({
      isPublish: 1,
    });
  };
  //................func for modal move......
  handleMoveModalOpen = () => {
    this.setState({
      opendepartmentModal: true,
    });
  };
  handleMoveModalClose = () => {
    this.setState({
      opendepartmentModal: false,
    });
  };

  onSaveDraft = () => { };
  // .....................func for cancel btn......................

  onCancel = () => {
    history.push("/adminServiceCategory");
  };

  render() {
    return (
      <React.Fragment>
        {/* <div className="wrapper">
        <Header /> */}
        <ToastContainer />
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
              <Link to="/adminDashboard">Dashboard</Link> / <Link to="/adminServiceCategory">Service Category</Link> / Edit 
            </div>
          <h3 class="dcs">Edit Details</h3>
          <div className="department-component-app _fl sdw">
            <h3 className="heading">SERVICE DETAILS</h3>
            <div className="department-form">
              <div className="row">
                <div className="col-md-10">
                  <div className="form_rbx">
                    <span className="">Service Name *</span>
                    {/* <InputText
                      type="text"
                      placeholder="Steve"
                      className="in-field2"
                      value={this.state.uname}
                      onChange={(e) => this.onNameChange(e)}
                    /> */}
                    <InputText
                      placeholder=""
                      value={this.state.serviceName}
                      onTextChange={(value) => {
                        this.onServiceNameChange(value);
                      }}
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
                    <span className="">Description *</span>
                    <textarea
                      rows="2"
                      placeholder=""
                      className="in-textarea msg min"
                      value={this.state.description}
                      style={{
                        height: "100px",
                        color: "var(--grey)",
                        borderRadius: "10px",
                        boxShadow: "2px",
                        resize: "none",
                      }}
                      onChange={this.onDescriptionChange}
                    ></textarea>
                  </div>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-1">
                  <div className="form_rbx">
                    {" "}
                    <span className="">Status</span>
                    <FormControl component="fieldset" variant="standard">
                      <Stack direction="row" spacing={1} alignItems="center">
                        {this.state.checkStatus ? (
                          <AntSwitch
                            checked={true}
                            inputProps={{
                              "aria-label": "ant design",
                            }}
                            name="active"
                            onClick={() => this.onStatusChange()}
                          />
                        ) : (
                          <AntSwitch
                            checked={false}
                            inputProps={{
                              "aria-label": "ant design",
                            }}
                            name="active"
                            onClick={() => this.onStatusChange()}
                          />
                        )}
                      </Stack>
                    </FormControl>
                  </div>
                </div>
                <div className="col-md-1 status_btn">
                  <div className="status_text">
                    {this.state.checkStatus ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            </div>

            <div className="_button-style m30 _fl text-center">
              <a
                className="white-btn"
                style={{ textDecoration: "none", color: "grey" }}
                onClick={this.onCancel}
              >
                CANCEL
              </a>
              <a
                className="blue-btn"
                style={{ textDecoration: "none", color: "white", width: "10%" }}
                onClick={this.onNext}
              >
                UPDATE
              </a>
            </div>
          </div>
        </div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}
