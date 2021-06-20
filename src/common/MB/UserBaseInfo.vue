<template>
	<div class="block-frame">
		<div class="user-info-frame">
			<div class="row-start-center info-item">
				<div class="info-label">账号</div>
				<div class="info-value">{{ user.account }}</div>
			</div>
			<div class="row-start-center info-item">
				<div class="info-label">头像</div>
				<div class="info-value">
					<VanImage :src="user.avatar" round width="50px" height="50px" v-if="!edit"/>
					<VanImage :src="editInfo.avatar" round width="50px" height="50px" v-else/>
					<div>
						<Upload type="avatar" single="getAvatarUrl" @getUrl='getAvatarUrl'>
							<Button type="info" size="mini" v-if="edit">更换头像</Button>
						</Upload>
					</div>
				</div>
			</div>
			<div class="row-start-center info-item">
				<div class="info-label">昵称</div>
				<div class="info-value" v-if="!edit">{{ user.name }}</div>
				<div class="info-value" v-else>
					<Field v-model="editInfo.name" placeholder="更新昵称" style="padding: 0;border:1px solid gray"/>
				</div>
			</div>
			<div class="row-start-center info-item">
				<Button  v-if="!edit" type="info" size="small" @click="editUser()">修改信息</Button>
				<Button  v-if="edit" type="info" size="small" @click="updateUser()">更改信息</Button>
				<Button  v-if="edit" type="default" size="small" @click="edit=false" style="margin-left: 10px">放弃更改</Button>
			</div>
		</div>
	</div>
</template>
<script>
	import API from '_api'
	import Upload from '_common/BASE/Upload'
	import { Image as VanImage, Button, Field, Icon, Notify } from 'vant'
	export default {
		components:{ VanImage, Button, Field, Icon, Notify, Upload },
		computed:{
			user(){

				const user = this.$store.state.user? this.$store.state.user: {}

				return user
			}
		},
		data(){
			return {

				edit: false,
				
				editInfo:{

					name:'',
					
					avatar:''
				}
			}
		},
		methods:{
			async editUser(){

				if (!this.editInfo.name) {

					this.editInfo.name = this.user.name
				}

				if (!this.editInfo.avatar) {

					this.editInfo.avatar = this.user.avatar
				}

				this.edit = true
			},
			async updateUser(){

				if (!this.editInfo.name.trim()||!this.editInfo.avatar.trim()) {

					return Notify({ type: 'danger', message: '更新信息缺失' })
				}

				if (this.editInfo.name.length>8) {

					return Notify({ type: 'danger', message: '昵称不要超过十个字' })
				}

				const { data } = await API.user.updateUser(this.editInfo.name,this.editInfo.avatar)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				this.$store.dispatch('getUser')

				this.edit = false

				Notify({ type: 'success', message: '更新成功' })
			},
			async getAvatarUrl(url){

				this.editInfo.avatar = url
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss";
	.block-frame{
		padding-top: 10px;
		.user-info-frame{
			padding: 20px;
			background: #ffffff;
			border-radius: 5px;
			.info-item{
				margin: 20px 0;
				.info-value{
					width: 60%;
					text-align: left;
					padding-left: 30px;
				}
			}
		}
	}
</style>