(function(window, angular) {
	'use strict';
	var app = angular.module("app");
		app.filter("trustHtml",function($sce){
		   return function (input){
		       return $sce.trustAsHtml(input);
		   }
		})
		app.controller('pondDetailCtrl', ['$localStorage','$scope','$rootScope','routeService','$http',
            function pondDetailCtrl($localStorage, $scope, $rootScope, routeService, $http) {
                //获取当前数据详情字段
                if(!$localStorage.pondDetailData){
                    layer.msg('获取数据失败,请重试')
                }
                $scope.pond = $localStorage.pondDetailData;
                // 返回按钮
                $scope.back = function() {
                    routeService.route(120, true);
                }
            }
        ]);
})(window, angular);