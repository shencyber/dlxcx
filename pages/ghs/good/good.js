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

   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log( "page load  ghsid" , options.ghsid );
    this.setData({ ghsid : options.ghsid });
    this.setData({ ghsname : options.ghsname });
    // this.data.ghsid = options.ghsid ;
    // this.data.ghsname = options.ghsname ;
    wx.setNavigationBarTitle({title:options.ghsname});
    this.getData( options.ghsid );


  },

  getData( ghsid ){
    let _this = this ;
    App.api.getApi(
      '/index/goods/getGoodsListByGhsId',
      {
        ghsid :ghsid,
        type  :1,
        currentpage:this.data.currentpage,
        pagesize:this.data.pagesize
      }
    )
    .then(res=>{
      console.log("res" , res);
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
    let _this = this ;
    console.log( this.data.currentpage );
    console.log( this.data.pagesize );
    console.log( this.data.total );
    if( _this.data.currentpage*_this.data.pagesize < _this.data.total )
    {
      _this.data.currentpage++;
      _this.getData( _this.data.ghsid );
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

    // console.log(App.globalData.cart);
    // return ;
    for( let i in cart )
    {
      if( cart[i]['gid'] ==  _this.data.good[index]['id'] )
      {
    // console.log( "_this.data.gid" , _this.data.good[index]['id'] );

        ++cart[i]['amount'] ;
        App.globalData.cart = cart ;
        // cart = [] ;
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

    // console.log( "_this.data.gid" , _this.data.good[index]['id'] );
    cart.push( 
      {
        gid:_this.data.good[index]['id'] , gname:_this.data.good[index]['name'],amount:1, 
        unitprice:_this.data.good[index]['unitprice'],cover:_this.data.good[index]['urls'][0],
        ghsid:_this.data.ghsid , ghsname:_this.data.ghsname
      } );

    App.globalData.cart = cart ;
        // cart = [] ;
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


 


  toDetail(e)
  {
    let gid = e.currentTarget.dataset.gid ;
    let ghsid = e.currentTarget.dataset.ghsid ;
    let ghsname = e.currentTarget.dataset.ghsname ;
    console.log( e.currentTarget.dataset );
    // console.log( "to detail" , e.currentTarget.dataset.gid );
    wx.navigateTo({url:`../detail/detail?gid=${gid}&ghsid=${ghsid}&ghsname=${ghsname}`});
  }




  
})