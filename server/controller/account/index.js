const md5 = require('md5')

const db_user = require('../../model/schema/user.js')

const jwt = require('../../middleware/check_token')

module.exports = {

	register: async (req, res, next) => {

		const data = req.body

		if (!data || !data.account || !data.name || !data.password || !data.account.trim() || !data.name.trim() || !data.password.trim()) {
      
	      	return res.send({ code: 0, msg: '注册信息不完整' })
	    }

	    const { account, name, password, job }  =  data

	    try{

	      	await db_user.create({ account, name, job, password: md5(data.password.trim()) })

	      	res.send({ success: true, msg: '创建成功' })

	    }catch(err){

	      	return next(new Error(err))
	    }
	},
	login: async (req, res, next) => {

		const { account, password } = req.body

		if (!account||!password) {

			return res.send({ success: false, msg: '登陆信息不完整' })
		}

		try{
			
			const user = await db_user.findOne({ account, password: md5(password.trim()) },'name avatar access money')

			if (!user) {

				return res.status(401).send({ success:false, msg:"登陆密码错误" })
			}

			return res.send({ success: true, msg: '登陆成功', token: jwt.encode({ _id:user._id,name:user.name,avatar:user.avatar,access:user.access }) })

		}catch(err){

			return next(new Error(err))
		}
	},
	get_info: async (req, res, next) => {

		const uid = req.user._id

		try{

	      	const user = await db_user.findById(uid,'_id name money avatar access')

	      	return res.send({ success: true, msg: user })

	    }catch(err){

	      	return next(new Error(err))
	    }
	}
}