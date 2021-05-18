<template>
	<div class="upload-frame" @click="selectImg()">
		<slot></slot>
		<input :id="single" type="file" accept="image/*" @change="getImg($event)" style="display: none">
	</div>
</template>
<script>
	import { Notify } from 'vant'
	import API from '_api'
	export default {
		name: 'Upload',
		props: [ 'type', 'single' ],
		components:{ Notify },
		methods:{
			selectImg(){

				if (!this.single) {

					return Notify({ type: 'danger', message: '系统错误，请注意图片标示' })
				}

		        document.getElementById(this.single).click()
	    	},
	    	getImg(e){

	    		let file = e.target.files[0]

	    		e.target.value = ''

	    		if (!file) {

	    			return Notify({ type: 'danger', message: '请选择图片' })
	    		}

	    		if (file.size>500000) {

		          	return Notify({ type: 'danger', message: '图片大小不得超过500kb' })
		        }

	    		let vue = this

	    		let reader = new FileReader()
	            
	            reader.readAsDataURL(file)
	            
	            reader.onload=function(){

	            	vue.upload(this.result)
	            }
	    	},
	    	upload(stream){
	    		
	    		API.common.uploadImg(stream, this.type).then(({ data })=>{

	    			if (data.success) {
	    			
	    				this.$emit('getUrl', data.data)
	    			
	    			}else{
	    			
	    				Notify({ type: 'danger', message: data.message })
	    			}
	    		})
	    	}
		}
	}
</script>