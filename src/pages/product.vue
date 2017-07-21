<template>
  <div class="">
    <header-top :head-title="'产品'" :has-back="true"></header-top>
    {{ $route.params.id }}
  </div>
</template>

<script>
import headerTop from '@/components/header/header'

export default {
  data() {
    return {

    }
  },
  beforeCreate () {
    console.log(this.$route.params.id);
  },
  components: {
    headerTop
  }


}
</script>

<style scoped>

</style>

