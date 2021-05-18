const mongoose = require('../db.js')

const Schema = mongoose.Schema

const FollowSchema = new Schema({

	uid: { type: String, required: true, index: true },

	sid: { type: String, required: true, index: true },
},
{
	versionKey: false 
})

module.exports = mongoose.model('follow', FollowSchema,'follow')