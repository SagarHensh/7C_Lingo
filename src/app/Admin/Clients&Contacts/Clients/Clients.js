import React, { Component } from "react";
import { styled, Box } from "@mui/system"; //imported for modal
import ModalUnstyled from "@mui/core/ModalUnstyled"; //imported forr modal
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput"; //for multidropdown
import ListItemText from "@mui/material/ListItemText"; //for multidropdown
import Checkbox from "@mui/material/Checkbox"; //for mutiselect checkbox
import Stack from "@mui/material/Stack";
import ArrowDownwardSharp from "@material-ui/icons/ArrowDownwardSharp"; //for menu icon
import Menu from "@mui/material/Menu";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import history from "../../../../history";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
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
// ................mui switch DesignServices...............
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
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
export default class Clients extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: "",
      searchValue: "",
      userclient: "",
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
          client: "JP Hospital",
          industryType: "HealthCare",
          email: "sagar@gmail.com",
          phone: "1-22222-334344",
          noOfJobs: "2",
          noOfContacts: "5",
          lastModified: "16th Sept|2020",
        },
        {
          id: 2,
          client: "JP Hospital",
          industryType: "HealthCare",
          email: "sagar@gmail.com",
          phone: "1-22222-334344",
          noOfJobs: "2",
          noOfContacts: "5",
          lastModified: "16th Sept|2020",
        },
        {
          id: 3,
          client: "JP Hospital",
          industryType: "HealthCare",
          email: "sagar@gmail.com",
          phone: "1-22222-334344",
          noOfJobs: "2",
          noOfContacts: "5",
          lastModified: "16th Sept|2020",
        },
        {
          id: 4,
          client: "JP Hospital",
          industryType: "HealthCare",
          email: "sagar@gmail.com",
          phone: "1-22222-334344",
          noOfJobs: "2",
          noOfContacts: "5",
          lastModified: "16th Sept|2020",
        },
      ],
      tempData: [
        {
          id: 1,
          client: "JP Hospital",
          industryType: "HealthCare",
          email: "sagar@gmail.com",
          phone: "1-22222-334344",
          noOfJobs: "2",
          noOfContacts: "5",
          lastModified: "16th Sept|2020",
        },
        {
          id: 2,
          client: "JP Hospital",
          industryType: "HealthCare",
          email: "sagar@gmail.com",
          phone: "1-22222-334344",
          noOfJobs: "2",
          noOfContacts: "5",
          lastModified: "16th Sept|2020",
        },
        {
          id: 3,
          client: "JP Hospital",
          industryType: "HealthCare",
          email: "sagar@gmail.com",
          phone: "1-22222-334344",
          noOfJobs: "2",
          noOfContacts: "5",
          lastModified: "16th Sept|2020",
        },
        {
          id: 4,
          client: "JP Hospital",
          industryType: "HealthCare",
          email: "sagar@gmail.com",
          phone: "1-22222-334344",
          noOfJobs: "2",
          noOfContacts: "5",
          lastModified: "16th Sept|2020",
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
  onNameChange = (e) => {
    this.setState({
      userclient: e.target.value,
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
        if (item.client.indexOf(x) != -1 || x === "") {
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
    history.push("/resetpassword");
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
  // .......................add new client.........................

  onAdd = () => {
    history.push("/addnewclient");
  };
  render() {
    const open = Boolean(this.state.anchorEl); //used in MenuButton open

    return (
      <div className="wrapper">
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
                <div className="col-md-1">Clients</div>
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
                <div className="col-md-1">Client</div>
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
                    <img
                      className=""
                      src="/assets_temp/images/filter.png"
                    ></img>
                  </button>
                  <p style={{ fontSize: 10, marginBottom: "0px !important" }}>
                    filter
                  </p>
                </div>
                <div className="col-md-2">
                  export
                  <img
                    className=""
                    src="/assets_temp/images/export.png"
                    style={{ width: "25px" }}
                  ></img>
                </div>
                <div className="col-md-2">
                  Add New
                  <img
                    className=""
                    src="/assets_temp/images/addBtn.png"
                    style={{ width: "25px" }}
                    onClick={this.onAdd}
                    style={{ cursor: "pointer" }}
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
                  <div className="clientsTableHead">
                    <div>Client Id</div>
                  </div>
                  <div className="clientsTableHead">
                    <div>Client</div>
                  </div>
                  <div className="clientsTableHead">
                    <div>Industry Type</div>
                  </div>

                  <div className="clientsTableHead">
                    <div>Bussiness Email</div>
                  </div>
                  <div className="clientsTableHead">
                    <div>Business Phone</div>
                  </div>
                  <div className="clientsTableHead">
                    <div>No of Jobs</div>
                  </div>
                  <div className="clientsTableHead">
                    <div>No of Contacts</div>
                  </div>
                  <div className="clientsTableHead">
                    <div>Last Modified On</div>
                  </div>
                  <div className="clientsTableHead">
                    <div>status</div>
                  </div>
                  <div className="clientsTableHead">
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
                      <div className="clientsTablebody">{item.id}</div>
                      <div className="clientsTablebody">{item.client}</div>
                      <div className="clientsTablebody">
                        {item.industryType}
                      </div>
                      <div className="clientsTablebody">{item.email}</div>
                      <div className="clientsTablebody">{item.phone}</div>
                      <div className="clientsTablebody">{item.noOfJobs}</div>
                      <div className="clientsTablebody">
                        {item.noOfContacts}
                      </div>

                      <div className="clientsTablebody">
                        {item.lastModified}
                      </div>
                      <div className="clientsTablebody">
                        <FormControl component="fieldset" variant="standard">
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
                      </div>

                      <div className="clientsTablebody">
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
                          <MenuItem>Edit</MenuItem>
                          <MenuItem onClick={this.handleClose}>
                            Reset Password
                          </MenuItem>
                          <MenuItem>View Jobs</MenuItem>
                          <MenuItem>View Projects</MenuItem>
                          <MenuItem>De-Activate or Activate</MenuItem>
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
