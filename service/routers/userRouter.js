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
router.get("/user/getById",(req,resp)=>{
    console.log("客户端请求了服务器/user/getById")
    //定义查询用户表的sql语句
    let sql = `select 
               *
               from user
               where user_id=?
    `
    //访问数据库，进行用户查询
    //err:执行时产生的错误消息(如果有)
    //res:执行时返回的数据库结果数据

    db.query(sql,req.query.user_id,(err,res)=>{
        //表示访问数据库有错误
        //js中，变量非空即为真
        if(err){
            resp.send(result.fail(err))
        }else{
            //如果没有错误信息，则表示访问成功
            resp.send(result.success(res))
        }
    })
})
router.get("/user/getByIds",(req,resp)=>{
    console.log("客户端请求了服务器/user/getById")
    console.log(typeof req.query.user_ids);
    const ids = JSON.parse(req.query.user_ids);
    const placeholders = ids.map(()=>'?').join(',');
    //定义查询用户表的sql语句
    let sql = `select 
               *
               from user
               where user_id in(${placeholders})
    `
    //访问数据库，进行用户查询
    //err:执行时产生的错误消息(如果有)
    //res:执行时返回的数据库结果数据
    console.log(req.query.user_ids);
    db.query(sql,ids,(err,res)=>{
        //表示访问数据库有错误
        //js中，变量非空即为真
        if(err){
            resp.send(result.fail(err))
        }else{
            //如果没有错误信息，则表示访问成功
            console.log(res);
            resp.send(result.success(res))
        }
    })

})

//用户登陆
router.post("/user/login",(req,resp)=>{
    // 获取提交的用户名
    let student_id = req.body.student_id
    // 获取提交的密码
    let password = req.body.password 
    //测试输出
    console.log(student_id,password)

    //定义查询sql
    let sql = `
        select 
        *
        from user
        where student_id=? and password =?
    `
    //定义参数数组
    let params = [student_id,password]
    //执行查询
    //err:错误信息 res:查询结果记录
    db.query(sql,params,(err,res)=>{
        //查询错误
        if(err){
            resp.send(result.fail(err))
        }else{
            //查询成功,返回查询的记录集合
            resp.send(result.success(res))
        }
    })
})

//用户注册
router.post("/user/regist",(req,resp)=>{
    
    //获取注册表单提交的数据
    //批量解析对象属性数据
    const {username,password,phone,student_id,balance} = req.body
    //定义插入的sql语句
    let sql = `
        insert into user
        (username,password,phone,student_id,balance)
        values
        (?,?,?,?,?)
    `
    //定义sql中的占位参数对应的数据
    let params = [username,password,phone,student_id,balance]
    //执行sql
    db.query(sql,params,(err,res)=>{
        //执行发生错误
        if(err){
            resp.send(result.fail(err))
        }else{
            //返回插入之后结果对象
            resp.send(result.success(res))
        }
    })
})
//更新用余额
router.post("/user/save",(req,resp)=>{
    //获取注册表单提交的数据
    //批量解析对象属性数据
    const {balance,user_id} = req.body
    //定义插入的sql语句
    let sql = `
UPDATE user
SET
balance=?
WHERE user_id=?
    `
    //定义sql中的占位参数对应的数据
    let params = [balance,user_id]
    //执行sql
    db.query(sql,params,(err,res)=>{
        //执行发生错误
        if(err){
            resp.send(result.fail(err))
        }else{
            //返回插入之后结果对象
            resp.send(result.success(res))
        }
    })
})

//导出用户模块定义的路由
module.exports = router