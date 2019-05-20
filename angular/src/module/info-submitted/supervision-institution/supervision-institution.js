(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'supervisionInstitution',
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
                function supervisionInstitution($localStorage, $scope,
                                                $location, $log, $q, $rootScope, $window,
                                                routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/analysis';
                    // var apiPrefix = 'http://192.168.2.102:7031' + '/analysis';

                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';

                    $scope.dataList=[];
                    //区域列表
                    $scope.regionList=[];
                    $scope.startTime = '';
                    $scope.endTime = '';
                    //问题来源
                    $scope.problemResource='';
                    $scope.countryName='';
                    $scope.riverName='';

                    $scope.init = function () {
                        getRegion();
                        getList();
                    };

                    $scope.searchData=function(){
                        getList();
                    };

                    function getList () {
                        $ajaxhttp.myhttp({
                            url:apiPrefix + '/v1/superviseProblemInfo/list',
                            method:'get',
                            params:{
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                startTime:$scope.startTime,
                                endTime:$scope.endTime,
                                countryName:$scope.countryName,
                                riverName:$scope.riverName,
                                problemResource:$scope.problemResource
                            },
                            callBack:function (res) {
                                if(res.data){
                                    $scope.dataList = res.data.list;
                                    $scope.paginationConf.totalItems = res.data.total;
                                }
                            }
                        })
                    }


                    //搜索
                    $scope.searchData = function (){
                        getList();
                    };

                    //重置
                    $scope.reset = function () {
                        $scope.startTime = '';
                        $scope.endTime = '';
                        $scope.problemResource='';
                        $scope.countryName='';
                        $scope.riverName='';
                    };

                    //导出
                    $scope.download=function () {
                      window.location.href=apiPrefix + '/v1/superviseProblemInfo/createExcel?startTime=' +$scope.startTime
                          +'&endTime=' +$scope.endTime
                          +'&problemResource=' +$scope.problemResource
                          +'&countryName=' +$scope.countryName
                          +'&riverName=' +$scope.riverName
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

                    // 配置分页基本参数
                    $scope.paginationConf = {
                        currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                        itemsPerPage: 10,
                        pagesLength: 10,
                        perPageOptions: [1, 2, 3, 4, 5, 10],
                        onChange:function () {
                            if ($scope.paginationConf.totalItems) {
                                getList();
                            }
                        }
                    };
                } ]);
})(window, angular);
