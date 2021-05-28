const mongoose = require('../db.js')

const Schema = mongoose.Schema

const FollowSchema = new Schema({

	user: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },

	shop: { type: Schema.Types.ObjectId, ref: 'shop', required: true, index: true }
},
{
	versionKey: false 
})

module.exports = mongoose.model('follow', FollowSchema,'follow')