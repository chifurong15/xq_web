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
								$scope.riverName = globalParam.getter().data.riverName;
								$scope.length = globalParam.getter().data.length;
								$scope.riverTypeName = globalParam.getter().data.riverTypeName;
								$scope.gradeName = globalParam.getter().data.gradeName;
								$scope.waterName = globalParam.getter().data.waterName;
								$scope.regionName = globalParam.getter().data.regionName;
								$scope.startPoint = globalParam.getter().data.startPoint;
								$scope.endPoint = globalParam.getter().data.endPoint;
								$scope.overView = globalParam.getter().data.overView;
                                CKEDITOR.instances.editor.setData($scope.overView);
								$scope.remark = globalParam.getter().data.remark;
								$scope.riverCode = globalParam.getter().data.riverCode;
							
						
								// 返回按钮
								$scope.back = function() {
									routeService.route(51, true);
								}

							} ]);

})(window, angular);