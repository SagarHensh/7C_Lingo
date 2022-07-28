import React from 'react';
import Lottie from "lottie-react";
import loader from "./loader.json";

const style = {
    height: 400,
    width: 400,
    marginTop: "10%"
};

export default class LotteLoader extends React.Component{
    
    render(){
        return(
            <center><Lottie animationData={loader} loop={true} style={style} /></center>
        )
    }
}