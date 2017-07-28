<style scoped>
.pic-item{overflow:hidden;padding:15px;border-bottom:1px solid #eee;display:block;}
.pic-item-img{float:left;width:70px;height:70px;overflow:hidden;margin-right:15px;background-color:#000;-webkit-background-size:cover;background-size:cover;background-position:center center;background-repeat:no-repeat;}
.pic-item-r{overflow:hidden;}
.pic-item-tit{font-weight:bold;font-size:18px;line-height:30px;display:block;white-space:nowrap;word-wrap:normal;text-overflow:ellipsis;overflow:hidden;}
.pic-item-des{line-height:20px;color:#999;font-size:12px;}
.tip{text-align:center;padding:15px 0;color: #999;}
</style>
<!--  v-loading="true" -->
<template>
    <div class="">
        <header-top :head-title="'产品'" :has-back="true"></header-top>
        
        <div class="" style="height:1000px"></div>
        {{$route.params.id}}
    </div>
</template>

<script>
import headerTop from '@/components/header'

export default {
    data() {
        return {

        }
    },
    beforeCreate () {
    },
    mounted () {
        console.log(this.$route.params.id);
        this.loadData();
    },
    methods: {
        // 加载更多数据
        loadData: function () {


        }
    },
    computed: {
        countPic1: function (str) {
            return str + 'computed';
        }
    },
    components: {
        headerTop
    }


}
</script>


