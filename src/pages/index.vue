<template>
  <div class="">
    <header-top :head-title="'首页'"></header-top>
    <div class="main">

        <div class="block">
            <el-carousel height="150px" trigger="click" indicator-position="outside">
                <el-carousel-item v-for="item in 4" :key="item">
                <h3>{{ item }}</h3>
                </el-carousel-item>
            </el-carousel>
        </div>



        <router-link to="/test"><el-button type="success">测试页面</el-button></router-link>
        <router-link to="/product/fff"><el-button type="success">产品</el-button></router-link>
        <el-button type="success" @click="test">点击测试</el-button>




    </div>





  </div>
</template>

<script>
import headerTop from '@/components/header/header'

export default {
  data() {
      return {

      }
    },


    components: {
      headerTop
    },
    methods: {
        test: function () {
            console.log(this.$router);

        }
    }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main{}


.red{color:#f00;}



.el-carousel__item h3{color:#475669;font-size:14px;opacity:0.75;line-height:150px;margin:0;}
.el-carousel__item:nth-child(2n){background-color:#99a9bf;}
.el-carousel__item:nth-child(2n+1){background-color:#d3dce6;}
</style>
