(function(window, angular) {
	'use strict';

	angular
			.module("app")
			.controller(
					'policyDocAdd',
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
							function policyDocAdd($localStorage, $scope, $location,
									$log, $q, $rootScope, $window,
									routeService, $http) {
								
								$scope.docDlist = function() {
									routeService.route(545, false);
								}
								
								$scope.add = function() {
									routeService.route(545, false);
								}								
								
								$scope.back = function() {
									// 跳转到菜单页面
									routeService.route(545, false);
								}
							

							} ]);


})(window, angular);