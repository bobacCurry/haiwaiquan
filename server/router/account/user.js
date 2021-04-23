const express = require('express')

const router = express.Router()

const account = require('../../controller/account/index.js')

const jwt = require('../../middleware/check_token')

router.post('/register', jwt.decode, account.register)

router.post('/login', account.login)

router.get('/get_info', jwt.decode, account.get_info)

module.exports = router