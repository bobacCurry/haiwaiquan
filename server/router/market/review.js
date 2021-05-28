const express = require('express')

const router = express.Router()

const jwt = require('../../middleware/check_token')

const review = require('../../controller/market/review')

router.post('/new_review', jwt.decode, review.new_review)

router.post('/get_review', review.get_review)

router.post('/del_review', jwt.decode, review.del_review)

router.post('/reply_review', jwt.decode, review.reply_review)

router.post('/del_reply', jwt.decode, review.del_reply)

module.exports = router