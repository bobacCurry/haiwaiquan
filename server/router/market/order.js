const express = require('express')

const router = express.Router()

const jwt = require('../../middleware/check_token')

const order = require('../../controller/market/order')

router.post('/new_order', jwt.decode, order.new_order)

router.post('/new_order_agency', order.new_order_agency)

router.post('/get_user_order', jwt.decode, order.get_user_order)

router.post('/get_shop_order', jwt.decode, order.get_shop_order)

router.post('/cancel_order_user', jwt.decode, order.cancel_order_user)

router.post('/cancel_order_shop', jwt.decode, order.cancel_order_shop)

router.post('/confirm_order', jwt.decode, order.confirm_order)

router.post('/delivery', jwt.decode, order.delivery)

router.post('/arrived', jwt.decode, order.arrived)

router.post('/finish_order', jwt.decode, order.finish_order)

router.post('/unfinished_count', jwt.decode, order.unfinished_count)

router.post('/get_order', jwt.decode, order.get_order)

module.exports = router