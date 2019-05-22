(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'outputCompareInput',
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
                function outputCompareInput($localStorage, $scope,
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

                    $scope.startTime = year + '-' + ((month - 1) < 10 ? '0' + (month - 1) : (month - 1) ) ;
                    $scope.endTime = year + '-' + month ;

                    $scope.list = [];
                    for (var i = 0;i < 24; i++) {
                        $scope.list.push(i)
                    }

                    $scope.init = function () {
                        getList();
                        getRegion ()
                        getReachType ()
                        getPieData ()



                    };

                    $scope.search = function () {
                        getList();
                        getPieData ()


                    };



                    //初始化echarts图表
                    function getInitCharts() {

                        var myInputChart = echarts.init(document.getElementById('inputPie'));
                        var myOutputChart = echarts.init(document.getElementById('outputPie'));

                        //入境水质变化
                        var inputOption = {
                            title : {
                                text: '基准时间:' + $scope.startTime + '月-对比时间:' + $scope.endTime + '月基准与对比入境水质变化',
                                x:'center',
                                textStyle:{
                                    color:'#42a2fd'
                                }
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: function (params) {
                                    return '类别:' + params.name  + ' </br> ' + '个数:' + params.value + ' </br> ' + '占比:' + params.percent + '%';
                                }
                            },
                            color: ['#02659f', '#258916', '#c12a0b'],
                            legend: {
                                orient: 'horizontal',
                                left: '21%',
                                bottom:'7%',
                                itemGap:95,
                                data: ['上升','下降','持平']
                            },
                            series : [
                                {
                                    name: '访问来源',
                                    type: 'pie',
                                    radius : '55%',
                                    center: ['50%', '50%'],
                                    data:[
                                        {
                                            value: $scope.pieData.inputUpNumber,
                                            name:'上升',
                                            percent: $scope.pieData.inputUpNumber / ($scope.pieData.inputUpNumber + $scope.pieData.inputDownNumber + $scope.pieData.inputHoldNumber)
                                        },
                                        {
                                            value:$scope.pieData.inputDownNumber,
                                            name:'下降',
                                            percent:0

                                        },
                                        {
                                            value:$scope.pieData.inputHoldNumber,
                                            name:'持平',
                                            percent:0
                                        },
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

                        //出境水质变化
                        var outputOption = {
                            title : {
                                text: '基准时间:' + $scope.startTime + '月-对比时间:' + $scope.endTime + '月基准与对比出境水质变化',
                                x:'center',
                                textStyle:{
                                    color:'#42a2fd'
                                }
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: function (params) {
                                    return '类别:' + params.name  + ' </br> ' + '个数:' + params.value + ' </br> ' + '占比:' + params.percent + '%';
                               }
                            },
                            color: ['#02659f', '#258916', '#c12a0b'],
                            legend: {
                                orient: 'horizontal',
                                left: '21%',
                                bottom:'7%',
                                itemGap:95,
                                data: ['上升','下降','持平']
                            },
                            series : [
                                {
                                    name: '访问来源',
                                    type: 'pie',
                                    radius : '55%',
                                    center: ['50%', '50%'],
                                    data:[
                                        {
                                            value: $scope.pieData.outputUpNumber,
                                            name:'上升',
                                            percent: $scope.pieData.outputUpNumber / ($scope.pieData.outputUpNumber + $scope.pieData.outputDownNumber + $scope.pieData.outputHoldNumber)
                                        },
                                        {
                                            value:$scope.pieData.outputDownNumber,
                                            name:'下降',
                                            percent:0

                                        },
                                        {
                                            value:$scope.pieData.outputHoldNumber,
                                            name:'持平',
                                            percent:0
                                        },
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
                        myOutputChart.setOption(outputOption);
                    }


                    //获取饼图数据
                    function getPieData () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/WaterQualityGrade/pie',
                            method:'get',
                            params:{
                                beginTime:$scope.startTime,
                                endTime:$scope.endTime
                            },
                            callBack:function (res) {
                                if(res.resCode == 1){
                                    $scope.pieData = res.data;
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



                    function getList() {
                        var params = {
                            beginTime: $scope.startTime,
                            endTime: $scope.endTime,
                            regionCountryName: $scope.regionName,
                            riverType: $scope.reachType,
                            reachName: $scope.reachName
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/WaterQualityGrade/Contrast',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                if (res.data) {
                                    $scope.dataList = res.data;
                                   // $scope.paginationConf.totalItems = res.data.total;
                                }
                            }
                        })
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

                    // 结束时间
                    var endTime = $('#endTime').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM');
                        $scope.endTime = result;
                        $scope.$apply();
                    });



                    // 配置分页基本参数
                    // $scope.paginationConf = {
                    //     currentPage: 1,
                    //     itemsPerPage: 10,
                    //     pagesLength: 10,
                    //     perPageOptions: [1, 2, 3, 4, 5, 10],
                    //     onChange: function () {
                    //         if ($scope.paginationConf.totalItems) {
                    //             getList();
                    //         }
                    //     }
                    // };

                }]);
})(window, angular);
