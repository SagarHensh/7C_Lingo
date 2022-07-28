import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default class SmallReactLoader extends React.Component {
  render() {
    return (
      <Loader
        className="centered"
        type="TailSpin"
        color="#00BFFF"
        height={80}
        width={80}
        style={{
          width: "25px",
          display: "flex",
          marginTop: "-40px",
          position: "absolute",
        }}
      />
    );
  }
}