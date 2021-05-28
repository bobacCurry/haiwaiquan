const mongoose = require('../db.js')

const Schema = mongoose.Schema

const OrderSchema = new Schema({

	uid: { type: String, required: true },

	shop: { type: Schema.Types.ObjectId, ref: 'shop' },

	items: { type: Array, default: [] },

	total: { type: Number, default: 0 },

	currency: { type: Number, default: 0 },

	uinfo: { type: String, required: true },

	payment: { type: Number, default: 0 },

	delivery: { type: Number, default: 0 },

	memo: { type: String, default: '' },

	comment: { type: Boolean, default: false },

	status: { type: Number, default: 0 }
},
{
	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }
})

module.exports = mongoose.model('order', OrderSchema,'order')