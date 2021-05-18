const account = require('./account/index')

const common = require('./common/index')

const market = require('./market/index')

module.exports = function(app) {

	account(app)

	common(app)

	market(app)
}