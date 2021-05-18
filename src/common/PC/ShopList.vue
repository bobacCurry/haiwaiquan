<template>
	<div>
		<h1>{{ title }}</h1>
		<div class="home-shop-list-frame row-start-center">
			<div class="home-shop-item-frame row-between-center" v-for="(item,key) in list" :key="key" @click="$router.push(`/shop/${item._id}`)">
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
	</div>
</template>
<script>
	import { Image as VanImage, Rate, Tag } from 'vant'
	import { SERVICETYPE, PAYMENT, DELIVERY } from '_config/shop'
	export default {
		name: 'ShopList',
		components:{ VanImage, Rate, Tag },
		props:['type'],
		data(){
			return {
				list:[
					{ _id:'5fc27d6ba382fcfd076fd293', name:'老沈阳',logo:'https://image.shutterstock.com/image-vector/restaurant-logo-template-260nw-1254530365.jpg',brief:'梨泰院class',rate:5,stime:'08:00',etime:'23:00',payment:[0,1],delivery:[0,1],minprice:1500,city:'makati' },
					{ _id:'5fc27d6ba382fcfd076fd293', name:'甜栗',logo:'https://i.pinimg.com/originals/48/78/6d/48786db88c95237f6e0b375dc991448a.png',brief:'梨泰院class',rate:2.6,stime:'08:00',etime:'23:00',payment:[0,1],delivery:[0,1],minprice:1500,city:'makati' },
					{ _id:'5fc27d6ba382fcfd076fd293', name:'长家',logo:'https://i.pinimg.com/originals/90/a9/46/90a946e81ab666c160db11927f0e37d2.jpg',brief:'梨泰院class',rate:4,stime:'08:00',etime:'23:00',payment:[0,1],delivery:[0,1],minprice:1500,city:'makati' },
					{ _id:'5fc27d6ba382fcfd076fd293', name:'风味',logo:'https://cdn5.vectorstock.com/i/1000x1000/39/69/restaurant-logo-or-label-emblems-for-menu-design-vector-21433969.jpg',brief:'梨泰院class',rate:5,stime:'08:00',etime:'23:00',payment:[0,1],delivery:[0,1],minprice:1500,city:'makati' },
					{ _id:'5fc27d6ba382fcfd076fd293', name:'刘一手',logo:'https://mir-s3-cdn-cf.behance.net/project_modules/1400/a3d9c380154005.5cd97019e2a77.png',brief:'梨泰院class',rate:3.5,stime:'08:00',etime:'23:00',payment:[1],delivery:[0,1],minprice:1500,city:'makati' },
					{ _id:'5fc27d6ba382fcfd076fd293', name:'甜栗',logo:'https://i.ytimg.com/vi/AUml2IgSFCQ/maxresdefault.jpg',brief:'梨泰院class',rate:5,stime:'08:00',etime:'23:00',payment:[0,1],delivery:[0,1],minprice:1500,city:'makati' },
				]
			}
		},
		computed:{
			title(){

				let title = '商家列表'

				if (SERVICETYPE[this.type-1]) {

					title = SERVICETYPE[this.type-1].name + title
				}

				return title
			}
		},
		mounted(){
			
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
</style>