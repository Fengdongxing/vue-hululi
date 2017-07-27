<template>
  <div class="">
    <header-top :head-title="'测试页面'" :has-back="true"></header-top>


    <div class="main">

        <div class="block">
            <el-carousel height="150px" trigger="click" indicator-position="outside">
                <el-carousel-item v-for="item in 4" :key="item">
                <h3>{{ item }}</h3>
                </el-carousel-item>
            </el-carousel>
        </div>
        <img src="../../static/logo.png" alt="" />
        <img src="../../static/MAMAD1010012.jpg" alt="" />

        <router-link to="/test"><el-button type="success">测试页面</el-button></router-link>
        <router-link to="/product/fff"><el-button type="success">产品</el-button></router-link>
        <el-button type="success" @click="test">点击测试</el-button>

        <div v-for="item in radioData">
            <el-radio class="radio" :class="{red: item.red}" v-model="radio" label="item.label">
                {{item.text}}{{item.isdisabled}}
            </el-radio>
        </div>


        <el-input v-model="input" placeholder="请输入内容"></el-input>

        <el-input
          type="textarea"
          autosize
          placeholder="请输入内容"
          v-model="textarea2">
        </el-input>


    </div>




  </div>
</template>

<script>
import headerTop from '@/components/header/header'

export default {
    data() {
      return {
        istrue: true,
        isfalse: false,
        radioData: [
            {
                text: '男',
                label: '1',
                red: true
            },
            {
                text: '女',
                label: '0',
                red: false
            },
        ],
        radio: '1',
        input: 'ddddddd',
        textarea2: '立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开立刻就离开',

      }
    },
    methods: {
        test: function () {
            console.log(this.$router);

        }
    },
    components: {
      headerTop
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
    }


}
</script>

<style scoped>

</style>

