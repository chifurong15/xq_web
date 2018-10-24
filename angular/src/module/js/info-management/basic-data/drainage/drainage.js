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
			'drainageCtrl', [
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
				function drainageCtrl($localStorage, $scope,$location, $log, $q, $rootScope, globalParam,$window,routeService, $http) {
					//测试树 Start
                    var DWRLRTree;
                    var DWRLRTreeUrl = $localStorage.serviceUrl + basicUrl + "/DWRLRTree";
                    var setting = {
                        view:{
                            selectedMulti:true,
                            showLine:true,
                            showIcon:true
                        },
                        data:{
                            simpleData:{enable:true},
                            keep: {parent: true}
//							key: {isParent: "parent"}
                        },
                        callback:{
                            beforeExpand:zTreeOnExpand,
                            onClick:zTreeOnClick
                        }
                    };
                    function zTreeOnExpand(treeId,treeNode){
                        console.log('===========zTreeOnExpand===========')
                        var cnodes = treeNode.children;
                        if (cnodes !=null && cnodes.length > 0){
                            return;
                        }

                        $http({
                            method: "GET",
                            url: DWRLRTreeUrl,
                            params: {
                                code:treeNode.id
                            },
                        }).success(
                            function(res) {
                                console.log(res);
                                DWRLRTree.addNodes(treeNode,res.data,true);
                            }
                        );
                    }
                    $scope.treeList = function(DWRLRTreeUrl){
                        console.log(DWRLRTreeUrl);
                        $http({
                            method: "GET",
                            url: DWRLRTreeUrl,
                            dataType:'json'
                        }).success(
                            function(data) {
                                DWRLRTree = $.fn.zTree.init($("#regionTree_one"), setting, data.data);
                                console.log(DWRLRTree)
                            }
                        ).error(function() {});
                    }
                    var treeNode_find,
                        belongWater,
                        belongWaterCode;
                    function zTreeOnClick(event, treeId, treeNode) {
                        $http({
                        }).success(
                            function(res) {
                                console.log(treeNode.id);
                                console.log(res);
                            }
                        );
                    };
                    //关闭模态框【确定按钮】
                    $scope.modalOk_one = function (){
                        $("#myModal_ztree_one").modal('hide');
                    };

					$scope.show_one = function() {
                        $("#myModal_ztree_one").modal('show');
                        $scope.treeList(DWRLRTreeUrl);
					};

					var DWRLRRTree;
					var DWRLRRTreeUrl = $localStorage.serviceUrl + basicUrl + "/DWRLRRTree";
                    var setting1 = {
                        view:{
                            selectedMulti:true,
                            showLine:true,
                            showIcon:true
                        },
                        data:{
                            simpleData:{enable:true},
                            keep: {parent: true}
//							key: {isParent: "parent"}
                        },
                        callback:{
                            beforeExpand:zTreeOnExpand1,
                            onClick:zTreeOnClick1
                        }
                    };
                    function zTreeOnExpand1(treeId,treeNode){
                        console.log('===========zTreeOnExpand===========')
                        var cnodes = treeNode.children;
                        if (cnodes !=null && cnodes.length > 0){
                            return;
                        }

                        $http({
                            method: "GET",
                            url: DWRLRRTreeUrl,
                            params: {
                                code:treeNode.id
                            },
                        }).success(
                            function(res) {
                                console.log(res);
                                DWRLRRTree.addNodes(treeNode,res.data,true);
                            }
                        );
                    }
                    $scope.treeList1 = function(DWRLRRTreeUrl){
                        console.log(DWRLRRTreeUrl)
                        $http({
                            method: "GET",
                            url: DWRLRTreeUrl,
                            dataType:'json'
                        }).success(
                            function(data) {
                                DWRLRRTree = $.fn.zTree.init($("#regionTree_two"), setting1, data.data);
                                console.log(DWRLRTree)
                            }
                        ).error(function() {});
                    }
                    var treeNode_find,
                        belongWater,
                        belongWaterCode;
                    function zTreeOnClick1(event, treeId, treeNode) {
                        $http({
                        }).success(
                            function(res) {
                                console.log(treeNode.id);
                                console.log(res);
                            }
                        );
                    };
					//测试树 Start
					$scope.show_two = function() {
						$("#myModal_ztree_two").modal('show');
						$scope.treeList1(DWRLRRTreeUrl);

						//关闭模态框【确定按钮】
						$scope.modalOk_two = function (){
							$("#myModal_ztree_two").modal('hide');
						};
					};

                    var DWRTree;
                    var DWRTreeUrl = basicUrl + "/DWRTree";
                    var setting2 = {
                        view:{
                            selectedMulti:true,
                            showLine:true,
                            showIcon:true
                        },
                        data:{
                            simpleData:{enable:true},
                            keep: {parent: true}
//							key: {isParent: "parent"}
                        },
                        callback:{
                            beforeExpand:zTreeOnExpand2,
                            onClick:zTreeOnClick2
                        }
                    };
                    function zTreeOnExpand2(treeId,treeNode){
                        console.log('===========zTreeOnExpand===========')
                        var cnodes = treeNode.children;
                        if (cnodes !=null && cnodes.length > 0){
                            return;
                        }

                        $http({
                            method: "GET",
                            url: DWRTreeUrl,
                            params: {
                                code:treeNode.id
                            },
                        }).success(
                            function(res) {
                                console.log(res);
                                DWRTree.addNodes(treeNode,res.data,true);
                            }
                        );
                    }
                    $scope.treeList2 = function(DWRTreeUrl){
                        console.log(DWRTreeUrl)
                        $http({
                            method: "GET",
                            url: DWRTreeUrl,
                            dataType:'json'
                        }).success(
                            function(data) {
                                DWRTree = $.fn.zTree.init($("#regionTree_three"), setting2, data.data);
                                console.log(DWRTree)
                            }
                        ).error(function() {});
                    }
                    var treeNode_find,
                        belongWater,
                        belongWaterCode;
                    function zTreeOnClick2(event, treeId, treeNode) {
                        $http({
                        }).success(
                            function(res) {
                                console.log(treeNode.id);
                                console.log(res);
                            }
                        );
                    };
					//测试树 Start
					$scope.show_three = function() {
						$("#myModal_ztree_three").modal('show');
							$scope.treeList2(DWRTreeUrl);
						//关闭模态框【确定按钮】
						$scope.modalOk_three = function (){
							$("#myModal_ztree_three").modal('hide');
						};
					};


                    var DWTree;
                    var DWTreeUrl = $localStorage.serviceUrl + basicUrl + "/DWTree";
                    var setting3 = {
                        view:{
                            selectedMulti:true,
                            showLine:true,
                            showIcon:true
                        },
                        data:{
                            simpleData:{enable:true},
                            keep: {parent: true}
//							key: {isParent: "parent"}
                        },
                        callback:{
                            beforeExpand:zTreeOnExpand3,
                            onClick:zTreeOnClick3
                        }
                    };
                    function zTreeOnExpand3(treeId,treeNode){
                        console.log('===========zTreeOnExpand===========')
                        var cnodes = treeNode.children;
                        if (cnodes !=null && cnodes.length > 0){
                            return;
                        }

                        $http({
                            method: "GET",
                            url: DWTreeUrl,
                            params: {
                                code:treeNode.id
                            },
                        }).success(
                            function(res) {
                                console.log(res);
                                DWTree.addNodes(treeNode,res.data,true);
                            }
                        );
                    }
                    $scope.treeList3 = function(DWTreeUrl){
                        console.log(DWTreeUrl)
                        $http({
                            method: "GET",
                            url: DWTreeUrl,
                            dataType:'json'
                        }).success(
                            function(data) {
                                DWTree = $.fn.zTree.init($("#regionTree_four"), setting3, data.data);
                                console.log(DWTree)
                            }
                        ).error(function() {});
                    }
                    var treeNode_find,
                        belongWater,
                        belongWaterCode;
                    function zTreeOnClick3(event, treeId, treeNode) {
                        $http({
                        }).success(
                            function(res) {
                                console.log(treeNode.id);
                                console.log(res);
                            }
                        );
                    };
					//测试树 Start
					$scope.show_four = function() {
						$("#myModal_ztree_four").modal('show');
							$scope.treeList3(DWTreeUrl);
						//关闭模态框【确定按钮】
						$scope.modalOk_four = function (){
							$("#myModal_ztree_four").modal('hide');
						};
					};
					
					//查看详情
					$scope.overView = function(id){
						$("#overViewBox").modal('show');
						$http({
							url: $localStorage.serviceUrl + basicUrl + "/detail",
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
					//上移
					$scope.moveUp = function(id){
						$http({
								url: $localStorage.serviceUrl + basicUrl + "/sortOrder",
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
					
					//下移
					$scope.moveDown = function(id){
						$http({
							url: $localStorage.serviceUrl + basicUrl + "/sortOrder",
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
							url: $localStorage.serviceUrl + basicUrl + "/findByQuery",
							method: 'GET',
							params: {
                                basinName: $scope.basinName,
                                basinCode: $scope.basinCode,
								page: $scope.paginationConf.currentPage,
								size: $scope.paginationConf.itemsPerPage,
								status: -1
							},
						}).success(
							function(resp) {
								console.log(resp);
								console.log($scope.paginationConf.currentPage);
								console.log($scope.paginationConf.itemsPerPage);
								$scope.paginationConf.totalItems = resp.data.total;
								console.log($scope.paginationConf.totalItems);
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
								url: $localStorage.serviceUrl + basicUrl + "/delete",
								method: "delete",
								params: {
									id: id
								}
							}).success(function success(result) {
								if(result.resCode == 0) {
										layer.msg('该流域下存在下级水系，请先删除下级内容！',{time:1000});
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
                    $scope.moveIcon = true;
                    $scope.basinName = '';
					//搜索
					$scope.find = function() {
                        if($scope.basinName ==''){
                            $scope.moveIcon = true;
                        }else{
                            $scope.moveIcon = false;
                        }
                        reGetProducts();
                        $scope.paginationConf.currentPage = 1;
                        $('.page-num').val($scope.paginationConf.currentPage);
					}
					
					
					// 流域新增
					$scope.drainageAdd = function() {
						routeService.route(577, false);
					}
					// 流域详情
					$scope.drainageDetail = function(id) {
						$http({
							url: $localStorage.serviceUrl + basicUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function success(result) {
							globalParam.setter(result)
							console.log(result);
							console.log(id);
							routeService.route(578, false);
						});
					}
					// 流域编辑
					$scope.drainageEdit = function(id) {
						$http({
							url: $localStorage.serviceUrl + basicUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function success(result) {
							globalParam.setter(result)
							console.log(result);
							console.log(id);
							routeService.route(579, false);
						});
						
						
					}
					
					
				}
			]);
})(window, angular);