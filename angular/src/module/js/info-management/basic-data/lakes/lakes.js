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
			'lakesCtrl', [
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
				function lakesCtrl($localStorage, $scope,$location, $log, $q, $rootScope, globalParam,$window,routeService, $http) {

					//水系选择模态框【show】
					$scope.show = function() {
						$("#myModal_ztree").modal('show');
					};
					//初始化水系树
					$scope.init = function() {
						$scope.treeList();
					};
					//树节点点击问题
					var treeNode_find,
						belongWater,
						belongWaterCode;
					function zTreeOnClick(event, treeId, treeNode) {
						$http({
							method: "GET",
							url: $localStorage.serviceUrl +waterUrl + "/findByWaterCode",
							params: {
								waterCode: treeNode.id
							},
						}).success(
							function(res) {
								console.log(treeNode.id);
								console.log(res);
								var _resCode = res.resCode;
								if (_resCode == 1){
									belongWater = res.data.waterName;
									belongWaterCode = res.data.waterCode;

								}else{
									belongWaterCode = null;
									$scope.belongWater= '';
								}
							}
						);
					};
					//关闭模态框【确定按钮】
					$scope.modalOk = function (){
						$("#myModal_ztree").modal('hide');
                        $scope.belongWater = belongWater;
					};
					//生成水系树
					$scope.treeList = function(id) {
						$http({
							method: "get",
							url: $localStorage.serviceUrl +waterUrl + "/belongWater"
						}).success(
							function(res) {
								console.log(res);
								var setting1 = {
									enable: true,
									callback: {
										onClick: zTreeOnClick
									}
								};
								var zNodes1 = [{
									name: "根节点",
									icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
									open: true,
									children: res.data
								}];
								$.fn.zTree.init($("#regionTree"), setting1, zNodes1);
								$scope.tree = res.data
							}
						);
					};
					//水系模态框搜索框
					$scope.select = function() {
						$http({
							method: "GET",
							url: $localStorage.serviceUrl +waterUrl + "/belongWater",
							params: {
								waterName: $scope.waterName
							},
						}).success(
							function(res) {
								console.log($scope.waterName);
								console.log(res);
								var setting1 = {
									enable: true,
									callback: {
										onClick: zTreeOnClick
									}
								};
								var zNodes1 = [{
									name: "根节点",
									icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
									open: true,
									children: res.data
								}];
								$.fn.zTree.init($("#regionTree"), setting1, zNodes1);
								$scope.tree = res.data
							}
						);
					};

					//湖泊类型
					$scope.lakeType = function() {
						$http({
							method: "get",
							url: $localStorage.serviceUrl +dictionaryUrl + "/findDictionary",
							params: {
								type: 10
							},
						}).success(
							function(res) {
								console.log(res);
								$scope.lakeTypes = res.data;
								console.log($scope.lakeTypes);
							}
						);
					}
					$scope.lake_Change = function(lake_type) {
					    if (lake_type == null){
                            $scope.lake_Change_name = null;
                            $scope.lake_Change_id = null;
                        } else {
                            $scope.lake_Change_name = lake_type.dictName;
                            $scope.lake_Change_id = lake_type.dictValue;
                            console.log($scope.lake_Change_name);
                            console.log($scope.lake_Change_id);
                        }

					};

					// 表单分页
					var reGetProducts = function() {
						$http({
							url: $localStorage.serviceUrl +lakesUrl + "/findByNameAndWaterCodeAndType",
							method: 'GET',
							params: {
                                lakesName: $scope.lakesName,
                                lakesType: $scope.lake_Change_id,
                                waterCode: belongWaterCode,
								page: $scope.paginationConf.currentPage,
								size: $scope.paginationConf.itemsPerPage,
								status: -1
							},
						}).success(
							function(resp) {
								console.log(resp);
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
							url: $localStorage.serviceUrl +lakesUrl + "/detail",
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
								url: $localStorage.serviceUrl +lakesUrl + "/delete",
								method: "delete",
								params: {
									id: id
								}
							}).success(function success(result) {
								if(result.resCode == 0) {
									layer.msg('该湖泊下存在下级湖泊，请先删除下级内容！',{time:1000});
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
						
					//向上移动
					$scope.moveUp = function(id){
						$http({
							url: $localStorage.serviceUrl +lakesUrl + "/sortOrder",
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
								reGetProducts()
							}).error(function(error) {});
					}
					
					//向下移动
					$scope.moveDown = function(id){
						$http({
							url: $localStorage.serviceUrl +lakesUrl + "/sortOrder",
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
								reGetProducts()
                            }).error(function(error) {});
					}

                    $scope.moveIcon = true;
                    $scope.lakesName = '';
                    $scope.lake_type = '';
                    $scope.belongWater = '';
					//搜索
					$scope.find = function() {
                        if (($scope.lake_type =='' || $scope.lake_type == null) && $scope.lakesName =='' && $scope.belongWater == ''){
                            $scope.moveIcon = true;
                        } else if ($scope.lakesName || $scope.lake_type || $scope.belongWater){
                            $scope.moveIcon = false;
                        } else {
                            $scope.moveIcon = false;
                        }
                        reGetProducts();
                        $scope.paginationConf.currentPage = 1;
                        $('.page-num').val($scope.paginationConf.currentPage);
					}
					
					// 湖泊新增
					$scope.lakesAdd = function() {
						routeService.route(583, false);
					}
					// 湖泊详情
					$scope.lakesDetail = function(id) {
						$http({
							url: $localStorage.serviceUrl +lakesUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function success(result) {
							globalParam.setter(result)
							console.log(result);
							console.log(id);
							routeService.route(584, false);
						});
					}
					// 湖泊编辑
					$scope.lakesEdit = function(id) {
						$http({
							url: $localStorage.serviceUrl +lakesUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function success(result) {
							globalParam.setter(result)
							console.log(result);
							console.log(id);
							routeService.route(585, false);
						});
					}
					
					
					

				}
			]);

})(window, angular);