// pages/ghs/detail/detail.js
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    currentpage:1,
    pagesize:1,
    total:0,

    good:[]

  },

  getData(){
    App.api.getApi(
      '/index/goods/getGoodsListByGhsId',
      {
        ghsid :1,
        type  :1,
        currentpage:this.data.currentpage,
        pagesize:this.data.pagesize
      }
    )
    .then(res=>{

      if( 0 == res.data.status )
      {

        this.data.total = res.data.total;
        
        let tmp = this.data.good.concat(res.data.result);
        this.setData({
            good:tmp
          });

        console.log( this.data.good );
      }
      else
      {

      }

    })
    .catch(err=>{
      console.log( err );
      
    });
  },

  /*加载更多*/
  more(){
    if( this.data.currentpage*this.data.pagesize < this.data.total )
    {
      this.data.currentpage++;
      this.getData();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log( options );
    this.ghsid = options.ghsid ;
  },

  
})