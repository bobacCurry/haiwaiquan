<template>
	<div @click="$emit('close')">
		<Overlay :show="true" z-index="100">
			<div class="wrapper">
				<div class="info-frame" @click.stop>
					<div class="info-title">
						<h1>编辑商铺</h1>
					</div>
					<div class="input-frame">
						<RadioGroup v-model="shop.type">
							<div class="row-start-center shop-type flex-wrap">
								<div>店铺类型</div>
								<span v-for="(item,key) in SERVICETYPE" :key="key" style="margin-left: 20px;">
									<Radio :name="key+1">{{ item.name }}</Radio>
								</span>
							</div>
						</RadioGroup>
					</div>
					<div class="input-frame">
						<Field v-model="shop.name" required label="店铺名称" placeholder="请输入店铺名称" />
					</div>
					<div class="input-frame">
						<div class="row-start-center pics-frame">
							<div>店铺LOGO</div>
							<div class="logo-frame row-center-center">
								<Upload type="shop" single="getLogoUrl" @getUrl="getLogoUrl">
									<VanImage :src="shop.logo" fit="cover" width="100px" height="100px"/>
								</Upload>
							</div>
						</div>
					</div>
					<div class="input-frame">
						<div class="row-start-center pics-frame">
							<div>店铺背景</div>
							<div class="back-frame row-center-center">
								<Upload type="shop" single="getBackUrl" @getUrl="getBackUrl">
									<VanImage :src="shop.back" fit="cover" width="600px" height="150px"/>
								</Upload>
							</div>
						</div>
					</div>
					<div class="input-frame">
						<div class="row-start-center pics-frame">
							<div>店铺环境</div>
							<div class="row-start-center shop-img-frame">
								<div class="shop-img-item row-center-center" v-for="(item,key) in shop.pics" :key="key">
									<span class="del-pics" @click="delPics(key)"><Icon name="cross" size="20" color="red"/></span>
									<VanImage :src="item" fit="cover" width="180px" height="100px"/>
								</div>
								<Upload type="shop" single="getPicskUrl" @getUrl="getPicsUrl">
									<div class="shop-img-item row-center-center" v-if="shop.pics.length<6">
										<Icon name="add-o" size="50"/>
									</div>
								</Upload>
							</div>
						</div>
					</div>
					<div class="input-frame">
						<Field v-model="shop.brief" label="店铺介绍" placeholder="请输入店铺介绍" type="textarea" rows="3" autosize maxlength="300" show-word-limit/>
					</div>
					<div class="input-frame">
						<Field v-model="shop.stime" required label="开始营业" placeholder="请输入开始营业时间 格式如 08:00" />
					</div>
					<div class="input-frame">
						<Field v-model="shop.etime" required label="结束营业" placeholder="请输入开始结束时间 格式如 23:30" />
					</div>
					<div class="input-frame">
						<CheckboxGroup v-model="shop.payment">
							<div class="row-start-center checkbox-type">
								<div>付款方式</div>
								<span v-for="(item,key) in PAYMENT" :key="key" style="margin-left: 20px;">
									<Checkbox :name="key" shape="square">{{ item }}</Checkbox>
								</span>
							</div>
						</CheckboxGroup>
					</div>
					<div class="input-frame">						
						<CheckboxGroup v-model="shop.delivery">
							<div class="row-start-center checkbox-type">
								<div>配送方式</div>
								<span v-for="(item,key) in DELIVERY" :key="key" style="margin-left: 20px;">
									<Checkbox :name="key" shape="square">{{ item }}</Checkbox>
								</span>
							</div>
						</CheckboxGroup>
					</div>
					<div class="input-frame">
						<Field v-model="shop.minprice" required type="number" label="最低起送" placeholder="请输入最低的购买价格" />
					</div>
					<div class="input-frame">
						<RadioGroup v-model="shop.currency">
							<div class="row-start-center shop-type">
								<div>默认货币</div>
								<span v-for="(item,key) in CURRENCY" :key="key" style="margin-left: 20px;">
									<Radio :name="key">{{ item }}</Radio>
								</span>
							</div>
						</RadioGroup>
					</div>
					<div class="input-frame">
						<Field v-model="shop.city" required label="所在城市" placeholder="所在的城市，英文拼写如：makati、passy" />
					</div>
					<div class="input-frame">
						<Field v-model="shop.address" required label="店铺详址" placeholder="请输入店铺的详细地址" />
					</div>
					<div class="input-frame">
						<Field v-model="shop.notice" label="店铺公告" placeholder="请输入店铺的公告信息" />
					</div>
					<div class="input-frame">
						<Field v-model="shop.discount" label="店铺优惠" placeholder="请输入店铺的优惠信息" type="textarea" rows="3" autosize/>
					</div>
					<div class="input-frame">
						<Field v-model="shop.p_discount" label="平台优惠" placeholder="此优惠仅在本平台才有的优惠，本平台免费使用，商户们可适当将推广费用节约出来进行对客户返利，从而增加客户粘性" type="textarea" rows="3" autosize/>
					</div>
					<div class="input-frame">
						<Field v-model="shop.phone" required label="商家手机" placeholder="请输入联系用的手机号" />
					</div>
					<div class="input-frame">
						<Field v-model="shop.wechat" label="商家微信" placeholder="请输入联系用的微信号" />
					</div>
					<div class="input-frame">
						<Field v-model="shop.telegram" required label="商家飞机" :formatter="checkTelgram" placeholder="飞机的 username，不需要带@" />
					</div>
					<div class="input-frame action-frame">
						<Button type="info" size="small" @click="shopInfo?updateShop():addShop()">提交审核</Button>
						&nbsp;&nbsp;&nbsp;
						<Button type="default" @click="$emit('close')" size="small">取消提交</Button>
					</div>
				</div>
			</div>
		</Overlay>
	</div>
</template>
<script>
	import { Image as VanImage, Overlay, Field, Button, Notify, Radio, RadioGroup, Checkbox, CheckboxGroup, Icon  } from 'vant'
	import { SERVICETYPE, PAYMENT, DELIVERY, CURRENCY } from '_config/shop'
	import Upload from '_common/BASE/Upload'
	import API from '_api'
	export default {
		name: 'EditShop',
		components:{ VanImage, Overlay, Field, Button, Notify, Radio, RadioGroup, Checkbox, CheckboxGroup, Icon, Upload },
		props:['shopInfo'],
		data(){
			return {
				SERVICETYPE,
				PAYMENT,
				DELIVERY,
				CURRENCY,
				shop: {
					_id: '',
					type: 1,
					name: '',
					logo: '',
					back: '/img/shop/shopback.png',
					pics: [],
					brief: '',
					stime: '',
					etime: '',
					payment: [],
					delivery: [],
					minprice: '',
					currency: '',
					city: '',
					address: '',
					notice: '',
					discount: '',
					p_discount:'',
					phone: '',
					wechat: '',
					telegram: ''
				}
			}
		},
		mounted(){
			
			if (this.shopInfo) {

				for (let i in this.shop){

					this.shop[i] = this.shopInfo[i]
				}
			}
		},
		methods:{
			async getLogoUrl(url){

				this.shop.logo = url
			},
			async getBackUrl(url){

				this.shop.back = url
			},
			async getPicsUrl(url){

				this.shop.pics.push(url)
			},
			async delPics(index){
				this.shop.pics.splice(index,1)
			},
			async addShop(){

				if (!this.shop.name.trim()||!this.shop.logo.trim()||!this.shop.stime.trim()||!this.shop.etime.trim()||!this.shop.payment.length||!this.shop.delivery.length||!this.shop.city.trim()||!this.shop.address.trim()) {

					return Notify({ type: 'danger', message: '基本信息不完整' })
				}

				if(!this.shop.telegram.trim()){

					return Notify({ type: 'danger', message: 'Telegram不得为空' })
				}

				this.shop.minprice = this.shop.minprice?this.shop.minprice:0

				try{

					const { data } = await API.shop.addShop(this.shop)

					if (!data.success) {

						return Notify({ type: 'danger', message: data.message })
					}

					this.$emit('confirm')

					return Notify({ type: 'success', message: data.message })
				
				}catch({ response }){

					if (response) {
						
						return Notify({ type: 'danger', message: response.data.message })
					}
				}
			},
			async updateShop(){

				if (!this.shop._id.trim()||!this.shop.name.trim()||!this.shop.logo.trim()||!this.shop.stime.trim()||!this.shop.etime.trim()||!this.shop.payment.length||!this.shop.delivery.length||!this.shop.city.trim()||!this.shop.address.trim()) {

					return Notify({ type: 'danger', message: '基本信息不完整' })
				}

				if(!this.shop.telegram.trim()){

					return Notify({ type: 'danger', message: 'Telegram不得为空' })
				}

				this.shop.minprice = this.shop.minprice?this.shop.minprice:0

				try{

					const { data } = await API.shop.updateShop(this.shop)

					if (!data.success) {

						return Notify({ type: 'danger', message: data.message })
					}

					this.$emit('confirm')

					return Notify({ type: 'success', message: data.message })
				
				}catch({ response }){

					if (response) {
						
						return Notify({ type: 'danger', message: response.data.message })
					}
				}
			},
			checkTelgram(telegram){

				return telegram.replace(/[^\w_]/g,'')
			}
		}
	}
</script>
<style lang="scss" scoped>
	.wrapper{
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    width: 100%;
	    height: 100%;
	    .info-frame{
	    	width: 800px;
	    	height: 600px;
	    	overflow: auto;
		    background-color: #ffffff;
		    border-radius: 10px;
		    text-align: left;
		    padding: 20px;
		    font-size: 14px;
		    .info-title{
		    	padding: 16px;
		    }
		    .input-frame{
		    	color: #646566;
		    	border-bottom: 1px solid #f7f7f7;
		    	.shop-type,.checkbox-type,.pics-frame{
		    		padding: 10px 16px;
		    	}
		    	.pics-frame{
		    		.logo-frame{
		    			margin-left: 30px;
		    			width: 100px;
		    			height: 100px;
		    			border: 1px solid #f7f7f7;
		    		}
		    		.back-frame{
		    			margin-left: 30px;
		    			width: 600px;
		    			height: 150px;
		    			border: 1px solid #f7f7f7;
		    		}
		    		.shop-img-frame{
		    			width: 640px;
		    			flex-wrap: wrap;
		    		}
		    		.shop-img-item{
		    			position: relative;
		    			margin-left: 30px;
		    			margin-bottom: 10px;
		    			width: 180px;
		    			height: 100px;
		    			border: 1px solid #f7f7f7;
		    			.del-pics{
		    				position: absolute;
		    				top: 2px;
		    				right: 2px;
		    				z-index: 10;
		    			}
		    		}
		    	}
		    }
		    .action-frame{
		    	padding: 16px;
		    }
	    }
  	}
</style>