<template>
	<div class="page-frame-shell">
		<div class="page-frame">
			<div class="page-banner">
				<div class="page-banner-header row-between-center">
					<div>
						<a @click="goBack()"><Icon name="arrow-left" color="#ffffff" size="20"/></a>
					</div>
					<div>
						<a style="margin-right: 20px" @click="showShare=true">
							<Icon name="share-o" size="20"/>
						</a>
						<a @click="following?unfollow():follow()">
							<Icon name="star-o" color="#ffffff" size="20"  v-if="!following"/>
							<Icon name="star"  color="#fc6923" size="20"  v-else/>
						</a>
					</div>
				</div>
				<div class="page-banner-back">
					<VanImage :src="shop.back" width="100%" height="100%" fit="cover"/>
				</div>
				<div class="page-banner-mask"></div>
				<div class="shop-banner-info">
					<div class="row-start-center">
						<VanImage :src="shop.logo" width="50" height="50" round fit="cover"/>
						<div class="base-info">
							<div class="shop-name"><b>{{ shop.name }}</b></div>
							<div class="shop-rate row-between-center">
								<Rate v-model="shop.rate" allow-half void-icon="star" size="14" color="#ffd21e" readonly void-color="#eee"/>
								<div class="minprice">{{ shop.minprice }}{{CURRENCY[shop.currency]}}起送</div>
							</div>
						</div>
					</div>
					<div class="shop-info">
						<div class="shop-info-item row-start-center">
							<div>支持配送方式:</div>
							<Tag type="success" v-for="(item,key) in shop.delivery" :key="key" class="tags">{{ DELIVERY[item] }}</Tag>
						</div>
						<div class="shop-info-item row-start-center">
							<div>支持付款方式:</div>
							<Tag type="success" v-for="(item,key) in shop.payment" :key="key" class="tags">{{ PAYMENT[item] }}</Tag>
						</div>
					</div>
				</div>
			</div>
			<div class="page-shop-frame">
				<div class="tab-frame">
					<Tabs v-model="active" background="#f7f7f7">
					  	<Tab title="所有商品">
					  		<div class="shop-goods-frame row-between-top">
					  			<div class="shop-class-frame">
					  				<div v-for="(item,key) in classList" :key="key" :class="['shop-class-item',class_active._id===item._id?'active':'']" @click="class_active=item">
										<b>{{ item.name }}</b>
									</div>
					  			</div>
					  			<div class="shop-class-goods">
					  				<div class="shop-class-item-active">
					  					<span><b>{{ class_active.name }}</b></span>
					  				</div>
					  				<div class="shop-goods-item row-between-center" v-for="(item,key) in classGoodsList" :key="key">
					  					<div class="goods-img-frame" @click="lookPics([item.pics],0)">
											<VanImage :src="item.pics" fit="cover" width="100%" height="100%" lazy-load/>
										</div>
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
					  	</Tab>
					  	<Tab title="商家信息">
					  		<div class="shop-info-frame">
					  			<div class="shop-info-zone">
						  			<h4>店铺照片</h4>
									<div class="shop-pics-list row-between-center">
										<div class="shop-pics-item" v-for="(item,key) in shop.pics" :key="key" @click="lookPics(shop.pics,key)">
											<VanImage :src="item" fit="cover" width="100%" height="100%"/>
										</div>
									</div>
									<div class="shop-info-item row-start-top">
										<Icon name="shop" size="22"/>
									 	<div class="shop-info-text">店铺介绍：<span v-html="format(shop.brief)"/></div>
									</div>
									<div class="shop-info-item row-start-center">
										<Icon name="map-marked" size="22"/>
										<div class="shop-info-text">店铺地址：{{shop.city}} - {{shop.address}}</div>
									</div>
									<div class="shop-info-item row-start-center">
										<Icon name="underway" size="22"/>
										<div class="shop-info-text">营业时间：{{shop.stime}} - {{shop.etime}}</div>
									</div>
								</div>
								<div class="shop-info-zone">
									<h4>联系方式</h4>
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
								<div class="shop-info-zone">
									<h4>商家公告</h4>
									<div class="shop-info-item">
										{{ shop.notice }}
									</div>
								</div>
								<div class="shop-info-zone">
									<h4>商家优惠</h4>
									<div class="shop-info-item">
										<div class="list" v-if="!shop.discount">
											暂无优惠信息
										</div>
										<div class="discount-text" v-html="format(shop.discount)"/>
									</div>
								</div>
								<div class="shop-info-zone">
									<h4>平台优惠</h4>
									<div class="shop-info-item">
										<div class="list" v-if="!shop.p_discount">
											暂无优惠信息
										</div>
										<div class="discount-text" v-html="format(shop.p_discount)"/>
									</div>
								</div>
					  		</div>
					  	</Tab>
					  	<Tab title="用户点评">
					  		<div class="shop-review-frame">
					  			<Review :shopid="$route.params._id"/>
					  		</div>
					  	</Tab>
					</Tabs>
				</div>
				<div></div>
			</div>
			<div class="shopping-cart row-center-center" v-if="!active" @click="showCartAtion()">
				<div class="shopping-cart-button row-center-center">
					<VanImage src="/img/shop/shopping-cart.png" width="30"/>
					<div style="margin-left: 10px">购买商品({{ orderCount }})</div>
				</div>
			</div>
		</div>
		<ActionSheet v-model="showCart" title="购物订单">
	    	<div class="order-info">
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
		    	<div class="order-base">
		    		<p>付款方式:</p><br/>
	    			<RadioGroup v-model="orderInfo.payment">
	    				<div class="row-start-center">
	    					<div class="payment-action" v-for="(item,key) in shop.payment">
				    			<Radio :name="item">{{ PAYMENT[item] }}</Radio>
				    		</div>
		    			</div>
	    			</RadioGroup>
		    	</div>
		    	<div class="order-list">
		    		<div v-for="(item,key) in orderList" :key="key">
		    			<div class="order-item row-start-top">
		    				<div class="order-item-pics" @click="lookPics(item.info.pics)">
			    				<VanImage :src="item.info.pics" fit="cover" width="100px" height="60px"/>
			    			</div>
		    				<div class="order-item-name">
		    					<p>{{ item.info.code }} {{ item.info.name }} * {{ item.count }}</p>
		    					<br>
		    					<p><b>{{ item.amount }}</b> {{ CURRENCY[shop.currency] }}</p>
		    				</div>
		    			</div>
		    		</div>
		    	</div>
		    	<div class="order-memo">
		    		<Field v-model="orderInfo.memo" rows="2" autosize label="客户备注" type="textarea" maxlength="150" placeholder="可备注您的要求，比如口味，忌口等" show-word-limit/>
		    	</div>
		    	<div class="order-base discount">
		    		商家优惠：{{ shop.discount }}
		    	</div>
		    	<div class="order-base discount">
		    		平台优惠：{{ shop.p_discount }}
		    	</div>
		    	<div class="order-create row-between-center">
		    		<div class="order-amount">
		    			<b>商品总计： {{ orderAmount }} {{ CURRENCY[shop.currency] }}</b>
		    		</div>
		    		<div>
		    			<Button round type="info" size="small" :disabled="!orderAmount||orderAmount<shop.minprice" @click="createOrder()">
		    				生成订单
		    			</Button>
		    		</div>
		    	</div>
		    </div>
		</ActionSheet>
		<ActionSheet v-model="showCartNoLogin" title="游客下单">
	    	<div class="order-info">
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
    						<Field v-model="uinfoNoLogin.phone" placeholder="您的电话号" type="number" required/>
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
		    	<div class="order-base">
		    		<p>付款方式:</p><br/>
	    			<RadioGroup v-model="orderInfo.payment">
	    				<div class="row-start-center">
	    					<div class="payment-action" v-for="(item,key) in shop.payment">
				    			<Radio :name="item">{{ PAYMENT[item] }}</Radio>
				    		</div>
		    			</div>
	    			</RadioGroup>
		    	</div>
		    	<div class="order-list">
		    		<div v-for="(item,key) in orderList" :key="key">
		    			<div class="order-item row-start-top">
		    				<div class="order-item-pics" @click="lookPics(item.info.pics)">
			    				<VanImage :src="item.info.pics" fit="cover" width="100px" height="60px"/>
			    			</div>
		    				<div class="order-item-name">
		    					<p>{{ item.info.code }} {{ item.info.name }} * {{ item.count }}</p>
		    					<br>
		    					<p><b>{{ item.amount }}</b> {{ CURRENCY[shop.currency] }}</p>
		    				</div>
		    			</div>
		    		</div>
		    	</div>
		    	<div class="order-memo">
		    		<Field v-model="orderInfo.memo" rows="2" autosize label="客户备注" type="textarea" maxlength="150" placeholder="可备注您的要求，比如口味，忌口等" show-word-limit/>
		    	</div>
		    	<div class="order-base discount">
		    		商家优惠：{{ shop.discount }}
		    	</div>
		    	<div class="order-base discount">
		    		平台优惠：{{ shop.p_discount }}
		    	</div>
		    	<div class="order-create row-between-center">
		    		<div class="order-amount">
		    			<b>商品总计： {{ orderAmount }} {{ CURRENCY[shop.currency] }}</b>
		    		</div>
		    		<div>
		    			<Button round type="info" size="small" :disabled="!orderAmount||orderAmount<shop.minprice" @click="createOrderNoLogin()">
		    				生成订单
		    			</Button>
		    		</div>
		    	</div>
		    </div>
		</ActionSheet>
		<ShareSheet v-model="showShare" :title="shop.name" :options="options" @select="shareTo" v-if="shop._id"/>
		<Dialog v-model="showCopy" :show-confirm-button="false">
			<div class="clipboard-frame">
				<div class="order-text-frame">
					<p v-html="format(orderText)"></p>
				</div>
				<br/>
				<Button id="order-info-clipboard" v-clipboard:copy="orderText" v-clipboard:success="onCopy" v-clipboard:error="onError" round  color="linear-gradient(to right, #ff6034, #ee0a24)">
					点击复制订单内容到剪切板
				</Button>
			</div>
		</Dialog>
	</div>
</template>
<script>
import Review from '_common/MB/Review'
import { copyText } from '@/libs/util'
import { shareLink } from '@/libs/share'
import { Image as VanImage, Rate, Tag, Icon, Badge, Overlay, Field, Button, RadioGroup, Radio, Notify, Dialog, ImagePreview, Tab, Tabs, ActionSheet, ShareSheet } from 'vant'
import { SERVICETYPE, PAYMENT, DELIVERY, CURRENCY, UNIT } from '_config/shop'
import API from '_api'
let fromPage
export default {
	name: 'Shop',
	components:{ VanImage, Rate, Tag, Icon, Badge, Overlay, Field, Button, RadioGroup, Radio, Tab, Tabs, Review, ActionSheet, ShareSheet, Dialog: Dialog.Component },
	async mounted(){

		this.$store.dispatch('setLoading',true)

		await this.getShop()

		await this.isfollow()

		this.$store.dispatch('setLoading',false)
	},
	beforeRouteEnter(to, from, next){

		fromPage = from
		
		next()
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
			orderInfo: {
				uinfo: '',			
				memo: '',
				payment: 0,
				items: [],
				total: 0,
				currency: '',
				shopid: ''
			},
			showCartNoLogin: false,
			uinfoNoLogin: {
				name: '',
				address: '',
				phone: '',
				wechat: '',
				telegram: ''	
			},
			showShare: false,
	      	options: [
		        { name: 'telegram', icon: '/img/share/telegram.png' },
		        { name: 'whatsapp', icon: '/img/share/whatsapp.png' },
		        { name: 'line', icon: '/img/share/line.png' },
		        { name: 'facebook', icon: '/img/share/facebook.png' },
		        { name: 'link', icon: 'link' }
	      	],
	      	orderText: '',
	      	showCopy: false
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

				if (item.classid.indexOf(this.class_active._id) !==-1 ) {

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
		async shareTo(option){

			shareLink(option.name,window.location.href,this.shop.name,this.shop.brief)
			
			this.showShare = false
		},
		async goBack(){

			if (!fromPage.name) {

				return this.$router.push('/')
			}

			this.$router.go(-1)

		},
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

				this.class_active = classList[0]
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

			this.orderText = '点单商品：\n\n'

			for (var i = 0; i < items.length; i++) {
				
				this.orderText += `${i+1}：${items[i].info.code}*${items[i].count}(${items[i].info.name}) ${items[i].amount}\n`
			}

			this.orderText += `\n总计：${total} ${this.CURRENCY[currency]}\n`

			this.orderText += `\n付款方式：${this.PAYMENT[payment]}\n`

			this.orderText += `\n联系方式：\n\n${uinfo}\n`

			this.orderText += `\n备注：${memo}\n`

			this.orderText += `\n商家优惠：${this.shop.discount}\n`

			this.orderText += `\n平台优惠：${this.shop.p_discount}\n`

			this.orderText += `\n订单码：${orderId}\n`

			// copyText(orderText)

			// this.$copyText(this.orderText).then( (e) => {

		 //        alert('订单信息复制成功！')
	        
	  //       },  (e) => {

	  //       	alert('订单信息复制失败，请通知商家去后台查看订单信息！')

	  //       })

	  		this.showCopy = true

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
		async lookPics(images,startPosition){

			ImagePreview({ images, startPosition, closeable: true })
		},
		checkTelgram(telegram){

			return telegram.replace(/[^\w_]/g,'')
		},
		onCopy(){

			this.showCopy = false

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
		onError(){

			this.showCopy = false

			Dialog.alert({

			  	title: '发送订单信息给商家',
			  	
			  	message: '订单信息复制失败，请通知商家去后台查看订单信息！',

			  	confirmButtonText: '通知商家',
			  	
			  	theme: 'round-button',
			
			}).then(() => {

				window.open(`https://t.me/${this.shop.telegram}`)

				if (this.user) {

					this.$router.push('/user/2')
				}
			})
		}
	}
}	
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss";
	.page-frame-shell{
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
	.page-frame{
		background: $PAGEBACKGROUND;
		height: 100vh;
		overflow: auto;
		.shopping-cart{
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100vw;
			height: 60px;
			.shopping-cart-button{
				width: 80%;
				height: 40px;
				line-height: 40px;
				border-radius: 20px;
				background: #fc6923;
				color: #ffffff;
			}
		}
	}
	.page-banner{
		height: 20vh;
		position: relative;
		.page-banner-header{
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			width: 100%;
			color: #ffffff;
			padding: 0 10px;
			margin-top: 20px;
		}
		.page-banner-mask,.page-banner-back{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

		}
		.page-banner-mask{
			background: rgba(0,0,0,.4);
		}
		.shop-banner-info{
			position: absolute;
			top: 12vh;
			left: 10px;
			width: calc(100vw - 20px);
			height: 20vh;
			padding: 10px;
			border-radius: 10px;
			background: $BASEBACKGROUND;
			text-align: left;
			.base-info{
				padding-left: 10px;
				.minprice{
					margin-left: 100px;
					font-size: 12px;
				}
			}
			.shop-info{
				font-size: 12px;
				.shop-info-item{
					margin-top: 15px;
					.tags{
						margin-left: 20px;
					}
				}
			}
		}
	}
	.page-shop-frame{
		min-height: 80vh;
		padding-top: 12vh;
		text-align: left;
		.shop-info-frame{
			.shop-pics-list{
				flex-wrap: wrap;
				.shop-pics-item{
					width: 49%;
					height: 100px;
					border-radius: 5px;
					overflow: hidden;
					margin-top: 10px;
				}
			}
			.shop-info-zone{
				padding: 10px;
				margin-bottom: 10px;
				background: $BASEBACKGROUND;
			}
			.shop-info-item{
				margin-top: 10px;
				.shop-info-text{
					margin-left: 10px;
					a{
						color: #fc6923;
					}
				}
			}
		}
		.shop-goods-frame{
			padding-bottom: 60px;
			.shop-class-frame{
				width: 30%;
				text-align: center;
				height: calc(100vh - 44px);
				background: $PAGEBACKGROUND;
				.shop-class-item{
					height: 40px;
					line-height: 40px;
					font-size: 12px;
					&.active{
						background: $BASEBACKGROUND;
					}
				}
			}
			.shop-class-goods{
				width: 70%;
				// height: calc(100vh - 44px);
				// overflow: auto;
				background: $BASEBACKGROUND;
				position: relative;
				.shop-class-item-active{
					height: 40px;
					line-height: 40px;
					font-size: 12px;
					span{
						border-left: 2px solid #ee0a24;
						padding-left: 10px;
					}
				}
				.shop-goods-item{
					width: 100%;
					padding: 10px 5px;
					background: $ZONEBACKGROUND;
					font-size: 12px;
					.goods-img-frame{
						width: 40%;
						height: 80px;
						border-radius: 5px;
						overflow: hidden;
					}
					.goods-info{
						width: 60%;
						padding: 5px;
						.goods-name{
							font-size: 14px;
						}
						.goods-tags{
							.tags{
								margin-right: 5px;
							}
							margin-top: 5px;
						}
						.goods-price{
							b{
								font-size: 14px;
							}
							color: $ACTIVECOLOR;
							margin-top: 5px;
						}
						.order-action{
							text-align: center;
							margin-top: 5px;
							.order-sub{
								width: 30px;
								height: 20px;
								line-height: 20px;
								border: 1px solid #dcdcdc;
								border-radius: 10px 0 0 10px;
								cursor: pointer;
							}
							.order-num{
								width: 40px;
								height: 20px;
								line-height: 20px;
								border-top: 1px solid #dcdcdc;
								border-bottom: 1px solid #dcdcdc;
							}
							.order-add{
								width: 30px;
								height: 20px;
								line-height: 20px;
								border: 1px solid #dcdcdc;
								border-radius: 0 10px 10px 0;
								cursor: pointer;
							}
						}
					}
				}
			}
		}
		.shop-review-frame{

		}
	}
	.order-info{
		width: 100%;
		height: 350px;
		background: $PAGEBACKGROUND;
		overflow: auto;
	    -webkit-overflow-scrolling: touch;
		text-align: left;
		font-size: 14px;
		.order-base,.order-list,.order-create{
			background: $ZONEBACKGROUND;
			border-radius: 5px;
			padding: 10px;
			margin-bottom: 10px;
			min-height: 50px;
		}
		.order-base{
			.payment-action{
				margin-right: 20px;
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
			font-weight: bold;
			line-height: 30px;
		}
		.order-list{
			.order-item{
				margin-bottom: 10px;
				padding-bottom: 10px;
				border-bottom: 1px solid #f7f7f7;
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
	.clipboard-frame{
		padding: 20px;
		.order-text-frame{
			max-height: 350px;
			overflow: auto;
			text-align: left;
		}
	}
</style>