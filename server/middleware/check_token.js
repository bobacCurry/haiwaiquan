const jwt = require('jsonwebtoken')

const fs = require('fs') //引入他的模块之后调用读取文件的方法

const key = fs.readFileSync(process.cwd() + '/jwt-key.txt', 'utf-8')

const decode = (req, res, next) => {

    //检查post的信息或者url查询参数或者头信息

    const token = req.headers['token']

    // 解析 token

    if (token) {

        jwt.verify(token, key, (err, decoded) => {

            if (err) {

                return res.send({ success: false, message: '登录验证失效' })

            } else {

                // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用

                req.uid = decoded._id

                next()
            }
        })

    } else {

        // 如果没有token，则返回错误

        return res.send({ success: false, message: '登录验证失效' })
    }
}

const encode = function(info, expire = 60 * 68 * 24) {

    return jwt.sign(info, key, { 'expiresIn': expire }) // 设置过期时间
}

module.exports = { decode, encode }