// pages/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:[],
    orderList:[],
    currentPage: 1,
    totalPages: 1,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
this.setData({
  user:wx.getStorageSync('user')
})
this.loadOrders()
  },
  loadOrders(page=1) {
    if (this.data.loading) return;
    this.setData({ loading: true });
    console.log("ppppppppppppppp")
    wx.request({
      url:app.globalData.baseUrl+'/order/FindByuser_id', 
      method: 'GET',
      data: {"user_id":this.data.user.user_id,
      "page": page,
      "limit": 3
      },
      success:(res)=>{
        if (res.data.code==0) {
          console.log("--=-=-=-=-=-=-=")
          console.log(res.data.data)
          this.setData({
            orderList:res.data.data.orders,
            currentPage: res.data.data.pagination.currentPage,
            totalPages: res.data.data.pagination.totalPages,
            loading: false
          })
          console.log(this.data.orderList)
        } else {
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          });
        }
      },
      fail() {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
        that.setData({ loading: false });
      }
    });
  },
  prevPage() {
    if (this.data.currentPage > 1) {
      this.loadOrders(this.data.currentPage - 1);
    }
  },

  nextPage() {
    if (this.data.currentPage < this.data.totalPages) {
      this.loadOrders(this.data.currentPage + 1);
    }
  },
  goremark(e){//去评论
    console.log("跳转")
      wx.navigateTo({
        url: '/pages/remark/remark?res_id='+e.currentTarget.dataset.index,
      })
  },
  goback(){
    wx.reLaunch({
      url: '/pages/index/index',
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