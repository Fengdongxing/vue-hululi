import Vue from 'vue'
import Router from 'vue-router'
import hello from '@/components/hello'
import test from '@/components/test'
import index from '@/pages/index.vue'



Vue.use(Router)

export default new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    },
    routes: [{
        path: '/',
        component: index
    }, {
        path: '/test',
        component: test
    }, {
        path: '/hello',
        component: hello
    }]
})