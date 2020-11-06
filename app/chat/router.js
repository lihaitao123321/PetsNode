var router = require('express').Router()
var getMessageHistory=require('./controller/getMessageHistory')
var getRecentChatters=require('./controller/getRecentChatters')
router.post('/getMessageHistory',getMessageHistory)
router.post('/getRecentChatters',getRecentChatters)
module.exports = router
