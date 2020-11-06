var router = require('express').Router()
let multer  = require('multer');
let upload = multer({dest: 'static/upload_tmp/'});
router.post('/upload', upload.any(), require('./upload'))
module.exports = router
