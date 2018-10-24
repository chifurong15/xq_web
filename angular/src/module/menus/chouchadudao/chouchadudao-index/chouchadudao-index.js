(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'yourController',
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
				function yourController($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService) {
//					$ajaxhttp.myhttp({
//						url: '',
//						method: '',
//						data: {},
//						callBack: function(res){
//							
//						}
//					})
					console.log('欢迎加入河长制');
			} ]);
})(window, angular);
