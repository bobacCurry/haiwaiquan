<template>
	<div class="page-frame">
		<div class="home-banner">			
			<div class="banner-content">
				<Header/>
				<div class="banner-brief">
					海外圈，海外生活不陌生
				</div>
				<div class="banner-body row-center-center">
					<div class="banner-body-content row-between-center">
						<div class="search-frame">
							<input placeholder="搜索相关服务" />
						</div>
						<div class="search-button">
							搜索
						</div>
					</div>
				</div>
			</div>
			<div class="banner-mask"></div>
		</div>
		<div class="home-body">
			<div class="home-service-frame row-between-center">
				<div class="service-item" v-for="(item,key) in SERVICETYPE" :key="key" @click="$router.push(`/service/${key+1}`)">
					<VanImage :src="item.icon" fit="cover" width="60" height="60"/>
					<div>{{ item.name }}</div>
				</div>
			</div>
			<div class="home-shops-frame">
				<ShopList :type="0"/>
			</div>
		</div>
	</div>
</template>
<script>
	import Header from '_common/PC/Header'
	import ShopList from '_common/PC/ShopList'
	import { setToken, getToken } from '@/libs/util'
	import { Image as VanImage, Rate, Popover } from 'vant'
	import { SERVICETYPE, PAYMENT, DELIVERY } from '_config/shop'
	export default {
		name: 'Home',
		components:{ VanImage, Rate, Popover, ShopList, Header },
		computed:{
			user(){
				return this.$store.state.user
			}
		},
		data(){
			return {
				SERVICETYPE,
				PAYMENT,
				DELIVERY,
				showUserAction: false,
			}
		},
		methods:{

			logout(){

				setToken(null)

				this.showUserAction = false

				this.$store.dispatch('getUser')
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss"; 
	.home-banner{
		width: 100%;
		height: 350px;
		position: relative;
		background-image: url('../../assets/img/home/banner_bg.jpeg') ;
		@extend .common-background;
		padding: 30px;
		.banner-content{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			// .banner-header{
			// 	padding: 10px 100px;
			// 	.banner-header-content{
			// 		color: #ffffff;
			// 		.logo-frame{
			// 			.logo-slogan{
			// 				font-size: 25px;
			// 				margin-left: 15px;
			// 			}
			// 		}
			// 		.account{
			// 			a{
			// 				cursor: pointer;
			// 				font-weight: bold;
			// 				&:hover{
			// 					color: $ACTIVECOLOR;
			// 				}
			// 			}
			// 		}
			// 		.user-frame{
			// 			cursor: pointer;
			// 			.username{
			// 				margin-left: 10px;
			// 			}
			// 		}
			// 	}
			// }
			.banner-brief{
				font-size: 40px;
				font-weight: bold;
				text-align: center;
				color: $BASECOLOR;
				margin-top: 30px;
			}
			.banner-body{
				.banner-body-content{
					margin-top: 50px;
					width: 700px;
					.search-frame{
						width: 600px;
						height: 50px;
						background: $BASEBACKGROUND;
						padding: 0 20px;
						input{
							width: 100%;
							height: 100%;
							border: 0;
						}
					}
					.search-button{
						width: 100px;
						height: 50px;
						line-height: 50px;
						color: $BASECOLOR;
						background: $ACTIVECOLOR;
					}
				}
			}
		}
		.banner-mask{
			@extend .mask;
		}
	}
	.home-body{
		padding: 30px 120px;
		.home-service-frame{
			width: 100%;
			.service-item{
				min-width: 140px;
				padding: 20px;
				cursor: pointer;
				font-weight: bold;
				&:hover{
					background: #f7f7f7;
				}
			}
		}
		.home-shops-frame{
			margin-top: 30px;
			text-align: left;
			min-height: 300px;
		}
	}
	.user-action-frame{
		padding: 0 20px 20px 20px;
		.user-action-item{
			margin-top: 20px;
			cursor: pointer;
			&:hover{
				color: #fc6923;
			}
		}
	}
</style>