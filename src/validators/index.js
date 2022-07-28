import { Regex } from '../services/config';
import { AlertMessage } from '../enums';
import { LengthValidate } from '../services/constant';
import { consoleLog } from '../services/common-function';

// amount validate
const amountValidator = amount => {
  return !!amount && amount > 0;
};

// email validate
const emailValidator = email => {
  if (email === undefined || email === null) {
    return ({ status: false, message: AlertMessage.MESSAGE.EMAIL.EMAIL_EMPTY });
  } else {
    if (email.length === 0) {
      return ({ status: false, message: AlertMessage.MESSAGE.EMAIL.EMAIL_EMPTY });
    } else {
      if (Regex.EMAIL_REGEX.test(email)) {   // validate the email by email-validator module
        return ({ status: true, message: "" });
      } else {
        return ({ status: false, message: AlertMessage.MESSAGE.EMAIL.EMAIL_INVALID });
      }
    }
  }
};

// mobile number length validate
const mobileNumberValidator = mobileNumber => {
  return !!mobileNumber && mobileNumber.length <= 15;
};

// mobile number length validate
const mobileNumberLengthValidator = mobileNumber => {
  if (mobileNumber.length >= 10 && mobileNumber.length <= 15) {
    return true;
  } else {
    return false;
  }
};

// name length validate
const nameValidator = name => {
  return !!name && name.length > 2;
};

// name regex match
const nameRegexValidator = name => {
  if (name.match(Regex.NAME_REGEX)) {
    return name;
  } else {
    return name.slice(0, -1)
  }
}


// password validate
const passwordValidator = password => {
  if (password === undefined || password === null) {
    return ({ status: false, message: AlertMessage.MESSAGE.PASSWORD.PASSWORD_EMPTY });
  } else {
    if (password.length === 0) {
      return ({ status: false, message: AlertMessage.MESSAGE.PASSWORD.PASSWORD_EMPTY });
    } else {
      if (password.length < 7 || password.length > 16) {
        return ({ status: false, message: AlertMessage.MESSAGE.PASSWORD.PASSWORD_LENGTH });
      } else if (!!password.match(Regex.PASS_REGEX)) {     //match the password with the regex condition is (Password must contain Minimum eight characters, at least one uppercase letter, one lowercase letter and one number)
        return ({ status: true, message: "" });
      } else {
        return ({ status: false, message: AlertMessage.MESSAGE.PASSWORD.PASSWORD_NOT_VALID });
      }
    }
  }
};

// new password validate
const newPassValidator = password => {
  if (password === undefined || password === null) {
    return ({ status: false, message: AlertMessage.MESSAGE.PASSWORD.NEW_PASS_EMPTY });
  } else {
    if (password.length === 0) {
      return ({ status: false, message: AlertMessage.MESSAGE.PASSWORD.NEW_PASS_EMPTY });
    } else {
      if (password.length < 7 || password.length > 16) {
        return ({ status: false, message: AlertMessage.MESSAGE.PASSWORD.PASSWORD_LENGTH });
      } else if (!!password.match(Regex.PASS_REGEX)) {     //match the password with the regex condition is (Password must contain Minimum eight characters, at least one uppercase letter, one lowercase letter and one number)
        return ({ status: true, message: "" });
      } else {
        return ({ status: false, message: AlertMessage.MESSAGE.PASSWORD.PASSWORD_NOT_VALID });
      }
    }
  }
};

// input field for empty
const inputEmptyValidate = (text) => {
  if (
    text === undefined ||
    text === null ||
    text.length === 0 ||
    text === {} ||
    text === ""
  ) {
    return false;
  } else {
    return true;
  }
};

// number check
const numberValidator = (number) => {
  // if (Regex.NUMBER_REGEX.test(number)) {
  if (number.match(Regex.NUMBER_REGEX)) {
    return true
  } else {
    return false
  }
}
// dropdown validation
const dropDownValidate = (dropdownValue) => {
  if (
    dropdownValue === undefined ||
    dropdownValue === null ||
    dropdownValue.length === 0
  ) {
    return false;
  } else {
    return true;
  }
};

// department field validate
const departmentValidator = (text) => {
  if (text.length > LengthValidate.VALIDATIONS.DEPARTMENT) {
    return false;
  } else {
    return true;
  }
}

//course fee validate
const courseFeeValidate = (fee) => {
  if (fee.match(Regex.NUMBER_REGEX)) {
    return fee;
  } else {
    return fee.slice(0, -1);
  }
};

//course duration validate
const courseDurationValidate = (duration) => {
  if (duration.match(Regex.NUMBER_REGEX)) {
    return duration;
  } else {
    return duration.slice(0, -1);
  }
};

//alphaNumericValidator
const alphaNumericValidator = value => {
  if (value.match(Regex.STRING_NUMBER_REGEX)) {
    return value;
  } else {
    return value.slice(0, -1)
  }
}

const zipValidate = (zip) => {
  if (zip.match(Regex.ONLY_NUMBER_REGEX)) {
    return zip;
  } else {
    return zip.slice(0, -1);
  }
};

//Website Validation
const websiteValidate = (str) => {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

const timeValidator = (num) => {
  if (num === "") {
    return true;
  } else {
    if (num.match(Regex.TIME_REGEX)) {
      return true;
    } else {
      return false;
    }
  }
}

const validateDecimal = (value) => {
  var RE = /^\d*\.?\d{0,2}$/
  if (RE.test(value)) {
    return true;
  } else {
    return false;
  }
}

const startsWithZero = (value) => {
  var RE = /^[0\w]$/
  if (RE.test(value)) {
    consoleLog("True zero")
    return true;
  } else {
    consoleLog("false zero")
    return false;
  }
}





export {
  amountValidator,
  emailValidator,
  mobileNumberValidator,
  mobileNumberLengthValidator,
  nameValidator,
  nameRegexValidator,
  passwordValidator,
  inputEmptyValidate,
  numberValidator,
  dropDownValidate,
  departmentValidator,
  newPassValidator,
  courseFeeValidate,
  courseDurationValidate,
  alphaNumericValidator,
  zipValidate,
  websiteValidate,
  timeValidator,
  validateDecimal,
  startsWithZero
};