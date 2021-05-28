const db_user = require('../../model/schema/user.js')

const db_shop = require('../../model/schema/shop.js')

const db_follow = require('../../model/schema/follow.js')

module.exports = {

	isfollow: async (req, res, next) => {

		const { shopid } = req.body

		const uid = req.uid

		try{

			const follow = await db_follow.findOne({ user: uid, shop: shopid },'_id')

			const data = follow? true: false

			return res.send({ success: true, data, message: '' })

		}catch(err){

			return next(new Error(err))
		}
	},
	follow: async (req, res, next) => {

		const { shopid } = req.body

		const uid = req.uid

		try{

			const shop = await db_shop.findById(shopid,'_id')

			if (!shop) {

				return res.send({ success: false, message: '店铺不存在' })
			}

			const follow = await db_follow.findOne({ user: uid, shop: shopid },'_id')

			if (follow) {

				return res.send({ success: false, message: '已经关注了该店铺' })
			}

			await db_follow.create({ user: uid, shop: shopid })

			return res.send({ success: true, message: '关注成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	unfollow: async (req, res, next) => {

		const { shopid } = req.body

		const uid = req.uid

		try{

			await db_follow.deleteOne({ shop: shopid, user: uid })

			return res.send({ success: true, message: '取消关注' })

		}catch(err){

			return next(new Error(err))
		}
	},
	user_follow: async (req, res, next) => {

		const uid = req.uid

		try{

			const data = await db_follow.find({ user: uid }).populate('shop','name logo type')

			return res.send({ success: true, data, message: '' })

		}catch(err){

			return next(new Error(err))
		}
	},
	shop_follow: async (req, res, next) => {

		const { shopid, page, rows } = req.body

		const uid = req.uid

		const limit = rows

		const skip = (page-1)*limit

		try{

			const shop = await db_shop.findOne({ _id: shopid, uid })

			if (!shop) {

				return res.send({ success: false, message: '非店主不可获取信息' })
			}

			const items = await db_follow.find({ shop: shopid }).populate('user','name avatar').limit(limit).skip(skip)

			const total = await db_follow.countDocuments({ shop: shopid })

			const data = { items, total }

			return res.send({ success: true, data, message: '' })

		}catch(err){

			return next(new Error(err))
		}
	}
}