const express = require('express')
const app = express()
const cors = require('cors')
const joi = require('joi')

app.use(cors())
app.use(express.urlencoded({extended: false}))

// 全局中间件
app.use((req,res,next) => {
  res.cc = (err, status) => {
    res.send({
      status: status,
      message: err instanceof Error ? err.message : err// 是否是Error的对象
    })
  }
  next()
})

// 解析token
const config = require('./config')
const expressJWT = require('express-jwt')
app.use(expressJWT({secret: config.jwtSecretKey}).unless({path: [/^\/api/]}))

const userRouter = require('./router/user')
app.use('/api', userRouter)

app.use((err,req,res,next) => {
  if(err instanceof joi.ValidationError) return res.cc(err,1)
  if(err.name === 'UnauthorizedError') return res.cc('身份认证失败', 1)
  res.cc(err,1)
})

app.listen(8888, ()=>{
  console.log(
    '                   _oo0oo_                     \n' +
      '                  o8888888o                    \n' +
      '                  88" . "88                    \n' +
      '                  (| -_- |)                    \n' +
      '                   O\\ = /O                    \n' +
      "               ____/`---'\\____                  \n" +
      "             .   ' \\\\| |// `.                  \n" +
      '              / \\\\||| : |||// \\                \n' +
      '           / _||||| -卍- |||||- \\                \n' +
      '              | | \\\\\\ - /// | |                \n' +
      "            | \\_| ''\\---/'' | |                \n" +
      '             \\ .-\\__ `-` ___/-. /              \n' +
      "          ___`. .' /--.--\\ `. . __              \n" +
      '       ."" "< `.___\\_<|>_/___. ` >" "".        \n' +
      '      | | : `- \\`.;`\\ _ /`;.`/ - ` : | |       \n' +
      '        \\ \\ `-. \\_ __\\ /__ _/ .-` / /          \n' +
      "======`-.____`-.___\\_____/___.-`____.-'======  \n" +
      "                   `=---='                     \n" +
      '.............................................  \n\t' +
      '佛祖镇楼              永无BUG                          \n\t' +
      '\n\n'
  )

  console.log('Api server is running at http://127.0.0.1:8888');
})
