(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'shuizhiUpdateCtrl',
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
                function shuizhiUpdateCtrl($localStorage, $scope,
                                           $location, $log, $q, $rootScope, $window,
                                           routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/quality';
                    // var apiPrefix = "http://10.0.9.133:7004" + '/quality';

                    var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';

                    $scope.region='';
                    $scope.river='';

                    $scope.init = function () {
                        $scope.id = localStorage.getItem('id');
                        getRegion();
                        getData();
                    };

                    //搜索
                    $scope.search = function () {
                        getData();
                    };

                    $scope.download=function () {
                      window.location.href=apiPrefix+'/v1/WaterQuality/createExcel?id='+$scope.id+'&river='+$scope.river+'&region='+$scope.region;
                    };

                    // 数据详情
                    function getData () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/WaterQuality/listScore',
                            method: 'get',
                            params: {
                                id:$scope.id,
                                region:$scope.region,
                                river:$scope.river,
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage
                            },
                            callBack: function (res) {
                                $scope.detailList = res.data.list;
                                $scope.paginationConf.totalItems = res.data.total;
                            }
                        })
                    }

                    //获取所属区域
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

                    //返回
                    $scope.goBack=function(){
                        history.back(-1);
                    };

                    // 配置分页基本参数
                    $scope.paginationConf = {
                        currentPage: 1,
                        itemsPerPage: 10,
                        pagesLength: 10,
                        perPageOptions: [1, 5, 10, 15, 10],
                        onChange: function () {
                            if ($scope.paginationConf.totalItems) {
                                getData();
                            }
                        }
                    };

                } ]);
})(window, angular);
