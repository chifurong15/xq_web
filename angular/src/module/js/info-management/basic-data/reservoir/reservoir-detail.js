(function(window, angular) {
	'use strict';

	angular.module("app")
		.controller(
			'reservoirDetailCtrl', [
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
				function reservoirDetailCtrl($localStorage, $scope,$location, $log, $q, $rootScope, globalParam,$window,routeService, $http) {
					
					//水库名称
					$scope.reservoirName = globalParam.getter().data.reservoirName;
					//所属区域
					$scope.regionName = globalParam.getter().data.regionName;
					//所属水系
					$scope.waterName = globalParam.getter().data.waterName;
					//水库岸别
					$scope.reservoirCoast = globalParam.getter().data.reservoirShoreName;
					//水库类型
					$scope.reservoirType = globalParam.getter().data.reservoirTypeName;	
					//水库面积
					$scope.acreage = globalParam.getter().data.acreage;
					//管理单位
					$scope.management_unit =globalParam.getter().data.managementUnit;
					//起点
					$scope.startPoint =globalParam.getter().data.startPointLongitude;
					//终点
					$scope.endPoint =globalParam.getter().data.endPointLongitude;
					//概述
					$scope.overView =globalParam.getter().data.overView;
                    CKEDITOR.instances.editor.setData($scope.overView);
					//备注
					$scope.remark =globalParam.getter().data.remark;
					//水库编码
					$scope.reservoirCode =globalParam.getter().data.reservoirCode;
					
					// 返回按钮
					$scope.back = function() {
						routeService.route(536, true);
					}
				}
			]);
})(window, angular);