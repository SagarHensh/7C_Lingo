var CryptoJS = require("crypto-js");
const secret = "lingo@payload@react@request";
const internalSecret = "lingo@internal@react@secret@crypto";

export function CryptoEncode(data) {
  try {
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      secret
    ).toString(); // Encrypt the jwt token in Crypto
    return ciphertext;
  } catch (e) {
    // console.log(e);
  }
}

// For local store data
export function CryptoInternalEncode(data){
  try {
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      internalSecret
    ).toString(); // Encrypt the jwt token in Crypto
    return ciphertext;
  } catch (e) {
    // console.log(e);
  }
}