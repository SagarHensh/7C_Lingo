import React, { Component } from "react";
import Avatar from "react-avatar";
import "./App.scss";

class Track extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.getAvatar = this.getAvatar.bind(this);
  }

  componentDidMount() {
    if (
      this.props.track !== null &&
      typeof this.props.track.attach !== "undefined"
    ) {
      var child = this.props.track.attach();
      child.style.transform = "scale(1, 1)";
      child.style["-webkit-transform"] = "scale(1, 1)";

      this.ref.current.classList.add(this.props.track.kind);
      this.ref.current.appendChild(child);
      var redd = this;
      this.props.track.on("disabled", () => {
        console.log(
          "Hide the associated <video> element and show an avatar image."
        );
        //redd.ref.current.appendChild(redd.getAvatar(redd.props.identity));
      });
    }
  }
  getAvatar(name) {
    return (
      <Avatar
        color={Avatar.getRandomColor("sitebase", ["red", "green", "blue"])}
        name={name}
      />
    );
  }
  render() {
    return <div className="track" ref={this.ref}></div>;
  }
}

export default Track;
