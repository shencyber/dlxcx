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
    
    // good:[],
    // totalChoosed:0,  // 购物车该供货商选择的商品总数量

    searchImgs:'' , //需要搜索的图片
    showMask:false ,  //是否显示mask
    showMore:false ,  //是否显示【加载更多】


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
    // console.log( "search" , this.data.searchImgs );
    let _this = this ;
    // console.log(App.globalData.api+'/index/goods/searchGoodsByImage');
    wx.uploadFile({
      url : App.globalData.api+'/index/goods/searchGoodsByImage',
      filePath:this.data.searchImgs[0],
      name:'image',
     
      success(res){

        let _data = JSON.parse(res.data);
        // console.log( "data" , res.data );
        if( 0 == _data.status )
        {

          _this.setData({
            showMask : false,
          });

          _this.setData({
            showMore : false
          });

          
          wx.hideLoading();

          wx.navigateTo({url:`../searchimg/searchimg?goods=${res.data }&urls=${_this.data.searchImgs[0]}`});
          return ;
          // let _result = _data.result[0]['goods'] ; 
          // let _tmpData = [] ;
          // console.log(  _result  ) ;
          // for(let i in _result)
          // {
          //   _tmpData.push({
          //     id : _result[i]['id'],
          //     name : _result[i]['name'],
          //     // source : _result[i][''],
          //     unitprice: _result[i]['unitprice'],
          //     urls:[_this.data.searchImgs[0]]
          //   });
          // }

          // console.log( "tmpData" , _tmpData );
          return ;

          



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