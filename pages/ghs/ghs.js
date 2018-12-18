// miniprogram/pages/ghs/ghs.js
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ghs:[],

    // ghsid  :'' ,//供货商id
    // ghsname:'' //供货商name
  },


  onShow(){
    this.getGhsList( 1 );
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
  getGhsList( dlsid ){
    App.api.getApi( "/index/dls/getGhsList" , {dlsid:dlsid} )
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


})