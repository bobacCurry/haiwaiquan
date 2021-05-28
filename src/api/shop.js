import axios from '@/libs/api.request'

export default {

	getShop : async (data) => {

		return await axios.request({
	  
	    	url: `/api/shop/get_shop`,
	    
	    	method: 'get'

	  	})
	},
	addShop : async (data) => {

		return await axios.request({
	  
	    	url: `/api/shop/add_shop`,
	    
	    	method: 'post',

	    	data
	    	
	  	})
	},
	delShop : async (_id, password) => {

		return await axios.request({
	  
	    	url: `/api/shop/del_shop`,
	    
	    	method: 'post',

	    	data: { _id, password }
	    	
	  	})
	},
	updateShop : async (data) => {

		return await axios.request({
	  
	    	url: `/api/shop/update_shop`,
	    
	    	method: 'post',

	    	data
	    	
	  	})
	},
	setOpen :  async (_id, open) => {

		return await axios.request({
	  
	    	url: `/api/shop/set_open`,
	    
	    	method: 'post',

	    	data: { _id, open }
	  	})
	},
	setRunning :  async (_id, running) => {

		return await axios.request({
	  
	    	url: `/api/shop/set_running`,
	    
	    	method: 'post',

	    	data: { _id, running }
	  	})
	},
	getClass :  async (shopid) => {

		return await axios.request({
	  
	    	url: `/api/shop/get_class`,
	    
	    	method: 'post',

	    	data: { shopid }
	  	})
	},
	addClass :  async (shopid, name, sort) => {

		return await axios.request({
	  
	    	url: `/api/shop/add_class`,
	    
	    	method: 'post',

	    	data: { shopid, name, sort }
	    	
	  	})
	},
	delClass :  async (shopid, _id) => {

		return await axios.request({
	  
	    	url: `/api/shop/del_class`,
	    
	    	method: 'post',

	    	data: { shopid, _id }
	    	
	  	})
	},
	updateClass :  async (shopid, _id ,name, sort) => {

		return await axios.request({
	  
	    	url: `/api/shop/update_class`,
	    
	    	method: 'post',

	    	data: { shopid, _id, name, sort }
	    	
	  	})
	},
	getGoods :  async (shopid,page,rows) => {

		return await axios.request({
	  
	    	url: `/api/shop/get_goods`,
	    
	    	method: 'post',

	    	data: { shopid,page,rows }
	  	})
	},
	addGoods :  async (data) => {

		return await axios.request({
	  
	    	url: `/api/shop/add_goods`,
	    
	    	method: 'post',

	    	data
	  	})
	},
	delGoods :  async (shopid, _id) => {

		return await axios.request({
	  
	    	url: `/api/shop/del_goods`,
	    
	    	method: 'post',

	    	data: { shopid, _id }
	    	
	  	})
	},
	updateGoods :  async (data) => {

		return await axios.request({
	  
	    	url: `/api/shop/update_goods`,
	    
	    	method: 'post',

	    	data
	    	
	  	})
	},
	stopGoods :  async (shopid, _id, stop) => {

		return await axios.request({
	  
	    	url: `/api/shop/stop_goods`,
	    
	    	method: 'post',

	    	data: { shopid, _id, stop }
	    	
	  	})
	}
}