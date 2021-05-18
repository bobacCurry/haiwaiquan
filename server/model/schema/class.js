const mongoose = require('../db.js')

const Schema = mongoose.Schema

const ClassSchema = new Schema({

	shopid: { type: String, required: true, index: true },

	name: { type: String, required: true },

	sort: { type: Number, default: 0 }
},
{
	versionKey: false 
})

module.exports = mongoose.model('class', ClassSchema,'class')