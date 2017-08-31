<template>
  <div class="" style="padding-top:45px;">
    <tester-top :title="title" :has-back="true"></tester-top>
    <div class="">{{countAlias}}</div>
    <div class="">{{anotherCount}}</div>
    <div class="">{{aaa}}</div>
    <div class="main">
        <router-link to="/test"><el-button type="success">测试页面</el-button></router-link>
        <router-link to="/product/fff"><el-button type="success">产品</el-button></router-link>
        <el-button type="success" @click="test">点击测试</el-button>
    </div>

  </div>
</template>

<script>
import testerTop from '@/components/tester'

export default {
    data() {
            let that = this
            return {
                title: '测试页面',
                mData: 1,
                cData: 2
            }
        },
        methods: {
            bar: function() {
                // this.$store.commit('ADD', 10)
                this.$store.dispatch('ADD', 10)
            },
            test: function() {
                // this.$store.commit('ADD', 10)
                this.$store.dispatch('ADD', 10)
            }
        },
        components: {
            testerTop
        },
        computed: {
            // 组建内对象
            aaa() {
                return '普通计算属性'
            },
            anotherCount() {
                return this.$store.getters.anotherCount
            },
            countAlias() {
                return this.$store.state.count
            }
        },
        // https://vuefe.cn/v2/api/#选项-生命周期钩子
        beforeCreate() {
            // 在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。
            // console.log(1);
        },
        created() {
            // console.log(2);
        },
        beforeMount() {
            // console.log(3);
        },
        mounted() {
            // console.log(4);this.$store.state.count
            console.log(this.countAlias)
            console.log(this.aaa)
        },
        beforeUpdate() {
            // console.log(5);
        },
        updated() {
            // console.log(6);
        },
        activated() {
            // console.log(7);
        },
        deactivated() {
            // console.log(8);
        },
        beforeDestroy() {
            // console.log(9);
        },
        destroyed() {
            // console.log(10);
        }


}
</script>
<style scoped>

</style>

