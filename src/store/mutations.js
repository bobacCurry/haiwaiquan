const mutations = {

	setLoading(state,payload){

		state.loading = payload	
	},
	setAccount(state,payload){

		state.showAccount = payload
	},
	setAddress(state,{ show, info }){

		state.eidtAddress = info
		
		state.showAddress = show
	},
	getUser(state,payload){

		state.user = payload
	},
	getInfoList(state,payload){

		state.infoList = payload
	}
}

export default mutations