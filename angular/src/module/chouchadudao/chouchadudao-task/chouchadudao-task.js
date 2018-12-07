(function (window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'anchaTaskListCtrl',
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
                function anchaTaskListCtrl($localStorage, $scope,
                                           $location, $log, $q, $rootScope, $window,
                                           routeService, $http, $ajaxhttp, moduleService, globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/ancha';
                    //var apiPrefix = 'http://10.0.9.133:7021' + '/ancha';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        getRegion();
//						// 05区河长办  02市河长办
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaInvestigations/userinfo1',
                            method: 'get',
                            params:{id:$scope.userInfo.id},
                            callBack: function (res) {
                                $scope.num = res.data;
                                getList();
                            }
                        })
                    }

                    // 获取数据列表
                    function getList() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaInvestigations/list',
                            method: 'get',
                            params: {
                                pageNumber: $scope.paginationConf.currentPage,
                                pageSize: $scope.paginationConf.itemsPerPage,
                                schemeid: localStorage.getItem('id'),
                                objectid:$scope.userInfo.id,
                                date: $scope.searchTime,
                                region: $scope.region
                            },
                            callBack: function (res) {
                                $scope.taskList = res.data.list;
                                $scope.paginationConf.totalItems = res.data.total;
                            }
                        })
                    }

                    // 获取所有区
                    function getRegion() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaInvestigations/districtlist',
                            method: 'get',
                            callBack: function (res) {
                                $scope.regionList = res.data;
                            }
                        })
                    }

                    $('#J-searchTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.searchTime = new moment(c.date).format('YYYY-MM-DD');
                        $scope.$apply();
                    });


                    // 搜索
                    $scope.search = function () {
                        getList();
                    };

                    //重置
                    $scope.reSet = function () {
                        $scope.searchTime = '';
                        $scope.region = '';
                    }

                    // 新建
                    $scope.add = function () {
                        globalParam.setter({
                            bulletin: {}
                        })
                        routeService.route('2-1-1', false);
                    }

                    //修改任务
                    $scope.edit = function (id) {
                        globalParam.setter({
                            bulletin: {
                                id: id
                            }
                        })
                        routeService.route('2-1-1', false);
                    }

                    // 查看
                    $scope.view = function (id) {
                        localStorage.setItem('detailId', id);
                        routeService.route('2-1-2', false);
                    }

                    //返回
                    $scope.goBack = function () {
                        history.back(-1);
                    }

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
