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
			'reservoirAddCtrl', [
				'$localStorage',
				'$scope',
				'$location',
				'$log',
				'$q',
				'$rootScope',
				'$window',
				'routeService',
				'$http',
				function reservoirAddCtrl($localStorage, $scope,$location, $log, $q, $rootScope, $window,routeService, $http) {
					
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
										areaCode:treeNode_find
									},
								}).success(
									function(res) {
										console.log(res);
										_areaCode = treeNode.name;
										console.log(_areaCode);
										// $scope.region = _areaCode;
										$scope.tree = res.data
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
					
					//水系选择模态框【show】
					var _treeNode_find,
							water_ztree_name,
							water_ztree_code;
					$scope.waterShow = function() {
						var _treeNode_find = treeNode_find;
						console.log(_treeNode_find);
						$("#water_ztree").modal('show');
						//初始化水系树
						$http({
							method: "get",
							url: $localStorage.serviceUrl +waterUrl + "/belongWater",
							params: {
								areaCode:_treeNode_find
							},
						}).success(
							function(res) {
								console.log(_treeNode_find);
								console.log(res);
								var setting1 = {
									enable: true,
									callback: {
										onClick: zTreeOnClick_water
									}
								};
								var zNodes1 = [{
									name: "根节点",
									icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
									open: true,
									children: res.data
								}];
								$.fn.zTree.init($("#waterZtree"), setting1, zNodes1);
								$scope.tree = res.data
							}
						);
						
						//树节点点击问题
						function zTreeOnClick_water(event, treeId, treeNode) {
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
										water_ztree_name = res.data.waterName;
										water_ztree_code = res.data.waterCode;
										console.log(water_ztree_code);

										console.log($scope.water_ztree);
									}else{
										$scope.water_ztree= '';
									}
								}
							);
						};
						//水系模态框搜索框
						$scope.select_water = function() {
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
											onClick: zTreeOnClick_water
										}
									};
									var zNodes1 = [{
										name: "根节点",
										icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
										open: true,
										children: res.data
									}];
									$.fn.zTree.init($("#waterZtree"), setting1, zNodes1);
									$scope.tree = res.data
								}
							);
						};
						//关闭模态框【确定按钮】
						$scope.water_modalOk = function (){
							$("#water_ztree").modal('hide');
                            $scope.water_ztree = water_ztree_name;
						};
					};
					
					//水库类型
					$scope.reservoirType = function() {
						$http({
							method: "get",
							url: $localStorage.serviceUrl +dictionaryUrl + "/findDictionary",
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
                            $scope.reservoir_Change_dictValue = null;
                        } else {

                            $scope.reservoir_Change_name = reservoir_type.dictName;
                            $scope.reservoir_Change_id = reservoir_type.id;
                            $scope.reservoir_Change_dictValue = reservoir_type.dictValue;
                            console.log($scope.reservoir_Change_dictValue);
                            console.log($scope.reservoir_Change_name);
                            console.log($scope.reservoir_Change_id);
                        }
					}
					
					
					//水库岸别
					$scope.watershoreType = function() {
						$http({
							method: "get",
							url: $localStorage.serviceUrl +dictionaryUrl + "/findDictionary",
							params: {
								type: 3
							},
						}).success(
							function(res) {
								console.log(res);
								$scope.watershoreTypes = res.data;
								console.log($scope.watershoreTypes);
							}
						);
					}
					$scope.watershore_Change = function(watershore_type) {
					    if (watershore_type == null){
                            $scope.watershore_Change_name = null;
                            $scope.watershore_Change_id = null;
                            $scope.watershore_Change_dictValue = null;
                        } else {

                            $scope.watershore_Change_name = watershore_type.dictName;
                            $scope.watershore_Change_id = watershore_type.id;
                            $scope.watershore_Change_dictValue = watershore_type.dictValue;
                            console.log($scope.watershore_Change_dictValue);
                            console.log($scope.watershore_Change_name);
                            console.log($scope.watershore_Change_id);
                        }
					}
					
					
					//新增
					var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
                    var len =/^\d+$/;
					$scope.submit = function() {
						//取得纯文本
						var data = CKEDITOR.instances.editor.getData();
						console.log(data);
						if(!$scope.reservoirName || !jsname.test($scope.reservoirName) == null) {
							layer.alert("请完善水库名称", {
								skin: 'my-skin',
								closeBtn: 1,
								anim: 3
							});
						} else if (!$scope.region){
                            layer.alert("请完善所属区域", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.water_ztree){
                            layer.alert("请完善所属水系", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.reservoir_type){
                            layer.alert("请完善水库类型", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.watershore_type){
                            layer.alert("请完善水库岸别", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if ($scope.acreage == null || $scope.acreage === '' || eval($scope.acreage)<=0 ||!len.test($scope.acreage)){
                            layer.alert("水库面积请输入正数", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.management_unit){
                            layer.alert("请完善管理单位", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else {
							$http({
								method: "post",
								url: $localStorage.serviceUrl +reservoirUrl + "/add",
								params: {
									reservoirName:$scope.reservoirName,
									regionCode:treeNode_find,
									waterCode:water_ztree_code,
									reservoirType:$scope.reservoir_Change_dictValue,
									reservoirBank:$scope.watershore_Change_dictValue,
									acreage:$scope.acreage,
									managementUnit:$scope.management_unit,
									startPointLongitude:$scope.startPoint,
									endPointLongitude:$scope.endPoint,
									overView:data,
									remark:$scope.remark
								},
							}).success(
								function(res) {
                                    if(res.resCode === 1){
                                        layer.msg('创建成功', {time:2000});
                                        clear();//创建成功后清空
                                    }else {
                                        layer.msg(res.resMsg, {time:2000});
                                        clear();
                                    }
								}
							);
						}
					};

                    //判断名称是否重复
                    $scope.isRepeat = function(){
                        $http({
                            method:'get',
                            url:$localStorage.serviceUrl +reservoirUrl + "/isRepeat",
                            params:{
                                name:$scope.reservoirName
                            }
                        }).success(
                            function (res) {
                                if (res.resCode === 0){
                                    layer.msg('水库名称重复',{time:2000});
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
						$scope.reservoirName='';
						$scope.region='';
						$scope.water_ztree='';
						$scope.reservoir_type='';
						$scope.watershore_type='';
						$scope.acreage='';
						$scope.management_unit='';
						$scope.startPoint='';
						$scope.endPoint='';
						$scope.overView='';
						$scope.remark='';
						CKEDITOR.instances.editor.setData(" ");
					}	
						
					// 返回按钮
					$scope.back = function() {
						routeService.route(536, true);
					}
				}
			]);
})(window, angular);