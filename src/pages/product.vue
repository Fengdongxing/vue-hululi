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
        <ul v-if="shopListArr.length">
            <router-link :to="{path: 'product', query: {id: item.id}}" :key="item.id" class="pic-item" v-for="item in shopListArr" tag='li'>
                <div class="pic-item-img" :style="{
                    backgroundImage: 'url(' + (item && item.image_urls && item.image_urls.length > 0 ? item.image_urls[0].thumb_image : 'http://fpoimg.com/400x400') + ')'
                }"></div>
                <div class="pic-item-r">
                    <div class="pic-item-tit">{{item.title}}</div>
                    <div class="pic-item-des">{{item.product_tag_name}} · {{item.author}} · {{item.product_size}} · {{item.product_age}}<br />{{item.price != 0 ? '￥' + item.price) : '非卖品'}}</div>
                </div>
            </router-link>
        </ul>
        <ul v-else>
            <li v-for="item in 10" :key="item">
                <img src="../assets/img/shopback.svg" class="list_back_svg">
            </li>
        </ul>
        <p class="tip">{{tip}}</p>
        <!-- {{$route.params.id}} -->
    </div>
</template>

<script>
import headerTop from '@/components/header/header'

export default {
    data() {
        return {
            tip: '正在加载中...',
            page: 0,
            pagesize: 10,
            shopListArr: []
        }
    },
    beforeCreate () {
    },
    mounted () {
        console.log(this.$route.params.id);
        this.loadData();
    },
    methods: {
        countPic: function (str) {
            return str + 'methods';
        },
        loadData: function () {
            this.$http.post('/api/discover/new_index_v3', {
                page: this.page++,
                pagesize: this.pagesize,
                hululi_client_system: 'h5',
                hululi_version: '2.2'
            }).then(response => {
                console.log(response.data.RESPONSE_INFO.discover_list.ps_list);
                if (response && response.data && response.data.RESPONSE_INFO && response.data.RESPONSE_INFO.discover_list && response.data.RESPONSE_INFO.discover_list.ps_list) {
                    var a = response.data.RESPONSE_INFO.discover_list.ps_list;
                    this.shopListArr = [...this.shopListArr, ...a];
                }
            }, response => {
                console.log('失败');
            })
        }
    },
    computed: {
        countPic1: function (str) {
            return str + 'computed';
        },
        aaa: function (str) {
            return str + '55555'
        }
    },
    components: {
        headerTop
    }


}
</script>


