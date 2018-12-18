// pages/xiadandetail/xiadandetail.js
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    ghsid:'' ,//供货商id
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
    console.log( this.data.ghsid );

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

    // console.log("ghsid" , this.data.ghsid);
    // console.log("goods" , this.data.goods);
    // console.log("totalprice" , this.data.totalPrice);
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
  

  //debug
    let postData = {
      "ghsid":1,
      // "ghsname" :"季金磊" ,
      "dlsid":"2",
      "receivername":"收件人jack",
      "receiverphone":"1569323315",
      "address":"上海市XXX区",
      "totalprice":this.data.totalprice,
      "totalfreight":0,
      "goods":[]
      // "goods":[{"goodid":1,"unitprice":100,"amount":3},{"goodid":2,"unitprice":100,"amount":3}]
    }
    for( let i in this.data.goods )
    {
      postData['goods'].push({ 
        goodsid:this.data.goods[i]['gid'] , 
        unitprice:this.data.goods[i]['unitprice'] ,
        amount:this.data.goods[i]['amount'] 
      });
    }

    App.api.postApi(
      '/index/orders/add',
      postData
    )
    .then(res=>{
      console.log( res );
    })
    .catch(err=>{
      console.log( err );

    });


  }

  
})