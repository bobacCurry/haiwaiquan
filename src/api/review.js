import axios from '@/libs/api.request'

export default {

	newReview : async (data) => {

		return await axios.request({
	  
	    	url: `/api/review/new_review`,
	    
	    	method: 'post',

	    	data
	  	})
	},
	getReview : async (data) => {

		return await axios.request({
	  
	    	url: `/api/review/get_review`,
	    
	    	method: 'post',

	    	data
	  	})
	},
	delReview : async (_id) => {

		return await axios.request({
	  
	    	url: `/api/review/del_review`,
	    
	    	method: 'post',

	    	data: { _id }
	  	})
	},
	replyReview : async (_id, text) => {

		return await axios.request({
	  
	    	url: `/api/review/reply_review`,
	    
	    	method: 'post',

	    	data: { _id, text }
	  	})
	},
	delReply : async (_id) => {

		return await axios.request({
	  
	    	url: `/api/review/del_reply`,
	    
	    	method: 'post',

	    	data: { _id }
	  	})
	}
}