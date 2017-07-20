<template>
    <header class="header">
        <div class="header-back"><</div>
        <div class="header-title" @click="ddd">{{headTitle}}</div>
        <router-link to="/test" tag="div" class="header-login">登录 | 注册</router-link>
        <div class="header-user"></div>
    </header>
</template>

<script>
export default {
    data () {
        return {
            headTidtle: 'hh'
        }
    },
    // https://vuefe.cn/v2/api/#选项-生命周期钩子
    beforeCreate () {
        console.log(1);
    },
    created () {
        console.log(2);
    },
    beforeMount () {
        console.log(3);
    },
    mounted () {
        console.log(4);
    },
    beforeUpdate () {
        console.log(5);
    },
    updated () {
        console.log(6);
    },
    activated () {
        console.log(7);
    },
    deactivated () {
        console.log(8);
    },
    beforeDestroy () {
        console.log(9);
    },
    destroyed () {
        console.log(10);
    },
    props: ['signinUp', 'headTitle', 'goBack'],
    methods: {
        ddd: function () {
            console.log(654656);
            this.back = 'ddddd'
        }
    }
}
</script>

<style scoped>
.header{
    height:50px;line-height:50px;width:100%;
    color: #fff;
    background-color: #333;
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
}
.header-back{display:block;width:50px;height:50px;position:absolute;
top:0px;left:0px;}
.header-title{font-size:16px;}
.header-login{display:block;height:50px;position:absolute;
top:0px;right:10px;font-size:12px;}
</style>
