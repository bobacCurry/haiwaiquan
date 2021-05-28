<template>
	<div :class="['banner-header',trans?'banner-header-trans':'']">
		<div class="banner-header-content row-between-center">
			<div class="logo-frame row-start-center" @click="$router.push('/')">
				<VanImage src="/img/logo.png" fit="cover" width="50" height="50"/>
				<div class="logo-slogan">海外圈</div>
			</div>
			<div class="account" v-if="!user">
				<span><a @click="$store.dispatch('setAccount','login')">登陆</a></span> 
				/ 
				<span><a @click="$store.dispatch('setAccount','register')">注册</a></span>
			</div>
			<div  class="user-frame" @click.stop v-else>
				<Popover v-model="showUserAction" :close-on-click-outside="true" trigger="click">
					<div class="user-action-frame">
						<div class="user-action-item" @click="$router.push('/user/0')">用户中心</div>
						<div class="user-action-item" @click="logout()">退出登录</div>
					</div>
					<template #reference>
						<div class="row-center-center">
					    	<VanImage :src="user.avatar" fit="cover" width="50" height="50" round/>
							<div class="username">
								<b>{{user.name}}</b>
							</div>
						</div>
				  	</template>
				</Popover>
			</div>
		</div>
	</div>
</template>
<script>
	import { Image as VanImage, Rate, Popover } from 'vant'
	import { setToken, getToken } from '@/libs/util'
	export default {
		name: 'Header',
		components:{ VanImage, Rate, Popover },
		computed:{
			user(){
				return this.$store.state.user
			},
			trans(){
				
				if (['Home','Shop'].indexOf(this.$route.name)!==-1) {

					return true
				}
				
				return false
			}
		},
		data(){
			return {
				showUserAction: false
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
	.banner-header,.banner-header-trans{
		padding: 10px 100px;
		background: $BASEBACKGROUND;
		.banner-header-content{
			color: $DARKCOLOR;
			.logo-frame{
				cursor: pointer;
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
			.user-frame{
				cursor: pointer;
				.username{
					margin-left: 10px;
				}
			}
		}
	}
	.banner-header-trans{
		background: rgba(0,0,0,0);
		.banner-header-content{
			color: $BASECOLOR;
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