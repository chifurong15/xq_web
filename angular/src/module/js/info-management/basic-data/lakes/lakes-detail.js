(function(window, angular) {
	'use strict';

	angular.module("app")
		.controller(
			'lakesDetailCtrl', [
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
				function lakesDetailCtrl($localStorage, $scope,
					$location, $log, $q, $rootScope,globalParam, $window,
					routeService, $http) {
					
					//湖泊名称
					$scope.lakesName=globalParam.getter().data.lakesName;
					//所属区域
					$scope.regionName = globalParam.getter().data.regionName;
					//所属水系
					$scope.waterName = globalParam.getter().data.waterName;
					//湖泊类型
					$scope.lake_type = globalParam.getter().data.lakesTypeName;
					//湖泊岸别
					$scope.shore_type = globalParam.getter().data.lakeShoreName;
					//经度
					$scope.longitude = globalParam.getter().data.longitude;
					//维度
					$scope.latitude = globalParam.getter().data.latitude;
					//湖泊面积
					$scope.acreage = globalParam.getter().data.acreage;
					//湖泊概述
					$scope.overView= globalParam.getter().data.overView;
					//湖泊备注
					$scope.remark=globalParam.getter().data.remark;
					//湖泊编码
					$scope.lakesCode=globalParam.getter().data.lakesCode;
                    CKEDITOR.instances.editor.setData($scope.overView);
					
					// 返回按钮
					$scope.back = function() {
						routeService.route(535, true);
					}

				}
			]);

})(window, angular);