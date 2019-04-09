var basicurl = "/drainageBasin/v1";
(function(window, angular) {
	'use strict';
	var app = angular.module("app");
		app.filter("trustHtml",function($sce){
		   return function (input){
		       return $sce.trustAsHtml(input);
		   }
		})
		app.controller(
			'waterDetailCtrl', ['$localStorage','$scope','$q','$rootScope','globalParam','$window','routeService','$http',
				function waterDetailCtrl($localStorage, $scope, $q, $rootScope, globalParam, $window,routeService, $http) {
					if(!$localStorage.waterDetailData){
						layer.msg('数据获取失败',{shift:-1},function(){
							$scope.back();
						})
					}
					$scope.water = $localStorage.waterDetailData;

					// 返回按钮
					$scope.back = function() {
						routeService.route(104, true);
					}

				}
			]);

})(window, angular);