// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router/router'
import App from './App'

// 引用 ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)

import VueResource from 'vue-resource'
Vue.use(VueResource)
// VueResource 拦截器
Vue.http.interceptors.push(function(request, next) {
    // request.params.xxx = 'aaaaa';
    // ...
    // 请求发送前的处理逻辑
    // ...
    next(function(response) {
        // ...
        // 请求发送后的处理逻辑
        // ...
        // 根据请求的状态，response参数会返回给successCallback或errorCallback
        return response
    })
})




// 设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false

// 初始化
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {
        App
    }
})
