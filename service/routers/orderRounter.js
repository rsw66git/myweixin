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
//查询订单列表分页查询
router.get("/order/FindByuser_id",(req,res)=>{
  console.log("分页============")
//     console.log("成功进入---list-----orderorder")
//     //定义查询用户表的sql语句
 
//     let sql = `
// SELECT * FROM \`order\`
// WHERE user_id=?
//     `
//     //访问数据库，进行用户查询
//     //err:执行时产生的错误消息(如果有)
//     //res:执行时返回的数据库结果数据
//     db.query(sql,req.query.user_id,(err,res)=>{
//         //表示访问数据库有错误
//         //js中，变量非空即为真
//         if(err){
//             resp.send(result.fail(err))

//         }else{
//             console.log(res)
//             //如果没有错误信息，则表示访问成功
//             resp.send(result.success(res))
//         }
//     })
const user_id = req.query.user_id;
  const page = parseInt(req.query.page) || 1; // 当前页码，默认第一页
  const limit = parseInt(req.query.limit) ||5; // 每页条目数，默认10条
  const offset = (page - 1) * limit;

  // 定义查询订单列表的 SQL 语句
  let sql = `
    SELECT 
      *
    FROM \`order\`
    WHERE user_id = ?
    ORDER BY order_time DESC
    LIMIT ? OFFSET ?
  `;

  // 查询总记录数的 SQL 语句
  let countSql = `
    SELECT COUNT(*) AS total 
    FROM \`order\`
    WHERE user_id = ?
  `;

  db.query(countSql, [user_id], (countErr, countRes) => {
    if (countErr) {
      console.log("11111")
      return res.send(result.fail(countErr));
    }
    const total = countRes[0].total;
    const totalPages = Math.ceil(total / limit);

    // 执行查询订单列表的 SQL
    db.query(sql, [user_id, limit, offset], (err, rows) => {
      if (err) {

        console.log("2222")

        return res.send(result.fail(err));

      } else {
        console.log(rows);
        res.send(result.success({
          orders: rows,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total
          }
        }));
      }
    });
  });
})
router.get("/order/findorderid",(req,resp)=>{
    console.log("成功进入-----find---orderorder")
    //定义查询用户表的sql语句
 
    let sql = `
SELECT LAST_INSERT_ID() as lost_id
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
//插入新订单
router.post("/order/add",(req,resp)=>{
    console.log("成功进入---1111-----新增orderorder")
    
    const {user_id,restaurant_id,total_amount}=req.body
    console.log(req.body)
    let sql= `
    INSERT INTO \`order\` (
      \`user_id\`, 
      \`restaurant_id\`, 
      \`order_time\`, 
      \`total_amount\`, 
      \`order_status\`
    ) VALUES (?, ?, NOW(), ?, '已付款')
  `;
//     let sql = `
// INSERT 
// INTO `order`(order.user_id,order.restaurant_id,order.order_time,order.total_amount,order.order_status)
//   VALUES(?,?,NOW(),?,'已付款')
//     `
    //访问数据库，进行用户查询
    //err:执行时产生的错误消息(如果有)
    //res:执行时返回的数据库结果数据
    let params = [user_id,restaurant_id,total_amount]
    db.query(sql,params,(err,res)=>{
        //表示访问数据库有错误
        //js中，变量非空即为真
        if(err){
            resp.send(result.fail(err))
        }else{
//获取新增的id并赋值给order_id_new
          
            //如果没有错误信息，则表示访问成功
            resp.send(result.success(res))

        }
    })
})
//新增订单详情表
//1找到最大id
router.get("/order/findordermaxid",(req,resp)=>{
    console.log("成功进入-----find---orderorder")
    //定义查询用户表的sql语句
    let sql = `
SELECT MAX(detail_id) AS max_id FROM order_detail
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
router.post("/order/add_detail",(req,resp)=>{
    console.log("成功进入---1111-----新增orderorder")
    
    const {detail_id,order_id,dish_id,quantity}=req.body
    console.log(req.body)
    let sql= `
    INSERT INTO \`order_detail\` (
      \`detail_id\`, 
      \`order_id\`, 
      \`dish_id\`, 
      \`quantity\`
    ) VALUES (?, ?, ?, ?)
  `;
//     let sql = `
// INSERT 
// INTO `order`(order.user_id,order.restaurant_id,order.order_time,order.total_amount,order.order_status)
//   VALUES(?,?,NOW(),?,'已付款')
//     `
    //访问数据库，进行用户查询
    //err:执行时产生的错误消息(如果有)
    //res:执行时返回的数据库结果数据
    let params = [detail_id,order_id,dish_id,quantity]
    db.query(sql,params,(err,res)=>{
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


//导出用户模块定义的路由
module.exports = router