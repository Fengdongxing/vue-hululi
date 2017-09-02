<template>
    <div class="xt-tree-view-container" :style="viewStyle">
        <div v-if="multiselectable" class="check-values" @click="triggerDownContent">
           {{checkVals}}
            <i v-if="multiselectable" class="el-icon-caret-bottom spe-parentOrg-down-btn"></i>
        </div>
        <el-input
          v-if="searchable"
          v-show="unfold"
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          style="marginBottom:5px">
        </el-input>
        <!-- 
          current-node-key: 设置当前选中节点（会高亮），值对应node-key
        -->
        <el-tree
          v-if="treeData.length > 0"
          v-show="unfold"
          class="filter-tree"
          :show-checkbox="multiselectable"
          :data="treeData"
          :node-key="nodeKey"
          :current-node-key="setTreeNodeKey"
          :props="defaultProps"
          :highlight-current=true
          :expand-on-click-node=false
          :check-strictly="individual"
          :default-expand-all=true
          :filter-node-method="filterNode"
          @node-click = "getTreeNode"
          @check-change="getAllCheckKeys"
          :ref="treeRef">
        </el-tree>
<!--
        <el-button
            v-if="multiselectable"
            type="primary"
            class="checkBtn"
            @click="getAllCheckKeysByBtn"
            style="width:72%">使用勾选值</el-button>
        <div 
            class="clearCheckBtn"
            v-if="multiselectable"
            @click="resetChecked">清空</div>
-->
    </div>
</template>

<script>
    /**
     *  基于elementUI框架实现的vue控件模块，不依赖于业务协议
     *  使用条件说明
     *  1、
     *
     *  @module Picktree Component 树控件（基础控件）
     *  @example
     *     // demo
     *
     */
    import View from './View'
    import InputView from './InputView'
    export default {
        name: 'xt-picktree',
        mixins: [View],
        // 默认值设置
        props: {
            'code': String,
            'treeData': Array,
            'nodeKey': String,
            'defaultProps': Object,
            'onload': Function,
            'onvaluechange': Function,
            'searchable': Boolean,
            'multiselectable': Boolean,
            'individual': Boolean,
            'shortcut': Boolean,
            'gather': Boolean
        },
        data: function() {
            return {
                title: 'tree',
                nodeDataArray: [], // 树节点数据，用于返回给getView
                filterText: '',     // 过滤文本
                checkKeys: [], // 勾选节点key值
                setTreeNodeKey: '', // 设置选中的树节点
                oneExcue: false,   // 过滤check-change事件多次触发问题
                unfold: !this.multiselectable,
                checkVals: ''
            }
        },
        watch: {
            filterText(val) {
                this.$refs[this.treeRef].filter(val)
            }
        },
        computed: {
            // 使用
            treeRef: function() {
                return 'xt_tree' + this.code
            }
        },
        mounted() {
            console.log(`mounted`)
            if (this.onload) {
                this.onload(this)
            }
        },
        methods: {
            // @打开树结构
            triggerDownContent() {
                this.unfold = !this.unfold
            },
            setCurrentNodeKey(keyValue) {
                this.setTreeNodeKey = keyValue
            },
            // @过滤树节点
            filterNode(value, data) {
                if (!value) return true
                return data['label'].indexOf(value) !== -1
            },
            // @点击树node节点
            getTreeNode: function(obj, node, ctrl) {
                if (this.multiselectable) {
                    let keys = this.$refs[this.treeRef].getCheckedKeys(this.shortcut)
                    let flag = keys.indexOf(obj[this.nodeKey]) > -1
                    this.$refs[this.treeRef].setChecked(obj[this.nodeKey], !flag, !this.individual)
                } else {
                    typeof this.setCurrentNodeKey === 'function' && this.setCurrentNodeKey(obj[this.nodeKey])
                    console.log(obj)
                    if (this.onvaluechange) {
                        // 包装为数组
                        this.onvaluechange(this, [obj])
                    }
                }
            },
            // @获取当前选中的check keys值集合
            getAllCheckKeys: function(nodeData) {
                if (this.shortcut || this.gather) {
                    // shortcut模式; gather模式
                    if (!nodeData.children || nodeData.children.length > 0) {
                        return
                    }
                    if (this.oneExcue) {
                        return
                    }
                    let that = this
                    setTimeout(function() {
                        that.oneExcue = false
                    }, 100)
                } else if (this.individual) {
                    // individual模式
                }
                let keys = this.$refs[this.treeRef].getCheckedKeys(this.shortcut)
                let nodes = this.$refs[this.treeRef].getCheckedNodes(this.shortcut)
                this.checkKeys = keys
                this.nodeDataArray = nodes
                if (this.multiselectable) {
                    // 显示已选择的文本
                    let temp = ''
                    for (let val of nodes) {
                        temp += val.label + ','
                    }
                    this.checkVals = temp.replace(/,$/gi, '')
                }
                this.oneExcue = true
                if (this.onvaluechange) {
                        this.onvaluechange(this, this.nodeDataArray)
                    }
            },
            // @提供额外按钮获取keys函数
            getAllCheckKeysByBtn() {
                let keys = this.$refs[this.treeRef].getCheckedKeys(this.shortcut)
                this.checkKeys = keys
                let nodes = this.$refs[this.treeRef].getCheckedNodes(this.shortcut)
                this.checkKeys = keys
                this.nodeDataArray = nodes
                if (this.onvaluechange) {
                    this.onvaluechange(this, this.nodeDataArray)
                }
            },
            setInitCheckedKeys(keys) {
                this.$refs[this.treeRef].setCheckedKeys(keys)
            },
            // @清空选中值
            resetChecked() {
                this.$refs[this.treeRef].setCheckedKeys([])
            }
        }
    }
</script>
<style>
    .xt-tree-view-container {
        position: relative;
        min-height: 500px;
        min-width: 240px;
    }
    .xt-tree-view-container .check-values {
        position: relative;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid rgb(191, 217, 214);
        box-sizing: border-box;
        color: rgb(31, 61, 57);
        font-size: inherit;
        min-height: 36px;
        line-height: 1.5;
        outline: 0;
        padding: 3px 10px;
        margin-bottom: 5px;
        width: 260px;
        max-width: 320px;
        cursor: pointer;
    }
    .xt-tree-view-container .spe-parentOrg-down-btn{
        position: absolute;
        top:50%;
        right:5px;
        transform: translateY(-50%);
        color: #019673;
        cursor: pointer;
    }
    .xt-tree-view-container .filter-tree{
        max-width:320px;
    }
    .xt-tree-view-container .checkBtn{
        display: inline-block;
        width: 98%;
        border-radius: 0;
        opacity: .8;
        box-shadow: 0px 2px 4px #8c8c8c;
    }
    .xt-tree-view-container .clearCheckBtn{
        width: 24%;
        padding: 8px 0px;
        color: #777777;
        text-align: center;
        cursor: pointer;
        display: inline-block;
        border-radius: 0;
        opacity: .8;
    }
</style>