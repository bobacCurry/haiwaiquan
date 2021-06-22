const db_shop = require('../../model/schema/shop.js')

const db_order = require('../../model/schema/order.js')

module.exports = {

	new_order: async (req, res, next) => {

		const { shopid, items, total, currency, uinfo, payment, delivery, memo } =  req.body

		const uid = req.uid

		if (!total) {

			return res.send({ success: false, message: '点单费用不合法' })
		}

		if (!uinfo) {

			return res.send({ success: false, message: '请选择您的收货地址' })
		}

		let total_check = 0

		for (var i = items.length - 1; i >= 0; i--) {

			total_check += items[i].amount
		}

		if (total_check!==total) {

			return res.send({ success: false, message: '价格计算有误，请确认' })
		}

		try{

			const shop = await db_shop.findOne({ _id: shopid, pass: true, running: true, open: true })

			if (!shop) {

				return res.send({ success: false, message: '店铺不存在或已停止营业' })
			}

			const exist = await db_order.findOne({ uid, shop: shopid, status: { $in: [ 0, 1 ] }},'_id')

			if (exist) {

				return res.send({ success: false, message: '存在正在处理中的订单' })
			}

			await db_order.create({ uid, shop: shopid, items, total, currency, uinfo, payment, delivery, memo })

			return res.send({ success: true, message: '订单创建成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	get_order: async (req, res, next) => {

	},
	get_user_order: async (req, res, next) => {

		const { status, page, rows } =  req.body

		const uid = req.uid

		const limit = rows

		const skip = (page-1)*limit

		let query = { uid, status: { $in: status } }

		if (!status.length) {

			query = { uid }
		}

		try{

			const items = await db_order.find(query).populate('shop','name logo phone wechat telegram').sort({ created_at: -1 }).limit(limit).skip(skip)

			const total = await db_order.find(query).countDocuments()

			const data = { items, total }

			return res.send({ success: true, data, message: '获取订单成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	get_shop_order: async (req, res, next) => {

		const { shop, status, page, rows } =  req.body

		const uid = req.uid

		const limit = rows

		const skip = (page-1)*limit

		let query = { shop, status: { $in: status } }

		if (!status.length) {

			query = { shop }
		}

		try{

			const usershop = await db_shop.findOne({ _id: shop, uid })

			if (!usershop) {

				return res.send({ success: true, data: [], message: '用户商家不存在' })
			}

			const items = await db_order.find(query).populate('shop','name logo phone wechat telegram').sort({ created_at: -1 }).limit(limit).skip(skip)

			const total = await db_order.find(query).countDocuments()

			return res.send({ success: true, data:{ items, total }, message: '获取订单成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	cancel_order_user: async (req, res, next) => {

		const { _id } =  req.body

		const uid = req.uid

		try{

			const order = await db_order.findOne({ _id, uid, status: 0 }, '_id')

			if (!order) {

				return res.send({ success: false, message: '该订单不能操作取消，请联系店主' })
			}

			await db_order.findByIdAndUpdate(_id, { status: 5 })

			return res.send({ success: true, message: '订单已取消' })

		}catch(err){

			return next(new Error(err))
		}
	},
	cancel_order_shop: async (req, res, next) => {
		
		const { _id } =  req.body

		const uid = req.uid

		try{

			const order = await db_order.findOne({ _id, status: { $in: [ 0, 1 ] }})

			if (!order) {

				return res.send({ success: false, message: '该订单不能操作取消' })
			}

			const shop = await db_shop.findOne({ _id: order.shop, uid })

			if (!shop) {

				return res.send({ success: false, message: '只有店主才能操作该订单' })
			}

			await db_order.findByIdAndUpdate(_id, { status: 6 })

			return res.send({ success: true, message: '订单已取消' })

		}catch(err){

			return next(new Error(err))
		}
	},
	confirm_order: async (req, res, next) => {
		
		const { _id, delivery } =  req.body

		const uid = req.uid

		try{

			const order = await db_order.findOne({ _id, status: 0 })

			if (!order) {

				return res.send({ success: false, message: '该订单不能操作确认' })
			}

			const shop = await db_shop.findOne({ _id: order.shop, uid })

			if (!shop) {

				return res.send({ success: false, message: '只有店主才能操作该订单' })
			}

			await db_order.findByIdAndUpdate(_id, { status: 1, delivery })

			return res.send({ success: true, message: '订单已确认' })

		}catch(err){

			return next(new Error(err))
		}
	},
	delivery: async (req, res, next) => {
		
		const { _id } =  req.body

		const uid = req.uid

		try{

			const order = await db_order.findOne({ _id, status: 1 })

			if (!order) {

				return res.send({ success: false, message: '该订单不能操作配送' })
			}

			const shop = await db_shop.findOne({ _id: order.shop, uid })

			if (!shop) {

				return res.send({ success: false, message: '只有店主才能操作该订单' })
			}

			await db_order.findByIdAndUpdate(_id, { status: 2 })

			return res.send({ success: true, message: '订单已操作配送' })

		}catch(err){

			return next(new Error(err))
		}
	},
	arrived: async (req, res, next) => {
		
		const { _id } =  req.body

		const uid = req.uid

		try{

			const order = await db_order.findOne({ _id, status: 2 })

			if (!order) {

				return res.send({ success: false, message: '该订单不能操作送到' })
			}

			const shop = await db_shop.findOne({ _id: order.shop, uid })

			if (!shop) {

				return res.send({ success: false, message: '只有店主才能操作该订单' })
			}

			await db_order.findByIdAndUpdate(_id, { status: 3 })

			return res.send({ success: true, message: '订单已操作送到' })

		}catch(err){

			return next(new Error(err))
		}
	},
	finish_order: async (req, res, next) => {
		
		const { _id } =  req.body

		const uid = req.uid

		try{

			const order = await db_order.findOne({ _id, uid, status: { $in: [ 1, 2, 3 ] } }, '_id')

			if (!order) {

				return res.send({ success: false, message: '该订单不能操作完成' })
			}

			await db_order.findByIdAndUpdate(_id, { status: 4 })

			return res.send({ success: true, message: '订单已完成' })


		}catch(err){

			return next(new Error(err))
		}
	},
	unfinished_count: async (req, res, next) => {

		const { shopid } =  req.body

		const uid = req.uid

		try{

			const shop = await db_shop.findOne({ _id: shopid, uid }, '_id')

			if (!shop) {

				return res.send({ success: false, message: '只有店主才能操作该订单' })
			}

			const data = await db_order.countDocuments({ shop: shopid, status: { $in: [ 0, 1, 2 ] } })

			return res.send({ success: true, data })

		}catch(err){

			return next(new Error(err))
		}
	}
}