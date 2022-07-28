import React, { Component } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { styled, Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import FormHelperText from "@mui/material/FormHelperText";
import ArrowDownwardSharp from "@material-ui/icons/ArrowDownwardSharp"; //for menu icon
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import history from "../../../../history";

// .................mui switch...................................
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 18,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 25,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor:
          theme.palette.mode === "dark" ? "#177ddc" : "#900C3F  ",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    // transition: theme.transitions.create(["width"], {
    //   duration: 200,
    // }
    // ),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

export default class AddNewClient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      client: "",
      industry: "",
      emailId: "",
      phoneNo: "",
      website: "",
      fax: "",

      validateMsgclientname: "",
      validateMsgindustry: "",
      validateMsgemailId: "",
      validateMsgphoneNo: "",
      validateMsgwebsite: "",
      validateMsgfax: "",

      validateclientName: false,
      validateemailId: false,
      validatephoneNo: false,
      validatewebsite: false,
      validatefax: false,
    };
  }
  onClientChange = (e) => {
    this.setState({
      client: e.target.value,
      validateMsgclientname: "",
      validateclientName: true,
    });
  };
  handleIndustyMenuChange = (e) => {
    this.setState({
      industry: e.target.value,
    });
  };
  onEmailChange = (e) => {
    this.setState({
      emailId: e.target.value,
      validateMsgemailId: "",
      validateemailId: true,
    });
  };
  onMobileChange = (e) => {
    this.setState({
      phoneNo: e.target.value,
      validateMsgphoneNo: "",
      validatephoneNo: true,
    });
  };
  onWebsiteChange = (e) => {
    this.setState({
      website: e.target.value,
      validateMsgwebsite: "",
      validatewebsite: true,
    });
  };
  onFaxChange = (e) => {
    this.setState({
      fax: e.target.value,
      validateMsgfax: "",
      validatefax: true,
    });
  };

  onNext = () => {
    if (this.state.client.length === 0) {
      this.setState({
        validateclient: true,
        validateMsgclientname: "please enter client Name",
      });
    } else if (this.state.emailId.length === 0) {
      this.setState({
        validateemailId: true,
        validateMsgemailId: "please enter Email Id",
      });
    } else if (this.state.phoneNo.length === 0) {
      this.setState({
        validatephoneNo: true,
        validateMsgphoneNo: "please enter Phone no.",
      });
    } else if (this.state.website.length === 0) {
      this.setState({
        validatewebsite: true,
        validateMsgwebsite: "please enter website",
      });
    } else if (this.state.fax.length === 0) {
      this.setState({
        validatefax: true,
        validateMsgfax: "please enter fax no",
      });
    } else {
      history.push("/addnewclienttwo");
    }
  };

  render() {
    return (
      <div className="wrapper">
        <Header />
        <Sidebar />
        <div className="content-wrapper">
          <section className="content-header">
            <div className="mainHead">
              <div className="departmentDetails">
                <div className="clientDetailHead">ACCOUNT INFORMATION</div>
                <div className="clientDetailsBody">
                  <div className="container">
                    <div className="row">
                      <div className="col-sm-6">
                        <TextField
                          label="Client"
                          id="standard"
                          value={this.state.client}
                          placeholder="7C"
                          size="Normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(e) => this.onClientChange(e)}
                          variant="standard"
                        />
                        {this.state.validateclientName == false ? (
                          <span className="errMsg"></span>
                        ) : (
                          <span className="errMsg">
                            {" "}
                            {this.state.validateMsgclientname}
                          </span>
                        )}

                        {/* ............................................... */}
                      </div>
                      <div className="col-sm-6">
                        <div className="customrow">
                          <span className="spanTitle">Industry type</span>
                          <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Select
                              value={this.state.industry}
                              defaultValue=""
                              onChange={this.handleIndustyMenuChange}
                              displayEmpty
                              IconComponent={ArrowDownwardSharp} //for the icon
                              inputProps={{ "aria-label": "Without label" }}
                              //   MenuProps={{}}
                              style={{ height: "35px", width: "300px" }}
                            >
                              <MenuItem value="">
                                <em>select industry type</em>
                              </MenuItem>
                              <MenuItem value={1}>1</MenuItem>
                              <MenuItem value={2}>2</MenuItem>
                              <MenuItem value={3}>3</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <TextField
                          label="Business Email"
                          id="standard"
                          value={this.state.emailId}
                          placeholder="subha@gmail.com"
                          size="Normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(e) => this.onEmailChange(e)}
                          variant="standard"
                        />
                        {this.state.validateemailId == false ? (
                          <span className="errMsg"></span>
                        ) : (
                          <span className="errMsg">
                            {" "}
                            {this.state.validateMsgemailId}
                          </span>
                        )}

                        {/* ............................................... */}
                      </div>
                      <div className="col-sm-6">
                        <TextField
                          label="Business Phone"
                          id="standard"
                          value={this.state.phoneNo}
                          placeholder="1-555-4556546"
                          size="Normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(e) => this.onMobileChange(e)}
                          variant="standard"
                        />
                        {this.state.validatephoneNo == false ? (
                          <span className="errMsg"></span>
                        ) : (
                          <span className="errMsg">
                            {" "}
                            {this.state.validateMsgphoneNo}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <TextField
                          label="Website"
                          id="standard"
                          value={this.state.website}
                          placeholder="sam@google.com"
                          size="Normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(e) => this.onWebsiteChange(e)}
                          variant="standard"
                        />
                        {this.state.validatewebsite == false ? (
                          <span className="errMsg"></span>
                        ) : (
                          <span className="errMsg">
                            {" "}
                            {this.state.validateMsgwebsite}
                          </span>
                        )}

                        {/* ............................................... */}
                      </div>
                      <div className="col-sm-6">
                        <TextField
                          label="Fax"
                          id="standard"
                          value={this.state.fax}
                          placeholder="123444566"
                          size="Normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(e) => this.onFaxChange(e)}
                          variant="standard"
                        />
                        {this.state.validatefax == false ? (
                          <span className="errMsg"></span>
                        ) : (
                          <span className="errMsg">
                            {" "}
                            {this.state.validateMsgfax}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="customrow">
                          <span>Status</span>
                          <div>
                            <FormControl
                              component="fieldset"
                              variant="standard"
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <AntSwitch
                                  defaultChecked
                                  inputProps={{ "aria-label": "ant design" }}
                                  //   checked={this.state.switch}
                                  //   onChange={(e) => this.handleSwitchChange(e)}
                                  name="active"
                                />
                              </Stack>
                              <FormHelperText>Active</FormHelperText>
                            </FormControl>
                            <span>active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4"></div>
                      <div className="col-sm-4" style={{ marginTop: "5%" }}>
                        <button
                          className="declineBtn"
                          style={{ marginRight: "10px" }}
                        >
                          CANCEL
                        </button>
                        <button
                          className="departmentSubmitBtn"
                          onClick={this.onNext}
                        >
                          NEXT
                        </button>
                      </div>
                      <div className="col-sm-4"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="imageDiv">
                <img src="/assets_temp/images/Group 313.png"></img>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
