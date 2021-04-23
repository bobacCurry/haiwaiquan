const mongoose = require('../db.js')

const Schema = mongoose.Schema

const UserSchema = new Schema({

	id: { type: Number, required: true, unique: true },

	first_name: { type: String, default:'' },

	last_name: { type: String, default:'' },

	username: { type: String, default:'' },

	access: { type: Array, default:[] },

	status: { type: Number, default:1 },

	created_at: { type: Date },

  	updated_at: { type: Date }
},
{

	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('user', UserSchema,'user')