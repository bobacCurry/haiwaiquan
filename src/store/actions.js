import API from '_api'

const actions = {

	async setLoading({ commit, state }, payload){

		commit('setLoading',payload)
	},
	async setAccount({ commit, state }, payload){

		commit('setAccount',payload)
	},
	async setAddress({ commit, state }, { show, info }){

		commit('setAddress', { show, info })
	},
	async getUser({ commit, state }){

		const { data } = await API.user.getUser()

		if (data.success) {

			commit('getUser',data.data)
		
		}else{

			commit('getUser',null)
		}
	},
	async getInfoList({ commit, state }){

		const { data } = await API.info.getInfoList()

		if (data.success) {

			commit('getInfoList', data.data)

		}else{

			commit('getInfoList', [])
		}
	}
}

export default actions