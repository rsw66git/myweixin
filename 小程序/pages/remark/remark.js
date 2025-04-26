// pages/remark/remark.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      restaurant_id:0,
      user:[],
      remark:'',
      remark_id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("获取的餐厅id")
    console.log(options.res_id)
    console.log("获取的user")
    console.log(wx.getStorageSync('user'))
    this.setData({
      user:wx.getStorageSync('user')
    })
   this.setData({
     restaurant_id:options.res_id
   })
  },
  onInput(e) {
    this.setData({
      remark: e.detail.value
    });
  },
  onSend(){
if(this.data.remark.length==0){
  wx.showToast({
    title: '未输入评论',
    icon:"error",
});
return
}
else{
wx.request({
  url:app.globalData.baseUrl+"/remark/findremarkmaxid",
  method:"GET",
  success:(res)=>{
    if(res.data.code==0){
      console.log("成功今")
      this.setData({
        remark_id:res.data.data[0].max_id
      })
      this.insertremark()
    }else{
      console.log("失败")
    }
  }
})
}

  },
  insertremark(){
    wx.request({
      url:app.globalData.baseUrl+"/remark/add",
      method:"POST",
      data:{"remark_id":this.data.remark_id+1,
      "username":this.data.user.username,
      "restaurant_id":this.data.restaurant_id,
      "remark":this.data.remark
    },
    success:(res)=>{
      if(res.data.code==0){
        console.log("加入成功")
        wx.showToast({
          title: '评论成功',
        })
        wx.navigateTo({
          url: '/pages/shop/shop?resid='+this.data.restaurant_id,
        })
      }
      else{
        console.log("加入失败")
      }
    }
    })
  },
  goback(){
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