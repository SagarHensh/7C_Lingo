import { CryptoDecoder } from "../crypto";
var jwt = require("jsonwebtoken");
const secret = "lingo@2021@react@node";
const internalsecret = "lingo@internal@react@secret@jwt";

// for api with double decription
export function decode(data) {
  try {
    const cryptoDecode = CryptoDecoder.CryptoDecode(data);
    const decoded = jwt.verify(cryptoDecode, secret);
    return decoded;
  } catch (e) {
    // console.log(e);
  }
}


// for api with single decription
export function jwtSingleDecode(data) {
  try {
    const decoded = jwt.verify(data, secret);
    return decoded;
  } catch (e) {
    console.log(e)
  }
}


// for internal data with double decription
export function internalJwtDecode(data) {
  try {
    const cryptoDecode = CryptoDecoder.CryptoInternalDecode(data);
    const decoded = jwt.verify(cryptoDecode, internalsecret);
    return decoded;
  } catch (e) {
    console.log(e);
  }
}