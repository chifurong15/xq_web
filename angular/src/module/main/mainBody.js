(function (window, angular) {
    'use ';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    })

    app.controller(
        'mainBodyCtrl', [
            '$sce',
            '$localStorage',
            '$scope',
            '$location',
            '$log',
            '$q',
            '$rootScope',
            'globalParam',
            '$window',
            'routeService',
            '$http',
            'wish',
            'esriApiDeps',
            'tiandituFactory',
            'MapTool',
            'MapUtil',
            'SymbolUtil',
            'queryAdminregion',
            'UtilityTool',
            'WorkbenchService',
            '$ajaxhttp',
            'moduleService',
            function mainBodyCtrl($sce,$localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http,
                                  wish, esriApiDeps, tiandituFactory, MapTool, MapUtil, SymbolUtil, queryAdminregion, UtilityTool, WorkbenchService, $ajaxhttp, moduleService) {

                var apiPrefix = moduleService.getServiceUrl() + '/bulletin';
                var apiPrefix1 = moduleService.getServiceUrl() + '/resumption';
                var apiPrefix2 = moduleService.getServiceUrl() + '/statistic';
                var apiPrefix3 = moduleService.getServiceUrl() + '/quality';
                // var apiPrefix3 = "http://10.0.9.133:7004" + '/quality';


                var promise = esriApiDeps.query();
                var w = wish.get();
                $scope.showImg = false;
                // 初始化
                $scope.eventImgUrl = $localStorage.serviceUrl_fileService;
                $scope.init = function () {
                    //gis模块初始化
                    MapTool.init($scope.map);
                    MapUtil.init($scope.map);
                    SymbolUtil.init($scope.map);
                    queryAdminregion.init($scope.map);
                    WorkbenchService.init($scope.map, "workbenchLayer");

                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth();
                    var day=date.getDay();
                    if(month == 0){
                        month = 12;
                        year = year - 1;
                    }

                    $scope.month= day<15 ? month:month+1;
                    console.log(day);
                    month =  month < 10 ? '0' + month : month
                    $scope.year = year;


                    $scope.defaultTime = year + '-' + month ;//默认上个月

                    //自适应图表
                    chartContainer();
                    /*当前巡河数据*/
                    patrolCount();
                    /*行政区域*/
                    regionList();
                    getBulletin();
                    getDate();
                    getCountHZOnline();
                    getProblem();

                    getRegionSort ();

                };

                // 区考核排名列表
                function getRegionSort () {
                    $ajaxhttp.myhttp({
                        url: apiPrefix2 + '/v1/statistic/regionStatistic',
                        method: 'get',
                        params:{
                            // date:$scope.defaultTime
                            // date:'2018-11'
                        },
                        callBack: function (res) {
                            if(res.resCode == 1){
                                $scope.regionSortList = res.data;
                                $scope.sortRegion = [],$scope.sortRegionScore = [];

                                if(Array.isArray(res.data) && res.data.length == 0){
                                    $scope.sortRegion = ['蓟州区', '静海区', '宁河区', '滨海新区', '宝坻区',
                                        '武清区', '北辰区', '津南区', '西青区', '东丽区', '红桥区', '河北区',
                                        '南开区', '河西区', '河东区', '和平区']
                                    $scope.sortRegionScore = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                }else{
                                    $scope.regionSortList.map(function (item){
                                        $scope.sortRegion.push(item.regionName)
                                        $scope.sortRegionScore.push(Number(item.resultScore))
                                    })
                                }
                                // console.log($scope.sortRegion);
                                // console.log($scope.sortRegionScore);

                                getInitCharts()
                            }else{
                                layer.msg(res.resMsg, {time:2000});
                            }
                        }
                    })

                    $ajaxhttp.myhttp({
                        url: apiPrefix3 + '/v1/WaterQualityGrade/selectWaterQualityPercent',
                        method: 'get',
                        callBack: function (res) {
                            if(res.resCode == 1){
                                $scope.waterList = res.data;
                                $scope.waterType1 = ['Ⅰ-Ⅲ类','Ⅳ类', 'Ⅴ类'];
                                $scope.waterType2 = [ 'Ⅵ-Ⅶ类', 'Ⅷ-Ⅸ类','河干'];

                                getInitCharts()
                                // console.log('dddd',$scope.waterList);
                            }else{
                                layer.msg(res.resMsg, {time:2000});
                            }
                        }
                    })
                }

                function getInitCharts(){

                    this.chartInstance = [];
                    var myChart = echarts.init(document.getElementById('main'));
                    var myChart1 = echarts.init(document.getElementById('main1'));
                    var option = {
                        tooltip: {
                            trigger: 'item',
                            confine: true,
                            formatter: function (params) {
                                return params.name + ' </br> ' + params.value + '个' +'(' + params.percent + '%)';
                            }
                        },
                        color: ['#72a7f5', '#1153b5', '#20d850','#d2d820', '#e92432', '#3b3636'],
                        legend: [
                            {
                                orient: 'vertical',
                                icon: "circle",
                                x: '65%',
                                y: '25%',
                                itemWidth: 10,  // 设置宽度
                                itemHeight: 10, // 设置高度
                                itemGap: 5 ,// 设置间距
                                bottom: '15%',
                                data:$scope.waterType1,
                            },
                            {
                                orient: 'vertical',
                                icon: "circle",
                                x: '80%',
                                y: '25%',
                                itemWidth: 10,  // 设置宽度
                                itemHeight: 10, // 设置高度
                                itemGap: 5 ,// 设置间距
                                bottom: '15%',
                                data: $scope.waterType2,
                            }
                        ],
                        series: [{
                            name: '',
                            type: 'pie',
                            radius: ['30%', '50%'],
                            center: ['30%', '35%'],
                            data: [
                                {
                                    value: $scope.waterList ? $scope.waterList.one : 0,
                                    percent:$scope.waterList ? $scope.waterList.onePercent : 0,
                                    name: 'Ⅰ-Ⅲ类'
                                },
                                {
                                    value: $scope.waterList ? $scope.waterList.two : 0,
                                    percent:$scope.waterList ? $scope.waterList.twoPercent : 0,
                                    name: 'Ⅳ类'
                                },
                                {
                                    value: $scope.waterList ? $scope.waterList.three : 0,
                                    percent:$scope.waterList ? $scope.waterList.threePercent : 0,
                                    name: 'Ⅴ类'

                                },
                                {
                                    value: $scope.waterList ? $scope.waterList.four : 0,
                                    percent:$scope.waterList ? $scope.waterList.fourPercent : 0,
                                    name: 'Ⅵ-Ⅶ类'
                                },
                                {
                                    value: $scope.waterList ? $scope.waterList.five : 0,
                                    percent:$scope.waterList ? $scope.waterList.fivePercent : 0,
                                    name: 'Ⅷ-Ⅸ类'
                                },
                                {
                                    value: $scope.waterList ? $scope.waterList.six : 0,
                                    percent:$scope.waterList ? $scope.waterList.sixPercent : 0,
                                    name: '河干'
                                }
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            label: {
                                normal: {
                                    textStyle: {
                                        color: '#333'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: true
                                }
                            }
                        }]
                    };
                    // 使用刚指定的配置项和数据显示图表。

                    var option1 = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow',
                            },
                            formatter: function (params) {
                                return params[0].name + ' : ' + params[0].value;
                            }

                        },
                        color: ['#ff0000', '#000000', '#000099', '#008000', '#00dd88'],
                        grid: {
                            top: '3%',
                            left: '15%',
                            height: '110'
                        },
                        xAxis: [{
                            type: 'value',
                            position: 'bottom',
                            data: [],
                            axisTick: {
                                alignWithLabel: false
                            }
                        }],
                        yAxis: {
                            type: 'category',
                            data:$scope.sortRegion,
                            nameLocation: 'start',
                            nameTextStyle: {
                                fontSize: 10
                            },
                        },
                        series: [{
                            name: '',
                            type: 'bar',
                            data:$scope.sortRegionScore,
                            barWidth: '30%',
                            barGap: '1%',
                            itemStyle: {   //配置样式，设置每个柱子的颜色
                                normal: {
                                    color: function (params) {
                                        var colorList = ['#60a6ec', '#0473e2', '#00ae4f', '#ffc000', '#de1414', '#60a6ec', '#0473e2', '#00ae4f', '#ffc000', '#de1414', '#60a6ec', '#0473e2', '#00ae4f', '#ffc000', '#de1414', '#00ae4f'];
                                        return colorList[params.dataIndex];
                                    }
                                }
                            }
                        }]
                    };
                    myChart.setOption(option);
                    myChart1.setOption(option1);
                }



                //模态框的全屏显示
                $scope.enlarge = function () {
                    $('.modal-dialog').addClass('enlarge');
                    $('.modal-body').addClass('enlarge');
                }
                $scope.shrink = function () {
                    $('.modal-dialog').removeClass('enlarge');
                    $('.modal-body').removeClass('enlarge');
                }
                $scope.cancel = function () {
                    $('#myModal').modal('hide');
                    //$('.modal-dialog').removeClass('enlarge');
                    //$('.modal-body').removeClass('enlarge');
                }

                var region = {
                    "longitude": 117.19203455803067,
                    "latitude": 39.08350838137276,
                    "regionlevel": 2
                };

                $scope.map = new w.Map("map", {
                    slider: false,
                    autoResize: true,
                    resizeDelay: 100,
                    logo: false
                });
                tiandituFactory.initTianditu($scope.map, region);

                $scope.mainBodyBtn = function () {
                };

                // 全屏操作
                $scope.fullScreen = function () {
                    var el = document.getElementById("map");

                    // Supports most browsers and their versions.
                    var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen
                        || el.mozRequestFullScreen || el.msRequestFullScreen;

                    if (requestMethod) {

                        // Native full screen.
                        requestMethod.call(el);

                    } else if (typeof window.ActiveXObject !== "undefined") {

                        // Older IE.
                        var wscript = new ActiveXObject("WScript.Shell");

                        if (wscript !== null) {
                            wscript.SendKeys("{F11}");
                        }
                    }

                    $('#fullScreen').css("display", "none");
                    $('#exitScreen').css("display", "block");

                }

                //退出全屏
                $scope.exitScreen = function () {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                    else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    }
                    else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                    else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    if (typeof cfs != "undefined" && cfs) {
                        cfs.call(el);
                    }
                    $('#fullScreen').css("display", "block");
                    $('#exitScreen').css("display", "none");
                }

                //ie低版本的全屏，退出全屏都这个方法
                function iefull() {
                    var el = document.documentElement;
                    var rfs = el.msRequestFullScreen;
                    if (typeof window.ActiveXObject != "undefined") {
                        //这的方法 模拟f11键，使浏览器全屏
                        var wscript = new ActiveXObject("WScript.Shell");
                        if (wscript != null) {
                            wscript.SendKeys("{F11}");
                        }
                    }
                }
                $scope.isShow1 = true;
                $scope.isShow2 = true;
                $scope.isShow3 = true;
                $scope.isShow4 = true;
                $scope.isShow5 = true;
                $scope.tab1 = function () {
                    $scope.isShow1 = !$scope.isShow1 ;
                    $('#headingOne').removeClass('titleBg').addClass('titleBgActive');
                    $('#headingOne a').removeClass('title').addClass('titleActive');

                    $('#headingTwo').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingTwo a').removeClass('titleActive').addClass('title');

                    $('#headingThree').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingThree a').removeClass('titleActive').addClass('title');

                    $('#headingFour').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingFour a').removeClass('titleActive').addClass('title');

                    $('#headingFive').removeClass('titleBgActive').addClass('titleBg');
                }
                $scope.tab2 = function () {
                    $scope.isShow2 = !$scope.isShow2 ;
                    $('#headingOne').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingOne a').removeClass('titleActive').addClass('title');

                    $('#headingTwo').removeClass('titleBg').addClass('titleBgActive');
                    $('#headingTwo a').removeClass('title').addClass('titleActive');

                    $('#headingThree').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingThree a').removeClass('titleActive').addClass('title');

                    $('#headingFour').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingFour a').removeClass('titleActive').addClass('title');

                    $('#headingFive').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingFive a').removeClass('titleActive').addClass('title');
                }
                $scope.tab3 = function () {
                    $scope.isShow3 = !$scope.isShow3 ;
                    $('#headingOne').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingOne a').removeClass('titleActive').addClass('title');

                    $('#headingTwo').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingTwo a').removeClass('titleActive').addClass('title');

                    $('#headingThree').removeClass('titleBg').addClass('titleBgActive');
                    $('#headingThree a').removeClass('title').addClass('titleActive');

                    $('#headingFour').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingFour a').removeClass('titleActive').addClass('title');

                    $('#headingFive').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingFive a').removeClass('titleActive').addClass('title');
                }
                $scope.tab4 = function () {
                    $scope.isShow4 = !$scope.isShow4 ;

                    $('#headingOne').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingOne a').removeClass('titleActive').addClass('title');

                    $('#headingTwo').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingTwo a').removeClass('titleActive').addClass('title');

                    $('#headingThree').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingThree a').removeClass('titleActive').addClass('title');

                    $('#headingFour').removeClass('titleBg').addClass('titleBgActive');
                    $('#headingFour a').removeClass('title').addClass('titleActive')

                    $('#headingFive').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingFive a').removeClass('titleActive').addClass('title');

                }
                $scope.tab5 = function () {
                    $scope.isShow5 = !$scope.isShow5 ;
                    $('#headingOne').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingOne a').removeClass('titleActive').addClass('title');

                    $('#headingTwo').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingTwo a').removeClass('titleActive').addClass('title');

                    $('#headingThree').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingThree a').removeClass('titleActive').addClass('title');

                    $('#headingFour').removeClass('titleBgActive').addClass('titleBg');
                    $('#headingFour a').removeClass('titleActive').addClass('title');

                    $('#headingFive').removeClass('titleBg').addClass('titleBgActive');
                    $('#headingFive a').removeClass('title').addClass('titleActive')
                }

                /**
                 * 左侧底部图表自适应
                 */
                function chartContainer() {
                    var _outH = $('#mainBody').outerHeight(true);
                    // console.log(_outH)
                    var _weatH = $('#weather').outerHeight(true);
                    // console.log(_weatH)
                    var _newsH = $('#news-l').outerHeight(true);
                    // console.log(_newsH)
                    var _reachH = $('#reach-table').outerHeight(true);
                    // console.log(_reachH)
                    var _mapH = $('#mid-map').outerHeight(true);
                    // console.log(_mapH)
                    var _rankH = $('#rank').outerHeight(true);
                    // console.log(_rankH)
                    var _cityRankH = $('#cityRank').outerHeight(true);
                    // console.log(_cityRankH)

                    var chartHeight = _outH - _weatH - _newsH - _reachH - 60;
//	                $('#main').css('height', chartHeight);

                    var patrolHeight = _outH - _mapH - 10;
//	                $('#patrol-num').css('height', patrolHeight);

                    var checkHeight = _outH - _rankH - _cityRankH - 10;
//	                $('#check-active').css('height', checkHeight);

                    var rNewsHeight = checkHeight - 100;
//	                $('#right-news-content').css('height', rNewsHeight);

                }

                window.onresize = function () {
                    chartContainer();
                }

                /*当前巡河人数统计*/
                function patrolCount() {

                    $http({
                        // url: "http://117.8.229.5:9000/chairmanOnline/v1/patrolCount",
                        url: $localStorage.serviceUrl_chiefOnline + '/chairmanOnline/v1/patrolCount',
                        method: 'get'
                    }).success(function (res) {
                        if (res.resCode == 1) {
                            $scope.itemlist = res.data;
                        }
                    }).error(function (res) {
                        layer.msg('服务器异常，请稍后再试');
                    });

                }

                /*行政区划*/
                function regionList() {
                    $http({
                        // url: "http://117.8.229.5:9000/chairmanOnline/v1/regionArea",
                        url: $localStorage.serviceUrl_chiefOnline + '/chairmanOnline/v1/regionArea',
                        method: 'get'
                    }).success(function (res) {
                        if (res.resCode == 1) {
                            $scope.regionlist = res.data;
                            var regionID = $scope.regionlist[0].id;
                            rightStatusCount(regionID);
                        }
                    }).error(function (res) {
                        layer.msg('服务器异常，请稍后再试');
                    });

                }

                //页面销毁前清除定时
                $scope.$on('$destroy', function () {
                    //清除service中定时器
                    if (WorkbenchService.refreshDataTimer !== null) {
                        clearInterval(WorkbenchService.refreshDataTimer);
                    }

                    //clearInterval(timer);
                });

                /*行政区划切换*/
                var regionId, regionName, regionGrade, regionLng, regionLat, regionSpatialData;
                $scope.regionChange = function (region) {
                    if (region) {
                        regionId = region.id;
                        regionName = region.name;
                        regionGrade = region.grade;
                        regionLat = region.latitude;
                        regionLng = region.longitude;
                        regionSpatialData = region.spatialData;
                    }

                    if (MapTool.getflashingTimer !== null) {
                        MapTool.clearflashingTimer();
                    }

                    if (region === null) {
                        console.warn("clickRegion is null");
                        return;
                    }
                    //节点点击定位
                    if (region && MapUtil.isCoordValid(region["longitude"], region["latitude"])) {
                        if (region["grade"] !== null) {
                            MapUtil.center2LongLat(region["longitude"], region["latitude"], region["grade"]);
                            if (region["spatialData"] && region["spatialData"] !== null && region["spatialData"] !== "") {
                                WorkbenchService.addParentGraphic(region["spatialData"], true);
                            } else {
                                WorkbenchService.clearReginLayer();
                                console.warn("spatialData is null");
                            }

                        }
                    } else {
                        console.error("无效坐标");
                        alert("定位失败！无经纬度信息...");
                    }

                };


                /*巡河、在线数据*/
                function rightStatusCount(id) {
                    $http({
                        url: $localStorage.serviceUrl_chiefOnline + '/chairmanOnline/v1/countHZStatus/' + id,
                        method: 'get'
                    }).success(function (res) {
                        if (res.resCode == 1) {
                            $scope.rightStausCount = res.data;
                        }
                    });
                };

                // 调查报告
                function getBulletin() {
//					$ajaxhttp.myhttp({
//						url: apiPrefix + '/v1/bulletin/selectByFirst?type=1',
//						method: 'get',
//						callBack: function (res){
//							$scope['bulletin1'] = res;
//						}
//					});
//					$ajaxhttp.myhttp({
//						url: apiPrefix + '/v1/bulletin/selectByFirst?type=2',
//						method: 'get',
//						callBack: function (res){
//							console.log(res);
//							$scope.bulletin2 = res;
//						}
//					});
//					$ajaxhttp.myhttp({
//						url: apiPrefix + '/v1/bulletin/selectByFirst?type=3',
//						method: 'get',
//						callBack: function (res){
//							$scope['bulletin3'] = res;
//						}
//					});
//					$ajaxhttp.myhttp({
//						url: apiPrefix + '/v1/bulletin/selectByFirst?type=4',
//						method: 'get',
//						callBack: function (res){
//							$scope['bulletin4'] = res;
//						}
//					});
                    //暗查暗访
                    $http({
                        url: apiPrefix + '/v1/bulletin/selectByFirst?type=1',
                        method: 'get'
                    }).success(function (res) {
                        $scope.bulletin1 = res;
                    });
                    //工作动态
                    $http({
                        url: apiPrefix + '/v1/bulletin/selectByFirst?type=2',
                        method: 'get'
                    }).success(function (res) {
                        $scope.bulletin2 = res;
                    });
                    //工作简报
                    $http({
                        url: apiPrefix + '/v1/bulletin/selectByFirst?type=3',
                        method: 'get'
                    }).success(function (res) {
                        $scope.bulletin3 = res;
                    });
                    //考核通报
                    $http({
                        url: apiPrefix + '/v1/bulletin/selectByFirst?type=4',
                        method: 'get'
                    }).success(function (res) {
                        $scope.bulletin5 = res;
                    });

                    //督导检查
                    $http({
                        url: apiPrefix + '/v1/bulletin/selectByFirst?type=5',
                        method: 'get'
                    }).success(function (res) {
                        $scope.bulletin4 = res;
                    });
                }

                // 天气日期
                function getDate() {
                    setInterval(function () {
                        var date = new Date(),
                            year = date.getFullYear(),
                            month = date.getMonth() + 1,
                            day = date.getDate(),
                            hour = date.getHours(),
                            min = date.getMinutes(),
                            second = date.getSeconds();

                        $scope.$apply(function () {
                            $scope.weatherDate = {
                                year: year,
                                month: month,
                                day: day,
                                hour: hour < 10 ? '0' + hour : hour,
                                min: min < 10 ? '0' + min : min,
                                second: second < 10 ? '0' + second : second
                            }
                        })
                    }, 1000);
                }

                // 巡河总数
                function getCountHZOnline() {

                    $ajaxhttp.myhttp({
                        // url: 'http://117.8.229.5:9000/chairmanOnline/v1/countHZOnline',
                        url: $localStorage.serviceUrl_chiefOnline + '/chairmanOnline/v1/countHZOnline',
                        method: 'get',
                        callBack: function (res) {
                            if (res.resCode == 1) {
                                $scope.countHZOnline = res.data;
                            }
                        }
                    });
                    /*$scope.countHZOnline = {
                        townTotal: 20,
                        villageTotal: 12,
                        cityCount: 81,
                        countyCount: 2,
                        villageCount: 3,
                        countyTotal: 9,
                        cityTotal: 8,
                        townCount: 11
                    }*/
                }

                // 通报预览
                $scope.viewBulletin = function (id) {

                    globalParam.setter({
                        bulletin: {
                            id: id
                        }
                    })
                    getData(id);
                    $scope.shrink();
                    $('#myModal').modal('show');
                }

                // 数据详情
                function getData(id) {
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/bulletin/detail',
                        method: 'get',
                        params: {
                            id: id
                        },
                        callBack: function (res) {
                            $scope.bulletin = res.data;
                            //var attandNamePart = res.data.attandUrl.split('_');
                            if($scope.bulletin.detail){
                                $scope.bulletin.detail = $sce.trustAsHtml($scope.bulletin.detail)
                            }
                            if($scope.bulletin.ren){
                                var i = $scope.bulletin.ren.indexOf('.');
                                var str = $scope.bulletin.ren.slice(i+1);
                                // console.log(str)
                                if(str.toLowerCase() == 'jpg' || str.toLowerCase() == 'jpeg' || str.toLowerCase() == 'png'){
                                    $scope.showImg = true;
                                }else{
                                    $scope.showImg = false;
                                    var options = {
                                        pdfOpenParams: {
                                            pagemode: "thumbs",
                                            navpanes: 0,
                                            toolbar: 0,
                                            statusbar: 0,
                                            view: "FitV"
                                        }
                                    };
                                    PDFObject.embed($scope.bulletin.attand_url, "#pdfOb", options);
                                }
                            }
                        }
                    })
                }

                function getProblem() {
                    $http({
                        url: apiPrefix1 + '/v1/resumption/listWithMoreProblemReach',
                        method: 'get'
                    }).success(function (res) {
                        $scope.problemList = res.data;
                    }).error(function (error) {

                    })
                }

                $scope.closeModal = function () {
                    $('#myModal').modal('hide');
                }

            }
        ]);

})(window, angular);