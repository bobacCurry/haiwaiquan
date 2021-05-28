<template>
	<div class="review-frame">
		<div class="review-item row-start-top" v-for="(item,key) in items" :key="key">
			<div class="user-info">				
				<VanImage :src="item.user.avatar" width="50" height="50" fit="cover" round/>
				<div>{{ item.user.name }}</div>
			</div>
			<div class="review-info">
				<div class="review-rate">
					<Rate v-model="item.rate" allow-half void-icon="star" size="14" color="#ffd21e" readonly void-color="#eee"/>
				</div>
				<div class="review-pics row-start-center">
					<div class="pic-item" v-for="(pic,key1) in item.pics" :key="key1" @click="lookPics(pic)">
						<VanImage :src="pic" width="100%" height="100%" fit="cover"/>
					</div>
				</div>
				<div class="review-text">
					{{ item.text }}
				</div>
				<div class="review-time">
					{{ item.created_at | formatTime }}
				</div>
				<div class="review-action row-start-center">
					<div class="action-item" v-if="item.ownerid===user._id&&!item.reply"><a @click="reply._id=item._id;reply.key=key;reply.show=true;">回复评论</a></div>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<div class="action-item" v-if="item.user._id===user._id"><a @click="delReview(item._id,key)">删除评论</a></div>
				</div>
				<div v-if="item.reply&&(item.ownerid===user._id)">
					<div class="review-reply">
						<b>商家回复：</b>{{ item.reply }}
					</div>
					<div class="review-action row-start-center">
						<div class="action-item"><a @click="delReply(item._id,key)">删除回复</a></div>
					</div>
				</div>
			</div>
		</div>
		<div class="review-more row-center-center" v-if="hasMore">
			<Button round type="primary" style="width: 150px" :loading="loading" @click="getReview()">查看更多</Button>
		</div>
		<Overlay :show="reply.show" z-index="150">
			<div class="wrapper" @click="reply.show=false">
				<div class="review-info-frame" @click.stop>
					<div class="order-text">
						<h3>回复评价</h3>
						<div class="review-item">
							<Field v-model="reply.text" rows="3" autosize type="textarea" placeholder="请输入回复内容" maxlength="150" show-word-limit/>
						</div>
					</div>
					<div class="review-action row-start-center">
						<Button type="primary" @click="replyReview()">提交评价</Button>
						<Button type="warning" style="margin-left: 20px;" @click="resetReply()">取消提交</Button>
					</div>
				</div>
			</div>
		</Overlay>
	</div>
</template>
<script>
	import { Image as VanImage, Rate, ImagePreview, Button, Dialog, Notify, Overlay, Field } from 'vant'
	import { formatTime } from '@/libs/util'
	import API from '_api'
	export default {
		name: 'Review',
		props:['shopid'],
		components:{ VanImage, Rate, Button, Overlay, Field },
		filters: {
			formatTime(time){

				return formatTime(time)
			}
		},
		async mounted(){

			await this.getReview()
		},
		data(){
			return {
				params: {
					page: 1,
					rows: 50
				},
				items: [],
				hasMore: true,
				loading: false,
				reply: {
					_id: '',
					text: '',
					key: '',
					show: false
				}
			}
		},
		computed:{

			user(){
				
				const user = this.$store.state.user? this.$store.state.user: {}
				
				return user
			}
		},
		methods:{
			async getReview(){

				this.loading = true

				const { data } = await API.review.getReview({ ...this.params, shopid: this.shopid })

				this.loading = false

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				this.params.page++

				if (data.data.length<this.params.rows) {

					this.hasMore = false
				}

				this.items.push(...data.data)

			},
			async lookPics(pics,index){

				ImagePreview({ images: [pics], closeable: true })
			},
			async delReview(_id,key){

				Dialog.confirm({

				  	title: '删除评价',
				  	
				  	message: '确认删除该评价吗？删除后不可恢复',
				
				}).then(async () => {

					const { data } = await API.review.delReview(_id)

					if (!data.success) {

						return Notify({ type: 'danger', message: data.message })
					}

					this.items.splice(key,1)
				
					return Notify({ type: 'success', message: data.message })

				}).catch(() => {

				})
			},
			async replyReview(){

				const { data } = await API.review.replyReview(this.reply._id,this.reply.text)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				this.items[this.reply.key].reply = this.reply.text

				this.resetReply()

				return Notify({ type: 'success', message: data.message })
			},
			async delReply(_id,key){

				Dialog.confirm({

				  	title: '删除回复',
				  	
				  	message: '确认删除该回复吗？',
				
				}).then(async () => {

					const { data } = await API.review.delReply(_id)

					if (!data.success) {

						return Notify({ type: 'danger', message: data.message })
					}

					this.items[key].reply = ''
				
					return Notify({ type: 'success', message: data.message })

				}).catch(() => {

				})
			},
			async resetReply(){

				this.reply = { _id: '', text: '', key: '', show: false }
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss";
	.review-frame{
		min-height: 60vh;
		background: #ffffff;
		padding: 20px 0;
		.review-item{
			margin-bottom: 10px;
			border-bottom: 1px solid #f7f7f7;
			padding: 10px 20px;
			.user-info{
				width: 15%;
			}
			.review-info{
				width: 85%;
				.review-rate, .review-text, .review-pics, .review-reply, .review-time{
					margin-bottom: 10px;
					font-size: 14px;
				}
				.pic-item{
					width: 20%;
					height: 100px;
		    		margin-right: 3%;
				}
				.review-action{
					font-size: 13px;
					.action-item{
						margin-bottom: 10px;
						margin-right: 20px;
						cursor: pointer;
						color: red;
						&:hover{
							color: #07c160;
						}
					}
				}
			}
		}
		.review-more{
			padding: 20px 0;
		}
	}
	.wrapper{
		display: flex;
	    align-items: center;
	    justify-content: center;
	    width: 100%;
	    height: 100%;
	    .review-info-frame{
	    	width: 600px;
	    	height: 350px;
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
	}
</style>