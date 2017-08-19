<template>
  <div class="">
    <header-top :head-title="'测试页面'" :has-back="true"></header-top>
    <div class="main">
        <!-- <img src="../images/logo.png" alt="" /> -->

        <router-link to="/test"><el-button type="success">测试页面</el-button></router-link>
        <router-link to="/product/fff"><el-button type="success">产品</el-button></router-link>
        <el-button type="success" @click="test">点击测试</el-button>
        <el-button type="success" @click="test2">点击测试</el-button>
    </div>


    <div class="" style="float:left;width:200px;height:1000px">

        <div class="storeDistribution-region-store" v-for="item in regionData.children" @click="storeClick(item)">
            <div class="storeDistribution-region-store-tit">{{item.storeName}}</div>
            <div class="storeDistribution-region-store-des">
                <div v-if="item.contactName">联系人：{{item.contactName}}</div>
                地址：{{item.address}}
            </div>
        </div>

    </div>


    <div class="amap-wrapper">
        <el-amap ref="map" :amap-manager="mapData.amapManager" :center="[116.397470, 39.90873]" :zoom="12" :plugin="mapData.plugin" :events="mapData.events">
        </el-amap>
    </div>


  </div>
</template>

<script>
import headerTop from '@/components/header'

import VueAMap from 'vue-amap'
let amapManager = new VueAMap.AMapManager()
let map
let AMap
let AMapUI


export default {
    data() {
        let that = this
        return {
            regionData: {
                children: []
            },
            mapData: {
                amapManager,
                infoWindow: {},
                plugin: [{
                    pName: 'ToolBar',
                    position: 'RT'
                }],
                events: {
                    init: (o) => {},
                    complete: (o) => {
                        map = amapManager._map
                        AMap = window.AMap
                        AMapUI = window.AMapUI
                        that.mapData.infoWindow = new AMap.InfoWindow({
                            offset: new AMap.Pixel(0, -30)
                        })
                    }
                }
            }
        }
    },
    methods: {
        storeClick(item) {
            let that = this
            if (item.position.length === 2) {
                map.clearMap()
                that.createMarkerAndSetFitView([item])
            } else {
                that.$message.error({
                    message: item.storeName + '暂时没有经纬度信息',
                    duration: 2000
                })
            }
        },
        // 创建标注并设置
        createMarkerAndSetFitView(arr) {
            let that = this
            AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
                arr.forEach((item, i) => {
                    // 判断有无经纬度
                    if (item.position.length === 2) {
                        var marker = new SimpleMarker({
                            // iconStyle: 'red',
                            iconStyle: {
                                src: 'http://webapi.amap.com/theme/v1.3/markers/b/mark_r.png',
                                style: {
                                    width: '20px'
                                }
                            },
                            map: map,
                            position: item.position
                        })
                        marker.content = '<div style="color:#777;margin:5px;"><span style="color:#000">' + item.storeName + '</span><br>近一个月拜访：' + item.visitNumber + '次<br>近一个月销售：￥' + item.SalesAmount + '<br>地址：' + item.address + '</div>'
                        marker.on('click', function (e) {
                            that.mapData.infoWindow.setContent(e.target.content)
                            that.mapData.infoWindow.open(map, e.target.getPosition())
                        })
                    }
                })
                map.setFitView()
            })
        },
        test: function () {
            let that = this

            var loadData = [
                {
                    measures: {
                        address: '广州白云区11111',
                        salesamount: 50,
                        sotrename: '华润万家白云区店111',
                        visitnumber: 53666
                    },
                    address: '116.397470, 39.90873'
                },
                {
                    measures: {
                        address: '广州白云区22222',
                        salesamount: 30,
                        sotrename: '华润万家白云区店22222',
                        visitnumber: 44555
                    },
                    address: '116.397428, 39.91023'
                }
            ]

            function findMax(arr, param) {
                // 寻找最大值
                let maxValue = 0
                for (let i = 0; i < arr.length; i++) {
                    let value = Number(arr[i][param[0]][param[1]])
                    if (value >= maxValue) {
                        maxValue = value
                    }
                }
                return maxValue
            }
            console.log(findMax(loadData, ['measures', 'visitnumber']))
            console.log(findMax(loadData, ['measures', 'salesamount']))


            // 赋予数据
            that.regionData.children = loadData.map((item) => {
                // 转换格式
                let position = []
                let address = item.address
                if (address && address.split(',').length === 2) {
                    position.push(address.split(',')[0])
                    position.push(address.split(',')[1])
                }
                return {
                    storeName: item.measures.sotrename,
                    address: item.measures.address,
                    position: position,
                    visitNumber: item.measures.visitnumber,
                    SalesAmount: item.measures.salesamount
                }
            })
            that.regionData.value = that.regionData.children.length
            // 清楚原来的标注
            map.clearMap()
            // 创建标注并设置
            that.createMarkerAndSetFitView(that.regionData.children)





        },
        test2: function () {
            let that = this
            map.clearMap()
            console.log(that.mapData.zoom) // meiyou tongbu
        }
    },
    components: {
      headerTop
    },

    // https://vuefe.cn/v2/api/#选项-生命周期钩子
    beforeCreate () {
        // console.log(1);
    },
    created () {
        // console.log(2);
    },
    beforeMount () {
        // console.log(3);
    },
    mounted () {
        // console.log(4);
        
    },
    beforeUpdate () {
        // console.log(5);
    },
    updated () {
        // console.log(6);
    },
    activated () {
        // console.log(7);
    },
    deactivated () {
        // console.log(8);
    },
    beforeDestroy () {
        // console.log(9);
    },
    destroyed () {
        // console.log(10);
    }


}
</script>

<style scoped>
.amap-wrapper {
    width: 1000px;
    height: 800px;
}
</style>

