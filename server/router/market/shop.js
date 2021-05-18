const express = require('express')

const router = express.Router()

const shop = require('../../controller/market/shop')

const jwt = require('../../middleware/check_token')

router.get('/get_shop', jwt.decode, shop.get_shop)

router.post('/add_shop', jwt.decode, shop.add_shop)

router.post('/del_shop', jwt.decode, shop.del_shop)

router.post('/update_shop', jwt.decode, shop.update_shop)

router.post('/get_class', jwt.decode, shop.get_class)

router.post('/add_class', jwt.decode, shop.add_class)

router.post('/del_class', jwt.decode, shop.del_class)

router.post('/update_class', jwt.decode, shop.update_class)

router.post('/get_goods', jwt.decode, shop.get_goods)

router.post('/add_goods', jwt.decode, shop.add_goods)

router.post('/del_goods', jwt.decode, shop.del_goods)

router.post('/update_goods', jwt.decode, shop.update_goods)

router.post('/stop_goods', jwt.decode, shop.stop_goods)

module.exports = router