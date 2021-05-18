import axios from '@/libs/api.request'

export default {
	
	getCaptcha : async () => {

		return await axios.request({
	  
	    	url: `/api/user/get_captcha`,
	    
	    	method: 'get'

	  	})
	},
	register : async (account, password, captcha, key) => {

		return await axios.request({
	  
	    	url: `/api/user/register`,
	    
	    	method: 'post',

	    	data:{ account, password, captcha, key }
	    	
	  	})
	},
	login : async (account, password) => {

		return await axios.request({
	  
	    	url: `/api/user/login`,
	    
	    	method: 'post',

	    	data:{ account, password }
	    	
	  	})
	},
	getUser : async () => {

		return await axios.request({
	  
	    	url: `/api/user/get_user`,
	    
	    	method: 'get'

	  	})
	},
	updateUser : async (name, avatar) => {

		return await axios.request({
	  
	    	url: `/api/user/update_user`,
	    
	    	method: 'post',

	    	data:{ name, avatar }

	  	})
	}
}