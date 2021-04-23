<template>
	<div class="page-frame">
		<div class="home-banner">			
			<div class="banner-content">
				<div class="banner-header">
					<div class="banner-header-content row-between-center">
						<div class="logo-frame row-start-center">
							<VanImage src="/img/logo.png" fit="cover" width="50" height="50"/>
							<div class="logo-slogan">海外生活圈</div>
						</div>
						<div class="account">
							<span><a>登陆</a></span> / <span><a>注册</a></span>
						</div>
					</div>
				</div>
				<div class="banner-brief">
					海外圈，海外生活不陌生
				</div>
				<div class="banner-body row-center-center">
					<div class="banner-body-content row-between-center">
						<div class="search-frame">
							<input placeholder="搜索当地服务" />
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
				<div :class="['service-item',active===key?'active':'']" @click="active=key" v-for="(item,key) in SERVICE_CATS" :key="key">
					<VanImage :src="item.icon" fit="cover" width="60" height="60"/>
					<div>{{ item.name }}</div>
				</div>
			</div>
			<div class="home-shops-frame">
				<h1>推荐商家</h1>
				<div>
					
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { Image as VanImage } from 'vant'
	import { SERVICE_CATS } from '_config/service'
	export default {
		name: 'Home',
		components:{ VanImage },
		data(){
			return {
				active: 0,
				SERVICE_CATS
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
			.banner-header{
				padding: 10px 100px;
				.banner-header-content{
					color: #ffffff;
					.logo-frame{
						.logo-slogan{
							font-size: 25px;
							margin-left: 15px;
						}
					}
					.account{
						a{
							cursor: pointer;
							font-weight: bold;
							&:hover{
								color: $ACTIVECOLOR;
							}
						}
					}
				}
			}
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
						background: $BASECOLOR;
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
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0,0,0,.5);
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
				&.active{
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
</style>