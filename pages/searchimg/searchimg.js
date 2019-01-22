// pages/searchimg.js
const { $Toast } = require('../../dist/base/index');
var App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    url:' ' ,
    
    goods:[],

  }

  ,init()
  {
    
  }

  /**
   * 生命周期函数--监听页面加载
   */
  ,onLoad: function (option) {
    console.log( option );
    // return ;

    let res = JSON.parse(option.goods) ;
    console.log( option.urls );

    this.setData({
      goods : res.result,
      urls  : option.urls
    });

    console.log( "page load  ghsid" , this.data.goods);
    // this.setData({ ghsid : options.ghsid });
    // this.setData({ ghsname : options.ghsname });
    // this.data.ghsid = options.ghsid ;
    // this.data.ghsname = options.ghsname ;
    // wx.setNavigationBarTitle({title:options.ghsname});
    // this.getData( options.ghsid );


  }

  /**
   * [addToCart 添加至购物车]
   * @param {[type]} currentTarget [事件对象]
   */
  ,addToCart( e ){
    let _this = this ;
   
    let index = e.currentTarget.dataset.index;
    let subindex = e.currentTarget.dataset.subindex;
   
    let cart = App.globalData.cart;
    for( let i in cart )
    {
      if( cart[i]['gid'] ==  _this.data.goods[index]['goods'][subindex]['id'] )
      {

        ++cart[i]['amount'] ;
        App.globalData.cart = cart ;
        console.log( App.globalData.cart );

        $Toast({
            content: '添加成功',
            type: 'success'
        });

        // let tmp = ++_this.data.totalChoosed ; 
        // _this.setData({
        //   total:tmp
        // });


        return ;
      }
    }

    cart.push( 
      {
        gid:_this.data.goods[index]['goods'][subindex]['id'] , 
        gname:_this.data.goods[index]['goods'][subindex]['name'],
        amount:1, 
        unitprice:_this.data.goods[index]['goods'][subindex]['unitprice'],
        cover:_this.data.urls,
        ghsid:_this.data.goods[index]['ghsid'] , 
        ghsname:_this.data.goods[index]['ghsname']
      } );

    App.globalData.cart = cart ;
 
    console.log( App.globalData.cart );

    $Toast({
            content: '添加成功',
            type: 'success'
      });

    // let tmp = ++_this.data.totalChoosed ; 
    // _this.setData({
    //   total:tmp
    // });


  }


  /**
   * 跳转到详情页面
   */
  ,toDetail(e)
  {
    // let gid = e.currentTarget.dataset.gid ;
    // let ghsid = e.currentTarget.dataset.ghsid ;
    // let ghsname = e.currentTarget.dataset.ghsname ;
    // console.log( e.currentTarget.dataset );
    // wx.navigateTo({url:`../detail/detail?gid=${gid}&ghsid=${ghsid}&ghsname=${ghsname}`});
  }



})