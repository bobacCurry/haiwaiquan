<template>
	<div class="page-frame">
		<Header/>
		<div class="shop-list-frame">
			<div class="zone-frame">
				<ShopList :type="$route.params.type"/>
			</div>
		</div>
	</div>
</template>
<script>
	import Header from '_common/PC/Header'
	import ShopList from '_common/PC/ShopList'
	import { Image as VanImage, Rate } from 'vant'
	export default {
		name: 'Service',
		components:{ VanImage, Rate, Header, ShopList },
		data(){
			return {
				
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss";
	.page-frame{
		background: $PAGEBACKGROUND;
		min-height: 100vh;
		.zone-frame{
			padding: 30px 120px;
			background: $ZONEBACKGROUND;
		}
		.shop-list-frame{
			margin-top: 20px;
			text-align: left;
		}
	}
</style>