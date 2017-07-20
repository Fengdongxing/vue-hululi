<template>
  <div class="">
    <header-top :head-title="title"></header-top>
    <router-link to="/test" tag="h2">首页</router-link>
  </div>
</template>

<script>
import headerTop from '@/components/header'

export default {
  data() {
      return {
        title: '首页'
      }
    },
    components: {
      headerTop
    }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
