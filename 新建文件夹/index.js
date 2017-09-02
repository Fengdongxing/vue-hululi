/**
 * 普通输入框
 */
import View from '../View'
import { UI } from 'xtion-web-widget'

// @数组结构数据构建树结构
function CreateTree(data) {
    this.treeData = data || []
    this.dataGroups = {}
    this.roots_id = []
};
CreateTree.prototype = {
    init: function(idName, pidName, labelName) {
        this.group(idName, pidName, labelName)
        return this.getDom(this.dataGroups['root'], idName)
    },
    group: function(idName, pidName, labelName) {
        // 1、抽取所有数据的pid标识组成一个对象结构，pid对应 其children
        for (var i = 0; i < this.treeData.length; i++) {
            if (this.treeData[i][pidName] == null || this.treeData[i][pidName] === '') {
                if (!this.dataGroups['root']) {
                    this.roots_id.push('root')
                    this.dataGroups['root'] = []
                }
                this.dataGroups['root'].push(this.treeData[i])
            } else if (this.dataGroups[this.treeData[i][pidName]]) {
                this.dataGroups[this.treeData[i][pidName]].push(this.treeData[i])
            } else {
                this.roots_id.push(this.treeData[i][pidName])
                this.dataGroups[this.treeData[i][pidName]] = []
                this.dataGroups[this.treeData[i][pidName]].push(this.treeData[i])
            }
        }
        // 2、检索出对应id不在数据中的pid
        this.roots_id = this.roots_id.filter((pid) => {
            for (let item of this.treeData) {
                if (pid === item[idName]) {
                    return false
                }
            }
            return true
        })
        // 3、对应id不在数据中的pid标记为root，作为树的根节点
        for (let pid of this.roots_id) {
            if (pid === 'root') {
                continue
            }
            if (!this.dataGroups['root']) {
                this.dataGroups['root'] = []
            }
            for (let item of this.dataGroups[pid]) {
                this.dataGroups['root'].push(item)
            }
            delete this.dataGroups[pid]
        }
    },
    // @递归组装数据
    getDom: function(a, idName) {
        if (!a) {
            return []
        }
        var result = []
        for (var i = 0; i < a.length; i++) {
            var val = this.getDom(this.dataGroups[a[i][idName]], idName)
                a[i].children = val
                result.push(a[i])
        }
        return result
    }
}
// end
export default {
    name: 'xt-engine-picktree',
    mixins: [View],
    props: [],
    data: function () {
        return {
            prototypeData: [], // 原始数据
            treeData: [], // 接口数据（数组结构）
            nodeData: '', // 树选中的节点对象数据
            nodeKey: '',  // 节点值标识
            nodeDataArray: [] // 选中节点数据
        }
    },
    created() {
        console.log(`----viewRule`)
        console.log(this)
        console.log(this.viewRule.intermediateselectmode)
        console.log(this.viewRule.intermediateselectmode === 'individual')
    },
    render: function (createElement) {
        if (this.viewRule) {
            return createElement(UI.Picktree, {
                props: {
                    ...this.translate(this.viewRule),
                    ...this.logicExpression(this.viewRule),
                    // width: this.viewRule.width || '240',
                    treeData: this.treeData,
                    defaultProps: { // 无法动态传值
                        children: 'children',
                        label: 'label'
                    },
                    nodeKey: this.nodeKey,
                    // 模式：disable ; shortcut ; individual ; gather ; related
                    individual: this.viewRule.intermediateselectmode === 'individual',
                    shortcut: this.viewRule.intermediateselectmode === 'shortcut',
                    gather: this.viewRule.intermediateselectmode === 'gather',
                    // 属性：是否允许搜索，bool类型，默认值为 0 ，即不能搜索
                    searchable: this.viewRule.searchable !== '0',
                    // 属性：是否允许多选，bool类型，默认值为 0 ，即单选
                    multiselectable: this.viewRule.multiselectable !== '0',
                    onload: function (eventTarget) {
                        this.executeEvent('onload', this)
                    }.bind(this),
                    onvaluechange: function (eventTarget, data) {
                        this.nodeDataArray = data
                        console.log(this.nodeDataArray)
                        this.executeEvent('onvaluechange', this, data)
                    }.bind(this)
                },
                ref: this.viewRule.code
            })
        }
    },
    methods: {
        getView(type, getter) {
            console.log('--selectbox getView--')
            let multiselectable = this.viewRule.multiselectable !== '0'
            let result = null
            let componentType = 'key'
            // 默认type(即component='')取key值
            if (!getter || !getter.ctrl.component || getter.ctrl.component === '') {
                componentType = 'key'
            } else {
                componentType = getter.ctrl.component
            }
            switch (componentType) {
                case 'value': // 取完整值
                    // selectbox存在不选值的值改变事件，该取值情况需要处理
                    if (this.nodeDataArray.length === 0) {
                        result = multiselectable ? [] : ''
                    } else {
                        result = multiselectable ? this.nodeDataArray : this.nodeDataArray[0]
                    }
                    break
                case 'text':
                case 'textpath':
                case 'keypath':
                case 'key':
                case 'id':
                case 'idpath':
                    if (this.nodeDataArray.length === 0) {
                        result = ''
                    } else {
                        if (multiselectable) {
                            this.nodeDataArray.forEach((val, index) => {
                                result.push(val[componentType])
                            })
                        } else {
                            result = this.nodeDataArray[0][componentType]
                        }
                    }
                    break
                default:
                    // 默认type(即component='')取key值
                    break
            }
            console.log(`picktree控件getview取值`)
            console.log(result)
            return result
        },
        setView(data, type, setter) {
            let multiselectable = this.viewRule.multiselectable !== '0'
            if (data && Object.prototype.toString.call(data) === '[object Object]' && setter && type === 'value') {
                // 暂时默认data为对象且type的值是value表示传入初始化的数据结构
                let formatData = []
                let ruleName = {
                    dataName: setter.name,
                    text: '',
                    textpath: '',
                    keypath: '',
                    key: '',
                    id: '',
                    idpath: '',
                    parentid: ''
                }
                for (let prop of setter.properties) {
                    if (prop.ctrl && prop.ctrl.component && prop.ctrl.component !== '') {
                        ruleName[prop.ctrl.component] = prop.name
                    }
                }
                console.log(ruleName)
                for (let item of data[ruleName.dataName]) {
                    let dealItem = {
                        ...item,
                        text: item[ruleName.text],
                        textpath: item[ruleName.textpath],
                        keypath: item[ruleName.keypath],
                        key: item[ruleName.key],
                        id: item[ruleName.id],
                        idpath: item[ruleName.idpath],
                        parentid: item[ruleName.parentid],
                        // 树结构需要的解析数据
                        label: item[ruleName.text],
                        children: []
                    }
                    formatData.push(dealItem)
                }
                this.prototypeData = formatData
                this.treeData = new CreateTree(formatData).init('id', 'parentid', 'text')
                console.log(this.treeData)
                this.nodeKey = 'key'
            } else {
                // 其他情况都是setView赋值
                let componentType = 'key'
                if (!setter || !setter.ctrl.component || setter.ctrl.component === '') {
                    componentType = 'key'
                } else {
                    componentType = setter.ctrl.component
                }
                this.nodeKey = componentType
                // ------ 显示文本 - 保存回显节点值
                if (Object.prototype.toString.call(data) === '[object Array]') {
                    this.$refs[this.code].setInitCheckedKeys(data)
                    // 多选下拉树模式，回写选中值文本
                    if (multiselectable) {
                        let temp = ''
                        for (let node of this.prototypeData) {
                            temp += node.label + ','
                        }
                        this.checkVals = temp.replace(/,$/gi, '')
                        this.nodeDataArray = this.prototypeData.filter((item) => {
                            for (let val of data) {
                                if (item[componentType] === val) {
                                    return true
                                }
                            }
                            return false
                        })
                    }
                } else {
                    this.$refs[this.code].setTreeNodeKey = data
                    this.nodeDataArray = this.prototypeData.filter((item) => {
                        return item[componentType] === data
                    })
                }
            }
        }
    }
}