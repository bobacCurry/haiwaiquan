<template>
	<div class="page-frame">
		<div class="page-banner" :style="{ 'background-image': 'url('+shop.back+')' }">
			<div class="banner-content">
				<Header/>
				<div class="shop-base-frame row-between-center">
					<div class="shop-base-info row-start-center">
						<VanImage :src="shop.logo" fit="cover" round width="80" height="80"/>
						<div class="shop-info">
							<div class="shop-name">
								<b>{{ shop.name }}</b>
							</div>
							<div class="shop-rate">
								<Rate v-model="shop.rate" allow-half void-icon="star" size="14" color="#ffd21e" readonly void-color="#eee"/>
							</div>
						</div>
						<div class="shop-follow">
							<div>
								<Icon name="like-o" size="20" v-if="!follow"/>
								<Icon name="like" size="20" color="#fc6923" v-else/>
							</div>
							<div :class="[follow?'follow':'']"><b>{{follow?'取消':'关注'}}</b></div>
						</div>
					</div>
					<div class="shop-extra-info row-start-top">
						<div class="extra-info-frame">
							<div><b>起送价</b></div>
							<div class="extra-info-value"><b>{{ shop.minprice }}{{shop.currency}}</b></div>
						</div>
						<div class="extra-info-frame">
							<div><b>配送方式</b></div>
							<div class="extra-info-value">
								<Tag type="success" v-for="(item,key) in shop.delivery" :key="key" class="tags">{{ DELIVERY[item] }}</Tag>
							</div>
						</div>
						<div class="extra-info-frame">
							<div><b>付款方式</b></div>
							<div class="extra-info-value">
								<Tag type="success" v-for="(item,key) in shop.payment" :key="key" class="tags">{{ PAYMENT[item] }}</Tag>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="banner-mask">
			</div>
		</div>
		<div class="shop-tag-frame">
			<div class="zone-frame row-start-center">
				<div :class="['shop-tag-item',active===0?'active':'']" @click="active=0"><b>所有商品</b></div>
				<div :class="['shop-tag-item',active===1?'active':'']" @click="active=1"><b>商家信息</b></div>
				<div :class="['shop-tag-item',active===2?'active':'']" @click="active=2"><b>用户点评</b></div>
			</div>
		</div>
		<div class="base-frame row-between-top">
			<div class="base-frame-left">
				<div class="shop-goods-frame" v-if="active===0">
					<div class="shop-class-list row-start-center">
						<div v-for="(item,key) in classList" :key="key" :class="['shop-class-item',class_active===item._id?'active':'']" @click="class_active=item._id">
							<b>{{ item.name }}</b>
						</div>
					</div>
					<div class="shop-goods-list row-between-top">
						<div class="shop-goods-item row-between-top" v-for="(item,key) in classGoodsList" :key="key">
							<VanImage :src="item.pics" fit="cover" width="40%" height="110px"/>
							<div class="goods-info">
								<div class="goods-name"><b>{{ item.code }}</b> <b>{{ item.name }}</b></div>
								<div class="goods-tags">
									<Tag type="success" v-for="(tag,key1) in item.tags" :key="key1" class="tags">{{ tag }}</Tag>
									<Tag type="danger" class="tags" v-if="item.stop">已售完</Tag>
								</div>
								<div class="row-between-center">
									<div class="goods-price"><b>{{ item.price }}{{shop.currency}}</b></div>
									<div class="order-action row-start-center" v-if="!ordering">
										<div class="order-sub" @click="order(item, false)">-</div>
										<div class="order-num">{{orderList[item._id]?orderList[item._id]['count']:0}}</div>
										<div class="order-add" @click="order(item, true)">+</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="shop-info-frame" v-if="active===1">
					<h1>店铺照片</h1>
					<div class="shop-pics-list row-start-center">
						<div class="shop-pics-item" v-for="(item,key) in shop.pics" :key="key">
							<VanImage :src="item" fit="cover" width="100%" height="100%"/>
						</div>
					</div>
					<div class="shop-info-item row-start-center">
						<Icon name="map-marked" size="22"/>
						<div class="shop-info-text">店铺地址：{{shop.city}} - {{shop.address}}</div>
					</div>
					<div class="shop-info-item row-start-center">
						<Icon name="underway" size="22"/>
						<div class="shop-info-text">营业时间：{{shop.stime}} - {{shop.etime}}</div>
					</div>
					<br/><br/>
					<h1>联系方式</h1>
					<div class="shop-info-item row-start-center" v-if="shop.phone">
						<Icon name="phone" size="22"/>
						<div class="shop-info-text">商家电话：{{ shop.phone }}</div>
					</div>
					<div class="shop-info-item row-start-center" v-if="shop.wechat">
						<Icon name="wechat" size="22"/>
						<div class="shop-info-text">商家微信：{{ shop.wechat }}</div>
					</div>
					<div class="shop-info-item row-start-center" v-if="shop.telegram">
						<VanImage src="/img/telegram.svg" fit="cover" width="20px" height="20px"/>
						<div class="shop-info-text">商家飞机：<a :href="'https://t.me/'+shop.telegram" target="_blank">{{ shop.telegram }}</a></div>
					</div>
				</div>
				<div class="shop-comment-frame" v-if="active===2">
					333
				</div>
			</div>
			<div class="base-frame-right">
				<div class="shop-notice-title"><b>商家公告</b></div>
				<div class="shop-discount-frame">
					<div class="title"><b>优惠</b></div>
					<div class="list row-start-top" v-for="(item,key) in shop.discount">
						<div>{{ key + 1 }}. </div><div class="discount-text">{{ item }}</div>
					</div>
					<div class="list" v-if="!shop.discount.length">
						暂无优惠信息
					</div>
				</div>
				<div class="shop-notice-frame">
					<div class="title"><b>公告</b></div>
					<div class="list">
						{{ shop.notice }}
					</div>
				</div>
			</div>
			<div class="shopping-cart" @click="showCart=true">
				<Badge :content="orderCount">
					<VanImage src="/img/shop/shopping-cart.png" fit="cover" width="60px" height="60px"/>
				</Badge>
			</div>
			<Overlay :show="showCart" @click="showCart=false">
				<div class="row-center-center">
				    <div class="order-info-frame" @click.stop>
				    	<div class="order-base">
				    		<p>请选择收货地址:</p>
				    	</div>
				    	<div class="order-base row-between-center">
				    		<p>请选择配送方式:</p>				    		
			    			<RadioGroup v-model="payment">
			    				<div class="row-start-center">
			    					<div class="order-payment" v-for="(item,key) in shop.payment">
					    				<Radio :name="item">{{ PAYMENT[item] }}</Radio>
					    			</div>
				    			</div>
			    			</RadioGroup>
				    	</div>
				    	<div class="order-list">
				    		<div v-for="(item,key) in orderList" :key="key" class="row-between-top">
				    			<div class="order-item row-start-top">
				    				<div class="order-item-pics">
					    				<VanImage :src="item.info.pics" fit="cover" width="100px" height="60px"/>
					    			</div>
				    				<div class="order-item-name">
				    					{{ item.info.code }} {{ item.info.name }} * {{ item.count }}
				    				</div>
				    			</div>
				    			<div>
				    				{{ item.amount }}{{ shop.currency }}
				    			</div>
				    		</div>
				    	</div>
				    	<div class="order-memo">
				    		<Field v-model="memo" rows="5" autosize label="客户备注" type="textarea" maxlength="150" placeholder="可备注您的要求，比如口味，忌口等" show-word-limit/>
				    	</div>
				    	<div class="order-create row-between-center">
				    		<div class="order-amount">
				    			<b>商品总计： {{ orderAmount }}{{ shop.currency }}</b>
				    		</div>
				    		<div>
				    			<Button round type="info" style="width: 150px" :disabled="!orderAmount||orderAmount<shop.minprice">生成订单</Button>
				    		</div>
				    	</div>
				    </div>
				</div>
			</Overlay>
		</div>
	</div>
</template>
<script>
	import Header from '_common/PC/Header'
	import { Image as VanImage, Rate, Tag, Icon, Badge, Overlay, Field, Button, RadioGroup, Radio } from 'vant'
	import { SERVICETYPE, PAYMENT, DELIVERY } from '_config/shop'
	export default {
		name: 'Shop',
		components:{ VanImage, Rate, Header, Tag, Icon, Badge, Overlay, Field, Button, RadioGroup, Radio },
		async mounted(){

		},
		data(){
			return {
				PAYMENT,
				DELIVERY,
				active:0,
				shop:{
					type: 1,
					name:'甜栗小酒馆',
					logo:'https://i.pinimg.com/originals/48/78/6d/48786db88c95237f6e0b375dc991448a.png',
					back:'/img/shop/shopback.png',
					pics:[
						'http://5b0988e595225.cdn.sohucs.com/images/20200321/764f13c8e5d240ccbda9a8204200554c.jpeg',
						'http://5b0988e595225.cdn.sohucs.com/images/20200321/f361690db25a4a2dafdd81b84278143c.jpeg',
						'https://a.ksd-i.com/a/2020-03-07/124889-821557.jpg'
					],
					brief:'新店开张，欢迎光临！',
					rate:4.5,
					stime:'08:00',
					etime:'23:00',
					payment:[0,1],
					delivery:[0,1],
					minprice:5000,
					currency:'P',
					city:'makati',
					address:'서울 용산구 이태원동 57-28 1층',
					notice:'感谢大家支持！',
					discount:['首单减20','LP03 肉末双椒炒泡面（辣）原价200,8.8折优惠','加辣请拍原价70,7.1折优惠','满1000返50P券'],
					phone:'630776889112',
					wechat:'wawa997',
					telegram:'guevaratech',
					follow:50,
					view:1000
				},
				classList: [
					{ _id:'1', name:'推荐' },
					{ _id:'2', name:'新品' },
					{ _id:'3', name:'荤类' },
					{ _id:'4', name:'素类' }
				],
				goodsList: [
					{ _id:'sdsadas01',classid:['1'], code:'s01', name:'美食01', pics:'http://ifeidu.oss-cn-hongkong.aliyuncs.com/upload/goods/20200130/1580355914.jpg', price:'2000', count:'1', unit:'份', tags: ['新品','推荐'], stop: false },
					{ _id:'sdsadas02',classid:['1'], code:'s02', name:'美食02', pics:'http://ifeidu.oss-cn-hongkong.aliyuncs.com/upload/goods/20200130/1580355812.jpg', price:'2000', count:'1', unit:'份', tags: ['新品'], stop: false },
					{ _id:'sdsadas03',classid:['1'], code:'s03', name:'美食03', pics:'http://ifeidu.oss-cn-hongkong.aliyuncs.com/upload/goods/20190628/1561700190.jpg', price:'2000', count:'1', unit:'份', tags: [], stop: true },
					{ _id:'sdsadas04',classid:['2'], code:'s04', name:'美食04', pics:'http://ifeidu.oss-cn-hongkong.aliyuncs.com/upload/goods/20190628/1561699989.jpg', price:'2000', count:'1', unit:'份', tags: [], stop: false },
					{ _id:'sdsadas05',classid:['2'], code:'s05', name:'美食05', pics:'http://ifeidu.oss-cn-hongkong.aliyuncs.com/upload/goods/20201123/1606115897.jpg', price:'2000', count:'1', unit:'份', tags: ['新品'], stop: false },
					{ _id:'sdsadas06',classid:['3'], code:'s06', name:'美食06', pics:'http://ifeidu.oss-cn-hongkong.aliyuncs.com/upload/goods/20201023/1603428399.jpg', price:'2000', count:'1', unit:'份', tags: [], stop: false },
					{ _id:'sdsadas07',classid:['3'], code:'s07', name:'美食07', pics:'http://ifeidu.oss-cn-hongkong.aliyuncs.com/upload/goods/20190627/1561624271.jpg', price:'2000', count:'1', unit:'份', tags: ['新品'], stop: true },
					{ _id:'sdsadas08',classid:['3'], code:'s08', name:'美食08', pics:'http://ifeidu.oss-cn-hongkong.aliyuncs.com/upload/goods/20201121/1605933529.jpg', price:'2000', count:'1', unit:'份', tags: ['推荐'], stop: false },
					{ _id:'sdsadas09',classid:['4'], code:'s09', name:'美食09', pics:'http://ifeidu.oss-cn-hongkong.aliyuncs.com/upload/goods/20210315/1615776105.jpg', price:'2000', count:'1', unit:'份', tags: ['新品'], stop: true },
					{ _id:'sdsadas10',classid:['4'], code:'s10', name:'美食10', pics:'http://ifeidu.oss-cn-hongkong.aliyuncs.com/upload/goods/20190701/1561958052.jpg', price:'2000', count:'1', unit:'份', tags: ['新品'], stop: false },
					{ _id:'sdsadas11',classid:['4'], code:'s11', name:'美食11', pics:'http://ifeidu.oss-cn-hongkong.aliyuncs.com/upload/goods/20190628/1561702115.jpg', price:'2000', count:'1', unit:'份', tags: ['推荐'], stop: true },
					{ _id:'sdsadas12',classid:['4'], code:'s12', name:'美食12', pics:'http://ifeidu.oss-cn-hongkong.aliyuncs.com/upload/goods/20190116/1547645162.jpeg', price:'2000', count:'1', unit:'份', tags: ['新品'], stop: false },
					{ _id:'sdsadas13',classid:['4'], code:'s13', name:'美食13', pics:'http://ifeidu.oss-cn-hongkong.aliyuncs.com/upload/goods/20190829/1567062532.jpg', price:'2000', count:'1', unit:'份', tags: ['新品'], stop: true },
					{ _id:'sdsadas14',classid:['4'], code:'s14', name:'美食14', pics:'http://ifeidu.oss-cn-hongkong.aliyuncs.com/upload/goods/20201204/1607058107.jpg', price:'2000', count:'1', unit:'份', tags: [], stop: false },
				],
				follow: false,
				class_active:'1',
				ordering:false,
				showCart:false,
				orderList:{},
				memo:'',
				payment:''
			}
		},
		computed:{
			classGoodsList(){

				const goodsList = this.goodsList.filter((item,key)=>{

					if (item.classid.indexOf(this.class_active) !==-1 ) {

						return true
					}

					return false

				})

				return goodsList
			},
			orderCount(){

				let count = 0

				this.ordering

				for (let _id in this.orderList) {

					count += this.orderList[_id].count
				}

				return count
			},
			orderAmount(){
				
				let amount = 0

				this.ordering

				for (let _id in this.orderList) {

					amount += this.orderList[_id].amount
				}

				return amount
			}
		},
		methods:{
			async order(item, add){

				this.ordering = true

				if (!this.orderList[item._id]) {

					this.orderList[item._id] = { count: 0, amount: 0, info: {} }
				}

				if (add) {

					this.orderList[item._id]['count'] = this.orderList[item._id]['count'] + 1

					this.orderList[item._id]['amount'] = this.orderList[item._id]['count']*item.price

					this.orderList[item._id]['info'] = { name: item.name, code: item.code, pics: item.pics  }

				}else{

					if (this.orderList[item._id]['count'] <= 1) {

						delete this.orderList[item._id]

						this.ordering = false

						return
					}

					this.orderList[item._id]['count'] = this.orderList[item._id]['count'] - 1

					this.orderList[item._id]['amount'] = this.orderList[item._id]['count']*item.price

					this.orderList[item._id]['info'] = { name: item.name, code: item.code, pics: item.pics  }

				}

				this.ordering = false
			},
			async getShop(){

			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss";
	.page-frame{
		background: $PAGEBACKGROUND;
		min-height: 100vh;
		.page-banner{
			@extend .common-background;
			width: 100%;
			height: 250px;
			position: relative;
			.banner-mask{
				@extend .mask;
			}
			.banner-content{
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				z-index: 1;
			}
		}
		.base-frame{
			width: 100%;
			padding: 30px 120px;
			min-height: 80vh;
		}
		.zone-frame{
			padding: 30px 120px;
			background: $ZONEBACKGROUND;
		}
		.shop-base-frame{
			margin-top: 20px;
			padding: 10px 100px;
			color: $BASECOLOR;
			.shop-base-info{
				.shop-info{
					margin-left: 20px;
					text-align: left;
					.shop-name{
						font-size: 26px;
					}	
					.shop-rate{
						margin-top: 10px;
					}
				}
				.shop-follow{
					margin-left: 20px;
					cursor: pointer;
					font-size: 14px;
					.follow{
						color: #fc6923;
					}
				}
			}
			.shop-extra-info{
				.extra-info-frame{
					width: 200px;
					.extra-info-value{
						margin-top: 10px;
						padding: 0 5px;
					}
				}
				.tags{
					margin-right: 5px;
				}
			}
		}
		.shop-tag-frame{
			.shop-tag-item{
				width: 100px;
				cursor: pointer;
				text-align: left;
				&.active{
					color: #fc6923;
				}
			}
		}
		.base-frame-left{
			width: 70%;
		}
		.base-frame-right{
			width: 25%;
			height: 100px;
			background: $ZONEBACKGROUND;
			.shop-notice-title{
				height: 40px;
				line-height: 40px;
				background: $ACTIVECOLOR;
				color: $BASECOLOR;
			}
			.shop-discount-frame{
				@extend .border-line;
				.list{
					color: red;
					.discount-text{
						padding-left: 5px;
					}
				}
			}
			.shop-notice-frame,.shop-discount-frame{
				padding: 10px 20px;
				text-align: left;				
				background: $ZONEBACKGROUND;
				font-size: 14px;
				.title{
					font-size: 18px;
				}
				.list{
					line-height: 30px;
				}
			}
		}
		.shop-goods-frame,.shop-info-frame,.shop-comment-frame{
			text-align: left;
		}
		.shop-goods-frame{
			.shop-class-list{
				background: $ZONEBACKGROUND;
				padding: 20px;
				flex-wrap: wrap;
			}
			.shop-class-list{
				.shop-class-item{
					width: 20%;
					padding: 0 10px;
					height: 40px;
					line-height: 40px;
					cursor: pointer;
					&.active{
						background: $ACTIVECOLOR;
						color: $BASECOLOR;
						&:hover{
							background: $ACTIVECOLOR;
							color: $BASECOLOR;
						}
					}
					&:hover{
						background: $PAGEBACKGROUND;
						color: $ACTIVECOLOR;
					}
				}
			}
			.shop-goods-list{
				margin-top: 20px;
				flex-wrap: wrap;
				.shop-goods-item{
					width: 49%;
					height: 130px;
					padding: 10px;
					background: $ZONEBACKGROUND;
					margin-bottom: 10px;
					.goods-info{
						width: 55%;
						.goods-name{
							font-size: 18px;
						}
						.goods-tags{
							min-height: 50px;
							.tags{
								margin-right: 5px;
							}
						}
						.goods-price{
							font-size: 18px;
							color: $ACTIVECOLOR;
						}
						.order-action{
							text-align: center;
							.order-sub{
								width: 40px;
								height: 30px;
								line-height: 30px;
								border: 1px solid #dcdcdc;
								border-radius: 15px 0 0 15px;
								cursor: pointer;
							}
							.order-num{
								width: 40px;
								height: 30px;
								line-height: 30px;
								border-top: 1px solid #dcdcdc;
								border-bottom: 1px solid #dcdcdc;
							}
							.order-add{
								width: 40px;
								height: 30px;
								line-height: 30px;
								border: 1px solid #dcdcdc;
								border-radius: 0 15px 15px 0;
								cursor: pointer;
							}
						}
					}
				}
			}
		}
		.shop-info-frame{
			background: $ZONEBACKGROUND;
			padding:20px;
			.shop-pics-list{
				flex-wrap: wrap;
				.shop-pics-item{
					width: 25%;
					height: 150px;
					padding: 5px 5px 5px 0;
				}
			}
			.shop-info-item{
				margin-top: 20px;
				.shop-info-text{
					margin-left: 10px;
					a{
						color: #fc6923;
					}
				}
			}
		}
		.shop-comment-frame{
			
		}
		.shopping-cart{
			position: fixed;
			left: 30px;
			bottom: 30px;
			cursor: pointer;
		}
		.order-info-frame{
			margin-top: 100px;
			width: 600px;
			height: 500px;
			padding: 20px;
			background: $PAGEBACKGROUND;
			overflow-y: auto;
			text-align: left;
			.order-base,.order-list,.order-create{
				background: $ZONEBACKGROUND;
				border-radius: 5px;
				padding: 20px;
				margin-bottom: 10px;
			}
			.order-base{
				.order-payment{
					margin-left: 10px;
				}
			}
			.order-list{
				.order-item{
					margin-bottom: 10px;
					.order-item-pics{
						height: 60px;
						width: 100px;
						border-radius: 5px;
						overflow: hidden;
					}
					.order-item-name{
						padding-left: 10px;
					}
				}
				.order-amount{
					text-align: right;
					margin-top: 20px;
				}
			}
			.order-memo{
				border-radius: 5px;
				overflow: hidden;
				margin-bottom: 10px;
			}
			.order-create{

			}
		}
	}
</style>