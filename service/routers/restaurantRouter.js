// 导入express模块
const express = require("express")
//获取路由实例
const router = express.Router()
//导入数据库连接对象
const db = require("../utils/BaseDB")
//导入结果封装类
const result = require("../utils/Result")

//定义用户模块相关的路由
//通过路由实例，定义请求规则
router.get("/",(req,resp)=>{
    console.log("客户端请求了服务器根地址....")

    //获取客户端传入的数据
    console.log("req.query:",req.query)
    console.log(req.query.a,req.query.b)

    //使用响应对象，向客户端返回数据
    resp.send("你好，客户端!")
})
//查询餐厅
router.get("/restaurant/list",(req,resp)=>{
    console.log("成功进入--------res")
    //定义查询用户表的sql语句
    let sql = `
SELECT restaurant_id,restaurant_name,location,opening_hours,image_url
FROM restaurant
    `
    //访问数据库，进行用户查询
    //err:执行时产生的错误消息(如果有)
    //res:执行时返回的数据库结果数据
    db.query(sql,(err,res)=>{
        //表示访问数据库有错误
        //js中，变量非空即为真
        if(err){
            resp.send(result.fail(err))
        }else{
            console.log(res)
            //如果没有错误信息，则表示访问成功
            resp.send(result.success(res))
        }
    })
})
router.get("/restaurant/getone",(req,resp)=>{
    console.log("成功进入--------res")
    //定义查询用户表的sql语句
    let sql = `
SELECT restaurant_name,location,opening_hours,image_url
FROM restaurant where restaurant_id=?
    `
    //访问数据库，进行用户查询
    //err:执行时产生的错误消息(如果有)
    //res:执行时返回的数据库结果数据
    db.query(sql,req.query.restaurant_id,(err,res)=>{
        //表示访问数据库有错误
        //js中，变量非空即为真
        if(err){
            resp.send(result.fail(err))
        }else{
            console.log(res)
            //如果没有错误信息，则表示访问成功
            resp.send(result.success(res))
        }
    })
})

router.get("/restaurant/getcategory",(req,resp)=>{
    console.log("成功进入--------res")
    //定义查询用户表的sql语句
    let sql = `
SELECT * FROM category
WHERE category.category_id IN(
SELECT category_id FROM dish LEFT JOIN restaurant ON dish.restaurant_id=restaurant.restaurant_id
WHERE 
restaurant.restaurant_id=?
)
    `
    //访问数据库，进行用户查询
    //err:执行时产生的错误消息(如果有)
    //res:执行时返回的数据库结果数据
    db.query(sql,req.query.restaurant_id,(err,res)=>{
        //表示访问数据库有错误
        //js中，变量非空即为真
        if(err){
            resp.send(result.fail(err))
        }else{
            console.log(res)
            //如果没有错误信息，则表示访问成功
            resp.send(result.success(res))
        }
    })
})
//查询该餐厅所有菜
router.get("/restaurant/dishlist",(req,resp)=>{
    console.log("成功进入--------dishlist")
    //定义查询用户表的sql语句
    let sql = `
SELECT dish.* FROM dish LEFT JOIN restaurant ON dish.restaurant_id=restaurant.restaurant_id
where restaurant.restaurant_id=?
    `
    //访问数据库，进行用户查询
    //err:执行时产生的错误消息(如果有)
    //res:执行时返回的数据库结果数据
    db.query(sql,req.query.restaurant_id,(err,res)=>{
        //表示访问数据库有错误
        //js中，变量非空即为真
        if(err){
            resp.send(result.fail(err))
        }else{
            console.log(res)
            //如果没有错误信息，则表示访问成功
            resp.send(result.success(res))
        }
    })
})

//导出用户模块定义的路由
module.exports = router