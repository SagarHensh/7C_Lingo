import React from 'react';
import { consoleLog } from '../../services/common-function';
import "./video.css";
// import { decode as base64_decode, encode as base64_encode } from "base-64";
import Room from "./Room";
import { ApiCall } from '../../services/middleware';
import { ErrorCode } from '../../services/constant';
import { Decoder } from '../../services/auth';
import Lottie from "lottie-react";
import Loading from "./99947-loader.json";

const { connect } = require("twilio-video");


const style = {
    height: 400,
    width: 800,
    marginTop: "10%"
};

export default class VideoPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            identity: "",
            room: null,
            token: null,
            pic: "https://cquipsplus.ca/wp-content/themes/cera/assets/images/avatars/user-avatar.png",
            checked: true,
        };
        this.inputRef = React.createRef();
        this.inputRef1 = React.createRef();
        this.returnToLobby = this.returnToLobby.bind(this);
        this.updateIdentity = this.updateIdentity.bind(this);
        this.removePlaceholderText = this.removePlaceholderText.bind(this);
        this.removePlaceholderImg = this.removePlaceholderImg.bind(this);
        this.updatePic = this.updatePic.bind(this);
        this.setChecked = this.setChecked.bind(this);
    }

    componentDidMount() {
        // consoleLog("Appoint Type Path::", this.props.match.params.appointmentType);
        // consoleLog("Job Path::", this.props.match.params.jobId);
        this.load();
    }

    load = async () => {
        let obj = {
            jobId: this.props.match.params.jobId
        }
        let res = await ApiCall("getAudioVideoIdentity", obj);
        if (
            res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
            res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
        ) {
            let payload = Decoder.decode(res.data.payload);
            // consoleLog("video token>>", payload.data);
            if (payload.data.identityToken.token !== undefined) {
                let roomObj = {
                    name: this.props.match.params.jobId,
                    audio: true,
                    video: false,
                    dominantSpeaker: true,
                };
                if (this.props.match.params.appointmentType == "VRI") {
                    roomObj.video = true;
                }
                const room = await connect(payload.data.identityToken.token, roomObj);
                //console.log(room);
                this.setState({ room: room, token: payload.data.identityToken.token });
            }
        }
    }

    returnToLobby() {
        this.setState({ room: null });
        window.close();
    }
    removePlaceholderText() {
        this.inputRef.current.placeholder = "";
    }
    removePlaceholderImg() {
        this.inputRef1.current.placeholder = "";
    }
    updateIdentity(event) {
        this.setState({
            identity: event.target.value,
        });
    }
    updatePic(event) {
        this.setState({
            pic: event.target.value,
        });
    }
    setChecked(val) {
        this.setState({
            checked: val,
        });
    }
    render() {
        const disabled = this.state.identity === "" ? true : false;
        return (
            <div className="app">
                {this.state.room === null ? (<>
                    <center><Lottie animationData={Loading} loop={true} style={style} /></center>
                </>

                ) : (
                    <>
                        <Room
                            returnToLobby={this.returnToLobby}
                            token={this.state.token}
                            room={this.state.room}
                            isVideoOn={this.props.match.params.appointmentType == "VRI" ? true : false}
                        />
                    </>
                )}
            </div>
        );
    }
}