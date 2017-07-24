<template>
    <header class="header">
        <div class="header-back" v-if="hasBack" @click="goback"><i class="el-icon-arrow-left"></i></div>
        <div class="header-title" @click="goto">{{headTitle}}</div>
        <router-link to="/login" tag="div" class="header-login" v-if="!noHasLogin">登录 | 注册</router-link>
        <div class="header-user"></div>
    </header>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    props: ['noHasLogin', 'headTitle', 'hasBack'],
    methods: {
        goto: function () {
            console.log(this.$router);
            this.$router.push({
                name: 'index'
            });
        },
        goback: function () {
            console.log(this.$router);
            this.$router.go(-1);
        }
    }
}
</script>

<style scoped>
.header{height:50px;line-height:50px;width:100%;color:#fff;background-color:#333;position:fixed;z-index:100;left:0;top:0;}
.header-back{display:block;width:50px;height:50px;position:absolute;text-align:center;top:0px;left:0px;}
.header-title{font-size:16px;text-align:center;}
.header-login{display:block;height:50px;position:absolute;top:0px;right:10px;font-size:12px;}
</style>
