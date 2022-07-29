import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ApiCall } from "../../../../services/middleware";
import { toast, ToastContainer } from "react-toastify";
import { passwordValidator } from "../../../../validators";
import { passWordRandomGenerate } from "../Vendor List/function";
import { AlertMessage } from "../../../../enums";
import { ErrorCode } from "../../../../services/constant";
import { consoleLog } from "../../../../services/common-function";

//Style for option button................
const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

export default class VendorMenuPages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            resetPasswordData: ""
        }
    }

    //................funct for menuBtn on click................
    menuBtnhandleClick = (event) => {
        this.setState({
            anchorEl: event.currentTarget,
        });
    };

    handleMenuClose = () => {
        this.setState({
            anchorEl: null,
        });
    };

    openResetModal = () => {
        document.getElementById("backdrop").style.display = "block";
        document.getElementById("password-model").style.display = "block";
        document.getElementById("password-model").classList.add("show");
    };

    closeResetModal = () => {
        document.getElementById("backdrop").style.display = "none";
        document.getElementById("password-model").style.display = "none";
        document.getElementById("password-model").classList.remove("show");
    };

    handleReset = () => {
        let mainPass = passWordRandomGenerate();
        consoleLog("automated password::", mainPass)
        this.setState({
            resetPasswordData: mainPass
        })
        this.handleMenuClose();
        this.openResetModal();
    };
    cancelDelete = () => {
        // window.$("#status-model").modal("hide");
        this.closeResetModal();
    };
    //............Reset Password...........

    onResetPassword = async () => {


        let errorCount = 0;

        let validatePassword = passwordValidator(this.state.resetPasswordData)

        if (validatePassword.status === false) {
            toast.error(validatePassword.message, {
                hideProgressBar: true,
            });
            errorCount++;
        }
        // let pass = this.randomString(10, "aA#!");

            let data = {
                staffid: this.props.value,
                password: this.state.resetPasswordData,
            };

            consoleLog("Prev Data request:", data)

        if (errorCount === 0) {

            let data = {
                staffid: this.props.value,
                password: this.state.resetPasswordData,
            };

            consoleLog("Data request:", data)

            // let status = await ApiCall("userpasswordreset", data);
            // if (
            //     status.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            //     status.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
            // ) {
            //     this.closeResetModal();
            //     toast.success(AlertMessage.MESSAGE.PASSWORD.RESET_SUCCESS);
            // }
        }

    };

    onResetPassChange = (e) => {
        this.setState({
            resetPasswordData: e.target.value,
        });
    };

    render() {
        const open = Boolean(this.state.anchorEl); //used in MenuButton open
        return (
            <React.Fragment>
                <ToastContainer hideProgressBar theme="colored" />
                <Button
                    aria-controls="op-btn"
                    id="op-btn"
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    variant="contained"
                    color="primary"
                    onClick={(e) => this.menuBtnhandleClick(e)}
                >
                    Open Menu
                </Button>
                <StyledMenu
                    id="op-btn"
                    anchorEl={this.state.anchorEl}
                    open={open}
                    onClose={this.handleMenuClose}
                    MenuListProps={{
                        "aria-labelledby": "op-btn",
                    }}
                >
                    <MenuItem onClick={this.handleReset}>
                        Reset Password
                    </MenuItem>
                    <MenuItem
                        onClick={() => this.onDocument()}
                    >
                        Verification Docs
                    </MenuItem>
                    <MenuItem>View Jobs</MenuItem>
                    <MenuItem>View Projects</MenuItem>
                    <MenuItem
                        onClick={() => this.vendorRateCards()}
                    >
                        Rate Cards
                    </MenuItem>
                    <MenuItem>Invoices</MenuItem>
                    <MenuItem
                        onClick={() => this.onStatusModal()}
                    >
                        De-Activate or Activate
                    </MenuItem>
                </StyledMenu>


                {/* ..................Reset Password modal................................. */}
                <div
                    id="password-model"
                    className="modal fade modelwindow"
                    role="dialog"
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        {/* <!-- Modal content--> */}
                        <div className="modal-content">
                            <div className="modal-body">
                                {/* <div className="model-info f-model"> */}
                                <div className="form-search-app">
                                    <center>
                                        <h6>
                                            Are you really want to reset the password for selected
                                            user?{" "}
                                        </h6>
                                    </center>
                                    <div className="row" style={{ marginTop: "20px" }}>
                                        <center>
                                            <div className="col-md-6">
                                                <input
                                                    className="inputfield"
                                                    value={this.state.resetPasswordData}
                                                    onChange={(e) =>
                                                        this.onResetPassChange(e)
                                                    }
                                                />
                                            </div>
                                        </center>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4"></div>
                                        <div
                                            class="_button-style _fl text-center"
                                            style={{ marginTop: "2%" }}
                                        >
                                            <a
                                                href="javascript:void(0)"
                                                className="white-btn"
                                                style={{ textDecoration: "none" }}
                                                onClick={this.cancelDelete}
                                            >
                                                No
                                            </a>
                                            <a
                                                href="javascript:void(0)"
                                                className="blue-btn"
                                                style={{ textDecoration: "none" }}
                                                onClick={this.onResetPassword}
                                            >
                                                Yes
                                            </a>
                                        </div>
                                        <div className="col-md-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}