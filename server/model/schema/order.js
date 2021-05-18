const mongoose = require('../db.js')

const Schema = mongoose.Schema

const OrderSchema = new Schema({

	uid: { type: String, required: true },

	shopid: { type: String, required: true },

	items: { type: Object, default: {} },

	total: { type: Number, default: 0 },

	uinfo: { type: Object, default: {} },

	payment: { type: Number, default: 0 },

	delivery: { type: Number, default: 0 },

	memo: { type: String, default: '' },

	status: { type: Number, default: 0 }
},
{
	versionKey: false 
})

module.exports = mongoose.model('order', OrderSchema,'order')