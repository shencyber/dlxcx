// miniprogram/pages/cart.js
var App= getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ghsid:[],
    ghs:[],
    cart:[]  //购物车数据，根据供货商id来区分

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
      this.sperate( App.globalData.cart );

  },


//将数据分割成适合view层渲染的数组
  sperate( data ){
    console.log( "yuanshishuju" , data );

    /***************************************************/
    let ghsid = [] ; //存储供货商id
    let ghs = [] ; //供货商信息
    let goods = [] ; //存储对应的商品信息
    for(let i in data )
    {
      if( !ghsid.includes( data[i]['ghsid'] ) )
      {

        ghsid.push( data[i]['ghsid'] );
        ghs.push( { ghsid: data[i]['ghsid'] , ghsname:data[i]['ghsname'] } );
      } 
    }

    this.setData( {ghs:ghs} );
    this.setData( {ghsid:ghsid} );


     for( let i in ghsid )
     {
       goods[i] = [] ;
       let _ghsid = ghsid[i];

       for( let j in data )
       {
          if( data[j]['ghsid'] == _ghsid )
          {
            goods[i].push(data[j])
          }
       }

     }
     console.log("goods" , goods);
     
     this.setData( { cart :  goods } );
     console.log("cart" , this.data.cart);
     console.log(  this.data.ghsid);

    /***************************************************/

  }


  /**
   * [add 购物车增加商品数量]
   * @param {[type]} e [description]
   */
  ,add( e ){
    let index = e.currentTarget.dataset.index ; //
    let subindex = e.currentTarget.dataset.subindex ; //
    let tmp = this.data.cart;
    tmp[index][subindex]['amount']++;
    this.setData( {cart : tmp } );
    console.log( "cart" , this.data.cart );
    console.log( "App" , App.globalData.cart );return ;
    
    let gid = this.data.cart[index][subindex]['gid'] ; //
    // 更新globalData内的数据
    let appCart = App.globalData.cart; 
    for( let i in  appCart )
    {
      if( gid == appCart[i]['gid'] )
      {
        appCart[i]['amount']++ 
      }
    }
    App.globalData.cart = appCart;
  }

  /**
   * [minus 减少商品数量]
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  ,minus( e ){
    let index = e.currentTarget.dataset.index ; //
    let subindex = e.currentTarget.dataset.subindex ; //
    if( this.data.cart[index][subindex]['amount'] > 0 )
    {
      let tmp = this.data.cart;
      tmp[index][subindex]['amount']--;
      this.setData( {cart : tmp } );
    }
    // console.log( this.data.cart );

    let gid = this.data.cart[index][subindex]['gid'] ; //
    // 更新globalData内的数据
    let appCart = App.globalData.cart; 
    for( let i in  appCart )
    {
      if( gid == appCart[i]['gid'] )
      {
        appCart[i]['amount']++ 
      }
    }

    App.globalData.cart = appCart;
    console.log( App.globalData.cart );


  }

  /**
   * [delete 删除购物车内的商品]
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  ,deleteGoods( e ){

    let index = e.currentTarget.dataset.index ; //
    let subindex = e.currentTarget.dataset.subindex ; //
    let gid = this.data.cart[index][subindex]['gid'];
    
    this.data.cart[index].splice( subindex , 1  );

    //如果该供货商下面已经没有商品，则去除该cart数据和ghs数据
    if(  0 == this.data.cart[index].length )
    {
      this.data.ghs.splice( index , 1 );
      this.data.ghsid.splice( index , 1 );
      this.data.cart.splice( index , 1 );
      console.log( "shachu" );

    }

    this.setData( { ghs : this.data.ghs } );
    this.setData( { ghsid : this.data.ghsid } );
    this.setData( { cart : this.data.cart } );

    for( let i in App.globalData.cart )
    {
      if( App.globalData.cart[i]['gid'] == gid )
      {
        console.log( "i" , i );
        App.globalData.cart.splice( i , 1 );
      }
    }
    // console.log( gid );return ;

    // this.data.cart[index][subindex]
    console.log( "供货商" , this.data.ghs );
    console.log( "供货商id" ,  this.data.ghsid );
    console.log( "cart" , this.data.cart );
    console.log( App.globalData.cart );
    //

  }

  /**
   * [deleteGhs 删除供货商及其下面的所有商品]
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  ,deleteGhs( e ){

  }

  /**
   * [xiadan 下单]
   * @return {[type]} [description]
   */
  ,xiadan( e ){
      // console.log( this.data. );
    let index = e.currentTarget.dataset.index ; 
    let ghsid = this.data.ghsid[index];
    wx.navigateTo({ url : `../xiadandetail/xiadandetail?ghsid=${ghsid}` });
  }







})