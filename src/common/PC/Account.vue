<template>
	<div>
		<Overlay :show="true" z-index="100" @click="$store.dispatch('setAccount',null)">
			<div class="wrapper">
		    	<div class="account-frame" @click.stop>
		    		<div class="login-frame" v-if="show==='login'">
		    			<h1>登陆海外圈</h1>
		    			<div class="input-frame">
			    			<Field placeholder="请输入用户名" size="large" v-model="login_account"/>
			    		</div>
			    		<div class="input-frame">
			    			<Field placeholder="请输入密码" type="password" v-model="login_password" size="large"/>
			    		</div>
			    		<div class="text-frame">
			    			<Popover trigger="click" v-model="showForget" placement="top">
			    				<div class="forget-frame">
			    					重置密码请联系 <a href="https://t.me/guevaratech" target="_blank">管理员</a>
			    				</div>
			    				<template #reference>
			    					<b style="cursor: pointer;">忘记密码?</b>
			    				</template>
				    		</Popover>
			    		</div>
			    		<div class="button-frame">
			    			<Button type="primary" size="large" style="width: 100%" @click="login()">登陆</Button>
			    		</div>
			    		<div class="text-frame">
			    			<a @click="$store.dispatch('setAccount','register')" style="cursor: pointer;">没有账号？立即注册</a>
			    		</div>
		    		</div>
		    		<div class="register-frame" v-if="show==='register'">
		    			<h1>注册海外圈</h1>
		    			<div class="input-frame">
			    			<Field placeholder="请输入用户名，数字字母和下划线" :formatter="formatter" size="large" v-model="register_account"/>
			    		</div>
			    		<div class="input-frame">
			    			<Field placeholder="请输入密码" type="password" size="large" v-model="register_password"/>
			    		</div>
			    		<div class="input-frame">
			    			<Field placeholder="请再次输入密码" type="password" size="large" v-model="register_password_confirm"/>
			    		</div>
			    		<div class="input-frame">
			    			<Field placeholder="请输入验证码" size="large" v-model="register_captcha"/>
			    		</div>
			    		<div class="text-frame">
				    		<div v-html="captcha.data" @click="getCaptcha()"></div>
				    	</div>
			    		<div class="button-frame">
			    			<Button type="primary" size="large" style="width: 100%" @click="register()">注册</Button>
			    		</div>
			    		<div class="text-frame">
			    			<a @click="$store.dispatch('setAccount','login')" style="cursor: pointer;">已有账号？立即登陆</a>
			    		</div>
		    		</div>
		    	</div>
		  	</div>
		</Overlay>
	</div>
</template>
<script>
import { Image as VanImage, Overlay, Field, Popover, Button, Notify } from 'vant'
import { setToken } from '@/libs/util'
import API from '_api'
export default {
	name: 'Account',
	components:{ Overlay, Field, Popover, Button, VanImage },
	data(){
		return {
			showForget: false,
			captcha:{ data: '', key:'' },
			login_account:'',
			login_password:'',			
			register_account:'',
			register_password:'',
			register_captcha:'',
			register_key:'',
			register_password_confirm:''
		}
	},
	computed:{
		loading(){
			return this.$store.state.loading
		},
		show(){
			return this.$store.state.showAccount
		}
	},
	async mounted(){

		if (this.show) {

			await this.getCaptcha()
		}
	},
	methods:{
		async getCaptcha(){

			this.captcha = { data: '', key:'' }

			const { data } =  await API.user.getCaptcha()

			if (data.success) {

				this.captcha = data.captcha
			}
		},
		async register(){

			if (this.register_password_confirm.trim()!==this.register_password.trim()) {

				return Notify({ type: 'danger', message: '请保持密码输入一致' })
			}

			if (!this.register_account.trim()||!this.register_password.trim()||!this.register_captcha.trim()) {

				return Notify({ type: 'danger', message: '注册参数缺失' })
			}

			this.register_key = this.captcha.key

			const { data } =  await API.user.register(this.register_account,this.register_password,this.register_captcha,this.register_key)

			if (!data.success) {

				return  Notify({ type: 'danger', message: data.message })
			}

			Notify({ type: 'success', message: '注册成功！' });

			this.$store.dispatch('setAccount','login')

		},
		async login(){

			if (!this.login_account.trim()||!this.login_password.trim()) {

				return Notify({ type: 'danger', message: '登陆参数缺失' })
			}

			const { data } =  await API.user.login(this.login_account,this.login_password)

			if (!data.success) {

				return  Notify({ type: 'danger', message: data.message })
			}

			setToken(data.data.token)

			this.$store.dispatch('getUser')

			this.$store.dispatch('getInfoList')

			Notify({ type: 'success', message: '登陆成功！' })

			this.$store.dispatch('setAccount', null)
		},
		formatter(value){

			return value.replace(/[^\w_]/g,'')
		}
	}
}
</script>
<style lang="scss" scoped>
  	.wrapper{
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    width: 100%;
	    height: 100%;
  	}
  	.account-frame{
	    width: 400px;
	    background-color: #fff;
	    border-radius: 10px;
	    text-align: left;
	    .input-frame{
	    	width: 100%;
	    	border:1px solid #e4e4e4;
	    	margin-top: 30px;
	    	border-radius: 10px;
	    	overflow: hidden;
	    	&:hover{
	    		border:1px solid #fc6923;
	    	}
	    }
	    .text-frame{
	    	color: rgba(0,0,0,.5);
	    	margin-top: 30px;
	    }
	    .button-frame{
	    	margin-top: 30px;
	    }
	    .login-frame{
	    	padding: 30px;
	    }
	    .register-frame{
	    	padding: 30px;
	    }
  	}
  	.forget-frame{
    	padding: 10px;
    	background: #ffffff;
    }
</style>