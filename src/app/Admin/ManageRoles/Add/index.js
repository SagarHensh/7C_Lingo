import React from "react";
import "./addPermission.css";
import { ToastContainer, toast } from "react-toastify";
import { InputText, SelectBox } from "../../SharedComponents/inputText";
import { getLookUpDataFromAPI } from "../../../../services/common-function";
import history from "../../../../history";
import { ApiCall } from "../../../../services/middleware";
import { Decoder } from "../../../../services/auth";
import { ErrorCode } from "../../../../services/constant";
import { inputEmptyValidate } from "../../../../validators";
import { AlertMessage } from "../../../../enums";
import { Link } from "react-router-dom";

export default class AddPermission extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roleName: "",
            userType: "",
            allUserType: [],
            modulesPermissionData: [],
            selectedUserTypes: {},
            permissionType: [],
            allModulesData: []
        }
    }

    componentDidMount() {
        this.load();
    }

    load = async () => {
        var lookUpData = await getLookUpDataFromAPI();
        // console.log("lookupData>>>>", lookUpData);
        let arr = [];
        lookUpData.USER_TYPE.map((data) => {
            arr.push({
                label: data.name,
                value: data.id
            })
        });

        let brr = [];
        let moduleDataArr = [];

        let res = await ApiCall("getModuleList");
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            let payload = await Decoder.decode(res.data.payload);
            // console.log("Module List>>> ", payload.data);
            moduleDataArr = payload.data;
            payload.data.map((data) => {
                brr.push({
                    moduleId: data.id,
                    moduleName: data.name,
                    permission: {
                        add: false,
                        edit: false,
                        view: false,
                        delete: false
                    }
                })
            })
        }

        this.setState({
            allUserType: arr,
            allModulesData: moduleDataArr,
            modulesPermissionData: brr
        })
    }

    roleNameChange = (value) => {
        this.setState({
            roleName: value
        })
    }

    userTypeChange = (value) => {
        // console.log("value", value)
        this.setState({
            selectedUserTypes: value,
            userType: value.value
        })
    }

    subTypeChange = (section, mid) => e => {

        let arr = this.state.modulesPermissionData;
        arr.map((data) => {
            if (data.moduleId === mid) {
                data.permission[section] = e.target.checked;
            }
        })
        // console.log("permissionType arr>>>", arr);

        this.setState({
            modulesPermissionData: arr
        })
    }

    onAdd = async () => {
        window.scrollTo(0, 0);
        let errorCount = 0;

        let validateRoleName = inputEmptyValidate(this.state.roleName);
        let validateUserType = inputEmptyValidate(this.state.userType);
        if (validateRoleName === false) {
            toast.error(AlertMessage.MESSAGE.ROLE.EMPTY_NAME);
            errorCount++;
            return false;
        }

        if (validateUserType === false) {
            toast.error(AlertMessage.MESSAGE.ROLE.EMPTY_USERTYPE);
            errorCount++;
            return false;
        }

        if (errorCount === 0) {
            let data = {
                roleName: this.state.roleName,
                roleTypeId: this.state.userType,
                modules: this.state.modulesPermissionData
            }
            // console.log("Add Data>>>>>>>", data);
            let res = await ApiCall("addRole", data);
            if (
                res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
                res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
            ) {
                toast.success(AlertMessage.MESSAGE.ROLE.ADD_SUCCESS);
                return history.push("/adminRoles");
            } else if (res.respondcode === ErrorCode.ERROR.ERROR_CODE.DUPLICATE_ROLE_NAME) {
                toast.error(AlertMessage.MESSAGE.ROLE.DUPLICATE_ROLENAME);
            }
        }
    }

    onBack = () => {
        return history.push("/adminRoles");
    }


    render() {
        const selectedStatus = this.state.selectedUserTypes;
        return (
            <React.Fragment>
                <ToastContainer hideProgressBar={true} theme="colored"/>
                <div className="component-wrapper">
                    <div
                        className="vn_frm"
                        style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
                    >
                        {" "}
                        <Link to="/adminDashboard">Dashboard</Link> / <Link to="/adminRoles">Roles & Permission</Link> / Add
                    </div>
                    <div className="department-component-app _fl sdw">
                        <h3>ADD ROLES & PERMISSIONS</h3>
                        <div className="department-form">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">Role Name *</span>
                                        <InputText
                                            placeholder=""
                                            className="in-field2"
                                            value={this.state.roleName}
                                            onTextChange={(value) => {
                                                this.roleNameChange(value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                    <div className="form_rbx">
                                        {" "}
                                        <span className="">User Type *</span>
                                        <div className="dropdwn">
                                            <SelectBox
                                                value={selectedStatus}
                                                optionData={this.state.allUserType}
                                                placeholder=""
                                                onSelectChange={this.userTypeChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="department-form">
                            <div className="table-listing-app">
                                <div className="table-responsive">
                                    <table
                                        width="100%"
                                        border="0"
                                        cellPadding="0"
                                        cellSpacing="0"
                                    >
                                        <tr>
                                            <th style={{ width: "30%" }}>Module Name</th>
                                            <th style={{ width: "70%" }}>Permission</th>
                                        </tr>
                                        {this.state.modulesPermissionData.map((data, i) =>
                                            <tr key={i}>
                                                <td colSpan="10">
                                                    <div className="tble-row">
                                                        <table
                                                            width="100%"
                                                            border="0"
                                                            cellPadding="0"
                                                            cellSpacing="0"
                                                        >
                                                            <tr>
                                                                <td style={{ width: "30%" }}>{data.moduleName}</td>
                                                                <td style={{ width: "70%" }}>
                                                                    <div class="check-field_pr">
                                                                        <label class="checkbox_btn">
                                                                            <input type="checkbox" name="pp" defaultChecked={data.permission.add} onChange={this.subTypeChange("add", data.moduleId)} />
                                                                            <span class="checkmark3"></span>
                                                                            Add
                                                                        </label>
                                                                    </div>
                                                                    <div class="check-field_pr">
                                                                        <label class="checkbox_btn">
                                                                            <input type="checkbox" name="pp" defaultChecked={data.permission.edit} onChange={this.subTypeChange("edit", data.moduleId)} />
                                                                            <span class="checkmark3"></span>
                                                                            Edit
                                                                        </label>
                                                                    </div>
                                                                    <div class="check-field_pr">
                                                                        <label class="checkbox_btn">
                                                                            <input type="checkbox" name="pp" defaultChecked={data.permission.view} onChange={this.subTypeChange("view", data.moduleId)} />
                                                                            <span class="checkmark3"></span>
                                                                            View
                                                                        </label>
                                                                    </div>
                                                                    <div class="check-field_pr">
                                                                        <label class="checkbox_btn">
                                                                            <input type="checkbox" name="pp" defaultChecked={data.permission.delete} onChange={this.subTypeChange("delete", data.moduleId)} />
                                                                            <span class="checkmark3"></span>
                                                                            Delete
                                                                        </label>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>)}

                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="_button-style m30 _fl text-center">
                            <a
                                className="white-btn"
                                style={{ textDecoration: "none" }}
                                onClick={this.onBack}
                            >
                                back
                            </a>
                            <a
                                className="blue-btn"
                                style={{ textDecoration: "none" ,color:"white"}}
                                onClick={this.onAdd}
                            >
                                submit
                            </a>
                        </div>
                    </div>

                </div>
            </React.Fragment>
        )
    }
}