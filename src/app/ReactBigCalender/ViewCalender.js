import React, { Component, useState, useRef } from "react";
import ReactDOM, { render } from "react-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Overlay, Tooltip, Popover } from "react-bootstrap";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./calender.css";
import { consoleLog, SetDateFormat, SetTimeFormat } from "../../services/common-function";

const localizer = momentLocalizer(moment);

const IconStyle = {
  cursor: "pointer",
};

const checkStatusName = (status) =>{
  if(status === 0){
    return "Pending"
  } else if(status === 1){
    return "Quote Sent"
  } else if(status === 2){
    return "Quote Accepted"
  } else if(status === 3){
    return "offer Sent"
  } else if(status === 4){
    return "Offer Accepted"
  } else if(status === 5){
    return "Offer Rejected"
  } else if(status === 6){
    return "Bids Received"
  } else if(status === 7){
    return "Quote Rejected"
  } else if(status === 8){
    return "Assigned"
  } else if(status === 9){
    return "In Progress"
  } else if(status === 10){
    return "completed"
  } else if(status === 11){
    return "cancelled"
  } else {
    return "N/A"
  }
}

const TooltipContent = ({ onClose, event }) => {
  return (
    <React.Fragment>
      <Popover id="popover-basic">
        {/* <Popover.Header as="h3" style={{backgroundColor:"grey"}}>{event.title}</Popover.Header> */}
        <Popover.Body style={{ fontSize: "10px", width: "150px" }}>
          
          <strong>Job #: </strong>
          {event.event.projectId}
          {<br />}
          <strong>Title : </strong>
          {event.event.title}
          {<br />}
          <strong>Status : </strong>
          {checkStatusName(event.event.status)}
          {<br />}
          <strong>Client: </strong>
          {event.event.consumer}
          {<br />}
          <strong>Date/Time: </strong>
          {event.event.dateTime}
          {<br />}
        </Popover.Body>
      </Popover>
    </React.Fragment>
  );
};

function Event(event) {
  const [showTooltip, setShowTooltip] = useState(false);

  const closeTooltip = () => {
    setShowTooltip(false);
  };

  const openTooltip = () => {
    setShowTooltip(true);
  };
  const ref = useRef(null);

  const getTarget = () => {
    return ReactDOM.findDOMNode(ref.current);
  };


  return (
    <div ref={ref}>
      <div onMouseOver={openTooltip} onMouseOut={closeTooltip}>
        {/* {console.log(event)} */}
        {event.title}
        <Overlay
          rootClose
          target={getTarget}
          show={showTooltip}
          placement="right"
          onHide={closeTooltip}
        >
          <Tooltip id="">
            <TooltipContent event={event} onClose={closeTooltip} />
          </Tooltip>
        </Overlay>
      </div>
    </div>
  );
}

export default class ViewCalender extends Component {
  constructor(props) {
    super(props);
    const now = new Date();
    this.state = {
      name: "React",
      events: [],
      value: [],
    };
  }

  componentWillMount() {
    this.load()
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  load = () => {
    let arr = [];
    // consoleLog("This.props id:::", this.props.id);
    // consoleLog("Type ::", this.props.type)
    if(this.props.type === "job") {
    this.props.id.map((item, key) => {
      // consoleLog("Moment::", moment(item.date+"T"+item.time).format())
      arr.push({
        id: item.id,
        title: item.sourceLanguage + " > " + item.targetLanguage,
        start: new Date(moment(item.date + "T" + item.time).format()),
        end: new Date(moment(item.date + "T" + item.time).format()),
        projectId: item.requestId,
        curIndex: key,
        consumer: item.clientName,
        dateTime: SetDateFormat(item.date) + " | " + SetTimeFormat(moment(item.date + "T" + item.time).format()),
        status: item.status,
      })
    });
  } else if(this.props.type === "translation"){
    this.props.id.map((item, key) => {
      // consoleLog("Moment::", moment(item.date+"T"+item.time).format())
      arr.push({
        id: item.id,
        title: item.language,
        start: new Date(moment(item.date + "T" + item.time).format()),
        end: new Date(moment(item.date + "T" + item.time).format()),
        projectId: item.requestId,
        curIndex: key,
        consumer: item.clientName,
        dateTime: SetDateFormat(item.date) + " | " + SetTimeFormat(moment(item.date + "T" + item.time).format()),
        status: item.status,
      })
    });
  }

    // consoleLog("Props>>", this.props.id);

    // consoleLog("Event data in calender :", arr)

    this.setState({
      events: arr
    })

  }

  //...............for custom styling event...................

  eventStyleGetter = (event, start, end, isSelected) => {
    // console.log(event);
    // var backgroundColor = '#' + event.hexColor;
    var backgroundColor =
      event.status === 0
        ? "#cc9f53"
        : event.status === 1
          ? "#03a0df"
          : event.status === 2
            ? "#6ba565"
            : event.status === 3
              ? "#03a0df"
              : event.status === 4
                ? "#035d83"
                : event.status === 5
                  ? "#993921"
                  : event.status === 6
                    ? "#035d83"
                    : event.status === 7
                      ? "#993921"
                      : event.status === 8
                        ? "#6ba565"
                        : event.status === 9
                          ? "#cc9f53"
                          : event.status === 10
                            ? "#6ba565"
                            : event.status === 11
                              ? "#993921"
                              : "";
    var style = {
      backgroundColor: backgroundColor,
      borderRadius: "25px",
      padding: "2px 10px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };
    return {
      style: style,
    };
  };
  handleSelect = (e) => {
    consoleLog("Event data", e);
    this.props.detailClick(e)
  }

  render() {
    return (
      <div>
        {/* <p>Tool tip</p> */}
        <div style={{ height: "500pt", padding: "10px" }}>
          <Calendar
            selectable
            popup
            views={['month', 'week', 'day']}
            tooltipAccessor={null}
            components={{ event: Event }}
            step={15}
            timeslots={8}
            events={this.state.events}
            startAccessor="start"
            endAccessor="end"
            defaultDate={moment().toDate()}
            localizer={localizer}
            eventPropGetter={this.eventStyleGetter}
            onSelectEvent={this.handleSelect}
          />
        </div>
      </div>
    );
  }
}
