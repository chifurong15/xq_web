(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'anchaListCtrl',
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
				function anchaListCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService , globalParam) {

					var apiPrefix = moduleService.getServiceUrl() + '/ancha';
                    //var apiPrefix = 'http://10.0.9.133:7021' + '/ancha';
                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

					$scope.init = function () {
                        //getList();
                        // 05区河长办  02市河长办
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaInvestigations/userinfo1',
                            method: 'get',
							params:{
                                id:$scope.userInfo.id
                            },
                            callBack: function (res) {
                                $scope.num = res.data;
                                getList();
                            }
                        })

					}
					
					// 获取数据列表
					function getList () {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/AnzhaScheme/list',
							method: 'get',
							params: {
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage,
								title: $scope.title,
								issue:$scope.searchTime
							},
							callBack: function (res) {
								$scope.schemeList = res.data.list;
                 				$scope.paginationConf.totalItems = res.data.total;
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
					
					
					// 搜索
	                $scope.search = function () {
	                    getList();
	                };

                    $scope.reset = function () {
                    	$scope.title = '';
                    	$scope.searchTime = '';
					}

					// 新建
	                $scope.add = function () {
						routeService.route('2-1-5', false);
	                }

	                 // 查看
	                $scope.view = function (id) {
						localStorage.setItem('id',id);
						routeService.route('2-1-4', false);
	                }

	                //点击通报名称
					$scope.viewReport = function () {
                        routeService.route('2-6', true);
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