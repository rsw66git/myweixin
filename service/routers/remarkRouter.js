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
//根据restaurant_id查找该餐厅的所有评论
router.get("/remark/findByrestaurant_id",(req,resp)=>{
  console.log("成功进入-----find---remark")

  //定义查询用户表的sql语句
  let sql = `
SELECT * FROM remark
WHERE restaurant_id=?
ORDER BY remark_time DESC
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

//评论分页查询
router.get("/order/FindByres_id",(req,res)=>{
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
const restaurant_id = req.query.restaurant_id;
  const page = parseInt(req.query.page) || 1; // 当前页码，默认第一页
  const limit = parseInt(req.query.limit) ||5; // 每页条目数，默认10条
  const offset = (page - 1) * limit;

  // 定义查询订单列表的 SQL 语句
  let sql = `
    SELECT 
      *
    FROM \`remark\`
    WHERE restaurant_id = ?
    ORDER BY remark_time DESC
    LIMIT ? OFFSET ?
  `;
  // 查询总记录数的 SQL 语句
  let countSql = `
    SELECT COUNT(*) AS total 
    FROM \`remark\`
    WHERE restaurant_id = ?
  `;
  db.query(countSql, [restaurant_id], (countErr, countRes) => {
    if (countErr) {
      console.log("11111")
      return res.send(result.fail(countErr));
    }
    const total = countRes[0].total;
    const totalPages = Math.ceil(total / limit);
    // 执行查询订单列表的 SQL
    db.query(sql, [restaurant_id, limit, offset], (err, rows) => {
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
//插入新评论
router.post("/remark/add",(req,resp)=>{
    console.log("成功进入---1111-----新增remark")
    
    const {remark_id,username,restaurant_id,remark}=req.body
    console.log(req.body)
    let sql= `
    INSERT INTO \`remark\` VALUES (?,?,?,NOW(),?)
  `;
//     let sql = `
// INSERT 
// INTO `order`(order.user_id,order.restaurant_id,order.order_time,order.total_amount,order.order_status)
//   VALUES(?,?,NOW(),?,'已付款')
//     `
    //访问数据库，进行用户查询
    //err:执行时产生的错误消息(如果有)
    //res:执行时返回的数据库结果数据
    let params = [remark_id,username,restaurant_id,remark]
    db.query(sql,params,(err,res)=>{
        //表示访问数据库有错误
        //js中，变量非空即为真
        if(err){
          console.log("加入失败")
            resp.send(result.fail(err))
        }else{
//获取新增的id并赋值给order_id_new
          console.log("加入陈工")
          console.log(res)
            //如果没有错误信息，则表示访问成功
            resp.send(result.success(res))

        }
    })
})
//1找到最大id
router.get("/remark/findremarkmaxid",(req,resp)=>{
    console.log("成功进入-----find---orderorder")
    //定义查询用户表的sql语句
    let sql = `
SELECT MAX(remark_id) AS max_id FROM remark
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
//导出用户模块定义的路由
module.exports = router