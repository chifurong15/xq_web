(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'patrolStatisicCtrl',
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
                function patrolStatisicCtrl($localStorage, $scope,
                                               $location, $log, $q, $rootScope, $window,
                                               routeService, $http, $ajaxhttp, moduleService) {

                    var apiPrefix = moduleService.getServiceUrl() + '/patrol';
                    var apiPrefix = 'http://10.0.9.133:7027' + '/patrol';


                    $scope.init= function () {
                        getList ()
                        getUnit()
                    }




                    // 搜索
                    $scope.search = function () {
                        getList ()
                    }
                    // 重置
                    $scope.getReSet = function () {
                        $scope.startTime = '';
                        $scope.endTime = '';
                        $scope.dictName = '';
                    }

                    //查询列表
                    function getList () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/ExeAssPatrolRecord/selectList',
                            method: 'get',
                            params: {
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                unit:$scope.dictName,
                                patrolDateStart:$scope.startTime,
                                patrolDateEnd:$scope.endTime,
                                // column:$scope.column ? $scope.column : '',
                                // order:$scope.order ? $scope.order : ''
                            },
                            callBack: function (res) {
                                if(res.data.list){
                                    $scope.moduleList = res.data.list;
                                    $scope.paginationConf.totalItems = res.data.total;
                                }
                            }
                        })
                    }

                    //查询考核单位
                    function getUnit() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/ExeAssPatrolRecord/selectUnit',
                            method: 'get',
                            callBack: function (res) {
                                if(res.data){
                                    $scope.unitList = res.data;
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

                    // //动态设置最小值
                    // startTime.on('dp.change', function (e) {
                    //     endTime.data('DateTimePicker').minDate(e.date);
                    // });
                    // //动态设置最大值
                    // endTime.on('dp.change', function (e) {
                    //     startTime.data('DateTimePicker').maxDate(e.date);
                    // });



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
                } ]);
})(window, angular);
