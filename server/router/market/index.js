module.exports = function(app) {

	app.use('/shop', require('./shop'))

	// app.use('/order', require('./order'))
}