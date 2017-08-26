<template>
    <el-tree
        :data="nodes"
        :show-checkbox="setting.showCheckbox"
        :node-key="setting.idKey"
        ref="tree"
        :default-expanded-keys="expanded"
        :default-checked-keys="checked"
        :props="{children: setting.children, label: setting.label}"
        :style="{border: 'none'}"
        @check-change="change">
    </el-tree>
</template>
<script>
import propsync from '../plugin/propsync'

let timeoutFn


export default {
    data: function () {
        return {
            nodes: []
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
                children: 'children',
                // 显示的文字
                label: function (data, node) {
                    return data.label + '(' + data.value + ')'
                },
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
            propsync: true
        },
        // 展开项目
        expanded: {
            type: Array,
            default: [],
            propsync: true
        }
    },
    methods: {
        // 点击选择终端类型
        change(data, checked, indeterminate) {
            let that = this
            // 函数节流 不重复执行
            if (!timeoutFn) {
                timeoutFn = setTimeout(function () {
                    that.p_checked = that.$refs.tree.getCheckedKeys()
                }, 300)
            } else {
                clearTimeout(timeoutFn)
                timeoutFn = setTimeout(function () {
                    timeoutFn = false
                    that.p_checked = that.$refs.tree.getCheckedKeys()
                }, 300)
            }
        },
        test() {
            let that = this
            console.log('测试')
        },
        transformToNodesArray(nodes, pNodeId = null) {
            var that = this
            var r = []
            if (Array.isArray(nodes)) {
                // 如果是数组 先处理成对象
                this.nodes.forEach(function(node) {
                    r = r.concat(that.transformToNodesArray(node))
                })
            } else {
                // 如果是对象
                let childKey = that.setting.children
                if (nodes[childKey]) {
                    let childrenData = [...nodes[childKey]]
                    delete nodes[childKey]
                    childrenData.forEach(function(node) {
                        r = r.concat(that.transformToNodesArray(node, nodes.id))
                    })
                }
                nodes.pid = pNodeId
                r.push(nodes)
            }
            return r
        },
        // 把array格式转化为tree格式
        transformToTreeNodes(arr) {
            let that = this
            let idKey = that.setting.idKey
            let pIdKey = that.setting.pIdKey
            let childKey = that.setting.children

            var nodesArray = JSON.parse(JSON.stringify(arr)) // 深拷贝数组

            var r = []
            var tmpMap = []
            for (let i = 0, l = nodesArray.length; i < l; i++) {
                tmpMap[nodesArray[i][idKey]] = nodesArray[i]
            }
            for (let i = 0, l = nodesArray.length; i < l; i++) {
                if (tmpMap[nodesArray[i][pIdKey]] && nodesArray[i][idKey] !== nodesArray[i][pIdKey]) {
                    if (!tmpMap[nodesArray[i][pIdKey]][childKey]) {
                        tmpMap[nodesArray[i][pIdKey]][childKey] = []
                    }
                    tmpMap[nodesArray[i][pIdKey]][childKey].push(nodesArray[i])
                    delete nodesArray[i][pIdKey]
                } else {
                    delete nodesArray[i][pIdKey]
                    r.push(nodesArray[i])
                }
            }
            // console.log(that.nodesArray[2].children)
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
                console.log('监听父组件的checked')
                that.$refs.tree.setCheckedKeys(curVal)
            }
        },
        // 初始化
        nodesArray(curVal, oldVal) {
            let that = this
            if (curVal === oldVal) {
                return
            } else {
                that.nodes = that.transformToTreeNodes(curVal)
            }
        }
    },
    mounted () {
        // let that = this
    }
}
</script>