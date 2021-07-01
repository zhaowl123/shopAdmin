import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { AppRouteRecordRaw } from './types'
import type { App } from 'vue'
import { getParentLayout } from './utils'

/* Layout */
const Layout = () => import('../layout/index.vue')

/**
* redirect: noredirect        当设置 noredirect 的时候该路由在面包屑导航中不可被点击
* name:'router-name'          设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
* meta : {
    hidden: true              当设置 true 的时候该路由不会再侧边栏出现 如404，login等页面(默认 false)
    alwaysShow: true          当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式，
                              只有一个时，会将那个子路由当做根路由显示在侧边栏，
                              若你想不管路由下面的 children 声明的个数都显示你的根路由，
                              你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，
                              一直显示根路由(默认 false)
    title: 'title'            设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'          设置该路由的图标
    noCache: true             如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    breadcrumb: false         如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
    affix: true               如果设置为true，则会一直固定在tag项中(默认 false)
    noTagsView: true           如果设置为true，则不会出现在tag中(默认 false)
    activeMenu: '/dashboard'  显示高亮的路由路径
    followAuth: '/dashboard'  跟随哪个路由进行权限过滤
    showMainRoute: true       设置为true即使hidden为true，也依然可以进行路由跳转(默认 false)
    followRoute: '/dashboard' 为路由设置跟随其他路由的权限
  }
**/

export const constantRouterMap: AppRouteRecordRaw[] = [
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/redirect/:path*',
  //       component: () => import('_c/Redirect/index.vue'),
  //       meta: {}
  //     }
  //   ],
  //   meta: {
  //     hidden: true
  //   }
  // },
  {
    path: '/404',
    component: () => import('_c/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('_v/login/index.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: '登录',
      noTagsView: true
    }
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/shop/shop1/shoplist',
  //   name: 'Root',
  //   meta: {
  //     hidden: true
  //   }
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/shop/shoplist',
    // redirect: '/shop/shopdetail',
    name: 'Root',
    meta: {
      title: '目录',
      icon: 'nested',
      // noCache: true,
    }
  },
  {
    path: '/shop',
    name: 'Shop',
    component: Layout,
    redirect: '/shop/shoplist',
    // redirect: '/shop/shopdetail',
    meta: {
      title: '商品管理',
      alwaysShow: true,
      icon: 'list'
    },
    children: [
      {
        path: 'shoplist',
        name: 'Shoplist',
        component: () => import('../views/shop/Shoplist.vue'),
        meta: {
          title: '商品列表'
        }
      },
      {
        path: 'shopdetail',
        name: 'Shopdetail',
        component: () => import('../views/shop/Shopdetail.vue'),
        meta: {
          title: '商品详情',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/record',
    name: 'Record',
    component: Layout,
    redirect: '/record/recordlist',
    meta: {
      title: '订单管理',
      icon:'form',
      alwaysShow: true
    },
    children: [
      {
        path: 'recordlist',
        name: 'Recordlist',
        component: () => import('../views/record/Recordlist.vue'),
        meta: {
          title: '订单列表'
        }
      }
    ]
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Layout,
    redirect: '/statistics/Statisticspage1',
    meta: {
      title: '统计数据',
      alwaysShow: true,
      icon:'chart'
    },
    children: [
      {
        path: 'statisticspage1',
        name: 'Statisticspage1',
        component: () => import('../views/statistics/Statisticspage1.vue'),
        meta: {
          title: '图表1'
        }
      },
      {
        path: 'statisticspage2',
        name: 'Statisticspage2',
        component: () => import('../views/statistics/Statisticspage2.vue'),
        meta: {
          title: '图表2'
        },
      },
      {
        path: 'statisticspage3',
        name: 'Statisticspage3',
        component: () => import('../views/statistics/Statisticspage3.vue'),
        meta: {
          title: '图表3'
        }
      }
    ]
  }
  // {
  //   path: '/external-link',
  //   component: Layout,
  //   meta: {},
  //   children: [
  //     {
  //       path: 'http://8.133.179.48:4000/dist-doc/',
  //       meta: { title: '文档', icon: 'documentation' }
  //     }
  //   ]
  // }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/user',
    name: 'User',
    // component: getParentLayout('User'),
    component: Layout,
    redirect: '/user/userlist',
    meta: {
      title: '用户管理',
      alwaysShow: true,
      icon:'user',
    },
    children: [{
      path: 'userlist',
      name: 'Userlist',
      component: () => import('../views/user/Userlist.vue'),
      meta: {
        title: '用户列表'
      }
    }]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[]
})

export function resetRouter(): void {

  const resetWhiteNameList = [ 
    'Redirect',
    'NoFind',
    'Login',
    'Root',
    'Shop',
    'Shoplist',
    'Shopdetail',
    // 'Order',
    // 'Orderlist',
    'record',
    'Recordlist',
    'Statistics',
    'Statisticspage1',
    'Statisticspage2',
    'Statisticspage3'
  ]

  router.getRoutes().forEach((route) => {
    const { name } = route
    // console.log('1121212   ',name)
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })

  // const resetWhiteNameList = [
  //   'RedirectRoot',
  //   'Redirect',
  //   'Login',
  //   'Root',
  //   'Dashboard',
  //   'Page404'
  // ]
  // router.getRoutes().forEach((route) => {
  //   // console.log('1121212   ',route)
  //   const { name } = route
  //   if (name && !resetWhiteNameList.includes(name as string)) {
  //     router.hasRoute(name) && router.removeRoute(name)
  //   }
  // })
  // console.log('6666666    ',router.getRoutes)
}

export function setupRouter(app: App<Element>) {
  app.use(router)
}

export default router
