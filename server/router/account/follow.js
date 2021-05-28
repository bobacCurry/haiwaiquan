const express = require('express')

const router = express.Router()

const follow = require('../../controller/account/follow.js')

const jwt = require('../../middleware/check_token')

router.post('/isfollow', jwt.decode, follow.isfollow)

router.post('/follow', jwt.decode, follow.follow)

router.post('/unfollow', jwt.decode, follow.unfollow)

router.post('/user_follow', jwt.decode, follow.user_follow)

router.post('/shop_follow', jwt.decode, follow.shop_follow)

module.exports = router