// pages/over/over.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectDoods:[],
    paymentMethods: [
      { label: '微信支付', value: 'wechat_pay', checked: false },
      { label: '支付宝支付', value: 'alipay', checked: false },
      {label:'学费余额支付',value:'balance',checked:true}
    ],
    total:0,
    user:[],
    methpay:'balance',
    restaurant_id:0,
    order_id:0,
    detail_id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      user:wx.getStorageSync('user')
    })
  
    let res_id=parseInt(options.res_id)
  

    this.setData({
      restaurant_id:res_id
    })
    let i=parseInt(options.total)
    console.log(options)
      this.setData({
          selectDoods:wx.getStorageSync('seleGoods')
      })
      this.setData({
        total:i
      })
      console.log(this.data.total)
      console.log(this.data.selectDoods)
      this.updateStorage()
  },
  updateStorage(){//更新
    wx.request({
      url:app.globalData.baseUrl+'/user/getById',
      method:"GET",
      data:{'user_id':this.data.user.user_id}
      ,
      success:(res)=>{
        if(res.data.code==0){//成功
          console.log("成功查询更新")
          console.log(res.data.data[0])
          this.setData({
            user:res.data.data[0]
          })
          console.log(this.data.user)
          wx.setStorageSync('user',this.data.user)
        }
        else{
          console.log("000000失败")
        }
      },
    })
  }
  ,
  goback:function(e){
    console.log("返回")
    wx.navigateBack({
      delta: 1
    });
  }
  ,
  onPaymentChange(e) {//
    const value = e.detail.value;
    console.log("看看")
    console.log(value)
    // const paymentMethods = this.data.paymentMethods.map(method => ({
    //   ...method,
    //   checked: method.value === value
    // }));
    this.setData({methpay:value});
   
  },
  ///////////////////////////////////////////////////////////之后更改跳转为订单表
  submitOrder:function(e){//支付

    // 
    if(this.data.methpay==='balance'){//学费
      if(this.data.user.balance>=this.data.total){
        let newbal=this.data.user.balance-this.data.total
        let arr=this.data.user
        arr.balance=newbal
        this.setData({
          user:arr
        })
        wx.request({
          url:app.globalData.baseUrl+'/user/save',
          method:"POST",
          data:{'user_id':this.data.user.user_id,"balance":newbal}
          ,
          success:(res)=>{
            if(res.data.code==0){//成功
              console.log("成功")
              console.log(wx.getStorageSync('user'))
              //更新
              wx.setStorageSync('user', this.data.user)
              this.setorder()
            }
            else{
              console.log("000000失败")
            }
          },
        })
      }
      else{
        wx.showToast({
          title: '余额不足',
          icon:"error"
        })
        return
      }
    }

  },
  setorder(){//生成订单
    //订单
    console.log("ceshi")
    console.log(typeof this.data.restaurant_id)
    wx.request({
      url:app.globalData.baseUrl+'/order/add',
      method:"POST",
      data:{'user_id':this.data.user.user_id,'restaurant_id':this.data.restaurant_id,'total_amount':this.data.total},
      success:(res)=>{
        if(res.data.code==0){
        console.log("订单加载成功")
        this.getorderid()
      }
        else{
          console.log("订单加载失败")
        }
      }
    }) 
  }
  ,
  getorderid(){
      wx.request({
         url:app.globalData.baseUrl+'/order/findorderid',
         method:"GET",
         success:(res)=>{
           if(res.data.code==0){
             console.log("进入====order")
             console.log(res.data)
             this.setData({
               order_id:res.data.data[0].lost_id
             })
             console.log(this.data.order_id)
             this.findetail()
           }
           else{
             console.log("findorder失败")
           }
         }
      })

  },
  findetail(){//发现最大detail_iddetail_id
    wx.request({
      url:app.globalData.baseUrl+'/order/findordermaxid',
      method:"GET",
      success:(res)=>{
        if(res.data.code==0){
          console.log("进入====order")
          this.setData({
            detail_id:res.data.data[0].max_id
          })
          console.log(this.data.detail_id)
          this.inOrderDetail()
        }
        else{
          console.log("findorder失败")
        }
      }
   })
  }
  ,
inOrderDetail(){//加入订单细节表
  for(let j=1;j<=this.data.selectDoods.length;j++){
  wx.request({
  url:app.globalData.baseUrl+'/order/add_detail',
  method:"POST",
  data:{"detail_id":this.data.detail_id+j,"order_id":this.data.order_id,"dish_id":this.data.selectDoods[j-1].dish_id,"quantity":this.data.selectDoods[j-1].stock},
  success:(res)=>{
    if(res.data.code==0){
      console.log("成功加入")
    }
  }
})}
wx.reLaunch({
  url: '/pages/order/order',
})

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})