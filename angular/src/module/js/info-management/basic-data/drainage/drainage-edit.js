var basicUrl = "/drainageBasin/v1";
var waterUrl = "/waterSystem/v1";
var riverUrl = "/river/v1";
var lakesUrl = "/lakes/v1";
var reservoirUrl = "/reservoir/v1";
var reachUrl = "/reach/v1";
var dictionaryUrl = "/dictionary/v1";
(function(window, angular) {
	'use strict';

	angular.module("app")
		.controller(
			'drainageEditCtrl', [
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
				function drainageEditCtrl($localStorage, $scope,
					$location, $log, $q, $rootScope,globalParam, $window,
					routeService, $http) {
					//获取当前数据进行编辑操作
					$scope.editId = globalParam.getter().data.id;
					console.log($scope.editId);
					$scope.basin_name = globalParam.getter().data.basinName;
					$scope.over_view = globalParam.getter().data.overView;
					$scope.remark = globalParam.getter().data.remark;
                    CKEDITOR.instances.editor.setData($scope.over_view);
					/* 修改*/
                    var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
					$scope.drainageEdit = function() {
                        var data = CKEDITOR.instances.editor.getData();
                        if (!$scope.basin_name || !jsname.test($scope.basin_name) == null) {
                            layer.alert("请完善信息", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else {
                        $http({
                            url: $localStorage.serviceUrl +basicUrl + "/update",
                            method: "post",
                            params: {
                                id: $scope.editId,
                                basinName: $scope.basin_name,
                                overView: data,
                                remark: $scope.remark
                            }
                        }).success(
                            function success(result) {
                                layer.msg('修改成功！', {time: 2000});
                                routeService.route(533, true);
                            });
                    }
					};

                    $scope.length = 0;
                    $scope.$watch('remark', function (newValue) {
                        $scope.length = newValue.length;
                        if ($scope.length === 512) {
                            layer.msg('总共可以输入512个字符',{time:2000});
                        }
                    });


                    //判断名称是否重复
                    $scope.isRepeat = function(){
                        var oldName = $scope.basin_name;
                        var newName = globalParam.getter().data.basinName;
                        if(oldName.toUpperCase() === newName.toUpperCase()){
                            return;
                        }
                        $http({
                            method:'get',
                            url:$localStorage.serviceUrl +basicUrl + "/isRepeat",
                            params:{
                                name:$scope.basin_name
                            }
                        }).success(
                            function (res) {
                                if (res.resCode === 0){
                                    layer.msg('流域名称重复',{time:2000});
                                    clear();
                                }
                            }).error();
                    };

                    //清空表单
                    var clear = function() {
                        $scope.basinName='';

                    }
					
					// 返回按钮
					$scope.back = function() {
						routeService.route(533, true);
					}
					
					
				}
			]);
})(window, angular);