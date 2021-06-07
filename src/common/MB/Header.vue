<template>
	<div class="header-frame">
		<NavBar :title="title" left-arrow  @click-left="goBack()">
			<template #left>
				<div class="arrow-frame row-start-center">
			    	<Icon name="arrow-left" color="black" size="20"/>
			    </div>
		  	</template>
		</NavBar>
	</div>
</template>
<script>
	import { NavBar, Icon } from 'vant'
	export default {
		name: 'Header',
		components:{ NavBar, Icon },
		props:['title'],
		methods:{
			goBack(){
				this.$router.go(-1)
			}
		}
	}
</script>