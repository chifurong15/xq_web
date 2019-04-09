var modulePrefix = "/watersource";
var basicUrl = modulePrefix + "/v1/drainageBasin";
var waterUrl = modulePrefix + "/v1/waterSystem";
var riverUrl = modulePrefix + "/v1/river";
var lakesUrl = modulePrefix + "/v1/lakes";
var reservoirUrl = modulePrefix + "/v1/reservoir";
var reachUrl = modulePrefix + "/v1/reach";
var dictionaryUrl = modulePrefix + "/v1/dictionary";
(function(window, angular) {
	'use strict';

	angular.module("app")
		.controller(
			'waterEditCtrl', [
				'$localStorage','$scope','$q','$rootScope','globalParam','$window','routeService','moduleService','$http',
				function waterEditCtrl($localStorage, $scope, $q, $rootScope, globalParam, $window, routeService, moduleService, $http) {
					//获取当前数据
					if(!$localStorage.waterEditData){
						layer.msg('数据获取失败',{shift:-1},function(){
							$scope.back();
						})
					}
					$scope.water = $localStorage.waterEditData;

					var oldName = $scope.water.waterName;
					$scope.isRepeat = function(){
						if($scope.water.waterName == oldName){
                            return;
                        }else if(!$scope.water.waterName){
                            return;
                        }
                        $http({
                            method:'get',
                            url:moduleService.getServiceUrl() + waterUrl + "/isRepeat",
                            params:{
                                name: $scope.water.waterName
                            }
                        }).success(function (res) {
                            if (res.resCode === 0){
                                layer.msg('水系名称重复',{time:2000});
                                $scope.water.waterName = '';
                            }
                        }).error();
                    };
					// 所属流域
					$scope.belongDrainage = function () {
				    	$http({
				            method: "get",
							url: moduleService.getServiceUrl() + basicUrl + "/findByBasinName",
				    	}).success(function (res) {
						    $scope.belongDrainages = res.data.list;
						});
				    }

					/* 修改*/
					var jsname = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,16}$/;
                    var jscode = /^[a-zA-Z0-9]{1,50}$/;
					$scope.waterEdit = function() {
						$scope.water.overView = CKEDITOR.instances.editor.getData();//取得纯文本
                        if (!$scope.water.waterName || !jsname.test($scope.water.waterName)) {
                            layer.msg('水系名称输入有误');
                            return;
                        }else if($scope.water.waterCode && !jscode.test($scope.water.waterCode)){
                            layer.msg('水系编码输入有误');
                            return;
                        }else if ($scope.water.basinCode == null || $scope.water.basinCode === ''){
                            layer.msg('请选择所属流域');
                            return;
                        }
						$http({
							method: "post",
							url: moduleService.getServiceUrl() + waterUrl + "/update",
							data: {
								id: $scope.water.id,
								waterName: $scope.water.waterName,
								waterCode: $scope.water.waterCode,
                                basinCode: $scope.water.basinCode,
                                overView: $scope.water.overView,
                                remark: $scope.water.remark,
                                linePoints:$scope.water.linePoints,
                                spatialData:$scope.water.spatialData,
                                jsonFiles: JSON.stringify($scope.water.jsonFiles),
                                jsonImages: JSON.stringify($scope.water.jsonImages)
							},
							headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest:function(obj){return $.param(obj)}
						}).success(function(res) {
						    if (res.resCode === 1){
                                layer.msg('修改成功',{shift:-1},function(){
                                	$scope.back();
                                });
                            } else {
                                layer.msg(res.resMsg || '请求失败,请稍后再试');
                            }
						}).error(function(res){
							layer.msg('服务器异常，请稍后再试');
						})
					};

					// 返回按钮
					$scope.back = function() {
						routeService.route(104, true);
					}

				}
			]);

})(window, angular);