(function(window, angular) {
	'use strict';

	angular
			.module("app")
			.controller(
					'imRiverDetail',
					[
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
							function imRiverDetail($localStorage, $scope,
									$location, $log, $q, $rootScope, globalParam,$window,
									routeService, $http) {
								//获取当前数据详情字段
								$scope.riverDetail = $localStorage.riverDetailData;
                                CKEDITOR.instances.editor.setData($scope.riverDetail.overView);

								// 返回按钮
								$scope.back = function() {
									routeService.route(11, true);
								}

							} ]);

})(window, angular);