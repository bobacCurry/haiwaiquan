const mongoose = require('../db.js')

const Schema = mongoose.Schema

const ReviewSchema = new Schema({

	user: { type: Schema.Types.ObjectId, ref: 'user', required: true },

	shopid: { type: String, required: true, index: true },

	orderid: { type: String, required: true },

	ownerid: { type: String, required: true },

	rate: { type: Number, default: 5 },

	text: { type: String, default: '' },

	pics: { type: Array, default: [] },

	reply: { type: String, default: '' },

	show:  { type: Boolean, default: true }
},
{ 
	versionKey: false, timestamps: { createdAt:'created_at', updatedAt:'updated_at' }
})

module.exports = mongoose.model('review', ReviewSchema,'review')