import axios from 'axios'
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// get 请求
export function httpGet({
                            url,
                            params = {}
                        }) {
    console.log('[httpGet] url:' + url + ', params:' + params);
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params
        }).then((res) => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

// post请求
export function httpPost({
                             url,
                             data = {},
                             params = {}
                         }) {
    console.log('[httpPost] url:' + url + ', data: ');
    console.log(data);
    return new Promise((resolve, reject) => {
        axios({
            url,
            method: 'post',
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            // 发送的数据
            data,
            // url参数
            params

        }).then(res => {
            console.log('[httpPost] res: ');
            console.log(res.data);
            resolve(res.data);
        }).catch(err => {
            reject(err)
        })
    })
}