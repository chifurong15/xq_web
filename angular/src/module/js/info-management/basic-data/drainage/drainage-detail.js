(function(window, angular) {
	'use strict';

	angular.module("app")
		.controller(
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
				function drainageDetailCtrl($localStorage, $scope,
					$location, $log, $q, $rootScope, globalParam,$window,
					routeService, $http) {
						
					
					//流域名称
					$scope.basin_name=globalParam.getter().data.basinName;
					//流域编码
					$scope.basin_code=globalParam.getter().data.basinCode;
					//流域概述
					$scope.over_view=globalParam.getter().data.overView;
					//流域备注
					$scope.remark=globalParam.getter().data.remark;
                    CKEDITOR.instances.editor.setData($scope.over_view);

                    // 返回按钮
					$scope.back = function() {
						routeService.route(533, true);
					}
					
					
				}
			]);
})(window, angular);