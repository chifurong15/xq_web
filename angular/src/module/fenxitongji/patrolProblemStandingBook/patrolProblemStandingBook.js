(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'patrolProblemStandingBook',
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
                function patrolProblemStandingBook($localStorage, $scope,
                                            $location, $log, $q, $rootScope, $window,
                                            routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://10.0.9.194:7031' + '/analysis';


                    $scope.init = function () {

                        $scope.reset()

                    }


                    // 搜索
                    $scope.search = function () {
                        getDataList();
                    }


                    $scope.reset = function () {
                        $scope.startTime = '';
                        $scope.endTime = '';
                        getDataList();
                    }


                    // 获取列表
                    function getDataList() {
                        var params = {
                            beginDate: $scope.startTime,
                            endDate: $scope.endTime,
                        };
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/patrolRiverProblemStatistics/getListCountry',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                $scope.dataList = res.data;
                            }
                        })

                    };

                    //导出
                    $scope.export = function (){
                        window.open(
                            apiPrefix
                            + '/v1/patrolRiverProblemStatistics/exportData?beginDate='
                            + $scope.startTime
                            + '&endDate='
                            + $scope.endTime
                        )
                    }

                    //查看详情
                    $scope.viewDetail = function (id , data) {
                        data.startTime = $scope.startTime;
                        data.endTime = $scope.endTime;

                        routeService.route('5-17-1',true);
                        localStorage.setItem('level',id);
                        localStorage.setItem('staData',JSON.stringify(data));
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
                }]);
})(window, angular);
