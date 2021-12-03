const mongoose = require('../db.js')

const Schema = mongoose.Schema

//初始化时，创建一个【代理下单用户】 access:['agency']  ！！！！

const UserSchema = new Schema({

	account: { type: String, required: true, unique: true },

	password: { type: String, required: true },

	name: { type: String, default:'圈友' },

	avatar: { type: String, default:'/img/avatar.png' },

	points: { type: Number, default:0 },

	access: { type: Array, default:[] },

	status: { type: Number, default:1 },

	created_at: { type: Date },

  	updated_at: { type: Date }
},
{

	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('user', UserSchema,'user')