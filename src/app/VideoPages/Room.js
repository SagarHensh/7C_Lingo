import "./video.css";
import React, { Component } from "react";
import { AiOutlineAudioMuted, AiOutlineAudio } from "react-icons/ai";
import { TbCaptureOff, TbCapture } from "react-icons/tb";
import { MdVideocam, MdVideocamOff, MdCallEnd } from "react-icons/md";
import { BsChatDotsFill, BsChatDots } from "react-icons/bs";
import {
  AppBar,
  Backdrop,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  List,
  TextField,
  Toolbar,
  Typography,
  Box,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import Participant from "./Participant";
import {
  LocalVideoTrack,
  connect,
  createLocalTracks,
  createLocalVideoTrack,
} from "twilio-video";
import ChatItem from "./ChatItem";
const Chat = require("twilio-chat");

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remoteParticipants: Array.from(this.props.room.participants.values()),
      isMute: false,
      isVideo: true,
      screenTrack: null,
      isScreenTrack: false,
      screenCaptureRoom: null,
      dominantParticpant: null,
      messages: [],
      loading: false,
      channel: null,
      text: "",
      showChat: false,
    };
    this.leaveRoom = this.leaveRoom.bind(this);
    this.screenCapture = this.screenCapture.bind(this);
    this.stopScreenCapture = this.stopScreenCapture.bind(this);
    this.audioMute = this.audioMute.bind(this);
    this.audioUnMute = this.audioUnMute.bind(this);
    this.videoStop = this.videoStop.bind(this);
    this.videoResume = this.videoResume.bind(this);
    this.showChat = this.showChat.bind(this);
    this.hideChat = this.hideChat.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.scrollDiv = React.createRef();
    this.getToken = this.getToken.bind(this);
  }
  async componentDidMount() {
    // Add event listeners for future remote participants coming or going
    this.props.room.on("participantConnected", (participant) =>
      this.addParticipant(participant)
    );
    this.props.room.on("participantDisconnected", (participant) => {
      this.removeParticipant(participant);
      if (this.state.dominantParticpant === participant) {
        this.setState({ dominantParticpant: null });
      }
    });
    this.props.room.on("dominantSpeakerChanged", (participant) => {
      console.log("The new dominant speaker in the Room is:", participant);
      //this.dominantSpeakerChanged(participant);
    });
    const client = await Chat.Client.create(this.props.token);

    client.on("tokenAboutToExpire", async () => {
      const token = await this.getToken(
        this.props.room.localParticipant.identity
      );
      client.updateToken(token);
    });

    client.on("tokenExpired", async () => {
      const token = await this.getToken(
        this.props.room.localParticipant.identity
      );
      client.updateToken(token);
    });
    client.on("channelJoined", async (channel) => {
      // getting list of all messages since this is an existing channel
      const messages = await channel.getMessages();
      this.setState({ messages: messages.items || [] });
      this.scrollToBottom();
    });

    try {
      const channel = await client.getChannelByUniqueName(this.props.room.name);
      this.joinChannel(channel);
    } catch (err) {
      try {
        const channel = await client.createChannel({
          uniqueName: this.props.room.name,
          friendlyName: this.props.room.name,
        });

        this.joinChannel(channel);
      } catch {
        throw new Error("Unable to create channel, please reload this page");
      }
    }
    window.addEventListener("beforeunload", this.leaveRoom);
  }
  scrollToBottom() {
    /* const scrollHeight = this.scrollDiv.current.scrollHeight;
    const height = this.scrollDiv.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;*/
  }
  getToken = async (email) => {
    const response1 = await fetch(
      `https://demo.lykstage.com:5000/token/${email}`
    );
    const data1 = await response1.json();

    return data1.token;
  };
  componentWillUnmount() {
    this.leaveRoom();
  }
  dominantSpeakerChanged(participant) {
    this.setState({
      dominantParticpant: participant,
    });
  }
  joinChannel = async (channel) => {
    if (channel.channelState.status !== "joined") {
      await channel.join();
    }

    this.setState({
      channel: channel,
      loading: false,
    });

    channel.on("messageAdded", this.handleMessageAdded);
    this.scrollToBottom();
  };

  handleMessageAdded = (message) => {
    const { messages } = this.state;
    this.setState(
      {
        messages: [...messages, message],
      },
      this.scrollToBottom
    );
  };
  addParticipant(participant) {
    console.log(`${participant.identity} has joined the room.`);
    this.setState({
      remoteParticipants: [...this.state.remoteParticipants, participant],
    });
  }

  removeParticipant(participant) {
    console.log(`${participant.identity} has left the room`);

    this.setState({
      remoteParticipants: this.state.remoteParticipants.filter(
        (p) => p.identity !== participant.identity
      ),
    });
  }
  showChat() {
    this.setState({
      showChat: true,
    });
  }
  hideChat() {
    this.setState({
      showChat: false,
    });
  }
  leaveRoom() {
    if (this.state.screenCaptureRoom !== null) {
      this.state.screenCaptureRoom.disconnect();
    }
    this.props.room.disconnect();
    this.props.returnToLobby();
  }
  async screenCapture() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 15 },
    });

    const screenTrack = new LocalVideoTrack(stream.getTracks()[0], {
      name: "myscreenshare",
    });
    const token = await this.getToken(
      this.props.room.localParticipant.identity + "-Copy"
    );
    const room1 = await connect(token, {
      name: this.props.room.localParticipant.identity + "-Copy",
      tracks: [screenTrack],
    });

    // screenTrack.once("stopped", () => {
    //   room1.localParticipant.unpublishTrack(screenTrack);
    // });
    //this.props.room.localParticipant.publishTrack(screenTrack);
    //room1.localParticipant.publishTrack(screenTrack);
    this.setState({
      screenCaptureRoom: room1,
      screenTrack: screenTrack,
      isScreenTrack: true,
    });
    //console.log(JSON.stringify(this.props.room));
  }

  async stopScreenCapture() {
    // this.state.screenCaptureRoom.localParticipant.unpublishTrack(
    //   this.state.screenTrack
    // );
    this.state.screenTrack.stop();
    // const tracks = await createLocalTracks({
    //   video: { facingMode: "user" },
    //   audio: true,
    // });
    //const track = new LocalVideoTrack();
    // Join the Room with the pre-acquired LocalTracks.
    // const room = await connect(this.props.token, {
    //   name: this.props.room.name,
    //   tracks,
    // });

    // const cameraTrack = tracks.find((track) => track.kind === "video");

    // // Switch to the back facing camera.
    // cameraTrack.restart({ facingMode: "environment" });
    // //this.props.room.localParticipant.publishTrack(track);
    this.state.screenCaptureRoom.disconnect();
    this.setState({
      screenTrack: null,
      isScreenTrack: false,
      screenCaptureRoom: null,
    });
  }
  async audioMute() {
    this.props.room.localParticipant.audioTracks.forEach((audioTrack) => {
      audioTrack.track.disable();
    });
    this.setState({
      isMute: true,
    });
  }
  async audioUnMute() {
    this.props.room.localParticipant.audioTracks.forEach((audioTrack) => {
      audioTrack.track.enable();
    });
    this.setState({
      isMute: false,
    });
  }

  async videoStop() {
    this.props.room.localParticipant.videoTracks.forEach((videoTrack) => {
      videoTrack.track.disable();
      //videoTrack.track.stop();
      //videoTrack.unpublish();
    });
    this.setState({
      isVideo: false,
    });
  }
  async videoResume() {
    this.props.room.localParticipant.videoTracks.forEach((videoTrack) => {
      videoTrack.track.enable();
    });
    /*createLocalVideoTrack()
      .then((localVideoTrack) => {
        return this.props.room.localParticipant.publishTrack(localVideoTrack);
      })
      .then((publication) => {
        console.log("Successfully unmuted your video:", publication);
      });*/
    this.setState({
      isVideo: true,
    });
  }
  sendMessage = () => {
    if (this.state.text) {
      console.log(this.state.text);
      this.setState({ loading: true });
      this.state.channel.sendMessage(String(this.state.text).trim());
      this.setState({ text: "", loading: false });
    }
  };
  render() {
    return (
      <div className="room">
        <div id="dominant-participant">
          {this.state.dominantParticpant === null ? (
            <>
              <Participant
                key={this.props.room.localParticipant.identity}
                localParticipant="true"
                dominantParticpant="true"
                participant={this.props.room.localParticipant}
              />
            </>
          ) : (
            <>
              <Participant
                key={this.state.dominantParticpant.identity}
                dominantParticpant="true"
                participant={this.state.dominantParticpant}
              />
            </>
          )}
        </div>

        <div id="chat-bar" hidden={!this.state.showChat}>
          <Box sx={{ flexGrow: 1 }}>
            <Backdrop open={this.state.loading} style={{ zIndex: 99999 }}>
              <CircularProgress style={{ color: "white" }} />
            </Backdrop>

            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6">
                  {`Room: ${this.props.room.name}`}
                </Typography>
              </Toolbar>
            </AppBar>

            <CssBaseline />

            <Grid container direction="column" style={styles.mainGrid}>
              <Grid item style={styles.gridItemChatList} ref={this.scrollDiv}>
                <List dense={true}>
                  {this.state.messages &&
                    this.state.messages.map((message) => (
                      <ChatItem
                        key={message.index}
                        message={message}
                        email={this.props.room.localParticipant.identity}
                      />
                    ))}
                </List>
              </Grid>

              <Grid item style={styles.gridItemMessage}>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item style={styles.textFieldContainer}>
                    <TextField
                      required
                      style={styles.textField}
                      placeholder="Enter message"
                      variant="outlined"
                      multiline
                      rows={2}
                      value={this.state.text}
                      onChange={(event) =>
                        this.setState({ text: event.target.value })
                      }
                    />
                  </Grid>

                  <Grid item>
                    <IconButton
                      style={styles.sendButton}
                      onClick={this.sendMessage}
                    >
                      <Send style={styles.sendIcon} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </div>

        <div id="participant-bar">
          <Participant
            key={this.props.room.localParticipant.identity}
            localParticipant="true"
            participant={this.props.room.localParticipant}
            getParticipant={() => this.dominantSpeakerChanged(null)}
          />

          {this.state.remoteParticipants.map((participant) => (
            <Participant
              key={participant.identity}
              participant={participant}
              getParticipant={() => this.dominantSpeakerChanged(participant)}
            />
          ))}
        </div>
        <div id="button-bar">
          <ul>
            <li id="leaveRoom" onClick={this.leaveRoom}>
              <MdCallEnd></MdCallEnd>
            </li>
            {this.state.isMute === false ? (
              <>
                <li id="mute" onClick={this.audioMute}>
                  <AiOutlineAudio></AiOutlineAudio>
                </li>
              </>
            ) : (
              <>
                <li id="unmute" onClick={this.audioUnMute}>
                  <AiOutlineAudioMuted></AiOutlineAudioMuted>
                </li>
              </>
            )}
            {this.props.isVideoOn === true ? (
              <>
                {this.state.isScreenTrack === false ? (
                  <>
                    <li
                      id="screenCapture"
                      className="bb"
                      onClick={this.screenCapture}
                    >
                      <TbCapture></TbCapture>
                    </li>
                  </>
                ) : (
                  <>
                    <li id="stopScreenCapture" onClick={this.stopScreenCapture}>
                      <TbCaptureOff></TbCaptureOff>
                    </li>
                  </>
                )}
                {this.state.isVideo === true ? (
                  <>
                    <li id="videoStop" onClick={this.videoStop}>
                      <MdVideocam></MdVideocam>
                    </li>
                  </>
                ) : (
                  <>
                    <li id="videoResume" onClick={this.videoResume}>
                      <MdVideocamOff></MdVideocamOff>
                    </li>
                  </>
                )}
              </>
            ) : (
              <></>
            )}
            {this.state.showChat === false ? (
              <>
                <li id="showChat" onClick={this.showChat}>
                  <BsChatDotsFill></BsChatDotsFill>
                </li>
              </>
            ) : (
              <>
                <li id="hideChat" onClick={this.hideChat}>
                  <BsChatDots></BsChatDots>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
const styles = {
  textField: { width: "100%", borderWidth: 0, borderColor: "transparent" },
  textFieldContainer: { flex: 1, marginRight: 12 },
  gridItem: { paddingTop: 12, paddingBottom: 12 },
  gridItemChatList: { overflow: "auto", height: "43vh" },
  gridItemMessage: { marginTop: 12, marginBottom: 12 },
  sendButton: { backgroundColor: "#3f51b5" },
  sendIcon: { color: "white" },
  mainGrid: { paddingTop: 0, borderWidth: 1 },
};
export default Room;
