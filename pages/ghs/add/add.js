// pages/ghs/add/add.js
var App = getApp();

// iviewui组件
const { $Toast } = require('../../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ghsno:'',  //供货商编号
    name:'' ,   //供货商名字
    ghsid:'',
   
  },


  getNo( e ){

    this.setData({
      ghsno : e.detail.detail.value
    });
  },

  search(){

    App.api.getApi( '/index/ghs/searchGhsByNo' , {'ghsno':this.data.ghsno} )
    .then(res=>{

      console.log(res);
      if( 0 == res.data.status )
      {
        this.data.ghsid = res.data.result[0]['id'];
        this.setData({
          name : res.data.result[0]['wnickname']
        });
      }
      else
      {
        $Toast({
            content: '未找到该供货商',
            type: 'warning'
        });
      }
    })
    .catch(err=>{
      console.log( err );
    });


  },

  /**
   * 添加供货商
   */
  add(){
    App.api.postApi( '/index/guanzhu/guanZhu' , { 'dlsid':1,"ghsid":this.data.ghsid } )
    .then(res=>{

      console.log(res);
      // return ;
      if( 0 == res.data.status )
      {
         $Toast({
              content: '添加成功',
              type: 'success',
              duration:1,
              mask:true
          });

          setTimeout(() => {
         wx.navigateBack({delta:1});
            
        }, 1000);


      }
      else if( 3 == res.data.status )
      {
        $Toast({
            content: '已在您的代理商列表内',
            type: 'warning'
        });
      }
      else
      {
           $Toast({
              content: '添加失败',
              type: 'error'
          });
      }
    })
    .catch(err=>{
      console.log( err );
    });
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(App.api)


    

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