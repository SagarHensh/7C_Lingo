import { CryptoDecoder, Encoder } from "../auth";
import { UsersEnums } from "../constant";
import { ApiConfigUrl } from "../api";
import axios from 'axios';
import { APP_URL } from '../config';


export function ApiCall(uriName, payload) {
    return new Promise(async function (resolved, reject) {
        try {
            if (ApiConfigUrl.APP_LAST_URI[uriName].isAuth == true) {
                const authToken = localStorage.getItem("AuthToken");
                const token = CryptoDecoder.CryptoDecode(authToken);
                axios.interceptors.request.use(
                    config => {
                        if (config.headers.authorization === undefined) {
                            config.headers.authorization = `Bearer ` + token;
                        }
                        return config;
                    },
                    error => {
                        console.log(error);
                    }
                );
            }
            const encodeData = Encoder.encode(payload);
            if (ApiConfigUrl.APP_LAST_URI[uriName].method == "POST") {
                axios.post(APP_URL.BASE_URL + ApiConfigUrl.APP_LAST_URI[uriName].path, {
                    payload: encodeData
                })
                    .then(res => {
                        let response = res.data;
                        resolved(response);
                    })
                    .catch(error => {
                        // handle error
                        reject(error);
                    })
            } else if (ApiConfigUrl.APP_LAST_URI[uriName].method == "GET") {
                axios.get(APP_URL.BASE_URL + ApiConfigUrl.APP_LAST_URI[uriName].path)
                    .then(res => {
                        let response = res.data;
                        resolved(response);
                    })
                    .catch(error => {
                        // handle error
                        reject(error);
                    })
            }
        } catch (e) {
            reject(e);
        }
    })
}



//.......................For Client Api Config........................

export function ApiCallClient(uriName, payload) {
    return new Promise(async function (resolved, reject) {
        try {
            if (ApiConfigUrl.APP_LAST_URI[uriName].isAuth == true) {
                const authToken = localStorage.getItem("AuthToken");
                const token = CryptoDecoder.CryptoDecode(authToken);
                axios.interceptors.request.use(
                    config => {
                        if (config.headers.authorization === undefined) {
                            config.headers.authorization = `Bearer ` + token;
                        }
                        return config;
                    },
                    error => {
                        console.log(error);
                    }
                );
            }
            const encodeData = Encoder.encode(payload);
            if (ApiConfigUrl.APP_LAST_URI[uriName].method == "POST") {
                axios.post(APP_URL.CLIENT_BASE_URL + ApiConfigUrl.APP_LAST_URI[uriName].path, {
                    payload: encodeData
                })
                    .then(res => {
                        let response = res.data;
                        resolved(response);
                    })
                    .catch(error => {
                        // handle error
                        reject(error);
                    })
            } else if (ApiConfigUrl.APP_LAST_URI[uriName].method == "GET") {
                axios.get(APP_URL.CLIENT_BASE_URL + ApiConfigUrl.APP_LAST_URI[uriName].path)
                    .then(res => {
                        let response = res.data;
                        resolved(response);
                    })
                    .catch(error => {
                        // handle error
                        reject(error);
                    })
            }
        } catch (e) {
            reject(e);
        }
    })
}


//.......................For Vendor Api Config........................

export function ApiCallVendor(uriName, payload) {
    return new Promise(async function (resolved, reject) {
        try {
            if (ApiConfigUrl.APP_LAST_URI[uriName].isAuth == true) {
                const authToken = localStorage.getItem("AuthToken");
                const token = CryptoDecoder.CryptoDecode(authToken);
                axios.interceptors.request.use(
                    config => {
                        if (config.headers.authorization === undefined) {
                            config.headers.authorization = `Bearer ` + token;
                        }
                        return config;
                    },
                    error => {
                        console.log(error);
                    }
                );
            }
            const encodeData = Encoder.encode(payload);
            if (ApiConfigUrl.APP_LAST_URI[uriName].method == "POST") {
                axios.post(APP_URL.APP_BASE_URL + ApiConfigUrl.APP_LAST_URI[uriName].path, {
                    payload: encodeData
                })
                    .then(res => {
                        let response = res.data;
                        resolved(response);
                    })
                    .catch(error => {
                        // handle error
                        reject(error);
                    })
            } else if (ApiConfigUrl.APP_LAST_URI[uriName].method == "GET") {
                axios.get(APP_URL.APP_BASE_URL + ApiConfigUrl.APP_LAST_URI[uriName].path)
                    .then(res => {
                        let response = res.data;
                        resolved(response);
                    })
                    .catch(error => {
                        // handle error
                        reject(error);
                    })
            }
        } catch (e) {
            reject(e);
        }
    })
}