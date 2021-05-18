<template>
	<div class="page-frame">
		<Header/>
		<div class="user-center-frame row-between-top">
			<div class="center-tab">
				<div :class="['center-tab-item',active===0?'active':'']" @click="active=0"><b>账户信息</b></div>
				<div :class="['center-tab-item',active===1?'active':'']" @click="active=1"><b>地址管理</b></div>
				<div :class="['center-tab-item',active===2?'active':'']" @click="active=2"><b>我的订单</b></div>
				<div :class="['center-tab-item',active===3?'active':'']" @click="active=3"><b>关注的店</b></div>
				<div :class="['center-tab-item',active===4?'active':'']" @click="active=4"><b>我的店铺</b></div>
			</div>
			<div class="center-info">
				<div v-if="active===0" class="center-info-item">
					<div class="row-start-center user-info-item">
						<div class="info-item-name">账号</div>
						<div class="info-item-value">{{ user.account }}</div>
					</div>
					<div class="row-start-center user-info-item">
						<div class="info-item-name">角色</div>
						<div class="info-item-value row-start-center">
							<div v-for="(item,key) in user.access" :key="key" class="user-access">
								<Tag type="success" size="medium">{{ACCESS[item]}}</Tag>
							</div>
						</div>
					</div>
					<div class="row-start-center user-info-item">
						<div class="info-item-name">头像</div>
						<div class="info-item-value">
							<VanImage :src="user.avatar" round width="50px" height="50px" v-if="!edit"/>
							<VanImage :src="editInfo.avatar" round width="50px" height="50px" v-else/>
							<div>
								<Upload type="avatar" single="getAvatarUrl" @getUrl='getAvatarUrl'>
									<Button type="info" size="mini" v-if="edit">更换头像</Button>
								</Upload>
							</div>
						</div>
					</div>
					<div class="row-start-center user-info-item">
						<div class="info-item-name">昵称</div>
						<div class="info-item-value" v-if="!edit">{{ user.name }}</div>
						<div class="info-item-value" v-else>
							<Field v-model="editInfo.name" placeholder="更新昵称" style="padding: 0;border:1px solid gray"/>
						</div>
					</div>
					<div class="row-start-center user-info-item" v-if="!edit">
						<Button type="info" size="small" @click="editUser()">修改信息</Button>
					</div>
					<div class="row-start-center user-info-item" v-else>
						<Button type="info" size="small" @click="updateUser()">更改信息</Button>
						<Button type="default" size="small" @click="edit=false" style="margin-left: 10px">放弃更改</Button>
					</div>
				</div>
				<div v-if="active===1" class="center-info-item">
					<div class="address-list-frame row-start-center">
						<div class="address-item" v-for="(item,key) in infoList" :key="key">
							<div class="row-between-center">
								<div class="info-name"><b>{{ item.name }}</b></div>
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
				<div v-if="active===2" class="center-info-item">
					
				</div>
				<div v-if="active===3" class="center-info-item">
					
				</div>
				<div v-if="active===4" class="center-info-item">
					<div class="shop-list-frame row-start-center">
						<div class="shop-item row-between-center" v-for="(item,key) in shopList" :key="key">
							<VanImage :src="item.logo" fit="cover" width="40%" height="100"/>
							<div class="shop-item-info">
								<div><b class="shop-item-name">{{ item.name }}</b><span v-if="!item.pass" style="color: red"> (审核中)</span></div>
								<div class="info-edit">
									是否上架：
									<span @click="setRunning(item._id,!item.running,item.pass)">
										<a v-if="item.running" class="on">点击下架</a>
										<a v-else class="off">点击上架</a>
									</span>
								</div>
								<div class="info-edit">
									是否营业：
									<span @click="setOpen(item._id,!item.open,item.pass)">
										<a v-if="item.open" class="on">点击打烊</a>
										<a v-else class="off">点击营业</a>
									</span>
								</div>
								<div class="info-edit">
									<a class="edit" @click="shopInfo=item;showShopEdit=true">编辑商铺</a> 
									| 
									<a class="edit" @click="shopId=item._id;currency=item.currency;showGoodsEdit=true">编辑商品</a></div>
							</div>
						</div>
						<div class="shop-item row-center-center" @click="shopInfo=null;showShopEdit=true" v-if="shopList.length<3">
							<Icon name="add-o" size="50"/>
						</div>
					</div>
					<div class="shop-notice">
						<p><b>每位用户最多可创建3个店铺，创建店铺后，可申请店铺信息审核，通过审核后您的店铺会上架。</b></p>
						<br/>
						<p><b>请确保店铺信息真实，如发现虚假信息，您的店铺将会被强制下架。</b></p>
					</div>
				</div>
			</div>
		</div>
		<EditShop v-if="showShopEdit" :shopInfo="shopInfo" @close="getShop();showShopEdit=false"/>
		<EditGoods  v-if="showGoodsEdit" :shopId="shopId" :currency="currency" @close="showGoodsEdit=false"/>
	</div>
</template>
<script>
	import Header from '_common/PC/Header'
	import Upload from '_common/BASE/Upload'
	import EditShop from '_common/PC/EditShop'
	import EditGoods from '_common/PC/EditGoods'
	import { Image as VanImage, Tag, Button, Field, Icon, Notify, Dialog } from 'vant'
	import { ACCESS } from '_config/user'
	import API from '_api'
	export default {
		name: 'User',
		components:{ VanImage, Header, Tag, Button, Field, Icon, Notify, Upload, EditShop, EditGoods },
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
				ACCESS,
				active: 4,
				edit: false,
				editInfo: {
					name:'',
					avatar:''
				},
				showShopEdit: false,
				showGoodsEdit: false,
				shopList: [],
				shopInfo: null,
				shopId: null,
				currency: null
			}
		},
		async mounted(){

			await this.getShop()
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
			},
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
			},
			async getShop(){

				const { data } = await API.shop.getShop('/api/shop/get_shop')

				if (data.success) {

					this.shopList = data.data
				}
			},
			async setRunning(_id,status,pass){
				if (!pass) {
					return Notify({ type: 'danger', message: '审核未通过，不可操作上架状态' })
				}
			},
			async setOpen(_id,status,pass){
				if (!pass) {
					return Notify({ type: 'danger', message: '审核未通过，不可操作营业状态' })
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss";
	.page-frame{
		background: $PAGEBACKGROUND;
		.user-center-frame{
			padding: 30px 120px;
			.center-tab{
				width: 20%;
				.center-tab-item{
					height: 50px;
					line-height: 50px;
					font-size: 18px;
					text-align: left;
					padding: 0 10px;
					&.active{
						background: $ACTIVECOLOR;
						color: $BASECOLOR;
					}
				}
			}
			.center-info{
				width: 80%;
				background: $ZONEBACKGROUND;
				height: 80vh;
				overflow: auto;
				padding: 20px;
				.center-info-item{
					font-size: 14px;
					text-align: left;
				}
				.user-info-item{
					margin-top: 30px;
					padding-left: 50px;
					.info-item-value{
						margin-left: 50px;
						.user-access{
							margin-right: 10px;
						}
					}
				}
				.address-list-frame{
					flex-wrap: wrap;
					.address-item{
						width: 30%;
						height: 120px;
						border: 1px solid #dcdcdc;
						margin-bottom: 10px;
						margin-right: 3%;
						padding: 10px;
						text-align: left;
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
				.shop-list-frame{
					flex-wrap: wrap;
					.shop-item{
						width: 30%;
						height: 120px;
						border: 1px solid #dcdcdc;
						margin-bottom: 10px;
						margin-right: 3%;
						padding: 10px;
						text-align: left;
						.shop-item-info{
							width: 58%;
							.shop-item-name{
								font-size: 16px;
							}
							a{
								cursor: pointer;
							}
							.on{
								color: #1989fa;
							}
							.off{
								color: red;
							}
							.info-edit{
								margin-top: 5px;
								.edit{
									color: #1989fa;
								}
							}
						}
					}
				}
				.shop-notice{
					margin-top: 30px;
				}
			}
		}
	}
</style>