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
				function yourController($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http) {
				
					console.log('欢迎加入河长制');
			} ]);
})(window, angular);
