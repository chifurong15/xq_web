var basicUrl = "/drainageBasin/v1";
var waterUrl = "/waterSystem/v1";
var riverUrl = "/river/v1";
var lakesUrl = "/lakes/v1";
var reservoirUrl = "/reservoir/v1";
var reachUrl = "/reach/v1";
var dictionaryUrl =  "/dictionary/v1";
(function(window, angular) {
	'use strict';

	var app = angular.module("app");
		app.filter("trustHtml",function($sce){
		   return function (input){
		       return $sce.trustAsHtml(input); 
		   } 
		})
		app.controller(
			'imRiver', [
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
				function imRiver($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http) {
					
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
						water_ztree_name,
						water_ztree_code;
					function zTreeOnClick(event, treeId, treeNode) {
						$http({
							method: "GET",
							url: $localStorage.serviceUrl_watersource +waterUrl + "/findByWaterCode",
							params: {
								waterCode: treeNode.id
							},
						}).success(
							function(res) {
								console.log(treeNode.id);
								console.log(res);
								var _resCode = res.resCode;
								if (_resCode == 1){
									water_ztree_name = res.data.waterName;
									water_ztree_code = res.data.waterCode;

								}else{
									water_ztree_code = null;
									$scope.water_ztree_name= '';
								}
							}
						);
					};
					//关闭模态框【确定按钮】
					$scope.modalOk = function (){
						$("#myModal_ztree").modal('hide');
                        $scope.water_ztree_name = water_ztree_name;
					};
					//生成水系树
					$scope.treeList = function(id) {
						$http({
							method: "get",
							url: $localStorage.serviceUrl_watersource +waterUrl + "/belongWater"
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
							url: $localStorage.serviceUrl_watersource +waterUrl + "/belongWater",
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
                    console.log("测试：" + $localStorage.serviceUrl_watersource + dictionaryUrl + "/findDictionary");
					//河流类型
					$scope.riverType = function() {
						$http({
							method: "get",
							url: $localStorage.serviceUrl_watersource + dictionaryUrl + "/findDictionary",
							params: {
								type: 9
							},
						}).success(
							function(res) {
								console.log(res);
								$scope.riverTypes = res.data;
								console.log($scope.riverTypes);
							}
						);
					}
					$scope.river_Change = function(river_type) {
					    if (river_type == null){
                            $scope.river_Change_name = null;
                            $scope.river_Change_id = null;
                        } else {
                            $scope.river_Change_name = river_type.dictName;
                            $scope.river_Change_id = river_type.dictValue;
                            console.log($scope.river_Change_name);
                            console.log($scope.river_Change_id);
                        }
					};
					
					//查看详情
					$scope.overView = function(id){
						$("#overViewBox").modal('show');
						$http({
							url: $localStorage.serviceUrl_watersource +riverUrl + "/detail",
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
					
					//向上移动
					$scope.moveUp = function(id){
						$http({
							url: $localStorage.serviceUrl_watersource +riverUrl + "/sortOrder",
							method: 'put',
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
					
					//向下移动
					$scope.moveDown = function(id){
						$http({
							url: $localStorage.serviceUrl_watersource +riverUrl + "/sortOrder",
							method: 'put',
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

                            }).error(function(error) {}
                            );
					}	


					//搜索
                    $scope.moveIcon = true;
                    $scope.riverName = '';
                    $scope.river_type = '';
                    $scope.water_ztree_name = '';
					$scope.find = function() {
                        if (($scope.river_type == '' || $scope.river_type == null) && $scope.riverName == '' && $scope.water_ztree_name == ''){
                            $scope.moveIcon = true;
                        } else if ($scope.riverName || $scope.river_type || $scope.water_ztree_name) {
                            $scope.moveIcon = false;
                        }else {
                            $scope.moveIcon = false;
                        }
                        reGetProducts();
                        $scope.paginationConf.currentPage = 1;
                        $('.page-num').val($scope.paginationConf.currentPage);
                }

					// 表单分页
					var reGetProducts = function() {
						$http({
							url: $localStorage.serviceUrl_watersource +riverUrl + "/findByWaterCodeAndName",
							method: 'GET',
							params: {
                                riverName: $scope.riverName,
                                riverType: $scope.river_Change_id,
                                waterCode: water_ztree_code,
								page: $scope.paginationConf.currentPage,
								size: $scope.paginationConf.itemsPerPage,
								status: -1
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

					// 表单删除
					$scope.moduleDelete = function(id) {
						var layerIndex = layer.confirm('确定删除本条数据吗？', {
							btn: ['确定', '取消']
							// 按钮
						}, function() {
							$http({
								url: $localStorage.serviceUrl_watersource +riverUrl + "/delete",
								method: "delete",
								params: {
									id: id
								}
							}).success(function success(result) {
								if(result.resCode == 0) {
									layer.msg('该河流下存在下级河流或河段，请先删除下级内容！',{time:1000});
								} else {
									layer.msg('删除成功！', {time:1000});
								}
								reGetProducts();
							}, function failure(result) {
								console.log(result);
								layer.alert('api=>err', {
									skin: 'my-skin',
									closeBtn: 0,
									anim: 4
								});
							});
							layer.close(layerIndex);
						}, function() {

						});
					};

					// 河流新增
					$scope.riverAdd = function() {
						routeService.route(506, false);
					}
					// 河流详情
					$scope.riverDetail = function(id) {
						$http({
							url: $localStorage.serviceUrl_watersource +riverUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function success(result) {
							globalParam.setter(result)
							console.log(result);
							console.log(id);
							routeService.route(507, false);
						});
					}

					// 河流编辑
					$scope.riverEdit = function(id) {
						$http({
							url: $localStorage.serviceUrl_watersource +riverUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function success(result) {
							globalParam.setter(result)
							console.log(result);
							console.log(id);
							routeService.route(508, false);
						});
					}
				}
			]);

})(window, angular);