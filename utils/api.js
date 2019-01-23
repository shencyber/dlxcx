// api.js

// const URL = 'http://47.100.54.97:8080/jyjyzx'  //需要接入的api接口
const URL = 'https://lovehezu.com/tp/index.php'  //需要接入的api接口
const fetch = require('./fetch.js')

function getApi(path, params) {  // get请求
    return fetch(URL, path, params, 'GET')
}

function postApi(path, params) {  // post请求
    return fetch(URL, path, params, 'POST')
}

module.exports = { getApi, postApi }