// index.js
const app = getApp()
Page({
  data:{
      restaurantlist:[]
  }
  ,
  /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      console.log("user:",)
      wx.request({
        url:app.globalData.baseUrl+'/restaurant/list',
        method:"GET",
        success:(res)=>{
          if(res.data.code==0){
            console.log(res.data.data)
              this.setData({restaurantlist:res.data.data})
          }
          else{
            console.log("000000")
          }
        },
      })
  //     const that = this;
  //     wx.request({
  //         url: 'http://127.0.0.1:3000/',
  //         success: function (res) {
  //           that.setData({
  //             id:res.data[0].id,
  //             name:res.data[0].name
  //           })
  //             // console.log(res.data)
  //             // console.log(this.data.id)
  //             // that.setData({ names: res.data })
  //         }
  //     })
  },
  itemtap:function(event){
    const id=event.currentTarget.dataset.id;
    console.log("点击了"+id);
    console.log()
    wx.navigateTo({
      url: '/pages/shop/shop?resid='+id,
    })
  }
})
