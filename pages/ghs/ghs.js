// miniprogram/pages/ghs/ghs.js
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ghs:[]
    // ghsid  :'' ,//供货商id
    // ghsname:'' //供货商name

  },

  gotofun(){
    wx.navigateTo({
      url : './add/add',
      fail:function(e){console.log(e)}
    });
  },

  /**
   * [getGhsList 获取供货商列表]
   * @param  {[type]} $dlsid [代理商id]
   * @return {[type]}        [description]
   */
  getGhsList( $dlsid ){
    App.api.getApi( "/index/dls/getGhsList" , {dlsid:1} )
    .then(res=>{
      console.log( res );
      if( 0 == res.data.status )
      {
        
        this.setData({
          ghs : res.data.result
        });

      }
    })
    .catch(err=>{
      console.log(err);
    });
  
  },


  fun(){
    wx.showActionSheet({
      itemList:['删除'],
      success:function( res ){
        console.log( res.tapInex );
      },
      fail:function(){
        console.log("调取失败");
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getGhsList();


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})