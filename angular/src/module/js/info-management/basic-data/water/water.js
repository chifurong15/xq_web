var basicUrl = "/drainageBasin/v1";
var waterUrl = "/waterSystem/v1";
var riverUrl = "/river/v1";
var lakesUrl = "/lakes/v1";
var reservoirUrl = "/reservoir/v1";
var reachUrl = "/reach/v1";
var dictionaryUrl = "/dictionary/v1";
(function(window, angular) {
	'use strict';

	var app = angular.module("app");
		app.filter("trustHtml",function($sce){
		   return function (input){
		       return $sce.trustAsHtml(input); 
		   } 
		})
		app.controller(
			'waterCtrl', [
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
				function waterCtrl($localStorage, $scope,$location, $log, $q, $rootScope,globalParam, $window,routeService, $http) {
					
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
					
					// 表单分页
					var reGetProducts = function() {
						$http({
							url: $localStorage.serviceUrl +waterUrl + "/findByQuery",
							method: 'GET',
							params: {
                                waterName: $scope.water_name,
                                waterCode: $scope.water_code,
                                basinCode:$scope.drainege_Change_code,
								page: $scope.paginationConf.currentPage,
								size: $scope.paginationConf.itemsPerPage
							},
						}).success(
							function(resp) {
								$scope.paginationConf.totalItems = resp.data.total;
								$scope.moduleList = resp.data.list;
								console.log($scope.moduleList);
							}).error(function(error) {});
					};
		
					// 配置分页基本参数
					$scope.paginationConf = {
						currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
						itemsPerPage: $rootScope.tempSize == null ? 10 : $rootScope.tempSize,
						pagesLength: 5,
						perPageOptions: [5, 10, 20, 50],
						onChange: function() {
							$location.search('currentPage', $scope.paginationConf.currentPage);
                            $rootScope.tempSize  = $scope.paginationConf.itemsPerPage;
						}
					};
					// 通过$watch currentPage和itemperPage,当他们一变化的时候，重新获取数据条目
					$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);
					
					//查看详情
					$scope.overView = function(id){
						$("#overViewBox").modal('show');
						$http({
							url: $localStorage.serviceUrl +waterUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function success(result) {
							console.log(result);
							$scope.detailContent=result.data.overView;
							console.log($scope.detailContent);
						});
					};
					
					// 表单删除
					$scope.moduleDelete = function(id) {
						var layerIndex = layer.confirm('确定删除本条数据吗？', {
							btn: ['确定', '取消']
							// 按钮
						}, function() {
							$http({
								url: $localStorage.serviceUrl +waterUrl + "/delete",
								method: "delete",
								params: {
									id: id
								}
							}).success(function success(result) {
								if(result.resCode == 0) {
										layer.msg('该水系下存在下级河流，请先删除下级内容！',{time:1000});
									} else {
										layer.msg('删除成功！', {time:1000});
									}
									reGetProducts();
									
								}, function failure(result) {
									console.log(result);
									layer.msg('删除失败！', {time:1000});
								});
								layer.close(layerIndex);
							}, function() {
		
						});
					};
					
					//上移
					$scope.moveUp = function(id){
						$http({
								url: $localStorage.serviceUrl +waterUrl + "/sortOrder",
								method: 'GET',
									params: {
									id:id,
									status:0
								},
							}).success(
								function(resp) {
									if(resp.resCode != 1) {
										layer.msg('已经是第一个数据了，不能再向上移动了！',{time:2000});
										return;
									}
									reGetProducts();
								}).error(function(error) {});
					}
					
					//下移
					$scope.moveDown = function(id){
						$http({
							url: $localStorage.serviceUrl +waterUrl + "/sortOrder",
							method: 'GET',
								params: {
								id:id,
								status:1
							},
						}).success(
							function(resp) {
								if(resp.resCode != 1){
                                    layer.msg('已经是最后一个数据了，不能再向下移动了！',{time:2000});
                                    return;
								}
								reGetProducts();
							}).error(function(error) {});
					}

					//搜索
                    $scope.moveIcon = true;
                    $scope.water_name = '';
                    $scope.b_Water = '';
                    $scope.find = function() {
                        if (($scope.b_Water == '' || $scope.b_Water == null) && $scope.water_name == '' ){
                            $scope.moveIcon = true;
                        } else if($scope.water_name || $scope.b_Water){
                            $scope.moveIcon = false;
                        }else {
                            $scope.moveIcon = false;
                        }

                        reGetProducts();
                        $scope.paginationConf.currentPage = 1;
                        $('.page-num').val($scope.paginationConf.currentPage);
					}
					
					// 水系新增
					$scope.waterAdd = function() {
						routeService.route(580, false);
					}
					// 水系详情
					$scope.waterDetail = function(id) {
						$http({
							url: $localStorage.serviceUrl +waterUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function success(result) {
							globalParam.setter(result)
							console.log(result);
							console.log(id);
							routeService.route(581, false);
						});
					}
					// 水系编辑
					$scope.waterEdit = function(id) {
						$http({
							url: $localStorage.serviceUrl +waterUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function success(result) {
							globalParam.setter(result)
							console.log(result);
							console.log(id);
							routeService.route(582, false);
						});
					}

				}
			]);

})(window, angular);