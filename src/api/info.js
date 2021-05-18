import axios from '@/libs/api.request'

export default {

	getInfoList : async () => {

		return await axios.request({
	  
	    	url: `/api/info/get_list`,
	    
	    	method: 'get'
	    	
	  	})
	},
	addInfo : async (name, phone, wechat, telegram, address) => {

		return await axios.request({
	  
	    	url: `/api/info/add_info`,
	    
	    	method: 'post',

	    	data:{ name, phone, wechat, telegram, address }
	    	
	  	})
	},
	delInfo : async (_id) => {

		return await axios.request({
	  
	    	url: `/api/info/del_info`,
	    
	    	method: 'post',

	    	data:{ _id }
	    	
	  	})
	},
	updateInfo : async (_id, name, phone, wechat, telegram, address) => {

		return await axios.request({
	  
	    	url: `/api/info/update_info`,
	    
	    	method: 'post',

	    	data:{ _id, name, phone, wechat, telegram, address }
	    	
	  	})
	},
	setDefault : async (_id) => {

		return await axios.request({
	  
	    	url: `/api/info/set_default`,
	    
	    	method: 'post',

	    	data:{ _id }
	    	
	  	})
	}
}