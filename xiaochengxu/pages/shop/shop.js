
// pages/shop/shop.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageSrc:"",
    restaurant_id:0,
    restaurant_name:"",
    restaurant_url:"",
    opening_hours:"",
    tabs:['商品','评价','其他'],
    itemWidth: 0,
    windowWidth: 0,
    tabIndex: 0,
    sliderLeft: 0,
    sliderOffset: 0,
    sliderOffsets: [],
    listData:[],
    dishlist:[],//菜
    dishMap: new Map(),
    // category_id:1,
    idx: 0,
    scrollTop: 0,
    toView:'position0',
    selectGoods:[]//已选商品，
    ,
    selectedCount:0,
    totalPrice:0,
    isCartExpanded: false,
    remarklist:[],
    isLoading: false, // 是否正在加载更多数据
    hasMore: true, // 是否还有更多数据
   userlist:[]//存储
  },
goback:function(e){
  console.log("1111111111")
  wx.reLaunch({
    url: '/pages/index/index',
  })
},
selectgood:function(event){
  var index = event.currentTarget.dataset.index;
  console.log(index)
for(let i=0;i<this.data.selectGoods.length;i++){
  if(this.data.selectGoods[i].dish_id===index){
    wx.showToast({
      title: '已添加',
      icon:"error"
    })
    return
  }
}
console.log(this.data.dishlist)
  for(let i=0;i<this.data.dishlist.length;i++){
    if(this.data.dishlist[i].dish_id==index){
      const newI=[...this.data.selectGoods,this.data.dishlist[i]]
    this.setData({
      selectGoods:newI
    })
      console.log("添加成功！")
      break;
    }
  }
  console.log("添加商品")
  console.log(this.data.selectGoods)
  this.updateCartSummary();
}
,
updateCartSummary() {
  this.setData({
    selectedCount:this.data.selectGoods.length,
    totalPrice:this.data.selectGoods.reduce((sum,good) => sum + good.price*good.stock , 0)
  });
}
,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("=========================================")
    console.log("获取的数据"+options.resid);
    const res_id=options.resid;
    this.setData({
      restaurant_id:res_id
    })
    this.get_resbyid(res_id)
    //获得餐厅菜类
this.getcategory(res_id)
    // 获取该餐厅的菜品



// 
let that = this;
// 计算
wx.getSystemInfo({
  success: function(res) {
    // 每个item应占的宽度向上取整，限tab栏不会滑动的情况。
    let windowWidth = res.windowWidth;
    let itemWidth = Math.ceil(windowWidth / that.data.tabs.length);
    // 初始化每个项目的偏移量，存入数组
    let tempArr = [];
    for (let i in that.data.tabs) {
      tempArr.push(itemWidth * i);
    }
    // 32是两个字体（16px）的宽度。tab中字数不同的话需要调整...
    that.setData({
      sliderLeft: (res.windowWidth / that.data.tabs.length - 32) / 2,
      sliderOffsets: tempArr,
      sliderOffset: 0,
      itemWidth: itemWidth,
      windowWidth: windowWidth
    });
  }
});
this.loadItems()
this.getremarklist()
  },
  get_resbyid(e){
    console.log("----------"+e)

    this.setData({
      restaurant_id:e
    })
 wx.request({
  url: app.globalData.baseUrl+'/restaurant/getone',
  method:"GET",
  data:{"restaurant_id":e},
  success:(res)=>{
    console.log(res.data.data[0].restaurant_name)
this.setData({
    restaurant_name:res.data.data[0].restaurant_name,
    restaurant_url:res.data.data[0].image_url,
    opening_hours:res.data.data[0].opening_hours
  });
}
})
  },
  getcategory(e){//获得菜类
    console.log("进入餐厅踩雷请求")
    wx.request({
      url: app.globalData.baseUrl+'/restaurant/getcategory',
      method:"GET",
  data:{"restaurant_id":e},
  success:(res)=>{
console.log("踩雷")
    console.log(res.data.data)
    this.setData({
     listData:res.data.data,
  });
  const category = res.data.data;
  const map = new Map();
  for(var i = 0;i<category.length;i++){
    console.log(typeof map);
    console.log(typeof this.data.dishMap);
    map.set(category[i].category_id,[])
  }
  this.setData({
    dishMap: map
  })
  this.getdish()
  console.log(this.data.dishMap);
  console.log("展示")
  console.log(this.data.listData)
}
    })
  }
  ,
  getdish(){//获得菜品
    console.log("进入餐厅菜品请求")
    console.log(this.data.category_id)
    // console.log(e);
    wx.request({
      // url: app.globalData.baseUrl+'/dish/listByres_idandcat_id',
      url: app.globalData.baseUrl+'/restaurant/dishlist',
      method:"GET",
      data:{"restaurant_id":this.data.restaurant_id},
      success:(res)=>{
        console.log("菜品----")
        console.log(res)
      const dishes = res.data.data;
      console.log(this.data.dishMap);
      console.log(dishes);
      for(var i = 0;i<dishes.length;i++){
       this.data.dishMap.get(dishes[i].category_id).push(dishes[i]);
      }
      console.log(this.data.dishMap);
      this.setData({
        dishlist: this.data.dishMap.get(dishes[0].category_id)
      })
      console.log("展示caipin")
      console.log(this.data.dishlist)
    }
    })

  }
  ,
  loadItems() {
    if (this.data.isLoading || !this.data.hasMore) return;
    this.setData({ isLoading: true });
    // 模拟异步加载数据
    // setTimeout(() => {
    //   const newItems = Array.from({ length: this.data.limit }, (_, i) => ({
    //     remark_id: `${this.data.page}-${i + 1}`,
    //     remark: `Item ${this.data.page}-${i + 1}`
    //   }));

    //   this.setData({
    //     remarklist: [...this.data.remarklist, ...newItems],
    //     page: this.data.page + 1,
    //     isLoading: false
    //   });

    //   // 模拟没有更多数据的情况
    //   if (this.data.page >= 3) {
    //     this.setData({ hasMore: false });
    //   }
    // }, 1000);
  },

  loadMore() {
    this.loadItems();
  }
,
getremarklist(){///////评论集合
  wx.request({
    url: app.globalData.baseUrl+'/remark/findByrestaurant_id',
    method:"GET",
    data:{"restaurant_id":this.data.restaurant_id},
    success:(res)=>{
      if(res.data.code==0){
        console.log("成功金如")
        console.log(res.data.data)
        this.setData({
            remarklist:res.data.data
        })
        console.log(this.data.remarklist)
        // this.getuserlist()
      }else{
        console.log("失败金如")
      }
    }
  })
}
,
// async getuserlist(){
//     let arr=this.data.remarklist
//     let narr=[]
//     for(let i=0;i<arr.length;i++){
//       let uid=arr[i].user_id;
//       narr.push(uid)
//     }
//     wx.request({
//       url: app.globalData.baseUrl+'/user/getByIds',
//       method:"GET",
//       data:{"user_ids":narr},
//       success:(res)=>{
//         if(res.data.code==0){
//           console.log("1233==")
//           console.log(res.data.data)
//           this.setData({
//             userlist:res.data.data
//           })
//         }
//         else{
//           console.log("失败==-=-=-=--==-")
//         }
//       }
//     })
//     console.log("zheli")
//     console.log(this.data.userlist)
// },





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
  ,
    // 处理点击tab
    onTabClick(e) {
      let id = e.currentTarget.id;
      // 取新的偏移，完成transition和transform的参数
      let newOffset = this.data.sliderOffsets[id];
      this.setData({
        tabIndex: id,
        sliderOffset: newOffset
      })
    },
  
    // 处理swiper改变
    swiperChange(e) {
      this.setData({
        sliderOffset: this.data.sliderOffsets[e.detail.current],
        tabIndex: e.detail.current,
      })
    },
  
    //  处理手动滑动swiper-item.可以进一步对滚动条进行动画优化，但并不推荐。需要的话将注释放开即可
    swiperTran(e){
      console.log("滑动tab中...")
    },
  
    // 滑动动画完毕后执行的方法(不管滑动是否完成切换)
    animationfinish(e){
      console.log("动画执行完毕触发animationfinish")
    },
//////////////////////菜单


  switchClassfun(e){
    var i = e.currentTarget.dataset.index;
    var c = e.currentTarget.dataset.category;
    console.log(i);
    console.log(this.data.dishMap);
    console.log("000000000")
    this.setData({ idx: i, toView: 'position' + i });
console.log(c)
    this.setData({
      dishlist: this.data.dishMap.get(c)
    })
    console.log(this.data.dishlist);
  },
  toggleCartDetails() {
    console.log("点击了")
    console.log(this.data.selectGoods)
    this.setData({ isCartExpanded: !this.data.isCartExpanded });
  },
  jia:function(e){
      console.log("jia")
      let lest=this.data.selectGoods
      lest[e.currentTarget.dataset.sel_index].stock+=1
     this.setData({
       selectGoods:lest
     })
      console.log(this.data.selectGoods)
      this.updateCartSummary();
  },
  // 去结算
  goToCheckout:function(){
    let arr=this.data.selectGoods
    wx.setStorageSync('seleGoods', arr)
    // let codeArray=encodeURIComponent(JSON.stringify(arr))
    wx.navigateTo({
      url: '/pages/over/over?total='+this.data.totalPrice+'&res_id='+this.data.restaurant_id,
    })
    //结算
  }
  ,
  jian:function(e){
    console.log("jian")
    let lest=this.data.selectGoods
  
    if(lest[e.currentTarget.dataset.sel_index].stock==1){
      const arr=new Array();
      for(let i=0;i<lest.length;i++){
          if(i!=e.currentTarget.dataset.sel_index){
            arr.push(lest[i])
          }
      }
      console.log(arr)
      this.setData({
        selectGoods:arr
      })
      console.log("删除成功")
      console.log(this.data.selectGoods)
      this.updateCartSummary()
      wx.showToast({
        title: '菜品已取消',
        icon:"error"
      })
      return
    }
    else{
    lest[e.currentTarget.dataset.sel_index].stock-=1
   this.setData({
     selectGoods:lest
   })
    console.log(this.data.selectGoods)
    this.updateCartSummary();}
  },
  // bindscrollfunc(e){
  //   var arr = [];
  //   for(var item of this.data.positions){
  //     if (item.top <= e.detail.scrollTop + 1){
  //       arr.push(item)
  //     }
  //   }
  //   this.setData({ idx:arr[arr.length-1].dataset.index })
  // },
})