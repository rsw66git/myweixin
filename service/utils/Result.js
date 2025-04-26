// 定义Result结果封装类
class Result{
    //返回成功结果对象的方法
    static success(data){
        //结果对象
        return {
            //返回结果编码
            code:0,
            //返回结果消息
            msg:"成功",
            //返回结果数据
            data:data
        }
    }
    //返回失败结果对象的方法
    static fail(data){
        return {
             //返回结果编码aa
             code:1,
             //返回结果消息
             msg:"失败",
             //返回结果数据
             data:data
        }
    }
}

//导出result类
module.exports=Result