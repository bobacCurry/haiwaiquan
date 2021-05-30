<template>
	<div class="user-order-frame">
		<h1>订单列表</h1>
		<br>
		<div>
			<CheckboxGroup v-model="params.status" @change="getUserOrder()">
				<div class="row-start-center">
					<span v-for="(item,key) in ORDERSTATUS" :key="key" style="margin-right: 10px">
						<Checkbox :name="key" shape="square">{{item}}</Checkbox>
					</span>
				</div>
			</CheckboxGroup>
		</div>
		<div class="order-list-frame" v-if="items.length">
			<div class="order-item order-item-title row-start-center">
				<div class="cell name">商家名称</div>
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
				<div class="cell status warning">{{ ORDERSTATUS[item.status] }}<b v-if="item.comment">(已评)</b></div>
				<div class="cell action row-start-center">
					<Button class="action-button" type="info" size="mini" @click="orderInfo=item;showInfo=true">查看</Button>
					<Button class="action-button" type="danger" size="mini" v-if="[0,1].indexOf(item.status)!==-1" @click="cancelOrderUser(item)">撤单</Button>
					<Button class="action-button" type="primary" size="mini" v-if="item.status===3" @click="finishOrder(item._id)">订单完成</Button>
					<Button class="action-button" type="primary" size="mini" v-if="item.status===4&&!item.comment" @click="review.orderid=item._id;showReview=true">评价</Button>
				</div>
			</div>
			<Pagination v-model="params.page" :items-per-page="params.rows" :total-items="total" @change="getUserOrder()"/>
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
		<Overlay :show="showReview" z-index="150"  @click.stop>
			<div class="wrapper" @click="showReview=false">
				<div class="review-info-frame" @click.stop>
					<div class="order-rate">
						<h3>订单评分</h3>
						<div class="review-item row-start-center">
							<Rate v-model="review.rate" allow-half void-icon="star" size="30" color="#ffd21e" void-color="#eee"/>
							<div class="rate-count">{{ review.rate }} 分</div>
						</div>
					</div>
					<div class="order-text">
						<h3>订单评价</h3>
						<div class="review-item">
							<Field v-model="review.text" rows="3" autosize type="textarea" placeholder="请输入评论内容" maxlength="150" show-word-limit/>
						</div>
					</div>
					<div class="order-pics">
						<h3>图片分享</h3>
						<div class="review-item row-start-center">
							<div class="pics-frame" v-for="(item,key) in review.pics" :key="key">
								<VanImage :src="item" fit="cover" width="100%" height="100%" />
								<div class="del-pics" @click="delPics(key)">
									<Icon name="clear" color="red" size="20"/>
								</div>
							</div>
							<div class="pics-frame row-center-center" v-if="review.pics.length<3">
								<Upload type="review" single="addGoodsPics" @getUrl="addPics">
									<Icon name="add-o" size="80px"/>
								</Upload>
							</div>
						</div>
					</div>
					<div class="review-action row-start-center">
						<Button type="primary" @click="confirmReview()">提交评价</Button>
						<Button type="warning" style="margin-left: 20px;" @click="resetReview()">取消提交</Button>
					</div>
				</div>
			</div>
		</Overlay>
	</div>
</template>
<script>
	import { Button, Image as VanImage, Checkbox, CheckboxGroup, Overlay, Pagination, Dialog, Rate, Field, Icon, Notify } from 'vant'
	import { PAYMENT, DELIVERY, CURRENCY } from '_config/shop'
	import { ORDERSTATUS } from '_config/order'
	import API from '_api'
	import { formatTime } from '@/libs/util'
	import Upload from '_common/BASE/Upload'
	export default {
		name: 'UserOrders',
		components:{ Button, VanImage, Checkbox, CheckboxGroup, Overlay, Pagination, Rate, Field, Icon, Upload },
		filters: {
			formatTime(time){

				return formatTime(time)
			}
		},
		async mounted(){

			this.$store.dispatch('setLoading',true)

			await this.getUserOrder()

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
					page: 1,
					rows: 50
				},
				review: {
					orderid: '',
					rate: 5,
					text: '',
					pics: []
				},
				items: [],
				total: 0,
				orderInfo: '',
				showInfo: false,
				showReview: false
			}
		},
		methods:{
			async getUserOrder(){

				const { data } = await API.order.getUserOrder(this.params)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				const { items, total } = data.data

				this.items = items

				this.total = total
			},
			async cancelOrderUser(order){

				if (order.status===1) {

					Dialog.alert({

					  	title: '通知商家取消订单',
					  	
					  	message: '因为商家已经确认了该订单，所以请通知商家来操作取消订单',

					  	confirmButtonText: '通知商家',
					  	
					  	theme: 'round-button',

					  	closeOnClickOverlay: true
					
					}).then(() => {

						window.open(`https://t.me/${order.shop.telegram}`)
					})

					return
				}

				Dialog.confirm({

				  	title: '操作取消订单',
				  	
				  	message: '您确认要取消该订单吗？',
				
				}).then(async () => {

					const { data } = await API.order.cancelOrderUser(order._id)

					if (!data.success) {

						return Notify({ type: 'danger', message: data.message })
					}

					await this.getUserOrder()

					return Notify({ type: 'success', message: data.message })

				}).catch(() => {

				})
			},
			async finishOrder(_id){

				Dialog.confirm({

				  	title: '订单完成',
				  	
				  	message: '确定已经收到物品并且完成该订单吗？',
				
				}).then(async () => {

					const { data } = await API.order.finishOrder(_id)

					if (!data.success) {

						return Notify({ type: 'danger', message: data.message })
					}

					await this.getUserOrder()

					return Notify({ type: 'success', message: data.message })

				}).catch(() => {

				})
			},
			async addPics(img){

				this.review.pics.push(img)
			},
			async delPics(key){

				this.review.pics.splice(key,1)
			},
			async confirmReview(){

				console.log(this.review)

				if (!this.review.orderid.trim()) {

					return Notify({ type: 'danger', message: '评论订单缺失' })
				}

				if (!this.review.text.trim()) {
					
					return Notify({ type: 'danger', message: '请填写评论内容' })
				}

				const { data } = await API.review.newReview(this.review)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				this.resetReview()

				this.getUserOrder()

				return Notify({ type: 'success', message: data.message })
			},
			async resetReview(){

				this.review = { orderid: '', rate: 5, text: '', pics: [] }

				this.showReview = false
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
	    .review-info-frame{
	    	width: 600px;
	    	height: 550px;
	    	overflow: auto;
	    	background-color: #F7F7F7;
		    text-align: left;
		    padding: 20px;
		    font-size: 14px;
		    .review-item{
		    	margin: 20px 0;
		    	.rate-count{
		    		font-size: 30px;
		    		margin-left: 30px;
		    		font-weight: bold;
		    	}
		    	.pics-frame{
		    		position: relative;
		    		width: 30%;
		    		margin-right: 3%;
		    		height: 100px;
		    		background: #ffffff;
		    		.del-pics{
		    			position: absolute;
		    			top: 0;
		    			right: 0;
		    		}
		    	}
		    }
		    .review-action{
				padding-top: 10px;
			}
	    }
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
				width: 15%;
			}
			.action{
				width: 15%;
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