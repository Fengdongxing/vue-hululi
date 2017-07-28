<template>
<div class="nav-wrap">
    <div class="nav">
        <div class="nav-item cur"><i class="el-icon-picture"></i><span>首页</span></div>
        <div class="nav-item"><i class="el-icon-search"></i><span>搜索</span></div>
        <div class="nav-item"><i class="el-icon-menu"></i><span>购物车</span></div>
        <div class="nav-item"><i class="el-icon-setting"></i><span>个人中心</span></div>
    </div>
</div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    methods: {
        
    }
}
</script>

<style scoped>
.nav-wrap{height:50px;}
.nav{height:50px;border-top:1px solid #B2B2B2;width:100%;background-color:#F9F9F9;position:fixed;left:0;bottom:0;font-size:0px;}
.nav-item{display:block;width:50px;height:50px;text-align:center;color:#fff;width:25%;display:inline-block;font-size:12px;color:#999;}
.nav-item i{display:block;font-size:22px;margin-top:8px;}
.nav-item span{display:block;font-size:12px;line-height:20px;margin-top:2px;}
.nav-item.cur{color:#333;}
</style>
