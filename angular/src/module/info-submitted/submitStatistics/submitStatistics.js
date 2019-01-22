(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'statisticsCtrl',
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
                function statisticsCtrl($localStorage, $scope,
                                        $location, $log, $q, $rootScope, $window,
                                        routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/messageSent';
                    // var apiPrefix = 'http://10.0.9.110:7028' + '/messageSent';


                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {

                        getList();

                    }
                    // 获取数据列表
                    function getList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/MsSentInfo/selectList',
                            method:'get',
                            params:{
                                kind:$scope.kind,
                                sentTime:$scope.startTime,
                                endTime:$scope.endTime
                            },
                            callBack:function (res) {
                                $scope.moduleList = res.data;
                            }
                        })
                    }

                    //搜索
                    $scope.searchData = function (){
                        getList();
                    }

                    //重置
                    $scope.reset = function (){
                        $scope.startTime = '';
                        $scope.endTime = '';
                        $scope.kind = '';
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

                } ]);
})(window, angular);
