import Select, { components } from "react-select";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import ReactLoader from "../../../../Loader";
import "./addNotification.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  InputText,
  MultiSelectBox,
  SelectBox,
} from "../../../SharedComponents/inputText";
import { AlertMessage, ImageName } from "../../../../../enums";
import history from "../../../../../history";
import { inputEmptyValidate } from "../../../../../validators";
import {
  consoleLog,
  getLookUpDataFromAPI,
  SetDateFormat,
  SetDOBFormat,
  SetScheduleDate,
  SetUSAdateFormat,
} from "../../../../../services/common-function";
import { ApiCall } from "../../../../../services/middleware";
import { ErrorCode } from "../../../../../services/constant";
import { Decoder } from "../../../../../services/auth";
import moment from "moment";
import { Link } from "react-router-dom";

import DatePicker from "react-datepicker";

const jobDuration = [
  {
    label: "1:00 Hour",
    value: "1 Hour",
  },
  {
    label: "2:00 Hour",
    value: "2 Hour",
  },
  {
    label: "3:00 Hour",
    value: "3 Hour",
  },
  {
    label: "5:00 Hour",
    value: "5 Hour",
  },
  {
    label: "10:00 Hour",
    value: "10 Hour",
  },
  {
    label: "20:00 Hour",
    value: "20 Hour",
  },
  {
    label: "1 Day",
    value: "1 Day",
  },
  {
    label: "2 Day",
    value: "2 Day",
  },
  {
    label: "3 Day",
    value: "3 Day",
  },
];

const notificationTypeArr = [
  {
    label: "Email",
    value: "0",
  },
  {
    label: "Push",
    value: "1",
  },
];
const recipientArr = [
  {
    label: "John",
    value: "0",
  },
  {
    label: "Clark",
    value: "1",
  },
  {
    label: "Steve",
    value: "2",
  },
];
const statusArr = [
  {
    label: "Schedule",
    value: "0",
  },
  {
    label: "Publish",
    value: "1",
  },
];

// CKEditor.editorConfig = function( config )
// {
//     // Define changes to default configuration here. For example:
//     // config.language = 'fr';
//     // config.uiColor = '#AADC6E';
//     config.height = '800px';
// };

ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      "heading",
      "|",
      "bold",
      "italic",
      "|",
      "bulletedList",
      "numberedList",
      "|",
      "insertTable",
      "|",
      "undo",
      "redo",
    ],
  },
  image: {
    toolbar: [
      "imageStyle:full",
      "imageStyle:side",
      "|",
      "imageTextAlternative",
    ],
  },
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
  language: "en",
};

export default class AddNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      notificationTitle: "",
      notificationTypeArr: [],
      notificationTypeData: {},
      recipientTypeArr: [],
      recipientTypeData: {},
      recipientArr: [],
      allRecipientArr: [],
      recipientData: [],
      recipientArrData: [],
      body: "",
      emailBody: "",
      statusArr: [],
      statusData: {},
      startDate: "",
      endDate: "",
      maxDate: "",

      hour: "08",
      min: "00",
      ampm: "AM",
      allJobDuration: jobDuration,
      selectedJobDuration: {
        label: "1:00 Hour",
        value: "1 Hour",
      },
      jobDuration: "1 Hour",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
  }

  //    strip_html_tags = (str) =>
  // {
  //    if ((str===null) || (str===''))
  //        return false;
  //   else
  //    str = str.toString();
  //   return str.replace(/<[^>]*>/g, '');
  // }

  load = async () => {
    let recipientArrData = [
      {
        label: "All",
        value: "0",
      },
    ];
    let lookUpData = await getLookUpDataFromAPI();
    // consoleLog("___---", lookUpData.USER_TYPE);
    let userTypeArr = lookUpData.USER_TYPE;
    for (let i = 1; i < userTypeArr.length; i++) {
      recipientArrData.push({
        label: userTypeArr[i].name,
        value: userTypeArr[i].id,
      });
    }

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
      recipientTypeArr: recipientArrData,
      maxDate: maxDate,
      isLoad: false,
    });
  };

  onTitleChange = (data) => {
    this.setState({
      notificationTitle: data,
    });
  };
  onNotificationTypeChange = (data) => {
    this.setState({
      notificationTypeData: data,
    });
  };
  onRecipientTypeChange = async (data) => {
    this.setState({
      recipientData: [],
    });
    let recipientArrdata = [],
      recipientArrAllData = [
        {
          label: "All",
          value: "0",
        },
      ],
      recipientArr = [
        {
          label: "All",
          value: "0",
        },
      ];

    let reqData = {
      reqUserTypeId: data.value,
    };
    let res = await ApiCall("getUserListByUserType", reqData);
    // consoleLog("OO)O)O)O)", res);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      let decodeData = Decoder.decode(res.data.payload);
      // consoleLog("++++++", decodeData);
      recipientArrdata = decodeData.data.userList;
      for (let i = 0; i < recipientArrdata.length; i++) {
        recipientArr.push({
          label: recipientArrdata[i].name,
          value: recipientArrdata[i].userId,
        });
        recipientArrAllData.push({
          label: recipientArrdata[i].name,
          value: recipientArrdata[i].userId,
        });
      }
    }

    this.setState({
      recipientTypeData: data,
      recipientArr: recipientArr,
      allRecipientArr: recipientArrAllData,
    });
  };
  onRecipientsChange = (value) => {
    // consoleLog("data:::", data[].label);
    let arr = [],
      crr = [],
      brr = [];

    if (value.length > 0) {
      value.map((data) => {
        if (data.label === "All") {
          arr = [];
          crr = [
            {
              label: "All",
              value: "0",
            },
          ];

          value.map((ln) => {
            arr.push(ln.value);
          });
          this.setState({
            recipientArr: [],
          });
        } else {
          arr.push(data.value);
          crr = value;
        }
      });
    } else {
      this.state.allRecipientArr.map((ln) => {
        brr.push(ln);
      });
      this.setState({
        recipientArr: brr,
      });
    }

    consoleLog("recipient::", crr);

    this.setState({
      recipientArrData: arr,
      recipientData: crr,
    });
  };
  onBodyChange = (e) => {
    this.setState({
      body: e.target.value,
    });
  };
  onStatusChange = (data) => {
    // consoleLog(">>>>>>>>>>>>>>>>..", data);
    this.setState({
      statusData: data,
    });
  };

  startDateChange = (date) => {
    let dat = SetDateFormat(moment().toDate());
    // consoleLog("date", dat);
    this.setState({
      startDate: SetUSAdateFormat(date),
    });
  };
  endDateChange = (e) => {
    this.setState({
      endDate: e.target.value,
    });
  };

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

  hourChangeUp = () => {
    let hr = parseInt(this.state.hour) - 1;
    if (hr < 1) {
      this.setState({
        hour: "12",
      });
    } else {
      if (hr > 9) {
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
  minChangeUp = () => {
    let min = parseInt(this.state.min) - 1;
    if (min < 0) {
      this.setState({
        min: "59",
      });
    } else {
      if (min > 9) {
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

  onCancel = (e) => {
    return history.push("/adminNotificationList");
  };
  onNext = async () => {

    let modHour = this.state.hour + ":" + this.state.min + " " + this.state.ampm ;
    var dt = moment(modHour, ["h:mm A"]).format("HH:mm");
    window.scrollTo(0, 0);
    let errorCount = 0;

    let validateNotificationTitle = inputEmptyValidate(
      this.state.notificationTitle
    );
    let validateNotificationType = inputEmptyValidate(
      this.state.notificationTypeData.value
    );
    let validateRecipient = inputEmptyValidate(this.state.recipientData);
    let validateRecipientType = inputEmptyValidate(
      this.state.recipientTypeData.value
    );
    let validateBody = inputEmptyValidate(this.state.body);
    let validateEmailBody = inputEmptyValidate(this.state.emailBody);
    let validateStatus = inputEmptyValidate(this.state.statusData.value);
    let validateDate = inputEmptyValidate(this.state.startDate);

    if (validateNotificationTitle === false) {
      toast.error(AlertMessage.MESSAGE.NOTIFICATION.EMPTY_TITLE);
      errorCount++;
    } else if (validateNotificationType === false) {
      toast.error(AlertMessage.MESSAGE.NOTIFICATION.EMPTY_NOTIFICATION_TYPE);
      errorCount++;
    } else if (validateRecipientType === false) {
      toast.error(AlertMessage.MESSAGE.NOTIFICATION.EMPTY_RECIPIENT_TYPE);
      errorCount++;
    } else if (
      this.state.notificationTypeData.label === "Email" &&
      validateEmailBody === false
    ) {
      // if (validateEmailBody === false) {
      toast.error(AlertMessage.MESSAGE.NOTIFICATION.EMPTY_BODY);
      errorCount++;
      // }
    } else if (
      this.state.notificationTypeData.label === "Push" &&
      validateBody === false
    ) {
      // if (validateBody === false) {
      toast.error(AlertMessage.MESSAGE.NOTIFICATION.EMPTY_BODY);
      errorCount++;
      // }
    } else if (validateStatus === false) {
      toast.error(AlertMessage.MESSAGE.NOTIFICATION.EMPTY_STATUS);
      errorCount++;
    } else if (this.state.statusData.value === "0") {
      if (validateDate === false) {
        toast.error(AlertMessage.MESSAGE.NOTIFICATION.EMPTY_DATE);
        errorCount++;
      }
    }

    if (errorCount === 0) {
      let data = {
        title: this.state.notificationTitle,
        notificationType: this.state.notificationTypeData.value,
        recipientType: this.state.recipientTypeData.value,
        recipients:
          this.state.recipientArrData.length === 0
            ? ["All"]
            : this.state.recipientArrData,
        // body: this.state.body,
        body:
          this.state.notificationTypeData.label === "Email"
            ? this.state.emailBody
            : this.state.body,
        status: this.state.statusData.value,
        startDate:this.state.statusData.value === "0" ? SetDOBFormat(this.state.startDate) : "",
        // endDate: this.state.endDate,
        scheduleTime:this.state.statusData.value === "0" ?  this.state.hour + ":" + this.state.min + ":00" : "",
        scheduleTimeUnit: this.state.ampm,
      };

      consoleLog("req::::", data);

      let res = await ApiCall("createNotification", data);

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

        return history.push("/adminNotificationList");
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
  };
  onEditorChange = (evnt, editr) => {
    let data = editr.getData();
    consoleLog("data:::", data);
    // let s = strip_html_tags(data)
    this.setState({
      emailBody: data,
    });
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer hideProgressBar theme="colored" />
        {/* <div class="component-wrapper"> */}
        <div class="component-wrapper" hidden={!this.state.isLoad}>
          <ReactLoader />
        </div>
        <div className="component-wrapper" hidden={this.state.isLoad}>
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            {" "}
            <Link to="/adminDashboard">Dashboard</Link> /{" "}
            <Link to="/adminNotificationList">Notification</Link> / Add
            Notification
          </div>
          {/* <div className="component-wrapper"> */}
          <h3 className="dcs">ADD NEW NOTIFICATION</h3>
          <div className="row">
            <div className="col-md-9">
              <div className="department-component-app _fl sdw">
                <h3>NOTIFICATION DETAILS</h3>
                <div className="department-form">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Notification Title *</span>
                        <InputText
                          placeholder=""
                          className="in-field2"
                          value={this.state.notificationTitle}
                          onTextChange={(value) => {
                            this.onTitleChange(value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Notification Type *</span>
                        <SelectBox
                          optionData={notificationTypeArr}
                          value={this.state.notificationTypeData}
                          placeholder="Select"
                          onSelectChange={(value) => {
                            this.onNotificationTypeChange(value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="department-form">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Recipient Type *</span>
                        <div className="dropdwn">
                          <SelectBox
                            optionData={this.state.recipientTypeArr}
                            value={this.state.recipientTypeData}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onRecipientTypeChange(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5">
                      <div className="form_rbx">
                        {" "}
                        <span className="">Recipient(s)</span>
                        <MultiSelectBox
                          isDisabled={
                            this.state.recipientTypeData.label === "All"
                              ? true
                              : false
                          }
                          optionData={this.state.recipientArr}
                          placeholder="Select"
                          value={this.state.recipientData}
                          onSelectChange={(value) =>
                            this.onRecipientsChange(value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="department-form">
                  {this.state.notificationTypeData.label === "Email" ? (
                    <React.Fragment>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form_rbx">
                            <span className="">Body *</span>
                            <div className="editor">
                              <CKEditor
                                editor={ClassicEditor}
                                data={this.state.emailBody}
                                onReady={(editor) => {
                                  // You can store the "editor" and use when it is needed.
                                  // console.log("Editor is ready to use!", editor);
                                  editor.editing.view.change((writer) => {
                                    writer.setStyle(
                                      "height",
                                      "100px",

                                      editor.editing.view.document.getRoot()
                                    );
                                  });
                                }}
                                // onChange={(event, editor) => {
                                //   const data = editor.getData();
                                //   console.log({ event, editor, data });
                                // }}
                                onChange={(event, editor) =>
                                  this.onEditorChange(event, editor)
                                }
                                onBlur={(event, editor) => {
                                  console.log("Blur.", editor);
                                }}
                                onFocus={(event, editor) => {
                                  console.log("Focus.", editor);
                                }}
                                onInit={(editor) => {
                                  // You can store the "editor" and use when it is needed.
                                  // console.log("Editor is ready to use!", editor);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Status *</span>
                            <div className="dropdwn">
                              <SelectBox
                                optionData={statusArr}
                                value={this.state.statusData}
                                placeholder="Select"
                                onSelectChange={(value) => {
                                  this.onStatusChange(value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div className="row">
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Body *</span>
                            <textarea
                              placeholder="......."
                              className="in-textarea min"
                              value={this.state.body}
                              onChange={(value) => {
                                this.onBodyChange(value);
                              }}
                              style={{ borderRadius: "10px", resize: "none" }}
                            ></textarea>
                          </div>
                        </div>
                        <div className="col-md-2"></div>
                        <div className="col-md-5">
                          <div className="form_rbx">
                            {" "}
                            <span className="">Status *</span>
                            <div className="dropdwn">
                              <SelectBox
                                optionData={statusArr}
                                value={this.state.statusData}
                                placeholder="Select"
                                onSelectChange={(value) => {
                                  this.onStatusChange(value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                </div>
                {this.state.statusData.value === "0" ? (
                  <React.Fragment>
                    <div className="department-form">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="form_rbx">
                            <div className="frm-label">
                              Schedule Date & Time *
                            </div>

                            <div
                              className="input-group"
                              style={{
                                width: "100%",
                                borderRadius: "9px",
                                height: "43px",
                                border: "1px solid #ced4da",
                                boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                              }}
                            >
                              <div style={{ width: "80%", padding: "8px" }}>
                                <span>{this.state.startDate}</span>
                              </div>
                              <div style={{ width: "20%" }}>
                                <a style={{ float: "right" }}>
                                  <DatePicker
                                    dropdownMode="select"
                                    showMonthDropdown
                                    showYearDropdown
                                    adjustDateOnChange
                                    minDate={new Date()}
                                    onChange={(date) =>
                                      this.startDateChange(date)
                                    }
                                    customInput={<Schedule />}
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <span classN></span>
                          <div
                            className="t-time"
                            style={{ marginTop: "-18px" }}
                          >
                            <span className="t1">
                              <small>
                                <img
                                  src={ImageName.IMAGE_NAME.U_IMG}
                                  alt=""
                                  style={{ cursor: "pointer" }}
                                  onClick={this.hourChangeUp}
                                />
                                <br />
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
                                <img
                                  src={ImageName.IMAGE_NAME.U_IMG}
                                  alt=""
                                  style={{ cursor: "pointer" }}
                                  onClick={this.minChangeUp}
                                />
                                <br />
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
                                <img
                                  src={ImageName.IMAGE_NAME.U_IMG}
                                  alt=""
                                  style={{ cursor: "pointer" }}
                                  onClick={this.ampmChange}
                                />
                                <br />
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
                  </React.Fragment>
                ) : (
                  <React.Fragment />
                )}

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
                    Publish
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}
class Schedule extends React.Component {
  render() {
    const { onClick } = this.props;
    return (
      <img
        style={{
          width: "35px",
          height: "37px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        src={ImageName.IMAGE_NAME.CALENDER4}
        onClick={onClick}
      />
    );
  }
}
