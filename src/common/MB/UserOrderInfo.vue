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
						<Button class="order-action" type="info" @click="orderInfo=item;showInfo=true">查看</Button>
						<Button class="order-action" type="danger" v-if="[0,1].indexOf(item.status)!==-1" @click="cancelOrderUser(item)">撤单</Button>
						<Button class="order-action" type="primary" v-if="item.status===3" @click="finishOrder(item._id)">订单完成</Button>
						<Button class="order-action" type="primary" v-if="item.status===4&&!item.comment" @click="review.orderid=item._id;showReview=true">评价</Button>
					</div>
				</div>
				<Pagination v-model="params.page" :items-per-page="params.rows" :total-items="total" @change="getUserOrder()"/>
			</div>
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
					rows: 10
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
		.wrapper{
			display: flex;
		    align-items: center;
		    justify-content: center;
		    width: 100%;
		    height: 100%;
		    .review-info-frame{
		    	width: 350px;
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
		    	width: 300px;
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
	}
</style>