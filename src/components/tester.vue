<template>
  <div class="">
    <header class="tester">
        <div class="tester-back" v-if="hasBack"><i class="el-icon-arrow-left"></i></div>
        <div class="tester-title" @click="goto">{{title}}</div>
        <router-link to="/login" tag="div" class="tester-login" v-if="!noHasLogin">登录 | 注册{{ggg}}</router-link>
        <div class="tester-user"></div>
    </header>
  </div>
</template>

<script>
import propsync from '@/plugin/propsync'

export default {
    data() {
        let that = this
        return {
        }
    },
    // props: ['noHasLogin', 'title', 'hasBack'],
    props: {
        // 只检测类型
        noHasLogin: Boolean,
        // 检测类型 + 其他验证
        title: {
            type: String,
            default: '',
            required: true
        },
        hasBack: {
            type: Boolean,
            default: false,
            required: false
        },
    },
    methods: {
        goto: function() {
            console.log(this.$router);
            this.$router.push({
                name: 'index'
            });
        }
    },
    computed: {
        ggg() {
            return this.$store.state.count
        }
    },
    mixins: [propsync],
    mounted() {
        // this.$emit('update:title', 'newValue')
        // console.log(4);
    },
    created() {
        // this.$emit('update:title', 'newValue')
        console.log(4);
    }

}
</script>
<style scoped>
.tester {
    height: 45px;
    line-height: 45px;
    width: 100%;
    color: #fff;
    background-color: #333;
    position: fixed;
    left: 0;
    top: 0;
}
.tester-back {
    display: block;
    width: 45px;
    height: 45px;
    position: absolute;
    text-align: center;
    top: 0px;
    left: 0px;
}
.tester-title {
    font-size: 16px;
    text-align: center;
}
.tester-login {
    display: block;
    height: 45px;
    position: absolute;
    top: 0px;
    right: 10px;
    font-size: 12px;
}
</style>

