import axios from 'axios';
import Qs from "qs";
const base = 'http://192.168.1.174:9090'



export const getPrize = params => {
    return axios.get(`${base}/client/activity/getCurrentActivity`, {
            params,
            params
        }

    )
};

export const getPrize_time = params => {
    return axios.get(`${base}/client/activity/getCurrentActivity?times=` + new Date().getTime(), {
            params,
            params
        }

    )
};

export const postPhone = params => {
    return axios.post(`${base}/client/activity/validPhone`, Qs.stringify(params), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
};

export const postPrize = params => {
    return axios.post(`${base}/client/activity/drawPrize`, Qs.stringify(params), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
};

export const postPreview = params => {
    return axios.post(`${base}/api/activity/getActivityById`, Qs.stringify(params), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
};