// import history from './history';
import axios from "axios";
import moment from "moment";
import { Decoder } from "../auth";
import { PROD } from "../config/api_url";
import { ErrorCode } from "../constant";
import { ApiCall } from "../middleware";

// const sessionCheck =() =>{
//     var date = new Date();
//     var time = date.getTime();
//     // console.log(time);
//     var sessionTime = localStorage.getItem('sessionTime');
//     //console.log(sessionTime);
//     if(time<sessionTime){
//         localStorage.setItem("sessionTime",time+(3600*1000));

//         //console.log("in");
//     } else {
//         //console.log("out");
//         localStorage.clear();
//         return history.push('/');
//     }
// }

const consoleLog = (str, val) => {
  let con = "";
  if (str === undefined || str === null || str === "") {
    con = "Console>>>"
  } else {
    con = str
  }

  if (!PROD) {
    return console.log(con + ">>>", val)
  }
}

const phoneNumberCheck = (number) => {
  if (number.length >= 3) {
    return number;
  }
};

const SetDateFormat = (value) => {
  let day = moment(value).format("DD");
  let Month = moment(value).format("MMMM");
  let Year = moment(value).format("YYYY");
  let time = moment(value).format("LT");

  let finalDate = day + " " + Month + " " + Year;
  return finalDate;
};

const SetTimeFormat = (value) => {
  let time = moment(value).format("LT");
  return time;
};

const getLookUpDataFromAPI = async () => {
  let lookupres = await ApiCall("getLookUpData");
  if (
    lookupres.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    lookupres.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  ) {
    let payload = Decoder.decode(lookupres.data.payload);
    return payload.data.lookupdata;
  }
};

const getCountryList = async () => {
  let res = await ApiCall("getcountrylist");
  if (
    res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  ) {
    let payload =  Decoder.decode(res.data.payload);
    return payload.data.countryInfo;
  }
};

const SetRequestViewTimeFormat = (value) => {
  let time = moment(value).format("lll");
  return time;
};
const SetDOBFormat = (value) => {

  let day = moment(value).format("DD");
  let Month = moment(value).format("MM");
  let Year = moment(value).format("YYYY");

  let finalDate = Year + "-" + Month + "-" + day;
  return finalDate;
};

const textTruncate = (str, length, ending) => {
  if (length == null) {
    length = 100;
  }
  if (ending == null) {
    ending = "...";
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
};

const getClientInfo = async () => {
  let clientinfoRes = await ApiCall("getallclinetinfo");
  if (
    clientinfoRes.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
    clientinfoRes.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
  ) {
    let clientPayload = await Decoder.decode(clientinfoRes.data.payload);
    let clientResData = clientPayload.data.clientlist;
    // console.log("Client payload::::::::::", clientResData);
    let clientDataArr = [];
    for (let i = 0; i < clientResData.length; i++) {
      clientDataArr.push({
        label: clientResData[i].clientName,
        value: clientResData[i].clientid,
      });
    }
    return clientDataArr;
  }
}

const getLanguageArray = async () => {
  let languageResData = await ApiCall("getlanguagelist");
  let languagePayload = Decoder.decode(languageResData.data.payload);
  let languageResArrData = languagePayload.data.languagelist;
  // console.log("language Arr>>>", this.state.languageArr);
  let languageArrData = [];
  for (let n = 0; n < languageResArrData.length; n++) {
    languageArrData.push({
      label: languageResArrData[n].language,
      value: languageResArrData[n].id,
    });
  }
  return languageArrData;
}

const SetTimeMinSecFormat = (value) => {
  let hh = moment(value).format("HH");
  let mn = moment(value).format("mm");
  let ss = moment(value).format("ss");
  let time = hh + ":" + mn + ":" + ss;
  return time;
};

const SetScheduleDate = (value) => {
  let day = moment(value).format("DD");
  let Month = moment(value).format("MM");
  let Year = moment(value).format("YYYY");
  let finalDate = Year + "-" + Month + "-" + day;
  return finalDate;
};

const decimalValue = (text) => {
  const validated = text.match(/^(\d*\.{0,1}\d{0,3}$)/);
  return validated;
}

const SetUSAdateFormat = (value) => {
  // consoleLog("usa Dtae Format Value::", value);
  // let date = new Date(value);
  // consoleLog("new date::", value);
  // let aa = date.getDate();
  // aa = aa <= 9 ? "0" + aa : aa;
  // let bb = date.getMonth() + 1;
  // bb = bb <= 9 ? "0" + bb : bb;
  // let cc = date.getFullYear();
  // consoleLog("Full new USA DAte ::", bb + "-" + aa + "-" + cc)

  let day = moment(value).format("DD");
  let Month = moment(value).format("MM");
  let Year = moment(value).format("YYYY");

  let finalDate = Month + "-" + day + "-" + Year;
  return finalDate;
};


const SetDueDate = (value) => {
  var currentDate = moment(value);
  var futureMonth = moment(currentDate).add(1, 'M');
  var futureMonthEnd = moment(futureMonth).endOf('month');

  if (currentDate.date() != futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
    futureMonth = futureMonth.add(1, 'd');
  }
  return futureMonth;
}

const SetDatabaseDateFormat = (value) => {
consoleLog("Date::", value)
  let day = moment(value, 'MM-DD-YYYY').format("DD");
  let Month = moment(value, 'MM-DD-YYYY').format("MM");
  let Year = moment(value, 'MM-DD-YYYY').format("YYYY");

  let finalDate = Year + "-" + Month + "-" + day;
  return finalDate;
  // ====================================================
  // var dt = new Date(value);
  // var day = dt.getDate();
  // day = day <= 9 ? "0" + day : day;
  // var month = dt.getMonth() + 1;
  // month = month <= 9 ? "0" + month : month;
  // var year = dt.getFullYear();

  // var databaseDate = year + "-" + month + "-" + day;
  // return databaseDate;
};

const SetUSAdateFormatV2 = (value) => {
  // consoleLog("usa Dtae Format Value::", value);
  let date = new Date(value);
  // consoleLog("new date::", value);
  let aa = date.getDate();
  aa = aa <= 9 ? "0" + aa : aa;
  let bb = date.getMonth() + 1;
  bb = bb <= 9 ? "0" + bb : bb;
  let cc = date.getFullYear();
  // consoleLog("Full new USA DAte ::", bb + "-" + aa + "-" + cc)

  let finalDate = bb + "-" + aa + "-" + cc;
  return finalDate;
};


export {
  // sessionCheck,
  phoneNumberCheck,
  SetDateFormat,
  SetTimeFormat,
  getLookUpDataFromAPI,
  getCountryList,
  SetRequestViewTimeFormat,
  SetDOBFormat,
  textTruncate,
  getClientInfo,
  getLanguageArray,
  SetTimeMinSecFormat,
  consoleLog,
  SetScheduleDate,
  decimalValue,
  SetUSAdateFormat,
  SetDueDate,
  SetDatabaseDateFormat,
  SetUSAdateFormatV2
};
