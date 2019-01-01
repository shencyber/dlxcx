//app.js


App({

  api:require('./utils/api.js'),
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: { 
    userInfo: null,

    //购物车数据,数据结构[{gid:1,ghsid:2,amount:1},{gid:2,ghsid:2,amount:1}]
    cart:[
      // { gid: "4", gname: "name1dkgndklfnglkndlgnlkdnfglkndlkfgnkldfnglkndklgnlkdfnglkndlfkgnEND", amount: 1, unitprice: "20", cover: "http://lovehezu.com/tp/public/uploads/5c164372c9f65.jpg",ghsid:1,ghsname:'找' },
      // { gid: "5", gname: "name2", amount: 1, unitprice: "20", cover: "http://lovehezu.com/tp/public/uploads/5c164372c9f65.jpg",ghsid:1,ghsname:'找' },
      // { gid: "6", gname: "name3", amount: 1, unitprice: "40", cover: "http://lovehezu.com/tp/public/uploads/5c164372c9f65.jpg",ghsid:2,ghsname:'张' },
      // { gid: "7", gname: "name4", amount: 1, unitprice: "40", cover: "http://lovehezu.com/tp/public/uploads/5c164372c9f65.jpg",ghsid:2,ghsname:'张' },
    ]  
  }
})