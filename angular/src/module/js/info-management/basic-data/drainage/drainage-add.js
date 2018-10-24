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
			'drainageAddCtrl', [
				'$localStorage',
				'$scope',
				'$location',
				'$log',
				'$q',
				'$rootScope',
				'$window',
				'routeService',
				'$http',
				function drainageAddCtrl($localStorage, $scope,
					$location, $log, $q, $rootScope, $window,
					routeService, $http) {
					
					//流域新增
					var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
					$scope.submit = function() {
						//取得纯文本
						var data = CKEDITOR.instances.editor.getData();
						console.log(data);
						if(!$scope.basinName || !jsname.test($scope.basinName) == null) {
							layer.alert("请完善信息", {
								skin: 'my-skin',
								closeBtn: 1,
								anim: 3
							});
						} else {
							$http({
								method: "post",
								url: $localStorage.serviceUrl + basicUrl + "/add",
								params: {
									basinName: $scope.basinName,
									remark: $scope.reMark,
									overView:data
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
                            url:$localStorage.serviceUrl + basicUrl + "/isRepeat",
                            params:{
                                name:$scope.basinName
                            }
                        }).success(
                            function (res) {
                                if (res.resCode === 0){
                                    layer.msg('流域名称重复',{time:2000});
                                    clear();
                                }
                            }).error();
                    };

                    // $scope.length = 0;
                    // $scope.$watch('reMark', function (newValue) {
                    //     $scope.length = newValue.length;
                    //     if ($scope.length === 512) {
                    //         layer.msg('总共可以输入512个字符',{time:2000});
                    //     }
                    // });
					//清空表单
					var clear = function() {
						$scope.basinName='';
						$scope.overView='';
						$scope.reMark='';
						CKEDITOR.instances.editor.setData(" ");
					}
					
					
					// 返回按钮
					$scope.back = function() {
						routeService.route(533, true);
					}
					
					
				}
			]);
})(window, angular);