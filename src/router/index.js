import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('src/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('src/views/login/index'),
    hidden: true
  },
  {path: '/404', component: () => import('src/views/errorPage/404'), hidden: true},
  {path: '/401', component: () => import('src/views/errorPage/401'), hidden: true},


]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

//  这些router会被权限过滤,不设置meta.roles的话也是看的到的
//  supplizer,admin,super

//  快捷数组
export const level0 = ['supplizer']; //  供应商可见
export const level1 = ['supplizer', 'admin', 'super']; //  三角色都可见
export const level2 = ['admin', 'super'];  //  管理员可见
export const level3 = ['super']; //  超管可见
export const level4 = ['admin', 'super','personal']; //  普通用户
export const level5 = ['sugrade'];//虚拟供应商
export const level6 = ['sugrade', 'admin', 'super'];//虚拟供应商

export const asyncRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: 'profile',
    meta: { roles: level1},
    children: [
      {
        path: 'profile',
        name: 'ProfileIndex',
        component: () => import('src/views/profile/index'),
        meta: {title: '概览', icon: 'gailan', noCache: true, roles: level1}
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: 'order',
    alwaysShow: true,
    name: 'Order',
    meta: {title: '订单', icon: 'dingdan', roles: level6},
    children: [
      {
        path: 'order',
        name: 'OrderIndex',
        component: () => import('src/views/order/index'),
        meta: {title: '所有订单', noCache: false, icon: 'yes', roles: level6}
      }, {
        path: 'orderDetail',
        name: 'OrderDetail',
        hidden: true,
        component: () => import('src/views/order/orderDetail'),
        meta: {title: '订单详情', noCache: true, roles: level6}
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/distributor',
    alwaysShow: true,
    name: 'DistributorPa',
    meta: {title: '用户', icon: 'huiyuan', roles: level6},
    children: [
      {
        path: 'suppliers',
        name: 'Suppliers',
        component: () => import('src/views/user/suppliers'),
        meta: {title: '供应商', icon: 'yes', noCache: true, roles: level6}
      }, {
        path: 'supplierEdit',
        name: 'SupplierEdit',
        hidden: true,
        component: () => import('src/views/user/supplierEdit'),
        meta: {title: '供应商编辑', noCache: true, roles: level6}
      },

      {
        path: 'user',
        name: 'User',
        component: () => import('src/views/user/user'),
        meta: {title: '消费者', icon: 'yes', noCache: true, roles: level2}
      },
    ]
  },

  {
    path: '/marketing',
    component: Layout,
    redirect: '/marketing/coupon',
    alwaysShow: true,
    name: 'Marketing',
    meta: {title: '营销', icon: 'yingxiaoshezhi', roles: level1},
    children: [
       {
        path: 'routeBanner',
        name: 'routeBanner',
        component: () => import('src/views/marketing/routeBanner'),
        meta: {title: '轮播图', icon: 'yes', noCache: true, roles: level2}
      }, {
        path: 'richList',
        name: 'richList',
        component: () => import('src/views/marketing/richList'),
        meta: {title: '富文本', icon: 'yes', noCache: true, roles: level2}
      }, {
        path: 'editRich',
        name: 'editRich',
        hidden: true,
        component: () => import('src/views/marketing/editRich'),
        meta: {title: '富文本编辑', noCache: true, roles: level2}
      }
    ]
  },

  {
    path: '/commission',
    component: Layout,
    redirect: 'commission',
    alwaysShow: true,
    name: 'Commission',
    meta: {title: '佣金', icon: 'yongjin', roles: level2},
    children: [
      {
        path: 'commission',
        name: 'CommissionIndex',
        component: () => import('src/views/commission/index'),
        meta: {title: '佣金概览', icon: 'yes', noCache: true, roles: level2}
      }, {
        path: 'commissionSetting',
        name: 'CommissionSetting',
        component: () => import('src/views/commission/commissionSetting'),
        meta: {title: '佣金设置', icon: 'yes', noCache: true, roles: level2}
      },
    ]
  },

  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/index',
    name: 'Setting',
    alwaysShow: true,
    meta: {title: '配置', icon: 'shezhi', roles: level2},
    children: [
       {
        path: 'manager',
        name: 'Manager',
        component: () => import('src/views/setting/manager'),
        meta: {title: '管理员', icon: 'yes', noCache: true, roles: level3}
      },{
        path: 'activationType',
        name: 'activationType',
        component: () => import('src/views/setting/activationType'),
        meta: {title: '活跃分', icon: 'yes', noCache: false, roles: level2},
      }, {
        path: 'rule',
        name: 'rule',
        component: () => import('src/views/setting/rule'),
        meta: {title: '规则', icon: 'yes', noCache: true, roles: level2}
      },
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/draft',
    alwaysShow: true,
    // name: 'personSettingPa',
    meta: {title: '导游素材', icon: 'iconGuide', roles: level4},
    children: [
      {
        path: 'essay',
        name: 'essay',
        component: () => import('src/views/guide/essay'),
        meta: {title: '所有随笔', noCache: true, roles: level4}
      }
    ]
  },

  {
    path: '/ticket',
    component: Layout,
    redirect: '/ticket/index',
    alwaysShow: true,
    // name: 'personSettingPa',
    meta: {title: '商品', icon: 'ticket', roles: level6},
    children: [
      {
        path: 'index',
        name: 'ticket',
        component: () => import('src/views/ticket/index'),
        meta: {title: '商品管理', noCache: true, roles: level6}
      },
      {
        path: 'editTicket',
        name: 'editTicket',
        hidden: true,
        component: () => import('src/views/ticket/editTicket'),
        meta: {title: '商品编辑',noCache: true, roles: level6}
      },
      {
        path: 'purchaseHistory',
        name: 'purchaseHistory',
        hidden: true,
        component: () => import('src/views/ticket/purchaseHistory'),
        meta: {title: '购买记录',noCache: true, roles: level6}
      }
    ]
  },
  {
    path: '/approval',
    component: Layout,
    alwaysShow: true,
    redirect: '/approval/withdrawAudit',
    name: 'Approval',
    meta: {title: '审批', icon: 'shenpi', roles: level1},
    children: [
      {
        path: 'withdrawAudit',
        name: 'WithdrawAudit',
        component: () => import('src/views/approval/withdrawAudit'),
        meta: {title: '提现审批', icon: 'yes', noCache: true, roles: level2}
      },
      {
        path: 'productAudit',
        name: 'ProductAudit',
        component: () => import('src/views/approval/productAudit'),
        meta: {title: '普通商品审批', icon: 'yes', noCache: true, roles: level2}
      },
      {
        path: 'levelAudit',
        name: 'levelAudit',
        component: () => import('src/views/approval/levelAudit'),
        meta: {title: '升级审批', icon: 'yes', noCache: true, roles: level2}
      }
    ]
  },
  {
    path: '/personSetting',
    component: Layout,
    redirect: '/personSetting/withdraw',
    alwaysShow: true,
    // name: 'personSettingPa',
    meta: {title: '设置', icon: 'personSetting', roles: level5},
    children: [
      {
        path: 'personSetting',
        name: 'PersonSetting',
        component: () => import('src/views/personSetting/personSetting'),
        meta: {title: '商户信息', noCache: true, roles: level5}
      },{
        path: 'withdraw',
        name: 'Withdraw',
        component: () => import('src/views/personSetting/withdraw'),
        meta: {title: '提现', noCache: true, roles: level5}
      },
      // {
      //   path: 'balance',
      //   name: 'Balance',
      //   component: () => import('src/views/personSetting/balance'),
      //   meta: {title: '结算', noCache: true, roles: level5}
      // },
    ]
  },


  {path: '*', redirect: '/404', hidden: true},
]
