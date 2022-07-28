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
export default class Client_Request_contact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputData: 1,
      current_page: 1,
      total_page: 10,
      records_per_page: 2,
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
      mainList: [], //for assign list data
      listData: [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "subha@gmail.com",
          clientName: "jp hospital",
          phoneNo: "1-5555-666666",
          requestOn: "13-march-2020",
          declinedBy: "John Doe",
        },
        {
          id: 2,
          firstName: "Sam",
          lastName: "Doe",
          email: "subha@gmail.com",
          clientName: "jp hospital",
          phoneNo: "1-5555-666666",
          requestOn: "13-march-2020",
          declinedBy: "John Doe",
        },
        {
          id: 3,
          firstName: "Nick",
          lastName: "Doe",
          email: "subha@gmail.com",
          clientName: "jp hospital",
          phoneNo: "1-5555-666666",
          requestOn: "13-march-2020",
          declinedBy: "John Doe",
        },
        {
          id: 4,
          firstName: "Bella",
          lastName: "Doe",
          email: "subha@gmail.com",
          clientName: "jp hospital",
          phoneNo: "1-5555-666666",
          requestOn: "13-march-2020",
          declinedBy: "John Doe",
        },
        {
          id: 5,
          firstName: "John",
          lastName: "Doe",
          email: "subha@gmail.com",
          clientName: "jp hospital",
          phoneNo: "1-5555-666666",
          requestOn: "13-march-2020",
          declinedBy: "John Doe",
        },
      ],
      tempData: [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "subha@gmail.com",
          clientName: "jp hospital",
          phoneNo: "1-5555-666666",
          requestOn: "13-march-2020",
          declinedBy: "John Doe",
        },
        {
          id: 2,
          firstName: "Sam",
          lastName: "Doe",
          email: "subha@gmail.com",
          clientName: "jp hospital",
          phoneNo: "1-5555-666666",
          requestOn: "13-march-2020",
          declinedBy: "John Doe",
        },
        {
          id: 3,
          firstName: "Nick",
          lastName: "Doe",
          email: "subha@gmail.com",
          clientName: "jp hospital",
          phoneNo: "1-5555-666666",
          requestOn: "13-march-2020",
          declinedBy: "John Doe",
        },
        {
          id: 4,
          firstName: "Bella",
          lastName: "Doe",
          email: "subha@gmail.com",
          clientName: "jp hospital",
          phoneNo: "1-5555-666666",
          requestOn: "13-march-2020",
          declinedBy: "John Doe",
        },
        {
          id: 5,
          firstName: "John",
          lastName: "Doe",
          email: "subha@gmail.com",
          clientName: "jp hospital",
          phoneNo: "1-5555-666666",
          requestOn: "13-march-2020",
          declinedBy: "John Doe",
        },
      ],
    };
  }

  // ...................
  componentDidMount() {
    // for (let i = 0; i < length; i++) {}
  }
  // .......................................
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
        if (item.phoneNo.indexOf(x) != -1 || x === "") {
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
    history.push("/clientcontactdetails");
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

    this.setState({
      clientName: personData,
    });
  };
  // .............pagination function..........
  clickChange = (e) => {
    this.setState({
      current_page: e.target.value,
    });
  };
  exLeft = () => {
    this.setState({
      current_page: 1,
    });
  };
  exRigth = () => {
    let totalPage = this.state.total_page;
    this.setState({
      current_page: totalPage,
    });
  };
  prev = () => {
    let currentPage = this.state.current_page;
    if (currentPage > 1) {
      currentPage--;
      this.setState({
        current_page: currentPage,
      });
      // this.changePage(currentPage);
    }
  };
  next = () => {
    let currentPage = this.state.current_page;
    let totalPage = this.state.total_page;
    // if (currentPage < this.numPages) {
    if (currentPage < totalPage) {
      currentPage++;
      this.setState({
        current_page: currentPage,
      });
      // this.changePage(currentPage);
    }
    console.log("Dddd");
  };
  numPages = () => {
    let dataLength = this.state.listData.length;
    return Math.ceil(dataLength / this.state.records_per_page);
  };

  // changePage = (page) => {
  //   let data = this.state.listData;
  //   let btn_next = document.getElementById("btn_next");
  //   let btn_prev = document.getElementById("btn_prev");
  //   var listing_table = document.getElementById("listingTable");
  //   var page_span = document.getElementById("page");
  //   listing_table.innerHTML = "";
  //   if (page < 1) {
  //     page = 1;
  //   }
  //   if (page > this.numPages) {
  //     page = this.numPages;
  //   }
  //   for (
  //     var i = (page - 1) * this.state.records_per_page;
  //     i < page * this.state.records_per_page;
  //     i++
  //   ) {
  //     listing_table.innerHTML += data[i] + "<br>";
  //   }
  //   page_span.innerHTML = page;
  // };

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
              style={{ border: "0.5px solid grey", borderRadius: "10px" }}
            >
              <div className="row">
                <div className="col-md-1">Requests</div>
                <div className="col-md-1">
                  <CssTextField
                    // label="Custom CSS"
                    value={this.state.requests}
                    id="custom-css-outlined-input"
                    style={{ width: "60px" }}
                    onChange={(e) => this.onRequestChange(e)}
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
                    onChange={(e) => this.searchFunc(e)}
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
                    onChange={(e) => this.onNameChange(e)}
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
                    onChange={(e) => this.onEmailChange(e)}
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
                    onChange={(e) => this.onMobileChange(e)}
                  />
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-md-1" style={{ textAlign: "center" }}>
                  <img
                    className=""
                    src="/assets/images/filter.png"
                    onClick={this.handleFilterModalOpen}
                    style={{ cursor: "pointer" }}
                  ></img>

                  <p style={{ fontSize: 10 }}>filter</p>
                </div>
                <div className="col-md-2">
                  <div className="paginate">
                    <button onClick={this.exLeft} style={{ border: "none" }}>
                      {"<<"}
                    </button>
                    <button
                      id="prevBtn"
                      onClick={this.prev}
                      style={{ border: "none" }}
                    >
                      {"<"}
                    </button>
                    <input
                      type="number"
                      value={this.state.current_page}
                      onChange={(e) => this.clickChange(e)}
                      className="paginateInput"
                      id="page"
                    />
                    <button
                      id="nextBtn"
                      onClick={this.next}
                      style={{ border: "none" }}
                    >
                      {">"}
                    </button>
                    <button onClick={this.exRigth} style={{ border: "none" }}>
                      {">>"}
                    </button>
                  </div>
                </div>
                <div className="col-md-7"></div>
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
              <div className="element">
                <div className="clienttableHead">
                  <div className="btns">
                    <button className="arrowBtn">
                      <img
                        src="/assets/images/carrot_arrow_up.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                    <button className="arrowBtn">
                      {" "}
                      <img
                        src="/assets/images/carrot_arrow_down.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                  </div>
                  <div style={{ marginLeft: "2px" }}>ClientId</div>
                </div>
                <div className="clienttableHead">
                  <div className="btns">
                    <button className="arrowBtn">
                      <img
                        src="/assets/images/carrot_arrow_up.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                    <button className="arrowBtn">
                      {" "}
                      <img
                        src="/assets/images/carrot_arrow_down.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                  </div>
                  <div style={{ marginLeft: "2px" }}>First name</div>
                </div>
                <div className="clienttableHead">
                  <div className="btns">
                    <button className="arrowBtn">
                      <img
                        src="/assets/images/carrot_arrow_up.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                    <button className="arrowBtn">
                      {" "}
                      <img
                        src="/assets/images/carrot_arrow_down.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                  </div>
                  <div style={{ marginLeft: "2px" }}>Last name</div>
                </div>
                <div className="clienttableHead">
                  <div className="btns">
                    <button className="arrowBtn">
                      <img
                        src="/assets/images/carrot_arrow_up.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                    <button className="arrowBtn">
                      {" "}
                      <img
                        src="/assets/images/carrot_arrow_down.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                  </div>
                  <div style={{ marginLeft: "2px" }}>Client</div>
                </div>
                <div className="clienttableHead">
                  <div className="btns">
                    <button className="arrowBtn">
                      <img
                        src="/assets/images/carrot_arrow_up.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                    <button className="arrowBtn">
                      {" "}
                      <img
                        src="/assets/images/carrot_arrow_down.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                  </div>
                  <div style={{ marginLeft: "2px" }}>Email Id</div>
                </div>
                <div className="clienttableHead">
                  <div className="btns">
                    <button className="arrowBtn">
                      <img
                        src="/assets/images/carrot_arrow_up.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                    <button className="arrowBtn">
                      {" "}
                      <img
                        src="/assets/images/carrot_arrow_down.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                  </div>
                  <div style={{ marginLeft: "2px" }}>Phone No</div>
                </div>
                <div className="clienttableHead">
                  <div className="btns">
                    <button className="arrowBtn">
                      <img
                        src="/assets/images/carrot_arrow_up.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                    <button className="arrowBtn">
                      {" "}
                      <img
                        src="/assets/images/carrot_arrow_down.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                  </div>
                  <div style={{ marginLeft: "2px" }}>Requested on</div>
                </div>
                <div className="clienttableHead">
                  <div className="btns">
                    <button className="arrowBtn">
                      <img
                        src="/assets/images/carrot_arrow_up.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                    <button className="arrowBtn">
                      {" "}
                      <img
                        src="/assets/images/carrot_arrow_down.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                  </div>
                  <div style={{ marginLeft: "2px" }}>Declined by</div>
                </div>
                <div className="clienttableHead">
                  <div className="btns">
                    <button className="arrowBtn">
                      <img
                        src="/assets/images/carrot_arrow_up.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                    <button className="arrowBtn">
                      {" "}
                      <img
                        src="/assets/images/carrot_arrow_down.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                  </div>
                  <div style={{ marginLeft: "2px" }}>status</div>
                </div>
                <div className="headBtn">
                  <div className="btns">
                    <button className="arrowBtn">
                      <img
                        src="/assets/images/carrot_arrow_up.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                    <button className="arrowBtn">
                      {" "}
                      <img
                        src="/assets/images/carrot_arrow_down.png"
                        style={{ width: "10px" }}
                      ></img>
                    </button>
                  </div>
                  <div style={{ marginLeft: "2px" }}>action</div>
                </div>
              </div>
            </ul>
            <div id="listingTable">
              <ul>
                {this.state.listData.map((item, key) => (
                  <li key={key}>
                    <div className="elementBody ">
                      <div className="clienttableBody">{item.id}</div>
                      <div className="clienttableBody">{item.firstName}</div>
                      <div className="clienttableBody">{item.lastName}</div>
                      <div className="clienttableBody">{item.clientName}</div>
                      <div className="clienttableBody">{item.email}</div>
                      <div className="clienttableBody">{item.phoneNo}</div>
                      <div className="clienttableBody">{item.requestOn}</div>
                      <div className="clienttableBody">{item.declinedBy}</div>
                      <div
                        className="clienttableBody"
                        style={{ backgroundColor: "yellow" }}
                      >
                        pending
                      </div>
                      <div className="clienttableBody">
                        {" "}
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
                            View Details
                          </MenuItem>
                          <MenuItem onClick={this.handleClose}>Accept</MenuItem>
                          <MenuItem onClick={this.handleModalOpen}>
                            Decline
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
