// pages/xiadandetail/xiadandetail.js
var App = getApp();
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
    this.data.ghsname = options.ghsname ;
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

    //   dlsid : 1 ,  //代理商id
    //   ghsid : '' ,  // 供货商id
    //   goods : [] ,  // 商品信息 { gid-商品id , amount-数量 , unitprice-单价 }
    // };
    // let postData = {

    // {
  

  //debug  供货商id dlsid写死了
    let postData = {
      "ghsid":1,
      "ghsname" :this.data.ghsname ,
      "dlsid":"2",
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
        wx.navigateTo({url:'../feedback/feedback'});
      }
      else
      {
        console.log( res );
      }

    })
    .catch(err=>{
      console.log( err );

    });


  }

  
})