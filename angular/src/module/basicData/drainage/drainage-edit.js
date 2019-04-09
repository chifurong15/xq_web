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
			'drainageEditCtrl', [
				'$localStorage',
				'$scope',
				'$q',
				'$rootScope',
				'$window',
				'routeService',
				'moduleService',
				'$http',
				function drainageEditCtrl($localStorage, $scope, $q, $rootScope, $window, routeService,moduleService, $http) {

					//获取当前数据详情字段
                    if(!$localStorage.drainageEditData){
                        layer.msg('数据获取失败',{shift:-1},function(){
                            $scope.back();
                        })
                    }
                    $scope.drainage = $localStorage.drainageEditData;

                    /*判断名称是否重复*/
                    var oldName = $scope.drainage.basinName;
                    $scope.isRepeat = function(){
                        if($scope.drainage.basinName == oldName){
                            return;
                        }else if(!$scope.drainage.basinName){
                            return;
                        }
                        $http({
                            method:'get',
                            url:moduleService.getServiceUrl() + basicUrl + "/isRepeat",
                            params:{
                                name:$scope.drainage.basinName
                            }
                        }).success(function (res) {
                            if (res.resCode === 0){
                                layer.msg('流域名称重复');
                                $scope.drainage.basinName = '';
                            }
                        }).error();
                    };

                    var jsname = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,16}$/;
                    var jscode = /^[a-zA-Z0-9]{1,50}$/;
					$scope.drainageEdit = function() {
                        $scope.drainage.overView = CKEDITOR.instances.editor.getData();
                        if (!$scope.drainage.basinName || !jsname.test($scope.drainage.basinName)) {
                            layer.msg('流域名称输入有误');
                            return;
                        }else if($scope.drainage.basinCode && !jscode.test($scope.drainage.basinCode)){
                            layer.msg('流域编码输入有误');
                            return;
                        }
                        $http({
                            url: moduleService.getServiceUrl() +basicUrl + "/update",
                            method: "post",
                            data: {
                                id: $scope.drainage.id,
                                basinName: $scope.drainage.basinName,
                                basinCode: $scope.drainage.basinCode,
                                remark: $scope.drainage.remark,
                                overView: $scope.drainage.overView,
                                longitude:$scope.drainage.longitude,
                                latitude: $scope.drainage.latitude,
                                acreage: $scope.drainage.acreage,
                                linePoints: $scope.drainage.linePoints,
                                spatialData: $scope.drainage.spatialData,
                                jsonFiles: JSON.stringify($scope.drainage.jsonFiles),
                                jsonImages: JSON.stringify($scope.drainage.jsonImages)
                            },
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            transformRequest:function(obj){return $.param(obj)}
                        }).success(function(res) {
                            if(res.resCode == 1){
                                layer.msg('修改成功！',{shift:-1},function(){
                                    $scope.back();
                                });
                            }else{
                                layer.msg(res.resMsg || '请求失败,请稍后再试');
                            }
                        }).error(function(){
                            layer.msg(res.resMsg || '服务器异常,请稍后再试');
                        });;
					};

					/*返回按钮*/
					$scope.back = function() {
						routeService.route(103, true);
					}
				}
			]);
})(window, angular);