const db_uinfo = require('../../model/schema/uinfo.js')

module.exports = {

	get_list: async (req, res, next) => {

		try{

			const data = await db_uinfo.find({ uid: req.uid })

			res.send({ success: true, data, message: '' })

		}catch(err){

			return next(new Error(err))
		}
	},
	add_info: async (req, res, next) => {

		const { name, phone, wechat, telegram, address } = req.body

		if ((!phone||!phone.trim())&&(!wechat||!wechat.trim())&&(!telegram||!telegram.trim())) {

			return res.send({ success: false, message: '请任意填写一种联系方式' })
		}

		if (!name||!address||!name.trim()||!address.trim()) {

			return res.send({ success: false, message: '称呼或地址信息不完整' })
		}

		try{

			const count = await db_uinfo.countDocuments({ uid: req.uid })

			if (count>=6) {

				return res.send({ success: false, message: '地址最多可创建6个' })
			}

			let _default = !count ? true : false

			await db_uinfo.create({ uid: req.uid, name, phone, wechat, telegram, address, default: _default })
		
			return res.send({ success: true, message: '创建成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	del_info: async (req, res, next) => {

		const { _id } = req.body

		try{

			await db_uinfo.deleteOne({ _id, uid: req.uid })

			return res.send({ success: true, message: '删除成功' })

		}catch(err){

			return next(new Error(err))	
		}
	},
	update_info: async (req, res, next) => {

		const { _id, name, phone, wechat, telegram, address } = req.body

		try{

			await db_uinfo.updateOne({ _id, uid: req.uid }, { name, phone, wechat, telegram, address })

			return res.send({ success: true, message: '更新成功' })

		}catch(err){

			return next(new Error(err))	
		}
	},
	set_default: async (req, res, next) => {

		const { _id } = req.body

		try{

			await db_uinfo.updateMany({ uid: req.uid }, { default: false })

			await db_uinfo.updateOne({ _id, uid: req.uid }, { default: true })

			return res.send({ success: true, message: '更新成功' })

		}catch(err){

			return next(new Error(err))	
		}
	},
}