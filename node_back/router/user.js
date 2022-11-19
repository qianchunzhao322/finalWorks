const express = require('express')
const router = express.Router()

const handler = require('../router_handler/user')

// 导入数据验证的中间件
const expressjoi = require('@escook/express-joi')
const {reg_login_schema} = require('../schema/user') // 解构赋值


// 登录用户
router.post('/login', expressjoi(reg_login_schema), handler.login)
// 注册新用户
router.post('/reg', expressjoi(reg_login_schema), handler.reg)


module.exports = router