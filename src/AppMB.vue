<template>
	<div id="app">
		<keep-alive>
		    <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath">
		        <!-- 这里是会被缓存的视图组件，比如 Home！ -->
		    </router-view>
		</keep-alive>
		<router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath">
		    <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
		</router-view>
		<Account v-if="showAccount"/>
		<div class="page-loading row-center-center" v-if="loading">
	    	<div class="loading-icon">
			    <Loading color="#40A6EB" type="spinner"/>
			</div>
		    <div class="loading-mask"></div>
		</div>
	</div>
</template>
<script>
import Account from '_common/MB/Account'
import { Loading } from 'vant'
export default {
	name: 'AppMB',

	components:{ Loading, Account },
	
	computed:{
		
		showAccount(){

			return this.$store.state.showAccount
		},
		showAddress(){
			
			return this.$store.state.showAddress
		},
		loading(){

  			return this.$store.state.loading
  		}
	},
	mounted(){

		this.$store.dispatch('getUser')

		this.$store.dispatch('getInfoList')
	}
}
</script>
<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}
	.page-loading{
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
		width: 100%;
		height: 100%;
		text-align: center;
		.loading-mask{
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			width: 100%;
			height: 100%;
			background: rgba(0,0,0,0.2)
		}
		.loading-icon{
			z-index: 5;
		}
	}
</style>