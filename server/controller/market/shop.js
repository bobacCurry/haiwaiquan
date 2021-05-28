const db_shop = require('../../model/schema/shop.js')

const db_user = require('../../model/schema/user.js')

const db_class = require('../../model/schema/class.js')

const db_goods = require('../../model/schema/goods.js')

const md5 = require('md5')

module.exports = {

	get_shop: async (req, res, next) => {

		try{

			const data = await db_shop.find({ uid: req.uid })

			return res.send({ success: true, data, message: '' })

		}catch(err){

			return next(new Error(err))
		}
	},
	add_shop: async (req, res, next) => {

		const { type, name, logo, back, pics, brief, stime, etime, payment, delivery, minprice, currency, city, address, notice, discount, phone, wechat, telegram } = req.body

		if (!type||!name||!logo||!stime||!etime||!payment.length||!delivery.length||!city||!address) {

			return res.send({ success: false, message: '基本信息不完整' })
		}

		if(!telegram.trim()){

			return res.send({ success: false, message: 'Telegram不得为空' })
		}

		try{

			const count = await db_shop.countDocuments({ uid: req.uid })

			if (count>=3) {

				return res.send({ success: false, message: '每个用户最多可创建3个店铺' })
			}

			const data = await db_shop.create({ uid: req.uid, type, name, logo, back, pics, brief, stime, etime, payment, delivery, minprice, currency, city, address, notice, discount, phone, wechat, telegram })

			return res.send({ success: true, data, message: '添加成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	update_shop: async (req, res, next) => {

		const { _id, type, name, logo, back, pics, brief, stime, etime, payment, delivery, minprice, currency, city, address, notice, discount, phone, wechat, telegram } = req.body

		if (!_id||!_id.trim()||!type||!name||!logo||!stime||!etime||!payment.length||!delivery.length||!city||!address) {

			return res.send({ success: false, message: '基本信息不完整' })
		}

		if(!telegram.trim()){

			return res.send({ success: false, message: 'Telegram不得为空' })
		}

		try{

			const data = await db_shop.updateOne({ _id, uid: req.uid }, { type, name, logo, back, pics, brief, stime, etime, payment, delivery, minprice, currency, city, address, notice, discount, phone, wechat, telegram })

			return res.send({ success: true, data, message: '更新成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	del_shop: async (req, res, next) => {

		const { _id, password } = req.body

		const uid = req.uid

		try{

			const user = await db_user.findOne({ _id: uid, password: md5(password.trim()) })

			if (!user) {

				return res.send({ success: false, message: '登录密码错误' })
			}

			const shop = await db_shop.findOne({ _id, uid })

			if (!shop) {

				return res.send({ success: false, message: '店铺不存在' })
			}

			await db_shop.deleteOne({ _id })

			await db_class.deleteMany({ shopid: _id })

			await db_goods.deleteMany({ shopid: _id })

			return res.send({ success: true, message: '删除成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	set_open: async (req, res, next) => {

		const { _id, open } = req.body

		const uid = req.uid

		try{

			await db_shop.updateOne({ _id, uid: req.uid }, { open })

			return res.send({ success: true, message: '更新成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	set_running: async (req, res, next) => {

		const { _id, running } = req.body

		const uid = req.uid

		try{

			await db_shop.updateOne({ _id, uid: req.uid }, { running })

			return res.send({ success: true, message: '更新成功' })

		}catch(err){

			return next(new Error(err))
		}

	},
	get_class: async (req, res, next) => {

		const { shopid } = req.body

		try{

			const data = await db_class.find({ shopid }).sort({ sort: -1 })

			return res.send({ success: true, data, message: '' })

		}catch(err){

			return next(new Error(err))
		}
	},
	add_class: async (req, res, next) => {

		const { shopid, name, sort } = req.body

		const uid = req.uid

		if (!name||!name.trim()) {

			return res.send({ success: false, message: '分类名称不得为空' })
		}

		try{

			const shop = await db_shop.findOne({ _id: shopid, uid })

			if (!shop) {

				return res.send({ success: false, message: '店铺不存在' })
			}

			const data = await db_class.create({ shopid, name, sort })

			return res.send({ success: true, message: '添加成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	del_class: async (req, res, next) => {

		const { _id, shopid } = req.body

		const uid = req.uid

		try{

			const shop = await db_shop.findOne({ _id: shopid, uid })

			if (!shop) {

				return res.send({ success: false, message: '店铺不存在' })
			}

			await db_class.deleteOne({ _id, shopid })

			await db_goods.updateMany({ shopid, classid: _id },{ $pull: { classid: _id } })

			return res.send({ success: true, message: '删除成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	update_class:  async (req, res, next) => {
		
		const { shopid, _id, name, sort } = req.body

		const uid = req.uid

		if (!name||!name.trim()) {

			return res.send({ success: false, message: '分类名称不得为空' })
		}

		try{

			const shop = await db_shop.findOne({ _id: shopid, uid })

			if (!shop) {

				return res.send({ success: false, message: '店铺不存在' })
			}

			const data = await db_class.updateOne({ _id, shopid }, { name, sort })

			return res.send({ success: true, message: '更新成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	get_goods: async (req, res, next) => {

		const { shopid, page, rows } = req.body

		if (!page) {

			return res.send({ success: false, message: '请输入页码' })
		}

		const skip = (page-1)*rows

		try{

			const items = await db_goods.find({ shopid }).limit(rows).skip(skip).sort({ sort: -1 })

			const total = await db_goods.countDocuments({ shopid })

			const data = { items, total }

			return res.send({ success: true, data, message: '' })

		}catch(err){

			return next(new Error(err))
		}
	},
	add_goods: async (req, res, next) => {

		const { shopid, classid, code, name, pics, price, count, unit, tags, sort } = req.body

		const uid = req.uid

		if (!name||!name.trim()) {

			return res.send({ success: false, message: '商品名称不得为空' })
		}

		if (!code||!code.trim()) {

			return res.send({ success: false, message: '商品代码不得为空' })
		}

		if (!pics||!pics.trim()) {

			return res.send({ success: false, message: '商品图片不得为空' })
		}

		if (!price||!price.trim()) {

			return res.send({ success: false, message: '商品价格不得为空' })
		}

		if (!count||!count.trim()) {

			return res.send({ success: false, message: '商品计价数量不得为空' })
		}

		if (!classid||!classid.length) {

			return res.send({ success: false, message: '商品分类至少一个' })
		}

		try{

			const shop = await db_shop.findOne({ _id: shopid, uid })

			if (!shop) {

				return res.send({ success: false, message: '店铺不存在' })
			}

			const data = await db_goods.create({ shopid, classid, code, name, pics, price, count, unit, tags, sort })

			return res.send({ success: true, message: '添加成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	del_goods: async (req, res, next) => {

		const { _id } = req.body

		const uid = req.uid

		try{

			const goods = await db_goods.findOne({ _id })

			const shop = await db_shop.findOne({ _id: goods.shopid, uid })

			if (!shop) {

				return res.send({ success: false, message: '店铺不存在' })
			}

			const data = await db_goods.deleteOne({ _id })

			return res.send({ success: true, message: '删除成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	update_goods: async (req, res, next) => {

		const { _id, shopid, classid, code, name, pics, price, count, unit, tags, sort } = req.body

		const uid = req.uid

		if (!_id) {

			return res.send({ success: false, message: '商品id不得为空' })
		}

		if (!name||!name.trim()) {

			return res.send({ success: false, message: '商品名称不得为空' })
		}

		if (!code||!code.trim()) {

			return res.send({ success: false, message: '商品代码不得为空' })
		}

		if (!pics||!pics.trim()) {

			return res.send({ success: false, message: '商品图片不得为空' })
		}

		if (!price||!price.trim()) {

			return res.send({ success: false, message: '商品价格不得为空' })
		}

		if (!count||!count.trim()) {

			return res.send({ success: false, message: '商品计价数量不得为空' })
		}

		if (!classid||!classid.length) {

			return res.send({ success: false, message: '商品分类至少一个' })
		}

		try{

			const shop = await db_shop.findOne({ _id: shopid, uid })

			if (!shop) {

				return res.send({ success: false, message: '店铺不存在' })
			}

			const data = await db_goods.updateOne({ shopid, _id },{ classid, code, name, pics, price, count, unit, tags, sort })

			return res.send({ success: true, message: '添加成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	stop_goods: async (req, res, next) => {

		const { _id, shopid, stop } = req.body

		const uid = req.uid

		try{

			const shop = await db_shop.findOne({ _id: shopid, uid })

			if (!shop) {

				return res.send({ success: false, message: '店铺不存在' })
			}

			const data = await db_goods.updateOne({ shopid, _id },{ stop })

			return res.send({ success: true, message: '更新成功' })

		}catch(err){

			return next(new Error(err))
		}
	}
}