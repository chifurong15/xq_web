(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'superviseLedger',
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
                    var apiPrefix = 'http://192.168.2.100:7031' + '/analysis';


                    //区域列表
                    $scope.regionList=[];
                    //村镇列表
                    $scope.townList=[];

                    $scope.startTime = '';
                    $scope.endTime = '';
                    $scope.problemList = [];

                    $scope.solutionTime = '';
                    $scope.coordinationDepartment = '';
                    $scope.countyCode = '';
                    $scope.townCode = '';
                    $scope.recorder = '';
                    $scope.captainName = '';
                    $scope.job = '';
                    $scope.problemSituation = '';
                    $scope.remark = '';

                    $scope.init = function () {
                        getList();
                        getRegion();
                    };

                    $scope.searchData = function () {
                        getList();
                    };

                    //重置
                    $scope.reset = function () {
                        $scope.startTime = '';
                        $scope.endTime = '';
                    };

                    //新增
                    $scope.add = function () {
                        $('#addMyModal').modal('show')
                    };



                    function clear() {
                        $scope.solutionTime = '';
                        $scope.coordinationDepartment = '';
                        $scope.countyCode = '';
                        $scope.townCode = '';
                        $scope.recorder = '';
                        $scope.captainName = '';
                        $scope.job = '';
                        $scope.problemSituation = '';
                        $scope.remark = '';
                        $scope.assessory = [];
                    }


                    //导出
                    $scope.download = function () {
                        window.location.href= apiPrefix
                            + '/v1/saCoordinateSolution/createExcel?startTime='
                            + $scope.startTime
                            + '&endTime='
                            + $scope.endTime;
                    };


                    function getList() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/saCoordinateSolution/list',
                            method: 'get',
                            params: {
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                startTime: $scope.startTime,
                                endTime: $scope.endTime,
                            },
                            callBack: function (res) {
                                if (res.data) {
                                    $scope.problemList = res.data.list;
                                    $scope.paginationConf.totalItems = res.data.total;
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
                        onChange: function () {
                            //console.log($scope.paginationConf.currentPage);
                            $location.search('currentPage', $scope.paginationConf.currentPage);
                        }
                    };

                    // 当他们一变化的时候，重新获取数据条目
                    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getList);
                }]);
})(window, angular);
