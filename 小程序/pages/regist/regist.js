// pages/company/company.js
//获取全局对象
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //注册按钮的默认状态
    disabled:true,
    //注册按钮的按钮类型
    btnstate:"default",
    //密码框状态
    isPwd:true
  },
  user:{
    username:"",
    password:"",
    phone:"",
    student_id:"",
    balance:0
  },
  //文本框失去焦点(光标离开文本框时触发)
  accountblur(e){
     let username = e.detail.value 
     if(username){
         this.setData({
            disabled:false,
            btnstate:"primary"
         })
     }
  },
  usernameInput(e){
    this.user.username=e.detail.value
  },
  passwordInput(e){
    this.user.password=e.detail.value
  }
  ,
  phoneInput(e){
    this.user.phone=e.detail.value
  },
  student_idInput(e){
this.user.student_id=e.detail.value
  },
  balanceInput(e){
    this.user.balance=e.detail.value
  },
  //swith按钮切换，控制密码显示状态
  swithPwd(e){
    //对当前密码显示状态取反
    this.setData({
        isPwd:!this.data.isPwd
    })
  },
  //表单提交事件
  formSubmit(e){
    //e.detail:可以获取表单的所有数据
    console.log(e.detail)
    if(!/^(?!0+$)\d{12}$/.test(this.user.student_id)){
      wx.showToast({
        title: '学号错误',
        icon:"error"
      })
      return
    }
    if(this.user.password===""||this.user.username===""||this.user.phone===""){
      wx.showToast({
        title: '不能为空',
        icon:"error"
      })
      return
    }
    //提交到后台插入
    wx.request({
      url:app.globalData.baseUrl+"/user/regist" ,
      method:"POST",
      data:e.detail.value,
      success:(res)=>{
         console.log(res.data)
         //跳转
         if(res.data.code==0){
             wx.redirectTo({
               url: '/pages/login/login',
             })
         }
         else{
           wx.showToast({
             title: '注册失败',
             icon:"error"
           })
           return
         }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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