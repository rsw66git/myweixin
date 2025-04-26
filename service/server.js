

// 导入express模块
const express = require("express")

//创建express实例
const app= express()
app.use(express.static('public_img'));
//解析提交的json格式的数据
app.use(express.json())
//解析表单提交的数据
app.use(express.urlencoded({ extended: true }))

//导入用户模块路由
const userRouter = require("./routers/userRouter")
const restaurantRounter=require("./routers/restaurantRouter")
const dishRouter=require("./routers/dishRouter")
//导入商品分类模块路由
// const categoryRouter = require("./routers/categoryRouter")
// //导入商品模块路由
// const commodityRouter = require("./routers/commodityRouter")
// //导入订单模块路由
const orderRouter = require("./routers/orderRounter")
const remarkRouter=require("./routers/remarkRouter")
//配置路由
app.use(userRouter)
app.use(restaurantRounter)
app.use(dishRouter)
app.use(orderRouter)
app.use(remarkRouter)

app.listen(3000,()=>{
  console.log('server running at http://127.0.0.1:3000')
})
