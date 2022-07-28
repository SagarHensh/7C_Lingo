import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default class ThreeDotsLoader extends React.Component {
  render() {
    return (
      <Loader
        className="centered"
        type="ThreeDots"  
        color="#00BFFF"
        height={50}
        width={50}
        // style={{ marginLeft: "38%", marginTop: "30%" }}
        style={{ marginLeft: "45%", marginTop: "15%" }}
        
      />
    );
  }
}
