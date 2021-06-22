<template>
	<div class="block-frame">
		<div class="user-order-frame">
			<div class="order-status-list">
				<CheckboxGroup v-model="params.status" @change="getUserOrder()">
					<div class="status-list row-start-center">
						<span v-for="(item,key) in ORDERSTATUS" :key="key" style="margin: 5px">
							<Checkbox :name="key" shape="square">{{item}}</Checkbox>
						</span>
					</div>
				</CheckboxGroup>
			</div>
			<div class="order-list-frame">
				<div class="order-item" v-for="(item,key) in items" :key="key">
					<div class="row-between-center">
						<div class="order-logo">
							<VanImage :src="item.shop.logo" width="100%" height="100%" fit="cover" />
						</div>
						<div class="order-info">
							<div class="title">
								<router-link :to="`/shop/${item.shop._id}`">
									{{ item.shop.name }}
								</router-link>
							</div>
							<div>{{ PAYMENT[item.payment] }}、{{ DELIVERY[item.delivery] }}</div>
							<div class="row-between-center">
								<div>
									<b style="color: red">{{ item.total }} {{ CURRENCY[item.currency] }}</b>
								</div>
								<div style="color: red">{{ ORDERSTATUS[item.status] }}</div>
							</div>
							<div class="time">{{ item.created_at | formatTime }}</div>
						</div>
					</div>
					<div class="order-action-frame">
						<Button class="order-action" type="info" size="mini" @click="orderInfo=item;showInfo=true">查看</Button>
						<Button class="order-action" type="primary" size="mini" v-if="item.status===0" @click="confirm._id=item._id;showConfirm=true">确认接单</Button>
						<Button class="order-action" type="primary" size="mini" v-if="item.status===1" @click="delivery(item._id)">已送出</Button>
						<Button class="order-action" type="primary" size="mini" v-if="item.status===2" @click="arrived(item._id)">已送到</Button>
						<Button class="order-action" type="danger" size="mini" v-if="[0,1].indexOf(item.status)!==-1" @click="cancelOrderShop(item._id)">取消订单</Button>
					</div>
				</div>
				<Pagination v-model="params.page" :items-per-page="params.rows" :total-items="total" @change="getUserOrder()"/>
			</div>
		</div>
		<ActionSheet v-model="showInfo" title="订单详情">
			<div class="order-info-frame">
				<div class="order-info-item">
					<div v-for="(item,key) in orderInfo.items" :key="key" class="order-item row-between-top">
						<div class="row-start-top">
		    				<div class="order-item-pics">
			    				<VanImage :src="item.info.pics" fit="cover" width="120px" height="80px"/>
			    			</div>
		    				<div class="order-item-name">
		    					<div>{{ item.info.code }} {{ item.info.name }} * {{ item.count }}</div>
		    					<br/>
		    					<div>{{ item.amount }} {{ CURRENCY[orderInfo.currency] }}</div>
		    				</div>
		    			</div>
					</div>
				</div>
				<div class="order-info-item">
					<p>总计：<b>{{ orderInfo.total }}</b> {{ CURRENCY[orderInfo.currency] }}</p>
				</div>
				<div class="order-info-item">
					<p>付款方式：<b>{{ PAYMENT[orderInfo.payment] }}</b></p>
				</div>
				<div class="order-info-item">
					<p>配送方式：<b>{{ DELIVERY[orderInfo.delivery] }}</b></p>
				</div>
				<div class="order-info-item">
					<p>配送信息</p>
					<p style="white-space: pre-line;margin-top: 10px">
						{{ orderInfo.uinfo }}
					</p>
				</div>
				<div class="order-info-item">
					<p>订单备注：{{ orderInfo.memo }}</p>
				</div>
				<div class="order-info-item">
					<p>下单时间：{{ orderInfo.created_at | formatTime }}</p>
				</div>
				<div class="order-info-item">
					<p>订单状态：<b style="color: red">{{ ORDERSTATUS[orderInfo.status] }}</b></p>
				</div>
			</div>
		</ActionSheet>
		<Dialog v-model="showConfirm" title="确认接受该订单吗？" @confirm="confirmOrder()" show-cancel-button>
			<div style="padding: 20px;">
				<RadioGroup v-model="confirm.delivery">			
					<div>请选择配送方式：</div>
					<div v-for="(item,key) in DELIVERY" :key="key" style="margin-top: 20px">
						<Radio :name="key">{{ item }}</Radio>
					</div>
				</RadioGroup>
			</div>
		</Dialog>
	</div>
</template>
<script>
	import { Button, Image as VanImage, Overlay, Radio, RadioGroup, Checkbox, CheckboxGroup, Pagination, Dialog, Notify, ActionSheet } from 'vant'
	import { PAYMENT, DELIVERY, CURRENCY } from '_config/shop'
	import { ORDERSTATUS } from '_config/order'
	import API from '_api'
	import { formatTime } from '@/libs/util'
	export default {
		name: 'ShopOrders',
		components:{ Button, VanImage, Radio, RadioGroup, Checkbox, CheckboxGroup, Overlay, Pagination, Dialog: Dialog.Component, ActionSheet },
		filters: {
			formatTime(time){

				return formatTime(time)
			}
		},
		async mounted(){

			this.params.shop = this.$route.query._id

			if (this.$route.query.unfinished==='1') {

				this.params.status = [ 0, 1, 2 ]
			}

			this.$store.dispatch('setLoading',true)

			await this.getShopOrder()

			this.$store.dispatch('setLoading',false)
		},
		data(){
			return {
				PAYMENT,
				DELIVERY,
				CURRENCY,
				ORDERSTATUS,
				params: {
					status: [],
					shop: '',
					page: 1,
					rows: 50
				},
				confirm: {
					_id: '',
					delivery: 0
				},
				items: [],
				total: 0,
				orderInfo: '',
				showInfo: false,
				showConfirm: false
			}
		},
		methods:{
			async getShopOrder(){

				const { data } = await API.order.getShopOrder(this.params)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				const { items, total } = data.data

				this.items = items

				this.total = total
			},
			async cancelOrderShop(_id){

				Dialog.confirm({

				  	title: '操作取消订单',
				  	
				  	message: '您确认要取消该订单吗？请通知客户您的取消操作，避免误会！',
				
				}).then(async () => {

					const { data } = await API.order.cancelOrderShop(_id)

					if (!data.success) {

						return Notify({ type: 'danger', message: data.message })
					}

					await this.getShopOrder()

					Notify({ type: 'success', message: data.message })

				}).catch(() => {

				})
			},
			async confirmOrder(){

				const { data } = await API.order.confirmOrder(this.confirm)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				await this.getShopOrder()

				Notify({ type: 'success', message: data.message })

			},
			async delivery(_id){

				Dialog.confirm({

				  	title: '商品已配送',
				  	
				  	message: '商品已经确认送出了么？',
				
				}).then(async () => {

					const { data } = await API.order.delivery(_id)

					if (!data.success) {

						return Notify({ type: 'danger', message: data.message })
					}

					await this.getShopOrder()

					Notify({ type: 'success', message: data.message })

				}).catch(() => {

				})
			},
			async arrived(_id){

				Dialog.confirm({

				  	title: '商品已送到',
				  	
				  	message: '商品已经确认送到了么？',
				
				}).then(async () => {

					const { data } = await API.order.arrived(_id)

					if (!data.success) {

						return Notify({ type: 'danger', message: data.message })
					}

					await this.getShopOrder()

					Notify({ type: 'success', message: data.message })

				}).catch(() => {

				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss";
	.block-frame{
		padding-top: 10px;
		.user-order-frame{
			.order-status-list{
				padding: 10px;
				background: #ffffff;
				.status-list{
					@extend .flex-wrap;
				}
			}
			.order-list-frame{
				text-align: left;
				padding-bottom: 40px;
				.order-item{
					padding: 10px;
					margin-top: 10px;
					background: #ffffff;
					.order-logo{
						width: 40%;
					}
					.order-info{
						width: 55%;
						line-height: 25px;
						.title{
							font-size: 16px;
						}
						.time{
							font-size: 12px;
						}
					}
					.order-action-frame{
						border-top: 1px solid #f7f7f7;
						text-align: right;
						padding-top: 10px;
						.order-action{
							width: 100px;
							margin-left: 10px;
						}
					}
				}
			}
		}
		.order-info-frame{
	    	height: 500px;
	    	overflow: auto;
		    background-color: #F7F7F7;
		    text-align: left;
		    padding: 20px;
		    font-size: 14px;
		    .order-info-item{
		    	background: #ffffff;
			    border-radius: 5px;
			    padding: 10px 20px;
			    margin-bottom: 10px;
			    .order-item{
					padding: 10px 0;
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
		    }
		}
	}
</style>