import Home from '@/components/MB/Home'
import Service from '@/components/MB/Service'
import Shop from '@/components/MB/Shop'
import User from '@/components/MB/User'
const routes = [
	{
      	path: '/',
      	name: 'Home',
      	component: Home,
      	meta:{
      		title:'菲圈-海外华人的圈圈',
            keepAlive: true
      	}
	},
	{
      	path: '/service/:type',
      	name: 'Service',
      	component: Service,
      	meta:{
      		title:'菲圈-商店服务',
                  keepAlive: true
      	}
	},
      {
            path: '/shop/:_id',
            name: 'Shop',
            component: Shop,
            meta:{
                  title:'菲圈-店铺信息'
            }
      },
      {
            path: '/user/:active',
            name: 'User',
            component: User,
            meta:{
                  title:'菲圈-个人中心',
            }
      }
]
export default routes