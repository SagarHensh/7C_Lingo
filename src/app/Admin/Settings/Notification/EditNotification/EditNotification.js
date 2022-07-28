import Select, { components } from "react-select";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import ReactLoader from "../../../../Loader";
import "./editNotification.css";
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
  SetScheduleDate,
  SetUSAdateFormat,
} from "../../../../../services/common-function";
import { ErrorCode } from "../../../../../services/constant";
import { ApiCall } from "../../../../../services/middleware";
import { Decoder } from "../../../../../services/auth";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from "moment";

const customStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
    borderRadius: "10px",
    height: 50,
    minHeight: 50,
    textAlign: "center",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = "yellow";
    return {
      ...styles,
      color: isFocused ? "grey" : "white",
      color: "#000",
      cursor: isDisabled ? "not-allowed" : "default",
    };
  },
};
const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img
        src={ImageName.IMAGE_NAME.DOWN_ARROW_BLUE}
        style={{ width: "17px" }}
      />
    </components.DropdownIndicator>
  );
};

const notificationTypeArr = [
  {
    label: "Email",
    value: 0,
  },
  {
    label: "Push",
    value: 1,
  },
];
const statusArr = [
  {
    label: "Schedule",
    value: 0,
  },
  {
    label: "Publish",
    value: 1,
  },
];

export default class EditNotification extends React.Component {
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
      recipientData: [],
      recipientArrData: [],
      allRecipientArr : [],
      body: "",
      emailBody: "",
      statusArr: [],
      statusData: {},
      startDate: "",
      endDate: "",

      hour: "08",
      min: "00",
      ampm: "AM",
      maxDate: "",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.load();
  }

  load = async () => {
    let mainData = this.props.location,
      preData = mainData.state;
    let data = {
      notificationId: preData.id,
    };

    this.listApi(data);
  };
  listApi = async (data) => {
    let arrData = {},
      scheduleTimeArr = [],
      mainRecipientArr = [];
    const res = await ApiCall("getNotificationDetails", data);
    // consoleLog("res::::::", res);

    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      consoleLog("res::::::decodedata", decodeData);

      // ..........................................................
      let recipientArrayVal = decodeData.data.recipient;

      for (let u = 0; u < recipientArrayVal.length; u++) {
        mainRecipientArr.push({
          label: u,
          value: recipientArrayVal[u],
        });
      }
      // consoleLog("mainrecipientarr::::::", mainRecipientArr);
      for (let i = 0; i < notificationTypeArr.length; i++) {
        if (decodeData.data.notificationType === notificationTypeArr[i].value) {
          arrData = {
            label: notificationTypeArr[i].label,
            value: notificationTypeArr[i].value,
          };
        }
      }
      let recipientTypeArrDataMain = [
          {
            label: "All",
            value: "0",
          },
        ],
        recipientTypeObjData = {};

      let lookUpData = await getLookUpDataFromAPI();
      consoleLog("___---", lookUpData.USER_TYPE);
      let userTypeArr = lookUpData.USER_TYPE;
      userTypeArr.push({
        name:"All",
        id:"0"
      })
      for (let i = 1; i < userTypeArr.length; i++) {
        recipientTypeArrDataMain.push({
          label: userTypeArr[i].name,
          value: userTypeArr[i].id,
        });
        if (decodeData.data.userTypeId == userTypeArr[i].id) {
          recipientTypeObjData = {
            label: userTypeArr[i].name,
            value: userTypeArr[i].id,
          };
        }
      }

      // .....................................................
      let recipientArrdata = [],
        recipientObjData = [],
        recipientDataArray = [],
        recipientArray = [
          {
            label: "All",
            value: 0,
          },
        ];
      let reqData = {
        reqUserTypeId: decodeData.data.userTypeId,
      };
      let resUser = await ApiCall("getUserListByUserType", reqData);
      if (
        resUser.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        resUser.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let decodeData = Decoder.decode(resUser.data.payload);
        // consoleLog("++++++", decodeData);
        recipientArrdata = decodeData.data.userList;
        // consoleLog("recipient::",recipientArrdata)
        if (decodeData) {
          for (let k = 0; k < recipientArrdata.length; k++) {
            recipientArray.push({
              label: recipientArrdata[k].name,
              value: recipientArrdata[k].userId,
            });
          }

          this.setState({
            recipientArr: recipientArray,
            allRecipientArr:recipientArray
          });

          let brr = [];

          for (let h = 0; h < mainRecipientArr.length; h++) {
            for (let m = 0; m < recipientArray.length; m++) {
              if (mainRecipientArr[h].value === recipientArray[m].value) {
                recipientObjData.push({
                  label: recipientArray[m].label,
                  value: recipientArray[m].value,
                });
                recipientDataArray.push(recipientArrdata[m].userId);
              }
            }
          }

          if(recipientObjData.length > 0){

          for (let z = 0; z < recipientArray.length; z++) {
            if (recipientArray[z].label === "All") {
              recipientArray = [];
            }
          }
        } else {
          this.state.allRecipientArr.map((ln) => {
            brr.push(ln);
          })
          this.setState({
            recipientArr:brr
          })
        }
        }
      }

      // ......................status......................
      let statusArrData = {};

      for (let c = 0; c < statusArr.length; c++) {
        if (decodeData.data.isSent === statusArr[c].value) {
          statusArrData = {
            label: statusArr[c].label,
            value: statusArr[c].value,
          };
        }
      }
         // .......appointment time.........
    // let modHour = decodeData.data.scheduleTime;
   
    // let ampmData = "";

    // var dt = moment(modHour, ["h:mm A"]).format("hh:mm");
    // let tim = dt.split(":");

    // consoleLog("converted Time::", dt);
    // let hourCheck = modHour.split(":");
    // if (hourCheck[0] > 12) {
    //   ampmData = "PM";
    // } else {
    //   ampmData = "AM";
    // }

      // .............date...................
      if (decodeData) {
        var dtToday = new Date();

        var month = dtToday.getMonth() + 1;
        var day = dtToday.getDate();
        var year = dtToday.getFullYear();
        if (month < 10) month = "0" + month.toString();
        if (day < 10) day = "0" + day.toString();

        var maxDate = year + "-" + month + "-" + day;
        // consoleLog("date::::", maxDate);

        scheduleTimeArr = decodeData.data.scheduleTime.split(":");
        // consoleLog("time:::", scheduleTimeArr[0]);

        // .............date...................

        var dtToday = new Date();

        var month = dtToday.getMonth() + 1;
        var day = dtToday.getDate();
        var year = dtToday.getFullYear();
        if (month < 10) month = "0" + month.toString();
        if (day < 10) day = "0" + day.toString();

        var maxDate = year + "-" + month + "-" + day;
      }

      this.setState({
        notificationTitle: decodeData.data.title,
        notificationTypeData: arrData,
        recipientTypeArr: recipientTypeArrDataMain,
        recipientTypeData: recipientTypeObjData,
        recipientArrData: recipientDataArray,
        recipientArr: recipientArray,
        recipientData: recipientObjData,
        body: decodeData.data.body,
        emailBody: decodeData.data.body,
        statusData: statusArrData,
        startDate: SetScheduleDate(decodeData.data.scheduledDate),
        endDate: SetScheduleDate(decodeData.data.endDate),
        hour: scheduleTimeArr[0],
        min: scheduleTimeArr[1],
        ampm: decodeData.data.scheduleTimeUnit,
        maxDate: maxDate,
        isLoad: false,
      });
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
  };

  onTitleChange = (data) => {
    this.setState({
      notificationTitle: data,
    });
  };
  onNotificationTypeChange = (data) => {
    if (data.label === "Push") {
      this.setState({
        body: "",
      });
    } else if (data.label === "Email") {
      this.setState({
        emailBody: "",
      });
    }
    this.setState({
      notificationTypeData: data,
    });
  };
  onRecipientTypeChange = async (data) => {
    this.setState({
      recipientData:[]
    })
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
      drr = [],
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

    // consoleLog("recipient::",arr)

    this.setState({
      recipientArrData: arr,
      recipientData: crr,
    });
  };
  onBodyChange = (e) => {
    // console.log(":::data",e.target.value)
    this.setState({
      body: e.target.value,
    });
  };
  onStatusChange = (data) => {
    this.setState({
      statusData: data,
    });
  };

  startDateChange = (date) => {
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
    let mainData = this.props.location,
      preData = mainData.state;
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

    let validateStatus = inputEmptyValidate(this.state.statusData);
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
    } 
    
    else if (this.state.notificationTypeData.label === "Email" && validateEmailBody === false) {
      // if (validateEmailBody === false) {
        toast.error(AlertMessage.MESSAGE.NOTIFICATION.EMPTY_BODY);
        errorCount++;
      // }
    } else if (this.state.notificationTypeData.label === "Push" && validateBody === false) {
      // if (validateBody === false) {
        toast.error(AlertMessage.MESSAGE.NOTIFICATION.EMPTY_BODY);
        errorCount++;
      // }
    } 
    else if (validateStatus === false) {
      toast.error(AlertMessage.MESSAGE.NOTIFICATION.EMPTY_STATUS);
      errorCount++;
    }
    else if (this.state.statusData.value === "0") {
      if (validateDate === false) {
        toast.error(AlertMessage.MESSAGE.NOTIFICATION.EMPTY_DATE);
        errorCount++;
      }
    }

    if (errorCount === 0) {
      let data = {
        title: this.state.notificationTitle,
        notificationType: this.state.notificationTypeData.value.toString(),
        recipientType: this.state.recipientTypeData.value,
        recipients:
          this.state.recipientArrData.length === 0
            ? ["All"]
            : this.state.recipientArrData,
        body:
          this.state.notificationTypeData.label === "Email"
            ? this.state.emailBody
            : this.state.body,
        status: this.state.statusData.value.toString(),
        startDate: SetScheduleDate(this.state.startDate),
        // endDate: this.state.endDate,
        scheduleTime: this.state.hour + ":" + this.state.min + ":00",
        notificationId: preData.id,
        scheduleTimeUnit: this.state.ampm,
      };
      // consoleLog("++++++++data", data);
      let res = await ApiCall("updateNotificationDetails", data);
      // consoleLog("++++++++res", res);
      if (
        res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        toast.success(
          AlertMessage.MESSAGE.NOTIFICATION.NOTIFICATION_UPDATE_SUCCESS,
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
            <Link to="/adminNotificationList">Notification</Link> / Edit
            Notification
          </div>

          {/* <div className="component-wrapper"> */}
          <h3 className="dcs">EDIT NOTIFICATION</h3>
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
                                  console.log(
                                    "Editor is ready to use!",
                                    editor
                                  );
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
                              onChange={(e) => {
                                this.onBodyChange(e);
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
                {this.state.statusData.value === 0 ? (
                  <React.Fragment>
                    <div className="department-form">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="form_rbx">

                          <div className="frm-label">
                          Schedule Date & Time *
                              </div>
                           

                              <div className="input-group" style={{ width: "100%", borderRadius: "9px", height: "43px", border: "1px solid #ced4da", boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)" }}>
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
                                      onChange={(date) => this.startDateChange(date)}
                                      customInput={(<Schedule />)}
                                    />
                                  </a>
                                </div>
                              </div>
                            {/* <span className="">Schedule Date & Time</span> */}
                            {/* <div className="form-input-fields unstyled">
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
                            </div> */}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <span classN></span>
                          <div className="t-time" style={{ marginTop: "-18px" }}>
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
                                    <br/>
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
                                className="textbox4 d-icon"
                                value={this.state.startDate}
                                placeholder="Select"
                                onChange={this.startDateChange}
                                style={{
                                  textAlign: "center",
                                  borderRadius: "9px",
                                  boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                }}
                              />
                            </div>
                          </div> */}
                    {/* <div className="form_rbx ">
                        <span className="">Start Date</span>
                       
                        <input
                          type="date"
                          className="texbox4 d-icon"
                          placeholder="10/25/2000"
                          value={this.state.startDate}
                          onChange={this.startDateChange}
                        />
                      </div> */}
                    {/* </div>
                        <div className="col-md-2"></div>
                        <div className="col-md-5">
                          <div className="web-form-bx">
                            <div className="frm-label">End Date</div>
                            <div className="form-input-fields unstyled">
                              <input
                                type="date"
                                id="from_datepicker"
                                className="textbox4 d-icon"
                                value={this.state.endDate}
                                min={this.state.maxDate}
                                placeholder="Select"
                                onChange={this.endDateChange}
                                style={{
                                  textAlign: "center",
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
                    Update
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
      <img style={{ width: "35px", height: "37px", borderRadius: "4px", cursor: "pointer" }} src={ImageName.IMAGE_NAME.CALENDER4} onClick={onClick} />
    );
  }
}