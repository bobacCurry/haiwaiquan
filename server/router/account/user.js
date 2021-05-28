const express = require('express')

const router = express.Router()

const user = require('../../controller/account/user.js')

const jwt = require('../../middleware/check_token')

router.get('/get_captcha', user.get_captcha)

router.post('/register', user.register)

router.post('/login', user.login)

router.get('/get_user', jwt.decode, user.get_user)

router.post('/update_user', jwt.decode, user.update_user)

module.exports = router