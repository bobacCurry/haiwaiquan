<template>
	<div>
		<h1>{{ title }}</h1>
		<div class="home-shop-list-frame row-start-center">
			<div class="home-shop-item-frame row-between-center" v-for="(item,key) in items" :key="key" @click="$router.push(`/shop/${item._id}`)">
				<div class="shop-logo">
					<VanImage :src="item.logo" width="100%" height="100%" fit="cover"/>
				</div>
				<div class="shop-info">
					<div class="row-between-center">
						<div class="shop-name omit">{{ item.name }}</div>
						<div class="shop-city">{{ item.city }}</div>
					</div>
					<div class="shop-rate">
						<Rate v-model="item.rate" allow-half void-icon="star" size="14" color="#ffd21e" readonly void-color="#eee"/>
					</div>
					<div class="shop-time">营业时间：{{ item.stime }} - {{ item.etime }}</div>
					<div class="shop-minprice">最低配送：{{ item.minprice }}P</div>
					<div class="shop-brief omit">{{ item.brief }}</div>
					<div class="shop-delivery-payment">
						<Tag type="success" v-if="item.payment.indexOf(0)!==-1">支持到付</Tag>
					</div>
				</div>
			</div>
		</div>
		<div class="get-more row-center-center" v-if="hasMore">
			<Button round type="primary" style="width: 150px" :loading="loading" @click="$emit('search')">查看更多</Button>
		</div>
	</div>
</template>
<script>
	import { Image as VanImage, Rate, Tag, Button } from 'vant'
	import { SERVICETYPE, PAYMENT, DELIVERY } from '_config/shop'
	export default {
		name: 'ShopList',
		components:{ VanImage, Rate, Tag, Button },
		props:['type', 'items', 'loading', 'hasMore'],
		computed:{
			title(){

				let title = '商家列表'

				if (SERVICETYPE[this.type-1]) {

					title = SERVICETYPE[this.type-1].name + title
				}

				return title
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss";
	.home-shop-list-frame{
		width: 100%;
		flex-wrap: wrap;
		.home-shop-item-frame{
			width: 25%;
			height: 150px;
			margin-top: 10px;
			border: 1px solid #f7f7f7;
			padding: 10px;
			cursor: pointer;
			&:hover{
				background: #f7f7f7;
			}
			.shop-logo{
				width: 40%;
				height: 100px;
			}
			.shop-info{
				width: 55%;
				height: 130px;
				font-size: 12px;
				.shop-name{
					font-size: 16px;
					font-weight: bold;
					width: 100px;
				}
				.shop-minprice,.shop-brief,.shop-delivery-payment{
					margin-top: 5px;
				}
			}
		}
	}
	.get-more{
		margin-top: 30px;
	}
</style>