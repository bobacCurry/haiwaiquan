import Home from '@/components/MB/Home'
import Service from '@/components/MB/Service'
import Shop from '@/components/MB/Shop'
const routes = [
	{
      	path: '/',
      	name: 'Home',
      	component: Home,
      	meta:{
      		title:'海外圈-海外华人的圈圈',
            keepAlive: true
      	}
	},
	{
      	path: '/service/:type',
      	name: 'Service',
      	component: Service,
      	meta:{
      		title:'海外圈-商店服务',
                  keepAlive: true
      	}
	},
      {
            path: '/shop/:_id',
            name: 'Shop',
            component: Shop,
            meta:{
                  title:'海外圈-店铺信息'
            }
      }
]
export default routes