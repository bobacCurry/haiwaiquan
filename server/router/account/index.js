module.exports = function(app) {

	app.use('/user', require('./user'))

	app.use('/info', require('./info'))

	app.use('/follow', require('./follow'))

}