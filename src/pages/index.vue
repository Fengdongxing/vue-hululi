<template>
    <div class="">
        <header-top :head-title="'首页'"></header-top>

        <div class="block">
            <el-carousel height="150px" trigger="click" indicator-position="outside">
                <el-carousel-item v-for="item in 4" :key="item">
                <h3>{{ item }}</h3>
                </el-carousel-item>
            </el-carousel>
        </div>
        <ul v-if="shopListArr.length">
            <router-link :to="{name: 'product', params: {id: item.id}}" :key="item.id" class="pic-item" v-for="item in shopListArr" tag='li'>
                <div class="pic-item-img" :style="{
                backgroundImage: 'url(' + (item && item.image_urls && item.image_urls.length > 0 ? item.image_urls[0].thumb_image : 'http://fpoimg.com/400x400') + ')'
                }"></div>
                <div class="pic-item-r">
                    <div class="pic-item-tit">{{item.title}}</div>
                    <div class="pic-item-des">{{item.product_tag_name}} · {{item.author}} · {{item.product_size}} · {{item.product_age}}<br />{{item.price != 0 ? '￥' + item.price : '非卖品'}}</div>
                </div>
            </router-link>
        </ul>
        <ul v-else>
            <li v-for="item in 10" :key="item">
                <img src="../assets/img/shopback.svg" class="list_back_svg">
            </li>
        </ul>
        <p class="tip" @click="fetchData">{{tip}}</p>
        <loading v-show="loading"></loading>
        <footer-nav :head-title="'首页'"></footer-nav>
    </div>
</template>

<script>
import headerTop from '@/components/header'
import footerNav from '@/components/footer'
import loading from '@/components/loading'

export default {
    data() {
      return {
        tip: '加载更多',
        loading: true,
        page: 0,
        pagesize: 10,
        shopListArr: []
      }
    },


    components: {
        headerTop,
        footerNav,
        loading,
    },
    mounted () {
        this.fetchData();
    },
    methods: {
        // 加载更多数据
        fetchData () {
            if (this.page <= 3) {
                this.tip = '正在加载中...';
                this.$http.post('/api/discover/new_index_v3', {
                    page: this.page++,
                    pagesize: this.pagesize,
                    hululi_client_system: 'h5',
                    hululi_version: '2.2'
                }).then(response => {
                    if (response && response.data && response.data.RESPONSE_INFO && response.data.RESPONSE_INFO.discover_list && response.data.RESPONSE_INFO.discover_list.ps_list) {
                        var a = response.data.RESPONSE_INFO.discover_list.ps_list;
                        this.shopListArr = [...this.shopListArr, ...a];
                        this.tip = '加载更多';
                        this.loading = false;
                    }
                }, response => {
                    console.log('失败');
                    this.tip = '没有更多数据了';
                })
            } else {
                this.tip = '没有更多数据了';
            }

        }
    },


}
</script>

<style scoped>
.el-carousel__item h3{color:#475669;font-size:14px;opacity:0.75;line-height:150px;margin:0;}
.el-carousel__item:nth-child(2n){background-color:#99a9bf;}
.el-carousel__item:nth-child(2n+1){background-color:#d3dce6;}

.pic-item{overflow:hidden;padding:15px;border-bottom:1px solid #eee;display:block;}
.pic-item-img{float:left;width:70px;height:70px;overflow:hidden;margin-right:15px;background-color:#000;-webkit-background-size:cover;background-size:cover;background-position:center center;background-repeat:no-repeat;}
.pic-item-r{overflow:hidden;}
.pic-item-tit{font-weight:bold;font-size:18px;line-height:30px;display:block;white-space:nowrap;word-wrap:normal;text-overflow:ellipsis;overflow:hidden;}
.pic-item-des{line-height:20px;color:#999;font-size:12px;}
.tip{text-align:center;padding:15px 0;color: #999;}
</style>
