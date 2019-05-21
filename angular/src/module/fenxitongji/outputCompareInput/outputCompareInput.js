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


                    $scope.init = function () {
                        getList();
                        getRegion ()
                        getReachType ()

                    };

                    $scope.search = function () {
                        getList();
                    };

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
