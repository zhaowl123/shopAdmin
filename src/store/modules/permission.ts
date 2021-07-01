import { asyncRouterMap, constantRouterMap } from '@/router'
import { deepClone } from '@/utils'
import store from '../index'
import { VuexModule, getModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { AppRouteRecordRaw } from '@/router/types'
// import wsCache from '@/cache'
// import { isExternal } from '@/utils/validate'
import path from 'path'
import { appStore } from './app'
import wsCache from '@/cache'
// import { getParentLayout } from '@/router/utils'

// import { appStore } from '@/store/modules/app'

/* Layout */
// const Layout = () => import('@/layout/index.vue')

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
}

@Module({ dynamic: true, namespaced: true, store, name: 'permission' })
class Permission extends VuexModule implements PermissionState {
  public routers = [] as any[]
  public addRouters = [] as any[]
  public isAddRouters = false

  @Mutation
  private SET_ROUTERS(routers: AppRouteRecordRaw[]): void {
    // 动态路由，404一定要放到最后面
    this.addRouters = routers.concat([{
      path: '/:path(.*)*',
      redirect: '/404',
      name: '404',
      meta: {
        hidden: true,
        breadcrumb: false
      }
    }])
    // {
    //   path: '/404',
    //   component: () => import('_c/Error/404.vue'),
    //   name: 'NoFind',
    //   meta: {
    //     hidden: true,
    //     title: '404',
    //     noTagsView: true
    //   }
    // },
    // 渲染菜单的所有路由
    this.routers = deepClone(constantRouterMap, ['component']).concat(routers)
  }
  @Mutation
  private SET_ISADDROUTERS(state: boolean): void {
    this.isAddRouters = state
  }

  @Action
  public GenerateRoutes(): Promise<unknown> {
    return new Promise(resolve => {
      // 路由权限控制
      // console.log('11111111111111111111      ',asyncRouterMap)
      const routerMap: AppRouteRecordRaw[] = generateRoutes(deepClone(asyncRouterMap, ['component']))
      this.SET_ROUTERS(routerMap)
      resolve()
    })
  }
  @Action
  public SetIsAddRouters(state: boolean): void {
    this.SET_ISADDROUTERS(state)
  }
}

// 路由过滤，主要用于权限控制
function generateRoutes(routes: AppRouteRecordRaw[], basePath = '/'): AppRouteRecordRaw[] {
  const res: AppRouteRecordRaw[] = []

  //zwl test
  //临时只有admin权限，非admin不加控制
  if (wsCache.get(appStore.userInfo) !== 'admin'){
    return res
  }
  
  // console.log(routes)

  for (const route of routes) {
    // skip some route
    if (route.meta && route.meta.hidden && !route.meta.showMainRoute) {
      // console.log("11111",route)
      continue
    }

    // let onlyOneChild = null

    // if (route.children && route.children.length === 1 && !route.meta.alwaysShow) {
    //   onlyOneChild = isExternal(route.children[0].path)
    //     ? route.children[0].path
    //     : path.resolve(path.resolve(basePath, route.path), route.children[0].path)
    // }

    let data: any = null

    // 如不需要路由权限，解注释下面一行
    data = Object.assign({}, route)

    // console.log('1111111111111111111',data)

    // recursive child routes
    if (route.children && data) {
      data.children = generateRoutes(route.children, path.resolve(basePath, data.path))
    }
    if (data) {
      res.push(data as AppRouteRecordRaw)
    }
  }
  return res
}

export const permissionStore = getModule<Permission>(Permission)
