var basicurl = "/drainageBasin/v1";
(function(window, angular) {
	'use strict';

	angular.module("app")
		.controller(
			'waterDetailCtrl', [
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
				function waterDetailCtrl($localStorage, $scope,
					$location, $log, $q, $rootScope, globalParam, $window,
					routeService, $http) {
						
					//获取当前数据
					$scope.water_name=globalParam.getter().data.waterName;
					$scope.drainage = globalParam.getter().data.basinName;
					$scope.water_code=globalParam.getter().data.waterCode;
					$scope.over_view=globalParam.getter().data.overView;
                    CKEDITOR.instances.editor.setData($scope.over_view);
					$scope.remark=globalParam.getter().data.remark;		
					$scope.basinCode=globalParam.getter().data.basinCode;		
					
					// 所属流域
					$scope.belongDrainage = function () {
				    	$http({
				            method: "get",
							url: $localStorage.serviceUrl + basicurl +"/findByBasinName"
				    		}).success(
								function (res) {
						        console.log(res);
						        $scope.belongDrainages = res.data.list;
						        console.log($scope.belongDrainages);
						   }
						);
				    }
					$scope.b_Water = {
						basinCode:$scope.basinCode
					};
					
					$scope.drainege_Change = function (x) {
						$scope.drainege_Change_code = x;
						console.log($scope.drainege_Change_code);
				    }
					
					// 返回按钮
					$scope.back = function() {
						routeService.route(534, true);
					}

				}
			]);

})(window, angular);