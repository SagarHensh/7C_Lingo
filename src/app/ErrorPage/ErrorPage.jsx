import React from "react";
import Lottie from "lottie-react";
import pageNotFound from "./404-page-not-found.json";
// import pageNotFound from "./404-not-found.json";

const style = {
    height: 400,
    width : 800
};

export default class ErrorPage extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="component-wrapper">
                    <center><Lottie animationData={pageNotFound} loop={true} style={style} /></center>
                </div>
            </React.Fragment>
        )
    }
}