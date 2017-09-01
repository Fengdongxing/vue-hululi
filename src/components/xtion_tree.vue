<template>
<div class="">
    
    <el-tree
        :data="nodes"
        :show-checkbox="setting.showCheckbox"
        :node-key="setting.idKey"
        ref="tree"
        :props="{children: setting.childrenKey, label: setting.label}"
        :style="{border: 'none'}"

        :default-checked-keys="checked"
        @check-change="change">
    </el-tree>
    <div class="" @click="test">点击测试</div>
    <!-- <el-button type="success" @click="test">点击测试{{countAlias}}</el-button> -->
        <!-- :default-expanded-keys="expanded" -->

</div>



</template>
<script>
import propsync from '../plugin/propsync'

let timeoutFn


export default {
    data: function () {
        return {
            nodes: [],
            oneExcue: false, // 过滤check-change事件多次触发问题
            treeData: [{
                label: '一级 1',
                children: [{
                    label: '二级 1-1',
                    children: [{
                        label: '三级 1-1-1'
                    }]
                }]
            }, {
                label: '一级 2',
                children: [{
                    label: '二级 2-1',
                    children: [{
                        label: '三级 2-1-1'
                    }]
                }, {
                    label: '二级 2-2',
                    children: [{
                        label: '三级 2-2-1'
                    }]
                }]
            }, {
                label: '一级 3',
                children: [{
                    label: '二级 3-1',
                    children: [{
                        label: '三级 3-1-1'
                    }]
                }, {
                    label: '二级 3-2',
                    children: [{
                        label: '三级 3-2-1'
                    }]
                }]
            }]
        }
    },
    mixins: [propsync],
    props: {
        // 配置
        setting: {
            type: Object,
            required: true,
            default: {
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
            propsync: false
        },
        // nodes数据
        nodesArray: {
            type: Array,
            default: [],
            propsync: true
        },
        // 选中项
        checked: {
            type: Array,
            default: [],
            // propsync: true
        },
        // // 展开项目
        // expanded: {
        //     type: Array,
        //     default: [],
        //     // propsync: true
        // }
    },
    methods: {
        // 点击选择终端类型
        change(data, checked, indeterminate) {
            let that = this
            if (!that.oneExcue) {
                that.oneExcue = true
                setTimeout(function() {
                    that.oneExcue = false
                    console.log(that.$refs.tree.getCheckedKeys())
                }, 300)
            }
        },
        test() {
            let that = this
            console.log('测试')
        },
        // 把tree格式转化为array格式
        transformToNodesArray(nodes, setting, pNodeId = null) {
            let that = this
            let id = setting.idKey
            let pid = setting.pIdKey
            let children = setting.childrenKey

            let nodesArray = JSON.parse(JSON.stringify(nodes)) // 深拷贝数组
            var r = []
            if (Array.isArray(nodesArray)) {
                // 如果是数组 先处理成对象
                this.nodesArray.forEach(function(node) {
                    r = r.concat(that.transformToNodesArray(node, setting))
                })
            } else {
                // 如果是对象
                if (nodesArray[children]) {
                    let childrenData = [...nodesArray[children]]
                    delete nodesArray[children]
                    childrenData.forEach(function(node) {
                        r = r.concat(that.transformToNodesArray(node, setting, nodesArray[id]))
                    })
                }
                nodesArray[pid] = pNodeId
                r.push(nodesArray)
            }
            return r
        },
        // 把array格式转化为tree格式
        transformToTreeNodes(arr, setting) {
            let that = this
            let id = setting.idKey
            let pid = setting.pIdKey
            let children = setting.childrenKey

            var nodesArray = JSON.parse(JSON.stringify(arr)) // 深拷贝数组

            var r = []
            var tmpMap = []
            for (let i = 0, l = nodesArray.length; i < l; i++) {
                tmpMap[nodesArray[i][id]] = nodesArray[i]
            }
            for (let i = 0, l = nodesArray.length; i < l; i++) {
                if (tmpMap[nodesArray[i][pid]] && nodesArray[i][id] !== nodesArray[i][pid]) {
                    if (!tmpMap[nodesArray[i][pid]][children]) {
                        tmpMap[nodesArray[i][pid]][children] = []
                    }
                    tmpMap[nodesArray[i][pid]][children].push(nodesArray[i])
                    delete nodesArray[i][pid]
                } else {
                    delete nodesArray[i][pid]
                    r.push(nodesArray[i])
                }
            }
            // console.log(that.nodesArray[2].children)
            return r
        }
    },
    watch: {
        // // 监听父组件的数据
        // checked(curVal, oldVal) {
        //     let that = this
        //     if (curVal === oldVal) {
        //         return
        //     } else {
        //         console.log('监听父组件的checked')
        //         that.$refs.tree.setCheckedKeys(curVal)
        //     }
        // },
        // 初始化
        nodesArray(curVal, oldVal) {
            let that = this
            if (curVal === oldVal) {
                return
            } else {
                that.nodes = that.transformToTreeNodes(curVal, that.setting)
                // console.log(that.transformToNodesArray(that.nodes, that.setting))
            }
        }
    },
    mounted () {
        let that = this

    }
}
</script>