(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'supervisionStatistics',
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

                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';

                    //地区列表
                    $scope.regionList=[];
                    //督办统计列表
                    $scope.dataList=[];
                    //地区id
                    $scope.regionId='';
                    $scope.startTime = '';
                    $scope.endTime = '';







                    $scope.init = function () {
                        getRegion();
                        getList();
                    };

                    $scope.search=function(){
                        getList();
                    };

                    $scope.export = function () {
                        window.location.href = apiPrefix + '/v1/DubanAnalysis/createExcel'
                    };

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


                    function getList() {
                        var params = {
                            regionId: $scope.regionId,
                            starTime: $scope.startTime,
                            endTime: $scope.endTime
                        };
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanAnalysis/dubanAnalysis',
                            method: 'get',
                            params: params,
                            callBack: function (res) {
                                if (res.data) {
                                    $scope.dataList = res.data;
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
                }]);
})(window, angular);
