import Home from '@/components/MB/Home'
const routes = [
	{
      	path: '/',
      	name: 'Home',
      	component: Home,
      	meta:{
      		title:'海外圈-海外华人的圈圈',
            keepAlive: true
      	}
	}
]
export default routes