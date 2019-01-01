// pages/ghs/detail/detail.js
const { $Toast } = require('../../../dist/base/index');
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsid:'' , //商品id
    ghsid:'',  //供货商id
    ghsname:'',  //供货商name

    detail:'', //详情

    totalChoosed:0,  // 购物车该供货商选择的商品总数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log( options );
    console.log( "ghsid" , options.ghsid );
    console.log( "goodsid" , options.gid );
    console.log( "ghsname" , options.ghsname );
    this.data.goodsid = options.gid;
    this.data.ghsid = options.ghsid;
    this.data.ghsname = options.ghsname;
    this.getDetail(options.gid);
  },

  /**
   * [getDetail 获取商品详情]
   * @param  {[type]} $ghsid [goodsid]
   * @return {[type]}        [description]
   */
  getDetail(goodsid){
    App.api.getApi(
      '/index/goods/getGoodsById' , {goodsid:goodsid}
    )
    .then(res=>{
      console.log( "res" , res );
      if( 0 == res.data.status )
      { 
        this.setData({ detail : res.data.result });  
        console.log( this.data.detail.urls ) 
      }
      else
      {
        console.log( "get error" , res)  ;
      }
    })
    .catch(err=>{
      console.log("getDetail" , err);
    });
  }


  /**
   * 预览照片
   */
  ,preview(){

    wx.previewImage(
    {

      urls :this.data.detail.longUrls
    });

  }

  /**
   * [gotocart 跳转到购物车]
   */
  ,gotocart(){
    wx.switchTab({url:'../../cart/cart'});
  }

  ,  /**
   * [addToCart 添加至购物车]
   */
  addToCart( e ){
    let _this = this ;
   
    let cart = App.globalData.cart;

    for( let i in cart )
    {
      if( cart[i]['gid'] ==  _this.data.goodsid )
      {
        ++cart[i]['amount'] ;
        App.globalData.cart = cart ;
        console.log( App.globalData.cart );

        $Toast({
            content: '添加成功',
            type: 'success'
        });

        let tmp = ++_this.data.totalChoosed ; 
        _this.setData({
          totalChoosed:tmp
        });

        return ;
      }
    }

    cart.push( {
        gid:_this.data.goodsid , gname:_this.data.detail.name ,amount:1,
        ghsid:_this.data.ghsid , ghsname:_this.data.ghsname
      });

    App.globalData.cart = cart ;
    console.log( App.globalData.cart );

    $Toast({
            content: '添加成功',
            type: 'success'
        });

    let tmp = ++_this.data.totalChoosed ; 
    _this.setData({
      totalChoosed:tmp
    });

  },


})