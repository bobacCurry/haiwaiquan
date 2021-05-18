const log = require('../controller/util/log.js')

module.exports = function(error, req, res, next) {

	if (error) {

		log.write(error)

		// error.message

		return res.status(500).send({ success: false, message: '服务器错误，请联系管理员', error: error.message  })
	}
}