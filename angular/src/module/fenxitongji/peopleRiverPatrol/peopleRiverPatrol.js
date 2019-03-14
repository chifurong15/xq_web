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

                    var apiPrefix = moduleService.getServiceUrl() + '/resumption';
                    // var apiPrefix = 'http://10.0.9.116:8081/resumption';

                    $scope.init = function () {

                        var params = globalParam.getter().fenxiParams || {};

                        getDataList();
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
                        getDataList(1);
                    }
                    $scope.add = function (list) {
                        var total = 0;
                        for (var i = 0; i < list.length; i++) {
                            total += list[i].finishedNum * 1;
                        }
                        return total;
                    }
                    $scope.add2 = function (list) {
                        var total = 0;
                        for (var i = 0; i < list.length; i++) {
                            total += list[i].unfinishedNum * 1;
                        }
                        return total;
                    }
                    $scope.trans = function (index) {
                        var arr = [];
                        for (var i = 0; i < $scope.dataList.length; i++) {
                            if (i == index) {
                                var item = $scope.dataList[i].list;
                                for (var j = 0; j < item.length; j++) {
                                    arr.push(item[j].finishedNum);
                                    arr.push(item[j].unfinishedNum);
                                }
                                break;
                            }
                        }
                        return arr;
                    }

                    // 获取列表
                    function getDataList(isSearch) {
                        var params = {
                            regionId: $scope.regionId,
                            grade: $scope.grade
                        };
                        if (isSearch) {
                            params.startTime = $scope.startTime;
                            params.endTime = $scope.endTime;
                        }

                        $http({
                            url: apiPrefix + '/v1/resumption/listProblemStatistic',
                            method: 'get',
                            params: params,
                        }).success(function (res) {
                            $scope.dataList = res.data;
                            console.log($scope.dataList);
                            $scope.regionName = res.regionName;
                        }).error(function (error) {

                        })
                    };

                }]);
})(window, angular);
