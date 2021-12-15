<template>
	<div class="page-frame">
		<div class="shop-list-frame">
			<ShopList :type="$route.params.type" :items="items" :loading="loading" :hasMore="hasMore" @search="search()"/>
		</div>
	</div>
</template>
<script>
	import ShopList from '_common/MB/ShopList'
	import API from '_api'
	export default {
		name: 'Service',
		components:{ ShopList },
		data(){
			return {
				items: [],
				loading: false,
				hasMore: true,
				param: {
					page: 1,
					rows: 20,
					type: this.$route.params.type
				}
			}
		},
		async mounted(){

			this.$store.dispatch('setLoading',true)

			await this.search()

			this.$store.dispatch('setLoading',false)
		},
		methods:{

			async search(){

				this.loading = true

				const { data } = await API.show.getTypeShops(this.param)

				if (!data.success) {

					return Notify({ type: 'danger', message: data.message })
				}

				this.loading = false

				if (data.data.length<this.param.rows) {

					this.hasMore = false
				}

				this.param.page++

				this.items.push(...data.data)
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss";
	.page-frame{
		background: $PAGEBACKGROUND;
		min-height: 100vh;
		overflow: auto;
	}
</style>