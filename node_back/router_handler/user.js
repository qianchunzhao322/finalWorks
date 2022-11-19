const db = require('../db/index')
const bcrypt = require('bcryptjs')
const token = require('jsonwebtoken')
const config = require('../config')

exports.reg = (req,res)=>{
  const userinfo = req.body
  console.log(userinfo);
  // 检测用户名和密码是否为空
  // if (!userinfo.username||!userinfo.password) {
  //   return res.cc('用户名或密码不合法',1)
  // }
  // 检测用户是否占用
  const sql1 = 'select * from ev_users where username=?'
  db.query(sql1, userinfo.username, (err, results) => {
    if (err) {
      return res.cc(err.message,1)
    }
    // 占用了
    if(results.length > 0){
      return res.cc('用户名已占用',1)
    }else{
      // 用户密码加密存储 -- 采用bcryptjs进行加密
      // 调用bcrypt.hashSync()
      userinfo.password = bcrypt.hashSync(userinfo.password, 10)
      // 插入用户
      const sql2 = 'insert into ev_users set?'
      db.query(sql2, {username:userinfo.username, password:userinfo.password}, (err,results) => {
        if (err) {
          return res.cc(err.message,1)
        }
        if(results.affectedRows !== 1){
          return res.cc('注册用户失败',1)
        }
        return res.cc('注册用户成功',0)
      })
    }
  })
  
}

//!优化res.send()代码
//!手动封装一个函数，并且再全部路由之前生命一个全局中间件,为res挂载这个函数
//!永远不要相信前端传来的表单信息
//!采用表单数据验证模块 @hapi/joi 和 @escook/express-joi

exports.login = (req,res)=>{
  const userinfo = req.body
  const sql3 = 'select * from ev_users where username=?'
  db.query(sql3,userinfo.username,(err, results) => {
    if(err) return res.cc(err,1)
    if(results.length !== 1) return res.cc('登录失败',1)
    const result = bcrypt.compareSync(userinfo.password, results[0].password)
    // result? res.cc('登录成功',0): res.cc('登录失败',1)
    if(!result) return res.cc('登录失败d',1)

    const user = { ...results[0], password:'', user_pic: ''}
    // 用户信息加密
    const tokenStr ='Bearer ' + token.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn})
    res.send({
      status: 0,
      msg: '登陆成功',
      token: tokenStr
    })
  })
}