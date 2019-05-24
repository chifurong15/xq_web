(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'cityWidePie',
            [
                '$localStorage',
                '$scope',
                '$location',
                '$log',
                '$q',
                '$rootScope',
                '$window',
                'routeService',
                '$http',
                '$ajaxhttp',
                'moduleService',
                'globalParam',
                function cityWidePie($localStorage, $scope,
                                            $location, $log, $q, $rootScope, $window,
                                            routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';

                    // var apiPrefix = ' http://10.0.9.203:8888/analysis';
                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';

                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth();

                    if(month == 0){//一月
                        month = 12;
                        year = year - 1;
                    }
                    month =  month < 10 ? '0' + month : month

                    $scope.startTime = year + '-' + month;

                    $scope.list = [];
                    for (var i = 0;i < 24; i++) {
                        $scope.list.push(i)
                    }

                    $scope.init = function () {
                        getRegion ()
                        getReachType ()
                        getPieData ()
                    };

                    $scope.search = function () {
                        getPieData ()
                    };



                    //初始化echarts图表
                    function getInitCharts() {

                        var myInputChart = echarts.init(document.getElementById('inputPie'));

                        //入境水质变化
                        var inputOption = {
                            title : {
                                text: '全市水质类别河道长度比例图',
                                x:'center',
                                textStyle:{
                                    color:'#42a2fd'
                                }
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: function (params) {
                                    if(params.percent == 0){
                                        return '类别:' + params.name  + ' </br> ' + '个数:' + params.value + ' </br> ' + '占比:' + params.percent;
                                    }else{
                                        return '类别:' + params.name  + ' </br> ' + '个数:' + params.value + ' </br> ' + '占比:' + params.percent + '%';
                                    }
                                }
                            },
                            color: ['#f357c5', '#258916', '#c12a0b','#02659f', '#7481d4', '#000000'],
                            legend: {
                                orient: 'horizontal',
                                left: '15%',
                                bottom:'7%',
                                itemGap:95,
                                data: ['Ⅰ-Ⅲ类','Ⅳ类', 'Ⅴ类','Ⅵ-Ⅶ类', 'Ⅷ-Ⅸ类','河干']
                            },
                            series : [
                                {
                                    name: '访问来源',
                                    type: 'pie',
                                    radius : '55%',
                                    center: ['50%', '50%'],
                                    data:[
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
                                    }
                                }
                            ]
                        };

                        myInputChart.setOption(inputOption);
                    }


                    //获取饼图数据
                    function getPieData () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/WaterQualityGrade/selectWaterQualityPercent',
                            method:'get',
                            params:{
                                date:$scope.startTime,
                                regionCode:$scope.regionName,
                                riverName:$scope.reachName,
                                riverType:$scope.reachType,
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    $scope.waterList = res.data;
                                    getInitCharts();
                                }
                            }
                        })
                    }


                    //获取行政区域
                    function getRegion (){
                        $ajaxhttp.myhttp({
                            url:regionTreeUrl,
                            method:'get',
                            params:{
                                pageNum:-1,
                                pageSize:-1,
                                grade:3
                            },
                            callBack:function (res) {
                                $scope.regionList = res.data.list;
                            }
                        })
                    }

                    //获取河道类型
                    function getReachType (){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/WaterQualityGrade/getRiverType',
                            method:'get',
                            callBack:function (res) {
                                $scope.reachTypeList = res.data;
                            }
                        })
                    }

                    //获取河流名称
                    function getRiver (code){
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/WaterQualityGrade/getRiver',
                            method:'get',
                            params:{
                                regionCode:code,
                            },
                            callBack:function (res) {
                                $scope.riverList = res.data;
                            }
                        })
                    }



                    //监听区域选择
                    $scope.selectSectionName = function (code) {
                        if(code){
                            getRiver (code);
                        }
                    }




                    // 开始时间
                    var startTime = $('#startTime').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM');
                        $scope.startTime = result;
                        $scope.$apply();
                    });

                }]);
})(window, angular);
