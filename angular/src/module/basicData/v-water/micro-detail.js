var modulePrefix = "/watersource";
var mdMicroUrl = modulePrefix + '/v1/mdMicro';
var microaccessoryUrl = modulePrefix + '/v1/microaccessory';
(function(window, angular) {
	'use strict';

	angular.module("app")
		.controller(
			'dataDetailCtrl', [
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
				'moduleService',
				function dataDetailCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http, moduleService) {

					//获取当前数据
					var id = globalParam.getter();

					detail();
					getUrl();
					function detail(){
						$http({
							url: moduleService.getServiceUrl() + mdMicroUrl + "/detail?time="+ new Date().getTime(),
							method: 'GET',
							params:{
								id:id
							}
						}).success(function(res) {
							if(res.resCode == 1){
								$scope.micro = res.data;
							}else{
								layer.msg('数据获取失败' || res.resMsg);
							}
						}).error(function(error) {});

					}
					function getUrl(){
						$http({
							url: moduleService.getServiceUrl() + microaccessoryUrl + "/findByMicroid?time="+ new Date().getTime(),
							method: 'GET',
							params:{
								microId:id
							}
						}).success(function(resp) {
							if(resp.resCode === 1){
								$scope.files = resp.data;
							}
						}).error(function(error) {});
					}

					// 返回按钮
					$scope.back = function() {
						routeService.route(115, true);
					}

				}
			]);

})(window, angular);