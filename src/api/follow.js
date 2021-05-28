import axios from '@/libs/api.request'

export default {
	isfollow : async (shopid) => {

		return await axios.request({
	  
	    	url: `/api/follow/isfollow`,
	    
	    	method: 'post',

	    	data: { shopid }
	    	
	  	})
	},
	follow : async (shopid) => {

		return await axios.request({
	  
	    	url: `/api/follow/follow`,
	    
	    	method: 'post',

	    	data: { shopid }
	    	
	  	})
	},
	unfollow : async (shopid) => {

		return await axios.request({
	  
	    	url: `/api/follow/unfollow`,
	    
	    	method: 'post',

	    	data: { shopid }
	    	
	  	})
	},
	userFollow : async () => {

		return await axios.request({
	  
	    	url: `/api/follow/user_follow`,
	    
	    	method: 'post'
	    	
	  	})
	},
	shopFollow : async (data) => {

		return await axios.request({
	  
	    	url: `/api/follow/shop_follow`,
	    
	    	method: 'post',

	    	data
	    	
	  	})
	},
}