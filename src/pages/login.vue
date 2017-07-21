<template>
  <div class="">
    <header-top :head-title="'登录'" :has-back="true" :no-has-login="true"></header-top>
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
    }
}
</script>

<style scoped>

</style>

