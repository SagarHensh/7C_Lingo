var CryptoJS = require("crypto-js");
const secret = "lingo@payload@node@response";
const internalSecret = "lingo@internal@react@secret@crypto";

export function CryptoDecode(data) {
  try {
    const bytes = CryptoJS.AES.decrypt(data, secret); // Decrypt the encripted crypto token in byteCode from api
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (e) {
    console.log(e);
  }
}


// For local store data
export function CryptoInternalDecode(data) {
  try {
    const bytes = CryptoJS.AES.decrypt(data, internalSecret); // Decrypt the encripted crypto token in byteCode from api
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (e) {
    console.log(e);
  }
}
