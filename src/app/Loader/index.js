
import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default class ReactLoader extends React.Component {
    render() {
        return (
            <Loader
                className='centered'
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
                style={{marginLeft : "45%", marginTop:"20%"}}
            />
        )
    }
}