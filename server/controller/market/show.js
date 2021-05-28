const db_shop = require('../../model/schema/shop.js')

const db_user = require('../../model/schema/user.js')

const db_class = require('../../model/schema/class.js')

const db_goods = require('../../model/schema/goods.js')

module.exports = {

	get_shops: async (req, res, next) => {
		
		const { page, rows, keywords } = req.body

		try{

			const skip = (page-1)*rows

			let query = { pass: true, running: true }

			if (keywords.trim()) {

				query = { pass: true, running: true, $or: [ { name: new RegExp(keywords) }, { brief: new RegExp(keywords) } ] }
			}

			const data = await db_shop.find(query, '_id type tags name logo brief rate stime etime payment delivery minprice city open').sort({ sort: -1, rate: -1 }).skip(skip).limit(rows)
				
			return res.send({ success: true, data, message: '' })

		}catch(err){

			return next(new Error(err))
		}
	},
	get_type_shops: async (req, res, next) => {

		const { page, rows, type } = req.body

		try{

			const skip = (page-1)*rows

			const data = await db_shop.find({ pass: true, running: true, type }, '_id type tags name logo brief rate stime etime payment delivery minprice city open').sort({ sort: -1, rate: -1 }).skip(skip).limit(rows)
				
			return res.send({ success: true, data, message: '' })

		}catch(err){

			return next(new Error(err))
		}
	},
	get_shop: async (req, res, next) => {

		const { _id } = req.params

		const shop = await db_shop.findOne({ _id, pass: true, running: true }, { pass: false, running: false, created_at: false, updated_at: false, sort: false })

		if (!shop) {

			return res.send({ success: false, message: '商铺不存在' })
		}

		const classList = await db_class.find({ shopid: _id }, { sort: false }).sort({ sort: -1 })

		const goodsList = await db_goods.find({ shopid: _id }, { sort: false }).sort({ sort: -1 })

		const data = { shop, classList, goodsList }

		return res.send({ success: true, data, message: '' })
	}
}