import React, { Component } from "react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/system";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
// import Header from "../../../Header/Header";
// import Sidebar from "../../../Sidebar/Sidebar";
// import "./addClientDepartment.css";
import { ToastContainer, toast } from "react-toastify";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AlertMessage, ImageName } from "../../../../enums";
import history from "../../../../history";
import Multiselect from "multiselect-react-dropdown";
import {
    departmentValidator,
    inputEmptyValidate,
} from "../../../../validators";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { ApiCall, ApiCallClient } from "../../../../services/middleware";
import { CommonData, ErrorCode } from "../../../../services/constant";
import { Decoder, Encoder } from "../../../../services/auth";
import ReactLoader from "../../../Loader";
import { InputText, MultiSelectBox, SelectBox } from "../../../Admin/SharedComponents/inputText";
import { consoleLog } from "../../../../services/common-function";
import { Link } from "react-router-dom";
import { Regex } from "../../../../services/config";



// .................mui switch...................................
const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 68,
    height: 28,
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
        width: 20,
        height: 22,
        borderRadius: 11,
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

const noneData = {
    text: "none",
    value: 0
}

var subDeptArr = [
    { id: 0, department: "None" }
];

// const parentArrdata = [{ id: 1, name: "abc" }];
export default class AddDepartmentClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoad: true,
            deptId: 0,
            ClientId: "",
            industry: "",
            department: "",
            departmentData: "",
            parentDept: "",
            client: "",
            supervisor: "",
            location: "",
            note: "",
            lat: "",
            long: "",
            deptName: [],
            parentDeptArr: [],
            clientArr: [],
            locationArr: [],
            supervisorArr: [],
            arrDepartment: [],
            selectedValue: [],
            allAdddress: [],
            selectAddress: [],




            selectDept: 0,
            selectClientId: "",
            supervisorId: [],
            allAdddress: [],
            selectAddress: [],
            checkStatus: 0,
            parentDeptId: 0,

            subDepartmentName: subDeptArr,
            subDeptId: [],

            selectedParentDept: {},
            allParentDept: [],


        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.load();
    }


    load = async () => {
        let data = {},
            allActiveUsers = [],
            activeParent = [],
            activeDepartment = [],
            fetchActiveUserDetails = [],
            listArrData = [];


        let auth = localStorage.getItem("AuthToken");
        let authUser = Decoder.decode(auth);

        let req = {
            clientId: authUser.data.userid
        };
        this.getClientActiveDepartment(req);

        // for dept

        let activeDept = await ApiCall("fetchActiveMasterDepartment", data);
        if (activeDept.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && activeDept.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            activeDepartment = Decoder.decode(activeDept.data.payload);
            let payload = await Decoder.decode(activeDept.data.payload);
            subDeptArr = payload.data;
            var dept = [];
            for (let j = 0; j < activeDepartment.data.length; j++) {
                dept.push({
                    label: activeDepartment.data[j].department,
                    value: activeDepartment.data[j].id
                })
            }
            var curClassInst = this;

            this.setState({
                arrDepartment: dept,
            })




            this.getSupervisorByClient(req);


            // for client
            // var client = [];
            // var supervisorArray = [];
            // let selectClientId = "";
            // for (let j = 0; j < CommonData.COMMON.CLIENT.length; j++) {
            //     for (let k = 0; k < CommonData.COMMON.SUPERVISOR.length; k++) {
            //         if (CommonData.COMMON.CLIENT[j].id === CommonData.COMMON.SUPERVISOR[k].clientId) {
            //             supervisorArray.push(CommonData.COMMON.SUPERVISOR[k]);
            //             this.setState({
            //                 supervisorArr: supervisorArray
            //             })
            //         }
            //     }
            //     client.push({
            //         text: CommonData.COMMON.CLIENT[j].name,
            //         value: CommonData.COMMON.CLIENT[j].id,
            //     })
            // }
            // window.$(".clientDropdown").ddslick({
            //     data: client,
            //     onSelected: function (data) {
            //         supervisorArray = [];
            //         for (let k = 0; k < CommonData.COMMON.SUPERVISOR.length; k++) {
            //             if (data.selectedData.value === CommonData.COMMON.SUPERVISOR[k].clientId) {
            //                 supervisorArray.push(CommonData.COMMON.SUPERVISOR[k]);
            //             }
            //         }
            //         selectClientId = data.selectedData.value;
            //         curClassInst.setState({ selectClientId: data.selectedData.value, supervisorArr: supervisorArray, supervisorId: [] });
            //     }
            // });



            // parent dept
            let clientId = 0;
            // if (selectClientId === undefined || selectClientId === null || selectClientId === "") {
            //     clientId = 0;
            // } else {
            //     clientId = selectClientId;
            // }

            clientId = authUser.data.userid;

            let activeParentData = await ApiCall("fetchActiveParent", { "clientId": clientId });
            if (activeParentData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && activeParentData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                activeParent = Decoder.decode(activeParentData.data.payload);
                var parentDept = [];
                parentDept.push(noneData)
                for (let j = 0; j < activeParent.data.length; j++) {
                    parentDept.push({
                        text: activeParent.data[j].name,
                        value: activeParent.data[j].id,
                    })
                }
                window.$(".parentDeptDropdown").ddslick({
                    data: parentDept,
                    onSelected: function (data) {
                        curClassInst.setState({ parentDeptId: data.selectedData.value });
                    }
                });
            }

        }
        this.setState({
            subDepartmentName: subDeptArr,
            isLoad: false
        });
    };

    getSupervisorByClient = async (data) => {
        let supervisorArray = [];
        let res = await ApiCall("getSupervisorFromClient", data);
        if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = Decoder.decode(res.data.payload);
            payload = payload.data
            if (payload.supervisorList.length > 0) {
                for (let j = 0; j < payload.supervisorList.length; j++) {
                    supervisorArray.push({
                        label: payload.supervisorList[j].name,
                        value: payload.supervisorList[j].userId,
                    })
                }
            }
        }

        this.setState({
            supervisorArr: supervisorArray,
        });
    }


    getClientActiveDepartment = async (data) => {
        let allClientParentDepartment = [];
        let res = await ApiCall("fetchActiveClientDepartment", data);
        if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
            let payload = Decoder.decode(res.data.payload);
            if (payload.data.length > 0) {
                for (let j = 0; j < payload.data.length; j++) {
                    allClientParentDepartment.push({
                        label: payload.data[j].department,
                        value: payload.data[j].id,
                    })
                }
            }
        }

        this.setState({
            allParentDept: allClientParentDepartment,
        })
    }

    parentDepartmentChange = (selectedItem) => {
        // console.log("=>>",selectedItem,"-----",this.state.allParentDept);
        let arr = [];
        for (let i = 0; i < this.state.allParentDept.length; i++) {
            for (let j = 0; j < selectedItem.length; j++) {
                if (this.state.allParentDept[i].value === selectedItem[j].value) {
                    arr.push({
                        value: selectedItem[j].value,
                        label: selectedItem[j].label
                    });
                }
            }
        }

        this.setState({
            // selectedParentDept: arr,
            selectedParentDept: selectedItem,
            parentDeptId: selectedItem.value
        })
    }


    departmentChange = (e) => {
        var pattern = new RegExp(Regex.STRING_NUMBER_REGEX);
        if (departmentValidator(e.target.value)) {
            if (pattern.test(e.target.value)) {
                this.setState({
                    departmentData: e.target.value,
                });
            }
        }

        // this.setState({
        //     departmentData:
        //     selectedDepartment: value,
        //     selectDept: value.value
        // })
    }

    onSelect = (selectedItem) => {
        let arr = [];
        // console.log("sup Array=>>",this.state.supervisorArr,"selectedItem=>>",selectedItem)
        for (let i = 0; i < this.state.supervisorArr.length; i++) {
            for (let j = 0; j < selectedItem.length; j++) {

                if (this.state.supervisorArr[i].value === selectedItem[j].value) {
                    arr.push({
                        value: selectedItem[j].value,
                        label: selectedItem[j].label
                    });
                }
            }
        }
        // console.log("111",arr);
        this.setState({
            supervisorId: arr
        });
    };

    onSelectSubDept = (selectedList, selectedItem) => {
        let arr = this.state.subDeptId;
        for (let i = 0; i < this.state.subDepartmentName.length; i++) {
            if (this.state.subDepartmentName[i].id === selectedItem.id) {
                arr.push({
                    id: selectedItem.id,
                    name: this.state.subDepartmentName[i].name
                });
                this.setState({
                    subDeptId: arr
                });
            }
        }
    };

    onRemove = (selectedList, removedItem) => {
        let arr = [];
        for (let i = 0; i < selectedList.length; i++) {
            arr.push({ id: selectedList[i].id, name: selectedList[i].name });
        }
        this.setState({
            supervisorId: arr
        });
    };

    locationData = async (e) => {
        if (e.target.value.length >= 3) {
            let locationData = await ApiCall("getlocaiondescription", { "place": e.target.value });
            if (locationData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && locationData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let locationArr = Decoder.decode(locationData.data.payload);
                this.setState({
                    allAdddress: locationArr.data.locaionsuggesion
                })
            }
        }
    }

    onLocationSelect = async (event, value, reason, details) => {
        let locateAdd = this.state.selectAddress;
        for (let i = 0; i < this.state.allAdddress.length; i++) {
            if (this.state.allAdddress[i].description === value) {
                let locationData = await ApiCall("getcoordinatefromplaceid", { "placeid": this.state.allAdddress[i].placeid });
                if (locationData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && locationData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                    let locationArr = Decoder.decode(locationData.data.payload);
                    let findCount = 0;
                    for (let j = 0; j < locateAdd.length; j++) {
                        if (this.state.allAdddress[i].description === locateAdd[j]) {
                            findCount++;
                        }
                    }
                    if (findCount === 0) {
                        locateAdd.push({
                            lat: locationArr.data.coordinatedetails[0].lat,
                            long: locationArr.data.coordinatedetails[0].lng,
                            location: this.state.allAdddress[i].description
                        })
                        this.setState({
                            selectAddress: locateAdd,
                        })
                    }
                }
            }
        }
    }

    removeAddress = (index) => {
        let selectAddress = this.state.selectAddress;
        selectAddress.splice(index, 1);
        this.setState({
            selectAddress: selectAddress
        })
    }

    // for status change
    onStatusChange = () => {
        let stat = 0;
        if (this.state.checkStatus === 0) {
            stat = 1;
        } else {
            stat = 0;
        }
        this.setState({
            checkStatus: stat
        });
    };

    // if user havt givee any note then i
    onNoteChange = (e) => {
        this.setState({
            note: e.target.value,
        });
    };

    onNext = async () => {
        let auth = localStorage.getItem("AuthToken");
        let authUser = Decoder.decode(auth);
        let errorCount = 0;
        // check for department
        if (this.state.departmentData === undefined || this.state.departmentData === null || this.state.departmentData === 0 || this.state.departmentData === "") {
            toast.error(AlertMessage.MESSAGE.DEPARTMENT.DEPARTMENT_EMPTY, {
                hideProgressBar: true,
            });
            errorCount++;
        }
        // location field check
        if (this.state.selectAddress === undefined || this.state.selectAddress === null || this.state.selectAddress.length === 0) {
            toast.error(AlertMessage.MESSAGE.LOCATION.LOCATION_EMPTY, {
                hideProgressBar: true,
            });
            errorCount++;
        }

        // this is from dropdown and can be multi select
        if (this.state.supervisorId === undefined || this.state.supervisorId === null || this.state.supervisorId.length === 0) {
            toast.error(AlertMessage.MESSAGE.DEPARTMENT.DROPDOWN_SUPERVISOR_EMPTY, {
                hideProgressBar: true,
            });
            errorCount++;
        }

        if (errorCount === 0) {
            let supervisorIdsArr = [],
                subDeptIdArr = [];
            for (let i = 0; i < this.state.supervisorId.length; i++) {
                supervisorIdsArr.push(this.state.supervisorId[i].value);
            }
            for (let i = 0; i < this.state.selectedParentDept.length; i++) {
                subDeptIdArr.push(this.state.selectedParentDept[i].value);
            }
            let data = {
                masterDepartmentId: this.state.departmentData,
                parentId: this.state.parentDeptId.toString(),
                status: this.state.checkStatus ? "1" : "0",
                clientId: authUser.data.userid,
                notes: this.state.note,
                supervisor: supervisorIdsArr,
                loc: this.state.selectAddress,


                // departmentName: this.state.departmentData,
                // parentId: this.state.parentDeptId.toString(),
                // status: this.state.checkStatus ? "1" : "0",
                // subDeptId: subDeptIdArr,
                // notes: this.state.note,
                // supervisor: supervisorIdsArr,
                // loc: this.state.selectAddress
            };

            consoleLog("submit data::::", data)



            let res = await ApiCall("insertClientMasterDepartmentNew", data);
            if (res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                toast.success(AlertMessage.MESSAGE.CLIENT.CLIENT_CREATE_SUCCESS, { hideProgressBar: true });
                return history.push("/departmentClient");
            } else {
                if (res.error === ErrorCode.ERROR.ERROR.WITH_ERROR && res.respondcode === ErrorCode.ERROR.ERROR_CODE.CLIENT_MAP_WITH_DEPT) {
                    toast.error(AlertMessage.MESSAGE.DEPARTMENT.CLIENT_ALREADY_MAP, { hideProgressBar: true }
                    );
                } else {
                    toast.error(AlertMessage.MESSAGE.UPDATE.PROFILE_FAILURE, { hideProgressBar: true });
                }
            }
            // console.log("===>>",data);
        }

    };

    // .....................func for cancel btn......................
    onCancel = () => {
        history.push("/departmentClient");
    };

    render() {
        return (
            <React.Fragment>
                {/* <div className="wrapper"> */}
                {/* <Header /> */}
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
                        <Link to="/clientDashboard">Dashboard</Link> / <Link to="/departmentClient">Department</Link> / Add
                    </div>
                    <div className="department-component-app _fl sdw">
                        <h3>Add Department</h3>
                        <div className="department-form">
                            <div className="row">
                                <div className="col-md-5">
                                    <div className="form_rbx">
                                        <span className="">Department&nbsp;*</span>
                                        <input
                                            type="text"
                                            value={this.state.departmentData}
                                            name=""
                                            placeholder=""
                                            class="in-field2"
                                            onChange={(e) => this.departmentChange(e)}
                                        />
                                        {/* <div className="dropdwn">
                                            <InputText
                                                // optionData={this.state.arrDepartment}
                                                value={this.state.selectedDepartment}
                                                onSelectChange={(value) => this.departmentChange(value)}
                                            >
                                            </InputText>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="col-md-2" />
                                <div className="col-md-5">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Parent Department&nbsp;*</span>
                                        <div class="dropdwn">
                                            {/* <SelectBox
                                            optionData={this.state.allParentDept}
                                            value={this.state.selectedParentDept}
                                            onSelectChange={(value) => this.parentDepartmentChange(value)}
                                        >
                                        </SelectBox> */}
                                            <SelectBox
                                                optionData={this.state.allParentDept}
                                                value={this.state.selectedParentDept}
                                                onSelectChange={(value) => this.parentDepartmentChange(value)}
                                            ></SelectBox>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="department-form">
                            <div className="row">
                                <div className="col-md-5">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Supervisor [s]&nbsp;*</span>
                                        <div className="dropdwn">
                                            {/* <Multiselect
                                                options={this.state.supervisorArr} // Options to display in the dropdown
                                                selectedValues={this.state.supervisorId} // Preselected value to persist in dropdown
                                                onSelect={this.onSelect} // Function will trigger on select event
                                                onRemove={this.onRemove} // Function will trigger on remove event
                                                displayValue="name" // Property name to display in the dropdown options
                                                showCheckbox
                                            /> */}

                                            <MultiSelectBox
                                                optionData={this.state.supervisorArr}
                                                value={this.state.supervisorId}
                                                onSelectChange={(value) => this.onSelect(value)}
                                            ></MultiSelectBox>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-2" />
                                <div className="col-md-5">
                                    <div className="web-form-bx">
                                        <span className="" style={{ fontSize: "13px", color: "var(--greyLight)" }}>Location&nbsp;*</span>
                                        <div class="dropdwn">
                                            <Stack spacing={2} style={{ marginTop: '8px' }}>
                                                <Autocomplete
                                                    id="free-solo-demo"
                                                    freeSolo
                                                    size="small"
                                                    onChange={(event, value, reason, details) => this.onLocationSelect(event, value, reason, details)}
                                                    options={this.state.allAdddress.map((option) => option.description)}
                                                    renderInput={(params) => <TextField onChange={this.locationData} {...params} />}
                                                />
                                            </Stack>
                                            {this.state.selectAddress.map((item, key) => (
                                                <React.Fragment key={key}>
                                                    <span className="span_loc">
                                                        {item.location}
                                                        <img
                                                            onClick={() => this.removeAddress(key)}
                                                            src={ImageName.IMAGE_NAME.CLOSE_BTN}
                                                            className="close-img"
                                                        />
                                                    </span>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="department-form">
                            <div className="row">
                                <div className="col-md-5">
                                    <div className="web-form-bx">
                                        <div class="dropdwn">
                                            {" "}
                                            <span className="" style={{ fontSize: "13px", color: "var(--greyLight)" }}>Notes</span>
                                            <textarea
                                                placeholder=""
                                                className="in-textarea msg min"
                                                value={this.state.note}
                                                onChange={this.onNoteChange}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-2" />
                                <div className="col-md-1">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">status&nbsp;*</span>
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
                                                    defaultChecked={this.state.checkStatus === 0 ? false : true}
                                                    inputProps={{
                                                        "aria-label": "ant design",
                                                    }}
                                                    name="active"
                                                    onClick={() => this.onStatusChange()}
                                                />
                                            </Stack>
                                        </FormControl>
                                    </div>
                                </div>
                                <div className="col-md-1 btn_status" id="client-add-acti-text">
                                    <div className="status_text">
                                        {this.state.checkStatus === 1 ? "Active" : "Inactive"}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="department-form">
                            <div className="row">
                                <div className="col-md-5">
                                    <div className="web-form-bx">
                                        <div class="dropdwn">
                                            {" "}
                                            <span className="" style={{ fontSize: "13px", color: "var(--greyLight)" }}>Notes</span>
                                            <textarea
                                                placeholder=""
                                                className="in-textarea msg min"
                                                value={this.state.note}
                                                onChange={this.onNoteChange}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div className="row" style={{ marginTop: "10%" }}>
                            <div className="col-md-4"></div>
                            <div class="_button-style m30 _fl text-center">
                                <a
                                    href="javascript:void(0)"
                                    className="white-btn"
                                    style={{ textDecoration: "none" }}
                                    onClick={this.onCancel}
                                >
                                    CANCEL
                                </a>
                                <a
                                    href="javascript:void(0)"
                                    className="blue-btn"
                                    style={{ textDecoration: "none", color: "#fff" }}
                                    onClick={this.onNext}
                                >
                                    SAVE
                                </a>
                            </div>
                            <div className="col-md-4"></div>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </React.Fragment>
        );
    }
}