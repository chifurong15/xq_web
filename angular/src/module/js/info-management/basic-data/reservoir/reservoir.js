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
			'reservoirCtrl', [
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
				function reservoirCtrl($localStorage, $scope,$location, $log, $q, $rootScope,globalParam, $window,routeService, $http) {
					//所属区域树模态框【show】
					$scope.regionShow = function(){
						$scope.areaName = '';
						$("#region_ztree").modal('show');
                        $scope.treeList_region(regionTreeUrl);
					};

					//所属区域树节点点击
					var treeNode_find,
						_areaCode;
					function zTreeOnClick(event, treeId, treeNode) {
						$http({
							method: "GET",
							url: $localStorage.serviceUrl +basicUrl + "/findByAreaCode",
							params: {
								areaCode: treeNode.id,
							},
						}).success(
							function(res) {
								console.log(res);
								treeNode_find = treeNode.id,
								console.log(treeNode_find );
								$http({
									method: "get",
									url: regionTreeUrl,
									params: {
										parentCode:treeNode_find
									},
								}).success(
									function(res) {
										console.log(res);
										_areaCode = treeNode.name;
										console.log(_areaCode);

									}
								);
								
							}
						);
					};

                    var regionTree;
                    var regionTreeUrl = $localStorage.serviceUrl +basicUrl + "/tree";
                    var setting = {
                        view: {
                            selectedMulti: true,
                            showLine: true,
                            showIcon: true
                        },
                        data: {
                            simpleData: {enable: true},
                            keep: {parent: true}
                        },
                        callback: {
                            beforeExpand: zTreeOnExpand,
                            onClick: zTreeOnClick
                        }
                    };

                    function zTreeOnExpand(treeId, treeNode) {
                        console.log('===========zTreeOnExpand===========')
                        var cnodes = treeNode.children;
                        if (cnodes !=null && cnodes.length > 0){
                            return;
                        }
                        $http({
                            method: "GET",
                            url: regionTreeUrl,
                            params: {
                                parentCode: treeNode.id,
                            }
                        }).success(
                            function (res) {
                                regionTree.addNodes(treeNode, res.data, true);
                            }
                        );
                    }
					//生成区域树
					$scope.treeList_region = function(regionTreeUrl) {
                        console.log(regionTreeUrl);
                        $http({
                            method: "GET",
                            url: regionTreeUrl,
                            dataType: 'json'
                        }).success(
                            function (data) {
                                console.log(data.data)
                                regionTree = $.fn.zTree.init($("#regionTree"), setting, data.data);
                                console.log(regionTree)
                            }
                        ).error(function () {
                        });
					};
					//区域模态框搜索框
					$scope.select_region = function() {
						if($scope.areaName == null || $scope.areaName == ''){
							$scope.treeList_region(regionTreeUrl);
						}else{
							$http({
								method: "GET",
								url: $localStorage.serviceUrl +basicUrl + "/fingByRegionName",
								params: {
									regionName: $scope.areaName
								},
							}).success(
								function(res) {
									console.log(res);
									regionTree = $.fn.zTree.init($("#regionTree"), setting, res.data);
									$scope.tree = res.data
								}
							);
						}
							
					};
					//关闭所属区域模态框【确定按钮】
					$scope.region_modalOk = function (){
						$("#region_ztree").modal('hide');
                        $scope.region = _areaCode;
					};
					
					//水库类型
					$scope.reservoirType = function() {
						$http({
							method: "get",
							url: $localStorage.serviceUrl + dictionaryUrl + "/findDictionary",
							params: {
								type:11
							},
						}).success(
							function(res) {
								console.log(res);
								$scope.reservoirTypes = res.data;
								console.log($scope.reservoirTypes);
							}
						);
					}
					$scope.reservoir_Change = function(reservoir_type) {
					    if (reservoir_type == null){
                            $scope.reservoir_Change_name = null;
                            $scope.reservoir_Change_id = null;
                        } else {
                            $scope.reservoir_Change_name = reservoir_type.dictName;
                            $scope.reservoir_Change_id = reservoir_type.dictValue;
                            console.log($scope.reservoir_Change_name);
                            console.log($scope.reservoir_Change_id);
                        }
					}
					
					//查看详情
					$scope.overView = function(id){
						$("#overViewBox").modal('show');
						$http({
							url: $localStorage.serviceUrl +reservoirUrl + "/detail",
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
							url: $localStorage.serviceUrl +reservoirUrl + "/sortOrder",
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
							url: $localStorage.serviceUrl +reservoirUrl + "/sortOrder",
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
					
					
					// 表单分页
					var reGetProducts = function() {
						$http({
							url: $localStorage.serviceUrl +reservoirUrl + "/findByNameAndTypeAndRegion",
							method: 'GET',
							params: {
								page: $scope.paginationConf.currentPage,
								size: $scope.paginationConf.itemsPerPage,
                                reservoirName: $scope.reservoir_name,
                                reservoirType: $scope.reservoir_Change_id,
                                regionCode: treeNode_find

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
					
					//搜索
                    $scope.moveIcon = true;
                    $scope.reservoir_name = '';
                    $scope.reservoir_type = '';
                    $scope.region = '';
					$scope.find = function() {
                        if (($scope.reservoir_type =='' || $scope.reservoir_type == null) && $scope.reservoir_name =='' && $scope.region =='') {
                            $scope.moveIcon = true;
                        }else if ($scope.reservoir_name || $scope.reservoir_type || $scope.region) {
                            $scope.moveIcon = false;
                        }else {
                            $scope.moveIcon = false;
                        }
                        reGetProducts();
                        $scope.paginationConf.currentPage = 1;
                        $('.page-num').val($scope.paginationConf.currentPage);
					}
					
					// 表单删除
					$scope.moduleDelete = function(id) {
						var layerIndex = layer.confirm('确定删除本条数据吗？', {
							btn: ['确定', '取消']
							// 按钮
						}, function() {
							$http({
								url: $localStorage.serviceUrl +reservoirUrl + "/delete",
								method: "delete",
								params: {
									id: id
								}
							}).success(function success(result) {
								if(result.resCode == 0) {
									layer.msg('该水库下存在下级内容，请先删除下级内容！',{time:1000});
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
					
					// 水库新增
					$scope.reservoirAdd = function() {
						routeService.route(586, false);
					}
					// 水库详情
					$scope.reservoirDetail = function(id) {
						$http({
							url: $localStorage.serviceUrl +reservoirUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function success(result) {
							globalParam.setter(result)
							console.log(result);
							console.log(id);
							routeService.route(587, false);
						});
					}
					// 水库编辑
					$scope.reservoirEdit = function(id) {
						$http({
							url: $localStorage.serviceUrl +reservoirUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function success(result) {
							globalParam.setter(result)
							console.log(result);
							console.log(id);
							routeService.route(588, false);
						});
					}
				}
			]);
})(window, angular);