import HttpRequest from '@/libs/axios'
import config from '_conf'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

class httpRequest {
  constructor(baseUrl) {
    this.axios = new HttpRequest(baseUrl);
  }
  request(options) {
    return new Promise((resolve, reject) => {
        this.axios.request(options).then(res => {
            switch(res.code){
                case -1:
                reject(err);
                break;
                case 401:
                reject(err);
                break;
                case 1:
                resolve(res.data);
                break;
            }
        }).catch(err => {
            reject(err);
        })
    })
  }
}

const axios = new httpRequest(baseUrl);

export default axios
