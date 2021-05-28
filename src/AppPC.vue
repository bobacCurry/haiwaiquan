<template>
	<div id="app">
		<Account v-if="showAccount"/>
		<Address v-if="showAddress"/>
		<router-view :key="$route.fullPath"></router-view>
	</div>
</template>
<script>
import Account from '_common/PC/Account'
import Address from '_common/PC/Address'
export default {
	
	name: 'AppPC',
	
	components:{ Account, Address },
	
	computed:{
		
		showAccount(){

			return this.$store.state.showAccount
		},
		showAddress(){
			
			return this.$store.state.showAddress
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
</style>