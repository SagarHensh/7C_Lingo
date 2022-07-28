import React, { ElementConfig } from "react";
import Select, { components } from "react-select";
import makeAnimated from 'react-select/animated';
import { ImageName } from "../../../enums";

const animatedComponents = makeAnimated();
//For Input type

class InputText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    }
  }

  static defaultProps = {
    type: "text",
    className: "in-field2",
    placeholder: "Xxxxxxx",
    value: "",
  }

  onValueChange = e => {
    this.setState({
      value: e.target.value
    })
    this.props.onTextChange(e.target.value);
  }
  render() {
    return (
      <React.Fragment>
        <input type={this.props.type} value={this.props.value} placeholder={this.props.placeholder} className={this.props.className} onChange={this.onValueChange} />
      </React.Fragment>
    )
  }
}// For Dropdown

const DropdownIndicator = (props
  // props: ElementConfig<typeof components.DropdownIndicator>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <img
        src={ImageName.IMAGE_NAME.DOWN_ARROW_BLUE}
        style={{ width: "17px" }}
      />
    </components.DropdownIndicator>
  );
};

class SelectBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    }
  }

  componentDidUpdate(prevState) {
    // console.log("PrevState>>>>", prevState);
    // console.log("Current value>>>>", this.props.value);
    if (prevState.value !== this.props.value) {
      this.setState({
        value: this.props.value
      })
    }

  }

  static defaultProps = {
    className: "",
    placeholder: "",

    optionData: [
      {
        label: "None",
        value: "",
      },
    ],
    isDisabled: false,
  };
  onValueChange = (value) => {
    this.setState({
      value: value
    })
    this.props.onSelectChange(value);
  };

  render() {
    const customStyles = {
      control: (styles) => ({
        ...styles,
        backgroundColor: "white",
        boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
        borderRadius: "10px",
        height: 45,
        minHeight: 45
      }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = "yellow";
        return {
          ...styles,
          color: isFocused ? "grey" : "white",
          //   backgroundColor: isDisabled ? "red" : "white",
          color: "#000",
          cursor: isDisabled ? "not-allowed" : "default",
        };
      },
    };
    return (
      <React.Fragment>
        <Select
          components={{ DropdownIndicator, IndicatorSeparator: () => null }}
          options={this.props.optionData}
          placeholder={this.props.placeholder}
          value={this.state.value}
          className={this.props.className}
          onChange={(value) => {
            this.onValueChange(value);
          }}
          styles={customStyles}
          isDisabled={this.props.isDisabled}
        ></Select>
      </React.Fragment>
    );
  }
}

class MultiSelectBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    }
  }

  componentDidUpdate(prevState) {
    // console.log("PrevState>>>>", prevState);
    // console.log("Current value>>>>", this.props.value);
    if (prevState.value !== this.props.value) {
      this.setState({
        value: this.props.value
      })
    }

  }

  static defaultProps = {
    className: "",
    placeholder: "",

    optionData: [
      {
        label: "None",
        value: "",
      },
    ],
    isDisabled: false,
  };
  onValueChange = (value) => {
    this.setState({
      value: value
    })
    this.props.onSelectChange(value);
  };

  render() {
    const customStyles = {
      control: (styles) => ({
        ...styles,
        backgroundColor: "white",
        boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
        borderRadius: "10px",
        // height: 45,
        minHeight: 45
      }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = "yellow";
        return {
          ...styles,
          color: isFocused ? "grey" : "white",
          //   backgroundColor: isDisabled ? "red" : "white",
          color: "#000",
          cursor: isDisabled ? "not-allowed" : "default",
        };
      },
    };
    return (
      <React.Fragment>
        <Select
          components={{ animatedComponents, DropdownIndicator, IndicatorSeparator: () => null }}
          closeMenuOnSelect={false}
          options={this.props.optionData}
          placeholder={this.props.placeholder}
          value={this.state.value}
          className={this.props.className}
          onChange={(value) => {
            this.onValueChange(value);
          }}
          styles={customStyles}
          isDisabled={this.props.isDisabled}
          isMulti
          isClearable
        ></Select>
      </React.Fragment>
    );
  }
}

class SmallSelectBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    }
  }

  componentDidUpdate(prevState) {
    // console.log("PrevState>>>>", prevState);
    // console.log("Current value>>>>", this.props.value);
    if (prevState.value !== this.props.value) {
      this.setState({
        value: this.props.value
      })
    }

  }

  static defaultProps = {
    className: "",
    placeholder: "",
    value: "",
    optionData: [
      {
        label: "None",
        value: "",
      },
    ],
    isDisabled: false,
  };
  onValueChange = (value) => {
    this.setState({
      value: value
    })
    this.props.onSelectChange(value);
  };

  render() {
    const customStyles = {
      control: (styles) => ({
        ...styles,
        backgroundColor: "white",
        boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
        borderRadius: "10px",
        height: 45,
        minHeight: 45
      }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = "yellow";
        return {
          ...styles,
          color: isFocused ? "grey" : "white",
          //   backgroundColor: isDisabled ? "red" : "white",
          color: "#000",
          cursor: isDisabled ? "not-allowed" : "default",
        };
      },
    };
    return (
      <React.Fragment>
        <Select
          components={{ DropdownIndicator, IndicatorSeparator: () => null }}
          options={this.props.optionData}
          placeholder={this.props.placeholder}
          value={this.state.value}
          className={this.props.className}
          onChange={(value) => {
            this.onValueChange(value);
          }}
          styles={customStyles}
          isDisabled={this.props.isDisabled}
        ></Select>
      </React.Fragment>
    );
  }
}



// .....................pagination Dropdown.................................

class PaginationDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
  }

  componentDidUpdate(prevState) {
    // console.log("PrevState>>>>", prevState);
    // console.log("Current value>>>>", this.props.value);
    if (prevState.value !== this.props.value) {
      this.setState({
        value: this.props.value,
      });
    }
  }

  static defaultProps = {
    className: "",
    placeholder: "",

    optionData: [
      {
        label: "None",
        value: "",
      },
    ],
    isDisabled: false,
  };
  onValueChange = (value) => {
    this.setState({
      value: value,
    });
    this.props.onSelectChange(value);
  };

  render() {
    const customStyles = {
      control: (styles) => ({
        ...styles,
        backgroundColor: "white",
        boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
        borderRadius: "10px",
        height: 38,
        minHeight: 38,
      }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = "yellow";
        return {
          ...styles,
          color: isFocused ? "grey" : "white",
          //   backgroundColor: isDisabled ? "red" : "white",
          color: "#000",
          cursor: isDisabled ? "not-allowed" : "default",
        };
      },
    };
    return (
      <React.Fragment>
        <Select
          components={{
            DropdownIndicator: () => (
              <>
                <img
                  src={ImageName.IMAGE_NAME.DOWN_ARROW_BLUE}
                  style={{ width: "25px", paddingRight: "10px" }}
                />
              </>
            ),
            IndicatorSeparator: () => null,
          }}
          options={this.props.optionData}
          placeholder={this.props.placeholder}
          value={this.state.value}
          className={this.props.className}
          onChange={(value) => {
            this.onValueChange(value);
          }}
          isSearchable={false}
          styles={customStyles}
          isDisabled={this.props.isDisabled}
        ></Select>
      </React.Fragment>
    );
  }
}


export { InputText, SelectBox, SmallSelectBox, MultiSelectBox, PaginationDropdown }