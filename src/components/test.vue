<template>
  <div class="hello">
    <!-- <header-top></header-top> -->
    <router-link to="/" tag="h2" exact>te465st</router-link>
  </div>
</template>

<script>
// import headerTop from '@/components/header'
export default {
  data () {
    return {
      msg: 'test'
    }
  },
  ready () {
    console.log(this.msg)
  },
  destroyed () {
    console.log(this.msg)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1{background-color:#f60;}
</style>
