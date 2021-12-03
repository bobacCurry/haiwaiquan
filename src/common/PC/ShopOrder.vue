<template>
	<div class="user-order-frame">
		<div>
			<h1>商铺订单列表</h1>
		</div>
		<br>
		<div class="row-between-center">
			<CheckboxGroup v-model="params.status" @change="getShopOrder()">
				<div class="row-start-center">
					<span v-for="(item,key) in ORDERSTATUS" :key="key" style="margin-right: 10px">
						<Checkbox :name="key" shape="square">{{item}}</Checkbox>
					</span>
				</div>
			</CheckboxGroup>
			<Search v-model="orderId" show-action label="订单码" placeholder="订单查询，输入订单码" class="row-between-center">
				<template #action>
				    <div style="padding: 0 5px;background: #07c160;color: #ffffff" @click="orderSearch()">查询订单</div>
				</template>
			</Search>
		</div>
		<div class="order-list-frame" v-if="items.length">
			<div class="order-item order-item-title row-start-center">
				<div class="cell amount">商家名称</div>
				<div class="cell amount">消费费用</div>
				<div class="cell payment">付款方式</div>
				<div class="cell delivery">配送方式</div>
				<div class="cell time">下单时间</div>
				<div class="cell status">订单状态</div>
				<div class="cell action">操作</div>
			</div>
			<div  class="order-item row-start-center" v-for="(item,key) in items" :key="key">
				<div class="cell name omit">
					<router-link :to="`/shop/${item.shop._id}`">{{ item.shop.name }}</router-link>
				</div>
				<div class="cell amount">{{ item.total }} {{ CURRENCY[item.currency] }}</div>
				<div class="cell payment">{{ PAYMENT[item.payment] }}</div>
				<div class="cell delivery">{{ DELIVERY[item.delivery] }}</div>
				<div class="cell time">{{ item.created_at | formatTime }}</div>
				<div class="cell status warning">{{ ORDERSTATUS[item.status] }}</div>
				<div class="cell action row-start-center">
					<Button class="action-button" type="info" size="mini" @click="orderInfo=item;showInfo=true">查看</Button>
					<Button class="action-button" type="primary" size="mini" v-if="item.status===0" @click="confirm._id=item._id;showConfirm=true">确认接单</Button>
					<Button class="action-button" type="primary" size="mini" v-if="item.status===1" @click="delivery(item._id)">已送出</Button>
					<Button class="action-button" type="primary" size="mini" v-if="item.status===2" @click="arrived(item._id)">已送到</Button>
					<Button class="action-button" type="danger" size="mini" v-if="[0,1].indexOf(item.status)!==-1" @click="cancelOrderShop(item._id)">取消订单</Button>
				</div>
			</div>
			<Pagination v-model="params.page" :items-per-page="params.rows" :total-items="total" @change="getShopOrder()"/>
		</div>
		<div class="order-list-frame" v-else>
			暂无订单
		</div>
		<Overlay :show="showInfo" z-index="150"  @click.stop>
			<div class="wrapper" @click="showInfo=false">
				<div class="order-info-frame" @click.stop>
					<div class="order-info-item">
						<div v-for="(item,key) in orderInfo.items" :key="key" class="order-item row-between-top">
							<div class="row-start-top">
			    				<div class="order-item-pics">
				    				<VanImage :src="item.info.pics" fit="cover" width="120px" height="80px"/>
				    			</div>
			    				<div class="order-item-name">
			    					{{ item.info.code }} {{ item.info.name }} * {{ item.count }}
			    				</div>
			    			</div>
			    			<div>
			    				{{ item.amount }} {{ CURRENCY[orderInfo.currency] }}
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
			</div>
		</Overlay>
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
	import { Button, Image as VanImage, Overlay, Radio, RadioGroup, Checkbox, CheckboxGroup, Pagination, Dialog, Notify, Search } from 'vant'
	import { PAYMENT, DELIVERY, CURRENCY } from '_config/shop'
	import { ORDERSTATUS } from '_config/order'
	import API from '_api'
	import { formatTime } from '@/libs/util'
	export default {
		name: 'ShopOrders',
		components:{ Button, VanImage, Radio, RadioGroup, Checkbox, CheckboxGroup, Overlay, Pagination, Dialog: Dialog.Component, Search },
		filters: {
			formatTime(time){

				return formatTime(time)
			}
		},
		async mounted(){

			this.params.shop = this.$route.query._id

			if (this.$route.query.unfinished==='1') {

				this.params.status = []
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
				showConfirm: false,
				orderId: ''
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
			},
			async orderSearch(){

				const { data } = await API.order.getOrder({ orderId: this.orderId, shopId: this.params.shop })

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				const { items, total } = data.data

				this.items = items

				this.total = total
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss";
	.wrapper{
		display: flex;
	    align-items: center;
	    justify-content: center;
	    width: 100%;
	    height: 100%;
	    .order-info-frame{
	    	width: 600px;
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
	.order-list-frame{
		height: 70vh;
		overflow: auto;
		padding-top: 20px;
		.order-item-title{
			font-weight: bold;
			font-size: 16px;
			border-top:  1px solid #f7f7f7;
		}
		.order-item{
			text-align: center;
			.cell{
				padding: 10px 5px;
				border-right:  1px solid #f7f7f7;
				border-bottom: 1px solid #f7f7f7;
			}
			.name{
				width: 15%;
				border-left:  1px solid #f7f7f7;
			}
			.amount{
				width: 15%;
			}
			.payment{
				width: 10%;
			}
			.delivery{
				width: 10%;
			}
			.time{
				width: 20%;
			}
			.status{
				width: 10%;
			}
			.action{
				width: 20%;
				.action-button{
					margin-right: 5px;
				}
			}
			.warning{
				color: red;
			}
		}
	}
</style>