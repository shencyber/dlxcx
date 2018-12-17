// pages/ghs/detail/detail.js
const { $Toast } = require('../../../dist/base/index');
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ghsid:'', //供货商id
    ghsname:'', //供货商名称
    currentpage:1,
    pagesize:1,
    total:0,

    good:[],
    totalChoosed:0,  // 购物车该供货商选择的商品总数量

  },

  getData(){
    let _this = this ;
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
      console.log(res);
      if( 0 == res.data.status )
      {

        this.data.total = res.data.total;
        
        let tmp = this.data.good.concat(res.data.result);
        this.setData({
            good:tmp
          });

        console.log( "tmp" , this.data.good );

        let tmp_total = 0 ;
        for(let i in tmp)
        {
          if( tmp[i]['id'] == _this.data.ghsid )
          {
             ++tmp_total;
          }
        }
        if( tmp_total > 0 ) _this.setData({totalChoosed : tmp_total});

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
   * [addToCart 添加至购物车]
   * @param {[type]} currentTarget [事件对象]
   */
  addToCart( e ){
    let _this = this ;
   
    let index = e.currentTarget.dataset.index;
   
    let cart = App.globalData.cart;

    for( let i in cart )
    {
      if( cart[i]['gid'] ==  _this.data.good[index]['id'] )
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
          total:tmp
        });


        return ;
      }
    }

    cart.push( {gid:_this.data.good[index]['id'] , ghsid:_this.data.ghsid , amount:1} );

    App.globalData.cart = cart ;
    console.log( App.globalData.cart );

    $Toast({
            content: '添加成功',
            type: 'success'
        });
    let tmp = ++_this.data.totalChoosed ; 
    _this.setData({
      total:tmp
    });

    // return ;
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log( options );
    this.data.ghsid = options.ghsid ;
    this.data.ghsname = options.ghsname ;
    wx.setNavigationBarTitle({title:options.ghsname});
    this.getData();


  },


  toDetail(e)
  {
    let gid = e.currentTarget.dataset.gid ;
    // console.log( "to detail" , e.currentTarget.dataset.gid );
    wx.navigateTo({url:`../detail/detail?gid=${gid}`});
  }




  
})