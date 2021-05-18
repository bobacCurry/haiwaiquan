const mongoose = require('../db.js')

const Schema = mongoose.Schema

const ShopSchema = new Schema({

	uid: { type: String, required: true },

	type: { type: Number, default: 0 },
	//商家标签
	tags: { type: Array, default: [] },

	name: { type: String, required: true, unique: true },

	logo: { type: String, required: true },

	back: { type: String, default: '/img/shop/shopback.png' },

	pics: { type: Array, default: [] },

	brief: { type: String, default: '' },
	//评分
	rate: { type: Number, default: 5 },
	//开始营业
	stime: { type: String, required: true },
	//结束营业
	etime: { type: String, required: true },
	//支付方式
	payment: { type: Array, default: [] },
	//配送方式
	delivery: { type: Array, default: [] },
	// 最低起送价
	minprice: { type: Number, default: 0 },

	currency: { type: Number, default: 0 },

	city: { type: String, required: true },

	address: { type: String, required: true },

	notice: { type: String, default: '' },

	discount: { type: String, default: '' },

	phone: { type: String, required: true },

	wechat: { type: String, default: '' },

	telegram: { type: String, required: true },

	follow: { type: Number, default: 0 },

	view: { type: Number, default: 0 },

	sort: { type: Number, default: 0 },

	pass: { type: Boolean, default: false },
	// 是否上架
	running: { type: Boolean, default: false },
	// 是否营业
	open: { type: Boolean, default: false },

	created_at: { type: Date },

  	updated_at: { type: Date }
},
{

	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('shop', ShopSchema,'shop')