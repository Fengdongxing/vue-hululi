// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router/router'
import App from './App'

// 引用 ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)

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