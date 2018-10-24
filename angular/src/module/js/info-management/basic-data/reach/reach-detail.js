(function(window, angular) {
	'use strict';

	angular.module("app").controller(
			'imReachDetail',
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
					function imReachDetail($localStorage, $scope, $location, $log,$q, $rootScope,globalParam, $window, routeService, $http) {
						
						//湖泊名称
						$scope.sort=globalParam.getter().data.classify;
						console.log($scope.sort);
						$scope._codeText=globalParam.getter().data.reachCodeTextDTO;
						console.log($scope._codeText);
						console.log($scope._codeText.display);
						//河湖库编码展示
						$('#codeView').on('mouseover', function(){
						  var that = this;
							layer.tips($scope._codeText.display,that, {
							  tips: [1, '#58666e']
//							  time: 2000
							});
						});
						if($scope.sort === 'A'){
							$scope.riverBox = true;
							$scope.val='河段';
							console.log('Hello'+$scope.sort);
							$scope.reachFName = globalParam.getter().data.reachName;
							$scope.alias = globalParam.getter().data.alias;
							$scope.water_quality = globalParam.getter().data.waterGradeName;
							$scope.deposit_status = globalParam.getter().data.siltyName;
							$scope.river_part = globalParam.getter().data.greadName;
							$scope.river_shore = globalParam.getter().data.shoreName;
							$scope.region = globalParam.getter().data.regionName;
							$scope.river_ztree = globalParam.getter().data.pName;
							$scope.res_Change_value = globalParam.getter().data.greadName;
							$scope.startPoint = globalParam.getter().data.startPoint;
							$scope.endPoint = globalParam.getter().data.endPoint;
							$scope.whether_mountain = globalParam.getter().data.whetherName;
							$scope.whether_virtual = globalParam.getter().data.isVirtualName;
							$scope.length = globalParam.getter().data.length;
							$scope.width = globalParam.getter().data.width;
							$scope.throughArea = globalParam.getter().data.throughArea;
							$scope.overView = globalParam.getter().data.overView;
                            CKEDITOR.instances.editor.setData($scope.overView);
							$scope.reachCode = globalParam.getter().data.reachCode;
							console.log($scope.reachCode);
							
						}else if($scope.sort === 'B'){
							$scope.lakesBox = true;
							$scope.val='湖段';
							console.log('Hello'+$scope.sort);
							$scope.reachFName = globalParam.getter().data.reachName;
							$scope.alias = globalParam.getter().data.alias;
							$scope.water_quality = globalParam.getter().data.waterGradeName;
							$scope.deposit_status = globalParam.getter().data.siltyName;
							$scope.river_part = globalParam.getter().data.greadName;
							$scope.lakes_shore = globalParam.getter().data.shoreName;
							$scope.region = globalParam.getter().data.regionName;
							$scope.lakes_ztree = globalParam.getter().data.pName;
							$scope.res_Change_value = globalParam.getter().data.greadName;
							$scope.startPoint = globalParam.getter().data.startPoint;
							$scope.endPoint = globalParam.getter().data.endPoint;
							$scope.whether_mountain = globalParam.getter().data.whetherName;
							$scope.whether_virtual = globalParam.getter().data.isVirtualName;
							$scope.length = globalParam.getter().data.length;
							$scope.width = globalParam.getter().data.width;
							$scope.throughArea = globalParam.getter().data.throughArea;
							$scope.overView = globalParam.getter().data.overView;
                            CKEDITOR.instances.editor.setData($scope.overView);
							$scope.reachCode = globalParam.getter().data.reachCode;
							console.log($scope.reachCode);
						}else if($scope.sort === 'C'){
							$scope.reservoirBox = true;
							$scope.val='库段';
							console.log('Hello'+$scope.sort);
							$scope.reachFName = globalParam.getter().data.reachName;
							$scope.alias = globalParam.getter().data.alias;
							$scope.water_quality = globalParam.getter().data.waterGradeName;
							$scope.deposit_status = globalParam.getter().data.siltyName;
							$scope.river_part = globalParam.getter().data.greadName;
							$scope.reservoir_shore = globalParam.getter().data.shoreName;
							$scope.region = globalParam.getter().data.regionName;
							$scope.reservoir_ztree = globalParam.getter().data.pName;
							$scope.res_Change_value = globalParam.getter().data.greadName;
							$scope.startPoint = globalParam.getter().data.startPoint;
							$scope.endPoint = globalParam.getter().data.endPoint;
							$scope.whether_mountain = globalParam.getter().data.whetherName;
							$scope.whether_virtual = globalParam.getter().data.isVirtualName;
							$scope.length = globalParam.getter().data.length;
							$scope.width = globalParam.getter().data.width;
							$scope.throughArea = globalParam.getter().data.throughArea;
							$scope.overView = globalParam.getter().data.overView;
                            CKEDITOR.instances.editor.setData($scope.overView);
							$scope.reachCode = globalParam.getter().data.reachCode;
							console.log($scope.reachCode);
						}else{}
						
						
						$scope.back = function() {
							// 跳转到菜单页面
							routeService.route(52, true);
						}

					} ]);

})(window, angular);