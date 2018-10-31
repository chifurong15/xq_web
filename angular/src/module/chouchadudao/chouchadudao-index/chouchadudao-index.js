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
					
					$scope.init = function () {
                        getList();

//						$ajaxhttp.myhttp({
//							url: apiPrefix + '/v1/SurfaceWater/userinfo',
//							method: 'get',					
//							callBack: function (res) {
//								$scope.num = res.data;
//							}
//						})
					}
					
					// 获取数据列表
					function getList () {

						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/AnzhaScheme/list',
							method: 'get',
							params: {
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage,
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
					
					// 新建
	                $scope.add = function () {
						globalParam.setter({
							bulletin: {}
						})
						routeService.route('2-1-5', false);
	                }
	                
	                //修改 评分报告
	                $scope.edit = function (id) {
						routeService.route('2-1-1', false);
	                }
	                
	                 // 查看    通报     处理
	                $scope.view = function () {
						//localStorage.setItem('selectedId',id);
						routeService.route('2-1-4', false);
	                }

	                //点击通报名称
					$scope.viewReport = function () {
                        routeService.route('2-6', true);
					}
	                
	                 // 上报
	                $scope.report = function (id) {
						routeService.route('2-1-3', false);						
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
