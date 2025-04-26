// pages/login/login.js
//获取全局的app对象
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        disabled:true,
        student_id:"",
        password:""
    },
    //账号文本框输入事件
    student_idInput(e){
      
        //获取当前输入的账号
        let student_id = e.detail.value
        
        if(student_id){
            //让登陆按钮处于启用状态
            this.setData({
                disabled:false,
                student_id:student_id
            })
        }else{
            this.setData({
                disabled:true,
                student_id:student_id
            })
        }
    },
    //绑定密码的失焦函数
    pwdBlur(e){
        //将密码框中的数据，设置到data.password上
        this.setData({
            password:e.detail.value
        })
    },
    //点击登陆按钮
    login(e){
        //判断是否输入密码
        if(!/^(?!0+$)\d{12}$/.test(this.data.student_id)){
          wx.showToast({
            title: '学号错误',
            icon:"error"
          })
          return
        }
        if(!this.data.password){
            wx.showToast({
              title: '请输入密码',
              icon:"error"
            })
            return
        }

        //发起服务端请求，进行登陆操作
        wx.request({
          //请求地址
          url:app.globalData.baseUrl+'/user/login',
          //请求方法
          method:"POST",
          //提交到后端的数据
          data:{
              "student_id":this.data.student_id,
              "password":this.data.password
          },
          success:(res)=>{
              //请求成功之后，获取后端响应的结果
              if(res.data.code==0 &&
                res.data.data.length>0){
                    wx.showToast({
                      title: '登陆成功',
                      icon:"success"
                    })
                    //登陆成功，将用户数据，存储到本地
                    wx.setStorageSync('user', res.data.data[0])
                    //跳转到商品首页
                    wx.reLaunch({
                      url: '/pages/index/index',
                    })
            }else{
                wx.showToast({
                  title: '登陆失败',
                  icon:"error"
                })
            }
          }
        })
    },
    //注册事件
    regist(e){
        wx.navigateTo({
          url: '/pages/regist/regist',
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