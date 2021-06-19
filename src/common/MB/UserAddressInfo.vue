<template>
	<div class="black-frame">
		<div class="address-list-frame row-start-center">
			<div class="address-item" v-for="(item,key) in infoList" :key="key">
				<div class="row-between-center">
					<div class="info-name"><b>{{ item.name }}</b> <span v-if="item.default" style="font-size: 14px">(默认地址)</span></div>
					<div>
						<span>
							<a @click="$store.dispatch('setAddress',{ show: true, info: item })">修改</a>
						</span>
						&nbsp;&nbsp;&nbsp;
						<span v-if="!item.default">
							<a @click="setDefault(item._id)">设为默认</a>
						</span>
						&nbsp;&nbsp;&nbsp;
						<span>
							<a @click="delInfo(item._id)">删除</a>
						</span>
					</div>
				</div>
				<div class="info-address">
					{{ item.address }}
				</div>
			</div>
			<div class="address-item row-center-center" v-if="infoList.length<6" @click="$store.dispatch('setAddress',{ show: true, info: null })">
				<Icon name="add-o" size="50"/>
			</div>
		</div>
	</div>
</template>
<script>
	import API from '_api'
	import { Icon, Notify, Dialog } from 'vant'
	export default {
		components:{ Icon, Notify, Dialog },
		computed:{
			user(){

				const user = this.$store.state.user? this.$store.state.user: {}

				return user
			},
			infoList(){

				return this.$store.state.infoList
			}
		},
		data(){
			return {

			}
		},
		methods:{
			async setDefault(_id){

				const { data } = await API.info.setDefault(_id)

				if (!data.success) {
				
					return Notify({ type: 'danger', message: data.message })
				}

				this.$store.dispatch('getInfoList')

				Notify({ type: 'success', message: '更新成功' })
			},
			async delInfo(_id){
				
				Dialog.confirm({ title: '是否删除该地址信息'}).then(async () => {

					const { data } = await API.info.delInfo(_id)

					if (!data.success) {

						return Notify({ type: 'danger', message: data.message })
					}
			    	
			    	this.$store.dispatch('getInfoList')
			    	
			  	}).catch(()=>{

			  	})
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss";
	.black-frame{
		padding-top: 10px;
		.address-list-frame{
			flex-wrap: wrap;
			.address-item{
				width: 100%;
				height: 120px;
				margin-bottom: 10px;
				padding: 10px;
				text-align: left;
				background: #ffffff;
				border-radius: 5px;
				a{
					cursor: pointer;
					&:hover{
						color: $ACTIVECOLOR;
					}
				}
				.info-name{
					font-size: 16px;
				}
				.info-address{
					padding-top: 20px;
				}
			}
		}
	}
</style>