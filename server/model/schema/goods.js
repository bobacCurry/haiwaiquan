const mongoose = require('../db.js')

const Schema = mongoose.Schema

const GoodsSchema = new Schema({

	shopid: { type: String, required: true, index: true },

	classid: { type: Array, default: [] },

	code: { type: String, default: '' },

	name: { type: String, required: true },

	pics: { type: String, default: '' },

	price: { type: Number, default: 0 },

	count: { type: Number, default: 1 },

	unit: { type: Number, default: 0 },

	tags: { type: Array, default: [] },
	// unavaliable
	stop: { type: Boolean, default: false },

	sort: { type: Number, default: 0 }
},
{
	versionKey: false 
})

module.exports = mongoose.model('goods', GoodsSchema,'goods')