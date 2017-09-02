<template>
<div class="">
    <el-tree
        :data="nodes"
        :show-checkbox="setting.showCheckbox"
        :node-key="setting.idKey"
        :empty-text="'暂无数据'"
        :check-strictly="setting.checkStrictly"
        ref="tree"
        :props="{children: setting.childrenKey, label: setting.label}"
        :style="{border: 'none'}"
        @check-change="change">
    </el-tree>
    <div class="" @click="test">点击测试</div>
    <!-- <el-button type="success" @click="test">点击测试{{countAlias}}</el-button> -->
        <!-- :default-expanded-keys="expanded" -->

</div>



</template>
<script>
import propsync from '../plugin/propsync'
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
                showCheckbox: true,
                // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
                checkStrictly: false
            },
            propsync: false
        },
        // nodes数据
        nodesArray: {
            type: Array,
            default: []
        },
        // 选中项
        checked: {
            type: Array,
            default: [],
            propsync: true
        }
    },
    methods: {
        // 点击选择终端类型
        change() {
            let that = this
            if (!that.oneExcue) {
                that.oneExcue = true
                setTimeout(function() {
                    that.oneExcue = false
                    that.p_checked = that.$refs.tree.getCheckedKeys()
                }, 300)
            }
        },
        test() {
            let that = this
            console.log('测试')
        },
        setCheckedKeys(keys) {
            this.$refs.tree.setCheckedKeys(keys)
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
            nodesArray.forEach(function(item, i) {
                tmpMap[item[id]] = item
            })

            nodesArray.forEach(function(item, i) {
                if (tmpMap[item[pid]] && item[id] !== item[pid]) {
                    if (!tmpMap[item[pid]][children]) {
                        tmpMap[item[pid]][children] = []
                    }
                    tmpMap[item[pid]][children].push(item)
                    delete item[pid]
                } else {
                    delete item[pid]
                    r.push(item)
                }
            })
            return r
        }
    },
    watch: {
        // 监听父组件的数据
        checked(curVal, oldVal) {
            let that = this
            if (curVal === oldVal) {
                return
            } else {
                that.$refs.tree.setCheckedKeys(curVal)
            }
        },
        // 初始化
        nodesArray(curVal, oldVal) {
            let that = this
            if (curVal === oldVal) {
                return
            } else {
                that.nodes = that.transformToTreeNodes(curVal, that.setting)
            }
        }
    },
    mounted () {
        let that = this
        if (that.nodesArray.length > 0) {
            that.nodes = that.transformToTreeNodes(that.nodesArray, that.setting)
        }
        if (that.checked.length > 0) {
            that.setCheckedKeys(that.checked)
        }
    }
}
</script>