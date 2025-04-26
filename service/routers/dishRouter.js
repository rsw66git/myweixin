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
//查询用户
router.get("/dish/listByres_idandcat_id",(req,resp)=>{
    console.log("成功进入--------dish")
    //定义查询用户表的sql语句
    const { restaurant_id, category_id } = req.query;
    let sql = `
SELECT * FROM dish 
WHERE restaurant_id =? AND category_id=?
    `
    //访问数据库，进行用户查询
    //err:执行时产生的错误消息(如果有)
    //res:执行时返回的数据库结果数据
    params = [restaurant_id,category_id]
    db.query(sql,[restaurant_id, category_id],(err,res)=>{
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