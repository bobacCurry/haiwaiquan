import axios from '@/libs/api.request'

export default {

	uploadImg : async (stream, type) => {

		return await axios.request({
	  
	    	url: `/api/common/upload_img`,
	    
	    	method: 'post',

	    	data: { stream, type }
	  	})
	}
}