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
			'waterEditCtrl', [
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
				function waterEditCtrl($localStorage, $scope,
					$location, $log, $q, $rootScope,globalParam, $window,
					routeService, $http) {
					
					//获取当前数据
					$scope.water_name=globalParam.getter().data.waterName;
					$scope.drainage = globalParam.getter().data.basinName;
					$scope.water_code=globalParam.getter().data.waterCode;
					$scope.overView=globalParam.getter().data.overView;
                    CKEDITOR.instances.editor.setData($scope.overView);
					$scope.remark=globalParam.getter().data.remark;
					$scope.waterId=globalParam.getter().data.id;		
					$scope.basinCode=globalParam.getter().data.basinCode;		
					
					// 所属流域
					$scope.belongDrainage = function () {
				    	$http({
				            method: "get",
							url: $localStorage.serviceUrl +basicUrl + "/findByBasinName",
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

                    $scope.length = 0;
                    $scope.$watch('remark', function (newValue) {
                        $scope.length = newValue.length;
                        if ($scope.length === 512) {
                            layer.msg('总共可以输入512个字符',{time:2000});
                        }
                    });

                    //判断名称是否重复
                    $scope.isRepeat = function(){

                        var oldName = $scope.water_name;
                        var newName = globalParam.getter().data.waterName;
                        if(oldName.toUpperCase() === newName.toUpperCase()){
                            return;
                        }
                        $http({
                            method:'get',
                            url:$localStorage.serviceUrl +waterUrl + "/isRepeat",
                            params:{
                                name:$scope.water_name
                            }
                        }).success(
                            function (res) {
                                if (res.resCode === 0){
                                    layer.msg('水系名称重复',{time:2000});
                                    clear();
                                }
                            }).error();
                    };

                    //清空表单
                    var clear = function() {
                        $scope.water_name='';
                    }
					
					$scope.drainege_Change = function (x) {
					    if (x == null){
                            $scope.drainege_Change_code = null;
                        } else {
                            $scope.drainege_Change_code = x;
                            console.log($scope.drainege_Change_code);
                        }
				    };
					
					/* 修改*/
                    var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
					$scope.submit = function() {
                        var data = CKEDITOR.instances.editor.getData();
                        if (!$scope.water_name || !jsname.test($scope.water_name) == null) {
                            layer.alert("请完善水系名称", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if ($scope.b_Water.basinCode == null || $scope.b_Water.basinCode === '') {
                            layer.alert("请完善所属流域", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else {
                            $http({
                                url: $localStorage.serviceUrl +waterUrl + "/update",
                                method: "post",
                                params: {
                                    id: $scope.waterId,
                                    basinCode: $scope.drainege_Change_code,
                                    waterName: $scope.water_name,
                                    overView: data,
                                    remark: $scope.remark
                                }
                            }).success(
                                function success(result) {
                                    console.log(result);
                                    layer.msg('修改成功！', {time: 2000});
                                    routeService.route(534, true);
                                });
                        }
                    }
					
					
					// 返回按钮
					$scope.back = function() {
						routeService.route(534, true);
					}

				}
			]);

})(window, angular);