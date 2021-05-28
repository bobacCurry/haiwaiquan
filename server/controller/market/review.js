const db_shop = require('../../model/schema/shop.js')

const db_order = require('../../model/schema/order.js')

const db_review = require('../../model/schema/review.js')

module.exports = {

	new_review: async (req, res, next) => {

		const { orderid, rate, text, pics } = req.body

		const uid = req.uid

		if (!text||!text.trim()) {

			return res.send({ success: false, message: '评论内容不能为空' })
		}

		try{

			const order = await db_order.findOne({ _id: orderid, uid, comment: false, status: 4 })

			if (!order) {

				return res.send({ success: false, message: '未完成订单不能进行评论' })
			}

			const shop = await db_shop.findById(order.shop)

			if (!shop) {

				return res.send({ success: false, message: '店铺已经被下架' })
			}

			await db_review.create({ user: uid, shopid: shop._id, orderid, ownerid: shop.uid, rate, text, pics })

			const shop_rate = ( 0.9*shop.rate + 0.1*rate ).toFixed(2)

			await db_shop.findByIdAndUpdate(shop._id, { rate: shop_rate })

			await db_order.findByIdAndUpdate(orderid, { comment: true })

			return res.send({ success: true, message: '评价提交成功' })

		}catch(err){

			return next(new Error(err))
		}


		return res.send({ success: true, message: '提交评论成功' })
	},
	get_review: async (req, res, next) => {

		const { page, rows, shopid } = req.body

		const limit = rows

		const skip = (page-1)*limit

		try{

			const data = await db_review.find({ shopid, show: true }, { updated_at: 0, orderid: 0 }).populate('user','name avatar').sort({ created_at: -1 }).limit(limit).skip(skip)

			return res.send({ success: true, data, message: '' })

		}catch(err){

			return next(new Error(err))
		}
	},
	del_review: async (req, res, next) => {

		const { _id } = req.body

		const uid = req.uid

		try{

			await db_review.updateOne({ _id, user: uid }, { show: false })

			return res.send({ success: true, message: '删除评价成功' })

		}catch(err){

			return next(new Error(err))
		}

	},
	reply_review: async (req, res, next) => {

		const { _id, text } = req.body

		const uid = req.uid

		if (!text||!text.trim()) {

			return res.send({ success: false, message: '回复内容不能为空' })	
		}

		try{

			await db_review.updateOne({ _id, ownerid: uid }, { reply: text })

			return res.send({ success: true, message: '回复评价成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	del_reply: async (req, res, next) => {

		const { _id } = req.body

		const uid = req.uid

		try{

			await db_review.updateOne({ _id, ownerid: uid }, { reply: '' })

			return res.send({ success: true, message: '删除回复成功' })

		}catch(err){

			return next(new Error(err))
		}
	}
}