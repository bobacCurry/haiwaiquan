<template>
	<div class="page-frame">
		<Header title="个人中心"/>
		<div class="page-body">
			<div class="block-frame">
				<div class="block-item-frame row-between-center">
					<div :class="['block-item',active===0?'block-item-active':'']" @click="$router.push('/user/0')">
						<VanImage src="/img/mobile/user/info.png" width="50" height="50" fit="cover"/>
						<div><b>账号信息</b></div>
					</div>
					<div :class="['block-item',active===1?'block-item-active':'']" @click="$router.push('/user/1')">
						<VanImage src="/img/mobile/user/address.png" width="50" height="50" fit="cover"/>
						<div><b>地址管理</b></div>
					</div>
					<div :class="['block-item',active===2?'block-item-active':'']" @click="$router.push('/user/2')">
						<VanImage src="/img/mobile/user/order.png" width="50" height="50" fit="cover"/>
						<div><b>订单管理</b></div>
					</div>
					<div :class="['block-item',active===3?'block-item-active':'']" @click="$router.push('/user/3')">
						<VanImage src="/img/mobile/user/follow.png" width="50" height="50" fit="cover"/>
						<div><b>我的关注</b></div>
					</div>
					<div :class="['block-item',active===4?'block-item-active':'']" @click="$router.push('/user/4')">
						<VanImage src="/img/mobile/user/shop.png" width="50" height="50" fit="cover"/>
						<div><b>我的店铺</b></div>
					</div>
				</div>
			</div>
			<div v-if="active===0">
				<UserBaseInfo/>
			</div>
			<div v-if="active===1">
				<UserAddressInfo/>
			</div>
			<div v-if="active===2">
				<UserOrderInfo/>
			</div>
			<div v-if="active===3">
				<UserFollowInfo/>
			</div>
			<div v-if="active===4">
				<UserShopInfo/>
			</div>
		</div>
	</div>
</template>
<script>
	import Header from '_common/MB/Header'
	import UserBaseInfo from '_common/MB/UserBaseInfo'
	import UserAddressInfo from '_common/MB/UserAddressInfo'
	import UserOrderInfo from '_common/MB/UserOrderInfo'
	import UserFollowInfo from '_common/MB/UserFollowInfo'
	import UserShopInfo from '_common/MB/UserShopInfo'
	import { Image as VanImage, Tag, Button, Field, Icon, Notify } from 'vant'
	import API from '_api'
	export default {
		name: 'User',
		components:{ Header, UserBaseInfo, UserAddressInfo, UserOrderInfo, UserFollowInfo, UserShopInfo, VanImage },
		data(){
			return {
				active: 0
			}
		},
		async mounted(){
			
			this.active = Number(this.$route.params.active)
		},
		methods:{

		}
	}
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss";
	.page-frame{
		background: $PAGEBACKGROUND;
		min-height: 100vh;
		overflow: auto;
		.page-body{
			padding: 10px;
			.block-frame{
				width: 100%;
				overflow: auto;
				font-size: 14px;
				.block-item-frame{
					width: 480px;
					@extend .nowrap;
					.block-item{
						width: 90px;
						padding: 10px;
						background: #ffffff;
						border-radius: 5px;
					}
					.block-item-active{
						color: #fc6923;
					}
				}
			}
		}
	}
</style>