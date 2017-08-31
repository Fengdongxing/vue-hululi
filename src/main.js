import Vue from 'vue'
import router from './router/router'
import store from './store/'
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

// 高德地图
import VueAMap from 'vue-amap'
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
    key: '623da38306e25dfbe48142da4d3fbc26',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
    uiVersion: '1.0'
})

// 设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false

// 初始化
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
        App
    }
})
