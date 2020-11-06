var router = require('express').Router()
var login=require('./controller/login')
var register=require('./controller/register')
var getUserInfo=require('./controller/getUserInfo')
var setUserInfo=require('./controller/setUserInfo')

router.get('/login',login)
router.post('/register',register)
router.post('/getUserInfo',getUserInfo)
router.post('/setUserInfo',setUserInfo)
module.exports = router
