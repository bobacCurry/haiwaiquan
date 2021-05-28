<template>
	<div class="user-follow-frame">
		<div class="shop-list row-start-center">
			<div class="shop-item" v-for="(item,key) in items" :key="key">
				<router-link :to="`/shop/${item.shop._id}`">
					<div class="shop-logo-frame">
						<VanImage :src="item.shop.logo" width="100%" height="120px" fit="cover"/>
						<div class="shop-tag"><Tag type="primary">{{ SERVICETYPE[item.shop.type-1].name }}</Tag></div>
					</div>
					<div class="row-between-center shop-info">
						<div class="shop-name omit"><b>{{ item.shop.name }}</b></div>
					</div>
				</router-link>
			</div>
		</div>
	</div>
</template>
<script>
	import { Image as VanImage, Tag } from 'vant'
	import { SERVICETYPE } from '_config/shop'
	import API from '_api'
	export default {
		name: 'UserFollow',
		components:{ VanImage, Tag },
		async mounted(){

			await this.userFollow()
		},
		data(){
			return {
				SERVICETYPE,
				items: []
			}
		},
		methods:{
			async userFollow(){

				const { data } = await API.follow.userFollow()

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				this.items = data.data
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss";
	.user-follow-frame{
		height: 80vh;
    	overflow: auto;
    	.shop-list{
    		@extend .flex-wrap;
    		.shop-item{
	    		width: 17%;
	    		margin-right: 3%;
	    		margin-bottom: 20px;
	    		.shop-logo-frame{
	    			position: relative;
	    			.shop-tag{
	    				position: absolute;
	    				top: 3px;
	    				right: 3px;
	    			}
	    		}
	    		.shop-info{
	    			height: 30px;
	    			line-height: 30px;
	    			.shop-name{
	    				padding: 0 5px;
		    			width: 100%;
		    			font-size: 16px;
		    			color: #333333;
		    			border: 1px solid #f7f7f7;
		    		}
	    		}
	    		&:hover{
	    			.shop-name{
	    				background: #f7f7f7;
	    				color: #1989fa;
	    			}
	    		}
	    	}
    	}
	}
</style>