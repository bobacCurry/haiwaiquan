<template>
	<div class="page-frame">
		<div class="home-banner">
			<div class="banner-frame">
				<div class="banner-account row-between-center">
					<div class="web-logo"><b>海外圈</b></div>
					<div class="web-account" v-if="!user">
						<a  @click="$store.dispatch('setAccount','login')"><b>登录</b></a>
						/
						<a @click="$store.dispatch('setAccount','register')"><b>注册</b></a>
					</div>
					<div class="web-account" v-else>
						<Popover v-model="showUserAction" :close-on-click-outside="true" trigger="click">
							<div class="user-action-frame">
								<div class="user-action-item" @click="$router.push('/user/0')">用户中心</div>
								<div class="user-action-item" @click="logout()">退出登录</div>
							</div>
							<template #reference>
								<VanImage :src="user.avatar" round height="40" width="40" fit="cover"/>
							</template>
						</Popover>
					</div>
				</div>
				<div class="banner-mask"></div>
				<VanImage src="/img/mobile/home/banner.png"/>
			</div>
		</div>
		<div class="home-body">
			<div class="body-banner"></div>
			<div class="body-content">
				<div class="search-frame">
					<Search v-model="param.keywords" @search="reset"  placeholder="搜索相关店铺" shape="round"/>
				</div>
				<div class="home-service-frame row-start-center">
					<div class="service-item" v-for="(item,key) in SERVICETYPE" :key="key" @click="$router.push(`/service/${key+1}`)">
						<VanImage :src="item.icon" fit="cover" width="40" height="40"/>
						<div>{{ item.name }}</div>
					</div>
				</div>
				<div class="home-shops-frame">
					<div class="home-shops-title">推荐商家</div>
					<ShopList :type="0" :items="items" :loading="loading" :hasMore="hasMore" @search="search()"/>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import ShopList from '_common/MB/ShopList'
	import { setToken, getToken } from '@/libs/util'
	import { SERVICETYPE, PAYMENT, DELIVERY } from '_config/shop'
	import { Image as VanImage, Rate, Popover, Search } from 'vant'
	import API from '_api'
	export default {
		name: 'Home',
		components:{ VanImage, Rate, Popover, Search, ShopList },
		data(){
			return {
				SERVICETYPE,
				PAYMENT,
				DELIVERY,
				showUserAction: false,
				loading: false,
				hasMore: true,
				param: {
					page: 1,
					rows: 40,
					keywords: ''
				},
				items: []
			}
		},
		computed:{
			user(){
				return this.$store.state.user
			}
		},
		async mounted(){

			this.$store.dispatch('setLoading',true)

			await this.search()

			this.$store.dispatch('setLoading',false)
		},
		methods:{
			async search(){

				this.loading = true

				const { data } = await API.show.getShops(this.param)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				this.loading = false

				if (data.data.length<this.param.rows) {

					this.hasMore = false
				}

				this.param.page++

				this.items.push(...data.data)

			},
			async reset(){

				this.items = []

				this.param.page = 1

				this.search()

			},
			async logout(){

				setToken(null)

				this.showUserAction = false

				this.$store.dispatch('getUser')
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss";
	.page-frame{
		position: relative;
		.home-banner{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			.banner-frame{
				position: relative;
				.banner-account{
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					z-index: 2;
					color: #ffffff;
					padding: 10px 20px;
					.web-logo{
						font-size: 20px;
						color: #fc6923;
					}
					.web-account{
						font-size: 14px;
					}
				}
				.banner-mask{
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: rgba(0,0,0,.3);
					z-index: 1;
				}
			}
		}
		.home-body{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100vh;
			overflow: auto;
			z-index: 5;
			.body-banner{
				height: 20vh;
			}
			.body-content{
				min-height: 80vh;
				background: #f7f7f7;
				border-radius: 20px;
				overflow: hidden;
			}
		}
		.home-service-frame{
			width: 100%;
			overflow: auto;
			.service-item{
				min-width: 80px;
				padding: 10px;
				font-weight: bold;
			}
		}
		.home-shops-frame{
			.home-shops-title{
				font-size: 16px;
				font-weight: bold;
				color: black;
				text-align: left;
				padding: 0 10px;
				margin-top: 10px;
			}
			background: #f7f7f7;
		}
	}
	.user-action-frame{
		padding: 0 5px 5px 5px;
		.user-action-item{
			margin-top: 10px;
			cursor: pointer;
			font-size: 14px;
			&:hover{
				color: #fc6923;
			}
		}
	}
</style>