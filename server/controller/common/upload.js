const fs = require('fs')

const path = require('path')

const BASEDIR = 'static'

const TYPELIST = [ 'avatar', 'goods', 'shop' ]

const exist_or_build = dir => {
	// 文件夹不存在则创建
	if (!fs.existsSync(dir)) {

		fs.mkdirSync(dir)
	}
}

module.exports = {

	upload_img: (req, res) => {

		let { stream, type } = req.body

		if (!stream || !stream.trim()) {
    
      		return res.send({ success: false, message: '没有接收到文件流' })
    
    	}

    	if (!type||!type.trim()||TYPELIST.indexOf(type)===-1) {

    		return res.send({ success: false, message: '图片分类不存在' })
    	}

    	stream = stream.replace(/^data:image\/\w+;base64,/, '')

    	const filebuffer = new Buffer.from(stream, 'base64')

    	const filedir = path.resolve(process.cwd(), BASEDIR, type)

    	const filename = req.uid + '_' + new Date().getTime() + '.jpeg'

    	const filepath = path.resolve(filedir, filename)

    	exist_or_build(filedir)

    	return fs.writeFile(filepath, filebuffer, function(err) {

    		if (err) {
        
		        return res.send({ success: false, message: err })
		      
		    } else {
		      
		        let publicpath = '/' + 'api' + '/' + BASEDIR + '/' + type + '/' + filename

		        return res.send({ success: true, data: publicpath })
		    }
    	})
	}
}