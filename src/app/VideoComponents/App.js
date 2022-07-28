import "./App.scss";
import React, { Component } from "react";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import Room from "./Room";

const { connect } = require("twilio-video");

class App extends Component {
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
    this.joinRoom = this.joinRoom.bind(this);
    this.returnToLobby = this.returnToLobby.bind(this);
    this.updateIdentity = this.updateIdentity.bind(this);
    this.removePlaceholderText = this.removePlaceholderText.bind(this);
    this.removePlaceholderImg = this.removePlaceholderImg.bind(this);
    this.updatePic = this.updatePic.bind(this);
    this.setChecked = this.setChecked.bind(this);
  }

  async joinRoom() {
    try {
      let identityJson = { name: this.state.identity, pic: this.state.pic };
      let identityStr = base64_encode(JSON.stringify(identityJson));
      const response = await fetch(
        `https://demo.lykstage.com:5000/token/${this.state.identity}`
      );
      const data = await response.json();
      if (data.token !== undefined) {
        let roomObj = {
          name: "cool room",
          audio: true,
          video: false,
          dominantSpeaker: true,
        };
        if (this.state.checked === true) {
          roomObj.video = true;
        }
        const room = await connect(data.token, roomObj);
        //console.log(room);
        this.setState({ room: room, token: data.token });
      }
    } catch (err) {
      console.log(err);
    }
  }

  returnToLobby() {
    this.setState({ room: null });
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
        {this.state.room === null ? (
          <div className="lobby">
            {console.log(this.state.room)}
            <input
              value={this.state.identity}
              onChange={this.updateIdentity}
              ref={this.inputRef}
              onClick={this.removePlaceholderText}
              placeholder="What's your name?"
            />

            <label>
              <input
                type="checkbox"
                defaultChecked={this.state.checked}
                onChange={() => this.setChecked(!this.state.checked)}
              />
              Video
            </label>
            <button disabled={disabled} onClick={this.joinRoom}>
              Join Room
            </button>
          </div>
        ) : (
          <Room
            returnToLobby={this.returnToLobby}
            token={this.state.token}
            room={this.state.room}
            isVideoOn={this.state.checked}
          />
        )}
      </div>
    );
  }
}

export default App;
