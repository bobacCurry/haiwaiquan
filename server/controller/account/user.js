const md5 = require('md5')

const svgCaptcha = require('svg-captcha');

const db_user = require('../../model/schema/user.js')

const jwt = require('../../middleware/check_token')

const cache = require('../../cache')

module.exports = {

	get_captcha: async (req, res, next) => {

		try{

			const captcha = svgCaptcha.create()

			const key = md5(Math.random())

			const text = captcha.text.toLowerCase()

			await cache.set(`${key}-${text}`,1)

			await cache.expire(`${key}-${text}`,120)

			res.send({ success: true, captcha: { data: captcha.data, key } })

		}catch(err){

	      	return next(new Error(err))
	    }
	},
	register: async (req, res, next) => {

		const { account, password, captcha, key } = req.body

		if (!account || !password ||  !captcha || !key || !account.trim() || !password.trim()) {
      
	      	return res.send({ success: false, message: '注册信息不完整' })
	    }

	    if(!await cache.get(`${key}-${captcha.toLowerCase()}`)){

	    	return res.send({ success: false, message: '验证码错误' })
	    }

	    if (password.length<6) {

	    	return res.send({ success: false, message: '密码最少为6个字符' })
	    }

	    try{

	    	const name = '圈友'+Math.ceil(Math.random()*1000)

	    	const exist = await db_user.findOne({ account })

	    	if (exist) {

	    		return res.send({ success: false, message: '该用户名已存在' })
	    	}

	      	await db_user.create({ account, password: md5(password.trim()), name })

	      	await cache.del(`${key}-${captcha.toLowerCase()}`)

	      	res.send({ success: true, message: '创建成功' })

	    }catch(err){

	      	return next(new Error(err))
	    }
	},
	login: async (req, res, next) => {

		const { account, password } = req.body

		if (!account||!password) {

			return res.send({ success: false, message: '登陆信息不完整' })
		}

		try{
			
			const user = await db_user.findOne({ account, password: md5(password.trim()), status: 1 },'_id')

			if (!user) {

				return res.send({ success:false, message:"登陆密码错误" })
			}

			return res.send({ success: true, message: '登陆成功', data:{ token: jwt.encode({ _id: user._id }) } })

		}catch(err){

			return next(new Error(err))
		}
	},
	get_user: async (req, res, next) => {

		try{

	      	const data = await db_user.findById(req.uid, { name: 1, account: 1, avatar: 1, points: 1, access: 1 })

	      	return res.send({ success: true, message: '获取成功', data })

	    }catch(err){

	      	return next(new Error(err))
	    }
	},
	update_user: async (req, res, next) => {

		try{

			const { name, avatar } = req.body

			if (!name||!avatar||!name.trim()||!avatar.trim()) {

				return res.send({ success:false, message:"更新信息缺失" })
			}

	      	const data = await db_user.findByIdAndUpdate(req.uid, { name, avatar })

	      	return res.send({ success: true, message: '更新成功' })

	    }catch(err){

	      	return next(new Error(err))
	    }
	}
}