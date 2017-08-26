import Vue from 'vue'
import Router from 'vue-router'
import hello from '@/components/hello'
import test from '@/pages/test'
import index from '@/pages/index.vue'
import login from '@/pages/login.vue'
import product from '@/pages/product.vue'
import map from '@/pages/map.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    scrollBehavior (to, from, savedPosition) {
        console.log(to);
        console.log(from);
        console.log(savedPosition);
        if (savedPosition) {
            return savedPosition
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    },
    // redirect: '/test',
    routes: [
        // 首页
        {
            path: '/',
            name: 'index',
            component: index,
            meta: {
                keepAlive: true
            }
        },
        // 产品页
        {
            path: '/product/:id',
            name: 'product',
            component: product
        },
        // 登录页
        {
            path: '/login',
            name: 'login',
            component: login
        },
        // 404
        {
            path: '/hello',
            name: 'hello',
            component: hello
        },
        // 地图
        {
            path: '/map',
            name: 'map',
            component: map
        },
        // 测试页面
        {
            path: '/test',
            name: 'test',
            component: test
        }
    ]
})
