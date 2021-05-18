const mongoose = require('../db.js')

const Schema = mongoose.Schema

const UinfoSchema = new Schema({

	uid: { type: String, required: true },

	name: { type: String, required: true },

	phone: { type: String, default: '' },

	wechat: { type: String, default: '' },

	telegram: { type: String, default: '' },

	address: { type: String, required: true },

	default: { type: Boolean, default: false }
},
{
	versionKey: false 
})

module.exports = mongoose.model('uinfo', UinfoSchema,'uinfo')