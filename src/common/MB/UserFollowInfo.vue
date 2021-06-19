<template>
	<div class="black-frame">
		<div class="shop-list row-between-center">
			<div class="shop-item" v-for="(item,key) in items" :key="key">
				<router-link :to="`/shop/${item.shop._id}`">
					<div class="shop-logo-frame">
						<VanImage :src="item.shop.logo" width="100%" height="120px" fit="cover"/>
						<div class="shop-tag"><Tag type="primary">{{ SERVICETYPE[item.shop.type-1].name }}</Tag></div>
					</div>
				</router-link>
			</div>
		</div>
	</div>
</template>
<script>
	import API from '_api'
	import { Image as VanImage, Tag } from 'vant'
	import { SERVICETYPE } from '_config/shop'
	export default {
		components:{ VanImage, Tag },
		async mounted(){

			this.$store.dispatch('setLoading',true)

			await this.userFollow()

			this.$store.dispatch('setLoading',false)
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
	.black-frame{
		padding-top: 10px;
		.shop-list{
    		@extend .flex-wrap;
    		.shop-item{
	    		width: 49%;
	    		margin-bottom: 20px;
	    		.shop-logo-frame{
	    			position: relative;
	    			.shop-tag{
	    				position: absolute;
	    				top: 3px;
	    				right: 3px;
	    			}
	    		}
	    	}
    	}
	}
</style>