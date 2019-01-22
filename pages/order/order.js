// miniprogram/pages/order/order.js
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:'tab1',
    currentpage:1,
    pagesize:1,
    total:0,
    status:1,  


    orders:[],

    showMore:false,

    nothing:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    
    //加载待付款数据
    this.getList(this.data.currentpage,this.data.pagesize , 1);

  },
  

  handleChange({detail}){
    this.setData({
        current: detail.key,
        nothing:false
    });
    switch(detail.key)
    {
      case "tab1":
        this.data.status = 1 ;
        break;
      case "tab2":
        this.data.status = 2 ;
        break;
      case "tab3":
        this.data.status = 3 ;
        break;
      case "tab4":
        this.data.status = 4 ;
        break;
    }

    this.getList(this.data.currentpage,this.data.pagesize , this.data.status);
  },

  more(){

    ++this.data.currentpage;
    this.getList(this.data.currentpage,this.data.pagesize , this.data.status);

  },

  /**
   * [getList 获取订单列表]
   * @param  {[type]} currentpage [当前页]
   * @param  {[type]} pagesize    [每页显示数量]
   * @param  {[type]} status      [1-待付款 2-待发货 3-已发货 4-已取消]
   * @return {[type]}             [description]
   */
  getList: function ( currentpage,pagesize,status ) {
    let _this = this ;
     App.api.getApi( "/index/orders/dlsOrderListApi" , {dlsid:2,currentpage:currentpage,pagesize:pagesize,status:status} )
    .then(res=>{
      console.log( res );
      if( 0 == res.data.status )
      {
        // let _res = res.data.result ;
        // for( let i in _res )
        // {
        //   let _sum = 0;
        //   for(let j in _res.goods)
        //   {
        //     _sum += _res.goods[j]['unitprice']*_res.goods[j]['amount'] ;
        //   }
        //   _res[i]['totalprice'] = _sum ;
        // }

        // console.log( res.data.result );
        if( res.data.result )
        {

          // let _res = this.data.orders ;
          // for(let i in res.data.result)
          // _res.push( res.data.result );

          // console.log( _res );
          this.setData({
            orders : [...this.data.orders , ...res.data.result],
            nothing:false
          });

          console.log( this.data.orders );

          this.data.total = res.data.total ;

          if( this.data.currentpage*this.data.pagesize >= this.data.total )
          {
            this.setData({showMore:false});
          }
          else
          {
            this.setData({showMore:true});
          }
        }
        else
        {
            this.setData({showMore:false,nothing:true});
        }

      }
    })
    .catch(err=>{
      console.log(err);
    });
  },

})