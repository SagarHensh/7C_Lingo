import Select, { components } from "react-select";
import React from "react";
import { ToastContainer } from "react-toastify";
import { ImageName } from "../../../../../enums";
import { InputText } from "../../../SharedComponents/inputText";

// .......................for react select icon.............................................

const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <img
          src={ImageName.IMAGE_NAME.DOWN_ARROW_BLUE}
          style={{ width: "17px" }}
        />
      </components.DropdownIndicator>
    );
  };
  

export default class AccountInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoad:false
        }
    }

    componentDidMount(){

    }
    render(){
        return (
            <React.Fragment>
            <ToastContainer hideProgressBar theme="colored" />
            <div className="my-form-bx">
            <h4 className="h4_heading">Interpreatation</h4>
                <React.Fragment>
                <div className="row">
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Client *</span>
                            <InputText
                              placeholder=""
                              className="in-field2"
                              value={this.state.uname}
                              onTextChange={(value) => {
                                this.onNameChange(value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-2"></div>
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Industry Type *</span>
                            <Select
                              options={this.state.industryArr}
                              placeholder="Select"
                              components={{
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                              }}
                              value={this.state.industryData}
                              onChange={(value) => {
                                this.onIndustryChange(value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                </React.Fragment>
            </div>
            </React.Fragment>
        )
    }
}