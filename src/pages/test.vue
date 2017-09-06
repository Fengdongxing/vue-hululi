<template>
  <div class="" style="padding:55px 10px 10px;">
    <tester-top :title="title" :has-back="true"></tester-top>
    <div class="main">
        <router-link to="/test"><el-button type="success">测试页面</el-button></router-link>
        <router-link to="/product/fff"><el-button type="success">产品</el-button></router-link>
        <el-button type="success" @click="test">点击测试{{countAlias}}</el-button>
    </div>

    <div class="">
        <xtion-tree :nodes-array="treeData" :setting="setting" :checked="treeChecked" @onPropsChange="onPropsChange" ref="xtionTree"></xtion-tree>
    </div>

  </div>
</template>

<script>
import testerTop from '@/components/tester'
import xtionTree from '@/components/xtion_tree'

export default {
    data() {
            let that = this
            return {
                title: '测试页面',
                mData: 1,
                setting: {
                    // id
                    idKey: 'id',
                    // 父级id
                    pIdKey: 'pid',
                    // 子项目名字
                    childrenKey: 'children',
                    // 显示的文字
                    label: 'label',
                    // 是否应用checkbox
                    showCheckbox: true
                },
                treeChecked: ['2'],
                treeData: [{
                    label: '1级 1',
                    id: '1',
                    pid: null,
                }, {
                    label: '1级 2',
                    id: '2',
                    pid: null,
                }, {
                    label: '2级 1-1',
                    id: '11',
                    pid: '1',
                }, {
                    label: '2级 1-2',
                    id: '12',
                    pid: '1',
                }, {
                    label: '3级 1-1-1',
                    id: '111',
                    pid: '11',
                }, {
                    label: '4级 1-1-1-1',
                    id: '1111',
                    pid: '111',
                }],
            }
        },
        methods: {
            bar: function() {
                // console.log(555)
            },
            onPropsChange: function (propName, newVal, oldVal) {
                let that = this
                that[propName] = newVal
                // console.log(propName + '属性由' + oldVal + '修改为了' + newVal)
            },
            test: function() {
                // this.$store.commit('ADD', 10)
                this.$store.dispatch('ADD', 10)
            }
        },
        components: {
            testerTop,
            xtionTree
        },
        computed: {
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
            // console.log(this.countAlias)
            // console.log(this.aaa)
            let that = this


            setTimeout(function() {
                // that.treeChecked = ['1']
                that.$refs.xtionTree.setCheckedKeys(['1'])
                // that.treeData = [{
                //     label: '1级 1',
                //     id: '1',
                //     pid: null,
                // }, {
                //     label: '1级 2',
                //     id: '2',
                //     pid: null,
                // }, {
                //     label: '2级 1-1',
                //     id: '11',
                //     pid: '1',
                // }, {
                //     label: '2级 1-2',
                //     id: '12',
                //     pid: '1',
                // }, {
                //     label: '3级 1-1-1',
                //     id: '111',
                //     pid: '11',
                // }, {
                //     label: '4级 1-1-1-1',
                //     id: '1111',
                //     pid: '111',
                // }]
            }, 1000)




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

