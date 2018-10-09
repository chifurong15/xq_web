(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'shuizhiListCtrl',
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
				function shuizhiListCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService , globalParam) {
//					$ajaxhttp.myhttp({
//						url: '',
//						method: '',
//						data: {},
//						callBack: function(res){
//							
//						}
//					})
					
					$('#J-searchTime').datetimepicker({
	                    format: 'YYYY-MM',
	                    locale: moment.locale('zh-cn')
	                }).on('dp.change', function (c) {
	                    $scope.searchTime = new moment(c.date).format('YYYY-MM');
	                    $scope.$apply();
	                });
					
					// 新建
	                $scope.add = function () {
						globalParam.setter({
							bulletin: {}
						})
						routeService.route('3-1-2', true);
	                }
	                
	                // 编辑
	                $scope.edit = function (id) {
						
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/bulletin/detail',
							method: 'get',
							params: {
								id: id
							},
							callBack: function (res) {
								globalParam.setter({
									bulletin: res.data
								})
								routeService.route('1-2', true);
							}
						})
	                }
	                
	                
					console.log('欢迎加入河长制');
			} ]);
})(window, angular);
