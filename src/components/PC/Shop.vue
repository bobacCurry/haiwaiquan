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
							<div @click="following?unfollow():follow()">
								<Icon name="like-o" size="20" v-if="!following"/>
								<Icon name="like" size="20" color="#fc6923" v-else/>
							</div>
							<div :class="[following?'follow':'']"><b>{{following?'取消':'关注'}}</b></div>
						</div>
					</div>
					<div class="shop-extra-info row-start-top">
						<div class="extra-info-frame">
							<div><b>起送价</b></div>
							<div class="extra-info-value"><b>{{ shop.minprice }} {{CURRENCY[shop.currency]}}</b></div>
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
				<div class="share-frame row-start-center" v-if="shop._id">
					<div>分享至：</div>
					<div class="share-to">
						<ShareNetwork network="Telegram" :url="url" :title="shop.name" :description="shop.brief" hashtags="">
	    					<VanImage src="/img/share/telegram.png" width="30" height="30"/>
						</ShareNetwork>
					</div>
					<div class="share-to">
						<ShareNetwork network="WhatsApp" :url="url" :title="shop.name" :description="shop.brief" hashtags="">
	    					<VanImage src="/img/share/whatsapp.png" width="30" height="30"/>
						</ShareNetwork>
					</div>
					<div class="share-to">
						<ShareNetwork network="Line" :url="url" :title="shop.name" :description="shop.brief" hashtags="">
	    					<VanImage src="/img/share/line.png" width="30" height="30"/>
						</ShareNetwork>
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
				<div class="shop-goods-frame" :style="{ display: active===0?'':'none' }">
					<div class="shop-class-list row-start-center">
						<div v-for="(item,key) in classList" :key="key" :class="['shop-class-item',class_active===item._id?'active':'']" @click="class_active=item._id">
							<b>{{ item.name }}</b>
						</div>
					</div>
					<div class="shop-goods-list row-between-top">
						<div class="shop-goods-item row-between-top" v-for="(item,key) in classGoodsList" :key="key">

							<VanImage :src="item.pics" fit="cover" width="40%" height="130px" lazy-load @click="lookPics(item.pics)"/>
							
							<div class="goods-info">
								<div class="goods-name"><b>{{ item.code }}</b> <b>{{ item.name }}</b></div>
								<div class="goods-tags">
									<Tag type="success" v-for="(tag,key1) in item.tags" :key="key1" class="tags">{{ tag }}</Tag>
									<Tag type="danger" class="tags" v-if="item.stop">已售完</Tag>
								</div>
								<div>
									<div class="goods-price">
										<b>{{ item.price }}{{CURRENCY[shop.currency]}}/{{item.count===1?'':item.count}}{{UNIT[item.unit]}}</b>
									</div>
									<div class="order-action row-start-center" v-if="!ordering&&!item.stop">
										<div class="order-sub" @click="order(item, false)">-</div>
										<div class="order-num">{{orderList[item._id]?orderList[item._id]['count']:0}}</div>
										<div class="order-add" @click="order(item, true)">+</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="shop-info-frame" :style="{ display: active===1?'':'none' }">
					<h1>店铺照片</h1>
					<div class="shop-pics-list row-start-center">
						<div class="shop-pics-item" v-for="(item,key) in shop.pics" :key="key">
							<VanImage :src="item" fit="cover" width="100%" height="100%"/>
						</div>
					</div>
					<div class="shop-info-item row-start-top">
						<Icon name="shop" size="22"/>
					 	<div class="shop-info-text row-start-top">店铺介绍：</div>
						<div style="max-width: 500px">{{shop.brief}}</div>
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
				<div class="shop-comment-frame" :style="{ display: active===2?'':'none' }">
					<Review :shopid="$route.params._id"/>
				</div>
			</div>
			<div class="base-frame-right">
				<div class="shop-notice-title"><b>商家公告</b></div>
				<div class="shop-discount-frame">
					<div class="title"><b>优惠</b></div>
					<!-- <div class="list row-start-top" v-for="(item,key) in shop.discount">
						<div>{{ key + 1 }}. </div><div class="discount-text">{{ item }}</div>
					</div> -->
					<div class="list row-start-top">
						<div class="discount-text">{{ shop.discount }}</div>
					</div>
					<div class="list" v-if="!shop.discount">
						暂无优惠信息
					</div>
				</div>
				<div class="shop-discount-frame">
					<div class="title"><b>平台优惠</b></div>
					<div class="list row-start-top">
						<div class="discount-text">{{ shop.p_discount }}</div>
					</div>
					<div class="list" v-if="!shop.discount">
						暂无平台优惠信息
					</div>
				</div>
				<div class="shop-notice-frame">
					<div class="title"><b>公告</b></div>
					<div class="list">
						{{ shop.notice }}
					</div>
				</div>
			</div>
			<div class="shopping-cart" @click="showCartAtion()">
				<Badge :content="orderCount">
					<VanImage src="/img/shop/shopping-cart.png" fit="cover" width="60px" height="60px"/>
				</Badge>
			</div>
			<Overlay :show="showCart" @click="showCart=false">
				<div class="row-center-center">
				    <div class="order-info-frame" @click.stop>
				    	<div class="order-base">
				    		<p>请选择收货地址:</p>
				    		<div class="uinfo-list">
				    			<RadioGroup v-model="uinfo">
					    			<div class="uinfo-item" v-for="(item,key) in infoList" :key="key">
					    				<Radio :name="item">
					    					<div class="row-start-center">称呼：{{ item.name }} ｜ 地址：{{ item.address }}</div>
						    				<br/>
						    				<div class="row-start-center">电话：{{ item.phone }} ｜ 微信：{{ item.wechat }} ｜ 飞机：@{{ item.telegram }}</div>
					    				</Radio>
					    			</div>
				    			</RadioGroup>
				    			<div class="uinfo-item row-start-center" v-if="infoList.length<6" @click="$store.dispatch('setAddress',{ show: true, info: null })">
				    				<Icon name="add-o" size="20"/> 
				    				<span style="margin-left: 10px;cursor: pointer;">新增地址</span>
				    			</div>
				    		</div>
				    	</div>
				    	<div class="order-base row-between-center">
				    		<p>请选择付款方式:</p>
			    			<RadioGroup v-model="orderInfo.payment">
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
				    				<div class="order-item-pics" @click="lookPics(item.info.pics)">
					    				<VanImage :src="item.info.pics" fit="cover" width="100px" height="60px"/>
					    			</div>
				    				<div class="order-item-name">
				    					{{ item.info.code }} {{ item.info.name }} * {{ item.count }}
				    				</div>
				    			</div>
				    			<div>
				    				{{ item.amount }} {{ CURRENCY[shop.currency] }}
				    			</div>
				    		</div>
				    	</div>
				    	<div class="order-memo">
				    		<Field v-model="orderInfo.memo" rows="2" autosize label="客户备注" type="textarea" maxlength="150" placeholder="可备注您的要求，比如口味，忌口等" show-word-limit/>
				    	</div>
				    	<div class="order-base discount">
			    			<b>商家优惠：{{ shop.discount }}</b>
			    		</div>
			    		<div class="order-base discount">
			    			<b>平台优惠：{{ shop.p_discount }}</b>
			    		</div>
				    	<div class="order-create row-between-center">
				    		<div class="order-amount">
				    			<b>商品总计： {{ orderAmount }} {{ CURRENCY[shop.currency] }}</b>
				    		</div>
				    		<div>
				    			<Button round type="info" style="width: 150px" :disabled="!orderAmount||orderAmount<shop.minprice" @click="createOrder()">
				    				生成订单
				    			</Button>
				    		</div>
				    	</div>
				    </div>
				</div>
			</Overlay>
			<Overlay :show="showCartNoLogin" @click="showCartNoLogin=false">
				<div class="row-center-center">
				    <div class="order-info-frame" @click.stop>
				    	<div class="order-base">
				    		<p>请填写收货信息:</p>
				    		<div class="uinfo-list">
		    					<div class="row-start-center">
		    						<Field v-model="uinfoNoLogin.name" placeholder="您的称呼" required/>
		    					</div>
		    					<br/>
		    					<div class="row-start-center">
		    						<Field v-model="uinfoNoLogin.address" placeholder="您的收货地址" required/>
		    					</div>
		    					<br/>
		    					<div class="row-start-center">
		    						<Field v-model="uinfoNoLogin.phone" placeholder="您的电话号" required/>
		    					</div>
		    					<br/>
		    					<div class="row-start-center">
		    						<Field v-model="uinfoNoLogin.wechat" placeholder="您的微信号"/>
		    					</div>
		    					<br/>
		    					<div class="row-start-center">
		    						<Field v-model="uinfoNoLogin.telegram" placeholder="您的飞机号，不需要带@" :formatter="checkTelgram"/>
		    					</div>
				    		</div>
				    	</div>
				    	<div class="order-base row-between-center">
				    		<p>请选择付款方式:</p>
			    			<RadioGroup v-model="orderInfo.payment">
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
				    				<div class="order-item-pics" @click="lookPics(item.info.pics)">
					    				<VanImage :src="item.info.pics" fit="cover" width="100px" height="60px"/>
					    			</div>
				    				<div class="order-item-name">
				    					{{ item.info.code }} {{ item.info.name }} * {{ item.count }}
				    				</div>
				    			</div>
				    			<div>
				    				{{ item.amount }} {{ CURRENCY[shop.currency] }}
				    			</div>
				    		</div>
				    	</div>
				    	<div class="order-memo">
				    		<Field v-model="orderInfo.memo" rows="2" autosize label="客户备注" type="textarea" maxlength="150" placeholder="可备注您的要求，比如口味，忌口等" show-word-limit/>
				    	</div>
				    	<div class="order-base discount">
			    			<b>商家优惠：{{ shop.discount }}</b>
			    		</div>
			    		<div class="order-base discount">
			    			<b>平台优惠：{{ shop.p_discount }}</b>
			    		</div>
				    	<div class="order-create row-between-center">
				    		<div class="order-amount">
				    			<b>商品总计： {{ orderAmount }} {{ CURRENCY[shop.currency] }}</b>
				    		</div>
				    		<div>
				    			<Button round type="info" style="width: 150px" :disabled="!orderAmount||orderAmount<shop.minprice" @click="createOrderNoLogin()">
				    				生成游客订单
				    			</Button>
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
	import Review from '_common/PC/Review'
	import { Image as VanImage, Rate, Tag, Icon, Badge, Overlay, Field, Button, RadioGroup, Radio, Notify, Dialog, ImagePreview } from 'vant'
	import { SERVICETYPE, PAYMENT, DELIVERY, CURRENCY, UNIT } from '_config/shop'
	import { copyText } from '@/libs/util'
	import API from '_api'
	import VueSocialSharing from 'vue-social-sharing'
	import Vue from 'vue'
	Vue.use(VueSocialSharing)
	export default {
		name: 'Shop',
		components:{ VanImage, Rate, Header, Review, Tag, Icon, Badge, Overlay, Field, Button, RadioGroup, Radio },
		async mounted(){

			this.$store.dispatch('setLoading',true)

			await this.getShop()

			await this.isfollow()

			this.$store.dispatch('setLoading',false)

		},
		data(){
			return {
				PAYMENT,
				DELIVERY,
				CURRENCY,
				UNIT,
				active: 0,
				shop: {},
				classList: [],
				goodsList: [],
				following: false,
				class_active: '',
				ordering: false,
				showCart: false,
				orderList: {},
				uinfo: '',
				showCartNoLogin: false,
				uinfoNoLogin: {
					name: '',
					address: '',
					phone: '',
					wechat: '',
					telegram: ''	
				},
				orderInfo: {
					uinfo: '',			
					memo: '',
					payment: 0,
					items: [],
					total: 0,
					currency: '',
					shopid: ''
				},
				url: window.location.href
			}
		},
		computed:{
			user(){
				return this.$store.state.user
			},
			infoList(){

				return this.$store.state.infoList
			},
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
			async isfollow(){

				const { data } = await API.follow.isfollow(this.$route.params._id)

				if (data.success) {

					this.following = data.data? true: false
				}
			},
			async getShop(){

				const { data } = await API.show.getShop(this.$route.params._id)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				const { shop, classList, goodsList } = data.data

				this.shop = shop

				this.classList = classList

				this.goodsList = goodsList

				if (classList.length) {

					this.class_active = classList[0]._id
				}
			},
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
			async createOrder(){

				this.orderInfo.currency = this.shop.currency

				this.orderInfo.items = []

				for (let i in this.orderList) {
					
					this.orderInfo.items.push(this.orderList[i])
				}

				this.orderInfo.total = this.orderAmount

				this.orderInfo.shopid = this.shop._id

				if (!this.uinfo) {

					return Notify({ type: 'danger', message: '请选择收货地址' })
				}

				if (!this.orderInfo.total) {

					return Notify({ type: 'danger', message: '请选择购买的商品' })
				}

				this.orderInfo.uinfo = `称呼：${this.uinfo.name}\n地址：${this.uinfo.address}\n${this.uinfo.phone?('电话：'+this.uinfo.phone+'\n'):''}${this.uinfo.wechat?('微信：'+this.uinfo.wechat)+'\n':''}${this.uinfo.telegram?('飞机：@'+this.uinfo.telegram):''}`

				const { data } = await API.order.newOrder(this.orderInfo)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				this.orderInfo.orderId = data.orderId

				Notify({ type: 'success', message: data.message })

				this.createOrderText()

				this.showCart = false

			},
			async createOrderNoLogin(){

				this.orderInfo.currency = this.shop.currency

				this.orderInfo.items = []

				for (let i in this.orderList) {
					
					this.orderInfo.items.push(this.orderList[i])
				}

				this.orderInfo.total = this.orderAmount

				this.orderInfo.shopid = this.shop._id

				if (!this.uinfoNoLogin.name||!this.uinfoNoLogin.address||!this.uinfoNoLogin.phone) {

					return Notify({ type: 'danger', message: '请选择收货信息不完善' })
				}

				if (!this.orderInfo.total) {

					return Notify({ type: 'danger', message: '请选择购买的商品' })
				}

				this.orderInfo.uinfo = `称呼：${this.uinfoNoLogin.name}\n地址：${this.uinfoNoLogin.address}\n${this.uinfoNoLogin.phone?('电话：'+this.uinfoNoLogin.phone+'\n'):''}${this.uinfoNoLogin.wechat?('微信：'+this.uinfoNoLogin.wechat)+'\n':''}${this.uinfoNoLogin.telegram?('飞机：@'+this.uinfoNoLogin.telegram):''}`

				const { data } = await API.order.newOrderAgency(this.orderInfo)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				this.orderInfo.orderId = data.orderId

				Notify({ type: 'success', message: data.message })

				this.createOrderText()

				this.showCartNoLogin = false

				this.orderList = {}

				this.orderInfo = { uinfo: '', memo: '', payment: 0, items: [], total: 0, currency: '', shopid: ''}

			},
			async createOrderText(){

				const { items, total, currency, uinfo, payment, memo, orderId } = this.orderInfo

				let orderText = '点单商品：\n\n'

				for (var i = 0; i < items.length; i++) {
					
					orderText += `${i+1}：${items[i].info.code}*${items[i].count}(${items[i].info.name}) ${items[i].amount}\n`
				}

				orderText += `\n总计：${total} ${this.CURRENCY[currency]}\n`

				orderText += `\n付款方式：${this.PAYMENT[payment]}\n`

				orderText += `\n联系方式：\n\n${uinfo}\n`

				orderText += `\n备注：${memo}\n`

				orderText += `\n商家优惠：${this.shop.discount}\n`

				orderText += `\n平台优惠：${this.shop.p_discount}\n`

				orderText += `\n订单码：${orderId}\n`

				copyText(orderText)

				alert('订单信息复制成功！')

				Dialog.alert({

				  	title: '发送订单信息给商家',
				  	
				  	message: '订单信息已经复制到您的剪切板，请点击 通知商家 并粘贴订单信息给商家',

				  	confirmButtonText: '通知商家',
				  	
				  	theme: 'round-button',
				
				}).then(() => {

					window.open(`https://t.me/${this.shop.telegram}`)

					if (this.user) {

						this.$router.push('/user/2')
					}
				})
			},
			async showCartAtion(){

				if (!this.user) {

					this.showCartNoLogin = true

					return
				}

				if (this.user) {
					
					this.showCart=true

					for (var i in this.infoList) {
						
						if (this.infoList[i].default) {

							this.uinfo = this.infoList[i]
						}
					}

				}else{

					this.$store.dispatch('setAccount','login')
				}
			},
			async follow(){

				if (!this.user) {

					return this.$store.dispatch('setAccount','login')
				}

				const { data } = await API.follow.follow(this.$route.params._id)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				this.following = true

				return Notify({ type: 'success', message: data.message })
			},
			async unfollow(){

				if (!this.user) {

					return this.$store.dispatch('setAccount','login')
				}

				const { data } = await API.follow.unfollow(this.$route.params._id)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				this.following = false

				return Notify({ type: 'success', message: data.message })
			},
			async lookPics(pics){

				ImagePreview({ images: [pics], closeable: true })
			},
			checkTelgram(telegram){

				return telegram.replace(/[^\w_]/g,'')
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
			height: 280px;
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
			padding: 30px 60px;
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
			overflow: auto;
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
					height: 150px;
					padding: 10px;
					background: $ZONEBACKGROUND;
					margin-bottom: 10px;
					.goods-info{
						width: 55%;
						.goods-name{
							font-size: 18px;
						}
						.goods-tags{
							min-height: 40px;
							.tags{
								margin-right: 5px;
							}
						}
						.goods-price{
							b{
								font-size: 18px;
							}
							color: $ACTIVECOLOR;
						}
						.order-action{
							text-align: center;
							margin-top: 10px;
							.order-sub{
								width: 40px;
								height: 30px;
								line-height: 30px;
								border: 1px solid #dcdcdc;
								border-radius: 15px 0 0 15px;
								cursor: pointer;
							}
							.order-num{
								width: 60px;
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
				.uinfo-list{
					margin-top: 10px;
					.uinfo-item{
						border: 1px solid #f7f7f7;
						padding: 10px;
						margin-bottom: 10px;
					}
				}
			}
			.discount{
				color: red;
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
		.share-frame{
			width: 100%;
			padding: 10px 100px;
			font-weight: bold;
			color: #ffffff;
			.share-to{
				margin-left: 20px;
			}
		}
	}
</style>