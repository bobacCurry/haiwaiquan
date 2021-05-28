const express = require('express')

const router = express.Router()

const info = require('../../controller/account/info.js')

const jwt = require('../../middleware/check_token')

router.get('/get_list', jwt.decode, info.get_list)

router.post('/add_info', jwt.decode, info.add_info)

router.post('/del_info', jwt.decode, info.del_info)

router.post('/update_info', jwt.decode, info.update_info)

router.post('/set_default', jwt.decode, info.set_default)

module.exports = router