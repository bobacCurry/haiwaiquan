const express = require('express')

const router = express.Router()

const upload = require('../../controller/common/upload')

const jwt = require('../../middleware/check_token')

router.post('/upload_img', jwt.decode, upload.upload_img)

module.exports = router