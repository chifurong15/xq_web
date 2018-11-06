(function(window, angular) {
    'use strict';
    angular
        .module("app")
        .controller(
            'anchaReportListCtrl',
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
                function anchaReportListCtrl($localStorage, $scope,
                                       $location, $log, $q, $rootScope, $window,
                                       routeService, $http, $ajaxhttp, moduleService , globalParam) {

                    var apiPrefix = moduleService.getServiceUrl() + '/ancha';
                    //var apiPrefix = 'http://10.0.9.116:7021' + '/ancha';

                    $scope.init = function () {
                        getStatus ();
                        //$scope.num = '2'; // 05区河长办  02市河长办
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/AnzhaInvestigations/userinfo',
							method: 'get',
							callBack: function (res) {
								if(res.data == 5){
                                    $scope.num = 0;
                                }else if(res.data == 2){
								    $scope.permission = 2;
                                }else {
								    $scope.num = '';
                                }
								getList();
							}
						})
                    }

                    // 获取数据列表
                    function getList () {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/AnzhaBulletin/list',
							method: 'get',
							params: {
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage,
								month: $scope.searchTime,
								status: $scope.status,
								num: $scope.num,
								title:$scope.name
							},
							callBack: function (res) {
							    if(res.resCode == 1){
                                    $scope.reportList = res.data.list;
                                    $scope.paginationConf.totalItems = res.data.total;
                                }else{
                                    layer.msg('服务器异常，请稍后再试');
                                }
							}
						})
                    }

                    $('#J-searchTime').datetimepicker({
                        format: 'YYYY-MM',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.searchTime = new moment(c.date).format('YYYY-MM');
                        $scope.$apply();
                    });

                    //获取通报状态
                    function getStatus () {
                        $scope.statusList = [
                            {
                                id: 0,
                                status: '待通报'
                            },
                            {
                                id: 1,
                                status: '已下发'
                            },
                            {
                                id: 2,
                                status: '已反馈'
                            },
                            {
                                id: 3,
                                status: '未按期'
                            }
                        ]
                    }

                    // 搜索
                    $scope.search = function () {
                        getList();
                    };

                    //重置
                    $scope.reset = function () {
                        $scope.status = '';
                        $scope.searchTime = '';
                        $scope.name = '';
                    }

                    // 新建
                    $scope.add = function () {
                        globalParam.setter({
                            bulletin: {}
                        })
                        routeService.route('2-6-1', false);
                    }

                    // 查看   反馈
                    $scope.view = function (id , schemeid) {
                        localStorage.setItem('id',id);
                        localStorage.setItem('schemeid',schemeid);
                        routeService.route('2-6-2', false);
                    }


                    //点击计划方案
                    $scope.viewReport = function () {
                        routeService.route('2-1', true);
                    }


                    //下发并通报
                    $scope.report = function (id){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaBulletin/update',
                            method: 'put',
                            params: {
                                id: id
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    layer.msg('下发成功');
                                    getList();
                                }else{
                                    layer.msg('服务器异常，请稍后再试');
                                }
                            }
                        })
                    }

                    //返回
                    $scope.goBack=function(){
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
                } ]);
})(window, angular);
