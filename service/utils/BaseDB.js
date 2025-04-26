// 导入mysql模块
const mysql = require("mysql")

// 创建数据库连接
const db = mysql.createConnection({
    //数据库主机地址
    host:"localhost",
    //数据库账号
    user:"root",
    //数据库密码
    password:"root",
    //操作的目标数据库
    database:"wexin"
})

//导入数据库连接对象
module.exports=db