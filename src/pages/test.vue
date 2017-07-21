<template>
  <div class="">
    <header-top :head-title="'测试页面'" :has-back="true"></header-top>


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



    components: {
      headerTop
    }


}
</script>

<style scoped>

</style>

