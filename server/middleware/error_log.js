const log = require('../controller/util/log.js')

module.exports = function(error, req, res, next) {

	if (error) {

		log.write(error)

		// error.message .status(500)

		return res.send({ success: false, message: '服务器错误，请联系管理员', error: error.message  })
	}
}