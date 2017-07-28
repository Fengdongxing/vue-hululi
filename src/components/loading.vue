 <template>
    <div class="loading_container">
        <div class="load_img" :style="{backgroundPositionY: -(positionY%7)*50 + 'px'}"></div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            positionY: 0,
            timer: null,
        }
    },
    mounted(){
        this.timer = setInterval(() => {
            this.positionY ++;
        }, 600)
    },
    beforeDestroy(){
        clearInterval(this.timer);
    }
}
</script>

<style scoped>
@keyframes load{
    0%   {transform: translateY(0px);}
    50%  {transform: translateY(-50px);}
    100% {transform: translateY(0px);}
}
.loading_container{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width:100%;height:100%;
}
.load_img{
    width:50px;height:50px;
    background: url(../images/icon_loading.png) no-repeat 0 0;
    background-size: 50px auto;
    margin-top:-25px;
    margin-left:-25px;
    animation: load .6s infinite ease-in-out;
    position: fixed;
    top: 50%;
    left: 50%;
}
</style>
