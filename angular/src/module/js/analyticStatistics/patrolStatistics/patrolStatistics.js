(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    })

    app.controller(
        'patrolStatisticsCtrl', [
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
            function patrolStatisticsCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http) {

                $scope.init = function () {
                    $scope.regionId = $localStorage.userLoginInfo.userInfo.regionId;
                    reGetProducts();
                    chartContainer();
                    regionTreeList();
                };

                var $regionCode, $regionTreeContainer = $('#regionTreeContainer');
                var regionTree, reachTree, treeNode_find, treeNode_id;
                var regionTreeUrl = $localStorage.gwUrl + '/information/v1/administrativeRegion/regionTree';

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

                //动态设置最小值
                startTime.on('dp.change', function (e) {
                    endTime.data('DateTimePicker').minDate(e.date);
                });
                //动态设置最大值
                endTime.on('dp.change', function (e) {
                    startTime.data('DateTimePicker').maxDate(e.date);
                });

                // 行政区域树配置
                var regionTreeSetting = {
                    data: {
                        simpleData: {enable: true},
                        keep: {parent: true}
                    },
                    view: {
                        nameIsHTML: true,
                        expandSpeed: 'slow',
                        dblClickExpand: false,
                        txtSelectedEnable: false
                    },
                    callback: {
                        beforeExpand: regionTreeOnExpand,
                        onClick: regionTreeOnClick
                    }
                };

                // 捕获行政区域节点被点击
                function regionTreeOnClick(event, treeId, treeNode) {
                    console.log(treeNode);
                    $http({
                        method: 'get',
                        url: regionTreeUrl
                    }).success(
                        function (resp) {
                            console.log(resp);
                            treeNode_find = treeNode.id;
                            $scope.regionId = treeNode.id;
                            $scope.regionName = treeNode.name;
                            $scope.grade = treeNode.grade;
                        })
                }

                // 用于捕获行政区域父节点展开之前的问题回调函数，并且根据返回值确定是否允许展开操作
                function regionTreeOnExpand(treeId, treeNode) {
                    console.log('===========regionTreeOnExpand===========');
                    var cnodes = treeNode.children;
                    if (cnodes != null && cnodes.length > 0) {
                        return;
                    }
                    $http({
                        method: 'get',
                        url: regionTreeUrl,
                        params: {
                            parentCode: treeNode.id
                        },
                    }).success(
                        function (res) {
                            console.log(res);
                            regionTree.addNodes(treeNode, res.data, true);
                        }
                    );
                }

                // 区域树获取
                var regionTreeList = function () {
                    $http({
                        method: 'get',
                        url: regionTreeUrl,
                        params: {
                            regionCode: $scope.regionId
                        }
                    }).success(function (data) {
                        console.log(data)
                        $scope.regionList = data.data;
                        console.log($scope.regionList);
                        regionTree = $.fn.zTree.init($("#regionTreeContainer"), regionTreeSetting, $scope.regionList);
                    }).error(function () {
                    });
                };

                $scope.regionTree = function () {
                    $('#regionTree').modal('show');
                    regionTreeList(regionCode);
                    $scope.regionCode = $scope.regionId;
                }

                // 模态框行政区域选择
                $scope.getRegion = function (id) {
                    console.log(id);
                    $('#regionTree').modal('hide');
                }

                // 单选按钮组
                $scope.typeList = [
                    {"id": 1, "typeName": "本年"},
                    {"id": 2, "typeName": "本月"},
                    {"id": 3, "typeName": "上月"}
                ];
                $scope.isSelected = '2';
                $scope.radioBtn = function(type){
                    console.log(type);
                    $scope.type = type;
                    reGetProducts();
                }

                // 分页
                var patrolChart;
                var reGetProducts = function () {
                    $http({
                        url: $localStorage.serviceUrl_patrolMgr + '/resumption/v1/listReachPatrolNumStatistic',
                        method: 'get',
                        params: {
                            parentRegionId: $scope.regionId,
                            type: $scope.type
                            /*pageSize: $scope.paginationConf.itemsPerPage,
                            pageNumber: $scope.paginationConf.currentPage*/
                        }
                    }).success(function (resp) {
                        //$scope.paginationConf.totalItems = resp.data.total;
                        console.log(resp);
                        $scope.moduleList = resp.data;
                        patrolChart = new patrolMgrChart('patrolChart', $scope.moduleList);
                        patrolChart.setChart();
                    }).error(function (error) {

                    })
                };

                // 搜索
                $scope.search = function () {
                    reGetProducts();
                    clearList();
                };

                //清空列表
                var clearList = function () {
                    $scope.regionCode = '';
                };

                // 点击更新下级行政区域
                $scope.nextRegionGrade = function (id) {
                    console.log(id);
                    $scope.regionId = id;
                    reGetProducts();
                    globalParam.setter($scope.regionId);
                };

                // 点击返回上级行政区域
                $scope.backRegionGrade = function () {
                    $scope.regionId = globalParam.getter($scope.regionId);
                    reGetProducts();
                }

                // 河长巡河柱状图
                function patrolMgrChart(id, data) {
                    this.chartData = echarts.init(document.getElementById(id));
                    this.chartDataOption = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        grid: {
                            top: '10%',
                            left: '5%',
                            right: '5%',
                            bottom: '5%',
                            containLabel: true
                        },
                        legend: {
                            data: ['已巡查次数', '未巡查次数', '巡查达标率']
                        },
                        xAxis: {
                            type: 'category',
                            data: [],
                            axisLabel: {
                                textStyle: {
                                    color: '#333'
                                }
                            },
                            splitLine: {
                                show: false //不显示分割线
                            }
                        },
                        yAxis: [
                            {
                                type: 'value',
                                name: '次数',
                               /* min: 0,
                                max: 250,
                                interval: 50,
                               */
                                splitLine: {show: false}
                            },
                            {
                                type: 'value',
                                name: '达标率',
                                axisLabel: {
                                    formatter: '{value} %'
                                }
                            }
                        ],
                        dataZoom: [{
                            type: 'inside',
                            xAxisIndex: 0,
                            minValueSpan: 5
                        }],
                        series: [
                            {
                                name: '已巡查次数',
                                type: 'bar',
                                stack: '总数',
                                data: [],
                                barWidth: 30,
                                itemStyle: {
                                    normal: {
                                        color: '#56f46c'
                                    }
                                }
                            },
                            {
                                name: '未巡查次数',
                                type: 'bar',
                                stack: '总数',
                                data: [],
                                barWidth: 30,
                                itemStyle: {
                                    normal: {
                                        color: '#56cdf5',
                                        barBorderRadius: [10, 10, 0, 0]
                                    }
                                }
                            },
                            {
                                name: '巡查达标率',
                                type: 'line',
                                yAxisIndex: 1,
                                data: []
                            }
                        ]
                    };
                    this.setChart = function () {
                        var xAxisNames = [];
                        var hasPatrolNums = [];
                        var needPatrolNums = [];
                        var patrolRates = [];

                        for (var i = 0; i < $scope.moduleList.length; i++) {
                            xAxisNames.push($scope.moduleList[i].regionName);
                            hasPatrolNums.push($scope.moduleList[i].hasPatrolNum);
                            if ($scope.type == 1) {
                                needPatrolNums.push($scope.moduleList[i].yearNeedPatrolNum);
                            } else {
                                needPatrolNums.push($scope.moduleList[i].monthNeedPatrolNum);
                            }
                            patrolRates.push($scope.moduleList[i].patrolRate * 100);
                        }

                        this.chartDataOption.xAxis.data = xAxisNames;
                        this.chartDataOption.series[0].data = hasPatrolNums;
                        this.chartDataOption.series[1].data = needPatrolNums;
                        this.chartDataOption.series[2].data = patrolRates;
                        this.chartData.setOption(this.chartDataOption);
                    }
                }

                // 图表自适应
                var chartContainer = function () {
                    var chartWidth = $('.tab-content').width();
                    var chartHeight = $(window).height() - 240;
                    $('#patrolChart').css('width', chartWidth).css('height', chartHeight);
                }

                window.onresize = function () {
                    chartContainer();
                    patrolChart.chartData.resize();
                }
            }
        ]);

})(window, angular);