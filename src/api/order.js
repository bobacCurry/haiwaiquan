import axios from '@/libs/api.request'

export default {

	newOrder : async (data) => {

		return await axios.request({
	  
	    	url: `/api/order/new_order`,
	    
	    	method: 'post',

	    	data
	  	})
	},
	getUserOrder : async (data) => {

		return await axios.request({
	  
	    	url: `/api/order/get_user_order`,
	    
	    	method: 'post',

	    	data
	  	})
	},
	getShopOrder : async (data) => {

		return await axios.request({
	  
	    	url: `/api/order/get_shop_order`,
	    
	    	method: 'post',

	    	data
	  	})
	},
	cancelOrderUser : async (_id) => {

		return await axios.request({
	  
	    	url: `/api/order/cancel_order_user`,
	    
	    	method: 'post',

	    	data: { _id }
	  	})
	},
	cancelOrderShop : async (_id) => {

		return await axios.request({
	  
	    	url: `/api/order/cancel_order_shop`,
	    
	    	method: 'post',

	    	data: { _id }
	  	})
	},
	confirmOrder : async (data) => {

		return await axios.request({
	  
	    	url: `/api/order/confirm_order`,
	    
	    	method: 'post',

	    	data
	  	})
	},
	delivery : async (_id) => {

		return await axios.request({
	  
	    	url: `/api/order/delivery`,
	    
	    	method: 'post',

	    	data: { _id }
	  	})
	},
	arrived : async (_id) => {

		return await axios.request({
	  
	    	url: `/api/order/arrived`,
	    
	    	method: 'post',

	    	data: { _id }
	  	})
	},
	finishOrder : async (_id) => {

		return await axios.request({
	  
	    	url: `/api/order/finish_order`,
	    
	    	method: 'post',

	    	data: { _id }
	  	})
	},
	unfinishedCount : async (shopid) => {

		return await axios.request({
	  
	    	url: `/api/order/unfinished_count`,
	    
	    	method: 'post',

	    	data: { shopid }
	  	})
	}
}