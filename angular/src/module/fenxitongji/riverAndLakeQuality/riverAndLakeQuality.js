(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'riverAndLakeQuality',
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
                function ($localStorage, $scope,
                          $location, $log, $q, $rootScope, $window,
                          routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    // var apiPrefix = moduleService.getServiceUrl() + '/analysis';

                    var apiPrefix = ' http://10.0.9.133:7031/analysis';

                    $scope.sectionType = 1;
                    $scope.sectionName = '';
                    $scope.sectionSource = 1;
                    $scope.sectionAccess = 1;
                    $scope.startTime = '';
                    $scope.endTime = '';

                    //是否展示选择断面名称列表
                    $scope.showList = false;

                    //查询得到的断面名称列表
                    $scope.sectionNameList = []

                    //当前选中的断面名称
                    $scope.currentSectionName = ''

                    //当前断面的一些数据
                    $scope.detailList = [];

                    //是否展示详情
                    $scope.showDetail = false;

                    //详情中当前图标显示的是哪种数据
                    $scope.currentKind='qualityLevel';

                    $scope.dataKindEnum={
                        'qualityLevel':'水质类别',
                        'dO':'溶解氧',
                        'ammonia':'氨氮',
                        'totalphosphorus':'总磷',
                        'cOD':'化学需氧量',
                        'permanganate':'高锰酸盐'
                    };

                    var chartOption = {
                        xAxis: {
                            type: 'category',
                            data:[]
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            data: [],
                            type: 'line'
                        }],
                        toolTip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow',
                            },
                            formatter:'{b0}: {c0}<br />{b1}: {c1}'
                        }
                    };

                    var chart;


                    $scope.init = function () {
                        getList();
                    };

                    $scope.search = function () {
                        getList();
                    };

                    $scope.searchSectionNameList = function () {
                        var sectionName = $scope.sectionName;
                        if (sectionName !== '') {
                            $scope.showList = true;
                            var params = {
                                sectionName: sectionName
                            };
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/WaterQuality/getSection',
                                method: 'get',
                                params: params,
                                callBack: function (res) {
                                    if (res.data) {
                                        if (res.data.length > 10) {
                                            res.data.length = 10;
                                        }
                                        $scope.sectionNameList = res.data;
                                    }
                                }
                            })
                        }
                    }

                    $scope.selectSectionName = function (name) {
                        if (name) {
                            $scope.sectionName = name;
                            $scope.showList = false;
                        }
                    }

                    $scope.export = function () {
                        window.location.href = apiPrefix + '/v1/WaterQuality/createExcel?sectionType=' + $scope.sectionType + '&sectionName=' + $scope.sectionName + '&sectionSource=' + $scope.sectionSource + '&sectionAccess=' + $scope.sectionAccess
                    }

                    $scope.seeDetail = function (name) {
                        $scope.currentSectionName = name;
                        $scope.currentKind='qualityLevel';
                        $scope.showDetail = true;
                        getDetailList();
                        chart = echarts.init(document.getElementById('main'));
                    }

                    $scope.changeChartData= function() {
                        var dataList=[];
                        var timeList=[];
                        $scope.detailList.forEach(function (item) {
                            dataList.push(item[$scope.currentKind]);
                            timeList.push(item.samplingTime);
                        });
                        chartOption.series[0].data=dataList;
                        chartOption.xAxis.data=timeList;
                        chart.setOption(chartOption);
                    }

                    function getDetailList() {
                        var params = {
                            sectionName: $scope.currentSectionName,
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/WaterQuality/getWaterQuality',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                if (res.data) {
                                    $scope.detailList = res.data;
                                    $scope.changeChartData();
                                }
                            }
                        })
                    }

                    function getList() {
                        var params = {
                            sectionType: $scope.sectionType,
                            sectionName: $scope.sectionName,
                            sectionSource: $scope.sectionSource,
                            sectionAccess: $scope.sectionAccess,
                            pageNumber: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage
                        }
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/WaterQuality/selectWaterQuality',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                if (res.data) {
                                    $scope.dataList = res.data.list;
                                    $scope.paginationConf.totalItems = res.data.total;
                                }
                            }
                        })
                    }

                    // 开始时间
                    var startTime = $('#startTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.startTime = result;
                        $scope.$apply();
                    });

                    // 结束时间
                    var endTime = $('#endTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        var result = new moment(c.date).format('YYYY-MM-DD');
                        $scope.endTime = result;
                        $scope.$apply();
                    });


                    // 配置分页基本参数
                    $scope.paginationConf = {
                        currentPage: 1,
                        itemsPerPage: 10,
                        pagesLength: 10,
                        perPageOptions: [1, 2, 3, 4, 5, 10],
                        onChange: function () {
                            if ($scope.paginationConf.totalItems) {
                                getList();
                            }
                        }
                    };

                }]);
})(window, angular);
