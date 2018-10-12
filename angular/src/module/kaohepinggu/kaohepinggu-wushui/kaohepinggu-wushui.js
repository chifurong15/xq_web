(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'wushuiListCtrl',
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
				function wushuiListCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService , globalParam) {
							
					$scope.init = function () {
						//getList();
					}
					
					// 获取数据列表
					function getList () {
						//console.log('时间年份',new moment($scope.searchTime).format('YYYY'))
						//console.log('时间月份',new moment($scope.searchTime).format('M')<10 ? '0'+ new moment($scope.searchTime).format('M') : new moment($scope.searchTime).format('M'))
						let month=new moment($scope.searchTime).format('M')<10 ? '0'+ new moment($scope.searchTime).format('M') : new moment($scope.searchTime).format('M');
						$scope.date=new moment($scope.searchTime).format('YYYY') + '-' + month;
						console.log('期号',$scope.date);
						console.log('状态',$scope.type)
//						$ajaxhttp.myhttp({
//							url: apiPrefix + '/v1/bulletin/list',
//							method: 'get',
//							params: {
//								pageNumber: $scope.paginationConf.currentPage,
//								pageSize: $scope.paginationConf.itemsPerPage,
//								year: $scope.searchTime && new moment($scope.searchTime).format('YYYY'),
//								month: $scope.searchTime && new moment($scope.searchTime).format('M'),
//								type: $scope.type
//							},
//							callBack: function (res) {
//								$scope.bulletinList = res.data.list;
//                  			$scope.paginationConf.totalItems = res.data.total;
//							}
//						})
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
						routeService.route('3-3-2', true);
	                }
	                
	                // 编辑
	                $scope.edit = function (id) {
						
//						$ajaxhttp.myhttp({
//							url: apiPrefix + '/v1/bulletin/detail',
//							method: 'get',
//							params: {
//								id: id
//							},
//							callBack: function (res) {
//								globalParam.setter({
//									bulletin: res.data
//								})
//							}
//						})
						routeService.route('3-3-2', true);
	                }
	                
	                 // 查看
	                $scope.view = function (id) {
						globalParam.setter({
							bulletin: {
								id: id
							}
						})
						routeService.route('3-3-3', true);
	                }
					console.log('欢迎加入河长制');
			} ]);
})(window, angular);
