const express = require('express')

const router = express.Router()

const show = require('../../controller/market/show')

router.post('/get_shops', show.get_shops)

router.post('/get_type_shops', show.get_type_shops)

router.post('/get_shop/:_id', show.get_shop)

module.exports = router