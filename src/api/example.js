// import axios from '@/libs/api.request'
import axios from 'axios';
const xxxUrl = '192.168.1.103:9090'

//get
export const getUserInfo = (params) => {
  return axios.request({
    url: xxxUrl + 'getUserInfo',
    params: params,
    method: 'get'
  })
}

// export const getPrize = (params) => {
//   return axios.request({
//     url: xxxUrl + '/client/activity/getCurrentActivity',
//     params: params,
//     method: 'get'
//   })
// }



export const getPrize = params => { return axios.get(`${xxxUrl}/client/activity/getCurrentActivity`,params)}

//post
export const regist = (postData) => {
  return axios.request({
    url: xxxUrl + 'regist',
    data: postData,
    method: 'post'
  })
}
