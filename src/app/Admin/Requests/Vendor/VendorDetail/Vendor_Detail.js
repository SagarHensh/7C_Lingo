import React, { Component } from "react";
import { styled, Box } from "@mui/system"; //imported for modal
import ModalUnstyled from "@mui/core/ModalUnstyled"; //imported forr modal
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput"; //for multidropdown
import ListItemText from "@mui/material/ListItemText"; //for multidropdown
import Checkbox from "@mui/material/Checkbox"; //for mutiselect checkbox

import ArrowDownwardSharp from "@material-ui/icons/ArrowDownwardSharp"; //for menu icon
import Menu from "@mui/material/Menu";
import TextField from "@mui/material/TextField";

import history from "../../../../../history";
import Header from "../../../Header/Header";
import Sidebar from "../../../Sidebar/Sidebar";
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
  width: 900,
  height: 600,
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
export default class Vendor_Detail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requests: "",
      searchValue: "",
      uname: "",
      emailId: "",
      mobileNo: "",
      age: 5, // dropdwn menu age
      anchorEl: null, //menu button
      openModal: false, // open decline modal false
      openfilterModal: false, // open filter modal
      clientName: [], //FOR MULTISELECT client DROPDOWN
      statusName: [], //
      listData: [
        {
          id: 1,
          type: "Agency",
          firstName: "sam",
          lastName: "mondal",
          email: "subha@gmail.com",
          phone: "1-22222-334344",
          status: "pending",
          service: "Interpretation,Translation",
        },
        {
          id: 2,
          type: "Agency",
          firstName: "ram",
          lastName: "mondal",
          email: "sagar@gmail.com",
          phone: "2-22222-334344",
          status: "pending",
          service: "Interpretation,Translation",
        },
        {
          id: 3,
          type: "Agency",
          firstName: "aam",
          lastName: "mondal",
          email: "sreya@gmail.com",
          phone: "3-22222-334344",
          status: "pending",
          service: "Interpretation,Translation",
        },
        {
          id: 4,
          type: "Agency",
          firstName: "John",
          lastName: "Greigh",
          email: "sukanta@gmail.com",
          phone: "4-22222-334344",
          status: "pending",
          service: "Interpretation,Translation",
        },
      ],
      tempData: [
        {
          id: 1,
          type: "Agency",
          firstName: "sam",
          lastName: "mondal",
          email: "subha@gmail.com",
          phone: "1-22222-334344",
          status: "pending",
          service: "Interpretation,Translation",
        },
        {
          id: 2,
          type: "Agency",
          firstName: "ram",
          lastName: "mondal",
          email: "sagar@gmail.com",
          phone: "2-22222-334344",
          status: "pending",
          service: "Interpretation,Translation",
        },
        {
          id: 3,
          type: "Agency",
          firstName: "aam",
          lastName: "mondal",
          email: "sreya@gmail.com",
          phone: "3-22222-334344",
          status: "pending",
          service: "Interpretation,Translation",
        },
        {
          id: 4,
          type: "Agency",
          firstName: "John",
          lastName: "Greigh",
          email: "sukanta@gmail.com",
          phone: "4-22222-334344",
          status: "pending",
          service: "Interpretation,Translation",
        },
      ],
    };
  }
  // ............................................

  onRequestChange = (e) => {
    this.setState({
      requests: e.target.value,
    });
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
        if (item.indexOf(x) != -1 || x === "") {
          queryResult.push(item);
        }
        console.log("query result ", queryResult);
      });
      this.setState({
        listData: queryResult,
      });
    }
  };
  onNameChange = (e) => {
    this.setState({
      uname: e.target.value,
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
        if (item.firstName.indexOf(x) != -1 || x === "") {
          queryResult.push(item);
        }
        console.log("query result ", queryResult);
      });
      this.setState({
        listData: queryResult,
      });
    }
  };
  onEmailChange = (e) => {
    this.setState({
      emailId: e.target.value,
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
        if (item.email.indexOf(x) != -1 || x === "") {
          queryResult.push(item);
        }
        console.log("query result ", queryResult);
      });
      this.setState({
        listData: queryResult,
      });
    }
  };
  onMobileChange = (e) => {
    this.setState({
      mobileNo: e.target.value,
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
        if (item.phone.indexOf(x) != -1 || x === "") {
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
  //...................function for decline modal close......
  handleModalClose = () => {
    this.setState({
      openModal: false,
    });
  };
  //   ......................func for decline modal open...............
  handleModalOpen = () => {
    this.setState({
      openModal: true,
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
  //...................function for filtermodal multiselect dropdown...........
  handleStatusChange = (event) => {
    const {
      target: { value },
    } = event;
    let personData = typeof value === "string" ? value.split(",") : value;

    this.setState({
      statusName: personData,
    });
  };
  handleClientChange = (event) => {
    const {
      target: { value },
    } = event;
    let personData = typeof value === "string" ? value.split(",") : value;
    console.log(">>>>>>>", personData);
    this.setState({
      clientName: personData,
    });
  };

  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open

    return (
      <div>
        <Header />
        <Sidebar />
        <div className="content-wrapper">
          <section className="content-header">
            <div
              className="container"
              style={{
                border: "0.5px solid grey",
                borderRadius: "10px",
                marginTop: "5%",
              }}
            >
              <div className="row">
                <div className="col-md-1">Requests</div>
                <div className="col-md-1">
                  <CssTextField
                    // label="Custom CSS"
                    value={this.state.requests}
                    id="custom-css-outlined-input"
                    style={{ width: "60px" }}
                    onChange={this.onRequestChange}
                  />
                </div>
                <div className="col-md-6"></div>
                <div
                  className="col-md-3"
                  style={{ marginTop: "0% !important" }}
                >
                  <CssTextField
                    // label="Custom CSS"
                    value={this.state.searchValue}
                    placeholder="search"
                    id="custom-css-outlined-input"
                    style={{ width: "120%" }}
                    onChange={this.searchFunc}
                  />
                </div>
              </div>

              <div className="row" style={{ marginTop: "20px" }}>
                <div className="col-md-1">Name</div>
                <div className="col-md-2">
                  <CssTextField
                    // label="Custom CSS"
                    value={this.state.uname}
                    placeholder="search"
                    id="custom-css-outlined-input"
                    onChange={this.onNameChange}
                  />
                </div>
                <div className="col-md-1"></div>
                <div className="col-md-1">Email Id</div>
                <div className="col-md-2">
                  <CssTextField
                    // label="Custom CSS"
                    value={this.state.emailId}
                    placeholder="search"
                    id="custom-css-outlined-input"
                    onChange={this.onEmailChange}
                  />
                </div>
                <div className="col-md-1"></div>
                <div className="col-md-1">Mobile No</div>
                <div className="col-md-3">
                  <CssTextField
                    // label="Custom CSS"
                    value={this.state.mobileNo}
                    placeholder="search"
                    id="custom-css-outlined-input"
                    onChange={this.onMobileChange}
                  />
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-md-5"></div>

                <div
                  className="col-md-1"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button onClick={this.handleFilterModalOpen}>
                    <img className="" src="/assets/images/filter.png"></img>
                  </button>
                  <p style={{ fontSize: 10, marginBottom: "0px !important" }}>
                    filter
                  </p>
                </div>
                <div className="col-md-2"></div>
                <div className="col-md-2">
                  Add New
                  <img
                    className=""
                    src="/assets/images/addBtn.png"
                    style={{ width: "25px" }}
                  ></img>
                </div>
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

            <ul>
              <li>
                <div className="element">
                  <div className="vendorDetailhead">
                    <div>Vendor Id</div>
                  </div>
                  <div className="vendorDetailhead">
                    <div>Type</div>
                  </div>
                  <div className="vendorDetailhead">
                    <div>First name</div>
                  </div>
                  <div className="vendorDetailhead">
                    <div>Last Name</div>
                  </div>
                  <div className="vendorDetailhead">
                    <div>Email Id</div>
                  </div>
                  <div className="vendorDetailhead">
                    <div>Phone No</div>
                  </div>
                  <div className="vendorDetailhead">
                    <div>Services Offered</div>
                  </div>
                  <div className="vendorDetailhead">
                    <div>Ratings</div>
                  </div>
                  <div className="vendorDetailhead">
                    <div>Availabilty</div>
                  </div>
                  <div className="vendorDetailhead">
                    <div>status</div>
                  </div>
                  <div className="vendorDetailhead">
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
                      <div className="vendorDetailbody">{item.id}</div>
                      <div className="vendorDetailbody">{item.type}</div>
                      <div className="vendorDetailbody">{item.firstName}</div>
                      <div className="vendorDetailbody">{item.lastName}</div>
                      <div className="vendorDetailbody">{item.email}</div>
                      <div className="vendorDetailbody">{item.phone}</div>
                      <div className="vendorDetailbody">{item.service}</div>
                      <div className="vendorDetailbody">
                        <img
                          src="/assets/images/bluestar.png"
                          style={{ width: "16px", margin: "0px !important" }}
                        ></img>
                        <img
                          src="/assets/images/bluestar.png"
                          style={{ width: "16px" }}
                        ></img>
                        <img
                          src="/assets/images/bluestar.png"
                          style={{ width: "16px" }}
                        ></img>
                        <img
                          src="/assets/images/bluestar.png"
                          style={{ width: "16px" }}
                        ></img>
                        <img
                          src="/assets/images/bluestar.png"
                          style={{ width: "16px" }}
                        ></img>
                      </div>
                      <div
                        className="vendorDetailbody"
                        style={{ textDecoration: "underline" }}
                      >
                        View
                      </div>
                      <div className="vendorDetailbody">
                        <div
                          className="statusBtn"
                          style={{ backgroundColor: "yellow", width: "65px" }}
                        >
                          {item.status}
                        </div>
                      </div>

                      <div className="vendorDetailbody">
                        <IconButton
                          id="basic-button"
                          aria-controls="basic-menu"
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={this.menuBtnhandleClick}
                          style={{ outline: "none" }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          id="basic-menu"
                          anchorEl={this.state.anchorEl}
                          open={open}
                          onClose={this.handleMenuClose}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                        >
                          <MenuItem onClick={this.handleClose}>
                            Edit Vendor Profile
                          </MenuItem>
                          <MenuItem onClick={this.handleClose}>
                            View Project
                          </MenuItem>
                          <MenuItem onClick={this.handleModalOpen}>
                            View Jobs
                          </MenuItem>
                        </Menu>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* ...................decline modal................... */}
            <StyledModal
              aria-labelledby="unstyled-modal-title"
              aria-describedby="unstyled-modal-description"
              open={this.state.openModal}
              onClose={this.handleModalClose}
              BackdropComponent={Backdrop}
            >
              <Box sx={style}>
                <div className="modalHead">
                  Reason To Decline
                  <img
                    className="closeImg"
                    src="/assets/images/close.png"
                    onClick={this.handleModalClose}
                  />
                </div>
                <div className="modalBody">
                  <div>
                    <textarea
                      rows="4"
                      cols="60"
                      style={{ borderRadius: "10px" }}
                    />
                  </div>
                  <div className="modalBtns">
                    <button
                      className="modalCancelBtn"
                      onClick={this.handleModalClose}
                    >
                      CANCEL
                    </button>
                    <button className="modalSubmitBtn">SUBMIT</button>
                  </div>
                </div>
              </Box>
            </StyledModal>
            {/* ...................filter modal................... */}
            <React.Fragment>
              <StyledFilterModal
                aria-labelledby="unstyled-modal-title"
                aria-describedby="unstyled-modal-description"
                open={this.state.openfilterModal}
                onClose={this.handleFilterModalClose}
                BackdropComponent={FilterBackdrop}
              >
                <Box sx={filterstyle}>
                  <div className="modalFilterHead">
                    <img src="/assets/images/filter.png" />

                    <div style={{ marginLeft: "10px" }}>FILTER BY</div>
                    <div className="headBtns">
                      <button className="resetBtn">
                        <img src="/assets/images/reset.png"></img>
                      </button>
                      <button className="applyBtn">
                        <img src="/assets/images/apply.png"></img>
                      </button>
                    </div>
                  </div>
                  <div className="container filterbody">
                    <div className="row">
                      <div className="col-md-3">REQUESTED ON</div>
                    </div>
                    <div className="row" style={{ marginTop: "10px" }}>
                      <div className="col-md-3">
                        <div className=" filtertoDate">
                          <div>FROM</div>

                          <input
                            type="text"
                            placeholder="dd-mm-yyyy"
                            style={{
                              textAlign: "center",
                              border: "none",
                              width: "100%",
                              outline: "none",
                            }}
                          />
                          <img
                            alt="calender"
                            src="/assets/images/calender.png"
                            height="25px"
                            width="25px"
                            className="calender_img"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="filtertoDate">
                          <div>TO</div>

                          <input
                            type="text"
                            placeholder="dd-mm-yyyy"
                            style={{
                              textAlign: "center",
                              border: "none",
                              width: "100%",
                              outline: "none",
                            }}
                          />
                          <img
                            alt="calender"
                            src="/assets/images/calender.png"
                            height="25px"
                            width="25px"
                            className="calender_img"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: "20px" }}>
                      <div className="col-sm-1">STATUS</div>
                      <div className="col-sm-5">
                        <FormControl sx={{ m: 1, width: 300 }}>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={this.state.statusName}
                            onChange={this.handleStatusChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(", ")}
                            MenuProps={MenuProps}
                          >
                            {names.map((name) => (
                              <MenuItem key={name} value={name}>
                                <Checkbox
                                  checked={
                                    this.state.statusName.indexOf(name) > -1
                                  }
                                />
                                <ListItemText primary={name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      <div className="col-sm-1">CLIENT</div>
                      <div className="col-sm-5">
                        <FormControl sx={{ m: 1, width: 300 }}>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={this.state.clientName}
                            onChange={this.handleClientChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(", ")}
                            MenuProps={MenuProps}
                          >
                            {names.map((name) => (
                              <MenuItem key={name} value={name}>
                                <Checkbox
                                  checked={
                                    this.state.clientName.indexOf(name) > -1
                                  }
                                />
                                <ListItemText primary={name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
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
