import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { AlertMessage, ImageName } from '../../../../../enums';
import { consoleLog, SetDateFormat, SetDOBFormat } from '../../../../../services/common-function';
import { InputText, MultiSelectBox, SelectBox } from '../../../../Admin/SharedComponents/inputText';
import ReactLoader from '../../../../Loader';
import Header from '../../../Header/Header';
import Sidebar from '../../../Sidebar/Sidebar';
import moment from "moment";

import history from '../../../../../history';
import { ApiCallVendor } from '../../../../../services/middleware';
import { ErrorCode } from '../../../../../services/constant';
import { inputEmptyValidate } from '../../../../../validators';

export default class EditReminder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      hour: "08",
      min: "00",
      ampm: "AM",
      startDate: "",
      maxDate: "",
      selectedJobDuration: {
        label: "1:00 Hour",
        value: "1 Hour",
      },
      jobDuration: "1 Hour",
    }
  }
  componentDidMount() {
    this.load();

    let mainData = this.props.location,
      preData = mainData.state;
    // consoleLog("data:::::",preData);
    let timeArr = preData.time.split(":");
    // consoleLog("::::::::",timeArr)


    this.setState({
      startDate: SetDOBFormat(preData.date),
      hour: timeArr[0],
      min: timeArr[1],
      ampm: preData.prefix
    })


  }
  load = () => {
    // .............date...................

    var dtToday = new Date();

    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if (month < 10) month = "0" + month.toString();
    if (day < 10) day = "0" + day.toString();

    var maxDate = year + "-" + month + "-" + day;
    // consoleLog("date::::", maxDate);

    this.setState({

      maxDate: maxDate,
      isLoad: false,
    });

    this.listApi();
  }

  listApi = async () => {
    // let res  = await ApiCallVendor("")
  }

  hourChange = () => {
    let hr = parseInt(this.state.hour) + 1;
    if (parseInt(this.state.hour) + 1 > 12) {
      this.setState({
        hour: "01",
      });
    } else {
      if (parseInt(this.state.hour) + 1 > 9) {
        this.setState({
          hour: hr,
        });
      } else {
        this.setState({
          hour: "0" + hr,
        });
      }
    }
  };

  minChange = () => {
    let min = parseInt(this.state.min) + 1;
    if (parseInt(this.state.min) + 1 > 59) {
      this.setState({
        min: "00",
      });
    } else {
      if (parseInt(this.state.min) + 1 > 9) {
        this.setState({
          min: min,
        });
      } else {
        this.setState({
          min: "0" + min,
        });
      }
    }
  };

  ampmChange = () => {
    if (this.state.ampm === "AM") {
      this.setState({
        ampm: "PM",
      });
    } else {
      this.setState({
        ampm: "AM",
      });
    }
  };

  startDateChange = (e) => {
    let dat = SetDateFormat(moment().toDate());
    // consoleLog("date", dat);
    this.setState({
      startDate: e.target.value,
    });
  };

  getDateReqInfoForApi = (date, hour, minute, amp) => {
    try {
      let resDate = "";
      if (date) {
        const currentDate = new Date(date);
        let year = currentDate.getFullYear();
        let day = ("0" + currentDate.getDate()).slice(-2);
        let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        resDate = year + "/" + month + "/" + day + " " + hour + ":" + minute + " " + amp;
      }
      return resDate;
    } catch (err) {
      console.log(err)
    }
  }
  onCancel = (e) => {
    return history.push("/vendorReminderList");
  };
  onNext = async (item, key) => {
    let mainData = this.props.location,
      preData = mainData.state
    let errorCount = 0;

    let validateDate = inputEmptyValidate(this.state.startDate)

    if (validateDate === false) {
      toast.error(AlertMessage.MESSAGE.REMINDER.EMPTY_DATE);
      errorCount++;
    }

    if (errorCount === 0) {

      let ss = this.getDateReqInfoForApi(this.state.startDate, this.state.hour, this.state.min, this.state.ampm);
      // consoleLog("++++++++++++",ss)
      let res = await ApiCallVendor("updateUserAlert", { datetime: ss, id: preData.id })
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(
          AlertMessage.MESSAGE.NOTIFICATION.NOTIFICATION_CREATE_SUCCESS,
          {
            hideProgressBar: true,
          }
        );

        return history.push("/vendorReminderList");
      } else {
        if (
          res.error === ErrorCode.ERROR.ERROR.WITH_ERROR &&
          res.respondcode === ErrorCode.ERROR.ERROR_CODE.INTERNAL_SERVER_ERROR
        ) {
          toast.error(res.message, {
            hideProgressBar: true,
          });
        }
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer hideProgressBar theme="colored" />
        {/* <div class="component-wrapper"> */}
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>
        <div className="component-wrapper" hidden={this.state.isLoad}>
          {/* <div className="component-wrapper"> */}
          <h3 className="dcs">EDIT REMINDER</h3>
          <div className="row">
            <div className="col-md-9">
              <div className="department-component-app _fl sdw">
                <h3>REMINDER DETAILS</h3>




                <React.Fragment>
                  <div className="department-form">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="form_rbx">
                          <span className="">Schedule Date & Time</span>
                          <div className="form-input-fields unstyled">
                            <input
                              type="date"
                              id="from_datepicker"
                              min={this.state.maxDate}
                              className="textbox4 d-icon"
                              value={this.state.startDate}
                              placeholder="Select"
                              onChange={this.startDateChange}
                              style={{
                                borderRadius: "9px",
                                boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <span classN></span>
                        <div className="t-time" style={{ marginTop: "20px" }}>
                          <span className="t1">
                            <small>
                              <input
                                type="text"
                                placeholder=""
                                value={this.state.hour}
                                className="tsd2"
                                readonly
                              />
                              <br />
                              <img
                                src={ImageName.IMAGE_NAME.B_ARROW}
                                alt=""
                                style={{ cursor: "pointer" }}
                                onClick={this.hourChange}
                              />
                            </small>
                          </span>
                          <span className="t2">
                            <small>
                              <input
                                type="text"
                                placeholder=""
                                value={this.state.min}
                                className="tsd2"
                                readonly
                              />
                              <br />
                              <img
                                src={ImageName.IMAGE_NAME.B_ARROW}
                                alt=""
                                style={{ cursor: "pointer" }}
                                onClick={this.minChange}
                              />
                            </small>
                          </span>
                          <span className="t3" style={{ marginLeft: "2%" }}>
                            <small>
                              <input
                                type="text"
                                placeholder=""
                                value={this.state.ampm}
                                className="tsd2"
                                readonly
                              />
                              <br />
                              <img
                                src={ImageName.IMAGE_NAME.B_ARROW}
                                alt=""
                                style={{ cursor: "pointer" }}
                                onClick={this.ampmChange}
                              />
                            </small>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="department-form">
                            <div className="row">
                              <div className="col-md-5">
                                <div className="web-form-bx">
                                  <div className="frm-label">Start Date</div>
                                  <div className="form-input-fields unstyled">
                                    <input
                                      type="date"
                                      id="from_datepicker"
                                      min={this.state.maxDate}
                                      // maxDate={moment().toDate()}
                                      className="textbox4 d-icon"
                                      value={this.state.startDate}
                                      placeholder="Select"
                                      onChange={this.startDateChange}
                                      style={{
                                        // textAlign: "center",
                                        borderRadius: "9px",
                                        boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-2"></div>
                              <div className="col-md-5">
                                <div className="web-form-bx">
                                  <div className="frm-label">End Date</div>
                                  <div className="form-input-fields unstyled">
                                    <input
                                      type="date"
                                      id="from_datepicker"
                                      min={this.state.maxDate}
                                      className="textbox4 d-icon"
                                      value={this.state.endDate}
                                      placeholder="Select"
                                      onChange={this.endDateChange}
                                      style={{
                                        // textAlign: "center",
                                        borderRadius: "9px",
                                        boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div> */}
                </React.Fragment>


                <div className="department-form"></div>

                <div className="_button-style m30 _fl text-center">
                  <a
                    className="white-btn notification-btn"
                    style={{ textDecoration: "none" }}
                    onClick={this.onCancel}
                  >
                    Cancel
                  </a>
                  <a
                    className="blue-btn notification-btn"
                    style={{ textDecoration: "none" }}
                    onClick={this.onNext}
                  >
                    Submit
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}