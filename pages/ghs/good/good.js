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
    pagesize:10,
    total:0,

    good:[],
    totalChoosed:0,  // 购物车该供货商选择的商品总数量

    searchImgs:'' , //需要搜索的图片
    showMask:false ,  //是否显示mask
    showMore:false ,  //是否显示【加载更多】

  }

  ,init()
  {
    this.data.currentpage = 1  ;
    this.data.pagesize    = 10 ; 
    this.data.total       = 0  ;
    // this.data.good        = [] ;
    // this.data.searchImgs  = '' ;
    this.data.showMask    = false ;
    this.data.showMore    = false ;
    this.setData({ good : [] });
    this.setData({ searchImgs : '' });
  }

   /**
   * 生命周期函数--监听页面加载
   */
  ,onLoad: function (options) {
    console.log( "page load  ghsid" , options.ghsid );
    this.setData({ ghsid : options.ghsid });
    this.setData({ ghsname : options.ghsname });
    // this.data.ghsid = options.ghsid ;
    // this.data.ghsname = options.ghsname ;
    wx.setNavigationBarTitle({title:options.ghsname});
    this.getData( options.ghsid );


  }

  ,getData( ghsid ){
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
    else
    {
      $Toast({
            content: '没有新的商品了',
            type: 'warning'
        });
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


 

  /**
   * 跳转到详情页面
   */
  toDetail(e)
  {
    let gid = e.currentTarget.dataset.gid ;
    let ghsid = e.currentTarget.dataset.ghsid ;
    let ghsname = e.currentTarget.dataset.ghsname ;
    console.log( e.currentTarget.dataset );
    // console.log( "to detail" , e.currentTarget.dataset.gid );
    wx.navigateTo({url:`../detail/detail?gid=${gid}&ghsid=${ghsid}&ghsname=${ghsname}`});
  },


  chooseImg()
  {
    let _this = this ;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        _this.setData({
          searchImgs:res.tempFilePaths

        });

        _this.search();
      },
      fail(){
        console.log("获取图片失败");
      }
    });
  }

  //预览上传的图片
  ,previewImage()
  {
    console.log( _this.data.searchImgs );
    let _this = this ;
    wx.previewImage({
      current: _this.data.searchImgs, // 当前显示图片的http链接
      urls: [_this.data.searchImgs] // 需要预览的图片http链接列表
    })
  }

  /**
   * 图片长按操作
   */
  ,action()
  {
    let _this = this ;
    console.log( _this.data.searchImgs );
    wx.showActionSheet({
      
      itemList: ['预览', '删除'],
      
      success(res) {
        console.log(res.tapIndex)
        if( 0 == res.tapIndex )
        {

          wx.previewImage({
            curent : _this.data.searchImgs,
            urls:[_this.data.searchImgs[0]]
          });
        }
        else if( 1 == res.tapIndex )
        {
          // _this.data.searchImgs = '' ;
          _this.setData({
            searchImgs : ''
          });
        }
      },
      
      fail(res) {
        console.log(res.errMsg)
      }

  })
  }

  /**
   * 以图搜图开始搜索
   */
  ,search()
  {
    wx.showLoading({title:"搜索中" , mask:true });
    let _this = this ;
    console.log( "filepath" , _this.data.searchImgs[0] );
    // console.log(App.globalData.api+'/index/goods/searchGoodsByImage');
    wx.uploadFile({
      url : App.globalData.api+'/index/goods/searchGoodsByImage',
      filePath:_this.data.searchImgs[0],
      name:'image',
      formData:{
        ghsid: _this.data.ghsid
      },
      success(res){
        console.error(res);
        let _data = JSON.parse(res.data)
        if( 0 == _data.status )
        {
          let _result = _data.result[0]['goods'] ; 
          let _tmpData = [] ;
          // console.log(  _result  ) ;
          for(let i in _result)
          {
            _tmpData.push({
              id : _result[i]['id'],
              name : _result[i]['name'],
              // source : _result[i][''],
              unitprice: _result[i]['unitprice'],
              urls:[_this.data.searchImgs[0]]
            });
          }

          _this.setData({
            good : _tmpData
          });

          _this.setData({
            showMask : false,
          });

          _this.setData({
            showMore : false
          });

          // wx.hideLoading();
        }
        else
        {
          wx.showToast({
            title:"未找到该商品"
          });
          _this.setData({
            showMask : false,
          });

          _this.setData({
            searchImgs:''
          });
          
        }
        wx.hideLoading();
      }

    });


    



  }

  /**
   * 清除以图搜图数据
   */
  ,clear()
  {
    this.init();
    this.getData( this.data.ghsid );
  }

  /**
   * 显示隐藏mask
   */
  ,toggleMask(e)
  {
    // console.log(e)
    this.setData({showMask:!this.data.showMask});
  }

  ,a(e)
  {
    // console.log(e)
    // return false ;
  }


  
})