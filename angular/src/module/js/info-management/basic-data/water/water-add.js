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
			'waterAddCtrl', [
				'$localStorage',
				'$scope',
				'$location',
				'$log',
				'$q',
				'$rootScope',
				'$window',
				'routeService',
				'$http',
				function waterAddCtrl($localStorage, $scope,$location, $log, $q, $rootScope, $window,routeService, $http) {
					
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
					$scope.drainege_Change = function (b_Water) {
					    if (b_Water == null){
                            $scope.drainege_Change_name = null;
                            $scope.drainege_Change_code = null;
                        } else {
                            $scope.drainege_Change_name = b_Water.basinName;
                            $scope.drainege_Change_code = b_Water.basinCode;
                            console.log($scope.drainege_Change_name);
                            console.log($scope.drainege_Change_code);
                        }
				    };
					
					//项目新增
					var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
					$scope.watAdd = function() {
						//取得纯文本
						var data = CKEDITOR.instances.editor.getData();
						if(!$scope.water_name || !jsname.test($scope.water_name) == null) {
							layer.alert("请完善水系名称", {
								skin: 'my-skin',
								closeBtn: 1,
								anim: 3
							});
						}else if ($scope.b_Water == null || $scope.b_Water === ''){
                            layer.alert("请完善所属流域", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else {
							$http({
								method: "post",
								url: $localStorage.serviceUrl +waterUrl + "/add",
								params: {
									basinCode:$scope.drainege_Change_code,
									waterName: $scope.water_name,
									overView: data,
									remark: $scope.remark
									
								},
							}).success(
							function(res) {
							    if (res.resCode === 1){
                                    layer.msg('成功新增一条数据！',{time:2000});
                                    clear();
                                } else {
                                    layer.msg(res.resMsg,{time:2000});
                                    clear();
                                }

							});
						}
					};

                    //判断名称是否重复
                    $scope.isRepeat = function(){
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

                    $scope.length = 0;
                    $scope.$watch('remark', function (newValue) {
                        $scope.length = newValue.length;
                        if ($scope.length === 512) {
                            layer.msg('总共可以输入512个字符',{time:2000});
                        }
                    });

					//清空表单
					var clear = function() {
						$scope.water_name='';
						$scope.overView='';
						$scope.remark='';
						CKEDITOR.instances.editor.setData(" ");
					}
					
					// 返回按钮
					$scope.back = function() {
						routeService.route(534, true);
					}

				}
			]);

})(window, angular);