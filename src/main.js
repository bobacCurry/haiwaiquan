import Vue from 'vue'

import AppPC from './AppPC.vue'

import AppMB from './AppMB.vue'

import routerMode from './router'

import store from './store/index'

import '~/css/base.scss'

Vue.config.productionTip = false

const clientWidth = document.documentElement.clientWidth

const mode = clientWidth>800?'PC':'MB'

const App = mode==='PC'?AppPC:AppMB

const router = routerMode(mode)

new Vue({

	router,

	store,

	render: h => h(App)

}).$mount('#app')
