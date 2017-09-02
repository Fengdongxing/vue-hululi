<template>
    <div class="xt-view" :style="viewStyle" :ref="code"></div>
</template>

<style scoped>
    .xt-view {
        font-size: 14px;
    }
</style>

<script>
    import { UI } from 'xtion-web-widget'
    import * as LogicExpression from '../engine/LogicExpression'
    import linkTo from '../engine/actions/linkTo'
    let Style = UI.Style
    // 单位符号
    const suffix = 'px'
    // 某些样式属性需要添加单位
    const fixSetAttributeWithSuffix = (str) => {
        return (str && (str + suffix)) || ''
    }

    const numberToBoolean = (str) => {
        let res
        if (!str) return false
        if (typeof str === 'boolean') return str
        if (typeof str === 'string') res = Number(str)
        if (isNaN(str)) return false
        return Boolean(res)
    }

    export default {
        name: 'xt-engine-view',
        props: ['code', 'eventList', 'viewRule'],
        data: function () {
            return {
                value: this.viewRule && this.viewRule.value || ''
            }
        },
        computed: {
            /**
             * 父类默认样式
             **/
            viewStyle() {
                let styleObj = {
                    textAlign: this.viewRule.textalign || '',
                    fontSize: fixSetAttributeWithSuffix(this.viewRule.fontsize),
                    flex: this.viewRule.flex === '1' ? this.viewRule.flex : undefined,
                    fontWeight: fixSetAttributeWithSuffix(this.viewRule.fontweight),
                    width: fixSetAttributeWithSuffix(this.viewRule.width),
                    height: fixSetAttributeWithSuffix(this.viewRule.height),
                    hidden: this.viewRule.hidden,
                    flexDirection: this.viewRule.flexdirection === 'horizontal' ? 'row' : 'column',
                    flexWrap: this.viewRule.flexwrap,
                    alignItems: this.viewRule.alignitems ? this.viewRule.alignitems : 'stretch',
                    color: this.viewRule.textcolor ? this.viewRule.textcolor.replace('0x', '#') : ''
                }

                let otherStyle = new Style(this.viewRule)

                if (!styleObj.flex) {
                    delete styleObj.flex
                }
                if (styleObj.hidden) {
                    delete styleObj.hidden
                    styleObj.display = 'none'
                }

                let afterStyle = Object.assign({}, styleObj, otherStyle)
                return afterStyle
            },
            engine() {
                var parent = this.$parent
                while (parent && parent.$options && parent.$options.name !== 'xt-engine') {
                    parent = parent.$parent
                }
                return parent
            }
        },
        methods: {
            /**
             * 通过trigger type分发事件
             **/
            executeEvent(trigerType, eventTarget, data, callback) {
                if (!this.eventList) return
                for (let event of this.eventList) {
                    if (event.trigger === trigerType && event.handler) {
                        this.engine.executeEvent(event.handler, this, data, callback)
                        break
                    }
                }
            },
            // 需要执行逻辑表达式的属性
            logicExpression(data) {
                if (!data) return
                let res = Object.assign({}, data)

                res.hidden = this.executeLogicExpression(data.hidden)
                res.hidden = numberToBoolean(res.hidden)

                res.required = this.executeLogicExpression(data.required)
                res.required = numberToBoolean(res.required)

                res.readonly = this.executeLogicExpression(data.readonly) || this.engine.pagestatus === 3 // 需要支持正则
                res.readonly = numberToBoolean(res.readonly)
                res.disabled = res.readonly
                if (res.value) {
                    res.value = this.executeLogicExpression(data.value)
                }
                return res
            },
            /**
             * 执行逻辑表达式
             **/
            executeLogicExpression(expression) {
                return LogicExpression.run(expression, this.engine)
            },
            // 需要翻译的属性
            translate(data) {
                if (!data) return
                let res = data
                if (typeof data === 'object') {
                    if (data.title) {
                        res.title = this.$t(data.title)
                    }
                    if (data.placeholder) {
                        res.placeholder = this.$t(data.placeholder)
                    }
                    if (data.text) {
                        res.text = this.$t(data.text)
                    }
                } else {
                    res = this.$t(data)
                }
                return res
            },
            /**
             * 跳转事件
             **/
            linkTo(to, mode) {
                linkTo(to, mode, this.engine)
            },
            /**
             * 父类默认取值方法，子类需要自行覆盖
             **/
            getView(type, getter) {
                return this.value
            },
            /**
             * 父类默认赋值方法，子类需要自行覆盖
             **/
            setView(data, type, setter) {
                this.value = data
            },
            /**
             * 父类默认事件响应者传值，子类需要自行覆盖
             **/
            getEventTargetData(getter) {
                return ''
            }
        }
    }

</script>