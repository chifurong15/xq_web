(function(window, angular) {
	'use strict';

	var app = angular.module("app");
		app.filter("trustHtml",function($sce){
		   return function (input){
		       return $sce.trustAsHtml(input); 
		   } 
		})
		app.controller(
			'drainageDetailCtrl', [
				'$localStorage',
				'$scope',
				'$location',
				'$log',
				'$q',
				'$rootScope',
				'globalParam',
				'$window',
				'routeService',
				'$http',
				function drainageDetailCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http) {
                    //获取当前数据详情字段
                    if(!$localStorage.drainageDetailData){
                        layer.msg('数据获取失败',{shift:-1},function(){
							$scope.back();
						})
                    }
                    $scope.drainage = $localStorage.drainageDetailData;

                    /*返回按钮*/
					$scope.back = function() {
						routeService.route(103, true);
					}
				}
			]);
})(window, angular);