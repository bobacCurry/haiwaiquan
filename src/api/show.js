import axios from '@/libs/api.request'

export default {
	
	getShops : async (data) => {
		
		return await axios.request({
	  
	    	url: `/api/show/get_shops`,
	    
	    	method: 'post',

	    	data
	    	
	  	})		
	},
	getTypeShops : async (data) => {
		
		return await axios.request({
	  
	    	url: `/api/show/get_type_shops`,
	    
	    	method: 'post',

	    	data
	    	
	  	})
	},
	getShop : async (_id) => {
		
		return await axios.request({
	  
	    	url: `/api/show/get_shop/${_id}`,
	    
	    	method: 'post'
	    	
	  	})		
	}
}