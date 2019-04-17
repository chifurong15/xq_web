(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'riverPatrolCtrl',
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
                function riverPatrolCtrl($localStorage, $scope,
                                         $location, $log, $q, $rootScope, $window,
                                         routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    // var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    var apiPrefix = 'http://10.0.9.133:7031/analysis';

                    $scope.startTime = '';
                    $scope.endTime = '';

                    $scope.init = function () {
                        getDataList();
                        $scope.reset()
                    };


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


                    // 搜索
                    $scope.search = function () {
                        getDataList();
                    };

                    //重置
                    $scope.reset = function () {
                        $scope.startTime = '';
                        $scope.endTime = '';
                    };
                    //导出
                    $scope.export = function () {
                        window.open(
                            apiPrefix
                            + '/v1/ProblemAnalysisController/createExcelXun?statTime='
                            + $scope.startTime
                            + '&endTime='
                            + $scope.endTime
                        )
                    };

                    // 获取列表
                    function getDataList() {
                        $http({
                            url: apiPrefix + '/v1/ProblemAnalysisController/xunHeCount',
                            method: 'get',
                            params: {
                                startTime: $scope.startTime,
                                endTime: $scope.endTime
                            },
                        }).success(function (res) {
                            $scope.dataList = res.data;
                        }).error(function (error) {

                        })
                    }

                    //查看详情
                    $scope.viewDetail = function (regionId, index) {
                        //防止key冲突，加上命名空间
                        sessionStorage.setItem('countRegionId', regionId);
                        sessionStorage.setItem('countIndex', index);
                        sessionStorage.setItem('countStartTime', $scope.startTime);
                        sessionStorage.setItem('countEndTime', $scope.endTime);
                        routeService.route('5-8-1', true);
                    }

                }]);
})(window, angular);
