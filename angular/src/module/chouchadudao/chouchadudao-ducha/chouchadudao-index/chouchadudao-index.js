(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'duchaListCtrl',
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
				function duchaListCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService , globalParam) {
					
					var apiPrefix = moduleService.getServiceUrl() + '/template';
					
					$scope.init = function () {
//						$ajaxhttp.myhttp({
//							url: apiPrefix + '/v1/SurfaceWater/userinfo',
//							method: 'get',					
//							callBack: function (res) {
//								$scope.num = res.data;
//								getList();
//							}
//						})
					}
					
					// 获取数据列表
					function getList () {
												
						let month=new moment($scope.searchTime).format('M')<10 ? '0'+ new moment($scope.searchTime).format('M') : new moment($scope.searchTime).format('M');
						$scope.date=new moment($scope.searchTime).format('YYYY') + '-' + month;

//						$ajaxhttp.myhttp({
//							url: apiPrefix + '/v1/SurfaceWater/list',
//							method: 'get',
//							params: {
//								pageNumber: $scope.paginationConf.currentPage,
//								pageSize: $scope.paginationConf.itemsPerPage,
//								issue: $scope.searchTime && $scope.date,
//								status: $scope.type,
//								num: $scope.num,
//								createUser:$scope.createuser
//							},
//							callBack: function (res) {
//								$scope.surfaceWaterList = res.data.list;
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
						routeService.route('2-3-1', false);
	                }
	                	               
	                 // 查看    检查
	                $scope.view = function (id , op) {
						localStorage.setItem('selectedId',id);
													
						localStorage.setItem('no-ops',op);
						
						
						routeService.route('2-3-2', false);
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
