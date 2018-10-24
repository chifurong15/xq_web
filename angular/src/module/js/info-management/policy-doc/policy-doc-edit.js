(function(window, angular) {
	'use strict';

	angular
			.module("app")
			.controller(
					'policyDocEdit',
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
							function policyDocEdit($localStorage, $scope, $location,
									$log, $q, $rootScope, $window,
									routeService, $http) {
								
								$scope.docDlist = function() {
									routeService.route(545, false);
								}
								
								$scope.edit = function() {
									routeService.route(545, false);
								}								
								
								$scope.back = function() {
									// 跳转到菜单页面
									routeService.route(545, false);
								}
								
								
								

							} ]);

	
	
})(window, angular);