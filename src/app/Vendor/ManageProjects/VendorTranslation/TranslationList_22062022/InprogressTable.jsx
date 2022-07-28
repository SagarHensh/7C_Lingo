import React from "react";
import { consoleLog, SetDateFormat } from "../../../../../services/common-function";
import { Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/system"; //imported for modal
import { ImageName } from "../../../../../enums";
import StatusList from "./StatusList";



const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        {...props}
    />
))(({ theme }) => ({
    "& .MuiPaper-root": {
        borderRadius: 10,
        marginTop: 5,
        minWidth: 100,
        color:
            theme.palette.mode === "light"
                ? "rgb(55, 65, 81)"
                : theme.palette.grey[300],
        boxShadow:
            "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 2%) 0px 0px 0px 1px, rgba(0, 0, 0, 0%) 0px 10px 15px -3px, rgba(0, 0, 0, 0%) 0px 4px 6px -2px",
        "& .MuiMenu-list": {
            padding: "4px 0",
        },
    },
}));

export default class InprogressTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            anchorEl: null, //menu button
            anchorEl1: null,
            curIndex: ""
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.setState({
                listData: this.props.value
            })
        }
    }

    //................funct for menuBtn on click................
    menuBtnhandleClick = (index, event) => {
        this.setState({
            curIndex: index,
            anchorEl: event.currentTarget,
        });
    };
    menuBtnhandleClick_b = (index, event) => {
        this.setState({
            curIndex: index,
            anchorEl1: event.currentTarget,
        });
    };

    handleMenuClose = () => {
        this.setState({
            anchorEl: null,
            anchorEl1: null,
        });
    };

    goEdit = () => {
        this.props.onViewClick(this.state.curIndex);
    }

    render() {
        const open = Boolean(this.state.anchorEl); //used in MenuButton open
        const open1 = Boolean(this.state.anchorEl1);
        return (
            <React.Fragment>
                <div className="table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                        <table
                            width="100%"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                        >
                            <tbody>
                                <tr>
                                    <th style={{ width: "15%" }}>Project#</th>
                                    {/* <th style={{ width: "15%" }}>Client</th> */}
                                    <th style={{ width: "15%" }}>Service Type</th>
                                    <th style={{ width: "15%" }}>Date</th>
                                    <th style={{ width: "20%" }}>Language </th>
                                    <th style={{ width: "12%" }}>Status</th>
                                    <th style={{ width: "8%" }}>Action</th>
                                </tr>
                                {this.state.listData.length > 0 ? (
                                    <React.Fragment>
                                        {this.state.listData.map((item, key) => (
                                            <tr>
                                                <td colspan="11">
                                                    <div className="tble-row">
                                                        <table
                                                            width="100%"
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td style={{ width: "15%" }}>
                                                                        {item.jobId}
                                                                    </td>
                                                                    <td style={{ width: "15%" }}>
                                                                        {item.name}
                                                                    </td>
                                                                    <td style={{ width: "15%" }}>
                                                                        {SetDateFormat(item.expectedDeadline)}
                                                                    </td>
                                                                    <td style={{ width: "20%" }}>
                                                                        {item.sourceLanguage + " > " + item.targetLanguage}
                                                                    </td>
                                                                    {/* <td style={{ width: "8%" }}></td> */}
                                                                    <td style={{ width: "12%" }}>
                                                                        {/* {item.status === 0 ? (
                                                                            <React.Fragment>
                                                                                <span className="progress-btn yellow">
                                                                                    Pending
                                                                                </span>
                                                                            </React.Fragment>
                                                                        ) : item.status === 1 ? (
                                                                            <React.Fragment>
                                                                                <span
                                                                                    href="#"
                                                                                    className="progress-btn sky"
                                                                                >
                                                                                    Quote Sent
                                                                                </span>
                                                                            </React.Fragment>
                                                                        ) : item.status === 2 ? (
                                                                            <React.Fragment>
                                                                                <span
                                                                                    href="#"
                                                                                    className="progress-btn green"
                                                                                >
                                                                                    Quote Accepted
                                                                                </span>
                                                                            </React.Fragment>
                                                                        ) : item.status === 3 ? (
                                                                            <React.Fragment>
                                                                                <span
                                                                                    href="#"
                                                                                    className="progress-btn sky"
                                                                                >
                                                                                    offer Sent
                                                                                </span>
                                                                            </React.Fragment>
                                                                        ) : item.status === 4 ? (
                                                                            <React.Fragment>
                                                                                <span
                                                                                    href="#"
                                                                                    className="progress-btn blue"
                                                                                >
                                                                                    Offer Accepted
                                                                                </span>
                                                                            </React.Fragment>
                                                                        ) : item.status === 5 ? (
                                                                            <React.Fragment>
                                                                                <span
                                                                                    href="#"
                                                                                    className="progress-btn red"
                                                                                >
                                                                                    Offer Rejected
                                                                                </span>
                                                                            </React.Fragment>
                                                                        ) : item.status === 6 ? (
                                                                            <React.Fragment>
                                                                                <span
                                                                                    href="#"
                                                                                    className="progress-btn blue"
                                                                                >
                                                                                    Bids Received
                                                                                </span>
                                                                            </React.Fragment>
                                                                        ) : item.status === 7 ? (
                                                                            <React.Fragment>
                                                                                <span
                                                                                    href="#"
                                                                                    className="progress-btn red"
                                                                                >
                                                                                    Quote Rejected
                                                                                </span>
                                                                            </React.Fragment>
                                                                        ) : item.status === 8 ? (
                                                                            <React.Fragment>
                                                                                <span
                                                                                    href="#"
                                                                                    className="progress-btn green"
                                                                                >
                                                                                    Assigned
                                                                                </span>
                                                                            </React.Fragment>
                                                                        ) : item.status === 9 ? (
                                                                            <React.Fragment>
                                                                                <span
                                                                                    href="#"
                                                                                    className="progress-btn yellow"
                                                                                >
                                                                                    In Progress
                                                                                </span>
                                                                            </React.Fragment>
                                                                        ) : item.status === 10 ? (
                                                                            <React.Fragment>
                                                                                <span
                                                                                    href="#"
                                                                                    className="progress-btn green"
                                                                                >
                                                                                    completed
                                                                                </span>
                                                                            </React.Fragment>
                                                                        ) : item.status === 11 ? (
                                                                            <React.Fragment>
                                                                                <span
                                                                                    href="#"
                                                                                    className="progress-btn green"
                                                                                >
                                                                                    cancelled
                                                                                </span>
                                                                            </React.Fragment>
                                                                        ) : (
                                                                            <React.Fragment></React.Fragment>
                                                                        )} */}
                                                                        <StatusList value={item} />
                                                                    </td>
                                                                    <td style={{ width: "8%" }}>
                                                                        {item.status === 2 ? (
                                                                            <React.Fragment>
                                                                                <img
                                                                                    src={
                                                                                        ImageName.IMAGE_NAME
                                                                                            .MENU_VERTICAL
                                                                                    }
                                                                                    style={{ cursor: "pointer" }}
                                                                                    id={"basic-button" + key}
                                                                                    aria-controls={"basic-menu" + key}
                                                                                    aria-haspopup="true"
                                                                                    aria-expanded={
                                                                                        open ? "true" : undefined
                                                                                    }
                                                                                    onClick={(e) =>
                                                                                        this.menuBtnhandleClick(
                                                                                            key,
                                                                                            e
                                                                                        )
                                                                                    }
                                                                                />
                                                                                <StyledMenu
                                                                                    id={"basic-menu" + key}
                                                                                    anchorEl={this.state.anchorEl}
                                                                                    open={open}
                                                                                    onClose={this.handleMenuClose}
                                                                                    MenuListProps={{
                                                                                        "aria-labelledby":
                                                                                            "basic-button" + key,
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        onClick={() => this.goEdit()}
                                                                                    >
                                                                                        View Details
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                    // onClick={this.declineModal}
                                                                                    >
                                                                                        Cancel
                                                                                    </MenuItem>
                                                                                </StyledMenu>
                                                                            </React.Fragment>
                                                                        ) : (
                                                                            <React.Fragment>
                                                                                <img
                                                                                    src={
                                                                                        ImageName.IMAGE_NAME
                                                                                            .MENU_VERTICAL
                                                                                    }
                                                                                    style={{ cursor: "pointer" }}
                                                                                    id={"basic-button" + key}
                                                                                    aria-controls={"basic-menu" + key}
                                                                                    aria-haspopup="true"
                                                                                    aria-expanded={
                                                                                        open1 ? "true" : undefined
                                                                                    }
                                                                                    onClick={(e) =>
                                                                                        this.menuBtnhandleClick_b(
                                                                                            key,
                                                                                            e
                                                                                        )
                                                                                    }
                                                                                />
                                                                                <StyledMenu
                                                                                    id={"basic-menu" + key}
                                                                                    anchorEl={
                                                                                        this.state.anchorEl1
                                                                                    }
                                                                                    open={open1}
                                                                                    onClose={this.handleMenuClose}
                                                                                    MenuListProps={{
                                                                                        "aria-labelledby":
                                                                                            "basic-button" + key,
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        onClick={() => this.goEdit()}
                                                                                    >
                                                                                        View Details
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        onClick={this.declineModal}
                                                                                    >
                                                                                        Cancel
                                                                                    </MenuItem>
                                                                                </StyledMenu>
                                                                            </React.Fragment>
                                                                        )}
                                                                        {/* </div> */}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <tr style={{ textAlign: "center" }}>
                                            <td colSpan="7">
                                                <center style={{ fontSize: "20px" }}>
                                                    No data found !!!
                                                </center>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </React.Fragment>
        )
    }

}