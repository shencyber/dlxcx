// pages/orderdetail/orderdetail.js
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:'' 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showLoading({'title':"数据加载中..."});

    this.getDetail( options.oid );
  },

  getDetail( orderid ){

    
    App.api.getApi(
      "/index/orders/getDetailApi",
      {
        orderid:orderid
      }
    )
    .then(res=>{
      console.log( res );
      let _res = res.data.result ;
      switch( _res.status )
      {
        case "1" :
          _res.statustext = "待付款" ;
          break ;
        case "2" :
          _res.statustext = "待发货" ;
          break ;
        case "3" :
          _res.statustext = "已发货" ;
          break ;
        case "4" :
          _res.statustext = "已取消" ;
          break ;
      }

      let _sum = 0 ;
      for( let i in _res.detail )
      {
        _sum += _res.detail[i]['unitprice']*_res.detail[i]['amount']
      }

      _res.totalPrice = _sum ;
      this.setData({
        detail : _res
      });

       wx.hideLoading();
    })
    .catch(err=>{
      console.log(err);
    });
  }

})