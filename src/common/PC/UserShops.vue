<template>
	<div class="user-shops-frame">
		<div class="shop-list-frame row-start-center">
			<div class="shop-item row-between-center" v-for="(item,key) in shopList" :key="key">
				<VanImage :src="item.logo" fit="cover" width="40%" height="130"/>
				<div class="shop-item-info">
					<div class="row-start-center">
						<div class="shop-item-name omit">
							<b v-if="item.pass"><a @click="$router.push(`/shop/${item._id}`)">{{ item.name }}</a></b>
							<b v-else>{{ item.name }}</b>
						</div>
						<span v-if="!item.pass" style="color: red;margin-left: 10px"> (审核中)</span>
					</div>
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
						<a class="edit" @click="shopId=item._id;currency=item.currency;showGoodsEdit=true">编辑商品</a>
						|
						<a class="edit" @click="deleteid=item._id;deleteShop=true">删除商铺</a>
					</div>
					<div class="info-edit">
						<a class="edit" @click="$router.push(`/user/5?_id=${item._id}`)">查看店铺订单</a>
						|
						<a class="edit" @click="$router.push(`/user/5?_id=${item._id}&unfinished=1`)">未完成的订单(<b>{{ orderCount[item._id] }}</b>)
						</a>
						|
						<a class="edit" @click="fans_param.page=1;fans_param.shopid=item._id;getFans();showFans=true;">查看粉丝</a> 
					</div>
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
		<EditShop v-if="showShopEdit" :shopInfo="shopInfo" @confirm="getShop();showShopEdit=false" @close="showShopEdit=false"/>
		<EditGoods v-if="showGoodsEdit" :shopId="shopId" :currency="currency" @close="showGoodsEdit=false"/>
		<Overlay :show="deleteShop" v-if="deleteShop">
			<div class="wrapper"  @click="deleteShop = false">
			   	<div class="block"  @click.stop>
			   		<div class="title">
			   			<h3>确认删除店铺么？删除后不可恢复哦！</h3>
			   		</div>
			   		<div class="password">
				   		<Field v-model="password" placeholder="请输入您的登录密码" type="password"/>
				   	</div>
			   		<div class="action row-start-center">
			   			<Button type="danger" @click="delShop()">删除店铺</Button>
			   			<Button type="warning" style="margin-left: 20px" @click="password='';deleteShop = false">取消删除</Button>
			   		</div>
			   	</div>
			</div>
		</Overlay>
		<Overlay :show="showFans" v-if="showFans">
			<div class="wrapper" @click="showFans = false">
				<div class="fans-frame"  @click.stop>
					<div class="fans-list-frame">
						<div class="fans-item row-start-center" v-for="(item,key) in fans.items" :key="key">
							<VanImage :src="item.user.avatar" width="50px" height="50px" fit="cover" round/>
							<div class="fans-name"><b>{{ item.user.name }}</b></div>
						</div>
					</div>
					<Pagination v-model="fans_param.page" :items-per-page="fans_param.rows" :total-items="fans.total" @change="getFans()"/>
				</div>
			</div>
		</Overlay>
	</div>
</template>
<script>
	import { Image as VanImage, Tag, Button, Field, Icon, Notify, Dialog, Overlay, Pagination } from 'vant'
	import EditShop from '_common/PC/EditShop'
	import EditGoods from '_common/PC/EditGoods'
	import API from '_api'
	export default {
		name: 'UserShops',
		components:{ VanImage, Tag, Button, Field, Icon, Notify, Dialog, Overlay, EditShop, EditGoods, Pagination },
		data(){
			return {
				showShopEdit: false,
				showGoodsEdit: false,
				showFans: false,
				shopList: [],
				shopInfo: null,
				shopId: null,
				currency: null,
				deleteShop: false,
				password: '',
				deleteid: '',
				orderCount: {},
				intervalId: null,
				fans_param: {
					page: 1,
					rows: 20,
					shopid: ''
				},
				fans: {
					total: 0,
					items: []
				}
			}
		},
		async mounted(){

			this.$store.dispatch('setLoading',true)

			await this.getShop()

			await this.getUnfinished()

			this.$store.dispatch('setLoading',false)

			this.intervalId = setInterval(async ()=>{ await this.getUnfinished() }, 60000)

		},
		async destroyed(){

			clearInterval(this.intervalId)
		},
		methods:{

			async getShop(){

				const { data } = await API.shop.getShop('/api/shop/get_shop')

				if (data.success) {

					this.shopList = data.data
				}
			},
			async delShop(){
				
				if (!this.password.trim()) {
					
					return Notify({ type: 'danger', message: '登录密码不得为空！' })
				}

				const { data } = await API.shop.delShop(this.deleteid,this.password)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}
		    	
				this.password = ''

				this.deleteShop = false

		    	this.getShop()

		    	Notify({ type: 'success', message: '删除商城成功' })
			    	
			},
			async setRunning(_id,running,pass){
				
				if (!pass) {
					
					return Notify({ type: 'danger', message: '审核未通过，不可操作上架状态' })
				}

				const { data } = await API.shop.setRunning(_id,running)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				this.getShop()
			},
			async setOpen(_id,open,pass){
				
				if (!pass) {

					return Notify({ type: 'danger', message: '审核未通过，不可操作营业状态' })
				}

				const { data } = await API.shop.setOpen(_id,open)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				this.getShop()
			},
			async getUnfinished(){

				if (!this.shopList.length) {

					return 
				}

				for (var i = this.shopList.length - 1; i >= 0; i--) {

					let { data } = await API.order.unfinishedCount(this.shopList[i]._id)

					if (!data.success) {

						clearInterval(this.intervalId)

						return Notify({ type: 'danger', message: data.message })
					}

					this.orderCount[this.shopList[i]._id] = data.data

					this.orderCount = JSON.parse(JSON.stringify(this.orderCount))

				}
			},
			async getFans(){

				let { data } = await API.follow.shopFollow(this.fans_param)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				this.fans.items = data.data.items

				this.fans.total = data.data.total
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss";
	.shop-list-frame{
		flex-wrap: wrap;
		a{
			color: #1989fa;
			cursor: pointer;
			&:hover{
				color: #0366d6;
			}
		}
		.shop-item{
			width: 49%;
			height: 150px;
			border: 1px solid #dcdcdc;
			margin-bottom: 10px;
			margin-right: 1%;
			padding: 10px;
			text-align: left;
			.shop-item-info{
				width: 58%;
				.shop-item-name{
					font-size: 16px;
					max-width: 150px;
				}
				.on{
					color: #1989fa;
					&:hover{
						color: #0366d6;
					}
				}
				.off{
					color: red;
				}
				.info-edit{
					margin-top: 5px;
					.edit{
						color: #1989fa;
						b{
							color: red;
						}
						&:hover{
							color: #0366d6;
						}
					}
				}
			}
		}
	}
	.shop-notice{
		margin-top: 30px;
	}
	.wrapper {
    	display: flex;
    	align-items: center;
    	justify-content: center;
    	height: 100%;
  	}
  	.fans-frame{
  		width: 300px;
  		height: 500px;
  		background-color: #fff;
    	border-radius: 10px;
    	text-align: left;
    	.fans-list-frame{
    		padding: 10px;
    		height: 460px;
    		overflow: auto;
    		.fans-item{
    			padding: 10px 0;
    			border-bottom: 1px solid #f7f7f7;
    			.fans-name{
    				margin-left: 20px;
    			}
    		}
    	}
  	}
  	.block {
    	width: 500px;
    	height: 250px;
    	background-color: #fff;
    	border-radius: 10px;
    	overflow: hidden;
    	padding: 20px;
    	text-align: left;
    	.title{
    		padding: 10px 16px;
    		color: red;
    	}
    	.password{
    		margin-top: 20px;
    	}
    	.action{
    		padding: 10px 16px;
    		margin-top: 20px;
    	}
  	}
</style>