<template>
    <!-- 终端分布图 -->
    <el-row :gutter="0" class="storeDistribution" v-loading="isShowLoading" element-loading-text="正在加载中...">
        <!-- 左边导航 -->
        <el-col :xs="0" :sm="0" :md="6" :lg="4" style="height: 100%;">
            <div class="storeDistribution-l">

                <!-- 区域选择 + 门店详情 -->
                <div class="storeDistribution-region">
                    <div class="storeDistribution-region-tit">{{regionData.name}} ({{regionData.value}})<!-- <a @click="testMethods">测试</a> --></div>
                    <div class="storeDistribution-region-tb">
                    <!-- 前3级 显示地区 -->
                        <a class="storeDistribution-region-address" v-for="item in regionData.children" v-if="isShowEcharts" @click="regionClick(item.name)" :title="item.name">{{item.name}} ({{item.value}})</a>
                        <!-- 显示门店 地址 -->

                        <div class="storeDistribution-region-store" v-for="item in regionData.children" v-if="!isShowEcharts" @click="storeClick(item)">
                            <div class="storeDistribution-region-store-des" v-for="(item2, index) in item.measures">
                                {{item2.name}}：{{item2.value}}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </el-col>
        <!-- 右边地图 -->
        <el-col :xs="24" :sm="24" :md="18" :lg="20" style="height: 100%;">
            <div class="storeDistribution-r">
                
                <!-- 地图 -->
                <div class="storeDistribution-map" style="z-index:1">
                    <el-amap :amap-manager="mapData.amapManager" :center="mapData.position" :zoom="mapData.zoom" :plugin="mapData.plugin" :events="mapData.events"></el-amap>
                </div>

                <!-- echars -->
                <div class="storeDistribution-echars" v-show="isShowEcharts" style="z-index:1">
                    <IEcharts :option="option" @ready="echartsReady" @click="echartsClick" :not-merge="true"></IEcharts>
                </div>

                <!-- 导航 -->
                <div class="storeDistribution-nav" style="z-index:1">
                    <div class="storeDistribution-nav-item" v-for="(item, index) in navData">
                        <a @click="selectRightNav(item, index)">{{item}}</a>
                        <span v-if="index != navData.length - 1">&gt;</span>
                    </div>
                </div>
            </div>


        </el-col>
    </el-row>
</template>

<script>
    import IEcharts from 'vue-echarts-v3/src/full.vue'
    import _ from 'underscore'

    // 注册高德地图
    import VueAMap from 'vue-amap'
    let amapManager = new VueAMap.AMapManager()
    let map, AMap, AMapUI

    // 初始化时注册中国地图
    import china from '../../static/regionMap/map/中国.json'
    IEcharts.registerMap('中国', china)

    export default {
        data: function () {
            let that = this
            return {
                // echarts 和 地图切换
                isShowEcharts: true,
                // 是否正在加载
                isShowLoading: true,
                loadAndSetType: 0,
                // 请求数据
                postData: {
                    name: '中国',
                    namepath: '中国',
                    regionLevel: 1 // 钻取深度 全国1 省份2 城市3 区县4
                },
                // 四个直辖市 需要特殊处理
                municipality: ['北京', '天津', '上海', '重庆'],
                // 区域数据
                regionData: {
                    name: '',
                    value: '0',
                    children: []
                },
                // 右边导航数据
                navData: [],
                // echarts配置
                option: {
                    title: {
                        text: '',
                        show: true
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function(params) {
                            return params.name + '：' + (params.value ? params.value : '-')
                        }
                    },
                    visualMap: {
                        left: 'left',
                        min: 0,
                        max: 1000,
                        inRange: {
                            color: ['#3394FF', '#1562B7', '#4CD964', '#13A42C', '#EADC1F', '#B1A60A', '#FF8000', '#B85D00', '#FF3B30', '#C1170D']
                        },
                        text: ['高', '低'],
                        calculable: true
                    },
                    animation: false, // 是否开启动画
                    // 工具盒
                    toolbox: {
                        show: false,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                        feature: {
                            dataView: {readOnly: false},
                            saveAsImage: {}
                        }
                    },
                    series: [{
                        name: '终端分布图',
                        type: 'map',
                        mapType: '中国',
                        roam: true, // 开启鼠标缩放和平移漫游
                        selectedMode: 'single',
                        label: {
                            normal: {
                                show: true,
                                formatter: function(params) {
                                    return params.name + '\n' + (params.value ? params.value : '-')
                                },
                                textStyle: {
                                    // fontSize: 12,
                                    // color: '#795548'
                                }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    // fontSize: 13,
                                    // color: '#fff'
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                // borderWidth: 1,
                                // borderColor: '#000'
                                // areaColor: '#eee'
                            },
                            emphasis: {
                                // borderWidth: 1,
                                // borderColor: '#eee',
                                areaColor: 'red'
                            }
                        },
                        data: []
                    }]
                },
                // 地图数据
                mapData: {
                    amapManager,
                    infoWindow: {},
                    position: [116.397470, 39.90873],
                    zoom: 12,
                    plugin: [{
                        pName: 'ToolBar',
                        position: 'RT'
                    }],
                    events: {
                        complete: (o) => {
                            // 初始完成时把地图需要函数和对象赋予全局 以便调用
                            map = amapManager._map
                            AMap = window.AMap
                            AMapUI = window.AMapUI

                            // 初始化完成时注册一个信息窗口 用以到时候显示终端具体信息
                            that.mapData.infoWindow = new AMap.InfoWindow({
                                offset: new AMap.Pixel(0, -30)
                            })
                        }
                    }
                }
            }
        },
        methods: {
            testMethods(e) {
                let that = this

            },
            // echarts初始化执行
            echartsReady(instance, echarts) {
                // let that = this
                // that.echarts = echarts
                // that.instance = instance
                // console.log('echarts初始化完成')
            },
            /**
             * 传入数组 得出最大值
             * @param  {[Array]}    arr   [数组]
             * @param  {[数组参数]}   param [数组里面的参数]
             * @return {[Number]}   [最大值]
             */
            findMax (arr, param) {
                // 寻找最大值
                let maxValue = 0
                for (let i = 0; i < arr.length; i++) {
                    let value = Number(arr[i][param[0]][param[1]])
                    if (value >= maxValue) {
                        maxValue = value
                    }
                }
                return maxValue
            },
            /**
             * [传入数组 最大值 数字 得出这个数字属于这个数组的哪一项]
             * @param  {Array}   arr 数组
             * @param  {Number}  max 最大值
             * @param  {Number}  num 数字
             * @return {item}    arr数组中的某一项
             */
            findArrItem (arr, max, num) {
                let index = Number(num) / Number(max) * (arr.length)
                // Number.isInteger(xxx) 是ES6语法 判断是不是整数 如果是 0 就不用减1
                if (Number.isInteger(index) && index !== 0) {
                    index --
                } else {
                    index = Math.floor(index)
                }
                return arr[index]
            },
            /**
             * [加载地图和数据并设置]
             * @param  {[string]} name        [省市区名称]
             * @param  {[type]}   regionLevel [钻取深度]
             */
            loadAndSet(name, regionLevel) {
                console.log(name, regionLevel)
                let that = this
                that.isShowLoading = true
                if (name && regionLevel) {
                    // 如果都有传 则确定请求层级和id
                    // 用于点击导航
                    that.loadAndSetType = 0
                    that.postData.name = name
                    that.postData.regionLevel = regionLevel
                } else if (name && !regionLevel) {
                    // 只传name的话 那就查询id 一般用于进入下一层级
                    // 查询时跟已有数据对应 如果没有的话 则不进入下一层级
                    that.loadAndSetType = 1
                    let isHasValue = _.some(that.regionData.children, function(item) {
                        if (item.name === name) {
                            that.postData.name = name
                            return true
                        } else {
                            return false
                        }
                    })
                    if (!isHasValue) {
                        return false // 不进入下一层级
                    } else {
                        that.postData.regionLevel++ // 点击进去下一层
                    }
                } else {
                    that.loadAndSetType = 2
                    // 什么都不传的话 则表示还是在当前区域
                }

                // 如果是直辖市 则 regionLevel 需要再加1 右边导航也需要再加上直辖市数据
                if (that.postData.regionLevel === 3) {
                    for (let i = 0; i < that.municipality.length; i++) {
                        if (that.municipality[i] === that.navData[that.navData.length - 1]) {
                            that.postData.regionLevel++
                            break
                        }
                    }
                }

                // 上一级的namepath
                // var pnamepath = that.navData.join('.')
                // 将要进入下一级的 navData
                let nextNavData = JSON.parse(JSON.stringify(that.navData)) // 深拷贝数组
                if (that.loadAndSetType === 0) {
                    nextNavData.push(that.postData.name)
                } else if (that.loadAndSetType === 1) {
                    nextNavData.push(that.postData.name)
                } else if (that.loadAndSetType === 2) {
                    // nextNavData.push(that.postData.name)
                }

                that.postData.namepath = nextNavData.join('.') || '中国'
                // var pname = nextNavData[nextNavData.length - 1]
                
                console.log('postData[请求数据]:', JSON.stringify(that.postData))

                // 获取数据
                that.loadRegionData(that.postData).then((response) => {
                    let responseData = response.data

                    if (that.postData.regionLevel === 4) {
                        // 如果是最后一层 显示高德地图 并添加标注
                        that.isShowEcharts = false // 显示高德地图
                        that.isShowLoading = false // 请求数据成功

                        // 什么都不传的话 则表示还是在当前区域 不用处理导航
                        if (name || regionLevel) {
                            // 同步右边导航 导航可以存id 免得再次查询id
                            that.navData.push(that.postData.name)
                        }

                        // 赋予数据
                        let sourceData = new Array(0)
                        if (responseData && responseData.datas) {
                            sourceData = responseData.datas
                        }

                        // 测试数据
                        // sourceData = [
                        //     {
                        //         'measures': {
                        //             'address': '广州白云区119路',
                        //             'salesamount': 0,
                        //             'sotrename': '华润万家白云区店111',
                        //             'visitnumber': 10
                        //         },
                        //         'position': [116.397470, 39.90873]
                        //     },
                        //     {
                        //         'measures': {
                        //             'address': '广州白云区119路',
                        //             'salesamount': 110,
                        //             'sotrename': '华润万家白云区店111',
                        //             'visitnumber': 110
                        //         },
                        //         'position': [116.397470, 39.91873]
                        //     },
                        //     {
                        //         'measures': {
                        //             'address': '广州白云区119路',
                        //             'salesamount': 220,
                        //             'sotrename': '华润万家白云区店111',
                        //             'visitnumber': 220
                        //         },
                        //         'position': [116.397470, 39.92873]
                        //     },
                        //     {
                        //         'measures': {
                        //             'address': '广州白云区119路',
                        //             'salesamount': 360,
                        //             'sotrename': '华润万家白云区店111',
                        //             'visitnumber': 360
                        //         },
                        //         'position': [116.397470, 39.93873]
                        //     },
                        //     {
                        //         'measures': {
                        //             'address': '广州白云区119路',
                        //             'salesamount': 500,
                        //             'sotrename': '华润万家白云区店111',
                        //             'visitnumber': 500
                        //         },
                        //         'position': [116.397470, 39.94873]
                        //     }
                        // ]

                        // sourceData = []
                        // 获得 markers 决定标注大小和颜色
                        let sourceMarkers = new Array(0)
                        if (responseData && responseData.groups) {
                            sourceMarkers = responseData.groups
                        }

                        // sourceMarkers = [
                        //     {
                        //         'field': 'visitnumber',
                        //         'effect': 'color'
                        //     },
                        //     {
                        //         'field': 'salesamount',
                        //         'effect': 'size'
                        //     }
                        // ]

                        let markers = {}
                        sourceMarkers.forEach((item, i) => {
                            markers[item.effect] = item.field
                        })

                        // 找出 拜访次数 和 销售额 的最大值
                        let colorMax = that.findMax(sourceData, ['measures', markers.color])
                        let sizeMax = that.findMax(sourceData, ['measures', markers.size])
                        // 标注颜色数组 每个颜色不同图片 从低到高排序
                        let markersColorArr = [
                            'static/img/gaode-marker-01-blue.png',
                            'static/img/gaode-marker-02-green.png',
                            'static/img/gaode-marker-03-yellow.png',
                            'static/img/gaode-marker-04-orange.png',
                            'static/img/gaode-marker-05-red.png'
                        ]
                        // 标注宽高 真实图片宽高是 153:255 按照比例来算 从低到高排序
                        let markersSizeArr = [
                            {
                                width: 20,
                                height: 34
                            },
                            {
                                width: 28,
                                height: 46
                            },
                            {
                                width: 36,
                                height: 60
                            },
                            {
                                width: 42,
                                height: 70
                            },
                            {
                                width: 50,
                                height: 84
                            }
                        ]
                        // 需求: 位置标记的大小代表近1个月的销售额；位置标记颜色代表近1个月的拜访次数，颜色由深到浅代表频率由高到低。
                        // 根据每一项的拜访人数 和 销售额 计算出该项的标注大小 和 标注颜色(用图片地址显示)
                        sourceData.forEach((item, i) => {
                            item.color = that.findArrItem(markersColorArr, colorMax, item.measures.visitnumber)
                            item.size = that.findArrItem(markersSizeArr, sizeMax, item.measures.salesamount)
                        })

                        // 获得项目的 fields 以便根据这个数组重新转换数据格式
                        let sourceFields = new Array(0)
                        if (responseData && responseData.fields) {
                            sourceFields = responseData.fields
                        }

                        /**
                         * // 通过 sourceData + sourceFields 转换数据格式
                         * sourceFields = [
                         *     {
                         *         'field': 'sotrename',
                         *         'name': '终端名称'
                         *     },
                         *     {
                         *         'field': 'visitnumber',
                         *         'name': '拜访次数'
                         *     },
                         *     {
                         *         'field': 'salesamount',
                         *         'name': '销售额'
                         *     },
                         *     {
                         *         'field': 'address',
                         *         'name': '地址'
                         *     }
                         * ]
                         * sourceData = {
                         *     measures: {
                         *         address: '广州白云区119路',
                         *         salesamount: 30,
                         *         sotrename: '华润万家白云区店111',
                         *         visitnumber: 53666
                         *     },
                         *     position: [113.327189,23.140784],
                         *     color: 'static/img/1.png',
                         *     size: {width: 30, height: 50}
                         * }
                         * ====>>>>
                         * data = [
                         *     {
                         *         measures: [{
                         *             name: '拜访次数',
                         *             value: 1000
                         *         }, {
                         *             name: '销售额',
                         *             value: 5000
                         *         }, {
                         *             name: '终端名称',
                         *             value: '广州白云区XXX门店11111'
                         *         }, {
                         *             name: '地址',
                         *             value: '广州白云区11111'
                         *         }],
                         *         position: [116.397470, 39.90873]
                         *         color: 'static/img/1.png',
                         *         size: {width: 30, height: 50}
                         *     }
                         * ]
                         */
                        let data = sourceData.map((item, i) => {
                            let measures = sourceFields.map((field, j) => {
                                return {
                                    name: field.name,
                                    value: item.measures[field.field]
                                }
                            })
                            return {
                                position: item.position,
                                color: item.color,
                                size: item.size,
                                measures
                            }
                        })

                        // 赋予数据
                        that.regionData.name = that.postData.name
                        that.regionData.children = data
                        that.regionData.value = that.regionData.children.length

                        // 清除原来的标注
                        map.clearMap()
                        // 创建标注并设置
                        that.createMarkers(that.regionData.children, function () {
                            map.setFitView()
                            that.mapData.zoom = 13
                        })

                    } else {
                        // 下载地图
                        that.loadMap(that.postData).then((responseMap) => {
                            that.isShowLoading = false // 请求数据成功

                            // 什么都不传的话 则表示还是在当前区域 不用处理导航
                            if (name || regionLevel) {
                                // 同步右边导航 导航可以存id 免得再次查询id
                                that.navData.push(that.postData.name)
                            }

                            // 如果是前三级省市区
                            that.isShowEcharts = true // 显示Echarts地图
                            

                            // 赋予数据
                            let sourceData = []
                            if (responseData && responseData.datas) {
                                sourceData = responseData.datas
                            }


                            // 添加测试数据
                            // sourceData.push({
                            //     name: '朝阳区',
                            //     value: 1000
                            // })

                            // 排除value=0的项目
                            that.regionData.children = _.reject(sourceData, function(item) {
                                return item.value === '0'
                            })

                            // 赋予regionData数据
                            that.regionData.name = that.postData.name

                            // 寻找最大值 计算累计值
                            let maxValue = 0
                            let totalValue = 0
                            that.regionData.children.forEach((item, i) => {
                                let value = Number(item.value)
                                if (value >= maxValue) {
                                    maxValue = value
                                }
                                totalValue += value
                            })

                            // 设置最大值 如果最大值为0 则默认设为100
                            that.option.visualMap.max = maxValue > 0 ? maxValue : 100
                            // 设置累加值
                            that.regionData.value = totalValue

                            // 地图数据
                            that.option.series[0].data = that.regionData.children

                            // 重新设置地图
                            if (responseMap.status === 200) {
                                // 如果下载地图成功
                                that.option.series[0].mapType = that.postData.name
                            } else if (responseMap.status === 404) {
                                // 如果下载地图失败 则用它上一级已经有的地图
                                that.option.series[0].mapType = that.navData[that.navData.length - 2]
                            }

                        })
                    }




                })
            },
            // 点击echarts
            echartsClick(event, instance, echarts) {
                let that = this
                // console.log(event)
                // console.log(instance)
                // console.log(echarts)
                if (event.value) {
                    that.loadAndSet(event.name)
                }
            },
            // 点击左边导航地区 进入下一层级
            regionClick(name) {
                let that = this
                // console.log(name)
                that.loadAndSet(name)
            },
            // 点击选择右边导航
            selectRightNav(item, index) {
                // console.log(item, index)
                let that = this
                that.navData.splice(index) // 处理导航

                // 如果点击的是直辖市下面的子级
                if (index === 2) {
                    // 如果是直辖市 则
                    for (let i = 0; i < that.municipality.length; i++) {
                        if (that.municipality[i] === that.navData[index - 1]) {
                            index ++
                            break
                        }
                    }
                }

                that.loadAndSet(item, index + 1)
            },
            // 点击终端门店 显示改终端地址
            storeClick(item) {
                let that = this
                let position = item.position
                if (position.length === 2) {
                    map.clearMap()
                    that.createMarkers([item], function () {
                        that.mapData.zoom = 16
                        that.mapData.position = item.position
                    })
                } else {
                    that.$message.error({
                        message: item.storeName + '暂时没有经纬度信息',
                        duration: 2000
                    })
                }
            },
            // 创建标注
            createMarkers(arr, fn) {
                let that = this
                AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
                    arr.forEach((item, i) => {
                        let position = item.position
                        // 判断有无经纬度
                        if (position.length === 2) {
                            var marker = new SimpleMarker({
                                iconStyle: {
                                    src: item.color,
                                    style: {
                                        width: item.size.width + 'px',
                                        height: item.size.height + 'px'
                                    }
                                },
                                // 当自定义标注图片时 需要设置标注的偏移位置 http://www.cnblogs.com/milkmap/p/6088553.html
                                offset: new AMap.Pixel(-(item.size.width / 2), -(item.size.height)),
                                map: map,
                                position: position
                            })

                            let html = '<div style="color:#777;margin:5px;">'
                            item.measures.forEach((item2, i) => {
                                html += item2.name + '：' + item2.value + '</br>'
                            })
                            html += '</div>'
                            marker.content = html
                            marker.on('click', function (e) {
                                that.mapData.infoWindow.setContent(e.target.content)
                                that.mapData.infoWindow.open(map, e.target.getPosition())
                            })
                        }
                    })
                    fn && fn()
                })
            },
            /**
             * 加载地图
             * @param  {[type]}   regionLevel [钻取深度]
             * @param  {[type]}   name        [名称]
             */
            loadMap(postData) {
                let that = this
                // 如果是第四层级 终端 则不用加载地图
                if (postData.regionLevel === 4) {
                    console.log('第四层不用加载Echarts地图 直接显示高德地图')
                    return Promise.resolve()
                } else {
                    // 根据层级来获取地图文件
                    let url = '/static/regionMap/map/' + postData.namepath + '.json'

                    // 地图是否加载过 是的话就不再次下载了
                    // 有地图还是得加载 因为地区可能重名
                    // let isLoadMap = false
                    // if (hasLoadMap[postData.namepath]) {
                    //     console.log('已经有地图了 不用再次加载')
                    //     isLoadMap = true
                    // }

                    return that.$http.get(url).then(response => {
                        // console.log('下载地图成功')
                        // 注册地图
                        IEcharts.registerMap(postData.name, response.data)
                        // 地图下载了后 把地图存入hasLoadMap 以便下次加载时先验证有没有地图 有的话就不用加载了
                        // hasLoadMap[postData.namepath] = true
                        return response
                    }).catch(error => {
                        console.warn('下载 ' + that.postData.namepath + '.json 地图失败', error)
                        return error
                    })

                }
            },
            loadRegionData(postData) {
                let that = this

                // 根据层级来获取接口 和 定义传参
                let url = '../../static/regionMap/data/' + postData.namepath + '.json'

                // if (postData.regionLevel === 1) {
                //     url = '../../static/regionMap/data/中国.json'
                // } else if (postData.regionLevel === 2 || postData.regionLevel === 3) {
                //     url = '/api/teapi/report/biengine/report/drill/'
                //     param.membervalue = postData.namepath.slice(3) // 钻取接口 namepath 不用传中国
                // } else if (postData.regionLevel === 4) {
                //     url = '/api/teapi/report/biengine/report/'
                // }

                return that.$http.get(url).then(response => {
                    // console.log('下载数据成功')

                    return response
                }).catch(error => {
                    console.warn('下载数据失败', error)
                    return error
                })


            }
        },
        created() {
            let that = this
        },
        mounted() {
            // console.log('mounted')
            let that = this
            // 初始化时加载中国地图
            that.loadAndSet('中国', 1)

        },
        components: {
            IEcharts
        }
    }
</script>

<style scoped>
    .storeDistribution {
        position: fixed;
        width: 100%;
        height: 100vh;
        padding: 15px;
        top: 0px;
    }

    /* 左边导航 */
    .storeDistribution-l {
        height: 100%;
        overflow: auto;
        margin-right: 15px;
        position: relative;
    }
    .storeDistribution-r {
        border: 1px solid #CFCFCF;
        overflow: hidden;
        height: 100%;
        position: relative;
    }

    /* 区域选择 */
    .storeDistribution-region {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        bottom: 0px;
    }
    .storeDistribution-region-tit {
        height: 30px;
        line-height: 30px;
        padding-left: 5px;
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: bold;
    }
    .storeDistribution-region-tb {
        height: 800px;
        overflow-y: auto;
        border: 1px solid #CFCFCF;
    }
    .storeDistribution-region-tb .storeDistribution-region-address {
        font-weight: bold;
        line-height: 50px;
        display: block;
        font-size: 14px;
        padding: 0 10px;
        cursor: pointer;
        border-bottom: 1px solid #eee;
        white-space: nowrap;
        word-wrap: normal;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: center;
    }
    .storeDistribution-region-tb .storeDistribution-region-address:hover {
        text-decoration: none;
        background-color: #e4f1f1;
    }
    .storeDistribution-region-tb .storeDistribution-region-store {
        padding: 10px;
        cursor: pointer;
        border-bottom: 1px solid #eee;
    }
    .storeDistribution-region-tb .storeDistribution-region-store-tit {
        font-weight: bold;
        color: #1f3d39;
    }
    .storeDistribution-region-tb .storeDistribution-region-store-des {
        font-size: 14px;
        color: #666;
    }
    .storeDistribution-region-tb .storeDistribution-region-store:hover {
        text-decoration: none;
        background-color: #e4f1f1;
    }

    /* 右边地图 */
    .storeDistribution-echars, .storeDistribution-map {
        background-color: #F5F3F0;
        position: absolute;
        height: auto;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
    }

    /* 右边导航 */
    .storeDistribution-nav {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #ddd;
        padding: 0 10px;
        font-size: 16px;
        position: absolute;
        top: 20px;
        left: 20px;
        background-color: #596372;
        border-radius: 5px;
        overflow: hidden;
    }
    .storeDistribution-nav-item {
        float: left;
    }
    .storeDistribution-nav-item a {
        cursor: pointer;
        color: #ffffff;
    }
    .storeDistribution-nav-item span {
        margin: 0 5px;
        color: #ffffff;
    }
    .storeDistribution-select{
        border: 1px solid #CFCFCF;
        width: 100%;
        position: absolute;
        top: 355px;
        bottom: 0px;
        left: 0px;
        overflow: auto;
    }

    /* tree选择控件 */
    .storeDistribution-tree {
        padding: 10px;
        border-bottom: 1px solid #eee;
    }







</style>

