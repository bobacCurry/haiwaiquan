import Cookies from 'js-cookie'
// cookie保存的天数
import config from '_config'

const { cookieExpires } = config

export const TOKEN_KEY = 'token'

export const setToken = (token) => {

  	Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
  
}

export const getToken = () => {
  
  	const token = Cookies.get(TOKEN_KEY)
  
  	if (token) return token
  
  	else return false
}

export const copyText = (text) => {

	const input = document.createElement('textarea')

	input.value = text
	
	document.body.appendChild(input)
	
	input.select()
	
	if (document.execCommand('Copy')) {

		document.execCommand('Copy')
	}
	
	document.body.removeChild(input)
}

export const formatTime = (time) => {

	let date = new Date(time)
	
	let year    = date.getFullYear()
	
	let month   = date.getMonth() + 1
	
	let day     = date.getDay()
	
	let hour    = date.getHours()
	
	let minute  = date.getMinutes()

	let seconds = date.getSeconds()

	return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+seconds
}