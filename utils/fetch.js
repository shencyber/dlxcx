// fetch.js

module.exports = function (api, path, params, method) {  //暴露接口才可以引入
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${api}${path}`,  //api地址
            method: method,  // 请求方法
            data: params,   // 参数
            dataType:'json',
            header: { 'content-type': 'application/json' }, //请求头，默认
            success: resolve,
            fail: reject
        })
    })
}