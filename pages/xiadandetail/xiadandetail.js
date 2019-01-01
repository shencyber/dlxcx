// pages/xiadandetail/xiadandetail.js
var App = getApp();

const { $Toast } = require('../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {

    ghsid:'' ,//供货商id
    ghsname:'' ,//供货商name
    goods:[] , // 需要结算的商品信息
    totalPrice:0, //总价

    receiverName:'' , //收件人姓名
    receiverPhone:'' , //收件人手机号
    receiverAddress:'' , //地址

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.ghsid = options.ghsid ;
    // this.data.ghsname = options.ghsname ;
    this.setData({
      ghsname:options.ghsname
    });
    console.log( this.data.ghsid );
    console.log( this.data.ghsname );

    this.getTotalPrice();
  },

  getTotalPrice(){
    //1、根据ghsid解析在购物车内的商品价格
    let cart = App.globalData.cart ;
    
    for( let i in cart )
    {
      if( cart[i]['ghsid'] == this.data.ghsid )
      {   
          this.data.goods.push( cart[i] );
          this.data.totalPrice  = this.data.totalPrice + ( cart[i]['unitprice']*cart[i]['amount'] ) ;
      }
    } 

    this.setData( {goods : this.data.goods} );
    this.setData( {totalPrice : this.data.totalPrice} );

    // console.log("ghsid" , this.data.ghsid);
    // console.log("goods" , this.data.goods);
    console.log("totalprice" , this.data.totalPrice);
  }

  ,change( e ){

    switch( e.currentTarget.dataset.type )
    {
      case "name":
        this.data.receiverName = e.detail.detail.value ;
        break;
      case "phone" :
        this.data.receiverPhone = e.detail.detail.value ;
        break;
      case "address" :
        this.data.receiverAddress = e.detail.detail.value ;
        break;
    }
  }

  /**
   * [confirm 确认下单]
   * @return {[type]} [description]
   */
  ,postOrder(){

    if( !this.checkPostData() ) return ;
   
  //debug  供货商id dlsid写死了
    let postData = {
      "ghsid":this.data.ghsid,
      "ghsname" :this.data.ghsname ,
      "dlsid":"2",  //bug
      "receivername":this.data.receiverName,
      "receiverphone":this.data.receiverPhone,
      "address":this.data.receiverAddress,
      "totalprice":this.data.totalPrice,
      "totalfreight":0,
      "goods":[]
      // "goods":[{"goodid":1,"unitprice":100,"amount":3},{"goodid":2,"unitprice":100,"amount":3}]
    }

    for( let i in this.data.goods )
    {
      postData['goods'].push({ 
        goodid:this.data.goods[i]['gid'] , 
        unitprice:this.data.goods[i]['unitprice'] ,
        amount:this.data.goods[i]['amount'] 
      });
    }

    console.log( postData );
    // return ;
    App.api.postApi(
      '/index/orders/add',
      postData
    )
    .then(res=>{
      console.log( res );
      if( 0 ==res.data.status )
      {


        // 清除globalData.cart内对应的购物车数据
        for( let i =App.globalData.cart.length-1 ; i>=0 ; i--   )
        {
          // console.log( "cart " , App.globalData.cart[i]['ghsid'] );
          // console.log( "this" , this.data.ghsid );

          if( App.globalData.cart[i]['ghsid'] == this.data.ghsid )
          {
            App.globalData.cart.splice( i , 1 );
          }
        }

        $Toast({
            content: '下单成功',
            type: 'success' ,
            duration:1
        });

         setTimeout(()=>{
          wx.redirectTo({ url : '../feedback/feedback' })
         } , 1200)

      }
      else
      {
        console.log( res );

        $Toast({
              content: '下单失败',
              type: 'error'
          });

      }

    })
    .catch(err=>{
      console.log( err );

    });


  }

  ,checkPostData(){
    console.log( "check" );
    if( !this.data.receiverName )
    {
        $Toast({
              content: '填写收件人姓名',
              type: 'error'
          });
        return false ;
    }

    if( !this.data.receiverPhone || this.data.receiverPhone.length != 11 )
    {
        $Toast({
              content: '收件人手机号格式错误',
              type: 'error'
          });
        return false ;
    }

    if( !this.data.receiverAddress )
    {
        $Toast({
              content: '填写收件人地址',
              type: 'error'
          });
        return false ;
    }

    return true ;
  }

  
})