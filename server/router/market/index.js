module.exports = function(app) {

	app.use('/shop', require('./shop'))

	app.use('/show', require('./show'))

	app.use('/order', require('./order'))

	app.use('/review', require('./review'))
}