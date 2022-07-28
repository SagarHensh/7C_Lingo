import { CryptoEncoder } from "../crypto";
var jwt = require("jsonwebtoken");
const secret = "lingo@2021@node@react";
const internalsecret = "lingo@internal@react@secret@jwt";

// for api with double encryption
export function encode(data) {
  try {
    const jwtToken = jwt.sign(data, secret); // Encode the user actual data usng jwt
    const cryptoEncode = CryptoEncoder.CryptoEncode(jwtToken); // Encode the jwt token using Crypto AES
    return cryptoEncode;
  } catch (e) {
    // console.log(e);
  }
}


// for api with single encryption
export function jwtSingleEncode(data) {
  try {
      const jwtToken = jwt.sign(data, secret); // Encode the user actual data usng jwt
      return jwtToken;
  } catch (e) {
      // console.log(e)
  }
}


// for internal data with double encryption
export function internalJwtEncode(data) {
  try {
    const jwtToken = jwt.sign(data, internalsecret); // Encode the user actual data usng jwt
    const cryptoEncode = CryptoEncoder.CryptoInternalEncode(jwtToken); // Encode the jwt token using Crypto AES
    return cryptoEncode;
  } catch (e) {
    // console.log(e);
  }
}
