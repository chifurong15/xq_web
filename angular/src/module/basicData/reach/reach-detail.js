(function(window, angular) {
	'use strict';
	var app = angular.module("app");
	app.filter("trustHtml",function($sce){
	   	return function (input){
	       return $sce.trustAsHtml(input);
	   	}
	})
	app.controller('imReachDetail',['$localStorage','$scope','$rootScope','routeService','$http',
		function imReachDetail($localStorage, $scope, $rootScope, routeService, $http,) {
    		//获取当前数据详情字段
			if(!$localStorage.reachDetailData){
                layer.msg('获取数据失败,请重试')
            }
            $scope.reach = $localStorage.reachDetailData;

			$scope.back = function() {// 跳转到菜单页面
				routeService.route(108, true);
			}
		}
	]);
})(window, angular);