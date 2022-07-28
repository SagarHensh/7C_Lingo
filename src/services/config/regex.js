module.exports.NAME_REGEX = /^[a-zA-Z\s]+$/;
module.exports.NUMBER_REGEX = /^[0-9 +\b]+$/;
module.exports.AMOUNT_REGEX = '0123456789.';
module.exports.PASS_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])([a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]{6,})$/;
module.exports.ADDRESS_REGEX = /^[-.?!,;:() A-Za-z0-9]*$/;
module.exports.EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
module.exports.STRING_NUMBER_REGEX = /^[A-Za-z0-9 ]*$/
module.exports.ONLY_NUMBER_REGEX = /^[0-9\b]+$/;
module.exports.ONLY_15DIGITS_REGEX = /^[0-9]{1,15}$/;
module.exports.TIME_REGEX = /^[0-9]{1,2}$/;
module.exports.START_WITH_ZERO = /^[0]$/;