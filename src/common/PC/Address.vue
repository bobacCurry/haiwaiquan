<template>
	<div>
		<Overlay :show="show" z-index="100" @click="$store.dispatch('setAddress',{ show: false, info: null })">
			<div class="wrapper">
				<div class="info-frame" @click.stop>
					<div class="info-item">
						<Field v-model="name" label="称呼" placeholder="你的称呼" />
					</div>
					<div class="info-item">
						<Field v-model="phone" label="电话" placeholder="您的电话号" />
					</div>
					<div class="info-item">
						<Field v-model="wechat" label="微信" placeholder="您的微信号" />
					</div>
					<div class="info-item">
						<Field v-model="telegram" label="飞机" placeholder="飞机的 username，可通过 @usernama 搜索到您" />
					</div>
					<div class="info-item">
						<Field v-model="address" type="textarea" rows="3" autosize label="地址" placeholder="你的详细收货地址" show-word-limit maxlength="200"/>
					</div>
					<div class="info-item save-item">
						<Button type="info" @click="updateInfo()" v-if="id">更新</Button>
						<Button type="info" @click="addInfo()" v-else>保存</Button>
						&nbsp;&nbsp;&nbsp;
						<Button type="default" @click="$store.dispatch('setAddress', { show: false, info: null })">取消</Button>
					</div>
				</div>
			</div>
		</Overlay>
	</div>
</template>
<script>
	import { Overlay, Field, Button, Notify } from 'vant'
	import API from '_api'
	export default {
		name: 'Address',
		components:{ Overlay, Field, Button, Notify },
		data(){
			return {
				id:'',
				name:'',
				phone:'',
				wechat:'',
				telegram:'',
				address:''
			}
		},
		computed:{
			show(){

				return this.$store.state.showAddress
			}
		},
		mounted(){

			if (this.$store.state.eidtAddress) {

				this.id = this.$store.state.eidtAddress._id

				this.name = this.$store.state.eidtAddress.name

				this.phone = this.$store.state.eidtAddress.phone

				this.wechat = this.$store.state.eidtAddress.wechat

				this.telegram = this.$store.state.eidtAddress.telegram

				this.address = this.$store.state.eidtAddress.address
			}
		},
		methods:{
			async addInfo(){

				if (!this.name.trim()||!this.address.trim()) {

					return Notify({ type: 'danger', message: '称呼或地址信息缺失' })
				}

				if (!this.phone.trim()||!this.wechat.trim()||!this.telegram.trim()) {

					return Notify({ type: 'danger', message: '请填写至少一种联系方式' })
				}

				const { data } = await API.info.addInfo(this.name, this.phone, this.wechat, this.telegram, this.address)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				this.$store.dispatch('getInfoList')

				this.$store.dispatch('setAddress', { show: false, info: null })
			},
			async updateInfo(){
		
				if (!this.name.trim()||!this.address.trim()) {

					return Notify({ type: 'danger', message: '称呼或地址信息缺失' })
				}

				if (!this.phone.trim()||!this.wechat.trim()||!this.telegram.trim()) {

					return Notify({ type: 'danger', message: '请填写至少一种联系方式' })
				}

				const { data } = await API.info.updateInfo(this.id, this.name, this.phone, this.wechat, this.telegram, this.address)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				this.$store.dispatch('getInfoList')

				this.$store.dispatch('setAddress', { show: false, info: null })	
			}		
		}
	}
</script>
<style lang="scss" scoped>
	.wrapper{
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    width: 100%;
	    height: 100%;
	    .info-frame{
	    	width: 600px;
	    	height: 500px;
	    	overflow: auto;
		    background-color: #ffffff;
		    border-radius: 10px;
		    text-align: left;
		    .info-item{
		    	margin-top: 5px;
		    	padding: 5px;
		    	border-bottom: 1px solid #f7f7f7;
		    }
		    .save-item{
		    	padding: 30px;
		    }
	    }
  	}
</style>