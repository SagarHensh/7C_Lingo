import React, { Component } from "react";
import { styled, Box } from "@mui/system"; //imported for modal
import ModalUnstyled from "@mui/core/ModalUnstyled"; //imported forr modal
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput"; //for multidropdown
import ListItemText from "@mui/material/ListItemText"; //for multidropdown
import Checkbox from "@mui/material/Checkbox"; //for mutiselect checkbox
import IconButton from "@mui/material/IconButton";
import ArrowDownwardSharp from "@material-ui/icons/ArrowDownwardSharp"; //for menu icon
import Menu from "@mui/material/Menu";
import TextField from "@mui/material/TextField";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import history from "../../../../../history";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";

// ............................for Tabs.name..................
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
//.................css for textField.................
const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "green",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "green",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "grey",
    },
    "&:hover fieldset": {
      borderColor: "yellow",
    },
    "&.Mui-focused fieldset": {
      borderColor: "green",
    },
  },
});
//.................styled functions for decline modal.............
const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  width: 700,
  bgcolor: "white",
  border: "1px solid #000",
  borderRadius: "10px",
};
//.................styled functions for filter modal.............
const StyledFilterModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterBackdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const filterstyle = {
  width: 600,
  height: 380,
  bgcolor: "white",
  // border: "1px solid #000",
  borderRadius: "10px",
};

// ..........................................
// .................VALUES OF MULTISELECT..............................
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];
// ...............menuprops used for multi select..................
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
export default class VendorDocVerification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      age: 5, // dropdwn menu age
      value: "", //for tab value
      anchorEl: null, //menu button
      openModal: false, // open decline modal false
      openfilterModal: false, // open filter modal
      clientName: [], //FOR MULTISELECT client DROPDOWN
      docName: "",
      searchValue: "",
      activeTab1: true, //for tabs
      activeTab2: false,
      activeTab3: false,
      counter1: true,
      counter2: false,
      counter3: false,
      statusName: [], //
      listData: [
        {
          id: 1,
          documentName: "Independent contractor",
          lastModified: "13th March|2020",
          status: "pending",
        },
        {
          id: 2,
          documentName: "Workers Comp",
          lastModified: "13th March|2020",
          status: "pending",
        },
        {
          id: 3,
          documentName: "Camper",
          lastModified: "13th March|2020",
          status: "pending",
        },
      ],
      tempData: [
        {
          id: 1,
          documentName: "Independent contractor",
          lastModified: "13th March|2020",
          status: "pending",
        },
        {
          id: 2,
          documentName: "Workers Comp",
          lastModified: "13th March|2020",
          status: "pending",
        },
        {
          id: 3,
          documentName: "Camper",
          lastModified: "13th March|2020",
          status: "pending",
        },
      ],
    };
  }
  // ......................................
  onDocChange = (e) => {
    this.setState({
      docName: e.target.value,
    });
    let x = e.target.value;
    console.log("ball", this.state.tempData);
    let tempData = this.state.tempData;
    let queryResult = [];
    if (x === "") {
      console.log("11111", this.state.listData);
      this.setState({
        listData: tempData,
      });
    } else {
      this.state.tempData.forEach(function (item) {
        console.log("==>> ", queryResult);
        if (item.documentName.indexOf(x) != -1 || x === "") {
          queryResult.push(item);
        }
        console.log("query result ", queryResult);
      });
      this.setState({
        listData: queryResult,
      });
    }
  };
  searchFunc = (e) => {
    this.setState({
      searchValue: e.target.value,
    });
    let x = e.target.value;
    console.log("ball", this.state.tempData);
    let tempData = this.state.tempData;
    let queryResult = [];
    if (x === "") {
      console.log("11111", this.state.listData);
      this.setState({
        listData: tempData,
      });
    } else {
      this.state.tempData.forEach(function (item) {
        console.log("==>> ", queryResult);
        if (item.documentName.indexOf(x) != -1 || x === "") {
          queryResult.push(item);
        }
        console.log("query result ", queryResult);
      });
      this.setState({
        listData: queryResult,
      });
    }
  };
  //..............function for dropdownMenu..............
  handleMenuChange = (e) => {
    this.setState({
      age: e.target.value,
    });
  };
  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };
  //..............function for MenuButton close..............

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
    history.push("/vendorcontactdetails");
  };
  //................funct for menuBtn on click................
  menuBtnhandleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  //...................function for filter modal close......
  handleFilterModalClose = () => {
    this.setState({
      openfilterModal: false,
    });
  };
  //   ......................func for filter modal open...............
  handleFilterModalOpen = () => {
    this.setState({
      openfilterModal: true,
    });
  };

  handleClientChange = (event) => {
    const {
      target: { value },
    } = event;
    let personData = typeof value === "string" ? value.split(",") : value;

    this.setState({
      clientName: personData,
    });
  };
  //.................activate btn....................................

  activateBtn1 = () => {
    let count = 0;
    count++;
    if (count == 1) {
      console.log("clicked");
      this.setState({
        // activeTab1: !this.state.activeTab1,
        activeTab1: true,
        activeTab3: false,
        activeTab2: false,
        counter1: true,
        counter2: false,
        counter3: false,
      });
    } else {
      console.log("notclicked");
      this.setState({
        activeTab1: false,
        activeTab3: false,
        activeTab2: false,
        counter1: false,
        counter2: false,
        counter3: false,
      });
    }
  };
  activateBtn2 = () => {
    let count = 0;
    count++;
    if (count == 1) {
      this.setState({
        activeTab1: false,
        activeTab3: false,
        activeTab2: true,
        counter2: true,
        counter1: false,
        counter3: false,
      });
    } else {
      this.setState({
        activeTab1: false,
        activeTab3: false,
        activeTab2: false,
        counter2: false,
        counter2: false,
        counter3: false,
      });
    }
  };
  activateBtn3 = () => {
    let count = 0;
    count++;
    if (count == 1) {
      this.setState({
        activeTab1: false,
        activeTab3: true,
        activeTab2: false,
        counter2: false,
        counter1: false,
        counter3: true,
      });
    } else {
      this.setState({
        activeTab1: false,
        activeTab3: false,
        activeTab2: false,
        counter2: false,
        counter1: false,
        counter3: false,
      });
    }
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open
    //.............................mytab.........................

    const MyTab = styled((props) => <Tab disableRipple {...props} />)(
      ({ theme, props }) => ({
        textTransform: "none",
        minWidth: 0,
        [theme.breakpoints.up("sm")]: {
          minWidth: 0,
        },

        // fontWeight: theme.typography.fontWeightRegular,

        color: "rgba(0, 0, 0, 0.85)",
        fontFamily: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(","),
        "&:hover": {
          //   color: "#c5ad0eec",
          //   opacity: 1,
        },

        "&.Mui-selected": {
          color: "white",
          backgroundColor: "blue",
          //   fontWeight: theme.typography.fontWeightMedium,
        },
        "&.Mui-focusVisible": {
          backgroundColor: "#c5ad0eec",
        },
      })
    );

    return (
      <div>
        <Header />
        <Sidebar />
        <div className="content-wrapper">
          <section className="content-header">
            <h5>Verification Document</h5>
            <div
              className="container"
              style={{ border: "0.5px solid grey", borderRadius: "10px" }}
            >
              <div className="row">
                <div className="col-md-2" style={{ textAlign: "center" }}>
                  Document Name
                </div>
                <div className="col-md-3">
                  <CssTextField
                    // label="Custom CSS"
                    placeholder="search"
                    value={this.state.docName}
                    id="custom-css-outlined-input"
                    onChange={(e) => this.onDocChange(e)}
                  />
                </div>
                <div className="col-md-3"></div>
                <div
                  className="col-md-4"
                  style={{ marginTop: "0% !important" }}
                >
                  <CssTextField
                    // label="Custom CSS"
                    value={this.state.searchValue}
                    placeholder="search"
                    id="custom-css-outlined-input"
                    onChange={(e) => this.searchFunc(e)}
                  />
                </div>
              </div>

              <div className="row" style={{ marginTop: "20px" }}>
                <div className="col-md-5"></div>

                <div className="col-md-6">
                  <div className="mainTab">
                    <button
                      className={
                        this.state.activeTab1 ? "activeTab1" : "tabBtn1"
                      }
                      onClick={this.activateBtn1}
                    >
                      CONTRACTS
                    </button>
                    <button
                      className={
                        this.state.activeTab2 ? "activeTab2" : "tabBtn2"
                      }
                      onClick={this.activateBtn2}
                    >
                      IDENTIFICATION DOCS
                    </button>
                    <button
                      className={
                        this.state.activeTab3 ? "activeTab3" : "tabBtn3"
                      }
                      onClick={this.activateBtn3}
                    >
                      CONTINUED EDUCATION TRAINING
                    </button>
                  </div>
                </div>
                <div className="col-md-1"></div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-md-10"></div>
                <div className="col-md-2">
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <Select
                      value={this.state.age}
                      defaultValue=""
                      onChange={this.handleMenuChange}
                      displayEmpty
                      IconComponent={ArrowDownwardSharp} //for the icon
                      inputProps={{ "aria-label": "Without label" }}
                      //   MenuProps={{}}
                      style={{ height: "35px" }}
                    >
                      <MenuItem value="sam">
                        <em>0</em>
                      </MenuItem>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
            {/* ..............table........ */}
            {this.state.counter1 ? (
              <React.Fragment>
                <ul>
                  <li>
                    <div className="element">
                      <div className="vendorContracthead">
                        <div>Document Name</div>
                      </div>
                      <div className="vendorContracthead">
                        <div style={{ marginLeft: "2px" }}>
                          Last Modified On
                        </div>
                      </div>
                      <div className="vendorContracthead">
                        <div style={{ marginLeft: "2px" }}>status</div>
                      </div>
                      <div className="vendorheadaction">
                        <div style={{ marginLeft: "2px" }}>Action</div>
                      </div>
                    </div>
                  </li>
                </ul>

                <div>
                  <ul>
                    {this.state.listData.map((item, key) => (
                      <li key={key}>
                        <div className="elementBody ">
                          <div className="vendorbody">{item.documentName}</div>
                          <div className="vendorbody">{item.lastModified}</div>
                          <div className="vendorbody">
                            <div
                              className="vendorbody"
                              style={{ backgroundColor: "yellow" }}
                            >
                              {item.status}
                            </div>
                          </div>
                          <div className="vendorheadaction">
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "white",
                              }}
                              onClick={this.handleFilterModalOpen}
                            >
                              <img src="/assets/images/eye.png"></img>
                            </button>
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "white",
                              }}
                            >
                              <img src="/assets/images/close.png"></img>
                            </button>
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "white",
                              }}
                            >
                              <img src="/assets/images/righttick.png"></img>
                            </button>
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "white",
                              }}
                            >
                              <img src="/assets/images/download.png"></img>
                            </button>
                          </div>

                          {/* <div>John Doe</div> */}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment></React.Fragment>
            )}
            {/* ...........................Tab identification........................... */}
            {this.state.counter2 ? (
              <React.Fragment>
                <ul>
                  <li>
                    <div className="element">
                      <div className="vendorIdentifyhead">
                        <div>Document Name</div>
                      </div>
                      <div className="vendorIdentifyhead">
                        <div>Front Image</div>
                      </div>
                      <div className="vendorIdentifyhead">
                        <div>Back Image</div>
                      </div>
                      <div className="vendorIdentifyhead">
                        <div>Issuing Date</div>
                      </div>

                      <div className="vendorIdentifyhead">
                        <div>Expiration Date</div>
                      </div>

                      <div className="vendorIdentifyhead">
                        <div>status</div>
                      </div>
                      <div className="vendorIdentifyhead">
                        <div>Action</div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div>
                  <ul>
                    {this.state.listData.map((item, key) => (
                      <li key={key}>
                        <div className="elementBody ">
                          <div className="vendorIdentifybody">{item.id}</div>
                          <div className="vendorIdentifybody">sean</div>
                          <div className="vendorIdentifybody">paul</div>
                          <div className="vendorIdentifybody">sean</div>
                          <div className="vendorIdentifybody">paul</div>
                          <div className="vendorIdentifybody">
                            <div
                              className="statusBtn"
                              style={{ backgroundColor: "yellow" }}
                            >
                              pending
                            </div>
                          </div>

                          <div className="vendorIdentifybody">
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "white",
                              }}
                              onClick={this.handleFilterModalOpen}
                            >
                              <img
                                src="/assets/images/eye.png"
                                style={{ width: "25px" }}
                              ></img>
                            </button>
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "white",
                              }}
                            >
                              <img
                                src="/assets/images/close.png"
                                style={{ width: "25px" }}
                              ></img>
                            </button>
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "white",
                              }}
                            >
                              <img
                                src="/assets/images/righttick.png"
                                style={{ width: "25px" }}
                              ></img>
                            </button>
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "white",
                              }}
                            >
                              <img
                                src="/assets/images/download.png"
                                style={{ width: "25px" }}
                              ></img>
                            </button>
                          </div>

                          {/* <div>John Doe</div> */}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment></React.Fragment>
            )}
            {/* ...........................Tab Education Training........................... */}
            {this.state.counter3 ? (
              <React.Fragment>
                <ul>
                  <li>
                    <div className="element">
                      <div className="vendorEducationyhead">
                        <div>Document Name</div>
                      </div>
                      <div className="vendorEducationyhead">
                        <div>Issuing Organization</div>
                      </div>
                      <div className="vendorEducationyhead">
                        <div>Last Modified On</div>
                      </div>
                      <div className="vendorEducationyhead">
                        <div>Issuing Date</div>
                      </div>

                      <div className="vendorEducationyhead">
                        <div>Expiration Date</div>
                      </div>
                      <div className="vendorEducationyhead">
                        <div>Action</div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div>
                  <ul>
                    {this.state.listData.map((item, key) => (
                      <li key={key}>
                        <div className="elementBody ">
                          <div className="vendorEducationbody">Ata</div>
                          <div className="vendorEducationbody">Xyz</div>
                          <div className="vendorEducationbody">
                            13th March 2020
                          </div>
                          <div className="vendorEducationbody">
                            13th March 2020
                          </div>
                          <div className="vendorEducationbody">
                            13th March 2020
                          </div>

                          <div className="vendorEducationbody">
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "white",
                              }}
                              onClick={this.handleFilterModalOpen}
                            >
                              <img
                                src="/assets/images/eye.png"
                                style={{ width: "15px", margin: "0px" }}
                              ></img>
                            </button>
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "white",
                              }}
                            >
                              <img
                                src="/assets/images/close.png"
                                style={{ width: "15px", margin: "0px" }}
                              ></img>
                            </button>
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "white",
                              }}
                            >
                              <img
                                src="/assets/images/righttick.png"
                                style={{ width: "15px", margin: "0px" }}
                              ></img>
                            </button>
                            <button
                              style={{
                                border: "none",
                                backgroundColor: "white",
                              }}
                            >
                              <img
                                src="/assets/images/download.png"
                                style={{
                                  width: "15px",
                                  margin: "0px !important",
                                }}
                              ></img>
                            </button>
                          </div>

                          {/* <div>John Doe</div> */}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment></React.Fragment>
            )}
            {/* ...................document details modal................... */}

            <React.Fragment>
              <StyledFilterModal
                aria-labelledby="unstyled-modal-title"
                aria-describedby="unstyled-modal-description"
                open={this.state.openfilterModal}
                onClose={this.handleFilterModalClose}
                BackdropComponent={FilterBackdrop}
              >
                <Box sx={filterstyle}>
                  <div className="container modalverificationHead ">
                    <div className="row">
                      <div className="col-sm-4"></div>
                      <div className="col-sm-4">DOCUMENT DETAILS</div>

                      <div className="col-sm-2"></div>
                      <div className="col-sm-1">
                        <button
                          style={{ backgroundColor: "white", border: "none" }}
                          onClick={this.handleFilterModalClose}
                        >
                          <img src="/assets/images/close.png"></img>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="container filterbody">
                    <div className="row">
                      <div className="col-sm-4">Document Name:</div>
                      <div className="col-sm-4">NA</div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4">Issuing Date:</div>
                      <div className="col-sm-4">NA</div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4">Expiration Date:</div>
                      <div className="col-sm-4">NA</div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4">Status:</div>
                      <div className="col-sm-4">Verification Pending</div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4">Last Modified On:</div>
                      <div className="col-sm-6">Feb,15,2020 10:00 AM</div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4">Front Image:</div>
                      <div className="col-sm-6">
                        <img src="/assets/images/download.png"></img>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: "10%" }}>
                      <div className="modalverificationBtns">
                        <button
                          className="modalCancelBtn"
                          onClick={this.handleModalClose}
                        >
                          Exit
                        </button>
                        <button className="modalRejecttBtn">Reject</button>
                        <button className="modalApproveBtn">Approve</button>
                      </div>
                    </div>
                  </div>
                </Box>
              </StyledFilterModal>
            </React.Fragment>
          </section>
        </div>
      </div>
    );
  }
}
